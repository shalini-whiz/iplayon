/**
 * Meteor Method to insert a message 
 * 
 * @CollectionName: inbox
 */
Meteor.methods({
	'insertMessage':function(xData){
		check(xData,Object);
		var ls = inbox.insert({
			"userId":xData.userId,
			"messages":xData.messages,
			"userToAct":xData.userToAct,
			"teamId":xData.teamId
		});
		return ls;
	}
	
});

/**
 * Meteor Method to delete a message 
 * 
 * @CollectionName: inbox
 */
Meteor.methods({
	'deleteMessage':function(xData){
		check(xData,Object);
		var ls = inbox.remove({
			"userId":xData.userId,
			"messages":xData.messages,
			"userToAct":xData.userToAct,
			"teamId":xData.teamId
		});
		return ls;
	}
	
});