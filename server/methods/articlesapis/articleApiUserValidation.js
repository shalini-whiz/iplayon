
Meteor.methods({

    PfetchArticlesForGivenUserIds:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchArticlesForGivenUserIds",data));
            }
            
        }catch(e){
        }
    },
    PfetchPacks:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchPacks",data.userId,data.loggerId));
            }
            
        }catch(e){
        }
    },
    PfetchMyPacks:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchMyPacks",data.userId));
            }
            
        }catch(e){
        }
    },


    PfetchMySubscribedPacks:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchMySubscribedPacks",data.userId));
            }
            
        }catch(e){
        }
    },
    PfetchPackUsers:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchPackUsers",data.userId));
            }
            
        }catch(e){
        }
    },
    
    PloginAndSubscribeToPack:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("loginAndSubscribeToPack",data));
            }
            
        }catch(e){
        }
    },

    PfetchArticles:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchArticles",data.userId));
            }
            
        }catch(e){
        }
    },
    

    PfetchSubscribedPackUsers:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchSubscribedPackUsers",data.packId));
            }
            
        }catch(e){
        }
    },

    PsubscribeForPack:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("subscribeForPack",data));
            }
            
        }catch(e){
        }
    },

    PmultiPackSubscription:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("multiPackSubscription",data));
            }
            
        }catch(e){
        }
    },
    PupdateSubscribedPF:function(caller,apiKey,data)
    {
        try{

            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
               
                return (Meteor.call("updateSubscribedPF",data));
            }
            
        }catch(e){
        }
    }
});