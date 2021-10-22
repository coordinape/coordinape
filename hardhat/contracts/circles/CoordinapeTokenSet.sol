// // SPDX-License-Identifier: MIT

// pragma solidity ^0.8.2;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// import "./Coordinape.sol";
// import "./CoordinapeCircle.sol";
// import "../ApeProtocol/MerkleDistributor.sol";

// contract TokenSet is ERC1155("some uri"), Ownable, MerkleDistributor {
// 	using SafeMath for uint256;
// 	using Counters for Counters.Counter;
// 	using MerkleProof for bytes32[];


// 	uint256 public set;
// 	IERC20 public grantToken;
// 	address public treasury;

// 	mapping(uint256 => uint256) public grants;
// 	mapping(uint256 => uint256) public grantAmounts;
// 	mapping(uint256 => uint256) public getSupply;
// 	mapping(uint256 => Counters.Counter) private _participantsRemovedIds;
// 	mapping(uint256 => mapping(address => uint8)) private _notParticipantsPerms;
// 	mapping(uint256 => mapping(uint256 => address)) private _participantsRemovedAddresses;
// 	//mapping(uint256 => mapping(address => uint256)) private _unspent;

// 	mapping(address =>  bool) public authorised;

// 	constructor(address _grant) {
// 		grantToken = IERC20(_grant);
// 	}

// 	function setCaller(address _caller, bool _val) external onlyOwner {
// 		authorised[_caller] = _val;
// 	}

// 	function setTreasury(address _treasury) external onlyOwner {
// 		treasury = _treasury;
// 	}

// 	function startEpoch(uint256 _epoch, uint256 _grant) external onlyOwner {
// 		grants[_epoch] = _grant;
// 	}

// 	function removeParticipant(uint256 _epoch, address _recipient) external onlyOwner {
// 		require(CoordinapeCircle(owner()).permissionsOf(_recipient) & Coordinape.RECEIVER != 0,
// 			"Sender is not a default receiver");
// 			_participantsRemovedAddresses[_epoch][_participantsRemovedIds[_epoch].current()] = _recipient;
// 		_participantsRemovedIds[_epoch].increment();
//         _notParticipantsPerms[_epoch][_recipient] = Coordinape.RECEIVER;
//     }

// 	function participants(uint256 _epoch) public view returns (address[] memory) {
// 		uint allMembers = CoordinapeCircle(owner()).activeMembersCount();
// 		uint256 activeMembers = allMembers - _participantsRemovedIds[_epoch].current();
//         address[] memory addresses = new address[](activeMembers);
// 		address[] memory totalAddresses = CoordinapeCircle(owner()).members();
// 		uint256 j = 0;
//         for (uint256 i = 0; i < allMembers; i++) {
// 			if (_notParticipantsPerms[_epoch][totalAddresses[i]] == 0) {
//             	addresses[j] = totalAddresses[i];
// 				j++;
// 			}
//         }
//         return addresses;
//     }

// 	function lockEpochMerkleRoot(uint256 _epoch, bytes32 _merkleRoot, uint256 _epochGetSupply) external onlyOwner {
// 		require(CoordinapeCircle(owner()).state(_epoch) == 0, "Wrong state to sync");
// 		require(_epochGetSupply > 0, "Get supply cannot be 0");
// 		epochRoots[_epoch] = _merkleRoot;
// 		getSupply[_epoch] = _epochGetSupply;
// 	}

	


// 	/*
// 	 * Fund current month allocation from either treasury (if set) or sender
// 	 * 
// 	 * _amount: Amount of yUSD to distribute on current grant roune
// 	 */
// 	function supplyGrant(uint256 _epoch) external onlyOwner {
// 		if (treasury != address(0))
// 			grantToken.transferFrom(treasury, address(this), grants[_epoch]);
// 		else
// 			grantToken.transferFrom(msg.sender, address(this), grants[_epoch]);
// 		grantAmounts[_epoch] = grants[_epoch];
// 	}

// 	function claim(uint256 _epoch, uint256 _index, address _account, uint256 _amount, bytes32[] memory _proof) external override {
// 		require(CoordinapeCircle(owner()).permissionsOf(_account) & Coordinape.RECEIVER != 0, "User is not default receiver");
// 		require(_notParticipantsPerms[_epoch][_account] & Coordinape.RECEIVER == 0, "User opted out");
// 		require(!isClaimed(_epoch, _index), "Claimed already");
// 		bytes32 node = keccak256(abi.encodePacked(_index, _account, _amount));
// 		require(_proof.verify(epochRoots[_epoch], node), "Wrong proof");
		
// 		_setClaimed(_epoch, _index);
// 		_mint(_account, _epoch, _amount, "");
// 		emit Claimed(_epoch, _index, _account, _amount);
// 	}

// 	/*
// 	 * Burn $GET tokens to receive yUSD at the end of each grant rounds
// 	 * 
// 	 *     _set: Set from which to collect funds
// 	 * _amount: Amount of $GET to burn to receive yUSD
// 	 */
// 	function get(uint256 _epoch) external {
// 		require(CoordinapeCircle(owner()).state(_epoch) == 2, "Wrong state to get");
// 		uint256 balance = balanceOf(msg.sender, _epoch);
// 		require(balance > 0, "No Get tokens");
// 		uint256 grant = grantAmounts[_epoch];
// 		require(grant > 0, "No funds");
// 		uint256 supply = getSupply[_epoch];
// 		uint256 alloc = grant.mul(balance).div(supply);

// 		_burn(msg.sender, _epoch, balance);
// 		grantAmounts[_epoch] -= alloc;
// 		getSupply[_epoch] -= balance;
// 		grantToken.transfer(msg.sender, alloc);
// 	}

// 	function permissionsOf(uint256 _epoch, address _recipient) public view returns (uint8) {
// 		uint8 defaultPerms = CoordinapeCircle(owner()).permissionsOf(_recipient);
// 		if (_notParticipantsPerms[_epoch][_recipient] & Coordinape.RECEIVER == 0)
//         	return defaultPerms;
// 		else
// 			return 0;
//     }

//     function isParticipant(uint256 _epoch, address _recipient) public view returns (bool) {
//         return CoordinapeCircle(owner()).permissionsOf(_recipient) & Coordinape.RECEIVER != 0 &&
// 				_notParticipantsPerms[_epoch][_recipient] & Coordinape.RECEIVER == 0;
//     }

// 	// we could have this again as the only token minted would be grant-backed
// 	function safeTransferFrom(
//         address from,
//         address to,
//         uint256 id,
//         uint256 amount,
//         bytes memory data
//     )
//         public
//         virtual
//         override
// 		onlyOwner
//     {
// 		super.safeTransferFrom(from, to, id, amount, data);
// 	}


// 	function safeBatchTransferFrom(
//         address from,
//         address to,
//         uint256[] memory ids,
//         uint256[] memory amounts,
//         bytes memory data
//     )
//         public
//         virtual
//         override
//     {
// 		revert();
// 	}
// 	// modifier authorised() {
// 	// 	require(authorised[msg.sender], "not authorised");
// 	// 	 _;
// 	// }
// }