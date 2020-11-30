Meteor.methods({

	"deleteWA":function(data)
	{
		try{
			var result = workAssignments.remove({"_id":data});
			if(result)
				return "Work Assignment Removed";
			else
				return "Could not remove Work Assignment"
			

		}catch(e){

		}
	},
	"deleteAdminMessages":function(data)
	{
		try{
			var result = coachAPPINSentBOX.remove({"_id":data});
			if(result)
				return "Messages Removed";
			else
				return "Could not remove Messages"
			

		}catch(e){

		}
	},
	"fetchConnReqUsers":function()
	{
		try{
			var raw = connectionRequests.rawCollection();
	        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
	        var userList1 = distinct('loggedInId');
	        var userList2 = distinct('receiverId');
	        var userList = userList1.concat(userList2);

	        var lData = Meteor.users.find(
	        	{userId:{$in:userList}},{fields:{
	        		"_id":1,"userId":1,"userName":1,"emailAddress":1
	        	}}).fetch();

	        return lData;
		}catch(e){
		}
	},
	"adminDeleteUser":function(userId)
	{
		try{
			var logUser = Meteor.users.findOne({"userId":userId});
			if(logUser)
			{
				if(logUser.role.toLowerCase() == "player")
				{
					//userDetailsTTUsed
					var userInfo = userDetailsTT.findOne({"userId":userId});
					if(userInfo)
					{
					}
				}
				else if(logUser.role.toLowerCase() == "coach"){
					var userInfo = otherUsers.findOne({"userId":userId});
					if(userInfo)
					{
					}
				}
			}

		}catch(e){

		}
	}
})