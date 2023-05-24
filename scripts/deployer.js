const { ethers } = require("hardhat");

const main = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());    
    const proponContractFactory = await ethers.getContractFactory('pro_pon');
    const proponContract = await proponContractFactory.deploy();
    await proponContract.deployed();
    console.log("Contract deployed to:", proponContract.address);
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