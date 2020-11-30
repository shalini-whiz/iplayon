Meteor.methods({

	"getTeamDetailScoreRR": function(tournamentId, eventName,teamAId,teamBId) {
        try {

            var s = teamRRDetailScore.aggregate([{
                $match: {
                    tournamentId: tournamentId,
                    eventName: eventName
                }
            }, {
                $unwind: "$teamDetailScore"
            }, {
                $match: {
                    "teamDetailScore.teamAID": teamAId,
                    "teamDetailScore.teamBID": teamBId
                }
            }, {
                $project: {
                    teamDetailScore: "$teamDetailScore"
                }
            }]);

            if (s && s[0] && s[0].teamDetailScore) {
                return s[0].teamDetailScore
            }
        } catch (e) {


        }
    },

	'insertTeamDetailScore': function(tournamentId, eventName, data,inverseData) {
        try {
            var eveDet = events.findOne({
                "_id":tournamentId
            }); 
            if(eveDet==undefined){
                eveDet = pastEvents.findOne({
                    "_id":tournamentId
                })
            }

            if(eveDet&&eveDet.eventOrganizer){
                if(eveDet.eventOrganizer==this.userId){
                    var teamDetScore = {                    
                            teamAID: data.teamAID,
                            teamBID: data.teamBID,
                            finalTeamWinner:"1",
                            teamMatchType:"notPlayed"
                        }

                    var inverse_TeamDetScore = {                    
                            teamAID: data.teamBID,
                            teamBID: data.teamAID,
                            finalTeamWinner:"1",
                            teamMatchType:"notPlayed"
                        }

                   	
                     
                    var matchAVSX = {
                            playerAID: data.teamAPlayerAId,
                            playerBID: data.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                   /* var  inverse_matchAVSX = {
                    		playerAID: data.teamBPlayerAId,
                            playerBID: data.teamAPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                    }*/

                     var  inverse_matchAVSX = {
                    		playerAID: inverseData.teamAPlayerAId,
                            playerBID: inverseData.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                    }

                   

                        //matchBVsY
                        //b team a player b
                        //y team b player b
                    var matchBVsY = {
                            playerAID: data.teamAPlayerBId,
                            playerBID: data.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                    /*var inverse_matchBVsY = {
                    		playerAID: data.teamBPlayerBId,
                            playerBID: data.teamAPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",


                    }*/

                    var inverse_matchBVsY = {
                            playerAID: inverseData.teamAPlayerBId,
                            playerBID: inverseData.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }


                   


                        //matchBVsX
                        //b team a player b
                        //x team b player a
                    var matchBVsX = {
                            playerAID: data.teamAPlayerBId,
                            playerBID: data.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }


                    /*var inverse_matchBVsX = {
                            playerAID: data.teamBPlayerAId,
                            playerBID: data.teamAPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }
					*/

					  var inverse_matchBVsX = {
                            playerAID: inverseData.teamAPlayerBId,
                            playerBID: inverseData.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                   
                    var matchAVsY = {
                            playerAID: data.teamAPlayerAId,
                            playerBID: data.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                    /*var inverse_matchAVsY = {
                            playerAID: data.teamBPlayerBId,
                            playerBID: data.teamAPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }*/

 					var inverse_matchAVsY = {
                            playerAID: inverseData.teamAPlayerAId,
                            playerBID: inverseData.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }
                   
                        //match doubles
                    var matchDoubles = {
                        teamAD1PlayerId: data.teamADoubles1PlayerId,
                        teamAD2PlayerId: data.teamADoubles2PlayerId,
                        teamBD1PlayerId: data.teamBDoubles1PlayerId,
                        teamBD2PlayerId: data.teamBDoubles2PlayerId,
                        matchType: "notPlayed",
                        winnerIdTeam: "1",
                        winnerD1PlayerId: '1',
                        winnerD2PlayerId: "1",
                        setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                        setScoresB: ["0", "0", "0", "0", "0", "0", "0"]
                    }


                    /*var inverse_matchDoubles = {
                        teamAD1PlayerId: data.teamBDoubles1PlayerId,
                        teamAD2PlayerId: data.teamBDoubles2PlayerId,
                        teamBD1PlayerId: data.teamADoubles1PlayerId,
                        teamBD2PlayerId: data.teamADoubles2PlayerId,
                        matchType: "notPlayed",
                        winnerIdTeam: "1",
                        winnerD1PlayerId: '1',
                        winnerD2PlayerId: "1",
                        setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                        setScoresB: ["0", "0", "0", "0", "0", "0", "0"]
                    }*/

                    var inverse_matchDoubles = {
                        teamAD1PlayerId: inverseData.teamADoubles1PlayerId,
                        teamAD2PlayerId: inverseData.teamADoubles2PlayerId,
                        teamBD1PlayerId: inverseData.teamBDoubles1PlayerId,
                        teamBD2PlayerId: inverseData.teamBDoubles2PlayerId,
                        matchType: "notPlayed",
                        winnerIdTeam: "1",
                        winnerD1PlayerId: '1',
                        winnerD2PlayerId: "1",
                        setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                        setScoresB: ["0", "0", "0", "0", "0", "0", "0"]
                    }



                   



                    teamDetScore.matchAVSX = matchAVSX;
                    teamDetScore.matchBVsY = matchBVsY;
                    teamDetScore.matchBVsX = matchBVsX;
                    teamDetScore.matchAVsY = matchAVsY;
                    teamDetScore.matchDoubles = matchDoubles;



                    inverse_TeamDetScore.matchAVSX = inverse_matchAVSX;
                    inverse_TeamDetScore.matchAVsY = inverse_matchAVsY
                    inverse_TeamDetScore.matchBVsX = inverse_matchBVsX;
                    inverse_TeamDetScore.matchBVsY = inverse_matchBVsY;
                    inverse_TeamDetScore.matchDoubles = inverse_matchDoubles;


                    var teamDetailedScores = [];
                    teamDetailedScores.push(teamDetScore);
                    teamDetailedScores.push(inverse_TeamDetScore);


                    var l = teamRRDetailScore.insert({
                        tournamentId: tournamentId,
                        eventName: eventName,
                        teamDetailScore: teamDetailedScores
                    });

                    if (l) {
                        return true
                    }
                } else return false
            }else{
                return false
            }
        } catch (e) {


        }
    },
    'updateNewTeamDetailScore': function(tournamentId, eventName, data,inverseData) {
        try {
            var eveDet = events.findOne({
                "_id":tournamentId
            }); 
            if(eveDet==undefined){
                eveDet = pastEvents.findOne({
                    "_id":tournamentId
                })
            }

            if(eveDet&&eveDet.eventOrganizer){
                if(eveDet.eventOrganizer==this.userId){
                    var teamDetScore = {                    
                            teamAID: data.teamAID,
                            teamBID: data.teamBID,
                            finalTeamWinner:"1",
                            teamMatchType:"notPlayed"
                        }

                    var inverse_TeamDetScore = {                    
                            teamAID: data.teamBID,
                            teamBID: data.teamAID,
                            finalTeamWinner:"1",
                            teamMatchType:"notPlayed"
                        }

                   	
                     
                    var matchAVSX = {
                            playerAID: data.teamAPlayerAId,
                            playerBID: data.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                    /*var  inverse_matchAVSX = {
                    		playerAID: data.teamBPlayerAId,
                            playerBID: data.teamAPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                    }*/

                     var inverse_matchAVSX = {
                            playerAID: inverseData.teamAPlayerAId,
                            playerBID: inverseData.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }
                   

                        //matchBVsY
                        //b team a player b
                        //y team b player b
                    var matchBVsY = {
                            playerAID: data.teamAPlayerBId,
                            playerBID: data.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                    /*var inverse_matchBVsY = {
                    		playerAID: data.teamBPlayerBId,
                            playerBID: data.teamAPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",


                    }*/

                    var inverse_matchBVsY = {
                            playerAID: inverseData.teamAPlayerBId,
                            playerBID: inverseData.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }
                   


                        //matchBVsX
                        //b team a player b
                        //x team b player a
                    var matchBVsX = {
                            playerAID: data.teamAPlayerBId,
                            playerBID: data.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }


                    /*var inverse_matchBVsX = {
                            playerAID: data.teamBPlayerAId,
                            playerBID: data.teamAPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }*/

                    var inverse_matchBVsX = {
                            playerAID: inverseData.teamAPlayerBId,
                            playerBID: inverseData.teamBPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                   
                    var matchAVsY = {
                            playerAID: data.teamAPlayerAId,
                            playerBID: data.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                    /*var inverse_matchAVsY = {
                            playerAID: data.teamBPlayerBId,
                            playerBID: data.teamAPlayerAId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }*/

                    var inverse_matchAVsY = {
                            playerAID: inverseData.teamAPlayerAId,
                            playerBID: inverseData.teamBPlayerBId,
                            setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                            setScoresB: ["0", "0", "0", "0", "0", "0", "0"],
                            winnerIdPlayer: "1",
                            matchType: "notPlayed",
                            winnerIdTeam: "1",
                        }

                   
                        //match doubles
                    var matchDoubles = {
                        teamAD1PlayerId: data.teamADoubles1PlayerId,
                        teamAD2PlayerId: data.teamADoubles2PlayerId,
                        teamBD1PlayerId: data.teamBDoubles1PlayerId,
                        teamBD2PlayerId: data.teamBDoubles2PlayerId,
                        matchType: "notPlayed",
                        winnerIdTeam: "1",
                        winnerD1PlayerId: '1',
                        winnerD2PlayerId: "1",
                        setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                        setScoresB: ["0", "0", "0", "0", "0", "0", "0"]
                    }


                    /*var inverse_matchDoubles = {
                        teamAD1PlayerId: data.teamBDoubles1PlayerId,
                        teamAD2PlayerId: data.teamBDoubles2PlayerId,
                        teamBD1PlayerId: data.teamADoubles1PlayerId,
                        teamBD2PlayerId: data.teamADoubles2PlayerId,
                        matchType: "notPlayed",
                        winnerIdTeam: "1",
                        winnerD1PlayerId: '1',
                        winnerD2PlayerId: "1",
                        setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                        setScoresB: ["0", "0", "0", "0", "0", "0", "0"]
                    }*/

                    var inverse_matchDoubles = {
                        teamAD1PlayerId: inverseData.teamADoubles1PlayerId,
                        teamAD2PlayerId: inverseData.teamADoubles2PlayerId,
                        teamBD1PlayerId: inverseData.teamBDoubles1PlayerId,
                        teamBD2PlayerId: inverseData.teamBDoubles2PlayerId,
                        matchType: "notPlayed",
                        winnerIdTeam: "1",
                        winnerD1PlayerId: '1',
                        winnerD2PlayerId: "1",
                        setScoresA: ["0", "0", "0", "0", "0", "0", "0"],
                        setScoresB: ["0", "0", "0", "0", "0", "0", "0"]
                    }

                   



                    teamDetScore.matchAVSX = matchAVSX;
                    teamDetScore.matchBVsY = matchBVsY;
                    teamDetScore.matchBVsX = matchBVsX;
                    teamDetScore.matchAVsY = matchAVsY;
                    teamDetScore.matchDoubles = matchDoubles;



                    inverse_TeamDetScore.matchAVSX = inverse_matchAVSX;
                    inverse_TeamDetScore.matchAVsY = inverse_matchAVsY
                    inverse_TeamDetScore.matchBVsX = inverse_matchBVsX;
                    inverse_TeamDetScore.matchBVsY = inverse_matchBVsY;
                    inverse_TeamDetScore.matchDoubles = inverse_matchDoubles;


                    var teamDetailedScores = [];
                    teamDetailedScores.push(teamDetScore);
                    teamDetailedScores.push(inverse_TeamDetScore);


                    var transc = teamRRDetailScore.update({
                            tournamentId: tournamentId,
                            eventName: eventName,
                            }, {
                                $push: {
                                    "teamDetailScore": teamDetScore
                                }
                            });


                    var inverse_transc = teamRRDetailScore.update({
                            tournamentId: tournamentId,
                            eventName: eventName,
                            }, {
                                $push: {
                                    "teamDetailScore": inverse_TeamDetScore
                                }
                            });

                    if (transc || inverse_transc) {
                        return true
                    }
                } else return false
            }else{
                return false
            }
        } catch (e) {
        }
    },

    "updateTeamDetailScoreRR":async function(xData,teamData,id,collecData){
         
            var eveDet = events.findOne({
                "_id":xData.tournamentId
            }); 
            if(eveDet==undefined){
                eveDet = pastEvents.findOne({
                    "_id":xData.tournamentId
                })
            }
            if(eveDet&&eveDet.eventOrganizer){
                if(eveDet.eventOrganizer==this.userId){
                    var avsxFinalScore = {};
                    var bvsxFinalScore = {};
                    var bvsyFinalScore = {};
                    var avsyFinalScore = {};
                    var doublesFinalScore = {};

                    if(xData&&xData.teamDET){
                        //match a vs x
                        var teamDETails = xData.teamDET;
                        //avsx
                        if(teamDETails.matchAVSX){
                            var matchAVSXDEt = teamDETails.matchAVSX;
                            if(matchAVSXDEt.setScoresA&&matchAVSXDEt.setScoresB&&matchAVSXDEt.playerAID
                                &&matchAVSXDEt.playerBID&&teamDETails.teamAID&&teamDETails.teamBID){
                                var setA = matchAVSXDEt.setScoresA;
                                var setB = matchAVSXDEt.setScoresB;
                                var playerAID = matchAVSXDEt.playerAID;
                                var playerBID = matchAVSXDEt.playerBID;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore",setA,setB,playerAID,playerBID,teamAID,teamBID)
                                try{
                                    if(res){
                                        avsxFinalScore = res;
                                    }
                                }catch(e){}
                            }
                        }

                        //bvsy
                        if(teamDETails.matchBVsY){
                            var matchBVsYDEt = teamDETails.matchBVsY
                            if(matchBVsYDEt.setScoresA&&matchBVsYDEt.setScoresB&&matchBVsYDEt.playerAID
                                &&matchBVsYDEt.playerBID&&teamDETails.teamAID&&teamDETails.teamBID){
                                var setA = matchBVsYDEt.setScoresA;
                                var setB = matchBVsYDEt.setScoresB;
                                var playerAID = matchBVsYDEt.playerAID;
                                var playerBID = matchBVsYDEt.playerBID;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore",setA,setB,playerAID,playerBID,teamAID,teamBID)
                                try{
                                    if(res){
                                        bvsyFinalScore = res;
                                    }
                                }catch(e){}
                            }
                        }

                        //b vs x
                        if(teamDETails.matchBVsX){
                            var matchBVsXDEt = teamDETails.matchBVsX
                            if(matchBVsXDEt.setScoresA&&matchBVsXDEt.setScoresB&&matchBVsXDEt.playerAID
                                &&matchBVsXDEt.playerBID&&teamDETails.teamAID&&teamDETails.teamBID){
                                var setA = matchBVsXDEt.setScoresA;
                                var setB = matchBVsXDEt.setScoresB;
                                var playerAID = matchBVsXDEt.playerAID;
                                var playerBID = matchBVsXDEt.playerBID;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore",setA,setB,playerAID,playerBID,teamAID,teamBID)
                                try{
                                    if(res){
                                        bvsxFinalScore = res;
                                    }
                                }catch(e){}
                            }
                        }

                        //a vs y
                        if(teamDETails.matchAVsY){
                            var matchAVsYDEt = teamDETails.matchAVsY
                            if(matchAVsYDEt.setScoresA&&matchAVsYDEt.setScoresB&&matchAVsYDEt.playerAID
                                &&matchAVsYDEt.playerBID&&teamDETails.teamAID&&teamDETails.teamBID){
                                var setA = matchAVsYDEt.setScoresA;
                                var setB = matchAVsYDEt.setScoresB;
                                var playerAID = matchAVsYDEt.playerAID;
                                var playerBID = matchAVsYDEt.playerBID;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore",setA,setB,playerAID,playerBID,teamAID,teamBID)
                                try{
                                    if(res){
                                        avsyFinalScore = res
                                    }
                                }catch(e){

                                }
                            }
                        }

                        //doubles
                        if(teamDETails.matchDoubles){
                            var matchDoublesDEt = teamDETails.matchDoubles
                            if(matchDoublesDEt.setScoresA&&matchDoublesDEt.setScoresB&&teamDETails.teamAID&&teamDETails.teamBID){
                                var setA = matchDoublesDEt.setScoresA;
                                var setB = matchDoublesDEt.setScoresB;
                                var teamAID = teamDETails.teamAID;
                                var teamBID = teamDETails.teamBID;
                                var res = await Meteor.call("findTheMatchScore",setA,setB,"1","1",teamAID,teamBID)
                                try{
                                    if(res){
                                        doublesFinalScore = res
                                    }
                                }catch(e){}
                            }
                        }
                        
                        //avalue
                        if(avsxFinalScore&&avsxFinalScore.AValue!=undefined){
                            avsxFinalScore.AValue = avsxFinalScore.AValue
                        }
                        else{
                            avsxFinalScore.AValue = 0;
                        }

                        if(bvsyFinalScore&&bvsyFinalScore.AValue!=undefined){
                            bvsyFinalScore.AValue = bvsyFinalScore.AValue
                        }
                        else{
                            bvsyFinalScore.AValue = 0;
                        }

                        if(doublesFinalScore&&doublesFinalScore.AValue!=undefined){
                            doublesFinalScore.AValue = doublesFinalScore.AValue
                        }
                        else{
                            doublesFinalScore.AValue = 0;
                        }

                        if(bvsxFinalScore&&bvsxFinalScore.AValue!=undefined){
                            bvsxFinalScore.AValue = bvsxFinalScore.AValue
                        }
                        else{
                            bvsxFinalScore.AValue = 0;
                        }

                        if(avsyFinalScore&&avsyFinalScore.AValue!=undefined){
                            avsyFinalScore.AValue = avsyFinalScore.AValue
                        }
                        else{
                            avsyFinalScore.AValue = 0;
                        }

                        //bvalue
                        if(avsxFinalScore&&avsxFinalScore.BValue!=undefined){
                            avsxFinalScore.BValue = avsxFinalScore.BValue
                        }
                        else{
                            avsxFinalScore.BValue = 0;
                        }

                        if(bvsyFinalScore&&bvsyFinalScore.BValue!=undefined){
                            bvsyFinalScore.BValue = bvsyFinalScore.BValue
                        }
                        else{
                            bvsyFinalScore.BValue = 0;
                        }

                        if(doublesFinalScore&&doublesFinalScore.BValue!=undefined){
                            doublesFinalScore.BValue = doublesFinalScore.BValue
                        }
                        else{
                            doublesFinalScore.BValue = 0;
                        }

                        if(bvsxFinalScore&&bvsxFinalScore.BValue!=undefined){
                            bvsxFinalScore.BValue = bvsxFinalScore.BValue
                        }
                        else{
                            bvsxFinalScore.BValue = 0;
                        }

                        if(avsyFinalScore&&avsyFinalScore.AValue!=undefined){
                            avsyFinalScore.AValue = avsyFinalScore.AValue
                        }
                        else{
                            avsyFinalScore.AValue = 0;
                        }

                        var teamScoreSetA = [avsxFinalScore.AValue,bvsyFinalScore.AValue,doublesFinalScore.AValue,bvsxFinalScore.AValue,avsyFinalScore.AValue,0,0];
                        var teamScoreSetB = [avsxFinalScore.BValue,bvsyFinalScore.BValue,doublesFinalScore.BValue,bvsxFinalScore.BValue,avsyFinalScore.BValue,0,0];
                        
                        var teamScoresSETS = {
                            setScoresA:teamScoreSetA,
                            setScoresB:teamScoreSetB
                        }

                        var inverse_teamScoresSETS = {
                            setScoresA:teamScoreSetB,
                            setScoresB:teamScoreSetA
                        }
						var playerAWinCount = 0;
            			var playerBWinCount = 0;
            			var winnerID = "";
            			var loserID = "";
                        for(var m =0; m<teamScoreSetA.length;m++)
			            {
			            	
			            	if(teamScoreSetA[m]>teamScoreSetB[m])
			            		playerAWinCount = playerAWinCount + 1;
			            	else if(teamScoreSetB[m] > teamScoreSetA[m])
			            		playerBWinCount = playerBWinCount + 1;
			            	
			            }
			            if(parseInt(playerAWinCount)>parseInt(playerBWinCount)){
			                winnerID = xData.teamDET.teamAID;
			                loserID = xData.teamDET.teamBID;
			            }
			            else if(parseInt(playerBWinCount)>parseInt(playerAWinCount)){
			                winnerID = xData.teamDET.teamAID
			                loserID = xData.teamDET.teamBID
			            }

			            var setWins = {"teamA":playerAWinCount,"teamB":playerBWinCount};
			            var inverse_setWins = {"teamA":playerBWinCount,"teamB":playerAWinCount};


                        var r = teamRRDetailScore.update({
                            tournamentId: xData.tournamentId,
                            eventName: xData.eventName,
                            teamDetailScore: {
                                $elemMatch: {
                                    teamAID: xData.teamDET.teamAID,
                                    teamBID: xData.teamDET.teamBID
                                }
                            }
                        }, {
                            $set: {
                               "teamDetailScore.$": xData.teamDET
                            }
                        });


                        var r = teamRRDetailScore.update({
                            tournamentId: xData.tournamentId,
                            eventName: xData.eventName,
                            teamDetailScore: {
                                $elemMatch: {
                                    teamAID: xData.teamDETReverse.teamAID,
                                    teamBID: xData.teamDETReverse.teamBID
                                }
                            }
                        }, {
                            $set: {
                               "teamDetailScore.$": xData.teamDETReverse
                            }
                        });


                        /* roundRobinTeamEvents.update({"_id":id,
							"groupDetails": {
                                $elemMatch: {
                                    rowNo: teamData.rowNo,
                                    colNo: teamData.colNo
                                }
                            }},
							{$set:{
								"groupDetails.$.winnerID":winnerID,
								"groupDetails.$.loserID":loserID,
								"groupDetails.$.scores":teamScoresSETS,
								"groupDetails.$.setWins":setWins,
								"groupDetails.$.status":"completed"
							}})

							roundRobinTeamEvents.update({"_id":id,
								"groupDetails": {
					                                $elemMatch: {
					                                    rowNo: teamData.colNo,
					                                    colNo: teamData.rowNo
					                                }
					                            }},
								{$set:{
									"groupDetails.$.winnerID":winnerID,
									"groupDetails.$.loserID":loserID,
									"groupDetails.$.scores":inverse_teamScoresSETS,
									"groupDetails.$.setWins":inverse_setWins,
									"groupDetails.$.status":"completed"
								}})
						*/
						var  completedData = {};
						completedData["winnerID"] = winnerID;
						completedData["loserID"] = loserID;
						completedData["teamScoresSETS"] = teamScoresSETS;
						completedData["inverse_teamScoresSETS"] = inverse_teamScoresSETS;
						completedData["setWins"] = setWins;
						completedData["inverse_setWins"] = inverse_setWins;

						var aa = await Meteor.call("updateRRTeamMatchRecord",id,collecData,teamData.rowNo,teamData.colNo,completedData);
                        
                        
                        var matchRecords = roundRobinTeamEvents.find(
							{"tournamentId":xData.tournamentId,"eventName":xData.eventName},
							{
								sort:{
									groupNumber: 1
								}
							}).fetch();
		    			return matchRecords;

                        //return teamScoresSETS;
                    }
                }else return false
            }else return false
        
    },
    "updateRRTeamMatchRecord":function(id,xData,rowNo,colNo,completedData)
    {
    	try{
    		var setType = xData.setType;
    		var teamType = xData.teamType;
    		var matchStatus = "";
    		var winner = "";
    		var winnerId = "";
    		var loserId = "";

    		if(setType.toLowerCase() == "notplayed")
    		{
            	matchStatus = 'yetToPlay';
        	}
        	if (setType == "bye") 
        	{
	            var loserID = "";
	            var winnerID = "";
	            var setWins = {};
				var inverse_setWins = {};
				var teamScoreSetA = [0,0,0,0,0,0,0];
	            var teamScoreSetB = [0,0,0,0,0,0,0];
	            var teamScoresSETS = {
	                setScoresA:teamScoreSetA,
	                setScoresB:teamScoreSetB
	            }

	            var inverse_teamScoresSETS = {
	                setScoresA:teamScoreSetB,
	                setScoresB:teamScoreSetA
	            }

	            if (teamType == "TeamA") 
	            {
	                loserID = xData.teamBId;
	                winnerID = xData.teamAId;
	                setWins = {"teamA":3,"teamB":1};
					inverse_setWins = {"teamA":1,"teamB":3};
	            } 
	            else if (teamType == "TeamB") 
	            {
	                loserID = xData.teamAId;
	                winnerID = xData.teamBId;
	                setWins = {"teamA":1,"teamB":3};
					inverse_setWins = {"teamA":3,"teamB":1};
	            }
                else
                {
                    loserID = "";
                    winnerID = "";
                    setWins = {"teamA":0,"teamB":0};
                    inverse_setWins = {"teamA":0,"teamB":0};
                }

            	roundRobinTeamEvents.update({"_id":id,
					"groupDetails": {
	                    $elemMatch: {
	                        "rowNo": rowNo,
	                        "colNo": colNo
	                    }
	                }},
					{$set:{
						"groupDetails.$.winnerID":winnerID,
						"groupDetails.$.loserID":loserID,
						"groupDetails.$.scores":teamScoresSETS,
						"groupDetails.$.setWins":setWins,
						"groupDetails.$.status":"bye"
					}}
				)

				roundRobinTeamEvents.update({"_id":id,
					"groupDetails": {
						$elemMatch: {
						    rowNo: colNo,
						    colNo: rowNo
						}
					}},
					{$set:{
						"groupDetails.$.winnerID":winnerID,
						"groupDetails.$.loserID":loserID,
						"groupDetails.$.scores":inverse_teamScoresSETS,
						"groupDetails.$.setWins":inverse_setWins,
						"groupDetails.$.status":"bye"
					}}
				)

        	}
	        if (setType == "walkover") 
	        {
	            var loserID = "";
		        var winnerID = "";
		        var setWins = {};
				var inverse_setWins = {};
				var teamScoreSetA = [0,0,0,0,0,0,0];
		        var teamScoreSetB = [0,0,0,0,0,0,0];
		        var teamScoresSETS = {
		            setScoresA:teamScoreSetA,
		            setScoresB:teamScoreSetB
		        }

		        var inverse_teamScoresSETS = {
		            setScoresA:teamScoreSetB,
		            setScoresB:teamScoreSetA
		        }

		        if (teamType == "TeamA") 
		        {
		            loserID = xData.teamBId;
		            winnerID = xData.teamAId;
		            setWins = {"teamA":3,"teamB":0};
					inverse_setWins = {"teamA":0,"teamB":3};
		        } 
		        else if (teamType == "TeamB") 
		        {
		            loserID = xData.teamAId;
		            winnerID = xData.teamBId;
		            setWins = {"teamA":0,"teamB":3};
					inverse_setWins = {"teamA":3,"teamB":0};
		        }
                else
                {
                    loserID = "";
                    winnerID = "";
                    setWins = {"teamA":0,"teamB":0};
                    inverse_setWins = {"teamA":0,"teamB":0};
                }
	            roundRobinTeamEvents.update({"_id":id,
					"groupDetails": {
		                $elemMatch: {
		                    "rowNo": rowNo,
		                    "colNo": colNo
		                }
		            }},
					{$set:{
						"groupDetails.$.winnerID":winnerID,
						"groupDetails.$.loserID":loserID,
						"groupDetails.$.scores":teamScoresSETS,
						"groupDetails.$.setWins":setWins,
						"groupDetails.$.status":"walkover"
					}}
				)

				roundRobinTeamEvents.update({"_id":id,
					"groupDetails": {
						$elemMatch: {
							rowNo: colNo,
							colNo: rowNo
						}
					}},
					{$set:{
						"groupDetails.$.winnerID":winnerID,
						"groupDetails.$.loserID":loserID,
						"groupDetails.$.scores":inverse_teamScoresSETS,
						"groupDetails.$.setWins":inverse_setWins,
						"groupDetails.$.status":"walkover"
					}}
				)	           
	        }
        	if (setType == "completed") 
        	{
            	roundRobinTeamEvents.update({"_id":id,
					"groupDetails": {
                        $elemMatch: {
                            rowNo: rowNo,
                            colNo: colNo
                        }
                    }},
					{$set:{
						"groupDetails.$.winnerID":completedData.winnerID,
						"groupDetails.$.loserID":completedData.loserID,
						"groupDetails.$.scores":completedData.teamScoresSETS,
						"groupDetails.$.setWins":completedData.setWins,
						"groupDetails.$.status":"completed"
					}}
				)

				roundRobinTeamEvents.update({"_id":id,
					"groupDetails": {
					    $elemMatch: {
					        rowNo:colNo,
					        colNo:rowNo
					    }
					}},
					{$set:{
						"groupDetails.$.winnerID":completedData.winnerID,
						"groupDetails.$.loserID":completedData.loserID,
						"groupDetails.$.scores":completedData.inverse_teamScoresSETS,
						"groupDetails.$.setWins":completedData.inverse_setWins,
						"groupDetails.$.status":"completed"
					}}
				)
             

            } 

        
    	}catch(e){
            errorLog(e)
    	}
    }

})