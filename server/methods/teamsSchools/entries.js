Meteor.methods({
    organizerTournamentsBasedOnApiDomain:function(apiKey,domainId)
    {
        try{
            var result = {};  
            if (domainId && apiKey) 
            {
                if(domainId != "" && domainId != null && domainId != undefined)
                    domainQuery = domainId;
                else
                    domainQuery = {$nin:["null",""]};
                var apiKeyInfo = apiUsers.findOne({"apiKey": apiKey.trim()});
                if (apiKeyInfo && apiKeyInfo.userId) 
                {
                    var pastResult = {};    
                    var upcominngResult = {};   
                    var eventOrganizerID = apiKeyInfo.userId;  

                    var k =events.aggregate([
                        {$match:{
                            "tournamentEvent":true,"eventOrganizer":eventOrganizerID,"domainId":domainQuery
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
                            upcominngResult["tournamentList"] = k[0].tournaments;
                            var tournamentsIdArr = k[0].tournamentsId;
                            /*var m =events.aggregate([
                                {$match:{
                                    "tournamentEvent":false,
                                    "tournamentId":{$in:tournamentsIdArr},
                                }},
                                {$group:{
                                    "_id":"$tournamentId",
                                    "singleEvents": 
                                    {$addToSet:{
                                        "$cond":{
                                           "if": { "$eq": [ "$projectType", 1 ] }, 
                                            "then": "$eventName",
                                            "else" :"$noval"
                                        }
                                    }},
                                    "teamEvents": 
                                    {$addToSet:{
                                        "$cond":{
                                           "if": { "$eq": [ "$projectType", 2 ] }, 
                                            "then": "$eventName",
                                            "else" :"$noval"
                                        }
                                    }}
                                }},
                                {$project:{
                                    "tournamentId": "$_id",
                                    "singleEvents":1,
                                    "teamEvents":1,
                                    "_id":0,
                                }},
                                {"$unwind": "$singleEvents"},
                                {"$sort": { "singleEvents": 1} },
                                {"$group": {
                                    "_id": {"tournamentId":"$tournamentId",
                                        "teamEvents":"$teamEvents"
                                    }, 
                                "singleEvents": {"$push": "$singleEvents" },
                                }},
                                {$project:{
                                    "tournamentId": "$_id.tournamentId",
                                    "teamEvents":"$_id.teamEvents",
                                    "singleEvents":1,
                                    "_id":0,
                                }},                           
                                {"$unwind": "$teamEvents"},
                                {"$sort": { "teamEvents": 1} },
                                {"$group": {
                                 "_id": {"tournamentId":"$tournamentId",
                                    "singleEvents":"$singleEvents"
                                    }, 
                                "teamEvents": {"$push": "$teamEvents" },
                                }},
                                {$project:{
                                    "tournamentId": "$_id.tournamentId",
                                    "singleEvents":"$_id.singleEvents",
                                    "teamEvents":1,
                                    "_id":0
                                }}

                            ]);*/



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
                                    "_id":1,
                                }},
                                {"$unwind": "$events"},
                                {"$sort": { "events": 1} },
                                {"$group": { "_id": "$tournamentId", "events": {"$push": "$events" }}},
                                {$project:{
                                    "tournamentId": "$_id",
                                    "events":1,
                                    "_id":1,
                                }},

                            ]);
                            

                            upcominngResult["eventList"] = m;
;

                        }
                    }

                    var k =pastEvents.aggregate([
                        {$match:{
                            "tournamentEvent":true,
                            "eventOrganizer":eventOrganizerID,
                            "domainId":domainQuery
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
                    ]);
                    if(k.length > 0)
                    {
                        if(k[0].tournamentsId)
                        {
                            pastResult["tournamentList"] = k[0].tournaments;

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
                                    "_id":1,
                                }},
                                {"$unwind": "$events"},
                                {"$sort": { "events": 1} },
                                {"$group": { "_id": "$tournamentId", "events": {"$push": "$events" }}},
                                {$project:{
                                    "tournamentId": "$_id",
                                    "events":1,
                                    "_id":1,
                                }},

                            ]);

                           

                            pastResult["eventList"] = m;

                        }
                    }
                    var pastTournaments = [];;
                    var upcomingTournaments = [];
                    var pastCategories = [];
                    var upcomingCategories = [];
                    if(pastResult.tournamentList)
                        pastTournaments = pastResult.tournamentList;
                    if(upcominngResult.tournamentList)
                        upcomingTournaments = upcominngResult.tournamentList;
                    if(pastResult.eventList)
                        pastCategories = pastResult.eventList;
                    if(upcominngResult.eventList)
                        upcomingCategories = upcominngResult.eventList;

                    result["tournamentList"] = _.union(pastTournaments,upcomingTournaments);
                    result["eventList"] = _.union(pastCategories,upcomingCategories);
                    return result;

                }
            }
            
        }catch(e){
        }
    },

    "getEntriesOfIndividualEvent": function(apiKey,data) {
        try 
        {
            var resultJson = {};
            resultJson["eventType"] = "Individual";
            var schoolJson = {};
            var schoolList = [];
            var schoolMapper = {};

            if (data.tournamentId != undefined && data.eventName != undefined && apiKey) 
            {
                var apiKeyInfo = apiUsers.findOne({"apiKey": apiKey.trim()});
                if (apiKeyInfo && apiKeyInfo.userId) 
                {
                    var organizerID = apiKeyInfo.userId;
                    if (Meteor.users.findOne({userId: organizerID})) 
                    {
                                                                        
                        var individualEventsInfo = events.findOne({
                            "eventName": data.eventName,
                            "tournamentId": data.tournamentId
                        });

                        if (individualEventsInfo == undefined)               
                            individualEventsInfo = pastEvents.findOne({
                                "eventName": data.eventName,
                                "tournamentId": data.tournamentId
                            });
                                            
                        if (individualEventsInfo && individualEventsInfo._id) 
                        {
                            if (individualEventsInfo.eventParticipants && individualEventsInfo.eventParticipants.length != 0) 
                            {
                                var resultList= [];
                                var schoolParticipants = individualEventsInfo.eventParticipants;
                                for(var l=0; l<schoolParticipants.length;l++)
                                {
                                    var schoolPlayerInfo = schoolPlayers.findOne({"userId":schoolParticipants[l]});
                                    if(schoolPlayerInfo)
                                    {
                                        var playerJson = {};
                                        playerJson["userName"] = schoolPlayerInfo.userName;
                                        playerJson["emailAddress"] = schoolPlayerInfo.emailAddress;
                                        playerJson["dateOfBirth"] = schoolPlayerInfo.dateOfBirth;
                                        playerJson["class"] = schoolPlayerInfo.class;
                                        if(schoolPlayerInfo.schoolId)
                                        {
                                            var schoolDetailsInfo = schoolDetails.findOne({"userId":schoolPlayerInfo.schoolId});
                                            if(schoolDetailsInfo)
                                                playerJson["school"] = schoolDetailsInfo.schoolName;
                                        }    

                                        if(schoolJson[schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation] == undefined)   
                                            schoolJson[schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation] = [playerJson];
                                        else                      
                                            schoolJson[schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation] = _.union(schoolJson[schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation],playerJson);
                                         
                                        if(schoolMapper[schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation+"ID"] == undefined)   
                                            schoolMapper[schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation+"ID"] = schoolDetailsInfo;
                                        else                      
                                            schoolMapper[schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation+"ID"] = schoolDetailsInfo;
                                         
                                        if(schoolList.indexOf(schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation) == -1)
                                            schoolList.push(schoolDetailsInfo.schoolName+""+schoolDetailsInfo.abbrevation);
                                        //resultList.push(playerJson);
                                    }
                                }   
                                var schoolName = {};
                                schoolList = schoolList.sort();
                                schoolName["schoolList"] = schoolList;
                                resultList.push(schoolName);
                                resultList.push(schoolJson);
                                resultList.push(schoolMapper);
                                resultJson["status"] = "success";
                                resultJson["data"] = resultList;
                                resultJson["response"] = "entries fetched";
                                return resultJson;
                            } 
                            else 
                            {
                                resultJson["status"] = "failure";
                                resultJson["response"] = "No entries";
                                resultJson["data"] = ""
                                return resultJson;
                            }
                  
                        } 
                        else 
                        {
                            resultJson["status"] = "failure";
                            resultJson["response"] = "tournament or eventname invalid";
                            return resultJson;
                        }
                                                                 
                    } 
                    else 
                    {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "API KEY is not valid";
                        return resultJson;
                    }
                } 
                else 
                {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "API KEY is not valid";
                    return resultJson;
                }
                
            }
            else
            {
                resultJson["status"] = "failure";
                resultJson["response"] = "All Parameters are required";
                return resultJson;
            }
        } catch (e) 
        {
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson;
        }
    },

	"downloadEntriesView":function(data)
	{
		try{
            var resultJson = {};
            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            data = data.replace("\\", "");
            var data = JSON.parse(data);
            if(data.userId)
            {
                var userInfo = Meteor.users.findOne({"userId":data.userId});
                if(userInfo)
                {
                    
                    tournamentInfo = events.find({"eventOrganizer":data.userId,"tournamentEvent":true}).fetch();
                    resultJson["status"] = "success"
                    resultJson["resultID"] = tournamentInfo;
                    resultJson["response"] = "Tournament List"
                    return resultJson;
                        
                }
                else
                {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Invalid user"
                    return resultJson;
                }
            }
            else
            {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid data"
                return resultJson;

            }
           
        }catch(e){
        }
	},

    "subscribedEventList":function(apiKey,data)
    {
        try{
            var resultJson = {};
            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            data = data.replace("\\", "");
            var data = JSON.parse(data);
            
            var tournamentInfo = events.findOne({"_id":data.tournamentId,"tournamentEvent":true});
            if(tournamentInfo)
            {
                var eventsInfo = events.find({"_id":{$in:tournamentInfo.eventsUnderTournament}},{fields:{"eventOrganizer":1,"_id":1,"eventName":1}}).fetch();
                if(eventsInfo)
                {
                    resultJson["status"] = "success"
                    resultJson["resultID"] = eventsInfo;
                    resultJson["response"] = "Events"
                    return resultJson;
                }
                else
                {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Empty Events"
                    return resultJson;
                }
            }
            else
            {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid data"
                    return resultJson;
            }

           
        }catch(e){
        }
    },
    "eventWiseSubscribersDownload_School": function(xData,loggedID) 
    {
        try {
            var playerList = [];
            var count = 0;
            check(xData, String)
            var userId = Meteor.users.findOne({
                "_id": loggedID
            })
            var doa = events.findOne({
                "eventOrganizer": userId.userId.toString(),
                "_id": xData
            });
            var eventName = "";
            var tournamentId = "";
            var sportId = "";
            var eventRanking = "";
            var projectType = "";
            if (doa) {
                if (doa.eventName && doa.eventParticipants) {
                    eventName = doa.eventName;
                    eventParticipantList = doa.eventParticipants;
                    tournamentId = doa.tournamentId;
                    var eventId = doa.projectId[0];

                    var tourInfo = events.findOne({
                        "_id": tournamentId,
                        "tournamentEvent": true
                    });
                    if (tourInfo) {
                        sportId = tourInfo.projectId[0];
                        var dobFilterInfo = dobFilterSubscribe.findOne({
                            "tournamentId": tournamentId,
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

                        if (dobFilterInfo && dobFilterInfo.details.length > 0) {
                            if (eventId == dobFilterInfo.details[0].eventId)
                                eventRanking = dobFilterInfo.details[0].ranking;
                        }
                        var eventInfo = tournamentEvents.findOne({
                            "_id": sportId,
                            "projectSubName._id": eventId
                        }, {
                            fields: {
                                _id: 0,
                                projectSubName: {
                                    $elemMatch: {
                                        "_id": eventId
                                    }
                                }
                            }
                        })

                        if (eventInfo) {
                            projectType = eventInfo.projectSubName[0].projectType;
                        }
                    }
                    if (eventParticipantList.length > 0) {
                        for (var j = 0; j < eventParticipantList.length; j++) {
                            var eventParticipant = eventParticipantList[j];
                            var userInfo = schoolPlayers.findOne({
                                "userId": eventParticipant
                            });
                            var dateOfBirth_user = "";
                            var academyName = "";
                            if (userInfo) {
                                count = count + 1;
                                if (userInfo.emailAddress == undefined || userInfo.emailAddress == null)
                                    userInfo.emailAddress = ""

                                if (userInfo.schoolId == undefined || userInfo.schoolId == null || userInfo.schoolId == "other")
                                    userInfo.schoolName = ""
                                else {
                                    var schoolInfo = schoolDetails.findOne({
                                        userId: userInfo.schoolId
                                    });
                                    if (schoolInfo)
                                        userInfo.schoolName = schoolInfo.schoolName;
                                }
                                if (userInfo.affiliationId == undefined || userInfo.affiliationId == null)
                                    userInfo.affiliationId = "";
                                if (userInfo.tempAffiliationId == undefined || userInfo.tempAffiliationId == null)
                                    userInfo.tempAffiliationId = "";

                                if (userInfo.phoneNumber != undefined && userInfo.phoneNumber.trim() == "")
                                    phoneNumber = "";
                                else if (userInfo.phoneNumber == undefined || userInfo.phoneNumber == null)
                                    phoneNumber = "";
                                else if (userInfo.phoneNumber.length !== 0)
                                    phoneNumber = parseInt(userInfo.phoneNumber);
                                if (userInfo.dateOfBirth)
                                    dateOfBirth_user = moment(new Date(userInfo.dateOfBirth)).format("DD MMM YYYY");
                                else
                                    dateOfBirth_user = "";

                                if (eventRanking.trim() == "no") {
                                    userData = {
                                        "Name": userInfo.userName,
                                        "Affiliation ID": userInfo.tempAffiliationId,
                                        "School Name": userInfo.schoolName,
                                        "emailAddress": userInfo.emailAddress,
                                        "Phone Number": phoneNumber,
                                        "DOB": dateOfBirth_user,
                                    }
                                } else {
                                    userData = {
                                        "Name": userInfo.userName,
                                        "Affiliation ID": userInfo.affiliationId,
                                        "School Name": userInfo.schoolName,
                                        "emailAddress": userInfo.emailAddress,
                                        "Phone Number": phoneNumber,
                                        "DOB": dateOfBirth_user,
                                    }
                                }

                                playerList.push(userData);
                            }
                        }
                    }
                }
            }


            if (playerList.length == 0) {
                return 0
            } else {
                if (playerList.length > 2) {
                    playerList.sort(function(a, b) {
                        return (a['School Name'].toLowerCase() > b['School Name'].toLowerCase());
                    });
                }

                return playerList;
            }
        } catch (e) {
        }
    },

    "pasteventWiseSubscribersDownload_School": function(xData,loggedID) {

        try{

        var playerList = [];
        var count = 0;
        check(xData, String)
        var userId = Meteor.users.findOne({
            "_id": loggedID
        })

        var doa = pastEvents.findOne({
            "eventOrganizer": userId.userId.toString(),
            "_id": xData
        });

        var eventName = "";
        var tournamentId = "";
        var sportId = "";
        var eventRanking = "";
        var projectType = "";
        if (doa) {
            if (doa.eventName && doa.eventParticipants) {
                eventName = doa.eventName;
                eventParticipantList = doa.eventParticipants;
                tournamentId = doa.tournamentId;
                var tourInfo = pastEvents.findOne({
                    "_id": tournamentId,
                    "tournamentEvent": true
                });
                if (tourInfo) {
                    sportId = tourInfo.projectId[0];
                    var eventId = doa.projectId[0];

                    var dobFilterInfo = dobFilterSubscribe.findOne({
                        "tournamentId": tournamentId,
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

                    if (dobFilterInfo && dobFilterInfo.details.length > 0) {
                        if (eventId == dobFilterInfo.details[0].eventId)
                            eventRanking = dobFilterInfo.details[0].ranking;
                    }
                    var eventInfo = tournamentEvents.findOne({
                        "_id": sportId,
                        "projectSubName._id": eventId
                    }, {
                        fields: {
                            _id: 0,
                            projectSubName: {
                                $elemMatch: {
                                    "_id": eventId
                                }
                            }
                        }
                    })

                    if (eventInfo) {
                        projectType = eventInfo.projectSubName[0].projectType;
                    }
                }

                if (eventParticipantList.length > 0) {
                    for (var j = 0; j < eventParticipantList.length; j++) {
                        var eventParticipant = eventParticipantList[j];
                        var userInfo = schoolPlayers.findOne({
                            "userId": eventParticipant
                        });
                        var dateOfBirth_user = "";
                        if (userInfo) {
                            count = count + 1;
                            if (userInfo.emailAddress == undefined || userInfo.emailAddress == null)
                                userInfo.emailAddress = ""

                            if (userInfo.schoolId == undefined || userInfo.schoolId == null || userInfo.schoolId == "other")
                                userInfo.schoolName = ""
                            else {
                                var schoolInfo = schoolDetails.findOne({
                                    userId: userInfo.schoolId
                                });
                                if (schoolInfo)
                                    userInfo.schoolName = schoolInfo.schoolName;
                            }

                            if (userInfo.affiliationId == undefined || userInfo.affiliationId == null)
                                userInfo.affiliationId = ""

                            if (userInfo.tempAffiliationId == undefined || userInfo.tempAffiliationId == null)
                                userInfo.tempAffiliationId = ""

                            if (userInfo.phoneNumber != undefined && userInfo.phoneNumber.trim() == "")
                                phoneNumber = "";
                            else if (userInfo.phoneNumber == undefined || userInfo.phoneNumber == null)
                                phoneNumber = "";
                            else if (userInfo.phoneNumber.length !== 0)
                                phoneNumber = parseInt(userInfo.phoneNumber);
                            if (userInfo.dateOfBirth)
                                dateOfBirth_user = moment(new Date(userInfo.dateOfBirth)).format("DD MMM YYYY");
                            else
                                dateOfBirth_user = "";


             

                            if (eventRanking.trim() == "no") {
                                userData = {
                                    "Name": userInfo.userName,
                                    "Affiliation ID": userInfo.tempAffiliationId,
                                    "School Name": userInfo.schoolName,
                                    "emailAddress": userInfo.emailAddress,
                                    "Phone Number": phoneNumber,
                                    "DOB": dateOfBirth_user,
                                }
                            } else {
                                userData = {
                                    "Name": userInfo.userName,
                                    "Affiliation ID": userInfo.affiliationId,
                                    "School Name": userInfo.schoolName,
                                    "emailAddress": userInfo.emailAddress,
                                    "Phone Number": phoneNumber,
                                    "DOB": dateOfBirth_user,
                                }
                            }




                            playerList.push(userData);


                        }
                    }
                }
            }

        }

            if (playerList.length == 0) {
                return 0
            } else {
                if (playerList.length > 2) {
                    playerList.sort(function(a, b) {
                        return (a['School Name'].toLowerCase() > b['School Name'].toLowerCase());

                    });
                }

                return playerList;
            }
        }catch(e){
        }
     
    },
    "team_eventWiseSubscribersDownload_School":function(xData,loggedID)
    {
        try {
            var playerList = [];
            var count = 0;
            check(xData, String)
            var userId = Meteor.users.findOne({
                "_id": loggedID
            })
            var doa = events.findOne({
                "eventOrganizer": userId.userId.toString(),
                "_id": xData
            });
            var eventName = "";
            var tournamentId = "";
            if (doa) {
                if (doa.eventName && doa.eventParticipants) {
                    eventName = doa.eventName;
                    eventParticipantList = doa.eventParticipants;
                    tournamentId = doa.tournamentId;
                    var eventId = doa.projectId[0];
                                               
                    if (eventParticipantList.length > 0) 
                    {
                        for (var j = 0; j < eventParticipantList.length; j++) 
                        {
                            var eventParticipant = eventParticipantList[j];
         
                            var playerTeamsInfo = schoolTeams.findOne({"teamManager":eventParticipant,"teamFormatId":eventId,"schoolId":{$nin:["",null]}});
                            var userInfo = schoolPlayers.findOne({
                                "userId": eventParticipant
                            });
                            if(playerTeamsInfo && userInfo)
                            {
                                if (userInfo.affiliationId == undefined || userInfo.affiliationId == null)
                                    userInfo.affiliationId = "";
                                if (userInfo.tempAffiliationId == undefined || userInfo.tempAffiliationId == null)
                                    userInfo.tempAffiliationId = "";
                                                
                                userData = {
                                    "teamName": playerTeamsInfo.teamName,
                                    "teamAffiliationId": playerTeamsInfo.teamAffiliationId,
                                    "managerAffiliationId": userInfo.affiliationId,
                                    "temporaryAffiliationId": userInfo.tempAffiliationId,                                    
                                }
                                playerList.push(userData);                       
                            }                                                                            
                        }
                    }
                }
            }


            if (playerList.length == 0) {
                return playerList;
            } else {
                if (playerList.length > 2) {
                    playerList.sort(function(a, b) {
                        return (a['teamName'].toLowerCase() > b['teamName'].toLowerCase());
                    });
                }

                return playerList;
            }
        } catch (e) {}
    },
    "pastteam_eventWiseSubscribersDownload_School":function(xData,loggedID)
    {
        try {
            var playerList = [];
            var count = 0;
            check(xData, String)
            var userId = Meteor.users.findOne({
                "_id": loggedID
            })
            var doa = pastEvents.findOne({
                "eventOrganizer": userId.userId.toString(),
                "_id": xData
            });
            var eventName = "";
            var tournamentId = "";
            if (doa) {
                if (doa.eventName && doa.eventParticipants) {
                    eventName = doa.eventName;
                    eventParticipantList = doa.eventParticipants;
                    tournamentId = doa.tournamentId;
                    var eventId = doa.projectId[0];
                                               
                    if (eventParticipantList.length > 0) 
                    {
                        for (var j = 0; j < eventParticipantList.length; j++) 
                        {
                            var eventParticipant = eventParticipantList[j];
                            //here
                            var playerTeamsInfo = schoolTeams.findOne({"teamManager":eventParticipant,"teamFormatId":eventId,"schoolId":{$nin:["",null]},tournamentId:tournamentId});
                            var userInfo = schoolPlayers.findOne({
                                "userId": eventParticipant
                            });
                            if(playerTeamsInfo && userInfo)
                            {
                                if (userInfo.affiliationId == undefined || userInfo.affiliationId == null)
                                    userInfo.affiliationId = "";
                                if (userInfo.tempAffiliationId == undefined || userInfo.tempAffiliationId == null)
                                    userInfo.tempAffiliationId = "";
                                                
                                userData = {
                                    "teamName": playerTeamsInfo.teamName,
                                    "teamAffiliationId": playerTeamsInfo.teamAffiliationId,
                                    "managerAffiliationId": userInfo.affiliationId,
                                    "temporaryAffiliationId": userInfo.tempAffiliationId,                                    
                                }
                                playerList.push(userData);                       
                            }                                                                            
                        }
                    }
                }
            }


            if (playerList.length == 0) {
                return playerList;
            } else {
                if (playerList.length > 2) {
                    playerList.sort(function(a, b) {
                        return (a['teamName'].toLowerCase() > b['teamName'].toLowerCase());
                    });
                }

                return playerList;
            }
        } catch (e) {}
    },
})