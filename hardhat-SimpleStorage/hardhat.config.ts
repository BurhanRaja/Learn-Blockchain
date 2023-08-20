import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "./tasks/block-number";
import "dotenv/config";

const sepoliaURL = process.env.SEPOLIA_RPC_URL!;
const sepoliaPrivateKey = process.env.SEPOLIA_PRIVATE_KEY!;
const etherscanAPIKey = process.env.ETHERSACN_API_KEY!;

const config: HardhatUserConfig = {
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
  solidity: "0.8.19",
  etherscan: {
    apiKey: etherscanAPIKey,
  },
};

export default config;
