import {MatchCollectionDB} from '../../publications/MatchCollectionDb.js';
import {teamMatchCollectionDB} from '../../publications/MatchCollectionDbTeam.js';


Meteor.methods({

	"fetchStateEvents":async function(data)
	{
		try{
			var successJson = succesData();
			var failureJson = failureData();
			var objCheck = Match.test(data, {"apiUserId": String,"year":String});

			if(objCheck)
			{

				var stateEvent = "NITTC-National-"+data.year;

				var raw1 = events.rawCollection();
            	var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
            	var upcomingTourList = distinct1('_id', {"eventOrganizer":data.apiUserId,"tournamentEvent":true,"tournamentType":stateEvent});

				var raw2 = pastEvents.rawCollection();
            	var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
            	var pastTourList = distinct2('_id', {"eventOrganizer":data.apiUserId,"tournamentEvent":true,"tournamentType":stateEvent});

				var tourList = upcomingTourList.concat(pastTourList);

				var raw3 = MatchCollectionDB.rawCollection();
            	var distinct3 = Meteor.wrapAsync(raw3.distinct, raw3);
            	var singleEvents = distinct3('eventName', {"tournamentId":{$in:tourList}});

				var raw4 = teamMatchCollectionDB.rawCollection();
            	var distinct4 = Meteor.wrapAsync(raw4.distinct, raw4);
            	var teamEvents = distinct4('eventName', {"tournamentId":{$in:tourList}});


				var drawEvents = singleEvents.concat(teamEvents);

				var eventsData = pastEvents.aggregate([
					{$match:{
						"eventOrganizer":data.apiUserId,"tournamentEvent":false,
						"tournamentType":stateEvent,
						"tournamentId":{$in:tourList},


						//eventParticipants: {"$exists":true, $gt: [ {$size: "$eventParticipants" }, 0 ] }


					}},
						                    {"$unwind": {path: '$eventParticipants'}},	                    

					{$group:{"_id":null,
						"events":{$addToSet:{"eventName":"$eventName","projectType":"$projectType"}}
					}}
				]);

				if(eventsData && eventsData.length == 0)
				{
					eventsData = events.aggregate([
						{$match:{
							"eventOrganizer":data.apiUserId,"tournamentEvent":false,
							"tournamentType":stateEvent,
							"tournamentId":{$in:tourList},
							/*$and:[
								{"eventParticipants":{"$exists":true}},
								{"eventParticipants":{$gt: [{$size: "$eventParticipants" },
									0]}}
								//{$gt: [ {$size: "$eventParticipants" }, 0 ]}
							]*/

							//eventParticipants: {"$exists":true, $gt: [ {$size: "$eventParticipants" }, 0 ] }

						}},
	                    {"$unwind": {path: '$eventParticipants'}},	                    
						{$group:{"_id":null,
							"events":{$addToSet:{"eventName":"$eventName","projectType":"$projectType"}}
						}}
					]);
				}

				if(eventsData && eventsData.length >0 && eventsData[0] && eventsData[0].events)
				{
					var listOfEvents = eventsData[0].events;

					listOfEvents  = _.sortBy(listOfEvents, 'projectType');


					successJson["data"] = listOfEvents;
					
					var eventData = listOfEvents;


					if(eventData && eventData.length > 0 && eventData[0])
					{
						var paramData = data;
						paramData["eventName"] = listOfEvents[0].eventName;
						paramData["eventType"] = listOfEvents[0].projectType;

						var result = await Meteor.call("fetchStateWinners",paramData);
						if(result && result.status && result.status == "success" && result.data)
						{
							successJson["matchResults"] = result.data;
						}
					}
					successJson["message"] = "Events data";

					return successJson;
				}
				else
				{
					failureJson["message"] = "No events";
					return failureJson;
				}
									
			}
			else
			{
				failureJson["message"] = "Require all parameters";
				return failureJson;
			}

		}catch(e)
		{		
			failureJson["message"] = "Could not fetch state events"+e;
			return failureJson;
		}
	},
	"fetchStateWinners":function(data)
	{
		try{
			var successJson = succesData();
			var failureJson = failureData();
			var objCheck = Match.test(data, {"apiUserId": String,"year":String,"eventName":String,"eventType":Match.OneOf(String, Number)});

			if(objCheck)
			{
				var stateEvent = "NITTC-National-"+data.year;

				var raw1 = events.rawCollection();
            	var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
            	var upcomingTourList = distinct1('_id', {"eventOrganizer":data.apiUserId,"tournamentEvent":true,"tournamentType":stateEvent});


				var raw2 = pastEvents.rawCollection();
            	var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
            	var pastTourList = distinct2('_id', {"eventOrganizer":data.apiUserId,"tournamentEvent":true,"tournamentType":stateEvent});


				var tourList = upcomingTourList.concat(pastTourList);

				var winnerData = [];
				if(data.eventType == "1" || data.eventType == 1)
				{


					winnerData1 = events.aggregate([
						{"$match":{"tournamentId":{$in:tourList},"eventName":data.eventName}},
						{"$unwind" :"$eventParticipants" },
						
						{"$lookup": {
	                        from: "schoolPlayers",
	                        localField: "eventParticipants",
	                        foreignField: "userId",
	                        as: "playerADetails"
	                    }},                   
	                    {"$unwind": {path: '$playerADetails',"preserveNullAndEmptyArrays": true}},	                    
						{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "eventName":1,
	                            "playerAId":"$playerADetails.userId",
	                            "winnerID":"$playerADetails.userId",
	                            "playerAName":"$playerADetails.userName",
	                       	    "playerBName":"",
	                       	    "domain": "$playerADetails.interestedDomainName",	                           


	                        } 
	                    },
	                    {"$lookup": {
	                        from: "domains",
	                        localField: "domain",
	                        foreignField: "_id",
	                        as: "domainDetails"
	                    }},                   
	                    {"$unwind": {path: '$domainDetails',"preserveNullAndEmptyArrays": true}},	                    
                    					{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "eventName":1,
	                            "playerAId":1,"winnerID":1,
	                            "playerAName":1,
	                       	    "playerBName":"",
	                       	    "tournamentName": "$domainDetails.domainName",	                           


	                        } 
	                    },
                    	{"$sort":{"tournamentName":1}}    
					])
					winnerData2 = pastEvents.aggregate([
						{"$match":{"tournamentId":{$in:tourList},"eventName":data.eventName}},
						{"$unwind" :"$eventParticipants" },
						
						{"$lookup": {
	                        from: "schoolPlayers",
	                        localField: "eventParticipants",
	                        foreignField: "userId",
	                        as: "playerADetails"
	                    }},                   
	                    {"$unwind": {path: '$playerADetails',"preserveNullAndEmptyArrays": true}},	                    
						{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "eventName":1,
	                            "playerAId":"$playerADetails.userId",
	                            "winnerID":"$playerADetails.userId",
	                            "playerAName":"$playerADetails.userName",
	                       	    "playerBName":"",
	                       	    "domain": "$playerADetails.interestedDomainName",	                           


	                        } 
	                    },
	                    {"$lookup": {
	                        from: "domains",
	                        localField: "domain",
	                        foreignField: "_id",
	                        as: "domainDetails"
	                    }},                   
	                    {"$unwind": {path: '$domainDetails',"preserveNullAndEmptyArrays": true}},	                    
                    					{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "eventName":1,
	                            "playerAId":1,"winnerID":1,
	                            "playerAName":1,
	                       	    "playerBName":"",
	                       	    "tournamentName": "$domainDetails.domainName",	                           


	                        } 
	                    },
                    	{"$sort":{"tournamentName":1}}    
					])
					


					/*winnerData = MatchCollectionDB.aggregate([
						{"$match":{"tournamentId":{$in:tourList},"eventName":data.eventName}},
						{"$unwind" : "$matchRecords" },
	    				{"$sort" : { "matchRecords.matchNumber" : -1 } },
						{"$group":{
							"_id":{"tournamentId":"$tournamentId","eventName":"$eventName"},					
							"matchNumber":{$first:"$matchRecords.matchNumber"},
							"roundNumber":{$first:"$matchRecords.roundNumber"},
							"roundName":{$first:"$matchRecords.roundName"},
							"status":{$first:"$matchRecords.status"},
							"playerAId":{$first:"$matchRecords.playersID.playerAId"},
							"playerBId":{$first:"$matchRecords.playersID.playerBId"},
							"scores":{$first:"$matchRecords.scores"},
							"winnerID":{$first:"$matchRecords.winnerID"}
						}},
						{"$project":{
							"_id":0,
							"tournamentId":"$_id.tournamentId",
							"eventName":"$_id.eventName",
							"matchNumber":1,
							"roundNumber":1,
							"roundName":1,
							"status":1,
							"playerAId":1,"playerBId":1,
							"scores":1,
							"winnerID":1
						}},
						{"$lookup": {
	                        from: "users",
	                        localField: "playerAId",
	                        foreignField: "userId",
	                        as: "playerADetails"
	                    }},                   
	                    {"$unwind": {path: '$playerADetails',"preserveNullAndEmptyArrays": true}},
	                    {"$lookup": {
	                        from: "users",
	                        localField: "playerBId",
	                        foreignField: "userId",
	                        as: "playerBDetails"
	                    }},                   
	                    {"$unwind": {path: '$playerBDetails',"preserveNullAndEmptyArrays": true}},
						{"$lookup": {
	                        from: "pastEvents",
	                        localField: "tournamentId",
	                        foreignField: "_id",
	                        as: "pastTourDetails"
	                    }},                   
	                    {"$unwind": {path: '$pastTourDetails',"preserveNullAndEmptyArrays": true}},
						{"$lookup": {
	                        from: "events",
	                        localField: "tournamentId",
	                        foreignField: "_id",
	                        as: "upcomingTourDetails"
	                    }},              
	                    {"$unwind": {path: '$upcomingTourDetails',"preserveNullAndEmptyArrays": true}},
	                    {"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "tournamentName": {$ifNull: ['$pastTourDetails.eventName', '$upcomingTourDetails.eventName'] },
	                            "domainName": {$ifNull: ['$pastTourDetails.domainName', '$upcomingTourDetails.domainName'] },	                           
	                            "eventName":1,
	                            "matchNumber":1,
	                            "roundNumber":1,
	                            "roundName":1,
	                            "status":1,
	                            "playerAId":1,"playerBId":1,
	                            "playerAName":"$playerADetails.userName","playerBName":"$playerBDetails.userName",
								"scores":1,
								"winnerID":1
	                        } 
	                    },
                    	{"$sort":{"tournamentName":1}}      
					])*/

					winnerData = winnerData1.concat(winnerData2);


				}
				else if(data.eventType == "2" || data.eventType == 2)
				{

					
					

					winnerData1 = events.aggregate([
						{"$match":{"tournamentId":{$in:tourList},"eventName":data.eventName}},
						{"$unwind" : "$eventParticipants" },
						
	                    {"$lookup": {
                			from: "schoolTeams",               		
                			localField: "eventParticipants",
                			foreignField: "teamManager",
                			as: "teamADB" 
            			}}, 
            			{"$unwind": {path: "$teamADB",preserveNullAndEmptyArrays: true}},
            			{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                          	"teamDB": 1,
	                            "eventName":1,
	                            "playerAId":"$teamADB._id",
	                            "playerAName":"$teamADB.teamName",
								"winnerID":"$teamADB._id",
								"schoolId":"$teamADB.schoolId",
            					"matchTour":{
            						"$cond": { 
                						"if": { "$eq": [ "$teamADB.tournamentId", "$tournamentId" ] }, 
                						"then": 1,
                						"else": 0
                					}
            					}			          		
				    		},
	                         
	                    },
	                    {$match:{
	                    	"matchTour":1
	                    }},
	                    {"$lookup": {
                			from: "schoolDetails",
                			localField: "schoolId",
                			foreignField: "userId",
                			as: "schoolDB" 
            			}}, 
            			{"$unwind": {path: "$schoolDB",preserveNullAndEmptyArrays: true}},
            			{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "tournamentName": 1,
	                            "domainName": 1,
	                            "selectionType": 1 ,
	                          	"teamDB": 1,
	                            "eventName":1,
	                            "status":1,
	                            "playerAId":1,"winnerID":1,
	                            "playerAName":1,
								"winnerSchool":"$schoolDB.schoolName",
	                        	"domain":"$schoolDB.state"
	                        } 
	                    },
	                    {"$lookup": {
	                        from: "domains",
	                        localField: "domain",
	                        foreignField: "_id",
	                        as: "domainDetails"
	                    }},                   
	                    {"$unwind": {path: '$domainDetails',"preserveNullAndEmptyArrays": true}},	                    
                    					{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "eventName":1,
	                            "playerAId":1,"winnerID":1,
	                            "playerAName":1,
	                       	    "playerBName":"",
	                       	    "tournamentName": "$domainDetails.domainName",	                           
	                       	    "domain":1,


	                        } 
	                    },


	                    {"$sort":{"tournamentName":1}}      
					])


					
					winnerData2 = pastEvents.aggregate([
						{"$match":{"tournamentId":{$in:tourList},"eventName":data.eventName}},
						{"$unwind" : "$eventParticipants" },
						
	                    {"$lookup": {
                			from: "schoolTeams",               		
                			localField: "eventParticipants",
                			foreignField: "teamManager",
                			as: "teamADB" 
            			}}, 
            			{"$unwind": {path: "$teamADB",preserveNullAndEmptyArrays: true}},
            			{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                          	"teamDB": 1,
	                            "eventName":1,
	                            "playerAId":"$teamADB._id",
	                            "playerAName":"$teamADB.teamName",
								"winnerID":"$teamADB._id",
								"schoolId":"$teamADB.schoolId",
            					"matchTour":{
            						"$cond": { 
                						"if": { "$eq": [ "$teamADB.tournamentId", "$tournamentId" ] }, 
                						"then": 1,
                						"else": 0
                					}
            					}			          		
				    		},
	                         
	                    },
	                    {$match:{
	                    	"matchTour":1
	                    }},
	                    {"$lookup": {
                			from: "schoolDetails",
                			localField: "schoolId",
                			foreignField: "userId",
                			as: "schoolDB" 
            			}}, 
            			{"$unwind": {path: "$schoolDB",preserveNullAndEmptyArrays: true}},
            			{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "tournamentName": 1,
	                            "domainName": 1,
	                            "selectionType": 1 ,
	                          	"teamDB": 1,
	                            "eventName":1,
	                            "status":1,
	                            "playerAId":1,"winnerID":1,
	                            "playerAName":1,
								"winnerSchool":"$schoolDB.schoolName",
	                        	"domain":"$schoolDB.state"
	                        } 
	                    },
	                    {"$lookup": {
	                        from: "domains",
	                        localField: "domain",
	                        foreignField: "_id",
	                        as: "domainDetails"
	                    }},                   
	                    {"$unwind": {path: '$domainDetails',"preserveNullAndEmptyArrays": true}},	                    
                    					{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "eventName":1,
	                            "playerAId":1,"winnerID":1,
	                            "playerAName":1,
	                       	    "playerBName":"",
	                       	    "domain":1,
	                       	    "tournamentName": "$domainDetails.domainName",	                           


	                        } 
	                    },


	                    {"$sort":{"tournamentName":1}}      
					])



					/*winnerData = teamMatchCollectionDB.aggregate([
						{"$match":{"tournamentId":{$in:tourList},"eventName":data.eventName}},
						{"$unwind" : "$matchRecords" },
	    				{"$sort" : { "matchRecords.matchNumber" : -1 } },
						{"$group":{
							"_id":{"tournamentId":"$tournamentId","eventName":"$eventName"},					
							"matchNumber":{$first:"$matchRecords.matchNumber"},
							"roundNumber":{$first:"$matchRecords.roundNumber"},
							"roundName":{$first:"$matchRecords.roundName"},
							"status":{$first:"$matchRecords.status"},
							"playerAId":{$first:"$matchRecords.teamsID.teamAId"},
							"playerBId":{$first:"$matchRecords.teamsID.teamBId"},
							"scores":{$first:"$matchRecords.scores"},
							"winnerID":{$first:"$matchRecords.winnerID"}
						}},
						{"$project":{
							"_id":0,
							"tournamentId":"$_id.tournamentId",
							"eventName":"$_id.eventName",
							"matchNumber":1,
							"roundNumber":1,
							"roundName":1,
							"status":1,
							"playerAId":1,"playerBId":1,
							"playerAName":1,"playerBName":1,
							"scores":1,
							"winnerID":1
						}},
						
						{"$lookup": {
	                        from: "pastEvents",
	                        localField: "tournamentId",
	                        foreignField: "_id",
	                        as: "pastTourDetails"
	                    }},                   
	                    {"$unwind": {path: '$pastTourDetails',"preserveNullAndEmptyArrays": true}},
						{"$lookup": {
	                        from: "events",
	                        localField: "tournamentId",
	                        foreignField: "_id",
	                        as: "upcomingTourDetails"
	                    }},              
	                    {"$unwind": {path: '$upcomingTourDetails',"preserveNullAndEmptyArrays": true}},
	                    {"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "tournamentName": {$ifNull: ['$pastTourDetails.eventName', '$upcomingTourDetails.eventName'] },
	                            "domainName": {$ifNull: ['$pastTourDetails.domainName', '$upcomingTourDetails.domainName'] },	                           
	                            "eventName":1,
	                           	"matchNumber":1,
	                           	"roundNumber":1,
	                           	"roundName":1,
	                            "status":1,
	                            "playerAId":1,"playerBId":1,
								"scores":1,
								"winnerID":1
	                        } 
	                    },
	                    {"$lookup": {
                			from: "schoolTeams",
                			localField: "playerAId",
                			foreignField: "_id",
                			as: "teamADB" 
            			}}, 
            			{"$unwind": {path: "$teamADB",preserveNullAndEmptyArrays: true}},
            			{"$lookup": {
                			from: "schoolTeams",
                			localField: "playerBId",
                			foreignField: "_id",
                			as: "teamBDB" 
            			}}, 
            			{"$unwind": {path: "$teamBDB",preserveNullAndEmptyArrays: true}},
            			
            			{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "tournamentName": 1,
	                            "domainName": 1,
	                            "selectionType": 1 ,
	                          	"teamDB": 1,
	                            "eventName":1,
	                            "matchNumber":1,
	                            "roundNumber":1,
	                            "roundName":1,
	                            "status":1,
	                            "playerAId":1,"playerBId":1,
	                            "playerAName":"$teamADB.teamName","playerBName":"$teamBDB.teamName",
								"schoolId":{
				          			"$cond": { 
                						"if": { "$eq": [ "$winnerID", "$playerAId" ] }, 
                						"then": "$teamADB.schoolId",
                						"else": {
                    						"$cond": {
                        						"if": { "$eq": ["$winnerID","$playerBId"]}, 
                        						"then": "$teamBDB.schoolId", 
                        						"else": ""
                    						}
                						}
            						}			          		
				    			},
								"scores":1,
								"winnerID":1
	                        } 
	                    },
	                    {"$lookup": {
                			from: "schoolDetails",
                			localField: "schoolId",
                			foreignField: "userId",
                			as: "schoolDB" 
            			}}, 
            			{"$unwind": {path: "$schoolDB",preserveNullAndEmptyArrays: true}},
            			{"$project" : 
	                    	{ 
	                            "tournamentId":1,
	                            "tournamentName": 1,
	                            "domainName": 1,
	                            "selectionType": 1 ,
	                          	"teamDB": 1,
	                            "eventName":1,
	                            "matchNumber":1,
	                            "roundNumber":1,
	                            "roundName":1,
	                            "status":1,
	                            "playerAId":1,"playerBId":1,
	                            "playerAName":1,"playerBName":1,
								"winnerSchool":"$schoolDB.schoolName",
								"scores":1,
								"winnerID":1
	                        } 
	                    },
	                    {"$sort":{"tournamentName":1}}      
					])*/

					winnerData = winnerData1.concat(winnerData2);


				}

				if(winnerData.length > 0)
				{
					successJson["message"] = "Winners data";
					successJson["data"] = winnerData;
					return successJson;
				}
				else
				{
					failureJson["message"] = "No data";
					return failureJson;
				}
				
			}
			else
			{
				failureJson["message"] = "Require all parameters";
				return failureJson;
			}

		}catch(e)
		{		
			failureJson["message"] = "Could not fetch state events"+e;
			return failureJson;
		}
	},

})