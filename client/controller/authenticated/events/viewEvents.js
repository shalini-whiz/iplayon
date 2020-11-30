//Template helpers, events for template viewEvents.html
/**
 * @Author Vinayashree
 */
/**
 * client side subscription to the server side publications
 * @SubscribeName: projects(used to subscribe to projects)
 *                 to get the list of projects.
 * @SubscribeName: eventUploads (used to subscribe to eventUploads)
 *                  to get the eventUploads list
 * @SubscribeName: teams (used to subscribe to teams)
 *                  to get the teams list
 * @SubscribeName: allEvents (used to subscribe to events)
 *                  to get the events list
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 * @SubscribeName: domains (used to subscribe to domains)
 *                 to get the list of domains.
 *
 */
Template.viewEvents.onCreated(function() {
	this.subscribe("eventUploads");
	this.subscribe("onlyLoggedIn");
    this.subscribe("onlyLoggedInALLRoles")
    this.subscribe("upeventsLISTTorunament",Router.current().params._PostId)
	this.subscribe("upEventsID",Router.current().params._PostId)
	//this.subscribe("eventsLIST",Router.current().params._PostId)
});

/**
 *  Onrendered  of template viewEvents.html
 *  initialize css bootstrap datetimepicker,
 *  select2,nicescroll
 *
 *
 */
Template.viewEvents.onRendered(function() {
	if (Meteor.user()) {
		this.$('.datetimepicker').datetimepicker();
	}
	/*
	 * not used
	 */
	$('#viewEventSubscribers').select2({
		width: 10,
	});

	/*
	 * initialize niceScroll for blackListOfUsers
	 */
	/*$('.blackListOfUsers').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: 'transparent', // The scrollbar rail color
		cursorwidth: '4px', // Scroll cursor width
		cursorcolor: 'black',
		autohidemode: true, // Scroll cursor color
	});*/

	/*not used*/
	$("input[name='mainTag']:first").prop("checked", true);


});


var gSponsorFileId = "";
var gRulesAndRegFileId = "";
var gSponsorUrl = "";
var gSponsorLogo = "";
var gSponsorPdf = "";
var gSponsorMailId = "";
var gEventId = "";

/**
 * template helpers which connects viewEvents.html
 * @methodName : lEvent is a function to fetch events for an Id
 * 			lId holds the event id which comes as request
 * 			parameters.
 * @methodName : lProjectName is a function to fetch projectNames.
 * @methodName : lDomainName is  a function to fetch domainNames.
 * @methodName : lSponsorLogo is a function to fetch the uploaded sponsor
 *           files details for lId
 *           lId holds the event id which comes as request
 * 			 parameters.
 *@methodName : lrulesAndRegulations is a function fetch uploaded rules and
 * 		     regulations file details for lId
 * 	         lId holds the event id which comes as request
 * 			 parameters.
 *@methodName : lEventDetails is a function to get event details for given event id
 */
Template.viewEvents.helpers({
	lEvent: function() {
		gEventId = Router.current().params._PostId;
		var lEvents = events.find({
			"_id": gEventId
		}).fetch();
		if (lEvents) {
			for (var i = 0; i < lEvents.length; i++) {
				gSponsorMailId = lEvents[i].sponsorMailId;
				gSponsorUrl = lEvents[i].sponsorUrl;
			}

			return lEvents;
		}
	},
	lEventid:function(){
		for(var i=0;i<50;i++){
			if(i===49)
			return Router.current().params._PostId;
		}
	},
	lOrganizer: function() {
		/*var lOrganizers = "";
		gEventId = Router.current().params._PostId;
		var lEvents = events.find({
			"_id": gEventId
		}).fetch();
		for(var i=0; i<lEvents.length;i++){
			lOrganizers =users.find({"userId":lEvents[i].eventOrganizer}).fetch()
		}
		//if(lOrganizers.length===0){
		for (var i = 0; i < lEvents.length; i++) {
			lOrganizers = userDetailssTT.find({
				"userId": lEvents[i].eventOrganizer
			}).fetch()
		}
		//}
		return lOrganizers;*/
	},
	
	lProjectName: function() {
		var lProjectNames = projects.find().fetch();
		if (lProjectNames) {
			return lProjectNames;
		}
	},
	
	lDomainName: function() {
		var lDomainNames = domains.find().fetch();
		if (lDomainNames) {
			return lDomainNames;
		}
	},
	
	lSponsorLogo: function() {
		if (Meteor.user()) {
			gEventId = Router.current().params._PostId;
			var lData;
			var lEvents = events.find({
				"_id": gEventId
			}).fetch();
			for (var j = 0; j < lEvents.length; j++) {
				lData = eventUploads.find({
					"_id": lEvents[j].sponsorLogo
				}).fetch();
			}
			return lData;
		}
	},
	
	lSponsorPdf: function() {
		if (Meteor.user()) {
			var lId = Router.current().params._PostId;
			var lData;
			var lEvents = events.find({
				"_id": lId
			}).fetch();

			for (var j = 0; j < lEvents.length; j++) {

				lData = eventUploads.find({
					"_id": lEvents[j].sponsorPdf
				}).fetch();

			}
			return lData;
		}
	},
	
	lRulesAndReg: function() {
		if (Meteor.user()) {

			var lId = Router.current().params._PostId;
			var lData;

			var lEvents = events.find({
				"_id": lId
			}).fetch();
			for (var j = 0; j < lEvents.length; j++) {

				lData = eventUploads.find({
					"_id": lEvents[j].rulesAndRegulations
				}).fetch();

			}

			return lData;
		}
	},
	lresultsOfTheEvents:function(){
		if (Meteor.user()) {
			try{
				var lId = Router.current().params._PostId;
				var lData;
				var lEvents = events.find({
					"_id": lId
				}).fetch();
				for (var j = 0; j < lEvents.length; j++) {
					lData = eventUploads.find({
						"_id": lEvents[j].resultsOfTheEvents
					}).fetch();
				}
				return lData;
			}catch(e){
			}
		}
		
	},
	lEventDetails: function(e) {
		var lId = Router.current().params._PostId;
		var lEventDetails = events.findOne({
			"_id": lId
		});
		return lEventDetails;
	},
	
	lPrizePdf: function() {
		if (Meteor.user()) {
			var lId = Router.current().params._PostId;
			var lData;

			var lEvents = events.find({
				"_id": lId
			}).fetch();
			for (var j = 0; j < lEvents.length; j++) {
				lData = eventUploads.find({
					"_id": lEvents[j].prizePdfId
				}).fetch();

			}

			return lData;
		}
	},
});

/**
 * Events handler for the template viewEvents.html
 */
Template.viewEvents.events({
	"click #downloadTEAMPlayers":function(e){
		e.preventDefault();
		var lId = Router.current().params._PostId;
		var lEventDetails = events.findOne({
			"_id": lId
		});
		if(lEventDetails&&lEventDetails.eventName&&lEventDetails.tournamentId&&lEventDetails.projectType&&parseInt(lEventDetails.projectType)==2){
			var keyFields = ["teamName","playerName","emailAddress","phoneNumber","gender"];
			Meteor.call("downloadTeamDetailsForRefree",lEventDetails.tournamentId,lEventDetails.eventName,function(e,response){
				if(response!=0)
		            	{

				            var csv = Papa.unparse({
										fields: keyFields,
										data:response
							});	   
							var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
	   						var link = document.createElement("a");    
	    					link.href = uri;
	    					link.style = "visibility:hidden";
	    					link.download = "TEAM_DETAILS.csv";
	    
	    					document.body.appendChild(link);
	    					link.click();
	    					document.body.removeChild(link);         	


						}
						else
						{
				            $("#alreadySubscribed").modal({backdrop: 'static'});
				            $("#alreadySubscribedText").text("No Subscribers");
						}
			})	
		}
		
	},
	/*
	 *click on sponsor logo,
	 *open sponsor popup
	 */
	'click #sponsor': function(e) {
		e.preventDefault();

	/*	var lData, lData1;
		var lEvents = events.find({
			"_id": gEventId
		}).fetch();

		for (var j = 0; j < lEvents.length; j++) {
			lData = eventUploads.find({
				"_id": lEvents[j].sponsorPdf
			}).fetch();
			lData1 = eventUploads.find({
				"_id": lEvents[j].sponsorLogo
			}).fetch();
		}
		var s = lEvents[0].sponsorUrl.toString()
		if (lEvents) {
			if (!s.match(/^https?:\/\//i)) {
				s = 'http://' + s;
			}
			window.open(s, '_blank');*/
			$("#sponsorDownload").modal({
				backdrop: 'static'
			});
			//$('#downloadSponsorPdf').attr('href', lData[0].url());
			//$('#downloadSponsorLogo').attr('href', lData1[0].url());
			//$('#sponsorUrl').val(gSponsorUrl);
			//$('#sponsorMailId').val(gSponsorMailId);
		//}
	},
	
	/*
	 *click on cancel button of view event,
	 *check the previous location path, if its not undefined
	 *route to that path,
	 *else to myEvents 
	 */
	'click #eventSubscribeCancel': function(e) {
		e.preventDefault();
		if (Session.get("previousLocationPath") !== undefined) {
			var previousPath = Session.get("previousLocationPath");
			Session.set("previousLocationPath", undefined);
			Session.set("previousLocationPath", null);
			Router.go(previousPath);
		} else {
			Router.go("/myEvents");
		}
	},
	
	/*not used*/
	'click #popupClose': function(e) {
		e.preventDefault();
		$('#viewSponsorUpload').modal('hide');
	},
	
	/*
	 * click on venue route to google map 
	 *
	 */
	"click #domainName": function() {
		/*var lEvents = events.findOne({
			"_id": Router.current().params._PostId
		});
		window.open('http://maps.google.com/?q=' + lEvents.domainName, '_blank');*/
		$("#content").empty();
		//var instance = UI.renderWithData(Template.viewGoogleDetailsVenue, { });
		 Blaze.render(Template.viewGoogleDetailsVenue, $("#content")[0]);
      //  UI.insert(instance, $("#content")[0]);
		$("#viewGoogleDetailsVenue").modal({
				backdrop: 'static'
		});
	},

	/*
	 * set the select html attribute #projectName
	 * to remove duplicate projectNames as option
	 *
	 */
	"click #projectName": function() {
		var lExist = {};
		$('select > option').each(function() {
			if (lExist[$(this).val()])
				$(this).remove();
			else
				lExist[$(this).val()] = true;
		});
	},
	
	/*
	 * click on subscribe check the eventType 
	 * whether it is individual event(eventType=1),
	 * or group(eventType!=1).
	 * if it is a individual event meteor method checkSubscription is called
	 * else checkSubscriptionForTeam is called.
	 * based on the response of meteor call confirmation dialogue is shown
	 */
	'click #eventSubscribe': function(e) {
		e.preventDefault();
		var user = [];
		//fetch current logged in userId
		userId = Meteor.users.findOne({
			"_id": Meteor.userId()
		});
		user.push(userId.userId);
		//fetch event
		var eveType = events.findOne({
			"_id": gEventId
		});
		//fetch project type of event
		/*var projType = projects.findOne({
			"_id": eveType.projectId.toString()
		});*/

		var gEventLists = events.find({
			"_id": gEventId
		}).fetch();
		//if project is individual
		if (eveType.projectType===1){//projType.projectType === 1) {
			//set data as object format
			var lData = {
				eventParticipants: userId.userId.toString(),
				eventId: gEventId
			}
			//call meteor method checkSubscription to check participant is already subscribed or blacklisted 
			//by event organizer
			Meteor.call("checkSubscription", lData, function(error, response) {
				//if participant is not subscribed and not blacklisted, allow him to subscribe
				if (response == true) {
					$("#confirmModalwithterms").modal({
						backdrop: 'static'
					});
					$("#conFirmHeaderA").text("Subscribe To ");
					//set the event name to subscribe, check string is not more than 22 char
					//if more than 22, append ..
					if (gEventLists[0].eventName.toString().length >= 22) {
						var data = gEventLists[0].eventName.toString().substring(0, 22).trim() + "..";
						$('#conFirmHeaderA').append('<span id="dataConfirm">' + data + '</span>');
					} else $('#conFirmHeaderA').append('<span id="dataConfirm">' + gEventLists[0].eventName + '</span>');
					$('#conFirmHeaderA').append('<span id="questConfirm"> ?</span>');
				} 
				//if participant is already subscribed to the event show an 
				else if (response == false) {
					$("#alreadySubscribed").modal({
						backdrop: 'static'
					});
					$("#alreadySubscribedText").text("Already Subscribed To");
					//set the event name to subscribe, check string is not more than 12 char
					//if more than 22, append ..
					if (gEventLists[0].eventName.toString().length >= 12) {
						var data = gEventLists[0].eventName.toString().substring(0, 12).trim() + "..";
						$('#alreadySubscribedText').append('<span id="dataConfirm">&nbsp;' + data + '</span>');

					} else $('#alreadySubscribedText').append('<span id="dataConfirm">&nbsp;' + gEventLists[0].eventName + '</span>');
				}
				//if user is black listed by organizer doesn't allow him to subscribe
				else if (response == null) {
					$("#alreadySubscribed").modal({
						backdrop: 'static'
					});
					$("#alreadySubscribedText").text("Error Subscription: You cannot subscribe");
				} else {
				}
			})
		}
		//if project is not individual
		else {
			userId = Meteor.users.findOne({
				"_id": Meteor.userId()
			});
			var lData = {
				teamOwner: userId.userId.toString(),
				eventId: gEventId
			}
			
			//call meteor method checkSubscriptionForTeam to check any of teams under this team owner
			//is subscribed,
			// or team owner is blacklisted by event organizer
			Meteor.call("checkSubscriptionForTeam", lData, function(error, response) {
				//if teams under this team owner is not subscribed and team owner is not blacklisted
				if (response == true) {
					var gEventLists = events.find({
						"_id": gEventId
					}).fetch();
					$("input[name='mainTag']:first").prop("checked", true);
					//show all his teams 
					$("#teamSubscribePopupQ").modal({
						backdrop: 'static'
					});
					//set the event name to subscribe, check string is not more than 25 char
					//if more than 22, append ..

					$("#setEventNameHeader").text("Subscribe To").css("font-weight", "normal");
					if (gEventLists[0].eventName.toString().length >= 25) {
						var data = gEventLists[0].eventName.toString().substring(0, 25).trim() + "..";
						$('#setEventNameHeader').append('<span id="dataConfirm">&nbsp;' + data + '</span>');
					} else $('#setEventNameHeader').append('<span id="dataConfirm">&nbsp;' + gEventLists[0].eventName + '</span>');
					$('#setEventNameHeader').append('<span id="questConfirm">&nbsp; ?</span>');
				}
				
				//if anyone team of teams under this team owner is subscribed show an 
				else if (typeof response == "string") {
					var gEventLists = events.find({
						"_id": gEventId
					}).fetch();
					$("#alreadySubscribed").modal({
						backdrop: 'static'
					});
					$("#alreadySubscribedText").text("Your Team");
					$(".alreadySubPopup").css("width", "424px");
					$(".alreadySubPopup-sm").css("width", "424px")
					//set the team name to subscribe, check string is not more than 26 char
					//if more than 26, append ..
					if (response.toString().length >=26) {
						var data = response.toString().substring(0, 26).trim() + "..";
						$('#alreadySubscribedText').append('<span id="dataConfirm">&nbsp;' + data + '</span>');
					} else if (response.toString().length < 26) {
						$('#alreadySubscribedText').append('<span id="dataConfirm">&nbsp;' + response + '</span>');
					}
					//set the event name to subscribe, check string is not more than 7 char
					//if more than 7, append ..
					$("#alreadySubscribedText").append('<span id="dataConfirm1">&nbsp;Already Subscribed To&nbsp;</span>').css("font-weight", "normal");
					if (gEventLists[0].eventName.toString().length >= 7) {
						var data = gEventLists[0].eventName.toString().substring(0, 7).trim() + "..";
						$('#alreadySubscribedText').append('<span id="dataConfirm">' + data + '</span>');
					} else if (gEventLists[0].eventName.toString().length < 7)
						$('#alreadySubscribedText').append('<span id="dataConfirm">' + gEventLists[0].eventName + '</span>');
				}
				//if there are no teams under this team owner for this type of project show an 
				else if (response == false) {
					$("#alreadySubscribed").modal({
						backdrop: 'static'
					});
					$("#alreadySubscribedText").text("Error Subscription: No teams for the game");
				}
				//if team owner is black listed show an .
				else{
					$("#alreadySubscribed").modal({
						backdrop: 'static'
					});
					$("#alreadySubscribedText").text("Error Subscription:You cannot subscribe");
				}
			});
		}
	},
	'click #eventTournamentUpdates': function(e) {
		e.preventDefault();
		var details = events.findOne({"_id":Router.current().params._PostId});
		var userId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(details.eventOrganizer.toString()===userId.userId.toString())
			window.open(Router.url("eventTournamentDraws", {_id: details.eventSubId}));
		else{
			$("#eventTournamentUpdates").css("cursor","default");
		}

	},
	/*
	 * when team is selected and ok button is clicked
	 * teamId is saved from html view, eventId is fetched,
	 * and teamOwner is fetched.
	 * then call meteor method subscribe to event
	 */
	'click #yesButtonSubTeamEvent': function(e) {
		e.preventDefault();
		$("#confirmDomProvideDetailsTeam").val("");
		var sAccept  = $("#checkAcceptboxTeam").prop("checked")
		if(sAccept==true){
			$("#teamSubscribePopupQ").modal("hide");
			var user = [];
			userId = Meteor.users.findOne({
				"_id": Meteor.userId()
			});
			var teamId = $('input[name="mainTag"]:checked').attr("id").toString();
			user.push(userId.userId);
			var lData = {
				teamOwner: userId.userId.toString(),
				eventParticipants: teamId,
				eventId: gEventId
			}
			var gEventLists = events.findOne({
				"_id": gEventId
			});
			Meteor.call("subscribeToEvent", lData, function(error, response) {
				if (response) {
					//$("#teamSubscribePopupQ").modal("hide");
					
					if (Session.get("previousLocationPath") !== undefined) {
						var previousPath = Session.get("previousLocationPath");
						Session.set("previousLocationPath", undefined);
						Session.set("previousLocationPath", null);
						Router.go(previousPath);
					} else {
					//	$("#teamSubscribePopupQ").modal("hide");
						Router.go("/myEvents");
					}
				}
			});
		}else{

	  	    $("#confirmDomProvideDetailsTeam").val("Please accept terms & conditions").css("color","red");
            $("#confirmDomProvideDetailsTeam").css("font-size","10px");
	  }
	},
	
	'change #checkAcceptbox':function(e){
		e.preventDefault();
		$("#confirmDomProvideDetails").val("");
	},
	'change #checkAcceptboxTeam':function(e){
		e.preventDefault();
		$("#confirmDomProvideDetailsTeam").val("");
	},
	/*
	 * when  ok button is clicked,
	 * user id is fetched, eventId is fetched,
	 * then call meteor method subscribe to event
	 */
	'click #yesButtonWithATC': function(e) {
		e.preventDefault();
		$("#confirmDomProvideDetails").val("");
		var sAccept  = $("#checkAcceptbox").prop("checked")
		if(sAccept===true){
			var user = [];
			userId = Meteor.users.findOne({
				"_id": Meteor.userId()
			});
			user.push(userId.userId);
			var lData = {
				eventParticipants: user,
				eventId: gEventId
			}
			Meteor.call("subscribeToEvent", lData, function(error, response) {
				if (response) {
					$("#confirmModalwithterms").modal('hide');
					
					if (Session.get("previousLocationPath") !== undefined) {
						var previousPath = Session.get("previousLocationPath");
						Session.set("previousLocationPath", undefined);
						Session.set("previousLocationPath", null);
						$("#confirmModalwithterms").modal("hide");
						Router.go(previousPath);
					} else {
						$("#confirmModalwithterms").modal("hide");
						Router.go("/myEvents");
					}
				} else {
				}
			});
	  }else{

	  	    $("#confirmDomProvideDetails").val("Please accept terms & conditions").css("color","red");
            $("#confirmDomProvideDetails").css("font-size","10px");
	  }
	},
	
	/*
	 * on click of cancel button of team subscription
	 */
	'click #noButtonSubTeamEvent': function(e) {
		e.preventDefault();
		$("#confirmDomProvideDetailsTeam").val("")
		$("input[name='mainTag']:first").prop("checked", true);
		$("#teamSubscribePopupQ").modal("hide");
	},
	
	//click ok button  of alreadySubscribedConfirm modal
	'click #aYesButton': function(e) {
		e.preventDefault();
		$("#alreadySubscribed").modal('hide');
	},
	
	//click ok button  of Confirm modal
	'click #noButtonWithATC': function(e) {
		e.preventDefault();
		$("#confirmDomProvideDetails").val("");
		$("#confirmModalwithterms").modal('hide');
	},
	
	//click on current entries show currently subscribed users
	'click #currentEntriesListDropDown': function(e) {
		e.preventDefault();
		if ($("#currentEntriesListDropDown").hasClass("open")) {
			$("#currentEntriesListDropDown").removeClass("open");
			$("#currentEntriesListDropDown").children("ul").slideUp("fast");
		} else {
			$("#currentEntriesListDropDown").addClass("open");
			$("#currentEntriesListDropDown").children("ul").slideDown("fast");
		}
	},

	/* whenever currentEntriesListDropDown  is open 
	 * onClick of outside currentEntriesListDropDown
	 * close the currentEntriesListDropDown menu
	 */
	'click': function(e) {
		//e.preventDefault();
		var currentEntriesListDropDown = $("#currentEntriesListDropDown");
		if (!currentEntriesListDropDown.is(e.target) // if the target of the click isn't the container...
			&& currentEntriesListDropDown.has(e.target).length === 0) // ... nor a descendant of the container
		{
			if ($("#currentEntriesListDropDown").hasClass("open")) {
				$("#currentEntriesListDropDown").removeClass("open");
				$("#currentEntriesListDropDown").children("ul").slideUp("fast");
			}
		}
	},
	
	/*
	 * mouseover on sponImg show image alt
	 */
	'mouseover #sponImg': function(e) {
		e.preventDefault();
		$('.sponsorHoverText').css("visibility", "visible");
	},
	
	/*
	 * mouseout of sponImg
	 * hide the visibility of image alt
	 */
	'mouseout #sponImg': function(e) {
		e.preventDefault();
		$('.sponsorHoverText').css("visibility", "hidden");
	},

	/*
	 * click on  google map ok button to close popup
	 *
	 */
	'click #googleVenueYes':function(e){
		e.preventDefault();
		$("#viewGoogleDetailsVenue").modal("hide");
	}
});

/**
 * client side subscription to the server side publications
 * @SubscribeName: eventUploads (used to subscribe to eventUploads)
 *                  to get the eventUploads list
 * @SubscribeName: allEvents (used to subscribe to events)
 *                  to get the events list
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 *
 */
Template.sponsorDownload.onCreated(function(){
	this.subscribe("eventUploads");
	//this.subscribe("users");
	//this.subscribe("allEvents");
});

/**
 * template helpers which connects viewEvents.html
 * @methodName : lDownloadSponsorPdf is a function to fetch events for an Id
 * 			and fetch sponsorPdf value from eventUploads collections.
 * @methodName : lDownloadSponsorLogo is a function to fetch events for an Id
 * 			and fetch sponsorLogo value from eventUploads collections
 * @methodName : lDownloadSponsorURL is a function to fetch events for an Id
 * 			and fetch sponsorURL value 
 */
Template.sponsorDownload.helpers({
	lDownloadSponsorPdf: function(){
		try{
			var lData, lData1;
			var lEvents = events.findOne({
				"_id": Router.current().params._PostId
			});
			if(lEvents.sponsorPdf!=undefined){
			lData = eventUploads.find({
				"_id": lEvents.sponsorPdf.toString()
			}).fetch()
			return lData;
			}
	    }catch(e){}
	},

	lDownloadSponsorLogo: function(){
		var lData, lData1;
		var lEvents = events.findOne({
			"_id": Router.current().params._PostId
		});
		if(lEvents.sponsorLogo!=undefined){
			lData = eventUploads.find({
				"_id": lEvents.sponsorLogo.toString()
			}).fetch()
		return lData;
		}
	},

	lGoSponsorURL :function(){

		var lEvents = events.findOne({
			"_id": Router.current().params._PostId
		});
		if(lEvents.sponsorUrl!=undefined){
			return lEvents.sponsorUrl.toString()
		}
	}
});

/**
 * Events handler for the template sponsorDownload.html
 */
Template.sponsorDownload.events({
	/*
	 *click on sponsor url ,
	 *fetch the sponsor url using eventId of events collection, 
	 *from eventUploads collection,
	 *convert url to string and match with http,
	 *then use jquery window.open to open the link 
	 */
	'click #sponURLGo':function(e){
		var lEvents = events.findOne({
			"_id": gEventId
		});

		var s = lEvents.sponsorUrl.toString()
		if (lEvents) {
			if (!s.match(/^https?:\/\//i)) {
				s = 'http://' + s;
			}
		}
			window.open(s, '_blank');
	},

	'click #sponsorDownloadOk':function(e){
		e.preventDefault()
		$("#sponsorDownload").modal('hide');
	},

});


/**
 * on created of pop up template  googleDetailsVenue.html(pop up on click of google map image).
 */
Template.viewGoogleDetailsVenue.onCreated(function() {  
	this.subscribe("allEvents");
});

Template.viewGoogleDetailsVenue.onRendered(function() {
	//var geocoder = new google.maps.Geocoder();
	this.autorun(function () {
		if (GoogleMaps.loaded()) {
			if($("input[name=subLat]").attr("id")!="0" && $("input[name=subLong]").attr("id")!="0"){
		    $("#pac-input-view1").geocomplete({
				map: '#map',
				mapOptions: {
				scrollwheel:true,
				    panControl: true,
				    zoomControl: true,
				},
				markerOptions: {
				    draggable: false,
				},
				//bounds:false,
				location:[$("input[name=subLat]").attr("id"),$("input[name=subLong]").attr("id")]
				});
		    	$("#pac-input-view").val($("input[name=subAddress]").attr("id")).css("readonly","readonly");
		    }
		    else{
		    	$("#pac-input-view1").geocomplete({
					map: '#map',
					mapOptions: {
					scrollwheel:true,
					    panControl: true,
					    zoomControl: true,
					},
					markerOptions: {
					    draggable: false,
					},
					location:$("#domainName").val()
				});
				$("#pac-input-view").val($("input[name=subAddress]").attr("id")).css("readonly","readonly");
		 	}
		}
	});
});

Template.viewGoogleDetailsVenue.helpers({  
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
          var loc =  new google.maps.LatLng(12.2964548,76.6493876);
          geocoder = new google.maps.Geocoder();
         return {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(22.0427983,-50.3580818),
            zoom: 25,
                  panControl: true,
            zoomControl: true,
          }
      }    //return map;
  }
});


var viewGoogle = function(){

}