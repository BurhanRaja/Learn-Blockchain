import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  DECIMALS,
  INITIAL_ANSWERS,
  developmentsChain,
} from "../helper-hardhat-config";
import { network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";

const deployMocks: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentsChain.includes(network.name)) {
    log("Local Network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWERS],
    });
    log("Deployed Mock Contract.");
    log("--------------------------------------------");
  }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
