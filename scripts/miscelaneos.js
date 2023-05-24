
const { ethers } = require("hardhat");

const main = async () => {
    const pro_ponContractFactory = await ethers.getContractFactory('pro_pon');
    const pro_ponContract = await pro_ponContractFactory.deploy();
    await pro_ponContract.deployed();
    console.log("Contract deployed to:", pro_ponContract.address);
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
  console.log('\n 1rst creation with owner address & exact payment ---------------------')
  let txn = await pro_ponContract.createCompany(
      test_pro_pon1.id,
      test_pro_pon1.name,
      test_pro_pon1.country,
      {value: ethers.utils.parseEther('0.0001')}
  )
  // Wait for it to be mined.
  let result= await txn.wait()
  let event = result.events.find((e => e.event ==='NewCompanyCreated'))
  console.log('event.args.sender',event.args.sender)     
  console.log('event.args.sender',event.args.id)     
  console.log('event.args.tokenId',event.args.name)      


   let company =await pro_ponContract.getCompany(owner.address) 
   console.log('company',company)
    /****************Get enum values */
    // let retorno= await pro_ponContract.returnEnum();
    // console.log('Retorno de enums:', retorno)
    // console.log('typeof enum OPEN',typeof retorno[0])

    

  // console.log('\n 2nd creation with address 2  & exact payment Error expected----------------')
  // txn = await pro_ponContract.connect(add2).createCompany(
  //     test_pro_pon2.id,
  //     test_pro_pon2.name,
  //     {value: ethers.utils.parseEther('0.0001')}
  // )
  // // Wait for it to be mined.
  // try {
  // result= await txn.wait()
  // event = result.events.find((e => e.event ==='NewCompanyCreated'))
  // console.log('event.args.sender',event.args.sender)     
  // console.log('event.args.sender',event.args.id)     
  // console.log('event.args.tokenId',event.args.name)      
  // } catch (error) {
  //   console.log('there was an error', error)
  //   process.exit(1);
  // }
  // console.log('\n 3rd creation over payment-----------------------')
  // txn = await pro_ponContract.connect(add3).createCompany(
  //     test_pro_pon3.id,
  //     test_pro_pon3.name,
  //     {value: ethers.utils.parseEther('0.001')})
  // // Wait for it to be mined.
  //  result= await txn.wait()
  // event = result.events.find((e => e.event ==='NewCompanyCreated'))
  // console.log('event.args.sender',event.args.sender)     
  // console.log('event.args.sender',event.args.id)     
  // console.log('event.args.tokenId',event.args.name)      

  // console.log('\n Draw balance from owner account--------------------')
  // let balance = await ethers.provider.getBalance(pro_ponContract.address)
  // balance = console.log('Present contract balance', formatea(balance))
  // balance = await ethers.provider.getBalance(owner.address)
  // console.log('Present owner balance', formatea(balance))
  //   // Wait for it to be mined.
  // txn = await pro_ponContract.withdraw()
  // result= await txn.wait()
  // balance = await ethers.provider.getBalance(pro_ponContract.address)
  // balance = console.log('contract balance after withdraw', formatea(balance))
  // balance = await ethers.provider.getBalance(owner.address)
  // console.log('owner balance after withdraw', formatea(balance))

  // console.log('\n Draw balance from other  account fail expected-----------------')
  // balance = await ethers.provider.getBalance(pro_ponContract.address)
  // balance = console.log('Present contract balance', formatea(balance))
  // balance = await ethers.provider.getBalance(owner.address)
  // console.log('Present owner balance', formatea(balance))
  //   // Wait for it to be mined.
  // txn = await pro_ponContract.connect(add2).withdraw()
  // result= await txn.wait()
  // balance = await ethers.provider.getBalance(pro_ponContract.address)
  // balance = console.log('contract balance after withdraw', formatea(balance))
  // balance = await ethers.provider.getBalance(owner.address)
  // console.log('owner balance after withdraw', formatea(balance))

 
}

function formatea(bal) {
  return ethers.utils.formatEther(bal)
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