import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert, expect } from "chai";
import { Address } from "hardhat-deploy/dist/types";
import {
  ContractTransactionReceipt,
  ContractTransactionResponse,
  BigNumberish,
} from "ethers";

describe("Fund Me", () => {
  let deployer: Address;
  let fundMe: FundMe;
  let mockV3Aggregator: MockV3Aggregator;
  const sendVal = ethers.parseEther("0.5");

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    const deploymentResults = await deployments.fixture(["all"]);

    // Fund Me
    const fundMeAddress: string = deploymentResults["FundMe"]?.address;
    fundMe = (await ethers.getContractAt(
      "FundMe",
      fundMeAddress
    )) as unknown as FundMe;

    // Mock Aggregator
    const mockV3AggregatorAddress: string =
      deploymentResults["MockV3Aggregator"]?.address;
    mockV3Aggregator = (await ethers.getContractAt(
      "MockV3Aggregator",
      mockV3AggregatorAddress
    )) as unknown as MockV3Aggregator;
  });

  describe("constructor", function () {
    it("sets the aggregator addresses correctly", async () => {
      const response = await fundMe.priceFeed();
      const address = await mockV3Aggregator.getAddress();
      assert.equal(response, address);
    });
  });

  // ------------------------------------ Fund ----------------------------------------------
  describe("Fund", () => {
    it("Reverts when not sending enough ETH.", async () => {
      await expect(fundMe.fund()).to.be.revertedWith("didn't send enough ETH.");
    });

    it("Updated the amount to Mappings(Address => Amount)", async () => {
      await fundMe.fund({ value: sendVal });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendVal.toString());
    });

    it("Updated the address to funders array", async () => {
      await fundMe.fund({ value: sendVal });
      const funder = await fundMe.funders(0);
      assert.equal(funder, deployer);
    });

    it("funders and addressToAmount in Sync when amount added", async () => {
      await fundMe.fund({ value: sendVal });
      const funder = await fundMe.funders(0);
      const response = await fundMe.addressToAmountFunded(funder);
      assert.equal(response.toString(), sendVal.toString());
    });
  });
  // ------------------------------------ Withdraw ----------------------------------------------
  describe("Withdraw", async () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendVal });
    });

    it("Withdraw ETH from the single Founder", async () => {
      const address = await fundMe.getAddress();

      // Before Withdraw
      const startingFundMeBalance: bigint = await ethers.provider.getBalance(
        address
      );
      const startingDeployerBalance: bigint = await ethers.provider.getBalance(
        deployer
      );

      const transactionResponse: ContractTransactionResponse =
        await fundMe.withdraw();
      const transactionReceipt: ContractTransactionReceipt =
        (await transactionResponse.wait()) as ContractTransactionReceipt;

      const { gasUsed, gasPrice } = transactionReceipt;
      const findalGasCost = gasUsed * gasPrice;

      // After Withdraw
      const endingFundMeBalance: bigint = await ethers.provider.getBalance(
        address
      );
      const endingDeployerBalance: bigint = await ethers.provider.getBalance(
        deployer
      );

      assert.equal(endingFundMeBalance.toString(), "0");
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + findalGasCost).toString()
      );
    });

    it("Update amount to 0 in Mappings(Address => Amount)", async () => {
      await fundMe.withdraw();
      const response = await fundMe.addressToAmountFunded(deployer);
      expect(response).to.be.reverted;
    });

    it("Handle Multiple Funders Account and check if it resets", async () => {
      const accounts = await ethers.getSigners();

      // Looping through five accounts and adding funds
      for (let i = 1; i < 5; i++) {
        await fundMe.connect(accounts[i]).fund({ value: sendVal });
      }

      const address = await fundMe.getAddress();

      // Before Withdraw
      const startingFundMeBalance: bigint = await ethers.provider.getBalance(
        address
      );
      const startingDeployerBalance: bigint = await ethers.provider.getBalance(
        deployer
      );

      const transactionResponse: ContractTransactionResponse =
        await fundMe.withdraw();
      const transactionReceipt: ContractTransactionReceipt =
        (await transactionResponse.wait()) as ContractTransactionReceipt;

      const { gasUsed, gasPrice } = transactionReceipt;
      const findalGasCost = gasUsed * gasPrice;

      // After Withdraw
      const endingFundMeBalance: bigint = await ethers.provider.getBalance(
        address
      );
      const endingDeployerBalance: bigint = await ethers.provider.getBalance(
        deployer
      );

      assert.equal(endingFundMeBalance.toString(), "0");
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + findalGasCost).toString()
      );
      for (let i = 1; i < 5; i++) {
        const addressToAmountFunded = await fundMe.addressToAmountFunded(
          accounts[i].address
        );
        assert.equal(addressToAmountFunded.toString(), "0");
      }
    });
  });
});
