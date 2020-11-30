import { Meteor } from 'meteor/meteor';
import { response } from './api.js';


API.methods["upcomingTournamentsOnMultipleApiKey123"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;

      Meteor.call("PupcomingTournamentsOnMultipleApiKey213",caller,apiKey,connection.data,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["upcomingTournamentsOnMultipleApiKey"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {	
		    	
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;

		        Meteor.call("PupcomingTournamentsOnMultipleApiKey",caller,apiKey,connection.data,function(e,r){
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


API.methods["pastTournamentsOnMultipleApiKey"] = {
    POST: function(context, connection){
      try{
            var hasdata = (connection && connection.data) ? true : false;
        if (hasdata) 
        { 
          
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;

            Meteor.call("PpastTournamentsOnMultipleApiKey",caller,apiKey,connection.data.multiApiKey,function(e,r){
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




API.methods["pastTournamentsIDOnMultipleApiKey"] = {
    POST: function(context, connection){
      try{
            var hasdata = (connection && connection.data) ? true : false;
        if (hasdata) 
        { 
          
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;

            Meteor.call("PpastTournamentsIDOnMultipleApiKey",caller,apiKey,connection.data.multiApiKey,function(e,r){
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


