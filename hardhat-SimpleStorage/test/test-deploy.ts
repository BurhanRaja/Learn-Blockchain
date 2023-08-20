import { ethers } from "hardhat";
import { assert, expect } from "chai";

describe("SimpleStorage Tests", () => {
  let simpleStorageFactory, simpleStorage;

  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should return 0 fo favourite Number", async () => {
    const currentValue = await simpleStorage.retreive();
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
    // expect(currentValue.toString()).to.equal(expectedValue);
  });

  it("Should update favourite Number to 7", async () => {
    const expectedValue = "7";
    const transactionResponse = await simpleStorage.store(expectedValue);
    await transactionResponse.wait(1);

    const currentValue = await simpleStorage.retreive();
    assert.equal(currentValue.toString(), expectedValue);
  });
});
