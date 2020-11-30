Meteor.methods({
    'saveRRTeamSpecification': function(tournamentId, eventName, data,inverseData) {
        try {
            var eveDet = events.findOne({
                "_id":tournamentId
            }); 
            if(eveDet==undefined){
                eveDet = pastEvents.findOne({
                    "_id":tournamentId
                })
            }
            if(eveDet&&eveDet.eventOrganizer){
                if(eveDet.eventOrganizer==this.userId){
                    var k = teamRRSpecification.findOne({
                        tournamentId: tournamentId,
                        eventName: eventName
                    })
                    if (k == undefined) {
                        var s = teamRRSpecification.insert({
                            tournamentId: tournamentId,
                            eventName: eventName,
                            teamDetails: [data]
                        })
                        if (s) {

                            //insert inverse team specification
                            var inverseInset = teamRRSpecification.update({
                                tournamentId: tournamentId,
                                eventName: eventName
                            }, {
                                $addToSet: {
                                    "teamDetails": inverseData
                                }
                            })
                            if(inverseInset)
                            {
                                //insert into detail scrore
                                Meteor.call("insertTeamDetailScore", tournamentId, eventName, data,inverseData, function(e, res) {

                                })
                            }
                            
                        }
                    } else {
                        var k = teamRRSpecification.find({
                            tournamentId: tournamentId,
                            eventName: eventName,
                            teamDetails: {
                                $elemMatch: {
                                    teamAID: data.teamAID,
                                    teamBID: data.teamBID
                                }
                            }
                        });
                        if (k.fetch().length == 0) 
                        {
                            var r = teamRRSpecification.update({
                                tournamentId: tournamentId,
                                eventName: eventName
                            }, {
                                $addToSet: {
                                    "teamDetails": data
                                }
                            })
                            if (r) {

                                //insert inverse team specification
                                var inverseInset = teamRRSpecification.update({
                                    tournamentId: tournamentId,
                                    eventName: eventName
                                }, {
                                    $addToSet: {
                                        "teamDetails": inverseData
                                    }
                                })

                                if(inverseInset)
                                {
                                    Meteor.call("updateTeamSpecificationDetailScores", tournamentId, eventName, data, inverseData,function(e, res) {

                                    })
                                }

                                //update team details score
                                //Meteor.call("updateIfRoundMatchExistsIntoTeamDetails", tournamentId, eventName, data, function(e, res) {

                                //})
                            }
                        } else {
                            var r = teamRRSpecification.update({
                                tournamentId: tournamentId,
                                eventName: eventName,
                                teamDetails: {
                                    $elemMatch: {
                                        teamAID: data.teamAID,
                                        teamBID: data.teamBID
                                    }
                                }
                            }, {
                                $set: {
                                    "teamDetails.$": data
                                }
                            });

                            if (r) {
                                var inverseUpdate = teamRRSpecification.update({
                                    tournamentId: tournamentId,
                                    eventName: eventName,
                                    teamDetails: {
                                        $elemMatch: {
                                            teamAID: data.teamBID,
                                            teamBID: data.teamAID
                                        }
                                    }
                                }, {
                                    $set: {
                                        "teamDetails.$": inverseData
                                    }
                                });
                                if(inverseUpdate)
                                {
                                    Meteor.call("updateTeamSpecificationDetailScores", tournamentId, eventName, data,inverseData, function(e, res) {

                                    })
                                }
                                

                                //update team details score
                                //Meteor.call("updateIfRoundMatchExistsIntoTeamDetails", tournamentId, eventName, data, function(e, res) {

                                //})
                            }
                        }
                    }
                } else return false
            } else return false;
        } catch (e) {
        }
    },
    "checkTeamSpecification":function(tournamentId,eventName,teamAId,teamBId){
        try{
            var k = teamRRSpecification.findOne({
                tournamentId: tournamentId,
                eventName: eventName,
                teamDetails: {
                    $elemMatch: {
                        teamAID: teamAId,
                        teamBID: teamBId
                    }
                }
            });
            if(k)
            {
                return true;
            }
            else
            {
                var m = teamRRSpecification.findOne({
                    tournamentId: tournamentId,
                    eventName: eventName,
                    teamDetails: {
                        $elemMatch: {
                            teamAID: teamBId,
                            teamBID: teamAId
                        }
                    }
                });
                if(m)
                    return true;
                else 
                    return false;
            }

        }catch(e){
        }
    },

    'getTeamSpecification': function(tournamentId, eventName, teamAId, teamBId) {
        try{
             var k = teamRRSpecification.findOne({
                tournamentId: tournamentId,
                eventName: eventName,
                teamDetails: {
                    $elemMatch: {
                        teamAID: teamAId,
                        teamBID: teamBId
                    }
                }
            });
            if(k)
            {
                var s = teamRRSpecification.aggregate([{
                    $match: {
                        "tournamentId": tournamentId,
                        "eventName": eventName
                    }
                    }, {
                        $unwind: "$teamDetails"
                    }, {
                        $match: {
                            "teamDetails.teamAID": teamAId,
                            "teamDetails.teamBID": teamBId
                        }
                    }, {
                    $project: {
                        teamAID: "$teamDetails.teamAID",
                        teamBID: "$teamDetails.teamBID",
                        teamAPlayerAId: "$teamDetails.teamAPlayerAId",
                        teamAPlayerBId: "$teamDetails.teamAPlayerBId",
                        teamBPlayerAId: "$teamDetails.teamBPlayerAId",
                        teamBPlayerBId: "$teamDetails.teamBPlayerBId",
                        teamADoubles1PlayerId: "$teamDetails.teamADoubles1PlayerId",
                        teamADoubles2PlayerId: "$teamDetails.teamADoubles2PlayerId",
                        teamBDoubles1PlayerId: "$teamDetails.teamBDoubles1PlayerId",
                        teamBDoubles2PlayerId: "$teamDetails.teamBDoubles2PlayerId",
                    }
                }])
                

                if (s && s[0]){
                    return s[0]
                }
                    

            }
            else
            {
                var m = teamRRSpecification.findOne({
                    tournamentId: tournamentId,
                    eventName: eventName,
                    teamDetails: {
                        $elemMatch: {
                            teamAID: teamBId,
                            teamBID: teamAId
                        }
                    }
                });
                if(m)
                {
                    var s = teamRRSpecification.aggregate([{
                        $match: {
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        }
                        }, {
                            $unwind: "$teamDetails"
                        }, {
                            $match: {
                                "teamDetails.teamAID": teamBId,
                                "teamDetails.teamBID": teamAId
                            }
                        }, {
                        $project: {
                            teamAID: "$teamDetails.teamAID",
                            teamBID: "$teamDetails.teamBID",
                            teamAPlayerAId: "$teamDetails.teamAPlayerAId",
                            teamAPlayerBId: "$teamDetails.teamAPlayerBId",
                            teamBPlayerAId: "$teamDetails.teamBPlayerAId",
                            teamBPlayerBId: "$teamDetails.teamBPlayerBId",
                            teamADoubles1PlayerId: "$teamDetails.teamADoubles1PlayerId",
                            teamADoubles2PlayerId: "$teamDetails.teamADoubles2PlayerId",
                            teamBDoubles1PlayerId: "$teamDetails.teamBDoubles1PlayerId",
                            teamBDoubles2PlayerId: "$teamDetails.teamBDoubles2PlayerId",
                        }
                    }])
                    if (s && s[0]){
                        return s[0]
                    }
                }
            }

        }catch(e){
        }
    },

    'updateTeamSpecificationDetailScores': function(tournamentId, eventName, data,inverseData) {
        try {
            var eveDet = events.findOne({
                "_id":tournamentId
            }); 
            if(eveDet==undefined){
                eveDet = pastEvents.findOne({
                    "_id":tournamentId
                })
            }
            if(eveDet&&eveDet.eventOrganizer){
                if(eveDet.eventOrganizer==this.userId){
                    var findDEtScore = teamRRDetailScore.aggregate([{
                        $match: {
                            tournamentId: tournamentId,
                            eventName: eventName
                        }
                    }, {
                        $unwind: "$teamDetailScore"
                    }, {
                        $match: {
                            "teamDetailScore.teamAID": data.teamAID,
                            "teamDetailScore.teamBID": data.teamBID
                        }
                    }, {
                        $project: {
                            teamDetailScore: "$teamDetailScore"
                        }
                    }])

                    var teamDetScore = {};
                    var inverse_teamDetScore = {};

                    var matchAVSXFind = {};
                    var matchBVsYFind = {};
                    var matchBVsXFind = {};
                    var matchAVsYFind = {};
                    var matchDoublesFind = {};

                    var matchBVsX = {};
                    var inverse_matchBVsX = {};


                    var matchAVSX = {};
                    var inverse_matchAVSX = {};


                    var matchBVsY = {};
                    var inverse_matchBVsY = {};

                    

                    var matchAVsY = {};
                    var inverse_matchAVsY = {};


                    var matchDoubles = {};
                    var inverse_matchDoubles = {};


                    if (findDEtScore && findDEtScore[0] && findDEtScore[0].teamDetailScore) 
                    {
                        var teamDetScoreFind = findDEtScore[0].teamDetailScore;
                        if(teamDetScoreFind.finalTeamWinner==undefined){
                            teamDetScoreFind.finalTeamWinner = "1";
                        }
                        if(teamDetScoreFind.teamMatchType==undefined){
                            teamDetScoreFind.teamMatchType = "1";
                        }

                        if (teamDetScoreFind) 
                        {
                            teamDetScore = {
                                teamAID: data.teamAID,
                                teamBID: data.teamBID,
                                finalTeamWinner:teamDetScoreFind.finalTeamWinner,
                                teamMatchType:teamDetScoreFind.teamMatchType
                            }

                            inverse_teamDetScore  = {
                                teamAID: data.teamBID,
                                teamBID: data.teamAID,
                                finalTeamWinner:teamDetScoreFind.finalTeamWinner,
                                teamMatchType:teamDetScoreFind.teamMatchType
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

                            /*inverse_matchAVSX = {
                                playerAID: data.teamBPlayerAId,
                                playerBID: data.teamAPlayerAId,
                                setScoresA: matchAVSXFind.setScoresB,
                                setScoresB: matchAVSXFind.setScoresA,
                                winnerIdPlayer: matchAVSXFind.winnerIdPlayer,
                                matchType: matchAVSXFind.matchType,
                                winnerIdTeam: matchAVSXFind.winnerIdTeam,
                            }*/

                             inverse_matchAVSX = {
                                playerAID: inverseData.teamAPlayerAId,
                                playerBID: inverseData.teamBPlayerAId,
                                setScoresA: matchAVSXFind.setScoresB,
                                setScoresB: matchAVSXFind.setScoresA,
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

                            /*inverse_matchBVsY = {
                                playerAID: data.teamBPlayerBId,
                                playerBID: data.teamAPlayerBId,
                                setScoresA: matchBVsYFind.setScoresB,
                                setScoresB: matchBVsYFind.setScoresA,
                                winnerIdPlayer: matchBVsYFind.winnerIdPlayer,
                                matchType: matchBVsYFind.matchType,
                                winnerIdTeam: matchBVsYFind.winnerIdTeam,
                            }*/

                            inverse_matchBVsY = {
                                playerAID: inverseData.teamAPlayerBId,
                                playerBID: inverseData.teamBPlayerBId,
                                setScoresA: matchBVsYFind.setScoresB,
                                setScoresB: matchBVsYFind.setScoresA,
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

                            /*inverse_matchBVsX = {
                                playerAID: data.teamBPlayerAId,
                                playerBID: data.teamAPlayerBId,
                                setScoresA: matchBVsXFind.setScoresB,
                                setScoresB: matchBVsXFind.setScoresA,
                                winnerIdPlayer: matchBVsXFind.winnerIdPlayer,
                                matchType: matchBVsXFind.matchType,
                                winnerIdTeam: matchBVsXFind.winnerIdTeam,
                            }*/

                            inverse_matchBVsX = {
                                playerAID: inverseData.teamAPlayerBId,
                                playerBID: inverseData.teamBPlayerAId,
                                setScoresA: matchBVsXFind.setScoresB,
                                setScoresB: matchBVsXFind.setScoresA,
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

                            /*inverse_matchAVsY = {
                                playerAID: data.teamBPlayerBId,
                                playerBID: data.teamAPlayerAId,
                                setScoresA: matchAVsYFind.setScoresB,
                                setScoresB: matchAVsYFind.setScoresA,
                                winnerIdPlayer: matchAVsYFind.winnerIdPlayer,
                                matchType: matchAVsYFind.matchType,
                                winnerIdTeam: matchAVsYFind.winnerIdTeam,
                            }*/

                            inverse_matchAVsY = {
                                playerAID: inverseData.teamAPlayerAId,
                                playerBID: inverseData.teamBPlayerBId,
                                setScoresA: matchAVsYFind.setScoresB,
                                setScoresB: matchAVsYFind.setScoresA,
                                winnerIdPlayer: matchAVsYFind.winnerIdPlayer,
                                matchType: matchAVsYFind.matchType,
                                winnerIdTeam: matchAVsYFind.winnerIdTeam,
                            }


                        }

                        if (teamDetScoreFind && teamDetScoreFind.matchDoubles) 
                        {
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

                            /*inverse_matchDoubles = {
                                teamAD1PlayerId: data.teamBDoubles1PlayerId,
                                teamAD2PlayerId: data.teamBDoubles2PlayerId,
                                teamBD1PlayerId: data.teamADoubles1PlayerId,
                                teamBD2PlayerId: data.teamADoubles2PlayerId,
                                matchType: matchDoublesFind.matchType,
                                winnerIdTeam: matchDoublesFind.winnerIdTeam,
                                winnerD1PlayerId: matchDoublesFind.winnerD1PlayerId,
                                winnerD2PlayerId: matchDoublesFind.winnerD2PlayerId,
                                setScoresA: matchDoublesFind.setScoresB,
                                setScoresB: matchDoublesFind.setScoresA
                            }*/
                            inverse_matchDoubles = {
                                teamAD1PlayerId: inverseData.teamADoubles1PlayerId,
                                teamAD2PlayerId: inverseData.teamADoubles2PlayerId,
                                teamBD1PlayerId: inverseData.teamBDoubles1PlayerId,
                                teamBD2PlayerId: inverseData.teamBDoubles2PlayerId,
                                matchType: matchDoublesFind.matchType,
                                winnerIdTeam: matchDoublesFind.winnerIdTeam,
                                winnerD1PlayerId: matchDoublesFind.winnerD1PlayerId,
                                winnerD2PlayerId: matchDoublesFind.winnerD2PlayerId,
                                setScoresA: matchDoublesFind.setScoresB,
                                setScoresB: matchDoublesFind.setScoresA
                            }

                        }
                        if (teamDetScoreFind) 
                        {
                            teamDetScore.matchAVSX = matchAVSX;
                            teamDetScore.matchBVsY = matchBVsY;
                            teamDetScore.matchBVsX = matchBVsX;
                            teamDetScore.matchAVsY = matchAVsY;
                            teamDetScore.matchDoubles = matchDoubles;


                            inverse_teamDetScore.matchAVSX = inverse_matchAVSX;
                            inverse_teamDetScore.matchBVsY = inverse_matchBVsY;
                            inverse_teamDetScore.matchBVsX = inverse_matchBVsX;
                            inverse_teamDetScore.matchAVsY = inverse_matchAVsY;
                            inverse_teamDetScore.matchDoubles = inverse_matchDoubles;



                            var transc = teamRRDetailScore.update({
                                tournamentId: tournamentId,
                                eventName: eventName,
                                teamDetailScore: {
                                    $elemMatch: {
                                        teamAID: data.teamAID,
                                        teamBID: data.teamBID
                                    }
                                }
                            }, {
                                $set: {
                                    "teamDetailScore.$": teamDetScore
                                }
                            });

                            var inverse_transc = teamRRDetailScore.update({
                                tournamentId: tournamentId,
                                eventName: eventName,
                                teamDetailScore: {
                                    $elemMatch: {
                                        teamAID: data.teamBID,
                                        teamBID: data.teamAID
                                    }
                                }
                            }, {
                                $set: {
                                    "teamDetailScore.$": inverse_teamDetScore
                                }
                            });


                        }
                    }
                    //if match num and round number is not there in teamdetails 
                    else{

                        Meteor.call('updateNewTeamDetailScore',tournamentId, eventName, data,inverseData)

                    } 
                }else return false
            }else return false
        } catch (e) {


        }
    }
});