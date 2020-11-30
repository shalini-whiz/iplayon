/**
 * Meteor Method to update users after change login id to FB
 * @collectionName : users
 * @dbQuery : update, find
 * @dataType : userId
 * @passedByValues : String
 * @methodDescription : find the users for the current Meteor.user().services.facebook.id
 *                      if the length is 0, update the userId, userName, emailAddress,
 *                      oAuthId, and profileSettingStauts to Meteor.userId(),
 *                      Meteor.user.services.facebook.name, Meteor.user().services.facebook.email,
 *                      Meteor.user().services.facebook.id, false respectively.
 *                      then remove the old oAuthId profile, then return true.
 *                      else if the passedby value is same as Meteor.user().services.facebook.id
 *                      return true.
 *                      else update userProfileSettings to an intermediate value
 *                      "OK" return  false.
 */
Meteor.methods({
	'changeLoginIdToFB': function(xData) {
		check(xData,String);
		var search = Meteor.users.find({oAuthId: Meteor.user().services.facebook.id}).fetch();
		var setProfile = Meteor.users.findOne({oAuthId:xData});
		if(search.length===0){//check logging in from different FB id
		/*var s = users.insert({
			"userName":Meteor.user().services.facebook.name,
			"oAuthId":Meteor.user().services.facebook.id,
			"emailAddress":Meteor.user().services.facebook.email,
			"userId":Meteor.userId()
		});*/
		Meteor.users.update({
			"_id": Meteor.userId()
		}, {
			$set: {
				userId:setProfile.userId,
				oAuthId:Meteor.user().services.facebook.id,
				userName: Meteor.user().services.facebook.name,
				emailAddress:Meteor.user().services.facebook.email,
				interestedDomainName:setProfile.interestedDomainName,
				interestedProjectName:setProfile.interestedProjectName,
				interestedSubDomain1Name:setProfile.interestedSubDomain1Name,
				interestedSubDomain2Name:setProfile.interestedSubDomain2Name,
				phoneNumber : setProfile.phoneNumber,
				awayToDate : setProfile.awayToDate,
				awayFromDate : setProfile.awayFromDate,
				profileSettingStatus:setProfile.profileSettingStatus
				}
		});
		Meteor.users.remove({"oAuthId":xData})
		return true;
		}
		else if(xData==Meteor.user().services.facebook.id){//check logging in from same fb id
			return true;
		}
		else {//check logging in if fb id already exists in db

		Meteor.users.update({
			"_id": Meteor.userId()
		}, {
			$set: {
				profileSettingStatus:"ok"
				}
		});
		return false
		}
	}
});

/**
 * Meteor Method to update users after change login id to GMAIL
 * @collectionName : users
 * @dbQuery : update, find
 * @dataType : userId
 * @passedByValues : String
 * @methodDescription : find the users for the current Meteor.user().services.gogle.id
 *                      if the length is 0, update the userId, userName, emailAddress,
 *                      oAuthId, and profileSettingStauts to Meteor.userId(),
 *                      Meteor.user.services.google.name, Meteor.user().services.google.email,
 *                      Meteor.user().services.google.id, false respectively.
 *                      then remove the old oAuthId profile, then return true.
 *                      else if the passedby value is same as Meteor.user().services.google.id
 *                      return true.
 *                      else update userProfileSettings to an intermediate value
 *                      "OK" return  false.
 */
Meteor.methods({
	'changeLoginIdToGmail':function(xData) {
		check(xData,String);
		var search = Meteor.users.find({oAuthId: Meteor.user().services.google.id}).fetch();
		var setProfile = Meteor.users.findOne({oAuthId:xData});
		if(search.length===0){//check logging in from different gmail id
		/*var s = users.insert({
			"userName":Meteor.user().services.facebook.name,
			"oAuthId":Meteor.user().services.facebook.id,
			"emailAddress":Meteor.user().services.facebook.email,
			"userId":Meteor.userId()
		});*/
		Meteor.users.update({
			"_id": Meteor.userId()
		}, {
			$set: {
				userId:setProfile.userId,
				oAuthId:Meteor.user().services.google.id,
				userName: Meteor.user().services.google.name,
				emailAddress:Meteor.user().services.google.email,
				interestedDomainName:setProfile.interestedDomainName,
				interestedProjectName:setProfile.interestedProjectName,
				interestedSubDomain1Name:setProfile.interestedSubDomain1Name,
				interestedSubDomain2Name:setProfile.interestedSubDomain2Name,
				phoneNumber : setProfile.phoneNumber,
				awayToDate : setProfile.awayToDate,
				awayFromDate : setProfile.awayFromDate,
				profileSettingStatus:setProfile.profileSettingStatus
				}
		});
		Meteor.users.remove({"oAuthId":xData});
		return true;
		}
		else if(xData==Meteor.user().services.google.id){//check logging in from same gmail id
			return true;
		}
		else {//check logging in if gmail id already exists in db
		//Meteor.users.update({}, {$set: { "services.resume.loginTokens" : [] }});		
		Meteor.users.update({
			"_id": Meteor.userId()
		}, {
			$set: {
				profileSettingStatus:"ok"
				}
		});
		return false
		}
	}
});

/**
 * Meteor Method to update users after change login id to FB or gmail
 * @collectionName : users
 * @dbQuery : update, find
 * @dataType : userId, profileSettingStatus
 * @passedByValues : Object
 * @methodDescription : if the user tried to change logged in id which is present 
 *                      in db, the profileSettingStatus has been changed to intermediate
 *                      value "OK", so after logged in change to passedByvalue (true or false) 
 */
Meteor.methods({
	'changeLoginIdStatus': function(xData) {
		check(xData,Object);

		var s = Meteor.users.update({
			"userId": xData.userId
		}, {
			$set: {
				profileSettingStatus:xData.profStatus
				}
		});

		Meteor.users.update(Meteor.user()._id, {
                    $set: {
                        "services.resume.loginTokens": []
                    }
                });
		return s;
		}
	});