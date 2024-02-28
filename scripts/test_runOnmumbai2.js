
const { ethers } = require("hardhat");

const  jsoncontract = require('../artifacts/contracts/proponData.sol/pro_ponData.json')   
const proponContractData = process.env.PROPON_DATA_ADDRESS
const alchemyprovider=new ethers.providers.AlchemyProvider(  network = "maticmum" ,  process.env.ALCHEMY_MUMBAI_CVE  )
const signer = new ethers.Wallet(process.env.POLYGON_MUMBAI_PVK_ACCOUNT, alchemyprovider);
const proponContract = new ethers.Contract(proponContractData, jsoncontract.abi , signer);
console.log('proponContract',proponContract)


async function getRFPs() {
  const owner = await proponContract.getOwner()
  console.log('owner', owner)
  return
  const currRFPIdx = await proponContract.getcurrentRFPIdx()
  console.log('currRFPIdx',currRFPIdx)
  for (let i=0; i<currRFPIdx; i++)
    {
      const rfpStruct= await proponContract.getRFPbyIndex(i)
      console.log('ID de REFP:',rfpStruct.name)
    }
  }


  
  const runMain = async () => {
    try {
      console.log('Operaciones con contrato en Mumbai at:', proponContractData)
      await getRFPs();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  runMain();