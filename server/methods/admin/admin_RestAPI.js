Meteor.methods({

	"fetchEventSchedule":async function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{			
				objCheck = Match.test(data, {"tournamentId":String});
				
				if(objCheck)
				{	
					var tourInfo = tourExists(data.tournamentId);
	            	if(tourInfo == undefined)
					{
						failureJson["message"] = invalidTourMsg;
						return failureJson;
					}
					else
					{
						var eventScheduleList = eventSchedule.find({"tournamentId":data.tournamentId},{sort:{scheduleDate:1,startTime:1}}).fetch();
						if(eventScheduleList && eventScheduleList.length > 0)
						{
							successJson["data"] = eventScheduleList
							successJson["message"] = "Tournament Schedule";
							return successJson
						}
						else
						{
							failureJson["message"] = "Schedule yet to be announced!!"
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
			failureJson["message"] = "Could not fetch schedule"+e;
			return failureJson;
		}
	}
})