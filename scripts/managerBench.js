const { ethers } = require("hardhat");
//const hre = require('hardhat');
const  jsoncontractData = require('../artifacts/contracts/proponData.sol/pro_ponData.json')  
const  jsoncontractLogic = require('../artifacts/contracts/proponLogic.sol/pro_ponLogic.json')  
const addressData='0x8703edb194E2584404ddd6231Ab5c3615F92211E'
const addressLogic='0x191D8544BbC67863aCA5ca8145866dBB4Ab108dB'

const alchemyprovider=new ethers.providers.AlchemyProvider(  network = "maticmum" ,  process.env.ALCHEMY_MUMBAI_CVE)
const signer = new ethers.Wallet(process.env.POLYGON_MUMBAI_PVK_ACCOUNT, alchemyprovider);
const proponDataContract = new ethers.Contract(addressData, jsoncontractData.abi , signer);
const proponLogicContract = new ethers.Contract(addressLogic, jsoncontractLogic.abi , signer);


const readContractVars = async () => {
  // const price= await proponDataContract.CREATE_OPEN_RFP_PRICE()
  // console.log('price OPEN RFP:',price.toString())
  // console.log('Getting owner')
  let owner = await proponDataContract.getOwner();
  console.log('Owner:', owner);
  const manager = await proponDataContract.getManager();
  console.log('manager:', manager);
  let maxGuest = await proponDataContract.MAX_GUEST_INVITATION_TENDER();
  // console.log('MAX_GUEST_INVITATION_TENDER:', maxGuest.toString());
  // const tx= await proponDataContract.setMaxGuestInvitationTender(10)
  // const result= await tx.wait()
  // let maxGuest2 = await proponDataContract.MAX_GUEST_INVITATION_TENDER();
  // console.log('MAX_GUEST_INVITATION_TENDER:', maxGuest2.toString());
  console.log('signer.address',signer.address)
  console.log('LogicContract address',proponLogicContract.address)
  }

  const readCompany = async () => {
    let company= await proponDataContract.getCompany(signer.address)
    console.log('company:', company)

  }
  const createCompany = async () => {
    console.log('Creando Compañia *****************\n Obteniendo precio de crear compañia')
    const price = await proponDataContract.CREATE_COMPANY_PRICE()
    console.log('Precio:', price.toString())
    // console.log('Estimando el gas')
    // try {
    //   const estimatedGas = await proponLogicContract.estimateGas.createCompany(
    //     "SEA170427W0Z", 
    //     "Servicios de Automatizacion Electrica, S.A.",
    //     "MEX",
    //     {value: ethers.utils.parseEther('0.0002')}
    //   ) 
    //   console.log("Estimated Gas: ", estimatedGas.toString());
    // }  catch (error) { console.log('Error', error)}
  

    try {
    const txn = await proponLogicContract.createCompany(
        "SEA170427W0Z", 
        "Servicios de Automatizacion Electrica, S.A.",
        "MEX",
        {value: ethers.utils.parseEther('0.0001')}
      )
      const result = await txn.wait()
      console.log('Company created:', result) 
    } catch (error) { console.log('Error', error.reason)}
  }


const runMain = async () => {
  try {
    //await readContractVars()
    console.log('-------------------------------------------------------------')
    await createCompany()
    console.log('-------------------------------------------------------------')
    await readCompany()
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();