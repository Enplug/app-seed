
import app from '../app';
import moment from 'moment';

export default class AssetService {

    constructor ( $enplugAccount, $q) {

        'ngInject';

        var feeds = [];

        function getNumberOfFeeds() {
            return feeds.length;
        }

        function newFeed(setDefaultValue) {
            return {
                id: '',
                title: '',
                url: "",
                venueIds: []
            };
        }

        function convertFeedToAsset (feed) {
            return {
                Id: feed.id,
                Created: feed.created,
                Value: {
                    title: feed.title,
                    url: feed.url
                },
                VenueIds: feed.venueIds
            };
        }

        function convertAssetToFeed (asset) {
            let feed = newFeed();
            feed.id = asset.Id;
            feed.title = asset.Value.title;
            feed.venueIds = asset.VenueIds;
            feed.url = asset.Value.url;
            feed.created = moment(asset.Created).format('MMM DD, YYYY');
            return feed;
        }

         function loadFeeds(){
            feeds.length = 0;
            return $enplugAccount.getAssets().then(function (assets) {
                if(assets.length) {
                    for ( let asset of assets ) {
                        feeds.push( convertAssetToFeed(asset) );
                    }
                }
                return feeds;
            });
        }

        function loadFeed (id) {
            return $enplugAccount.getAssets().then(function (assets) {
                var feed = assets.filter(function (asset) { return asset.Id === id; })[0];
                feed = convertAssetToFeed(feed)
                return feed || $q.reject();
            });
        }

        function saveFeed (feed, showDialog) {
            var options = {
                successMessage: 'Updated Video Feed',
                showDeployDialog : showDialog
            }
            return $enplugAccount.saveAsset( convertFeedToAsset(feed) , options);
        }

        function deleteById (id) {
           for ( var i=0,l=feeds.length; i<l; i++ ) {
               let feed = feeds[i];
               if ( feed.id == id ) {
                   feeds.splice(i, 1);
                   break;
               }
           }
           return $enplugAccount.deleteAsset(id);
       }

        return {

            newFeed :  newFeed,

            loadFeeds: loadFeeds,

            loadFeed: loadFeed,

            saveFeed: saveFeed,

            deleteById: deleteById,

            getNumberOfFeeds: getNumberOfFeeds
        }

    }

};

app.service( 'AssetService', AssetService );
