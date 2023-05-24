
const { ethers } = require("hardhat");

const  jsoncontract = require('../artifacts/contracts/pro-pon.sol/pro_pon.json')   //('../')
const main = async () => {
    //const pro_ponContractFactory = await ethers.getContractFactory('pro_pon');
    //pro_ponContractFactory.attach('0xd3d851bA386FdAD02BF1DcE2BcF0108eF74C20ce')
    const alchemyprovider=new ethers.providers.AlchemyProvider(  network = "maticmum" ,  'dxp8tOWZTcrkZxLZGWD3NRjrDHkcLLA6'  )
    const signer = new ethers.Wallet(process.env.POLYGON_MUMBAI_PVK_ACCOUNT, alchemyprovider);
    const pro_ponContract = new ethers.Contract('0xd3d851bA386FdAD02BF1DcE2BcF0108eF74C20ce', jsoncontract.abi , signer);
    //const pro_ponContract = await pro_ponContractFactory.deploy();
    //await pro_ponContract.deployed();
    //console.log("Contract deployed to:", pro_ponContract.address);
    let test_pro_pon1 = {
      "id": "CLI160511W1M",
      "name": "Clionautacion",
      "country":"MEX"
    }    
    let test_pro_pon2 = {
        "id": "20-41150511",
        "name": "Hendricks & Sons llc",
        "country":"USA"
      }    
      let test_pro_pon3 = {
        "id": "RT 231505110NON",
        "name": "Champ's Elisys",
        "country":"CAN"
      }   
    const[owner, add2, add3] = await ethers.getSigners();
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
 /* console.log('Compañia creada por owner')
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
   cia = await pro_ponContract.getCompany('0x6F02b922b06C32e1704dD1826776B290AC45D89F')
   
   

  console.log('Compañia dir 0x0, no existe')
  cia = await pro_ponContract.getCompany('0x0000000000000000000000000000000000000000')
  console.log('Compañia creada por owner:', cia)    */

  cia = await pro_ponContract.getCompany('0xE9B1436262593fA862911eDD0C78017B77D131ab')
  console.log("Compañia creada por (0xE9B1436262593fA862911eDD0C78017B77D131ab): ", cia.name)

  for (let i=0; i < cia.company_RFPs.length; i++) {
    const rfp= await pro_ponContract.getRFPbyIndex(i)
    console.log("RFP[",i,'] ', rfp)
  }

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