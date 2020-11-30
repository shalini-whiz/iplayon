import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';
import {
    queryMatchColDBForFinalResults,
    queryTeamMatchColDBForFinalResults
}
from './getLatestDrawsFinalResults.js'

Meteor.methods({
    "getEntriesForGivenStateIdAndAbbName": function(xData) {

        var res = {
            "status": "failure",
            "data": 0,
            "message": "entries could not be fetched"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData && xData.apiUserId) {

                var apiUSerCheck = apiUsers.findOne({
                    "userId": xData.apiUserId
                })

                if (apiUSerCheck) {

                    if (xData.stateId) {

                        var stateCheck = domains.findOne({
                            "_id": xData.stateId
                        })
                        if (stateCheck) {



                            var query = {}
                            var query2 = {}
                            var message = ""
                            var db = "events"

                            if (xData.abbName) {
                                query = {
                                    "eventOrganizer": xData.apiUserId,
                                    "domainId": xData.stateId,
                                    "abbName": xData.abbName
                                }
                                var det = events.findOne(query)

                                if (det == undefined || det == null) {
                                    det = pastEvents.findOne(query)
                                    db = "pastEvents"
                                }
                                if (det && det.projectType == 2) {
                                    if (det.eventParticipants) {
                                        var playerDet = global[db].aggregate([{
                                            $match: query
                                        }, {
                                            $unwind: {
                                                path: "$eventParticipants",
                                                preserveNullAndEmptyArrays: true
                                            }
                                        }, {
                                            $lookup: {
                                                from: "schoolTeams",
                                                localField: "eventParticipants",
                                                // name of users table field,
                                                foreignField: "teamManager",
                                                as: "pointsDet" // alias for userinfo table
                                            }
                                        }, {
                                            $unwind: {
                                                path: "$pointsDet",
                                            }
                                        }, {
                                            $unwind: {
                                                path: "$pointsDet.teamMembers",
                                            }
                                        }, {
                                            $match: {
                                                "pointsDet.teamMembers.teamEvent": true,
                                            }
                                        }, {
                                            $lookup: {
                                                from: "schoolPlayers",
                                                localField: "pointsDet.teamMembers.playerId",
                                                // name of users table field,
                                                foreignField: "userId",
                                                as: "usersDet" // alias for userinfo table

                                            }
                                        }, {
                                            $unwind: {
                                                path: "$usersDet",
                                            }
                                        }, {
                                            $lookup: {
                                                from: "schoolDetails",
                                                localField: "usersDet.schoolId",
                                                // name of users table field,
                                                foreignField: "userId",
                                                as: "schoolDet" // alias for userinfo table

                                            }
                                        }, {
                                            $unwind: {
                                                path: "$schoolDet",
                                            }
                                        }, {
                                            $project: {
                                                "eventName": 1,
                                                "eventStartDate": 1,
                                                "eventEndDate": 1,
                                                "domainName": 1,
                                                "schoolName": "$schoolDet.schoolName",
                                                "schoolPhone": "$schoolDet.phoneNumber",
                                                "schoolEmail": "$schoolDet.emailAddress",
                                                "schoolContactPerson": "$schoolDet.contactPerson",
                                                "schoolAddress": "$schoolDet.address",
                                                "schoolCity": "$schoolDet.city",
                                                "schoolPinCode": "$schoolDet.pinCode",
                                                "schoolAbbrevation": "$schoolDet.abbrevation",
                                                "schoolRegYear": "$schoolDet.year",
                                                "playerYear": "$usersDet.year",
                                                "playerUserName": "$usersDet.userName",
                                                "playerDateOfBirth": "$usersDet.dateOfBirth",
                                                "playerGender": "$usersDet.gender",
                                                "playerGuardianName": "$usersDet.guardianName",
                                                "playerClass": "$usersDet.class",
                                                "coachDet": "$schoolDet.coachId"
                                            }
                                        }])
                                        if (playerDet) {
                                            res.status = "success"
                                            res.message = "Player Entries"
                                            res.data = playerDet
                                        } else {
                                            res.status = "success"
                                            res.message = "no entries for this tournament"
                                            res.data = "empty"
                                        }
                                    } else {
                                        res.status = "success"
                                        res.data = "empty"
                                        res.message = "no entry details for this tournament"
                                    }
                                } else if (det && det.projectType == 1) {
                                    if (det.eventParticipants) {
                                        var playerDet = global[db].aggregate([{
                                            "$match": query
                                        }, {
                                            "$unwind": {
                                                path: "$eventParticipants",
                                            }
                                        }, {
                                            "$lookup": {
                                                from: "schoolPlayers",
                                                localField: "eventParticipants",
                                                // name of users table field,
                                                foreignField: "userId",
                                                as: "usersDet" // alias for userinfo table

                                            }
                                        }, {
                                            $unwind: {
                                                path: "$usersDet",
                                            }
                                        }, {
                                            $lookup: {
                                                from: "schoolDetails",
                                                localField: "usersDet.schoolId",
                                                // name of users table field,
                                                foreignField: "userId",
                                                as: "schoolDet" // alias for userinfo table

                                            }
                                        }, {
                                            $unwind: {
                                                path: "$schoolDet",
                                            }
                                        }, {
                                            $project: {
                                                "eventName": 1,
                                                "eventStartDate": 1,
                                                "eventEndDate": 1,
                                                "domainName": 1,
                                                "schoolName": "$schoolDet.schoolName",
                                                "schoolPhone": "$schoolDet.phoneNumber",
                                                "schoolEmail": "$schoolDet.emailAddress",
                                                "schoolContactPerson": "$schoolDet.contactPerson",
                                                "schoolAddress": "$schoolDet.address",
                                                "schoolCity": "$schoolDet.city",
                                                "schoolPinCode": "$schoolDet.pinCode",
                                                "schoolAbbrevation": "$schoolDet.abbrevation",
                                                "schoolRegYear": "$schoolDet.year",
                                                "playerUserName": "$usersDet.userName",
                                                "playerDateOfBirth": "$usersDet.dateOfBirth",
                                                "playerGender": "$usersDet.gender",
                                                "playerGuardianName": "$usersDet.guardianName",
                                                "playerYear": "$usersDet.year",
                                                "playerClass": "$usersDet.class",
                                                "coachDet": "$schoolDet.coachId"
                                            }
                                        }]);

                                        if (playerDet) {
                                            res.status = "success"
                                            res.message = "Player Entries for individual"
                                            res.data = playerDet
                                        } else {
                                            res.status = "success"
                                            res.message = "no entries for this tournament"
                                            res.data = "empty"
                                        }
                                    }
                                } else {
                                    res.message = "no tournaments from this organizer for this state"
                                }
                            } else {
                                res.message = "abbName is Invalid"
                            }
                        } else {
                            res.message = "stateId is Invalid"
                        }
                    } else {
                        res.message = "stateId is required"
                    }
                } else {
                    res.message = "apiUserId is Invalid"
                }
            } else {
                res.message = "apiUserId is required"
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "getEventsNameBasedOnStateAndUser": function(xData) {
        var res = {
            "status": "failure",
            "data": 0,
            "message": "events could not be fetched"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData && xData.apiUserId) {

                var apiUSerCheck = apiUsers.findOne({
                    "userId": xData.apiUserId
                })

                if (apiUSerCheck) {

                    if (xData.stateId) {

                        var stateCheck = domains.findOne({
                            "_id": xData.stateId
                        })
                        if (stateCheck) {



                            var query = {}
                            var query2 = {}
                            var message = ""
                            var db = "events"
                            var year = new Date().getFullYear()
                            var nextYear = parseInt(year + 1)
                            var date1 = new Date(year + "-01-01")
                            var date2 = new Date(nextYear + "-01-01")
                           

                            if (true) {
                                query = {
                                    "eventOrganizer": xData.apiUserId,
                                    "domainId": xData.stateId,
                                    "tournamentEvent": false,
                                    /*"eventEndDate1": {
                                        $gte: date1,
                                        $lt: date2,
                                    }*/
                                }

                                var det = events.find(query).fetch()

                                if (det && det.length != 0) {
                                    db = "events"
                                } else {
                                    det = pastEvents.find(query).fetch()
                                    if (det && det.length != 0) {
                                        db = "pastEvents"
                                    }
                                }
                                if (det && det.length) {
                                    var eventList = global[db].aggregate([{
                                        $match: query
                                    }, {
                                        $project: {
                                            eventName: 1,
                                            abbName: 1,
                                            tournamentId: 1
                                        }
                                    }])

                                    var displaynamesForTeam = schoolEventsToFind.findOne({
                                        key: "School"
                                    })

                                    if (eventList && eventList.length) {
                                        res.status = "success"
                                        res.message = "events fetched"
                                        res.data = eventList

                                        if (displaynamesForTeam && displaynamesForTeam.unwantedTeam && displaynamesForTeam.unwantedTeam.length) {
                                            var toRemove = displaynamesForTeam.unwantedTeam
                                            for (var t = 0; t < toRemove.length; t++) {
                                                var index = res.data.findIndex(function(o) {
                                                    return o.abbName === toRemove[t];
                                                })
                                                if (index !== -1) {
                                                    res.data.splice(index, 1)
                                                }
                                            }
                                        }
                                        if (displaynamesForTeam && displaynamesForTeam.sortOrder && displaynamesForTeam.sortOrder.length) {
                                            res.data = mapOrder(eventList, displaynamesForTeam.sortOrder, 'abbName');
                                        }
                                        if (displaynamesForTeam && displaynamesForTeam.dispNamesTeam) {
                                            res["teamDisplayNames"] = displaynamesForTeam.dispNamesTeam
                                        }
                                        if (displaynamesForTeam && displaynamesForTeam.teamEventNAME) {
                                            res["teamEventNames"] = displaynamesForTeam.teamEventNAME
                                        }
                                    }
                                } else {
                                    res.message = "no tournaments from this organizer for this state"
                                }
                            }
                        } else {
                            res.message = "stateId is Invalid"
                        }
                    } else {
                        res.message = "stateId is required"
                    }
                } else {
                    res.message = "apiUserId is Invalid"
                }
            } else {
                res.message = "apiUserId is required"
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

function mapOrder(array, order, key) {

    array.sort(function(a, b) {
        var A = a[key],
            B = b[key];

        if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
        } else {
            return -1;
        }

    });

    return array;
};

Meteor.methods({
    "getRoundsBasedOnStateAndUser": async function(xData) {
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
            if (xData && xData.tournamentId) {

                if (true) {

                    if (xData.eventName) {
                        if (true) {

                            var query = {}
                            var query2 = {}
                            var message = ""
                            var db = "events"
                            var year = new Date().getFullYear()
                            var nextYear = parseInt(year + 1)
                            var date1 = new Date(year + "-01-01")
                            var date2 = new Date(year + "-01-01")

                            if (true) {
                                query = {
                                    "tournamentId":xData.tournamentId,
                                    "eventName": xData.eventName,
                                    /*"eventEndDate1": {
                                        $gte: date1,
                                        $lt: date2,
                                    }*/
                                }

                                var det = events.findOne(query)
                                if (det) {
                                    db = "events"
                                } else {
                                    det = pastEvents.findOne(query)
                                    if (det) {
                                        db = "pastEvents"
                                    }
                                }

                                if (det && det.projectType == 1) {
                                    db = "MatchCollectionConfig"
                                } else if (det && det.projectType == 2) {
                                    db = "MatchTeamCollectionConfig"
                                }

                                if (det) {
                                    var eventList = global[db].findOne(query)
                                    if (eventList) {
                                        var roundValues = eventList.roundValues;
                                        var defaultRoundNumber;
                                        if(roundValues && roundValues.length && roundValues[0] &&
                                            roundValues[0]["roundNumber"] != undefined && 
                                            roundValues[0]["roundNumber"] != null){
                                            defaultRoundNumber = roundValues[0]["roundNumber"];
                                        }
                                        if(xData.roundNumber){
                                            defaultRoundNumber = xData.roundNumber
                                        }
                                        for (var i = 0; i < roundValues.length; i++) {
                                            
                                            if (det && det.projectType == 1) {
                                                if (roundValues[i]["roundName"] == "Final")
                                                    roundValues[i]["roundHeader"] = "F"
                                                else if (roundValues[i]["roundName"] == "Semi Final")
                                                    roundValues[i]["roundHeader"] = "SF";
                                                else if(roundValues[i]["roundName"] == "Quarter Final")
                                                    roundValues[i]["roundHeader"] = "QF"
                                                else if(roundValues[i]["roundName"] == "Bronze Medal")
                                                    roundValues[i]["roundHeader"] = "BM"
                                                else 
                                                    roundValues[i]["roundHeader"] = "R" + roundValues[i].roundNumber;
                                            } else if (det && det.projectType == 2) {
                                                if (roundValues[i]["roundName"] == "Final")
                                                    roundValues[i]["roundHeader"] = "F"
                                                else if (roundValues[i]["roundName"] == "Semi Final")
                                                    roundValues[i]["roundHeader"] = "SF";
                                                else if(roundValues[i]["roundName"] == "Quater Final")
                                                    roundValues[i]["roundHeader"] = "QF"
                                                else if(roundValues[i]["roundName"] == "Bronze Medal")
                                                    roundValues[i]["roundHeader"] = "BM"
                                                else 
                                                    roundValues[i]["roundHeader"] = "R" + roundValues[i].roundNumber;
                                                
                                            }


                                        }

                                        if(defaultRoundNumber){
                                            var paramJson = {};
                                            paramJson["tournamentId"] = xData.tournamentId;
                                            paramJson["eventName"] = xData.eventName;
                                            paramJson["roundNumber"] = defaultRoundNumber;

                                            var roundResult = await Meteor.call("getMatchRecordsOnTournamentEventRound", paramJson);

                                            if (roundResult) {
                                                if (roundResult.status == SUCCESS_STATUS && roundResult.data){
                                                    eventList.roundData = roundResult.data
                                                    eventList.eventId = det._id
                                                }
                                            }
                                        }
                                        eventList["projectType"] = det.projectType
                                        res.status = SUCCESS_STATUS
                                        res.message = ROUNDS_EVENTS_RECORDS_SUCCESS_MSG
                                        res.data = eventList
                                    }
                                } else {
                                    res.message = FINAL_RESULTS_FAILED_MSG
                                }
                            }
                        }
                    } else {
                        res.message = "event name is required"
                    }
                }
            } else {
                res.message = "tournamentId is required"
            }
            
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})


Meteor.methods({
    "getMatchRecordsOnTournamentEventRound": async function(xData) {
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

            if (xData && xData.tournamentId) {

                if (true) {

                    if (xData.eventName) {
                        if (xData.roundNumber) {

                            var query = {}
                            var query2 = {}
                            var message = ""
                            var db = "events"
                            var year = new Date().getFullYear()
                            var nextYear = parseInt(year + 1)
                            var date1 = new Date(year + "-01-01")
                            var date2 = new Date(year + "-01-01")

                            if (true) {
                                query = {
                                    "tournamentId": xData.tournamentId,
                                    "eventName": xData.eventName,
                                    /*"eventEndDate1": {
                                        $gte: date1,
                                        $lt: date2,
                                    }*/
                                }

                                var det = events.findOne(query)
                                if (det) {
                                    db = "events"
                                } else {
                                    det = pastEvents.findOne(query)
                                    if (det) {
                                        db = "pastEvents"
                                    }
                                }

                                if (det && det.projectType == 1) {
                                    db = "MatchCollectionDB"
                                } else if (det && det.projectType == 2) {
                                    db = "teamMatchCollectionDB"
                                }
                                if (det && det.projectType == 1) {
                                    var eventList = queryMatchColDBForFinalResults(xData.tournamentId,"all",xData.roundNumber,xData.eventName) 
                                    if (eventList) {
                                        res.status = "success"
                                        res.message = "draws fetched"
                                        res.data = eventList
                                    }
                                } else if (det && det.projectType == 2) {
                                    var subRest = subscriptionRestrictions.findOne({
                                        tournamentId: query["tournamentId"]
                                    })
                                    var eventList = queryTeamMatchColDBForFinalResults(xData.tournamentId,"all",xData.roundNumber,xData.eventName)
                                    if (eventList) {
                                        res.status = SUCCESS_STATUS
                                        res.message = FINAL_RESULTS_SUCCESS_MSG
                                        res.data = eventList
                                    }
                                } else {
                                    res.message = FINAL_RESULTS_FAILED_MSG
                                }
                            }
                        } else {
                            res.message = "roundNumber is required"
                        }
                    } else {
                        res.message = "eventName is required"
                    }
                }
            } else {
                res.message = "tournamentId is required"
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "getMatchRecordsOnTournamentEventFinal": function(xData) {
        var res = {
            "status": "failure",
            "data": 0,
            "message": "draws could not be fetched"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData && xData.apiUserId) {

                if (xData && xData.stateId) {
                    var stateCheck = domains.findOne({
                        "_id": xData.stateId
                    })
                    if (stateCheck) {
                        if (true) {

                            var query = {}
                            var query2 = {}
                            var message = ""
                            var db = "events"
                            var year = new Date().getFullYear()
                            var nextYear = parseInt(year + 1)
                            var date1 = new Date(year + "-01-01")
                            var date2 = new Date(year + "-01-01")

                            if (true) {
                                query = {
                                    "eventOrganizer": xData.apiUserId,
                                    "domainId": xData.stateId,
                                    "tournamentEvent": false
                                        /*"eventEndDate1": {
                                            $gte: date1,
                                            $lt: date2,
                                        }*/
                                }

                                var det = events.find(query).fetch()
                                if (det && det.length) {
                                    db = "events"
                                } else {
                                    det = pastEvents.find(query).fetch()
                                    if (det && det.length) {
                                        db = "pastEvents"
                                    }
                                }


                                if (det && det.length) {
                                    query2 = {
                                        "tournamentId": det[0].tournamentId,
                                    }

                                }
                                var finalData = []


                                if (det && det.length) {

                                    var eventList = MatchCollectionDB.aggregate([{
                                        $match: query2
                                    }, {
                                        $unwind: {
                                            path: "$matchRecords",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $match: {
                                            "matchRecords.roundName": "F"
                                        }
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
                                            "tournamentId": det[0].tournamentId
                                        }
                                    }])

                                    if (eventList) {
                                        finalData = _.union(finalData, eventList)
                                    }
                                }
                                if (det && det.length) {


                                    var subRest = subscriptionRestrictions.findOne({
                                        tournamentId: det[0]["tournamentId"]
                                    })

                                    if (subRest && subRest.selectionType &&
                                        subRest.selectionType.toLowerCase() == "schoolonly") {

                                        var eventList = teamMatchCollectionDB.aggregate([{
                                            $match: query2
                                        }, {
                                            $unwind: {
                                                path: "$matchRecords",
                                                preserveNullAndEmptyArrays: true
                                            }
                                        }, {
                                            $match: {
                                                "matchRecords.roundName": "F"
                                            }
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
                                                from: "schoolTeams",
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
                                                from: "schoolTeams",
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
                                                "tournamentId": det[0].tournamentId
                                            }
                                        }])
                                        if (eventList) {
                                            finalData = _.union(finalData, eventList)
                                        }
                                    } else {
                                        var eventList = teamMatchCollectionDB.aggregate([{
                                            $match: query2
                                        }, {
                                            $unwind: {
                                                path: "$matchRecords",
                                                preserveNullAndEmptyArrays: true
                                            }
                                        }, {
                                            $match: {
                                                "matchRecords.roundName": "F"
                                            }
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
                                                from: "playerTeams",
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
                                                from: "playerTeams",
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
                                                "tournamentId": det[0].tournamentId
                                            }
                                        }])
                                        if (eventList) {
                                            finalData = _.union(finalData, eventList)
                                        }
                                    }


                                }

                                if (finalData && finalData.length) {
                                    res.message = "draws fetched"
                                    res.data = finalData
                                    res.status = "success"
                                } else {
                                    res.message = "no draws yet for this event"
                                }
                            }
                        }
                    } else {
                        res.message = "state is invalid"
                    }
                } else {
                    res.message = "stateId is required"
                }
            } else {
                res.message = "apiUserId is required"
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})