Template.subscriptionPageErrorPopup.onCreated(function(){

});

Template.subscriptionPageErrorPopup.onRendered(function(){

});

Template.subscriptionPageErrorPopup.helpers({
	ReasonToCannotSubscribe:function(){
		try{
			if(Session.get("errorResponseToSubscribe")){
				return Session.get("errorResponseToSubscribe")
			}
		}catch(e){

		}
	},
	"tournamentNAmeToSubscribeErr":function(){
        if(Session.get("loginTournamentId")){
            var s = ReactiveMethod.call("myeventsUnderTournHelper", Session.get("loginTournamentId"));
            if(s)
                return s;
        }
    }
});

Template.subscriptionPageErrorPopup.events({
	'click #subErrorOk':function(e){
        try{
        e.preventDefault();
        $("#subscriptionPageErrorPopup").modal('hide');
        $('.modal-backdrop').remove();
        if(Session.get("previousLocationPath")=="iplayonProfile"&&Session.get("showTourDEtLIST")==true){
        	if(Session.get("selectedDateFrontPage")){
            	$("#parentCalendar").empty()
            	Blaze.render(Template.renderTournamentDetails, $("#parentCalendar")[0]);
        	}
        }
        else{     
        	//Router.go("iplayonProfile");
        	if(Session.get("selectedDateFrontPage")){                
                if($("#parentCalendar").length&&Session.get("showTourDEtLIST")==true){
            	   $("#parentCalendar").empty()
            	   Blaze.render(Template.renderTournamentDetails, $("#parentCalendar")[0]);
                   Session.set("showTourDEtLIST",true)
                } else if(Session.get("previousLocationPath")){
                    Router.go(Session.get("previousLocationPath"));
                    Session.set("showTourDEtLIST",true)
                }else{
                    Router.go("iplayonProfile");
                    Session.set("showTourDEtLIST",true)
                }
        	}        	
    	}
        }catch(e){}
    }
})