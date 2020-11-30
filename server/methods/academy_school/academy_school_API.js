Meteor.methods({
	"upcomingTournamentsMultipleOnApiKey":function(data)
	{
		
		try{
			var param = data;
			if(typeof data == "string")
	  		{
	            xdata = data.replace("\\", "");
	            param = JSON.parse(xdata);

	        }
	        var multiApiKey = param.multiApiKey;
			if(multiApiKey != "" && multiApiKey != null)
			{
				
				var resultJson = {};
				var tournamentInfo;
				var upcominngResult = {};
				var raw = apiUsers.rawCollection();
				var distinct = Meteor.wrapAsync(raw.distinct, raw);

				var multiApiUsers =  distinct('userId',{"apiKey":{$in:multiApiKey}});

				var apiKeyInfo = apiUsers.findOne({"apiKey":{$in:multiApiKey}});

	            if(apiKeyInfo && multiApiUsers && multiApiUsers.length > 0)
	            {
	                if(Meteor.users.findOne({"userId":{$in:multiApiUsers}}))
	                {            	
	                    tournamentInfo = events.find(
	                    	{"eventOrganizer":{$in:multiApiUsers},
	                    	"tournamentEvent":true},
							{fields:{
	                    		"_id":1,
	                    		"eventName":1,
	                    		"projectId":1,
	                    		"eventStartDate":1,
	                    		"eventEndDate":1,
	                    		"eventSubscriptionLastDate":1,
	                    		"eventOrganizer":1,
	                    		"domainName":1,
	                    		"projectName":1,
	                    		"tournamentEvent":1,
	                    	}}


	                    	).fetch();


	                    k1 = events.aggregate([
		                   	{$match:{
		                        "tournamentEvent":true,
		                        "eventOrganizer":{$in:multiApiUsers}
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


	                    var k ;

	                	
	                	k = events.aggregate([
		                   	{$match:{
		                        "tournamentEvent":true,"eventOrganizer":{$in:multiApiUsers}
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
	                            //upcominngResult["tournamentList"] = k[0].tournaments;
	                            //resultJson["tournamentList"] = k[0].tournaments;

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

	                           // resultJson["eventList"] = m;


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
        	}
		}catch(e){

			resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
		}

	},
	"pastTournamentsOnMultipleApiKey":function(data)
	{
		try{
			var resultJson = {};
			var tournamentInfo;
			var upcominngResult = {};
			var multiApiKey = data;
			var raw = apiUsers.rawCollection();
			var distinct = Meteor.wrapAsync(raw.distinct, raw);
			var multiApiUsers =  distinct('userId',{"apiKey":{$in:multiApiKey}});
			var apiKeyInfo = apiUsers.findOne({"apiKey":{$in:multiApiKey}});
            if(apiKeyInfo&&  multiApiUsers && multiApiUsers.length > 0)
            {

                if(Meteor.users.findOne({"userId":{$in:multiApiUsers}}))
                {
                	
                tournamentInfo = pastEvents.find({
                    	"eventOrganizer":{$in:multiApiUsers},
                    	"tournamentEvent":true},
                    	{fields:{
                    		"_id":1,
                    		"eventName":1,
                    		"projectId":1,
                    		"eventStartDate":1,
                    		"eventEndDate":1,
                    		"eventSubscriptionLastDate":1,
                    		"eventOrganizer":1,
                    		"domainName":1,
                    		"projectName":1,
                    		"tournamentEvent":1,
                    	}}).fetch();

                    var k ;

                	
                	k = pastEvents.aggregate([
	                       	{$match:{
	                            "tournamentEvent":true,
	                            "eventOrganizer":{$in:multiApiUsers}
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
                            //resultJson["tournamentList"] = k[0].tournaments;

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

                            //resultJson["eventList"] = m;


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
	"pastTournamentsIDOnMultipleApiKey":function(multiApiKey)
	{
		try{

			var resultJson = {};
			var tournamentInfo;
			var upcominngResult = {};
			var raw = apiUsers.rawCollection();
			var distinct = Meteor.wrapAsync(raw.distinct, raw);
			var multiApiUsers =  distinct('userId',{"apiKey":{$in:multiApiKey}});

			var apiKeyInfo = apiUsers.findOne({"apiKey":{$in:multiApiKey}});
            if(apiKeyInfo && multiApiUsers && multiApiUsers.length > 0)
            {
                if(Meteor.users.findOne({"userId":{$in:multiApiUsers}}))
                {
                	
                    var k ;
                    var upcomingTT;
               
                	k = pastEvents.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,
	                            "eventOrganizer":{$in:multiApiUsers}
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

	                upcomingTT = events.aggregate([
	                        {$match:{
	                            "tournamentEvent":true,
	                            "eventOrganizer":{$in:multiApiUsers}
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
	}
})