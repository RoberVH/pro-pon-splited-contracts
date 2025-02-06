const { ethers } = require("hardhat");

const jsoncontract = require("../artifacts/contracts/proponData.sol/pro_ponData.json"); //('../')


const CONTRACT_ADDRESS_DATA = "0x347C903B604f0E5BE5212A9C2150f5A27462F344";  // ProponData contract
const CONTRACT_ADDRESS_LOGIC = "0xb7d0d95809c38f5456fc308a19973dfc630a7ff2"; // ProponLogic contract

  const alchemyprovider = new ethers.providers.AlchemyProvider(
  (network = "maticmum"),
  process.env.ALCHEMY_MUMBAI_CVE
);
const signer = new ethers.Wallet(
  process.env.TEST1_PVK_ACCOUNT,
  alchemyprovider
);
const pro_ponContract = new ethers.Contract(
  CONTRACT_ADDRESS_DATA,
  jsoncontract.abi,
  signer
);


async function getDataContractMasters() {
  console.log("Obteniendo datos de contrato", CONTRACT_ADDRESS_DATA)
  try {
    //console.log('Contrato:', pro_ponContract)
    const owner = await pro_ponContract.getOwner()
    const manager = await pro_ponContract.getManager()
    console.log("Propon_Data Owner:", owner)
    console.log("Propon_Data Manager:", manager)
    console.log("----------------------------------------------------")
} catch (error) {
  console.log('Error obteniendo datos maestros de contrato:', error)
}
}


const main = async () => {
  //const pro_ponContractFactory = await ethers.getContractFactory('pro_pon');
  //pro_ponContractFactory.attach('0xd3d851bA386FdAD02BF1DcE2BcF0108eF74C20ce')

  await getDataContractMasters()

  /*readin RFPs ******************/
  // let rfp = await pro_ponContract.getRFP(1);
  // console.log("RFP obtenido con getRFP, RFP[2]", rfp);

  // rfp = await pro_ponContract.getRFPbyIndex(24);
  // console.log("RFP obtenido con getRFPbyIndex, RFP[2]", rfp);

  // let cia = await pro_ponContract.getCompany(
  //   "0x6b85215bdDc1B2DFE64f2E0EE09221E2cE29CFB2"
  // ); //// Lommax Realtor House
  // console.log(
  //   "Compañia creada por (0xE9B1436262593fA862911eDD0C78017B77D131ab): ",
  //   cia
  // );

  // console.log("RFP creadas por ", cia.name, "obtenidas con getRFPbyIndex");
  // for (let i = 0; i < cia.company_RFPs.length; i++) {
  //   const rfp = await pro_ponContract.getRFPbyIndex(cia.company_RFPs[i].toString());
  //   console.log("RFP[", i, "] ", rfp);
  // }

  // console.log("RFP creadas por ", cia.name, "obtenidas con getRFP");
  // for (let i = 0; i < cia.company_RFPs.length; i++) {
  //   const rfp = await pro_ponContract.getRFP(i);
  //   console.log("RFP[", i, "] ", rfp);
  // }
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
