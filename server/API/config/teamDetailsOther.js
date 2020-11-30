import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["fetchOrganizerTeamFormats"] = {
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
		        	}else{
		        		data = connection.data.data
		        	}
		        }
		        Meteor.call("PfetchOrganizerTeamFormats",caller,apiKey,data,function(e,r){
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


API.methods["createTeamsFormatByOrganizer"] = {
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
		        	}else{
		        		data = connection.data.data
		        	}
		        }
		        Meteor.call("PcreateTeamsFormatByOrganizer",caller,apiKey,data,function(e,r){
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

API.methods["selectedTeamFormatIdDetails"] = {
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
		        	}else{
		        		data = connection.data.data
		        	}
		        }
		        Meteor.call("PselectedTeamFormatIdDetails",caller,apiKey,data,function(e,r){
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

API.methods["initTeamMatchRecords"] = {
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
		        	}else{
		        		data = connection.data.data
		        	}
		        }
		        Meteor.call("PinitTeamMatchRecords",caller,apiKey,data,function(e,r){
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

API.methods["getMatchRecordsAfterCreate"] = {
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
		        	}else{
		        		data = connection.data.data
		        	}
		        }
		        Meteor.call("PgetMatchRecordsAfterCreate",caller,apiKey,data,function(e,r){
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

API.methods["getTeamDetailedDrawsForToss"] = {
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
		        	}else{
		        		data = connection.data.data
		        	}
		        }
		        Meteor.call("PgetTeamDetailedDrawsForToss",caller,apiKey,data,function(e,r){
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

API.methods["getTeamDetailsForToss"] = {
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
		        	}else{
		        		data = connection.data.data
		        	}
		        }
		        Meteor.call("PgetTeamDetailsForToss",caller,apiKey,data,function(e,r){
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
