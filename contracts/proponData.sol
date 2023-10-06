//SPDX-License-Identifier: MIT
/**
 * pro-pon   -
 *               Solidity Contract for Pro-pon application
 *               July/2022
 *               Author: Roberto Vicuña
 */
pragma solidity ^0.8.9;

import "./proponShared.sol";

//import "hardhat/console.sol";

// Pro-pon Data contract. Keeps track of companies and RFP contests
contract pro_ponData is proponShared {
    //Owner authorized to make changes to data
    address private owner;

    // Manager authorized to set constants values and detroy contract
    address private manager;

    // A company must pay to get recorder into system
    uint256 public CREATE_COMPANY_PRICE = 0.0001 ether;

    // A company creating an RFP pays for publishing it and for uploading its files
    uint256 public CREATE_OPEN_RFP_PRICE = 0.0001 ether;

    // A company creating an Invitation RFP pays for publishing it for uploading its files and
    // for  guests companies to upload their files (there is a limit on invited companies allowed)
    uint256 public CREATE_INVITATION_RFP_PRICE = 0.0002 ether;

    // A company registering to participate in an RFP pays for that and  for uploading its  files
    uint256 public REGISTER_OPEN_RFP_PRICE = 0.0001 ether; // how much a company must pay to get into an Open RFP

    // a limit on how many companies can register to an Open Contest
    uint public MAX_GUEST_OPEN_TENDER = 10; // set to 5 for contract unit testing, 25 for broser access/production

    // a limit on how many companies can a company registering an Invitation Contest can register
    uint public MAX_GUEST_INVITATION_TENDER = 10; // set to 5 for contract unit testing, 25 for broser access/production

    uint16 private currentRFPIdx = 0; // global that keeps track of all RFPs issued by all companies a limit of 65,535 RFPs exists

    // Companies in the system. Address of admin of company. User can't loose this address because company data would be lost
    mapping(address => Company) Companies;

    // Hold a map from ids to companies to easliy check uniqueness of company ID
    mapping(string => bool) CompanyidTaken; // It would be set to true for Company Id string if exists

    // All RFPs in the system, they map from an index given by currentRFPIdx
    mapping(uint16 => RFP) public RFPs;

    // RFPDocuments  maps an RFP index to a Document
    mapping(uint16 => Document[]) RFPDocuments;

    // Record of used RFP Id by an address issuer of RFP, to guarantee uniqueness of RFP ID by Accounts RFP's Issuers
    mapping(bytes32 => bool) RfpIds;

    // Modifiers ***************************************************************
    // only owner can do data related tasks: Setting Companies, RFPs and Documents
    // is set to proponLogic contract that controls writing data
    modifier onlyOwner() {
        require(msg.sender == owner, "only_owner_allowed");
        _;
    }

// only owner can do administrative tasks: Setting Prices, setting owner and destroy contract
// is set to the external account that controls the contract
    modifier onlyManager() {
        require(msg.sender == manager, "only_manager_allowed");
        _;
    }

    constructor() {
        owner = msg.sender;
        manager = msg.sender;
    }

    // getters/setters

    //**********************Setters ***************************************** */

    function setOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    function setManager(address _newManager) external onlyManager {
        manager = _newManager;
    }

    // Variables of capacity and price

    function setCreateCompanyPrice(uint256 _value) external onlyManager {
        CREATE_COMPANY_PRICE = _value;
    }

    function setCreateOpenRfpPrice(uint256 _value) external onlyManager {
        CREATE_OPEN_RFP_PRICE = _value;
    }

    function setCreateInvitationRfpPrice(uint256 _value) external onlyManager {
        CREATE_INVITATION_RFP_PRICE = _value;
    }

    function setRegisterOpenRfpPrice(uint256 _value) external onlyManager {
        REGISTER_OPEN_RFP_PRICE = _value;
    }

    function setMaxGuestOpenTender(uint _value) external onlyManager {
        MAX_GUEST_OPEN_TENDER = _value;
    }

    function setMaxGuestInvitationTender(uint _value) external onlyManager {
        MAX_GUEST_INVITATION_TENDER = _value;
    }

    // Entities setters **********************
    function setCompany(
        address companyAddress,
        string memory _id,
        string memory _name,
        string memory _country
    ) external onlyOwner {
        Company storage company = Companies[companyAddress];
        company.id = _id;
        company.name = _name;
        company.country = _country;

        // also update the CompanyidTaken mapping
        CompanyidTaken[_id] = true;
    }

    // T he  pair parameter is a yixtaposition of company admin address and RFP id
    //  and looks to prevent a company to use  the same RFP ID twice
    function setRfpId(bytes32 pair) external onlyOwner {
        RfpIds[pair] = true;
    }

    function setRFP(uint16 rfpIdx, RFP memory rfp) external onlyOwner {
        RFPs[rfpIdx] = rfp;
    }

    // other modifying entitiies functions

    function incrementRFPIdx() external onlyOwner {
        currentRFPIdx += 1;
    }

    function addCompanyRFP(
        address companyAddress,
        uint16 rfpIdx
    ) external onlyOwner {
        Companies[companyAddress].company_RFPs.push(rfpIdx);
    }

    function addParticipantToRFP(
        uint16 rfpId,
        address participant
    ) external onlyOwner {
        RFPs[rfpId].participants.push(participant);
    }

    function setRFPCanceled(uint16 _rfpIndex, bool _canceled) external {
        RFPs[_rfpIndex].canceled = _canceled;
    }

    function setRFPCancelDate(uint16 _rfpIndex, uint256 _cancelDate) external {
        RFPs[_rfpIndex].cancelDate = _cancelDate;
    }

    function addDocument(
        uint16 _rfpIdx,
        uint _docType,
        string memory _name,
        address _owner,
        string memory _documentHash,
        string memory _idx
    ) external onlyOwner {
        Document memory newDocument = Document(
            _docType,
            _name,
            _owner,
            _documentHash,
            _idx
        );
        RFPDocuments[_rfpIdx].push(newDocument);
    }

    function addWinnersToRFP(
        uint16 _rfpIndex,
        address[] memory winners
    ) external onlyOwner {
        RFPs[_rfpIndex].winners = winners;
    }

    function addCompanyParticipationinRFP(
        uint16 _rfpIndex,
        address company
    ) external onlyOwner {
        Companies[company].RFPParticipations.push(_rfpIndex);
    }

    function acrueWinsToCompany(
        uint16 _rfpIndex,
        address[] memory winners
    ) external onlyOwner {
        uint numberOfWinners = winners.length;
        for (uint i = 0; i < numberOfWinners; i++) {
            Companies[winners[i]].RFPsWins.push(_rfpIndex);
        }
    }



    //**************************Getters ******************************** */

    // pointer in structures for adding RFPs, it increases for each RFP added
    function getcurrentRFPIdx() external view returns (uint16) {
        return (currentRFPIdx);
    }

    // returns current address owner
    function getOwner() external view returns (address) {
        return owner;
    }

    // returns current address manager
    function getManager() external view returns (address) {
        return manager;
    }

    function getCancelDate(uint16 _rfpIndex) public view returns (uint) {
        return RFPs[_rfpIndex].cancelDate;
    }

    // Company Getters  ----------------------------------------

    // returns current id of company for companyAddress owner
    function getCompanyId(
        address companyAddress
    ) external view returns (string memory) {
        return Companies[companyAddress].id;
    }

    // returns whole  company record for admin address
    function getCompany(
        address adminaddress
    ) external view returns (Company memory) {
        return Companies[adminaddress];
    }

    // returns creation company price
    function getCreateCompanyPrice() external view returns (uint256) {
        return CREATE_COMPANY_PRICE;
    }

    function isCompanyIdTaken(
        string calldata _id
    ) external view returns (bool) {
        return CompanyidTaken[_id];
    }

    function getWinners(
        uint16 _rfpIndex
    ) public view returns (address[] memory) {
        return RFPs[_rfpIndex].winners;
    }

    function getCompanyWins() public view returns (uint16[] memory) {
        return Companies[msg.sender].RFPsWins;
    }

    function getCompanyRFPs(
        address account
    ) public view returns (uint16[] memory) {
        return Companies[account].company_RFPs;
    }

    //   RFP Getters  ----------------------------------------

    // getRFPbyIndex receive an index and returns the RFP if exists
    function getRFPbyIndex(uint16 _rfpId) public view returns (RFP memory) {
        return RFPs[_rfpId];
    }

    // returns current issuer address of rfpIdx RFP
    function getRFPIssuer(uint16 rfpIdx) external view returns (address) {
        return RFPs[rfpIdx].issuer;
    }

    // returns current status of rfpIdx RFP
    function isRFPCanceled(uint16 rfpIdx) external view returns (bool) {
        return RFPs[rfpIdx].canceled;
    }

    // get the boolean value telling if combination of address and rfp id has been used
    function getRfpIds(bytes32 pair) external view returns (bool) {
        return RfpIds[pair];
    }

    // Document Getters
    function getDocumentsfromRFP(
        uint16 _rfpIdx
    ) external view returns (Document[] memory) {
        return (RFPDocuments[_rfpIdx]);
    }

    // final device to kill contract - escape function for live testing, any funds go to owner contract
    function destroy() public onlyManager {
        selfdestruct(payable(owner));
    }
}
