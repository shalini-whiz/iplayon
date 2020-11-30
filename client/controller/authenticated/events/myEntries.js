//Template helpers, events for template upcomingEvents.html
/**
 * @Author Vinayashree
 */
/**
 * client side subscription to the server side publications
 * @SubscribeName: uEventsLimit (used to subscribe to events)
 *                 to get the list of upcoming  events.
 * @SubscribeName: projects(used to subscribe to projects)
 *                 to get the list of projects.
 * @SubscribeName: upcomingListsReadStatus (used to subscribe to upcomingListsReadStatus)
 *                  to get the upcomingLists read and unread status
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 * @SubscribeName: domains (used to subscribe to domains)
 *                 to get the list of domains.
 *
 */

var handle2 = false; //handle1 is used to load the events on scroll
Template.myEntries.onCreated(function() {
	//if (Meteor.user()) {
		this.subscribe("onlyLoggedIn");
		var self = this;
		self.autorun(function() {
			handle2 = Meteor.subscribeWithPagination("eventUpcoming", 8);
		});
		//this.subscribe("associationPermissions");
		var lEventLists = "";
		Session.set("loggedInUserId",undefined)
		this.subscribe("upcomingListsReadStatus");
		this.subscribe("domains");
		this.subscribe("onlyLoggedInALLRoles");
		
		/*
		 *setting previous location path as upcoming events, to come back to the
		 *upcoming events path from other paths on click of cancel button
		 */
		Session.set("previousLocationPath", Iron.Location.get().path);
		Session.set("previousLocationPath_Entries",Iron.Location.get().path)

	//}
});

/**
 * On destroy of template stop handle1 subscription and
 * set used sessions to null and undefined
 */
Template.myEntries.onDestroyed(function() {
	//if(handle2)
	//	handle2.stop();
	//handle2=false;
	Session.set('sortCriteria2', null);
	Session.set('sortCriteria2', undefined);
	Session.set("lEventLists1", null);
	Session.set("lEventLists1", undefined);
	Session.set("lEventLists", null);
	Session.set("lEventLists", undefined);
	Session.set("sortCriteria", null);
	Session.set("sortCriteria", undefined);
	Session.set("reee",undefined);
	Session.set("reee",null);
	Session.set("rec",null);
	Session.set("rec",undefined);
	Session.set("rec2",null);
	Session.set("rec2",undefined);
	Session.set("eveUTourId",undefined);
	Session.set("eveUTourId",null);
	Session.set("clickedIDToRed",undefined)
	Session.set("clickedIDToRed",null);

});
		var jsonSP=[]
/**
 * template helpers which connects upcomingEvents.html
 * @methodName : lEvents is a function to find events
 */
Template.myEntries.helpers({

	lEventsUnTour:function(){
		if(Session.get("eveUTourId")!==undefined){
			return ReactiveMethod.call("eventsUnderTourn",Session.get("eveUTourId").toString());
		}
		else{
			return ReactiveMethod.call("eventsUnderTourn",Session.get("eveUTourId").toString());
		}
	},

	/**
	 * variable sortCriteria is used to get the value of sort option
	 * if sortCriteria is not set fetch all the upcoming events,
	 * which is subscribed through uEventsLimit.
	 * if sortCriteria is 3 fetch all the sorted domainName
	 * upcoming events,which is subscribed through uEventsLimitD.
	 * if sortCriteria is 1 fetch all the sorted eventStartDate
	 * upcoming events,which is subscribed through uEventsLimitE.
	 * if sortCriteria is 2 fetch all the sorted projectName
	 * upcoming events,which is subscribed through uEventsLimitP.
	 */
	lEventsa: function() {
		var s = events.find({}).fetch();
		 return  s 
	},

	//not used
	lConfirmHeader: function() {
		var eventLists = events.find({
			"_id": this._id
		}).fetch();
	},

	lUEvents:function(){
		try{
			var response =  ReactiveMethod.call("loggedInSubscribeTournaments");
			var eventList = [];
			if(Session.get("sortCriteria")==1)
			{
				eventList = events.find({tournamentEvent:true,},{sort:{eventName:1}}).fetch();
			}
			else if(Session.get("sortCriteria")==2){
				eventList = events.find({tournamentEvent:true},{sort:{domainName:1}}).fetch()
			}
			else if(Session.get("sortCriteria")==3)
			{
				eventList = events.find({tournamentEvent:true},{sort:{eventStartDate1:-1}}).fetch()
			}
			else
			{
				eventList = events.find({tournamentEvent:true}).fetch();
			}
			var subscribedTour = [];
			for(var k = 0 ; k< eventList.length ; k++)
			{
				if ((response.indexOf(eventList[k]._id) > -1))
				{
					subscribedTour.push(eventList[k]);
				}

			}
			return subscribedTour;
		}catch(e){
		}
		//Meteor.call("")
	}
	

});


/**
 * On rendered of template upcomingEvents.html initialize css bootstrap
 * niceScroll and  undefine the sessions
 */
Template.myEntries.onRendered(function() {
	/*change the class of upcomingEvents button to change the color
	 which shows the button is pressed*/
	$('#myEntries').removeClass("ip_button_DarkGrey");
	$('#myEntries').addClass("ip_button_White");
  	$("#chekck_myEntries").css("display","flex");
	//initialize the niceSroll for #eventDataParent

	$('#eventDataParent1').slimScroll({
		height: '16em',
		color: 'black',
		size: '1px',
		width: '100%'
	});

	//undefine the sortCriteria1 sessions
	Session.set("lEventLists2", null);
	Session.set("lEventLists2", undefined);
	Session.set("lEventLists", null);
	Session.set("lEventLists", undefined);
	Session.set("sortCriteria3", null);
	Session.set("sortCriteria3", undefined);
	Session.set("sortCriteria2", null);
	Session.set("sortCriteria2", undefined);
});

/**
 * Events handler for the template upcomingEvents.html
 */
var gEventLists = "";
Template.myEntries.events({

	'click .accordion_head':function(e){
		e.preventDefault()
        if ($(e.currentTarget).parent().parent().parent().next(".chekck").is(':visible')) {
            $(e.currentTarget).parent().parent().parent().next(".chekck").slideUp(100);
            $(e.currentTarget).children(".plusminus").removeClass('glyphicon-minus');
            $(e.currentTarget).children(".plusminus").addClass('glyphicon-plus');
        } else {
            $(e.currentTarget).parent().parent().parent().next(".chekck").slideDown(400);
            $(e.currentTarget).children(".plusminus").removeClass('glyphicon-plus');
            $(e.currentTarget).children(".plusminus").addClass('glyphicon-minus');
        }
	},

	/* onClick of userDropDown button
	 * slideDown the drop down
	 * by adding the class open
	 * if the userDropDown has class open
	 * slideUp the drop down
	 */
	'click #userDropDown': function(e) {
		e.preventDefault();

		if ($("#userDropDown").hasClass("open")) {
			$("#userDropDown").removeClass("open");
			$("#userDropDown").children("ul").slideUp("fast");
		} else {
			$("#userDropDown").addClass("open");
			$("#userDropDown").children("ul").slideDown("fast");
		}
	},

	/* onClick of sortEventsDropDown button
	 * slideDown the drop down
	 * by adding the class open
	 * if the sortEventsDropDown has class open
	 * slideUp the drop down
	 */
	'click #sortEventsDropDown': function(e) {
		e.preventDefault();
		if ($("#sortEventsDropDown").hasClass("open")) {
			$("#sortEventsDropDown").removeClass("open");
			$("#sortEventsDropDown").children("ul").slideUp("fast");
		} else {
			$("#sortEventsDropDown").addClass("open");
			$("#sortEventsDropDown").children("ul").slideDown("fast");
		}
	},

	/* whenever userDropDown or sortEventsDropDown is open 
	 * onClick of outside userDropDown or sortEventsDropDown
	 * close the userDropDown or sortEventsDropDown menu
	 */
	'click': function(e) {
		var userDropDown = $("#userDropDown");
		var sortEventsDropDown = $("#sortEventsDropDown");
		if (!userDropDown.is(e.target) // if the target of the click isn't the container...
			&& userDropDown.has(e.target).length === 0) // ... nor a descendant of the container
		{
			if ($("#userDropDown").hasClass("open")) {
				$("#userDropDown").removeClass("open");
				$("#userDropDown").children("ul").slideUp("fast");
			}
		}
		if (!sortEventsDropDown.is(e.target) // if the target of the click isn't the container...
			&& sortEventsDropDown.has(e.target).length === 0) // ... nor a descendant of the container
		{
			if ($("#sortEventsDropDown").hasClass("open")) {
				$("#sortEventsDropDown").removeClass("open");
				$("#sortEventsDropDown").children("ul").slideUp("fast");
			}
		}
	},

	/*
	 * click of past events button
	 * stop handle1 loading
	 */
	'click #pastEvents': function(e) {
		e.preventDefault();
	},

	/*not used*/
	'click #editEvent': function(e) {
		e.preventDefault();
		Session.set('sortCriteria1', null);
		Session.set('sortCriteria1', undefined);
		var eventLists = events.find({
			"_id": this._id
		}).fetch();
		Router.go("editEvents", {
			_PostId: this._id
		});
	},
	
	"click #confirmModalRedirectYes":function(e){
		e.preventDefault();
		var id="";
		if(Session.get("clickedIDToRed"))
			id = Session.get("clickedIDToRed")
		else
			id= "";
		Meteor.call("upcomingListsAndStatus",id, function(error, response) {})
		$("#confirmModalRedirect").modal('hide');
		$("#alreadySubscribed_entryFromAca").modal('hide');
	    var type = events.findOne({"_id":id,tournamentEvent:true});
	    if (type&&type.hyperLinkValue) 
	    {
	      var s = type.hyperLinkValue
	      if (!s.match(/^https?:\/\//i)) {
	        s = 'http://' + s;
	      }
	      window.open(s, '_blank');
	    }
	},
	'click #viewEventT': function(event) {
		event.preventDefault();
		Session.set('sortCriteria1', null);
		Session.set('sortCriteria1', undefined);
		Meteor.call("upcomingListsAndStatus",event.target.name, function(error, response) {})
		var eventLists = events.find({
			"_id": event.target.name
		}).fetch();
		Router.go("viewEvents", {
			_PostId:event.target.name
		});
	},

	'click #uuuu':function(e){
		ggg();
	},
	/*
	 * click of createEvents button
	 * stop handle1
	 */
	'click #e_Event': function(e) {
		e.preventDefault();
		//handle1.stop()
	},

	/*
	 * click of myEvents button
	 * stop handle1
	 */
	'click #myEvents': function(e) {
		e.preventDefault();
		//handle1.stop()
	},

	/*
	 *click on upcoming sort by event start date
	 * stop handle1 subscription to uEventsLimit
	 * and start subscription to
	 * uEventsLimitE
	 * and set sortDomain Reactive var to 1
	 */
	'click  #puEventsSortByEventDate': function(e, template) {
		e.preventDefault();
		Session.set("sortCriteria",3);
	},

	/*
	 *click on upcoming sort by project name
	 * stop handle1 subscription to uEventsLimit
	 * and start subscription to
	 * uEventsLimitP
	 * and set sortDomain Reactive var to 2
	 */
	'click  #puEventsSortByProjectName': function(e, template) {
		e.preventDefault();
		Session.set("sortCriteria",1);
	},

	/*
	 *click on upcoming sort by domain name
	 * stop handle1 subscription to uEventsLimit
	 * and start subscription to
	 * uEventsLimitP
	 * and set sortDomainName Reactive var to 3
	 */
	'click  #puEventsSortByPlaceName': function(e, template) {
		e.preventDefault();
		Session.set("sortCriteria",2);
	},

	/*
	 * scroll the list load the subscription
	 * to other 8 entries to handle1
	 */
	
	'scroll #eventDataParent1': function(e) {
		if ($(e.target).scrollTop() + $(e.target).innerHeight() >= $(e.target)[0].scrollHeight) {
			$(e.target).unbind('scroll');
			handle2.loadNextPage();
		}
	},
	'click #loadNExt':function(e){
		handle2.loadNextPage();
	}
});


