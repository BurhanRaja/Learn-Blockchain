import { network } from "hardhat";
import { developmentChains } from "../../helper-hardhat.config";
import { assert, expect } from "chai";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Contract", () => {
      beforeEach(async () => {});

      describe("Constructor", () => {
        it("Initialize the Raffle correctly.", async () => {});
      });

      describe("Enterance Fee", () => {
        it("Check Fees added is greater than the default.", async () => {});
        it("Check if player is added to s_players array.", async () => {});
        it("Check if the Raffle State is Open or not.", async () => {});
        it("Check emit Event after fee is entered.", async () => {});
      });

      describe("checkUpKeep", () => {});
      describe("performUpKeep", () => {});
      describe("fullfilRandomWords", () => {});
    });
