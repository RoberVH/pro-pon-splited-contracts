//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**proponShared Contract
 * Holds enums & structs used by proponData and proponLogic that can't be passed as imports from Data to Logic contracts
 *      proponData.sol
 *      proponLogic.sol
 */

contract proponShared {
    /* ContestType - Enumeration of type of RFP
            Open allow any company to participate, it will have a owner define participants limit
*/
    enum ContestType {
        OPEN,
        INVITATION_ONLY
    }

    /* DocType Enumeration defining type of documents associated with RFP
     */
    enum DocType {
        documentRequestType, // RFP doc  from Owner
        documentQandAType, // Clarification Questions and answers from Owner
        documentAmendment, // Contract, adenda, guaranties etc documents created between owner and winners
        documentProposalType, // Technical offering, RFPs answers from participant
        documentPricingOfferingType, // Economic Proposal from participant
        documentLegalType, // Legal documents from participants
        documentFinancialType, // Financial statements and documents from participants
        documentAdministrativeType, // Administrative documents from participants
        // Documents post RFP. These are for future versions where follow up of RFP Documents like contracts
        // Project progress reports, informs etc
        documentContract, // Contract documents
        documentAnnex, // Annexes document to contracts
        documentPProgress // Status and progress reports
    }

    // Company. Records all companies in Pro-pon contract
    struct Company {
        string id;
        string name;
        string country;             // 3-code int'l country code
        uint16[] RFPParticipations; // How many RFP the company has partipated as invited / self-registered
        uint16[] RFPsWins;          // Global Ids of RFPs this company has won or won one or more items from
        uint16[] company_RFPs;      // array of RFPs issued by this company
    }

    // RFP. Record of RFP contests issued by companies in Pro-pon contract
    struct RFP {
        string name; // In UI/UX  is the ID of the RFP
        string description; // In UI/UX  is the name of the RFP
        uint rfpIndex; // Global Id for this RFP  (in RFPs array)
        string rfpwebsite; // Company web page for the RFP
        uint openDate; // date when start receiving proposals
        uint endReceivingDate; // date when finish  receiving proposals
        uint endDate; // date when password of proposals is released
        bool canceled; // the contest was called off, no proposal was satisfactory
        uint cancelDate; // Date the contest was canceled
        address[] participants; // Keep tracks of invited/participant companies to this RFP, store companies ID
        proponShared.ContestType contestType;
        string[] items; // Optional, the name of different requesting groups of items asked for
        // each item can have a different winner
        address[] winners; // address of winner of each item (if no Items RFP winner is in winner[0])
        address issuer; // Reference back to company issuing this RFP
    }

    // Documents. Record of RFP Proposal Documents metadata
    struct Document {
        uint docType;       // 0 is a requesting RFP Doc/  1 is a Response RFP Doc
        string name;
        address owner;      // of the document
        string documentHash; // act as unique id
        string idx;         // Id storage on arweave (https://arweave.net/{idx})
    }
}
