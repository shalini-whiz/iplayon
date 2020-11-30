//sendRegisterationEmailToAssociation



associationDetails.after.insert(function (userId, doc) {
	try{
		if(doc)
		{
			data = doc;
        	var entryExists = associationDetails.findOne({"_id":doc._id});
            var smsData = {};
            var smsTemplate = "";
        	if(entryExists)
        	{   	
        	    var registeredID = entryExists.userId;
	
        		var htmlTemplate = "sendRegisterationEmailToAssociation";
        		//var smsTemplate = "";


                if(entryExists.associationType)
                {
                    var dataContext = {
                        message: "Welcome,"+entryExists.associationName,
                        academyPersonName: entryExists.associationName,
                        academyName: entryExists.associationName,//assoc name
                        imageURL:Meteor.absoluteUrl()
                    }

                    if(entryExists.associationType.trim() == "State/Province/County")
                    {
                        //smsTemplate =  "Hi "+entryExists.associationName+" .Welcome to iPlayOn,Thanks for registering.. You are registered as Association";
                        smsData = {};
                        smsData["type"] = "roleRegister";
                        smsData["userName"] = entryExists.associationName;
                        smsData["role"] = entryExists.role;

                    }
                    else if(entryExists.associationType.trim() == "District/City")
                    {

                        if(entryExists.affiliatedTo && entryExists.affiliatedTo.trim() == "stateAssociation" && entryExists.parentAssociationId)
                        {
                            var associationInfo = associationDetails.findOne({"_id":entryExists.parentAssociationId});
                            if(associationInfo)
                            {
                                dataContext["affiliatedTo"] = associationInfo.associationName;
                                //smsTemplate =  "Hi "+entryExists.associationName+" .Welcome to iPlayOn,You are registered as District Assocation and affiliatedTo "+associationInfo.associationName;
                                smsData = {};
                                smsData["type"] = "roleRegister";
                                smsData["userName"] = entryExists.associationName;
                                smsData["role"] = "District Association";
                                smsData["affiliationName"] = associationInfo.associationName;

                            }
                            else
                            {

                                //smsTemplate =  "Hi "+entryExists.associationName+" .Welcome to iPlayOn,Thanks for registering.. You are registered as District Association and affiliated to State Association";
                                smsData = {};
                                smsData["type"] = "roleRegister";
                                smsData["userName"] = entryExists.associationName;
                                smsData["role"] = "District Association";
                                smsData["affiliationName"] = "State Association";

                            }

                        }   
                        else if(entryExists.affiliatedTo && entryExists.affiliatedTo.trim() == "other")
                        {
                            //smsTemplate =  "Hi "+entryExists.associationName+" .Welcome to iPlayOn,Thanks for registering.. You are registered as District Assocation";
                            smsData = {};
                            smsData["type"] = "roleRegister";
                            smsData["userName"] = entryExists.associationName;
                            smsData["role"] = "District Association";
                        }

                    }
                    var css = Assets.getText('style.css');                
                    SSR.compileTemplate('associationRegistrationTemplate', Assets.getText('associationRegistrationTemplate.html'));

                    Template.associationRegistrationTemplate.helpers({
                        getDocType: function() {
                            return "<!DOCTYPE html>";
                        },                                              
                    });

                   

                }
        		

        	

                var html_string = SSR.render('associationRegistrationTemplate', dataContext);
                    	                                       
                var options = {
                    from: "iplayon.in@gmail.com",
                    subject: "Welcome,"+entryExists.associationName,
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

associationDetails.after.update(function(userId, doc, fieldNames, modifier, options) 
{
    try{
        if(doc)
        {
            data = doc;
            var smsTemplate = "";
            var smsData = {};

            var pos = fieldNames.indexOf("affiliatedTo");
            var entryExists = associationDetails.findOne({"_id":doc._id});
            if(pos > -1 && entryExists)
            {
               
                var registeredID = entryExists.userId;

                if(entryExists.associationType && entryExists.associationType == "District/City" &&  entryExists.affiliatedTo == "stateAssociation")
                {
                    if(entryExists.affiliatedTo && entryExists.affiliatedTo == "stateAssociation" && entryExists.parentAssociationId)
                    {
                        var dataContext = {
                            message: "Welcome,"+entryExists.associationName,
                            academyPersonName: entryExists.associationName,
                            academyName: entryExists.associationName,//assoc name
                            imageURL:Meteor.absoluteUrl(),
                            "type":true,                         
                        }

                        var associationInfo = associationDetails.findOne({"userId":entryExists.parentAssociationId});
                        if(associationInfo)
                        {
                            dataContext["affiliatedTo"] = associationInfo.associationName;
                            //smsTemplate =  "Hi "+entryExists.associationName+". Welcome to iPlayOn, You are affiliated to "+associationInfo.associationName+"";
                            smsData = {};
                            smsData["type"] = "roleAffiliated";
                            smsData["userName"] = entryExists.associationName;
                            smsData["role"] = "District Association";
                            smsData["affiliationName"] = associationInfo.associationName;
                        }
                        else
                        {

                            //smsTemplate =  "Hi "+entryExists.associationName+". Welcome to iPlayOn, You are affiliated to State Association";
                            smsData = {};
                            smsData["type"] = "roleAffiliated";
                            smsData["userName"] = entryExists.associationName;
                            smsData["role"] = "District Association";
                            smsData["affiliationName"] = "State Association";
                        }

                        var css = Assets.getText('style.css');                
                        SSR.compileTemplate('associationRegistrationTemplate', Assets.getText('associationRegistrationTemplate.html'));

                        Template.associationRegistrationTemplate.helpers({
                            getDocType: function() {
                                return "<!DOCTYPE html>";
                            },                                              
                        });


                        var html_string = SSR.render('associationRegistrationTemplate', dataContext);
                                                               
                        var options = {
                            from: "iplayon.in@gmail.com",
                            subject: "Welcome,"+entryExists.associationName,
                            html: html_string
                        }
               
                        smsTemplate = Meteor.call("fetchSMSTemplate",smsData);
                        Meteor.call("sendSMSEmailNotification",registeredID,smsTemplate,options,[],function(error,result){
                            
                            
                       });    

                    }
                          
                }
            }
        }
    }catch(e)
    {
    }
});



