Meteor.methods({
    PgetLiveLinksOfTournament:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getLiveLinksOfTournament",data));
            }
            
        }catch(e){
        }
    }
})


Meteor.methods({
    PgetLatestResultsForFanApp:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("parametervalidationsForDrawsResults",data));
            }
            
        }catch(e){
        }
    }
})


Meteor.methods({
    PgetListOfTournamentsForState:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getListOfTournamentsForState",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetListOfTournamentsForStateAndPlayer:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{

                if(apiUsers.findOne({"apiUser":caller}).source == "11EvenSports"){
                    data.stateId = "1"
                }

                return (Meteor.call("getListOfTournamentsForStateAndPlayer",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetHeadsOnDetailsOfPlayerOfATournament:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getHeadsOnDetailsOfPlayerOfATournament",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetMatchRecordsforEventAndRound:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getMatchRecordsforEventAndRound",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetLatestResultsForTournamentId:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("parametervalidationsForDrawsResultsForTId",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
	PgetTeamDetailedDrawsForOtherFormats:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getTeamDetailedDrawsForOtherFormats",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
	PgetPlayerDetailsForFanAPP:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getPlayerDetailsForFanAPP",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetStateListByYear:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getStateListByYear",data));
            }
        }catch(e){

        }
    }
})

Meteor.methods({
    PgetStateListByYearNEW:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getStateListByYearNEW",data));
            }
        }catch(e){

        }
    }
})

Meteor.methods({
    PgetLiveScores11Even:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                var findUser = apiUsers.findOne({apiUser:caller})
                if(findUser && findUser.userId){
                    data.eventOrganizer = findUser.userId
                    return (Meteor.call("getLiveScores11Even",data));
                }
            }
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetStateListByYearRoundRobin:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getStateListByYearRoundRobin",data));
            }
        }catch(e){
            
        }
    }
})

Meteor.methods({
    PgetListOf11SportsTourTypes:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getListOf11SportsTourTypes",data));
            }
        }catch(e){
            
        }
    }
})

Meteor.methods({
    PgetEventListOfNationalKO:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getEventListOfNationalKO",data));
            }
        }catch(e){
            
        }
    }
})


Meteor.methods({
    PgetEventListOfNationalRR:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getEventListOfNationalRR",data));
            }
        }catch(e){
            
        }
    }
})

Meteor.methods({
    PgetRRWithEvents:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getRRWithEvents",data));
            }
        }catch(e){
            
        }
    }
})

Meteor.methods({
    PgetTeamDetailedDrawsLive:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getTeamDetailedDrawsLive",data));
            }
        }catch(e){
            
        }
    }
})

Meteor.methods({
    PgetDetailsOfCountryOrganizers: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_COU_STATE_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {

                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("getDetailsOfCountryOrganizers", data));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})