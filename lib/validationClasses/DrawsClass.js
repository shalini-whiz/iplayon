export const drawsResults = function(drawsData){
    this.stateId = drawsData.stateId
    this.country = drawsData.country
    this.tournamentId = drawsData.tournamentId
    this.eventName = drawsData.eventName
    this.roundNumber = drawsData.roundNumber
    this.resultsFor = drawsData.resultsFor
    this.playerId = drawsData.playerId
    this.teamId = drawsData.teamId
    this.eveType = drawsData.eveType
    this.year = drawsData.year
    this.eventOrganizer = drawsData.eventOrganizer
    this.matchNumber = drawsData.matchNumber
    this.types = drawsData.types
    this.co = drawsData.co
}


drawsResults.prototype.nullUndefinedEmpty = function(key){
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

drawsResults.prototype.checkValidTournamentID = function(val,retVal){
    try{
        var s = val
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

drawsResults.prototype.validateState = function(){
    try{
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
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.validateOnlyState = function(){
    try{
        var state = this.state
        var stateInDb = timeZone.findOne({
            "state.stateId" : state
        });
        if(stateInDb){
            return "1"
        }
        else{
            return STATE_INVALID_MSG
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.validateCountry = function(){
    try{
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
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.validateAssociationIdWRTStateId = function(){
    try{
        var state = this.stateId
        var findDet = stateAssociationsForState.findOne({
            "stateId":state
        })
        if(findDet){
            if(findDet && findDet.stateAssocIds){
                return [findDet.stateAssocIds]
            }else{
                return ASSOC_STATE_INVALID_MSG
            }
        }else{
            var findDet = stateAssociationsForState.findOne({
                "stateAssocIds":state
            })
            if(findDet){
                return [findDet.stateAssocIds]
            }
            else{
                return ASSOC_STATE_INVALID_MSG
            }
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.getEventNameForThisPlayerId = function(collection , res){
    try{
        var tournamentId  = this.tournamentId
        var eventName = this.eventName

        var eveDet = MatchCollectionDB.findOne({
            tournamentId:tournamentId,
            eventName:eventName,
            eventParticipants:this.playerId
        });

        if(eveDet && eveDet.eventName && res){
            return eveDet.eventName
        }
        else if(eveDet && eveDet.eventName){
            return "1"
        }
        else{
            return RESULTS_FAILED_EVE_MSG
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.checkTournamentEvent = function(collection){
    try{
        var tournamentId  = this.tournamentId
        var eventName = this.eventName

        var eveDet = global[collection].findOne({
            tournamentId:tournamentId,
            eventName:eventName
        });

        if(eveDet){
            return "1"
        }
        else{
            return RESULTS_FAILED_EVE_MSG
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.checkOneEventFind = function(collection, resData){
    try{
        var tournamentId  = this.tournamentId

        var eveDet = global[collection].findOne({
            tournamentId:tournamentId,
            projectType:1
        });

        if(eveDet && resData){
            return eveDet
        }
        else if(eveDet){
            return "1"
        }
        else{
            return RESULTS_FAILED_EVE_MSG
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.checkTournament = function(collection,res){
    try{
        var tournamentId  = this.tournamentId

        var eveDet = global[collection].findOne({
            _id:tournamentId,
        });

        if(eveDet && res){
            return eveDet
        }
        else if(eveDet){
            return "1"
        }
        else{
            return RESULTS_FAILED_EVE_MSG
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.checkResultsFor = function(){
    try{
        var calledFrom = this.resultsFor
        if(calledFrom.replace(/\s+/g,' ').trim()=="all"||
            calledFrom.replace(/\s+/g,' ').trim()=="finals"){
            return "1"
        }
        else{
            return "getResultsFor should be all or finals"
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.checkEveType = function(){
    try{
        var calledFrom = this.eveType
        if(calledFrom.replace(/\s+/g,' ').trim()=="1"||
            calledFrom.replace(/\s+/g,' ').trim()=="2"){
            return "1"
        }
        else{
            return "evetype should be 1 or 2"
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}

drawsResults.prototype.validateYear = function(){
    try{
        var _data = this.year
        var _thisYear = new Date().getFullYear();
        if (_data.length != 4){
            return "Year is not valid";
        } 
        if (!_data.match(/\d{4}/)) {
            return "Year is not valid";
        }
        //parseInt(_data) > _thisYear || 
        if (parseInt(_data) < 1900){
            return "Year is not valid";
        }
        else{
           return "1";
        }
    }catch(e){
        return CATCH_MSG + e.toString()
    }
}
DrawsResults = drawsResults

