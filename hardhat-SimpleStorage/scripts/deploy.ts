import { ethers, run, network } from "hardhat";
import "dotenv/config";

const etherscanAPIKey = process.env.ETHERSACN_API_KEY!;

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying Contract. Please Wait....");

  const simpleStorage = await SimpleStorageFactory.deploy();
  // const deployedCode = await simpleStorage.getDeployedCode();
  const address = await simpleStorage.getAddress();

  console.log(`Contract Address: ${address}`);
  // console.log(`Contract Deployed Code: ${deployedCode}`);

  // To verify the contract
  // https://sepolia.etherscan.io/address/0x07D9fA12c558F20afca1BB6c3Bb1126116BfbD4f#code
  if (network.config.chainId === 11155111 && etherscanAPIKey) {
    console.log("Waiting for block confirmation. Please wait....");
    await simpleStorage.deploymentTransaction()?.wait(6);
    await verify(address, []);
  }

  const myFavouriteNum = await simpleStorage.retreive();
  console.log(`Current Value: ${myFavouriteNum}`);

  // Update Value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedFavouriteNum = await simpleStorage.retreive();
  console.log(`Updated Value: ${updatedFavouriteNum}`);
}

async function verify(contractAddress: string, args: Array<any>) {
  console.log("Verifying Contract. Please Wait...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    console.log(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
