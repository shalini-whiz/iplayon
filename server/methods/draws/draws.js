import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';


import {playerDBFind} from '../dbRequiredRole.js'
//userDetailsTTUsed
Meteor.methods({

    "updateLockOnDraws":function(xData)
    {
        try{
            
            if(xData && xData.tournamentId && xData.eventName && (xData.drawsLock == false || xData.drawsLock == true))
            {
                var drawsExists = MatchCollectionDB.findOne({"tournamentId":xData.tournamentId,
                "eventName":xData.eventName});
                if(drawsExists)
                {
                    var updatedRes = MatchCollectionDB.update({"tournamentId":xData.tournamentId,
                        "eventName":xData.eventName},{$set:{"drawsLock":xData.drawsLock}});
                    if(updatedRes)
                    {
                        var message = "";
                        if(xData.drawsLock == true)
                            message = xData.eventName+" draws locked!!";
                        else if(xData.drawsLock == false)
                            message = xData.eventName+" draws unlocked!!";

                        var resultJson = {};
                        resultJson["status"] = "success";
                        resultJson["message"] = message;
                        return resultJson;
                    }
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["message"] = "Could not lock draws!!";
                        return resultJson;
                    }
                }
                else
                {
                    drawsExists = teamMatchCollectionDB.findOne({"tournamentId":xData.tournamentId,
                    "eventName":xData.eventName});
                    if(drawsExists)
                    {
                        var updatedRes = teamMatchCollectionDB.update({"tournamentId":xData.tournamentId,
                        "eventName":xData.eventName},{$set:{"drawsLock":xData.drawsLock}});
                        if(updatedRes)
                        {
                            var message = "";
                            if(xData.drawsLock == true)
                                message = xData.eventName+" draws locked!!";
                            else if(xData.drawsLock == false)
                                message = xData.eventName+" draws unlocked!!";


                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["message"] = message;
                            return resultJson;
                        }
                        else
                        {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["message"] = "Could not lock draws!!";
                            return resultJson;
                        }
                    }
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["message"] = "Could not find draws!!";
                        return resultJson;
                    }
                }
            }
            else
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid params";
                return resultJson;
            }
        }catch(e){
            errorLog(e)
        }
    },

    "checkTournamentDrawsOnLock":function(tournamentId)
    {
        try{

            var indDraws = MatchCollectionDB.aggregate([
                    {$match:{
                        "tournamentId":tournamentId
                    }},
                    { $project: { 
                        id: 1, 
                        "eventName":1,
                        "matchRecords": { $slice: [ "$matchRecords", -1 ] } ,
                        "drawsLock":1 ,
                        "tournamentId":1

                    }},
                    { $match: { 
                        "matchRecords.status": {$nin:["yetToPlay"]},
                        //"drawsLock":true 
                    }} 
                ]);

            var teamDraws = teamMatchCollectionDB.aggregate([
                    {$match:{
                        "tournamentId":tournamentId
                    }},
                    { $project: { 
                        id: 1, 
                        "eventName":1,
                        "matchRecords": { $slice: [ "$matchRecords", -1 ] },
                        "drawsLock":1,
                        "tournamentId":1

                    }},
                    { $match: { 
                        "matchRecords.status": {$nin:["yetToPlay"]},
                        //"drawsLock":true 
                    }} 
                ]);

            var compDraws = indDraws.concat(teamDraws);
            return compDraws;


        }catch(e){
            errorLog(e)
        }
    },
    "checkFinalDraws":function(tournamentId,eventName)
    {
        try{

            var drawsExists = MatchCollectionDB.findOne({"tournamentId":tournamentId,
                "eventName":eventName});
            if(drawsExists)
            {
                var drawsCompleted = MatchCollectionDB.aggregate([
                    {$match:{
                        "tournamentId":tournamentId,
                        "eventName":eventName
                    }},
                    { $project: { 
                        id: 1, 
                        "matchRecords": { $slice: [ "$matchRecords", -1 ] } 
                    }},
                    { $match: { "matchRecords.status": {$nin:["yetToPlay"]} } } 
                ]);
                if(drawsCompleted && drawsCompleted.length > 0 && drawsCompleted.matchRecords)
                {
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["message"] = "Completed draws";
                    return resultJson;
                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Incomplete draws";
                    return resultJson;
                }

            }
            else
            {
                drawsExists = teamMatchCollectionDB.findOne({"tournamentId":tournamentId,
                "eventName":eventName});
                if(drawsExists)
                {

                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Could not find draws!!";
                    return resultJson;
                }
            }
        }catch(e)
        {
            errorLog(e)
        }
    },
    "getMatchDrawsLock":function(tournamentId,eventName)
    {
        try{
            var drawsExists = MatchCollectionDB.findOne({"tournamentId":tournamentId,
                "eventName":eventName});
            if(drawsExists)
            {
                if(drawsExists.drawsLock != undefined)
                {
                    return drawsExists.drawsLock;
                }
                else
                    return false;
            }
            else{
                var drawsExists = teamMatchCollectionDB.findOne({"tournamentId":tournamentId,
                "eventName":eventName});
                if(drawsExists)
                {
                    if(drawsExists.drawsLock != undefined)
                    {
                        return drawsExists.drawsLock;
                    }
                    else
                        return false;
                } 

            }
        }catch(e){
            errorLog(e)
        }
    },
    'checkEventRanking': function(tournamentId, eventId) {
        try {
            var dobFilterInfo = dobFilterSubscribe.findOne({
                "tournamentId": tournamentId,
                "details.eventId": eventId
            }, {
                fields: {
                    _id: 0,
                    details: {
                        $elemMatch: {
                            "eventId": eventId
                        }
                    }
                }
            });
            if (dobFilterInfo) {
                return dobFilterInfo;
            }
        } catch (e) {
            errorLog(e)
        }
    },
    'checkEventDraws': function(tournamentId, eventName) {
        try {
            var eventDraws = [];
            var eventList = MatchCollectionDB.findOne({
                "tournamentId": tournamentId,
                "eventName": eventName
            });
            if (eventList == undefined) {
                eventList = teamMatchCollectionDB.findOne({
                    "tournamentId": tournamentId,
                    "eventName": eventName
                })
            }
            return eventList;
        } catch (e) {
            errorLog(e)
        }
    },
   
    'fetchPlayers': async function(tournamentId, eventName, eventType) {
        try {

            var dbsrequired = ["userDetailsTT", "playerTeamEntries","playerTeams"]

            var userDetailsTT = "userDetailsTT"
            var playerTeamEntries = "playerTeamEntries"
            var playerTeams = "playerTeams";


            if (tournamentId) 
            {

                var tournamentFind = events.findOne({
                    "_id": tournamentId
                })
                if(tournamentFind==undefined||tournamentFind==null){
                    tournamentFind = pastEvents.findOne({
                        "_id": tournamentId
                    })
                }
                var res = await Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
                try {

                    if (res) {
                        if (res.changeDb && res.changeDb == true) {
                            if (res.changedDbNames.length != 0) {
                                userDetailsTT = res.changedDbNames[0]
                                playerTeamEntries = res.changedDbNames[1]
                                playerTeams = res.changedDbNames[2]
                            }
                        }
                    }
                }catch(e){

                    errorLog(e)
                }
            }

            var eventParticipants;
            var players = [];
            var eventInfo = undefined;


            eventInfo = pastEvents.findOne({
                "eventName": eventName,
                "tournamentId": tournamentId
            });

            
            if(eventInfo == undefined) 
            {
                eventInfo = events.findOne({
                    "eventName": eventName,
                    "tournamentId": tournamentId
                });
            }

            if(eventInfo && eventInfo.eventParticipants)
                eventParticipants = eventInfo.eventParticipants;

            if (eventInfo && eventParticipants && parseInt(eventInfo.projectType) == 1) 
            {
                for (var i = 0; i < eventParticipants.length; i++) {
                    var playerID = eventParticipants[i];
                    var playerInfo = global[userDetailsTT].findOne({
                        role: "Player",
                        "userId": playerID
                    });
                    if (playerInfo) {
                        playerName = playerInfo.userName;
                        players.push({
                            "playerID": playerID,
                            "playerName": playerName
                        });
                    }
                }
            } else if (eventInfo && eventParticipants && parseInt(eventInfo.projectType) == 2) {
                for (var i = 0; i < eventParticipants.length; i++) {
                    var playerID = eventParticipants[i];
                    var playerTeamsDet = global[playerTeamEntries].findOne({
                        tournamentId: tournamentId,
                        "playerId": playerID
                    });
                    if (playerTeamsDet && playerTeamsDet.subscribedTeamsArray) {
                        for (var k = 0; k < playerTeamsDet.subscribedTeamsArray.length; k++) {
                            var eventDet = playerTeamsDet.subscribedTeamsArray[k];
                            if (eventDet.eventName == eventName) {
                                var teamDet = global[playerTeams].findOne({
                                    "_id": eventDet.teamId
                                })
                                if (teamDet && teamDet.teamName) {
                                    playerName = teamDet.teamName;
                                    players.push({
                                        "playerID": eventDet.teamId,
                                        "playerName": playerName
                                    });
                                }
                            }
                        }
                    }
                }
            }
            return players;
        } catch (e) {
            errorLog(e)
        }

    },

    'updatePoints': function(tournamentId, eventName, playerId, points) {
        try {
            
            var sportID;
            var sportEntry;
            //if (tourType == "past")
                sportEntry = pastEvents.findOne({
                    "_id": tournamentId
                });
            //else
            if(sportEntry == undefined)
                sportEntry = events.findOne({
                    "_id": tournamentId
                });

            if (sportEntry) {
                sportID = sportEntry.projectId[0];
                eventOrganizer = sportEntry.eventOrganizer;
            }
            var playerEntry = PlayerPoints.findOne({
                "playerId": playerId,
                "sportId": sportID,
                "organizerId": eventOrganizer,
                "eventName": eventName
            });

            if (playerEntry == undefined) {
                var toret = "userDetailsTT"

                var usersMet = Meteor.users.findOne({
                    userId: playerId
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }

                var userD = global[toret].findOne({
                    role: "Player",
                    userId: playerId
                });

                var parentAssociationID = "other"
                var associationID = "other"
                var affiliationID = "other"
                var playerName = "";

                if (userD.userName != undefined)
                    playerName = userD.userName;
                if (userD.associationId !== undefined && userD.associationId !== null) {
                    associationID = userD.associationId
                }

                if (userD.affiliationId !== undefined && userD.affiliationId !== null) {
                    if (userD.affiliationId.trim().length == 0) {
                        affiliationID = "other"
                    } else
                        affiliationID = userD.affiliationId
                }

                if (userD.parentAssociationId !== undefined && userD.parentAssociationId !== null) {
                    parentAssociationID = userD.parentAssociationId
                }

                var eventPoints = {
                    "tournamentId": tournamentId,
                    "tournamentPoints": points
                };
                if (!userD.parentAssociationId) {
                    userD.parentAssociationId = "other"
                }
                var eventOrganizerID = eventOrganizer;


                try {

                    PlayerPoints.insert({
                        playerId: playerId,
                        sportId: sportID,
                        playerName: playerName,
                        associationId: associationID,
                        afId: affiliationID,
                        parentAssociationId: userD.parentAssociationId,
                        organizerId: eventOrganizer,
                        eventName: eventName,
                        eventPoints: [eventPoints],
                        totalPoints: points,
                    });

                } catch (e) {
                    errorLog(e)
                }
            } else {
                //player tournament entry
                var playerTournEntry = PlayerPoints.findOne({
                    "playerId": playerId,
                    "sportId": sportID,
                    "organizerId": eventOrganizer,
                    "eventName": eventName,
                    "eventPoints.tournamentId": tournamentId
                });

                if (playerTournEntry != undefined) {

                    var result = PlayerPoints.update({
                        "playerId": playerId,
                        'sportId': sportID,
                        "organizerId": eventOrganizer,
                        "eventName": eventName,
                        "eventPoints.tournamentId": tournamentId
                    }, {
                        $set: {
                            "eventPoints.$.tournamentPoints": points
                        }
                    });


                    var totalInfo = PlayerPoints.findOne({
                        "playerId": playerId,
                        'sportId': sportID,
                        "organizerId": eventOrganizer,
                        "eventName": eventName
                    }, {
                        fields: {
                            "eventPoints.tournamentPoints": 1,
                            "_id": 0
                        }
                    })

                    if (totalInfo) {
                        var tourPointsList = totalInfo.eventPoints;
                        var total = "0";
                        for (var x = 0; x < tourPointsList.length; x++) {
                            total = parseInt(total) + parseInt(tourPointsList[x].tournamentPoints);
                        }
                        var totalPointsUpdate = PlayerPoints.update({
                            "playerId": playerId,
                            'sportId': sportID,
                            "organizerId": eventOrganizer,
                            "eventName": eventName
                        }, {
                            $set: {
                                "totalPoints": total
                            }
                        });

                    }
                } else {
                    var eventPoints = {
                        "tournamentId": tournamentId,
                        "tournamentPoints": points
                    };
                    var result = PlayerPoints.update({
                        "playerId": playerId,
                        'sportId': sportID,
                        "organizerId": eventOrganizer,
                        "eventName": eventName
                    }, {
                        $push: {
                            "eventPoints": eventPoints
                        }
                    });
                }

                var totalInfo = PlayerPoints.findOne({
                    "playerId": playerId,
                    'sportId': sportID,
                    "organizerId": eventOrganizer,
                    "eventName": eventName
                }, {
                    fields: {
                        "eventPoints.tournamentPoints": 1,
                        "_id": 0
                    }
                })

                if (totalInfo) {
                    var tourPointsList = totalInfo.eventPoints;
                    var total = "0";
                    for (var x = 0; x < tourPointsList.length; x++) {
                        total = parseInt(total) + parseInt(tourPointsList[x].tournamentPoints);
                    }
                    var totalPointsUpdate = PlayerPoints.update({
                        "playerId": playerId,
                        'sportId': sportID,
                        "organizerId": eventOrganizer,
                        "eventName": eventName
                    }, {
                        $set: {
                            "totalPoints": total
                        }
                    });

                }
            }
        } catch (e) {
            errorLog(e)
        }
    },
    removeloserpoints: function(tournamentId, eventName, playerId, points) {
        
        try{
        var sportID;
        var sportEntry;
        sportEntry = pastEvents.findOne({
                "_id": tournamentId
            });
        if(sportEntry == undefined)
            sportEntry = events.findOne({
                "_id": tournamentId
            });
        if (sportEntry) {
            sportID = sportEntry.projectId[0];
            eventOrganizer = sportEntry.eventOrganizer;
        }
        var playerTournEntry = PlayerPoints.findOne({
            "playerId": playerId,
            'sportId': sportID,
            "organizerId": eventOrganizer,
            "eventName": eventName,
            "eventPoints.tournamentId": tournamentId
        });

        if (playerTournEntry != undefined) {
            var removeTournEntry = PlayerPoints.update({
                "playerId": playerId,
                'sportId': sportID,
                "organizerId": eventOrganizer,
                "eventName": eventName
            }, {
                $pull: {
                    "eventPoints": {
                        "tournamentId": tournamentId
                    }
                }
            });


            var totalInfo = PlayerPoints.findOne({
                "playerId": playerId,
                'sportId': sportID,
                "organizerId": eventOrganizer,
                "eventName": eventName
            }, {
                fields: {
                    "eventPoints.tournamentPoints": 1,
                    "_id": 0
                }
            })

            if (totalInfo) {
                var tourPointsList = totalInfo.eventPoints;
                var total = "0";
                for (var x = 0; x < tourPointsList.length; x++) {
                    total = parseInt(total) + parseInt(tourPointsList[x].tournamentPoints);
                }
                var totalPointsUpdate = PlayerPoints.update({
                    "playerId": playerId,
                    'sportId': sportID,
                    "organizerId": eventOrganizer,
                    "eventName": eventName
                }, {
                    $set: {
                        "totalPoints": total
                    }
                });

            }
        }
        }catch(e){
            errorLog(e)
        }
    },

    /** stationary related **/
   
    
    

  
   
   
    'getTournamentInfo': function(tournamentId) {
        var pastTour = pastEvents.findOne({
            tournamentEvent: true,
            "_id": tournamentId
        });
        if (pastTour) {
            return pastTour;
        } else {
            var upcomingTour = events.findOne({
                tournamentEvent: true,
                "_id": tournamentId
            });
            if (upcomingTour) {
                return upcomingTour;
            }
        }
    },
    'deleteAllRecordsForGivenData': function() {
        var s = pastEvents.remove({
            "tournamentId": "S3M29kzojMExJG84f"
        });
        var t = pastEvents.remove({
            "_id": "S3M29kzojMExJG84f"
        });
        var p = MatchTeamCollectionConfig.remove({
            "tournamentId": "S3M29kzojMExJG84f"
        })
        var k = teamMatchCollectionDB.remove({
            "tournamentId": "S3M29kzojMExJG84f"
        })
        var o = myPastEvents.remove({
            tournamentId: "S3M29kzojMExJG84f"
        });
        var h = myPastEvents.remove({
            "_id": "S3M29kzojMExJG84f"
        });
        var q = dobFilterSubscribe.remove({
            tournamentId: "S3M29kzojMExJG84f"
        })
        var r = subscriptionRestrictions.remove({
            tournamentId: "S3M29kzojMExJG84f"
        })
        var q = eventFeeSettings.remove({
            tournamentId: "S3M29kzojMExJG84f"
        })
        if (s) {
            return true
        } else return "1"
    },
    'sendResultEmail_TeamOLD': function(tournamentId, eventName, eventType) {
        try {
            var sortedMatchColl = [];
            var winner = "";
            var eventType = "";
            var finalSortRecords = {};
            var finalRound = "0";
            var semiFinalRound = "0";
            var quarterFinalRound = "0";

            var eventInfoType = events.findOne({"tournamentId":tournamentId,"eventName":eventName});
            if(eventInfoType)
            {
                if(eventInfoType.projectType)
                {
                    if(eventInfoType.projectType == "2" || eventInfoType.projectType == 2)
                    {
                        var eventList = teamMatchCollectionDB.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        });
                        if (eventList != undefined) {

                            var temp1 = MatchTeamCollectionConfig.aggregate([{
                                    $match: {
                                        "tournamentId": tournamentId,
                                        "eventName": eventName,
                                    }
                                }, {
                                    $unwind: "$roundValues"
                                }, {
                                    $sort: {
                                        "roundValues.roundNumber": -1
                                    }
                                }, {
                                    $limit: 4
                                }, {
                                    $group: {
                                        "_id": "$_id",
                                        "roundNumber": {
                                            $push: "$roundValues.roundNumber"
                                        }
                                    }
                                }, {
                                    $project: {
                                        "roundNumber": 1
                                    }
                                },

                            ])


                            var posRounds = [];
                            if (temp1.length > 0) {
                                var roundNumberArr = temp1[0].roundNumber;
                                for (var b = 0; b < roundNumberArr.length; b++) {
                                    posRounds.push(parseInt(roundNumberArr[b]))
                                }
                            }


                            var matchConfigInfo = MatchTeamCollectionConfig.findOne({
                                "tournamentId": tournamentId,
                                "eventName": eventName
                            }, {
                                fields: {
                                    "roundValues": 1
                                }
                            });
                            if (matchConfigInfo != undefined) {
                                var possibleRounds = [];
                                var mx = parseInt(matchConfigInfo.roundValues.length) - parseInt(1);
                                if (matchConfigInfo.roundValues[mx - 1] != undefined)
                                    finalRound = matchConfigInfo.roundValues[mx - 1].roundNumber;
                                if (matchConfigInfo.roundValues[mx - 2] != undefined)
                                    semiFinalRound = matchConfigInfo.roundValues[mx - 2].roundNumber;
                                if (matchConfigInfo.roundValues[mx - 3] != undefined)
                                    quarterFinalRound = matchConfigInfo.roundValues[mx - 3].roundNumber;

                                var records = teamMatchCollectionDB.findOne({
                                    'tournamentId': tournamentId,
                                    'eventName': eventName
                                }, {
                                    fields: {
                                        "_id": 0
                                    }
                                }).matchRecords;

                                if (records) {
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].roundNumber != undefined) {
                                            var finalInfo = {};
                                            var matchRecords;
                                            if (records[i].roundNumber == parseInt(finalRound) || records[i].roundNumber == parseInt(semiFinalRound) || records[i].roundNumber == parseInt(quarterFinalRound)) {
                                                if (records[i].roundNumber == parseInt(finalRound)) {
                                                    finalInfo["round"] = "Final";
                                                    matchRecords = records[i];
                                                    if (matchRecords.status != "yetToPlay") {
                                                        winner = matchRecords.winner
                                                    }
                                                }
                                                if (records[i].roundNumber == parseInt(semiFinalRound)) {
                                                    finalInfo["round"] = "Semi Final";
                                                    matchRecords = records[i];
                                                }
                                                if (records[i].roundNumber == parseInt(quarterFinalRound)) {
                                                    finalInfo["round"] = "Quarter Final";
                                                    matchRecords = records[i];
                                                }

                                                if (matchRecords.status != "yetToPlay") 
                                                {
                                                    finalInfo["winner"] = matchRecords.winner;
                                                    if (matchRecords.winnerID == matchRecords.teamsID.teamAId) {
                                                        finalInfo["playerInfo"] = matchRecords.winner + " defeated " + matchRecords.teams.teamB;
                                                        var scoreInfo = "";
                                                        for (var k = 0; k < matchRecords.scores.setScoresA.length; k++) {

                                                            if(matchRecords.scores.setScoresA[k] == '0' && matchRecords.scores.setScoresB[k] == '0')
                                                            {

                                                            }
                                                            else
                                                            {
                                                                if(k != 0)
                                                                    scoreInfo += ",";  
                                                                scoreInfo += matchRecords.scores.setScoresA[k] + " - " + matchRecords.scores.setScoresB[k];

                                                            }
                                                        }
                                                    } else {
                                                        finalInfo["playerInfo"] = matchRecords.winner + " defeated " + matchRecords.teams.teamA;
                                                        for (var k = 0; k < matchRecords.scores.setScoresB.length; k++) {
                                                            if(matchRecords.scores.setScoresA[k] == '0' && matchRecords.scores.setScoresB[k] == '0')
                                                            {

                                                            }
                                                            else
                                                            {
                                                                if(k != 0)
                                                                    scoreInfo += ",";  

                                                               scoreInfo += matchRecords.scores.setScoresB[k] + " - " + matchRecords.scores.setScoresA[k];

                                                            }      
                                                        }
                                                    }
                                                    finalInfo["scoreInfo"] = scoreInfo;
                                                    sortedMatchColl.push(finalInfo);
                                                }
                                            }
                                        }
                                    }
                                }
                                var tourInfo = undefined;
                                if (eventType == "past")
                                    tourInfo = pastEvents.findOne({
                                        "tournamentEvent": true,
                                        "_id": tournamentId
                                    });
                                else
                                    tourInfo = events.findOne({
                                        "tournamentEvent": true,
                                        "_id": tournamentId
                                    });
                                if (tourInfo != undefined)
                                {
                                    finalSortRecords["tournamentName"] = tourInfo.eventName;
                                    if(tourInfo.venueAddress)
                                        finalSortRecords["tournamentVenue"] = tourInfo.venueAddress;
                                    if(tourInfo.domainName)
                                        finalSortRecords["tournamentAddress"] = tourInfo.domainName;
                                    if(tourInfo.eventStartDate)
                                        finalSortRecords["tournamentStartDate"] = tourInfo.eventStartDate;
                                    if(tourInfo.eventEndDate)
                                        finalSortRecords["tournamentEndDate"] = tourInfo.eventEndDate;
                                }

                                finalSortRecords["eventName"] = eventName;
                                finalSortRecords["winner"] = winner;

                                var matchInfo = [];
                                var finalplayerInfo = [];
                                var semiplayerInfo = [];
                                var quarterplayerInfo = [];

                                for (var t = sortedMatchColl.length-1; t >= 0; t--) {
                                    var roundInfo = {};
                                    if (sortedMatchColl[t].round == "Final") {
                                        roundInfo["round"] = "Final";
                                        finalplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = finalplayerInfo;
                                    }
                                    if (sortedMatchColl[t].round == "Semi Final") {
                                        roundInfo["round"] = "Semi Final";
                                        semiplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = semiplayerInfo;
                                    }
                                    if (sortedMatchColl[t].round == "Quarter Final") {
                                        roundInfo["round"] = "Quarter Final";
                                        quarterplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = quarterplayerInfo;
                                    }
                                    if (_.findWhere(matchInfo, roundInfo) == null) {
                                        matchInfo.push(roundInfo);
                                    }
                                    finalSortRecords["rounds"] = matchInfo;
                                }
                            }
                        }
                    }
                }
            }
            return finalSortRecords;

        } catch (e) {
            errorLog(e)
        }
    },
    "getPlayer_Aca":async function(playerId,tournamentId)
    {
        try{
            var dbsrequired = ["userDetailsTT"];
            var userInfo = undefined;
            var academyName = "";
            var playerName = "";

            if(tournamentId)
            {
               var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                if (res && res && res.changedDbNames && res.changedDbNames.length) 
                {
                    userInfo = global[res.changedDbNames[0]].findOne({
                        "userId": playerId 
                    })

                } 
            }
            else
            {
                var toret = "userDetailsTT";
                let playerInfo = userExistsByRole(playerId,"player");
              
                var playerSport = playerInfo.interestedProjectName;

                if(playerSport && playerSport.length != 0)
                {
                    var dbtoret = playerDBFind(playerSport)
                    if(dbtoret != false)
                        toret = dbtoret    
                }
                userInfo = global[toret].findOne({
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
                return playerName;
            }

        }catch(e)
        {
            errorLog(e)
        }
    },

     "getPlayer_Aca_ViaEmail":async function(playerEmail)
    {
        try{
            var dbsrequired = ["userDetailsTT"];
            var userInfo = undefined;
            var academyName = "";
            var playerName = "";
            let playerId = "";
            playerEmail = playerEmail.trim();

           
            var toret = "userDetailsTT";
            let playerInfo = Meteor.users.findOne({
                    "emailAddress":playerEmail,role:"Player"});
            if(playerInfo)
            {
                playerId = playerInfo.userId;
                 var playerSport = playerInfo.interestedProjectName;

                if(playerSport && playerSport.length != 0)
                {
                    var dbtoret = playerDBFind(playerSport)
                    if(dbtoret != false)
                        toret = dbtoret    
                }
                userInfo = global[toret].findOne({
                        "userId": playerId 
                    })
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
                
                    if(userInfo.associationId)
                    {
                        let assocInfo = associationDetails.findOne({"userId":userInfo.associationId});
                        if(assocInfo)
                            userInfo.associationName = assocInfo.associationName;
                    }
                    userInfo.academyName = academyName.toString();

                    return userInfo;
                }
            }
            
        }catch(e)
        {
            errorLog(e)
        }
    }

});