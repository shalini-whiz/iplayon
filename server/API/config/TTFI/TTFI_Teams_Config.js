import { Meteor } from 'meteor/meteor';
import { response } from '../api.js';

API.methods["fetchTeamFormatList"] = {
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
            
            Meteor.call("PfetchTeamFormatList",caller,apiKey,data,function(e,r){
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


API.methods["fetchPlayersOnTeamFormat"] = {
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
            
            Meteor.call("PfetchPlayersOnTeamFormat",caller,apiKey,data,function(e,r){
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


API.methods["createTFTeam"] = {
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
            
            Meteor.call("PcreateTFTeam",caller,apiKey,data,function(e,r){
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


API.methods["modifyTFTeam"] = {
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
            
            Meteor.call("PmodifyTFTeam",caller,apiKey,data,function(e,r){
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

API.methods["deleteTFTeam"] = {
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
            
            Meteor.call("PdeleteTFTeam",caller,apiKey,data,function(e,r){
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


API.methods["viewTFTeam"] = {
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
            
            Meteor.call("PviewTFTeam",caller,apiKey,data,function(e,r){
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






API.methods["fetchTFTeams"] = {
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
            
            Meteor.call("PfetchTFTeams",caller,apiKey,data,function(e,r){
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