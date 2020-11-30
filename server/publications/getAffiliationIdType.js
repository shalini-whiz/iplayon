 Meteor.publish('affiliationIdType', function() {
	var lData = affiliationIdType.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('lastInsertedAffId', function() {
	var lData = lastInsertedAffId.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});