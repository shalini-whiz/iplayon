import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["allUpcomingTournaments"]={
  POST: function(context, connection) {
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PallUpcomingTournaments",caller,apiKey,connection.data.userId,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not edit tournament"})
          }
          else
          {
            if(result)
              response(context, 200,result);        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
};


API.methods["allPastTournaments"]={
  POST: function(context, connection) {
    try
    {

            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PallPastTournaments",caller,apiKey,connection.data.userId,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not edit tournament"})
          }
          else
          {
            if(result)
              response(context, 200,result);        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
}


API.methods["fetchDefaultMatchRecord"]={
  POST: function(context, connection) {
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PfetchDefaultMatchRecord",caller,apiKey,connection.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not edit tournament"})
          }
          else
          {
            if(result)
              response(context, 200,result);        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
}


API.methods["emailMatchReport"]={
  POST: function(context, connection) {
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PemailMatchReport",caller,apiKey,connection.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not send email"})
          }
          else
          {
            if(result)
              response(context, 200,{message: "Mail Sent"});        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
}






API.methods["fetchForLive"]={
  POST: function(context, connection) {
    try
    {
      var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PfetchForLive",caller,apiKey,connection.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not fetch live tournament"})
          }
          else
          {
            if(result)
              response(context, 200,result);        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
}


//setLiveScore



API.methods["setLiveScore"]={
  POST: function(context, connection) {
    try
    {
      var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PsetLiveScore",caller,apiKey,connection.data.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not fetch live tournament"})
          }
          else
          {
            if(result)
              response(context, 200,result);        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
}

//setLiveStatus


API.methods["setLiveStatus"]={
  POST: function(context, connection) {
    try
    {
      var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PsetLiveStatus",caller,apiKey,connection.data.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not set live status"})
          }
          else
          {
            if(result)
              response(context, 200,result);        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
}


//fetchTourTeamScore


API.methods["fetchTourTeamScore"]={
  POST: function(context, connection) {
    try
    {
      var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PfetchTourTeamScore",caller,apiKey,connection.data.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not set live status"})
          }
          else
          {
            if(result)
              response(context, 200,result);        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
}




API.methods["createTeamPoints"]={
  POST: function(context, connection) {
    try
    {
      var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PcreateTeamPoints",caller,apiKey,connection.data.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not create/modify team points"})
          }
          else
          {
            if(result)
              response(context, 200,result);        
          } 
        });                                                  
      }       
    }catch(e){
    }
  }
}




