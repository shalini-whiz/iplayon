/**
 * Meteor Method to delete an event for the given id
 * 
 * @CollectionName: events call meteor check function to check reference value
 *                  is String
 */
Meteor.methods({
	'myEntries' : function(xId) {
		
		try{
        check(xId, String);
      }
        catch(e){

        }
		// Find myteams(teams I am a member of)
		var myTeams=teams.find( { teamMembers: { $elemMatch:  {$eq: xId }  } } ).fetch();

		// To store the Team-ids logged-in user belong to
		var myTeamIds=[];
        for (i = 0; i < myTeams.length; i++) {
        	myTeamIds.push(myTeams[i]._id);
        }

        // $or to match if the event has the logged-in user as the participant or
        // the team which the user belongs to as the event participant
        // The $in operator selects the documents where the value of a field equals any value in the specified array
        
        // Individual entries:
	/**	TODO check if the entries are individual based on project:var myIndividualEntries=events.find( 
				{$and: [ { eventParticipants: { $elemMatch:  { $eq: xId }  } }, { teamEvent: { $eq: "0"  } } ] }).fetch();**/
        var myIndividualEntries=events.find( { eventParticipants: { $elemMatch:  { $eq: xId }  } }  ).fetch();
		
		// Team Entires
		/**TODO check if the entries are team based on project:var myTeamEntries=events.find( 
				{$and: [ { eventParticipants: { $elemMatch:  { $in: myTeamIds }  } }, { teamEvent: { $eq: "1"  } } ] }).fetch();**/
        
        var myTeamEntries=events.find({ eventParticipants: { $elemMatch:  { $in: myTeamIds }  } }  ).fetch();
		
		// Add both Team-Entries and individual entries
		var myEntries=[];
		var teamsParticipating=[];
		var a={};
		for (i = 0; i < myIndividualEntries.length; i++) {
			myEntries.push(myIndividualEntries[i]);
        }
		for (i = 0; i < myTeamEntries.length; i++) {
			myEntries.push(myTeamEntries[i]);
        }
		
		if(myEntries){
            return myEntries;
        }
	}
})


Meteor.methods({
	'loggedInSubscribeTournaments': function() 
	{
		var subscribedTournaments = [];
		var lData = playerEntries.find({"totalFee":{$ne:"0"},"playerId":Meteor.userId()},{fields:{"tournamentId":1}}).fetch();
		if (lData) 
		{
			for(var i=0; i<lData.length; i++)
			{
				if (!(subscribedTournaments.indexOf(lData[i].tournamentId) > -1))
		        {
		            subscribedTournaments.push(lData[i].tournamentId);
		        } 
		    }		
		}
		var lData = playerTeamEntries.find({"totalFee":{$ne:"0"},"playerId":Meteor.userId()},{fields:{"tournamentId":1}}).fetch();
		if (lData) 
		{
			for(var i=0; i<lData.length; i++)
			{
				if (!(subscribedTournaments.indexOf(lData[i].tournamentId) > -1))
		        {
		            subscribedTournaments.push(lData[i].tournamentId);
		        } 
			}
		}
		return subscribedTournaments;
	}
});