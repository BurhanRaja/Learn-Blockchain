import { TransactionResponse } from "ethers";
import { getNamedAccounts, ethers, deployments } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContractAt("FundMe", deployer);
  console.log("Getting Funds....");
  const transactionResponse: TransactionResponse = await fundMe.cheaperWithdraw();
  await transactionResponse.wait();
  console.log("Fund Withdrawed Successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
