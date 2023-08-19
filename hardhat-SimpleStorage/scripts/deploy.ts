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

  if (network.config.chainId === 11155111 && etherscanAPIKey) {
    await simpleStorage.waitForDeployment();
    await verify(address, []);
  }
}

async function verify(contractAddress: string, args: Array<any>) {
  console.log("Verifying Contract. Please Wait...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      arguments: args,
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
