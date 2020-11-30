import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

/*API.methods["subscriptionViaApp"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PsubscriptionViaApp",caller,apiKey,connection.data,function(e,r){
		          if(r){
		            response(context, 200, {message: "success"});                            
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
}*/



API.methods["checkForLoginDetails"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var userId = connection.data.userId;
		        Meteor.call("PcheckForLoginDetails",caller,apiKey,userId,function(e,r){
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

API.methods["updateLoginDetails"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var data = connection.data.data;
		        Meteor.call("PupdateLoginDetails",caller,apiKey,data,function(e,r){
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



API.methods["viewPlayerProfile"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var playerID = connection.data.playerId;
	            var result = Meteor.call("PviewPlayerProfile",caller,apiKey,playerID);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}
     

/************************ my diary *****************************/ 

API.methods["fetchOpponentUsers"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PfetchOpponentUsers",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}



API.methods["createDiary"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PcreateDiary",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}


API.methods["fetchDiaryRecord"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PfetchDiaryRecord",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}


API.methods["updateDiary"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PupdateDiary",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}

API.methods["deleteDiary"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PdeleteDiary",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}

API.methods["fetchMyDiary"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PfetchMyDiary",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}


API.methods["diaryAnalysis"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PdiaryAnalysis",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}


API.methods["diaryPerformAnalysis"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PdiaryPerformAnalysis",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}

API.methods["shareMyDiary"] = {
    POST: function( context, connection ){
        try{

            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PshareMyDiary",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}


API.methods["fetchSharedMembers"] = {
    POST: function( context, connection ){
        try{

            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PfetchSharedMembers",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}


API.methods["viewTeamDetails"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PviewTeamDetails",caller,apiKey,connection.data.teamId);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){

            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}


API.methods["fetchProfileStatistics"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {

		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var result = Meteor.call("PfetchProfileStatistics",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}



API.methods["playerUserLogin"] = {
  POST: function( context, connection ){
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var userName = connection.data.userName;
          	var userPassword = connection.data.userPassword;
      		var userNamesBySport = Meteor.call("PplayerUserLogin",userName,userPassword);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}




API.methods["playerUserLoginUnderAssoc"] = {
  POST: function( context, connection ){
    try
    {
    	
        //var hasdata = (connection && connection.data) ? true : false;
    	if(connection && connection.data)
    	{
			var userName = connection.data.userName;
          	var userPassword = connection.data.userPassword;
      		var associationId = connection.data.associationId;
      		var typeOfLogin = "1"
            var loginRole = "Player"
            var paymentValid = "";

            if(connection.data.paymentValid)
            	paymentValid = connection.data.paymentValid;


            if (connection.data.emailOrPhone) {
                typeOfLogin = connection.data.emailOrPhone;
            }
            if(connection.data.loginRole){
                loginRole = connection.data.loginRole
            }

      		var userNamesBySport = Meteor.call("PplayerUserLoginUnderAssoc",userName,userPassword,associationId,typeOfLogin,loginRole,paymentValid);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["eventListUnderTourn"] = {
  GET: function( context, connection ){
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var caller = connection.data.caller;
          	var apiKey = connection.data.apiKey;
      		var userNamesBySport = Meteor.call("PeventListUnderTourn",caller,apiKey,connection.data.tournamentId,connection.data.userId);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}




API.methods["eventListUnderTournAPI"] = {
  GET: function( context, connection ){
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var caller = connection.data.caller;
          	var apiKey = connection.data.apiKey;
      		var userNamesBySport = Meteor.call("PeventListUnderTournAPI",caller,apiKey,connection.data.tournamentId,connection.data.userId);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}



API.methods["eventSubscriptionViaApp"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PeventSubscriptionViaApp",caller,apiKey,connection.data,function(e,r){
		          if(r){
		            response(context, 200, {message: "success"});                            
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
API.methods["viewTournamentResults1"] = {
  GET: function( context, connection ){
    try
    {

            var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var caller = connection.data.caller;
          	var apiKey = connection.data.apiKey;
      		var userNamesBySport = Meteor.call("PviewTournamentResults1",caller,apiKey,connection.data.tournamentId,connection.data.userId);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}
API.methods["viewTournamentResults"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PviewTournamentResults",caller,apiKey,connection.data.tournamentId,function(e,r){
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

API.methods["getPaymentHash"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PgetPaymentHash",caller,apiKey,connection.data,function(e,r){
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

API.methods["downloadRRDraws"] = {
  GET: function( context, connection ){
    try
    {
        var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var caller = connection.data.caller;
          	var apiKey = connection.data.apiKey;
      		var userNamesBySport = Meteor.call("PdownloadRRDraws",caller,apiKey,connection.data.tournamentId,connection.data.eventName);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["downloadRRDrawsIOS"] = {
  "POST": function( context, connection ){
    try
    {
        var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var caller = connection.data.caller;
          	var apiKey = connection.data.apiKey;
      		var userNamesBySport = Meteor.call("PdownloadRRDraws",caller,apiKey,connection.data.tournamentId,connection.data.eventName);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}



API.methods["downloadDraws"] = {
  GET: function( context, connection ){
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var caller = connection.data.caller;
          	var apiKey = connection.data.apiKey;
      		var userNamesBySport = Meteor.call("PdownloadDraws",caller,apiKey,connection.data.tournamentId,connection.data.eventName);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}
API.methods["pasteventListUnderTournAPI"] = {
  GET: function( context, connection ){
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var caller = connection.data.caller;
          	var apiKey = connection.data.apiKey;
      		var userNamesBySport = Meteor.call("PpasteventListUnderTournAPI",caller,apiKey,connection.data.tournamentId,connection.data.userId);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["subscriptionTeamChange"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PsubscriptionTeamChange",caller,apiKey,connection.data,function(e,r){

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
  
API.methods["printDrawsFrom5s"] = {
  GET: function( context, connection ){
    try
    {	
            var hasdata = (connection && connection.data) ? true : false;
    	if(hasdata)
    	{
			var caller = connection.data.caller;
          	var apiKey = connection.data.apiKey;
      		var userNamesBySport = Meteor.call("PprintDrawsFrom5s",caller,apiKey,connection.data.tournamentId,connection.data.eventName,connection.data.withScores);  
	        if ( userNamesBySport) {
	            response( context, 200, userNamesBySport );
	        } 
	        else {
	            response( context, 404, { error: 404, message: "No users found." } );
	        }
    	}              
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}





API.methods["fetchRankEvents"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PfetchRankEvents",caller,apiKey,connection.data,function(e,r){

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





API.methods["fetchRankData"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PfetchRankData",caller,apiKey,connection.data,function(e,r){

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






API.methods["fetchTournamentRankData"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PfetchTournamentRankData",caller,apiKey,connection.data,function(e,r){

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


  API.methods["playerRegisterUnderAssoc"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PplayerRegisterUnderAssoc",caller,apiKey,connection.data,function(e,r){
		          if(r && r.response){
		          	response(context, 200, {message: r.response,"data":r});
		          }
		          else if(r){
		            response(context, 200, {message: "Registered","data":r});                            
		          }                          
		          else{
		            response(context, 200, {message: "Invalid data"});
		          }
		        });
		    }
		    else
		    {
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}






 API.methods["affiliateToAssoc"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PaffiliateToAssoc",caller,apiKey,connection.data.data,function(e,r){
		          if(r && r.response){
		          	response(context, 200, {message: r.response,"data":r});
		          }
		          else if(r){
		            response(context, 200, {message: "Registered","data":r});                            
		          }                          
		          else{
		            response(context, 200, {message: "Invalid data"});
		          }
		        });
		    }
		    else
		    {
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}


API.methods["renewalUnderAssoc"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PrenewalUnderAssoc",caller,apiKey,connection.data.data,function(e,r){
		          if(r && r.response){
		          	response(context, 200, {message: r.response,"data":r});
		          }
		          else if(r){
		            response(context, 200, {message: "Registered","data":r});                            
		          }                          
		          else{
		            response(context, 200, {message: "Invalid data"});
		          }
		        });
		    }
		    else
		    {
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}

//validateAffiliateOther


API.methods["validateAffiliateOther"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        Meteor.call("PvalidateAffiliateOther",caller,apiKey,connection.data.data,function(e,r){
		          if(r && r.response){
		          	response(context, 200, {message: r.response,"data":r});
		          }
		          else if(r){
		            response(context, 200, {message: "Registered","data":r});                            
		          }                          
		          else{
		            response(context, 200, {message: "Invalid data"});
		          }
		        });
		    }
		    else
		    {
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}

/**************************************************************************/





API.methods["playerRankList"] = {
  GET: function( context, connection ){
    try
    {	
        var hasdata = (connection && connection.data) ? true : false;

    	if(hasdata) 
    	{
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            var sportID = connection.data.sportId;
            var eventName = connection.data.eventName;
            var filterData = connection.data.filterData;

            var userNamesBySport = Meteor.call("PplayerRankList", caller, apiKey, sportID, eventName, filterData);
           	if (userNamesBySport.length > 0) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } 


    	             
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["typeBasedTeams"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var data = {};
		        if(connection.data.data)
		        	data = connection.data.data;

		        Meteor.call("PtypeBasedTeams",caller,apiKey,data,function(e,r){
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
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}

//fetchTeamPoints


API.methods["fetchTeamPoints"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var data = {};
		        if(connection.data.data)
		        	data = connection.data.data;

		        Meteor.call("PfetchTeamPoints",caller,apiKey,data,function(e,r){
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
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}


API.methods["fetchTeamSchedule"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var data = {};
		        if(connection.data.data)
		        	data = connection.data.data;

		        Meteor.call("PfetchTeamSchedule",caller,apiKey,data,function(e,r){
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
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}


API.methods["eventSubscription"] = {
  	POST: function(context, connection){
	    try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {
		        var caller = connection.data.caller;
		        var apiKey = connection.data.apiKey;
		        var data = {};
		        if(connection.data.data)
		        	data = connection.data.data;

		        Meteor.call("PeventSubscription",caller,apiKey,data,function(e,r){

		          if(r){
		            response(context, 200, {message: "success"});                            
		          }                          
		          else{
		            response(context, 200, {message: "Invalid data"});
		          }
		        });
		    }
		    else
		    {
		        response(context, 404, {error: 404,message: "Invalid data"});
		    }
	    }catch(e){
	    }
  	} 
}
