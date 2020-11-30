Template.listOfEvents.onCreated(function(){

});

Template.listOfEvents.onRendered(function(){
	
});

Template.listOfEvents.helpers({
	getSelectedDATE:function(){
		try{
			if(Session.get("selectedDateFrontPage")!=undefined){
				return Session.get("selectedDateFrontPage")
			}
		}catch(e){
		}
	},
	fetchEventsForSelectedDate:function(){
		try{
			if(Session.get("selectedDateFrontPage")!=undefined){
				var fetchEvents = ReactiveMethod.call("fetchEventsOnDateSelection",Session.get("selectedDateFrontPage"))
				return fetchEvents;
			}
		}catch(e){
		}
	}
});

Template.listOfEvents.events({
	"click #goToEventToSubscribe":function(e){
	}
});