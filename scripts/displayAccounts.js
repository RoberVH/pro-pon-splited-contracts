const { ethers } = require('hardhat');

async function main() {
  const accounts = await ethers.getSigners();

  accounts.forEach((account, index) => {
    console.log(`Account ${index + 1}: ${account.address}`);
  });
}

main();
