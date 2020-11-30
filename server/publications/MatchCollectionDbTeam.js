import {
    Meteor
}
from 'meteor/meteor';
import {
    Mongo
}
from 'meteor/mongo';
import {
    check
}
from 'meteor/check';
//userDetailsTTUsed

export const teamMatchCollectionDB = new Meteor.Collection('teamMatchCollectionDB');

if (Meteor.isServer) {
    Meteor.publish('MatchCollectionDBTeam', function MatchCollectionDBTeamPublication() {
        var list = teamMatchCollectionDB.find({});
        return list;
    });
}

teamsSchema = new SimpleSchema({
    "teamA": {
        type: String,
        label: "First Player name",
        optional: true
    },
    "teamB": {
        type: String,
        label: "Second Player name",
        optional: true
    },
    "teamAId": {
        type: String,
    },
    "teamBId": {
        type: String,
    }
});

teamIDSchema = new SimpleSchema({
    "teamA": {
        type: String,
        label: "First Player name",
    },
    "teamB": {
        type: String,
        label: "Second Player name",
    },
    "teamAId": {
        type: String,
    },
    "teamBId": {
        type: String,
    },
    "managerAId": {
        type: String,
    },
    "managerBId": {
        type: String,
    },
});

teamNoSchema = new SimpleSchema({
    "teamANo": {
        type: String,
        label: "Team A No",
    },
    "teamBNo": {
        type: String,
        label: "Team B No",
    },
});

teamScoresSchema = new SimpleSchema({
    "setScoresA": {
        type: [Number],
        label: "Set scores of Player-A"
    },
    "setScoresB": {
        type: [Number],
        label: "Set scores of Player-B"
    }
    /*,
      "applicableSports": {
        type: String,
        label: "Maybe, to check if this match record schema can be used for a given sport",
        allowedValues: ["Table Tennis", "Badminton", "Tennis", "Squash"]
      }*/
});

teamCompletedScoresSchema = new SimpleSchema({
    "setScores": {
        type: [Number],
        label: "scores of winner"
    }
    /*,
      "applicableSports": {
        type: String,
        label: "Maybe, to check if this match record schema can be used for a given sport",
        allowedValues: ["Table Tennis", "Badminton", "Tennis", "Squash"]
      }*/
});

teamMatchRecordsSchema = new SimpleSchema({
    "matchNumber": {
        type: Number,
        label: "The unique match number within the said event",
        denyUpdate: true
    },
    "roundNumber": {
        type: Number,
        label: "The round to which this match belongs to"
    },
    "status": {
        type: String,
        allowedValues: ['yetToPlay', 'completed', 'bye', 'walkover', 'cancel'],
        label: "Status of the match"
    },
    "status2": {
        type: String,
        label: "Status of the team"
    },
    "propogateTeamID": {
        type: String,
        label: "Status of the team"
    },
    "propogatePlaceHolder": {
        type: String,
        label: "Status of the team"
    },
    "propogatePlayerName": {
        type: String,
        label: "Status of the team"
    },
    "teams": {
        type: teamsSchema,
        label: "Names of the teams",
        optional: true
    },
    "teamsID": {
        type: teamIDSchema,
        label: " Names of the players/teams",
    },
    "teamsNo":{
        type :teamNoSchema,
        label : "Teams No"
    },
    "scores": {
        type: teamScoresSchema,
        label: "Scores of the match",
        optional: true
    },
    "completedscores": {
        type: teamCompletedScoresSchema,
        label: "Completed scores of the match",
        optional: true
    },
    "winner": {
        type: String,
        label: "Name of the winner",
        optional: true
    },
    "winnerID": {
        type: String,
        label: "ID of the winner",
    },
    "winnerNo":{
        type: String,
        label: "no of the winner",
    },
    "isBlank": {
        type: Boolean,
        label: "False by default, true for blank matches used as fillers"
    }
});

teamMatchCollectionSchema = new SimpleSchema({
    "tournamentId": {
        type: String,
        label: "The Doc Id of the tournament",
        denyUpdate: true
    },
    "eventName": {
        type: String,
        label: "The name of the event",
        denyUpdate: true
    },
    "drawsLock":{
        type:Boolean,
        label:"Draws Lock",
        optional:true
    },
    "matchRecords": {
        type: [teamMatchRecordsSchema],
        label: "Record of all the matches in that Tournament/Event"
    }
});

Meteor.methods({
    initMatchRecordsForTeam: function(tournamentId, eventName, fileData) {
        try {
            // TODO
            let tournament = events.findOne({
                "_id": tournamentId
            });
            if(tournament == undefined)
            {
                tournament = pastEvents.findOne({
                    "_id": tournamentId
                });
            }
            if (tournament.eventOrganizer !== Meteor.userId()) {
                return false;
            }
            var fileDataLength = fileData.length;
            var matchRecords = [];
            if (fileDataLength == 2 || fileDataLength == 4 || fileDataLength == 8 || fileDataLength == 16 || fileDataLength == 32 || fileDataLength == 64 || fileDataLength == 128 || fileDataLength == 256 || fileDataLength == 512 || fileDataLength == 1024) {
                var maxRound = Math.log(fileDataLength) / Math.log(2);
                matchRecords = getMatchRecords8TeamMatch(fileData, eventName, tournamentId, maxRound);
            }
            /* else
                             if (fileDataLength%6 == 0) {
                               matchRecords = getMatchRecords6 (fileData);
                             } else 
                             if (fileDataLength%5 == 0) {

                               matchRecords = getMatchRecords5 (fileData);
                             }*/
            var status = true;
            if (matchRecords.length > 0) {
                if (matchRecords[0] && matchRecords[0].message != undefined) {
                    if (matchRecords[0].message)
                        status = false;
                } else
                    status = true;

                if (status && matchRecords.length > 0) {
                    var s = teamMatchCollectionDB.insert({
                        tournamentId: tournamentId,
                        eventName: eventName,
                        matchRecords: matchRecords
                    });

                    return matchRecords;
                } else
                    return matchRecords;

            } else {
                return matchRecords;
            }
        } catch (e) {
            //console.log(e)
        }
    },
    getTeamMatchesFromDB: function(tournamentId, eventName) {
        try {
            let matchRecords = [];
            try {

                let getMatchRecords = teamMatchCollectionDB.aggregate([{
                    $match: {
                        tournamentId: tournamentId,
                        eventName: eventName
                    }
                }, {
                    $unwind: {
                        path: "$matchRecords"
                    }
                }, {
                    $match: {
                        "matchRecords.roundName": {
                            $ne: "BM"
                        }
                    }
                }, {
                    $project: {
                        "matchRecords": "$matchRecords"
                    }
                }, {
                    $group: {
                        "_id": null,
                        "matchRecords": {
                          "$push":"$matchRecords"
                        }
                    }
                }])
                if (getMatchRecords && getMatchRecords.length
                 && getMatchRecords[0] && getMatchRecords[0].matchRecords.length) {
                    var numMatchesFound = getMatchRecords[0].matchRecords.length;
                    return getMatchRecords[0].matchRecords;
                } else {
                    return []
                }

            } catch (error) {
                return matchRecords;
            }
        } catch (e) {
            console.log(e)
                //console.log(e)
        }
    },
    resetMatchRecordsTeamMatch: function(tournamentId, eventName, eventOrganizer, sportID) {
        let tournament = events.findOne({
            "_id": tournamentId
        });
        if(tournament == undefined)
        {
            tournament = pastEvents.findOne({
                "_id":tournamentId
            })
        }
        if(tournament)
        {
            if (tournament.eventOrganizer != Meteor.userId() && Meteor.userId() != null && Meteor.userId != undefined) {
                return false;
            } 
            else 
            {
                var rem_result = teamMatchCollectionDB.remove({
                    tournamentId: tournamentId,
                    eventName: eventName
                });
                MatchTeamCollectionConfig.remove({
                    tournamentId: tournamentId,
                    eventName: eventName
                });
                teamDetailedScores.remove({
                    tournamentId: tournamentId,
                    eventName: eventName
                });
                teamDetailedScoresOthrFormat.remove({
                    tournamentId: tournamentId,
                    eventName: eventName
                })
                teamDrawsSpec.remove({
                    tournamentId: tournamentId,
                    eventName: eventName
                })

                var liveScoresRes = liveScores.remove({ $and: [{"tournamentId": tournamentId, "eventName": eventName}]});    


                if(rem_result)
                    return true;
            }
        }
        else
            return false;
       
    },
    updateMatchRecordsTeam: async function(tournamentId, eventName, matchRecords,currentMatchRecord) {
        try {
            let tournament = events.findOne({
                "_id": tournamentId
            });
            if (tournament == undefined) {
                tournament = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            if (tournament.eventOrganizer != Meteor.userId()) {
                return false;
            }

            var onlyBMR = teamMatchCollectionDB.aggregate([
                {
                    $match:{
                        tournamentId: tournamentId,
                        eventName: eventName
                    }
                },{
                    $unwind:{
                        path:"$matchRecords"
                    }
                },{
                    $match:{
                        "matchRecords.roundName":"BM"
                    }
                }
            ])

            /**/

            if(onlyBMR && onlyBMR.length && currentMatchRecord.roundName=="F" &&
                onlyBMR[0].matchRecords){
                var searched = _.findWhere(matchRecords, {roundName:"BM"});
                if(searched){
                    matchRecords = _.without(matchRecords, searched);
                }
                matchRecords.push(onlyBMR[0].matchRecords)
            }

            var s = teamMatchCollectionDB.update({
                $and: [{
                    tournamentId: tournamentId,
                    eventName: eventName
                }]
            }, {
                $set: {
                    matchRecords: matchRecords
                }
            });

            if(currentMatchRecord && currentMatchRecord.roundName!="F" && 
                currentMatchRecord.roundName!="BM"){
                var r = teamMatchCollectionDB.update(
                  {
                    tournamentId: tournamentId, eventName: eventName
                  },
                  {
                    $pull:{
                      matchRecords:{
                        "roundName":"BM"
                      }
                    }
                  }
                );
                var r1 = MatchTeamCollectionConfig.update(
                  {
                    tournamentId: tournamentId, eventName: eventName
                  },
                  {
                    $pull:{
                      roundValues:{
                        "roundName":"Bronze Medal"
                      }
                    }
                  }
                )

                if(r1 && r){
                    var r2 = teamDetailedScoresOthrFormat.update(
                      {
                        tournamentId: tournamentId, eventName: eventName
                      },
                      {
                        $pull:{
                          teamDetScore:{
                            "thirdFourthRound":true
                          }
                        }
                      }
                    )
                }

                var data1 = {
                    tournamentId:tournamentId,
                    "eventName":eventName,
                    "BMRound":true
                }

                var getData = await Meteor.call("fetchLoserForBMRoundData",data1)
                if(getData && getData.status == SUCCESS_STATUS && getData.data){
                    var data = {
                        tournamentId:tournamentId,
                        "eventName": eventName,
                        "teamAName":getData.data.team1Name,
                        "teamBName":getData.data.team2Name,
                        "teamAId":getData.data.team1Id,
                        "teamBId":getData.data.team2Id,
                        "teamAManagerId":getData.data.team1Manager,
                        "teamBManagerId":getData.data.team2Manager
                    }

                    var bm = await Meteor.call("insertOrUpdateRoundBMTeam",data)
                }
            }
            if(s)
            Meteor.call("sendSMSOnPropogate",currentMatchRecord,tournamentId, eventName,2,function(e,res){})
        } catch (e) {
            console.log(e)
        }
    },
    'removeDrawsTeam': function(tournamentId, eventName) {
        try {
            let tournament = events.findOne({
                "_id": tournamentId
            });
            if (tournament == undefined) {
                tournament = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            if (tournament.eventOrganizer != Meteor.userId()) {
                return false;
            }
            teamMatchCollectionDB.remove({
                $and: [{
                    tournamentId: tournamentId,
                    eventName: eventName
                }]
            });
            MatchTeamCollectionConfig.remove({
                $and: [{
                    tournamentId: tournamentId,
                    eventName: eventName
                }]
            })
        } catch (e) {
             //console.log(e)
        }
    },
    insertMatchConfigForTeam: function(xData) {
        try{
            MatchTeamCollectionConfig.insert(xData)
        }catch(e){
             //console.log(e)
        }
    },

});



function getMatchRecords8TeamMatch(fileData, eventId, tournamentId, maxRound) {
    try {
        var tournamentFind = events.findOne({
            "_id": tournamentId
        })
        if(tournamentFind == undefined)
        {
            tournamentFind = pastEvents.findOne({
                "_id": tournamentId
            })
        }

        var dbsrequired = ["userDetailsTT", "playerTeamEntries", "playerTeams"]
        var userDetailsTT = "userDetailsTT"
        var playerTeamEntries = "playerTeamEntries"
        var playerTeams = "playerTeams"

        var res = Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
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
             //console.log(e)
        }

        var numPlayers = fileData.length;
        // check if the numPlayers is a power of 2
        var numMatches = numPlayers - 1;
        var numRounds = 0;
        while (math.pow(2, numRounds) < numPlayers) {
            numRounds++;
        }
        var matchRecords = [];
        var remainingMatches = numMatches;
        var roundNumber = 1;
        var numMatchesInCurRound = (numMatches % 2 == 0) ? numMatches / 2 : (numMatches + 1) / 2;
        var nextMatchNumber = 0;
        var nextSlot = "";
        var assignedMatchesInThisRound = 0;
        var logmatchRecords = [];
        var logmatchRecord = {};
        var eventRanking = "yes";
        var message = "";

        for (let i = 0; i < numMatches; i++) {
            var matchRecord = {
                matchNumber: i + 1,
                roundNumber: roundNumber,
                status: "yetToPlay",
                isBlank: false
            };

            if (parseInt(roundNumber) == parseInt(maxRound)) {
                matchRecord["roundName"] = "F"
            } else if (parseInt(roundNumber) == parseInt(maxRound) - 1) {
                matchRecord["roundName"] = "SF"
            } else if (parseInt(roundNumber) == parseInt(maxRound) - 2) {
                matchRecord["roundName"] = "QF"
            } else if (parseInt(roundNumber) == parseInt(maxRound) - 3) {
                matchRecord["roundName"] = "PQF"
            } else if (parseInt(roundNumber) == parseInt(maxRound) - 4) {
                matchRecord["roundName"] = "RS32"
            } else {
                matchRecord["roundName"] = roundNumber
            }

            var playerA = "";
            var playerB = "";
            var playerAId = "";
            var playerBId = "";
            var managerBId = '';
            var managerBId = '';
            var teamA = '';
            var teamB = '';
            var teamAId = '';
            var teamBId = '';
            if (roundNumber == 1) {
                if (fileData[2 * i] && fileData[(2 * i)]['teamName'] !== undefined && fileData[(2 * i)]['teamName'] !== null && fileData[(2 * i)]['teamName'].trim().length !== 0 && fileData[(2 * i)]['teamAffiliationId'] !== undefined && fileData[(2 * i)]['teamAffiliationId'] !== null && fileData[(2 * i)]['teamAffiliationId'].trim().length !== 0) {
                    teamA = fileData[2 * i].teamName;
                    teamAId = fileData[2 * i]["teamAffiliationId"];
                    if (fileData[2 * i]["managerAffiliationId"] == null || fileData[2 * i]["managerAffiliationId"] == undefined || fileData[2 * i]["managerAffiliationId"].trim().length == 0) {
                        managerAId = fileData[2 * i]["temporaryAffiliationId"]
                    } else {
                        managerAId = fileData[2 * i]["managerAffiliationId"]
                    }
                }

                if (fileData[1 + (2 * i)] && fileData[1 + (2 * i)]['teamName'] !== undefined && fileData[1 + (2 * i)]['teamName'] !== null && fileData[1 + (2 * i)]['teamName'].trim().length !== 0 && fileData[1 + (2 * i)]['teamAffiliationId'] !== undefined && fileData[1 + (2 * i)]['teamAffiliationId'] !== null && fileData[1 + (2 * i)]['teamAffiliationId'].trim().length !== 0) {
                    teamB = fileData[1 + (2 * i)].teamName;
                    teamBId = fileData[1 + (2 * i)]["teamAffiliationId"];
                    if (fileData[1 + (2 * i)]["managerAffiliationId"] == null || fileData[1 + (2 * i)]["managerAffiliationId"] == undefined || fileData[1 + (2 * i)]["managerAffiliationId"].trim().length == 0) {
                        managerBId = fileData[1 + (2 * i)]["temporaryAffiliationId"]
                    } else {
                        managerBId = fileData[1 + (2 * i)]["managerAffiliationId"]
                    }
                }
                var user1Validation = undefined;
                var user2Validation = undefined;
                var playerAId = managerAId;
                var playerBId = managerBId;
                var playerA = teamA;
                var playerB = teamB;

                if (eventRanking == "yes") {
                    if (playerAId.trim() != "")
                        user1Validation = global[userDetailsTT].findOne({
                            $or: [{
                                "affiliationId": managerAId
                            }, {
                                "tempAffiliationId": managerAId
                            }]
                        });
                    if (playerBId.trim() != "")
                        user2Validation = global[userDetailsTT].findOne({
                            $or: [{
                                "affiliationId": managerBId
                            }, {
                                "tempAffiliationId": managerBId
                            }]
                        });
                } else if (eventRanking == "no") {
                    if (playerAId.trim() != "")
                        user1Validation = global[userDetailsTT].findOne({
                            $or: [{
                                "affiliationId": managerAId
                            }, {
                                "tempAffiliationId": managerAId
                            }]
                        })
                    if (playerBId.trim() != "")
                        user2Validation = global[userDetailsTT].findOne({
                            $or: [{
                                "affiliationId": managerBId
                            }, {
                                "tempAffiliationId": managerBId
                            }]
                        });
                }
                var team1Validation = global[playerTeams].findOne({
                    teamAffiliationId: teamAId
                });

                var team2Validation = global[playerTeams].findOne({
                    teamAffiliationId: teamBId
                });


                if ((user1Validation == undefined && playerAId.trim() != "") || (user2Validation == undefined && playerBId.trim() != "") || playerAId.trim() == "other" || playerBId.trim() == "other" || (playerA.trim() != "()" && playerAId.trim() == "") || (playerB.trim() != "()" && playerBId.trim() == "")) {
                    if (managerAId.trim().length != 0) {
                        if ((user1Validation == undefined && playerAId.trim() != "") || playerAId.trim() == "other" || (playerA.trim() != "()" && playerAId.trim() == "")) {
                            if (playerA.trim() != "( )" && playerAId.trim() == "" && fileData.data[2 * i].Name != "") {
                                if (eventRanking == "yes")
                                    message = {
                                        "player": playerA,
                                        "message": "has invalid manager affiliationID or temporaryAffiliationId"
                                    };
                                else
                                    message = {
                                        "player": playerA,
                                        "message": "has invalid manager affiliationID or temporaryAffiliationId"
                                    };

                            }
                            if (user1Validation == undefined && playerAId.trim() != "") {
                                if (eventRanking == "yes")
                                    message = {
                                        "player": playerA,
                                        "message": "has invalid manager affiliationID or temporaryAffiliationId"
                                    };
                                else
                                    message = {
                                        "player": playerA,
                                        "message": "has invalid manager affiliationID or temporaryAffiliationId"
                                    };

                            }

                            if (message != "") logmatchRecords.push(message);
                        }
                    }
                    if (managerBId.trim().length != 0) {
                        if ((user2Validation == undefined && playerBId.trim() != "") || playerBId.trim() == "other" || (playerB.trim() != "()" && playerBId.trim() == "")) {
                            message = "";
                            if (playerB.trim() != "( )" && playerBId.trim() == "" && fileData.data[1 + (2 * i)].teamName != "") {
                                if (eventRanking == "yes")
                                    message = {
                                        "player": playerB,
                                        "message": "has invalid manager affiliationID or temporaryAffiliationId"
                                    };
                                else
                                    message = {
                                        "player": playerB,
                                        "message": "has invalid manager affiliationID or temporaryAffiliationId"
                                    };
                            }
                            if (user2Validation == undefined && playerBId.trim() != "") {
                                if (eventRanking == "yes")
                                    message = {
                                        "player": playerB,
                                        "message": "has invalid manager affiliationID or temporaryAffiliationId"
                                    };
                                else
                                    message = {
                                        "player": playerB,
                                        "message": "has invalid manager affiliationID or temporaryAffiliationId"
                                    };
                            }
                            if (message != "") logmatchRecords.push(message);
                        }
                    }
                }

                if (playerA.trim().length != 0 && managerAId.trim().length != 0 && (team1Validation == undefined || teamAId.trim().length == 0)) {
                    message = {
                        "player": playerA,
                        "message": "has invalid team affiliationID"
                    };
                    if (message != "") logmatchRecords.push(message);
                }

                if (playerB.trim().length != 0 && managerBId.trim().length != 0 && (team2Validation == undefined || teamBId.trim().length == 0)) {
                    message = {
                        "player": playerB,
                        "message": "has invalid team affiliationID"
                    };
                    if (message != "") logmatchRecords.push(message);
                }

                if (user1Validation != undefined)
                    playerAId = user1Validation.userId;
                if (user2Validation != undefined)
                    playerBId = user2Validation.userId;
                if (team1Validation != undefined) {
                    teamA = team1Validation.teamName
                    teamAId = team1Validation._id;
                }
                if (team2Validation != undefined) {
                    teamB = team2Validation.teamName
                    teamBId = team2Validation._id;
                }

                if (teamAId == "0" || teamAId.trim() == "") {
                    matchRecord.status2 = "bye";
                    matchRecord.status = "bye";
                    matchRecord.propogateTeamID = teamBId;
                    matchRecord.propogateTeamName = teamB;
                    matchRecord.getStatusColorA = "ip_input_box_type_pNameBye";
                    matchRecord.getStatusColorB = "ip_input_box_type_pName";
                    matchRecord.winnerID = teamBId;
                    matchRecord.winner = teamB;

                    var currentMatchNumber = i + 1;
                    var predictMatchNumber = currentMatchNumber * 2;
                    var teamANo = predictMatchNumber - 1;
                    var teamBNo = predictMatchNumber;
                    matchRecord.winnerNo = teamBNo;


                    if (currentMatchNumber % 2 == 0)
                        matchRecord.propogatePlaceHolder = "teamBId";
                    else
                        matchRecord.propogatePlaceHolder = "teamAId";

                } else if (teamBId == "0" || teamBId.trim() == "") {
                    matchRecord.status2 = "bye";
                    matchRecord.status = "bye";
                    matchRecord.propogateTeamID = teamAId;
                    matchRecord.propogateTeamName = teamA;
                    var currentMatchNumber = i + 1;
                    matchRecord.getStatusColorB = "ip_input_box_type_pNameBye";
                    matchRecord.getStatusColorA = "ip_input_box_type_pName";
                    matchRecord.winnerID = teamAId;
                    matchRecord.winner = teamA;

                    var predictMatchNumber = currentMatchNumber * 2;
                    var teamANo = predictMatchNumber - 1;
                    var teamBNo = predictMatchNumber;
                    matchRecord.winnerNo = teamANo;


                    if (currentMatchNumber % 2 == 0)
                        matchRecord.propogatePlaceHolder = "teamBId";
                    else
                        matchRecord.propogatePlaceHolder = "teamAId";
                } else {
                    matchRecord.status2 = "";
                    matchRecord.teamStatusID = "";
                    matchRecord.propogateTeamID = "";
                    matchRecord.getStatusColorA = "ip_input_box_type_pName";
                    matchRecord.getStatusColorB = "ip_input_box_type_pName";
                    matchRecord.winner = "";
                }

            }

            var teams = {
                teamA: teamA,
                teamB: teamB
            };

            matchRecord.teams = teams;

            var teamsID = {
                teamAId: teamAId,
                teamBId: teamBId,
                managerAId: playerAId,
                managerBId: playerBId
            };

            matchRecord.teamsID = teamsID;

            var setWins = {
                teamA: 0,
                teamB: 0
            };
            matchRecord.setWins = setWins;
            var score = ["0", "0", "0", "0", "0", "0", "0"];
            var scores = {
                setScoresA: score,
                setScoresB: score
            };
            var adder = (assignedMatchesInThisRound % 2 == 0) ? assignedMatchesInThisRound / 2 : (assignedMatchesInThisRound - 1) / 2;
            adder = adder + 1;
            base = matchRecord.matchNumber;
            base = base + (numMatchesInCurRound - assignedMatchesInThisRound - 1);
            nextMatchNumber = adder + base;
            if (matchRecord.matchNumber % 2 == 0) {
                nextSlot = "B";
            } else {
                nextSlot = "A";
            }
            matchRecord.nextMatchNumber = nextMatchNumber;
            matchRecord.nextSlot = nextSlot;
            matchRecord.scores = scores;


      if(parseInt(roundNumber) == 1)
      {

        var currentMatchNumber = i+1;
        var predictMatchNumber = currentMatchNumber * 2;
        var teamANo = predictMatchNumber - 1;
        var teamBNo = predictMatchNumber;
     
        var teamsNo = {
          "teamANo": teamANo,
          "teamBNo": teamBNo
        }; 

        matchRecord.teamsNo = teamsNo;
      }
      else
      {
        var teamsNo = {
          "teamANo": "",
          "teamBNo": ""
        }; 
        matchRecord.teamsNo = teamsNo;
      }


            if (parseInt(roundNumber) != 1) {
                matchRecord.getStatusColorA = "ip_input_box_type_pName";
                matchRecord.getStatusColorB = "ip_input_box_type_pName";
                matchRecord.winner = "";

            }

            matchRecords.push(matchRecord);
            assignedMatchesInThisRound++;
            if (assignedMatchesInThisRound == numMatchesInCurRound) {
                roundNumber++;
                assignedMatchesInThisRound = 0;
                numMatchesInCurRound = numMatchesInCurRound / 2;
            }
            remainingMatches--;
        }


        for (var r = 0; r < matchRecords.length; r++) {
            var currentMatchRecord = matchRecords[r];
            if (currentMatchRecord.status2 == "bye") {
                var rowNumber = parseInt(currentMatchRecord.nextMatchNumber) - parseInt(1);
                if (matchRecords[rowNumber] != undefined) {
                    if (currentMatchRecord.propogatePlaceHolder == "teamAId") {
                        matchRecords[rowNumber].teamsID.teamAId = currentMatchRecord.propogateTeamID;
                        matchRecords[rowNumber].teams.teamA = currentMatchRecord.propogateTeamName;
                        matchRecords[rowNumber].teamsID.managerAId = currentMatchRecord.teamsID.managerAId;
                        matchRecords[rowNumber].teamsNo.teamANo = currentMatchRecord.winnerNo;

                    } else if (currentMatchRecord.propogatePlaceHolder == "teamBId") {
                        matchRecords[rowNumber].teamsID.teamBId = currentMatchRecord.propogateTeamID;
                        matchRecords[rowNumber].teams.teamB = currentMatchRecord.propogateTeamName;
                        matchRecords[rowNumber].teamsID.managerBId = currentMatchRecord.teamsID.managerBId;
                        matchRecords[rowNumber].teamsNo.teamBNo = currentMatchRecord.winnerNo;

                    }
                }
            }
        }

        if (logmatchRecords.length <= 0) {
            return matchRecords;
        } else
            return logmatchRecords;
    } catch (e) {
         //console.log(e)
    }
}

Meteor.methods({
    'matchRecords/generate_blankScoreSheetForTeamEvents': function(tournamentId, eventName, matchNumber, roundNumber, tourType) {
        if (Meteor.isServer) {
            var webshot = Meteor.npmRequire('webshot');
            var fs = Npm.require('fs');
            var Future = Npm.require('fibers/future');
            var fut = new Future();
            var fileName = "matchRecords-report.pdf";
            var css = Assets.getText('style.css');

            SSR.compileTemplate('layout', Assets.getText('layout.html'));

            Template.layout.helpers({
                getDocType: function() {
                    return "<!DOCTYPE html>";
                }
            });

            SSR.compileTemplate('matchRecords_report', Assets.getText('printBlankScoreSheet.html'));

            if (tourType == "past") {
                var tournamentInfo = pastEvents.findOne({
                    "tournamentEvent": true,
                    '_id': tournamentId
                }).eventName;
                var eventNameInfo = pastEvents.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).eventName;
                var eventStartDate = pastEvents.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).eventStartDate;
                var eventEndDate = pastEvents.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).eventEndDate;
                var venue = pastEvents.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).venueAddress;
                var address = pastEvents.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).domainName;
                var tournamentVenue = pastEvents.findOne({
                    "tournamentEvent": true,
                    '_id': tournamentId
                }).venueAddress;
                var tournamentAddress = pastEvents.findOne({
                    "tournamentEvent": true,
                    '_id': tournamentId
                }).domainName;
            } else {
                var tournamentInfo = events.findOne({
                    "tournamentEvent": true,
                    '_id': tournamentId
                }).eventName;
                var eventNameInfo = events.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).eventName;
                var eventStartDate = events.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).eventStartDate;
                var eventEndDate = events.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).eventEndDate;
                var venue = events.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).venueAddress;
                var address = events.findOne({
                    "tournamentEvent": false,
                    'tournamentId': tournamentId
                }).domainName;
                var tournamentVenue = events.findOne({
                    "tournamentEvent": true,
                    '_id': tournamentId
                }).venueAddress;
                var tournamentAddress = events.findOne({
                    "tournamentEvent": true,
                    '_id': tournamentId
                }).domainName;
            }


            var matchRecords = [0, 1, 2];
            var data = {
                matchRecords: matchRecords,
                eventName: eventName,
                tournamentName: tournamentInfo,
                eventStartDate: eventStartDate,
                eventEndDate: eventEndDate,
                venue: venue,
                address: address,
                tournamentVenue: tournamentVenue,
                tournamentAddress: tournamentAddress
            }

            var html_string = SSR.render('layout', {
                css: css,
                template: "matchRecords_report",
                data: data
            });

            // Setup Webshot options
            var options = {
                "paperSize": {
                    "format": "Letter",
                    "orientation": "portrait",
                    "margin": "1cm"
                },
                siteType: 'html'
            };

            webshot(html_string, fileName, options, function(err) {
                fs.readFile(fileName, function(err, data) {
                    if (err) {
                        return
                    }

                    fs.unlinkSync(fileName);
                    fut.return(data);

                });
            });

            let pdfData = fut.wait();
            let base64String = new Buffer(pdfData).toString('base64');

            return base64String;
        }
    },
    'matchRecords/generate_scoreSheetForTeamEvents': async function(tournamentId, eventName, matchNumber, roundNumber, tourType) {

        if (Meteor.isServer) {

            var dbsrequired = ["userDetailsTT", "playerTeamEntries","playerTeams"]

            var userDetailsTT = "userDetailsTT"
            var playerTeamEntries = "playerTeamEntries"
            var playerTeams = "playerTeams"

            if (tournamentId) {

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
                     //console.log(e)
                }
            }

            var webshot = Meteor.npmRequire('webshot');
            var fs = Npm.require('fs');
            var Future = Npm.require('fibers/future');
            var fut = new Future();
            var fileName = "matchRecords-report.pdf";
            var css = Assets.getText('style.css');
            SSR.compileTemplate('layout', Assets.getText('layout.html'));
            Template.layout.helpers({
                getDocType: function() {
                    return "<!DOCTYPE html>";
                },
                
            });

            
            SSR.compileTemplate('matchRecords_report', Assets.getText('printScoreSheetTeams.html'));
            var matchRecords = "";
            if (matchNumber != "" && roundNumber != "") {
                matchRecordsObj = teamMatchCollectionDB.findOne({
                    'tournamentId': tournamentId,
                    'eventName': eventName,
                    "matchRecords": {
                        $elemMatch: {
                            "matchNumber": parseInt(matchNumber),
                            "roundNumber": parseInt(roundNumber)
                        }
                    }
                }, {
                    fields: {
                        "_id": 0,
                        "matchRecords.$": 1
                    }
                });

                if (matchRecordsObj != undefined)
                    matchRecords = teamMatchCollectionDB.findOne({
                        'tournamentId': tournamentId,
                        'eventName': eventName,
                        "matchRecords": {
                            $elemMatch: {
                                "matchNumber": parseInt(matchNumber),
                                "roundNumber": parseInt(roundNumber)
                            }
                        }
                    }, {
                        fields: {
                            "_id": 0,
                            "matchRecords.$": 1
                        }
                    }).matchRecords;

                else if (matchRecordsObj == undefined) {
                    matchRecords = teamMatchCollectionDB.findOne({
                        'tournamentId': tournamentId,
                        'eventName': eventName,
                        "matchRecords": {
                            $elemMatch: {
                                "matchNumber": parseInt(matchNumber)
                            }
                        }
                    }, {
                        fields: {
                            "_id": 0,
                            "matchRecords.$": 1
                        }
                    }).matchRecords;
                }

            } else if (matchNumber == "" && roundNumber != "") {

                var records = teamMatchCollectionDB.findOne({
                    'tournamentId': tournamentId,
                    'eventName': eventName
                }, {
                    fields: {
                        "_id": 0
                    }
                }).matchRecords;

                sortedMatchRecords = [];
                if (records) {
                    for (var i = 0; i < records.length; i++) {
                        if (records[i].roundNumber == parseInt(roundNumber)) {
                            sortedMatchRecords.push(records[i]);
                        }
                    }
                    matchRecords = sortedMatchRecords;
                }

            } else if (matchNumber != "" && roundNumber == "") {
                matchRecords = teamMatchCollectionDB.findOne({
                    'tournamentId': tournamentId,
                    'eventName': eventName,
                    "matchRecords": {
                        $elemMatch: {
                            "matchNumber": parseInt(matchNumber)
                        }
                    }
                }, {
                    fields: {
                        "_id": 0,
                        "matchRecords.$": 1
                    }
                }).matchRecords;

            } else {
                matchRecordsObj = teamMatchCollectionDB.findOne({
                    'tournamentId': tournamentId,
                    'eventName': eventName
                });
                if (matchRecordsObj)
                    matchRecords = matchRecordsObj.matchRecords;
            }

            if (matchRecords.length == 0)
                return "emptydata";
            var playersDue = [];
            var emptyPlayers = [];
            for (var s = matchRecords.length - 1; s >= 0; s--) {
                var players = matchRecords[s].teamsID;
                var playerA;
                var playerB;
                if(matchRecords[s].roundName=="BM"){
                    matchRecords[s].roundName = "Bronze Round"
                    matchRecords[s].matchNumber = ""
                }

                else if(matchRecords[s].roundName  == "PQF" || matchRecords[s].roundName == "QF" || 
                        matchRecords[s].roundName == "SF" || matchRecords[s].roundName == "F")
                {
                    matchRecords[s].roundName = "Round : " + matchRecords[s].roundName
                    matchRecords[s].matchNumber = "Match : " + matchRecords[s].matchNumber
                }
                else{
                    matchRecords[s].roundName = "Round : " + matchRecords[s].roundNumber
                    matchRecords[s].matchNumber = "Match Number : " + matchRecords[s].matchNumber
                }


                var teamADue = global[playerTeamEntries].findOne({
                    "tournamentId": tournamentId,
                    "playerId": players.managerAId,
                    "paidOrNot": true
                });
                var teamBDue = global[playerTeamEntries].findOne({
                    "tournamentId": tournamentId,
                    "playerId": players.managerBId,
                    "paidOrNot": true
                });

                if (matchRecords[s].status2 == "bye") {
                    var propogatePlayerID = matchRecords[s].propogateTeamID;
                    var playerDue;
                    var managerIDNEW;
                    if (propogatePlayerID) {
                        var teamDEt = global[playerTeams].findOne({
                            "_id": propogatePlayerID
                        });
                        if (teamDEt && teamDEt.teamManager) {
                            managerIDNEW = teamDEt.teamManager
                        } else {
                            managerIDNEW = ""
                        }
                    }
                    var playerDue = global[playerTeamEntries].findOne({
                        "tournamentId": tournamentId,
                        "playerId": managerIDNEW,
                        "paidOrNot": true
                    });
                    if (playerDue == undefined) {
                        matchRecords.splice(s, 1);
                        if (playerDue == undefined && propogatePlayerID != "") {
                            var propogateplayerInfo = global[playerTeams].findOne({
                                "_id": propogatePlayerID
                            });
                            if (propogateplayerInfo && propogateplayerInfo.teamName) {
                                playersDue.push(propogateplayerInfo.teamName);
                            }
                        }
                    } else {
                        if (matchRecords[s].teams) {
                            if (matchRecords[s].teams.teamA && matchRecords[s].teams.teamA.trim().length != 0) {
                                var players = {
                                    playerA: matchRecords[s].teams.teamA,
                                    playerB: ""
                                }
                                matchRecords[s].players = players
                            } else if (matchRecords[s].teams.teamB && matchRecords[s].teams.teamB.trim().length != 0) {
                                var players = {
                                    playerB: matchRecords[s].teams.teamB,
                                    playerA: ""
                                }
                                matchRecords[s].players = players
                            }
                        }
                    }
                } else if (matchRecords[s].status2 != "bye") {
                    
                    
                    var playerADue = global[playerTeamEntries].findOne({
                        "tournamentId": tournamentId,
                        "playerId": players.managerAId,
                        "paidOrNot": true
                    });
                    var playerBDue = global[playerTeamEntries].findOne({
                        "tournamentId": tournamentId,
                        "playerId": players.managerBId,
                        "paidOrNot": true
                    });

                    if (playerADue == undefined || playerBDue == undefined) {
                        matchRecords.splice(s, 1);
                        var playerAInfo = global[playerTeams].findOne({
                            "_id": players.teamAId
                        });
                        var playerBInfo = global[playerTeams].findOne({
                            "_id": players.teamBId
                        });
                        if (playerAInfo) playerA = playerAInfo.teamName;
                        if (playerBInfo) playerB = playerBInfo.teamName;
                        if (playerADue == undefined && players.teamAId != "") {
                            playersDue.push(playerA);
                        }
                        if (playerBDue == undefined && players.teamBId != "") {
                            playersDue.push(playerB);
                        }
                        if (playerADue == undefined && players.teamAId == "") emptyPlayers.push(s);
                        if (playerBDue == undefined && players.teamBId == "") emptyPlayers.push(s);
                    } else {
                        var playerAInfo = global[playerTeams].findOne({
                            "_id": players.teamAId
                        });
                        var playerBInfo = global[playerTeams].findOne({
                            "_id": players.teamBId
                        });
                        if (playerAInfo) playerA = playerAInfo.teamName;
                        if (playerBInfo) playerB = playerBInfo.teamName;

                        var players = {
                            playerA: playerA,
                            playerB: playerB
                        }
                        matchRecords[s].players = players
                    }
                }
            }

            var playersDueJson = {};
            playersDueJson["due"] = playersDue;
            playersDueJson["empty"] = emptyPlayers.length;
            if ((playersDue.length > 0 || emptyPlayers.length > 0) && matchRecords.length == 0)
                return playersDueJson;

            if (matchRecords.length > 0) {
                if (tourType == "past") {
                    var tournamentInfo = pastEvents.findOne({
                        "tournamentEvent": true,
                        '_id': tournamentId
                    }).eventName;
                    var eventNameInfo = pastEvents.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).eventName;
                    var eventStartDate = pastEvents.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).eventStartDate;
                    var eventEndDate = pastEvents.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).eventEndDate;
                    var venue = pastEvents.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).venueAddress;
                    var address = pastEvents.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).domainName;
                    var tournamentVenue = pastEvents.findOne({
                        "tournamentEvent": true,
                        '_id': tournamentId
                    }).venueAddress;
                    var tournamentAddress = pastEvents.findOne({
                        "tournamentEvent": true,
                        '_id': tournamentId
                    }).domainName;
                } else {
                    var tournamentInfo = events.findOne({
                        "tournamentEvent": true,
                        '_id': tournamentId
                    }).eventName;
                    var eventNameInfo = events.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).eventName;
                    var eventStartDate = events.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).eventStartDate;
                    var eventEndDate = events.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).eventEndDate;
                    var venue = events.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).venueAddress;
                    var address = events.findOne({
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    }).domainName;
                    var tournamentVenue = events.findOne({
                        "tournamentEvent": true,
                        '_id': tournamentId
                    }).venueAddress;
                    var tournamentAddress = events.findOne({
                        "tournamentEvent": true,
                        '_id': tournamentId
                    }).domainName;
                }

                var dispEventName = eventName;
                if(eventName != null)
                {
                    var schoolEvents = schoolEventsToFind.findOne({});
                    if(schoolEvents && schoolEvents.teamEventNAME && schoolEvents.dispNamesTeam)
                    {
                        var indexPos = _.indexOf(schoolEvents.teamEventNAME,eventName);
                        if(indexPos > -1 && schoolEvents.dispNamesTeam[indexPos] != undefined)
                            dispEventName = schoolEvents.dispNamesTeam[indexPos];                        
                    }                         
                }


                var data = {
                    matchRecords: matchRecords,
                    eventName: dispEventName,
                    tournamentName: tournamentInfo,
                    eventStartDate: reverseDate(eventStartDate),
                    eventEndDate: reverseDate(eventEndDate),
                    venue: venue,
                    address: address,
                    tournamentVenue: tournamentVenue,
                    tournamentAddress: tournamentAddress,
                    headerName: "NAME OF TEAM"
                }

                var html_string = SSR.render('layout', {
                    css: css,
                    template: "matchRecords_report",
                    data: data
                });

                var options = {
                    "paperSize": {
                        "format": "Letter",
                        "orientation": "portrait",
                        "margin": "1cm"
                    },
                    siteType: 'html'
                };

                webshot(html_string, fileName, options, function(err) {
                    fs.readFile(fileName, function(err, data) {
                        if (err) {
                            return
                        }

                        fs.unlinkSync(fileName);
                        fut.return(data);

                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');

                return base64String;
            }
        }
    },
    'matchRecords/validMatchNumberForTeams': function(tournamentId, eventName, matchNumber, roundNumber) {
        let matchRecords = [];
        let getMatchRecords;
        try {
            if (roundNumber != "") {
                getMatchRecords = teamMatchCollectionDB.findOne({
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                    "matchRecords": {
                        $elemMatch: {
                            "matchNumber": parseInt(matchNumber),
                            "roundNumber": parseInt(roundNumber)
                        }
                    }

                });

                if (getMatchRecords == undefined) {
                    getMatchRecords = teamMatchCollectionDB.findOne({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                        "matchRecords": {
                            $elemMatch: {
                                "matchNumber": parseInt(matchNumber)
                            }
                        }
                    });
                }

            } else {

                getMatchRecords = teamMatchCollectionDB.findOne({
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                    "matchRecords": {
                        $elemMatch: {
                            "matchNumber": parseInt(matchNumber)
                        }
                    }

                });
            }

            var numMatchesFound = getMatchRecords.matchRecords.length;

            return getMatchRecords.matchRecords;
        } catch (e) {
             //console.log(e)
            return matchRecords;
        }

    },
    'generate_receiptForTeam': async function(tournamentId, playerID, player, eventType) {

        if (Meteor.isServer) {
            var webshot = Meteor.npmRequire('webshot');
            var fs = Npm.require('fs');
            var Future = Npm.require('fibers/future');
            var fut = new Future();
            var fileName = "matchRecords-report.pdf";
            var css = Assets.getText('style.css');
            SSR.compileTemplate('layout', Assets.getText('layout.html'));
            Template.layout.helpers({
                getDocType: function() {
                    return "<!DOCTYPE html>";
                }
            });

            var dbsrequiredteam = ["playerTeamEntries"]
            var playerTeamEntries = "playerTeamEntries"
            if (tournamentId) {
                var res = await Meteor.call("changeDbNameForDraws", tournamentId, dbsrequiredteam)
                try {
                    if (res) {
                        if (res.changeDb && res.changeDb == true) {
                            if (res.changedDbNames.length != 0) {
                                playerTeamEntries = res.changedDbNames[0]
                            }
                        }
                    }
                }catch(e){
                     //console.log(e)
                }
            }
            SSR.compileTemplate('matchRecords_report', Assets.getText('receipt.html'));

            var eventList = [];
            var tournamentInfo = pastEvents.findOne({
                    "tournamentEvent": true,
                    '_id': tournamentId
                });

            if(tournamentInfo == undefined)
            {
                tournamentInfo = events.findOne({
                    "tournamentEvent": true,
                    '_id': tournamentId
                });
                if(tournamentInfo)
                    eventList = events.find({
                    'tournamentId': tournamentId
                }).fetch();
            }
            else
            {
                eventList = pastEvents.find({
                    'tournamentId': tournamentId
                }).fetch();
            }


            if (tournamentInfo) 
            {
                
                var tournamentVenue = tournamentInfo.venueAddress;
                var tournamentAddress = tournamentInfo.domainName;
                var tournamentStartDate = tournamentInfo.eventStartDate;
                var tournamentEndDate = tournamentInfo.eventEndDate;

                var paidRecords = [];
                var totalAmount = "0";
                if (eventList) 
                {
                    for (var i = 0; i < eventList.length; i++) {
                        var eventName = eventList[i].eventName;
                        var price = eventList[i].prize;
                        if (eventList[i].eventParticipants && parseInt(eventList[i].projectType) == 2) {
                            var eventParticipantsList = eventList[i].eventParticipants;
                            if (eventParticipantsList) {
                                for (var k = 0; k < eventParticipantsList.length; k++) {
                                    var participantID = eventParticipantsList[k];
                                    if (playerID == participantID) {
                                        var receiptStatus = global[playerTeamEntries].findOne({
                                            "tournamentId": tournamentId,
                                            "playerId": playerID,
                                            "paidOrNot": true
                                        });
                                        if (receiptStatus != undefined) {
                                            totalAmount = parseInt(totalAmount) + parseInt(price);
                                            paidRecords.push({
                                                "eventName": eventName,
                                                "eventPrice": price
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                var player = "";
                var playerInfo = Meteor.users.findOne({"userId":playerID});
                if(playerInfo)
                    player = playerInfo.userName
                var data = 
                {
                    paidRecords: paidRecords,
                    player: player,
                    tournamentName: tournamentInfo.eventName,
                    tournamentVenue: tournamentVenue,
                    tournamentAddress: tournamentAddress,
                    tournamentStartDate: reverseDate(tournamentStartDate),
                    tournamentEndDate: reverseDate(tournamentEndDate),
                    totalAmount: totalAmount
                }

                var html_string = SSR.render('layout', {
                    css: css,
                    template: "matchRecords_report",
                    data: data
                });

                var options = {
                    "paperSize": {
                        "format": "Letter",
                        "orientation": "portrait",
                        "margin": "1cm"
                    },
                    siteType: 'html'
                };

                webshot(html_string, fileName, options, function(err) {
                    fs.readFile(fileName, function(err, data) {
                        if (err) {
                            return
                        }

                        fs.unlinkSync(fileName);
                        fut.return(data);

                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');

                return base64String;

            } 
        }

    },
})