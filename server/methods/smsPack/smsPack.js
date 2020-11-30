Meteor.methods({

	"sendSMSEmailNotification":async function(userId,smsTemplate,emailTemplate,ccUserId)
	{
		try
		{
			if(userId != null && userId != "")
			{		
				var userExists = Meteor.users.findOne({"_id":userId.trim()});
				if(userExists)
				{
					if(userExists.verifiedBy)
					{
						
						if(userExists.verifiedBy.indexOf("email") > -1)
						{
							if(userExists.emailAddress)
							{
								if(emailTemplate.to == undefined)
									emailTemplate.to = userExists.emailAddress
								if(ccUserId.length > 0)
								{
									var raw = Meteor.users.rawCollection();
	      							var distinct = Meteor.wrapAsync(raw.distinct, raw);
	      							var validUserIdArr = distinct('emailAddress',{userId:{$in:ccUserId},
	      								//verifiedBy:"email"
	      							});
									emailTemplate.cc = validUserIdArr;
								}
								else
									emailTemplate.cc = "";

								
								var re = await Meteor.call("sendShareEmail", emailTemplate);
								try {
			                        if(re)
			                        	return "Mail sent";         

			                    }catch(e){
			                            return "Network issue, Cannot send email";         
			                    }
							}
							else if(userExists.emails[0] && userExists.emails[0].address)
							{
								if(emailTemplate.to == undefined)
									emailTemplate.to = userExists.emails[0].address
								if(ccUserId.length > 0)
								{
									var raw = Meteor.users.rawCollection();
	      							var distinct = Meteor.wrapAsync(raw.distinct, raw);
	      							var validUserIdArr = distinct('emailAddress',{userId:{$in:ccUserId},
	      								verifiedBy:"email"
	      							});
									emailTemplate.cc = validUserIdArr;
								}
								else
									emailTemplate.cc = ""


								var re = await Meteor.call("sendShareEmail", emailTemplate)
								try {
			                        if(re)
			                            return "Mail sent";         
			                        
			                    }catch(e){
			                    	return "Network issue, Cannot send email";
			                    }
							}
						}
						if(userExists.verifiedBy.indexOf("phone") > -1 && smsTemplate != "")
						{
							//send sms only
							if(userExists.phoneNumber == undefined || userExists.phoneNumber)
							{
								//ccUserId 
								var phoneNumber = "";
								if(userExists.phoneNumber)
									phoneNumber = userExists.phoneNumber;
								if(ccUserId.length > 0)
								{
									var raw = Meteor.users.rawCollection();
	      							var distinct = Meteor.wrapAsync(raw.distinct, raw);
									var validUserIdArr = distinct('phoneNumber',{userId:{$in:[ccUserId]}});

									if(validUserIdArr.length > 0)
										phoneNumber =  userExists.phoneNumber+","+validUserIdArr.toString();

								}

								/*

								const result = HTTP.call('GET', 'http://sms.fastsmsindia.com/api/sendhttp.php?', {
					                params: {
					                    authkey: "24185AXYFW4gRICoR5aa62b33",
					                    mobiles: phoneNumber,
					                    message: smsTemplate,
					                    sender: "fstsms",
					                    route: "6"

					                }
           						});
           						*/

           /*const result = HTTP.call('GET', 'http://103.16.101.52:8080/sendsms/bulksms?', {
                    params: {
                        username : "kap2-kapuser",
                        password : "trans321",
                        type : "0",
                        dlr : "1",
                        destination : ["7017404529","8126570432"] ,
                        source : "KAPMSG",
                        message : "Test Sms  time 18:40"
                     
                    }});*/
							
							
							}
						}
						
					}	
				}
			}
			return true;
		}catch(e)
		{
		}
	},
	"sendSMS":function(smsTemplate)
	{
		try{

			

            var stripedHtml = smsTemplate.replace(/<[^>]+>/g, '');
			var stripedHtml1 = stripedHtml.replace(/^\s*\n/gm, '');

		

			/*
			var result1 = HTTP.call('GET', 'http://sms.fastsmsindia.com/api/sendhttp.php?', {
                          params: {
                              authkey: "24185AXYFW4gRICoR5aa62b33",
                              mobiles: "7204797717",
                              message: stripedHtml1,
                              sender: "fstsms",
                              route: "6"

                          }
                      });
			
			*/



		}catch(e)
		{
		}
	}
})