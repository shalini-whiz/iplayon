 Meteor.publish('SNSCollectionDB', function() {
	var lData = SNSCollectionDB.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

 

  Meteor.publish('tempSubCheck', function() {
	var lData = tempSubCheck.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});