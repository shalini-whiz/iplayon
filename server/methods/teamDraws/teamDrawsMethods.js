
import {
    playerDBFind
}
from '../dbRequiredRole.js'

//userDetailsTTUsed


Meteor.methods({
    'teamSubscribersDownload':async function(eventName,tournamentId) {
    	try{

        if(eventName&&tournamentId){
            userId = this.userId;
            var arrayToReturn = []
            var tournamentFind = events.findOne({"_id":tournamentId})
            
            if(tournamentFind==undefined||tournamentFind==null){
                tournamentFind = pastEvents.findOne({
                    "_id": tournamentId
                })
            }

            var eventDetFind = events.findOne({"eventName":eventName,"tournamentId":tournamentId,"projectType":2});
            if(eventDetFind == undefined)
            	eventDetFind = pastEvents.findOne({"eventName":eventName,"tournamentId":tournamentId,"projectType":2});
            
            if(eventDetFind==undefined)
            	eventDetFind = pastEvents.findOne({"_id":eventName,"tournamentId":tournamentId,"projectType":2});

            if(eventDetFind==undefined)
            	eventDetFind = events.findOne({"_id":eventName,"tournamentId":tournamentId,"projectType":2});

            var dbsrequired = ["userDetailsTT","playerTeamEntries","playerTeams"]
           
            var userDetailsTT = "userDetailsTT"
            var playerTeamEntries = "playerTeamEntries"
            var playerTeams = "playerTeams"

            var res = await Meteor.call("changeDbNameForDraws", tournamentFind,dbsrequired)
            try {
				if(res){
					if(res.changeDb && res.changeDb == true){
						if(res.changedDbNames.length!=0){
							userDetailsTT = res.changedDbNames[0]
				            playerTeamEntries = res.changedDbNames[1]
				            playerTeams = res.changedDbNames[2]
						}
					}
				}
			}catch(e){
				 console.log(e)
			}


            if(eventDetFind&&tournamentFind){
            	if(eventDetFind.eventParticipants==null||eventDetFind.eventParticipants==undefined){
            		return "0"
            	}
            	else if(eventDetFind.eventParticipants.length==0){
            		return "0"
            	}
            	else{
            		var arrayOfParticipants = [];
            		arrayOfParticipants = eventDetFind.eventParticipants;
            		for(var i=0;i<arrayOfParticipants.length;i++){
            			var userDetails = global[userDetailsTT].findOne({"userId":arrayOfParticipants[i]});
            			if(userDetails){
	            			var teamDetails = global[playerTeamEntries].findOne({"tournamentId":tournamentId,playerId:arrayOfParticipants[i]});
	            			
	            			if(teamDetails&&teamDetails.subscribedTeamsArray){
	            				for(var j=0; j<teamDetails.subscribedTeamsArray.length; j++){
	            					if(teamDetails.subscribedTeamsArray[j].eventName==eventName){
	            						var teamId = teamDetails.subscribedTeamsArray[j].teamId;
	            						var findTeamName = global[playerTeams].findOne({"_id":teamId,"teamManager":arrayOfParticipants[i]});
	            						if(findTeamName){
	            							var affiliationId = " ";
	            							var tempAffId = " ";

	            							if(userDetails.affiliationId==null||userDetails.affiliationId==undefined||userDetails.affiliationId=="other"){
	            								affiliationId = " "
	            							}
	            							else {
	            								affiliationId = userDetails.affiliationId
	            							}

	            							if(userDetails.tempAffiliationId==null||userDetails.tempAffiliationId==undefined||userDetails.tempAffiliationId=="other"){
	            								tempAffId = " "
	            							}
	            							else {
	            								tempAffId = userDetails.tempAffiliationId
	            							}
	            							var data = {
	            								teamName:findTeamName.teamName.trim(),
	            								teamAffiliationId:findTeamName.teamAffiliationId.trim(),
	            								managerAffiliationId:affiliationId.trim(),
	            								temporaryAffiliationId:tempAffId.trim()
	            							}
	            							arrayToReturn.push(data)
	            						}
	            						break;
	            					}
	            				}
	            			}
            			}
            		}
            		return arrayToReturn;
            	}
            }

        }
    	}catch(e){
    		console.log(e)
    	}
    }
});

//find type of event and set db names
Meteor.methods({
    'changeDbNameForDraws': async function(tournamentFind,dbsrequired) {
    	try{
    	var tournamentId = tournamentFind;
    	var returnRes = {
    		changeDb:false,
    		changedDbNames:[]
    	};
    	var dbsChanged = [];
    	if(tournamentFind._id == undefined || tournamentFind._id == null){
    		tournamentFind = events.findOne({"_id":tournamentFind})
    		if(tournamentFind==undefined||tournamentFind==null){
                tournamentFind = pastEvents.findOne({
                    "_id": tournamentId
                })

            }
    	}

    	var res = await Meteor.call("subscriptionRestrictionsFind", tournamentFind._id, tournamentFind.eventOrganizer)
    	try {
			if(res){

				if(res.selectionType!=null&&res.selectionType.trim().length!= 0){
					if(res.selectionType.trim().toLowerCase() == "schoolonly"){
						if (dbsrequired.length!=0){
							for(var i=0;i<dbsrequired.length;i++){
								if(dbsrequired[i] == "userDetailsTT"){
									dbsChanged[i] = "schoolPlayers"
								}
								if(dbsrequired[i] == "playerTeamEntries"){
									dbsChanged[i] = "schoolPlayerTeamEntries"
								}
								if(dbsrequired[i] == "playerTeams"){
									dbsChanged[i] = "schoolTeams"
								}
								if(dbsrequired[i] == "playerEntries"){
									dbsChanged[i] = "schoolPlayerEntries"
								}
							}
							returnRes.changeDb = true
							returnRes.changedDbNames = dbsChanged
						}
					}
					else{
						if (dbsrequired.length!=0){
							if(tournamentFind.projectId && tournamentFind.projectId.length){
								for(var i=0;i<dbsrequired.length;i++){
									if(dbsrequired[i] == "userDetailsTT"){
										var s = playerDBFind(tournamentFind.projectId[0])
										if(s){
											dbsChanged[i] = s
										}
										else{
											dbsChanged[i] = "userDetailsTT"
										}
									}
									if(dbsrequired[i] == "playerTeamEntries"){
										dbsChanged[i] = "playerTeamEntries"
									}
									if(dbsrequired[i] == "playerTeams"){
										dbsChanged[i] = "playerTeams"
									}
									if(dbsrequired[i] == "playerEntries"){
										dbsChanged[i] = "playerEntries"
									}
								}
							}
							returnRes.changeDb = true
							returnRes.changedDbNames = dbsChanged
						}
					}
				}

			}
		}catch(e){
		}
		return returnRes
		
		}catch(e){
		}
    }
});