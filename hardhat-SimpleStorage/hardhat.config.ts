import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const sepoliaURL = process.env.SEPOLIA_RPC_URL!;
const sepoliaPrivateKey = process.env.SEPOLIA_PRIVATE_KEY!;

const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: sepoliaURL,
      accounts: [sepoliaPrivateKey],
      chainId: 11155111,
    },
  },
  solidity: "0.8.19",
};

export default config;
