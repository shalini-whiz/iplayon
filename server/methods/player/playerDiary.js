import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({


    /**
     * Meteor Method to fetch opponent users of loggedIn user to create diary
     * @collectionName : userDetailsTT,userDetailsBT(based on sport),playerDetailsRecord(registered during sequence creation)
     * @passedByValues : xData - (contains userId)
     * @dataType : Json
     * @dbQuery : fetch opponent users of loggedIn user to create diary
     * @methodDescription : fetch opponent users of loggedIn user to create diary
     * @returnData : return arraylist of players
     * Usage - Player App
    */
    'fetchOpponentUsers':function(xData){
        try{
            var json = {};        
            var userId = xData.userId;
            var userExists = Meteor.users.findOne({"userId":userId});
            if(nameToCollection(userId) && userExists)
            {
                // registered players
                var registeredPlayersArr = nameToCollection(userId).aggregate([
                    {$match:{      
                        "userName":{$nin:["",null]},
                        "userId":{$nin:[userId]}                             
                    }},           
                    {$group: { "_id":{
                        "playerName":"$userName",
                        "userId":"$userId"}
                    }},
                    {$project:{
                        "playerName":"$_id.playerName" ,
                        "userId":"$_id.userId",
                        "_id":0,
                        "insensitive": { "$toLower": "$_id.playerName" }
                    }},
                    {$sort: {"insensitive":1}},
                    {$project:{
                        "playerName":1,
                        "userId":1
                    }}
                ]);

                var customPlayers = [];
                if(userExists.interestedProjectName && userExists.interestedProjectName.length > 0  && 
                    userExists.interestedProjectName[0] != null && userExists.interestedProjectName[0] != "")
                {
                    //custom players
                    customPlayers =playerDetailsRecord.aggregate([
                        {$match:{"loggerId" : userId,"sportId":userExists.interestedProjectName[0]}},
                        {$project:{
                            "playerName":1,
                            "userId":"$_id",
                            "_id":0
                        }}
                    ])
                }
            
                json["opponentPlayers"] = _.union(registeredPlayersArr,customPlayers);              
          
                return json;
            }
            

            
        }catch(e){

        }
    },

    /**
     * Meteor Method to create player diary
     * @collectionName : matchDiary
     * @passedByValues : xData - (contains playerAId,playerBId,scores,winner,weblink,matchdate)
     * @dataType : Json
     * @dbQuery : insert record in dbName playerDiary
     * @methodDescription : Create player diary
     * @returnData : return json with status 'success/failure' and message
     * Usage - Player App
    */
    "createDiary":function(xData){
        try
        {
            var userExists = false;
            if(xData.playerAId)
             userExists = Meteor.users.findOne({"userId":xData.playerAId});

            if(xData.playerAId && xData.playerBId && userExists &&
                userExists.interestedProjectName && userExists.interestedProjectName.length > 0  && 
                    userExists.interestedProjectName[0] != null && userExists.interestedProjectName[0] != ""
                )
            {

                var playerBId = "";
                var loggerSport = userExists.interestedProjectName[0];
                if(xData.playerBId.trim().toLowerCase() == "new")
                {

                    var playerRegObj = new RegExp(xData.playerBName, 'i');
                    var userNameEntryInfo = playerDetailsRecord.findOne({"loggerId" :xData.userId,"playerName":{$regex:playerRegObj}});
                    if(userNameEntryInfo == undefined)
                    {
                        var result = playerDetailsRecord.insert({"loggerId":xData.userId,"playerName":xData.playerBName,"playerHand":"Unknown","foreHandRT":[],"backHandRT":[],"sportId":loggerSport});
                        playerBId = result;
                    } 
                    else
                        playerBId = userNameEntryInfo._id;
                }
                else
                    playerBId = xData.playerBId;
                var matchDate = new Date();
                var webLink = "";
                var winnerId = "";
                if(xData.setA1 == undefined)
                    xData.setA1 = 0;
                if(xData.setA2 == undefined)
                    xData.setA2 = 0;
                if(xData.setA3 == undefined)
                    xData.setA3 = 0;
                if(xData.setA4 == undefined)
                    xData.setA4 = 0;
                if(xData.setA5 == undefined)
                    xData.setA5 = 0;
                if(xData.setA6 == undefined)
                    xData.setA6 = 0;
                if(xData.setA7 == undefined)
                    xData.setA7 = 0;



                if(xData.setB1 == undefined)
                    xData.setB1 = 0;
                if(xData.setB2 == undefined)
                    xData.setB2 = 0;
                if(xData.setB3 == undefined)
                    xData.setB3 = 0;
                if(xData.setB4 == undefined)
                    xData.setB4 = 0;
                if(xData.setB5 == undefined)
                    xData.setB5 = 0;
                if(xData.setB6 == undefined)
                    xData.setB6 = 0;
                if(xData.setB7 == undefined)
                    xData.setB7 = 0;

                var setScoresA = [xData.setA1,xData.setA2,xData.setA3,xData.setA4,xData.setA5,xData.setA6,xData.setA7];
                var setScoresB = [xData.setB1,xData.setB2,xData.setB3,xData.setB4,xData.setB5,xData.setB6,xData.setB7];
                if(xData.matchDate)
                    matchDate =  moment(new Date(xData.matchDate)).format("DD MMM YYYY");
                if(xData.webLink)
                    webLink = xData.webLink;
                if(xData.winnerId)
                {
                    if(xData.winnerId.trim().toLowerCase() == "new")
                        winnerId = playerBId;
                    else
                        winnerId = xData.winnerId
                }

                
                var scores = {
                "setScoresA": setScoresA,
                "setScoresB": setScoresB
                };
                var result = matchDiary.insert({
                    "playerAId":xData.playerAId,
                    "playerBId":playerBId,
                    "matchDate":matchDate,
                    "scores":scores,
                    "winnerId":winnerId,
                    "webLink":webLink
                })
                if(result)
                {
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = "Match Entry created";
                    return resultJson;
                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Could not create match entry!!";
                    return resultJson;
                }

            }
        }catch(e)
        {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Could not create match entry!!";
            return resultJson;
        }
    },
      /**
     * Meteor Method to update recorded player diary
     * @collectionName : matchDiary
     * @passedByValues : xData - (contains recordId,userId)
     * @dataType : Json
     * @dbQuery : update particular record in dbName playerDiary
     * @methodDescription : update particular record in a diary of him
     * @returnData : return json with status 'success/failure',message     
     * Usage - Player App
    */
    updateDiary:function(xData)
    {
        try{
            if(xData.userId && xData.recordId)
            {
                var userInfo = Meteor.users.findOne({"userId":xData.userId});
                if(userInfo)
                {
                    var matchExists = matchDiary.findOne({"_id":xData.recordId,"playerAId":xData.userId});
                    if(matchExists)
                    {

                        var playerBId = "";
                        if(xData.playerBId.trim().toLowerCase() == "new")
                        {
                            var playerRegObj = new RegExp(xData.playerBName, 'i');
                            var userNameEntryInfo = playerDetailsRecord.findOne({"loggerId" :xData.userId,"playerName":{$regex:playerRegObj}});
                            if(userNameEntryInfo == undefined)
                            {
                                var result = playerDetailsRecord.insert({"loggerId":xData.userId,"playerName":xData.playerBName,"playerHand":"Unknown","foreHandRT":[],"backHandRT":[]});
                                playerBId = result;
                            } 
                            else
                                playerBId = userNameEntryInfo._id;
                        }
                        else
                            playerBId = xData.playerBId;

                        var matchDate = new Date();
                        var webLink = "";
                        var winnerId = "";
                        if(xData.setA1 == undefined)
                            xData.setA1 = 0;
                        if(xData.setA2 == undefined)
                            xData.setA2 = 0;
                        if(xData.setA3 == undefined)
                            xData.setA3 = 0;
                        if(xData.setA4 == undefined)
                            xData.setA4 = 0;
                        if(xData.setA5 == undefined)
                            xData.setA5 = 0;
                        if(xData.setA6 == undefined)
                            xData.setA6 = 0;
                        if(xData.setA7 == undefined)
                            xData.setA7 = 0;


                        if(xData.setB1 == undefined)
                            xData.setB1 = 0;
                        if(xData.setB2 == undefined)
                            xData.setB2 = 0;
                        if(xData.setB3 == undefined)
                            xData.setB3 = 0;
                        if(xData.setB4 == undefined)
                            xData.setB4 = 0;
                        if(xData.setB5 == undefined)
                            xData.setB5 = 0;
                        if(xData.setB6 == undefined)
                            xData.setB6 = 0;
                        if(xData.setB7 == undefined)
                            xData.setB7 = 0;

                        var setScoresA = [xData.setA1,xData.setA2,xData.setA3,xData.setA4,xData.setA5,xData.setA6,xData.setA7];
                        var setScoresB = [xData.setB1,xData.setB2,xData.setB3,xData.setB4,xData.setB5,xData.setB6,xData.setB7];
                        if(xData.matchDate)
                            matchDate =  moment(new Date(xData.matchDate)).format("DD MMM YYYY");

                        if(xData.webLink)
                            webLink = xData.webLink;
                        if(xData.winnerId)
                        {
                            if(xData.winnerId.trim().toLowerCase() == "new")
                                winnerId = playerBId;
                            else
                                winnerId = xData.winnerId
                        }

                        var scores = {
                        "setScoresA": setScoresA,
                        "setScoresB": setScoresB
                        };


                    


                        var matchUpdate = matchDiary.update({"_id":xData.recordId},
                            {$set:{
                                "playerBId":playerBId,
                                "matchDate":matchDate,
                                "scores":scores,
                                "winnerId":winnerId,
                                "webLink":webLink
                            }
                        });
                        if(matchUpdate)
                        {
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = "Successfully updated!";

                            /*
                            Meteor.call("fetchMyDiary",xData,function(error,result){
                                if(result)
                                {
                                    if(result.status)
                                    {
                                        if(result.status == "success")
                                        {
                                            if(result.data)
                                                resultJson["data"] = result.data;

                                        }
 
                                    }
                                }
                            })
                            
                            */

                            return resultJson;
                        }
                        else
                        {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Could not update!";
                            return resultJson;
                        }
                    } 
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid data!!";
                        return resultJson;
                    }
                   
                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user!!";
                    return resultJson;
                }
            }
            else
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Require all parameters!!";
                return resultJson;
            }


        }catch(e){
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    /**
     * Meteor Method to delete recorded player diary
     * @collectionName : matchDiary
     * @passedByValues : xData - (contains recordId,userId)
     * @dataType : Json
     * @dbQuery : delete particular record in dbName playerDiary
     * @methodDescription : delete particular record in a diary of him
     * @returnData : return json with status 'success/failure',message,data(with updated list of his diary)
     * Usage - Player App
    */
    deleteDiary:async function(xData)
    {
        try
        {
            if(xData.userId && xData.recordId)
            {
                var userInfo = Meteor.users.findOne({"userId":xData.userId});
                if(userInfo)
                {
                    var matchExists = matchDiary.findOne({"_id":xData.recordId,"playerAId":xData.userId});
                    if(matchExists)
                    {

                        var matchRemove = matchDiary.remove({"_id":xData.recordId});
                        if(matchRemove)
                        {
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = "Removed!";

                            var result = await Meteor.call("fetchMyDiary",xData)
                            try{
                                if(result)
                                {
                                    if(result.status)
                                    {
                                        if(result.status == "success")
                                        {
                                            if(result.data)
                                                resultJson["data"] = result.data;

                                        }
 
                                    }
                                }
                            }catch(e){}
                            
                            return resultJson;
                        }
                        else
                        {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Could not delete!";
                            return resultJson;
                        }
                    } 
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid data!!";
                        return resultJson;
                    }
                   
                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user!!";
                    return resultJson;
                }
            }
            else
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Require all parameters!!";
                return resultJson;
            }
        }catch(e){
             var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },

    /**
     * Meteor Method to fetch complete recorded diary of loggedIn user
     * @collectionName : matchDiary
     * @passedByValues : xData - (contains userId - loggedIn Id)
     * @dataType : Json
     * @dbQuery : fetch complete recorded diary  in dbName playerDiary
     * @methodDescription : Fetch complete player diary
     * @returnData : return json with status 'success/failure' and message
     * Usage - Player App
    */
    "fetchMyDiary":async function(xData)
    {
        try
        {
            if(xData.userId)
            {
                var userInfo = Meteor.users.findOne({"userId":xData.userId});
                if(userInfo)
                {
                    if(userInfo.role == "Player" && nameToCollection(xData.userId))
                    {
                        var userDetail = nameToCollection(xData.userId).findOne({"userId":xData.userId});
                        if(userDetail)
                        {

                            var diaryList = matchDiary.aggregate([
                                {$match:{
                                    "playerAId":xData.userId
                                }},
                                {$project:{
                                    "playerAId":1,
                                    "playerBId":1,
                                    "playerAName":{"$literal":userInfo.userName},
                                    "matchDate":1,
                                    "scores":1,
                                    "winnerId":1,
                                    "webLink":1,
                                    "sharedTo":1
                                }}

                                ])


                            var sharedList = [];
                            var unSharedList = [];
                            var sharedListQue = matchDiary.aggregate([
                                {$match:{
                                    "playerAId":xData.userId,
                                    "sharedTo":{$nin:["",null]}
                                }},
                                {$project: {
                                    "_id":1, 
                                    "playerAId":1,  
                                    shareSize: {$size: "$sharedTo"}
                                }},
                                {$match: 
                                    {"shareSize": {$gt: 0}
                                }},
                                {$group:{
                                    "_id":"$playerAId",
                                    "userlist": { "$push": "$_id" }, 
                                }},
                                {$project:{
                                    "_id":0,
                                    "userlist":1
                                }}
                                
                            ]);

                            var emptyArray = [];
                            var unSharedListQue = matchDiary.aggregate([
                                {$match:{
                                    "playerAId":xData.userId,
                                    $or:[
                                        {"sharedTo":emptyArray},
                                        {"sharedTo":{$in:["",null]}}
                                    ]                           
                                }},
                                {$group:{
                                    "_id":"$playerAId",
                                    "userlist": { "$push": "$_id" }, 
                                }},
                                {$project:{
                                    "_id":0,
                                    "userlist":1
                                }}
                                
                            ]);

                            
                            var xx = matchDiary.aggregate([
                                {$match:{
                                    "playerAId":xData.userId,
                                    "sharedTo":[]
                                }}
                                
                                ]);
                            if(sharedListQue && sharedListQue.length > 0)
                            {
                                if(sharedListQue[0].userlist)
                                    sharedList = sharedListQue[0].userlist
                            } 

                            if(unSharedListQue && unSharedListQue.length > 0)
                            {
                                if(unSharedListQue[0].userlist)                            
                                    unSharedList = unSharedListQue[0].userlist;
                                
                            }     
                            var c = _.map(diaryList, function(element) {
                                var playerBInfo = Meteor.users.findOne({"userId":element.playerBId});
                                if(playerBInfo)
                                    element.playerBName = playerBInfo.userName;
                                else
                                {
                                    playerBInfo = playerDetailsRecord.findOne({"_id":element.playerBId});
                                    if(playerBInfo)
                                        element.playerBName = playerBInfo.playerName;
                                }
                            });
                            
                            var objectJson = {};
                            objectJson["playerId"] = xData.userId;
                            var connectedMembers = [];
                            var result = await Meteor.call("getConnectedMembersForGivenPlayerID",objectJson)
                            try{
                                if(result)
                                {
                                    if(result.status == "success")
                                    {
                                        if(result.data)
                                            connectedMembers = result.data;
                                    }
                                }
                            }catch(e){}
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = "data";
                            resultJson["data"] = diaryList;
                            resultJson["connectedMembers"] = connectedMembers;
                            resultJson["sharedList"] = sharedList;
                            resultJson["unSharedList"] = unSharedList;
                            return resultJson;

                        }
                        else
                        {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Invalid role!!";
                            return resultJson;
                        }
                    }
                    else if(userInfo.role == "Coach")
                    {   
                        var userDetail = otherUsers.findOne({"userId":xData.userId});
                        if(userDetail)
                        {

                            var diaryList = matchDiary.aggregate([
                                {$match:{
                                    $or:[
                                        {"playerAId":xData.userId},
                                        {"sharedTo":{$in:[xData.userId]}}
                                    ]
                                }},
                                {$project:{
                                    "playerAId":1,
                                    "playerBId":1,
                                    "playerAName":{"$literal":userInfo.userName},
                                    "matchDate":1,
                                    "scores":1,
                                    "winnerId":1,
                                    "webLink":1,
                                    "sharedTo":1
                                }}

                                ])


                            var sharedList = [];
                            var unSharedList = [];
                            var sharedListQue = matchDiary.aggregate([
                                {$match:{
                                    "playerAId":xData.userId,
                                    "sharedTo":{$nin:["",null]}
                                }},
                                {$project: {
                                    "_id":1, 
                                    "playerAId":1,  
                                    shareSize: {$size: "$sharedTo"}
                                }},
                                {$match: 
                                    {"shareSize": {$gt: 0}
                                }},
                                {$group:{
                                    "_id":"$playerAId",
                                    "userlist": { "$push": "$_id" }, 
                                }},
                                {$project:{
                                    "_id":0,
                                    "userlist":1
                                }}
                                
                            ]);

                            var emptyArray = [];
                            var unSharedListQue = matchDiary.aggregate([
                                {$match:{
                                    "playerAId":xData.userId,
                                    $or:[
                                        {"sharedTo":emptyArray},
                                        {"sharedTo":{$in:["",null]}}
                                    ]                           
                                }},
                                {$group:{
                                    "_id":"$playerAId",
                                    "userlist": { "$push": "$_id" }, 
                                }},
                                {$project:{
                                    "_id":0,
                                    "userlist":1
                                }}
                                
                            ]);

                            
                            var xx = matchDiary.aggregate([
                                {$match:{
                                    "playerAId":xData.userId,
                                    "sharedTo":[]
                                }}
                                
                                ]);
                            if(sharedListQue && sharedListQue.length > 0)
                            {
                                if(sharedListQue[0].userlist)
                                    sharedList = sharedListQue[0].userlist
                            } 

                            if(unSharedListQue && unSharedListQue.length > 0)
                            {
                                if(unSharedListQue[0].userlist)                            
                                    unSharedList = unSharedListQue[0].userlist;
                                
                            }     
                            var c = _.map(diaryList, function(element) {


                                var playerAInfo = Meteor.users.findOne({"userId":element.playerAId});
                                if(playerAInfo)
                                    element.playerAName = playerAInfo.userName;
                                else
                                {
                                    playerAInfo = playerDetailsRecord.findOne({"_id":element.playerAId});
                                    if(playerBInfo)
                                        element.playerAName = playerAInfo.playerName;
                                }


                                var playerBInfo = Meteor.users.findOne({"userId":element.playerBId});
                                if(playerBInfo)
                                    element.playerBName = playerBInfo.userName;
                                else
                                {
                                    playerBInfo = playerDetailsRecord.findOne({"_id":element.playerBId});
                                    if(playerBInfo)
                                        element.playerBName = playerBInfo.playerName;
                                }


                            });
                            
                            var objectJson = {};
                            objectJson["playerId"] = xData.userId;
                            var connectedMembers = [];
                            var result =await Meteor.call("getConnectedMembersForGivenPlayerID",objectJson)
                            try{
                                if(result)
                                {
                                    if(result.status == "success")
                                    {
                                        if(result.data)
                                            connectedMembers = result.data;
                                    }
                                }
                            }catch(e){}
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = "data";
                            resultJson["data"] = diaryList;
                            resultJson["connectedMembers"] = connectedMembers;
                            resultJson["sharedList"] = sharedList;
                            resultJson["unSharedList"] = unSharedList;
                            return resultJson;

                        }
                        else
                        {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Invalid role!!";
                            return resultJson;
                        }
                    }
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid role!!";
                        return resultJson;
                    }

                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user!!";
                    return resultJson;
                }
            }
            else
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Require all parameters!!";
                return resultJson;
            }
        }catch(e)
        {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;

        }
    },
    /**
     * Meteor Method to fetch particular recorded diary of loggedIn user
     * @collectionName : matchDiary
     * @passedByValues : xData - (contains userId - loggedIn  user,recordId - id of the diary)
     * @dataType : Json
     * @dbQuery : fetch particular record in dbName playerDiary
     * @methodDescription : fetch particular player diary
     * @returnData : return json with status 'success/failure' and message
     * Usage - Player App
    */
    fetchDiaryRecord:async function(xData)
    {
        try
        {
            if(xData.userId && xData.recordId)
            {
                var userInfo = Meteor.users.findOne({"userId":xData.userId});
                if(userInfo)
                {
                    var matchExists = matchDiary.findOne({"_id":xData.recordId});
                    var opponentPlayers = [];
                    if(matchExists)
                    {
                        if(userInfo.role.toLowerCase() == "player")
                        {
                            var result = await Meteor.call("fetchOpponentUsers",xData)
                            try{
                                if(result)
                                {
                                    if(result.opponentPlayers)
                                        opponentPlayers = result.opponentPlayers;
                                }
                            }catch(e){}
                        }
                        

                        //custom players
                        var customPlayers1 = [];
                        if(nameToCollection(matchExists.playerAId))
                        customPlayers1 = nameToCollection(matchExists.playerAId).aggregate([
                            {$match:{"userId" : {$in:[matchExists.playerAId,matchExists.playerBId]}}},
                            {$project:{
                                "playerName":"$userName",
                                "userId":"$userId",
                                "_id":0
                            }}
                        ]);

                         //custom players
                        var customPlayers2 =playerDetailsRecord.aggregate([
                            {$match:{"_id" : {$in:[matchExists.playerAId,matchExists.playerBId]}}},
                            {$project:{
                                "playerName":1,
                                "userId":"$_id",
                                "_id":0
                            }}
                        ])


                        var existingUsers = _.union(customPlayers1,customPlayers2);   


                        var resultJson = {};
                        resultJson["status"] = "success";
                        resultJson["response"] = "Match Record!!";
                        resultJson["data"] = matchExists;
                        resultJson["existingUsers"] = existingUsers;
                        resultJson["opponentPlayers"] = opponentPlayers;

                        return resultJson;
                        
                    } 
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid data!!";
                        return resultJson;
                    }
                   
                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user!!";
                    return resultJson;
                }
            }
            else
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Require all parameters!!";
                return resultJson;
            }
        }catch(e){
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
    /**
     * Meteor Method to share recorded diary of loggedIn user
     * @collectionName : matchDiary
     * @passedByValues : xData - (contains userId - loggedIn  user,sharedList - array of diary id's, sharedId - array of user id to 
     whom diary need to be shared)
     * @dataType : Json
     * @dbQuery : share recorded diary of loggedIn user in dbName playerDiary
     * @methodDescription : share recorded diary of loggedIn user
     * @returnData : return json with status 'success/failure' and message
     * Usage - Player App
    */
    shareMyDiary:async function(xData)
    {
        try{
            if(xData.userId)
            {
                var userInfo = Meteor.users.findOne({"userId":xData.userId});
                if(userInfo)
                {
                    if(userInfo.role == "Player" && nameToCollection(xData.userId))
                    {
                        var userDetail = nameToCollection(xData.userId).findOne({"userId":xData.userId});
                        if(userDetail)
                        {

                            //acutal code
                            var shareUpdate = matchDiary.update(
                                    {"playerAId":xData.userId,
                                        "_id":{$in:xData.sharedList}
                                    },
                                    {$addToSet:{"sharedTo":xData.sharedId}},
                                    {multi:true}
                                );


                            var unShareUpdate = matchDiary.update(
                                    {"playerAId":xData.userId,
                                        "_id":{$in:xData.unSharedList}
                                    },
                                    {$pull:{"sharedTo":xData.sharedId}},
                                    {multi:true}
                                );
                            var resultJson = {};
                            resultJson["status"] = "success";
                            if(shareUpdate)
                                resultJson["response"] = "Successfully shared";
                            if(unShareUpdate)
                                resultJson["response"] = "Successfully unshared";

                            var result = await Meteor.call("fetchMyDiary",xData)
                            try{
                                if(result)
                                {
                                    if(result.status)
                                    {
                                        if(result.status == "success")
                                        {
                                            if(result.data)
                                                resultJson["data"] = result.data;
                                            if(result.connectedMembers)
                                                resultJson["connectedMembers"] = result.connectedMembers;
                                            if(result.sharedList)
                                                resultJson["sharedList"] = result.sharedList;
                                            if(result.unSharedList)
                                                resultJson["unSharedList"] = result.unSharedList;
                   
                                        }
 
                                    }
                                }
                            }catch(e){}

                        
                           
                            return resultJson;
                            

                        }
                        else
                        {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Invalid role!!";
                            return resultJson;
                        }
                    }
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid role!!";
                        return resultJson;
                    }

                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user!!";
                    return resultJson;
                }
            }
            else
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Require all parameters!!";
                return resultJson;
            }

        }catch(e){
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },
     /**
     * Meteor Method to fetch members to whom particular diary is been shared
     * @collectionName : matchDiary
     * @passedByValues : xData - (contains userId - loggedIn  user,recordId - id of the diary)
     * @dataType : Json
     * @dbQuery : fetch members to whom particular diary is been shared
     * @methodDescription : fetch members to whom particular diary is been shared
     * @returnData : return json with status 'success/failure' and message
     * Usage - Player App
    */
    fetchSharedMembers:function(xData)
    {
        try{
            if(xData.userId && xData.recordId)
            {
                var userInfo = Meteor.users.findOne({"userId":xData.userId});
                if(userInfo)
                {
                    var matchExists = matchDiary.findOne({"_id":xData.recordId});
                    if(matchExists)
                    {
                        if(matchExists.sharedTo)
                        {
                            var data = Meteor.users.find({"userId":{$in:matchExists.sharedTo}},{fields:{"userName":1,"userId":1,"_id":0}}).fetch();
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = "Shared Users!";
                            resultJson["data"] = data;
                            return resultJson;
                        }
                        else
                        {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Not shared to anyone!";
                            return resultJson;
                        }
                    } 
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid data!!";
                        return resultJson;
                    }
                   
                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid user!!";
                    return resultJson;
                }
            }
            else
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Require all parameters!!";
                return resultJson;
            }

        }catch(e){
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
        }
    },


    diaryAnalysis:function(xData)
    {
        var successJson = succesData();
        var failureJson = failureData();
        var errorMsg = [];
        try{
            if(xData)
            {           
                var objCheck = Match.test(xData, {"playerAId":String,"playerBId":String,
                    "year":Match.Maybe(Number),"month":Match.Maybe(Number),
                    "startDate":Match.Maybe(String),"endDate":Match.Maybe(String)});
                
                if(objCheck)
                {   
                    
                    var startDateValid = undefined;
                    var endDateValid = undefined;

                    if(xData.startDate)
                    {
                        var startDateValid = validDateString(xData.startDate,"dd/MMM/yyyy")
                        if(startDateValid == false)
                            errorMsg.push(dateMsg)
                    }

                    if(xData.endDate)
                    {
                        var endDateValid = validDateString(xData.endDate,"dd/MMM/yyyy")
                        if(endDateValid == false)
                            errorMsg.push(dateMsg)
                    }

                    if(errorMsg.length > 0)
                    {
                        failureJson["message"] = "Could not fetch diaryAnalysis";
                        failureJson["errorMsg"] = errorMsg;
                        return failureJson;
                    }
                    else
                    {
                        var matchJson = {};
                        var groupJson = {};
                        groupJson["playerAId"] = "$playerAId";
                        var valEndDate = undefined;
                        var calcDate = new Date(xData.endDate);

                        if(xData.endDate)
                            valEndDate = moment(calcDate.setDate(calcDate.getDate()+1)).format("DD MMM YYYY");



                        // matchJson["winnerId"] = {$nin:[null,""]}
                       /* if(xData.year){
                            matchJson["diaryYear"] = xData.year;
                            groupJson["year"]="$diaryYear"

                        }
                        if(xData.month){
                            matchJson["diaryMonth"] = xData.month;
                            groupJson["month"] = "$diaryMonth";
                        }*/

                        if(xData.startDate && xData.endDate)
                        {
                                matchJson["matchDate"]= {
                                    $gte:new Date(startDateValid),
                                    $lte:new Date(valEndDate)
                                }
                            groupJson["matchDate"] = "$matchDate";

                        }
                       /* else if(xData.startDate)
                        {
                            matchJson["matchDate"] = {$gte:new Date(startDateValid)}
                        }
                        else if(xData.endDate)
                            matchJson["matchDate"] = {$lte:new Date(endDateValid)}
                        */
                          

                        //groupJson["diaryYear"] = "$diaryYear";
                       // groupJson["diaryMonth"] = "$diaryMonth";


                        var diaryList = matchDiary.aggregate([
                            {$match:{
                                $or:[{
                                    "playerAId":xData.playerAId,
                                    "playerBId":xData.playerBId
                                },{
                                    "playerAId":xData.playerBId,
                                    "playerBId":xData.playerAId
                                }],                          
                            }},
                            {$project : { 
                                "day":{$dayOfMonth:"$matchDate"},
                                diaryMonth : {$month : "$matchDate"}, 
                                diaryYear : {$year :  "$matchDate"},
                                "matchDate":"$matchDate",
                                "winnerId":"$winnerId",
                                "playerAId": { $cond: [ { $eq: [ "$playerAId", xData.playerAId ] }, "$playerAId", "$playerBId"]},
                                "playerBId": { $cond: [ { $eq: [ "$playerAId", xData.playerAId ] }, "$playerBId", "$playerAId"]},
                                "scoreA": { $cond: [ { $eq: [ "$playerAId", xData.playerAId ] }, "$scores.setScoresA", "$scores.setScoresB"]},
                                "scoreB": { $cond: [ { $eq: [ "$playerAId", xData.playerAId ] }, "$scores.setScoresB", "$scores.setScoresA"]},
                            }},
                            {$match:matchJson},
                            {$group:{"_id":groupJson,
                                "winCount":{$sum:{
                                    "$cond": { 
                                        "if": { "$eq": [ "$winnerId", xData.playerAId ] }, 
                                        "then": 1,
                                        "else": 0
                                    }
                                }},
                                "lossCount":{$sum:{
                                    "$cond": { 
                                        "if": { "$eq": [ "$winnerId", xData.playerAId ] }, 
                                        "then": 0,
                                        "else":1
                                    }
                                }},
                                "diaryMonth" :{$first:"$diaryMonth"},
                                "day" :{$first:"$day"}


                            }},
                            {$project:{
                                "playerAId":"$_id.playerAId",
                                "playerBId":"$_id.playerBId",
                                "winCount":1,
                                "lossCount":1,
                                "diaryMonth":1,
                                "day":1
                            }}
                                    
                        ]);

                        successJson["message"] = "Match diary";
                        successJson["data"] = diaryList;

                        return successJson;

                    }
                   
                   
                }
                else
                {
                    failureJson["message"] = paramMsg;
                    return failureJson;
                }
            }
            else
            {
                failureJson["message"] = paramMsg;
                return failureJson;
            }
        }catch(e){
            failureJson["message"] = "Could not fetch diaryAnalysis"+e;
            return failureJson;
        }
    },
    diaryPerformAnalysis:function(xData)
    {
        var successJson = succesData();
        var failureJson = failureData();
        var errorMsg = [];
        try{
            if(xData)
            {           
                var objCheck = Match.test(xData, {"playerAId":String,"playerBId":String,
                    "matchDate":String,"type":String
                });
                
                if(objCheck)
                {   
                    
                    var startDateValid = undefined;

                   
                    var startDateValid = validDateString(xData.matchDate,"dd/MMM/yyyy")
                    if(startDateValid == false)
                        errorMsg.push(dateMsg)
                    

                    var matchJson = {};
                    if(xData.type == "win")
                        matchJson["winnerId"] = xData.playerAId;
                    else 
                        matchJson["winnerId"] = xData.playerBId;



                    if(errorMsg.length > 0)
                    {
                        failureJson["message"] = "Could not fetch diaryAnalysis";
                        failureJson["errorMsg"] = errorMsg;
                        return failureJson;
                    }
                    else
                    {

                       // var matchDate= {$eq:{"$date":startDateValid}};
                       // matchDate= {$eq:new Date(moment(new Date(xData.matchDate)).format("YYYY-MM-DD"))} ;
                        //matchDate= startDateValid

                        var diaryList = matchDiary.aggregate([
                            {$match:{
                                $or:[{
                                    "playerAId":xData.playerAId,
                                    "playerBId":xData.playerBId
                                },{
                                    "playerAId":xData.playerBId,
                                    "playerBId":xData.playerAId
                                }],                                
                                "matchDate": new Date(xData.matchDate)                         
                            }},
                            {$group:{
                                "_id":"$_id",
                                "matchDate":{$first:"$matchDate"},
                                "winnerId":{$first:"$winnerId"},
                                "playerAId":{$first:"$playerAId"},
                                "playerBId":{$first:"$playerBId"},
                                "scores":{$first:"$scores"}
                            }},
                            {$match:matchJson},
                            {$project : { 
                                "matchDate":"$matchDate",
                                "winnerId":"$winnerId",
                                "playerAId": { $cond: [ { $eq: [ "$playerAId", xData.playerAId ] }, "$playerAId", "$playerBId"]},
                                "playerBId": { $cond: [ { $eq: [ "$playerAId", xData.playerAId ] }, "$playerBId", "$playerAId"]},
                                "scoreA": { $cond: [ { $eq: [ "$playerAId", xData.playerAId ] }, "$scores.setScoresA", "$scores.setScoresB"]},
                                "scoreB": { $cond: [ { $eq: [ "$playerAId", xData.playerAId ] }, "$scores.setScoresB", "$scores.setScoresA"]},
                            }}                                                
                        ]);

                        successJson["message"] = "Match diary";
                        successJson["data"] = diaryList;
                        return successJson;

                    }
                   
                   
                }
                else
                {
                    failureJson["message"] = paramMsg;
                    return failureJson;
                }
            }
            else
            {
                failureJson["message"] = paramMsg;
                return failureJson;
            }
        }catch(e){
            failureJson["message"] = "Could not fetch diaryAnalysis"+e;
            return failureJson;
        }
    }
   
})
