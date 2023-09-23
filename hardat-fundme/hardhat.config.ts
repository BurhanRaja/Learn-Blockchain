import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy";
import "dotenv/config";

const sepoliaURL = process.env.SEPOLIA_RPC_URL!;
const sepoliaPrivateKey = process.env.SEPOLIA_PRIVATE_KEY!;
const etherscanAPIKey = process.env.ETHERSCAN_API_KEY!;
const coinmarketCapAPIKey = process.env.COINMARKETCAP_API_KEY!;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: sepoliaURL,
      accounts: [sepoliaPrivateKey],
      chainId: 11155111,
    },
    // yarn hardhat node
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: etherscanAPIKey,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: true, // false when not working
    outputFile: "./gas-report.txt",
    noColors: true,
    currency: "USD",
    // coinmarketcap: coinmarketCapAPIKey,
    token: "MATIC"
  },
  mocha: {
    timeout: 100000,
  },
};

export default config;
