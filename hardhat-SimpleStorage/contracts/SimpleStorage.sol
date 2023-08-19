// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleStorage {
    uint256 public favouriteNum;

    function store(uint256 _favouriteNumber) public {
        favouriteNum = _favouriteNumber;
    }

    function retreive() public view returns(uint256) {
        return favouriteNum;
    }

    struct Person {
        uint256 favNum;
        string name;
    }

    mapping (string => uint256) public personMap;

    Person[] public listOfPeople;

    function addperson(string memory _name, uint256 _favNum) public {
        listOfPeople.push(Person(_favNum, _name));
        personMap[_name] = _favNum;
    }
}