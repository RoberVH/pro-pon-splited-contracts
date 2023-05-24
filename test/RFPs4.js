
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
  function convertDate(date)   {
    return unixdate=Math.floor(new Date(date).getTime()/1000)
  }

  function convertDatesAgo(daysAgo) {
    let today= new Date()
    let convertedDay= new Date(today)
    convertedDay.setDate(today.getDate()-daysAgo)
    return todayTimestamp = Math.floor(convertedDay.getTime() / 1000);
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
    const [owner, addr1, addr2, addr3, addr4, addr5,addr6,addr7,addr8] = await ethers.getSigners();
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
        test_pro_pon3.country,
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
    
    return { proponContract, owner, addr1, addr2, addr3, addr4, addr5,addr6, addr7,addr8 };
  }  
    
  
  describe("********************** RFPs4.js ********************** \nRecord participant invitation companies to RFP ", function () {
    it("1 Should record invitation to three companies (invitation contest) of addr2 company RFP", async function () {
      const {  proponContract,  owner, addr1, addr2, addr3 } = await loadFixture(deployProponandCreateCompanies);
      // create 1 Open & 1 Invitation RFPs  for company addr2
      let openDate=convertDatesAgo(0) - (15 * 60) // 15 mins ago
      let endReceiving=convertDatesAgo(0) - (10 * 60) // 10 mins ago
      let endDate=convertDatesAgo(0) -(2 * 60)  // Now
      await proponContract.connect(addr2).createRFP(IDRFP[1],nameRfp[1],rfpWebLink[1],openDate,endReceiving,
        endDate,ContestType.OPEN,listItems3, {value: ethers.utils.parseEther('0.0001')}
      ) 
      await proponContract.connect(addr2).createRFP(IDRFP[2],nameRfp[2],rfpWebLink[2],openDate,endReceiving,endDate,ContestType.INVITATION,listItems2,
            {value: ethers.utils.parseEther('0.0002')}
      )       
      // get addr2 company record
      let company= await proponContract.getCompany(addr2.address)
      // retrieve second RFP of addr2 company
      let RFPidx = await company.company_RFPs[1]  // second contest is invitation type
      //let rfp= await proponContract.getRFPbyIndex(RFPidx)
      // let addr2 invite owner to second RFP (Invitation)
      // invite three companies to invitation contest
      await proponContract.connect(addr2).inviteCompaniestoRFP(
        RFPidx,
        test_pro_pon3.id, // ID of owner account
        [owner.address, addr1.address, addr3.address]     // owner account
       )  
      let RFP = await proponContract.getRFPbyIndex(RFPidx)
      expect(RFP.participants).to.eql([owner.address, addr1.address, addr3.address]);
    });

    it("2 Should ignore addr1 company invitation to self and register other companies addrs", async function () {
      const {  proponContract, owner, addr1,addr2,addr3 } = await loadFixture(deployProponandCreateCompanies);
      // get first company record
      // create RFPs
      await createRFP(proponContract, addr1, 3, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponContract, addr1, 0, ContestType.INVITATION, items, '0.0002')
      // retrieve second RFP of this company
      let company= await proponContract.getCompany(addr1.address)
      let RFPidx = await company.company_RFPs[1]  
      await proponContract.connect(addr1).inviteCompaniestoRFP(
        RFPidx.toNumber(),
        test_pro_pon2.id,
        [owner.address,addr1.address,addr2.address,addr3.address])
      let RFP = await proponContract.getRFPbyIndex(RFPidx)
      expect(RFP.participants).to.have.members([addr3.address, owner.address,addr2.address])
    });    

    it("3 Should ignore invitation for two companies already invited", async function () {
      const {  proponContract, owner, addr1, addr2, addr3, addr4, addr5 } = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponContract, owner, 3, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponContract, owner, 0, ContestType.INVITATION, items, '0.0002')
      // retrieve second RFP of owner company
      let company= await proponContract.getCompany(owner.address)      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  
      await proponContract.inviteCompaniestoRFP(  // invite first set of companies (addr1, addr3 & addr4)
      RFPidx,
      test_pro_pon1.id,
      [addr1.address,addr3.address] )
      await proponContract.inviteCompaniestoRFP(  // invite second set of companies
      RFPidx,
      test_pro_pon1.id,
      [addr1.address,addr2.address, addr3.address ] ) // only addr 2 
      // get company record
      let RFP = await proponContract.getRFPbyIndex(RFPidx)
      //check participants first (addr2) and second (addr1) participants to RFP 
      expect(RFP.participants).to.have.members([addr1.address,addr2.address, addr3.address]);
      expect(RFP.participants.length).to.equal(3);
    });    

    it("4 Should ignore invitation for a companie already invited and owner of rfp", async function () {
      const {  proponContract, owner, addr1, addr2, addr3, addr4, addr5 } = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponContract, owner, 3, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponContract, owner, 0, ContestType.INVITATION, items, '0.0002')
      // retrieve second RFP of this company
      let company= await proponContract.getCompany(owner.address)      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  
      await proponContract.inviteCompaniestoRFP(  // invite first set of companies
      RFPidx,
      test_pro_pon1.id,
      [addr1.address,addr3.address] )
      await proponContract.inviteCompaniestoRFP(  // invite second set of companies
      RFPidx,
      test_pro_pon1.id,
      [addr1.address,addr2.address,owner.address ] ) // only addr 2 
      // get company record
      let RFP = await proponContract.getRFPbyIndex(RFPidx)
      //check participants first (addr2) and second (addr1) participants to RFP 
      expect(RFP.participants).to.have.members([addr1.address,addr2.address, addr3.address]);
      expect(RFP.participants.length).to.equal(3);
    });      

    
    it("5 Should reject not RFP issuer invitation when company Id is wrong", async function () {
      const {  proponContract,  owner, addr1, addr2 } = await loadFixture(deployProponandCreateCompanies);
      // crete RFP
      await createRFP(proponContract, owner, 0, ContestType.OPEN, listItems2, '0.0002') 
      await createRFP(proponContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
      // get RFP owner company record
      let company= await proponContract.getCompany(owner.address)
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // company from addr1
      await expect(proponContract.inviteCompaniestoRFP(    // try to invite addr2 company from owner account
        RFPidx,               
        test_pro_pon2.id,                                 // with wrong COmpany Id (should be test_pro_pon1.id)
        [addr2.address, addr1.address]
        )).to.be.revertedWith("Only_admin_can_perform")
    });   

    it("6 Should reject not issuer invitation when account try to pass by someone else company Id", async function () {
      const {  proponContract,  owner, addr1, addr2 } = await loadFixture(deployProponandCreateCompanies);
        // crete RFP
        await createRFP(proponContract, owner, 2, ContestType.OPEN, listItems2, '0.0002') 
        await createRFP(proponContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
      // get RFP owner company record
      let company= await proponContract.getCompany(owner.address) 
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company
      await expect(proponContract.connect(addr1).inviteCompaniestoRFP(    // addr1 trying pass as owner
        RFPidx,
        test_pro_pon1.id,   // Company Id of owner
        [addr2.address, addr1.address]       // invite addr2 company
        )).to.be.revertedWith("Only_admin_can_perform")
    });       

    it("7 Should register MAX_GUEST_INVITATION_TENDER companies to invitation Contest in different loads", async function () {
      const {  proponContract, owner, addr1,addr2, addr3, addr4,addr5, addr6, addr7, addr8 } = await loadFixture(deployProponandCreateCompanies);
      // get first company record
      // create RFPs
      await createRFP(proponContract, addr1, 3, ContestType.INVITATION, listItems3, '0.0002')
      await createRFP(proponContract, addr1, 0, ContestType.INVITATION, items, '0.0002')
      // retrieve second RFP of this company
      let company= await proponContract.getCompany(addr1.address)
      let RFPidx = await company.company_RFPs[1]  
      await proponContract.connect(addr1).inviteCompaniestoRFP(
        RFPidx.toNumber(),
        test_pro_pon2.id,
        [owner.address,addr1.address])  // should ignore addr1 add only owner total 1 invited
     await proponContract.connect(addr1).inviteCompaniestoRFP(
        RFPidx.toNumber(),
        test_pro_pon2.id,
        [owner.address, addr6.address]) // should ignore owner add only addr6 total 2 invited
        await proponContract.connect(addr1).inviteCompaniestoRFP(
        RFPidx.toNumber(),
        test_pro_pon2.id,
        [addr4.address,addr3.address, addr6.address])              // ignore addr6 add addr4 & addr3 total 4 invited
        await proponContract.connect(addr1).inviteCompaniestoRFP(
          RFPidx.toNumber(),
          test_pro_pon2.id,
          [addr8.address]) // should add addr8 total 5 invited  */
      let RFP = await proponContract.getRFPbyIndex(RFPidx)
        expect(RFP.participants).to.have.members([owner.address, addr6.address, addr3.address, addr4.address, addr8.address ])
        expect(RFP.participants.length).to.equal(5)
    });  

  });

  describe("Record participant registration to OPEN and INVITATION RFPs ", function () {
    it("8 Should reject a company trying to register to INVITATION RFP", async function () {
      const {  proponContract,  owner, addr1 } = await loadFixture(deployProponandCreateCompanies);
     // create RFPs
     await createRFP(proponContract, owner, 3, ContestType.INVITATION, listItems3, '0.0003') // overpaying! should be alrigth
     await createRFP(proponContract, owner, 0, ContestType.INVITATION, items, '0.0002')
     // get  company record
      let company= await proponContract.getCompany(owner.address) 
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company Invitation RFP
      await expect(proponContract.connect(addr1)
        .registertoOpenRFP(
        RFPidx, 
          {value: ethers.utils.parseEther('0.0001')}
        ))
        .to.be.revertedWith("not_open_tender")
    });       

    it("9 Should allow recording addr2 company registering to owner company OPEN RFP", async function () {
      const {  proponContract,  owner, addr2 } = await loadFixture(deployProponandCreateCompanies);
      // create RFPs
      await createRFP(proponContract, owner, 3, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
      await createRFP(proponContract, owner, 0, ContestType.INVITATION, items, '0.0002')
     // get  company record
      let company= await proponContract.getCompany(owner.address)
      // retrieve first RFP of this company
      let RFPidx = await company.company_RFPs[0]  // First contest is open contest
      await proponContract.connect(addr2).registertoOpenRFP(
          RFPidx,  
          {value: ethers.utils.parseEther('0.0001')}
      )
      let RFP = await proponContract.getRFPbyIndex(RFPidx)
      expect(RFP.participants[0]).to.equal(addr2.address);
    });

    it("10 Should reject addr2  registering to its own open RFP", async function () {
      const {  proponContract, addr2 } = await loadFixture(deployProponandCreateCompanies);
      // create RFPs
      await createRFP(proponContract, addr2, 1, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
      await createRFP(proponContract, addr2, 2, ContestType.INVITATION, listItems1, '0.0002')
     // get  company record
      let company= await proponContract.getCompany(addr2.address)
      // retrieve first RFP of this company
      let RFPidx = await company.company_RFPs[0]  // first contest is open contest
      await expect(proponContract.connect(addr2)
        .registertoOpenRFP(
            RFPidx,  
            {value: ethers.utils.parseEther('0.0001')}))
            .to.be.revertedWith('can_not_register_self')
    });

    it("11 Should reject a company registering under price to OPEN RFP", async function () {
      const {  proponContract,  owner, addr1 } = await loadFixture(deployProponandCreateCompanies);
     // create RFPs
     await createRFP(proponContract, owner, 1, ContestType.OPEN, listItems3, '0.0003') // overpaying! should be alrigth
     await createRFP(proponContract, owner, 0, ContestType.OPEN, items, '0.0002')
     // get  company record
      let company= await proponContract.getCompany(owner.address) 
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company OPEN RFP
      await expect(proponContract.connect(addr1)
        .registertoOpenRFP(
        RFPidx, 
          {value: ethers.utils.parseEther('0.00001')}
        ))
        .to.be.revertedWith("Insufficient_payment_fee")
    });       


    it("12 Should record five companies to open", async function () {
      const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5,addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponContract, owner, 1, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponContract, owner, 0, ContestType.OPEN, items, '0.0002')
      // get  company record
      let company= await proponContract.getCompany(owner.address) 
      let RFPidx = await company.company_RFPs[0]  // first contest is open contest
      await proponContract.connect(addr1).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr2).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr3).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr4).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr5).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      let rfp= await proponContract.getRFPbyIndex(RFPidx)   // bring again value from contract after those registers
      expect(rfp.participants.length).to.equal(5);
    });


      // To test this should set  uint MAX_GUEST_OPEN_TENDER = 5 in propon contract
    it("13 Should reject more companies than max limit allowed register to open tender", async function () {
      const {  proponContract,  owner, addr1, addr2, addr3, addr4, addr5,addr6} = await loadFixture(deployProponandCreateCompanies);
      await createRFP(proponContract, owner, 1, ContestType.OPEN, listItems3, '0.0002')
      await createRFP(proponContract, owner, 0, ContestType.OPEN, items, '0.0002')
      // get  company record
      let company= await proponContract.getCompany(owner.address) 
      await proponContract.setMaxGuestOpenTender(5)
      // retrieve second RFP of this company
      let RFPidx = await company.company_RFPs[0]  // first contest is open contest
      await proponContract.connect(addr1).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr2).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr3).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr4).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await proponContract.connect(addr5).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')})
      await expect(proponContract.connect(addr6).registertoOpenRFP(RFPidx,  {value: ethers.utils.parseEther('0.0001')}))
      .to.be.revertedWith("max_participants_reached")
      });


      it("14 Should reject adding owner of invitation RFP to own rfp", async function () {
        const {  proponContract,  owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployProponandCreateCompanies);
          // crete RFP
          await createRFP(proponContract, owner, 2, ContestType.OPEN, listItems2, '0.0002') 
          await createRFP(proponContract, owner, 1, ContestType.INVITATION, listItems1, '0.0002') 
        // get RFP owner company record
        let company= await proponContract.getCompany(owner.address) 
        // retrieve second RFP of this company
        let RFPidx = await company.company_RFPs[1]  // Second RFP from owner company
        await proponContract.connect(owner).inviteCompaniestoRFP(    // invite correctly 2 companies
          RFPidx,
          test_pro_pon1.id,   // Company Id of owner
          [addr2.address, addr1.address]       // adds addr1 & addr2 companies total of 2
          )
          await proponContract.connect(owner).inviteCompaniestoRFP(    // trying to correct addr3 and incorrect invite  owner
          RFPidx,
          test_pro_pon1.id,   // Company Id of owner
          [owner.address, addr4.address, owner.address] // adds only add4 ignore twice owner Total of 3
          )
          let rfp= await proponContract.getRFPbyIndex(RFPidx)   // bring again value from contract after those registers
          expect(rfp.participants.length).to.equal(3)
      });        
      
  });
