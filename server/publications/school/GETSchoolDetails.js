
 Meteor.publish('GETSchoolDetails', function() {
	var lData = schoolDetails.find({},{fields:{schoolName:1,userId:1}});
	if (lData) {
		return lData;
	}
	return this.ready();
});

  Meteor.publish('GETSchoolPlayerDEtails', function() {
	var lData = schoolPlayers.find({},{fields:{schoolId:1,userId:1,tempAffiliationId:1,userName:1}});
	if (lData) {
		return lData;
	}
	return this.ready();
});