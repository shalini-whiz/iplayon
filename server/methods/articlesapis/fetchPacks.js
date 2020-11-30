import {
    emailRegex
}
from '../dbRequiredRole.js'
import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({

    "fetchMyPacks": function(userId) {
        try {

            var resultJson = {};
            if (userId != null || userId != undefined) {
                var userInfo = Meteor.users.findOne({
                    "userId": userId
                });
                if (userInfo) {
                    var packsExist = articlesOfPublisher.find({
                        "type": "Packs",
                        "userId": userId
                    }).fetch()
                    if (packsExist && packsExist.length != 0) {

                        var raw = articlesOfPublisher.rawCollection();
                        var distinct = Meteor.wrapAsync(raw.distinct, raw);
                        var packArr = distinct('_id', {
                            "type": "Packs",
                            "userId": userId
                        });

                        //code here


                        var memExists = userSubscribedPacks.aggregate([{
                            $match: {
                                "packId": {
                                    $in: packArr
                                }
                            }
                        }, {
                            $group: {
                                "_id": {
                                    "packId": "$packId"
                                },
                                "memCount": {
                                    $sum: 1
                                },
                            }
                        }, {
                            $project: {
                                "packId": "$_id.packId",
                                "memCount": 1,
                                "_id": 0
                            }
                        }]);

                        var consolidatedList = _.map(packsExist, function(item) {
                            return _.extend(item, _.findWhere(memExists, {
                                "packId": item._id,
                            }));
                        });

                        resultJson["status"] = "success";
                        resultJson["planData"] = packsExist;
                        return resultJson;
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "There are no plans";
                        return resultJson;
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid params";
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    "fetchMySubscribedPacks": function(userId) {
        try {

            var resultJson = {};
            if (userId != null || userId != undefined) {
                var userInfo = Meteor.users.findOne({
                    "userId": userId
                });
                if (userInfo) {
                    var raw = userSubscribedPacks.rawCollection();
                    var distinct = Meteor.wrapAsync(raw.distinct, raw);
                    var packList = distinct('packId', {
                        "userId": userId,
                        "planEndsOn": {
                            $gt: new Date()
                        }
                    });
                    var userList = distinct('packPayToUserId', {
                        "userId": userId,
                        "planEndsOn": {
                            $gt: new Date()
                        }
                    });


                    var activePacks = userSubscribedPacks.find({
                        "userId": userId,
                        "planEndsOn": {
                            $gt: new Date()
                        }
                    }, {
                        fields: {
                            "_id": 1,
                            "packPayToUserRole": 1,
                            "packId": 1,
                            "packPayToUserId": 1,
                            "planStartsOn": 1,
                            "planEndsOn": 1,
                            "features": 1,
                            "acknowledgeStatus": 1,
                            "buyerAmount": 1,
                            "userId": 1




                        }
                    }).fetch();




                    if (activePacks.length > 0) {

                        var userData = Meteor.users.find({
                            "_id": {
                                $in: userList
                            }
                        }, {
                            fields: {
                                userName: 1,
                                userId: 1
                            }
                        }).fetch();

                        var packDetails = articlesOfPublisher.aggregate([{
                            $match: {
                                "type": "Packs",
                                "_id": {
                                    $in: packList
                                }
                            }
                        }, {
                            $project: {
                                "_id": "$_id",
                                "title": 1,
                                "articleDesc": 1,
                                "amount": 1,
                                "planType": 1,
                                "category": 1,
                                //"packFeatures":"$features",
                                "validityDays": 1,
                                "buyerAmount": 1
                            }
                        }]);


                        var mergedList = _.map(activePacks, function(item) {
                            return _.extend(item, _.findWhere(packDetails, {
                                "_id": item.packId,
                            }));
                        });




                        var consolidatedList = _.map(mergedList, function(item) {
                            return _.extend(item, _.findWhere(userData, {
                                "userId": item.packPayToUserId,
                            }));
                        });

                        resultJson["status"] = "success";
                        resultJson["activePacks"] = consolidatedList;
                        resultJson["response"] = "There are  active plans";


                        return resultJson;
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "There are no active plans";
                        return resultJson;
                    }


                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid params";
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    "fetchPacks": function(userId, loggerId) {
        try {
  
            

            var resultJson = {};
            if (userId != null || userId != undefined) {
                var userInfo = Meteor.users.findOne({
                    "userId": userId
                });
                if (userInfo) {
                    //distinct
                    var raw = userSubscribedPacks.rawCollection();
                    var distinct = Meteor.wrapAsync(raw.distinct, raw);


                    var alreadySubPacks = distinct('packId', {
                        "userId": loggerId,
                        "packPayToUserId": userId,
                        "acknowledgeStatus": {
                            $in: ["accept", "pending", "onHold"]
                        },
                        "planEndsOn": {
                            $gte: new Date()
                        }
                    });


                    var alreadySubPacks2 = distinct('packId', {
                        "userId": loggerId,
                        "packPayToUserId": userId,
                        "acknowledgeStatus": "reject"
                    });

                    //var alreadySubPacks = alreadySubPacks1.concat(alreadySubPacks2);


                    var packsExist = articlesOfPublisher.find({
                        "type": "Packs",
                        "userId": userId,
                        "status": "active",
                        "_id": {
                            $nin: alreadySubPacks
                        }
                    }).fetch()
                    if (packsExist && packsExist.length != 0) {
                        var raw = articlesOfPublisher.rawCollection();
                        var distinct = Meteor.wrapAsync(raw.distinct, raw);

                        var taxEntry = taxDetails.findOne({}, {
                            fields: {

                                "taxRate": 1,
                                "cgst": 1,
                                "sgst": 1,
                                "_id": 0
                            }
                        });
                        if (taxEntry) {
                            packsExist = _.map(packsExist, function(item) {
                                return _.extend(item, {
                                    "taxDetails": taxEntry
                                })
                            });
                        }


                        var userList = distinct('userId', {
                            "role": "Coach",
                            "type": "Packs",
                            "status": "active"
                        });
                        var userData = Meteor.users.find({
                            "_id": {
                                $in: userList
                            }
                        }, {
                            fields: {
                                userName: 1,
                                userId: 1
                            }
                        }).fetch();

                        var query1 = {
                            "loggedInId": loggerId,
                            "receiverId": userId
                        }

                        var query2 = {
                            "loggedInId": userId,
                            "receiverId": loggerId,

                        }



                        var connectionStatus = "yetToConnect";
                        var connectionType = "";
                        var connectionExists = connectionRequests.findOne({
                            $or: [query1, query2],
                        }, {
                            fields: {
                                "_id": 1,
                                "status": 1,
                                "loggedInId": 1,
                                "receiverId": 1
                            }
                        });
                        if (connectionExists) {
                            if (connectionExists.loggedInId == loggerId)
                                connectionType = "sent"
                            else if (connectionExists.loggedInId == userId)
                                connectionType = "received"
                            if (connectionExists.status)
                                connectionStatus = connectionExists.status;
                        }

                        var taxLiable = "";
                        var accInfo = accountDetails.findOne({
                            "userId": userId
                        });
                        if (accInfo && accInfo.taxLiable)
                            taxLiable = accInfo.taxLiable;


                        var subscribedPacks = userSubscribedPacks.aggregate([{
                            $match: {
                                "userId": loggerId,
                                "packPayToUserId": userId
                            }
                        }, {
                            $group: {
                                "_id": {
                                    "userId": "$userId",
                                    "packId": "$packId",
                                    "buyerAmount": "$buyerAmount",
                                    "planEndsOn": "$planEndsOn",
                                    "currenDate": new Date(),
                                    "packExpire": {
                                        "$cond": {
                                            "if": {
                                                "$lte": [new Date(), "$planEndsOn"]
                                            },
                                            "then": "no",
                                            "else": "yes"
                                        }
                                    },
                                    "acknowledgeStatus": "$acknowledgeStatus"
                                }
                            }
                        }, {
                            $project: {
                                "userId": "$_id.userId",
                                "packId": "$_id.packId",
                                "currenDate": "$_id.currenDate",
                                "planEndsOn": "$_id.planEndsOn",
                                "packExpire": "$_id.packExpire",
                                "buyerAmount": "$_id.buyerAmount",
                                "acknowledgeStatus": "$_id.acknowledgeStatus",
                                "_id": 0
                            }
                        }]);




                        resultJson["status"] = "success";
                        resultJson["planData"] = packsExist;
                        resultJson["userData"] = userData;
                        resultJson["subscribedPacks"] = subscribedPacks;
                        resultJson["connectionStatus"] = connectionStatus;
                        resultJson["connectionType"] = connectionType;
                        resultJson["taxLiable"] = taxLiable;

                        return resultJson;
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "There are no plans";
                        return resultJson;
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid params";
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    "fetchPackUsers": function(userId) {
        try {
            var resultJson = {};
            if (userId != null || userId != undefined) {
                var userInfo = Meteor.users.findOne({
                    "userId": userId
                });
                if (userInfo) {
                    var packsExist = articlesOfPublisher.find({
                        "type": "Packs",
                        "status": "active",
                        "userId": {
                            $nin: [userId]
                        }
                    }).fetch()
                    if (packsExist && packsExist.length != 0) {
                        var raw = articlesOfPublisher.rawCollection();
                        var distinct = Meteor.wrapAsync(raw.distinct, raw);
                        var userList = distinct('userId', {
                            "role": "Coach",
                            "type": "Packs",
                            "status": "active",
                            "userId": {
                                $nin: [userId]
                            }
                        });
                        var userData = Meteor.users.find({
                            "_id": {
                                $in: userList
                            }
                        }, {
                            fields: {
                                userName: 1,
                                userId: 1,
                                role: 1
                            }
                        }).fetch();



                        resultJson["status"] = "success";
                        resultJson["userData"] = userData;
                        return resultJson;
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "There are no plans";
                        return resultJson;
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid params";
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },

    // **emailaddress**
    loginAndSubscribeToPack: function(data) {
        try {
            var resultJson = {};
            var password = data.password;
            var username = data.userName;
            var packId = data.packId;
            var regExpObj = emailRegex(username)
            var userID = Meteor.users.findOne({
                $or:[{
                            "emailAddress": {
                                $regex: emailRegex(username)
                            },
                            "emails.0.address": {
                                $regex: emailRegex(username)
                            }
                        }]
            });
            if (userID) {
                if (userID.role == "Player" || userID.role == "Coach") {
                    if (ApiPassword.validate({
                            email: regExpObj,
                            password: password
                        })) {
                        var userInfo = undefined;
                        if (userID.role == "Player")
                        {
                            userInfo = nameToCollection(userID.userId).findOne({
                                "emailAddress": regExpObj
                            });
                        }
                           
                        else if (userID.role == "Coach")
                            userInfo = otherUsers.findOne({
                                "emailAddress": regExpObj
                            })
                        if (userInfo) {
                            if (packId != null || packId != undefined) {
                                var packExists = articlesOfPublisher.findOne({
                                    "_id": packId
                                });
                                if (packExists) {
                                    if (packExists.status.toLowerCase() == "active") 
                                    {
                                        var packPublisher = packExists.userId;
                                        var packPublisherInfo = Meteor.users.findOne({
                                            "userId": packPublisher
                                        });
                                        if (packPublisherInfo) 
                                        {
                                            var connectionExists = connectionRequests.findOne({
                                                $or: [{
                                                    "loggedInId": userInfo.userId,
                                                    "receiverId": packPublisher
                                                }, {
                                                    "loggedInId": packPublisher,
                                                    "receiverId": userInfo.userId
                                                }]
                                            });

                                            var subscribedInfo = userSubscribedPacks.findOne({
                                                "packId":packId,
                                                "userId":userInfo.userId,
                                                "packPayToUserId":packExists.userId,
                                                
                        
                                            })

                                            if (connectionExists) 
                                            {
                                                resultJson["status"] = "success";
                                                resultJson["connectionStatus"] = connectionExists.status;
                                                resultJson["response"] = connectionExists.status;
                                                resultJson["userData"] = userInfo;
                                                resultJson["publisherName"] = packPublisherInfo.userName;
                                                resultJson["publisherId"] = packPublisherInfo.userId;
                                                if(subscribedInfo)
                                                {
                                                    resultJson["_id"] = subscribedInfo._id;

                                                    if(subscribedInfo.acknowledgeStatus == "reject")
                                                    {
                                                        resultJson["packType"] = "newPack";
                                                    }
                                                       
                                                    else if(subscribedInfo.acknowledgeStatus != "reject" && moment(moment(subscribedInfo.planEndsOn).format("YYYY-MM-DD")) > moment(moment(new Date()).format("YYYY-MM-DD")))         
                                                    {
                                                        resultJson["packType"] = "activePack";
                                                    }
                                                    else
                                                    {
                                                        resultJson["packType"] = "newPack";
                                                    }
                                                        
                                                   // if(moment(moment(subscribedInfo.planEndsOn).format("YYYY-MM-DD")) < moment(moment.tz(new Date()).format("YYYY-MM-DD")))
                                                       //log("true")
                                                    
                                                }
                                                else
                                                    resultJson["packType"] = "newPack";


                                                return resultJson;
                                            } 
                                            else 
                                            {
                                                resultJson["status"] = "success";
                                                resultJson["connectionStatus"] = "yetToConnect";
                                                resultJson["response"] = "yetToConnect";
                                                resultJson["userData"] = userInfo;
                                                resultJson["publisherName"] = packPublisherInfo.userName;
                                                resultJson["publisherId"] = packPublisherInfo.userId;
                                                if(subscribedInfo)
                                                {
                                                    resultJson["packType"] = "activePack";
                                                    resultJson["_id"] = subscribedInfo._id;

                                                }
                                                else
                                                    resultJson["packType"] = "newPack";

                                                return resultJson;
                                            }
                                        } else {
                                            resultJson["status"] = "failure";
                                            resultJson["response"] = "Invalid publisher";
                                            return resultJson;
                                        }
                                    } else {
                                        resultJson["status"] = "failure";
                                        resultJson["response"] = "Inactive pack";
                                        return resultJson;
                                    }
                                } else {
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "Invalid pack";
                                    return resultJson;
                                }
                            }
                            //return userInfo;              

                        }

                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid password";
                        return resultJson;
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "You are not authorized to login";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid user";
                return resultJson;
            }


        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    "fetchSubscribedPackUsers": function(packId) {
        try {
            var resultJson = {};
            if (packId != null || packId != undefined) {
                var packExists = articlesOfPublisher.findOne({
                    "_id": packId
                });
                if (packExists) {

                    var packPublisher = packExists.userId;
                    var packPublisherInfo = Meteor.users.findOne({
                        "userId": packPublisher
                    });
                    if (packPublisherInfo) {

                        var subscribedPacksExists = userSubscribedPacks.aggregate([{
                            $match: {
                                "packId": packId
                            }
                        }, {
                            $group: {
                                "_id": {
                                    "_id": "$_id",
                                    "userId": "$userId",
                                    "packId": "$packId",
                                    "packPayToUserId": "$packPayToUserId",
                                    "buyerAmount": "$buyerAmount",
                                    "planStartsOn": "$planStartsOn",
                                    "planEndsOn": "$planEndsOn",
                                    "packExpire": {
                                        "$cond": {
                                            "if": {
                                                "$gte": ["$planEndsOn", new Date()]
                                            },
                                            "then": "no",
                                            "else": "yes"
                                        }
                                    },
                                    "features": "$features",
                                    "acknowledgeStatus": "$acknowledgeStatus",
                                    "adminTransaction": "$adminTransaction"
                                }
                            }
                        }, {
                            $project: {
                                "_id": "$_id._id",

                                "userId": "$_id.userId",
                                "packId": "$_id.packId",
                                "packPayToUserId": "$_id.packPayToUserId",
                                "planStartsOn": "$_id.planStartsOn",
                                "planEndsOn": "$_id.planEndsOn",
                                "packExpire": "$_id.packExpire",
                                "buyerAmount": "$_id.buyerAmount",
                                "features": "$_id.features",
                                "acknowledgeStatus": "$_id.acknowledgeStatus",
                                "adminTransaction": "$_id.adminTransaction",
                            }
                        }]);

                        if (subscribedPacksExists && subscribedPacksExists.length > 0) {
                            var raw = userSubscribedPacks.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var userList = distinct('userId', {
                                "packId": packId
                            });
                            var userData = Meteor.users.find({
                                "_id": {
                                    $in: userList
                                }
                            }, {
                                fields: {
                                    userName: 1,
                                    userId: 1,
                                    role: 1,
                                    "_id": 0
                                }
                            }).fetch();


                            resultJson["status"] = "success";
                            resultJson["subscribedMembers"] = subscribedPacksExists;
                            resultJson["userData"] = userData;
                            resultJson["publisherName"] = packPublisherInfo.userName;
                            resultJson["publisherId"] = packPublisherInfo.userId;

                            return resultJson;
                        } else {
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Yet to subscribe";
                            resultJson["publisherName"] = packPublisherInfo.userName;
                            resultJson["publisherId"] = packPublisherInfo.userId;
                            return resultJson;
                        }
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid publisher";
                        return resultJson;
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid pack";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid params";
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    subscribeForPack: function(data) {
        try {

            //data.transactionId = "12345";
            var transactionId = "";
            if (data.transactionId)
                transactionId = data.transactionId;
            var resultJson = {};
            if (data.packId && data.subscriberId) {
                var packExists = articlesOfPublisher.findOne({
                    "type": "Packs",
                    "_id": data.packId
                });
                if (packExists) {
                    var packOwnerId = packExists.userId;
                    var packOwnerExists = Meteor.users.findOne({
                        "userId": packOwnerId
                    });
                    if (packOwnerExists) {
                        var subscriberExists = Meteor.users.findOne({
                            "userId": data.subscriberId
                        });
                        if (subscriberExists) {

                            var packValidity = packExists.validityDays;
                            var startsOn = moment(new Date()).format("YYYY-MM-DD hh:mm a");
                            var endsOn = moment(new Date()).add(packValidity, 'days').format("YYYY-MM-DD hh:mm a");


                            var insertJson = {};
                            insertJson["packPayToUserRole"] = packOwnerExists.role;
                            insertJson["roleOfSubscriber"] = subscriberExists.role;
                            insertJson["userId"] = data.subscriberId;
                            insertJson["packId"] = data.packId;
                            insertJson["packPayToUserId"] = packOwnerId;
                            insertJson["transactionId"] = transactionId;
                            insertJson["amount"] = packExists.amount;
                            insertJson["messageCount"] = packExists.messageLimit;
                            insertJson["videoAnalysisCount"] = packExists.videoMinutesLimit;
                            insertJson["videoCount"] = packExists.videoMinutesLimit;
                            insertJson["planStartsOn"] = startsOn;
                            insertJson["planEndsOn"] = endsOn;
                            insertJson["offset"] = new Date().getTimezoneOffset();
                            insertJson["paidDate"] = new Date();


                            if (data.taxRate)
                                insertJson["taxRate"] = data.taxRate;

                            if (data.CGST)
                                insertJson["cgstTax"] = data.CGST;

                            if (data.SGST)
                                insertJson["sgstTax"] = data.SGST;


                            if (data.buyerAmount != undefined) {
                                insertJson["buyerAmount"] = data.buyerAmount;

                            }
                            //extend
                            var mergedList = _.map(packExists.features, function(item) {
                                return _.extend(item, {
                                    "masterVal": item.value
                                })

                            });

                            insertJson["features"] = mergedList;

                            insertJson["acknowledgeStatus"] = "pending";


                            var checkSubscribedPackExists = userSubscribedPacks.findOne({
                                "userId": data.subscriberId,
                                "packId": data.packId,
                                "planEndsOn": {
                                    $gte: new Date()
                                },
                                "acknowledgeStatus": {
                                    $in: ["accept", "pending", "onHold"]
                                }
                            });
                            if (checkSubscribedPackExists) {
                                resultJson["status"] = "failure";
                                resultJson["response"] = "You have already subscribed to " + packExists.title;
                                return resultJson;
                            } else {
                                var result = userSubscribedPacks.insert(insertJson);
                                if (result) {
                                    resultJson["status"] = "success";
                                    resultJson["response"] = "Successfully subscribed to " + packExists.title;
                                    return resultJson;
                                } else {
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "Could not subscribe to " + packExists.title;
                                    return resultJson;
                                }
                            }



                        } else {
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Invalid user";
                            return resultJson;
                        }
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid pack user";
                        return resultJson;
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid pack";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid params";
                return resultJson;
            }

        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    updateSubscribedPack: function(data) {
        try {
            var resultJson = {};
            if (data.senderId && data.receiverId) 
            {
              
                var packExists = userSubscribedPacks.find({
                    "packPayToUserId": data.receiverId,
                    "userId": data.senderId,
                    "planEndsOn": {
                        $gte: new Date()
                    },
                    "features": {
                        $elemMatch: {
                            "key": "Message Limit",
                            "value": {$ne:"0"}
                        }
                    },
                    "acknowledgeStatus": "accept",
                    

                }, {
                    fields: {
                        _id: 1,
                        "features": {
                            $elemMatch: {
                                "key": "Message Limit"
                            }
                        }
                    }
                }, {
                    sort: {
                        "paidDate": 1
                    }
                }, {
                    limit: 1
                }, ).fetch();


                if (packExists && packExists.length > 0 && packExists[0]) {
                    var packInfo = packExists[0];
                    if (packInfo.features && packInfo.features.length > 0) 
                    {
                        var packMessageCount = parseInt(packInfo.features[0].value) - 1;


                        var subscribedUsage = userSubscribedPacks.update({
                            "_id": packInfo._id,
                            "features": {
                                $elemMatch: {
                                    "key": "Message Limit"
                                }
                            }
                        }, {
                            $set: {
                                "features.$.value": packMessageCount,
                            }
                        });

                        if (subscribedUsage) {
                            resultJson["status"] = "success";
                            resultJson["response"] = "Successfully updated";
                            return resultJson;
                        } else {
                            resultJson["status"] = "failure";
                            resultJson["response"] = "could not update";
                            return resultJson;
                        }
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "no pack exists";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid param";
                return resultJson;
            }

        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    updateSubscribedPF: async function(data) {
        try {
            var resultJson = {};
            var statusUpdate = false;
            if (data.buyerId && data.sellerId && data.features && data.packId && data.id) {
                for (var i = 0; i < data.features.length; i++) {
                    var dataKey = data.features[i]["key"];
                    var dataVal;
                    if (data.features[i][dataKey])
                        dataVal = data.features[i][dataKey];
                    else if (data.features[i]["value"])
                        dataVal = data.features[i]["value"];


                    var packExists = userSubscribedPacks.find({
                        "packPayToUserId": data.sellerId,
                        "userId": data.buyerId,
                        "planEndsOn": {
                            $gte: new Date()
                        },
                        "features.key": dataKey,
                        "packId": data.packId,
                        "_id": data.id,
                        "acknowledgeStatus": "accept"
                    }, {
                        fields: {
                            _id: 1,
                            "features": {
                                $elemMatch: {
                                    "key": dataKey
                                }
                            }
                        }
                    }).fetch();


                    if (packExists && packExists.length > 0 && packExists[0]) {
                        var packInfo = packExists[0];
                        if (packInfo.features && packInfo.features.length > 0) {
                            var packMessageCount = parseInt(packInfo.features[0].value) - parseInt(dataVal);
                            if (parseInt(packInfo.features[0].value) >= parseInt(dataVal)) {
                                var subscribedUsage = userSubscribedPacks.update({
                                    "_id": packInfo._id,
                                    "features": {
                                        $elemMatch: {
                                            "key": dataKey
                                        }
                                    }
                                }, {
                                    $set: {
                                        "features.$.value": packMessageCount,
                                    }
                                });

                                if (subscribedUsage)
                                    statusUpdate = true;


                            } else {
                                resultJson["status"] = "failure";
                                resultJson["response"] = "Cannot update on an empty value";
                                return resultJson;
                            }
                        }
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "no pack exists";
                        return resultJson;
                    }


                }

                if (statusUpdate) {
                    resultJson["status"] = "success";

                    var result = await Meteor.call("fetchSubscribedPackUsers", data.packId)
                    try{
                        if (result) {
                            if (result.status == "success") {
                                if (result.userData)
                                    resultJson["userData"] = result.userData;
                                if (result.subscribedMembers)
                                    resultJson["subscribedMembers"] = result.subscribedMembers;
                            }
                        }
                    }catch(e){

                    }

                    resultJson["response"] = "Successfully updated";

                    return resultJson;

                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "could not update";
                    return resultJson;
                }

            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid param";
                return resultJson;
            }

        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    multiPackSubscription: async function(data) {
        try {


            var failureArr = [];
            var alreadyFailureArr = [];
            var successArr = [];

            if (data.taxRate && data.multiPacks &&
                data.SGST && data.CGST && data.subscriberId) {
                var subscriberExists = Meteor.users.findOne({
                    "userId": data.subscriberId
                });
                if (subscriberExists) {
                    for (var m = 0; m < data.multiPacks.length; m++) {
                        var individualPack = data.multiPacks[m];
                        individualPack["taxRate"] = data.taxRate;
                        individualPack["SGST"] = data.SGST;
                        individualPack["CGST"] = data.CGST;
                        individualPack["subscriberId"] = data.subscriberId;
                        individualPack["transactionId"] = data.transactionId;

                        var packExists = articlesOfPublisher.findOne({
                            "type": "Packs",
                            "_id": individualPack.packId
                        });
                        if (packExists) {
                            var packOwnerId = packExists.userId;
                            var packOwnerExists = Meteor.users.findOne({
                                "userId": packOwnerId
                            });
                            if (packOwnerExists) {
                                var packValidity = packExists.validityDays;
                                var startsOn = moment(new Date()).format("YYYY-MM-DD hh:mm a");
                                var endsOn = moment(new Date()).add(packValidity, 'days').format("YYYY-MM-DD hh:mm a");

                                var insertJson = {};
                                insertJson["packPayToUserRole"] = packOwnerExists.role;
                                insertJson["roleOfSubscriber"] = subscriberExists.role;
                                insertJson["userId"] = individualPack.subscriberId;
                                insertJson["packId"] = individualPack.packId;
                                insertJson["packPayToUserId"] = packOwnerId;
                                insertJson["transactionId"] = data.transactionId;
                                insertJson["amount"] = packExists.amount;
                                insertJson["messageCount"] = packExists.messageLimit;
                                insertJson["videoAnalysisCount"] = packExists.videoMinutesLimit;
                                insertJson["videoCount"] = packExists.videoMinutesLimit;
                                insertJson["planStartsOn"] = startsOn;
                                insertJson["planEndsOn"] = endsOn;
                                insertJson["offset"] = new Date().getTimezoneOffset();
                                insertJson["paidDate"] = new Date();

                                if (individualPack.taxRate)
                                    insertJson["taxRate"] = individualPack.taxRate;
                                if (individualPack.CGST)
                                    insertJson["cgstTax"] = individualPack.CGST;
                                if (individualPack.SGST)
                                    insertJson["sgstTax"] = individualPack.SGST;
                                if (individualPack.buyerAmount != undefined)
                                    insertJson["buyerAmount"] = individualPack.buyerAmount;


                                //extend
                                var mergedList = _.map(packExists.features, function(item) {
                                    return _.extend(item, {
                                        "masterVal": item.value
                                    })

                                });

                                insertJson["features"] = mergedList;

                                insertJson["acknowledgeStatus"] = "pending";


                                var checkSubscribedPackExists = userSubscribedPacks.findOne({
                                    "userId": individualPack.subscriberId,
                                    "packId": individualPack.packId,
                                    "planEndsOn": {
                                        $gte: new Date()
                                    },
                                    "acknowledgeStatus": {
                                        $in: ["accept", "pending", "onHold"]
                                    }
                                });
                                if (checkSubscribedPackExists) {

                                    var failureJson = {};
                                    failureJson["package"] = packExists.title;
                                    failureJson["subscriber"] = subscriberExists.userName;
                                    failureJson["packOwner"] = packOwnerExists.userName;
                                    failureJson["subscribedDate"] = new Date();
                                    failureJson["amount"] = individualPack.buyerAmount
                                    failureJson["message"] = "had already subscrobed";
                                    failureArr.push(failureJson);
                                } else {
                                    var result = userSubscribedPacks.insert(insertJson);
                                    if (result) {
                                        successArr.push(result);

                                    } else {
                                        var failureJson = {};
                                        failureJson["package"] = packExists.title;
                                        failureJson["subscriber"] = subscriberExists.userName;
                                        failureJson["packOwner"] = packOwnerExists.userName;
                                        failureJson["subscribedDate"] = new Date();
                                        failureJson["amount"] = individualPack.buyerAmount
                                        failureJson["message"] = "could not subscribe";

                                        failureArr.push(failureJson);


                                    }
                                }
                            } else {
                                if (data.finalPay) {
                                    if (data.finalPay != 0 || data.finalPay != "0")
                                    {
 
                                    }
                                }
                                var failureJson = {};
                                failureJson["package"] = packExists.title;
                                failureJson["subscriber"] = subscriberExists.userName;
                                failureJson["packOwner"] = packOwnerExists.userName;
                                failureJson["subscribedDate"] = new Date();
                                failureJson["amount"] = individualPack.buyerAmount
                                failureJson["message"] = "Invalid pack owner";
                                failureArr.push(failureJson);


                            }

                        } else {
                            if (data.finalPay) {
                                if (data.finalPay != 0 || data.finalPay != "0"){
                                }
                            }

                            var failureJson = {};
                            failureJson["package"] = individualPack.packId;
                            failureJson["subscriber"] = subscriberExists.userName;
                            failureJson["subscribedDate"] = new Date();
                            failureJson["amount"] = individualPack.buyerAmount
                            failureJson["message"] = "Invalid pack ";
                            failureArr.push(failureJson);
                        }
                    }
                    if (successArr.length > 0) {
                        var resultJson = {};
                        resultJson["status"] = "success";
                        resultJson["response"] = "Successfully subscribed!!";
                        var result = await Meteor.call("fetchPacks", data.selectedUser, data.subscriberId)
                        try {
                            if (result) {
                                resultJson["refreshData"] = result
                            }
                        }catch(e){}

                        return resultJson;
                    } else {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = failureArr;
                        return resultJson;
                    }
                } else {
                    if (data.finalPay) {
                        if (data.finalPay != 0 || data.finalPay != "0"){
                        }
                    }

                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user";
                    return resultJson;

                }


            } else {
                if (data.finalPay) {
                    if (data.finalPay != 0 || data.finalPay != "0"){
                    }
                }

                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid data";
                return resultJson;
            }

        } catch (e) {
            if (data.finalPay) {
                if (data.finalPay != 0 || data.finalPay != "0"){
                }
            }

        }
    }
})