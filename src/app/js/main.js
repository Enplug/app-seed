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
        // Asset's Video Id;
        let assetVideoId;
        // Timeout id for buffering. Cleared when video begins playing.
        let bufferTimeoutId;
        // Duration of timeout before finished is called if a video is buffering.
        let bufferTime = 15000;
        // Variable to check if the app is first loading
        let initalLoad = true;
        // Iframe container
        let iframe = document.querySelector('.iframe-container ');
        // Variable to check if youtube player started up
        let playerStarted = false;

         /*************************
         * YouTube Player Methods
         **************************/

        //  Function to initialize Youtube player and methods. Function invoked once enplug.assets.getNext() promise is resolved
        function initializePlayer() {
            // Assigning player to new instance of YouTube player
            player = YT('player', {
    			playerVars: {
    				controls: 0,
    				rel: 0,
    				showinfo: 0
    			}
    		});

            // Callback invoked when the player is ready
            player.on('ready', function(event) {
                console.log('YouTube Player is ready.');

                enplug.appStatus.start().then(function() {
                    console.log("Starting video. Video id: " + assetVideoId);
                    // Method setCanInterrupt prevents video from being interrupted from another enplug app or asset playing
                    enplug.appStatus.setCanInterrupt(false);
                    // Loading and playing video by id
                    player.loadVideoById(assetVideoId);

                    setTimeout(function() {
                        if (!playerStarted) {
                            console.log("Video never started. Calling finish.");
                            setToFinish();
                        }
                    }, bufferTime)
                })
            })

            player.on('error', function(event) {
                console.log("There is an error with the video. Error code: " + event.data);
                setToFinish();
            });

            // Callback invoked on 'stateChange'. Stopping player and calling playVideo function to play next video
            player.on('stateChange', function(event) {

                    playerStarted = true;

                    let playerStates = {
                        0: ended,
                        1: playing,
                        3: buffering
                    }
                    // If event exists in stageChange obj (doesn't return undefined), invokes that function
                    if (playerStates[event.data]) {
                        playerStates[event.data]();
                    } else {
                        console.log("Received unhandled state change " + event.data)
                    }
            });

        }

        function playing() {
            clearTimeout(bufferTimeoutId)
            console.log('Video is playing. Clearing timeout id for buffering. Timeout id: ' + bufferTimeoutId)
        }

        function buffering() {
            console.log('Video is buffering.')
            bufferTimeoutId = setTimeout(function() {
                console.log("Video has buffered for too long. Ending video early.");
                setToFinish();
            }, bufferTime)
        }

        function ended() {
            console.log('Video has finished playing.')
            setToFinish();
        }

        /******************
        * Player SDK - Methods
        ******************/

        // Listening for a 'destroy` event from the server
        enplug.on( 'destroy', function( done ) {
            done();
        });

        /***********************************
        * Player SDK - Asset Related Functions
        ************************************/

        // Function calling `enplug.appStatus.hide()`, letting the server know the video has finished playing
        function setToFinish() {
            enplug.appStatus.setCanInterrupt(true);
            enplug.appStatus.hide();
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
        // Function to grab next asset
        (function(){
            enplug.assets.getNext().then(function( asset ) {
            assetVideoId = extractUrlId(asset.url);
            initializePlayer();
            });
        })();


    })( enplug, YT );
