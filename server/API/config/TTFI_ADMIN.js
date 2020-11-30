import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["registerTTFIAdmin"] = {
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
		        Meteor.call("PregisterTTFIAdmin",caller,apiKey,data,function(e,r){
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

API.methods["registerSchoolExtAPI"] = {
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
		        Meteor.call("PregisterSchoolExtAPI",caller,apiKey,data,function(e,r){
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

API.methods["getDetailsOfCountryState"] = {
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
		        Meteor.call("PgetDetailsOfCountryState",caller,apiKey,data,function(e,r){
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

API.methods["getDetailsOfCountryForGivenCountryName"] = {
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
		        	else{
		        		data = connection.data.data
		        	}
		        }
		        Meteor.call("PgetDetailsOfCountryForGivenCountryName",caller,apiKey,data,function(e,r){
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

API.methods["sendRegOtpWithValidations"] = {	
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
		        Meteor.call("PsendRegOtpWithValidations",caller,apiKey,data,function(e,r){
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

API.methods["sendNewPasswordOtpWithValidations"] = {
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
		        Meteor.call("PsendNewPasswordOtpWithValidations",caller,apiKey,data,function(e,r){
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

API.methods["setNewPasswordWithValidations"] = {
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
		        Meteor.call("PsetNewPasswordWithValidations",caller,apiKey,data,function(e,r){
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

API.methods["loginUserWithValidations"] = {
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
		        Meteor.call("PloginUserWithValidations",caller,apiKey,data,function(e,r){
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

API.methods["registerTTFIStateAssocAPI"] = {
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
		        Meteor.call("PregisterTTFIStateAssocAPI",caller,apiKey,data,function(e,r){
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

API.methods["registerTTFIDistAssocAPI"] = {
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
		        Meteor.call("PregisterTTFIDistAssocAPI",caller,apiKey,data,function(e,r){
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

API.methods["registerTTFIAcademyAPI"] = {
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
		        Meteor.call("PregisterTTFIAcademyAPI",caller,apiKey,data,function(e,r){
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

API.methods["getListOfStateAssociations"] = {
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
		        Meteor.call("PgetListOfStateAssociations",caller,apiKey,data,function(e,r){
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

API.methods["getListOfDistAssociations"] = {
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
		        Meteor.call("PgetListOfDistAssociations",caller,apiKey,data,function(e,r){
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

API.methods["getAffiliatedDistAssociations"] = {
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
		        Meteor.call("PgetAffiliatedDistAssociations",caller,apiKey,data,function(e,r){
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

API.methods["getUnAffiliatedDistAssociations"] = {
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
		        Meteor.call("PgetUnAffiliatedDistAssociations",caller,apiKey,data,function(e,r){
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

API.methods["affiliateDAToSA"] = {
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
		        Meteor.call("PaffiliateDAToSA",caller,apiKey,data,function(e,r){
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

API.methods["affiliateAcademyToDA"] = {
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
		        Meteor.call("PaffiliateAcademyToDA",caller,apiKey,data,function(e,r){
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

API.methods["affiliateAcademyToSA"] = {
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
		        Meteor.call("PaffiliateAcademyToSA",caller,apiKey,data,function(e,r){
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

API.methods["getListOfAcademiesAPI"] = {
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
		        Meteor.call("PgetAffiliatedStateAcademies",caller,apiKey,data,function(e,r){
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

API.methods["getAffiliatedStateAcademies"] = {
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
		        Meteor.call("PgetAffiliatedStateAcademies",caller,apiKey,data,function(e,r){
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

API.methods["getAffiliatedDistAcademies"] = {
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
		        Meteor.call("PgetAffiliatedDistAcademies",caller,apiKey,data,function(e,r){
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

API.methods["getUnAffiliatedAcademies"] = {
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
		        Meteor.call("PgetUnAffiliatedAcademies",caller,apiKey,data,function(e,r){
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

API.methods["getAffiliatedDistAssociationsForState"] = {
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
		        Meteor.call("PgetAffiliatedDistAssociationsForState",caller,apiKey,data,function(e,r){
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

API.methods["getDetailsOfGivenAcademyId"] = {
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
		        Meteor.call("PgetDetailsOfGivenAcademyId",caller,apiKey,data,function(e,r){
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

API.methods["enableUsersAPI"] = {
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
		        Meteor.call("PenableUsersAPI",caller,apiKey,data,function(e,r){
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


API.methods["getListOfActiveStateAssociations"] = {
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
		        Meteor.call("PgetListOfActiveStateAssociations",caller,apiKey,data,function(e,r){
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

API.methods["getListOfInActiveStateAssociations"] = {
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
		        Meteor.call("PgetListOfInActiveStateAssociations",caller,apiKey,data,function(e,r){
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

API.methods["getListOfActiveAcademiesAPI"] = {
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
		        Meteor.call("PgetListOfActiveAcademiesAPI",caller,apiKey,data,function(e,r){
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

API.methods["getListOfInActiveAcademiesAPI"] = {
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
		        Meteor.call("PgetListOfInActiveAcademiesAPI",caller,apiKey,data,function(e,r){
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

API.methods["PgetListOfActiveDistAssociations"] = {
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
		        Meteor.call("getListOfActiveDistAssociations",caller,apiKey,data,function(e,r){
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

API.methods["PgetListOfInActiveDistAssociations"] = {
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
		        Meteor.call("getListOfInActiveDistAssociations",caller,apiKey,data,function(e,r){
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

API.methods["removeAffiliatedDAFromSA"] = {
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
		        Meteor.call("PremoveAffiliatedDAFromSA",caller,apiKey,data,function(e,r){
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

API.methods["getDetailsOfGivenStateAssoc"] = {
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
		        Meteor.call("PgetDetailsOfGivenStateAssoc",caller,apiKey,data,function(e,r){
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

API.methods["getDetailsOfGivenDistAssoc"] = {
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
		        Meteor.call("PgetDetailsOfGivenDistAssoc",caller,apiKey,data,function(e,r){
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


API.methods["removeAffiliatedAcadFromDA"] = {
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
		        Meteor.call("PremoveAffiliatedAcadFromDA",caller,apiKey,data,function(e,r){
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

API.methods["removeAffiliatedAcadFromSA"] = {
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
		        Meteor.call("PremoveAffiliatedAcadFromSA",caller,apiKey,data,function(e,r){
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

API.methods["updateProfileOfSAAPI"] = {
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
		        Meteor.call("PupdateProfileOfSAAPI",caller,apiKey,data,function(e,r){
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

API.methods["updateProfileOfDAAPI"] = {
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
		        Meteor.call("PupdateProfileOfDAAPI",caller,apiKey,data,function(e,r){
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

API.methods["updateProfileOfAcademyAPI"] = {
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
		        Meteor.call("PupdateProfileOfAcademyAPI",caller,apiKey,data,function(e,r){
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

API.methods["updatePhoneOrEmailAddress"] = {
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
		        Meteor.call("PupdatePhoneOrEmailAddress",caller,apiKey,data,function(e,r){
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

API.methods["registerAndAffiliateDistToSa"] = {
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
		        Meteor.call("PregisterAndAffiliateDistToSa",caller,apiKey,data,function(e,r){
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

API.methods["registerAndAffiliateAcadToDA"] = {
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
		        Meteor.call("PregisterAndAffiliateAcadToDA",caller,apiKey,data,function(e,r){
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

API.methods["registerAndAffiliateAcadToSA"] = {
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
		        Meteor.call("PregisterAndAffiliateAcadToSA",caller,apiKey,data,function(e,r){
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

API.methods["affiliatePlayerToSA"] = {
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
		        Meteor.call("PaffiliatePlayerToSA",caller,apiKey,data,function(e,r){
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

API.methods["affiliatePlayerToDistrict"] = {
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
		        Meteor.call("PaffiliatePlayerToDistrict",caller,apiKey,data,function(e,r){
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

API.methods["affiliatePlayerToAcademyOfSA"] = {
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
		        Meteor.call("PaffiliatePlayerToAcademyOfSA",caller,apiKey,data,function(e,r){
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

API.methods["affiliatePlayerToAcademyOfDA"] = {
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
		        Meteor.call("PaffiliatePlayerToAcademyOfDA",caller,apiKey,data,function(e,r){
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
