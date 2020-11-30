import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
	'playerPointsUpload': function(xData,paramTourn,tournamentSport) {
		try
		{
			
	        check(xData, Array);
	        var userInfo = Meteor.users.findOne({userId:this.userId});
	        var sportID;
	        var eventName = xData[0].event;
	        var eventOrganizer= this.userId;
	        var eventPoints = xData[0].tournInfo;

	        if(userInfo)
	        {
	        	if(userInfo.interestedProjectName && userInfo.interestedProjectName.length > 0)
	        	{
	        		sportID = userInfo.interestedProjectName[0];
	        	}
	        }
	        sportID = tournamentSport;
	        var organizerEntry = PlayerPoints.findOne({"sportId":sportID,"organizerId":eventOrganizer,"eventName":eventName});
	        var extTournamentCount = 0;
	        var extTournament = [];
	        if(organizerEntry)
	        {
	        	if(organizerEntry.extTournamentCount)
	        	{
	        		extTournamentCount = organizerEntry.extTournamentCount;
	        	}
	        	if(organizerEntry.extTournament)
	        	{
	        		extTournament = organizerEntry.extTournament;
	        	}
	        }

	        for(var i=0; i< xData.length;i++)
	        {
	        	var associationID = "";
	        	var parentAssociationID= "";
	        	var playerId = "";
	        	var eventOrganizer= this.userId;
	        	var userInfo = Meteor.users.findOne({userId:this.userId});
	        	var sportID;
	        	if(userInfo)
	        	{
	        		if(userInfo.interestedProjectName && userInfo.interestedProjectName.length > 0)
	        		{
	        			//sportID = userInfo.interestedProjectName[0];
	        		}
	        	}
	        	var playerName = xData[i].playerName;
	        	var affiliationID = xData[i].affiliationId;
	        	var eventName = xData[i].event;
	        	var eventPoints = xData[i].tournInfo;

	        	var playerInfo = nameToCollection(tournamentSport).findOne({"affiliationId":affiliationID});
	        	if(playerInfo)
	        	{
	        		playerId = playerInfo.userId;
	        		if(playerInfo.associationId)
	        			associationID = playerInfo.associationId;
	        		if(playerInfo.parentAssociationId)
	        			parentAssociationID = playerInfo.parentAssociationId;
	        	}
	        	
	        	
	        	var playerEntry = PlayerPoints.findOne({
      				"playerId":playerId,"sportId":sportID,
      				"organizerId":eventOrganizer,"eventName":eventName});


	        	if(playerEntry)
	        	{
	        		var playerTournEntry   
	        		if(paramTourn == "Other")
					{
						for(var x=0; x<eventPoints.length;x++)
	        			{    
						
      					 	playerTournEntry = PlayerPoints.findOne(
        						{"playerId":playerId,"sportId":sportID,
        						"organizerId":eventOrganizer,"eventName":eventName,
        						"eventPoints.tournamentName":eventPoints[x].tournamentName,
        						"eventPoints.tournamentId":"0"
      						}); 

	      					if(playerTournEntry)
	    					{
	      					
						      	var result = PlayerPoints.update(
	            					{"playerId":playerId,'sportId':sportID,
	            					"organizerId":eventOrganizer,"eventName":eventName,
	            					"eventPoints.tournamentName":eventPoints[x].tournamentName,
	            				    "eventPoints.tournamentId":"0"
									},
	            					{$set:{"eventPoints.$.tournamentPoints":eventPoints[x].tournamentPoints}});
		        			}
		        			else
		        			{
		        				var tourEventPoints = {"tournamentId":eventPoints[x].tournamentId,"tournamentName":eventPoints[x].tournamentName,"tournamentPoints":eventPoints[x].tournamentPoints};
								var result = PlayerPoints.update(
	            					{"playerId":playerId,'sportId':sportID,
	            					"organizerId":eventOrganizer,"eventName":eventName},
	            					{$push:{"eventPoints":tourEventPoints}}); 
		        			}
	        			}
					
					}
					else
					{
						playerTournEntry = PlayerPoints.findOne(
        					{"playerId":playerId,"sportId":sportID,
        					"organizerId":eventOrganizer,"eventName":eventName,
        					"eventPoints.tournamentId":eventPoints[0].tournamentId
      					}); 

      					if(playerTournEntry)
	    				{
	      					
						    var result = PlayerPoints.update(
	            				{"playerId":playerId,'sportId':sportID,
	            				"organizerId":eventOrganizer,"eventName":eventName,
	            				"eventPoints.tournamentId":eventPoints[0].tournamentId},
	            				{$set:{"eventPoints.$.tournamentPoints":eventPoints[0].tournamentPoints}});
		        		}
		        		else
		        		{
		        			var tourEventPoints = {"tournamentId":eventPoints[0].tournamentId,"tournamentName":eventPoints[0].tournamentName,"tournamentPoints":eventPoints[0].tournamentPoints};
							var result = PlayerPoints.update(
	            				{"playerId":playerId,'sportId':sportID,
	            				"organizerId":eventOrganizer,"eventName":eventName},
	            				{$push:{"eventPoints":tourEventPoints}}); 
		        		}
					}
					

					var totalInfo = PlayerPoints.findOne(
            			{"playerId":playerId,'sportId':sportID,
            			"organizerId":eventOrganizer,"eventName":eventName},
            			{fields:{"eventPoints.tournamentPoints":1,"_id":0}});

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
	        	else
	        	{
	        		var total="0";
	        		for(var x=0; x<eventPoints.length;x++)
	        		{          				
            			total = parseInt(total)+parseInt(eventPoints[x].tournamentPoints);
	        		}


	        		var PlayerPointInsert = PlayerPoints.insert({
	          			playerId: playerId, sportId : sportID,playerName: playerName,
	          			associationId:associationID,parentAssociationId:parentAssociationID,
	          			afId:affiliationID,organizerId:eventOrganizer,
	          			eventName:eventName,eventPoints:eventPoints,
	          			totalPoints:total
        			});

	        	}

        	}
        	if(paramTourn == "Other")
			{
				for(var j=0 ; j<eventPoints.length;j++)
				{
					if (!(extTournament.indexOf(eventPoints[j].tournamentName) > -1))
	                {
	                    extTournament.push(eventPoints[j].tournamentName);
	                } 

				}
				extTournamentCount =  parseInt(extTournament.length);
			}

			PlayerPoints.update({
        		sportId : sportID,organizerId:eventOrganizer,
	          	eventName:eventName
        		},
        		{$set:{"extTournamentCount":extTournamentCount,"extTournament":extTournament}},{multi:true});

        	return true;
        }catch(e){

        }
	}
});