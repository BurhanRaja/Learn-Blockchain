import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat.config";
import { assert, expect } from "chai";
import { Raffle } from "../../typechains/contracts/Raffle";
import { Address } from "hardhat-deploy/dist/types";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Staging Contract Tests", () => {
      let raffle: Raffle, deployer: Address, sendVal: bigint;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        sendVal = ethers.parseEther("0.05");
        // const deploymentResults = await deployments.fixture(["all"]);
        // const raffleAddress = deploymentResults["Raffle"]?.address; // Raffle Address
        raffle = (await ethers.getContractAt(
          "Raffle",
          "0x70134B5085231E19d873C2f39D42F7c275488482"
        )) as unknown as Raffle; // Getting Raffle Contract
      });

      describe("fullfilRandomWords", () => {
        //
        it("picks a winner, resets the contract balance and sends the money to winner", async () => {
          console.log("Setting up test...");
          const startingTimeStamp = await raffle.getLastTimeStamp();
          console.log(startingTimeStamp);

          const accounts = await ethers.getSigners();
          let startingBalance: bigint;

          console.log("Setting up Listener...");
          await new Promise(async (resolve, reject) => {
            console.log("Started Promise...");

            raffle.once(raffle.getEvent("WinnerSelected"), async () => {
              console.log("WinnerSelected event fired");

              try {
                const recentWinner = await raffle.getRecentWinner();
                console.log(recentWinner);

                const raffleState = await raffle.getRaffleState();
                console.log(raffleState);

                const winnerEndingBalance = await ethers.provider.getBalance(
                  accounts[0].address
                );
                console.log(winnerEndingBalance);

                const endingTimeStamp = await raffle.getLastTimeStamp();
                console.log(endingTimeStamp);

                // assert.equal(recentWinner)
                await expect(raffle.getOnePlayer(0)).to.be.reverted;
                console.log("Test-1 Passed.");
                assert.equal(recentWinner.toString(), accounts[0].address);
                console.log("Test-2 Passed.");
                assert.equal(raffleState.toString(), "0");
                console.log("Test-3 Passed.");
                assert.equal(
                  winnerEndingBalance.toString(),
                  (startingBalance + sendVal).toString()
                );
                console.log("Test-4 Passed.");
                assert(startingTimeStamp < endingTimeStamp);
                console.log("Test-5 Passed.");
                return resolve("");
              } catch (err) {
                return reject(err);
              }
            });

            // Triggering the Event Above to run and test;
            try {
              console.log("Entering Raffle...");
              const tx = await raffle.enterRaffle({ value: sendVal });
              await tx.wait(1);
              console.log("Ok, time to wait...");
              startingBalance = await ethers.provider.getBalance(
                accounts[0].address
              );
              console.log(startingBalance);
            } catch (err) {
              reject(err);
            }
          });
        });
      });
    });
