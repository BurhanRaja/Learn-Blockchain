import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains, networkCofig } from "../../helper-hardhat.config";
import { assert, expect } from "chai";
import { VRFCoordinatorV2Mock } from "../../typechains/@chainlink/contracts/src/v0.8/mocks";
import { Raffle } from "../../typechains/contracts/Raffle";
import { Address } from "hardhat-deploy/dist/types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Contract", () => {
      let raffle: Raffle,
        vrfCoordinatorV2Mock: VRFCoordinatorV2Mock,
        deployer: Address,
        chainId: number,
        sendVal: bigint,
        accounts: Array<HardhatEthersSigner>,
        player: HardhatEthersSigner,
        interval: string;

      beforeEach(async () => {
        chainId = network.config.chainId!;
        sendVal = ethers.parseEther("0.2");
        interval = networkCofig[chainId]["keepersUpdateInterval"]!;

        deployer = (await getNamedAccounts()).deployer;

        const deploymentResults = await deployments.fixture(["all"]);

        // Getting Player account
        accounts = await ethers.getSigners();
        player = accounts[1];

        const raffleAddress = deploymentResults["Raffle"]?.address; // Raffle Address
        raffle = (await ethers.getContractAt(
          "Raffle",
          raffleAddress
        )) as unknown as Raffle; // Getting Raffle Contract
        raffle = raffle.connect(player); // Connecting it to a Player account

        const vrfCoordinatorV2MockAddress =
          deploymentResults["VRFCoordinatorV2Mock"]?.address;
        vrfCoordinatorV2Mock = (await ethers.getContractAt(
          "VRFCoordinatorV2Mock",
          vrfCoordinatorV2MockAddress
        )) as unknown as VRFCoordinatorV2Mock;
      });

      describe("Constructor", () => {
        it("Initialize the Raffle correctly.", async () => {
          const raffleState = await raffle.getRaffleState();
          const interval = await raffle.getInterval();

          assert.equal(raffleState.toString(), "0");
          assert.equal(
            interval.toString(),
            networkCofig[chainId]?.keepersUpdateInterval
          );
        });
      });

      describe("enterRaffle", () => {
        it("Check Fees added is greater than the value provided.", async () => {
          await expect(
            raffle.enterRaffle({ value: ethers.parseEther("0.01") })
          ).to.be.revertedWithCustomError(
            raffle,
            "Raffle__NotEnoughEthEntered()"
          );
        });
        //
        it("Record player when they add ETH.", async () => {
          await raffle.enterRaffle({ value: sendVal });
          const playerOne: string = await raffle.getOnePlayer(0);
          assert.equal(playerOne, player.address);
        });
        //
        it("Raffle state should not be open in Calculating state.", async () => {
          await raffle.enterRaffle({ value: sendVal });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.request({ method: "evm_mine", params: [] });

          await raffle.performUpkeep("0x");
          await expect(
            raffle.enterRaffle({ value: sendVal })
          ).to.be.revertedWithCustomError(raffle, "Raffle__NotOpen()");
        });
        //
        it("Should Emit Event the Fees entered is a success.", async () => {
          await expect(raffle.enterRaffle({ value: sendVal })).to.emit(
            raffle,
            `RaffleEnter`
          );
        });
      });

      describe("checkUpKeep", () => {
        it("returns false when Eth is 0.", async () => {
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.request({ method: "evm_mine", params: [] });
          const { upkeepNeeded } = await raffle.checkUpkeep("0x");
          assert.equal(upkeepNeeded, false);
        });
        //
        it("returns false when the time has not passed.", async () => {
          await raffle.enterRaffle({ value: sendVal });
          const { upkeepNeeded } = await raffle.checkUpkeep("0x");
          assert.equal(upkeepNeeded, false);
        });
        //
        it("returns false when the state is in Calculating state.", async () => {
          await raffle.enterRaffle({ value: sendVal });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.request({ method: "evm_mine", params: [] });
          await raffle.performUpkeep("0x");
          const { upkeepNeeded } = await raffle.checkUpkeep("0x");
          const raffleState = await raffle.getRaffleState();

          assert.equal(raffleState.toString(), "1");
          assert.equal(upkeepNeeded, false);
        });
        //
        it("returns true if all the conditions are met.", async () => {
          await raffle.enterRaffle({ value: sendVal });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.request({ method: "evm_mine", params: [] });
          const { upkeepNeeded } = await raffle.checkUpkeep("0x");
          assert.equal(upkeepNeeded, true);
        });
      });

      describe("performUpKeep", () => {
        it("can only if checkUpKeep returns true", async () => {
          await raffle.enterRaffle({ value: sendVal });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.request({ method: "evm_mine", params: [] });
          const tx = await raffle.performUpkeep("0x");
          assert(tx);
        });
        //
        it("reverts error if checkUpKeep returns false", async () => {
          await expect(
            raffle.performUpkeep("0x")
          ).to.be.revertedWithCustomError(raffle, "Raffle__UpKeepNotNeeded");
        });
        //
        it("state changes to Calculating and emits event with requestId", async () => {
          await raffle.enterRaffle({ value: sendVal });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.request({ method: "evm_mine", params: [] });
          await raffle.performUpkeep("0x");
          const raffleState = await raffle.getRaffleState();
          assert.equal(raffleState.toString(), "1");
        });
      });

      describe("fullfilRandomWords", () => {
        beforeEach(async () => {
          await raffle.enterRaffle({ value: sendVal });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.request({ method: "evm_mine", params: [] });
        });
        //
        it("can only be run after performUpKeep", async () => {
          const raffleAddress = await raffle.getAddress();
          await expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(0, raffleAddress) // reverts if not fulfilled
          ).to.be.revertedWith("nonexistent request");
          await expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(1, raffleAddress) // reverts if not fulfilled
          ).to.be.revertedWith("nonexistent request");
        });
        //
        it("picks a winner, resets the contract balance and sends the money to winner", async () => {
          const additionalAddresses = 3;
          const startingAddress = 2;
          const startingTimeStamp = await raffle.getLastTimeStamp();

          let startingBalance: bigint;

          for (
            let i = startingAddress;
            i < startingAddress + additionalAddresses;
            i++
          ) {
            raffle = raffle.connect(accounts[i]);
            await raffle.enterRaffle({ value: sendVal });
          }

          await new Promise(async (resolve, reject) => {
            raffle.once(raffle.getEvent("WinnerSelected"), async () => {
              console.log("WinnerSelected event fired");

              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerBalance = await ethers.provider.getBalance(
                  accounts[2].address
                );
                const endingTimeStamp = await raffle.getLastTimeStamp();

                // assert.equal(recentWinner)
                assert.equal(recentWinner.toString(), accounts[2].address);
                assert.equal(raffleState.toString(), "0");
                assert.equal(
                  winnerBalance.toString(),
                  (
                    startingBalance +
                    (sendVal * BigInt(additionalAddresses) + sendVal)
                  ).toString()
                );
                assert(startingTimeStamp < endingTimeStamp);
                resolve("");
              } catch (err) {
                reject(err);
              }
            });

            // Triggering the Event Above to run and test;
            try {
              const tx = await raffle.performUpkeep("0x");
              const txReceipt = await tx.wait(1);
              const txResult = txReceipt?.toJSON();
              const requestId = txResult?.logs[1]?.args[0];
              const raffleAddress = await raffle.getAddress();
              startingBalance = await ethers.provider.getBalance(
                accounts[2].address
              );
              // Running FulfillRandomWords
              await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestId,
                raffleAddress
              );
            } catch (err) {
              reject(err);
            }
          });
        });
      });
    });
