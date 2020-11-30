Meteor.methods({
	'generateAPIKey': function(websiteNameVar,sourceVal){
		try{
			check(websiteNameVar, String)
			var APIKey = Random.hexString([32]);
			var currentWebsiteId = apiUsers.findOne({ apiUser: websiteNameVar });
			if(currentWebsiteId != undefined){
				if( currentWebsiteId.apiUser === websiteNameVar ){
					apiUsers.update({"_id": currentWebsiteId._id} ,{$set: { "apiKey": APIKey,"source":sourceVal } } );
				}		
			}
	        else{
				var j = apiUsers.insert({
					'apiUser': websiteNameVar,
					'userId' : this.userId,
					'apiKey' : APIKey,
					"source":sourceVal
					});
					return j
			}
		}catch(e){

		}	
	}
 	
});