import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Meteor.methods({

    PumpireRegisterViaApp:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }
            data = data.replace("\\", "");
            var param = JSON.parse(data);
            param.country = "India";
            param.interestedDomainName = [param.state];
            param.interestedProjectName = [param.interestedProjectName];
            return (Meteor.call("registerOtherUsers",param));
        }catch(e){

        } 
    },

    PupcomingTournamentsOfUmpire:function(caller,apiKey,userId)
    {

    	try{
    		if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
	        return;
	    }        
        return (Meteor.call("upcomingTournamentsOfUmpire",userId));

          
    	}catch(e){	
    	}
    },

    PumpireSubscriptionApp:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }
            data = data.replace("\\", "");

            var param = JSON.parse(data);

            return (Meteor.call("umpireSubscriptionApp",param));
        }catch(e){

        } 
    },
    PfetchUmpireSubscriptionApp:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }
            if(typeof data == "string")
            {
                data = data.replace("\\", "");
                var param = JSON.parse(data);
                return (Meteor.call("fetchUmpireSubscriptionApp",param));
            }
            else
                return (Meteor.call("fetchUmpireSubscriptionApp",data));

            
        }catch(e){


        } 
    },
    PdownloadUmpireEntries:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }
            data = data.replace("\\", "");
            var param = JSON.parse(data);

            return (Meteor.call("downloadUmpireEntries",param));
        }catch(e){

        } 
    },
   
});



