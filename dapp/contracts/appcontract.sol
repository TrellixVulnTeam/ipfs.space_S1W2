pragma solidity ^0.4.7;

contract AppContract {
    // Wallet address of ipfs.space
    address public paymentAddress;

    // uid => balance (total deposited)
    mapping(string => uint) balances;

    function App() public {
        paymentAddress = address(0x1234567);
    }

    function deposit(string uid) public payable {
        // update existing balance
        uint currBalance = balances[uid];
        balances[uid] = currBalance + msg.value;

        // immediately move funds to our wallet
        paymentAddress.transfer(msg.value);
    }

    function getBalance(string uid) public constant returns (uint) {
        return balances[uid];
    }
}
