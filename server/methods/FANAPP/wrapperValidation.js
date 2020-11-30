Meteor.methods({
       
    PgetAllTourParticipations:function(caller,apiKey,data)
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
                    return (Meteor.call("getAllTourParticipations",data));

            }
            
        }catch(e){
        }
    },


    PliveTourSubscription:function(caller,apiKey,data)
    {  
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid api caller/key";
                return resultJson;
            }else{
                
                return (Meteor.call("liveTourSubscription",data));

            }
            
        }catch(e){
        }
    },

});