Template.registerHelper('selectedEventC', function(v1) {
    if (v1 === Session.get("selectedSportFromLive").trim()) {
        return true;
    }
    return false;
});

Template.printableDraws.helpers({
    thiss: function() {
        if (Session.get("eventName"))
            return Session.get("eventName");
        else
            return "Select Event"
    },

    selectedSportOrNot: function() {
        if (Session.get("selectedSportFromLive") !== undefined && Session.get("selectedSportFromLive") !== null) {
            if (Session.get("selectedSportFromLive") === 0) {
                return false
            } else return true
        }
    },

    tourIdDraws: function() {
        return Router.current().params._id;
    },

    eventName: function() {
        return (Session.get("eventName"))
    },

    printableDraws: function() {
        try {
            if (Session.get("selectedSportFromLive") != undefined &&
                Session.get("selectedSportFromLive") != null) {
                if (Session.get("selectedSportFromLive") !== 0) {
                    Session.set("eventName", Session.get("selectedSportFromLive").trim());
                    Session.set("showDraws", true);
                }
            }
        } catch (e) {}

        try {
            var sport = Session.get("selectedSport");
            if (Session.get("uploadedDraws") != undefined)
                return Session.get("uploadedDraws");
        } catch (e) {}
    },
    progressBARHelp:function(){
        try{
            if(Session.get("progressBAR")){
                return true
            }
        }catch(e){}
    }
});


Template.printableDraws.events({

    "click #draw_event": function(event, template) {
        event.preventDefault();
        var selectedEvent = event.target.value;
        var tournamentId = Session.get("tournamentId");
    },

    'click #printDrawsBtn': function(e) {
        Meteor.call("sendSubscriptionEmailAPI")
        e.preventDefault();
        Session.set("progressBAR",undefined)
        var selectedEvent = $("[name='drawsEventList']").val();
        var tournamentId = Session.get("tournamentId");
        var withScores = true
        if($("#checkAcceptboxWithScores").is(":checked") == true){
            withScores = true
        }
        else{
            withScores = false
        }
        if (selectedEvent == null)
            $("#impMsg").text("* Event Selection required");


        else {
            try {
                Session.set("progressBAR",true)
                var eventDetails = events.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: selectedEvent
                });
                if (eventDetails == undefined) {
                    eventDetails = pastEvents.findOne({
                        "tournamentId": Session.get("tournamentId"),
                        eventName: selectedEvent
                    });
                }
                if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1){
                    Meteor.call('printDrawsSheet', tournamentId, selectedEvent,withScores, function(err, res) {
                        if (res) {
                            Session.set("progressBAR",undefined)
                            window.open("data:application/pdf;base64, " + res);
                            $('.modal-backdrop').remove();

                        }
                    });
                }
                else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
                    Meteor.call('printDrawsSheetForTeamEvents', tournamentId, selectedEvent,withScores, function(err, res) {
                        if (res) {
                            Session.set("progressBAR",undefined)
                            window.open("data:application/pdf;base64, " + res);
                            $('.modal-backdrop').remove();

                        }
                    });
                }
            } catch (e) {
            }
        }
    }
});