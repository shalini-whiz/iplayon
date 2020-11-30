Meteor.publish('strokeMaster', function() {
	var lData = strokes.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('serviceStrokes', function() {
	var lData = serviceStrokes.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('destinationPoints', function() {
	var lData = destinationPoints.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('destinationPointsMaster', function() {
	var lData = destinationPointsMaster.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('strokesMasterData', function() {
	var lData = strokesMaster.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});
Meteor.publish('analyticsApproval', function() {
	var lData = analyticsApproval.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});
