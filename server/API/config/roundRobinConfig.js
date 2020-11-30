import { Meteor } from 'meteor/meteor';
import { response } from './api.js';


API.methods["fetchRRDraws"] = {
  "POST": function( context, connection ){
    try
    {
        var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			    var caller = connection.data.caller;
          var apiKey = connection.data.apiKey;
         

      		var userNamesBySport = Meteor.call("PfetchRRDraws",caller,apiKey,connection.data.tournamentId,connection.data.eventName);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}



//fetchRRMatchScoreDraws



API.methods["fetchRRMatchScoreDraws"] = {
  "POST": function( context, connection ){
    try
    {
        var hasdata = (connection && connection.data) ? true : false;
      if(hasdata)
      {
          var caller = connection.data.caller;
          var apiKey = connection.data.apiKey;
         

          var userNamesBySport = Meteor.call("PfetchRRMatchScoreDraws",caller,apiKey,connection.data.data);  
          if ( userNamesBySport) {
              response( context, 200, userNamesBySport );
          } 
          else {
              response( context, 404, { error: 404, message: "No data found." } );
          }
      }              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}