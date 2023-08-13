// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {PriceConverter} from "./PriceConverter.sol";

contract FundMe {

    address private owner;
    constructor() {
        owner = msg.sender;
    }

    using PriceConverter for uint256;

    uint256 public minimumUSD = 5e18;

    address[] public funders;
    mapping (address => uint256) public addressToAmountFunded;

    function fund() public payable {
        require(msg.value.getConversionRate() >= minimumUSD, "didn't send enough ETH.");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = addressToAmountFunded[msg.sender] + msg.value;
    }

    function withdraw() public onlyOwner {
        uint256 i = 0;
        for (i; i < funders.length; i++) 
        {
            addressToAmountFunded[funders[i]] = 0;
        }
        // resetting the array
        funders = new address[](0);
        // Withdraw all the ETH balance

        // transfer - limited Gas and throws Error
        // payable(msg.sender).transfer(address(this).balance);

        // send - limited Gas and returns bool
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send Failed");

        // call - All Gas and returns bool
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Owner Invalid. Withdraw cannot be processed.");
        _;
    }

}