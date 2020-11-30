Meteor.methods({
       
    PregisterAcademy5s:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("registerAcademy5s",data));
            }
            
        }catch(e){
        }
    }
})


Meteor.methods({
    PgetAcademyListForGivenAssoc:function(caller,apiKey,data)
    {  
        try{
            
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getAcademyListForGivenAssoc",data));
            }
            
        }catch(e){
        }
    }
})


Meteor.methods({
    PgetTournamentDetForAcademySub:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getTournamentDetForAcademySub",data.tournamentId,data.academyId));
            }
            
        }catch(e){
        }
    }
})

Meteor.methods({
    PcreateArrayToSubscribe:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("createArrayToSubscribe",data));
            }
            
        }catch(e){
        }
    }
})


Meteor.methods({
    PsendSubscriptionEmailAPI:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("sendSubscriptionEmailAPI",data.tournamentId,data.userId));
            }
            
        }catch(e){
        }
    }
})



