pragma solidity ^0.4.7;

import "./app.sol";

contract Pin {
    // Address of the main app contract
    address appAddr;
    // Address of the owner
    address ownerAddr;
    // Time stamp of when this pin was created
    uint startTime;
    // IPFS hash for the file
    string fileHash;
    // How much money has been deposited into this pin
    uint balance;

    function Pin(address _appAddr, address _ownerAddr, string _fileHash) public payable {
        appAddr = _appAddr;
        ownerAddr = _ownerAddr;
        startTime = now;
        fileHash = _fileHash;
        balance = msg.value;
        releaseFunds(msg.value);
    }

    function deposit() public payable {
        balance += msg.value;
        releaseFunds(msg.value);
    }

    function remove() public {
        address overlordAddr = getOverlordAddr();

        require(msg.sender == ownerAddr || msg.sender == overlordAddr || msg.sender == appAddr);

        selfdestruct(overlordAddr);
    }

    function releaseFunds(uint value) private {
        // release funds to overlord account
        address overlordAddr = getOverlordAddr();
        overlordAddr.transfer(value);
    }

    function getOverlordAddr() private constant returns(address) {
        App app = App(appAddr);
        address overlordAddr = app.overlordAddr();
        return overlordAddr;
    }
}
