const { ethers } = require("hardhat")

async function main() {
  const provider = ethers.provider
  const blockNumber = await provider.getBlockNumber()
  console.log("Current block number:", blockNumber)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
