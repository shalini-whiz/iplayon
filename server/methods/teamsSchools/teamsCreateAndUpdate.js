Meteor.methods({
	'saveNewTeamData_ForSchool' : function(xData,managerId,schoolID,source,subscriptionForSchool) {
		if(xData&&managerId){
			try{
				xData.source = source;
				xData.schoolId = schoolID;
				xData.subscriptionForSchool = subscriptionForSchool;
				var userDet = Meteor.users.findOne({"userId":managerId})
				if(userDet&&userDet.role=="Player"){
				var r = false;
				if(schoolTeams.findOne({teamFormatId:xData.teamFormatId,schoolId:schoolID,tournamentId:xData.tournamentId})==undefined){
					r = schoolTeams.insert(xData);
					
				}
				if(r){
					if(userDet&&userDet.role=="Player"){
						var userRole = schoolPlayers.findOne({"userId":managerId});
						var teamAffiliationIdIn;
						var insertedAffId = teamAffiliationId.findOne({"managerId":managerId});
						if(userRole.affiliationId!==null&&userRole.affiliationId!==undefined&&userRole.affiliationId!=="other"){
							if(insertedAffId==undefined){
								teamAffiliationId.insert({"managerId":managerId,teamAffiliationId:"1"});
								teamAffiliationIdIn = userRole.affiliationId+"TM"+"1"
							}
							else{
								var updateCounter = parseInt(insertedAffId.teamAffiliationId)+1
								teamAffiliationId.update({"managerId":managerId},{$set:{
									teamAffiliationId:updateCounter
								}})
								teamAffiliationIdIn = userRole.affiliationId+"TM"+updateCounter+""
							}
						}
						else if(userRole.tempAffiliationId){
							if(insertedAffId==undefined){
								teamAffiliationId.insert({"managerId":managerId,teamAffiliationId:"1"});
								teamAffiliationIdIn = userRole.tempAffiliationId+"TM"+"1"
							}
							else{
								var updateCounter = parseInt(insertedAffId.teamAffiliationId)+1
								teamAffiliationId.update({"managerId":managerId},{$set:{
									teamAffiliationId:updateCounter
								}})
								teamAffiliationIdIn = userRole.tempAffiliationId+"TM"+updateCounter+""
							}
						}
						schoolTeams.update({"_id":r},{$set:{
							teamAffiliationId:teamAffiliationIdIn
						}})
					}
					return r
				}
				if(r==false){
					return "0"
				}
				}
			}catch(e){
			}
		}
	}
});

Meteor.methods({
	'updateNewTeam_ForSchool': function(xData,managerId,schoolID,source,subscriptionForSchool,teamId) {
		if(xData&&managerId){
			try{
				xData.source = source;
				xData.schoolId = schoolID;
				xData.subscriptionForSchool = subscriptionForSchool;
				var userDet = Meteor.users.findOne({"userId":managerId})
				if(userDet&&userDet.role=="Player"){
					var r = false;
					if(schoolTeams.findOne({"_id":teamId})!==undefined){
						r = schoolTeams.update({"_id":teamId},{$set:xData});
						if(r){
							return teamId
						}
					}
					if(r==false){
						return "0"
					}
				}
			}catch(e){
			}
		}
	}
});