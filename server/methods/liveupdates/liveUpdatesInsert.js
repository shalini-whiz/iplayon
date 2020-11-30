Meteor.methods({
	'insertLiveUpdates':function(xData){
		check(xData,Object);
		var eventReadStatus = [];
		var j = liveUpdates.findOne({"eventId": xData.eventId});
		//moment.utc().format("h:mm A DD-MM-YYYY")
		eventReadStatus.push({"liveUpdateMessage":xData.liveUpdateMessage,"liveUpdateTime":xData.liveUpdateTime});
		if(j==undefined){
			var ls = liveUpdates.insert({
				"tournamentId":xData.tournamentId,
				"eventId":xData.eventId
			});
		}
		var s= liveUpdates.update({
				"tournamentId":xData.tournamentId,
				"eventId": xData.eventId
		}, 
		{ $push: { liveUpdateMessageTime: { $each:
			 eventReadStatus, "$position": 0  }} }
		);
		//
		return s;

		/*var ls = liveUpdatesSchema.insert({

		});*/
		//return ls;
	}
});