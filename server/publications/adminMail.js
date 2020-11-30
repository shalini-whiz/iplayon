Meteor.publish('authAddress', function() {
	var lData = authAddress.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('barChartColor',function(){
	var lData = barChartColor.find({})
	if(lData){
		return lData
	}
	return this.ready()
})


Meteor.publish('connectionRequests',function(){
	var lData = connectionRequests.find({})
	if(lData){
		return lData
	}
	return this.ready()
})

Meteor.publish('coachConnectedGroups',function(){
	var lData = coachConnectedGroups.find({})
	if(lData){
		return lData
	}
	return this.ready()
})

Meteor.publish('coachAPPINSentBOX',function(){
	var lData = coachAPPINSentBOX.find({})
	if(lData){
		return lData
	}
	return this.ready()
})


Meteor.publish('workAssignments',function(){
	var lData = workAssignments.find({})
	if(lData){
		return lData
	}
	return this.ready()
})

