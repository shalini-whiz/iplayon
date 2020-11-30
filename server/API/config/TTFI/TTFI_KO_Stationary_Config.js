import { Meteor } from 'meteor/meteor';
import { response } from '../api.js';




API.methods["fetchPaidPlayers"] = {
    POST: function(context, connection){
      try{

        var hasdata = (connection && connection.data) ? true : false;
        if (hasdata && connection.data) 
        {
          if(connection.data.caller && connection.data.apiKey && connection.data.data)
          {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            var data = connection.data.data;
            
            Meteor.call("PfetchPaidPlayers",caller,apiKey,data,function(e,r){
              if(r){
                response(context, 200, r);                            
              }                          
              else{
                response(context, 200, {message: "Invalid data"});
              }
            });
          }
          else
          {
            response(context, 200, {status:"failure",message: "Invalid params"});
          } 
        }
        else{
            response(context, 404, {error: 404,message: "Invalid data"});
        }
      }catch(e){
      }
    } 
}



API.methods["fetchBlankScore"] = {
    POST: function(context, connection){
      try{

        var hasdata = (connection && connection.data) ? true : false;
        if (hasdata && connection.data) 
        {
          if(connection.data.caller && connection.data.apiKey && connection.data.data)
          {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            var data = connection.data.data;
            
            Meteor.call("PfetchBlankScore",caller,apiKey,data,function(e,r){
              if(r){
                response(context, 200, r);                            
              }                          
              else{
                response(context, 200, {message: "Invalid data"});
              }
            });
          }
          else
          {
            response(context, 200, {status:"failure",message: "Invalid params"});
          } 
        }
        else{
            response(context, 404, {error: 404,message: "Invalid data"});
        }
      }catch(e){
      }
    } 
}





API.methods["fetchScoreSheet"] = {
    POST: function(context, connection){
      try{

        var hasdata = (connection && connection.data) ? true : false;
        if (hasdata && connection.data) 
        {
          if(connection.data.caller && connection.data.apiKey && connection.data.data)
          {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            var data = connection.data.data;
            
            Meteor.call("PfetchScoreSheet",caller,apiKey,data,function(e,r){
              if(r){
                response(context, 200, r);                            
              }                          
              else{
                response(context, 200, {message: "Invalid data"});
              }
            });
          }
          else
          {
            response(context, 200, {status:"failure",message: "Invalid params"});
          } 
        }
        else{
            response(context, 404, {error: 404,message: "Invalid data"});
        }
      }catch(e){
      }
    } 
}


API.methods["fetchLeaveRequest"] = {
    POST: function(context, connection){
      try{

        var hasdata = (connection && connection.data) ? true : false;
        if (hasdata && connection.data) 
        {
          if(connection.data.caller && connection.data.apiKey && connection.data.data)
          {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            var data = connection.data.data;
            
            Meteor.call("PfetchLeaveRequest",caller,apiKey,data,function(e,r){
              if(r){
                response(context, 200, r);                            
              }                          
              else{
                response(context, 200, {message: "Invalid data"});
              }
            });
          }
          else
          {
            response(context, 200, {status:"failure",message: "Invalid params"});
          } 
        }
        else{
            response(context, 404, {error: 404,message: "Invalid data"});
        }
      }catch(e){
      }
    } 
}