/**
 * Meteor Method to send email
 * 
 *
 */
 // **emailaddress**
Meteor.methods({
	'codeVerification' : function(lData) {
		
	 try
	 {
		// Check the input
		check(lData, Object);
		
		/** Check if verification codes are matching 
		 *  or not
		 */ 
		
		// Get the actual verification code
		// for the given user-id
		var user=userOtp.find({"emailAddress":lData.emailAddress}).fetch();
		
		// Compare the otp and Verification code
		var actualOtp=user[0].otp;
		
		
		
		if(actualOtp==lData.verificationCode)
		{
			// Set the new password
			//Accounts.setPassword(lData.userId,lData.password);
			/**var responseFromSendEmail = Meteor.users.update({"userId":lData.userId},{$set:{
				"password":lData.password
				}},{ upsert: true });**/
			
			// Remove the otp
			userOtp.update(
					   { "emailAddress": lData.emailAddress },
					   { $unset: { otp: ""} }
					);
			
			return true;
		}
		else
		{
			return false;
		}
	}
	catch(e)
	{
		return false
	}

  }
});


Meteor.methods({
	'getVFCode' : function() {
		var dataToret = "1";
		customCollection.find({}).fetch().forEach(function(e,i){
			if(e.data2&&e.data2!=undefined){
				dataToret = e.data2
			}
			else{
				return undefined
			}
		});
		return dataToret;
	}
})