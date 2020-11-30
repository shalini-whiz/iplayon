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

import { routeForsubscription } from '../../../routes/hooks.js'

var handle2 = false; //handle1 is used to load the events on scroll
Template.upcomingEvents.onCreated(function() {
    //if (Meteor.user()) {
    this.subscribe("onlyLoggedIn");
    var self = this;
    self.autorun(function() {
        handle2 = Meteor.subscribeWithPagination("eventUpcoming", 8);
    });
    //this.subscribe("eventUpcoming");
    var lEventLists = "";
    Session.set("loggedInUserId", undefined)
    this.subscribe("upcomingListsReadStatus");
    this.subscribe("onlyLoggedInALLRoles");
    
    /*
     *setting previous location path as upcoming events, to come back to the
     *upcoming events path from other paths on click of cancel button
     */
    Session.set("previousLocationPath", Iron.Location.get().path);
    //}
});

/**
 * On destroy of template stop handle1 subscription and
 * set used sessions to null and undefined
 */
Template.upcomingEvents.onDestroyed(function() {
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
    Session.set("reee", undefined);
    Session.set("reee", null);
    Session.set("rec", null);
    Session.set("rec", undefined);
    Session.set("rec2", null);
    Session.set("rec2", undefined);
    Session.set("eveUTourId", undefined);
    Session.set("eveUTourId", null);
    Session.set("clickedIDToRed", undefined)
    Session.set("clickedIDToRed", null);

});
var jsonSP = []
    /**
     * template helpers which connects upcomingEvents.html
     * @methodName : lEvents is a function to find events
     */
Template.upcomingEvents.helpers({

    lEventsUnTour: function() {
        if (Session.get("eveUTourId") !== undefined) {
            return ReactiveMethod.call("eventsUnderTourn", Session.get("eveUTourId").toString());
        } else {
            return ReactiveMethod.call("eventsUnderTourn", Session.get("eveUTourId").toString());
        }
    },
    threeCharc:function(data) {
        try{
        if(data){
            return String(data.toString()).toUpperCase().substr(0, 3);
        }
        }catch(e){
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
        /*var sortCriteria = Template.instance().sortDomainName.get();*/
        /*if (sortCriteria !== 0) {
			lEventListing = "";
			if (sortCriteria == 3) {
				return events.find({}, {
					sort: {
						"domainName": 1
					}
				}).fetch();
			} else if (sortCriteria == 1) {
				return events.find({}, {
					sort: {
						"eventStartDate": 1
					}
				}).fetch();
			} else if (sortCriteria == 2) {
				return events.find({}, {
					sort: {
						"projectName": 1
					}
				}).fetch();
			}
		} else {
			lEventListing = events.find({}).fetch();
			return events.find({}).fetch();
		}*/
        var s = events.find({}).fetch();
        /*var jsonS = []
               for(var i=0;i<s.length;i++){
                  $.get("http://api.timezonedb.com/?lat="+s[i].timezoneIdEventLat+"&lng="+s[i].timezoneIdEventLng+"&format=json&key=MR22FNA90DU3", function(data, status){
                  	if(s[i].eventStartDate>=new Date(data.timestamp*1000))
                  	jsonS[i]=s[i]
                  });
                 // var snewDate = Meteor.http.call("GET",  "http://api.timezonedb.com/?lat="+s[i].timezoneIdEventLat+"&lng="+s[i].timezoneIdEventLng+"&format=json&key=MR22FNA90DU3")
                 return jsonS[i]
               }*/
        // settingTime()


        return s //ReactiveMethod.call("upEventsMeth");
    },

    //not used
    lConfirmHeader: function() {
        var eventLists = events.find({
            "_id": this._id
        }).fetch();
    },

    lUEvents: function() {
        try {
            var jsonS = [];

            if (Session.get("sortCriteria") == 1) {
                return events.find({
                    tournamentEvent: true,
                }, {
                    sort: {
                        eventName: 1
                    }
                }).fetch();
                /*.forEach(function(e,i){
                					if(moment(e.eventEndDate1).format()>=moment.tz(e.timeZoneName).format()){
                	                	jsonS.push(e)
                	            	}
                				})*/
            } else if (Session.get("sortCriteria") == 2) {
                return events.find({
                        tournamentEvent: true
                    }, {
                        sort: {
                            domainName: 1
                        }
                    }).fetch()
                    /*.forEach(function(e,i){
                    					if(moment(e.eventEndDate1).format()>=moment.tz(e.timeZoneName).format()){
                    	                	jsonS.push(e)
                    	            	}
                    				})*/
            } else if (Session.get("sortCriteria") == 3) {
                return events.find({
                        tournamentEvent: true
                    }, {
                        sort: {
                            eventStartDate1: 1
                        }
                    }).fetch()
                    /*forEach(function(e,i){
                    					if(moment(e.eventEndDate1).format()>=moment.tz(e.timeZoneName).format()){
                    	                	jsonS.push(e)
                    	            	}
                    				})*/
            } else {
                return events.find({
                        tournamentEvent: true
                    }).fetch()
                    /*forEach(function(e,i){
                    					if(moment(e.eventEndDate1).format()>=moment.tz(e.timeZoneName).format()){
                    	                	jsonS.push(e)
                    	            	}
                    				})*/
            }
            //return jsonS;
        } catch (e) {}
        //Meteor.call("")
    }


});


/**
 * On rendered of template upcomingEvents.html initialize css bootstrap
 * niceScroll and  undefine the sessions
 */
Template.upcomingEvents.onRendered(function() {
    /*change the class of upcomingEvents button to change the color
	 which shows the button is pressed*/
    $('#upcomingEvents').removeClass("ip_button_DarkGrey");
    $('#upcomingEvents').addClass("ip_button_White");

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
Template.upcomingEvents.events({

    'click .accordion_head': function(e) {
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
        //handle1.stop();
    },

    /*not used*/
    'click #editEvent': function(e) {
        e.preventDefault();
        //handle1.stop()
        Session.set('sortCriteria1', null);
        Session.set('sortCriteria1', undefined);
        var eventLists = events.find({
            "_id": this._id
        }).fetch();
        Router.go("editEvents", {
            _PostId: this._id
        });
    },
    /*'click #viewEvent': function(e) {
        e.preventDefault();
        var routeStatus = true;
        if (Meteor.user().role == "Player") {
            var userInfo = userDetailssTT.findOne({
                "userId": Meteor.userId()
            })
            if (userInfo && userInfo.gender)
                routeStatus = true;
            else routeStatus = false;
        }
        if (routeStatus) {

            Session.set('sortCriteria1', null);
            Session.set('sortCriteria1', undefined);
            var id = this._id;
            Session.set("clickedIDToRed", this._id)
            var eventLists = events.findOne({
                "_id": this._id
            });
            if (eventLists.subscriptionTypeHyper != null && eventLists.subscriptionTypeHyper !== undefined && eventLists.subscriptionTypeHyper == 1 && eventLists.hyperLinkValue) {
                $("#confirmModalRedirect").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $("#confirmModalRedirectLog").text("Redirect to hyperlink to subscribe?");
            } else {

                if (eventLists && eventLists.eventOrganizer) {
                    var findWho = undefined;
                    Meteor.call("findWho_RestSubscription", eventLists.eventOrganizer, function(e, res) {
                            try {
                                if (res != undefined) {
                                    var userLoggedInRole = Meteor.user().role;
                                    var eventOrganizerDet = res;
                                    var loggedInUserDetails;
                                    if (userLoggedInRole == "Player") {
                                        if (eventOrganizerDet.role.trim().toString() == "Academy" || eventOrganizerDet.role.trim().toString() == "Association"||eventOrganizerDet.role.trim().toString() == "Organiser") {
                                            loggedInUserDetails = userDetailssTT.findOne({
                                                "userId": Meteor.userId()
                                                    
                                            });
                                            if (loggedInUserDetails == undefined) {
                                                alert("You are not permitted  to subscribe, Please contact your association")
                                            }
                                        } else if (eventOrganizerDet.role.trim().toString() !== "Academy" || eventOrganizerDet.role.trim().toString() !== "Association") {
                                            loggedInUserDetails = userDetailssTT.findOne({
                                                "userId": Meteor.userId()
                                            });
                                            if (loggedInUserDetails == undefined) {
                                                alert("You are not permitted  to subscribe, Please contact your association")
                                            } else {
                                                loggedInUserDetails = false;
                                                Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                Router.go("subscribeToTournamemnt", {
                                                    _PostId: id
                                                });
                                            }
                                        }
                                    } else if (userLoggedInRole == "Academy") {
                                        if (eventOrganizerDet.role.trim().toString() == "Academy" || eventOrganizerDet.role.trim().toString() == "Association") {
                                            loggedInUserDetails = academyDetails.findOne({
                                                "userId": Meteor.userId(),
                                                affiliatedTo: {
                                                    $nin: ["other", null, undefined]
                                                },
                                            })
                                            if (loggedInUserDetails == undefined) {
                                                alert("You are not permitted to subscribe, Please contact your association")
                                            }
                                        } else {
                                            alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                            loggedInUserDetails = false;
                                        }
                                    } else if (userLoggedInRole == "Association" && Meteor.user().associationType == "District/City") {
                                        if (eventOrganizerDet.role.trim().toString() == "Academy" || eventOrganizerDet.role.trim().toString() == "Association") {
                                            loggedInUserDetails = associationDetails.findOne({
                                                "userId": Meteor.userId(),
                                                affiliatedTo: {
                                                    $nin: ["other", null, undefined]
                                                }
                                            })
                                            if (loggedInUserDetails == undefined) {
                                                alert("You are not permitted to subscribe, Please contact your state association")
                                            }
                                        } else {
                                            alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                            loggedInUserDetails = false;
                                        }
                                    } else if (userLoggedInRole == "Association" && Meteor.user().associationType == "State/Province/County") {
                                        if (eventOrganizerDet.role.trim().toString() == "Academy" || eventOrganizerDet.role.trim().toString() == "Association") {
                                            loggedInUserDetails = associationDetails.findOne({
                                                "userId": Meteor.userId()
                                            })
                                            if (loggedInUserDetails == undefined) {
                                                alert("You are not permitted")
                                            }
                                        } else {
                                            alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                            loggedInUserDetails = false;
                                        }
                                    } else if (userLoggedInRole != "Academy" || userLoggedInRole != "Player" || userLoggedInRole != "Association") {
                                        alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                        loggedInUserDetails = false;
                                    } //end of fetching login details

                                    if (loggedInUserDetails) {
                                        Meteor.call("subscriptionRestrictionsFind", eventLists._id, eventLists.eventOrganizer, function(e, res) {
                                                try {
                                                    if (res) {
                                                        var selectedType_sub = res.selectionType;
                                                        var selectedIds_sub = res.selectedIds;
                                                        //if type is all
                                                        if (selectedType_sub == "all") {
                                                            //if role is player
                                                            if (userLoggedInRole == "Player" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                Router.go("subscribeToTournamemnt", {
                                                                    _PostId: id
                                                                });
                                                            }
                                                            //if role is academy and  event orgnaizer is association or academy
                                                            else if (userLoggedInRole == "Academy" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                if (eventOrganizerDet.role == "Association" || eventOrganizerDet.role == "Academy") {
                                                                    Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                    Router.go("entryFromAcademy", {
                                                                        _PostId: id,
                                                                        page: 1
                                                                    });
                                                                } else {
                                                                    alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                                }
                                                            }
                                                            //if role is district association and organizer is district association
                                                            else if (userLoggedInRole == "Association" && Meteor.user().associationType == "District/City" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                if (eventOrganizerDet.role == "Association") {
                                                                    Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                    Router.go("entryFromAcademy", {
                                                                        _PostId: id,
                                                                        page: 1
                                                                    });
                                                                } else {
                                                                    alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                                }
                                                            }
                                                            //if role is state association and organizer is state assoc
                                                            else if (userLoggedInRole == "Association" && Meteor.user().associationType == "State/Province/County" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                                                    Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                    Router.go("entryFromAcademy", {
                                                                        _PostId: id,
                                                                        page: 1
                                                                    });
                                                                } else {
                                                                    alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                                }
                                                            }
                                                        } //end of all

                                                        //if type is self 
                                                        else if (selectedType_sub == "self") {

                                                            //if role is player
                                                            if (userLoggedInRole == "Player" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                //if role is player and organizer is da, user's associationId matches with orgnzer user id
                                                                if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "District/City") {
                                                                    if (loggedInUserDetails.associationId && loggedInUserDetails.associationId != undefined && loggedInUserDetails.associationId != "other") {
                                                                        if (loggedInUserDetails.associationId == eventOrganizerDet.userId) {
                                                                            Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                            Router.go("subscribeToTournamemnt", {
                                                                                _PostId: id
                                                                            });
                                                                        } else {
                                                                            alert("You are not permitted to subscribe as per subscription restrictions")
                                                                        }
                                                                    }
                                                                }
                                                                //if role is player and organizer is sa, user's associationId or parent associaition id matches with orgnzer user id
                                                                else if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                                                    if ((loggedInUserDetails.associationId && loggedInUserDetails.associationId != undefined && loggedInUserDetails.associationId != "other") ||
                                                                        (loggedInUserDetails.parentAssociationId && loggedInUserDetails.parentAssociationId != undefined && userLoggedInRole.parentAssociationId != "other")) {
                                                                        if ((loggedInUserDetails.associationId == eventOrganizerDet.userId) ||
                                                                            (loggedInUserDetails.parentAssociationId == eventOrganizerDet.userId)) {
                                                                            Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                            Router.go("subscribeToTournamemnt", {
                                                                                _PostId: id
                                                                            });
                                                                        } else {
                                                                            alert("You are not permitted to subscribe as per subscription restrictions")
                                                                        }
                                                                    }
                                                                }
                                                                //if role is player and organzier is academy, users clubNameId matches with orgn userId
                                                                else if (eventOrganizerDet.role == "Academy") {
                                                                    if (loggedInUserDetails.clubNameId && loggedInUserDetails.clubNameId != undefined && loggedInUserDetails.clubNameId != "other") {
                                                                        if (loggedInUserDetails.clubNameId == eventOrganizerDet.userId) {
                                                                            Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                            Router.go("subscribeToTournamemnt", {
                                                                                _PostId: id
                                                                            });
                                                                        } else {
                                                                            alert("You are not permitted to subscribe as per subscription restrictions")
                                                                        }
                                                                    } else {
                                                                        alert("You are not permitted to subscribe as per subscription restrictions")
                                                                    }
                                                                }
                                                            } //end of role player

                                                            //if role is academy
                                                            if (userLoggedInRole == "Academy" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {

                                                                //only if organizer s assoc
                                                                if (eventOrganizerDet.role == "Association") {
                                                                    //organizer is da assoicId matches with org userId
                                                                    if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "District/City") {
                                                                        if (loggedInUserDetails.associationId && loggedInUserDetails.associationId != undefined && loggedInUserDetails.associationId != "other") {
                                                                            if (loggedInUserDetails.associationId == eventOrganizerDet.userId) {
                                                                                Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                                Router.go("entryFromAcademy", {
                                                                                    _PostId: id,
                                                                                    page: 1
                                                                                });
                                                                            } else {
                                                                                alert("You are not permitted to subscribe as per subscription restrictions")
                                                                            }
                                                                        }
                                                                    }
                                                                    //organizer is sa, user's associationId or parent associaition id matches with orgnzer user id
                                                                    else if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                                                        if ((loggedInUserDetails.associationId && loggedInUserDetails.associationId != undefined && loggedInUserDetails.associationId != "other") ||
                                                                            (loggedInUserDetails.parentAssociationId && loggedInUserDetails.parentAssociationId != undefined && userLoggedInRole.parentAssociationId != "other")) {
                                                                            if ((loggedInUserDetails.associationId == eventOrganizerDet.userId) ||
                                                                                (loggedInUserDetails.parentAssociationId == eventOrganizerDet.userId)) {
                                                                                Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                                Router.go("entryFromAcademy", {
                                                                                    _PostId: id,
                                                                                    page: 1
                                                                                });
                                                                            } else {
                                                                                alert("You are not permitted to subscribe as per subscription restrictions")
                                                                            }
                                                                        }
                                                                    }
                                                                } //end assoc for academy

                                                                //if organized by the same academy
                                                                else if (eventOrganizerDet.role == "Academy" && eventOrganizerDet.userId == Meteor.userId()) {
                                                                    Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                    Router.go("entryFromAcademy", {
                                                                        _PostId: id,
                                                                        page: 1
                                                                    });
                                                                } //end of acad for acad
                                                                else {
                                                                    alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                                }

                                                            } //end of role academy

                                                            //role da
                                                            else if (userLoggedInRole == "Association" && Meteor.user().associationType == "District/City" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                //only if organizer s assoc
                                                                if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                                                    //if parentAssoId matches with eveOrg userID
                                                                    if (loggedInUserDetails.parentAssociationId && loggedInUserDetails.parentAssociationId != undefined && loggedInUserDetails.parentAssociationId != "other") {
                                                                        if (loggedInUserDetails.parentAssociationId == eventOrganizerDet.userId) {
                                                                            Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                            Router.go("entryFromAcademy", {
                                                                                _PostId: id,
                                                                                page: 1
                                                                            });
                                                                        } else {
                                                                            alert("You are not permitted to subscribe as per subscription restrictions")
                                                                        }
                                                                    } //end for parent
                                                                } //end sa for da

                                                                //if organizer itself is loggedIn da
                                                                else if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "District/City") {
                                                                    if (eventOrganizerDet.userId == Meteor.userId()) {
                                                                        Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                        Router.go("entryFromAcademy", {
                                                                            _PostId: id,
                                                                            page: 1
                                                                        });
                                                                    } else {
                                                                        alert("You are not permitted to subscribe as per subscription restrictions")
                                                                    }
                                                                } //end da to da
                                                                else {
                                                                    alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                                }

                                                            } //end of role da

                                                            //role sa only if the eventorganized by itself
                                                            else if (userLoggedInRole == "Association" && Meteor.user().associationType == "State/Province/County" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                if (eventOrganizerDet.userId == Meteor.userId()) {
                                                                    Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                    Router.go("entryFromAcademy", {
                                                                        _PostId: id,
                                                                        page: 1
                                                                    });
                                                                } //end of sa to itself
                                                                else {
                                                                    alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                                }
                                                            } //end of role sa

                                                        } //end of self

                                                        //if type is restrict
                                                        else if (selectedType_sub == "restrict" || selectedType_sub == "pick") {
                                                            //if role is player
                                                            if (userLoggedInRole == "Player" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                //if role is player and organizer is da, user's associationId matches with orgnzer user id
                                                                if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "District/City") {
                                                                    if (loggedInUserDetails.associationId && loggedInUserDetails.associationId != undefined && loggedInUserDetails.associationId != "other") {
                                                                        if (_.contains(selectedIds_sub, loggedInUserDetails.associationId)) {
                                                                            Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                            Router.go("subscribeToTournamemnt", {
                                                                                _PostId: id
                                                                            });
                                                                        } else {
                                                                            alert("You are not permitted to subscribe as per subscription restrictions")
                                                                        }
                                                                    }
                                                                } //end da to player

                                                                //if role is player and org is sa
                                                                else if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                                                    if ((loggedInUserDetails.associationId && loggedInUserDetails.associationId != undefined && loggedInUserDetails.associationId != "other") ||
                                                                        (loggedInUserDetails.parentAssociationId && loggedInUserDetails.parentAssociationId != undefined && userLoggedInRole.parentAssociationId != "other")) {
                                                                        if ((_.contains(selectedIds_sub, loggedInUserDetails.associationId)) ||
                                                                            (_.contains(selectedIds_sub, loggedInUserDetails.parentAssociationId))) {
                                                                            Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                            Router.go("subscribeToTournamemnt", {
                                                                                _PostId: id
                                                                            });
                                                                        } else {
                                                                            alert("You are not permitted to subscribe as per subscription restrictions")
                                                                        }
                                                                    }
                                                                } //end sa to player

                                                                //if role is player and org is aca
                                                                else if (eventOrganizerDet.role == "Academy") {
                                                                    if (loggedInUserDetails.clubNameId && loggedInUserDetails.clubNameId != undefined && loggedInUserDetails.clubNameId != "other") {
                                                                        if (_.contains(selectedIds_sub, loggedInUserDetails.clubNameId)) {
                                                                            Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                            Router.go("subscribeToTournamemnt", {
                                                                                _PostId: id
                                                                            });
                                                                        } else {
                                                                            alert("You are not permitted to subscribe as per subscription restrictions")
                                                                        }
                                                                    } else {
                                                                        alert("You are not permitted to subscribe as per subscription restrictions")
                                                                    }
                                                                } //end aca to player
                                                                else {
                                                                    alert("You are not permitted to subscribe as per subscription restrictions")
                                                                }

                                                            } //end of role player

                                                            //if role is academy
                                                            else if (userLoggedInRole == "Academy" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                //only if organizer s assoc
                                                                if (eventOrganizerDet.role == "Association") {

                                                                    //organizer is da assoicId matches with org userId
                                                                    if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "District/City") {
                                                                        if (loggedInUserDetails.associationId && loggedInUserDetails.associationId != undefined && loggedInUserDetails.associationId != "other") {
                                                                            if (_.contains(selectedIds_sub, loggedInUserDetails.associationId)) {
                                                                                Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                                Router.go("entryFromAcademy", {
                                                                                    _PostId: id,
                                                                                    page: 1
                                                                                });
                                                                            } else {
                                                                                alert("You are not permitted to subscribe as per subscription restrictions")
                                                                            }
                                                                        }
                                                                    } //end of da to acad

                                                                    //organizer is sa, user's associationId or parent associaition id matches with orgnzer user id
                                                                    else if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                                                        if ((loggedInUserDetails.associationId && loggedInUserDetails.associationId != undefined && loggedInUserDetails.associationId != "other") ||
                                                                            (loggedInUserDetails.parentAssociationId && loggedInUserDetails.parentAssociationId != undefined && userLoggedInRole.parentAssociationId != "other")) {
                                                                            if ((_.contains(selectedIds_sub, loggedInUserDetails.associationId)) ||
                                                                                (_.contains(selectedIds_sub, loggedInUserDetails.parentAssociationId))) {
                                                                                Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                                Router.go("entryFromAcademy", {
                                                                                    _PostId: id,
                                                                                    page: 1
                                                                                });
                                                                            } else {
                                                                                alert("You are not permitted to subscribe as per subscription restrictions")
                                                                            }
                                                                        }
                                                                    } //end of sa to acad

                                                                } //end of assoc to acad

                                                                //if organized by the same academy
                                                                else if (eventOrganizerDet.role == "Academy") {
                                                                    if (_.contains(selectedIds_sub, loggedInUserDetails.userId)) {
                                                                        Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                        Router.go("entryFromAcademy", {
                                                                            _PostId: id,
                                                                            page: 1
                                                                        });
                                                                    } //end oof contains
                                                                    else {
                                                                        alert("You are not permitted to subscribe as per subscription restrictions")
                                                                    }
                                                                } //end of acad for acad
                                                                else {
                                                                    alert("You are not permitted to subscribe as per subscription restrictions")
                                                                }

                                                            } //end of role aca

                                                            //if role is da
                                                            else if (userLoggedInRole == "Association" && Meteor.user().associationType == "District/City" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                //only if organizer s assoc
                                                                if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                                                    //if parentAssoId matches with eveOrg userID
                                                                    if (loggedInUserDetails.parentAssociationId && loggedInUserDetails.parentAssociationId != undefined && loggedInUserDetails.parentAssociationId != "other") {
                                                                        if (_.contains(selectedIds_sub, loggedInUserDetails.parentAssociationId)) {
                                                                            Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                            Router.go("entryFromAcademy", {
                                                                                _PostId: id,
                                                                                page: 1
                                                                            });
                                                                        } else {
                                                                            alert("You are not permitted to subscribe as per subscription restrictions")
                                                                        }
                                                                    } //end for parent
                                                                } //end sa for da

                                                                //if organizer itself is loggedIn da
                                                                else if (eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "District/City") {
                                                                    if (_.contains(selectedIds_sub, loggedInUserDetails.userId)) {
                                                                        Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                        Router.go("entryFromAcademy", {
                                                                            _PostId: id,
                                                                            page: 1
                                                                        });
                                                                    } else {
                                                                        alert("You are not permitted to subscribe as per subscription restrictions")
                                                                    }
                                                                } //end da to da
                                                                else {
                                                                    alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                                }

                                                            } //end of role da

                                                            //if role sa
                                                            else if (userLoggedInRole == "Association" && Meteor.user().associationType == "State/Province/County" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                if (_.contains(selectedIds_sub, loggedInUserDetails.userId)) {
                                                                    Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                    Router.go("entryFromAcademy", {
                                                                        _PostId: id,
                                                                        page: 1
                                                                    });
                                                                } //end of sa to sa
                                                                else {
                                                                    alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                                }

                                                            } //end of role sa

                                                        } //end of restrict

                                                        //if type is school only
                                                        else if(selectedType_sub == "schoolOnly"){
                                                            alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe. "+"Subscription is only for school")
                                                        }   
                                                        else if(selectedType_sub == "allExceptSchool"){
                                                            if (userLoggedInRole == "Player" && loggedInUserDetails != undefined && loggedInUserDetails != null && loggedInUserDetails != false) {
                                                                Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
                                                                Router.go("subscribeToTournamemnt", {
                                                                    _PostId: id
                                                                });
                                                            }
                                                            else {
                                                                alert("As " + userLoggedInRole + ", " + "You Cannot Subscribe");
                                                            }
                                                        }

                                                    } //end of res from 2nd meteor method
                                                } catch (e) {}
                                            }) //end of secon meteor method
                                    } //end of loggedInUserDetails


                                } //end of res!=undefined
                                else if (res == undefined) {
                                    alert("You cannot subscribe, because the tournament is not valid")
                                }

                            } catch (e) {}
                        }) //end of first meteor method call
                }
            }
        } else {
            alert("Please update your gender to subscribe");
        }


    },*/

    /*
     * click of view events button
     * call the upcomingListAndStatus with clicked event id,
     * and
     * route to viewEvent with PostId as
     * clicked eventId
     */
    /*'click #viewEvent': function(e) {
		Session.set('sortCriteria1', null);
		Session.set('sortCriteria1', undefined);
		e.preventDefault();
		//handle1.stop();
		var id=this._id
		Session.set("clickedIDToRed",this._id)
		var eventLists = events.findOne({
			"_id": this._id
		});
		if(eventLists&&eventLists.eventOrganizer){
			var findWho=undefined;
			Meteor.call("findWho",eventLists.eventOrganizer,function(e,res){
				try{
				if(res){
					findWho = res;
				}
				if(findWho){
					var findPerm = associationPermissions.findOne({"associationId":eventLists.eventOrganizer});
					if(findPerm){	
						if(Meteor.user().role=="Academy"){
							if(findPerm.academyEntry=="no")
								alert("You are not permitted, Please contact your association")
							else if(findPerm.academyEntry=="yes"){
								if(eventLists.subscriptionTypeHyper==1&& eventLists.hyperLinkValue){
									$("#confirmModalRedirect").modal({
							           backdrop: 'static',keyboard: false
							        });
							        $("#confirmModalRedirectLog").text("Redirect to hyperlink to subscribe?");
								}
								else{
									Meteor.call("upcomingListsAndStatus",id, function(error, response) {})
									Router.go("entryFromAcademy", {
										_PostId:id,
										page:1
									});

								}
							}
						}
						if(Meteor.user().role=="Player"){
							if(findPerm.playerEntry=="no"){
								alert("You are not permitted, Please contact your association")
							}
							else if(findPerm.playerEntry=="yes"){
								var affiliationID = userDetailssTT.findOne({"userId":Meteor.userId()});
								if(affiliationID&&affiliationID.affiliationId!==undefined&&affiliationID.affiliationId!=null){
									if(eventLists.subscriptionTypeHyper==1&& eventLists.hyperLinkValue){
										$("#confirmModalRedirect").modal({
								           backdrop: 'static',keyboard: false
								        });
								        $("#confirmModalRedirectLog").text("Redirect to hyperlink to subscribe?");
									}
									else{
										Meteor.call("upcomingListsAndStatus",id, function(error, response) {})
										Router.go("subscribeToTournamemnt", {
											_PostId:id
										});
									}
								}
								else{
									alert("You are not approved user to subscribe, Please contact your association")
								}
							}
							else if(findPerm.playerEntry=="other"&&Meteor.user().clubNameId=="other"){
								if(eventLists.subscriptionTypeHyper==1&& eventLists.hyperLinkValue){
									$("#confirmModalRedirect").modal({
							           backdrop: 'static',keyboard: false
							        });
							        $("#confirmModalRedirectLog").text("Redirect to hyperlink to subscribe?");
								}
								else{
									Meteor.call("upcomingListsAndStatus",id, function(error, response) {})
									Router.go("subscribeToTournamemnt", {
										_PostId:id
									});
								}
							}
							else if(findPerm.playerEntry=="other"&&Meteor.user().clubNameId!=="other"){
								alert("You are not permitted, Please contact your association")
							}
						}
						else if(Meteor.user().role=="Association"&&Meteor.user().associationType=="District/City"){
							if(findPerm.districtAssocEntry=="no")
								alert("You are not permitted, Please contact your association")
							else if(findPerm.districtAssocEntry=="yes"){
								if(eventLists.subscriptionTypeHyper==1&& eventLists.hyperLinkValue){
									$("#confirmModalRedirect").modal({
							           backdrop: 'static',keyboard: false
							        });
							        $("#confirmModalRedirectLog").text("Redirect to hyperlink to subscribe?");
								}
								else{
									Meteor.call("upcomingListsAndStatus",id, function(error, response) {})
									Router.go("entryFromAcademy", {
										_PostId:id,
										page:1
									});
								}
							}
						}
						else if(Meteor.user().role=="Association"&&Meteor.user().associationType=="State/Province/County"){
							if(eventLists.subscriptionTypeHyper==1&& eventLists.hyperLinkValue){
									$("#confirmModalRedirect").modal({
							           backdrop: 'static',keyboard: false
							        });
							        $("#confirmModalRedirectLog").text("Redirect to hyperlink to subscribe?");
								}
							else{
								Meteor.call("upcomingListsAndStatus",id, function(error, response) {})
								Router.go("entryFromAcademy", {
										_PostId:id,
										page:1
									});
							}
						}
						else if(Meteor.user().role!=="Association"&&Meteor.user().role!=="Academy"&&Meteor.user().role!=="Player"){
							alert("As "+Meteor.user().role.toUpperCase()+","+" you cannot subscribe to this event")
						}
					}		
				}else{
					if(eventLists.subscriptionTypeHyper==1&& eventLists.hyperLinkValue){
						$("#confirmModalRedirect").modal({
						    backdrop: 'static',keyboard: false
						});
						$("#confirmModalRedirectLog").text("Redirect to hyperlink to subscribe?");
					}
					else{
						if(Meteor.user().role=="Association"||Meteor.user().role=="Academy"){
							alert("As "+Meteor.user().role.toUpperCase()+","+" you cannot subscribe to this event")
						}
						else if(Meteor.user().role=="Umpire"||Meteor.user().role=="Coach"||Meteor.user().role=="Organiser"||Meteor.user().role=="Other"||Meteor.user().role=="Journalist"){
							alert("As "+Meteor.user().role.toUpperCase()+","+" you cannot subscribe to this event")
						}
					}
				}
				}catch(e){
				}
			});
		}
	},*/
    "click #viewEvent":function(e){
        if (Meteor.userId()) {
            var s = Meteor.users.findOne({
                    _id: Meteor.userId()
                });
            Session.set("loginTournamentId",this._id);
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
    'click #viewEventT': function(event) {
        event.preventDefault();
        Session.set('sortCriteria1', null);
        Session.set('sortCriteria1', undefined);
        //
        //handle1.stop()
        Meteor.call("upcomingListsAndStatus", event.target.name, function(error, response) {})
        var eventLists = events.find({
            "_id": event.target.name
        }).fetch();
        Router.go("viewEvents", {
            _PostId: event.target.name
        });
    },

    'click #uuuu': function(e) {
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
        //handle1.stop();
        //Deps.autorun(function() {
        //	handle1 = Meteor.subscribeWithPagination("uEventsLimitE", 8);
        //});
        //template.sortDomainName.set(1);
        Session.set("sortCriteria", 3);
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
        //handle1.stop();
        //Deps.autorun(function() {
        //	handle1 = Meteor.subscribeWithPagination("uEventsLimitP", 8);
        //});
        //template.sortDomainName.set(2);
        Session.set("sortCriteria", 1);
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
        //handle1.stop();
        //Deps.autorun(function() {
        //	handle1 = Meteor.subscribeWithPagination("uEventsLimitD", 8);
        //});
        //template.sortDomainName.set(3);
        Session.set("sortCriteria", 2);
    },

    /*
     * scroll the list load the subscription
     * to other 8 entries to handle1
     */
    /*'scroll #eventDataParent1': function(e) {
		if ($(e.target).scrollTop() + $(e.target).innerHeight() >= $(e.target)[0].scrollHeight) {
			$(e.target).unbind('scroll');
			handle1.loadNextPage();
		}
	}*/
    'scroll #eventDataParent1': function(e) {
        //if ($(e.target).scrollTop() + $(e.target).innerHeight() >= $(e.target)[0].scrollHeight) {
            //$(e.target).unbind('scroll');
            handle2.loadNextPage();
        //}
    },
    'click #loadNExt': function(e) {
        //handle2.loadNextPage();
    }
});

Template.confirmModalRedirect.events({
    "click #confirmModalRedirectNo":function(e){
        $("#confirmModalRedirect").modal('hide')
        $( '.modal-backdrop' ).remove();
    }
})



