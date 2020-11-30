/**
 * @PublicationName eventUploads 
 * to publish the list of eventUpload files details
 *  from collection eventUploads
 * @CollectionName eventUploads
 */
Meteor.publish( 'teamUploads', function(){
		 var lData = teamUploads.find();

		 if(lData){
			 return lData;
		 }
	 	 return this.ready(); 
	 
});