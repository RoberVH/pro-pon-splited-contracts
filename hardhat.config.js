require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_URL_MUMBAI,
      accounts: [process.env.POLYGON_MUMBAI_PVK_ACCOUNT],
		},
    amoy: {
      /** Account: 0xE9B1436262593fA862911eDD0C78017B77D131ab (test1) */
      url: process.env.ALCHEMY_URL_MUMBAI,
      accounts: [process.env.POLYGON_MUMBAI_PVK_ACCOUNT],
      gasPrice: 25000000000, // 25 Gwei como mínimo
		},
    polygon: {
      url: process.env.ALCHEMY_URL_POLYGON,
      accounts: [process.env.POLYGON_PVK_ACCOUNT],
		}, 
    localhost: {
      url: "http://localhost:8545",
      accounts: [process.env.LOCAL_ACCOUNT_2_PVKEY],
		},    
  },  
};
