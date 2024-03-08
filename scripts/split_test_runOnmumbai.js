
/**
 * 
 * As of Feb 29, 2024, this methods works with new versions: 
 *    - . ./GeneralContractData  Ejecutar -> $> npx hardhat run scripts/split_test_runOnmumbai.js 
 */
const { ethers } = require('hardhat')

const DataContractABI = require('../artifacts/contracts/proponData.sol/pro_ponData.json')
const LogicContractABI = require('../artifacts/contracts/proponLogic.sol/pro_ponLogic.json')

async function getRFPS() {
  console.log('RFP creadas por ', cia.name, 'obtenidas con getRFPbyIndex')
  for (let i = 0; i < cia.company_RFPs.length; i++) {
    const rfp = await pro_ponContract.getRFPbyIndex(
      cia.company_RFPs[i].toString()
    )
    console.log('RFP[', i, '] ', rfp)
  }
}
const CONTRACT_ADDRESS_DATA = process.env.PROPON_DATA_ADDRESS_TEST
const CONTRACT_ADDRESS_LOGIC = process.env.PROPON_LOGIC_ADDRESS_TEST

async function DataContractGralData() {
  const alchemyprovider = new ethers.providers.AlchemyProvider(
    (network = 'maticmum'),
    process.env.ALCHEMY_MUMBAI_CVE
  )
  const signer = new ethers.Wallet(
    process.env.POLYGON_MUMBAI_PVK_ACCOUNT,
    alchemyprovider
  )
  const pro_ponContract = new ethers.Contract(
    CONTRACT_ADDRESS_DATA,
    DataContractABI.abi,
    signer
  )

  console.log('Data Contract address:', CONTRACT_ADDRESS_DATA)
  const price = await pro_ponContract.CREATE_COMPANY_PRICE()
  console.log('Precio:', price.toString())

  let cia = await pro_ponContract.getCompany(
    '0xE9B1436262593fA862911eDD0C78017B77D131ab'
  ) //// Lommax Realtor House
  console.log(
    'Compañia creada por (0xE9B1436262593fA862911eDD0C78017B77D131ab): ',
    cia
  )

  let owner = await pro_ponContract.getOwner()
  console.log('ProponDataContract Owner:', owner)
  let manager = await pro_ponContract.getManager()
  console.log('ProponDataContract Manager:', manager)
}

async function LogicContractGralData() {
  const alchemyprovider = new ethers.providers.AlchemyProvider(
    (network = 'maticmum'),
    process.env.ALCHEMY_MUMBAI_CVE
  )
  const signer = new ethers.Wallet(
    process.env.POLYGON_MUMBAI_PVK_ACCOUNT,
    alchemyprovider
  )
  const pro_ponContract = new ethers.Contract(
    CONTRACT_ADDRESS_LOGIC,
    LogicContractABI.abi,
    signer
  )

  console.log('Logic Contract address:', CONTRACT_ADDRESS_LOGIC)

  let owner = await pro_ponContract.getOwner()
  console.log('ProponLogicContract Owner:', owner)

  const balance = await alchemyprovider.getBalance(CONTRACT_ADDRESS_LOGIC)
  console.log(
    `The balance of Logic Contract ${CONTRACT_ADDRESS_LOGIC} is ${ethers.utils.formatEther(
      balance
    )} MATICS`
  )
}

async function GeneralContractData() {
  const alchemyprovider = new ethers.providers.AlchemyProvider(
    'maticmum',
    process.env.ALCHEMY_MUMBAI_CVE
  )

  // Crea una instancia del contrato con ethers

  console.log('CONTRACT_ADDRESS_DATA', CONTRACT_ADDRESS_DATA)
  console.log('CONTRACT_ADDRESS_LOGIC', CONTRACT_ADDRESS_LOGIC)
  //console.log('CONTRACT_ADDRESS_DATA', DataContractABI.abi)
  //console.log('CONTRACT_ADDRESS_LOGIC', LogicContractABI.abi)

  const proPonDataContract = new ethers.Contract(
    CONTRACT_ADDRESS_DATA,
    DataContractABI.abi,
    alchemyprovider
  )

  const proPonLogicContract = new ethers.Contract(
    CONTRACT_ADDRESS_LOGIC,
    LogicContractABI.abi,
    alchemyprovider
  )

  console.log(
    '------------ SUMAMRY ACCOUNT OWNERS OF CONTRACTS  ----------------------------------------'
  )
  const owner = await proPonDataContract.getOwner()

  const manager = await proPonDataContract.getManager()
  console.log('Propon_Data Owner:', owner)
  console.log('Propon_Data Manager:', manager)
  console.log('----------------------------------------------------')

  const ownerLogic = await proPonLogicContract.getOwner()
  console.log('Propon_Logic Owner:', ownerLogic)
  console.log('----------------------------------------------------')
}

const main = async () => {
  await GeneralContractData()
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
