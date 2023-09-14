// Scripts to recover matics from contracts and destroy contracts   at mumbai
const { ethers } = require("hardhat");

const address = '0x2F9A4aDCc776019cd3A510E79827c118e420d74c'    // deployed on may  6, 2023 

const  jsoncontract = require('../artifacts/contracts/pro-pon.sol/pro_pon.json')   

const alchemyprovider=new ethers.providers.AlchemyProvider(  network = "maticmum" ,  process.env.ALCHEMY_MUMBAI_CVE)
const signer = new ethers.Wallet(process.env.POLYGON_MUMBAI_PVK_ACCOUNT, alchemyprovider);
const proponContract = new ethers.Contract(address, jsoncontract.abi , signer);

  async function getBalance(address) {
      // Get the contract's balance
    const balance = await alchemyprovider.getBalance(address);
    console.log(`The balance of address ${address} is ${ethers.utils.formatEther(balance)} MATICS`);
    console.log('-------------------------------------------------------------------------------------------------------------------------------')
}

async function recoverBalance() {
  console.log('Obteniendo saldo del contrato', proponContract.address)
  const tx = await proponContract.withdraw();
  console.log(`Transaction hash: ${tx.hash}`);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log('------------------------------------------------------------------------------------------------------------')

}
  async function destroyContract() {
    // Call the destroy() method
    console.log('Destruyendo contrato', proponContract.address)
    const tx = await proponContract.destroy();
    console.log(`Transaction hash: ${tx.hash}`);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log('------------------------------------------------------------------------------------------------------------')
  }

  async function get1stRFP() {
    let RFP =  await proponContract.getRFPbyIndex(0)
    console.log('RFPs[0]', RFP)
    console.log('------------------------------------------------------------------------------------------------------------')

  }

function printObjectProperties(obj) {
  for (const [key, value] of Object.entries(obj)) {
    const prop = parseInt(key)
    if (isNaN(prop)) {
      if (value && value.type === "BigNumber") {
        console.log(`${key}: ${parseInt(value.hex)}`);
      } else {
        if (key.includes('Date'))
            console.log(`${key}: ${convDate(value)}`)
          else console.log(`${key}: ${value}`);
      }
    }
  }
}

//Translate an Unix Epoch to string date on locale
  const convDate = (unixEpoch) => {
  const milliseconds = unixEpoch * 1000 // 1575909015000
  const dateObject = new Date(milliseconds)
  return dateObject.toLocaleString()
  }
  
  //Translate string date  to  Unix Epoch 
  const convUnixEpoch = (date) => {
      const unixEpoch = Math.floor(new Date(date).getTime()/1000) 
      return unixEpoch
  }



function convertDate(date)   {
  return unixdate=Math.floor(new Date(date).getTime()/1000)
}
  
  const runMain = async () => {
    try {
      await get1stRFP()
      await getBalance(proponContract.address);
      await getBalance('0xE9B1436262593fA862911eDD0C78017B77D131ab');
      //await recoverBalance()
      //await getBalance('0xE9B1436262593fA862911eDD0C78017B77D131ab');
     // await destroyContract()
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  runMain();


  // useful  code
  // company= await proponContract.getCompany('0x6d96b8d1A4A9991a3831935BAb3413254cB02d87')
  // currIdx= await proponContract.getcurrentRFPIdx()
  // console.log('RFPs so far: ', currIdx.toString())
  // for (let i=0; i < parseInt(currIdx.toString()); i++) {
  //     RFP = await proponContract.getRFPbyIndex(i)
  //     console.log(i, 'RFP:')
  //     printObjectProperties(RFP)
  //     const Doctos = await proponContract.getDocumentsfromRFP(i)
  //     for (let j=0; j< Doctos.length; j++) {
  //       console.log('Doctos:')
  //       printObjectProperties(Doctos[j])
  //     }