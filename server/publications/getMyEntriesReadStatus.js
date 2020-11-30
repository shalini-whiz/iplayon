/**
 * @PublicationName myEntriesReadStatus 
 * to publish the list of myEntriesReadStatus from collection myEntriesReadStatus
 * @CollectionName myEntriesReadStatus
 */
Meteor.publish('myEntriesReadStatus', function() {
	var lData = myEntriesReadStatus.find();
	if (lData) {
		return lData;
	}
	return this.ready();
});