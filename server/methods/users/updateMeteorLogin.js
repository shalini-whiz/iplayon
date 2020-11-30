/**
 * Meteor Method to update Meteor User login profile
 * @collectionName : users
 * @dbQuery : update
 * @dataType : String
 * @passedByValues : Meteor.userId()
 * @methodDescription : update userId field of users collection for given id 
 */
Meteor.methods({
	updateMeteorUserLogin:function(xData){
		check(xData,String)

		var s = Meteor.users.update({"_id":xData},
			{$set:{userId: Meteor.userId(),profileSettingStatus:false}});
		if(s){
		return s;
		}
	}
});

/**
 * Oncreate of user set userName and emailAddress 
 */
Accounts.onCreateUser(function(options, user) {
 // user.userName = options.userName;
  user.emailAddress=options.userName;
  return user;
});



Meteor.methods({
	insertAcademyFromAss_DN:function(xData){
		var r = Accounts.createUser({
    		email: xData.emailAddress,
    		password:xData.password,
    		userName:xData.userName
  		});
  		return r;
	}
});
