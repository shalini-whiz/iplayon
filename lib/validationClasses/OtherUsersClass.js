export const assocUsers = function(userData){

	this.assocAbbrevation = userData.assocAbbrevation
	this.associationName = userData.associationName
	this.associationType = userData.associationType

	this.parentAssociationId = userData.parentAssociationId
	this.affiliatedTo = userData.affiliatedTo
	this.interestedDomainName = userData.interestedDomainName
	//academy abbrevation
	this.abbrevation = userData.abbrevation
	this.clubName = userData.clubName

	//affiliation
	this.parentAssociationId = userData.parentAssociationId
	this.affiliatedTo = userData.affiliatedTo
	this.interestedProjectName = userData.interestedProjectName

	//extra
	this.source = userData.source
	this.stateAssociationId = userData.stateAssociationId
	this.districtAssociationId = userData.districtAssociationId
	this.districtId = userData.districtId
	this.academyId = userData.academyId
	this.associationId = userData.associationId

	//extra for enable users
	this.userId = userData.userId
	this.loggedInId = userData.loggedInId
	this.enableValue = userData.enableValue

	//userIds
	this.userIds = userData.userIds

	//update
	this.userName = userData.userName

	//affiliate users
	this.affiliationId = userData.affiliationId
}



assocUsers.prototype.checkinterestedDomaiName = function(){
	var thisProject = this.interestedDomainName
	if(thisProject && typeof thisProject == "object"){
		if (thisProject && thisProject.length == 1) {
			var projectInDb = domains.findOne({"_id":thisProject[0]})
			if(projectInDb){
				return "1"
			}
			else{
				return INVALID_DOMAIN_MSG
			}
		}else{
			return LENGTH_INVALID_DOMAIN_MSG
		}
	}else{
		return ARRAY_INVALID_DOMAIN_MSG
	}
}


assocUsers.prototype.nullUndefinedEmpty = function(key)
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

assocUsers.prototype.nullUndefined = function(key)
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

assocUsers.prototype.nullUndefined = function(key)
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

assocUsers.prototype.checkWithinGivenValues = function(values,key){
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

assocUsers.prototype.checkWithGivenValue = function(value,key){
	var thisverifiedBy = this[key]
	//console.log(thisverifiedBy)
	if(thisverifiedBy){
		if (thisverifiedBy==value) {
			return "1"
		}else{
			return key + SHOULD_ANY_MSG + value.toString()
		}
	}else{
		return key + SHOULD_ANY_MSG + value.toString()
	}
}

assocUsers.prototype.checkForAbbrevationDup = function(key){
	var value = this[key]
	if(value){
		var dbDet = associationDetails.findOne({
			'abbrevationAssociation':replaceSpaceWhiteSpaces(value.toUpperCase()),
		})
		if(dbDet){
			return "use different "+ key
		}
		else{
			var dbDet = academyDetails.findOne({
				'abbrevationAcademy':replaceSpaceWhiteSpaces(value.toUpperCase())
			})
			if(dbDet){
				return "use different "+ key
			}
			else{
				var dbDet = schoolDetails.findOne({
					"abbrevation":replaceSpaceWhiteSpaces(value.toUpperCase())
				})
				if(dbDet){
					return "user different "+key
				}
				else{
					return "1"
				}
			}
		}
	}
}

assocUsers.prototype.checkForValidUsers = function(key,db,source,ix){
	var valueOfKey = this[key]
	if(valueOfKey){
		var det = Meteor.users.findOne({
			userId:valueOfKey,
			source:source
		})
		if(det){
			var det2 = global[db].findOne({
				userId:valueOfKey,
				source:source
			})
			if(det2){
				return "1"
			}
			else{
				return "invalid " + db + " value for " + valueOfKey + AT_INDEX + ix
			}
		}
		else{
			return "invalid MeteorUser " + valueOfKey +AT_INDEX + ix
		}
	}else{
		return key + IS_INVALID_MSG
	}
}

assocUsers.prototype.checkForValidUsersWithQueruy = function(key,db,source,query){
	var valueOfKey = this[key]
	if(valueOfKey){
		var det = Meteor.users.findOne({
			userId:valueOfKey,
			source:source
		})
		if(det){
			var det2 = global[db].findOne(query)
			if(det2){
				return "1"
			}
			else{
				return "invalid " + db + " value for " + valueOfKey 
			}
		}
		else{
			return "invalid MeteorUser " + valueOfKey + AT_INDEX
		}
	}else{
		return  key + IS_INVALID_MSG
	}
}

assocUsers.prototype.checkForAffiliatedUser= function(key,db,query,ix){
	var valueOfKey = this[key]
	if(valueOfKey){
		if(true){
			//console.log("query is .. !!")
			//console.log(query)
			var det2 = global[db].findOne(query)
			//console.log(det2)

			if(det2){
				if(det2 && det2.affiliatedTo=="other"){
					return "1"
				}
				else if(det2 && det2.affiliatedTo!="other"){
					return key + " " + valueOfKey  + " at index " + ix + " already affiliated"
				}
			}
			else{
				return "invalid "+ valueOfKey + "  " + key + " at index "+ ix  
			}
		}
	}else{
		return  key + IS_INVALID_MSG
	}
}

assocUsers.prototype.checkForAffiliationForQuery = function(query,db,affiliatedTo,key){
	var valueOfKey = this[key]
	if(valueOfKey){
		if(true){
			//console.log("db is ..")
			//console.log(db)
			//console.log("query is ..")
			//console.log(query)
			var det2 = global[db].findOne(query)
			//console.log(det2)
			if(det2){
				if(det2 && det2.affiliatedTo==affiliatedTo){
					return "1"
				}
				else if(det2 && det2.affiliatedTo=="other"){
					return key + " is not affiliated to " +affiliatedTo
				}
				else{
					return key + " is not affiliated to " +affiliatedTo
				}
			}
			else{
				return key+ IS_INVALID_MSG
			}
		}
	}else{
		return key + IS_INVALID_MSG
	}
}

assocUsers.prototype.checkinterestedProjectName = function(){
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

assocUsers.prototype.checkForAffiliationIdValid = function(){
	var thisAffil = this.affiliationId
	if(thisAffil && thisAffil.length){
		var affID = thisAffil.substr(3,thisAffil.length);
		if(affID.trim().length < 3){
			return AFFILIATIONID_LENGTH_MSG
		}
		else if(affID.trim().length >= 3){
			var str = thisAffil.trim().substr(0, 3)
			
			if(str && str.trim().length == 3){
				if(str.toLowerCase().match(/[a-z]/i)){
					if (affID.match(/^\d+$/)) {
						return "1"
					}
					else if (!affID.match(/^\d+$/)) {
						return AFFILIATIONID_AFTER_THREE_MSG
					}
				} else{
					return AFFILIATIONID_THREE_MSG
				}
			}else{
				return AFFILIATIONID_INVALID_MSG
			}

		}
	}
	else{
		return AFFILIATIONID_INVALID_MSG
	}
}

AssocUsers = assocUsers