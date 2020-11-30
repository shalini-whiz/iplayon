 Meteor.methods( {
    'saveStreams':function(){
    	var fs = Npm.require('fs');
    	var j=timeZone.find({}).fetch();
        fs.writeFile("/home/vinayashreer/timeZoneJSON", JSON.stringify(j), function(err) {
        	if(err) {
        	}
        }); 
    },
    "tweet":function(){
		var Twit = require('twit')
        var conf = {
            "consumer": {
                "key": "NNJclhBmg8kV64YJtpP83oNCj",
                "secret": "6PqbWg9G3j8xtIPCDaFkUnfVZAtboIpoUtztMnbnXXuVDbEim0"
            },
            "access_token": {
                "key": "829268108774932482-WOCC0EVp09TfaASOPjRgLo3z3kA5xd0",
                "secret": "UdgNffjUWV8p953f1fukyphtO4AZvVVjXIORsxoQTlpNg"
            },
            "hashtag": "#iplayonArra"
        };

        var findTweetCode = customCollection.findOne({"data3":"tweetKeys"});

        if(findTweetCode&&findTweetCode.consumer_key&&findTweetCode.consumer_secret&&findTweetCode.access_token_key&&findTweetCode.access_token_secret){
            conf.consumer.key = findTweetCode.consumer_key;
            conf.consumer.secret = findTweetCode.consumer_secret;
            conf.access_token.key = findTweetCode.access_token_key;
            conf.access_token.secret = findTweetCode.access_token_secret;
        }

		var twit = new Twit({
		    consumer_key: conf.consumer.key,
		    consumer_secret: conf.consumer.secret,
		    access_token: conf.access_token.key,
			access_token_secret: conf.access_token.secret,
			timeout_ms: 60*1000, 
		});

		var stream = twit.stream('statuses/filter', { track: '#mango', language: 'en' })

        stream.on('tweet', function (tweet) {
        })
    }
});

Meteor.publish('tweetDetails', function() {
    var lData = Tweet.find({});
    if (lData) {
        return lData;
    }
    return this.ready();
});