import { Meteor } from 'meteor/meteor';
import { response } from '../api.js';


API.methods["downloadTourDraws"] = {
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
            
            Meteor.call("PdownloadTourDraws",caller,apiKey,data,function(e,r){
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


API.methods["fetchEmptyDraws"] = {
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
            
            Meteor.call("PfetchEmptyDraws",caller,apiKey,data,function(e,r){
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



API.methods["fetchTourDrawEventList"] = {
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
            
            Meteor.call("PfetchTourDrawEventList",caller,apiKey,data,function(e,r){
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

API.methods["fetchTourEventDraw"] = {
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
            
            Meteor.call("PfetchTourEventDraw",caller,apiKey,data,function(e,r){
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






API.methods["resetTourEventDraw"] = {
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
            
            Meteor.call("PresetTourEventDraw",caller,apiKey,data,function(e,r){
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


API.methods["fetchTourEvents"] = {
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
            
            Meteor.call("PfetchTourEvents",caller,apiKey,data,function(e,r){
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