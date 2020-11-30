/**
 * Meteor Method to update users after fb login
 * @collectionName : users
 * @dbQuery : update, find
 * @dataType : -
 * @passedByValues : -
 * @methodDescription : find the users for the current Meteor.user().services.facebook.id
 *                      if the length is 0, update the userId, userName, emailAddress,
 *                      oAuthId, and profileSettingStauts to Meteor.userId(),
 *                      Meteor.user.services.facebook.name, Meteor.user().services.facebook.email,
 *                      Meteor.user().services.facebook.id, false respectively
 */
Meteor.methods({
	insertUserFb:function(){
		var search = Meteor.users.find({oAuthId:Meteor.user().services.facebook.id}).fetch();
		if(search.length===0){
		Meteor.users.update({
			"_id": Meteor.userId()
		}, {
			$set: {
				userId: Meteor.userId(),
				userName: Meteor.user().services.facebook.name,
				emailAddress:Meteor.user().services.facebook.email,
				oAuthId:Meteor.user().services.facebook.id,
				profileSettingStatus:false
				}
		});
		return false;
		}
		else {
			return true;
		}
	}
});

/**
 * Meteor Method to update users after gmail login
 * @collectionName : users
 * @dbQuery : update, find
 * @dataType : -
 * @passedByValues : -
 * @methodDescription : find the users for the current Meteor.user().services.google.id
 *                      if the length is 0, update the userId, userName, emailAddress,
 *                      oAuthId, and profileSettingStauts to Meteor.userId(),
 *                      Meteor.user.services.google.name, Meteor.user().services.google.email,
 *                      Meteor.user().services.google.id, false respectively
 */
Meteor.methods({
	insertUserGmail:function(){
		var search = Meteor.users.find({oAuthId:Meteor.user().services.google.id}).fetch();
		if(search.length===0){
		Meteor.users.update({
			"_id": Meteor.userId()
		}, {
			$set: {
				userId: Meteor.userId(),
				userName: Meteor.user().services.google.name,
				emailAddress:Meteor.user().services.google.email,
				oAuthId:Meteor.user().services.google.id,
				profileSettingStatus:false
				}
		});
			return false;
		}
		else {
			teams.insert({"teamName" : "Big bashes", "projectName" : ["NjfSYepjkh3HaHQWA"], "teamOwner" : "KLyuusmWz9fwjBGe5", "venues" : [ "2eCRfcCwXCfPrTZLj", "YD6HaviWowQ4gy4Fw" ], "teamMembers" : [ "KLyuusmWz9fwjBGe5", "2HYqoKjgpb4ZnNyQS" ], "teamManager" : "KLyuusmWz9fwjBGe5" });
			teams.insert({"teamName" : "counties", "projectName" : ["NjfSYepjkh3HaHQWA"], "teamOwner" : "KLyuusmWz9fwjBGe5", "venues" : [ "2eCRfcCwXCfPrTZLj", "YD6HaviWowQ4gy4Fw" ], "teamMembers" : [ "KLyuusmWz9fwjBGe5", "2HYqoKjgpb4ZnNyQS" ], "teamManager" : "KLyuusmWz9fwjBGe5" });
			return true;
		}
	}

});