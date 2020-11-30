/**
 * Meteor Method to update an event for the given data
 * @CollectionName: events call meteor check function to check reference value
 *                  is object
 */
Meteor.methods({
	'updateTeams':function(xData){
		var lData1, lData2;
		check(xData,Object);
		var lEvents = teams.find({"_id":xData.teamId}).fetch();
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
		
		var s = teams.update({"_id":xData.teamId},{$set:{
			"teamOwner":xData.teamOwner,
			"venues":xData.venues,
			"teamMembers":xData.users,
			"teamManager":xData.teamManager,
			"sponsorPdf":xData.sponsorPdf,
			"sponsorLogo":xData.sponsorLogo	
			}
		});
		return s;
	}
	
});
