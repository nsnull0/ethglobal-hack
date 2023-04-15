// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./utils/SafeERC20.sol";
import "./utils/ReentrancyGuard.sol";

interface IActivity {
  function getActivityName() external returns (string memory);
  function getAttendantName() external returns (string memory);
  function getSubscribeStatus() external returns (bool);
  function getCheckInStatus() external returns (bool);
  function subscribeThisActivity(string memory _name) external;
  struct Attendant {
    string name;
    bool isSubscribed;
    bool isCheckIn;
  }
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
    IActivity _activity = IActivity(new Activity(msg.sender));
    activities.push(_activity);
  }

  modifier onlyOwner() {
    require((owner == msg.sender), "Callable only owner");
    _;
  }
}

contract Activity is IActivity, ReentrancyGuard {
  using SafeERC20 for IERC20;

  string activityName;
  address owner;
  IERC20 paymentToken;
  
  uint256 amount;
  mapping(address => Attendant) subscribedPeople;
  uint256 qrCode;
  uint nonce;

  event subscribed(string _name, uint256 _timestamp);
  event checkIn(string _name, uint256 _timestamp);

  constructor(
    address _owner
  ) {
    owner = _owner;
    amount = 0;
    qrCode = 0;
    nonce = 0;
    paymentToken = IERC20(address(0));
  }

  function generateQrCode() external onlyOwner {
    qrCode = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,nonce)));
  }

  function setPrice(
    uint256 _amount
  ) external onlyOwner {
    amount = _amount;
    nonce += 1;
  }

  function setPaymentToken(
    address _paymentToken
  ) external onlyOwner {
    paymentToken = IERC20(_paymentToken);
    nonce += 1;
  }

  function getQrCode() external view returns (uint256) {
    return qrCode;
  }

  function getActivityName() external view returns (string memory) {
    return activityName;
  }

  function getAttendantName() external view returns (string memory) {
    return subscribedPeople[msg.sender].name;
  }

  function getPrice() external view returns (uint256) {
    return amount;
  }

  function getPaymentTokenAddress() external view returns (address) {
    return address(paymentToken);
  }

  function getSubscribeStatus() external view returns (bool) {
    return subscribedPeople[msg.sender].isSubscribed;
  }

  function getCheckInStatus() external view returns (bool) {
    return subscribedPeople[msg.sender].isCheckIn;
  }

  function subscribeThisActivity(
    string memory _name
  ) external nonReentrant {
    require((paymentToken != IERC20(address(0))), "Payment token not set yet");
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
    Attendant memory _attendy;
    _attendy.name = _name;
    _attendy.isSubscribed = true;
    _attendy.isCheckIn = false;
    subscribedPeople[msg.sender] = _attendy;
    nonce += 1;
    emit subscribed(_name, block.timestamp);
  }

  function checkIntoThisActivity() external nonReentrant {
    bool _isSubscribed = subscribedPeople[msg.sender].isSubscribed;
    bool _isCheckin = subscribedPeople[msg.sender].isCheckIn;
    require((_isSubscribed), "Member not yet subscribe");
    require((!_isCheckin), "Member already checkin");
    Attendant memory _attendy = subscribedPeople[msg.sender];
    _attendy.isCheckIn = true;
    subscribedPeople[msg.sender] = _attendy;
    emit checkIn(_attendy.name, block.timestamp);
  }

  modifier onlyOwner() {
    require((owner == msg.sender), "Callable: only Owner");
    _;
  }
}
