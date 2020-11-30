 Meteor.publish('insertedUsersCount', function() {
	var lData = insertedUsersCount.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});
