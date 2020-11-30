
export const drillClass = function(drillData){
    this.coachId = drillData.coachId

    this.playerId = drillData.playerId
    this.drillId = drillData.drillId
    this.intensityType = drillData.intensityType

    this.durationInSecs = drillData.durationInSecs
    this.intensityType = drillData.intensityType
    this.noOfImpacts = drillData.noOfImpacts
    this.arrayOfImpacts = drillData.arrayOfImpacts
    this.count = drillData.count
    
    this.durationInMins = drillData.durationInMins
    this.startTime = drillData.startTime
    this.endTime = drillData.endTime
    this.timerTime = drillData.timerTime
    this.completed = drillData.completed
    this.durationInHours = drillData.durationInHours
    this.Tt = drillData.Tt
    this.arrayOfTimeStamp = drillData.arrayOfTimeStamp
    this.selectedDate = drillData.selectedDate
}

DrillClass = drillClass

drillClass.prototype.nullUndefinedEmpty = function(key){
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

drillClass.prototype.checkCoachId = function(key){
	try{
		var coachId = this.coachId
		console.log(coachId)
		var metUser = Meteor.users.findOne({
			"userId":coachId,
			role:"Coach"
		})
		console.log(metUser)
		if(metUser){
			var otherUserDet = otherUsers.findOne({
				"userId":coachId
			})
			if(otherUserDet){
				return "1"
			}
			else{
				return COACH_INVALID_MSG
			}
		}else{
			return COACH_INVALID_MSG
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}

drillClass.prototype.checkForValidPlayerId = function(key,returnDet){
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

drillClass.prototype.checkForValidDrillId = function(key){
	try{
		var drillId = this.drillId
		var findD = drill.findOne({
			"_id":drillId
		})
		if(findD){
			return "1"
		}else{
			return INVALID_DRILLID
		}
	}catch(e){
		return CATCH_MSG + e.toString()
	}
}