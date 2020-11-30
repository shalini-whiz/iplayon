Template.sendSubscribedEmail.helpers({
	eventNames:function(){
		return  Session.get("eventDetailsForMail")
	},
	totalEntryFee:function(){
		return Session.get("totalEntryFee")
	}
});
Template.sendSubscriptionEmailFromClubEntry.onCreated(function(){
	this.subscribe("eventsLISTForParam", Router.current().params._PostId);
    this.subscribe("tournamentEVENT", Router.current().params._PostId)
    this.subscribe("eventFeeSettings")

});
Template.sendSubscriptionEmailFromClubEntry_Ex.onCreated(function(){
	this.subscribe("eventsLISTForParam", Router.current().params._PostId);
    this.subscribe("tournamentEVENT", Router.current().params._PostId)
    this.subscribe("eventFeeSettings")
});

Template.sendSubscriptionEmail.helpers({
	eventNamesFee:function(){
		return events.findOne({"abbName":this}).prize
	}
});

Template.registerHelper("eventFeesSendMAIL_MM",function(data){
	var eventPrizes = eventFeeSettings.findOne({"tournamentId":Router.current().params._PostId});
    if(eventPrizes&&eventPrizes.eventFees){
        eventPrizes = eventPrizes.eventFees[data]
        return eventPrizes
    }

})
Template.sendSubscribedEmail_Ex.helpers({
	eventNames:function(){
		return  Session.get("eventDetailsForMail")
	},
	totalEntryFee:function(){
		return Session.get("totalEntryFee")
	}
});

Template.sendSubscriptionEmail.helpers({
	eventNames:function(){
		return  Session.get("eventDetailsForMail");
	}
});

Template.sendRequestSubscriptionEmail.helpers({
	eventNames:function(){
		return  Session.get("eventDetailsForMail");
	},
});

Template.registerHelper('getTeamNamesForMail', function(data,sub) {
	if(data){
		if( Session.get("teamEventsIdWithTeam")!=undefined){
			var arrayTeam = Session.get("teamEventsIdWithTeam");
			for(var i=0;i<arrayTeam.length;i++){
				if(data==arrayTeam[i].eventSelected&&sub==true){
					teamName = teams.findOne({"_id":arrayTeam[i].teamSelected});
					return teamName.teamName;
					break;
				}
			}
		}
		else{
			return "-"
		}
	}
});