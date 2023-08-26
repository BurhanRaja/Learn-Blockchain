import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { assert } from "chai";

describe("FundMe", async () => {
  let fundMe: FundMe;
  let deployer: Address;
  let mockV3Aggregator: MockV3Aggregator;

  beforeEach(async () => {
    console.log("deploying all contracts");
    const deploymentResults = await deployments.fixture(["all"]);
    console.log(deploymentResults);

    const fundMeAddress: string = deploymentResults["fundMe"]?.address;
    fundMe = (await ethers.getContractAt(
      "FundMe",
      fundMeAddress
    )) as unknown as FundMe;
    const mockV3AggregatorAddress: string = deploymentResults["mocks"]?.address;
    mockV3Aggregator = (await ethers.getContractAt(
      "mocks",
      mockV3AggregatorAddress
    )) as unknown as MockV3Aggregator;
  });

  describe("Constructor", async () => {
    it("sets the aggregator addresses correctly", async () => {
      const response: string = await fundMe.priceFeed();
      const mockV3AggregatorAddress: string =
        await mockV3Aggregator.getAddress();
      assert.equal(response, mockV3AggregatorAddress);
    });
  });
});
