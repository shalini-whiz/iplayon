import {
    getDbNameforARole
}
from '../../dbRequiredRole.js'

Meteor.methods({
	"getListOfStateDistAssociations":async function(xData,assocType,userStatus){
		var res = {
			data:0,
			message:GET_ASSOC_LIST_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData && xData.source){
				var s = apiUsers.find({
					source:xData.source
				}).fetch()
				//console.log("length is ")
				//console.log(s.length)
				if(s && s.length > 0 ){
					if(s.length==1){
						//console.log(assocType)
						//console.log(xData.source)
						var query = {
							source: xData.source,
						    role:"Association",
						    associationType:assocType,
						} 

						if(userStatus){
							query["userStatus"] = userStatus
						}

						var assocs = Meteor.users.aggregate([{
						    $match: query
						}, {
						    $lookup: {
						        from: "associationDetails",
						        localField: "userId",
						        foreignField: "userId",
						        as: "assocsDet"
						    }
						}])

						//console.log(assocs)
						if(assocs && assocs.length){
							res.data = assocs
							res.message = "list of "+ assocType + " for given source "+xData.source
							res.status = SUCCESS_STATUS
						}
						else{
							res.message = GET_ASSOC_LIST_FAIL_EMPTY_MSG
						}
					}
					else{
						res.message = GET_ASSOC_MULTI_SOURCE_MSG
					}
				}
				else{
					res.message = "source" + IS_INVALID_MSG
				}
			}
			else{
				res.message = "source" + IS_INVALID_MSG
			}
			return res
		}
		catch(e){
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"getListOfAcademiesAPI":async function(xData,userStatus){
		var res = {
			data:0,
			message:GET_ACAD_LIST_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData && xData.source){
				var s = apiUsers.find({
					source:xData.source
				}).fetch()
				//console.log("length is ")
				//console.log(s.length)
				if(s && s.length > 0 ){
					if(s.length==1){
						//console.log(xData.source)

						var query = {
						    source: xData.source,
						    role:"Academy",
						}
						if(userStatus){
							query["userStatus"] = userStatus
						}

						var assocs = Meteor.users.aggregate([{
						    $match: query
						}, {
						    $lookup: {
						        from: "academyDetails",
						        localField: "userId",
						        foreignField: "userId",
						        as: "acadDet"
						    }
						}])
						//console.log(assocs)
						if(assocs && assocs.length){
							res.data = assocs
							res.message = "list of academyDetails " + " for given source "+xData.source
							res.status = SUCCESS_STATUS
						}
						else{
							res.message = GET_ACAD_LIST_FAIL_EMPTY_MSG
						}
					}
					else{
						res.message = GET_ASSOC_MULTI_SOURCE_MSG
					}
				}
				else{
					res.message = "source" + IS_INVALID_MSG
				}
			}
			else{
				res.message = "source" + IS_INVALID_MSG
			}
			return res
		}
		catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"getAffiliated_NonAcademies":async function(xData,affiliated,withState){
		var res = {
			data:0,
			message:GET_ACAD_LIST_AFIL_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		//console.log("getAffiliated_NonAcademies !! called")
		//console.log(JSON.stringify(xData))
		//console.log(affiliated)
		//console.log(withState)
		try{
			if(xData && xData.source){
				var s = apiUsers.find({
					source:xData.source
				}).fetch()
				if(s && s.length > 0 ){
					if(s.length==1){
						var query = {}

						if(affiliated=="stateAssociation"){
							query = {
								"affiliatedTo" : affiliated,
								"associationId":{
									"$ne":null
								},
								source:xData.source,
							}

							if(withState){
								var sUser = new AssocUsers(xData)
								var v = []
								var j = 0
								v[j] = sUser.nullUndefinedEmpty("stateAssociationId")

								if(v[j]=="1"){
									var stateCheck = await Meteor.call("getDetailsOfGivenStateId",xData,"State/Province/County",true)
									if(stateCheck && stateCheck.status == SUCCESS_STATUS){
										query["associationId"] = xData.stateAssociationId
									}
									else{
										res.message = stateCheck.message
										return res
									}
								}
								else{
									res.message = v[j]
									return res
								}
							}
						}
						else if(affiliated=="districtAssociation"){
							query = {
								"affiliatedTo" : affiliated,
								"parentAssociationId":{
									"$ne":null
								},
								"associationId":{
									"$ne":null
								},
								source:xData.source,
							}

							if(withState){
								var sUser = new AssocUsers(xData)
								var v = []
								var j = 0
								v[j] = sUser.nullUndefinedEmpty("districtAssociationId")

								if(v[j]=="1"){
									var stateCheck = await Meteor.call("getDetailsOfGivenStateId",xData,"District/City",true)
									//console.log("stateCheck 1!1 pwww")
									//console.log(JSON.stringify(stateCheck))

									if(stateCheck && stateCheck.status == SUCCESS_STATUS && stateCheck.data && stateCheck.data.parentAssociationId){
										query["associationId"] = xData.districtAssociationId
										query["parentAssociationId"] = stateCheck.data.parentAssociationId
									}
									else{
										res.message = stateCheck.message
										return res
									}
								}
								else{
									res.message = v[j]
									return res
								}
							}
						}
						else{
							query = {
								"affiliatedTo" : "other",
								source:xData.source,
							}
						}

						//console.log(query)
						var assocs = academyDetails.aggregate([{
						    $match: query
						}, {
						    $lookup: {
						        from: "users",
						        localField: "userId",
						        foreignField: "userId",
						        as: "userDet"
						    }
						}])

						if(assocs && assocs.length){
							res.data = assocs
							res.message = "list of "+ " academies for given source "+xData.source
							res.status = SUCCESS_STATUS
						}
						else{
							res.message = GET_ACAD_LIST_FAIL_EMPTY_MSG
						}
					}
					else{
						res.message = GET_ASSOC_MULTI_SOURCE_MSG
					}
				}
				else{
					res.message = "source" + IS_INVALID_MSG
				}
			}
			else{
				res.message = "source" + IS_INVALID_MSG
			}
			return res
		}
		catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})


Meteor.methods({
	"getAffiliated_NonDistAssociations":async function(xData,assocType,affiliated,withState){
		var res = {
			data:0,
			message:GET_ASSOC_LIST_AFIL_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData && xData.source){
				var s = apiUsers.find({
					source:xData.source
				}).fetch()
				if(s && s.length > 0 ){
					if(s.length==1){
						var query = {}

						if(affiliated){
							query = {
								associationType:assocType,
								"affiliatedTo" : "stateAssociation",
								"parentAssociationId":{
									"$ne":null
								},
								source:xData.source,
							}

							if(withState){
								var sUser = new AssocUsers(xData)
								var v = []
								var j = 0
								v[j] = sUser.nullUndefinedEmpty("stateAssociationId")

								if(v[j]=="1"){
									var stateCheck = await Meteor.call("getDetailsOfGivenStateId",xData,"State/Province/County",true)
									if(stateCheck && stateCheck.status == SUCCESS_STATUS){
										query["parentAssociationId"] = xData.stateAssociationId
									}
									else{
										res.message = stateCheck.message
										return res
									}
								}
								else{
									res.message = v[j]
									return res
								}
							}
						}
						else{
							query = {
								associationType:assocType,
								"affiliatedTo" : "other",
								source:xData.source,
							}
						}


						//console.log(query)
						var assocs = associationDetails.aggregate([{
						    $match: query
						}, {
						    $lookup: {
						        from: "users",
						        localField: "userId",
						        foreignField: "userId",
						        as: "userDet"
						    }
						}])

						if(assocs && assocs.length){
							res.data = assocs
							res.message = "list of "+ assocType + " for given source "+xData.source
							res.status = SUCCESS_STATUS
						}
						else{
							res.message = GET_ASSOC_LIST_FAIL_EMPTY_MSG
						}
					}
					else{
						res.message = GET_ASSOC_MULTI_SOURCE_MSG
					}
				}
				else{
					res.message = "source" + IS_INVALID_MSG
				}
			}
			else{
				res.message = "source" + IS_INVALID_MSG
			}
			return res
		}
		catch(e){
			res.message = e
			return res
		}
	}
})

Meteor.methods({
    "getDetailsOfGivenStateId": async function(xData,associationType,checksource) {
        var response = {}
        try {
            if (xData) {
            	var mesId = "state or district id"

            	if(associationType==undefined||associationType==null){
                	associationType="State/Province/County"
                }

                if(associationType=="State/Province/County"){
                	mesId = "stateAssociationId"
                }
            	else if(associationType=="District/City"){
            		mesId = "districtAssociationId"
                }

                if ((xData.stateAssociationId != null && xData.stateAssociationId != undefined &&
                    xData.stateAssociationId.trim().length != 0)||
                    (xData.districtAssociationId != null && xData.districtAssociationId != undefined &&
                    xData.districtAssociationId.trim().length != 0)){

                	
                	
                	var userId  = ""
                	if(associationType=="State/Province/County"){
                		userId = xData.stateAssociationId
                		mesId = "stateAssociationId"
                	}
                	else if(associationType=="District/City"){
                		userId = xData.districtAssociationId
                		mesId = "districtAssociationId"
                	}

                    //check for valid stateassociationid
                    var userAssoc = Meteor.users.findOne({
                        userId: userId,
                        "associationType": associationType
                    })

                    if(checksource){
                    	userAssoc = Meteor.users.findOne({
	                        userId: userId,
	                        "associationType": associationType,
	                        "source":xData.source
                    	})
                    }

                    //console.log("dist .. !")
                    //console.log(userAssoc)
                    //console.log(xData.districtAssociationId)

                    if (userAssoc) {
                        var assocDetails = associationDetails.findOne({
                            userId: userId,
                            "associationType": associationType
                        })
                        if(checksource){
                        	assocDetails = associationDetails.findOne({
	                            userId: userId,
	                            "associationType": associationType,
	                            "source":xData.source
	                        })
                        }
                        if (assocDetails) {
                        	assocDetails.userDet = userAssoc
                        	//console.log("hered fetched assocDetails")
                            var data = {
                                "status": SUCCESS_STATUS,
                                "message": ASSOC_DETAILS_MSG,
                                "result": true,
                                "data": assocDetails
                            }
                            response = data
                        } else {
                            var data = {
                                "status": FAIL_STATUS,
                                "message": mesId + IS_INVALID_MSG,
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var data = {
                            "status": FAIL_STATUS,
                            "message": mesId + IS_INVALID_MSG,
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "status": FAIL_STATUS,
                        "message": mesId + IS_INVALID_MSG,
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "status": FAIL_STATUS,
                    "message": XDATA_NULL_MSG,
                    "result": false,
                    "data": 0
                }
                response = data
            }
            //console.log("whole res")
            //console.log(JSON.stringify(response))
            return response
        } catch (e) {
            var data = {
                "status": FAIL_STATUS,
                "message": e,
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})

Meteor.methods({
	"getDetailsOfCountryState": function(){
		var res = {
			data:0,
			message:"cannot get details of country and state",
			status:FAIL_STATUS,
			response:""
		}
		try{
			var s = timeZone.find({}).fetch()
			if(s && s.length){
				var data = {
					"collectionName":"timeZone",
					data:s
				}
				res.status = SUCCESS_STATUS
				res.message = GET_COU_STATE_LIST_SUCCESS_MSG
				res.data = data
			}

			return res
		}catch(e){
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"getDetailsOfCountryForGivenCountryName": function(xData,dbDetails){
		if(typeof xData == "string"){
			data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}

		var res = {
			data:0,
			message:GET_COU_STATE_FOR_COU_DET_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				var sUser = new MeteorUsers(xData)

				var v = []
				var j = 0

				v[j] = sUser.nullUndefinedEmpty("country")
				if(v[j]=="1"){
				 	v[j=j+1] = sUser.validateCountry()
				}
				
				var messageErr = ""
				for(var i=0;i<v.length;i++){
					if(v[i]!="1"){
						anyFailures = true

						if(messageErr && messageErr.replace(/\s+/g,' ').trim().length==0){
							messageErr = v[i]
						}
						else{
							messageErr = messageErr + " .\n" + v[i]
						}
					}
				}
				if(messageErr && messageErr.replace(/\s+/g,' ').trim().length==0){
					var couDetails = timeZone.findOne({countryName:replaceExtraChar(xData.country)}) 
					if(couDetails && dbDetails==true){
						var data = {
							"collectionName":"timeZone",
							data:couDetails
						}
						res = {
							data:data,
							message:GET_COU_STATE_FOR_COU_DET_MSG,
							status:SUCCESS_STATUS,
							response:""
						}
					}
					else if(couDetails && dbDetails==false){
						res = {
							data:couDetails,
							message:GET_COU_STATE_FOR_COU_DET_MSG,
							status:SUCCESS_STATUS,
							response:""
						}
					}
					else{
						res.message = GET_COU_STATE_FOR_COU_LIST_FAIL_MSG
					}
				}
				else if(messageErr==undefined||messageErr==null||
					messageErr.trim().length==0){
					var couDetails = timeZone.findOne({countryName:replaceExtraChar(xData.country)}) 
					if(couDetails){
						if(couDetails && dbDetails==true){
							var data = {
								"collectionName":"timeZone",
								data:couDetails
							}
							res = {
								data:data,
								message:GET_COU_STATE_FOR_COU_DET_MSG,
								status:SUCCESS_STATUS,
								response:""
							}
						}
						else if(couDetails && dbDetails==false){
							res = {
								data:couDetails,
								message:GET_COU_STATE_FOR_COU_DET_MSG,
								status:SUCCESS_STATUS,
								response:""
							}
						}
					}
					else{
						res.message = GET_COU_STATE_FOR_COU_LIST_FAIL_MSG
					}
				}
				else{
					res.message = messageErr
				}
			}
			else{
				res.message = XDATA_NULL_MSG
			}
			return res
		}catch(e){
			res.message = e
			return res
		}
	}
})
Meteor.methods({
    "getDetailsOfGivenAcademyId": async function(xData,checksource) {
        var response = {
        	data:0,
			message:GET_DET_FOR_ACAD_ID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
        }
        try {
            if (xData) {
            	var mesId = "academy id"
                if ((xData.academyId != null && xData.academyId != undefined &&
                    xData.academyId.trim().length != 0)){
                	
                	var userId  = xData.academyId
                	
                    //check for valid stateassociationid
                    var userAssoc = Meteor.users.findOne({
                        userId: userId,
                    })

                    if(checksource){
                    	userAssoc = Meteor.users.findOne({
	                        userId: userId,
	                        "source":xData.source
                    	})
                    }

                    //console.log("dist .. !")
                    //console.log(userAssoc)
                    //console.log(xData.districtAssociationId)

                    if (userAssoc) {
                        var assocDetails = academyDetails.findOne({
                            userId: userId,
                        })
                        if(checksource){
                        	assocDetails = academyDetails.findOne({
	                            userId: userId,
	                            "source":xData.source
	                        })
                        }
                        if (assocDetails) {
                        	//console.log("hered fetched academyDetails")
                        	assocDetails.userDet = userAssoc
                            var data = {
                                "status": SUCCESS_STATUS,
                                "message": GET_DET_FOR_ACAD_ID_MSG,
                                "result": true,
                                "data": assocDetails
                            }
                            response = data
                        } else {
                            var data = {
                                "status": FAIL_STATUS,
                                "message": mesId + IS_INVALID_MSG,
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var data = {
                            "status": FAIL_STATUS,
                            "message": mesId + IS_INVALID_MSG,
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "status": FAIL_STATUS,
                        "message": mesId +IS_INVALID_MSG,
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "status": FAIL_STATUS,
                    "message": XDATA_NULL_MSG,
                    "result": false,
                    "data": 0
                }
                response = data
            }
            //console.log("whole res")
            //console.log(JSON.stringify(response))
            return response
        } catch (e) {
            var data = {
                "status": FAIL_STATUS,
                "message": e,
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})

Meteor.methods({
	"getUserDetailsForgivenDBAndQuery": async function(db,query1,query2){
		var response = {
			message:GET_User_Det_DB_Query_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
        }
        try {
        	var msg = ""
        	if(query1.userId){
        		msg = " for "+ query1.userId
        	}
        	var metUser = Meteor.users.findOne(query1)
        	if(db && metUser){
        		db = db
        	}
        	else if(metUser){
        		//console.log("metUser is !!")
        		//console.log(JSON.stringify(metUser))
        		if(metUser.role && metUser.role.toLowerCase()!= "player"){
        			//console.log(metUser.role)
        			db = getDbNameforARole(metUser.role)
        			//console.log("user db is ")
        			//console.log(db)
        		}
        	}

        	if(metUser && db){
        		//console.log("jksdf kjhfghjdkghhk")
        		var dataUSer = global[db].findOne(
        			query2
        		)
        		if(dataUSer){
        			response = {
			        	data1:metUser,
			        	data2:dataUSer,
						message:USER_DET_MSG,
						status:SUCCESS_STATUS,
						response:""
			        }
        		}
        		else{
        			response = {
						message:USER_DET_FAIL_MSG + db + msg,
						status:FAIL_STATUS,
						response:"",
						data1:metUser
			        }
        		}
        	}
        	else{
        		response = {
					message:USER_DET_FAIL_MSG + "MeteorUsers" + msg ,
					status:FAIL_STATUS,
					response:""
		        }
        	}

        	//console.log(JSON.stringify(response))
        	return response
        }
        catch (e) {
            var data = {
                "status": FAIL_STATUS,
                "message": e,
                "result": false,
            }
            response = data
            return response
        }
	}
})

