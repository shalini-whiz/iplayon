
export const teamsFormats = function(teamsFormatsData){
	this.organizerId = teamsFormatsData.organizerId
	this.formatName = teamsFormatsData.formatName
	this.specifications = teamsFormatsData.specifications
	this.no = teamsFormatsData.no
	this.displayLabel = teamsFormatsData.displayLabel
	this.label = teamsFormatsData.label
	this.type = teamsFormatsData.type
	this.order = teamsFormatsData.order
	this.projectId = teamsFormatsData.projectId
	this.sortorder = teamsFormatsData.sortorder
	this.teamsFormatId = teamsFormatsData.teamsFormatId
	this.teamId = teamsFormatsData.teamId

	//matchTeamOth
	this.no = teamsFormatsData.no
	this.playerAId = teamsFormatsData.playerAId
	this.playerBId = teamsFormatsData.playerBId
	this.setScoresA = teamsFormatsData.setScoresA
	this.setScoresB = teamsFormatsData.setScoresB
	this.winnerIdPlayer = teamsFormatsData.winnerIdPlayer
	this.matchType = teamsFormatsData.matchType
	this.winnerIdTeam = teamsFormatsData.winnerIdTeam
	this.playerA1Id = teamsFormatsData.playerA1Id
	this.playerA2Id = teamsFormatsData.playerA2Id
	this.playerB1Id = teamsFormatsData.playerB1Id
	this.playerB2Id = teamsFormatsData.playerB2Id
	this.winnerD1PlayerId = teamsFormatsData.winnerD1PlayerId
	this.winnerD2PlayerId = teamsFormatsData.winnerD2PlayerId
	this.matchProjectType = teamsFormatsData.matchProjectType

	//teamsDetScoreOth
	this.matchNumber = teamsFormatsData.matchNumber
	this.roundNumber = teamsFormatsData.roundNumber
	this.teamAID = teamsFormatsData.teamAID
	this.teamBID = teamsFormatsData.teamBID
	this.finalTeamWinner = teamsFormatsData.finalTeamWinner
	this.teamMatchType = teamsFormatsData.teamMatchType

	//this is matchTeamOth
	this.specifications = teamsFormatsData.specifications

	this.matchTeamOth = teamsFormatsData.matchTeamOth


	//teamDetailedScoresOthrFormat
	this.tournamentId = teamsFormatsData.tournamentId
	this.eventName = teamsFormatsData.eventName

	//this is teamsDetScoreOth
	this.teamDetScore = teamsFormatsData.teamDetScore

	this.teamsDetScoreOth = teamsFormatsData.teamsDetScoreOth
	this.orgTeamFormatId = teamsFormatsData.orgTeamFormatId

	//valid
	this.playerId = teamsFormatsData.playerId
	this.userId = teamsFormatsData.userId

	//roundName for bronze medal
	this.roundName = teamsFormatsData.roundName
	this.noofSets = teamsFormatsData.noofSets
	this.minScores = teamsFormatsData.minScores
	this.minDifference = teamsFormatsData.minDifference
	this.points = teamsFormatsData.points

}

teamsFormats.prototype.nullUndefinedEmpty = function(key){
	try{
		var validationClassObject = new validationClass();
		var s = validationClassObject.nullUndefinedEmpty(this[key])

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
  	}catch(e){
		return CATCH_MSG + e.toString()
	}
};

teamsFormats.prototype.validateOddNum = function(key){
	try{
		var validationClassObject = new validationClass()
		var s = parseInt(this[key])
		if(s % 2 != 0){
			return "1"
		}else{
			return key + SHOULD_NUM_ODD_MSG
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.validateNumb = function(key){
	try{
		var validationClassObject = new validationClass()
		var s = validationClassObject.validateNum(this[key])
		if(s){
			return "1"
		}else{
			return key + SHOULD_NUM_MSG
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.validateTypeValue = function(key){
	try{
		var value = this[key]
		if(value==1||value==2){
			return "1"
		}else{
			return key + " should be 1 or 2 (represents singles or doubles)"
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.checkForValidPlayerId = function(key,returnDet){
	try{
		var userId = this[key]
		var usersCheck = Meteor.users.findOne({
			userId:userId
		})
		if(usersCheck && usersCheck.interestedProjectName){
			var c = playerDBFindCol(usersCheck.interestedProjectName.toString())
			var checkRoleDet = c

			if(checkRoleDet){
				var userDetIn = global[checkRoleDet].findOne({
					"userId":userId
				})
				if(userDetIn && returnDet){
					return userDetIn
				}else if(userDetIn){
					return "1"
				}else{
					userDetIn = schoolPlayers.findOne({
						userId:userId
					})
					if(userDetIn && returnDet){
						return userDetIn
					}
					else if(userDetIn){
						return "1"
					}
					else{
						return "Player details for "+key+IS_INVALID_MSG
					}
				}
			}else{
				return "DB details for "+key+IS_INVALID_MSG
			}
		}else{
			return "interestedProjectName of "+ key + IS_INVALID_MSG
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.checkForOrganizerId = function(){
	try{
		var values = ["association","academy","organiser"]
		var checkOrgId = this.organizerId
		var usersCheck = Meteor.users.findOne({
			"userId":checkOrgId
		})
		if(usersCheck && usersCheck.role){
			if(usersCheck.role){
				var ver = _.contains(values,usersCheck.role.toLowerCase())
				if(ver){
					var c = getDbNameforARoleCol(usersCheck.role)
					var checkRoleDet = c
					if(checkRoleDet){
						var checkRoleDetvalue = global[checkRoleDet].findOne({
							"userId":checkOrgId
						})
						if(checkRoleDetvalue){
							return "1"
						}else{
							return "checkRoleDet " + IS_INVALID_MSG
						}
					}else{
						return "Role " + IS_INVALID_MSG
					}
				}
				else{
					return "Roles " + CONTAIN_ANY_MSG + values.toString()
				}
			}else{
				return "Role " + CONTAIN_ANY_MSG + values.toString()
			}

		}else{
			return "Role " + IS_INVALID_MSG
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.checkTeamSpecifications = function(key){
	try{
		var thisProject = this.specifications
		if(thisProject && typeof thisProject == "object"){
			if (thisProject && thisProject.length) {
				return "1"
			}else{
				return LENGTH_INVALID_TEAM_SPEC_MSG
			}
		}else{
			return ARRAY_INVALID_TEAM_SPEC__MSG
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
	
}

teamsFormats.prototype.nullUndefined = function(key)
{
	try{
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
	}catch(e){
		return CATCH_MSG + e.toString()
	}
	
};

teamsFormats.prototype.checkValidTournamentID = function(retVal){
	try{
		var s = this.tournamentId
	  	var eve = events.findOne({
	  		"_id":s
	  	})
	  	if(eve && retVal==true){
	  		return eve
	  	}
	  	else if(eve){
	  		return "1"
	  	}else {
	  		var eve = pastEvents.findOne({
	  			"_id":s
	  		})
	  		if(eve && retVal==true){
	  			return eve
	  		}
	  		else if(eve){
	  			return "1"
	  		}else{
	  			return "tournamentId "+IS_INVALID_MSG
	  		}
	  	}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.checkValidTournamentIDEvent = function(resreq){
	try{
		var s = this.tournamentId
		var s1 = this.eventName
	  	var eve = events.findOne({
	  		"tournamentId":s,
	  		"eventName":s1
	  	})
	  	if(eve && resreq){
	  		return eve
	  	}
	  	else if(eve){
	  		return "1"
	  	}else {
	  		var eve = pastEvents.findOne({
	  			"tournamentId":s,
	  			"eventName":s1
	  		})
	  		if(eve && resreq){
		  		return eve
		  	}
		  	else if(eve){
		  		return "1"
		  	}else{
	  			return "tournament details "+IS_INVALID_MSG
	  		}
	  	}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.checkValidTeamFormatID = function(key){
	try{
		var s = this[key]

	  	var eve = orgTeamMatchFormat.findOne({
	  		"_id":s,
	  	})
	  	if(eve){
	  		return "1"
	  	}else {
	  		return "team format details "+IS_INVALID_MSG
	  	}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.checkValidObjectType = function(key,lengthValid){
	try{
		var s = this[key]
	  	if(s && typeof s == "object"){
	  		if(s.length && lengthValid){
	  			return "1"
	  		}
	  		else if(lengthValid==false){
	  			return "1"
	  		}
	  		else{
	  			return TEAMS_OTR_INVALID_LENGTH_MSG
	  		}
	  	}else {
	  		return key +TEAMS_OTR_INVALID_TYPE_OBJECT_MSG
	  	}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.containsGivenValues = function(key,values,caseSens){
	try{
		var s = this[key]
		if(_.contains(values,s.toString().toLowerCase()) && caseSens){
			return "1"
		}
		else if(_.contains(values,s.toString()) && caseSens==false){
			return "1"
		}
		else{
			return key + CONTAIN_ANY_MSG + values.toString()
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

teamsFormats.prototype.checkSetScores = function(key,length){
	try{
		var validationClassObject = new validationClass()
		var s = this[key]
		if(s && typeof s == "object"){
			if(length && s.length==length){
				var isNum = false
				for(var i=0;i<s.length;i++){
				
					if(validationClassObject.validateNumPosNeg((s[i]))){
						isNum = true
						continue;
					}else{
						isNum = false
						break;
					}
				}

				if(isNum){
					return "1"
				}else{
					return key + " should contain numbers "
				}
			}else{
				return key + " should be of length "+length
			}
		}else{
			return key + " should be array "
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

TeamsFormats = teamsFormats