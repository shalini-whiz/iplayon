import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({
    "getMatchRecordsforEventAndRound": async function(xData) {

        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": RESULTS_FAILED_EVE_MSG
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
                
                var sDraws = new DrawsResults(xData)
                    //validations
                var nullTournamentId = sDraws.nullUndefinedEmpty("tournamentId")
                var checkFrom = sDraws.nullUndefinedEmpty("resultsFor")
                if (checkFrom == "1") {
                    var checkFromValue = sDraws.checkResultsFor()
                    if (checkFromValue == "1") {
                        if (nullTournamentId == "1") {
                            var nullEventName = sDraws.nullUndefinedEmpty("eventName")

                            if (nullEventName == "1") {
                                res.message = nullEventName
                                var checkTournamentEventDet = sDraws.checkTournamentEvent("events")

                                var db = ""
                                if (checkTournamentEventDet == "1") {
                                    //get draws with rounds for that tournament
                                    //check other event names are required
                                    db = "events"
                                } else {
                                    var checkTournamentEventDetPast = sDraws.checkTournamentEvent("pastEvents")
                                    if (checkTournamentEventDetPast == "1") {
                                        //get draws with rounds for that tournament
                                        //check other event names are required
                                        db = "pastEvents"
                                    } else {
                                        res.message = checkTournamentEventDetPast
                                    }
                                }

                                res.tournamentData = sDraws.checkTournament(db, true)

                                if (db && xData.resultsFor == "finals") {
                                    var getRoundDetails = await Meteor.call("getRoundsBasedOnStateAndUser", xData)
                                    if (getRoundDetails && getRoundDetails.status == SUCCESS_STATUS && getRoundDetails.data) {
                                        var query = {
                                            "tournamentId": xData.tournamentId
                                        }
                                        var eveList = []
                                        var eventList = queryToGetEvents("MatchCollectionDB", db, query)
                                        var eventList2 = queryToGetEvents("teamMatchCollectionDB", db, query)

                                        if (eventList && eventList.length && eventList2 &&
                                            eventList2.length) {
                                            eveList = _.union(eventList, eventList2)
                                        } else if (eventList && eventList.length) {
                                            eveList = eventList
                                        } else if (eventList2 && eventList2.length) {
                                            eveList = eventList2
                                        }
                                        if (eveList && eveList.length) {
                                            
                                            getRoundDetails.data["eventList"] = eveList
                                            if (eveList && eveList.length) {
                                                var s = eventsmapOrder(eveList, [], 'eventName');
                                                s = s.filter(function(element) {
                                                    return element !== undefined && element !== null;
                                                });
                                                if (s.length == 0) {
                                                    s = eveList
                                                }

                                                getRoundDetails.data["eventList"] = s
                                                if(xData.tournamentId)
                                                {
                                                    var sortEvents = categorySort(s,xData.tournamentId)
                                                    if(s.length == sortEvents.length)
                                                    {
                                                        getRoundDetails.data["eventList"] = sortEvents
                                                    }
 
                                                }

                                                
                                            }
                                            res.status = SUCCESS_STATUS
                                            res.data = getRoundDetails.data
                                            res.message = ROUNDS_EVENTS_RECORDS_SUCCESS_MSG
                                        } else {
                                            res.message = FINAL_RESULTS_FAILED_MSG
                                        }

                                    } else if (getRoundDetails && getRoundDetails.status == FAIL_STATUS) {
                                        res.message = getRoundDetails.message
                                    } else {
                                        res.message = FINAL_RESULTS_FAILED_MSG
                                    }
                                } else if (db && xData.resultsFor == "all") {
                                    var nullRound = sDraws.nullUndefinedEmpty("roundNumber")
                                    if (nullRound == "1") {
                                        var getRoundDetails = await Meteor.call("getRoundsBasedOnStateAndUser", xData)
                                        if (getRoundDetails && getRoundDetails.status == SUCCESS_STATUS && getRoundDetails.data) {
                                            var query = {
                                                "tournamentId": xData.tournamentId
                                            }
                                            var eveList = []
                                            var eventList = queryToGetEvents("MatchCollectionDB", db, query)
                                            var eventList2 = queryToGetEvents("teamMatchCollectionDB", db, query)

                                            if (eventList && eventList.length && eventList2 &&
                                                eventList2.length) {
                                                eveList = _.union(eventList, eventList2)
                                            } else if (eventList && eventList.length) {
                                                eveList = eventList
                                            } else if (eventList2 && eventList2.length) {
                                                eveList = eventList2
                                            }

                                            if (eveList && eveList.length) {
                                                
                                                getRoundDetails.data["eventList"] = eveList
                                                if (eveList && eveList.length) {
                                                    var s = eventsmapOrder(eveList, [], 'eventName');
                                                    s = s.filter(function(element) {
                                                        return element !== undefined && element !== null;
                                                    });
                                                    if (s.length == 0) {
                                                        s = eveList
                                                    }

                                                    getRoundDetails.data["eventList"] = s
                                                }
                                                res.status = SUCCESS_STATUS
                                                res.data = getRoundDetails.data
                                                res.message = ROUNDS_EVENTS_RECORDS_SUCCESS_MSG
                                            } else {
                                                res.message = FINAL_RESULTS_FAILED_MSG
                                            }

                                        } else if (getRoundDetails && getRoundDetails.status == FAIL_STATUS) {
                                            res.message = getRoundDetails.message
                                        } else {
                                            res.message = FINAL_RESULTS_FAILED_MSG
                                        }
                                    } else {
                                        res.message = nullRound
                                    }
                                } else {
                                    res.message = FINAL_RESULTS_FAILED_MSG
                                }
                            } else {
                                res.message = nullEventName
                            }
                        } else {
                            res.message = nullTournamentId
                        }
                    } else {
                        res.message = checkFromValue
                    }
                } else {
                    res.message = checkFrom
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
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

var queryToGetEvents = function(db1, db2, query) {
    try {

        if (db1 == "MatchCollectionDB") {
            var eveDet = MatchCollectionDB.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from: db2,
                    localField: "tournamentId",
                    // name of users table field,
                    foreignField: "tournamentId",
                    as: "eveDet"
                }
            }, {
                $unwind: {
                    path: "$eveDet"
                }
            }, {
                $project: {
                    eventName: "$eveDet.eventName",
                    abbName: "$eveDet.abbName",
                    tournamentId: "$eveDet.tournamentId",
                    projectType: "$eveDet.projectType",
                    eventId: "$eveDet._id",
                    "eid1": {
                        "$cond": [{
                            "$eq": ["$eveDet.eventName", "$eventName"]
                        }, 1, 0]
                    },
                }
            }, {
                $match: {
                    "eid1": {
                        $eq: 1
                    }
                }
            }])
            if (eveDet && eveDet.length) {
                return eveDet
            } else {
                return []
            }
        } else if (db1 == "teamMatchCollectionDB") {
            var eveDet = teamMatchCollectionDB.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from: db2,
                    localField: "tournamentId",
                    // name of users table field,
                    foreignField: "tournamentId",
                    as: "eveDet"
                }
            }, {
                $unwind: {
                    path: "$eveDet"
                }
            }, {
                $project: {
                    eventName: "$eveDet.eventName",
                    abbName: "$eveDet.abbName",
                    tournamentId: "$eveDet.tournamentId",
                    eventId: "$eveDet._id",
                    projectType: "$eveDet.projectType",
                    "eid1": {
                        "$cond": [{
                            "$eq": ["$eveDet.eventName", "$eventName"]
                        }, 1, 0]
                    },
                }
            }, {
                $match: {
                    "eid1": {
                        $eq: 1
                    }
                }
            }])

            if (eveDet && eveDet.length) {
                return eveDet
            } else {
                return []
            }
        }
    } catch (e) {
        return false
    }
}