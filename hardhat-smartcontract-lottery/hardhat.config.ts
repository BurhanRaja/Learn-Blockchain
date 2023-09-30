import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "dotenv/config";
import "@typechain/hardhat";

const sepoliaURL = process.env.SEPOLIA_RPC_URL!;
const sepoliaPrivateKey = process.env.SEPOLIA_PRIVATE_KEY!;
const etherscanAPIKey = process.env.ETHERSCAN_API_KEY!;
const coinmarketCapAPIKey = process.env.COINMARKETCAP_API_KEY!;

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: sepoliaURL,
      accounts: [sepoliaPrivateKey],
      chainId: 11155111,
      saveDeployments: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: etherscanAPIKey,
  },
  typechain: {
    outDir: "typechains",
    target: "ethers-v6",
  },
  gasReporter: {
    enabled: true,
    noColors: true,
    currency: "USD",
    outputFile: "./gas-report.txt",
    coinmarketcap: coinmarketCapAPIKey,
    token: "ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 500000,
  },
};

export default config;
