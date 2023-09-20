7
/**
 * FOR THIS SCRIPT TO RUN FOLLOWINNG CONSTANTS IN CONTRACT MUST BE SET TO 
*   MAX_GUEST_OPEN_TENDER = 5
*   MAX_GUEST_INVITATION_TENDER = 5
*/

const { expect } = require("chai")
//const { describe, it } = require("mocha")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


// Test for creating RFP for Pro-pon 0.2.0
// Open & Invitation RFPs have different prices

const test_pro_pon1 = {
    id: "CLI160511W1M",
    name: "Clionautacion",
    country: "MEX"
  }   

const test_pro_pon2 = {
    id: "0455-3443",
    name: "Flexamatic Inc",
    country: "USA"
  }     

const test_pro_pon3 = {
    id: "243 SI344033424",
    name: "Courient llc",
    country: "CAN"
  }     

 const test_pro_pon4 = {
    id: "MOM090815V8A",
    name: "Materiales Ferromagnetosos S.A.",
    country: "MEX"
  }     

  const test_pro_pon5 = {
    id: "LUCI031129X0",
    name: "Quantum Luminica S.A.",
    country: "MEX"
  }     

  const test_pro_pon6 = {
    id: "VANT040325V8A",
    name: "Hnos Lavanta S.A.",
    country: "MEX"
  }     

  const test_pro_pon7 = {
    id: "LIMT200505S09",
    name: "Pesqueria Laguna de Terminos S.A.",
    country: "MEX"
  }     

  function convertDate(date)   {
    return unixdate=Math.floor(new Date(date).getTime()/1000)
  }

  // Returns today minus daysAgo 
  // for future dates call with negative param
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
    return `${dd}/${mmm}/${yyyy}`;
  }

  const ContestType = {OPEN:0, INVITATION:1}
  // const  openContest = ContestType.OPEN 
  // const  invitationContest = ContestType.INVITATION_ONLY 

  // Id RFP is the RFP name field at pro-pon contract
  let IDofRFPArray=[
    'LPN3094-3912-4',
    'REGISTRO NACIONAL DE PROVEEDURIA. CONCURSO L3403-SAD. DEPTO. DE COMERCIO E INDUSTRA',
    'CON CARACTERES UTF-8 ñÑ!¿ TF Éé, Èè, Êê, Ëë. Œœ 传/傳 Îî, ÏïÔôÙ ù pê, Û û, Ü ü Ÿ ÿ 漢字 汉字 Ğ	ğ Ð Ý Þ ð ý þ ',
    'LPX29003412-001',
    'LPI030223-7203-00013-4542-245665-214567-87908975-3',
    '0232-COV-659-023L',
  ]
  // name RFP is description field in pro-pon contrat
  let nameRfp=[ 
    'Reacondicionamiento de Luminarias',
    'Cleaning Services',
    'Déneigement des installations',
    'Sistema electronico de Votación',
    '2022-2023 Translations Services',
    'Service de transport des employés']

    let rfpWebLink=[ 
      'https://www.locazon.com/progress-tracker/package/ref=pe_386ds0_4553248370_TE_SIMP_typ_T?_encoding=UTF8&from=gp&itemId=&orderId=114-9127329-3803961&packageIndex=0&shipmentId=200350996242434200',
      'https://bdael.deggrtex.mx/u/0/#tiduo/WhcdKKkXl8gJXdmrwtWasdKCRZQlWCSJtVBChHGAs564mnSRqFFGCQXLmKfCgqLbQFdHSjtyt',
      'http://morels.wwe.mx/MP_typ_T?_encoding=UTF8&from=gp&itemId=&orderId=114-9127329-3803961&packageIndex=0WhcdKKkXl8gJXdmrwtWasdKCRZQlWCSJtVBChHGAs564mnSRqFFGCQXLmKfCgqLbQFdHSjtyt',
      'https://www.apratmse.com/-/es/b?node=16225005011&pf_rd_r=N62KCHHDBD52V0HCXRFD&pf_rd_p=27f4d66c-efe3-4ee0-a6bf-6cfd06f31a84&pd_rd_r=ba0a45fc-ef91-423f-aacb-2fab6ef4bf5d&pd_rd_w=jkE5h&pd_rd_wg=9VC7C&ref_=pd_gw_unk',
      '',
      'http://lnc.it/-/Toallitas-paquetes-fragancia/dp/B07H53W5WP/ref=lp_16225005011_1_3'
    ]

// let openDate=convertDate('2022/07/24')
// let endReceiving=convertDate('2022/08/10')
// let endDate=convertDate('2022/08/30')        


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

const createRFP = async (proponContract, address, RFPNameIdx, ContestType, ItemsList, value) => {
  let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
  let endReceiving=convertDatesAgo(-1) // one day from now
  let endDate=convertDatesAgo(-2)  // two day from now

  await proponContract.connect(address).createRFP(
    IDofRFPArray[RFPNameIdx],
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
 


  async function deployProponandCreateCompanies() {
    // Get the ContractFactory and Signers here.
    const [owner, addr1, addr2, addr3, addr4, addr5,addr6] = await ethers.getSigners();
    // const propon = await ethers.getContractFactory("pro_pon");
    // const proponContract = await propon.deploy();

    const proponData = await ethers.getContractFactory("pro_ponData");
    const proponDataContract = await proponData.deploy();
    // console.log('proponDataContract',proponDataContract.address)
    // console.log('owner of proponDataContract', await proponDataContract.getOwner());

    const proponLogic = await ethers.getContractFactory("pro_ponLogic");
    const proponLogicContract = await proponLogic.deploy(proponDataContract.address);

    // console.log('proponLogicContract', proponLogicContract.address)
    // console.log('Setting Datacontract owner')
    await proponDataContract.setOwner(proponLogicContract.address)



    
    //company 1 from owner account
    let txn = await proponLogicContract.createCompany(
      test_pro_pon1.id,
      test_pro_pon1.name,
      test_pro_pon1.country,
      {value: ethers.utils.parseEther('0.0001')}
      )
      // company 2 from addr1 account
    txn = await proponLogicContract.connect(addr1).createCompany(
        test_pro_pon2.id,
        test_pro_pon2.name,
        test_pro_pon2.country,
        {value: ethers.utils.parseEther('0.0001')}
        )      
    // company 3 from addr2 account
    txn = await proponLogicContract.connect(addr2).createCompany(
        test_pro_pon3.id,
        test_pro_pon3.name,
        test_pro_pon3.country,
        {value: ethers.utils.parseEther('0.0001')}
        ) 

    // company 4 from addr3
    txn = await proponLogicContract.connect(addr3).createCompany(
      test_pro_pon4.id,
      test_pro_pon4.name,
      test_pro_pon4.country,
      {value: ethers.utils.parseEther('0.0001')}
      ) 
    
    // company 5 from addr4
    txn = await proponLogicContract.connect(addr4).createCompany(
      test_pro_pon5.id,
      test_pro_pon5.name,
      test_pro_pon5.country,
      {value: ethers.utils.parseEther('0.0001')}
      ) 

      // company 6 from addr5
      txn = await proponLogicContract.connect(addr5).createCompany(
      test_pro_pon6.id,
      test_pro_pon6.name,
      test_pro_pon6.country,
      {value: ethers.utils.parseEther('0.0001')}
      ) 

      // company 7 from addr6
      txn = await proponLogicContract.connect(addr6).createCompany(
        test_pro_pon7.id,
        test_pro_pon7.name,
        test_pro_pon7.country,
        {value: ethers.utils.parseEther('0.0001')}
        ) 

    // return { proponContract, owner, addr1, addr2, addr3, addr4, addr5,addr6 };
    // Fixtures can return anything you consider useful for your tests
    return { proponDataContract, proponLogicContract, owner, addr1, addr2, addr3, addr4, addr5, addr6 };
  }  
    
  const bgn0=ethers.BigNumber.from(0)
  const bgn1=ethers.BigNumber.from(1)
  const bgn2=ethers.BigNumber.from(2)
  const bgn3=ethers.BigNumber.from(3)
  const bgn4=ethers.BigNumber.from(4)
  const bgn6=ethers.BigNumber.from(5)

  async function RegistertoRFP(address, contract, rfpIdx) {
    await contract.connect(address).registertoOpenRFP(rfpIdx,  {value: ethers.utils.parseEther('0.0001')})
  }

  describe(`**********************  RFPs3.js **********************\nCreate Open RFPs for 1 company with rigth price with owner account`, function () {
  it("1 Should create an OPEN Contest  RFP", async function () {
    const { proponDataContract, proponLogicContract,  owner } = await loadFixture(deployProponandCreateCompanies);
    // create Open RFP
    let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
    let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
    let endDate=convertDatesAgo(0) -(2 * 60)  // Now
    await proponLogicContract.connect(owner).createRFP(
      IDofRFPArray[3],        // name
      nameRfp[3],   // description
      rfpWebLink[3], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN, 
      listItems1,
      {value: ethers.utils.parseEther('0.0001')}
    )
    let company= await proponDataContract.getCompany(owner.address)
    const rfp=await company.company_RFPs[0]
    //console.log('toString del rfp que no es funcion:',typeof rfp.toNumber())
    let RFPidx = await company.company_RFPs[0]  // retrieve first RFP of this company
    let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
    expect(RFP.name).to.equal(IDofRFPArray[3]);
  });
  
  it("2 Should create an INVITATION Contest  RFP with rigth price  for addr1 account", async function () {
    const { proponDataContract, proponLogicContract, addr1 } = await loadFixture(deployProponandCreateCompanies);
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      // create Invitation RFP
      await proponLogicContract.connect(addr1).createRFP(
        IDofRFPArray[2],        // name
        nameRfp[2],   // description
        rfpWebLink[2], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )
      let company= await proponDataContract.getCompany(addr1.address)
      let RFPidx = await company.company_RFPs[0]  // retrieve first RFP of this company
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.name).to.equal(IDofRFPArray[2]);
    });
      
    it("3 Should fail with Insufficient_payment msg when creating creating OPEN RFP with underpriced Tx", async function () {
      const { proponDataContract, proponLogicContract, addr2 } = await loadFixture(deployProponandCreateCompanies);
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await expect (proponLogicContract.connect(addr2).createRFP(
        IDofRFPArray[3],        // name
        nameRfp[3],   // description
        rfpWebLink[3], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN, 
        listItems1,
        {value: ethers.utils.parseEther('0.00001')}
      )).to.be.revertedWith("Insufficient_payment")
    });

    it("4 Should fail with Insufficient_payment msg when creating INVITATION RFP with underpriced Tx", async function () {
      const { proponDataContract,  proponLogicContract,   addr3 } = await loadFixture(deployProponandCreateCompanies);
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await expect (proponLogicContract.connect(addr3).createRFP(
        IDofRFPArray[1],        // name
        nameRfp[1],   // description
        rfpWebLink[1], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems1,
        {value: ethers.utils.parseEther('0.0001')}
      )).to.be.revertedWith("Insufficient_payment")
    });
    
    it("5 Should retrieve addr1 company second (INVITATION) RFP from its own  record array", async function () {
      const { proponDataContract,  proponLogicContract,  addr1 } = await loadFixture(deployProponandCreateCompanies);
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await proponLogicContract.connect(addr1).createRFP(
        IDofRFPArray[4],        // name
        nameRfp[4],   // description
        rfpWebLink[4], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN, 
        listItems3,
        {value: ethers.utils.parseEther('0.0001')}
      ) 
      await proponLogicContract.connect(addr1).createRFP(
        IDofRFPArray[3],        // name
        nameRfp[3],   // description
        rfpWebLink[3], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      ) 
      let company= await proponDataContract.getCompany(addr1.address)
      let RFPidx = await company.company_RFPs[1]  // retrieve second RFP of this company
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.name).to.equal(IDofRFPArray[3]);
      expect(RFP.items.length).to.equal(listItems2.length);
      expect(RFP.items[5]).to.equal(listItems2[5]);
      expect(RFP.contestType).to.equal(ContestType.INVITATION);
    });

    it("6 Should reject creating an Invitation RFP with the same RFP ID it had created before", async function () {
      const { proponDataContract,  proponLogicContract,  addr1 } = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, addr1, 4, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 0, ContestType.OPEN, items, '0.0002')
      await createRFP(proponLogicContract, addr1, 1, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 2, ContestType.OPEN, items, '0.0002')
      await createRFP(proponLogicContract, addr1, 3, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 5, ContestType.OPEN, items, '0.0002')
      // check last RFP created alright
      let company= await proponDataContract.getCompany(addr1.address)
      let RFPidx = company.company_RFPs[5]  // retrieve sixth RFP of this company
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.name).to.equal(IDofRFPArray[5]);
      // try to create 6th RFP reusing ID number 5
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await expect( proponLogicContract.connect(addr1).createRFP(
        IDofRFPArray[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )).to.be.revertedWith('rfpid_already_taken')
    });   
    
    it("7 Should reject creating an Open RFP with the same RFP ID it had created before", async function () {
      const { proponDataContract,  proponLogicContract,  addr1 } = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, addr1, 4, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 0, ContestType.INVITATION, items, '0.0002')
      await createRFP(proponLogicContract, addr1, 1, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 2, ContestType.INVITATION, items, '0.0002')
      await createRFP(proponLogicContract, addr1, 3, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 5, ContestType.INVITATION, items, '0.0002')
      // check last RFP created alright
      let company= await proponDataContract.getCompany(addr1.address)
      let RFPidx = company.company_RFPs[5]  // retrieve sixth RFP of this company
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.name).to.equal(IDofRFPArray[5]);
      // try to create 6th RFP reusing ID number 5
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await expect( proponLogicContract.connect(addr1).createRFP(
        IDofRFPArray[5],        // name
        nameRfp[5],   // description
        rfpWebLink[5], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )).to.be.revertedWith('rfpid_already_taken')
    });     

    it("8 Should reject creating an Invitation RFP with the same RFP ID it had created before on OPEN RFP", async function () {
      const { proponDataContract,  proponLogicContract,  addr1 } = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, addr1, 4, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 0, ContestType.OPEN, items, '0.0002')
      await createRFP(proponLogicContract, addr1, 1, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 2, ContestType.OPEN, items, '0.0002')
      await createRFP(proponLogicContract, addr1, 3, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 5, ContestType.OPEN, items, '0.0002')
      // check last RFP created alright
      let company= await proponDataContract.getCompany(addr1.address)
      let RFPidx = company.company_RFPs[5]  // retrieve sixth RFP of this company
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.name).to.equal(IDofRFPArray[5]);
      // try to create 6th RFP reusing ID number 5
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await expect( proponLogicContract.connect(addr1).createRFP(
        IDofRFPArray[4],        // name
        nameRfp[4],   // description
        rfpWebLink[4], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )).to.be.revertedWith('rfpid_already_taken')
    });   

    it("9 Should assign correct global Index to RFP", async function () {
      const { proponDataContract,  proponLogicContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 4, ContestType.OPEN, listItems3, '0.0002')  //1rst
      await createRFP(proponLogicContract, addr1, 0, ContestType.INVITATION, items, '0.0002')  //2nd
      await createRFP(proponLogicContract, addr2, 1, ContestType.OPEN, listItems3, '0.0002')   // 3rd
      await createRFP(proponLogicContract, addr3, 2, ContestType.OPEN, listItems2, '0.0002')   // 4th
      await createRFP(proponLogicContract, addr4, 3, ContestType.INVITATION, listItems3, '0.0002') // 5th
      await createRFP(proponLogicContract, addr5, 5, ContestType.INVITATION, items, '0.0002')     // 6th
      await createRFP(proponLogicContract, addr6, 3, ContestType.OPEN, listItems2, '0.0002')     // 7th
      // check 3rd RFP created alright (index 2)
      let RFP = await proponDataContract.getRFPbyIndex(2)
      expect(RFP.name).to.equal(IDofRFPArray[1]);    // it was assgined at 3rd RFP
      expect(RFP.rfpIndex).to.equal(2);    // it was assigned at 3rd RFP
      // check 7th RFP created alright (index 6)
      RFP = await proponDataContract.getRFPbyIndex(6)   // 7th RFP
      expect(RFP.rfpIndex.toNumber()).to.equal(6);    // 
    });   

    it("10 Should record correctly weblink in RFP", async function () {
      const { proponDataContract,  proponLogicContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 4, ContestType.OPEN, listItems3, '0.0002')  //1rst
      await createRFP(proponLogicContract, addr1, 0, ContestType.INVITATION, items, '0.0002')  //2nd
      await createRFP(proponLogicContract, addr2, 1, ContestType.OPEN, listItems3, '0.0002')   // 3rd
      await createRFP(proponLogicContract, addr3, 2, ContestType.OPEN, listItems2, '0.0002')   // 4th
      await createRFP(proponLogicContract, addr4, 3, ContestType.INVITATION, listItems3, '0.0002') // 5th
      await createRFP(proponLogicContract, addr5, 5, ContestType.INVITATION, items, '0.0002')     // 6th
      await createRFP(proponLogicContract, addr6, 3, ContestType.OPEN, listItems2, '0.0002')     // 7th
      // check 3rd RFP created alright (index 2)
      let RFP = await proponDataContract.getRFPbyIndex(2)
      expect(RFP.rfpwebsite).to.equal(rfpWebLink[1]);    // it was assgined at 3rd RFP
      
    });   

    it("11 Should allow use a previously used RFP Id but from a different Issuer account", async function () {
      const { proponDataContract,  proponLogicContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 4, ContestType.OPEN, listItems3, '0.0002')  //1rst
      await createRFP(proponLogicContract, addr1, 0, ContestType.INVITATION, items, '0.0002')  //2nd
      await createRFP(proponLogicContract, addr2, 1, ContestType.OPEN, listItems3, '0.0002')   // 3rd
      await createRFP(proponLogicContract, addr3, 2, ContestType.OPEN, listItems2, '0.0002')   // 4th
      await createRFP(proponLogicContract, addr4, 3, ContestType.INVITATION, listItems3, '0.0002') // 5th
      await createRFP(proponLogicContract, addr5, 5, ContestType.INVITATION, items, '0.0002')     // 6th
      await createRFP(proponLogicContract, addr6, 3, ContestType.OPEN, listItems2, '0.0002')     // 7th
      // check 3rd RFP created alright (index 2)
      // IDofRFPArray[1] Has been used byt company addr2, now reuse it for addr4, it should allow it
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await  proponLogicContract.connect(addr4).createRFP(
        IDofRFPArray[1],        // name
        nameRfp[1],   // description
        rfpWebLink[1], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )
      let RFP = await proponDataContract.getRFPbyIndex(7) // retrieve las one
      expect(RFP.name).to.equal(IDofRFPArray[1]);    // it was assgined at 3rd RFP
    });  

    it("12 Should reject use a previously used RFP with UTF-8 chars", async function () {
      const { proponDataContract,  proponLogicContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 4, ContestType.OPEN, listItems3, '0.0002')  //1rst
      await createRFP(proponLogicContract, addr1, 0, ContestType.INVITATION, items, '0.0002')  //2nd
      await createRFP(proponLogicContract, addr2, 1, ContestType.OPEN, listItems3, '0.0002')   // 3rd
      await createRFP(proponLogicContract, addr3, 2, ContestType.OPEN, listItems2, '0.0002')   // 4th with UTF chars
      await createRFP(proponLogicContract, addr4, 3, ContestType.INVITATION, listItems3, '0.0002') // 5th
      await createRFP(proponLogicContract, addr5, 5, ContestType.INVITATION, items, '0.0002')     // 6th
      await createRFP(proponLogicContract, addr6, 3, ContestType.OPEN, listItems2, '0.0002')     // 7th
      // check 3rd RFP created alright (index 2)
      // IDofRFPArray[2] with UTF-8 chars reused by same addr3
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await expect (proponLogicContract.connect(addr3).createRFP(
        IDofRFPArray[2],        // name
        nameRfp[2],   // description
        rfpWebLink[2], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )).to.be.revertedWith('rfpid_already_taken')
      let RFP = await proponDataContract.getRFPbyIndex(3) // retrieve las one
    }); 

    it("13 Should accept when there are trailing leading spaces with UTF-8 chars making it different", async function () {
      const { proponDataContract,  proponLogicContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 4, ContestType.OPEN, listItems3, '0.0002')  //1rst
      await createRFP(proponLogicContract, addr1, 0, ContestType.INVITATION, items, '0.0002')  //2nd
      await createRFP(proponLogicContract, addr2, 1, ContestType.OPEN, listItems3, '0.0002')   // 3rd
      await createRFP(proponLogicContract, addr3, 2, ContestType.OPEN, listItems2, '0.0002')   // 4th with UTF chars
      await createRFP(proponLogicContract, addr4, 3, ContestType.INVITATION, listItems3, '0.0002') // 5th
      await createRFP(proponLogicContract, addr5, 5, ContestType.INVITATION, items, '0.0002')     // 6th
      await createRFP(proponLogicContract, addr6, 3, ContestType.OPEN, listItems2, '0.0002')     // 7th
      // check 3rd RFP created alright (index 2)
      // IDofRFPArray[2] with trailing spaces with UTF-8 chars used by same addr3
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await proponLogicContract.connect(addr3).createRFP(
        '  ' + IDofRFPArray[2] + ' ',        // name
        nameRfp[2],   // description
        rfpWebLink[2], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )
      let RFP = await proponDataContract.getRFPbyIndex(3) // retrieve las one
    });     

    it("14 Should reject reusing RFP ID event when there are trailing leading spaces with UTF-8 chars", async function () {
      const { proponDataContract,  proponLogicContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 4, ContestType.OPEN, listItems3, '0.0002')  //1rst
      await createRFP(proponLogicContract, addr1, 0, ContestType.INVITATION, items, '0.0002')  //2nd
      await createRFP(proponLogicContract, addr2, 1, ContestType.OPEN, listItems3, '0.0002')   // 3rd
      await createRFP(proponLogicContract, addr3, 2, ContestType.OPEN, listItems2, '0.0002')   // 4th with UTF chars
      await createRFP(proponLogicContract, addr4, 3, ContestType.INVITATION, listItems3, '0.0002') // 5th
      await createRFP(proponLogicContract, addr5, 5, ContestType.INVITATION, items, '0.0002')     // 6th
      await createRFP(proponLogicContract, addr6, 3, ContestType.OPEN, listItems2, '0.0002')     // 7th
      // check 3rd RFP created alright (index 2)
      // IDofRFPArray[2] with trailing spaces with UTF-8 chars used by same addr3
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await proponLogicContract.connect(addr3).createRFP(
        '  ' + IDofRFPArray[2] + ' ',        // name
        nameRfp[2],   // description
        rfpWebLink[2], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )
      // now reuse it with trailing leading spaces
      await expect (proponLogicContract.connect(addr3).createRFP(
        IDofRFPArray[2],        // name
        nameRfp[2],   // description
        rfpWebLink[2], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )).to.be.revertedWith('rfpid_already_taken')      
    });     
  });

  describe("Record participant invitation companies to RFP ", function () {
    it("1 Should record invitation to owner company to second contest (invitation contest) of addr2 company", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr2 } = await loadFixture(deployProponandCreateCompanies);
      // create 2 Open & Invitation RFPs  for company addr2
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(-1) // 1 day from now
      let endDate=convertDatesAgo(-2)   // 2 day from now
      await proponLogicContract.connect(addr2).createRFP(
        IDofRFPArray[1],        // name
        nameRfp[1],   // description
        rfpWebLink[1], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN, 
        listItems3,
        {value: ethers.utils.parseEther('0.0001')}
      ) 
      await proponLogicContract.connect(addr2).createRFP(
        IDofRFPArray[2],        // name
        nameRfp[2],   // description
        rfpWebLink[2], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION, 
        listItems2,
        {value: ethers.utils.parseEther('0.0002')}
      )       
      // get addr2 company record
      let company= await proponDataContract.getCompany(addr2.address)
      // retrieve second RFP of addr2 company
      let RFPidx = await company.company_RFPs[1]  // second contest is invitation type
      //let rfp= await proponDataContract.getRFPbyIndex(RFPidx)
      // let addr2 invite owner to second RFP (Invitation)
      await proponLogicContract.connect(addr2).inviteCompaniestoRFP(
        RFPidx,
        test_pro_pon3.id, // ID of owner account
        [owner.address]     // owner account
       )  
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.participants[0]).to.equal(owner.address);
    });

    it("2 Should ignore addr1 company invitation to self", async function () {
      const { proponDataContract,  proponLogicContract,  addr1 } = await loadFixture(deployProponandCreateCompanies);
      // get first company record
      // create RFPs
      await createRFP(proponLogicContract, addr1, 3, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponLogicContract, addr1, 4, ContestType.INVITATION, items, '0.0002')
      // retrieve second RFP of this company
      let company= await proponDataContract.getCompany(addr1.address)
      let RFPidx = await company.company_RFPs[1]  
      expect(proponLogicContract.connect(addr1).inviteCompaniestoRFP(
            RFPidx,
            test_pro_pon2.id,
            [addr1.address]))
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.participants.length).to.equal(0)
    });    

    it("3 Should invitate two companies to Invitation second RFP of owner company", async function () {
      const { proponDataContract,  proponLogicContract,  owner, addr1, addr2 } = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 3, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponLogicContract, owner, 0, ContestType.INVITATION, items, '0.0002')
      // retrieve second RFP of this company
      let company= await proponDataContract.getCompany(owner.address)      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  
      await proponLogicContract.inviteCompaniestoRFP(  // invite first company (addr1)
      RFPidx,
      test_pro_pon1.id,
      [addr1.address] )
      await proponLogicContract.inviteCompaniestoRFP(  // invite second company (addr2)
      RFPidx,
      test_pro_pon1.id,
      [addr2.address] )
      // get company record
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      //check participants first (addr2) and second (addr1) participants to RFP 
      expect(RFP.participants[0]).to.equal(addr1.address);
      expect(RFP.participants[1]).to.equal(addr2.address);
    });    

    it("4 Should ignore invitation to a company already invited ", async function () {
      const { proponDataContract,  proponLogicContract,   addr2, addr1} = await loadFixture(deployProponandCreateCompanies);
      // create RFPs
      await createRFP(proponLogicContract, addr2, 3, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
      await createRFP(proponLogicContract, addr2, 0, ContestType.INVITATION, items, '0.0002')
      // get  company record
      let company= await proponDataContract.getCompany(addr2.address)
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  
      await proponLogicContract.connect(addr2).inviteCompaniestoRFP(    // invite addr1 company first time
        RFPidx,
        test_pro_pon3.id,
        [addr1.address])
      // check is indeed invited
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
        expect(RFP.participants[0]).to.equal(addr1.address);        
     // try to invite addr1 company again, should ignore
      await proponLogicContract.connect(addr2).inviteCompaniestoRFP(
        RFPidx,
        test_pro_pon3.id,
        [addr1.address])
      RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.participants.length).to.equal(1)
    });   
    
    it("5 Should reject not RFP issuer invitation when company Id is wrong", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1, addr2 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponLogicContract, owner, 0, ContestType.OPEN, listItems2, '0.0002') 
      await createRFP(proponLogicContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
      // get RFP owner company record
      let company= await proponDataContract.getCompany(owner.address)
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // company from addr1
      await expect(proponLogicContract.inviteCompaniestoRFP(    // try to invite addr2 company from owner account
        RFPidx,               
        test_pro_pon2.id,                                 // with worng COmpany Id (should be test_pro_pon1.id)
        [addr2.address]
        )).to.be.revertedWith("Only_admin_can_perform")
    });   

    it("6 Should reject not issuer company invitation when posing  as issuer company Id", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1, addr2 } = await loadFixture(deployProponandCreateCompanies);
        // create RFP
        await createRFP(proponLogicContract, owner, 2, ContestType.OPEN, listItems2, '0.0002') 
        await createRFP(proponLogicContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
      // get RFP owner company record
      let company= await proponDataContract.getCompany(owner.address) 
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company
      await expect(proponLogicContract.connect(addr1).inviteCompaniestoRFP(    // addr1 trying pass as owner
        RFPidx,
        test_pro_pon1.id,   // possing as Company Id of owner
        [addr2.address]       // invite addr2 company
        )).to.be.revertedWith("Only_admin_can_perform")
    });       

    it("7 Should reject a company inviting guest to  another company invitation RFP", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponLogicContract, owner, 0, ContestType.OPEN, listItems2, '0.0002') 
      await createRFP(proponLogicContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
      // get RFP owner company record
      let company= await proponDataContract.getCompany(owner.address)
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // owner company invitation RFP
      // addr3 try to invite addr2 company to owner RFP 
      // it should be rejected by validator of company id vs address (only_admin_can_perfomr)
      await expect(proponLogicContract.connect(addr3).inviteCompaniestoRFP(    
        RFPidx,               
        test_pro_pon5.id, // correct add3 company Id
        [addr2.address]
        )).to.be.revertedWith("Only_admin_can_perform")
    });   
    
    it("8 Should reject a company inviting guests to another companys RFP", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponLogicContract, owner, 0, ContestType.OPEN, listItems2, '0.0002') 
      await createRFP(proponLogicContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
      // get RFP owner company record
      let company= await proponDataContract.getCompany(owner.address)
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // company from addr1
      // try to pass invite addr2 company from addr3 account with its own company Id
      // will be detected not by checking company Id to address but RFP belonging to address
      await expect(proponLogicContract.connect(addr3).inviteCompaniestoRFP(    
        RFPidx,               
        test_pro_pon4.id, // right company Id, but RFP is not owned by company addr3
        [addr2.address]
        )).to.be.revertedWith("Only_issuer_can_perform")
    });


    it("9 Should reject a non owner of RFP inviting guests", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponLogicContract, owner, 0, ContestType.OPEN, listItems2, '0.0002') 
      await createRFP(proponLogicContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
      // get RFP owner company record
      let company= await proponDataContract.getCompany(owner.address)
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // company from addr1
      // try to pass invite addr2 company from addr3 account posing as owner address
      await expect(proponLogicContract.connect(addr3).inviteCompaniestoRFP(    
        RFPidx,               
        test_pro_pon1.id,                                 // posing as owner
        [addr2.address]
        )).to.be.revertedWith("Only_admin_can_perform")
    });   

  });

  describe("Record participant registration to OPEN and INVITATION RFPs ", function () {
    it("10 Should reject a company trying to register to INVITATION RFP", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1 } = await loadFixture(deployProponandCreateCompanies);
     // create RFPs
     await createRFP(proponLogicContract, owner, 3, ContestType.INVITATION, listItems3, '0.0003') // overpaying! should be alrigth
     await createRFP(proponLogicContract, owner, 0, ContestType.INVITATION, items, '0.0002')
     // get  company record
      let company= await proponDataContract.getCompany(owner.address) 
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company Invitation RFP
      await expect(proponLogicContract.connect(addr1)
        .registertoOpenRFP(
        RFPidx, 
          {value: ethers.utils.parseEther('0.0001')}
        ))
        .to.be.revertedWith("not_open_tender")
    });       

    it("11 Should allow recording addr2 company registering to owner company OPEN RFP", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr2 } = await loadFixture(deployProponandCreateCompanies);
      // create RFPs
      await createRFP(proponLogicContract, owner, 3, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
      await createRFP(proponLogicContract, owner, 0, ContestType.INVITATION, items, '0.0002')
     // get  company record
      let company= await proponDataContract.getCompany(owner.address)
      // retrieve first RFP of this company
      let RFPidx = await company.company_RFPs[0]  // First contest is open contest
//      await proponDataContract.getRFPbyIndex(RFPidx)
      await proponLogicContract.connect(addr2).registertoOpenRFP(
          RFPidx,  
          {value: ethers.utils.parseEther('0.0001')}
      )
      let RFP = await proponDataContract.getRFPbyIndex(RFPidx)
      expect(RFP.participants[0]).to.equal(addr2.address);
    });

    it("12 Should reject addr2  registering to its own open RFP", async function () {
      const { proponDataContract,  proponLogicContract,  addr2 } = await loadFixture(deployProponandCreateCompanies);
      // create RFPs
      await createRFP(proponLogicContract, addr2, 1, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
      await createRFP(proponLogicContract, addr2, 2, ContestType.INVITATION, listItems1, '0.0002')
     // get  company record
      let company= await proponDataContract.getCompany(addr2.address)
      // retrieve first RFP of this company
      let RFPidx = await company.company_RFPs[0]  // first contest is open contest
      await expect(proponLogicContract.connect(addr2)
        .registertoOpenRFP(
            RFPidx,  
            {value: ethers.utils.parseEther('0.0001')}))
            .to.be.revertedWith('can_not_register_self')
    });

    it("13 Should reject a company registering under price to OPEN RFP", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1 } = await loadFixture(deployProponandCreateCompanies);
     // create RFPs
     await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
     await createRFP(proponLogicContract, owner, 0, ContestType.OPEN, items, '0.0002')
     // get  company record
      let company= await proponDataContract.getCompany(owner.address) 
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company OPEN RFP
      await expect(proponLogicContract.connect(addr1)
        .registertoOpenRFP(
        RFPidx, 
          {value: ethers.utils.parseEther('0.00001')}
        ))
        .to.be.revertedWith("Insufficient_payment_fee")
    });       


    it("14 Should record five companies to open", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5,addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponLogicContract, owner, 0, ContestType.OPEN, items, '0.0002')
      // get  company record
      let company= await proponDataContract.getCompany(owner.address) 
      let RFPidx = await company.company_RFPs[0]  // first contest is open contest
      await proponLogicContract.connect(addr1).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponLogicContract.connect(addr2).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponLogicContract.connect(addr3).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponLogicContract.connect(addr4).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponLogicContract.connect(addr5).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      let rfp= await proponDataContract.getRFPbyIndex(RFPidx)   // bring again value from contract after those registers
      expect(rfp.participants.length).to.equal(5);
    });


      // To test this should set  uint MAX_GUEST_OPEN_TENDER = 5 in propon contract
    it("15 Should reject more companies than MAX_GUEST_OPEN_TENDER register to open tender", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5,addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponLogicContract, owner, 0, ContestType.OPEN, items, '0.0002')
      // get  company record
      let company= await proponDataContract.getCompany(owner.address) 
      // set MAX_GUEST_OPEN_TENDER to 5
      await proponDataContract.setMaxGuestOpenTender(5)
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[0]  // first contest is open contest
      await proponLogicContract.connect(addr1).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponLogicContract.connect(addr2).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponLogicContract.connect(addr3).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponLogicContract.connect(addr4).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponLogicContract.connect(addr5).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await expect(proponLogicContract.connect(addr6).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')}))
      .to.be.revertedWith("max_participants_reached")
      });
  });

describe("Validate number of invitation and registering intents  to OPEN and INVITATION RFPs ", function () {
  it("1 Should reject trying registering more than MAX_GUEST_INVITATION_TENDER guest invited to INVITATION contest", async function () {
    const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems1, '0.0002') 
      await createRFP(proponLogicContract, owner, 2, ContestType.INVITATION, listItems3, '0.0002') 
    // get RFP owner company record
    let company= await proponDataContract.getCompany(owner.address) 
    await proponDataContract.setMaxGuestInvitationTender(5)
    // retrieve second RFP of this company
    let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company
    await expect(proponLogicContract.connect(owner).inviteCompaniestoRFP(    // addr1 trying pass as owner
      RFPidx,
      test_pro_pon1.id,   // Company Id of owner
      [addr1.address,addr2.address,addr3.address,addr4.address,addr5.address,addr6.address]       // invite 6 companies company
      )).to.be.revertedWith("too_many_guests")
  }); 

  it("2 Should allow registering less than MAX_GUEST_INVITATION_TENDER guests invited to INVITATION contest", async function () {
    const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems1, '0.0002') 
      await createRFP(proponLogicContract, owner, 2, ContestType.INVITATION, listItems3, '0.0002') 
    // get RFP owner company record
    let company= await proponDataContract.getCompany(owner.address) 
    // retrieve second RFP of this company
    let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(    // addr1 trying pass as owner
      RFPidx,
      test_pro_pon1.id,   // Company Id of owner
      [addr1.address,addr2.address,addr3.address,addr4.address,addr5.address]       // invite 5 companies company
      )
      let rfp= await proponDataContract.getRFPbyIndex(1)   // bring again value from contract after those registers
      expect(rfp.participants.length).to.equal(5);
    }); 

    it("3 Should reject trying to accumulate more than MAX_GUEST_INVITATION_TENDER guest invited to INVITATION contest in several calls ", async function () {
      const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
        // crete RFP
        await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems1, '0.0002') 
        await createRFP(proponLogicContract, owner, 2, ContestType.INVITATION, listItems1, '0.0002') 
      // get RFP owner company record
      let company= await proponDataContract.getCompany(owner.address) 
      await proponDataContract.setMaxGuestInvitationTender(5)
      let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company
      // First invitation batch, invite 2 companies
      await proponLogicContract.connect(owner).inviteCompaniestoRFP(    
        RFPidx,
        test_pro_pon1.id,   // Company Id of owner
        [addr1.address,addr2.address]       // invite 2 companies company
        )
      let rfp= await proponDataContract.getRFPbyIndex(1)   // bring again value from contract after those registers
      expect(rfp.participants.length).to.equal(2);
      // Second invitation batch, invite 2 companies
      await proponLogicContract.connect(owner).inviteCompaniestoRFP(    
        RFPidx,
        test_pro_pon1.id,   // Company Id of owner
        [addr3.address,addr4.address]       // invite 2 companies company
        )
      rfp= await proponDataContract.getRFPbyIndex(1)   // bring again value from contract after those registers

      expect(rfp.participants.length).to.equal(4);
      // Third invitation batch, invite 2 companies, it should be rejected
      await expect(proponLogicContract.connect(owner).inviteCompaniestoRFP(    // invite another 2 companies, tryuing making 6 guests
      RFPidx,
      test_pro_pon1.id,   // Company Id of owner
      [addr5.address,addr6.address]       // invite 2 companies company
      )).to.be.revertedWith("too_many_guests")
    }); 
})


describe("Validate particiaptions on RFP for 1 invitation and registeringto OPEN and INVITATION RFPs ", function () {
  it("1 Should register correct RFPs to participants for each company invited in INVITATION contests", async function () {
    const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems1, '0.0002') 
      await createRFP(proponLogicContract, owner, 2, ContestType.INVITATION, listItems3, '0.0002') 
      await createRFP(proponLogicContract, owner, 3, ContestType.INVITATION, listItems1, '0.0002') 
      await createRFP(proponLogicContract, owner, 4, ContestType.INVITATION, listItems2, '0.0002') 
      await createRFP(proponLogicContract, owner, 5, ContestType.INVITATION, listItems1, '0.0002') 
    await proponDataContract.setMaxGuestInvitationTender(5)
    // company Owner now has this RFPs  [ 0, 1, 2, 3, 4 ] notice first one (rfpIndex=0) is Open contest
    // retrieve second RFP of this company
       // contest 1
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(    // addr1 trying pass as owner
      1,        // the second contest
      test_pro_pon1.id,   
      [addr1.address,addr2.address]       // contest 1 participants: company 1, company2
      )

    const company = await proponDataContract.getCompany(owner.address)
    const company1= await proponDataContract.getCompany(addr1.address)      
    const company2= await proponDataContract.getCompany(addr2.address)      
    const company3= await proponDataContract.getCompany(addr3.address)      
    const company4= await proponDataContract.getCompany(addr4.address)      
    // expect company 1 & 2 have correct RFP participation registered
    expect (company1.RFPParticipations).deep.equal([ethers.BigNumber.from(1)])
    expect (company2.RFPParticipations).deep.equal([ethers.BigNumber.from(1)])
    // But companies 3 & 4 do not
    expect (company3.RFPParticipations).deep.equal([])
    expect (company4.RFPParticipations).deep.equal([])
  }); 


  it("2 Should register correct RFPs to participants for each company invited to several INVITATION contests", async function () {
    const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponLogicContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
      await createRFP(proponLogicContract, owner, 2, ContestType.INVITATION, listItems3, '0.0002') 
      await createRFP(proponLogicContract, owner, 3, ContestType.INVITATION, listItems1, '0.0002') 
      await createRFP(proponLogicContract, owner, 4, ContestType.INVITATION, listItems2, '0.0002') 
      await createRFP(proponLogicContract, owner, 5, ContestType.INVITATION, listItems1, '0.0002') 
    // company Owner now has this RFPs  [ 0, 1, 2, 3, 4 ] 
    // get RFP owner company record
    await proponDataContract.setMaxGuestInvitationTender(5)
    // contest 1
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(    
      0,
      test_pro_pon1.id,   
      [addr1.address,addr2.address]       // company1: [0 ] company2: [0]
    )
    // contest 2
   await proponLogicContract.connect(owner).inviteCompaniestoRFP(    
      1,
      test_pro_pon1.id,   
      [addr2.address,addr3.address, addr5.address]       // company2: [0  1] company3: [1] company5: [1]
    )

    // contest 3
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(    
      2,
      test_pro_pon1.id,   
      [addr2.address,addr4.address, addr5.address]       // company2: [0  1  2] company4: [2] company5: [1 2]
    )
 
    // contest 4
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(    
      3,
      test_pro_pon1.id,   
      [addr1.address,addr3.address, addr5.address]       // company1: [0  3] company3: [1 3] company5: [1 2 3]
    )

    // contest 5
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(    
      4,
      test_pro_pon1.id,   
      [addr1.address,addr2.address, addr3.address, addr5.address]       // company1: [0  3 4] company2: [0 1 2 4] company3: [1 3 4] company5: [1 2 3 4]
   )



    const company1= await proponDataContract.getCompany(addr1.address)      
    const company2= await proponDataContract.getCompany(addr2.address)      
    const company3= await proponDataContract.getCompany(addr3.address)      
    const company4= await proponDataContract.getCompany(addr4.address)      
    const company5= await proponDataContract.getCompany(addr5.address)      
    const company6= await proponDataContract.getCompany(addr6.address)      
    // expect company 1 & 2 have correct RFP participation registered
    expect (company1.RFPParticipations).deep.equal([bgn0, bgn3, bgn4])
    expect (company2.RFPParticipations).deep.equal([bgn0, bgn1, bgn2, bgn4])
    expect (company3.RFPParticipations).deep.equal([bgn1, bgn3, bgn4])
    expect (company4.RFPParticipations).deep.equal([bgn2])
    expect (company5.RFPParticipations).deep.equal([bgn1, bgn2, bgn3, bgn4])
    // no invitation contest for company6
    expect (company6.RFPParticipations).deep.equal([])    
  }); 

  it("3 Should register participation in Open RFP Contest for several RFPs", async function () {
    const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5,addr6} = await loadFixture(deployProponandCreateCompanies);

    // create RFPs
    await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
    await createRFP(proponLogicContract, owner, 2, ContestType.OPEN, items, '0.0002')
    await createRFP(proponLogicContract, owner, 3, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
    await createRFP(proponLogicContract, owner, 4, ContestType.OPEN, items, '0.0002')
    await createRFP(proponLogicContract, owner, 5, ContestType.OPEN, items, '0.0002')
   // get  company record
    let company= await proponDataContract.getCompany(owner.address)
    // Company Owner has RFPs:  [ 0, 1, 2, 3 ]
    await RegistertoRFP(addr1, proponLogicContract,0)
    await RegistertoRFP(addr2, proponLogicContract,0)
    // Company1:[0] Company2:[0] 

    await RegistertoRFP(addr2, proponLogicContract,1)
    await RegistertoRFP(addr4, proponLogicContract,1)
    await RegistertoRFP(addr5, proponLogicContract,1)
    // Company1:[0] Company2:[0 1]  Company3:[]  Company4:[1] Company5:[1] 

    await RegistertoRFP(addr1, proponLogicContract,2)
    await RegistertoRFP(addr2, proponLogicContract,2)
    await RegistertoRFP(addr3, proponLogicContract,2)
    await RegistertoRFP(addr4, proponLogicContract,2)
    // Company1:[0 2] Company2:[0 1 2]  Company3:[2]  Company4:[1 2] Company5:[1] 

    await RegistertoRFP(addr1, proponLogicContract,3)
    await RegistertoRFP(addr2, proponLogicContract,3)
    await RegistertoRFP(addr5, proponLogicContract,3)
    // Company1:[0 2 3] Company2:[0 1 2 3]  Company3:[2]  Company4:[1 2] Company5:[1 3] 

    await RegistertoRFP(addr1, proponLogicContract,4)
    await RegistertoRFP(addr2, proponLogicContract,4)
    await RegistertoRFP(addr4, proponLogicContract,4)
    await RegistertoRFP(addr5, proponLogicContract,4)
    // Company1:[0 2 3 4] Company2:[0 1 2 3 4]  Company3:[2]  Company4:[1 2 4] Company5:[1 3 4] 

    let company1= await proponDataContract.getCompany(addr1.address)
    let company2= await proponDataContract.getCompany(addr2.address)
    let company3= await proponDataContract.getCompany(addr3.address)
    let company4= await proponDataContract.getCompany(addr4.address)
    let company5= await proponDataContract.getCompany(addr5.address)
    let company6= await proponDataContract.getCompany(addr6.address)
        
    expect (company1.RFPParticipations).deep.equal([bgn0, bgn2, bgn3, bgn4]) 
    expect (company2.RFPParticipations).deep.equal([bgn0, bgn1, bgn2, bgn3, bgn4]) 
    expect (company3.RFPParticipations).deep.equal([bgn2]) 
    expect (company4.RFPParticipations).deep.equal([bgn1, bgn2, bgn4]) 
    expect (company5.RFPParticipations).deep.equal([bgn1, bgn3, bgn4]) 
    expect (company6.RFPParticipations).deep.equal([]) 
  });

  it("4 Should register participation in Open and Invitation RFP Contest for several RFPs", async function () {
    const { proponDataContract,  proponLogicContract,   owner, addr1, addr2, addr3, addr4, addr5,addr6} = await loadFixture(deployProponandCreateCompanies);

    // create RFPs
    await createRFP(proponLogicContract, owner, 1, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
    await createRFP(proponLogicContract, owner, 2, ContestType.OPEN, items, '0.0002')
    await createRFP(proponLogicContract, owner, 3, ContestType.INVITATION, listItems3, '0.0003') // overpaying! should be alrigth
    await createRFP(proponLogicContract, owner, 4, ContestType.INVITATION, items, '0.0002')
    await createRFP(proponLogicContract, owner, 5, ContestType.OPEN, items, '0.0002')
   // get  company record
    let company= await proponDataContract.getCompany(owner.address)
    // Company Owner has RFPs:  OPEN:  0, 1 4, INVITATION 2, 3 

    // Register companies to Open Contests
    await RegistertoRFP(addr1, proponLogicContract,0)
    await RegistertoRFP(addr2, proponLogicContract,0)
    // Company1:[0] Company2:[0] 

    await RegistertoRFP(addr2, proponLogicContract,1)
    await RegistertoRFP(addr4, proponLogicContract,1)
    await RegistertoRFP(addr5, proponLogicContract,1)
    // Company1:[0] Company2:[0 1]  Company3:[]  Company4:[1] Company5:[1] 

    await RegistertoRFP(addr1, proponLogicContract,4)
    await RegistertoRFP(addr2, proponLogicContract,4)
    await RegistertoRFP(addr3, proponLogicContract,4)
    await RegistertoRFP(addr4, proponLogicContract,4)
    // Company1:[0 4] Company2:[0 1 4]  Company3:[4]  Company4:[1 4] Company5:[1] 

    //Invite companies to Invitation Contests
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(2,test_pro_pon1.id,[addr1.address,addr2.address])
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(3,test_pro_pon1.id,[addr4.address,addr5.address])
    await proponLogicContract.connect(owner).inviteCompaniestoRFP(3,test_pro_pon1.id,[addr3.address])
    // Company1:[0 4 2] Company2:[0 1 4 2]  Company3:[4 3]  Company4:[1 4 3] Company5:[1 3] 
    
    let company1= await proponDataContract.getCompany(addr1.address)
    let company2= await proponDataContract.getCompany(addr2.address)
    let company3= await proponDataContract.getCompany(addr3.address)
    let company4= await proponDataContract.getCompany(addr4.address)
    let company5= await proponDataContract.getCompany(addr5.address)
    let company6= await proponDataContract.getCompany(addr6.address)
        
    expect (company1.RFPParticipations).deep.equal([bgn0, bgn4, bgn2]) 
    expect (company2.RFPParticipations).deep.equal([bgn0, bgn1, bgn4, bgn2]) 
    expect (company3.RFPParticipations).deep.equal([bgn4, bgn3]) 
    expect (company4.RFPParticipations).deep.equal([bgn1, bgn4, bgn3]) 
    expect (company5.RFPParticipations).deep.equal([bgn1, bgn3]) 
    expect (company6.RFPParticipations).deep.equal([]) 
  });



})

 