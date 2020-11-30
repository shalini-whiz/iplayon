import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Meteor.methods({

	PfetchNonConnectionUsers:function(caller,apiKey,userId){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchNonConnectionUsers",userId));
            }
            
        }catch(e){
        }
    },
    PfetchNonConnectionUsersForPlayer:function(caller,apiKey,userId){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchNonConnectionUsersForPlayer",userId));
            }
            
        }catch(e){
        }
    },

   PgetMyGroups:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getMyGroups",data));
            }
            
        }catch(e){
        }
    },

    PviewUserProfile:function(caller,apiKey,userId){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("viewUserProfile",userId));
            }
            
        }catch(e){
        }
    },
    PgetDetailsOfReceivedNSentConnection:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          else{
            if(typeof data == "string"){
                var  data = data.replace("\\", "");
                data = JSON.parse(data);
            }
          return (Meteor.call("getDetailsOfReceivedNSentConnection",data));
          }
        }catch(e){  
        }
    },
    PdeleteGroupCoach:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          else{

           
          return (Meteor.call("deleteGroupCoach",data));
          }
        }catch(e){  
        }
    },

    PgetConnectedMembersInHaul:function(caller,apiKey,data)
    {
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          else{

           
          return (Meteor.call("getConnectedMembersInHaul",data));
          }
        }catch(e){  
        }
    },
    
    PfetchGroupDetailsOfCoach:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchGroupDetailsOfCoach",data));
            }
            
        }catch(e){

        }
    },
    PfetchThreadMessages:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchThreadMessages",data));
            }
            
        }catch(e){
        }
    },
   
    
    PdeleteThreadMessage:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("deleteThreadMessage",data));
            }
            
        }catch(e){
        }

    },

    

    PdeleteAllThreadMessage:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("deleteAllThreadMessage",data));
            }
            
        }catch(e){
        }

    },
    
    PcoachRegisterViaApp:function(caller,apiKey,data)
    {
        try
        {
          if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
            return;
          }
          return (Meteor.call("coachRegisterationViaApp",data));
        }catch(e){} 
    },
    PgetAssignments:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getAssignments",data));
            }
            
        }catch(e){
        }
    },
    PfetchThreadAssignments:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("fetchThreadAssignments",data));
            }
            
        }catch(e){
        }
    },
    PupdateAssignmentStatus:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("updateAssignmentStatus",data));
            }
            
        }catch(e){
        }
    },
    PgetAccountDetails:function(caller,apiKey,userId){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getAccountDetails",userId));
            }
            
        }catch(e){
        }
    },
    PsaveAccountDetails:function(caller,apiKey,data){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("saveAccountDetails",data));
            }
            
        }catch(e){
        }
    },
    PgetMyConnectedMem:function(caller,apiKey,userId){
        try{
            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getConnectedMembersInHaul",userId));
            }
            
        }catch(e){
        }
    },
    PgetAssignmentsInHaul:function(caller,apiKey,userId){
        try{

            if(apiUsers.findOne({"apiUser":caller}).apiKey != apiKey){
                return;
            }else{
                return (Meteor.call("getAssignmentsInHaul",userId));
            }
            
        }catch(e){
        }
    }

    

    

});