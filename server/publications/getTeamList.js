/**
 * @PublicationName : teams
 * @CollectionName : teams
 * @publishDescription : to get the list of teams
 */
Meteor.publish('teams', function() {
	var lData = teams.find({});
	// Get the user-id of the logged-in user
	//var lLoggedInUser = Meteor.users.findOne({"_id" : this.userId});
	    
	//var lData = teams.find({ $or: [{teamOwner:lLoggedInUser.userId},{teamMembers: { $elemMatch:  {$eq: lLoggedInUser.userId }  }}]}).fetch();

	if (lData) {
		return lData;
	}
	else{
	  return this.ready();
	}
});
