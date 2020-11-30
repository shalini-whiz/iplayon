Meteor.methods({
    PfetchOrganizerTeamFormats:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchOrganizerTeamFormats",data));
            }
            
        }catch(e){
        }
    }
})


Meteor.methods({
    PcreateTeamsFormatByOrganizer:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("createTeamsFormatByOrganizer",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PselectedTeamFormatIdDetails:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("selectedTeamFormatIdDetails",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PinitTeamMatchRecords:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("initTeamMatchRecords",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetMatchRecordsAfterCreate:function(caller,apiKey,data){  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getMatchRecordsAfterCreate",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetTeamDetailedDrawsForToss:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getTeamDetailedDrawsForToss",data));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PgetTeamDetailsForToss:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getTeamDetailsForToss",data));
            }
            
        }catch(e){
        }
    }
})
