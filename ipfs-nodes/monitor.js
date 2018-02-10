var firebaseAdmin = require("firebase-admin");
const Web3 = require('web3');
const fs = require("fs");
var request = require('request');

// Initialize Firebase Admin SDK
var serviceAccount = require("./ipfs-space-firebase-adminsdk-koq96-c73b33083c.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://ipfs-space.firebaseio.com"
});

var database = firebaseAdmin.database();

// Active IPFS nodes
const NODES = [
    "35.229.117.135",
];

// Instantiate web3 - we will connect to INFURA nodes instead of our own.
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/4GrnWk15Hzz12H4rwL2k'));

// Load contract interfaces and instantiate our main app contract.
const appContractData = JSON.parse(fs.readFileSync('../ipfs-space/dist/contracts/App.json', 'utf8'));
const pinContractData = JSON.parse(fs.readFileSync('../ipfs-space/dist/contracts/Pin.json', 'utf8'));

const appContract = new web3.eth.Contract(appContractData.abi, appContractData.address);

console.log("[INFO] - Loaded contract data");

appContract.methods.getPins().call(function(err, pinAddresses) {
    console.log("[INFO] - Retrieved " + pinAddresses.length + " Pin contracts");

    for (let pinAddress of pinAddresses) {

        const pinContract = new web3.eth.Contract(pinContractData.abi, pinAddress);

        pinContract.methods.getMetadata().call(function(err, data) {
            var fileHash = data[0];
            var balance = data[1];

            console.log("[INFO] - Found Pin contract with hash=" + fileHash + " and balance=" + balance);

            database.ref('/usage/' + fileHash).once('value').then(function(snapshot) {
                let consumed = 0;

                if (snapshot.val() == null) {
                    database.ref('/usage/' + fileHash).set({
                        "consumed": 0
                    });
                } else {
                    consumed = Number(snapshot.val().consumed);
                }

                console.log("[INFO] - hash=" + fileHash + " has consumed=" + consumed);

                // Update consumption
                const updatedConsumed = Number(consumed) + Number(web3.utils.toWei('1', 'ether'));
                database.ref('/usage/' + fileHash).update({
                    "consumed": updatedConsumed
                });

                console.log("[INFO] - Updating consumption for hash=" + fileHash + " to consumed=" + updatedConsumed);

                if (balance > consumed) {
                    console.log("[INFO] - Pinning hash=" + fileHash);

                    var url = 'http://127.0.0.1:5001/api/v0/pin/add?recursive=true&arg=' + fileHash;
                    request(url, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("Successfully pinned: " + body);
                        } else {
                            console.log("Add Pin failed: " + error);
                        }
                    });
                } else {
                    console.log("[INFO] - Removing Pin hash=" + fileHash);

                    var url = 'http://127.0.0.1:5001/api/v0/pin/rm?recursive=true&arg=' + fileHash;
                    request(url, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("Successfully removed Pin: " + body);
                        } else {
                            console.log("Remove Pin failed: " + error);
                        }
                    });
                }
            });
        });
    }
});
