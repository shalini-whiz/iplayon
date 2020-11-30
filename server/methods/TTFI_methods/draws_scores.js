import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import { setJson } from './draws_functions.js';
import { calcKnockOutindividualScore } from './drawsScoreFunctions.js';
import { calcRRindividualScore } from './drawsScoreFunctions.js';



Meteor.methods({

	"fetchMatchDetails":async function(data)
	{
		try{
			//console.log("entered fetchMatchDetails .. "+data.drawsType)
			if(data && data.drawsType)
			{
				var drawsType = data.drawsType.trim();
				if(drawsType.toLowerCase() == "knockout")
				{
					//console.log("check1")
					objCheck = Match.test(data, {"userId": String,"drawsType":String,
					"tournamentId":String,"eventName":String,
					"roundNumber":Match.Integer,"matchNumber":Match.Integer});
				}					
				else if(drawsType.toLowerCase() == "roundrobin")
				{
					//console.log("check2")

					objCheck = Match.test(data, { "userId": String,"drawsType":String,
					"tournamentId":String,"eventName":String,"groupID":String,
					"rowNo":Match.Integer,"colNo":Match.Integer});
				}		
				else
				{
					//console.log("check3")

					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Possible draw type - knockout/roundrobin";
					return resultJson;
				}

				
				if(objCheck)
				{
					var userId = data.userId.trim();
					
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var roundNumber = 0;
					var matchNumber = 0;
					var rowNo = 0;
					var colNo = 0;
					var groupID = "0";
					if(data.roundNumber)
						roundNumber = data.roundNumber;
					if(data.matchNumber)
						matchNumber = data.matchNumber;
					if(data.groupID)
						groupID = data.groupID;
					if(data.rowNo)
						rowNo = data.rowNo;
					if(data.colNo)
						colNo = data.colNo;

					var errorMsg = [];
					var userMsg = "Invalid user";
					var tourMsg = "Invalid tournament";
					var categoryMsg = "Invalid category/event";
					var drawsMsg = "Draws not found!!";
					var roundMatchMsg = "Invalid roundNumber/matchNumber";
					var idMsg = "Invalid record";
					var rowColMsg = "Invalid rowNo/colNo";

					var eventInfo = undefined;
					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo == undefined)
					{
						tourInfo = pastEvents.findOne({"_id":tournamentId});
						if(tourInfo == undefined)
							errorMsg.push(tourMsg);			
					}

					if(tourInfo)
					{
						eventInfo = events.findOne({"tournamentId":tournamentId,
							"eventName":eventName})
						if(eventInfo == undefined)
						{
							eventInfo = pastEvents.findOne({"tournamentId":tournamentId,
							"eventName":eventName});
							if(eventInfo == undefined)
								errorMsg.push(categoryMsg)
						}
					}

					if(tourInfo && eventInfo)
					{
						if(drawsType.toLowerCase() == "knockout")
						{
							if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
							{
								var drawsExists = MatchCollectionDB.findOne({
									"tournamentId":tournamentId,
									"eventName":eventName});
								if(drawsExists == undefined)
									errorMsg.push(drawsMsg);
								else if(drawsExists)
								{
									var roundExists = MatchCollectionDB.findOne({
										"tournamentId":tournamentId,
										"eventName":eventName,							
										"matchRecords": {
			                                $elemMatch: {
			                                    "matchNumber": matchNumber,
			                                    "roundNumber": roundNumber
			                                }
                            			}									
									});
									if(roundExists == undefined)
										errorMsg.push(roundMatchMsg);
								}
							}
							else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
							{
								//yet to code
							}
						}
						else if(drawsType.toLowerCase() == "roundrobin")
						{
							if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
							{
								var drawsExists = roundRobinEvents.findOne({
									"tournamentId":tournamentId,
									"eventName":eventName
								});
								if(drawsExists == undefined)
									errorMsg.push(drawsMsg);
								else if(drawsExists)
								{
									//console.log("groupID ... "+groupID)
									var dataExists = roundRobinEvents.findOne({
										"tournamentId":tournamentId,
										"eventName":eventName,
										"_id":groupID
										});
									if(dataExists == undefined)
										errorMsg.push(idMsg);
									else if(dataExists)
									{
										var roundExists = roundRobinEvents.findOne({
											"tournamentId":tournamentId,
											"eventName":eventName,
											"_id":groupID,
											"groupDetails": {
			                                	$elemMatch: {
			                                    	"rowNo": rowNo,
			                                    	"colNo": colNo
			                                	}
                            				}
											
										});
										if(roundExists == undefined)
											errorMsg.push(rowColMsg)

									}
								}

							}
							else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
							{
								//yet to code
							}
						}
					}


					if(errorMsg.length > 0)
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch tournament match details";
						return resultJson;
					}
					else
					{
						//console.log("continue code");
						var paramData = {};
						paramData["tournamentId"] = tournamentId;
						paramData["eventName"] = eventName;
						paramData["roundNumber"] = roundNumber;
						paramData["matchNumber"] = matchNumber;
						paramData["groupID"] = groupID;
						paramData["rowNo"] = rowNo;
						paramData["colNo"] = colNo;
						paramData["drawsType"] = drawsType.toLowerCase();
						paramData["projectType"] = eventInfo.projectType;

						var result = await Meteor.call("fetchRoundMatchScores",paramData)
						//console.log("fetchRoundMatchScores .. "+JSON.stringify(result));
						return result;
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
			console.log(e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch empty match details "+e;
			return resultJson;
		}
	},
	"setMatchDetails":async function(data)
	{
		try{
			//console.log("entered setMatchDetails .. "+data.drawsType+" ... "+JSON.stringify(data))
			if(data && data.drawsType)
			{
				var drawsType = data.drawsType.trim();
				if(drawsType.toLowerCase() == "knockout")
				{				
					//console.log("entered knockout")		


					objCheck = Match.test(data, {"userId": String,
						"drawsType":String,
						"tournamentId":String,"eventName":String,
						"roundNumber":Match.Integer,"matchNumber":Match.Integer,
						"status":String,"winnerID":String,
						"playersID":{"playerAId":String,"playerBId":String},
						"completedscores":Match.Maybe([String]),
						//"scores":Match.Maybe({"setScoresA":[String],"setScoresB":[String]}
							//),

					});		


				}					
				else if(drawsType.toLowerCase() == "roundrobin")
				{
					objCheck = Match.test(data, { "userId": String,
						"drawsType":String,
						"tournamentId":String,"eventName":String,"groupID":String,
						"rowNo":Match.Integer,"colNo":Match.Integer,
						"status":String,"winnerID":String,
						"playersID":{"playerAId":String,"playerBId":String},
						"scores":Match.Maybe({"setScoresA":[String],"setScoresB":[String]})
					});
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

					var errorMsg = [];
					var userMsg = "Invalid user";
					var tourMsg = "Invalid tournament";
					var categoryMsg = "Invalid category/event";
					var drawsMsg = "Draws not found!!";
					var roundMatchMsg = "Invalid roundNumber/matchNumber";
					var statusMsg = "Possible status type - bye/walkover/completed"
					var scoreMsg = "Scores are empty";
					var pastTourMsg = "Cannot update scores in past tournaments"
					var rowColMsg = "Invalid rowNo/colNo";

					var userId = data.userId.trim();					
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();					
					var roundNumber = data.roundNumber;
					var matchNumber = data.matchNumber;
					var status = data.status.trim();
					var winnerID = data.winnerID.trim();
					var playersID = data.playersID;
					var playerAId = data.playersID.playerAId.trim();
					var playerBId = data.playersID.playerBId.trim();
					var tourType = "";
					var completedscores = [];
					if(data.completedscores)
						completedscores = data.completedscores;
					var groupID = "";
					var rowNo = 0;
					var colNo = 0;
					if(data.rowNo)
						rowNo = data.rowNo;
					if(data.colNo)
						colNo = data.colNo;
					if(data.groupID)
						groupID = data.groupID;


					var eventInfo = undefined;
					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					if(status != "bye" && status != "walkover" && status != "completed")
						errorMsg.push(statusMsg)

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo == undefined)
					{
						tourInfo = pastEvents.findOne({"_id":tournamentId});
						if(tourInfo == undefined)
							errorMsg.push(tourMsg);	
						else
						{
							tourType = "past"
							errorMsg.push(pastTourMsg);	
						}		
					}
					else
						tourType = "new"

					if(tourInfo)
					{
						eventInfo = events.findOne({"tournamentId":tournamentId,
							"eventName":eventName})
						if(eventInfo == undefined)
						{
							eventInfo = pastEvents.findOne({"tournamentId":tournamentId,
							"eventName":eventName});
							if(eventInfo == undefined)
								errorMsg.push(categoryMsg)
						}
					}
					if(status == "completed" && data.completedscores == undefined && drawsType == "knockout")					
						errorMsg.push(scoreMsg)
					
					if(tourInfo && eventInfo)
					{
						if(drawsType.toLowerCase() == "knockout")
						{
							if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
							{
								var drawsExists = MatchCollectionDB.findOne({
									"tournamentId":tournamentId,
									"eventName":eventName});
								if(drawsExists == undefined)
									errorMsg.push(drawsMsg);
								else if(drawsExists)
								{
									var roundExists = MatchCollectionDB.findOne({
										"tournamentId":tournamentId,
										"eventName":eventName,							
										"matchRecords": {
			                                $elemMatch: {
			                                    "matchNumber": matchNumber,
			                                    "roundNumber": roundNumber
			                                }
                            			}									
									});
									if(roundExists == undefined)
										errorMsg.push(roundMatchMsg);
								}
							}
							else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
							{
								//yet to code
							}
						}
						else if(drawsType.toLowerCase() == "roundrobin")
						{
							if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
							{
								var groupID = data.groupID;
								var drawsExists = roundRobinEvents.findOne({
									"tournamentId":tournamentId,
									"eventName":eventName
								});
								if(drawsExists == undefined)
									errorMsg.push(drawsMsg);
								else if(drawsExists)
								{
									var dataExists = roundRobinEvents.findOne({
										"tournamentId":tournamentId,
										"eventName":eventName,
										"_id":groupID
										});
									if(dataExists == undefined)
										errorMsg.push(idMsg);
									else if(dataExists)
									{
										var roundExists = roundRobinEvents.findOne({
											"tournamentId":tournamentId,
											"eventName":eventName,
											"_id":groupID,
											"groupDetails": {
			                                	$elemMatch: {
			                                    	"rowNo": rowNo,
			                                    	"colNo": colNo
			                                	}
                            				}
											
										});
										if(roundExists == undefined)
											errorMsg.push(rowColMsg)

									}
								}

							}
							else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
							{
								//yet to code
							}
						}
					}


					if(errorMsg.length > 0)
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch tournament match details";
						return resultJson;
					}
					else
					{
						//console.log("continue code");
						var matchRecords = {};
					
						if(drawsType == "knockout")
						{
							if(eventInfo.projectType == 1 || eventInfo.projectType == "1")
							{
								var paramData = {};
								paramData["tournamentId"] = tournamentId;
								paramData["eventName"] = eventName;
								paramData["roundNumber"] = roundNumber;
								paramData["matchNumber"] = matchNumber;
								paramData["status"] = status;
								paramData["playersID"] = playersID;
								paramData["winnerID"] = winnerID;
								paramData["completedscores"] = completedscores;

								var dataRecord = calcKnockOutindividualScore(paramData);
								if(dataRecord)
								{
									if(dataRecord.status == "success")
									{
										if(dataRecord.matchRecords)
											matchRecords = dataRecord.matchRecords
									}
									else if(dataRecord.status == "failure")
									{
										if(dataRecord.errorMsg)
											errorMsg = errorMsg.concat(dataRecord.errorMsg)
										else
											return dataRecord;
									}
								}


								

							}
						
						}
						else if(drawsType == "roundrobin")
						{
							if(eventInfo.projectType == 1 || eventInfo.projectType == "1")
							{
								var paramData = {};
								paramData["tournamentId"] = tournamentId;
								paramData["eventName"] = eventName;
								paramData["groupID"] = groupID;
								paramData["rowNo"] = rowNo;
								paramData["colNo"] = colNo;
								paramData["status"] = status;
								paramData["playersID"] = playersID;
								paramData["winnerID"] = winnerID;
								//paramData["completedscores"] = completedscores;
								if(status == "completed" && data.scores == undefined)
									errorMsg.push("Scores are empty1");
								else
									paramData["scores"] = data.scores;

								//console.log("entered rr individual score")
								var dataRecord = calcRRindividualScore(paramData);
								//console.log("dataRecord .. "+JSON.stringify(dataRecord))
								if(dataRecord)
								{
									if(dataRecord.status == "success")
									{
										if(dataRecord.matchRecords)
											matchRecords = dataRecord.matchRecords
									}
									else if(dataRecord.status == "failure")
									{
										if(dataRecord.errorMsg)
											errorMsg = errorMsg.concat(dataRecord.errorMsg)
										else
											return dataRecord;
									}
								}
							}
						}


						if(errorMsg.length > 0)
						{
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament match details";
							return resultJson;
						}
						else
						{
							if(drawsType == "knockout")
							{
								if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
								{
									//console.log("setKnockOutScore .. "+JSON.stringify(matchRecords))
									var result = await Meteor.call("setKnockOutScore",matchRecords)
									//console.log("setKnockOutScore result .. "+result)
									if(result)
									{
										var filtersInfo = dobFilterSubscribe.findOne({
											"tournamentId": tournamentId,
                            				"eventOrganizer": tourInfo.eventOrganizer,
                            				"mainProjectId": tourInfo.projectId[0],
                            				"details.eventId": eventInfo.projectId[0],
                        				},{fields: {
								            _id: 0,
								            "details": {
								                $elemMatch: {
								                    "eventId": eventInfo.projectId[0]
								                    }
								                }
								        }});
								        if(filtersInfo && filtersInfo.details && filtersInfo.details.length > 0)
								        {
								        	var details = filtersInfo.details[0];
								        	//console.log("details .. "+JSON.stringify(details)+" ... "+JSON.stringify(matchRecords))

								        	if(details.ranking && details.ranking.toLowerCase() == "yes")
								        	{
								        		if(matchRecords.finalRound == roundNumber)
								        		{
								        			//final round
								        			if (matchRecords.winnerID.trim() != "") {
                                    					var winnerStatus = await Meteor.call("updatePoints", tournamentId, eventName, matchRecords.winnerID, "", matchRecords.finalPoints, tourInfo.eventOrganizer, tourType);
                                					}

								        		}
								        		if (matchRecords.loserID.trim() != "") 
					                            {
					                                //console.log("call loser points .. "+matchRecords.roundPoints);
					                                var winnerAddStatus = await Meteor.call("updatePoints", tournamentId, eventName, matchRecords.loserID, "", matchRecords.roundPoints, tourInfo.eventOrganizer, tourType);
					                                if (matchRecords.finalRound != roundNumber) 
					                                {
					                                    //console.log("remove winner points .. "+matchRecords.roundPoints);
					                                    var winnerRemoveStatus = Meteor.call("removeloserpoints", tournamentId, eventName, matchRecords.winnerID, "", matchRecords.roundPoints, tourInfo.eventOrganizer, tourType);
					                                }

					                            }
								        	}
								        }
                     
									}
								}

							}
							else if(drawsType == "roundrobin")
							{
								if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
								{
									//console.log("updateRRScores .. "+JSON.stringify(matchRecords));

									var result = await Meteor.call("updateRRScores",groupID,matchRecords.data,matchRecords.inverseData)
									//console.log("updateRRScores result .. "+result)
									if(result)
									{
										var resultJson = {};
										var dbColl = {};
										dbColl["roundRobinEvents"] = result;
										resultJson["status"] = "success";
										resultJson["dbColl"] = dbColl;
										return resultJson;
									}
									else
									{
										var resultJson = {};
										resultJson["status"] = "failure";
										resultJson["message"] = "could not update score details";
										return resultJson;
									}
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
			console.log(e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not set scores "+e;
			return resultJson;
		}
	}
})