Meteor.methods({
	'saveFilterDateOfBirth' : function(eventOrganizer,mainProjectId,arrayToSave) {
		try{
			check(arrayToSave, Object);
			check(eventOrganizer,String);
			check(mainProjectId,String)
		}catch(e){

		}
		var find  = dobFilterSubscribe.findOne({
			eventOrganizer:eventOrganizer,
			mainProjectId:mainProjectId
		})
		if(find){
			dobFilterSubscribe.update({
				eventOrganizer:eventOrganizer,
				mainProjectId:mainProjectId
			},{
				$set:{
					details:arrayToSave
				}
			})
		}
		else{
			dobFilterSubscribe.insert({
				eventOrganizer:eventOrganizer,
				mainProjectId:mainProjectId,
				details:arrayToSave
			});
		}
	}
});