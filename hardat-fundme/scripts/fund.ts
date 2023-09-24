import { TransactionResponse } from "ethers";
import { getNamedAccounts, ethers, deployments } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContractAt("FundMe", deployer);
  console.log("Funding....");
  const sendVal = ethers.parseEther("0.05");
  const transactionResponse: TransactionResponse = await fundMe.fund({ value: sendVal });
  await transactionResponse.wait();
  console.log("Funded Successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
