import '../sass/app.scss';
import enplug from '@enplug/player-sdk';
import YT from 'youtube-player';

(function( enplug, YT ) {

        'use strict';

        /*************************
        * Player Variables
         **************************/

        // Variable assigned to instance of YouTube player
        let player;
        // Video id from asset's url;
        let assetVideoId;
        // Timeout id for buffering. Cleared when video begins playing.
        let bufferTimeoutId;
        // Duration of timeout before hide is called if a video is buffering. Default set to 60 seconds.
        let bufferTime = 60000;

         /*************************
         * YouTube Player Methods
         **************************/

        // Assigning player to new instance of YouTube player
        player = YT('player');

        // Callback invoked when the player is ready
        player.on('ready', function(event) {
            cueVideo();
        })

        player.on('error', function(event) {
            hideCurrentState();
        });

        // Callback invoked on 'stateChange'. Stopping player and calling playVideo function to play next video
        player.on('stateChange', function(event) {

                let playerStates = {
                    0: ended,
                    1: playing,
                    3: buffering,
                    5: playCued
                }
                // If event exists in stageChange obj (doesn't return undefined), invokes that function
                if(playerStates[event.data]) {
                    playerStates[event.data]();
                }
        });

        function playing() {
            clearTimeout(bufferTimeoutId)
        }

        function buffering() {
            bufferTimeoutId = setTimeout(function() {
                hideCurrentState();
            }, bufferTime)
        }

        function ended() {
             enplug.appStatus.setCanInterrupt(true);
             // Function letting server know that video is finished playing
             hideCurrentState().then(function() {
                 console.log('Calling Hide Promise Resolved!')
             });
        }

        function cueVideo() {
            player.cueVideoById(assetVideoId).then(function() {
                getNextAsset();
            })
        }

        // Checking rotationIndex value and calling loadVideoById
        function playCued() {
            // Setting canSetInterrupt to false. Prevents other apps being deployed from interrupting video
            enplug.appStatus.setCanInterrupt(false);
            // Calling appStatus.start() to start application & render on player
            enplug.appStatus.start().then(function() {
                enplug.notifications.post('Starting Player..')
                // Loading player to play next asset video
                player.playVideo().then(function(event) {
                    console.log('Starting playing video with the id: ' + assetVideoId + '!')
                });
            })
        }

        /*****************
        * Player SDK - Methods
        ****************/

        // Listening for a 'destroy` event from the server
        enplug.on( 'destroy', function( done ) {
            console.log('App is about to be destroyed!')
            done();
        });
        /***********************************
        * Player SDK - Functions
        ************************************/

        // Function calling `enplug.appStatus.hide()`, letting the server know the video has finished playing
        function hideCurrentState() {
            return enplug.appStatus.hide();
        }

        // Matching RegExp patterns to url & extracting the id of the YouTube video if it's a match. Otherwise, the function will return null and a video will not be shown.
        function extractUrlId(url) {
            if ( (/be\//).test(url)) {
                return url.split(/be\//)[1];
            } else if((/v=/).test(url)) {
                return url.split(/v=/)[1];
            } else if((/\embed\//).test(url)) {
                return url.split(/\embed\//)[1];
            } else {
                return null
            }
        }

        // Grabbing Next Asset for any deployed to the Device
        function getNextAsset() {
            enplug.assets.getNext().then(function( asset ) {
                console.log('Resolved promise for getNext :   ', asset)
                assetVideoId = extractUrlId(asset.url);
            });
        }

        // Immediately invoked to getAsset
        getNextAsset();


    })( enplug, YT );
