

import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';


Meteor.methods({

	//fetch list of categories under tournament
	"fetchTourEvents":function(data)
	{
		try{
			if(data)
			{

				var objCheck = Match.test(data, {"userId": String,"tournamentId":String});
				console.log("objCheck .. "+objCheck + "data .."+JSON.stringify(data))
				if(objCheck)
				{
					var successJson = succesData();
					var failureJson = failureData();

					var errorMsg = [];
					var userMsg = "Invalid user";
					var tourMsg = "Invalid tournament";
					var tourType = "";


					var userId = data.userId.trim();
					var tournamentId = data.tournamentId.trim();

					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo)
						tourType = "new";
					if(tourInfo == undefined)
					{
						tourInfo = pastEvents.findOne({"_id":tournamentId});	
						if(tourInfo)
						tourType = "past";		
					}

					if(tourInfo == undefined)			
						errorMsg.push(tourMsg);
						
					if(errorMsg.length > 0)
					{
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = "Could not fetch tournament draws";
						return failureJson;
					}
					else
					{

						var eventList = [];
						if(tourType == "new")
						{
							var raw = events.rawCollection();
		            		var distinct = Meteor.wrapAsync(raw.distinct, raw);
		            		eventList = distinct('eventName', {"tournamentId":tournamentId});
						}
						else if(tourType == "past")
						{
							var raw = pastEvents.rawCollection();
		            		var distinct = Meteor.wrapAsync(raw.distinct, raw);
		            		eventList = distinct('eventName', {"tournamentId":tournamentId});
						}

            			if(eventList.length == 0 && eventList.length == 0)
            			{
							failureJson["message"] = "Draws not found!!";
							return failureJson;
            			}
            			else
            			{
							successJson["data"] = eventList;
							successJson["message"] = "Events found!!";
							return successJson;
            			}        
					}
				}
				else
				{
					failureJson["message"] = "Require all parameters";
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
			failureJson["message"] = "Could not fetch tournament draws events "+e;
			return failureJson;
		}
	},
	//fetch list of categories to create draws under tournament
	"fetchNonEventsDraws":function(data)
	{
		try{
			var successJson = succesData();
			var failureJson = failureData();

			if(data)
			{
				var objCheck = false;
				if(data.drawsType && data.drawsType.toLowerCase() == "knockout" || data.drawsType.toLowerCase() == "roundrobin")		
					objCheck = Match.test(data, { tournamentId: String, drawsType:String,userId: String});
				
				else
				{
					failureJson["message"] = "Possible draw type - knockout/roundrobin";
					return failureJson;
				}

				if(objCheck)
				{
					var errorMsg = [];
					var userMsg = "Invalid user";
					var tourMsg = "Invalid tournament";
					var tourType = "";

					var userId = data.userId.trim();
					var tournamentId = data.tournamentId.trim();

					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo)
						tourType = "new";
					if(tourInfo == undefined)
					{
						tourInfo = pastEvents.findOne({"_id":tournamentId});
						if(tourInfo)
							tourType = "past";
						if(tourInfo == undefined)
						{
							errorMsg.push(tourMsg);
						}
					}

					if(errorMsg.length > 0)
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch tournament draws";
						return resultJson;
					}
					else
					{
						var eventList = [];
						var drawEvents = [];
						if(data.drawsType.toLowerCase() == "knockout")
						{
							var raw1 = MatchCollectionDB.rawCollection();
			            	var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
			            	var ko_eventList1 = distinct1('eventName', {"tournamentId":tournamentId});

			            	var raw2 = teamMatchCollectionDB.rawCollection();
			            	var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
			            	var ko_eventList2 = distinct2('eventName', {"tournamentId":tournamentId});

	            			drawEvents = ko_eventList1.concat(ko_eventList2);

						}
						else if(data.drawsType.toLowerCase() == "roundrobin")
						{
							var raw3 = roundRobinEvents.rawCollection();
		            		var distinct3 = Meteor.wrapAsync(raw3.distinct, raw3);
		            		var rr_eventList1 = distinct3('eventName', {"tournamentId":tournamentId});

		            		var raw4 = roundRobinTeamEvents.rawCollection();
		            		var distinct4 = Meteor.wrapAsync(raw4.distinct, raw4);
		            		var rr_eventList2 = distinct4('eventName', {"tournamentId":tournamentId});

            				drawEvents = rr_eventList1.concat(rr_eventList2);
						}
						

		       
            			if(drawEvents.length == 0)
            			{
							failureJson["message"] = "Events not found!!";
							return failureJson;
            			}
            			else
            			{
            				if(tourType.toLowerCase() == "new")
            				{

            				}
            				else if(tourType.toLowerCase() == "past")
            				{

            				}
							/*var resultJson={};
							var data = {};
							data["knockout"] = ko_eventList;
							data["roundrobin"] = rr_eventList;
							resultJson["status"] = "success";
							resultJson["data"] = data;
							resultJson["message"] = "Draws found!!";
							return resultJson;*/
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

		}catch(e)
		{
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament draws events "+e;
			return resultJson;
		}
	},
	//fetch existing draws eventlist based on tournament(includes knockout and roundrobin)
	"fetchTourDrawEventList":function(data)
	{
		try{
			if(data)
			{
				var objCheck = Match.test(data, {"userId": String,
					"tournamentId":String});
				if(objCheck)
				{
					var errorMsg = [];
					var userMsg = "Invalid user";
					var tourMsg = "Invalid tournament";


					var userId = data.userId.trim();
					var tournamentId = data.tournamentId.trim();

					var userInfo = Meteor.users.findOne({"userId":userId});
					if(userInfo == undefined)
						errorMsg.push(userMsg);

					var tourInfo = events.findOne({"_id":tournamentId});
					if(tourInfo == undefined)
					{
						tourInfo = pastEvents.findOne({"_id":tournamentId});
						if(tourInfo == undefined)
						{
							errorMsg.push(tourMsg);
						}
					}

					if(errorMsg.length > 0)
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch tournament draws";
						return resultJson;
					}
					else
					{
						var ko_eventList1 = [];
           	 			var ko_eventList2 = [];
           	 			var ko_eventList = [];

           	 			var rr_eventList1 = [];
           	 			var rr_eventList2 = [];
           	 			var rr_eventList = [];

		            	var raw1 = MatchCollectionDB.rawCollection();
		            	var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
		            	ko_eventList1 = distinct1('eventName', {"tournamentId":tournamentId});

		            	var raw2 = teamMatchCollectionDB.rawCollection();
		            	var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
		            	ko_eventList2 = distinct2('eventName', {"tournamentId":tournamentId});

            			ko_eventList = ko_eventList1.concat(ko_eventList2);


            			var raw3 = roundRobinEvents.rawCollection();
		            	var distinct3 = Meteor.wrapAsync(raw3.distinct, raw3);
		            	rr_eventList1 = distinct3('eventName', {"tournamentId":tournamentId});

		            	var raw4 = roundRobinTeamEvents.rawCollection();
		            	var distinct4 = Meteor.wrapAsync(raw4.distinct, raw4);
		            	rr_eventList2 = distinct4('eventName', {"tournamentId":tournamentId});

            			rr_eventList = rr_eventList1.concat(rr_eventList2);

            			if(ko_eventList.length == 0 && rr_eventList.length == 0)
            			{
            				var resultJson={};
							resultJson["status"] = "failure";
							resultJson["message"] = "Draws not found!!";
							return resultJson;
            			}
            			else
            			{
							var resultJson={};
							var data = {};
							data["knockout"] = ko_eventList;
							data["roundrobin"] = rr_eventList;
							resultJson["status"] = "success";
							resultJson["data"] = data;
							resultJson["message"] = "Draws found!!";
							return resultJson;
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

		}catch(e)
		{
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament draws events "+e;
			return resultJson;
		}
	},

	//fetch uploaded tournament-category specific(applicable to both knockout and roundrobin)
	"fetchTourEventDraw":async function(data)
	{
		try{
			if(data && data.drawsType)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var categoryMsg = "Invalid category/event";
				var userMsg = "Invalid user";
				var eventId = "";

				var tourInfo = undefined;
				var eventInfo = undefined;
				var userInfo = undefined;

				var objCheck = false;
				if(data.drawsType.toLowerCase() == "knockout")		
					objCheck = Match.test(data, { tournamentId: String, 
						eventName:String,
						drawsType:String,
							userId: String});
				else if(data.drawsType.toLowerCase() == "roundrobin")
					objCheck = Match.test(data, { tournamentId: String, eventName:String,
						drawsType:String,userId: String});
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

            			            
	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament draws";
							return resultJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	          		
	          			var draw_results = await Meteor.call("fetchTourEventDrawResults",data.tournamentId,data.eventName,data.drawsType);
	            		if(draw_results)
	            		{
	            			return draw_results
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
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament draws "+e;
			return resultJson;
		}
	},
	//reset exisitng draw based on tournament(applicable to knockout & roundrobin)
	"resetTourEventDraw":async function(data)
	{
		try{
			if(data && data.drawsType)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var pastTourMsg = "Draws cannot be reset in past tournament!!"
				var categoryMsg = "Invalid category/event";
				var userMsg = "Invalid user";
				var organizerMsg = "Only organizer can reset draws!!"
				var eventId = "";

				var tourInfo = undefined;
				var eventInfo = undefined;
				var userInfo = undefined;

				var objCheck = false;
				if(data.drawsType.toLowerCase() == "knockout")		
					objCheck = Match.test(data, { tournamentId: String, eventName:String,
						drawsType:String,
							userId: String});
				else if(data.drawsType.toLowerCase() == "roundrobin")
					objCheck = Match.test(data, { tournamentId: String, eventName:String,
						drawsType:String,userId: String});
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Possible draw type - knockout/roundrobin";
					return resultJson;
				}

				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var userId = data.userId.trim();
					var drawsType = data.drawsType.trim();

					tourInfo = events.findOne({"_id": tournamentId});	            
	            	eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":eventName});      
	            	userInfo = Meteor.users.findOne({"userId":userId});

            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)
            		{
            			tourInfo = pastEvents.findOne({"_id":tournamentId});
            			//console.log("pastTour .. "+tourInfo+" ... "+tournamentId)
            			if(tourInfo)
            			{
            				tourInfo = undefined;
            				errorMsg.push(pastTourMsg);
            			}
            			else
            				errorMsg.push(tourMsg)    	
            		}        	
            	
            		if(eventInfo == undefined)          	
            			errorMsg.push(categoryMsg);

            		if(tourInfo && userInfo)
            		{
            			if(tourInfo.eventOrganizer != userId)
            				errorMsg.push(organizerMsg)
            		}
            		if(errorMsg.length == 0)
            		{
            			if(drawsType == "knockout" && (eventInfo.projectType == "1" || eventInfo.projectType == 1))
            			{
            				var exists = MatchCollectionDB.findOne({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
            				if(exists == undefined)
            					errorMsg.push("KnockOut "+eventName+" Draws not found!!");           			
            			}
            			else if(drawsType == "knockout" && (eventInfo.projectType == "2" || eventInfo.projectType == 2))
            			{
            				var exists = teamMatchCollectionDB.findOne({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
            				if(exists == undefined)
            					errorMsg.push("KnockOut "+eventName+" Draws not found!!");           			
            			}
            			else if(drawsType == "roundrobin" && (eventInfo.projectType == "1" || eventInfo.projectType == 1))
            			{
            				var exists = roundRobinEvents.findOne({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
            				if(exists == undefined)
            					errorMsg.push("RoundRobin "+eventName+" Draws not found!!");           			
            			}
            			else if(drawsType == "roundrobin" && (eventInfo.projectType == "2" || eventInfo.projectType == 2))
            			{
            				var exists = roundRobinTeamEvents.findOne({ $and: [{tournamentId: tournamentId, eventName: eventName}]});    
            				if(exists == undefined)
            					errorMsg.push("RoundRobin "+eventName+" Draws not found!!");           			
            			}
            		}	       	     
	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not reset tournament draws";
							return resultJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		var tourSport = "";
	            		var tourOrganizer = "";
	            		if(tourInfo.projectId && tourInfo.projectId.length > 0)
	            			tourSport = tourInfo.projectId[0];

	            		if(tourInfo.eventOrganizer)
	            			tourOrganizer = tourInfo.eventOrganizer;

	            		if(drawsType.toLowerCase() == "knockout" && eventInfo.projectType)
	            		{
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
	            			{
	            				var result = await Meteor.call("resetMatchRecords",tournamentId.trim(),eventName.trim(),tourOrganizer,tourSport) 
	            				if(result)
	            				{
	            					var resultJson = {};
	            					resultJson["status"] = "success";
	            					resultJson["message"] = tourInfo.eventName+": "+eventName+" knockout draws removed";
	            					return resultJson;
	            				}
	            				else
	            				{
	            					var resultJson = {};
	            					resultJson["status"] = "success";
	            					resultJson["message"] = "Could not reset "+tourInfo.eventName+": "+eventName+" knockout draws";
	            					return resultJson;
	            				}
	            			}
	            			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
	            			{
   								var result = await Meteor.call("resetMatchRecordsTeamMatch",tournamentId, eventName, tourOrganizer, tourSport) 
   								if(result)
	            				{
	            					var resultJson = {};
	            					resultJson["status"] = "success";
	            					resultJson["message"] = tourInfo.eventName+": "+eventName+" knockout draws removed";
	            					return resultJson;
	            				}
	            				else
	            				{
	            					var resultJson = {};
	            					resultJson["status"] = "success";
	            					resultJson["message"] = "Could not reset "+tourInfo.eventName+": "+eventName+" knockout draws";
	            					return resultJson;
	            				}
	            			}
	            		}
	            		else if(drawsType.toLowerCase() == "roundrobin")
	            		{
	            			if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
	            			{
								var result = await Meteor.call("resetRoundRobinMatchRecords",tournamentId, eventName);
	            				if(result)
	            				{
	            					var resultJson = {};
	            					resultJson["status"] = "success";
	            					resultJson["message"] = tourInfo.eventName+": "+eventName+" roundrobin draws removed";
	            					return resultJson;
	            				}
	            				else
	            				{
	            					var resultJson = {};
	            					resultJson["status"] = "success";
	            					resultJson["message"] = "Could not reset "+tourInfo.eventName+": "+eventName+" roundrobin draws";
	            					return resultJson;
	            				}
	            			}
	            			else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
	            			{
	            				var result = await Meteor.call("resetRoundRobinTeamMatchRecords",tournamentId, eventName);
	            				if(result)
	            				{
	            					var resultJson = {};
	            					resultJson["status"] = "success";
	            					resultJson["message"] = tourInfo.eventName+": "+eventName+" roundrobin draws removed";
	            					return resultJson;
	            				}
	            				else
	            				{
	            					var resultJson = {};
	            					resultJson["status"] = "success";
	            					resultJson["message"] = "Could not reset "+tourInfo.eventName+": "+eventName+" roundrobin draws";
	            					return resultJson;
	            				}
	            			}
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
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament draws "+e;
			return resultJson;
		}
	}

})