var Login = {
    init: function() {
        // if already logged in, redirect them
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                window.location.href = '/manage.html';
            }
        });

        $('#signup-button').click(function(){
            firebase.auth().createUserWithEmailAndPassword($('#email').val(), $('#pass').val()).catch(function() {
                window.location.href = '/manage.html';
            },function(error) {
                console.log('Erorr signing up: ' + error);
            });
        });

        $('#login-button').click(function(){
            firebase.auth().signInWithEmailAndPassword($('#email').val(), $('#pass').val()).then(function() {
                window.location.href = '/manage.html';
            }, function(error) {
                console.log('Erorr logging in: ' + error);
            });
        });
    }
}
