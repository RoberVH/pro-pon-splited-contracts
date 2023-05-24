/**
 * Testing RFP batch documents upload
// this file is to test new addDocuments method, same that former addDocument but allows
// several files descriptiors to be registered under same owner and RFPid
 *  Modif. Jan 11, 2023 to account for uint8 doctype parameter cahnged to uint8 doctypes[] in addDocuments contract methodd
 *  to allowed several different type of documents upload at one call
 * 
 */

const { expect } = require("chai")
//const { describe, it } = require("mocha")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// owner address company data
const test_pro_pon1 = {
    id: "CLI160511W1M",
    name: "Clionautacion",
    country:"MEX",
  }   

// addr1 address company data
const test_pro_pon2 = {
    id: "0455-3443",
    name: "Flexamatic Inc",
    country:"USA",
  }     

// addr2 address company data
const test_pro_pon3 = {
    id: "243 SI344033424",
    name: "Courient llc",
    country:"CAN",
  }     

  function convertDate(date)   {
    return unixdate=Math.floor(new Date(date).getTime()/1000)
  }

    // ConvertDatesAgo - convert date minus number of daysAgo to unix epoch
  // if daysAgo is negative it returns today dates + daysAgo date
  function convertDatesAgo(daysAgo) {
    let today= new Date()
    let convertedDay= new Date(today)
    convertedDay.setDate(today.getDate()-daysAgo)
    return todayTimestamp = Math.floor(convertedDay.getTime() / 1000);
  }

  function convertUnixToDate(unixTime) {
    const date = new Date(unixTime * 1000);
    const dd = String(date.getDate()).padStart(2, '0');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const mmm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    console.log('Date in GMT', date)
    console.log('Date in local time', date.toLocaleString())
    //return `${dd}/${mmm}/${yyyy}`;
    return   date.toLocaleString()
  }

  const ContestType = {OPEN:0, INVITATION_ONLY:1}

  // Id RFP is the RFP name field at pro-pon contract
  let IDRFP=[
    'LPN3094-3912-4',
    'LPI6709-211262-2408',
    '03945-441-039943',
    'LPX29003412-001',
    'LPI030223-7203-00013',
    '0232-COV-659-023L',
    'LPN2003-434-12'
  ]
  // name RFP is description field in pro-pon contrat
  let nameRfp=[ 
    'Reacondicionamiento de Luminarias',
    'Cleaning Services',
    'Déneigement des installations',
    'Sistema electronico de Votación',
    '2022-2023 Translations Services',
    'Service de transport des employés',
    'REmediación de Aguas Residuales muicipales'
  ]

    let rfpWebLink=[ 
      'https://www.locazon.com/progress-tracker/package/ref=pe_386ds0_4553248370_TE_SIMP_typ_T?_encoding=UTF8&from=gp&itemId=&orderId=114-9127329-3803961&packageIndex=0&shipmentId=200350996242434200',
      'https://bdael.deggrtex.mx/u/0/#tiduo/WhcdKKkXl8gJXdmrwtWasdKCRZQlWCSJtVBChHGAs564mnSRqFFGCQXLmKfCgqLbQFdHSjtyt',
      'http://morels.wwe.mx/MP_typ_T?_encoding=UTF8&from=gp&itemId=&orderId=114-9127329-3803961&packageIndex=0WhcdKKkXl8gJXdmrwtWasdKCRZQlWCSJtVBChHGAs564mnSRqFFGCQXLmKfCgqLbQFdHSjtyt',
      'https://www.apratmse.com/-/es/b?node=16225005011&pf_rd_r=N62KCHHDBD52V0HCXRFD&pf_rd_p=27f4d66c-efe3-4ee0-a6bf-6cfd06f31a84&pd_rd_r=ba0a45fc-ef91-423f-aacb-2fab6ef4bf5d&pd_rd_w=jkE5h&pd_rd_wg=9VC7C&ref_=pd_gw_unk',
      '',
      'http://lnc.it/-/Toallitas-paquetes-fragancia/dp/B07H53W5WP/ref=lp_16225005011_1_3',
      ''
    ]

  // let openDate=convertDate('2022/11/29')
  // let endReceiving=convertDate('2022/12/03')
  // console.log('end receiving date:',convertUnixToDate(endReceiving) )
  // let endDate=convertDate('2022/12/14')        
  let participantLimit=5

  let items = []
  const listItems1=[
    'Partida 1: LICITACIÓN DE CARÁCTER PÚBLICA NACIONAL PRESENCIAL POR PARTIDAS LPNP-MCE-01-2022 ADQUISICIÓN DE MATERIALES DE ASFALTO PARA LA DIRECCIÓN GENERAL DE OBRAS PÚBLICAS DEL MUNICIPIO DE CELAYA',
    'Partida 2: Ajsute de luminarias Colonia Medellín',
    'Partida 3: Recambio de unidad completa en Colonia Santa Maria',
    'Partida 4: Compra de 5000 cajas de Fluoxixan de 500 ML reconvertidos con aplicadores esterilizados con intercambiadores de oxigeno calidad DEV-IIID-34993 y servicio de entrega en los 10 municipios del estado',
    'Partida 5: Ajsute de luminarias Colonia Cerro Azul',
    'Partida 6: Recambio de unidad completa en Colonia Benito Juárez',
  ]
  const listItems2=[
    'Services for cleaning school offices at District 1',
    'Services for cleaning school offices at District 2',
    'Services for cleaning school offices at District 3',
    'Services for cleaning school offices at District 4',
    'Services for cleaning school offices at District 5',
    'Services for cleaning school offices at District 6',
    'Services for cleaning school offices at District 7',
    'Services for cleaning school offices at District 8',
    'Services for cleaning school offices at District 9',
    'Services for cleaning school offices at District 10',
    'Services for cleaning school offices at District 11',
    'Services for cleaning school offices at District 12',
    'Services for cleaning school offices at District 13',
    'Services for cleaning school offices at District 14',
    'Services for cleaning school offices at District 15',
    'Services for cleaning school offices at District 16',
    'Services for cleaning school offices at District 17',
    'Services for cleaning school offices at District 18',
    'Services for cleaning school offices at District 19',
    'Services for cleaning school offices at District 20',
    'Services for cleaning school offices at District 21',
    'Services for cleaning school offices at District 22',
    'Services for cleaning school offices at District 23',
    'Services for cleaning school offices at District 24',   
    'Services for cleaning school offices at District 25',
    'Services for cleaning school offices at District 26',
    'Services for cleaning school offices at District 27',
    'Services for cleaning school offices at District 28',
    'Services for cleaning school offices at District 29',
    'Services for cleaning school offices at District 30',
    'Services for cleaning school offices at District 31',
    'Services for cleaning school offices at District 32',
    'Services for cleaning school offices at District 33',
    'Services for cleaning school offices at District 34',
    'Services for cleaning school offices at District 35',
    'Services for cleaning school offices at District 36'
  ]
  
  const listItems3 = [
    "maintenance de l'instrument icp element xr 3986 E et de l'instrument thermo lc Wps3000tfc",
     "maintenance de l'instrument icp element xr 3986 E et de l'instrument thermo lc Wps3000tfc",
     "maintenance de l'instrument Ltq-Orbitrap Velos 3060 B",
     "Compra de 3 cigüeñales marca l'oreal älphièrzar",
     "maintenance de l'instrument element xr 4074 E"
  ]
  const  openContest = ContestType.OPEN 
  const  invitationContest = ContestType.INVITATION_ONLY 

  let DocumentNames = [
    'Request for Proposals for Adquisition of 30 water pumps of 100 Watts',
    'Annex 5. Questions & Answers',
    'Contract XL-340-45',
    'Technical Proposal for Adjusting & tunning Motor Services',
    'Legal Constitutive Act of Michael & Sons Company LLC',
    'Accountable Finance State 2020, 21 and 22 of Chemioux Freres Inc.',
    'Signed Non Disclosure Agreement copy of Rotores Electrodinamicos S.A.',
    'Fianza por 500,000 MXN para Licitación XIIV Documento Anexo 2 B de Impresores Aliados del Sureste S.A. de  C.V.',
    'Adminisrative Procedure',
    'Prices Table'
  ]
  
   const IdxDocTypes = {
  'documentRequestType':0,
  'documentQandAType':1,
  'documentAmendment':2,
  'documentProposalType':3,
  'documentPricingOfferingType':4,
  'documentLegalType':5,
  'documentFinancialType':6,
  'documentAdministrativeType':7,
}

  const docTypesOnwerAllowed = [
    IdxDocTypes['documentRequestType'],
    IdxDocTypes['documentQandAType'],
    IdxDocTypes['documentRequestType'],
    IdxDocTypes['documentQandAType'],
    IdxDocTypes['documentQandAType'],
    IdxDocTypes['documentRequestType'],
    IdxDocTypes['documentAmendment'], 
    IdxDocTypes['documentQandAType'],
    IdxDocTypes['documentQandAType'],
    IdxDocTypes['documentAmendment']
  ]

  let DocumentHashes = [
    'de9ea9ddc8c0ba0691bbae99c2ed6bf165ff98e19dda0ef98eb20982184dce28b246ab3998b48440358183c887d5d7be95d16a713dc24d075a886dc4978571cb',
    'b61a031aa6a8cb960a690239798b5fd2ebaa87fa4125663480cb8379b33e64dc47faf37244ca04f2a84c7af28b0865ac97e47dc95c4100671b2042d745c954dc',
    'a89ea9ddc8c0ba0691bbae99c2ed6bf165ff98e19dda0ef98eb20982184dce28b246ab3998b48440358183c887d5d7be95d16a713dc24d075a886dc49785711e',
    '0f6a031aa6a8cb960a690239798b5fd2ebaa87fa4125663480cb8379b33e64dc47faf37244ca04f2a84c7af28b0865ac97e47dc95c4100671b2042d745c958d3',
    'b019ddc8c0ba0691bbae99c2ed6bf165ff98e19dda0ef98eb20982184dce28b246ab3998b48440358183c887d5d7be95d16a713dc24d075a886dc4978571f9ba',
    '11a326049556b0c877c9a49349bbaa87fa4125663480cb8379b33e64dc47faf37244ca04f2a84c7abaa87fa4125634800ae1000293e94c09bf938fa34124434d',
    '11a326049556b0c877c9a49349bbaa87fa4125663480cb8379b33e64dc47faf37244ca04f2a84c7abaa87fa4125634800ae1000293e94c09bf938fa34124434d',
    '887d5d7be95d16a713dc24d075a886dc49785711b019ddc8c0ba0691bbae99c27fa4125663480cb8379b33e64dc7be95dabaa87fa4125634800d83f927ca039a',
    '4a00b3e21d8331aa6a8cb960a690239798b5fd2ebaa87fa4125663480cb8379b33e64dc47faf37244ca04f2a84c7af28b0865ac97e47dc95c4100671b2042d74',
    '1b0de1230b3e21d8331aa6a8cb960a690239798b5fd2ebaa87fa4125663480cb8379b33e64dc47faf37244ca04f2a84c7af28b0865ac97e47dc95c4100713dc2',
  ]

  let DocumentIdxs = [
    '9B3Ejwx18Rao8uRlf4c23CnZ-X_e4AmncQ1svcQp9fl',
    'B434pT9k8Rao8uRlf4c23Rd2c80e4AmncQ1svcQX4b2',
    '2C9342bs0Rao8uRlf4c23Cnw5trg4AmncQ1svcRo15s',
    '98233Ejx1fRao8uRlf4c23Cxo0dAW4AmncQ1vck4f87',
    'A0kEfx1w8Rao8uRlf4c20o9hSwOlP4AmncQ1svc3d98',
    '9B2A0458Rao8uRlf4c20o9hSwOlP4AmncQ1svMD313b',
    '2C9342bs0Rao8uRlf4c23Cnw5trg4AmncQ1svcRo15s',
    '1034cMAX93Rf4c20o9hwOlP4AmncQ1sv27C91ao8uRl',
    '20b9e8d233Rf4c20o9hwOlP4AmncQ1sv39b8s98x9a8',
    '7a34b8d233Rf4c20o9hwOlP4AmncQ1sv39b8s9fRao0',
  ]


  const createRFP = async (proponContract, address, RFPNameIdx, ContestType, ItemsList, value) => {
    let openDate=convertDatesAgo(0) - 1600 // today
    let endReceiving=convertDatesAgo(-10) // 10 days into future
    let endDate=convertDatesAgo(-11) // 9 days into future, i.e. is short 1 day that receiving dateline
    await proponContract.connect(address).createRFP(
      IDRFP[RFPNameIdx],
      nameRfp[RFPNameIdx],
      rfpWebLink[RFPNameIdx],
      openDate,
      endReceiving,
      endDate,
      ContestType,
      ItemsList,
      {value: ethers.utils.parseEther(value)}
    )
  }
  
  async function deployProponandRFP() {
    // Get the ContractFactory and Signers here.
    const [owner, addr1, addr2, addr3, addr4, addr5,addr6] = await ethers.getSigners();
    const propon = await ethers.getContractFactory("pro_pon");
    const proponContract = await propon.deploy();
    
    //company 1 from owner
    let txn = await proponContract.createCompany(
      test_pro_pon1.id,
      test_pro_pon1.name,
      test_pro_pon1.country,
      {value: ethers.utils.parseEther('0.0001')}
      )
      // company 2 from addr1
    txn = await proponContract.connect(addr1).createCompany(
      test_pro_pon2.id,
      test_pro_pon2.name,
      test_pro_pon1.country,
      {value: ethers.utils.parseEther('0.0001')}
      )      
    // company 3 from addr2
    txn = await proponContract.connect(addr2).createCompany(
      test_pro_pon3.id,
      test_pro_pon3.name,
      test_pro_pon1.country,
      {value: ethers.utils.parseEther('0.0001')}
      )              
    // create  rfps for each company
    //owner addr1, addr2 have both type of contest 
    await createRFP(proponContract, owner,0,openContest,listItems1,'0.0001')
    await createRFP(proponContract, owner,1,invitationContest,listItems2,'0.0002')
    await createRFP(proponContract, addr1,2,openContest,listItems3,'0.0001')
    await createRFP(proponContract, addr1,3,invitationContest,items,'0.0002')
    await createRFP(proponContract, addr2,4,openContest,listItems2,'0.0001')
    await createRFP(proponContract, addr2,5,invitationContest,listItems3,'0.0002')
    return { proponContract, owner, addr1, addr2, addr3, addr4, addr5,addr6 };
  }  
  
describe("********************** batchDocuments.js ********************** \nRFPs Documents", function () {
  it("1 Should allow RFP owner to add owner correct-typed documents to Open RFP", async function () {
      const {  proponContract } = await loadFixture(deployProponandRFP);
      let rfpIdx=0
      // insert requesting doc to company RFP
      let doc= await proponContract.addDocuments(
        rfpIdx, 
        docTypesOnwerAllowed,
        DocumentNames,
        DocumentHashes,
        DocumentIdxs
      )
      let documentArray = await proponContract.getDocumentsfromRFP(rfpIdx)
      let document = documentArray[3]
      expect(document.name).to.equal(DocumentNames[3]);
      document = documentArray[7]
      expect(document.name).to.equal(DocumentNames[7]);
      let expectedType = docTypesOnwerAllowed[5]
      expect(docTypesOnwerAllowed[5]).to.equal(expectedType);
       expectedType = docTypesOnwerAllowed[6]
      expect(docTypesOnwerAllowed[6]).to.equal(expectedType);

    });
  
it("2 Should reject RFP owner to add an incorrect-types document to open RFP", async function () {
      const {  proponContract } = await loadFixture(deployProponandRFP);
      let rfpIdx=0
      await expect( proponContract.addDocuments(
        rfpIdx, 
        [IdxDocTypes['documentProposalType']],
        [DocumentNames[2]],
        [DocumentHashes[2]],
        [DocumentIdxs[2]]
      )).to.be.revertedWith('issuer_bad_doctype');
    });
 
it("3 Should reject RFP owner to add correct-type and incorrect-typed files to open RFP", async function () {
      const {  proponContract } = await loadFixture(deployProponandRFP);
      let rfpIdx=0
      await expect( proponContract.addDocuments(
        rfpIdx, 
        [IdxDocTypes['documentProposalType'], // 1st document documentRequestType valid 
        IdxDocTypes['documentProposalType']], //2nd Doc documentProposalType not
        [DocumentNames[0],DocumentNames[2]],
        [DocumentHashes[0],DocumentHashes[2]],
        [DocumentIdxs[0],DocumentIdxs[2]]
      )).to.be.revertedWith('issuer_bad_doctype');
      // shouldn't have uploaded even first file!
      let documents = await proponContract.getDocumentsfromRFP(rfpIdx)
      expect(documents.length).to.equal(0);
    });    

it("4 Should allow RFP owner adding 3 correct-typed files and then reject 1 incorrect-typed files in two different callsto Open RFP", async function () {
      const {  proponContract } = await loadFixture(deployProponandRFP);
      let rfpIdx=0
      //1rst load of 2 owner files correct-typed
      await proponContract.addDocuments(
        rfpIdx, 
        //  documentRequestType &  documentProposalType valids
        [IdxDocTypes['documentRequestType'],IdxDocTypes['documentQandAType']],
        [DocumentNames[0],DocumentNames[1]],
        [DocumentHashes[0],DocumentHashes[1]],
        [DocumentIdxs[0],DocumentIdxs[1]]
      )
      // 2nd upload with one correct-typed file and one wrong
      expect (proponContract.addDocuments(
        rfpIdx, 
        //  documentRequestType valid &  documentPricingOfferingType not valid
        [IdxDocTypes['documentRequestType'],IdxDocTypes['documentPricingOfferingType']],
        [DocumentNames[2],DocumentNames[4]],
        [DocumentHashes[2],DocumentHashes[4]],
        [DocumentIdxs[2],DocumentIdxs[4]]
      )).to.be.revertedWith('issuer_bad_doctype');
      
      // shouldn't have uploaded in second load
      let documents = await proponContract.getDocumentsfromRFP(rfpIdx)
      expect(documents.length).to.equal(2);
    });    
    
it("5 Should allow RFP participant add  2 correct files to Open RFP", async function () {
      const {  proponContract, addr1, addr2, addr3 } = await loadFixture(deployProponandRFP);
      // create RFP with Open Date major than end receiveing date
      let openDate=convertDatesAgo(0) // today 
      let endReceiving=convertDatesAgo(-3) //3 day from now
      let endDate=convertDatesAgo(-9) // 9 days from today
      // create contract with above dates to bypass time limtis added to contract
      await proponContract.connect(addr1).createRFP(
        IDRFP[6],        // name
        nameRfp[6],   // description
        rfpWebLink[6], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )
      let rfpidx=6 // 7th rfp index because we already created 6 at loadfixture function!
      //  addr1, addr3 companies register to first Open RFP of owner company
      await proponContract.connect(addr2).registertoOpenRFP(rfpidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr3).registertoOpenRFP(rfpidx,  {value: ethers.utils.parseEther('0.0001')})
      //1rst load of participants files correct
      await proponContract.connect(addr3).addDocuments(
        rfpidx, 
        //documentProposalType & documentAdministrativeType docs
        [IdxDocTypes['documentProposalType'], // 1st document documentRequestType valid 
        IdxDocTypes['documentAdministrativeType']], //2nd Doc documentAdministrativeType valid
        [DocumentNames[2],DocumentNames[5]], 
        [DocumentHashes[2],DocumentHashes[5]],
        [DocumentIdxs[2],DocumentIdxs[5]]
      )
      let documents = await proponContract.getDocumentsfromRFP(rfpidx)
      expect(documents[1].name).to.equal(DocumentNames[5])
      expect(documents[1].owner).to.equal(addr3.address)
    }); 
   
it("6 Should allow RFP participants to add  2 correct-typed files, then reject 3 files in two different uploads calls to Open RFP", async function () {
      const {  proponContract, addr1, addr2, addr3 } = await loadFixture(deployProponandRFP);
      let openDate=convertDatesAgo(0) // today 
      let endReceiving=convertDatesAgo(-1) //1 day from now
      let endDate=convertDatesAgo(-9) // 9 days from today
      // create contract with above dates to bypass time limtis added to contract
      await proponContract.connect(addr1).createRFP(
        IDRFP[6],        // name
        nameRfp[6],   // description
        rfpWebLink[6], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )
      let rfpidx=6 // 7th rfp index because we already created 6 at loadfixture function!
      //  addr1, addr3 companies register to first Open RFP of owner company
      await proponContract.connect(addr2).registertoOpenRFP(rfpidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr3).registertoOpenRFP(rfpidx,  {value: ethers.utils.parseEther('0.0001')})
      //1rst load of participants files correct
      await proponContract.connect(addr3).addDocuments(
        rfpidx, 
        //documentLegalType:3 & documentFinancialType:5 docs
        [IdxDocTypes['documentLegalType'], IdxDocTypes['documentAdministrativeType']], 
        [DocumentNames[3],DocumentNames[6]], 
        [DocumentHashes[3],DocumentHashes[6]],
        [DocumentIdxs[3],DocumentIdxs[6]]
      )
      // 2nd upload with one correct file and one wrong
      expect (proponContract.connect(addr3).addDocuments(
        rfpidx, 
        //documentLegalType:3 & documentQandAType:1 docs
        [IdxDocTypes['documentFinancialType'], IdxDocTypes['documentQandAType']], 
        [DocumentNames[3],DocumentNames[1]], 
        [DocumentHashes[3],DocumentHashes[1]],
        [DocumentIdxs[3],DocumentIdxs[1]]
        )).to.be.revertedWith('issuer_bad_doctype');
        let documents = await proponContract.getDocumentsfromRFP(rfpidx)
    //   // shouldn't have uploaded in second load
       expect(documents.length).to.equal(2);
   })

it("7 Should allow RFP owner to add  2 correct-typed documents to Invitation RFP", async function () {
    // setup test data
    const {  proponContract, addr1, addr2, addr3 } = await loadFixture(deployProponandRFP);
    let rfpidx=1
    // insert documentRequestType &  documentProposalType valids
    let RFP = await proponContract.getRFPbyIndex(rfpidx)
    await proponContract.addDocuments(
    rfpidx, 
    [IdxDocTypes['documentRequestType'], IdxDocTypes['documentQandAType']], 
    [DocumentNames[0],DocumentNames[1]],
    [DocumentHashes[0],DocumentHashes[1]],
    [DocumentIdxs[0],DocumentIdxs[1]]
  )
      let documents = await proponContract.getDocumentsfromRFP(rfpidx)
    // check that the documents were added to the RFP
    expect(documents.length).to.equal(2);
    expect(documents[0].name).to.equal(DocumentNames[0]);
    expect(documents[0].documentHash).to.equal(DocumentHashes[0]);
    expect(documents[0].idx).to.equal(DocumentIdxs[0]);
    expect(documents[1].name).to.equal(DocumentNames[1]);
    expect(documents[1].documentHash).to.equal(DocumentHashes[1]);
    expect(documents[1].idx).to.equal(DocumentIdxs[1]);
    });
 
it("8 Should allow RFP owner to add 2 correct-typed documents and reject them from adding 2 wrong-typed to Invitation RFP", async function () {
      // setup test data
      const {  proponContract, addr1, addr3 } = await loadFixture(deployProponandRFP);
      let rfpidx=1   // owner.address company, invitation RFP
        // insert documentAmendment &  documentProposalType valids
        await proponContract.addDocuments(
        rfpidx, 
        [IdxDocTypes['documentAmendment'], IdxDocTypes['documentQandAType']], 
        [DocumentNames[0],DocumentNames[1]],
        [DocumentHashes[0],DocumentHashes[1]],
        [DocumentIdxs[0],DocumentIdxs[1]]
      )
        let documents = await proponContract.getDocumentsfromRFP(rfpidx)
      // check that the documents were added to the RFP
      expect(documents.length).to.equal(2);
      expect(documents[0].name).to.equal(DocumentNames[0]);
      expect(documents[0].documentHash).to.equal(DocumentHashes[0]);
      expect(documents[0].idx).to.equal(DocumentIdxs[0]);
      expect(documents[1].name).to.equal(DocumentNames[1]);
      expect(documents[1].documentHash).to.equal(DocumentHashes[1]);
      expect(documents[1].idx).to.equal(DocumentIdxs[1]);
      await expect(proponContract.addDocuments(
        rfpidx, 
        [IdxDocTypes['documentRequestType'], IdxDocTypes['documentProposalType']], // proposaltype wrong for owner
        [DocumentNames[0],DocumentNames[1]],
        [DocumentHashes[0],DocumentHashes[1]],
        [DocumentIdxs[0],DocumentIdxs[1]]
      )).to.be.revertedWith('issuer_bad_doctype'); 
      });

it("9 Should allow RFP invited participant to add 2 correct-typed documents to Invitation RFP", async function () {
    // setup test data
    const {  proponContract, addr1, addr2, addr3 } = await loadFixture(deployProponandRFP);
    // create RFP with correct dates
    let openDate=convertDatesAgo(0) // today 
    let endReceiving=convertDatesAgo(-3) //3 day from now
    let endDate=convertDatesAgo(-9) // 9 days from today
    // create contract with above dates to bypass time limtis added to contract
    await proponContract.connect(addr1).createRFP(
      IDRFP[6],        // name
      nameRfp[6],   // description
      rfpWebLink[6], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      invitationContest,
      listItems1,
      {value: ethers.utils.parseEther('0.0002')}
    )
    let rfpidx=6 // 7th rfp index because we already created 6 at loadfixture function!
    // invite addr1 & addr3 companies to RFP
    await proponContract.connect(addr1).inviteCompaniestoRFP(    
      rfpidx,
      test_pro_pon2.id,                   // Company Id of owner company
      [addr2.address, addr3.address]       // invite addr1 & addr3 companies
      )   
  let RFP= await proponContract.getRFPbyIndex(rfpidx)
    // addr3 company to insert documentRequestType &  documentProposalType valids
   await proponContract.connect(addr3).addDocuments(
    rfpidx, 
    [IdxDocTypes['documentLegalType'], IdxDocTypes['documentPricingOfferingType']], 
    [DocumentNames[0],DocumentNames[1]],
    [DocumentHashes[0],DocumentHashes[1]],
    [DocumentIdxs[0],DocumentIdxs[1]]
    )
    let documents = await proponContract.getDocumentsfromRFP(rfpidx)
    // check that the documents were added to the RFP
    expect(documents.length).to.equal(2);
    expect(documents[0].name).to.equal(DocumentNames[0]);
    expect(documents[0].documentHash).to.equal(DocumentHashes[0]);
    expect(documents[0].idx).to.equal(DocumentIdxs[0]);
    expect(documents[1].name).to.equal(DocumentNames[1]);
    expect(documents[1].documentHash).to.equal(DocumentHashes[1]);
    expect(documents[1].idx).to.equal(DocumentIdxs[1]);
  });
  


it("10 Should allow RFP invited participant to add  2 correct-typed documents and reject 2 incorrect-typed to Invitation RFP", async function () {
 // setup test data
 const {  proponContract, addr1, addr2,  addr3 } = await loadFixture(deployProponandRFP);
 let openDate=convertDatesAgo(0) // today 
 let endReceiving=convertDatesAgo(-10) //1 day from now
 let endDate=convertDatesAgo(-19) // 9 days from today
 // create contract with above dates to bypass time limtis added to contract
 await proponContract.connect(addr1).createRFP(
  IDRFP[6],        // name
  nameRfp[6],   // description
  rfpWebLink[6], // RFP's web site link
   openDate,
   endReceiving,
   endDate,
   invitationContest,
   listItems1,
   {value: ethers.utils.parseEther('0.0002')}
 )
 let rfpidx=6 // 7th rfp index because we already created 6 at loadfixture function!
 // invite addr1 & addr3 companies to RFP
 await proponContract.connect(addr1).inviteCompaniestoRFP(    
   rfpidx,
   test_pro_pon2.id,   // Company Id of addr1
   [addr2.address, addr3.address]       // invite addr3 company
   )   

 // insert correct documentLegalType &  documentPricingOfferingType valids
 await proponContract.connect(addr3).addDocuments(
    rfpidx, 
    [IdxDocTypes['documentLegalType'], 
    IdxDocTypes['documentPricingOfferingType']], 
    [DocumentNames[0],DocumentNames[1]],
    [DocumentHashes[0],DocumentHashes[1]],
    [DocumentIdxs[0],DocumentIdxs[1]]
    )
    let documents = await proponContract.getDocumentsfromRFP(rfpidx)
    // check that the documents were added to the RFP
    expect(documents.length).to.equal(2);
    expect(documents[0].name).to.equal(DocumentNames[0]);
    expect(documents[0].documentHash).to.equal(DocumentHashes[0]);
    expect(documents[0].idx).to.equal(DocumentIdxs[0]);
    expect(documents[1].name).to.equal(DocumentNames[1]);
    expect(documents[1].documentHash).to.equal(DocumentHashes[1]);
    expect(documents[1].idx).to.equal(DocumentIdxs[1]);
    documents = await proponContract.getDocumentsfromRFP(rfpidx)
 
 // insert correct documentLegalType and incorrect documentAmendment 
    await expect(proponContract.connect(addr3).addDocuments(
      rfpidx, 
      [IdxDocTypes['documentLegalType'], IdxDocTypes['documentAmendment']], 
      [DocumentNames[0],DocumentNames[1]],
      [DocumentHashes[0],DocumentHashes[1]],
      [DocumentIdxs[0],DocumentIdxs[1]]
      )).to.be.revertedWith('participant_bad_doctype');
      documents = await proponContract.getDocumentsfromRFP(rfpidx)
      expect(documents.length).to.equal(2)
});


it("11 Should  reject non RFP invited participant to add  2 correct-typed documents to Invitation RFP", async function () {
      // setup test data
      const {  proponContract, addr1, addr3, addr4 } = await loadFixture(deployProponandRFP);
      let rfpidx=1
      // invite addr1 & addr4 companies to RFP
      await proponContract.inviteCompaniestoRFP(    
        rfpidx,
        test_pro_pon1.id,   // Company Id of owner
        [addr1.address, addr4.address]       // invite addr3 company
        )   

      // insert documentProposalType &  documentProposalType valids from non invited addr3
      await expect(proponContract.connect(addr3).addDocuments(
      rfpidx, 
      [IdxDocTypes['documentLegalType'], IdxDocTypes['documentPricingOfferingType']], 
      [DocumentNames[0],DocumentNames[1]],
      [DocumentHashes[0],DocumentHashes[1]],
      [DocumentIdxs[0],DocumentIdxs[1]]
      )).to.be.revertedWith('not_participant');
      let documents = await proponContract.getDocumentsfromRFP(rfpidx)
      // check that the documents were added to the RFP
      expect(documents.length).to.equal(0);
});
   


it("12 Should reject non registered to Open RFP participant to add a correct-typed document", async function () {
        const {  proponContract, addr3 } = await loadFixture(deployProponandRFP);
        let rfpidx=0 // open RFP
        await expect(proponContract.connect(addr3).addDocuments(
          rfpidx, 
          [IdxDocTypes['documentLegalType']], 
          [DocumentNames[0]],
          [DocumentHashes[0]],
          [DocumentIdxs[0]]
          )).to.be.revertedWith('not_participant');
    });
    
it("13 Should reject non invited to invitation RFP participant to add a correct-typed document when there are no one invited", async function () {
        const {  proponContract, addr3 } = await loadFixture(deployProponandRFP);
        let rfpIdx=1
        await expect( proponContract.connect(addr3).addDocuments(
          rfpIdx,
          [IdxDocTypes['documentProposalType']], 
          [DocumentNames[0]],
          [DocumentHashes[0]],
          [DocumentIdxs[0]]
        )).to.be.revertedWith('not_participant');
    });
 
it("14 Should allow RFP registered participants to  add correct-typed documents to open RFP", async function () {
      const {  proponContract,owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployProponandRFP);
      let openDate=convertDatesAgo(0) // today 
      let endReceiving=convertDatesAgo(-10) //1 day from now
      let endDate=convertDatesAgo(-19) // 9 days from today
      // create contract with above dates to bypass time limtis added to contract
      await proponContract.connect(addr2).createRFP(
        IDRFP[6],        // name
        nameRfp[6],   // description
        rfpWebLink[6], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        openContest,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )
      let rfpIdx=6 // 7th rfp index because we already created 6 at loadfixture function!      
      await proponContract.connect(owner).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr1).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr3).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr4).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(owner).addDocuments(
        rfpIdx,
        [IdxDocTypes['documentProposalType']], 
        [DocumentNames[3]],
        [DocumentHashes[3]],
        [DocumentIdxs[3]])
      await proponContract.connect(addr1).addDocuments(
        rfpIdx,
        [IdxDocTypes['documentProposalType']], 
        [DocumentNames[5]],
        [DocumentHashes[5]],
        [DocumentIdxs[5]])
      await proponContract.connect(addr3).addDocuments(
        rfpIdx,
        [IdxDocTypes['documentProposalType']], 
        [DocumentNames[6]],
        [DocumentHashes[6]],
        [DocumentIdxs[6]])                     
      await proponContract.connect(addr4).addDocuments(
        rfpIdx,
        [IdxDocTypes['documentProposalType']], 
        [DocumentNames[7]],
        [DocumentHashes[7]],
        [DocumentIdxs[7]])
        let documents = await proponContract.getDocumentsfromRFP(rfpIdx)
        expect(documents[0].name).to.equal(DocumentNames[3])
        expect(documents[1].name).to.equal(DocumentNames[5])
        expect(documents[2].name).to.equal(DocumentNames[6])
        expect(documents[3].name).to.equal(DocumentNames[7])        
  });

  it("15 Should allow RFP invited participants to add correct-typed adding files to invitation only RFP", async function () {
    const {  proponContract, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployProponandRFP);
    let openDate=convertDatesAgo(0) // today 
    let endReceiving=convertDatesAgo(-10) //1 day from now
    let endDate=convertDatesAgo(-19) // 9 days from today
    // create contract with above dates to bypass time limtis added to contract
    await proponContract.connect(addr2).createRFP(
      IDRFP[6],        // name
      nameRfp[6],   // description
      rfpWebLink[6], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      invitationContest,
      listItems1,
      {value: ethers.utils.parseEther('0.0002')}
    )
    let rfpIdx=6 // 7th rfp index because we already created 6 at loadfixture function!  
    await proponContract.connect(addr2).inviteCompaniestoRFP(
      rfpIdx,
      test_pro_pon3.id,
      [owner.address, addr1.address, addr3.address, addr4.address
    ])
    await proponContract.connect(owner).addDocuments(
      // add 2 correct type (same type both) documents from owner company
      rfpIdx,
      [IdxDocTypes['documentProposalType'],IdxDocTypes['documentProposalType']],
      [DocumentNames[0],DocumentNames[1]],
      [DocumentHashes[0],DocumentHashes[1]],
      [DocumentIdxs[0],DocumentIdxs[1]]
      )
      await proponContract.connect(addr1).addDocuments(
        rfpIdx, 
        //Add two files from documentLegalType:3 & documentFinancialType:5 docs
        [IdxDocTypes['documentLegalType'], IdxDocTypes['documentAdministrativeType']], 
        [DocumentNames[5],DocumentNames[6]], 
        [DocumentHashes[5],DocumentHashes[6]],
        [DocumentHashes[5],DocumentIdxs[6]]
        )
        await proponContract.connect(addr3).addDocuments(
          rfpIdx,
          //Add two files types documentPricingOfferingType & documentLegalType
          [IdxDocTypes['documentPricingOfferingType'], IdxDocTypes['documentAdministrativeType']], 
          [DocumentNames[8],DocumentNames[7]], 
          [DocumentHashes[8],DocumentHashes[7]],
          [DocumentIdxs[8],DocumentIdxs[7]]         
          )          
    await proponContract.connect(addr4).addDocuments(
      rfpIdx,
      //Add two files types documentFinancialType & documentProposalType
      [IdxDocTypes['documentFinancialType'], IdxDocTypes['documentProposalType']], 
      [DocumentNames[2],DocumentNames[9]], 
      [DocumentHashes[2],DocumentHashes[9]],
      [DocumentIdxs[2],DocumentIdxs[9]]
    )          
      let documents = await proponContract.getDocumentsfromRFP(rfpIdx)
     // console.log('Todos los documentos (documentArray):', documents)

      expect(documents[0].name).to.equal(DocumentNames[0])
      expect(documents[0].docType.toNumber()).to.equal(IdxDocTypes['documentProposalType'])
      expect(documents[5].name).to.equal(DocumentNames[7])
      expect(documents[5].docType.toNumber()).to.equal(IdxDocTypes['documentAdministrativeType'])
      expect(documents[3].name).to.equal(DocumentNames[6])
      expect(documents[3].docType.toNumber()).to.equal(IdxDocTypes['documentAdministrativeType'])
      expect(documents[1].name).to.equal(DocumentNames[1])
      expect(documents[1].docType.toNumber()).to.equal(IdxDocTypes['documentProposalType'])
      expect(documents[7].name).to.equal(DocumentNames[9])      
      expect(documents[7].docType.toNumber()).to.equal(IdxDocTypes['documentProposalType'])

});  

it("16 Should allow RFP participants to add correct-typed documents and RFP owner to add correct-typed documents to open RFP", async function () {
  const {  proponContract,owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployProponandRFP);
  let openDate=convertDatesAgo(0) // today 
  let endReceiving=convertDatesAgo(-10) //1 day from now
  let endDate=convertDatesAgo(-19) // 9 days from today
  // create contract with above dates to bypass time limtis added to contract
  await proponContract.connect(addr2).createRFP(
    IDRFP[6],        // name
    nameRfp[6],   // description
    rfpWebLink[6], // RFP's web site link
    openDate,
    endReceiving,
    endDate,
    openContest,
    listItems1,
    {value: ethers.utils.parseEther('0.0002')}
  )
  let rfpIdx=6 // 7th rfp index because we already created 6 at loadfixture function!  
  await proponContract.connect(owner).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr1).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr3).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr4).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
  // Insert participant documents
  await proponContract.connect(addr4).addDocuments(
    rfpIdx,
    [IdxDocTypes['documentProposalType']],
    [DocumentNames[7]],
    [DocumentHashes[7]],
    [DocumentIdxs[7]]
  )
  await proponContract.connect(addr1).addDocuments(
    rfpIdx,
    [IdxDocTypes['documentLegalType']],
    [DocumentNames[0]],
    [DocumentHashes[0]],
    [DocumentIdxs[0]]
    )
   // Insert RFP owner Documents. 
    await proponContract.connect(addr2).addDocuments(
      rfpIdx,
      [IdxDocTypes['documentQandAType'],IdxDocTypes['documentQandAType']],    // same type both docs
      [DocumentNames[1],DocumentNames[2]],
      [DocumentHashes[1],DocumentHashes[2]],
      [DocumentIdxs[1],DocumentIdxs[2]]
    )    
    let documents = await proponContract.getDocumentsfromRFP(rfpIdx)
    expect(documents[0].name).to.equal(DocumentNames[7])
    expect(documents[1].name).to.equal(DocumentNames[0])
    expect(documents[2].name).to.equal(DocumentNames[1])
    expect(documents[3].name).to.equal(DocumentNames[2])

});

it("17 Should allow alternately RFP invited participants to add correct-typed document and RFP owner document to invitation RFP", async function () {
  const {  proponContract,owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployProponandRFP);
  let openDate=convertDatesAgo(0) // today 
  let endReceiving=convertDatesAgo(-10) //1 day from now
  let endDate=convertDatesAgo(-19) // 9 days from today
  // create contract with above dates to bypass time limtis added to contract
  await proponContract.connect(addr2).createRFP(
    IDRFP[6],        // name
    nameRfp[6],   // description
    rfpWebLink[6], // RFP's web site link
    openDate,
    endReceiving,
    endDate,
    invitationContest,
    listItems1,
    {value: ethers.utils.parseEther('0.0002')}
  )
  let rfpIdx=6 // 7th rfp index because we already created 6 at loadfixture function!  
  await proponContract.connect(addr2).inviteCompaniestoRFP(rfpIdx, test_pro_pon3.id,[owner.address,addr1.address,addr3.address,
    addr4.address])
  // RFP participants docs
  await proponContract.connect(owner).addDocuments(
    rfpIdx,
    [IdxDocTypes['documentLegalType']],
    [DocumentNames[0]],
    [DocumentHashes[0]],
    [DocumentIdxs[0]]
    )
  await proponContract.connect(addr2).addDocuments(
    rfpIdx,
    [IdxDocTypes['documentQandAType'],IdxDocTypes['documentQandAType']],    // same type both docs
    [DocumentNames[1],DocumentNames[2]],
    [DocumentHashes[1],DocumentHashes[2]],
    [DocumentIdxs[1],DocumentIdxs[2]]
    )
    // RFP owner docs
    await proponContract.connect(addr2).addDocuments(
      rfpIdx,
      [IdxDocTypes['documentQandAType'],IdxDocTypes['documentQandAType']],    // same type both docs
      [DocumentNames[1],DocumentNames[2]],
      [DocumentHashes[1],DocumentHashes[2]],
      [DocumentIdxs[1],DocumentIdxs[2]]
    )      
  await proponContract.connect(addr3).addDocuments(
    rfpIdx,
    [IdxDocTypes['documentAdministrativeType'],IdxDocTypes['documentPricingOfferingType']],    // same type both docs
      [DocumentNames[3],DocumentNames[4]],
      [DocumentHashes[3],DocumentHashes[4]],
      [DocumentIdxs[3],DocumentIdxs[4]]
      )                      
    let documents = await proponContract.getDocumentsfromRFP(rfpIdx)
    expect(documents[0].name).to.equal(DocumentNames[0])
    expect(documents[0].docType.toNumber()).to.equal(IdxDocTypes['documentLegalType'])
    expect(documents[1].name).to.equal(DocumentNames[1])
    expect(documents[1].docType.toNumber()).to.equal(IdxDocTypes['documentQandAType'])
    expect(documents[2].name).to.equal(DocumentNames[2])
    expect(documents[2].docType.toNumber()).to.equal(IdxDocTypes['documentQandAType'])
    expect(documents[3].name).to.equal(DocumentNames[1])
    expect(documents[3].docType.toNumber()).to.equal(IdxDocTypes['documentQandAType'])
    expect(documents[4].name).to.equal(DocumentNames[2])   
    expect(documents[4].docType.toNumber()).to.equal(IdxDocTypes['documentQandAType'])
    expect(documents[5].name).to.equal(DocumentNames[3])
    expect(documents[5].docType.toNumber()).to.equal(IdxDocTypes['documentAdministrativeType'])
    expect(documents[6].name).to.equal(DocumentNames[4])
    expect(documents[6].docType.toNumber()).to.equal(IdxDocTypes['documentPricingOfferingType'])    
    
});

it("18 Should reject a non RFP owner to invite companies", async function () {
  const {  proponContract, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployProponandRFP);
  let rfpIdx=1  // Invitation RFP issued by owner
  await expect(proponContract.connect(addr2).inviteCompaniestoRFP(  // inviting from non RFP owing company add2
    rfpIdx,
    test_pro_pon3.id,
    [owner.address, addr1.address,  addr4.address])) // addr3 company not invited    
    .to.be.revertedWith('Only_issuer_can_perform')
});

it("19 Should reject non invited to invitation RFP participant to add a correct-typed document when there are others invited", async function () {
  const {  proponContract, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployProponandRFP);
  let rfpIdx=5
  await proponContract.connect(addr2).inviteCompaniestoRFP(
    rfpIdx,
    test_pro_pon3.id,
    [owner.address, addr1.address,  addr4.address] // addr3 company not invited
    )
  await expect( proponContract.connect(addr3).addDocuments(
    rfpIdx,
    [IdxDocTypes['documentProposalType']], 
    [DocumentNames[0]],
    [DocumentHashes[0]],
    [DocumentIdxs[0]]
  )).to.be.revertedWith('not_participant');
});

it("20 Should reject RFP invited participant to add correct-typed documents to Invitation RFP when receving date is reached", async function () {
  // setup test data
  const {  proponContract, addr1, addr2, addr3 } = await loadFixture(deployProponandRFP);
  // create RFP with correct dates
  let openDate=convertDatesAgo(0) - (20 * 60) // now
  let endReceiving=convertDatesAgo(0) - (10 * 60) // 
  let endDate=convertDatesAgo(-9) // 9 days from today
  // create contract with above dates to bypass time limtis added to contract
  await proponContract.connect(addr1).createRFP(
    IDRFP[6],        // name
    nameRfp[6],   // description
    rfpWebLink[6], // RFP's web site link
    openDate,
    endReceiving,
    endDate,
    invitationContest,
    listItems1,
    {value: ethers.utils.parseEther('0.0002')}
  )
  let rfpidx=6 // 7th rfp index because we already created 6 at loadfixture function!
  // invite addr1 & addr3 companies to RFP
  await proponContract.connect(addr1).inviteCompaniestoRFP(    
    rfpidx,
    test_pro_pon2.id,                   // Company Id of owner company
    [addr2.address, addr3.address]       // invite addr1 & addr3 companies
    )   
  // addr3 company to insert documentRequestType &  documentProposalType valids
 await expect(proponContract.connect(addr3).addDocuments(
  rfpidx, 
  [IdxDocTypes['documentLegalType'], IdxDocTypes['documentPricingOfferingType']], 
  [DocumentNames[0],DocumentNames[1]],
  [DocumentHashes[0],DocumentHashes[1]],
  [DocumentIdxs[0],DocumentIdxs[1]]
  )).to.be.revertedWith('end_receiving_reached')
});

it("21 Should reject RFP OPEN registered participant to add correct-typed documents  when receving date has been reached", async function () {
  // setup test data
  const {  proponContract, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployProponandRFP);
  // create RFP with correct dates
  
  let openDate=convertDatesAgo(0) - (20 * 60) // today
  let endReceiving=convertDatesAgo(0) - (10 * 60)
  let endDate=convertDatesAgo(-11) // 9 days into future, i.e. is short 1 day that receiving dateline

  // create contract with above dates to bypass time limtis added to contract
  await proponContract.connect(addr1).createRFP(
    IDRFP[6],        // name
    nameRfp[6],   // description
    rfpWebLink[6], // RFP's web site link
    openDate,
    endReceiving,
    endDate,
    openContest,
    listItems1,
    {value: ethers.utils.parseEther('0.0002')}
  )
  let rfpIdx=6 // 7th rfp index because we already created 6 at loadfixture function!
  // invite addr1 & addr3 companies to RFP
  await proponContract.connect(owner).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr2).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr3).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr4).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')}) 
  // addr3 company to insert documentRequestType &  documentProposalType valids
 await expect(proponContract.connect(addr3).addDocuments(
  rfpIdx, 
  [IdxDocTypes['documentLegalType'], IdxDocTypes['documentPricingOfferingType']], 
  [DocumentNames[0],DocumentNames[1]],
  [DocumentHashes[0],DocumentHashes[1]],
  [DocumentIdxs[0],DocumentIdxs[1]]
  )).to.be.revertedWith('end_receiving_reached')
});
})
