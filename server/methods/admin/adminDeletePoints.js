Meteor.methods({


	"deleteOrganizerTourPoints":function(playerUnderTour,tournamentId,sportID,eventName)
	{
		try{
			check(playerUnderTour,Array);
			var tourInfo = pastEvents.findOne({tournamentEvent:true,"_id":tournamentId});
			var eventOrganizer = "";
			if(tourInfo && tourInfo.eventOrganizer)
			{
				eventOrganizer = tourInfo.eventOrganizer;
			}

			if(playerUnderTour.length > 0)
			{
				for(var i=0; i<playerUnderTour.length;i++)
				{
					var playerId = playerUnderTour[i];
					var result = PlayerPoints.update(
		            				{"playerId":playerId,'sportId':sportID,
		            				"organizerId":eventOrganizer,"eventName":eventName,
		            				"eventPoints.tournamentId":tournamentId},
		            				{$set:{"eventPoints.$.tournamentPoints":"0"}});

		            var totalInfo = PlayerPoints.findOne(
	            		{"playerId":playerId,'sportId':sportID,
	            		"eventName":eventName,"organizerId":eventOrganizer},
	            		{fields:{"eventPoints.tournamentPoints":1,"_id":1}});

					if(totalInfo)
					{
					        var tourPointsList = totalInfo.eventPoints;
					        var total="0";
					        for(var x=0; x<tourPointsList.length; x++)
					        {
					            total = parseInt(total)+parseInt(tourPointsList[x].tournamentPoints);
					        }
					        var totalPointsUpdate = PlayerPoints.update(
					            {"playerId":playerId,'sportId':sportID,
					            "organizerId":eventOrganizer,"eventName":eventName},
					            {$set:{"totalPoints":total}});

					}
				}
			}
		}catch(e)
		{
		}
	},
	"deleteExtTourPoints":function(tournamentName,sportID,eventName)
	{
		var eventOrganizer = "";
		var tourList = PlayerPoints.find({'sportId':sportID,"eventName":eventName,
			"eventPoints.tournamentName":tournamentName}).fetch();

		if(tourList.length > 0)
		{
			for(var i=0;i<tourList.length; i++)
			{
				var tourInfo = tourList[i];
			    eventOrganizer = tourList[i].organizerId;
			    var playerId = tourList[i].playerId;
				var result = PlayerPoints.update(
	            				{"playerId":playerId,'sportId':sportID,
	            				"organizerId":eventOrganizer,"eventName":eventName,
	            				"eventPoints.tournamentName":tournamentName},
	            				{$set:{"eventPoints.$.tournamentPoints":"0"}});


	            var totalInfo = PlayerPoints.findOne(
            		{"playerId":playerId,'sportId':sportID,
            		"eventName":eventName,"organizerId":eventOrganizer},
            		{fields:{"eventPoints.tournamentPoints":1,"_id":1}});

	            if(totalInfo)
				{
				        var tourPointsList = totalInfo.eventPoints;
				        var total="0";
				        for(var x=0; x<tourPointsList.length; x++)
				        {
				            total = parseInt(total)+parseInt(tourPointsList[x].tournamentPoints);
				        }
				        var totalPointsUpdate = PlayerPoints.update(
				            {"playerId":playerId,'sportId':sportID,
				            "organizerId":eventOrganizer,"eventName":eventName},
				            {$set:{"totalPoints":total}});
				}
			}
		}	
	}

})