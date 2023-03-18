require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

// TLD to use in deployment
const TLD = 'forever';

// Replace this private key with your account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
real_accounts = undefined
if (process.env.DEPLOYER_KEY) {
  real_accounts = [process.env.DEPLOYER_KEY]
}

// using ChainLink USD Oracle on Mainnet or set null to use DummyOracle
// https://data.chain.link/ethereum/mainnet/crypto-usd/eth-usd
const MAINNET_USD_ORACLE = '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419';


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  tld: TLD,
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      usdOracle: MAINNET_USD_ORACLE,
      accounts: real_accounts,
      tags: ["production"]
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: real_accounts,
      usdOracle: '0xa92F3BE2dFf40c82b902Ffa82e50B1db414bC7E1',
      tags: ["staging"]
    },
    hardhat: {
      // Required for real DNS record tests
      initialDate: "2019-03-15T14:06:45.000+13:00",
      tags: ["test", "local"]
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      tags: ["local"]
    },
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  mocha: {
  },
  abiExporter: {
    path: './build/contracts',
    clear: true,
    flat: true,
    spacing: 2
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
};

