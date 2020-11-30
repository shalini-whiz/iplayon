Meteor.publish('schoolDetails', function() {
	var lData = schoolDetails.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('schoolDetailsBasedDomain', function(stateId) {
	var lData = schoolDetails.find({"state":stateId});
	if (lData) {
		return lData;
	}
	return this.ready();
});



Meteor.publish('sequenceDataRecord', function() {
	var lData = sequenceDataRecord.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('sequenceDataRecordTemp', function() {
	var lData = sequenceDataRecordTemp.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});


Meteor.publish('sequenceDataRecordTemp1', function() {
	var lData = sequenceDataRecordTemp1.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});