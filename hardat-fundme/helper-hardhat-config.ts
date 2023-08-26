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

// deploying "MockV3Aggregator" (tx: 0x2602449a8c2f9ff11a706c8e22ba82273649e6c74296695e77a1a4a5b275318c)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 694979 gas
// deploying "FundMe" (tx: 0x4918105509b781ba16bb6ba27cb553e43479b26965284c49bfcd5f9cacd5dbf7)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 838517 gas
