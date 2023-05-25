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

pro_ponData dataContract;       // pro_ponData.sol is the Contract that holds all Pro-pon data, constants, structs, vars
address private owner;

constructor(address _dataContractAddress) {
    dataContract = pro_ponData(_dataContractAddress);
     owner = payable(msg.sender);
}
   // Events
   
   // event to send when an RFP has been created
    event NewRFPCreated(address indexed sender, uint id, string name);


 // Modifiers ***************************************************************
    // only owner can do administrative task as withdrawing
    modifier onlyOwner() {
        require(isOwner(), 'Only_owner_allowed');
        _;
    }

    // only admin of  company can do task on its company (with companyId)
    // it checks that the registered Id of sender is actually the one sended in the params
    // i.e. a company can't pretend to be another company
    modifier onlyCompanyAdmin(string memory companyId) {
        require(equals(dataContract.getCompanyId(msg.sender), companyId), 'Only_admin_can_perform');

        _;
    }

    // only issuer of Invitation RFP can perfrom
    // validates the RFP was actually issued by whomever sender is trying to modify RFP 
    modifier onlyIssuer(uint rfpIdx) {
        require(dataContract.getRFPIssuer(rfpIdx) == msg.sender, 'Only_issuer_can_perform');

        _;
    }

    modifier rfpCancelled(uint rfpIdx) {
        require(!dataContract.isRFPCanceled(rfpIdx), 'already_canceled');
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "failed_withdraw");
    }

    // Getter/setters ***************************************************************


 
    // utility functions ***************************************************************
    function equals(string memory a, string memory b) private pure returns (bool) {
    if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }
    }

    // concatStringAndAddress
    //          - Concatenate a string and an address, hash the concatenated result and create a mapping to a bool
    function concatStringAndAddress(string memory _string, address _address) public pure returns (bytes32){
        bytes32  stringhashed = keccak256(bytes(_string));
        bytes memory concatString = abi.encodePacked(stringhashed, _address);
        bytes32  hash = keccak256(concatString);
        return hash;
    }

    // winnerIsParticipating
    //       check if the passed address is also present in array targetAddreses
    //       A 0 address is also checked as this is considered a 'deserted' item
    function winnerIsParticipating(address addresstoCheck, address[] memory targetAddresses ) private pure returns (bool) {
        for (uint8 i=0; i<targetAddresses.length;i++)  
            if (addresstoCheck == targetAddresses[i] || addresstoCheck==address(0)) return true;  // account for deserted Items
        return false;
    }

// check if and address (tocheck) is contained in an address array (container)
    function isContainedAddress(address[] memory container, address tocheck) public pure returns (bool) {
    for (uint8 i = 0; i < container.length; i++) {
        if (container[i] == tocheck) {
            return true;
        }
    }
    return false;
}


    // Company functions ************************************************************
    function createCompany(
        string memory _id,
        string memory _name,
        string memory _country
    ) public payable {

       // check the ID  is not taken yet
       require(!dataContract.isCompanyIdTaken(_id), 'id_already_exists');
       // check there is payment on tx
       require(msg.value >= dataContract.CREATE_COMPANY_PRICE(), 'Insufficient_payment');
       

       // check this address has not been used before (ony one address is admin of company)
       bytes memory checkId = bytes(dataContract.getCompanyId(msg.sender)); // Uses memory
       require( checkId.length == 0, "address_already_admin_of_company");
        //all ok, proceed to add company data
        dataContract.setCompany(msg.sender, _id, _name, _country);
    }

 // RFP  functions *****************************************************************

 //      CreateRFP The sender creates an RFP. A record RFP is create and mapped from the current RFPIndex (currentRFPIdx)
 //      to the new record and the index is added to company array or RFPs
 //      Validates date is not older than today minus 1 hour to accmodate UX/UI delays to send the data
 //      Validates dates correct sequence
 //      It contains all data in the mirror DataBase except the autogenerated _id MongoDb Id record
    function createRFP (
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
        bytes32 pair= concatStringAndAddress(_name, msg.sender);
        //require(!RfpIds[pair], 'rfpid_already_taken');
        require(!dataContract.getRfpIds(pair), 'rfpid_already_taken');
        // check TX is sufficiently funded
        // require(
        //     msg.value >= (_contestType == ContestType.OPEN ? CREATE_OPEN_RFP_PRICE : CREATE_INVITATION_RFP_PRICE),
        //     "Insufficient_payment"
        // );
        require(
        msg.value >= (_contestType == proponShared.ContestType.OPEN ? dataContract.CREATE_OPEN_RFP_PRICE() : 
                       dataContract.CREATE_INVITATION_RFP_PRICE()),
                       "Insufficient_payment");
        // verify this address is from a compay admin retrieving his company record
        proponShared.Company memory company = dataContract.getCompany(msg.sender);
        bytes memory chekString = bytes(company.id);
        require(bytes(chekString).length!=0,'address_not_admin'); // this address is not admin
        // Next sentence that was disable for developing and testing is 
        require(_openDate >= (block.timestamp - 3600),'opendate_behind_today'); // allow one hour behind!
        require(_openDate < _endReceivingDate, 'initial_date_wrong');
        require(_endReceivingDate < _endDate, 'receiving_date_wrong');
        //uint currRFPIdx = getcurrentRFPIdx(); // global RFP Index
        uint currRFPIdx = dataContract.getcurrentRFPIdx();
        RFP memory newRFP= RFP(
                _name,          // in UI/UX is the Id of RFP
                _description,   // in UI/UX is the name of RFP  
                currRFPIdx,     // RFP's Global Index
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
        // dataContract.RfpIds[pair]=true;      // Reserve the RFP Id
        // dataContract.RFPs[currRFPIdx] = newRFP;
        // dataContract.Companies[msg.sender].company_RFPs.push(currRFPIdx);
        // dataContract.currentRFPIdx=dataContract.currRFPIdx + 1;
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
        uint _rfpId, // index in All RFP array RFPs
        string memory companyId, // id of company owner of RFP
        address[] memory invitedCompanies ) public 
        onlyCompanyAdmin(companyId) 
        onlyIssuer(_rfpId)
        rfpCancelled(_rfpId) {
        //contracto too long, disable this
            //require(RFPs[_rfpId].endReceivingDate > block.timestamp,'end_receiving_reached');
        //require(dataContract.RFPs[_rfpId].endReceivingDate > block.timestamp,'end_receiving_reached');
        //require(RFPs[_rfpId].contestType==ContestType.INVITATION_ONLY,'wrong_contest_type');
        RFP memory rfp = dataContract.getRFP(_rfpId);
        require(rfp.contestType==ContestType.INVITATION_ONLY,'wrong_contest_type');
        require( (rfp.participants.length + invitedCompanies.length) <= dataContract.MAX_GUEST_INVITATION_TENDER(), 
                'too_many_guests');
        for (uint8 j=0; j < invitedCompanies.length; j++) {
            bool  validAddress=true;
            if (msg.sender == invitedCompanies[j]) continue; // silently ignore if owner trying to invite itself bypassing it
            uint lenParticipants=rfp.participants.length;
            for (uint8 i = 0; i < lenParticipants ; i++ ) 
              if ( rfp.participants[i]== invitedCompanies[j]) {
                 validAddress=false;            // if already invited silently ignore it bypassing it
                 break;
            }
            //if (validAddress) RFPs[_rfpId].participants.push(invitedCompanies[j]);
            if (validAddress) dataContract.addParticipantToRFP(_rfpId, invitedCompanies[j]);
        }
    }


}