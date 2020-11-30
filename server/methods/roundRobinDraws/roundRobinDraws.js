import { initDBS } from '../dbRequiredRole.js'
import {playerDBFind} from '../dbRequiredRole.js'
//userDetailsTTUsed

Meteor.methods ({

	'existingRoundRobinDraws':function(tournamentId)
	  {
	    try{
	    	var raw = roundRobinEvents.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var eventList1 =  distinct('eventName',{"tournamentId":tournamentId});
	      	

	      	var raw = roundRobinTeamEvents.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var eventList2 =  distinct('eventName',{"tournamentId":tournamentId});
      		var eventList = eventList1.concat(eventList2);
	      	return eventList;

	    }catch(e){
	    }
	},


	'checkRoundRobinDraws':function(tournamentId,eventName)
	{
	    try{
	      var eventDraws = [];
	      var eventList = roundRobinEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
	      if(eventList==undefined){
	        eventList = roundRobinTeamEvents.findOne({"tournamentId":tournamentId,"eventName":eventName})
	      
	      }

	      return eventList;
	    }catch(e){}
	},
	"getRoundRobinMatchRecords":function(tournamentId,eventName,groupNo){
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

			var matchRecords = roundRobinEvents.find(
				paramJson,
				{
					sort:{
						groupNumber: 1
					}
				}).fetch();
		    return matchRecords;
		}catch(e){
			errorLog(e)

		}
	},
	initRoundRobinMatchRecords: async function (tournamentId, eventName,eventId,fileData,maxMembers) {
	    try
	    {
	    	var checkRoundRobinDraws = roundRobinEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
	    	if(checkRoundRobinDraws)
	    	{
	    		var response = {};
	    		response["status"] = "failure";
		    	response["message"] = "Please reset the draws before uploading new csv"
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
		    			if( x && x.AffiliationID.length == 0)
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
				

				let tournament = events.findOne ({"_id": tournamentId});
				if(tournament == undefined)
					tournament = pastEvents.findOne ({"_id": tournamentId});

				if(tournament == undefined)
					return false;

				if (Meteor.userId() != null && tournament.eventOrganizer!== Meteor.userId()) 
				{
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
		            //json["colSize"] = parseInt(obj[key]);
		            //json["rowSize"] = parseInt(obj[key]);	
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
						        var playersDB = initDBS("playersDB")
						        var userInfo1;
						        var userInfo2;


						        for (var pdb = 0; pdb < playersDB.length; pdb++) 
						        {
						        	var toret = playersDB[pdb]
						        	var dbsrequired = ["userDetailsTT"]

				                    var res1 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
				                    try {
				                        if (res1 && res1 && res1.changedDbNames && res1.changedDbNames.length) {
				                            userInfo1 = global[res1.changedDbNames[0]].findOne({
				                                $or:[
						            				{"tempAffiliationId":res[h]},
						            				{"affiliationId":res[h]}
			            						]
				                            })

				                            userInfo2 = global[res1.changedDbNames[0]].findOne({
					            				$or:[
					            				{"tempAffiliationId":res[m]},
					            				{"affiliationId":res[m]}
					            				]
			            					});

			            					if(res[h] == "bye")
			            						userInfo1 = true;
			            					if(res[m] == "bye")
			            						userInfo2 = true;



				                        }
				                    }catch(e){
				                    }


                                   

			            			if(userInfo1 && userInfo2){
			            				

			            				break;
			            			}
                                }

		            			
		            			if(userInfo1 && userInfo2)
		            			{
		            				let playerAIdVal = "";
		            				let playerBIdVal = "";
		            				if(userInfo1.userId)
		            					playerAIdVal = userInfo1.userId;
		            				if(userInfo2.userId)
		            					playerBIdVal = userInfo2.userId

		            				var playersID = {
				        				playerAId: playerAIdVal,
				        				playerBId: playerBIdVal
		      						}; 
		      						groupMemberJson["playersID"] = playersID;
		      						var score = [0, 0, 0, 0, 0, 0, 0];
			      					var scores = {
									    setScoresA: score,
									    setScoresB: score
			      					};

			      					var wins = {
									    playerA: 0,
									    playerB: 0
			      					};
			      					groupMemberJson["setWins"] = wins;

			      					groupMemberJson["detailedScore"] = "";
				      				groupMemberJson["scores"] = scores;
						            groupMemberJson["winnerID"] = "";
						            groupMemberJson["loserID"] = "";
						            if(playerAIdVal != "" && playerBIdVal != "")	
		            					groupMemberDetails.push(groupMemberJson);
		            			}
		            			else
		            			{
		            				response["status"] = "failure";
		    						response["message"] = "Player with invalid temporary affiliation id"
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
		            	groupStandingJson["playerId"] = "";
		            	groupStandingJson["points"] = 0;

		            	var res = groupVsPlayerArr.filter(function(value) {
		    					return value.hasOwnProperty(key); 
							}).shift()[key];

		            	if(res)
		            	{
		            		if(res[c])
		            		{
		            			var playersDB1 = initDBS("playersDB")
						        var userInfo;



						        for (var pdb1 = 0; pdb1 < playersDB1.length; pdb1++) {
						        	var toret = playersDB1[pdb1]
		            	

                                  
			            			var dbsrequired = ["userDetailsTT"]

				                    var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
				                    try {
				                        if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) {
				                            userInfo = global[res2.changedDbNames[0]].findOne({
				                                $or:[
			            							{"tempAffiliationId":res[c]},
			            							{"affiliationId":res[c]}
			            						]
				                            })

				                           

				                        }
				                    }catch(e){
				                    }



			            			if(userInfo){
			            				
						        		
			            				break;
			            			}
                                }

		            			/*var userInfo = userDetailsTT.findOne({
		            				$or:[
		            				{"tempAffiliationId":res[c]},
		            				{"affiliationId":res[c]}
		            				]
		            			});
		            			*/

		            			if(userInfo)
		            			{
		            				groupStandingJson["playerId"] = userInfo.userId;            		

		            			}
		            			
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
		    	var checkEventResult = roundRobinEvents.find({"tournamentId":tournamentId,"eventName":eventName}).fetch();
		    	if(checkEventResult.length > 0)
		    	{

		    	}
		    	else
		    	{
		    		try{
		    			var res1 = roundRobinEvents.batchInsert(jsonArr);
		    			if(res1)
		    			{
		    				response["status"] = "success";
		    				response["message"] = "Draws created";
		    				var eventResult = roundRobinEvents.find(
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

	
	resetRoundRobinMatchRecords: function (tournamentId, eventName) {
	    try
	    {
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
		        	var result = roundRobinEvents.remove({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
		       		if(result)
		       			return true;
		     	}
	  		}
	  		else
	  			return false;
	    }catch(e){
	    	errorLog(e)
	    }
  	},
  	updateRRScores:function(id,data,inverseData){
  		try{

  			var matchStatus = "completed";
  			if(data.winnerType)
  				matchStatus = data.winnerType;
  			else if(inverseData.winnerType)
  				matchStatus = inverseData.winnerType;
  			var checkData = roundRobinEvents.findOne({"_id":id});

			var res1 = roundRobinEvents.update({"_id":id,
				"groupDetails": {
                                $elemMatch: {
                                    rowNo: data.rowNo,
                                    colNo: data.colNo
                                }
                            }},
			{$set:{
				"groupDetails.$.winnerID":data.winnerID,
				"groupDetails.$.loserID":data.loserID,
				"groupDetails.$.scores":data.scores,
				"groupDetails.$.setWins":data.setWins,
				"groupDetails.$.status":matchStatus
			}})

			var res2 = roundRobinEvents.update({"_id":id,
			"groupDetails": {
                                $elemMatch: {
                                    rowNo: inverseData.rowNo,
                                    colNo: inverseData.colNo
                                }
                            }},
			{$set:{
				"groupDetails.$.winnerID":inverseData.winnerID,
				"groupDetails.$.loserID":inverseData.loserID,
				"groupDetails.$.scores":inverseData.scores,
				"groupDetails.$.setWins":inverseData.setWins,
				"groupDetails.$.status":matchStatus
			}})

			if(checkData && res1 && res2)
			{
				return roundRobinEvents.find(
					{"tournamentId":checkData.tournamentId,"eventName":checkData.eventName},
					{
				        sort: {
				            groupNumber: 1
				        }
				    }

					).fetch();
			}



  			

  		}catch(e)
  		{
  		}
  	},
  	updateRRStanding:function(xData){
  		try{
  			
  			var result = roundRobinEvents.update({"_id":xData.groupID,
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
  	updateRRPoints:function(xData){
  		try{
  			var result = roundRobinEvents.update({"_id":xData.groupID,
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
  	updateRROrderPlay:function(xData)
  	{
  		try{
  			if(xData.tournamentId && xData.eventName && xData.orderPlay)
  			{
  				var type = "";
  				var dataExists = roundRobinEvents.findOne({
  					"tournamentId":xData.tournamentId,
  					"eventName":xData.eventName
  				});
  				if(dataExists)
  				{
  					type = "individual";
  					var result = roundRobinEvents.update({
  						"tournamentId":xData.tournamentId,
  						"eventName":xData.eventName,
  						"groupStandingInfo":{$size:xData.groupMemSize}
						},{$set:{
						"orderPlay":xData.orderPlay,			
						}},{multi:true}
					);
  				}
  				else if(dataExists == undefined)
  				{
  					var dataExists = roundRobinTeamEvents.findOne({
  						"tournamentId":xData.tournamentId,
  						"eventName":xData.eventName
  					});
	  				if(dataExists)
	  				{
	  					type = "team";
	  					var result = roundRobinTeamEvents.update({
	  						"tournamentId":xData.tournamentId,
	  						"eventName":xData.eventName,
	  						"groupStandingInfo":{$size:xData.groupMemSize}

							},{$set:{
							"orderPlay":xData.orderPlay,			
							}},{multi:true}
						);
	  				}
  				}
  				if(result)
  				{
  					if(type == "individual")
  					{
  						//getRoundRobinMatchRecords
  						var matchRecords = roundRobinEvents.find(
							{"tournamentId":xData.tournamentId,"eventName":xData.eventName},
							{
								sort:{
									groupNumber: 1
								}
							}).fetch();
  						var resultJson = {};
  						resultJson["type"] = type;
  						resultJson["matchRecords"] = matchRecords;
		    			return resultJson;
  					}
  					else if(type == "team")
  					{
  						var matchRecords = roundRobinTeamEvents.find(
							{"tournamentId":xData.tournamentId,"eventName":xData.eventName},
							{
								sort:{
									groupNumber: 1
								}
							}).fetch();
  						var resultJson = {};
  						resultJson["type"] = type;
  						resultJson["matchRecords"] = matchRecords;
		    			return resultJson;
  					}
  				}
				//return result;
  			}
  		}catch(e){
  			errorLog(e)
  		}
  	},

  	"fetchTeamSubscribed":async function(tournamentId,sEvent,eventId,maxMembers)
	{
		try{
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

			var dobFilterInfo = dobFilterSubscribe.findOne({
                "tournamentId": tournamentId,
                "details.eventId": eventId
            }, {fields: { _id: 0,details: {$elemMatch: {"eventId": eventId}}
                }});

            if (dobFilterInfo) {
            	if (dobFilterInfo && dobFilterInfo.details.length > 0) 
            	{
                    if (eventId.trim() == dobFilterInfo.details[0].eventId)
                        eventRanking = dobFilterInfo.details[0].ranking;
                }
            }
            let participants = [];
			if(eventInfo)
			{
				if(eventInfo.eventParticipants)
				{
					participants = eventInfo.eventParticipants;
					if(eventInfo.eventParticipants.length > 0)
					{
						var eventParticipants = eventInfo.eventParticipants;
						var noOfGroups = eventParticipants.length/maxMembers;

						for (var i = 0; i < eventParticipants.length; i++) 
	                    {
	                        var groupIdx = Math.floor(((i/(eventParticipants.length/noOfGroups ) )+0.000000000000001));

	                        var toret = "userDetailsTT"

			                var usersMet = Meteor.users.findOne({
			                    userId: eventParticipants[i]
			                })

			                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
			                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
			                    if (dbn) {
			                        toret = dbn
			                    }
			                }
			                var userInfo;
			                if (toret) 
			                {
			                    var dbsrequired = ["userDetailsTT"]

			                    var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
			                    try {
			                        if (res && res && res.changedDbNames && res.changedDbNames.length) {
			                            userInfo = global[res.changedDbNames[0]].findOne({
			                                userId: eventParticipants[i]
			                            })

			                        }
			                    }catch(e){
			                    }
			                }

	                       /* userInfo = global[toret].findOne({
	                            "userId": eventParticipants[i]
	                        });*/
	                           
	                        if (userInfo) 
	                        {
	                           var k = groupIdx+1;
	                            if (eventRanking.trim() == "yes")
	                            {

	                                if(eventInfo.projectType == 2 || eventInfo.projectType == "2" )
	                                {
	                                	
						                var playerTeamEntriesInfo;
						                var dbsrequired = ["playerTeamEntries"]

						                var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
						                try {
						                    if (res && res && res.changedDbNames && res.changedDbNames.length) 
						                    {
						                         
						                        playerTeamEntriesInfo = global[res.changedDbNames[0]].findOne({
									                "tournamentId": tournamentId,
									                "subscribedTeamsArray.eventName": eventName,
									                "playerId":eventParticipants[i]
									            }, {
									                fields: {_id: 0,
									                    subscribedTeamsArray: {$elemMatch: {"eventName": eventName}
									                    }
									                }
										        });
						                    }
						                }catch(e){
						                }
						                

	                               
										if(playerTeamEntriesInfo)
										{
										  if(playerTeamEntriesInfo.subscribedTeamsArray && playerTeamEntriesInfo.subscribedTeamsArray.length > 0)
										  {
										    if(playerTeamEntriesInfo.subscribedTeamsArray[0].teamId)
										    {
										    	var playerTeamInfo;
										    	var dbsrequired = ["playerTeams"];
										    	var res1 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
							                    try {
							                        if (res1 && res1 && res1.changedDbNames && res1.changedDbNames.length) 
							                        {
							                           
							                            playerTeamInfo = global[res1.changedDbNames[0]].findOne({"_id":playerTeamEntriesInfo.subscribedTeamsArray[0].teamId,"teamManager":eventParticipants[i]});

							                        }
							                    }catch(e){
							                    }

										     // var playerTeamInfo = playerTeams.findOne({"_id":playerTeamEntriesInfo.subscribedTeamsArray[0].teamId,"teamManager":eventParticipants[i]});
										      if(playerTeamInfo)
										      {
										      	userDetail.push({
	                                                "AffiliationID": playerTeamInfo.teamAffiliationId,
	                                                "Player/Team Name": playerTeamInfo.teamName,
	                                               // "GroupNumber":k,
	                                                "playerId":playerTeamInfo._id             
	                                            });
										      }

										    }
										  }

										}

	                     
	                                }
	                                else
	                                {

	                                    userDetail.push({
	                                        "AffiliationID": userInfo.affiliationId,
	                                        "Player/Team Name": userInfo.userName ,
	                                      //  "GroupNumber":k,
	                                        "playerId":userInfo.userId

	                                                
	                                    });
	                                }

	                                
	                            }
	                            else
	                            {
	                                if(eventInfo.projectType == 2 || eventInfo.projectType == "2" )
	                                {

						                	var playerTeamEntriesInfo;
						                    var dbsrequired = ["playerTeamEntries"]

						                    var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
						                    try {
						                        if (res && res && res.changedDbNames && res.changedDbNames.length) 
						                        {
						                           
						                            playerTeamEntriesInfo = global[res.changedDbNames[0]].findOne({
										                "tournamentId": tournamentId,
										                "subscribedTeamsArray.eventName": eventName,
										                "playerId":eventParticipants[i]
										            }, {
										                fields: {_id: 0,
										                    subscribedTeamsArray: {$elemMatch: {"eventName": eventName}
										                    }
										                }
										            });

						                        }
						                    }catch(e){
						                    }

	                                	 
										if(playerTeamEntriesInfo)
										{
										  if(playerTeamEntriesInfo.subscribedTeamsArray && playerTeamEntriesInfo.subscribedTeamsArray.length > 0)
										  {
										    if(playerTeamEntriesInfo.subscribedTeamsArray[0].teamId)
										    {
										    	var dbsrequired = ["playerTeams"]
										    	var res1 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
							                    try {
							                        if (res1 && res1 && res1.changedDbNames && res1.changedDbNames.length) 
							                        {
							                           
							                            playerTeamInfo = global[res1.changedDbNames[0]].findOne({"_id":playerTeamEntriesInfo.subscribedTeamsArray[0].teamId,"teamManager":eventParticipants[i]});

							                        }
							                    }catch(e){
							                    }
										     // var playerTeamInfo = playerTeams.findOne({"_id":playerTeamEntriesInfo.subscribedTeamsArray[0].teamId,"teamManager":eventParticipants[i]});
										      if(playerTeamInfo)
										      {
										      	userDetail.push({
	                                                "AffiliationID": playerTeamInfo.teamAffiliationId,
	                                                "Player/Team Name": playerTeamInfo.teamName,
	                                                //"GroupNumber":k,  
	                                                "playerId":playerTeamInfo._id            
	                                            });
										      }

										    }
										  }

										}

	                     
	                                }
	                                else
	                                {
	                                    userDetail.push({
	                                        "AffiliationID": userInfo.tempAffiliationId,
	                                        "Player/Team Name": userInfo.userName,
	                                       // "GroupNumber":k ,
	                                        "playerId":userInfo.userId              
	                                    });
	                                }
	                                
	                            }
	                        }
	                    }
					}
				}
			}
 			userDetail.map(function(document, index) {
                document["rank"] = parseInt(index + 1);
                document["points"] = parseInt(0)
            });

			if(eventInfo.eventOrganizer)
			{
				let lastTour = pastEvents.findOne({"eventOrganizer":eventInfo.eventOrganizer,tournamentEvent:true},{sort:{"eventEndDate":1}});
				if(lastTour)
				{
					//aggregate


					var pointsData = PlayerPoints.aggregate([
						{$match:{
							"eventName":sEvent,
							"playerId":{$in:participants},
							"eventName":eventName}},
						{$unwind:"$eventPoints"},
						{$match:{			
							"eventPoints.tournamentId":{$in:[lastTour._id]},	
						}},
						{$group:{
							"_id":{
								"tournamentId":"$eventPoints.tournamentId"
							},
							points :{$push:{
								"playerId":"$playerId","points":"$eventPoints.tournamentPoints"
							}}
						}},			
						{$project: {
        					'points': 1
    					}}
					]);


					if(pointsData && pointsData.length > 0 && pointsData[0] && pointsData[0].points)
					{
						//do mapping here
						let points = pointsData[0].points;
						userDetail.map(x => Object.assign(x, points.find(y => y.playerId == x.playerId)));
						userDetail.sort((a,b)=>{
							return b.points - a.points
						})
						userDetail.map(function(document, index) {
                			document["rank"] = parseInt(index + 1);
            			});



					
					}

				}
			}


			return userDetail;


			

		}catch(e){

			console.log(e)

		}
	},
	"fetchRRUserName":async function(userId,tournamentId,type)
	{
		try{
			if(type == "individual")
			{
				var dbsrequired = ["userDetailsTT"]

				var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
				if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
				{
				    userInfo = global[res2.changedDbNames[0]].findOne({
				      "userId":userId
				    })
				    if(userInfo)
				    {
				    	if (userInfo.clubNameId) 
		                {
		                	var academyName = "";
		                    var clubInfo = academyDetails.findOne({
		                        "userId": userInfo.clubNameId,
		                        "role": "Academy"
		                    });
		                    if(clubInfo)
		                    {
		                        userInfo["academyName"] = clubInfo.clubName;

		                    }
		                }
		                else if(userInfo.schoolId)
		                {
		                    var clubInfo = schoolDetails.findOne({
		                        "userId": userInfo.schoolId,
		                    });
		                    if(clubInfo&&clubInfo.schoolName)
		                        userInfo["academyName"] = clubInfo.schoolName;
		                }
				    	return userInfo;				                          
				    }
				}
				                    
			}
			else if(type == "team")
			{
				var dbsrequired = ["playerTeams"];
				var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
				if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
				{
				    userInfo = global[res2.changedDbNames[0]].findOne({
				      "_id":userId
				    })
				    if(userInfo){
				    	return userInfo;				                          
				    }
				}
			}
		}catch(e){
			errorLog(e)
		}
	},
	"fetchRRUserName_Aca":function(userId,tournamentId,type,dbName)
	{
		try{
			if(type == "individual")
			{
				if (dbName != undefined) 
				{
				    userInfo = global[dbName].findOne({
				      "userId":userId
				    })
				    if(userInfo)
				    {
				    	if (userInfo.clubNameId) 
		                {
		                	var academyName = "";
		                    var clubInfo = academyDetails.findOne({
		                        "userId": userInfo.clubNameId,
		                        "role": "Academy"
		                    });
		                    if(clubInfo)
		                    {
		                        userInfo["academyName"] = clubInfo.clubName;

		                    }
		                }
		                else if(userInfo.schoolId)
		                {
		                    var clubInfo = schoolDetails.findOne({
		                        "userId": userInfo.schoolId,
		                    });
		                    if(clubInfo&&clubInfo.schoolName)
		                        userInfo["academyName"] = clubInfo.schoolName;
		                }
		                var academyName = "";
		                if(userInfo.academyName)
		                	academyName = " ("+userInfo.academyName.toString().substr(0, 3)+")";

                    	return userInfo.userName+" "+academyName;
				    	//return userInfo;				                          
				    }
				}
				                    
			}
			else if(type == "team")
			{
				if (dbName != undefined) 
				{
				    userInfo = global[dbName].findOne({
				      "_id":userId
				    })
				    if(userInfo){
				    	return userInfo.teamName;				                          
				    }
				}
			}
		}catch(e){
			errorLog(e)
		}
	},
	fetchRRMemSizeList:function(tournamentId,eventName)
	{
		try{
			var dataExists = roundRobinEvents.findOne({
				"tournamentId":tournamentId,
				"eventName":eventName
			});
			if(dataExists)
			{
				//code for individual
				var matchOrderInfo = roundRobinEvents.aggregate([
						{$match:{
							"tournamentId":tournamentId,
							"eventName":eventName}},
						{$group:{
							"_id":null,
							 "memSize": {$addToSet:{$size: "$groupStandingInfo"}},
						}},
						{$project: {
        					'memSize': 1
    					}}
					]);

				if(matchOrderInfo && matchOrderInfo.length >0 && matchOrderInfo[0] && matchOrderInfo[0].memSize)
					return matchOrderInfo[0].memSize;
			}
			else 
			{
				var matchOrderInfo = roundRobinTeamEvents.aggregate([
						{$match:{
							"tournamentId":tournamentId,
							"eventName":eventName}},
						{$group:{
							"_id":null,
							 "memSize": {$addToSet:{$size: "$groupStandingInfo"}}
						}},
						{$project: {
        					'memSize': 1
    					}}
					]);

				if(matchOrderInfo && matchOrderInfo.length >0 && matchOrderInfo[0] && matchOrderInfo[0].memSize)
					return matchOrderInfo[0].memSize;
			}

		}catch(e){

		}
	},
	fetchRROrderPlayList:function(tournamentId,eventName,memSize1)
	{
		try{

			var memSize = parseInt(memSize1);
			var dataExists = roundRobinEvents.findOne({
				"tournamentId":tournamentId,
				"eventName":eventName
			});
			if(dataExists)
			{
			
				var matchOrderInfo = roundRobinEvents.findOne({
						"tournamentId":tournamentId,
						"eventName":eventName,
						"groupStandingInfo" : {$size:memSize}, 
						},{fields:{
							"orderPlay":1
						}});

				if(matchOrderInfo && matchOrderInfo.orderPlay)
					return matchOrderInfo.orderPlay;

			
			}
			else 
			{
				var matchOrderInfo = roundRobinTeamEvents.findOne({
						"tournamentId":tournamentId,
						"eventName":eventName,
						"groupStandingInfo" : {$size:memSize}, 
						},{fields:{
							"orderPlay":1
						}});

				if(matchOrderInfo && matchOrderInfo.orderPlay)
					return matchOrderInfo.orderPlay;
			}

		}catch(e){

		}
	},
	fetchRRGroupList:function(tournamentId,eventName)
	{
		try{
			var dataExists = roundRobinEvents.findOne({
				"tournamentId":tournamentId,
				"eventName":eventName
			});
			if(dataExists)
			{
				//code for individual
				var matchOrderInfo = roundRobinEvents.aggregate([
						{$match:{
							"tournamentId":tournamentId,
							"eventName":eventName}},	
						{ "$sort": { "groupNumber": 1} },
						{$group:{
							"_id":null,
							 "groupNumber": {$push:"$groupNumber"},
						}},
    					{$project: {
        					'groupNumber': 1
    					}}
					]);

				if(matchOrderInfo && matchOrderInfo.length >0 && matchOrderInfo[0] && matchOrderInfo[0].groupNumber)
					return matchOrderInfo[0].groupNumber;
			}
			else 
			{
				var matchOrderInfo = roundRobinTeamEvents.aggregate([
						{$match:{
							"tournamentId":tournamentId,
							"eventName":eventName}},
						{ "$sort": { "groupNumber": 1} },
						{$group:{
							"_id":null,
							 "groupNumber": {$push:"$groupNumber"},
						}},
						{$project: {
        					'groupNumber': 1
    					}}
					]);

				if(matchOrderInfo && matchOrderInfo.length >0 && matchOrderInfo[0] && matchOrderInfo[0].groupNumber)
					return matchOrderInfo[0].groupNumber;
			}

		}catch(e){
			errorLog(e)
		}
	},



});
