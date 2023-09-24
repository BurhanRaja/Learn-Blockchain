import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { developmentsChain } from "../../helper-hardhat-config";
import { FundMe } from "../../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { assert } from "chai";

developmentsChain.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging Testing", () => {
      let deployer: Address;
      let fundMe: FundMe;
      const sendVal = ethers.parseEther("0.5");

      before(async () => {
        deployer = (await getNamedAccounts()).deployer;
        const deploymentResults = await deployments.fixture(["all"]);
        // Fund Me
        const fundMeAddress: string = deploymentResults["FundMe"]?.address;
        fundMe = (await ethers.getContractAt(
          "FundMe",
          fundMeAddress
        )) as unknown as FundMe;
      });

      it("fund function and withdraw function", async () => {
        const address = await fundMe.getAddress();
        await fundMe.fund({ value: sendVal });
        await fundMe.cheaperWithdraw();
        const endingFundMeBalance = await ethers.provider.getBalance(address);
        assert(endingFundMeBalance.toString(), "0");
      });
    });
