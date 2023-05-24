//SPDX-License-Identifier: MIT
/**
 * pro-pon   -
 *               Solidity Contract for Pro-pon application
 *               July/2022
 *               Author: Roberto Vicuña
 */
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

// Pro-pon contract. Keeps track of companies and RFP contests
contract pro_pon  {
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
    enum ContestType{ OPEN, INVITATION_ONLY }   

/* DocType Enumeration defining type of documents associated with RFP
*/
     enum DocType {
        documentRequestType,            // RFP doc  from Owner
        documentQandAType,              // Clarification Questions and answers from Owner
        documentAmendment,               // Contract, adenda, guaranties etc documents created between owner and winners 
        documentProposalType,           // Technical offering, RFPs answers from participant
        documentPricingOfferingType,    // Economic Proposal from participant
        documentLegalType,              // Legal documents from participants
        documentFinancialType,          // Financial statements and documents from participants
        documentAdministrativeType,     // Administrative documents from participants
        // Documents post RFP. These are for future versions where follow up of RFP Documents like contracts
        // Project progress reports, informs etc
        documentContract,               // Contract documents
        documentAnnex,                  // Annexes document to contracts
        documentPProgress               // Status and progress reports
    }
 
    // Company. Records all companies in Pro-pon contract
    struct Company {
        string id;
        string name;
        string country;     // 3-code int'l country code
        uint16 RFPSent;       // How many RFP the company has partipated as invited / self-registered
        uint[] RFPsWins;     // Global Ids of RFPs this company has won or won one or more items from   
        uint[] company_RFPs;     // array of RFPs issued by this company
    }

    // RFP. Record of RFP contests issued by companies in Pro-pon contract
    struct RFP {
        string name;            // In UI/UX  is the ID of the RFP
        string description;     // In UI/UX  is the name of the RFP
        uint rfpIndex;            // Global Id for this RFP  (in RFPs array)
        string rfpwebsite;      // Company web page for the RFP
        uint openDate;          // date when start receiving proposals
        uint endReceivingDate;  // date when finish  receiving proposals
        uint endDate;           // date when password of proposals is released
        bool canceled;          // the contest was called off, no proposal was satisfactory
        uint cancelDate;        // Date the contest was canceled
        address[] participants;  // Keep tracks of invited/participant companies to this RFP, store companies ID
        ContestType contestType;
        string[] items;         // Optional, the name of different requesting groups of items asked for
                                // each item can have a different winner
        address[] winners;       // address of winner of each item (if no Items RFP winner is in winner[0])
        address issuer;          // Reference back to company issuing this RFP
    }

    // Documents. Record of RFP Proposal Documents metadata 
    struct Document {
        uint docType;            // 0 is a requesting RFP Doc/  1 is a Response RFP Doc
        string name;
        address owner;             // of the document
        string documentHash;   // act as unique id
        string idx;            // Id storage on arweave (https://arweave.net/{idx})
    }

    // Companies in the system. Address of admin of company. User can't loose this address because company data would be lost
    mapping(address => Company) Companies;  

    // Hold a map from ids to companies to easliy check uniqueness of company ID
    mapping( string => bool) CompanyidTaken;    // It would be set to true for Company Id string if exists

    // All RFPs in the system, they map from an index given by currentRFPIdx
    mapping(uint => RFP) RFPs;  

    // RFPDocuments  maps an RFP index to a Document 
    mapping(uint => Document[])  RFPDocuments;  

    // event to send when a company has been created
    // event NewCompanyCreated(address indexed sender, string id, string name);

   // event to send when an RFP has been created
    event NewRFPCreated(address indexed sender, uint id, string name);
   
    // owner of pro_pon contract
    address payable public owner;

    // Record of used RFP Id by an address issuer of RFP, to guarantee uniqueness of RFP ID by Accounts RFP's Issuers
    mapping (bytes32 => bool) RfpIds;   
    
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
        require(equals(Companies[msg.sender].id, companyId), 'Only_admin_can_perform');
        _;
    }

    // only issuer of Invitation RFP can perfrom
    // validates the RFP was actually issued by whomever sender is trying to modify RFP 
    modifier onlyIssuer(uint rfpIdx) {
        require(RFPs[rfpIdx].issuer==msg.sender, 'Only_issuer_can_perform');
        _;
    }

    modifier rfpCancelled(uint rfpIdx) {
        require(!RFPs[rfpIdx].canceled, 'already_canceled');
        _;
    }

    constructor() payable {
        owner = payable(msg.sender);
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
    // function getcurrentRFPIdx() public view returns(uint) {
    //     return (currentRFPIdx);
    // }

    // function setcurrentRFPIdx(uint _currentRFPIdx) private  {
    //     currentRFPIdx= _currentRFPIdx;
    // }

 
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
       require(!CompanyidTaken[_id],'id_already_exists');
       // check there is payment on tx
       require(msg.value >= CREATE_COMPANY_PRICE, 'Insufficient_payment');

       // check this address has not been used before (ony one address is admin of company)
       bytes memory checkId = bytes(Companies[msg.sender].id); // Uses memory
       require( checkId.length == 0, "address_already_admin_of_company");
        
        //all ok, proceed to add company data
       
       // reserve Company Id
       CompanyidTaken[_id]=true;
       Companies[msg.sender].id=_id;
       Companies[msg.sender].name=_name;
       Companies[msg.sender].country=_country;
        
       // Let blockchain know about it
       //emit NewCompanyCreated(msg.sender, _id, _name);
    }


    function getCompany(address adminaddress) public view  returns ( Company memory ) {
        return  Companies[adminaddress];
    }

//   get only Id Company record field  based on its admin address
    function getCompanyId(address adminaddress) public view  returns ( string memory companyId ) {
        companyId = Companies[adminaddress].id;
      }

      
//   RFP functions ************************************************************
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
            ContestType _contestType,
            string[] memory _items
    ) public payable {
        // check this RFP ID is unique for this address, revert if found an equal Id
        bytes32 pair= concatStringAndAddress(_name, msg.sender);
        require(!RfpIds[pair], 'rfpid_already_taken');
        // check TX is sufficiently funded
        require(
            msg.value >= (_contestType == ContestType.OPEN ? CREATE_OPEN_RFP_PRICE : CREATE_INVITATION_RFP_PRICE),
            "Insufficient_payment"
        );
        // verify this address is from a compay admin retrieving his company record
        Company memory company = getCompany(msg.sender);
        bytes memory chekString = bytes(company.id);
        require(bytes(chekString).length!=0,'address_not_admin'); // this address is not admin
        // Next sentence that was disable for developing and testing is 
        require(_openDate >= (block.timestamp - 3600),'opendate_behind_today'); // allow one hour behind!
        require(_openDate < _endReceivingDate, 'initial_date_wrong');
        require(_endReceivingDate < _endDate, 'receiving_date_wrong');
        //uint currRFPIdx = getcurrentRFPIdx(); // global RFP Index
        uint currRFPIdx = currentRFPIdx;
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
        RfpIds[pair]=true;      // Reserve the RFP Id
        RFPs[currRFPIdx] = newRFP;
        Companies[msg.sender].company_RFPs.push(currRFPIdx);
        emit NewRFPCreated(msg.sender, currRFPIdx, _name);
        //setcurrentRFPIdx(currRFPIdx + 1);
        currentRFPIdx=currRFPIdx + 1;
    }

    // getRFPbyIndex receive an index and returns the RFP if exists
    function getRFPbyIndex(uint _rfpId) public view returns (RFP memory) {
        return RFPs[_rfpId];
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
        require(RFPs[_rfpId].contestType==ContestType.INVITATION_ONLY,'wrong_contest_type');
        require((RFPs[_rfpId].participants.length +  invitedCompanies.length) <= MAX_GUEST_INVITATION_TENDER, 'too_many_guests');
        for (uint8 j=0; j < invitedCompanies.length; j++) {
            bool  validAddress=true;
            if (msg.sender == invitedCompanies[j]) continue; // silently ignore if owner trying to invite itself bypassing it
            for (uint8 i = 0; i < RFPs[_rfpId].participants.length; i++ ) 
              if ( RFPs[_rfpId].participants[i]== invitedCompanies[j]) {
                 validAddress=false;            // if already invited silently ignore it bypassing it
                 break;
            }
            if (validAddress) RFPs[_rfpId].participants.push(invitedCompanies[j]);
        }
    }

    // Register sender as participating in an Open RFP
    // rejects and revert  if address already in list of registered participants
    // reject if limit  MAX_GUEST_OPEN_TENDER  has already been reached
    function registertoOpenRFP(uint _rfpId) public payable  rfpCancelled(_rfpId) {
        require(msg.value>=REGISTER_OPEN_RFP_PRICE,'Insufficient_payment_fee');
        //disable
        require(RFPs[_rfpId].contestType==ContestType.OPEN, 'not_open_tender');
        require(RFPs[_rfpId].participants.length  < MAX_GUEST_OPEN_TENDER,'max_participants_reached');
        require(msg.sender!= RFPs[_rfpId].issuer,'can_not_register_self');
        for (uint8 i = 0; i < RFPs[_rfpId].participants.length; i++ ) {
           require(RFPs[_rfpId].participants[i] != msg.sender,'already_participating');
        }
        RFPs[_rfpId].participants.push(msg.sender);
    }


    // New method Pro-pon v 0.2.0
    // add several documents in one call all of them belonging to same RFPId and same DocType
    function addDocuments(
        uint _rfpIdx, 
        uint[] memory _docTypes, 
        string[] memory _names,
        string[] memory _documentHashes, 
        string[] memory _idxs) public  {
        bool rfpOwner = msg.sender==RFPs[_rfpIdx].issuer;
        // if not RFP owner, check the sender is in participants list
        if (!rfpOwner) {
            bool isIncluded = false;
              for (uint8 j; j < RFPs[_rfpIdx].participants.length; j++) {
                 if (msg.sender == RFPs[_rfpIdx].participants[j]) {
                    isIncluded = true;
                    break;
                }
              }
            require(isIncluded,'not_participant');
        }
        // Iterate over each document metadata sent
        bool docOwnerAllowedTypes=false;
        for (uint8 i=0; i<_names.length; i++ ) {
          //  if sender is owner of RFP, check  current Doc has not invalid doctypes
          // owner of RFP only can upload request, Q&A and contract tpe  docs, and else check
          // for participant to not sent those Types
        //   docOwnerAllowedTypes = (_docTypes[i]==uint8(DocType.documentRequestType) || _docTypes[i]==uint8(DocType.documentQandAType) ||
        //                          _docTypes[i]==uint8(DocType.documentAmendment));
        //   if (rfpOwner) require(docOwnerAllowedTypes,'issuer_bad_doctype');
        uint8 docType = uint8(_docTypes[i]);
        docOwnerAllowedTypes = (docType == uint8(DocType.documentRequestType) || docType == uint8(DocType.documentQandAType) || 
                                docType == uint8(DocType.documentAmendment));
        if (rfpOwner) require(docOwnerAllowedTypes, 'issuer_bad_doctype');
                else  { 
                    // a participant uplaoding docs, is allowed?
                    require(!docOwnerAllowedTypes,'participant_bad_doctype');
                    // is on time?
                    require(RFPs[_rfpIdx].endReceivingDate > block.timestamp,'end_receiving_reached');
                    }
            // so far so good, push it to contract state
          RFPDocuments[_rfpIdx].push(Document(
            _docTypes[i],
            _names[i],
            msg.sender,
            _documentHashes[i],
            _idxs[i])
            );        
        }
    }

    function getDocumentsfromRFP(uint _rfpIdx) view public returns (Document[] memory) {
        return (RFPDocuments[_rfpIdx]);
    }

    // declareWinners
    //  Register all account addresess of winners for Items of an RFP or for the whole RFP if no Items (at index 0 of winners array)
    //  _rfpIndex - Global Id of RFP
    //  _companyId  - Id of RFP Issuing company
    //  winners  - array with winners addresses. If addres 0x is declared deserted
    function declareWinners(uint _rfpIndex, string memory _companyId, address[] memory winners) public  
    onlyCompanyAdmin(_companyId)
    onlyIssuer(_rfpIndex)
    rfpCancelled(_rfpIndex)
    {
        // first check conditions are met
        require(RFPs[_rfpIndex].winners.length==0,'rfp_already_awarded'); // awarding only once is allowed
        //require(!RFPs[_rfpIndex].canceled, 'already_canceled');
        uint itemsLength=RFPs[_rfpIndex].items.length;
        require(
                (itemsLength == 0 || itemsLength == 1) && winners.length == 1 ||
                itemsLength >= 2 && winners.length == itemsLength,
                "not_matching_winners"
            );                    
        require(block.timestamp >= RFPs[_rfpIndex].endDate, 'enddate_not_reached_yet');

        for (uint8 i=0; i < winners.length; i++) {
           require(winners[i]!=msg.sender,'cannot_self_award');
           require(winnerIsParticipating(winners[i], RFPs[_rfpIndex].participants),'invalid_winner');
           // record in the RFP.winners vector that correspond to i-th entry in winners vector
           RFPs[_rfpIndex].winners.push(winners[i]);   
           //  record in Winner Companies RFPsWins vector the index of this RFP in case is not yet registered
           uint lastIndex=Companies[winners[i]].RFPsWins.length;
        //    if (lastIndex==0)  Companies[winners[i]].RFPsWins.push(_rfpIndex); // the first entry
        //        else if (Companies[winners[i]].RFPsWins[lastIndex-1] != _rfpIndex ) Companies[winners[i]].RFPsWins.push(_rfpIndex);
        //    }
        if (lastIndex == 0 || Companies[winners[i]].RFPsWins[lastIndex - 1] != _rfpIndex) {
                    Companies[winners[i]].RFPsWins.push(_rfpIndex);
            }
        }
    } 

    function getWinners(uint _rfpIndex) public view returns (address[] memory ) {
        return RFPs[_rfpIndex].winners;
    }

    function getCompanyWins() public view returns (uint[] memory ) {
        return Companies[msg.sender].RFPsWins;
    }


    function getCompanyRFPs(address account) public view returns (uint[] memory) {
        return Companies[account].company_RFPs;
    }

    function cancelRFP(string memory _companyId, uint _rfpIndex ) public 
        onlyCompanyAdmin(_companyId)
        onlyIssuer(_rfpIndex) 
        rfpCancelled(_rfpIndex){
        require(RFPs[_rfpIndex].winners.length==0,'rfp_already_awarded'); // can't cancel if already awarded
        RFPs[_rfpIndex].canceled = true;
        RFPs[_rfpIndex].cancelDate = block.timestamp;
    }

    // Setters for prices vars & constants

    function getCancelDate(uint _rfpIndex) public view returns(uint) {
        return RFPs[_rfpIndex].cancelDate;
    }

    function setCreateCompanyPrice(uint newprice) public onlyOwner {
        CREATE_COMPANY_PRICE= newprice;
    }
      
    function setCreateOpenRfpPrice(uint price) public onlyOwner {
        CREATE_OPEN_RFP_PRICE = price;
    }

    function setCreateInvitationRfpPrice(uint price) public onlyOwner {
        CREATE_INVITATION_RFP_PRICE = price;
    }

    function setRegisterOpenRfpPrice(uint price) public onlyOwner {
        REGISTER_OPEN_RFP_PRICE = price;
    }

     function setMaxGuestOpenTender(uint MaxGuest) public onlyOwner {
        MAX_GUEST_OPEN_TENDER = MaxGuest;
    }

    function setMaxGuestInvitationTender(uint MaxGuest) public onlyOwner {
    MAX_GUEST_INVITATION_TENDER = MaxGuest;
    }
    
    // escape function for live testing
    function  destroy() public onlyOwner{
         selfdestruct(payable(owner));
    }
}
