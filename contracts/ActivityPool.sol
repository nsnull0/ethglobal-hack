// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface Activity {
  function getName() external returns (string memory);
}

interface IERC20 {
  function transferFrom(address from, address to, uint256 amount) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
}

contract ActivityPool {
  
  address owner;

  Activity[] activities;

  constructor() {
    owner = msg.sender;
  }

  function getListOfActivity() external view returns (Activity[] memory) {
    return activities;
  }

  function registerActivity() external {
    
  }

  modifier onlyOwner() {
    require((owner == msg.sender), "Callable only owner");
    _;
  }
}
