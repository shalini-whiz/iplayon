/**
 * Meteor Method to delete an event for the given id
 * 
 * @CollectionName: events call meteor check function to check reference value
 *                  is String
 */
Meteor.methods({
	'removeMySubscription' : function(xEventId) {
		check(xEventId, String);
		// Remove the user from the participants list
		var lS =events.update( { _id:xEventId }, { $pull: { eventParticipants: Meteor.userId() } } );
		if(lS){
			return true;
		}
		return this.ready();
		

	}
});

Meteor.methods({
	'removeMyTeamSubscription' : function(xData) {
		
		check(xData, Object);
		// Remove the user from the participants list
		
		var lS =events.update( { _id:xData.xEventId }, { $pull: { eventParticipants: xData.xTeamId } } );
		if(lS){
			return true;
		}
		return this.ready();

	}
});