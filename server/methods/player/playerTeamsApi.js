import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
	
	validateExistingTeam:async function(teamId)
	{
		try{

		var playerTeamInfo = playerTeams.findOne({"_id":teamId});
		var playerTeamMembers = [];

		if(playerTeamInfo && playerTeamInfo.teamFormatId)
		{
			var teamformatInfo = teamsFormat.findOne({"_id":playerTeamInfo.teamFormatId})
			if(playerTeamInfo.teamMembers && teamformatInfo && teamformatInfo.playerFormatArray)
			{
				for(var n=0 ;n <teamformatInfo.playerFormatArray.length; n++)
				{
					var playerFormat = teamformatInfo.playerFormatArray[n];

					if(playerFormat.playerNo)
						{
							var playerMemInfo = playerTeams.findOne({"_id":teamId,"teamMembers.playerNumber":playerFormat.playerNo},
								{fields:{_id: 0, teamMembers: {$elemMatch: {"playerNumber": playerFormat.playerNo}}}});
							
							if(playerMemInfo)
							{
								var playerNumber = playerFormat.playerNo;
								var playerId = playerMemInfo.teamMembers[0].playerId;
								var teamFormatId = playerTeamInfo.teamFormatId;
								var response = await Meteor.call("teamMemberValidation",playerNumber,playerId,teamFormatId,playerTeamInfo.teamManager);
								try{
								if(response == "valid")
								{
									var memberJson = {};
									memberJson["mandatory"] = playerFormat.mandatory;
									memberJson["dateType"] = playerFormat.dateType;
									memberJson["dateValue"] = "";
									memberJson["gender"] = playerFormat.gender;
									memberJson["locationType"] = playerFormat.locationType;
									memberJson["playerName"] = "";
									memberJson["playerNumber"] = playerFormat.playerNo;
									memberJson["playerId"] = playerId;
									playerTeamMembers.push(memberJson);
									if(playerFormat.dateValue)
										memberJson["dateValue"] = playerFormat.dateValue;
									var playerInfo;
									if(nameToCollection(playerId))
									{
										playerInfo = nameToCollection(playerId).findOne({"userId":playerId});
									}
									if(playerInfo)
										memberJson["playerName"] = playerInfo.userName;

								}
								else
								{
									return false;
								}
								}catch(e){}
							}
							else
							{
								if(playerFormat.mandatory == "yes")
								 	return false;
								else
								{
									var memberJson = {};
									memberJson["mandatory"] = playerFormat.mandatory;
									memberJson["dateType"] = playerFormat.dateType;
									memberJson["dateValue"] = "";
									memberJson["gender"] = playerFormat.gender;
									memberJson["locationType"] = playerFormat.locationType;
									memberJson["playerId"] = "";
									memberJson["playerName"] = "";
									memberJson["playerNumber"] = playerFormat.playerNo;

									if(playerFormat.dateValue)
										memberJson["dateValue"] = playerFormat.dateValue;
									playerTeamMembers.push(memberJson);
								}
							
							}							
						}
					

				}
				playerTeamInfo.teamMembers = playerTeamMembers;
				return playerTeamInfo;
			}
		}
		else
		{
			return false;
		}


		}catch(e){
		}
	},
	myTeamsOfPlayer:async function(userId)
	{
		try{
			var json = {};
			var aa = await Meteor.call("updateDomainDetails",userId);       
	
			//Meteor.call("editTeamDetails","bjpAhq8vQpk76fnsx","EePtJ4LEaygnRtfxQ");
			var raw = playerTeams.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var teamID = distinct('teamFormatId',{$or:[
					{"teamManager":userId},
					{
						"teamMembers": { $elemMatch: {"teamEvent": true}},
						"teamMembers": { $elemMatch: {"playerId": userId}},
					}
					]});

			var teamFormatList = teamsFormat.find({"_id":{$in:teamID}},{
				fields:{
					"_id":1,"teamFormatName":1,"rankedOrNot":1,
					"playerFormatArray":1
				}
			}).fetch();


			var teamList = playerTeams.aggregate([
				{$match:{
					$or:[
						{"teamManager":userId},
						{
							"teamMembers": { $elemMatch: {"playerId": userId}},
						}
					]
				}},
				{$unwind:"$teamMembers"},
				{$sort: {"teamMembers.playerNumber":1}},
				{$group:{"_id":"$_id",
				        "teamFormatId": { "$first": "$teamFormatId"},
				        "teamName": { "$first": "$teamName"},
				        "teamManager": { "$first": "$teamManager"},
				        "source": { "$first": "$source"},
				        "teamAffiliationId": { "$first": "$teamAffiliationId"},
				        "schoolId": { "$first": "$schoolId"},
				        "subscriptionForSchool": { "$first": "$subscriptionForSchool"},
				        teamMembers: {$push:"$teamMembers"}}},		
				/*{
	                $lookup:{
	                    from: "teamsFormat",       
	                    localField: "teamFormatId",   
	                    foreignField: "_id", 
	                    as: "teamFormatDetails"        
	                }
	            },
            	{$unwind:"$teamFormatDetails" },
            	{ 
                            $project : { 
                                "_id":1,
                                "teamFormatId":1,
                                "teamName":1,
                                "teamManager":1,
                                "source":1,
                                "teamAffiliationId":1,
                                "schoolId":1,
                                "subscriptionForSchool":1,
                                "teamMembers":1,
                                "teamFormatName":"$teamFormatDetails.teamFormatName",
                            	"teamFormatDetails":"$teamFormatDetails"
                            } 
            } */
            ])
			

			/*var teamList = playerTeams.aggregate([{$match:{$or:[{"teamManager":userId},{"teamMembers.playerId":{$in:[userId]}}]}},
				{$project:{teamName:1,"teamFormatId":1,"teamName":1,"teamManager":1,"source":1,"subscriptionForSchool":1,"teamAffiliationId":1, teamMembers:
					{ $cond : [ { $eq : [ "$teamMembers", [] ] }, [ "" ], '$teamMembers' ] }  
				}},{$unwind:"$teamMembers"},{$sort: {"teamMembers.playerNumber":1}},
				{$group:{"_id":"$_id",
				        "teamFormatId": { "$first": "$teamFormatId"},
				        "teamName": { "$first": "$teamName"},
				        "teamManager": { "$first": "$teamManager"},
				        "source": { "$first": "$source"},
				        "teamAffiliationId": { "$first": "$teamAffiliationId"},
				        "schoolId": { "$first": "$schoolId"},
				        "subscriptionForSchool": { "$first": "$subscriptionForSchool"},
				        teamMembers: {$push:"$teamMembers"}}}])


			/*var registeredPlayersArr = userDetailssTT.aggregate([
		            {$match:{      
		                userName:{$nin:["",null]},
		            }},           
		            {$group: { "_id":{
		              "playerName":"$userName",
		              "userId":"$userId"}
		            }},
		            {$project:{
		              "playerName":"$_id.playerName" ,
		              "userId":"$_id.userId",
		              "_id":0,
		            }}
	        ]);*/


			json["teamFormatList"] = teamFormatList;
			json["teams"] = teamList;
 


			return json;

		}catch(e){
		}
	},
	viewPlayerTeam:function(teamId)
	{
		try
		{
			var playerTeamMembers = [];
			var playerTeamInfo = playerTeams.findOne({"_id":teamId});
			if(playerTeamInfo)
			{
				playerTeamInfo.teamManagerName = "";
				if(playerTeamInfo.teamManager)
				{
					var teamManagerInfo = Meteor.users.findOne({"userId":playerTeamInfo.teamManager});
					if(teamManagerInfo)
						playerTeamInfo.teamManagerName = teamManagerInfo.userName;
				}
				if(playerTeamInfo.teamMembers)
				{
					var teamformatInfo = teamsFormat.findOne({"_id":playerTeamInfo.teamFormatId})
					for(var n=0 ;n <teamformatInfo.playerFormatArray.length; n++)
					{
						var playerFormat = teamformatInfo.playerFormatArray[n];

						if(playerFormat.playerNo)
							{
								var playerMemInfo = playerTeams.findOne({"_id":teamId,"teamMembers.playerNumber":playerFormat.playerNo},
									{fields:{_id: 0, teamMembers: {$elemMatch: {"playerNumber": playerFormat.playerNo}}}});
								
								if(playerMemInfo)
								{
									var playerNumber = playerFormat.playerNo;
									var playerId = playerMemInfo.teamMembers[0].playerId;
									var teamFormatId = playerTeamInfo.teamFormatId;
									var memberJson = {};
									memberJson["mandatory"] = playerFormat.mandatory;
									memberJson["dateType"] = playerFormat.dateType;
									memberJson["dateValue"] = "";
									memberJson["gender"] = playerFormat.gender;
									memberJson["locationType"] = playerFormat.locationType;
									memberJson["playerName"] = "";
									memberJson["playerNumber"] = playerFormat.playerNo;
									memberJson["playerId"] = playerId;
									playerTeamMembers.push(memberJson);
									if(playerFormat.dateValue)
										memberJson["dateValue"] = playerFormat.dateValue;
									var playerInfo = nameToCollection(playerId).findOne({"userId":playerId});
									if(playerInfo)
										memberJson["playerName"] = playerInfo.userName;	
								}
								else
								{
									 
									var memberJson = {};
									memberJson["mandatory"] = playerFormat.mandatory;
									memberJson["dateType"] = playerFormat.dateType;
									memberJson["dateValue"] = "";
									memberJson["gender"] = playerFormat.gender;
									memberJson["locationType"] = playerFormat.locationType;
									memberJson["playerId"] = "";
									memberJson["playerName"] = "";
									memberJson["playerNumber"] = playerFormat.playerNo;

									if(playerFormat.dateValue)
										memberJson["dateValue"] = playerFormat.dateValue;
									playerTeamMembers.push(memberJson);
								}							
							}
						

					}
					playerTeamInfo.teamMembers = playerTeamMembers;

					return playerTeamInfo;
				}
			}
			else
			{

			}
		}catch(e)
		{
			errorLog(e)
		}	
	},
	editTeamDetails:async function(teamId,userId)
	{
		try{
			var playerTeamInfo = playerTeams.findOne({"_id":teamId});
			if(playerTeamInfo)
			{
				playerTeamInfo.teamManagerName = "";
				if(playerTeamInfo.teamManager)
				{
					var teamManagerInfo = Meteor.users.findOne({"userId":playerTeamInfo.teamManager});
					if(teamManagerInfo)
						playerTeamInfo.teamManagerName = teamManagerInfo.userName;
				}

				var teamformatInfo = teamsFormat.findOne({"_id":playerTeamInfo.teamFormatId})

				playerTeamInfo.teamFormatName = teamformatInfo.teamFormatName;
				playerTeamInfo.teamMembers = teamformatInfo.playerFormatArray;
				playerTeamInfo.mandatoryPlayersArray =  teamformatInfo.mandatoryPlayersArray
				if(playerTeamInfo.teamMembers)
				{
					for(var i =0; i<teamformatInfo.playerFormatArray.length;i++)
					{
						var playerFormat = teamformatInfo.playerFormatArray[i];
						var response = await Meteor.call("fetchPlayerListOnCriteria",playerFormat,teamformatInfo.rankedOrNot,userId,teamformatInfo.selectedProjectId);
						try{
						if(playerFormat.playerNo)
						{
							var playerMemInfo = playerTeams.findOne({"_id":teamId,"teamMembers.playerNumber":playerFormat.playerNo},
								{fields:{_id: 0, teamMembers: {$elemMatch: {"playerNumber": playerFormat.playerNo}}}});
							if(playerMemInfo)
							{
								var customJson = {};					
								//starts here
								customJson["mandatory"] = playerFormat.mandatory;
								customJson["dateType"] = playerFormat.dateType;
								customJson["dateValue"] = "";
								customJson["gender"] = playerFormat.gender;
								customJson["locationType"] = playerFormat.locationType;
								if(playerFormat.dateValue)
									customJson["dateValue"] = playerFormat.dateValue;

								//ends here
								customJson.playerId = playerMemInfo.teamMembers[0].playerId;
								customJson.playerNumber = playerFormat.playerNo;
								customJson.playerJsonList = response;
								playerTeamInfo.teamMembers[i] = customJson;
							}
							else
							{
								var customJson = {};
								
								//starts here
								customJson["mandatory"] = playerFormat.mandatory;
								customJson["dateType"] = playerFormat.dateType;
								customJson["dateValue"] = "";
								customJson["gender"] = playerFormat.gender;
								customJson["locationType"] = playerFormat.locationType;
								if(playerFormat.dateValue)
									customJson["dateValue"] = playerFormat.dateValue;
								//ends here

								customJson.playerId = "";
								customJson.playerNumber = playerFormat.playerNo;
								customJson.playerJsonList = response;
								playerTeamInfo.teamMembers[i] = customJson;
							}
							

						}
						}catch(e){}
					}	
				}
				return playerTeamInfo;
			}
		}catch(e){
		}
	},
	createTeamFormatFilters:async function(userId)
	{
		try{
			var teamFormatList;
			var playerInfo = nameToCollection(userId).findOne({"userId":userId})
		    if(playerInfo)
		    {
		        if(playerInfo.interestedProjectName && playerInfo.interestedProjectName.length > 0)
		        {
		          if(playerInfo.interestedProjectName[0] == null || playerInfo.interestedProjectName[0] == "")
		          {
		            var raw = tournamentEvents.rawCollection();
		            var distinct = Meteor.wrapAsync(raw.distinct, raw);
		            var interestedProjectNameList =  distinct('_id');

		            var raw = domains.rawCollection();
		            var distinct = Meteor.wrapAsync(raw.distinct, raw);
		            var interestedDomainNameList =  distinct('_id');


		            nameToCollection(userId).update({"userId":userId},{
		              $set:{
		                //"interestedProjectName":interestedProjectNameList,
		                "interestedDomainName":interestedDomainNameList
		              }
		            })

		            /*Meteor.users.update({"userId":userId},{
		              $set:{
		                "interestedProjectName":interestedProjectNameList
		              }
		            })*/
		          }
		        }
		    }  
			var userInfo = Meteor.users.findOne({"userId":userId});
			if(userInfo)
			{
				if(userInfo.interestedProjectName && userInfo.interestedProjectName != null)
				{
					var sportID = userInfo.interestedProjectName[0];
					teamFormatList = teamsFormat.find({"selectedProjectId":sportID.trim()},{sort:{teamFormatName:1}}).fetch();
				}
				else
					teamFormatList = teamsFormat.find({},{sort:{teamFormatName:1}}).fetch();
			}
			else
			 	teamFormatList = teamsFormat.find({},{sort:{teamFormatName:1}}).fetch();

			if(teamFormatList.length> 0)
			{
				teamFormatList[0].playerFormatArray = await Meteor.call("fetchPlayersOnTeamValidation",teamFormatList[0]._id,userId);
			}
		    	
		    return teamFormatList;

		}catch(e){
		}

	},
	"typeBasedTeams":function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{
				var objCheck = Match.test(data, {
					"teamType": String,"year":String,
				});
				if(objCheck)
				{

					var teamFormatInfo = teamsFormat.findOne({"teamFormatName":{
                        $regex: new RegExp('^' + data.teamType + '$', "i")}});
					if(teamFormatInfo)
					{				
						var createdYear = parseInt(data.year);
						var playerTeamList = playerTeams.aggregate([
                            {$match:{
                            	"teamFormatId":teamFormatInfo._id,
                            	"createdDate":{$nin:[null,"",undefined]}
                            }},
                            {$project : { 
                                diaryYear : {$year :  "$createdDate"},
                                "teamManager":"$teamManager",
                                "teamFormatId":"$teamFormatId",
                            	"teamName":"$teamName",
                            	"teamOwners":"$teamOwners",
                            	"teamCoach":"$teamCoach" 
                            }},
                            {$match:{
                            	"diaryYear":createdYear
                            }}
                        ]);

						if( playerTeamList && playerTeamList.length > 0)
						{
							successJson["teamList"] = playerTeamList;
							successJson["message"] = ""

							return successJson
						}
						else
						{
							failureJson["message"] = "No teams";
							return failureJson
						}
					}
					else
					{
						failureJson["message"] = "Invalid team format";
						return failureJson;
					}
				}
				else
				{
					failureJson["message"] = "Require all parameters";
					return failureJson;
				}

			}
			else
			{
				failureJson["message"] = "Invalid data";
				return failureJson;
			}

		}catch(e){
			failureJson["message"] = "Invalid data"+e;
			return failureJson;

		}
	},
	"fetchTeamPoints":function(data){
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{
				var objCheck = Match.test(data, {
					"year":String,"tournamentId":String
				});
				if(objCheck)
				{
						
					var createdYear = parseInt(data.year);
					var playerTeamList = teamPoints.aggregate([
                        {$match:{
                            "year":createdYear,
                            "tournamentId":data.tournamentId
                        }},
                        {$lookup:{
	                   		from: "playerTeams",       
	                   		localField: "teamId",   
	                   		foreignField: "_id", 
	                   		as: "teamDetails"        
	               		}},
            			{$unwind:"$teamDetails"},
            			{$project : { 
                            "_id":1,
                            "teamId":1,
                            "teamName":"$teamDetails.teamName",
                            "played":1,"won":1,
                            "loss":1,"points":1,
                        }},
                        {$sort:{
                        	"points":-1
                        }}                                
                    ]);


					if( playerTeamList && playerTeamList.length > 0)
					{
						playerTeamList.map(function(document, index) {
              				document["slNo"] = parseInt(index + 1);
            			});
						successJson["teamList"] = playerTeamList;
						successJson["message"] = ""
						return successJson
					}
					else
					{
						failureJson["message"] = "No team points";
						return failureJson
					}					
				}
				else
				{
					failureJson["message"] = "Require all parameters";
					return failureJson;
				}

			}
			else
			{
				failureJson["message"] = "Invalid data";
				return failureJson;
			}

		}catch(e){
			failureJson["message"] = "Invalid data"+e;
			return failureJson;

		}
	},
	"fetchTeamSchedule":function(data){
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{
				var objCheck = Match.test(data, {
					"tournamentId":String
				});
				if(objCheck)
				{
						
					var teamScheduleList = tourTeamSchedule.aggregate([
                        {$match:{
                            "tournamentId":data.tournamentId
                        }},
                        {$lookup:{
	                   		from: "playerTeams",       
	                   		localField: "teamAId",   
	                   		foreignField: "_id", 
	                   		as: "teamADetails"        
	               		}},
            			{$unwind:"$teamADetails" },
            			{$lookup:{
	                   		from: "playerTeams",       
	                   		localField: "teamBId",   
	                   		foreignField: "_id", 
	                   		as: "teamBDetails"        
	               		}},
            			{$unwind:"$teamBDetails"},
                        {$group:{"_id":{"matchDate":"$scheduleDate"},
                        	"scheduleList":{$push:{
                        		"scheduleDate":"$scheduleDate",
	                        	"startTime":"$startTime",
	                        	"endTime":"$endTime",
	                        	"teamAId":"$teamAId",
	                        	"teamAName":"$teamADetails.teamName",
	                        	"teamBId":"$teamBId",
	                        	"teamBName":"$teamBDetails.teamName",
	                        	"tableNo":"$tableNo"                    		
                        	}}
                        	
                    	}},
            			{$project : { 
            				"_id":0,
            				"scheduleDate":"$_id.matchDate",
            				"scheduleList":1
                        }},
                        {$sort:{
                        	"scheduleDate":1
                        }}                        
                    ]);


					if( teamScheduleList && teamScheduleList.length > 0)
					{
						successJson["data"] = teamScheduleList;
						successJson["message"] = "";
						return successJson
					}
					else
					{
						failureJson["message"] = "No schedule list";
						return failureJson
					}					
				}
				else
				{
					failureJson["message"] = "Require all parameters";
					return failureJson;
				}

			}
			else
			{
				failureJson["message"] = "Invalid data";
				return failureJson;
			}

		}catch(e){
			errorLog(e)
			failureJson["message"] = "Invalid data"+e;
			return failureJson;

		}
	}

});
