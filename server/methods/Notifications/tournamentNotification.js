events.after.insert(function (userId, doc) {
	try{
		if(doc)
		{
			data = doc;
			
        	var entryExists = events.findOne({
        				"_id":doc._id,"tournamentEvent":true
					 	});
        	if(entryExists)
        	{
        		
        		
        		topicType = 1;

				var notifyData = {
						"title":"New Tournament Announced", 
			            "body": entryExists.eventName+" - "+entryExists.domainName,
			            "sound":"default", 
			            "badge": "0",
			            "topic": "NewTournament" ,
			            "categoryIdentifier":"newTournament"
					}

					var dataParam = {};                  
                    dataParam["_id"] = data._id;


					Meteor.call("sendNotification",notifyData,dataParam,1,function(e,res){})
				
        	}
		}
	}catch(e){
	}
});