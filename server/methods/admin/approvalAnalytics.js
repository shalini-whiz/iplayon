Meteor.methods({
	'getUserList': function(userType) {		
		try{
			var userList = Meteor.users.find({"role":userType},{sort:{"userName":1}},{fields:{userId:1,userName:1,"_id":0}}).fetch();
			if(userList.length > 0)
			{
				return userList;
			}
		}catch(e){}
	},
	'addApprovedUser':function(data)
	{
		try{

			var checkUser = analyticsApproval.findOne({"userId":data.userId});
			if(checkUser == undefined)
			{
				var momentDate = moment(new Date(data.validityDate)).format("YYYY-MM-DD");
				var result = analyticsApproval.insert({"userId":data.userId,"validity":momentDate});
				return result;
			}
		}catch(e){}
	},
	'editApprovedUser':function(data)
	{
		try{

			var checkUser = analyticsApproval.findOne({"_id":data._id});
			if(checkUser)
			{
				var momentDate = moment(new Date(data.validityDate)).format("YYYY-MM-DD");
				var result = analyticsApproval.update({"_id":data._id},{$set:{
					"validity":momentDate,"status":data.status}});
				return result;
			}
		}catch(e){}
	},

	'deleteApprovedUser':function(data)
	{
		try{
			var removeApprovedUser = analyticsApproval.remove({"_id":data});
			return removeApprovedUser;
		}catch(e){}
	}
});