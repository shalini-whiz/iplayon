import {nameToCollection} from '../dbRequiredRole.js'
import {playerDBFind} from '../dbRequiredRole.js'
import { MatchCollectionDB} from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB} from '../../publications/MatchCollectionDbTeam.js';
import { computeBrackets } from '../TTFI_methods/draws_functions.js';

import { ret_show } from '../TTFI_methods/draws_functions.js';

							var algArr = [];
							var gPlayerVec = [];


Meteor.methods({

	"fetchCarriedPoints":function(data)
	{
		try{
			algArr = [];
			gPlayerVec = [];

			if(data.year && this.userId != undefined && this.userId != null)
			{
				var currentYear = parseInt(data.year);
				var lastYear = parseInt(currentYear - 1);
				var userId = this.userId;

				
				var pastTourList = pastEvents.aggregate([
					{$match:{
						"eventOrganizer":userId,
						"tournamentEvent":true,
					}},
					{ "$project": {
					    "year":{"$year":"$eventStartDate1"},
					    "eventName":"$eventName",
					    "eventStartDate":"$eventStartDate1",
					    "eventEndDate":"$eventEndDate1",
					    "startDate":"$eventStartDate",
					    "endDate":"$eventEndDate"
					}},
				 	{"$match":{ 
				 		"$or":[{"year":currentYear},{"year":lastYear}]
				   	}},
				   	{"$sort":{
				   		"eventEndDate":-1
				   	}}
				 ]);


				var currentTourList = events.aggregate([
					{$match:{
						"eventOrganizer":userId,
						"tournamentEvent":true,
					}},
					{ "$project": {
					    "year":{"$year":"$eventStartDate1"},
					    "eventName":"$eventName",
					    "eventStartDate":"$eventStartDate1",
					    "eventEndDate":"$eventEndDate1",
					    "startDate":"$eventStartDate",
					    "endDate":"$eventEndDate"

					}},
				 	{"$match":{ 
				 		"$or":[{"year":currentYear},{"year":lastYear}]
				   	}},
				   	{"$sort":{
				   		"eventEndDate":-1
				   	}}
				 ])

				

				var eventList = [];
				eventList = pastTourList.concat(currentTourList);

				var resultJson = {};
				resultJson["status"] = "success";
				resultJson["data"] = eventList;
				return resultJson;

			}

		}catch(e){
			var resultJson = {};
			resultJson["status"] = "failure";
			return resultJson;

		}
	},
	"setOrgRankPoints":function(data)
	{
		try{
			if(this.userId && this.userId != undefined && this.userId != null && data.year && data.tournaments && data.tournaments.length > 0)
			{
				var failureJson  = {};
				failureJson["status"] = "failure";
				failureJson["message"] = "could not save!!";

				var successJson = {};
				successJson["status"] = "success";
				successJson["message"] = "Successfully saved!!";

				var entryExists = orgTourPoints.findOne({"organizerId":this.userId,"year":data.year});
				if(entryExists)
				{
					if(data.type == "new")
					{
						failureJson["message"] = "Record already exists";
						return failureJson
					}
					else if(data.type == "modify")
					{
						var result = orgTourPoints.update({
							"organizerId":this.userId,
							"year":data.year},
							{$set:{
								"tournaments":data.tournaments
						}});

						if(result)
							return successJson;			
						else
							return failureJson;
					
					}
					
				}
				else
				{
					var result = orgTourPoints.insert({
						"organizerId":this.userId,
						"year":data.year,
						"tournaments":data.tournaments
					})
					if(result)
						return successJson;			
					else
						return failureJson;
					
				}
			}
			
		}catch(e){

		}
	},
	fetchRankData123:function(data)
    {
      try{

        if(data.sportID && data.eventName && data.filterData)
        {

          	var sportID = data.sportID.trim();
          	var eventName = data.eventName.trim();
          	var filterData = data.filterData.trim();

          	var userDetail = [];
          	var playerPointsList = [];
			if(data.year)
        	{
        		var entryExists = orgTourPoints.findOne({"organizerId":filterData,"year":data.year.trim()})
        		if(entryExists)
        		{
        			if(entryExists.tournaments)
        			{
        				var validTour = entryExists.tournaments;
        				var xxx = PlayerPoints.aggregate([
        					{"$match":{
        						"sportId":sportID,
        						"eventName":eventName,
        						"organizerId":filterData
        					}},
        					{$unwind:"$eventPoints"},
				        	{$match: { "eventPoints.tournamentId" :  {$in:validTour}
				        	}},
				        	{$group:{
				        		"_id":"$playerId",
				        		tournaments:{$push:{
				        			"tournamentId":"$eventPoints.tournamentId",
				        			"tournamentPoints":"$eventPoints.tournamentPoints"}},
				        		"totalPoints":{$sum:"$eventPoints.tournamentPoints"},	    					
				        	}}

        				]);
        			}
        			else
        			{
        				//code yet to check
        			}
        		}
        		else
        		{
        			playerPointsList = PlayerPoints.find({
            			"sportId":sportID,
            			"organizerId":filterData,
            			"eventName":eventName}).fetch();

        		}
        	}
        	else
        	{
        		playerPointsList = PlayerPoints.find({
            		"sportId":sportID,
            		"organizerId":filterData,
            		"eventName":eventName}).fetch();

        	}

          
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
        var resultJson = {};
        resultJson["status"] = "failure";
        resultJson["response"] = "Invalid data";
        return resultJson;
      }
    },
    "seedingPlayers":async function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		var errorMsg = [];
		try{
			if(data)
			{			
				objCheck = Match.test(data, {"tournamentId":String,"eventName":String,"count":Number});
				
				if(objCheck)
				{	
					var tourInfo = tourExists(data.tournamentId);
					var categoryInfo = tourCategoryExists(data.tournamentId,data.eventName);

	            	if(tourInfo == undefined)				
						errorMsg.push(invalidTourMsg);
					else if(categoryInfo == undefined )			
						errorMsg.push(invalidTourCategoryMsg);
					

					if(errorMsg.length > 0)
					{
						failureJson["message"] = errorMsg.toString();
						return failureJson
					}
					else
					{
						var dbsrequired = ["userDetailsTT"];
						var lookUpDB = "userDetailsTT";

	                    var res = await Meteor.call('changeDbNameForDraws', data.tournamentId, dbsrequired)
	                    try {
	                        if (res && res && res.changedDbNames && res.changedDbNames.length) {
	                        	lookUpDB = res.changedDbNames[0]                  
	                        }
	                    }catch(e){
	                    }

						if(categoryInfo && categoryInfo.projectId && categoryInfo.projectId.length > 0 && categoryInfo.projectId[0])
						{
							eventId = categoryInfo.projectId[0];

							var dobFilterInfo = dobFilterSubscribe.findOne({
								
				                "tournamentId": data.tournamentId,
				                "details.eventId": eventId
				            }, {
				                fields: {
				                    _id: 0,
				                    details: {
				                        $elemMatch: {
				                            "eventId": eventId
				                        }
				                    }
				                }
	            			});
	            			if (dobFilterInfo && dobFilterInfo.details.length > 0)      			 
	                    		rankingType = dobFilterInfo.details[0].ranking;
	            			
						}



						var drawData = MatchCollectionDB.aggregate([
							{$match:{
								"tournamentId":data.tournamentId,
								"eventName":data.eventName,
								"matchRecords.roundNumber":1
							}},
							{$unwind:"$matchRecords"},
							{$match:{
								"matchRecords.roundNumber":1
							}},
							{$group:{
								"_id":"$matchRecords.roundNumber",
								"matchRecords":{$push:"$matchRecords"},
								"playersAID":{$push:{
									"playerId":"$matchRecords.playersID.playerAId",
									"playerNo":"$matchRecords.playersNo.playerANo"
								}
								},
								"playersBID":{$push:{
									"playerId":"$matchRecords.playersID.playerBId",
									"playerNo":"$matchRecords.playersNo.playerBNo"
								}
								},
							}},
							{$sort:{
								"matchRecords.roundNumber":1
							}},
							{$project:{
								"playersAID":1,
								"playersBID":1
							}}

					
						])

						if(drawData && drawData.length > 0 && drawData[0].playersAID && drawData[0].playersBID)
						{
							var totPlayers = _.union(drawData[0].playersAID, drawData[0].playersBID);
							var sortPlayers = _.sortBy(totPlayers, 'playerNo');
                            algArr = [];
                            gPlayerVec = computeBrackets(sortPlayers.length);
                            algArr = show(gPlayerVec);
                            var seedCount = [];
                            for(var b=0;b<data.count;b++)
                            {
								seedCount.push(b+1);
                            }

                            var seedArr = [];
                            for(var m =0 ; m< seedCount.length ; m++)
                            {
								var index = algArr.findIndex(obj => obj.rank==seedCount[m]);
								if(index > -1 && sortPlayers[index].playerId.length > 0)
                            		seedArr.push(sortPlayers[index])
                            }


                            for(var k =0 ; k< seedArr.length ; k++)
                            {
                            	var n = k+1;
                            	var userInfo = global[lookUpDB].findOne({"userId":seedArr[k].playerId})
                            	if(userInfo)
                            	{
                            		seedArr[k]["userName"] = userInfo.userName
                            		if(rankingType == "yes")
                            			seedArr[k]["affiliationID"] = userInfo.affiliationID
                            		else
                            			seedArr[k]["affiliationID"] = userInfo.tempAffiliationId
                            		seedArr[k]["rank"] = n;
                            	}
                            }

                            successJson["data"] = seedArr;
                            successJson["message"] = "Seeding Players";
                            return successJson;


						}
						else
						{
							failureJson["message"] = "Could not fetch seeding players";
							return failureJson;

						}

					}		
				}
				else
				{
					failureJson["message"] = paramMsg;
					return failureJson;
				}
			}
			else
			{
				failureJson["message"] = paramMsg;
				return failureJson;
			}
		}catch(e){
			errorLog(e)
			failureJson["message"] = "Could not fetch seeding players"+e;
			return failureJson;
		}
	},

})


show = function(gPlayerVec) {
    for (var i = 0; i < gPlayerVec.length; i++) {
        algArr.push({
            "position": i + 1,
            "rank": gPlayerVec[i].mRank
        })
    }
    return algArr;
}
