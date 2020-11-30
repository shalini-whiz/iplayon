Meteor.methods({
	"dobFilterEntry":function()
	{
		try
		{
			var counter = 0;
			var deleteCounter = 0;
			var message = [];


			var dobTournamentEntry = dobFilterSubscribe.find({tournamentId:null}).fetch();
			message.push("actual past events list tournament null "+dobTournamentEntry.length);

			for(var k=0; k< dobTournamentEntry.length; k++)
			{
				var deleteEntry = dobFilterSubscribe.remove({"_id":dobTournamentEntry[k]._id});
				if(deleteEntry)
					deleteCounter++;
			}
			message.push("removed past events list tournament null "+deleteCounter);

			var pastEventList = pastEvents.find({tournamentEvent:true}).fetch();
			message.push("actual past events list"+pastEventList.length);


			for(var i = 0; i< pastEventList.length; i++)
			{

				var tournamentId = pastEventList[i]._id;
				var eventOrganizer = pastEventList[i].eventOrganizer;

				var checkDobFilterEntry = dobFilterSubscribe.findOne({"eventOrganizer":eventOrganizer,"tournamentId":tournamentId});
				if(checkDobFilterEntry == undefined)
				{
					var dobFiltersInfo =  {"eventOrganizer":eventOrganizer,"mainProjectId":"QvHXDftiwsnc8gyfJ","tournamentId":tournamentId,
						"details":[
						{"eventId":"kslkebduo27N2uux7","dateOfBirth":"01 JAN 2007","gender":"Male","ranking":"yes"},
						{"eventId":"kscge09m1u7N2uux7","dateOfBirth":"01 JAN 2007","gender":"Female","ranking":"yes"},
						{"eventId":"ksHHDWReSe7N2uux7","dateOfBirth":"01 JAN 2005","gender":"Male","ranking":"yes"},
						{"eventId":"AJ5LtgFtStmL6KgsD","dateOfBirth":"01 JAN 2005","gender":"Female","ranking":"yes"},
						{"eventId":"H8NKgBHk6JYrycCvf","dateOfBirth":"01 JAN 2002","gender":"Male","ranking":"yes"},
						{"eventId":"tXpQ4DwgrAfFGR4oj","dateOfBirth":"01 JAN 2002","gender":"Female","ranking":"yes"},
						{"eventId":"nPnrTCix3yAD3TmAz","dateOfBirth":"1 JAN 1999","gender":"Male","ranking":"yes"},
						{"eventId":"arGJsShtr9sjRXwyT","dateOfBirth":"1 JAN 1999","gender":"Female","ranking":"yes"},
						{"eventId":"2XMzYon6GbE9TxmGN","dateOfBirth":"1 JAN 1996","gender":"Female","ranking":"yes"},
						{"eventId":"5ioxxYpoPuox8huWC","dateOfBirth":"1 JAN 1996","gender":"Male","ranking":"yes"},
						{"eventId":"Bn9emodsjqgWEi2pK","dateOfBirth":"1 JAN 1900","gender":"Male","ranking":"yes"},
						{"eventId":"giR4SJEhDJ6mtNGW7","dateOfBirth":"1 JAN 1900","gender":"Female","ranking":"yes"},
						{"eventId":"Sv6rNBU8IaiAozRXE","dateOfBirth":"1 JAN 1900","gender":"All","ranking":"no"},
						{"eventId":"Sv6rQkgf8pH87NbYZ","dateOfBirth":"1 JAN 1900","gender":"All","ranking":"no"},
						{"eventId":"Sv6rQkgf8FiAozRXE","dateOfBirth":"1 JAN 1900","gender":"All","ranking":"no"},
						{"eventId":"pC8uK9wv9KycDEBpE","dateOfBirth":"1 JAN 1900","gender":"All","ranking":"no"},
						{"eventId":"oC8uK9wv9KycDEBkE","dateOfBirth":"1 JAN 1900","gender":"All","ranking":"no"}]}

					var dobInsertEntry = dobFilterSubscribe.insert(dobFiltersInfo);
					if(dobInsertEntry)
						counter++;
				}
			
			}


			message.push("updated players date list"+counter);
			return message;
		}catch(e){
		}
	},
	"generateTmpAfId_Players":function()
	{
		try
		{
			var counter = 0;
			var message = [];
			//userDetailsTTUsed
			var players_WOTempAfId = userDetailsTT.find({"tempAffiliationId":{$in:["null","",null]}}).fetch();
			message.push("actual players without temporary afiliation id "+players_WOTempAfId.length);

			for(var x = 0; x< players_WOTempAfId.length ; x++)
			{
				var tmpAffilationID = "TMP1";
                var tempAffIDInfo = lastInsertedAffId.findOne({"assocId":"Temp"});

                if(tempAffIDInfo)
                {
                    lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                    tmpAffilationID="TMP"+lastInsertedId;
                }
                
                //userDetailsTTUsed
                var tmpAfIdUpdate = userDetailsTT.update({"_id":players_WOTempAfId[x]._id},{$set:{"tempAffiliationId":tmpAffilationID}});

				if(tmpAfIdUpdate)
				{
					counter = parseInt(counter) + 1;
                    var tempAffIDInfo = lastInsertedAffId.findOne({"assocId":"Temp"});
                    if(tempAffIDInfo)
                    {
                    	lastInsertedId_afID = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                        lastInsertedAffId.update({"assocId":"Temp"},{$set:{lastInsertedId:lastInsertedId_afID}});
                    }
                    else
                        lastInsertedAffId.insert({"assocId":"Temp",lastInsertedId:"1"});

				}
			}
			message.push("updated players with temporary afiliation id "+counter);
			return message;

		}catch(e){}
	}
});