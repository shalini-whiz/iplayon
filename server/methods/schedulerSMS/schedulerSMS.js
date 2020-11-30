import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

SyncedCron.start();

function findScheduleDataForTimeTeam(xdateTimefromparam, dfromparam, matchNum, tournamentId, eventName) {
    try {
        //today's date
        var dateNow = moment(new Date("02 May 2018")).format("YYYY-MM-DD")
        var givenround = 1

        //today's date in DD MMM YYYY format
        var d = moment(new Date("02 May 2018")).format("DD MMM YYYY")

        //add 1hr to now

        var timeNow = moment(new Date()).add(60, 'minutes').format("h:mm:ss")

        //now with date and time
        var dateTime = moment(new Date(dateNow + ' ' + "02:10:00")).format("YYYY-MM-DDTHH:mm:ssZ");

        //next 1 hr from now
        var xdateTime = new Date(dateTime);
        var matchIntQuery = {}
        var tournamentIdQuery = {}
        var eventNameQuery = {}
        var roundNameQuery = {}

        if (xdateTimefromparam && dfromparam && matchNum && tournamentId && eventName) {
            xdateTime = xdateTimefromparam
            d = dfromparam
            matchIntQuery = {
                "$cond": [{
                    "$eq": ["$scheduledData.schedule.matchInt", matchNum],
                }, "$scheduledData.schedule.matchInt", 0]
            }
            tournamentIdQuery = {
                "selectedDate": d,
                "tournamentId": tournamentId
            }
            eventNameQuery = {
                "$cond": [{
                    "$eq": ["$scheduledData.eventName", eventName],
                }, "$scheduledData.eventName", 0]
            }
            roundNameQuery = "$mid3.roundNumber"
        } else {
            matchIntQuery = "$scheduledData.schedule.matchInt"
            eventNameQuery = "$scheduledData.eventName"
            tournamentIdQuery = {
                "selectedDate": d
            }
            roundNameQuery = {
                "$cond": [{
                    "$eq": ["$mid3.roundNumber", givenround],
                }, "$mid3.roundNumber", false]
            }
        }


        if (xdateTime) {
            var dbDEtailsSchedule = tournamentSchedule.aggregate([{
                $match: tournamentIdQuery
            }, {
                $unwind: "$scheduledData"
            }, {
                $project: {
                    "scheduledData.tournamentId": 1,
                    "scheduledData.eventName": 1,
                    "scheduledData.projectType": 1,
                    "scheduledData.schedule": 1,
                }
            }, {
                $unwind: "$scheduledData.schedule"
            }, {
                $project: {
                    "eventNamer": eventNameQuery,
                    "tournamentId": "$scheduledData.tournamentId",
                    "proj": "$scheduledData.projectType",
                    "scheduledData.schedule": 1,
                    "matchInt": matchIntQuery
                }
            }, {
                $match: {
                    "eventNamer": {
                        $ne: 0
                    },
                    "matchInt": {
                        $ne: 0
                    },
                    "proj": 2,
                    "scheduledData.schedule.starttimesessionISO": {
                        $eq: xdateTime
                    },
                }
            }, {
                $lookup: {
                    from: "teamMatchCollectionDB",
                    localField: "tournamentId",
                    // name of users table field,
                    foreignField: "tournamentId",
                    as: "matchDetails" // alias for userinfo table
                }
            }, {
                $unwind: "$matchDetails"
            }, {
                $project: {
                    mid: {
                        $cond: [{
                            $eq: ['$eventNamer', '$matchDetails.eventName'],
                        }, "$matchDetails", 0]
                    },
                    matchInt: 1,
                    scheduledData: 1,
                    eventNamer: "$eventNamer",
                    "tournamentId": "$tournamentId"
                }
            }, {
                "$match": {
                    "mid": {
                        "$ne": 0
                    }
                }
            }, {
                $unwind: "$mid.matchRecords"
            }, {
                $project: {
                    mid2: {
                        $cond: [{
                            $eq: ['$mid.matchRecords.matchNumber', '$matchInt'],
                        }, "$mid.matchRecords", 0]
                    },
                    matchInt: 1,
                    scheduledData: 1,
                    eventNamer: "$eventNamer",
                    "tournamentId": "$tournamentId"
                }
            }, {
                "$match": {
                    "mid2": {
                        "$ne": 0
                    }
                }
            }, {
                $sort: {
                    matchInt: 1
                }
            }, {
                $unwind: "$mid2"
            }, {
                $project: {
                    mid3: {
                        $cond: [{
                            $eq: ['$mid2.status', 'yetToPlay'],
                        }, "$mid2", 0]
                    },
                    matchInt: 1,
                    scheduledData: 1,
                    eventName: "$eventNamer",
                    "tournamentId": "$tournamentId"
                }
            }, {
                "$match": {
                    "mid3": {
                        "$ne": 0
                    }
                }
            }, {
                $project: {
                    "roundNumber": roundNameQuery,
                    "roundName": "$mid3.roundName",
                    "teamIds": "$mid3.teamsID",
                    "teams": "$mid3.teams",
                    "round": "$scheduledData.schedule.round",
                    "match": "$scheduledData.schedule.match",
                    "matchInt": "$matchInt",
                    "time": "$scheduledData.schedule.time",
                    "endTime": "$scheduledData.schedule.endTime",
                    "dateOfEvent": "$scheduledData.schedule.dateOfEvent",
                    "dateOfEventMoment": "$scheduledData.schedule.dateOfEventMoment",
                    "table": "$scheduledData.schedule.table",
                    "starttimesession": "$scheduledData.schedule.starttimesession",
                    "starttimesessionISO": "$scheduledData.schedule.starttimesessionISO",
                    "eventName": "$eventName",
                    "tournamentId": "$tournamentId"
                }
            }, {
                "$match": {
                    "roundNumber": {
                        "$ne": false
                    }
                }
            }, {
                $lookup: {
                    from: "events",
                    localField: "tournamentId",
                    // name of users table field,
                    foreignField: "_id",
                    as: "eventdet" // alias for userinfo table
                }
            }, {
                $unwind: "$eventdet"
            }, {
                $project: {
                    "roundNumber": "$roundNumber",
                    "tournname": "$eventdet.eventName",
                    "roundName": "$roundName",
                    "domainName": "$eventdet.domainName",
                    "venueAddress": "$eventdet.venueAddress",
                    "teamIds": "$teamIds",
                    "teams": "$teams",
                    "round": "$round",
                    "match": "$match",
                    "matchInt": "$matchInt",
                    "time": "$time",
                    "endTime": "$endTime",
                    "dateOfEvent": "$dateOfEvent",
                    "dateOfEventMoment": "$dateOfEventMoment",
                    "table": "$table",
                    "starttimesession": "$starttimesession",
                    "starttimesessionISO": "$starttimesessionISO",
                    "eventName": "$eventName",
                    "tournamentId": "$tournamentId"
                }
            }, {
                $unwind: "$teamIds"
            }, {
                $project: {
                    "roundName": "$roundName",
                    "domainName": "$domainName",
                    "venueAddress": "$venueAddress",
                    "roundNumber": "$roundNumber",
                    "tournname": "$tournname",
                    "playerIdA": "$teamIds.managerAId",
                    "playerBId": "$teamIds.managerBId",
                    "teams": "$teams",
                    "round": "$round",
                    "match": "$match",
                    "matchInt": "$matchInt",
                    "time": "$time",
                    "endTime": "$endTime",
                    "dateOfEvent": "$dateOfEvent",
                    "dateOfEventMoment": "$dateOfEventMoment",
                    "table": "$table",
                    "starttimesession": "$starttimesession",
                    "starttimesessionISO": "$starttimesessionISO",
                    "eventName": "$eventName",
                    "tournamentId": "$tournamentId"
                }
            }, {
                $unwind: "$teams"
            }, {
                $project: {
                    "roundName": "$roundName",
                    "domainName": "$domainName",
                    "venueAddress": "$venueAddress",
                    "roundNumber": "$roundNumber",
                    "tournname": "$tournname",
                    "playerIdA": "$playerIdA",
                    "playerBId": "$playerBId",
                    "teamIdA": "$teams.teamA",
                    "teamIdB": "$teams.teamB",
                    "round": "$round",
                    "match": "$match",
                    "matchInt": "$matchInt",
                    "time": "$time",
                    "endTime": "$endTime",
                    "dateOfEvent": "$dateOfEvent",
                    "dateOfEventMoment": "$dateOfEventMoment",
                    "table": "$table",
                    "starttimesession": "$starttimesession",
                    "starttimesessionISO": "$starttimesessionISO",
                    "eventName": "$eventName",
                    "tournamentId": "$tournamentId"
                }
            }, {
                $lookup: {
                    from: "users",
                    localField: "playerIdA",
                    // name of users table field,
                    foreignField: "userId",
                    as: "userDet" // alias for userinfo table
                }
            }, {
                $unwind: "$userDet"
            }, {
                $project: {
                    "roundName": "$roundName",
                    "domainName": "$domainName",
                    "venueAddress": "$venueAddress",
                    "roundNumber": "$roundNumber",
                    "P1phoneNumber": "$userDet.phoneNumber",
                    "P1emailAddress": "$userDet.emailAddress",
                    "P1verifiedBy": "$userDet.verifiedBy",
                    "P1userNAme": "$userDet.userName",
                    "tournname": "$tournname",
                    "playerIdA": "$playerIdA",
                    "playerBId": "$playerBId",
                    "round": "$round",
                    "match": "$match",
                    "matchInt": "$matchInt",
                    "time": "$time",
                    "endTime": "$endTime",
                    "dateOfEvent": "$dateOfEvent",
                    "dateOfEventMoment": "$dateOfEventMoment",
                    "table": "$table",
                    "starttimesession": "$starttimesession",
                    "starttimesessionISO": "$starttimesessionISO",
                    "eventName": "$eventName",
                    "tournamentId": "$tournamentId",
                    "teamIdA": "$teamIdA",
                    "teamIdB": "$teamIdB",
                }
            }, {
                $lookup: {
                    from: "users",
                    localField: "playerBId",
                    // name of users table field,
                    foreignField: "userId",
                    as: "userDet2" // alias for userinfo table
                }
            }, {
                $unwind: "$userDet2"
            }, {
                $project: {
                    "roundName": "$roundName",
                    "domainName": "$domainName",
                    "venueAddress": "$venueAddress",
                    "roundNumber": "$roundNumber",
                    "P2phoneNumber": "$userDet2.phoneNumber",
                    "P2emailAddress": "$userDet2.emailAddress",
                    "P2verifiedBy": "$userDet2.verifiedBy",
                    "P2userNAme": "$userDet2.userName",
                    "P1phoneNumber": "$P1phoneNumber",
                    "P1emailAddress": "$P1emailAddress",
                    "P1verifiedBy": "$P1verifiedBy",
                    "P1userNAme": "$P1userNAme",
                    "tournname": "$tournname",
                    "playerIdA": "$playerIdA",
                    "playerBId": "$playerBId",
                    "round": "$round",
                    "match": "$match",
                    "matchInt": "$matchInt",
                    "time": "$time",
                    "endTime": "$endTime",
                    "dateOfEvent": "$dateOfEvent",
                    "dateOfEventMoment": "$dateOfEventMoment",
                    "table": "$table",
                    "starttimesession": "$starttimesession",
                    "starttimesessionISO": "$starttimesessionISO",
                    "eventName": "$eventName",
                    "tournamentId": "$tournamentId",
                    "teamNameA": "$teamIdA",
                    "teamNameB": "$teamIdB",
                }
            }]).forEach(function(d, i) {
                if (_.contains(d.P2verifiedBy, "phone") && d.P2phoneNumber && d.P2phoneNumber.trim().length != 0) {
                    if (d.venueAddress) {

                    } else {
                        d.venueAddress = ""
                    }
                    var text = "Your team's " + d.teamNameB + ", next match is on " + d.dateOfEvent + ", " + d.time + " of tournament " + d.tournname + "-" + d.eventName + ", round " + d.roundName + ", match no. " + d.match + "," + " against " + d.teamNameA + " at " + d.venueAddress + " " + d.domainName
                }
                if (_.contains(d.P2verifiedBy, "email") && d.P2emailAddress && d.P2emailAddress.trim().length != 0) {
                    if (d.venueAddress) {

                    } else {
                        d.venueAddress = ""
                    }
                    var text = "Your team's " + d.teamNameB + ", next match is on " + d.dateOfEvent + ", " + d.time + " of tournament " + d.tournname + "-" + d.eventName + ", round " + d.roundName + ", match no. " + d.match + "," + " against " + d.teamNameA + " at " + d.venueAddress + " " + d.domainName
                }
                if (_.contains(d.P1verifiedBy, "phone") && d.P1phoneNumber && d.P1phoneNumber.trim().length != 0) {
                    if (d.venueAddress) {

                    } else {
                        d.venueAddress = ""
                    }
                    var text = "Your team's " + d.teamNameA + ", next match is on " + d.dateOfEvent + ", " + d.time + " of tournament " + d.tournname + "-" + d.eventName + ", round " + d.roundName + ", match no. " + d.match + "," + " against " + d.teamNameB + " at " + d.venueAddress + " " + d.domainName
                }
                if (_.contains(d.P1verifiedBy, "email") && d.P1emailAddress && d.P1emailAddress.trim().length != 0) {
                    if (d.venueAddress) {

                    } else {
                        d.venueAddress = ""
                    }
                    var text = "Your team's " + d.teamNameA + ", next match is on " + d.dateOfEvent + ", " + d.time + " of tournament " + d.tournname + "-" + d.eventName + ", round " + d.roundName + ", match no. " + d.match + "," + " against " + d.teamNameB + " at " + d.venueAddress + " " + d.domainName
                }
            })
        }
        //next hour match

        //get next
    } catch (e) {}
}

function findScheduleDataForTime(xdateTimefromparam, dfromparam, matchNum, tournamentId, eventName) {
    try {
        var dateNow = moment(new Date("02 May 2018")).format("YYYY-MM-DD")
        var givenround = 1

        //today's date in DD MMM YYYY format
        var d = moment(new Date("02 May 2018")).format("DD MMM YYYY")

        //add 1hr to now

        var timeNow = moment(new Date()).add(60, 'minutes').format("h:mm:ss")

        //now with date and time
        var dateTime = moment(new Date(dateNow + ' ' + "02:10:00")).format("YYYY-MM-DDTHH:mm:ssZ");

        //next 1 hr from now
        var xdateTime = new Date(dateTime);
        var matchIntQuery = {}
        var tournamentIdQuery = {}
        var eventNameQuery = {}
        var roundNameQuery = {}

        if (xdateTimefromparam && dfromparam && matchNum && tournamentId && eventName) {
            xdateTime = new Date(xdateTimefromparam)
            d = dfromparam
            matchIntQuery = {
                "$cond": [{
                    "$eq": ["$scheduledData.schedule.matchInt", matchNum],
                }, "$scheduledData.schedule.matchInt", 0]
            }
            tournamentIdQuery = {
                "selectedDate": d,
                "tournamentId": tournamentId
            }
            eventNameQuery = {
                "$cond": [{
                    "$eq": ["$scheduledData.eventName", eventName],
                }, "$scheduledData.eventName", 0]
            }
            roundNameQuery = "$mid3.roundNumber"
        } else {
            matchIntQuery = "$scheduledData.schedule.matchInt"
            eventNameQuery = "$scheduledData.eventName"
            tournamentIdQuery = {
                "selectedDate": d
            }
            roundNameQuery = {
                "$cond": [{
                    "$eq": ["$mid3.roundNumber", givenround],
                }, "$mid3.roundNumber", false]
            }
        }
        if (xdateTime) {
            var dbDEtailsSchedule = tournamentSchedule.aggregate([{
                    $match: tournamentIdQuery
                }, {
                    $unwind: "$scheduledData"
                }, {
                    $project: {
                        "scheduledData.tournamentId": 1,
                        "scheduledData.eventName": 1,
                        "scheduledData.projectType": 1,
                        "scheduledData.schedule": 1,
                    }
                }, {
                    $unwind: "$scheduledData.schedule"
                }, {
                    $project: {
                        "eventNamer": eventNameQuery,
                        "tournamentId": "$scheduledData.tournamentId",
                        "proj": "$scheduledData.projectType",
                        "scheduledData.schedule": 1,
                        "matchInt": matchIntQuery
                    }
                }, {
                    $match: {
                        "proj": 1,
                        "scheduledData.schedule.starttimesessionISO": {
                            $eq: xdateTime
                        },
                    }
                }, {
                    $lookup: {
                        from: "MatchCollectionDB",
                        localField: "tournamentId",
                        // name of users table field,
                        foreignField: "tournamentId",
                        as: "matchDetails" // alias for userinfo table
                    }
                }, {
                    $unwind: "$matchDetails"
                }, {
                    $project: {
                        mid: {
                            $cond: [{
                                $eq: ['$eventNamer', '$matchDetails.eventName'],
                            }, "$matchDetails", 0]
                        },
                        matchInt: 1,
                        scheduledData: 1,
                        eventNamer: "$eventNamer",
                        "tournamentId": "$tournamentId"
                    }
                }, {
                    "$match": {
                        "mid": {
                            "$ne": 0
                        }
                    }
                }, {
                    $unwind: "$mid.matchRecords"
                }, {
                    $project: {
                        mid2: {
                            $cond: [{
                                $eq: ['$mid.matchRecords.matchNumber', '$matchInt'],
                            }, "$mid.matchRecords", 0]
                        },
                        matchInt: 1,
                        scheduledData: 1,
                        eventNamer: "$eventNamer",
                        "tournamentId": "$tournamentId"
                    }
                }, {
                    "$match": {
                        "mid2": {
                            "$ne": 0
                        }
                    }
                }, {
                    $sort: {
                        matchInt: 1
                    }
                }, {
                    $unwind: "$mid2"
                }, {
                    $project: {
                        mid3: {
                            $cond: [{
                                $eq: ['$mid2.status', 'yetToPlay'],
                            }, "$mid2", 0]
                        },
                        matchInt: 1,
                        scheduledData: 1,
                        eventName: "$eventNamer",
                        "tournamentId": "$tournamentId"
                    }
                }, {
                    "$match": {
                        "mid3": {
                            "$ne": 0
                        }
                    }
                }, {
                    $project: {
                        "roundNumber": roundNameQuery,
                        "roundName": "$mid3.roundName",
                        "playerIds": "$mid3.playersID",
                        "round": "$scheduledData.schedule.round",
                        "match": "$scheduledData.schedule.match",
                        "matchInt": "$matchInt",
                        "time": "$scheduledData.schedule.time",
                        "endTime": "$scheduledData.schedule.endTime",
                        "dateOfEvent": "$scheduledData.schedule.dateOfEvent",
                        "dateOfEventMoment": "$scheduledData.schedule.dateOfEventMoment",
                        "table": "$scheduledData.schedule.table",
                        "starttimesession": "$scheduledData.schedule.starttimesession",
                        "starttimesessionISO": "$scheduledData.schedule.starttimesessionISO",
                        "eventName": "$eventName",
                        "tournamentId": "$tournamentId"
                    }
                }, {
                    "$match": {
                        "roundNumber": {
                            "$ne": false
                        }
                    }
                }, {
                    $lookup: {
                        from: "events",
                        localField: "tournamentId",
                        // name of users table field,
                        foreignField: "_id",
                        as: "eventdet" // alias for userinfo table
                    }
                }, {
                    $unwind: "$eventdet"
                }, {
                    $project: {
                        "roundNumber": "$roundNumber",
                        "roundName": "$roundName",
                        "tournname": "$eventdet.eventName",
                        "domainName": "$eventdet.domainName",
                        "venueAddress": "$eventdet.venueAddress",
                        "playerIds": "$playerIds",
                        "round": "$round",
                        "match": "$match",
                        "matchInt": "$matchInt",
                        "time": "$time",
                        "endTime": "$endTime",
                        "dateOfEvent": "$dateOfEvent",
                        "dateOfEventMoment": "$dateOfEventMoment",
                        "table": "$table",
                        "starttimesession": "$starttimesession",
                        "starttimesessionISO": "$starttimesessionISO",
                        "eventName": "$eventName",
                        "tournamentId": "$tournamentId"
                    }
                }, {
                    $unwind: "$playerIds"
                }, {
                    $project: {
                        "roundNumber": "$roundNumber",
                        "roundName": "$roundName",
                        "tournname": "$tournname",
                        "domainName": "$domainName",
                        "venueAddress": "$venueAddress",
                        "playerIdA": "$playerIds.playerAId",
                        "playerBId": "$playerIds.playerBId",
                        "round": "$round",
                        "match": "$match",
                        "matchInt": "$matchInt",
                        "time": "$time",
                        "endTime": "$endTime",
                        "dateOfEvent": "$dateOfEvent",
                        "dateOfEventMoment": "$dateOfEventMoment",
                        "table": "$table",
                        "starttimesession": "$starttimesession",
                        "starttimesessionISO": "$starttimesessionISO",
                        "eventName": "$eventName",
                        "tournamentId": "$tournamentId"
                    }
                }, {
                    $lookup: {
                        from: "users",
                        localField: "playerIdA",
                        // name of users table field,
                        foreignField: "userId",
                        as: "userDet" // alias for userinfo table
                    }
                }, {
                    $unwind: "$userDet"
                }, {
                    $project: {
                        "roundNumber": "$roundNumber",
                        "roundName": "$roundName",
                        "domainName": "$domainName",
                        "venueAddress": "$venueAddress",
                        "P1phoneNumber": "$userDet.phoneNumber",
                        "P1emailAddress": "$userDet.emailAddress",
                        "P1verifiedBy": "$userDet.verifiedBy",
                        "P1userNAme": "$userDet.userName",
                        "tournname": "$tournname",
                        "playerIdA": "$playerIdA",
                        "playerBId": "$playerBId",
                        "round": "$round",
                        "match": "$match",
                        "matchInt": "$matchInt",
                        "time": "$time",
                        "endTime": "$endTime",
                        "dateOfEvent": "$dateOfEvent",
                        "dateOfEventMoment": "$dateOfEventMoment",
                        "table": "$table",
                        "starttimesession": "$starttimesession",
                        "starttimesessionISO": "$starttimesessionISO",
                        "eventName": "$eventName",
                        "tournamentId": "$tournamentId"
                    }
                }, {
                    $lookup: {
                        from: "users",
                        localField: "playerBId",
                        // name of users table field,
                        foreignField: "userId",
                        as: "userDet2" // alias for userinfo table
                    }
                }, {
                    $unwind: "$userDet2"
                }, {
                    $project: {
                        "roundNumber": "$roundNumber",
                        "roundName": "$roundName",
                        "P2phoneNumber": "$userDet2.phoneNumber",
                        "P2emailAddress": "$userDet2.emailAddress",
                        "P2verifiedBy": "$userDet2.verifiedBy",
                        "P2userNAme": "$userDet2.userName",
                        "P1phoneNumber": "$P1phoneNumber",
                        "P1emailAddress": "$P1emailAddress",
                        "P1verifiedBy": "$P1verifiedBy",
                        "P1userNAme": "$P1userNAme",
                        "tournname": "$tournname",
                        "domainName": "$domainName",
                        "venueAddress": "$venueAddress",
                        "playerIdA": "$playerIdA",
                        "playerBId": "$playerBId",
                        "round": "$round",
                        "match": "$match",
                        "matchInt": "$matchInt",
                        "time": "$time",
                        "endTime": "$endTime",
                        "dateOfEvent": "$dateOfEvent",
                        "dateOfEventMoment": "$dateOfEventMoment",
                        "table": "$table",
                        "starttimesession": "$starttimesession",
                        "starttimesessionISO": "$starttimesessionISO",
                        "eventName": "$eventName",
                        "tournamentId": "$tournamentId"
                    }
                }]).forEach(function(d, i) {
                    if (_.contains(d.P2verifiedBy, "phone") && d.P2phoneNumber && d.P2phoneNumber.trim().length != 0) {
                        if (d.venueAddress) {

                        } else {
                            d.venueAddress = ""
                        }
                        var text = "Your next match is on " + d.dateOfEvent + ", " + d.time + " of tournament " + d.tournname + "-" + d.eventName + ", round " + d.roundName + ", match no. " + d.match + "," + " against " + d.P1userNAme + " at " + d.venueAddress + " " + d.domainName
                    }
                    if (_.contains(d.P2verifiedBy, "email") && d.P2emailAddress && d.P2emailAddress.trim().length != 0) {
                        if (d.venueAddress) {

                        } else {
                            d.venueAddress = ""
                        }
                        var text = "Your next match is on " + d.dateOfEvent + ", " + d.time + " of tournament " + d.tournname + "-" + d.eventName + ", round " + d.roundName + ", match no. " + d.match + "," + " against " + d.P1userNAme + " at " + d.venueAddress + " " + d.domainName
                    }
                    if (_.contains(d.P1verifiedBy, "phone") && d.P1phoneNumber && d.P1phoneNumber.trim().length != 0) {
                        if (d.venueAddress) {

                        } else {
                            d.venueAddress = ""
                        }
                        var text = "Your next match is on " + d.dateOfEvent + ", " + d.time + " of tournament " + d.tournname + "-" + d.eventName + ", round " + d.roundName + ", match no. " + d.match + "," + " against " + d.P2userNAme + " at " + d.venueAddress + " " + d.domainName
                    }
                    if (_.contains(d.P1verifiedBy, "email") && d.P1emailAddress && d.P1emailAddress.trim().length != 0) {
                        if (d.venueAddress) {

                        } else {
                            d.venueAddress = ""
                        }
                        var text = "Your next match is on " + d.dateOfEvent + ", " + d.time + " of tournament " + d.tournname + "-" + d.eventName + ", round " + d.roundName + ", match no. " + d.match + "," + " against " + d.P2userNAme + " at " + d.venueAddress + " " + d.domainName
                    }
                })
        }

    } catch (e) {}


    //get next
}

SyncedCron.config({
    // Log job run details to console
    log: false,

})

SyncedCron.add({
    name: 'Crunch some important numbers for the marketing department',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 secs');
    },
    job: function() {
        //findScheduleDataForTime()
    }
});

SyncedCron.add({
    name: 'Crunch some important numbers for the marketing department 2',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 secs');
    },
    job: function() {
        //findScheduleDataForTimeTeam()
    }
});

Meteor.methods({
    "sendSMSOnPropogate": function(currentMatchRecord, tournamentId, eventName, projectType) {
        try {
            if (currentMatchRecord && currentMatchRecord.nextMatchNumber && tournamentId && eventName && projectType) {
                var getdateAndTime = tournamentSchedule.aggregate([{
                    $match: {
                        tournamentId: tournamentId
                    }
                }, {
                    $unwind: "$scheduledData"
                }, {
                    $match: {
                        "scheduledData.eventName": eventName
                    }
                }, {
                    $unwind: "$scheduledData.schedule"
                }, {
                    $match: {
                        "scheduledData.schedule.matchInt": currentMatchRecord.nextMatchNumber
                    }
                }, {
                    $project: {
                        "time": "$scheduledData.schedule.starttimesessionISO",
                        "date": "$scheduledData.schedule.dateOfEvent",
                    }
                }])

                if (projectType && projectType == 1 && getdateAndTime && getdateAndTime.length && getdateAndTime[0] && getdateAndTime[0].time && getdateAndTime[0].date) {
                    findScheduleDataForTime(getdateAndTime[0].time, getdateAndTime[0].date, currentMatchRecord.nextMatchNumber, tournamentId, eventName)
                } else if (projectType && projectType == 2 && getdateAndTime && getdateAndTime.length && getdateAndTime[0] && getdateAndTime[0].time && getdateAndTime[0].date) {
                    findScheduleDataForTimeTeam(getdateAndTime[0].time, getdateAndTime[0].date, currentMatchRecord.nextMatchNumber, tournamentId, eventName)
                }
            }
        } catch (e) {
        }
    }
})



/*
db.tournamentSchedule.aggregate([{
    $match: {
        "selectedDate": d
    }
}, {
    $unwind: "$scheduledData"
}, {
    $project: {
        "scheduledData.tournamentId": 1,
        "scheduledData.eventName": 1,
        "scheduledData.projectType": 1,
        "scheduledData.schedule": 1,
    }
}, {
    $unwind: "$scheduledData.schedule"
}, {
    $project: {
        "eventNamer": "$scheduledData.eventName",
        "tournamentId": "$scheduledData.tournamentId",
        "proj": "$scheduledData.projectType",
        "scheduledData.schedule": 1,
        "matchInt": "$scheduledData.schedule.matchInt"
    }
}, {
    $match: {
        "proj": 1,
        "scheduledData.schedule.timeISO": {
            $eq: xdateTime
        },
    }
}, {
    $lookup: {
        from: "MatchCollectionDB",
        localField: "tournamentId",
        // name of users table field,
        foreignField: "tournamentId",
        as: "matchDetails" // alias for userinfo table
    }
}, {
    $unwind: "$matchDetails"
}, {
    $project: {
        mid: {
            $cond: [{
                $eq: ['$eventNamer', '$matchDetails.eventName'],
            }, "$matchDetails", 0]
        },
        matchInt: 1,
        scheduledData: 1,
        eventNamer: "$eventNamer",
        "tournamentId": "$tournamentId"
    }
}, {
    "$match": {
        "mid": {
            "$ne": 0
        }
    }
}, {
    $unwind: "$mid.matchRecords"
}, {
    $project: {
        mid2: {
            $cond: [{
                $eq: ['$mid.matchRecords.matchNumber', '$matchInt'],
            }, "$mid.matchRecords", 0]
        },
        matchInt: 1,
        scheduledData: 1,
        eventNamer: "$eventNamer",
        "tournamentId": "$tournamentId"
    }
}, {
    "$match": {
        "mid2": {
            "$ne": 0
        }
    }
}, {
    $sort: {
        matchInt: 1
    }
}, {
    $unwind: "$mid2"
}, {
    $project: {
        mid3: {
            $cond: [{
                $eq: ['$mid2.status', 'yetToPlay'],
            }, "$mid2", 0]
        },
        matchInt: 1,
        scheduledData: 1,
        eventName: "$eventNamer",
        "tournamentId": "$tournamentId"
    }
}, {
    "$match": {
        "mid3": {
            "$ne": 0
        }
    }
}, {
    $project: {
        "roundNumber": {
            $cond: [{
                $eq: ["$mid3.roundNumber", 1],
            }, "$mid3.roundNumber", false]
        },
        "playerIds": "$mid3.playersID",
        "round": "$scheduledData.schedule.round",
        "match": "$scheduledData.schedule.match",
        "matchInt": "$matchInt",
        "time": "$scheduledData.schedule.time",
        "endTime": "$scheduledData.schedule.endTime",
        "dateOfEvent": "$scheduledData.schedule.dateOfEvent",
        "dateOfEventMoment": "$scheduledData.schedule.dateOfEventMoment",
        "table": "$scheduledData.schedule.table",
        "starttimesession": "$scheduledData.schedule.starttimesession",
        "starttimesessionISO": "$scheduledData.schedule.starttimesessionISO",
        "eventName": "$eventName",
        "tournamentId": "$tournamentId"
    }
}, {
    "$match": {
        "roundNumber": {
            "$ne": false
        }
    }
}, {
    $lookup: {
        from: "events",
        localField: "tournamentId",
        // name of users table field,
        foreignField: "_id",
        as: "eventdet" // alias for userinfo table
    }
}, {
    $unwind: "$eventdet"
}, {
    $project: {
        "roundNumber": "$roundNumber",
        "tournname": "$eventdet.eventName",
        "playerIds": "$playerIds",
        "round": "$round",
        "match": "$match",
        "matchInt": "$matchInt",
        "time": "$time",
        "endTime": "$endTime",
        "dateOfEvent": "$dateOfEvent",
        "dateOfEventMoment": "$dateOfEventMoment",
        "table": "$table",
        "starttimesession": "$starttimesession",
        "starttimesessionISO": "$starttimesessionISO",
        "eventName": "$eventName",
        "tournamentId": "$tournamentId"
    }
}, {
    $unwind: "$playerIds"
}, {
    $project: {
        "roundNumber": "$roundNumber",
        "tournname": "$tournname",
        "playerIdA": "$playerIds.playerAId",
        "playerIdB": "$playerIds.playerBId",
        "round": "$round",
        "match": "$match",
        "matchInt": "$matchInt",
        "time": "$time",
        "endTime": "$endTime",
        "dateOfEvent": "$dateOfEvent",
        "dateOfEventMoment": "$dateOfEventMoment",
        "table": "$table",
        "starttimesession": "$starttimesession",
        "starttimesessionISO": "$starttimesessionISO",
        "eventName": "$eventName",
        "tournamentId": "$tournamentId",
        "role": "Player"
    }
}, {
    $lookup: {
        from: "users",
        localField: "role",
        // name of users table field,
        foreignField: "role",
        as: "userDet" // alias for userinfo table
    }
}, {
    $unwind: "$userDet"
}, {
    $project: {
        "roundNumber": "$roundNumber",
        "tournname": "$tournname",
        "playerIdA": "$playerIdA",
        "playerIdB": "$playerIdB",
        "round": "$round",
        "match": "$match",
        "matchInt": "$matchInt",
        "time": "$time",
        "endTime": "$endTime",
        "dateOfEvent": "$dateOfEvent",
        "dateOfEventMoment": "$dateOfEventMoment",
        "table": "$table",
        "starttimesession": "$starttimesession",
        "starttimesessionISO": "$starttimesessionISO",
        "eventName": "$eventName",
        "tournamentId": "$tournamentId",
        "playerdet": {
            $cond: [{
                $in: ['$userDet.userId', ['$playerIdA',"$playerIdB"]],
            }, "$userDet", false]
        }
    }
}, {
    "$match": {
        "playerdet": {
            $ne: false
        }
    }
}])
*/