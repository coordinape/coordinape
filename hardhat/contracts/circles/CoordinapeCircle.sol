// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./CoordinapeRole.sol";
import "./CoordinapeEpoch.sol";
import "./CoordinapeTokenSet.sol";

contract CoordinapeCircle is ERC721, Ownable {
    using Counters for Counters.Counter;

    enum EpochState {
        CREATED,
        GIVE_DISTRIBUTED,
        FINALISED
    }

    Counters.Counter private _inviteIds;
    mapping(address => uint256) private _invites;
    mapping(uint256 => uint8) private _roles;

    Counters.Counter private _inactiveMembers;

    Counters.Counter private _epochIds;
    mapping(uint256 => uint256) private _epochEnds;
    mapping(uint256 => uint8) private _epochState;

    uint256 private _minimumVouches;
    mapping(address => uint256) private _vouches;
    mapping(address => mapping(address => bool)) private _vouchedFor;

    event EpochCreated(uint256 indexed id, uint256 end);
    event VouchCreated(address indexed recipient, address indexed sender);
    event InviteIssued(address indexed recipient, uint8 role);
    event InviteRevoked(address indexed recipient, uint8 role);

    string private _uri;

    constructor(
        string memory name,
        string memory id,
        string memory uri,
        uint256 _minimumV
    ) ERC721(name, id) {
        _uri = uri;
        _minimumVouches = _minimumV;
    }

    /*
     *  Admin functions
     */
    function invite(address recipient, uint8 role) external onlyRole(CoordinapeRole.ADMIN) {
        require(balanceOf(recipient) == 0, "recipient is already invited.");
        require(role != 0, "role cannot be none");
        _vouches[recipient] = _minimumVouches;
        _issueInvite(recipient, role);
    }

    // to consider, should we remove them from the epoch too?
    function revoke(address recipient) external onlyRole(CoordinapeRole.ADMIN) {
        require(balanceOf(recipient) >= 1, "recipient is not invited.");
        _revokeInvite(recipient);
    }

    function setupRole(address recipient, uint8 role) external onlyRole(CoordinapeRole.ADMIN) {
        require(balanceOf(recipient) >= 1, "recipient is not invited.");
        require(role != 0, "role cannot be none");
        _roles[inviteOf(recipient)] = role;
    }

    function setMinimumVouches(uint256 value) external onlyOwner {
        _minimumVouches = value;
    }

    /*
     *  Member functions
     */

    function vouch(address recipient) external onlyRole(CoordinapeRole.VERIFIED) {
        require(balanceOf(recipient) == 0, "recipient is already invited.");
        require(!_vouchedFor[_msgSender()][recipient], "sender already vouched for recipient.");
        _vouches[recipient] += 1;
        _vouchedFor[_msgSender()][recipient] = true;
        emit VouchCreated(recipient, _msgSender());
    }

    function enter() external {
        require(balanceOf(_msgSender()) == 0, "sender is already invited.");
        require(
            _vouches[_msgSender()] >= _minimumVouches,
            "sender didn't receive minimum vouches."
        );
        _issueInvite(_msgSender(), CoordinapeRole.MEMBER);
    }

    /*
     *  View functions
     */

    function state(uint256 _epoch) external view returns (uint8) {
        return _epochState[_epoch];
    }

    function members() external view returns (address[] memory) {
        address[] memory addresses = new address[](activeMembersCount());
        uint256 j = 0;
        for (uint256 i = 1; i <= Counters.current(_inviteIds); i++) {
            if (_exists(i) && _roles[i] != 0) {
                address owner = ownerOf(i);
                addresses[j++] = owner;
            }
        }
        return addresses;
    }

    function activeMembersCount() public view returns (uint256) {
        return totalSupply();
    }

    function inviteOf(address recipient) public view returns (uint256) {
        return _invites[recipient];
    }

    function permissionsOf(address recipient) external view returns (uint8) {
        return _roles[inviteOf(recipient)];
    }

    function hasRole(address recipient, uint8 role) public view returns (bool) {
        return _roles[inviteOf(recipient)] & role != 0;
    }

    function vouchesOf(address recipient) external view returns (uint256) {
        return _vouches[recipient];
    }

    function minimumVouches() external view returns (uint256) {
        return _minimumVouches;
    }

    // should be totalActiveMembers
    function totalSupply() public view returns (uint256) {
        return Counters.current(_inviteIds) - _inactiveMembers.current();
    }

    /*
     *  Internal functions
     */
    function _epochInProgress() internal view returns (bool) {
        uint256 epochId = Counters.current(_epochIds);
        // return epochId > 0 && !CoordinapeEpoch(_epochs[epochId]).ended();
        return epochId > 0 && block.number < _epochEnds[epochId];
    }

    function _issueInvite(address recipient, uint8 role) internal {
        Counters.increment(_inviteIds);
        uint256 tokenId = Counters.current(_inviteIds);
        _mint(recipient, tokenId);
        _roles[tokenId] = role;
        _invites[recipient] = tokenId;
        _vouches[recipient] = 0;
        emit InviteIssued(recipient, role);
    }

    function _revokeInvite(address recipient) internal {
        uint256 tokenId = _invites[recipient];
        _inactiveMembers.increment();
        //_burn(tokenId);
        _roles[tokenId] = 0;
        _invites[recipient] = 0;
        emit InviteRevoked(recipient, 0);
    }

    modifier onlyRole(uint8 role) {
        require(
            (owner() == _msgSender()) || hasRole(_msgSender(), role),
            "method can only be called by who has enough role."
        );
        _;
    }

    modifier onlyInvited() {
        require(balanceOf(_msgSender()) >= 1, "method can only be called by an invited user.");
        _;
    }

    modifier onlyInProgress() {
        require(_epochInProgress(), "no epoch currently in progress.");
        _;
    }


	function updateURI(string memory newURI) public onlyOwner {
		_uri = newURI;
	}

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyOwner {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyOwner {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override onlyOwner {
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    function _beforeTokenTransfer(
        address sender,
        address recipient,
        uint256 tokenId
    ) internal override {}
}
