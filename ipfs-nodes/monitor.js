var firebase = require("firebase");
const Web3 = require('web3');
const fs = require("fs");
var request = require('request');

// Initialize Firebase SDK
var config = {
    apiKey: "AIzaSyDyAmz2ahqbA4JN4xDydRij7ju3m6_QxhQ",
    authDomain: "ipfs-space.firebaseapp.com",
    databaseURL: "https://ipfs-space.firebaseio.com",
    projectId: "ipfs-space",
    storageBucket: "ipfs-space.appspot.com",
    messagingSenderId: "598908228635"
};
firebase.initializeApp(config);

var database = firebase.database();

// Active IPFS nodes
const NODES = [
    "localhost:5050",
];

// Instantiate web3 - we will connect to INFURA nodes instead of our own.
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/4GrnWk15Hzz12H4rwL2k'));

// Load contract interfaces and instantiate our main app contract.
const appContractData = JSON.parse(fs.readFileSync('./contracts/App.json', 'utf8'));
const pinContractData = JSON.parse(fs.readFileSync('./contracts/Pin.json', 'utf8'));

const appContract = new web3.eth.Contract({abi: appContractData.abi, address: appContractData.address});

console.log("[INFO] - Loaded contract data");

appContract.methods.getPins().call(function(err, pinAddresses) {
    console.log("[INFO] - Retrieved " + pinAddresses.length + " Pin contracts");

    for (let pinAddress of pinAddresses) {
        const pinContract = new web3.eth.Contract({abi: pinContractData.abi, address: pinAddress});
        pinContract.methods.getMetadata().call(function(err, data) {
            var fileHash = data[0];
            var balance = data[1];

            console.log("[INFO] - Found Pin contract with hash=" + fileHash + " and balance=" + balance);

            // database.ref('/usage/' + fileHash).once('value').then(function(snapshot) {
            //     let consumed = 0;
            //     if (snapshot.val()) {
            //         consumed = snapshot.val().consumed;
            //     }
            //
            //     console("[INFO] - hash=" + fileHash + " has consumed=" + consumed);
            //
            //     if (balance > consumed) {
            //         console("[INFO] - Pinning hash=" + fileHash);
            //
            //         request(NODES[0] + '/api?a=add&h=' + fileHash, function (error, response, body) {
            //             if (!error && response.statusCode == 200) {
            //                 console.log("Successfully pinned: " + body);
            //             } else {
            //                 console.log("Add Pin failed: " + error);
            //             }
            //         });
            //     } else {
            //         console("[INFO] - Removing Pin hash=" + fileHash);
            //
            //         request(NODES[0] + '/api?a=rm&h=' + fileHash, function (error, response, body) {
            //             if (!error && response.statusCode == 200) {
            //                 console.log("Successfully removed Pin: " + body);
            //             } else {
            //                 console.log("Remove Pin failed: " + error);
            //             }
            //         });
            //     }
            //
            // });
        });
    }
});
