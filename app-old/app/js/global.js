// Config

var PRICE_PER_GB_DAY = 0.5/31;
var USD_TO_ETH = 0.001;
var ETH_TO_USD = 1000;

// Initialize Firebase

var config = {
    apiKey: "AIzaSyDyAmz2ahqbA4JN4xDydRij7ju3m6_QxhQ",
    authDomain: "ipfs-space.firebaseapp.com",
    databaseURL: "https://ipfs-space.firebaseio.com",
    projectId: "ipfs-space",
    storageBucket: "ipfs-space.appspot.com",
    messagingSenderId: "598908228635"
};

firebase.initializeApp(config);

// On document ready

$(document).ready(function() {

    // Resolve links
    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            $('nav #login').hide();

            $('nav #deposit').click(function(){
                deposit();
            });

            $('#deposit-modal #pay').click(function(){
                pay();
            });

            getBalance(function(balance){
                var eth = web3.utils.fromWei(balance, 'ether');
                $('nav #current-balance').html(eth);
            });
        } else {
            $('nav #balance').hide();
            $('nav #manage').hide();
            $('nav #logout').hide();
        }
    });

});

// Helpers

var getBalance = function(callback) {
    var uid = firebase.auth().currentUser.uid;

    App.methods.getBalance(uid).call(function(err, data) {
        if (err) {
            console.log("Error getting balance: " + err);
        } else {
            callback(data);
        }
    });
}

var pay = function() {
    var amount = $('#confirm-amount').val();
    var wei = web3.utils.toWei(amount, 'ether');
    var uid = firebase.auth().currentUser.uid;

    // var gasEstimate = App.methods.addPin(fileHash).estimateGas()

    App.methods.deposit(uid).send({
        from: WEB3_ACTIVE_ACCOUNT,
        value: wei,
        gas: 900000
    }).then(function(){
        console.log("Deposit successful");
    });
}

var deposit = function() {
    $('#deposit-modal').modal('show');
}

var logout = function() {
    firebase.auth().signOut().then(function() {
        window.location.href = "/login.html";
    }, function(error) {
        console.log("Error signing out: " + error);
    });
}

var requireLogin = function(callback) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = "/login.html";
        } else {
            callback(firebase.auth().currentUser);
        }
    });
}

// Parse URL params

var URL_PARAMS = function(){
    var hashParams = {};
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);

    while (e = r.exec(q))
       hashParams[d(e[1])] = d(e[2]);

    return hashParams;
}();

// MetaMask

// Event constants
var EVENT_WEB3_ACCOUNT_CHANGED = 'EVENT_WEB3_ACCOUNT_CHANGED';
var EVENT_WEB3_ACCOUNT_READY = 'EVENT_WEB3_ACCOUNT_READY';

var WEB3_ACTIVE_ACCOUNT;

var accountInterval = setInterval(function() {
    web3.eth.getAccounts().then(function(accounts) {
        var account = accounts[0];

        if (!account) {

            // If there is no account, just return;
            return;

        } else if (WEB3_ACTIVE_ACCOUNT == null) {

            // If there was no previously selected account, then this is the
            // first time it's been initialized.
            WEB3_ACTIVE_ACCOUNT = account;

            // Fire event notification
            var evt = new Event(EVENT_WEB3_ACCOUNT_READY);
            document.dispatchEvent(evt);

            console.log("Account initialized to: " + account);

        } else if (WEB3_ACTIVE_ACCOUNT != account) {

            // Otherwise, they are changing the selected account.
            WEB3_ACTIVE_ACCOUNT = account;

            // Fire event notification
            var evt = new Event(EVENT_WEB3_ACCOUNT_CHANGED);
            document.dispatchEvent(evt);

            console.log("Account changed to: " + account);

        }
    });
}, 1000);
