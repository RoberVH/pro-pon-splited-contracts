const { ethers } = require("hardhat");

const main = async () => {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    
    // 1. Deploy ProPonData contract
    const ProPonData = await ethers.getContractFactory("pro_ponData");
    const proPonData = await ProPonData.deploy();
    await proPonData.deployed();
    console.log("ProPonData deployed to:", proPonData.address);

     // 2. Deploy ProPonLogic contract
    const ProPonLogic = await ethers.getContractFactory("pro_ponLogic");
    const proPonLogic = await ProPonLogic.deploy(proPonData.address);
    await proPonLogic.deployed();
    console.log("ProPonLogic deployed to:", proPonLogic.address);

    // 3. Transfer ownership of ProPonData contract to ProPonLogic contract
    await proPonData.setOwner(proPonLogic.address);
    console.log("Ownership of ProPonData transferred to ProPonLogic");


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
