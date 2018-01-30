const functions = require('firebase-functions');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('infura'));

// Active IPFS nodes
const nodes = [];
// Usage
const usage = {};
// User
const users = {};

// - Go through pins from all our users.
// - For each pin, check the blockchain for their balances, compare with the
//  usage database to determine whether it should remain pinned.
// - Generate list of IPFS hashes that should remain pinned.
let hashes = [];
for (let user of users) {
    for (let pin of user.pins) {
        
    }
}

// - Go through each active IPFS nodes and get list of hashes that are pinned.
// - Compare this to the list generated above and add/purge pins as neccessary.
for (let node in nodes) {
    const pinned = node.getPinnedHashes();

    // purge
    for (let hash of pinned) {
        if (!hashes.contains(hash)) {
            node.unpin(hash);
        }
    }

    // new pins
    for (let hash of hashes) {
        if (!pinned.contains(hash)) {
            node.pin(hash);
        }
    }
}
