import '../sass/app.scss';
import enplug from '@enplug/player-sdk';
import logger from './loggerConsole';

(function( enplug ) {

        'use strict';

        // Player SDK - Methods

        // Listening for a 'destroy` event from the server
        enplug.on( 'destroy', function( done ) {
            console.log('App is about to be destroyed!')
            done();
        });

        // Grabbing saved asset, created in the dashboard
        function initalize() {
            enplug.assets.getNext().then(function( asset ) {
                console.log('Grabbing asset: ' +  JSON.stringify(asset) + '. Now going to start enplug player!')
                startPlayer();
            });
        }
        // Starting Enplug Player 
        function startPlayer() {
            enplug.appStatus.start().then(function() {
                console.log('Starting enplug player now!')
            })
        }
        // Function calling `enplug.appStatus.hide() on error
        function error() {
            return enplug.appStatus.hide();
        }


    })( enplug );
