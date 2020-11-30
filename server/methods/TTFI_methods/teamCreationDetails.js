import { Match } from 'meteor/check'


Meteor.methods({
	"fetchTeamFormatList":async function(data)
	{
		try{
			if(data && data.userId)
			{
				var userInfo = Meteor.users.findOne({
                	"_id": data.userId
            	});
            	if(userInfo)
            	{
            		if(userInfo.role == "Player")
            		{
            			if(userInfo.interestedProjectName && userInfo.interestedProjectName != null)
						{
							var sportID = userInfo.interestedProjectName[0];
							teamFormatList = teamsFormat.find({"selectedProjectId":sportID.trim()},
								/*{fields: {
                            		"_id": 1,
                            		"teamFormatName":1,
                        		}},*/
								{sort:{teamFormatName:1}}
								).fetch();
						}
						else
						{
							teamFormatList = teamsFormat.find({},
								/*{fields: {
                            		"_id": 1,
                            		"teamFormatName":1
                        		}},*/
								{sort:{teamFormatName:1}}).fetch();
						}
							

						var dbColl = {};
						dbColl["teamsFormat"] = teamFormatList;
	            		
	            		var resultJson={};
						resultJson["status"] = "success";
						resultJson["message"] = "Team format details";
						resultJson["dbColl"] = dbColl;
 						return resultJson;
	            		      		 
            		}
            		else
            		{
            			var resultJson={};
						resultJson["status"] = "failure";
						resultJson["message"] = "Only Player can access!!";
						return resultJson;
            		   	
            		}
            	}
            	else
            	{
            		var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Invalid User Login Details";
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
			resultJson["message"] = "Could not delete fetch details "+e;
			return resultJson;
		}
	},
	"fetchPlayersOnTeamFormat":async function(data)
	{
		try{
			if(data)
			{
				var objCheck = Match.test(data, { teamFormatId: String, 
							userId: String});
				if(objCheck)
				{
					var userInfo = Meteor.users.findOne({"_id": data.userId});
	            	if(userInfo)
	            	{
	            		if(userInfo.role == "Player")
	            		{            			
	            			var dataJson = [];
							var teamformatInfo = teamsFormat.findOne({"_id":data.teamFormatId});
							if(teamformatInfo && teamformatInfo.playerFormatArray)
							{				
								if(teamformatInfo.playerFormatArray.length > 0)
								{
									for(var i =0; i<teamformatInfo.playerFormatArray.length;i++)
									{
										var k = i+1;
										var playerFormat = teamformatInfo.playerFormatArray[i];
										var response = await Meteor.call("fetchPlayerListOnCriteria",playerFormat,teamformatInfo.rankedOrNot,data.userId,teamformatInfo.selectedProjectId);
										playerFormat.playerJsonList = response;
										playerFormat.slNo = k;
										dataJson.push(playerFormat)
									}		
								}
								//console.log("dataJson .. "+JSON.stringify(dataJson));
							
			            		var resultJson={};
								resultJson["status"] = "success";
								resultJson["message"] = "Team format and players details fetched ";
								resultJson["data"] = dataJson;
		 						return resultJson;
							}
							else
							{
								var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Invalid team format details!!";
								return resultJson;
							}							          	      		 
	            		}
	            		else
	            		{
	            			var resultJson={};
							resultJson["status"] = "failure";
							resultJson["message"] = "Only Player can access!!";
							return resultJson;
	            		   	
	            		}
	            	}
	            	else
	            	{
	            		var resultJson={};
						resultJson["status"] = "failure";
						resultJson["message"] = "Invalid User Login Details";
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
			resultJson["message"] = "Could not fetch players based on team format "+e;
			return resultJson;
		}
	},
	"createTFTeam":async function(data)
	{
		try{
			if(data)
			{
				/*{"teamFormatId":"KEb4BKTx5ue4vTunS",
				"teamManager":"EePtJ4LEaygnRtfxQ",
				"teamMembers":[
				{"playerId":"yTXehA9Cj3z6PgZku","playerNumber":"p1"},
				{"playerId":"k2navdFPst357iMDA","playerNumber":"p2"}],
				"teamName":"vgkh"}*/

				var teamManagerMsg = "Only Registered Player can create teams";
				var teamFormatMsg = "Invalid team format";
				var teamMemMsg = "Invalid team member";
				var teamNameMsg = "Team Name mandatory";
				var teamMemMandMsg ="Add mandatory players"
				var userMsg = "Invalid Team Manager";

		

				var errorMsg = [];
				var subErrorMsg = [];
				var teamMemList = [];

				var teamMemTFList = [];
				var teamMemTFPlayerList = [];

				var objCheck = Match.test(data, { teamFormatId: String, 
							teamManager: String,"teamMembers":[{"playerId":String,playerNumber:String}],"teamName":String,"source":String});
				if(objCheck)
				{
					var userInfo = Meteor.users.findOne({"_id": data.teamManager});
	            	var teamformatInfo = teamsFormat.findOne({"_id":data.teamFormatId});

	            		      
	            	if(data.teamName == undefined ||  data.teamName.trim().length == 0)
	            		errorMsg.push(teamNameMsg);   
	            	if(userInfo == undefined)
	            		errorMsg.push(userMsg);
					if(userInfo && userInfo.role != "Player")
	            		errorMsg.push(teamManagerMsg);


					if(teamformatInfo)
					{
						teamMemTFList = teamformatInfo.mandatoryPlayersArray;

						teamMemTFPlayerList =_.map(teamformatInfo.playerFormatArray, function(json){ return json.playerNo; });
						if(data.teamMembers.length < teamformatInfo.mandatoryPlayersArray.length)					
							errorMsg.push(teamMemMandMsg);
							
								
						
						for(var i =0 ; i< data.teamMembers.length;i++)
						{
							var teamMem = data.teamMembers[i];
							teamMemList.push(teamMem.playerNumber);

							var teamMemberInfo = Meteor.users.findOne({"userId":teamMem.playerId,"role":"Player"})
							if(teamMemberInfo == undefined)
								subErrorMsg.push("Invalid team member "+teamMem.playerId);

						}
							
						//console.log("teamMemTFPlayerList  .. "+teamMemTFPlayerList);
						//console.log("team format mandatory .. "+teamMemTFList);
						//console.log("team member list .. "+teamMemList);
			
						var mandatoryCheck = _.difference(teamMemTFList, teamMemList);
						if(mandatoryCheck.length > 0)
							errorMsg.push("Mandatory players "+mandatoryCheck.toString() +" missing")
							
						var teamPlayerNoCheck = _.difference(teamMemList,teamMemTFPlayerList);
						if(teamPlayerNoCheck.length >0)
							errorMsg.push("Invalid team format players :"+teamPlayerNoCheck.toString());

						errorMsg = errorMsg.concat(subErrorMsg);
				
					}

					else{
						errorMsg.push(teamFormatMsg)
					}
					//console.log("errorMsg .. "+JSON.stringify(errorMsg));

					if(errorMsg.length > 0)
					{
						//console.log("contains errors");
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not create team";
						return resultJson;
					}
					else
					{
				
						//console.log("continue code")
						var result = await Meteor.call("saveNewTeamData",data);
						//console.log("saveNewTeamData .. "+JSON.stringify(result));
						if(result)
						{
							var teamId = result;

							var dbColl = {};
							dbColl["playerTeams"] = playerTeams.find({"_id":teamId}).fetch();
								
							var resultJson = {};
							resultJson["status"] = "success";
							resultJson["dbColl"] = dbColl;
							resultJson["message"] = "Team Created";

							//console.log("resultJson ... "+JSON.stringify(resultJson));
							return resultJson;

							
							/*else
							{
								var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Could not create tournament";
								return resultJson;
							}*/
						}
						else
						{
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["message"] = "Could not create team";
							return resultJson;
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
			//console.log(e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not create team "+e;
			return resultJson;
		}
	},


	
	
	"modifyTFTeam":async function(data)
	{
		try{
			if(data)
			{
				//{"teamManager":"EePtJ4LEaygnRtfxQ","teamMembers":[
				//{"playerId":"FCeHibWZfzpSBgeXJ","playerNumber":"p1"},
				//{"playerId":"p3GuyEtTs2RX55d3W","playerNumber":"p2"}],
				//"teamId":"yjRcDuktHzHxy2AAQ"}

				var teamFormatMsg = "Invalid team format";
				var teamMemMsg = "Invalid team member";
				var teamNameMsg = "Team Name mandatory";
				var teamMemMandMsg ="Add mandatory players"
				var userMsg = "Invalid user";

				var teamMsg = "Invalid Team";
				var teamManagerMsg = "Only Team Manager can edit team";
				var subscriptionMsg = "Team cannot be removed as team has subscribed to tournaments";


				var errorMsg = [];
				var subErrorMsg = [];
				var teamMemList = [];

				var teamMemTFList = [];
				var teamMemTFPlayerList = [];

				var objCheck = Match.test(data, { userId:String,teamId: String, 
							"teamMembers":[{"playerId":String,playerNumber:String}]});
				if(objCheck)
				{
					var userInfo = Meteor.users.findOne({"_id": data.userId});
	            	var teamInfo = playerTeams.findOne({"_id":data.teamId});
	            	var teamformatInfo ;
        		            		      

	            	if(userInfo == undefined)
	            		errorMsg.push(userMsg);
	            	if(teamInfo == undefined)
	            		errorMsg.push(teamMsg);
	            	if(userInfo && teamInfo && teamInfo.teamManager != data.userId)			
	            		errorMsg.push(teamManagerMsg);
	            	if(teamInfo){
	            		teamformatInfo = teamsFormat.findOne({"_id":teamInfo.teamFormatId});
	            		if(teamformatInfo == undefined)
	            			errorMsg.push(teamFormatMsg);

	            	}

	            	


					if(teamformatInfo)
					{
						teamMemTFList = teamformatInfo.mandatoryPlayersArray;

						teamMemTFPlayerList =_.map(teamformatInfo.playerFormatArray, function(json){ return json.playerNo; });
						if(data.teamMembers.length < teamformatInfo.mandatoryPlayersArray.length)					
							errorMsg.push(teamMemMandMsg);
							
								
						
						for(var i =0 ; i< data.teamMembers.length;i++)
						{
							var teamMem = data.teamMembers[i];
							teamMemList.push(teamMem.playerNumber);

							var teamMemberInfo = Meteor.users.findOne({"userId":teamMem.playerId,"role":"Player"})
							if(teamMemberInfo == undefined)
								subErrorMsg.push("Invalid team member "+teamMem.playerId);

						}
							
						//console.log("teamMemTFPlayerList  .. "+teamMemTFPlayerList);
						//console.log("team format mandatory .. "+teamMemTFList);
						//console.log("team member list .. "+teamMemList);
			
						var mandatoryCheck = _.difference(teamMemTFList, teamMemList);
						if(mandatoryCheck.length > 0)
							errorMsg.push("Mandatory players "+mandatoryCheck.toString() +" missing")
							
						var teamPlayerNoCheck = _.difference(teamMemList,teamMemTFPlayerList);
						if(teamPlayerNoCheck.length >0)
							errorMsg.push("Invalid team format players :"+teamPlayerNoCheck.toString());

						errorMsg = errorMsg.concat(subErrorMsg);
				
					}

					
					//console.log("errorMsg .. "+JSON.stringify(errorMsg));

					if(errorMsg.length > 0)
					{
						//console.log("contains errors");
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not create team";
						return resultJson;
					}
					else
					{
				
						//console.log("continue code");

						var result = await Meteor.call("updatePlayerTeam",data,data.teamId);
						//console.log("updatePlayerTeam .. "+JSON.stringify(result));
						if(result)
						{

							var dbColl = {};
							dbColl["playerTeams"] = playerTeams.find({"_id":data.teamId}).fetch();
								
							var resultJson = {};
							resultJson["status"] = "success";
							resultJson["dbColl"] = dbColl;
							resultJson["message"] = "Team Modified";

							//console.log("resultJson ... "+JSON.stringify(resultJson));
							return resultJson;

							
							
						}
						else
						{
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["message"] = "Could not modify team";
							return resultJson;
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
			//console.log(e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not create team "+e;
			return resultJson;
		}
	},
	"viewTFTeam":async function(data)
	{
		try{
			if(data)
			{
				/*{
					"teamId":"EePtJ4LEaygnRtfxQ",
				}*/

				var errorMsg = [];
				var teamMsg = "Invalid Team";

				var objCheck = Match.test(data, {teamId: String});
				if(objCheck)
				{
	            	var teamInfo = playerTeams.findOne({"_id":data.teamId});

	            	if(teamInfo == undefined)
	            		errorMsg.push(teamMsg)

					if(errorMsg.length > 0)
					{
						//console.log("contains errors");
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not view team";
						return resultJson;
					}
					else
					{
				
						var result = await Meteor.call("viewPlayerTeam",data.teamId);
						//console.log("viewPlayerTeam .. "+JSON.stringify(result));
						if(result)
						{
					
							var resultJson = {};
							resultJson["status"] = "success";
							resultJson["message"] = "Team Details Fetched";
							resultJson["data"] = result;

							//console.log("resultJson ... "+JSON.stringify(resultJson));
							return resultJson;

						}
						else
						{
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["message"] = "Could not fetch team details";
							return resultJson;
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
			resultJson["message"] = "Could not fetch team details "+e;
			return resultJson;
		}
	},
	"deleteTFTeam":async function(data)
	{
		try{
			if(data)
			{
				/*{"userId":"KEb4BKTx5ue4vTunS",
				"teamId":"EePtJ4LEaygnRtfxQ",
				}*/

				var errorMsg = [];

				var userMsg = "Invalid User Credentails";
				var teamMsg = "Invalid Team";
				var teamManagerMsg = "Only Team Manager can delete team";
				var subscriptionMsg = "Team cannot be removed as team has subscribed to tournaments";

				var objCheck = Match.test(data, { userId: String, teamId: String});
				if(objCheck)
				{
					var userInfo = Meteor.users.findOne({"_id": data.userId});
	            	var teamInfo = playerTeams.findOne({"_id":data.teamId});

	       
	            	if(userInfo == undefined)
	            		errorMsg.push(userMsg);
	            	if(teamInfo == undefined)
	            		errorMsg.push(teamMsg)

					if(teamInfo && teamInfo.teamManager != data.userId)			
	            		errorMsg.push(teamManagerMsg);

	            	var subscribedTour = playerTeamEntries.find({"subscribedTeamID":{$in:[data.teamId]}}).fetch();
	                if(subscribedTour.length > 0)	           
	                    errorMsg.push(subscriptionMsg)
	         
					
					if(errorMsg.length > 0)
					{
						//console.log("contains errors");
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not delete team";
						return resultJson;
					}
					else
					{
				
						var result = await Meteor.call("deleteTeam",data.teamId);
						//console.log("deleteTeam .. "+JSON.stringify(result));
						if(result)
						{
					
							var resultJson = {};
							resultJson["status"] = "success";
							resultJson["message"] = "Team Removed";

							//console.log("resultJson ... "+JSON.stringify(resultJson));
							return resultJson;

						}
						else
						{
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["message"] = "Could not remove team";
							return resultJson;
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
			//console.log(e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not remove team "+e;
			return resultJson;
		}
	},
	"fetchTFTeams":async function(data)
	{
		try{
			if(data)
			{
				/*{"userId":"KEb4BKTx5ue4vTunS",
				}*/

				var errorMsg = [];

				var userMsg = "Invalid User Credentails";

				var objCheck = Match.test(data, { userId: String});
				if(objCheck)
				{
					var userInfo = Meteor.users.findOne({"_id": data.userId});

	            	if(userInfo == undefined)
	            		errorMsg.push(userMsg);
	            	
	         	       				
					if(errorMsg.length > 0)
					{
						//console.log("contains errors");
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch team";
						return resultJson;
					}
					else
					{
				
						var result = await Meteor.call("myTeamsOfPlayer",data.userId);
						////console.log("myTeamsOfPlayer .. "+JSON.stringify(result));
						if(result)
						{
							var dbColl = {};
							if(result.teams)
								dbColl["playerTeams"] = result.teams;
							if(result.teamFormatList)
								dbColl["teamFormatList"] =result.teamFormatList;

							var resultJson = {};
							resultJson["status"] = "success";
							resultJson["message"] = "Teams Fetched";
							resultJson["data"] =dbColl;
							//console.log("resultJson ... "+JSON.stringify(resultJson));
							return resultJson;

						}
						else
						{
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["message"] = "Could not fetch teams";
							return resultJson;
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
			//console.log(e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch teams : "+e;
			return resultJson;
		}
	}
})