/**
 * @PublicationName inbox 
 * to publish the list of inbox from collection inbox
 * @CollectionName inbox
 */
Meteor.publish( 'inbox', function(){
		 var lData = inbox.find();
		 if(lData){
			 return lData;
		 }
	 	 return this.ready(); 
});