import { task } from "hardhat/config";

task("block-number", "Prints the Current Block Number of Blockchain").setAction(
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`Current Block number: ${blockNumber}`);
  }
);

export default {};
