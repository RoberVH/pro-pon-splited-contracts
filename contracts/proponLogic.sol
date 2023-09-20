//SPDX-License-Identifier: MIT
/**
 * pro-pon   -
 *               Solidity Contract for Pro-pon application
 *               July/2022
 *               Author: Roberto Vicuña
 */
pragma solidity ^0.8.9;

import "./proponData.sol";
import "./proponShared.sol";

//import "hardhat/console.sol";

// Pro-pon Logic contract. Validates access and modify data on pro_ponData contract Data structures
contract pro_ponLogic is proponShared {
    pro_ponData dataContract; // pro_ponData.sol is the Contract that holds all Pro-pon data, constants, structs, vars
    address private owner;

    // state vars to hold temporary values in functions
    mapping(address => bool) uniqueAddress;
    address[] emptyAddressArray = new address[](0);
    address[] uniqueWinners = new address[](0);

    constructor(address _dataContractAddress) payable {
        dataContract = pro_ponData(_dataContractAddress);
        owner = payable(msg.sender);
    }

    // Events

    // event to send when an RFP has been created
    event NewRFPCreated(address indexed sender, uint16 id, string name);

    // Modifiers ***************************************************************
    // only owner can do administrative task as withdrawing
    modifier onlyOwner() {
        require(msg.sender == owner, "Only_owner_allowed");
        _;
    }

    // only admin of  company can do task on its company (with companyId)
    // it checks that the registered Id of sender is actually the one sended in the params
    // i.e. a company can't pretend to be another company
    modifier onlyCompanyAdmin(string memory companyId) {
        require(
            equals(dataContract.getCompanyId(msg.sender), companyId),
            "Only_admin_can_perform"
        );
        _;
    }

    // only issuer of Invitation RFP can perfrom
    // validates the RFP was actually issued by whomever sender is trying to modify RFP
    modifier onlyIssuer(uint16 rfpIdx) {
        require(
            dataContract.getRFPIssuer(rfpIdx) == msg.sender,
            "Only_issuer_can_perform"
        );
        _;
    }

    modifier rfpCancelled(uint16 rfpIdx) {
        require(!dataContract.isRFPCanceled(rfpIdx), "already_canceled");
        _;
    }

    // retire funds to owner account
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "failed_withdraw");
    }

    // Getter/setters ***************************************************************

    // Variables of capacity and price
    function setOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    // utility functions ***************************************************************
    function equals(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return
                keccak256(abi.encodePacked(a)) ==
                keccak256(abi.encodePacked(b));
        }
    }

    // concatStringAndAddress
    //        - Concatenate a string and an address, hash the concatenated result and create a mapping to a bool
    function concatStringAndAddress(
        string memory _string,
        address _address
    ) private pure returns (bytes32) {
        bytes32 stringhashed = keccak256(bytes(_string));
        bytes memory concatString = abi.encodePacked(stringhashed, _address);
        bytes32 hash = keccak256(concatString);
        return hash;
    }

    // winnerIsParticipatingorZero
    //       check if the passed address is also present in array targetAddreses
    //       A 0 address is also checked as this is considered a 'deserted' item
    function winnerIsParticipatingorZero(
        address addresstoCheck,
        address[] memory targetAddresses
    ) private pure returns (bool) {
        if (targetAddresses.length == 0) {
            // there is not participants, onvly valid winner is address(0) (this is: deserted)
            return (addresstoCheck == address(0));
        }
        for (uint i = 0; i < targetAddresses.length; i++)
            if (
                addresstoCheck == targetAddresses[i] ||
                addresstoCheck == address(0)
            ) return true; // account for deserted Items
        return false;
    }

    // Company functions ************************************************************
    function createCompany(
        string memory _id,
        string memory _name,
        string memory _country
    ) public payable {
        // check the ID  is not taken yet
        require(!dataContract.isCompanyIdTaken(_id), "id_already_exists");
        // check there is payment on tx
        require(
            msg.value >= dataContract.CREATE_COMPANY_PRICE(),
            "Insufficient_payment"
        );
        // check this address has not been used before (ony one address is admin of company)
        bytes memory checkId = bytes(dataContract.getCompanyId(msg.sender)); // Uses memory
        require(checkId.length == 0, "address_already_admin_of_company");
        //all ok, proceed to add company data
        dataContract.setCompany(msg.sender, _id, _name, _country);
    }

    // RFP  functions *****************************************************************

    //      The sender creates an RFP. A record RFP is create and mapped from the current RFPIndex (currentRFPIdx)
    //      to the new record and the index is added to company array or RFPs
    //      Validates date is not older than today minus 1 hour to accmodate UX/UI delays to send the data
    //      Validates dates correct sequence
    //      It contains all data in the mirror DataBase except the autogenerated _id MongoDb Id record
    function createRFP(
        string memory _name,
        string memory _description,
        string memory _rfpwebsite,
        uint _openDate,
        uint _endReceivingDate,
        uint _endDate,
        proponShared.ContestType _contestType,
        string[] memory _items
    ) public payable {
        // check this RFP ID is unique for this address, revert if found an equal Id
        bytes32 pair = concatStringAndAddress(_name, msg.sender);
        require(!dataContract.getRfpIds(pair), "rfpid_already_taken");
        // check TX is sufficiently funded
        require(
            msg.value >=
                (
                    _contestType == proponShared.ContestType.OPEN
                        ? dataContract.CREATE_OPEN_RFP_PRICE()
                        : dataContract.CREATE_INVITATION_RFP_PRICE()
                ),
            "Insufficient_payment"
        );
        // verify this address is from a compay admin retrieving his company record
        proponShared.Company memory company = dataContract.getCompany(
            msg.sender
        );
        bytes memory chekString = bytes(company.id);
        require(bytes(chekString).length != 0, "address_not_admin"); // this address is not admin
        // Next sentence that was disable for developing and testing is
        require(_openDate >= (block.timestamp - 3600), "opendate_behind_today"); // allow one hour behind!
        require(_openDate < _endReceivingDate, "initial_date_wrong");
        require(_endReceivingDate < _endDate, "receiving_date_wrong");
        uint16 currRFPIdx = dataContract.getcurrentRFPIdx();
        RFP memory newRFP = RFP(
            _name, // in UI/UX is the Id of RFP
            _description, // in UI/UX is the name of RFP
            currRFPIdx, // RFP's Global Index
            _rfpwebsite,
            _openDate,
            _endReceivingDate,
            _endDate,
            false,
            0,
            new address[](0),
            _contestType,
            _items,
            new address[](0),
            msg.sender
        );
        dataContract.setRfpId(pair); // Assume this setter exists, it sets RfpIds[pair] to true
        dataContract.setRFP(currRFPIdx, newRFP); // Assume this setter exists
        dataContract.addCompanyRFP(msg.sender, currRFPIdx); // Assume this setter exists
        dataContract.incrementRFPIdx();
        emit NewRFPCreated(msg.sender, currRFPIdx, _name);
    }

    /**
     * inviteCompaniestoRFP add companies Id to invited array of the  RFP (onlyRFPOwner)
     *  _rfpId - ID of RFP on RFPs
     *  companyId - Id of company owner of RFP
     *  invitedCompanies - Addresses of admin of invited Company
     *  only register if company is not already in RFP or is the owner, silently ignore such companies addresses
     */
    function inviteCompaniestoRFP(
        uint16 _rfpId, // index in All RFP array RFPs
        string memory companyId, // id of company owner of RFP
        address[] memory invitedCompanies
    )
        public
        onlyCompanyAdmin(companyId)
        onlyIssuer(_rfpId)
        rfpCancelled(_rfpId)
    {
        RFP memory rfp = dataContract.getRFPbyIndex(_rfpId);
        require(
            rfp.contestType == ContestType.INVITATION_ONLY,
            "wrong_contest_type"
        );
        require(
            rfp.endReceivingDate > block.timestamp,
            "end_receiving_reached"
        );
        require(
            (rfp.participants.length + invitedCompanies.length) <=
                dataContract.MAX_GUEST_INVITATION_TENDER(),
            "too_many_guests"
        );
        uint8 invitedComplen = uint8(invitedCompanies.length);
        for (uint8 j = 0; j < invitedComplen; j++) {
            bool validAddress = true;
            if (msg.sender == invitedCompanies[j]) {
                continue; // silently ignore if owner trying to invite itself bypassing it
            }
            // check current company address with already invited companies to the RFP
            uint8 lenParticipants = uint8(rfp.participants.length);
            for (uint8 i = 0; i < lenParticipants; i++) {
                if (rfp.participants[i] == invitedCompanies[j]) {
                    validAddress = false; // if already invited silently ignore it bypassing it
                    break;
                }
            }
            if (validAddress) {
                dataContract.addParticipantToRFP(_rfpId, invitedCompanies[j]);
                dataContract.addCompanyParticipationinRFP(
                    _rfpId,
                    invitedCompanies[j]
                );
            }
        }
    }

    // Register sender as participating in an Open RFP
    // rejects and revert  if address already in list of registered participants
    // reject if limit  MAX_GUEST_OPEN_TENDER  has already been reached
    function registertoOpenRFP(
        uint16 _rfpId
    ) public payable rfpCancelled(_rfpId) {
        RFP memory rfp = dataContract.getRFPbyIndex(_rfpId);
        require(
            msg.value >= dataContract.REGISTER_OPEN_RFP_PRICE(),
            "Insufficient_payment_fee"
        );
        //disable
        require(rfp.contestType == ContestType.OPEN, "not_open_tender");
        require(
            rfp.endReceivingDate > block.timestamp,
            "end_receiving_reached"
        );
        require(msg.sender != rfp.issuer, "can_not_register_self");
        require(
            rfp.participants.length < dataContract.MAX_GUEST_OPEN_TENDER(),
            "max_participants_reached"
        );
        uint8 numberofParticipants = uint8(rfp.participants.length);
        for (uint8 i = 0; i < numberofParticipants; i++) {
            require(rfp.participants[i] != msg.sender, "already_participating");
        }
        dataContract.addParticipantToRFP(_rfpId, msg.sender);
        dataContract.addCompanyParticipationinRFP(_rfpId, msg.sender);
    }

    // New method Pro-pon v 0.2.0
    // add several documents in one call all of them belonging to same RFPId and same DocType
    function addDocuments(
        uint16 _rfpIdx,
        uint[] memory _docTypes,
        string[] memory _names,
        string[] memory _documentHashes,
        string[] memory _idxs
    ) public {
        // check all arrays are same size
        require(
            _docTypes.length == _names.length &&
                _names.length == _documentHashes.length &&
                _documentHashes.length == _idxs.length,
            "input_array_lengths_no_match"
        );
        RFP memory rfp = dataContract.getRFPbyIndex(_rfpIdx);
        bool rfpOwner = msg.sender == rfp.issuer;
        // if not RFP owner, check the sender is in participants list
        if (!rfpOwner) {
            bool isIncluded = false;
            uint numberofParticipants = rfp.participants.length;
            for (uint j; j < numberofParticipants; j++) {
                if (msg.sender == rfp.participants[j]) {
                    isIncluded = true;
                    break;
                }
            }
            require(isIncluded, "not_participant");
        }
        // Iterate over each document metadata sent
        bool docOwnerAllowedTypes = false;
        uint8 namesLength = uint8(_names.length);
        for (uint8 i = 0; i < namesLength; i++) {
            //  if sender is owner of RFP, check  current Doc has not invalid doctypes
            // owner of RFP only can upload request, Q&A and contract tpe  docs, and else check
            // for participant to not sent those Types
            uint8 docType = uint8(_docTypes[i]);
            docOwnerAllowedTypes = (docType ==
                uint8(DocType.documentRequestType) ||
                docType == uint8(DocType.documentQandAType) ||
                docType == uint8(DocType.documentAmendment));
            if (rfpOwner) require(docOwnerAllowedTypes, "issuer_bad_doctype");
            else {
                // a participant uplaoding docs, is allowed?
                require(!docOwnerAllowedTypes, "participant_bad_doctype");
                // is on time?
                require(
                    rfp.endReceivingDate > block.timestamp,
                    "end_receiving_reached"
                );
            }
            // so far so good, push it to contract state
            dataContract.addDocument(
                _rfpIdx,
                _docTypes[i],
                _names[i],
                msg.sender,
                _documentHashes[i],
                _idxs[i]
            );
        }
    }

    // declareWinners
    //  Register all account addresess of winners for Items of an RFP or for the whole RFP if no Items (at index 0 of winners array)
    //  _rfpIndex - Global Id of RFP
    //  _companyId  - Id of RFP Issuing company
    //  winners  - array with winners addresses. If addres 0x is declared deserted
    function declareWinners(
        uint16 _rfpIndex,
        string memory _companyId,
        address[] memory winners
    )
        public
        onlyCompanyAdmin(_companyId)
        onlyIssuer(_rfpIndex)
        rfpCancelled(_rfpIndex)
    {
        // first check conditions are met
        RFP memory rfp = dataContract.getRFPbyIndex(_rfpIndex);
        require(rfp.winners.length == 0, "rfp_already_awarded"); // Awarding only once is allowed
        require(!rfp.canceled, "already_canceled");
        uint8 itemsLength = uint8(rfp.items.length);
        uint8 winnersLength = uint8(winners.length);
        require(
            ((itemsLength == 0 || itemsLength == 1) && winners.length == 1) ||
                (itemsLength >= 2 && winnersLength == itemsLength),
            "not_matching_winners"
        );
        require(block.timestamp >= rfp.endDate, "enddate_not_reached_yet");
        for (uint8 i = 0; i < winnersLength; i++) {
            address winner = winners[i];
            require(winner != msg.sender, "cannot_self_award");
            require(
                winnerIsParticipatingorZero(winner, rfp.participants),
                "invalid_winner"
            );
            if (!uniqueAddress[winner]) {
                uniqueAddress[winner] = true;
                if (winner != address(0)) {
                    uniqueWinners.push(winner);
                }
            }
        }
        dataContract.addWinnersToRFP(_rfpIndex, winners);
        dataContract.acrueWinsToCompany(_rfpIndex, uniqueWinners);
        // reset mapping and array for next use
        uniqueWinners = emptyAddressArray;
        for (uint8 i = 0; i < winnersLength; i++) {
            uniqueAddress[winners[i]] = false;
        }
    }

    function cancelRFP(
        string memory _companyId,
        uint16 _rfpIndex
    )
        public
        onlyCompanyAdmin(_companyId)
        onlyIssuer(_rfpIndex)
        rfpCancelled(_rfpIndex)
    {
        RFP memory rfp = dataContract.getRFPbyIndex(_rfpIndex);
        require(rfp.winners.length == 0, "rfp_already_awarded"); // can't cancel if already awarded
        dataContract.setRFPCanceled(_rfpIndex, true);
        dataContract.setRFPCancelDate(_rfpIndex, block.timestamp);
    }

    function destroy() public onlyOwner {
        selfdestruct(payable(owner)); // always send funds to owner as in withdraw function, not manager
    }
}
