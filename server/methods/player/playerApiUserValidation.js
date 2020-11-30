import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {teamEntriesCollectionUpdate} from '../events/entryFromAcademyInsert.js';
import {emailRegex}
from '../dbRequiredRole.js'
import {nameToCollection} from '../dbRequiredRole.js'

//export var teamEntriesCollectionUpdate ;

Meteor.methods({

    PviewPlayerProfile:function(caller,apiKey,playerId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("viewPlayerProfile",playerId));
            }
            
        }catch(e){
        }
    },
    PviewTeamDetails:function(caller,apiKey,teamId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("viewTeamDetails",teamId));
            }
            
        }catch(e){
        }
    },

	PcreateTeamFormatFilters:function(caller,apiKey,userId){
    	try{
    		if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
	        	return;
	    	}else{
	    		return (Meteor.call("createTeamFormatFilters",userId));
	    	}
	    	
    	}catch(e){
    	}
    },
    PcreateTeamViaApp:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                var param = data;
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                return (Meteor.call("saveNewTeamData",param));
            }
            
        }catch(e){
        }
    },
    PupdateTeamViaApp:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                data = data
                var param = data
                if (typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                return (Meteor.call("updatePlayerTeam",param,param.teamId));
            }
            
        }catch(e){
        }
    },

    
    PfetchPlayersOnTeamValidation:function(caller,apiKey,userId,teamformatID)
    {
    	try{
    		if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
	        	return;
	    	}else{
	    		return (Meteor.call("fetchPlayersOnTeamValidation",teamformatID,userId));
	    	}
	    	
    	}catch(e){
    	}
    },
    PmyTeams:function(caller,apiKey,userId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("myTeamsOfPlayer",userId));
            }
            
        }catch(e){
        }
    },
    PdeleteTeam:function(caller,apiKey,teamId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                var subscribedTour = playerTeamEntries.find({"subscribedTeamID":{$in:[teamId]}}).fetch();
                if(subscribedTour.length > 0)
                {
                    return false;

                }
                else
                {
                    return (Meteor.call("deleteTeam",teamId));

                }
               


            }
            
        }catch(e){
        }
    },
    PupdateTeam:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{

                data = data.replace("\\", "");
                var param = JSON.parse(data);
                return (Meteor.call("updatePlayerTeam",param.xData,param.teamId));
            }
            
        }catch(e){
        }
    },
    PviewPlayerTeam:function(caller,apiKey,teamId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{

               
                return (Meteor.call("viewPlayerTeam",teamId));
            }
            
        }catch(e){
        }
    },
    
    PeditTeamDetails:function(caller,apiKey,userId,teamId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{

                return (Meteor.call("editTeamDetails",teamId,userId));
            }
            
        }catch(e){
        }
    },
   

    

    //app  method(player,5s)
    PeventSubscriptionViaApp:async function(caller,apiKey,data)
    {
        try{

            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else
            {
                var subscribedIDs = [];
                var unSubscribedIDs = [];
                var teamSubscribeIDs = [];
                var oldSubscribedIDs = [];
                var organizerID = "";
                    
                if(data.teamSubscribe == "true")
                {

                    var eventUpdate;

                    var xdata = data.teamSubscribeData
                    var param = xdata;


                    if(typeof data.teamSubscribeData == "string"){
                        xdata = data.teamSubscribeData.replace("\\", "");
                        param = JSON.parse(xdata);
                    }
                    
                    if(param.teamSubscribeIDs)
                        teamSubscribeIDs = param.teamSubscribeIDs;
                   
                    var userId = param.userId;
                    var playerInfo;
                    if(nameToCollection(userId))
                    {
                        playerInfo = nameToCollection(userId).findOne({"userId":userId});
                    }
                    if(playerInfo)
                    {
                        if(playerInfo.academyId)
                            param.academyId = playerInfo.academyId;
                        else 
                            param.academyId = "other";
                        if(playerInfo.associationId)
                            param.associationId = playerInfo.associationId;
                        else
                            param.associationId = "other";
                        if(playerInfo.parentAssociationId)
                            param.parentAssociationId = playerInfo.parentAssociationId;
                        else
                            param.parentAssociationId = "other";
                    }
                    var result = await Meteor.call("eventsCollectionUpdateViaApp",param.tournamentId, param.eventCollection)
                    try
                    {
                        if(result)
                        {
                            eventUpdate = result;  
                            subscriptionStatus = true;                    
                        }                       
                    }catch(e){}
                    
                    if(eventUpdate)
                    {
                        var eventEntries = [];
                        eventEntries.push(param);
                        var aa = await Meteor.call("teamEntriesCollectionUpdateViaApp",param.tournamentId, eventEntries,param.teamEventsData);
                    }
                }
                //individual event subscription
                if(data.individualEventSubscribe == "true" || data.individualEventUnSubscribe == "true")
                {
                    var param = xdata;
                    var subscribeUpdate;
                    var unSubscribeUpdate;

                    var xdata = data.singleEvents
                    var param = xdata;

                    if(typeof data.singleEvents == "string"){
                        xdata = data.singleEvents.replace("\\", "");
                        param = JSON.parse(xdata);
                    }

                    if(data.individualEventSubscribe == "true")
                    {
                        subscribedIDs = param.subscribeEventIDs
                        var type = typeof param.subscribeEventIDs;
                        if(type == "string")
                        {
                            var temp = param.subscribeEventIDs;
                            var xDataArray = [];
                            for(k=0;k<temp.split(",").length;k++)
                            {
                            xDataArray.push(temp.split(",")[k]);
                            }

                            subscribeUpdate = events.update({"_id": {$in: xDataArray},tournamentId:param.tournamentId}, {$addToSet:{"eventParticipants":param.userId}}, {multi:true});
                        }
                        else
                        {
                            subscribeUpdate = events.update({"_id": {$in: param.subscribeEventIDs},tournamentId:param.tournamentId}, {$addToSet:{"eventParticipants":param.userId}}, {multi:true});
                        }
                    }

                    if(data.individualEventUnSubscribe == "true")
                    {
                        unSubscribedIDs = param.unsubscribeEventIDs;
                        var type = typeof param.unsubscribeEventIDs;

                        if(type == "string")
                        {
                            var temp = param.unsubscribeEventIDs;
                            var xDataArray = [];
                            for(k=0;k<temp.split(",").length;k++)
                            {
                                xDataArray.push(temp.split(",")[k]);
                            }
                            unSubscribeUpdate = events.update({"_id": {$in: xDataArray},tournamentId:param.tournamentId}, {$pull:{"eventParticipants":param.userId}}, {multi:true});
                        }
                        else
                        {
                            unSubscribeUpdate = events.update({"_id": {$in: param.unsubscribeEventIDs},tournamentId:param.tournamentId}, {$pull:{"eventParticipants":param.userId}}, {multi:true});
                        }
                    }   

                   

                    
     

                    if(subscribeUpdate || unSubscribeUpdate)
                    {
                        var aa = await Meteor.call("subscribeEventsViaApp",param); 
                    }


                }

                if(data.transactionDetails)
                {
                    if(typeof data.transactionDetails == "string")
                    {
                        xdata = data.transactionDetails.replace("\\", "");
                        transactionParam = JSON.parse(xdata);
                    }
                    else
                        transactionParam = data.transactionDetails;

                    if(transactionParam.oldSubcribedIDs)
                        oldSubscribedIDs = transactionParam.oldSubcribedIDs;
                

                }

                var transactionType = "payment";

                if(data.transactionID!=null && data.transactionID!=undefined)
                {
                    var combinedIDs = subscribedIDs.concat(teamSubscribeIDs);
                    var totalSubscribeIDs = combinedIDs.concat(oldSubscribedIDs);



                    if(data.transactionType){
                        transactionType = data.transactionType;
                        if(transactionType == "promo")
                        {
                            var promoInfo = promo.findOne({"promo":{
                                $regex: new RegExp('^' + data.transactionID + '$', "i")
                                },"status":"active"});
                            if(promoInfo)
                                data.transactionID = promoInfo.promo;
                            
                        }
                    }

                    var type = typeof unSubscribedIDs;

                    if(type == "string")
                        {
                            var temp = param.unsubscribeEventIDs;
                            var xDataArray = [];
                            for(k=0;k<temp.split(",").length;k++)
                            {
                                xDataArray.push(temp.split(",")[k]);
                            }
                            unSubscribedIDs = xDataArray;
                        }

                    if(data.transactionAmount)
                    {
                        paymentTransaction.insert({
                            "tournamentId":data.tournamentId,
                            "playerId":data.userId,
                            "transactionId":data.transactionID,
                            "transactionFee":data.transactionAmount,
                            "subscribedEvents":totalSubscribeIDs,
                            "unSubscribedEvents":unSubscribedIDs,
                            "transactionType":transactionType
                        }) 
                    }
                    else
                    {

                       paymentTransaction.insert({
                            "tournamentId":data.tournamentId,
                            "playerId":data.userId,
                            "transactionId":data.transactionID,
                            "subscribedEvents":totalSubscribeIDs,
                            "unSubscribedEvents":unSubscribedIDs,
                            "transactionType":transactionType
                        }) 
                    }

                    /*if(data.transactionAmount && data.paid && data.refund)
                    {
                        var entryTransInfo = entryTransaction.findOne({"tournamentId":data.tournamentId,"playerId":data.userId});
                        if(entryTransInfo)
                        {
                            //need to update transaction id with empty value 
                            entryTransaction.remove({
                                "tournamentId":data.tournamentId,
                                "playerId":data.userId
                            })
                            entryTransaction.insert({
                                "tournamentId":data.tournamentId,
                                "playerId":data.userId,
                                "transactionId":data.transactionID,
                                "subscribedEvents":totalSubscribeIDs,
                                "paid":data.paid,
                                "refund":data.refund,
                                "transactionType":transactionType
                            })
                        }
                        else
                        {
                            entryTransaction.insert({
                                "tournamentId":data.tournamentId,
                                "playerId":data.userId,
                                "transactionId":data.transactionID,
                                "subscribedEvents":totalSubscribeIDs,
                                "paid":data.paid,
                                "refund":data.refund,
                                "transactionType":transactionType
                            })
                        }
                    } */           
                }
               
                
                var result = await Meteor.call("getAllSubscribersOfTournament",data.tournamentId,data.userId)
                try{
                    if(result)
                    {
                        var eventOrganizerEmail ="";
                        var playerEmail = "";
                        var playerName = "";

                        if(nameToCollection(data.userId))
                        {
                            var userInfo = nameToCollection(data.userId).findOne({"userId":data.userId});
                            if (userInfo && userInfo.emailAddress) 
                            {
                                if(userInfo.userName)
                                    playerName = userInfo.userName;
                                playerEmail = userInfo.emailAddress

                            }
                        }
                       
                        
                        var tournInfo = events.findOne({
                            "_id": data.tournamentId,
                            tournamentEvent: true
                        })
                        if (tournInfo) 
                        {
                            organizerID = tournInfo.eventOrganizer;
                            eventOrganizerInfo = Meteor.users.findOne({
                                "_id": tournInfo.eventOrganizer
                            })
                            if (eventOrganizerInfo && eventOrganizerInfo.emailAddress) 
                                eventOrganizerEmail = eventOrganizerInfo.emailAddress
                        
                        }
                       
                       
                        var eventFeeSettingsinfo = eventFeeSettings.findOne({
                            "tournamentId": data.tournamentId
                        })

                        if (eventFeeSettingsinfo){

                            eventsNAMES = eventFeeSettingsinfo.events;
                            eventsFees = eventFeeSettingsinfo.eventFees;
                            teamEventNames = eventFeeSettingsinfo.teamEvents;
                            teamEventFEES = eventFeeSettingsinfo.teamEventFees
                        

                            var dataContext = {
                                message: "Recent subscription details of tournament",
                                tournament: tournInfo.eventName,
                                eventsDetailsMail: eventsNAMES,
                                teamEventNamesMAIL:teamEventNames,
                                teamEventFEESMAIL:teamEventFEES,
                                playersWithCheckMail: result,
                                tournamentId:data.tournamentId
                            }



                            Template.registerHelper("eventFeesSendMAIL", function(data,tournamentId) {
                                if (data) {
                                    var eventDetails = events.findOne({
                                        "abbName": data,
                                        "tournamentId": tournamentId
                                    })
                                    if (eventDetails && eventDetails.prize) {
                                        return eventDetails.prize
                                    }
                                }
                            });

                            Template.registerHelper("slNUM", function(data) {
                                try {
                                    return parseInt(parseInt(data) + 1)
                                } catch (e) {}
                            })

                            Template.registerHelper('upcomingformatDate', function(date) {
                                try {
                                    if (date != "" || date != undefined || date != null || date.trim() != " ") {
                                        return moment(new Date(date)).format("DD MMM YYYY");
                                    }
                                } catch (e) {}
                            });

                            Template.registerHelper("checkZEROorONE", function(data) {
                                if (parseInt(data) == 0) {
                                    return false
                                } else {
                                    return true
                                }
                            });

                            Template.registerHelper('getTeamNameForId', function(data) {
                                try {
                                    var text = data.replace(/(\r\n|\n|\r)/gm, '<br/>');;
                                    if (text) {
                                        return new Spacebars.SafeString(text);
                                    }
                                } catch (e) {}
                            });


                            SSR.compileTemplate('sendSubscriptionViaApp', Assets.getText('sendSubscriptionViaApp.html'));

                            var html = SSR.render('sendSubscriptionViaApp', dataContext);

                            var options = {
                                from: "iplayon.in@gmail.com",
                                to: playerEmail,
                                cc: eventOrganizerEmail,                                       
                                subject: "iPlayOn:Subscription successful",
                                html: html
                            }

                            var smsEvents  = [];
                            if(data.transactionID!=null && data.transactionID!=undefined && data.transactionID.trim().length != 0)
                            {
                                var combinedIDs = subscribedIDs.concat(teamSubscribeIDs);
                                var totalSubscribeIDs = combinedIDs.concat(oldSubscribedIDs);
                                smsEvents = events.find({"_id":{$in:totalSubscribeIDs}},{"abbName":1,"prize":1}).fetch();

                            }
                            else
                            {
                                var combinedIDs = subscribedIDs.concat(teamSubscribeIDs);
                                smsEvents = events.find({"_id":{$in:combinedIDs}},{"abbName":1,"prize":1}).fetch();

                            }

                            var smsTemplatePrior = "";
                            var smsTemplate = "";
                            var smsEventsTot = 0;
                            var smsEventsList = "";
                            for(var v=0;v<smsEvents.length;v++)
                            {
                                if(v == 0)
                                {
                                    smsTemplate += "\n Events:\n";
                                }
                                if(smsEvents[v] != null && parseInt(smsEvents[v]["prize"]) >= 0)
                                {             
                                    smsTemplate += smsEvents[v]["abbName"]+" - Rs."+smsEvents[v]["prize"]+"\n";
                                    smsEventsList += smsEvents[v]["abbName"];
                                    if((v+1) == smsEvents.length)
                                    {

                                    }
                                    else
                                    {
                                        smsEventsList += ","
                                    }
                                }
                                if(smsEvents[v]["prize"] != null)
                                    smsEventsTot += parseInt(smsEvents[v]["prize"]);
                            }
                            smsTemplatePrior = "Hi "+playerName+",Here is your confirmation of recent subscription. Total fee Rs."+smsEventsTot+"  on iPlayOn of tournament "+tournInfo.eventName;
                            if(data.transactionID!=null && data.transactionID!=undefined && data.transactionID.trim().length != 0)
                                smsTemplatePrior += ". Transaction ID:"+data.transactionID;

                          


                            var mailSms = smsTemplatePrior+""+smsTemplate;

                            var smsData = {};
                            smsData["type"] = "eventSubscription";
                            smsData["userName"] = playerName;
                            smsData["totEntryFee"] = smsEventsTot;
                            smsData["events"] = smsEventsList;
                            smsData["tournamentName"] = tournInfo.eventName;
                            smsData["tournamentDate"] = moment(new Date(tournInfo.eventStartDate1)).format("DD-MM-YYYY")

                            if(data.transactionID != null && data.transactionID != undefined && data.transactionID.trim().length != 0)
                                smsData["transactionId"] = data.transactionID;



                            smsTemplate = Meteor.call("fetchSMSTemplate",smsData);

                            
                            
                            Meteor.call("sendSMSEmailNotification",data.userId,mailSms,options,[organizerID],function(error,result){
                                                
                            });
                            
                            

                      
                        }

                    }
                }catch(e){
                    errorLog(e)
                }
                return true;
            }

        }catch(e){
            errorLog(e)
        }
    },


    PcheckForLoginDetails:function(caller,apiKey,userId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("checkForLoginDetails",userId));
            }
            
        }catch(e){
        }
    },

    PupdateLoginDetails:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("updateLoginDetails",data));
            }
            
        }catch(e){
        }
    },

    //coach based diary
    
    PfetchOpponentUsers:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchOpponentUsers",data));
            }
            
        }catch(e){
        }
    },
    PcreateDiary:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("createDiary",data));
            }
            
        }catch(e){
        }
    },
    
    PfetchDiaryRecord:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchDiaryRecord",data));
            }
            
        }catch(e){
        }
    },

    PdeleteDiary:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("deleteDiary",data));
            }
            
        }catch(e){
        }
    },
    PfetchMyDiary:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchMyDiary",data));
            }
            
        }catch(e){
        }
    },
    
    PupdateDiary:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("updateDiary",data));
            }
            
        }catch(e){
        }
    },
    PdiaryAnalysis:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("diaryAnalysis",data));
            }
            
        }catch(e){
        }
    },
    PdiaryPerformAnalysis:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("diaryPerformAnalysis",data));
            }
            
        }catch(e){
        }
    },

    PshareMyDiary:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("shareMyDiary",data));
            }
            
        }catch(e){
        }
    },
    PfetchSharedMembers:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchSharedMembers",data));
            }
            
        }catch(e){
        }
    },
    // **emailaddress no need**
    PplayerUserLogin:function(username,password)
    {
        try 
        {
            var regExpObj = new RegExp('^' +username+'$',"i");
            var userID = Meteor.users.findOne({"emails.address":regExpObj,verifiedBy:{$in:["email"]}});
            if(userID)
            {
                if(userID.role == "Player")
                {
                    if(ApiPassword.validate({email:regExpObj,password:password})) 
                    {            
                        var userInfo = userDetailsTT.findOne({"emailAddress":regExpObj});
                        if(userInfo)            
                            return userInfo;              
                            
                    }
                    else
                        return "Invalid password";
                }
                else
                {
                    return "You are not authorized to login";
                }
            }
            else
            {
                return "Invalid user";
            }

        
        }catch (exc){
            return "Invalid user";
        }
    },
   
    PplayerUserLoginUnderAssoc:function(username,password,associationId,typeOfLogin,loginRole,paymentValid)
    {
        try
        {
            var response = "";
            var result = Meteor.call("PuserValidation",username, password,typeOfLogin, loginRole)
            try
            {
                if(result)
                {
                    if(result == "Invalid user")
                        response =  result;
                    else if(result == "Invalid user information")
                        response = "Invalid user";
                    else if(result == "Only " + loginRole + " can login !")
                        response =  result;
                    else if(result == "Incorrect password")
                        response =  result;
                    else
                    {
                        if(result.verify && result.userId)
                        {
                            var userInfo = nameToCollection(result.userId).findOne({"userId":result.userId,"associationId":associationId});
                            if(userInfo) 
                            {
                                response =  result; 

                            }         
                            else
                            {
                                response =  "Unauthorized to login under this association";           

                            }
                        }
                        else if(result.userId && result._id)
                        {
                            var userInfo = nameToCollection(result.userId).findOne({"userId":result.userId,"associationId":associationId});
                            if(userInfo)
                            {
                                response =  userInfo;  

                                if(paymentValid.toLowerCase() == "yes")
                                {
                                    var userAccess = registrationApproval.findOne({
                                        "userId":result.userId,"associationId":associationId,"status" : "active"
                                    });
                                    if(userAccess && userAccess.validity)
                                    {
                                       
                                        var currentDate = moment(new Date()).format("YYYY/DD/MMM");
                                        var userAccessDate = moment(new Date(userAccess.validity)).format("YYYY/DD/MMM");
                                        if (new Date(userAccessDate) >= new Date(currentDate))
                                            response["paymentStatus"] = true;
                                        else
                                            response["paymentStatus"] = false;
                                                   
                                    }
                                    else
                                    {
                                        response["paymentStatus"] = false;
                                    }
                                }

                            }    
                            else
                                response =  "Unauthorized to login under this association"           
                        }
                    }
                }
            }catch(e){
                return "Invalid user";
            }

            return response
           

       
        }catch (exc){
            return "Invalid user";
        }
    },
    'PeventListUnderTourn': function(caller, apiKey, tournamentId,userId) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("eventListUnderTourn",tournamentId,userId));
            }
            
        }catch(e){
        }
    },
    PeventListUnderTournAPI: function(caller, apiKey, tournamentId,userId) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("eventListUnderTournAPI",tournamentId,userId));
            }
            
        }catch(e){
        }
    },
    PpasteventListUnderTournAPI: function(caller,apiKey,tournamentId,userId) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                print("kldfgkjfg")
                return;
            }else{
                return (Meteor.call("pasteventListUnderTournAPI",tournamentId,userId));
            }
            
        }catch(e){
        }
    },

    'PviewTournamentResults': function(caller, apiKey,tournamentId) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("viewTournamentResults",tournamentId));
            }
            
        }catch(e){
        }
    },
    PdownloadDraws: function(caller, apiKey,tournamentId,eventName) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("printDrawsSheetCheck",tournamentId,eventName));
            }
            
        }catch(e){
        }
    },
    PdownloadRRDraws: function(caller, apiKey,tournamentId,eventName) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
               // Meteor.call("fetchRRDraws",tournamentId,eventName);
                return (Meteor.call("printDrawsSheetCheckRR",tournamentId,eventName));
            }
            
        }catch(e){
        }
    },

    PsubscriptionTeamChange: function(caller, apiKey,data) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("subscriptionTeamChange",data));
            }
            
        }catch(e){
        }
    },
    PfetchRankEvents: function(caller, apiKey,data) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchRankEvents",data));
            }
            
        }catch(e){
        }
    },
    PfetchRankData: function(caller, apiKey,data) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchRankData",data));
            }
            
        }catch(e){
        }
    },
    PfetchTournamentRankData: function(caller, apiKey,data) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchTournamentRankData",data));
            }
            
        }catch(e){
        }
    },
    PfetchMatchResults: function(caller, apiKey,data) 
    {
         try{

            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchMatchResults",data.tournamentId,data.eventName));
            }
            
        }catch(e){
        }
    },
    PtypeBasedTeams: function(caller, apiKey,data) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("typeBasedTeams",data));
            }
            
        }catch(e){
        }
    },
    PfetchTeamPoints: function(caller, apiKey,data) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchTeamPoints",data));
            }
            
        }catch(e){
        }
    },

    PfetchTeamSchedule: function(caller, apiKey,data) 
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchTeamSchedule",data));
            }
            
        }catch(e){
        }
    },
    PeventSubscription:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("eventSubscription",caller,apiKey,data));
            }
            
        }catch(e){
        }
    }
    
});