/**
 * @PublicationName : subDomain2
 * @CollectionName : subDomain2
 * @publishDescription : to get the list of subDomain2
 */
Meteor.publish('subDomain2', function() {
	var lData = subDomain2.find();

	if (lData) {
		return lData;
	}
	return this.ready();
});