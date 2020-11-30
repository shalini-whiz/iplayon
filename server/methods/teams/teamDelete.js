/**
 * Meteor Method to delete an team for the given id
 * 
 * @CollectionName: teams call meteor check function to check reference value
 *                  is String
 */
Meteor.methods({
	'deleteTeams123' : function(xId) {
		check(xId, String);

		var evId = teams.find({"_id":xId}).fetch();
		if(evId){
			var lS = teams.remove({
				"_id" : xId
		    });//remove the event from events collection
		    var allEve = events.find({}).fetch();
		 if(allEve.length!=0){
		    for(var i=0;i<allEve.length;i++){
		    	if(allEve[i].eventParticipants){
		    		for(var j=0;j<allEve[i].eventParticipants.length;j++){
		    			if(allEve[i].eventParticipants[j]===xId){
		    				events.update({"_id":allEve[i]._id},{$pull:{"eventParticipants":xId+""}});
		    			}
		    		}
		    	}
		    }
		}
		}

		if(lS){
			return true;
		}
		return this.ready();
	}
})