require("babel-register");
require("babel-polyfill");

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
// const mnemonic = process.env.MNEMONIC;
const mnemonic = "inch digital parent truck enemy female switch solar better conduct acquire horn";


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`),
      network_id: 42,
      gas: 5500000,
      networkCheckTimeout: 10000000,
      confirmations: 2,    
      timeoutBlocks: 200,  
      skipDryRun: true
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "pragma",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
