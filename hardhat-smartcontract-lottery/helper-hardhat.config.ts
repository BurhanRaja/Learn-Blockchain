import { ethers } from "hardhat";
import "dotenv/config";

const subscriptionId = process.env.SUBSCRIPTION_ID;

interface NetworkConfigObj {
  name: string;
  vrfCoordinator?: string;
  gasLane?: string;
  keepersUpdateInterval?: string;
  raffleEntranceFee?: bigint;
  callbackGasLimit?: string;
  subscriptionId?: string | bigint;
}

interface NetworkConfig {
  [key: number]: NetworkConfigObj;
}

export const networkCofig: NetworkConfig = {
  11155111: {
    name: "sepolia",
    vrfCoordinator: "0x8103b0a8a00be2ddc778e6e7eaa21791cd364625",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    keepersUpdateInterval: "3",
    raffleEntranceFee: ethers.parseEther("0.01"),
    callbackGasLimit: "500000",
    subscriptionId: subscriptionId,
  },
  31337: {
    name: "hardhat",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    keepersUpdateInterval: "30",
    raffleEntranceFee: ethers.parseEther("0.01"),
    callbackGasLimit: "500000",
  },
};

export const developmentChains = ["hardhat", "localhost"];
