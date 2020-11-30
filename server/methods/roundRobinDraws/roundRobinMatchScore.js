function findTheMatchScore(setA, setB) {
    try {
        if (setA.length != setB.length)
            return false;

        var AValue = 0;
        var BValue = 0;

        //loop through each set
        for (var i = 0; i < setA.length; i++) {
            setA[i] = setA[i].toString().replace(/^0+(?!\.|$)/, '')
            setB[i] = setB[i].toString().replace(/^0+(?!\.|$)/, '')
            if (parseInt(setA[i]) > parseInt(setB[i])) {
                AValue = parseInt(AValue) + 1;
            } else if (parseInt(setB[i]) > parseInt(setA[i])) {
                BValue = parseInt(BValue) + 1;
            }
        }

        if (parseInt(AValue) > parseInt(BValue)) {
            var resultJson = {};
            resultJson["winner"] = "teamA";
            resultJson["AValue"] = AValue;
            resultJson["BValue"] = BValue;
            return resultJson;
        } else if (parseInt(BValue) > parseInt(AValue)) {

            //return "teamB";  
            var resultJson = {};
            resultJson["winner"] = "teamB";
            resultJson["AValue"] = AValue;
            resultJson["BValue"] = BValue;
            return resultJson;
        } else {
            return {};
        }


    } catch (e) {
        errorLog(e)
    }
}


Meteor.methods({

    "fetchPlayers1": function(playerID) {
        if (playerID) {
            var userInfo = Meteor.users.findOne({
                "userId": playerID
            });

            if (userInfo)
                return userInfo
        } else {

        }
    },

    "fetchMatchDetailRecord": function(data) {
        try {
            if (data) {

                var objCheck = Match.test(data, {
                    "tournamentId": String,
                    "eventName": String,
                    "teamAID": String,
                    "teamBID": String,
                    "no": Number
                });
                if (objCheck) {
                    var tournamentId = data.tournamentId;
                    var eventName = data.eventName;
                    var teamAID = data.teamAID;
                    var teamBID = data.teamBID;
                    var no = data.no;

                    var scoreInfo = roundRobinMatchScore.aggregate([{
                            $match: {
                                "tournamentId": tournamentId,
                                "eventName": eventName,
                                "detailScore.teamAID": teamAID,
                                "detailScore.teamBID": teamBID
                            }
                        }, {
                            $unwind: "$detailScore"
                        }, {
                            $match: {
                                "detailScore.teamAID": teamAID,
                                "detailScore.teamBID": teamBID
                            }
                        }, {
                            $group: {
                                "_id": {
                                    "teamAID": "$detailScore.teamAID",
                                    "teamBID": "$detailScore.teamBID"
                                },
                                "detailScore": {
                                    $push: "$detailScore"
                                }
                            }
                        },
                        /*{$unwind:"$matchDetails"},
                        {$match:{
                            "matchDetails.no":no,
                        }},
                        {$group:{
                            "_id":{"teamAID":"$detailScore.teamAID","teamBID":"$detailScore.teamBID"},
                            "matchDetails":{$push:"$matchDetails"}
                        }}*/
                        ,
                    ]);
                    /*if(scoreInfo && scoreInfo.detailScore && scoreInfo.detailScore.length > 0)
                    {
                        var detailedInfo = scoreInfo.detailScore[0].matchDetails;
                        if(detailedInfo[i] && detailedInfo[i].no == formatInfo.specifications[i]["no"])
                        {
                            formatInfo.specifications[i]["detailScore"] = detailedInfo[i];

                        }
                    }*/
                } else {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Require all parameters";
                    return resultJson;
                }
            } else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Require all parameters";
                return resultJson;
            }
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["message"] = "Require all parameters .. " + e;
            return resultJson;
        }
    },
    "matchScoreDetails": async function(data, currentMatchDetails) {
        try {
            if (data) {
                var objCheck = Match.test(data, {
                    "tournamentId": String,
                    "eventName": String,
                    "matchID": String,
                    "teamAId": String,
                    "teamBId": String,
                    "matchDetails": [{
                        "no": String,
                        "teamAplayerAID": String,
                        "teamAplayerBID": String,
                        "teamBplayerAID": String,
                        "teamBplayerBID": String,
                        "setScoresA": [String],
                        "setScoresB": [String],
                        "winnerA": String,
                        "winnerB": String,
                        "winnerIdTeam": String,
                        "matchType": String

                    }],
                    "invMatchDetails": [{
                        "no": String,
                        "teamAplayerAID": String,
                        "teamAplayerBID": String,
                        "teamBplayerAID": String,
                        "teamBplayerBID": String,
                        "setScoresA": [String],
                        "setScoresB": [String],
                        "winnerA": String,
                        "winnerB": String,
                        "winnerIdTeam": String,
                        "matchType": String

                    }],
                    "finalTeamWinner": String,
                    "teamMatchType": String,
                    "teamType": String
                });

                objCheck = true;
                if (objCheck) {

                    var dataExists = roundRobinMatchScore.findOne({
                        "tournamentId": data.tournamentId,
                        "eventName": data.eventName
                    });
                    var matchDetScore = {};
                    matchDetScore["teamAID"] = data.teamAId;
                    matchDetScore["teamBID"] = data.teamBId;
                    matchDetScore["matchDetails"] = data.matchDetails;
                    matchDetScore["teamMatchType"] = data.teamMatchType;
                    matchDetScore["finalTeamWinner"] = data.finalTeamWinner;

                    var invMatchDetScore = {};
                    invMatchDetScore["teamAID"] = data.teamBId;
                    invMatchDetScore["teamBID"] = data.teamAId;
                    invMatchDetScore["matchDetails"] = data.invMatchDetails;
                    invMatchDetScore["teamMatchType"] = data.teamMatchType;
                    invMatchDetScore["finalTeamWinner"] = data.finalTeamWinner;

                    if (dataExists) {
                        var checkMatchRecord1 = roundRobinMatchScore.aggregate([{
                            $match: {
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName
                            }
                        }, {
                            $unwind: "$detailScore"
                        }, {
                            $match: {
                                "detailScore.teamAID": data.teamAId,
                                "detailScore.teamBID": data.teamBId
                            }
                        }, {
                            $project: {
                                "detailScore": "$detailScore"
                            }
                        }]);

                        var checkMatchRecord2 = roundRobinMatchScore.aggregate([{
                            $match: {
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName
                            }
                        }, {
                            $unwind: "$detailScore"
                        }, {
                            $match: {
                                "detailScore.teamAID": data.teamBId,
                                "detailScore.teamBID": data.teamAId
                            }
                        }, {
                            $project: {
                                "detailScore": "$detailScore"
                            }
                        }]);

                        var res1 = 0;
                        var res2 = 0;


                        if (checkMatchRecord1 && checkMatchRecord1[0] && checkMatchRecord1[0].detailScore) {
                            res1 = roundRobinMatchScore.update({
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName,
                                "detailScore": {
                                    $elemMatch: {
                                        teamAID: data.teamAId,
                                        teamBID: data.teamBId
                                    }
                                }
                            }, {
                                $set: {
                                    "detailScore.$": matchDetScore
                                }
                            });
                        } else {

                            res1 = roundRobinMatchScore.update({
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName,
                            }, {
                                $push: {
                                    "detailScore": matchDetScore
                                }
                            });
                        }

                        if (checkMatchRecord2 && checkMatchRecord2[0] && checkMatchRecord2[0].detailScore) {
                            res2 = roundRobinMatchScore.update({
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName,
                                "detailScore": {
                                    $elemMatch: {
                                        teamAID: data.teamBId,
                                        teamBID: data.teamAId
                                    }
                                }
                            }, {
                                $set: {
                                    "detailScore.$": invMatchDetScore
                                }
                            });
                        } else {
                            res2 = roundRobinMatchScore.update({
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName,
                            }, {
                                $push: {
                                    "detailScore": invMatchDetScore
                                }
                            });

                        }



                        /*var res1 = roundRobinMatchScore.update({
                            "tournamentId": data.tournamentId,
                            "eventName": data.eventName,
                            "detailScore": {
                                $elemMatch: {
                                    teamAID: data.teamAId,
                                    teamBID: data.teamBId
                                }
                            }
                        }, {
                            $set: {
                               "detailScore.$": matchDetScore
                            }
                        });


                        var res2 = roundRobinMatchScore.update({
                            "tournamentId": data.tournamentId,
                            "eventName": data.eventName,
                            "detailScore": {
                                $elemMatch: {
                                    teamAID: data.teamBId,
                                    teamBID: data.teamAId
                                }
                            }
                        }, {
                            $set: {
                               "detailScore.$": invMatchDetScore
                            }
                        });*/


                        if (res1 || res2) {
                            var teamAWinCount = 0;
                            var teamBWinCount = 0;
                            var teamScoreSetA = [];
                            var teamScoreSetB = [];
                            var winnerID = "";
                            var loserID = "";
                            for (var i = 0; i < data.matchDetails.length; i++) {
                                var setA = data.matchDetails[i].setScoresA;
                                var setB = data.matchDetails[i].setScoresB;
                                var winRes = findTheMatchScore(setA, setB);
                                if (winRes.AValue == undefined)
                                    winRes.AValue = 0;
                                if (winRes.BValue == undefined)
                                    winRes.BValue = 0;
                                teamScoreSetA.push(winRes.AValue);
                                teamScoreSetB.push(winRes.BValue);

                                if (winRes.winner == "teamA")
                                    teamAWinCount++;
                                else if (winRes.winner == "teamB")
                                    teamBWinCount++;

                            }
                            var teamScoresSETS = {
                                setScoresA: teamScoreSetA,
                                setScoresB: teamScoreSetB
                            }

                            var inverse_teamScoresSETS = {
                                setScoresA: teamScoreSetB,
                                setScoresB: teamScoreSetA
                            }


                            var setWins = {
                                "teamA": teamAWinCount,
                                "teamB": teamBWinCount
                            };
                            var inverse_setWins = {
                                "teamA": teamBWinCount,
                                "teamB": teamAWinCount
                            };

                            if (parseInt(teamAWinCount) > parseInt(teamBWinCount)) {
                                winnerID = data.teamAId;
                                loserID = data.teamBId;
                            } else if (parseInt(teamBWinCount) > parseInt(teamAWinCount)) {
                                winnerID = data.teamAId
                                loserID = data.teamBId
                            }

                            var completedData = {};
                            completedData["winnerID"] = winnerID;
                            completedData["loserID"] = loserID;
                            completedData["teamScoresSETS"] = teamScoresSETS;
                            completedData["inverse_teamScoresSETS"] = inverse_teamScoresSETS;
                            completedData["setWins"] = setWins;
                            completedData["inverse_setWins"] = inverse_setWins;

                            var xData = {};
                            xData["setType"] = data.teamMatchType;
                            xData["teamWinnerId"] = data.finalTeamWinner;
                            xData["teamType"] = data.teamType;
                            xData["teamAId"] = data.teamAId;
                            xData["teamBId"] = data.teamBId;



                            var matchRecord = currentMatchDetails;
                            var mainDrawResult = await Meteor.call("updateRRTeamMatchRecord", data.matchID, xData, matchRecord.rowNo, matchRecord.colNo, completedData);
                            var resultJson = {};
                            resultJson["status"] = "success";
                            var latestResult = await Meteor.call("fetchTeamDetailScore", data.tournamentId, data.eventName, currentMatchDetails);
                            if (latestResult && latestResult.status == "success") {
                                if (latestResult.teamMatchType)
                                    resultJson["teamMatchType"] = latestResult.teamMatchType;
                                if (latestResult.finalTeamWinner)
                                    resultJson["finalTeamWinner"] = latestResult.finalTeamWinner;
                                if (latestResult.specifications)
                                    resultJson["specifications"] = latestResult.specifications;
                            }
                            var matchRecords = roundRobinTeamEvents.find({
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName
                            }, {
                                sort: {
                                    groupNumber: 1
                                }
                            }).fetch();
                            resultJson["matchRecords"] = matchRecords;
                            resultJson["message"] = "Match details saved!!";
                            return resultJson;
                        } else {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["message"] = "Could not save match details!!";
                            return resultJson;
                        }




                    } else {

                        var teamDetailedScores = [];
                        teamDetailedScores.push(matchDetScore);
                        teamDetailedScores.push(invMatchDetScore);


                        var res1 = roundRobinMatchScore.insert({
                            "tournamentId": data.tournamentId,
                            "eventName": data.eventName,
                            "detailScore": teamDetailedScores
                        });
                        if (res1) {
                            var teamAWinCount = 0;
                            var teamBWinCount = 0;
                            var teamScoreSetA = [];
                            var teamScoreSetB = [];
                            var winnerID = "";
                            var loserID = "";
                            for (var i = 0; i < data.matchDetails.length; i++) {
                                var setA = data.matchDetails[i].setScoresA;
                                var setB = data.matchDetails[i].setScoresB;
                                var winRes = findTheMatchScore(setA, setB);
                                if (winRes.AValue == undefined)
                                    winRes.AValue = 0;
                                else if (winRes.BValue == undefined)
                                    winRes.BValue = 0;
                                teamScoreSetA.push(winRes.AValue);
                                teamScoreSetB.push(winRes.BValue);

                                if (winRes.winner == "teamA")
                                    teamAWinCount++;
                                else if (winRes.winner == "teamB")
                                    teamBWinCount++;

                            }
                            var teamScoresSETS = {
                                setScoresA: teamScoreSetA,
                                setScoresB: teamScoreSetB
                            }

                            var inverse_teamScoresSETS = {
                                setScoresA: teamScoreSetB,
                                setScoresB: teamScoreSetA
                            }
                            var setWins = {
                                "teamA": teamAWinCount,
                                "teamB": teamBWinCount
                            };
                            var inverse_setWins = {
                                "teamA": teamBWinCount,
                                "teamB": teamAWinCount
                            };

                            if (parseInt(teamAWinCount) > parseInt(teamBWinCount)) {
                                winnerID = data.teamAId;
                                loserID = data.teamBId;
                            } else if (parseInt(teamBWinCount) > parseInt(teamAWinCount)) {
                                winnerID = data.teamAId
                                loserID = data.teamBId
                            }

                            var completedData = {};
                            completedData["winnerID"] = winnerID;
                            completedData["loserID"] = loserID;
                            completedData["teamScoresSETS"] = teamScoresSETS;
                            completedData["inverse_teamScoresSETS"] = inverse_teamScoresSETS;
                            completedData["setWins"] = setWins;
                            completedData["inverse_setWins"] = inverse_setWins;

                            var xData = {};
                            xData["setType"] = data.teamMatchType;
                            xData["teamWinnerId"] = data.finalTeamWinner;
                            xData["teamType"] = data.teamType;
                            xData["teamAId"] = data.teamAId;
                            xData["teamBId"] = data.teamBId;



                            var matchRecord = currentMatchDetails;
                            var mainDrawResult = await Meteor.call("updateRRTeamMatchRecord", data.matchID, xData, matchRecord.rowNo, matchRecord.colNo, completedData);


                            var resultJson = {};
                            resultJson["status"] = "success";
                            var latestResult = await Meteor.call("fetchTeamDetailScore", data.tournamentId, data.eventName, currentMatchDetails);
                            if (latestResult && latestResult.status == "success") {
                                if (latestResult.teamMatchType)
                                    resultJson["teamMatchType"] = latestResult.teamMatchType;
                                if (latestResult.finalTeamWinner)
                                    resultJson["finalTeamWinner"] = latestResult.finalTeamWinner;
                                if (latestResult.specifications)
                                    resultJson["specifications"] = latestResult.specifications;
                            }

                            var matchRecords = roundRobinTeamEvents.find({
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName
                            }, {
                                sort: {
                                    groupNumber: 1
                                }
                            }).fetch();
                            resultJson["matchRecords"] = matchRecords;

                            resultJson["message"] = "Match details saved!!";
                            return resultJson;

                        } else {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["message"] = "Could not save match details!!";
                            return resultJson;
                        }
                    }


                } else {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Require all parameters";
                    return resultJson;
                }
            } else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Require all parameters";
                return resultJson;
            }

        } catch (e) {
            errorLog(e)
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["message"] = "Could not save match details " + e;
            return resultJson;
        }
    },
    "fetchRRMatchScoreDraws": function(data) {
        try {
            var resultJson = {}

            var objCheck = Match.test(data, {
                "tournamentId": String,
                "eventName": String,
                "teamAID": String,
                "teamBID": String,
                "groupNo": Number
            });

            if (objCheck) {

                var tournamentId = data.tournamentId.trim();
                var eventName = data.eventName.trim();
                var teamAID = data.teamAID.trim();
                var teamBID = data.teamBID.trim();
                var groupNo = data.groupNo;
                var tourInfo = events.findOne({
                    "_id": data.tournamentId
                });
                if (tourInfo == undefined)
                    tourInfo = pastEvents.findOne({
                        "_id": data.tournamentId
                    });

                var teamConfig = roundRobinTeamConfig.findOne({
                    "tournamentId": tournamentId,
                    "eventName": eventName
                });

                if (teamConfig && teamConfig.matchFormatId && tourInfo) {
                    var lookUpDB = "";
                    var subExists = subscriptionRestrictions.findOne({
                        "tournamentId": tournamentId
                    });

                    if (subExists && subExists.selectionType &&
                        subExists.selectionType.toLowerCase() == "schoolonly") {
                        lookUpDB = "schoolTeams"
                    } else {
                        lookUpDB = "playerTeams"
                    }


                    var matchFormatId = teamConfig.matchFormatId;
                    var formatExists = orgTeamMatchFormat.findOne({
                        "_id": matchFormatId
                    });
                    var specifications = [];
                    if (formatExists && formatExists.specifications)
                        specifications = formatExists.specifications;

                    var scoreInfo = roundRobinMatchScore.aggregate([{
                        $match: {
                            "tournamentId": tournamentId,
                            "eventName": eventName,
                            "detailScore.teamAID": teamAID,
                            "detailScore.teamBID": teamBID
                        }
                    }, {
                        $unwind: "$detailScore"
                    }, {
                        $match: {
                            "detailScore.teamAID": teamAID,
                            "detailScore.teamBID": teamBID
                        }
                    }, {
                        $group: {
                            "_id": {
                                "teamAID": "$detailScore.teamAID",
                                "teamBID": "$detailScore.teamBID"
                            },
                            "teamAID": {
                                $first: "$detailScore.teamAID"
                            },
                            "teamBID": {
                                $first: "$detailScore.teamBID"
                            },
                            "matchDetails": {
                                $first: "$detailScore.matchDetails"
                            },
                            "teamMatchType": {
                                $first: "$detailScore.teamMatchType"
                            },
                            "finalTeamWinner": {
                                $first: "$detailScore.finalTeamWinner"
                            },
                        }
                    }, {
                        $unwind: {
                            "path": "$matchDetails"
                        }
                    }, {
                        $match: {
                            "matchDetails.matchType": {
                                $nin: ["notPlayed"]
                            }
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "matchDetails.teamAplayerAID",
                            foreignField: "userId",
                            as: "teamAPlayerA"
                        }
                    }, {
                        $unwind: {
                            path: "$teamAPlayerA",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $addFields: {
                            "matchDetails.teamAPlayerAName": "$teamAPlayerA.userName",
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "matchDetails.teamAplayerBID",
                            foreignField: "userId",
                            as: "teamAPlayerB"
                        }
                    }, {
                        $unwind: {
                            path: "$teamAPlayerB",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $addFields: {
                            "matchDetails.teamAPlayerBName": "$teamAPlayerB.userName",
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "matchDetails.teamBplayerAID",
                            foreignField: "userId",
                            as: "teamBPlayerA"
                        }
                    }, {
                        $unwind: {
                            path: "$teamBPlayerA",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $addFields: {
                            "matchDetails.teamBPlayerAName": "$teamBPlayerA.userName",
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "matchDetails.teamBplayerBID",
                            foreignField: "userId",
                            as: "teamBPlayerB"
                        }
                    }, {
                        $unwind: {
                            path: "$teamBPlayerB",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $addFields: {
                            "matchDetails.teamBPlayerBName": "$teamBPlayerB.userName",
                        }
                    }, {
                        $sort: {
                            "matchDetails.no": 1
                        }
                    }, {
                        $group: {
                            "_id": {
                                "teamAID": "$teamAID",
                                "teamBID": "$teamBID"
                            },
                            "matchDetails": {
                                $addToSet: "$matchDetails"
                            },
                            "teamAID": {
                                $first: "$teamAID"
                            },
                            "teamBID": {
                                $first: "$teamBID"
                            },
                            "teamMatchType": {
                                $first: "$teamMatchType"
                            },
                            "finalTeamWinner": {
                                $first: "$finalTeamWinner"
                            }
                        }
                    }, {
                        "$unwind": "$matchDetails"
                    }, {
                        $sort: {
                            "matchDetails.no": 1
                        }
                    }, {
                        "$group": {
                            "_id": null,
                            "matchDetails": {
                                "$push": "$matchDetails"
                            },
                            "teamAID": {
                                $first: "$teamAID"
                            },
                            "teamBID": {
                                $first: "$teamBID"
                            },
                            "teamMatchType": {
                                $first: "$teamMatchType"
                            },
                            "finalTeamWinner": {
                                $first: "$finalTeamWinner"
                            }
                        }
                    }, {
                        $project: {
                            "_id": 0,
                            "teamAID": 1,
                            "teamBID": 1,
                            "matchDetails": 1,
                            "teamMatchType": 1,
                            "finalTeamWinner": 1,
                        }
                    }, {
                        $lookup: {
                            from: lookUpDB,
                            localField: "teamAID",
                            foreignField: "_id",
                            as: "playerADetails"
                        }
                    }, {
                        $unwind: {
                            path: "$playerADetails",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: lookUpDB,
                            localField: "teamBID",
                            foreignField: "_id",
                            as: "playerBDetails"
                        }
                    }, {
                        $unwind: {
                            path: "$playerBDetails",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $addFields: {
                            "teamAName": "$playerADetails.teamName",
                            "teamBName": "$playerBDetails.teamName",
                        }
                    }, {
                        $project: {
                            "_id": 0,
                            "teamAID": 1,
                            "teamBID": 1,
                            "matchDetails": 1,
                            "teamMatchType": 1,
                            "finalTeamWinner": 1,
                            "teamAName": 1,
                            "teamBName": 1

                        }
                    }]);

                    var teamScores = roundRobinTeamEvents.findOne({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                        "groupNumber": groupNo
                    }, {
                        fields: {
                            _id: 0,
                            "groupDetails": {
                                $elemMatch: {
                                    "teamsID.teamAId": teamAID,
                                    "teamsID.teamBId": teamBID
                                }
                            }
                        }
                    });


                    var teamBName = ""
                    var teamAName = ""

                    if (teamScores && teamScores.groupDetails &&
                        teamScores.groupDetails.length && teamScores.groupDetails[0]) {
                        var getTeamScoresAB = []
                        var lookUPTable2 = lookUpDB

                        var da = {
                            teamMatchType: teamScores.groupDetails[0].status,
                            teamAId: teamScores.groupDetails[0].teamsID.teamAId,
                            teamBId: teamScores.groupDetails[0].teamsID.teamBId,
                            finalTeamWinner: teamScores.groupDetails[0].winnerID,
                            scoresA: teamScores.groupDetails[0].scores.setScoresA,
                            scoresB: teamScores.groupDetails[0].scores.setScoresB,
                        }
                        getTeamScoresAB.push(da)

                        if (getTeamScoresAB[0].teamAId) {
                            var schDet = global[lookUPTable2].findOne({
                                '_id': getTeamScoresAB[0].teamAId
                            })

                            if (schDet && schDet.teamName) {
                                teamAName = schDet.teamName
                            }
                            if (schDet && schDet.schoolId) {
                                var schooADet = schoolDetails.findOne({
                                    "userId": schDet.schoolId
                                })
                                if (schooADet && schooADet.interestedDomainName && schooADet.interestedDomainName[0]) {
                                    var domNam = domains.findOne({
                                        "_id": schooADet.interestedDomainName[0]
                                    })
                                    if (domNam && domNam.domainName) {
                                        teamAName = teamAName + ", " + domNam.domainName
                                    }
                                }
                            }
                        }
                        if (getTeamScoresAB[0].teamBId) {
                            var schDet = global[lookUPTable2].findOne({
                                '_id': getTeamScoresAB[0].teamBId
                            })

                            if (schDet && schDet.teamName) {
                                teamBName = schDet.teamName
                            }
                            if (schDet && schDet.schoolId) {
                                var schooADet = schoolDetails.findOne({
                                    "userId": schDet.schoolId
                                })
                                if (schooADet && schooADet.interestedDomainName && schooADet.interestedDomainName[0]) {
                                    var domNam = domains.findOne({
                                        "_id": schooADet.interestedDomainName[0]
                                    })
                                    if (domNam && domNam.domainName) {
                                        teamBName = teamBName + ", " + domNam.domainName
                                    }
                                }
                            }
                        }

                        getTeamScoresAB[0].teamAName = teamAName
                        getTeamScoresAB[0].teamBName = teamBName
                        getTeamScoresAB[0].teamAID = getTeamScoresAB[0].teamAId
                        getTeamScoresAB[0].teamBID = getTeamScoresAB[0].teamBId
                        resultJson["teamScoresAB"] = getTeamScoresAB[0]
                    }

                    if (scoreInfo.length > 0 && scoreInfo[0] && scoreInfo[0].matchDetails) {
                        var mergedList = _.map(scoreInfo[0].matchDetails, function(item) {
                            return _.extend(item, _.findWhere(specifications, {
                                "no": item.no,
                            }));
                        });




                        scoreInfo[0]["teamADomain"] = "";
                        scoreInfo[0]["teamBDomain"] = "";


                        if (scoreInfo[0] && scoreInfo[0].teamAID && lookUpDB == "schoolTeams") {
                            var teamAInfo = schoolTeams.findOne({
                                "_id": scoreInfo[0].teamAID
                            });
                            if (teamAInfo && teamAInfo.schoolId) {
                                var schoolDetailsInfo = schoolDetails.findOne({
                                    "userId": teamAInfo.schoolId
                                });
                                if (schoolDetailsInfo && schoolDetailsInfo.state) {
                                    var domainInfo = domains.findOne({
                                        "_id": schoolDetailsInfo.state
                                    });
                                    if (domainInfo)
                                        scoreInfo[0].teamADomain = domainInfo.domainName;
                                }

                            }
                        }

                        if (scoreInfo[0] && scoreInfo[0].teamBID && lookUpDB == "schoolTeams") {
                            var teamAInfo = schoolTeams.findOne({
                                "_id": scoreInfo[0].teamBID
                            });
                            if (teamAInfo && teamAInfo.schoolId) {
                                var schoolDetailsInfo = schoolDetails.findOne({
                                    "userId": teamAInfo.schoolId
                                });
                                if (schoolDetailsInfo && schoolDetailsInfo.state) {
                                    var domainInfo = domains.findOne({
                                        "_id": schoolDetailsInfo.state
                                    });
                                    if (domainInfo)
                                        scoreInfo[0].teamBDomain = domainInfo.domainName;
                                }

                            }
                        }




                        var dataJson = {};
                        dataJson["teamAID"] = scoreInfo[0].teamAID;
                        dataJson["teamBID"] = scoreInfo[0].teamBID;
                        dataJson["teamAName"] = scoreInfo[0].teamAName;
                        dataJson["teamBName"] = scoreInfo[0].teamBName;
                        dataJson["teamADomain"] = scoreInfo[0].teamADomain;
                        dataJson["teamBDomain"] = scoreInfo[0].teamBDomain;
                        dataJson["matchDetails"] = mergedList;
                        dataJson["teamMatchType"] = scoreInfo[0].teamMatchType;
                        dataJson["finalTeamWinner"] = scoreInfo[0].finalTeamWinner;



                        if (teamScores && teamScores.groupDetails && teamScores.groupDetails[0] &&
                            teamScores.groupDetails[0].scores && teamScores.groupDetails[0].scores.setScoresA &&
                            teamScores.groupDetails[0].scores.setScoresB) {
                            dataJson["teamAScores"] = teamScores.groupDetails[0].scores.setScoresA;
                            dataJson["teamBScores"] = teamScores.groupDetails[0].scores.setScoresB;
                        }

                        resultJson["status"] = "success";
                        resultJson["data"] = dataJson;
                        resultJson["tournamentData"] = tourInfo;
                        resultJson["message"] = "Team detailed scores";

                        return resultJson;
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["message"] = "Team detailed scores awaited";
                        if (tourInfo)
                            resultJson["tournamentData"] = tourInfo;

                        return resultJson;
                    }

                } else {
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Invalid data";
                    return resultJson;
                }
            } else {

                resultJson["status"] = "failure";
                resultJson["message"] = "Require all parameters";
                return resultJson;
            }

        } catch (e) {
            errorLog(e)
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["message"] = "Require all parameters " + e;
            return resultJson;
        }
    }

})