const { ethers } = require("hardhat");

const main = async () => {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    
    // 1. Deploy ProPonData contract
    const ProPonDataFactory = await ethers.getContractFactory("pro_ponData");
    const proPonDataContract = await ProPonDataFactory.deploy();
    await proPonDataContract.deployed();
    console.log("ProPon_Data deployed to:", proPonDataContract.address);
    console.log("----------------------------------------------------");

     // 2. Deploy ProPonLogic contract
    const ProPonLogicFactory = await ethers.getContractFactory("pro_ponLogic");
    const proPonLogicContract = await ProPonLogicFactory.deploy(proPonDataContract.address);
    await proPonLogicContract.deployed();
    console.log("ProPon_Logic deployed to:", proPonLogicContract.address);
    console.log("----------------------------------------------------");


    // 3. Transfer ownership of ProPonData contract to ProPonLogic contract
    await proPonDataContract.setOwner(proPonLogicContract.address);
    console.log("Ownership of ProPon_Data transferred to ProPon_Logic");
    console.log("----------------------------------------------------");

    const owner = await proPonDataContract.getOwner()
    const manager = await proPonDataContract.getManager()
    console.log("Propon_Data Owner:", owner)
    console.log("Propon_Data Manager:", manager)
    console.log("----------------------------------------------------");

    const ownerLogic = await proPonLogicContract.getOwner()
    console.log("Propon_Logic Owner:", ownerLogic)
    console.log("----------------------------------------------------");
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
