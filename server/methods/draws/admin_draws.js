import { MatchCollectionDB} from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB} from '../../publications/MatchCollectionDbTeam.js';

function playerDrawData(playerId,slNo,dbInstance,rankingType)
{
	var userInfo = global[dbInstance].findOne({"userId":playerId})
	if(userInfo)
	{
		var playerName = "";
		var academyName = "";
		var dataJson = {};
		dataJson["Sl.No"] = slNo;
		dataJson["Name"] = userInfo.userName;

		if(rankingType == "yes" && userInfo.affiliationId)
			dataJson["Affiliation ID"] = userInfo.affiliationId
		else
		{
			if(userInfo.tempAffiliationId)
				dataJson["Affiliation ID"] = userInfo.tempAffiliationId;
		}
		

		if (userInfo.clubNameId) 
		{
			var clubInfo = academyDetails.findOne({
				"userId": userInfo.clubNameId,
				"role": "Academy"
			});
			if(clubInfo)
				academyName = clubInfo.clubName;
		}
		else if(userInfo.schoolId)
		{
			var clubInfo = schoolDetails.findOne({
				"userId": userInfo.schoolId});
			if(clubInfo&&clubInfo.schoolName)
				academyName = clubInfo.schoolName;
		}
										
		dataJson["Academy Name"] = academyName;
		return dataJson;
	}
	else
	{
		var dataJson = {};
		dataJson["Sl.No"] = slNo;
		dataJson["Name"] = "";
		dataJson["Affiliation ID"] = "";
		dataJson["Academy Name"] = "";
		return dataJson;

	}
}

function teamDrawData(teamId,slNo,teamDB,userDB)
{
	var teamInfo = global[teamDB].findOne({"_id":teamId})
	if(teamInfo)
	{
		var teamName = "";
		var academyName = "";
		var dataJson = {};
		dataJson["Sl.No"] = slNo;
		dataJson["teamName"] = teamInfo.teamName;
		dataJson["teamAffiliationId"] = teamInfo.teamAffiliationId;

		var userInfo = global[userDB].findOne({"userId":teamInfo.teamManager});
		var affiliationId = " ";
	    var tempAffId = " ";
		if(userInfo)
		{
						
			if(userInfo.affiliationId==null||userInfo.affiliationId==undefined||userInfo.affiliationId=="other"){
	            affiliationId = " "
	        }
	        else {
	            affiliationId = userInfo.affiliationId
	        }

	        if(userInfo.tempAffiliationId==null||userInfo.tempAffiliationId==undefined||userInfo.tempAffiliationId=="other"){
	            tempAffId = " "
	        }
	        else {
	            tempAffId = userInfo.tempAffiliationId
	        }

			dataJson["managerAffiliationId"] = affiliationId;
			dataJson["temporaryAffiliationId"] = tempAffId;
		}
		else
		{
			dataJson["managerAffiliationId"] = "";
			dataJson["temporaryAffiliationId"] = "";
		}


		return dataJson;
	}
	else
	{
		var dataJson = {};
		dataJson["Sl.No"] = slNo;
		dataJson["teamName"] = "";
		dataJson["teamAffiliationId"] = "";
		dataJson["managerAffiliationId"] = "";
		dataJson["temporaryAffiliationId"] = "";
		return dataJson;

	}
}

Meteor.methods({

	"fetchDrawCSV":async function(data)
	{
		try{
			if(data && data.tournamentId && data.eventName)
			{
				var tourType = "";
				var dbInstance = "userDetailsTT";
				var rankingType = "";

				var dbsrequired = ["userDetailsTT"];

				var res = await Meteor.call('changeDbNameForDraws', data.tournamentId, dbsrequired)
	            if (res && res && res.changedDbNames && res.changedDbNames.length) 
	            {
	                dbInstance = res.changedDbNames[0];
	            }
				var drawExists = MatchCollectionDB.findOne({
					"tournamentId":data.tournamentId,
					"eventName":data.eventName});
				if(drawExists)
				{
					tourType = "individual";
				}
				if(drawExists == undefined)
				{
					drawExists = teamMatchCollectionDB.findOne({
						"tournamentId":data.tournamentId,
						"eventName":data.eventName
					})
					if(drawExists)
						tourType = "team"
				}

				if(tourType == "individual")
				{
					var eventInfo  = events.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName});
					if(eventInfo == undefined)
						eventInfo = pastEvents.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName});
					if(eventInfo && eventInfo.projectId && eventInfo.projectId.length > 0 && eventInfo.projectId[0])
					{
						eventId = eventInfo.projectId[0];

						var dobFilterInfo = dobFilterSubscribe.findOne({
							
			                "tournamentId": data.tournamentId,
			                "details.eventId": eventId
			            }, {
			                fields: {
			                    _id: 0,
			                    details: {
			                        $elemMatch: {
			                            "eventId": eventId
			                        }
			                    }
			                }
            			});
            			if (dobFilterInfo && dobFilterInfo.details.length > 0)      			 
                    		rankingType = dobFilterInfo.details[0].ranking;
            			
					}

					//yet to code
					var drawsInfo = MatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": data.tournamentId,
					        "eventName":data.eventName,
					    }
						}, {
						    $unwind: "$matchRecords"
						},
						
						{$match:{
								"matchRecords.roundNumber":1
							}},
						{$group:{"_id":"$matchRecords.matchNumber",
						    playerID1:{$push:{"matchNumber":"$matchRecords.matchNumber","pNo":"playerA","playerID":"$matchRecords.playersID.playerAId"}},
						    playerID2:{$push:{"matchNumber":"$matchRecords.matchNumber","pNo":"playerB","playerID":"$matchRecords.playersID.playerBId"}},
						    
						}},
						{$sort:{
							"_id":1
						}},
						{$project:{
								"_id":1,
               					"data": { "$setUnion": [ "$playerID1", "$playerID2" ] }, 
							}
						},
					]);


					var slNo = 0;
					var resultData = [];
					if(drawsInfo && drawsInfo.length > 0)
					{
						for(var i=0; i< drawsInfo.length; i++)
						{
							var dataJson = {};
							var playerData = drawsInfo[i].data;

							if(playerData[0].playerID != "")
							{
								slNo = slNo + 1;
								var playerJson = playerDrawData(playerData[0].playerID,slNo,dbInstance,rankingType);
								resultData.push(playerJson)
							}
							else
							{
								slNo = slNo + 1;
								var dataJson = {};
								dataJson["Sl.No"] = slNo;
								dataJson["Name"] = "";
								dataJson["Affiliation ID"] = "";
								dataJson["Academy Name"] = "";
								resultData.push(dataJson);
							}

							if(playerData[1].playerID != "")
							{
								slNo = slNo + 1;
								var playerJson = playerDrawData(playerData[1].playerID,slNo,dbInstance,rankingType);
									resultData.push(playerJson)
							}
							else
							{
								slNo = slNo + 1;

								var dataJson = {};
								dataJson["Sl.No"] = slNo;
								dataJson["Name"] = "";
								dataJson["Affiliation ID"] = "";
								dataJson["Academy Name"] = "";
								resultData.push(dataJson);

							}
							
						}
					}
					return resultData;
				}
				else if(tourType == "team")
				{
					//yet to code
					//yet to code

					var dbsrequired = ["userDetailsTT","playerTeamEntries","playerTeams"]          
		            var userDetailsTTDB = "userDetailsTT"
		            var playerTeamsDB = "playerTeams"

		            var res = await Meteor.call("changeDbNameForDraws", data.tournamentId,dbsrequired)
		            try {
						if(res){
							if(res.changeDb && res.changeDb == true){
								if(res.changedDbNames.length!=0)
								{
									userDetailsTTDB = res.changedDbNames[0]
						            playerTeamsDB = res.changedDbNames[2]
								}
							}
						}
					}catch(e){
					}

					var drawsInfo = teamMatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": data.tournamentId,
					        "eventName":data.eventName,
					    }
						}, {
						    $unwind: "$matchRecords"
						},
						
						{$match:{
								"matchRecords.roundNumber":1
							}},
						{$group:{"_id":"$matchRecords.matchNumber",
						    teamID1:{$push:{"matchNumber":"$matchRecords.matchNumber","tNo":"teamA","teamID":"$matchRecords.teamsID.teamAId"}},
						    teamID2:{$push:{"matchNumber":"$matchRecords.matchNumber","tNo":"teamB","teamID":"$matchRecords.teamsID.teamBId"}},
						    
						}},
						{$sort:{
							"_id":1
						}},
						{$project:{
								"_id":1,
               					"data": { "$setUnion": [ "$teamID1", "$teamID2" ] }, 
							}
						},
					]);

					var slNo = 0;
					var resultData = [];
					if(drawsInfo && drawsInfo.length > 0)
					{
						for(var i=0; i< drawsInfo.length; i++)
						{
							var dataJson = {};
							var playerData = drawsInfo[i].data;
							if(playerData[0].teamID != "")
							{
								slNo = slNo + 1;
								var playerJson = teamDrawData(playerData[0].teamID,slNo,playerTeamsDB,userDetailsTTDB);
								resultData.push(playerJson)
							}
							else
							{
								slNo = slNo + 1;
								var dataJson = {};
								dataJson["Sl.No"] = slNo;
								dataJson["teamName"] = "";
								dataJson["teamAffiliationId"] = "";
								dataJson["managerAffiliationId"] = "";
								dataJson["temporaryAffiliationId"] = "";
								resultData.push(dataJson);
							}

							if(playerData[1].teamID != "")
							{
								slNo = slNo + 1;
								var playerJson = teamDrawData(playerData[1].teamID,slNo,playerTeamsDB,userDetailsTTDB);
								resultData.push(playerJson)
							}
							else
							{
								slNo = slNo + 1;

								var dataJson = {};
								dataJson["Sl.No"] = slNo;
								dataJson["teamName"] = "";
								dataJson["teamAffiliationId"] = "";
								dataJson["managerAffiliationId"] = "";
								dataJson["temporaryAffiliationId"] = "";
								resultData.push(dataJson);

							}
							
						}
					}
					return resultData;
				}


			}
		}catch(e){
			errorLog(e)
		}
	}
})