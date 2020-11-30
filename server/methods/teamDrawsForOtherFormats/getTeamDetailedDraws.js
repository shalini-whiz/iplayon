import {
    initDBS
}
from '../dbRequiredRole.js'

import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({
    "getTeamDetailedDrawsForToss": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_GET_TEAMS_DETAILED_SCORES_FAIL_MSG
        }
        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
              
                var sTeams = new TeamsFormats(xData)
                var nullTournId = sTeams.nullUndefinedEmpty("tournamentId")
                var nulleventName = sTeams.nullUndefinedEmpty("eventName")
                var nullmatchNum = sTeams.nullUndefinedEmpty("matchNumber")
                if (nullTournId == "1") {
                    if (nulleventName == "1") {
                        if (nullmatchNum == "1") {
                            var checkValidMathcNum = sTeams.validateNumb("matchNumber")
                            if (checkValidMathcNum == "1") {
                                var checkValidTourn = sTeams.checkValidTournamentIDEvent()
                                if (checkValidTourn == "1") {
                                    console.log("djfghf !!")
                                    var getDetails = teamDetailedScoresOthrFormat.aggregate([{
                                        $match: {
                                            tournamentId: xData.tournamentId,
                                            eventName: xData.eventName
                                        }
                                    }, {
                                        $unwind: "$teamDetScore"
                                    }, {
                                        $match: {
                                            "teamDetScore.matchNumber": parseInt(xData.matchNumber)
                                        }
                                    }])
                                    console.log(JSON.stringify(getDetails))
                                    if (getDetails && getDetails.length && getDetails[0].teamDetScore) {
                                        res.status = SUCCESS_STATUS
                                        res.message = TEAMS_OTR_GET_TEAMS_DETAILED_SCORES_SUCCESS_MSG
                                        res.data = getDetails[0].teamDetScore
                                    }
                                } else {
                                    res.message = checkValidTourn
                                }
                            } else {
                                res.message = checkValidMathcNum
                            }
                        } else {
                            res.message = nullmatchNum
                        }
                    } else {
                        res.message = nulleventName
                    }
                } else {
                    res.message = nullTournId
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
    "getTeamDetailedDrawsForTossWM": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_GET_TEAMS_DETAILED_SCORES_FAIL_MSG
        }
        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
              
                var sTeams = new TeamsFormats(xData)
                var nullTournId = sTeams.nullUndefinedEmpty("tournamentId")
                var nulleventName = sTeams.nullUndefinedEmpty("eventName")
                if (nullTournId == "1") {
                    if (nulleventName == "1") {
                        if (true) {
                            if (true) {
                                var checkValidTourn = sTeams.checkValidTournamentIDEvent()
                                if (checkValidTourn == "1") {
                                    console.log("djfghf !!")
                                    var getDetails = teamDetailedScoresOthrFormat.aggregate([{
                                        $match: {
                                            tournamentId: xData.tournamentId,
                                            eventName: xData.eventName
                                        }
                                    }, {
                                        $unwind: "$teamDetScore"
                                    }])
                                    console.log(JSON.stringify(getDetails))
                                    if (getDetails && getDetails.length && getDetails[0].teamDetScore) {
                                        res.status = SUCCESS_STATUS
                                        res.message = TEAMS_OTR_GET_TEAMS_DETAILED_SCORES_SUCCESS_MSG
                                        res.data = getDetails[0].teamDetScore
                                    }
                                } else {
                                    res.message = checkValidTourn
                                }
                            } else {
                                res.message = checkValidMathcNum
                            }
                        } else {
                            res.message = nullmatchNum
                        }
                    } else {
                        res.message = nulleventName
                    }
                } else {
                    res.message = nullTournId
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
    "getPlayerDetailsForGivenPlayerId": function(xData) {
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
                var sTeams = new TeamsFormats(xData)
                var nullUserId = sTeams.nullUndefinedEmpty("playerId")
                if (nullUserId == "1") {
                    var checkValidPlayer = sTeams.checkForValidPlayerId("playerId")
                    if (checkValidPlayer == "1") {
                        var getValidPlayerDet = sTeams.checkForValidPlayerId("playerId", true)
                        if (getValidPlayerDet && getValidPlayerDet.userName) {
                            res.status = SUCCESS_STATUS
                            res.message = GET_PLAYER_DET_SUCCESS_MSG
                            res.data = getValidPlayerDet
                        }
                    } else {
                        res.message = checkValidPlayer
                    }
                } else {
                    res.message = nullUserId
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
    "FindScoresFromLengthOfMatch": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_SCORES_FROM_TEAM_DETAILED_DRAWS_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            var dataToRet = []
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nullSpecifications = sTeams.nullUndefined("specifications")
                if (nullSpecifications == "1") {
                    var checkTypeSpec = sTeams.checkTeamSpecifications()
                    if (checkTypeSpec == "1") {
                      
                        for (var i = 0; i < xData.specifications.length; i++) {
                            var spec = xData.specifications[i]
                            if (xData.specifications[i].setScoresA &&
                                xData.specifications[i].setScoresB) {
                                var callMatch = await Meteor.call("findTheMatchScore", xData.specifications[i].setScoresA, xData.specifications[i].setScoresB, "1", "1", "1", "1")
                                if (callMatch) {
                                    callMatch.no = xData.specifications[i].no
                                    dataToRet.push(callMatch)
                                }
                            }
                        }

                        if (dataToRet.length) {
                            var aSetScores = []
                            var bSetScores = []
                            for (var aVAluesI = 0; aVAluesI < dataToRet.length; aVAluesI++) {
                                aSetScores.push(dataToRet[aVAluesI].AValue)
                                bSetScores.push(dataToRet[aVAluesI].BValue)
                            }
                         
                            if (aSetScores.length < 7) {
                                var lend = 0
                                lend = 7 - aSetScores.length
                                if (lend) {
                                    aSetScores = aSetScores.concat(Array.apply(null, Array(lend)).map(Number.prototype.valueOf, 0))
                                }
                            }
                            if (bSetScores.length < 7) {
                                var lend = 0
                                lend = 7 - bSetScores.length
                                if (lend) {
                                    bSetScores = bSetScores.concat(Array.apply(null, Array(lend)).map(Number.prototype.valueOf, 0))
                                }
                            }

                            var dataScores = {
                                teamScoreSetA: aSetScores,
                                teamScoreSetB: bSetScores
                            }

                            res.data = dataScores
                            res.status = SUCCESS_STATUS
                            res.message = GET_SCORES_FROM_TEAM_DETAILED_DRAWS_SUCCESS_MSG
                        }

                    } else {
                        res.message = checkTypeSpec
                    }
                } else {
                    res.message = nullSpecifications
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
    "getDetailsOfEventOrganizer": function(xData) {

        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_GET_ORG_DETAILS_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nullTournId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullUserId = sTeams.nullUndefinedEmpty("userId")
                if (nullTournId == "1") {
                    var checkValidTourn = sTeams.checkValidTournamentID()
                    if (checkValidTourn == "1") {
                        if (nullUserId == "1") {
                            var getTourndet = sTeams.checkValidTournamentID(true)
                         
                            if (getTourndet) {
                                if (xData.userId == getTourndet.eventOrganizer) {
                                    res.status = SUCCESS_STATUS
                                    res.data = getTourndet
                                }
                            } else {
                                res.message = getTourndet
                            }
                        } else {
                            res.message = nullUserId
                        }
                    } else {
                        res.message = checkValidTourn
                    }
                } else {
                    res.message = nullTournId
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
    "getTeamDetailedDrawsForOtherFormats": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_GET_DETAILS_PRINT_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nullmatchNum = sTeams.nullUndefinedEmpty("matchNumber")
                var nullroundNum = sTeams.nullUndefinedEmpty("roundNumber")
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                if (nulltournamentId == "1") {
                    var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                    if (nullEventName == "1") {
                        if (nullroundNum == "1") {
                            var roundNumValid = sTeams.validateNumb("roundNumber")
                            if (roundNumValid == "1") {
                                if (nullmatchNum == "1") {
                                    var matchNumValid = sTeams.validateNumb("matchNumber")
                                    if (matchNumValid == "1") {
                                        var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                                        if (checkValidTournEve == "1") {
                                            var lookUPTable = "users"
                                            var lookUPTable2 = "schoolTeams"

                                            var dbsrequired = ["userDetailsTT", "playerTeams"]

                                            var userDetailsTT = "userDetailsTT"
                                            var playerTeams = "playerTeams"
                                            var considerTeamEventBool = null
                                            var tournamentFind = events.findOne({
                                                "_id": xData.tournamentId
                                            })

                                            if (tournamentFind == undefined || tournamentFind == null) {
                                                tournamentFind = pastEvents.findOne({
                                                    "_id": xData.tournamentId
                                                })
                                            }

                                            var resDB = await Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
                                            try {
                                                if (resDB) {
                                                    if (resDB.changeDb && resDB.changeDb == true) {
                                                        if (resDB.changedDbNames.length != 0) {
                                                            userDetailsTT = resDB.changedDbNames[0]
                                                            playerTeams = resDB.changedDbNames[1]
                                                            considerTeamEventBool = true
                                                            var playersDB = initDBS("playersDB")
                                                            if (_.contains(playersDB, userDetailsTT)) {
                                                                considerTeamEventBool = null
                                                            }
                                                        }
                                                    }
                                                }
                                            } catch (e) {
                                            }

                                            if (playerTeams) {
                                                lookUPTable2 = playerTeams
                                            }

                                            var userTable = lookUPTable

                                            var getTeamScoresAB = teamMatchCollectionDB.aggregate([{
                                                $match: {
                                                    "tournamentId": xData.tournamentId,
                                                    "eventName": xData.eventName
                                                }
                                            },{
                                                $unwind:{
                                                    "path":"$matchRecords"
                                                }
                                            },{$match:{
                                                "matchRecords.matchNumber": parseInt(xData.matchNumber)
                                            }},{
                                                $project:{
                                                    matchNumber:"$matchRecords.matchNumber",
                                                    roundNumber:"$matchRecords.roundNumber",
                                                    teamMatchType:"$matchRecords.status",
                                                    roundName:"$matchRecords.roundName",
                                                    finalTeamWinner:"$matchRecords.winnerID",
                                                    "teamAId":"$matchRecords.teamsID.teamAId",
                                                    "teamBId":"$matchRecords.teamsID.teamBId",
                                                    "scoresA":"$matchRecords.scores.setScoresA",
                                                    "scoresB":"$matchRecords.scores.setScoresB"
                                                }
                                            }])

                                            var teamBName = ""
                                            var teamAName = ""

                                            if(getTeamScoresAB && getTeamScoresAB.length){
                                                if(getTeamScoresAB[0].teamAId){
                                                    var schDet = global[lookUPTable2].findOne({
                                                        '_id':getTeamScoresAB[0].teamAId
                                                    })
                                                    
                                                    if(schDet && schDet.teamName){
                                                        teamAName = schDet.teamName
                                                    }
                                                    if(schDet && schDet.schoolId){
                                                        var schooADet = schoolDetails.findOne({
                                                            "userId":schDet.schoolId
                                                        })
                                                        if(schooADet && schooADet.interestedDomainName && schooADet.interestedDomainName[0]){
                                                            var domNam = domains.findOne({"_id":schooADet.interestedDomainName[0]})
                                                            if(domNam && domNam.domainName){
                                                                teamAName = teamAName + ", "+domNam.domainName
                                                            }
                                                        }
                                                    }
                                                }
                                                if(getTeamScoresAB[0].teamBId){
                                                    var schDet = global[lookUPTable2].findOne({
                                                        '_id':getTeamScoresAB[0].teamBId
                                                    })
                                                    
                                                    if(schDet && schDet.teamName){
                                                        teamBName = schDet.teamName
                                                    }
                                                    if(schDet && schDet.schoolId){
                                                        var schooADet = schoolDetails.findOne({
                                                            "userId":schDet.schoolId
                                                        })
                                                        if(schooADet && schooADet.interestedDomainName && schooADet.interestedDomainName[0]){
                                                            var domNam = domains.findOne({"_id":schooADet.interestedDomainName[0]})
                                                            if(domNam && domNam.domainName){
                                                                teamBName = teamBName + ", "+domNam.domainName
                                                            }
                                                        }
                                                    }
                                                }

                                                getTeamScoresAB[0].teamAName = teamAName
                                                getTeamScoresAB[0].teamBName = teamBName
                                                getTeamScoresAB[0].teamAID = getTeamScoresAB[0].teamAId
                                                getTeamScoresAB[0].teamBID = getTeamScoresAB[0].teamBId
                                                res["teamScoresAB"] = getTeamScoresAB[0]
                                            }

                                            var getTeamDetailedDrawsData = teamDetailedScoresOthrFormat.aggregate([{
                                                $match: {
                                                    "tournamentId": xData.tournamentId,
                                                    "eventName": xData.eventName
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$teamDetScore"
                                                }
                                            }, {
                                                "$match": {
                                                    "teamDetScore.matchNumber": parseInt(xData.matchNumber)
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$teamDetScore"
                                                }
                                            }, {
                                                $project: {
                                                    "teamFormatId": "$orgTeamFormatId",
                                                    "specifications": "$teamDetScore.specifications",
                                                    "teamAID": "$teamDetScore.teamAID",
                                                    "teamBID": "$teamDetScore.teamBID",
                                                    "teamMatchType": "$teamDetScore.teamMatchType",
                                                    "finalTeamWinner": "$teamDetScore.finalTeamWinner"
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$specifications"
                                                }
                                            }, 
                                            {$match:{
                                                "specifications.matchType":{$nin:["notPlayed"]}
                                            }},
                                            {
                                                $lookup: {
                                                    from: lookUPTable,
                                                    localField: "specifications.playerAId",
                                                    // name of users table field,
                                                    foreignField: "userId",
                                                    as: "usersDetA" // alias for userinfo table
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$usersDetA",
                                                    "preserveNullAndEmptyArrays": true
                                                }
                                            }, {
                                                $addFields: {
                                                    "specifications.playerAName": "$usersDetA.userName"
                                                }
                                            }, {
                                                $lookup: {
                                                    from: lookUPTable,
                                                    localField: "specifications.playerBId",
                                                    // name of users table field,
                                                    foreignField: "userId",
                                                    as: "usersDetB" // alias for userinfo table
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$usersDetB",
                                                    "preserveNullAndEmptyArrays": true
                                                }
                                            }, {
                                                $addFields: {
                                                    "specifications.playerBName": "$usersDetB.userName"
                                                }
                                            }, {
                                                $lookup: {
                                                    from: lookUPTable,
                                                    localField: "specifications.playerA1Id",
                                                    // name of users table field,
                                                    foreignField: "userId",
                                                    as: "usersDetC" // alias for userinfo table
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$usersDetC",
                                                    "preserveNullAndEmptyArrays": true
                                                }
                                            }, {
                                                $addFields: {
                                                    "specifications.playerA1Name": "$usersDetC.userName"
                                                }
                                            }, {
                                                $lookup: {
                                                    from: lookUPTable,
                                                    localField: "specifications.playerA2Id",
                                                    // name of users table field,
                                                    foreignField: "userId",
                                                    as: "usersDetD" // alias for userinfo table
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$usersDetD",
                                                    "preserveNullAndEmptyArrays": true
                                                }
                                            }, {
                                                $addFields: {
                                                    "specifications.playerA2Name": "$usersDetD.userName"
                                                }
                                            }, {
                                                $lookup: {
                                                    from: lookUPTable,
                                                    localField: "specifications.playerB1Id",
                                                    // name of users table field,
                                                    foreignField: "userId",
                                                    as: "usersDetE" // alias for userinfo table
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$usersDetE",
                                                    "preserveNullAndEmptyArrays": true
                                                }
                                            }, {
                                                $addFields: {
                                                    "specifications.playerB1Name": "$usersDetE.userName"
                                                }
                                            }, {
                                                $lookup: {
                                                    from: lookUPTable,
                                                    localField: "specifications.playerB2Id",
                                                    // name of users table field,
                                                    foreignField: "userId",
                                                    as: "usersDetF" // alias for userinfo table
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$usersDetF",
                                                    "preserveNullAndEmptyArrays": true
                                                }
                                            }, {
                                                $addFields: {
                                                    "specifications.playerB2Name": "$usersDetF.userName"
                                                }
                                            }, {
                                                $project: {
                                                    "teamFormatId": "$teamFormatId",
                                                    "specifications": "$specifications",
                                                    "teamAID": "$teamAID",
                                                    "teamBID": "$teamBID",
                                                    "teamMatchType": "$teamMatchType",
                                                    "finalTeamWinner": "$finalTeamWinner"
                                                }
                                            }, {
                                                $lookup: {
                                                    from: lookUPTable2,
                                                    localField: "teamAID",
                                                    // name of users table field,
                                                    foreignField: "_id",
                                                    as: "teamADet" // alias for userinfo table
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$teamADet",
                                                    "preserveNullAndEmptyArrays": true
                                                }
                                            }, {
                                                $project: {
                                                    "teamFormatId": "$teamFormatId",
                                                    "specifications": "$specifications",
                                                    "teamAID": "$teamAID",
                                                    "teamBID": "$teamBID",
                                                    "teamMatchType": "$teamMatchType",
                                                    "finalTeamWinner": "$finalTeamWinner",
                                                    "teamAName": "$teamADet.teamName"
                                                }
                                            }, {
                                                $lookup: {
                                                    from: lookUPTable2,
                                                    localField: "teamBID",
                                                    // name of users table field,
                                                    foreignField: "_id",
                                                    as: "teamBDet" // alias for userinfo table
                                                }
                                            }, {
                                                $unwind: {
                                                    "path": "$teamBDet",
                                                    "preserveNullAndEmptyArrays": true
                                                }
                                            }, {
                                                $project: {
                                                    "teamFormatId": "$teamFormatId",
                                                    "specifications": "$specifications",
                                                    "teamAID": "$teamAID",
                                                    "teamBID": "$teamBID",
                                                    "teamMatchType": "$teamMatchType",
                                                    "finalTeamWinner": "$finalTeamWinner",
                                                    "teamAName": "$teamAName",
                                                    "teamBName": "$teamBDet.teamName"
                                                }
                                            }, {
                                                $group: {
                                                    "_id": "$teamFormatId",
                                                    "teamFormatId": {
                                                        "$first": "$teamFormatId"
                                                    },
                                                    "teamAID": {
                                                        "$first": "$teamAID"
                                                    },
                                                    "teamBID": {
                                                        "$first": "$teamBID"
                                                    },
                                                    "teamMatchType": {
                                                        "$first": "$teamMatchType"
                                                    },
                                                    "finalTeamWinner": {
                                                        "$first": "$finalTeamWinner"
                                                    },
                                                    "teamAName": {
                                                        "$first": "$teamAName"
                                                    },
                                                    "teamBName": {
                                                        "$first": "$teamBName"
                                                    },
                                                    "specifications": {
                                                        $push: "$specifications"
                                                    },
                                                }
                                            }])


                                            res.tournamentData = sTeams.checkValidTournamentID(true)

                                            if (getTeamDetailedDrawsData && getTeamDetailedDrawsData.length &&
                                                getTeamDetailedDrawsData[0]) {
                                                res.status = SUCCESS_STATUS
                                                res.data = getTeamDetailedDrawsData[0]
                                                res.message = TEAMS_OTR_GET_DETAILS_PRINT_SUCCESS_MSG
                                            } else {
                                                //check it is from old teams format 
                                                var findFromTeamDetScore = teamDetailedScores.findOne({
                                                    "tournamentId": xData.tournamentId,
                                                    "eventName": xData.eventName
                                                })
                                                if (findFromTeamDetScore) {
                                                    var getTeamDetailedDrawsData = teamDetailedScores.aggregate([{
                                                        $match: {
                                                            tournamentId: xData.tournamentId,
                                                            eventName: xData.eventName
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$teamDetScore",
                                                        }
                                                    }, {
                                                        $match: {
                                                            "teamDetScore.matchNumber": parseInt(xData.matchNumber)
                                                        }
                                                    }, {
                                                        $project: {
                                                            "teamAID": "$teamDetScore.teamAID",
                                                            "teamBID": "$teamDetScore.teamBID",
                                                            "teamMatchType": "$teamDetScore.teamMatchType",
                                                            "finalTeamWinner": "$teamDetScore.finalTeamWinner",
                                                            "matchAVsX": "$teamDetScore.matchAVSX",
                                                            "matchBVsY": "$teamDetScore.matchBVsY",
                                                            "matchBVsX": "$teamDetScore.matchBVsX",
                                                            "matchAVsY": "$teamDetScore.matchAVsY",
                                                            "matchDoubles": "$teamDetScore.matchDoubles",
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: lookUPTable2,
                                                            localField: "teamAID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "teamDetA" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$teamDetA",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $project: {
                                                            "teamAID": "$teamAID",
                                                            "teamBID": "$teamBID",
                                                            "teamMatchType": "$teamMatchType",
                                                            "finalTeamWinner": "$finalTeamWinner",
                                                            "matchAVsX": "$matchAVsX",
                                                            "matchBVsY": "$matchBVsY",
                                                            "matchBVsX": "$matchBVsX",
                                                            "matchAVsY": "$matchAVsY",
                                                            "matchDoubles": "$matchDoubles",
                                                            "teamAName": "$teamDetA.teamName"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: lookUPTable2,
                                                            localField: "teamBID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "teamDetB" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$teamDetB",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $project: {
                                                            "teamAID": "$teamAID",
                                                            "teamBID": "$teamBID",
                                                            "teamMatchType": "$teamMatchType",
                                                            "finalTeamWinner": "$finalTeamWinner",
                                                            "matchAVsX": "$matchAVsX",
                                                            "matchBVsY": "$matchBVsY",
                                                            "matchBVsX": "$matchBVsX",
                                                            "matchAVsY": "$matchAVsY",
                                                            "matchDoubles": "$matchDoubles",
                                                            "teamAName": "$teamAName",
                                                            "teamBName": "$teamDetB.teamName"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchAVsX.playerAID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerA" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerA",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchAVsX.playerAName": "$usersDetPlayerA.userName",
                                                            "matchAVsX.matchProjectType": "1",
                                                            "matchAVsX.no": 1,
                                                            "matchAVsX.label": "AvsX",
                                                            "matchAVsX.displayLabel": "A vs X",
                                                            "matchAVsX.order": 1,
                                                            "matchAVsX.playerAId":"$matchAVsX.playerAID",
                                                            "matchAVsX.playerA1Id": "1",
                                                            "matchAVsX.playerA2Id": "1",
                                                            "matchAVsX.playerB1Id": "1",
                                                            "matchAVsX.playerB2Id": "1",
                                                            "matchAVsX.winnerD1PlayerId": "1",
                                                            "matchAVsX.winnerD2PlayerId": "1"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchAVsX.playerBID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerB" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerB",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchAVsX.playerBName": "$usersDetPlayerB.userName",
                                                            "matchAVsX.playerBId":"$matchAVsX.playerBID"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchBVsY.playerAID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerA1" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerA1",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchBVsY.playerAName": "$usersDetPlayerA1.userName",
                                                            "matchBVsY.matchProjectType": "1",
                                                            "matchBVsY.no": 2,
                                                            "matchBVsY.label": "BvsY",
                                                            "matchBVsY.displayLabel": "B vs Y",
                                                            "matchBVsY.order": 2,
                                                            "matchBVsY.playerA1Id": "1",
                                                            "matchBVsY.playerA2Id": "1",
                                                            "matchBVsY.playerB1Id": "1",
                                                            "matchBVsY.playerB2Id": "1",
                                                            "matchBVsY.winnerD1PlayerId": "1",
                                                            "matchBVsY.winnerD2PlayerId": "1",
                                                            "matchBVsY.playerAId":"$matchBVsY.playerAID"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchBVsY.playerBID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerB1" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerB1",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchBVsY.playerBName": "$usersDetPlayerB1.userName",
                                                            "matchBVsY.playerBId":"$matchBVsY.playerBID"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchBVsX.playerAID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerA2" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerA2",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchBVsX.playerAName": "$usersDetPlayerA2.userName",
                                                            "matchBVsX.matchProjectType": "1",
                                                            "matchBVsX.no": 4,
                                                            "matchBVsX.label": "BvsX",
                                                            "matchBVsX.displayLabel": "B vs X",
                                                            "matchBVsX.order": 4,
                                                            "matchBVsX.playerA1Id": "1",
                                                            "matchBVsX.playerA2Id": "1",
                                                            "matchBVsX.playerB1Id": "1",
                                                            "matchBVsX.playerB2Id": "1",
                                                            "matchBVsX.winnerD1PlayerId": "1",
                                                            "matchBVsX.winnerD2PlayerId": "1",
                                                            "matchBVsX.playerAId":"$matchBVsX.playerAID"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchBVsX.playerBID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerB2" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerB2",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchBVsX.playerBName": "$usersDetPlayerB2.userName",
                                                            "matchBVsX.playerBId":"$matchBVsX.playerBID"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchAVsY.playerAID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerA3" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerA3",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchAVsY.playerAName": "$usersDetPlayerA3.userName",
                                                            "matchAVsY.matchProjectType": "1",
                                                            "matchAVsY.no": 5,
                                                            "matchAVsY.label": "AvsY",
                                                            "matchAVsY.displayLabel": "A vs Y",
                                                            "matchAVsY.order": 4,
                                                            "matchAVsY.playerA1Id": "1",
                                                            "matchAVsY.playerA2Id": "1",
                                                            "matchAVsY.playerB1Id": "1",
                                                            "matchAVsY.playerB2Id": "1",
                                                            "matchAVsY.winnerD1PlayerId": "1",
                                                            "matchAVsY.winnerD2PlayerId": "1",
                                                            "matchAVsY.playerAId":"$matchAVsY.playerAID"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchAVsY.playerBID",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerB3" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerB3",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchAVsY.playerBName": "$usersDetPlayerB3.userName",
                                                            "matchAVsY.playerBId":"$matchAVsY.playerBID"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchDoubles.teamAD1PlayerId",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerA4" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerA4",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchDoubles.playerA1Name": "$usersDetPlayerA4.userName",
                                                            "matchDoubles.matchProjectType": "2",
                                                            "matchDoubles.no": 3,
                                                            "matchDoubles.label": "Doubles",
                                                            "matchDoubles.displayLabel": "Doubles",
                                                            "matchDoubles.order": 3,
                                                            "matchDoubles.playerAId": "1",
                                                            "matchDoubles.playerBId": "1",
                                                            "matchDoubles.winnerIdPlayer": "1",
                                                            "matchDoubles.playerA1Id": "$matchDoubles.teamAD1PlayerId",
                                                            "matchDoubles.playerA2Id": "$matchDoubles.teamAD2PlayerId",
                                                            "matchDoubles.playerB1Id": "$matchDoubles.teamBD1PlayerId",
                                                            "matchDoubles.playerB2Id": "$matchDoubles.teamBD2PlayerId",
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchDoubles.teamAD2PlayerId",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerA5" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerA5",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchDoubles.playerA2Name": "$usersDetPlayerA5.userName",
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchDoubles.teamBD1PlayerId",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerB4" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerB4",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchDoubles.playerB1Name": "$usersDetPlayerB4.userName",
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from: userTable,
                                                            localField: "matchDoubles.teamBD2PlayerId",
                                                            // name of users table field,
                                                            foreignField: "_id",
                                                            as: "usersDetPlayerB5" // alias for userinfo table
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            "path": "$usersDetPlayerB5",
                                                            "preserveNullAndEmptyArrays":true
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "matchDoubles.playerB2Name": "$usersDetPlayerB5.userName",
                                                        }
                                                    }, {
                                                        $project: {
                                                            "teamAID": "$teamAID",
                                                            "teamBID": "$teamBID",
                                                            "teamMatchType": "$teamMatchType",
                                                            "finalTeamWinner": "$finalTeamWinner",
                                                            "matchAVsX": "$matchAVsX",
                                                            "matchBVsY": "$matchBVsY",
                                                            "matchBVsX": "$matchBVsX",
                                                            "matchAVsY": "$matchAVsY",
                                                            "matchDoubles": "$matchDoubles",
                                                            "teamAName": "$teamAName",
                                                            "teamBName": "$teamBName"
                                                        }
                                                    }, {
                                                        $addFields: {
                                                            "specifications": ["$matchAVsX", "$matchBVsY", "$matchDoubles", "$matchBVsX", "$matchAVsY"]
                                                        }
                                                    }, {
                                                        $project: {
                                                            "teamAID": "$teamAID",
                                                            "teamBID": "$teamBID",
                                                            "teamMatchType": "$teamMatchType",
                                                            "finalTeamWinner": "$finalTeamWinner",
                                                            "teamAName": "$teamAName",
                                                            "teamBName": "$teamBName",
                                                            "specifications": "$specifications"
                                                        }
                                                    }])
                                                    if (getTeamDetailedDrawsData && getTeamDetailedDrawsData.length && 
                                                        getTeamDetailedDrawsData[0]) {
                                                        res.status = SUCCESS_STATUS
                                                        res.data = getTeamDetailedDrawsData[0]
                                                        res.message = TEAMS_OTR_GET_DETAILS_PRINT_SUCCESS_MSG
                                                    }
                                                }
                                            }
                                        } else {
                                            res.message = checkValidTournEve
                                        }
                                    } else {
                                        res.message = matchNumValid
                                    }
                                } else {
                                    res.message = nullmatchNum
                                }
                            } else {
                                res.message = roundNumValid
                            }
                        } else {
                            res.message = nullroundNum
                        }
                    } else {
                        res.message = nulleventName
                    }
                } else {
                    res.message = nulltournamentId
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


/*
db.teamDetailedScores.aggregate([{
    $match: {
        tournamentId: xData.tournamentId,
        eventName: xData.eventName
    }
}, {
    $unwind: {
        "path": "$teamDetScore"
    }
}, {
    $match: {
        "teamDetScore.roundNumber": parseInt(xData.roundNumber),
        "teamDetScore.matchNumber": parseInt(xData.matchNumber)
    }
}, {
    $project: {
        "teamAID": "$teamDetScore.teamAID",
        "teamBID": "$teamDetScore.teamBID",
        "teamMatchType": "$teamDetScore.teamMatchType",
        "finalTeamWinner": "$teamDetScore.finalTeamWinner",
        "matchAVsX": "$teamDetScore.matchAVSX",
        "matchBVsY": "$teamDetScore.matchBVsY",
        "matchBVsX": "$teamDetScore.matchBVsX",
        "matchAVsY": "$teamDetScore.matchAVsY",
        "matchDoubles": "$teamDetScore.matchDoubles",
    }
}, {
    $lookup: {
        from: lookUPTable,
        localField: "teamAID",
        // name of users table field,
        foreignField: "_id",
        as: "teamDetA" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$teamDetA"
    }
}, {
    $project: {
        "teamAID": "$teamAID",
        "teamBID": "$teamBID",
        "teamMatchType": "$teamMatchType",
        "finalTeamWinner": "$finalTeamWinner",
        "matchAVsX": "$matchAVsX",
        "matchBVsY": "$matchBVsY",
        "matchBVsX": "$matchBVsX",
        "matchAVsY": "$matchAVsY",
        "matchDoubles": "$matchDoubles",
        "teamAName": "$teamDetA.teamName"
    }
}, {
    $lookup: {
        from: lookUPTable,
        localField: "teamBID",
        // name of users table field,
        foreignField: "_id",
        as: "teamDetB" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$teamDetB"
    }
}, {
    $project: {
        "teamAID": "$teamAID",
        "teamBID": "$teamBID",
        "teamMatchType": "$teamMatchType",
        "finalTeamWinner": "$finalTeamWinner",
        "matchAVsX": "$matchAVsX",
        "matchBVsY": "$matchBVsY",
        "matchBVsX": "$matchBVsX",
        "matchAVsY": "$matchAVsY",
        "matchDoubles": "$matchDoubles",
        "teamAName": "$teamAName",
        "teamBName": "$teamDetB.teamName"
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchAVsX.playerAID",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerA" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerA"
    }
}, {
    $addFields: {
        "matchAVsX.playerAName": "$usersDetPlayerA.userName",
        "matchAVsX.matchProjectType": "1",
        "matchAVsX.no": 1,
        "matchAVsX.label": "AvsX",
        "matchAVsX.displayLabel": "A vs X",
        "matchAVsX.order": 1,
        "matchAVsX.playerA1Id": "1",
        "matchAVsX.playerA2Id": "1",
        "matchAVsX.playerB1Id": "1",
        "matchAVsX.playerB2Id": "1",
        "matchAVsX.winnerD1PlayerId": "1",
        "matchAVsX.winnerD2PlayerId": "1"
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchAVsX.playerBID",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerB" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerB"
    }
}, {
    $addFields: {
        "matchAVsX.playerBName": "$usersDetPlayerB.userName",
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchBVsY.playerAID",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerA1" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerA1"
    }
}, {
    $addFields: {
        "matchBVsY.playerAName": "$usersDetPlayerA1.userName",
        "matchBVsY.matchProjectType": "1",
        "matchBVsY.no": 2,
        "matchBVsY.label": "BvsY",
        "matchBVsY.displayLabel": "B vs Y",
        "matchBVsY.order": 2,
        "matchBVsY.playerA1Id": "1",
        "matchBVsY.playerA2Id": "1",
        "matchBVsY.playerB1Id": "1",
        "matchBVsY.playerB2Id": "1",
        "matchBVsY.winnerD1PlayerId": "1",
        "matchBVsY.winnerD2PlayerId": "1"
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchBVsY.playerBID",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerB1" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerB1"
    }
}, {
    $addFields: {
        "matchBVsY.playerBName": "$usersDetPlayerB1.userName",
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchBVsX.playerAID",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerA2" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerA2"
    }
}, {
    $addFields: {
        "matchBVsX.playerAName": "$usersDetPlayerA2.userName",
        "matchBVsX.matchProjectType": "1",
        "matchBVsX.no": 4,
        "matchBVsX.label": "BvsX",
        "matchBVsX.displayLabel": "B vs X",
        "matchBVsX.order": 4,
        "matchBVsX.playerA1Id": "1",
        "matchBVsX.playerA2Id": "1",
        "matchBVsX.playerB1Id": "1",
        "matchBVsX.playerB2Id": "1",
        "matchBVsX.winnerD1PlayerId": "1",
        "matchBVsX.winnerD2PlayerId": "1"
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchBVsX.playerBID",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerB2" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerB2"
    }
}, {
    $addFields: {
        "matchBVsX.playerBName": "$usersDetPlayerB2.userName",
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchAVsY.playerAID",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerA3" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerA3"
    }
}, {
    $addFields: {
        "matchAVsY.playerAName": "$usersDetPlayerA3.userName",
        "matchAVsY.matchProjectType": "1",
        "matchAVsY.no": 5,
        "matchAVsY.label": "AvsY",
        "matchAVsY.displayLabel": "A vs Y",
        "matchAVsY.order": 4,
        "matchAVsY.playerA1Id": "1",
        "matchAVsY.playerA2Id": "1",
        "matchAVsY.playerB1Id": "1",
        "matchAVsY.playerB2Id": "1",
        "matchAVsY.winnerD1PlayerId": "1",
        "matchAVsY.winnerD2PlayerId": "1"
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchAVsY.playerBID",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerB3" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerB3"
    }
}, {
    $addFields: {
        "matchAVsY.playerBName": "$usersDetPlayerB3.userName",

    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchDoubles.teamAD1PlayerId",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerA4" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerA4"
    }
}, {
    $addFields: {
        "matchDoubles.playerA1Name": "$usersDetPlayerA4.userName",
        "matchDoubles.matchProjectType": "2",
        "matchDoubles.no": 3,
        "matchDoubles.label": "Doubles",
        "matchDoubles.displayLabel": "Doubles",
        "matchDoubles.order": 3,
        "matchDoubles.playerAId": "1",
        "matchDoubles.playerBId": "1",
        "matchDoubles.winnerIdPlayer": "1",
        "matchDoubles.playerA1Id": "$matchDoubles.teamAD1PlayerId",
        "matchDoubles.playerA2Id": "$matchDoubles.teamAD2PlayerId",
        "matchDoubles.playerB1Id": "$matchDoubles.teamBD1PlayerId",
        "matchDoubles.playerB2Id": "$matchDoubles.teamBD2PlayerId",
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchDoubles.teamAD2PlayerId",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerA5" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerA5"
    }
}, {
    $addFields: {
        "matchDoubles.playerA2Name": "$usersDetPlayerA5.userName",
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchDoubles.teamBD1PlayerId",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerB4" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerB4"
    }
}, {
    $addFields: {
        "matchDoubles.playerB1Name": "$usersDetPlayerB4.userName",
    }
}, {
    $lookup: {
        from: userTable,
        localField: "matchDoubles.teamBD2PlayerId",
        // name of users table field,
        foreignField: "_id",
        as: "usersDetPlayerB5" // alias for userinfo table
    }
}, {
    $unwind: {
        "path": "$usersDetPlayerB5"
    }
}, {
    $addFields: {
        "matchDoubles.playerB2Name": "$usersDetPlayerB5.userName",
    }
}, {
    $project: {
        "teamAID": "$teamAID",
        "teamBID": "$teamBID",
        "teamMatchType": "$teamMatchType",
        "finalTeamWinner": "$finalTeamWinner",
        "matchAVsX": "$matchAVsX",
        "matchBVsY": "$matchBVsY",
        "matchBVsX": "$matchBVsX",
        "matchAVsY": "$matchAVsY",
        "matchDoubles": "$matchDoubles",
        "teamAName": "$teamAName",
        "teamBName": "$teamBName"
    }
}, {
    $addFields: {
        "specifications": ["$matchAVsX", "$matchBVsY", "$matchDoubles", "$matchBVsX", "$matchAVsY"]
    }
}, {
    $project: {
        "teamAID": "$teamAID",
        "teamBID": "$teamBID",
        "teamMatchType": "$teamMatchType",
        "finalTeamWinner": "$finalTeamWinner",
        "teamAName": "$teamAName",
        "teamBName": "$teamBName",
        "specifications": "$specifications"
    }
}])
*/