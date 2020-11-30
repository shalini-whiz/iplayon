import {
    playerDBFind    
}
from '../../dbRequiredRole.js'

Meteor.methods({
	"apiMeteorUsersValidation":function(xData,role){
		/*xData = {
			emailAddress:"jksfhkhj@asd.com",
			role:"organiser",
			interestedProjectName:["QvHXDftiwsnc8gyfJ"],
			userName:"sjdf",
			verifiedBy:["email"],
			password:"abcdef",
			emailIdOrPhone:3
		}*/
		var res = {
			data:0,
			message:"Meteor Users "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				var registerTypeArray = ["bulk","individual"]

				if(xData.emailIdOrPhone==undefined ||
					xData.emailIdOrPhone == null ||
					isNaN(xData.emailIdOrPhone)){
					xData.emailIdOrPhone = 3
				}

				if(xData.registerTypeArray && xData.registerTypeArray.length){
					registerTypeArray = xData.registerTypeArray
				}

				var sUser =  new MeteorUsers(xData)

				//console.log("SUSER is ")
				//console.log(JSON.stringify(sUser))
				var v = []
				var j = 0

				v[j] = sUser.nullUndefinedEmpty("role")
				if(v[j]=="1"){
				 	v[j=j+1] = sUser.roleValidation()
				 	if(v[j]=="1" && role){
				 		v[j=j+1] = sUser.checkWithGivenValue(role,"role")
				 		//console.log(sUser.checkWithGivenValue(role,"role"))
				 		//console.log("after role cehck")
				 		//console.log("role check,,")
				 		//console.log(v[j])
				 	} 
				}

				if(xData.emailIdOrPhone==1 || xData.emailIdOrPhone == 3){
					v[j=j+1] = sUser.nullUndefinedEmpty("emailAddress")
					if(v[j]=="1"){
					 	v[j=j+1] = sUser.validateEmail("emailAddress")
					}
				}

				if(xData.emailIdOrPhone==2 || xData.emailIdOrPhone == 3){
					v[j=j+1] = sUser.nullUndefinedEmpty("phoneNumber")
					if(v[j]=="1"){
					 	v[j=j+1] = sUser.validateMobileNum10("phoneNumber")
					}
				}

				if(parseInt(xData.emailIdOrPhone)!=1&&parseInt(xData.emailIdOrPhone)!=2&&parseInt(xData.emailIdOrPhone)!=3){
					j = -1
				}


				v[j=j+1] = sUser.nullUndefinedEmpty("registerType")
				if(v[j]=="1"){
				 	v[j=j+1] = sUser.checkRegisterType(registerTypeArray)

				 	if(v[j]=="1" && sUser.registerType == "individual"){
				 		v[j=j+1] = sUser.nullUndefined("verifiedBy")
						if(v[j]=="1"){
							if(xData.emailIdOrPhone==1){
								v[j=j+1] = sUser.checkWithinGivenValues(["email"],"verifiedBy")
							}
							else if(xData.emailIdOrPhone==2){
								v[j=j+1] = sUser.checkWithinGivenValues(["phone"],"verifiedBy")
							}
							else if(xData.emailIdOrPhone==3){
								v[j=j+1] = sUser.checkverifiedBy()
							}
						}
				
						v[j=j+1] = sUser.nullUndefinedEmpty("password")
						//console.log("password validation .. !")
						//console.log(v)
						//console.log(j)
						if(v[j]=="1"){
						 	v[j] = sUser.validateCharLenWithGivenMin(6,"password")
						}
					}
				}				

				v[j=j+1] = sUser.nullUndefinedEmpty("userName")
				

				v[j=j+1] = sUser.nullUndefined("interestedProjectName")
				if(v[j]=="1"){
				 	v[j=j+1] = sUser.checkinterestedProjectName()
				}
				//console.log("length is !! ifbv")
				//console.log(v)
				//console.log(v.length)
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
					res = {
						data:xData,
						message:"Meteor Users "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else if(messageErr==undefined||messageErr==null||
					messageErr.trim().length==0){
					res = {
						data:xData,
						message:"Meteor Users "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else{
					res.message = messageErr
				}
			}
			else{
				res.message = XDATA_NULL_MSG
			}
			//console.log("res from 1")
			//console.log(res)
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"apiDateFieldsUsersValidation":function(xData,key,checkEmpty){
		var res = {
			data:0,
			message:"date field "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				var sUser =  new MeteorUsers(xData)
				//console.log("other users..")
				//console.log(sUser)
				var v = []
				var j = 0

				if (checkEmpty==true) {
					v[j] =  sUser.nullUndefinedEmpty(key)
				
					if(v[j]=="1"){
						if(v[j]=="1"){
					 		v[j=j+1] = sUser.validateDate(key)
					 	}
					}
				}
				//console.log("after address null")
				//console.log("j is ..! "+j)
				//console.log(v[j])

				var messageErrs = ""

				for(var k=0;k<v.length;k++){
					if(v[k]!="1"){

						if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
							messageErrs = v[k]
						}
						else{
							messageErrs = messageErrs + " .\n" + v[k]
						}
					}
				}
				//console.log("After for looppp")
				//console.log(messageErrs)
				if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
					res = {
						data:xData,
						message:"date field " + VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else if(messageErrs==undefined||messageErrs==null||
					messageErrs.trim().length==0){
					//console.log("dghhdgf ")
					res = {
						data:xData,
						message:"date field " + VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else{
					res.message = messageErrs
				}
			}
			else{
				res.message = XDATA_NULL_MSG
			}

			//console.log(res)
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"apiGenderFieldsUsersValidation":function(xData){
		var res = {
			data:0,
			message:"Gender field "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				var sUser =  new MeteorUsers(xData)
				//console.log("other users..")
				//console.log(sUser)
				var v = []
				var j = 0


				v[j] = sUser.nullUndefinedEmpty("gender")
				if(v[j]=="1"){
				 	v[j=j+1] = sUser.validateGenderMaleOrFemale()
				}

				//console.log("after address null")
				//console.log("j is ..! "+j)
				//console.log(v[j])

				var messageErrs = ""

				for(var k=0;k<v.length;k++){
					if(v[k]!="1"){

						if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
							messageErrs = v[k]
						}
						else{
							messageErrs = messageErrs + " .\n" + v[k]
						}
					}
				}
				//console.log("After for looppp")
				//console.log(messageErrs)
				if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
					res = {
						data:xData,
						message:"Gender field "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else if(messageErrs==undefined||messageErrs==null||
					messageErrs.trim().length==0){
					//console.log("dghhdgf ")
					res = {
						data:xData,
						message:"Gender field "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else{
					res.message = messageErrs
				}
			}
			else{
				res.message = XDATA_NULL_MSG
			}

			//console.log(res)
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"apiGeneralFieldsUsersValidation":function(xData){
		/*xData = {
			phoneNumber:"sdfjhdfh"
		}*/
		var res = {
			data:0,
			message:"general field "+VALID_SUCCESS_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				var sUser =  new MeteorUsers(xData)
				//console.log("other users..")
				//console.log(sUser)
				var v = []
				var j = 0

				if(xData.emailIdOrPhone==undefined ||
					xData.emailIdOrPhone == null ||
					isNaN(xData.emailIdOrPhone)){
					xData.emailIdOrPhone = 3
				}

				if(xData.emailIdOrPhone==1 || xData.emailIdOrPhone == 3){
					v[j=j+1] = sUser.nullUndefinedEmpty("emailAddress")
					if(v[j]=="1"){
					 	v[j=j+1] = sUser.validateEmail("emailAddress")
					}
				}

				if(xData.emailIdOrPhone==2 || xData.emailIdOrPhone == 3){
					v[j=j+1] = sUser.nullUndefinedEmpty("phoneNumber")
					if(v[j]=="1"){
					 	v[j=j+1] = sUser.validateMobileNum10("phoneNumber")
					}
				}

				if(xData.emailIdOrPhone!=1||xData.emailIdOrPhone!=2||xData.emailIdOrPhone!=3){
					j = -1
				}


				v[j=j+1] = sUser.nullUndefinedEmpty("country")
				if(v[j]=="1"){
					v[j=j+1] = sUser.validateCountry()
					v[j=j+1] = sUser.nullUndefinedEmpty("state")
					if(v[j]=="1"){
						v[j=j+1] = sUser.validateState()
					}
				}
				
				v[j=j+1] = sUser.nullUndefinedEmpty("city")

				v[j=j+1] = sUser.nullUndefinedEmpty("pinCode")
				if(v[j]=="1"){
				 	v[j=j+1] = sUser.validatePinCode()
				}
				
				v[j=j+1] = sUser.nullUndefined("address")
				//console.log("after address null")
				//console.log("j is ..! "+j)
				//console.log(v[j])

				var messageErrs = ""

				for(var k=0;k<v.length;k++){
					if(v[k]!="1"){

						if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
							messageErrs = v[k]
						}
						else{
							messageErrs = messageErrs + " .\n" + v[k]
						}
					}
				}
				//console.log("After for looppp")
				//console.log(messageErrs)
				if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
					res = {
						data:xData,
						message:"general field "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else if(messageErrs==undefined||messageErrs==null||
					messageErrs.trim().length==0){
					//console.log("dghhdgf ")
					res = {
						data:xData,
						message:"general field "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else{
					res.message = messageErrs
				}
			}
			else{
				res.message = XDATA_NULL_MSG
			}

			//console.log(res)
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"apiSchoolAbbrevation":function(xData){
		var res = {
			data:0,
			message:"abbrevation field "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			//console.log("apiSchoolAbbrevation .. 1")
			if(xData){
				//console.log("apiSchoolAbbrevation .. 2")
				var abbKey = "abbrevation"
				var v = []
				var j = 0

				var sUser =  new AssocUsers(xData)
				v[j] = sUser.nullUndefinedEmpty(abbKey)
				//console.log("apiSchoolAbbrevation .. 3")
				if(v[j]=="1"){
					//console.log("apiSchoolAbbrevation .. 4")
					v[j=j+1] = sUser.checkForAbbrevationDup(abbKey)
				}


				//console.log("after address null")
				//console.log("j is ..! "+j)
				//console.log(v[j])

				var messageErrs = ""

				for(var k=0;k<v.length;k++){
					if(v[k]!="1"){

						if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
							messageErrs = v[k]
						}
						else{
							messageErrs = messageErrs + " .\n" + v[k]
						}
					}
				}
				//console.log("After for looppp")
				//console.log(messageErrs)
				if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
					res = {
						data:xData,
						message:"Abbrevation field "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else if(messageErrs==undefined||messageErrs==null||
					messageErrs.trim().length==0){
					res = {
						data:xData,
						message:"Abbrevation field "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else{
					res.message = messageErrs
				}

			}else{
				//console.log("apiSchoolAbbrevation .. 7")
				res.message = XDATA_NULL_MSG
			}

			//console.log(res)
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"apiAssocFieldsUsersValidation":function(xData,type){
		//console.log("call ing ..")
		/*xData = {
			phoneNumber:"sdfjhdfh"
		}*/
		var res = {
			data:0,
			message:"Assoc field "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				var sUser =  new AssocUsers(xData)
				//console.log("other users..")
				//console.log(sUser)
				var v = []
				var j = 0
				
				var abbKey = ""
				var assAcadName = ""
				if(type){
					abbKey = "assocAbbrevation"
					assAcadName = "associationName"
				}
				else if(type==false){
					abbKey = "abbrevation"
					assAcadName = "clubName"
				}
				//console.log(abbKey)
				//console.log(xData[abbKey])
				v[j] = sUser.nullUndefinedEmpty(abbKey)
				if(v[j]=="1"){
					v[j=j+1] = sUser.checkForAbbrevationDup(abbKey)
				}

				v[j=j+1] = sUser.nullUndefinedEmpty(assAcadName)
				
				if(type){
					v[j=j+1] = sUser.nullUndefinedEmpty("associationType")

					if(v[j]=="1" && type){
					 	v[j=j+1] = sUser.checkWithGivenValue(type,"associationType")
					}
				}

				v[j=j+1] = sUser.nullUndefined("interestedDomainName")
				if(v[j]=="1"){
					v[j=j+1] = sUser.checkinterestedDomaiName()
				}
				
				//console.log("after address null")
				//console.log("j is ..! "+j)
				//console.log(v[j])

				var messageErrs = ""

				for(var k=0;k<v.length;k++){
					if(v[k]!="1"){

						if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
							messageErrs = v[k]
						}
						else{
							messageErrs = messageErrs + " .\n" + v[k]
						}
					}
				}
				//console.log("After for looppp")
				//console.log(messageErrs)
				if(messageErrs && messageErrs.replace(/\s+/g,' ').trim().length==0){
					res = {
						data:xData,
						message:"Assoc field "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else if(messageErrs==undefined||messageErrs==null||
					messageErrs.trim().length==0){
					//console.log("dghhdgf ")
					res = {
						data:xData,
						message:"Assoc field "+VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else{
					res.message = messageErrs
				}
			}
			else{
				res.message = XDATA_NULL_MSG
			}

			//console.log(res)
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

//to call first
Meteor.methods({
	"validatePhoneNumbEmail":async function(xData){
		/*xData = {
			emailAddress:"pp@ee.cc",
			phoneNumber:"1111191111"
		}*/
		var res = {
			data:0,
			message:"email or phone " + VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				var num = 0
				var data ;

				var validationClassObject = new validationClass();
				var s = validationClassObject.nullUndefinedEmpty(xData.emailAddress)
				var s1 = validationClassObject.nullUndefinedEmpty(xData.phoneNumber)

				if(s==1 && s1==1){
					num = 3
					data = {
						emailAddress:xData.emailAddress,
						phoneNumber:xData.phoneNumber
					}
				}
				else if(s==1 && s1 != 1){
					num = 1
					data = xData.emailAddress
				}
				else if(s1==1 && s != 1){
					num = 2
					data = xData.phoneNumber
				}

				if(num != 0){
					var resValid = await Meteor.call("registerValidationForUploadPlayers",data,num)
					try{
						if(resValid==false){
							res = {
								data:xData,
								message:"email or phone " + VALID_SUCCESS_MSG,
								status:SUCCESS_STATUS,
								response:""
							}
						}else{
							res.message = resValid
						}
					}catch(e){
						res.message = e
						return res
					}
				}
				else{
					res.message = EMAIL_PHONE_REQ_MSG
				}
			}
			else{
				res.message = XDATA_NULL_MSG
			}
			//console.log(res)
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})


//ttfi admin can enable its associations, academies, players
//ttfi sa can enable its dassoc, academies, players
//ttfi dass can enable players, acade
//ttfi acad can enable its acade

Meteor.methods({
	"enableUsersValidations":async function(xData){
		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:"enable user "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}

		try{
			//console.log("assocusr 1")
			if(xData){

				var role = ["stateAssociation","districtAssociation","organiser","academy"]
				var dbRoles = ["association","association","organiser","academy"]

				var manageRoles = [{
					"aRole":"stateAssociation",
					"cRoles":["districtAssociation","academy","player"]	
				},{
					"aRole":"districtAssociation",
					"cRoles":["academy","player"]
				},{
					"aRole":"organiser",
					"cRoles":["stateAssociation","districtAssociation","academy","player"]
				},{
					"aRole":"academy",
					"cRoles":["player"]
				}]

				//console.log(JSON.stringify(xData))

				var loggedInDetails = ""
				var sUser =  new MeteorUsers(xData)
				var v = []
				var j = 0
				var dbsOfRole = ["associationDetails","associationDetails","otherUsers","academyDetails"]
				var indexOfRole;

				v[j] = sUser.nullUndefinedEmpty("role")
				if(v[j]=="1"){
				 	if(role){
				 		v[j=j+1] = sUser.checkWithinGivenValues(role,"role")

				 		if(v[j]=="1"){
				 			indexOfRole = _.indexOf(role,xData.role)
				 			v[j=j+1] = sUser.nullUndefinedEmpty("usersRole")
				 			if(v[j]=="1"){
				 				var manageRolesInd = _.findWhere(manageRoles, {aRole:xData.role})
				 				if(manageRolesInd && manageRolesInd.cRoles){
				 					v[j] = sUser.checkWithinGivenValues(manageRolesInd.cRoles,"usersRole")
				 				}
				 				else{
				 					v[j] = INVALID_ROLE_MSG
				 				}
				 			}
				 		}
				 		//console.log(sUser.checkWithinGivenValues(role,"role"))
				 		//console.log("after role cehck")
				 		//console.log("role check,,")
				 		//console.log(v[j])
				 	} 
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

				if(messageErr==undefined||messageErr==null||
					messageErr.trim().length==0){
					var sUser =  new AssocUsers(xData)
					var val = []
					var jval = 0

						val[jval] = sUser.nullUndefinedEmpty("loggedInId")

						if(val[jval]=="1"){
							if(indexOfRole>=0){
								var query = {
									userId:xData.loggedInId,
									source:xData.source,
									role:capitalizeFirstLetter(dbRoles[indexOfRole])
								}
								if(indexOfRole==0){
									query["associationType"] = "State/Province/County"
								}
								else if(indexOfRole==1){
									query["associationType"] = "District/City"
								}

								val[jval] = sUser.checkForValidUsersWithQueruy("loggedInId",dbsOfRole[indexOfRole],xData.source,query)
								if(val[jval]=="1"){
									var query1 = {
										userId:xData.loggedInId,
										source:xData.source,
									}
									var query2 = {
										userId:xData.loggedInId,
										source:xData.source,
									}
									if(indexOfRole==0){
										query2["associationType"] = "State/Province/County"
									}
									else if(indexOfRole==1){
										query2["associationType"] = "District/City"
									}

									var loggedInDet = await Meteor.call("getUserDetailsForgivenDBAndQuery",dbsOfRole[indexOfRole],query1,query2)
									if(loggedInDet && loggedInDet.status==SUCCESS_STATUS && loggedInDet.data1){
										loggedInDetails = loggedInDet.data1
										if(loggedInDetails.interestedProjectName && loggedInDetails.interestedProjectName.length){
										}
										else{
											val[jval] = INVALID_PROJECT_MSG
										}
									}
									else{
										val[jval] = INVALID_LOGIN_MSG
									}
								}
							}
							else{
								val[jval] = INVALID_ROLE_MSG
							}
						}

						val[jval=jval+1] = sUser.nullUndefinedEmpty("enableValue")

						if(val[jval]=="1"){
							val[jval=jval+1] = sUser.checkWithinGivenValues(["Active","InActive"],"enableValue")
						}

						val[jval=jval+1] = sUser.nullUndefined("userIds")

						if(val[jval] == "1"){
							if(typeof xData.userIds != "object"){
								val[jval] = "userIds" + ARRAY_MSG
							}
							else{
								if(xData.userIds.length<=0){
									val[jval] = "userIds" + EMPTY_MSG
								}
							}
						}
						var messageErr2 = ""

						for(var ival=0;ival<val.length;ival++){
							if(val[ival]!="1"){
								anyFailures = true

								if(messageErr2 && messageErr2.replace(/\s+/g,' ').trim().length==0){
									messageErr2 = val[ival]
								}
								else{
									messageErr2 = messageErr2 + " .\n" + val[ival]
								}
							}
						}

						if(messageErr2==undefined||messageErr2==null||
							messageErr2.trim().length==0){
							var messageErr3 = ""
							var validUser = []
							//check for valid userIds based on loggedInrole
							for(var uC=0;uC<xData.userIds.length;uC++){
								//console.log("userIds ..")
								//console.log(xData.userIds[uC])
								sUser["userId"] = xData.userIds[uC]

								validUser[uC] = sUser.nullUndefinedEmpty("userId")

								if(validUser[uC]!="1"){
									//console.log("assocusr 19")
									messageErr3 = messageErr3 + validUser[uC] + " \n"
								}
								else{
									var query1 = {}
									var query2 = {}
									var queryDB = ""

									if(xData.role != "organiser"){
										if(xData.usersRole=="districtAssociation"){
											query1 = {
												userId:xData.userIds[uC],
												associationType:"District/City",
												source:xData.source
											}
											query2 = {
												userId:xData.userIds[uC],
												associationType:"District/City",
												parentAssociationId:loggedInDetails.userId,
												affiliatedTo:"stateAssociation",
												source:xData.source
											}
											queryDB = "associationDetails"
										}
										else if(xData.usersRole=="academy"){
											query1 = {
												userId:xData.userIds[uC],
												source:xData.source
											}
											query2 = {
												userId:xData.userIds[uC],
												source:xData.source
											}
											if(xData.role=="stateAssociation"){
												query2["associationId"] = loggedInDetails.userId
												query2["affiliatedTo"] = "stateAssociation"
											}
											else if(xData.role=="districtAssociation"){
												query2["associationId"] = loggedInDetails.userId
												query2["affiliatedTo"] = "districtAssociation"
											}
											queryDB = "academyDetails"
										}
										else if(xData.usersRole=="player"){
											query1 = {
												userId:xData.userIds[uC],
												source:xData.source
											}
											query2 = {
												userId:xData.userIds[uC],
												source:xData.source
											}
											if(xData.role=="stateAssociation"){
												query2["associationId"] = loggedInDetails.userId
												query2["affiliatedTo"] = "stateAssociation"
											}
											else if(xData.role=="districtAssociation"){
												query2["associationId"] = loggedInDetails.userId
												query2["affiliatedTo"] = "districtAssociation"
											}
											else if(xData.role=="academy"){
												query2["associationId"] = loggedInDetails.userId
												query2["affiliatedTo"] = "academy"
											}

											if(loggedInDetails.interestedProjectName && loggedInDetails.interestedProjectName.length){

											}
											else{
												messageErr3 = messageErr3 + "i" + " \n"
											}
											var toret = playerDBFind(loggedInDetails.interestedProjectName[0])
                							if(toret){
                								queryDB = toret
                							}
                							else{
                								messageErr3 = messageErr3 + " " +INVALID_PROJECT_MSG+ " " + " \n"
                							}
										}
									}
									else if(xData.role == "organiser"){
										//console.log("query is !!")
										//console.log("insiode organiser .. !")
										//console.log(xData.usersRole)
										if(xData.usersRole=="stateAssociation"){
											query1 = {
												userId:xData.userIds[uC],
												associationType:"State/Province/County",
												source:xData.source
											}
											query2 = {
												userId:xData.userIds[uC],
												associationType:"State/Province/County",
												source:xData.source
											}
											queryDB = "associationDetails"
											//console.log("query is !!")
											//console.log(JSON.stringify(query1))
											//console.log(JSON.stringify(query2))
										}
										else if(xData.usersRole=="districtAssociation"){
											query1 = {
												userId:xData.userIds[uC],
												associationType:"District/City",
												source:xData.source
											}
											query2 = {
												userId:xData.userIds[uC],
												associationType:"District/City",
												source:xData.source
											}
											queryDB = "associationDetails"
										}
										else if(xData.usersRole=="academy"){
											query1 = {
												userId:xData.userIds[uC],
												source:xData.source
											}
											query2 = {
												userId:xData.userIds[uC],
												source:xData.source
											}
											queryDB = "academyDetails"
										}
										else if(xData.usersRole=="player"){
											query1 = {
												userId:xData.userIds[uC],
												source:xData.source
											}
											query2 = {
												userId:xData.userIds[uC],
												source:xData.source
											}
											if(loggedInDetails.interestedProjectName && loggedInDetails.interestedProjectName.length){

											}
											else{
												messageErr3 = messageErr3 + "i" + " \n"
											}
											var toret = playerDBFind(loggedInDetails.interestedProjectName[0])
                							if(toret){
                								queryDB = toret
                							}
                							else{
                								messageErr3 = messageErr3 + " " +INVALID_PROJECT_MSG+ " " +" \n"
                							}
										}
									}

									var checkDb = await Meteor.call("getUserDetailsForgivenDBAndQuery",queryDB,query1,query2)
									if(checkDb && checkDb.status==SUCCESS_STATUS){

									}
									else{
										messageErr3 = messageErr3 + " " +INVALID_USERID_MSG+ " " + xData.userIds[uC] + AT_INDEX + uC + " \n"
									}
								}	
							}

							if(messageErr3==undefined||messageErr3==null||
								messageErr3.trim().length==0){
								res.message = VALID_SUCCESS_MSG
								res.status = SUCCESS_STATUS
								res.data = xData
							}
							else{
								res.message = messageErr3
							}

						}
						else{
							res.message = messageErr2
						}

					}
					else{
						res.message = messageErr
					}
			}
			else{
				//console.log("assocusr 25")
				res.message = XDATA_NULL_MSG
			}
			//console.log(JSON.stringify(res))
			return res
		}catch(e){
			//console.log("assocusr 26")
			//console.log(e)
			res.message = e
			return res
		}
	}
})

//remove affiliation of da academy
//logged in id verification
//it should be sa to remove its da or its aca or its pla
//when da is removed (players aca under that da are also removed)
//it should be da to remove its aca or pla
//when aca is removed (palyers under that aca are also remove)
//it should be organizer of ttfi and same source da, aca, pla can be removed

Meteor.methods({
	"removeAffiliatedUsersValidations":async function(xData,distAffil){
		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:"remove affiliated users "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			//console.log("assocusr 1")
			if(xData){
				var stateOrDist = ""
				var distOrAcad = ""
				var dbName = ""
				var districtsAcad = ""
				var affiliatedToVal = ""
				var dbOWN = ""
				if(distAffil==1){
					stateOrDist = "stateAssociationId"
					distOrAcad = "districtId"
					dbName = "associationDetails"
					associationType = "State/Province/County"
					districtsAcad = "districts"
					affiliatedToVal = "stateAssociation"
					dbOWN = "associationDetails"
				}
				else if(distAffil==2){
					stateOrDist = "districtAssociationId"
					distOrAcad = "academyId"
					dbName = "academyDetails"
					associationType = "District/City"
					districtsAcad = "academies"
					affiliatedToVal = "districtAssociation"
					dbOWN = "associationDetails"
				}
				else if(distAffil==3){
					stateOrDist = "stateAssociationId"
					distOrAcad = "academyId"
					dbName = "academyDetails"
					associationType = "State/Province/County"
					districtsAcad = "academies"
					affiliatedToVal = "stateAssociation"
					dbOWN = "associationDetails"
				}

				//console.log("assocusr 12")
				var sUser =  new AssocUsers(xData)
				var v = []
				var j = 0

				v[j] = sUser.nullUndefinedEmpty(stateOrDist)
				if(v[j]=="1"){
					var query1 = {
						userId:xData[stateOrDist],
						source:xData.source
					}
					var query2 = {
						userId:xData[stateOrDist],
						source:xData.source
					}
					var queryDB = dbName

					//console.log("assocusr 13")
					var stateCheck = await Meteor.call("getUserDetailsForgivenDBAndQuery",queryDB,query1,query2)
					if(stateCheck.status==SUCCESS_STATUS){
						//console.log("assocusr 14")
						if(distAffil==2){
							var dist = sUser.checkForAffiliationForQuery(query1,dbOWN,affiliatedToVal,stateOrDist)
							if(dist != "1"){
								res.message = dist
								return res
							}
							else{
								v[j] = "1"
							}
						}
						else{
							v[j] = "1"
						}
					}
					else{
						//console.log("assocusr 15")
						res.message = stateCheck.message
						return res
					}
				}
				else{
					//console.log("assocusr 16")
					res.message = v[j]
					return res
				}

				if(v[j] == "1" && 
					xData[districtsAcad]&&xData[districtsAcad].length){
					//console.log("assocusr 17")
					var message = ""

					for(var ix=0;ix<xData[districtsAcad].length;ix++){
						//console.log("assocusr 18 "+ix +"..ix")
						var v1 = []
						sUser[distOrAcad] = xData[districtsAcad][ix]
						v1[ix] = sUser.nullUndefinedEmpty(distOrAcad)
						if(v1[ix]!="1"){
							//console.log("assocusr 19")
							message = message + v1[ix] + " \n"
						}
						else{
							//console.log("assocusr 20")
							v1[ix] = sUser.checkForValidUsers(distOrAcad,dbName,xData.source,ix)
							if(v1[ix]!="1"){
								//console.log("assocusr 21")
								message = message + v1[ix] + " \n"
							}
							else{
								var query1 = {
									userId:sUser[distOrAcad],
									source:xData.source
								}
								var query2 = {
									userId:sUser[distOrAcad],
									source:xData.source,
									affiliatedTo:affiliatedToVal
								}
								if(distAffil==1){
									query2["parentAssociationId"] = xData[stateOrDist]
								}
								else{
									query2["associationId"] = xData[stateOrDist]
								}
								//console.log("query1 ..")
								//console.log(query1)
								//console.log("query2..")
								//console.log(query2)
								//console.log(dbName)

								var checkDb = await Meteor.call("getUserDetailsForgivenDBAndQuery",dbName,query1,query2)
								//console.log(JSON.stringify(checkDb))
								if(checkDb && checkDb.status==FAIL_STATUS && checkDb.data1 && 
									(checkDb.data2==undefined || checkDb.data2==null)){
									v1[ix] = "User "+ sUser[distOrAcad] + AT_INDEX + ix +" is not affiliatedTo " + xData[stateOrDist]
								}
								else if(checkDb && checkDb.status==FAIL_STATUS && 
									(checkDb.data1==undefined || checkDb.data1==null)){
									v1[ix] = "User "+ sUser[distOrAcad] + IS_INVALID_MSG+AT_INDEX+ix 
								}
								else if(checkDb && checkDb.status==SUCCESS_STATUS){
									v1[ix] = "1"
								}
								if(v1[ix]!="1"){
									message = message + v1[ix] + " \n"
								}
							}
						}
					}

					if(message && message.length){
						//console.log("assocusr 22")
						res.message = message
					}
					else{
						//console.log("assocusr 23")
						res.status = SUCCESS_STATUS
						res.message = VALID_SUCCESS_MSG + " ,can remove affiliation for given ids"
					}
				}
				else if(v[j]=="1"){
					//console.log("assocusr 24")
					res.message = SELECT_MSG+districtsAcad
				}
			}
			else{
				//console.log("assocusr 25")
				res.message = XDATA_NULL_MSG
			}
			return res
		}catch(e){
			//console.log("assocusr 26")
			//console.log(e)
			res.message = e
			return res
		}
	}
})

//validation for update users
Meteor.methods({
	"apiUpdateUsersValidation":async function(xData,updateType){
		var res = {
			data:0,
			message:"Update users "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			var dbName = ""
			var query = {}
			if(xData){
				if(xData.emailIdOrPhone==undefined ||
					xData.emailIdOrPhone == null ||
					isNaN(xData.emailIdOrPhone)){
					xData.emailIdOrPhone = 3
				}

				var sUser =  new AssocUsers(xData)

				//console.log("SUSER is ")
				//console.log(JSON.stringify(sUser))
				var v = []
				var j = 0


				v[j] = sUser.nullUndefinedEmpty("userId")

				if(v[j]=="1"){
					var assAcadName = ""
					
					if(updateType == 1){
						dbName = "associationDetails"
						query = {
							"userId":xData.userId,
							"associationType":"State/Province/County",
							"source":xData.source
						}
						assAcadName = "associationName"
					}
					else if(updateType==2){
						dbName = "associationDetails"
						query = {
							"userId":xData.userId,
							"associationType":"District/City",
							"source":xData.source
						}
						assAcadName = "associationName"
					}
					else if(updateType==3){
						dbName = "academyDetails"
						query = {
							"userId":xData.userId,
							"source":xData.source
						}
						assAcadName = "clubName"
					}

					v[j] = sUser.checkForValidUsersWithQueruy("userId",dbName,xData.source,query)

					v[j=j+1] = sUser.nullUndefinedEmpty(assAcadName)
					v[j=j+1] = sUser.nullUndefinedEmpty("userName")
				}
				

				//console.log("length is !! ifbv")
				//console.log(v)
				//console.log(v.length)
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
				
				if(messageErr==undefined||messageErr==null||
					messageErr.trim().length==0){
					var dataDEt = await Meteor.call("getUserDetailsForgivenDBAndQuery",dbName,query,query)
					if(dataDEt && dataDEt.data1 && dataDEt.data2){
						res = {
							data1:dataDEt.data1,
							data2:dataDEt.data2,
							message:"Update users "+VALID_SUCCESS_MSG,
							status:SUCCESS_STATUS,
							response:""
						}
					}
					else {
						res.message = dbName + IS_INVALID_MSG
					}
				}
				else{
					res.message = messageErr
				}
			}
			else{
				res.message = XDATA_NULL_MSG
			}
			//console.log("res from 1")
			//console.log(res)
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"affiliateValidatinonsAssocsUnderSa":async function(xData,distAffil,goFurther){
		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:"affiliate "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			//console.log("assocusr 1")
			if(xData){
				var stateOrDist = ""
				var distOrAcad = ""
				var dbName = ""
				var districtsAcad = ""
				var query1 = {}
				var query2 = {}
				var dbOWN = ""

				//dist to state
				if(distAffil==1){
					stateOrDist = "stateAssociationId"
					distOrAcad = "districtId"
					dbName = "associationDetails"
					associationType = "State/Province/County"
					districtsAcad = "districts"
					affiliatedToVal = "other"
					dbOWN = "associationDetails"
				}
				//acad to dist
				else if(distAffil==2){
					stateOrDist = "districtAssociationId"
					distOrAcad = "academyId"
					dbName = "academyDetails"
					associationType = "District/City"
					districtsAcad = "academies"
					affiliatedToVal = "stateAssociation"
					dbOWN = "associationDetails"
				}
				//acad to state
				else if(distAffil==3){
					stateOrDist = "stateAssociationId"
					distOrAcad = "academyId"
					dbName = "academyDetails"
					associationType = "State/Province/County"
					districtsAcad = "academies"
					affiliatedToVal = "stateAssociation"
					dbOWN = "associationDetails"
				}

				//player to state
				if(distAffil==4){
					stateOrDist = "stateAssociationId"
					distOrAcad = "playerId"
					dbName = ""
					associationType = "State/Province/County"
					districtsAcad = "players"
					dbOWN = "associationDetails"
					affiliatedToVal = "other"
				}
				//player to dist
				else if(distAffil==5){
					stateOrDist = "districtAssociationId"
					distOrAcad = "playerId"
					dbName = ""
					associationType = "District/City"
					districtsAcad = "players"
					dbOWN = "associationDetails"
					affiliatedToVal = "stateAssociation"
				}
				//player to acad of state
				else if(distAffil==6){
					stateOrDist = "academyId"
					distOrAcad = "playerId"
					dbName = ""
					associationType = ""
					districtsAcad = "players"
					dbOWN = "academyDetails"
					affiliatedToVal = "stateAssociation"
				}
				//play to acad of dist
				else if(distAffil==7){
					stateOrDist = "academyId"
					distOrAcad = "playerId"
					dbName = ""
					associationType = ""
					districtsAcad = "players"
					dbOWN = "academyDetails"
					affiliatedToVal = "districtAssociation"
				}

				//console.log("assocusr 12")
				var sUser =  new AssocUsers(xData)
				var v = []
				var j = 0

				v[j] = sUser.nullUndefinedEmpty(stateOrDist)
				if(v[j]=="1"){
					//console.log("assocusr 13")

					query1 = {
						userId:xData[stateOrDist],
						source:xData.source,
					}


					var stateCheck = await Meteor.call("getUserDetailsForgivenDBAndQuery",dbOWN,query1,query1)
					if(stateCheck && stateCheck.status==SUCCESS_STATUS && stateCheck.data1 && stateCheck.data2){
						//console.log("assocusr 14")


						stateCheck.data2[stateOrDist] = xData[stateOrDist]

						var sUser =  new AssocUsers(stateCheck.data2)
						//console.log("after data2 is assoc user")
						//console.log(JSON.stringify(sUser))
						//console.log(dbOWN)
						v[j] = sUser.nullUndefined("interestedProjectName")
						if(v[j]=="1"){
						 	v[j=j+1] = sUser.checkinterestedProjectName()
						 	if(v[j]=="1"&&distAffil>3){
						 		dbName = playerDBFind(sUser["interestedProjectName"][0])
						 	}
						}

						v[j=j+1] = sUser.nullUndefined("interestedDomainName")
						if(v[j]=="1"){
							v[j=j+1] = sUser.checkinterestedDomaiName()
						}
						if(distAffil==1||distAffil==3||distAffil==4||distAffil==5){
							query1["associationType"] = associationType
						}
						v[j=j+1] = sUser.checkForAffiliationForQuery(query1,dbOWN,affiliatedToVal,stateOrDist)

					}
					else{
						//console.log("assocusr 15")
						res.message = stateCheck.message
						return res
					}
				}
				else{
					//console.log("assocusr 16")
					res.message = v[j]
					return res
				}

				var messageErr = ""
				for(var i=0;i<v.length;i++){
					if(v[i]!="1"){
						if(messageErr && messageErr.replace(/\s+/g,' ').trim().length==0){
							messageErr = v[i]
						}
						else{
							messageErr = messageErr + " .\n" + v[i]
						}
					}
				}

				if(messageErr==undefined || messageErr==null || messageErr.length==0){
					if(xData[districtsAcad]&&xData[districtsAcad].length&&goFurther){
						var message = ""

						for(var ix=0;ix<xData[districtsAcad].length;ix++){
							//console.log("assocusr 18 "+ix +"..ix")
							var v1 = []
							sUser[distOrAcad] = xData[districtsAcad][ix]
							v1[ix] = sUser.nullUndefinedEmpty(distOrAcad)
							if(v1[ix]!="1"){
								//console.log("assocusr 19")
								message = message + v1[ix] + " \n"
							}
							else{
								//console.log("assocusr 20")
								v1[ix] = sUser.checkForValidUsers(distOrAcad,dbName,xData.source,ix)
								if(v1[ix]!="1"){
									//console.log("assocusr 21")
									message = message + v1[ix] + " \n"
								}
								else{
									var query = {
										userId:sUser[distOrAcad],
										source:xData.source
									}

									
									if(dbName){
										v1[ix] = sUser.checkForAffiliatedUser(distOrAcad,dbName,query,ix)
										if(v1[ix]!="1"){
											message = message + v1[ix] + " \n"
										}
									}
									else{
										message = message + "db "+IS_INVALID_MSG+ " \n"
									}
								}
							}
						}

						if(message && message.length){
							//console.log("assocusr 22")
							res.message = message
						}
						else{
							//console.log("assocusr 23")
							res.status = SUCCESS_STATUS
							res.message = VALID_SUCCESS_MSG + " ,can affiliate given ids"
						}
					}
					else if(goFurther){
						res.message = SELECT_MSG+districtsAcad
					}
					else if(goFurther==false){
						res.status = SUCCESS_STATUS
						res.message = VALID_SUCCESS_MSG + " ,can register further"
					}
				}
				else {
					res.message = messageErr
				}
				/*if(v[j] == "1" && 
					xData[districtsAcad]&&xData[districtsAcad].length&&goFurther){
					//console.log("assocusr 17")
					var message = ""

					for(var ix=0;ix<xData[districtsAcad].length;ix++){
						//console.log("assocusr 18 "+ix +"..ix")
						var v1 = []
						sUser[distOrAcad] = xData[districtsAcad][ix]
						v1[ix] = sUser.nullUndefinedEmpty(distOrAcad)
						if(v1[ix]!="1"){
							//console.log("assocusr 19")
							message = message + v1[ix] + " \n"
						}
						else{
							//console.log("assocusr 20")
							v1[ix] = sUser.checkForValidUsers(distOrAcad,dbName,xData.source,ix)
							if(v1[ix]!="1"){
								//console.log("assocusr 21")
								message = message + v1[ix] + " \n"
							}
							else{
								var query = {
									userId:sUser[distOrAcad],
									source:xData.source
								}

								if(distAffil==1){
									query["associationType"] = "District/City"
								}

								v1[ix] = sUser.checkForAffiliatedUser(distOrAcad,dbName,query,ix)
								if(v1[ix]!="1"){
									message = message + v1[ix] + " \n"
								}
							}
						}
					}

					if(message && message.length){
						//console.log("assocusr 22")
						res.message = message
					}
					else{
						//console.log("assocusr 23")
						res.status = SUCCESS_STATUS
						res.message = VALID_SUCCESS_MSG + " ,can affiliate given ids"
					}
				}
				else if(v[j]=="1"&&goFurther){
					//console.log("assocusr 24")
					res.message = SELECT_MSG+districtsAcad
				}
				else if(v[j]=="1"&&goFurther==false){
					//console.log("assocusr 23")
					res.status = SUCCESS_STATUS
					res.message = VALID_SUCCESS_MSG + " ,can register further"
				}*/
			}
			else{
				//console.log("assocusr 25")
				res.message = XDATA_NULL_MSG
			}
			return res
		}catch(e){
			//console.log("assocusr 26")
			//console.log(e)
			res.message = e
			return res
		}
	}
})

//affiliation id null or undefined
//affiliation id repeat
//affiliation id format
//state assoc id check
//dist assoc id check
//academy id check
Meteor.methods({
	"affiliateValidatinonsForPlayers":async function(xData){
		//console.log("affiliateValidatinonsForPlayers .........")

		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:"affiliate "+VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				//console.log(JSON.stringify(xData))

				var sUser =  new AssocUsers(xData)
				//console.log("other users..")
				//console.log(sUser)
				var v = []
				var j = 0
				v[j] = sUser.nullUndefined("affiliationId")
				var typeAff = "stateAssociation"

				if(xData.affilaitionType){
					typeAff = xData.affilaitionType
				}

				if(v[j]=="1"){
					v[j=j+1] = sUser.nullUndefinedEmpty("affiliationId")
					if(v[j]=="1"){
						v[j=j+1] = sUser.checkForAffiliationIdValid()
					}
				}

				var dbOWN = ""
				var query1 = {}
				var typeId  = ""

				if(xData.affilaitionType=="stateAssociation"){
					dbOWN = "associationDetails"
					typeId = "stateAssociationId"
					v[j=j+1] = sUser.nullUndefinedEmpty(typeId)
					//console.log("stateAssociation os iii")
					//console.log(v[j])

					if(v[j]=="1"){
						query1 = {
							userId:xData[typeId],
							source:xData.source
						}
					}
				}
				else if(xData.affilaitionType=="districtAssociation"){
					dbOWN = "associationDetails"
					typeId = "districtAssociationId"
					v[j=j+1] = sUser.nullUndefinedEmpty(typeId)

					if(v[j]=="1"){
						query1 = {
							userId:xData[typeId],
							source:xData.source,
							affiliatedTo:"stateAssociation"
						}
					}
				}
				else if(xData.affilaitionType=="academy"){
					dbOWN = "academyDetails"
					typeId = "academyId"
					v[j=j+1] = sUser.nullUndefinedEmpty(typeId)

					if(v[j]=="1"){
						query1 = {
							userId:xData[typeId],
							source:xData.source,
							$or:[
								{affiliatedTo:"stateAssociation"},
								{affiliatedTo:"districtAssociation"}
							]
						}
					}

				}

				var messageErr = ""
				for(var i=0;i<v.length;i++){
					if(v[i]!="1"){
						if(messageErr && messageErr.replace(/\s+/g,' ').trim().length==0){
							messageErr = v[i]
						}
						else{
							messageErr = messageErr + " .\n" + v[i]
						}
					}
				}

				if(messageErr==undefined || messageErr==null || messageErr.length==0){
					var stateCheck = await Meteor.call("getUserDetailsForgivenDBAndQuery",dbOWN,query1,query1)
					if(stateCheck && stateCheck.status==SUCCESS_STATUS && stateCheck.data1 && stateCheck.data2){
						var affilRepeat = await Meteor.call("affiliationIdRepeat",xData.affiliationId,xData[typeId])
						if(affilRepeat==false){
							res.status = SUCCESS_STATUS
							res.message = VALID_SUCCESS_MSG + " ,can affiliate given player"
						}
						else{
							res.message = xData.affiliationId +" "+ affilRepeat
						}
					}
					else{
						//console.log("assocusr 15")
						res.message = stateCheck.message
					}
				}
				else{
					res.message = messageErr
				}
			}
			else{
				//console.log("assocusr 25")
				res.message = XDATA_NULL_MSG
			}
			return res
		}catch(e){
			//console.log("assocusr 26")
			//console.log(e)
			res.message = e
			return res
		}
	}
})