function titleCase(str) {
  return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}


function categoryEligiblity(find1,tournamentId,eventUnderTour,userDetails)
{
	var filterStatus = false;
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
		        else if (_.contains(onBefArra, find1.eventId) && new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase()) 
		            filterStatus =  true
		        else if (_.contains(onBefArra, find1.eventId) && new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL") 
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
		        filterStatus = true;
		    
		    else if(new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL")	    
		        filterStatus = true;                  			
		    else              			
		        filterStatus = false           
		                  			
		}
	}

	return filterStatus;
}

Meteor.methods({

	"registrationSubscriptionUnderAssoc":async function(data)
	{
		try{

			var successJson = succesData();
            var failureJson = failureData();
            var errorMsg = [];
            var dupPlayers = [];
            var regPlayers = [];

            if(data.tournamentId && data.playerDetails)
            {

            	var tourInfo = events.findOne({"tournamentId":data.tournamentId});
            	var eventSettings = eventFeeSettings.findOne({"tournamentId":data.tournamentId});

            	var promoInfo = promo.findOne({"promo":{
                        $regex: new RegExp('^' + data.promoCode + '$', "i")
                    },"status":"active"});

            	if(tourInfo && eventSettings && eventSettings.events && promoInfo)
            	{
		       		if(moment(moment(tourInfo.eventSubscriptionLastDate1).format("YYYY-MM-DD"))>=
		       			moment(moment.tz(tourInfo.timeZoneName).format("YYYY-MM-DD")))
		       		{
		       			var playerDetails = data.playerDetails;
	            		for(var i =0; i< playerDetails.length;i++)
	            		{
	            			
	            			var regQuery = {
	            				"userName": {
		                            '$regex':  '^'+playerDetails[i]["Name"].trim()+'$' ,
		                            '$options': 'i'
	                       		},
	                       		"dateOfBirth":new Date(playerDetails[i]["DOB"]),
	                       		"gender":titleCase(playerDetails[i]["Gender"]),
	                       		"emailAddress":{$regex: emailRegex(playerDetails[i]["EmailID"])}
	            			}

	            			playerDetails[i]["subscribeEvents"] = [];
	                        playerDetails[i]["unSubscribeEvents"] = [];

	            			var userInfo = userDetailsTT.findOne(regQuery);

	            			if(userInfo)
	            			{
	            				playerDetails[i]["reason"] = "User found with this name/dob/emailid"; 
	            				dupPlayers.push(playerDetails[i]);
	            			}
	            			else
	            			{
	            				var userFound = Meteor.users.findOne({
	                                    $or: [{
	                                        "emailAddress": {
	                                            $regex: emailRegex(playerDetails[i]["EmailID"])
	                                        },
	                                        "emails.0.address": {
	                                            $regex: emailRegex(playerDetails[i]["EmailID"])
	                                        }
	                                    }]
	                                });

	            				//userFound = undefined
	            				if(userFound)
	            				{
	            					playerDetails[i]["reason"] = "Already user exists with this email id "+playerDetails[i]["EmailID"]; 

	            					dupPlayers.push(playerDetails[i]);
	            				}
	            				else
	            				{

	            					var registerParam = {};
	            					registerParam["emailAddress"] = playerDetails[i]["EmailID"];
	            					registerParam["password"] = "abcdef";
	            					registerParam["userName"] = playerDetails[i]["Name"];
	            					registerParam["gender"] = titleCase(playerDetails[i]["Gender"])
	            					registerParam["dob"] = playerDetails[i]["DOB"];
	            					registerParam["emailIdOrPhone"] = "1",
	            					registerParam["role"] = "Player";
	            					registerParam["phoneNumber"] = "";
	            					registerParam["associationId"] = playerDetails[i]["AssociationID"]

	            					var playerReg = await Meteor.call("playerRegisterUnderAssoc",registerParam);
	            					

	            					if(playerReg)
	            					{

	            						var userDetails = userDetailsTT.findOne({"userId":playerReg});
	            						playerDetails[i]["reason"] = "User registered"; 
		            					var tourEvents = eventSettings.singleEvents;
		            					var eventFees = eventSettings.singleEventFees;
		            					var defTourFees = new Array(tourEvents.length);
		            					defTourFees.fill("0");

		            					var totalFee = 0;
		            					var subFailMsg = [];
		            					var subSucMsg = [];
		            					var subscribeID = [];
		            					var unsubscribeID = [];

	                                    for(var m= 0; m < tourEvents.length; m++)
	                                    {
	                                    	var category = tourEvents[m];
	                                    	var categoryInfo = events.findOne({"tournamentId":data.tournamentId,"abbName":category});

	                                    	if(playerDetails[i][category] != undefined && playerDetails[i][category] != null &&
	                                    		playerDetails[i][category].length > 0)
	                                    	{

		                                    	if(playerDetails[i][category].toLowerCase().trim() == "yes")
		                                    	{
		                                    		if(categoryInfo && categoryInfo.projectId)
		                                    		{

		                                    			var birthDetails = dobFilterSubscribe.findOne({	         
			                								"tournamentId": data.tournamentId,
			                								"details.eventId":categoryInfo.projectId.toString()
			            								},{fields:{_id: 1, details: {$elemMatch: {"eventId": categoryInfo.projectId.toString()}}}});
		                                    			
		                                    			if(birthDetails && birthDetails.details && birthDetails.details.length > 0)
		                                    			{
		                                    				var filterStatus = categoryEligiblity(birthDetails.details[0],data.tournamentId,categoryInfo,userDetails);

		                                    				if(filterStatus)
		                                    				{
		                                    					subSucMsg.push(category)
		                                    					subscribeID.push(categoryInfo._id)
		                                    					defTourFees[m] = eventFees[m];
		                                    					totalFee += parseInt(eventFees[m]);
		                                    					subscribeUpdate = events.update({"abbName": category,
		                                    						tournamentId:data.tournamentId}, {$addToSet:{"eventParticipants":userDetails.userId}}, {multi:true});

		                                    				
		                                    				}
		                                    				else
		                                    				{
																subFailMsg.push(category);

		                                    				}
		                                    			}


		                                    		}
		                                    		
		                                    	}
		                                    	else
		                                    	{
		                                    		unsubscribeID.push(categoryInfo._id);
		                                    		subscribeUpdate = events.update({"abbName": category,
		                                    						tournamentId:data.tournamentId}, {$pull:{"eventParticipants":userDetails.userId}}, {multi:true});
		                                    	}
	                                    	}
	
	                                    }

	                                    if(subSucMsg.length > 0)
	                                    {
	                                    	var feeJson = {};
	                                    	feeJson["tournamentId"] = data.tournamentId;
	                                    	feeJson["userId"] = userDetails.userId;
	                                    	feeJson["finalSingleEvents"] = defTourFees;
	                                    	feeJson["finalSum"] = totalFee.toString();

	                                    	var aa = await Meteor.call("subscribeEventsViaApp",feeJson); 

	                                    	paymentTransaction.insert({
                            					"tournamentId":data.tournamentId,
                            					"playerId":userDetails.userId,
                            					"transactionId":promoInfo.promo,
                            					"transactionFee":totalFee,
                            					"subscribedEvents":subscribeID,
                            					"unSubscribedEvents":[],
                            					"transactionType":"promo"
                       						}) 
	                                    }
	                                    playerDetails[i]["subscribeEvents"] = subSucMsg;
	                                    playerDetails[i]["unSubscribeEvents"] = subFailMsg;

	            						regPlayers.push(playerDetails[i])
	            					}
	            					else
	            					{
	            						playerDetails[i]["reason"] = "Could not register user";            						
	            					}
	            					
	            				}	
	            			}


	            		}
	            		
	            			successJson["dupPlayers"] = dupPlayers;
	            			successJson["regPlayers"] = regPlayers;
	            			return successJson;

	            		

		       		}
		       		else
		       		{
		       			failureJson["message"] = "Tournament subscription expired";
            			return failureJson;
		       		}
            	}
            	else
            	{
            		var failMsg = ""
            		if(tourInfo == undefined)
            			failMsg = "Invalid tournament";
            		if(promoInfo == undefined)
            		{
            			if(failMsg.length > 0)
            				failMsg += ", Invalid promo";
            			else
            				failMsg = "Invalid promo"
            		}
            		failureJson["message"] = failMsg;
            		return failureJson;
            	}
            }
            else
            {
            	failureJson["message"] = "Invalid params";
            	return failureJson;
            }
		}catch(e){
			console.log(e)
			failureJson["message"] = "Invalid data :"+e;
           return failureJson;
		}
	}

})