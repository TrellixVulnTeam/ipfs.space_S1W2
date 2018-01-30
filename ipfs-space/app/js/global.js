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
