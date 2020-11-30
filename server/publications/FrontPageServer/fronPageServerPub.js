import {
    MatchCollectionDB
}
from '../MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../MatchCollectionDbTeam.js'

Meteor.publish('eventsForFrontPage', function() {
    var lData = ReactiveAggregate(this, calenderEvents, [
        // assuming our Reports collection have the fields: hours, books
        {
            $project: {
                start: "$eventStartDate1",
                title: "$eventName",
            } // Send the aggregation to the 'clientReport' collection available for client use
        }
    ], {
        clientCollection: "calenderEvents"
    });
    if (lData) {
        return lData
    } else return this.ready();
});

Meteor.methods({
    "fetchEventsOnDateSelection": function(selectedDate) {
        if (selectedDate) {
            var eventsToReturn = [];
            var findUpEvents = events.find({
                tournamentEvent: true,
                eventStartDate: selectedDate
            }, {
                fields: {
                    eventName: 1,
                    domainName: 1
                }
            }).fetch();
            if (findUpEvents) {
                eventsToReturn = eventsToReturn;
            }
            var findPastEvents = pastEvents.find({
                tournamentEvent: true,
                eventStartDate: selectedDate
            }, {
                fields: {
                    eventName: 1,
                    domainName: 1
                }
            }).fetch()
            eventsToReturn = Array.prototype.concat(findPastEvents, findUpEvents)
            return eventsToReturn;
        }
    }
});

Meteor.methods({
    "fetchCalenderEvents": function() {
        var caleFind = calenderEvents.aggregate({
            eventStartDate1: "$startDate",
            eventName: "$title",
            eventStartDate: "$eventStartDate",
            eventLastSubscriptionDate: "$eventLastSubscriptionDate",
            eventEndDate: "$eventEndDate"
        });
        return caleFind
    }
});

Meteor.methods({
    "FetchCalenderEvents": function(start, end) {
        var s = calenderEvents.aggregate([{
            $match: {
                eventStartDate1: {
                    $gte: start,
                    $lte: end
                }
            }
        }, {
            $project: {
                start: "$eventStartDate1",
                title: "$eventName",
            } // Send the aggregation to the 'clientReport' collection available for client use
        }]);
        return s;
    }
})

Meteor.methods({
    'keyRESULTSFrontPage': function(tournamentId, eventName) {
        try {
            var sortedMatchColl = [];
            var winner = "";
            var finalSortRecords = {};
            var finalRound = "0";
            var semiFinalRound = "0";
            var quarterFinalRound = "0";
            var includeResults = true
            var temp1 = MatchCollectionConfig.aggregate([{
                $match: {
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                }
            }, {
                $unwind: "$roundValues"
            }, {
                $sort: {
                    "roundValues.roundNumber": -1
                }
            }, {
                $limit: 4
            }, {
                $group: {
                    "_id": "$_id",
                    "roundNumber": {
                        $push: "$roundValues.roundNumber"
                    }
                }
            }, {
                $project: {
                    "roundNumber": 1
                }
            }])


            var roundList = [];
            if (temp1.length > 0) {
                var roundNumberArr = temp1[0].roundNumber;
                for (var b = 0; b < roundNumberArr.length; b++) {
                    roundList.push(parseInt(roundNumberArr[b]))
                }
            }

            var results = "";
            if (includeResults) {

                var recordsData = MatchCollectionDB.aggregate([{
                    $match: {
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                        $or: [{
                            "matchRecords.roundNumber": {
                                $in: roundList
                            }
                        }, {
                            "matchRecords.roundName": {
                                $in: ["QF", "SF", "F"]
                            }
                        }]
                    }
                }, {
                    $unwind: "$matchRecords"
                }, {
                    $match: {
                        $or: [{
                            "matchRecords.roundNumber": {
                                $in: roundList
                            }
                        }, {
                            "matchRecords.roundName": {
                                $in: ["QF", "SF", "F"]
                            }
                        }]
                    }
                }, {
                    $group: {
                        "_id": "$_id",
                        "matchRecords": {
                            "$push": "$matchRecords"
                        },
                    }
                }, {
                    $project: {
                        "matchRecords": 1,
                        "_id": 0
                    }
                }])
                if (recordsData.length > 0) {
                    if (recordsData[0].matchRecords)
                        records = recordsData[0].matchRecords;
                }
                var matchConfigInfo = MatchCollectionConfig.findOne({
                    "tournamentId": tournamentId,
                    "eventName": eventName
                }, {
                    fields: {
                        "roundValues": 1
                    }
                });
                if (matchConfigInfo != undefined) {
                    var possibleRounds = [];
                    var mx = parseInt(matchConfigInfo.roundValues.length) - parseInt(1);
                    if (matchConfigInfo.roundValues[mx - 1] != undefined)
                        finalRound = matchConfigInfo.roundValues[mx - 1].roundNumber;
                    if (matchConfigInfo.roundValues[mx - 2] != undefined)
                        semiFinalRound = matchConfigInfo.roundValues[mx - 2].roundNumber;
                    if (matchConfigInfo.roundValues[mx - 3] != undefined)
                        quarterFinalRound = matchConfigInfo.roundValues[mx - 3].roundNumber;
                }
                for (var i = 0; i < records.length; i++) {
                    if (records[i].roundNumber != undefined) {
                        var finalInfo = {};
                        var matchRecords;
                        if (records[i].roundNumber == parseInt(finalRound) || records[i].roundNumber == parseInt(semiFinalRound) || records[i].roundNumber == parseInt(quarterFinalRound)) {
                            if (records[i].roundNumber == parseInt(finalRound)) {
                                finalInfo["round"] = "Final";
                                matchRecords = records[i];
                                if (matchRecords.status != "yetToPlay")
                                    winner = matchRecords.winner

                            } else if (records[i].roundNumber == parseInt(semiFinalRound)) {
                                finalInfo["round"] = "Semi Final";
                                matchRecords = records[i];
                            }
                            if (records[i].roundNumber == parseInt(quarterFinalRound)) {
                                finalInfo["round"] = "Quarter Final";
                                matchRecords = records[i];
                            }

                            if (matchRecords.status != "yetToPlay") {
                                finalInfo["winner"] = matchRecords.winner;
                                if (matchRecords.winnerID == matchRecords.playersID.playerAId) {
                                    finalInfo["playerInfo"] = matchRecords.winner + " defeated " + matchRecords.players.playerB;
                                    var scoreInfo = "";
                                    for (var k = 0; k < matchRecords.scores.setScoresA.length; k++) {
                                        if (k != 0 && (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0'))
                                            scoreInfo += ",";
                                        if (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0')
                                            scoreInfo += matchRecords.scores.setScoresA[k] + " - " + matchRecords.scores.setScoresB[k];
                                    }
                                } else {
                                    finalInfo["playerInfo"] = matchRecords.winner + " defeated " + matchRecords.players.playerA;
                                    for (var k = 0; k < matchRecords.scores.setScoresB.length; k++) {
                                        if (k != 0 && (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0'))
                                            scoreInfo += ",";
                                        if (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0')
                                            scoreInfo += matchRecords.scores.setScoresB[k] + " - " + matchRecords.scores.setScoresA[k];
                                    }
                                }
                                finalInfo["scoreInfo"] = scoreInfo;
                                sortedMatchColl.push(finalInfo);
                            }
                        }
                    }
                }


                finalSortRecords["winner"] = winner;
                var matchInfo = [];
                var finalplayerInfo = [];
                var semiplayerInfo = [];
                var quarterplayerInfo = [];

                for (var t = sortedMatchColl.length - 1; t > 0; t--) {
                    var roundInfo = {};
                    if (sortedMatchColl[t].round) {
                        if (sortedMatchColl[t].round == "Final") {
                            roundInfo["round"] = "Final";
                            finalplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                            roundInfo["playerInfo"] = finalplayerInfo;
                        }
                        if (sortedMatchColl[t].round == "Semi Final") {
                            roundInfo["round"] = "Semi Final";
                            semiplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                            roundInfo["playerInfo"] = semiplayerInfo;
                        }
                        if (sortedMatchColl[t].round == "Quarter Final") {
                            roundInfo["round"] = "Quarter Final";
                            quarterplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                            roundInfo["playerInfo"] = quarterplayerInfo;
                        }
                        if (_.findWhere(matchInfo, roundInfo) == null) {
                            matchInfo.push(roundInfo);
                        }
                        finalSortRecords["rounds"] = matchInfo;
                    }
                }
            }
            var tournamentName = "";

            var tourInfo = undefined;
            tourInfo = pastEvents.findOne({
                "tournamentEvent": true,
                "_id": tournamentId
            });
            if (tourInfo == undefined) {
                tourInfo = events.findOne({
                    "tournamentEvent": true,
                    "_id": tournamentId
                });
            }

            if (tourInfo != undefined) {
                finalSortRecords["tournamentName"] = tourInfo.eventName;
                finalSortRecords["sponsorLogo"] = tourInfo.sponsorLogo;
                var sponsorLogoURL = eventUploads.find({
                    "_id": tourInfo.sponsorLogo
                }).fetch();
                finalSortRecords["sponsorLogoURL"] = sponsorLogoURL;

            }

            var absoluteUrl = Meteor.absoluteUrl().toString();
            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
            finalSortRecords["eventName"] = eventName;
            finalSortRecords["imageURL"] = absoluteUrlString;



            SSR.compileTemplate('mailTemplate', Assets.getText('mailTemplate.html'));
            var html_string = SSR.render('mailTemplate', finalSortRecords);


            var options = {
                from: "iplayon.in@gmail.com",
                to: "",
                subject: "iPlayOn:Results ",
                html: html_string
            }
            
            return true;
        } catch (e) {
            return false
        }
    }
});

Meteor.methods({
    "yearNow": function() {
        return moment(new Date()).format("YYYY")
    }
})

Meteor.methods({
    "getResultsOF3Events": async function() {
        try {
            var tourids = []

            var recentTourn = events.aggregate([{
                $match: {
                    tournamentEvent: true
                }
            }, {
                $sort: {
                    eventCreatedDate: -1
                }
            }, {
                $project: {
                    tour: "$_id"
                }
            }, {
                $group: {
                    _id: null,
                    arr: {
                        $push: "$tour"
                    }
                }
            }])

            
                
                var recentTourn2 = pastEvents.aggregate([{
                    $match: {
                        tournamentEvent: true
                    }
                }, {
                    $sort: {
                        eventUpdatedDate: -1
                    }
                }, {
                    $project: {
                        tour: "$_id"
                    }
                }, {
                    $group: {
                        _id: null,
                        arr: {
                            $push: "$tour"
                        }
                    }
                }])

                if(recentTourn && recentTourn[0] && recentTourn[0].arr && recentTourn[0].arr.length){
                    tourids = tourids.concat(recentTourn[0].arr)
                }
                if(recentTourn2 && recentTourn2[0] &&  recentTourn2[0].arr && recentTourn2[0].arr.length){
                    tourids = tourids.concat(recentTourn2[0].arr)
                }
            var indEvents = [];

            var individualMatchRecordsData = MatchCollectionDB.aggregate([
            {
                $match:{
                    tournamentId: {
                        $in:tourids
                    }
                }
            },
            {
                $unwind: "$matchRecords"
            }, {
                $match: {
                    "matchRecords.roundName": "F",
                    "matchRecords.status": {
                        $ne: "yetToPlay"
                    }
                }
            }, {
                $project: {
                    tournamentId: "$tournamentId",
                    eventName: "$eventName",
                    players: "$matchRecords.players",
                    playersID: "$matchRecords.playersID",
                    status: "$matchRecords.status",
                    scores: "$matchRecords.scores",
                    winner: "$matchRecords.winner",
                    winnerID: "$matchRecords.winnerID"
                }
            }]);

            if (individualMatchRecordsData && individualMatchRecordsData.length) {

                
                var sortedCollection = _.sortBy(individualMatchRecordsData, function(item){
                  return tourids.indexOf(item.tournamentId)
                });

                individualMatchRecordsData = sortedCollection.slice(0, 3);
                indEvents = individualMatchRecordsData;

                for (var i = 0; i < indEvents.length; i++) {
                    if (indEvents[i].tournamentId) {
                        var tourn = events.findOne({
                            "_id": indEvents[i].tournamentId
                        });
                        if (tourn == undefined) {
                            tourn = pastEvents.findOne({
                                "_id": indEvents[i].tournamentId
                            })
                        }

                        if (tourn && tourn.eventName) {
                            indEvents[i].tournName = tourn.eventName + " , " + indEvents[i].eventName;
                        }
                        if (indEvents[i].status && indEvents[i].winnerID == indEvents[i].playersID.playerAId && indEvents[i].players.playerA && indEvents[i].players.playerB) {
                            if (indEvents[i].status.toLowerCase() == "completed" && indEvents[i].scores) {
                                var scores = "";
                                for (var k = 0; k < indEvents[i].scores.setScoresA.length; k++) {
                                    var setA = indEvents[i].scores.setScoresA;
                                    var setB = indEvents[i].scores.setScoresB;
                                    if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {} else {
                                        scores = scores + setA[k] + "-" + setB[k] + " "
                                    }
                                }
                                indEvents[i].defeated = indEvents[i].players.playerA + " defeated " + indEvents[i].players.playerB + " in finals" + " by " + scores;
                            } else if (indEvents[i].status.toLowerCase() == "bye") {
                                indEvents[i].defeated = indEvents[i].players.playerA + " received bye in finals"
                            } else if (indEvents[i].status.toLowerCase() == "walkover") {
                                indEvents[i].defeated = indEvents[i].players.playerA + " received walkover in finals"
                            }
                        } else if (indEvents[i].winnerID == indEvents[i].playersID.playerBId && indEvents[i].players.playerA && indEvents[i].players.playerB) {
                            if (indEvents[i].status.toLowerCase() == "completed" && indEvents[i].scores) {
                                var scores = "";
                                for (var k = 0; k < indEvents[i].scores.setScoresB.length; k++) {
                                    var setA = indEvents[i].scores.setScoresA;
                                    var setB = indEvents[i].scores.setScoresB;
                                    if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {} else {
                                        scores = scores + setB[k] + "-" + setA[k] + " "
                                    }
                                }
                                indEvents[i].defeated = indEvents[i].players.playerB + " defeated " + indEvents[i].players.playerA + " in finals" + " by " + scores;
                            } else if (indEvents[i].status.toLowerCase() == "bye") {
                                indEvents[i].defeated = indEvents[i].players.playerB + " received bye in finals"
                            } else if (indEvents[i].status.toLowerCase() == "walkover") {
                                indEvents[i].defeated = indEvents[i].players.playerB + " received walkover in finals"
                            }
                        }
                    }
                }

                if (individualMatchRecordsData.length >= 3) {
                    return indEvents
                } else {
                    var res = await Meteor.call("getResultsOF3TeamEvents",tourids)
                    try{
                        if(res){
                            indEvents = Array.prototype.concat(indEvents, res)
                        }
                    }catch(e){}
                    
                }
                return indEvents.slice(0, 3)
            } else if (individualMatchRecordsData && individualMatchRecordsData.length == 0) {

                var res = await Meteor.call("getResultsOF3TeamEvents",tourids)
                try{
                    if(res){
                        indEvents = Array.prototype.concat(indEvents, res)
                    }
                }catch(e){}
                
                return indEvents.slice(0, 3)
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    "getResultsOF3TeamEvents": function(touridsparam) {
        try {
            var tourids = []
            if(touridsparam && touridsparam.length){
                tourids = touridsparam
            }
            else{
                tourids = []

                var recentTourn = events.aggregate([{
                    $match: {
                        tournamentEvent: true
                    }
                }, {
                    $sort: {
                        eventCreatedDate: -1
                    }
                }, {
                    $project: {
                        tour: "$_id"
                    }
                }, {
                    $group: {
                        _id: null,
                        arr: {
                            $push: "$tour"
                        }
                    }
                }])

                
                    

                    var recentTourn2 = pastEvents.aggregate([{
                        $match: {
                            tournamentEvent: true
                        }
                    }, {
                        $sort: {
                            eventUpdatedDate: -1
                        }
                    }, {
                        $project: {
                            tour: "$_id"
                        }
                    }, {
                        $group: {
                            _id: null,
                            arr: {
                                $push: "$tour"
                            }
                        }
                    }])

                    if(recentTourn && recentTourn[0] && recentTourn[0].arr && recentTourn[0].arr.length){
                        tourids = tourids.concat(recentTourn[0].arr)
                    }
                    if(recentTourn2 && recentTourn2[0] && recentTourn2[0].arr && recentTourn2[0].arr.length){
                        tourids = tourids.concat(recentTourn2[0].arr)
                    }
                
            }

            var indEvents = [];
            var individualMatchRecordsData = teamMatchCollectionDB.aggregate([
            {
                $match:{
                    tournamentId: {
                        $in:tourids
                    }
                }
            },
            {
                $unwind: "$matchRecords"
            }, {
                $match: {
                    "matchRecords.roundName": "F",
                    "matchRecords.status": {
                        $ne: "yetToPlay"
                    }
                }
            }, {
                $project: {
                    tournamentId: "$tournamentId",
                    eventName: "$eventName",
                    teams: "$matchRecords.teams",
                    teamsID: "$matchRecords.teamsID",
                    status: "$matchRecords.status",
                    scores: "$matchRecords.scores",
                    winner: "$matchRecords.winner",
                    winnerID: "$matchRecords.winnerID"
                }
            }, {
                $limit: 3
            }]);
            if (individualMatchRecordsData && individualMatchRecordsData.length) {
                var sortedCollection = _.sortBy(individualMatchRecordsData, function(item){
                  return tourids.indexOf(item.tournamentId)
                });
                
                individualMatchRecordsData = sortedCollection.slice(0, 3);

                indEvents = individualMatchRecordsData;
                for (var i = 0; i < indEvents.length; i++) {
                    if (indEvents[i].tournamentId) {
                        var tourn = events.findOne({
                            "_id": indEvents[i].tournamentId
                        });
                        if (tourn == undefined) {
                            tourn = pastEvents.findOne({
                                "_id": indEvents[i].tournamentId
                            })
                        }

                        if (tourn && tourn.eventName) {
                            indEvents[i].tournName = tourn.eventName + " , " + indEvents[i].eventName;
                        }
                        if (indEvents[i].status && indEvents[i].winnerID == indEvents[i].teamsID.teamAId && indEvents[i].teams.teamA && indEvents[i].teams.teamB) {
                            if (indEvents[i].status.toLowerCase() == "completed" && indEvents[i].scores) {
                                var scores = "";
                                for (var k = 0; k < indEvents[i].scores.setScoresA.length; k++) {
                                    var setA = indEvents[i].scores.setScoresA;
                                    var setB = indEvents[i].scores.setScoresB;
                                    if (parseInt(setA[k]) != 0 || parseInt(setB[k]) != 0) {
                                        scores = scores + setA[k] + "-" + setB[k] + " "
                                    }
                                }
                                indEvents[i].defeated = indEvents[i].teams.teamA + " defeated " + indEvents[i].teams.teamB + " in finals" + " by " + scores;
                            } else if (indEvents[i].status.toLowerCase() == "bye") {
                                indEvents[i].defeated = indEvents[i].teams.teamA + " received bye in finals"
                            } else if (indEvents[i].status.toLowerCase() == "walkover") {
                                indEvents[i].defeated = indEvents[i].teams.teamA + " received walkover in finals"
                            }
                        } else if (indEvents[i].winnerID == indEvents[i].teamsID.teamBId && indEvents[i].teams.teamA && indEvents[i].teams.teamB) {
                            if (indEvents[i].status.toLowerCase() == "completed" && indEvents[i].scores) {
                                var scores = "";
                                for (var k = 0; k < indEvents[i].scores.setScoresB.length; k++) {
                                    var setA = indEvents[i].scores.setScoresA;
                                    var setB = indEvents[i].scores.setScoresB;
                                    if (parseInt(setA[k]) != 0 || parseInt(setB[k]) != 0) {
                                        scores = scores + setB[k] + "-" + setA[k] + " "
                                    }
                                }
                                indEvents[i].defeated = indEvents[i].teams.teamB + " defeated " + indEvents[i].teams.teamA + " in finals " + " by " + scores;
                            } else if (indEvents[i].status.toLowerCase() == "bye") {
                                indEvents[i].defeated = indEvents[i].teams.teamB + " received bye in finals"
                            } else if (indEvents[i].status.toLowerCase() == "walkover") {
                                indEvents[i].defeated = indEvents[i].teams.teamB + " received walkover in finals"
                            }
                        }
                    }
                }
                return indEvents
            }
        } catch (e) {}
    }
})