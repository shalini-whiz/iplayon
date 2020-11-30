/**
 * @PublicationName : upcomingListsReadStatus
 * @CollectionName : upcomingListsReadStatus
 * @publishDescription : to get the list of upcomingListsReadStatus
 */
Meteor.publish('upcomingListsReadStatus',function(){
	var lData = upcomingListsReadStatus.find({});
	if(lData){
		return lData;
	}
	return this.ready();
})