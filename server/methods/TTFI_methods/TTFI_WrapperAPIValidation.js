Meteor.methods({

    PfetchFitbitData:function(caller,apiKey,data)
    {  
        try{
            console.log("entered validation")
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                    return (Meteor.call("fetchFitbitData",data));

            }
            
        }catch(e){
        }
    },
       
    PtourCreationDetails:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                if(data.userId)
                    return (Meteor.call("getTournamentCreationDetails",data.userId));

            }
            
        }catch(e){
        }
    },
    PcreateTour:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                var apiInfo = apiUsers.findOne({"apiUser":caller,"apiKey":apiKey});
                if(apiInfo)
                    data.source = apiInfo.source;
                return (Meteor.call("createTour",data));
            }
            
        }catch(e){
        }
    },
    PfetchTourDetails:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchTourDetails",data));
              
            }
            
        }catch(e){
        }
    },
    PmodifyTour:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("modifyTour",data));
              
            }
            
        }catch(e){
        }
    },
    PdeleteTour:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("deleteTour",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchTeamFormatList:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchTeamFormatList",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchPlayersOnTeamFormat:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchPlayersOnTeamFormat",data));
              
            }
            
        }catch(e){
        }
    },
    PcreateTFTeam:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                var apiInfo = apiUsers.findOne({"apiUser":caller,"apiKey":apiKey});
                if(apiInfo)
                    data.source = apiInfo.source;
                return (Meteor.call("createTFTeam",data));
              
            }
            
        }catch(e){
        }
    },
    
    PmodifyTFTeam:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("modifyTFTeam",data));
              
            }
            
        }catch(e){
        }
    },

    
    PviewTFTeam:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("viewTFTeam",data));
              
            }
            
        }catch(e){
        }
    },
    PdeleteTFTeam:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("deleteTFTeam",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchTFTeams:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchTFTeams",data));
              
            }
            
        }catch(e){
        }
    },
    PdownloadTourDraws:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                console.log("call downloadTourDraws")
                return (Meteor.call("downloadTourDraws",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchTourEventDraw:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchTourEventDraw",data));
              
            }
            
        }catch(e){
        }
    },
    PresetTourEventDraw:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("resetTourEventDraw",data));
              
            }
            
        }catch(e){
        }
    },

    PfetchEmptyDraws:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchEmptyDraws",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchTourDrawEventList:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchTourDrawEventList",data));
              
            }
            
        }catch(e){
        }
    },

    PsetRRPoints:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("setRRPoints",data));
              
            }
            
        }catch(e){
        }
    },

    PsetRRStanding:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("setRRStanding",data));
              
            }
            
        }catch(e){
        }
    },

    PfetchRRWinnerEntries:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchRRWinnerEntries",data));
              
            }
            
        }catch(e){
        }
    },

    PfetchMatchDetails:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchMatchDetails",data));
              
            }
            
        }catch(e){
        }
    },
    
    PsetMatchDetails:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("setMatchDetails",data));
              
            }
            
        }catch(e){
        }
    },
    PcreateRRDraws:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("createRRDraws",data));
              
            }
            
        }catch(e){
        }
    },
    PcreateKODraws:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("createKODraws",data));
              
            }
            
        }catch(e){
        }
    },

    PfetchBlankScore:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchBlankScore",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchScoreSheet:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchScoreSheet",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchLeaveRequest:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchLeaveRequest",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchPlayerEntries:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchPlayerEntries",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchAcademyEntries:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchAcademyEntries",data));
              
            }
            
        }catch(e){
        }
    },
    PfetchDAEntries:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchDAEntries",data));
              
            }
            
        }catch(e){
        }
    },
    
    PfetchPlayerTeamEntries:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchPlayerTeamEntries",data));
              
            }
            
        }catch(e){
        }
    },
    
    PentryPayReceipt:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("entryPayReceipt",data));
              
            }
            
        }catch(e){
        }
    },

    PfetchPaidPlayers:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("fetchPaidPlayers",data));
              
            }
            
        }catch(e){
        }
    },

    PfetchTourEvents:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                console.log("data .."+JSON.stringify(data))
                return (Meteor.call("fetchTourEvents",data));
              
            }
            
        }catch(e){
        }
    },
    PgenerateDrawReceipt:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                console.log("data .."+JSON.stringify(data))
                return (Meteor.call("generateDrawReceipt",data));
              
            }
            
        }catch(e){
            errorLog(e)
        }
    },
    PfetchSubscribers:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                console.log("data .."+JSON.stringify(data))
                return (Meteor.call("fetchPlayers",data.tournamentId,data.eventName));
              
            }
            
        }catch(e){
            errorLog(e)
        }
    },

    //entryPayReceipt

 
})