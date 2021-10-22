pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FeeRegistry is Ownable {
	uint256 public staticFee;

	function setStaticFee(uint256 _fee) external onlyOwner {
		staticFee = _fee;
	}

	function getVariableFee(uint256 _yield, uint256 _total) external pure returns(uint256) {
		return 0;
	}
}