pragma solidity ^0.8.2;

import "./ApeVault.sol";

contract ApeVaultFactory {
	mapping(address => bool) public vaultRegistry;

	address public yearnRegistry;
	address public apeRegistry;

	event VaultCreated(address vault);

	constructor(address _reg, address _apeReg) {
		apeRegistry = _apeReg;
		yearnRegistry = _reg;
	}

	function createApeVault(address _token, address _simpleToken) external {
		ApeVaultWrapper vault = new ApeVaultWrapper(apeRegistry, _token, yearnRegistry, _simpleToken);
		vault.transferOwnership(msg.sender);
		vaultRegistry[address(vault)] = true;
		emit VaultCreated(address(vault));
	}
}