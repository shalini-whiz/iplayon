import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import {nameToCollection} from '../dbRequiredRole.js'
import {playerDBFind} from '../dbRequiredRole.js'


Meteor.methods({

	
	/**
     * Meteor Method to view player profile
     * @collectionName : userDetailsTT,userDetailsBT(based on sport)
     * @passedByValues : playerId
     * @dataType : String
     * @dbQuery : Fetch data
     * @methodDescription : based on the param id , fetch complete profile of the user
     * Usage - Player App
    */
	viewPlayerProfile:function(playerId)
	{
		try{
			var resultJson = {};
			var userInfo = nameToCollection(playerId).findOne({"userId":playerId});
			if(userInfo)
			{
				if(userInfo.state)
				{
					var domainInfo = domains.findOne({"_id":userInfo.state});
					if(domainInfo)
						userInfo["domainName"] = domainInfo.domainName;
				}
				if(userInfo.interestedProjectName)
				{
					var raw = tournamentEvents.rawCollection();
					var distinct = Meteor.wrapAsync(raw.distinct, raw);
					var interestedSport = distinct('projectMainName',{"_id": {$in:userInfo.interestedProjectName}});
					userInfo["interestedSport"] = interestedSport;
				}
				resultJson["status"] = "success";
				resultJson["message"] = "user found!!";
				resultJson["response"] = userInfo;

			}
			else
			{
				resultJson["status"] = "failure";
				resultJson["message"] = "user not found!!"
			}
			return resultJson;

		}catch(e)
		{
		}
	},

	/**
     * Meteor Method to view subscribed team in tournament
     * @collectionName : playerTeams
     * @passedByValues : teamId
     * @dataType : String
     * @dbQuery : Fetch data from db playerTeams based on teamId
     * @methodDescription : based on the param teamId , we first validate whether team is valid based on format and 
     	then we fetch complete teamDetails 
     * Usage - Player App
    */
	'viewTeamDetails':async function(teamId)
	{
		try{
			var resultJson = {};
			var data = {};
			var result = await Meteor.call("validateExistingTeam",teamId)
			try{
                  if(result)
                  {
                  	resultJson["status"] = "success";
                  	resultJson["response"] = "Team fetched"
                  	var teamExists = playerTeams.findOne({"_id":teamId});
                  	if(teamExists)
                  		resultJson["teamName"] = teamExists.teamName;
                    if(result.teamMembers)
                      resultJson["data"] = result.teamMembers;  
                  }
                  else
                  {
                  	resultJson["status"] = "failure";
                  	resultJson["response"] = "Invalid data"
                  }
                }catch(e){
                	resultJson["status"] = "failure";
                  	resultJson["response"] = "Invalid data"
                }
			return resultJson;


		}catch(e)
		{
			resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data";
            return resultJson;
		}
	},
	
	/**
     * Meteor Method to fetch player list based on teamformat
     * @collectionName : teamsFormat
     * @passedByValues : teamFormatID,userId
     * @dataType : String,String
     * @dbQuery : fetch players  based on each criteria in the teamFormat
     * @methodDescription : based on the param teamFormatID , fetch player list with respect to criteria defined 
     * Usage - Internally used by player app while creating new team
    */
	"fetchPlayersOnTeamValidation":async function(teamFormatID,userId)
	{
		try{
			var resultJson = [];
			var teamformatInfo = teamsFormat.findOne({"_id":teamFormatID});
			if(teamformatInfo && teamformatInfo.playerFormatArray)
			{
				
				if(teamformatInfo.playerFormatArray.length > 0)
				{
					for(var i =0; i<teamformatInfo.playerFormatArray.length;i++)
					{
						var k = i+1;
						var playerFormat = teamformatInfo.playerFormatArray[i];
						var response = await Meteor.call("fetchPlayerListOnCriteria",playerFormat,teamformatInfo.rankedOrNot,userId,teamformatInfo.selectedProjectId);
						playerFormat.playerJsonList = response;
						playerFormat.slNo = k;
						resultJson.push(playerFormat)
					}		
				}
			}
			return resultJson;

		}catch(e){
		}
	},
	/**
     * Meteor Method to fetch player list against each criteria defined in teamformat
     * @collectionName : teamsFormat
     * @passedByValues : playerFormat,rankCriteria,userId,sportId
     * @dataType : String,String,String,String
     * @dbQuery : fetch players based on each criteria in the teamFormat
     * @methodDescription :fetch player list with respect to criteria defined 
     * Usage - Internally used by player app while creating new team/edit team
    */
	"fetchPlayerListOnCriteria":function(playerFormat,rankCriteria,userId,sportId)
	{
		try{
			var gender_H = playerFormat.gender;
        	var dateType_H = playerFormat.dateType;
        	var dateValue_H;
        	if(playerFormat.dateValue)
        		dateValue_H = playerFormat.dateValue;

        	var locationType_H = playerFormat.locationType;
        	var mandatory_H = playerFormat.mandatory;
        	var rankedOrNot_H = rankCriteria;

        	var usersDet = [];
        	var locId;
        	var gender_H2 = "";
        	var gender_H3 = "";
        	var gender_H4 = "";

        	var queryForDB = {};
        	var queryForLocation = {};
        	var queryForGender = {};
        	var queryForAffiliation = {};

	        if (gender_H.toLowerCase() == "male") {
	            gender_H = "Male"
	            gender_H2 = "male"
	        } else if (gender_H.toLowerCase() == "female") {
	            gender_H = "Female"
	            gender_H2 = "female"
	        } else {
	            gender_H = "male"
	            gender_H2 = "female"
	            gender_H3 = "Male"
	            gender_H4 = "Female"
	        }

	        var queryForGender = {
	            $or: [{
	                gender: gender_H
	            }, {
	                gender: gender_H2
	            }, {
	                gender: gender_H3
	            }, {
	                gender: gender_H4
	            }]
	        }

	        var lUserId = Meteor.users.findOne({"_id": userId});
	        if (lUserId.role == "Player") 
	        {
                var userDetails = nameToCollection(userId).findOne({"userId": userId});
                if (userDetails &&userDetails.affiliatedTo) 
                {
                    if(userDetails.affiliatedTo=="stateAssociation"&&userDetails.associationId&&userDetails.associationId!="other")
                    {
                        locId = userDetails.associationId;
                        if (locationType_H == "local") {
                            queryForLocation = {
                                $and:[{'associationId': locId,'affiliatedTo':userDetails.affiliatedTo}]
                            }
                        }
                        else if (locationType_H == "imported") {
                            queryForLocation = {
                                $and:[{'associationId':{$ne:locId},'affiliatedTo':userDetails.affiliatedTo}]
                            }
                        }
                    }
                    else if(userDetails.affiliatedTo=="districtAssociation"&&userDetails.associationId&&userDetails.associationId!="other")
                    {
                        locId = userDetails.associationId
                        if (locationType_H == "local") {
                            queryForLocation = {
                                $and:[{'associationId': locId,'affiliatedTo':userDetails.affiliatedTo}]
                            }
                        }
                        else if (locationType_H == "imported") {
                            queryForLocation = {
                                $and:[{'associationId':{$ne:locId},'affiliatedTo':userDetails.affiliatedTo}]
                            }
                        }
                    }
                    else if(userDetails.affiliatedTo=="academy"&&userDetails.clubNameId&&userDetails.clubNameId!="other")
                    {
                        locId = userDetails.clubNameId
                        if (locationType_H == "local") {
                            queryForLocation = {
                                $and:[{'clubNameId': locId,'affiliatedTo':userDetails.affiliatedTo}]
                            }
                        }
                        else if (locationType_H == "imported") {
                            queryForLocation = {
                                $and:[{'clubNameId':{$ne:locId},'affiliatedTo':userDetails.affiliatedTo}]
                            }
                        }
                    }
                    else if(userDetails.affiliatedTo=="other")
                    {
                        locId = userDetails.clubNameId
                        if (locationType_H == "local") 
                        {
                            queryForLocation = {
                                $and:[{'affiliatedTo':userDetails.affiliatedTo}]
                            }
                        }
                        /*
                        else if (locationType_H == "imported") 
                        {
                            queryForLocation = {
                                $and:[{'clubNameId':{$ne:locId},'affiliatedTo':userDetails.affiliatedTo}]
                            }
                        }*/
                    }
                }
            }

            if (locationType_H == "any") 
            	queryForLocation = {}
        

        	if(dateType_H=="onBefore"){
            	queryForDB = {
                	dateOfBirth:{$lte:new Date(moment(new Date(dateValue_H)).format("YYYY-MM-DD"))}
            	}
        	}
        	else if(dateType_H=="before"){
            	queryForDB = {
                	dateOfBirth:{$lt:new Date(moment(new Date(dateValue_H)).format("YYYY-MM-DD"))}
            	}
        	}
        	else if(dateType_H=="onAfter"){
            	queryForDB = {
                	dateOfBirth:{$gte:new Date(moment(new Date(dateValue_H)).format("YYYY-MM-DD"))}
            	}
        	}
        	else if(dateType_H=="after"){
            	queryForDB = {
                	dateOfBirth:{$gt:new Date(moment(new Date(dateValue_H)).format("YYYY-MM-DD"))}
            	}
        	}
        	else if(dateType_H=="any"){
            	queryForDB = {}
        	}

        	if(rankedOrNot_H=="yes"){
            	queryForAffiliation = {"affiliationId":{$nin:[null,"","other",undefined]}}
        	}
        	else if(rankedOrNot_H=="no"){
            	queryForAffiliation = {}
        	}

        	if(nameToCollection(sportId))
            {
	            var userArr = nameToCollection(sportId).aggregate([
	            {$match:{
	            	$and: [
	                    queryForGender,
	                    queryForLocation,
	                    queryForDB,
	                    queryForAffiliation,
	                    {"affiliatedTo":{$nin:["school"]}},
	                    {"statusOfUser":"Active"}
	                ]
	            }},
	            {$project:{
	            	"playerName": "$userName",
	                "userId": 1,
	                "_id":0,
	                "insensitive": { "$toLower": "$userName" }

	            }},
	            {$sort: {"insensitive":1}},
	            {$project:{
	                //"insensitive":0,
	                "userId": 1,
	            	"playerName": 1,

	            }}
	            ])
            	return userArr
	        }
	        else
	        	return [];
            
		}catch(e){
		}
	},
	
	eventsCollectionUpdateViaApp : function(tournamentId, eventCollection, teamEventsData) {
	    try {

	    	var result1;
	    	var result2;
	        for (var i = 0; i < eventCollection.length; i++) {
	            var eventsFind = events.findOne({
	                "abbName": eventCollection[i].eventName,
	                "tournamentId": tournamentId,
	                "tournamentEvent": false
	            });
	            if (eventsFind) 
	            {
	                if (eventCollection[i].eventUnsubscribers !== undefined && eventCollection[i].eventUnsubscribers.length != 0) 
	                {
	                    result1 = events.update({
	                        "abbName": eventCollection[i].eventName,
	                        "tournamentId": tournamentId,
	                        "tournamentEvent": false
	                    }, {
	                        $pull: {
	                            eventParticipants: {
	                                $in: eventCollection[i].eventUnsubscribers
	                            }
	                        }
	                    });
	                }
	                if (eventCollection[i].eventSubscribers !== undefined && eventCollection[i].eventSubscribers.length != 0) 
	                {
	                    result2 = events.update({
	                        "abbName": eventCollection[i].eventName,
	                        "tournamentId": tournamentId,
	                        "tournamentEvent": false
	                    }, {
	                        $addToSet: {
	                            eventParticipants: {
	                                $each: eventCollection[i].eventSubscribers
	                            }
	                        }
	                    });
	                }
	                
	            }
	        }
	        if(result1 != undefined)
	            return result1;
	        if(result2 != undefined)
	            return result2;
	    } catch (e) {

	    }
	},

	teamEntriesCollectionUpdateViaApp : function(tournamentId, eventEntries, teamEventsData) {
	    try {

	    	

	        for (var tp = 0; tp < eventEntries.length; tp++) 
	        {
	            var teamEntriesFind = playerTeamEntries.findOne({
	                playerId: eventEntries[tp].userId,
	                tournamentId: tournamentId
	            });
	            var subscribedTeamsArray, subscribedTeamID;
	            if (teamEntriesFind == undefined) {
	                if (eventEntries[tp].totalFeesOfTeam != 0) {
	                    playerTeamEntries.insert({
	                        playerId: eventEntries[tp].userId,
	                        academyId: eventEntries[tp].academyId,
	                        parentAssociationId: eventEntries[tp].parentAssociationId,
	                        associationId: eventEntries[tp].associationId,
	                        tournamentId: tournamentId,
	                        subscribedEvents: eventEntries[tp].teamEventList,
	                        totalFee: eventEntries[tp].totalFeesOfTeam,
	                        subscribedTeamID: eventEntries[tp].teamIdsArray,
	                        subscribedTeamsArray: eventEntries[tp].subscribedTeamsArray,
	                        paidOrNot: false
	                    });
	                }
	            } else {
	                if (eventEntries[tp].subscribedTeamsArray.length == 0 && teamEntriesFind.subscribedTeamsArray && teamEntriesFind.subscribedTeamID) {
	                    eventEntries[tp].subscribedTeamsArray = teamEntriesFind.subscribedTeamsArray;
	                    eventEntries[tp].teamIdsArray = teamEntriesFind.subscribedTeamID
	                }
	                if (eventEntries[tp].teamEventList.length != 0) {
	                    for (var tu = 0; tu < eventEntries[tp].teamEventList.length; tu++) {
	                        if (eventEntries[tp].teamEventList[tu]) {
	                            var teamEventListARR = eventEntries[tp].teamEventList[tu];
	                            if (parseInt(teamEventListARR) == 0) {
	                                eventEntries[tp].teamIdsArray[tu] = "0"
	                            }
	                        }
	                    }
	                }
	                if (eventEntries[tp].subscribedTeamsArray) {
	                    var subscribedTeamsArray = eventEntries[tp].subscribedTeamsArray;
	                    for (var Jsontu = 0; Jsontu < eventEntries[tp].unsubscriberdTeamEventsNames.length; Jsontu++) {
	                        var eventName = eventEntries[tp].unsubscriberdTeamEventsNames[Jsontu]
	                        var indexDUnsub = _.indexOf(_.pluck(subscribedTeamsArray, 'eventName'), eventName);
	                        if (indexDUnsub !== -1) {
	                            subscribedTeamsArray.splice(indexDUnsub, 1);
	                        }
	                    }
	                }

	                playerTeamEntries.update({
	                    playerId: eventEntries[tp].userId,
	                    tournamentId: tournamentId
	                }, {
	                    $set: {
	                        subscribedEvents: eventEntries[tp].teamEventList,
	                        totalFee: eventEntries[tp].totalFeesOfTeam,
	                        subscribedTeamID: eventEntries[tp].teamIdsArray,
	                        subscribedTeamsArray: eventEntries[tp].subscribedTeamsArray
	                    }
	                });
	            }
	            return true;
	        }
	    } catch (e) {
	        return false;
	    }
	},
	
	
  
  	'subscribeEventsViaApp':function(xdata) 
    {	    
	    try 
	    {
	        var playerId = xdata.userId;
	        var eventFeeInfo = eventFeeSettings.findOne({tournamentId:xdata.tournamentId});
	        if(eventFeeInfo)
	        {
	        	
		        var playerEntriesInfo = playerEntries.findOne({"tournamentId":xdata.tournamentId,"playerId":xdata.userId});
		        var playerInfo = nameToCollection(xdata.userId).findOne({"userId":xdata.userId});
		        
		        if(xdata.finalSingleEvents  == undefined)
		        {
		        	var tourFee = eventFeeInfo.eventFees;
		        	var tourEvents = eventFeeInfo.singleEvents;
		        	xdata.finalSingleEvents = [];

		        	if(playerEntriesInfo)
		        		xdata.finalSingleEvents = playerEntriesInfo.subscribedEvents;
		        	else
		        	{	
		        		_.each(tourFee, function(item,index){
		        			xdata.finalSingleEvents.push("0");
		        		});
		        	}

		       

		        	var sortedCollection = [];
		        	_.each(xdata.subscribeID, function(item){
		        		var pos = _.indexOf(tourEvents, item);
		        		xdata.finalSingleEvents[pos] = tourFee[pos]
		        	});


		        	xdata.finalSum = xdata.finalSingleEvents.reduce(function (accumulator, currentValue) {
			            return accumulator + parseInt(currentValue);
			        },0)


		        }

		        if(playerEntriesInfo)
		        {
		        	

	            	var result = playerEntries.update({"playerId":xdata.userId,"tournamentId":xdata.tournamentId},
	              	{$set:{"subscribedEvents":xdata.finalSingleEvents,"totalFee":xdata.finalSum}});
	          	}
	          	else
	          	{

	            	var playerInfo = nameToCollection(xdata.userId).findOne({"userId":xdata.userId});

	            	if(playerInfo)
	            	{
		              	var playerClubNameId = "other";
		              	var playerAssociationId = "other";
		              	var playerParentAssociationId= "other";
		              	if(playerInfo.clubNameId)
		                	playerClubNameId = playerInfo.clubNameId;
		              	if(playerInfo.associationId)
		                	playerAssociationId = playerInfo.associationId;
		              	if(playerInfo.parentAssociationId)
		                	playerParentAssociationId = playerInfo.parentAssociationId;

			            var result = playerEntries.insert({ 
			                "playerId":xdata.userId,"academyId":playerClubNameId,
			                "associationId":playerAssociationId,"parentAssociationId":playerParentAssociationId,
			                "tournamentId":xdata.tournamentId,"subscribedEvents":xdata.finalSingleEvents,
			                "totalFee":xdata.finalSum,paidOrNot:false
			            });
	            	}
	          	}

	          	if(playerInfo.affiliatedTo == "academy" && playerInfo.clubNameId)
	          	{
	            	var sum = 0;
	            	var academySum = playerEntries.find({tournamentId:xdata.tournamentId,academyId:playerInfo.clubNameId,totalFee:{"$ne":"0"}}).map(function(doc) {
		              	sum = parseInt(sum)+ parseInt(doc.totalFee);
		              	return sum;
	            	});

	            	if(sum >0 )
	            	{
	              		var academyFound = academyEntries.findOne({tournamentId:xdata.tournamentId,academyId:playerInfo.clubNameId});
	              		if(academyFound)
	              		{
	                		academyEntries.update({tournamentId:xdata.tournamentId,academyId:playerInfo.clubNameId},
	                			{$set:{"totalFee":sum.toString()}});                       
	              		}
	              		else
	              		{
			                var acaAssociationId = "other";
			                var acaParentAssociationId = "other";
			                var academyInfo = academyDetails.findOne({userId:playerInfo.clubNameId});
			                if(academyInfo)
			                {
			                  	if(academyInfo.associationId)
			                    	acaAssociationId = academyInfo.associationId;
			                  	if(academyInfo.parentAssociationId)
			                    	acaParentAssociationId = academyInfo.parentAssociationId;

			                  	academyEntries.insert({
			                    	"academyId":playerInfo.clubNameId,"tournamentId":xdata.tournamentId,
			                    	"associationId":acaAssociationId,"parentAssociationId":acaParentAssociationId,
			                    	"totalFee":sum.toString(),"paidOrNot":false})
			                }
	              		}                       
	            	}
	          	}
	          	else if(playerInfo.affiliatedTo == "districtAssociation" && playerInfo.associationId)
	          	{

	            	var sum = 0;
	            	var districtSum = playerEntries.find({tournamentId:xdata.tournamentId,associationId:playerInfo.associationId,totalFee:{"$ne":"0"}}).map(function(doc) {
	              		sum = parseInt(sum)+ parseInt(doc.totalFee);
	              		return sum;
	            	});

	            	if(sum >0 )
	            	{
		              	var DAFound = districtAssociationEntries.findOne({tournamentId:xdata.tournamentId,associationId:playerInfo.associationId});
		              	if(DAFound)
		              	{
		                	districtAssociationEntries.update({tournamentId:xdata.tournamentId,associationId:playerInfo.associationId},
		                  		{$set:{"totalFee":sum.toString()}});
		              	}
		              	else
	              		{
			                var dAAssociationId = "other";
			                var dAParentAssociationId = "other";
			                var dAInfo = associationDetails.findOne({userId:playerInfo.associationId});
			                if(dAInfo)
			                {
			                  	if(dAInfo.associationId)
			                    	dAAssociationId = dAInfo.associationId;
			                  	if(dAInfo.parentAssociationId)
			                    	dAParentAssociationId = dAInfo.parentAssociationId;
			   
			                 	districtAssociationEntries.insert({
			                    	"tournamentId":xdata.tournamentId,
			                    	"associationId":playerInfo.associationId,"parentAssociationId":dAParentAssociationId,
			                    	"totalFee":sum.toString(),"paidOrNot":false
			                  	})
			                }
	              		}
	            	}
	          	}
	          	
	            return true;
	        }
    	}catch(e){
    		errorLog(e)
    	}
    
  	},
  	
  	
	"eventListUnderTourn": async function(tournamentId,userId)
	{
    	try 
      	{
      		var resultJson = {};
	        var userDetails = nameToCollection(userId).findOne({"userId": userId});
	        var userGender = "";
	        var userDOB = "";
	        var tournInfo = events.findOne({"tournamentEvent":true,"_id":tournamentId});
			var tournOrganizer = "";
	        var tournSport = "";
	        var userSport = "";

	        var eventsUnderTournament = [];
	        if(userDetails == undefined)
	        {
	          	resultJson["status"] = "failure";
	        	resultJson["response"] = "Invalid user";
	        	return resultJson;
	        }
	        if(tournInfo == undefined)
	        {
	          	resultJson["status"] = "failure";
	        	resultJson["response"] = "Invalid tournament details";
	        	return resultJson;
	        }
	        	
	        
	        if(tournInfo && userDetails)
	        {
	          	userGender = userDetails.gender.toUpperCase();
	          	userDOB = userDetails.dateOfBirth;

				if(userDetails.interestedProjectName && userDetails.interestedProjectName.length > 0 && userDetails.interestedProjectName[0] != null)
	          		userSport = userDetails.interestedProjectName[0];

	          	tournOrganizer  = tournInfo.eventOrganizer;
	          	tournSport = tournInfo.projectId[0];
	          	eventsUnderTournament = tournInfo.eventsUnderTournament;

	        	var subscribeBoolean = false;
		        if(moment(moment(tournInfo.eventSubscriptionLastDate1).format("YYYY-MM-DD"))>=moment(moment.tz(tournInfo.timeZoneName).format("YYYY-MM-DD")) && (tournSport.trim() == userSport.trim()))         
		          	subscribeBoolean = true;            
		        else 
		          	subscribeBoolean = false;

		        var eventsUnderTourList = events.find({tournamentEvent: false,tournamentId: tournamentId,projectType :{$ne:3}},
		        	{fields:{"_id":1,"eventName":1,"abbName":1,
		             	"prize":1,"projectType":1,
		             	"tournamentId":1,"allowSubscription":1,
		             	"eventParticipants":1,"projectId":1,
		             	"eventOrganizer":1}}).fetch();
	        	var jsonS = [];
	        	var jsonS1 = [];
	        	

        		var eventFeeSettingsInfo = eventFeeSettings.findOne({"tournamentId":tournamentId});
        		if(eventFeeSettingsInfo)
        			resultJson["eventFeeSettings"] = eventFeeSettingsInfo;

        		var playerEntriesInfo = playerEntries.findOne({"tournamentId":tournamentId,"playerId":userId});
        		if(playerEntriesInfo)
        			resultJson["playerEntries"] = playerEntriesInfo;

        		if(eventFeeSettingsInfo != undefined && eventFeeSettingsInfo != null){
        			var joinSingleTeam = []
        			if(eventFeeSettingsInfo.events != undefined && eventFeeSettingsInfo.events != null){
        				joinSingleTeam =  eventFeeSettingsInfo.events
        				var s = _.sortBy(eventsUnderTourList, function(tour) {
                                    return joinSingleTeam.indexOf(tour.abbName);
                                });
	        			eventsUnderTourList = s;
        			}
        		}
        		
        		var playerTeamEntriesInfo = playerTeamEntries.findOne({"tournamentId":tournamentId,"playerId":userId},
        			{fields:{
        				"playerId" : 1,  
        				"tournamentId" : 1,
        				"subscribedTeamID" : 1, 
        				"subscribedTeamsArray" : 1
        		}});
        		if(playerTeamEntriesInfo)
        			resultJson["playerTeamEntries"] = playerTeamEntriesInfo;


		        for(var i=0;i<eventsUnderTourList.length;i++)
		        {
		          	var eventUnderTour = eventsUnderTourList[i];
		          	eventUnderTour['subscribeBoolean'] = subscribeBoolean;
		          	var filterStatus = false;
		          	var filterProjectType = eventsUnderTourList[i].projectType;
		          	var userDate = "";
		          	var filterDate = "";
		          	var birthDetails = dobFilterSubscribe.findOne({
		                "mainProjectId": tournInfo.projectId.toString(),
		                "eventOrganizer": tournInfo.eventOrganizer.toString(),
		                "tournamentId": tournamentId,
		                "details.eventId":eventUnderTour.projectId.toString()
		            	},{fields:{_id: 1, details: {$elemMatch: {"eventId": eventUnderTour.projectId.toString()}}}});


		          	if (birthDetails && birthDetails.details) 
		          	{
		            	if(birthDetails.details.length > 0)
		            	{
		              		var j = 0;     
		              		var find1 = birthDetails.details[j];
		              		var findForOnBef  = eventsOnBefore.findOne({tournamentId:tournamentId})
		                	var onBefArra = []
		                	if(findForOnBef && findForOnBef.projectIds && findForOnBef.projectIds.length){
		                		onBefArra = findForOnBef.projectIds
		                	}

				            if(find1.dateOfBirth.trim() == "NA" && find1.eventId == eventUnderTour.projectId.toString())	            
				                filterStatus = true;			          
		              		else if(find1.ranking=="yes" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString())
		              		{
		                		if(userDetails.affiliationId!==null&& userDetails.affiliationId!=undefined&& userDetails.affiliationId!="other"&&userDetails.statusOfUser=="Active")
		                		{	
		                			

		                  			if (find1.eventId == eventUnderTour.projectId.toString()) 
		                  			{
		                    			filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
		                    			userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

		                    			if( _.contains(onBefArra, find1.eventId))
		                    			{
		                    				if (new Date(userDate) <= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase()){
		                    					filterStatus =  true
		                    				}
		                    			}
		                    			else if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase()) 
		                      				filterStatus =  true
		                    			else if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL") 
		                      				filterStatus =  true
		                    			else 
		                      				filterStatus = false  
		                  			}
		                		}
		                		else if(find1.eventId == eventUnderTour.projectId.toString())	            
		                  			filterStatus = false;
		                
		              		}
		              		else if(find1.ranking=="no" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString())
		              		{
		                		if (find1.eventId == eventUnderTour.projectId.toString()) 
		                		{
		                  			filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
		                  			userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");


		                  			if( _.contains(onBefArra, find1.eventId))
		                  			{
		                  				if (new Date(userDate) <= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase())
		                    			{
		                    				filterStatus =  true
		                    			}
		                    		}
		                    		else if(new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase())
		                    		{	                    		
		                    				filterStatus = true;
		                    		}
		                  			else if(new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL")
		                    		{
		                    				filterStatus = true;
		                    		}
		                    			
		                  			else
		                  			{
		                    			filterStatus = false           
		                  			}
		                		}
		              		}
		            	}
		          	}

		          	if(filterStatus)
		          	{
		            	var subscribeTeams = [];
		            	var subscribedTeamNames = [];
		            	var teamMemberDetails = {};
		            	eventUnderTour["subscribeTeams"] =subscribeTeams;
		            	eventUnderTour["subscribedTeamNames"] =subscribedTeamNames;

		            	if(filterProjectType == 2)
		            	{
		              		var teamList = playerTeams.find({"teamManager":userId,"teamFormatId":find1.eventId}).fetch();
		              		for(var h=0 ;h < teamList.length;h++)
		              		{
		              			try{
		              				if(teamList[h] != undefined && teamList[h]._id)
		              				{
		              					var result =  await Meteor.call("validateExistingTeam",teamList[h]._id)
				                  		if(result)
				                  		{
				                  			var teamInfoJson = {};
				                  			teamInfoJson["_id"] = teamList[h]._id;
				                  			teamInfoJson["teamName"] = teamList[h].teamName;
				                    		subscribeTeams.push(teamInfoJson);
				                    		subscribedTeamNames.push(teamList[h].teamName);
				                    		if(result.teamMembers){
				                    			eventUnderTour[teamList[h]._id] = result.teamMembers;
				                    		}
				                      		var playerTeamEntriesInfo = playerTeamEntries.findOne({"playerId":userId,"tournamentId":tournamentId});
				                      		if(playerTeamEntriesInfo)
				                        		eventUnderTour["subscribedTeamDetails"] = playerTeamEntriesInfo;
				                  		}
		              				}
		                			
			                  	}catch(e){
			                  	}
		                		

		              		}
		              		eventUnderTour["subscribeTeams"] =subscribeTeams;
		              		eventUnderTour["teamMemberDetails"] =teamMemberDetails;

		            	}
		            	var paymentTransactionEntry = paymentTransaction.findOne(
		            		{"tournamentId":tournamentId,
		            		"playerId":userId,
		            		"subscribedEvents":{$in:[eventUnderTour._id]}})
		            	if(paymentTransactionEntry)
		            		eventUnderTour["paymentTransaction"] = "yes";
		            	else
		            		eventUnderTour["paymentTransaction"] = "no";

		            	jsonS.push(eventUnderTour)
		          	}
		          	var paymentTransactionEntry = paymentTransaction.findOne(
		            		{"tournamentId":tournamentId,
		            		"playerId":userId,
		            		"subscribedEvents":{$in:[eventUnderTour._id]}})
		            	if(paymentTransactionEntry)
		            		eventUnderTour["paymentTransaction"] = "yes";
		            	else
		            		eventUnderTour["paymentTransaction"] = "no";

		          		jsonS1.push(eventUnderTour)
		        }


		        resultJson["status"] = "success";
		        resultJson["data"] = jsonS;
		        resultJson["data1"] = jsonS1;
				resultJson['subscribeBoolean'] = subscribeBoolean;




		        return resultJson;
	        }
	    } catch (e) {
	    }
    },
    eventListUnderTournAPI: async function(tournamentId,userId)
	{
    	try 
      	{
      		var resultJson = {};
      		var userDetails = undefined;
      		if(nameToCollection(userId))
      		{
      			//userDetails = userDetailssTT.findOne({"userId": userId});
	       		userDetails = nameToCollection(userId).findOne({"userId": userId});
      		}
	       
	        var userGender = "";
	        var userDOB = "";
	        var tournInfo = events.findOne({"tournamentEvent":true,"_id":tournamentId});
			var tournOrganizer = "";
	        var tournSport = "";
	        var eventsUnderTournament = [];
	        if(userDetails == undefined)
	        {
	          	resultJson["status"] = "failure";
	        	resultJson["response"] = "Invalid user";
	        	return resultJson;
	        }
	        if(tournInfo == undefined)
	        {
	          	resultJson["status"] = "failure";
	        	resultJson["response"] = "Invalid tournament details";
	        	return resultJson;
	        }
	        	
	        
	        if(tournInfo && userDetails)
	        {
	          	userGender = userDetails.gender.toUpperCase();
	          	userDOB = userDetails.dateOfBirth;

	          	tournOrganizer  = tournInfo.eventOrganizer;
	          	tournSport = tournInfo.projectId[0];
	          	eventsUnderTournament = tournInfo.eventsUnderTournament;

	        	var subscribeBoolean = false;
		        if(moment(moment(tournInfo.eventSubscriptionLastDate1).format("YYYY-MM-DD"))>=moment(moment.tz(tournInfo.timeZoneName).format("YYYY-MM-DD")))           
		          	subscribeBoolean = true;            
		        else 
		          	subscribeBoolean = false;

		        var eventsUnderTourList = events.find({tournamentEvent: false,tournamentId: tournamentId,projectType :{$ne:3}},
		        	{fields:{"_id":1,"eventName":1,"abbName":1,
		             	"prize":1,"projectType":1,
		             	"tournamentId":1,"allowSubscription":1,
		             	"eventParticipants":1,"projectId":1,
		             	"eventOrganizer":1}}).fetch();
	        	var jsonS = [];


        		var eventFeeSettingsInfo = eventFeeSettings.findOne({"tournamentId":tournamentId});
        		if(eventFeeSettingsInfo)
        			resultJson["eventFeeSettings"] = eventFeeSettingsInfo;

        		var playerEntriesInfo = playerEntries.findOne({"tournamentId":tournamentId,"playerId":userId});
        		if(playerEntriesInfo)
        			resultJson["playerEntries"] = playerEntriesInfo;

        		if(eventFeeSettingsInfo != undefined && eventFeeSettingsInfo != null){
        			var joinSingleTeam = []
        			if(eventFeeSettingsInfo.events != undefined && eventFeeSettingsInfo.events != null){
        				joinSingleTeam =  eventFeeSettingsInfo.events
        				var s = _.sortBy(eventsUnderTourList, function(tour) {
                                    return joinSingleTeam.indexOf(tour.abbName);
                                });
	        			eventsUnderTourList = s;
        			}
        		}

		        for(var i=0;i<eventsUnderTourList.length;i++)
		        {
		          	var eventUnderTour = eventsUnderTourList[i];
		          	eventUnderTour['subscribeBoolean'] = subscribeBoolean;
		          	var filterStatus = false;
		          	var filterProjectType = eventsUnderTourList[i].projectType;
		          	var userDate = "";
		          	var filterDate = "";
		          	var birthDetails = dobFilterSubscribe.findOne({
		                "mainProjectId": tournInfo.projectId.toString(),
		                "eventOrganizer": tournInfo.eventOrganizer.toString(),
		                "tournamentId": tournamentId,
		                "details.eventId":eventUnderTour.projectId.toString()
		            	},{fields:{_id: 1, details: {$elemMatch: {"eventId": eventUnderTour.projectId.toString()}}}});


		          	if (birthDetails && birthDetails.details) 
		          	{
		            	if(birthDetails.details.length > 0)
		            	{
		              		var j = 0;     
		              		var find1 = birthDetails.details[j];

				            if(find1.dateOfBirth.trim() == "NA" && find1.eventId == eventUnderTour.projectId.toString())	            
				                filterStatus = true;
				            
		              		else if(find1.ranking=="yes" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString())
		              		{
		                		if(userDetails.affiliationId!==null&& userDetails.affiliationId!=undefined&& userDetails.affiliationId!="other"&&userDetails.statusOfUser=="Active")
		                		{
		                  			if (find1.eventId == eventUnderTour.projectId.toString()) 
		                  			{
		                    			filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
		                    			userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

		                    			if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase()) 
		                      				filterStatus =  true
		                    			else if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL") 
		                      				filterStatus =  true
		                    			else 
		                      				filterStatus = false  
		                  			}
		                		}
		                		else if(find1.eventId == eventUnderTour.projectId.toString())	            
		                  			filterStatus = false;
		                
		              		}
		              		else if(find1.ranking=="no" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString())
		              		{
		                		if (find1.eventId == eventUnderTour.projectId.toString()) 
		                		{
		                  			filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
		                  			userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

		                  			if(new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase())
		                    			filterStatus = true;
		                  			else if(new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL")
		                    			filterStatus = true;
		                  			else
		                    			filterStatus = false           
		                		}
		              		}
		            	}
		          	}

		          	if(filterStatus)
		          	{
		            	var subscribeTeams = [];
		            	var subscribedTeamNames = [];
		            	var teamMemberDetails = {};
		            	eventUnderTour["subscribeTeams"] =subscribeTeams;
		            	eventUnderTour["subscribedTeamNames"] =subscribedTeamNames;

		            	if(filterProjectType == 2)
		            	{
		              		var teamList = playerTeams.find({"teamManager":userId,"teamFormatId":find1.eventId}).fetch();
		              		for(var h=0 ;h < teamList.length;h++)
		              		{
		                		var result = await Meteor.call("validateExistingTeam",teamList[h]._id)
		                		try{
			                  		if(result)
			                  		{
			                  			var teamInfoJson = {};
			                  			teamInfoJson["_id"] = teamList[h]._id;
			                  			teamInfoJson["teamName"] = teamList[h].teamName;
			                    		if(result.teamMembers)
			                    		{
			                    			teamInfoJson["teamDetails"] = result.teamMembers;
			                    			subscribeTeams.push(teamInfoJson);

			                    			//eventUnderTour[teamList[h].teamName] = result.teamMembers;
			                    			//eventUnderTour[teamList[h]._id] = result.teamMembers;
			                    		}
			                      		//eventUnderTour[teamList[h].teamName+"id"] = result._id;
			                      		var playerTeamEntriesInfo = playerTeamEntries.findOne({"playerId":userId,"tournamentId":tournamentId});
			                      		if(playerTeamEntriesInfo)
			                        		eventUnderTour["subscribedTeamDetails"] = playerTeamEntriesInfo;
			                  		}
		                		}catch(e){

		                		}

		              		}
		              		eventUnderTour["subscribeTeams"] =subscribeTeams;
		              		eventUnderTour["teamMemberDetails"] =teamMemberDetails;

		            	}

		            	var paymentTransactionEntry = paymentTransaction.findOne({"tournamentId":tournamentId,"playerId":userId,"subscribedEvents":{$in:[eventUnderTour._id]}})
		            	if(paymentTransactionEntry)
		            		eventUnderTour["paymentTransaction"] = "yes";
		            	else
		            		eventUnderTour["paymentTransaction"] = "no";

		            	jsonS.push(eventUnderTour)
		          	}
		        }
		        resultJson["status"] = "success";
		        resultJson["data"] = jsonS;

		        return resultJson;
	        }
	    } catch (e) {
	    }
    },
    "subscriptionTeamChange":async function(data)
    {
    	try{
    		var resultJson = {};

    		if(data.tournamentId && data.userId && data.teamIdsArray && data.subscribedTeamsArray)
    		{
    			var tournamentInfo = events.findOne({"_id":data.tournamentId});
    			var userInfo = Meteor.users.findOne({"userId":data.userId,"role":"Player"});
    			if(tournamentInfo && userInfo)
    			{
    				var playerTeamEntriesInfo = playerTeamEntries.findOne({
    					"playerId":data.userId,"tournamentId":data.tournamentId
    				})
    				if(playerTeamEntriesInfo)
    				{
    					var updateStatus = playerTeamEntries.update(
    						{"playerId":data.userId,"tournamentId":data.tournamentId},
    						{$set:{
    							"subscribedTeamsArray":  data.subscribedTeamsArray,
    							"subscribedTeamID":data.teamIdsArray
    						}});
    					if(updateStatus)
    					{
    						var updatedResponse ;
    						var result = await Meteor.call("eventListUnderTourn",data.tournamentId,data.userId)
    						try{
    							if(result)
    							{
    								updatedResponse =  result;
    							}
    						}catch(e){}
    						return updatedResponse;
    					}
    					else
    					{
    						resultJson["status"] = "failure";
    						resultJson["response"] = "Could not change subscribed team"
    						return resultJson;
    					}
    				}
    				else
    				{
    					resultJson["status"] = "failure";
    					resultJson["response"] = "Could not change subscribed team"
    					return resultJson;
    				}
    			}
    			else
    			{
    				var responseMessage = "";
    				if(tournamentInfo == undefined && userInfo == undefined)
    					responseMessage = "Invalid tournament and user";
    				else if(tournamentInfo == undefined)
    					responseMessage = "Invalid tournament";
    				else
    					responseMessage = "Invalid user";

    				resultJson["status"] = failure;
    				resultJson["response"] = responseMessage;
    				return resultJson;
    			}
    		}
    		else
    		{
    			resultJson["status"] = "failure";
    			resultJson["response"] = "Invalid params";
    			return resultJson;
    		}

    	}catch(e){

    	}
    },
        //app  method(player,5s)
    eventSubscription:async function(caller,apiKey,data)
    {
        try{

            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else
            {

                var subscribedIDs = [];
                var unSubscribedIDs = [];
                var teamSubscribeIDs = [];
                var oldSubscribedIDs = [];
                var organizerID = "";
                    
                if(data.teamSubscribe && data.teamSubscribe == "true")
                {

                    var eventUpdate;

                    var xdata = data.teamSubscribeData
                    var param = xdata;


                    if(typeof data.teamSubscribeData == "string"){
                        xdata = data.teamSubscribeData.replace("\\", "");
                        param = JSON.parse(xdata);
                    }
                    
                    if(param.teamSubscribeIDs)
                        teamSubscribeIDs = param.teamSubscribeIDs;
                   
                    var userId = param.userId;
                    var playerInfo;
                    if(nameToCollection(userId))
                    {
                        playerInfo = nameToCollection(userId).findOne({"userId":userId});
                    }
                    if(playerInfo)
                    {
                        if(playerInfo.academyId)
                            param.academyId = playerInfo.academyId;
                        else 
                            param.academyId = "other";
                        if(playerInfo.associationId)
                            param.associationId = playerInfo.associationId;
                        else
                            param.associationId = "other";
                        if(playerInfo.parentAssociationId)
                            param.parentAssociationId = playerInfo.parentAssociationId;
                        else
                            param.parentAssociationId = "other";
                    }
                    var result = await Meteor.call("eventsCollectionUpdateViaApp",param.tournamentId, param.eventCollection)
                    try
                    {
                        if(result)
                        {
                            eventUpdate = result;  
                            subscriptionStatus = true;                    
                        }                       
                    }catch(e){}
                    
                    if(eventUpdate)
                    {
                        var eventEntries = [];
                        eventEntries.push(param);
                        var aa = await Meteor.call("teamEntriesCollectionUpdateViaApp",param.tournamentId, eventEntries,param.teamEventsData);
                    }
                }

                var subscribeUpdate = false;
                var unSubscribeUpdate = false;
                if(data.subscribeID && data.subscribeID.length > 0)
                {
                	subscribeUpdate = events.update({"abbName": {$in: data.subscribeID},tournamentId:data.tournamentId}, {$addToSet:{"eventParticipants":data.userId}}, {multi:true});

                }
                if(data.unSubscribeID && data.unSubscribeID.length > 0)
                {
                	unSubscribeUpdate = events.update({"abbName": {$in: data.unSubscribeID},tournamentId:data.tournamentId}, {$pull:{"eventParticipants":data.userId}}, {multi:true});

                }

                  
                if(subscribeUpdate || unSubscribeUpdate)
                {
                    var aa = await Meteor.call("subscribeEventsViaApp",data); 
                }

                if(data.oldSubscribeID)
                	oldSubscribedIDs = data.oldSubscribeID;

        
                var transactionType = "payment";

                if(data.transactionID!=null && data.transactionID!=undefined)
                {

                	//false
                	var entries = data.subscribeID.concat(data.oldSubscribeID);
                	var withdrawEntries = data.unSubscribeID;

                	var raw = events.rawCollection();
					var distinct = Meteor.wrapAsync(raw.distinct, raw);
					var entriesID =  distinct('_id',
						{
							"tournamentId" : data.tournamentId,
							"abbName" : {$in:entries}
						});

					var withdrawEntriesID = distinct('_id',
						{
							"tournamentId" : data.tournamentId,
							"abbName" : {$in:withdrawEntries}
						});

					


                    if(data.transactionType)
                    {
                        transactionType = data.transactionType;
                        if(transactionType == "promo")
                        {
                            var promoInfo = promo.findOne({"promo":{
                                $regex: new RegExp('^' + data.transactionID + '$', "i")
                                },"status":"active"});
                            if(promoInfo)
                                data.transactionID = promoInfo.promo;
                            
                        }
                    }

                  
                  

                    if(data.transactionAmount)
                    {
                        paymentTransaction.insert({
                            "tournamentId":data.tournamentId,
                            "playerId":data.userId,
                            "transactionId":data.transactionID,
                            "transactionFee":data.transactionAmount,
                            "subscribedEvents":entriesID,
                            "unSubscribedEvents":withdrawEntriesID,
                            "transactionType":transactionType
                        }) 
                    }
                    else
                    {

                       paymentTransaction.insert({
                            "tournamentId":data.tournamentId,
                            "playerId":data.userId,
                            "transactionId":data.transactionID,
                            "subscribedEvents":entriesID,
                            "unSubscribedEvents":withdrawEntriesID,
                            "transactionType":transactionType
                        }) 
                    }

                          
                }
               
                
                var result = await Meteor.call("getAllSubscribersOfTournament",data.tournamentId,data.userId)
                try{
                    if(result)
                    {
                        var eventOrganizerEmail ="";
                        var playerEmail = "";
                        var playerName = "";

                        if(nameToCollection(data.userId))
                        {
                            var userInfo = nameToCollection(data.userId).findOne({"userId":data.userId});
                            if (userInfo && userInfo.emailAddress) 
                            {
                                if(userInfo.userName)
                                    playerName = userInfo.userName;
                                playerEmail = userInfo.emailAddress

                            }
                        }
                       
                        
                        var tournInfo = events.findOne({
                            "_id": data.tournamentId,tournamentEvent: true})
                        if (tournInfo) 
                        {
                            organizerID = tournInfo.eventOrganizer;
                            eventOrganizerInfo = Meteor.users.findOne({
                                "_id": tournInfo.eventOrganizer
                            })
                            if (eventOrganizerInfo && eventOrganizerInfo.emailAddress) 
                                eventOrganizerEmail = eventOrganizerInfo.emailAddress
                        
                        }
                       
                       
                          var eventFeeSettingsinfo = eventFeeSettings.findOne({
                            "tournamentId": data.tournamentId
                        })

                        if (eventFeeSettingsinfo)
                        {

                            eventsNAMES = eventFeeSettingsinfo.events;
                            eventsFees = eventFeeSettingsinfo.eventFees;
                            teamEventNames = eventFeeSettingsinfo.teamEvents;
                            teamEventFEES = eventFeeSettingsinfo.teamEventFees
                        

                            var dataContext = {
                                message: "Recent subscription details of tournament",
                                tournament: tournInfo.eventName,
                                eventsDetailsMail: eventsNAMES,
                                teamEventNamesMAIL:teamEventNames,
                                teamEventFEESMAIL:teamEventFEES,
                                playersWithCheckMail: result,
                                tournamentId:data.tournamentId
                            }



                            Template.registerHelper("eventFeesSendMAIL", function(data,tournamentId) {
                                if (data) {
                                    var eventDetails = events.findOne({
                                        "abbName": data,
                                        "tournamentId": tournamentId
                                    })
                                    if (eventDetails && eventDetails.prize) {
                                        return eventDetails.prize
                                    }
                                }
                            });

                            Template.registerHelper("slNUM", function(data) {
                                try {
                                    return parseInt(parseInt(data) + 1)
                                } catch (e) {}
                            })

                            Template.registerHelper('upcomingformatDate', function(date) {
                                try {
                                    if (date != "" || date != undefined || date != null || date.trim() != " ") {
                                        return moment(new Date(date)).format("DD MMM YYYY");
                                    }
                                } catch (e) {}
                            });

                            Template.registerHelper("checkZEROorONE", function(data) {
                                if (parseInt(data) == 0) {
                                    return false
                                } else {
                                    return true
                                }
                            });

                            Template.registerHelper('getTeamNameForId', function(data) {
                                try {
                                    var text = data.replace(/(\r\n|\n|\r)/gm, '<br/>');;
                                    if (text) {
                                        return new Spacebars.SafeString(text);
                                    }
                                } catch (e) {}
                            });


                            SSR.compileTemplate('sendSubscriptionViaApp', Assets.getText('sendSubscriptionViaApp.html'));

                            var html = SSR.render('sendSubscriptionViaApp', dataContext);

                            var options = {
                                from: "iplayon.in@gmail.com",
                                to: playerEmail,
                                cc: eventOrganizerEmail,                                       
                                subject: "iPlayOn:Subscription successful",
                                html: html
                            }

                            var smsEvents  = [];
                            if(data.transactionID!=null && data.transactionID!=undefined && data.transactionID.trim().length != 0)
                            {
                                var combinedIDs = subscribedIDs.concat(teamSubscribeIDs);
                                var totalSubscribeIDs = combinedIDs.concat(oldSubscribedIDs);
                                smsEvents = events.find({"_id":{$in:totalSubscribeIDs}},{"abbName":1,"prize":1}).fetch();

                            }
                            else
                            {
                                var combinedIDs = subscribedIDs.concat(teamSubscribeIDs);
                                smsEvents = events.find({"_id":{$in:combinedIDs}},{"abbName":1,"prize":1}).fetch();

                            }

                            var smsTemplatePrior = "";
                            var smsTemplate = "";
                            var smsEventsTot = 0;
                            var smsEventsList = "";
                            for(var v=0;v<smsEvents.length;v++)
                            {
                                if(v == 0)
                                {
                                    smsTemplate += "\n Events:\n";
                                }
                                if(smsEvents[v] != null && parseInt(smsEvents[v]["prize"]) >= 0)
                                {             
                                    smsTemplate += smsEvents[v]["abbName"]+" - Rs."+smsEvents[v]["prize"]+"\n";
                                    smsEventsList += smsEvents[v]["abbName"];
                                    if((v+1) == smsEvents.length)
                                    {

                                    }
                                    else
                                    {
                                        smsEventsList += ","
                                    }
                                }
                                if(smsEvents[v]["prize"] != null)
                                    smsEventsTot += parseInt(smsEvents[v]["prize"]);
                            }
                            smsTemplatePrior = "Hi "+playerName+",Here is your confirmation of recent subscription. Total fee Rs."+smsEventsTot+"  on iPlayOn of tournament "+tournInfo.eventName;
                            if(data.transactionID!=null && data.transactionID!=undefined && data.transactionID.trim().length != 0)
                                smsTemplatePrior += ". Transaction ID:"+data.transactionID;

                          


                            var mailSms = smsTemplatePrior+""+smsTemplate;

                            var smsData = {};
                            smsData["type"] = "eventSubscription";
                            smsData["userName"] = playerName;
                            smsData["totEntryFee"] = smsEventsTot;
                            smsData["events"] = smsEventsList;
                            smsData["tournamentName"] = tournInfo.eventName;
                            smsData["tournamentDate"] = moment(new Date(tournInfo.eventStartDate1)).format("DD-MM-YYYY")

                            if(data.transactionID != null && data.transactionID != undefined && data.transactionID.trim().length != 0)
                                smsData["transactionId"] = data.transactionID;



                            smsTemplate = Meteor.call("fetchSMSTemplate",smsData);

                            
                            
                            Meteor.call("sendSMSEmailNotification",data.userId,mailSms,options,[organizerID],function(error,result){
                                                
                            });
                            
        
                      
                        }


                    }
                }catch(e){
                    errorLog(e)
                }
                return true;
            }

        }catch(e){

            errorLog(e)
        }
    },

    
 
});



