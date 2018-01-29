pragma solidity ^0.4.7;

import "./pin.sol";

contract App {
    // Wallet address of ipfs.space
    address public overlordAddr;
    // Map of wallet address to Pin contract addresses
    mapping(address => address[]) accounts;

    function getAccount() public constant returns(address[]) {
        return accounts[msg.sender];
    }

    function addPin(string fileHash) public payable {
        Pin newPin = (new Pin).value(msg.value)(address(this), msg.sender, fileHash);
        accounts[msg.sender].push(newPin);
    }

    /* function removePin(address pinAddr) public {
    } */
}
