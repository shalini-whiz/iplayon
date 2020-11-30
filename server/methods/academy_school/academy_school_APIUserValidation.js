Meteor.methods({

	 PupcomingTournamentsOnMultipleApiKey:function(caller,apiKey,multiApiKey)
    {
        try{

            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("upcomingTournamentsMultipleOnApiKey",multiApiKey));

        }catch(e){
        }
    },
    PpastTournamentsOnMultipleApiKey:function(caller,apiKey,multiApiKey)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("pastTournamentsOnMultipleApiKey",multiApiKey));

        }catch(e){

        }
    },
    PpastTournamentsIDOnMultipleApiKey:function(caller,apiKey,multiApiKey)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("pastTournamentsIDOnMultipleApiKey",multiApiKey));

        }catch(e){

        }
    },

    
})