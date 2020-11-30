/****** admin api uses **********/

Meteor.methods({
	/*"playersCountSubAggre_temp":function(userId){
        try{
            var loggedIn = Meteor.users.findOne({
                "_id": userId
            })

            var query = {}
            var toret = false

            if (loggedIn && loggedIn.userId) {
                if (loggedIn.role && (loggedIn.role == "Association") && 
                loggedIn.associationType == "State/Province/County" 
                && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0) {
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "$or": [{
                            "associationId": loggedIn.userId
                        }, {
                            "parentAssociationId": loggedIn.userId,
                        }],
                      
                    }
                }
                else if(loggedIn.role && loggedIn.role == "Academy" && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0){
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "clubNameId": loggedIn.userId
                    }
                }
                else if(loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City"
                    && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0){
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "associationId": loggedIn.userId
                    }
                }

                if(toret){
                    var count = global[toret].aggregate([{
                        $match: query
                    }, {
                        $count: "userId"
                    }])

                    if(count && count[0] && count[0].userId){
                        return count[0].userId
                    }
                    else if(count && count.userId){
                        return count.userId
                    }
                }
                else{
                    return 0
                }
            }
            
            return 0
        }catch(e){
        	return e;
        }
    },
    rankFilters_temp: function(playerID) {
        try {
            var userInfo = Meteor.users.findOne({
                "userId": playerID
            });
            var jsonS = {};

            if (userInfo != undefined) {

                var sportsUniq = tournamentEvents.aggregate([

                    {
                        $unwind: "$projectSubName"
                    }, {
                        $match: {
                            "projectSubName.projectType": {
                                $nin: ["2"]
                            }
                        }
                    },

                    {
                        $group: {
                            "_id": {
                                "sportId": "$_id",
                                "projectMainName": "$projectMainName"
                            },
                            "events": {
                                $addToSet: "$projectSubName.projectName"
                            },
                        }
                    }, {
                        $project: {
                            "sportID": "$_id.sportId",
                            "sport": "$_id.projectMainName",
                            "events": 1,
                            "_id": 0
                        }
                    }

                ]);


                var organizerUniq = PlayerPoints.aggregate([{
                        $group: {
                            "_id": {
                                "organizerId": "$organizerId",
                                "sportId": "$sportId"
                            },

                        }
                    }, {
                        $project: {
                            "organizerId": "$_id.organizerId",
                            "sportId": "$_id.sportId",
                            "_id": 0
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "organizerId",
                            foreignField: "userId",
                            as: "userDetails"
                        }
                    }, {
                        $unwind: "$userDetails"
                    }, {
                        $project: {
                            "organizerId": 1,
                            "sportId": 1,
                            "organizerName": "$userDetails.userName",
                        }
                    }

                ]);

                jsonS["sports"] = sportsUniq;
                jsonS["organizer"] = organizerUniq;

            }
            return jsonS;
        } catch (e) {
        	return e;
        }
    },*/
    "adminTourFinanceStatus": async function(data) {
        try {
        	var dbsrequiredINdFEE = ["playerEntries","userDetailsTT"]
			var playerEntriesINdFEE = "playerEntries";

			var res = await Meteor.call("changeDbNameForDraws", data._id,dbsrequiredINdFEE);
            if(res)
            {
                if(res.changeDb && res.changeDb == true){
                    if(res.changedDbNames.length!=0){
                        playerEntriesINdFEE = res.changedDbNames[0];
                    }
                }
            }

            var x = global[playerEntriesINdFEE].update({
                "tournamentId": data._id
            }, {
                $set: {
                    "paidOrNot": true
                }
            },{multi:true});
            return true;
        } catch (e) {
            return false
        }
    },
	"deleteApiUser":function(data)
	{
		try{

			var result = apiUsers.remove({"_id":data});
			if(result)
				return "API User Removed";
			else
				return "Could not remove API User"
			
		}catch(e){

		}
	},
	"updatePageToken":function(data)
	{
		try{
			if(data && data.pageToken)
			{
				var updateJson = {};
				if(data.pageToken)
					updateJson["pageToken"] = data.pageToken;
				if(data.twitterKeys)
					updateJson["tweetKeys"] = data.twitterKeys;
				if(data.siteImg)
					updateJson["siteImg"] = data.siteImg;
				
				if(data.linkedInKeys)
				{
					var keyExists = customDataDB.findOne({"type" : "linkedInKeys"});
					if(keyExists && keyExists.customValue)
					{
						data.linkedInKeys["accessToken"] = keyExists.customValue;
					}
					updateJson["linkedInKeys"] = data.linkedInKeys
				}
				var result = apiUsers.update({"_id":data.id},{$set:updateJson});
				if(result)
				{
					return "Page token updated";
				}
				else
				{
					return "Could not update page token";
				}
			}
			else
			{
				return "Invalid params";
			}

		}catch(e){
		}
	}
})
/****************************** event schedule ********************************/

Meteor.methods({

	"createEventSchedule":function(data){
		try{
			var resultJson = {};
			var message = "";
			data.scheduleDate = moment(new Date(data.scheduleDate)).format("DD MMM YYYY");

			var categoryInfo = events.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName});
			if(categoryInfo == undefined)
			{
				categoryInfo = pastEvents.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName});
			}

			var abbName = data.eventName;
			if(categoryInfo && categoryInfo.abbName)
				abbName = categoryInfo.abbName;

					
		

			if(data.type == "create")
			{
				var result = eventSchedule.insert({
					"tournamentId":data.tournamentId,
					"eventName":abbName,
					"scheduleDate":data.scheduleDate,
					"startTime":data.startTime,"endTime":data.endTime,
					"roundNo":data.roundNo
				});
				if(result)
					message = "Event schedule created";
				else
					message = "Could not create event schedule";
			}
			else if(data.type == "modify")
			{
				var result = eventSchedule.update({"_id":data._id},
					{$set:{
						"scheduleDate":data.scheduleDate,"startTime":data.startTime,
						"endTime":data.endTime,"roundNo":data.roundNo}})
				if(result)
					message = "Event Schedule modifed";
				else
					message = "could not modify event schedule"

			}
			

			

			

			resultJson["message"] = message;
			return resultJson
			
		}catch(e){
			errorLog(e)
			var failureJson = {};
			failureJson["message"] = e;
			return failureJson;
		}
	},
	"deleteEventSchedule":function(data)
	{
		try{
			var result = eventSchedule.remove({"_id":data});
			if(result)
				return "Event schedule Removed";
			else
				return "Could not remove event schedule"
			

		}catch(e){

		}
	}
})






/**************** event schedule ends here ***************************/
/****************************** team schedule *********************************/



Meteor.methods({

	"createTeamSchedule":function(data){
		try{
			var resultJson = {};
			var message = "";
			data.scheduleDate = moment(new Date(data.scheduleDate)).format("DD MMM YYYY");


			var teamPointExists = tourTeamSchedule.findOne({"teamAId":data.teamAId,
				"teamBId":data.teamBId,
				"tournamentId":data.tournamentId});
			if(teamPointExists)
			{
				if(data.type == "create")
					message = "Already team schedule exists"
				else if(data.type == "modify")
				{
					var result = tourTeamSchedule.update({"_id":data._id},
						{$set:{
						"teamAId":data.teamAId,"teamBId":data.teamBId,
						"scheduleDate":data.scheduleDate,"startTime":data.startTime,
						"endTime":data.endTime,"tableNo":data.tableNo}})
					if(result)
						message = "Team Schedule modifed";
					else
						message = "could not modify team schedule"

				}
			}
			else
			{
				var result = tourTeamSchedule.insert({
					"tournamentId":data.tournamentId,
					"teamAId":data.teamAId,"teamBId":data.teamBId,
					"scheduleDate":data.scheduleDate,
					"startTime":data.startTime,"endTime":data.endTime,
					"tableNo":data.tableNo
				});
				if(result)
					message = "Team schedule created";
				else
					message = "Could not create team schedule";
			}

			resultJson["message"] = message;
			return resultJson
			
		}catch(e){
			errorLog(e)
			var failureJson = {};
			failureJson["message"] = e;
			return failureJson;
		}
	},
	"deleteTeamSchedule":function(data)
	{
		try{
			var result = tourTeamSchedule.remove({"_id":data});
			if(result)
				return "Team schedule Removed";
			else
				return "Could not remove team schedule"
			

		}catch(e){

		}
	}
})



/******************************************************************************/
/****************************** team points ***********************************/

/********* registration validity *********/
Meteor.methods({

	"createTeamPoints":function(data){
		try{
			var resultJson = {};
			var message = "";

			var teamPointExists = teamPoints.findOne({"teamId":data.teamId,
				"year":parseInt(data.year),"tournamentId":data.tournamentId});
			if(teamPointExists)
			{
				if(data.type == "create")
					message = "Already team points exists"
				else if(data.type == "modify")
				{
					var result = teamPoints.update({"_id":data._id},
						{$set:{"played":data.played,"won":data.won,
						"loss":data.won,"points":data.points}})
					if(result)
						message = "Team Points modifed";
					else
						message = "could not modify team points"

				}
			}
			else
			{
				var result = teamPoints.insert({
					"tournamentId":data.tournamentId,
					"teamId":data.teamId,"year":data.year,
					"played":data.played,"won":data.won,"loss":data.loss,
					"points":data.points});
				if(result)
					message = "Team Points created";
				else
					message = "Could not create team points";
			}

			resultJson["message"] = message;
			return resultJson
			
		}catch(e){
			errorLog(e)
			var failureJson = {};
			failureJson["message"] = e;
			return failureJson;
		}
	},
	"deleteTeamPoints":function(data)
	{
		try{
			var result = teamPoints.remove({"_id":data});
			if(result)
				return "Team points Removed";
			else
				return "Could not remove team points"
			

		}catch(e){

		}
	},

})



/********************************************************************************/



/********* registration validity *********/
Meteor.methods({

	"createRegValidity":function(data){
		try{
			var resultJson = {};
			var message = "";
			data.validity = moment(new Date(data.validity)).format("DD MMM YYYY");

			var vaildityExists = registrationValidity.findOne({"userId":data.userId,"year":parseInt(data.year)});
			if(vaildityExists)
			{
				if(data.type == "create")
					message = "Already registrationValidity exists"
				else if(data.type == "modify")
				{
					var result = registrationValidity.update({"_id":data._id},{$set:{"validity":data.validity}})
					if(result)
						message = "Registration validity modifed";
					else
						message = "could not modify registration validity"

				}
			}
			else
			{
				var result = registrationValidity.insert({"userId":data.userId,"year":data.year,"validity":data.validity});
				if(result)
					message = "Registration validity created";
				else
					message = "Could not create registration validity";
			}

			resultJson["message"] = message;
			return resultJson
			
		}catch(e){
			var failureJson = {};
			failureJson["message"] = e;
			return failureJson;
		}
	},
	"deleteRegValidity":function(data)
	{
		try{
			var result = registrationValidity.remove({"_id":data});
			if(result)
				return "Registration Validity Removed";
			else
				return "Could not remove registration validity"
			

		}catch(e){

		}
	}
})



/***********************************



/*** admin expertise ******/
Meteor.methods({

	"createExpertise":function(data)
	{
		try{
			if(data.expertiseName)
			{
				var result = expertise.insert({"expertise":data.expertiseName});
				if(result)
					return "Expertise created";
				else
					return "Could not create expertise";
			}	
			else
				return "Invalid data";
		}catch(e){
			return e;
		}
	},
	"editExpertise":function(data)
	{
		try{
			if(data._id && data.expertiseName)
			{
				var expertiseExist = expertise.findOne({"_id":data._id});
				if(expertiseExist)
				{
					var expertiseUsed = otherUsers.find({"expertise":{$in:[data._id]}}).fetch();
					if(expertiseUsed.length > 0)
					{
						return "Cannot be modifed as subscribers exist"
					}
					else
					{
						var result = expertise.update({"_id":data._id},{$set:{
							"expertise":data.expertiseName
						}})
						if(result)
							return "Successfully updated";
						else
							return "Could not update";
					}
				}
				else
					return "Invalid expertise";
			}
			else
			{
				return "Invalid data";
			}
		}catch(e)
		{
			return e
		}
	},
	"deleteExpertise":function(data)
	{
		try{

			var expertiseUsed = otherUsers.find({"expertise":{$in:[data]}}).fetch();
			if(expertiseUsed.length > 0)
			{
				return "Cannot be deleted as subscribers exist"
			}
			else
			{
				var result = expertise.remove({"_id":data});
				if(result)
					return "Expertise Removed";
				else
					return "Could not remove expertise"
			}

		}catch(e){

		}
	}
})

/*** language expertise ******/
Meteor.methods({
	"createLanguage":function(data)
	{
		try{
			if(data.languageName)
			{
				var result = languages.insert({"language":data.languageName});
				if(result)
					return "Language created";
				else
					return "Could not create language";
			}	
			else
				return "Invalid data";
		}catch(e){
			return e;
		}
	},
	"editLanguage":function(data)
	{
		try{
			if(data._id && data.languageName)
			{
				var languageExist = languages.findOne({"_id":data._id});
				if(languageExist)
				{
					var languageUsed = otherUsers.find({"languages":{$in:[data._id]}}).fetch();
					if(languageUsed.length > 0)
					{
						return "Cannot be modifed as subscribers exist"
					}
					else
					{
						var result = languages.update({"_id":data._id},{$set:{
							"language":data.languageName
						}})
						if(result)
							return "Successfully updated";
						else
							return "Could not update";
					}
				}
				else
					return "Invalid language";
			}
			else
			{
				return "Invalid data";
			}
		}catch(e)
		{
			return e
		}
	},
	"deleteLanguage":function(data)
	{
		try{

			var languageUsed = otherUsers.find({"languages":{$in:[data]}}).fetch();
			if(languageUsed.length > 0)
			{
				return "Cannot be deleted as subscribers exist"
			}
			else
			{
				var result = languages.remove({"_id":data});
				if(result)
					return "Language Removed";
				else
					return "Could not remove language"
			}

		}catch(e){
			return e
		}
	}
})


/*** language expertise ******/
Meteor.methods({
	"createCertification":function(data)
	{
		try{
			if(data.certificationName && data.sportId)
			{
				var result = certification.insert({ "sportId" : data.sportId, "certification" :data.certificationName});
				if(result)
					return "Certification created";
				else
					return "Could not create certification";
			}	
			else
				return "Invalid data";
		}catch(e){
			return e;
		}
	},
	"editCertification":function(data)
	{
		try{
			if(data._id && data.certificationName && data.sportId)
			{
				var certificationExist = certification.findOne({"_id":data._id});
				if(certificationExist)
				{
					var certificationUsed = otherUsers.find({"certifications":{$in:[data._id]}}).fetch();
					if(certificationUsed.length > 0)
					{
						return "Cannot be modifed as subscribers exist"
					}
					else
					{
						var result = certification.update({"_id":data._id},{$set:{
							"certification":data.certificationName,
							"sportId":data.sportId
						}})
						if(result)
							return "Successfully updated";
						else
							return "Could not update";
					}
				}
				else
					return "Invalid certification";
			}
			else
			{
				return "Invalid data";
			}
		}catch(e)
		{
			return e
		}
	},
	"deleteCertification":function(data)
	{
		try{

			var certificationUsed = otherUsers.find({"certifications":{$in:[data]}}).fetch();
			if(certificationUsed.length > 0)
			{
				return "Cannot be deleted as subscribers exist"
			}
			else
			{
				var result = certification.remove({"_id":data});
				if(result)
					return "Certification Removed";
				else
					return "Could not remove certification"
			}

		}catch(e){
			return e
		}
	}
})


/***** custom account type ********/
Meteor.methods({
	"addAccountType":function(data)
	{
		var accTypeExists = customDataDB.findOne({"type" : "accountType"})
		if(accTypeExists)
		{
			var result = customDataDB.update({
				"type":"accountType"},
				{$addToSet:{
					"customData":
					data}
				});
			if(result)
				return "New Account Type created";
			else
				return "Could not create new account type"
		}
		else
		{
			var result = customDataDB.insert(
				{"type":"accountType",customData:[data]})
			if(result)
				return "New Account Type created";
			else
				return "Could not create new account type"
		}
	},
	"removeAccountType":function(data)
	{
		try{
			var accTypeUsed = accountDetails.find({"accType":data}).fetch();
			if(accTypeUsed.length > 0)
			{
				return "Cannot be removed as subscribers exist"
			}
			else
			{
				var result = customDataDB.update({
				"type":"accountType"},
				{$pull:{
					"customData":
					data}
				});
				if(result)
					return "Account Type removed";
				else
					return "Could not remove  account type"
			}
		}catch(e){

		}
	}
})

/******* custom national identity *********/
/***** custom account type ********/
Meteor.methods({
	"addNA":function(data)
	{
		try{
		var recordExists = customDataDB.findOne({
				"type":"nationalIdentity",
				"customKeyData.country":data.countryName});

		if(recordExists)
		{
			var dataJson = {};
			dataJson["key"] = data.identityName;
			dataJson["mandatory"] = data.mandVal;


		
			var result = customDataDB.update({
				"type":"nationalIdentity",
				"customKeyData": {
                    $elemMatch: {
                        country: data.countryName
                    }
                }},
				{$addToSet:{
					"customKeyData.$.valueSet":dataJson
				}})
			if(result)
				return "National Identity added";
			else
				return "Could not add national identity"
		}
		else
		{
			var identityExists = customDataDB.findOne({"type":"nationalIdentity"});

			var dataJson = {};
			dataJson["country"] = data.countryName;
			dataJson["valueSet"] = [
			{"key":data.identityName,"mandatory":data.mandVal}];

			var result = "";
			if(identityExists)
			{
				var result = customDataDB.update({
				"type":"nationalIdentity"},
				{$addToSet:{
					"customKeyData":
					dataJson}
				});
			}
			else
			{
				result = customDataDB.insert(
				{"type":"nationalIdentity",customKeyData:[dataJson]})
			}

			
			if(result)
				return "New National Identity created";
			else
				return "Could not create new national identity"
		}
	}catch(e)
	{
		return e;
	}
	},
	"removeNA":function(data)
	{
		try{

			var recordExists = customDataDB.findOne({
				"type":"nationalIdentity",
				"customKeyData.country":data.countryName});

			if(recordExists)
			{

				
  				var raw = accountDetails.rawCollection();
				var distinct = Meteor.wrapAsync(raw.distinct, raw);
				var userIds =  distinct('userId',{			
					"nationalIdentities.key":data.identityName});


				var userExist = otherUsers.find({
					"country":data.countryName,
					"userId":{$in:userIds}
				}).fetch();

				if(userExist && userExist.length > 0)
				{
					return "Cannot be removed as subscribers exist"
				}
				else
				{
					var temp = {};
					temp["key"] = data.identityName;

				

					var result = customDataDB.update({
						"type":"nationalIdentity",
						"customKeyData": {
		                    $elemMatch: {
		                        country: data.countryName
		                    }
		                }},
					{$pull:{
						"customKeyData.$.valueSet":temp
					}})
					if(result)
						return data.countryName+" identity "+data.identityName+" removed";
					else
						return "Could not remove "+data.identityName;

				}
			}
			else
			{
				return "Invalid data";
			}

			
		}catch(e){
			return e;
		}
	},
	"setLinkedInKeys":function(data)
	{
		try{
			if(data.customValue)
			{
				var keyExists = customDataDB.findOne({"type" : "linkedInKeys"});
				if(keyExists)
				{
					var result = customDataDB.update({"type" : "linkedInKeys"},{$set:{"customValue":data.customValue}});
					if(result)
						return "LinkedIn Access Token Modified";
					else
						return "Could not update linkedIn Access Token!!";
				}
				else
				{
					var result = customDataDB.insert({"type" : "linkedInKeys","customValue":data.customValue});
					if(result)
						return "LinkedIn Access Token set!!";
					else
						return "Could not set linked access token !!";
				}
			}
			

		}catch(e){

		}
	},
	"removePoints_TourEvent":function(data)
	{
		try{

			var recordExists = PlayerPoints.find({
				"organizerId":data.organizerId,
				"eventName":data.eventName}).fetch();
			if(recordExists && recordExists.length > 0)
			{

				var result = PlayerPoints.remove({
						"organizerId":data.organizerId,
						"eventName":data.eventName
		                }
					)
					if(result)
						return data.eventName+" "+recordExists.length+" player points removed ";
					else
						return "Could not remove player points";

			}
			
			else
			{
				return "could not remove player points";
			}

			
		}catch(e){
			return e;
		}
	}
})



/************************** round robin order of play ****************/
/*** admin expertise ******/
Meteor.methods({

	"createRROrder":function(data)
	{
		try{
			if(data.groupSize && data.playOrder && data.indexSet)
			{
				var result = undefined;
				var dataExists = customDataDB.findOne({
					"type":"RROrderOfPlay",
				});
				if(dataExists)
				{
					var checkEntry = customDataDB.findOne({
						"type":"RROrderOfPlay",
						"customKeyValueData": {
			                        $elemMatch: {
			                            "keySet": data.groupSize,
			                            "indexSet":data.indexSet
			                        }}

					});
					if(checkEntry)
					{
						
						return "Data already exists";
					}
					else
					{
						var order = data.playOrder;
	        			var arrOfStr = order.split(","); 
						var paramData = {};
						paramData["keySet"] = data.groupSize;
						paramData["indexSet"] = data.indexSet;
						paramData["valueSet"] = arrOfStr;

						
						var result = customDataDB.update({
							"type":"RROrderOfPlay"},
							{
								$addToSet:{
									"customKeyValueData":paramData
								}
							}
						)
		
						if(result)
							return "Order Of Play created";
						else
							return "Could not create order of play";
					}
				}
				else
				{
					
					var order = data.playOrder;
        			var arrOfStr = order.split(","); 
					var paramData = {};
					paramData["keySet"] = data.groupSize;
					paramData["indexSet"] = data.indexSet;
					paramData["valueSet"] = arrOfStr;

					
					var result = customDataDB.insert({
						"type":"RROrderOfPlay",
						"customKeyValueData":[paramData]
					})
		
					if(result)
						return "Order Of Play created";
					else
						return "Could not create order of play";
					
				}
				
			}	
			else
				return "Invalid data";
		}catch(e){
			return e;
		}
	},
	"editRROrder":function(data)
	{
		try{
			if(data.groupSize && data.playOrder && data.indexSet)
			{
				var dataExists = customDataDB.findOne({"type":"RROrderOfPlay"});
				if(dataExists)
				{

					var dataExists =  customDataDB.findOne({
						"type":"RROrderOfPlay",						
						"customKeyValueData": {
			                        $elemMatch: {
			                            "keySet": data.groupSize,
			                            "indexSet":data.indexSet
			                        }}
					})


					

					if(dataExists)
					{
						var entryExists = customDataDB.findOne({
							"type":"RROrderOfPlay",						
							"customKeyValueData": {
			                        $elemMatch: {
			                            "keySet": data.groupSize,
			                            "indexSet":data.indexSet
			                        }}
						})
						if(entryExists)
						{
							var order = data.playOrder;
		        			var arrOfStr = order.split(","); 

							var result = customDataDB.update({
								"type":"RROrderOfPlay",						
								"customKeyValueData": {
			                        $elemMatch: {
			                            "keySet": data.groupSize,
			                            "indexSet":data.indexSet
			                        }}},
								{$set:{
									"customKeyValueData.$.valueSet":arrOfStr							
							}});
							if(result)
								return "Successfully updated";
							else
								return "Could not update";
						}
						else
						{
							var order = data.playOrder;
		        			var arrOfStr = order.split(","); 
							var paramData = {};
							paramData["keySet"] = data.groupSize;
							paramData["indexSet"] = data.indexSet;
							paramData["valueSet"] = arrOfStr;

							
							var result = customDataDB.update({
								"type":"RROrderOfPlay"},
								{$addToSet:{
									"customKeyValueData":paramData}
							});
							if(result)
								return "Successfully updated";
							else
								return "Could not update";
						}

						

					}
					else
					{
						var order = data.playOrder;
	        			var arrOfStr = order.split(","); 
						var paramData = {};
						paramData["keySet"] = data.groupSize;
						paramData["indexSet"] = data.indexSet;
						paramData["valueSet"] = arrOfStr;

						
						var result = customDataDB.update({
							"type":"RROrderOfPlay"},
							{$addToSet:{
								"customKeyValueData":paramData}
						});
						if(result)
							return "Successfully updated";
						else
							return "Could not update";
							
					}
					
				}
				else
				{
					var order = data.playOrder;
        			var arrOfStr = order.split(","); 
					var paramData = {};
					paramData["keySet"] = data.groupSize;
					paramData["indexSet"] = data.indexSet;
					paramData["valueSet"] = arrOfStr;

					
					var result = customDataDB.insert({
						"type":"RROrderOfPlay",
						"customKeyValueData":[paramData]
					})
		
					if(result)
						return "Order Of Play created";
					else
						return "Could not create order of play";
				}
				
			}
			else
			{
				return "Invalid data";
			}
		}catch(e)
		{
			return e
		}
	},
	"deleteRROrder":function(keySet,indexSet)
	{
		try{
			if(keySet && indexSet)
			{
				var dataExists = customDataDB.findOne({"type":"RROrderOfPlay"});
				if(dataExists)
				{
						var result = customDataDB.update({
							"type":"RROrderOfPlay"},
							{"$pull": {
                    			"customKeyValueData": 
                    			{
                        			"keySet": keySet,
                        			"indexSet":indexSet
                    			}
                			}}
                		);

						if(result)
							return "Successfully deleted";
						else
							return "Could not delete";

					
					
				}
				else
				{
					return "Invalid data"
				}
				
			}
			else
			{
				return "Invalid data";
			}

		}catch(e){

		}
	}
})



Meteor.methods({
	
	"setScoreFormatRR":function()
	{
		
	}

})
