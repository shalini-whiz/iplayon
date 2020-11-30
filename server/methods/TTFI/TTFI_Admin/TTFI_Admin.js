
//validation for email phone role password userId
Meteor.methods({
	"validationForEmailPhoneRole":async function(xData){
		var res = {
			data:0,
			message:VALID_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		try{
			if(xData){
				var sUser =  new MeteorUsers(xData)
				var v = []
				var j = 0

				if(_.contains(xData.validationType,"role")){
					v[j] = sUser.nullUndefinedEmpty("role")
					if(v[j]=="1"){
						v[j=j+1] = sUser.roleValidation()
					}
				}
				

				if(_.contains(xData.validationType,"emailIdOrPhone")){
					v[j=j+1] = sUser.nullUndefined("emailIdOrPhone")
					if(v[j]=="1"){
						sUser.emailIdOrPhone = parseInt(sUser.emailIdOrPhone)

					 	v[j=j+1] = sUser.checkWithinGivenValues([1,2],"emailIdOrPhone")
					 	if(v[j]=="1" && _.contains(xData.validationType,"emailOrPhoneValue")){
					 		if(xData.emailIdOrPhone == 1){
					 			v[j=j+1] = sUser.nullUndefinedEmpty("emailOrPhoneValue")
					 			if(v[j]=="1"){
					 				v[j=j+1] = sUser.validateEmail("emailOrPhoneValue")
					 			}
					 		}
					 		else if(xData.emailIdOrPhone == 2){
					 			v[j=j+1] = sUser.nullUndefinedEmpty("emailOrPhoneValue")
					 			if(v[j]=="1"){
					 				v[j=j+1] = sUser.validateMobileNum10("emailOrPhoneValue")
					 			}
					 		}
					 	}
					}
				}

				if(_.contains(xData.validationType,"password")){
					v[j=j+1] = sUser.nullUndefinedEmpty("password")
					if(v[j]=="1"){
						 v[j=j+1] = sUser.validateCharLenWithGivenMin(6,"password")
					}
				}

				if(_.contains(xData.validationType,"userId")){
					v[j=j+1] = sUser.nullUndefinedEmpty("userId")
				}

				var messageErr = ""
				for(var i=0;i<v.length;i++){
					if(v[i]!=undefined && v[i]!=null && v[i]!="1"){
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
						message:VALID_SUCCESS_MSG,
						status:SUCCESS_STATUS,
						response:""
					}
				}
				else if(messageErr==undefined||messageErr==null||
					messageErr.trim().length==0){
					res = {
						data:xData,
						message:VALID_SUCCESS_MSG,
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
			return res
		}
		catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

//registerTTFIAdminAPI
Meteor.methods({
	"registerTTFIAdminAPI":async function(xData){
		//console.log(typeof xData)
		//console.log(xData)
		if(typeof xData == "string"){
			data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:REGISTER_FAIL_MSG + "Organiser",
			status:FAIL_STATUS,
			response:""
		}

		try{
			//call for validation of email address or phone
			xData.validationType = ["emailIdOrPhone"]
			var resBefore = await Meteor.call("validationForEmailPhoneRole",xData)

			if(resBefore && resBefore.status == SUCCESS_STATUS){
				var resValidation = await Meteor.call("validatePhoneNumbEmail",xData)

				if(resValidation && resValidation.status == SUCCESS_STATUS){
					var emailIdOrPhoneFromParam = xData.emailIdOrPhone

					xData.emailIdOrPhone = 3
					var resValidation1 = await Meteor.call("apiMeteorUsersValidation",xData,"organiser")
					xData.emailIdOrPhone = 0
					var resValidation2 = await Meteor.call("apiGeneralFieldsUsersValidation",xData)
					var resValidation3 = await Meteor.call("apiDateFieldsUsersValidation",xData,"dateOfBirth",true)
					var resValidation4 = await Meteor.call("apiGenderFieldsUsersValidation",xData)

					var errMsg = ""

					//console.log("before saving data 1")
					//console.log(JSON.stringify(resValidation1))
					//console.log(JSON.stringify(resValidation2))

					if(resValidation1 && resValidation1.status == FAIL_STATUS){
						errMsg = resValidation1.message
					}
					if(resValidation2 && resValidation2.status == FAIL_STATUS){
						errMsg = errMsg + resValidation2.message
					}
					if(resValidation3 && resValidation3.status == FAIL_STATUS){
						errMsg = errMsg + resValidation3.message
					}
					if(resValidation4 && resValidation4.status == FAIL_STATUS){
						errMsg = errMsg + resValidation4.message
					}

					else{
						//console.log("before saving data")
						//console.log(JSON.stringify(resValidation1))
						//console.log(JSON.stringify(resValidation2))

						if(resValidation2 && resValidation2.status == SUCCESS_STATUS
							&& resValidation1 && resValidation1.status == SUCCESS_STATUS &&
							resValidation3 && resValidation3.status == SUCCESS_STATUS
							&& resValidation4 && resValidation4.status == SUCCESS_STATUS){
							xData.emailIdOrPhone = parseInt(emailIdOrPhoneFromParam)
							return (Meteor.call("saveTTFIORganizerDetails",xData))
						}
					}
					
					if(errMsg.trim().length){
						resValidation.status = FAIL_STATUS
						resValidation.data = 0
						resValidation.message = errMsg
						return resValidation
					}
				}
				else{
					return resValidation
				}
			}
			else{
				return resBefore
			}
		}catch(e){
			res.message = e
			return res
		}
	}
})

//to use
Meteor.methods({
	"registerTTFIStateDistAssocAPI":async function(xData,stateDist){
		//console.log(typeof xData)
		//console.log(xData)
		if(typeof xData == "string"){
			data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:REGISTER_FAIL_MSG + "Association",
			status:FAIL_STATUS,
			response:""
		}

		try{
			//call for validation of email address or phone
			xData.validationType = ["emailIdOrPhone"]
			var resBefore = await Meteor.call("validationForEmailPhoneRole",xData)
			if(resBefore && resBefore.status == SUCCESS_STATUS){
				var resValidation = await Meteor.call("validatePhoneNumbEmail",xData)

				if(resValidation && resValidation.status == SUCCESS_STATUS){
					var emailIdOrPhoneFromParam = xData.emailIdOrPhone

					xData.emailIdOrPhone = 3
					var resValidation1 = await Meteor.call("apiMeteorUsersValidation",xData,"association")
					xData.emailIdOrPhone = 0
					var resValidation2 = await Meteor.call("apiGeneralFieldsUsersValidation",xData)
					var resValidation3 = await Meteor.call("apiAssocFieldsUsersValidation",xData,stateDist)
					
					var resValidation4 = {
						status:SUCCESS_STATUS
					};

					if(xData.dateOfInc){
						resValidation4 = await Meteor.call("apiDateFieldsUsersValidation",xData,"dateOfInc",false)
					}
					var errMsg = ""

					//console.log("before saving data 1")
					//console.log(JSON.stringify(resValidation1))
					//console.log(JSON.stringify(resValidation2))

					if(resValidation1 && resValidation1.status == FAIL_STATUS){
						errMsg = resValidation1.message
					}
					if(resValidation2 && resValidation2.status == FAIL_STATUS){
						errMsg = errMsg + resValidation2.message
					}
					if(resValidation3 && resValidation3.status == FAIL_STATUS){
						//console.log("resValidation3 ..!")
						errMsg = errMsg + resValidation3.message
					}
					if(resValidation4 && resValidation4.status == FAIL_STATUS){
						errMsg = errMsg + resValidation4.message
					}

					else{
						//console.log("before saving data")
						//console.log(JSON.stringify(resValidation1))
						//console.log(JSON.stringify(resValidation2))
						//console.log(JSON.stringify(resValidation3))

						if(resValidation2 && resValidation2.status == SUCCESS_STATUS
							&& resValidation1 && resValidation1.status == SUCCESS_STATUS &&
							resValidation3  && resValidation3.status == SUCCESS_STATUS
							 &&resValidation4  && resValidation4.status == SUCCESS_STATUS){

							xData.contactPerson = xData.userName
							//console.log("inside ,,!")
							xData.emailIdOrPhone =  parseInt(emailIdOrPhoneFromParam)

							var saveReg = Meteor.call("registerAssociation",xData,true)
							if(saveReg){
								return saveReg
							}
							else{
								return res
							}
						}

					}
					
					if(errMsg.trim().length){
						resValidation.status = FAIL_STATUS
						resValidation.data = 0
						resValidation.message = errMsg
						return resValidation
					}

				}
				else{
					return resValidation
				}
			}else{
				return resBefore
			}
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"registerTTFIAcademyAPI":async function(xData,giveDbDetails){
		//console.log(typeof xData)
		//console.log(xData)

		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:REGISTER_FAIL_MSG+"academy",
			status:FAIL_STATUS,
			response:""
		}

		try{
			//call for validation of email address or phone
			xData.validationType = ["emailIdOrPhone"]
			var resBefore = await Meteor.call("validationForEmailPhoneRole",xData)

			if(resBefore && resBefore.status == SUCCESS_STATUS){
				var resValidation = await Meteor.call("validatePhoneNumbEmail",xData)

				if(resValidation && resValidation.status == SUCCESS_STATUS){
					var emailIdOrPhoneFromParam = xData.emailIdOrPhone


					xData.emailIdOrPhone = 3
					var resValidation1 = await Meteor.call("apiMeteorUsersValidation",xData,"academy")
					xData.emailIdOrPhone = 0
					var resValidation2 = await Meteor.call("apiGeneralFieldsUsersValidation",xData)
					var resValidation3 = await Meteor.call("apiAssocFieldsUsersValidation",xData,false)
					
					var resValidation4 = {
						status:SUCCESS_STATUS
					};

					if(xData.dateOfInc){
						//console.log("::dateOfInc")
						resValidation4 = await Meteor.call("apiDateFieldsUsersValidation",xData,"dateOfInc",true)
						//console.log(JSON.stringify(resValidation4))
					}
					var errMsg = ""

					//console.log("before saving data 1")
					//console.log(JSON.stringify(resValidation1))
					//console.log(JSON.stringify(resValidation2))

					if(resValidation1 && resValidation1.status == FAIL_STATUS){
						errMsg = resValidation1.message
					}
					if(resValidation2 && resValidation2.status == FAIL_STATUS){
						errMsg = errMsg + resValidation2.message
					}
					if(resValidation3 && resValidation3.status == FAIL_STATUS){
						//console.log("resValidation3 ..!")
						errMsg = errMsg + resValidation3.message
					}
					if(resValidation4 && resValidation4.status == FAIL_STATUS){
						errMsg = errMsg + resValidation4.message
					}

					else{
						//console.log("before saving data")
						//console.log(JSON.stringify(resValidation1))
						//console.log(JSON.stringify(resValidation2))
						//console.log(JSON.stringify(resValidation3))

						if(resValidation2 && resValidation2.status == SUCCESS_STATUS
							&& resValidation1 && resValidation1.status == SUCCESS_STATUS &&
							resValidation3  && resValidation3.status == SUCCESS_STATUS
							 &&resValidation4  && resValidation4.status == SUCCESS_STATUS){
							xData.contactPerson = xData.userName
							//console.log("inside ,,!")

							xData.emailIdOrPhone =  parseInt(emailIdOrPhoneFromParam)
							var saveReg = Meteor.call("registerAcademy",xData,giveDbDetails)
							if(saveReg){
								resValidation.status = SUCCESS_STATUS
								resValidation.data = saveReg
								resValidation.message = SUCCESS_STATUS
								return resValidation
							}
							else{
								return res
							}
						}

					}
					
					if(errMsg.trim().length){
						resValidation.status = FAIL_STATUS
						resValidation.data = 0
						resValidation.message = errMsg
						return resValidation
					}

				}
				else{
					return resValidation
				}
			}else{
				return resBefore
			}
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

//this
Meteor.methods({
	"affiliateDAOrAcademyAPI":async function(xData,distAffil){
		//console.log("affiliateDAOrAcademyAPI..!")
		//console.log(typeof xData)
		//console.log(xData)

		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:CANNOT_AFFIL_MSG,
			status:FAIL_STATUS,
			response:""
		}

		try{
			//call for validation of email address or phone
			xData.validationType = ["emailIdOrPhone"]
			var resBefore = await Meteor.call("affiliateValidatinonsAssocsUnderSa",xData,distAffil,true)
			//console.log("resBefore .. !")
			//console.log(JSON.stringify(resBefore))

			if(resBefore && resBefore.status == SUCCESS_STATUS&&(distAffil==2||distAffil==3)){
				//console.log("resBefore .. 1")
				if(distAffil==3){
					//console.log("resBefore .. 2")
					if(xData.stateAssociationId){
						//console.log("resBefore .. 3")
						xData.loggedId = xData.stateAssociationId
						xData.userId = xData.academies
					}
					
				}
				else if(distAffil==2){
					//console.log("resBefore ..5")
					if(xData.districtAssociationId){
						//console.log("resBefore .. 6")
						xData.loggedId = xData.districtAssociationId
						xData.userId = xData.academies
					}
				}
				//console.log("resBefore .. 4")
				var resAffil = await Meteor.call("affiliateAcademiesBYSADA",xData,true)

				if(resAffil && resAffil.status==SUCCESS_STATUS){
					return resAffil
				}
				else{
					return res
				}
			}
			else if(resBefore && resBefore.status == SUCCESS_STATUS&&distAffil==1){
				if(xData.stateAssociationId){
					xData.loggedId = xData.stateAssociationId
					xData.userId = xData.districts
				}
				var resAffil = await Meteor.call("affiliateDABYSA",xData,true)
				if(resAffil && resAffil.status==SUCCESS_STATUS){
					return resAffil
				}
				else{
					return res
				}
			}
			else if(resBefore && resBefore.status == SUCCESS_STATUS
				&&(distAffil==4||distAffil==5||distAffil==6||distAffil==7)){
				//console.log("resBefore .. 1")
				if(distAffil==4){
					//console.log("resBefore .. 2")
					if(xData.stateAssociationId){
						//console.log("resBefore .. 3")
						xData.loggedId = xData.stateAssociationId
						xData.userId = xData.players
					}
					
				}
				else if(distAffil==5){
					//console.log("resBefore ..5")
					if(xData.districtAssociationId){
						//console.log("resBefore .. 6")
						xData.loggedId = xData.districtAssociationId
						xData.userId = xData.players
					}
				}
				else if(distAffil==6||distAffil==7){
					//console.log("resBefore ..5")
					if(xData.academyId){
						//console.log("resBefore .. 6")
						xData.loggedId = xData.academyId
						xData.userId = xData.players
					}
				}
				//console.log("resBefore .. 4")
				var resAffil = await Meteor.call("affiliatePlayersBYACADASSOC",xData,true)
				//console.log(resAffil)
				if(resAffil && resAffil.status==SUCCESS_STATUS){
					return resAffil
				}
				else{
					return res
				}
			}
			else{
				return resBefore
			}
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"enableUsersAPI":async function(xData){
		//console.log("enableUsers..!")
		//console.log(typeof xData)
		//console.log(xData)

		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:"cannot enable user",
			status:FAIL_STATUS,
			response:""
		}

		try{
			var resValidation = await Meteor.call("enableUsersValidations",xData)
			if(resValidation && resValidation.status==SUCCESS_STATUS){
				var enaUsers = await Meteor.call("enableDisableUsers",xData)
				if(enaUsers){
					return enaUsers
				}
				else{
					return res
				}
			}
			else{
				return resValidation
			}

		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"enableDisableUsers":async function(xData){
		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:ENABLE_DISABLE_MSG,
			status:VALID_FAIL_MSG,
			response:""
		}
		try{
			var s = Meteor.users.update({
				userId:{$in:xData.userIds}
			},{
				$set:{
					userStatus:xData.enableValue
				}
			})
			if(s){
				var datatosend = Meteor.users.find({
					userId:{
						$in:xData.userIds
					}
				}).fetch()
				if(datatosend && datatosend.length){
					res.status = SUCCESS_STATUS
					res.data = datatosend
					res.message = USER_STATUS_MSG+ xData.enableValue
				}
				else{
					res.message = INVALID_USER_MSG
				}
			}
			else{
				res.message = ENABLE_DISABLE_MSG
			}
			return res
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"removeAffiliatedUsers":async function(xData,distAffil){
		//console.log("affiliateDAOrAcademyAPI..!")
		//console.log(typeof xData)
		//console.log(xData)

		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:REMOVE_AFFIL_MSG,
			status:FAIL_STATUS,
			response:""
		}

		try{
			var resBefore = await Meteor.call("removeAffiliatedUsersValidations",xData,distAffil)
			//console.log("resBefore .. !")
			//console.log(JSON.stringify(resBefore))

			if(resBefore && resBefore.status == SUCCESS_STATUS&&(distAffil==2||distAffil==3)){
				//console.log("resBefore .. 1")
				if(xData.stateAssociationId && distAffil==3){
					xData.loggedId = xData.stateAssociationId
					xData.userId = xData.academies
				}
				else if(xData.districtAssociationId && distAffil==2){
					xData.loggedId = xData.districtAssociationId
					xData.userId = xData.academies
				}
				
				var resAffil = await Meteor.call("updateAcademiesRemoveAffiliation",xData,true)
				if(resAffil && resAffil.status==SUCCESS_STATUS){
					return resAffil
				}
				else{
					return res
				}
			}
			else if(resBefore && resBefore.status == SUCCESS_STATUS&&distAffil==1){
				if(xData.stateAssociationId){
					xData.loggedId = xData.stateAssociationId
					xData.userId = xData.districts
				}
				var resAffil = await Meteor.call("updateDARemoveAffiliation",xData,true)
				if(resAffil && resAffil.status==SUCCESS_STATUS){
					return resAffil
				}
				else{
					return res
				}
			}
			else{
				return resBefore
			}
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})


Meteor.methods({
	"updateProfileOfSAAPI":async function(xData,updateType){
		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:UPDATE_PROFILE_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}

		try{
			
			var resValidation1 = await Meteor.call("apiUpdateUsersValidation",xData,updateType)
			var resValidation2 = ""

			if(resValidation1 && resValidation1.status == SUCCESS_STATUS){
				if(xData.dateOfInc){
					resValidation2 = await Meteor.call("apiDateFieldsUsersValidation",xData,"dateOfInc",true)
				}
				//console.log("resValidation1 .. ! udfgh")
				//console.log(resValidation1)

				if(resValidation1.data2.country && resValidation1.data2.state){
					//console.log("resValidation1 .. ! udfgh 333")
					xData.country = resValidation1.data2.country
					xData.state = resValidation1.data2.state
				}

				xData.emailIdOrPhone = 3
				var resValidation3 = await Meteor.call("apiGeneralFieldsUsersValidation",xData)
				var errMsg = ""
				if(resValidation2 && resValidation2.status == FAIL_STATUS){
					errMsg = resValidation2.message
				}
				if(resValidation3 && resValidation3.status == FAIL_STATUS){
					errMsg = errMsg + resValidation3.message
				}

				if(errMsg && errMsg.length){
					res.message = errMsg
				}

				else{
					if(updateType==1||updateType==2){
						var updateForDA = await Meteor.call("updateDistrictAssociation",xData,true)
						if(updateForDA && updateForDA.status == SUCCESS_STATUS){
							res = updateForDA
						}
						else{
							res.message = UPDATE_PROFILE_FAIL_MSG
						}
					}
					else if(updateType==3){
						var updateForDA = await Meteor.call("updateAcademy",xData,true)
						if(updateForDA && updateForDA.status == SUCCESS_STATUS){
							res = updateForDA
						}
						else{
							res.message = UPDATE_PROFILE_FAIL_MSG
						}
					}
						
				}

				

				return res
			}
			else{
				return resValidation1
			}
						
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"updatePhoneOrEmailAddress":async function(xData,giveDbDetails){
		//console.log(typeof xData)
		//console.log(xData)

		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:UPDATE_PHONE_EMAIL_FAIL_MSG,
			status:FAIL_STATUS,
			response:""
		}
		var mess = ""
		var query1 = {}

		try{
			//call for validation of email address or phone
			xData.validationType = ["emailIdOrPhone","emailOrPhoneValue","userId"]
			var resBefore = await Meteor.call("validationForEmailPhoneRole",xData)

			if(resBefore && resBefore.status == SUCCESS_STATUS){
				if(parseInt(xData.emailIdOrPhone)==1){
					xData.emailAddress = xData.emailOrPhoneValue
					xData.mailId = xData.emailOrPhoneValue
					mess = "emailAddress"
					query1["userId"] = xData.userId
					query1["source"] = xData.source
				}
				else if(parseInt(xData.emailIdOrPhone)==2){
					xData.phoneNumber = xData.emailOrPhoneValue
					xData.mailId = xData.emailOrPhoneValue
					mess = "phoneNumber"
					query1["userId"] = xData.userId
					query1["source"] = xData.source
				}

				
				var getUserDet = await Meteor.call("getUserDetailsForgivenDBAndQuery","",query1,query1)
				if(getUserDet && getUserDet.data1 && getUserDet.data2 && getUserDet.status == SUCCESS_STATUS){

					var resValidation = await Meteor.call("adminUpdateValidationForUploadPlayers",xData,xData.emailIdOrPhone)

					if(resValidation==false){
						//console.log("before saving data")

						var resValidation2 = await Meteor.call("updateVerifiedMailPhone",xData,true)
						if(resValidation2 && resValidation2.status == SUCCESS_STATUS){
							res = resValidation2
						}
						else{
							res.message = "Cannot update " + mess + " for given "+userId
						}
					}
					else{
						res.message = resValidation
					}
					

					return res

				}
				else{
					res.message = INVALID_USERID_MSG
					return res
				}
			}else{
				return resBefore
			}
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"registerAndAffiliateDistAcad":async function(xData,distAffil){
		//console.log("affiliateDAOrAcademyAPI..!")
		//console.log(typeof xData)
		//console.log(xData)

		if(typeof xData == "string"){
			var data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}

		var message = ""
		if(distAffil==1){
			message = "district association"
		}
		else if(distAffil==2||distAffil==3){
			message = "academy"
		}

		var res = {
			data:0,
			message:REG_AFFILIATE_FAIL_MSG+message,
			status:FAIL_STATUS,
			response:""
		}

		try{
			//call for validation of email address or phone
			xData.validationType = ["emailIdOrPhone"]
			var resBefore = await Meteor.call("affiliateValidatinonsAssocsUnderSa",xData,distAffil,false)
			//console.log("resBefore .. !")
			//console.log(JSON.stringify(resBefore))

			if(resBefore && resBefore.status == SUCCESS_STATUS&&(distAffil==2||distAffil==3)){
				//console.log("resBefore .. 1")
				var registerValidation = await Meteor.call("registerTTFIAcademyAPI",xData,true)
				if(registerValidation && registerValidation.status==SUCCESS_STATUS && registerValidation.data&& registerValidation.data.length
				 && registerValidation.data[0].data && registerValidation.data[0].data.userId){
					var userIds = []
					userIds.push(registerValidation.data[0].data.userId)

					if(distAffil==3){
						//console.log("resBefore .. 2")
						if(xData.stateAssociationId){
							//console.log("resBefore .. 3")
							xData.loggedId = xData.stateAssociationId
							xData.userId = userIds
						}
					}
					else if(distAffil==2){
						//console.log("resBefore ..5")
						if(xData.districtAssociationId){
							//console.log("resBefore .. 6")
							xData.loggedId = xData.districtAssociationId
							xData.userId = userIds
						}
					}
					var resAffil = await Meteor.call("affiliateAcademiesBYSADA",xData,true)

					if(resAffil && resAffil.status==SUCCESS_STATUS){
						resAffil.message = REG_AFFILIATE_SUCCESS_MSG
						return resAffil
					}
					else{
						return res
					}
				}
				else{
					return registerValidation
				}
			}
			else if(resBefore && resBefore.status == SUCCESS_STATUS&&distAffil==1){
				var registerValidation = await Meteor.call("registerTTFIStateDistAssocAPI",xData,"District/City")
				if(registerValidation && registerValidation.status==SUCCESS_STATUS && registerValidation.data&& registerValidation.data.length
				 && registerValidation.data[0].data && registerValidation.data[0].data.userId){
					var userIds = []
					userIds.push(registerValidation.data[0].data.userId)

					if(xData.stateAssociationId){
						xData.loggedId = xData.stateAssociationId
						xData.userId = userIds
					}
					var resAffil = await Meteor.call("affiliateDABYSA",xData,true)

					if(resAffil && resAffil.status==SUCCESS_STATUS){
						resAffil.message = REG_AFFILIATE_SUCCESS_MSG
						return resAffil
					}
					else{
						return res
					}
				}
				else{
					return registerValidation
				}
			}
			else{
				return resBefore
			}
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

Meteor.methods({
	"registerTTFIPlayersAPI":async function(xData,registerType){
		registerType = "stateAssociation"

		//console.log(typeof xData)
		//console.log(xData)

		if(typeof xData == "string"){
			data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:REGISTER_FAIL_MSG + "Players",
			status:FAIL_STATUS,
			response:""
		}

		try{
			if(xData){
				//console.log(xData)
				//console.log(xData.playersList)
				if(xData.playersList && xData.playersList.length && typeof xData.playersList=="object"){
					var errors = []

					for(var i=0;i<xData.playersList.length;i++){
						var xPlayerData = xData.playersList[i]

						//call for validation of email address or phone
						xPlayerData.validationType = ["emailIdOrPhone"]
						var resBefore = await Meteor.call("validationForEmailPhoneRole",xPlayerData)
						//console.log("resBefore .. ")
						//console.log(resBefore)

						if(resBefore && resBefore.status == SUCCESS_STATUS){
							var resValidation = await Meteor.call("validatePhoneNumbEmail",xPlayerData)
							if(resValidation && resValidation.status == SUCCESS_STATUS){
								var emailIdOrPhoneFromParam = xPlayerData.emailIdOrPhone
								xPlayerData.role = "player"
								var registerTypeArray = []

								if(registerType=="individual"){
									registerTypeArray = ["individual"]
								}
								else if(registerType=="bulk"){
									registerTypeArray = ["bulk"]
								}
								else if(registerType=="stateAssociation"){
									registerTypeArray = ["stateAssociation"]
								}
								else if(registerType=="districtAssociation"){
									registerTypeArray = ["districtAssociation"]
								}
								else if(registerType=="academy"){
									registerTypeArray = ["academy"]
								}

								xPlayerData.registerTypeArray = registerTypeArray

								var resValidation1 = await Meteor.call("apiMeteorUsersValidation",xPlayerData,"player")
								var resValidation2 = await Meteor.call("apiGeneralFieldsUsersValidation",xPlayerData)
								var resValidation3 = await Meteor.call("apiDateFieldsUsersValidation",xPlayerData,"dateOfBirth",true)
								var resValidation4 = {}
								resValidation4.status = SUCCESS_STATUS


								
	
								var errMsg = ""

								if(resValidation1 && resValidation1.status == FAIL_STATUS){
									errMsg = resValidation1.message
								}


								if(registerType=="stateAssociation"
									||registerType=="districtAssociation"
									||registerType=="academy"){
									//console.log("yes register type is ")
									//console.log(registerType)
									xPlayerData.affilaitionType = registerType
									resValidation4 = await Meteor.call("affiliateValidatinonsForPlayers",xPlayerData)
									//console.log(resValidation4)
								}

								if(resValidation2 && resValidation2.status == FAIL_STATUS){
									errMsg = errMsg + resValidation2.message
								}
								if(resValidation3 && resValidation3.status == FAIL_STATUS){
									//console.log("resValidation3 ..!")
									errMsg = errMsg + resValidation3.message
								}
								if(resValidation4 && resValidation4.status == FAIL_STATUS){
									errMsg = errMsg + resValidation4.message
								}

								if(errMsg.trim().length){
									resValidation.status = FAIL_STATUS
									resValidation.data = 0
									resValidation.message = errMsg
									var s = createReturnMessage(i,resValidation.message)
									errors.push(s)
								}

							} else{
								var s = createReturnMessage(i,resValidation.message)
								errors.push(s)
							}
						}
						else{
							var s = createReturnMessage(i,resBefore.message)
							errors.push(s)
						}
					}

					if(errors && errors.length){
						res.message = REGISTER_FAIL_MSG + "Players" + " ,"+VALID_FAIL_MSG
						res.errors = errors
						return res
					}
					else{
						var errMsg = ""

						var dupArr = [];
	                    var groupedByCount = _.countBy(xData.playersList, function(item) {
	                    	if(item.phoneNumber && item.phoneNumber.trim().length)
	                        	return item.phoneNumber;
	                    });

	                    var dupArr2 = []
	                    var groupedByCount2 = _.countBy(xData.playersList, function(item) {
	                    	if(item.emailAddress && item.emailAddress.trim().length)
	                        	return item.emailAddress.trim().toLowerCase();
	                    });

	                    var dupArr3 = []
	                    var groupedByCount3 = []

	                    if(registerType=="stateAssociation"
									||registerType=="districtAssociation"
									||registerType=="academy"){
		                    groupedByCount3 = _.countBy(xData.playersList, function(item) {
		                    	if(item.affiliationId && item.affiliationId.trim().length)
		                        	return item.affiliationId.trim().toLowerCase();
		                    });
	            		}

						for (var emailAddress in groupedByCount2) {
							//console.log(emailAddress)
							if(emailAddress!="undefined"){
		                        if (groupedByCount2[emailAddress] > 1 && emailAddress.trim().length != 0) {
		                           dupArr2.push(emailAddress);
		                        }
		                    }
	                    };
						
						for (var affiliationId in groupedByCount3) {
							if(affiliationId!=undefined){
		                        if (groupedByCount3[affiliationId] > 1 && affiliationId.trim().length != 0) {
		                            dupArr3.push(affiliationId);
		                        }
	                    	}
	                    };

						for (var phoneNumber in groupedByCount) {
							//console.log(phoneNumber)
							if(phoneNumber!="undefined"){
		                        if (groupedByCount[phoneNumber] > 1 && phoneNumber.trim().length != 0) {
		                            dupArr.push(phoneNumber);
		                        }
		                     }
	                    };
	                    //console.log("dupArr .. ")
	                    //console.log(dupArr)

	                    //console.log("dupArr2 .. ")
	                    //console.log(dupArr2)

						if(dupArr && dupArr.toString().length){
							res.message = REGISTER_FAIL_MSG + "Players" + " ,"+VALID_FAIL_MSG
							res.errors = DUPLICATE_PHONE + " ,"+dupArr
							return res
						}
						else if(dupArr2 && dupArr2.toString().length){
							res.message = REGISTER_FAIL_MSG + "Players" + " ,"+VALID_FAIL_MSG
							res.errors = DUPLICATE_EMAIL + " ,"+dupArr2
							return res
						}
						else if(dupArr3 && dupArr3.toString().length){
							res.message = REGISTER_FAIL_MSG + "Players" + " ,"+VALID_FAIL_MSG
							res.errors = DUPLICATE_AFFILIATIONId + " ,"+dupArr3
							return res
						}
						else{
							//register

						}

					}
				}else{
					res.message = "playersList" + IS_INVALID_MSG + " , it should be array of players detail"
					return res
				}
			}else{
				res.message = XDATA_NULL_MSG
				return res
			}
		}catch(e){
			//console.log(e)
			res.message = e
			return res
		}
	}
})

//valid school
Meteor.methods({
	"validationRegisterExtAPI":async function(xData){
		if(typeof xData == "string"){
			data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:REGISTER_FAIL_MSG + "School",
			status:FAIL_STATUS,
			response:""
		}

		try{
			//call for validation of email address or phone
			xData.validationType = ["emailIdOrPhone"]
			xData.emailIdOrPhone = "1"
			xData.registerType = "bulk"
			xData.interestedProjectName = ["QvHXDftiwsnc8gyfJ"]
			xData.country = "India"

			var resBefore = await Meteor.call("validationForEmailPhoneRole",xData)
			if(resBefore && resBefore.status == SUCCESS_STATUS){
				var resValidation = await Meteor.call("validatePhoneNumbEmail",xData)

				if(resValidation && resValidation.status == SUCCESS_STATUS){
					var emailIdOrPhoneFromParam = xData.emailIdOrPhone

					xData.emailIdOrPhone = 3
					var resValidation1 = await Meteor.call("apiMeteorUsersValidation",xData,"school")
					xData.emailIdOrPhone = 0
					var resValidation2 = await Meteor.call("apiGeneralFieldsUsersValidation",xData)
					var resValidation3 = await Meteor.call("apiSchoolAbbrevation",xData)
					var errMsg = ""


					if(resValidation1 && resValidation1.status == FAIL_STATUS){
						errMsg = resValidation1.message
					}
					if(resValidation2 && resValidation2.status == FAIL_STATUS){
						errMsg = errMsg + resValidation2.message
					}
					if(resValidation3 && resValidation3.status == FAIL_STATUS){
						errMsg = errMsg + resValidation3.message
					}

					else{


						if(resValidation2 && resValidation2.status == SUCCESS_STATUS
							&& resValidation1 && resValidation1.status == SUCCESS_STATUS && 
							resValidation3 &&
							resValidation3.status == SUCCESS_STATUS){
							xData.emailIdOrPhone = parseInt(emailIdOrPhoneFromParam)
							xData.role = "School"
							resValidation.status = SUCCESS_STATUS
							resValidation.message = "Can upload for this line"
							resValidation.data = 0
							return resValidation
						}
					}
					
					if(errMsg.trim().length){
						resValidation.status = FAIL_STATUS
						resValidation.data = 0
						resValidation.message = errMsg
						return resValidation
					}
				}
				else{
					return resValidation
				}
			}
			else{
				return resBefore
			}
		}catch(e){
			res.message = e
			return res
		}
	}
})


//register school 
Meteor.methods({
	"registerSchoolExtAPI":async function(xData){
		if(typeof xData == "string"){
			data = xData.replace("\\", "");
			xData = JSON.parse(data);
		}
		var res = {
			data:0,
			message:REGISTER_FAIL_MSG + "School",
			status:FAIL_STATUS,
			response:""
		}

		try{
			//call for validation of email address or phone
			xData.validationType = ["emailIdOrPhone"]
			xData.emailIdOrPhone = "1"
			xData.registerType = "bulk"
			xData.interestedProjectName = ["QvHXDftiwsnc8gyfJ"]
			xData.country = "India"

			var resBefore = await Meteor.call("validationForEmailPhoneRole",xData)
			if(resBefore && resBefore.status == SUCCESS_STATUS){
				var resValidation = await Meteor.call("validatePhoneNumbEmail",xData)

				if(resValidation && resValidation.status == SUCCESS_STATUS){
					var emailIdOrPhoneFromParam = xData.emailIdOrPhone

					xData.emailIdOrPhone = 3
					var resValidation1 = await Meteor.call("apiMeteorUsersValidation",xData,"school")
					xData.emailIdOrPhone = 0
					var resValidation2 = await Meteor.call("apiGeneralFieldsUsersValidation",xData)
					var resValidation3 = await Meteor.call("apiSchoolAbbrevation",xData)
					var errMsg = ""

					if(resValidation1 && resValidation1.status == FAIL_STATUS){
						errMsg = resValidation1.message
					}
					if(resValidation2 && resValidation2.status == FAIL_STATUS){
						errMsg = errMsg + resValidation2.message
					}
					if(resValidation3 && resValidation3.status == FAIL_STATUS){
						errMsg = errMsg + resValidation3.message
					}

					else{

						if(resValidation2 && resValidation2.status == SUCCESS_STATUS
							&& resValidation1 && resValidation1.status == SUCCESS_STATUS && 
							resValidation3 &&
							resValidation3.status == SUCCESS_STATUS){
							xData.emailIdOrPhone = parseInt(emailIdOrPhoneFromParam)
							xData.role = "School"
							return (Meteor.call("registerEntity",xData))
						}
					}
					
					if(errMsg.trim().length){
						resValidation.status = FAIL_STATUS
						resValidation.data = 0
						resValidation.message = errMsg
						return resValidation
					}
				}
				else{
					return resValidation
				}
			}
			else{
				return resBefore
			}
		}catch(e){
			res.message = e
			return res
		}
	}
})

function createReturnMessage(index,response){
	var data = {
		"errorAt":index,
		"message":response
	}
	return data
}