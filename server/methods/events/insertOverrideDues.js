Meteor.methods({
	"insertOverrideDues":function(xData){
		check(xData,Object);
		var found = overrideDueTotal.findOne({
			"overrideUserId":xData.overrideUserId,
			"eventOrganizer":xData.eventOrganizer
		});
		if(found==undefined){
			var r = overrideDueTotal.insert({
				"overrideUserId":xData.overrideUserId,
				"eventOrganizer":xData.eventOrganizer,
				"tournamentIds":xData.tournamentIds,
				"overrideDueAmt":xData.overrideDueAmt
			});
			return r;
		}
		else if(found){
			var r = overrideDueTotal.update({"overrideUserId":xData.overrideUserId},{
				$set:{
					"tournamentIds":xData.tournamentIds,
					"overrideDueAmt":xData.overrideDueAmt
				}
			});
			return r
		}
	}
});