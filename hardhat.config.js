require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

// TLD to use in deployment
const TLD = 'forever';

// Go to https://www.infura.io
const INFURA_API_KEY = 'INFURA PROJECT ID';

// Replace this private key with your account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
const PRIVATE_KEY = '';

// using ChainLink USD Oracle on Mainnet or set null to use DummyOracle
// https://data.chain.link/ethereum/mainnet/crypto-usd/eth-usd
const MAINNET_USD_ORACLE = '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419';

const accountKey = (PRIVATE_KEY === '' ? '0x00' : '0x' + PRIVATE_KEY);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  tld: TLD,
  networks: {
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + INFURA_API_KEY,
      usdOracle: MAINNET_USD_ORACLE,
      accounts: [ accountKey ],
      tags: ["production"]
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + INFURA_API_KEY,
      accounts: [ accountKey ],
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
  solidity: {
    compilers: [
      {
        version: "0.8.4"
      },
      {
        version: "0.8.4",
      }
    ]
  }
};

