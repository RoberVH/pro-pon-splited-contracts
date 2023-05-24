// bench testwork to explore and test contract objects at mumbai
const { ethers } = require("hardhat");
const address= '0x1bD78C554Da8765222502c2bFE248a2C5b15238d'
const  jsoncontract = require('../artifacts/contracts/pro-pon.sol/pro_pon.json')   

const ContestType = {OPEN:0, INVITATION_ONLY:1}
const  openContest = ContestType.OPEN 
const  invitationContest = ContestType.INVITATION_ONLY 

const main = async () => {
    const alchemyprovider=new ethers.providers.AlchemyProvider(  network = "maticmum" ,  process.env.ALCHEMY_MUMBAI_CVE)
    const signer = new ethers.Wallet(process.env.POLYGON_MUMBAI_PVK_ACCOUNT, alchemyprovider);
    const proponContract = new ethers.Contract(address, jsoncontract.abi , signer);
 
  company= await proponContract.getCompany('0x6d96b8d1A4A9991a3831935BAb3413254cB02d87')
  currIdx= await proponContract.getcurrentRFPIdx()
  console.log('RFPs so far: ', currIdx.toString())
  for (let i=0; i < parseInt(currIdx.toString()); i++) {
      RFP = await proponContract.getRFPbyIndex(i)
      console.log(i, 'RFP:')
      printObjectProperties(RFP)
      const Doctos = await proponContract.getDocumentsfromRFP(i)
      for (let j=0; j< Doctos.length; j++) {
        console.log('Doctos:')
        printObjectProperties(Doctos[j])
      }
      console.log('-------------------------------------------------------------------------------------------------------------------------------')
  }
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
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  runMain();