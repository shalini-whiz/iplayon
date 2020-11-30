import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["upcomingTournamentsOfUmpire"] = {
  GET: function(context, connection){
    try{
      var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
      if (hasQuery) {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PupcomingTournamentsOfUmpire",caller,apiKey,connection.data.userId,function(e,r){
          if(r){
            response(context, 200, r);                            
          }                          
          else{
            response(context, 404, {
              error: 404,
              message: "Invalid data."
            });
          }
        });
      } else 
      {
        response(context, 404, {
          error: 404,
          message: "Invalid data."
        });
      }
    }catch(e){}
  } 
};

API.methods["umpireRegisterViaApp"] = {
  POST: function( context, connection ){
    try{
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PumpireRegisterViaApp",caller,apiKey,connection.data.data,function(e,r){  
          if(r){
            response(context, 200, {message:"Registered"});
          }               
          else{
            response(context, 404, {error: 404,message: "Invalid data."});
          }
        }); 
      }                      
    }
    catch(e){
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
};

API.methods["umpireSubscriptionApp"] = {
  POST: function( context, connection ){
    try{
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PumpireSubscriptionApp",caller,apiKey,connection.data.data,function(e,r){  
          if(r){
            response(context, 200, {message:"Subscribed"});
          }               
          else{
            response(context, 404, {error: 404,message: "Invalid data."});
          }
        }); 
      }                      
    }
    catch(e){
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
};

API.methods["fetchUmpireSubscriptionApp"] = {
  POST: function( context, connection ){
    try{
      
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PfetchUmpireSubscriptionApp",caller,apiKey,connection.data.data,function(e,r){  
          if(r){
            response(context, 200, r);
          }               
          else{
            response(context, 404, {error: 404,message: "Invalid data."});
          }
        }); 
      }                      
    }
    catch(e){
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
};

API.methods["downloadUmpireEntries"] = {
  POST: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      Meteor.call("PdownloadUmpireEntries",caller,apiKey,connection.data.data,function(e,r){  
          if(r){
            response(context, 200, r);
          }               
          else{
            response(context, 404, {error: 404,message: "Invalid data."});
          }
        });     
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}




