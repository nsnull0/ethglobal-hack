// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./utils/ReentrancyGuard.sol";
import "./Activity.sol";

contract ActivityPool is ReentrancyGuard {
  
  address owner;

  address[] activities;

  constructor() {
    owner = msg.sender;
  }

  function getListOfActivity() external view returns (address[] memory) {
    return activities;
  }

  function createActivity() external nonReentrant {
    address _activity = address(IActivity(new Activity(msg.sender)));
    activities.push(_activity);
  }

  modifier onlyOwner() {
    require((owner == msg.sender), "Callable only owner");
    _;
  }
}


