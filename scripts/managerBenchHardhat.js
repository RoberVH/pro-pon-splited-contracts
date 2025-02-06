const { ethers } = require("hardhat");

const jsonContract = require("../artifacts/contracts/proponData.sol/pro_ponData.json");

async function main() {
  // Provider and Signer setup
  const provider = new ethers.providers.AlchemyProvider( network = "maticmum" ,  process.env.ALCHEMY_MUMBAI_CVE)

  const privateKey = process.env.TEST1_PVK_ACCOUNT
  const wallet = new ethers.Wallet(privateKey, provider);

  // Contract setup
  const address = "0x8703edb194E2584404ddd6231Ab5c3615F92211E";
  const contract = new ethers.Contract(address, jsonContract.abi, wallet);

  // Interactions
  const price = await contract.CREATE_COMPANY_PRICE();
  console.log("Create Company Price:", price.toString());

  let maxguestOpenTender= await contract.MAX_GUEST_OPEN_TENDER()
  console.log("Max guest Open Tender:", maxguestOpenTender.toString());

  const setMaxGuestOpenTender = await contract.setMaxGuestOpenTender(27);
   await setMaxGuestOpenTender.wait();

   maxguestOpenTender= await contract.MAX_GUEST_OPEN_TENDER()
   console.log("Max guest Open Tender:", maxguestOpenTender.toString());

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
