Meteor.methods({
    PfetchRRDraws: function(caller, apiKey,tournamentId,eventName) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchRRDraws",tournamentId,eventName));
            }
            
        }catch(e){
        }
    },

    PfetchRRMatchScoreDraws: function(caller, apiKey,data) 
    {
         try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchRRMatchScoreDraws",data));
            }
            
        }catch(e){
        }
    },


})
