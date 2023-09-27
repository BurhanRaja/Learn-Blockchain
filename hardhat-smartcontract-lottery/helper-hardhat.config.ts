interface NetworkConfigObj {
  name: string;
  vrfCoordinator: string;
}

interface NetworkConfig {
  [key: number]: NetworkConfigObj;
}

export const networkCofig: NetworkConfig = {
  11155111: {
    name: "sepolia",
    vrfCoordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
  },
};

export const developmentChains = ["hardhat", "localhost"];