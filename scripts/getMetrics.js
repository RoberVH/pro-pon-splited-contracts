const { ethers } = require("hardhat");

const main = async () => {
   // proponData
   // ProponData Contract owner: 0xE9B1436262593fA862911eDD0C78017B77D131ab
  
   // const  CONTRACT_ADDRESS_DATA='0xDe57fcD6642058A651C965dD6522A9505349c095'
  //  const CONTRACT_ADDRESS_LOGIC='
  
  const  CONTRACT_ADDRESS_DATA=   process.env.PROPON_DATA_ADDRESS
    const CONTRACT_ADDRESS_LOGIC= process.env.PROPON_LOGIC_ADDRESS



  const  jsoncontractLogic = require('../artifacts/contracts/proponLogic.sol/pro_ponLogic.json')   
  const  jsoncontractData = require('../artifacts/contracts/proponData.sol/pro_ponData.json')   

  const alchemyprovider=new ethers.providers.AlchemyProvider(  network = "maticmum" ,  process.env.ALCHEMY_MUMBAI_CVE)
  const signer = new ethers.Wallet(process.env.POLYGON_MUMBAI_PVK_ACCOUNT, alchemyprovider);
  const proPonLogicContract = new ethers.Contract(CONTRACT_ADDRESS_LOGIC, jsoncontractLogic.abi , signer);
  const proPonDataContract = new ethers.Contract(CONTRACT_ADDRESS_DATA, jsoncontractData.abi , signer);



  // get Owners and manager
    console.log('\nProponData  contract address:', CONTRACT_ADDRESS_DATA)
    console.log('ProponLogic contract address:', CONTRACT_ADDRESS_LOGIC)
    console.log("----------------------------------------------------");
    const owner = await proPonDataContract.getOwner()
    const manager = await proPonDataContract.getManager()
    console.log("Propon_Data Owner:", owner)
    console.log("Propon_Data Manager:", manager)
    console.log("----------------------------------------------------");

    // get Owners and manager
    const ownerLogic = await proPonLogicContract.getOwner()
    console.log("Propon_Logic Owner:",   ownerLogic)
    console.log("--------------------------------------------------------");

    // get Balance
    const proponLogicBal =  await alchemyprovider.getBalance(CONTRACT_ADDRESS_LOGIC)
    console.log("Propon_Logic Balance:",   ownerLogic)
    console.log(`The balance of Propon_Logic (${CONTRACT_ADDRESS_LOGIC}) es ${ethers.utils.formatEther(proponLogicBal)} MATICS`)
    console.log("--------------------------------------------------------\n");


    //  Transfer ownership of ProPonData contract to ProPonLogic contract
    //await proPonDataContract.setOwner(proPonLogicContract.address);
    //console.log("Ownership of ProPon_Data transferred to ProPon_Logic");
    //console.log("----------------------------------------------------");

};


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
