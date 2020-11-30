import { MatchCollectionDB }from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import { tourSelectionType } from '../dbRequiredRole.js'
Meteor.methods({

  	/**
     * Meteor Method to fetch data to create tournament
     * @collectionName : domains,tournamentEvents
     * @passedByValues : userId
     * @dataType : String
     * @dbQuery : Fetch data
     * @methodDescription : based on the userId, fetch necessary data to create tournament
    */
	getTournamentCreationDetails:function(userId)
	{
		try{
			var userInfo = Meteor.users.findOne({"userId":userId});
			var resultJson = {};

			if(userInfo)
			{
				resultJson["status"] = "success";
				var domainList = domains.find({},{sort:{domainName:1}}).fetch();
				resultJson["domains"] = domainList;

				var sportList = tournamentEvents.find({},{fields:{"_id":1,"projectMainName":1,"projectSubName":1}}).fetch();
				resultJson["sportList"] = sportList;

				var dataJson = tourSelectionType(userId);

				resultJson["selectionType"] = "";
				resultJson["selectedIdInfo"] = "";

				if(dataJson.selectionType)
					resultJson["selectionType"] = dataJson.selectionType;
				if(dataJson.selectionId)
					resultJson["selectedIdInfo"] = dataJson.selectionId;
	
				// selection type need to be sent

				// siblings of DA/academies need to be sent


				
			}
			else
			{
				resultJson["status"] = "failure";
				resultJson["message"] = "Invalid user";

			}
		    return resultJson;

		}catch(e){
			resultJson["status"] = "failure";
			resultJson["message"] = e;
			return resultJson;

		}

	},
	
	/**
    * Meteor Method to create tournament
 	* @collectionName : events
 	* @dbQuery : insert
 	* @dataType : Object
 	* @passedByValues : eventName, projectName, eventStartDate, eventEndDate,
	*            eventSubscriptionLastDate, domainName, subDomain1Name, subDomain2Name
 	*            prize, eventOrganizer, description, sponsorPdf, sponsorLogo, sponsorUrl,
 	*            sponsorMailId, rulesAndRegulations
 	* @methodDescription : insert given data into events collection to create tournament 
 		followed by tweet 
    */
	createTournamentViaApp:async function(xData,subscribRest,LdataToSaveFromDOB)
	{
		try{
			
			
			var resultJson = false;
			var result = await Meteor.call("insertEvents",xData,subscribRest,LdataToSaveFromDOB)
			try{
				if(result)
				{
					var testOnLoginResult = Meteor.call('testOnLogin')
					var tournamentCreateAutoTweetResult = await Meteor.call('tournamentCreateAutoTweet',true,xData);
					resultJson = true;
				}
			}catch(e){

			}
			return resultJson;
		}catch(e){
			return false;

		}
	},

	/**
     * Meteor Method to fetch upcoming tournaments based on organizer
     * @collectionName : events,subscriptionRestrictions,dobFilterSubscribe
     * @passedByValues : eventOrganizerID
     * @dataType : String
     * @dbQuery : Fetch organizer based upcoming tournaments
     * @methodDescription : based on the userId, fetch upcoming tournaments and its respective 
     	subscription restrictions and dob filters
    */
	upcomingTournamentsOfOrganizer:function(eventOrganizerID)
	{
	    try 
	    {
	    	var resultJson = {};
	    	var tournamentList = [];
	        var lUserId = Meteor.users.findOne({"_id": eventOrganizerID});
	        if(lUserId)
	        {
	        	tournamentList = events.find({tournamentEvent:true,"eventOrganizer":eventOrganizerID},{sort:{eventEndDate1:-1}}).fetch();
	        	for(var x=0; x<tournamentList.length;x++)
	        	{
	        		tournamentList[x]["projectId"] = tournamentList[x]["projectId"][0];
	        		var subscriptionInfo = subscriptionRestrictions.findOne({"tournamentId":tournamentList[x]._id});
	        		if(subscriptionInfo)
	        			tournamentList[x]["whoCanSubscribe"] = subscriptionInfo.selectionType;

	        		var filterInfo = dobFilterSubscribe.findOne({"tournamentId":tournamentList[x]._id});
	        		if(filterInfo)
	        			tournamentList[x]["filters"] = filterInfo.details;
	        		var eventList = events.find({"tournamentId":tournamentList[x]._id},{fields:{projectId:{$slice:1},"projectType":1,"eventName":1,"eventStartDate":1,"eventEndDate":1,"prize":1}}).fetch();
	        		tournamentList[x]["eventList"] = eventList;
	        			  
	        	}

	        	resultJson["tournamentList"] = tournamentList;

	        	var domainList = domains.find({},{sort:{domainName:1}}).fetch();
				resultJson["domains"] = domainList;

				var sportList = tournamentEvents.find({},{fields:{"_id":1,"projectMainName":1,"projectSubName":1}}).fetch();
				resultJson["sportList"] = sportList;
	        }

	        return resultJson

	    } catch (e) {


	    } 
	},

	/**
     * Meteor Method to fetch past tournaments based on organizer
     * @collectionName : events
     * @passedByValues : eventOrganizerID
     * @dataType : String
     * @dbQuery : Fetch organizer based upcoming tournaments
     * @methodDescription : based on the userId, fetch past tournaments 
    */
	pastTournamentsOfOrganizer:function(eventOrganizerID)
	{
 		try 
	    {
	    	var resultJson = {};

	        var lUserId = Meteor.users.findOne({"_id": eventOrganizerID});	       
	        if(lUserId)
	        {
	        	tournamentList = pastEvents.find({tournamentEvent:true,"eventOrganizer":eventOrganizerID},{sort:{eventEndDate1:-1}}).fetch();       
	        	resultJson["tournamentList"] = tournamentList;

	        }
	        return resultJson

	    } catch (e) {

	    } 
	},
	

	organizerTournaments:function(eventOrganizerID)
	{
	    try{
    		var pastResult = {};	
    		var upcominngResult = {};	
    		var result = {};	

	    	var k =events.aggregate([
	    		{$match:{
	    			"tournamentEvent":true,
	    			"eventOrganizer":eventOrganizerID
	    		}},
	    		{$group:{
	    			"_id":null,
	    			"tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	    			"tournamentsId":{$push:"$_id"},       
	    		}},
	    		{$project:{
	    			"tournaments":1,
	    			"tournamentsId":1,
	    			"_id":0
	    		}}
	    	])
	    	if(k.length > 0)
	    	{
	    		if(k[0].tournamentsId)
	    		{
	    			upcominngResult["tournamentList"] = k[0].tournaments;
	    			var tournamentsIdArr = k[0].tournamentsId;
	    			var m =events.aggregate([
	    				{$match:{
	    					"tournamentEvent":false,
	    					"tournamentId":{$in:tournamentsIdArr},
	    				}},
		    			{$group:{
			    			"_id":"$tournamentId",
			    			"events": { $addToSet: "$eventName" }	    		
		    			}},
		    			{$project:{
		    				"tournamentId": "$_id",
		    				"events":1,
		    				"_id":0,
		    			}}
	    			]);
	    			upcominngResult["eventList"] = m;

	    		}
	    	}

	    	var k =pastEvents.aggregate([
	    		{$match:{
	    			"tournamentEvent":true,
	    			"eventOrganizer":eventOrganizerID
	    		}},
	    		{$group:{
	    			"_id":null,
	    			"tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	    			"tournamentsId":{$push:"$_id"},       
	    		}},
	    		{$project:{
	    			"tournaments":1,
	    			"tournamentsId":1,
	    			"_id":0
	    		}}
	    	])
	    	if(k.length > 0)
	    	{
	    		if(k[0].tournamentsId)
	    		{
	    			pastResult["tournamentList"] = k[0].tournaments;

	    			var tournamentsIdArr = k[0].tournamentsId;
	    			var m =pastEvents.aggregate([
	    				{$match:{
	    					"tournamentEvent":false,
	    					"tournamentId":{$in:tournamentsIdArr}
	    				}},
		    			{$group:{
			    			"_id":"$tournamentId",
			    			"events": { $addToSet: "$eventName" }	    		
		    			}},
		    			{$project:{
		    				"tournamentId": "$_id",
		    				"events":1,
		    				"_id":0,
		    			}}
	    			]);
	    			pastResult["eventList"] = m;

	    		}
	    	}
	    	var pastTournaments = [];;
            var upcomingTournaments = [];
            var pastCategories = [];
            var upcomingCategories = [];
            if(pastResult.tournamentList)
                pastTournaments = pastResult.tournamentList;
            if(upcominngResult.tournamentList)
                upcomingTournaments = upcominngResult.tournamentList;
            if(pastResult.eventList)
                pastCategories = pastResult.eventList;
            if(upcominngResult.eventList)
                upcomingCategories = upcominngResult.eventList;

	    	

	    	result["tournamentList"] = _.union(pastTournaments,upcomingTournaments);
	    	result["eventList"] = _.union(pastCategories,upcomingCategories);

	    	return result;
    	}catch(e){}
	},

	
	organizerTournamentsOnApiKey:function(apiKey,locationId,yearVal)
	{
		try{
			if(locationId == undefined || yearVal == undefined)
			{
				var resultJson ={};
				resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Location/Year parameters are mandatory"
                return resultJson;
			}

			var resultJson = {};
			var upcominngResult = {};
			var apiKeyInfo = apiUsers.findOne({"apiKey":apiKey.trim()});
			var year = parseInt(yearVal);
            if(apiKeyInfo&&apiKeyInfo.userId)
            {
                var organizerID = apiKeyInfo.userId;
                if(Meteor.users.findOne({"userId":organizerID}))
                {
                	
                    var upcomingTour ;
                    var pastTour;

                    var matchJson = {};
                    matchJson["tournamentEvent"] = true;
                    matchJson["eventOrganizer"] = organizerID;

                    if(locationId != "" && locationId != undefined && locationId != null)       
                    	matchJson["domainId"] = locationId;

                	
                	upcomingTour = events.aggregate([
	                    {$match:matchJson},
	                    {$project:{
	                       	"_id":1,
	                        "eventName":1,
	                        "year":{"$year":"$eventSubscriptionLastDate1"}
	                    }},	                      
 						{"$match":{ "year" :2018}},
	                    {$group:{
	                        "_id":null,
	                        "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                        "tournamentsId":{$push:"$_id"},       
	                    }},
	                    {$project:{
	                        "tournaments":1,
	                        "tournamentsId":1,
	                        "_id":0
	                        }}
                   	])

                   	pastTour = pastEvents.aggregate([
	                    {$match:matchJson},
	                    {$project:{
	                       	"_id":1,
	                        "eventName":1,
	                        "year":{"$year":"$eventSubscriptionLastDate1"}
	                    }},	                      
 						{"$match":{ "year" :2018}},
	                    {$group:{
	                        "_id":null,
	                        "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                        "tournamentsId":{$push:"$_id"},       
	                    }},
	                    {$project:{
	                        "tournaments":1,
	                        "tournamentsId":1,
	                        "_id":0
	                        }}
                   	])



                	

                	var upcomingTourList = [] ;
                	var pastTourList = [];

                    if(upcomingTour.length > 0)
                    {
                        if(upcomingTour[0].tournamentsId)
                        {
                        	upcomingTourList = upcomingTour[0].tournaments;

                        	var tourList = upcomingTour[0].tournamentsId;
                        	for(var i =0 ;i < tourList.length;i++)
                        	{
                        		var tourId = tourList[i];

	                            var raw1 = MatchCollectionDB.rawCollection();
							    var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
							    var eventList1 =  distinct1('eventName',{"tournamentId":tourId});

							    var raw2 = teamMatchCollectionDB.rawCollection();
							    var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
							    var eventList2 =  distinct2('eventName',{"tournamentId":tourId});
							    
							    var eventList = eventList1.concat(eventList2);
	                         
	                            resultJson[tourId] = eventList;

                        	}
                        }
                    }

                    if(pastTour.length > 0)
                    {
                        if(pastTour[0].tournamentsId)
                        {
                        	pastTourList = pastTour[0].tournaments;

                        	var tourList = pastTour[0].tournamentsId;
                        	for(var i =0 ;i < tourList.length;i++)
                        	{
                        		var tourId = tourList[i];

	                            var raw1 = MatchCollectionDB.rawCollection();
							    var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
							    var eventList1 =  distinct1('eventName',{"tournamentId":tourId});

							    var raw2 = teamMatchCollectionDB.rawCollection();
							    var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
							    var eventList2 =  distinct2('eventName',{"tournamentId":tourId});
							    
							    var eventList = eventList1.concat(eventList2);
	                         
	                            resultJson[tourId] = eventList;

                        	}
                        }
                    }

					var comTourList = upcomingTourList.concat(pastTourList);

                    resultJson["status"] = "success";
                    resultJson["tourList"] = comTourList;           
                	resultJson["response"] = "Tournament List"

                	return resultJson;
                }
            }
            else
            {
				resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid Api Key"
                return resultJson;
            }
		}catch(e){
			resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
		}
	},


	//without login generic tournaments based on apikey(apikey linked with organizerId)
	upcomingTournamentsOnApiKey:function(apiKey,locationId)
	{
		try{
			var resultJson = {};
			var tournamentInfo;
			var upcominngResult = {};
			var apiKeyInfo = apiUsers.findOne({"apiKey":apiKey.trim()});
            if(apiKeyInfo&&apiKeyInfo.userId)
            {
                var organizerID = apiKeyInfo.userId;
                if(Meteor.users.findOne({"userId":organizerID}))
                {
                	if(locationId != "" && locationId != undefined && locationId != null)  
                	{

						/*{
                            sort: {
                                eventEndDate1: -1
                            }
                        }*/
                		tournamentInfo = events.find(
                			{"eventOrganizer":organizerID,"domainId":locationId,
                			"tournamentEvent":true},{
                            sort: {
                                eventEndDate1: -1
                            }
                        }, {
                            fields: {
                                "_id": 1,
                                "eventName": 1,
                                "eventStartDate": 1,
                                "eventEndDate": 1,
                                "domainName": 1,
                                "eventStartDate1": 1,
                                "eventEndDate1": 1,
                                "subscriptionTypeHyper": 1,
                                "hyperLinkValue": 1,
                            }
                        }).fetch();           
                   
                    }else
                    {
                    	tournamentInfo = events.find(
                    		{"eventOrganizer":organizerID,"tournamentEvent":true},
                    		{
                            sort: {
                                eventEndDate1: -1
                            }
                        }, {
                            fields: {
                                "_id": 1,
                                "eventName": 1,
                                "eventStartDate": 1,
                                "eventEndDate": 1,
                                "domainName": 1,
                                "eventStartDate1": 1,
                                "eventEndDate1": 1,
                                "subscriptionTypeHyper": 1,
                                "hyperLinkValue": 1,
                            }
                        }
                    		).fetch();
                    }

                    var k ;

                	if(locationId != "" && locationId != undefined && locationId != null)       
                	{
                		k =events.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,"eventOrganizer":organizerID,"domainId":locationId
	                        }},
	                        {$group:{
	                            "_id":null,
	                            "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                            "tournamentsId":{$push:"$_id"},       
	                        }},
	                        {$project:{
	                            "tournaments":1,
	                            "tournamentsId":1,
	                            "_id":0
	                            }}
                    	])
                	}
                	else
                	{
                		k =events.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,"eventOrganizer":organizerID
	                        }},
	                        {$group:{
	                            "_id":null,
	                            "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                            "tournamentsId":{$push:"$_id"},       
	                        }},
	                        {$project:{
	                            "tournaments":1,
	                            "tournamentsId":1,
	                            "_id":0
	                            }}
	                    ])
                	}
                    if(k.length > 0)
                    {
                        if(k[0].tournamentsId)
                        {
                            //upcominngResult["tournamentList"] = k[0].tournaments;
                            resultJson["tournamentList"] = k[0].tournaments;

                            var tournamentsIdArr = k[0].tournamentsId;
                            var m =events.aggregate([
                                {$match:{
                                    "tournamentEvent":false,
                                    "tournamentId":{$in:tournamentsIdArr},
                                }},
                                {$group:{
                                    "_id":"$tournamentId",
                                    "events": { $addToSet: "$eventName" }               
                                }},
                                {$project:{
                                    "tournamentId": "$_id",
                                    "events":1,
                                    "_id":0,
                                }}
                            ]);
                            //upcominngResult["eventList"] = m;

                            resultJson["eventList"] = m;


                        }
                    }
                    resultJson["status"] = "success"
                	resultJson["resultID"] = tournamentInfo;
                	//resultJson["upcominngResult"] = upcominngResult;
                	resultJson["response"] = "Tournament List"

                	return resultJson;
                }
            }
            else
            {
				resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid Api Key"
                return resultJson;
            }
		}catch(e){
			resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
		}
	},


	//without login generic tournaments based on apikey(apikey linked with organizerId)
	pastTournamentsOnApiKey:function(apiKey,locationId)
	{
		try{
			var resultJson = {};
			var tournamentInfo;
			var upcominngResult = {};
			var apiKeyInfo = apiUsers.findOne({"apiKey":apiKey.trim()});
            if(apiKeyInfo&&apiKeyInfo.userId)
            {
                var organizerID = apiKeyInfo.userId;
                if(Meteor.users.findOne({"userId":organizerID}))
                {
                	if(locationId != "" && locationId != undefined && locationId != null)       
                	{

                		tournamentInfo = pastEvents.find(
                			{"eventOrganizer":organizerID,
                			"domainId":locationId,
                			"tournamentEvent":true},{
                            sort: {
                                eventEndDate1: -1
                            }
                        }, {
                            fields: {
                                "_id": 1,
                                "eventName": 1,
                                "eventStartDate": 1,
                                "eventEndDate": 1,
                                "domainName": 1,
                                "eventStartDate1": 1,
                                "eventEndDate1": 1,
                                "subscriptionTypeHyper": 1,
                                "hyperLinkValue": 1,
                            }
                        }).fetch();           
                    }
                    else
                    {

                    	tournamentInfo = pastEvents.find(
                    		{"eventOrganizer":organizerID,"tournamentEvent":true}
                    		,{
                            sort: {
                                eventEndDate1: -1
                            }
                        }, {
                            fields: {
                                "_id": 1,
                                "eventName": 1,
                                "eventStartDate": 1,
                                "eventEndDate": 1,
                                "domainName": 1,
                                "eventStartDate1": 1,
                                "eventEndDate1": 1,
                                "subscriptionTypeHyper": 1,
                                "hyperLinkValue": 1,
                            }
                        }).fetch();
                    }

                    var k ;

                	if(locationId != "" && locationId != undefined && locationId != null)       
                	{
                		k =pastEvents.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,"eventOrganizer":organizerID,"domainId":locationId
	                        }},
	                        {$group:{
	                            "_id":null,
	                            "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                            "tournamentsId":{$push:"$_id"},       
	                        }},
	                        {$project:{
	                            "tournaments":1,
	                            "tournamentsId":1,
	                            "_id":0
	                            }}
                    	])
                	}
                	else
                	{
                		k =pastEvents.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,"eventOrganizer":organizerID
	                        }},
	                        {$group:{
	                            "_id":null,
	                            "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                            "tournamentsId":{$push:"$_id"},       
	                        }},
	                        {$project:{
	                            "tournaments":1,
	                            "tournamentsId":1,
	                            "_id":0
	                            }}
	                    ])
                	}
                    if(k.length > 0)
                    {
                        if(k[0].tournamentsId)
                        {
                            //upcominngResult["tournamentList"] = k[0].tournaments;
                            resultJson["tournamentList"] = k[0].tournaments;

                            var tournamentsIdArr = k[0].tournamentsId;
                            var m =pastEvents.aggregate([
                                {$match:{
                                    "tournamentEvent":false,
                                    "tournamentId":{$in:tournamentsIdArr},
                                }},
                                {$group:{
                                    "_id":"$tournamentId",
                                    "events": { $addToSet: "$eventName" }               
                                }},
                                {$project:{
                                    "tournamentId": "$_id",
                                    "events":1,
                                    "_id":0,
                                }}
                            ]);
                            //upcominngResult["eventList"] = m;

                            resultJson["eventList"] = m;


                        }
                    }
                    resultJson["status"] = "success"
                	resultJson["resultID"] = tournamentInfo;
                	//resultJson["upcominngResult"] = upcominngResult;
                	resultJson["response"] = "Tournament List"
                	return resultJson;
                }
            }
            else
            {
				resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid Api Key"
                return resultJson;
            }
		}catch(e){
			resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
		}
	},


	pastTournamentsIDOnApiKey:function(apiKey,locationId)
	{
		try{
			var resultJson = {};
			var tournamentInfo;
			var upcominngResult = {};
			var apiKeyInfo = apiUsers.findOne({"apiKey":apiKey.trim()});
            if(apiKeyInfo&&apiKeyInfo.userId)
            {
                var organizerID = apiKeyInfo.userId;
                if(Meteor.users.findOne({"userId":organizerID}))
                {
                	if(locationId != "" && locationId != undefined && locationId != null)       
                		tournamentInfo = pastEvents.find({"eventOrganizer":organizerID,"domainId":locationId,"tournamentEvent":true}).fetch();           
                    else
                    	tournamentInfo = pastEvents.find({"eventOrganizer":organizerID,"tournamentEvent":true}).fetch();

                    var k ;
                    var upcomingTT;

                	if(locationId != "" && locationId != undefined && locationId != null)       
                	{
                		k =pastEvents.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,"eventOrganizer":organizerID,"domainId":locationId
	                        }},
	                        {$group:{
	                            "_id":null,
	                            "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                            "tournamentsId":{$push:"$_id"},       
	                        }},
	                        {$project:{
	                            "tournaments":1,
	                            "_id":0
	                            }}
                    	])

                    	upcomingTT =events.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,"eventOrganizer":organizerID,"domainId":locationId
	                        }},
	                        {$group:{
	                            "_id":null,
	                            "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                            "tournamentsId":{$push:"$_id"},       
	                        }},
	                        {$project:{
	                            "tournaments":1,
	                            "_id":0
	                            }}
                    	])


                	}
                	else
                	{
                		k =pastEvents.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,"eventOrganizer":organizerID
	                        }},
	                        {$group:{
	                            "_id":null,
	                            "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                            "tournamentsId":{$push:"$_id"},       
	                        }},
	                        {$project:{
	                            "tournaments":1,
	                            "_id":0
	                            }}
	                    ])

	                    upcomingTT =events.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,"eventOrganizer":organizerID
	                        }},
	                        {$group:{
	                            "_id":null,
	                            "tournaments":{$push:{"tournamentId":"$_id","tournamentName":"$eventName"}},
	                            "tournamentsId":{$push:"$_id"},       
	                        }},
	                        {$project:{
	                            "tournaments":1,
	                            "_id":0
	                            }}
	                    ])
                	}
                	//code here
                	var upcomingTTArr = [];
                	var pastTTArr = [];
                	var finalArr = [];

                	if(k.length > 0)
                	{
                		if(k[0].tournaments)
                			pastTTArr = k[0].tournaments;
                	}
                	if(upcomingTT.length >0)
                	{
                		if(upcomingTT[0].tournaments)
                			upcomingTTArr = upcomingTT[0].tournaments;
                	}

                	finalArr = _.union(pastTTArr,upcomingTTArr);

                    if(finalArr.length > 0)
                    {
	 					resultJson["status"] = "success"
	                	resultJson["data"] = finalArr;
	                	resultJson["response"] = "Tournament List";
                    }
                    else
                    {
                    	var emptyArray = [];
                    	resultJson["status"] = "success"
	                	resultJson["data"] = emptyArray;
	                	resultJson["response"] = "Tournament List";
                    }


                	return resultJson;
                }
            }
            else
            {
				resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid Api Key"
                return resultJson;
            }
		}catch(e){
			resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
		}
	},


	"fetchMatchDates":function(caller,apiKey)
	{
		try{
  			var userExists = apiUsers.findOne({"apiUser":caller,"apiKey":apiKey});
  			if(userExists)
  			{
  				if(userExists.userId)
  				{
  					var userId = userExists.userId;
  					var raw = sequenceDataRecord.rawCollection();
				    var distinct = Meteor.wrapAsync(raw.distinct, raw);
				    var matchDates =  distinct('sequence.matchDate',{"loggerId":userId});
				    if(matchDates.length > 0)
				    {
				    	var playerList = sequenceDataRecord.aggregate([
					    	{$match:{
					    		"loggerId":userId,
					    		"sequence.matchDate":{$in:matchDates}
					    	}},
				        	{$unwind:"$sequence"},
				        	{$match: { "sequence.matchDate" :  {$in:matchDates}
				        	}},
				        	{$group:{
				        		"_id":"$sequence.matchDate",
		    					"players":{$addToSet:{
		    						"player1Name":"$player1Name","player1Id":"$player1Id",
		    						"player2Name":"$player2Name","player2Id":"$player2Id",
		    					}},
				        	}}
			        	]);
			        	var resultJson = {};
			        	resultJson["status"] = "success";
			        	resultJson["data"] = playerList;

			        	return resultJson;
				    }
				    else
				    {
				    	var resultJson = {};
			        	resultJson["status"] = "failure";
			        	resultJson["data"] = "No Records";
			        	return resultJson;
				    }
				    
  				}
  				else
  				{
  					var resultJson = {};
			        resultJson["status"] = "failure";
			        resultJson["data"] = "Invalid user";
			        return resultJson;
  				}
  			}
  			else
  			{
  				var resultJson = {};
			    resultJson["status"] = "failure";
			    resultJson["data"] = "Invalid api key";
			    return resultJson;
  			}
		}catch(e){
			var resultJson = {};
			resultJson["status"] = "failure";
			resultJson["data"] = "Invalid data";
			return resultJson;
		}
	},


	getEventCategoriesOfTourn:function(tournamentId)
	{
		try{
			var resultJson = {};
			var tournamentExists;
			tournamentExists = events.findOne({"_id":tournamentId});
			if(tournamentExists)
			{
				var raw = events.rawCollection();
				var distinct = Meteor.wrapAsync(raw.distinct, raw);
				var eventCategories =  distinct('eventName',{"tournamentId":tournamentId});
				resultJson["status"] = "success";
				resultJson["data"] = eventCategories;
				return resultJson;
			}
			else
			{
				tournamentExists = pastEvents.findOne({"_id":tournamentId});
				if(tournamentExists)
				{
					var raw = pastEvents.rawCollection();
					var distinct = Meteor.wrapAsync(raw.distinct, raw);
					var eventCategories =  distinct('eventName',{"tournamentId":tournamentId});
					resultJson["status"] = "success";
					resultJson["data"] = eventCategories;
					return resultJson;
				}

			}

		}catch(e){
			resultJson["status"] = "failure";
			resultJson["response"] = "Invalid data"
			return resultJson;
		}
	},

	'resultSummary': async function(tournamentId, eventName) {
        try {
        	//func()
            var sortedMatchColl = [];
            var winner = "";
            var finalSortRecords = {};
            var finalRound = "0";
            var semiFinalRound = "0";
            var quarterFinalRound = "0";

            var eventInfoType = events.findOne({"tournamentId":tournamentId,"eventName":eventName});
            if(eventInfoType == undefined)
                eventInfoType = pastEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
            if(eventInfoType)
            {
                if(eventInfoType.projectType)
                {
                    
                    
                    if(eventInfoType.projectType == "1" || eventInfoType.projectType == 1)
                    {
                       /* var tourInfo = undefined;
                        tourInfo = pastEvents.findOne({
                            "tournamentEvent": true,
                            "_id": tournamentId 
                        });
                        if(tourInfo == undefined)
                        {
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                "_id": tournamentId
                            });
                        }
                                    
                        if (tourInfo != undefined)
                        {
                            finalSortRecords["tournamentName"] = tourInfo.eventName;

                            if(tourInfo.venueAddress)
                                finalSortRecords["tournamentVenue"] = tourInfo.venueAddress;
                            if(tourInfo.domainName)
                                finalSortRecords["tournamentAddress"] = tourInfo.domainName;
                            if(tourInfo.eventStartDate)
                                finalSortRecords["tournamentStartDate"] = tourInfo.eventStartDate;
                            if(tourInfo.eventEndDate)
                                finalSortRecords["tournamentEndDate"] = tourInfo.eventEndDate;
                        }

                        finalSortRecords["eventName"] = eventName;

                        var eventList = MatchCollectionDB.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        });

                        if (eventList != undefined) 
                        {

                            var temp1 = MatchCollectionConfig.aggregate([{
                                    $match: {
                                        "tournamentId": tournamentId,
                                        "eventName": eventName,
                                    }
                                }, {
                                    $unwind: "$roundValues"
                                }, {
                                    $sort: {
                                        "roundValues.roundNumber": -1
                                    }
                                }, {
                                    $limit: 4
                                }, {
                                    $group: {
                                        "_id": "$_id",
                                        "roundNumber": {
                                            $push: "$roundValues.roundNumber"
                                        }
                                    }
                                }, {
                                    $project: {
                                        "roundNumber": 1
                                    }
                                },

                            ])


                            var posRounds = [];
                            if (temp1.length > 0) {
                                var roundNumberArr = temp1[0].roundNumber;
                                for (var b = 0; b < roundNumberArr.length; b++) {
                                    posRounds.push(parseInt(roundNumberArr[b]))
                                }
                            }

                            var recordsData = MatchCollectionDB.aggregate([
                                {$match:{
                                    "tournamentId":tournamentId,
                                    "eventName":eventName,
                                    $or:[{
                                              "matchRecords.roundNumber":{$in:posRounds}
                                            },{
                                              "matchRecords.roundName":{$in:["QF","SF","F","BM"]}
                                            }]
                                }},
                                {$unwind: "$matchRecords"}, 
                                {$match:{
                                  $or:[
                                        {"matchRecords.roundNumber":{$in:posRounds}},
                                        {"matchRecords.roundName":{$in:["QF","SF","F","BM"]}}
                                    ]
                                }},
                                {$group:{
                                  "_id": "$_id", 
                                  "matchRecords": {"$push": "$matchRecords"},
                                }},
                                {$project:{
                                  "matchRecords":1,
                                  "_id":0
                                }}
                            ])
                            if(recordsData.length > 0)
                            {
                                if(recordsData[0].matchRecords)
                                    records = recordsData[0].matchRecords;
                            }

                            var matchConfigInfo = MatchCollectionConfig.findOne({
                                "tournamentId": tournamentId,
                                "eventName": eventName
                            }, {
                                fields: {
                                    "roundValues": 1
                                }
                            });
                            if (matchConfigInfo != undefined) 
                            {
                                var possibleRounds = [];
                                var mx = parseInt(matchConfigInfo.roundValues.length) - parseInt(1);
                                if (matchConfigInfo.roundValues[mx - 1] != undefined)
                                    finalRound = matchConfigInfo.roundValues[mx - 1].roundNumber;
                                if (matchConfigInfo.roundValues[mx - 2] != undefined)
                                    semiFinalRound = matchConfigInfo.roundValues[mx - 2].roundNumber;
                                if (matchConfigInfo.roundValues[mx - 3] != undefined)
                                    quarterFinalRound = matchConfigInfo.roundValues[mx - 3].roundNumber;
                  
                                if (records) {
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].roundNumber != undefined) {
                                            var finalInfo = {};
                                            var matchRecords;
                                            if (records[i].roundNumber == parseInt(finalRound) || records[i].roundNumber == parseInt(semiFinalRound) || records[i].roundNumber == parseInt(quarterFinalRound)) {
                                                if (records[i].roundNumber == parseInt(finalRound)) {
                                                    finalInfo["round"] = "Final";
                                                    matchRecords = records[i];
                                                    if (matchRecords.status != "yetToPlay") {
                                                        winner = matchRecords.winner
                                                    }
                                                }
                                                if (records[i].roundNumber == parseInt(semiFinalRound)) {
                                                    finalInfo["round"] = "Semi Final";
                                                    matchRecords = records[i];
                                                }
                                                if (records[i].roundNumber == parseInt(quarterFinalRound)) {
                                                    finalInfo["round"] = "Quarter Final";
                                                    matchRecords = records[i];
                                                }

                                                if (matchRecords.status != "yetToPlay") 
                                                {
                                                    finalInfo["winner"] = matchRecords.winner;
                                                    if (matchRecords.winnerID == matchRecords.playersID.playerAId) 
                                                    {
                                                        var scoreInfo = "";

                                                        if(matchRecords.status == "walkover" || matchRecords.status == "bye" )
                                                        {
                                                            var opponentText = "";
                                                            if(matchRecords.players.playerB.trim() != "" && matchRecords.players.playerB.trim() != "()")                    
                                                                opponentText = "against "+matchRecords.players.playerB;
                                                            
                                                            finalInfo["playerInfo"] = matchRecords.winner + " qualified " + "via "+matchRecords.status+" "+opponentText;
                                                        }
                                                        else
                                                        {
                                                            finalInfo["playerInfo"] = matchRecords.winner + " dft " + matchRecords.players.playerB +" <br>";
                                                            for (var k = 0; k < matchRecords.scores.setScoresA.length; k++) {
                                                                if (k != 0 && (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0'))
                                                                    scoreInfo += ",";
                                                                if (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0')
                                                                    scoreInfo += matchRecords.scores.setScoresA[k] + " - " + matchRecords.scores.setScoresB[k];
                                                            }
                                                        }

                                                        
                                                    } else {
                                                        var scoreInfo = "";
                                                        var opponentText = "";
                                                            if(matchRecords.players.playerA.trim() != "" && matchRecords.players.playerA.trim() != "()")                    
                                                                opponentText = "against "+matchRecords.players.playerA;
                                                        if(matchRecords.status == "walkover" || matchRecords.status == "bye" )
                                                        {
                                                            finalInfo["playerInfo"] = matchRecords.winner + " qualified " + "via "+matchRecords.status+" "+opponentText;
 
                                                        }
                                                        else
                                                        {
                                                            finalInfo["playerInfo"] = matchRecords.winner + " dft " + matchRecords.players.playerA+" <br>";
                                                            for (var k = 0; k < matchRecords.scores.setScoresB.length; k++) 
                                                            {
                                                                if (k != 0 && (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0'))
                                                                    scoreInfo += ",";
                                                                if (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0')
                                                                    scoreInfo += matchRecords.scores.setScoresB[k] + " - " + matchRecords.scores.setScoresA[k];
                                                            }
                                                        }

                                                        
                                                    }
                                                    finalInfo["scoreInfo"] = scoreInfo;
                                                    sortedMatchColl.push(finalInfo);
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                finalSortRecords["winner"] = winner;

                                var matchInfo = [];
                                var finalplayerInfo = [];
                                var semiplayerInfo = [];
                                var quarterplayerInfo = [];

     

                                for (var t = sortedMatchColl.length-1; t >= 0; t--) {
                                    var roundInfo = {};
                                    if (sortedMatchColl[t].round == "Final") {
                                        roundInfo["round"] = "Final";
                                        finalplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = finalplayerInfo;
                                    }
                                    if (sortedMatchColl[t].round == "Semi Final") {
                                        roundInfo["round"] = "Semi Final";
                                        semiplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = semiplayerInfo;
                                    }
                                    if (sortedMatchColl[t].round == "Quarter Final") {
                                        roundInfo["round"] = "Quarter Final";
                                        quarterplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = quarterplayerInfo;
                                    }
                                    if (_.findWhere(matchInfo, roundInfo) == null) {
                                        matchInfo.push(roundInfo);
                                    }
                                    finalSortRecords["rounds"] = matchInfo;
                                }
                            }


                        }*/

                        var result = await Meteor.call("sendResultEmail",tournamentId,eventName)
                    	try
                    		{
                    			if(result)
                    				finalSortRecords = result;
                    		}catch(e){}

                    }
                    else if(eventInfoType.projectType == "2" || eventInfoType.projectType == 2)
                    {
                    	var result = await Meteor.call("sendResultEmail_Team",tournamentId,eventName)
                    	try
                    		{
                    			if(result)
                    				finalSortRecords = result;
                    		}catch(e){}
                    }

                }
            }

            var resultJson = {};
            resultJson["status"] = "success";
            resultJson["data"] = finalSortRecords;
            return resultJson;

        } catch (e) {
        	var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;

        }
    },


    //5s - aptta results based on tournament (api user key)
    fetchResultsOfOrganizerTournaments:async function(caller,apiKey)
    {
    	try{
    		var resultData = [];
    		var resultJson = {};
			var tournamentInfo;
			var upcominngResult = {};
			var apiKeyInfo = apiUsers.findOne({"apiKey":apiKey.trim()});

			if(apiKeyInfo&&apiKeyInfo.userId)
            {
                var organizerID = apiKeyInfo.userId;
                if(Meteor.users.findOne({"userId":organizerID}))
                {
				    var tournamentList = pastEvents.find({"eventOrganizer":organizerID,"tournamentEvent":true}).fetch();
				    if(tournamentList.length > 0)
				    {
				    	for(var m=0; m<tournamentList.length;m++)
				    	{
				    		var tournamentID = tournamentList[m]._id;
				    		var raw1 = MatchCollectionDB.rawCollection();
		    				var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
		    				var eventList1 =  distinct1('eventName',{"tournamentId":tournamentID});


		    				var raw2 = teamMatchCollectionDB.rawCollection();
		    				var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
		    				var eventList2 =  distinct2('eventName',{"tournamentId":tournamentID});
		    
		    				var eventList = eventList1.concat(eventList2);
						    var resultJson = {};
						    var tournamentData = [];



		    				for(var i=0 ;i<eventList.length;i++)
						    {
						    	var result =await Meteor.call('resultSummary',tournamentID, eventList[i])
						    	try{
						    		if(result)
						    		{
						    			if(result.status && result.data)
						    			{
						    					    				
						    				if(result.data.winner)
						    				{
						    					if(result.data.winner != "")
						    					{
						    						var summaryJson = {};
						    						summaryJson["eventName"] = eventList[i];						    						
						    						summaryJson["winner"] = result.data.winner;
						    						if(result.data.rounds)
						    							summaryJson["rounds"] = result.data.rounds;
						    						tournamentData.push(summaryJson)
						    					}			    					
						    				}
						    				
						    			}
						    		}
						    	}catch(e){}
						    }

						    if(tournamentData.length > 0)
						    {
						    	resultJson["tournamentName"] = tournamentList[m].eventName;
						    	resultJson["events"] = tournamentData;
								resultData.push(resultJson);
						    }
				    	}

	                    resultJson["status"] = "success"
	                	resultJson["data"] = resultData;
	                	resultJson["response"] = "Tournament List"

	                	return resultJson;
                	}
            	}
            	else
            	{
            		resultJson["status"] = "failure"
	                resultJson["resultID"] = "";
	                resultJson["response"] = "Invalid user";
	                return resultJson;
            	}
	           
	        }
	        else
	        {
				resultJson["status"] = "failure"
	            resultJson["resultID"] = "";
	            resultJson["response"] = "Invalid Api Key"
	            return resultJson;
	       }

    		
    	}catch(e){
    	}
    },

    fetchTournamentTeamFormats:function(caller,apiKey,tournamentId){
    	try{
    		var resultData = [];
    		var resultJson = {};
			var tournamentInfo;
			var upcominngResult = {};
			var apiKeyInfo = apiUsers.findOne({"apiKey":apiKey.trim()});

			if(apiKeyInfo&&apiKeyInfo.userId)
            {
                var organizerID = apiKeyInfo.userId;
                if(Meteor.users.findOne({"userId":organizerID}))
                {
				    var tournInfo = events.findOne({"eventOrganizer":organizerID,"tournamentEvent":true,"_id":tournamentId});
					if(tournInfo)
					{
						//distinct

						var raw = events.rawCollection();
		    			var distinct = Meteor.wrapAsync(raw.distinct, raw);
		    			var teamFormatList =  distinct('projectId',{"tournamentId":tournamentId,"eventOrganizer":organizerID,"projectType":2});

				    	var teamFormatArr =teamsFormat.aggregate([
				    		{$match:{
				    			"_id":{$in:teamFormatList},
				    		}},
				    		{$group:{
				    			"_id":null,
				    			"data":{$push:{"teamFormatID":"$_id","teamFormatName":"$teamFormatName"}},
				    		}},
				    		{$project:{
				    			"data":1,
				    			"_id":0
				    		}}
				    	])
				    	if(teamFormatArr.length > 0)
				    	{
				    		resultJson["status"] = "success";
							resultJson["data"] = teamFormatArr[0].data;
							return resultJson;
				    	}
				    	else
				    	{
				    		resultJson["status"] = "failure";
							resultJson["response"] = "No data";
							return resultJson;
				    	}
		    		}
					else
					{
						resultJson["status"] = "failure";
						resultJson["response"] = "Invalid tournament";
						return resultJson;
					}
				}
				else
				{
					resultJson["status"] = "failure";
					resultJson["response"] = "Invalid user";
					return resultJson;
				}
			}
			else
			{
				resultJson["status"] = "failure";
				resultJson["response"] = "Invalid apikey";
				return resultJson;
			}
    	}catch(e){
    	}
    },
    
    fetchDrawEvents:function(tournamentId)
    {
    	try{
    		var resultJson = {};

    		var tournamentID = tournamentId;
			var raw1 = MatchCollectionDB.rawCollection();
		    var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
		    var eventList1 =  distinct1('eventName',{"tournamentId":tournamentID});

		    var raw2 = teamMatchCollectionDB.rawCollection();
		    var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
		    var eventList2 =  distinct2('eventName',{"tournamentId":tournamentID});

		    var eventList = eventList1.concat(eventList2);

		    if(eventList.length > 0)
		    {
		    	resultJson["status"] = "success";
		    	resultJson["data"] = eventList;
		    	return resultJson;
		    }
		    else
		    {
		    	resultJson["status"] = "failure";
		    	resultJson["data"] = "No events";
		    	return resultJson;
		    }
		    		

    	}catch(e)
    	{
    		resultJson["status"] = "failure";
		    resultJson["data"] = e;
		    return resultJson;
    	}
    },

    'resultSummaryInHaul': async function(tournamentId, eventName) {
        try {
        	//func()e
            var resultSet = {};
            var eventInfoType = events.findOne({"tournamentId":tournamentId});
            if(eventInfoType == undefined)
                eventInfoType = pastEvents.findOne({"tournamentId":tournamentId});
            if(eventInfoType)
            {
            	//var eventName = undefined;
            	var eventList = [];
            	if(eventName != undefined)
            	{
            		eventList = [eventName];
            	}
            	else
            	{

					var raw1 = MatchCollectionDB.rawCollection();
				    var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
				    var eventList1 =  distinct1('eventName',{"tournamentId":tournamentId});

				    var raw2 = teamMatchCollectionDB.rawCollection();
				    var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
				    var eventList2 =  distinct2('eventName',{"tournamentId":tournamentId});

				    eventList = eventList1.concat(eventList2);
            	}

            	


                if(eventList.length > 0)
                {                                                         
                    var individualSet = MatchCollectionDB.aggregate([
                        {$match:{
                           	"tournamentId": tournamentId,
                            "eventName": {$in:eventList},
                        }},
                        {
                            $unwind: "$matchRecords"
                        },                        
                        {$match:{
							"matchRecords.status":{$ne:"yetToPlay"}
                        }},                           
                        {$group:{"_id":
                        	{"eventName":"$eventName"},
                            "matchDetails":{$push:{
                                "roundNumber":"$matchRecords.roundNumber",
                                "matchNumber":"$matchRecords.matchNumber",
                                "roundName":{$cond:{
                                	"if": { "$eq": [ "$matchRecords.roundName", "F" ] }, 
                                	"then":"Final",
                                	"else":{$cond:{
                                		"if": { "$eq": [ "$matchRecords.roundName", "SF" ] }, 
                                		"then":"Semi Final",
                                		"else":{$cond:{
                                			"if": { "$eq": [ "$matchRecords.roundName", "QF" ] }, 
                                			"then":"Quarter Final",
                                			"else":{$concat:["Round ",{$substr:["$matchRecords.roundNumber",0, 10]}]}
                                		}}
                                	}}
                                }},

                                "matchStatus":"$matchRecords.status",
                                "winner":"$matchRecords.winner",
                                "loser":{$cond:{
                                	"if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.playersID.playerAId" ] }, 
                                	"then":"$matchRecords.players.playerB",
                                	"else":"$matchRecords.players.playerA"
                                }},
                                "winnerScore":{$cond:{
                                	"if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.playersID.playerAId" ] }, 
                                	"then":"$matchRecords.scores.setScoresA",
                                	"else":"$matchRecords.scores.setScoresB"
                                }},
                                "loserScore":{$cond:{
                                	"if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.playersID.playerAId" ] }, 
                                	"then":"$matchRecords.scores.setScoresB",
                                	"else":"$matchRecords.scores.setScoresA"
                                }}
                            }}                  
                        }},
                        {$sort:{"matchDetails.roundNumber":1,"matchDetails.matchNumber":1}},
                        {$project:{
                        	"eventName":"$_id.eventName",
                            "matchDetails":1,
                            "_id":0
                        }},                                   
                    ])

                            

                        

                    var teamSet = teamMatchCollectionDB.aggregate([
                        {$match:{
                            "tournamentId": tournamentId,
                            "eventName": {$in:eventList},
                        }},
                        {
                            $unwind: "$matchRecords"
                        },                        
                        {$match:{
							"matchRecords.status":{$ne:"yetToPlay"}
                        }},                           
                        {$group:{"_id":
                        	{"eventName":"$eventName"},
                            "matchDetails":{$push:{
                               	"roundNumber":"$matchRecords.roundNumber",
                                "matchNumber":"$matchRecords.matchNumber",
                                "roundName":{$cond:{
                                	"if": { "$eq": [ "$matchRecords.roundName", "F" ] }, 
                                	"then":"Final",
                                	"else":{$cond:{
                                		"if": { "$eq": [ "$matchRecords.roundName", "SF" ] }, 
                                		"then":"Semi Final",
                                		"else":{$cond:{
                                			"if": { "$eq": [ "$matchRecords.roundName", "QF" ] }, 
                                			"then":"Quarter Final",
                                			"else":{$concat:["Round ",{$substr:["$matchRecords.roundNumber",0, 10]}]}
                                		}}
                                	}}
                                }},
                                "matchStatus":"$matchRecords.status",

                                "winner":"$matchRecords.winner",
                                "loser":{$cond:{
                                	"if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.teamsID.teamAId" ] }, 
                                	"then":"$matchRecords.teams.teamB",
                                	"else":"$matchRecords.teams.teamA"
                                }},
                                "winnerScore":{$cond:{
                                	"if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.teamsID.teamAId" ] }, 
                                	"then":"$matchRecords.scores.setScoresA",
                                	"else":"$matchRecords.scores.setScoresB"
                                }},
                                "loserScore":{$cond:{
                                	"if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.teamsID.teamAId" ] }, 
                                	"then":"$matchRecords.scores.setScoresB",
                                	"else":"$matchRecords.scores.setScoresA"
                                }}
                            }}			                          
                        }},                        
                        {$sort:{
                            "matchDetails.roundNumber":1,
                            "matchDetails.matchNumber":1,          		
                        }},
                        {$project:{
                        	"eventName":"$_id.eventName",
                            "matchDetails":1,
                            "_id":0
                        }},                                                                
                    ])




				    resultSet = individualSet.concat(teamSet);             
            	}
        	}
        	if(resultSet.length > 0)
        	{
	            var resultJson = {};
	            resultJson["status"] = "success";
	            resultJson["data"] = resultSet;
	            return resultJson;
        	}
        	else
        	{
	            var resultJson = {};
	            resultJson["status"] = "failure";
	            resultJson["data"] = resultSet;
	            return resultJson;
        	}
            

        } catch (e) {
        	var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;

        }
    },

    "fetchDA":function(userId)
    {
    	try{
    		var assocList = associationDetails.find({
    			"associationType" : "District/City",
    			"affiliatedTo" : "stateAssociation", 
    			"parentAssociationId" : userId},
    			{fields:{"userId":1,"associationName":1,
    			"abbrevationAssociation":1,"emailAddress":1,"city":1}}).fetch();

    		if(assocList.length > 0)
    		{
    			var resultJson = {};
    			resultJson["status"] = "success";
    			resultJson["data"] = assocList;
    			resultJson["message"] = "District Associations";
    			return resultJson;
    		}
    		else
    		{
				var resultJson = {};
    			resultJson["status"] = "failure";
    			resultJson["message"] = "No District Associations";
    			return resultJson;
    		}



    	}catch(e)
    	{
    		var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data "+e;
            return resultJson;
    	}
    }



})