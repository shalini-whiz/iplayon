export const testSearch = new Meteor.Collection('testSearch');
export const titleize = require('titleize');
import {playerDBFind} from './methods/dbRequiredRole.js'
//userDetailsTTUsed

import {teamMatchCollectionDB} from './publications/MatchCollectionDbTeam.js';
import {MatchCollectionDB} from './publications/MatchCollectionDb.js';
var FitbitApiClient = require("fitbit-node");
export const  fitBitClient = new FitbitApiClient({
    clientId: "22DJHK",
    clientSecret: "700979991c22b992907929834cc232a4",
    apiVersion: '1.2' // 1.2 is the default
});
//iPlayONPW!

if (Meteor.isServer) 
{

    
    Meteor.publish('testSearch', function testSearchPPUB() {
        var list = testSearch.find({});
        return list;
    });

    

}







/******** instagram integration *******************/
/*
var Instagram = require('node-instagram').default;
var instagram = new Instagram({
  clientId: 'bf1d276e0ed447bfa419f70d6bfadb16',
  clientSecret: '7129b4e8561442b790e6afc6f4c07ed9',
  accessToken: '7879480479.bf1d276.0055869aaf804313b85d82698f4ee1f3',
});

instagram.get('users/self', (err, data) => {
  if (err) {
  } else {
  }
});
*/


var graph = Npm.require('fbgraph');
//var FB = require('fb').default;


var Fiber = Npm.require('fibers');
var Twitter = Meteor.npmRequire("twitter");
var TweetStream = new Meteor.Stream('tweets');

var FB = require('fb');

var accessTokenPage = "EAACEdEose0cBAGifxK0KrhAGbStPPyLHLY3cece6nJQor5skKwI1gA6kFZCJ0OSeTBCDrZBifB5ofLChy9FStDCeKZAVoO3ZBZAexSZByVqQLU2JHbpFtLYDdv1oFP30CQBtfzqs0FwXGMV4nZBw0obZC3kqSDZCtM3e6CaO6VkshQAlVxX2wLo1ZB9vPCIR2NR9RZAXTBSbT1LX0HtGNnoHPN7";
var pageID = "1708705139221306";

var linkedinAccessToken = "--j-nMgyJ5fT1Cec8OcBxPH6cDSPhP29oyZIv-twH-6xWdlcbRgVxqpYHD0cbIsBnGBPImD4NdxiSBhBdIrSLt1GOByi9eGNMI4RD35fmdLX6HKC31JyeF6v94tdLs5CoZVpYLaqXN396QfOQzEXfkV59TiV7T8gdlIHvjF48f5OHtTd6jyVU7T7fyRQGjj4IunReEzKd9K5qwx4Av7hubva546S_-cU0QzYyIJUuLZ4QAsAYmZemjSpcUKXdu5b9PzaHsJLHtBeHPbPKw";

var Linkedin = require('node-linkedin')('81xq682u1wvwhu', 'DdCJRyX2sSj9Npfv');



var fb_conf = {
    client_id:      '163472494505547', 
    client_secret:  '283ac8689b0964b0d1e81dddc89c6481',
    'default_graph_version' : 'v2.2',
    scope:          'email, user_about_me,user_posts,publish_pages,manage_pages',
   redirect_uri:   'http://www.iplayon.in/iplayonHome'
};

FB.options({version: 'v2.4'});
FB.options({timeout: 1000, 
    scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
    accessToken:accessTokenPage
}); 





var conf = {
    "consumer": {
        "key": "",
        "secret": ""
    },
    "access_token": {
        "key": "",
        "secret": ""
    },
    "hashtag": "#iplayonArra"
};

var twit ;

try{
var findTweetCode = customCollection.findOne({"data3":"tweetKeys"});

if(findTweetCode&&findTweetCode.consumer_key&&findTweetCode.consumer_secret&&findTweetCode.access_token_key&&findTweetCode.access_token_secret){
    conf.consumer.key = findTweetCode.consumer_key;
    conf.consumer.secret = findTweetCode.consumer_secret;
    conf.access_token.key = findTweetCode.access_token_key;
    conf.access_token.secret = findTweetCode.access_token_secret;
    twit = new Twitter({
    consumer_key: conf.consumer.key,
    consumer_secret: conf.consumer.secret,
    access_token_key: conf.access_token.key,
    access_token_secret: conf.access_token.secret,
});

}
}catch(e){
};



Meteor.methods({
        "postTweet_NEW": function() {
            var Twit = require('twit')
            var twit = new Twit({
                consumer_key: conf.consumer.key,
                consumer_secret: conf.consumer.secret,
                access_token: conf.access_token.key,
                access_token_secret: conf.access_token.secret,
                timeout_ms: 60 * 1000,
            });
            twit.post('statuses/retweet/:id', {
                id: '826287402788360192',
                status: "nv mbcnmncv"
            }, function(err, data, response) {
                
            })
        }
    })
    //var conf = JSON.parse(Assets.getText('twitter.json'));

Meteor.methods({
    "postTweet": function(valueText, file1, file2, file3, file4) {
        var Twit = require('twit')
        var twit = new Twit({
            consumer_key: conf.consumer.key,
            consumer_secret: conf.consumer.secret,
            access_token: conf.access_token.key,
            access_token_secret: conf.access_token.secret,
            timeout_ms: 60 * 1000,
        });
        if (file1 == undefined && file2 == undefined && file3 == undefined && file4 == undefined) {
            var s = twit.post('statuses/update', {
                status: valueText
            }, function(err, data, response) {
            });
        } else {
            var mediaIdStr1;
            var mediaIdStr2;
            var mediaIdStr3;
            var mediaIdStr4;

            if (file1 != undefined) {
                twit.post('media/upload', {
                    media_data: file1.split(',')[1]
                }, function(err, data, response) {
                    mediaIdStr1 = data.media_id_string
                });
            }
            if (file2 != undefined) {
                twit.post('media/upload', {
                    media_data: file2.split(',')[1]
                }, function(err, data, response) {
                    mediaIdStr2 = data.media_id_string
                });
            }
            if (file3 != undefined) {
                twit.post('media/upload', {
                    media_data: file3.split(',')[1]
                }, function(err, data, response) {
                    mediaIdStr3 = data.media_id_string
                });
            }
            if (file4 != undefined) {
                twit.post('media/upload', {
                    media_data: file4.split(',')[1]
                }, function(err, data, response) {
                    mediaIdStr4 = data.media_id_string
                });
            }

            if (file1 == undefined) {
                if (file2 != undefined) {
                    file1 = file2
                } else if (file3 != undefined) {
                    file1 = file3
                } else if (file4 != undefined) {
                    file1 = file4
                }
            }

            twit.post('media/upload', {
                media_data: file1.split(',')[1]
            }, function(err, data, response) {
                var mediaIdStr = data.media_id_string
                var altText = "#iplayonArra"
                var meta_params = {
                    media_id: mediaIdStr,
                    alt_text: {
                        text: altText
                    }
                }
                twit.post('media/metadata/create', meta_params, function(err, data, response) {
                    var params = {
                        status: valueText,
                        media_ids: [mediaIdStr1, mediaIdStr2, mediaIdStr3, mediaIdStr4]
                    }
                    twit.post('statuses/update', params, function(err, data, response) {})
                });
            });
        }
        /*var fs = Npm.require('fs');
        var b64content = fs.readFileSync('/home/vinayashree/ipGITJJ2/iPlayOn_Base/public/logo.png', { encoding: 'base64' })
        var b64content2 = fs.readFileSync('/home/vinayashree/vinayashree/Screenshot.png', { encoding: 'base64' })
        var mediaIdStr2;
        var b64content3 = fs.readFileSync('/home/vinayashree/vinayashree/Screenshot.png', { encoding: 'base64' })
        var mediaIdStr3;
        var b64content4 = fs.readFileSync('/home/vinayashree/vinayashree/Screenshot.png', { encoding: 'base64' })
        var mediaIdStr4;
        var b64content5 = fs.readFileSync('/home/vinayashree/vinayashree/Screenshot.png', { encoding: 'base64' })
        var mediaIdStr5;
        /*twit.post('media/upload', { media_data: b64content2 }, function (err, data, response) {
            mediaIdStr2 = data.media_id_string
        });

        /*twit.post('media/upload', { media_data: b64content3 }, function (err, data, response) {
            mediaIdStr3 = data.media_id_string
        });

        twit.post('media/upload', { media_data: b64content4 }, function (err, data, response) {
            mediaIdStr4 = data.media_id_string
        });

        twit.post('media/upload', { media_data: b64content5 }, function (err, data, response) {
            mediaIdStr5 = data.media_id_string
        });
        // first we must post the media to Twitter
        twit.post('media/upload', { media_data: value2.split(',')[1]}, function (err, data, response) {
          // now we can assign alt text to the media, for use by screen readers and
          // other text-based presentations and interpreters
          var mediaIdStr = data.media_id_string
          var altText = "Test IMAGE #meteor"
          var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

          twit.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
              // now we can reference the media and post a tweet (media will attach to the tweet)
              var params = { status: 'Test IMAGE2 #meteor', media_ids: [mediaIdStr] }

              twit.post('statuses/update', params, function (err, data, response) {
              })
            }
          })
        })
        */
        // return s
    }
});


Meteor.methods({
    "twitterHashTagsINSERT": function(xData) {
        try {
            var findfetch = twitterHashTags.findOne({ "selectedSport" :xData.selectedSport, "entityName" : xData.entityName});
            if(findfetch==undefined){
                twitterHashTags.insert(
                    xData
                );
            }
            else{
                 twitterHashTags.update({
                "_id":findfetch._id
                }, {
                    $set: xData
                });
            }
            return true
        } catch (e) {
        }
    }
});

Meteor.methods({
    "twitterHashTagsUPDATE": function(xData, id) {
        try {
            twitterHashTags.update({
                "_id": id
            }, {
                $set: xData
            });
            return true
        } catch (e) {
        }
    }
});

Meteor.methods({
    "insertCustomHashTAgs": function(xData) {
        try {
            var findDetails = allHashTags.findOne({
                "entityName": xData.entityName,
                "selectedSport": xData.selectedSport
            });
            if (findDetails) {
                var savedTagsARR = [];
                if (findDetails.savedTags) {
                    findDetails.savedTags.push(xData.savedTags)
                }
                
                allHashTags.update({
                    entityName: xData.entityName,
                    selectedSport: xData.selectedSport
                }, {
                    $set: {
                        selectedRole: xData.selectedRole,
                        selectedSport: xData.selectedSport,
                        entityName: xData.entityName,
                        savedTags: findDetails.savedTags
                    }
                })
            } else {
                var savedTagsARR = [];
                savedTagsARR.push(xData.savedTags)
                allHashTags.insert({
                    selectedRole: xData.selectedRole,
                    selectedSport: xData.selectedSport,
                    entityName: xData.entityName,
                    savedTags: savedTagsARR
                })
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    "getNAmeOFEntity": function(role, id) {
        try{
        if (role && id) {
            var s = Meteor.users.findOne({
                userId: id
            });
            if (s && s.userName) {
                return s.userName.trim().substring(0, 10) + ".. "
            }
        }
        }catch(e){
        }
    }
})

Meteor.publish('twitterHashTags', function() {
    var lData = twitterHashTags.find({});
    if (lData) {
        return lData;
    }
    return this.ready();
});

Meteor.publish('allHashTags', function() {
    var lData = allHashTags.find({});
    if (lData) {
        return lData;
    }
    return this.ready();
});

Meteor.publish('autoTweetMessages', function() {
    var lData = autoTweetMessages.find({});
    if (lData) {
        return lData;
    }
    return this.ready();
})

Meteor.publish("checkDataStream", function() {
    try{
    if(this.userId){
    var streamdata = "fdgdfgdfg";
    var self = this;
    var conf = JSON.parse(Assets.getText('twitter.json'));
    var Fiber = Npm.require('fibers');
    var Twit = require('twit');
    var tagsToSearch = TagsForLoggedInPerson(this.userId);
    var tt = StreamTagsForLoggedInPerson(this.userId)
    var T = new Twit({
        consumer_key: conf.consumer.key,
        consumer_secret: conf.consumer.secret,
        access_token: conf.access_token.key,
        access_token_secret: conf.access_token.secret,
    });    
    //tagsToSearch.toString()
    T.get('search/tweets', {q:"#ipMaharashtra since:2017-01-01" ,count:200}, function(err, data, response) {
        if (data && data.statuses) {
            for (var i = 0; i <data.statuses.length; i++) {
                data.statuses[i].created_at = moment(new Date(data.statuses[i].created_at)).toDate();
                self.added("messages", data.statuses[i].id_str, data.statuses[i]);
            }
        }
    })

    self.ready();
}
}catch(e){
}
});

Meteor.methods({
    "tournamentCreateAutoTweet": function(autoTweet, xData) {
        try {
            if (autoTweet == true) {
                var eveOrg = xData.eventOrganizer;
                var sports = xData.projectId.toString();
                var startDate = xData.eventStartDate;
                var endDate = xData.eventEndDate;
                var eventName = xData.eventName;
                var ipHASHTAG;
                var customHashTagList = "";
                var entryOpen = moment(new Date()).format("YYYY MMM DD");
                var entryClosesOn = xData.eventSubscriptionLastDate;
                var message1;
                var message2;
                var message3;
                if (eveOrg) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    if (userFind && userFind.role && userFind.role == "Association" || userFind.role == "Academy" || userFind.role == "Organiser" || userFind.role == "Other") {
                        var HashTagsFind = twitterHashTags.findOne({
                            "selectedSport": sports,
                            "entityName": eveOrg.toString()
                        })
                        if (HashTagsFind && HashTagsFind.iphashTag) {
                            ipHASHTAG = HashTagsFind.iphashTag.trim();
                            customHashTagList = HashTagsFind.savedTags.join(" ");

                        }
                        var messFind = autoTweetMessages.findOne({
                            "typeOfEvent": "tournamentAnnouncement"
                        });
                        if (messFind && messFind.referWEB && messFind.message1 && messFind.referWEB) {
                            message1 = userFind.userName + " " + messFind.message1 + " " + "From" + " " + startDate + " " + "To " + endDate + " " + "(more)" + messFind.referWEB;
                            var customMessage = customHashTagList + " " +message1;

                            pushFeedIntoSocialSites(customMessage,customMessage,eveOrg);

                           
                        }
                        var messFind2 = autoTweetMessages.findOne({
                            "typeOfEvent": "entriesOpen"
                        });
                        if (messFind2 && messFind2.referWEB && messFind2.message1 && messFind2.referWEB) {
                            message2 = eventName + " " + messFind2.message1 + " " + entryOpen + " " + "(more)" + messFind2.referWEB;
                            var Twit = require('twit')
                            var twit = new Twit({
                                consumer_key: conf.consumer.key,
                                consumer_secret: conf.consumer.secret,
                                access_token: conf.access_token.key,
                                access_token_secret: conf.access_token.secret,
                            });
                            var customMessage = customHashTagList + " " +message2;
                            pushFeedIntoSocialSites(customMessage,customMessage,eveOrg);

                        
                           
                            /*
                            var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                            if(accessInfo)
                            {
                                if(accessInfo.pageToken){
                                    FB.options({timeout: 1000, 
                                        scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                        accessToken:accessInfo.pageToken
                                    }); 

                                    FB.api('me/feed', 'post', { message: customHashTagList + " " + message2 }, function (res) {
                                      if(!res || res.error) {
                                        return;
                                      }
                                    });
                                }

                                if(accessInfo.tweetKeys)
                                {
                                    twit = new Twit({
                                        consumer_key: accessInfo.tweetKeys.consumer_key,
                                        consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                        access_token: accessInfo.tweetKeys.access_token_key,
                                        access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                    });
                                }

                                if(accessInfo.linkedInKeys && 
                                    accessInfo.linkedInKeys.companyId &&
                                    accessInfo.linkedInKeys.accessToken)
                                {

                                    var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                    linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                        "comment": customHashTagList + " " + message2,          
                                        "visibility": { "code": "anyone" }
                                      }, function (err, share) {      
                                    });
                                }
                            }

                            var s2 = twit.post('statuses/update', {
                                status:customHashTagList + " " + message2
                            }, function(err, data, response) {
                                if (data.errors) {
                                    for (var i = 0; i < data.errors.length; i++)
                                        if (parseInt(data.errors[i].code) == 186) {
                                           
                                        }
                                }
                                
                            });*/

                        }
                        var messFind3 = autoTweetMessages.findOne({
                            "typeOfEvent": "entriesClose"
                        });
                        if (messFind3 && messFind3 && messFind3.referWEB && messFind3.message1 && messFind3.referWEB) {
                            message3 = eventName + " " + messFind3.message1 + " " + entryClosesOn + " " + "(more)" + messFind3.referWEB;
                            var Twit = require('twit')
                            var twit = new Twit({
                                consumer_key: conf.consumer.key,
                                consumer_secret: conf.consumer.secret,
                                access_token: conf.access_token.key,
                                access_token_secret: conf.access_token.secret,
                            });

                
                            var customMessage = customHashTagList + " " +message3;
                            pushFeedIntoSocialSites(customMessage,customMessage,eveOrg);


                            /*
                            var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                            if(accessInfo)
                            {
                                if(accessInfo.pageToken){
                                    FB.options({timeout: 1000, 
                                        scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                        accessToken:accessInfo.pageToken
                                    }); 

                                    FB.api('me/feed', 'post', { message: customHashTagList + " " + message3 }, function (res) {
                                      if(!res || res.error) {
                                        return;
                                      }
                                    });
                                }
                                if(accessInfo.tweetKeys)
                                {
                                    twit = new Twit({
                                        consumer_key: accessInfo.tweetKeys.consumer_key,
                                        consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                        access_token: accessInfo.tweetKeys.access_token_key,
                                        access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                    });
                                }

                                if(accessInfo.linkedInKeys && 
                                    accessInfo.linkedInKeys.companyId &&
                                    accessInfo.linkedInKeys.accessToken)
                                {

                                    var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                    linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                        "comment": customHashTagList + " " + message3,          
                                        "visibility": { "code": "anyone" }
                                      }, function (err, share) {      
                                    });
                                }
                            }

                            var s3 = twit.post('statuses/update', {
                                status:customHashTagList + " " + message3
                            }, function(err, data, response) {
                                if (data.errors) {
                                    for (var i = 0; i < data.errors.length; i++)
                                        if (parseInt(data.errors[i].code) == 186) {
                                            
                                        }
                                }
                                
                            });*/


                        }
                    }
                }
            }
        } catch (e) {
        }
    }
});


Meteor.methods({
    "tournamentModifyAutoTweet": function(autoTweet, xData) {
        try {
            if (autoTweet == true) {
                var eveOrg = xData.eventOrganizer;
                var sports = xData.projectId.toString();
                var startDate = xData.eventStartDate;
                var endDate = xData.eventEndDate;
                var eventName = xData.eventName;
                var ipHASHTAG;
                var customHashTagList = "";
                var entryOpen = moment(new Date()).format("YYYY MMM DD");
                var entryClosesOn = xData.eventSubscriptionLastDate;
                var message1;
                var message2;
                var message3;
                if (eveOrg) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    if (userFind && userFind.role && userFind.role == "Association" || userFind.role == "Academy" || userFind.role == "Organiser" || userFind.role == "Other") {
                        var HashTagsFind = twitterHashTags.findOne({
                            "selectedSport": sports,
                            "entityName": eveOrg.toString()
                        })
                        if (HashTagsFind && HashTagsFind.iphashTag) {
                            ipHASHTAG = HashTagsFind.iphashTag.trim();
                            customHashTagList = HashTagsFind.savedTags.join(" ");
                        }
                        var messFind = autoTweetMessages.findOne({
                            "typeOfEvent": "tournamentModification"
                        });
                        if (messFind && messFind.referWEB && messFind.message1 && messFind.referWEB) 
                        {
                            message1 = eventName + " " + messFind.message1 + " by" + " " + userFind.userName+" on "+new Date()+ " (more)" + messFind.referWEB;
                            
                            var customMessage = customHashTagList + " " +message3;
                            pushFeedIntoSocialSites(customMessage,customMessage,eveOrg);

                            /*
                            var Twit = require('twit')
                            var twit = new Twit({
                                consumer_key: conf.consumer.key,
                                consumer_secret: conf.consumer.secret,
                                access_token: conf.access_token.key,
                                access_token_secret: conf.access_token.secret,
                            });
                         

                            var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                            if(accessInfo)
                            {
                                if(accessInfo.pageToken)
                                {
                                    FB.options({timeout: 1000, 
                                        scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                        accessToken:accessInfo.pageToken
                                    }); 

                                    FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                      if(!res || res.error) {
                                        return;
                                      }
                                    });
                                }
                                if(accessInfo.tweetKeys)
                                {
                                    twit = new Twit({
                                        consumer_key: accessInfo.tweetKeys.consumer_key,
                                        consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                        access_token: accessInfo.tweetKeys.access_token_key,
                                        access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                    });
                                }

                                if(accessInfo.linkedInKeys && 
                                    accessInfo.linkedInKeys.companyId &&
                                    accessInfo.linkedInKeys.accessToken)
                                {

                                    var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                    linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                        "comment": customHashTagList + " " + message1,          
                                        "visibility": { "code": "anyone" }
                                      }, function (err, share) {      
                                    });
                                }
                              
                               
                            }

                            var s = twit.post('statuses/update', {
                                status: customHashTagList + " " + message1
                            }, function(err, data, response) {
                                if (data.errors) {
                                    for (var i = 0; i < data.errors.length; i++){
                                        if (parseInt(data.errors[i].code) == 187) {
                                            
                                        }
                                        if(parseInt(data.errors[i].code) == 187){
                                            twit.post('statuses/destroy/:id', { id: '343360866131001345' }, function (err, data, response) {
                                            })
                                        }
                                    }                                   
                                }
                                
                            });

                            */

                           
                        }
                    }
                }
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    "drawsCreatedAutoTweet": function(autoTweet, tournament, eventN) {

        try {
            if (autoTweet == true) {
                var tournNAme;
                var eventABBName;
                var eventFindTourn = events.findOne({
                    "_id": tournament.trim()
                });
                var message1;
                var message2;
                var message3;
                var eveOrg;
                var ipHASHTAG;
                var customHashTagList = "";
                var sports;
                if (eventFindTourn && eventFindTourn.eventName) {
                    tournNAme = eventFindTourn.eventName
                    eveOrg = eventFindTourn.eventOrganizer
                    sports = eventFindTourn.projectId.toString()
                }
                var eventFindEve = events.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (eventFindEve && eventFindEve.abbName) {
                    eventABBName = eventFindEve.abbName
                }
                if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    if (userFind && userFind.role && userFind.role == "Association" || userFind.role == "Academy" || userFind.role == "Organiser") {
                        var HashTagsFind = twitterHashTags.findOne({
                            "selectedSport": sports,
                            "entityName": eveOrg.toString()
                        })
                        if (HashTagsFind && HashTagsFind.iphashTag) {
                            ipHASHTAG = HashTagsFind.iphashTag.trim();
                            customHashTagList = HashTagsFind.savedTags.join(" ");
                        }
                        var messFind = autoTweetMessages.findOne({
                            "typeOfEvent": 'drawsCreated'
                        });
                        if (messFind && messFind.message1) {
                            message1 = messFind.message1 + ": " + tournNAme + ":" + eventABBName + " " + "(more)" + messFind.referWEB;;
                            

                            var customMessage = customHashTagList + " " +message1;
                            pushFeedIntoSocialSites(customMessage,customMessage,eveOrg);

                            /*
                            var Twit = require('twit')
                            var twit = new Twit({
                                consumer_key: conf.consumer.key,
                                consumer_secret: conf.consumer.secret,
                                access_token: conf.access_token.key,
                                access_token_secret: conf.access_token.secret,
                            });
                          

                            var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                            if(accessInfo)
                            {
                                if(accessInfo.pageToken){
                                    FB.options({timeout: 1000, 
                                        scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                        accessToken:accessInfo.pageToken
                                    }); 

                                    FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                      if(!res || res.error) {
                                        return;
                                      }
                                    });
                                }

                                if(accessInfo.tweetKeys)
                                {
                                    twit = new Twit({
                                        consumer_key: accessInfo.tweetKeys.consumer_key,
                                        consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                        access_token: accessInfo.tweetKeys.access_token_key,
                                        access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                    });
                                }

                                if(accessInfo.linkedInKeys && 
                                    accessInfo.linkedInKeys.companyId &&
                                    accessInfo.linkedInKeys.accessToken)
                                {

                                    var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                    linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                        "comment": customHashTagList + " " + message1,          
                                        "visibility": { "code": "anyone" }
                                      }, function (err, share) {      
                                    });
                                }
                            }

                            var s = twit.post('statuses/update', {
                                status: customHashTagList + " " + message1
                            }, function(err, data, response) {
                                if (data.errors) {
                                    for (var i = 0; i < data.errors.length; i++)
                                        if (parseInt(data.errors[i].code) == 186) {
                                            
                                        }
                                }
                                
                            });

                            */
                        }
                    }
                }
            }
        } catch (e) {
        }
    }
});


Meteor.methods({
    "matchCompletedAutoTweet": function(autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status) {
        try {
            var autoMessageKey = ""
            if (status == "Completed") {
                autoMessageKey = "matchCompleted"
            }
            if (status == "Bye") {
                autoMessageKey = "bye"
            }
            if (status == "Walkover") {
                autoMessageKey = "walkOver"
            }

            if (autoTweet == true && MatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                })) {
                var fetchwiner = MatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                var playerNAME = fetchwiner.matchRecords[parseInt(matchNo - 1)].winner;
                var tournNAme;
                var eventABBName;
                var eventFindTourn = events.findOne({
                    "_id": tournament.trim()
                });
                var message1;
                var message2;
                var message3;
                var eveOrg;
                var ipHASHTAG;
                var customHashTagList = "";
                var sports;
                if (eventFindTourn && eventFindTourn.eventName) {
                    tournNAme = eventFindTourn.eventName
                    eveOrg = eventFindTourn.eventOrganizer
                    sports = eventFindTourn.projectId.toString()
                }
                var eventFindEve = events.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (eventFindEve && eventFindEve.abbName) {
                    eventABBName = eventFindEve.abbName
                }
                if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    var HashTagsFind = twitterHashTags.findOne({
                        "selectedSport": sports,
                        "entityName": eveOrg.toString()
                    })
                    if (HashTagsFind && HashTagsFind.iphashTag) {
                        ipHASHTAG = HashTagsFind.iphashTag.trim();
                        customHashTagList = HashTagsFind.savedTags.join(" ");
                    }
                    var messFind = autoTweetMessages.findOne({
                        "typeOfEvent": autoMessageKey
                    });
                    if (messFind && messFind.message1) {
                        message1 = messFind.message1 + "\n" + tournNAme.substring(0, 4) + ".." + ":" + eventABBName + "\n" + "player:" + playerNAME.substring(0, 4) + ".." + "\n" + "round:" + roundNo + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                        
                        var mes = messFind.message1 + "\n" + tournNAme + ".." + ":" + eventABBName + "\n" + "player:" + playerNAME + ".." + "\n" + "round:" + roundNo + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                        var customMessage = customHashTagList + " " +message1;
                        var messageDesc = customHashTagList+" "+mes;
                        pushFeedIntoSocialSites(customMessage,messageDesc,eveOrg);

                        /*
                        var Twit = require('twit')
                        var twit = new Twit({
                            consumer_key: conf.consumer.key,
                            consumer_secret: conf.consumer.secret,
                            access_token: conf.access_token.key,
                            access_token_secret: conf.access_token.secret,
                        });
                       

                        var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                        if(accessInfo)
                        {
                            if(accessInfo.pageToken){
                                FB.options({timeout: 1000, 
                                    scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                    accessToken:accessInfo.pageToken
                                }); 

                                FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                    if(!res || res.error) {
                                        return;
                                    }
                                });
                            }
                            if(accessInfo.tweetKeys)
                            {
                                twit = new Twit({
                                    consumer_key: accessInfo.tweetKeys.consumer_key,
                                    consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                    access_token: accessInfo.tweetKeys.access_token_key,
                                    access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                });
                            }

                            if(accessInfo.linkedInKeys && 
                                accessInfo.linkedInKeys.companyId &&
                                accessInfo.linkedInKeys.accessToken)
                            {

                                var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                    "comment": customHashTagList + " " + message1,          
                                    "visibility": { "code": "anyone" }
                                    }, function (err, share) {      
                                });
                            }
                        }

                        var s = twit.post('statuses/update', {
                            status:customHashTagList + " " + message1
                        }, function(err, data, response) {
                            if (data.errors) {
                                for (var i = 0; i < data.errors.length; i++)
                                    if (parseInt(data.errors[i].code) == 186) {
                                    }
                            }
                        });
                        */
                    }
                }
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    "matchCompletedAutoTweetTeam": function(autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status) {
        try {
            var autoMessageKey = ""
            if (status.toLowerCase() == "completed") {
                autoMessageKey = "matchCompleted"
            }
            if (status.toLowerCase() == "bye") {
                autoMessageKey = "bye"
            }
            if (status.toLowerCase() == "walkover") {
                autoMessageKey = "walkOver"
            }

            if (autoTweet == true && teamMatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                })) {
                var fetchwiner = teamMatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                var playerNAME = fetchwiner.matchRecords[parseInt(matchNo - 1)].winner;
                var tournNAme;
                var eventABBName;
                var eventFindTourn = events.findOne({
                    "_id": tournament.trim()
                });
                var message1;
                var message2;
                var message3;
                var eveOrg;
                var ipHASHTAG;
                var customHashTagList = "";
                var sports;
                if (eventFindTourn && eventFindTourn.eventName) {
                    tournNAme = eventFindTourn.eventName
                    eveOrg = eventFindTourn.eventOrganizer
                    sports = eventFindTourn.projectId.toString()
                }
                var eventFindEve = events.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (eventFindEve && eventFindEve.abbName) {
                    eventABBName = eventFindEve.abbName
                }
                if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    var HashTagsFind = twitterHashTags.findOne({
                        "selectedSport": sports,
                        "entityName": eveOrg.toString()
                    })
                    if (HashTagsFind && HashTagsFind.iphashTag) {
                        ipHASHTAG = HashTagsFind.iphashTag.trim();
                        customHashTagList = HashTagsFind.savedTags.join(" ");
                    }
                    var messFind = autoTweetMessages.findOne({
                        "typeOfEvent": autoMessageKey
                    });
                    if (messFind && messFind.message1) {
                        message1 = messFind.message1 + "\n" + tournNAme.substring(0,4)+".."+ ":" + eventABBName + "\n" + "team:" + playerNAME.substring(0,4)+".." + "\n" + "round:" + roundNo + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                        var mes = messFind.message1 + "\n" + tournNAme+".."+ ":" + eventABBName + "\n" + "team:" + playerNAME+".." + "\n" + "round:" + roundNo + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;

                        var customMessage = customHashTagList + " " +message1;
                        var mesDesc = customHashTagList + " "+mes;
                        pushFeedIntoSocialSites(customMessage,mesDesc,eveOrg);

                        /*
                        var Twit = require('twit')
                        var twit = new Twit({
                            consumer_key: conf.consumer.key,
                            consumer_secret: conf.consumer.secret,
                            access_token: conf.access_token.key,
                            access_token_secret: conf.access_token.secret,
                        });
                       

                        var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                        if(accessInfo)
                        {
                            if(accessInfo.pageToken){
                                FB.options({timeout: 1000, 
                                    scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                    accessToken:accessInfo.pageToken
                                }); 

                                FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                    if(!res || res.error) {
                                        return;
                                    }
                                });
                            }
                            if(accessInfo.tweetKeys)
                            {
                                twit = new Twit({
                                    consumer_key: accessInfo.tweetKeys.consumer_key,
                                    consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                    access_token: accessInfo.tweetKeys.access_token_key,
                                    access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                });
                            }

                            if(accessInfo.linkedInKeys && 
                                accessInfo.linkedInKeys.companyId &&
                                accessInfo.linkedInKeys.accessToken)
                            {

                                var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                    "comment": customHashTagList + " " + message1,          
                                    "visibility": { "code": "anyone" }
                                    }, function (err, share) {      
                                });
                            }
                        }

                        var s = twit.post('statuses/update', {
                            status:customHashTagList + " " + message1
                        }, function(err, data, response) {
                            if (data.errors) {
                                for (var i = 0; i < data.errors.length; i++)
                                    if (parseInt(data.errors[i].code) == 186) {
                                    }
                            }
                        });*/
                    }
                }
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    "nextRoundDecidedForSingles": function(autoTweet, tournament, eventN, roundNo, matchNo) {
        try {
            var autoMessageKey = ""
            if (autoTweet == true) {
                var fetch = MatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (fetch && fetch  && fetch.matchRecords  && fetch.matchRecords[parseInt(matchNo - 1)].nextMatchNumber  && fetch.matchRecords[parseInt(matchNo)].roundNumber) {
                    var nextMatchNumber = fetch.matchRecords[parseInt(matchNo - 1)].nextMatchNumber;
                    var teamNAMEA = fetch.matchRecords[parseInt(nextMatchNumber - 1)].players.playerA;
                    var teamNAMEB = fetch.matchRecords[parseInt(nextMatchNumber - 1)].players.playerB;
                    matchNo = fetch.matchRecords[parseInt(nextMatchNumber - 1)].matchNumber
                    roundNo = fetch.matchRecords[parseInt(nextMatchNumber - 1)].roundNumber
                    var tournNAme;
                    var eventABBName;
                    var eventFindTourn = events.findOne({
                        "_id": tournament.trim()
                    });
                    var message1;
                    var message2;
                    var message3;
                    var eveOrg;
                    var ipHASHTAG;
                    var customHashTagList = "";
                    var sports;
                    if (eventFindTourn && eventFindTourn.eventName) {
                        tournNAme = eventFindTourn.eventName
                        eveOrg = eventFindTourn.eventOrganizer
                        sports = eventFindTourn.projectId.toString()
                    }
                    var eventFindEve = events.findOne({
                        "tournamentId": tournament,
                        eventName: eventN
                    });
                    if (eventFindEve && eventFindEve.abbName) {
                        eventABBName = eventFindEve.abbName
                    }
                    if (teamNAMEA && teamNAMEA.trim().length != 0 && (!teamNAMEB || teamNAMEB.trim().length == 0)) {
                        autoMessageKey = "nextRoundPlayerADecided"
                        teamNAMEA = "Player A:" + teamNAMEA.substring(0, 4) + ".."
                    }
                    if (teamNAMEB && teamNAMEB.trim().length != 0 && (!teamNAMEA || teamNAMEA.trim().length == 0)) {
                        autoMessageKey = "nextRoundPlayerBDecided"
                        teamNAMEB = "Player B:" + teamNAMEB.substring(0, 4) + ".."
                    }
                    if (teamNAMEA && teamNAMEA.trim().length != 0 && teamNAMEB && teamNAMEB.trim().length != 0) {
                        teamNAMEA = "Player A:" + teamNAMEA.substring(0, 4) + ".."
                        teamNAMEB = "Player B:" + teamNAMEB.substring(0, 4) + ".."
                        autoMessageKey = "nextRoundPlayersDecided"
                    }
                    if (autoMessageKey && autoMessageKey.length != 0) {
                        if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                            var userFind = Meteor.users.findOne({
                                userId: eveOrg
                            });
                            var HashTagsFind = twitterHashTags.findOne({
                                "selectedSport": sports,
                                "entityName": eveOrg.toString()
                            })
                            if (HashTagsFind && HashTagsFind.iphashTag) {
                                ipHASHTAG = HashTagsFind.iphashTag.trim();
                                customHashTagList = HashTagsFind.savedTags.join(" ");
                            }
                            var messFind = autoTweetMessages.findOne({
                                "typeOfEvent": autoMessageKey
                            });
                            if (messFind && messFind.message1) {
                                if (autoMessageKey == "nextRoundPlayersDecided") {
                                    message1 = messFind.message1 + " " + roundNo + "\n" + tournNAme + ":" + eventABBName + "\n" + teamNAMEA + "\n" + teamNAMEB + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                                } else if (autoMessageKey == "nextRoundPlayerBDecided") {
                                    message1 = messFind.message1 + " " + roundNo + "\n" + tournNAme + ":" + eventABBName + "\n" + teamNAMEB + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                                } else if (autoMessageKey == "nextRoundPlayerADecided") {
                                    message1 = messFind.message1 + " " + roundNo + "\n" + tournNAme + ":" + eventABBName + "\n" + teamNAMEA + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                                }

                                var customMessage = customHashTagList + " " +message1;
                                pushFeedIntoSocialSites(customMessage,customMessage,eveOrg);

                                /*
                                var Twit = require('twit')
                                var twit = new Twit({
                                    consumer_key: conf.consumer.key,
                                    consumer_secret: conf.consumer.secret,
                                    access_token: conf.access_token.key,
                                    access_token_secret: conf.access_token.secret,
                                });
                             

                                var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                                if(accessInfo)
                                {
                                    if(accessInfo.pageToken){
                                        FB.options({timeout: 1000, 
                                            scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                            accessToken:accessInfo.pageToken
                                        }); 

                                        FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                            if(!res || res.error) {
                                                return;
                                            }
                                        });
                                    }
                                    if(accessInfo.tweetKeys)
                                    {
                                        twit = new Twit({
                                            consumer_key: accessInfo.tweetKeys.consumer_key,
                                            consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                            access_token: accessInfo.tweetKeys.access_token_key,
                                            access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                        });
                                    }

                                    if(accessInfo.linkedInKeys && 
                                        accessInfo.linkedInKeys.companyId &&
                                        accessInfo.linkedInKeys.accessToken)
                                    {

                                        var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                        linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                            "comment": customHashTagList + " " + message1,          
                                            "visibility": { "code": "anyone" }
                                          }, function (err, share) {      
                                        });
                                    }
                                }

                                var s = twit.post('statuses/update', {
                                    status: customHashTagList + " " + message1
                                }, function(err, data, response) {
                                    if (data.errors) {
                                        for (var i = 0; i < data.errors.length; i++)
                                            if (parseInt(data.errors[i].code) == 186) {
                                            }
                                    }
                                });
                                */
                            }
                        }
                    }
                }
            }
        } catch (e) {
        }
    }
})

Meteor.methods({
    "nextRoundDecidedForTeam": function(autoTweet, tournament, eventN, roundNo, matchNo) {
        try {
            if (autoTweet == true) {
                var fetch = teamMatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (fetch && fetch  && fetch.matchRecords && fetch.matchRecords[parseInt(matchNo - 1)].nextMatchNumber && fetch.matchRecords[parseInt(matchNo)].roundNumber ) {
                    var nextMatchNumber = fetch.matchRecords[parseInt(matchNo - 1)].nextMatchNumber;
                    var teamNAMEA = fetch.matchRecords[parseInt(nextMatchNumber - 1)].teams.teamA;
                    var teamNAMEB = fetch.matchRecords[parseInt(nextMatchNumber - 1)].teams.teamB;
                    matchNo = fetch.matchRecords[parseInt(nextMatchNumber - 1)].matchNumber
                    roundNo = fetch.matchRecords[parseInt(nextMatchNumber - 1)].roundNumber
                    var tournNAme;
                    var eventABBName;
                    var eventFindTourn = events.findOne({
                        "_id": tournament.trim()
                    });
                    var message1;
                    var message2;
                    var message3;
                    var eveOrg;
                    var ipHASHTAG;
                    var customHashTagList = "";
                    var autoMessageKey = "";
                    var sports;
                    if (eventFindTourn && eventFindTourn.eventName) {
                        tournNAme = eventFindTourn.eventName
                        eveOrg = eventFindTourn.eventOrganizer
                        sports = eventFindTourn.projectId.toString()
                    }
                    var eventFindEve = events.findOne({
                        "tournamentId": tournament,
                        eventName: eventN
                    });
                    if (eventFindEve && eventFindEve.abbName) {
                        eventABBName = eventFindEve.abbName
                    }
                    if (teamNAMEA && teamNAMEA.trim().length != 0 && (!teamNAMEB || teamNAMEB.trim().length == 0)) {
                        autoMessageKey = "nextRoundTeamADecided"
                        teamNAMEA = "Team A:" + teamNAMEA.substring(0, 4) + ".."
                    }
                    if (teamNAMEB && teamNAMEB.trim().length != 0 && (!teamNAMEA || teamNAMEA.trim().length == 0)) {
                        autoMessageKey = "nextRoundTeamBDecided"
                        teamNAMEB = "Team B:" + teamNAMEB.substring(0, 4) + ".."
                    }
                    if (teamNAMEA && teamNAMEA.trim().length != 0 && teamNAMEB && teamNAMEB.trim().length != 0) {
                        teamNAMEA = "Team A:" + teamNAMEA.substring(0, 4) + ".."
                        teamNAMEB = "Team B:" + teamNAMEB.substring(0, 4) + ".."
                        autoMessageKey = "nextRoundTeamsDecided"
                    }
                    if (autoMessageKey && autoMessageKey.length != 0) {
                        if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                            var userFind = Meteor.users.findOne({
                                userId: eveOrg
                            });
                            var HashTagsFind = twitterHashTags.findOne({
                                "selectedSport": sports,
                                "entityName": eveOrg.toString()
                            })
                            if (HashTagsFind && HashTagsFind.iphashTag) {
                                ipHASHTAG = HashTagsFind.iphashTag.trim();
                                customHashTagList = HashTagsFind.savedTags.join(" ");
                            }
                            var messFind = autoTweetMessages.findOne({
                                "typeOfEvent": autoMessageKey
                            });
                            if (messFind && messFind.message1) {
                                if (autoMessageKey == "nextRoundTeamsDecided") {
                                    message1 = messFind.message1 + " " + roundNo + "\n" + tournNAme + ":" + eventABBName + "\n" + teamNAMEA + "\n" + teamNAMEB + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                                } else if (autoMessageKey == "nextRoundTeamBDecided") {
                                    message1 = messFind.message1 + " " + roundNo + "\n" + tournNAme + ":" + eventABBName + "\n" + teamNAMEB + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                                } else if (autoMessageKey == "nextRoundTeamADecided") {
                                    message1 = messFind.message1 + " " + roundNo + "\n" + tournNAme + ":" + eventABBName + "\n" + teamNAMEA + "\n" + "match:" + matchNo + " " + "(more)" + messFind.referWEB;;
                                }

                                var customMessage = customHashTagList + " " +message1;
                                pushFeedIntoSocialSites(customMessage,customMessage,eveOrg);

                                /*
                                var Twit = require('twit')
                                var twit = new Twit({
                                    consumer_key: conf.consumer.key,
                                    consumer_secret: conf.consumer.secret,
                                    access_token: conf.access_token.key,
                                    access_token_secret: conf.access_token.secret,
                                });
                              

                                var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                                if(accessInfo)
                                {
                                    if(accessInfo.pageToken)
                                    {
                                        FB.options({timeout: 1000, 
                                            scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                            accessToken:accessInfo.pageToken
                                        }); 

                                        FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                            if(!res || res.error) {
                                                return;
                                            }
                                        });
                                    }
                                    if(accessInfo.tweetKeys)
                                    {
                                        twit = new Twit({
                                            consumer_key: accessInfo.tweetKeys.consumer_key,
                                            consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                            access_token: accessInfo.tweetKeys.access_token_key,
                                            access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                        });
                                    }

                                    if(accessInfo.linkedInKeys && 
                                        accessInfo.linkedInKeys.companyId &&
                                        accessInfo.linkedInKeys.accessToken)
                                    {

                                        var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                        linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                            "comment": customHashTagList + " " + message1,          
                                            "visibility": { "code": "anyone" }
                                          }, function (err, share) {      
                                        });
                                    }
                                }

                                var s = twit.post('statuses/update', {
                                    status:customHashTagList + " " + message1
                                }, function(err, data, response) {
                                    if (data.errors) {
                                        for (var i = 0; i < data.errors.length; i++)
                                            if (parseInt(data.errors[i].code) == 186) {
                                               
                                            }
                                    }
                                  
                                });
                                */

                            }
                        }
                    }
                }
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    "mainRoundsCompletedTeam": function(maxRound, autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,thisRoundNumb) {
        try {
            var FqfpQFsF;
            var autoMessageKey = ""
            if (status.toLowerCase() == "completed") {
                autoMessageKey = "matchCompleted"
            }
            if (status.toLowerCase() == "bye") {
                autoMessageKey = "bye"
            }
            if (status.toLowerCase() == "walkover") {
                autoMessageKey = "walkOver"
            }
            if(parseInt(thisRoundNumb)==parseInt(maxRound)){
                FqfpQFsF = "Finals";
            }
            else if(parseInt(thisRoundNumb)==parseInt(maxRound-1)){
                FqfpQFsF = "Semis";
            }
            else if(parseInt(thisRoundNumb)==parseInt(maxRound-2)){
                FqfpQFsF = "Quarters";
            }
            else if(parseInt(thisRoundNumb)==parseInt(maxRound-3)){
                FqfpQFsF = "Pre-quarters"
            }
            else{
                FqfpQFsF = false
            }


            if (autoTweet == true&&FqfpQFsF!=false &&teamMatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                })) {
                var fetchwiner = teamMatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                var playerNAME = fetchwiner.matchRecords[parseInt(matchNo - 1)].winner.substring(0, 4) + "..";
                var tournNAme;
                var eventABBName;
                var eventFindTourn = events.findOne({
                    "_id": tournament.trim()
                });
                var message1;
                var message2;
                var message3;
                var eveOrg;
                var ipHASHTAG;
                var customHashTagList = "";
                var sports;
                if (eventFindTourn && eventFindTourn.eventName) {
                    tournNAme = eventFindTourn.eventName
                    eveOrg = eventFindTourn.eventOrganizer
                    sports = eventFindTourn.projectId.toString()
                }
                var eventFindEve = events.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (eventFindEve && eventFindEve.abbName) {
                    eventABBName = eventFindEve.abbName
                }
                if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    var HashTagsFind = twitterHashTags.findOne({
                        "selectedSport": sports,
                        "entityName": eveOrg.toString()
                    })
                    if (HashTagsFind && HashTagsFind.iphashTag) {
                        ipHASHTAG = HashTagsFind.iphashTag.trim();
                        customHashTagList = HashTagsFind.savedTags.join(" ");
                    }
                    var messFind = autoTweetMessages.findOne({
                        "typeOfEvent": autoMessageKey
                    });
                    if (messFind && messFind.message1) {
                        var typeOfRound = FqfpQFsF;
                        message1 = typeOfRound+"\n"+messFind.message1 + "\n" + tournNAme.substring(0, 4) + ".." + ":" + eventABBName + "\n" + "team:" + playerNAME + "\n"  + "(more)" + messFind.referWEB;;
                        var mes = typeOfRound+"\n"+messFind.message1 + "\n" + tournNAme + ".." + ":" + eventABBName + "\n" + "team:" + playerNAME + "\n"  + "(more)" + messFind.referWEB;;

                        var customMessage = customHashTagList + " " +message1;
                        var mesDesc = customHashTagList + " "+mes;

                        pushFeedIntoSocialSites(customMessage,mesDesc,eveOrg);

                        /*
                        var Twit = require('twit')
                        var twit = new Twit({
                            consumer_key: conf.consumer.key,
                            consumer_secret: conf.consumer.secret,
                            access_token: conf.access_token.key,
                            access_token_secret: conf.access_token.secret,
                        });
                       

                        
                        var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                        if(accessInfo)
                        {
                            if(accessInfo.pageToken){
                                FB.options({timeout: 1000, 
                                    scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                    accessToken:accessInfo.pageToken
                                }); 

                                FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                    if(!res || res.error) {
                                        return;
                                    }
                                });
                            }
                            if(accessInfo.tweetKeys)
                            {
                                twit = new Twit({
                                    consumer_key: accessInfo.tweetKeys.consumer_key,
                                    consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                    access_token: accessInfo.tweetKeys.access_token_key,
                                    access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                });
                            }

                            if(accessInfo.linkedInKeys && 
                                accessInfo.linkedInKeys.companyId &&
                                accessInfo.linkedInKeys.accessToken)
                            {

                                var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                    "comment": customHashTagList + " " + message1,          
                                    "visibility": { "code": "anyone" }
                                    }, function (err, share) {      
                                });
                            }   
                        }

                        var s = twit.post('statuses/update', {
                            status:  customHashTagList + " " + message1
                        }, function(err, data, response) {
                            if (data.errors) {
                                for (var i = 0; i < data.errors.length; i++)
                                    if (parseInt(data.errors[i].code) == 186) {
                                       
                                    }
                            }
                           
                        });
                        */
                    }
                }
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    "mainRoundsCompletedSingles": function(maxRound,autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,thisRoundNumb) {
        try {
            var FqfpQFsF;
            var autoMessageKey = ""
            if (status == "Completed") {
                autoMessageKey = "matchCompleted"
            }
            if (status == "Bye") {
                autoMessageKey = "bye"
            }
            if (status == "Walkover") {
                autoMessageKey = "walkOver"
            }
            if(parseInt(thisRoundNumb)==parseInt(maxRound)){
                FqfpQFsF = "Finals";
            }
            else if(parseInt(thisRoundNumb)==parseInt(maxRound-1)){
                FqfpQFsF = "Semis";
            }
            else if(parseInt(thisRoundNumb)==parseInt(maxRound-2)){
                FqfpQFsF = "Quarters";
            }
            else if(parseInt(thisRoundNumb)==parseInt(maxRound-3)){
                FqfpQFsF = "Pre-quarters"
            }
            else{
                FqfpQFsF = false
            }

            if (autoTweet == true&&FqfpQFsF!=false && MatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                })) {
                var fetchwiner = MatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                var playerNAME = fetchwiner.matchRecords[parseInt(matchNo - 1)].winner;
                var tournNAme;
                var eventABBName;
                var eventFindTourn = events.findOne({
                    "_id": tournament.trim()
                });
                var message1;
                var message2;
                var message3;
                var eveOrg;
                var ipHASHTAG;
                var customHashTagList = "";
                var sports;
                if (eventFindTourn && eventFindTourn.eventName) {
                    tournNAme = eventFindTourn.eventName
                    eveOrg = eventFindTourn.eventOrganizer
                    sports = eventFindTourn.projectId.toString()
                }
                var eventFindEve = events.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (eventFindEve && eventFindEve.abbName) {
                    eventABBName = eventFindEve.abbName
                }
                if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    var HashTagsFind = twitterHashTags.findOne({
                        "selectedSport": sports,
                        "entityName": eveOrg.toString()
                    })
                    if (HashTagsFind && HashTagsFind.iphashTag) {
                        ipHASHTAG = HashTagsFind.iphashTag.trim();
                        customHashTagList = HashTagsFind.savedTags.join(" ");
                    }
                    var messFind = autoTweetMessages.findOne({
                        "typeOfEvent": autoMessageKey
                    });
                    if (messFind && messFind.message1) {
                        var typeOfRound = FqfpQFsF;
                        message1 = typeOfRound+"\n"+messFind.message1 + "\n" + tournNAme.substring(0, 4)+".." + ":" + eventABBName + "\n" + "player:" + playerNAME.substring(0, 4)+".." + " " + "(more)" + messFind.referWEB;;
                        var mes = typeOfRound+"\n"+messFind.message1 + "\n" + tournNAme+".." + ":" + eventABBName + "\n" + "player:" + playerNAME+".." + " " + "(more)" + messFind.referWEB;;
                        
                        var customMessage = customHashTagList + " " +message1;
                        var mesDesc = customHashTagList + " "+mes;

                        pushFeedIntoSocialSites(customMessage,mesDesc,eveOrg);


                        /*
                        var Twit = require('twit')
                        var twit = new Twit({
                            consumer_key: conf.consumer.key,
                            consumer_secret: conf.consumer.secret,
                            access_token: conf.access_token.key,
                            access_token_secret: conf.access_token.secret,
                        });
                     

                        var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                        if(accessInfo)
                        {
                            if(accessInfo.pageToken){
                                FB.options({timeout: 1000, 
                                    scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                    accessToken:accessInfo.pageToken
                                }); 

                                FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                    if(!res || res.error) {
                                        return;
                                    }
                                });
                            }
                            if(accessInfo.tweetKeys){
                                twit = new Twit({
                                    consumer_key: accessInfo.tweetKeys.consumer_key,
                                    consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                    access_token: accessInfo.tweetKeys.access_token_key,
                                    access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                });
                            }

                            if(accessInfo.linkedInKeys && 
                                accessInfo.linkedInKeys.companyId &&
                                accessInfo.linkedInKeys.accessToken)
                            {

                                var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                    "comment": customHashTagList + " " + message1,          
                                    "visibility": { "code": "anyone" }
                                    }, function (err, share) {      
                                });
                            }
                        }
                        var s = twit.post('statuses/update', {
                            status:  customHashTagList + " " + message1
                        }, function(err, data, response) {
                            if (data.errors) {
                                for (var i = 0; i < data.errors.length; i++)
                                    if (parseInt(data.errors[i].code) == 186) {
                                        
                                    }
                            }
                        });
                        */
                    }
                }
            }
        } catch (e) {
        }
    }
});


//starts here 
Meteor.methods({
    "matchConlcudedTeam": function(autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status) {
        try {
            var autoMessageKey = ""
            if (status.toLowerCase() == "completed") {
                autoMessageKey = "matchCompleted"
            }
            if (status.toLowerCase() == "bye") {
                autoMessageKey = "bye"
            }
            if (status.toLowerCase() == "walkover") {
                autoMessageKey = "walkOver"
            }

            if (autoTweet == true && teamMatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                })) {
                var fetchwiner = teamMatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                var playerNAME = fetchwiner.matchRecords[parseInt(matchNo - 1)].winner;
                var tournNAme;
                var eventABBName;
                var eventFindTourn = events.findOne({
                    "_id": tournament.trim()
                });
                var message1;
                var message2;
                var message3;
                var eveOrg;
                var ipHASHTAG;
                var customHashTagList = "";
                var sports;
                if (eventFindTourn && eventFindTourn.eventName) {
                    tournNAme = eventFindTourn.eventName
                    eveOrg = eventFindTourn.eventOrganizer
                    sports = eventFindTourn.projectId.toString()
                }
                var eventFindEve = events.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (eventFindEve && eventFindEve.abbName) {
                    eventABBName = eventFindEve.abbName
                }
                if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    var HashTagsFind = twitterHashTags.findOne({
                        "selectedSport": sports,
                        "entityName": eveOrg.toString()
                    })
                    if (HashTagsFind && HashTagsFind.iphashTag) {
                        ipHASHTAG = HashTagsFind.iphashTag.trim();
                        customHashTagList = HashTagsFind.savedTags.join(" ");
                    }
                    var messFind = autoTweetMessages.findOne({
                        "typeOfEvent": autoMessageKey
                    });

                    if (messFind && messFind.message1) {
                        message1 = "Tournament Concluded"+"\n"+messFind.message1 + "\n" + tournNAme.substring(0,4)+".."+ ":" + eventABBName + "\n" + "team:" + playerNAME.substring(0,4)+".." +" "+ "(more)" + messFind.referWEB;;
                        var mes = "Tournament Concluded"+"\n"+messFind.message1 + "\n" + tournNAme+".."+ ":" + eventABBName + "\n" + "team:" + playerNAME+".." +" "+ "(more)" + messFind.referWEB;;
                        var customMessage = customHashTagList + " " +message1;
                        var mesDesc = customHashTagList + " "+mes;

                        pushFeedIntoSocialSites(customMessage,mesDesc,eveOrg);

                        /*
                        var Twit = require('twit')
                        var twit = new Twit({
                            consumer_key: conf.consumer.key,
                            consumer_secret: conf.consumer.secret,
                            access_token: conf.access_token.key,
                            access_token_secret: conf.access_token.secret,
                        });
                      

                        var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                        if(accessInfo)
                        {
                            if(accessInfo.pageToken)
                            {
                                FB.options({timeout: 1000, 
                                    scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                    accessToken:accessInfo.pageToken
                                }); 

                                FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                    if(!res || res.error) {
                                        return;
                                    }
                                });
                            }
                            if(accessInfo.tweetKeys)
                            {
                                twit = new Twit({
                                    consumer_key: accessInfo.tweetKeys.consumer_key,
                                    consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                    access_token: accessInfo.tweetKeys.access_token_key,
                                    access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                });
                            }

                            if(accessInfo.linkedInKeys && 
                                accessInfo.linkedInKeys.companyId &&
                                accessInfo.linkedInKeys.accessToken)
                            {

                                var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                    "comment": customHashTagList + " " + message1,          
                                    "visibility": { "code": "anyone" }
                                    }, function (err, share) {      
                                });
                            }
                        }

                        var s = twit.post('statuses/update', {
                            status:customHashTagList + " " + message1
                        }, function(err, data, response) {
                            if (data.errors) {
                                for (var i = 0; i < data.errors.length; i++)
                                    if (parseInt(data.errors[i].code) == 186) {
                                       
                                    }
                            }
                          
                        });

                        */


                    }
                }
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    "matchConcludedSingles": function(autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status) {
        try {
            var autoMessageKey = ""
            if (status.toLowerCase() == "completed") {
                autoMessageKey = "matchCompleted"
            }
            if (status.toLowerCase() == "bye") {
                autoMessageKey = "bye"
            }
            if (status.toLowerCase() == "walkover") {
                autoMessageKey = "walkOver"
            }

            if (autoTweet == true && MatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                })) {
                var fetchwiner = MatchCollectionDB.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                var playerNAME = fetchwiner.matchRecords[parseInt(matchNo - 1)].winner;
                var tournNAme;
                var eventABBName;
                var eventFindTourn = events.findOne({
                    "_id": tournament.trim()
                });
                var message1;
                var message2;
                var message3;
                var eveOrg;
                var ipHASHTAG;
                var customHashTagList = "";
                var sports;
                if (eventFindTourn && eventFindTourn.eventName) {
                    tournNAme = eventFindTourn.eventName
                    eveOrg = eventFindTourn.eventOrganizer
                    sports = eventFindTourn.projectId.toString()
                }
                var eventFindEve = events.findOne({
                    "tournamentId": tournament,
                    eventName: eventN
                });
                if (eventFindEve && eventFindEve.abbName) {
                    eventABBName = eventFindEve.abbName
                }
                if (eveOrg && eveOrg.trim().length != 0 && eventABBName && tournNAme) {
                    var userFind = Meteor.users.findOne({
                        userId: eveOrg
                    });
                    var HashTagsFind = twitterHashTags.findOne({
                        "selectedSport": sports,
                        "entityName": eveOrg.toString()
                    })
                    if (HashTagsFind && HashTagsFind.iphashTag) {
                        ipHASHTAG = HashTagsFind.iphashTag.trim();
                        customHashTagList = HashTagsFind.savedTags.join(" ");
                    }
                    var messFind = autoTweetMessages.findOne({
                        "typeOfEvent": autoMessageKey
                    });
                    if (messFind && messFind.message1) {
                        message1 = "Tournament Concluded"+"\n"+messFind.message1 + "\n" + tournNAme.substring(0, 4) + ".." + ":" + eventABBName + "\n" + "player:" + playerNAME.substring(0, 4) + ".."+" " + "(more)" + messFind.referWEB;;
                        var mes = "Tournament Concluded"+"\n"+messFind.message1 + "\n" + tournNAme + ".." + ":" + eventABBName + "\n" + "player:" + playerNAME + ".."+" " + "(more)" + messFind.referWEB;;

                        var customMessage = customHashTagList + " " +message1;
                        var mesDesc = customHashTagList + " "+mes;

                        pushFeedIntoSocialSites(customMessage,mesDesc,eveOrg);

                        /*
                        var Twit = require('twit')
                        var twit = new Twit({
                            consumer_key: conf.consumer.key,
                            consumer_secret: conf.consumer.secret,
                            access_token: conf.access_token.key,
                            access_token_secret: conf.access_token.secret,
                        });
                       

                        var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
                        if(accessInfo)
                        {
                            if(accessInfo.pageToken)
                            {
                                FB.options({timeout: 1000, 
                                    scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                                    accessToken:accessInfo.pageToken
                                }); 

                                FB.api('me/feed', 'post', { message: customHashTagList + " " + message1 }, function (res) {
                                    if(!res || res.error) {
                                        return;
                                    }
                                });
                            }
                            if(accessInfo.tweetKeys)
                            {
                                twit = new Twit({
                                    consumer_key: accessInfo.tweetKeys.consumer_key,
                                    consumer_secret: accessInfo.tweetKeys.consumer_secret,
                                    access_token: accessInfo.tweetKeys.access_token_key,
                                    access_token_secret: accessInfo.tweetKeys.access_token_secret,
                                });
                            }

                            if(accessInfo.linkedInKeys && 
                                accessInfo.linkedInKeys.companyId &&
                                accessInfo.linkedInKeys.accessToken)
                            {

                                var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
                                linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                                    "comment": customHashTagList + " " + message1,          
                                    "visibility": { "code": "anyone" }
                                    }, function (err, share) {      
                                });
                            }

                        }
                        var s = twit.post('statuses/update', {
                            status:customHashTagList + " " + message1
                        }, function(err, data, response) {
                            if (data.errors) {
                                for (var i = 0; i < data.errors.length; i++)
                                    if (parseInt(data.errors[i].code) == 186) {
                                    }
                            }
                        });
                        */
                    }
                }
            }
        } catch (e) {
        }
    }
});

var splitIntoLines = function(input, len) {
    var i;
    var output = [];
    var lineSoFar = "";
    var temp;
    var words = input.split(' ');
    for (i = 0; i < words.length;) {
        // check if adding this word would exceed the len
        temp = addWordOntoLine(lineSoFar, words[i]);
        if (temp.length > len) {
            if (lineSoFar.length == 0) {
                lineSoFar = temp; // force to put at least one word in each line
                i++; // skip past this word now
            }
            output.push(lineSoFar); // put line into output
            lineSoFar = ""; // init back to empty
        } else {
            lineSoFar = temp; // take the new word
            i++; // skip past this word now
        }
    }
    if (lineSoFar.length > 0) {
        output.push(lineSoFar);
    }
    return (output);
}

var addWordOntoLine = function(line, word) {
    if (line.length != 0) {
        line += " ";
    }
    return (line += word);
}

Meteor.publish(
    "assocAcadOrgName",
    function(searchValue, selectedRole) {
        if (searchValue != null && searchValue != undefined && selectedRole != null && selectedRole != undefined) {
            var reObj = new RegExp(searchValue.trim(), 'i');
            if (selectedRole == "Association") {
                var associationDet = Meteor.users.find({
                    role: "Association",
                    userName: {
                        $regex: reObj
                    }
                }, {
                    sort: {
                        userName: 1
                    },
                    fields: {
                        userName: 1,
                        userId: 1,
                        role: 1
                    },
                    limit: 5
                });
                return associationDet
            } else if (selectedRole == "Academy") {
                var associationDet = Meteor.users.find({
                    role: "Academy",
                    userName: {
                        $regex: reObj
                    }
                }, {
                    sort: {
                        userName: 1
                    },
                    fields: {
                        userName: 1,
                        userId: 1,
                        role: 1
                    },
                    limit: 5
                })
                return associationDet
            } else if (selectedRole == "Organiser") {
                var associationDet = Meteor.users.find({
                    role: "Organiser",
                    userName: {
                        $regex: reObj
                    }
                }, {
                    sort: {
                        userName: 1
                    },
                    fields: {
                        userName: 1,
                        userId: 1,
                        role: 1
                    },
                    limit: 5
                })
                return associationDet
            }
        }
    }
);


var TagsForLoggedInPerson = function(userId){
    try{
    if(userId){
        var userDet = Meteor.users.findOne({userId:userId});
        if(userDet&&userDet.role&&userDet.role=="Player"){
            var toret = "userDetailsTT"

            var usersMet = Meteor.users.findOne({
                userId: userDet.userId
            })

            if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                var dbn = playerDBFind(usersMet.interestedProjectName[0])
                if (dbn) {
                    toret = dbn
                }
            }

            var userDetailsFind = global[toret].findOne({userId:userDet.userId})
            var selectedSport;
            var selectedDomains = [];
            var affiliatedTo;
            var academyID;
            var stateAssocID;
            var districtAssocID;

            if(userDetailsFind && userDetailsFind.interestedProjectName){
                selectedSport = userDetailsFind.interestedProjectName.toString();
            }
            if(userDetailsFind && userDetailsFind.interestedDomainName){
                selectedDomains = userDetailsFind.interestedDomainName;
            }
            if(userDetailsFind && userDetailsFind.affiliatedTo&&userDetailsFind.affiliatedTo!="other"){
                affiliatedTo = userDetailsFind.affiliatedTo;
                if(affiliatedTo=="academy"){
                    if(userDetailsFind.clubNameId){
                        academyID = userDetailsFind.clubNameId;
                        var acadDet = academyDetails.findOne({"userId":academyID});
                        if(acadDet&&acadDet.affiliatedTo=="stateAssociation"){
                            stateAssocID = acadDet.associationId
                        }
                        if(acadDet&&acadDet.affiliatedTo=="districtAssociation"){
                            districtAssocID = acadDet.associationId
                            stateAssocID = acadDet.parentAssociationId
                        }
                    }
                }
                if(affiliatedTo=="stateAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId});
                        if(assocDet&&assocDet.userId){
                            stateAssocID = assocDet.userId
                        }
                    }
                }   
                if(affiliatedTo=="districtAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId});
                        if(assocDet&&assocDet.affiliatedTo=="stateAssociation"){
                            districtAssocID = assocDet.userId
                            if(assocDet.parentAssociationId&&assocDet.parentAssociationId!=undefined&&assocDet.parentAssociationId.trim().length!=0){
                                stateAssocID = assocDet.parentAssociationId
                            }
                        }
                    }
                }  
            }
        }

        else if(userDet&&userDet.role&&userDet.role=="Association"){
            var userDetailsFind = associationDetails.findOne({userId:userDet.userId})
            var selectedSport;
            var selectedDomains = [];
            var affiliatedTo;
            var academyID;
            var stateAssocID;
            var districtAssocID;

            if(userDetailsFind && userDetailsFind.interestedProjectName){
                selectedSport = userDetailsFind.interestedProjectName.toString();
            }
            if(userDetailsFind && userDetailsFind.interestedDomainName){
                selectedDomains = userDetailsFind.interestedDomainName;
            }
            if(userDetailsFind && userDetailsFind.userId){
                stateAssocID = userDetailsFind.userId;
            }
            if(userDetailsFind && userDetailsFind.affiliatedTo&&userDetailsFind.affiliatedTo!="other"){
                if(userDetailsFind.affiliatedTo=="stateAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId});
                        if(assocDet&&assocDet.userId){
                            districtAssocID = assocDet.userId
                        }
                        if(assocDet&&assocDet.parentAssociationId){
                            stateAssocID = assocDet.parentAssociationId
                        }
                    }
                }  
            }
        }

        //
        else if(userDet&&userDet.role&&userDet.role=="Academy"){
            var userDetailsFind = academyDetails.findOne({userId:userDet.userId})
            var selectedSport;
            var selectedDomains = [];
            var affiliatedTo;
            var academyID;
            var stateAssocID;
            var districtAssocID;
            if(userDetailsFind && userDetailsFind.interestedProjectName){
                selectedSport = userDetailsFind.interestedProjectName.toString();
            }
            if(userDetailsFind && userDetailsFind.interestedDomainName){
                selectedDomains = userDetailsFind.interestedDomainName;
            }
            if(userDetailsFind && userDetailsFind.userId){
                academyID = userDetailsFind.userId;
            }
            if(userDetailsFind && userDetailsFind.affiliatedTo&&userDetailsFind.affiliatedTo!="other"){
                if(userDetailsFind.affiliatedTo=="stateAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId,associationType:"State/Province/County"});
                        if(assocDet&&assocDet.userId){
                            stateAssocID = assocDet.userId
                        }
                    }
                }
                if(userDetailsFind.affiliatedTo=="districtAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId,associationType:"District/City"});
                        if(assocDet&&assocDet.userId){
                            districtAssocID = assocDet.userId
                        }
                        if(assocDet&&assocDet.parentAssociationId&&assocDet.affiliatedTo&&assocDet.affiliatedTo=="stateAssociation"){
                            stateAssocID = assocDet.parentAssociationId
                        }
                    }
                }  
            }
        }

        //
    }
    var tagsToSearch = new Array();
    if(stateAssocID){
        if(selectedSport){
            var findTags = twitterHashTags.findOne({"selectedSport":selectedSport,"entityName":stateAssocID})
            if(findTags&&findTags.savedTags){
                var concatA = new Array()
                concatA = findTags.savedTags.toString().split(",")
                if(tagsToSearch.length!=0){
                    tagsToSearch.push("OR")
                }
                tagsToSearch.push.apply(tagsToSearch,concatA);            }
        }
    }
    if(districtAssocID){
        if(selectedSport){
            var findTags = twitterHashTags.findOne({"selectedSport":selectedSport,"entityName":districtAssocID})
            if(findTags&&findTags.savedTags){
                var concatA = new Array()
                concatA = findTags.savedTags.toString().split(",")
                if(tagsToSearch.length!=0){
                    tagsToSearch.push("OR")
                }
                tagsToSearch.push.apply(tagsToSearch,concatA); 
            }
        }
    }
    if(academyID){
        if(selectedSport){
            var findTags = twitterHashTags.findOne({"selectedSport":selectedSport,"entityName":academyID})
            if(findTags&&findTags.savedTags){
                var concatA = new Array()
                concatA = findTags.savedTags.toString().split(",")
                if(tagsToSearch.length!=0){
                    tagsToSearch.push("OR")
                }
                tagsToSearch.push.apply(tagsToSearch,concatA); 
            }
        }
    }
    if(selectedSport){
        if(selectedSport&&selectedDomains){
            twitterHashTags.find({"selectedSport":selectedSport,regionSelected:{$in:selectedDomains}}).fetch().forEach(function(findTags,i){
                if(findTags&&findTags.savedTags){
                    var concatA = new Array()
                    concatA = findTags.savedTags.toString().split(",")
                    if(tagsToSearch.length!=0){
                        tagsToSearch.push("OR")
                    }
                    tagsToSearch.push.apply(tagsToSearch,concatA); 
                }
            })
        }
    }
    return tagsToSearch
    }catch(e){
    }
}


var StreamTagsForLoggedInPerson = function(userId){
    try{
    if(userId){
        var userDet = Meteor.users.findOne({userId:userId});
        if(userDet&&userDet.role&&userDet.role=="Player"){
            var toret = "userDetailsTT"

            var usersMet = Meteor.users.findOne({
                userId: userDet.userId
            })

            if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                var dbn = playerDBFind(usersMet.interestedProjectName[0])
                if (dbn) {
                    toret = dbn
                }
            }

            var userDetailsFind = global[toret].findOne({userId:userDet.userId})
            var selectedSport;
            var selectedDomains = [];
            var affiliatedTo;
            var academyID;
            var stateAssocID;
            var districtAssocID;

            if(userDetailsFind && userDetailsFind.interestedProjectName){
                selectedSport = userDetailsFind.interestedProjectName.toString();
            }
            if(userDetailsFind && userDetailsFind.interestedDomainName){
                selectedDomains = userDetailsFind.interestedDomainName;
            }
            if(userDetailsFind && userDetailsFind.affiliatedTo&&userDetailsFind.affiliatedTo!="other"){
                affiliatedTo = userDetailsFind.affiliatedTo;
                if(userDetailsFind.affiliatedTo=="academy"){
                    if(userDetailsFind.clubNameId){
                        academyID = userDetailsFind.clubNameId;
                        var acadDet = academyDetails.findOne({"userId":academyID});
                        if(acadDet&&acadDet.affiliatedTo=="stateAssociation"){
                            stateAssocID = acadDet.associationId
                        }
                        if(acadDet&&acadDet.affiliatedTo=="districtAssociation"){
                            districtAssocID = acadDet.associationId
                            stateAssocID = acadDet.parentAssociationId
                        }
                    }
                }
                if(affiliatedTo=="stateAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId});
                        if(assocDet&&assocDet.userId){
                            stateAssocID = assocDet.userId
                        }
                    }
                }   
                if(affiliatedTo=="districtAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId});
                        if(assocDet&&assocDet.affiliatedTo=="stateAssociation"){
                            districtAssocID = assocDet.userId
                            if(assocDet.parentAssociationId&&assocDet.parentAssociationId!=undefined&&assocDet.parentAssociationId.trim().length!=0){
                                stateAssocID = assocDet.parentAssociationId
                            }
                        }
                    }
                }  
            }
        }
        else if(userDet&&userDet.role&&userDet.role=="Association"){
            var userDetailsFind = associationDetails.findOne({userId:userDet.userId})
            var selectedSport;
            var selectedDomains = [];
            var affiliatedTo;
            var academyID;
            var stateAssocID;
            var districtAssocID;

            if(userDetailsFind && userDetailsFind.interestedProjectName){
                selectedSport = userDetailsFind.interestedProjectName.toString();
            }
            if(userDetailsFind && userDetailsFind.interestedDomainName){
                selectedDomains = userDetailsFind.interestedDomainName;
            }
            if(userDetailsFind && userDetailsFind.userId){
                stateAssocID = userDetailsFind.userId;
            }
            if(userDetailsFind && userDetailsFind.affiliatedTo&&userDetailsFind.affiliatedTo!="other"){
                if(userDetailsFind.affiliatedTo=="stateAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId});
                        if(assocDet&&assocDet.userId){
                            districtAssocID = assocDet.userId
                        }
                        if(assocDet&&assocDet.parentAssociationId){
                            stateAssocID = assocDet.parentAssociationId
                        }
                    }
                }  
            }
        }

        else if(userDet&&userDet.role&&userDet.role=="Academy"){
            var userDetailsFind = academyDetails.findOne({userId:userDet.userId})
            var selectedSport;
            var selectedDomains = [];
            var affiliatedTo;
            var academyID;
            var stateAssocID;
            var districtAssocID;
            if(userDetailsFind && userDetailsFind.interestedProjectName){
                selectedSport = userDetailsFind.interestedProjectName.toString();
            }
            if(userDetailsFind && userDetailsFind.interestedDomainName){
                selectedDomains = userDetailsFind.interestedDomainName;
            }
            if(userDetailsFind && userDetailsFind.userId){
                academyID = userDetailsFind.userId;
            }
            if(userDetailsFind && userDetailsFind.affiliatedTo&&userDetailsFind.affiliatedTo!="other"){
                if(userDetailsFind.affiliatedTo=="stateAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId,associationType:"State/Province/County"});
                        if(assocDet&&assocDet.userId){
                            stateAssocID = assocDet.userId
                        }
                    }
                }
                if(userDetailsFind.affiliatedTo=="districtAssociation"){
                    if(userDetailsFind.associationId){
                        associationId = userDetailsFind.associationId;
                        var assocDet = associationDetails.findOne({"userId":associationId,associationType:"District/City"});
                        if(assocDet&&assocDet.userId){
                            districtAssocID = assocDet.userId
                        }
                        if(assocDet&&assocDet.parentAssociationId&&assocDet.affiliatedTo&&assocDet.affiliatedTo=="stateAssociation"){
                            stateAssocID = assocDet.parentAssociationId
                        }
                    }
                }  
            }
        }
        // /
        else if(userDet&&userDet.role&&(userDet.role=="Organiser"||userDet.role=="Other"||userDet.role=="Umpire"||userDet.role=="Coach"||userDet.role=="Journalist")){

        }
    }
    var tagsToSearch = new Array();
    if(stateAssocID){
        if(selectedSport){
            var findTags = twitterHashTags.findOne({"selectedSport":selectedSport,"entityName":stateAssocID})
            if(findTags&&findTags.savedTags){
                var concatA = new Array()
                concatA = findTags.savedTags.toString().split(",")
                if(tagsToSearch.length!=0){
                    tagsToSearch.push("OR")
                }
                tagsToSearch.push.apply(tagsToSearch,concatA);            }
        }
    }
    if(districtAssocID){
        if(selectedSport){
            var findTags = twitterHashTags.findOne({"selectedSport":selectedSport,"entityName":districtAssocID})
            if(findTags&&findTags.savedTags){
                var concatA = new Array()
                concatA = findTags.savedTags.toString().split(",")
                tagsToSearch.push.apply(tagsToSearch,concatA); 
            }
        }
    }
    if(academyID){
        if(selectedSport){
            var findTags = twitterHashTags.findOne({"selectedSport":selectedSport,"entityName":academyID})
            if(findTags&&findTags.savedTags){
                var concatA = new Array()
                concatA = findTags.savedTags.toString().split(",")
                tagsToSearch.push.apply(tagsToSearch,concatA); 
            }
        }
    }
    if(selectedSport){
        if(selectedSport&&selectedDomains){
            twitterHashTags.find({"selectedSport":selectedSport,regionSelected:{$in:selectedDomains}}).fetch().forEach(function(findTags,i){
                if(findTags&&findTags.savedTags){
                    var concatA = new Array()
                    concatA = findTags.savedTags.toString().split(",")
                    tagsToSearch.push.apply(tagsToSearch,concatA); 
                }
            })
        }
    }
    return tagsToSearch
    }catch(e){
    }
}


function pushFeedIntoSocialSites( customMessage, message ,eveOrg)
{

    var Twit = require('twit')
    var twit = new Twit({
        consumer_key: conf.consumer.key,
        consumer_secret: conf.consumer.secret,
        access_token: conf.access_token.key,
        access_token_secret: conf.access_token.secret,
    });
                 
    var accessInfo = apiUsers.findOne({"userId":eveOrg.toString()});
    if(accessInfo)
    {
        if(accessInfo.pageToken)
        {
            FB.options({timeout: 1000, 
                scope:'email, user_about_me,user_posts,publish_actions,publish_pages,manage_pages',
                accessToken:accessInfo.pageToken
            }); 

            FB.api('me/feed', 'post', { message: customMessage }, function (res) {
                if(!res || res.error) {
                    return;
                }
            });
        }
                               
        if(accessInfo.tweetKeys)
        {
            twit = new Twit({
                consumer_key: accessInfo.tweetKeys.consumer_key,
                consumer_secret: accessInfo.tweetKeys.consumer_secret,
                access_token: accessInfo.tweetKeys.access_token_key,
                access_token_secret: accessInfo.tweetKeys.access_token_secret,
            });
        }


        if(accessInfo.linkedInKeys && 
            accessInfo.linkedInKeys.companyId &&
            accessInfo.linkedInKeys.accessToken)
        {

            var linkedin = Linkedin.init(accessInfo.linkedInKeys.accessToken);
            linkedin.companies.share(accessInfo.linkedInKeys.companyId, {
                "comment": message,          
                "visibility": { "code": "anyone" }
            }, function (err, share) {      
            });
        }
    }

    var s = twit.post('statuses/update', {
        status: customMessage
    }, function(err, data, response) {
        if (data.errors) {
            for (var i = 0; i < data.errors.length; i++)
                if (parseInt(data.errors[i].code) == 186) {
                }
        }
                                
    });
}
