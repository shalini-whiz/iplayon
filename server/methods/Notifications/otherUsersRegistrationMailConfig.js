otherUsers.after.insert(function (userId, doc) {
	try{
		if(doc)
		{
			data = doc;
        	var entryExists = otherUsers.findOne({"_id":doc._id});
            var smsTemplate = "";
            var smsData = {};
        	if(entryExists)
        	{   	
        	    var registeredID = entryExists.userId;
	
        		var htmlTemplate = "otherUsersRegistrationTemplate";        		       	
                //var smsTemplate =  "Hi "+entryExists.userName+". Welcome to iPlayOn,Thanks for registering.. You are registered as an "+entryExists.role+"!!";

                smsData = {};
                smsData["type"] = "roleOtherRegister";
                smsData["userName"] = entryExists.userName;
                smsData["role"] = entryExists.role;

        		var css = Assets.getText('style.css');                
                SSR.compileTemplate('otherUsersRegistrationTemplate', Assets.getText('otherUsersRegistrationTemplate.html'));
                Template.otherUsersRegistrationTemplate.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    },                                              
                });

 				
                var dataContext = {
                    message: "Welcome,"+entryExists.userName,
                    academyPersonName: entryExists.userName,
                    academyName: entryExists.userName,//assoc name
                    imageURL:Meteor.absoluteUrl(),
                    role:entryExists.role
               	}


                var html_string = SSR.render('otherUsersRegistrationTemplate', dataContext);
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
