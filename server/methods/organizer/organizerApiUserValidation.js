import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Meteor.methods({

    PgetTournamentCreationDetails:function(caller,apiKey,userId)
    {

    	try{
    		if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
	        return;
	    }        
            return (Meteor.call("getTournamentCreationDetails",userId));
    	}catch(e){	
    	}
    },
    PcreateTournamentViaApp:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
        }
        data = data.replace("\\", "");
        var customData = JSON.parse(data);
        return (Meteor.call("createTournamentViaApp",customData.xData,customData.subscribRest,customData.LdataToSaveFromDOB));
        
        }catch(e){
        }
    },
    PeditTournament:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){

            return;
        }

        data = data.replace("\\", "");

        var customData = JSON.parse(data);

        return (Meteor.call("updateEvents",customData,true));
        
        }catch(e){
        }
    },
    PupcomingTournamentsOfOrganizer:function(caller,apiKey,userId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("upcomingTournamentsOfOrganizer",userId));

        }catch(e){

        }
    },

    PpastTournamentsOfOrganizer:function(caller,apiKey,userId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("pastTournamentsOfOrganizer",userId));

        }catch(e){

        }
    },
    PorganizerTournaments:function(caller,apiKey,userId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("organizerTournaments",userId));

        }catch(e){

        }
    },
    PupcomingTournamentsOnApiKey:function(caller,apiKey,locationId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("upcomingTournamentsOnApiKey",apiKey,locationId));

        }catch(e){

        }
    },
    PpastTournamentsOnApiKey:function(caller,apiKey,locationId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("pastTournamentsOnApiKey",apiKey,locationId));

        }catch(e){

        }
    },

    PpastTournamentsIDOnApiKey:function(caller,apiKey,locationId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("pastTournamentsIDOnApiKey",apiKey,locationId));

        }catch(e){

        }
    },


    PdeleteTournament:function(caller,apiKey,tournamentId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("deleteEvents",tournamentId));
        }catch(e){

        }
    },
    PfetchMatchDates:function(caller,apiKey)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("fetchMatchDates",caller,apiKey));
        }catch(e){

        }
    },

    PresultSummary:function(caller,apiKey,data)
    {
        try{

            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("resultSummary",data.tournamentId,data.eventName));
        }catch(e){

        }
    },
    PresultSummaryInHaul:function(caller,apiKey,data){
        try{

            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("resultSummaryInHaul",data.tournamentId,data.eventName));
        }catch(e){

        }
    },
    PgetEventCategoriesOfTourn:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("getEventCategoriesOfTourn",data));
        }catch(e){


        }
    },

    PpastTournamentDetailsOnApiKey:function(caller,apiKey)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("pastTournamentDetailsOnApiKey",apiKey));

        }catch(e){

        }
    },
    PupcomingTournamentDetailsOnApiKey:function(caller,apiKey,userId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("upcomingTournamentDetailsOnApiKey",apiKey,userId));

        }catch(e){

        }
    },
    PfetchResultsOfOrganizerTournaments:function(caller,apiKey)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("fetchResultsOfOrganizerTournaments",caller,apiKey));

        }catch(e){

        }
    },
    PfetchTournamentTeamFormats:function(caller,apiKey,tournamentId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("fetchTournamentTeamFormats",caller,apiKey,tournamentId));

        }catch(e){

        }
    },
    PfetchDrawEvents:function(caller,apiKey,tournamentId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("fetchDrawEvents",tournamentId));

        }catch(e){

        }
    },
    PorganizerTournamentsOnApiKey:function(caller,apiKey,locationId,year)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            return (Meteor.call("organizerTournamentsOnApiKey",apiKey,locationId,year));

        }catch(e){

        }
    },
    PfetchDA:function(caller,apiKey)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
               return;
            }
            var apiKeyInfo = apiUsers.findOne({"apiKey":apiKey.trim()});
            if(apiKeyInfo && apiKeyInfo.userId)
                return (Meteor.call("fetchDA",apiKeyInfo.userId));

        }catch(e){

        }
    },
});
