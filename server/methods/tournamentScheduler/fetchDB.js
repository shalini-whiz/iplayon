Meteor.publish('eventsTournamentscheduler',function(){
    var lData = events.find({tournamentEvent:true},{fields:{
    	eventName : 1,
		projectId : 1,
		eventStartDate : 1,
		eventEndDate : 1,
		eventSubscriptionLastDate : 1,
		domainId : 1,
		abbName : 1,
		prize : 1,
		projectType : 1,
		eventOrganizer : 1,
		domainName : 1,
		projectName : 1,
		eventStartDate1 : 1,
		eventEndDate1 : 1,
		eventSubscriptionLastDate1 : 1,
		tournamentId : 1
    }});
    if(lData){
        return lData
    }
    else return this.ready(); 
});

Meteor.publish('eventsTournamentschedulerPast',function(){
    var lData = pastEvents.find({tournamentEvent:true},{fields:{
    	eventName : 1,
		projectId : 1,
		eventStartDate : 1,
		eventEndDate : 1,
		eventSubscriptionLastDate : 1,
		domainId : 1,
		abbName : 1,
		prize : 1,
		projectType : 1,
		eventOrganizer : 1,
		domainName : 1,
		projectName : 1,
		eventStartDate1 : 1,
		eventEndDate1 : 1,
		eventSubscriptionLastDate1 : 1,
		tournamentId : 1
    }});
    if(lData){
        return lData
    }
    else return this.ready(); 
});

Meteor.publish('eventsLISTForTournScheduler', function(param) {
  var lData = events.find({tournamentId:param})
  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish('eventsLISTForTournSchedulerPast', function(param) {
  var lData = pastEvents.find({tournamentId:param})
  if (lData) {
    return lData;
  }
  return this.ready();
});