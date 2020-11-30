import { MatchCollectionDB} from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB} from '../../publications/MatchCollectionDbTeam.js';
import {nameToCollection} from '../dbRequiredRole.js'



Meteor.methods({

	'fetchTempAff':function(playerId)
	{
		try{
			if(playerId != undefined && playerId != null && playerId != "")
			{
				var userInfo = nameToCollection(playerId).findOne({"userId":playerId});
				if(userInfo && userInfo.tempAffiliationId)
					return userInfo.tempAffiliationId;
				else
					return "player";
			}
			else
			{
				return "player";
			}
		}catch(e){
			errorLog(e)
			return "player";
		}
	},
	'fetchRoundMatches': function(tournamentId, eventName) {
        try {
        	var matchRec = [];
        	var checkType = "";
        	var entryExists = MatchCollectionDB.findOne({
    			"tournamentId": tournamentId,
			    "eventName":eventName
    		})
    		if(entryExists)
    		{
    			checkType = "individual";
    			matchRec  = MatchCollectionDB.aggregate([{
				    $match: {
				    	"tournamentId": tournamentId,
				        "eventName":eventName,
				    }
					}, {
					    $unwind: "$matchRecords"
					},
					{$group:{"_id":"$matchRecords.roundNumber",
						count1: {$sum: 1},
					    startMatchNo:{$first:"$matchRecords.matchNumber"},

					}},
					{$sort:{"_id":1}},
					{$project:{
							"_id":1,
							"count1":1,
							"startMatchNo":1
						}
					}
				]);
    		}
    		else
    		{
    			entryExists = teamMatchCollectionDB.findOne({
    				"tournamentId": tournamentId,
			    	"eventName":eventName
    			});
    			if(entryExists)
    			{
    				checkType = "team";
    				matchRec  = teamMatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": tournamentId,
					        "eventName":eventName,
					    }
						}, {
						    $unwind: "$matchRecords"
						},
						{$group:{"_id":"$matchRecords.roundNumber",
							count1: {$sum: 1},
						    startMatchNo:{$first:"$matchRecords.matchNumber"},

						}},
						{$sort:{"_id":1}},
						{$project:{
								"_id":1,
								"count1":1,
								"startMatchNo":1
							}
						}
					]);
    			}
    		}
        	

        	if(matchRec && matchRec.length > 0)
        	{
        		for(var m=0;m<matchRec.length;m++)
        		{
        			var currentRound = matchRec[m]._id.toString();
        			var roundInfo = [];
        			if(checkType == "individual")
        			{
        				roundInfo = MatchCollectionConfig.aggregate([{
						    $match: {
						    	"tournamentId": tournamentId,
						        "eventName":eventName,
						        "roundValues.roundNumber":currentRound
						    }
							}, {
							    $unwind: "$roundValues"
							},
							{$match:{
								"roundValues.roundNumber":currentRound
							}},
							{$group:{"_id":"$roundValues.roundNumber",
							    roundName: { $first: "$roundValues.roundName" }
							}},
				
						]);
        			}
        			else if(checkType == "team")
        			{
        				roundInfo = MatchTeamCollectionConfig.aggregate([{
						    $match: {
						    	"tournamentId": tournamentId,
						        "eventName":eventName,
						        "roundValues.roundNumber":currentRound
						    }
							}, {
							    $unwind: "$roundValues"
							},
							{$match:{
								"roundValues.roundNumber":currentRound
							}},
							{$group:{"_id":"$roundValues.roundNumber",
							    roundName: { $first: "$roundValues.roundName" }
							}},
				
						]);
        			}
        			

		            	
		            if (roundInfo && roundInfo.length > 0) {
		            	if(roundInfo[0].roundName == "Quater Final" || roundInfo[0].roundName == "Quarter Final")
		            		{
		            			matchRec[m]["dots"] = 1;
		            			matchRec[m]["roundName"] = roundInfo[0].roundName;

		            		}
		            	else if(roundInfo[0].roundName == "Semi Final"){

		            		matchRec[m]["dots"] = 1;
		            		matchRec[m]["roundName"] = roundInfo[0].roundName;

		            	}
		            	else if(roundInfo[0].roundName == "Final"){
		            		matchRec[m]["dots"] = 1;
		            		matchRec[m]["roundName"] = roundInfo[0].roundName;

		            	}
		            	else
		            	{
		            		matchRec[m]["dots"] = parseInt(matchRec[m]["count1"])/4;
		            		matchRec[m]["roundName"] = "Round "+roundInfo[0].roundName;

		            	}
		            }
		        }
        	}

        	var roundDetails = [];

        	for(var n=0 ;n<matchRec.length;n++)
        	{
        		var roundDetailsJson = {};
        		roundDetailsJson["roundNumber"] = matchRec[n]._id;
        		roundDetailsJson["roundName"] = matchRec[n].roundName;
        		roundDetails.push(roundDetailsJson);
        	}


        	//var resultJson = {};
        	//resultJson["matchRec"] = matchRec;
        	//resultJson["roundDetails"] = roundDetails;
            return matchRec;
        } catch (e) {
        	errorLog(e)
        }
    },



    'fetchRounds':function(tournamentId,eventName){
    	try{
    		var matchRec = []
    		var entryExists = MatchCollectionDB.findOne({
    			"tournamentId": tournamentId,
			    "eventName":eventName
    		})
    		if(entryExists)
    		{
    			matchRec  = MatchCollectionDB.aggregate([{
				    $match: {
				    	"tournamentId": tournamentId,
				        "eventName":eventName,
				    }
					}, {
					    $unwind: "$matchRecords"
					},
					{$group:{"_id":"$matchRecords.roundNumber",
						roundNumber:{$first:"$matchRecords.roundNumber"},
						roundName: {$first: "$matchRecords.roundName"},
					}},
					{$sort:{"_id":1}},
					{$project:{
							"_id":1,
							"roundNumber":1,
							"roundName":1,
						}
					}
				]);
				return matchRec
    		}
    		else
    		{
    			entryExists = teamMatchCollectionDB.findOne({
    				"tournamentId": tournamentId,
			    	"eventName":eventName
    			});
    			if(entryExists)
    			{
    				matchRec  = teamMatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": tournamentId,
					        "eventName":eventName,
					    }
						}, {
						    $unwind: "$matchRecords"
						},
						{$group:{"_id":"$matchRecords.roundNumber",
							roundNumber:{$first:"$matchRecords.roundNumber"},
							roundName: {$first: "$matchRecords.roundName"},
						}},
						{$sort:{"_id":1}},
						{$project:{
								"_id":1,
								"roundNumber":1,
								"roundName":1,
							}
						}
					]);
					return matchRec
    			}
    		}
    		

			
    	}catch(e){
    		errorLog(e)
    	}
    },
    'fetchUpcomingTournResults':function()
    {
    		var raw = events.rawCollection();
            var distinct = Meteor.wrapAsync(raw.distinct, raw);
            var eventList = distinct('_id', {"tournamentEvent":true});

            var eventList1 = [];
            var eventList2 = [];
            var totEventList = [];
            var raw1 = MatchCollectionDB.rawCollection();
            var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
            eventList1 = distinct1('tournamentId', {"tournamentId":{$in:eventList}});

            var raw2 = teamMatchCollectionDB.rawCollection();
            var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
            eventList2 = distinct2('tournamentId', {"tournamentId":{$in:eventList}});


            totEventList = eventList1.concat(eventList2);
			var resultJson = [];
			//var totEventList = ["Y6uA4xqvjDPcSSoYh"];
			
            for(var m=0; m<totEventList.length;m++)
            {
            	var eventsData = [];

           		var curTourId = totEventList[m];
           		var raw3 = MatchCollectionDB.rawCollection();
            	var distinct3 = Meteor.wrapAsync(raw3.distinct, raw3);
            	ind_eventList = distinct3('eventName', {"tournamentId":curTourId});

            	var raw4 = teamMatchCollectionDB.rawCollection();
            	var distinct4 = Meteor.wrapAsync(raw4.distinct, raw4);
            	team_eventList = distinct4('eventName', {"tournamentId":curTourId});


            	var drawEvents = [];

            	for(var h=0; h < ind_eventList.length;h++)
            	{
            		var ind_matchRec  = MatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": curTourId,
					    	"eventName":ind_eventList[h]
					    }},
						{$group:{"_id":"$eventName",
							"tournamentId":{$first:"$tournamentId"},
							"eventName":{$first:"$eventName"},
							"matchRecords":{$first:"$matchRecords"}
						}},
						{$project:{
								"_id":1,
								"count1":1,
								"tournamentId":1,
								"eventName":1,
								"matchRecords":1
							}
						},
						{
						    $unwind: "$matchRecords"
						},
						{$match:{
							"matchRecords.playersID.playerAId":{"$nin":["",null]},
							"matchRecords.playersID.playerBId":{"$nin":["",null]},

						}},
						{$group:{"_id":"$matchRecords.roundNumber",
							"roundNumber":{$first:"$matchRecords.roundNumber"},
							"eventName":{$first:"$eventName"},
							"matchRecords":{$push:"$matchRecords"}
						}},
						{$sort:{"matchRecords.roundNumber":-1}},
						{$project:{
							"eventName":1,
							"roundNumber":1,
							"matchRecords":1,
							"_id":1
						}},	
						{$limit:1}				
					]);
           			
           			
           			if(ind_matchRec && ind_matchRec.length > 0)
           			{
           				var eventsJson = {};
	           			eventsJson["eventName"] = ind_eventList[h];
	           			eventsJson["matchRecords"] = [];
	           			eventsJson["roundNumber"] = "";
           				eventsJson["roundNumber"] = ind_matchRec[0].roundNumber;
           				eventsJson["matchRecords"] = ind_matchRec[0].matchRecords;
           				eventsData.push(eventsJson)
           				drawEvents.push(ind_eventList[h])


           			}
				}

				for(var k=0; k < team_eventList.length;k++)
            	{
            		var team_matchRec  = teamMatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": curTourId,
					    	"eventName":team_eventList[k]
					    }},
						{$group:{"_id":"$eventName",
							"tournamentId":{$first:"$tournamentId"},
							"eventName":{$first:"$eventName"},
							"matchRecords":{$first:"$matchRecords"}
						}},
						{$project:{
								"_id":1,
								"count1":1,
								"tournamentId":1,
								"eventName":1,
								"matchRecords":1
							}
						},
						{
						    $unwind: "$matchRecords"
						},
						{$match:{
							"matchRecords.teamsID.teamAId":{"$nin":["",null]},
							"matchRecords.teamsID.teamBId":{"$nin":["",null]},

						}},
						{$group:{"_id":"$matchRecords.roundNumber",
							"roundNumber":{$first:"$matchRecords.roundNumber"},
							"eventName":{$first:"$eventName"},
							"matchRecords":{$push:"$matchRecords"}
						}},
						{$sort:{"matchRecords.roundNumber":-1}},
						{$project:{
							"eventName":1,
							"roundNumber":1,
							"matchRecords":1,
							"_id":1
						}},	
						{$limit:1}				
					]);
           			
           			
           			if(team_matchRec && team_matchRec.length > 0)
           			{
           				var eventsJson = {};
           				eventsJson["eventName"] = team_eventList[k];
           				eventsJson["matchRecords"] = [];
           				eventsJson["roundNumber"] = "";
           				eventsJson["roundNumber"] = team_matchRec[0].roundNumber;
           				eventsJson["matchRecords"] = team_matchRec[0].matchRecords;

           				eventsData.push(eventsJson)
           				drawEvents.push(team_eventList[k])

           			}
				}


				

				var dataJson = {};
				dataJson["tournamentId"] = curTourId;
				dataJson["tournamentName"] = "";
				dataJson["drawEvents"] =  drawEvents;
				var tourInfo = events.findOne({"_id":curTourId,"tournamentEvent":true});
				if(tourInfo)
					dataJson["tournamentName"] = tourInfo.eventName;
				dataJson["events"] = eventsData; 
				resultJson.push(dataJson);

            }
            
       

            return resultJson;



    
    	
    },
    "fetchTourEventResult":function(tournamentId,eventName)
    {
    	try{
    		var resultJson = {};
    		var checkExists = MatchCollectionDB.findOne({
    			"tournamentId":tournamentId,
    			"eventName":eventName});
    		var matchRec = [];
    		var absoluteUrl = Meteor.absoluteUrl().toString();
            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
    		if(checkExists)
    		{
    			matchRec  = MatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": tournamentId,
					    	"eventName":eventName
					    }},
						{$group:{"_id":"$eventName",
							"tournamentId":{$first:"$tournamentId"},
							"eventName":{$first:"$eventName"},
							"matchRecords":{$first:"$matchRecords"}
						}},
						{$project:{
								"_id":1,
								"count1":1,
								"tournamentId":1,
								"eventName":1,
								"matchRecords":1
							}
						},
						{
						    $unwind: "$matchRecords"
						},
						{$match:{$or:
							[
							{"matchRecords.playersID.playerAId":{"$nin":["",null]}},
							{"matchRecords.playersID.playerBId":{"$nin":["",null]}}
							]
						}},
						{$group:{"_id":"$matchRecords.roundNumber",
							"roundNumber":{$first:"$matchRecords.roundNumber"},
							"roundName":{$first:"$matchRecords.roundName"},
							"eventName":{$first:"$eventName"},
							"matchRecords":{$push:"$matchRecords"}
						}},
						{$sort:{"matchRecords.roundNumber":-1}},
						{$project:{
							"eventName":1,
							"roundNumber":1,
							"matchRecords":1,
							"_id":1,
							"roundName":1,
							"round_name": {"$cond": { 
                				"if": { "$eq": [ "$roundName", "F" ] }, 
                				"then": "Final",
                				"else": {
                    				"$cond": {
                        				"if": { "$eq": ["$roundName","SF"]}, 
                        				"then": "Semi Final", 
                        				"else": {
		                    				"$cond": {
		                        				"if": { "$eq": ["$roundName","QF"]}, 
		                        				"then": "Quarter Final", 
		                        				"else": {
				                    				"$cond": {
				                        				"if": { "$eq": ["$roundName","PQF"]}, 
				                        				"then": "Pre Quarter Final", 
				                        				"else": {$concat:["Round ",{ "$substr":["$roundNumber",0,-1]  }]}
				                    				}
		                    					}
		                    				}
		                    			}
                    				}
                				}
            				}
            			}


						}},	
						{$limit:1},			
						{$sort:{"matchRecords.matchNumber":-1}},
						{$project:{
							"eventName":1,
							"roundNumber":1,
							"matchRecords":{ $slice: [ "$matchRecords", 4 ] },
							"_id":1,
							"roundName":1,
							"round_name":1
						}}

					]);
           			
           			
           			

    	
           	}
           	else
           	{
           		matchRec  = teamMatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": tournamentId,
					    	"eventName":eventName
					    }},
						{$group:{"_id":"$eventName",
							"tournamentId":{$first:"$tournamentId"},
							"eventName":{$first:"$eventName"},
							"matchRecords":{$first:"$matchRecords"}
						}},
						{$project:{
								"_id":1,
								"count1":1,
								"tournamentId":1,
								"eventName":1,
								"matchRecords":1
							}
						},
						{
						    $unwind: "$matchRecords"
						},
						{$match:{$or:[
							{"matchRecords.teamsID.teamAId":{"$nin":["",null]}},
							{"matchRecords.teamsID.teamBId":{"$nin":["",null]}}
							]
						}},
						{$group:{"_id":"$matchRecords.roundNumber",
							"roundNumber":{$first:"$matchRecords.roundNumber"},
							"eventName":{$first:"$eventName"},
							"matchRecords":{$push:"$matchRecords"},
							"roundName":{$first:"$matchRecords.roundName"},

						}},
						{$sort:{"matchRecords.roundNumber":-1}},
						{$project:{
							"eventName":1,
							"roundNumber":1,
							"matchRecords":1,
							"_id":1,
							"round_name": {"$cond": { 
                				"if": { "$eq": [ "$roundName", "F" ] }, 
                				"then": "Final",
                				"else": {
                    				"$cond": {
                        				"if": { "$eq": ["$roundName","SF"]}, 
                        				"then": "Semi Final", 
                        				"else": {
		                    				"$cond": {
		                        				"if": { "$eq": ["$roundName","QF"]}, 
		                        				"then": "Quarter Final", 
		                        				"else": {
				                    				"$cond": {
				                        				"if": { "$eq": ["$roundName","PQF"]}, 
				                        				"then": "Pre Quarter Final", 
				                        				"else": {$concat:["Round ",{ "$substr":["$roundNumber",0,-1]  }]}
				                    				}
		                    					}
		                    				}
		                    			}
                    				}
                				}
            				}
            			}
						}},	
						{$sort:{"matchRecords.matchNumber":-1}},
						{$project:{
							"eventName":1,
							"roundNumber":1,
							"matchRecords":{ $slice: [ "$matchRecords", 4 ] },
							"_id":1,
							"roundName":1,
							"round_name":1
						}}				
					]);
           	}

           	if(matchRec && matchRec.length > 0)
           	{
           		var eventsJson = {};
	           	eventsJson["eventName"] = eventName;
           		eventsJson["roundNumber"] = matchRec[0].roundNumber;
           		eventsJson["roundName"] = matchRec[0].round_name;
           		eventsJson["matchRecords"] = matchRec[0].matchRecords;
           		eventsJson["urlValue"] = absoluteUrlString;
           		eventsJson["tournamentId"] = tournamentId
           		return eventsJson;
           	}
    	}catch(e){
    		errorLog(e)
    	}
    },

    /***************************************************************************/

    'fetchMatchResults': function(tournamentId, eventName) {
        try {
        	var matchRec = [];
        	var checkType = "";
        	var entryExists = MatchCollectionDB.findOne({
    			"tournamentId": tournamentId,
			    "eventName":eventName
    		})
    		if(entryExists)
    		{
    			checkType = "individual";
    			matchRec  = MatchCollectionDB.aggregate([{
				    $match: {
				    	"tournamentId": tournamentId,
				        "eventName":eventName,
				    }
					}, {
					    $unwind: "$matchRecords"
					},
					{$group:{"_id":"$matchRecords.roundNumber",
						count1: {$sum: 1},
					    startMatchNo:{$first:"$matchRecords.matchNumber"},

					}},
					{$sort:{"_id":1}},
					{$project:{
							"_id":1,
							"count1":1,
							"startMatchNo":1
						}
					}
				]);
    		}
    		else
    		{
    			entryExists = teamMatchCollectionDB.findOne({
    				"tournamentId": tournamentId,
			    	"eventName":eventName
    			});
    			if(entryExists)
    			{
    				checkType = "team";
    				matchRec  = teamMatchCollectionDB.aggregate([{
					    $match: {
					    	"tournamentId": tournamentId,
					        "eventName":eventName,
					    }
						}, {
						    $unwind: "$matchRecords"
						},
						{$group:{"_id":"$matchRecords.roundNumber",
							count1: {$sum: 1},
						    startMatchNo:{$first:"$matchRecords.matchNumber"},

						}},
						{$sort:{"_id":1}},
						{$project:{
								"_id":1,
								"count1":1,
								"startMatchNo":1
							}
						}
					]);
    			}
    		}
        	

        	if(matchRec && matchRec.length > 0)
        	{
        		for(var m=0;m<matchRec.length;m++)
        		{
        			var currentRound = matchRec[m]._id.toString();
        			var roundInfo = [];
        			if(checkType == "individual")
        			{
        				roundInfo = MatchCollectionConfig.aggregate([{
						    $match: {
						    	"tournamentId": tournamentId,
						        "eventName":eventName,
						        "roundValues.roundNumber":currentRound
						    }
							}, {
							    $unwind: "$roundValues"
							},
							{$match:{
								"roundValues.roundNumber":currentRound
							}},
							{$group:{"_id":"$roundValues.roundNumber",
							    roundName: { $first: "$roundValues.roundName" }
							}},
				
						]);
        			}
        			else if(checkType == "team")
        			{
        				roundInfo = MatchTeamCollectionConfig.aggregate([{
						    $match: {
						    	"tournamentId": tournamentId,
						        "eventName":eventName,
						        "roundValues.roundNumber":currentRound
						    }
							}, {
							    $unwind: "$roundValues"
							},
							{$match:{
								"roundValues.roundNumber":currentRound
							}},
							{$group:{"_id":"$roundValues.roundNumber",
							    roundName: { $first: "$roundValues.roundName" }
							}},
				
						]);
        			}
        			

		            	
		            if (roundInfo && roundInfo.length > 0) {
		            	if(roundInfo[0].roundName == "Quater Final" || roundInfo[0].roundName == "Quarter Final")
		            		{
		            			matchRec[m]["dots"] = 1;
		            			matchRec[m]["roundName"] = roundInfo[0].roundName;

		            		}
		            	else if(roundInfo[0].roundName == "Semi Final"){

		            		matchRec[m]["dots"] = 1;
		            		matchRec[m]["roundName"] = roundInfo[0].roundName;

		            	}
		            	else if(roundInfo[0].roundName == "Final"){
		            		matchRec[m]["dots"] = 1;
		            		matchRec[m]["roundName"] = roundInfo[0].roundName;

		            	}
		            	else
		            	{
		            		matchRec[m]["dots"] = parseInt(matchRec[m]["count1"])/4;
		            		matchRec[m]["roundName"] = "Round "+roundInfo[0].roundName;

		            	}
		            }
		        }
        	};
        	var roundDetails = [];

        	for(var n=0 ;n<matchRec.length;n++)
        	{
        		var roundDetailsJson = {};
        		roundDetailsJson["roundNumber"] = matchRec[n]._id;
        		roundDetailsJson["roundName"] = matchRec[n].roundName;
        		roundDetails.push(roundDetailsJson);
        	}
        	var det = [];
        	for(var j=1;j<=4 ;j++)
        	{
        		
        		for(var l=0; l<matchRec.length;l++)
        		{
        			var m = l + 1;
        			var rowJson = {};
        			rowJson["row"] = j;
        			rowJson["col"] = m;
        			rowJson["round"] = matchRec[l]._id;

        			

        			if(matchRec[l].roundName == "Final" || matchRec[l].roundName == "Semi Final")
        			{
        				if(j == 1 && matchRec[l].roundName == "Final")
        				{       					
        					rowJson["dots"] = matchRec[l].dots;
        					rowJson["matchNo"] = matchRec[l].startMatchNo;

        				}
        				else if((j ==1 || j == 2) && matchRec[l].roundName == "Semi Final")
        				{
        					rowJson["dots"] = matchRec[l].dots;

        					if(j ==1)
        						rowJson["matchNo"] = matchRec[l].startMatchNo;
        					else
        					{
        						var m1 =(parseInt(j) * parseInt(matchRec[l].dots));
                    			var mc = ( (parseInt(m1) - parseInt(matchRec[l].dots)) + parseInt(matchRec[l].startMatchNo))
                    			rowJson["matchNo"] = mc;
        					}
        				}
        				else
        				{
        					rowJson["dots"] = 0;
        					rowJson["matchNo"] = 0;

        				}
        			}
        			else
        			{
        				rowJson["dots"] = matchRec[l].dots;
        				if(j ==1)
        					rowJson["matchNo"] = matchRec[l].startMatchNo;
	        			else
	        			{
	        				var m1 =(parseInt(j) * parseInt(matchRec[l].dots));
	                    	var mc = ( (parseInt(m1) - parseInt(matchRec[l].dots)) + parseInt(matchRec[l].startMatchNo))
	                    	rowJson["matchNo"] = mc;

	        			}
        			}

        			
        			det.push(rowJson);

        		}

        	}
           

            if(entryExists && entryExists.matchRecords)
            {
            	var resultJson = {};
            	resultJson["status"] = "success";
            	resultJson["roundDetails"] = roundDetails;
            	resultJson["roundMatchDetails"] = det;
            	resultJson["matchRecords"] = entryExists.matchRecords; 

            }
            else
            {
            	var resultJson = {};
            	resultJson["status"] = "failure";
            	resultJson["message"] = "No Records found";

            }

            return resultJson;

        
        } catch (e) {
        	errorLog(e)
        }
    },


    /**********************************************************************************/
    
    //fetch uploaded draws based on tournament - category specific
    //applicable to both knockout and roundrobin
    "fetchTourEventDrawResults":function(tournamentId,eventName,drawType)
    {
    	try{

    		var resultJson = {};
    		if(drawType.toLowerCase() == "knockout")
    		{
    			var entryExists = MatchCollectionDB.findOne({
	    			"tournamentId": tournamentId,
				    "eventName":eventName
    			})
	    		if(entryExists)
	    		{
	    			resultJson["status"] = "success";
	    			resultJson["data"] = entryExists;
	    		}
	    		else
	    		{
	    			entryExists = teamMatchCollectionDB.findOne({
	    				"tournamentId": tournamentId,
				    	"eventName":eventName
	    			});
	    			if(entryExists)
	    			{
	    				resultJson["status"] = "success";
	    				resultJson["data"] = entryExists;
	    			}
	    		}
    		}
    		else if(drawType.toLowerCase() == "roundrobin")
    		{
    			var entryExists = roundRobinEvents.findOne({
	    			"tournamentId": tournamentId,
				    "eventName":eventName
    			})
	    		if(entryExists)
	    		{
	    			resultJson["status"] = "success";
	    			resultJson["data"] = entryExists;
	    		}
	    		else
	    		{
	    			entryExists = roundRobinTeamEvents.findOne({
	    				"tournamentId": tournamentId,
				    	"eventName":eventName
	    			});
	    			if(entryExists)
	    			{
	    				resultJson["status"] = "success";
	    				resultJson["data"] = entryExists;
	    			}
	    		}
    		}

    		
    		if(entryExists)
    		{
    			return resultJson;
    		}
    		else
    		{
    			resultJson["status"] = "failure";
    			resultJson["message"] = "Draws not found";
    			return resultJson;
    		}


    	}catch(e){
    		errorLog(e)
    	}
    },
    "fetchRoundMatchScores":function(data)
    {
    	if(data.drawsType.toLowerCase() == "knockout")
    	{
    		if(data.projectType == "1" || data.projectType == 1)
    		{
    			var matchRecords = MatchCollectionDB.aggregate([{
                            $match: {
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName
                            }
                        }, {
                            $unwind: "$matchRecords"
                        }, {
                            $match: {
                                "matchRecords.matchNumber": data.matchNumber,
                                "matchRecords.roundNumber": data.roundNumber,
                                $or:[{
                                	$or:
                                	[
                                		{"matchRecords.playersID.playerAId":{"$nin":["",null]}},
                                		{"matchRecords.playersID.playerBId":{"$nin":["",null]}},
                                		{"status2":{$in:["bye"]}}
                                	]},
                                	{$and:[
                                		{"matchRecords.playersID.playerAId":{"$nin":["",null]}},
                                		{"matchRecords.playersID.playerBId":{"$nin":["",null]}},
                                		{"status2":{$nin:["bye"]}}
                                	]}
                                ]                                
                            }
                        }]);
    			if(matchRecords && matchRecords.length > 0)
    			{
    				var resultJson = {};
    				resultJson["status"] = "success";
    				resultJson["data"] = matchRecords[0];
    				resultJson["message"] = "Match details fetched";
    				return resultJson;
    			}
    			else if(matchRecords && matchRecords.length == 0)
    			{
    				var resultJson = {};
    				resultJson["status"] = "failure";
    				resultJson["message"] = "Players need to set!!";
    				return resultJson;
    			}
    		}
    		else if(data.projectType == "2" || data.projectType == 2)
    		{
    			//yet to code
    		}
    	}
    	else if(data.drawsType.toLowerCase() == "roundrobin")
    	{
    		if(data.projectType == 1 || data.projectType == 1)
    		{
    			var matchRecords = roundRobinEvents.aggregate([{
                            $match: {
                                "tournamentId": data.tournamentId,
                                "eventName": data.eventName,
                                "_id":data.groupID
                            }
                        }, {
                            $unwind: "$groupDetails"
                        }, {
                            $match: {
                                "groupDetails.rowNo": data.rowNo,
                                "groupDetails.colNo": data.colNo,                             
                            }
                        }]);
    			if(matchRecords && matchRecords.length > 0)
    			{
    				var resultJson = {};
    				resultJson["status"] = "success";
    				resultJson["data"] = matchRecords[0];
    				resultJson["message"] = "Match details fetched";
    				return resultJson;
    			}
    			else if(matchRecords && matchRecords.length == 0)
    			{
    				var resultJson = {};
    				resultJson["status"] = "failure";
    				resultJson["message"] = "Invalid match details!!";
    				return resultJson;
    			}
    		}
    		else if(data.projectType == "2" || data.projectType == 2)
    		{
    			//yet to code
    		}
    	}
    }
    

})