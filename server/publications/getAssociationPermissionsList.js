Meteor.publish('associationPermissions', function() {
	var lData = associationPermissions.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});