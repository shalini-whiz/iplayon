var paramInValidJson = {};
paramInValidJson["status"] = "failure";
paramInValidJson["message"] = "Require parameters!!"

var exeJson = {};
exeJson["status"] = "failure";

var successJson = {};
successJson["status"] = "success";

Meteor.methods({

	"tournamentNameChange":function(data)
	{
		try{
			if(data && data.tournamentId && data.tourName)
			{

				var eventExists = events.findOne({"_id":data.tournamentId});
				if(eventExists == undefined)
					eventExists = pastEvents.findOne({"_id":data.tournamentId});

				if(eventExists)
				{
					var projectName = "";
					var domainName = "";
					if(eventExists.projectName)
						projectName = eventExists.projectName;
					if(eventExists.domainName)
						domainName = eventExists.domainName;


					var scrollEvent = projectName + ":" + data.tourName + ", " + "@" + domainName;
					events.update({"_id":data.tournamentId},{$set:{"eventName":data.tourName}});
					calenderEvents.update({"_id":data.tournamentId},{$set:{"eventName":data.tourName}});
					scrollableevents.update({"_id":data.tournamentId},{$set:{"eventName":scrollEvent}});
					myUpcomingEvents.update({"_id":data.tournamentId},{$set:{"eventName":data.tourName}});
					myPastEvents.update({"_id":data.tournamentId},{$set:{"eventName":data.tourName}});
					pastEvents.update({"_id":data.tournamentId},{$set:{"eventName":data.tourName}});

					var resultJson = {};
					resultJson["status"] = "success";
					resultJson["message"] = "Tournament Name Modified !!"
					return resultJson;
				}
				else
				{
					var resultJson = {};
					resultJson["status"] = "failure";
					resultJson["message"] = "Invalid tourament!!"
					return resultJson;
				}	
			}
			else
			{
				
				return paramInValidJson;
			}
		}catch(e)
		{
			exeJson["message"] = "Could not change name "+e;
			return exeJson;
		}
	},
	"drawMatchSet":function(data)
	{
		try{
			if(data && data.tournamentId && data.eventName && data.roundValues && data.roundValues.length > 0)
			{
				var configInfo = MatchCollectionConfig.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName})
				if(configInfo)
				{
					for(var i = 0; i< data.roundValues.length;i++)
					{
						var roundData = data.roundValues[i];
						var res1 = MatchCollectionConfig.update({
							"tournamentId":data.tournamentId,
							"eventName":data.eventName,
							"roundValues": {
                                $elemMatch: {
                                    "roundNumber": roundData.roundNumber,
                                }
                            }},
						{$set:{
							"roundValues.$.noofSets":roundData.noofSets,
						}});
					}

					successJson["message"] = "NoofSets modified";
					return successJson;
				}
				else
				{
					exeJson["message"] = "Invalid tournamentId/eventName";
					return exeJson;
				}
			}
			else
			{
				return paramInValidJson;

			}

		}catch(e)
		{
			exeJson["message"] = "Could not set noOfSet "+e;
			return exeJson;
		}
	}
})