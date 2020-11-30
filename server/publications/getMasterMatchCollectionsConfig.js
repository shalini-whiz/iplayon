Meteor.publish('MasterMatchCollections', function() {
	var lData = MasterMatchCollections.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('MatchCollectionConfig', function() {
	var lData = MatchCollectionConfig.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('MatchTeamCollectionConfig', function() {
	var lData = MatchTeamCollectionConfig.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});


Meteor.publish('MatchCollectionConfigTour', function(param) {
	var lData = MatchCollectionConfig.find({"tournamentId":param});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('MatchCollectionConfigTourCategory',function(tourID,eventName) {
	var lData = MatchCollectionConfig.find({"tournamentId":tourID,"eventName":eventName});
	if (lData) {
		return lData;
	}
	return this.ready();
});