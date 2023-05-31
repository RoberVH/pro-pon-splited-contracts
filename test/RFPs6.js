
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
  // if daysAgo is negative it returns today dates + daysAgo date - The Future
  function convertDatesAgo(daysAgo) {
    let today= new Date()
    let convertedDay= new Date(today)
    convertedDay.setDate(today.getDate() - daysAgo)
    return Math.floor(convertedDay.getTime() / 1000); // horario de verano, actualizar nodeJS???
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
    //console.log('Date in GMT', date)
    //console.log('Date in local time', date.toLocaleString())
    //return `${dd}/${mmm}/${yyyy}`;
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
const createRFP = async (proponLogicContract, address, RFPNameIdx, ContestType, ItemsList, value) => {
  let openDate=convertDatesAgo(5)
  let endReceiving=convertDatesAgo(2)
  let endDate=convertDatesAgo(1) 
  await proponLogicContract.connect(address).createRFP(
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
    const proponData = await ethers.getContractFactory("pro_ponData");
    const proponDataContract = await proponData.deploy();
    // console.log('proponDataContract',proponDataContract.address)
    // console.log('owner of proponDataContract', await proponDataContract.getOwner());
  
    const proponLogic = await ethers.getContractFactory("pro_ponLogic");
    const proponLogicContract = await proponLogic.deploy(
      proponDataContract.address
    );
  
    // console.log('proponLogicContract', proponLogicContract.address)
    // console.log('Setting Datacontract owner')
    await proponDataContract.setOwner(proponLogicContract.address);
  
    const clockTest = await ethers.getContractFactory("clockTest");
    const clockTestContract = await clockTest.deploy();
    
    
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

     return {proponDataContract, proponLogicContract, clockTestContract, owner, addr1, addr2, addr3, addr4, addr5,addr6 }
  }  
    
  

 describe("***********************************RFP6.js ********************************************\n   Validate dates when creating RFPs", function () {
   it("1 Should accept creating an  RFP starting rigth now", async function () {
    const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with Open Date major than end receiveing date
      let openDate=convertDatesAgo(0) 
      let endReceiving=convertDatesAgo(-3) //3 day from now
      let endDate=convertDatesAgo(-9) // 9 days from today
      
      
      await proponLogicContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')})
        const RFP = await proponDataContract.getRFPbyIndex(0)
        expect(RFP.name).to.equals(IDRFP[0])
   });
      

   it("2 Should reject creating RFP with opening date older than 1 hour", async function () {
    const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with end receiving Date major than end end Date 
      let openDate=convertDatesAgo(0) - 4600 // today
      let endReceiving=convertDatesAgo(-10) // 10 days into future
      let endDate=convertDatesAgo(-11) // 9 days into future, i.e. is short 1 day that receiving dateline
      await expect(proponLogicContract.connect(addr1).createRFP(
        IDRFP[0],        // name
        nameRfp[0],   // description
        rfpWebLink[0], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')})).to.be.revertedWith('opendate_behind_today')
      });
      
    it("3 Should accept creating RFP with opening date older than 1/2 hour", async function () {
      const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with end receiving Date major than end end Date 
      let openDate=convertDatesAgo(0) - 1800  // today with half an hour delay
      let endReceiving=convertDatesAgo(-5) // 5 days into future
      let endDate=convertDatesAgo(-9) // 9 days into future, i.e. is short 1 day that receiving dateline
      await proponLogicContract.connect(addr1).createRFP(
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
      const RFP = await proponDataContract.getRFPbyIndex(0)
      expect(RFP.name).to.equals(IDRFP[0])
   });


   it("4 Should reject trying create RFP with end receiving date equal to receiving Date", async function () {
    const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with Open Date major than end receiveing date
      let openDate=convertDatesAgo(-1)  // today
      let endReceiving=convertDatesAgo(-1) -7200 // same
      let endDate=convertDatesAgo(-9) // 9 days into future, i.e. is short 1 day that receiving dateline
      await expect(proponLogicContract.connect(addr1).createRFP(
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

  it("5 Should reject trying create RFP with end receiving date equal to endDate", async function () {
  const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    let openDate=convertDatesAgo(0) // today
    let endReceiving=convertDatesAgo(-3) // 3 days from today
    let endDate=convertDatesAgo(-3) // 3 days from today, i.e. is equal to receiving dateline

    await expect(proponLogicContract.connect(addr1).createRFP(
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

  it("6 Should accept creating RFP with openDate as of today", async function () {
    const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    let openDate=convertDatesAgo(0) // today
    let endReceiving=convertDatesAgo(-1) // 1 days from today
    let endDate=convertDatesAgo(-2) // 2 days from today, i.e. is equal to receiving dateline

    await proponLogicContract.connect(addr1).createRFP(
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
    let RFP = await  proponDataContract.getRFPbyIndex(0)
    expect(RFP.name).to.equal(IDRFP[0])
  });


// require(_openDate >= block.timestamp - 3600,'opendate_behind_today'); // allow one hour behind! 
  it("7 Should reject creating RFP with openDate older that today", async function () {
  const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    let openDate=convertDatesAgo(20) // 20 days ago
    let endReceiving=convertDatesAgo(15) // 15 days ago
    let endDate=convertDatesAgo(5) // 5 days ago

    await expect(proponLogicContract.connect(addr1).createRFP(
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

// PENDIENTE Habilitar  
//            require(RFPs[_rfpId].endReceivingDate > block.timestamp,'end_receiving_reached'); a
//             function inviteCompaniestoRFP
// 
// COMO ESTA, CUANDO YA VENCIO LA FECHA PARA RECIBIR DOCUMENTOS PODRAN HACERLO PERO NO PODRAN SUBIR DOCUMENTOS AL CONCURSO

it("8 Should reject inviting companies to RFP when Receiving Date has been reached", async function () {
  const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    // dates within the 1 hour behind range permitted by the contract
    let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
    let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
    let endDate=convertDatesAgo(0)  // Now

    await proponLogicContract.connect(addr1).createRFP(
      IDRFP[1],        // name
      nameRfp[1],   // description
      rfpWebLink[1], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      listItems1,
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX = 0
    const RFP = await proponDataContract.getRFPbyIndex(rfpINDEX)
    expect(RFP.name).to.equals(IDRFP[1])
    // this operation will be past the receiving Data end
    await expect(proponLogicContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address]
      )).to.be.revertedWith('end_receiving_reached')
  });

it("9 Should reject inviting companies to RFP when RFP is already canceled", async function () {
  const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
    // create RFP with Open Date major than end receiveing date
    // dates within the 1 hour behind range permitted by the contract
    let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
    let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
    let endDate=convertDatesAgo(0)  // Now

    await proponLogicContract.connect(addr1).createRFP(
      IDRFP[1],        // name
      nameRfp[1],   // description
      rfpWebLink[1], // RFP's web site link
      openDate,
      endReceiving,
      endDate,
      ContestType.INVITATION,
      listItems1,
      {value: ethers.utils.parseEther('0.0002')}
    )
    const rfpINDEX = 0
    const RFP = await proponDataContract.getRFPbyIndex(rfpINDEX)
    expect(RFP.name).to.equals(IDRFP[1])
    // this operation will be past the receiving Data end
    const today= convertDatesAgo(0)
    await proponLogicContract.connect(addr1).cancelRFP(test_pro_pon2.id, rfpINDEX )
    await expect(proponLogicContract.connect(addr1).inviteCompaniestoRFP(
      rfpINDEX, //invitation RFP index
      test_pro_pon2.id, // id of addr2 company
      [owner.address,addr2.address,addr3.address,addr5.address]
      )).to.be.revertedWith('already_canceled')
  });

  it("10 Should reject self registeringto RFP when RFP is already canceled", async function () {
    const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with Open Date major than end receiveing date
      // dates within the 1 hour behind range permitted by the contract
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0)  // Now
  
      await proponLogicContract.connect(addr1).createRFP(
        IDRFP[1],        // name
        nameRfp[1],   // description
        rfpWebLink[1], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )
      const rfpINDEX = 0
      const RFP = await proponDataContract.getRFPbyIndex(rfpINDEX)
      expect(RFP.name).to.equals(IDRFP[1])
      // this operation will be past the receiving Data end
      const today= convertDatesAgo(0)
      await proponLogicContract.connect(addr1).cancelRFP(test_pro_pon2.id, rfpINDEX )
      await expect(proponLogicContract.connect(owner).registertoOpenRFP(rfpINDEX, {value: ethers.utils.parseEther('0.0001')})      
      ).to.be.revertedWith('already_canceled')
    });

  it("11 Should reject declaring RFP winners  when RFP is already canceled", async function () {
    const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with Open Date major than end receiveing date
      // dates within the 1 hour behind range permitted by the contract
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0)  // Now
  
      await proponLogicContract.connect(addr1).createRFP(
        IDRFP[1],        // name
        nameRfp[1],   // description
        rfpWebLink[1], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )
      const rfpINDEX = 0
      const RFP = await proponDataContract.getRFPbyIndex(rfpINDEX)
      expect(RFP.name).to.equals(IDRFP[1])
      // this operation will be past the receiving Data end
      const today= convertDatesAgo(0)
      await proponLogicContract.connect(addr1).cancelRFP(test_pro_pon2.id, rfpINDEX )
      let winers = [owner.address, addr5.address, addr5.address, addr5.address, owner.address]
      // declare owner accouunt winner
      await expect( proponLogicContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winers)).to.be.revertedWith('already_canceled')
    });

  it("12 Should reject cancelling an RFP  when is already canceled", async function () {
    const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);
      // create RFP with Open Date major than end receiveing date
      // dates within the 1 hour behind range permitted by the contract
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await proponLogicContract.connect(addr1).createRFP(
        IDRFP[1],        // name
        nameRfp[1],   // description
        rfpWebLink[1], // RFP's web site link
        openDate,
        endReceiving,
        endDate,
        ContestType.OPEN,
        listItems1,
        {value: ethers.utils.parseEther('0.0002')}
      )
      const rfpINDEX = 0
      const RFP = await proponDataContract.getRFPbyIndex(rfpINDEX)
      expect(RFP.name).to.equals(IDRFP[1])
      await proponLogicContract.connect(addr1).cancelRFP(test_pro_pon2.id, rfpINDEX)
      //try to cancel an already cancelled RFP
      await expect(proponLogicContract.connect(addr1).cancelRFP(test_pro_pon2.id, rfpINDEX)).to.be.revertedWith('already_canceled')
    });

it("13 Should reject  owner of Open RFP declaring winners before endDate reached", async function () {
  const { proponDataContract,  proponLogicContract, clockTestContract,   owner, addr1, addr2, addr3, addr4, addr5, addr6 } = await loadFixture(deployProponandCreateCompanies);

    let openDate=convertDatesAgo(0) - (40 * 60)
    let endReceiving=convertDatesAgo(-1)
    let endDate=convertDatesAgo(-20) // 10 days into future
    // console.log('endReceiving',convertUnixToDate(endReceiving))
//    console.log('openDate',convertUnixToDate(openDate))
    // console.log('endDate',convertUnixToDate(endDate))
    
    // create a correct Open RFP
    await proponLogicContract.connect(addr1).createRFP(
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
    await proponLogicContract.connect(owner).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
    await proponLogicContract.connect(addr2).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
    await proponLogicContract.connect(addr3).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
    await proponLogicContract.connect(addr5).registertoOpenRFP(0, {value: ethers.utils.parseEther('0.0001')})
    // declare winners for all itemLists
    const winners = [
      owner.address, addr2.address, owner.address, 
      addr5.address, addr3.address, addr3.address,
    ]
    const rfpINDEX=0  // only 1 RFP defined so far
    await expect( proponLogicContract.connect(addr1).declareWinners( rfpINDEX, test_pro_pon2.id, winners))
    .to.be.revertedWith('enddate_not_reached_yet')
  });    
}); 
