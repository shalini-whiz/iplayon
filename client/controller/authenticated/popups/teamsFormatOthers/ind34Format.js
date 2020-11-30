import { setJson } from '../../draws/eventTournamentDraws.js';

Template.ind34Format.onRendered(function(){
	Session.set("INDRoundDetEdit",false)
})

Template.ind34Format.onCreated(function(){
	Session.set("INDRoundDetEdit",false)
})

Template.ind34Format.onDestroyed(function(){
	Session.set("thirdFourTournamnetId",undefined)
	Session.set("thirdFourEventName",undefined)
	Session.set("INDRoundDetEdit",false)
})

Template.ind34Format.helpers({
	"fetchLosersTeamId":function(){
		try{
			if(Session.get("thirdFourEventName") && Session.get("thirdFourTournamnetId")){
				var data = {
					tournamentId:Session.get("thirdFourTournamnetId"),
					eventName:Session.get("thirdFourEventName")
				}
				var s = ReactiveMethod.call("fetchLoserForBMRoundDataInd",data)
				
				if(s && s.status==SUCCESS_STATUS && s.data){
					return s.data
				}
				else{
					return false
				}
			}
		}catch(e){
			alert(e)
		}
	},
	"dataForScoresA":function(){
		try{
			try{
				if(Session.get("thirdFourEventName") && Session.get("thirdFourTournamnetId")){
					var data = {
						tournamentId:Session.get("thirdFourTournamnetId"),
						eventName:Session.get("thirdFourEventName"),
						BMRound:true
					}
					var s = ReactiveMethod.call("fetchLoserForBMRoundDataInd",data)
					
					if(s && s.status==SUCCESS_STATUS && s.data && s.data.scores &&
						s.data.scores.setScoresA){
						return s.data.scores.setScoresA
					}
					else{
						return ["0","0","0","0","0","0","0"]
					}
				}
			}catch(e){}
		}catch(e){}
	},
	"dataForScoresB":function(){
		try{
			try{
				if(Session.get("thirdFourEventName") && Session.get("thirdFourTournamnetId")){
					var data = {
						tournamentId:Session.get("thirdFourTournamnetId"),
						eventName:Session.get("thirdFourEventName"),
						BMRound:true
					}
					var s = ReactiveMethod.call("fetchLoserForBMRoundDataInd",data)
					
					if(s && s.status==SUCCESS_STATUS && s.data && s.data.scores &&
						s.data.scores.setScoresB){
						return s.data.scores.setScoresB
					}
					else{
						return ["0","0","0","0","0","0","0"]
					}
				}
			}catch(e){}
		}catch(e){}
	},
	setScoresLength:function(){
        try{
            if((Session.get("scoreDetailsthirdFour")[0].matchRecords.scores
             && Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresB &&
                Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresB.length>7)
                ||(Session.get("scoreDetailsthirdFour")[0].matchRecords.scores && 
                	Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresA &&
                Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresA.length>7)){
                return true
            }
            else{
                return ["0","0","0","0","0","0","0"]
            }
        }catch(e){
        }
    },
    statusString:function(){
    	try{
			try{
				if(Session.get("thirdFourEventName") && Session.get("thirdFourTournamnetId")){
					var data = {
						tournamentId:Session.get("thirdFourTournamnetId"),
						eventName:Session.get("thirdFourEventName"),
						BMRound:true
					}
					var s = ReactiveMethod.call("fetchLoserForBMRoundDataInd",data)
					
					if(s && s.status==SUCCESS_STATUS && s.data && s.data.status){
						return s.data.status
					}
					else{
						return "yetToPlay"
					}
				}
			}catch(e){}
		}catch(e){}
    },
    winnerTeamA:function(){
    	try{
			try{
				if(Session.get("thirdFourEventName") && Session.get("thirdFourTournamnetId")){
					var data = {
						tournamentId:Session.get("thirdFourTournamnetId"),
						eventName:Session.get("thirdFourEventName"),
						BMRound:true
					}
					var s = ReactiveMethod.call("fetchLoserForBMRoundDataInd",data)
					
					if(s && s.status==SUCCESS_STATUS && s.data && s.data.winnerID && 
						s.data.playersID.playerAId == s.data.winnerID){
						return true
					}
					else{
						return false
					}
				}
			}catch(e){}
		}catch(e){}
    },
    winnerTeamB:function(){
		try{
			try{
				if(Session.get("thirdFourEventName") && Session.get("thirdFourTournamnetId")){
					var data = {
						tournamentId:Session.get("thirdFourTournamnetId"),
						eventName:Session.get("thirdFourEventName"),
						BMRound:true
					}
					var s = ReactiveMethod.call("fetchLoserForBMRoundDataInd",data)
					
					if(s && s.status==SUCCESS_STATUS && s.data && s.data.winnerID && 
						s.data.playersID.playerBId == s.data.winnerID){
						return true
					}
					else{
						return false
					}
				}
			}catch(e){}
		}catch(e){}
    }
})

Template.ind34Format.events({
	"click #setDetailedScores":async function(e){
		try{
			Session.set("INDRoundDetEdit",false)
			var data1 = {
				tournamentId:Session.get("thirdFourTournamnetId"),
            	"eventName": Session.get("thirdFourEventName"),
            	"BMRound":true
            }
			var checkRoundData = await Meteor.callPromise("checkRoundDataBMInd",data1)
			if(checkRoundData && checkRoundData.status == SUCCESS_STATUS && checkRoundData.data){
				var getData = await Meteor.callPromise("fetchLoserForBMRoundDataInd",data1)
				if(getData && getData.status == SUCCESS_STATUS && getData.data){

					Session.set("roundsDataMatchColBM",checkRoundData)
			        Session.set("matchColDataBM",getData.data)

					$("#renderRoundData").empty();
			        Blaze.render(Template.INDBYEWALKRoundDet, $("#renderRoundData")[0]);

			        $("#INDBYEWALKRoundDet").modal({
			            backdrop: 'static',
			            keyboard: false
			        });

				}
				else if(getData && getData.status == FAIL_STATUS){
					$("#renderRoundData").empty();
			        Blaze.render(Template.INDRoundDet, $("#renderRoundData")[0]);

			        $("#INDRoundDet").modal({
			            backdrop: 'static',
			            keyboard: false
			        });
				}
			}
			else if(checkRoundData && checkRoundData.status == FAIL_STATUS){
				$("#renderRoundData").empty();
		        Blaze.render(Template.INDRoundDet, $("#renderRoundData")[0]);

		        $("#INDRoundDet").modal({
		            backdrop: 'static',
		            keyboard: false
		        });
			}
			
		}catch(e){
			alert(e)
		}
	},
	"click #resetConfigurations":async function(){
		try{
			if(true){

				$("#renderRoundData").empty();
		        Blaze.render(Template.INDRoundDet, $("#renderRoundData")[0]);

		        $("#INDRoundDet").modal({
		            backdrop: 'static',
		            keyboard: false
		        });
		        Session.set("INDRoundDetEdit",true)
			}
			
		}catch(e){
			alert(e)
		}
	},
	"click #closeTeamFormatCreate":function(e){
		try{
			$("#ind34Format").modal('hide');

		}catch(e){
			alert(e)
		}
	},
	"click #openMoreScores_34":function(e){
        $("#renderMoreScTeamsOth").empty();
        Blaze.render(Template.teamsMorescores, $("#renderMoreScTeamsOth")[0]);

        $("#teamsMorescores").modal({
            backdrop: 'static',
            keyboard: false
        });
    },
})

Template.INDRoundDet.onRendered(function(){

})

Template.INDRoundDet.onCreated(function(){

})

Template.INDRoundDet.onDestroyed(function(){

})

Template.INDRoundDet.helpers({

})

Template.INDRoundDet.onCreated(function(){
	Session.set("matchStatusBM",false);

})

Template.INDRoundDet.events({

	"click #saveDataRounds":async function(){
		try{
			var data = {
				tournamentId:Session.get("thirdFourTournamnetId"),
	            eventName: Session.get("thirdFourEventName"),
				noofSets:$("#noOfSets").val(),
				minScores:$("#minScore").val(),
				minDifference:$("#minDifference").val(),
				points:$("#minPoints").val(),

			}

			var validateFirst = await Meteor.callPromise("validationsForIndRoundBMData",data)
			if(validateFirst && validateFirst.status == SUCCESS_STATUS){
				if(Session.get("INDRoundDetEdit")==false){

					var getData = await Meteor.callPromise("fetchLoserForBMRoundDataInd",data)
					if(getData && getData.status == SUCCESS_STATUS && getData.data){
						var data1 = {
							tournamentId:Session.get("thirdFourTournamnetId"),
			            	"eventName": Session.get("thirdFourEventName"),
			            	"playerAName":getData.data.player1Name,
							"playerBName":getData.data.player2Name,
							"playerAId":getData.data.player1Id,
							"playerBId":getData.data.player2Id,
							"playerANo":getData.data.player1No,
							"playerBNo":getData.data.player2No,
							noofSets:$("#noOfSets").val(),
							minScores:$("#minScore").val(),
							minDifference:$("#minDifference").val(),
							points:$("#minPoints").val()
						}
					}
					var saveValidatedData = await Meteor.callPromise("insertOrUpdateRoundBMInd",data1)
					if(saveValidatedData && saveValidatedData.status == SUCCESS_STATUS){
						$("#INDRoundDet").modal('hide')
					}
					else if(saveValidatedData && saveValidatedData.status == FAIL_STATUS){
						alert(saveValidatedData.message)
					}
				}
				else if(Session.get("INDRoundDetEdit")==true){
					var resFirst = await Meteor.callPromise("changeBMRoundConfig",data)
					if(resFirst && resFirst.status == SUCCESS_STATUS){
						var getData = await Meteor.callPromise("fetchLoserForBMRoundDataInd",data)
						if(getData && getData.status == SUCCESS_STATUS && getData.data){
							var data1 = {
								tournamentId:Session.get("thirdFourTournamnetId"),
				            	"eventName": Session.get("thirdFourEventName"),
				            	"playerAName":getData.data.player1Name,
								"playerBName":getData.data.player2Name,
								"playerAId":getData.data.player1Id,
								"playerBId":getData.data.player2Id,
								"playerANo":getData.data.player1No,
								"playerBNo":getData.data.player2No,
								noofSets:$("#noOfSets").val(),
								minScores:$("#minScore").val(),
								minDifference:$("#minDifference").val(),
								points:$("#minPoints").val()
							}
						}
						var saveValidatedData = await Meteor.callPromise("insertOrUpdateRoundBMInd",data1)
						if(saveValidatedData && saveValidatedData.status == SUCCESS_STATUS){
							$("#INDRoundDet").modal('hide')
						}
						else if(saveValidatedData && saveValidatedData.status == FAIL_STATUS){
							alert(saveValidatedData.message)
						}
					}else{
						alert("No Data")
					}
				}

				
			}else if(validateFirst && validateFirst.status == FAIL_STATUS){
				alert(validateFirst.message)
			}
		}catch(e){
			alert(e)
		}
	},

	"click #closeDataRounds":async function(){
		$("#INDRoundDet").modal('hide')
	}
})

Template.INDBYEWALKRoundDet.events({
	"click #closeDataRoundsMatch":function(e){
		$("#INDBYEWALKRoundDet").modal('hide')
	},
	'change [name="selectStatus"]': function(event, template) {
		var matchStatus = $("#selectStatus").val().toLowerCase();
		if(matchStatus == "completed")
			Session.set("matchStatusBM",true);
		else
			Session.set("matchStatusBM",false);

	},

	"click #saveDetailsForMatchDB":function(e){
		try{
		var tournamentId = Session.get("thirdFourTournamnetId");
		var eventName = Session.get("thirdFourEventName");
		var data = Session.get("matchColDataBM")
		data.winnerID = $("#selectedWinnerId").val()
		data.status = $("#selectStatus").val().toLowerCase()
		data.winner = $('#selectedWinnerId option:selected').text();


		var roundDataMatch = Session.get("roundsDataMatchColBM");
        var rankingEnabled = Session.get("dobfilters");

        if(roundDataMatch != undefined  && data != undefined && data.roundNumber && rankingEnabled)
        {
        	var loserId = "";

        	if(roundDataMatch.status != undefined && 
        		roundDataMatch.status.toLowerCase() == "success" && 
        		roundDataMatch.data != undefined && 
        		roundDataMatch.data.roundValues != undefined)
        	{
        		var playersID = data.playersID;

        		var loserId = "";
        		if(data.winnerID == playersID.playerAId)
        			loserId = playersID.playerBId;
        		else if(data.winnerID == playersID.playerBId)
        			loserId = playersID.playerAId;

        			
        		var winnerPoints = "";
        		var loserPoints = "";
        	
        		var roundValues = roundDataMatch.data.roundValues;
        		var semiRoundData = _.filter(roundValues,function(obj){
        			return (obj.roundName.toLowerCase() == "semi final")
        		})

        		var finalRoundData = _.filter(roundValues,function(obj){
        			return (obj.roundName.toLowerCase() == "final" )

        		})
        		
        		if(finalRoundData && finalRoundData[0])
        			Session.set("finalRoundBM",finalRoundData[0].roundNumber);
        		if(semiRoundData && semiRoundData[0])
        			loserPoints = semiRoundData[0].points;

        		
        		var roundData = _.filter(roundValues,function(obj){
        			return (obj.roundNumber == data.roundNumber.toString())

        		})
        		if(roundData && roundData.length > 0 )
        		{
        			Session.set("configBM",roundData[0]);
        			winnerPoints = roundData[0].points;
        			data.winnerNo = "";
        			//if(data.playersNo == undefined)
        			//{
        			//	data.playersNo = { "playerANo" : "", "playerBNo" : "" }
        			//}
					data.setWins = { "playerA" : 0, "playerB" : 0 }
        			if(data.status.toLowerCase() == "bye" || data.status.toLowerCase() == "walkover")
        			{

        				var completedSetScores = [];
        				var noofSets = roundData[0].noofSets;

        			
	        			for (var k = 1; k <=  roundData[0].noofSets; k++) 
	        			{
	                        completedSetScores.push("");

	                    }

        		

        				var cssMatch = "";
        				if(data.status.toLowerCase() == "bye")
        					cssMatch = "Bye";
        				else if(data.status.toLowerCase() == "walkover")
        					cssMatch ="Walkover";
        				if(data.winnerID == playersID.playerAId)
        				{
        					data.getStatusColorB = 'ip_input_box_type_pName'+cssMatch;
                    		data.getStatusColorA = 'ip_input_box_type_pName';
                    		if(data.playersNo && data.playersNo.playerANo)
                            	data.winnerNo = data.playersNo.playerANo;
        				}
        				else if(data.winnerID == playersID.playerBId)
        				{
        					data.getStatusColorB = 'ip_input_box_type_pName';
                    		data.getStatusColorA = 'ip_input_box_type_pName'+cssMatch;
                    		if(data.playersNo && data.playersNo.playerBNo)
                            		data.winnerNo = data.playersNo.playerBNo;
        				}

        				var score = ["0", "0", "0","0","0", "0", "0"];
      					var scoresSet = {
        					"setScoresA": score,
       						"setScoresB": score
      					};
      					data.scores = scoresSet;
      					data.completedscores  = completedSetScores
      					


        			}
        			else if(data.status.toLowerCase() == "completed")
        			{
        				var set1 = $("#compBMSet0").find("input[name='score']").val();
	                    var set2 = $("#compBMSet1").find("input[name='score']").val();
	                    var set3 = $("#compBMSet2").find("input[name='score']").val();
	                    var set4 = $("#compBMSet3").find("input[name='score']").val();
	                    var set5 = $("#compBMSet4").find("input[name='score']").val();
	                    var set6 = $("#compBMSet5").find("input[name='score']").val();
	                    var set7 = $("#compBMSet6").find("input[name='score']").val();

	                    var paramJson = {};
	                    paramJson["set1"] = set1;
	                    paramJson["set2"] = set2;
	                    paramJson["set3"] = set3;
	                    paramJson["set4"] = set4;
	                    paramJson["set5"] = set5;
	                    paramJson["set6"] = set6;
	                    paramJson["set7"] = set7;
	                    paramJson["minDifference"] = roundData[0].minDifference;
	                    paramJson["minScores"] = roundData[0].minScores;
	                    paramJson["noofSets"] = roundData[0].noofSets;

	                    
	                    var compScores = calcSetScores(paramJson);
	                    if(compScores)
	                    {
	                    	if (compScores.winsA == compScores.numSetWinsReqd) 
	                    	{
                        		data.winner = data.players.playerA;
                        		data.winnerID = data.playersID.playerAId;
                        		loserId = data.playersID.playerBId;
                        		if(data.playersNo && data.playersNo.playerANo)
                            		data.winnerNo = data.playersNo.playerANo;
                        		data.getStatusColorB = 'ip_input_box_type_pNameLost';
                        		data.getStatusColorA = 'ip_input_box_type_pName';
                    		} 
                    		else if (compScores.winsB == compScores.numSetWinsReqd) 
                    		{

                        		data.winner = data.players.playerB;
                        		data.winnerID = data.playersID.playerBId;
                        		loserId = data.playersID.playerAId;
                        		if(data.playersNo && data.playersNo.playerBNo)
                           			data.winnerNo = data.playersNo.playerBNo;
                        		data.getStatusColorA = 'ip_input_box_type_pNameLost';
                        		data.getStatusColorB = 'ip_input_box_type_pName';
                    		} else {
                        		$("#scoreError").text("* Incomplete set");
                        		return false;
                    		}
							data.completedscores = compScores.completedscores;
                    		data.scores = compScores.scores;

	                    }
        			}
        		
        			//update match score and points
					delete data["loser"];
					delete data["WinnermanagerId"];
					delete data["selectedID"];
					delete data["selectedTeamName"];

        			Meteor.call("updateMatchDraws",tournamentId,eventName,data,function(err,result)
        			{
        				if(result)
        				{
        					if(rankingEnabled.trim() == "yes" && 
        						Session.get("finalRoundBM") != data.roundNumber && loserId.trim() != "" && Session.get("configBM") != undefined)
        					{
        						
	                            Meteor.call("updatePoints", tournamentId, eventName, data.winnerID, parseInt(winnerPoints));
	                            Meteor.call("updatePoints", tournamentId, eventName, loserId, parseInt(loserPoints));                              	                          
        					}					
        				}
        				displayMessage("Score updated!!")
        				$("#INDBYEWALKRoundDet").modal('hide');
        				$("#ind34Format").modal('hide');


        			}); 
        			
        		}
        	}
        }
    }catch(e)
    {
    	displayMessage(e)
    }



	}
})

Template.INDBYEWALKRoundDet.helpers({
	playerAForBM:function(){
		try{
			if(Session.get("matchColDataBM") && 
				Session.get("matchColDataBM").playersID.playerAId 
				&& Session.get("matchColDataBM").players.playerA ){
				var data = {
					playerAId:Session.get("matchColDataBM").playersID.playerAId,
					playerA:Session.get("matchColDataBM").players.playerA
				}
				return data
			}
			else{
				return false
			}
		}catch(e){}
	},
	playerBForBM:function(){
		try{
			if(Session.get("matchColDataBM") && 
				Session.get("matchColDataBM").playersID.playerBId 
				&& Session.get("matchColDataBM").players.playerB ){
				var data = {
					playerBId:Session.get("matchColDataBM").playersID.playerBId,
					playerB:Session.get("matchColDataBM").players.playerB
				}
				return data
			}
			else{
				return false
			}
		}catch(e){}
	},
	"scoreValues":function(index){
		if(Session.get("matchColDataBM"))
		{
			var data = Session.get("matchColDataBM");

			if(data != undefined && data.status != undefined && 
	        		data.status.toLowerCase() == "completed")
	        {
	        	return data.completedscores[index];

	        }
		}
	},
	setMatchStatus:function(statusVal)
	{
		if(Session.get("matchColDataBM"))
		{
			var data = Session.get("matchColDataBM");
			if(data != undefined && data.status != undefined)
	        {
	        	if(data.status.toLowerCase() == "completed")
	        		Session.set("matchStatusBM",true);

	        	if(data.status.toLowerCase() == statusVal)
	        		return "selected";

	        }
		}
	},
	completedScores:function(){

		if(Session.get("matchStatusBM"))
		{

			var possibleScores = [];
			var data = Session.get("matchColDataBM")

			var roundDataMatch = Session.get("roundsDataMatchColBM");
			if(data != undefined && roundDataMatch.status != undefined && 
	        		roundDataMatch.status.toLowerCase() == "success" && 
	        		roundDataMatch.data != undefined && 
	        		roundDataMatch.data.roundValues != undefined)
	        {
        		
        		var roundValues = roundDataMatch.data.roundValues;
        		var roundData = _.filter(roundValues,function(obj){
        			return (obj.roundNumber == data.roundNumber)
        		})
        		if(roundData && roundData[0] && roundData[0].noofSets)
        		{
        			for (var k = 1; k <=  roundData[0].noofSets; k++) 
        			{
                        possibleScores.push(k);

                    }

        		}
        	}

			return possibleScores;
		}
	}
})


function calcSetScores(dataJson)
{
	var completedScores = [];
    var completedSetScores  = [];

	var set1 = dataJson.set1;
	var set2 = dataJson.set2;
	var set3 = dataJson.set3;
	var set4 = dataJson.set4;
	var set5 = dataJson.set5;
	var set6 = dataJson.set6;
	var set7 = dataJson.set7;
	var minDifference = dataJson.minDifference;
	var minScores =  dataJson.minScores;
	var noofSets = dataJson.noofSets;


	if(set1 != undefined )
    {
        if(set1.trim().length > 0 && (set1 != -0 || set1 != "-0"))                  
            set1 = parseInt(set1);
        completedScores.push(set1);
        completedSetScores.push(set1.toString());
    }
    if(set2 != undefined){
        if(set2.trim().length > 0 && (set2 != -0 || set2 != "-0"))                  
            set2 = parseInt(set2);
        completedScores.push(set2);
        completedSetScores.push(set2.toString());
    }
    if(set3 != undefined ){
        if(set3.trim().length > 0 && (set3 != -0 || set3 != "-0"))
            set3 = parseInt(set3);
        completedScores.push(set3);
        completedSetScores.push(set3.toString());
    }
    if(set4 != undefined){
        if(set4.trim().length > 0 && (set4 != -0 || set4 != "-0"))
            set4 = parseInt(set4);
        completedScores.push(set4);
        completedSetScores.push(set4.toString());
    }
    if(set5 != undefined ){
        if(set5.trim().length > 0 && (set5 != -0 || set5 != "-0"))
            set5 = parseInt(set5);
        completedScores.push(set5);
        completedSetScores.push(set5.toString());
    }
                                      
    if(set6 != undefined ){
        if(set6.trim().length > 0 && (set6 != -0 || set6 != "-0"))
            set6 = parseInt(set6);
        completedScores.push(set6);
        completedSetScores.push(set6.toString());
    }
    if(set7 != undefined){
        if(set7.trim().length > 0 && (set7 != -0 || set7 != "-0"))
            set7 = parseInt(set7);
        completedScores.push(set7);
        completedSetScores.push(set7.toString());
    }

    var sets = {"set1": set1,"set2": set2,"set3": set3,"set4": set4,
                    "set5": set5,"set6": set6,"set7": set7};

    var setJsonData = setJson(sets, minDifference, minScores, noofSets);

  
  	var numSetWinsReqd = parseInt((parseInt(noofSets) + 1) / 2);
    var setScoresA = JSON.parse(JSON.stringify(setJsonData)).scores.setScoresA;
    var setScoresB = JSON.parse(JSON.stringify(setJsonData)).scores.setScoresB;

    if (setScoresA.length < numSetWinsReqd) return;
    if (setScoresA.length != setScoresB.length) return;
    let winsA = 0,winsB = 0;

    for (var j = 0; j < completedScores.length; j++) 
    {
        if(completedScores[j].toString().trim() != "" && completedScores[j] != undefined)
        {        

            if(typeof completedScores[j] == "number"){
                if (completedScores[j] > 0 || completedScores[j] == 0)       
                    winsA++;                                    
                else if (completedScores[j] < 0)
					winsB++;                           
            }
            else if(typeof completedScores[j] == "string"){
                if(completedScores[j] == "-0")
                     winsB++;                               
            }
                           
        }
    }


    var calcJson = {};
    calcJson["scoresA"] = setScoresA;
    calcJson["scoresB"] = setScoresB;
    calcJson["numSetWinsReqd"] = numSetWinsReqd;
    calcJson["winsA"] = winsA;
    calcJson["winsB"] = winsB;
	calcJson["completedscores"] = completedSetScores;
    calcJson["scores"] = JSON.parse(JSON.stringify(setJsonData)).scores;

    return calcJson;

}
