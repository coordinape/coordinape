pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../../../interfaces/IApeVault.sol";
import "../ApeDistributor.sol";
import "../ApeAllowanceModule.sol";
import "../ApeRegistry.sol";
import "../FeeRegistry.sol";

import "./BaseWrapper.sol";

contract ApeVaultWrapper is BaseWrapper, Ownable {
	using SafeERC20 for VaultAPI;
	using SafeERC20 for IERC20;

	uint256 constant TOTAL_SHARES = 10000;
	
	IERC20 public simpleToken;

	mapping(address => bool) public hasAccess;

	uint256 public underlyingValue;
	address public apeRegistry;
	VaultAPI public vault;
	ApeAllowanceModule public allowanceModule;

	constructor(
		address _apeRegistry,
	    address _token,
        address _registry,
		address _simpleToken) BaseWrapper(_token, _registry) {
		apeRegistry = _apeRegistry;
		if (_token != address(0))
			vault = VaultAPI(RegistryAPI(_registry).latestVault(_token));
		simpleToken = IERC20(_simpleToken);
	}

	event ApeVaultFundWithdrawal(address indexed apeVault, address vault, uint256 _amount, bool underlying);

	modifier onlyDistributor() {
		require(msg.sender == ApeRegistry(apeRegistry).distributor());
		_;
	}

	modifier onlyRouter() {
		require(msg.sender == ApeRegistry(apeRegistry).router());
		_;
	}

	function _shareValue(uint256 numShares) internal view returns (uint256) {
		return vault.pricePerShare() * numShares / (10**uint256(vault.decimals()));
    }

    function _sharesForValue(uint256 amount) internal view returns (uint256) {
		return amount * (10**uint256(vault.decimals())) / vault.pricePerShare();
    }

	function profit() public view returns(uint256) {
		uint256 totalValue = _shareValue(token.balanceOf(address(this)));
		require(totalValue >= underlyingValue, "no profit. Underperforming vault");
		return totalValue - underlyingValue;
	}

	function _profit() internal view returns(uint256) {
		uint256 totalValue = _shareValue(token.balanceOf(address(this)));
		if (totalValue <= underlyingValue)
			return 0;
		else
			return totalValue - underlyingValue;
	}

	function apeDepositSimpleToken(uint256 _amount) public {
		simpleToken.safeTransferFrom(msg.sender, address(this), _amount);
	}

	//wip
	function apeWithdrawUnderlying(uint256 _underlyingAmount) external onlyOwner {
		require(_underlyingAmount <= underlyingValue, "underlying amount higher than vault value");

		underlyingValue -= _underlyingAmount;
		uint256 withdrawn = _withdraw(address(this), msg.sender, _underlyingAmount, true);
		emit ApeVaultFundWithdrawal(address(this), address(vault), _underlyingAmount, true);
	}

	function exitVaultToken(bool _underlying) external onlyOwner {
		underlyingValue = 0;
		uint256 totalShares = vault.balanceOf(address(this));
		if (_underlying) {
			totalShares = _withdraw(address(this), msg.sender, vault.balanceOf(address(this)), true);
			emit ApeVaultFundWithdrawal(address(this), address(vault), totalShares, true);
		}
		else {
			totalShares = vault.balanceOf(address(this));
			vault.transfer(msg.sender, totalShares);
			emit ApeVaultFundWithdrawal(address(this), address(vault), totalShares, false);
		}
	}

	function apeMigrate() external onlyOwner {
		_migrate(address(this));
		vault = VaultAPI(registry.latestVault(address(token)));
	}

	function tap(uint256 _value, uint8 _type) external onlyDistributor returns(uint256) {
		if (_type == uint8(0)) {
			_tapOnlyProfit(_value, msg.sender);
			return _value;
		}
		else if (_type == uint8(1)) {
			_tapBase(_value, msg.sender);
			return _value;
		}
		else if (_type == uint8(2))
			_tapSimpleToken(_value, msg.sender);
		return (0);
	}


	// _tapValue is vault token amount to remove
	// TODO add fee
	// TODO add recipient for fee
	function _tapOnlyProfit(uint256 _tapValue, address _recipient) internal {
		require(_shareValue(_tapValue) <= profit(), "Not enough profit to cover epoch");
		vault.safeTransfer(_recipient, _tapValue);
	}

	// TODO add fee
	// TODO add recipient for fee
	function _tapBase(uint256 _tapValue, address _recipient) internal {
		uint256 underlyingTapValue = _shareValue(_tapValue);
		uint256 profit_ = _profit();
		underlyingValue -= underlyingTapValue - profit_;
		vault.safeTransfer(_recipient, _tapValue);
	}

	// TODO add recipient for fee
	function _tapSimpleToken(uint256 _tapValue, address _recipient) internal {
		uint256 fee = _tapValue * FeeRegistry(ApeRegistry(apeRegistry).feeRegistry()).staticFee() / TOTAL_SHARES;
		simpleToken.transfer(_recipient, _tapValue);
		simpleToken.transfer(ApeRegistry(apeRegistry).treasury(), fee);
	}

	function syncUnderlying() external onlyOwner {
		underlyingValue = _shareValue(token.balanceOf(address(this)));
	}

	function addFunds(uint256 _amount) external onlyRouter {
		underlyingValue += _amount;
	}

	function approveCircleAdmin(bytes32 _circle, address _admin) external onlyOwner {
		ApeDistributor(ApeRegistry(apeRegistry).distributor()).updateCircleAdmin(_circle, _admin);
	}

	function updateAllowance(
		bytes32 _circle,
		address _token,
		uint256 _amount,
		uint256 _interval,
		uint256 _epochAmount
		) external onlyOwner {
		ApeDistributor(
			ApeRegistry(apeRegistry).distributor()
		).setAllowance(_circle, _token, _amount, _interval, _epochAmount);
	}
}