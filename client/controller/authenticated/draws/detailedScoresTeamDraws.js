import {
    propogateTeam
}
from './eventTeamDraws.js'

Template.detailedScoresTeamDraws.onCreated(function() {

});

Template.detailedScoresTeamDraws.onRendered(function() {
    if (Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName")
        var det = Session.get("teamDetailedDraws")
        if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
            var s = Meteor.call("getDetailsOFTeamDetailedScore", tournamentId, eventName, det.matchNumber, det.roundNumber, "", function(e, res) {
                if (res){
                    Session.set("teamDetailedSCore", res)
                    Meteor.call("viewerOrOrganizer",Session.get("tournamentId"),Meteor.userId(),function(e,resView){
                        Session.set("viewerOrOrganizerEdit",resView)
                    });                     
                }
            })
        }
    }
});

Template.detailedScoresTeamDraws.onDestroyed(function() {
    Session.set("teamDetailedSCore", undefined)
});

Template.detailedScoresTeamDraws.helpers({
    "readonlyForViewers":function(){
        if(Session.get("viewerOrOrganizerEdit")!=undefined){
            if(Session.get("viewerOrOrganizerEdit")==true)
                return false
            else
                return true
        }
    },
    "teamA": function() {
        return "TeamA"
    },
    "teamB": function() {
        return "TeamB";
    },
    //teamAID
    "teamAIDMatch": function() {
        try {
            if (Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined && det.teamsID && det.teamsID.teamAId) {
                    return det.teamsID.teamAId
                }
            }
        } catch (e) {

        }
    },
    "teamBIDMatch": function() {
        try {
            if (Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
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
            if (Session.get("teamDetailedSCore") && Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchAVSX && s.matchAVSX.playerAID) {
                        return s.matchAVSX.playerAID
                    }
                }
            }
        } catch (e) {}
    },
    //play x
    "matchAVSXPlayerX": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchAVSX && s.matchAVSX.playerBID) {
                        return s.matchAVSX.playerBID
                    }
                }
            }
        } catch (e) {}
    },
    //match b vs y
    //play b
    "matchBVSYPlayerB": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchBVsY && s.matchBVsY.playerAID) {
                        return s.matchBVsY.playerAID
                    }
                }
            }
        } catch (e) {}
    },
    //play y
    "matchBVSYPlayerY": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchBVsY && s.matchBVsY.playerBID) {
                        return s.matchBVsY.playerBID
                    }
                }
            }
        } catch (e) {}
    },
    //match b vs x
    //play b matchBVsX
    "matchBVSXPlayerB": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchBVsX && s.matchBVsX.playerAID) {
                        return s.matchBVsX.playerAID
                    }
                }
            }
        } catch (e) {}
    },
    //play x
    "matchBVSXPlayerX": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchBVsX && s.matchBVsX.playerBID) {
                        return s.matchBVsX.playerBID
                    }
                }
            }
        } catch (e) {}
    },
    //match a vs y
    //play A
    "matchAVSYPlayerA": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchAVsY && s.matchAVsY.playerAID) {
                        return s.matchAVsY.playerAID
                    }
                }
            }
        } catch (e) {}
    },
    //play Y
    "matchAVSYPlayerY": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchAVsY && s.matchAVsY.playerBID) {
                        return s.matchAVsY.playerBID
                    }
                }
            }
        } catch (e) {}
    },
    //matchdoublesA
    "matchdoublesA1": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchDoubles && s.matchDoubles.teamAD1PlayerId) {
                        return s.matchDoubles.teamAD1PlayerId
                    }
                }
            }
        } catch (e) {}
    },
    "matchdoublesA2": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchDoubles && s.matchDoubles.teamAD2PlayerId) {
                        return s.matchDoubles.teamAD2PlayerId
                    }
                }
            }
        } catch (e) {}
    },
    "matchdoublesB1": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchDoubles && s.matchDoubles.teamBD1PlayerId) {
                        return s.matchDoubles.teamBD1PlayerId
                    }
                }
            }
        } catch (e) {}
    },
    "matchdoublesB2": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchDoubles && s.matchDoubles.teamBD2PlayerId) {
                        return s.matchDoubles.teamBD2PlayerId
                    }
                }
            }
        } catch (e) {}
    },

    //matchScores
    //match a vs x
    //a
    "matchScoresAVSXScoreA": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchAVSX && s.matchAVSX.setScoresA) {
                        return s.matchAVSX.setScoresA
                    }
                }
            }
        } catch (e) {}
    },
    //x
    "matchScoresAVSXScoreX": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchAVSX && s.matchAVSX.setScoresB) {
                        return s.matchAVSX.setScoresB
                    }
                }
            }
        } catch (e) {}
    },
    //match b vs y
    //b
    "matchScoresBVSYScoreB": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchBVsY && s.matchBVsY.setScoresA) {
                        return s.matchBVsY.setScoresA
                    }
                }
            }
        } catch (e) {}
    },
    //y
    "matchScoresBVSYScoreY": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchBVsY && s.matchBVsY.setScoresB) {
                        return s.matchBVsY.setScoresB
                    }
                }
            }
        } catch (e) {}
    },
    //match b vs x
    //b
    "matchScoresBVSXScoreB": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchBVsX && s.matchBVsX.setScoresA) {
                        return s.matchBVsX.setScoresA
                    }
                }
            }
        } catch (e) {}
    },
    //x
    "matchScoresBVSXScoreX": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchBVsX && s.matchBVsX.setScoresB) {
                        return s.matchBVsX.setScoresB
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchAVsY && s.matchAVsY.setScoresA) {
                        return s.matchAVsY.setScoresA
                    }
                }
            }
        } catch (e) {}
    },
    //y
    "matchScoresAVSYScoreY": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchAVsY && s.matchAVsY.setScoresB) {
                        return s.matchAVsY.setScoresB
                    }
                }
            }
        } catch (e) {}
    },

    //doubles a
    "matchScoresDoublesScoreA": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchDoubles && s.matchDoubles.setScoresA) {
                        return s.matchDoubles.setScoresA
                    }
                }
            }
        } catch (e) {}
    },
    //doubles b
    "matchScoresDoublesScoreB": function() {
        try {
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("teamDetailedDraws")
                if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                    var s = Session.get("teamDetailedSCore")
                    if (s && s.matchDoubles && s.matchDoubles.setScoresB) {
                        return s.matchDoubles.setScoresB
                    }
                }
            }
        } catch (e) {}
    },
    notPlayed: function() {
        return "notPlayed"
    },
    bye: function() {
        return "bye"
    },
    walkover: function() {
        return "walkover"
    },
    completed: function() {
        return "completed"
    },
    checkOnlyEventOrganizer:function(){
        try{
            var s = ReactiveMethod.call("viewerOrOrganizer",Session.get("tournamentId"),Meteor.userId());
            if(s)
                return true
            else
                return false
        }catch(e){

        }
    },
    "lockStatus":function()
    {
        //byeWalkOver
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        var result2 = ReactiveMethod.call("getMatchDrawsLock",tournamentId,eventName);
        return result2;
    }
});

Template.detailedScoresTeamDraws.events({
    "click #saveTeamDETailsForm": async function(e) {
        var autoTweet = $("#checkAcceptboxTweett").prop("checked");
        var tournament = Session.get("tournamentId")
        try {
            e.preventDefault();
            var avsxPlayerAName = "1";
            var avsxPlayerXName = "1";
            var bvsxPlayerBName = "1";
            var bvsxPlayerXName = "1";
            var bvsyPlayerBName = "1";
            var bvsyPlayerYName = "1";
            var avsyPlayerAName = "1";
            var avsyPlayerYName = "1";
            var doublesTeamAPlayerAName = "1";
            var doublesTeamAPlayerBName = "1";
            var doublesTeamBPlayerAName = "1";
            var doublesTeamBPlayerBName = "1";
            var winnerD1PlayerId = "1";
            var winnerD2PlayerId = "1";

            if ($("#AVSXPlayerAScore1").attr("name")) {
                avsxPlayerAName = $("#AVSXPlayerAScore1").attr("name").trim();
            }
            if ($("#AVSXPlayerXScore1").attr("name")) {
                avsxPlayerXName = $("#AVSXPlayerXScore1").attr("name").trim();
            }
            if ($("#BVSYPlayerBScore1").attr("name")) {
                bvsyPlayerBName = $("#BVSYPlayerBScore1").attr("name").trim();
            }
            if ($("#BVSYPlayerYScore1").attr("name")) {
                bvsyPlayerYName = $("#BVSYPlayerYScore1").attr("name").trim();
            }
            if ($("#BVSXPlayerBScore1").attr("name")) {
                bvsxPlayerBName = $("#BVSXPlayerBScore1").attr("name").trim();
            }
            if ($("#BVSXPlayerXScore1").attr("name")) {
                bvsxPlayerXName = $("#BVSXPlayerXScore1").attr("name").trim();
            }
            if ($("#AVSYPlayerAScore1").attr("name")) {
                avsyPlayerAName = $("#AVSYPlayerAScore1").attr("name").trim();
            }
            if ($("#AVSYPlayerYScore1").attr("name")) {
                avsyPlayerYName = $("#AVSYPlayerYScore1").attr("name").trim();
            }
            if ($("#DoublesPlayerAScore1").attr("name")) {
                var doubles = $("#DoublesPlayerAScore1").attr("name").split(",")
                doublesTeamAPlayerAName = doubles[0];
                doublesTeamAPlayerBName = doubles[1];
            }
            if ($("#DoublesPlayerBScore1").attr("name")) {
                var doubles = $("#DoublesPlayerBScore1").attr("name").split(",")
                if (doubles[0] != undefined && doubles[0].trim().length == 0) {
                    doubles[0] = "1";
                }
                if (doubles[0] == undefined) {
                    doubles[0] = "1";
                }
                if (doubles[1] != undefined && doubles[1].trim().length == 0) {
                    doubles[1] = "1";
                }
                if (doubles[1] == undefined) {
                    doubles[1] = "1";
                }
                doublesTeamBPlayerAName = doubles[0];
                doublesTeamBPlayerBName = doubles[1];
            }
            if ($('#doublesWinnerID option:selected').attr('id')) {
                var doublesWinner = $('#doublesWinnerID option:selected').val().trim().split(",");
                if (doublesWinner[0] != undefined && doublesWinner[0].trim().length == 0) {
                    doublesWinner[0] = "1";
                }
                if (doublesWinner[0] == undefined) {
                    doublesWinner[0] = "1";
                }
                if (doublesWinner[1] != undefined && doublesWinner[1].trim().length == 0) {
                    doublesWinner[1] = "1";
                }
                if (doublesWinner[1] == undefined) {
                    doublesWinner[1] = "1";
                }
                winnerD1PlayerId = doublesWinner[0];
                winnerD2PlayerId = doublesWinner[1];
            }
            //a vs x player a
            var avsxStatus = $("#AVSXStatus").val().trim();
            var avsxWinner = $("#AVSXWinner").val().trim();
            var avsxWinnerTeam = "1";
            if($('#AVSXWinner option:selected').attr('id')){
                avsxWinnerTeam = $('#AVSXWinner option:selected').attr('id').trim();
            }
            var avsxPlayerA = avsxPlayerAName;
            var avsxPlayerAScore1 = $("#AVSXPlayerAScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var avsxPlayerAScore2 = $("#AVSXPlayerAScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore3 = $("#AVSXPlayerAScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore4 = $("#AVSXPlayerAScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore5 = $("#AVSXPlayerAScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore6 = $("#AVSXPlayerAScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore7 = $("#AVSXPlayerAScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScores = [avsxPlayerAScore1, avsxPlayerAScore2, avsxPlayerAScore3, avsxPlayerAScore4, avsxPlayerAScore5, avsxPlayerAScore6, avsxPlayerAScore7];
            //a vs x player x
            var avsxPlayerX = avsxPlayerXName;
            var avsxPlayerXScore1 = $("#AVSXPlayerXScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var avsxPlayerXScore2 = $("#AVSXPlayerXScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore3 = $("#AVSXPlayerXScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore4 = $("#AVSXPlayerXScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore5 = $("#AVSXPlayerXScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore6 = $("#AVSXPlayerXScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore7 = $("#AVSXPlayerXScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScores = [avsxPlayerXScore1, avsxPlayerXScore2, avsxPlayerXScore3, avsxPlayerXScore4, avsxPlayerXScore5, avsxPlayerXScore6, avsxPlayerXScore7];
            //b vs y player b
            var bvsyStatus = $("#BVSYStatus").val().trim();
            var bvsyWinner = $("#BVSYWinner").val().trim();

            var bvsyWinnerTeam = "1";
            if($('#BVSYWinner option:selected').attr('id')){
                bvsyWinnerTeam = $('#BVSYWinner option:selected').attr('id').trim();
            }

            var bvsyPlayerB = bvsyPlayerBName;
            var bvsyPlayerBScore1 = $("#BVSYPlayerBScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var bvsyPlayerBScore2 = $("#BVSYPlayerBScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore3 = $("#BVSYPlayerBScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore4 = $("#BVSYPlayerBScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore5 = $("#BVSYPlayerBScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore6 = $("#BVSYPlayerBScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore7 = $("#BVSYPlayerBScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScores = [bvsyPlayerBScore1, bvsyPlayerBScore2, bvsyPlayerBScore3, bvsyPlayerBScore4, bvsyPlayerBScore5, bvsyPlayerBScore6, bvsyPlayerBScore7];
            //b vs y player y
            var bvsyPlayerY = bvsyPlayerYName;
            var bvsyPlayerYScore1 = $("#BVSYPlayerYScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var bvsyPlayerYScore2 = $("#BVSYPlayerYScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore3 = $("#BVSYPlayerYScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore4 = $("#BVSYPlayerYScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore5 = $("#BVSYPlayerYScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore6 = $("#BVSYPlayerYScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore7 = $("#BVSYPlayerYScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScores = [bvsyPlayerYScore1, bvsyPlayerYScore2, bvsyPlayerYScore3, bvsyPlayerYScore4, bvsyPlayerYScore5, bvsyPlayerYScore6, bvsyPlayerYScore7];
            //b vs x player b
            var bvsxStatus = $("#BVSXStatus").val().trim();
            var bvsxWinner = $("#BVSXWinner").val().trim();
            var bvsxWinnerTeam = "1";
            if($('#BVSXWinner option:selected').attr('id')){
                bvsxWinnerTeam = $('#BVSXWinner option:selected').attr('id').trim();
            }
            var bvsxPlayerB = bvsxPlayerBName;
            var bvsxPlayerBScore1 = $("#BVSXPlayerBScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var bvsxPlayerBScore2 = $("#BVSXPlayerBScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore3 = $("#BVSXPlayerBScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore4 = $("#BVSXPlayerBScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore5 = $("#BVSXPlayerBScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore6 = $("#BVSXPlayerBScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore7 = $("#BVSXPlayerBScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScores = [bvsxPlayerBScore1, bvsxPlayerBScore2, bvsxPlayerBScore3, bvsxPlayerBScore4, bvsxPlayerBScore5, bvsxPlayerBScore6, bvsxPlayerBScore7];
            //b vs x player x
            var bvsxPlayerX = bvsxPlayerXName;
            var bvsxPlayerXScore1 = $("#BVSXPlayerXScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var bvsxPlayerXScore2 = $("#BVSXPlayerXScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore3 = $("#BVSXPlayerXScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore4 = $("#BVSXPlayerXScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore5 = $("#BVSXPlayerXScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore6 = $("#BVSXPlayerXScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore7 = $("#BVSXPlayerXScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScores = [bvsxPlayerXScore1, bvsxPlayerXScore2, bvsxPlayerXScore3, bvsxPlayerXScore4, bvsxPlayerXScore5, bvsxPlayerXScore6, bvsxPlayerXScore7];
            //a vs y player a
            var avsyStatus = $("#AVSYStatus").val().trim();
            var avsyWinner = $("#AVSYWinner").val().trim();
            var avsyWinnerTeam = "1";
            if($('#AVSYWinner option:selected').attr('id')){
                avsyWinnerTeam = $('#AVSYWinner option:selected').attr('id').trim();
            }
            var avsyPlayerA = avsyPlayerAName;
            var avsyPlayerAScore1 = $("#AVSYPlayerAScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var avsyPlayerAScore2 = $("#AVSYPlayerAScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore3 = $("#AVSYPlayerAScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore4 = $("#AVSYPlayerAScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore5 = $("#AVSYPlayerAScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore6 = $("#AVSYPlayerAScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore7 = $("#AVSYPlayerAScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScores = [avsyPlayerAScore1, avsyPlayerAScore2, avsyPlayerAScore3, avsyPlayerAScore4, avsyPlayerAScore5, avsyPlayerAScore6, avsyPlayerAScore7];
            //a vs y player y
            var avsyPlayerY = avsyPlayerYName;
            var avsyPlayerYScore1 = $("#AVSYPlayerYScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var avsyPlayerYScore2 = $("#AVSYPlayerYScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore3 = $("#AVSYPlayerYScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore4 = $("#AVSYPlayerYScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore5 = $("#AVSYPlayerYScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore6 = $("#AVSYPlayerYScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore7 = $("#AVSYPlayerYScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScores = [avsyPlayerYScore1, avsyPlayerYScore2, avsyPlayerYScore3, avsyPlayerYScore4, avsyPlayerYScore5, avsyPlayerYScore6, avsyPlayerYScore7];
            //doubles
            //player a
            var doublesStatus = $("#doublesMatchStatus").val().trim();
            var winnerIdTeamDoubles = "1";
            if($('#AVSYWinner option:selected').attr('id')){
                winnerIdTeamDoubles = $('#doublesWinnerID option:selected').attr('id').trim();
            }
            var teamAD1PlayerId = doublesTeamAPlayerAName
            var teamAD2PlayerId = doublesTeamAPlayerBName
            var winnerD1PlayerIdA = winnerD1PlayerId;
            var winnerD2PlayerIdA = winnerD2PlayerId;
            var doublesSetScoreA1 = $("#DoublesPlayerAScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA2 = $("#DoublesPlayerAScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA3 = $("#DoublesPlayerAScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA4 = $("#DoublesPlayerAScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA5 = $("#DoublesPlayerAScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA6 = $("#DoublesPlayerAScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA7 = $("#DoublesPlayerAScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var setScoresADoubles = [doublesSetScoreA1, doublesSetScoreA2, doublesSetScoreA3, doublesSetScoreA4, doublesSetScoreA5, doublesSetScoreA6, doublesSetScoreA7];
            //player b
            var teamBD1PlayerId = doublesTeamBPlayerAName
            var teamBD2PlayerId = doublesTeamBPlayerBName;
            var doublesSetScoreB1 = $("#DoublesPlayerBScore1").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB2 = $("#DoublesPlayerBScore2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB3 = $("#DoublesPlayerBScore3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB4 = $("#DoublesPlayerBScore4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB5 = $("#DoublesPlayerBScore5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB6 = $("#DoublesPlayerBScore6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB7 = $("#DoublesPlayerBScore7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var setScoresBDoubles = [doublesSetScoreB1, doublesSetScoreB2, doublesSetScoreB3, doublesSetScoreB4, doublesSetScoreB5, doublesSetScoreB6, doublesSetScoreB7]
            var avsxDATA = {
                playerAID: avsxPlayerA,
                playerBID: avsxPlayerX,
                setScoresA: avsxPlayerAScores,
                setScoresB: avsxPlayerXScores,
                winnerIdPlayer: avsxWinner,
                matchType: avsxStatus,
                winnerIdTeam: avsxWinnerTeam
            }

            var bvsxDATA = {
                playerAID: bvsxPlayerB,
                playerBID: bvsxPlayerX,
                setScoresA: bvsxPlayerBScores,
                setScoresB: bvsxPlayerXScores,
                winnerIdPlayer: bvsxWinner,
                matchType: bvsxStatus,
                winnerIdTeam: bvsxWinnerTeam
            }

            var avsyDATA = {
                playerAID: avsyPlayerA,
                playerBID: avsyPlayerY,
                setScoresA: avsyPlayerAScores,
                setScoresB: avsyPlayerYScores,
                winnerIdPlayer: avsyWinner,
                matchType: avsyStatus,
                winnerIdTeam: avsyWinnerTeam
            }

            var bvsyDATA = {
                playerAID: bvsyPlayerB,
                playerBID: bvsyPlayerY,
                setScoresA: bvsyPlayerBScores,
                setScoresB: bvsyPlayerYScores,
                winnerIdPlayer: bvsyWinner,
                matchType: bvsyStatus,
                winnerIdTeam: bvsyWinnerTeam
            }

            var doublesDATA = {
                teamAD1PlayerId: teamAD1PlayerId,
                teamAD2PlayerId: teamAD2PlayerId,
                teamBD1PlayerId: teamBD1PlayerId,
                teamBD2PlayerId: teamBD2PlayerId,
                matchType: doublesStatus,
                winnerIdTeam: winnerIdTeamDoubles,
                winnerD1PlayerId: winnerD1PlayerIdA,
                winnerD2PlayerId: winnerD2PlayerIdA,
                setScoresA: setScoresADoubles,
                setScoresB: setScoresBDoubles
            }
            if (Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName");
                var det = Session.get("teamDetailedDraws");
                var finalTeamWinner = "1";
                var teamMatchType = "notPlayed";

                if ($("#TeamWinnerId").val().trim()) {
                    finalTeamWinner = $("#TeamWinnerId").val().trim();
                }
                if ($("#TeamMatchType").val().trim()) {
                    teamMatchType = $("#TeamMatchType").val().trim();
                }
                var teamAID;
                var teamBID;

                if (det && det.matchNumber != undefined && det.roundNumber != undefined && det.teamsID) {
                    var matchNumber = det.matchNumber
                    var roundNumber = det.roundNumber
                    if (det.teamsID.teamAId) {
                        teamAID = det.teamsID.teamAId
                    } else {
                        teamAID = "1"
                    }
                    if (det.teamsID.teamBId) {
                        teamBID = det.teamsID.teamBId
                    } else {
                        teamBID = "1"
                    }
                }
                var teamDET = {
                    roundNumber: roundNumber,
                    matchNumber: matchNumber,
                    teamAID: teamAID,
                    teamBID: teamBID,
                    matchAVSX: avsxDATA,
                    matchBVsY: bvsyDATA,
                    matchBVsX: bvsxDATA,
                    matchAVsY: avsyDATA,
                    matchDoubles: doublesDATA,
                    finalTeamWinner: finalTeamWinner,
                    teamMatchType: teamMatchType
                }

                var mainDATA = {
                    tournamentId: tournamentId,
                    eventName: eventName,
                    teamDET: teamDET
                }
                var setType = "notPlayed";
                var teamWinnerId = "1"
                var teamName = "1"
                var teamType = "1";
                var autoTweet = $("#checkAcceptboxTweett").prop("checked");

                var curMatchRec = Session.get("teamDetailedDraws");
                if($("#TeamMatchType").val()){
                    setType = $("#TeamMatchType").val().trim();
                }

                if($("#TeamWinnerId").val()){
                    teamWinnerId = $("#TeamWinnerId").val().trim();
                }
                if($("#TeamWinnerId option:selected").text()){
                   teamName =  $("#TeamWinnerId option:selected").text().trim()
                }
                if($("#TeamWinnerId option:selected").attr("id")){
                    teamType = $("#TeamWinnerId option:selected").attr("id").trim()
                }
                var res = await Meteor.callPromise("updateTeamDetailedScoresWithTeamDraws", mainDATA)
                    try{

                    if (res) {
                        var teamSetScores = res;
                        updateTeamDetailedScoresToMatchCollec(teamSetScores, curMatchRec, setType, teamWinnerId, teamName, teamType,autoTweet,function(x){
                            if(x){
                                alert("Data Saved")
                            }
                        })
                        //call twitter
                           // Meteor.call("mainRoundsCompletedTeam", Session.get("maxRoundNum"), autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,curMatchRecord.roundNumber, function(e, res){})
                            //Meteor.call("matchCompletedAutoTweetTeam", autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status, function(e, res) {
                                //Meteor.call("nextRoundDecidedForTeam",autoTweet,tournament,eventN,roundNo,matchNo,function(e,r){})
                            //})
                            //if(parseInt(curMatchRecord.roundNumber)==parseInt(Session.get("maxRoundNum"))){
                                //Meteor.call("matchConlcudedTeam",autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,function(e,res){})
                            //}
                    }
                }catch(e){

                    alert(e)
                }
            }
        } catch (e) {
             alert(e)
        }
    },
    "click #notifyAppRound":function(){
        try{
            var data1 = {
                tournamentId:Session.get("tournamentId"),
                eventName:Session.get("eventName"),
                blank:false,
                eventOrganizer:Meteor.userId(),
                roundNot:true
            }

            try{
                if(Session.get("teamDetailedDraws") && 
                    Session.get("teamDetailedDraws").roundNumber){

                    var data = {
                        tournamentId:Session.get("tournamentId"),
                        eventName:Session.get("eventName"),
                        db:"teamMatchCollectionDB",
                        roundNumber:Session.get("teamDetailedDraws").roundNumber
                    }

                    Meteor.call("getFirstMatchNumberMatchCol",data,function(e,res){
                        alert(res)
                        if(res){
                            var s = Session.get("teamDetailedDraws")

                            if(s && s.matchNumber){
                                data1["matchNumber"] = res
                            }
                            if(s && s.roundNumber){
                                data1["roundNumber"] = s.roundNumber
                            }

                            Meteor.call("notifyAppMatchRecord",data1,function(e,res){

                            })
                        }
                    })
                }
            }catch(e){

            }
        }catch(e){
            alert(e)
        }
    },
    "click #notifyApp":function(){
        try{
            var data1 = {
                tournamentId:Session.get("tournamentId"),
                eventName:Session.get("eventName"),
                blank:false,
                eventOrganizer:Meteor.userId()
            }

            if(Session.get("teamDetailedDraws")){
                var s = Session.get("teamDetailedDraws")

                if(s && s.matchNumber){
                    data1["matchNumber"] = s.matchNumber
                }
                if(s && s.roundNumber){
                    data1["roundNumber"] = s.roundNumber
                }
            }

            Meteor.call("notifyAppMatchRecord",data1,function(e,res){

            })
            
        }catch(e){
            alert(e)
        }
    },
    "click #PrintTeamDetailedScore":function(e){
        e.preventDefault();
        try{
            if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName");
                var det = Session.get("teamDetailedDraws");
                var roundNumber = det.roundNumber;
                var matchNumber = det.matchNumber;
                var teamDetailedDraws = Session.get("teamDetailedDraws")
                var teamDetailedSCore = Session.get("teamDetailedSCore")
                Meteor.call("teamDrawDetailsPrint",tournamentId,eventName,roundNumber,matchNumber,teamDetailedDraws,teamDetailedSCore,function(e,res){
                    if(res)
                        window.open("data:application/pdf;base64, " + res);
                })
            }        
        }catch(e){
        }
    },
    "keyup [id^=AVSXPlayerAScore]": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },

    "keyup [id^=AVSXPlayerAScore]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=AVSXPlayerXScore]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=BVSYPlayerBScore]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=BVSYPlayerYScore]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=BVSXPlayerBScore]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=BVSXPlayerXScore]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=AVSYPlayerAScore]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=AVSYPlayerYScore]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=DoublesPlayerAScore]":function(event){
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keyup [id^=DoublesPlayerBScore]":function(event){ 
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
});

export const updateTeamDetailedScoresToMatchCollec = async function(setScores, curMatchRecord, setType, teamWinnerId, teamName, teamType,autoTweet,xCallBack) {
   try {
        if(setType.toLowerCase() == "notplayed"){
            curMatchRecord.status = 'yetToPlay';
        }
        if (setType == "bye") {
            curMatchRecord.status = 'bye';
            curMatchRecord.winner = teamName;
            if (teamType == "TeamA") {
                curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameBye';
                curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
            } else if (teamType == "TeamB") {
                curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameBye';
            }

            var loserId = "";
            var winnerId = "";
            var winnerNo = "";
            var loser = "";
            var managerAId = "";
            var managerBId = "";
            if (teamType == "TeamA") {
                loserId = curMatchRecord.teamsID.teamBId;
                loser = curMatchRecord.teams.teamB;
                winnerId = curMatchRecord.teamsID.teamAId;
                curMatchRecord.winnerID = curMatchRecord.teamsID.teamAId;
                curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerAId;
                curMatchRecord.winnerNo = "";
                if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamANo)
                {
                    winnerNo = curMatchRecord.teamsNo.teamANo;
                    curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamANo;
                }
            } else if (teamType == "TeamB") {
                loserId = curMatchRecord.teamsID.teamAId;
                loser = curMatchRecord.teams.teamA;
                winnerId = curMatchRecord.teamsID.teamBId;
                curMatchRecord.winnerID = curMatchRecord.teamsID.teamBId;
                curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerBId;
                curMatchRecord.winnerNo = "";
                if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamBNo)
                {
                    winnerNo = curMatchRecord.teamsNo.teamBNo;
                    curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamBNo;
                }
            }
            winnerId = curMatchRecord.winnerID;
            winnerNo = curMatchRecord.winnerNo;
        }
        if (setType == "walkover") {

            curMatchRecord.status = 'walkover';
            curMatchRecord.winner = teamName;
            if (teamType == "TeamA") {
                loserId = curMatchRecord.teamsID.teamBId;
                loser = curMatchRecord.teams.teamB;
                winnerId = curMatchRecord.teamsID.teamAId;
                curMatchRecord.winnerID = curMatchRecord.teamsID.teamAId;
                curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerAId;
                curMatchRecord.winnerNo = "";
                if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamANo)
                {
                    winnerNo = curMatchRecord.teamsNo.teamANo;
                    curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamANo;
                }
            } else if (teamType == "TeamB") {
                loserId = curMatchRecord.teamsID.teamAId;
                loser = curMatchRecord.teams.teamA;
                winnerId = curMatchRecord.teamsID.teamBId;
                curMatchRecord.winnerID = curMatchRecord.teamsID.teamBId;
                curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerBId;
                curMatchRecord.winnerNo = "";
                if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamBNo)
                {
                    winnerNo = curMatchRecord.teamsNo.teamBNo;
                    curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamBNo;            
                }
            }
            if (teamType == "TeamA") {
                curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameWalkover';
                curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
            } else if (teamType == "TeamB") {
                curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameWalkover';
            }
            winnerId = curMatchRecord.winnerID;
            winnerNo = curMatchRecord.winnerNo;
        }
        if (setType == "completed") {
            try {
                var teamScoreA = {
                    scoresA: []
                };
                var teamScoreB = {
                    scoresB: []
                };
                curMatchRecord.status = 'completed';
                var status = 'completed';
                var winner = teamName;
                curMatchRecord.winner = teamName;

                var setScoresA = setScores.teamScoreSetA;
                var setScoresB = setScores.teamScoreSetB;
                var scores = {
                    setScoresA: setScoresA,
                    setScoresB: setScoresB
                }
                if (teamType == "TeamA") {
                    curMatchRecord.status = 'completed';
                    curMatchRecord.winner = curMatchRecord.teams.teamA
                    teamId = curMatchRecord.teamsID.teamBId;
                    curMatchRecord.loser = curMatchRecord.teams.teamB;
                    curMatchRecord.winner = curMatchRecord.teams.teamA;
                    curMatchRecord.winnerID = curMatchRecord.teamsID.teamAId;
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameLost';
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
                    curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerAId;
                    curMatchRecord.winnerNo = "";
                    if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamANo)
                    {
                        curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamANo;
                        winnerNo = curMatchRecord.teamsNo.teamANo;
                    }
                } else if (teamType == "TeamB") {
                    curMatchRecord.status = 'completed';
                    curMatchRecord.winner = curMatchRecord.teams.teamB;
                    teamId = curMatchRecord.teamsID.teamAId;
                    curMatchRecord.winner = curMatchRecord.teams.teamB;
                    curMatchRecord.loser = curMatchRecord.teams.teamA;
                    curMatchRecord.winnerID = curMatchRecord.teamsID.teamBId;
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameLost';
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                    curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerBId;
                    curMatchRecord.winnerNo = "";
                    if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamBNo)
                    {
                        curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamBNo;
                        winnerNo = curMatchRecord.teamsNo.teamBNo;
                    }
                } else {
                    $("#editSettingsPopupError").text("* Incomplete set");
                    return xCallBack(false);
                }

                var thisMatchNumber = curMatchRecord.matchNumber;
                curMatchRecord.scores = scores;

                if (teamType == "TeamA") {
                    curMatchRecord.selectedID = curMatchRecord.teamsID.teamAId;
                    curMatchRecord.selectedTeamName = curMatchRecord.teams.teamA;
                } else if (teamType == "TeamB") {
                    curMatchRecord.selectedID = curMatchRecord.teamsID.teamBId;
                    curMatchRecord.selectedTeamName = curMatchRecord.teams.teamB;
                }

                tournament = Session.get("tournamentId");
                eventN = Session.get("eventName");
                winnerId = curMatchRecord.winnerID;
                winnerNo = curMatchRecord.winnerNo;
                roundNo = Session.get("byeWalkoverRoundName_team");
                matchNo = curMatchRecord.matchNumber;
                status = setType;


                //
                    //

            } catch (e) {
                return xCallBack(false);
            }
        }
        if (setType == "bye" || setType == "walkover" || setType == "completed" || setType.toLowerCase() == "notplayed") {
            var thisMatchNumber = curMatchRecord.matchNumber;
            var tmpRec = curMatchRecord;
            var matchRecord = tmpRec;
            var updated = 0;
            var leftRMatches = Session.get("leftRMatches_team");
            var rightRMatches = Session.get("rightRMatches_team");
            var updI = 0;
            var fromLeft = 0;
            var getBMDet = false
            for (let i = 0; i < leftRMatches.length; i++) {
                if (leftRMatches[i].matchNumber == thisMatchNumber  && 
                    leftRMatches[i].roundName != "BM") {
                    leftRMatches[i] = matchRecord;
                    updI = i;
                    updated = 1;
                    fromLeft = 1;
                    break;
                }
            }
            if (!updated) {
                
                for (let i = 0; i < rightRMatches.length; i++) {
                    if (rightRMatches[i].matchNumber == thisMatchNumber  && 
                        rightRMatches[i].roundName != "BM") {
                        rightRMatches[i] = matchRecord;
                        updI = i;
                        break;
                    }
                }
            }


            var matchRecords = Session.get("matchRecords");
            matchRecords[thisMatchNumber - 1] = matchRecord;
            Session.set("leftRMatches_team", leftRMatches);
            Session.set("rightRMatches_team", rightRMatches);
            Session.set("matchRecords", matchRecords);

            propogateTeam(matchRecord, fromLeft);
            matchRecords = Session.get("matchRecords");
            var FqfpQFsF = false;


                tournament = Session.get("tournamentId");
                eventN = Session.get("eventName");
                winnerId = curMatchRecord.winnerID;
                winnerNo = curMatchRecord.winnerNo;
                roundNo = FqfpQFsF;
                matchNo = curMatchRecord.matchNumber;
                status = setType;
                

                var call1 = await Meteor.callPromise("updateMatchRecordsTeam", Session.get("tournamentId"), Session.get("eventName"), matchRecords, curMatchRecord)
                try {
                    if(true){
                        if (Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {

                            //Meteor.call("mainRoundsCompletedTeam", Session.get("maxRoundNum"), autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,curMatchRecord.roundNumber, function(e, res){})
                            var call2 = await Meteor.callPromise("matchCompletedAutoTweetTeam", autoTweet, tournament, eventN, winnerId, "", matchNo, status)
                            try{ 
                              var call3 = await Meteor.callPromise("nextRoundDecidedForTeam",autoTweet,tournament,eventN,"",matchNo,function(e,r){})
                            }catch(e){
                                return xCallBack(false)
                            }
                            if(parseInt(curMatchRecord.roundNumber)==parseInt(Session.get("maxRoundNum"))){
                                var call3 = await Meteor.callPromise("matchConlcudedTeam",autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status)
                            }
                            var tournamentId = Session.get("tournamentId");
                            var eventName = Session.get("eventName")
                            var det = Session.get("teamDetailedDraws")
                            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                                var res = await Meteor.callPromise("getDetailsOFTeamDetailedScore", tournamentId, eventName, det.matchNumber, det.roundNumber, "")
                                try {
                                    if (res){
                                        Session.set("teamDetailedSCore", res)
                                        var resView = await Meteor.callPromise("viewerOrOrganizer",Session.get("tournamentId"),Meteor.userId())
                                        try{
                                            Session.set("viewerOrOrganizerEdit",resView)
                                            return xCallBack(true)
                                        }catch(e){
                                            return xCallBack(true)
                                        }                
                                    }else{
                                        return xCallBack(true)
                                    }
                                }catch(e){
                                    return xCallBack(false)
                                }
                            }
                        }                                   
                    }
                }catch(e){
                    return xCallBack(false)
                }
            //$("#byeWalkOver_team").modal('hide')
        }
    } catch (e) {
        alert(e)
        return xCallBack(false);
        
    }
}

Template.registerHelper("findThePlayerName", function(data) {
    try {
        if (data) {
            var s = ReactiveMethod.call("findThePlayerName", data,Session.get("tournamentId"));
            if (s)
                return s
        }
    } catch (e) {

    }
})

Template.registerHelper("findTheTeamNamedraw", function(data) {
    try {
        if (data) {
            var s = ReactiveMethod.call("findTheTeamNameTeamDraws", data,Session.get("tournamentId"));
            if (s)
                return s
        }
    } catch (e) {

    }
});

Template.registerHelper("findIfUltimateWinner", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.finalTeamWinner) {
                    if (s.finalTeamWinner == data)
                        return true
                }
            }
        }
    } catch (e) {
    }
})


Template.registerHelper("findteamStatusType", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.teamMatchType) {
                    if (s.teamMatchType.toLowerCase() == data.toLowerCase())
                        return true
                }
            }
        }
    } catch (e) {
    }
});

Template.registerHelper("findAVSXStatusType", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchAVSX && s.matchAVSX.matchType) {
                    if (s.matchAVSX.matchType.toLowerCase() == data.toLowerCase())
                        return true
                }
            }
        }
    } catch (e) {
    }
});

Template.registerHelper("findBVSYStatusType", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchBVsY && s.matchBVsY.matchType) {
                    if (s.matchBVsY.matchType.toLowerCase() == data.toLowerCase())
                        return true
                }
            }
        }
    } catch (e) {
    }
});

Template.registerHelper("findDoublesStatusType", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchDoubles && s.matchDoubles.matchType) {
                    if (s.matchDoubles.matchType.toLowerCase() == data.toLowerCase())
                        return true
                }
            }
        }
    } catch (e) {
    }
});

Template.registerHelper("findAVSYStatusType", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchAVsY && s.matchAVsY.matchType) {
                    if (s.matchAVsY.matchType.toLowerCase() == data.toLowerCase())
                        return true
                }
            }
        }
    } catch (e) {
    }
});

Template.registerHelper("findBVSXStatusType", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchBVsX && s.matchBVsX.matchType) {
                    if (s.matchBVsX.matchType.toLowerCase() == data.toLowerCase())
                        return true
                }
            }
        }
    } catch (e) {
    }
});

Template.registerHelper("selectedWinnerAVSX", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchAVSX && s.matchAVSX.winnerIdPlayer) {
                    if (s.matchAVSX && s.matchAVSX.winnerIdPlayer == data)
                        return true
                }
            }
        }
    } catch (e) {
    }
})

Template.registerHelper("selectedWinnerBVSY", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchBVsY && s.matchBVsY.winnerIdPlayer) {
                    if (s.matchBVsY && s.matchBVsY.winnerIdPlayer == data)
                        return true
                }
            }
        }
    } catch (e) {
    }
})

Template.registerHelper("selectedWinnerBVSX", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchBVsX && s.matchBVsX.winnerIdPlayer) {
                    if (s.matchBVsX && s.matchBVsX.winnerIdPlayer == data)
                        return true
                }
            }
        }
    } catch (e) {
    }
})

Template.registerHelper("selectedWinnerAVSY", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchAVsY && s.matchAVsY.winnerIdPlayer) {
                    if (s.matchAVsY && s.matchAVsY.winnerIdPlayer == data)
                        return true
                }
            }
        }
    } catch (e) {
    }
});

Template.registerHelper("selectDoubleWinner", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("teamDetailedDraws")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("teamDetailedDraws")
            if (det && det.matchNumber != undefined && det.roundNumber != undefined) {
                var s = Session.get("teamDetailedSCore")
                if (s && s.matchDoubles && s.matchDoubles.winnerIdTeam) {
                    if (s.matchDoubles && s.matchDoubles.winnerIdTeam == data)
                        return true
                }
            }
        }
    } catch (e) {
    }
});

