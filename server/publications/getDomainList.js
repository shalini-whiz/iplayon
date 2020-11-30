/**
 * @PublicationName : domains 
 * @CollectionName : domains
 * @publishDescription : to get the list of domain names
 */
Meteor.publish('domains', function() {
	var lData = domains.find({},{"sort":{"domainName":1}});
	if (lData) {
		return lData;
	}
	return this.ready();
});


