import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


Meteor.methods({

    PallPastTournaments:function(caller,apiKey,userId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("allPastTournaments",userId));
            }
            
        }catch(e){
        }
    },
    PallUpcomingTournaments:function(caller,apiKey,userId)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("allUpcomingTournaments",userId));
            }
            
        }catch(e){
        }
    },

    PfetchDefaultMatchRecord:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchDefaultMatchRecord",data));
            }
            
        }catch(e){
        }
    },

    PemailMatchReport:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("emailMatchReport",data));
            }
            
        }catch(e){
        }
    },

    PfetchForLive:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchForLive",data));
            }
            
        }catch(e){
        }
    },
    PsetLiveScore:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("setLiveScore",data));
            }
            
        }catch(e){
        }
    },
    //setLiveStatus
    PsetLiveStatus:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("setLiveStatus",data));
            }
            
        }catch(e){
        }
    },


    PfetchTourTeamScore:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchTourTeamScore",data));
            }
            
        }catch(e){
        }
    },

    PcreateTeamPoints:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("createTeamPoints",data));
            }
            
        }catch(e){
        }
    }

});