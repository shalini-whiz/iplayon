Meteor.methods({
    PgetSelectedDatesOfTournament:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }           
            return (Meteor.call("getSelectedDatesOfTournament",data));
        }catch(e){

        } 
    }
})


Meteor.methods({
    PscheduleDataForAPTTA:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }           
            return (Meteor.call("scheduleDataForAPTTA",data.tournamentId,data.eventName,data.selectedDate,data.type));
        }catch(e){

        } 
    }
})