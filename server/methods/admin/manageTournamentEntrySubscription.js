import { MatchCollectionDB }from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import { tourSelectionType } from '../dbRequiredRole.js'


function updateMatchRecord(oldJson,newJson,dataJson)
{
    try{
    var oldMatchInfo = oldJson;
    var newMatchInfo = newJson;

    var oldPlayerID = "";
    var playerId = dataJson.playerId;
    var playerName = dataJson.playerName;
    var tournamentId = dataJson.tournamentId;
    var eventName = dataJson.eventName;
    var playerSet = dataJson.playerSet;
    var matchStatus = dataJson.matchStatus;


    
    if(matchStatus == "bye" && oldMatchInfo.roundNumber == 1)
    {
        oldPlayerID = dataJson.oldPlayerID;
        if(playerSet == "playerA")
        {
            //playerId = oldMatchInfo.playersID.playerBId;
           // oldPlayerID = oldMatchInfo.playersID.playerAId;
            newMatchInfo.getStatusColorA ="ip_input_box_type_pNameBye";
            newMatchInfo.getStatusColorB ="ip_input_box_type_pName";
            newMatchInfo.playersID.playerBId = playerId;;
            newMatchInfo.playersID.playerAId = "";
            newMatchInfo.players.playerB = playerName;
            newMatchInfo.players.playerA = "()";
            newMatchInfo.propogatePlaceHolder = "playerAId";


        }
        else if(playerSet == "playerB")
        {
           // playerId = oldMatchInfo.playersID.playerAId;
           // oldPlayerID = oldMatchInfo.playersID.playerBId;
            newMatchInfo.getStatusColorA ="ip_input_box_type_pName";
            newMatchInfo.getStatusColorB ="ip_input_box_type_pNameBye";
            newMatchInfo.playersID.playerBId = "";
            newMatchInfo.playersID.playerAId = playerId;
            newMatchInfo.players.playerB = "()";
            newMatchInfo.players.playerA = playerName;
            newMatchInfo.propogatePlaceHolder = "playerBId";
        }

        newMatchInfo.winnerID = playerId;
        newMatchInfo.winner = playerName;
        newMatchInfo.status2 = "bye";
        newMatchInfo.status = "bye";
        newMatchInfo.propogatePlayerID = playerId;
        newMatchInfo.propogatePlayerName = playerName;

        //console.log("newMatchInfo .. "+JSON.stringify(newMatchInfo))

    }
    else if(matchStatus == "bye" && oldJson.roundNumber != 1)
    {
        oldPlayerID = dataJson.oldPlayerID;

        if(oldMatchInfo.propogatePlayerID == oldPlayerID)
        {                    
            newMatchInfo.propogatePlayerID = playerId;
            newMatchInfo.propogatePlayerName = playerName;
        }
        if(oldMatchInfo.winnerID == oldPlayerID)
        {
            newMatchInfo.winnerID = playerId;
            newMatchInfo.winner = playerName;
        }
        if(playerSet == "playerA")
        {
            if(oldMatchInfo.playersID.playerAId == oldPlayerID)
            {
                newMatchInfo.playersID.playerAId = playerId;
                newMatchInfo.players.playerA = playerName;
            }
            else if(oldMatchInfo.playersID.playerBId == oldPlayerID)
            {
                newMatchInfo.playersID.playerBId = playerId;
                newMatchInfo.players.playerB = playerName;
            }
        }
        else if(playerSet == "playerB")
        {
            if(oldMatchInfo.playersID.playerBId == oldPlayerID)
            {
                newMatchInfo.playersID.playerBId = playerId;
                newMatchInfo.players.playerB = playerName;
            }
            else if(oldMatchInfo.playersID.playerAId == oldPlayerID)
            {
                newMatchInfo.playersID.playerAId = playerId;
                newMatchInfo.players.playerA = playerName;
            }
        }


    }
    else
    {
        oldPlayerID = dataJson.oldPlayerID;


        /*

        if(playerSet == "playerA")
            oldPlayerID = oldMatchInfo.playersID.playerAId;
        else if(playerSet == "playerB")
            oldPlayerID = oldMatchInfo.playersID.playerBId;
          */              

        if(oldMatchInfo.status2 == "bye" && oldMatchInfo.status == "bye")
        {
            newMatchInfo.status2 = "";
            newMatchInfo.status = "bye"
        }

        //if(oldMatchInfo.status == "bye")
            //newMatchInfo.status = "completed"

        if(oldMatchInfo.propogatePlayerID == oldPlayerID && oldPlayerID != "")
        {                    
            newMatchInfo.propogatePlayerID = playerId;
            newMatchInfo.propogatePlayerName = playerName;
        }

        if(oldMatchInfo.winnerID == oldPlayerID)
        {
            newMatchInfo.winnerID = playerId;
            newMatchInfo.winner = playerName;
        }
        
        if(oldMatchInfo.playersID.playerAId == oldPlayerID)
        {
            newMatchInfo.playersID.playerAId = playerId;
            newMatchInfo.players.playerA = playerName;
        }
        else if(oldMatchInfo.playersID.playerBId == oldPlayerID)
        {
            newMatchInfo.playersID.playerBId = playerId;
            newMatchInfo.players.playerB = playerName;
        }
        
        newMatchInfo.propogatePlaceHolder = "";
    }
    
    if(oldMatchInfo.matchNumber == newMatchInfo.matchNumber && oldMatchInfo.roundNumber == newMatchInfo.roundNumber)
    {
        //console.log("oldPlayerID : "+oldPlayerID)
        //console.log("oldMatchInfo "+JSON.stringify(oldMatchInfo));
        //console.log("");
        //console.log("newPlayerID : "+playerId)
        //console.log("newMatchInfo "+JSON.stringify(newMatchInfo));
       // console.log(newMatchInfo.status2)
       // console.log("");
       // console.log("");
        //console.log("");
        //console.log("=========================================================");

        var paramJson = {};




        if(newMatchInfo.getStatusColorA)
            paramJson["matchRecords.$.getStatusColorA"] = newMatchInfo.getStatusColorA;
        if(newMatchInfo.getStatusColorB)
            paramJson["matchRecords.$.getStatusColorB"] = newMatchInfo.getStatusColorB;
        if(newMatchInfo.status2 != undefined)
        {
            paramJson["matchRecords.$.status2"] = newMatchInfo.status2;
        }


        if(newMatchInfo.status)
            paramJson["matchRecords.$.status"] = newMatchInfo.status;

     


        if(newMatchInfo.playersID)
            paramJson["matchRecords.$.playersID"] = newMatchInfo.playersID;
        if(newMatchInfo.players)
            paramJson["matchRecords.$.players"] = newMatchInfo.players;
        if(newMatchInfo.winnerID)
            paramJson["matchRecords.$.winnerID"] = newMatchInfo.winnerID;
        if(newMatchInfo.winner)
            paramJson["matchRecords.$.winner"] = newMatchInfo.winner;
        if(newMatchInfo.propogatePlayerID != undefined)
            paramJson["matchRecords.$.propogatePlayerID"] = newMatchInfo.propogatePlayerID;
        if(newMatchInfo.propogatePlayerName != undefined)
            paramJson["matchRecords.$.propogatePlayerName"] = newMatchInfo.propogatePlayerName;
        if(newMatchInfo.propogatePlaceHolder != undefined)
            paramJson["matchRecords.$.propogatePlaceHolder"] = newMatchInfo.propogatePlaceHolder;
        

       // console.log("paramJson : "+JSON.stringify(paramJson))


        var res1 = MatchCollectionDB.update({
            "tournamentId":tournamentId,
            "eventName":eventName,
            "matchRecords": {
                $elemMatch: {
                    "roundNumber": oldMatchInfo.roundNumber,
                    "matchNumber": oldMatchInfo.matchNumber
                }
            }},
            {$set:paramJson});
           
        //console.log("res1 : "+res1);
        
    }
    else
    {

    }
   }catch(e)
   {
   }
   
}


Meteor.methods({
  

    "fetchEventDetails":function(tournamentId,eventName)
    {
        try{
            var eventDetails = events.findOne({
                "tournamentId": tournamentId,
                "eventName": eventName
            });
            if(eventDetails)
            return eventDetails;


        }catch(e){

        }
    },
    "fetchAdminDrawEvents":function(tournamentId)
    {
        try{

            var raw1 = MatchCollectionDB.rawCollection();
            var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
            var eventList1 = distinct1('eventName', {"tournamentId":tournamentId});
            

            var raw2 = teamMatchCollectionDB.rawCollection();
            var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
            var eventList2 = distinct2('eventName', {"tournamentId":tournamentId});

            var eventList = eventList1.concat(eventList2);
            return eventList;

        }catch(e){
        }
    },
    "setPlayerEntryDraw":async function(matchInfo)
    {
        try{
            var tournamentId = matchInfo.tournamentId;
            var eventName = matchInfo.eventName;
            var matchNumber = matchInfo.entryInfo.matchNumber;
            var roundNumber = matchInfo.entryInfo.roundNumber;
            var playerId = "";
            var oldPlayerID = ""; 

            var playerSet = matchInfo.playerSet;
            var matchStatus = matchInfo.matchStatus;

            if(matchInfo.matchStatus == "nobye")
            {
                if(matchInfo.playerSet == "playerA")
                    oldPlayerID = matchInfo.entryInfo.playersID.playerAId;
                else if(matchInfo.playerSet == "playerB")
                    oldPlayerID = matchInfo.entryInfo.playersID.playerBId;
                playerId = matchInfo.newPlayerID;


            }
            else if(matchInfo.matchStatus == "bye")
            {
                if(matchInfo.newPlayerID == "1")
                {
                    if(matchInfo.playerSet == "playerA")
                    {
                        playerId = matchInfo.entryInfo.playersID.playerBId;
                        oldPlayerID = matchInfo.entryInfo.playersID.playerAId;
                    }
                    else if(matchInfo.playerSet == "playerB")
                    {
                        playerId = matchInfo.entryInfo.playersID.playerAId;
                        oldPlayerID = matchInfo.entryInfo.playersID.playerBId;

                    }
                }
                
            }
           
            

            //playerId = "abc"

            if(matchInfo.entryInfo.status2 == "bye" && matchInfo.matchStatus == "bye")
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Match already has a bye";
                return resultJson;
            }

          

            if(matchInfo)
            {
                if(matchInfo.playerSet == "playerA")
                {
                    if(matchInfo.newPlayerID == matchInfo.entryInfo.playersID.playerBId)
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        var userName = "";
                        var userInfo = Meteor.users.findOne({"userId":playerId});
                        if(userInfo)
                            userName = userInfo.userName;
                        resultJson["message"] = "Player "+userName+" already exists in Match Number : "+matchInfo.entryInfo.matchNumber +" as playerB";
                        return resultJson;
                    }               
                }
                else if(matchInfo.playerSet == "playerB")
                {

                    if(matchInfo.newPlayerID == matchInfo.entryInfo.playersID.playerAId)
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        var userName = "";
                        var userInfo = Meteor.users.findOne({"userId":playerId});
                        if(userInfo)
                            userName = userInfo.userName;
                        resultJson["message"] = "Player "+userName+" already exists in Match Number : "+matchInfo.entryInfo.matchNumber +" as playerA";
                        return resultJson;
                    } 
                }
            }

            var dataCheck = MatchCollectionDB.aggregate([
                { "$match": { 
                    "tournamentId":tournamentId,
                    "eventName":eventName,
                    
                }},
                { "$unwind": "$matchRecords" },
                { "$match": { 
                    "$and":[{
                        "matchRecords.matchNumber": { "$nin": [matchNumber]}
                    },{
                        "matchRecords.roundNumber": { "$in": [roundNumber]}
                    },{"$or":[

                    {"matchRecords.playersID.playerAId":playerId},
                    {"matchRecords.playersID.playerBId":playerId}
                    ]}
                    ]
                    ,
                }},
                { "$group": {
                    "_id": "$_id",
                    "matchRecords": { "$push": "$matchRecords" }
                }}

            ])

            if(dataCheck && dataCheck.length > 0 )
            {
                var existingMatch = "";
                var userName = "";
                if(dataCheck[0].matchRecords && dataCheck[0].matchRecords.length > 0)
                    existingMatch = dataCheck[0].matchRecords[0].matchNumber;
                var userInfo = Meteor.users.findOne({"userId":playerId});
                if(userInfo)
                    userName = userInfo.userName;
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Player "+userName+" already exists in Match Number : "+existingMatch
                return resultJson;
            }

            else
            {
                var dbsrequired = ["userDetailsTT"];
                var userInfo = undefined;
                var academyName = "";
                var playerName = "";

                var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                if (res && res && res.changedDbNames && res.changedDbNames.length) 
                {
                    userInfo = global[res.changedDbNames[0]].findOne({
                        "userId": playerId 
                    })

                }
                if(userInfo)
                {
                    if (userInfo.clubNameId) 
                    {
                        var clubInfo = academyDetails.findOne({
                            "userId": userInfo.clubNameId,
                            "role": "Academy"
                        });
                        if(clubInfo)
                            academyName = clubInfo.clubName;
                    }
                    else if(userInfo.schoolId)
                    {
                        var clubInfo = schoolDetails.findOne({
                            "userId": userInfo.schoolId,
                        });
                        if(clubInfo&&clubInfo.schoolName)
                            academyName = clubInfo.schoolName;
                    }
                    playerName = userInfo.userName+"("+academyName.toString().substr(0, 3)+")";


                    if(oldPlayerID.trim() != "")
                    {
                        var rounds = MatchCollectionDB.aggregate([
                            {"$match":{
                                "tournamentId": tournamentId,
                                "eventName":eventName,
                            }},
                            { "$unwind": "$matchRecords" },
                            { "$match": {"$or":[
                                {"matchRecords.playersID.playerAId":oldPlayerID},
                                {"matchRecords.playersID.playerBId":oldPlayerID}
                                ]
                            }},
                            { "$group": {
                                 "_id": "$_id",
                                 "matchNumber": { "$push": "$matchRecords.matchNumber" }
                            }}

                        ]);

                        if(oldPlayerID.trim() != "" && rounds && rounds.length > 0 && rounds[0] && rounds[0].matchNumber && rounds[0].matchNumber.length > 0)
                        {
                            var matchArr = rounds[0].matchNumber;
                            for(var i = 0; i< matchArr.length; i++)
                            {
                                var currentMatchNumber = matchArr[i];
                                var roundInfo = MatchCollectionDB.findOne({
                                    "tournamentId": tournamentId,
                                    "eventName":eventName,
                                    "matchRecords.matchNumber":currentMatchNumber,
                                }, {
                                    fields: {
                                        _id: 0,
                                        matchRecords: {
                                            $elemMatch: {
                                                "matchNumber":currentMatchNumber
                                            }
                                        }
                                    }
                                });

                                if(roundInfo && roundInfo.matchRecords && roundInfo.matchRecords.length > 0 && roundInfo.matchRecords[0])
                                {
                                    var oldMatchJsonInfo = roundInfo.matchRecords[0];
                                    var newMatchJsonInfo = JSON.parse(JSON.stringify(oldMatchJsonInfo));

                                    var dataJson = {};
                                    dataJson["playerId"] = playerId;
                                    dataJson["playerName"] = playerName;
                                    dataJson["tournamentId"] = tournamentId;
                                    dataJson["eventName"] = eventName;
                                    dataJson["playerSet"] = playerSet;
                                    dataJson["matchStatus"] = matchStatus;
                                    dataJson["oldPlayerID"] = oldPlayerID;
                                    updateMatchRecord(oldMatchJsonInfo,newMatchJsonInfo,dataJson)

                                }
                            }

                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["message"] = "Entry updated";
                            return resultJson;
                            

                        }  
                    }

                   
                    else if(oldPlayerID == "")
                    {
                        var currentMatchNumber = matchInfo.entryInfo.matchNumber;
                        var roundInfo = MatchCollectionDB.findOne({
                            "tournamentId": tournamentId,
                            "eventName":eventName,
                            "matchRecords.matchNumber":currentMatchNumber,
                            }, {
                                fields: {
                                     _id: 0,
                                    matchRecords: {
                                        $elemMatch: {
                                            "matchNumber":currentMatchNumber
                                    }
                                }
                            }
                        });

                        if(roundInfo && roundInfo.matchRecords && roundInfo.matchRecords.length > 0 && roundInfo.matchRecords[0])
                        {
                            
                            var oldMatchJsonInfo = roundInfo.matchRecords[0];
                            oldMatchJsonInfo.status2 = "";
                            if(oldMatchJsonInfo.status == "bye")
                                oldMatchJsonInfo.status = "bye";
                            oldMatchJsonInfo.propogatePlayerID = "";
                            oldMatchJsonInfo.propogatePlayerName = "";

                            var newMatchJsonInfo = JSON.parse(JSON.stringify(oldMatchJsonInfo));
                            newMatchJsonInfo.status2 = "";
                            if(newMatchJsonInfo.status == "bye")
                                newMatchJsonInfo.status = "bye";
                            newMatchJsonInfo.propogatePlayerID = "";
                            newMatchJsonInfo.propogatePlayerName = "";


                            var dataJson = {};
                            dataJson["playerId"] = playerId;
                            dataJson["playerName"] = playerName;
                            dataJson["tournamentId"] = tournamentId;
                            dataJson["eventName"] = eventName;
                            dataJson["playerSet"] = playerSet;
                            dataJson["matchStatus"] = matchStatus;
                            dataJson["oldPlayerID"] = oldPlayerID;
                            updateMatchRecord(oldMatchJsonInfo,newMatchJsonInfo,dataJson)

                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["message"] = "Entry updated";
                            return resultJson;
                            

                        }

                    }
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["message"] = "No rounds to update player entry";
                        return resultJson;
                    }

                  

                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Invalid user";
                    return resultJson;
                }
                
            }




        }catch(e)
        {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["message"] = e;
            return resultJson;
        }
    }

})

