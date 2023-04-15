// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./utils/SafeERC20.sol";

contract MockPool {
    using SafeERC20 for IERC20;

    function giveErc20(address _testTokenAddress, uint256 _values) public {
        IERC20(_testTokenAddress).safeTransfer(msg.sender, _values);
    }
}