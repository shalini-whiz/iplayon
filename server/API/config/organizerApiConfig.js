import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["getTournamentCreationDetails"] = {
  GET: function(context, connection){
    try{
      var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
      if (hasQuery) 
      {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PgetTournamentCreationDetails",caller,apiKey,connection.data.userId,function(e,r){
          if(r){
            response(context, 200, r);                            
          }                          
          else{
            response(context, 200, {message: "Invalid data."});
          }
        });
      } else 
      {
        response(context, 404, {error: 404,message: "Invalid data."});
      }
    }catch(e){}
  } 
}

API.methods["upcomingTournamentsOfOrganizer"] = {
  GET: function(context, connection){
    try{
      var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
      if (hasQuery) 
      {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PupcomingTournamentsOfOrganizer",caller,apiKey,connection.data.userId,function(e,r){
          if(r){
            response(context, 200, r);               
          }                          
          else{
            response(context, 200, {message: "Invalid data."});
          }
        });
      } 
      else 
      {
        response(context, 404, {error: 404, message: "Invalid data."});
      }
    }catch(e){}
  } 
}

API.methods["pastTournamentsOfOrganizer"] = {
  GET: function(context, connection){
    try{
      var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
      if (hasQuery) 
      {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PpastTournamentsOfOrganizer",caller,apiKey,connection.data.userId,function(e,r){                      
          if(r){
            response(context, 200, r);                 
          } 
          else{
            response(context, 200, {message: "Invalid data."});
          }
        });
      } 
      else 
      {
        response(context, 404, {error: 404,message: "Invalid data."});
      }
    }catch(e){}
  } 
}

API.methods["createTournamentViaApp"]={
  POST: function(context, connection) {
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PcreateTournamentViaApp",caller,apiKey,connection.data.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not create tournament"})
          }
          else
          {
            if(result)
              response(context, 200,{message: "tournament created"});        
            else
              response(context,200,{message: "could not create tournament"})
          } 
        });                                                  
      }       
    }catch(e){}
  }
}

API.methods["editTournament"]={
  POST: function(context, connection) {
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                  
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PeditTournament",caller,apiKey,connection.data.data,function(error,result){
          if(error)
          {
            response(context,200,{message: "could not edit tournament"})
          }
          else
          {
            if(result)
              response(context, 200,{message: "tournament modified"});        
            else
              response(context,200,{message: "could not edit tournament"})
          } 
        });                                                  
      }       
    }catch(e){}
  }
}

API.methods["deleteTournament"] = {
  POST: function(context, connection) {
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                     
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PdeleteTournament",caller,apiKey,connection.data.eventId,function(error,result){
          if(error)
          {
            response( context, 404, { error: 404, message: "Invalid data."});
          }
          else
          {
            if(result)
              response(context, 200,{message: "Tournament Deleted"}); 
            else
              response(context, 200,{message: "Could not delete tournament"}); 
          }                    
        });                                                    
      }       
    }catch(e){
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}

API.methods["downloadConsolidatedSubscribers"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      Meteor.call("PdownloadConsolidatedSubscribers",caller,apiKey,connection.data.eventId,connection.data.userId,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}

API.methods["downloadConsolidatedSubscribers_Team"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      Meteor.call("PdownloadConsolidatedSubscribers_Team",caller,apiKey,connection.data.eventId,connection.data.userId,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}



 

 API.methods["analyticsSummary"] = {
  POST: function(context, connection) {
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                     
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PanalyticsSummary",caller,apiKey,connection.data.data,function(error,result){
          if(error)
          {
            response( context, 404, { error: 404, message: "Invalid data."});
          }
          else
          {
              response(context, 200,result);            
          }                    
        });                                                    
      }       
    }catch(e){
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["fetchMatchDates"] = {
  POST: function(context, connection) {
    try
    {
            var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {                     
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PfetchMatchDates",caller,apiKey,function(error,result){
          if(error)
          {
            response( context, 404, { error: 404, message: "Invalid data"});
          }
          else
          {
              response(context, 200,result);            
          }                    
        });                                                    
      }       
    }catch(e){
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["pastTournamentsOnApiKey"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      var location = undefined;
      if(connection.data.location)
       location = connection.data.location;
      Meteor.call("PpastTournamentsOnApiKey",caller,apiKey,location,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}

API.methods["pastTournamentsIDOnApiKey"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      var location = undefined;
      if(connection.data.location)
       location = connection.data.location;
      Meteor.call("PpastTournamentsIDOnApiKey",caller,apiKey,location,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["resultSummary"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      Meteor.call("PresultSummary",caller,apiKey,connection.data,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}





API.methods["resultSummaryInHaul"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      Meteor.call("PresultSummaryInHaul",caller,apiKey,connection.data,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}




API.methods["getEventCategoriesOfTourn"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      Meteor.call("PgetEventCategoriesOfTourn",caller,apiKey,connection.data.tournamentId,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["pastTournamentDetailsOnApiKey"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;      
      Meteor.call("PpastTournamentDetailsOnApiKey",caller,apiKey,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}


API.methods["upcomingTournamentDetailsOnApiKey"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;      
      Meteor.call("PupcomingTournamentDetailsOnApiKey",caller,apiKey,connection.data.userId,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}



API.methods["fetchResultsOfOrganizerTournaments"] = {
  GET: function(context, connection){
    try{
      var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
      if (hasQuery) 
      {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;

        Meteor.call("PfetchResultsOfOrganizerTournaments",caller,apiKey,function(e,r){
          if(r){
            response(context, 200, r);                            
          }                          
          else{
            response(context, 200, {message: "Invalid data."});
          }
        });
      } else 
      {
        response(context, 404, {error: 404,message: "Invalid data."});
      }
    }catch(e){}
  } 
}




API.methods["fetchTournamentTeamFormats"] = {
  GET: function(context, connection){
    try{
      var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
      if (hasQuery) 
      {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        var tournamentId = connection.data.tournamentId;

        Meteor.call("PfetchTournamentTeamFormats",caller,apiKey,tournamentId,function(e,r){
          if(r){
            response(context, 200, r);                            
          }                          
          else{
            response(context, 200, {message: "Invalid data."});
          }
        });
      } else 
      {
        response(context, 404, {error: 404,message: "Invalid data."});
      }
    }catch(e){}
  } 
}



API.methods["fetchDrawEvents"] = {
  GET: function(context, connection){
    try{
      var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
      if (hasQuery) 
      {
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        var tournamentId = connection.data.tournamentId;

        Meteor.call("PfetchDrawEvents",caller,apiKey,tournamentId,function(e,r){
          if(r){
            response(context, 200, r);                            
          }                          
          else{
            response(context, 200, {message: "Invalid data."});
          }
        });
      } else 
      {
        response(context, 404, {error: 404,message: "Invalid data."});
      }
    }catch(e){}
  } 
}




API.methods["organizerTournamentsOnApiKey"] = {
  GET: function( context, connection ){
    try
    {
      var caller = connection.data.caller;
      var apiKey = connection.data.apiKey;
      var location = undefined;
      var year = undefined;

      if(connection.data.location)
       location = connection.data.location;
      if(connection.data.year)
        year = connection.data.year;

      Meteor.call("PorganizerTournamentsOnApiKey",caller,apiKey,location,year,function(error,result){
        if(result)
          response( context, 200, result );
        else
          response( context, 404, { error: 404, message: "No users found." } );
      });
    }
    catch(e)
    {
      response( context, 404, { error: 404, message: "Invalid data." } );
    }
  }
}

/**************************** association based api ****************************/

//fetchDA



API.methods["fetchDA"]={
  POST: function(context, connection) {
    try
    {
      var hasdata = (connection && connection.data) ? true : false;
      if (hasdata) 
      {               
        var caller = connection.data.caller;
        var apiKey = connection.data.apiKey;
        Meteor.call("PfetchDA",caller,apiKey,function(error,result){
          if(result)
            response( context, 200, result );
          else
            response( context, 404, { error: 404, message: "could not fetch district association" } );

         
        });                                                  
      }       
    }catch(e){}
  }
}