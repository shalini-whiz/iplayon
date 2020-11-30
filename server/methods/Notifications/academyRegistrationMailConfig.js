academyDetails.after.insert(function (userId, doc) {
	try{
		if(doc)
		{
			data = doc;
        	var entryExists = academyDetails.findOne({"_id":doc._id});
        	if(entryExists)
        	{   	
        	    var registeredID = entryExists.userId;
				var dataContext;
                var smsData = {};
				var smsTemplate = "";
				var html_string = "";
        		var htmlTemplate = "sendRegisterationEmailToAcademy";        		       	

        		var css = Assets.getText('style.css');                
               
                if(entryExists.affiliatedTo == "other")
                {

                    smsData = {};
                    smsData["type"] = "roleRegister";
                    smsData["userName"] = entryExists.clubName;
                    smsData["role"] = entryExists.role;

                	//smsTemplate =  "Hi "+entryExists.clubName+". Welcome to iPlayOn,Thanks for registering.. You are registered as an Academy!!";

                	SSR.compileTemplate('academyRegistrationTemplate', Assets.getText('academyRegistrationTemplate.html'));
	                Template.academyRegistrationTemplate.helpers({
	                    getDocType: function() {
	                        return "<!DOCTYPE html>";
	                    },                                              
	                });

                	dataContext = {
	                    message: "Welcome,"+entryExists.clubName,
	                    academyPersonName: entryExists.clubName,
	                    academyName: entryExists.clubName,//assoc name
	                    imageURL:Meteor.absoluteUrl(),
	                    "type":false

               		}
               		html_string = SSR.render('academyRegistrationTemplate', dataContext);
                }
                else if(entryExists.affiliatedTo == "districtAssociation" || entryExists.affiliatedTo == "stateAssociation")
                {

                	SSR.compileTemplate('academyRegistrationByAssocTemplate', Assets.getText('academyRegistrationByAssocTemplate.html'));
	                Template.academyRegistrationByAssocTemplate.helpers({
	                    getDocType: function() {
	                        return "<!DOCTYPE html>";
	                    },                                              
	                });

                	var associationInfo  = associationDetails.findOne({"userId":entryExists.associationId})
                	if(associationInfo)
                	{
                		//smsTemplate =  "Hi "+entryExists.clubName+". Welcome to iPlayOn,Thanks for registering.. You are registered as an Academy by "+associationInfo.associationName+"";

                        smsData = {};
                        smsData["type"] = "roleRegister";
                        smsData["userName"] = entryExists.clubName;
                        smsData["role"] = entryExists.role;
                        smsData["affiliationName"] = associationInfo.associationName;


                		dataContext = {
							message: "Welcome,"+entryExists.clubName,
							academyPersonName: entryExists.clubName,
							academyName: entryExists.clubName,
							associationName:associationInfo.associationName,
							//password:Session.get("academyEmailPasswordSess"),
							imageURL:Meteor.absoluteUrl(),
							"type":false

						}
                	}
                	html_string = SSR.render('academyRegistrationByAssocTemplate', dataContext);

                	
                }
                


                smsTemplate = Meteor.call("fetchSMSTemplate",smsData);   

                var options = {
                    from: "iplayon.in@gmail.com",
                    subject: "Welcome,"+entryExists.clubName,
                    html: html_string
                }
           
                Meteor.call("sendSMSEmailNotification",registeredID,smsTemplate,options,[],function(error,result){
                                  
                });               	
        	}
		}
	}catch(e){
	}
});

academyDetails.after.update(function(userId, doc, fieldNames, modifier, options) 
{
	try{
		if(doc)
		{
			data = doc;
        	var pos = fieldNames.indexOf("associationId");

        	var entryExists = academyDetails.findOne({"_id":doc._id});
        	if(entryExists && pos > -1)
        	{   	
        	    var registeredID = entryExists.userId;
				var dataContext;
                var smsData = {};
				var smsTemplate = "";
				var html_string = "";
        		var htmlTemplate = "sendRegisterationEmailToAcademy";        		       	

        		var css = Assets.getText('style.css');                
               
                
                if(entryExists.affiliatedTo == "districtAssociation" || entryExists.affiliatedTo == "stateAssociation")
                {

                	SSR.compileTemplate('academyRegistrationByAssocTemplate', Assets.getText('academyRegistrationByAssocTemplate.html'));
	                Template.academyRegistrationByAssocTemplate.helpers({
	                    getDocType: function() {
	                        return "<!DOCTYPE html>";
	                    },                                              
	                });

                	var associationInfo  = associationDetails.findOne({"userId":entryExists.associationId})
                	if(associationInfo)
                	{
                		//smsTemplate =  "Hi "+entryExists.clubName+". Welcome to iPlayOn, You are affiliated to "+associationInfo.associationName+"";


                        smsData = {};
                        smsData["type"] = "roleAffiliated";
                        smsData["userName"] = entryExists.clubName;
                        smsData["role"] = entryExists.role;
                        smsData["affiliationName"] = associationInfo.associationName;


                		dataContext = {
							message: "Welcome,"+entryExists.clubName,
							academyPersonName: entryExists.clubName,
							academyName: entryExists.clubName,
							associationName:associationInfo.associationName,
							//password:Session.get("academyEmailPasswordSess"),
							imageURL:Meteor.absoluteUrl(),
							"type":true
						}
                	}
                	html_string = SSR.render('academyRegistrationByAssocTemplate', dataContext);

                	
                }
                


                    	                                       
                var options = {
                    from: "iplayon.in@gmail.com",
                    subject: "Welcome,"+entryExists.clubName,
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