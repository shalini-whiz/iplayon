Meteor.methods({


	"fetchEventsOfTournament":function(tournamentId)
	{
		try{

			return events.find({"tournamentId":tournamentId}).fetch();
		}catch(e){

		}
	},

	updateEventSubscription:function(xData)
	{
		try{
			for(var i=0; i<xData.length;i++)
			{
				events.update({"_id":xData[i]._id},{$set:{"allowSubscription":xData[i].allowSubscription}})
			}
			return true;

		}catch(e){
			return false;
		}
	}
})