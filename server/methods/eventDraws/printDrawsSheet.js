import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

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
    playerDBFind
}
from '../dbRequiredRole.js';

Meteor.methods({
    'printDrawsSheet': async function(tournamentId, eventName, withScores) {
        try{
            if (Meteor.isServer) {
                try {
                    if (withScores == undefined || withScores == null) {
                        withScores = true
                    }
                    if (typeof withScores == "string") {
                        if (withScores == "true") {
                            withScores = true
                        } else if (withScores == "false") {
                            withScores = false
                        }
                    } else if (typeof withScores == "boolean") {
                        withScores = withScores
                    }

                    var tournamentFind = events.findOne({
                        "_id": tournamentId
                    })
                    if (tournamentFind == undefined || tournamentFind == null) {
                        tournamentFind = pastEvents.findOne({
                            "_id": tournamentId
                        })
                    }
                    var dbsrequired = ["userDetailsTT"]
                    var userDetailsTT = "userDetailsTT"

                    var res = await Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
                    try {
                        if (res) {
                            if (res.changeDb && res.changeDb == true) {
                                if (res.changedDbNames.length != 0) {
                                    userDetailsTT = res.changedDbNames[0]
                                }
                            }
                        }
                    } catch (e) {console.log(e);}


                    var webshot = Meteor.npmRequire('webshot');
                    var fs = Npm.require('fs');
                    var Future = Npm.require('fibers/future');
                    var fut = new Future();
                    var fileName = "matchRecords-report.pdf";
                    var css = Assets.getText('drawsStyle.css');
                    var arrayOfNextMatch1 = [];
                    var arrayOfNextMatch2 = [];
                    var arrayOfNextMatch3 = [];
                    var arrayOfNextMatch4 = [];
                    SSR.compileTemplate('layoutTest_Player', Assets.getText('layoutTest_Player.html'));
                    ServerSession.set("calledTime", false)
                    ServerSession.set("arrayOfNextMatch1", false)
                    ServerSession.set("arrayOfNextMatch2", false)
                    ServerSession.set("arrayOfNextMatch3", false)
                    ServerSession.set("arrayOfNextMatch4", false)
                    ServerSession.set("2ndMAtchRemove", false)
                    ServerSession.set("3rdMAtchRemove", false)
                    ServerSession.set("4thMAtchRemove", false)
                    ServerSession.set("5thMAtchRemove", false)


                    Template.layoutTest_Player.helpers({
                        checkfor32: function() {
                            try {
                                var rounLen = MatchCollectionConfig.findOne({
                                    'tournamentId': tournamentId,
                                    'eventName': eventName,
                                }).roundValues;
                                if(_.findWhere( rounLen, {roundName:"Bronze Medal"})){
                                   rounLen = _.without(rounLen, _.findWhere(rounLen, {
                                      roundName:"Bronze Medal"
                                    }));
                                }

                                if (rounLen.length == 6)
                                    return false
                                else
                                    return true
                            } catch (e) {

                            }
                        },
                        getDocType: function() {
                            return "<!DOCTYPE html>";
                        },
                        "imageURL": function() {
                            try {
                                var absoluteUrl = Meteor.absoluteUrl().toString();
                                var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                                var imageURL = absoluteUrlString;
                                return imageURL;
                            } catch (e) {}
                        },
                        "logoImg":function(){
                            var tourExists;
                            tourExists = events.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                            if(tourExists == undefined)
                            {
                                tourExists = pastEvents.findOne({
                                        "tournamentEvent": true,
                                        '_id': tournamentId
                                    });                           
                            }

                            if(tourExists && tourExists.eventOrganizer)
                            {
                                eventOrganizer = tourExists.eventOrganizer;
                                var organizerInfo = Meteor.users.findOne({"userId":eventOrganizer});
                                if(organizerInfo) 
                                {
                                    var apiInfo = apiUsers.findOne({"userId":eventOrganizer});
                                    if(apiInfo && apiInfo.siteImg)
                                    {
                                        return apiInfo.siteImg;
                                    }
                               
                                }           
                            }
                            return "logo.png";

                        },
                        get5sImage: function() {
                            try {
                                var e = events.findOne({
                                    "eventName": eventName,
                                    "tournamentEvent": false,
                                    'tournamentId': tournamentId
                                })
                                if (e == undefined) {
                                    e = pastEvents.findOne({
                                        "eventName": eventName,
                                        tournamentId: tournamentId
                                    })
                                }
                                if (e && e.sponsorLogo) {
                                    sponsorLogo = e.sponsorLogo
                                    var sponsorLogoURL = eventUploads.findOne({
                                        "_id": sponsorLogo
                                    });
                                    if (sponsorLogoURL) {
                                        return sponsorLogoURL
                                    } else return false
                                } else return false
                            } catch (e) {

                            }
                        },
                        getLength: function() {
                            return "3"
                        },
                        tournamentName: function() {
                            try {
                                var tourInfo;
                                tourInfo = events.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.eventName;
                                else {
                                    tourInfo = pastEvents.findOne({
                                        "tournamentEvent": true,
                                        '_id': tournamentId
                                    });
                                    if (tourInfo)
                                        return tourInfo.eventName;
                                }
                            } catch (e) {}
                        },

                        eventName: function() {
                            try {
                                return eventName;
                            } catch (e) {}
                        },

                        venueAddress: function() {
                            try {
                                var tourInfo;
                                tourInfo = events.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.venueAddress;
                                else {
                                    tourInfo = pastEvents.findOne({
                                        "tournamentEvent": true,
                                        '_id': tournamentId
                                    });
                                    if (tourInfo)
                                        return tourInfo.venueAddress;
                                }
                            } catch (e) {}
                        },

                        domainName: function() {
                            try {
                                var tourInfo;
                                tourInfo = events.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.domainName;
                                else {
                                    tourInfo = pastEvents.findOne({
                                        "tournamentEvent": true,
                                        '_id': tournamentId
                                    });
                                    if (tourInfo)
                                        return tourInfo.domainName;
                                }
                            } catch (e) {}
                        },

                        eventDate: function() {
                            try {
                                var tourInfo;
                                tourInfo = events.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo) {
                                    if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                        return reverseDate(tourInfo.eventStartDate) + " - " + reverseDate(tourInfo.eventEndDate);
                                } else {
                                    tourInfo = pastEvents.findOne({
                                        "tournamentEvent": true,
                                        '_id': tournamentId
                                    });
                                    if (tourInfo) {
                                        if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                            return reverseDate(tourInfo.eventStartDate) + " - " + reverseDate(tourInfo.eventEndDate);
                                    }
                                }
                            } catch (e) {}
                        },


                        validateStatus: function(status) {
                            try {
                                if (withScores == true) {
                                    if (status != null || status != undefined || status.trim().length != 0) {
                                        if (status.toLowerCase() == "bye") {
                                            return "bye"
                                        } else if (status.toLowerCase() == "walkover") {
                                            return "walkover"
                                        }
                                    }
                                }
                            } catch (e) {}
                        },
                        validateStatus2: function(status, status2) {
                            try {
                                if (withScores == true) {
                                    if (status != null || status != undefined || status.trim().length != 0) {
                                        if (status.toLowerCase() == "bye" && status2.toLowerCase() != "bye") {
                                            return "bye"
                                        } else if (status.toLowerCase() == "walkover") {
                                            return "walkover"
                                        }
                                    }
                                }
                            } catch (e) {}
                        },
                        validateScore: function(completedScore, status) {
                            try {
                                if (withScores == true) {
                                    if (status != null && status != undefined && status.trim().length != 0 && status.toLowerCase() == "completed") {

                                        var scoreInfo = "";
                                        for (var k = 0; k < completedScore.setScoresA.length; k++) {
                                            if (parseInt(completedScore.setScoresA[k]) == 0 && parseInt(completedScore.setScoresB[k]) == 0) {

                                            } else {
                                                if (k != 0)
                                                    scoreInfo += ",";
                                                scoreInfo += completedScore.setScoresA[k] + " - " + completedScore.setScoresB[k] + " "
                                            }

                                        }

                                        if (scoreInfo.toString() != "") {
                                            var finalScore = "(" + scoreInfo.toString() + ")";
                                            finalScore = finalScore.replace(",,", "");
                                            finalScore = finalScore.replace(",)", ")");
                                            finalScore = finalScore.replace("(,", "(");
                                            //return finalScore;
                                            var finalScore = "(" + scoreInfo.toString() + ")";
                                            finalScore = finalScore.replace(",,", "");
                                            finalScore = finalScore.replace(",)", ")");
                                            finalScore = finalScore.replace("(,", "(");
                                            data = finalScore

                                            let originFontSize = 12;
                                            let maxDisplayCharInLine = 35;
                                            let fontss = Math.min(originFontSize, originFontSize / (data.length / maxDisplayCharInLine));
                                            return Spacebars.SafeString("<span class =pclassPDFStatus style='text-align:center !important'>" + finalScore + "</span>")
                                        }
                                    } else
                                        return "";
                                }
                            } catch (e) {}
                        },
                        checkWinnerName: function(teamsID, winnerID) {
                            try {
                                if (teamsID == winnerID) {
                                    return "pclassPDFWinner"
                                }
                                else
                                    return ""
                            } catch (e) {}
                        },
                        roundLength: function() {
                            var rounLen = MatchCollectionConfig.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            }).roundValues;
                            if (rounLen){
                                if(_.findWhere( rounLen, {roundName:"Bronze Medal"})){
                                   rounLen = _.without(rounLen, _.findWhere(rounLen, {
                                      roundName:"Bronze Medal"
                                    }));
                                }

                                return rounLen.length
                            }
                        },

                        matchRecordsLeft: function() {
                            var tournamentInfo = MatchCollectionDB.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            });
                            if (tournamentInfo) {

                                if (tournamentInfo.matchRecords) {

                                    if(_.findWhere( tournamentInfo.matchRecords, {roundName:"BM"})){
                                        tournamentInfo.matchRecords = _.without(tournamentInfo.matchRecords, 
                                            _.findWhere(tournamentInfo.matchRecords,
                                         {
                                            roundName:"BM"
                                        }));
                                    }

                                    return tournamentInfo.matchRecords;
                                }
                            }
                        },

                        roundNumber: function() {
                            var matchRecords = MatchCollectionDB.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            }).matchRecords;
                            var tableHeaders = []
                            if (matchRecords.length != 0) {
                                for (var i = 0; i < matchRecords.length; i++) {
                                    if (tableHeaders.indexOf(matchRecords[i].roundNumber) == -1) {
                                        tableHeaders.push(matchRecords[i].roundNumber);
                                    }
                                }
                            }
                            return tableHeaders
                        },

                        removelastemptyDiv: function() {
                            var matchNumber = this.matchNumber;

                            var matchConfig = MatchCollectionConfig.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            });
                            if (matchConfig && matchConfig.roundValues) {
                                if(_.findWhere( matchConfig.roundValues, {roundName:"Bronze Medal"})){
                                    matchConfig.roundValues = _.without( matchConfig.roundValues, _.findWhere(matchConfig.roundValues, {
                                      roundName:"Bronze Medal"
                                    }));
                                }

                                if (matchConfig && matchConfig.roundValues) {
                                    if (matchConfig.roundValues.length >= 7) {
                                        var expo = parseInt(matchConfig.roundValues.length - 2)
                                        var checktwopow = get2PowerOfN(matchNumber)
                                        if (checktwopow && checktwopow == expo) {
                                            ServerSession.set("2ndMAtchRemove", this.nextMatchNumber)
                                        }
                                    }
                                }

                                /*var checktwopow = power_of_2(matchNumber)
                            if(checktwopow){
                                var get2Power = get2PowerOfN(matchNumber)
                                if(parseInt(get2Power + 2)>=8){
                                    var roundValueToCheck = parseInt(get2Power + 2)
                                    if(roundValueToCheck >= 8){
                                        if(matchConfig.roundValues.length == roundValueToCheck ){
                                            ServerSession.set("2ndMAtchRemove", this.nextMatchNumber)
                                        }   
                                    }
                                }
                            }*/

                                /*if (matchConfig.roundValues.length == 8) {
                                    //2 power 6 plus 2
                                    if (matchNumber == 64) {
                                        ServerSession.set("2ndMAtchRemove", this.nextMatchNumber)
                                    }
                                } else if (matchConfig.roundValues.length == 7) {
                                    // 2 power 5 puls 2
                                    if (matchNumber == 32) {
                                        ServerSession.set("2ndMAtchRemove", this.nextMatchNumber)
                                    }
                                } else if (matchConfig.roundValues.length == 9) {
                                    //2 power 7 plus 2
                                    if (matchNumber == 128) {
                                        ServerSession.set("2ndMAtchRemove", this.nextMatchNumber)
                                    }
                                }
                                else if (matchConfig.roundValues.length == 10) {
                                    //2 power 8 plus 2
                                    if (matchNumber == 256) {
                                        ServerSession.set("2ndMAtchRemove", this.nextMatchNumber)
                                    }
                                }*/
                            }
                        },
                        extraPageFor6thround: function(round, match) {
                            try {
                                if (parseInt(round) == 6 && (parseInt(match - 1) % 62) == 0) {
                                    return true
                                }
                            } catch (e) {

                            }
                        },
                        checkmargin: function(round) {
                            try {
                                if (parseInt(round) == 6) {
                                    return "margin-top:150px;"
                                }
                            } catch (e) {

                            }
                        },
                        checkToEmptyRows6Down: function(match, round) {
                            try {
                                var toret = false
                                if (parseInt(round) == 6) {
                                    var s = 0
                                    while (parseInt(match) != (Math.pow(2, s) * 63)) {
                                        s = s + 1
                                        toret = false
                                        if (s >= 5) {
                                            break;
                                        }
                                    }
                                    if (parseInt(match) == (Math.pow(2, s) * 63)) {
                                        toret = true
                                    }
                                }
                                return toret
                            } catch (e) {

                            }
                        },
                        extraPage: function() {
                            var matchNumber = this.matchNumber;
                            var matchConfig = MatchCollectionConfig.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            });

                            console.log("length is " + matchConfig.roundValues.length)

                            if (matchConfig && matchConfig.roundValues) {
                                if(_.findWhere( matchConfig.roundValues, {roundName:"Bronze Medal"})){
                                    matchConfig.roundValues = _.without( matchConfig.roundValues, _.findWhere(matchConfig.roundValues, {
                                      roundName:"Bronze Medal"
                                    }));
                                }
                                if (matchConfig.roundValues.length >= 7) {
                                    console.log("length is more")
                                    var expo = parseInt(matchConfig.roundValues.length - 2)
                                    var checktwopow = get2PowerOfN(matchNumber)
                                    if (checktwopow && checktwopow == expo) {
                                        console.log("inside false")
                                        return false
                                    } else {
                                        console.log("inside true")
                                        return true
                                    }
                                }
                            }
                            /*if (matchConfig && matchConfig.roundValues) {
                            var checktwopow = power_of_2(matchNumber)
                            if(checktwopow){
                                var get2Power = get2PowerOfN(matchNumber)
                                

                                if(parseInt(get2Power + 2) >= 8){
                                    var roundValueToCheck = parseInt(get2Power + 2)
                                    if(roundValueToCheck != false && roundValueToCheck >= 8){
                                        if(matchConfig.roundValues.length == roundValueToCheck ){
                                            return false
                                        }
                                        else{
                                            return true
                                        }   
                                    }
                                    else{
                                        return true
                                    }
                                }else{
                                    return true
                                }
                            }
                            else{
                                return true
                            }
                        }*/

                            /*if (matchConfig && matchConfig.roundValues) {
                                if (matchConfig.roundValues.length == 8) {
                                    if (matchNumber == 64) {
                                        return false
                                    } else return true
                                } else if (matchConfig.roundValues.length == 7) {
                                    if (matchNumber == 32) {
                                        return false
                                    } else return true
                                } else if (matchConfig.roundValues.length == 9) {
                                    if (matchNumber == 128) {
                                        return false
                                    } else return true
                                }
                                else if (matchConfig.roundValues.length == 10) {
                                    if (matchNumber == 256) {
                                        return false
                                    } else return true
                                }
                            }*/
                        },
                        roundNumberTop1: function() {
                            try {
                                if (ServerSession.get("calledTime") == false) {
                                    ServerSession.set("calledTime", 1)
                                } else {
                                    ServerSession.set("calledTime", parseInt(ServerSession.get("calledTime") + 1))
                                }
                                var matchConfig = MatchCollectionConfig.findOne({
                                    'tournamentId': tournamentId,
                                    'eventName': eventName,
                                });


                                if (matchConfig && matchConfig.roundValues) {
                                     if(_.findWhere( matchConfig.roundValues, {roundName:"Bronze Medal"})){
                                         matchConfig.roundValues = _.without( matchConfig.roundValues, _.findWhere(matchConfig.roundValues, {
                                          roundName:"Bronze Medal"
                                        }));
                                    }

                                    if (matchConfig.roundValues.length == 8) {
                                        if (ServerSession.get("calledTime") == 1) {
                                            return "1st quarters"
                                        } else if (ServerSession.get("calledTime") == 2) {
                                            return "2nd quarters"
                                        } else if (ServerSession.get("calledTime") == 3) {
                                            return "3rd quarters"
                                        } else if (ServerSession.get("calledTime") == 4) {
                                            return "4th quarters"
                                        }else if (ServerSession.get("calledTime") == 5) {
                                            return "Finals"
                                        }
                                    } else if (matchConfig.roundValues.length == 7) {
                                        if (ServerSession.get("calledTime") == 1) {
                                            return "1st half"
                                        } else if (ServerSession.get("calledTime") == 2) {
                                            return "2nd half"
                                        } else if (ServerSession.get("calledTime") == 3) {
                                            return "Finals"
                                        }
                                    } else if (matchConfig.roundValues.length == 9) {
                                        if (ServerSession.get("calledTime") == 1) {
                                            return "1st pre-quarters"
                                        } else if (ServerSession.get("calledTime") == 2) {
                                            return "2nd pre-quarters"
                                        } else if (ServerSession.get("calledTime") == 3) {
                                            return "3rd pre-quarters"
                                        } else if (ServerSession.get("calledTime") == 4) {
                                            return "4th pre-quarters"
                                        } else if (ServerSession.get("calledTime") == 5) {
                                            return "5th pre-quarters"
                                        } else if (ServerSession.get("calledTime") == 6) {
                                            return "6th pre-quarters"
                                        } else if (ServerSession.get("calledTime") == 7) {
                                            return "7th pre-quarters"
                                        } else if (ServerSession.get("calledTime") == 8) {
                                            return "8th pre-quarters"
                                        }
                                    }
                                }
                            } catch (e) {}
                        },
                        matchRecordsRounds1stRow: function() {
                            try {
                                var s = [1, 6]
                                return s
                            } catch (E) {}
                        },

                        matchRecordsRounds3rdRow: function() {
                            try {
                                var s = [3, 8]
                                return s
                            } catch (e) {}
                        },
                        matchRecordsRounds4thRow: function() {
                            try {
                                var s = [4, 9]
                                return s
                            } catch (e) {}
                        },
                        matchRecordsRounds5thRow: function() {
                            try {
                                var s = [5, 10]
                                return s
                            } catch (e) {}
                        },
                        matchRecordsRounds2ndRow: function() {
                            try {
                                var s = [2, 7]
                                return s
                            } catch (E) {}
                        },
                        checkHeaderFIRST: function() {
                            try {
                                var matchNumber = this.matchNumber;
                                var nextMatchNumber = this.nextMatchNumber;
                                var roundNumber = this.roundNumber;
                                if (roundNumber == 1 || roundNumber == 6) {
                                    if (matchNumber == 1) {
                                        ServerSession.set("checkHeaderFirstSec", nextMatchNumber);
                                        if (roundNumber == 1) {
                                            return "I RD"
                                        } else if (roundNumber == 6) {
                                            return "VI RD"
                                        }
                                    }
                                }
                            } catch (e) {}
                        },
                        checkHeaderFirstSec: function() {
                            try {
                                var matchNumber = this.matchNumber;
                                var nextMatchNumber = this.nextMatchNumber;
                                var roundNumber = this.roundNumber;
                                var sessionNextNumber = ServerSession.get("checkHeaderFirstSec")
                                if (roundNumber == 2 || roundNumber == 7) {
                                    if (matchNumber == sessionNextNumber) {
                                        ServerSession.set("checkHeaderSecThird", nextMatchNumber)
                                        return true
                                    }
                                }
                            } catch (e) {}
                        },
                        checkHeaderSecThird: function() {
                            try {
                                var matchNumber = this.matchNumber;
                                var nextMatchNumber = this.nextMatchNumber;
                                var roundNumber = this.roundNumber;
                                var sessionNextNumber = ServerSession.get("checkHeaderSecThird")
                                if (roundNumber == 3 || roundNumber == 8) {
                                    if (matchNumber == sessionNextNumber) {
                                        ServerSession.set("checkHeaderThirFou", nextMatchNumber)
                                        return true
                                    }
                                }
                            } catch (e) {}
                        },
                        checkHeaderThirFou: function() {
                            try {
                                var matchNumber = this.matchNumber;
                                var nextMatchNumber = this.nextMatchNumber;
                                var roundNumber = this.roundNumber;
                                var sessionNextNumber = ServerSession.get("checkHeaderThirFou")
                                if (roundNumber == 4 || roundNumber == 9) {
                                    if (matchNumber == sessionNextNumber) {
                                        ServerSession.set("checkHeaderFourFiv", nextMatchNumber)
                                        return true
                                    }
                                }
                            } catch (e) {}
                        },
                        checkHeaderFourFiv: function() {
                            try {
                                var matchNumber = this.matchNumber;
                                var nextMatchNumber = this.nextMatchNumber;
                                var roundNumber = this.roundNumber;
                                var sessionNextNumber = ServerSession.get("checkHeaderFourFiv")
                                if (roundNumber == 5 || roundNumber == 10) {
                                    if (matchNumber == sessionNextNumber) {
                                        return true
                                    }
                                }
                            } catch (e) {}
                        },

                        checkMatchStatus :function(){
                            if(this.playersID && this.playersID.playerAId.length > 0 || this.playersID.playerBId.length > 0)
                                return true;
                        },
                        checkStatusByePlayerA: function() {
                            try {
                                if (this.status2 == "bye") {
                                    
                                        if (this.winnerID == this.playersID.playerAId) {
                                        return false
                                    } 

                                    else return true;
                                } else return true
                            } catch (e) {}
                        },
                        checkStatusByePlayerB: function() {
                            try {
                                if (this.status2 == "bye") {        

                                        if (this.winnerID == this.playersID.playerBId) {
                                        return false
                                    } else return true;
                                } else return true
                            } catch (e) {}
                        },
                        checkWhoByeA: function() {
                            try {
                                if (this.status2 == "bye") {

                                    if (this.propogatePlaceHolder == "playerAId") {
                                        return false
                                    } else {
                                        return true
                                    }
                                } else return true
                            } catch (e) {}
                        },
                        checkWhoByeB: function() {
                            try {
                                if (this.status2 == "bye") {
                                    if (this.propogatePlaceHolder == "playerBId") {
                                        return false
                                    } else return true
                                } else return true
                            } catch (e) {}
                        },
                        extraPageFor10thround: function(match, round) {
                            try {
                                var toret = false
                                if (parseInt(round) == 10) {
                                    if (match == 1023) {
                                        return true
                                    }
                                }
                                return toret
                            } catch (e) {}
                        },
                        extraPageFor9thround: function(match, round) {
                            try {

                                var toret = false
                                if (parseInt(round) == 9) {
                                    var s = 1

                                    if (match == 511) {
                                        return true
                                    }

                                    while (parseInt(match) != parseInt((s * 511) - 1)) {
                                        s = s + 1
                                        toret = false
                                        if (s >= 3) {
                                            break;
                                        }
                                    }

                                    if (parseInt(match) == parseInt((s * 511) - 1)) {
                                        toret = true
                                    }
                                }
                                return toret
                            } catch (e) {}
                        },
                        extraPageFor8thround: function(match, round) {
                            try {


                                var toret = false
                                if (parseInt(round) == 8) {
                                    var s = 1

                                    if (match == 509||match==255) {
                                        return true
                                    }

                                    while (parseInt(match) != parseInt((s * 509) - 1)) {

                                        s = s + 1
                                        toret = false
                                        if (s >= 3) {
                                            break;
                                        }
                                    }

                                    if (parseInt(match) == parseInt((s * 509) - 1)) {

                                        toret = true
                                    }
                                }
                                return toret
                            } catch (e) {}
                        },
                        extraPageFor7thround: function(match, round) {
                            try {
                                try {
                                    var toret = false

                                    if (parseInt(round) == 7) {
                                        var s = 2
                                        while (parseInt(match) != parseInt((s * 63) + 1)) {
                                            s = s * 2
                                            toret = false
                                            if (s >= 32) {
                                                break;
                                            }
                                        }
                                        if (parseInt(match) == parseInt((s * 63) + 1)) {
                                            toret = true
                                        }
                                    }
                                    return toret
                                } catch (e) {

                                }
                            } catch (e) {

                            }
                        }
                    });
                    Template.registerHelper("checkToBreak", function(data) {
                        try {
                            if (data % 32 == 1) {
                                return true
                            }
                        } catch (e) {}
                    });
                    Template.registerHelper("checkToEmptyRowsDown", function(data1, data2, round) {
                        try {
                            if (parseInt(data1 % 16) == 0 && parseInt(round) != 6) {
                                if (_.findWhere(arrayOfNextMatch1, data2) == null) {
                                    arrayOfNextMatch1.push(data2);
                                }
                                ServerSession.set("arrayOfNextMatch1", arrayOfNextMatch1)
                                return true
                            } else if (parseInt(round) != 6) {
                                var matchConfig = MatchCollectionConfig.findOne({
                                    'tournamentId': tournamentId,
                                    'eventName': eventName,
                                });

                                if (matchConfig && matchConfig.roundValues) {
                                    if(_.findWhere( matchConfig.roundValues, {roundName:"Bronze Medal"})){
                                        matchConfig.roundValues = _.without( matchConfig.roundValues, _.findWhere(matchConfig.roundValues, {
                                            roundName:"Bronze Medal"
                                        }));
                                    }
                                    if (matchConfig.roundValues.length < 7) {
                                        if (matchConfig.roundValues.length == 5) {
                                            if (data1 == 8) {
                                                return true
                                            }
                                        } else if (matchConfig.roundValues.length == 4) {
                                            if (data1 == 4) {
                                                return true
                                            }
                                        } else if (matchConfig.roundValues.length == 3) {
                                            if (data1 == 2) {
                                                return true
                                            }
                                        } else if (matchConfig.roundValues.length == 2) {
                                            if (data1 == 1) {
                                                return true
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (e) {}
                    });
                    Template.registerHelper("checkLeftMatch", function(data) {
                        try {
                            console.log(data)
                            var num = parseInt(data)
                            return true
                                /*if (num % 2 == 1) {
                                    return true
                                }*/
                        } catch (e) {}
                    });

                    Template.registerHelper("checkRightMatch", function(data) {
                        try {
                            var num = parseInt(data)
                            return true
                                /*if (num % 2 == 0) {
                                    return true
                                }*/
                        } catch (e) {}
                    });

                    Template.registerHelper("checkNmOnly", function(data1, data2) {
                        try {

                            var num1 = parseInt(data1);
                            var num2 = parseInt(data2);
                            if (num1 == num2) {
                                return true
                            } else return false
                        } catch (e) {}
                    });

                    Template.registerHelper("checkToEmptyRowsDownPlusone", function(data1, data2) {
                        try {
                            var arrToBr = ServerSession.get("arrayOfNextMatch1");
                            for (var i = 0; i < arrToBr.length; i++) {
                                if (arrToBr[i] == data1) {
                                    if (_.findWhere(arrayOfNextMatch2, data2) == null) {
                                        arrayOfNextMatch2.push(data2);
                                    }
                                    ServerSession.set("arrayOfNextMatch2", arrayOfNextMatch2)
                                    return true
                                }
                            }
                        } catch (e) {}
                    });

                    Template.registerHelper("checkToEmptyRowsDownPlustwo", function(data1, data2) {
                        try {
                            var arrToBr = ServerSession.get("arrayOfNextMatch2");
                            for (var i = 0; i < arrToBr.length; i++) {
                                if (arrToBr[i] == data1) {
                                    if (_.findWhere(arrayOfNextMatch3, data2) == null) {
                                        arrayOfNextMatch3.push(data2);
                                    }
                                    ServerSession.set("arrayOfNextMatch3", arrayOfNextMatch3)
                                    return true
                                }
                            }
                        } catch (e) {}
                    });

                    Template.registerHelper("checkToEmptyRowsDownPlusthree", function(data1, data2) {
                        try {
                            var arrToBr = ServerSession.get("arrayOfNextMatch3");
                            for (var i = 0; i < arrToBr.length; i++) {
                                if (arrToBr[i] == data1) {
                                    if (_.findWhere(arrayOfNextMatch4, data2) == null) {
                                        arrayOfNextMatch4.push(data2);
                                    }
                                    ServerSession.set("arrayOfNextMatch4", arrayOfNextMatch4)
                                    return true
                                }
                            }
                        } catch (e) {}
                    });

                    Template.registerHelper("checkToEmptyRowsDownPlusFour", function(data1, data2) {
                        try {
                            var arrToBr = ServerSession.get("arrayOfNextMatch4");
                            for (var i = 0; i < arrToBr.length; i++) {
                                if (arrToBr[i] == data1) {
                                    return true
                                }
                            }
                        } catch (e) {}
                    });

                    Template.registerHelper("toLower", function(data) {
                        try {
                            return data.toLowerCase().substr(0, 4)
                        } catch (e) {}
                    });
                    Template.registerHelper("playerANo",function(){   
                        try{
                            
                            if(this.playersNo && this.playersNo.playerANo)
                                return this.playersNo.playerANo;
                            else
                                return false;
                        }catch(e){

                        }
                    });

                    Template.registerHelper("playerBNo",function(){   
                        try{
                         
                            if(this.playersNo && this.playersNo.playerBNo)
                                return this.playersNo.playerBNo;
                            else
                                return false;
                        }catch(e){

                        }
                    });

                    Template.registerHelper("toUserName", function(data) {
                        try {
                            if (data) {

                                var user = Meteor.users.findOne({
                                    "_id": data
                                });
                                if (user && user.userName) {
                                    if(user.userName.length > 20)
                                        return titleCase(user.userName.substr(0, 20))+"...";
                                    else 
                                        return titleCase(user.userName)

                                } else return " ";
                            } else return " ";
                        } catch (e) {}
                    });
                    Template.registerHelper("toclubName", function(data) {
                        try {
                            if (data) {
                                var user = global[userDetailsTT].findOne({
                                    "userId": data
                                });
                                if (user && user.clubNameId) {
                                    var academyInfo = academyDetails.findOne({
                                        "userId": user.clubNameId
                                    })
                                    if (academyInfo && academyInfo.clubName) {
                                        return "(" + academyInfo.clubName.substr(0, 3) + ")";
                                    } else
                                        return " ";
                                }
                                if (user && user.schoolId) {
                                    var academyInfo = schoolDetails.findOne({
                                        "userId": user.schoolId
                                    })
                                    if (academyInfo && academyInfo.schoolName) {
                                        return "(" + academyInfo.schoolName.substr(0, 3) + ")";
                                    } else
                                        return " ";
                                } else return " ";
                            } else return " ";
                        } catch (e) {}
                    });

                    Template.registerHelper("removelastemptyDivHelper", function(data1, data2) {
                        try {
                            var s = ServerSession.get("2ndMAtchRemove");
                            if (s == data1) {
                                ServerSession.set("3rdMAtchRemove", data2)
                                return false
                            } else return true
                        } catch (e) {

                        }
                    });

                    Template.registerHelper("removelastemptyDivHelper2", function(data1, data2) {
                        try {
                            var s = ServerSession.get("3rdMAtchRemove");
                            if (s == data1) {
                                ServerSession.set("4thMAtchRemove", data2)
                                return false
                            } else return true
                        } catch (e) {

                        }
                    });
                    Template.registerHelper("removelastemptyDivHelper3", function(data1, data2) {
                        try {
                            var s = ServerSession.get("4thMAtchRemove");
                            if (s == data1) {
                                ServerSession.set("5thMAtchRemove", data2)
                                return false
                            } else return true
                        } catch (e) {

                        }
                    });
                    Template.registerHelper("removelastemptyDivHelper4", function(data1, data2) {
                        try {
                            var s = ServerSession.get("5thMAtchRemove");
                            if (s == data1) {
                                return false
                            } else return true
                        } catch (e) {

                        }
                    });
                    SSR.compileTemplate('matchRecords_report', Assets.getText('layoutTest_Player.html'));
                    var html_string = SSR.render('layoutTest_Player', {
                        css: css,
                        template: "matchRecords_report",
                        data: " "
                    });
                    var phantom = require('phantom');

                    // Setup Webshot options
                    var options = {
                        "paperSize": {
                            "format": "Letter",
                            "orientation": "portrait",
                            "margin": "1cm"
                        },

                        siteType: 'html',
                        customCSS: 'body {background-color: #b0c4de;}',
                    };

                    webshot(html_string, fileName, options, function(err) {
                        fs.readFile(fileName, function(err, data) {
                            if (err) {
                                return;
                            }
                            //fs.unlinkSync(fileName);
                            fs.unlink(fileName,function(err){
                                if(err){
                                }
                                else{
                                   fut.return(data); 
                                }    
                            });
                        });
                    });

                    let pdfData = fut.wait();
                    let base64String = new Buffer(pdfData).toString('base64');

                    return base64String;
                } catch (e) {errorLog(e)}
            }
        }catch(e){
            errorLog(e)
        }
    },

});

Meteor.methods({
    printDrawsSheetForTeamEvents: async function(tournamentId, eventName, withScores) {
        try{
            if (Meteor.isServer) {
                if (withScores == undefined || withScores == null) {
                    withScores = true
                }
                if (typeof withScores == "string") {
                    if (withScores == "true") {
                        withScores = true
                    } else if (withScores == "false") {
                        withScores = false
                    }
                } else if (typeof withScores == "boolean") {
                    withScores = withScores
                }
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('drawsStyle.css');
                var arrayOfNextMatch1 = [];
                var arrayOfNextMatch2 = [];
                var arrayOfNextMatch3 = [];
                var arrayOfNextMatch4 = [];
                SSR.compileTemplate('layoutTest_team', Assets.getText('layoutTest_team.html'));
                ServerSession.set("calledTime_team", false)
                ServerSession.set("arrayOfNextMatch1_team", false)
                ServerSession.set("arrayOfNextMatch2_team", false)
                ServerSession.set("arrayOfNextMatch3_team", false)
                ServerSession.set("arrayOfNextMatch4_team", false)
                ServerSession.set("2ndMAtchRemove_team", false)
                ServerSession.set("3rdMAtchRemove_team", false)
                ServerSession.set("4thMAtchRemove_team", false)
                ServerSession.set("5thMAtchRemove", false)

                var dbsrequired = ["userDetailsTT", "playerTeams"]

                var userDetailsTT = "userDetailsTT"
                var playerTeams = "playerTeams"
                if (tournamentId && eventName) {
                    var tournamentFind = events.findOne({
                        "_id": tournamentId
                    })
                    if (tournamentFind == undefined || tournamentFind == null) {
                        tournamentFind = pastEvents.findOne({
                            "_id": tournamentId
                        })
                    }
                    var res = await Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
                    try {
                        if (res) {
                            if (res.changeDb && res.changeDb == true) {
                                if (res.changedDbNames.length != 0) {
                                    userDetailsTT = res.changedDbNames[0]
                                    playerTeams = res.changedDbNames[1]
                                }
                            }
                        }
                    } catch (e) {}
                }

                Template.layoutTest_team.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;
                            return imageURL;
                        } catch (E) {}
                    },
                    "logoImg":function(){
                            var tourExists;
                            tourExists = events.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                            if(tourExists == undefined)
                            {
                                tourExists = pastEvents.findOne({
                                        "tournamentEvent": true,
                                        '_id': tournamentId
                                    });                           
                            }

                            if(tourExists && tourExists.eventOrganizer)
                            {
                                eventOrganizer = tourExists.eventOrganizer;
                                var organizerInfo = Meteor.users.findOne({"userId":eventOrganizer});
                                if(organizerInfo) 
                                {
                                    var apiInfo = apiUsers.findOne({"userId":eventOrganizer});
                                    if(apiInfo && apiInfo.siteImg)
                                    {
                                        return apiInfo.siteImg;
                                    }
                               
                                }           
                            }
                            return "logo.png";

                        },
                    get5sImage: function() {
                        try {
                            var e = events.findOne({
                                "eventName": eventName,
                                "tournamentEvent": false,
                                'tournamentId': tournamentId
                            })
                            if (e == undefined) {
                                e = pastEvents.findOne({
                                    "eventName": eventName,
                                    tournamentId: tournamentId
                                })
                            }
                            if (e && e.sponsorLogo) {
                                sponsorLogo = e.sponsorLogo
                                var sponsorLogoURL = eventUploads.findOne({
                                    "_id": sponsorLogo
                                });
                                if (sponsorLogoURL) {
                                    return sponsorLogoURL
                                } else return false
                            } else return false
                        } catch (e) {

                        }
                    },
                    getDocType_team: function() {
                        return "<!DOCTYPE html>";
                    },
                    getLength_team: function() {
                        return "3"
                    },
                    tournamentName_team: function() {
                        try {
                            var tourInfo;
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                            if (tourInfo)
                                return tourInfo.eventName;
                            else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.eventName;
                            }
                        } catch (e) {}
                    },

                    eventName_team: function() {
                        try {
                            var s = eventName;
                            var schoolChangeAbbName = schoolEventsToFind.findOne({})
                            if(schoolChangeAbbName && schoolChangeAbbName.teamEventNAME 
                                && schoolChangeAbbName.dispNamesTeam){
                                var namesInd = _.indexOf(
                                    schoolChangeAbbName.teamEventNAME,eventName
                                    )
                                if(namesInd>=0){
                                    s = schoolChangeAbbName.dispNamesTeam[namesInd]
                                }
                                else{
                                    s = eventName
                                }
                            }
                            else{
                                s = eventName
                            }
                            return s;
                        } catch (e) {}
                    },

                    venueAddress_team: function() {
                        try {
                            var tourInfo;
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                            if (tourInfo)
                                return tourInfo.venueAddress;
                            else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.venueAddress;
                            }
                        } catch (e) {}
                    },

                    domainName_team: function() {
                        try {
                            var tourInfo;
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                            if (tourInfo)
                                return tourInfo.domainName;
                            else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.domainName;
                            }
                        } catch (e) {}
                    },

                    eventDate_team: function() {
                        try {
                            var tourInfo;
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                            if (tourInfo) {
                                if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                    return reverseDate(tourInfo.eventStartDate) + " - " + reverseDate(tourInfo.eventEndDate);
                            } else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo) {
                                    if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                        return reverseDate(tourInfo.eventStartDate) + " - " + reverseDate(tourInfo.eventEndDate);
                                }
                            }
                        } catch (e) {}
                    },
                    checkWinnerName: function(teamsID, winnerID) {
                        try {
                            if (teamsID == winnerID) {
                                return "pclassPDFWinner"
                            }
                        } catch (e) {}
                    },
                    validateStatus: function(status) {
                        try {
                            if (withScores == true) {
                                if (status != null || status != undefined || status.trim().length != 0) {
                                    if (status.toLowerCase() == "bye") {
                                        return "bye"
                                    } else if (status.toLowerCase() == "walkover") {
                                        return "walkover"
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    validateStatus2: function(status, status2) {
                        try {
                            if (withScores == true) {
                                if (status != null || status != undefined || status.trim().length != 0) {
                                    if (status.toLowerCase() == "bye" && status2.toLowerCase() != "bye") {
                                        return "bye"
                                    } else if (status.toLowerCase() == "walkover") {
                                        return "walkover"
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    validateScore: function(completedScore, status) {
                         try {
                                if (withScores == true) 
                                {
                                    if (status != null && status != undefined && status.trim().length != 0 && status.toLowerCase() == "completed") 
                                    {

                                        var scoreInfo = "";
                                        for (var k = 0; k < completedScore.setScoresA.length; k++) {
                                            if (parseInt(completedScore.setScoresA[k]) == 0 && parseInt(completedScore.setScoresB[k]) == 0) {

                                            } else {
                                                if (k != 0)
                                                    scoreInfo += ",";
                                                scoreInfo += completedScore.setScoresA[k] + " - " + completedScore.setScoresB[k] + " "
                                            }

                                        }
                                        if (scoreInfo.toString() != "") {
                                            var finalScore = "(" + scoreInfo.toString() + ")";
                                            finalScore = finalScore.replace(",,", "");
                                            finalScore = finalScore.replace(",)", ")");
                                            finalScore = finalScore.replace("(,", "(");
                                            //return finalScore;
                                            var finalScore = "(" + scoreInfo.toString() + ")";
                                            finalScore = finalScore.replace(",,", "");
                                            finalScore = finalScore.replace(",)", ")");
                                            finalScore = finalScore.replace("(,", "(");
                                            data = finalScore

                                            let originFontSize = 12;
                                            let maxDisplayCharInLine = 35;
                                            let fontss = Math.min(originFontSize, originFontSize / (data.length / maxDisplayCharInLine));
                                            return Spacebars.SafeString("<span class =pclassPDFStatus style='text-align:center !important'>" + finalScore + "</span>")
                                        }
                                    } else
                                        return "";
                                }
                            } catch (e) {}
                        /*try {
                            if (withScores == true) {
                                if (status != null && status != undefined && status.trim().length != 0 && status.toLowerCase() == "completed") {

                                    var scoreInfo = "";
                                    for (var k = 0; k < completedScore.setScoresA.length; k++) {
                                        if (parseInt(completedScore.setScoresA[k]) == 0 && parseInt(completedScore.setScoresB[k]) == 0) {

                                        } else {
                                            if (k != 0)
                                                scoreInfo += ",";
                                            scoreInfo += completedScore.setScoresA[k] + " - " + completedScore.setScoresB[k] + " "
                                        }

                                    }

                                    if (scoreInfo.toString() != "") {
                                        var finalScore = "(" + scoreInfo.toString() + ")";
                                        finalScore = finalScore.replace(",,", "");
                                        finalScore = finalScore.replace(",)", ")");
                                        finalScore = finalScore.replace("(,", "(");
                                        return finalScore;
                                    }
                                } else
                                    return "";
                            }
                        } catch (e) {}*/
                    },

                    roundLength_team: function() {
                        var rounLen = MatchTeamCollectionConfig.findOne({
                            'tournamentId': tournamentId,
                            'eventName': eventName,
                        }).roundValues;
                        if (rounLen){
                            if(_.findWhere(rounLen, {roundName:"Bronze Medal"})){
                                rounLen = _.without(rounLen, _.findWhere(rounLen, {
                                    roundName:"Bronze Medal"
                                }));
                            }
                            return parseInt(rounLen.length) + parseInt(1);
                        }
                    },

                    matchRecordsLeft_team: function() {

                        var matchRecords = teamMatchCollectionDB.findOne({
                            'tournamentId': tournamentId,
                            'eventName': eventName,
                        }).matchRecords;

                        if (matchRecords) {

                            if(_.findWhere(matchRecords, {roundName:"BM"})){
                                matchRecords = _.without(matchRecords, 
                                _.findWhere(matchRecords,
                                {
                                    roundName:"BM"
                                }));
                            }

                            return matchRecords;
                        }
                    },

                    roundNumber_team: function() {
                        var matchRecords = teamMatchCollectionDB.findOne({
                            'tournamentId': tournamentId,
                            'eventName': eventName,
                        }).matchRecords;
                        var tableHeaders = []
                        if (matchRecords.length != 0) {
                            for (var i = 0; i < matchRecords.length; i++) {
                                if (tableHeaders.indexOf(matchRecords[i].roundNumber) == -1) {
                                    tableHeaders.push(matchRecords[i].roundNumber);
                                }
                            }
                        }
                        return tableHeaders
                    },

                    removelastemptyDiv_team: function() {
                        var matchNumber = this.matchNumber;

                            var matchConfig = MatchTeamCollectionConfig.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            });
                            if (matchConfig && matchConfig.roundValues) {

                                if(_.findWhere(matchConfig.roundValues, {roundName:"Bronze Medal"})){
                                    matchConfig.roundValues = _.without(matchConfig.roundValues, _.findWhere(matchConfig.roundValues, {
                                        roundName:"Bronze Medal"
                                    }));
                                }

                                if (matchConfig && matchConfig.roundValues) {
                                    if (parseInt(matchConfig.roundValues.length + 1) >= 7) {
                                        var expo = parseInt(parseInt(matchConfig.roundValues.length + 1) - 2)
                                        var checktwopow = get2PowerOfN(matchNumber)
                                        if (checktwopow && checktwopow == expo) {
                                            ServerSession.set("2ndMAtchRemove_team", this.nextMatchNumber)
                                        }
                                    }
                                }
                            }
                        /*var matchNumber = this.matchNumber;
                        var matchConfig = MatchTeamCollectionConfig.findOne({
                            'tournamentId': tournamentId,
                            'eventName': eventName,
                        });
                        if (matchConfig && matchConfig.roundValues) {
                            var roundValuesLength = parseInt(matchConfig.roundValues.length) + parseInt(1)
                            if (parseInt(roundValuesLength) == 8) {
                                if (matchNumber == 64) {
                                    ServerSession.set("2ndMAtchRemove_team", this.nextMatchNumber)
                                }
                            } else if (parseInt(roundValuesLength) == 7) {
                                if (matchNumber == 32) {
                                    ServerSession.set("2ndMAtchRemove_team", this.nextMatchNumber)
                                }
                            } else if (parseInt(roundValuesLength) == 9) {
                                if (matchNumber == 128) {
                                    ServerSession.set("2ndMAtchRemove_team", this.nextMatchNumber)
                                }
                            }
                        }*/
                    },

                    extraPage_team: function() {
                        var matchNumber = this.matchNumber;
                            var matchConfig = MatchTeamCollectionConfig.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            });

                            if (matchConfig && matchConfig.roundValues) {
                                if(_.findWhere(matchConfig.roundValues, {roundName:"Bronze Medal"})){
                                    matchConfig.roundValues = _.without(matchConfig.roundValues, _.findWhere(rounLen, {
                                        roundName:"Bronze Medal"
                                    }));
                                }

                                if (parseInt(matchConfig.roundValues.length + 1) >= 7) {
                                    var expo = parseInt(parseInt(matchConfig.roundValues.length + 1) - 2)
                                    var checktwopow = get2PowerOfN(matchNumber)
                                    if (checktwopow && checktwopow == expo) {
                                        return false
                                    } else {
                                        return true
                                    }
                                }
                            }
                       /* var matchNumber = this.matchNumber;
                        var matchConfig = MatchTeamCollectionConfig.findOne({
                            'tournamentId': tournamentId,
                            'eventName': eventName,
                        });

                        if (matchConfig && matchConfig.roundValues) {
                            var roundValuesLength = parseInt(matchConfig.roundValues.length) + parseInt(1)
                            if (parseInt(roundValuesLength) == 8) {
                                if (matchNumber == 64) {
                                    return false
                                } else return true
                            } else if (parseInt(roundValuesLength) == 7) {
                                if (matchNumber == 32) {
                                    return false
                                } else return true
                            } else if (parseInt(roundValuesLength) == 9) {
                                if (matchNumber == 128) {
                                    return false
                                } else return true
                            }
                        }*/
                    },
                    roundNumberTop1_team: function() {
                        try {
                            if (ServerSession.get("calledTime_team") == false) {
                                ServerSession.set("calledTime_team", 1)
                            } else {
                                ServerSession.set("calledTime_team", parseInt(ServerSession.get("calledTime_team") + 1))
                            }
                            var matchConfig = MatchTeamCollectionConfig.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            });
                            if (matchConfig && matchConfig.roundValues) {
                                if(_.findWhere(matchConfig.roundValues, {roundName:"Bronze Medal"})){
                                    matchConfig.roundValues = _.without(matchConfig.roundValues, _.findWhere(rounLen, {
                                        roundName:"Bronze Medal"
                                    }));
                                }

                                var roundValuesLength = parseInt(matchConfig.roundValues.length) + parseInt(1)
                                if (parseInt(roundValuesLength) == 8) {
                                    if (ServerSession.get("calledTime_team") == 1) {
                                        return "1st quarters"
                                    } else if (ServerSession.get("calledTime_team") == 2) {
                                        return "2nd quarters"
                                    } else if (ServerSession.get("calledTime_team") == 3) {
                                        return "3rd quarters"
                                    } else if (ServerSession.get("calledTime_team") == 4) {
                                        return "4th quarters"
                                    }else if (ServerSession.get("calledTime_team") == 5) {
                                        return "Finals"
                                    }
                                } else if (parseInt(roundValuesLength) == 7) {
                                    if (ServerSession.get("calledTime_team") == 1) {
                                        return "1st half"
                                    } else if (ServerSession.get("calledTime_team") == 2) {
                                        return "2nd half"
                                    }
                                    else if (ServerSession.get("calledTime_team") == 3) {
                                        return "Finals"
                                    }
                                } else if (parseInt(roundValuesLength) == 9) {
                                    if (ServerSession.get("calledTime_team") == 1) {
                                        return "1st pre-quarters"
                                    } else if (ServerSession.get("calledTime_team") == 2) {
                                        return "2nd pre-quarters"
                                    } else if (ServerSession.get("calledTime_team") == 3) {
                                        return "3rd pre-quarters"
                                    } else if (ServerSession.get("calledTime_team") == 4) {
                                        return "4th pre-quarters"
                                    } else if (ServerSession.get("calledTime_team") == 5) {
                                        return "5th pre-quarters"
                                    } else if (ServerSession.get("calledTime_team") == 6) {
                                        return "6th pre-quarters"
                                    } else if (ServerSession.get("calledTime_team") == 7) {
                                        return "7th pre-quarters"
                                    } else if (ServerSession.get("calledTime_team") == 8) {
                                        return "8th pre-quarters"
                                    }
                                }
                            }
                        } catch (e) {}
                    },
                    checkHeaderFIRST_team: function() {
                        try {
                            var matchNumber = this.matchNumber;
                            var nextMatchNumber = this.nextMatchNumber;
                            var roundNumber = this.roundNumber;
                            if ((roundNumber == 1 || roundNumber == 6) && 
                                this.roundName != "BM") {
                                    if (matchNumber == 1) {
                                        ServerSession.set("checkHeaderFirstSec_team", nextMatchNumber);
                                        if (roundNumber == 1) {
                                            return "I RD"
                                        } else if (roundNumber == 6) {
                                            return "VI RD"
                                        }
                                    }
                                }
                        } catch (e) {}
                    },
                    checkHeaderFirstSec_team: function() {
                        try {
                            var matchNumber = this.matchNumber;
                            var nextMatchNumber = this.nextMatchNumber;
                            var roundNumber = this.roundNumber;
                            
                            var sessionNextNumber = ServerSession.get("checkHeaderFirstSec_team")
                            if ((roundNumber == 2||roundNumber == 7) && 
                                this.roundName != "BM"){
                                if (matchNumber == sessionNextNumber) {
                                    ServerSession.set("checkHeaderSecThird_team", nextMatchNumber)
                                    return true
                                }
                            }
                        } catch (e) {}
                    },
                    checkHeaderSecThird_team: function() {
                        try {
                            var matchNumber = this.matchNumber;
                            var nextMatchNumber = this.nextMatchNumber;
                            var roundNumber = this.roundNumber;
                            var sessionNextNumber = ServerSession.get("checkHeaderSecThird_team")
                            if ((roundNumber == 3||roundNumber == 8)  && 
                                this.roundName != "BM") {
                                if (matchNumber == sessionNextNumber) {
                                    ServerSession.set("checkHeaderThirFou_team", nextMatchNumber)
                                    return true
                                }
                            }
                        } catch (e) {}
                    },
                    checkHeaderThirFou_team: function() {
                        try {
                            var matchNumber = this.matchNumber;
                            var nextMatchNumber = this.nextMatchNumber;
                            var roundNumber = this.roundNumber;
                            var sessionNextNumber = ServerSession.get("checkHeaderThirFou_team")
                            if ((roundNumber == 4||roundNumber == 9)  && 
                                this.roundName != "BM"){
                                if (matchNumber == sessionNextNumber) {
                                    ServerSession.set("checkHeaderFourFiv_team", nextMatchNumber)
                                    return true
                                }
                            }
                        } catch (e) {}
                    },
                    checkHeaderFourFiv_team: function() {
                        try {
                            var matchNumber = this.matchNumber;
                            var nextMatchNumber = this.nextMatchNumber;
                            var roundNumber = this.roundNumber;
                            var sessionNextNumber = ServerSession.get("checkHeaderFourFiv_team")
                            if ((roundNumber == 5||roundNumber==10)  && 
                                this.roundName != "BM"){
                                if (matchNumber == sessionNextNumber) {
                                    return true
                                }
                            }
                        } catch (e) {}
                    },
                      checkMatchStatus :function(){
                            if(this.teamsID && this.teamsID.teamAId.length > 0 || this.teamsID.teamBId.length > 0)
                                return true;
                        },
                    checkStatusByePlayerA_team: function() {
                        try {
                            if (this.status2 == "bye") {

                                if (this.winnerID == this.teamsID.teamAId) {
                                    return false
                                } else return true;
                            } else return true
                        } catch (e) {}
                    },
                    checkStatusByePlayerB_team: function() {
                        try {
                            if (this.status2 == "bye") {
                                if (this.winnerID == this.teamsID.teamBId) {
                                    return false
                                } else return true;
                            } else return true
                        } catch (e) {}
                    },
                    checkWhoByeA_team: function() {
                        try {

                            if (this.status2 == "bye") {
                                if (this.propogatePlaceHolder == "teamAId") {
                                    return false
                                } else return true
                            } else return true
                        } catch (e) {}
                    },
                    checkWhoByeB_team: function() {
                        try {
                            if (this.status2 == "bye") {
                                if (this.propogatePlaceHolder == "teamBId") {
                                    return false
                                } else return true
                            } else return true
                        } catch (e) {}
                    },
                    matchRecordsRounds1stRow: function() {
                            try {
                                var s = [1, 6]
                                return s
                            } catch (E) {}
                        },

                        matchRecordsRounds3rdRow: function() {
                            try {
                                var s = [3, 8]
                                return s
                            } catch (e) {}
                        },
                        matchRecordsRounds4thRow: function() {
                            try {
                                var s = [4, 9]
                                return s
                            } catch (e) {}
                        },
                        matchRecordsRounds5thRow: function() {
                            try {
                                var s = [5, 10]
                                return s
                            } catch (e) {}
                        },
                        matchRecordsRounds2ndRow: function() {
                            try {
                                var s = [2, 7]
                                return s
                            } catch (E) {}
                        },
                        extraPageFor6thround: function(round, match) {
                            try {
                                if (parseInt(round) == 6 && (parseInt(match - 1) % 62) == 0) {
                                    return true
                                }
                            } catch (e) {

                            }
                        },
                        checkToEmptyRows6Down: function(match, round) {
                            try {
                                var toret = false
                                if (parseInt(round) == 6) {
                                    var s = 0
                                    while (parseInt(match) != (Math.pow(2, s) * 63)) {
                                        s = s + 1
                                        toret = false
                                        if (s >= 5) {
                                            break;
                                        }
                                    }
                                    if (parseInt(match) == (Math.pow(2, s) * 63)) {
                                        toret = true
                                    }
                                }
                                return toret
                            } catch (e) {

                            }
                        },
                        checkfor32: function() {
                            try {
                                var rounLen = MatchTeamCollectionConfig.findOne({
                                    'tournamentId': tournamentId,
                                    'eventName': eventName,
                                }).roundValues;
                                if(_.findWhere(rounLen, {roundName:"Bronze Medal"})){
                                    rounLen = _.without(rounLen, _.findWhere(rounLen, {
                                        roundName:"Bronze Medal"
                                    }));
                                }
                                if (parseInt(rounLen.length + 1) == 6)
                                    return false
                                else
                                    return true
                            } catch (e) {

                            }
                        },
                        extraPageFor10thround: function(match, round) {
                            try {
                                var toret = false
                                if (parseInt(round) == 10) {
                                    if (match == 1023) {
                                        return true
                                    }
                                }
                                return toret
                            } catch (e) {}
                        },
                        extraPageFor9thround: function(match, round) {
                            try {

                                var toret = false
                                if (parseInt(round) == 9) {
                                    var s = 1

                                    if (match == 511) {
                                        return true
                                    }

                                    while (parseInt(match) != parseInt((s * 511) - 1)) {
                                        s = s + 1
                                        toret = false
                                        if (s >= 3) {
                                            break;
                                        }
                                    }

                                    if (parseInt(match) == parseInt((s * 511) - 1)) {
                                        toret = true
                                    }
                                }
                                return toret
                            } catch (e) {}
                        },
                        extraPageFor8thround: function(match, round) {
                            try {


                                var toret = false
                                if (parseInt(round) == 8) {
                                    var s = 1

                                    if (match == 509||match==255) {
                                        return true
                                    }

                                    while (parseInt(match) != parseInt((s * 509) - 1)) {

                                        s = s + 1
                                        toret = false
                                        if (s >= 3) {
                                            break;
                                        }
                                    }

                                    if (parseInt(match) == parseInt((s * 509) - 1)) {

                                        toret = true
                                    }
                                }
                                return toret
                            } catch (e) {}
                        },
                        extraPageFor7thround: function(match, round) {
                            try {
                                try {
                                    var toret = false

                                    if (parseInt(round) == 7) {
                                        var s = 2
                                        while (parseInt(match) != parseInt((s * 63) + 1)) {
                                            s = s * 2
                                            toret = false
                                            if (s >= 32) {
                                                break;
                                            }
                                        }
                                        if (parseInt(match) == parseInt((s * 63) + 1)) {
                                            toret = true
                                        }
                                    }
                                    return toret
                                } catch (e) {

                                }
                            } catch (e) {

                            }
                        }
                });
                Template.registerHelper("checkToBreak_team", function(data) {
                    try {
                        if (data % 32 == 1) {
                            return true
                        }
                    } catch (e) {}
                });
                Template.registerHelper("checkToEmptyRowsDown_team", function(data1, data2,round) {
                    try {
                        if (parseInt(data1 % 16) == 0&& parseInt(round) != 6) {
                            if (_.findWhere(arrayOfNextMatch1, data2) == null) {
                                arrayOfNextMatch1.push(data2);
                            }
                            ServerSession.set("arrayOfNextMatch1_team", arrayOfNextMatch1)
                            return true
                        } else if (parseInt(round) != 6){
                            var matchConfig = MatchTeamCollectionConfig.findOne({
                                'tournamentId': tournamentId,
                                'eventName': eventName,
                            });
                            if (matchConfig && matchConfig.roundValues) {

                                if(_.findWhere(matchConfig.roundValues, {roundName:"Bronze Medal"})){
                                    matchConfig.roundValues = _.without(matchConfig.roundValues, _.findWhere(rounLen, {
                                        roundName:"Bronze Medal"
                                    }));
                                }

                                var roundValuesLength = parseInt(matchConfig.roundValues.length) + parseInt(1)
                                if (parseInt(roundValuesLength) < 7) {
                                    if (parseInt(roundValuesLength) == 5) {
                                        if (data1 == 8) {
                                            return true
                                        }
                                    } else if (parseInt(roundValuesLength) == 4) {
                                        if (data1 == 4) {
                                            return true
                                        }
                                    } else if (parseInt(roundValuesLength) == 3) {
                                        if (data1 == 2) {
                                            return true
                                        }
                                    } else if (parseInt(roundValuesLength) == 2) {
                                        if (data1 == 1) {
                                            return true
                                        }
                                    }
                                }
                            }
                        }
                    } catch (e) {}
                });
                Template.registerHelper("checkLeftMatch_team", function(data) {
                    try {
                        var num = parseInt(data)
                        //if (num % 2 == 1) {
                            return true
                        //}
                    } catch (e) {}
                });

                Template.registerHelper("checkRightMatch_team", function(data) {
                    try {
                        var num = parseInt(data)
                        //if (num % 2 == 0) {
                            return true
                        //}
                    } catch (e) {}
                });

                Template.registerHelper("checkNmOnly_team", function(data1, data2) {
                    try {
                        var num1 = parseInt(data1);
                        var num2 = parseInt(data2);
                        if (num1 == num2) {
                            return true
                        } else return false
                    } catch (e) {}
                });

                Template.registerHelper("checkToEmptyRowsDownPlusone_team", function(data1, data2) {
                    try {
                        var arrToBr = ServerSession.get("arrayOfNextMatch1_team");
                        for (var i = 0; i < arrToBr.length; i++) {
                            if (arrToBr[i] == data1) {
                                if (_.findWhere(arrayOfNextMatch2, data2) == null) {
                                    arrayOfNextMatch2.push(data2);
                                }
                                ServerSession.set("arrayOfNextMatch2_team", arrayOfNextMatch2)
                                return true
                            }
                        }
                    } catch (e) {}
                });

                Template.registerHelper("checkToEmptyRowsDownPlustwo_team", function(data1, data2) {
                    try {
                        var arrToBr = ServerSession.get("arrayOfNextMatch2_team");
                        for (var i = 0; i < arrToBr.length; i++) {
                            if (arrToBr[i] == data1) {
                                if (_.findWhere(arrayOfNextMatch3, data2) == null) {
                                    arrayOfNextMatch3.push(data2);
                                }
                                ServerSession.set("arrayOfNextMatch3_team", arrayOfNextMatch3)
                                return true
                            }
                        }
                    } catch (e) {}
                });

                Template.registerHelper("checkToEmptyRowsDownPlusthree_team", function(data1, data2) {
                    try {
                        var arrToBr = ServerSession.get("arrayOfNextMatch3_team");
                        for (var i = 0; i < arrToBr.length; i++) {
                            if (arrToBr[i] == data1) {
                                if (_.findWhere(arrayOfNextMatch4, data2) == null) {
                                    arrayOfNextMatch4.push(data2);
                                }
                                ServerSession.set("arrayOfNextMatch4_team", arrayOfNextMatch4)
                                return true
                            }
                        }
                    } catch (e) {}
                });

                Template.registerHelper("checkToEmptyRowsDownPlusFour_team", function(data1, data2) {
                    try {
                        var arrToBr = ServerSession.get("arrayOfNextMatch4_team");
                        for (var i = 0; i < arrToBr.length; i++) {
                            if (arrToBr[i] == data1) {
                                return true
                            }
                        }
                    } catch (e) {}
                });

                Template.registerHelper("toLower_team", function(data) {
                    try {
                        return data.toLowerCase().substr(0, 4)
                    } catch (e) {}
                });
                Template.registerHelper("toUserName_team", function(data) {
                    try {
                        if (data) {
                            //to change
                            var user = global[playerTeams].findOne({
                                "_id": data
                            });
                            if (user.teamName) {
                                return user.teamName //.substr(0, 15)
                            } else return " ";
                        } else return " ";
                    } catch (e) {}
                });
                Template.registerHelper("toclubName_team", function(data) {
                    try {
                        if (data) {
                            //to change
                            var user = global[userDetailsTT].findOne({
                                "userId": data
                            });
                            if (user && user.clubNameId) {
                                var academyInfo = academyDetails.findOne({
                                    "userId": user.clubNameId
                                })
                                if (academyInfo && academyInfo.clubName) {
                                    return "(" + academyInfo.clubName.substr(0, 3) + ")";
                                } else
                                    return " ";
                            } else return " ";
                        } else return " ";
                    } catch (e) {}
                });

                Template.registerHelper("removelastemptyDivHelper_team", function(data1, data2) {
                    try {
                        var s = ServerSession.get("2ndMAtchRemove_team");
                        if (s == data1) {
                            ServerSession.set("3rdMAtchRemove_team", data2)
                            return false
                        } else return true
                    } catch (e) {}
                });

                Template.registerHelper("removelastemptyDivHelper2_team", function(data1, data2) {
                    try {
                        var s = ServerSession.get("3rdMAtchRemove_team");
                        if (s == data1) {
                            ServerSession.set("4thMAtchRemove_team", data2)
                            return false
                        } else return true
                    } catch (e) {}
                });
                Template.registerHelper("removelastemptyDivHelper3_team", function(data1, data2) {
                    try {
                        var s = ServerSession.get("4thMAtchRemove_team");
                        if (s == data1) {
                            ServerSession.set("5thMAtchRemove_team", data2)
                            return false
                        } else return true
                    } catch (e) {}
                });
                Template.registerHelper("removelastemptyDivHelper4_team", function(data1, data2) {
                    try {
                        var s = ServerSession.get("5thMAtchRemove_team");
                        if (s == data1) {
                            return false
                        } else return true
                    } catch (e) {}
                });

                Template.registerHelper("playerANo_team",function(){   
                    try{
                        if(this.teamsNo && this.teamsNo.teamANo)
                            return this.teamsNo.teamANo;
                        else
                            return false;
                    }catch(e){

                    }
                });

                Template.registerHelper("playerBNo_team",function(){   
                    try{
                        if(this.teamsNo && this.teamsNo.teamBNo)
                            return this.teamsNo.teamBNo;
                        else
                            return false;
                    }catch(e){

                    }
                });

                SSR.compileTemplate('matchRecords_report', Assets.getText('layoutTest_team.html'));
                var html_string = SSR.render('layoutTest_team', {
                    css: css,
                    template: "matchRecords_report",
                    data: " "
                });
                var phantom = require('phantom');

                // Setup Webshot options
                var options = {
                    "paperSize": {
                        "format": "Letter",
                        "orientation": "portrait",
                        "margin": "1cm"
                    },

                    siteType: 'html',
                    customCSS: 'body {background-color: #b0c4de;}',
                };


                webshot(html_string, fileName, options, function(err) {
                    fs.readFile(fileName, function(err, data) {
                        if (err) {
                            return;
                        }
                        fs.unlink(fileName,function(err){
                            if(err){
                            }
                            else{
                                fut.return(data); 
                            }    
                        });
                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');
                return base64String;
            }
        }catch(e){}
    }
})

function power_of_2(n) {

    if (typeof n !== 'number')
        return false
    return n && (n & (n - 1)) === 0;
}

function get2PowerOfN(n) {
    if (typeof n !== 'number')
        return false
    return Math.log(n) / Math.log(2);
}