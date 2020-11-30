Meteor.publish('customCollection', function() {
	var lData = customCollection.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('schoolEventsToFind', function() {
	var lData = schoolEventsToFind.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});