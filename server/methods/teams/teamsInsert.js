/**
 * Meteor Method to insert an event for the given data
 * 
 * @CollectionName: events call meteor check function to check reference value
 *                  is object
 */
Meteor.methods({
	'insertTeams':function(xData){

		check(xData,Object);
		var ls = teams.insert({
			"teamName":xData.teamName,
			"projectName":xData.projectName,
			"teamOwner":xData.teamOwner,
			"venues":xData.venues,
			"teamMembers":xData.users,
			"teamManager":xData.teamManager,
			"sponsorPdf":xData.sponsorPdf,
			"sponsorLogo":xData.sponsorLogo
			/**"mainTag":xData.mainTag,
			"secondaryTag":xData.secondaryTag**/
		});
		return ls;
	}
	
});