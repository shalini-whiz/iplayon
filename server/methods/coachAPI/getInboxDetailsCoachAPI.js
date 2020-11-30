import {nameToCollection} from '../dbRequiredRole.js'

//check for login id
//check player or coach
//?connected ?unconnected
//if player is loggedIn person
//player can recieve messages from
//coach
//if he is member of group
//check for loggedIn id of the player 
//check db coachAppMessageInBOX for receiverId as playerId
//chech db coachAppMessageInBOX for receiverRole as all
//for group messages 
//check for groupId where he is the member of that group
//db.coachConnectedGroups.aggregate([{$match:{groupMembers:"DPysWR75iPkrGTGfv"}},{$project:{"groupId":"$_id"}},{$group:{"_id":null,groupIds:{$push:"$groupId"}}}])
//get the groupIds 
//check db coachAppMessageInBOX for groupId in result of aggregate
//db.coachAppMessageInBOX.find({receiverId:{$in:[ "fAEXnmkCRGcw3bmPT", "9J2CbZqqKKfgx5exc" ]}})
//sort by option
//receivedDateAndTim -- sort :1, sort:-1
//sender name -- sort:1 , sort : -1
//deleted or not deleted
//read or unread
//connected or unconnected
//params: loggedInId, dateSortOrder, senderNameSortOrder
//1             0
//0             1
//0             0
//1             1//not allowed
//-1            0
//0             -1
//-1            -1//not allowed
Meteor.methods({
    "getInboxMessagesForLoggedInId": function(xDATA) {

         //var momeCheck = moment("2017-02-21", "12:39:00",
                                 // "DD-MM-YYYY HH:mm:ss",true).isValid()

        var messageValidations = [];
        try {
            if (xDATA) {
                if (typeof xDATA == "string"){
                    var data = xDATA.replace("\\", "");
                    xDATA = JSON.parse(data);
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }


            //check for params
            if (xDATA && xDATA.loggedInId){

// && xDATA.dateSortOrder && xDATA.senderNameSortOrder) {
                xDATA.senderNameSortOrder = 0
                xDATA.dateSortOrder = -1
                //date sort order is 1 if older at first
                //date sort order is -1 if newer at first
                //senderName sort order 1 if alphabetical order
                //senderName sort order -1 if reverse alphabetical order

                if ((parseInt(xDATA.dateSortOrder) == 1 || parseInt(xDATA.dateSortOrder) == -1 || parseInt(xDATA.dateSortOrder) == 0) &&
                    (parseInt(xDATA.senderNameSortOrder) == 1 || parseInt(xDATA.senderNameSortOrder) == -1 || parseInt(xDATA.senderNameSortOrder) == 0)) {

                    //either of the sort type should be zero to avoid sort based on another sort
                    if (parseInt(xDATA.dateSortOrder) !== 0 && parseInt(xDATA.senderNameSortOrder) !== 0) {
                        var message = "either senderNameSortOrder or dateSortOrder value must be zero"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    } else {

                        //check for valid role
                        var roleDet = Meteor.users.findOne({
                            "userId": xDATA.loggedInId
                        })

                        var loggedDet;

                        //check for valid details based on role
                        //if role is player
                        if (roleDet && roleDet.role == "Player") {
                            loggedDet = nameToCollection(xDATA.loggedInId).findOne({
                                "userId": xDATA.loggedInId,
                                "role":"Player"
                            });
                        }
                        //if role is coach
                        else if (roleDet && roleDet.role == "Coach") {
                            loggedDet = otherUsers.findOne({
                                "userId": xDATA.loggedInId
                            })
                        } else {
                            var message = "Invalid Login"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                        }

                        //if both are valid
                        if (roleDet && loggedDet) {

                            //query to check, and get inbox messages
                            //for this loggedInId
                            var groupIdQuery = {
                                receiverId: ""
                            }

                            

                            var receiverIdQuery = [{
                                receiverId: xDATA.loggedInId,
                            }, {
                                senderId: xDATA.loggedInId
                            }]

                            var receiverIdQueryForAll = {
                                receiverId: "All"
                            }

                            var sortQuery = {
                                "abc": 1
                            }

                            //get all groupId of this loggin person
                            var getGroupIds = coachConnectedGroups.aggregate([
                            {
                                $match: {$or:[
                                        {groupMembers: {$in:[xDATA.loggedInId]}},
                                        {"loggedInId":xDATA.loggedInId}
                                    ]}

                            }, {
                                $project: {
                                    "groupId": "$_id"
                                }
                            }, {
                                $group: {
                                    "_id": "group",
                                    groupIds: {
                                        $push: "$groupId"
                                    }
                                }
                            }]);



                            if (getGroupIds && getGroupIds[0] && getGroupIds[0].groupIds) {
                                var arrayGroup = getGroupIds[0].groupIds
                                groupIdQuery = {
                                    receiverId: {
                                        $in: arrayGroup
                                    }
                                }
                            }


                            var coachAPPInboxDET = coachAPPINSentBOX.aggregate([{
                                $match: {
                                    $or: [groupIdQuery, {
                                            $or: receiverIdQuery
                                        },
                                        receiverIdQueryForAll
                                    ],
                                    "messagesBox": {
                                        $elemMatch: {"deleteIds": {$nin:[xDATA.loggedInId]}}
                                    },
                                }
                            }, 
                            {
                                $sort: {"receivedDateAndTime":-1}
                            }, 
                            {$unwind:"$messagesBox"},
                            {$match:{
                                "messagesBox.deleteIds":{$nin:[xDATA.loggedInId]}
                            }},

                            {
                                $group: {
                                    "_id":"$_id",                             
                                    "senderId": { "$first": "$senderId"},
                                    "receiverId": { "$first": "$receiverId"},
                                    "senderName": { "$first": "$senderName"},
                                    "senderRole": { "$first": "$senderRole"},

                                    "receiverName": { "$first": "$receiverName"},
                                    "message": { "$first": "$message"},
                                    "receiverRole": { "$first": "$receiverRole"},

                                    "receivedDateAndTime": { "$first": "$receivedDateAndTime"},
                                    "messagesBox": { "$first": "$messagesBox"},
                                     senderIDs: {
                                        $addToSet: "$senderId"
                                    },
                                    receiverIDs: {
                                        $addToSet: "$receiverId"
                                    },
                                    

                                }
                            },
                            {
                                $project:{
                                    "message":"$messagesBox.message",
                                    "receivedDateAndTime":1,   
                                    senderId:{
                                        "$cond": { 
                                            "if": { "$eq": [ "$receiverRole", "Group" ] }, 
                                            "then": "$senderId",
                                            "else": {
                                                "$cond": {
                                                    "if": { "$eq": ["$senderId",xDATA.loggedInId]}, 
                                                    "then": "$senderId", 
                                                    "else": "$receiverId"
                                                }
                                            }
                                        }

                                    },

                                    receiverId:{
                                        "$cond": { 
                                            "if": { "$eq": [ "$receiverRole", "Group" ] }, 
                                            "then": "$receiverId",
                                            "else": {
                                                "$cond": {
                                                    "if": { "$eq": ["$senderId",xDATA.loggedInId]}, 
                                                    "then": "$receiverId", 
                                                    "else": "$senderId"
                                                }
                                            }
                                        }

                                    },
                                    senderName:{
                                        "$cond": { 
                                            "if": { "$eq": [ "$receiverRole", "Group" ] }, 
                                            "then": "$senderName",
                                            "else": {
                                                "$cond": {
                                                    "if": { "$eq": ["$senderId",xDATA.loggedInId]}, 
                                                    "then": "$senderName", 
                                                    "else": "$receiverame"
                                                }
                                            }
                                        }

                                    },

                                    receiverName:{
                                        "$cond": { 
                                            "if": { "$eq": [ "$receiverRole", "Group" ] }, 
                                            "then": "$receiverName",
                                            "else": {
                                                "$cond": {
                                                    "if": { "$eq": ["$senderId",xDATA.loggedInId]}, 
                                                    "then": "$receiverName", 
                                                    "else": "$senderName"
                                                }
                                            }
                                        }

                                    },

                                    senderId123: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$senderId", "$receiverId"]
                                    },  
                                    receiverId123: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$receiverId", "$senderId"]
                                    }, 
                                    senderRole: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$senderRole", "$receiverRole"]
                                    },  
                                    receiverRole: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$receiverRole", "$senderRole"]
                                    },
                                    senderName123: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$senderName", "$receiverName"]
                                    },                            
                                    receiverName123: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$receiverName", "$senderName"]
                                    },

                                    "senderIDs":1,
                                    "receiverIDs":1,
                                    "mainId":"$_id"
                                }
                            },
                            {
                                $sort: {"receivedDateAndTime":-1}
                            },
                            {$group:{
                                "_id":"$receiverId",
                                "senderIDs": { "$first": "$senderIDs"},
                                "receiverIDs": { "$first": "$receiverIDs"},
                                "message": { "$first": "$message"},
                                "receivedDateAndTime": { "$first": "$receivedDateAndTime"},
                                "senderName": { "$first": "$senderName"},
                                "receiverName": { "$first": "$receiverName"},
                                "senderId": { "$first": "$senderId"},
                                "receiverId": { "$first": "$receiverId"},
                                "mainId": { "$first": "$mainId"},


                            }},
                            {
                                $sort: {"receivedDateAndTime":-1}
                            },
                  
                            ]);
                          

                            /*
                            var coachAPPInboxDET123 = coachAPPINSentBOX.aggregate([{
                                $match: {
                                    $or: [groupIdQuery, {
                                            $or: receiverIdQuery
                                        },
                                        receiverIdQueryForAll
                                    ],
                                    "messagesBox": {
                                        $elemMatch: {"deleteIds": {$nin:[xDATA.loggedInId]}}
                                    },
                                }
                            }, 
                            {
                                $sort: {"receivedDateAndTime":-1}
                            }, 
                            {$unwind:"$messagesBox"},
                            {$match:{
                                "messagesBox.deleteIds":{$nin:[xDATA.loggedInId]}
                            }},

                            {
                                $group: {
                                    "_id":"$_id",                             
                                    "senderId": { "$first": "$senderId"},
                                    "receiverId": { "$first": "$receiverId"},
                                    "senderName": { "$first": "$senderName"},
                                    "senderRole": { "$first": "$senderRole"},

                                    "receiverName": { "$first": "$receiverName"},
                                    "message": { "$first": "$message"},
                                    "receiverRole": { "$first": "$receiverRole"},

                                    "receivedDateAndTime": { "$first": "$receivedDateAndTime"},
                                    "messagesBox": { "$first": "$messagesBox"},
                                     senderIDs: {
                                        $addToSet: "$senderId"
                                    },
                                    receiverIDs: {
                                        $addToSet: "$receiverId"
                                    },
                                    

                                }
                            },
                            {
                                $project:{
                                    "message":"$messagesBox.message",
                                    "receivedDateAndTime":1,   
                                    senderId:{
                                        "$cond": { 
                                            "if": { "$eq": [ "$receiverRole", "Group" ] }, 
                                            "then": "$senderId",
                                            "else": {
                                                "$cond": {
                                                    "if": { "$eq": ["$senderId",xDATA.loggedInId]}, 
                                                    "then": "$senderId", 
                                                    "else": "$receiverId"
                                                }
                                            }
                                        }

                                    },

                                    receiverId:{
                                        "$cond": { 
                                            "if": { "$eq": [ "$receiverRole", "Group" ] }, 
                                            "then": "$receiverId",
                                            "else": {
                                                "$cond": {
                                                    "if": { "$eq": ["$senderId",xDATA.loggedInId]}, 
                                                    "then": "$receiverId", 
                                                    "else": "$senderId"
                                                }
                                            }
                                        }

                                    },
                                    senderName:{
                                        "$cond": { 
                                            "if": { "$eq": [ "$receiverRole", "Group" ] }, 
                                            "then": "$senderName",
                                            "else": {
                                                "$cond": {
                                                    "if": { "$eq": ["$senderId",xDATA.loggedInId]}, 
                                                    "then": "$senderName", 
                                                    "else": "$receiverame"
                                                }
                                            }
                                        }

                                    },

                                    receiverName:{
                                        "$cond": { 
                                            "if": { "$eq": [ "$receiverRole", "Group" ] }, 
                                            "then": "$receiverName",
                                            "else": {
                                                "$cond": {
                                                    "if": { "$eq": ["$senderId",xDATA.loggedInId]}, 
                                                    "then": "$receiverName", 
                                                    "else": "$senderName"
                                                }
                                            }
                                        }

                                    },

                                    senderId123: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$senderId", "$receiverId"]
                                    },  
                                    receiverId123: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$receiverId", "$senderId"]
                                    }, 
                                    senderRole: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$senderRole", "$receiverRole"]
                                    },  
                                    receiverRole: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$receiverRole", "$senderRole"]
                                    },
                                    senderName123: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$senderName", "$receiverName"]
                                    },                            
                                    receiverName123: {
                                        "$cond": [{
                                            $eq: ["$senderId", xDATA.loggedInId]
                                        }, "$receiverName", "$senderName"]
                                    },

                                    "senderIDs":1,
                                    "receiverIDs":1
                                }
                            },
                            {$group:{
                                "_id":"$receiverId",
                                "senderIDs": { "$first": "$senderIDs"},
                                "receiverIDs": { "$first": "$receiverIDs"},
                                "message": { "$first": "$message"},
                                "receivedDateAndTime": { "$first": "$receivedDateAndTime"},
                                "senderName": { "$first": "$senderName"},
                                "receiverName": { "$first": "$receiverName"},
                                "senderId": { "$first": "$senderId"},
                                "receiverId": { "$first": "$receiverId"},

                            }}

                             ]);*/
                            



                            //to check connected or not
                            if (coachAPPInboxDET && coachAPPInboxDET[0] && coachAPPInboxDET[0].senderIDs) {

                                //get the senderId and receiverId array
                                var senderIDs = _.union(coachAPPInboxDET[0].senderIDs, coachAPPInboxDET[0].receiverIDs);
                                //search either as loggedInId as sender and receID as recvd or 
                                //recId as recvr and loggedInId as senders
                                var connectedORNot = connectionRequests.aggregate([{
                                    $match: {
                                        $or: [{
                                            $and: [{
                                                loggedInId: xDATA.loggedInId
                                            }, {
                                                receiverId: {
                                                    $in: senderIDs
                                                }
                                            }]
                                        }, {
                                            $and: [{
                                                receiverId: xDATA.loggedInId
                                            }, {
                                                loggedInId: {
                                                    $in: senderIDs
                                                }
                                            }]
                                        }]
                                    }
                                }, {
                                    $project: {
                                        "senderId": {
                                            "$cond": [{
                                                $eq: ["$loggedInId", xDATA.loggedInId]

                                            }, "$receiverId", "$loggedInId"]
                                        },
                                        "status": "$status",
                                        "_id": 0
                                    }
                                }]);
                            
                                var c = _.map(coachAPPInboxDET, function(element) {
                                    var treasure = _.findWhere(connectedORNot, {
                                        senderId: element.senderId
                                    });

                                    return _.extend(element, treasure);
                                });
                            }


                            var message = "Messages"
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = coachAPPInboxDET;


                            return resultJson



                        } else {
                            var message = "Invalid Login"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                        }
                    }
                } else {
                    var message = "senderNameSortOrder and dateSortOrder value must be 1 or -1 " + "for ascending and decsending resp"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
    }
});

