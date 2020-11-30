Template.testCALENDER.onCreated(function(){
	this.subscribe("eventsForHomePage")
});

Template.testCALENDER.onRendered(function(){
    Session.set("selectedDateFrontPage",undefined);  
});

Template.testCALENDER.helpers({
        calendarOptions: {
            // Standard fullcalendar options
            height: 700,
            hiddenDays: [ 0 ],
            slotDuration: '01:00:00',
            minTime: '08:00:00',
            maxTime: '19:00:00',
            lang: 'En',
            eventLimit: true, // If you set a number it will hide the itens
    		eventLimitText: "more..",
            // Function providing events reactive computation for fullcalendar plugin
            events: function(start, end, timezone, callback) {
                var c = callback
                var eventss = [];
                // Get only events from one document of the Calendars collection
                // events is a field of the Calendars collection document

                var calendar = Meteor.call("FetchCalenderEvents",start._d,end._d,function(e,res){
                    if(res){
                        eventss = res
                        c(eventss);
                    }
                });//calenderEvents.find({}).fetch()
                // each event field named as fullcalendar Event Object property is automatically used by fullcalendar
                
            },
            eventRender( e, element ) {
		      element.find( '.fc-content' ).html(
		        `<h4>${ e.title }</h4>
		        `
		      );
		    },
            eventClick: function(calEvent, jsEvent, view) {  
                Session.set("selectedDateFrontPage",moment(new Date(calEvent.start)).format("YYYY MMM DD"))              
                $("#listOfEventsPopup").empty()
                Blaze.render(Template.listOfEvents,$("#listOfEventsPopup")[0]);
                $("#listOfEvents").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                
            },
            // Optional: id of the calendar
            id: "calendar1",
            // Optional: Additional classes to apply to the calendar
            addedClasses: "col-md-8",
            // Optional: Additional functions to apply after each reactive events computation
            autoruns: [
                function () {
                }
            ]
        },
    });

Template.testCALENDER.events({
    "click #errorPopupClose":function(e){
        e.preventDefault();
        $("#listOfEvents").modal('hide');
        Session.set("selectedDateFrontPage",undefined)
    }
});
