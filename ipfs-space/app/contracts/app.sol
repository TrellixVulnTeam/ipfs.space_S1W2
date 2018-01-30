pragma solidity ^0.4.7;

import "./pin.sol";

contract App {
    // Wallet address of ipfs.space
    address public paymentAddress;
    address[] pins;

    function App() public {
        paymentAddress = address(0x1234567);
    }

    function addPin(string fileHash) public payable {
        Pin pin = (new Pin).value(msg.value)(address(this), fileHash);
        pins.push(pin);
    }

    function getPins() public constant returns (address[]) {
        return pins;
    }
}
