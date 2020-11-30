import { getIndexOf } from './draws_functions.js';
import { splitVec } from './draws_functions.js';
import { insert } from './draws_functions.js';
import { computeBrackets } from './draws_functions.js';
import { show } from './draws_functions.js';
import { ret_show } from './draws_functions.js';

import { emptyDraws_show } from './draws_functions.js';
import { merge } from './draws_functions.js';
import { winner_merge } from './draws_functions.js';

import { show_ForTeamPlayers } from './draws_functions.js';
import { mergeForTeamDraws } from './draws_functions.js';




Meteor.methods({

	"createRRDraws":async function(data)
	{
		try{
			if(data)
			{
				var objCheck = Match.test(data, {"userId": String,
					"tournamentId":String,"eventName":String,
					"maxMembers":Match.Integer,
					"fileData":[{"Sl.No":String,"GroupNumber":String,
					"AffiliationID":String,"Player/Team Name":String}]
				});
				
				var objCheck = true;
				if(objCheck)
				{   
					var errorMsg = [];
					var warningMsg = [];


					var userMsg = "Invalid user";
					var tourMsg = "Invalid tournament";
					var categoryMsg = "Invalid category";
					var pastTourMsg = "Cannot create draws in case of past tournament round robin draws";
					var organizerMsg = "Only organizer can create draws";
					var resetMsg = "Please reset the draws before creating new darws!!";

					var userId = data.userId.trim();
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var maxMembers = data.maxMembers;

					var eventInfo = undefined;

					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo == undefined)
					{
						tourInfo = pastEvents.findOne({"_id":tournamentId});
						if(tourInfo)
						{
							tourInfo = undefined;
							errorMsg.push(pastTourMsg);
						}
						else
						{
							errorMsg.push(tourMsg)
						}
					}
					else
					{
						eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":eventName})
						if(eventInfo == undefined)
							errorMsg.push(categoryMsg);
					}

					/*if(tourInfo && userInfo)
					{
						if(tourInfo.eventOrganizer != userId)
							errorMsg.push(organizerMsg);
					}*/
					if(tourInfo && eventInfo)
					{
						if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
						{
							var drawsExists = MatchCollectionDB.findOne({"tournamentId":tournamentId,"eventName":eventName});
							if(drawsExists)
								errorMsg.push(resetMsg)
						}
						else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
						{
							//yet to code
						}

					}

					if(maxMembers ==0)
            			errorMsg.push("Maximum members cannot be zero");

					if(errorMsg.length > 0)
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not create tournament draws";
						return resultJson;
					}
					else
					{
						var fileData = data.fileData;
						var obj = _.countBy(fileData, function(indexData) { 
							return indexData.GroupNumber; });

						if(fileData.length == 1)
	                  		errorMsg.push('Cannot create draws with one player!');        	                    
	                	else
	                	{             
	                  		for (var key in obj)
	                  		{
	                  			
	                    		if(parseInt(obj[key]) > maxMembers)
	                    		{
	                      			errorMsg.push('Group exceeds specified maximum members');
	                      			break;
	                    		}
	                    		else if(parseInt(obj[key]) == 1)
	                    		{
	                      			warningMsg.push('Group contains just one member');

	                    		}
	                 		}                  
	                	}

	                	if(errorMsg.length > 0)
	                	{
	                		var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not create tournament draws";
							return resultJson;
	                	}
	                	else
	                	{
	                		if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
	                		{
	                			var eventId = eventInfo.projectId[0];
	                			var dataCsv = {};
	                			dataCsv.data =fileData;
	                			var result = await Meteor.call("initRoundRobinMatchRecords",tournamentId, eventName,eventId,dataCsv,maxMembers);
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

		}catch(e)
		{
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not upload draws "+e;
			return resultJson;
		}
	},
	"setRRPoints":async function(data)
	{
		try{
			if(data)
			{
				var objCheck = Match.test(data, {"userId": String,"tournamentId":String,"eventName":String,"groupID":String,"rowNo":Match.Integer,"points":Match.Integer});
				if(objCheck)
				{
					var errorMsg = [];
					var userMsg = "Invalid user";
					var tourMsg = "Invalid tournament";
					var categoryMsg = "Invalid category";
					var pastTourMsg = "Cannot set points in case of past tournament round robin draws";
					var organizerMsg = "Only organizer can set points";
					var idMsg = "Invalid record id";
					var rowMsg = "Invalid row";
					var drawMsg = "Draws need to be created!!"

					var userId = data.userId.trim();
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var groupID = data.groupID.trim();
					var rowNo = data.rowNo;
					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo == undefined)
					{
						tourInfo = pastEvents.findOne({"_id":tournamentId});
						if(tourInfo)
						{
							tourInfo = undefined;
							errorMsg.push(pastTourMsg);
						}
						else
							errorMsg.push(tourMsg)

					}
					else
					{
						var eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":eventName})
						if(eventInfo == undefined)
							errorMsg.push(categoryMsg);
					}
					if(tourInfo && userInfo)
					{
						if(tourInfo.eventOrganizer != userId)
							errorMsg.push(organizerMsg);
					}
					if(tourInfo && eventInfo)
					{
						if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
						{
							var exists = roundRobinEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
							if(exists == undefined)
							{
								errorMsg.push(drawMsg);
							}
							else
							{
								var rr_info = roundRobinEvents.findOne({"_id":groupID,
								"tournamentId":tournamentId,"eventName":eventName});
								if(rr_info == undefined)
									errorMsg.push(idMsg);
								else
								{
									var rr_row_info = roundRobinEvents.findOne({"_id":groupID,
										"groupStandingInfo.rowNo": rowNo});
									if(rr_row_info == undefined)
										errorMsg.push(rowMsg);
								}
							}
							
							
						}
						else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
						{
							var exists = roundRobinTeamEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
							if(exists == undefined)
							{
								errorMsg.push(drawMsg);
							}
							else
							{
								var rr_info = roundRobinTeamEvents.findOne({"_id":groupID,
									"tournamentId":tournamentId,"eventName":eventName});
								if(rr_info == undefined)
									errorMsg.push(idMsg);
								else
								{
									var rr_row_info = roundRobinTeamEvents.findOne({"_id":groupID,
										"groupStandingInfo.rowNo": rowNo});
									if(rr_row_info == undefined)
										errorMsg.push(rowMsg);

								}
							}
							
						}
					}

					if(errorMsg.length > 0)
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch tournament draws";
						return resultJson;
					}
					else
					{
						var paramData = {};
						paramData["groupID"] = groupID;
						paramData["rowNo"] =rowNo;
						paramData["points"] = data.points;

						if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
						{
							var result = await Meteor.call("updateRRPoints",paramData);
							if(result)
							{
								var resultJson={};
								resultJson["status"] = "success";
								resultJson["message"] = tourInfo.eventName+" category "+eventName+" points updated successfully";
								return resultJson;
							}
							else
							{
								var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Cound not set points of "+tourInfo.eventName+" category "+eventName;
								return resultJson;
							}
						}
						else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
						{
							var result = await Meteor.call("updateRRTeamPoints",paramData)
							if(result)
							{
								var resultJson={};
								resultJson["status"] = "success";
								resultJson["message"] = tourInfo.eventName+" category "+eventName+" points updated successfully";
								return resultJson;
							}
							else
							{
								var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Cound not set points of "+tourInfo.eventName+" category "+eventName;
								return resultJson;
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
			resultJson["message"] = "Could not set points "+e;
			return resultJson;
		}
	},
	"setRRStanding":async function(data)
	{
		try{
			if(data)
			{
				var objCheck = Match.test(data, {"userId": String,"tournamentId":String,"eventName":String,"groupID":String,"rowNo":Match.Integer,"groupStanding":Match.Integer});
				if(objCheck)
				{
					var errorMsg = [];
					var userMsg = "Invalid user";
					var tourMsg = "Invalid tournament";
					var categoryMsg = "Invalid category";
					var pastTourMsg = "Cannot set standing in case of past tournament round robin draws";
					var organizerMsg = "Only organizer can set standing";
					var idMsg = "Invalid record id";
					var rowMsg = "Invalid row";
					var drawMsg = "Draws need to be created!!"

					var userId = data.userId.trim();
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var groupID = data.groupID.trim();
					var rowNo = data.rowNo;
					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo == undefined)
					{
						tourInfo = pastEvents.findOne({"_id":tournamentId});
						if(tourInfo)
						{
							tourInfo = undefined;
							errorMsg.push(pastTourMsg);
						}
						else
							errorMsg.push(tourMsg)
					}
					else
					{
						var eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":eventName})
						if(eventInfo == undefined)
							errorMsg.push(categoryMsg);
					}
					if(tourInfo && userInfo)
					{
						if(tourInfo.eventOrganizer != userId)
							errorMsg.push(organizerMsg);
					}
					if(tourInfo && eventInfo)
					{
						if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
						{
							var exists = roundRobinEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
							if(exists == undefined)
							{
								errorMsg.push(drawMsg);
							}
							else
							{
								var rr_info = roundRobinEvents.findOne({"_id":groupID,
								"tournamentId":tournamentId,"eventName":eventName});
								if(rr_info == undefined)
									errorMsg.push(idMsg);
								else
								{
									var rr_row_info = roundRobinEvents.findOne({"_id":groupID,
										"groupStandingInfo.rowNo": rowNo});
									if(rr_row_info == undefined)
										errorMsg.push(rowMsg);

									if(data.groupStanding > rr_info.groupStandingInfo.length || data.groupStanding == 0)
									{
										var standingMsg = "Please enter valid standing within 1 - "+rr_info.groupStandingInfo.length+"!!";
										errorMsg.push(standingMsg)
									}

								}
							}
							
							
						}
						else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
						{
							var exists = roundRobinTeamEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
							if(exists == undefined)
							{
								errorMsg.push(drawMsg);
							}
							else
							{
								var rr_info = roundRobinTeamEvents.findOne({"_id":groupID,
									"tournamentId":tournamentId,"eventName":eventName});
								if(rr_info == undefined)
									errorMsg.push(idMsg);
								else
								{
									var rr_row_info = roundRobinTeamEvents.findOne({"_id":groupID,
										"groupStandingInfo.rowNo": rowNo});
									if(rr_row_info == undefined)
										errorMsg.push(rowMsg);
									if(data.groupStanding > rr_info.groupStandingInfo.length || data.groupStanding == 0)
									{
										var standingMsg = "Please enter valid standing within 1 - "+rr_info.groupStandingInfo.length+"!!";
										errorMsg.push(standingMsg)
									}

								}
							}
							
						}
					}

					if(errorMsg.length > 0)
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch tournament draws";
						return resultJson;
					}
					else
					{
						var paramData = {};
						paramData["groupID"] = groupID;
						paramData["rowNo"] =rowNo;
						paramData["groupStanding"] = data.groupStanding;

						if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
						{
							var result = await Meteor.call("updateRRStanding",paramData);
							if(result)
							{
								var resultJson={};
								resultJson["status"] = "success";
								resultJson["message"] = tourInfo.eventName+" category "+eventName+" standing updated successfully";
								return resultJson;
							}
							else
							{
								var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Cound not set standing of "+tourInfo.eventName+" category "+eventName;
								return resultJson;
							}
						}
						else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
						{
							var result = await Meteor.call("updateRRTeamStanding",paramData)
							if(result)
							{
								var resultJson={};
								resultJson["status"] = "success";
								resultJson["message"] = tourInfo.eventName+" category "+eventName+" standing updated successfully";
								return resultJson;
							}
							else
							{
								var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Cound not set standing of "+tourInfo.eventName+" category "+eventName;
								return resultJson;
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
			resultJson["message"] = "Could not set standing "+e;
			return resultJson;
		}
	},
	"fetchRRWinnerEntries":async function(data)
	{
		try{
			if(data)
			{
				var objCheck = Match.test(data, {"userId": String,"tournamentId":String,"eventName":String,"maxWinners":Match.Integer});
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var userId = data.userId.trim();
					var maxWinners = data.maxWinners;
					var eventId= "";

					var errorMsg = [];
					var tourMsg = "Invalid tournament";
					var categoryMsg = "Invalid category/event";
					var userMsg = "Invalid user";

					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo == undefined)				
						tourInfo = pastEvents.findOne({"_id":tournamentId});			
					
					if(tourInfo == undefined)
						errorMsg.push(tourMsg);

					if(tourInfo)
					{
						var eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":eventName})
						if(eventInfo == undefined)
						{
							eventInfo = pastEvents.findOne({"tournamentId":tournamentId,"eventName":eventName})
							if(eventInfo == undefined)
								errorMsg.push(categoryMsg);
						}
					}
					if(eventInfo && eventInfo.projectId && eventInfo.projectId[0])
					{
						eventId = eventInfo.projectId[0];
					}	
					else
						errorMsg.push(categoryMsg);

					if(errorMsg.length > 0)
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch tournament winners";
						return resultJson;
					}
					else
					{
						var draws = await Meteor.call("fetchRRWinner", tournamentId,eventName, eventId,maxWinners) ;
                        if (draws) 
                        {
                        	result = draws;
                            if(result.status)
                            {
                                if(result.status == "failure")
                                {
                                   	//console.log("result .. "+JSON.stringify(result));
                                }
                                else
                                {
                                    if(result.response)
                                    {
                                        var userDetail = [];
                                        var mergedArr = [];
                                        var algArr = [];
                                        var userDetail = result.response;
                                        if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
                                        {
                                            if (userDetail.length != 0) 
                                            { 
                                                var keyFields = ["Sl.No.","Name", "Affiliation ID","Academy Name"];
                                                var gPlayerVec = [];
                                                gPlayerVec = computeBrackets(userDetail.length);
                                                var showResponse = ret_show(gPlayerVec);
                                                var mergedArr = winner_merge(userDetail, showResponse);

                                                mergedArr.map(function(document, index) {
                                					document["Sl.No."] = parseInt(index + 1);
                            					});

						                    	var csv = Papa.unparse({
	                								fields: keyFields,
	                								data: mergedArr
	            								});
	            								var resultJson = {};
	            								resultJson["status"] = "success";
	            								resultJson["data"] = csv;

	            								return resultJson;
                                            }
                                            else
                                            {
                                            	var resultJson = {};
                                            	resultJson["status"] = "success";
                                            	resultJson["data"] = userDetail;
                                            	resultJson["message"] = "No data";
                                            }
                                        }
                                        else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
                                        {
                                            if (userDetail.length != 0) 
                                            { 
                                                var keyFields = ["Sl.No.","teamName", "teamAffiliationId","managerAffiliationId", "temporaryAffiliationId"]
                                                var gPlayerVec = [];
                                                gPlayerVec = computeBrackets(userDetail.length);
                                                var showResponse = show_ForTeamPlayers(gPlayerVec);
                                                var mergeResponse = mergeForTeamDraws(userDetail,showResponse);
                                                mergeResponse.map(function(document, index) {
                                					document["Sl.No."] = parseInt(index + 1);
                            					});
                                                var csv = Papa.unparse({
	                								fields: keyFields,
	                								data: mergeResponse
	            								});
	            								var resultJson = {};
	            								resultJson["status"] = "success";
	            								resultJson["data"] = csv;
	            								return resultJson
                                               
                                            }
                                            else{
                                                var resultJson = {};
                                            	resultJson["status"] = "success";
                                            	resultJson["data"] = userDetail;
                                            	resultJson["message"] = "No data";
                                            }
                                        }

                                            
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
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not set winners "+e;
			return resultJson;
		}
	}
	
})