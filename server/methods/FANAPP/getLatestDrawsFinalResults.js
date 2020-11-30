import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

//to get final results for given tournamentId
Meteor.methods({
    "parametervalidationsForDrawsResultsForTId": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": FINAL_RESULTS_FAILED_MSG
        }

        //xData.country = "India"
        //xData.stateId = "a3LkhsHt2rZGWp8wG"

        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
                var sDraws = new DrawsResults(xData)
                    //validations
                var nullTournamentId = sDraws.nullUndefinedEmpty("tournamentId")

                if (nullTournamentId == "1") {
                    if (true) {
                        if (true) {
                            if (true) {
                                if (true) {
                                    //find latest tournaments created by organizers (associationIdWRTStateId contains organizers)
                                    if (true) {
                                        //call get final results for this tournament
                                        if (true) {
                                            var finalData = []
                                            var getDetailsOfTournament = sDraws.checkValidTournamentID(xData.tournamentId)
                                            if (getDetailsOfTournament == "1") {

                                                var getDetailsOfTournaments = sDraws.checkValidTournamentID(xData.tournamentId, true)
                                                res.tournamentData = getDetailsOfTournaments
                                                var resultData1 = queryMatchColDBForFinalResults(xData.tournamentId, "final")
                                                var resultData2 = queryTeamMatchColDBForFinalResults(xData.tournamentId, "final")

                                                if (resultData1 && resultData1.length) {
                                                    finalData = _.union(finalData, resultData1)
                                                }
                                                if (resultData2 && resultData2.length) {
                                                    finalData = _.union(finalData, resultData2)
                                                }


                                                if (finalData && finalData.length) 
                                                {
                                                    finalData = _.uniq(finalData, function(x){
                                                        return x._id;
                                                    });
                                                    
                                                    var s = eventsmapOrder(finalData, [], 'eventName');
                                                    s = s.filter(function(element) {
                                                        return element !== undefined && element !== null;
                                                    });

                                                    if (s.length == 0) {
                                                        s = finalData
                                                    }

                                                    res.data = s
                                                    var sortEvents = categorySort(s,xData.tournamentId)
                                                    if(s.length == sortEvents.length)
                                                    {
                                                        res.data = sortEvents
                                                    }

                                                    res.status = SUCCESS_STATUS
                                                    res.message = FINAL_RESULTS_SUCCESS_MSG
                                                }
                                                else
                                                {
                                                    res.data = finalData;
                                                    res.status = FAIL_STATUS
                                                    res.message = "No draws yet, wait for updates"
                                                }
                                            } else {
                                                res.message = getDetailsOfTournament
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    res.message = nullTournamentId
                }


            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res

        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.message = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})



//to get final results
//check state id
//check event organizers list for that state from db stateAssociationsForState
//find the most recent tournament where draws are uploaded and 
//for the list of event orgnaizers from db stateAssociationsForState
//if any fetch final results for that tournament
Meteor.methods({
    "parametervalidationsForDrawsResults": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": VALID_FAIL_MSG + " or " + FINAL_RESULTS_FAILED_MSG
        }

        //xData.country = "India"
        //xData.stateId = "a3LkhsHt2rZGWp8wG"

        try {


            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
                var sDraws = new DrawsResults(xData)
                    //validations
                var nullCountry = sDraws.nullUndefinedEmpty("country")

                if (nullCountry == "1") {
                    var nullState = sDraws.nullUndefinedEmpty("stateId")
                    if (nullState == "1") {
                        var validCountry = sDraws.validateCountry()
                        if (validCountry == "1") {
                            var validState = sDraws.validateState()
                            if (validState == "1") {
                                var associationIdWRTStateId = sDraws.validateAssociationIdWRTStateId()
                                if (associationIdWRTStateId && typeof associationIdWRTStateId == "object") {
                                    //find latest tournaments created by organizers (associationIdWRTStateId contains organizers)
                                    xData.eve = associationIdWRTStateId
                                    var getLatestId = await Meteor.call("latestTournamentForGivenOrganizer", xData)
                                    if (getLatestId && getLatestId.status == SUCCESS_STATUS) {
                                        //call get final results for this tournament
                                        if (getLatestId.data && getLatestId.data.length &&
                                            getLatestId.data[0] && getLatestId.data[0].t) {
                                            var finalData = []
                                            var getDetailsOfTournament = sDraws.checkValidTournamentID(getLatestId.data[0].t)
                                            if (getDetailsOfTournament == "1") {
                                                var getDetailsOfTournaments = sDraws.checkValidTournamentID(getLatestId.data[0].t, true)
                                                var resultData1 = queryMatchColDBForFinalResults(getLatestId.data[0].t, "final")
                                                var resultData2 = queryTeamMatchColDBForFinalResults(getLatestId.data[0].t, "final")


                                                if (resultData1 && resultData1.length) {
                                                    finalData = _.union(finalData, resultData1)
                                                }
                                                if (resultData2 && resultData2.length) {
                                                    finalData = _.union(finalData, resultData2)
                                                }

                                                if (finalData && finalData.length) {
                                                    res.tournamentData = getDetailsOfTournaments

                                                    finalData = _.uniq(finalData, function(x){
                                                        return x._id;
                                                    });

                                                    res.data = finalData
                                                    var sortEvents = categorySort(finalData,getLatestId.data[0].t)
                                                    if(finalData.length == sortEvents.length)
                                                    {
                                                        res.data = sortEvents
                                                    }
                                                    res.status = SUCCESS_STATUS
                                                    res.message = FINAL_RESULTS_SUCCESS_MSG
                                                }
                                            } else {
                                                res.message = getDetailsOfTournament
                                            }
                                        }
                                    } else {
                                        res.message = FINAL_RESULTS_FAILED_MSG
                                    }
                                } else {
                                    res.message = associationIdWRTStateId
                                }
                            } else {
                                res.message = validState
                            }
                        } else {
                            res.message = validCountry
                        }
                    } else {
                        res.message = nullState
                    }
                } else {
                    res.message = nullCountry
                }


            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }

            return res

        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.message = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})


Meteor.methods({
    "latestTournamentForGivenOrganizer": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": FINAL_RESULTS_FAILED_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {


                //get recent team event tourn from events db 
                //get recent ind event tourn from events db
                //if both are empty
                //get recent team event tourn from past events db
                //get recent ind event tourn from past events db
                //check the recent tourn for team and ind
                //return that as recent tourn id

                var s1 = queryByDynamicDbNamesForLatestTournId("MatchCollectionDB", "events", xData.eve, xData.stateId)
                var individualId = ""
                var teamId = ""

                if (s1 && s1.length && s1[0] && s1[0].t) {
                    individualId = s1
                } else {
                    var s1 = queryByDynamicDbNamesForLatestTournId("MatchCollectionDB", "pastEvents", xData.eve, xData.stateId)
                    if (s1 && s1.length && s1[0] && s1[0].t) {
                        individualId = s1
                    }
                }

                var s2 = queryByDynamicDbNamesForLatestTournId("teamMatchCollectionDB", "events", xData.eve, xData.stateId)

                if (s2 && s2.length && s2[0] && s2[0].t) {
                    teamId = s2
                } else {
                    var s2 = queryByDynamicDbNamesForLatestTournId("teamMatchCollectionDB", "pastEvents", xData.eve, xData.stateId)
                    if (s2 && s2.length && s2[0] && s2[0].t) {
                        teamId = s2
                    }
                }


                //check if teamId and indId both 
                //check the latest tournament between teamId and indId dates .. return 
                //latest date ID

                //check if only teamId
                //return teamID

                //check if only indID
                //return indid

                if (individualId && individualId.length && individualId[0] &&
                    individualId[0].eventDate &&
                    teamId && teamId.length && teamId[0] &&
                    teamId[0].eventDate) {
                    var teamDate = moment(new Date(teamId[0].eventDate));
                    var indDate = moment(new Date(individualId[0].eventDate));

                    if (teamDate > indDate) {
                        res.data = teamId
                        res.typeOfTourn = "team"
                    } else if (teamDate < indDate) {
                        res.data = individualId
                        res.typeOfTourn = "individual"
                    } else {
                        res.data = individualId
                        res.typeOfTourn = "individual"
                    }
                    res.status = SUCCESS_STATUS
                    res.message = RECENT_TOURNAMENTID_SUCCESS_MSG

                } else if (individualId && individualId.length && individualId[0] &&
                    individualId[0].eventDate) {
                    res.data = individualId
                    res.status = SUCCESS_STATUS
                    res.message = RECENT_TOURNAMENTID_SUCCESS_MSG
                    res.typeOfTourn = "individual"
                } else if (teamId && teamId.length && teamId[0] &&
                    teamId[0].eventDate) {
                    res.data = teamId
                    res.status = SUCCESS_STATUS
                    res.message = RECENT_TOURNAMENTID_SUCCESS_MSG
                    res.typeOfTourn = "team"
                }

            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.message = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

var queryByDynamicDbNamesForLatestTournId = function(lookUPTable, collectionName, eve, state) {
    try {


        var res = global[collectionName].aggregate([{
            $match: {
                tournamentEvent: true,
                eventOrganizer: {
                    $in: eve
                },
                //domainId: state
            }
        }, {
            $sort: {
                eventEndDate1: -1
            }
        }, {
            $project: {
                tour: "$_id",
            }
        }, {
            $group: {
                _id: null,
                arr: {
                    $push: "$tour"
                }
            }
        }, {
            $unwind: "$arr"
        }, {
            $lookup: {
                from: lookUPTable,
                localField: "arr",
                foreignField: "tournamentId",
                as: "drawsdet"
            }
        }, {
            $unwind: {
                path: "$drawsdet",
                preserveNullAndEmptyArrays: false
            }
        }, {
            $project: {
                "t": "$drawsdet.tournamentId"
            }
        }, {
            $limit: 1
        }, {
            $lookup: {
                from: collectionName,
                localField: "t",
                foreignField: "_id",
                as: "tournDet"
            }
        }, {
            $unwind: "$tournDet"
        }, {
            $project: {
                "t": "$tournDet._id",
                "eventDate": "$tournDet.eventEndDate1",
            }
        }])
        if (res && res.length) {
            return res
        } else {
            return []
        }
    } catch (e) {
        res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}

export const queryMatchColDBForFinalResults = function(tournamentId, type, roundNumber, eventName) {
    try {

        var finalData = []

        var query = {}
        var query1 = {}

        if (type == "final") {
            query = {
                tournamentId: tournamentId
            }
            query1 = {
                "matchRecords.roundName": "F"
            }
        } else if (type == "all") {
            query = {
                eventName: eventName,
                tournamentId: tournamentId
            }
            query1 = {
                "matchRecords.roundNumber": parseInt(roundNumber)
            }
        }

        var eventList = MatchCollectionDB.aggregate([{
            $match: query
        }, {
            $unwind: {
                path: "$matchRecords",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $match: query1
        }, {
            $project: {
                "matchNumber": "$matchRecords.matchNumber",
                "roundNumber": "$matchRecords.roundNumber",
                "status": "$matchRecords.status",
                "roundName": "$matchRecords.roundName",
                "status2": "$matchRecords.status2",
                "propogatePlayerID": "$matchRecords.propogatePlayerID",
                "winnerID": "$matchRecords.winnerID",
                "playerAID": "$matchRecords.playersID.playerAId",
                "playerBID": "$matchRecords.playersID.playerBId",
                "nextMatchNumber": "$matchRecords.nextMatchNumber",
                "scoresA": "$matchRecords.scores.setScoresA",
                "scoresB": "$matchRecords.scores.setScoresB",
                "eventName": "$eventName"
            }
        }, {
            $lookup: {
                from: "users",
                localField: "playerAID",
                // name of users table field,
                foreignField: "userId",
                as: "usersDet" // alias for userinfo table
            }
        }, {
            $unwind: {
                path: "$usersDet",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $project: {
                "matchNumber": "$matchNumber",
                "roundNumber": "$roundNumber",
                "status": "$status",
                "roundName": "$roundName",
                "status2": "$status2",
                "propogatePlayerID": "$propogatePlayerID",
                "winnerID": "$winnerID",
                "playerAID": "$playerAID",
                "playerBID": "$playerBID",
                "nextMatchNumber": "$nextMatchNumber",
                "scoresA": "$scoresA",
                "scoresB": "$scoresB",
                "playerNameA": "$usersDet.userName",
                "eventName": "$eventName"
            }
        }, {
            $lookup: {
                from: "users",
                localField: "playerBID",
                // name of users table field,
                foreignField: "userId",
                as: "usersDet" // alias for userinfo table
            }
        }, {
            $unwind: {
                path: "$usersDet",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $project: {
                "matchNumber": "$matchNumber",
                "roundNumber": "$roundNumber",
                "status": "$status",
                "roundName": "$roundName",
                "status2": "$status2",
                "propogatePlayerID": "$propogatePlayerID",
                "winnerID": "$winnerID",
                "playerAID": "$playerAID",
                "playerBID": "$playerBID",
                "nextMatchNumber": "$nextMatchNumber",
                "scoresA": "$scoresA",
                "scoresB": "$scoresB",
                "playerNameA": "$playerNameA",
                "playerNameB": "$usersDet.userName",
                "eventName": "$eventName"
            }
        }, {
            $addFields: {
                "projectType": 1,
                "tournamentId": tournamentId
            }
        }])
        if (eventList && eventList.length) {
            return eventList
        } else {
            return []
        }
    } catch (e) {
        res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}

export const queryTeamMatchColDBForFinalResults = function(tournamentId, type, roundNumber, eventName) {
    try {

        var subRest = subscriptionRestrictions.findOne({
            tournamentId: tournamentId
        })

        var lookUPTable = ""
        if (subRest && subRest.selectionType &&
            subRest.selectionType.toLowerCase() == "schoolonly") {
            lookUPTable = "schoolTeams"
        } else {
            lookUPTable = "playerTeams"
        }

        var query = {}
        var query1 = {}

        if (type == "final") {
            query = {
                tournamentId: tournamentId
            }
            query1 = {
                "matchRecords.roundName": "F"
            }
        } else if (type == "all") {
            query = {
                eventName: eventName,
                tournamentId: tournamentId
            }
            query1 = {
                "matchRecords.roundNumber": parseInt(roundNumber)
            }
        }

        var eventList = [];
        if (lookUPTable == "schoolTeams") {
            var start = new Date().getTime();
            eventList = teamMatchCollectionDB.aggregate([{
                    $match: query
                }, {
                    $unwind: {
                        path: "$matchRecords",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $match: query1
                }, {
                    $project: {
                        "matchNumber": "$matchRecords.matchNumber",
                        "roundNumber": "$matchRecords.roundNumber",
                        "status": "$matchRecords.status",
                        "roundName": "$matchRecords.roundName",
                        "status2": "$matchRecords.status2",
                        "propogatePlayerID": "$matchRecords.propogatePlayerID",
                        "winnerID": "$matchRecords.winnerID",
                        "playerAID": "$matchRecords.teamsID.teamAId",
                        "playerBID": "$matchRecords.teamsID.teamBId",
                        "nextMatchNumber": "$matchRecords.nextMatchNumber",
                        "scoresA": "$matchRecords.scores.setScoresA",
                        "scoresB": "$matchRecords.scores.setScoresB",
                        "eventName": "$eventName"
                    }
                }, {
                    $lookup: {
                        from: lookUPTable,
                        localField: "playerAID",
                        // name of users table field,
                        foreignField: "_id",
                        as: "usersDet" // alias for userinfo table
                    }
                }, {
                    $unwind: {
                        path: "$usersDet",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        "matchNumber": "$matchNumber",
                        "roundNumber": "$roundNumber",
                        "status": "$status",
                        "roundName": "$roundName",
                        "status2": "$status2",
                        "propogatePlayerID": "$propogatePlayerID",
                        "winnerID": "$winnerID",
                        "playerAID": "$playerAID",
                        "playerBID": "$playerBID",
                        "nextMatchNumber": "$nextMatchNumber",
                        "scoresA": "$scoresA",
                        "scoresB": "$scoresB",
                        "playerNameA": "$usersDet.teamName",
                        "teamManagerA": "$usersDet.teamManager",
                        "eventName": "$eventName"
                    }
                }, {
                    $lookup: {
                        from: lookUPTable,
                        localField: "playerBID",
                        // name of users table field,
                        foreignField: "_id",
                        as: "usersDet" // alias for userinfo table
                    }
                }, {
                    $unwind: {
                        path: "$usersDet",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        "matchNumber": "$matchNumber",
                        "roundNumber": "$roundNumber",
                        "status": "$status",
                        "roundName": "$roundName",
                        "status2": "$status2",
                        "propogatePlayerID": "$propogatePlayerID",
                        "winnerID": "$winnerID",
                        "playerAID": "$playerAID",
                        "playerBID": "$playerBID",
                        "nextMatchNumber": "$nextMatchNumber",
                        "scoresA": "$scoresA",
                        "scoresB": "$scoresB",
                        "playerNameA": "$playerNameA",
                        "teamManagerA": "$teamManagerA",
                        "playerNameB": "$usersDet.teamName",
                        "teamManagerB": "$usersDet.teamManager",
                        "eventName": "$eventName"
                    }
                }, {
                    $lookup: {
                        from: "schoolPlayers",
                        localField: "teamManagerA",
                        foreignField: "userId",
                        as: "teamManagerADetails" // alias for userinfo table
                    }
                }, {
                    $unwind: {
                        path: "$teamManagerADetails",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "schoolPlayers",
                        localField: "teamManagerB",
                        foreignField: "userId",
                        as: "teamManagerBDetails" // alias for userinfo table
                    }
                }, {
                    $unwind: {
                        path: "$teamManagerBDetails",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        "matchNumber": "$matchNumber",
                        "roundNumber": "$roundNumber",
                        "status": "$status",
                        "roundName": "$roundName",
                        "status2": "$status2",
                        "propogatePlayerID": "$propogatePlayerID",
                        "winnerID": "$winnerID",
                        "playerAID": "$playerAID",
                        "playerBID": "$playerBID",
                        "nextMatchNumber": "$nextMatchNumber",
                        "scoresA": "$scoresA",
                        "scoresB": "$scoresB",
                        "playerNameA": "$playerNameA",
                        "teamManagerA": "$teamManagerA",
                        "playerNameB": "$playerNameB",
                        "teamManagerB": "$teamManagerB",
                        "eventName": "$eventName",
                        "stateAID": "$teamManagerADetails.state",
                        "stateBID": "$teamManagerBDetails.state",
                    }
                }, {
                    $lookup: {
                        from: "domains",
                        localField: "stateAID",
                        foreignField: "_id",
                        as: "playerADomainDetails" // alias for userinfo table
                    }
                }, {
                    $unwind: {
                        path: "$playerADomainDetails",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "domains",
                        localField: "stateBID",
                        foreignField: "_id",
                        as: "playerBDomainDetails" // alias for userinfo table
                    }
                }, {
                    $unwind: {
                        path: "$playerBDomainDetails",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        "matchNumber": "$matchNumber",
                        "roundNumber": "$roundNumber",
                        "status": "$status",
                        "roundName": "$roundName",
                        "status2": "$status2",
                        "propogatePlayerID": "$propogatePlayerID",
                        "winnerID": "$winnerID",
                        "playerAID": "$playerAID",
                        "playerBID": "$playerBID",
                        "nextMatchNumber": "$nextMatchNumber",
                        "scoresA": "$scoresA",
                        "scoresB": "$scoresB",
                        //"playerNameA":"$playerNameA",
                        "playerNameA": {
                            $concat: ["$playerNameA", " , ", "$playerADomainDetails.domainName"]
                        },
                        //"playerNameB":"$playerNameB",
                        "playerNameB": {
                            $concat: ["$playerNameB", " , ", "$playerBDomainDetails.domainName"]
                        },
                        "eventName": "$eventName",
                        "stateAID": "$stateAID",
                        "stateBID": "$stateBID",
                    }
                },



                {
                    $addFields: {
                        "projectType": 2,
                        "tournamentId": tournamentId
                    }
                }
            ])



        } else {
            
            eventList = teamMatchCollectionDB.aggregate([{
                $match: query
            }, {
                $unwind: {
                    path: "$matchRecords",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $match: query1
            }, {
                $project: {
                    "matchNumber": "$matchRecords.matchNumber",
                    "roundNumber": "$matchRecords.roundNumber",
                    "status": "$matchRecords.status",
                    "roundName": "$matchRecords.roundName",
                    "status2": "$matchRecords.status2",
                    "propogatePlayerID": "$matchRecords.propogatePlayerID",
                    "winnerID": "$matchRecords.winnerID",
                    "playerAID": "$matchRecords.teamsID.teamAId",
                    "playerBID": "$matchRecords.teamsID.teamBId",
                    "nextMatchNumber": "$matchRecords.nextMatchNumber",
                    "scoresA": "$matchRecords.scores.setScoresA",
                    "scoresB": "$matchRecords.scores.setScoresB",
                    "eventName": "$eventName"
                }
            }, {
                $lookup: {
                    from: lookUPTable,
                    localField: "playerAID",
                    // name of users table field,
                    foreignField: "_id",
                    as: "usersDet" // alias for userinfo table
                }
            }, {
                $unwind: {
                    path: "$usersDet",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    "matchNumber": "$matchNumber",
                    "roundNumber": "$roundNumber",
                    "status": "$status",
                    "roundName": "$roundName",
                    "status2": "$status2",
                    "propogatePlayerID": "$propogatePlayerID",
                    "winnerID": "$winnerID",
                    "playerAID": "$playerAID",
                    "playerBID": "$playerBID",
                    "nextMatchNumber": "$nextMatchNumber",
                    "scoresA": "$scoresA",
                    "scoresB": "$scoresB",
                    "playerNameA": "$usersDet.teamName",
                    "eventName": "$eventName"
                }
            }, {
                $lookup: {
                    from: lookUPTable,
                    localField: "playerBID",
                    // name of users table field,
                    foreignField: "_id",
                    as: "usersDet" // alias for userinfo table
                }
            }, {
                $unwind: {
                    path: "$usersDet",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    "matchNumber": "$matchNumber",
                    "roundNumber": "$roundNumber",
                    "status": "$status",
                    "roundName": "$roundName",
                    "status2": "$status2",
                    "propogatePlayerID": "$propogatePlayerID",
                    "winnerID": "$winnerID",
                    "playerAID": "$playerAID",
                    "playerBID": "$playerBID",
                    "nextMatchNumber": "$nextMatchNumber",
                    "scoresA": "$scoresA",
                    "scoresB": "$scoresB",
                    "playerNameA": "$playerNameA",
                    "playerNameB": "$usersDet.teamName",
                    "eventName": "$eventName"
                }
            }, {
                $addFields: {
                    "projectType": 2,
                    "tournamentId": tournamentId
                }
            }])

        }

        if (eventList && eventList.length) {
            return eventList
        } else {
            return []
        }
    } catch (e) {
        res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}