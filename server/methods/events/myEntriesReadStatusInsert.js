/**
 * Meteor Method to update read status myEntriesReadStatus for the given data
 * 
 * @CollectionName: myEntriesReadStatus call meteor check function to check reference value
 *                  is object
 */
Meteor.methods({
	'insertmyEntriesReadStatus':function(xData){
		check(xData,Object);
		
		// If there is already an entry with the given user-id and event-id
		// then it updates that row otherwise a new row is created,this happens
		// because "upsert" is set to true
		var ls = myEntriesReadStatus.update({"userId":xData.userId,"eventId":xData.eventId},
	                                        {$set:{
			                                        "userId":xData.userId,
			                                        "eventId":xData.eventId,
			                                        "readStatus":xData.readStatus
	                                              }
	                                        },
	                                        { upsert: true }
	                                       );
		return ls;
	}
	
});