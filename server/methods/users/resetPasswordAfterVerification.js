import {
    emailRegex
}
from '../dbRequiredRole.js'

Meteor.methods({
	'resetPasswordAfterVerification': function(lData) {

		try {
			// Check the input
			check(lData, Object);
			var userMeteor = ""

			if (lData.emailIdOrPhone && lData.emailIdOrPhone == "1") {
				userMeteor = Meteor.users.findOne({
					$or: [{
						"emailAddress": {
							$regex: emailRegex(lData.userId)
						},
						"emails.0.address": {
							$regex: emailRegex(lData.userId)
						}
					}]
				});
			} else if (lData.emailIdOrPhone && lData.emailIdOrPhone == "2") {
				userMeteor = Meteor.users.findOne({
					'phoneNumber': lData.userId
				})
			} else {
				userMeteor = Meteor.users.findOne({
					$or: [{
						"emailAddress": {
							$regex: emailRegex(lData.userId)
						},
						"emails.0.address": {
							$regex: emailRegex(lData.userId)
						}
					}]
				});
			}

			//var userMeteor=Meteor.users.findOne({emailAddress:lData.userId});
			if (userMeteor) {
				var result = Accounts.setPassword(userMeteor.userId, lData.password);
				return true
			} else{
				return false;
			}
		} catch (e) {
			return false
		}

	}
});

Meteor.methods({
	'getMeteorUserDetailsForEmailOrPhone': function(lData) {
		try{
			var userMeteor = ""
			if (lData && lData.emailIdOrPhone && lData.emailIdOrPhone == "1") {
				userMeteor = Meteor.users.findOne({
					$or: [{
						"emailAddress": {
							$regex: emailRegex(lData.userId)
						},
						"emails.0.address": {
							$regex: emailRegex(lData.userId)
						}
					}]
				});
			} else if (lData && lData.emailIdOrPhone && lData.emailIdOrPhone == "2") {
				userMeteor = Meteor.users.findOne({
					'phoneNumber': lData.userId
				})
			} else if(lData && lData.userId){
				userMeteor = Meteor.users.findOne({
					$or: [{
						"emailAddress": {
							$regex: emailRegex(lData.userId)
						},
						"emails.0.address": {
							$regex: emailRegex(lData.userId)
						}
					}]
				});
			}

			if(userMeteor){
				return userMeteor
			}
			else{
				return false
			}

		}catch(e){
			return false
		}
	}
})

Meteor.methods({
	checkPassword: function(digest) {
		try{
		check(digest, String);

		if (this.userId) {
			var user = Meteor.user();
			var password = {
				digest: digest,
				algorithm: 'sha-256'
			};
			var result = Accounts._checkPassword(user, password);
			return result;
		} else {
			return false;
		}
		}catch(e){
			errorLog(e)
		}
	}
});