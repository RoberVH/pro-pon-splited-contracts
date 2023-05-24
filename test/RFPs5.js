/**
 * // To enable  test case 7 of 'Validate dates when creating RFPs' the  line in contract should be uncommented 
 *    at createRFP function:
//    // require(_openDate >= block.timestamp - 3600,'opendate_behind_today'); // allow one hour behind! 
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

  // ConvertDatesAgo - convert date minus number of daysAgo to unix epoch
  // if daysAgo is negative it returns today dates + daysAgo date
  function convertDatesAgo(daysAgo) {
    let today= new Date()
    let convertedDay= new Date(today)
    convertedDay.setDate(today.getDate() - daysAgo)
    //return todayTimestamp = Math.floor(convertedDay.getTime() / 1000); // horario de verano, actualizar nodeJS???
    return Math.floor((convertedDay.getTime() / 1000)) // take back 1 hour because we don't change DST anymore
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
    return   date.toLocaleString()
  }

  const ContestType = {OPEN:0, INVITATION:1}
  // const  openContest = ContestType.OPEN 
  // const  invitationContest = ContestType.INVITATION_ONLY 

 // Id RFP is the RFP name field at pro-pon contract
 let IDRFP=[
  'LPN3094-3912-4',
  'LPI6709-211262-2408',
  '03945-441-039943',
  'LPX29003412-001',
  'LPI030223-7203-00013',
  '0232-COV-659-023L',
  'LDN-0X9-659-65L',
  'LPN2145-8209',
  'LPN792-2618-01554',
]
// name RFP is description field in pro-pon contrat
let nameRfp=[ 
  'Reacondicionamiento de Luminarias',
  'Cleaning Services',
  'Déneigement des installations',
  'Sistema electronico de Votación',
  '2022-2023 Translations Services',
  'Adquisición de Uniformes',
  'Servicios para administración de nómina',
  'Provisioning of construction Material',
  'Building of an Employee payroll system '
]

  let rfpWebLink=[ 
    'https://www.locazon.com/progress-tracker/package/ref=pe_386ds0_4553248370_TE_SIMP_typ_T?_encoding=UTF8&from=gp&itemId=&orderId=114-9127329-3803961&packageIndex=0&shipmentId=200350996242434200',
    'https://bdael.deggrtex.mx/u/0/#tiduo/WhcdKKkXl8gJXdmrwtWasdKCRZQlWCSJtVBChHGAs564mnSRqFFGCQXLmKfCgqLbQFdHSjtyt',
    'http://morels.wwe.mx/MP_typ_T?_encoding=UTF8&from=gp&itemId=&orderId=114-9127329-3803961&packageIndex=0WhcdKKkXl8gJXdmrwtWasdKCRZQlWCSJtVBChHGAs564mnSRqFFGCQXLmKfCgqLbQFdHSjtyt',
    'https://www.apratmse.com/-/es/b?node=16225005011&pf_rd_r=N62KCHHDBD52V0HCXRFD&pf_rd_p=27f4d66c-efe3-4ee0-a6bf-6cfd06f31a84&pd_rd_r=ba0a45fc-ef91-423f-aacb-2fab6ef4bf5d&pd_rd_w=jkE5h&pd_rd_wg=9VC7C&ref_=pd_gw_unk',
    '',
    'http://lnc.it/-/Toallitas-paquetes-fragancia/dp/B07H53W5WP/ref=lp_16225005011_1_3',
    '',
    'http://braxton/levi-/23/id=2344&op=kdoir&svol=dk%202349B',
    'http://birmex/lpx034934/site/id=6254&parm=true'
  ]

     
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
  let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
  let endDate=convertDatesAgo(0) -(2 * 60)  // Now
  
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
 


  async function deployProponandCreateCompanies() {
    // Get the ContractFactory and Signers here.
    const [owner, addr1, addr2, addr3, addr4, addr5,addr6] = await ethers.getSigners();
    const propon = await ethers.getContractFactory("pro_pon");
    const proponContract = await propon.deploy();
    
    //company 1 from owner account
    let txn = await proponContract.createCompany(
      test_pro_pon1.id,
      test_pro_pon1.name,
      test_pro_pon1.country,
      {value: ethers.utils.parseEther('0.0001')}
      )
      // company 2 from addr1 account
    txn = await proponContract.connect(addr1).createCompany(
        test_pro_pon2.id,
        test_pro_pon2.name,
        test_pro_pon2.country,
        {value: ethers.utils.parseEther('0.0001')}
        )      
    // company 3 from addr2 account
    txn = await proponContract.connect(addr2).createCompany(
        test_pro_pon3.id,
        test_pro_pon3.name,
        test_pro_pon3.country,
        {value: ethers.utils.parseEther('0.0001')}
        ) 

    // company 4 from addr3
    txn = await proponContract.connect(addr3).createCompany(
      test_pro_pon4.id,
      test_pro_pon4.name,
      test_pro_pon4.country,
      {value: ethers.utils.parseEther('0.0001')}
      ) 
    
    // company 5 from addr4
    txn = await proponContract.connect(addr4).createCompany(
      test_pro_pon5.id,
      test_pro_pon5.name,
      test_pro_pon5.country,
      {value: ethers.utils.parseEther('0.0001')}
      ) 

      // company 6 from addr5
      txn = await proponContract.connect(addr5).createCompany(
      test_pro_pon6.id,
      test_pro_pon6.name,
      test_pro_pon6.country,
      {value: ethers.utils.parseEther('0.0001')}
      ) 

      // company 7 from addr6
      txn = await proponContract.connect(addr6).createCompany(
        test_pro_pon7.id,
        test_pro_pon7.name,
        test_pro_pon7.country,
        {value: ethers.utils.parseEther('0.0001')}
        ) 

    return { proponContract, owner, addr1, addr2, addr3, addr4, addr5,addr6 };
  }  
    
  

 describe("***********************************RFP5.js ********************************************\n   Validate dates when creating RFPs", function () {
   it("1 Should reject trying create RFP with begining date major than end receiving date", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with Open Date major than end receiveing date
      let openDate=convertDatesAgo(-4) 
      let endReceiving=convertDatesAgo(-3) //3 day from now
      let endDate=convertDatesAgo(-9) // 9 days from today
      // console.log('OpenDate', convertUnixToDate(openDate))
      await expect(proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )).to.be.revertedWith('initial_date_wrong')
   });
      
   it("2 Should reject creating RFP with end receiving date major than end Date", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with end receiving Date major than end end Date 
      let openDate=convertDatesAgo(0) // today
      let endReceiving=convertDatesAgo(-10) // 10 days into future
      let endDate=convertDatesAgo(-9) // 9 days into future, i.e. is short 1 day that receiving dateline

      // console.log('openDate',openDate)
      // console.log('openDate hora local', convertUnixToDate(openDate))
      await expect(proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )).to.be.revertedWith('receiving_date_wrong')
   });



   it("3 Should reject trying create RFP with end receiving date equal to receiving Date", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with Open Date major than end receiveing date
      let openDate=convertDatesAgo(0) // today
      let endReceiving=convertDatesAgo(0) // today
      let endDate=convertDatesAgo(-9) // 9 days into future, i.e. is short 1 day that receiving dateline

      await expect(proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )).to.be.revertedWith('initial_date_wrong')
   });

it("4 Should reject trying create RFP with end receiving date equal to endDate", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    let openDate=convertDatesAgo(0) // today
    let endReceiving=convertDatesAgo(-3) // 3 days from today
    let endDate=convertDatesAgo(-3) // 3 days from today, i.e. is equal to receiving dateline

    await expect(proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1,
      {value: ethers.utils.parseEther('0.0002')}
    )).to.be.revertedWith('receiving_date_wrong')
});

it("5 Should reject trying create RFP with begining date equal to end receiving date", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    let openDate=convertDatesAgo(-2) // today
    let endReceiving=convertDatesAgo(-2) // 3 days from today
    let endDate=convertDatesAgo(-4) // 3 days from today, i.e. is equal to receiving dateline

    await expect(proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1,
      {value: ethers.utils.parseEther('0.0002')}
    )).to.be.revertedWith('initial_date_wrong')
});

it("6 Should accept creating RFP with openDate as of today", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    let openDate=convertDatesAgo(0) // today
    let endReceiving=convertDatesAgo(-1) // 1 days from today
    let endDate=convertDatesAgo(-2) // 2 days from today, i.e. is equal to receiving dateline

    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1,
      {value: ethers.utils.parseEther('0.0002')}
    )
    let RFP = await  proponContract.getRFPbyIndex(0)
    expect(RFP.name).to.equal(IDRFP[0])
  });

// To enable this test case next line in contract should be uncommented at createRFP function:
// // require(_openDate >= block.timestamp - 3600,'opendate_behind_today'); // allow one hour behind! 
it("7 Should reject creating RFP with openDate older that today", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    let openDate=convertDatesAgo(1) // 1 day ago
    let endReceiving=convertDatesAgo(15) // 15 days ago
    let endDate=convertDatesAgo(5) // 5 days ago

    await expect(proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1,
      {value: ethers.utils.parseEther('0.0002')}
    )).to.be.revertedWith('opendate_behind_today')
  });
}); 

describe("Validate declaring winners of  RFPs **********************************************************************", function () {
  it("1 Should reject  owner of Open RFP declaring winners before endDate reached", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with Open Date major than end receiveing date
      // let today= new Date()
      // let convertedDay= new Date(today)
      // convertedDay.setDate(today.getDate()-10)
      let openDate=convertDatesAgo(0)   // today with half an hour delay
      let endReceiving=convertDatesAgo(-5) // 5 days into future
      let endDate=convertDatesAgo(-9) // 9 days into future, i.e. is short 1 day that receiving dateline
      
      // create a correct Open RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1, // 6 items
        {value: ethers.utils.parseEther('0.0002')}
      )
      //  addr1, addr2, addr3, addr5 companies register to the Open RFP 
      await proponContract.connect(owner).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr2).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr3).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr5).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
      // declare winners for all itemLists
      const winners = [
        owner.address, addr2.address, owner.address, 
        addr5.address, addr3.address, addr3.address,
      ]
      const rfpINDEX=0  // only 1 RFP defined so far
      await expect( proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
      .to.be.revertedWith('enddate_not_reached_yet')
    });
    
  it("2 Should accept owner of Open RFP declaring winners when endDate has been reached", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      let openDate=convertDatesAgo(0) - ( 40 * 60)
      let endReceiving=convertDatesAgo(0) - ( 20 * 60)
      let endDate=convertDatesAgo(0)  - ( 4 * 60) // one day ago
      
      // create a correct Open RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1, // 6 items
        {value: ethers.utils.parseEther('0.0002')}
      )
      //  addr1, addr2, addr3, addr5 companies register to the Open RFP 
      await proponContract.connect(owner).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr2).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr3).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr4).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr5).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})      
      // declare winners for all itemLists
      const winners = [
        owner.address, addr2.address, addr4.address, 
        addr5.address, addr3.address, addr3.address,
      ]
      const rfpINDEX=0  // only 1 RFP defined so far
      await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
      let company= await proponContract.getCompany(addr1.address)
      let RFPIdx = await company.company_RFPs[0]  // first contest is open contest
      let RFP = await proponContract.getRFPbyIndex(RFPIdx)
      expect(RFP.winners.length).to.equal(6)
      expect(RFP.winners).deep.equal(winners)
    });      

  it("3 Should reject  owner of Invitation RFP declaring winners before endDate reached", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) // now
    let endReceiving=convertDatesAgo(-1)   // tomorrow
    let endDate=convertDatesAgo(-2)  // day after Tomorrow
      
      // create a correct Open RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[4],        // name
        nameRfp[4],   // description
        rfpWebLink[4], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1, // 6 items
        {value: ethers.utils.parseEther('0.0002')}
      ) //create a correct Invitation RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[1],        // name
        nameRfp[1],   // description
        rfpWebLink[1], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION,
        listItems3, // 5 items
        {value: ethers.utils.parseEther('0.0002')}
      )
      //  addr1, addr2, addr3, addr5 companies register to ivitation RFP 
      const rfpINDEX=1  // second RFP, invitation RFP
      await proponContract.connect(addr1).inviteCompaniestoRFP(
        rfpINDEX, //invitation RFP index
        test_pro_pon2.id, // id of addr2 company
        [owner.address,addr2.address,addr3.address,addr4.address]
        )
      // declare winners for all itemLists
      const winners = [
        owner.address, addr2.address, addr4.address, 
        addr2.address, addr3.address
      ]
      await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
      .to.be.revertedWith('enddate_not_reached_yet')
    });      
    

  it("4 Should reject company posing as other  owner from declaring winners for OPEN RFP ", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
      
      // create a correct Open RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1, // 6 items
        {value: ethers.utils.parseEther('0.0002')}
      )
      const rfpINDEX=0  // only 1 RFP defined so far
      //  addr1, addr2, addr3, addr5 companies register to the Open RFP 
      await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
      // declare winners for all itemLists
      const winners = [
        owner.address, addr2.address, addr1.address, 
        addr5.address, addr3.address, addr3.address,
      ]
      await expect(proponContract.connect(addr2).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
      .to.be.revertedWith('Only_admin_can_perform')
    });  

  it("5 Should reject company declaring winners for an RFP not its own ", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
      
      // create a correct Open RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION,
        listItems1, // 6 items
        {value: ethers.utils.parseEther('0.0002')}
      )
      const rfpINDEX=0  // only 1 RFP defined so far
      await proponContract.connect(addr1).inviteCompaniestoRFP(
        rfpINDEX, //invitation RFP index
        test_pro_pon2.id, // id of addr2 company
        [addr1.address,addr2.address,addr3.address,addr5.address]
        )
      // declare winners for all itemLists
      const winners = [
        addr1.address, addr2.address, addr1.address, 
        addr5.address, addr3.address, addr3.address,
      ]
      await expect(proponContract.connect(addr2).declareWinners( rfpINDEX, test_pro_pon3.id, winners))
      .to.be.revertedWith('Only_issuer_can_perform')
    });  

  it("6 Should accept declaring winner  for an RFP with no item lists ", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
      
      // create a correct Open RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION,
        [], // No items
        {value: ethers.utils.parseEther('0.0002')}
      )
      const rfpINDEX=0  // only 1 RFP defined so far
      await proponContract.connect(addr1).inviteCompaniestoRFP(
        rfpINDEX, //invitation RFP index
        test_pro_pon2.id, // id of addr2 company
        [addr5.address]
        )
      // declare winners for all itemLists
      const winners = [addr5.address]
      await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
      let RFP = await proponContract.getRFPbyIndex(rfpINDEX)
      expect(RFP.winners[0]).to.equal(winners[0])
    });  

  it("7 Should revert when list of winners is shorter than RFP item lists ", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
    
    // create a correct Open RFP
    const rfpINDEX=0  // only 1 RFP defined so far
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      listItems1, // 6 items
      {value: ethers.utils.parseEther('0.0002')}
    )
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address,addr4.address]
     )
    // declare winners for all itemLists
    const winners = [owner.address, owner.address, addr5.address, addr3.address, addr3.address ] // 5 winners for 6 items
    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('not_matching_winners')
    });  

  it("8 Should revert when list of winners is greater than RFP item lists ", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      listItems1, // 6 items
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // only 1 RFP defined so far
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr6.address,addr2.address,addr3.address,addr5.address]
      )
    // declare winners for all itemLists
    const winners = [
      owner.address, addr2.address, owner.address, 
      addr5.address, addr3.address, addr3.address,
      addr5.address, owner.address, addr6.address,
    ]   // 9 winners for 6 items

    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('not_matching_winners')
    });  

 it("9 Should acept declaring winner when  list items is 1", async function () {
const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
  let openDate=convertDatesAgo(0) - (40 * 60) 
  let endReceiving=convertDatesAgo(0) - (30 * 60)  
  let endDate=convertDatesAgo(0) - (20 * 60)
  
  // create RFPs
  await createRFP(proponContract, addr2, 3, ContestType.OPEN, listItems3, '0.0002')
  await createRFP(proponContract, addr2, 1, ContestType.INVITATION, items, '0.0002')
  await createRFP(proponContract, addr3, 2, ContestType.OPEN, listItems3, '0.0002')
  await createRFP(proponContract, addr3, 0, ContestType.INVITATION, items, '0.0002')
  await createRFP(proponContract, addr1, 5, ContestType.OPEN, listItems3, '0.0002')
  await createRFP(proponContract, addr1, 4, ContestType.INVITATION, items, '0.0002')

  // create 7th  RFP
  await proponContract.connect(addr1).createRFP(
    IDRFP[3],        // name
    nameRfp[3],   // description
    rfpWebLink[3], // RFP's web site link
    openDate,
    endReceiving,      
    endDate,
    ContestType.INVITATION,
    ['Services for Cleaning Rooms'], // 1 item
    {value: ethers.utils.parseEther('0.0002')})
    const rfpINDEX=6
    await proponContract.connect(addr1).inviteCompaniestoRFP(
    rfpINDEX, //invitation RFP index
    test_pro_pon2.id, // id of addr2 company
    [owner.address,addr2.address,addr3.address,addr5.address,addr4.address]
  )
  // declare winners for all itemLists
  const winners = [addr5.address]   // 1 winner for 1 items
  await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
  const winnerRetrieved=await proponContract.getWinners(rfpINDEX)
  expect(winners[0]).to.equal(winnerRetrieved[0])
  });  

it("10 Should reject owner of Invitation RFP self declaring  winner", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1, // 6 items
      {value: ethers.utils.parseEther('0.0002')}
    ) //create a correct Invitation RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[1],        // name
      nameRfp[1],   // description
      rfpWebLink[1], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      listItems3, // 5 items
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=1  // second RFP, invitation RFP
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address]
      )
    // declare winners for all itemLists
    const winners = [
      owner.address, addr2.address, 
      addr5.address, addr1.address, addr3.address,
    ]
    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('cannot_self_award')
  }); 

it("11 Should reject owner of OPEN RFP self declaring  winner", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1, // 6 items
      {value: ethers.utils.parseEther('0.0002')}
    ) //create a correct Invitation RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[1],        // name
      nameRfp[1],   // description
      rfpWebLink[1], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      listItems3, // 5 items
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First  RFP, OPEN RFP
    
          //  addr1, addr2, addr3, addr5 companies register to the Open RFP 
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // declare winners for all itemLists
    const winners = [
      owner.address, addr2.address, owner.address,
      addr5.address, addr1.address, addr3.address,
    ]
    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('cannot_self_award')
  });    

it("12 Should reject owner of Invitation RFP declaring a not invited company winner", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1, // 6 items
      {value: ethers.utils.parseEther('0.0002')}
    ) //create a correct Invitation RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[1],        // name
      nameRfp[1],   // description
      rfpWebLink[1], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      listItems3, // 5 items
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=1  // second RFP, invitation RFP
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address]
      )
    // declare winners for all itemLists
    const winners = [
      owner.address, addr3.address, 
      addr6.address, addr3.address, addr3.address,
    ]
    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('invalid_winner')
  }); 

it("13 Should reject company declaring winner a non registered company on OPEN RFP ", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1, // 6 items
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // only 1 RFP defined so far
    //  addr1, addr2, addr3, addr5 companies register to the Open RFP 
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // declare winners for all itemLists
    const winners = [
      owner.address, addr2.address, addr3.address, 
      addr5.address, addr6.address, addr3.address,
    ]
    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('invalid_winner')
  });  

it("14 Should reject company declaring winner a non registered company on OPEN RFP with no item list", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      [], // no Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // only 1 RFP defined so far
    //  addr1, addr2, addr3, addr5 companies register to the Open RFP 
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // declare winners for all itemLists
    const winners = [addr6.address]
    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('invalid_winner')
  });    

it("15 Should reject company declaring winner a non invited company on INVITATION RFP with no item list", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      [], // no Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address]
      )
    // declare winners for all itemLists
    const winners = [addr6.address]
    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('invalid_winner')
    });      

it("16 Should accept  declaring winners for an INVITATION RFP with 36 item list", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      listItems2, // 36 Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address,]
      )
    // declare winners for all itemLists
    const winners = [
        owner.address,addr2.address,addr3.address,addr5.address,owner.address,addr2.address,addr3.address,addr5.address,
        addr2.address,addr3.address,addr5.address,addr3.address,addr5.address,owner.address,addr3.address,addr5.address,
        owner.address,addr2.address,addr3.address,addr2.address,addr3.address,addr2.address,addr3.address,addr3.address,
        owner.address,addr2.address,addr3.address,addr2.address,addr3.address,addr2.address,addr3.address,addr3.address,
        addr3.address,addr5.address,addr3.address,addr3.address
      ]
    await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
    let winnersinContract= await proponContract.getWinners(rfpINDEX)
    expect(winnersinContract.length).to.be.equal(36)
    expect(winnersinContract).deep.equal(winners)
    });   

it("17 Should accept declaring a no items INVITATION RFP deserted", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      [], // No Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address,]
      )
    // declare winners for the RFP itemLists
    const winners = ['0x0000000000000000000000000000000000000000']
    await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
    let winnersinContract= await proponContract.getWinners(rfpINDEX)
    expect(winnersinContract.length).to.be.equal(1)
    expect(winnersinContract).deep.equal(winners)
    });   

it("18 Should accept declaring a 1 item OPEN RFP deserted", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      ['Auditing Fiscal Year 2022'], // 1 Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // declare NO winner for the RFP 1 item list
    const winners = ['0x0000000000000000000000000000000000000000']
    await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
    let winnersinContract= await proponContract.getWinners(rfpINDEX)
    expect(winnersinContract.length).to.be.equal(1)
    expect(winnersinContract).deep.equal(winners)
    });   

it("19 Should accept declaring several items deserted in OPEN RFP", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)

    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems2, // 
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // declare NO winner for the RFP 1 item list
    const deserted = '0x0000000000000000000000000000000000000000'
    const winners = [
      owner.address,deserted,addr3.address,addr5.address,owner.address,addr2.address,addr3.address,addr5.address,
      addr2.address,addr3.address,addr5.address,addr3.address,deserted,owner.address,addr3.address,addr5.address,
      owner.address,addr2.address,deserted,addr2.address,addr3.address,addr2.address,addr3.address,addr3.address,
      owner.address,addr2.address,addr3.address,deserted,addr3.address,addr2.address,addr3.address,addr3.address,
      addr3.address,addr5.address,addr3.address,deserted
    ]  // 5 items declared deserted
    await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
    let winnersinContract= await proponContract.getWinners(rfpINDEX)
    expect(winnersinContract.length).to.be.equal(36)    // there is a winner/deserted address value for each item
    expect(winnersinContract).deep.equal(winners)
    expect(winnersinContract[12]).deep.equal(deserted)
    });
    
it("20 Should accept cancelling a 1 item OPEN RFP", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(-2)
    let endDate=convertDatesAgo(-4)

    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // Id
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      ['Auditing Fiscal Year 2022'], // 1 Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // cancel RFP
    let RFP = await proponContract.getRFPbyIndex(rfpINDEX)
    await proponContract.connect(addr1).cancelRFP( test_pro_pon2.id, rfpINDEX)
    RFP = await proponContract.getRFPbyIndex(rfpINDEX)
    expect(RFP.canceled).to.be.equal(true)
    });   
    
  it("21 Should reject non Issuer company cancelling an INVITATION RFP", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(-2)  
    let endDate=convertDatesAgo(-3) 

      
      // create a correct Open RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.INVITATION,
        [], // no Item list
        {value: ethers.utils.parseEther('0.0002')}
      )
      const rfpINDEX=0  // First RFP (invitation)
      await proponContract.connect(addr1).inviteCompaniestoRFP(
        rfpINDEX, //invitation RFP index
        test_pro_pon2.id, // id of addr2 company
        [owner.address,addr2.address,addr3.address,addr5.address]
        )
      // declare winners for all itemLists
      const winners = [addr6.address]
      await expect(proponContract.connect(addr2).cancelRFP( test_pro_pon3.id, rfpINDEX))
      .to.be.revertedWith('Only_issuer_can_perform')

      });

it("22 Should reject non admin  company cancelling an INVITATION RFP", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
  let openDate=convertDatesAgo(-3) 
  let endReceiving=convertDatesAgo(-4) 
  let endDate=convertDatesAgo(-60)
    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      [], // no Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address]
      )
    // declare winners for all itemLists
    const winners = [addr6.address]
    await expect(proponContract.connect(addr2).cancelRFP( test_pro_pon1.id, rfpINDEX))
    .to.be.revertedWith('Only_admin_can_perform')
    });          

  it("23 Should reject cancelling an already declared OPEN RFP", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // Id
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      ['Auditing Fiscal Year 2022'], // 1 Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // cancel RFP
    const winners = ['0x0000000000000000000000000000000000000000']
    await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
    let RFP = await proponContract.getRFPbyIndex(rfpINDEX)
    await expect(proponContract.connect(addr1).cancelRFP( test_pro_pon2.id, rfpINDEX))
     .to.be.revertedWith('rfp_already_awarded')
    RFP = await proponContract.getRFPbyIndex(rfpINDEX)
    expect(RFP.canceled).to.be.equal(false)
    });  
  
  it("24 Should reject declaring an already cancelled OPEN RFP", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // Id
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      ['Auditing Fiscal Year 2022'], // 1 Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // cancel RFP
    expect(proponContract.connect(addr1).cancelRFP( test_pro_pon2.id, rfpINDEX))
    const winners = ['0x0000000000000000000000000000000000000000']
    await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
     .to.be.revertedWith('already_canceled')
    let RFP = await proponContract.getRFPbyIndex(rfpINDEX)
    });  

  it("25 Should acept declaring winner when  list items is 0", async function () {
      const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      let openDate=convertDatesAgo(0) - (40 * 60) 
      let endReceiving=convertDatesAgo(0) - (30 * 60)  
      let endDate=convertDatesAgo(0) - (20 * 60)
      
      // create RFPs
      await createRFP(proponContract, addr2, 3, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponContract, addr2, 1, ContestType.INVITATION, items, '0.0002')
      await createRFP(proponContract, addr3, 2, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponContract, addr3, 0, ContestType.INVITATION, items, '0.0002')
      await createRFP(proponContract, addr1, 5, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponContract, addr1, 4, ContestType.INVITATION, items, '0.0002')
    
      // create 7th  RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[3],        // name
        nameRfp[3],   // description
        rfpWebLink[3], // RFP's web site link
        openDate,
        endReceiving,      
        endDate,
        ContestType.INVITATION,
        [], // 0 item
        {value: ethers.utils.parseEther('0.0002')})
        const rfpINDEX=6
        await proponContract.connect(addr1).inviteCompaniestoRFP(
        rfpINDEX, //invitation RFP index
        test_pro_pon2.id, // id of addr2 company
        [owner.address,addr2.address,addr3.address,addr5.address,addr4.address]
      )
      // declare winners for all itemLists
      const winners = [addr5.address]   // 1 winner for 0 items
      await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
      const winnerRetrieved=await proponContract.getWinners(rfpINDEX)
      expect(winners[0]).to.equal(winnerRetrieved[0])
      });  

  it("26 Should reject declaring winner when  list items is 2 and winners is 3", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60)  
    let endDate=convertDatesAgo(0) - (20 * 60)
      
      // create RFPs
      await createRFP(proponContract, addr2, 3, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponContract, addr2, 1, ContestType.INVITATION, items, '0.0002')
      await createRFP(proponContract, addr3, 2, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponContract, addr3, 0, ContestType.INVITATION, items, '0.0002')
      await createRFP(proponContract, addr1, 5, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponContract, addr1, 4, ContestType.INVITATION, items, '0.0002')
    
      // create 7th  RFP
      await proponContract.connect(addr1).createRFP(
        IDRFP[3],        // name
        nameRfp[3],   // description
        rfpWebLink[3], // RFP's web site link
        openDate,
        endReceiving,      
        endDate,
        ContestType.INVITATION,
        ['Installation Services', 'Maintenance Services'], // 0 item
        {value: ethers.utils.parseEther('0.0002')})
        const rfpINDEX=6

        await proponContract.connect(addr1).inviteCompaniestoRFP(
        rfpINDEX, //invitation RFP index
        test_pro_pon2.id, // id of addr2 company
        [owner.address,addr2.address,addr3.address,addr5.address,addr4.address]
      )
      // declare 3 winners for itemLists
      const winners = [addr2.address, addr3.address,addr5.address]   // 3 winner for 2 items
      await expect(proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
          .to.be.revertedWith('not_matching_winners')
      // const winnerRetrieved=await proponContract.getWinners(rfpINDEX)
      // expect(winners[0]).to.equal(winnerRetrieved[0])
      });  

it("27 Should record cancelling time of a cancelled  1 item OPEN RFP", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
  let openDate=convertDatesAgo(0) - (40 * 60) 
  let endReceiving=convertDatesAgo(0) - (30 * 60)  
  let endDate=convertDatesAgo(0) - (20 * 60)
    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // Id
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      ['Auditing Fiscal Year 2022'], // 1 Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')}) 
    // cancel RFP
    let RFP = await proponContract.getRFPbyIndex(rfpINDEX)
    await proponContract.connect(addr1).cancelRFP( test_pro_pon2.id, rfpINDEX)
    RFP = await proponContract.getRFPbyIndex(rfpINDEX)
    expect(RFP.canceled).to.be.equal(true)
    const cancelDate = await proponContract.getCancelDate(rfpINDEX)
    //expect(cancelDate).to.be.equal(cancelDate)
    const cancelDateNumber=parseInt(cancelDate.toString())
    // console.log('cancelDateNumber',cancelDate)
    // console.log('typeof cancelDateNumber',typeof cancelDateNumber)
    expect(cancelDateNumber).to.satisfy(Number.isFinite, 'cancelDate must be numeric');

});         

it("28 Should reject inviting companies to a cancelled RFP", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
  let openDate=convertDatesAgo(0) - (40 * 60) 
  let endReceiving=convertDatesAgo(-1) 
  let endDate=convertDatesAgo(-3) 
    
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      [], // no Item list
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX=0  // First RFP (invitation)
    await proponContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address]
      )
      await proponContract.connect(addr1).cancelRFP( test_pro_pon2.id, rfpINDEX)
      // try to invite other companies to already canceled RFP
      await expect( proponContract.connect(addr1).inviteCompaniestoRFP(
        rfpINDEX, //invitation RFP index
        test_pro_pon2.id, // id of addr2 company
        [addr3.address,addr5.address]
        )).to.be.revertedWith('already_canceled')
    });  

it("29 Should reject self registering to a cancelled RFP", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
  let openDate=convertDatesAgo(0) - (40 * 60) 
  let endReceiving=convertDatesAgo(-1) 
  let endDate=convertDatesAgo(-3) 
  
  // create a correct Open RFP
  await proponContract.connect(addr1).createRFP(
    IDRFP[0],        // Id
    nameRfp[0],   // description
    rfpWebLink[0], // RFP's web site link
    openDate,
    endReceiving,
    endDate,
    ContestType.OPEN,
    ['Auditing Fiscal Year 2022'], // 1 Item list
    {value: ethers.utils.parseEther('0.0002')}
  )
  const rfpINDEX=0  // First RFP (invitation)
  await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
  // cancel RFP
  await proponContract.connect(addr1).cancelRFP( test_pro_pon2.id, rfpINDEX)
  // Some company trying to self registering after cancelling
  await expect(proponContract.connect(addr3).registertoOpenRFP(
    rfpINDEX, 
    {value: ethers.utils.parseEther('0.0001')})
    ).to.be.revertedWith('already_canceled')

});     
    
});

describe("Validate winners are accounted of on own record **********************************************************************", function () {
it("1 Should register in winning company record Wins when have won a non-item RFP", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
  let openDate=convertDatesAgo(0) - (40 * 60) 
  let endReceiving=convertDatesAgo(0) - (30 * 60) 
  let endDate=convertDatesAgo(0) - (10 * 60) 
  // create a correct Open RFP
  await proponContract.connect(addr1).createRFP(
    IDRFP[0],        // name
    nameRfp[0],   // description
    rfpWebLink[0], // RFP's web site link
    openDate,
    endReceiving,
    endDate,
    ContestType.OPEN,
    [], // No items
    {value: ethers.utils.parseEther('0.0002')}
  )
  //  addr1, addr2, addr3, addr5 companies register to the Open RFP 
  await proponContract.connect(owner).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr2).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr3).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr5).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
  // declare winners for RFP
  const winners = [
    owner.address
  ]
  const rfpINDEX=0  // only 1 RFP defined so far
  // declare owner accouunt winner
  await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
  const ownerWins = await proponContract.getCompanyWins()
  expect(ownerWins).deep.equal([0])
});

it("2 Should register in winning company record Wins just once RFP even when having  won several items of RFP", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60) 
    let endDate=convertDatesAgo(0) - (10 * 60) 
    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1, // No items
      {value: ethers.utils.parseEther('0.0002')}
    )
    //  addr1, addr2, addr3, addr5 companies register to the Open RFP 
    await proponContract.connect(owner).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr2).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr3).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
    await proponContract.connect(addr5).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
    // declare winners for RFP
    const winners = [
      owner.address, addr2.address, addr3.address, 
      addr5.address, addr5.address, addr3.address,
    ]
    const rfpINDEX=0  // only 1 RFP defined so far
    // declare owner accouunt winner
    await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners)
    // all winners accounted only once this RFP
    let winer = await proponContract.getCompanyWins()
    expect(winer).deep.equal([0])
    winer = await proponContract.connect(addr2).getCompanyWins()
    expect(winer).deep.equal([0])
    winer = await proponContract.connect(addr3).getCompanyWins()
    expect(winer).deep.equal([0])
    winer = await proponContract.connect(addr5).getCompanyWins()
    expect(winer).deep.equal([0])
     winer = await proponContract.connect(addr6).getCompanyWins()
    expect(winer).deep.equal([])
  });    

it("3 Should register in several RFPs once for each won RFP / Items", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
  let openDate=convertDatesAgo(0) - (40 * 60) 
  let endReceiving=convertDatesAgo(0) - (30 * 60) 
  let endDate=convertDatesAgo(0) - (10 * 60) 
  // addr1 creates 4 contests
  await createRFP(proponContract, addr1, 4, ContestType.OPEN, listItems3, '0.0002')
  await createRFP(proponContract, addr1, 0, ContestType.INVITATION, items, '0.0002')
  await createRFP(proponContract, addr1, 1, ContestType.OPEN, listItems3, '0.0002')
  await createRFP(proponContract, addr1, 2, ContestType.INVITATION, listItems3, '0.0002')
  
  //   addr1, addr2, addr3, addr5 companies register to the first Open RFP 
  await proponContract.connect(owner).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr2).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr3).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
  await proponContract.connect(addr5).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
  // PROCESSING FIRST RFP ************************************
  // declare winners for first OPEN RFP
  let winers = [
    owner.address, addr5.address, addr5.address, addr5.address, owner.address
  ]
  let rfpINDEX=0   
  //  // declare owner accouunt winner
  await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winers)
  let accountwinner = await proponContract.getCompanyWins() // owner
  expect(accountwinner).deep.equal([0])
  // PROCESSING SECOND RFP ************************************ 
  rfpINDEX=1   
  await proponContract.connect(addr1).inviteCompaniestoRFP(
    rfpINDEX, //invitation RFP index
    test_pro_pon2.id, // id of addr2 company
    [owner.address,addr2.address,addr3.address,addr5.address]
    )
    // declare winners for second RFP
  winers = [
    addr5.address   
  ]
  await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winers) 
  accountwinner = await proponContract.connect(addr5).getCompanyWins() // addr5 wit 2 wins
  expect(accountwinner).deep.equal([0,1])
// PROCESSING Third RFP ************************************ 
  rfpINDEX=2   
   //   addr1, addr2, addr3, addr5 companies register to the first Open RFP 
   await proponContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
   await proponContract.connect(addr2).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
   await proponContract.connect(addr3).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
   await proponContract.connect(addr5).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})
  // declare winners for third  RFP
winers = [
  addr5.address, addr2.address, addr2.address, addr2.address, addr5.address
]
await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winers) // addr5 with 3 wins, addr2 with 2, owner with 1
accountwinner = await proponContract.connect(addr5).getCompanyWins() 
expect(accountwinner).deep.equal([0,1, 2])
accountwinner = await proponContract.connect(addr2).getCompanyWins() 
expect(accountwinner).deep.equal([2])
accountwinner = await proponContract.getCompanyWins() 
expect(accountwinner).deep.equal([0])
// PROCESSING Fourth RFP ************************************ 
rfpINDEX=3   
await proponContract.connect(addr1).inviteCompaniestoRFP(
  rfpINDEX, //invitation RFP index
  test_pro_pon2.id, // id of addr2 company
  [owner.address,addr2.address,addr3.address,addr5.address]
  )
// declare winners for fourth  RFP
winers = [
owner.address, addr2.address, addr5.address, addr5.address, addr3.address
]
// addr5 with 4 wins, addr2 with 2, owner with 2, addr3 with 1
await proponContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winers) 
accountwinner = await proponContract.connect(addr5).getCompanyWins() 
expect(accountwinner).deep.equal([0,1, 2, 3])
accountwinner = await proponContract.connect(addr2).getCompanyWins() 
expect(accountwinner).deep.equal([2, 3])
accountwinner = await proponContract.getCompanyWins() 
expect(accountwinner).deep.equal([0, 3])
accountwinner = await proponContract.connect(addr3).getCompanyWins() 
expect(accountwinner).deep.equal([3])
  });

it("4 Should read correct RFPs globalindexes (1) owned by a company when is 1 RFP", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    let openDate=convertDatesAgo(0) - (40 * 60) 
    let endReceiving=convertDatesAgo(0) - (30 * 60) 
    let endDate=convertDatesAgo(0) - (10 * 60) 
    
    // create a correct Open RFP
    await proponContract.connect(addr1).createRFP(
      IDRFP[0],        // name
      nameRfp[0],   // description
      rfpWebLink[0], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.OPEN,
      listItems1, // No items
      {value: ethers.utils.parseEther('0.0002')}
    )
    // Read RFPs owned by company addr1
    const companyRFPs= await proponContract.getCompanyRFPs(addr1.address)
    const companyRFPsNumbers = companyRFPs.map(elem => parseInt(elem.toString()))
    expect(companyRFPsNumbers).deep.equal([0])
  });    

it("5 Should read correct RFPs globalindexes (0, 2, 5, 6, 8) owned by a company when there are several", async function () {
  const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
  // company addr1 creates 1 OPEN RFP
  await createRFP(proponContract, addr1, 4, ContestType.OPEN, listItems3, '0.0002')
  // company addr2 creates 1 INVITATION RFP
  await createRFP(proponContract, addr2, 0, ContestType.INVITATION, items, '0.0002')
  // company addr1 creates 1 OPEN RFP
  await createRFP(proponContract, addr1, 1, ContestType.OPEN, listItems3, '0.0002')
  // company addr3 creates 1 INVITATION RFP
  await createRFP(proponContract, addr3, 2, ContestType.INVITATION, listItems3, '0.0002')  
  // company addr3 creates 1 OPEN RFP
  await createRFP(proponContract, addr3, 3, ContestType.OPEN, listItems3, '0.0002')  
  // company addr1 creates 1 OPEN RFP
  await createRFP(proponContract, addr1, 5, ContestType.OPEN, listItems3, '0.0002')  
  // company addr1 creates 1 OPEN RFP
  await createRFP(proponContract, addr1, 6, ContestType.OPEN, listItems3, '0.0002')
  // company addr2 creates 1 INVITATION RFP
  await createRFP(proponContract, addr2, 8, ContestType.INVITATION, listItems3, '0.0002')  
  // company addr1 creates 1 OPEN RFP
  await createRFP(proponContract, addr1, 7, ContestType.OPEN, listItems3, '0.0002')  
  const companyRFPs= await proponContract.getCompanyRFPs(addr1.address)
  const companyRFPsNumbers = companyRFPs.map(elem => parseInt(elem.toString()))
  const addr2RFPs= await proponContract.connect(addr2).getCompanyRFPs(addr2.address)
  const addr2RFPsNumbers = addr2RFPs.map(elem => parseInt(elem.toString()))
  const addr3RFPs= await proponContract.connect(addr1).getCompanyRFPs(addr3.address)
  const addr3RFPsNumbers = addr3RFPs.map(elem => parseInt(elem.toString()))
  expect(companyRFPsNumbers).deep.equal([0, 2, 5,6,8])
  expect(addr2RFPsNumbers).deep.equal([1, 7])
  expect(addr3RFPsNumbers).deep.equal([3,4])
});  


  it("6 Should read correct RFPs globalindexes (0) owned by a company when there is no one", async function () {
    const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // Read RFPs owned by company addr1
    const companyRFPs= await proponContract.getCompanyRFPs(addr1.address)
    const companyRFPsNumbers = companyRFPs.map(elem => parseInt(elem.toString()))
    expect(companyRFPsNumbers).deep.equal([])
    });  

});
