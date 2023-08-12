// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";

contract FundMe {

    using PriceConverter for uint256;

    uint256 public minimumUSD = 5e18;

    function fund() public payable {
        require(msg.value.getConversionRate() >= minimumUSD, "didn't send enough ETH.");
    }

}