import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentsChain, networkConfig } from "../helper-hardhat-config";
import { DeployFunction } from "hardhat-deploy/dist/types";
import verify from "../utils/verify";
import "dotenv/config";

let ethersacnAPI = process.env.ETHERSCAN_API_KEY;

const deployFundMe: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;

  let ethUsdPriceFeedAddress, fundMe;

  if (developmentsChain.includes(network.name)) {
    // Development Mock Aggregator
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
    
    fundMe = await deploy("FundMe", {
      from: deployer,
      args: [ethUsdPriceFeedAddress],
      log: true,
    });
  } else {
    // Chainlink Real Aggregator
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];

    fundMe = await deploy("FundMe", {
      from: deployer,
      args: [ethUsdPriceFeedAddress],
      log: true,
      waitConfirmations: 6,
    });

    if (!developmentsChain.includes(network.name) && ethersacnAPI) {
      await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }
  }

  log("-------------------------------------------------------");
};

export default deployFundMe;
deployFundMe.tags = ["all", "fundMe"];
