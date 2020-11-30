Meteor.methods({
	"getLiveScores11Even":function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": FAIL_LIVE_SCORES
        }

        try {
            var tId = Meteor.call("getRecentLiveScoreTID",xData)

            if(tId){

               if (typeof xData == "string") {
                    xData = xData.replace("\\", "");
                    xData = JSON.parse(xData);
                }

            	xData.tournamentId = tId;

                if (xData) {
                    var td = events.findOne({
                        "_id":xData.tournamentId
                    })
                    if(td==undefined){
                        td = pastEvents.findOne({
                            "_id":xData.tournamentId
                        })
                        if(td == undefined){
                            td = {}
                        }
                    }

                    var comMatch = []

                    var findMatch = liveScores.aggregate([{
                        $match: {
                            "tournamentId": xData.tournamentId,
                            "projectType": 1,
                            "status":"inprogress"
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "playerAId",
                            foreignField: "userId",
                            as: "userDet"
                        }
                    }, {
                        $unwind: "$userDet"
                    }, {
                        "$project": {
                            "playerAName": "$userDet.userName",
                            "tournamentId": "$tournamentId",
                            "eventName": "$eventName",
                            "eventOrganizer": "$eventOrganizer",
                            "matchNumber": "$matchNumber",
                            "roundNumber": "$roundNumber",
                            "playerAId": "$playerAId",
                            "playerBId": "$playerBId",
                            "status": "$status",
                            "scoresA": "$scoresA",
                            "scoresB": "$scoresB",
                            "roundName": "$roundName",
                            "projectType": "$projectType"
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "playerBId",
                            foreignField: "userId",
                            as: "userDetB"
                        }
                    }, {
                        $unwind: "$userDetB"
                    }, {
                        "$project": {
                            "playerNameA": "$playerAName",
                            "tournamentId": "$tournamentId",
                            "eventName": "$eventName",
                            "eventOrganizer": "$eventOrganizer",
                            "matchNumber": "$matchNumber",
                            "roundNumber": "$roundNumber",
                            "playerAID": "$playerAId",
                            "playerBID": "$playerBId",
                            "status": "$status",
                            "scoresA": "$scoresA",
                            "scoresB": "$scoresB",
                            "playerNameB": "$userDetB.userName",
                            "roundName": "$roundName",
                            "projectType": "$projectType"
                        }
                    }])


                    var subType = subscriptionRestrictions.findOne({"tournamentId":xData.tournamentId})
                    var findMatch2 = [];

                    if(subType && subType.selectionType && subType.selectionType == "schoolOnly")
                    {
                        findMatch2 = liveScores.aggregate([
                            {$match: {
                                "tournamentId": xData.tournamentId,
                                "projectType": 2,
                                "status":"inprogress"
                            }}, 
                            {$lookup: {
                                from: "schoolTeams",
                                localField: "playerAId",
                                foreignField: "_id",
                                as: "userDet"
                            }}, 
                            {$unwind: "$userDet"}, 
                            {"$project": {
                                "playerAName": "$userDet.teamName",
                                "tournamentId": "$tournamentId",
                                "eventName": "$eventName",
                                "eventOrganizer": "$eventOrganizer",
                                "matchNumber": "$matchNumber",
                                "roundNumber": "$roundNumber",
                                "playerAId": "$playerAId",
                                "playerBId": "$playerBId",
                                "status": "$status",
                                "scoresA": "$scoresA",
                                "scoresB": "$scoresB",
                                "roundName": "$roundName",
                                "projectType": "$projectType"
                            }}, 
                            {$lookup: {
                                from: "schoolTeams",
                                localField: "playerBId",
                                foreignField: "_id",
                                as: "userDetB"
                            }}, 
                            {$unwind: "$userDetB"}, 
                            {"$project": {
                                "playerNameA": "$playerAName",
                                "tournamentId": "$tournamentId",
                                "eventName": "$eventName",
                                "eventOrganizer": "$eventOrganizer",
                                "matchNumber": "$matchNumber",
                                "roundNumber": "$roundNumber",
                                "playerAID": "$playerAId",
                                "playerBID": "$playerBId",
                                "status": "$status",
                                "scoresA": "$scoresA",
                                "scoresB": "$scoresB",
                                "playerNameB": "$userDetB.teamName",
                                "roundName": "$roundName",
                                "projectType": "$projectType"
                            }}
                        ])
                    }
                    else
                    {
                        findMatch2 = liveScores.aggregate([
                            {$match: {
                                "tournamentId": xData.tournamentId,
                                "projectType": 2,
                                "status":"inprogress"
                            }}, 
                            {$lookup: {
                                from: "playerTeams",
                                localField: "playerAId",
                                foreignField: "_id",
                                as: "userDet"
                            }}, 
                            {$unwind: "$userDet"}, 
                            {"$project": {
                                "playerAName": "$userDet.teamName",
                                "tournamentId": "$tournamentId",
                                "eventName": "$eventName",
                                "eventOrganizer": "$eventOrganizer",
                                "matchNumber": "$matchNumber",
                                "roundNumber": "$roundNumber",
                                "playerAId": "$playerAId",
                                "playerBId": "$playerBId",
                                "status": "$status",
                                "scoresA": "$scoresA",
                                "scoresB": "$scoresB",
                                "roundName": "$roundName",
                                "projectType": "$projectType"
                            }}, 
                            {$lookup: {
                                from: "playerTeams",
                                localField: "playerBId",
                                foreignField: "_id",
                                as: "userDetB"
                            }}, 
                            {$unwind: "$userDetB"}, 
                            {"$project": {
                                "playerNameA": "$playerAName",
                                "tournamentId": "$tournamentId",
                                "eventName": "$eventName",
                                "eventOrganizer": "$eventOrganizer",
                                "matchNumber": "$matchNumber",
                                "roundNumber": "$roundNumber",
                                "playerAID": "$playerAId",
                                "playerBID": "$playerBId",
                                "status": "$status",
                                "scoresA": "$scoresA",
                                "scoresB": "$scoresB",
                                "playerNameB": "$userDetB.teamName",
                                "roundName": "$roundName",
                                "projectType": "$projectType"
                            }}
                        ])
                    }
                   


                    if(findMatch && findMatch.length){
                        comMatch = _.union(comMatch,findMatch)
                    }

                    if(findMatch2 && findMatch2.length){
                        comMatch = _.union(comMatch,findMatch2)
                    }
                   

                    if(comMatch && comMatch.length){
                        res.status = SUCCESS_STATUS
                        res.message = SUCCESS_LIVE_SCORES
                        comMatch = mapOrders(comMatch,[],"eventName")
                        res.data = comMatch
                        res.tournamentData = td
                    }
                        			
                } else {
                    res.message = "parameters  " + ARE_NULL_MSG
                }
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
    "getRecentLiveScoreTID":async function(xData){
        try{
            var livSc = liveScores.aggregate(
               [ {
                    $match:{
                        "eventOrganizer":xData.eventOrganizer
                    }
                },
                 { $sort: { logTime: 1 } },
                 {
                   $group:
                     {
                       _id: "$tournamentId",
                       logTime: { $last: "$logTime" }
                     }
                 }
               ]
            )
            if(livSc && livSc.length && livSc[0] && livSc[0]._id){
                return livSc[0]._id
            }
        }catch(e){
            return false
        }
    }
})

Meteor.methods({
    "getTeamDetailedDrawsLive":async function(xData){
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": FAIL_LIVE_SCORES_TEAM_DETAILS
        }
        try{
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

                                            

                                            var userTable = lookUPTable
                                            res.tournamentData = sTeams.checkValidTournamentID(true)

                                            var getTeamDetails = liveScores.aggregate([{
                                                    $match: {
                                                        "tournamentId": xData.tournamentId,
                                                        "eventName": xData.eventName,
                                                        "matchNumber": parseInt(xData.matchNumber),
                                                        "status" : "inprogress"
                                                    }
                                                }, {
                                                    $unwind: {
                                                        "path": "$teamMatchDetails"
                                                    }
                                                }, {
                                                    $lookup: {
                                                        from: "users",
                                                        localField: "teamMatchDetails.teamAPlayerAID",
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
                                                    $project: {
                                                        "teamAplayerAName": "$usersDetA.userName",
                                                        "matchStatus":"$teamMatchDetails.matchStatus",
                                                        "matchTitle":"$teamMatchDetails.matchTitle",
                                                        "matchType":"$teamMatchDetails.matchType",
                                                        "scoresA":"$teamMatchDetails.scoresA",
                                                        "scoresB":"$teamMatchDetails.scoresB",
                                                        "teamAPlayerAID":"$teamMatchDetails.teamAPlayerAID",
                                                        "teamAPlayerBID":"$teamMatchDetails.teamAPlayerBID",
                                                        "teamBPlayerAID":"$teamMatchDetails.teamBPlayerAID",
                                                        "teamBPlayerBID":"$teamMatchDetails.teamBPlayerBID",
                                                        "tdmatchNumber":"$teamMatchDetails.matchNumber"
                                                    }
                                                }, {
                                                    $lookup: {
                                                        from: "users",
                                                        localField: "teamBPlayerAID",
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
                                                    $project: {
                                                        "teamBplayerAName": "$usersDetB.userName",
                                                        "teamAplayerAName": "$teamAplayerAName",
                                                        "matchStatus":"$matchStatus",
                                                        "matchTitle":"$matchTitle",
                                                        "matchType":"$matchType",
                                                        "scoresA":"$scoresA",
                                                        "scoresB":"$scoresB",
                                                        "teamAPlayerAID":"$teamAPlayerAID",
                                                        "teamAPlayerBID":"$teamAPlayerBID",
                                                        "teamBPlayerAID":"$teamBPlayerAID",
                                                        "teamBPlayerBID":"$teamBPlayerBID",
                                                        "tdmatchNumber":"$tdmatchNumber"
                                                    }
                                                }, {
                                                    $lookup: {
                                                        from: "users",
                                                        localField: "teamAPlayerBID",
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
                                                    $project: {
                                                        "teamAplayerBName": "$usersDetC.userName",
                                                        "teamBplayerAName": "$teamBplayerAName",
                                                        "teamAplayerAName": "$teamAplayerAName",
                                                        "matchStatus":"$matchStatus",
                                                        "matchTitle":"$matchTitle",
                                                        "matchType":"$matchType",
                                                        "scoresA":"$scoresA",
                                                        "scoresB":"$scoresB",
                                                        "teamAPlayerAID":"$teamAPlayerAID",
                                                        "teamAPlayerBID":"$teamAPlayerBID",
                                                        "teamBPlayerAID":"$teamBPlayerAID",
                                                        "teamBPlayerBID":"$teamBPlayerBID",
                                                        "tdmatchNumber":"$tdmatchNumber"
                                                    }
                                                }, {
                                                    $lookup: {
                                                        from: "users",
                                                        localField: "teamBPlayerBID",
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
                                                    $project: {
                                                        "teamBplayerBName": "$usersDetD.userName",
                                                        "teamAplayerBName": "$teamAplayerBName",
                                                        "teamBplayerAName": "$teamBplayerAName",
                                                        "teamAplayerAName": "$teamAplayerAName",
                                                        "matchStatus":"$matchStatus",
                                                        "matchTitle":"$matchTitle",
                                                        "matchType":"$matchType",
                                                        "scoresA":"$scoresA",
                                                        "scoresB":"$scoresB",
                                                        "teamAPlayerAID":"$teamAPlayerAID",
                                                        "teamAPlayerBID":"$teamAPlayerBID",
                                                        "teamBPlayerAID":"$teamBPlayerAID",
                                                        "teamBPlayerBID":"$teamBPlayerBID",
                                                        "tdmatchNumber":"$tdmatchNumber"
                                                    }
                                                }, {
                                                    $group: {
                                                        "_id": "$tdmatchNumber",

                                                        "teamAplayerAName": {
                                                            "$first": "$teamAplayerAName"
                                                        },
                                                        "teamAplayerBName": {
                                                            "$first": "$teamAplayerBName"
                                                        },
                                                        "teamBplayerAName": {
                                                            "$first": "$teamBplayerAName"
                                                        },
                                                        "teamBplayerBName": {
                                                            "$first": "$teamBplayerBName"
                                                        },
                                                        "matchStatus": {
                                                            "$first": "$matchStatus"
                                                        },
                                                        "matchTitle": {
                                                            "$first": "$matchTitle"
                                                        },
                                                        "matchType": {
                                                            "$first": "$matchType"
                                                        },
                                                        "scoresA": {
                                                            "$first": "$scoresA"
                                                        },
                                                        "scoresB": {
                                                            "$first": "$scoresB"
                                                        },
                                                        "teamAPlayerAID": {
                                                            "$first": "$teamAPlayerAID"
                                                        },
                                                        "teamAPlayerBID": {
                                                            "$first": "$teamAPlayerBID"
                                                        },
                                                        "teamBPlayerAID": {
                                                            "$first": "$teamBPlayerAID"
                                                        },
                                                        "teamBPlayerBID": {
                                                            "$first": "$teamBPlayerBID"
                                                        },
                                                    }
                                                }, {
                                                    $sort: {
                                                      "_id":1
                                                    }
                                                }])
                                                
                                                var getTeamView = [];
                                                var subType = subscriptionRestrictions.findOne({"tournamentId":xData.tournamentId});
                                                if(subType && subType.selectionType && subType.selectionType == "schoolOnly")
                                                {
                                                    getTeamView = liveScores.aggregate([
                                                        {$match: {
                                                            "tournamentId": xData.tournamentId,
                                                            "eventName": xData.eventName,
                                                            "matchNumber": parseInt(xData.matchNumber),
                                                            "status" : "inprogress"
                                                        }}, 
                                                        {$lookup: {
                                                            from: "schoolTeams",
                                                            localField: "playerAId",
                                                            foreignField: "_id",
                                                            as: "userDet"
                                                        }}, 
                                                        {$unwind: "$userDet"}, 
                                                        {"$project": {
                                                            "playerAName": "$userDet.teamName",
                                                            "playerASchoolId":"$userDet.schoolId",
                                                            "tournamentId": "$tournamentId",
                                                            "eventName": "$eventName",
                                                            "eventOrganizer": "$eventOrganizer",
                                                            "matchNumber": "$matchNumber",
                                                            "roundNumber": "$roundNumber",
                                                            "playerAId": "$playerAId",
                                                            "playerBId": "$playerBId",
                                                            "status": "$status",
                                                            "scoresA": "$scoresA",
                                                            "scoresB": "$scoresB",
                                                            "roundName": "$roundName",
                                                            "projectType": "$projectType"
                                                        }}, 
                                                        {$lookup: {
                                                            from: "schoolTeams",
                                                            localField: "playerBId",
                                                            foreignField: "_id",
                                                            as: "userDetB"
                                                        }}, 
                                                        {$unwind: "$userDetB"}, 
                                                        {"$project": {
                                                            "playerNameA": "$playerAName",
                                                            "playerBSchoolId":"$userDetB.schoolId",
                                                            "playerASchoolId":"$playerASchoolId",
                                                            "tournamentId": "$tournamentId",
                                                            "eventName": "$eventName",
                                                            "eventOrganizer": "$eventOrganizer",
                                                            "matchNumber": "$matchNumber",
                                                            "roundNumber": "$roundNumber",
                                                            "playerAID": "$playerAId",
                                                            "playerBID": "$playerBId",
                                                            "status": "$status",
                                                            "scoresA": "$scoresA",
                                                            "scoresB": "$scoresB",
                                                            "playerNameB": "$userDetB.teamName",
                                                            "roundName": "$roundName",
                                                            "projectType": "$projectType"
                                                        }}
                                                    ])

                                                }
                                                else
                                                {
                                                    getTeamView = liveScores.aggregate([
                                                        {$match: {
                                                            "tournamentId": xData.tournamentId,
                                                            "eventName": xData.eventName,
                                                         "matchNumber": parseInt(xData.matchNumber),
                                                         "status" : "inprogress"
                                                        }}, 
                                                        {$lookup: {
                                                            from: "playerTeams",
                                                            localField: "playerAId",
                                                            foreignField: "_id",
                                                            as: "userDet"
                                                        }}, 
                                                        {$unwind: "$userDet"}, 
                                                        {"$project": {
                                                            "playerAName": "$userDet.teamName",
                                                            "playerASchoolId":"$userDet.schoolId",
                                                            "tournamentId": "$tournamentId",
                                                            "eventName": "$eventName",
                                                            "eventOrganizer": "$eventOrganizer",
                                                            "matchNumber": "$matchNumber",
                                                            "roundNumber": "$roundNumber",
                                                            "playerAId": "$playerAId",
                                                            "playerBId": "$playerBId",
                                                            "status": "$status",
                                                            "scoresA": "$scoresA",
                                                            "scoresB": "$scoresB",
                                                            "roundName": "$roundName",
                                                            "projectType": "$projectType"
                                                        }}, 
                                                        {$lookup: {
                                                            from: "playerTeams",
                                                            localField: "playerBId",
                                                            foreignField: "_id",
                                                            as: "userDetB"
                                                        }}, 
                                                        {$unwind: "$userDetB"}, 
                                                        {"$project": {
                                                            "playerNameA": "$playerAName",
                                                            "playerBSchoolId":"$userDetB.schoolId",
                                                            "playerASchoolId":"$playerASchoolId",
                                                            "tournamentId": "$tournamentId",
                                                            "eventName": "$eventName",
                                                            "eventOrganizer": "$eventOrganizer",
                                                            "matchNumber": "$matchNumber",
                                                            "roundNumber": "$roundNumber",
                                                            "playerAID": "$playerAId",
                                                            "playerBID": "$playerBId",
                                                            "status": "$status",
                                                            "scoresA": "$scoresA",
                                                            "scoresB": "$scoresB",
                                                            "playerNameB": "$userDetB.teamName",
                                                            "roundName": "$roundName",
                                                            "projectType": "$projectType"
                                                        }}
                                                    ])

                                                }
                                                

                                                if(getTeamView && getTeamView.length){

                                                    if(getTeamView[0] && getTeamView[0] && getTeamView[0].playerASchoolId){
                                                        var schoolDetailsdata = schoolDetails.findOne({
                                                            "userId":getTeamView[0].playerASchoolId
                                                        }) 

                                                        if(schoolDetailsdata && schoolDetailsdata.interestedDomainName && 
                                                            schoolDetailsdata.interestedDomainName.length){
                                                            var doma = domains.findOne({
                                                                "_id":schoolDetailsdata.interestedDomainName[0]
                                                            })
                                                            if(doma && doma.domainName){
                                                                getTeamView[0].playerNameA = getTeamView[0].playerNameA + " ," + doma.domainName
                                                            }
                                                        }
                                                    }

                                                    if(getTeamView[0] && getTeamView[0] && getTeamView[0].playerBSchoolId){
                                                        var schoolDetailsdata = schoolDetails.findOne({
                                                            "userId":getTeamView[0].playerBSchoolId
                                                        }) 
                                                        if(schoolDetailsdata && schoolDetailsdata.interestedDomainName && 
                                                            schoolDetailsdata.interestedDomainName.length){
                                                            var doma = domains.findOne({
                                                                "_id":schoolDetailsdata.interestedDomainName[0]
                                                            })
                                                            if(doma && doma.domainName){
                                                                getTeamView[0].playerNameB = getTeamView[0].playerNameB + " ," + doma.domainName
                                                            }
                                                        }
                                                    }

                                                    res.status = SUCCESS_STATUS
                                                    res.message = SUCCESS_LIVE_SCORES_TEAM_DETAILS
                                                    res.teamDetails = getTeamView
                                                }
                                                if(getTeamDetails && getTeamDetails.length){
                                                    res.status = SUCCESS_STATUS
                                                    res.data = getTeamDetails
                                                    res.message = SUCCESS_LIVE_SCORES_TEAM_DETAILS
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
        }catch(e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.message = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

mapOrders = function(array, order, key) {
    var orders = schoolEventsToFind.findOne({
        "key":"School"
    })

    if(orders && orders.sortOrderAbb && orders.sortOrderAbb.length){
        order = orders.sortOrderAbb
        array.sort(function(a, b) {
            var A = a[key],
                B = b[key];

            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            } else {
                return -1;
            }

        });
    }
    if(array && array.length){
        array = bubbleSort(array)
    }
    return array;
};

function bubbleSort(a) {
    try{
        var swapped;
        do {
            swapped = false;
            for (var i=0; i < a.length-1; i++) {
                if(a[i].eventName == a[i+1].eventName){
                    if (a[i].matchNumber > a[i+1].matchNumber) {
                        var temp = a[i];
                        a[i] = a[i+1];
                        a[i+1] = temp;
                        swapped = true;
                    }
                }
            }
        } while (swapped);
        return a
    }catch(e){
        return a
    }
}