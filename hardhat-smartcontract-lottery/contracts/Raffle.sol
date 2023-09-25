// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle_SendMoreToEnterRaffle();

contract Raffle is VRFConsumerBaseV2 {
    uint256 private immutable i_entranceFeed;
    address payable[] private s_players;

    events RaffleEnter(address indexed player);

    constructor(uint256 entranceFeed) {
        i_entranceFeed = entranceFeed;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFeed) {
            revert Raffle_SendMoreToEnterRaffle();
        }
        s_players.push(payable(msg.sender));
        RaffleEnter(msg.sender);
    };

    function fullfillRandomWords() internal override {
        
    };
}