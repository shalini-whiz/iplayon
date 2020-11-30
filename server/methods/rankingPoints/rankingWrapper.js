
Meteor.methods({

    PseedingPlayers:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("seedingPlayers",data));
            }
            
        }catch(e){
        }
    }
})