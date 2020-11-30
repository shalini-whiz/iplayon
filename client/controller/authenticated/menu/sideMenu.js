//Template helpers, events for template sideMenu.html
//which is included in myEvents.html,upcomingEvents.html,pastEvents.html
/**
 * @Author Vinayashree
 * @Author Alekhya
 */
Template.sideMenu.onCreated(function() {});

/**
 * Events handler for the template sideMenu.html
 */
Template.sideMenu.events({
	/*
	 * on click of past events button
	 * store previousLocationPath as the current path
	 * then route to pastEvents
	 */
	'click #pastEvents': function(e) {
		e.preventDefault();
		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/pastEvents", {
			replaceState: true
		});
	},

	/*
	 * on click of my events button
	 * store previousLocationPath as the current path
	 * then route to myEvents
	 */
	'click #myEvents': function(e) {
		e.preventDefault();
		if ($("#chekck_LiveEvents").is(':visible')) {
            $("#chekck_LiveEvents").slideUp(100);
        }
        if ($("#chekck_myEntries").is(':visible')) {
            $("#chekck_myEntries").slideUp(100);
        }
		if ($(e.currentTarget).next("#chekck_myEvents").is(':visible')) {
            $(e.currentTarget).next("#chekck_myEvents").slideUp(100);
        } else {
        	$("#chekck_myEvents").css("display","flex");
            $(e.currentTarget).next("#chekck_myEvents").slideDown(400);
        }
		/*Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/myEvents", {
			replaceState: true
		});*/
	},
	'click #myEventsPAst': function(e) {
		e.preventDefault();
		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/myEventsPast", {
			replaceState: true
		});
	},

	'click #myEventsUpcom': function(e) {
		e.preventDefault();
		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/myEvents", {
			replaceState: true
		});
	},
	'click #myEntriesUpcom': function(e) {
		e.preventDefault();
		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/myEntries", {
			replaceState: true
		});
	},
	'click #myEntriesPAst': function(e) {
		e.preventDefault();
		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/myEntriesPAst", {
			replaceState: true
		});
	},
	/*
	 * on click of createEvents button
	 * store previousLocationPath as the current path
	 * then route to createEvents
	 */
	'click #e_Event_MM': function(e) {
		//e.preventDefault();
		if ($("#chekck_myEvents").is(':visible')) {
            $("#chekck_myEvents").slideUp(100);
        }
        if ($("#chekck_myEntries").is(':visible')) {
            $("#chekck_myEntries").slideUp(100);
        }

        if ($(e.currentTarget).next("#chekck_LiveEvents").is(':visible')) {
            $(e.currentTarget).next("#chekck_LiveEvents").slideUp(100);
        } else {
        	$("#chekck_LiveEvents").css("display","flex");
            $(e.currentTarget).next("#chekck_LiveEvents").slideDown(400);
        }
		/*Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/liveUpdates", {
			replaceState: true
		});*/
	},

	'click #goLiveUpcom':function(e){
		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/liveUpdates", {
			replaceState: true
		});
	},

	'click #goLivePAst':function(e){
		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/pastUpdates", {
			replaceState: true
		});
	},

	/*
	 * on click of upcomingEvents button
	 * store previousLocationPath as the current path
	 * then route to upcomingEvents
	 */
	'click #upcomingEvents': function(e) {
		e.preventDefault();

		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/upcomingEvents", {
			replaceState: true
		});
	},

	/*
	 * on click of myTeams button
	 * store previousLocationPath as the current path
	 * then route to myTeams
	 */
	'click #myTeams': function(e) {
		e.preventDefault();

		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/myTeams", {
			replaceState: true
		});
	},
	
    /*
	 * on click of myEntries button
	 * store previousLocationPath as the current path
	 * then route to myEntries
	*/
	'click #myEntries': function(e) {
		e.preventDefault();
		if ($("#chekck_myEvents").is(':visible')) {
            $("#chekck_myEvents").slideUp(100);
        }
        if ($("#chekck_LiveEvents").is(':visible')) {
            $("#chekck_LiveEvents").slideUp(100);
        }
        if ($(e.currentTarget).next("#chekck_myEntries").is(':visible')) {
            $(e.currentTarget).next("#chekck_myEntries").slideUp(100);
        } else {
        	$("#chekck_myEntries").css("display","flex");
            $(e.currentTarget).next("#chekck_myEntries").slideDown(400);
        }
		/*Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/myEntries", {
			replaceState: true
		});*/
	},
	
	/*
	 * on click of t_Team button
	 * store previousLocationPath as the current path
	 * then route to createTeams
	 */
	'click #t_Team' : function(e) {
		e.preventDefault();

		Session.set("previousLocationPath", Iron.Location.get().path);
		Router.go("/createTeams", {
			replaceState : true
		});
	},
});