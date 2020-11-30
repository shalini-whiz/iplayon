/**
 * Meteor Method to update Meteor User  profile
 * @collectionName : users, upcomingListsReadStatus
 * @dbQuery : update, find, insert
 * @dataType : Object
 * @passedByValues : Meteor.userId(),  interestedDomainName, interestedProjectName,
 *                   profileSettingStatus, userName, phoneNumber, awayToDate, awayFromDate
 * @methodDescription : update all the fields of users for given userId,
 *                      fetch the upcomingListsReadStatus for given userId
 *                      if the length is 0 insert the userId into upcomingListsReadStatus 
 */
Meteor.methods({
	'updateUserProfileSettings': function(xData) {
		check(xData, Object);
		var lUsers = Meteor.users.findOne({
			"_id": xData.userId
		});
		var dateOfBirth = "";
		if(xData.dateOfBirth){
			dateOfBirth = new Date(xData.dateOfBirth)
		}
		var meteorUser = Meteor.users.update({
			"_id": xData.userId
		}, {
			$set: {
				interestedDomainName: xData.interestedDomainName,
				interestedProjectName: xData.interestedProjectName,
				interestedSubDomain1Name: xData.interestedSubDomain1Name,
				interestedSubDomain2Name: xData.interestedSubDomain2Name,
				profileSettingStatus:true,
				userName: xData.userName,
				phoneNumber : xData.phoneNumber,
				//awayToDate : xData.awayToDate,
				emailAddress:xData.emailAddress,
				clubName:xData.clubName,
				nationalAffiliationId:xData.nationalAffiliationId,
				//awayToDate: lAwayToDate,
				dateOfBirth: dateOfBirth,
				year:new Date().getFullYear()
			}
		});
		if(upcomingListsReadStatus.find({"userId":xData.userId}).fetch().length==0){
				upcomingListsReadStatus.insert({"userId":xData.userId});
		    }
		if(meteorUser){
			if(lUsers.role==="Association"){
				Meteor.users.update({associationId: xData.userId}, {$set:{"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName}}, {multi:true});
				associations.update({associationId: xData.userId},{$set:{"associationName":xData.clubName}})
			}
			else if(lUsers.role=="Academy"){
				Meteor.users.update({clubNameId: xData.userId}, {$set:{"clubName":xData.clubName}}, {multi:true});
				try{
					academies.update({academyId: xData.userId},{$set:{"academyName":xData.clubName}})
				}catch(e){
				}
			}
		}
			return meteorUser;
	}
});


/*		if(xData.sponsorPdf===false){
for(var i=0;i<lEvents.length;i++){
	xData.sponsorPdf = lEvents[i].sponsorPdf;
}
}
else if(xData.sponsorPdf!==false){
for(var i=0;i<lEvents.length;i++){
 	eventUploads.remove({"_id":lEvents[i].sponsorPdf});
}
}
if(xData.sponsorLogo===false){
for(var i=0;i<lEvents.length;i++){
	xData.sponsorLogo = lEvents[i].sponsorLogo;
}
}
else if(xData.sponsorLogo!==false){
for(var i=0;i<lEvents.length;i++){
 	eventUploads.remove({"_id":lEvents[i].sponsorLogo});
}
}*/
/*	if(xData.rulesAndRegulations==false){
for(var i=0;i<lEvents.length;i++){
xData.rulesAndRegulations = lEvents[i].rulesAndRegulations
}
}
else if(xData.rulesAndRegulations!==false){
for(var i=0;i<lEvents.length;i++){
	eventUploads.remove({"_id":lEvents[i].rulesAndRegulations});
}
}*/



