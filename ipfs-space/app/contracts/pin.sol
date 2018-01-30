pragma solidity ^0.4.7;

import "./app.sol";

contract Pin {
    // Address of the main app contract
    address private appAddr;
    // IPFS hash for the file
    string public fileHash;
    // How much money has been deposited into this pin
    uint public balance;

    function Pin(address _appAddr, string _fileHash) public payable {
        appAddr = _appAddr;
        fileHash = _fileHash;
        balance = msg.value;
        releaseFunds(msg.value);
    }

    function () public payable {
        deposit();
    }

    function deposit() public payable {
        balance += msg.value;
        releaseFunds(msg.value);
    }

    function releaseFunds(uint value) private {
        App app = App(appAddr);
        address paymentAddress = app.paymentAddress();
        paymentAddress.transfer(value);
    }

    function getMetadata() public constant returns(string, uint) {
        return (fileHash, balance);
    }
}
