import '../sass/app.scss';
import enplug from '@enplug/player-sdk';

(function( enplug ) {

        'use strict';

        /*********************
         Player SDK - Methods
        *********************/

        function startPlayer() {
           enplug.appStatus.start().then(function() {
               console.log('starting enplug player now!')
           })
        }
        // Function calling `enplug.appStatus.hide() on error
        function hideOnError() {
            return enplug.appStatus.hide();
        }

        function loadImage(src) {
            return new Promise(function(resolve, reject) {

                var image = new Image ();
                document.body.appendChild(image);

                image.onload = function(){
                    resolve({src, status: 'ok'});
                }

                image.onerror = function(){
                    reject({src, status: 'error'})
                }

                image.src = src;
            })
        }

        function displayContent() {

            var url = currentAsset.url;

            loadImage(url).then(function(res){
                startPlayer();
            }, function(error) {
                hideOnError();
            })
        }

        // Listening for a 'destroy` event from the server
        enplug.on( 'destroy', function( done ) {
            console.log('App is about to be destroyed!')
            done();
        });

        // Grabbing saved asset, created in the dashboard
        enplug.assets.getNext().then(function( asset ) {
            currentAsset = asset;
            displayContent();
        });


    })( enplug );
