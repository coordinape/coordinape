// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Coordinape.sol";

contract CoordinapeEpoch is ERC20, Ownable {
    using Counters for Counters.Counter;

    uint256 private _start;
    uint256 private _end;

    Counters.Counter private _participantsIds;
    mapping(uint256 => address) private _participantsAddresses;
    mapping(address => uint8) private _participants;

    mapping(address => uint256) private _unspent;

    mapping(address => mapping(address => string)) private _notes;

    uint256 private _amount;

    constructor(uint256 amount, uint256 end) ERC20("Give", "GIVE") {
        require(block.number < end, "end block must be in the future.");
        _amount = amount;
        _start = block.number;
        _end = end;
    }

    function addParticipant(address recipient, uint8 permissions) public onlyOwner {
        require(
            permissions & Coordinape.PARTICIPANT != 0,
            "permissions must contain at least 'PARTICIPANT'."
        );
        require(
            _participants[recipient] == Coordinape.EXTERNAL,
            "recipient is already a participant."
        );
        _participantsAddresses[Counters.current(_participantsIds)] = recipient;
        _participants[recipient] = permissions;
        _unspent[recipient] = _amount;
        _mint(recipient, _amount);
        Counters.increment(_participantsIds);
    }

    function removeParticipant(address recipient) public onlyOwner {
        require(
            _participants[recipient] & Coordinape.RECEIVER != 0,
            "sender is already a non-receiver participant."
        );
        _participants[recipient] = Coordinape.PARTICIPANT;
        _burn(recipient, balanceOf(recipient));
    }

    function editParticipant(address recipient, uint8 permissions) public onlyOwner {
        require(
            permissions != Coordinape.EXTERNAL,
            "call removeParticipant to remove participant."
        );
        require(
            permissions & Coordinape.PARTICIPANT != 0,
            "permissions must contain at least 'PARTICIPANT'."
        );
        _participants[recipient] = permissions;
    }

    function addNote(address recipient, string memory note) public onlyParticipant beforeEnd {
        require(_msgSender() != recipient, "cannot add a note to self.");
        require(
            _participants[recipient] & Coordinape.PARTICIPANT != 0,
            "recipient is not a participant."
        );
        _notes[recipient][_msgSender()] = note;
    }

    function stopReceiving() public onlyParticipant {
        require(
            _participants[_msgSender()] & Coordinape.RECEIVER != 0,
            "sender is already a non-receiver participant."
        );
        _participants[_msgSender()] = _participants[_msgSender()] & ~Coordinape.PARTICIPANT;
    }

    function leave() public onlyParticipant {
        stopReceiving();
        _burn(_msgSender(), balanceOf(_msgSender()));
    }

    function participants() public view returns (address[] memory) {
        address[] memory addresses = new address[](Counters.current(_participantsIds));
        for (uint256 i = 0; i < Counters.current(_participantsIds); i++) {
            addresses[i] = _participantsAddresses[i];
        }
        return addresses;
    }

    function receivedOf(address recipient) public view returns (uint256) {
        return balanceOf(recipient) - _unspent[recipient];
    }

    function permissionsOf(address recipient) public view returns (uint8) {
        return _participants[recipient];
    }

    function isParticipant(address recipient) public view returns (bool) {
        return _participants[recipient] & Coordinape.PARTICIPANT != 0;
    }

    function startBlock() public view returns (uint256) {
        return _start;
    }

    function endBlock() public view returns (uint256) {
        return _end;
    }

    function ended() public view returns (bool) {
        return block.number >= _end;
    }

    modifier onlyParticipant() {
        require(
            _participants[_msgSender()] & Coordinape.PARTICIPANT != 0,
            "method can only be called by a registered participant."
        );
        _;
    }

    modifier beforeEnd() {
        require(!ended(), "method can only be called before the end of the epoch.");
        _;
    }

    modifier afterEnd() {
        require(ended(), "method can only be called after the end of the epoch.");
        _;
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function _beforeTokenTransfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        if (sender == address(0) || recipient == address(0)) return;
        require(
            _participants[sender] & Coordinape.PARTICIPANT != 0 &&
                _participants[sender] & Coordinape.GIVER != 0,
            "sender must be a giver participant"
        );
        require(
            _participants[recipient] & Coordinape.PARTICIPANT != 0 &&
                _participants[recipient] & Coordinape.RECEIVER != 0,
            "recipient must be a receiver participant"
        );
        if (_unspent[sender] >= amount) {
            _unspent[sender] -= amount;
        }
    }
}
