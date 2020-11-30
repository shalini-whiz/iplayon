
/************ workAssignmentContent related ********************/
Template.workAssignmentContent.onCreated(function() {
    this.subscribe("workAssPub");
    this.subscribe("senderInworkAssPub");
    this.subscribe("groupInworkAssPub");
});

Template.workAssignmentContent.helpers({
	"workAssignmentList":function()
	{
		var workAssignmentsList = workAssignments.find({}).fetch();
		return workAssignmentsList;
	},
	"eachAssignmentCount":function(data)
	{
		if(data && data.length > 0)
			return data.length;
		
	}

})

Template.workAssignmentContent.events({
	"click #deleteWA":function(e)
	{
		Meteor.call("deleteWA",this._id,function(error,result)
		{
			if(result)	
				alert(result);	
			else
				alert(error);
		})
	}
})

/***************************************************/



/************ message content related ********************/
Template.messagesDataContent.onCreated(function() {
    this.subscribe("messagesSentPub");
    this.subscribe("senderInmessagesSentPub");
    this.subscribe("groupInmessagesSentPub");
});

Template.messagesDataContent.helpers({
	"messageDataList":function()
	{
		var sentMessagesList = coachAPPINSentBOX.find({}).fetch();
		return sentMessagesList;
	},
	"eachMessageCount":function(data)
	{
		if(data && data.length > 0)
			return data.length;
		
	}

})

Template.messagesDataContent.events({
	"click #deleteCoachMessages":function(e)
	{
		Meteor.call("deleteAdminMessages",this._id,function(error,result)
		{
			if(result)	
				alert(result);	
			else
				alert(error);
		})
	}
})


/************ connection content related ********************/
Template.connectionDataContent.onCreated(function() {
});

Template.connectionDataContent.helpers({
	"connectionDataList":function()
	{
		try{
			var result = ReactiveMethod.call("fetchConnReqUsers");

	        if(result && result.length != 0)
	        {
	           	return result;
	        }
	        else{
	           	return []
	        }
    	}catch(e){
    	}
	}
})

Template.connectionDataContent.events({
	"click #adminDeleteUser":function(e)
	{
		Meteor.call("adminDeleteUser",this._id,function(error,result)
		{
			if(result)	
				alert(result);	
			else
				alert(error);
		})
	}
})

/************************************************************/
Template.registerHelper("workAssUser",function(data){
	try{

		var userInfo = Meteor.users.findOne({"userId":data})
		if(userInfo)
		{
			return userInfo.userName;
		}
		else
		{
			var lData = coachConnectedGroups.findOne({"_id":data});
			if(lData)
				return lData.groupName;
			else
				return data;
		}
	}catch(e){}
}) 