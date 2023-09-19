import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert, expect } from "chai";
import { Address } from "hardhat-deploy/dist/types";

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

  describe("Withdraw", async () => {
    it("Update amount to 0 in Mappings(Address => Amount)", async () => {
      await fundMe.fund({ value: sendVal });
      await fundMe.withdraw();
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), "0");
    });
  });
});
