Meteor.methods({
	"saveTTFIORganizerDetails":async function(xData){
		var userID = ""
		var findDBforSport = false

		var res = {
			data:0,
			message:REGISTER_FAIL_MSG+"Organiser",
			status:FAIL_STATUS,
			response:""
		}

		//console.log("register organiser 1")
		try{
			if(xData){
				var regMetUser = await Meteor.call("registerValidationGeneralized",xData)
				//console.log("register organiser 2")
				try {
					if (regMetUser && regMetUser.response == 0 && regMetUser.playerID) {
						userID = regMetUser.playerID
						var source = ""
						if(xData.source){
							source = replaceExtraChar(xData.source)
						}

						//console.log("register organiser 3")
						var s = Meteor.users.update({
	                        "_id": userID
	                    }, {
	                        $set: {
	                            userId: userID,
	                            role: "Organiser",
	                            interestedProjectName: xData.interestedProjectName,
	                            userName: replaceExtraChar(xData.userName),
	                            source:source,
	                        }
	                    });

	                    if(s){
	                    	//console.log("register organiser 4")
	                    	var t = otherUsers.insert({
	                    		userId:userID,
								userName:replaceExtraChar(xData.userName),
								gender:replaceExtraChar(xData.gender),
								emailAddress:replaceExtraChar(xData.emailAddress),
								interestedDomainName:[""],
								interestedProjectName:xData.interestedProjectName,
								phoneNumber:replaceExtraChar(xData.phoneNumber),
								interestedSubDomain1Name:xData.interestedSubDomain1Name,
								interestedSubDomain2Name:xData.interestedSubDomain2Name,
								role: "Organiser",
								guardianName:"",
								address:replaceExtraChar(xData.address),
								city:replaceExtraChar(xData.city),
								pinCode:replaceExtraChar(xData.pinCode),
								state:replaceExtraChar(xData.state),
								country:replaceExtraChar(xData.country),
								statusOfUser:"Active",
								dateOfBirth:replaceExtraChar(xData.dateOfBirth),
								year:new Date().getFullYear(),
								source:source
	                    	})
	                    	if(t){
	                    		//console.log("register organiser 5")
	                    		var meteorUserJSON = Meteor.users.findOne({
	                    			"_id":userID
	                    		})
	                    		
	                    		if(meteorUserJSON){
	                    			//console.log("register organiser 6")
	                    			var data = [{
		                    			collectionName:"Meteor.users",
		                    			data:meteorUserJSON
		                    		}]

	                    			var otherUsersJson = otherUsers.findOne({
	                    				"userId":userID
	                    			})
	                    			if(otherUsersJson){
	                    				//console.log("register organiser 7")
	                    				var d = {
	                    					collectionName:"otherUsers",
	                    					data:otherUsersJson
	                    				}
	                    				data.push(d)

	                    				res = {
											data:data,
											message:REGISTER_SUCCESS_MSG,
											status:SUCCESS_STATUS,
											response:""
										}
	                    			}
	                    			else{
	                    				//console.log("register organiser 8")
	                    				var rmPlayer = Meteor.users.remove({
							                "_id": userID
							            })
							            var rmUser = otherUsers.remove({
							            	userId:userID
							            })
							            res.message = REGISTER_FAIL_MSG+"Organiser"
	                    			}
	                    		} else{
	                    			//console.log("register organiser 9")
	                    			var rmPlayer = Meteor.users.remove({
						                "_id": userID
						            })
						            var rmUser = otherUsers.remove({
						            	userId:userID
						            })
						            res.message = REGISTER_FAIL_MSG+"Organiser"
	                    		}

	                    	}
	                    	else{
	                    		//console.log("register organiser 10")
	                    		var rmPlayer = Meteor.users.remove({
					                "_id": userID
					            })
					            var rmUser = otherUsers.remove({
					            	userId:userID
					            })
					            res.message = REGISTER_FAIL_MSG+"Organiser"
	                    	}
	                    }
	                    else{
	                    	//console.log("register organiser 11")
	                    	var rmPlayer = Meteor.users.remove({
				                "_id": userID
				            })
	                    }
					}
					else{
						//console.log("register organiser 12")
						if (regMetUser && regMetUser.response == 1) {
							//console.log("register organiser 13")
							res.message = EMAIL_USED_MSG
						}
						else if (regMetUser && regMetUser.response == 2) {
							//console.log("register organiser 14")
							res.message = PHONE_USED_MSG
						}
					}
				}catch (e) {
					//console.log(e)
					//console.log("register organiser 15")
            		var rmPlayer = Meteor.users.remove({
		                "_id": userID
		            })
		            res.message = e
		            return res
        		}
			}
			else{
				//console.log("register organiser 16")
				res.message = XDATA_NULL_MSG
			}

			//console.log("register organiser 17")
			return res
		}catch(e){
			//console.log("register organiser 18")
			//console.log(e)
			res.message = e
			return res
		}
	}
})



