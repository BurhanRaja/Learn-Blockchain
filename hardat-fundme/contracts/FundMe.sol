// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {PriceConverter} from "./PriceConverter.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error FundMe__NotOwner();

/// @title A Smart Contract for Crowd Funding
/// @author Burhan Raja
/// @notice
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 4e18;
    AggregatorV3Interface public priceFeed; // PriceFeed Aggregator
    address public immutable i_owner;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    modifier onlyOwner() {
        // require(msg.sender == i_owner, NotOwner());
        if (msg.sender == i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    // Get Price feed address
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // What if someone send money to us without initiating fund function

    // recieve()
    // fallback()

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "didn't send enough ETH."
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] =
            addressToAmountFunded[msg.sender] +
            msg.value;
    }

    function withdraw() public onlyOwner {
        uint256 i = 0;
        for (i; i < funders.length; i++) {
            addressToAmountFunded[funders[i]] = 0;
        }
        // resetting the array
        funders = new address[](0);
        // Withdraw all the ETH balance

        // ? transfer - limited Gas and throws Error
        // payable(msg.sender).transfer(address(this).balance);

        // ? send - limited Gas and returns bool
        // ? bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // ? require(sendSuccess, "Send Failed");

        // call - All Gas and returns bool
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }
}
