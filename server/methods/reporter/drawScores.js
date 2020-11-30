import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import { fetchLiveIndividual } from './reporterFunc.js';
import { fetchTeamDetailScore } from './reporterFunc.js';



Meteor.methods({

	fetchTourTeamScore:async function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();

		try{
			var resultJson = {};
			var xData = data;
			var tournamentId = xData.tournamentId;
			var matchNumber;
			var tourType = "";
			var checkEvent = events.findOne({"_id":tournamentId});
			if(checkEvent)
				tourType = "upcoming";
			if(checkEvent == undefined)
			{
				checkEvent = pastEvents.findOne({"_id":tournamentId});
				if(checkEvent)
					tourType = "past";
			}


			if(checkEvent)
			{
				var raw1 = teamMatchCollectionDB.rawCollection();
      			var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
				var eventList1 = distinct1('eventName',{"tournamentId":tournamentId,"matchRecords.status":"yetToPlay"});

				var raw2 = MatchCollectionDB.rawCollection();
      			var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
				var eventList2 = distinct2('eventName',{"tournamentId":tournamentId,"matchRecords.status":"yetToPlay"});

				var eventList3 = eventList1.concat(eventList2);


				var eventList = [];
				if(tourType.toLowerCase() == "upcoming")
				{
					eventList = events.find({"tournamentId":tournamentId,"eventName":{$in:eventList3}},{fields:{"eventName":1,"projectType":1,"tournamentId":1}}).fetch()
				}
				else if(tourType.toLowerCase() == "past")
				{
					eventList = pastEvents.find({"tournamentId":tournamentId,"eventName":{$in:eventList3}},{fields:{"eventName":1,"projectType":1,"tournamentId":1}}).fetch()
				}

				if(eventList.length > 0)
				{
					var curEvent;
					var eventName
					curEvent = eventList[0];
					eventName = curEvent.eventName;


					if(xData.eventName)
					{
						var eventInfo
						if(tourType.toLowerCase() == "upcoming")
						{
							eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":{$in:[xData.eventName]}},{fields:{"eventName":1,"projectType":1,"tournamentId":1}})
						}
						else if(tourType.toLowerCase() == "past")
						{
							eventInfo = pastEvents.findOne({"tournamentId":tournamentId,"eventName":{$in:[xData.eventName]}},{fields:{"eventName":1,"projectType":1,"tournamentId":1}});
						}
						if(eventInfo)
						{
							curEvent = eventInfo;
							eventName = curEvent.eventName;
						}
					}
					

					
					if(curEvent.projectType && curEvent.projectType == 2)
					{
						var paramData = {};
						paramData["tournamentId"] = tournamentId;
						paramData["eventName"] = eventName;
						if(xData.matchNumber)
							paramData["matchNumber"] = xData.matchNumber


						var resultData = fetchTeamDetailScore(paramData);


						if(resultData && resultData.matchRecordInfo && resultData.matchList)
						{

							var matchRecordInfo = resultData.matchRecordInfo;
							var matchList = resultData.matchList;
							var teamAId = "";
							var teamBId = "";
							if(matchRecordInfo.playerAID)
								teamAId = matchRecordInfo.playerAID;
							if(matchRecordInfo.playerBID)
								teamBId = matchRecordInfo.playerBID;
							var teamAPlayers = await Meteor.call("teamPlayersFetch", teamAId, tournamentId);
		      				var teamBPlayers = await Meteor.call("teamPlayersFetch", teamBId, tournamentId);
	                    
		                    if(data.matchNumber)
								matchNumber = parseInt(data.matchNumber);
							else
								matchNumber = parseInt(matchList[0]);

							

							matchRecordInfo["tournamentId"] = tournamentId;
							matchRecordInfo["eventName"] = eventName;


		      				resultJson["status"] = "success";
		      				resultJson["matchList"] = matchList;
		      				resultJson["matchRecord"] = matchRecordInfo;
		      				resultJson["eventList"] = eventList;
		      				resultJson["matchNumber"] = matchNumber;
		      				resultJson["teamAPlayers"] = teamAPlayers;
		      				resultJson["teamBPlayers"] = teamBPlayers;      				
		      				resultJson["projectType"] = curEvent.projectType;
		      				resultJson["matchSet"] = 7;

		      				if(resultData.teamDetScore)
		      					resultJson["teamDetScore"] = resultData.teamDetScore


		      				var matchFormatInfo = MatchTeamCollectionConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
		      				if(matchFormatInfo && matchFormatInfo.teamFormatId)
		      				{
								var formatInfo = orgTeamMatchFormat.findOne({"_id":matchFormatInfo.teamFormatId})
		      					if(formatInfo && formatInfo.specifications)
		      						resultJson["matchSet"] = formatInfo.specifications.length;
		      				
		      				}

		      				if(matchRecordInfo.scoresA.length != resultJson.matchSet)
		      				{
		      					var scoreLen = matchRecordInfo.scoresA.length;
		      					for(i = scoreLen; i< resultJson.matchSet; i++)
		      					{
		      						matchRecordInfo.scoresA.push("0");
		      						matchRecordInfo.scoresB.push("0");
		      					}
		      				}

		      				return resultJson;

						}			
					}
					else if(curEvent.projectType && curEvent.projectType == 1)
					{				
						var paramData = {};
						paramData["tournamentId"] = tournamentId;
						paramData["eventName"] = eventName;
						if(xData.matchNumber)
							paramData["matchNumber"] = xData.matchNumber
						var resultData = fetchLiveIndividual(paramData);

						var matchRecordInfo;
						var matchList = [];
						if(resultData && resultData.matchRecordInfo)
							matchRecordInfo = resultData.matchRecordInfo;
						if(resultData && resultData.matchList)
							matchList = resultData.matchList;

						if(data.matchNumber)
							matchNumber = parseInt(data.matchNumber);
						else
							matchNumber = parseInt(matchList[0]);


						if(matchRecordInfo)
						{
							


							matchRecordInfo["tournamentId"] = tournamentId;
							matchRecordInfo["eventName"] = eventName;
							resultJson["status"] = "success";
		      				resultJson["matchList"] = matchList;
		      				resultJson["eventList"] =eventList;
		      				resultJson["matchRecord"] = matchRecordInfo;
		      				resultJson["projectType"] = curEvent.projectType;
		      				resultJson["matchNumber"] = matchNumber;
		      				
		      				return resultJson;
						}		
					}
				}
				else
				{
					failureJson["message"] = "Draws yet to uplaod";
					return failureJson;
				}
			}
			else
			{
				failureJson["message"] = invalidTourMsg;
				return failureJson
			}
	
		}catch(e){

			errorLog(e)	
			failureJson["message"] = "Could not fetch team score "+e;
			return failureJson;

		}
	},

})