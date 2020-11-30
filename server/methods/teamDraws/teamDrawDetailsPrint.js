//userDetailsTTUsed

Meteor.methods({
    'teamDrawDetailsPrint': async function(tournamentId, eventName, roundNumber, matchNumber,teamDetailedDraws,teamDetailedSCore) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('printTeamDetailedDraws', Assets.getText('printTeamDetailedDraws.html'));
                 tournamentId = tournamentId;
                 eventName = eventName;

                var dbsrequired = ["userDetailsTT","playerTeams"]
           
                var userDetailsTT = "userDetailsTT"
                var playerTeams = "playerTeams"

              

                if (tournamentId && eventName && teamDetailedDraws) {
                     tournamentId = tournamentId;
                     eventName = eventName
                    var det = teamDetailedDraws
                    var tournamentFind = events.findOne({"_id":tournamentId})
                    if(tournamentFind==undefined||tournamentFind==null){
                        tournamentFind = pastEvents.findOne({
                            "_id": tournamentId
                        })
                    }
                    var res = await Meteor.call("changeDbNameForDraws", tournamentFind,dbsrequired)
                    try {
                        if(res){
                            if(res.changeDb && res.changeDb == true){
                                if(res.changedDbNames.length!=0){
                                    userDetailsTT = res.changedDbNames[0]
                                    playerTeams = res.changedDbNames[1]
                                }
                            }
                        }
                    }catch(e){}

                    if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                        var s = await Meteor.call("getDetailsOFTeamDetailedScore", tournamentId, eventName, det.matchNumber, det.roundNumber, "" )
                        try {
                            if (s){
                                teamDetailedSCore = s               
                            }
                        }catch(e){}
                    }
                }
                Template.printTeamDetailedDraws.helpers({
                    "imageURL":function(){
                        try{
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0,absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;
                            return imageURL;
                        }catch(E){
                        }
                    },
                    get5sImage:function(){
                        try{
                            var e = events.findOne({"eventName":eventName,"tournamentEvent":false,'tournamentId':tournamentId})
                            if(e==undefined){
                                e = pastEvents.findOne({"eventName":eventName,tournamentId:tournamentId})
                            }
                            if(e&&e.sponsorLogo){
                                sponsorLogo = e.sponsorLogo
                                var sponsorLogoURL = eventUploads.findOne({"_id":sponsorLogo});
                                if(sponsorLogoURL){
                                    return sponsorLogoURL
                                }
                                else return false
                            } else return false
                        }catch(e){

                        }
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
                        } catch (e) {
                        }
                    },
                    eventName_team: function() {
                        try {
                            return eventName;
                        } catch (e) {
                        }
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
                        } catch (e) {
                        }
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
                        } catch (e) {
                        }
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
                        } catch (e) {
                        }
                    },
                    roundNumber: function(){
                        try{
                            return roundNumber
                        }catch(e){
                        }
                    },
                    matchNumber: function(){
                        try{
                            return matchNumber
                        }catch(e){
                        }
                    },
                    //teamAID
                    "teamAIDMatch": function() {
                        try {                        
                            if (teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined && det.teamsID && det.teamsID.teamAId) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined && det.teamsID && det.teamsID.teamBId) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {                                
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {                                
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {                                
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {                                
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) { 
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) { 
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {                               
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {                               
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (teamDetailedSCore&&teamDetailedDraws) {
                                var det = teamDetailedDraws
                                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                           var teamName = global[playerTeams].findOne({
                                "_id":data
                            });
                            if (teamName) {
                                var teamDet = teamName
                                if (teamDet && teamDet.teamName) {
                                    return teamDet.teamName;
                                }
                            }
                        }
                    } catch (e) {
                    }
                });

                Template.registerHelper("findThePlayerName", function(data) {
                    try {
                        if (data) {
                            //to change
                            var userName = Meteor.users.findOne({
                                userId: data
                            });
                            if (userName) {
                                var useDet = global[userDetailsTT].findOne({
                                    userId: data
                                });
                                if (useDet && useDet.userName) {
                                    return useDet.userName;
                                }
                            }
                        }
                    } catch (e) {
                    }
                });

                Template.registerHelper("findAVSXStatusType", function() {
                    try {
                        if (teamDetailedSCore&&teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchAVSX && s.matchAVSX.matchType) {
                                    if(s.matchAVSX.matchType.toLowerCase()=="notplayed")
                                        return "Not Played";
                                    else
                                    return s.matchAVSX.matchType.toLowerCase().charAt(0).toUpperCase()+s.matchAVSX.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {
                    }
                });

                Template.registerHelper("selectedWinnerAVSX", function() {
                    try {
                        if (teamDetailedSCore&&teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                         if (teamDetailedSCore&&teamDetailedDraws) {
                           var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchBVsY && s.matchBVsY.matchType) {
                                    if(s.matchBVsY.matchType.toLowerCase()=="notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchBVsY.matchType.toLowerCase().charAt(0).toUpperCase()+s.matchBVsY.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {
                    }
                });

                Template.registerHelper("selectedWinnerBVSY", function(data) {
                    try {
                        if (teamDetailedSCore&&teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                        if (teamDetailedSCore&&teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchDoubles && s.matchDoubles.matchType) {
                                    if(s.matchDoubles.matchType.toLowerCase()=="notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchDoubles.matchType.toLowerCase().charAt(0).toUpperCase()+s.matchDoubles.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {
                    }
                });

                Template.registerHelper("findBVSXStatusType", function(data) {
                    try {
                        if (teamDetailedSCore&&teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchBVsX && s.matchBVsX.matchType) {
                                    if(s.matchBVsX.matchType.toLowerCase()=="notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchBVsX.matchType.toLowerCase().charAt(0).toUpperCase()+s.matchBVsX.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {
                    }
                });

                Template.registerHelper("selectedWinnerBVSX", function(data) {
                    try {
                        if (teamDetailedSCore&&teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                        if (teamDetailedSCore&&teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchAVsY && s.matchAVsY.matchType) {
                                    if(s.matchAVsY.matchType.toLowerCase()=="notplayed")
                                        return "Not Played";
                                    else
                                        return s.matchAVsY.matchType.toLowerCase().charAt(0).toUpperCase()+s.matchAVsY.matchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {
                    }
                });

                Template.registerHelper("selectedWinnerAVSY", function(data) {
                    try {
                        if (teamDetailedSCore&&teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                        if (teamDetailedSCore&&teamDetailedDraws){
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.teamMatchType) {
                                    if(s.teamMatchType == "1")
                                        return "Not Played";
                                    if(s.teamMatchType.toLowerCase()=="notplayed")
                                        return "Not Played";
                                    else
                                        return s.teamMatchType.toLowerCase().charAt(0).toUpperCase()+s.teamMatchType.toLowerCase().slice(1);
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findIfUltimateWinner", function(data) {
                    try {
                        if (teamDetailedSCore&&teamDetailedDraws){
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
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
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchDoubles && s.matchDoubles.winnerD1PlayerId) {                                   
                                    return s.matchDoubles.winnerD1PlayerId
                                }
                            }
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("selectDoubleWinner2", function(data) {
                    try {
                        if (teamDetailedSCore && teamDetailedDraws) {
                            var det = teamDetailedDraws
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var s = teamDetailedSCore
                                if (s && s.matchDoubles && s.matchDoubles.winnerD1PlayerId) {                                   
                                    return s.matchDoubles.winnerD2PlayerId
                                }
                            }
                        }
                    } catch (e) {
                    }
                });

                SSR.compileTemplate('matchRecords_report', Assets.getText('printTeamDetailedDraws.html'));

                var html_string = SSR.render('printTeamDetailedDraws', {
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

        } catch (e) {
        }
    }
});