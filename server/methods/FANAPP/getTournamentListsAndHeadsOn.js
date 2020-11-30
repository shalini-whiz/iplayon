import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

import { initDBS } from '../dbRequiredRole.js'

//get list of tournaments for given state
/*
{"stateId":"CrXhXZnM3BNtzzoJK"}
*/
Meteor.methods({
    "getListOfTournamentsForState": function(xData) {

        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TOURNAMENT_LIST_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
                var sDraws = new DrawsResults(xData)

                if(xData.participant==null || xData.participant == undefined){
                    xData.participant = false
                }

                var nullState = sDraws.nullUndefinedEmpty("stateId")
                
                if (nullState == "1") {
                    var checkState = sDraws.validateOnlyState()

                    if(checkState == "1"){
                        var allEve = []
                        var query = {}

                        var associationIdWRTStateId = sDraws.validateAssociationIdWRTStateId()
                        if (associationIdWRTStateId && typeof associationIdWRTStateId == "object") {
                            xData.eve = associationIdWRTStateId
                            query = {
                                //domainId: xData.stateId,
                                tournamentEvent: true,
                                eventOrganizer: {
                                    $in: xData.eve
                                }
                            }
                            
                            var upEvens = events.find(query).fetch()

                            var pastEve = pastEvents.find(query).fetch()

                            if (pastEve && pastEve.length && upEvens && upEvens.length) {
                                allEve = _.union(upEvens, pastEve)
                            } else if (upEvens && upEvens.length) {
                                allEve = upEvens
                            } else if (pastEve && pastEve.length) {
                                allEve = pastEve
                            }

                            if (allEve && allEve.length) {
                                res.data = allEve
                                res.message = TOURNAMENT_LIST_SUCCESS_MSG
                                res.status = SUCCESS_STATUS
                            }
                        } else {
                            res.message = associationIdWRTStateId
                        }
                    }else{
                        res.message = checkState
                    }
                    
                } else {
                    res.message = nullState
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

//get list of tournaments played by given player
/*
{"stateId":"CrXhXZnM3BNtzzoJK","eveType":"1","playerId":"MZRTYXoR9LWPeMmM5"}
*/
Meteor.methods({
    "getListOfTournamentsForStateAndPlayer": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TOURNAMENT_LIST_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
                var sDraws = new DrawsResults(xData)

                var nullState = sDraws.nullUndefinedEmpty("stateId")
                var nullType = sDraws.nullUndefinedEmpty("eveType")
                if (nullState == "1") {
                    var checkState = sDraws.validateOnlyState()
                    if(checkState=="1"){
                        if(nullType=="1"){
                            var scheckEveType = sDraws.checkEveType()
                            if(scheckEveType=="1"){
                                if(parseInt(xData.eveType)==1){
                                    var nullPlayerId = sDraws.nullUndefinedEmpty("playerId")
                                    if(nullPlayerId=="1"){
                                        var fetcEveDet = queryForGetTournamentsForPlayer(xData.playerId,parseInt(xData.eveType),xData.stateId)
                                        if(fetcEveDet && fetcEveDet.length){
                                            res.data = fetcEveDet
                                            res.message = TOURNAMENT_LIST_SUCCESS_MSG
                                            res.status = SUCCESS_STATUS
                                        }else{
                                            res.message = TOURNAMENT_LIST_FAIL_MSG
                                        }
                                    }else{
                                        res.message = nullPlayerId
                                    }
                                }else if(parseInt(xData.eveType)==2){
                                    var nullTeamId = sDraws.nullUndefinedEmpty("teamId")
                                    if(nullTeamId=="1"){
                                        var fetcEveDet = queryForGetTournamentsForPlayer(xData.teamId,parseInt(xData.eveType),xData.stateId)
                                        if(fetcEveDet && fetcEveDet.length){
                                            res.data = fetcEveDet
                                            res.message = TOURNAMENT_LIST_SUCCESS_MSG
                                            res.status = SUCCESS_STATUS
                                        }else{
                                            res.message = TOURNAMENT_LIST_FAIL_MSG
                                        }
                                    }else{
                                        res.message = nullTeamId
                                    }
                                }
                            }else{
                                res.message = scheckEveType
                            }
                        }else{
                            res.message = nullType
                        }
                    }else{
                        res.message = checkState
                    }

                } else {
                    res.message = nullState
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

//get results, player details,event list (players participated events) on click of event
/*
{"tournamentId":"gmGtr29etZmDGJuac","eventName":"Mini Cadet Boy's Singles","playerId":"MZRTYXoR9LWPeMmM5"}
*/

Meteor.methods({
    "getHeadsOnDetailsOfPlayerOfATournament": function(xData) {


        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": HEAD_ON_LIST_PLAYER_FAIL_MSG
        }
        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {

                var sDraws = new DrawsResults(xData)

                var nullTourn = sDraws.nullUndefinedEmpty("tournamentId")
                var nullPlayerId = sDraws.nullUndefinedEmpty("playerId")
                var nullEvent = sDraws.nullUndefinedEmpty("eventName")
                var nullTeamId = sDraws.nullUndefinedEmpty("teamId")

                var toSort = true



                if(xData.sortEvents == undefined || xData.sortEvents == null){
                    xData.sortEvents = toSort
                }

                if (nullTourn == "1") {
                    var db = ""
                    var evenVerified = false

                    if(nullEvent != "1"){
                        
                        var checkValidTourn = sDraws.checkTournament("events")
                        if (checkValidTourn == "1") {
                            db = "events"
                        } else {
                            var checkValidTourn = sDraws.checkTournament("pastEvents")
                            if (checkValidTourn == "1") {
                                db = "pastEvents"
                            } else {
                                res.message = TOURNAMENT_DET_INVALID_MSG
                            }
                        }

  

                        if(checkValidTourn=="1"){
                            var checkGetEven = sDraws.checkOneEventFind(db)
                            if (checkGetEven == "1") {
                                var checkGetEven = sDraws.checkOneEventFind(db,true)
                                if(checkGetEven && checkGetEven.eventName){
                                    xData.eventName = checkGetEven.eventName
                                    evenVerified = true
                                    nullEvent = "1"
                                }else{
                                    res.message = TOURNAMENT_DET_INVALID_MSG
                                }
                            } else {
                                res.message = TOURNAMENT_DET_INVALID_MSG
                            }
                        }
                    }

                    
                    if (nullEvent == "1") {
                        if (true) {

                            if(evenVerified==false){
                                var checkValidTourn = sDraws.checkTournamentEvent("events")
                                if (checkValidTourn == "1") {
                                    db = "events"
                                } else {
                                    var checkValidTourn = sDraws.checkTournamentEvent("pastEvents")
                                    if (checkValidTourn == "1") {
                                        db = "pastEvents"
                                    } else {
                                        res.message = TOURNAMENT_DET_INVALID_MSG
                                    }
                                }
                            }

                            if (db) {
                                var eveDet = global[db].findOne({
                                    tournamentId: xData.tournamentId,
                                    eventName: xData.eventName
                                })
                                if (eveDet && eveDet.projectType) {
                                    if (eveDet.projectType == 1) {
                                        if(nullPlayerId == "1"){
                                            var getDraws = []

                                            if(evenVerified==false){
                                                getDraws = queryForSingleEventsHeadsOn(xData.tournamentId, xData.eventName, "users", xData.playerId)
                                            }
                                            else if(evenVerified==true){
                                                getDraws = queryForSingleEventsHeadsOn(xData.tournamentId, false, "users", xData.playerId)
                                                if (getDraws && getDraws.length && getDraws[0] && getDraws[0].eventName){
                                                    xData.eventName = getDraws[0].eventName
                                                }
                                            }
                                            if (getDraws && getDraws.length) {
                                                res.status = SUCCESS_STATUS

                                                res.message = HEAD_ON_LIST_PLAYER_SUCCESS_MSG
                                                res.drawsData = getDraws
                                                var getEvents = queryForSingleTeamEventNamesHeadOn(xData.tournamentId,xData.playerId,1, xData.eventName,xData.sortEvents)
                                                if(getEvents || xData.sortEvents == false){
                                                    res.eventsList = getEvents
                                                    //get details of player
                                                    var getUserDetls = queryToFetchPlayerDetails(xData.playerId)
                                                    if(getUserDetls && typeof getUserDetls=="object"){
                                                        res.userDet = getUserDetls
                                                        res.tournamentsData = sDraws.checkTournament(db,true)
                                                    }
                                                }
                                            }else{
                                                res.message = HEAD_ON_LIST_PLAYER_FAIL_MSG
                                            }
                                        }else{
                                            res.message = nullPlayerId
                                        }
                                    } else if (eveDet.projectType == 2) {
                                        if(nullTeamId=="1"){
                                            var getDraws = queryForTeamEventsHeadsOn(xData.tournamentId, xData.eventName, "users", xData.teamId)
                                            if (getDraws && getDraws.length) {
                                                res.status = SUCCESS_STATUS
                                                res.message = HEAD_ON_LIST_PLAYER_SUCCESS_MSG
                                                res.drawsData = getDraws
                                                var getEvents = queryForSingleTeamEventNamesHeadOn(xData.tournamentId,xData.teamId,2, xData.eventName,xData.sortEvents)
                                                if(getEvents){
                                                    res.eventsList = getEvents
                                                    //get details of team
                                                }
                                            }else{
                                                res.message = HEAD_ON_LIST_PLAYER_FAIL_MSG
                                            }
                                        }else{
                                            res.message = nullTeamId
                                        }
                                    } else {
                                        res.message = TOURNAMENT_DET_INVALID_MSG
                                    }
                                } else {
                                    res.message = TOURNAMENT_DET_INVALID_MSG
                                }
                            } else {
                                res.message = TOURNAMENT_DET_INVALID_MSG
                            }
                        } 
                    } else {
                        res.message = nullEvent
                    }
                } else {
                    res.message = nullTourn
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }

            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "getPlayerDetailsForFanAPP":function(xData){
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_PLAYER_DET_FAIL_MSG
        }
        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sDraws = new DrawsResults(xData)
                var nullPlayerId = sDraws.nullUndefinedEmpty("playerId")

                if(nullPlayerId=="1"){
                    var getUserDetls = queryToFetchPlayerDetails(xData.playerId)
                    if(getUserDetls){
                        res.status = SUCCESS_STATUS
                        res.message = GET_PLAYER_DET_SUCCESS_MSG
                        res.data = getUserDetls
                    }
                }else{
                    res.message = nullPlayerId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

var queryToFetchPlayerDetails = function(playerId) {
    try {
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var indicesOfPlayers = initDBS("indicesOfPlayers")

        var userDet = Meteor.users.findOne({
            userId: playerId
        })
        var userDetDB;
        if (userDet && userDet.role && userDet.role.toLowerCase()) {
            for (var j = 0; j < indicesOfPlayers.length; j++) {
                userDetDB = global[dbsrequiredAll[j]].findOne({
                    "userId": playerId
                })

                if(userDetDB==undefined){
                    userDetDB = schoolPlayers.findOne({
                        "userId": playerId
                    }) 
                }

                if (userDetDB) {
                    if (userDetDB.state) {
                        userDetDB["affiliatedName"] = "Academy/Association: - "
                        var stateInfo = domains.findOne({
                            "_id": userDetDB.state
                        });
                        if (stateInfo)
                            userDetDB["stateName"] = stateInfo.domainName;
                    }
                    if (userDetDB.affiliatedTo) {
                        if (userDetDB.affiliatedTo == "academy" && userDetDB.clubNameId) {
                            var acaDetails = academyDetails.findOne({
                                "userId": userDetDB.clubNameId
                            });
                            if (acaDetails && acaDetails.clubName) {
                                userDetDB["affiliatedName"] = "Academy: " + acaDetails.clubName;

                                if (acaDetails.interestedDomainName &&
                                    acaDetails.interestedDomainName.length) {
                                    var stateInfo = domains.findOne({
                                        "_id": acaDetails.interestedDomainName[0]
                                    });
                                    if (stateInfo)
                                        userDetDB["stateName"] = stateInfo.domainName;
                                }
                            }
                        }

                        else if ((userDetDB.affiliatedTo == "stateAssociation" || userDetDB.affiliatedTo == "districtAssociation") && userDetDB.associationId) {
                            var assocDetails = associationDetails.findOne({
                                "userId": userDetDB.associationId
                            });
                            if (assocDetails && assocDetails.associationName) {
                                userDetDB["affiliatedName"] = "Association: " + assocDetails.associationName;

                                if (assocDetails.interestedDomainName &&
                                    assocDetails.interestedDomainName.length) {
                                    var stateInfo = domains.findOne({
                                        "_id": assocDetails.interestedDomainName[0]
                                    });
                                    if (stateInfo)
                                        userDetDB["stateName"] = stateInfo.domainName;
                                }
                            }
                        }
                    }

                    if (userDetDB.schoolId) {
                        userDetDB["affiliatedName"] = ""
                        var schoolDetailsfff = schoolDetails.findOne({
                            "userId": userDetDB.schoolId
                        });
                        if (schoolDetailsfff && schoolDetailsfff.schoolName)
                            userDetDB["affiliatedName"] = ""+ schoolDetailsfff.schoolName;
                    }
                    
                    if (userDetDB) {
                        if (userDetDB.dateOfBirth) {
                            //userDetDB.dateOfBirthString = moment(new Date(userDetDB.dateOfBirth)).format("DD MMM YYYY")
                        }
                        userDetDB.dateOfBirth = "-"
                        userDetDB.dateOfBirthString = "-"
                        return userDetDB
                    } else {
                        return INVALID_USER_MSG
                    }
                }
            }

        } else {
            return "playerId " + IS_INVALID_MSG
        }
    } catch (e) {
        res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}

var queryForSingleEventsHeadsOn = function(tournamentId, eventName, lookUPTable, playerId) {
    try {
        var query11 = {}
        var query = {}
        if(eventName){
            query = {
                tournamentId: tournamentId,
                eventName: eventName
            }
        }
        else if(eventName==false){
            var findFirst = MatchCollectionDB.aggregate([{
                $match: {
                    tournamentId: tournamentId
                }
            }, {
                $unwind: "$matchRecords"
            }, {
                $match: {
                    $or: [{
                        "matchRecords.playersID.playerAId": playerId
                    }, {
                        "matchRecords.playersID.playerBId": playerId
                    }]
                }
            },{$project:{"eventName":"$eventName"}}])

            if(findFirst && findFirst.length && findFirst[0] && findFirst[0].eventName){
                query = {
                    tournamentId: tournamentId,
                    eventName:findFirst[0].eventName
                }
            }else{
                query = {
                    "findOne":"asd"
                }
            }
        }

        var eveDet = MatchCollectionDB.aggregate([{
            $match:query
        }, {
            $unwind: "$matchRecords"
        }, {
            $match: {
                $or: [{
                    "matchRecords.playersID.playerAId": playerId
                }, {
                    "matchRecords.playersID.playerBId": playerId
                }]
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
                "playerNameA": "$usersDet.userName",
                "eventName": "$eventName"
            }
        }, {
            $lookup: {
                from: lookUPTable,
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
        },{$sort:{"matchNumber":-1}}])

        if (eveDet && eveDet.length) {
            return eveDet
        } else {
            return []
        }
    } catch (e) {
        var res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}

var queryForTeamEventsHeadsOn = function(tournamentId, eventName, lookUPTable, teamId) {
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

        var eveDet = teamMatchCollectionDB.aggregate([{
            $match: {
                tournamentId: tournamentId,
            }
        }, {
            $unwind: "$matchRecords"
        }, {
            $match: {
                $or: [{
                    "matchRecords.teamsID.teamAId": teamId
                }, {
                    "matchRecords.teamsID.teamBId": teamId
                }]
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

        if (eveDet && eveDet.length) {
            return eveDet
        } else {
            return []
        }
    } catch (e) {
        var res = CATCH_MSG + e
        if (e && e.toString()) {
            var res = CATCH_MSG + e.toString()
        }
        return res
    }
}

var queryForSingleTeamEventNamesHeadOn = function(tournamentId,playerId,type,sortAtFirstEve,sortEvent){
    try{
        var query1 = {}
        var query2 = {}
        var db = ""
        var lookup = "events"

        if(type==1){
            db = "MatchCollectionDB"

            query = {
                "$or": [{
                    "matchRecords.playersID.playerAId": playerId
                }, {
                    "matchRecords.playersID.playerBId": playerId
                }]
            }
        }else if(type==2){
            db = "teamMatchCollectionDB"

            query = {
                "$or": [{
                    "matchRecords.teamsID.teamAId": playerId
                }, {
                    "matchRecords.teamsID.teamBId": playerId
                }]
            }
        }
        


        var eveDets = events.findOne({
            "_id":tournamentId
        })

        

        if(eveDets){
            lookup = "events"
        }
        else{
            eveDets = pastEvents.findOne({
                "_id":tournamentId
            })
            if(eveDets){
                lookup = "pastEvents"
            }
        }


        var eveList ;

        if(type==1){
            eveList = MatchCollectionDB.aggregate([{
                $match: {
                    tournamentId: tournamentId,
                }
            }, {
                $unwind: "$matchRecords"
            }, {
                $match: query
            }, {
                $project: {
                    tournamentId: "$tournamentId",
                    eventName: "$eventName"
                }
            }, {
                $lookup: {
                    from: lookup,
                    localField: "tournamentId",
                    // name of users table field,
                    foreignField: "tournamentId",
                    as: "eventDet" // alias for userinfo table
                }
            }, {
                $unwind: {
                    "path": "$eventDet",
                }
            }, {
                $match: {
                    "eventDet.tournamentEvent": false,
                }
            }, {
                $project: {
                    "even.eventName": "$eventDet.eventName",
                    "even.tournamentId": "$eventDet.tournamentId",
                    "even.abbName": "$eventDet.abbName",
                    "even.eventNameSport": {
                        "$cond": {
                            if: {
                                "$eq": ["$eventDet.eventName", "$eventName"]
                            },
                            then: 1,
                            else: 0
                        }
                    },
                }
            }, {
                $match:{
                    "even.eventNameSport":1
                }
            },{
                $group: {
                    _id: 'null',
                    data: {
                        $addToSet: '$even'
                    }
                }
            }])

        } else if(type==2){
            eveList = teamMatchCollectionDB.aggregate([{
                $match: {
                    tournamentId: tournamentId,
                }
            }, {
                $unwind: "$matchRecords"
            }, {
                $match: query
            }, {
                $project: {
                    tournamentId: "$tournamentId",
                    eventName: "$eventName"
                }
            }, {
                $lookup: {
                    from: lookup,
                    localField: "tournamentId",
                    // name of users table field,
                    foreignField: "tournamentId",
                    as: "eventDet" // alias for userinfo table
                }
            }, {
                $unwind: {
                    "path": "$eventDet",
                    preserveNullAndEmptyArrays: false
                }
            }, {
                $match: {
                    "eventDet.tournamentEvent": false,
                    "eventDet.eventName": "$eventName"
                }
            }, {
                $project: {
                    "even.eventName": "$eventDet.eventName",
                    "even.tournamentId": "$eventDet.tournamentId",
                    "even.abbName": "$eventDet.abbName",
                    "even.eventNameSport": {
                        "$cond": {
                            if: {
                                "$eq": ["$eventDet.eventName", "$eventName"]
                            },
                            then: 1,
                            else: 0
                        }
                    },
                }
            }, {
                $match:{
                    "even.eventNameSport":1
                }
            },{
                $group: {
                    _id: 'null',
                    data: {
                        $addToSet: '$even'
                    }
                }
            }])
        }


        if(eveList && eveList.length && eveList[0]
         && eveList[0].data && eveList[0].data.length){

            if(sortAtFirstEve && sortEvent){
                var s1;
                var s2;

                s1 = eveList[0].data.filter(function( obj ) {
                    return obj.eventName !== sortAtFirstEve;
                });
                if(s1 && s1.length){
                    
                    s2 = eveList[0].data.filter(function( obj ) {
                        return obj.eventName == sortAtFirstEve;
                    });

                    if(s2 && s2.length){
                        var s3 = _.union(s2, s1)

                        if(s3 && s3.length){
                            return s3
                        }else{
                            return []
                        }
                    }else{
                        return []
                    }
                }else{
                    return eveList[0].data
                }
            }else{
                return []
            }
        }
        else{
            return []
        }
    }catch(e){
        var res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}

var queryForGetTournamentsForPlayer = function(playerId,type,state){
    try{
        var query1 = {}
        var query2 = {}
        var collection = "MatchCollectionDB"
        var db = ""
        var lookup = "events"
        var finalTIds = []
        var matcQuery = {
            /*"$or":[
                {
                    domainId:state
                },
                {
                    eventOrganizer:state
                }
            ],*/
            tournamentEvent: true
        }

        if(state=="1"){
            matcQuery = {
                tournamentEvent: true
            }
        }

        var pastTs = pastEvents.aggregate([{
            $match: matcQuery
        }, {
            $project: {
                "_id": 1
            }
        }, {
            $group: {
                "_id": null,
                "t": {
                    $push: "$_id"
                }
            }
        }])

        var prestTs = events.aggregate([{
            $match: matcQuery
        }, {
            $project: {
                "_id": 1
            }
        }, {
            $group: {
                "_id": null,
                "t": {
                    $push: "$_id"
                }
            }
        }])


        if(type==1){
            query1 = {
                "$or" : [
                    {
                        "matchRecords.playersID.playerAId" : playerId
                    },
                    {
                        "matchRecords.playersID.playerBId" : playerId
                    }
                ]
            }
            collection = "MatchCollectionDB"

        }else if(type==2){
            query1 = {
                "$or" : [
                    {
                        "matchRecords.teamsID.teamId" : playerId
                    },
                    {
                        "matchRecords.teamsID.teamBId" : playerId
                    }
                ]
            }
            collection = "teamMatchCollectionDB"
        }



        var presEveDet = []
        var pastEveDet = []

        if(prestTs && prestTs.length && 
            prestTs[0] && prestTs[0].t && type==1){
            presEveDet = queryForEventDetails(prestTs[0].t,"events",collection,query1,state)
        }
        if(pastTs && pastTs.length && 
            pastTs[0] && pastTs[0].t && type==1){
            pastEveDet = queryForEventDetails(pastTs[0].t,"pastEvents",collection,query1,state)
        }

        if(prestTs && prestTs.length && 
            prestTs[0] && prestTs[0].t && type==2){
            presEveDet = queryForEventDetailsTeam(prestTs[0].t,"events",collection,query1,state)
        }
        if(pastTs && pastTs.length && 
            pastTs[0] && pastTs[0].t && type==2){
            pastEveDet = queryForEventDetailsTeam(pastTs[0].t,"pastEvents",collection,query1,state)
        }

        if(presEveDet && presEveDet.length  && pastEveDet && pastEveDet.length){
            presEveDet = _.union(presEveDet, pastEveDet)
            return pastEveDet
        }
        else if(presEveDet && presEveDet.length){
            return presEveDet
        }
        else if(pastEveDet && pastEveDet.length){
            return pastEveDet
        }

     }catch(e){
        var res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}

var queryForEventDetails = function(tournIds,lookUp,collection,query,domainId){
    try{

        var matcQuery = {
            "eventDet.domainId": domainId,
            "eventDet.tournamentEvent": true
        }

        if(domainId=="1"){
            matcQuery = {
               "eventDet.tournamentEvent": true
            }
        }

        var s = MatchCollectionDB.aggregate([{
            $match: {
                tournamentId: {
                    $in: tournIds
                }
            }
        }, {
            $unwind: "$matchRecords"
        }, {
            $match: query
        }, {
            $project: {
                "tournamentId": 1
            }
        }, {
            $group: {
                "_id": "$tournamentId"
            }
        }, {
            $lookup: {
                from: lookUp,
                localField: "_id",
                // name of users table field,
                foreignField: "_id",
                as: "eventDet"
            }
        }, {
            $match: matcQuery
        }, {
            $unwind: "$eventDet"
        }, {
            $project: {
                "eventName": "$eventDet.eventName",
                "tournamentId": "$eventDet._id",
                "domainId": "$eventDet.domainId",
                "domainName": "$eventDet.domainName",
                "eventStartDate": "$eventDet.eventStartDate",
                "eventEndDate": "$eventDet.eventEndDate",
                "_id": "$_id",
                "venueAddress":"$eventDet.venueAddress"
            }
        }])
        if(s && s.length){
            return s
        }
        else{
            return []
        }
    }catch(e){
        var res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}

var queryForEventDetailsTeam = function(tournIds,lookUp,collection,query,domainId){
    try{

        var matcQuery = {
            "eventDet.domainId": domainId,
            "eventDet.tournamentEvent": true
        }

        if(domainId=="1"){
            matcQuery = {
               "eventDet.tournamentEvent": true
            }
        }

        var s = teamMatchCollectionDB.aggregate([{
            $match: {
                tournamentId: {
                    $in: tournIds
                }
            }
        }, {
            $unwind: "$matchRecords"
        }, {
            $match: query
        }, {
            $project: {
                "tournamentId": 1
            }
        }, {
            $group: {
                "_id": "$tournamentId"
            }
        }, {
            $lookup: {
                from: lookUp,
                localField: "_id",
                // name of users table field,
                foreignField: "_id",
                as: "eventDet"
            }
        }, {
            $match:matcQuery
        }, {
            $unwind: "$eventDet"
        }, {
            $project: {
                "eventName": "$eventDet.eventName",
                "tournamentId": "$eventDet._id",
                "domainId": "$eventDet.domainId",
                "domainName": "$eventDet.domainName",
                "eventStartDate": "$eventDet.eventStartDate",
                "eventEndDate": "$eventDet.eventEndDate",
                "_id": "$_id"
            }
        }])
        if(s && s.length){
            return s
        }
        else{
            return []
        }
    }catch(e){
        var res = CATCH_MSG + e
        if (e && e.toString()) {
            res = CATCH_MSG + e.toString()
        }
        return res
    }
}