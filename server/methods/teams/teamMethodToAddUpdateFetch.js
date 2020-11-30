import {nameToCollection} from '../dbRequiredRole.js'
import {playerDBFind} from '../dbRequiredRole.js'

Meteor.methods({
	'saveNewTeamData' : function(xData) {
		if(xData)
		{
			try{
				if(xData.source == undefined)
					xData.source = "iPlayon"

				

				var r = playerTeams.insert(xData);
				if(r)
				{
					var managerId = "";
					if(this.userId == undefined)
						managerId = xData.teamManager;
					else
						managerId = this.userId;
					
					

					var userDet = Meteor.users.findOne({"userId":managerId})
					if(userDet&&userDet.role=="Player")
					{
						var userRole = nameToCollection(managerId).findOne({"userId":managerId});
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
						playerTeams.update({"_id":r},{$set:{
							teamAffiliationId:teamAffiliationIdIn
						}})
					}
					return r;
				}
			}catch(e){
				console.log(e)
			}
		}
	}
});

Meteor.methods({
    'whoisTeamMember':function(Id) {
        check(Id,String)
        if(Id){
            var eveOrg;
            var dbn = Meteor.users.findOne({
            	"userId":Id
            })
            if(dbn && dbn.interestedProjectName && dbn.interestedProjectName.length){
            	var dbname = playerDBFind(dbn.interestedProjectName[0]);
            	if(dbname){
            		eveOrg = global[dbname].findOne({"userId":Id});
		            if(eveOrg!=undefined)
		            {
	
		            	return eveOrg;
		            }
		            else return false
            	}
            	else{
            		return false
            	}
            }
            
        }
    }
});


Meteor.methods({
	'updatePlayerTeam' : function(xData,teamId) {


		if(xData){
			try{
				var result = playerTeams.update({
					"_id":teamId,
					teamManager:xData.teamManager
				},{
					$set:{
						teamMembers:xData.teamMembers,
						"teamOwners":xData.teamOwners,
						"teamCoach":xData.teamCoach
					}
				})
				return result;
			}catch(e){
			}
		}
	}
});

Meteor.methods({
	'getTeamFormatDetails' : function(teamFormatId) {
		if(teamFormatId){
			try{
				var teamFormatDetails = teamsFormat.findOne({"_id":teamFormatId});
				return teamFormatDetails;
			}catch(e){
			}
		}
	}
});

Meteor.methods({
	'getTeamNameForIdMethod' : function(teamId) {
		if(teamId){
			try{
				var teamFormatDetails = playerTeams.findOne({"_id":teamId});
				return teamFormatDetails.teamName;
			}catch(e){
			}
		}
	}
});





	