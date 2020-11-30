import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({
	"fetchPaidPlayers":async function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();

		try{
			if(data)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var userMsg = "Invalid user";

				var tourInfo = undefined;
				var userInfo = undefined;

				var objCheck = false;
				
				objCheck = Match.test(data, { 
					tournamentId: String, 
					userId: String})
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var userId = data.userId.trim();
					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		
	            	} 
	            
	            	userInfo = Meteor.users.findOne({"userId":userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
            		if(errorMsg.length > 0)
            		{
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = "Could not fetch players";
						return failureJson;
            		}
            		else
            		{
            			var dbsrequiredInd = ["playerEntries","userDetailsTT"]
						var playerEntries = "playerEntries"
						var userDetailsTTRec = "userDetailsTT"

						var dbsrequiredteam = ["playerTeamEntries","userDetailsTT"]
						var playerTeamEntries = "playerTeamEntries"
						var userDetailsTTRecTeam = "userDetailsTT"


						var dbName = await Meteor.call("changeDbNameForDraws", tournamentId,dbsrequiredInd) 
				        if(dbName)
				        {
				          	if(dbName.changeDb && dbName.changeDb == true)
				          	{
				            	if(dbName.changedDbNames.length!=0)
				            	{
				              		playerEntries = dbName.changedDbNames[0]
				              		userDetailsTTRec = dbName.changedDbNames[1]
				            	}
				          	}
				        }

				        var teamDb = Meteor.call("changeDbNameForDraws", tournamentId,dbsrequiredteam) 

        				if(teamDb)
        				{
          					if(teamDb.changeDb && teamDb.changeDb == true)
          					{
            					if(teamDb.changedDbNames.length!=0)
            					{
              						playerTeamEntries = teamDb.changedDbNames[0]
              						userDetailsTTRecTeam = teamDb.changedDbNames[1]

            					}
          					}
        				}

				       
				        var matchJson = {};
				        matchJson["tournamentId"] = tournamentId;
				        matchJson["paidOrNot"] = true;


				        var playerEntriesList = global[playerEntries].aggregate([
							{$match:matchJson},					
							{$lookup:{
						        from: "users",       
						        localField: "playerId",   
						        foreignField: "userId", 
						        as: "userDetails"        
						    }},
            				{$unwind:"$userDetails" },
            				{$project : { 
			                    "_id":0,
			                    "playerId":1,
			                    "playerName":"$userDetails.userName",
                           	}}                            
            			])

				       
				        var playerTeamEntriesList = global[playerTeamEntries].aggregate([
							{$match:matchJson},					
							{$lookup:{
						        from: "users",       
						        localField: "playerId",   
						        foreignField: "userId", 
						        as: "userDetails"        
						    }},
            				{$unwind:"$userDetails" },
            				{$project : { 
			                    "_id":0,
			                    "playerId":1,
			                    "playerName":"$userDetails.userName",
                           	}}                            
            			])

				       
				        var dataJson = {};
				        dataJson["individualPlayers"] = playerEntriesList;
				        dataJson["teamPlayers"] = playerTeamEntriesList;
				        successJson["data"] = dataJson;
				        successJson["message"] = "Players fetched";
				        return successJson;
      
            		}
				}
				else
				{					
					failureJson["message"] = paramMsg;
					return failureJson;
				}
			}
			else
			{				
				failureJson["message"] = paramMsg;
				return failureJson;
			}

		}
		catch(e)
		{
			failureJson["message"] = "Could not fetch players "+e;
			return failureJson;
		}
	},
	"fetchLeaveRequest":async function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var userMsg = "Invalid user";
				var playerMsg = "Invalid player";

				var tourInfo = undefined;
				var playerInfo = undefined;
				var userInfo = undefined;

				var tourType = "new";
				var objCheck = false;
				
				objCheck = Match.test(data, { 
					tournamentId: String,userId: String,playerId:String})
				
				
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var userId = data.userId.trim();
					var playerId = data.playerId.trim();


					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		if(tourInfo)
	            			tourType = "past";
	            	} 

	            	

	            	userInfo = Meteor.users.findOne({"userId":userId});
					playerInfo = Meteor.users.findOne({"userId":playerId,"role":"Player"});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
            		if(playerInfo == undefined)          	
            			errorMsg.push(playerMsg);

            		if(tourInfo && playerInfo)
            		{
            			if(tourType == "new")
            			{
            				var checkEntry = events.findOne({"tournamentId":tournamentId,"eventParticipants":{$in:[playerId]}});
            				if(checkEntry == undefined)
            					errorMsg.push("Player "+playerInfo.userName+" not subscribed under this tournament");			
            			}
            			else if(tourType == "past")
            			{
            				var checkEntry = pastEvents.findOne({"tournamentId":tournamentId,"eventParticipants":{$in:[playerId]}});
            				if(checkEntry == undefined)
            					errorMsg.push("Player "+playerInfo.userName+" not subscribed under this tournament");			
            			}
            		}

            	
            	            
	            	if(errorMsg.length > 0)
					{
							
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = "Could not fetch leave request";
						return failureJson;
					}
	            	else if(errorMsg.length == 0)
	            	{

	            		var leaveRequestResult = await Meteor.call("generate_leaveRequest",tournamentId, playerId,playerInfo.userName,tourType) 
						if(leaveRequestResult)
						{
							
							successJson["data"] = leaveRequestResult;
							successJson["message"] = "Leave request fetched";
							return successJson;
						}
						else
						{					
							failureJson["message"] = "Could not fetch leave request ";
							return failureJson;
						}
	          			         			           	
	            	}
				}
				else
				{
					failureJson["message"] = paramMsg;
					return failureJson;
				}

            	
			}
			else
			{			
				failureJson["message"] = paramMsg;
				return failureJson;
			}

		}catch(e){
			failureJson["message"] = "Could not fetch leave request "+e;
			return failureJson;
		}
	},
	"fetchBlankScore":async function(data)
	{
		try{
			if(data && data.drawsType)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var categoryMsg = "Invalid category/event";
				var userMsg = "Invalid user";
				var eventId = "";
				var drawsMsg = "Draws not found";

				var tourInfo = undefined;
				var eventInfo = undefined;
				var userInfo = undefined;
				var tourType = "new";

			
				var objCheck = false;
				var drawsType = data.drawsType.trim();
				if(drawsType.toLowerCase() == "knockout" || drawsType.toLowerCase() == "roundrobin")
				{
					objCheck = Match.test(data, { tournamentId: String, 
						eventName:String,
						userId: String,drawsType:String})
				}					
					
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Possible draw type - knockout/roundrobin";
					return resultJson;
				}
				
			
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var userId = data.userId.trim();

					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		if(tourInfo)
	            			tourType = "past";
	            	} 

	            	eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":eventName});
	            	if(eventInfo == undefined)
	            	{
	            		eventInfo = pastEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
	            	}


	            	userInfo = Meteor.users.findOne({"userId":userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
            		if(eventInfo == undefined)          	
            			errorMsg.push(categoryMsg);

            		if(tourInfo && eventInfo)
	            	{
	            		if(drawsType = "knockout")
	            		{
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
	            			{
	            				var drawsExists = MatchCollectionDB.findOne({
	            					"tournamentId":tournamentId,
	            					"eventName":eventName
	            				})
	            				if(!drawsExists)
	            					errorMsg.push(drawsMsg);
	            			}
	            			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
	            			{
	            				var drawsExists = teamMatchCollectionDB.findOne({
	            					"tournamentId":tournamentId,
	            					"eventName":eventName
	            				})
	            				if(!drawsExists)
	            					errorMsg.push(drawsMsg);
	            			}
	            			else
	            			{
	            				errorMsg.push("Invalid project type")
	            			}
	            		}	
	            		else if(drawsType == "roundrobin")
	            		{
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
	            			{
	            				var drawsExists = roundRobinEvents.findOne({
	            					"tournamentId":tournamentId,
	            					"eventName":eventName
	            				})
	            				if(!drawsExists)
	            					errorMsg.push(drawsMsg);
	            			}
	            			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
	            			{
	            				var drawsExists = roundRobinTeamEvents.findOne({
	            					"tournamentId":tournamentId,
	            					"eventName":eventName
	            				})
	            				if(!drawsExists)
	            					errorMsg.push(drawsMsg);
	            			}
	            			else
	            			{
	            				errorMsg.push("Invalid project type")
	            			}
	            		}
	            	}

            			            
	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament blank scoresheet";
							return resultJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		if(drawsType == "knockout")
	            		{
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
		          			{
	    						var result = await Meteor.call("matchRecords/generate_blankScoreSheet",tournamentId, eventName, "", "", tourType);
		          				if(result)
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "success";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Blank Scoresheet fetched";
		          					return resultJson;
		          				}
		          				else
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "failure";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Could not fetch blank scoresheet";
		          					return resultJson;
		          				}
		          			}
		          			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
		          			{
	    						var result = await Meteor.call("matchRecords/generate_blankScoreSheetForTeamEvents",tournamentId, eventName, "", "", tourType);
		          				if(result)
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "success";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Blank Scoresheet fetched";
		          					return resultJson;
		          				}
		          				else
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "failure";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Could not fetch blank scoresheet";
		          					return resultJson;
		          				}
		          			}	   
	            		}
	            		else if(drawsType == "roundrobin")
	            		{
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1 ||eventInfo.projectType == "2" ||eventInfo.projectType == 2)
		          			{
	    						var result = await Meteor.call("generate_blank_scoreSheet_RR",tournamentId, eventName,tourType,"");
		          				if(result)
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "success";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Blank Scoresheet fetched";
		          					return resultJson;
		          				}
		          				else
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "failure";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Could not fetch blank scoresheet";
		          					return resultJson;
		          				}
		          			}
		          			
	            		}
	          			         			           	
	            	}
				}
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Require all parameters";
					return resultJson;
				}

            	
			}
			else
			{
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["message"] = "Require all parameters";
				return resultJson;
			}

		}catch(e){
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament blank scoresheet "+e;
			return resultJson;
		}
	},
	"fetchScoreSheet":async function(data)
	{
		try{
			if(data && data.drawsType)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var categoryMsg = "Invalid category/event";
				var userMsg = "Invalid user";
				var eventId = "";
				var drawsMsg = "Draws not found";

				var tourInfo = undefined;
				var eventInfo = undefined;
				var userInfo = undefined;
				var tourType = "new";

			
				var objCheck = false;
				var drawsType = data.drawsType.trim();
				//console.log("drawsType .."+drawsType)
				if(drawsType.toLowerCase() == "knockout" || drawsType.toLowerCase() == "roundrobin")
				{
					objCheck = Match.test(data, { tournamentId: String, 
						eventName:String,
						userId: String,
						drawsType:String,
						"roundNumber":Match.Maybe(String),
						"matchNumber":Match.Maybe(String)
					})
				}	
				else if(drawsType.toLowerCase() == "roundrobin")
				{
					objCheck = Match.test(data, { tournamentId: String, 
						eventName:String,
						userId: String,drawsType:String})
				}									
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Possible draw type - knockout/roundrobin";
					return resultJson;
				}
				
			
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var userId = data.userId.trim();
					var roundNumber = "";
					var matchNumber = "";
					if(data.roundNumber)
						roundNumber = data.roundNumber;
					if(data.matchNumber)
						matchNumber = data.matchNumber;

					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		if(tourInfo)
	            			tourType = "past";
	            	} 

	            	eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":eventName});
	            	if(eventInfo == undefined)
	            	{
	            		eventInfo = pastEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
	            	}


	            	userInfo = Meteor.users.findOne({"userId":userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
            		if(eventInfo == undefined)          	
            			errorMsg.push(categoryMsg);

            		//console.log("2 drawsType .. "+drawsType)
            		if(tourInfo && eventInfo)
	            	{
	            		//console.log("3 drawsType .. "+drawsType)
	            		if(drawsType == "knockout")
	            		{
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
	            			{
	            				var drawsExists = MatchCollectionDB.findOne({
	            					"tournamentId":tournamentId,
	            					"eventName":eventName
	            				})
	            				if(!drawsExists)
	            					errorMsg.push(drawsMsg);
	            			}
	            			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
	            			{
	            				var drawsExists = teamMatchCollectionDB.findOne({
	            					"tournamentId":tournamentId,
	            					"eventName":eventName
	            				})
	            				if(!drawsExists)
	            					errorMsg.push(drawsMsg);
	            			}
	            			else
	            			{
	            				errorMsg.push("Invalid project type")
	            			}
	            		}	
	            		else if(drawsType == "roundrobin")
	            		{
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
	            			{
	            				var drawsExists = roundRobinEvents.findOne({
	            					"tournamentId":tournamentId,
	            					"eventName":eventName
	            				})
	            				if(!drawsExists)
	            					errorMsg.push(drawsMsg);
	            			}
	            			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
	            			{
	            				var drawsExists = roundRobinTeamEvents.findOne({
	            					"tournamentId":tournamentId,
	            					"eventName":eventName
	            				})
	            				if(!drawsExists)
	            					errorMsg.push(drawsMsg);
	            			}
	            			else
	            			{
	            				errorMsg.push("Invalid project type")
	            			}
	            		}
	            	}

            			            
	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament blank scoresheet";
							return resultJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		//console.log("4 drawsType .. "+drawsType)
	            		if(drawsType == "knockout")
	            		{
	            			//console.log("entered drawsType "+drawsType)
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
		          			{
	    						var result = await Meteor.call("matchRecords/generate_scoreSheet",tournamentId, eventName, matchNumber, roundNumber, tourType);
		          				var res = result;
		          				var foundEmpty = false;
					            var foundDuePlayers = false;
					            if(res.due != undefined)
					            {
					              foundDuePlayers = res.due.length > 0;
					            }
					            if(res.empty != undefined)
					            {
					              foundEmpty = res.empty > 0;
					            }
            					var htmlContent = "";
					            if(res == "emptydata")
					            {
					               	if(scoreSheetRoundNo != "")
					                	errorMsg.push("* empty players ");
					                else
					                  	errorMsg.push("* empty players ");
					            }
				              	else if(foundDuePlayers)
				              	{
				                	htmlContent += "Players On Due : "+res.due;
				                	if(foundEmpty)
				                  		htmlContent += " and Players are waiting for preceding rounds to be completed";
				                	
				                	errorMsg.push(htmlContent);
				              	}
				              	else if(foundEmpty)
				              	{
				                	if(foundDuePlayers)
				                  		htmlContent += "and Players are waiting for preceding rounds to be completed";
				                	else
				                  		htmlContent += "Players are waiting for preceding rounds to be completed";
				              		
				              		errorMsg.push(htmlContent);

				              	}
				              	if(errorMsg.length > 0)
				              	{
				              		var resultJson={};
									resultJson["status"] = "failure";
									resultJson["errorMsg"] = errorMsg;
									resultJson["message"] = "Could not fetch scoresheet";
									return resultJson;
				              	}
				              	else
				              	{

		          					var resultJson = {};
		          					resultJson["status"] = "success";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Scoresheet fetched";
		          					return resultJson;
		          				}
		          				
		          			}
		          			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
		          			{
	    						var result = await Meteor.call("matchRecords/generate_scoreSheetForTeamEvents",tournamentId, eventName, "", "", tourType);
		          				if(result)
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "success";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Scoresheet fetched";
		          					return resultJson;
		          				}
		          				else
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "failure";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Could not fetch scoresheet";
		          					return resultJson;
		          				}
		          			}	   
	            		}
	            		else if(drawsType == "roundrobin")
	            		{
	            			//console.log("entered drawsType "+drawsType)

	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
		          			{

	    						var result = await Meteor.call("generate_scoreSheet_Individual_RR",tournamentId, eventName,tourType,"");
		          				//console.log("rr individual scoresheet result .. "+result)
		          				if(result)
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "success";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Blank Scoresheet fetched";
		          					return resultJson;
		          				}
		          				else
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "failure";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Could not fetch blank scoresheet";
		          					return resultJson;
		          				}
		          			}
		          			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
		          			{
		          				var result = await Meteor.call("generate_scoreSheet_Team_RR",tournamentId, eventName,tourType,"");
		          				//console.log("rr team scoresheet result .. "+result)

		          				if(result)
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "success";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Blank Scoresheet fetched";
		          					return resultJson;
		          				}
		          				else
		          				{
		          					var resultJson = {};
		          					resultJson["status"] = "failure";
		          					resultJson["data"] = result;
		          					resultJson["message"] = "Could not fetch blank scoresheet";
		          					return resultJson;
		          				}
		          			}
		          			
	            		}
	          			         			           	
	            	}
				}
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Require all parameters";
					return resultJson;
				}

			}
			else
			{
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["message"] = "Require all parameters";
				return resultJson;
			}

		}catch(e){
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament scoresheet "+e;
			return resultJson;
		}
	},
	generateDrawReceipt:async function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var userMsg = "Invalid user";
				var playerMsg = "Invalid player";

				var tourInfo = undefined;
				var playerInfo = undefined;
				var userInfo = undefined;

				var objCheck = false;
				
				objCheck = Match.test(data, { 
					tournamentId: String,userId: String,playerId:String,type:String})
				
				
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var userId = data.userId.trim();
					var playerId = data.playerId.trim();


					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		
	            	} 

	            	
	            	userInfo = Meteor.users.findOne({"userId":userId});
					playerInfo = Meteor.users.findOne({"userId":playerId,"role":"Player"});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
            		if(playerInfo == undefined)          	
            			errorMsg.push(playerMsg);

            		
            	            
	            	if(errorMsg.length > 0)
					{
							
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = "Could not generate receipt";
						return failureJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		var receiptResult;
	            		if(data.type == "singles" || data.type == "individual" || data.type == "")
	            			receiptResult = await Meteor.call("generate_receipt",tournamentId, playerId,"","") 
						else if(data.type == "team")
	            			receiptResult = await Meteor.call("generate_receiptForTeam",tournamentId, playerId,"","") 

						if(receiptResult)
						{
							
							successJson["data"] = receiptResult;
							successJson["message"] = "Player Receipt";
							return successJson;
						}
						else
						{					
							failureJson["message"] = "Could not generate receipt";
							return failureJson;
						}
	          			         			           	
	            	}
				}
				else
				{
					failureJson["message"] = paramMsg;
					return failureJson;
				}

            	
			}
			else
			{			
				failureJson["message"] = paramMsg;
				return failureJson;
			}

		}catch(e){
			failureJson["message"] = "Could not generate receipt "+e;
			return failureJson;
		}
	}
})