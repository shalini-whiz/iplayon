
Meteor.publish('userOtp', function() {
	var lData = userOtp.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});