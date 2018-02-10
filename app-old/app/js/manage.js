
var Manage = {
    init: function() {
        requireLogin(_.bind(function(user){
            const ipfs = new Ipfs();

            $('#pin').click(function() {
                $('#pin-modal').modal('show');
            });

            $('#confirm-pin').click(function(a) {
                var fileHash = $('#pin-modal #file-hash').val();
                firebase.database().ref('/pins/' + user.uid).push({"fileHash": fileHash});
            });

            $('#refresh').click(this.refresh);

            this.refresh();
        }, this));




        // $('#confirm-amount').on('change', function() {
        //     var usd = $('#confirm-amount').val();
        //     var eth = usd * USD_TO_ETH;
        //     var fileSize = $('#confirm-file-size').val();
        //     var days = Math.round(usd / fileSize * PRICE_PER_GB_DAY);
        //
        //     $('#approx-eth').html(eth);
        //     $('#approx-expire').html(days);
        // });
    },

    // confirmPin: function() {
    //     var fileHash = $('#file-hash').val();
    //     ipfs.object.stat(fileHash, function(err, stat) {
    //         if (!err) {
    //             console.log(stat);
    //
    //             var fileSize = stat.CumulativeSize/1000000000;
    //             $('#confirm-file-hash').val(fileHash);
    //             $('#confirm-file-size').val(fileSize);
    //             $('#confirm-price').val();
    //             $('#pin-modal').modal('show');
    //         } else {
    //             console.log(err);
    //         }
    //     });
    // },


    refresh: function() {
        var uid = firebase.auth().currentUser.uid;
        $('#files tbody').empty();

        firebase.database().ref('/pins/' + uid).once('value').then(function(snapshot) {
            var pins = snapshot.val();

            for (var k in pins) {
                var pin = pins[k];

                $('#files tbody').append('<tr>' +
                    '<td class="align-middle">/ipfs/' + pin['fileHash'] + '</td>' +
                    '<td class="align-middle">' + 0 + ' GB</td>' +
                    '<td class="align-middle">' +
                        '<div class="input-group input-group-sm">' +
                            '<button type="button" class="btn btn-sm btn-outline-danger">Unpin</button>' +
                        '</div>' +
                    '</td>' +
                '</tr>');
            }
        });
    }



}
