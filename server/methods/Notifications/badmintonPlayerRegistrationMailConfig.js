userDetailsBT.after.insert(function (userId, doc) {
	try{
		if(doc)
		{
			data = doc;
            var smsTemplate = "";
            var smsData = {};

        	var entryExists = userDetailsBT.findOne({"_id":doc._id});
        	if(entryExists)
        	{   	
        	    var registeredID = entryExists.userId;
	
        		var htmlTemplate = "sendRegisterationEmailToPlayer";        		       	
                //var smsTemplate =  "Hi "+entryExists.userName+". Welcome to iPlayOn,Thanks for registering.. You are registered as "+entryExists.role+"!!";

                smsData = {};
                smsData["type"] = "roleRegister";
                smsData["userName"] = entryExists.userName;
                smsData["role"] = entryExists.role;


        		var css = Assets.getText('style.css');  
        		var dataContext;              
                SSR.compileTemplate('sendRegisterationEmailToPlayer', Assets.getText('otherUsersRegistrationTemplate.html'));
                Template.sendRegisterationEmailToPlayer.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    },                                              
                });

                if(entryExists.affiliatedTo && entryExists.affiliatedTo == "other")
                {
                	dataContext = {
	                    message: "Welcome,"+entryExists.userName,
	                    academyPersonName: entryExists.userName,
	                    academyName: entryExists.userName,//assoc name
	                    imageURL:Meteor.absoluteUrl(),
	                    role:entryExists.role,
	                    type:false
               		}
                    smsData = {};
                    smsData["type"] = "roleRegister";
                    smsData["userName"] = entryExists.userName;
                    smsData["role"] = entryExists.role;

                    //smsTemplate =  "Hi "+entryExists.userName+". Welcome to iPlayOn,Thanks for registering.. You are registered as "+entryExists.role+"!!";

                }
                else if(entryExists.affiliatedTo && (
                	entryExists.affiliatedTo == "academy" || 
                	entryExists.affiliatedTo == "stateAssociation" ||
                	entryExists.affiliatedTo == "districtAssociation"))
                {

                	var affiliationInfo = false;
                	var affiliationName = "";
                	if(entryExists.affiliatedTo == "academy" && entryExists.clubNameId)
                		affiliationInfo = academyDetails.findOne({"userId":entryExists.clubNameId});
                	if(entryExists.associationId && (entryExists.affiliatedTo == "stateAssociation" ||
                	entryExists.affiliatedTo == "districtAssociation"))
                		affiliationInfo = associationDetails.findOne({"userId":entryExists.associationId});


                	if(affiliationInfo)
                	{
                		if(entryExists.affiliatedTo == "academy")
                			affiliationName = affiliationInfo.clubName;
                		else
                			affiliationName = affiliationInfo.associationName;

                		dataContext = {
		                    message: "Welcome,"+entryExists.userName,
		                    academyPersonName: entryExists.userName,
		                    academyName: entryExists.userName,//assoc name
		                    imageURL:Meteor.absoluteUrl(),
		                    role:entryExists.role,
		                    type:false,
		                    "affiliatedTo":affiliationName
               			}

                        smsData = {};
                        smsData["type"] = "roleRegister";
                        smsData["userName"] = entryExists.userName;
                        smsData["role"] = entryExists.role;
                        smsData["affiliationName"] = affiliationName;

                        //smsTemplate =  "Hi "+entryExists.userName+". Welcome to iPlayOn,Thanks for registering.. You are registered as "+entryExists.role+" and affiliated to "+affiliationName;

                	}
                }
 				
                

                var html_string = SSR.render('sendRegisterationEmailToPlayer', dataContext);
                var toAddress = "";
                if(entryExists.emailAddress)
                	toAddress = entryExists.emailAddress;
                else if(entryExists.phoneNumber)
                	toAddress = entryExists.phoneNumber;   

                var options = {
                    from: "iplayon.in@gmail.com",
                    to:toAddress,
                    subject: "Welcome,"+entryExists.userName,
                    html: html_string
                }
                smsTemplate = Meteor.call("fetchSMSTemplate",smsData);

                Meteor.call("sendSMSEmailNotification",registeredID,smsTemplate,options,[],function(error,result){
                                   
               });               	
        	}
		}
	}catch(e){
	}
});

userDetailsBT.after.update(function(userId, doc, fieldNames, modifier, options){
	try{
		if(doc)
		{
            var smsTemplate = "";
            var smsData = {};
			data = doc;
			var pos = fieldNames.indexOf("associationId");

        	var entryExists = userDetailsBT.findOne({"_id":doc._id});
        	if(entryExists && pos > -1)
        	{   	
        	    var registeredID = entryExists.userId;
	
        		var htmlTemplate = "sendRegisterationEmailToPlayer";        		       	
                //var smsTemplate =  "Hi "+entryExists.userName+". Welcome to iPlayOn,Thanks for registering.. You are registered as "+entryExists.role+"!!";

        		var css = Assets.getText('style.css');                
                SSR.compileTemplate('sendRegisterationEmailToPlayer', Assets.getText('otherUsersRegistrationTemplate.html'));
                Template.sendRegisterationEmailToPlayer.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    },                                              
                });

                if(entryExists.affiliatedTo && (
                	entryExists.affiliatedTo == "academy" || 
                	entryExists.affiliatedTo == "stateAssociation" ||
                	entryExists.affiliatedTo == "districtAssociation"))
                {
                	var affiliationInfo = false;
                	var affiliationName = "";
                	if(entryExists.affiliatedTo == "academy" && entryExists.clubNameId)
                		affiliationInfo = academyDetails.findOne({"userId":entryExists.clubNameId});
                	if(entryExists.associationId && (entryExists.affiliatedTo == "stateAssociation" ||
                	entryExists.affiliatedTo == "districtAssociation"))
                		affiliationInfo = associationDetails.findOne({"userId":entryExists.associationId});

                	if(affiliationInfo)
                	{
                		if(entryExists.affiliatedTo == "academy")
                			affiliationName = affiliationInfo.clubName;
                		else
                			affiliationName = affiliationInfo.associationName;
                		dataContext = {
		                    message: "Welcome,"+entryExists.userName,
		                    academyPersonName: entryExists.userName,
		                    academyName: entryExists.userName,//assoc name
		                    imageURL:Meteor.absoluteUrl(),
		                    role:entryExists.role,
		                    type:true,
		                    "affiliatedTo":affiliationName
               			}

                        smsData = {};
                        smsData["type"] = "roleAffiliated";
                        smsData["userName"] = entryExists.userName;
                        smsData["role"] = entryExists.role;
                        smsData["affiliationName"] = affiliationName;

               			//smsTemplate =  "Hi "+entryExists.userName+". Welcome to iPlayOn, You are affiliated to "+affiliationName+"";

                	}
                }

               
                var html_string = SSR.render('sendRegisterationEmailToPlayer', dataContext);
                var toAddress = "";
                if(entryExists.emailAddress)
                	toAddress = entryExists.emailAddress;
                else if(entryExists.phoneNumber)
                	toAddress = entryExists.phoneNumber;   

                var options = {
                    from: "iplayon.in@gmail.com",
                    to:toAddress,
                    subject: "Welcome,"+entryExists.userName,
                    html: html_string
                }
           
                smsTemplate = Meteor.call("fetchSMSTemplate",smsData);

                Meteor.call("sendSMSEmailNotification",registeredID,smsTemplate,options,[],function(error,result){
                    
                    
               });               	
        	}
		}
	}catch(e){
	}
});
