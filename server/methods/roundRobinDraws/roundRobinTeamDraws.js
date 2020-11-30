import {initDBS} from '../dbRequiredRole.js'

Meteor.methods ({
	'existingRoundRobinTeamDraws':function(tournamentId)
	  {
	    try{
	    	
	      	var raw1 = roundRobinTeamEvents.rawCollection();
      		var distinct1 = Meteor.wrapAsync(raw1.distinct, raw);
      		var eventList =  distinct('eventName',{"tournamentId":tournamentId});
	      	return eventList;

	    }catch(e){
	    }
	},
	"getRoundRobinMatchTeamRecords":function(tournamentId,eventName,groupNo){
		try{
			var paramJson = {};
			paramJson["tournamentId"] = tournamentId,
			paramJson["eventName"] = eventName;
			
			if(groupNo != undefined && groupNo != null && groupNo != "")
			{
				var orCond = [];			
				orCond.push({"groupNumber":parseInt(groupNo)});
				orCond.push({"groupNumber":groupNo.toString()});
				paramJson["$or"] = orCond;
			}

			

			var matchRecords = roundRobinTeamEvents.find(
				paramJson,
				{
					sort:{
						groupNumber: 1
					}
				}).fetch();
		    return matchRecords;
		}catch(e){

		}
	},
	initRoundRobinMatchTeamRecords: async function (tournamentId, eventName,eventId,fileData,maxMembers,teamFormatJson) {
	    try
	    {
	    	//return false;
		    var orgFormatInfo = undefined;
		    let tournament = events.findOne ({"_id": tournamentId});
			if(tournament == undefined)
				tournament = pastEvents.findOne ({"_id": tournamentId});

	    	if(teamFormatJson && teamFormatJson.matchFormat)
	    	{
	    		if(teamFormatJson.matchFormat.toLowerCase() == "other")
	    		{
	    			if(teamFormatJson.teamFormatName && teamFormatJson.teamFormatList && teamFormatJson.teamFormatList.length > 0)
	    			{
	    				
	    			}
	    			else
	    			{
	    				var response = {};
			    		response["status"] = "failure";
				    	response["message"] = "TeamFormat Details - Match Format and specifications are mandatory"
				    	return response
	    			}
	    		}
	    		else 
	    		{
	    			if(teamFormatJson._id && tournament)
	    			{
	    				orgFormatInfo = orgTeamMatchFormat.findOne({"_id":teamFormatJson._id,
	    					"projectId": tournament.projectId[0],"organizerId":tournament.eventOrganizer});

	    				if(orgFormatInfo)
	    				{

	    				}
	    				else
	    				{
	    					var response = {};
				    		response["status"] = "failure";
					    	response["message"] = "Invalid TeamFormat Details"
					    	return response
	    				}
	    			}
	    			else
	    			{
	    				var response = {};
			    		response["status"] = "failure";
				    	response["message"] = "Invalid TeamFormat Details"
				    	return response
	    			}
	    		}
	    	}
	    	else
	    	{
	    		var response = {};
	    		response["status"] = "failure";
		    	response["message"] = "TeamFormat Details mandatory"
		    	return response
	    	}
		    var data = fileData.data;
		    var obj = _.countBy(data, function(data) { return data.GroupNumber; });

		    var groupVsPlayerArr = [];
		    var response = {};

			for (var key in obj)
		    {
		    	var arr = [];
		    	var res = _.object(_.map(data, function(x){
		    		if(x.GroupNumber == 0)
		    		{
		    			response["status"] = "failure";
		    			response["message"] = "Group number exists with 0 value"
		    			return response
		    		}
		    		else if(key == x.GroupNumber)
		    		{
		    			if(x.AffiliationID.length == 0)
		    			{
		    				response["status"] = "failure";
		    				response["message"] = "Group contains empty player"
		    				return response
		    			}
		    			
		    			arr.push(x.AffiliationID);
		    		}
		    		return [key, arr];

		    	}))
		    	groupVsPlayerArr.push(res);
			}

			if(response.status)
			{
				if(response.status == "failure")
					return response;

			}
			else
			{

				


				

				if(tournament == undefined)
					return false;
				
				if (tournament.eventOrganizer!== Meteor.userId()) {
				    return false;
				}

		    	var fileLength = fileData.data.length;
		    	var previousGroupNumber;
		    	var jsonArr = [];
		    	for (var key in obj)
				{
				    var json = {};
				    json["tournamentId"] = tournamentId;
				    json["eventName"] = eventName;
				    json["groupNumber"] = parseInt(key);
				    json["groupName"] = "Group-"+key;
				    json["groupMaxSize"] = parseInt(maxMembers);
		            
		            var groupMemberDetails = [];
		            var groupStandingDetails = [];
		            
		            for(var h=0 ;h<parseInt(obj[key]);h++)
		            {
		            	for(var m=0; m<parseInt(obj[key]);m++)
		            	{
		            		var groupMemberJson = {};            		
		            		groupMemberJson["rowNo"] = h+1;
		            		groupMemberJson["colNo"] = m+1;
		            		if((h+1) == (m+1))
								groupMemberJson["status"] = "invalid"
		            		else
		            			groupMemberJson["status"] = "yetToPlay"

		            		

		            		var res = groupVsPlayerArr.filter(function(value) {
		    					return value.hasOwnProperty(key); 
							}).shift()[key];


		            		if(res[h] && res[m])
		            		{

		            			//var userInfo1 = playerTeams.findOne({"teamAffiliationId":res[h]}); 
		            			//var userInfo2 = playerTeams.findOne({"teamAffiliationId":res[m]});
		            			var userInfo1;
		            			var userInfo2;
		            			var dbsrequired = ["playerTeams"];

								var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
								if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
								{
								    userInfo1 = global[res2.changedDbNames[0]].findOne({"teamAffiliationId":res[h]})
								    userInfo2 = global[res2.changedDbNames[0]].findOne({"teamAffiliationId":res[m]})				   		                          
								}
		            			if(userInfo1 && userInfo2)
		            			{
		            				var teamID = {
				        				teamAId: userInfo1._id,
				        				teamBId: userInfo2._id
		      						}; 
		      						groupMemberJson["teamsID"] = teamID;
		      						var score = [0, 0, 0, 0, 0, 0, 0];
			      					var scores = {
									    setScoresA: score,
									    setScoresB: score
			      					};


			      					var wins = {
									    teamA: 0,
									    teamB: 0
			      					};
			      					groupMemberJson["setWins"] = wins;

			      					groupMemberJson["detailedScore"] = "";
				      				groupMemberJson["scores"] = scores;
						            groupMemberJson["winnerID"] = "";
						            groupMemberJson["loserID"] = "";	
		            				groupMemberDetails.push(groupMemberJson);
		            			}
		            			else
		            			{
		            				response["status"] = "failure";
		    						response["message"] = "Team with invalid temporary affiliation id"
		    						return response
		            			}
		            			
		            		}
		            		else
		            		{
		            			response["status"] = "failure";
		    					response["message"] = "Invalid data"
		    					return response
		            		}
		            	
		      				
		            	}
		            }
		            for(var c=0; c<parseInt(obj[key]);c++)
		            {
		            	var groupStandingJson = {};
		            	groupStandingJson["rowNo"] = c+1;
		            	groupStandingJson["groupStanding"] = "";
		            	groupStandingJson["teamId"] = "";
		            	groupStandingJson["points"] = 0;

		            	var res = groupVsPlayerArr.filter(function(value) {
		    					return value.hasOwnProperty(key); 
							}).shift()[key];

		            	if(res)
		            	{
		            		if(res[c])
		            		{
		            			//var userInfo = playerTeams.findOne({
								//	"teamAffiliationId":res[c]	
		            			//});
		            			var userInfo;
		            			var dbsrequired = ["playerTeams"];
								var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
								if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
								{
								    userInfo = global[res2.changedDbNames[0]].findOne({"teamAffiliationId":res[c]})				   		                          
								}
		            			if(userInfo)     			
		            				groupStandingJson["teamId"] = userInfo._id;            		
		            		}
		            		
		            	}
		            	
		            	groupStandingDetails.push(groupStandingJson);
		            }

		            json["groupDetails"] = groupMemberDetails;
		            json["groupStandingInfo"]= groupStandingDetails;
		               var orderPlay = [];
					var memCount = groupStandingDetails.length.toString()
					var matchOrderInfo = customDataDB.aggregate([
						{$match:{
							"type" : "RROrderOfPlay",
							"customKeyValueData.keySet":memCount}},
						{$unwind:"$customKeyValueData"},
						{$match:{"customKeyValueData.keySet":memCount}},
						{$group:{
							"_id":"$customKeyValueData.keySet",
							"customKeyValueData":{$push:"$customKeyValueData"}
						}},
					])



				if(matchOrderInfo && matchOrderInfo.length > 0 && matchOrderInfo[0].customKeyValueData)
				{
					var matchOrderPlay = matchOrderInfo[0].customKeyValueData;
					for(var c=0;c<matchOrderPlay.length;c++)
					{
						var dataJson = {};
						dataJson["groupMem"]  = parseInt(maxMembers);
						dataJson["matchOrder"] = matchOrderPlay[c].valueSet;
						orderPlay.push(dataJson);
					}
				}
				else
				{
					var dataJson = {};
					dataJson["groupMem"]  = parseInt(maxMembers);
					dataJson["matchOrder"] = "";
					orderPlay.push(dataJson);
				}


		        json["orderPlay"] = orderPlay



		            jsonArr.push(json);	    	
		        }
		    	var checkEventResult = roundRobinTeamEvents.find({"tournamentId":tournamentId,"eventName":eventName}).fetch();
		    	if(checkEventResult.length > 0)
		    	{

		    	}
		    	else
		    	{

		    		try{
		    			var bulkRes = roundRobinTeamEvents.batchInsert(jsonArr);

		    			if(bulkRes)
		    			{
		    				if(teamFormatJson.matchFormat)
		    				{
		    					if(teamFormatJson.matchFormat.toLowerCase() == "other")
		    					{
		    						var specifications = [];
		    						var sortOrder = [];
		    						for(var d=0; d< teamFormatJson.teamFormatList.length;d++)
		    						{
		    							var indexNo = d + 1;
		    							var formatData = teamFormatJson.teamFormatList[d];
		    							var formatJson = {};
		    							formatJson["no"] = indexNo;
		    							formatJson["displayLabel"] = formatData.displayLabel
		    							formatJson["label"] = formatData.label;
		    							formatJson["type"] = formatData.type;
		    							formatJson["order"] = indexNo;
		    							sortOrder.push(indexNo);
		    							specifications.push(formatJson);
		    						}
		    						
		    						var orgMFRes = orgTeamMatchFormat.insert({
		    							"organizerId":tournament.eventOrganizer,
		    							"projectId":tournament.projectId[0],
		    							"formatName":teamFormatJson.teamFormatName,
		    							"specifications":specifications,
		    							"sortOrder":sortOrder
		    						})
		    						if(orgMFRes)
		    						{
		    							var configRes = roundRobinTeamConfig.insert({
		    								"tournamentId":tournamentId,
		    								"eventName":eventName,
		    								"projectId":tournament.projectId[0],
		    								"matchFormatId":orgMFRes
		    							})
		    							if(configRes)
		    							{
		    								response["status"] = "success";
						    				response["message"] = "Draws created";
						    				var eventResult = roundRobinTeamEvents.find(
						    					{"tournamentId":tournamentId,"eventName":eventName},
						    					{
								                    sort: {
								                        groupNumber: 1
								                    }
								                }
				                			).fetch();
		    								response["response"] = eventResult;
		    							}
		    							else
		    							{
		    								var resetFormat = orgTeamMatchFormat.remove({"_id":orgMFRes})
		    								var result = roundRobinTeamEvents.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
	       									var removeTeamSpec = teamRRSpecification.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
	       									var removeteamDetailScore = teamRRDetailScore.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
		    								response["status"] = "failure";
		    								response["message"] = "Could not upload draws";
		    							}
		    						}
		    						else
		    						{
		    							var result = roundRobinTeamEvents.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
	       								var removeTeamSpec = teamRRSpecification.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
	       								var removeteamDetailScore = teamRRDetailScore.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
		    							response["status"] = "failure";
		    							response["message"] = "Could not upload draws";
		    						}
		    					}
		    					else
		    					{

		    						var configRes = roundRobinTeamConfig.insert({
		    							"tournamentId":tournamentId,
		    							"eventName":eventName,
		    							"projectId":tournament.projectId[0],
		    							"matchFormatId":orgFormatInfo._id
		    						})
		    						if(configRes)
		    						{
		    							response["status"] = "success";
						    			response["message"] = "Draws created";
						    			var eventResult = roundRobinTeamEvents.find(
						    				{"tournamentId":tournamentId,"eventName":eventName},
						    				{
								                sort: {
								                    groupNumber: 1
								                }
								            }).fetch();
		    							response["response"] = eventResult;
		    						}
		    						else
		    						{
		    							var resetFormat = orgTeamMatchFormat.remove({"_id":orgMFRes})
		    							var result = roundRobinTeamEvents.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
	       								var removeTeamSpec = teamRRSpecification.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
	       								var removeteamDetailScore = teamRRDetailScore.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
		    							response["status"] = "failure";
		    							response["message"] = "Could not upload draws";
		    						}

		    					}
		    				}
		    				else
		    				{
		    					var result = roundRobinTeamEvents.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
	       						var removeTeamSpec = teamRRSpecification.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
	       						var removeteamDetailScore = teamRRDetailScore.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});
	       						var resetConfig = roundRobinTeamConfig.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
		    					response["status"] = "failure";
		    					response["message"] = "Could not upload draws";
		    				}
		    				
		    			}
		    			else
		    			{
		    				response["status"] = "failure";
		    				response["message"] = "Could not upload draws";
		    			}

		    		}catch(e)
		    		{
		    			response["status"] = "failure";
		    			response["message"] = "Could not upload draws";
		    		}
		    		
		    	}
		    	return response;
			}
	  	}catch(e){
	  		errorLog(e)
	  }
	},

	updateRRTeamStanding:function(xData){
  		try{

  			var result = roundRobinTeamEvents.update({"_id":xData.groupID,
				"groupStandingInfo": {
                   	$elemMatch: {rowNo: parseInt(xData.rowNo)}
            }},
			{$set:{
				"groupStandingInfo.$.groupStanding":parseInt(xData.groupStanding),			
			}});
			return result;
  		}catch(e){

  		}
  	},
  	updateRRTeamPoints:function(xData){
  		try{
  			var result = roundRobinTeamEvents.update({"_id":xData.groupID,
				"groupStandingInfo": {
                   	$elemMatch: {rowNo: parseInt(xData.rowNo)}
            }},
			{$set:{
				"groupStandingInfo.$.points":parseInt(xData.points),			
			}});
			return result;
  		}catch(e){

  		}
  	},
  	resetRoundRobinTeamMatchRecords: function (tournamentId, eventName) {
	    try{
	      // TODO
	      let tournament = events.findOne ({
	        "_id": tournamentId
	      });
	      if(tournament == undefined)
	      {
	      	tournament = pastEvents.findOne ({
	        	"_id": tournamentId
	      	});
	      }
	      if(tournament)
	      {
			if (tournament.eventOrganizer != Meteor.userId() && Meteor.userId() != null && Meteor.userId() != undefined) {
	        	return false;
	      	}
	      	else
	      	{
	        	var result = roundRobinTeamEvents.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
	       		var removeTeamSpec = teamRRSpecification.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
	       		var removeteamDetailScore = teamRRDetailScore.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})
	       		var resetConfig = roundRobinTeamConfig.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
	       		var resetScore = roundRobinMatchScore.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]})

	       		if(result)
	       			return true;
	      	}
	      }

	    }catch(e){
	    	errorLog(e)
	    }
  	},
  	'fetchTeamPlayers': async function(teamId, tournamentId) {
    	try {          
	        var tourInfo = events.findOne({"_id": tournamentId})
	        var dbsrequired = ["userDetailsTT", "playerTeams"]

	        var userDetailsTT = "userDetailsTT"
	        var playerTeams = "playerTeams"
	        var considerTeamEventBool = null
	       	if (tourInfo == undefined || tourInfo == null) 
	       	{
	            tourInfo = pastEvents.findOne({"_id": tournamentId})
	        }
	        var res = await Meteor.call("changeDbNameForDraws", tourInfo, dbsrequired)
	        try {
	            if (res) {
	                if (res.changeDb && res.changeDb == true) 
	                {
	                    if (res.changedDbNames.length != 0) {
	                        userDetailsTT = res.changedDbNames[0]
	                        playerTeams = res.changedDbNames[1]
	                        considerTeamEventBool = true
	                        var playersDB = initDBS("playersDB")
	                        if(_.contains(playersDB,userDetailsTT)){
	                            considerTeamEventBool = null
	                        }
	                    }
	                }
	            }
	        }catch(e){
	            errorLog(e)
	        }

	        var s = global[playerTeams].aggregate([
	        	{ $match: {"_id": teamId}}, 
	        	{$unwind: "$teamMembers"}, 
	        	{$match: {"teamMembers.teamEvent": considerTeamEventBool}}, 
	        	{$project: {playerId: "$teamMembers.playerId"}}, 
	        	{$group: {
	        		"_id": null,
	                players: {$push: "$playerId"}
	            }}
	        ])



            if (s && s[0] && s[0].players) {
                var playerIds = s[0].players;
                var userDet = global[userDetailsTT].find({
                    userId: {
                        $in: playerIds
                    }
                }, {
                    fields: {
                        userName: 1,
                        userId: 1,
                        //dateOfBirth: 1,
                        "_id":0
                    }
                }).fetch();
                if (userDet && userDet.length != 0) {
                	var resultJson = {};
                	resultJson["status"] = "success";
                	resultJson["data"] = userDet;
                    return resultJson
                }
            }
        } catch (e) {
            errorLog(e)
        }
    },

  	"fetchTeamDetailScore":async function(tournamentId,eventName,matchDetails)
  	{
  		try{
  			var teamAId = matchDetails.teamsID.teamAId;
  			var teamBId = matchDetails.teamsID.teamBId;
  			var teamAPlayers = [];
  			var teamBPlayers = [];
  			var teamMatchType = "";
  			var finalTeamWinner = "";
		
  			var teamRRConfig  = roundRobinTeamConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
  			if(teamRRConfig && teamRRConfig.matchFormatId)
  			{		
  				var formatInfo = orgTeamMatchFormat.findOne({"_id":teamRRConfig.matchFormatId});
  				if(formatInfo && formatInfo.specifications)
  				{
  					var teamARes = await Meteor.call("fetchTeamPlayers",teamAId,tournamentId);
		  			if(teamARes && teamARes.status && teamARes.status == "success" && teamARes.data)
		  			{
		  				teamAPlayers = teamARes.data;
		  			}
		  			var teamBRes = await Meteor.call("fetchTeamPlayers",teamBId,tournamentId);

		  			if(teamBRes && teamBRes.status && teamBRes.status == "success" && teamBRes.data)
		  			{
		  				teamBPlayers = teamBRes.data;
		  			}
  					for(var i = 0;i< formatInfo.specifications.length; i++)
  					{
  						formatInfo.specifications[i]["teamAPlayers"] = teamAPlayers;
  						formatInfo.specifications[i]["teamBPlayers"] = teamBPlayers;

  						var scoreInfo  = roundRobinMatchScore.findOne({
  							"tournamentId":tournamentId,"eventName":eventName,
  							"detailScore.teamAID":teamAId,
  							"detailScore.teamBID":teamBId},{
  								fields: {
                    				_id: 0,
                    				"detailScore": {
                        				$elemMatch: {
                            				"teamAID": teamAId,
                            				"teamBID":teamBId
                        				}
                    				},

                				}	
  						});


  						if(scoreInfo && scoreInfo.detailScore && scoreInfo.detailScore.length > 0)
  						{
  							var detailedInfo = scoreInfo.detailScore[0].matchDetails;
  							if(detailedInfo[i] && detailedInfo[i].no == formatInfo.specifications[i]["no"])
  							{
  								formatInfo.specifications[i]["detailScore"] = detailedInfo[i];

  							}
  							if(scoreInfo.detailScore[0].teamMatchType)
  								teamMatchType = scoreInfo.detailScore[0].teamMatchType;
  							if(scoreInfo.detailScore[0].finalTeamWinner)
  								finalTeamWinner = scoreInfo.detailScore[0].finalTeamWinner;

  						}


  				

  					}

					var resultJson = {};
					resultJson["status"] = "success";
					resultJson["specifications"] = formatInfo.specifications;
					resultJson["teamMatchType"] = teamMatchType;
					resultJson["finalTeamWinner"] = finalTeamWinner;

					return resultJson;
  				
  				}
  			}
			

  		}catch(e){
  			errorLog(e)

  		}
  	}
});
