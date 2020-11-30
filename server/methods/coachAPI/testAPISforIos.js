Meteor.methods({
    //create group by coach, consists of connected group members
    "getALLEVEnts": function() {
    	try{
    		var s = events.find({tournamentEvent:true}).fetch()
    		return s;
    	}catch(e){
    	}
    }
})