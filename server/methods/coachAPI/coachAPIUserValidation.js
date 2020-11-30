import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Meteor.methods({
    //coach
    PsendConnectionRequest:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("sendConnectionRequest",data));
            }
            
        }catch(e){
        }
    },


    PgetSentConnectionDetailsToPlayers:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          else{

            var xDATA = data.replace("\\", "");
            data = JSON.parse(xDATA);
          return (Meteor.call("getSentConnectionDetailsToPlayers",data));
          }
        }catch(e){  
        }
    },
    PgetSentConnectionDetailsToCoachByPlayers:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          else{

            var xDATA = data.replace("\\", "");
            data = JSON.parse(xDATA);
          return (Meteor.call("getSentConnectionDetailsToCoachByPlayers",data));
          }
        }catch(e){  
        }
    },
    PgetSentConnectionDetailsToCoachByCoach:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          else{

            var xDATA = data.replace("\\", "");
            data = JSON.parse(xDATA);
          return (Meteor.call("getSentConnectionDetailsToCoachByCoach",data));
          }
        }catch(e){  
        }
    },
    PgetSentConnectionDetailsToCoachPlayerByCoach:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          else{

            var xDATA = data.replace("\\", "");
            data = JSON.parse(xDATA);
          return (Meteor.call("getSentConnectionDetailsToCoachPlayerByCoach",data));
          }
        }catch(e){  
        }
    },
    PgetDetailsOfReceivedConnectionReq:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          else{

            var xDATA = data.replace("\\", "");
            data = JSON.parse(xDATA);
          return (Meteor.call("getDetailsOfReceivedConnectionReq",data));
          }
        }catch(e){  
        }
    },
    PacceptConnectionRequest:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("acceptConnectionRequest",data));
            }
            
        }catch(e){
        }
    },
    PrejectConnectionRequest:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("rejectConnectionRequest",data));
            }
            
        }catch(e){
        }
    },

    PdeleteConnectionRequest:function(caller,apiKey,data,param){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("deleteConnectionRequest",data,param));
            }
            
        }catch(e){
        }
    },

    
    PcreateCoachConnectedGroup:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("createCoachConnectedGroup",data));
            }
            
        }catch(e){
        }
    },
    PgetConnectedMembersToCreateGroup:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getConnectedMembersToCreateGroup",data));
            }
            
        }catch(e){

        }
    },

    PgetCoachGroups:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getCoachGroups",data));
            }
            
        }catch(e){
        }
    },


    PgroupDetailsOfCoach:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("groupDetailsOfCoach",data));
            }
            
        }catch(e){
        }
    },
    PupdateCoachConnectedGroup:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("updateCoachConnectedGroup",data));
            }
            
        }catch(e){
        }
    },
    PupdateCoachGroupName:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("updateCoachGroupName",data));
            }
            
        }catch(e){
        }
    },
    
    PdeleteGroupMemberFromCoach:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("deleteGroupMemberFromCoach",data));
            }
            
        }catch(e){
        }
    },
    PgetConnectedMembersForGivenPlayerID:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getConnectedMembersForGivenPlayerID",data));
            }
            
        }catch(e){
        }
    },
    PdeleteConnectionRequestSentByLoggedInId:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("deleteConnectionRequestSentByLoggedInId",data));
            }
            
        }catch(e){
        }
    },
    PdeleteAllConnectionReqReceivedByLoggedInId:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("deleteAllConnectionReqReceivedByLoggedInId",data));
            }
            
        }catch(e){
        }
    },
    PsendTextMessageToPlayerByCoach:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("sendTextMessageToPlayerByCoach",data));
            }
        }catch(e){
        }
    },
    PgetInboxMessagesForLoggedInId:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getInboxMessagesForLoggedInId",data));
            }
            
        }catch(e){
        }
    },

    //here
    PregisterOtpForCoach:function(caller,apiKey,data)
    {
        try
        {
          if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
         
          if(data && data.emailIdOrPhone == "1"){
            return (Meteor.call("registerOtpGeneralized",data.emailId,data.emailIdOrPhone));
          }
          else if(data && data.emailIdOrPhone == "2"){
            return (Meteor.call("registerOtpGeneralized",data.emailId,data.emailIdOrPhone));
          }
          
        }catch(e){} 
    },
    PfetchProfileSettingsForCoach:function(caller,apiKey,data)
    {
        try
        {
          if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
         
          return (Meteor.call("fetchProfileSettingsForCoachAPI",data));
        }catch(e){} 

        
    },
});
