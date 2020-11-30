Meteor.methods({
	"tournamentsUpdate_Admin":function()
	{
		try{
			try{
			var info = tournamentEvents.findOne({"_id":"QvHXDftiwsnc8gyfJ"});
			return JSON.stringify(info);

 

		}catch(e)
		{
		}

 

		}catch(e)
		{
		}
	},
	"clearConnections_Admin":function()
	{
		try{
			coachAPPINSentBOX.remove({})
			coachConnectedGroups.remove({})
			connectionRequests.remove({})

			return "Connections cleared";

		}
		catch(e){
		}
		
	},
	"singlePlayerMomentDateUpdate":function()
	{
		try
		{
			var counter = 0;
			var message = [];
			var userDetails = [{ "Sl.No": 1, "dateOfBirth": "2010-06-23T00:00:00.000Z", "emailAddress": "phrabakar7919@gmail.com", "userId": "Se7jRfMXMowM5Jo89", "userName": "Tharun", "_id": "Se7jRfMXMowM5Jo89" }, { "Sl.No": 2, "dateOfBirth": "2005-04-13T00:00:00.000Z", "emailAddress": "mahendrakumar7396@gmail.com", "userId": "kaFv2THJqq9Kmkojz", "userName": "M.Kiruthik yaash", "_id": "kaFv2THJqq9Kmkojz" }, { "Sl.No": 3, "dateOfBirth": "2003-03-09T00:00:00.000Z", "emailAddress": "", "userId": "dsy6LF2848AkotdNJ", "userName": "Isha R", "_id": "dsy6LF2848AkotdNJ" }, { "Sl.No": 4, "dateOfBirth": "2001-08-27T00:00:00.000Z", "emailAddress": "", "userId": "u9wk5E3kFXyoJELDT", "userName": "Anuramaa R", "_id": "u9wk5E3kFXyoJELDT" }, { "Sl.No": 5, "dateOfBirth": "2000-01-07T00:00:00.000Z", "emailAddress": "", "userId": "29QYcFXLKYBDu8zbY", "userName": "Bhargavi R", "_id": "29QYcFXLKYBDu8zbY"}];
			message.push("actual players date list"+userDetails.length);
			for(var i=0; i<userDetails.length; i++)
			{
				var userInfo  = userDetails[i];
				if(userInfo.dateOfBirth != "" && userInfo.dateOfBirth.trim().length > 0)
				{
					var momentDate = moment(new Date(userInfo.dateOfBirth)).format("YYYY-MM-DD");
					//userDetailsTTUsed
					var playerDateUpdate = userDetailsTT.update({"userId":userInfo.userId},{$set:{
						dateOfBirth:momentDate,year:new Date().getFullYear(),
					}});
					if(playerDateUpdate)
						counter = parseInt(counter)+1;
				}				

			}
			message.push("updated players date list"+counter);
			return message;
		}catch(e){
		}
	},
	"multiPlayerMomentDateUpdate":function()
	{
		try
		{

			var userDetails = []
			var counter = 0;
			var message = [];
			message.push("actual players date list"+userDetails.length);

			for(var i=0; i<userDetails.length; i++)
			{
				var userInfo  = userDetails[i];
				if(userInfo.dateOfBirth != "" && userInfo.dateOfBirth.trim().length > 0)
				{
					var momentDate = moment(new Date(userInfo.dateOfBirth)).format("YYYY-MM-DD");
					var multiPlayerUpdate = userDetailsTT.update({"userId":userInfo.userId},{$set:{
						dateOfBirth:momentDate,year:new Date().getFullYear()
					}});
					if(multiPlayerUpdate)
						counter = parseInt(counter)+1;
				}				

			}
			message.push("updated players date list"+counter);
			return message;
			
		}catch(e){
		}
	},

	"regAssocUpdate":function(dataID){
		try{
			var defaultAssociationId = "";
			var assocInfo = Meteor.users.findOne({"userId":dataID});
			if(assocInfo)
			{
				/*defaultAssociationId = assocInfo.userId;
				var regApprovalStatus = registrationApproval.update({},{$set:{"associationId":defaultAssociationId}},{multi:true});
				var regTransStatus = registrationTransaction.update({},{$set:{"associationId":defaultAssociationId}},{multi:true});
				var userRes = userDetailsTT.update({"associationId":defaultAssociationId},{$set:{"guardianName":""}},{multi:true})
				console.log("userRes .. "+userRes)
				if(regApprovalStatus && regTransStatus)
					return "association id of registered "+ regTransStatus+"players updated ";
				*/
			}

		}catch(e){
			console.log(e)
		}
	},
	"playerGenderUpdate":function()
	{
		try
		{
			var counter_male = 0;
			var counter_female = 0;
			var message = [];
			//userDetailsTTUsed
			var userDetails_male = userDetailsTT.find({"gender":"male"}).fetch();
			var userDetails_female = userDetailsTT.find({"gender":"female"}).fetch();

			message.push("actual players : male - "+userDetails_male.length+" .. "+"female - "+userDetails_female.length);
			//userDetailsTTUsed
			counter_male = userDetailsTT.update({"gender":"male"},{$set:{"gender":"Male"}},{multi:true});
			counter_female = userDetailsTT.update({"gender":"female"},{$set:{"gender":"Female"}},{multi:true});

			message.push("updated players : male - "+counter_male+" .. "+"female - "+counter_female);
			return message;
		}catch(e){
		}
	},
	"otherUserGenderUpdate":function()
	{
		try
		{
			var counter_male = 0;
			var counter_female = 0;
			var message = [];
			var userDetails_male = otherUsers.find({"gender":"male"}).fetch();
			var userDetails_female = otherUsers.find({"gender":"female"}).fetch();

			message.push("actual other users : male - "+userDetails_male.length+" .. "+"female - "+userDetails_female.length);
			counter_male = otherUsers.update({"gender":"male"},{$set:{"gender":"Male"}},{multi:true});
			counter_female = otherUsers.update({"gender":"female"},{$set:{"gender":"Female"}},{multi:true});

			message.push("updated other users : male - "+counter_male+" .. "+"female - "+counter_female);
			return message;
		}catch(e){
		}
	},
	"generateEntryTransaction":function(e){

		try{
			var result = [];
			var payTransList = paymentTransaction.find({}).fetch();
			for(var i =0; i< payTransList.length; i++)
			{
				var transactionType = "payment";
				if(payTransList[i].transactionType == "transaction")
					transactionType = "payment";

				var entryInfo = playerEntries.findOne({
					"tournamentId":payTransList[i].tournamentId,
					"playerId":payTransList[i].playerId
				})
				var totalFee = "0";
				if(entryInfo  && entryInfo.totalFee)
					totalFee = entryInfo.totalFee

				var entryTransInfo = entryTransaction.findOne({
					"tournamentId":payTransList[i].tournamentId,
					"playerId":payTransList[i].playerId
				});

				var tourInfo = events.findOne({"_id":payTransList[i].tournamentId});
				var subID = [];
				if(tourInfo)
				{
					var subEvents = events.aggregate([
						{$match:{
							"tournamentId":payTransList[i].tournamentId,
							"tournamentEvent":false,
							"eventParticipants":{$in:[payTransList[i].playerId]}
						}},
						{$group:{"_id":null,
							subscribedEvents:{$push:"$_id"}
						}}
					])
					if(subEvents && subEvents.length > 0 && subEvents[0] && subEvents[0].subscribedEvents)
					{
						subID = subEvents[0].subscribedEvents;
					}
					
				}
				else
				{
					tourInfo = pastEvents.findOne({"_id":payTransList[i].tournamentId});
					if(tourInfo)
					{
						var subEvents = pastEvents.aggregate([
							{$match:{
								"tournamentId":payTransList[i].tournamentId,
								"tournamentEvent":false,
								"eventParticipants":{$in:[payTransList[i].playerId]}
							}},
							{$group:{"_id":null,
								subscribedEvents:{$push:"$_id"}
							}}
						])
						if(subEvents && subEvents.length > 0 && subEvents[0] && subEvents[0].subscribedEvents)
						{
							subID = subEvents[0].subscribedEvents;
						}
					}
					
				}



				if(tourInfo)
				{
					if(entryTransInfo)
					{
						

						entryTransaction.remove({
							"tournamentId":payTransList[i].tournamentId,
	                        "playerId":payTransList[i].playerId
						})
						entryTransaction.insert({
							"tournamentId":payTransList[i].tournamentId,
	                        "playerId":payTransList[i].playerId,
	                        "transactionId":payTransList[i].transactionId,
		                    "subscribedEvents":subID,
		                    "paid":totalFee,
		                    "refund":"0",
		                    "transactionType":transactionType,
		                    "transactionDate":payTransList[i].transactionDate                                          
						});
						

					}
					else
					{
						entryTransaction.insert({
							"tournamentId":payTransList[i].tournamentId,
	                        "playerId":payTransList[i].playerId,
	                        "transactionId":payTransList[i].transactionId,
		                    "subscribedEvents":subID,
		                    "paid":totalFee,
		                    "refund":"0",
		                    "transactionType":transactionType,
		                    "transactionDate":payTransList[i].transactionDate                                          
						});
					}
				}
			}
			var raw = paymentTransaction.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var tourList =  distinct('tournamentId');

  			for(var k = 0; k < tourList.length ; k++)
      		{
      		    var playerList = distinct('playerId',{tournamentId:tourList[k]});
      			var entryList = entryTransaction.find({"tournamentId":tourList[k]}).fetch();
      			result.push("Player Transaction : "+tourList[k]+" : "+playerList.length+" : "+entryList.length)
      		}

      		return result;
		}catch(e){
			errorLog(e)
			return e
		}
	}
	
	

});