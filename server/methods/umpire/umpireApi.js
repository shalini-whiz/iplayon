Meteor.methods({

	upcomingTournamentsOfUmpire:function(userId)
	{
		try{
			var result = [];
			var json = {};
			var raw = events.rawCollection();
		    var distinct = Meteor.wrapAsync(raw.distinct, raw);
		    var tournamentList =  distinct('tournamentId',{"coachList":{$in:[userId]}});
		    var tournamentInfo = events.find({"_id":{$in:tournamentList},"tournamentEvent":true},{fields:{"_id":1,"eventName":1,"eventStartDate":1,"eventEndDate":1,"domainName":1}}).fetch();
		    json["tournamentList"] = tournamentInfo;
		    var categoriesList = events.aggregate([
		    	{$match:{
		    			"tournamentId":{$in:tournamentList}
		    		}
		    	},
		    	{$group:{
		    		"_id":{"tId":"$tournamentId"},
		    		"tlist":{$addToSet:{"eventID":"$_id",
		    			"eventName":"$eventName"}}


		    	
		    	}},
		    	{$project:{
		    		"categories":"$tlist",
		    		"tournamentId":"$_id.tId",
		    		"_id":1
		    	}},
		    	

		    	])
		    json["categoriesList"] = categoriesList;
		    result.push(json);
		    return json;

		}catch(e){
		}

	},
	umpireSubscriptionApp:function(xData){
		try{
			
			var subscribedDates = [];

			if(xData.subscribedDates)
			{
				for(var m=0;m<xData.subscribedDates.length;m++)
				{
					var from = xData.subscribedDates[m].split("/");
     			 	xxx = moment(new Date(from[2], from[1] - 1, from[0])).format("DD MMM YYYY");
					subscribedDates.push(xxx);
				}
			}


			var umpireEntriesInfo = umpireEntries.findOne({"tournamentId":xData.tournamentId,"umpireId":xData.userId});
			if(umpireEntriesInfo)
			{
				umpireEntries.update({
					"tournamentId":xData.tournamentId,
					"umpireId":xData.userId},
					{$set:{
						"subscribedDates":subscribedDates	
					}}
				)
			}
			else
			{
				
				umpireEntries.insert({
					"tournamentId":xData.tournamentId,
					"umpireId":xData.userId,
					"subscribedDates":subscribedDates})
			}
		}catch(e){


		}
	},
	fetchUmpireSubscriptionApp:function(xData)
	{
		try{

			var resultJson = {};
			var eventList = [];
			var emptyArray = [];
			var subscriptionDetails;

			var raw = umpireEntries.rawCollection();
		    var distinct = Meteor.wrapAsync(raw.distinct, raw);
		    var otherSubscribedDates =  distinct('subscribedDates',{"umpireId":xData.userId,"tournamentId":{$nin:[xData.tournamentId]}});
			var	umpireEntriesList = umpireEntries.aggregate([
					{$match:{
						"tournamentId":{$nin:[xData.tournamentId]},
						"umpireId":xData.userId,
						"subscribedDates":{$exists:true},
						"subscribedDates":{$ne:[]}
						}
					},
					{$group:{
						"_id":null,
						"subscriptionDetails":{$push:{"tournamentId":"$tournamentId","subscribedDates":"$subscribedDates"}},		
						"tournamentArr":{$push:"$tournamentId"},
		
					}},
					{$project:{
						"subscriptionDetails":1,
						"tournamentArr":1,
						"_id":0
						}
					}					
				])
			if(umpireEntriesList.length > 0)
			{
				var tournamentList = umpireEntriesList[0].tournamentArr;
				subscriptionDetails = umpireEntriesList[0].subscriptionDetails;
				eventList = events.aggregate([
					{$match:{
						"_id":{$in:tournamentList},
						"tournamentEvent":true
					}},
					{$project:{
						"_id":1,
						"eventName":1
					}}
				]);

			}


			var umpireEntriesInfo = umpireEntries.findOne({"tournamentId":xData.tournamentId,"umpireId":xData.userId});
			if(umpireEntriesInfo)
			{
				resultJson["status"] = "success";
				resultJson["subscribedDates"] = umpireEntriesInfo.subscribedDates;
				resultJson["subscriptionDetails"] = subscriptionDetails;
				resultJson["tournamentDetails"] = eventList;
				resultJson["otherSubscribedDates"] = otherSubscribedDates;
			}
			else
			{
				var emptyDates = [];
				resultJson["status"] = "failure";
				resultJson["subscribedDates"] = emptyDates;
				resultJson["umpireEntriesList"] = umpireEntriesList;
				resultJson["tournamentDetails"] = eventList;
				resultJson["otherSubscribedDates"] = otherSubscribedDates;
				resultJson["message"] = "entries not found";
			}
			
			return resultJson;
		}catch(e){


		}
	},
	downloadUmpireEntries:function(xData)
	{
		try{
			var resultSet = [];
			var json  = {};
			var umpireEntriesInfo = umpireEntries.find({"tournamentId":xData.tournamentId}).fetch();
			if(umpireEntriesInfo.length > 0)
			{
				for(var i=0; i< umpireEntriesInfo.length;i++)
				{
					var resultJson = {};

					var entryInfo = umpireEntriesInfo[i];
					var umpireName = "";
					var subscribedDates = "";
					if(entryInfo.umpireId)
					{
						var umpireInfo = otherUsers.findOne({"userId":entryInfo.umpireId});
						if(umpireInfo)
							umpireName = umpireInfo.userName;
					}
					if(entryInfo.subscribedDates)
					{
						for(var j =0 ; j<entryInfo.subscribedDates.length;j++)
						{
							if(entryInfo.subscribedDates[j])
							{
								var entryDate = moment(new Date(entryInfo.subscribedDates[j])).format("DD MMM YYYY");
								if(j != 0)
									subscribedDates +="- ";
								subscribedDates += entryDate;
							}
						}                   
					}
					resultJson["umpireName"] = umpireName;
					resultJson["subscribedDates"] = subscribedDates;
					resultSet.push(resultJson);


				}
				json["status"] = "success";
				var csv = Papa.unparse(resultSet,{
					delimiter: "",	// auto-detect
					newline: "",	// auto-detect
					quoteChar: '"',
					escapeChar: '"'
				});
				json["data"] = csv;
				json["message"] = "Entries";

				return json;
			}
			else
			{
				
				json["status"] = "failure";
				json["data"] = [];
				json["message"] = "No Entries";
				return json;
			}

			

		}catch(e){

			json["status"] = "failure";
			json["data"] = [];
			json["message"] = "No Entries";

			return json;

		}
	}

})