import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';
//userDetailsTTUsed

Meteor.methods({
    'getResponseForgivenTournIdDate': function(tournamentId, startDate) {
        try {
            if (tournamentId && startDate) {
                let datas = tournamentSchedule.findOne({
                    tournamentId: tournamentId,
                    selectedDate: startDate
                })
                if (datas) {
                    var dataToSend = {
                        result: true,
                        status: "success",
                        message: "tournament scheduled data",
                        data: datas
                    }
                    return dataToSend
                }
            } else {
                var dataToSend = {
                    result: false,
                    status: "failed",
                    message: "tournamentId and start date is required",
                    data: id
                }
                return dataToSend
            }
        } catch (e) {}
    }
});

Meteor.methods({
    'getResponseForgivenTournIID': function(tournamentId, startDate) {
        try {
            if (tournamentId && startDate) {
                let datas = tournamentSchedule.find({
                    tournamentId: tournamentId,
                }).fetch()
                if (datas && datas.length != 0) {
                    var dataToSend = {
                        result: true,
                        status: "success",
                        message: "tournament scheduled data",
                        data: datas
                    }
                    return dataToSend
                }
            } else {
                var dataToSend = {
                    result: false,
                    status: "failed",
                    message: "tournamentId and start date is required",
                    data: id
                }
                return dataToSend
            }
        } catch (e) {}
    }
});
Meteor.methods({
    "matchNumbersOfGivenSchedule": function(tournamentId,eve) {
        try {
            if (tournamentId) {
                var s = tournamentSchedule.aggregate([{
                    $match: {
                        tournamentId: tournamentId
                    }
                }, {
                    $unwind: "$scheduledData"
                }, {
                    $match:{
                       "scheduledData.eventName":eve 
                    }
                },
                {
                    $project: {
                        eve: "$scheduledData.eventName",
                        num: "$scheduledData.matchNumbers",
                        rou: "$scheduledData.round",
                        order:"$scheduledData.order"
                    }
                }, {
                    $unwind: "$num"
                }, {
                    $project: {
                        eve: "$eve",
                        num: "$num",
                        rou: "$rou",
                        order:"$order"
                    }
                }, {
                    $group: {
                        "_id": "$eve",
                        arr: {
                            $push: "$num"
                        },
                        rou: {
                            $addToSet: "$rou"
                        },
                        order: {
                            $addToSet: "$order"
                        },
                    }
                }])
                return s
            }
        } catch (e) {}
    }
})

Meteor.methods({
    "getSelectedDatesOfTournament": function(tournamentId) {
        try {
            if (tournamentId) {
                var s = tournamentSchedule.aggregate([{
                    $match: {
                        tournamentId: tournamentId
                    }
                }, {
                    $project: {
                        d: "$selectedDate",
                        t: "$tournamentId"
                    }
                }, {
                    $group: {
                        "_id": "$t",
                        d: {
                            $addToSet: "$d"
                        }
                    }
                }])
                
                if (s && s[0] && s[0].d) {
                    return s[0].d
                }
                else{
                    return false
                }
            }
        } catch (e) {}
    }
})

Meteor.methods({
    "scheduleOfGivenDATE": function(tournamentId, selectedDate) {
        try {
            if (tournamentId && selectedDate) {
                var s = tournamentSchedule.aggregate([{
                    $match: {
                        tournamentId: tournamentId,
                        selectedDate: selectedDate
                    }
                }, {
                    $unwind: "$scheduledData"
                }, {
                    $sort: {
                        "scheduledData.order": 1
                    }
                }, {
                    $project: {
                        "eId": "$scheduledData.eventId",
                        "schedule": "$scheduledData.schedule",
                        duration: "$duration",
                        eventName: "$scheduledData.eventName",
                        rou: "$scheduledData.round",
                        date: "$selectedDate",
                        order: "$order",
                        duration: "$duration",
                        matchNumbers: "$scheduledData.matchNumbers",
                        projectType: "$scheduledData.projectType",
                        breakstart1: "$break1St",
                        breakend1: "$break1End",
                        breakstart2: "$break2St",
                        breakend2: "$break2End"
                    }
                }, {
                    $sort: {
                        "scheduledData.order": 1
                    }
                }, {
                    $unwind: "$schedule"
                }, {
                    $sort: {
                        "schedule.order": 1
                    }
                }, {
                    $project: {
                        "_id": {
                            $concat: ["$eId", "$rou", "$schedule.match"]
                        },
                        ev: "$eventName",
                        sc: "$schedule",
                        d: "$date",
                        rou: "$rou",
                        duration: "$duration",
                        matchNumbers: "$matchNumbers",
                        projectType: "$projectType",
                        breakstart1: "$breakstart1",
                        breakend1: "$breakend1",
                        breakstart2: "$breakstart2",
                        breakend2: "$breakend2"
                    }
                }])
                return s
            }
        } catch (e) {}
    }
})

Meteor.methods({
    "scheduleOfGivenIdTourn": function(tournamentId,eventName,selectedDate) {
        try {
            var data = {}
            if (tournamentId) {
                var queryForMatch = {};
                var queryForMatch1 = {}
                if(tournamentId  && eventName == "" && selectedDate == ""){
                    queryForMatch = {}
                    queryForMatch1 = {
                        tournamentId:tournamentId
                    }
                }
                else if(tournamentId && eventName && selectedDate == ""){
                    queryForMatch = {
                        "scheduledData.eventName": eventName
                    }
                    queryForMatch1 = {
                        tournamentId:tournamentId
                    }
                }
                else if(tournamentId && eventName == "" && selectedDate){
                    queryForMatch = {}
                    queryForMatch1 = {
                        tournamentId:tournamentId,
                        selectedDate: selectedDate
                    }
                }
                var s = tournamentSchedule.aggregate([{
                    $match: queryForMatch1
                }, {
                    $unwind: "$scheduledData"
                },{
                    $match: queryForMatch
                },{
                    $sort: {
                        "scheduledData.order": 1
                    }
                }, {
                    $project: {
                        "eId": "$scheduledData.eventId",
                        "schedule": "$scheduledData.schedule",
                        duration: "$duration",
                        eventName: "$scheduledData.eventName",
                        rou: "$scheduledData.round",
                        date: "$selectedDate",
                        order: "$order",
                        duration: "$duration",
                        matchNumbers: "$scheduledData.matchNumbers",
                        projectType: "$scheduledData.projectType",
                        breakstart1: "$break1St",
                        breakend1: "$break1End",
                        breakstart2: "$break2St",
                        breakend2: "$break2End",
                        "selectedDateMoment":"$selectedDateMoment",
                    }
                }, {
                    $sort: {                        
                        "scheduledData.order": 1,
                    }
                }, {
                    $unwind: "$schedule"
                }, {
                    $sort: {
                        "schedule.dateOfEventMoment": 1,
                        "schedule.order": 1
                    }
                }, {
                    $project: {
                        "_id":0,
                        "id": {
                            $concat: ["$eId", "$rou", "$schedule.match"]
                        },
                        ev: "$eventName",
                        sc: "$schedule",
                        d: "$date",
                        rou: "$rou",
                        duration: "$duration",
                        matchNumbers: "$matchNumbers",
                        projectType: "$projectType",
                        breakstart1: "$breakstart1",
                        breakend1: "$breakend1",
                        breakstart2: "$breakstart2",
                        breakend2: "$breakend2",
                    }
                }])
                

                var k = tournamentSchedule.aggregate([{
                    $match: {
                        tournamentId: tournamentId
                    }
                }, {
                    $unwind: "$scheduledData"
                }, {
                    $project: {
                        "eid1": {
                            "$cond": [{
                                "$eq": ["$scheduledData.projectType", 1]
                            }, "$scheduledData.eventName", "$noval"]
                        },
                        "eId": {
                            "$cond": [{
                                "$eq": ["$scheduledData.projectType", 2]
                            }, "$scheduledData.eventName", "$noval"]
                        }
                    }
                }, {
                    $group: {
                        "_id": null,
                        "e": {
                            $addToSet: "$eid1"
                        },
                        "e2": {
                            $addToSet: "$eId"
                        }
                        
                    }
                }])
                data = {
                    data: s,
                    data2: k
                }


                return data
            }
        } catch (e) {
        }
    }
})

Meteor.methods({
    "scheduleOfGivenId": function(tournamentId, eventName) {
        try {
            if (tournamentId && eventName) {
                var s = tournamentSchedule.aggregate([{
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
                    $sort: {
                        "selectedDateMoment":-1,
                        "scheduledData.order": 1,
                    }
                }, {
                    $project: {
                        "eId": "$scheduledData.eventId",
                        "schedule": "$scheduledData.schedule",
                        duration: "$duration",
                        eventName: "$scheduledData.eventName",
                        rou: "$scheduledData.round",
                        date: "$selectedDate",
                        order: "$order",
                        duration: "$duration",
                        matchNumbers: "$scheduledData.matchNumbers",
                        projectType: "$scheduledData.projectType",
                        breakstart1: "$break1St",
                        breakend1: "$break1End",
                        breakstart2: "$break2St",
                        breakend2: "$break2End",
                        selectedDateMoment:"$selectedDateMoment"
                    }
                }, {
                    $sort: {
                        "selectedDateMoment":-1,
                        "scheduledData.order": 1
                    }
                }, {
                    $unwind: "$schedule"
                }, {
                    $sort: {
                        "schedule.order": 1
                    }
                }, {
                    $project: {
                        "_id": {
                            $concat: ["$eId", "$rou", "$schedule.match"]
                        },
                        ev: "$eventName",
                        sc: "$schedule",
                        d: "$date",
                        rou: "$rou",
                        duration: "$duration",
                        matchNumbers: "$matchNumbers",
                        projectType: "$projectType",
                        breakstart1: "$breakstart1",
                        breakend1: "$breakend1",
                        breakstart2: "$breakstart2",
                        breakend2: "$breakend2"
                    }
                }])
                return s
            }
        } catch (e) {}
    }
})

Meteor.methods({
    "getNumberOfOrder": function(tournamentId) {
        try {
            var rounds = 0
            if (tournamentId) {
                var findEvent = events.findOne({"_id":tournamentId})
                if (findEvent == undefined) {
                    findEvent = pastEvents.findOne({"_id":tournamentId})
                }


                if (findEvent) {
                    var r = MatchCollectionDB.aggregate([{
                        $match: {
                            tournamentId: tournamentId
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $project: {
                            roundNumber: "$matchRecords.roundNumber",
                            e: "$eventName"
                        }
                    }, {
                        $group: {
                            "_id": "$e",
                            s: {
                                $addToSet: "$roundNumber"
                            }
                        }
                    }, {
                        $project: {
                            l: {
                                $size: "$s"
                            }
                        }
                    }, {
                        $group: {
                            "_id": null,
                            s: {
                                $sum: "$l"
                            }
                        }
                    }])
                    

                    var rl = teamMatchCollectionDB.aggregate([{
                        $match: {
                            tournamentId: tournamentId
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $project: {
                            roundNumber: "$matchRecords.roundNumber",
                            e: "$eventName"
                        }
                    }, {
                        $group: {
                            "_id": "$e",
                            s: {
                                $addToSet: "$roundNumber"
                            }
                        }
                    }, {
                        $project: {
                            l: {
                                $size: "$s"
                            }
                        }
                    }, {
                        $group: {
                            "_id": null,
                            s: {
                                $sum: "$l"
                            }
                        }
                    }])
                    
                    if(r && r[0] && r[0].s){
                        rounds = r[0].s
                    }
                    if(rl && rl[0] && rl[0].s){
                        rounds = rounds + rl[0].s
                    }

                    return _.range(parseInt(1) , parseInt(rounds + 1))
                } 
            }
        } catch (e) {
        }
    }
})

Meteor.methods({
    "getPlayerMatchDetails": async function(projectType, matchNumber, selectedTournId, selectedEventId) {
        try {
            var dbsrequired = ["userDetailsTT", "playerTeams"]
            var userDetailsTT = "userDetailsTT"
            var playerTeams = "playerTeams"
            var res = await Meteor.call("changeDbNameForDraws", selectedTournId, dbsrequired)
            try {
                if (res) {
                    if (res.changeDb && res.changeDb == true) {
                        if (res.changedDbNames.length != 0) {
                            userDetailsTT = res.changedDbNames[0]
                            playerTeams = res.changedDbNames[1]
                        }
                    }
                }
            }catch(e){}
            
            if (projectType && matchNumber && selectedTournId && selectedEventId) {
                if (projectType == 1) {
                    //goes with match coll
                    let r = MatchCollectionDB.aggregate([{
                        $match: {
                            "tournamentId": selectedTournId,
                            "eventName":selectedEventId
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $match: {
                            "matchRecords.matchNumber": parseInt(matchNumber)
                        }
                    }, {
                        $project: {
                            status: "$matchRecords.status",
                            playerA: "$matchRecords.playersID.playerAId",
                            playerB: "$matchRecords.playersID.playerBId",
                            winnerId: "$matchRecords.winnerID",
                            scoresA: "$matchRecords.scores.setScoresA",
                            scoresB: "$matchRecords.scores.setScoresB"
                        }
                    }]);
                    if (r && r.length != 0 && r[0]) {
                        var status = ""
                        var playerA = ""
                        var playerB = ""
                        var winnerId = ""
                        var scoresA = ""
                        var scoresB = ""
                        var scores = ""
                        if (r[0].playerA == undefined || r[0].playerA == null) {
                            r[0].playerA = ""
                        }
                        if (r[0].playerB == undefined || r[0].playerB == null) {
                            r[0].playerB = ""
                        }
                        if (r[0].winnerId == undefined || r[0].winnerId == null) {
                            r[0].winnerId = ""
                        }
                        if (r[0].status == undefined || r[0].status == null) {
                            r[0].status = ""
                        }
                        if (r[0].playerA) {
                            var userName = global[userDetailsTT].findOne({
                                "userId": r[0].playerA
                            })
                            if (userName && userName.userName) {
                                playerA = userName.userName
                            }
                        }
                        if (r[0].playerB) {
                            var userName = global[userDetailsTT].findOne({
                                "userId": r[0].playerB
                            })
                            if (userName && userName.userName) {
                                playerB = userName.userName
                            }
                        }
                        if (r[0].winnerId) {
                            if (r[0].playerB == r[0].winnerId) {
                                winnerId = playerB
                            } else if (r[0].playerA == r[0].winnerId) {
                                winnerId = playerA
                            }
                        }
                        if (r[0].status && r[0].status.toLowerCase() == "bye") {
                            status = "Bye"
                        }
                        if (r[0].status && r[0].status.toLowerCase() == "walkover") {
                            status = "Walkover"
                        }
                        if (r[0].status && r[0].status.toLowerCase() == "completed") {
                            status = "Completed"
                        }
                        if (r[0].status && r[0].status.toLowerCase() == "completed" && r[0].playerB && r[0].playerA && r[0].winnerId && r[0].winnerId) {
                            if (r[0].scoresA && r[0].scoresB) {
                                if (r[0].playerA == r[0].winnerId) {
                                    var scoreInfo = " ";
                                    for (var k = 0; k < r[0].scoresA.length; k++) {
                                        if (parseInt(r[0].scoresA[k]) != 0 || parseInt(r[0].scoresB[k]) != 0) {
                                            scores = scores + "  " + r[0].scoresA[k].toString() + "-" + r[0].scoresB[k].toString();
                                        }
                                    }
                                } else if (r[0].playerB == r[0].winnerId) {
                                    for (var k = 0; k < r[0].scoresB.length; k++) {
                                        if (parseInt(r[0].scoresA[k]) != 0 || parseInt(r[0].scoresB[k]) != 0) {
                                            scores = scores + "  " + r[0].scoresB[k].toString() + "-" + r[0].scoresA[k].toString();
                                        }
                                    }
                                }
                            }
                        }
                        var dataToRet = {
                            status: status,
                            playerA: playerA,
                            playerB: playerB,
                            winnerId: winnerId,
                            scores: scores
                        }
                        return dataToRet
                    }
                } else if (projectType == 2) {
                    //goes with team match coll
                    let r = teamMatchCollectionDB.aggregate([{
                        $match: {
                            "tournamentId": selectedTournId,
                            "eventName": selectedEventId
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $match: {
                            "matchRecords.matchNumber": parseInt(matchNumber)
                        }
                    }, {
                        $project: {
                            "status": "$matchRecords.status",
                            "playerA": "$matchRecords.teamsID.teamAId",
                            playerB: "$matchRecords.teamsID.teamBId",
                            winnerId: "$matchRecords.winnerID",
                            scoresA: "$matchRecords.scores.setScoresA",
                            scoresB: "$matchRecords.scores.setScoresB"
                        }
                    }])
                    if (r && r.length != 0 && r[0]) {
                        var status = ""
                        var playerA = ""
                        var playerB = ""
                        var winnerId = ""
                        var scoresA = ""
                        var scoresB = ""
                        var scoresT = ""
                        if (r[0].playerA) {
                            var userName = global[playerTeams].findOne({
                                "_id": r[0].playerA
                            })
                            if (userName && userName.teamName) {
                                playerA = userName.teamName
                            }
                        }
                        if (r[0].playerB) {
                            var userName = global[playerTeams].findOne({
                                "_id": r[0].playerB
                            })
                            if (userName && userName.teamName) {
                                playerB = userName.teamName
                            }
                        }
                        if (r[0].winnerId) {
                            if (r[0].playerB == r[0].winnerId) {
                                winnerId = playerB
                            } else if (r[0].playerA == r[0].winnerId) {
                                winnerId = playerA
                            }
                        }
                        if (r[0].status && r[0].status.toLowerCase() == "bye") {
                            status = "Bye"
                        }
                        if (r[0].status && r[0].status.toLowerCase() == "walkover") {
                            status = "Walkover"
                        }
                        if (r[0].status && r[0].status.toLowerCase() == "completed") {
                            status = "Completed"
                        }
                        if (r[0].status && r[0].status.toLowerCase() == "completed") {
                            var scoresTs = ""
                            if (r[0].scoresA && r[0].scoresB) {
                                if (r[0].playerA == r[0].winnerId) {
                                    for (var k = 0; k < r[0].scoresA.length; k++) {
                                        //if (k != 0 && (parseInt(r[0].scoresA[k]) != 0 && parseInt(r[0].scoresB[k]) != 0)){
                                        //scoresTs = scoresTs+ " ";
                                        //}
                                        if (parseInt(r[0].scoresA[k]) != 0 || parseInt(r[0].scoresB[k]) != 0) {
                                            scoresTs = scoresTs + "  " + r[0].scoresA[k].toString() + " - " + r[0].scoresB[k].toString();
                                        }
                                    }
                                } else if (r[0].playerB == r[0].winnerId) {
                                    for (var k = 0; k < r[0].scoresB.length; k++) {
                                        if (parseInt(r[0].scoresA[k]) != 0 || parseInt(r[0].scoresB[k]) != 0) {
                                            scoresTs = scoresTs + "  " + r[0].scoresB[k].toString() + " - " + r[0].scoresA[k].toString();
                                        }
                                    }
                                }
                                scoresT = scoresTs
                            }
                        }
                        var dataToRet = {
                            status: status,
                            playerA: playerA,
                            playerB: playerB,
                            winnerId: winnerId,
                            scores: scoresT
                        }
                        return dataToRet
                    }
                }
            }
        } catch (e) {}
    }
})

Meteor.methods({
    "getEventsForSelectedTounrM":function(tournamentId, type){
        try{
         if (tournamentId && type) {
            var findEvent;
            var eventss = []
            var mEvents = []
            if(type == "new")
                findEvent = events.findOne({"_id":tournamentId})
            if (type == "past") {
                findEvent = pastEvents.findOne({"_id":tournamentId})
            }

            if (findEvent) {
                var r = MatchCollectionDB.aggregate([{
                    $match: {
                        tournamentId: tournamentId
                    }
                }, {
                    $project: {
                        "e": "$eventName"
                    }
                }, {
                    $group: {
                        "_id": null,
                        s: {
                            "$addToSet": "$e"
                        }
                    }
                }])


                var rl = teamMatchCollectionDB.aggregate([{
                    $match: {
                        tournamentId: tournamentId
                    }
                }, {
                    $project: {
                        "e": "$eventName"
                    }
                }, {
                    $group: {
                        "_id": null,
                        s: {
                            "$addToSet": "$e"
                        }
                    }
                }])
                if(r && r[0] && r[0].s){
                    mEvents = r[0].s
                }
                if(rl && rl[0] && rl[0].s){
                    mEvents = mEvents.concat(rl[0].s)
                }

                if(mEvents && mEvents.length && type == "new"){
                    var e = events.aggregate([{
                        $match: {
                            tournamentId: tournamentId,
                            tournamentEvent: false,
                            eventName:{$in:mEvents}
                        }
                    }, {
                        $project: {
                            "num": {
                                "$cond": [{
                                    $or: [{
                                        "$eq": ["$eventParticipants", undefined]
                                    }, {
                                        "$eq": ["$eventParticipants", null]
                                    }]
                                }, 0, {
                                    $size: {
                                        "$ifNull": ["$eventParticipants", []]
                                    }
                                }]
                            },
                            "abbName": "$abbName",
                            "eventName": "$eventName",
                            "_id":"$_id",
                            projectType:"$projectType"

                        }
                    }, {
                        $sort: {
                            num: -1
                        }
                    }])
                    if(e && e.length){
                        eventss = e
                    }
                }

                else if(mEvents && mEvents.length && type == "past"){
                    var e = pastEvents.aggregate([{
                        $match: {
                            tournamentId: tournamentId,
                            tournamentEvent: false,
                            eventName:{$in:mEvents}
                        }
                    }, {
                        $project: {
                            "num": {
                                "$cond": [{
                                    $or: [{
                                        "$eq": ["$eventParticipants", undefined]
                                    }, {
                                        "$eq": ["$eventParticipants", null]
                                    }]
                                }, 0, {
                                    $size: {
                                        "$ifNull": ["$eventParticipants", []]
                                    }
                                }]
                            },
                            "abbName": "$abbName",
                            "eventName": "$eventName",
                            "_id":"$_id",
                            projectType:"$projectType"

                        }
                    }, {
                        $sort: {
                            num: -1
                        }
                    }])
                    if(e && e.length){
                        eventss = e
                    }
                }
                return eventss
            }
        }
    }catch(e){
    }
    }
})


Meteor.methods({
    "getPlayerMatchDetailsComplete": function(projectType, matchNumber, selectedTournId, selectedEventId,selectedEventId2) {
        try {
            
            if (projectType && matchNumber && selectedTournId) {
                if (projectType) {
                    //goes with match coll
                    let r = MatchCollectionDB.aggregate([{
                        $match: {
                            "tournamentId": selectedTournId,
                            "eventName": {$in:selectedEventId}
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $project: {
                            "_id":0,
                            matchNumber:"$matchRecords.matchNumber",
                            eventName:"$eventName",
                            status: "$matchRecords.status",
                            playerA: "$matchRecords.playersID.playerAId",
                            playerB: "$matchRecords.playersID.playerBId",
                            winnerId: "$matchRecords.winnerID",
                            scoresA: "$matchRecords.scores.setScoresA",
                            scoresB: "$matchRecords.scores.setScoresB"
                        }
                    }]);

                    var r1 = teamMatchCollectionDB.aggregate([{
                        $match: {
                            "tournamentId": selectedTournId,
                            "eventName": {$in:selectedEventId2}
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $project: {
                            "_id":0,
                            matchNumber:"$matchRecords.matchNumber",
                            eventName:"$eventName",
                            status: "$matchRecords.status",
                            playerA: "$matchRecords.teamsID.teamAId",
                            playerB: "$matchRecords.teamsID.teamBId",
                            winnerId: "$matchRecords.winnerID",
                            scoresA: "$matchRecords.scores.setScoresA",
                            scoresB: "$matchRecords.scores.setScoresB"
                        }
                    }]);

                    
                    if(r1 && r){
                        r1 = r.concat(r1)
                        return r1
                    }
                   
                    else if(r){
                        return r
                    }
                    else if(r1){
                        return r1
                    }
                }
                
            }
        } catch (e) {
        }
    }
})

Meteor.methods({
    "subcribersFromDraws":function(tournamentId,eventName,projectType){
        try{
            if(projectType == "no"){
                var eveProj = events.findOne({"tournamentId":tournamentId,eventName:eventName})
                if(eveProj && eveProj.projectType){
                    projectType = eveProj.projectType
                }
                else if(eveProj == undefined || eveProj == null){
                    eveProj = pastEvents.findOne({"tournamentId":tournamentId,eventName:eventName})
                    if(eveProj && eveProj.projectType){
                        projectType = eveProj.projectType
                    }
                }
            }

            if(tournamentId && eventName && projectType){
                if(projectType == 1){
                    var match = MatchCollectionDB.aggregate([{
                        $match: {
                            tournamentId: tournamentId,
                            eventName:eventName
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $match:{
                            "matchRecords.roundNumber":1
                        }
                    },
                    {
                        $project: {
                            "eid1": {
                                "$cond": [{
                                    "$eq": ["$matchRecords.status", "bye"]
                                }, 1, 2]
                            },
                            matchNumber:"$matchRecords.matchNumber",
                            round:"$matchRecords.roundNumber"
                        }
                    },{
                        $group:{
                            "_id":null,
                            s:{
                                $sum:"$eid1"
                            }
                        }
                    }])
                    if(match && match[0] && match[0].s){
                        return match[0].s
                    }
                }
                else if(projectType == 2){
                    var match = teamMatchCollectionDB.aggregate([{
                        $match: {
                            tournamentId: tournamentId,
                            eventName:eventName
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $match:{
                            "matchRecords.roundNumber":1
                        }
                    },
                    {
                        $project: {
                            "eid1": {
                                "$cond": [{
                                    "$eq": ["$matchRecords.status", "bye"]
                                }, 1, 2]
                            },
                            matchNumber:"$matchRecords.matchNumber",
                            round:"$matchRecords.roundNumber"
                        }
                    },{
                        $group:{
                            "_id":null,
                            s:{
                                $sum:"$eid1"
                            }
                        }
                    }])
                    
                    if(match && match[0] && match[0].s){
                        return match[0].s
                    }
                }
            }
        }catch(E){
        }
    }
})



