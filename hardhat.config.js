require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sei: {
      url: "https://evm-rpc.arctic-1.seinetwork.io/",
      accounts: [process.env.PRIVATE_KEY]
    },
    berachain: {
      url: "https://artio.rpc.berachain.com/",
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};
