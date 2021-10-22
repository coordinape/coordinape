pragma solidity ^0.8.2;

import "./TimeLock.sol";

contract ApeRegistry is TimeLock {
	address public feeRegistry;
	address public router;
	address public distributor;
	address public factory;
	address public treasury;

	constructor(uint256 _minDelay) TimeLock(_minDelay) {}

	function setFeeRegistry(address _registry) external itself {
		feeRegistry = _registry;
	}

	function setRouter(address _router) external itself {
		router = _router;
	}

	function setDistributor(address _distributor) external itself {
		distributor = _distributor;
	}

	function setFactory(address _factory) external itself {
		factory = _factory;
	}

	function setTreasury(address _treasury) external itself {
		treasury = _treasury;
	}
}