var BOTTOM = 0;
var TOP = 1;
var algArr = [];
var mergedArr = [];

import { getIndexOf } from './draws_functions.js';
import { splitVec } from './draws_functions.js';
import { insert } from './draws_functions.js';
import { computeBrackets } from './draws_functions.js';
import { show } from './draws_functions.js';
import { ret_show } from './draws_functions.js';

import { emptyDraws_show } from './draws_functions.js';
import { merge } from './draws_functions.js';
import { show_ForTeamPlayers } from './draws_functions.js';
import { mergeForTeamDraws } from './draws_functions.js';




Meteor.methods({

	// download category draws(ranking/non ranking) , applicable to both knockout & roundrobin
	"downloadTourDraws":async function(data)
	{
		try{
			if(data && data.drawsType)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var categoryMsg = "Invalid category/event";
				var userMsg = "Invalid user";
				var organizerMsg = "Only Organizer can access draws!!"
				var eventId = "";

				var tourInfo = undefined;
				var eventInfo = undefined;
				var userInfo = undefined;

				var objCheck = false;
				if(data.drawsType.toLowerCase() == "knockout")		
					objCheck = Match.test(data, { tournamentId: String, eventName:String,drawsType:String,
							userId: String});
				else if(data.drawsType.toLowerCase() == "roundrobin")
					objCheck = Match.test(data, { tournamentId: String, eventName:String,
						drawsType:String,maxPerGroup:Match.Integer,
							userId: String});
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Possible draw type - knockout/roundrobin";
					return resultJson;
				}

				if(objCheck)
				{
					tourInfo = events.findOne({"_id": data.tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":data.tournamentId
	            		})
	            	} 

	            	eventInfo = events.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName});
	            	if(eventInfo == undefined)
	            	{
	            		eventInfo = pastEvents.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName});
	            	}

	            	userInfo = Meteor.users.findOne({"userId":data.userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
            		if(eventInfo == undefined)          	
            			errorMsg.push(categoryMsg);

            		if(tourInfo && eventInfo && userInfo)
	            	{
	            		if(tourInfo.eventOrganizer != data.userId)
	            			errorMsg.push(organizerMsg);
	            	}
	            	if(eventInfo)
	            		eventId = eventInfo.projectId[0];

	            	console.log(JSON.stringify(errorMsg))

	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament draws";
							return resultJson;
					}
	            	else if(objCheck && tourInfo && eventInfo && userInfo && errorMsg.length == 0)
	            	{
	          		
	            		if(data.drawsType.toLowerCase() == "knockout")
	            		{
	            			//console.log("entered knockout")	
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
		            		{
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
						        {
		                			if (eventId.trim() == dobFilterInfo.details[0].eventId)
		                			{
		                    			eventRanking = dobFilterInfo.details[0].ranking;
		                    			var ind_draws = await Meteor.call("dbBasedEventParts",data.tournamentId,data.eventName,eventInfo.eventParticipants,eventRanking)                       
		                    			if(ind_draws && ind_draws.length > 0)
		                    			{						                     
						                    ind_draws =  _.sortBy(ind_draws, 'points');
											var sortedDesc = _.sortBy(ind_draws, 'points').reverse();
						                    sortedDesc.map(function(document, index) {
						                        document["rank"] = parseInt(index + 1);
						                        document["slNo"] = parseInt(index + 1);
						                    });

						                    var gPlayerVec = [];
						                    gPlayerVec = computeBrackets(sortedDesc.length);
						                    var algArr = ret_show(gPlayerVec);
						                    mergedArr = merge(sortedDesc, algArr);
					                      
						                    var keyFields = ["slNo", "Name", "Affiliation ID", "Academy Name"];
						                    var csv = Papa.unparse({
	                							fields: keyFields,
	                							data: mergedArr
	            							});

	            							console.log("header .. "+keyFields);
	            							console.log("data .. "+JSON.stringify(mergedArr));




	            							var resultJson = {};
	            							resultJson["status"] = "success";
	            							resultJson["data"] = mergedArr;
	            							resultJson["header"] = keyFields;
	            							//console.log("ind_draws csv .. "+JSON.stringify(csv))

	            							return resultJson;

		                    			}

		                			}
		            			}


		            		}
		            		else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
		            		{
		            			//code to be done
		            		}
	            		}
	            		else if(data.drawsType.toLowerCase() == "roundrobin")
	            		{
	            		    //Meteor.call("fetchTeamSubscribed", tournamentId, sEvent.trim(), sEventID,maxMembers,function(error, result) {
	
	            			var rr_result = await Meteor.call("fetchTeamSubscribed",data.tournamentId,data.eventName,eventId,data.maxPerGroup)
	            			//console.log("rr_result .. "+JSON.stringify(rr_result));
	            			rr_result.map(function(document, index) {
                                document["Sl.No."] = parseInt(index + 1);
                            });
                            var key = ["Sl.No.","GroupNumber", "AffiliationID","Player/Team Name"]
						    var csv = Papa.unparse({
	                			fields: key,
	                			data: rr_result
	            			});
	            			var resultJson = {};
	            			resultJson["status"] = "success";
	            			resultJson["data"] = csv;
	            			return resultJson;
                              //  var k = JSON.parse(JSON.stringify(userDetail, key, 5));
                               // JSONToCSVConvertor(k, "", true, sEvent.trim());
	            		}	
	            		
	            		
	            	}

				}
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Require all parameters";
					return resultJson;
				}

            	
			}
			else
			{
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["message"] = "Require all parameters";
				return resultJson;
			}

		}catch(e){
			console.log(e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament draws "+e;
			return resultJson;
		}
	},
	//fetch empty draws (donwload empty draws)
	"fetchEmptyDraws":function(data)
	{
		try{
			//console.log("entered fetchEmptyDraws")
			if(data)
			{
				var objCheck = Match.test(data, {userId: String,"numPlayers":Match.Integer});
				if(objCheck)
				{
					var userId = data.userId.trim();
					var numPlayers = data.numPlayers;
					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo)
					{
						if(numPlayers > 0)
						{
							var gPlayerVec = [];
		    				gPlayerVec = computeBrackets(numPlayers);
		    				var draws = emptyDraws_show(gPlayerVec);
		    				draws.map(function(document, index) {
                                document["Sl.No."] = parseInt(index + 1);
                            });
                            //console.log("draws .."+JSON.stringify(draws))
                            var key = ["Sl.No.","Rank"];
						    var csv = Papa.unparse({
	                			fields: key,
	                			data: draws
	            			});
	            			//console.log("csv .. "+csv)
	            			var resultJson = {};
	            			resultJson["status"] = "success";
	            			resultJson["data"] = csv;
	            			return resultJson;
						}
						else
						{
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["message"] = "Number of entries cannot be zero";
							return resultJson;
						}
					}
					else
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["message"] = "Invalid user";
						return resultJson;
					}
				}
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Require all parameters";
					return resultJson;
				}
			}
			else
			{
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["message"] = "Require all parameters";
				return resultJson;
			}
		}catch(e){
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch empty draws "+e;
			return resultJson;
		}
	}
})