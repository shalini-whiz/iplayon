import {
    initDBS
}
from '../dbRequiredRole.js'
//userDetailsTTUsed

Meteor.methods({
    'teamPlayersFetch': async function(teamId, tournamentId) {
        try {
            

            var tournamentFind = events.findOne({
                "_id": tournamentId
            })
            var dbsrequired = ["userDetailsTT", "playerTeams"]

            var userDetailsTT = "userDetailsTT"
            var playerTeams = "playerTeams"
            var considerTeamEventBool = null
            if (tournamentFind == undefined || tournamentFind == null) {
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
                            playerTeams = res.changedDbNames[1]
                            considerTeamEventBool = true
                            var playersDB = initDBS("playersDB")
                            if(_.contains(playersDB,userDetailsTT)){
                                considerTeamEventBool = null
                            }
                        }
                    }
                }
            }catch(e){
                console.log(e)
            }

            var s = global[playerTeams].aggregate([{
                $match: {
                    "_id": teamId
                }
            }, {
                $unwind: "$teamMembers"
            }, {
                $match: {
                    "teamMembers.teamEvent": considerTeamEventBool
                }
            }, {
                $project: {
                    playerId: "$teamMembers.playerId"
                }
            }, {
                $group: {
                    "_id": null,
                    players: {
                        $push: "$playerId"
                    }
                }
            }])



            if (s && s[0] && s[0].players) {
                var playerIds = s[0].players;
                var userDet = global[userDetailsTT].find({
                    userId: {
                        $in: playerIds
                    }
                }, {
                    fields: {
                        userName: 1,
                        userId: 1,
                        dateOfBirth: 1
                    }
                }).fetch();
                if (userDet && userDet.length != 0) {

                    return userDet
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
});

Meteor.methods({
    'saveTeamSpecFormData': function(tournamentId, eventName, data) {
        try {
            var eveDet = events.findOne({
                "_id": tournamentId
            });
            if (eveDet == undefined) {
                eveDet = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            if (eveDet && eveDet.eventOrganizer) {
                if (eveDet.eventOrganizer == this.userId) {
                    var k = teamDrawsSpec.findOne({
                        tournamentId: tournamentId,
                        eventName: eventName
                    })
                    if (k == undefined) {
                        var s = teamDrawsSpec.insert({
                            tournamentId: tournamentId,
                            eventName: eventName,
                            teamDet: [data]
                        })
                        if (s) {
                            //insert into detail scrore
                            Meteor.call("insertIntoTeamDetails", tournamentId, eventName, data, function(e, res) {

                            })
                        }
                    } else {
                        var k = teamDrawsSpec.find({
                            tournamentId: tournamentId,
                            eventName: eventName,
                            teamDet: {
                                $elemMatch: {
                                    matchNumber: data.matchNumber,
                                    roundNumber: data.roundNumber
                                }
                            }
                        });

                        if (k.fetch().length == 0) {
                            var r = teamDrawsSpec.update({
                                tournamentId: tournamentId,
                                eventName: eventName
                            }, {
                                $addToSet: {
                                    "teamDet": data
                                }
                            })
                            if (r) {
                                //update team details score
                                Meteor.call("updateIfRoundMatchExistsIntoTeamDetails", tournamentId, eventName, data, function(e, res) {

                                })
                            }
                        } else {
                            var r = teamDrawsSpec.update({
                                tournamentId: tournamentId,
                                eventName: eventName,
                                teamDet: {
                                    $elemMatch: {
                                        matchNumber: data.matchNumber,
                                        roundNumber: data.roundNumber
                                    }
                                }
                            }, {
                                $set: {
                                    "teamDet.$": data
                                }
                            });

                            if (r) {
                                //update team details score
                                Meteor.call("updateIfRoundMatchExistsIntoTeamDetails", tournamentId, eventName, data, function(e, res) {

                                })
                            }
                        }
                    }
                } else return false
            } else return false;
        } catch (e) {
            console.log(e)
        }
    }
});

Meteor.methods({
    'insertIntoTeamDetails': function(tournamentId, eventName, data) {
        try {
            var eveDet = events.findOne({
                "_id": tournamentId
            });
            if (eveDet == undefined) {
                eveDet = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            if (eveDet && eveDet.eventOrganizer) {
                if (eveDet.eventOrganizer == this.userId) {
                    var teamDetScore = {
                            matchNumber: data.matchNumber,
                            roundNumber: data.roundNumber,
                            teamAID: data.teamAID,
                            teamBID: data.teamBID,
                            finalTeamWinner: "1",
                            teamMatchType: "notPlayed"
                        }
                        //match a vs x
                        //a team a player a
                        //x team b player a
                    var matchAVSX = {
                            playerAID: data.teamAPlayerAId,
                            playerBID: data.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }
                        //matchBVsY
                        //b team a player b
                        //y team b player b
                    var matchBVsY = {
                            playerAID: data.teamAPlayerBId,
                            playerBID: data.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }
                        //matchBVsX
                        //b team a player b
                        //x team b player a
                    var matchBVsX = {
                            playerAID: data.teamAPlayerBId,
                            playerBID: data.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }
                        //matchAVsY
                        //a team a player a
                        //b team b player b
                    var matchAVsY = {
                            playerAID: data.teamAPlayerAId,
                            playerBID: data.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }
                        //match doubles
                    var matchDoubles = {
                        teamAD1PlayerId: data.teamADoubles1PlayerId,
                        teamAD2PlayerId: data.teamADoubles2PlayerId,
                        teamBD1PlayerId: data.teamBDoubles1PlayerId,
                        teamBD2PlayerId: data.teamBDoubles2PlayerId,
                        matchType: "notPlayed",
                        winnerIdTeam: "1",
                        winnerD1PlayerId: '1',
                        winnerD2PlayerId: "1",
                        setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                        setScoresB: ["0", "0", "0", "0", "0", "0", "0"]
                    }

                    teamDetScore.matchAVSX = matchAVSX;
                    teamDetScore.matchBVsY = matchBVsY;
                    teamDetScore.matchBVsX = matchBVsX;
                    teamDetScore.matchAVsY = matchAVsY;
                    teamDetScore.matchDoubles = matchDoubles;

                    var l = teamDetailedScores.insert({
                        tournamentId: tournamentId,
                        eventName: eventName,
                        teamDetScore: [teamDetScore]
                    });

                    if (l) {
                        return true
                    }
                } else return false
            } else {
                return false
            }
        } catch (e) {
            console.log(e)
        }
    }
});

Meteor.methods({
    'updateIfRoundMatchExistsIntoTeamDetails': function(tournamentId, eventName, data) {
        try {
            var eveDet = events.findOne({
                "_id": tournamentId
            });
            if (eveDet == undefined) {
                eveDet = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            if (eveDet && eveDet.eventOrganizer) {
                if (eveDet.eventOrganizer == this.userId) {
                    var findDEtScore = teamDetailedScores.aggregate([{
                        $match: {
                            tournamentId: tournamentId,
                            eventName: eventName
                        }
                    }, {
                        $unwind: "$teamDetScore"
                    }, {
                        $match: {
                            "teamDetScore.matchNumber": data.matchNumber,
                            "teamDetScore.roundNumber": data.roundNumber
                        }
                    }, {
                        $project: {
                            teamDetScore: "$teamDetScore"
                        }
                    }])

                    var teamDetScore = {};
                    var matchAVSXFind = {};
                    var matchBVsX = {};
                    var matchAVSX = {};
                    var matchBVsYFind = {};
                    var matchBVsY = {};
                    var matchBVsXFind = {};
                    var matchAVsYFind = {};
                    var matchAVsY = {};
                    var matchDoublesFind = {};
                    var matchDoubles = {};


                    if (findDEtScore && findDEtScore[0] && findDEtScore[0].teamDetScore) {

                        var teamDetScoreFind = findDEtScore[0].teamDetScore;
                        if (teamDetScoreFind.finalTeamWinner == undefined) {
                            teamDetScoreFind.finalTeamWinner = "1";
                        }
                        if (teamDetScoreFind.teamMatchType == undefined) {
                            teamDetScoreFind.teamMatchType = "1";
                        }

                        if (teamDetScoreFind) {
                            teamDetScore = {
                                matchNumber: data.matchNumber,
                                roundNumber: data.roundNumber,
                                teamAID: data.teamAID,
                                teamBID: data.teamBID,
                                finalTeamWinner: teamDetScoreFind.finalTeamWinner,
                                teamMatchType: teamDetScoreFind.teamMatchType
                            }
                        }


                        if (teamDetScoreFind && teamDetScoreFind.matchAVSX) {
                            matchAVSXFind = teamDetScoreFind.matchAVSX;
                            //match a vs x
                            //a team a player a
                            //x team b player a
                            matchAVSX = {
                                playerAID: data.teamAPlayerAId,
                                playerBID: data.teamBPlayerAId,
                                setScoresA: matchAVSXFind.setScoresA,
                                setScoresB: matchAVSXFind.setScoresB,
                                winnerIdPlayer: matchAVSXFind.winnerIdPlayer,
                                matchType: matchAVSXFind.matchType,
                                winnerIdTeam: matchAVSXFind.winnerIdTeam,
                            }
                        }

                        if (teamDetScoreFind && teamDetScoreFind.matchBVsY) {
                            matchBVsYFind = teamDetScoreFind.matchBVsY;
                            //matchBVsY
                            //b team a player b
                            //y team b player b
                            matchBVsY = {
                                playerAID: data.teamAPlayerBId,
                                playerBID: data.teamBPlayerBId,
                                setScoresA: matchBVsYFind.setScoresA,
                                setScoresB: matchBVsYFind.setScoresB,
                                winnerIdPlayer: matchBVsYFind.winnerIdPlayer,
                                matchType: matchBVsYFind.matchType,
                                winnerIdTeam: matchBVsYFind.winnerIdTeam,
                            }

                        }

                        if (teamDetScoreFind && teamDetScoreFind.matchBVsX) {
                            matchBVsXFind = teamDetScoreFind.matchBVsX;
                            //matchBVsX
                            //b team a player b
                            //x team b player a
                            matchBVsX = {
                                playerAID: data.teamAPlayerBId,
                                playerBID: data.teamBPlayerAId,
                                setScoresA: matchBVsXFind.setScoresA,
                                setScoresB: matchBVsXFind.setScoresB,
                                winnerIdPlayer: matchBVsXFind.winnerIdPlayer,
                                matchType: matchBVsXFind.matchType,
                                winnerIdTeam: matchBVsXFind.winnerIdTeam,
                            }

                        }

                        if (teamDetScoreFind && teamDetScoreFind.matchAVsY) {
                            matchAVsYFind = teamDetScoreFind.matchAVsY;
                            //matchAVsY
                            //a team a player a
                            //b team b player b
                            matchAVsY = {
                                playerAID: data.teamAPlayerAId,
                                playerBID: data.teamBPlayerBId,
                                setScoresA: matchAVsYFind.setScoresA,
                                setScoresB: matchAVsYFind.setScoresB,
                                winnerIdPlayer: matchAVsYFind.winnerIdPlayer,
                                matchType: matchAVsYFind.matchType,
                                winnerIdTeam: matchAVsYFind.winnerIdTeam,
                            }

                        }

                        if (teamDetScoreFind && teamDetScoreFind.matchDoubles) {
                            matchDoublesFind = teamDetScoreFind.matchDoubles;
                            //match doubles
                            matchDoubles = {
                                teamAD1PlayerId: data.teamADoubles1PlayerId,
                                teamAD2PlayerId: data.teamADoubles2PlayerId,
                                teamBD1PlayerId: data.teamBDoubles1PlayerId,
                                teamBD2PlayerId: data.teamBDoubles2PlayerId,
                                matchType: matchDoublesFind.matchType,
                                winnerIdTeam: matchDoublesFind.winnerIdTeam,
                                winnerD1PlayerId: matchDoublesFind.winnerD1PlayerId,
                                winnerD2PlayerId: matchDoublesFind.winnerD2PlayerId,
                                setScoresA: matchDoublesFind.setScoresA,
                                setScoresB: matchDoublesFind.setScoresB
                            }

                        }

                        if (teamDetScoreFind) {
                            teamDetScore.matchAVSX = matchAVSX;
                            teamDetScore.matchBVsY = matchBVsY;
                            teamDetScore.matchBVsX = matchBVsX;
                            teamDetScore.matchAVsY = matchAVsY;
                            teamDetScore.matchDoubles = matchDoubles;

                            var r = teamDetailedScores.update({
                                tournamentId: tournamentId,
                                eventName: eventName,
                                teamDetScore: {
                                    $elemMatch: {
                                        matchNumber: data.matchNumber,
                                        roundNumber: data.roundNumber
                                    }
                                }
                            }, {
                                $set: {
                                    "teamDetScore.$": teamDetScore
                                }
                            });


                        }
                    }
                    //if match num and round number is not there in teamdetails 
                    else {

                        var teamDetScoreFind = {}

                        if (teamDetScoreFind) {
                            teamDetScore = {
                                matchNumber: data.matchNumber,
                                roundNumber: data.roundNumber,
                                teamAID: data.teamAID,
                                teamBID: data.teamBID,
                                finalTeamWinner: "1",
                                teamMatchType: "notPlayed"
                            }
                        }


                        if (teamDetScoreFind) {
                            //match a vs x
                            //a team a player a
                            //x team b player a
                            matchAVSX = {
                                playerAID: data.teamAPlayerAId,
                                playerBID: data.teamBPlayerAId,
                                setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                                setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                                winnerIdPlayer: "1",
                                matchType: "notPlayed",
                                winnerIdTeam: "1",
                            }

                        }

                        if (teamDetScoreFind) {
                            //matchBVsY
                            //b team a player b
                            //y team b player b
                            matchBVsY = {
                                playerAID: data.teamAPlayerBId,
                                playerBID: data.teamBPlayerBId,
                                setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                                setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                                winnerIdPlayer: "1",
                                matchType: "notPlayed",
                                winnerIdTeam: "1"
                            }

                        }

                        if (teamDetScoreFind) {
                            //matchBVsX
                            //b team a player b
                            //x team b player a
                            matchBVsX = {
                                playerAID: data.teamAPlayerBId,
                                playerBID: data.teamBPlayerAId,
                                setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                                setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                                winnerIdPlayer: "1",
                                matchType: "notPlayed",
                                winnerIdTeam: "1"
                            }

                        }

                        if (teamDetScoreFind) {
                            //matchAVsY
                            //a team a player a
                            //b team b player b
                            matchAVsY = {
                                playerAID: data.teamAPlayerAId,
                                playerBID: data.teamBPlayerBId,
                                setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                                setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                                winnerIdPlayer: "1",
                                matchType: "notPlayed",
                                winnerIdTeam: "1"
                            }

                        }

                        if (teamDetScoreFind) {
                            //match doubles
                            matchDoubles = {
                                teamAD1PlayerId: data.teamADoubles1PlayerId,
                                teamAD2PlayerId: data.teamADoubles2PlayerId,
                                teamBD1PlayerId: data.teamBDoubles1PlayerId,
                                teamBD2PlayerId: data.teamBDoubles2PlayerId,
                                matchType: "notPlayed",
                                winnerIdTeam: "1",
                                winnerD1PlayerId: "1",
                                winnerD2PlayerId: "1",
                                setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                                setScoresB: ["0", "0", "0", "0", "0", "0", "0"]
                            }

                        }

                        if (teamDetScoreFind) {
                            teamDetScore.matchAVSX = matchAVSX;
                            teamDetScore.matchBVsY = matchBVsY;
                            teamDetScore.matchBVsX = matchBVsX;
                            teamDetScore.matchAVsY = matchAVsY;
                            teamDetScore.matchDoubles = matchDoubles;

                            var r = teamDetailedScores.update({
                                tournamentId: tournamentId,
                                eventName: eventName,
                            }, {
                                $push: {
                                    "teamDetScore": teamDetScore
                                }
                            });


                        }

                    }
                } else return false
            } else return false
        } catch (e) {
            console.log(e)
        }
    }
});

/*
teamDetailedScores
    ----tournamentId
        eventName
        teamDetScore
            --matchNumber
                --  roundNumber
                    teamAID
                    teamBID
                    matchAVSX
                        -----playerAID
                            playerBID
                            setScoresA
                            setScoresB
                            winnerIdPlayer
                            matchType
                            winnerIdTeam
                    matchBVsY
                        -----playerAID
                            playerBID
                            setScoresA
                            setScoresB
                            winnerIdPlayer
                            matchType
                            winnerIdTeam
                    matchBVsX
                        -----playerAID
                            playerBID
                            setScoresA
                            setScoresB
                            winnerIdPlayer
                            matchType
                            winnerIdTeam
                    matchAVsY
                        -----playerAID
                            playerBID
                            setScoresA
                            setScoresB
                            winnerIdPlayer
                            matchType
                            winnerIdTeam            
                    matchDoubles
                        -----teamAD1PlayerId
                            teamAD1PlayerId
                            teamAD2PlayerId
                            teamBD1PlayerId
                            teamBD2PlayerId
                            matchType
                            winnerIdTeam
                            winnerD1PlayerId
                            winnerD2PlayerId
                            setScoresA
                            setScoresB                            

*/

Meteor.methods({
    'getMatchUserIdTeamSpec': function(tournamentId, eventName, matchNum, roundNum) {
       

        var s = teamDrawsSpec.aggregate([{
            $match: {
                "tournamentId": tournamentId,
                "eventName": eventName
            }
        }, {
            $unwind: "$teamDet"
        }, {
            $match: {
                "teamDet.matchNumber": matchNum,
                "teamDet.roundNumber": roundNum
            }
        }, {
            $project: {
                teamAID: "$teamDet.teamAID",
                teamBID: "$teamDet.teamBID",
                teamAPlayerAId: "$teamDet.teamAPlayerAId",
                teamAPlayerBId: "$teamDet.teamAPlayerBId",
                teamBPlayerAId: "$teamDet.teamBPlayerAId",
                teamBPlayerBId: "$teamDet.teamBPlayerBId",
                teamADoubles1PlayerId: "$teamDet.teamADoubles1PlayerId",
                teamADoubles2PlayerId: "$teamDet.teamADoubles2PlayerId",
                teamBDoubles1PlayerId: "$teamDet.teamBDoubles1PlayerId",
                teamBDoubles2PlayerId: "$teamDet.teamBDoubles2PlayerId",
            }
        }])
        if (s && s[0])
            return s[0]
    }
});

Meteor.methods({
    "findThePlayerName":async function(userId, tournamentId) {
        try {
            var tournamentFind = events.findOne({
                "_id": tournamentId
            })
            var dbsrequired = ["userDetailsTT"]

            var userDetailsTT = "userDetailsTT"
            if (tournamentFind == undefined || tournamentFind == null) {
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
                        }
                    }
                }
            }catch(e){
                console.log(e)
            }

            var userName = Meteor.users.findOne({
                userId: userId
            });

            if (userName) {
                var useDet = global[userDetailsTT].findOne({
                    userId: userId
                });
                if (useDet && useDet.userName) {
                    return useDet.userName;
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
});

Meteor.methods({
    "findTheTeamNameTeamDraws": async function(teamId, tournamentId) {
        try {
            var tournamentFind = events.findOne({
                "_id": tournamentId
            })
            var dbsrequired = ["playerTeams"]
            var playerTeams = "playerTeams"
            if (tournamentFind == undefined || tournamentFind == null) {
                tournamentFind = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            var res = await Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
            try {
                if (res) {
                    if (res.changeDb && res.changeDb == true) {
                        if (res.changedDbNames.length != 0) {
                            playerTeams = res.changedDbNames[0]
                        }
                    }
                }
            }catch(e){
                console.log(e)
            }

            var teamName = global[playerTeams].findOne({
                "_id": teamId
            });
            if (teamName) {
                var teamDet = teamName
                if (teamDet && teamDet.teamName) {
                    return teamDet.teamName;
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
});

Meteor.methods({
    "getDetailsOFTeamDetailedScore": function(tournamentId, eventName, matchNumber, roundNumber, teamId) {
        try {

            var s = teamDetailedScores.aggregate([{
                $match: {
                    tournamentId: tournamentId,
                    eventName: eventName
                }
            }, {
                $unwind: "$teamDetScore"
            }, {
                $match: {
                    "teamDetScore.matchNumber": matchNumber,
                    "teamDetScore.roundNumber": roundNumber
                }
            }, {
                $project: {
                    teamDetScore: "$teamDetScore"
                }
            }]);
            if (s && s[0] && s[0].teamDetScore) {
                return s[0].teamDetScore
            }
        } catch (e) {
            console.log(e)
        }
    }
})

Meteor.methods({
    "findTheMatchScore": function(setA, setB, playerAID, playerBID, teamAID, teamBID) {
        try {
            //check for the length of the array 
            if (setA.length != setB.length) {
                return false;
            }
            var AValue = 0;
            var BValue = 0;
            var winnerID = "1";
            var winnerTeamId = "1";
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
                winnerID = playerAID
                winnerTeamId = teamAID
            } else if (parseInt(BValue) > parseInt(AValue)) {
                winnerID = playerBID
                winnerTeamId = teamBID
            }

            var data = {
                AValue: AValue,
                BValue: BValue,
                winnerID: winnerID,
                winnerTeamId: winnerTeamId
            }
            
            return data
        } catch (e) {
            console.log(e)
        }
    }
});


Meteor.methods({
    "updateTeamDetailedScoresWithTeamDraws": async function(xData) {
        try {
            var eveDet = events.findOne({
                "_id": xData.tournamentId
            });
            if (eveDet == undefined) {
                eveDet = pastEvents.findOne({
                    "_id": xData.tournamentId
                })
            }
            if (eveDet && eveDet.eventOrganizer) {
                if (eveDet.eventOrganizer == this.userId) {
                    var avsxFinalScore = {};
                    var bvsxFinalScore = {};
                    var bvsyFinalScore = {};
                    var avsyFinalScore = {};
                    var doublesFinalScore = {};

                    if (xData && xData.teamDET) {
                        //match a vs x
                        var teamDETails = xData.teamDET;
                        //avsx
                        if (teamDETails.matchAVSX) {
                            var matchAVSXDEt = teamDETails.matchAVSX;
                            if (matchAVSXDEt.setScoresA && matchAVSXDEt.setScoresB && matchAVSXDEt.playerAID && matchAVSXDEt.playerBID && teamDETails.teamAID && teamDETails.teamBID) {
                                var setA = matchAVSXDEt.setScoresA;
                                var setB = matchAVSXDEt.setScoresB;
                                var playerAID = matchAVSXDEt.playerAID;
                                var playerBID = matchAVSXDEt.playerBID;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore", setA, setB, playerAID, playerBID, teamAID, teamBID)
                                try {
                                    if (res) {
                                        avsxFinalScore = res;
                                    }
                                }catch(e){
                                    console.log(e)
                                }
                            }
                        }

                        //bvsy
                        if (teamDETails.matchBVsY) {
                            var matchBVsYDEt = teamDETails.matchBVsY
                            if (matchBVsYDEt.setScoresA && matchBVsYDEt.setScoresB && matchBVsYDEt.playerAID && matchBVsYDEt.playerBID && teamDETails.teamAID && teamDETails.teamBID) {
                                var setA = matchBVsYDEt.setScoresA;
                                var setB = matchBVsYDEt.setScoresB;
                                var playerAID = matchBVsYDEt.playerAID;
                                var playerBID = matchBVsYDEt.playerBID;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore", setA, setB, playerAID, playerBID, teamAID, teamBID)
                                try {
                                    if (res) {
                                        bvsyFinalScore = res
                                    }
                                }catch(e){
                                    console.log(e)
                                }
                            }
                        }

                        //b vs x
                        if (teamDETails.matchBVsX) {
                            var matchBVsXDEt = teamDETails.matchBVsX
                            if (matchBVsXDEt.setScoresA && matchBVsXDEt.setScoresB && matchBVsXDEt.playerAID && matchBVsXDEt.playerBID && teamDETails.teamAID && teamDETails.teamBID) {
                                var setA = matchBVsXDEt.setScoresA;
                                var setB = matchBVsXDEt.setScoresB;
                                var playerAID = matchBVsXDEt.playerAID;
                                var playerBID = matchBVsXDEt.playerBID;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore", setA, setB, playerAID, playerBID, teamAID, teamBID)
                                try {
                                    if (res) {
                                        bvsxFinalScore = res;
                                    }
                                }catch(e){
                                     console.log(e)
                                }
                            }
                        }

                        //a vs y
                        if (teamDETails.matchAVsY) {
                            var matchAVsYDEt = teamDETails.matchAVsY
                            if (matchAVsYDEt.setScoresA && matchAVsYDEt.setScoresB && matchAVsYDEt.playerAID && matchAVsYDEt.playerBID && teamDETails.teamAID && teamDETails.teamBID) {
                                var setA = matchAVsYDEt.setScoresA;
                                var setB = matchAVsYDEt.setScoresB;
                                var playerAID = matchAVsYDEt.playerAID;
                                var playerBID = matchAVsYDEt.playerBID;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore", setA, setB, playerAID, playerBID, teamAID, teamBID)
                                try {
                                    if (res) {
                                        avsyFinalScore = res
                                    }
                                }catch(e){
                                     console.log(e)
                                }
                            }
                        }

                        //doubles
                        if (teamDETails.matchDoubles) {
                            var matchDoublesDEt = teamDETails.matchDoubles
                            if (matchDoublesDEt.setScoresA && matchDoublesDEt.setScoresB && teamDETails.teamAID && teamDETails.teamBID) {
                                var setA = matchDoublesDEt.setScoresA;
                                var setB = matchDoublesDEt.setScoresB;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore", setA, setB, "1", "1", teamAID, teamBID)
                                try {
                                    if (res) {
                                        doublesFinalScore = res
                                    }
                                }catch(e){
                                     console.log(e)
                                }
                            }
                        }

                        //avalue
                        if (avsxFinalScore && avsxFinalScore.AValue != undefined) {
                            avsxFinalScore.AValue = avsxFinalScore.AValue
                        } else {
                            avsxFinalScore.AValue = 0;
                        }

                        if (bvsyFinalScore && bvsyFinalScore.AValue != undefined) {
                            bvsyFinalScore.AValue = bvsyFinalScore.AValue
                        } else {
                            bvsyFinalScore.AValue = 0;
                        }

                        if (doublesFinalScore && doublesFinalScore.AValue != undefined) {
                            doublesFinalScore.AValue = doublesFinalScore.AValue
                        } else {
                            doublesFinalScore.AValue = 0;
                        }

                        if (bvsxFinalScore && bvsxFinalScore.AValue != undefined) {
                            bvsxFinalScore.AValue = bvsxFinalScore.AValue
                        } else {
                            bvsxFinalScore.AValue = 0;
                        }

                        if (avsyFinalScore && avsyFinalScore.AValue != undefined) {
                            avsyFinalScore.AValue = avsyFinalScore.AValue
                        } else {
                            avsyFinalScore.AValue = 0;
                        }

                        //bvalue
                        if (avsxFinalScore && avsxFinalScore.BValue != undefined) {
                            avsxFinalScore.BValue = avsxFinalScore.BValue
                        } else {
                            avsxFinalScore.BValue = 0;
                        }

                        if (bvsyFinalScore && bvsyFinalScore.BValue != undefined) {
                            bvsyFinalScore.BValue = bvsyFinalScore.BValue
                        } else {
                            bvsyFinalScore.BValue = 0;
                        }

                        if (doublesFinalScore && doublesFinalScore.BValue != undefined) {
                            doublesFinalScore.BValue = doublesFinalScore.BValue
                        } else {
                            doublesFinalScore.BValue = 0;
                        }

                        if (bvsxFinalScore && bvsxFinalScore.BValue != undefined) {
                            bvsxFinalScore.BValue = bvsxFinalScore.BValue
                        } else {
                            bvsxFinalScore.BValue = 0;
                        }

                        if (avsyFinalScore && avsyFinalScore.AValue != undefined) {
                            avsyFinalScore.AValue = avsyFinalScore.AValue
                        } else {
                            avsyFinalScore.AValue = 0;
                        }

                        var teamScoreSetA = [avsxFinalScore.AValue, bvsyFinalScore.AValue, doublesFinalScore.AValue, bvsxFinalScore.AValue, avsyFinalScore.AValue, 0, 0];
                        var teamScoreSetB = [avsxFinalScore.BValue, bvsyFinalScore.BValue, doublesFinalScore.BValue, bvsxFinalScore.BValue, avsyFinalScore.BValue, 0, 0];

                        var teamScoresSETS = {
                            teamScoreSetA: teamScoreSetA,
                            teamScoreSetB: teamScoreSetB
                        }
                        var r = teamDetailedScores.update({
                            tournamentId: xData.tournamentId,
                            eventName: xData.eventName,
                            teamDetScore: {
                                $elemMatch: {
                                    matchNumber: xData.teamDET.matchNumber,
                                    roundNumber: xData.teamDET.roundNumber
                                }
                            }
                        }, {
                            $set: {
                                "teamDetScore.$": xData.teamDET
                            }
                        });
                        return teamScoresSETS;
                    }
                } else return false
            } else return false
        } catch (e) {
             console.log(e)
        }
    }
});

Meteor.methods({
    "teamDrawsSpecIsSetOrNot": function(tournamentId, eventName, roundNumber, matchNumber) {
        try {
            var s = teamDrawsSpec.aggregate([{
                $match: {
                    "tournamentId": tournamentId,
                    "eventName": eventName
                }
            }, {
                $unwind: "$teamDet"
            }, {
                $match: {
                    "teamDet.matchNumber": matchNumber,
                    "teamDet.roundNumber": roundNumber
                }
            }, {
                $project: {
                    matchNumber: "$teamDet.matchNumber",
                }
            }]);
            if (s && s[0]) {
                return true
            } else return false
        } catch (e) {
             console.log(e)
        }
    }
});

Meteor.methods({
    "viewerOrOrganizer": function(tournamentId, userId) {
        try {

            var eveDet = events.findOne({
                "_id": tournamentId
            });
            if (eveDet == undefined) {
                eveDet = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            if (eveDet && eveDet.eventOrganizer) {

                if (eveDet.eventOrganizer == userId) {
                    return true
                } else return false
            } else return false
        } catch (e) {
             console.log(e)
        }
    }
})