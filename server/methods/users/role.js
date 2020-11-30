import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
	'getPlayerDetails':function(playerId)
	{
		try{
			check(playerId, String);
			if(nameToCollection(playerId))
			{
				var playerInfo = nameToCollection(playerId).findOne({"userId":playerId});
				if(playerInfo)
					return playerInfo;
			}
			
		}catch(e){}
	},
	'getCoachPlayerDetails':function(playerId)
	{
		try{
			check(playerId, String);
			if(nameToCollection(playerId))
			{
				var playerInfo = nameToCollection(playerId).findOne({"userId":playerId});
				if(playerInfo)
					return playerInfo;
				else
				{
					var playerInfo = otherUsers.findOne({"userId":playerId});
					if(playerInfo){
						return playerInfo;
					}
				}
			}
			else{
				var playerInfo = otherUsers.findOne({"userId":playerId});
				if(playerInfo){
					return playerInfo;
				}
			}
		}catch(e){}
	},
	'getAcademyInfo': function(academyId) {
		try{
			check(academyId, String);
			var academyInfo = academyDetails.findOne({"userId":academyId});
			if(academyInfo)
				return academyInfo;
		}catch(e){}
	},
	'getAssociationInfo':function(associationId)
	{	
		try{
			check(associationId, String);
			var associationInfo = associationDetails.findOne({"userId":associationId});
			if(associationInfo)
				return associationInfo;
		}catch(e){}
	},
	'checkrole':function(userId)
	{
		try{
			check(userId, String);
			var loggedInfo = Meteor.users.findOne({"userId":userId});

			if(loggedInfo && loggedInfo.role == "Player")
			{		
				if(nameToCollection(userId))
				{
					var userInfo = nameToCollection(userId).findOne({"userId":userId});
					if(userInfo)
					{
						return userInfo;
					}
				}			
			}
			else if(loggedInfo && loggedInfo.role == "Association")
			{		
				var userInfo = associationDetails.findOne({"userId":userId});
				if(userInfo) return userInfo;
			}
			else if(loggedInfo && loggedInfo.role == "Academy")
			{
				var userInfo = academyDetails.findOne({"userId":userId});
				if(userInfo) return userInfo;
			}
		}catch(e){
		}
	},
	'getUserName':function(userId)
	{
		try
		{
			var userInfo = Meteor.users.findOne({"userId":userId});
			if(userInfo)
				return userInfo.userName;
		}catch(e){}
	}
});