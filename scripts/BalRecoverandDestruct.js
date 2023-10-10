// Scripts to recover matics from contracts and destroy contracts   at mumbai
const { ethers } = require("hardhat");

// proponData
const CONTRACT_ADDRESS_DATA='0x03d628939c4fAE2f7299f6d4635A9791d9E58c31'
 // ProponData Contract owner: 0xE9B1436262593fA862911eDD0C78017B77D131ab
 
 //const address = '0x2F9A4aDCc776019cd3A510E79827c118e420d74c'    // deployed on may  6, 2023 
 //const CONTRACT_ADDRESS_LOGIC='0xB7d0d95809C38F5456fC308A19973DfC630A7FF2'
 const CONTRACT_ADDRESS_LOGIC="0x9c094DeA795b9Bf045354c59E02c1F57C09FF6C7"

const  jsoncontractLogic = require('../artifacts/contracts/proponLogic.sol/pro_ponLogic.json')   
const  jsoncontractLogicData = require('../artifacts/contracts/proponData.sol/pro_ponData.json')   

const alchemyprovider=new ethers.providers.AlchemyProvider(  network = "maticmum" ,  process.env.ALCHEMY_MUMBAI_CVE)
const signer = new ethers.Wallet(process.env.POLYGON_MUMBAI_PVK_ACCOUNT, alchemyprovider);
const proponContractLogic = new ethers.Contract(CONTRACT_ADDRESS_LOGIC, jsoncontractLogic.abi , signer);
const proponContractData = new ethers.Contract(CONTRACT_ADDRESS_DATA, jsoncontractLogicData.abi , signer);


  async function getBalance(address) {
      // Get the contract's balance
  try {      
    const balance = await alchemyprovider.getBalance(address);
    console.log(`The balance of address ${address} is ${ethers.utils.formatEther(balance)} MATICS`);
    console.log('-------------------------------------------------------------------------------------------------------------------------------')
  } catch (error) { 
    console.log('Error consultando balances: ', error)
  }
}

  async function destroyContract() {
    // Call the destroy() method
    console.log('Destruyendo contrato', proponContractLogic.address)
    const tx = await proponContractLogic.destroy();
    console.log(`Transaction hash: ${tx.hash}`);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log('------------------------------------------------------------------------------------------------------------')
  }

  async function get1stRFP() {
    let RFP =  await proponContractData.getRFPbyIndex(0)
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
  

async function  showBal() {
  console.log('Balances:')
  console.log('CONTRATO PROPON LOGIC:')
  await getBalance(proponContractLogic.address);
  console.log('CUENTA DE DESPLIEGUE:')
  await getBalance('0xE9B1436262593fA862911eDD0C78017B77D131ab');

}

async  function recuperaSaldo() {
  console.log('Recuperarando saldo')
  const tx = await proponContractLogic.withdraw()
  const receipt = await tx.wait()
  console.log('receipt', receipt)
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  
  //const tx = await proponContractLogic.withdraw();
  // console.log(`Transaction hash de recuperacion de salto (esperando minado): ${tx.hash}`);
  // // Wait for the transaction to be mined
  // const receipt = await tx.wait();

}



  const runMain = async () => {
    try {
      // console.log('Por cambiar dueño de Logic a',process.env.POLYGON_MUMBAI_ACCOUNT )
      // const tx1 = await proponContractLogic.setOwner(process.env.POLYGON_MUMBAI_ACCOUNT)
      // const receipt= await tx1.wait()
     //  console.log('cambio efectuado, recibo:', receipt)
     await showBal()
      const owner1 = await proponContractLogic.getOwner()
      console.log('owner propon Logic', owner1)

      // const owner= await proponContractLogic.getOwner()
      // console.log('owner', owner)


      // await showBal()
      // await recuperaSaldo()
     //  await showBal()
       
     // console.log('detruir contrato')
     // await destroyContract()
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  runMain();


  // useful  code
  // company= await proponContractLogic.getCompany('0x6d96b8d1A4A9991a3831935BAb3413254cB02d87')
  // currIdx= await proponContractLogic.getcurrentRFPIdx()
  // console.log('RFPs so far: ', currIdx.toString())
  // for (let i=0; i < parseInt(currIdx.toString()); i++) {
  //     RFP = await proponContractLogic.getRFPbyIndex(i)
  //     console.log(i, 'RFP:')
  //     printObjectProperties(RFP)
  //     const Doctos = await proponContractLogic.getDocumentsfromRFP(i)
  //     for (let j=0; j< Doctos.length; j++) {
  //       console.log('Doctos:')
  //       printObjectProperties(Doctos[j])
  //     }