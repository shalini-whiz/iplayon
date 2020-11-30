import { Meteor } from 'meteor/meteor';


Meteor.methods({

    PfetchEventSchedule:function(caller,apiKey,data)
    {

    	try{
    		if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
	        return;
	    }        
            return (Meteor.call("fetchEventSchedule",data));
    	}catch(e){	
    	}
    },

});