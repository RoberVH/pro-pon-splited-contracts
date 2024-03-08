// bench testwork to explore and test contract objects at mumbai
const { ethers } = require('hardhat')
const proponContractDataAddress = process.env.PROPON_DATA_ADDRESS_TEST
const jsonContractData = require('../artifacts/contracts/proponData.sol/pro_ponData.json')

const ContestType = { OPEN: 0, INVITATION_ONLY: 1 }
const openContest = ContestType.OPEN
const invitationContest = ContestType.INVITATION_ONLY

const network = 'maticmum'
const APIKEY = process.env.ALCHEMY_MUMBAI_APIKEY

const alchemyprovider = new ethers.providers.AlchemyProvider(network, APIKEY)

const signer = new ethers.Wallet(
  process.env.POLYGON_MUMBAI_PVK_ACCOUNT,
  alchemyprovider
)

const proponContract = new ethers.Contract(
  process.env.PROPON_DATA_ADDRESS_TEST,
  jsonContractData.abi,
  signer
)

const main = async () => {
  try {
    const owner = await proponContract.getOwner()
    console.log('owner', owner)
    const company = await proponContract.getCompanyId(
      '0x6d96b8d1A4A9991a3831935BAb3413254cB02d87'
    )
    const currIdx = parseInt(await proponContract.getcurrentRFPIdx())
    console.log('Numero de RFPs', currIdx)
    await printRFPs(38, 42)
  } catch (error) {
    console.log(error.message)
  }
  return
}

async function printRFPs(from, to) {
  for (let i = from; i < to; i++) {
    const RFP = await proponContract.getRFPbyIndex(i)
    console.log(i, 'RFP:')
    //console.log(RFP)
    if (!RFP.name) {
      console.log('No existe')
      continue
    }
    printObjectProperties(RFP)
    console.log('-------------------------------------------------')
    // const Doctos = await proponContract.getDocumentsfromRFP(i)
    // for (let j = 0; j < Doctos.length; j++) {
    //   console.log("Doctos:")
    //   printObjectProperties(Doctos[j])
    // }
  }
}

function printObjectProperties(obj) {
  for (const [key, value] of Object.entries(obj)) {
    const prop = parseInt(key)
    if (isNaN(prop)) {
      if (value && value.type === 'BigNumber') {
        console.log(`${key}: ${parseInt(value.hex)}`)
      } else {
        if (key.includes('Date')) console.log(`${key}: ${convDate(value)}`)
        else console.log(`${key}: ${value}`)
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
  const unixEpoch = Math.floor(new Date(date).getTime() / 1000)
  return unixEpoch
}

function convertDate(date) {
  return (unixdate = Math.floor(new Date(date).getTime() / 1000))
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()
