import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkCofig } from "../helper-hardhat.config";
import {
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from "ethers";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { VRFCoordinatorV2InterfaceInterface } from "../typechain-types/@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface";

const VRF_FUND_AMOUNT = ethers.parseEther("2");

const deployRaffleFunc: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log, get, fixture } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId!;

  console.log("Deploying Raffle...");

  let vrfCoordinatorAddress, subscriptionId;

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
    subscriptionId = result?.logs[0]["args"][0];

    await vrfCoordinatorContract.fundSubscription(
      subscriptionId,
      VRF_FUND_AMOUNT
    ); // Adding FUNDS to the Coordinator to Run the Random Num Generator
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
};

export default deployRaffleFunc;
export const tags = ["all", "raffle"];
