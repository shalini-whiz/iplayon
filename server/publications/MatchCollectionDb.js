import {
    Meteor
}
from 'meteor/meteor';
import {
    Mongo
}
from 'meteor/mongo';
import {
    check
}
from 'meteor/check';
import {
    teamMatchCollectionDB
}
from './MatchCollectionDbTeam.js';
export const MatchCollectionDB = new Meteor.Collection('MatchCollectionDB');
//userDetailsTTUsed

if (Meteor.isServer) {
    Meteor.publish('MatchCollectionDB', function MatchCollectionDBPublication() {
        var list = MatchCollectionDB.find({});
        return list;
    });
}
//------------------------------------------------------------------------
function getMatchCount(numPlayers) {
    try {
        var numRounds = 0;
        var numMatches = [];
        while (math.pow(2, numRounds) < numPlayers) {
            numRounds++;
        }
        if (math.pow(2, numRounds) == numPlayers) {
            var baseCount = numPlayers;
            for (var i = 0; i < numRounds; i++) {
                var numMatchesInThisRound = baseCount / 2;
                numMatches.push(numMatchesInThisRound);
                baseCount = numMatchesInThisRound;
            }
        } else if (numPlayers % 6 == 0) {
            var numMatchesInThisRound = (numPlayers / 6) * 2;
            numMatches.push(numMatchesInThisRound);
            numMatchesInThisRound = 2 * (numPlayers / 6);
            numMatches.push(numMatchesInThisRound);
            numMatchesInThisRound = numMatchesInThisRound / 2;
            if (numMatchesInThisRound == 1) {
                numMatches.push(numMatchesInThisRound);
            } else {
                while (numMatchesInThisRound >= 1) {
                    numMatches.push(numMatchesInThisRound);
                    numMatchesInThisRound = numMatchesInThisRound / 2;
                }
            }
        }
        //
        else if (numPlayers % 5 == 0) {
            var numMatchesInThisRound = numPlayers / 5;
            numMatches.push(numMatchesInThisRound);
            numMatchesInThisRound = 2 * (numPlayers / 5);
            numMatches.push(numMatchesInThisRound);
            numMatchesInThisRound = numMatchesInThisRound / 2;
            if (numMatchesInThisRound == 1) {
                numMatches.push(numMatchesInThisRound);
            } else {
                while (numMatchesInThisRound >= 1) {
                    numMatches.push(numMatchesInThisRound);
                    numMatchesInThisRound = numMatchesInThisRound / 2;
                }
            }
        }
        return numMatches;
    } catch (e) {
        console.log(e)
    }
}

function getMatchConfiguration6(numMatches, numPlayers) {
    try {
        var totalNumMatches = 0;
        for (var i = 0; i < numMatches.length; i++) {
            totalNumMatches += numMatches[i];
        }
        var matchCfgArray = [];
        for (var i = 0; i < totalNumMatches; i++) {
            var matchCfg = {};
            matchCfg.matchNumber = i + 1;
            matchCfgArray.push(matchCfg);
        }
        var curRound = 0;
        var nextPlayerAdder = 0;
        // round 1
        for (var i = 0; i < numMatches[curRound]; i++) {
            if (i % 2 == 0) {
                matchCfgArray[i].playerAIndex = nextPlayerAdder + 2;
                matchCfgArray[i].playerBIndex = nextPlayerAdder + 3;
            } else {
                matchCfgArray[i].playerAIndex = nextPlayerAdder + 4;
                matchCfgArray[i].playerBIndex = nextPlayerAdder + 5;
                nextPlayerAdder += 6;
            }
            matchCfgArray[i].roundNumber = 1;
        }
        var matchNumAdder = 0;
        for (var i = 0; i < numMatches[curRound]; i++) {
            matchCfgArray[i].nextMatchNumber = matchCfgArray[i].matchNumber + numMatches[curRound] + matchNumAdder;
            /*if (matchCfgArray[i].matchNumber % 2 == 1) {
              matchNumAdder += 2;
            }*/
        }
        var nextSlot = "B";
        for (var i = 0; i < numMatches[curRound]; i++) {
            matchCfgArray[i].nextSlot = nextSlot;
            nextSlot = (nextSlot == "B") ? "A" : "B";
        }

        // round 2
        curRound = 1;
        var firstMatch = numMatches[0]; // first match in this round
        matchNumAdder = numMatches[curRound];
        for (var i = 0; i < numMatches[curRound]; i += 2) {
            var j = i + firstMatch;
            matchCfgArray[j].roundNumber = 2;
            matchCfgArray[j + 1].roundNumber = 2;
            matchCfgArray[j].nextMatchNumber = matchCfgArray[j].matchNumber + matchNumAdder;
            matchCfgArray[j + 1].nextMatchNumber = matchCfgArray[j].matchNumber + matchNumAdder;
            matchNumAdder--;
        }
        nextSlot = "A";
        firstMatch = numMatches[0]; // first match in this round
        for (var i = 0; i < numMatches[curRound]; i++) {
            matchCfgArray[i + firstMatch].nextSlot = nextSlot;
            nextSlot = (nextSlot == "B") ? "A" : "B";
        }
        var playerNumAdder = 0;
        for (var i = 0; i < numMatches[curRound]; i++) {
            if (i % 4 == 0) {
                matchCfgArray[i + firstMatch].playerAIndex = 1 + playerNumAdder;
                matchCfgArray[i + firstMatch].playerBIndex = -1;
            }
            if (i % 4 == 1) {
                matchCfgArray[i + firstMatch].playerAIndex = -1;
                matchCfgArray[i + firstMatch].playerBIndex = 6 + playerNumAdder;
            }
            if (i % 4 == 2) {
                matchCfgArray[i + firstMatch].playerAIndex = 7 + playerNumAdder;
                matchCfgArray[i + firstMatch].playerBIndex = -1;
            }
            if (i % 4 == 3) {
                matchCfgArray[i + firstMatch].playerAIndex = -1;
                matchCfgArray[i + firstMatch].playerBIndex = 12 + playerNumAdder;
                playerNumAdder += 12;
            }
        }
        // round 3 onwards
        for (curRound = 2; curRound < numMatches.length; curRound++) {
            var roundNumber = curRound + 1;
            firstMatch = 0;
            for (var j = 0; j < curRound; j++) {
                firstMatch += numMatches[j];
            }
            matchNumAdder = numMatches[curRound];
            // round number logic
            for (var j = 0; j < numMatches[curRound]; j += 2) {
                var k = j + firstMatch;
                matchCfgArray[k].roundNumber = roundNumber;
                matchCfgArray[k].nextMatchNumber = matchCfgArray[k].matchNumber + matchNumAdder;
                if (numMatches[curRound] > 1) {
                    matchCfgArray[k + 1].roundNumber = roundNumber;
                    matchCfgArray[k + 1].nextMatchNumber = matchCfgArray[k].matchNumber + matchNumAdder;
                }
                matchNumAdder--;
            }
            nextSlot = "A";
            for (var j = 0; j < numMatches[curRound]; j++) {
                matchCfgArray[j + firstMatch].nextSlot = nextSlot;
                nextSlot = (nextSlot == "B") ? "A" : "B";
            }
        }
        // output
        return matchCfgArray;
    } catch (e) {
        console.log(e)
    }
}

function getMatchConfiguration5(numMatches, numPlayers) {
    try {
        var totalNumMatches = 0;
        for (var i = 0; i < numMatches.length; i++) {
            totalNumMatches += numMatches[i];
        }
        var matchCfgArray = [];
        for (var i = 0; i < totalNumMatches; i++) {
            var matchCfg = {};
            matchCfg.matchNumber = i + 1;
            matchCfgArray.push(matchCfg);
        }
        var curRound = 0;
        var nextPlayerAdder = 0;
        // round 1
        for (var i = 0; i < numMatches[curRound]; i++) {
            if (i % 2 == 0) {
                matchCfgArray[i].playerAIndex = nextPlayerAdder + 2;
                matchCfgArray[i].playerBIndex = nextPlayerAdder + 3;
            } else {
                matchCfgArray[i].playerAIndex = nextPlayerAdder + 8;
                matchCfgArray[i].playerBIndex = nextPlayerAdder + 9;
                nextPlayerAdder += 10;
            }
            matchCfgArray[i].roundNumber = 1;
        }
        var matchNumAdder = 0;
        for (var i = 0; i < numMatches[curRound]; i++) {
            matchCfgArray[i].nextMatchNumber = matchCfgArray[i].matchNumber + numMatches[curRound] + matchNumAdder;
            if (matchCfgArray[i].matchNumber % 2 == 1) {
                matchNumAdder += 2;
            }
        }
        var nextSlot = "B";
        for (var i = 0; i < numMatches[curRound]; i++) {
            matchCfgArray[i].nextSlot = nextSlot;
            nextSlot = (nextSlot == "B") ? "A" : "B";
        }

        // round 2
        curRound = 1;
        var firstMatch = numMatches[0]; // first match in this round
        matchNumAdder = numMatches[curRound];
        for (var i = 0; i < numMatches[curRound]; i += 2) {
            var j = i + firstMatch;
            matchCfgArray[j].roundNumber = 2;
            matchCfgArray[j + 1].roundNumber = 2;
            matchCfgArray[j].nextMatchNumber = matchCfgArray[j].matchNumber + matchNumAdder;
            matchCfgArray[j + 1].nextMatchNumber = matchCfgArray[j].matchNumber + matchNumAdder;
            matchNumAdder--;
        }
        nextSlot = "A";
        firstMatch = numMatches[0]; // first match in this round
        for (var i = 0; i < numMatches[curRound]; i++) {
            matchCfgArray[i + firstMatch].nextSlot = nextSlot;
            nextSlot = (nextSlot == "B") ? "A" : "B";
        }
        var playerNumAdder = 0;
        for (var i = 0; i < numMatches[curRound]; i++) {
            if (i % 4 == 0) {
                matchCfgArray[i + firstMatch].playerAIndex = 1 + playerNumAdder;
                matchCfgArray[i + firstMatch].playerBIndex = -1;
            }
            if (i % 4 == 1) {
                matchCfgArray[i + firstMatch].playerAIndex = 4 + playerNumAdder;
                matchCfgArray[i + firstMatch].playerBIndex = 5 + playerNumAdder;
            }
            if (i % 4 == 2) {
                matchCfgArray[i + firstMatch].playerAIndex = 6 + playerNumAdder;
                matchCfgArray[i + firstMatch].playerBIndex = 7 + playerNumAdder;
            }
            if (i % 4 == 3) {
                matchCfgArray[i + firstMatch].playerAIndex = -1;
                matchCfgArray[i + firstMatch].playerBIndex = 10 + playerNumAdder;
                playerNumAdder += 10;
            }
        }
        // round 3 onwards
        for (curRound = 2; curRound < numMatches.length; curRound++) {
            var roundNumber = curRound + 1;
            firstMatch = 0;
            for (var j = 0; j < curRound; j++) {
                firstMatch += numMatches[j];
            }
            matchNumAdder = numMatches[curRound];
            // round number logic
            for (var j = 0; j < numMatches[curRound]; j += 2) {
                var k = j + firstMatch;
                matchCfgArray[k].roundNumber = roundNumber;
                matchCfgArray[k].nextMatchNumber = matchCfgArray[k].matchNumber + matchNumAdder;
                if (numMatches[curRound] > 1) {
                    matchCfgArray[k + 1].roundNumber = roundNumber;
                    matchCfgArray[k + 1].nextMatchNumber = matchCfgArray[k].matchNumber + matchNumAdder;
                }
                matchNumAdder--;
            }
            nextSlot = "A";
            for (var j = 0; j < numMatches[curRound]; j++) {
                matchCfgArray[j + firstMatch].nextSlot = nextSlot;
                nextSlot = (nextSlot == "B") ? "A" : "B";
            }
        }
        // output
        return matchCfgArray;
    } catch (e) {
        console.log(e)
    }
}

function getMatchRecords56(fileData, matchCfgArray) {
    try {
        var logmatchRecords = [];
        var logmatchRecord = {};
        var computeLength = matchCfgArray.length - 1;


        for (let i = 0; i < matchCfgArray.length; i++) {
            var matchRecord = {
                matchNumber: i + 1,
                roundNumber: roundNumber,
                status: "yetToPlay",
                isBlank: false
            };
            playerAIndex = matchCfgArray[i].playerAIndex;
            playerBIndex = matchCfgArray[i].playerBIndex;
            var players = {
                playerA: fileData[playerAIndex].Name,
                playerB: fileData[playerBIndex].Name
            };
            matchRecord.players = players;

            var playerAId = "";
            var playerBId = "";
            playerAId = fileData[playerAIndex]["Affiliation ID"];
            playerBId = fileData[playerBIndex]["Affiliation ID"];
            var user1Validation = undefined;
            var user2Validation = undefined;
            if (playerAId)
                if (playerAId.trim() != "")
                    user1Validation = Meteor.users.findOne({
                        affiliationId: playerAId
                    });
            if (playerBId)
                if (playerBId.trim() != "")
                    user2Validation = Meteor.users.findOne({
                        affiliationId: playerBId
                    });

            if (i < computeLength) {
                if ((user1Validation == undefined && playerAId.trim() != "") || (user2Validation == undefined && playerBId.trim() != "") || playerAId.trim() == "other" || playerBId.trim() == "other" || (playerA.trim() != "()" && playerAId.trim() == "") || (playerB.trim() != "()" && playerBId.trim() == "")) {
                    var message = "";
                    if ((user1Validation == undefined && playerAId.trim() != "") || playerAId.trim() == "other" || (playerA.trim() != "()" && playerAId.trim() == "")) {
                        if (playerA.trim() != "( )" && playerAId.trim() == "")
                            message = {
                                "player": playerA,
                                "message": "Invalid player affiliationID"
                            };
                        if (message != "") logmatchRecords.push(message);
                    }

                    if ((user2Validation == undefined && playerBId.trim() != "") || playerBId.trim() == "other" || (playerB.trim() != "()" && playerBId.trim() == "")) {
                        message = "";
                        if (playerB.trim() != "( )" && playerBId.trim() == "")
                            message = {
                                "player": playerB,
                                "message": "Invalid player affiliationID"
                            };
                        if (message != "") logmatchRecords.push(message);
                    }
                }
            }

            if (user1Validation != undefined)
                playerAId = user1Validation.userId;
            if (user2Validation != undefined)
                playerBId = user2Validation.userId;

            var playersID = {
                playerAId: playerAId,
                playerBId: playerBId
            };
            matchRecord.playersID = playersID;


            var setWins = {
                playerA: 0,
                playerB: 0
            };
            matchRecord.setWins = setWins;
            var score = ["0", "0", "0", "0", "0", "0", "0"];
            var scores = {
                setScoresA: score,
                setScoresB: score
            };
            matchRecord.scores = scores;
            matchRecord.nextMatchNumber = matchCfgArray[i].nextMatchNumber;
            matchRecord.nextSlot = matchCfgArray[i].nextSlot;
            matchRecord.winner = "";
            matchRecord.getStatusColorA = "ip_input_box_type_pName";
            matchRecord.getStatusColorB = "ip_input_box_type_pName";
            matchRecords.push(matchRecord);
        }
    } catch (e) {
        console.log(e)
    }
}

function getMatchRecords5(fileData) {
    try {
        var fileDataLength = fileData.data.length - 1;
        var matchCfgArray = getMatchConfiguration5(fileDataLength);
        var matchRecords = [];
        matchRecords = getMatchRecords56(fileData, matchCfgArray);
        return matchRecords;
    } catch (e) {
        console.log(e)
    }
}

function getMatchRecords6(fileData) {
    try {
        var fileDataLength = fileData.data.length - 1;
        var matchCfgArray = getMatchConfiguration6(fileDataLength);
        var matchRecords = [];
        matchRecords = getMatchRecords56(fileData, matchCfgArray);
        return matchRecords;
    } catch (e) {
        console.log(e)
    }
}

function getMatchRecords8(fileData, eventId, tournamentId, maxRound) {
        try {

            var currentPlayerNumber = 0;
            var playerBNo1 = 0;
            var playerANo1 = 0;
            var tournamentFind = events.findOne({
                "_id": tournamentId
            })
            if (tournamentFind == undefined) {
                tournamentFind = pastEvents.findOne({
                    "_id": tournamentId
                })
            }

            var dbsrequired = ["userDetailsTT"]
            var userDetailsTT = "userDetailsTT"

            var res = Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
            try {
                if (res) {
                    if (res.changeDb && res.changeDb == true) {
                        if (res.changedDbNames.length != 0) {
                            userDetailsTT = res.changedDbNames[0]
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }

            var numPlayers = fileData.data.length;
            // check if the numPlayers is a power of 2
            var numMatches = numPlayers - 1;
            var numRounds = 0;
            while (math.pow(2, numRounds) < numPlayers) {
                numRounds++;
            }
            var matchRecords = [];
            var remainingMatches = numMatches;
            var roundNumber = 1;
            var numMatchesInCurRound = (numMatches % 2 == 0) ? numMatches / 2 : (numMatches + 1) / 2;
            var nextMatchNumber = 0;
            var nextSlot = "";
            var assignedMatchesInThisRound = 0;
            var logmatchRecords = [];
            var logmatchRecord = {};
            var eventRanking = "yes";




            var dobFilterInfo = dobFilterSubscribe.findOne({
                "tournamentId": tournamentId,
                "details.eventId": eventId
            }, {
                fields: {
                    _id: 0,
                    details: {
                        $elemMatch: {
                            "eventId": eventId
                        }
                    }
                }
            });

            if (dobFilterInfo && dobFilterInfo.details.length > 0) {
                if (eventId == dobFilterInfo.details[0].eventId)
                    eventRanking = dobFilterInfo.details[0].ranking;
            }

            for (let i = 0; i < numMatches; i++) {
                var matchRecord = {
                    matchNumber: i + 1,
                    roundNumber: roundNumber,
                    status: "yetToPlay",
                    isBlank: false
                };

                if (parseInt(roundNumber) == parseInt(maxRound)) {
                    matchRecord["roundName"] = "F"
                } else if (parseInt(roundNumber) == parseInt(maxRound) - 1) {
                    matchRecord["roundName"] = "SF"
                } else if (parseInt(roundNumber) == parseInt(maxRound) - 2) {
                    matchRecord["roundName"] = "QF"
                } else if (parseInt(roundNumber) == parseInt(maxRound) - 3) {
                    matchRecord["roundName"] = "PQF"
                } else if (parseInt(roundNumber) == parseInt(maxRound) - 4) {
                    matchRecord["roundName"] = "RS32"
                } else {
                    matchRecord["roundName"] = roundNumber
                }
                var playerA = "";
                var playerB = "";
                var playerAId = "";
                var playerBId = "";

                if (roundNumber == 1) {

                    if (fileData.data[(2 * i)]['Academy Name'] == undefined || fileData.data[(2 * i)]['Academy Name'] == null) {
                        playerA = fileData.data[2 * i].Name + "(others)";
                        playerAId = fileData.data[2 * i]["Affiliation ID"];
                    } else {
                        playerA = fileData.data[2 * i].Name + "(" + fileData.data[2 * i]['Academy Name'].toString().substr(0, 3) + ")";
                        playerAId = fileData.data[2 * i]["Affiliation ID"];
                    }
                    if (fileData.data[1 + (2 * i)]['Academy Name'] == undefined || fileData.data[1 + (2 * i)]['Academy Name'] == null) {
                        playerB = fileData.data[1 + (2 * i)].Name + "(others)";
                        playerBId = fileData.data[1 + (2 * i)]["Affiliation ID"];
                    } else {
                        playerB = fileData.data[1 + (2 * i)].Name + "(" + fileData.data[1 + (2 * i)]['Academy Name'].toString().substr(0, 3) + ")";
                        playerBId = fileData.data[1 + (2 * i)]["Affiliation ID"];
                    }

                    var user1Validation = undefined;
                    var user2Validation = undefined;
                    if (eventRanking == "yes") {
                        if (playerAId.trim() != "")
                            user1Validation = global[userDetailsTT].findOne({
                                affiliationId: playerAId
                            });
                        if (playerBId.trim() != "")
                            user2Validation = global[userDetailsTT].findOne({
                                affiliationId: playerBId
                            });
                    } else if (eventRanking == "no") {
                        if (playerAId.trim() != "")
                            user1Validation = global[userDetailsTT].findOne({
                                tempAffiliationId: playerAId
                            });
                        if (playerBId.trim() != "")
                            user2Validation = global[userDetailsTT].findOne({
                                tempAffiliationId: playerBId
                            });
                    }
                    if ((user1Validation == undefined && playerAId.trim() != "") || (user2Validation == undefined && playerBId.trim() != "") || playerAId.trim() == "other" || playerBId.trim() == "other" || (playerA.trim() != "()" && playerAId.trim() == "") || (playerB.trim() != "()" && playerBId.trim() == "")) {
                        var message = "";
                        if ((user1Validation == undefined && playerAId.trim() != "") || playerAId.trim() == "other" || (playerA.trim() != "()" && playerAId.trim() == "")) {
                            if (playerA.trim() != "( )" && playerAId.trim() == "" && fileData.data[2 * i].Name != "") {
                                if (eventRanking == "yes")
                                    message = {
                                        "player": playerA,
                                        "message": "has invalid affiliationID"
                                    };
                                else
                                    message = {
                                        "player": playerA,
                                        "message": "has invalid temporary affiliationID"
                                    };

                            }
                            if (user1Validation == undefined && playerAId.trim() != "") {
                                if (eventRanking == "yes")
                                    message = {
                                        "player": playerA,
                                        "message": "has invalid affiliationID"
                                    };
                                else
                                    message = {
                                        "player": playerA,
                                        "message": "has invalid temporary affiliationID"
                                    };

                            }

                            if (message != "") logmatchRecords.push(message);
                        }

                        if ((user2Validation == undefined && playerBId.trim() != "") || playerBId.trim() == "other" || (playerB.trim() != "()" && playerBId.trim() == "")) {
                            message = "";
                            if (playerB.trim() != "( )" && playerBId.trim() == "" && fileData.data[1 + (2 * i)].Name != "") {
                                if (eventRanking == "yes")
                                    message = {
                                        "player": playerB,
                                        "message": "has invalid affiliationID"
                                    };
                                else
                                    message = {
                                        "player": playerB,
                                        "message": "has invalid temporary affiliationID"
                                    };
                            }
                            if (user2Validation == undefined && playerBId.trim() != "") {
                                if (eventRanking == "yes")
                                    message = {
                                        "player": playerB,
                                        "message": "has invalid affiliationID"
                                    };
                                else
                                    message = {
                                        "player": playerB,
                                        "message": "has invalid temporary affiliationID"
                                    };
                            }
                            if (message != "") logmatchRecords.push(message);
                        }
                    }

                    if (user1Validation != undefined)
                        playerAId = user1Validation.userId;
                    if (user2Validation != undefined)
                        playerBId = user2Validation.userId;

                    if (playerAId == "0" || playerAId.trim() == "") {
                        matchRecord.status2 = "bye";
                        matchRecord.status = "bye";
                        matchRecord.propogatePlayerID = playerBId;
                        matchRecord.propogatePlayerName = playerB;
                        matchRecord.getStatusColorA = "ip_input_box_type_pNameBye";
                        matchRecord.getStatusColorB = "ip_input_box_type_pName";
                        matchRecord.winnerID = playerBId;
                        matchRecord.winner = playerB;
                        playerANo1 = "";
                        playerBNo1 = currentPlayerNumber + 1;
                        var currentMatchNumber = i + 1;
                        var predictMatchNumber = currentMatchNumber * 2;
                        var playerANo = predictMatchNumber - 1;
                        var playerBNo = predictMatchNumber;
                        matchRecord.winnerNo = playerBNo;
                        currentPlayerNumber = playerBNo;

                        if (currentMatchNumber % 2 == 0)
                            matchRecord.propogatePlaceHolder = "playerBId";
                        else
                            matchRecord.propogatePlaceHolder = "playerAId";

                    } else if (playerBId == "0" || playerBId.trim() == "") {
                        matchRecord.status2 = "bye";
                        matchRecord.status = "bye";
                        matchRecord.propogatePlayerID = playerAId;
                        matchRecord.propogatePlayerName = playerA;
                        var currentMatchNumber = i + 1;
                        matchRecord.getStatusColorB = "ip_input_box_type_pNameBye";
                        matchRecord.getStatusColorA = "ip_input_box_type_pName";
                        matchRecord.winnerID = playerAId;
                        matchRecord.winner = playerA;

                        playerANo1 = currentPlayerNumber + 1;
                        playerBNo1 = "";
                        var predictMatchNumber = currentMatchNumber * 2;
                        var playerANo = predictMatchNumber - 1;
                        var playerBNo = predictMatchNumber;
                        matchRecord.winnerNo = playerANo;

                        currentPlayerNumber = playerANo;

                        if (currentMatchNumber % 2 == 0)
                            matchRecord.propogatePlaceHolder = "playerBId";
                        else
                            matchRecord.propogatePlaceHolder = "playerAId";
                    } else {
                        matchRecord.status2 = "";
                        matchRecord.playerStatusID = "";
                        matchRecord.playerPropogateID = "";
                        matchRecord.getStatusColorA = "ip_input_box_type_pName";
                        matchRecord.getStatusColorB = "ip_input_box_type_pName";
                        matchRecord.winner = "";
                        matchRecord.winnerNo = ""
                        playerANo1 = currentPlayerNumber + 1;
                        playerBNo1 = playerANo1 + 1;
                        currentPlayerNumber = currentPlayerNumber + 2;

                    }
                    matchRecord.roundName = matchRecord.roundName
                }



                var players = {
                    playerA: playerA,
                    playerB: playerB
                };

                matchRecord.players = players;

                var playersID = {
                    playerAId: playerAId,
                    playerBId: playerBId
                };
                matchRecord.playersID = playersID;

                var setWins = {
                    playerA: 0,
                    playerB: 0
                };

                matchRecord.setWins = setWins;
                var score = ["0", "0", "0", "0", "0", "0", "0"];
                var scores = {
                    setScoresA: score,
                    setScoresB: score
                };
                var adder = (assignedMatchesInThisRound % 2 == 0) ? assignedMatchesInThisRound / 2 : (assignedMatchesInThisRound - 1) / 2;
                adder = adder + 1;
                base = matchRecord.matchNumber;
                base = base + (numMatchesInCurRound - assignedMatchesInThisRound - 1);
                nextMatchNumber = adder + base;
                if (matchRecord.matchNumber % 2 == 0) {
                    nextSlot = "B";
                } else {
                    nextSlot = "A";
                }
                matchRecord.nextMatchNumber = nextMatchNumber;
                matchRecord.nextSlot = nextSlot;
                matchRecord.scores = scores;

                if (parseInt(roundNumber) == 1) {

                    var currentMatchNumber = i + 1;
                    var predictMatchNumber = currentMatchNumber * 2;
                    var playerANo = predictMatchNumber - 1;
                    var playerBNo = predictMatchNumber;

                    var playersNo = {
                        "playerANo": playerANo,
                        "playerBNo": playerBNo
                    };

                    matchRecord.playersNo = playersNo;
                } else {
                    var playersNo = {
                        "playerANo": "",
                        "playerBNo": ""
                    };
                    matchRecord.playersNo = playersNo;

                }


                if (parseInt(roundNumber) != 1) {
                    matchRecord.getStatusColorA = "ip_input_box_type_pName";
                    matchRecord.getStatusColorB = "ip_input_box_type_pName";
                    matchRecord.winner = "";

                }

                matchRecords.push(matchRecord);
                assignedMatchesInThisRound++;
                if (assignedMatchesInThisRound == numMatchesInCurRound) {
                    roundNumber++;
                    assignedMatchesInThisRound = 0;
                    numMatchesInCurRound = numMatchesInCurRound / 2;
                }
                remainingMatches--;
            }


            for (var r = 0; r < matchRecords.length; r++) {
                var currentMatchRecord = matchRecords[r];
                if (currentMatchRecord.status2 == "bye") {
                    var rowNumber = parseInt(currentMatchRecord.nextMatchNumber) - parseInt(1);
                    if (matchRecords[rowNumber] != undefined) {
                        if (currentMatchRecord.propogatePlaceHolder == "playerAId") {
                            matchRecords[rowNumber].playersID.playerAId = currentMatchRecord.propogatePlayerID;
                            matchRecords[rowNumber].players.playerA = currentMatchRecord.propogatePlayerName;
                            matchRecords[rowNumber].playersNo.playerANo = currentMatchRecord.winnerNo;
                        } else if (currentMatchRecord.propogatePlaceHolder == "playerBId") {
                            matchRecords[rowNumber].playersID.playerBId = currentMatchRecord.propogatePlayerID;
                            matchRecords[rowNumber].players.playerB = currentMatchRecord.propogatePlayerName;
                            matchRecords[rowNumber].playersNo.playerBNo = currentMatchRecord.winnerNo;
                        }
                    }
                }
            }

            if (logmatchRecords.length <= 0) {
                return matchRecords;
            } else
                return logmatchRecords;
        } catch (e) {
            console.log(e)
        }
    }
    //------------------------------------------------------------------------

Meteor.methods({
    initMatchRecords: function(tournamentId, eventName, eventId, fileData, maxRound) {
        try {


            let tournament = events.findOne({
                "_id": tournamentId
            });
            if (tournament == undefined) {
                tournament = pastEvents.findOne({
                    "_id": tournamentId
                });
            }
            if (tournament) {
                if (tournament.eventOrganizer !== Meteor.userId() && Meteor.userId() != null && Meteor.userId() != undefined) {
                    return false;
                }
                var fileDataLength = fileData.data.length;
                var matchRecords = [];

                if (fileDataLength == 2 || fileDataLength == 4 || fileDataLength == 8 || fileDataLength == 16 || fileDataLength == 32 || fileDataLength == 64 || fileDataLength == 128 || fileDataLength == 256 || fileDataLength == 512 || fileDataLength == 1024) {
                    var maxRound = Math.log(fileDataLength) / Math.log(2);
                    matchRecords = getMatchRecords8(fileData, eventId, tournamentId, maxRound);
                } else
                if (fileDataLength % 6 == 0) {
                    matchRecords = getMatchRecords6(fileData);
                } else
                if (fileDataLength % 5 == 0) {
                    matchRecords = getMatchRecords5(fileData);
                }

                var status = true;
                if (matchRecords.length > 0) 
                {
                    if (matchRecords[0] && matchRecords[0].message != undefined) {
                        if (matchRecords[0].message) {
                            status = false;
                        }
                    } else {
                        status = true;
                    }
                    if (status && matchRecords.length > 0) {

                        MatchCollectionDB.insert({
                            tournamentId: tournamentId,
                            eventName: eventName,
                            matchRecords: matchRecords
                        });
                        return matchRecords;
                    } else {

                        return matchRecords;
                    }
                } else {
                    return matchRecords;
                }
            } else
                return false;

        } catch (e) {

            console.log(e)

        }
    },


    getMatchesFromDB: function(tournamentId, eventName) {
        try {
            let matchRecords = [];
            try {
                let getMatchRecords = MatchCollectionDB.findOne({
                    tournamentId: tournamentId,
                    eventName: eventName
                });
                if(getMatchRecords && getMatchRecords.matchRecords)
                {

                    var numMatchesFound = getMatchRecords.matchRecords.length;
                    return getMatchRecords.matchRecords;

                }

            } catch (error) {
                console.log(error)
                return matchRecords;
            }
        } catch (e) {
            console.log(e)
        }
    },

    getMatchesFromDB_Round: function(tournamentId, eventName, roundNumber) {
        try {

            let leftMatchRecords = [];
            let rightMatchRecords = [];
            let matchRecords = [];

            //fetch left round /right round matches

            let getMatchRecords = MatchCollectionDB.findOne({
                tournamentId: tournamentId,
                eventName: eventName
            });



            leftMatchRecords = MatchCollectionDB.aggregate([{
                $match: {
                    "tournamentId": tournamentId,
                    "eventName": eventName
                }
            }, {
                $unwind: "$matchRecords"
            }, {
                $match: {
                    "matchRecords.roundNumber": roundNumber
                }
            }, {
                $group: {
                    "_id": "$_id",
                    "tournamentId": {
                        "$first": "$tournamentId"
                    },
                    "eventName": {
                        "$first": "$eventName"
                    },
                    "matchRecords": {
                        "$push": "$matchRecords"
                    },
                }
            }]);


            var rightMatchRound = parseInt(roundNumber) + 1;
            rightMatchRecords = MatchCollectionDB.aggregate([{
                $match: {
                    "tournamentId": tournamentId,
                    "eventName": eventName
                }
            }, {
                $unwind: "$matchRecords"
            }, {
                $match: {
                    "matchRecords.roundNumber": rightMatchRound
                }
            }, {
                $group: {
                    "_id": "$_id",
                    "tournamentId": {
                        "$first": "$tournamentId"
                    },
                    "eventName": {
                        "$first": "$eventName"
                    },
                    "matchRecords": {
                        "$push": "$matchRecords"
                    },
                }
            }]);

            var resultJson = {};
            resultJson["status"] = "success";

            if (getMatchRecords && getMatchRecords.matchRecords)
                resultJson["matchRecords"] = getMatchRecords.matchRecords;
            else
                resultJson["matchRecords"] = matchRecords;

            if (leftMatchRecords.length > 0 && leftMatchRecords[0].matchRecords)
                resultJson["leftMatchRecords"] = leftMatchRecords[0].matchRecords;
            else
                resultJson["leftMatchRecords"] = leftMatchRecords;

            if (rightMatchRecords.length > 0 && rightMatchRecords[0].matchRecords)
                resultJson["rightMatchRecords"] = rightMatchRecords[0].matchRecords;
            else
                resultJson["rightMatchRecords"] = rightMatchRecords;


            return resultJson;
        } catch (error) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["leftMatchRecords"] = leftMatchRecords;
            resultJson["rightMatchRecords"] = rightMatchRecords;
            console.log(error)
            return resultJson;
        }
    },
    updateMatchDraws: function(tournamentId, eventName, matchRecord) {
        try {
            let tournament = events.findOne({
                "_id": tournamentId
            });
            if (tournament == undefined) {
                tournament = pastEvents.findOne({
                    "_id": tournamentId
                });
            }
            if (tournament.eventOrganizer != Meteor.userId()) {
                return false;
            }

            var s = MatchCollectionDB.update({
                "tournamentId": tournamentId,
                "eventName": eventName,
                "matchRecords": {
                    $elemMatch: {
                        matchNumber: matchRecord.matchNumber,
                    }
                }
            }, {
                $set: {
                    "matchRecords.$": matchRecord
                }
            });
            if (s)
                return true;
        } catch (e) {
            console.log(e)
        }
    },
    updateMatchRecords: async function(tournamentId, eventName, matchRecords, currentMatchRecord) {
        try {
            // TODO
            let tournament = events.findOne({
                "_id": tournamentId
            });
            if (tournament == undefined) {
                tournament = pastEvents.findOne({
                    "_id": tournamentId
                });
            }
            if (tournament.eventOrganizer != Meteor.userId()) {
                return false;
            }

            var onlyBMR = MatchCollectionDB.aggregate([
                {
                    $match:{
                        tournamentId: tournamentId,
                        eventName: eventName
                    }
                },{
                    $unwind:{
                        path:"$matchRecords"
                    }
                },{
                    $match:{
                        "matchRecords.roundName":"BM"
                    }
                }
            ])

            /**/

            if(onlyBMR && onlyBMR.length && currentMatchRecord.roundName=="F" &&
                onlyBMR[0].matchRecords){
                var searched = _.findWhere(matchRecords, {roundName:"BM"});
                if(searched){
                    matchRecords = _.without(matchRecords, searched);
                }
                matchRecords.push(onlyBMR[0].matchRecords)
            }
            
            var s = MatchCollectionDB.update({
                $and: [{
                    tournamentId: tournamentId,
                    eventName: eventName
                }]
            }, {
                $set: {
                    matchRecords: matchRecords
                }
            });
            if (currentMatchRecord.roundName && currentMatchRecord.roundName !== "F" && currentMatchRecord.roundName !== "BM") {
                var findFirst = MatchCollectionConfig.aggregate([{
                    $match: {
                        tournamentId: tournamentId,
                        eventName: eventName,
                    }
                }, {
                    $unwind: {
                        "path": "$roundValues"
                    }
                }, {
                    $match: {
                        "roundValues.roundName": "Bronze Medal"
                    }
                }])

                if (findFirst && findFirst.length && findFirst[0].roundValues &&
                    findFirst[0].roundValues) {
                    var r = MatchCollectionDB.update({
                        tournamentId: tournamentId,
                        eventName: eventName
                    }, {
                        $pull: {
                            matchRecords: {
                                "roundName": "BM"
                            }
                        }
                    });
                    var r1 = MatchCollectionConfig.update({
                        tournamentId: tournamentId,
                        eventName: eventName
                    }, {
                        $pull: {
                            roundValues: {
                                "roundName": "Bronze Medal"
                            }
                        }
                    })

                    var data = {
                        tournamentId: tournamentId,
                        eventName: eventName,
                    }

                    var getData = await Meteor.call("fetchLoserForBMRoundDataInd", data)
                    if (getData && getData.status == SUCCESS_STATUS && getData.data) {
                        var data1 = {
                            tournamentId: tournamentId,
                            "eventName": eventName,
                            "playerAName": getData.data.player1Name,
                            "playerBName": getData.data.player2Name,
                            "playerAId": getData.data.player1Id,
                            "playerBId": getData.data.player2Id,
                            "playerANo": getData.data.player1No,
                            "playerBNo": getData.data.player2No,
                            noofSets: findFirst[0].roundValues.noofSets,
                            minScores: findFirst[0].roundValues.minScores,
                            minDifference: findFirst[0].roundValues.minDifference,
                            points: findFirst[0].roundValues.points
                        }


                    }

                    var saveValidatedData = await Meteor.call("insertOrUpdateRoundBMInd", data1)
                }
            }

            if (s)
                Meteor.call("sendSMSOnPropogate", currentMatchRecord, tournamentId, eventName, 1, function(e, res) {})

        } catch (e) {
            console.log(e)
        }
    },
    resetMatchRecords: function(tournamentId, eventName, eventOrganizer, sportID) {
        try {
            // TODO
            let tournament = events.findOne({
                "_id": tournamentId
            });
            if (tournament == undefined) {
                tournament = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            if (tournament) {
                if (tournament.eventOrganizer != Meteor.userId() && Meteor.userId() != null && Meteor.userId != undefined) {
                    return false;
                } else {
                    var rem_result = MatchCollectionDB.remove({
                        $and: [{
                            tournamentId: tournamentId,
                            eventName: eventName
                        }]
                    });
                    MatchCollectionConfig.remove({
                        $and: [{
                            tournamentId: tournamentId,
                            eventName: eventName
                        }]
                    })

                    var liveScoresRes = liveScores.remove({
                        $and: [{
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        }]
                    });


                    try {
                        var playerTournEntry = PlayerPoints.find({
                            'sportId': sportID,
                            "organizerId": eventOrganizer,
                            "eventName": eventName,
                            "eventPoints.tournamentId": tournamentId
                        }).fetch();
                        if (playerTournEntry.length > 0) {
                            for (var l = 0; l < playerTournEntry.length; l++) {
                                //tournament removed
                                var playerId = playerTournEntry[l].playerId;
                                var removeTournEntry = PlayerPoints.update({
                                    "playerId": playerId,
                                    'sportId': sportID,
                                    "organizerId": eventOrganizer,
                                    "eventName": eventName
                                }, {
                                    $pull: {
                                        "eventPoints": {
                                            "tournamentId": tournamentId
                                        }
                                    }
                                });

                                //re compute totalpoints of event
                                var totalInfo = PlayerPoints.findOne({
                                    "playerId": playerId,
                                    'sportId': sportID,
                                    "organizerId": eventOrganizer,
                                    "eventName": eventName
                                }, {
                                    fields: {
                                        "eventPoints.tournamentPoints": 1,
                                        "_id": 0
                                    }
                                })

                                if (totalInfo) {
                                    var tourPointsList = totalInfo.eventPoints;
                                    var total = "0";
                                    for (var x = 0; x < tourPointsList.length; x++) {
                                        total = parseInt(total) + parseInt(tourPointsList[x].tournamentPoints);
                                    }
                                    var totalPointsUpdate = PlayerPoints.update({
                                        "playerId": playerId,
                                        'sportId': sportID,
                                        "organizerId": eventOrganizer,
                                        "eventName": eventName
                                    }, {
                                        $set: {
                                            "totalPoints": total
                                        }
                                    });
                                }
                            }
                        }
                    } catch (e) {}
                    if (rem_result)
                        return true;
                }
            } else
                return false;
        } catch (e) {
            console.log(e)
        }
    },

    updateCompletedScores: function(tournamentId, eventName, matchNumber, data, status, winner, completedScores) {
        // TODO
        try {
            let tournament = events.findOne({
                "_id": tournamentId
            });
            if (tournament.eventOrganizer != Meteor.userId()) {
                return false;
            }

            var scores = JSON.parse(JSON.stringify(data)).scores;

            MatchCollectionDB.update({
                "tournamentId": tournamentId,
                "eventName": eventName,
                "matchRecords.matchNumber": matchNumber
            }, {
                $set: {
                    "matchRecords.$.scores": scores,
                    "matchRecords.$.status": status,
                    "matchRecords.$.winner": winner,
                    "matchRecords.$.completedscores": completedScores
                }
            });
        } catch (e) {
            console.log(e)
        }

    }

});

playersNoSchema = new SimpleSchema({
    "playerANo": {
        type: String,
        label: "First Player No",
        optional: true
    },
    "playerBNo": {
        type: String,
        label: "Second Player No",
        optional: true
    }

});



playersSchema = new SimpleSchema({
    "playerA": {
        type: String,
        label: "First Player name",
        optional: true
    },
    "playerB": {
        type: String,
        label: "Second Player name",
        optional: true
    },
    "playerAId": {
        type: String,
        autoValue: function() {
            return "YEsH3He3JG8Ec6Tsd"
        }
    },
    "playerBId": {
        type: String,
        autoValue: function() {
            return "awyrjoidLuAc9rznR"
        }
    }
});

playersIDSchema = new SimpleSchema({
    "playerA": {
        type: String,
        label: "First Player name",
    },
    "playerB": {
        type: String,
        label: "Second Player name",
    },
    "playerAId": {
        type: String,
        autoValue: function() {
            return "YEsH3He3JG8Ec6Tsd"
        }
    },
    "playerBId": {
        type: String,
        autoValue: function() {
            return "awyrjoidLuAc9rznR"
        }
    }
});

scoresSchema = new SimpleSchema({
    "setScoresA": {
        type: [Number],
        label: "Set scores of Player-A"
    },
    "setScoresB": {
        type: [Number],
        label: "Set scores of Player-B"
    }
    /*,
      "applicableSports": {
        type: String,
        label: "Maybe, to check if this match record schema can be used for a given sport",
        allowedValues: ["Table Tennis", "Badminton", "Tennis", "Squash"]
      }*/
});

completedScoresSchema = new SimpleSchema({
    "setScores": {
        type: [Number],
        label: "scores of winner"
    }
    /*,
      "applicableSports": {
        type: String,
        label: "Maybe, to check if this match record schema can be used for a given sport",
        allowedValues: ["Table Tennis", "Badminton", "Tennis", "Squash"]
      }*/
});

MatchRecordsSchema = new SimpleSchema({
    "matchNumber": {
        type: Number,
        label: "The unique match number within the said event",
        denyUpdate: true
    },
    "roundNumber": {
        type: Number,
        label: "The round to which this match belongs to"
    },
    "roundName": {
        type: Number,
        label: "RoundName"
    },
    "status": {
        type: String,
        allowedValues: ['yetToPlay', 'completed', 'bye', 'walkover', 'cancel'],
        label: "Status of the match"
    },
    "status2": {
        type: String,
        label: "Status of the player"
    },
    "propogatePlayerID": {
        type: String,
        label: "Status of the player"
    },
    "propogatePlaceHolder": {
        type: String,
        label: "Status of the player"
    },
    "propogatePlayerName": {
        type: String,
        label: "Status of the player"
    },
    "players": {
        type: playersSchema,
        label: "Names of the players/teams",
        optional: true
    },
    "playersID": {
        type: playersIDSchema,
        label: "Names of the players/teams",
    },
    "playersNo": {
        type: playersNoSchema,
        label: "Names of the players/teams",
        optional: true
    },

    "scores": {
        type: scoresSchema,
        label: "Scores of the match",
        optional: true
    },
    "completedscores": {
        type: completedScoresSchema,
        label: "Completed scores of the match",
        optional: true
    },
    "winner": {
        type: String,
        label: "Name of the winner",
        optional: true
    },
    "winnerID": {
        type: String,
        label: "ID of the winner",
    },
    "winnerNo": {
        type: String,
        label: "no of the winner",
    },
    "isBlank": {
        type: Boolean,
        label: "False by default, true for blank matches used as fillers"
    }
});

MatchCollectionSchema = new SimpleSchema({
    "tournamentId": {
        type: String,
        label: "The Doc Id of the tournament",
        denyUpdate: true
    },
    "eventName": {
        type: String,
        label: "The name of the event",
        denyUpdate: true
    },
    "drawsLock": {
        type: Boolean,
        label: "Draws Lock",
        optional: true
    },
    "matchRecords": {
        type: [MatchRecordsSchema],
        label: "Record of all the matches in that Tournament/Event"
    }
});

// MatchCollectionDB.attachSchema(MatchCollectionSchema);



/*--------------test code ---------------*/




Meteor.methods({

    'matchRecords/validMatchNumber': function(tournamentId, eventName, matchNumber, roundNumber) {

        let matchRecords = [];
        let getMatchRecords;
        try {
            if (roundNumber != "") {
                getMatchRecords = MatchCollectionDB.findOne({
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                    "matchRecords": {
                        $elemMatch: {
                            "matchNumber": parseInt(matchNumber),
                            "roundNumber": parseInt(roundNumber)
                        }
                    }

                });

                if (getMatchRecords == undefined) {
                    getMatchRecords = MatchCollectionDB.findOne({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                        "matchRecords": {
                            $elemMatch: {
                                "matchNumber": parseInt(matchNumber)
                            }
                        }
                    });
                }

            } else {

                getMatchRecords = MatchCollectionDB.findOne({
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                    "matchRecords": {
                        $elemMatch: {
                            "matchNumber": parseInt(matchNumber)
                        }
                    }

                });
            }
            if (getMatchRecords && getMatchRecords.matchRecords) {
                var numMatchesFound = getMatchRecords.matchRecords.length;
                return getMatchRecords.matchRecords;
            }

        } catch (error) {
            console.log(error)
            return matchRecords;
        }

    },

    'matchRecords/validRoundNumber': function(tournamentId, eventName) {
        try {
            var roundValuesRecords = MatchCollectionConfig.findOne({
                'tournamentId': tournamentId,
                'eventName': eventName
            });
            if (roundValuesRecords == undefined) {
                roundValuesRecords = MatchTeamCollectionConfig.findOne({
                    'tournamentId': tournamentId,
                    'eventName': eventName
                });
            }
            if (roundValuesRecords.roundValues)
                return roundValuesRecords.roundValues;

        } catch (e) {
            console.log(e)
            return null;
        }


    },




    /* aug 5*/
    'removeDraws': function(tournamentId, eventName) {
        try {
            MatchCollectionDB.remove({
                $and: [{
                    tournamentId: tournamentId,
                    eventName: eventName
                }]
            });
            MatchCollectionConfig.remove({
                $and: [{
                    tournamentId: tournamentId,
                    eventName: eventName
                }]
            });
        } catch (e) {
            console.log(e)
        }
    },
    /* aug 10 */
    'drawsEvents': function(tournamentId) {
        try {
            var eventDraws = [],
                eventDraws2 = [];
            var eventList = MatchCollectionDB.find({
                "tournamentId": tournamentId
            }).fetch();
            var eventList2 = teamMatchCollectionDB.find({
                "tournamentId": tournamentId
            }).fetch();
            if (eventList) {
                for (var i = 0; i < eventList.length; i++) {
                    eventDraws[i] = eventList[i].eventName;
                }
            }

            if (eventList2) {
                for (var j = 0; j < eventList2.length; j++) {
                    eventDraws2[j] = eventList2[j].eventName;
                }
            }

            var eventDrawsFinal = eventDraws.concat(eventDraws2);
            return eventDrawsFinal;

        } catch (e) {
            console.log(e)
        }

    },




    "fetchAcademyFee": function(academyId, tournamentId) {


    },

});

/*  */