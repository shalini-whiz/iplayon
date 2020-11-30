var startup = (new Date()).getTime();
TweetStream = new Meteor.Stream('tweets');

TweetStream.on('tweetEMIT', function(tweet) {
    try{
    var findTweets = TweetsMINI.findOne({}, {
        sort: {
            "_id": 1
        },
        limit: 1
    });
    var findAllTweets = TweetsMINI.find({}).fetch();
    if (findAllTweets.length == 10) {
        TweetsMINI.remove({
            "_id": findTweets._id
        });
    }
    tweet.data.created_at = moment(new Date(tweet.data.created_at)).toDate();
    tweet.data._id = tweet.data.id_str;
    TweetsMINI.insert(tweet.data);
    }
    catch(e){
    }
});

var someMessages = new Meteor.Collection("messages");
Template.tweets.helpers({
    tweets: function() {
        var miniMongoTweets = TweetsMINI.find({}, {
            sort: {
                created_at: -1
            }
        }).fetch()
        return miniMongoTweets;
    }
})

Template.tweets.onCreated(function() {
    if(Meteor.userId()){
    this.subscribe("tweetDetails")
    Meteor.subscribe("checkDataStream")
    Deps.autorun(function() {
        var message = someMessages.find({}).fetch().forEach(function(tweet, i) {
            tweet._id = tweet.id_str;
            var savedTweet = TweetsMINI.findOne({"_id":tweet._id});
            if(savedTweet==undefined){
                tweet.created_at = moment(new Date(tweet.created_at)).toDate();
                TweetsMINI.insert(tweet)
            }
        });
        if (message) {
        } // prints This is not from a database
    });
    }
});

Template.registerHelper('moments', function(date) {
    return moment(new Date(date)).format('HH:mm:ss');
});

Template.registerHelper('linkify', function(tweet) {
    var out = tweet.text;
    out = out.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
        var tweetText = url;
        if (tweet.entities.urls !== undefined && tweet.entities.urls.length > 0) {
            var myUrl = _.find(tweet.entities.urls, function(urlObj) {
                return urlObj.url === url;
            });
            if (myUrl !== undefined && myUrl !== null) {
                tweetText = myUrl.display_url;
            }
        }
        return tweetText.link(url);
    });
    out = out.replace(/[#]+[A-Za-z0-9-_]+/g, function(hash) {
        txt = hash.replace("#", "");
        return hash.link("http://twitter.com/search/%23" + txt);
    });
    out = out.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
        var username = u.replace("@", "")
        return u.link("http://twitter.com/" + username);
    });
    return out;
});