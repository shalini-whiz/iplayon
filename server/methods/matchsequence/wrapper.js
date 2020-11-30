

Meteor.methods({

    PcreateAnalyticsRequest:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("createAnalyticsRequest",data));
            }
            
        }catch(e){
        }
    },

    PfetchAnalyticsRequest:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchAnalyticsRequest",data));
            }
            
        }catch(e){
        }
    },

    PcancelAnalyticsRequest:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("cancelAnalyticsRequest",data));
            }
            
        }catch(e){
        }
    },


    PdownloadAnalyticsRequestPdf:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("downloadAnalyticsRequestPdf",data));
            }
            
        }catch(e){
        }
    },
    PfetchRequestUser:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchRequestUser",data));
            }
            
        }catch(e){
        }
    }

});

