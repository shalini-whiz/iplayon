/**
 * Meteor Method to delete an event for the given id
 * 
 * @CollectionName: events call meteor check function to check reference value
 *                  is String
 */
Meteor.methods({
	'myTeamSubscriptions123' : function(xEventId) {
		try
		{
		check(xEventId, String);
		// Find myteams(teams I am a member of)
		var myTeams=teams.find( { teamMembers: { $elemMatch:  {$eq: Meteor.userId() }  } } ).fetch();
		var myTeamIds=[];
        for (i = 0; i < myTeams.length; i++) {
        	myTeamIds.push(myTeams[i]._id);
        }

        // Find the participants list,for the given Team-Id
		var event=events.find( { _id: { $eq: xEventId} } ).fetch();
		var teamParticipants=event[0].eventParticipants;
		for (i = 0; i < myTeamIds.length; i++) {
		    var a = teamParticipants.indexOf(myTeamIds[i]);
		    if(!(a<0))
		    {
		    	// This is the id of the team from which the user has subscribed to the event
		    	if(myTeamIds[i])
		    	  return myTeamIds[i];
		    	return this.ready();
		    }
		}
      }
      catch(e)
      {
      	
      }
	},
	'myTeamSubscriptions' : function(xEventId) {
		try
		{

		check(xEventId, String);
		var myTeams=playerTeams.find( { teamMembers: { $elemMatch:  {$eq: Meteor.userId()}}}).fetch();
		var myTeamIds=[];
        for (i = 0; i < myTeams.length; i++) {
        	myTeamIds.push(myTeams[i]._id);
        }

        // Find the participants list,for the given Team-Id
		var eventInfo=events.find( { _id: { $eq: xEventId} } ).fetch();
		var teamParticipants=eventInfo[0].eventParticipants;
		for (i = 0; i < myTeamIds.length; i++) {
		    var a = teamParticipants.indexOf(myTeamIds[i]);
		    if(!(a<0))
		    {
		    	if(myTeamIds[i])
		    	  return myTeamIds[i];
		    	return this.ready();
		    }
		}
      }
      catch(e)
      {
      	
      }
	},
	'myTeamSubscriptions_Past' : function(xEventId) 
	{
		try
		{
		check(xEventId, String);

		var myTeams=playerTeams.find( { "teamMembers.playerId": Meteor.userId() } ).fetch();
		var myTeamIds=[];
        for (i = 0; i < myTeams.length; i++) {
        	var newJson = {};
        	newJson["teamID"] = myTeams[i]._id;
        	newJson["teamManager"] = myTeams[i].teamManager;
        	myTeamIds.push(newJson);
        }
        // Find the participants list,for the given Team-Id
		var eventInfo=pastEvents.findOne( { _id: { $eq: xEventId} } );
		if(eventInfo)
		{
			var eventName = eventInfo.eventName;
			var tournamentId = eventInfo.tournamentId;
			var teamParticipants=eventInfo.eventParticipants;
			for (i = 0; i < teamParticipants.length; i++) 
			{
				for(var k =0; k<myTeamIds.length; k++)
				{
					if(myTeamIds[k].teamManager == teamParticipants[i] && teamParticipants[i] == Meteor.userId())
					{
						var playerTeamEntriesInfo = playerTeamEntries.findOne({"playerId" :Meteor.userId(),"tournamentId":tournamentId,"subscribedTeamsArray.eventName" : eventName,"subscribedTeamsArray.teamId" :myTeamIds[k].teamID }
						,{fields:{_id: 0, subscribedTeamsArray: {$elemMatch: {"eventName": eventName}}}});
						if(playerTeamEntriesInfo)
							return myTeamIds[k].teamID;
						else
							return false;
					}
				}
			}

		}
		
		
		
      }
      catch(e)
      {
      }
	}
})