//Template helpers, events for template myEvents.html
/**
 * @Author Vinayashree
 */
/**
 * client side subscription to the server side publications
 * @SubscribeName: mEventsLimit (used to subscribe to events)
 *                 to get the list of my events.
 * @SubscribeName: projects(used to subscribe to projects)
 *                 to get the list of projects
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 * @SubscribeName: domains (used to subscribe to domains)
 *                 to get the list of domains.
 * @SubscribeName: teams (used to subscribe to teams)
 *                 to get the list of teams.
 *
 */
 var arrayp;
var handle2=false;//handle2 is used to load the events on scroll
Template.myEvents.onCreated(function() {
	this.subscribe("onlyLoggedIn");
	this.subscribe("domains");
		/*
		 * reactive variable to set the eventId this is used to display eventName
		 * when deleting the events
		 */
	this.eventId = new ReactiveVar(0);
	/*
	 * reactive variable to set the userId this is used to display userName when
	 * whiteListing the user
	 */
	this.userId = new ReactiveVar(0);
	this.teamId = new ReactiveVar(0);
	this.teamOwnerId = new ReactiveVar(0);
	/*
	 * reactive variable to set the subscribedEventID this is used to display
	 * subscribed user name when deleting or black listing the subscribers
	 */
	this.subscribedEventID = new ReactiveVar(0);
	var lEventLists = "";
	/*
	 * on load of template subscribe to meteor with pagination
	 * mEventsLimit with 8 entries
	 */
	var self = this;
	self.autorun(function() {
		handle2 = Meteor.subscribeWithPagination("mEventsLimit", 8);
	});
	/*
	 *setting previous location path as my events, to come back to the
	 *my events path from other paths on click of cancel button
	 */
	Session.set("previousLocationPath", Iron.Location.get().path);
});

/**
 * On destroy of template stop handle1 subscription and
 * set used sessions to null and undefined
 */
Template.myEvents.onDestroyed(function() {
	if(handle2)
		handle2.stop();
	handle2=false;
	Session.set("sortCriteria", null);
	Session.set("sortCriteria", undefined);
	Session.set("downlodPopArrayHelper",undefined);
	Session.set("consolidateID",undefined);
	Session.set("consolidateName",undefined);
	Session.set("useridToSend",undefined);
	Session.set("detailsToSendReciept",undefined);
//	Session.set("HTMLViewOFFee",undefined)
});

/**
 * template helpers which connects myEvents.html.
 * @methodName : lEvent is a function to find events,
 */
Template.myEvents.helpers({
	/**
	 * variable sortCriteria is used to get the value of sort option
	 * if sortCriteria is not set fetch all the my events,
	 * which is subscribed through pEventsLimit.
	 * if sortCriteria is 3 fetch all the sorted domainName
	 * my events,which is subscribed through mEventsLimitD.
	 * if sortCriteria is 1 fetch all the sorted eventStartDate
	 * my events,which is subscribed through mEventsLimitE.
	 * if sortCriteria is 2 fetch all the sorted projectName
	 * my events,which is subscribed through mEventsLimitP.
	 */
	lEvent: function() {
		var sortCriteria = Session.get("sortCriteria");
		var lEventListing = "";
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined){
		Session.set("lEventLists", myUpcomingEvents.find({}).fetch());
		lEventListing = myUpcomingEvents.find({eventOrganizer:userId.userId.toString()}).fetch();
		if (sortCriteria) {
			if (sortCriteria == 1) {
				lEventListing = "";
				return myUpcomingEvents.find({"eventOrganizer":userId.userId.toString()}, {
					sort: {
						"eventStartDate1":1
					}
				}).fetch();
			}
			if (sortCriteria == 2) {
				lEventListing = "";
				return myUpcomingEvents.find({"eventOrganizer":userId.userId.toString()}, {
					sort: {
						"eventName": 1
					}
				}).fetch();
			}
			if (sortCriteria == 3) {
				lEventListing = "";
				return myUpcomingEvents.find({"eventOrganizer":userId.userId.toString()}, {
					sort: {
						"domainName": 1
					}
				}).fetch();
			}
		} else if (lEventListing.length !== 0) {
		//	setTimeout(events.find({"tournamentEvent":true}).fetch(),10000);
			return lEventListing;
		}
		}
	},


	// not used
	lConfirmHeader: function() {
		var eventLists = events.find({
			"_id": this._id
		}).fetch();
	},


})

/**
 * On rendered of template myEvents.html initialize css bootstrap slimScroll,
 * niceScroll
 */
Template.myEvents.onRendered(function() {
	
	Session.set("lEventLists", null);
	Session.set("lEventLists", undefined);
	$('#eventDataParent1').slimScroll({
		height: '16em',
		color: 'black',
		size: '2px',
		width: '100%'
	});
	/*
	 * change the class of myEvents button to change the color which shows the
	 * button is pressed
	 */
	$("#chekck_myEvents").css("display","flex");
	$('#myEvents').removeClass("ip_button_DarkGrey");
	$('#myEvents').addClass("ip_button_White");


	// initialize the niceSroll for #eventDataParent
	$('#eventDataParent').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: '#E5E9E7', // The scrollbar rail color
		cursorwidth: '4px', // Scroll cursor width
		cursorcolor: '#999999' // Scroll cursor color
	});

	// initialize the niceSroll for .subListScroll
	/*$('.subListScroll').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: '#E5E9E7', // The scrollbar rail color
		cursorwidth: '4px', // Scroll cursor width
		cursorcolor: 'black' // Scroll cursor color
	});*/

	// undefine the sortCriteria2 sessions
	Session.set('sortCriteria', null);
	Session.set('sortCriteria', undefined);
});

/**
 * Events handler for the template editEvents.html
 */
var gEventLists = "";
Template.myEvents.events({

	'click .accordion_head':function(e){
		e.preventDefault()
	//	Session.set("eveUTourId",this._id);
		/*if ($('.chekck').is(':visible')) {
            $(".chekck").slideUp(50);
            $(".plusminus").removeClass('glyphicon-minus');
            $(".plusminus").addClass('glyphicon-plus');
        }*/
		//Meteor.call("eventsUnderTourn",this._id)
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
	/*
	 * on focus of .mainSubscriberList
	 * hide the niceScroll of eventDataParent
	 * initialize the slimScroll for .subListScroll
	 * set the reactive variable subscribedEventId
	 * to this._id(clicked event id)
	 */
	'focus .mainMenuSubscriberList': function(e, template) {
		$('#eventDataParent').niceScroll({}).hide();

		$("#eventDataParent").getNiceScroll().remove();
		$('#eventDataParent').off("scroll");
		$('.subListScroll').slimScroll({
			height: '3.3em',
			color: 'black',
			size: '3px',
			width: '100%'
		});
		template.subscribedEventID.set(this._id);
	},

	/*
	 * On focus out of .mainMenuSubscriberList
	 * initialize the eventDataParent niceScroll
	 * and set the userDelete radio button value to 1
	 */
	'focusout .mainMenuSubscriberList': function(e) {
		$('#eventDataParent').niceScroll({
			cursorborderradius: '0px', // Scroll cursor radius
			background: 'transparent', // The scrollbar rail color
			cursorwidth: '4px', // Scroll cursor width
			cursorcolor: '#999999' // Scroll cursor color
		}).show();

		$("input[name=userDelete]").val([1]);
	},

	/*
	 * onClick of userDropDown button slideDown the drop down by adding
	 * the class open if the userDropDown has class open slideUp the
	 * drop down
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

	/*
	 * whenever userDropDown or sortEventsDropDown is open onClick of
	 * outside userDropDown or sortEventsDropDown close the userDropDown
	 * or sortEventsDropDown menu
	 */
	'click': function(e) {
		// e.preventDefault();
		var userDropDown = $("#userDropDown");
		var sortEventsDropDown = $("#sortEventsDropDown");
		if (!userDropDown.is(e.target) // if the target of the click
			// isn't the container...
			&& userDropDown.has(e.target).length === 0) // ... nor a
		// descendant
		// of the
		// container
		{
			$('.subListScroll').niceScroll({
				cursorborderradius: '0px', // Scroll cursor radius
				autohidemode: false,
				background: 'transparent', // The scrollbar rail color
				cursorwidth: '4px', // Scroll cursor width
				cursorcolor: 'black' // Scroll cursor color
			});
			if ($("#userDropDown").hasClass("open")) {
				$("#userDropDown").removeClass("open");
				$("#userDropDown").children("ul").slideUp("fast");
			}
		}
		if (!sortEventsDropDown.is(e.target) // if the target of the
			// click isn't the
			// container...
			&& sortEventsDropDown.has(e.target).length === 0) // ...
		// nor
		// a
		// descendant
		// of
		// the
		// container
		{
			$('.subListScroll').niceScroll({
				cursorborderradius: '0px', // Scroll cursor radius
				autohidemode: false,
				background: 'transparent', // The scrollbar rail color
				cursorwidth: '4px', // Scroll cursor width
				cursorcolor: 'black' // Scroll cursor color
			});
			if ($("#sortEventsDropDown").hasClass("open")) {
				$("#sortEventsDropDown").removeClass("open");
				$("#sortEventsDropDown").children("ul").slideUp("fast");
			}
		}
		$('.subListScroll').niceScroll({
			cursorborderradius: '0px', // Scroll cursor radius
			autohidemode: false,
			background: 'transparent', // The scrollbar rail color
			cursorwidth: '4px', // Scroll cursor width
			cursorcolor: 'black' // Scroll cursor color
		});
	},

	/*
	 * onClick of sortEventsDropDown button slideDown the drop down by
	 * adding the class open if the sortEventsDropDown has class open
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

	/*
	 * click of edit events button route to editEvents with PostId as
	 * clicked eventId
	 */
	'click #editEvent': function(e) {
		e.preventDefault();
		handle2.stop();
		Session.set('sortCriteria', null);
		Session.set('sortCriteria', undefined);
		/*var eventLists = events.findOne({
			"_id": this._id
		});*/
		//if (moment.utc(eventLists.eventEndDate).tz("America/New_York").format("MM/DD/YYYY h:mm a") >moment.utc(new Date()).tz("America/New_York").format("MM/DD/YYYY h:mm a"))
			Router.go("editEvents", {
				_PostId: this._id
			});
		//else
			//Router.go("viewPastEvents", {
			//	_PostId: this._id
			//});
	},

	/*
	 * click of view events button call the upcomingListAndStatus with
	 * clicked event id, and route to viewEvent with PostId as clicked
	 * eventId
	 */
	/*'click #viewEvent': function(e) {
		e.preventDefault();
		handle2.stop();
		Session.set('sortCriteria', null);
		Session.set('sortCriteria', undefined);
		var eventLists = events.findOne({
			"_id": this._id
		});

		if (eventLists.eventEndDate > new Date())
			Router.go("viewEvents", {
				_PostId: this._id
			});
		else
			Router.go("viewPastEvents", {
				_PostId: this._id
			});
	},*/

	/*
	 * click of deleteEvent open confirmModal set eventId to this._id
	 * (is an event id of clicked event) and fetch the db for eventId
	 * set the reactive variable eventId to eventId then return the
	 * header of confirmHeader with eventName String
	 */
	'click #deleteEvent': function(e, template) {
		e.preventDefault();

		/*$("#alreadySubscribed").modal({
						backdrop: 'static'
		});*/
		/*$("#alreadySubscribedText").text("You Cannot Delete Events");*/
		$("#confirmModal").modal({
			backdrop: 'static'
		});
		var eventId = this._id;
		var gEventLists = myUpcomingEvents.find({
			"tournamentId": eventId
		}).fetch();
		template.eventId.set(eventId);
		$("#conFirmHeader").text("Delete");
		var data = gEventLists[0].eventName
		if (data.toString().length >= 35) {
			data = data.toString().substring(0, 35).trim() + "..";
			$('.modal-sm').css("width", "342px");
			$('.confirmPopup').css("width", "342px");
		} else {
			$('.modal-sm').css("width", "242px");
			$('.confirmPopup').css("width", "242px");
		}
		$('#conFirmHeader').append('<span id="dataConfirm">&nbsp;' + data + '&nbsp;</span>');
		$('#conFirmHeader').append('<span id="questConfirm">?</span>');
	},

	'click #aYesButton':function(e){
		e.preventDefault();
		$("#alreadySubscribed").modal("hide");
	},
	/*
	 * click of yesButton of confirmModal Popup get the reactive var
	 * eventId value then call the meteor method deleteEvents, with
	 * eventId then hide the confirmModal
	 */
	'click #yesButton': function(e, template) {
		e.preventDefault();
		var eventId = Template.instance().eventId.get();
		Meteor.call("deleteEvents", eventId, function(error, response) {
			if (response) {
				template.eventId.set(0);
				Meteor.call("changeAfterDeleteUpcomingListsAndStatus",eventId);
			} else {
			}
		})
		$("#confirmModal").modal('hide');
	},

	/*
	 * click of noButton of confirm modal hide the confirm modal popup
	 */
	'click #noButton': function(e) {
		e.preventDefault();
		$("#confirmModal").modal('hide');
	},

	/*
	 * click of deleteSubscriber open confirmDeleteSubscriber set userId or teamId
	 * to this(is an userId or teamId of clicked subscriber) and fetch the db for
	 * userId or teamId set the reactive variable userId or teamId to userId or teamId
	 * then return the
	 * header of confirmHeader with userName,teamName String
	 */
	'click #deleteSubscriber': function(e, template) {
		e.preventDefault();
		var userId = e.target.id;
		var targetId = e.target.name;
		$('.mainMenuSubscriberList').focus();
		var userName = Meteor.users.findOne({
			$or: [{
				"_id": targetId.toString()
			}, {
				"userId": targetId.toString()
			}]
		});
		if (userName == undefined) {
			var teamName = teams.findOne({
				"_id": targetId.toString()
			});
			if (teamName) {
				template.teamId.set(teamName._id);
				template.teamOwnerId.set(teamName.teamOwner)
				$('#confirmDeleteTeamSubscriber').modal({
					backdrop: 'static'
				});
				var data = teamName.teamName;
				if (teamName.teamName.toString().length >= 40) {
					data = teamName.teamName.toString().substring(0, 40).trim() + "..";
					$('.modal-sm').css("width", "424px");
					$('.confirmPopup').css("width", "424px");
				} else if (teamName.teamName.toString().length < 40) {
					$('.modal-sm').css("width", "340px");
					$('.confirmPopup').css("width", "340px");
				}
				$("#conFirmHeaderDeleteTeamSubscriber").text("Delete");
				$('#conFirmHeaderDeleteTeamSubscriber').append('<span id="dataConfirm">&nbsp;' + data + '</span>');
				$('#conFirmHeaderDeleteTeamSubscriber').append('<span id="questConfirm">&nbsp;?</span>');
			}
		} else {
			template.userId.set(userName.userId);
			$('#confirmDeleteSubscriber').modal({
				backdrop: 'static'
			});
			var data = userName.userName;
			if (userName.userName.toString().length >= 40) {
				data = userName.userName.toString().substring(0, 40).trim() + "..";
				$('.modal-sm').css("width", "424px");
				$('.confirmPopup').css("width", "424px");
			} else if (userName.userName.toString().length < 40) {
				$('.modal-sm').css("width", "340px");
				$('.confirmPopup').css("width", "340px");
			}
			$("#conFirmHeaderDeleteSubscriber").text("Delete");
			$('#conFirmHeaderDeleteSubscriber').append('<span id="dataConfirm">&nbsp;' + data + '</span>');
			$('#conFirmHeaderDeleteSubscriber').append('<span id="questConfirm">&nbsp;?</span>');
		}
	},

	/*
	 * click of noButtonDeleteUser of confirm modal hide the
	 * confirmDeleteSubscriber modal popup
	 */
	'click #noButtonDeleteUser': function(e) {
		e.preventDefault();
		$('.subListScroll').niceScroll({
			cursorborderradius: '0px', // Scroll cursor radius
			autohidemode: false,
			background: '#E5E9E7', // The scrollbar rail color
			cursorwidth: '4px', // Scroll cursor width
			cursorcolor: 'black' // Scroll cursor color
		});
		$('#confirmDeleteSubscriber').modal('hide');
	},
	/*
	 * click of noButtonDeleteUser of confirm modal hide the
	 * confirmDeleteSubscriber modal popup
	 */
	'click #noButtonDeleteTeam': function(e) {
		e.preventDefault();
		$('.subListScroll').niceScroll({
			cursorborderradius: '0px', // Scroll cursor radius
			autohidemode: false,
			background: '#E5E9E7', // The scrollbar rail color
			cursorwidth: '4px', // Scroll cursor width
			cursorcolor: 'black' // Scroll cursor color
		});
		$('#confirmDeleteTeamSubscriber').modal('hide');
	},
	/*
	 * click of yesButtonDeleteUser check the radio buttons which is
	 * checked, if delete only is checked the value is 1, get the
	 * reactive variable userId or teamId value and subscribedEventId value and
	 * call the method deleteSubscriberFromEvent with JSON data with
	 * contains userId of subscriber and subscribedEventId.
	 *
	 * if delete and blacklist is checked value is 0, get the reactive
	 * variable userId or teamId value and subscribedEventId value and call the
	 * method deleteSubscriberAndBlackFromEvent with JSON data with
	 * contains userId or teamId of subscriber, currentUserId i.e current logged
	 * in userid or teamId and subscribedEventId.
	 */
	'click #yesButtonDeleteUser': function(e, template) {
		e.preventDefault();
		if ($('input[name=userDelete]:checked').val() == "1") {
			var userId = Template.instance().userId.get();
			var subscribedEventID = Template.instance().subscribedEventID
				.get();
			var lData = {
				userId: userId.toString(),
				subscribedEventID: subscribedEventID
			}
			Meteor
				.call(
					"deleteSubscriberFromEvent",
					lData,
					function(error, response) {
						if (response) {
							template.userId.set(0);
							template.subscribedEventID.set(0);
						}
					});
		}
		if ($('input[name=userDelete]:checked').val() == "0") {
			var userIdBlack = Template.instance().userId.get();
			var currentUserId = Meteor.users.findOne({
				"_id": Meteor.userId()
			});
			var subscribedEventIDBlack = Template.instance().subscribedEventID
				.get();
			var lData = {
				userId: userIdBlack.toString(),
				subscribedEventID: subscribedEventIDBlack,
				currentUserId: currentUserId.userId.toString()
			}
			Meteor
				.call(
					"deleteSubscriberAndBlackFromEvent",
					lData,
					function(error, response) {
						if (response) {
							template.userId.set(0);
							template.subscribedEventID.set(0);
						} else {
						}
					});
		}
		$('#confirmDeleteSubscriber').modal('hide');
	},

	/*
	 * click of yesButtonDeleteUser check the radio buttons which is
	 * checked, if delete only is checked the value is 1, get the
	 * reactive variable userId or teamId value and subscribedEventId value and
	 * call the method deleteSubscriberFromEvent with JSON data with
	 * contains userId or teamId of subscriber and subscribedEventId.
	 *
	 * if delete and blacklist is checked value is 0, get the reactive
	 * variable userId or teamId value and subscribedEventId value and call the
	 * method deleteSubscriberAndBlackFromEvent with JSON data with
	 * contains userId or teamId of subscriber, currentUserId i.e current logged
	 * in userid and subscribedEventId.
	 */
	'click #yesButtonDeleteTeam': function(e, template) {
		e.preventDefault();
		if ($('input[name=teamDelete]:checked').val() == "1") {
			var teamId = Template.instance().teamId.get();
			var teamOwnerId = Template.instance().teamOwnerId.get();
			var subscribedEventID = Template.instance().subscribedEventID
				.get();
			var lData = {
				userId: teamId.toString(),
				teamOwner: teamOwnerId.toString(),
				subscribedEventID: subscribedEventID
			}
			Meteor
				.call(
					"deleteSubscriberFromEvent",
					lData,
					function(error, response) {
						if (response) {
							template.teamId.set(0);
							template.teamOwnerId.set(0);
							template.subscribedEventID.set(0);
						}
					});
		}
		if ($('input[name=teamDelete]:checked').val() == "0") {
			var teamIdBlack = Template.instance().teamId.get();
			var teamOwnerId = Template.instance().teamOwnerId.get();
			var currentUserId = Meteor.users.findOne({
				"_id": Meteor.userId()
			});
			var subscribedEventIDBlack = Template.instance().subscribedEventID
				.get();
			var lData = {
				userId: teamIdBlack.toString(),
				teamOwner: teamOwnerId.toString(),
				subscribedEventID: subscribedEventIDBlack,
				currentUserId: currentUserId.userId.toString()
			}
			Meteor
				.call(
					"deleteSubscriberAndBlackFromEvent",
					lData,
					function(error, response) {
						if (response) {
							template.teamOwnerId.set(0);
							template.teamId.set(0);
							template.subscribedEventID.set(0);
						} else {
						}
					});
		}
		$('#confirmDeleteTeamSubscriber').modal('hide');
	},


	/*
	 * click of createEvents button
	 * stop loading handle2
	 */
	'click #e_Event': function(e) {
		e.preventDefault();
		handle2.stop();
	},

	/*
	 * click of past events button
	 * stop loading handle2
	 */
	'click #pastEvents': function(e) {
		e.preventDefault();
		handle2.stop();
	},

	/*
	 * click of upcomingEvents button
	 *  stop loading handle2
	 */
	'click #upcomingEvents': function(e) {
		e.preventDefault();
	},

	/*
	 *click on past sort by event start date
	 * stop handle subscription to mEventsLimit
	 * and start subscription to
	 * mEventsLimitE
	 * and set sortDomain Reactive var to 1
	 */
	'click  #sortByEventDate': function(e) {
		e.preventDefault();
		/*Deps.autorun(function() {
			handle2 = Meteor.subscribeWithPagination("mEventsLimitE", 8);
		});*/
		Session.set("sortCriteria", 1);
	},

	/*
	 *click on my sort by project name
	 * stop handle subscription to mEventsLimit
	 * and start subscription to
	 * mEventsLimitP
	 * and set sortDomain Reactive var to 2
	 */
	'click  #sortByProjectName': function(e) {
		e.preventDefault();
		/*Deps.autorun(function() {
			handle2 = Meteor.subscribeWithPagination("mEventsLimitP", 8);
		});*/
		Session.set("sortCriteria", 2);
	},

	/*
	 *click on my sort by domain name
	 * stop handle subscription to mEventsLimit
	 * and start subscription to
	 * mEventsLimitD
	 * and set sortDomain Reactive var to 3
	 */
	'click #sortByPlaceName': function(e) {
		e.preventDefault();
		/*Deps.autorun(function() {
			handle2 = Meteor.subscribeWithPagination("mEventsLimitD", 8);
		});*/
		Session.set("sortCriteria", 3);
	},

	'click #viewEventT': function(event) {
		event.preventDefault();
		Session.set('sortCriteria1', null);
		Session.set('sortCriteria1', undefined);
		//
		//handle1.stop()
		Meteor.call("upcomingListsAndStatus",event.target.name, function(error, response) {})
		/*var eventLists = events.find({
			"_id": event.target.name
		}).fetch();*/
		Router.go("viewEvents", {
			_PostId:event.target.name
		});
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

   "click #downloadSubList":function(e){
        e.preventDefault();
        try{
	        Session.set("downlodPopArrayHelper",undefined);
	        Session.set("consolidateID",undefined);
	        Session.set("consolidateName",undefined);
	        var userId = Meteor.users.findOne({"_id":Meteor.userId()})
	        var doa = myUpcomingEvents.find({"eventOrganizer":userId.userId.toString()}).fetch();
	        if(doa.length!=0){
	 			var  arrNew=[];
	 			var downlodPopArray=[];
	        	var filn = myUpcomingEvents.findOne({"tournamentId":this.tournamentId});
	        	if(filn!=undefined&&filn.eventsUnderTournament!=undefined){
	        		//set the session as events of tournament
					Session.set("downlodPopArrayHelper",filn.eventsUnderTournament);
					Session.set("consolidateID",this.tournamentId);
					Session.set("consolidateName",filn.eventName);
					//render the popup
					if(Session.get("downlodPopArrayHelper")){
						Blaze.render(Template.downloadSubscribersCSV,$("#downloadPopRender")[0]);
			        	$('#downloadSubscribersCSV').modal({
							backdrop: 'static'
						});
					}
				}
	        }
	        else{
	            $("#alreadySubscribed").modal({
	                        backdrop: 'static'
	            });
	            $("#alreadySubscribedText").text("No Events To Download");
	        }
    	}catch(e){
    	}
    },
	'click #eventgenerate_myTd':function(e){
		e.preventDefault();
		 var  arrNew=[]
		 Session.set("HTMLViewOFFee",undefined)
        var filn = myUpcomingEvents.findOne({"tournamentId":this.tournamentId});
  		var id=this.tournamentId;
  		window.open(Router.url("feeList", {_id:id,page:1}));
  	
	}


}); 


function sortClubName_HTML(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;
        return result * sortOrder;
    }
}


//@Author shalini (Oct 13) 

Template.feeListHeader.onRendered(function() {

    $("#playerWiseFinanceBtn").trigger("click");
   
})


Template.feeListHeader.helpers({

	"tournamentName":function(){

		var tournId = Router.current().params._id;		
		var tournInfo = ReactiveMethod.call("getTounName" ,tournId);
		if(tournInfo)
			return tournInfo.eventName;


	}
})
Template.feeListHeader.events({

	'click #playerWiseFinanceBtn':function(e)
	{
		var id = Router.current().params._id;
		$("#listID").empty();
		$("#rankID").empty();
		$('#playerWiseFinanceBtn').removeClass("ip_button_DarkGrey");
  		$('#playerWiseFinanceBtn').addClass("ip_button_White");

  		$('#academyWiseFinanceBtn').removeClass("ip_button_White");
  		$('#academyWiseFinanceBtn').addClass("ip_button_DarkGrey");

  		$('#dAWiseFinanceBtn').removeClass("ip_button_White");
  		$('#dAWiseFinanceBtn').addClass("ip_button_DarkGrey");

		$('#teamWiseFinanceBtn').removeClass("ip_button_White");
  		$('#teamWiseFinanceBtn').addClass("ip_button_DarkGrey");

		Blaze.render(Template.feeList, $("#listID")[0]);
		Router.go("feeList", {_id:id,page:1})
	},
	'click #academyWiseFinanceBtn':function(e)
	{
		var id = Router.current().params._id;
		$("#listID").empty();
		$("#rankID").empty();
		$('#playerWiseFinanceBtn').removeClass("ip_button_White");
  		$('#playerWiseFinanceBtn').addClass("ip_button_DarkGrey");

  		$('#academyWiseFinanceBtn').removeClass("ip_button_DarkGrey");
  		$('#academyWiseFinanceBtn').addClass("ip_button_White");

  		$('#dAWiseFinanceBtn').removeClass("ip_button_White");
  		$('#dAWiseFinanceBtn').addClass("ip_button_DarkGrey");

		$('#teamWiseFinanceBtn').removeClass("ip_button_White");
  		$('#teamWiseFinanceBtn').addClass("ip_button_DarkGrey");

		Blaze.render(Template.academyWise, $("#listID")[0]);
		Router.go("feeList", {_id:id,page:1})
	},
	'click #dAWiseFinanceBtn':function(e)
	{
		var id = Router.current().params._id;
		$("#listID").empty();
		$("#rankID").empty();

		$('#playerWiseFinanceBtn').removeClass("ip_button_White");
  		$('#playerWiseFinanceBtn').addClass("ip_button_DarkGrey");

  		$('#academyWiseFinanceBtn').removeClass("ip_button_White");
  		$('#academyWiseFinanceBtn').addClass("ip_button_DarkGrey");

  		$('#dAWiseFinanceBtn').removeClass("ip_button_DarkGrey");
  		$('#dAWiseFinanceBtn').addClass("ip_button_White");

		$('#teamWiseFinanceBtn').removeClass("ip_button_White");
  		$('#teamWiseFinanceBtn').addClass("ip_button_DarkGrey");
		Blaze.render(Template.dAWise, $("#listID")[0]);
		Router.go("feeList", {_id:id,page:1})
	},
	'click #teamWiseFinanceBtn':function(e)
	{
		var id = Router.current().params._id;
		$("#listID").empty();
		$("#rankID").empty();

		$('#playerWiseFinanceBtn').removeClass("ip_button_White");
  		$('#playerWiseFinanceBtn').addClass("ip_button_DarkGrey");

  		$('#academyWiseFinanceBtn').removeClass("ip_button_White");
  		$('#academyWiseFinanceBtn').addClass("ip_button_DarkGrey");

  		$('#dAWiseFinanceBtn').removeClass("ip_button_White");
  		$('#dAWiseFinanceBtn').addClass("ip_button_DarkGrey");

		$('#teamWiseFinanceBtn').removeClass("ip_button_DarkGrey");
  		$('#teamWiseFinanceBtn').addClass("ip_button_White");

		Blaze.render(Template.playerTeamWise, $("#listID")[0]);
		Router.go("feeList", {_id:id,page:1})
	},
})





