//school teams

/*
schoolDetails
schoolEventsToFind
schoolPlayerEntries
schoolPlayerTeamEntries
schoolPlayers
schoolTeams
playerTeamEntries
playerTeams
*/

Meteor.publish('schoolDetailsadmin', function() {
	var lData = schoolDetails.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('schoolEventsToFindadmin', function() {
	var lData = schoolEventsToFind.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('schoolPlayerEntriesadmin', function() {
	var lData = schoolPlayerEntries.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('schoolPlayerTeamEntriesadmin', function() {
	var lData = schoolPlayerTeamEntries.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('schoolPlayersadmin', function() {
	var lData = schoolPlayers.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('schoolTeamsadmin', function() {
	var lData = schoolTeams.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('playerTeamsadmin', function() {
	var lData = playerTeams.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('playerTeamEntriesadmin', function() {
	var lData = playerTeamEntries.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});