
 Meteor.publish('deletedPlayers', function() {
	var lData = deletedPlayers.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});