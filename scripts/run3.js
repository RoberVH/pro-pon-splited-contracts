
const { ethers } = require("hardhat");

const main = async () => {
    const pro_ponContractFactory = await ethers.getContractFactory('pro_pon');
    const pro_ponContract = await pro_ponContractFactory.deploy();
    await pro_ponContract.deployed();
    console.log("Contract deployed to:", pro_ponContract.address);
    let test_pro_pon1 = {
      "id": "CLI160511W1M",
      "name": "Clionautacion",
    }    
    let test_pro_pon2 = {
        "id": "20-41150511",
        "name": "Hendricks & Sons llc",
      }    
      let test_pro_pon3 = {
        "id": "RT 231505110NON",
        "name": "Champ's Elisys",
      }    
    const[owner, add2, add3] = await ethers.getSigners();
  // 1rst creation ---------------------------------------------------
  console.log('1rst creation with owner address & exact payment ---------------------')
  let txn = await pro_ponContract.createCompany(
      test_pro_pon1.id,
      test_pro_pon1.name,
      {value: ethers.utils.parseEther('0.0001')}
  )
  // Wait for it to be mined.
  let result= await txn.wait()
  let event = result.events.find((e => e.event ==='NewCompanyCreated'))
  console.log('event.args.sender',event.args.sender)     
  console.log('event.args.sender',event.args.id)     
  console.log('event.args.tokenId',event.args.name)     
  let company= await pro_ponContract.getCompany(owner.address)
  console.log('Company', company) 

  /*readin companies ******************/
  console.log('Compañia creada por owner')
  let cia = await pro_ponContract.getCompany(owner.address)
  console.log('Compañia creada por owner:', cia)

  console.log('Compañia de addr 3 no existe')
  cia = await pro_ponContract.connect(add3.address).getCompany(add3.address)
  console.log('Compañia creada por owner:', cia)

  console.log('Compañia dir 0x0, no existe')
  cia = await pro_ponContract.getCompany('0x0000000000000000000000000000000000000000')
  console.log('Compañia creada por owner:', cia)


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