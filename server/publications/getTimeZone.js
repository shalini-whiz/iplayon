Meteor.publish('timeZone', function() {
	return timeZone.find();
});