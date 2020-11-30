import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
  /**
     * Meteor Method to fetch list of entries based on tournamentId and eventId
     * @collectionName : events (if upcoming tournament),pastEvents(if past tournament)
     * @passedByValues : tournamentId,eventId   
     * @dataType : String,String 
     * @dbQuery : fetch list of entries based on tournamentId and eventId
     * @methodDescription :  fetch list of entries based on tournamentId and eventId
     * @returnValue : array of players with points   
     * Usage - Player,5s
    */
	  getEntriesList: function (tournamentId,eventId) 
  	{
    	try
    	{

		    tournamentId = tournamentId.trim();
		    eventId = eventId.trim();
		    var userDetail = [];
		    var eventArray =[];
		    var count = 0;
		    var arr=[];
		    var userList = "";
		    var sportID= "";
		    var eventName="";
		    var eventInfo;
		    var eventParticipants;
      	eventInfo = events.findOne({"tournamentEvent":false,"tournamentId":tournamentId,"_id":eventId});
      	if(eventInfo == undefined)
          eventInfo = events.findOne({"tournamentEvent":false,"tournamentId":tournamentId,"eventName":eventId});
        if(eventInfo == undefined)
        	eventInfo = pastEvents.findOne({"tournamentEvent":false,"tournamentId":tournamentId,"_id":eventId});
        if(eventInfo == undefined)
          eventInfo = pastEvents.findOne({"tournamentEvent":false,"tournamentId":tournamentId,"eventName":eventId});
  
      		if(eventInfo && eventInfo.eventParticipants)
      		{
        		eventParticipants = eventInfo.eventParticipants;
        		var tourSportInfo = events.findOne({"_id":tournamentId,"tournamentEvent":true});
        		if(tourSportInfo == undefined)
          			tourSportInfo = pastEvents.findOne({"_id":tournamentId,"tournamentEvent":true});
        		if(tourSportInfo)
         			sportID = tourSportInfo.projectId[0]; 

        		var eventName = eventInfo.eventName;
        		if(eventParticipants)
        		{
          			for(var i = 0; i<eventParticipants.length; i++)
          			{
            			var userInfo = nameToCollection(eventParticipants[i]).findOne({"userId":eventParticipants[i]});
                  var clubInfo = undefined;
            			if(userInfo)
            			{
              				var organizerId = eventInfo.eventOrganizer;
              				if(userInfo.clubNameId)
                			clubInfo = academyDetails.findOne({"userId":userInfo.clubNameId});

              				
                      var pointsObj = PlayerPoints.findOne({
                        "playerId": userInfo.userId,
                        "sportId": sportID,
                        "eventName": eventName 
                      });


              				var points = 0;
              				if(pointsObj)
              				{
                        var pointsInfo = PlayerPoints.aggregate([
                            {$match:{
                                "playerId":userInfo.userId,
                                "sportId":sportID,
                                "eventName":eventName
                            }},
                            {$group:{
                                "_id":"$playerId",
                                "totalPoints":{$sum:"$totalPoints"}
                            }}
                        ]);
                        if (pointsInfo && pointsInfo.length > 0 && pointsInfo[0].totalPoints)
                            points = pointsInfo[0].totalPoints;

                				
                
              				}

              				var playerTeamEntriesInfo = playerTeamEntries.findOne({
                				"tournamentId": tournamentId,
                				"subscribedTeamsArray.eventName": eventName,
                				"playerId":userInfo.userId
					            }, {
					                fields: {
					                    _id: 0,
					                    subscribedTeamsArray: {
					                        $elemMatch: {
					                            "eventName": eventName
					                        }
					                    }
					                }
              				});
	              			var teamName = "";
	              			if(playerTeamEntriesInfo)
	              			{
	                			if(playerTeamEntriesInfo.subscribedTeamsArray && playerTeamEntriesInfo.subscribedTeamsArray.length > 0)
	                			{
	                  				if(playerTeamEntriesInfo.subscribedTeamsArray[0].teamId)
	                  				{
	                    				var playerTeamInfo = playerTeams.findOne({"_id":playerTeamEntriesInfo.subscribedTeamsArray[0].teamId});
	                    				if(playerTeamInfo)
	                    				{
	                      					teamName = playerTeamInfo.teamName;
	                    				}
	                  				}
	                			}

	              			}

	              			if(clubInfo)
	                			userDetail.push({"playerID":userInfo.userId,"playerName":userInfo.userName,"points":points,"Academy":clubInfo.clubName,"teamName":teamName});
	              			else
	                			userDetail.push({"playerID":userInfo.userId,"playerName":userInfo.userName,"points":points,"Academy":"","teamName":teamName});
            			}

          			}
        		}

      		}
      
	      	if(userDetail.length!=0)
	      	{
	        	userDetail.sort(function(a, b){
	          		return parseInt(b.points) - parseInt(a.points);
	        	});
	        	userDetail.map(function(document, index){
	          		document["rank"]=parseInt(index+1);
	          		document["slNo"] = parseInt(index+1); 
	        	});
	      	}

	      	if(userDetail)
	      	{
	        	return userDetail;
	      	}
    	}catch(e){
    	}
  	},

    /**
     * Meteor Method to fetch list of categories of tournament and its event draws
     * @collectionName : MatchCollectionDB,teamMatchCollectionDB
     * @passedByValues : tournamentId   
     * @dataType : String 
     * @dbQuery : fetch list of categories of tournament and its event draws
     * @methodDescription :  fetch list of categories of tournament and its event draws
     * @returnValue : json with status(success/failure),message,events(array of categories),
        data(array of json having eventName Vs results)    
     * Usage - Player,5s
    */
  	"viewTournamentResults":async function(tournamentId)
    {
    	try{
    		var resultJson = {};
    		var resultData = [];
    		var raw1 = MatchCollectionDB.rawCollection();
		    var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
		    var eventList1 =  distinct1('eventName',{"tournamentId":tournamentId});


		    var raw2 = teamMatchCollectionDB.rawCollection();
		    var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
		    var eventList2 =  distinct2('eventName',{"tournamentId":tournamentId});
		    
		    var eventList = eventList1.concat(eventList2);
		    for(var i=0 ;i<eventList.length;i++)
		    {
          try{
		    	  var result = await Meteor.call('resultSummary',tournamentId, eventList[i]);
		    		if(result)
		    		{
		    			var summaryJson = {};
		    			if(result.status)
		    			{
		    				if(result.data)
		    				{
		    					summaryJson["eventName"] = eventList[i];

		    					if(result.data.winner)
		    						summaryJson["winner"] = result.data.winner;
		    					if(result.data.rounds)
		    						summaryJson["rounds"] = result.data.rounds;
		    					resultData.push(summaryJson)

		    				}
		    			}
		    		}
          }catch(e){

          }
		    }
			
			resultJson["status"] = "success";
			resultJson["data"] = resultData;
			resultJson["events"] = eventList;

			return resultJson;
    	}catch(e){
    		resultJson["status"] = "failure";
    		resultJson["response"] = e
    	}
    },
    //need to check
    printDrawsSheetCheck:function(tournamentId,eventName)
    {
    	try{
    		 	var eventDetails = events.findOne({
                    "tournamentId": tournamentId,
                    eventName: eventName
                });
                if (eventDetails == undefined) {
                    eventDetails = pastEvents.findOne({
                        "tournamentId": tournamentId,
                        eventName: eventName
                    });
                }
                if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1){
                    return (Meteor.call('printDrawsSheet', tournamentId, eventName));
                }
                else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
                    return (Meteor.call('printDrawsSheetForTeamEvents', tournamentId, eventName));
                }

    	}catch(e)
    	{

    	}
    },
    printDrawsSheetCheckRR:function(tournamentId,eventName)
    {
      try{
          var eventDetails = events.findOne({
                    "tournamentId": tournamentId,
                    eventName: eventName
                });
                if (eventDetails == undefined) {
                    eventDetails = pastEvents.findOne({
                        "tournamentId": tournamentId,
                        eventName: eventName
                    });
                }
                if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1){
                    return (Meteor.call('generate_scoreSheet_Individual_RR', tournamentId, eventName,"",""));
                }
                else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
                    return (Meteor.call('generate_scoreSheet_Team_RR', tournamentId, eventName,"",""));
                }

      }catch(e)
      {
         errorLog(e)
      }
    },

    /* method to fetch list of categories based on sport - aptta specific */
    /**
     * Meteor Method to fetch list of categories based on sport
     * @collectionName : tournamentEvents
     * @passedByValues : data contains sportID    
     * @dataType : json 
     * @dbQuery : fetch list of categories based on sport based on sportId
     * @methodDescription :  fetch list of categories based on sport based on sportId
     * @returnValue : json with status(success/failure),message,eventsList(array of categories)    * Usage - aptta
     * Usage - aptta
    */
    fetchRankEvents:function(data)
    {
    	try
    	{
    		var resultJson = {};
    		if(data.sportID)
    		{
    			var raw = tournamentEvents.rawCollection();
			    var distinct = Meteor.wrapAsync(raw.distinct, raw);
			    var eventList =  distinct('projectSubName.projectName',{"_id":data.sportID});
	            if(eventList && eventList.length > 0)
	            {
	            	resultJson["status"] = "success";
	            	resultJson["eventsList"] = eventList;
	            }
	            else
	            {
	            	resultJson["status"] = "failure";
	            	resultJson["eventsList"] = eventList;
	            }
        		return resultJson;
    		}
    		else
    		{
    			resultJson["status"] = "failure";
            	resultJson["eventsList"] = "Invalid param";
            	return resultJson;
    		}       
    	}catch(e)
    	{
    		resultJson["status"] = "failure";
        resultJson["eventsList"] = "Invalid data";
        return resultJson;
    	}
    },
    /**
     * Meteor Method to fetch tournament wise ranking based on filters sportId,eventName,organizerId
     * @collectionName : PlayerPoints
     * @passedByValues : data contains sportID,eventName,filterData(organizerId)    
     * @dataType : json 
     * @dbQuery : Fetch data of tournament wise ranking based on filters sportId,eventName,organizerId
     * @methodDescription : based on filters sportId,eventName,organizerId , fetch tournament wise ranking 
     * @returnValue : array of players with points, rank
     * Usage - aptta
    */
    fetchRankData:function(data)
    {
      try{

        if(data.sportID && data.eventName && data.filterData)
        {

          var sportID = data.sportID.trim();
          var eventName = data.eventName.trim();
          var filterData = data.filterData.trim();
          var userDetail = [];


          var playerPointsList = PlayerPoints.find({
            "sportId":sportID,
            "organizerId":filterData,
            "eventName":eventName}).fetch();


          if(playerPointsList.length > 0)
          {
            
            for(var x=0; x<playerPointsList.length;x++)
            {
              var totalPoints = playerPointsList[x].totalPoints;
              if(totalPoints != "0")
              {
                var playerId = playerPointsList[x].playerId;
                
                var userInfo = nameToCollection(playerId).findOne({"userId": playerId},
                  {fields:{"userName":1,"userId":1,
                  "city":1,"clubNameId":1,"state":1}});
                

                if(userInfo)
                {
                  var convertedJSON = JSON.parse(JSON.stringify(userInfo));
                  var clubName;
                  var academyId="";
                  var state = "other";
                  if (convertedJSON.clubNameId == "other" || convertedJSON.clubNameId == undefined || convertedJSON.clubNameId == null)                  
                    clubName = "other";
                          
                  else 
                  {
                    var clubInfo = academyDetails.findOne({"userId": convertedJSON.clubNameId});
                    if (clubInfo) 
                    {
                      var convertedClubJSON = JSON.parse(JSON.stringify(clubInfo));
                      clubName = convertedClubJSON.clubName;
                    } else
                    clubName = "other";
                  }

                  var stateInfo = domains.findOne({"_id": convertedJSON.state});
                  if (stateInfo)
                  {
                    var convertedStateJSON = JSON.parse(JSON.stringify(stateInfo));
                    state = convertedStateJSON.domainName;
                  }

                  convertedJSON.academy = clubName;
                  convertedJSON.stateName = state;
                  convertedJSON.totPoints = totalPoints;

                  
                  if (_.findWhere(userDetail, convertedJSON) == null)
                  {
                    userDetail.push(convertedJSON);
                  }  
                }
              }
            }


          }
          if (userDetail.length != 0) 
          {
            userDetail.sort(function(a, b) {
              return parseInt(b.totPoints) - parseInt(a.totPoints);
            });
            var rankPos = 1;
            userDetail.map(function(document, index) {      
              document["rank"] = parseInt(index + 1);
              document["slNo"] = parseInt(index + 1);
            });

          }
          var resultJson = {};
          resultJson["status"] = "success";
          resultJson["data"] = userDetail;
          return resultJson;

        }
        else
        {
          var resultJson = {};
          resultJson["status"] = "failure";
          resultJson["response"] = "Invalid param";
          return resultJson;
        }
      
      }catch(e){
        errorLog(e)
        var resultJson = {};
        resultJson["status"] = "failure";
        resultJson["response"] = "Invalid data";
        return resultJson;
      }
    },
    
    /**
     * Meteor Method to fetch tournament wise ranking against player
     * @collectionName : PlayerPoints
     * @passedByValues : data contains sportID,eventName,filterData(organizerId),playerId
     * @dataType : json 
     * @dbQuery : Fetch data of tournament wise ranking against playerId
     * @methodDescription : based on the playerId , fetch tournament wise ranking against player
     * @returnValue : Json with playerInfo and tournamentInfo(T1- TournName- Points)
     * Usage - aptta
    */
    fetchTournamentRankData:function(data)
    {
      try{

        var sportID = data.sportID.trim();
        var eventName = data.eventName.trim();
        var filterData = data.filterData.trim();
        var playerId = data.playerId.trim();
        var userDetail = [];

        var playerPointsList = PlayerPoints.find({
          "sportId":sportID,
          "organizerId":filterData,
          "eventName":eventName,
          "playerId":playerId}).fetch();

        if(playerPointsList.length > 0)
        {
          //list of past tournaments organized by selected organizer
          var tournamentsOrganized = pastEvents.find({"eventOrganizer":filterData.trim(),"tournamentEvent":true}).fetch();
          organizedTourList = [];
          if(tournamentsOrganized.length > 0)
          {
            for(q=0; q<tournamentsOrganized.length; q++)
            {
              var m = q+1;
              var json = {};
              json["id"] = "T"+m;
              json["tournamentId"] = tournamentsOrganized[q]._id;
              json["tournamentName"] = tournamentsOrganized[q].eventName;
              json["points"] = "0";
              organizedTourList.push(json);
            }                      
          }

          //list of upcoming tournaments organized by selected organizer
          var tournamentsOrganized = events.find({"eventOrganizer":filterData.trim(),"tournamentEvent":true}).fetch();
          if(tournamentsOrganized.length > 0)
          {
            for(q=0; q<tournamentsOrganized.length; q++)
            {
              var m = parseInt(organizedTourList.length) + 1;
              var json = {};
              json["id"] = "T"+m;
              json["tournamentId"] = tournamentsOrganized[q]._id;
              json["tournamentName"] = tournamentsOrganized[q].eventName;
              json["points"] = "0";
              organizedTourList.push(json);
            }                      
          }

           //list of external tournament 
          var exttournamentsOrganized = PlayerPoints.findOne({"sportId":sportID,
            "organizerId":filterData,"eventName":eventName});
            if(exttournamentsOrganized)
            {
              if(exttournamentsOrganized.extTournamentCount)
              {
                var extTournament = exttournamentsOrganized.extTournament;
                for(h=0;h<extTournament.length;h++)
                {
                  var m = parseInt(organizedTourList.length) + 1;
                  var json = {};
                  json["id"] = "T"+m;
                  json["tournamentId"] = extTournament[h];
                  json["tournamentName"] =  extTournament[h];
                  json["points"] = "0";
                  organizedTourList.push(json);
                }
              }
            }


          for(var x=0; x<playerPointsList.length;x++)
          {
            var totalPoints = playerPointsList[x].totalPoints;
            if(totalPoints != "0")
            {
              var playerId = playerPointsList[x].playerId;
              
              var userInfo = nameToCollection(playerId).findOne({"userId": playerId},{fields:{"userName":1,"userId":1}})
              if(userInfo)
              {
                var convertedJSON = JSON.parse(JSON.stringify(userInfo));
                var destinationArray = JSON.parse(JSON.stringify(organizedTourList));            
                
                convertedJSON.totPoints = totalPoints;

                //tournament points
                var totTournaments = playerPointsList[x].eventPoints;
                for(h=0; h<totTournaments.length; h++)
                {
                  var points_tournamentId = playerPointsList[x].eventPoints[h].tournamentId;
                  var pointsGained = playerPointsList[x].eventPoints[h].tournamentPoints;
                  var points_tournamentName;
                  if(playerPointsList[x].eventPoints[h].tournamentName)
                    points_tournamentName = playerPointsList[x].eventPoints[h].tournamentName;
                  for(var u=0; u<destinationArray.length;u++)
                  {
                    if(destinationArray[u].tournamentId == points_tournamentId)
                    {             
                      destinationArray[u].points = pointsGained;
                      convertedJSON["tournamentInfo"] = destinationArray;
                    }
                    else 
                    {
                      if(destinationArray[u].tournamentId == points_tournamentName)
                      {
                        destinationArray[u].points = pointsGained;
                        convertedJSON["tournamentInfo"] = destinationArray;
                      }                                                               
                    }
                  }

                }
                return convertedJSON;  
              }
            }
          }


        }
      }catch(e){
      }
    }
})