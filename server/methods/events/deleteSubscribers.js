/**
 * Meteor Method to delete subscriber from an event
 * @collectionName : events
 * @passedByValues : userId and subscribedEventID
 * @dataType : Object
 * @dbQuery : update
 * @methodDescription : for given subscribedEventID pull the userId
 *                     from eventParticipatants for events collections
 */
Meteor.methods({
	'deleteSubscriberFromEvent' : function(xData) {
		try{
			
		check(xData, Object);
		var s = events.update({"_id":xData.subscribedEventID},{$pull:{"eventParticipants":xData.userId+""}});
		if(s){
			return true;
		}
		else
		return this.ready();
	}catch(e){}
	}
});

/**
 * Meteor Method to delete subscriber from an event and blacklist the user
 * @collectionName : events, users
 * @passedByValues : userId, currentUserId and subscribedEventID
 * @dataType : Object
 * @dbQuery : update
 * @methodDescription : for given subscribedEventID pull the userId
 *                     from eventParticipatants of events collection,
 *                     for currentUserId push the userId to blackListedUsers
 *                     for users collection
 */
Meteor.methods({
	'deleteSubscriberAndBlackFromEvent' : function(xData) {
		try{
			
		check(xData, Object);
		var s = events.update({"eventOrganizer":xData.currentUserId},{$pull:{"eventParticipants":xData.userId+""}},{multi:true});
		if(s){
			var u = Meteor.users.update({"userId":xData.currentUserId},{$push:{"blackListedUsers":xData.userId+""}});
			return true;
		}
		}catch(e){}
	}
});

/**
 * Meteor Method to white list the blacklisted the user
 * @collectionName : users
 * @passedByValues : userId, currentUserId
 * @dataType : Object
 * @dbQuery : update
 * @methodDescription : for currentUserId pull the userId from blackListedUsers
 *                     for users collection
 */
Meteor.methods({
	'whiteListUser':function(xData){
		try{
			
		check(xData,Object);
		var s = Meteor.users.update({"_id":xData.currentUserId},{$pull:{"blackListedUsers":xData.userId+""}});
		}catch(e){}
	}
})