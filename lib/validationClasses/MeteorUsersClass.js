
export const meteorUsers = function(userData){
	this.emailAddress = userData.emailAddress
	this.password = userData.password
	this.interestedProjectName = userData.interestedProjectName
	this.userName = userData.userName
	this.role = userData.role
	this.verifiedBy = userData.verifiedBy
	this.phoneNumber = userData.phoneNumber
	this.registerType = userData.registerType

	this.userStatus = userData.userStatus
	this.profileSettingStatus = userData.profileSettingStatus

	//extra
	this.emailIdOrPhone = userData.emailIdOrPhone
	this.emailOrPhoneValue = userData.emailOrPhoneValue

	this.pinCode = userData.pinCode
	this.gender = userData.gender
	this.dateOfBirth = userData.dateOfBirth
	this.state = userData.state
	this.country = userData.country

	this.city = userData.city
	this.address = userData.address

	this.interestedDomainName = userData.interestedDomainName
	this.guardianName = userData.guardianName

	//assoc
	this.dateOfInc = userData.dateOfInc

	//enable users
	this.usersRole = userData.usersRole 
	this.userId = userData.userId

}


meteorUsers.prototype.validateEmail = function(key)
{	
	//console.log("key is ")
	//console.log(this.emailAddress)
	var validationClassObject = new validationClass();
	var s = validationClassObject.validateEmail(this[key])
  	if(s==true){
  		return "1"
  	}
  	else {
  		return "emailAddress " + IS_INVALID_MSG
  	}
};

meteorUsers.prototype.nullUndefinedEmpty = function(key)
{
	//console.log("key is " + key)
	//console.log(this[key])
	var validationClassObject = new validationClass();
	var s = validationClassObject.nullUndefinedEmpty(this[key])
	//console.log(s)
  	if(s==1){
  		return "1"
  	}
  	else if(s==2){
  		return key + IS_NULL_MSG
  	}
  	else if(s==3){
  		return key + IS_UNDEFINED_MSG
  	}
  	else if(s==4){
  		return key + EMPTY_MSG
  	}
};

meteorUsers.prototype.nullUndefined = function(key)
{
	var validationClassObject = new validationClass();
	var s = validationClassObject.nullUndefined(this[key])
  	if(s==2){
  		return key + IS_NULL_MSG
  	}
  	else if(s==3){
  		return key + IS_UNDEFINED_MSG
  	}
  	else if(s==1){
  		return "1"
  	}
};

meteorUsers.prototype.roleValidation = function(){
	var thisRole = this.role 
	var rolesInDb = adminSportsRoles.findOne({})
	if(rolesInDb && rolesInDb.roles && rolesInDb.roles.length){
		//console.log(thisRole)
		//console.log("contains ,,!")
		//console.log(_.contains(rolesInDb.roles,thisRole.toLowerCase()))
		if(_.contains(rolesInDb.roles,thisRole.toLowerCase())){
			return "1"
		}
		else{
			return "roles should be "+rolesInDb.roles.toString()
		}
	}	
	else{
		return "Error with adminSportsRoles"
	}
}


meteorUsers.prototype.checkinterestedProjectName = function(){
	var thisProject = this.interestedProjectName
	if(thisProject && typeof thisProject == "object"){
		if (thisProject && thisProject.length == 1) {
			var projectInDb = tournamentEvents.findOne({"_id":thisProject[0]})
			if(projectInDb){
				return "1"
			}
			else{
				return INVALID_PROJECT_MSG
			}
		}else{
			return LENGTH_INVALID_PROJECT_MSG
		}
	}else{
		return ARRAY_INVALID_PROJECT_MSG
	}
}

meteorUsers.prototype.checkverifiedBy = function(){
	var thisverifiedBy = this.verifiedBy
	//console.log(thisverifiedBy)
	if(thisverifiedBy && typeof thisverifiedBy == "object"){
		if (thisverifiedBy && thisverifiedBy.length) {
			var ver = _.intersection(["email","phone"],thisverifiedBy)
			//console.log(ver)
			if(ver && ver.length){
				return "1"
			}
			else{
				return VERIFIED_BY_INVALID_MSG
			}
		}else{
			return VERIFIED_BY_INVALID_LENGTH_MSG
		}
	}else{
		return VERIFIED_BY_INVALID_ARRAY_MSG
	}
}

meteorUsers.prototype.validateCharLenWithGivenMin = function(minlength,key){
	var validationClassObject = new validationClass();
	var s = validationClassObject.validateCharLenWithGivenMin(minlength,this[key])
	if(s==true){
		return "1"
	}
	else{
		return key + CHAR_LENGTH_MSG+minlength 
	}

}

meteorUsers.prototype.validateMobileNum10 = function(key){
	var validationClassObject = new validationClass();
	var s = validationClassObject.validateMobileNum10(this[key])
	if(s==true){
		return "1"
	}
	else{
		return PHONE_DIGITS_TEN_MSG
	}

}

meteorUsers.prototype.checkRegisterType = function(registerTypeArray){
	var registerType = this.registerType

	if(_.contains(registerTypeArray,registerType.replace(/\s+/g,' ').trim())){
		return "1"
	}
	else if(registerTypeArray.length>2){
		return REG_TYPE_MSG + registerTypeArray.toString()
	}
	else{
		return REG_TYPE_2_MSG + registerTypeArray.toString()
	}
}

meteorUsers.prototype.checkWithinGivenValues = function(values,key){
	var thisverifiedBy = this[key]
	//console.log(thisverifiedBy)
	if(thisverifiedBy){
		if (thisverifiedBy) {
			var ver = _.contains(values,thisverifiedBy)
			//console.log(ver)
			if(ver){
				return "1"
			}
			else{
				return key + CONTAIN_ANY_MSG + values.toString()
			}
		}else{
			return key + IS_INVALID_LENGTH_MSG
		}
	}else{
		return key + CONTAIN_ANY_MSG + values.toString()
	}
}

meteorUsers.prototype.checkWithGivenValue = function(value,key){
	var thisverifiedBy = this[key]
	//console.log("check this value")
	//console.log(this[key])
	//console.log(thisverifiedBy)
	//console.log(value)
	if (thisverifiedBy==value) {
		//console.log("in whennn 1")
			return "1"
	}else{
		//console.log("in whennn 2")
		return key + SHOULD_ANY_MSG + value.toString()
	}
}


meteorUsers.prototype.validateCharLenWithGivenMin = function(minlength,key){
	var validationClassObject = new validationClass();
	var s = validationClassObject.validateCharLenWithGivenMin(minlength,this[key])
	if(s==true){
		return "1"
	}
	else{
		return key + CHAR_LENGTH_MSG+minlength 
	}

}

meteorUsers.prototype.validatePinCode = function(){
	//console.log("pincode is validate ..!")
	//console.log(this.pinCode)
	var validationClassObject = new validationClass();
	var s = validationClassObject.validatePinCode(this.pinCode)
	if(s==true){
		return "1"
	}
	else{
		return PIN_DIGITS_MSG + maxPinCode 
	}

}

meteorUsers.prototype.validateGenderMaleOrFemale = function(){
	var validationClassObject = new validationClass();
	var s = validationClassObject.validateGenderMaleOrFemale(this.gender)
	if(s==true){
		return "1"
	}
	else{
		return GENDER_MSG
	}

}

meteorUsers.prototype.validateDate = function(key){
	var validationClassObject = new validationClass();
	var s = validationClassObject.validateDate(this[key])
	if(s==true){
		return "1"
	}
	else{
		return key + DATE_INVALID_MSG
	}

}

meteorUsers.prototype.validateState = function(){
	var country  = this.country
	var state = this.state
	var stateInDb = timeZone.findOne({
        "countryName": country,
        "state.stateId" : state
    });
    if(stateInDb){
    	return "1"
    }
    else{
    	return STATE_INVALID_MSG
    }
}

meteorUsers.prototype.validateCountry = function(){
	var country  = this.country
	var stateInDb = timeZone.findOne({
        "countryName": country,
    });
    if(stateInDb){
    	return "1"
    }
    else{
    	return COUNTRY_INVALID_MSG
    }
}

MeteorUsers = meteorUsers