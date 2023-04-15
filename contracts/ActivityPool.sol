// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./utils/SafeERC20.sol";
import "./utils/ReentrancyGuard.sol";

interface IActivity {
  function getName() external returns (string memory);
  function subscribeToTheEvent() external;
}

contract ActivityPool is ReentrancyGuard {
  
  address owner;

  IActivity[] public activities;

  constructor() {
    owner = msg.sender;
  }

  function getListOfActivity() external view returns (IActivity[] memory) {
    return activities;
  }

  function createActivity() external nonReentrant {
    IActivity _activity = IActivity(new Activity());
    activities.push(_activity);
  }

  modifier onlyOwner() {
    require((owner == msg.sender), "Callable only owner");
    _;
  }
}

contract Activity is IActivity, ReentrancyGuard {
  using SafeERC20 for IERC20;

  string name;
  address owner;
  IERC20 paymentToken;
  
  uint256 amount;

  address[] subscribedPeople;

  event subscribed(string _name, uint256 _timestamp);

  constructor() {
    owner = msg.sender;
    amount = 0;
  }

  function setPrice(
    uint256 _amount
  ) external onlyOwner {
    amount = _amount;
  }

  function setPaymentToken(
    address _paymentToken
  ) external onlyOwner {
    paymentToken = IERC20(_paymentToken);
  }

  function getName() external view returns (string memory) {
    return name;
  }

  function subscribeToTheEvent() external nonReentrant {
    require((amount > 0), "Price not set yet");
    require(
            IERC20(paymentToken).allowance(msg.sender, address(this)) >=
                amount,
            "Insufficient allowance"
        );

    IERC20(paymentToken).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );
    IERC20(paymentToken).safeTransfer(owner, amount);
    
    emit subscribed(name, block.timestamp);
  }

  modifier onlyOwner() {
    require((owner == msg.sender), "Callable: only Owner");
    _;
  }
}
