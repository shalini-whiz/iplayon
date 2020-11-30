Meteor.methods({
	"getTeamFormatList": function(data) {
	   	try{
	   		
            data = data.replace("\\", "");
            var data = JSON.parse(data);
            if(data.eventName)
            {
            	var schoolEvents = schoolEventsToFind.findOne({"key":"School","individualEventNAME":{$in:[data.eventName]}});
	            if(schoolEvents)
	            {
	            	if(schoolEvents.individualEventNAME && schoolEvents.teamEventNAME)
	            	{
	            		var individualEvents = schoolEvents.individualEventNAME;
	            		var teamEvents = schoolEvents.teamEventNAME;
	            		if(individualEvents.indexOf(data.eventName)!=-1){
	            			var pos = individualEvents.indexOf(data.eventName);

	            			if(teamEvents[pos])
	            			{
	            				var teamInfo = teamsFormat.find({teamFormatName:teamEvents[pos]}).fetch();
	    						return teamInfo;
	            			}


	            		}

	            	}
	            }
	            else
	            {
	            	var resultJson = {};
	            	resultJson["status"] = "failure"
	            	resultJson["resultID"] = "";
	            	resultJson["response"] = "Invalid data"
	            	return resultJson
	            }
            } 	
	    }catch(e){
	    }	
	}
})