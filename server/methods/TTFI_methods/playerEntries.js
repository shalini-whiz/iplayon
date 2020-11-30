import {playerDBFind} from '../dbRequiredRole.js'


Meteor.methods({
	"fetchPlayerEntries":async function(data)
	{
		try{
			if(data)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var userMsg = "Invalid user";

				var tourInfo = undefined;
				var userInfo = undefined;

			
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						tournamentId: String, 
						userId: String})
															
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var userId = data.userId.trim();

					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		if(tourInfo)
	            			tourType = "past";
	            	} 

	            	
	            	userInfo = Meteor.users.findOne({"userId":userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
           	            
	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament player entries";
							return resultJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		//code to fetch player entries;

	            		var userDB = false;
	            		if(tourInfo && tourInfo.projectId && tourInfo.projectId[0]){
                			userDB = playerDBFind(tourInfo.projectId[0])
            			}
            			if(userDB)
            			{
            				var players;
				        	var dbsrequired = ["playerEntries"]
				        	var playerEntries = "playerEntries"

        				
           
	            			var res = await Meteor.call("changeDbNameForDraws", tourInfo,dbsrequired)
			                if(res)
			                {
			                    if(res.changeDb && res.changeDb == true){
			                        if(res.changedDbNames.length!=0){
			                            playerEntries = res.changedDbNames[0]
			                        }
			                    }
			                }
        

	        				var sum = 0;
	        				var eventList = [];
					        var feesValue = eventFeeSettings.findOne({
					            "tournamentId": tournamentId
					        })
					        if(feesValue)
					    		eventList = feesValue.singleEvents;

	        				if (feesValue && feesValue.singleEventFees)
	        				{
	            				var arrayFees = feesValue.singleEventFees
	            				sum = _.reduce(arrayFees, function(memo, num) {
	                				return parseInt(memo) + parseInt(num);
	            				}, 0)
	        				}

	        				var matchJson = {};
	        				matchJson["tournamentId"] = tournamentId;
	        				if(sum > 0)
	        					matchJson["totalFee"] = {$nin: ["0", 0]};
	        				    
	        				//var start = new Date().getTime();     							          
					        players = global[playerEntries].aggregate([
								{$match:matchJson},					
								{$lookup:{
						            from: "users",       
						            localField: "playerId",   
						            foreignField: "userId", 
						            as: "userDetails"        
						        }},
            					{$unwind:"$userDetails" },
            					{$project : { 
			                        "_id":1,
			                        "playerId":1,
			                        "subscribedEvents":1,
			                        "totalFee":1,
			                        "paidOrNot":1,
			                        "playerName":"$userDetails.userName",
			                        "academyId":1,
			                        "associationId":1,
                            	}}                            
            				])

	       					//var end = new Date().getTime();
	       					//var time = end - start;
							////console.log('Execution time: ' + time);
	        				var resultJson = {};
	        				resultJson["status"] = "success";
	        				resultJson["data"] = players;
	        				resultJson["eventList"] = eventList;
	        				resultJson["message"] = "Player Entries Fetched";
	        				return resultJson
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
			resultJson["message"] = "Could not fetch tournament player entries "+e;
			return resultJson;
		}
	},
	"fetchAcademyEntries":async function(data)
	{
		try{
			if(data)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var userMsg = "Invalid user";

				var tourInfo = undefined;
				var userInfo = undefined;

			
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						tournamentId: String, 
						userId: String})
												
			
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var userId = data.userId.trim();

					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		if(tourInfo)
	            			tourType = "past";
	            	} 

	            	
	            	userInfo = Meteor.users.findOne({"userId":userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
           	            
	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament player entries";
							return resultJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		//code to fetch player entries;

	            		var academies;
    					var sum = 0;
    					var feesValue = eventFeeSettings.findOne({
        					"tournamentId": tournamentId
    					})
					    if (feesValue && feesValue.singleEventFees) {
					        var arrayFees = feesValue.singleEventFees
					        sum = _.reduce(arrayFees, function(memo, num) {
					            return parseInt(memo) + parseInt(num);
					        }, 0)
					    }
					    var matchJson = {};
					    matchJson["tournamentId"] = tournamentId;
					    if(sum > 0)
					    	matchJson["totalFee"] = {$nin: ["0", 0]};

        				//academies = academyEntries.find(matchJson).fetch();
    					academies = academyEntries.aggregate([
								{$match:matchJson},					
								{$lookup:{
						            from: "academyDetails",       
						            localField: "academyId",   
						            foreignField: "userId", 
						            as: "academyDetails"        
						        }},
            					{$unwind:"$academyDetails" },
            					{$project : { 
			                        "_id":1,
			                        "academyId":1,
			                        "associationId":1,
			                        "parentAssociationId":1,
			                        "totalFee":1,
			                        "paidOrNot":1,
			                        "academyName":"$academyDetails.clubName",
                            	}}                          	
            				])

       
            			//console.log("getAcademyFinancial"+academies.length);
            			var resultJson = {};
	        			resultJson["status"] = "success";
	        			resultJson["data"] = academies;
	        			resultJson["message"] = "Academy Entries Fetched";
	        			return resultJson

	            		
	          			         			           	
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
			resultJson["message"] = "Could not fetch tournament player entries "+e;
			return resultJson;
		}
	},
	"fetchDAEntries":async function(data)
	{
		try{
			if(data)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var userMsg = "Invalid user";

				var tourInfo = undefined;
				var userInfo = undefined;

			
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						tournamentId: String, 
						userId: String})
												
			
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var userId = data.userId.trim();

					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		if(tourInfo)
	            			tourType = "past";
	            	} 

	            	
	            	userInfo = Meteor.users.findOne({"userId":userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
           	            
	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament player entries";
							return resultJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		//code to fetch player entries;

	            		var associations = [];
    					var sum = 0;
    					var feesValue = eventFeeSettings.findOne({
        					"tournamentId": tournamentId,
    					})
    					if (feesValue && feesValue.singleEventFees) 
    					{
        					var arrayFees = feesValue.singleEventFees
        					sum = _.reduce(arrayFees, function(memo, num) {
            					return parseInt(memo) + parseInt(num);
        					}, 0)
    					}
    					var matchJson = {};
    					matchJson["tournamentId"] = tournamentId;
    					if(sum > 0)
    						matchJson["totalFee"] = {$nin: ["0", 0]};



	            		
    					associations = districtAssociationEntries.aggregate([
								{$match:matchJson},					
								{$lookup:{
						            from: "associationDetails",       
						            localField: "associationId",   
						            foreignField: "userId", 
						            as: "associationDetails"        
						        }},
            					{$unwind:"$associationDetails"},
            					{$project : { 
			                        "_id":1,
			                        "associationId":1,
			                        "associationName":"$associationDetails.associationName",
			                        "parentAssociationId":1,
			                        "totalFee":1,
			                        "paidOrNot":1,
                            	}}                          	
            				])
    					//console.log("associations ... "+JSON.stringify(associations))
       
            			//console.log("getDAFinancial "+associations.length);
            			var resultJson = {};
	        			resultJson["status"] = "success";
	        			resultJson["data"] = associations;
	        			resultJson["message"] = "Association Entries Fetched";
	        			return resultJson

	            		
	          			         			           	
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
			resultJson["message"] = "Could not fetch tournament association entries "+e;
			return resultJson;
		}
	},
	"fetchPlayerTeamEntries":async function(data)
	{
		try{
			if(data)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var userMsg = "Invalid user";

				var tourInfo = undefined;
				var userInfo = undefined;
			
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						tournamentId: String, 
						userId: String})
												
			
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var userId = data.userId.trim();

					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		if(tourInfo)
	            			tourType = "past";
	            	} 

	            	
	            	userInfo = Meteor.users.findOne({"userId":userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    	
            	
           	            
	            	if(errorMsg.length > 0)
					{
							//console.log("contains errors");
							var resultJson={};
							resultJson["status"] = "failure";
							resultJson["errorMsg"] = errorMsg;
							resultJson["message"] = "Could not fetch tournament player entries";
							return resultJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		
	            		var dbsrequired = ["playerTeamEntries"]
    					var playerTeamEntries = "playerTeamEntries"

    
        				var res =  Meteor.call("changeDbNameForDraws", tourInfo,dbsrequired)
			            if(res){
			                if(res.changeDb && res.changeDb == true){
			                    if(res.changedDbNames.length!=0){
			                        playerTeamEntries = res.changedDbNames[0]
			                    }
			                }
			            }
    

					    var players;
					    var sum = 0;
					    var eventList = [];

					    


					    var feesValue = eventFeeSettings.findOne({
					        "tournamentId": tournamentId
					    })
					    if(feesValue)
					    	eventList = feesValue.teamEvents;

					    if (feesValue && feesValue.teamEventFees) {
					        var arrayFees = feesValue.teamEventFees
					        sum = _.reduce(arrayFees, function(memo, num) {
					            return parseInt(memo) + parseInt(num);
					        }, 0)
					    }
					    var matchJson = {};
					    matchJson["tournamentId"] = tournamentId;
					    if(sum > 0)
					    	matchJson["totalFee"] = {$nin: ["0", 0]};
				      
				        players = global[playerTeamEntries].aggregate([
								{$match:matchJson},					
								{$lookup:{
						            from: "users",       
						            localField: "playerId",   
						            foreignField: "userId", 
						            as: "userDetails"        
						        }},
            					{$unwind:"$userDetails"},
            					{$project : { 
			                        "_id":1,
			                        "playerId":1,
			                        "playerName":"$userDetails.userName",
			                        "subscribedEvents":1,
			                        "totalFee":1,
			                        "paidOrNot":1,
                            	}}                          	
            				])
   
				       
	        				////console.log("players count .."+players.length)
	        				var resultJson = {};
	        				resultJson["status"] = "success";
	        				resultJson["data"] = players;
	        				resultJson["eventList"] = eventList;
	        				resultJson["message"] = "Player Entries Fetched";
	        				//console.log("players team .. "+JSON.stringify(resultJson))

	        				return resultJson
            			
	            		
	          			         			           	
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
			resultJson["message"] = "Could not fetch tournament player entries "+e;
			return resultJson;
		}
	},
	"entryPayReceipt" :async function(data)
	{
		try{
			//console.log("entered here")
			if(data)
			{
				var errorMsg = [];
				var tourMsg = "Invalid tournament";
				var userMsg = "Invalid user";
				var typeMsg = "Possible type are playerEntry/academyEntry/daEntry/teamEntry";
				var passwordMsg = "Invalid password";
				var recordMsg = "Invalid record";
				var tourInfo = undefined;
				var userInfo = undefined;
			
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						"tournamentId": String, 
						"userId": String,
						"type":String,
						"password":String,
						"recordId":String})
												
			
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var userId = data.userId.trim();
					var type = data.type.trim();
					var password = data.password.trim();
					var recordId = data.recordId.trim();

					var entryInfo = undefined;


					if(type != "playerEntry" && type != "academyEntry" && 
						type != "daEntry" && type != "teamEntry")
						errorMsg.push(typeMsg);

					tourInfo = events.findOne({"_id":tournamentId});
	            	if(tourInfo == undefined)
	            	{
	            		tourInfo = pastEvents.findOne({
	            			"_id":tournamentId
	            		})
	            		if(tourInfo)
	            			tourType = "past";
	            	} 
	            	
	            	userInfo = Meteor.users.findOne({"userId":userId});
            		if(userInfo == undefined)
            			errorMsg.push(userMsg);

            		if(tourInfo == undefined)          	
            			errorMsg.push(tourMsg)    

            		if(userInfo)
            		{
            			var digest = Package.sha.SHA256(password);
            			var password = {
							"digest": digest,
							"algorithm": 'sha-256'
						};
						var validUserAuth = Accounts._checkPassword(userInfo, password);
						if(!validUserAuth)
							errorMsg.push(passwordMsg);
            		}

            		if(type == "playerEntry")
            		{
            			entryInfo = playerEntries.findOne({"tournamentId":tournamentId,"_id":recordId});
            			if(entryInfo == undefined)
            				errorMsg.push(recordMsg);
            		}
            		else if(type == "academyEntry")
            		{
            			entryInfo = academyEntries.findOne({"tournamentId":tournamentId,"_id":recordId});
            			if(entryInfo == undefined)
            				errorMsg.push(recordMsg);
            		}
            		else if(type == "daEntry")
            		{
            			entryInfo = districtAssociationEntries.findOne({"tournamentId":tournamentId,"_id":recordId});
            			if(entryInfo == undefined)
            				errorMsg.push(recordMsg);
            		}
            		else if(type == "teamEntry")
            		{
            			//console.log("teamEntry .. "+tournamentId+" ,... "+recordId);
            			var xx = playerTeamEntries.find({}).fetch();
            			//console.log("xx .."+xx.length)
						entryInfo = playerTeamEntries.findOne({"tournamentId":tournamentId,"_id":recordId});
            			if(entryInfo == undefined)
            				errorMsg.push(recordMsg);
            		}

            	
           	        //console.log("errorMsg .. "+errorMsg)
	            	if(errorMsg.length > 0)
					{

						//console.log("contains errors");
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not fetch tournament player entries";
						return resultJson;
					
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		
            			//yet to code
            			if(type == "playerEntry")
            			{
            				//playerFinancialEntryTemplate
            				var dbsrequiredINdFEE = ["playerEntries","userDetailsTT"]
							var playerEntriesINdFEE = "playerEntries";

            				var playerId = entryInfo.playerId;
            				var academyId = entryInfo.academyId;
            				var associationId = entryInfo.associationId;
            				var userDB = false;
	            			if(tourInfo && tourInfo.projectId && tourInfo.projectId[0]){
                				userDB = playerDBFind(tourInfo.projectId[0])
            				}
            				if(userDB)
            				{
            					var eventList = [];
            					var playerInfo = global[userDB].findOne({"userId":playerId});
            					var eventSettingsInfo = eventFeeSettings.findOne({
                                	"tournamentId": tournamentId
                           	 	})
                            	
            					if(playerInfo && eventSettingsInfo)
            					{
            						var dbResult = Meteor.call("changeDbNameForDraws", tournamentId,dbsrequiredINdFEE);
            						if(dbResult)
            						{
                						if(dbResult.changeDb && dbResult.changeDb == true)
                						{
                    						if(dbResult.changedDbNames.length!=0)
                    						{
                        						playerEntriesINdFEE = dbResult.changedDbNames[0]
                        						userDetailsTTINdFEE = dbResult.changedDbNames[1]
                    						}
                						}
            						}
       

            						eventList = eventSettingsInfo.singleEvents;

            						var playerMail = "";
            						var parentMail = "";
            						var ccUserId = [];


            						if(playerInfo.emailAddress)
            							playerMail = playerInfo.emailAddress

            						var sentData = {
                                    	sentReceiptUserId: playerId,
                                    	sentReceiptTournamentId: tournamentId,
                                    	total: entryInfo.totalFee,
                                    	abbName: eventList,
                                    	events_value: entryInfo.subscribedEvents
                                	}
                                	if(academyId != "other")
                                	{
                                		sentData["academyId"] = academyId;
                                		ccUserId = [academyId];

                                		var parentInfo = Meteor.users.findOne({"userId":academyId});
                                		if(parentInfo && parentInfo.emailAddress)
                                			parentMail = parentInfo.emailAddress;
                                	}
                                	else if(associationId != "other"){
                                		sentData["academyId"] = associationId;
                                		ccUserId = [associationId];

                                		var parentInfo = Meteor.users.findOne({"userId":associationId});
                                		if(parentInfo && parentInfo.emailAddress)
                                			parentMail = parentInfo.emailAddress;
                                	}
                                	else
                                		sentData["academyId"] = "other";
                                	var result = await Meteor.call("changeFinancialsPlayer", sentData, playerEntriesINdFEE);
            						      							           					                                
                                	if(result)
                                	{
                                	
                                		if(playerMail != "")
                                		{
                                			var dataContext = {
                                            	message: "Here is your confirmation for your last subscription on iPlayOn",
                                            	tournament: tourInfo.eventName,
                                            	myName: playerInfo.userName,
                                            	eventName: eventList,
                                            	total: entryInfo.totalFee,
                                            	prize: entryInfo.subscribedEvents,
                                            	playerName: playerInfo.userName,
                                            	playerPhone: playerInfo.phoneNumber
                                        	}
                                        	SSR.compileTemplate('playerFinancialEntryTemplate', Assets.getText('playerFinancialEntryTemplate.html'));
	                						Template.playerFinancialEntryTemplate.helpers({
	                    						getDocType: function() {
	                        						return "<!DOCTYPE html>";
	                    						},                                              
	                						});

                	
               								var html_string = SSR.render('playerFinancialEntryTemplate', dataContext);
               								var options = {
				                   				from: "iplayon.in@gmail.com",
				                   				to: playerMail,
				                   				cc:parentMail,
				                   				subject: "iPlayOn:Receipt of subscription",
				                   				html: html_string
				                			}
				                			var smsTemplate = "Hi "+playerInfo.userName+",Here is your confirmation of total fee Rs."+entryInfo.totalFee+" for your last subscription on iPlayOn:"+tourInfo.eventName;
	                                        for(var v=0;v<eventList.length;v++)
	                                        {
	                                            if(v == 0)
	                                                smsTemplate += "\n Events:\n";
	                                            if(entryInfo.subscribedEvents[v] != null && parseInt(entryInfo.subscribedEvents[v]) > 0)
	                                                smsTemplate += eventList[v]+" - Rs."+entryInfo.subscribedEvents[v]+"\n";
	                                        }
                                        	

	                                		var emailResult = Meteor.call("sendSMSEmailNotification",playerId,smsTemplate,options,[]);
	                               		 	//console.log("emailResult .. "+emailResult)
			                                if(emailResult)
			                                {
			                                	var resultJson={};
												resultJson["status"] = "success";
												resultJson["message"] = "Mail sent to "+playerMail;
												return resultJson;
			                                }
			                                else
			                                {
			                                	var resultJson={};
												resultJson["status"] = "failure";
												resultJson["message"] = "Could not send email to "+playerMail;
												return resultJson;
			                                }
                                		}
                                		else if(parentMail != "")
                                		{
                                			var dataContext = {
	                                            message: "Here is confirmation for recent subscription of your academy player, tournamentName is",
	                                            tournament: tourInfo.eventName,
	                                            eventName: eventList,
	                                            prize: entryInfo.subscribedEvents,
	                                            myName: parentInfo.contactPerson,
	                                            total: entryInfo.totalFee,
	                                            playerName: playerInfo.userName,
	                                            playerPhone: playerInfo.phoneNumber

                                        	}
                                        	//playerToParentFinancialTemplate
                                        	SSR.compileTemplate('playerToParentFinancialTemplate', Assets.getText('playerToParentFinancialTemplate.html'));
	                						Template.playerToParentFinancialTemplate.helpers({
	                    						getDocType: function() {
	                        						return "<!DOCTYPE html>";
	                    						},                                              
	                						});

                							//console.log("parent mail entered")
               								var html_string = SSR.render('playerToParentFinancialTemplate', dataContext);
               								var options = {
				                   				from: "iplayon.in@gmail.com",
				                   				to:parentMail,
				                   				subject: "iPlayOn:Receipt of subscription",
				                   				html: html_string
				                			}
				                			var smsTemplate = "Hi "+parentInfo.contactPerson+",Here is confirmation for recent subscription of your academy player of tournamentName "+tourInfo.eventName;
	                                        for(var v=0;v<eventList.length;v++)
	                                        {
	                                            if(v == 0)
	                                                smsTemplate += "\n Events:\n";
	                                            if(entryInfo.subscribedEvents[v] != null && parseInt(entryInfo.subscribedEvents[v]) > 0)
	                                                smsTemplate += eventList[v]+" - Rs."+entryInfo.subscribedEvents[v]+"\n";
	                                        }
	                                       

	                                        var emailResult = Meteor.call("sendSMSEmailNotification",parentInfo.userId,smsTemplate,options,[]);
	                               		 	//console.log("emailResult .. "+emailResult)
			                                if(emailResult)
			                                {
			                                	var resultJson={};
												resultJson["status"] = "success";
												resultJson["message"] = "Mail sent to "+parentMail;
												return resultJson;
			                                }
			                                else
			                                {
			                                	var resultJson={};
												resultJson["status"] = "failure";
												resultJson["message"] = "Could not send email to "+parentMail;
												return resultJson;
			                                }
                                		}
                                			
                                	}
                                	else
                                	{
                                		var resultJson={};
										resultJson["status"] = "failure";
										resultJson["message"] = "Receipt Transaction failed";
										return resultJson;
                                	}                      
            					}
            					else
            					{
            						var resultJson={};
									resultJson["status"] = "failure";
									resultJson["message"] = "Invalid player";
									return resultJson;
            					}
            				}



            			}
            			else if(type == "academyEntry")
            			{

            				var sentData={
								sentReceiptUserId:entryInfo.academyId,
								sentReceiptTournamentId:tournamentId
							}
							//console.log("academy sentData "+JSON.stringify(sentData))
					 		var result = await Meteor.call("insertAcademyReceipt",sentData);
            				if(result)
            				{
            					var academyId = entryInfo.academyId;
            					var academyInfo = academyDetails.findOne({"userId":academyId});
            					if(academyInfo)
            					{
            						var emailToclub = academyInfo.emailAddress;

            						var dataContext = {
				                    	message: "Here is confirmation for recent subscription of your academy player, tournamentName is",
				                    	tournament: tourInfo.eventName,
				                    	myName:academyInfo.contactPerson,
				                   	 	total:entryInfo.totalFee,	              
				                    	playerName:academyInfo.clubName,
			                        	playerPhone:academyInfo.phoneNumber
			               			}
									//console.log("academy dataContext "+JSON.stringify(dataContext))

	 								var smsTemplate = "Hi "+academyInfo.academyContactPerson+",Here is confirmation for recent subscription of your academy player, tournament "+tourInfo.eventName;
	                                smsTemplate += "\n Entry fee total:"+entryInfo.totalFee;
	                                var ccUserId = [];

	                                SSR.compileTemplate('academyFinancialEntryTemplate', Assets.getText('academyFinancialEntryTemplate.html'));
	                				Template.academyFinancialEntryTemplate.helpers({
	                    				getDocType: function() {
	                        			return "<!DOCTYPE html>";
	                    				},                                              
	                				});

                	
               						var html_string = SSR.render('academyFinancialEntryTemplate', dataContext);

               						var options = {
				                   		from: "iplayon.in@gmail.com",
				                   		to: emailToclub,
				                   		subject: "iPlayOn:Receipt of subscription",
				                   		html: html_string
				                	}

	                                var emailResult = Meteor.call("sendSMSEmailNotification",academyId,smsTemplate,options,[]);
	                                //console.log("emailResult .. "+emailResult)
	                                if(emailResult)
	                                {
	                                	var resultJson={};
										resultJson["status"] = "success";
										resultJson["message"] = "Mail sent to "+academyInfo.emailAddress;
										return resultJson;
	                                }
	                                else
	                                {
	                                	var resultJson={};
										resultJson["status"] = "failure";
										resultJson["message"] = "Could not send email to "+academyInfo.emailAddress;
										return resultJson;
	                                }
	                            }
	                                           					
            					else
            					{
            						var resultJson={};
									resultJson["status"] = "failure";
									resultJson["message"] = "Invalid academy";
									return resultJson;
            					}
            				}
            				else
            				{
            					var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Receipt Transaction failed";
								return resultJson;
            				}
            			}
            			else if(type == "daEntry")
            			{
            				//<template name="dAFinancialEntryTemplate">

            				var sentData={
									sentReceiptUserId:entryInfo.associationId,
									sentReceiptTournamentId:tournamentId
								}
							//console.log("DA sentData .. "+JSON.stringify(sentData))

					 		var result = Meteor.call("insertDAReceipt",sentData)
					 		if(result)
					 		{
					 			var associationId = entryInfo.associationId;
					 			var assocInfo = associationDetails.findOne({"userId":associationId});
            					if(assocInfo)
            					{
            						var emailTo = assocInfo.emailAddress;

            						var dataContext = {
				                    	message: "Here is confirmation for recent subscription of your academy player, tournamentName is",
				                    	tournament: tourInfo.eventName,
				                    	myName:assocInfo.contactPerson,
				                   	 	total:entryInfo.totalFee,	              
				                    	playerName:assocInfo.associationName,
			                        	playerPhone:assocInfo.phoneNumber
			               			}
			               			
									//console.log("assoc dataContext "+JSON.stringify(dataContext))
						

	                                SSR.compileTemplate('dAFinancialEntryTemplate', Assets.getText('dAFinancialEntryTemplate.html'));
	                				Template.dAFinancialEntryTemplate.helpers({
	                    				getDocType: function() {
	                        			return "<!DOCTYPE html>";
	                    				},                                              
	                				});
						             
               						var html_string = SSR.render('dAFinancialEntryTemplate', dataContext);

               						var smsTemplate = "Hi "+assocInfo.associationName+",Here is confirmation for recent subscription of your association , tournament "+tourInfo.eventName;
                                	smsTemplate += "\n Entry fee total:"+entryInfo.totalFee;
                               		 var ccUserId = [];

               						var options = {
				                   		from: "iplayon.in@gmail.com",
				                   		to: emailTo,
				                   		subject: "iPlayOn:Receipt of subscription",
				                   		html: html_string
				                	}

	                                var emailResult = Meteor.call("sendSMSEmailNotification",associationId,smsTemplate,options,[]);
	                                //console.log("emailResult .. "+emailResult)
	                                if(emailResult)
	                                {
	                                	var resultJson={};
										resultJson["status"] = "success";
										resultJson["message"] = "Mail sent to "+assocInfo.emailAddress;
										return resultJson;
	                                }
	                                else
	                                {
	                                	var resultJson={};
										resultJson["status"] = "failure";
										resultJson["message"] = "Could not send email to "+assocInfo.emailAddress;
										return resultJson;
	                                }
	                            }
	                                           					
            					else
            					{
            						var resultJson={};
									resultJson["status"] = "failure";
									resultJson["message"] = "Invalid academy";
									return resultJson;
            					}
					 		}
					 		else
					 		{
					 			var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Receipt Transaction failed";
								return resultJson;
					 		}

            			}
            			if(type == "teamEntry")
            			{
            				//playerFinancialEntryTemplate
							var dbsrequired = ["playerTeamEntries","userDetailsTT"]
							var playerTeamEntriesDB = "playerTeamEntries"
							var userDetailsTT = "userDetailsTT"

            				var playerId = entryInfo.playerId;
            				var academyId = entryInfo.academyId;
            				var associationId = entryInfo.associationId;
            				var userDB = false;
	            			if(tourInfo && tourInfo.projectId && tourInfo.projectId[0]){
                				userDB = playerDBFind(tourInfo.projectId[0])
            				}
            				if(userDB)
            				{
            					var eventList = [];
            					var playerInfo = global[userDB].findOne({"userId":playerId});
            					var eventSettingsInfo = eventFeeSettings.findOne({
                                	"tournamentId": tournamentId
                           	 	})
                            	
            					if(playerInfo && eventSettingsInfo)
            					{
            						var dbResult = Meteor.call("changeDbNameForDraws", tournamentId,dbsrequired);
            						if(dbResult)
            						{
                						if(dbResult.changeDb && dbResult.changeDb == true)
                						{
                    						if(dbResult.changedDbNames.length!=0)
                    						{
                        						playerTeamEntriesDB = dbResult.changedDbNames[0]
                        						userDetailsTT = dbResult.changedDbNames[1]
                    						}
                						}
            						}

            						eventList = eventSettingsInfo.teamEvents;

            						var playerMail = "";
            						var parentMail = "";
            						var ccUserId = [];


            						if(playerInfo.emailAddress)
            							playerMail = playerInfo.emailAddress

            						var sentData = {
                                    	sentReceiptUserId: playerId,
                                    	sentReceiptTournamentId: tournamentId,
                                    	total: entryInfo.totalFee,
                                    	abbName: eventList,
                                    	events_value: entryInfo.subscribedEvents
                                	}
                                	

                                	if(academyId != "other")
                                	{
                                		sentData["academyId"] = academyId;
                                		ccUserId = [academyId];

                                		var parentInfo = Meteor.users.findOne({"userId":academyId});
                                		if(parentInfo && parentInfo.emailAddress)
                                			parentMail = parentInfo.emailAddress;
                                	}
                                	else if(associationId != "other"){
                                		sentData["academyId"] = associationId;
                                		ccUserId = [associationId];

                                		var parentInfo = Meteor.users.findOne({"userId":associationId});
                                		if(parentInfo && parentInfo.emailAddress)
                                			parentMail = parentInfo.emailAddress;
                                	}
                                	else
                                		sentData["academyId"] = "other";
                                	var result = await Meteor.call("insertPlayerTeamReceipt", sentData, playerTeamEntriesDB);
            						      							           					                                
                                	if(result)
                                	{
                                		var subscribedTeamEventsID = entryInfo.subscribedTeamID;
                                		var teamDetails = Meteor.call("getTeamInfo",subscribedTeamEventsID);
                                		if(playerMail != "")
                                		{


                                			var dataContext = {
                                            	message: "Here is your confirmation for your last subscription on iPlayOn",
                                            	tournament: tourInfo.eventName,
                                            	myName: playerInfo.userName,
                                            	eventName: eventList,
                                            	total: entryInfo.totalFee,
                                            	prize: entryInfo.subscribedEvents,
                                            	playerName: playerInfo.userName,
                                            	playerPhone: playerInfo.phoneNumber
                                        	}
                                        	if(teamDetails)
                                        		dataContext["teamDetails"]  =teamDetails;

                                        	

                                        	SSR.compileTemplate('playerFinancialEntryTemplate', Assets.getText('playerFinancialEntryTemplate.html'));
	                						Template.playerFinancialEntryTemplate.helpers({
	                    						getDocType: function() {
	                        						return "<!DOCTYPE html>";
	                    						},                                              
	                						});

                	
               								var html_string = SSR.render('playerFinancialEntryTemplate', dataContext);
               								var options = {
				                   				from: "iplayon.in@gmail.com",
				                   				to: playerMail,
				                   				cc:parentMail,
				                   				subject: "iPlayOn:Receipt of subscription",
				                   				html: html_string
				                			}
                                        	var smsTemplate = "Hi,Here is confirmation for recent subscription of your academy/school player "+playerInfo.userName+" of tournament "+tourInfo.eventName;
	                                        for(var v=0;v<eventList.length;v++)
	                                        {
	                                            if(v == 0)
	                                                smsTemplate += "\n Events:\n";
	                                            if(entryInfo.subscribedEvents[v] != null && parseInt(entryInfo.subscribedEvents[v]) > 0)
	                                                smsTemplate += eventList[v]+" - Rs."+entryInfo.subscribedEvents[v]+"\n";
	                                        }
                                        	
                                                
                                            smsTemplate += "Entry fee total: Rs."+entryInfo.totalFee;

	                                		var emailResult = Meteor.call("sendSMSEmailNotification",playerId,smsTemplate,options,[]);
	                               		 	//console.log("emailResult .. "+emailResult)
			                                if(emailResult)
			                                {
			                                	var resultJson={};
												resultJson["status"] = "success";
												resultJson["message"] = "Mail sent to "+playerMail;
												return resultJson;
			                                }
			                                else
			                                {
			                                	var resultJson={};
												resultJson["status"] = "failure";
												resultJson["message"] = "Could not send email to "+playerMail;
												return resultJson;
			                                }
                                		}
                                		else if(parentMail != "")
                                		{
                                			var dataContext = {
	                                            message: "Here is confirmation for recent subscription of your academy/school player, tournamentName",
	                                            tournament: tourInfo.eventName,
	                                            eventName: eventList,
	                                            prize: entryInfo.subscribedEvents,
	                                            myName: parentInfo.contactPerson,
	                                            total: entryInfo.totalFee,
	                                            playerName: playerInfo.userName,
	                                            playerPhone: playerInfo.phoneNumber

                                        	}
                                        	if(teamDetails)
                                        		dataContext["teamDetails"]  =teamDetails;
                                        
                                            
       
                                        	//playerToParentFinancialTemplate
                                        	SSR.compileTemplate('playerToParentFinancialTemplate', Assets.getText('playerToParentFinancialTemplate.html'));
	                						Template.playerToParentFinancialTemplate.helpers({
	                    						getDocType: function() {
	                        						return "<!DOCTYPE html>";
	                    						},                                              
	                						});

                							//console.log("parent mail entered")
               								var html_string = SSR.render('playerToParentFinancialTemplate', dataContext);
               								var options = {
				                   				from: "iplayon.in@gmail.com",
				                   				to:parentMail,
				                   				subject: "iPlayOn:Receipt of subscription",
				                   				html: html_string
				                			}  
				                			var smsTemplate = "Hi,Here is confirmation for recent subscription of your academy/school player "+playerInfo.userName+" of tournament "+tourInfo.userName;

	                                        for(var v=0;v<eventList.length;v++)
	                                        {
	                                            if(v == 0)
	                                                smsTemplate += "\n Events:\n";
	                                            if(entryInfo.subscribedEvents[v] != null && parseInt(entryInfo.subscribedEvents[v]) > 0)
	                                                smsTemplate += eventList[v]+" - Rs."+entryInfo.subscribedEvents[v]+"\n";
	                                        }
	                                       

	                                        var emailResult = Meteor.call("sendSMSEmailNotification",parentInfo.userId,smsTemplate,options,[]);
	                               		 	//console.log("emailResult .. "+emailResult)
			                                if(emailResult)
			                                {
			                                	var resultJson={};
												resultJson["status"] = "success";
												resultJson["message"] = "Mail sent to "+parentMail;
												return resultJson;
			                                }
			                                else
			                                {
			                                	var resultJson={};
												resultJson["status"] = "failure";
												resultJson["message"] = "Could not send email to "+parentMail;
												return resultJson;
			                                }
                                		}
                                			
                                	}
                                	else
                                	{
                                		var resultJson={};
										resultJson["status"] = "failure";
										resultJson["message"] = "Receipt Transaction failed";
										return resultJson;
                                	}                      
            					}
            					else
            					{
            						var resultJson={};
									resultJson["status"] = "failure";
									resultJson["message"] = "Invalid player";
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
			//console.log(e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not send receipt "+e;
			return resultJson;
		}
	},
	

})