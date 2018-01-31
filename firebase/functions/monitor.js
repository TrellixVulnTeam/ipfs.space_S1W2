const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Web3 = require('web3');
const fs = require("fs");
var request = require('request');

// Active IPFS nodes
const NODES = ["node1.ipfs.space"];

// Instantate Firebase App
admin.initializeApp(functions.config().firebase);

// Instantiate web3 - we will connect to INFURA nodes instead of our own.
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/4GrnWk15Hzz12H4rwL2k'));

// Load contract interfaces and instantiate our main app contract.
const appContractABI = JSON.parse(fs.readFileSync('../../ipfs-space/dist/contracts/App.json', 'utf8')).abi;
const pinContractABI = JSON.parse(fs.readFileSync('../../ipfs-space/dist/contracts/App.json', 'utf8')).abi;

const appContract = new web3.eth.Contract(appContractABI);

appContract.methods.getPins().call(function(err, pinAddresses) {
    for (let pinAddress of pinAddresses) {
        const pinContract = new web3.eth.Contract({address: pinAddress, abi: pinContractABI});
        pinContract.methods.getMetadata().call(function(err, data) {
            var fileHash = data[0];
            var balance = data[1];

            if (balance > 0) {
                request(NODES[0] + '/api?a=add&h=' + fileHash, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    } else {
                        console.log(error);
                    }
                });
            }
            // functions.database.ref('/usage/' + fileHash).once('value').then(function(snapshot) {
            //     if (snapshot.val()) {
            //         const
            //     }
            // });
        });
    }
});




//
// // - Go through pins from all our users.
// // - For each pin, check the blockchain for their balances, compare with the
// //  usage database to determine whether it should remain pinned.
// // - Generate list of IPFS hashes that should remain pinned.
// let hashes = [];
// for (let user of users) {
//     for (let pin of user.pins) {
//
//     }
// }
//
// // - Go through each active IPFS nodes and get list of hashes that are pinned.
// // - Compare this to the list generated above and add/purge pins as neccessary.
// for (let node in nodes) {
//     const pinned = node.getPinnedHashes();
//
//     // purge
//     for (let hash of pinned) {
//         if (!hashes.contains(hash)) {
//             node.unpin(hash);
//         }
//     }
//
//     // new pins
//     for (let hash of hashes) {
//         if (!pinned.contains(hash)) {
//             node.pin(hash);
//         }
//     }
// }
