import {
    getDbNameforARole
}
from '../dbRequiredRole.js'

Meteor.methods({
	"getDetailsOfCountryOrganizers": function(){
		var res = {
			data:0,
			message:"cannot get details of country and organizers",
			status:FAIL_STATUS,
			response:""
		}
		try{
			var s = stateAssociationsForState.find({status:true}).fetch()
			if(s && s.length){

				var s1 = timeZone.find({}).fetch()
				if(s1 && s1.length){
					var data = s
					res.countries = s1
					res.status = SUCCESS_STATUS
					res.message = GET_COU_ORG_LIST_SUCCESS_MSG
					res.data = data
				}
			}

			return res
		}catch(e){
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"updateStateAssocIdOfEvents":function(){
		try{
			var s = events.find({
			}).fetch()
			var count = 0
			if(s && s.length){

				for(var i=0;i<s.length;i++){
					var stateID = ""
					if(s[i].eventOrganizer){
						var findWhichRole = Meteor.users.findOne({
		                    "userId":s[i].eventOrganizer
		                })
		                if(findWhichRole && findWhichRole.role){
		                    var role = getDbNameforARole(findWhichRole.role)
		                    if(role){
		                        var findStateId = global[role].findOne(
		                            {
		                                userId:s[i].eventOrganizer
		                            }
		                        )
		                        if(findStateId && findStateId.affiliatedTo){
		                            if(findStateId.role && 
		                                findStateId.role=="Academy" && 
		                                findStateId.affiliatedTo=="stateAssociation"){
		                                if(findStateId.associationId){
		                                    stateID = findStateId.associationId
		                                }
		                            }
		                            else if(findStateId.affiliatedTo=="districtAssociation"){
		                                if(findStateId.parentAssociationId){
		                                    stateID = findStateId.parentAssociationId
		                                }
		                            }
		                            else if(findStateId.associationType && 
		                                findStateId.associationType=="State/Province/County"){
		                                stateID = s[i].eventOrganizer
		                            }  
		                            else if(findStateId.associationType &&
		                                findStateId.associationType=="District/City" && 
		                                findStateId.affiliatedTo=="stateAssociation"){
		                                stateID = findStateId.parentAssociationId
		                            } 

		                            if(stateID){
		                            	try{
			                            	var k = events.update({
			                            		"_id":s[i]._id
			                            	},{
			                            		$set:{
			                            			"stateAssocId":stateID
			                            		}
			                            	})
			                            }catch(e){
			                            }
		                            	if(k){
		                            		count = count + 1
		                            	}
		                            }
		                        }
		                    }
		                }
					}
				}

				return count
			}else{
				return false
			}
		}catch(e){
			return false
		}
	}
})

Meteor.methods({
	"fetchEventsWithoutStateAssocId":function(){
		try{
			var s = events.find({
				"stateAssocId":null
			}).fetch()
			if(s && s.length){
				return s.length
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}
})

Meteor.methods({
	"insertStateAssociationIds":function(xData,type){
		try{
			var res = {
				data:0,
				status:FAIL_STATUS,
				message:"Could not insert state association"
			}
			if(xData){
				if(xData.stateId){
					var findStateDet = timeZone.findOne({
						"countryName":xData.stateId
					})
					if(findStateDet){
						if(xData.stateAssocId){
							var findCorstate = Meteor.users.findOne({
								userId:xData.stateAssocId
							})
							if(findCorstate){
								var assocDet = associationDetails.findOne({
									"userId":xData.stateAssocId
								})

								if(assocDet==undefined||assocDet==null){
									assocDet = academyDetails.findOne({
										"userId":xData.stateAssocId
									})
								}

								if(assocDet==undefined||assocDet==null){
									assocDet = otherUsers.findOne({
										"userId":xData.stateAssocId
									})
								}

								if(assocDet && assocDet.interestedDomainName && 
									assocDet.interestedDomainName.length && assocDet.interestedDomainName[0]){
									xData.stateIdDOm = assocDet.interestedDomainName[0]

										if(xData.associationName){
											var s = false
											if(type==1){
												//update 
												var findfirst = stateAssociationsForState.findOne({
													"stateAssocIds":xData.stateAssocId
												})
												if(findfirst){
													var s  = stateAssociationsForState.update({
														stateAssocIds:xData.stateAssocId
													},{
														$set:{
															"stateId":xData.stateIdDOm,
															"country":xData.stateId,
															"associationName":xData.associationName
														}
													})
													if(s){
														res.message = "updating success"
														res.status = SUCCESS_STATUS
													}
												}else{
													s = stateAssociationsForState.insert({
														"stateId":xData.stateIdDOm,
														"stateAssocIds":xData.stateAssocId,
														"country":xData.stateId,
														"associationName":xData.associationName
													})
													if(s){
														res.message = "insertion success"
														res.status = SUCCESS_STATUS
													}
												}

											}else if(type==3){
												//remove
												var findfirst = stateAssociationsForState.findOne({
													"stateAssocIds":xData.stateAssocId
												})
												if(findfirst){
													var s  = stateAssociationsForState.remove({
														"stateAssocIds":xData.stateAssocId
													})
													if(s){
														res.status = SUCCESS_STATUS
														res.message = "removed"
													}
												}else{
													res.message = "Invalid stateAssocId"
												}
											}
										}else{
											res.message = ASSOC_NAME_INVALID_MSG
										}
								}else{
									res.message = GET_DET_FOR_ORG_DET_INT_DOM_FAIL_MSG
								}
							}else{
								res.message = GET_DET_FOR_ORG_DET_FAIL_MSG
							}
						}else{
							res.message = "stateAssocId "+IS_NULL_MSG
						}
					}else{
						res.message = COUNTRY_INVALID_MSG
					}
				}else{
					res.message = COUNTRY_INVALID_MSG
				}
			}else{
				res.message = "parameters " + IS_NULL_MSG
			}
			return res
		}catch(e){
			console.log(e)
		}
	}
})


Meteor.methods({
	"getInsertedIDsForSelectedState":function(xData){
		try{
			var res = {
				data:0,
				status:FAIL_STATUS,
				message:"Could not get inserted Ids for selected state"
			}
			if(xData){
				if(xData.stateId){
					var findStateDet = timeZone.findOne({
						"countryName":xData.stateId
					})
					if(findStateDet){
						var getDet = stateAssociationsForState.aggregate([{
						    $match: {
						        country: xData.stateId
						    }
						}])
						if(getDet && getDet.length){
							res.message = "List is "
							res.status = SUCCESS_STATUS
							res.data = getDet
						}
					}else{
						res.message = STATE_INVALID_MSG
					}
				}else{
					res.message = STATE_INVALID_MSG
				}
			}else{
				res.message = "parameters " + IS_NULL_MSG
			}
			return res
		}catch(e){
			console.log(e)
		}
	}
})




