import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["getSelectedDatesOfTournament"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {	

		    	
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var userId = connection.data.tournamentId;    

		        Meteor.call("PgetSelectedDatesOfTournament",caller,apiKey,userId,function(e,r){
		          if(r){
		            response(context, 200, r);                            
		          }                          
		          else{
		            response(context, 200, {message: "Invalid data"});
		          }
		        });
		      } 
		    else{
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}

API.methods["scheduleDataForAPTTA"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var data = connection.data.data		        

		        var tournamentId  = ""
		        var eventName = ""
		        var selectedDate = ""
		        var type = 0
		        if(connection.data.tournamentId)
		           tournamentId = connection.data.tournamentId
		        if(connection.data.eventName)
		           eventName = connection.data.eventName
		        if(connection.data.selectedDate)
		           selectedDate = connection.data.selectedDate
		     	if(connection.data.type)
		           type = connection.data.type

		        var datass = {
		        	tournamentId:tournamentId,
		        	eventName:eventName,
		        	selectedDate:selectedDate,
		        	type:type
		        }

		        Meteor.call("PscheduleDataForAPTTA",caller,apiKey,datass,function(e,r){
		          if(r){
		            response(context, 200, r);                            
		          }                          
		          else{
		            response(context, 200, {message: "Invalid data"});
		          }
		        });
		      } 
		    else{
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}