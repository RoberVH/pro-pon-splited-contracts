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

    // A company must pay to get recorder into system
    uint256 public CREATE_COMPANY_PRICE= 0.0001 ether;

    // A company creating an RFP pays for publishing it and for uploading its files
    uint256 public CREATE_OPEN_RFP_PRICE= 0.0001 ether;

    // A company creating an Invitation RFP pays for publishing it for uploading its files and 
    // for  guests companies to upload their files (there is a limit on invited companies allowed)
    uint256 public CREATE_INVITATION_RFP_PRICE= 0.0002 ether;

    // A company registering to participate in an RFP pays for that and  for uploading its  files 
    uint256 public REGISTER_OPEN_RFP_PRICE = 0.0001 ether; // how much a company must pay to get into an Open RFP

    // a limit on how many companies can register to an Open Contest
    uint public MAX_GUEST_OPEN_TENDER = 10; // set to 5 for contract unit testing, 25 for broser access/production

    // a limit on how many companies can a company registering an Invitation Contest can register 
    uint public MAX_GUEST_INVITATION_TENDER = 10; // set to 5 for contract unit testing, 25 for broser access/production

    uint private currentRFPIdx=0;  // global that keeps track of all RFPs issued by all companies


/* ContestType - Enumeration of type of RFP
            Open allow any company to participate, it will have a owner define participants limit
*/
  //  enum  ContestType{ OPEN, INVITATION_ONLY }   

/* DocType Enumeration defining type of documents associated with RFP
*/
    //  enum DocType {
    //     documentRequestType,            // RFP doc  from Owner
    //     documentQandAType,              // Clarification Questions and answers from Owner
    //     documentAmendment,               // Contract, adenda, guaranties etc documents created between owner and winners 
    //     documentProposalType,           // Technical offering, RFPs answers from participant
    //     documentPricingOfferingType,    // Economic Proposal from participant
    //     documentLegalType,              // Legal documents from participants
    //     documentFinancialType,          // Financial statements and documents from participants
    //     documentAdministrativeType,     // Administrative documents from participants
    //     // Documents post RFP. These are for future versions where follow up of RFP Documents like contracts
    //     // Project progress reports, informs etc
    //     documentContract,               // Contract documents
    //     documentAnnex,                  // Annexes document to contracts
    //     documentPProgress               // Status and progress reports
    // }
 
    // // Company. Records all companies in Pro-pon contract
    // struct Company {
    //     string id;
    //     string name;
    //     string country;     // 3-code int'l country code
    //     uint16 RFPSent;       // How many RFP the company has partipated as invited / self-registered
    //     uint[] RFPsWins;     // Global Ids of RFPs this company has won or won one or more items from   
    //     uint[] company_RFPs;     // array of RFPs issued by this company
    // }

    // // RFP. Record of RFP contests issued by companies in Pro-pon contract
    // struct RFP {
    //     string name;            // In UI/UX  is the ID of the RFP
    //     string description;     // In UI/UX  is the name of the RFP
    //     uint rfpIndex;            // Global Id for this RFP  (in RFPs array)
    //     string rfpwebsite;      // Company web page for the RFP
    //     uint openDate;          // date when start receiving proposals
    //     uint endReceivingDate;  // date when finish  receiving proposals
    //     uint endDate;           // date when password of proposals is released
    //     bool canceled;          // the contest was called off, no proposal was satisfactory
    //     uint cancelDate;        // Date the contest was canceled
    //     address[] participants;  // Keep tracks of invited/participant companies to this RFP, store companies ID
    //     proponShared.ContestType contestType;
    //     string[] items;         // Optional, the name of different requesting groups of items asked for
    //                             // each item can have a different winner
    //     address[] winners;       // address of winner of each item (if no Items RFP winner is in winner[0])
    //     address issuer;          // Reference back to company issuing this RFP
    // }

    // // Documents. Record of RFP Proposal Documents metadata 
    // struct Document {
    //     uint docType;            // 0 is a requesting RFP Doc/  1 is a Response RFP Doc
    //     string name;
    //     address owner;             // of the document
    //     string documentHash;   // act as unique id
    //     string idx;            // Id storage on arweave (https://arweave.net/{idx})
    // }

    // Companies in the system. Address of admin of company. User can't loose this address because company data would be lost
    mapping(address => Company)  Companies;  

    // Hold a map from ids to companies to easliy check uniqueness of company ID
    mapping( string => bool) CompanyidTaken;    // It would be set to true for Company Id string if exists

    // All RFPs in the system, they map from an index given by currentRFPIdx
    mapping(uint => RFP) public RFPs;  

    // RFPDocuments  maps an RFP index to a Document 
    mapping(uint => Document[])  RFPDocuments;  

    // event to send when a company has been created
    // event NewCompanyCreated(address indexed sender, string id, string name);

//    // event to send when an RFP has been created
//     event NewRFPCreated(address indexed sender, uint id, string name);
   


    // Record of used RFP Id by an address issuer of RFP, to guarantee uniqueness of RFP ID by Accounts RFP's Issuers
    mapping (bytes32 => bool) RfpIds;   
    
    // Modifiers ***************************************************************
    // only owner can do administrative task as withdrawing
    modifier onlyOwner() {
        require(msg.sender == owner, 'Only_owner_allowed');
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // getters/setters

    //**********************Setters ***************************************** */




    // Variables of capacity and price
    function setOwner(address _newOwner) external onlyOwner {
        owner=_newOwner;
    }

    function setCREATE_COMPANY_PRICE(uint256 _value) external onlyOwner {
        CREATE_COMPANY_PRICE = _value;
    }

    function setCREATE_OPEN_RFP_PRICE(uint256 _value) external onlyOwner {
        CREATE_OPEN_RFP_PRICE = _value;
    }

    function setCREATE_INVITATION_RFP_PRICE(uint256 _value) external onlyOwner {
        CREATE_INVITATION_RFP_PRICE = _value;
    }

    function setREGISTER_OPEN_RFP_PRICE(uint256 _value) external onlyOwner {
        REGISTER_OPEN_RFP_PRICE = _value;
    }

    function setMAX_GUEST_OPEN_TENDER(uint _value) external onlyOwner {
        MAX_GUEST_OPEN_TENDER = _value;
    }

    function setMAX_GUEST_INVITATION_TENDER(uint _value) external onlyOwner {
        MAX_GUEST_INVITATION_TENDER = _value;
    }

    function setCurrentRFPIdx(uint _value) external onlyOwner {
        currentRFPIdx = _value;
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

    function setRfpId(bytes32 pair) external onlyOwner {
        RfpIds[pair] = true;
    }

    function setRFP(uint256 rfpIdx, RFP memory rfp) external onlyOwner {
        RFPs[rfpIdx] = rfp;
    }

    // other modifying entitiies functions
    
    function addCompanyRFP(address companyAddress, uint256 rfpIdx) external onlyOwner {
     Companies[companyAddress].company_RFPs.push(rfpIdx);
    }

    function addParticipantToRFP(uint256 rfpId, address participant) external onlyOwner {
        RFPs[rfpId].participants.push(participant);
    }


    function incrementRFPIdx() external onlyOwner {
        currentRFPIdx += 1;
    }



    //**************************Getters ******************************** */

    // pointer in structures for adding RFPs, it increases for each RFP added
    function getcurrentRFPIdx() external view returns(uint) {
        return (currentRFPIdx);
    }

    // returns current address owner
    function getOwner() external view returns (address ) {
        return owner;
    }

    // Company Getters  ----------------------------------------

    // returns current id of company ofr companyAddress owner
    function getCompanyId(address companyAddress) external view returns (string memory) {
        return Companies[companyAddress].id;
    }

    // returns whole  company record for adminaddress 
    function getCompany(address adminaddress) external view  returns ( Company memory ) {
        return  Companies[adminaddress];
    }

    // returns creation company price
    function getCreateCompanyPrice() external view returns (uint256) {
        return CREATE_COMPANY_PRICE;
    }

    function isCompanyIdTaken(string calldata _id) external view returns (bool) {
        return CompanyidTaken[_id];
    }

    //   RFP Getters  ----------------------------------------

    // returns the RFP whole record on mapping _rfpIdx index
    function getRFP(uint256 rfpId) public view returns (RFP memory) {
        return RFPs[rfpId];
    }    

    // returns current issuer address of rfpIdx RFP
    function getRFPIssuer(uint rfpIdx) external view returns (address) {
        return RFPs[rfpIdx].issuer;
    }

    // returns current status of rfpIdx RFP
    function isRFPCanceled(uint rfpIdx) external view returns (bool) {
    return RFPs[rfpIdx].canceled;
}

    function getRfpIds(bytes32 pair) external view returns (bool) {
        return RfpIds[pair];
    }

    
}


