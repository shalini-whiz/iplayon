Meteor.methods({
	"deleteSubscriptionNationals":function(xData){
		var res = {
			status:"failure",
			message:"Could not delete subscriptions"
		}
		try{
			if(xData){
				if(xData.tournamentId){
					var db = "events"

					if(xData.schoolId){
						var checkTOur = events.findOne({
							"_id":xData.tournamentId
						})
						if(checkTOur == undefined || checkTOur == null){
							checkTOur = pastEvents.findOne({
								"_id":xData.tournamentId
							})
							db = "pastEvents"
						}

						if(checkTOur){
							var checkSchoolId = schoolDetails.findOne({
								"userId":xData.schoolId
							})
							if(checkSchoolId){
								var getTeamMembersOfThisSchool = schoolTeams.aggregate([{
								    $match: {
								        "tournamentId": xData.tournamentId,
								        "schoolId": xData.schoolId
								    }
								}, {
								    $unwind: {
								        path: "$teamMembers",
								        preserveNullAndEmptyArrays: true
								    }
								}, {
								    $project: {
								        "teamMembers.playerId": 1
								    }
								}, {
								    $group: {
								        "_id": null,
								        "pla": {
								            $push: "$teamMembers.playerId"
								        }
								    }
								}])


								if(getTeamMembersOfThisSchool && getTeamMembersOfThisSchool.length && 
									getTeamMembersOfThisSchool[0] && 
									getTeamMembersOfThisSchool[0].pla){
									//remove event participants
									var remEve = global[db].update({
										tournamentId:xData.tournamentId
									},{
										$pull:{
											eventParticipants:{
												$in:getTeamMembersOfThisSchool[0].pla
											}
										}
									},{multi:true})

									if(remEve){
										schoolTeams.remove({
											schoolId:xData.schoolId,
											tournamentId:xData.tournamentId
										},{multi:true})

										schoolPlayerEntries.remove({
											schoolId:xData.schoolId,
											tournamentId:xData.tournamentId
										},{multi:true})

										schoolPlayerTeamEntries.remove({
											schoolId:xData.schoolId,
											tournamentId:xData.tournamentId
										},{multi:true})

										res.status = "success"
										res.message = "Deleted entries for the given schoolId"
									}else{
										res.message = "Could not remove team members"
									}

								}else{
									res.message = "No team members"
								}
							}else{
								res.message = "schoolId is invalid"
							}
						}else{
							res.message = "tournamentId is invalid"
						}
					}else{
						res.message = "schoolId is null"
					}
				}else{
					res.message = "tournamentId is null"
				}
			}else{
				res.message = "parameters are null"
			}

			

			return res
		}catch(e){
			res.message = e.toString()
			return res
		}
	}
})