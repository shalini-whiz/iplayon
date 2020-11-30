/**
 * Meteor Method to delete an team for the given id
 * 
 * @CollectionName: teams call meteor check function to check reference value
 *                  is String
 */
Meteor.methods({
	'deleteTeamMember' : function(xId,xUserId) {
		check(xId, String);
       
		var evId =teams.update( { "_id": xId }, { $pull: { "teamMembers":xUserId  } } );
	
		if(evId){
			return true;

		}

		return this.ready();
	}
})