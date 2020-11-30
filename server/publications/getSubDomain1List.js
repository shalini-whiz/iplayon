/**
 * @PublicationName : subDomain1
 * @CollectionName : subDomain1
 * @publishDescription : to get the list of subDomain1
 */
Meteor.publish('subDomain1', function() {
	var lData = subDomain1.find();
	if (lData) {
		return lData;
	}
	return this.ready();
});