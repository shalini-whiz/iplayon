Meteor.methods({
    "getSchoolPlayerDetailsFan": function(xData) {
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

            if (xData) {


                if (true) {

                    if (xData.userId) {

                        var usersDet = Meteor.users.findOne({
                            userId: xData.userId
                        })
                        if (usersDet) {
                            if (true) {
                                query = {
                                    "userId": xData.userId
                                }

                                var schoolPlayerDet = schoolPlayers.findOne(query)
                                if (schoolPlayerDet) {
                                    var allDet = schoolPlayers.aggregate([{
                                        $match: query
                                    }, {
                                        $lookup: {
                                            from: "schoolDetails",
                                            localField: "schoolId",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "usersDet" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: "$usersDet"
                                    }, {
                                        $project: {
                                            userName: "$userName",
                                            dateOfBirth: "$dateOfBirth",
                                            gender: "$gender",
                                            address: "$address",
                                            city: "$city",
                                            pinCode: "$pinCode",
                                            guardianName: "$guardianName",
                                            country: "$country",
                                            schoolName: "$usersDet.schoolName",
                                            state: "$state",
                                            country: "$country",
                                            userId: "$userId",
                                            class: "$class",
                                            "standard":"$class"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "domains",
                                            localField: "state",
                                            // name of users table field,
                                            foreignField: "_id",
                                            as: "domainDet" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: "$domainDet"
                                    }, {
                                        $project: {
                                            userName: "$userName",
                                            dateOfBirth: "$dateOfBirth",
                                            gender: "$gender",
                                            address: "$address",
                                            city: "$city",
                                            pinCode: "$pinCode",
                                            guardianName: "$guardianName",
                                            country: "$country",
                                            schoolName: "$schoolName",
                                            state: "$domainDet.domainName",
                                            country: "$country",
                                            userId: "$userId",
                                            class: "$class",
                                            "standard":"$standard"
                                        }
                                    }])
                                    if (allDet && allDet.length && allDet[0]) {
                                        if (allDet[0].dateOfBirth) {
                                            allDet[0].dateOfBirth = moment(new Date(allDet[0].dateOfBirth)).format("DD MMM YYYY")
                                        }
                                        res.data = allDet[0]
                                        res.message = "user details"
                                        res.status = "success"
                                    }
                                } else {
                                    res.message = "Invalid school player detail"
                                }
                            }
                        } else {
                            res.message = "Invalid user detail"
                        }
                    } else {
                        res.message = "Invalid user"
                    }
                }
            } else {
                res.message = "xData is null"
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
    "teamDetailedDrawsForTournamenIdEvent": function(xData) {
        var res = {
            "status": "failure",
            "data": 0,
            "message": "no detailed draws yet"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData && xData.tournamentId) {

                if (true) {

                    if (xData.eventName) {
                        if (xData.matchNumber) {

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


                                if (det && det.projectType == 2) {
                                    var eventList = teamDetailedScores.aggregate([{
                                        $match: query
                                    }, {
                                        $unwind: {
                                            path: "$teamDetScore",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $match: {
                                            "teamDetScore.matchNumber": parseInt(xData.matchNumber)
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamDetScore.teamAID",
                                            teamBID: "$teamDetScore.teamBID",
                                            finalTeamWinner: "$teamDetScore.finalTeamWinner",
                                            teamMatchType: "$teamDetScore.teamMatchType",
                                            "matchAVSX": "$teamDetScore.matchAVSX",
                                            "matchBVSY": "$teamDetScore.matchBVsY",
                                            "matchBVSX": "$teamDetScore.matchBVsX",
                                            "matchAVSY": "$teamDetScore.matchAVsY",
                                            "matchDoubles": "$teamDetScore.matchDoubles"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "schoolTeams",
                                            localField: "teamAID",
                                            // name of users table field,
                                            foreignField: "_id",
                                            as: "teamADet" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$teamADet",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",
                                            "teamAName": "$teamADet.teamName"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "schoolTeams",
                                            localField: "teamBID",
                                            // name of users table field,
                                            foreignField: "_id",
                                            as: "teamBDet" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$teamBDet",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",
                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBDet.teamName"
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchAVSX",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchAVSX.playerAID",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "AVXPlayer" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$AVXPlayer",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",
                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayer.userName",
                                            "AVXPlayerAId": "$matchAVSX.playerAID"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchAVSX.playerBID",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "AVXPlayerB" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$AVXPlayerB",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",
                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB.userName",
                                            "AVXmatchType": "$matchAVSX.matchType",
                                            "AVXWinnerPlayerId": "$matchAVSX.winnerIdPlayer",
                                            "AVXSetScoresA": "$matchAVSX.setScoresA",
                                            "AVXSetScoresB": "$matchAVSX.setScoresB",
                                            "AVXWinnerTeamId": "$matchAVSX.winnerIdTeam",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$matchAVSX.playerBID"
                                        } //end of avx
                                    }, {
                                        $unwind: {
                                            path: "$matchBVSY",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchBVSY.playerAID",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "BVYPlayer" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$BVYPlayer",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",
                                            //
                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXWinnerTeamId": "$AVXWinnerTeamId",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",

                                            "BVYPlayerA": "$BVYPlayer.userName",
                                            "BVYPlayerAId": "$matchBVSY.playerAID"
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchBVSY",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchBVSY.playerBID",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "BVYPlayerB" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$BVYPlayerB",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",

                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB.userName",
                                            "BVYmatchType": "$matchBVSY.matchType",
                                            "BVYWinnerPlayerId": "$matchBVSY.winnerIdPlayer",
                                            "BVYSetScoresA": "$matchBVSY.setScoresA",
                                            "BVYSetScoresB": "$matchBVSY.setScoresB",
                                            "BVYWinnerTeamId": "$matchBVSY.winnerIdTeam",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$matchBVSY.playerBID",

                                        } //end bvy
                                    }, {
                                        $unwind: {
                                            path: "$matchBVSX",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchBVSX.playerAID",
                                            // name of users table field
                                            foreignField: "userId",
                                            as: "BVXPlayer" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$BVXPlayer",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",
                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB",
                                            "BVYmatchType": "$BVYmatchType",
                                            "BVYWinnerPlayerId": "$BVYWinnerPlayerId",
                                            "BVYSetScoresA": "$BVYSetScoresA",
                                            "BVYSetScoresB": "$BVYSetScoresB",
                                            "BVYWinnerTeamId": "$BVYWinnerTeamId",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$BVYPlayerBId",

                                            "BVXPlayerA": "$BVXPlayer.userName",
                                            "BVXPlayerAId": "$matchBVSX.playerAID"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchBVSX.playerBID",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "BVXPlayerB" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$BVXPlayerB",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",

                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB",
                                            "BVYmatchType": "$BVYmatchType",
                                            "BVYWinnerPlayerId": "$BVYWinnerPlayerId",
                                            "BVYSetScoresA": "$BVYSetScoresA",
                                            "BVYSetScoresB": "$BVYSetScoresB",
                                            "BVYWinnerTeamId": "$BVYWinnerTeamId",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$BVYPlayerBId",

                                            "BVXPlayerA": "$BVXPlayerA",
                                            "BVXPlayerB": "$BVXPlayerB.userName",
                                            "BVXmatchType": "$matchBVSX.matchType",
                                            "BVXWinnerPlayerId": "$matchBVSX.winnerIdPlayer",
                                            "BVXSetScoresA": "$matchBVSX.setScoresA",
                                            "BVXSetScoresB": "$matchBVSX.setScoresB",
                                            "BVXWinnerTeamId": "$matchBVSX.winnerIdTeam",
                                            "BVXPlayerAId": "$BVXPlayerAId",
                                            "BVXPlayerBId": "$matchBVSX.playerBID",

                                        } //end of bvx
                                    }, {
                                        $unwind: {
                                            path: "$matchAVSY",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchAVSY.playerAID",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "AVYPlayer" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$AVYPlayer",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchAVSX": "$matchAVSX",
                                            "matchBVSY": "$matchBVSY",
                                            "matchBVSX": "$matchBVSX",
                                            "matchAVSY": "$matchAVSY",
                                            "matchDoubles": "$matchDoubles",

                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB",
                                            "BVYmatchType": "$BVYmatchType",
                                            "BVYWinnerPlayerId": "$BVYWinnerPlayerId",
                                            "BVYSetScoresA": "$BVYSetScoresA",
                                            "BVYSetScoresB": "$BVYSetScoresB",
                                            "BVYWinnerTeamId": "$BVYWinnerTeamId",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$BVYPlayerBId",

                                            "BVXPlayerA": "$BVXPlayerA",
                                            "BVXPlayerB": "$BVXPlayerB",
                                            "BVXmatchType": "$BVXmatchType",
                                            "BVXWinnerPlayerId": "$BVXWinnerPlayerId",
                                            "BVXSetScoresA": "$BVXSetScoresA",
                                            "BVXSetScoresB": "$BVXSetScoresB",
                                            "BVXWinnerTeamId": "$BVXWinnerTeamId",
                                            "BVXPlayerAId": "$BVXPlayerAId",
                                            "BVXPlayerBId": "$BVXPlayerBId",

                                            "AVYPlayerA": "$AVYPlayer.userName",
                                            "AVYPlayerAId": "$matchAVSY.playerAID"

                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchAVSY",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchAVSY.playerBID",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "AVYPlayerB" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$AVYPlayerB",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchDoubles": "$matchDoubles",

                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB",
                                            "BVYmatchType": "$BVYmatchType",
                                            "BVYWinnerPlayerId": "$BVYWinnerPlayerId",
                                            "BVYSetScoresA": "$BVYSetScoresA",
                                            "BVYSetScoresB": "$BVYSetScoresB",
                                            "BVYWinnerTeamId": "$BVYWinnerTeamId",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$BVYPlayerBId",

                                            "BVXPlayerA": "$BVXPlayerA",
                                            "BVXPlayerB": "$BVXPlayerB",
                                            "BVXmatchType": "$BVXmatchType",
                                            "BVXWinnerPlayerId": "$BVXWinnerPlayerId",
                                            "BVXSetScoresA": "$BVXSetScoresA",
                                            "BVXSetScoresB": "$BVXSetScoresB",
                                            "BVXWinnerTeamId": "$BVXWinnerTeamId",
                                            "BVXPlayerAId": "$BVXPlayerAId",
                                            "BVXPlayerBId": "$BVXPlayerBId",

                                            "AVYPlayerA": "$AVYPlayerA",
                                            "AVYPlayerB": "$AVYPlayerB.userName",
                                            "AVYPlayerAId": "$AVYPlayerAId",
                                            "AVYPlayerBId": "$matchAVSY.playerBID",
                                            "AVYmatchType": "$matchAVSY.matchType",
                                            "AVYWinnerPlayerId": "$matchAVSY.winnerIdPlayer",
                                            "AVYSetScoresA": "$matchAVSY.setScoresA",
                                            "AVYSetScoresB": "$matchAVSY.setScoresB",
                                            "AVYWinnerTeamId": "$matchAVSY.winnerIdTeam",
                                        } //end of avy
                                    }, {
                                        $unwind: {
                                            path: "$matchDoubles",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchDoubles.teamAD1PlayerId",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "teamAD1Player" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$teamAD1Player",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchDoubles": "$matchDoubles",

                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB",
                                            "BVYmatchType": "$BVYmatchType",
                                            "BVYWinnerPlayerId": "$BVYWinnerPlayerId",
                                            "BVYSetScoresA": "$BVYSetScoresA",
                                            "BVYSetScoresB": "$BVYSetScoresB",
                                            "BVYWinnerTeamId": "$BVYWinnerTeamId",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$BVYPlayerBId",

                                            "BVXPlayerA": "$BVXPlayerA",
                                            "BVXPlayerB": "$BVXPlayerB",
                                            "BVXmatchType": "$BVXmatchType",
                                            "BVXWinnerPlayerId": "$BVXWinnerPlayerId",
                                            "BVXSetScoresA": "$BVXSetScoresA",
                                            "BVXSetScoresB": "$BVXSetScoresB",
                                            "BVXWinnerTeamId": "$BVXWinnerTeamId",
                                            "BVXPlayerAId": "$BVXPlayerAId",
                                            "BVXPlayerBId": "$BVXPlayerBId",

                                            "AVYPlayerA": "$AVYPlayerA",
                                            "AVYPlayerB": "$AVYPlayerB",
                                            "AVYPlayerAId": "$AVYPlayerAId",
                                            "AVYPlayerBId": "$AVYPlayerBId",
                                            "AVYmatchType": "$AVYmatchType",
                                            "AVYWinnerPlayerId": "$AVYWinnerPlayerId",
                                            "AVYSetScoresA": "$AVYSetScoresA",
                                            "AVYSetScoresB": "$AVYSetScoresB",
                                            "AVYWinnerTeamId": "$AVYWinnerTeamId",

                                            "DOUBT1PlayerAId": "$matchDoubles.teamAD1PlayerId",
                                            "DOUBT1PlayerAName": "$teamAD1Player.userName"
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchDoubles",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchDoubles.teamAD2PlayerId",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "teamAD2Player" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$teamAD2Player",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchDoubles": "$matchDoubles",

                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB",
                                            "BVYmatchType": "$BVYmatchType",
                                            "BVYWinnerPlayerId": "$BVYWinnerPlayerId",
                                            "BVYSetScoresA": "$BVYSetScoresA",
                                            "BVYSetScoresB": "$BVYSetScoresB",
                                            "BVYWinnerTeamId": "$BVYWinnerTeamId",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$BVYPlayerBId",

                                            "BVXPlayerA": "$BVXPlayerA",
                                            "BVXPlayerB": "$BVXPlayerB",
                                            "BVXmatchType": "$BVXmatchType",
                                            "BVXWinnerPlayerId": "$BVXWinnerPlayerId",
                                            "BVXSetScoresA": "$BVXSetScoresA",
                                            "BVXSetScoresB": "$BVXSetScoresB",
                                            "BVXWinnerTeamId": "$BVXWinnerTeamId",
                                            "BVXPlayerAId": "$BVXPlayerAId",
                                            "BVXPlayerBId": "$BVXPlayerBId",

                                            "AVYPlayerA": "$AVYPlayerA",
                                            "AVYPlayerB": "$AVYPlayerB",
                                            "AVYPlayerAId": "$AVYPlayerAId",
                                            "AVYPlayerBId": "$AVYPlayerBId",
                                            "AVYmatchType": "$AVYmatchType",
                                            "AVYWinnerPlayerId": "$AVYWinnerPlayerId",
                                            "AVYSetScoresA": "$AVYSetScoresA",
                                            "AVYSetScoresB": "$AVYSetScoresB",
                                            "AVYWinnerTeamId": "$AVYWinnerTeamId",

                                            "DOUBT1PlayerAId": "$DOUBT1PlayerAId",
                                            "DOUBT1PlayerAName": "$DOUBT1PlayerAName",

                                            "DOUBT1PlayerBId": "$matchDoubles.teamAD2PlayerId",
                                            "DOUBT1PlayerBName": "$teamAD2Player.userName"
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchDoubles",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchDoubles.teamBD1PlayerId",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "teamBD1Player" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$teamBD1Player",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",
                                            "matchDoubles": "$matchDoubles",

                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB",
                                            "BVYmatchType": "$BVYmatchType",
                                            "BVYWinnerPlayerId": "$BVYWinnerPlayerId",
                                            "BVYSetScoresA": "$BVYSetScoresA",
                                            "BVYSetScoresB": "$BVYSetScoresB",
                                            "BVYWinnerTeamId": "$BVYWinnerTeamId",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$BVYPlayerBId",

                                            "BVXPlayerA": "$BVXPlayerA",
                                            "BVXPlayerB": "$BVXPlayerB",
                                            "BVXmatchType": "$BVXmatchType",
                                            "BVXWinnerPlayerId": "$BVXWinnerPlayerId",
                                            "BVXSetScoresA": "$BVXSetScoresA",
                                            "BVXSetScoresB": "$BVXSetScoresB",
                                            "BVXWinnerTeamId": "$BVXWinnerTeamId",
                                            "BVXPlayerAId": "$BVXPlayerAId",
                                            "BVXPlayerBId": "$BVXPlayerBId",

                                            "AVYPlayerA": "$AVYPlayerA",
                                            "AVYPlayerB": "$AVYPlayerB",
                                            "AVYPlayerAId": "$AVYPlayerAId",
                                            "AVYPlayerBId": "$AVYPlayerBId",
                                            "AVYmatchType": "$AVYmatchType",
                                            "AVYWinnerPlayerId": "$AVYWinnerPlayerId",
                                            "AVYSetScoresA": "$AVYSetScoresA",
                                            "AVYSetScoresB": "$AVYSetScoresB",
                                            "AVYWinnerTeamId": "$AVYWinnerTeamId",

                                            "DOUBT1PlayerAId": "$DOUBT1PlayerAId",
                                            "DOUBT1PlayerAName": "$DOUBT1PlayerAName",

                                            "DOUBT1PlayerBId": "$DOUBT1PlayerBId",
                                            "DOUBT1PlayerBName": "$DOUBT1PlayerBName",

                                            "DOUBT2PlayerAId": "$matchDoubles.teamBD1PlayerId",
                                            "DOUBT2PlayerAName": "$teamBD1Player.userName"
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchDoubles",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "matchDoubles.teamBD2PlayerId",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "teamBD2Player" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$teamBD2Player",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            teamAID: "$teamAID",
                                            teamBID: "$teamBID",
                                            finalTeamWinner: "$finalTeamWinner",
                                            teamMatchType: "$teamMatchType",

                                            "teamAName": "$teamAName",
                                            "teamBName": "$teamBName",
                                            "AVXPlayerA": "$AVXPlayerA",
                                            "AVXPlayerB": "$AVXPlayerB",
                                            "AVXmatchType": "$AVXmatchType",
                                            "AVXWinnerPlayerId": "$AVXWinnerPlayerId",
                                            "AVXSetScoresA": "$AVXSetScoresA",
                                            "AVXSetScoresB": "$AVXSetScoresB",
                                            "AVXPlayerAId": "$AVXPlayerAId",
                                            "AVXPlayerBId": "$AVXPlayerBId",
                                            "AVXWinnerTeamId":"$AVXWinnerTeamId",

                                            "BVYPlayerA": "$BVYPlayerA",
                                            "BVYPlayerB": "$BVYPlayerB",
                                            "BVYmatchType": "$BVYmatchType",
                                            "BVYWinnerPlayerId": "$BVYWinnerPlayerId",
                                            "BVYSetScoresA": "$BVYSetScoresA",
                                            "BVYSetScoresB": "$BVYSetScoresB",
                                            "BVYWinnerTeamId": "$BVYWinnerTeamId",
                                            "BVYPlayerAId": "$BVYPlayerAId",
                                            "BVYPlayerBId": "$BVYPlayerBId",

                                            "BVXPlayerA": "$BVXPlayerA",
                                            "BVXPlayerB": "$BVXPlayerB",
                                            "BVXmatchType": "$BVXmatchType",
                                            "BVXWinnerPlayerId": "$BVXWinnerPlayerId",
                                            "BVXSetScoresA": "$BVXSetScoresA",
                                            "BVXSetScoresB": "$BVXSetScoresB",
                                            "BVXWinnerTeamId": "$BVXWinnerTeamId",
                                            "BVXPlayerAId": "$BVXPlayerAId",
                                            "BVXPlayerBId": "$BVXPlayerBId",

                                            "AVYPlayerA": "$AVYPlayerA",
                                            "AVYPlayerB": "$AVYPlayerB",
                                            "AVYPlayerAId": "$AVYPlayerAId",
                                            "AVYPlayerBId": "$AVYPlayerBId",
                                            "AVYmatchType": "$AVYmatchType",
                                            "AVYWinnerPlayerId": "$AVYWinnerPlayerId",
                                            "AVYSetScoresA": "$AVYSetScoresA",
                                            "AVYSetScoresB": "$AVYSetScoresB",
                                            "AVYWinnerTeamId": "$AVYWinnerTeamId",

                                            "DOUBT1PlayerAId": "$DOUBT1PlayerAId",
                                            "DOUBT1PlayerAName": "$DOUBT1PlayerAName",

                                            "DOUBT1PlayerBId": "$DOUBT1PlayerBId",
                                            "DOUBT1PlayerBName": "$DOUBT1PlayerBName",

                                            "DOUBT2PlayerAId": "$DOUBT2PlayerAId",
                                            "DOUBT2PlayerAName": "$DOUBT2PlayerAName",

                                            "DOUBT2PlayerBId": "$matchDoubles.teamBD2PlayerId",
                                            "DOUBT2PlayerBName": "$teamBD2Player.userName",
                                            "DOUBWinnerPlayerAId": "$matchDoubles.winnerD1PlayerId",
                                            "DOUBWinnerPlayerBId": "$matchDoubles.winnerD2PlayerId",
                                            "DOUBSetScoresA": "$matchDoubles.setScoresA",
                                            "DOUBSetScoresB": "$matchDoubles.setScoresB",
                                            "DOUBMatchType": "$matchDoubles.matchType",
                                            "DOUBWinnerTeamId": "$matchDoubles.winnerIdTeam"
                                        }
                                    }])
                                    if (eventList && eventList.length && eventList[0]) {
                                        res.status = "success"
                                        res.message = "draws fetched"
                                        res.data = eventList[0]
                                    }
                                } else {
                                    res.message = "Invalid event"
                                }
                            }
                        } else {
                            res.message = "match number is required"
                        }
                    } else {
                        res.message = "event name is required"
                    }
                }
            } else {
                res.message = "tournament Id is required"
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
    "teamDetailsSchoolsAPI":function(xData){
        var res = {
            "status": "failure",
            "data": 0,
            "message": "no team details"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData && xData.teamId) {

                if (true) {

                    if (true) {
                        if (true) {

                            var query = {}
                            var query2 = {}
                            var message = ""

                            if (true) {
                                query = {
                                    "_id": xData.teamId,
                                }

                                var det = schoolTeams.findOne(query,{fields:{
                                    "teamName":1,"schoolName":1,"teamManager":1,"_id":1,"schoolId":1
                                }})
                                var shol = true
                                if(det==undefined || det==null){
                                    det = playerTeams.findOne(query,{fields:{
                                        "teamName":1,"teamManager":1,"_id":1

                                    }})
                                    if(det){
                                        shol = true
                                    }
                                }

                                if (det && shol==true) 
                                {
                                    var dataList = schoolTeams.aggregate([{
                                        $match: query
                                    }, {
                                        $unwind: {
                                            path: "$teamMembers",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $match: {
                                            "teamMembers.teamEvent": true
                                        }
                                    }, {
                                        $lookup: {
                                            from: "users",
                                            localField: "teamMembers.playerId",
                                            // name of users table field,
                                            foreignField: "userId",
                                            as: "userDet" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$userDet",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }, {
                                        $project: {
                                            "_id": "$_id",
                                            "userId": "$teamMembers.playerId",
                                            "playerNum": "$teamMembers.playerNumber",
                                            "userName": "$userDet.userName",
                                            "teamName": "$teamName",
                                            "schoolId":"$schoolId"
                                        }
                                    }])

                                    if(dataList && dataList.length)
                                    {
                                        if(dataList[0] && dataList[0].schoolId){
                                            var findSchoolDomain = schoolDetails.findOne({
                                                "userId":dataList[0].schoolId
                                            })

                                            if(findSchoolDomain && findSchoolDomain.interestedDomainName && 
                                                findSchoolDomain.interestedDomainName.length && findSchoolDomain.interestedDomainName[0]){
                                                var domainsName = domains.findOne({"_id":findSchoolDomain.interestedDomainName[0]})
                                                if(domainsName && domainsName.domainName){
                                                    if(dataList[0].teamName){
                                                        dataList[0].teamName  = dataList[0].teamName + " , "+domainsName.domainName
                                                    }
                                                }
                                            }
                                        }

                                        var newTeamName = "";
                                         
                                        if(det && det.teamName)
                                        {
                                            newTeamName = det.teamName;
                                            if(det.schoolId)
                                            {
                                                var schoolInfo = schoolDetails.findOne({"userId":det.schoolId});
                                                if(schoolInfo && schoolInfo.state)
                                                {
                                                    var domainInfo = domains.findOne({"_id":schoolInfo.state});
                                                    if(domainInfo && domainInfo.domainName)
                                                    {
                                                        newTeamName = det.teamName+", "+domainInfo.domainName;
                                                    }
                                                }

                                            }

                                        }
                                        det.teamName = newTeamName;

                                        res.message = "Team details"
                                        res.data = dataList
                                        res["teamData"] = det;
                                        res.status = "success"
                                    }
                                    else {
                                        var checkTeamPresentPlayerTeams = playerTeams.aggregate([{
                                            $match: query
                                        }, {
                                            $unwind: {
                                                path: "$teamMembers",
                                                preserveNullAndEmptyArrays: true
                                            }
                                        }, {
                                            $lookup: {
                                                from: "users",
                                                localField: "teamMembers.playerId",
                                                // name of users table field,
                                                foreignField: "userId",
                                                as: "userDet" // alias for userinfo table
                                            }
                                        }, {
                                            $unwind: {
                                                path: "$userDet",
                                                preserveNullAndEmptyArrays: true
                                            }
                                        }, {
                                            $project: {
                                                "_id": "$_id",
                                                "userId": "$teamMembers.playerId",
                                                "playerNum": "$teamMembers.playerNumber",
                                                "userName": "$userDet.userName",
                                                "teamName": "$teamName",
                                            }
                                        }])
                                        if(checkTeamPresentPlayerTeams && checkTeamPresentPlayerTeams.length)
                                        {
                                                                      
                                            res.message = "Team details"
                                            res.data = checkTeamPresentPlayerTeams
                                            res.status = "success"
                                            if(det)
                                                res["teamData"] = det;

                                        }

                                    }
                                } else if(shol==false){
                                    res.message = "no team details"
                                }
                                
                            }
                        } else {
                            res.message = "match number is required"
                        }
                    } 
                }
            } else {
                res.message = "team is required"
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
    getevenSportsDates:function(xData){
        var res = {
            "status": "failure",
            "data": 0,
            "message": "No Upcoming Events"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData && xData.eventOrganizer) {

                if (true) {

                    if (true) {
                        if (true) {

                            var query = {}
                            var query2 = {}
                            var message = ""

                            if (true) {
                                query = {
                                    "eventOrganizer": xData.eventOrganizer,
                                }

                                var det = evenSportsDates.findOne(query)
                                if (det) {
                                    var dataList = evenSportsDates.aggregate([{
                                        $match: query
                                    }, {
                                        $unwind: {
                                            path: "$eventOrTournamentIds",
                                        }
                                    }, {
                                        $lookup: {
                                            from: "events",
                                            localField: "eventOrTournamentIds",
                                            // name of users table field,
                                            foreignField: "_id",
                                            as: "eventDet" // alias for userinfo table
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$eventDet",
                                        }
                                    },{
                                        $project:{
                                            "eventName":"$eventDet.eventName",
                                            "eventStartDate":"$eventDet.eventStartDate",
                                            "eventEndDate":"$eventDet.eventEndDate",
                                            "venue":"$eventDet.domainName",
                                            "toDate":"$toDate"
                                        }
                                    }])


                                    if(dataList)
                                    {
                                        var displaynamesForTeam = schoolEventsToFind.findOne({
                                            key:"School"
                                        })

                                        if(displaynamesForTeam)
                                        {
                                            var dispNamesTeam = displaynamesForTeam.dispNamesTeam;
                                            var orgNames = displaynamesForTeam.teamEventNAME;
                                            var customList = _.map(dataList, function(jsonObj)
                                            { 
                                               var eventName = jsonObj.eventName;
                                               var pos = orgNames.indexOf(eventName);
                                                if(pos > -1 && dispNamesTeam[pos] != undefined)
                                                {
                                                    jsonObj["customEvent"]  = dispNamesTeam[pos];
                                                }
                                                else
                                                    jsonObj["customEvent"] = eventName;
                                            });
                                        }
                                       
                                        res.message = "sport dates"
                                        res.data = dataList
                                        res.status = "success"
                                    }
                                } else {
                                    res.message = "No Upcoming Events"
                                }
                                
                            }
                        } 
                    } 
                }
            } else {
                res.message = "eventOrganizer is required"
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
    getTournamentTypesCall:function(){
        try{
            var s = schoolEventsToFind.findOne({
            })
            if(s && s.tournamentTypes){
                return s.tournamentTypes
            }
        }catch(e){

        }
    }
})