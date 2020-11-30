Meteor.publish('liveUpdates', function() {
	var lData = liveUpdates.find();
	if (lData) {
		return lData;
	}
	return this.ready();
});