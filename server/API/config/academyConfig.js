import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["registerAcademy5s"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var userId = connection.data.data;  
		        var data = {}
		        if(connection.data.data){
		        	if(typeof connection.data.data == "string"){
		        		data = connection.data.data.replace("\\", "");
			            data = JSON.parse(data);
		        	}
		        }
		        Meteor.call("PregisterAcademy5s",caller,apiKey,data,function(e,r){
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

API.methods["getAcademyListForGivenAssoc"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var userId = connection.data.data;  
		        var data = {}
		        if(connection.data.data){
		        	if(typeof connection.data.data == "string"){
		        		data = connection.data.data.replace("\\", "");
			            data = JSON.parse(data);
		        	}
		        }
		        Meteor.call("PgetAcademyListForGivenAssoc",caller,apiKey,data,function(e,r){
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

API.methods["getTournamentDetForAcademySub"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {	

		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var tournamentId = connection.data.tournamentId;    
		        var academyId = connection.data.academyId
		        Meteor.call("PgetTournamentDetForAcademySub",caller,apiKey,connection.data,function(e,r){
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

API.methods["createArrayToSubscribe"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {	

		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var tournamentId = connection.data.tournamentId;    
		        var academyId = connection.data.academyId
		        Meteor.call("PcreateArrayToSubscribe",caller,apiKey,connection.data,function(e,r){
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


API.methods["sendSubscriptionEmailAPI"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {	
		    	if(connection.data){
		        	if(typeof connection.data == "string"){
		        		data = connection.data.replace("\\", "");
			            data = JSON.parse(data);
		        	}
		        }
		        Meteor.call("PsendSubscriptionEmailAPI",connection.data.caller,connection.data.apiKey,connection.data,function(e,r){
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