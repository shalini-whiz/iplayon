import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
	
    /**
     * Meteor Method to fetch upcoming tournaments based on apikey (apikey linked with organizer id)
     * @collectionName : events
     * @passedByValues : userId
     * @dataType : String
     * @dbQuery : fetch upcoming tournaments 
     * @methodDescription : fetch upcoming tournaments based on apikey (apikey linked with organizer id)
     * Usage - 5s App
    */
	upcomingTournamentDetailsOnApiKey:async function(apiKey,userId)
	{
		try{
			var resultJson = {};
			var tournamentInfo;
			var upcominngResult = {};
			var userInfo = nameToCollection(userId).findOne({"userId":userId});
            var apiKeyInfo = apiUsers.findOne({"apiKey":apiKey.trim()});
            if(apiKeyInfo&&apiKeyInfo.userId && userInfo)
            {
                var organizerID = apiKeyInfo.userId;
                if(Meteor.users.findOne({"userId":organizerID}))
                {
                	var raw = subscriptionRestrictions.rawCollection();
					var distinct = Meteor.wrapAsync(raw.distinct, raw);
					var restrictedTournaments =  distinct('tournamentId',
						{
							"eventOrganizerId" : organizerID,
							"selectionType" : {$nin:["allExceptSchool"]}
						});

                    
                    tournamentInfo = events.find({
                    	"eventOrganizer":organizerID,"tournamentEvent":true,
                    	"_id":{$nin:restrictedTournaments}
                    	},
                        {sort:{eventEndDate1:1}},
                    	{fields:{
                    		"eventName":1,
                    		"eventStartDate":1,
                    		"eventEndDate":1,
                    		"eventSubscriptionLastDate":1,
                    		"domainName":1,
                    		"projectName":1,
                    		"eventStartDate1":1,
                    		"eventEndDate1":1,
                    		"eventSubscriptionLastDate1":1,
                    		"subscriptionTypeDirect":1,
                    		"subscriptionTypeHyper":1,
							"hyperLinkValue" : 1,
							"paymentEntry":1,
                            "projectId":1

                    	}}).fetch();

                    for(var m=0;m<tournamentInfo.length;m++)
                    {
                    	var data = {
			              tournamentId: tournamentInfo[m]._id,
			              subscriberId: userId
            			}
                    	var res = await Meteor.call("individualEventsSubscriptionExternalAPI", data)
			              try {
			                if (res) 
			                {
			                  if(res[0].status)
			                  {
			                    if(res[0].status == "success")
			                      tournamentInfo[m]['playerEntry'] = "yes";                
			                    else
			                      tournamentInfo[m]['playerEntry'] = "no";
			                  }
			                }
			              }catch(e){

			              }
                        var userSport = undefined;
                        var tournSport = undefined;
                        if(userInfo.interestedProjectName && userInfo.interestedProjectName.length > 0 && userInfo.interestedProjectName[0] != null)
                            userSport = userInfo.interestedProjectName[0];

                        if(tournamentInfo[m].projectId)
                            tournSport = tournamentInfo[m].projectId;
            			//subscription date
                        if(moment(moment(tournamentInfo[m].eventSubscriptionLastDate1).format("YYYY-MM-DD"))>=moment(moment.tz(tournamentInfo[m].timeZoneName).format("YYYY-MM-DD")) && 
                            (tournSport == userSport) && tournSport != undefined && userSport != undefined )           			              tournamentInfo[m]['subscribeBoolean'] = true;            
			            else 
			              tournamentInfo[m]['subscribeBoolean'] = false;

			            var eventFeeSettingsInfo  = eventFeeSettings.findOne({"tournamentId":tournamentInfo[m]._id});
			            if(eventFeeSettingsInfo)
			              tournamentInfo[m]['feeSettings'] = eventFeeSettingsInfo;
			            else
			              tournamentInfo[m]['feeSettings'] = {};
						
			            var restrictionInfo = subscriptionRestrictions.findOne({tournamentId:tournamentInfo[m]._id});
			          	if(restrictionInfo)
			          		tournamentInfo[m]['restriction'] = restrictionInfo.selectionType;
			          	else
			          		tournamentInfo[m]['restriction'] = "";
                    }


                    resultJson["status"] = "success"
                	resultJson["data"] = tournamentInfo;
                	resultJson["response"] = "Tournament List";
                	return resultJson;
                }
            }
            else
            {
				resultJson["status"] = "failure"
                resultJson["data"] = "";
                resultJson["response"] = "Invalid params"
                return resultJson;
            }
		}catch(e){
			resultJson["status"] = "failure"
            resultJson["data"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
		}
	},

	//fetch past tournaments based on apikey (apikey linked with organizer id)
    /**
     * Meteor Method to fetch past tournaments based on apikey (apikey linked with organizer id)
     * @collectionName : pastEvents
     * @passedByValues : userId
     * @dataType : String
     * @dbQuery : fetch past tournaments 
     * @methodDescription : fetch past tournaments based on apikey (apikey linked with organizer id)
     * Usage - 5s App
    */
	pastTournamentDetailsOnApiKey:function(apiKey)
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
                	
                	var raw = subscriptionRestrictions.rawCollection();
					var distinct = Meteor.wrapAsync(raw.distinct, raw);
					var restrictedTournaments =  distinct('tournamentId',
						{
							"eventOrganizerId" : organizerID,
							"selectionType" : {$nin:["allExceptSchool"]}
						});

                    tournamentInfo = pastEvents.find({
                    	"eventOrganizer":organizerID,"tournamentEvent":true,
                    	"_id":{$nin:restrictedTournaments}
                    	},
                        {sort:{eventEndDate1:-1}},
                    	{fields:{
                    		"eventName":1,
                    		"eventStartDate":1,
                    		"eventEndDate":1,
                    		"eventSubscriptionLastDate":1,
                    		"domainName":1,
                    		"projectName":1,
                    		"eventStartDate1":1,
                    		"eventEndDate1":1,
                    		"eventSubscriptionLastDate1":1,
                    		"subscriptionTypeDirect":1,
                    		"subscriptionTypeHyper":1,
							"hyperLinkValue" : 1,
                    	}}).fetch();
                   
                    resultJson["status"] = "success"
                	resultJson["data"] = tournamentInfo;
                	resultJson["response"] = "Tournament List"
                	return resultJson;
                }
            }
            else
            {
				resultJson["status"] = "failure"
                resultJson["data"] = "";
                resultJson["response"] = "Invalid Api Key"
                return resultJson;
            }
		}catch(e){
			resultJson["status"] = "failure"
            resultJson["data"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
		}
	},

	
})