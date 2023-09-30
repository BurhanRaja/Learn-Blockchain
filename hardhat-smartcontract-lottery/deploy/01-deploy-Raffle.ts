import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkCofig } from "../helper-hardhat.config";
import verify from "../utils/verify";
import {
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from "ethers";
import { DeployFunction } from "hardhat-deploy/dist/types";

const VRF_FUND_AMOUNT = ethers.parseEther("2");

const deployRaffleFunc: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId!;

  console.log("Deploying Raffle...");

  let vrfCoordinatorAddress: string,
    subscriptionId: bigint;

  if (developmentChains.includes(network.name)) {
    console.log("Deploying Raffle on Local Network.");
    const vrfCoordinator = await get("VRFCoordinatorV2Mock");
    vrfCoordinatorAddress = vrfCoordinator.address;

    const vrfCoordinatorContract = await ethers.getContractAt(
      "VRFCoordinatorV2Mock",
      vrfCoordinatorAddress
    );
    // Creating Subsctiption Programatically
    const transactionResponse: ContractTransactionResponse =
      await vrfCoordinatorContract?.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);

    // Getting SubsId;
    const result = transactionReceipt?.toJSON();
    subscriptionId = result?.logs[0]?.args[0];

    await vrfCoordinatorContract.fundSubscription(
      subscriptionId,
      VRF_FUND_AMOUNT
    ); // Adding FUNDS to the Coordinator to Run the Random Num Generator
  } else {
    console.log("Deploying Raffle on Testnet Network.");
    vrfCoordinatorAddress = networkCofig[chainId]["vrfCoordinator"] as string;
    subscriptionId = networkCofig[chainId]["subscriptionId"] as bigint;
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

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContractAt(
      "VRFCoordinatorV2Mock",
      vrfCoordinatorAddress
    );
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
  }

  if (!developmentChains.includes(network.name)) {
    console.log("Verifying the Raffle Contract...");
    await verify(raffle.address, args);
    console.log("Raffle Contract Verified.");
  }

  console.log("Raffle Deployed.");
  console.log("------------------------------------------------");
};

export default deployRaffleFunc;
deployRaffleFunc.tags = ["all", "raffle"];
