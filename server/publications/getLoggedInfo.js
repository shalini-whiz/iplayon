import {
    playerDBFind
}
from '../methods/dbRequiredRole.js'
//userDetailsTTUsed

Meteor.publish("loggedPlayerInfo",function(playerId)
{	
	var playerInfo = []

	if(playerId){
		var userDet = Meteor.users.findOne({
			userId:playerId
		})
	}
	if(userDet && userDet.interestedProjectName && userDet.interestedProjectName.length){
		var toret = playerDBFind(userDet.interestedProjectName[0])
		if(toret){
			playerInfo = global[toret].find({"userId":playerId});
		}
		else{
			playerInfo = userDetailsTT.find({"userId":playerId});
		}
	}
    if(playerInfo){
        return playerInfo;

    }
})

Meteor.publish('getAssociationDetails', function(associationId) {
	var lData = associationDetails.find({userId:associationId});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('getAcademyDetails', function(clubNameId) {
	var lData = academyDetails.find({userId:clubNameId});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('getLoggedOtherUserDetails', function(userId) {
	var lData = otherUsers.find({userId:userId});
	if (lData) {
		return lData;
	}
	return this.ready();
});