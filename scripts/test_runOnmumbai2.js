
const { ethers } = require("hardhat");

const  jsoncontract = require('../artifacts/contracts/pro-pon.sol/pro_pon.json')   

const main = async () => {

   //const pro_ponContractFactory = await ethers.getContractFactory('pro_pon');
    //pro_ponContractFactory.attach('0xd3d851bA386FdAD02BF1DcE2BcF0108eF74C20ce')
    const alchemyprovider=new ethers.providers.AlchemyProvider(  network = "maticmum" ,  'dxp8tOWZTcrkZxLZGWD3NRjrDHkcLLA6'  )
    const signer = new ethers.Wallet(process.env.POLYGON_MUMBAI_PVK_ACCOUNT, alchemyprovider);
    const proponContract = new ethers.Contract('0xBB9bac7E25B1739c090B823078F9e5a390AE2a91', jsoncontract.abi , signer);
    //const pro_ponContract = await pro_ponContractFactory.deploy();
    //await pro_ponContract.deployed();
    //console.log("Contract deployed to:", pro_ponContract.address);
    // let test_pro_pon1 = {
    //   "id": "CLI160511W1M",
    //   "name": "Clionautacion",
    //   "country":"MEX"
    // }    
    // let test_pro_pon2 = {
    //     "id": "20-41150511",
    //     "name": "Hendricks & Sons llc",
    //     "country":"USA"
    //   }    
    //   let test_pro_pon3 = {
    //     "id": "RT 231505110NON",
    //     "name": "Champ's Elisys",
    //     "country":"CAN"
    //   }   
    // const[owner, add2, add3] = await ethers.getSigners();
  // 1rst creation ---------------------------------------------------
  //console.log('1rst creation with owner address & exact payment ---------------------')
  // let txn = await pro_ponContract.createCompany(
  //     test_pro_pon1.id,
  //     test_pro_pon1.name,
  //     test_pro_pon1.country,
  //     {value: ethers.utils.parseEther('0.0001')}
  // )
  // Wait for it to be mined.
  // let result= await txn.wait()
  // let event = result.events.find((e => e.event ==='NewCompanyCreated'))
  // console.log('event.args.sender',event.args.sender)     
  // console.log('event.args.sender',event.args.id)     
  // console.log('event.args.tokenId',event.args.name)     
  // let company= await pro_ponContract.getCompany(owner.address)
  // console.log('Company', company) 

  /*readin companies ******************/
/*  console.log('Compañia creada por owner')
  console.log('owner address es:', owner.address)
  let cia = await pro_ponContract.getCompany(owner.address)
  console.log('getCompanyId Compañia creada por  owner:', cia)

  cia = await  await pro_ponContract.getCompany('0xA17C0CA84D742Df1879Ca096835c6433406759e2')
  console.log('getCompanyId Compañia creada por rovicher.eth:', cia)


  console.log('Compañia creada  0x883F4B1a36Ccc16E59aEa4592A6Cd2AEE5c02742 (Revisar dApps)')
  cia = await pro_ponContract.getCompany('0x883F4B1a36Ccc16E59aEa4592A6Cd2AEE5c02742')
  

   console.log(' Compañia creada por owner:', cia)

//   console.log('Compañia de addr 3 no existe', add3.address)    // undefined -> causa crash de la EVM
   //cia = await pro_ponContract.getCompany(add3.address)
   //console.log('Compañia creada por owner:', cia)
   //cia = await pro_ponContract.getCompany(add3.address)

   console.log('Compañia creada por : 0x6F02b922b06C32e1704dD1826776B290AC45D89F (Cta para Desarrollo)')
   cia = await pro_ponContract.getCompany('0x6F02b922b06C32e1704dD1826776B290AC45D89F')*/
   
   

  // console.log('Compañia dir 0x0, no existe')
  // cia = await pro_ponContract.getCompany('0x0000000000000000000000000000000000000000')
  // console.log('Compañia creada por owner:', cia)    

  // console.log('Creantdo RFP 0')
  // await createRFP(proponContract, 0,openContest,listItems1)
  // await createRFP(proponContract, 1,invitationContest,listItems1)
  // console.log('Creantdo RFP 1')
  // await createRFP(proponContract, 2,openContest,listItems2)
  // console.log('Creantdo RFP 2')
  // await createRFP(proponContract, 3,invitationContest,listItems2)
  // console.log('Creantdo RFP 3')
  // await createRFP(proponContract, 4,openContest,listItems3)
  // console.log('Creantdo RFP 4')
  // await createRFP(proponContract, 5,invitationContest,listItems3)
  
  // let company= await proponContract.getCompany('0xE9B1436262593fA862911eDD0C78017B77D131ab')
  // let RFPidx = await company.company_RFPs[0]  // retrieve first RFP of this company
  // let RFP = await proponContract.getRFPbyIndex(RFPidx)
  // console.log('compañia de 0xE9B1436262593fA862911eDD0C78017B77D131ab 1rst RFP:', RFP)

  // company= await proponContract.getCompany('0xE9B1436262593fA862911eDD0C78017B77D131ab')
  // RFPidx = await company.company_RFPs[1]  // retrieve first RFP of this company
  // RFP = await proponContract.getRFPbyIndex(RFPidx)
  // console.log('compañia de 0xE9B1436262593fA862911eDD0C78017B77D131ab 2nd RFP:', RFP)

  // company= await proponContract.getCompany('0xE9B1436262593fA862911eDD0C78017B77D131ab')
  // RFPidx = await company.company_RFPs[2]  // retrieve second RFP of this company
  // RFP = await proponContract.getRFPbyIndex(RFPidx)
  // console.log('compañia de 0xE9B1436262593fA862911eDD0C78017B77D131ab 3rd RFP:', RFP)

  // company= await proponContract.getCompany('0xE9B1436262593fA862911eDD0C78017B77D131ab')
  // RFPidx = await company.company_RFPs[3]  // retrieve second RFP of this company
  // RFP = await proponContract.getRFPbyIndex(RFPidx)
  // console.log('compañia de 0xE9B1436262593fA862911eDD0C78017B77D131ab 4th  RFP:', RFP)

  // company= await proponContract.getCompany('0xE9B1436262593fA862911eDD0C78017B77D131ab')
  // RFPidx = await company.company_RFPs[4]  // retrieve second RFP of this company
  // RFP = await proponContract.getRFPbyIndex(RFPidx)
  // console.log('compañia de 0xE9B1436262593fA862911eDD0C78017B77D131ab 5th  RFP:', RFP)


  company= await proponContract.getCompany('0xE9B1436262593fA862911eDD0C78017B77D131ab')
  RFPidx = await company.company_RFPs[7]  // retrieve second RFP of this company
  RFP = await proponContract.getRFPbyIndex(RFPidx)
  console.log('compañia de 0xE9B1436262593fA862911eDD0C78017B77D131ab 8th  RFP:', RFP)

  console.log('END OF PROCESS')
}

const ContestType = {OPEN:0, INVITATION_ONLY:1}
const  openContest = ContestType.OPEN 
const  invitationContest = ContestType.INVITATION_ONLY 

function convertDate(date)   {
  return unixdate=Math.floor(new Date(date).getTime()/1000)
}


let nameRfp=[
  'Reacondicionamiento de Luminarias',
  'Cleaning Services',
  'Déneigement des installations',
  'Sistema electronico de Votación',
  '2022-2023 Translations Services',
  'Service de transport des employés',]
let openDate=convertDate('2022/07/24')
let endReceiving=convertDate('2022/08/10')
let endDate=convertDate('2022/08/30')        
let participantLimit=5

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

async function createRFP(proponContract, nameIdx, typeContest, listItems) {
  let rfp= await proponContract.createRFP(
    nameRfp[nameIdx],
    openDate,
    endReceiving,
    endDate,
    typeContest, 
    //participantLimit,
    listItems)
  let result= await rfp.wait()
}

  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  runMain();