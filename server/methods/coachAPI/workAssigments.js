import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
    "createAssignment": function(xDATA) {
        try {

            var senderId = xDATA.senderId
            var senderRole = xDATA.senderRole
            var receiverRole = xDATA.receiverRole
            var receiverId = xDATA.receiverId
            var messageType = xDATA.messageType.trim().toLowerCase()
            var message = xDATA.textMessage

            //check for already received
            var assigmentExists = workAssignments.findOne({
                $or: [{
                    $and: [{
                        senderId: xDATA.senderId
                    }, {
                        receiverId: xDATA.receiverId
                    }],
                }, {
                    $and: [{
                        receiverId: xDATA.senderId
                    }, {
                        senderId: xDATA.receiverId
                    }],
                }]
            });

            //insert

            if (assigmentExists == undefined) 
            {     
                var assignmentData = {
                    senderId: xDATA.senderId,
                    senderRole: xDATA.senderRole,
                    receiverRole: receiverRole,
                    receiverId: receiverId,
                    receivedDateAndTime:new Date(),
                    messagesBox: [{
                        _id:Random.id(),
                        messageType: messageType,
                        message: message,
                        receivedDateAndTime: new Date(),
                        senderId: senderId,
                        receiverId: receiverId,
                        senderRole: senderRole,
                        receiverRole: receiverRole,
                        set : xDATA.set,
                        setRepeat : xDATA.setRepeat,
                        startBy : moment(new Date(xDATA.startBy)).format("DD MMM YYYY"),
                        finishBy : moment(new Date(xDATA.finishBy)).format("DD MMM YYYY")

                    }]
                }

                var inboxInsert = workAssignments.insert(
                    assignmentData
                );
                //if inbox is saved
                if (inboxInsert) 
                {               
                    var message = "Assigned"
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = message.toString();
                    return resultJson
                }
                
            }        

            else if(assigmentExists != undefined)
            {
                var assignmentData = [{
                    _id:Random.id(),
                    messageType: messageType,
                    message: message,
                    receivedDateAndTime: new Date(),
                    senderId: senderId,
                    receiverId: receiverId,
                    senderRole: senderRole,
                    receiverRole: receiverRole,
                    set : xDATA.set,
                    setRepeat : xDATA.setRepeat,          
                    startBy : moment(new Date(xDATA.startBy)).format("DD MMM YYYY"),
                    finishBy : moment(new Date(xDATA.finishBy)).format("DD MMM YYYY")
                }]

            
                var updateINBOX = workAssignments.update({
                    "_id": assigmentExists._id
                    }, {$set: {
                        receivedDateAndTime:new Date(),
                    },
                    "$push": {
                        messagesBox: {
                            $each: assignmentData,
                            $position: 0
                        },
                    }
                });

                if (updateINBOX) 
                {     
                    var message = "Assigned"
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = message.toString();
                    return resultJson
                }     
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
    },
    "getAssignments": function(xDATA) 
    {
        try 
        {     

            if (xDATA && xDATA.loggedInId)
            {     
                var userInfo = Meteor.users.findOne({
                    "userId": xDATA.loggedInId
                })

                var userInfoDetail;
                if (userInfo) 
                {
                    if(userInfo.role == "Player")
                        userInfoDetail = nameToCollection(xDATA.loggedInId).findOne({
                            "userId": xDATA.loggedInId
                        })
                    else if(userInfo.role == "Coach")
                        userInfoDetail = otherUsers.findOne({
                            "userId": xDATA.loggedInId
                        });
                    if (userInfo && userInfoDetail) 
                    {
                        var groupIdQuery = {
                            receiverId: ""
                        }

                        var receiverIdQuery = [
                            {receiverId: xDATA.loggedInId}, 
                            {senderId: xDATA.loggedInId}]


                        var receiverIdQueryForAll = {
                            receiverId: "All"
                        }

                        //get all groupId of this loggin person
                        var getGroupIds = coachConnectedGroups.aggregate([
                            {$match: {$or:[
                                        {groupMembers: {$in:[xDATA.loggedInId]}},
                                        {"loggedInId":xDATA.loggedInId}
                                    ]}

                            },{$project: {
                                "groupId": "$_id"
                            }}, 
                            {$group: {
                                "_id": "group",
                                groupIds: {
                                    $push: "$groupId"
                                }
                            }}
                        ]);


                        if (getGroupIds && getGroupIds[0] && getGroupIds[0].groupIds) {
                            var arrayGroup = getGroupIds[0].groupIds
                            groupIdQuery = {
                                receiverId: {
                                    $in: arrayGroup
                                }
                            }
                        }

                        


                        /*var raw = workAssignments.rawCollection();
                        var distinct = Meteor.wrapAsync(raw.distinct, raw);
                        var connectedList = [];
                        var connectedList1 = distinct('senderId',{$or: [groupIdQuery, {
                                        $or: receiverIdQuery
                                        },
                                        receiverIdQueryForAll
                                    ],});
                        var connectedList2 = distinct('receiverId',{$or: [groupIdQuery, {
                                        $or: receiverIdQuery
                                        },
                                        receiverIdQueryForAll
                                    ],});

                        connectedList =  _.union(connectedList1, connectedList2);

                        var userList = Meteor.users.find({"userId":{$in:connectedList}},{fields:{"userId":1,"userName":1}}).fetch();
                        */
                        var workAssignmentList = workAssignments.aggregate([
                            {$match: {
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
                            {$sort: {receivedDateAndTime:-1}}, 
                            {$unwind:"$messagesBox"},
                            {$match:{
                                "messagesBox.deleteIds":{$nin:[xDATA.loggedInId]}
                            }},
                            {$group: {
                                    "_id":"$_id",                             
                                    "senderId": { "$first": "$senderId"},
                                    "receiverId": { "$first": "$receiverId"},
                                    "senderRole": { "$first": "$senderRole"},
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
                                },
                               

                            },
                            {$project:{
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
                                                  
                                    "senderIDs":1,
                                    "receiverIDs":1,
                                    "senderName": {$literal: ""},
                                    "receiverName": {$literal: ""},
                                    "mainId":"$_id",

                                }
                            },
                            {$group:{
                                "_id":"$receiverId",

                                "senderIDs": { "$first": "$senderIDs"},
                                "receiverIDs": { "$first": "$receiverIDs"},
                                "message": { "$last": "$message"},
                                "receivedDateAndTime": { "$last": "$receivedDateAndTime"},
                                "senderId": { "$first": "$senderId"},
                                "receiverId": { "$first": "$receiverId"},
                                "senderName":{ "$first": "$senderName"},
                                "receiverName":{ "$first": "$receiverName"},
                                "mainId":{ "$first": "$mainId"}


                            }}

                        ]);
                            
                        //to check connected or not
                        
                        if (workAssignmentList) 
                        {
                            var c = _.map(workAssignmentList, function(element) {
                                var senderInfo = Meteor.users.findOne({"userId":element.senderId});
                                if(senderInfo)
                                    element.senderName = senderInfo.userName;

                                var receiverInfo = Meteor.users.findOne({"userId":element.receiverId});
                                if(receiverInfo)
                                {
                                    element.receiverName = receiverInfo.userName;
                                    var senderIDs = _.union(element.senderIDs, element.receiverIDs);
                                    var connectedORNot = connectionRequests.findOne(
                                        {
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
                                        },
                                        {fields:{"status":1}}

                                    )
                                    
                                    if(connectedORNot)
                                    {
                                        if(connectedORNot.status)
                                        {
                                           element.status = connectedORNot.status;

                                        }
                                    }
                                    else
                                        element.status = "unconnected"
                                }
                                else
                                {
                                    var receiverInfo = coachConnectedGroups.findOne({"_id":element.receiverId});
                                    if(receiverInfo)
                                    {
                                       element.receiverName = receiverInfo.groupName;
                                       element.status = "accepted";
                                    }
                                }

                            });

                        
                        }

                        var message = "Messages"
                        var resultJson = {};
                        resultJson["status"] = "success";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = workAssignmentList;
                        
                        return resultJson
                    } 
                    else 
                    {
                        var message = "Invalid Login"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }

                }
                
                else 
                {
                    var message = "Invalid Login"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                } 
            } 
            else 
            {
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
    },
    "fetchThreadAssignments": function(xDATA) {
        try {
            //check for params
            if (xDATA && xDATA.senderId && xDATA.receiverId)
            {
                var allExists = false;
                var groupExists = false;
                var groupRole = "";
                var userRole = "Individual";
                var senderName ; 
                var receiverName;
          
                var senderInfo = Meteor.users.findOne({
                    "userId": xDATA.senderId});
                if(senderInfo)
                    senderName = senderInfo.userName;



                if(senderInfo == undefined)
                {
                    senderInfo = coachConnectedGroups.findOne({"_id":xDATA.senderId});
                    if(senderInfo)
                    {
                        groupExists = true;
                        senderName = senderInfo.groupName;
                        groupRole = "sender";
                    }
                }


                var receiverInfo = Meteor.users.findOne({
                    "userId": xDATA.receiverId});
                if(receiverInfo)
                    receiverName = receiverInfo.userName;
                if(receiverInfo == undefined)
                {
                    receiverInfo = coachConnectedGroups.findOne({"_id":xDATA.receiverId});
                    if(receiverInfo)
                    {
                        groupExists = true;
                        receiverName = receiverInfo.groupName;
                        groupRole = "receiver";

                    }
                }

                
                if(groupExists)
                    userRole = "Group";
             
               
                //if both are valid
                if (senderInfo && receiverInfo) 
                {                    
                    var receiverIdQuery = [
                        {
                            "senderId": xDATA.receiverId,
                            "receiverId":xDATA.senderId
                        }, 
                        {
                            "senderId": xDATA.senderId,
                            "receiverId":xDATA.receiverId,
                        }
                    ]
                                             
                    var receiverIdQueryForAll = {receiverId: "All"}
                      
                    var coachAPPInboxDET = workAssignments.aggregate([
                        {$match: {
                            $or: receiverIdQuery,
                        }}, 
                        {$sort: {receivedDateAndTime:-1}}, 
                        {$unwind:"$messagesBox"},   
                        {$match:{
                            "messagesBox.deleteIds":{$nin:[xDATA.loggedInId]}
                        }}, 
                        {$sort: {"messagesBox.receivedDateAndTime":-1}}, 
                        {$group:{
                                "_id":"$messagesBox._id",
                                "senderId": { "$first": "$messagesBox.senderId"},
                                "receiverId": { "$first": "$messagesBox.receiverId"},
                                "messageType": { "$first": "$messagesBox.messageType"},
                                "message": { "$first": "$messagesBox.message"},
                                "receivedDateAndTime": { "$first": "$messagesBox.receivedDateAndTime"},
                                "senderRole": { "$first": "$messagesBox.senderRole"},
                                "receiverRole": { "$first": "$messagesBox.receiverRole"},
                                "senderIDs": {$addToSet: "$senderId"},
                                "receiverIDs": {$addToSet: "$receiverId"},
                                "mainId": { "$first": "$_id"},
                                "set": { "$first": "$messagesBox.set"},
                                "setRepeat": { "$first": "$messagesBox.setRepeat"},
                                "startBy": { "$first": "$messagesBox.startBy"},
                                "finishBy": { "$first": "$messagesBox.finishBy"},
                                "assignmentStatus":{ "$first": "$messagesBox.assignmentStatus"}

                        }},
                        {$project:{

                            
                            "senderId123": {
                                "$cond": [{
                                    $eq: ["$senderId", xDATA.senderId]
                                }, "$senderId", "$receiverId"]
                            },                     
                            "receiverId123": {
                                "$cond": [{
                                     $eq: ["$receiverId", xDATA.receiverId]
                                }, "$receiverId", "$senderId"]
                            },
                            "senderName": {
                                "$cond": [{
                                    $eq: ["$senderId", xDATA.senderId]
                                }, senderName, receiverName]
                            },                     
                            "receiverName": {
                                "$cond": [{
                                     $eq: ["$receiverId", xDATA.receiverId]
                                }, receiverName, senderName]
                            },
                            "senderRole123": {
                                "$cond": [{
                                    $eq: ["$senderId", xDATA.senderId]
                                }, "$senderRole", "$receiverRole"]
                            },                     
                            "receiverRole123": {
                                "$cond": [{
                                     $eq: ["$receiverId", xDATA.receiverId]
                                }, "$receiverRole", "$senderRole"]
                            },

                            "senderId":1,
                            "receiverId":1,
                            "senderRole":1,
                            "receiverRole":1,
                            "messageType":1,
                            "message":1,
                            "receivedDateAndTime":1,
                            "senderIDs":1,
                            "receiverIDs":1,
                            "mainId":1,
                            "set":1,
                            "setRepeat":1,
                            "startBy":1,
                            "finishBy":1,
                            "assignmentStatus":1


                        }},
                        {$sort: {"receivedDateAndTime":1}}, 

                    ]);


                    //to check connected or not ( group or individual)
                    var connectionStatus = "";
                    var memberDetails = "";
                    if (coachAPPInboxDET && coachAPPInboxDET[0] && coachAPPInboxDET[0].senderIDs) 
                    {   
                        var senderIDs = _.union(coachAPPInboxDET[0].senderIDs, coachAPPInboxDET[0].receiverIDs);
                        if(groupExists)
                        {
                            var connectedORNot = coachConnectedGroups.findOne({
                                $or:[
                                {"loggedInId":xDATA.loggedInId},
                                {"groupMembers":{$in:[xDATA.loggedInId]}}
                                ],
                                "_id":xDATA.receiverId
                                });
                            if(connectedORNot)
                                connectionStatus = "accepted";

                           
                            var groupInfo = coachConnectedGroups.findOne({"_id":xDATA.senderId});
                            if(groupInfo)
                            {
                                memberDetails = Meteor.users.aggregate([
                                    {$match:{
                                        "userId":{$in:groupInfo.groupMembers}
                                    }},
                                    {$project:{
                                        "userName":1,
                                        "userId":1,
                                        "_id":0
                                    }}
                                ]);

                            }
                            else
                            {
                                var groupInfo = coachConnectedGroups.findOne({"_id":xDATA.receiverId});
                                if(groupInfo)
                                {
                                    memberDetails = Meteor.users.aggregate([
                                        {$match:{
                                            "userId":{$in:groupInfo.groupMembers}
                                        }},
                                        {$project:{
                                            "userName":1,
                                            "userId":1,
                                            "_id":0

                                        }}
                                    ]);

                                }
                            }
                                
                                
                        

                        }
                        else
                        {
                            var connectedORNot = connectionRequests.aggregate([
                                {$match: {
                                    $or: [{
                                        $and: [
                                            {loggedInId: xDATA.loggedInId}, 
                                            {receiverId: {$in: senderIDs}}
                                        ]}, {
                                        $and: [
                                            {receiverId: xDATA.loggedInId}, 
                                            {loggedInId: {$in: senderIDs}}
                                        ]
                                    }]
                                }}, 
                                {$project: {
                                    "senderId": {
                                        "$cond": [{
                                            $eq: ["$loggedInId", xDATA.loggedInId]
                                        }, "$receiverId", "$loggedInId"]
                                    },
                                    "status": "$status",
                                    "_id": 0
                                }}
                            ]);

                            if(connectedORNot[0])
                            {
                                if(connectedORNot[0].status)
                                    connectionStatus = connectedORNot[0].status;
                                
                            }   

                            memberDetails = Meteor.users.aggregate([
                                {$match:{
                                    "userId":{$in:[xDATA.senderId,xDATA.receiverId,xDATA.loggedInId]}
                                }},
                                {$project:{
                                    "userName":1,
                                    "userId":1,
                                    "_id":0
                                }}
                            ]);

                        }
                        
                        //by vinaya
                        if (coachAPPInboxDET[0].assignmentStatus != undefined && coachAPPInboxDET[0].assignmentStatus.length !=0){
                           var diff = _.difference(_.pluck(coachAPPInboxDET[0].assignmentStatus, "userId"), _.pluck(memberDetails, "userId"));
                           var mem2 = Meteor.users.aggregate([
                                {$match:{
                                    "userId":{$in:diff}
                                }},
                                {$project:{
                                    "userName":1,
                                    "userId":1,
                                    "_id":0
                                }}
                            ]);
                           memberDetails = memberDetails.concat(mem2);
                        }
                    }
                    var message = "Messages"
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = coachAPPInboxDET;
                    resultJson["connectionStatus"] = connectionStatus;
                    resultJson["memberDetails"] = memberDetails;

                    return resultJson
                } 
                else 
                {
                    var message = "Invalid sender/receiver"
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
    },
    "updateAssignmentStatus" : async function(xData)
    {
        try{
            if (xData && xData.id && xData.messageId) {

                var msgExists = workAssignments.findOne({
                    "_id":xData.id,
                    "messagesBox._id":xData.messageId
                });
                var statusTransaction;
                if(msgExists)
                {
                    //statusEntry 
                    var statusEntry = workAssignments.aggregate([
                        {$match:{
                            "_id":xData.id,
                            $and:[
                                    {
                                        messagesBox: { $elemMatch: {"_id": xData.messageId}},
                                    },
                                    {
                                        messagesBox: { $elemMatch: {"assignmentStatus.userId": xData.userId}},
                                    }
                            ]
                            
                        }}
                    ]);


                    if(statusEntry)
                    {
                        if(statusEntry.length > 0)
                        {

                            var userStatusDetails = {
                                "userId": xData.userId,
                                "userDate": new Date(),
                                "userStatus": xData.userStatus,
                            };


                            var statusTransaction_pull = workAssignments.update(
                                {
                                    "_id":xData.id,
                                    "messagesBox._id": xData.messageId,
                                    messagesBox: { $elemMatch: {"assignmentStatus.userId": xData.userId}},
                                },
                                {$pull:{
                                    "messagesBox.$.assignmentStatus" : { "userId" : xData.userId}
                                }
                            });

                            statusTransaction = workAssignments.update(
                                {   "_id":xData.id,
                                    "messagesBox._id": xData.messageId,
                                },
                                {$addToSet:{
                                    "messagesBox.$.assignmentStatus":userStatusDetails,         
                                }
                            });

                        }
                        else
                        {
                            var userStatusDetails = {
                                "userId": xData.userId,
                                "userDate": new Date(),
                                "userStatus": xData.userStatus,
                            };

                            statusTransaction = workAssignments.update(
                                {"_id":xData.id,
                                "messagesBox._id": xData.messageId,
                            },
                                {$addToSet:{
                                    "messagesBox.$.assignmentStatus":userStatusDetails,         
                                }
                            });
                        }
                    }


                }
                   

              

                if(statusTransaction)
                {



                    var emptyArray = [];
                    var resultJson = {};
                    var message = "Status updated succesfully"
                    resultJson["status"] = "success";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = emptyArray;
                    var result = await Meteor.call("fetchThreadAssignments",xData)
                    try{
                        if(result)
                        {
                            if(result.status && result.data)
                            {
                                if(result.status == "success")
                                {
                                    resultJson["data"] = result.data;   
                                    if(result.connectionStatus)
                                        resultJson["connectionStatus"] = result.connectionStatus;
                                    

                                }
                            }
                        }

                    }catch(e){

                    }



                    //notification

                    var assEntry = workAssignments.findOne(
                        {   "_id":xData.id,
                            "messagesBox._id": xData.messageId,
                        }, {
                        fields: {
                            _id: 0,
                            "senderId":1,
                            messagesBox: {
                                $elemMatch: {
                                    "_id": xData.messageId
                            }
                        }
                        }
                    });


                    if(assEntry && assEntry.messagesBox && assEntry.messagesBox.length > 0 && assEntry.messagesBox[0])
                    {
                        var assignmentMes = "";
                        if(assEntry.messagesBox[0].message)
                            assignmentMes = assEntry.messagesBox[0].message;
                        
                        var userInfo = Meteor.users.findOne({"userId":xData.userId});
                        if(userInfo)
                        {
                            var notifyData = {
                                "title": assignmentMes+" Assignment Status",
                                "body": userInfo.userName+" updated status ",
                                "sound": "default",
                                "badge": "0",
                                "topic": assEntry.senderId,
                                "categoryIdentifier": "assignmentStatus"
                            }

                            var dataParam = {};
                            dataParam["assignmentId"] = xData.id;
                            dataParam["assignmentThreadId"] = xData.messageId;
                            dataParam["assignmentUserId"] = xData.userId
                            dataParam["assignmentUpdatedBy"] = xData.userId
                            var findRecType = workAssignments.findOne({"_id":xData.id})
                            if(findRecType && findRecType.receiverRole && findRecType.receiverRole.trim() == "Group" && findRecType.receiverId){
                                var groupId = coachConnectedGroups.findOne({"_id":findRecType.receiverId})
                                if(groupId){
                                    dataParam["assignmentUserId"] = groupId._id
                                }
                            }
                           Meteor.call("sendNotification", notifyData, dataParam, 1, function(e, res) {})
                        
                        }
                    }               
                    return resultJson
                }
 
            } else {
                var resultJson = {};
                var message = "Require all parameters"
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        }catch(e){
        }
    },
    getAssignmentsInHaul:function(xData)
    {
        try{
            if (xData && xData.userId) {
                var det = Meteor.users.findOne({
                    "userId": xData.userId,
                });;
                if(det)
                {
                    var raw = connectionRequests.rawCollection();
                    var distinct = Meteor.wrapAsync(raw.distinct, raw);
                    var connectedList = [];
                    var connectedList1 = distinct('receiverId',{status: "accepted","loggedInId" : xData.userId});
                    var connectedList2 = distinct('loggedInId',{status: "accepted","receiverId" : xData.userId});

                    connectedList =  _.union(connectedList1, connectedList2);

                    var receiverIdQuery;
                    if(xData.receiverId)
                    {
                        receiverIdQuery = [
                            {
                                "senderId": xData.userId,
                                "receiverId":xData.receiverId
                            }, 
                            {
                                "senderId": xData.receiverId,
                                "receiverId":xData.userId,
                            }
                        ]
                    }
                    else
                    {
                        receiverIdQuery = [
                            {
                                "senderId": xData.userId,
                                "receiverId":{$in:connectedList}
                            }, 
                            {
                                "senderId": {$in:connectedList},
                                "receiverId":xData.userId,
                            }
                        ]
                    }
                     

var unwindArr = {$sort: {receivedDateAndTime:-1}};
var unwindMatch = {$sort: {receivedDateAndTime:-1}};
var unwindSort = {$sort: {receivedDateAndTime:-1}};
var check =false;
if(xData.startDate && xData.endDate)
{
    var momentStartDate = new Date(xData.startDate);
    var momentEndDate = new Date(xData.endDate);

    unwindArr = {$unwind:"$messagesBox"}; 
    unwindMatch = {$match:{
        "messagesBox.deleteIds":{$nin:[xData.userId]},
        $and:[
            {"messagesBox.receivedDateAndTime":{$gte:momentStartDate}},
            {"messagesBox.receivedDateAndTime":{$lte:momentEndDate}}
            ]
        ,
    }};
    unwindSort = {$sort: {"messagesBox.receivedDateAndTime":-1}};
    check = true;
}
else if(xData.startDate && xData.endDate == undefined)
{
    unwindArr = {$unwind:"$messagesBox"}; 
    unwindMatch = {$match:{
        "messagesBox.deleteIds":{$nin:[xData.userId]},
        "messagesBox.receivedDateAndTime":{$gte:momentStartDate}
    }};
    unwindSort = {$sort: {"messagesBox.receivedDateAndTime":-1}};
        check = true;

}
else if(xData.startDate == undefined && xData.endDate)
{
    unwindArr = {$unwind:"$messagesBox"}; 
    unwindMatch = {$match:{
        "messagesBox.deleteIds":{$nin:[xData.userId]},
        "messagesBox.receivedDateAndTime":{$lte:momentEndDate}
    }};
    unwindSort = {$sort: {"messagesBox.receivedDateAndTime":-1}};
        check = true;

}
var coachAPPInboxDET;
if(check)
{

    
    coachAPPInboxDET = workAssignments.aggregate([
                        {$match: {
                            $or: receiverIdQuery,
                        }}, 
                        {$sort: {receivedDateAndTime:-1}},
                        unwindArr,
                        unwindMatch,
                        unwindSort,
                        {$group:{
                                  "_id": "$_id", 
                                  "messagesBox": {"$push": "$messagesBox"},
                                   "senderId": { "$first": "$senderId"},
                                   "receiverId": { "$first": "$receiverId"},
                                   "senderRole": { "$first": "$senderRole"},
                                   "receiverRole": { "$first": "$receiverRole"},
                                   "receivedDateAndTime": { "$first": "$receivedDateAndTime"},                         
                                }},                               
                        {
                            $lookup: {
                                from: "users",
                                localField: "senderId",
                                foreignField: "userId",
                                as: "senderDetails"
                            }
                        },
                        {
                            $unwind: "$senderDetails"
                        },
                        {
                            $lookup:{
                                from: "users",       // other table name
                                localField: "receiverId",   // name of users table field
                                foreignField: "userId", // name of userinfo table field
                                as: "receiverDetails"         // alias for userinfo table
                            }
                        },
                        {   $unwind:"$receiverDetails" },
                        { 
                            $project : { 
                                "_id":1,
                                "senderId":1,
                                "senderRole":1,
                                "senderName":"$senderDetails.userName",
                                "receiverId":1,
                                "receiverRole":1,
                                "receiverName":"$receiverDetails.userName",
                                "receivedDateAndTime":1,
                                "messagesBox":1
                            } 
                        }         
             

                      
                    ]);

}
else
{
         coachAPPInboxDET = workAssignments.aggregate([
                        {$match: {
                            $or: receiverIdQuery,
                        }}, 
                        {$sort: {receivedDateAndTime:-1}},                     
                        {
                            $lookup: {
                                from: "users",
                                localField: "senderId",
                                foreignField: "userId",
                                as: "senderDetails"
                            }
                        },
                        {
                            $unwind: "$senderDetails"
                        },
                        {
                            $lookup:{
                                from: "users",       // other table name
                                localField: "receiverId",   // name of users table field
                                foreignField: "userId", // name of userinfo table field
                                as: "receiverDetails"         // alias for userinfo table
                            }
                        },
                        {   $unwind:"$receiverDetails" },
                        { 
                            $project : { 
                                "_id":1,
                                "senderId":1,
                                "senderRole":1,
                                "senderName":"$senderDetails.userName",
                                "receiverId":1,
                                "receiverRole":1,
                                "receiverName":"$receiverDetails.userName",
                                "receivedDateAndTime":1,
                                "messagesBox":1
                            } 
                        }         
             

                      
                    ]);


}
                

                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = "Assignments";
                    resultJson["data"] = coachAPPInboxDET;
                    return resultJson

                }
                else
                {
                     var message = "User is not valid"
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
                return resultJson;
            }

        }catch(e){

        }
    }
});