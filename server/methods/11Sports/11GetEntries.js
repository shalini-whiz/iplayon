Meteor.methods({
	"getEntriesForGivenStateId":function(xData){
		var res = {
			"status":"failure",
			"data":0,
			"message":"entries could not be fetched"
		}
		try{
			if(xData.apiUserId){
				var apiUSerCheck = apiUsers.findOne({
					"userId":xData.apiUserId
				})
				
				if(apiUSerCheck){

					if(xData.stateId){

						var stateCheck = domains.findOne({
							"_id":xData.stateId
						})
						if(stateCheck){
							

							var det = events.findOne({
								"eventOrganizer":xData.apiUserId,
								"domainId":xData.stateId
							})

						
							
							if(det){

							}
							else{
								res.message = "no tournaments from this organizer"
							}
						}
						else{
							res.message = "stateId is Invalid"
						}
					}
					else{
						res.message = "stateId is required"
					}
				}else{
					res.message = "apiUserId is Invalid"
				}
			}else{
				res.message  = "apiUserId is required"
			}
			return res
		}catch(e){
			res.message = e
			if(e && e.toString()){
				res.error = e.toString()
			}
			return res
		}
	}
})