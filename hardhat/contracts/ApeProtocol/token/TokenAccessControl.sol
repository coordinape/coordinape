pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenAccessControl is Ownable {
	mapping(address => bool) public minters;

	bool public paused;
	bool public foreverUnpaused;
	bool public mintingDisabled;

	event MintersAdded(address[] minters);
	event MintersRemoved(address[] minters);


	modifier isPaused() {
		require(!paused, "AccessControl: Contract is paused");
		_;
	}

	modifier isMinter(address _caller) {
		require(!mintingDisabled, "AccessControl: Contract cannot mint tokens anymore");
		require(minters[_caller], "AccessControl: Cannot mint");
		_;
	}

	function changePauseStatus(bool _status) external onlyOwner {
		require(!foreverUnpaused, "AccessControl: Contract is unpaused forever");
		paused = _status;
	} 


	function disablePausingForever() external onlyOwner {
		require(!foreverUnpaused, "AccessControl: Contract is unpaused forever");
		foreverUnpaused = true;
		paused = false;
	}

	function addMinters(address[] calldata _minters) external onlyOwner {
		require(!mintingDisabled, "AccessControl: Contract cannot mint tokens anymore");

		for(uint256 i = 0; i < _minters.length; i++)
			minters[_minters[i]] = true;
		emit MintersAdded(_minters);
	}

	function removeMinters(address[] calldata _minters) external onlyOwner {
		require(!mintingDisabled, "AccessControl: Contract cannot mint tokens anymore");

		for(uint256 i = 0; i < _minters.length; i++)
			minters[_minters[i]] = false;
		emit MintersRemoved(_minters);
	}

	function disableMintingForever() external onlyOwner {
		require(!mintingDisabled, "AccessControl: Contract cannot mint anymore");
		mintingDisabled = true;
	}
}