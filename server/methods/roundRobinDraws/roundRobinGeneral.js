import { initDBS } from '../dbRequiredRole.js'
import {playerDBFind} from '../dbRequiredRole.js'
//userDetailsTTUsed

Meteor.methods({
    "fetchRRWinner": async function(tournamentId, sEvent, eventId, maxWinnersReq) {
        try {
            var maxWinners = 0;
            if(maxWinnersReq != null && maxWinnersReq != undefined)
                maxWinners = parseInt(maxWinnersReq);
            var eventName = sEvent;
            var eventRanking = "";
            var userDetail = [];
            var eventInfo = events.findOne({
                "tournamentId": tournamentId,
                "eventName": sEvent
            });
            if(eventInfo == undefined)
            {
                eventInfo = pastEvents.findOne({
                    "tournamentId": tournamentId,
                    "eventName": sEvent
                });
            }
            var resultJson = {};
            if (eventInfo) {
                if (eventInfo.projectType == 2 || eventInfo.projectType == "2") {
                    var existsWinner = roundRobinTeamEvents.find({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                    }).fetch();
                    if (existsWinner.length == 0) {
                        resultJson["status"] = "failure";
                        resultJson["message"] = "Could not find draws!!";
                    }
                } else if (eventInfo.projectType == 1 || eventInfo.projectType == "1") {
                    var existsWinner = roundRobinEvents.find({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                    }).fetch();
                    if (existsWinner.length == 0) {
                        resultJson["status"] = "failure";
                        resultJson["message"] = "Could not find draws!!";
                    }
                }
                if (eventInfo.projectType == 2 || eventInfo.projectType == "2") {
                    var existsWinner = roundRobinTeamEvents.find({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                        groupStandingInfo: {
                            $elemMatch: {
                                groupStanding: {
                                    $in: [null, "", 0]
                                },
                            }
                        }

                    }).fetch();
                    if (existsWinner.length > 0) {
                        resultJson["status"] = "failure";
                        resultJson["message"] = "Incomplete match!!";
                    }
                } else {
                    var existsWinner = roundRobinEvents.find({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                        groupStandingInfo: {
                            $elemMatch: {
                                groupStanding: {
                                    $in: [null, "", 0]
                                },
                            }
                        }

                    }).fetch();

                    if (existsWinner.length > 0) {
                        resultJson["status"] = "failure";
                        resultJson["message"] = "Incomplete match!!"
                    }
                }
            }

            if (resultJson) {
                if (resultJson.status) {
                    if (resultJson.status == "failure")
                        return resultJson;
                }
            }

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

            if (dobFilterInfo) {
                if (dobFilterInfo && dobFilterInfo.details.length > 0) {
                    if (eventId.trim() == dobFilterInfo.details[0].eventId)
                        eventRanking = dobFilterInfo.details[0].ranking;
                }
            }

            if (eventInfo) 
            {
                if (eventInfo.projectType == 2 || eventInfo.projectType == "2") {
                    var winnerList = roundRobinTeamEvents.aggregate([{
                        $match: {
                            "tournamentId": tournamentId,
                            "eventName": eventName,
                            "groupStandingInfo": {
                                $elemMatch: {
                                    "groupStanding": {
                                        $lte: maxWinners
                                    },
                                }
                            }
                        }
                    }, {
                        $unwind: "$groupStandingInfo"
                    }, {
                        $match: {
                            "groupStandingInfo.groupStanding": {
                                $lte: maxWinners
                            }
                        }
                    }, {
                        $project: {
                            "_id": "$_id",
                            "groupNumber": "$groupNumber",
                            "groupName": "$groupName",
                            "rowNo": "$groupStandingInfo.rowNo",
                            "teamId": "$groupStandingInfo.teamId",
                        }
                    }]);
                    var userDetail = [];
                    if (winnerList && winnerList.length > 0) {
                        var index = 0;
                        for (var n = 0; n < winnerList.length; n++) 
                        {
                            var teamInfo;
                            var dbsrequired = ["playerTeams"]
                            var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                            if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                            {
                                teamInfo = global[res2.changedDbNames[0]].findOne({
                                    "_id": winnerList[n].teamId
                                })
                                                                                   
                            }

                            //var teamInfo = playerTeams.findOne({
                             //   "_id": winnerList[n].teamId
                            //});


                            if (teamInfo) {
                                index = index + 1;
                                var managerAffiliationId = "";
                                var temporaryAffiliationId = "";
                                if (teamInfo.teamManager) {
                                    var toret = "userDetailsTT"

                                    var usersMet = Meteor.users.findOne({
                                        userId: teamInfo.teamManager
                                    })

                                    if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                        var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                        if (dbn) {
                                            toret = dbn
                                        }
                                    }
                                    var userInfo ;
                                    if(toret)
                                    {
                                        var dbsrequired = ["userDetailsTT"]
                                        var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                        if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                        {
                                            userInfo = global[res2.changedDbNames[0]].findOne({
                                              "userId":teamInfo.teamManager
                                            })
                                                                                   
                                        }
                                    }
                                    //var userInfo = global[toret].findOne({
                                    //    "userId": teamInfo.teamManager
                                   // });

                                    
                                    if (userInfo) {
                                        if (userInfo.affiliationId)
                                            managerAffiliationId = userInfo.affiliationId
                                        if (userInfo.tempAffiliationId)
                                            temporaryAffiliationId = userInfo.tempAffiliationId
                                    }
                                }

                                if (eventRanking.trim() == "yes") 
                                {
                                    userDetail.push({
                                        "Sl.No": index,
                                        "teamName": teamInfo.teamName,
                                        "teamAffiliationId": teamInfo.teamAffiliationId,
                                        "managerAffiliationId": managerAffiliationId,
                                        "temporaryAffiliationId": temporaryAffiliationId
                                    });

                                } else {
                                    userDetail.push({
                                        "Sl.No": index,
                                        "teamName": teamInfo.teamName,
                                        "teamAffiliationId": teamInfo.teamAffiliationId,
                                        "managerAffiliationId": managerAffiliationId,
                                        "temporaryAffiliationId": temporaryAffiliationId

                                    });
                                }
                            }
                        }
                    }
                    resultJson["status"] = "success";
                    resultJson["response"] = userDetail;
                    return resultJson;

                } else {
                    var winnerList = roundRobinEvents.aggregate([{
                        $match: {
                            "tournamentId": tournamentId,
                            "eventName": eventName,
                            "groupStandingInfo": {
                                $elemMatch: {
                                    "groupStanding": {
                                        $lte: maxWinners
                                    },
                                }
                            }
                        }
                    }, {
                        $unwind: "$groupStandingInfo"
                    }, {
                        $match: {
                            "groupStandingInfo.groupStanding": {
                                $lte: maxWinners
                            }
                        }
                    }, {
                        $project: {
                            "_id": "$_id",
                            "groupNumber": "$groupNumber",
                            "groupName": "$groupName",
                            "rowNo": "$groupStandingInfo.rowNo",
                            "playerId": "$groupStandingInfo.playerId",
                        }
                    }]);
                    var userDetail = [];
                    if (winnerList && winnerList.length > 0) {
                        var index = 0;
                        for (var n = 0; n < winnerList.length; n++) {
                            var toret = "userDetailsTT"

                            var usersMet = Meteor.users.findOne({
                                userId:  winnerList[n].playerId
                            })

                            if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                if (dbn) {
                                    toret = dbn
                                }
                            }

                            var userInfo;
                            var dbsrequired = ["userDetailsTT"]
                            var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                            if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                            {
                                userInfo = global[res2.changedDbNames[0]].findOne({
                                    "userId":  winnerList[n].playerId
                                })
                                                                                   
                            }

                            //var userInfo = global[toret].findOne({
                             //   "userId":  winnerList[n].playerId
                           // });

                            
                            if (userInfo) {
                                index = index + 1;
                                var academyName = "";
                                if (userInfo.clubNameId) 
                                {
                                    var clubInfo = academyDetails.findOne({
                                        "userId": userInfo.clubNameId,
                                        "role": "Academy"
                                    });
                                    if (clubInfo)
                                        academyName = clubInfo.clubName;
                                }
                                else if(userInfo.schoolId)
                                {
                                    var schoolInfo = schoolDetails.findOne({
                                        "userId":userInfo.schoolId
                                    })
                                    if(schoolInfo)
                                        academyName = schoolInfo.schoolName;
                                }

                                if (eventRanking.trim() == "yes") {
                                    userDetail.push({
                                        "Sl.No": index,
                                        "Name": userInfo.userName,
                                        "Affiliation ID": userInfo.affiliationId,
                                        "Academy": academyName
                                    });

                                } else {
                                    userDetail.push({
                                        "Sl.No": index,
                                        "Name": userInfo.userName,
                                        "Affiliation ID": userInfo.tempAffiliationId,
                                        "Academy": academyName
                                    });
                                }
                            }
                        }
                    }
                    resultJson["status"] = "success";
                    resultJson["response"] = userDetail;
                    return resultJson;


                }
            }




        } catch (e) {
        }
    },
    'printRRTeamDetailedDraws': async function(tournamentId, eventName, teamAId, teamBId, teamDetailedDraws, teamDetailedSCore) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('printRRTeamDetailedDraws', Assets.getText('printRRTeamDetailedDraws.html'));
              
                if (tournamentId && eventName && teamDetailedDraws) 
                {
                   
                    var det = teamDetailedDraws
                    if (det) {
                        var res = await Meteor.call("getTeamDetailScoreRR", tournamentId, eventName, teamAId, teamBId)
                        try {
                            if (res) {
                                teamDetailedSCore = res
                            }
                        }catch(e){}
                    }
                }
                Template.printRRTeamDetailedDraws.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;

                            return imageURL;
                        } catch (E) {

                        }
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
                        } catch (e) {}
                    },
                    getDocType: function() {
                        return "<!DOCTYPE html>";
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
                            return eventName;
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
                                    return tourInfo.eventStartDate + " between " + tourInfo.eventEndDate;
                            } else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo) {
                                    if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                        return tourInfo.eventStartDate + " between " + tourInfo.eventEndDate;
                                }
                            }
                        } catch (e) {}
                    },

                    //teamAID
                    "teamAIDMatch": function() {
                        try {
                            if (teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID && det.teamsID.teamAId) {
                                    return det.teamsID.teamAId
                                }
                            }
                        } catch (e) {

                        }
                    },
                    "teamBIDMatch": function() {
                        try {
                            if (teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID && det.teamsID.teamBId) {
                                    return det.teamsID.teamBId
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //match a vs x
                    //play a
                    "matchAVSXPlayerA": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVSX && s.matchAVSX.playerAID) {
                                        return s.matchAVSX.playerAID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //play x
                    "matchAVSXPlayerX": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVSX && s.matchAVSX.playerBID) {
                                        return s.matchAVSX.playerBID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //matchScores
                    //match a vs x
                    //a
                    "matchScoresAVSXScoreA": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVSX && s.matchAVSX.setScoresA) {
                                        return s.matchAVSX.setScoresA
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //x
                    "matchScoresAVSXScoreX": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVSX && s.matchAVSX.setScoresB) {
                                        return s.matchAVSX.setScoresB
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //match b vs y
                    //play b
                    "matchBVSYPlayerB": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsY && s.matchBVsY.playerAID) {
                                        return s.matchBVsY.playerAID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //play y
                    "matchBVSYPlayerY": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsY && s.matchBVsY.playerBID) {
                                        return s.matchBVsY.playerBID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //match b vs y
                    //b
                    "matchScoresBVSYScoreB": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsY && s.matchBVsY.setScoresA) {
                                        return s.matchBVsY.setScoresA
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //y
                    "matchScoresBVSYScoreY": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsY && s.matchBVsY.setScoresB) {
                                        return s.matchBVsY.setScoresB
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //matchdoublesA
                    "matchdoublesA1": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.teamAD1PlayerId) {
                                        return s.matchDoubles.teamAD1PlayerId
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    "matchdoublesA2": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.teamAD2PlayerId) {
                                        return s.matchDoubles.teamAD2PlayerId
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    "matchdoublesB1": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.teamBD1PlayerId) {
                                        return s.matchDoubles.teamBD1PlayerId
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    "matchdoublesB2": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.teamBD2PlayerId) {
                                        return s.matchDoubles.teamBD2PlayerId
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //doubles a
                    "matchScoresDoublesScoreA": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.setScoresA) {
                                        return s.matchDoubles.setScoresA
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //doubles b
                    "matchScoresDoublesScoreB": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.setScoresB) {
                                        return s.matchDoubles.setScoresB
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },

                    //match b vs x
                    //play b matchBVsX
                    "matchBVSXPlayerB": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsX && s.matchBVsX.playerAID) {
                                        return s.matchBVsX.playerAID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //play x
                    "matchBVSXPlayerX": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsX && s.matchBVsX.playerBID) {
                                        return s.matchBVsX.playerBID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //match b vs x
                    //b
                    "matchScoresBVSXScoreB": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsX && s.matchBVsX.setScoresA) {
                                        return s.matchBVsX.setScoresA
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //x
                    "matchScoresBVSXScoreX": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsX && s.matchBVsX.setScoresB) {
                                        return s.matchBVsX.setScoresB
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //match a vs y
                    //play A
                    "matchAVSYPlayerA": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVsY && s.matchAVsY.playerAID) {
                                        return s.matchAVsY.playerAID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //play Y
                    "matchAVSYPlayerY": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVsY && s.matchAVsY.playerBID) {
                                        return s.matchAVsY.playerBID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //match a vs y
                    //a
                    "matchScoresAVSYScoreA": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVsY && s.matchAVsY.setScoresA) {
                                        return s.matchAVsY.setScoresA
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //y
                    "matchScoresAVSYScoreY": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVsY && s.matchAVsY.setScoresB) {
                                        return s.matchAVsY.setScoresB
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                });

                Template.registerHelper("findTheTeamNamedraw", function(data) {
                    try {
                        if (data) {
                            if(tournamentId != undefined && tournamentId != null)
                            {
                                var dbsrequired = ["playerTeams"]
                                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                {
                                    teamInfo = global[res2.changedDbNames[0]].findOne({
                                        "_id": data
                                    })
                                    if(teamInfo && teamInfo.teamName)
                                        return teamInfo.teamName;
                                                                                       
                                }
                            }
                            else
                            {
                                var teamName = playerTeams.findOne({
                                    "_id": data
                                });
                                if (teamName) {
                                    var teamDet = teamName
                                    if (teamDet && teamDet.teamName) {
                                        return teamDet.teamName;
                                    }
                                }
                            }
                           
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findThePlayerName", function(data) {
                    try {
                        if (data) {

                            var userName = Meteor.users.findOne({
                                userId: data
                            });
                            if (userName) {
                                var toret = "userDetailsTT"

                                var usersMet = Meteor.users.findOne({
                                    userId:  data
                                })

                                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                    if (dbn) {
                                        toret = dbn
                                    }
                                }
                                if(tournamentId != null && tournamentId != undefined)
                                {
                                    var dbsrequired = ["userDetailsTT"]
                                    var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                    {
                                        userInfo = global[res2.changedDbNames[0]].findOne({
                                            "userId":  data
                                        })
                                        if(userInfo && userInfo.userName)
                                            return userInfo.userName;
                                                                                           
                                    }
                                }
                                else
                                {
                                    var useDet = global[toret].findOne({
                                        "userId":  data
                                    });
                                
                                    if (useDet && useDet.userName) {
                                        return useDet.userName;
                                    }
                                }
                               
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findAVSXStatusType", function() {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchAVSX && s.matchAVSX.matchType) {
                                    if (s.matchAVSX.matchType.toLowerCase() == "notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchAVSX.matchType.toLowerCase().charAt(0).toUpperCase() + s.matchAVSX.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {}
                });

                Template.registerHelper("selectedWinnerAVSX", function() {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchAVSX && s.matchAVSX.winnerIdPlayer) {
                                    if (s.matchAVSX && s.matchAVSX.winnerIdPlayer)
                                        return s.matchAVSX.winnerIdPlayer
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findBVSYStatusType", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchBVsY && s.matchBVsY.matchType) {
                                    if (s.matchBVsY.matchType.toLowerCase() == "notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchBVsY.matchType.toLowerCase().charAt(0).toUpperCase() + s.matchBVsY.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("selectedWinnerBVSY", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchBVsY && s.matchBVsY.winnerIdPlayer) {
                                    if (s.matchBVsY && s.matchBVsY.winnerIdPlayer)
                                        return s.matchBVsY.winnerIdPlayer
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findDoublesStatusType", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchDoubles && s.matchDoubles.matchType) {
                                    if (s.matchDoubles.matchType.toLowerCase() == "notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchDoubles.matchType.toLowerCase().charAt(0).toUpperCase() + s.matchDoubles.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findBVSXStatusType", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchBVsX && s.matchBVsX.matchType) {
                                    if (s.matchBVsX.matchType.toLowerCase() == "notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchBVsX.matchType.toLowerCase().charAt(0).toUpperCase() + s.matchBVsX.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("selectedWinnerBVSX", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchBVsX && s.matchBVsX.winnerIdPlayer) {
                                    return s.matchBVsX.winnerIdPlayer
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findAVSYStatusType", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchAVsY && s.matchAVsY.matchType) {
                                    if (s.matchAVsY.matchType.toLowerCase() == "notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchAVsY.matchType.toLowerCase().charAt(0).toUpperCase() + s.matchAVsY.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("selectedWinnerAVSY", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchAVsY && s.matchAVsY.winnerIdPlayer) {
                                    return s.matchAVsY.winnerIdPlayer
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findteamStatusType", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.teamMatchType) {
                                    if (s.teamMatchType == "1")
                                        return "Not Played";
                                    if (s.teamMatchType.toLowerCase() == "notplayed")
                                        return "Not Played";
                                    else
                                        return s.teamMatchType.toLowerCase().charAt(0).toUpperCase() + s.teamMatchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findIfUltimateWinner", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.finalTeamWinner) {
                                    return s.finalTeamWinner
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("selectDoubleWinner1", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchDoubles && s.matchDoubles.winnerD1PlayerId) {
                                    return s.matchDoubles.winnerD1PlayerId
                                }
                            }
                        }
                    } catch (e) {}
                });

                Template.registerHelper("selectDoubleWinner2", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchDoubles && s.matchDoubles.winnerD1PlayerId) {
                                    return s.matchDoubles.winnerD2PlayerId
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                SSR.compileTemplate('matchRecords_report', Assets.getText('printRRTeamDetailedDraws.html'));

                var html_string = SSR.render('printRRTeamDetailedDraws', {
                    css: css,
                    template: "matchRecords_report",
                    data: ' '
                });

                var options = {
                    "paperSize": {
                        "format": "Letter",
                        "orientation": "portrait",
                        "margin": "1cm",

                    },
                    siteType: 'html',
                    customCSS: 'table {}'
                };

                webshot(html_string, fileName, options, function(err) {
                    fs.readFile(fileName, function(err, data) {
                        if (err) {
                            return
                        }

                        fs.unlinkSync(fileName);
                        fut.return(data);

                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');
                return base64String;
            }

        } catch (e) {}
    },

    //printRRTeamDetailedDraws
    'printRRBlankTeamDetailedDraws': async function(tournamentId, eventName, teamAId, teamBId, teamDetailedDraws, teamDetailedSCore) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('drawsStyle.css');
                SSR.compileTemplate('printRRBlankTeamDetailedDraws', Assets.getText('printRRBlankTeamDetailedDraws.html'));
              
                if (tournamentId && eventName && teamDetailedDraws) 
                {
                   
                    var det = teamDetailedDraws
                    if (det) {
                        var res = await Meteor.call("getTeamDetailScoreRR", tournamentId, eventName, teamAId, teamBId)
                        try {
                            if (res) {
                                teamDetailedSCore = res
                            }
                        }catch(e){}
                    }
                }
                Template.printRRBlankTeamDetailedDraws.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;

                            return imageURL;
                        } catch (E) {

                        }
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
                        } catch (e) {}
                    },
                    getDocType: function() {
                        return "<!DOCTYPE html>";
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
                            return eventName;
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

                    //teamAID
                    "teamAIDMatch": function() {
                        try {
                            if (teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID && det.teamsID.teamAId) {
                                    return det.teamsID.teamAId
                                }
                            }
                        } catch (e) {

                        }
                    },
                    "teamBIDMatch": function() {
                        try {
                            if (teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID && det.teamsID.teamBId) {
                                    return det.teamsID.teamBId
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //match a vs x
                    //play a
                    "matchAVSXPlayerA": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVSX && s.matchAVSX.playerAID) {
                                        return s.matchAVSX.playerAID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //play x
                    "matchAVSXPlayerX": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVSX && s.matchAVSX.playerBID) {
                                        return s.matchAVSX.playerBID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    
                    
                    //match b vs y
                    //play b
                    "matchBVSYPlayerB": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsY && s.matchBVsY.playerAID) {
                                        return s.matchBVsY.playerAID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //play y
                    "matchBVSYPlayerY": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsY && s.matchBVsY.playerBID) {
                                        return s.matchBVsY.playerBID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                   
                   
                    //matchdoublesA
                    "matchdoublesA1": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.teamAD1PlayerId) {
                                        return s.matchDoubles.teamAD1PlayerId
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    "matchdoublesA2": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.teamAD2PlayerId) {
                                        return s.matchDoubles.teamAD2PlayerId
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    "matchdoublesB1": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.teamBD1PlayerId) {
                                        return s.matchDoubles.teamBD1PlayerId
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    "matchdoublesB2": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchDoubles && s.matchDoubles.teamBD2PlayerId) {
                                        return s.matchDoubles.teamBD2PlayerId
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                   

                    //match b vs x
                    //play b matchBVsX
                    "matchBVSXPlayerB": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsX && s.matchBVsX.playerAID) {
                                        return s.matchBVsX.playerAID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //play x
                    "matchBVSXPlayerX": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchBVsX && s.matchBVsX.playerBID) {
                                        return s.matchBVsX.playerBID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                   
                    //match a vs y
                    //play A
                    "matchAVSYPlayerA": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVsY && s.matchAVsY.playerAID) {
                                        return s.matchAVsY.playerAID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    },
                    //play Y
                    "matchAVSYPlayerY": function() {
                        try {
                            if (teamDetailedSCore && teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.teamsID.teamAId != undefined && det.teamsID.teamBId != undefined) {
                                    var s = teamDetailedSCore
                                    if (s && s.matchAVsY && s.matchAVsY.playerBID) {
                                        return s.matchAVsY.playerBID
                                    }
                                }
                            }
                        } catch (e) {

                        }
                    }
                   
                });

                Template.registerHelper("findTheTeamNamedraw", function(data) {
                    try {
                        if (data) {
                            if(tournamentId != undefined && tournamentId != null)
                            {
                                var dbsrequired = ["playerTeams"]
                                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                {
                                    teamInfo = global[res2.changedDbNames[0]].findOne({
                                        "_id": data
                                    })
                                    if(teamInfo && teamInfo.teamName)
                                        return teamInfo.teamName;
                                                                                       
                                }
                            }
                            else
                            {
                                var teamName = playerTeams.findOne({
                                    "_id": data
                                });
                                if (teamName) {
                                    var teamDet = teamName
                                    if (teamDet && teamDet.teamName) {
                                        return teamDet.teamName;
                                    }
                                }
                            }
                           
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findThePlayerName", function(data) {
                    try {
                        if (data) {

                            var userName = Meteor.users.findOne({
                                userId: data
                            });
                            if (userName) {
                                var toret = "userDetailsTT"

                                var usersMet = Meteor.users.findOne({
                                    userId:  data
                                })

                                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                    if (dbn) {
                                        toret = dbn
                                    }
                                }
                                if(tournamentId != null && tournamentId != undefined)
                                {
                                    var dbsrequired = ["userDetailsTT"]
                                    var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                    {
                                        userInfo = global[res2.changedDbNames[0]].findOne({
                                            "userId":  data
                                        })
                                        if(userInfo && userInfo.userName)
                                            return userInfo.userName;
                                                                                           
                                    }
                                }
                                else
                                {
                                    var useDet = global[toret].findOne({
                                        "userId":  data
                                    });
                                
                                    if (useDet && useDet.userName) {
                                        return useDet.userName;
                                    }
                                }
                               
                            }
                        }
                    } catch (e) {

                    }
                });

                


                SSR.compileTemplate('matchRecords_report', Assets.getText('printRRBlankTeamDetailedDraws.html'));

                var html_string = SSR.render('printRRBlankTeamDetailedDraws', {
                    css: css,
                    template: "matchRecords_report",
                    data: ' '
                });

                var options = {
                    "paperSize": {
                        "format": "Letter",
                        "orientation": "portrait",
                        "margin": "1cm",

                    },
                    siteType: 'html',
                    customCSS: 'table {}'
                };

                webshot(html_string, fileName, options, function(err) {
                    fs.readFile(fileName, function(err, data) {
                        if (err) {
                            return
                        }

                        fs.unlinkSync(fileName);
                        fut.return(data);

                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');
                return base64String;
            }

        } catch (e) {}
    },
    "fetchIndDetailScores":function(data)
    {
        try{
            var tournamentId = data.tournamentId;
            var eventName = data.eventName;
            var rowNo = data.rowNo;
            var colNo = data.colNo;

            var res1 = roundRobinEvents.findOne({
                "_id":data._id,
                "tournamentId":tournamentId,
                "eventName":eventName,
                "groupDetails.rowNo": rowNo,
                "groupDetails.colNo":colNo},
                            {
                fields: {
                    _id: 0,
                    "groupDetails": {
                        $elemMatch: {
                            "rowNo": rowNo,
                            "colNo":colNo
                        }
                    },
                    "groupName":1
                }
            }
            );
            if(res1 && res1.groupDetails && res1.groupDetails.length > 0 && res1.groupDetails[0])
                {
                    var resultJson = {};
                    resultJson["groupName"] = res1.groupName;
                    resultJson["groupDetails"] = res1.groupDetails[0];
                    return resultJson;
                }

        }catch(e){
            errorLog(e)
        }
    },
    "fetchRRDrawEvents":function(data)
    {
        try{

            var successJson = succesData();
            var failureJson = failureData();
            var objCheck = Match.test(data, {"tournamentId":String});

            if(objCheck)
            {
                var tourInfo = events.findOne({"_id":data.tournamentId});
                if(tourInfo == undefined)              
                    tourInfo = pastEvents.findOne({"_id":data.tournamentId});


                if(tourInfo)
                {
                    var raw1 = events.rawCollection();
                    var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
                    var upcomingTourList = distinct1('_id', {"_id":data.tournamentId});

                    var raw2 = pastEvents.rawCollection();
                    var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
                    var pastTourList = distinct2('_id', {"_id":data.tournamentId});

                    var tourList = upcomingTourList.concat(pastTourList);

                    var raw3 = roundRobinEvents.rawCollection();
                    var distinct3 = Meteor.wrapAsync(raw3.distinct, raw3);
                    var singleEvents = distinct3('eventName', {"tournamentId":{$in:tourList}});

                    var raw4 = roundRobinTeamEvents.rawCollection();
                    var distinct4 = Meteor.wrapAsync(raw4.distinct, raw4);
                    var teamEvents = distinct4('eventName', {"tournamentId":{$in:tourList}});


                    var drawEvents = singleEvents.concat(teamEvents);

                    var eventsData = pastEvents.aggregate([
                        {$match:{
                            "tournamentId":data.tournamentId,"tournamentEvent":false,
                            "eventName":{$in:drawEvents}}},
                        {$group:{"_id":null,
                            "events":{$addToSet:{"eventName":"$eventName","projectType":"$projectType","tournamentId":"$tournamentId"}}
                        }}
                    ]);


                    if(eventsData && eventsData.length == 0)
                    {
                        eventsData = events.aggregate([
                            {$match:{
                                "tournamentId":data.tournamentId,"tournamentEvent":false,
                                "eventName":{$in:drawEvents}}},
                            {$group:{"_id":null,
                                "events":{$addToSet:{"eventName":"$eventName","projectType":"$projectType","tournamentId":"$tournamentId"}}
                            }}
                        ]);
                    }

                    if(eventsData && eventsData.length >0 && eventsData[0] && eventsData[0].events)
                    {
                        var listOfEvents = eventsData[0].events;
                        listOfEvents  = _.sortBy(listOfEvents, 'projectType');

                        if(data.tournamentId)
                        {
                            var sortEvents = categorySort(listOfEvents,data.tournamentId)
                            if(listOfEvents.length == sortEvents.length)
                            {
                                listOfEvents = sortEvents
                            }
                        }

                        successJson["data"] = listOfEvents;   
                        successJson["tournamentData"] = tourInfo;          
                        successJson["message"] = "Events data";
                        return successJson;
                    }
                    else
                    {   
                        if(tourInfo){
                            failureJson["tournamentData"] = tourInfo
                        }

                        failureJson["message"] = "No events";
                        return failureJson;
                    }
                }
                else
                {
                    failureJson["message"] = "Invalid Tournament";
                    return failureJson;                  
                }
                
                
                                    
            }
            else
            {
                failureJson["message"] = "Require all parameters";
                return failureJson;
            }

        }catch(e)
        {       
            failureJson["message"] = "Could not fetch events"+e;
            return failureJson;
        }

        
    },
    "fetchRRDraws":function(tournamentId,eventName)
    {
        try{

            var projectType = 0;
            var lookUpDB = "";

            var tourInfo = events.findOne({"_id":tournamentId});
            if(tourInfo == undefined)              
                tourInfo = pastEvents.findOne({"_id":tournamentId});

            var subExists = subscriptionRestrictions.findOne({"tournamentId":tournamentId});

            if (subExists && subExists.selectionType &&
                subExists.selectionType.toLowerCase() == "schoolonly") {
                lookUpDB = "schoolTeams"
            } else {
                lookUpDB = "playerTeams"
            }


            var drawExists = roundRobinEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
            if(drawExists)
                projectType = 1;

            if(drawExists == undefined)
            {
                drawExists = roundRobinTeamEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
                if(drawExists){
                    projectType = 2;
                }
            }


            if(projectType == 1 && tourInfo)
            {
                var drawData = roundRobinEvents.aggregate([
                    {$match:{
                        "tournamentId":tournamentId,
                        "eventName":eventName
                    }}, 
                    {$sort:{
                        "groupNumber":1,
                    }} ,                          
                   
                    {$unwind:"$groupDetails"},
                    {$lookup: {
                        from: "users",
                        localField: "groupDetails.playersID.playerAId",
                        foreignField: "_id",
                        as: "playerADetails" 
                    }}, 
                    {$unwind: {
                        path: "$playerADetails",
                        preserveNullAndEmptyArrays: true
                    }},
                    {$lookup: {
                        from: "users",
                        localField: "groupDetails.playersID.playerBId",
                        foreignField: "_id",
                        as: "playerBDetails" 
                    }}, 
                    {$unwind: {
                        path: "$playerBDetails",
                        preserveNullAndEmptyArrays: true
                    }},
                    {$addFields:{
                    
                        "groupDetails.playerAName":"$playerADetails.userName",
                        "groupDetails.playerBName":"$playerBDetails.userName",
                        "groupDetails.playerAId":"$groupDetails.playersID.playerAId",
                        "groupDetails.playerBId":"$groupDetails.playersID.playerBId",
                        
                    }},
                    {$group:{
                        "_id":{"tournamentId":"$tournamentId","eventName":"$eventName","groupNumber":"$groupNumber"},
                    
                        "groupNumber":{$first:"$groupNumber"},
                        "groupName":{$first:"$groupName"},
                        "groupMaxSize":{$first:"$groupMaxSize"},
                        //"groupDetails":{$push:"$groupDetails"},
                           "groupDetails":{$push:{
                            "rowNo":"$groupDetails.rowNo",
                            "colNo":"$groupDetails.colNo",
                            "status":"$groupDetails.status",
                            "playerAId":"$groupDetails.playerAId",
                            "playerBId":"$groupDetails.playerBId",
                            "playerAName":"$groupDetails.playerAName",
                            "playerBName":"$groupDetails.playerBName",
                            "playerAWin":"$groupDetails.setWins.playerA",
                            "playerBWin":"$groupDetails.setWins.playerB",
                            "scoresA":"$groupDetails.scores.setScoresA",
                            "scoresB":"$groupDetails.scores.setScoresB",
                            "winnerID":"$groupDetails.winnerID",
                            "loserID":"$groupDetails.loserID"}},
                        "groupStandingInfo":{$first:"$groupStandingInfo"}

                    }},
                    {$sort:{
                        "groupNumber":1,
                        "groupDetails.rowNo":1,
                        "groupDetails.colNo":1
                    }},
                    
                    
                    {$project:{
                        "_id":0,
                        "tournamentId":"$_id.tournamentId",
                        "eventName":"$_id.eventName",
                        "groupNumber":1,
                        "groupName":1,
                        "groupMaxSize":1,
                        "groupDetails":1,
                        "groupStandingInfo":1,
                        "projectType":{"$literal":1}
                    }}
                    ]);

                if(drawData && drawData.length > 0)
                {
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["data"] = drawData;
                    resultJson["tournamentData"] = tourInfo;
                    return resultJson;

                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["data"] = [];
                    resultJson["message"] = "Empty draws"
                                        resultJson["tournamentData"] = tourInfo;

                    return resultJson;
                }
                    

            }
            else if(projectType == 2 && tourInfo)
            {

                var drawData = roundRobinTeamEvents.aggregate([
                    {$match:{
                        "tournamentId":tournamentId,
                        "eventName":eventName
                    }}, 
                    {$sort:{
                        "groupNumber":1,
                    }} ,                          
                   
                    {$unwind:"$groupDetails"},
                    {$lookup: {
                        from: lookUpDB,
                        localField: "groupDetails.teamsID.teamAId",
                        foreignField: "_id",
                        as: "playerADetails" 
                    }}, 
                    {$unwind: {
                        path: "$playerADetails",
                        preserveNullAndEmptyArrays: true
                    }},
                    {$lookup: {
                        from: lookUpDB,
                        localField: "groupDetails.teamsID.teamBId",
                        foreignField: "_id",
                        as: "playerBDetails" 
                    }}, 
                    {$unwind: {
                        path: "$playerBDetails",
                        preserveNullAndEmptyArrays: true
                    }},
                    {$addFields:{
                    
                        "groupDetails.playerAName":"$playerADetails.teamName",
                        "groupDetails.playerBName":"$playerBDetails.teamName",
                        "groupDetails.playerAId":"$groupDetails.teamsID.teamAId",
                        "groupDetails.playerBId":"$groupDetails.teamsID.teamBId",
                        
                    }},
                    {$group:{
                        "_id":{"tournamentId":"$tournamentId","eventName":"$eventName","groupNumber":"$groupNumber"},
                    
                        "groupNumber":{$first:"$groupNumber"},
                        "groupName":{$first:"$groupName"},
                        "groupMaxSize":{$first:"$groupMaxSize"},
                        "groupDetails":{$push:{
                            "rowNo":"$groupDetails.rowNo",
                            "colNo":"$groupDetails.colNo",
                            "status":"$groupDetails.status",
                            "playerAId":"$groupDetails.playerAId",
                            "playerBId":"$groupDetails.playerBId",
                            "playerAName":"$groupDetails.playerAName",
                            "playerBName":"$groupDetails.playerBName",
                            "playerAWin":"$groupDetails.setWins.teamA",
                            "playerBWin":"$groupDetails.setWins.teamB",
                            "scoresA":"$groupDetails.scores.setScoresA",
                            "scoresB":"$groupDetails.scores.setScoresB",
                            "winnerID":"$groupDetails.winnerID",
                            "loserID":"$groupDetails.loserID"}},
                        "groupStandingInfo":{$first:"$groupStandingInfo"}
                    }},
                    {$sort:{
                        "groupNumber":1,
                        "groupDetails.rowNo":1,
                        "groupDetails.colNo":1
                    }},
                    
                    
                    {$project:{
                        "_id":0,
                        "tournamentId":"$_id.tournamentId",
                        "eventName":"$_id.eventName",
                        "groupNumber":1,
                        "groupName":1,
                        "groupMaxSize":1,
                        "groupDetails":1,
                        "groupStandingInfo":1,
                        "projectType":{"$literal":2}

                    }}
                    ]);

                if(drawData && drawData.length > 0)
                {
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["data"] = drawData;
                    resultJson["tournamentData"] = tourInfo;
                    return resultJson;

                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["data"] = [];
                    resultJson["message"] = "Empty draws";
                    resultJson["tournamentData"] = tourInfo;

                    return resultJson;
                }
            }
        }catch(e)
        {
            errorLog(e)
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["messag"] = e;
            return resultJson;
        }
    }
})