import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({
    "sendResultEmail_Team": async function(tournamentId, eventName) {
        try {
            var returnRESp = []
            var errREsp;
            var finalTeamWinner = ""
            var eveDet = events.findOne({"tournamentId":tournamentId,"eventName":eventName});
            var tourDet = events.findOne({"_id":tournamentId});
            if(eveDet==undefined){
                eveDet = pastEvents.findOne({'tournamentId':tournamentId,'eventName':eventName})
            }
            if(tourDet==undefined){
                tourDet = pastEvents.findOne({'_id':tournamentId})
            }
            var res = await Meteor.call("fetchROUNDSDetails",tournamentId,eventName,"F")
            try{
                if(true){
                    if(res&&res[0]){
                        returnRESp.push(res[0])
                        if(res[0]&&res[0].teamInfo&&res[0].teamInfo[0].teamFinalWinner){
                            finalTeamWinner = res[0].teamInfo[0].teamFinalWinner
                        }
                        var res2 = await Meteor.call("fetchROUNDSDetails",tournamentId,eventName,"SF")
                        try{
                            if(true){
                                if(res2&&res2[0]){
                                    returnRESp.push(res2[0])
                                    var res3 = await Meteor.call("fetchROUNDSDetails",tournamentId,eventName,"QF")
                                    try{
                                        if(true){
                                            returnRESp.push(res3[0])
                                        }
                                    }catch(e){
                                        errREsp = false
                                    }
                                    
                                }
                            }
                        }catch(e){
                            errREsp = false
                        }
                    }
                }
            }catch(e){
                errREsp = false
            }
            var tournamentName = "";
            var tournamentAddress = "";
            var tournamentStartDate  = "";
            var tournamentEndDate = "";
            if(tourDet&&tourDet.domainName){
                tournamentAddress = tourDet.domainName
            }
            if(tourDet&&tourDet.eventStartDate){
                tournamentStartDate = tourDet.eventStartDate
            }
            if(tourDet&&tourDet.eventEndDate){
                tournamentEndDate = tourDet.eventEndDate
            }
            if(tourDet && tourDet.eventName)
                tournamentName = tourDet.eventName

            var data = {
                "tournamentName":tournamentName,
                "tournamentAddress":tournamentAddress,
                "tournamentStartDate":tournamentStartDate,
                "tournamentEndDate":tournamentEndDate,
                "eventName":eventName,
                "winner":finalTeamWinner,
                rounds:returnRESp
            }
            return data;
        } catch (e) {
        }
    }
});

Meteor.methods({
    "fetchROUNDSDetails": function(tournamentId, eventName, roundName) {
        try {
            var rounds = [];
            var playerInfo = "";
            var teamFinalWinner = "";
            var teamInfo = []
            var data = {}
            var teamForQF = teamMatchCollectionDB.aggregate([{
                $match: {
                    tournamentId: tournamentId,
                    "eventName": eventName
                }
            }, {
                $unwind: "$matchRecords"
            }, {
                $match: {
                    "matchRecords.roundName": roundName,
                    "matchRecords.status": {
                        $in: ["walkover", "bye", "completed"]
                    }
                }
            }])
            if (teamForQF) {
                var round = ""
                if(roundName=="QF")
                    round = "Quarter Final"
                else if(roundName=="SF")
                    round = "Semi Final"
                else if(roundName=="F")
                    round = "Final"

                    //for each match
                for (var i = 0; i < teamForQF.length; i++) {
                    //get the matchnumber and round number
                    var matchNumber = teamForQF[i].matchRecords.matchNumber
                    var roundNumber = teamForQF[i].matchRecords.roundNumber

                    var detmatchRecords = teamForQF[i].matchRecords
                    if (detmatchRecords) {
                        var winTEamId = ""
                        if (detmatchRecords.winnerID) {
                            winTEamId = detmatchRecords.winnerID
                        }

                        var teamaid = ""
                        if (detmatchRecords.teamsID.teamAId) {
                            teamaid = detmatchRecords.teamsID.teamAId
                        }

                        var teambid = ""
                        if (detmatchRecords.teamsID.teamBId) {
                            teambid = detmatchRecords.teamsID.teamBId
                        }

                        var teamaname = ""
                        if (detmatchRecords.teams.teamA) {
                            teamaname = detmatchRecords.teams.teamA
                        }
                        var teambname = ""
                        if (detmatchRecords.teams.teamB) {
                            teambname = detmatchRecords.teams.teamB
                        }

                        if (detmatchRecords.status.toLowerCase() == "bye") {
                            if (winTEamId == teamaid) {
                                var dat = "";
                                if (teamaname){
                                    dat = teamaname + " qualified via bye ";
                                    teamFinalWinner = teamaname
                                }
                                if (teamaname && teambname){
                                    dat = teamaname + " qualified via bye against " + teambname
                                    teamFinalWinner = teamaname
                                }
                                if (dat.trim().length !== 0){
                                    playerInfo = dat
                                }
                            } else if (winTEamId == teambid) {
                                var dat;
                                if (teambname){
                                    dat = teambname + " qualified via bye ";
                                    teamFinalWinner = teambname
                                }
                                if (teamaname && teambname){
                                    dat = teambname + " qualified via bye against " + teamaname
                                    teamFinalWinner = teambname
                                }
                                if (dat.trim().length !== 0){
                                    playerInfo = dat
                                }
                            }
                        } else if (detmatchRecords.status.toLowerCase() == "walkover") {
                            if (winTEamId == teamaid) {
                                var dat = "";
                                if (teamaname){
                                    dat = teamaname + " qualified via walkover ";
                                    teamFinalWinner = teamaname
                                }
                                if (teamaname && teambname){
                                    dat = teamaname + " qualified via walkover against " + teambname
                                    teamFinalWinner = teamaname
                                }
                                if (dat.trim().length !== 0){
                                    playerInfo = dat
                                }
                            } else if (winTEamId == teambid) {
                                var dat;
                                if (teambname){
                                    dat = teambname + " qualified via walkover ";
                                    teamFinalWinner = teambname
                                }
                                if (teamaname && teambname){
                                    dat = teambname + " qualified via walkover against " + teamaname
                                    teamFinalWinner = teambname
                                }
                                if (dat.trim().length !== 0){
                                    playerInfo = dat
                                }
                            }
                        } else if (detmatchRecords.status.toLowerCase() == "completed") {
                            var setAs = detmatchRecords.scores.setScoresA
                            var setBs = detmatchRecords.scores.setScoresB
                            if (winTEamId == teamaid) {
                                var dat = "";
                                var scoresTeam = ""
                                if (teamaname){
                                    dat = teamaname + " dft ";
                                    teamFinalWinner = teamaname
                                }
                                if (teamaname && teambname){
                                    dat = teamaname + " dft " + teambname
                                    teamFinalWinner = teamaname
                                }
                                for (var k = 0; k < setAs.length; k++) {
                                    var setA = setAs;
                                    var setB = setBs;
                                    if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                    } else {
                                        scoresTeam = scoresTeam + setA[k] + "-" + setB[k] + " "
                                    }
                                }
                                var data = dat + scoresTeam
                                if (data.trim().length !== 0)
                                    playerInfo = data
                            } else if (winTEamId == teambid) {
                                var dat = "";
                                var scoresTeam = ""
                                if (teambname){
                                    dat = teambname + " dft ";
                                    teamFinalWinner = teambname
                                }
                                if (teamaname && teambname){
                                    dat = teambname + " dft " + teamaname
                                    teamFinalWinner = teambname
                                }
                                for (var k = 0; k < setBs.length; k++) {
                                    var setA = setAs;
                                    var setB = setBs;
                                    if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                    } else {
                                        scoresTeam = scoresTeam + setB[k] + "-" + setA[k] + " "
                                    }
                                }
                                var data = dat + scoresTeam
                                if (data.trim().length !== 0)
                                    playerInfo = data
                            }
                        }
                    }
                    //find detailed score for each match and round
                    var teamDETScores = teamDetailedScores.aggregate([{
                            $match: {
                                tournamentId: tournamentId,
                                "eventName": eventName
                            }
                        }, {
                            $unwind: "$teamDetScore"
                        }, {
                            $match: {
                                "teamDetScore.matchNumber": matchNumber,
                                "teamDetScore.roundNumber": roundNumber
                            }
                        }])
                        //get the detailed scores
                    if (teamDETScores && teamDETScores[0] && teamDETScores[0].teamDetScore) {
                        var details = teamDETScores[0].teamDetScore
                        var matchAVSXPlayer = "";
                        var matchBVsYPlayer = "";
                        var matchBVsXPlayer = "";
                        var matchAVsYPlayer = "";
                        var matchDoubles = "";

                        //details of match a vs x
                        if (details.matchAVSX) {
                            var scores = "";
                            var playerdetAVSX = details.matchAVSX
                            if (playerdetAVSX.matchType) {
                                if (playerdetAVSX.winnerIdPlayer && playerdetAVSX.winnerIdPlayer != "1") {
                                    var playerWinId;
                                    var playerLosId
                                    if (playerdetAVSX.winnerIdPlayer == playerdetAVSX.playerAID) {
                                        playerWinId = playerdetAVSX.playerAID
                                        playerLosId = playerdetAVSX.playerBID
                                    } else if (playerdetAVSX.winnerIdPlayer == playerdetAVSX.playerBID) {
                                        playerWinId = playerdetAVSX.playerBID
                                        playerLosId = playerdetAVSX.playerAID
                                    }

                                    if (playerWinId && playerLosId) {
                                        var playerWINName;
                                        var playerLOSName;

                                        var playerWINName = Meteor.users.findOne({
                                            userId: playerWinId
                                        }).userName
                                        var playerLOSName = Meteor.users.findOne({
                                            userId: playerLosId
                                        }).userName

                                        //if status if bye
                                        if (playerdetAVSX.matchType.toLowerCase() == "bye") {
                                            if (playerWINName) {
                                                matchAVSXPlayer = playerWINName + " qualified via bye"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchAVSXPlayer = playerWINName + " qualified via bye against " + playerLOSName
                                            }
                                        }

                                        //if status if walkover
                                        else if (playerdetAVSX.matchType.toLowerCase() == "walkover") {
                                            if (playerWINName) {
                                                matchAVSXPlayer = playerWINName + " qualified via walkover"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchAVSXPlayer = playerWINName + " qualified via walkover against " + playerLOSName
                                            }
                                        }

                                        //if status is completed
                                        else if (playerdetAVSX.matchType.toLowerCase() == "completed") {
                                            if (playerWINName) {
                                                matchAVSXPlayer = playerWINName + " won by"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchAVSXPlayer = playerWINName + " dft " + playerLOSName + " by "
                                            }

                                            var setAs = playerdetAVSX.setScoresA
                                            var setBs = playerdetAVSX.setScoresB
                                            var scores = "";

                                            if (setAs && setBs) {
                                                if (playerdetAVSX.winnerIdPlayer == playerdetAVSX.playerAID) {
                                                    for (var k = 0; k < setAs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setA[k] + "-" + setB[k] + " "
                                                        }
                                                    }
                                                } else if (playerdetAVSX.winnerIdPlayer == playerdetAVSX.playerBID) {
                                                    for (var k = 0; k < setBs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setB[k] + "-" + setA[k] + " "
                                                        }
                                                    }
                                                }

                                                matchAVSXPlayer = matchAVSXPlayer + scores

                                            }
                                        }

                                        if (matchAVSXPlayer && matchAVSXPlayer.trim().length != 0) {
                                            matchAVSXPlayer = matchAVSXPlayer;
                                        }
                                    }
                                }

                            }
                        }

                        //details of match b vs y
                        if (details.matchBVsY) {
                            var scores = "";
                            var playerdetBVsY = details.matchBVsY
                            if (playerdetBVsY.matchType) {
                                if (playerdetBVsY.winnerIdPlayer && playerdetBVsY.winnerIdPlayer != "1") {
                                    var playerWinId;
                                    var playerLosId
                                    if (playerdetBVsY.winnerIdPlayer == playerdetBVsY.playerAID) {
                                        playerWinId = playerdetBVsY.playerAID
                                        playerLosId = playerdetBVsY.playerBID
                                    } else if (playerdetBVsY.winnerIdPlayer == playerdetBVsY.playerBID) {
                                        playerWinId = playerdetBVsY.playerBID
                                        playerLosId = playerdetBVsY.playerAID
                                    }

                                    if (playerWinId && playerLosId) {
                                        var playerWINName;
                                        var playerLOSName;

                                        var playerWINName = Meteor.users.findOne({
                                            userId: playerWinId
                                        }).userName
                                        var playerLOSName = Meteor.users.findOne({
                                            userId: playerLosId
                                        }).userName

                                        //if status if bye
                                        if (playerdetBVsY.matchType.toLowerCase() == "bye") {
                                            if (playerWINName) {
                                                matchBVsYPlayer = playerWINName + " qualified via bye"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchBVsYPlayer = playerWINName + " qualified via bye against " + playerLOSName
                                            }
                                        }

                                        //if status if walkover
                                        else if (playerdetBVsY.matchType.toLowerCase() == "walkover") {
                                            if (playerWINName) {
                                                matchBVsYPlayer = playerWINName + " qualified via walkover"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchBVsYPlayer = playerWINName + " qualified via walkover against " + playerLOSName
                                            }
                                        }

                                        //if status is completed
                                        else if (playerdetBVsY.matchType.toLowerCase() == "completed") {
                                            if (playerWINName) {
                                                matchBVsYPlayer = playerWINName + " won by"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchBVsYPlayer = playerWINName + " dft " + playerLOSName + " by "
                                            }

                                            var setAs = playerdetBVsY.setScoresA
                                            var setBs = playerdetBVsY.setScoresB

                                            if (setAs && setBs) {
                                                if (playerdetBVsY.winnerIdPlayer == playerdetBVsY.playerAID) {
                                                    for (var k = 0; k < setAs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setA[k] + "-" + setB[k] + " "
                                                        }
                                                    }
                                                } else if (playerdetBVsY.winnerIdPlayer == playerdetBVsY.playerBID) {
                                                    for (var k = 0; k < setBs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setB[k] + "-" + setA[k] + " "
                                                        }
                                                    }
                                                }

                                                matchBVsYPlayer = matchBVsYPlayer + scores

                                            }
                                        }


                                        if (matchBVsYPlayer && matchBVsYPlayer.trim().length != 0) {
                                            matchBVsYPlayer =matchBVsYPlayer;
                                        }
                                    }
                                }

                            }
                        }

                        //details of doubles 
                        if (details.matchDoubles) {
                            var scores = "";
                            var playerdetmatchDoubles = details.matchDoubles
                            if (playerdetmatchDoubles.matchType) {
                                if (playerdetmatchDoubles.winnerD1PlayerId && playerdetmatchDoubles.winnerD1PlayerId != "1" &&
                                    playerdetmatchDoubles.winnerD2PlayerId && playerdetmatchDoubles.winnerD2PlayerId != "1") {
                                    var playerWinId1;
                                    var playerWinId2;
                                    var playerLosId1;
                                    var playerLosId2;
                                    if (playerdetmatchDoubles.winnerD1PlayerId == playerdetmatchDoubles.teamAD1PlayerId &&
                                        playerdetmatchDoubles.winnerD2PlayerId == playerdetmatchDoubles.teamAD2PlayerId) {
                                        playerWinId1 = playerdetmatchDoubles.teamAD1PlayerId
                                        playerWinId2 = playerdetmatchDoubles.teamAD2PlayerId

                                        playerLosId1 = playerdetmatchDoubles.teamBD1PlayerId
                                        playerLosId2 = playerdetmatchDoubles.teamBD2PlayerId
                                    } else if (playerdetmatchDoubles.winnerD1PlayerId == playerdetmatchDoubles.teamBD1PlayerId &&
                                        playerdetmatchDoubles.winnerD2PlayerId == playerdetmatchDoubles.teamBD2PlayerId) {
                                        playerWinId1 = playerdetmatchDoubles.teamBD1PlayerId
                                        playerWinId2 = playerdetmatchDoubles.teamBD2PlayerId

                                        playerLosId1 = playerdetmatchDoubles.teamAD1PlayerId
                                        playerLosId2 = playerdetmatchDoubles.teamAD2PlayerId
                                    }


                                    if (playerWinId1 && playerWinId2 && playerLosId1 && playerWinId2 && playerLosId2) {
                                        var playerWINName = "";
                                        var playerLOSName = "";

                                        var playerWINName = Meteor.users.findOne({
                                            userId: playerWinId1
                                        }).userName
                                        playerWINName = playerWINName + "," + Meteor.users.findOne({
                                            userId: playerWinId2
                                        }).userName

                                        var playerLOSName = Meteor.users.findOne({
                                            userId: playerLosId1
                                        }).userName
                                        playerLOSName = playerLOSName + "," + Meteor.users.findOne({
                                                userId: playerLosId2
                                            }).userName
                                            //if status if bye
                                        if (playerdetmatchDoubles.matchType.toLowerCase() == "bye") {
                                            if (playerWINName) {
                                                matchDoubles = playerWINName + " qualified via bye"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchDoubles = playerWINName + " qualified via bye against " + playerLOSName
                                            }
                                        }

                                        //if status if walkover
                                        else if (playerdetmatchDoubles.matchType.toLowerCase() == "walkover") {
                                            if (playerWINName) {
                                                matchDoubles = playerWINName + " qualified via walkover"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchDoubles = playerWINName + " qualified via walkover against " + playerLOSName
                                            }
                                        }

                                        //if status is completed
                                        else if (playerdetmatchDoubles.matchType.toLowerCase() == "completed") {
                                            if (playerWINName) {
                                                matchDoubles = playerWINName + " won by"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchDoubles = playerWINName + " dft " + playerLOSName + " by "
                                            }

                                            var setAs = playerdetmatchDoubles.setScoresA
                                            var setBs = playerdetmatchDoubles.setScoresB

                                            if (setAs && setBs) {

                                                if (playerdetmatchDoubles.winnerD1PlayerId == playerdetmatchDoubles.teamAD1PlayerId &&
                                                    playerdetmatchDoubles.winnerD2PlayerId == playerdetmatchDoubles.teamAD2PlayerId) {
                                                    for (var k = 0; k < setAs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setA[k] + "-" + setB[k] + " "
                                                        }
                                                    }
                                                } else if (playerdetmatchDoubles.winnerD1PlayerId == playerdetmatchDoubles.teamBD1PlayerId &&
                                                    playerdetmatchDoubles.winnerD2PlayerId == playerdetmatchDoubles.teamBD2PlayerId) {
                                                    for (var k = 0; k < setBs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setB[k] + "-" + setA[k] + " "
                                                        }
                                                    }
                                                }

                                                matchDoubles = matchDoubles + scores

                                            }
                                        }

                                        if (matchDoubles && matchDoubles.trim().length != 0) {
                                            matchDoubles =matchDoubles;
                                        }
                                    }
                                }

                            }
                        }

                        //details of BVsX
                        if (details.matchBVsX) {
                            var scores = "";
                            var playerdetBVsX = details.matchBVsX
                            if (playerdetBVsX.matchType) {
                                if (playerdetBVsX.winnerIdPlayer && playerdetBVsX.winnerIdPlayer != "1") {
                                    var playerWinId;
                                    var playerLosId
                                    if (playerdetBVsX.winnerIdPlayer == playerdetBVsX.playerAID) {
                                        playerWinId = playerdetBVsX.playerAID
                                        playerLosId = playerdetBVsX.playerBID
                                    } else if (playerdetBVsX.winnerIdPlayer == playerdetBVsX.playerBID) {
                                        playerWinId = playerdetBVsX.playerBID
                                        playerLosId = playerdetBVsX.playerAID
                                    }

                                    if (playerWinId && playerLosId) {
                                        var playerWINName;
                                        var playerLOSName;

                                        var playerWINName = Meteor.users.findOne({
                                            userId: playerWinId
                                        }).userName
                                        var playerLOSName = Meteor.users.findOne({
                                            userId: playerLosId
                                        }).userName

                                        //if status if bye
                                        if (playerdetBVsX.matchType.toLowerCase() == "bye") {
                                            if (playerWINName) {
                                                matchBVsXPlayer = playerWINName + " qualified via bye"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchBVsXPlayer = playerWINName + " qualified via bye against " + playerLOSName
                                            }
                                        }

                                        //if status if walkover
                                        else if (playerdetBVsX.matchType.toLowerCase() == "walkover") {
                                            if (playerWINName) {
                                                matchBVsXPlayer = playerWINName + " qualified via walkover"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchBVsXPlayer = playerWINName + " qualified via walkover against " + playerLOSName
                                            }
                                        }

                                        //if status is completed
                                        else if (playerdetBVsX.matchType.toLowerCase() == "completed") {
                                            if (playerWINName) {
                                                matchBVsXPlayer = playerWINName + " won by"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchBVsXPlayer = playerWINName + " dft " + playerLOSName + " by "
                                            }

                                            var setAs = playerdetBVsX.setScoresA
                                            var setBs = playerdetBVsX.setScoresB

                                            if (setAs && setBs) {
                                                if (playerdetBVsX.winnerIdPlayer == playerdetBVsX.playerAID) {
                                                    for (var k = 0; k < setAs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setA[k] + "-" + setB[k] + " "
                                                        }
                                                    }
                                                } else if (playerdetBVsX.winnerIdPlayer == playerdetBVsX.playerBID) {
                                                    for (var k = 0; k < setBs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setB[k] + "-" + setA[k] + " "
                                                        }
                                                    }
                                                }

                                                matchBVsXPlayer = matchBVsXPlayer + scores

                                            }
                                        }

                                        if (matchBVsXPlayer && matchBVsXPlayer.trim().length != 0) {
                                            matchBVsXPlayer = matchBVsXPlayer;
                                        }
                                    }
                                }

                            }
                        }

                        //details of AVsY
                        if (details.matchAVsY) {
                            var scores = "";
                            var playerdetAVsY = details.matchAVsY
                            if (playerdetAVsY.matchType) {
                                if (playerdetAVsY.winnerIdPlayer && playerdetAVsY.winnerIdPlayer != "1") {
                                    var playerWinId;
                                    var playerLosId
                                    if (playerdetAVsY.winnerIdPlayer == playerdetAVsY.playerAID) {
                                        playerWinId = playerdetAVsY.playerAID
                                        playerLosId = playerdetAVsY.playerBID
                                    } else if (playerdetAVsY.winnerIdPlayer == playerdetAVsY.playerBID) {
                                        playerWinId = playerdetAVsY.playerBID
                                        playerLosId = playerdetAVsY.playerAID
                                    }

                                    if (playerWinId && playerLosId) {
                                        var playerWINName;
                                        var playerLOSName;

                                        var playerWINName = Meteor.users.findOne({
                                            userId: playerWinId
                                        }).userName
                                        var playerLOSName = Meteor.users.findOne({
                                            userId: playerLosId
                                        }).userName

                                        //if status if bye
                                        if (playerdetAVsY.matchType.toLowerCase() == "bye") {
                                            if (playerWINName) {
                                                matchAVsYPlayer = playerWINName + " qualified via bye"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchAVsYPlayer = playerWINName + " qualified via bye against " + playerLOSName
                                            }
                                        }

                                        //if status if walkover
                                        else if (playerdetAVsY.matchType.toLowerCase() == "walkover") {
                                            if (playerWINName) {
                                                matchAVsYPlayer = playerWINName + " qualified via walkover"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchAVsYPlayer = playerWINName + " qualified via walkover against " + playerLOSName
                                            }
                                        }

                                        //if status is completed
                                        else if (playerdetAVsY.matchType.toLowerCase() == "completed") {
                                            if (playerWINName) {
                                                matchAVsYPlayer = playerWINName + " won by"
                                            }
                                            if (playerWINName && playerLOSName) {
                                                matchAVsYPlayer = playerWINName + " dft " + playerLOSName + " by "
                                            }

                                            var setAs = playerdetAVsY.setScoresA
                                            var setBs = playerdetAVsY.setScoresB

                                            if (setAs && setBs) {
                                                if (playerdetAVsY.winnerIdPlayer == playerdetAVsY.playerAID) {
                                                    for (var k = 0; k < setAs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setA[k] + "-" + setB[k] + " "
                                                        }
                                                    }
                                                } else if (playerdetAVsY.winnerIdPlayer == playerdetAVsY.playerBID) {
                                                    for (var k = 0; k < setBs.length; k++) {
                                                        var setA = setAs;
                                                        var setB = setBs;
                                                        if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                        } else {
                                                            scores = scores + setB[k] + "-" + setA[k] + " "
                                                        }
                                                    }
                                                }

                                                matchAVsYPlayer = matchAVsYPlayer + scores

                                            }
                                        }

                                        if (matchAVsYPlayer && matchAVsYPlayer.trim().length != 0) {
                                            matchAVsYPlayer = matchAVsYPlayer;
                                        }
                                    }
                                }

                            }
                        }

                        var matchAVSX = matchAVSXPlayer
                        var matchBVsY = matchBVsYPlayer
                        var matchDoubles = matchDoubles
                        var matchBVsX = matchBVsXPlayer
                        var matchAVsY = matchAVsYPlayer
                        var teamWIN = playerInfo.toString();
                        teamDE = {
                            matchAVSX:matchAVSX,
                            matchBVsY:matchBVsY,
                            matchDoubles:matchDoubles,
                            matchBVsX:matchBVsX,
                            matchAVsY:matchAVsY,
                            teamWIN:teamWIN,
                            teamFinalWinner:teamFinalWinner
                        }

                        //var playerDet = matchAVSXPlayer.trim() + matchBVsYPlayer.trim() + matchDoubles.trim() + matchBVsXPlayer.trim() + matchAVsYPlayer.trim()
                        //if (playerDet.trim().length != 0)
                            //playerInfo.push(playerDet)

                        teamInfo.push(teamDE)

                        data = {
                            round: round,
                            teamInfo: teamInfo,
                        }


                    }

                }
                rounds.push(data)
            }
            return rounds
        } catch (e) {

        }
    }
})