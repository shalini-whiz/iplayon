
Meteor.publish('insertedPlayersFromCsv', function() {
	var lData = insertedPlayersFromCsv.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});