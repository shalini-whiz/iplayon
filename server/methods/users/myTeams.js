/**
 * Meteor Method to delete an event for the given id
 * 
 * @CollectionName: events call meteor check function to check reference value
 *                  is String
 */
Meteor.methods({
	'myTeams' : function() {
		
		// Find myteams(teams I am a member of)
		var myTeams=teams.find( { teamMembers: { $elemMatch:  {$eq: Meteor.userId() }  } } ).fetch();

		return myTeams;

	}
})