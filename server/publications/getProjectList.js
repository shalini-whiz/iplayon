/**
 * @PublicationName : projects
 * @CollectionName : projects
 * @publishDescription : to get the list of projects
 */
/*eteor.publish( 'projects', function(){
		 var lData = projects.find();
		 if(lData){
			 return lData;
		 }
	 	 return this.ready(); 
});*/

Meteor.publish( 'tournamentEvents', function(){
		 var lData = tournamentEvents.find();
		 if(lData){
			 return lData;
		 }
	 	 return this.ready(); 
});


Meteor.publish( 'tournamentEvents_Sports', function(){
		 var lData = tournamentEvents.find({},{fields:{"_id" : 1, "projectMainName":1}});
		 if(lData){
			 return lData;
		 }
	 	 return this.ready(); 
});


/*Meteor.publish("testPDF",function(){
	var lData = testPDF.find();
		 if(lData){
			 return lData;
		 }
	 	 return this.ready(); 
})*/