import '../sass/app.scss';
import enplug from '@enplug/player-sdk';

(function( enplug ) {

        'use strict';

        /*********************
         Player SDK - Methods
        *********************/

        // Function calling `enplug.appStatus.hide() on error
        function hideOnError() {
            return enplug.appStatus.hide();
        }

        // Listening for a 'destroy` event from the server
        enplug.on( 'destroy', function( done ) {
            console.log('App is about to be destroyed!')
            done();
        });

        // Grabbing saved asset, created in the dashboard
        enplug.assets.getNext().then(function( asset ) {
            console.log('Grabbing asset! Now going to start enplug player.')
            startPlayer();
        });

        function startPlayer() {
            enplug.appStatus.start().then(function() {
                console.log('Starting enplug player now!')
            })
        }


    })( enplug );
