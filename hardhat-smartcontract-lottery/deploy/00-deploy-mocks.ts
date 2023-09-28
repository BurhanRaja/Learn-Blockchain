import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const BASE_FEE = "250000000000000000"; // 0.25 LINK;
const GAS_PRICE_LIMIT = 1e9; // 0.000000009 LINK per gas;

export default async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  console.log("Deploying Mocks....");

  if (chainId === 31337) {
    await deploy("VRFCoordinatorV2Mock", {
      contract: "VRFCoordinatorV2Mock",
      from: deployer,
      args: [BASE_FEE, GAS_PRICE_LIMIT],
      log: true,
      waitConfirmations: 1,
    });
  }

  console.log("Mocks Deployed.");
  console.log("--------------------------------------------");
}

export const tags = ["all", "mocks"];
