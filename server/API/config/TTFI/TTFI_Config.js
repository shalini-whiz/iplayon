import { Meteor } from 'meteor/meteor';
import { response } from '../api.js';

API.methods["fetchFitbitData"] = {
    POST: function(context, connection){
      try{
        var hasdata = (connection && connection.data) ? true : false;
        if (hasdata && connection.data) 
        {
          if(connection.data.caller && connection.data.apiKey)
          {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;

            var data = {};
            if(connection.data.data)
              data = connection.data.data;
            Meteor.call("PfetchFitbitData",caller,apiKey,data,function(e,r){
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










API.methods["tourCreationDetails"] = {
  GET: function(context, connection){
    try{
      var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
      if (hasQuery) 
      {
        if(connection.data.caller && connection.data.apiKey && connection.data.data)
        {
          var caller = connection.data.caller;
          var apiKey = connection.data.apiKey;
          var data = connection.data.data;
          if(data.userId)
          {
            Meteor.call("PtourCreationDetails",caller,apiKey,data,function(e,r){
              if(r){
                response(context, 200, r);                            
              }                          
              else{
                response(context, 200, {status:"failure",message: "Invalid data."});
              }
            });
          }
          else
          {
            response(context, 200, {status:"failure",message: "Invalid params"});
          }
           
        }
        else
        {
          response(context, 200, {status:"failure",message: "Invalid params"});
        }
       
      } else 
      {
        response(context, 404, {error: 404,message: "Invalid data."});
      }
    }catch(e){}
  } 
}


API.methods["createTour"] = {
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
            
            Meteor.call("PcreateTour",caller,apiKey,data,function(e,r){
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



API.methods["fetchTourDetails"] = {
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

            
            Meteor.call("PfetchTourDetails",caller,apiKey,data,function(e,r){
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

API.methods["modifyTour"] = {
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

            
            Meteor.call("PmodifyTour",caller,apiKey,data,function(e,r){
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

API.methods["deleteTour"] = {
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

            
            Meteor.call("PdeleteTour",caller,apiKey,data,function(e,r){
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