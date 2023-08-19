import { ethers } from "hardhat";

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying Contract. Please Wait....");

  const simpleStorage = await SimpleStorageFactory.deploy();
  // const deployedCode = await simpleStorage.getDeployedCode();
  const address = await simpleStorage.getAddress();

  console.log(`Contract Address: ${address}`);
  // console.log(`Contract Deployed Code: ${deployedCode}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
