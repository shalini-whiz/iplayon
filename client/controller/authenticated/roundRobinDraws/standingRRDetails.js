


Template.standingRRDetails.onCreated(function bodyOnCreated() {
    
});

Template.standingRRDetails.onRendered(function () {
    
});


Template.standingRRDetails.helpers({
	"standingInfo":function()
    {
        if(Session.get("currentPlayerMatchDetails"))
        {
            return Session.get("currentPlayerMatchDetails")
        }

    }
});
