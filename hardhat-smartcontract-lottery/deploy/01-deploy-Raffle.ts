import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkCofig } from "../helper-hardhat.config";

const VRF_FUND_AMOUNT = ethers.parseEther("2");

export default async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId!;

  console.log("Deploying Raffle...");

  let vrfCoordinatorAddress, subscriptionId;

  if (developmentChains.includes(network.name)) {
    console.log("Deploying Raffle on Local Network.");
    const vrfCoordinator = await ethers.getContractAt(
      "VRFCoordinatorMock",
      deployer
    );
    vrfCoordinatorAddress = await vrfCoordinator.getAddress();
    // Creating Subsctiption Programatically
    const transactionResponse = await vrfCoordinator.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    // Getting SubsId;
    subscriptionId = transactionReceipt?.events[0].args.subId;
    await vrfCoordinator.fundSubscription(subscriptionId, VRF_FUND_AMOUNT); // Adding FUNDS to the Coordinator to Run the Random Num Generator
  } else {
    console.log("Deploying Raffle on Testnet Network.");
    vrfCoordinatorAddress = networkCofig[chainId]["vrfCoordinator"];
    subscriptionId = networkCofig[chainId]["subscriptionId"];
  }

  // Define Arguements
  const entranceFee = networkCofig[chainId]["raffleEntranceFee"];
  const gasLane = networkCofig[chainId]["gasLane"];
  const callbackGasLimit = networkCofig[chainId]["callbackGasLimit"];
  const interval = networkCofig[chainId]["keepersUpdateInterval"];
  const args = [
    entranceFee,
    vrfCoordinatorAddress,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    interval,
  ];

  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 1,
  });

  console.log("Raffle Deployed.");
  console.log("------------------------------------------------");
}

export const tags = ["all", "raffle"];
