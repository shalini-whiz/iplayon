import { routeForsubscription } from '../../../routes/hooks.js'

Template.iplayonHome.onCreated(function() {
    this.subscribe("onlyLoggedIn")    
    Session.set("previousLocationPath", "/iplayonProfile");
    Session.set("showTourDEtLIST",true)
});

Template.iplayonHome.onRendered(function() {
    Session.set("loginTournamentId", undefined)

});

Template.iplayonHome.helpers({
    checkLoggedInUSerIp: function() {
        try{
            if (Meteor.userId()) {
                return true
            }
        }catch(e){}
    },
    userNAMe: function() {
        try{
            if (Meteor.userId()) {
                if(Meteor.user().userName)
                return Meteor.user().userName;
            }
        }catch(e){}
    },
    threeUpcomingEventsFetch:function(){
        try{
            var events = ReactiveMethod.call("threeUpcomingEvents")            
            return events            
        }catch(e){
        }
    },
    threeResultsSEt:function(){
        try{
            var s = ReactiveMethod.call("getResultsOF3Events");
            if(s)
                return s
        }catch(e){

        }
    },
    yearNow:function(){
        try{
            var s = ReactiveMethod.call("yearNow");
            if(s){
                return s
            }
        }catch(e){

        }
    }
});

Template.iplayonHome.events({
    'submit form': function(e) {
        // Prevent form from submitting.
        e.preventDefault();
    },
    "click #loginButtonIplayonWithoutTourn": function(e) {
        e.preventDefault();
        $("#renderIplayonLogin").empty()
        Blaze.render(Template.iplayonLogin, $("#renderIplayonLogin")[0]);
        $('#iplayonLogin').modal({
            backdrop: 'static',
            keyboard: false
        })
    },
    "click #signInWithoutTourn": function(e) {
        e.preventDefault();
        $('#application-signup').css('display', 'inline-block !important');
        Router.go("/registerPage1")
    },
    "click #ipHelpRender":function(e){
        e.preventDefault();
        window.open(Router.url("aboutIplayOn"));
    },
    'click #signInWithoutTournuserLogout': function() {
        $("#confirmlogoutIplayon").modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#conFirmHeaderLog").text("Are you sure you want to Logout ?");
    },
    "click #signInWithoutTournupcomingEvents": function(e) {
        e.preventDefault();
        Router.go("/upcomingEvents")
    },
    "click #liUPCOmingTourn":function(e){
        Session.set("loginTournamentId", this._id);
        Session.set("showTourDEtLIST",false)
        if (Meteor.userId()) {
            var s = Meteor.users.findOne({
                    _id: Meteor.userId()
                });
            if (s&&s.profileSettingStatus == true) {
                routeForsubscription(s)
            }
        } else {
            $("#renderIplayonLogin").empty()
            Blaze.render(Template.iplayonLogin, $("#renderIplayonLogin")[0]);
            $('#iplayonLogin').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    },
    "click #confirmModalRedirectYes": function(e) {
        e.preventDefault();
        var id = "";
        if (Session.get("clickedIDToRed"))
            id = Session.get("clickedIDToRed")
        else
            id = "";
        Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
        $("#confirmModalRedirect").modal('hide');
        $("#alreadySubscribed_entryFromAca").modal('hide');
        var type = Session.get("hyperLINKValue")
        $( '.modal-backdrop' ).remove();
        //if the subscription type is hyperlink
        //route to hyper link
        if (type) {
            var s = type
                //if the web site doesn't contains https
            if (!s.match(/^https?:\/\//i)) {
                s = 'http://' + s;
            }
            window.open(s, '_blank');
        }
    },
});

Template.renderCalendar.onRendered(function(){
    if(Session.get("toGOTOPage")==undefined){
        Session.set("toGOTOPage",new Date())
    }
    $('#checkGOTTO').fullCalendar({
        // Standard fullcalendar options
        height: 700,        
        lang: 'En',
        eventLimit: 2, // If you set a number it will hide the itens
        eventLimitText: "more",
        eventBackgroundColor: "transparent",
        eventBorderColor: "0",
        defaultDate:Session.get("toGOTOPage"),
        // Function providing events reactive computation for fullcalendar plugin
        events: function(start, end, timezone, callback) {
            var c = callback

            var eventss = [];
            // Get only events from one document of the Calendars collection
            // events is a field of the Calendars collection document

            var calendar = Meteor.call("FetchCalenderEvents", start._d, end._d, function(e, res) {
                if (res) {
                    eventss = res
                    c(eventss);
                }
            }); //calenderEvents.find({}).fetch()
            // each event field named as fullcalendar Event Object property is automatically used by fullcalendar

        },
        eventRender(e, element) {

            element.find('.fc-content').html(
                `<h4>${ e.title }</h4>
                `
            );
        },
        eventClick: function(calEvent, jsEvent, view) {

            Session.set("toGOTOPage",moment(new Date(calEvent.start)).format("YYYY-MM-DD"))
            Session.set("selectedDateFrontPage", moment(new Date(calEvent.start)).format("DD MMM YYYY"))
            $("#parentCalendar").empty()
            Blaze.render(Template.renderTournamentDetails, $("#parentCalendar")[0]);
        },
        // Optional: id of the calendar
        id: "calendarIPlayon",
        // Optional: Additional classes to apply to the calendar
        addedClasses: "col-md-12 col-sm-12 col-lg-12 col-xs-12 divPaddingZero divPaddingForCalendar",
        height: "parent",
        // Optional: Additional functions to apply after each reactive events computation
        autoruns: [
            function() {

            }
        ]
    })
});

Template.renderCalendar.helpers({
    /*calendarOptions: {
        // Standard fullcalendar options
        height: 700,        
        lang: 'En',
        eventLimit: 2, // If you set a number it will hide the itens
        eventLimitText: "more",
        eventBackgroundColor: "transparent",
        eventBorderColor: "0",
        defaultDate:Session.get("toGOTOPage"),
        // Function providing events reactive computation for fullcalendar plugin
        events: function(start, end, timezone, callback) {
            var c = callback

            var eventss = [];
            // Get only events from one document of the Calendars collection
            // events is a field of the Calendars collection document

            var calendar = Meteor.call("FetchCalenderEvents", start._d, end._d, function(e, res) {
                if (res) {
                    eventss = res
                    c(eventss);
                }
            }); //calenderEvents.find({}).fetch()
            // each event field named as fullcalendar Event Object property is automatically used by fullcalendar

        },
        eventRender(e, element) {

            element.find('.fc-content').html(
                `<h4>${ e.title }</h4>
                `
            );
        },
        eventClick: function(calEvent, jsEvent, view) {

            Session.set("toGOTOPage",moment(new Date(calEvent.start)).format("YYYY-MM-DD"))
            Session.set("selectedDateFrontPage", moment(new Date(calEvent.start)).format("DD MMM YYYY"))
            $("#parentCalendar").empty()
            Blaze.render(Template.renderTournamentDetails, $("#parentCalendar")[0]);
        },
        // Optional: id of the calendar
        id: "calendarIPlayon",
        // Optional: Additional classes to apply to the calendar
        addedClasses: "col-md-12 col-sm-12 col-lg-12 col-xs-12 divPaddingZero divPaddingForCalendar",
        height: "parent",
        // Optional: Additional functions to apply after each reactive events computation
        autoruns: [
            function() {

            }
        ]
    },*/
});


Template.renderCalendar.events({})

Template.renderTournamentDetails.onCreated(function(){
    Session.set("previousLocationPath", "/iplayonProfile");
})

Template.renderTournamentDetails.onRendered(function(){
    $('#calenderClickedEventsaa').slimScroll({
        height: "33.2em",
        color: '#00aeff',
        size: '5px',
        width: '100%',
        alwaysVisible: false
    });
});

Template.renderTournamentDetails.helpers({
    getSelectedDATE: function() {
        try {
            if (Session.get("selectedDateFrontPage") != undefined) {
                return Session.get("selectedDateFrontPage")
            }
        } catch (e) {
        }
    },
    fetchEventsForSelectedDate: function() {
        try {
            if (Session.get("selectedDateFrontPage") != undefined) {
                var fetchEvents = ReactiveMethod.call("fetchEventsOnDateSelection", moment(new Date(Session.get("selectedDateFrontPage"))).format("YYYY MMM DD"))
                return fetchEvents;
            }
        } catch (e) {
        }
    }
});

Template.renderTournamentDetails.events({
    "click #backToCalendar": function(e) {
        e.preventDefault();
        $("#parentCalendar").empty()
        Blaze.render(Template.renderCalendar, $("#parentCalendar")[0]); 
    }
})

Template.renderTournamentDetails.events({
    "click #goToEventToSubscribe": function(e) {
        Session.set("loginTournamentId", this._id);
        if (Meteor.userId()) {
            var s = Meteor.users.findOne({
                    _id: Meteor.userId()
                });
            if (s&&s.profileSettingStatus == true) {
                routeForsubscription(s)
            }
        } else {
            $("#renderIplayonLogin").empty()
            Blaze.render(Template.iplayonLogin, $("#renderIplayonLogin")[0]);
            $('#iplayonLogin').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    }
});

Template.confirmlogoutIplayon.events({
    'click #noButtonLogoutIp': function(e) {
        e.preventDefault();
        $("#confirmlogoutIplayon").modal('hide');
    },
    'click #yesButtonLogout': function(e, template) {
        e.preventDefault();
        Meteor.logout(function(error) {
            if (error) {} else {
                Session.set("playerDBName",undefined)
                $('.modal-backdrop').remove();
                $("#confirmlogoutIplayon").modal('hide');
            }
        });
        $('.modal-backdrop').remove();
        $("#confirmlogoutIplayon").modal('hide');
    },
})