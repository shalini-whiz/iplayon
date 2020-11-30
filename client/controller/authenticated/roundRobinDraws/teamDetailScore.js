Template.teamDetailScore.onCreated(function() {

});

Template.teamDetailScore.onRendered(function() {
    if (Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) 
    {
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName")
        var det = Session.get("currentPlayerMatchDetails")
        if (det) {
            var teamAId="";
            var teamBId="";
            if (det.teamsID && det.teamsID.teamAId) {
                    teamAId = det.teamsID.teamAId
                }
            if (det.teamsID && det.teamsID.teamBId) {
                    teamBId = det.teamsID.teamBId
                }
            var s = Meteor.call("getTeamDetailScoreRR", tournamentId, eventName, teamAId, teamBId, function(e, res) {
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

Template.teamDetailScore.onDestroyed(function() {
    Session.set("teamDetailedSCore", undefined)
});

Template.teamDetailScore.helpers({

    "refreshTeamDetailedScore":function(){
        if (Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) 
        {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
                var teamAId="";
                var teamBId="";
                if (det.teamsID && det.teamsID.teamAId) {
                        teamAId = det.teamsID.teamAId
                    }
                if (det.teamsID && det.teamsID.teamBId) {
                        teamBId = det.teamsID.teamBId
                    }
                var s = Meteor.call("getTeamDetailScoreRR", tournamentId, eventName, teamAId, teamBId, function(e, res) {
                    if (res){
                        Session.set("teamDetailedSCore", res)
                                           
                    }
                })
            }
        }


    },
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
            if (Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det && det.teamsID && det.teamsID.teamAId) {
                    return det.teamsID.teamAId
                }
            }
        } catch (e) {

        }
    },
    "teamBIDMatch": function() {
        try {
            if (Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
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
            if (Session.get("teamDetailedSCore") && Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
            if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName")
                var det = Session.get("currentPlayerMatchDetails")
                if (det) {
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
    upcomingTournamentDraw: function() {
        if (Router.current().params._eventType && Router.current().params._eventType == "past")
            return false;
        else
            return true;
    },
});

Template.teamDetailScore.events({


    
    "click #printRRDetailScore":function(e){
        try{

            if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("currentPlayerMatchDetails")){
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName");
                var det = Session.get("currentPlayerMatchDetails");
                var teamAId = det.teamsID.teamAId;
                var teamBId = det.teamsID.teamBId;
                var teamDetailedDraws = Session.get("currentPlayerMatchDetails")
                var teamDetailedSCore = Session.get("teamDetailedSCore");


                Meteor.call("printRRTeamDetailedDraws",tournamentId,eventName,teamAId,teamBId,teamDetailedDraws,teamDetailedSCore,function(e,res){
                    if(res)
                        window.open("data:application/pdf;base64, " + res);
                })
            }        
        }catch(e){
        }
    },
    "click #printRRBlankDetailScore":function(e){
        try{

            if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("currentPlayerMatchDetails")){
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName");
                var det = Session.get("currentPlayerMatchDetails");
                var teamAId = det.teamsID.teamAId;
                var teamBId = det.teamsID.teamBId;
                var teamDetailedDraws = Session.get("currentPlayerMatchDetails")
                var teamDetailedSCore = Session.get("teamDetailedSCore");


                Meteor.call("printRRBlankTeamDetailedDraws",tournamentId,eventName,teamAId,teamBId,teamDetailedDraws,teamDetailedSCore,function(e,res){
                    if(res)
                        window.open("data:application/pdf;base64, " + res);
                })
            }        
        }catch(e){
        }
    },
    "click #saveRRTeamScoreDetails": function(e) {
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

            if ($("#AVSXPlayerAScoreRR1").attr("name")) {
                avsxPlayerAName = $("#AVSXPlayerAScoreRR1").attr("name").trim();
            }
            if ($("#AVSXPlayerXScoreRR1").attr("name")) {
                avsxPlayerXName = $("#AVSXPlayerXScoreRR1").attr("name").trim();
            }
            if ($("#BVSYPlayerBScoreRR1").attr("name")) {
                bvsyPlayerBName = $("#BVSYPlayerBScoreRR1").attr("name").trim();
            }
            if ($("#BVSYPlayerYScoreRR1").attr("name")) {
                bvsyPlayerYName = $("#BVSYPlayerYScoreRR1").attr("name").trim();
            }
            if ($("#BVSXPlayerBScoreRR1").attr("name")) {
                bvsxPlayerBName = $("#BVSXPlayerBScoreRR1").attr("name").trim();
            }
            if ($("#BVSXPlayerXScoreRR1").attr("name")) {
                bvsxPlayerXName = $("#BVSXPlayerXScoreRR1").attr("name").trim();
            }
            if ($("#AVSYPlayerAScoreRR1").attr("name")) {
                avsyPlayerAName = $("#AVSYPlayerAScoreRR1").attr("name").trim();
            }
            if ($("#AVSYPlayerYScoreRR1").attr("name")) {
                avsyPlayerYName = $("#AVSYPlayerYScoreRR1").attr("name").trim();
            }
            if ($("#DoublesPlayerAScoreRR1").attr("name")) {
                var doubles = $("#DoublesPlayerAScoreRR1").attr("name").split(",")
                doublesTeamAPlayerAName = doubles[0];
                doublesTeamAPlayerBName = doubles[1];
            }
            if ($("#DoublesPlayerBScoreRR1").attr("name")) {
                var doubles = $("#DoublesPlayerBScoreRR1").attr("name").split(",")
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
            if ($('#doublesWinnerIDRR option:selected').attr('id')) {
                var doublesWinner = $('#doublesWinnerIDRR option:selected').val().trim().split(",");
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
            var avsxStatus = $("#AVSXStatusRR").val().trim();
            var avsxWinner = $("#AVSXWinnerRR").val().trim();
            var avsxWinnerTeam = "1";
            if($('#AVSXWinnerRR option:selected').attr('id')){
                avsxWinnerTeam = $('#AVSXWinnerRR option:selected').attr('id').trim();
            }
            var avsxPlayerA = avsxPlayerAName;
            var avsxPlayerAScore1 = $("#AVSXPlayerAScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var avsxPlayerAScore2 = $("#AVSXPlayerAScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore3 = $("#AVSXPlayerAScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore4 = $("#AVSXPlayerAScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore5 = $("#AVSXPlayerAScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore6 = $("#AVSXPlayerAScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScore7 = $("#AVSXPlayerAScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerAScores = [avsxPlayerAScore1, avsxPlayerAScore2, avsxPlayerAScore3, avsxPlayerAScore4, avsxPlayerAScore5, avsxPlayerAScore6, avsxPlayerAScore7];
            //a vs x player x
            var avsxPlayerX = avsxPlayerXName;
            var avsxPlayerXScore1 = $("#AVSXPlayerXScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var avsxPlayerXScore2 = $("#AVSXPlayerXScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore3 = $("#AVSXPlayerXScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore4 = $("#AVSXPlayerXScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore5 = $("#AVSXPlayerXScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore6 = $("#AVSXPlayerXScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScore7 = $("#AVSXPlayerXScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsxPlayerXScores = [avsxPlayerXScore1, avsxPlayerXScore2, avsxPlayerXScore3, avsxPlayerXScore4, avsxPlayerXScore5, avsxPlayerXScore6, avsxPlayerXScore7];
            //b vs y player b
            var bvsyStatus = $("#BVSYStatusRR").val().trim();
            var bvsyWinner = $("#BVSYWinnerRR").val().trim();

            var bvsyWinnerTeam = "1";
            if($('#BVSYWinnerRR option:selected').attr('id')){
                bvsyWinnerTeam = $('#BVSYWinnerRR option:selected').attr('id').trim();
            }

            var bvsyPlayerB = bvsyPlayerBName;
            var bvsyPlayerBScore1 = $("#BVSYPlayerBScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var bvsyPlayerBScore2 = $("#BVSYPlayerBScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore3 = $("#BVSYPlayerBScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore4 = $("#BVSYPlayerBScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore5 = $("#BVSYPlayerBScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore6 = $("#BVSYPlayerBScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScore7 = $("#BVSYPlayerBScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerBScores = [bvsyPlayerBScore1, bvsyPlayerBScore2, bvsyPlayerBScore3, bvsyPlayerBScore4, bvsyPlayerBScore5, bvsyPlayerBScore6, bvsyPlayerBScore7];
            //b vs y player y
            var bvsyPlayerY = bvsyPlayerYName;
            var bvsyPlayerYScore1 = $("#BVSYPlayerYScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var bvsyPlayerYScore2 = $("#BVSYPlayerYScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore3 = $("#BVSYPlayerYScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore4 = $("#BVSYPlayerYScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore5 = $("#BVSYPlayerYScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore6 = $("#BVSYPlayerYScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScore7 = $("#BVSYPlayerYScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsyPlayerYScores = [bvsyPlayerYScore1, bvsyPlayerYScore2, bvsyPlayerYScore3, bvsyPlayerYScore4, bvsyPlayerYScore5, bvsyPlayerYScore6, bvsyPlayerYScore7];
            //b vs x player b
            var bvsxStatus = $("#BVSXStatusRR").val().trim();
            var bvsxWinner = $("#BVSXWinnerRR").val().trim();
            var bvsxWinnerTeam = "1";
            if($('#BVSXWinnerRR option:selected').attr('id')){
                bvsxWinnerTeam = $('#BVSXWinnerRR option:selected').attr('id').trim();
            }
            var bvsxPlayerB = bvsxPlayerBName;
            var bvsxPlayerBScore1 = $("#BVSXPlayerBScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var bvsxPlayerBScore2 = $("#BVSXPlayerBScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore3 = $("#BVSXPlayerBScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore4 = $("#BVSXPlayerBScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore5 = $("#BVSXPlayerBScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore6 = $("#BVSXPlayerBScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScore7 = $("#BVSXPlayerBScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerBScores = [bvsxPlayerBScore1, bvsxPlayerBScore2, bvsxPlayerBScore3, bvsxPlayerBScore4, bvsxPlayerBScore5, bvsxPlayerBScore6, bvsxPlayerBScore7];
            //b vs x player x
            var bvsxPlayerX = bvsxPlayerXName;
            var bvsxPlayerXScore1 = $("#BVSXPlayerXScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var bvsxPlayerXScore2 = $("#BVSXPlayerXScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore3 = $("#BVSXPlayerXScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore4 = $("#BVSXPlayerXScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore5 = $("#BVSXPlayerXScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore6 = $("#BVSXPlayerXScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScore7 = $("#BVSXPlayerXScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var bvsxPlayerXScores = [bvsxPlayerXScore1, bvsxPlayerXScore2, bvsxPlayerXScore3, bvsxPlayerXScore4, bvsxPlayerXScore5, bvsxPlayerXScore6, bvsxPlayerXScore7];
            //a vs y player a
            var avsyStatus = $("#AVSYStatusRR").val().trim();
            var avsyWinner = $("#AVSYWinnerRR").val().trim();
            var avsyWinnerTeam = "1";
            if($('#AVSYWinnerRR option:selected').attr('id')){
                avsyWinnerTeam = $('#AVSYWinnerRR option:selected').attr('id').trim();
            }
            var avsyPlayerA = avsyPlayerAName;
            var avsyPlayerAScore1 = $("#AVSYPlayerAScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var avsyPlayerAScore2 = $("#AVSYPlayerAScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore3 = $("#AVSYPlayerAScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore4 = $("#AVSYPlayerAScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore5 = $("#AVSYPlayerAScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore6 = $("#AVSYPlayerAScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScore7 = $("#AVSYPlayerAScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerAScores = [avsyPlayerAScore1, avsyPlayerAScore2, avsyPlayerAScore3, avsyPlayerAScore4, avsyPlayerAScore5, avsyPlayerAScore6, avsyPlayerAScore7];
            //a vs y player y
            var avsyPlayerY = avsyPlayerYName;
            var avsyPlayerYScore1 = $("#AVSYPlayerYScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString()
            var avsyPlayerYScore2 = $("#AVSYPlayerYScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore3 = $("#AVSYPlayerYScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore4 = $("#AVSYPlayerYScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore5 = $("#AVSYPlayerYScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore6 = $("#AVSYPlayerYScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScore7 = $("#AVSYPlayerYScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var avsyPlayerYScores = [avsyPlayerYScore1, avsyPlayerYScore2, avsyPlayerYScore3, avsyPlayerYScore4, avsyPlayerYScore5, avsyPlayerYScore6, avsyPlayerYScore7];
            //doubles
            //player a
            var doublesStatus = $("#doublesMatchStatusRR").val().trim();
            var winnerIdTeamDoubles = "1";
            if($('#AVSYWinnerRR option:selected').attr('id')){
                winnerIdTeamDoubles = $('#doublesWinnerIDRR option:selected').attr('id').trim();
            }
            var teamAD1PlayerId = doublesTeamAPlayerAName
            var teamAD2PlayerId = doublesTeamAPlayerBName
            var winnerD1PlayerIdA = winnerD1PlayerId;
            var winnerD2PlayerIdA = winnerD2PlayerId;
            var doublesSetScoreA1 = $("#DoublesPlayerAScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA2 = $("#DoublesPlayerAScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA3 = $("#DoublesPlayerAScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA4 = $("#DoublesPlayerAScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA5 = $("#DoublesPlayerAScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA6 = $("#DoublesPlayerAScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreA7 = $("#DoublesPlayerAScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var setScoresADoubles = [doublesSetScoreA1, doublesSetScoreA2, doublesSetScoreA3, doublesSetScoreA4, doublesSetScoreA5, doublesSetScoreA6, doublesSetScoreA7];
            //player b
            var teamBD1PlayerId = doublesTeamBPlayerAName
            var teamBD2PlayerId = doublesTeamBPlayerBName;
            var doublesSetScoreB1 = $("#DoublesPlayerBScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB2 = $("#DoublesPlayerBScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB3 = $("#DoublesPlayerBScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB4 = $("#DoublesPlayerBScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB5 = $("#DoublesPlayerBScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB6 = $("#DoublesPlayerBScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '').toString();
            var doublesSetScoreB7 = $("#DoublesPlayerBScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '').toString();
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

            var inverse_avsxDATA = {
                playerAID: avsxPlayerX,
                playerBID: avsxPlayerA,
                setScoresA: avsxPlayerXScores,
                setScoresB: avsxPlayerAScores,
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

            var inverse_avsyDATA = {
                playerAID: bvsxPlayerX,
                playerBID: bvsxPlayerB,
                setScoresA: bvsxPlayerXScores,
                setScoresB: bvsxPlayerBScores,
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

            var inverse_bvsxDATA= {
                playerAID: avsyPlayerY,
                playerBID: avsyPlayerA,
                setScoresA: avsyPlayerYScores,
                setScoresB: avsyPlayerAScores,
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

            var inverse_bvsyDATA = {
                playerAID: bvsyPlayerY,
                playerBID: bvsyPlayerB,
                setScoresA: bvsyPlayerYScores,
                setScoresB: bvsyPlayerBScores,
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

            var inverse_doublesDATA = {
                teamAD1PlayerId: teamBD1PlayerId,
                teamAD2PlayerId: teamBD2PlayerId,
                teamBD1PlayerId: teamAD1PlayerId,
                teamBD2PlayerId: teamAD2PlayerId,
                matchType: doublesStatus,
                winnerIdTeam: winnerIdTeamDoubles,
                winnerD1PlayerId: winnerD1PlayerIdA,
                winnerD2PlayerId: winnerD2PlayerIdA,
                setScoresA: setScoresBDoubles,
                setScoresB: setScoresADoubles
            }

            if (Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName");
                var det = Session.get("currentPlayerMatchDetails");
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

                if (det && det.teamsID) {
                   
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

                 var inverse_teamDET = {
                    teamAID: teamBID,
                    teamBID: teamAID,
                    matchAVSX: inverse_avsxDATA,
                    matchBVsY: inverse_bvsyDATA,
                    matchBVsX: inverse_bvsxDATA,
                    matchAVsY: inverse_avsyDATA,
                    matchDoubles: inverse_doublesDATA,
                    finalTeamWinner: finalTeamWinner,
                    teamMatchType: teamMatchType
                }

                var mainDATA = {
                    tournamentId: tournamentId,
                    eventName: eventName,
                    teamDET: teamDET,
                    teamDETReverse:inverse_teamDET
                }


                var setType = "notPlayed";
                var teamWinnerId = "1"
                var teamName = "1"
                var teamType = "1";

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

                //updateTeamDetailedScoresToMatchCollec(teamSetScores, curMatchRec, setType, teamWinnerId, teamName, teamType)

                var xData = {};
                xData["setType"] = setType;
                xData["teamWinnerId"] = teamWinnerId;
                xData["teamName"] = teamName;
                xData["teamType"] = teamType;
                xData["teamAId"] =  teamAID;
                xData["teamBId"] =  teamBID;

                Meteor.call("updateTeamDetailScoreRR", mainDATA,Session.get("currentPlayerMatchDetails"),Session.get("currentPlayerMatchID"),xData,function(e, res) {
                    if (e) {
                    }
                    if (res) {
                        Session.set("roundRobinTeamDraws",res);           
                        $("#teamDetailScore").modal('hide')
                        $( '.modal-backdrop' ).remove();
                        $("#teamDrawsDetailsPopUp").empty();


                        $("#teamDrawsCapturePopUp").empty();
                        Blaze.render(Template.teamDrawsCapture, $("#teamDrawsCapturePopUp")[0]);
                            $("#teamDrawsCapture").modal({
                                backdrop: 'static',
                                keyboard:false
                        });  


                    }
                });
            }
        } catch (e) {

        }
    },
    "click #cancelTeamSpecForm":function(e){
        try{
            e.preventDefault();
            $("#teamDetailScore").modal('hide')
            $( '.modal-backdrop' ).remove();
            $("#teamDrawsDetailsPopUp").empty();


            $("#teamDrawsCapturePopUp").empty();
            Blaze.render(Template.teamDrawsCapture, $("#teamDrawsCapturePopUp")[0]);
                $("#teamDrawsCapture").modal({
                    backdrop: 'static',
                    keyboard:false
            });   

        }catch(e){

        }
    },
    "click #closeTeamDetailScoreRR":function(e){
        try{
            e.preventDefault();
            $("#teamDetailScore").modal('hide')
            $( '.modal-backdrop' ).remove();
            $("#teamDrawsDetailsPopUp").empty();

            $("#teamDrawsCapturePopUp").empty();
            Blaze.render(Template.teamDrawsCapture, $("#teamDrawsCapturePopUp")[0]);
                $("#teamDrawsCapture").modal({
                    backdrop: 'static',
                    keyboard:false
            }); 

        }catch(e){

        }
    },
    "keyup [id^=AVSXPlayerAScoreRR]": function(event) {
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

   
    "keyup [id^=AVSXPlayerXScoreRR]":function(event){
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
    "keyup [id^=BVSYPlayerBScoreRR]":function(event){
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
    "keyup [id^=BVSYPlayerYScoreRR]":function(event){
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
    "keyup [id^=BVSXPlayerBScoreRR]":function(event){
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
    "keyup [id^=BVSXPlayerXScoreRR]":function(event){
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
    "keyup [id^=AVSYPlayerAScoreRR]":function(event){
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
    "keyup [id^=AVSYPlayerYScoreRR]":function(event){
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
    "keyup [id^=DoublesPlayerAScoreRR]":function(event){
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
    "keyup [id^=DoublesPlayerBScoreRR]":function(event){ 
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


Template.registerHelper("findThePlayerNameRR", function(data) {
    try {
        if (data) {
            var s = ReactiveMethod.call("findThePlayerName", data,Session.get("tournamentId"));
            if (s)
                return s
        }
    } catch (e) {

    }
})

Template.registerHelper("findTheTeamNamedrawRR", function(data) {
    try {
        if (data) {
            //findTheTeamNamedrawRR
            var result = ReactiveMethod.call("fetchRRUserName",data,Session.get("tournamentId"),"team");
            if(result && result.teamName)
                return result.teamName;
            /*var playerTeamInfo = playerTeams.findOne({"_id":data});
            if(playerTeamInfo)
            {
                if(playerTeamInfo.teamName)
                    return playerTeamInfo.teamName;
            }    
            */    
        }
    } catch (e) {

    }
});

Template.registerHelper("findIfUltimateWinnerRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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


Template.registerHelper("findteamStatusTypeRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("findAVSXStatusTypeRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("findBVSYStatusTypeRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("findDoublesStatusTypeRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("findAVSYStatusTypeRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("findBVSXStatusTypeRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det ) {
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

Template.registerHelper("selectedWinnerAVSXRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("selectedWinnerBVSYRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("selectedWinnerBVSXRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("selectedWinnerAVSYRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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

Template.registerHelper("selectDoubleWinnerRR", function(data) {
    try {
        if (Session.get("teamDetailedSCore") && Session.get("tournamentId") && Session.get("eventName") && Session.get("currentPlayerMatchDetails")) {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName")
            var det = Session.get("currentPlayerMatchDetails")
            if (det) {
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
