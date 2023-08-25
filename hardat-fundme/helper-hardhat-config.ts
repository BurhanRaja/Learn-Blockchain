interface NetworkConfigObj {
  name: string;
  ethUsdPriceFeedAddress: string;
}

interface NetworkConfig {
  [key: number]: NetworkConfigObj;
}

export const networkConfig: NetworkConfig = {
  11155111: {
    name: "Sepolia",
    ethUsdPriceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

export const developmentsChain: Array<string> = ["hardhat", "localhost"];

export const DECIMALS: string = "8";
export const INITIAL_ANSWERS: string = "189500000000";
