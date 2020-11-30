
import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import { createKODrawValidation } from './drawsScoreFunctions.js';



Meteor.methods({

	"createKODraws":async function(data)
	{
		try{
			if(data)
			{
				var objCheck = Match.test(data, {"userId": String,
					"tournamentId":String,"eventName":String,
					"knockoutType":String,
					"winnerPoints":Match.Integer,
					"roundValues":[{
						"roundNumber":Match.Integer,"roundName":String,
						"noofSets":Match.Integer,"minScores":Match.Integer,
            			"minDifference":Match.Integer,"points":Match.Integer}],
					"fileData":[{"Sl.No":String,"Name":String,
					"Affiliation ID":String,"Academy Name":String}]
				});

								
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
					var roundValMsg = "RoundNumber/noofSets/minScores/minDifference cannot be zero";
					var knockoutMsg = "Possible type can be readymade/seeding"

					var userId = data.userId.trim();
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var winnerPoints = data.winnerPoints;
					var knockoutType = data.knockoutType.trim();
					var roundValues = data.roundValues;


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

					if(knockoutType.toLowerCase() != "knockout" && knockoutType.toLowerCase() != "readymade")
						errorMsg.push(knockoutMsg)

					
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
							for(var m = 0; m< roundValues.length;m++)
							{
								var roundInfo = roundValues[m];

								if(roundInfo.roundNumber == 0 || roundInfo.noofSets == 0 || 
									roundInfo.minScores == 0 || roundInfo.minDifference == 0)
								{
									errorMsg.push(roundValMsg)
								}
							}
						}
						

						var fileData = data.fileData;
						if(fileData.length == 1)
	                  		errorMsg.push('Cannot create draws with one player!');        	                    
	                	

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
	                			var paramData = {};
	                			paramData["data"] = fileData;

	                			var tourSport = "";
	            				var tourOrganizer = "";
	            				if(tourInfo.projectId && tourInfo.projectId.length > 0)
	            					tourSport = tourInfo.projectId[0];

	            				if(tourInfo.eventOrganizer)
	            					tourOrganizer = tourInfo.eventOrganizer;


	                			var jsonParam = {};	         			
	                			jsonParam["tournamentId"] = tournamentId;
	                			jsonParam["eventName"] = eventName;
	                			jsonParam["eventId"] = eventId;
	                			jsonParam["fileData"] = paramData;
	                			jsonParam["roundValues"] = roundValues;
	                			jsonParam["tourSport"] = tourSport;
	                			jsonParam["tourOrganizer"] = tourOrganizer;
	                			jsonParam["winnerPoints"] = winnerPoints;

								var result_records = createKODrawValidation(jsonParam);
								return result_records;
                
	                		}
	                		else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
	                		{
	                			//yet to code
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
});