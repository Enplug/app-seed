import '../sass/app.scss';
import enplug from '@enplug/player-sdk';
import logger from './loggerConsole';

(function( enplug ) {

        'use strict';

        /********************
         Player SDK - Methods
        *********************/

        console.log('Main.js has been initalized')

        // Function calling `enplug.appStatus.hide() on error
        function hideOnError() {
            return enplug.appStatus.hide();
        }

        function startPlayer() {
            enplug.appStatus.start().then(function() {
                console.log('Starting enplug player now!')
            })
        }
        // Listening for a 'destroy` event from the server
        enplug.on( 'destroy', function( done ) {
            console.log('App is about to be destroyed!')
            done();
        });

        // Grabbing saved asset, created in the dashboard
        enplug.assets.getNext().then(function( asset ) {
            console.log('Grabbing asset: ' +  JSON.stringify(asset) + '. Now going to start enplug player!')
            startPlayer();
        });



    })( enplug );
