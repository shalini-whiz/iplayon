Session.set("selectedSport", "Table Tennis");
Session.set("eventName", false);
Session.set("selectedRound", 1);
Session.set("showDraws", false);
Session.set("matchCollection", "");
Session.set("maxRoundNum", 1);
Session.set("maxGroupNum", 1);

Template.eventTournamentDraws.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    // this.subscribe("projects");
    this.subscribe("domains");
    this.subscribe("eventUploads");
    this.subscribe("onlyLoggedIn");
    this.subscribe("tournamentEvents");
    this.subscribe("matchCollcDB");
    //this.subscribe("MatchCollectionConfig");
    // this.subscribe("dobFilterSubscribe");
    //this.subscribe("users");
    //this.subscribe("allEvents");


    this.subscribe("MatchCollectionConfigTour", Router.current().params._id);
    this.subscribe("dobFilterSubscribeTour", Router.current().params._id);
    this.subscribe("tournamentCategories", Router.current().params._id);
    if (Router.current().params._eventType == "past") {
        this.subscribe("pastEventsID", Router.current().params._id)
        this.subscribe("pastEventsIDCategories", Router.current().params._id)

    }

});

Template.byeWalkOver.onCreated(function bodyOnCreated() {
    //this.subscribe("MatchCollectionConfig");
    //this.subscribe("MatchCollectionConfigTour", Router.current().params._id);
})
Template.eventTournamentDraws.events({

});
Template.registerHelper('checkeveOrg', function(data) {

    try {
        if (data) {
            var eventOr = "";
            if (Router.current().params._eventType == "past") {
                eventOr = pastEvents.findOne({
                    "_id": data
                });

            } else {
                eventOr = events.findOne({
                    "_id": data
                });
            }

            if (eventOr != undefined && eventOr.eventOrganizer != undefined) {
                if (eventOr.eventOrganizer == Meteor.userId()) {
                    return ("");
                } else return ("disabled");
            }
        }
    } catch (e) {}
});

Template.registerHelper('scoreDispType', function(data) {

    try {
        if (data) {
            var eventOr = "";
            if (Router.current().params._eventType == "past") {
                eventOr = pastEvents.findOne({
                    "_id": data
                });

            } else {
                eventOr = events.findOne({
                    "_id": data
                });
            }

            if (eventOr != undefined && eventOr.eventOrganizer != undefined) {
                if (eventOr.eventOrganizer == Meteor.userId()) {
                    return ("");
                } else return ("readonly");
            }
        }
    } catch (e) {}
});

Template.registerHelper('inputBoxedit', function(data) {
    try {
        if (data) {
            var eventOr = "";
            if (Router.current().params._eventType == "past") {
                eventOr = pastEvents.findOne({
                    "_id": data
                });

            } else {
                eventOr = events.findOne({
                    "_id": data
                });
            }

            if (eventOr != undefined && eventOr.eventOrganizer != undefined) {
                if (eventOr.eventOrganizer == Meteor.userId() && this.roundNumber == 1 && this.status == "yetToPlay") {
                    return false;
                } else return true;
            }
        }
    } catch (e) {}
});

Template.registerHelper('onfocusEdit', function(data) {
    try {
        if (data) {

            var eventOr = "";
            if (Router.current().params._eventType == "past") {
                eventOr = pastEvents.findOne({
                    "_id": data
                });

            } else {
                eventOr = events.findOne({
                    "_id": data
                });
            }

            if (eventOr != undefined && eventOr.eventOrganizer != undefined) {
                if (eventOr.eventOrganizer == Meteor.userId() && this.roundNumber == 1 && this.status == "yetToPlay") {
                    return " ";
                } else return "this.blur()";
            }
        }
    } catch (e) {}
});
Template.registerHelper('selectedSportFromLive', function(data) {
    try {
        if (Session.get("selectedSportFromLive") !== undefined && Session.get("selectedSportFromLive") !== null) {
            if (Session.get("selectedSportFromLive") !== 0)
                return Session.get("selectedSportFromLive").trim() == data ? true : false;
            else return false;
        }
    } catch (e) {}
});

Template.registerHelper('selectedEvent', function(v1) {
    if (v1 === Session.get("selectedSportFromLive").trim()) {
        return true;
    }
    return false;
});

Template.eventTournamentDraws.onRendered(function() {
    Session.set("tournamentId", Router.current().params._id);
    Session.set("projectTypeOfEventView", undefined)
});
Template.eventTournamentDraws.helpers({
    showDraws: function() {
        if (Session.get("eventName")) {
            var eventDetails = events.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
            if (eventDetails == undefined) {
                eventDetails = pastEvents.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: Session.get("eventName")
                });
            }
            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                return (Session.get('showDraws'));
            } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) !== 1) {

            }
        }
    },
    showSNS: function() {
        return true
    },
    showTeamDraws: function() {
        if (Session.get("eventName")) {
            var eventDetails = events.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
            if (eventDetails == undefined) {
                eventDetails = pastEvents.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: Session.get("eventName")
                });
            }
            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) !== 1) {
                return (Session.get('showDraws'));
            }
        }
    }
});

/*Template.draws.helpers({
    drawsEventName: function() {
        return Session.get("eventName");
    }

})*/



Template.drawNavBar.helpers({

    loginOrganizer: function() {
        try {
            var tournamentId = Session.get("tournamentId");
            if (Router.current().params._eventType == "past") {
                var eventOr = pastEvents.findOne({
                    "tournamentId": tournamentId
                });

            } else {
                var eventOr = events.findOne({
                    "tournamentId": tournamentId
                });
            }

            if (eventOr && eventOr.eventOrganizer) {
                var roleID = eventOr.eventOrganizer;
                if (!(roleID == Meteor.userId())) {
                    $("#drawsMenu").hide();
                    $("#stationaryMenu").hide();
                }
            }
        } catch (e) {}

    },

    tournamentName: function() {
        try {
            var tournInfo = undefined;
            if (Router.current().params._eventType && Router.current().params._eventType == "past")
                tournInfo = pastEvents.findOne({
                    "tournamentEvent": true,
                    "_id": Router.current().params._id
                });
            else
                tournInfo = events.findOne({
                    "tournamentEvent": true,
                    "_id": Router.current().params._id
                });


            if (tournInfo != undefined)
                return tournInfo.eventName
        } catch (e) {}

    },
    upcomingTournament: function() {
        if (Router.current().params._eventType && Router.current().params._eventType == "past")
            return false;
        else
            return true;
    },
    thiss: function() {
        if (Session.get("eventName")) {

            return Session.get("eventName");
        } else
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
        //var userId = Meteor.userId();
        return Router.current().params._id;
    },
    eventName: function() {
        return (Session.get("eventName"))
    },
    sportEvents: function() {
        try {
            if (Session.get("selectedSportFromLive") != undefined &&
                Session.get("selectedSportFromLive") != null) {
                if (Session.get("selectedSportFromLive") !== 0) {
                    Session.set("eventName", Session.get("selectedSportFromLive").trim());
                    Session.set("showDraws", true);
                    fnGetMatches();
                }
            }
        } catch (e) {}
        try {
            var sport = Session.get("selectedSport");
            if (Router.current().params._eventType == "past") {
                var eveNameVi = pastEvents.findOne({
                    "_id": Router.current().params._id
                });
            } else {
                var eveNameVi = events.findOne({
                    "_id": Router.current().params._id
                });

            }
            var sportsUnderTou = [];
            if (eveNameVi != undefined) {
                for (var i = 0; i < eveNameVi.eventsUnderTournament.length; i++) {
                    if (Router.current().params._eventType == "past")
                        eveNam = pastEvents.findOne({
                            "_id": eveNameVi.eventsUnderTournament[i]
                        });
                    else
                        eveNam = events.findOne({
                            "_id": eveNameVi.eventsUnderTournament[i]
                        });
                    sportsUnderTou[i] = eveNam.eventName;
                }
            }
            if (sportsUnderTou.length != 0) {
                return sportsUnderTou;
            }
        } catch (e) {}
    },
    drawsEvents: function() {
        try {
            if (Session.get("selectedSportFromLive") != undefined &&
                Session.get("selectedSportFromLive") != null) {
                if (Session.get("selectedSportFromLive") !== 0) {
                    Session.set("eventName", Session.get("selectedSportFromLive").trim());
                    Session.set("showDraws", true);
                    var eventDetails = events.findOne({
                        "tournamentId": Session.get("tournamentId"),
                        eventName: Session.get("eventName")
                    });
                    if (eventDetails == undefined) {
                        eventDetails = pastEvents.findOne({
                            "tournamentId": Session.get("tournamentId"),
                            eventName: Session.get("eventName")
                        });
                    }
                    if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                        fnGetMatches();
                    } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                        fnGetTeamMatches();
                    }
                }
            }
        } catch (e) {}
        try {

            var sport = Session.get("selectedSport");
            if (Session.get("uploadedDraws") != undefined)
                return Session.get("uploadedDraws");

        } catch (e) {}

    }
});




/*Template.sportEventSelector.events({
  "change #sport_select": function (event, template) {
    var sport = $(event.currentTarget).val();
    Session.set("selectedSport", sport);
  },
  "change #event_select": function (event, template) {
    var sEvent = $(event.currentTarget).val();
    Session.set("eventName", sEvent);
  }
});

Template.uploadEventDrawsData.helpers ({
  uploadInProgress: function () {
    return Template.instance().uploadInProgress.get();
  }
});

Template.uploadEventDrawsData.onCreated( () => {
  Template.instance().uploadInProgress = new ReactiveVar (false);
});
Template.roundSelector.events ({
  "change #round_select": function (event, template) {
    var round = $(event.currentTarget).val();
    var roundNumber = parseInt(round);
    Session.set("selectedRound", roundNumber);
  }
});

Template.roundSelector.helpers ({
  possibleRounds: function () {
    var possibleRounds = [];
    for (let i=0; i<Session.get("maxRoundNum"); i++) {
      possibleRounds.push(i+1);
    }
    return possibleRounds;
  }
});
Template.displayDraw.events ({
  'click #displayDrawBtn': function (event, template) {
    var show = Session.get("showDraws");
    if (show == false) {
      Session.set("showDraws", true);
    }
    else {
      Session.set("showDraws", false);      
    }
  }
});

Template.displayDraw.helpers ({
  selectedSport: function () {
    return Session.get("selectedSport");
  },
  selectedEvent: function () {
    return Session.get("eventName");
  },
  show: function (event, template) {
    return Session.get("showDraws");
  },
  getMatches: function () {
    fnGetMatches ();
  }
});

*/
export const fnGetTeamMatches = function() {
    try {
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        var roundNumber = Session.get("selectedRound");
        Session.set("leftRMatches", undefined);
        Session.set("rightRMatches", undefined);
        Meteor.call("getTeamMatchesFromDB", tournamentId, eventName, function(error, result) {
            if (error) {} else if (result.length != 0) {
                try {
                    Session.set('matchRecords', result);
                    var leftRMatches = [];
                    var rightRMatches = [];
                    var lastMatchNum = (result.length) - 1;
                    var maxRoundNum = result[lastMatchNum].roundNumber;
                    Session.set("maxRoundNum", maxRoundNum);
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].roundNumber == roundNumber) {
                            leftRMatches.push(result[i]);
                        } else if (result[i].roundNumber <= maxRoundNum) {
                            if (result[i].roundNumber == (roundNumber + 1)) {
                                // this means, this is not the final round!
                                rightRMatches.push(result[i]);
                            }
                        }
                    }
                    Session.set("leftRMatches_team", leftRMatches);
                    Session.set("rightRMatches_team", rightRMatches);
                } catch (e) {}
            }
        });
      
    } catch (e) {}
}

function fnGetMatches() {
    try {
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        var roundNumber = Session.get("selectedRound");
        Session.set("leftRMatches", undefined);
        Session.set("rightRMatches", undefined);
        /*Meteor.call("getMatchesFromDB", tournamentId, eventName, function(error, result) {
            if (error) {} else {
                try {
                    //related to dobfilters //
                    var eventInfo;
                    var tourInfo;
                    if (Router.current().params._eventType && Router.current().params._eventType == "past")
                        eventInfo = pastEvents.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        })
                    else
                        eventInfo = events.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        })
                    if (eventInfo) {
                        var sportID = "";
                        var eventProjectId = "";
                        var eventOrganizer = ""
                        if (eventInfo.projectId && eventInfo.eventOrganizer) {
                            eventProjectId = eventInfo.projectId[0];
                            eventOrganizer = eventInfo.eventOrganizer;
                            Session.set("eventOrganizer", eventOrganizer);
                        }
                        if (Router.current().params._eventType && Router.current().params._eventType == "past")
                            tourInfo = pastEvents.findOne({
                                "_id": tournamentId,
                                "tournamentEvent": true
                            });
                        else
                            tourInfo = events.findOne({
                                "_id": tournamentId,
                                "tournamentEvent": true
                            });

                        if (tourInfo && tourInfo.projectId) {
                            sportID = tourInfo.projectId[0];
                            Session.set("sportID", sportID);
                        }

                        var filtersInfo = dobFilterSubscribe.findOne({
                            "eventOrganizer": eventOrganizer,
                            "mainProjectId": sportID,
                            "details.eventId": eventProjectId,
                            "tournamentId": tournamentId
                        })
                        if (filtersInfo) {
                            if (filtersInfo.details) {
                                var details = filtersInfo.details;
                                for (var d = 0; d < details.length; d++) {
                                    if (details[d].eventId == eventProjectId) {
                                        if (details[d].ranking)
                                            Session.set("dobfilters", details[d].ranking);
                                        break;
                                    } else
                                        continue;
                                }
                            }
                        }
                    }




                    // related to dobfilters//
                    Session.set('matchRecords', result);
                    var leftRMatches = [];
                    var rightRMatches = [];
                    var lastMatchNum = (result.length) - 1;
                    var maxRoundNum = result[lastMatchNum].roundNumber;
                    Session.set("maxRoundNum", maxRoundNum);


                    for (var i = 0; i < result.length; i++) {
                        if (result[i].roundNumber == roundNumber) {
                            leftRMatches.push(result[i]);
                        } else if (result[i].roundNumber <= maxRoundNum) {
                            if (result[i].roundNumber == (roundNumber + 1)) {
                                // this means, this is not the final round!
                                rightRMatches.push(result[i]);
                            }
                        }
                    }
                    Session.set("leftRMatches", leftRMatches);
                    Session.set("rightRMatches", rightRMatches);
                } catch (e) {
                    Session.set("maxRoundNum", 1);
                    var leftRMatches = [];
                    var rightRMatches = [];
                    Session.set("leftRMatches", leftRMatches);
                    Session.set("rightRMatches", rightRMatches);
                }
            }
        });*/
        Meteor.call("getMatchesFromDB_Round",tournamentId,eventName,roundNumber,function(error,result){
            if(error)
            {

            }
            else {
                try {
                    //related to dobfilters //

                    var eventInfo;
                    var tourInfo;
                    if (Router.current().params._eventType && Router.current().params._eventType == "past")
                        eventInfo = pastEvents.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        })
                    else
                        eventInfo = events.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        })
                    if (eventInfo) 
                    {
                        var sportID = "";
                        var eventProjectId = "";
                        var eventOrganizer = ""
                        if (eventInfo.projectId && eventInfo.eventOrganizer) {
                            eventProjectId = eventInfo.projectId[0];
                            eventOrganizer = eventInfo.eventOrganizer;
                            Session.set("eventOrganizer", eventOrganizer);
                        }
                        if (Router.current().params._eventType && Router.current().params._eventType == "past")
                            tourInfo = pastEvents.findOne({
                                "_id": tournamentId,
                                "tournamentEvent": true
                            });
                        else
                            tourInfo = events.findOne({
                                "_id": tournamentId,
                                "tournamentEvent": true
                            });

                        if (tourInfo && tourInfo.projectId) {
                            sportID = tourInfo.projectId[0];
                            Session.set("sportID", sportID);
                        }

                        var filtersInfo = dobFilterSubscribe.findOne({
                            "eventOrganizer": eventOrganizer,
                            "mainProjectId": sportID,
                            "details.eventId": eventProjectId,
                            "tournamentId": tournamentId
                        })
                        if (filtersInfo) {
                            if (filtersInfo.details) {
                                var details = filtersInfo.details;
                                for (var d = 0; d < details.length; d++) {
                                    if (details[d].eventId == eventProjectId) {
                                        if (details[d].ranking)
                                            Session.set("dobfilters", details[d].ranking);
                                        break;
                                    } else
                                        continue;
                                }
                            }
                        }
                    }

                 
                    var defaultMatchRec = [];
                    var leftRMatches = [];
                    var rightRMatches = [];
                    var lastMatchNum;
                    var maxRoundNum;

                    // related to dobfilters//
                    if(result.matchRecords)
                    {

                        Session.set('matchRecords', result.matchRecords);
                        lastMatchNum = (result.matchRecords.length) - 1;
                        maxRoundNum = result.matchRecords[lastMatchNum].roundNumber;
                        Session.set("maxRoundNum", maxRoundNum);

                    }
                    else
                    {

                        Session.set("matchRecords",defaultMatchRec)
                    }

                    if(result.leftMatchRecords)
                        leftRMatches = result.leftMatchRecords;
                    if(result.rightMatchRecords)
                        rightRMatches = result.rightMatchRecords;



                    /*for (var i = 0; i < result.length; i++) {
                        if (result[i].roundNumber == roundNumber) {
                            leftRMatches.push(result[i]);
                        } else if (result[i].roundNumber <= maxRoundNum) {
                            if (result[i].roundNumber == (roundNumber + 1)) {
                                // this means, this is not the final round!
                                rightRMatches.push(result[i]);
                            }
                        }
                    }*/
                    Session.set("leftRMatches", leftRMatches);
                    Session.set("rightRMatches", rightRMatches);
                } catch (e) {
                    Session.set("maxRoundNum", 1);
                    var leftRMatches = [];
                    var rightRMatches = [];
                    Session.set("leftRMatches", leftRMatches);
                    Session.set("rightRMatches", rightRMatches);
                }
            }
        })

       
    } catch (e) {
    }
}

Template.drawNavBar.events({



    'click #eventSelectionAnchor': function(e) {
        Meteor.call('drawsEvents', Router.current().params._id, function(err, result) {
            if (err) {} else {
                Session.set("uploadedDraws", result);
            }
        });


    },
    'click #resultSelectionAnchor': function(e) {
        Meteor.call('drawsEvents', Router.current().params._id, function(err, result) {
            if (err) {} else {
                Session.set("uploadedDraws", result);
            }
        });
    },

    'click #drawsSelectionMenu': function(e) {
        if ($("#drawsSelectionMenu").hasClass("open"))
            $("#drawsSelectionMenu").removeClass("open");
        else
            $("#drawsSelectionMenu").addClass("open");

    },

    'click #eventSelectionMenu': function(e) {
        if ($("#eventSelectionMenu").hasClass("open"))
            $("#eventSelectionMenu").removeClass("open");
        else
            $("#eventSelectionMenu").addClass("open");

    },
    'click #stationarySelectionMenu': function(e) {
        if ($("#stationarySelectionMenu").hasClass("open"))
            $("#stationarySelectionMenu").removeClass("open");
        else
            $("#stationarySelectionMenu").addClass("open");

    },
    'click #resultsSelectionMenu': function(e) {
        if ($("#resultsSelectionMenu").hasClass("open"))
            $("#resultsSelectionMenu").removeClass("open");
        else
            $("#resultsSelectionMenu").addClass("open");

    },

    'click #aYesButton': function(e) {
        e.preventDefault();
        $("#alreadySubscribed").modal('hide');
    },
    'click #incrRound': function(event) {
        var selectedRound = Session.get('selectedRound');
        selectedRound = (selectedRound == Session.get('maxRoundNum')) ? selectedRound : selectedRound + 1;
        Session.set("selectedRound", selectedRound);
        var eventDetails = events.findOne({
            "tournamentId": Session.get("tournamentId"),
            eventName: Session.get("eventName")
        });
        if (eventDetails == undefined) {
            eventDetails = pastEvents.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
        }
        if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
            fnGetMatches();
        } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
            fnGetTeamMatches();
        }
    },
    'click #decrRound': function(event) {
        var selectedRound = Session.get('selectedRound');
        selectedRound = (selectedRound == 1) ? selectedRound : selectedRound - 1;
        Session.set("selectedRound", selectedRound);
        var eventDetails = events.findOne({
            "tournamentId": Session.get("tournamentId"),
            eventName: Session.get("eventName")
        });
        if (eventDetails == undefined) {
            eventDetails = pastEvents.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
        }
        if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
            fnGetMatches();
        } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
            fnGetTeamMatches();
        }
    },
    'click #reset': function(event) {

        if (Session.get("leftRMatches") !== undefined) {
            if (Session.get("leftRMatches").length !== 0) { //if draws present

                $("#confirmModalLogout").modal({
                    backdrop: 'static'
                });
                $("#conFirmHeaderLog").text("Are you sure you want to reset "+Session.get("eventName")+" draws ?");

            } else {
                $("#alreadySubscribed").modal({
                    backdrop: 'static'
                });
                $("#alreadySubscribedText").text("Nothing to reset");
            }

        } else if (Session.get("leftRMatches_team") !== undefined) {
            if (Session.get("leftRMatches_team").length !== 0) { //if draws present

                $("#confirmModalLogout").modal({
                    backdrop: 'static'
                });
                $("#conFirmHeaderLog").text("Are you sure you want to reset draws ?");

            } else {
                $("#alreadySubscribed").modal({
                    backdrop: 'static'
                });
                $("#alreadySubscribedText").text("Nothing to reset");
            }
        }
        /*if(Session.get("leftRMatches")!==undefined){
             $("#confirmModalLogout").modal({
                   backdrop: 'static'
             });
             $("#conFirmHeaderLog").text("Are you sure you want to reset draws ?");
        }*/
        else {
            $("#alreadySubscribed").modal({
                backdrop: 'static'
            });
            $("#alreadySubscribedText").text("Nothing to reset");
        }
        /*bootbox.confirm("Are you sure you want to reset draws?", function (result) {
          if (result != null) {
            doReset = result;
          }
          if (result == true) {
          Session.set("matchRecords", "");
          Session.set("leftRMatches", "");
          Session.set("rightRMatches", "");
          Meteor.call("resetMatchRecords", Session.get("tournamentId"), Session.get("eventName")); 
          }
        });*/
    },


    //reset draws modal

    //shalini code starts here
    "click #createDrawBtn": function(e) {
        e.preventDefault();
        $("#createDrawPopUp").empty();

        Blaze.render(Template.createDraw, $("#createDrawPopUp")[0]);
        $("#createDraw").modal({
            backdrop: 'static'
        });
    },

    "click #downloadTemplate": function(e) {
        e.preventDefault();
        $("#downloadTemplatePopUp").empty();

        Blaze.render(Template.downloadTemplateXXX, $("#downloadTemplatePopUp")[0]);
        $("#downloadTemplateXXX").modal({
            backdrop: 'static'
        });
    },

    "click #event_selection": function(e) {
        e.preventDefault();
        if (Session.get("eventName") !== $(e.currentTarget).text().trim()) {
            Session.set("changeFirstUserId", undefined)
        }
        Session.set("eventName", $(e.target).text());
        Session.set("selectedSportFromLive", undefined);
        Session.set("showDraws", true);
        var eventDetails = events.findOne({
            "tournamentId": Session.get("tournamentId"),
            eventName: Session.get("eventName")
        });
        if (eventDetails == undefined) {
            eventDetails = pastEvents.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
        }
        if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
            fnGetMatches();
        } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
            fnGetTeamMatches();
        }
    },

    "click #scoreSheetBtn": function(e) {
        e.preventDefault();
        $("#scoreSheetPopUp").empty();
        $("#receiptPopUp").empty();
        $("#resultsPopUp").empty();
        $("#certificatePopUp").empty();
        $("#leaveRequestPopUp").empty();

        Meteor.call('drawsEvents', Router.current().params._id, function(err, result) {
            if (err) {} else
                Session.set("uploadedDraws", result);
        });

        Blaze.render(Template.scoreSheet, $("#scoreSheetPopUp")[0]);
        $("#scoreSheet").modal({
            backdrop: 'static'
        });

    },

    "click #certificateBtn": function(e) {
        e.preventDefault();
        $("#certificatePopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#receiptPopUp").empty();
        $("#resultsPopUp").empty();
        $("#leaveRequestPopUp").empty();

        Meteor.call('drawsEvents', Router.current().params._id, function(err, result) {
            if (err) {} else
                Session.set("uploadedDraws", result);
        });

        Blaze.render(Template.certificate, $("#certificatePopUp")[0]);
        $("#certificate").modal({
            backdrop: 'static'
        });

    },
    "click #printScreenEventDraws": function(e) {
        e.preventDefault();
        $("#certificatePopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#receiptPopUp").empty();
        $("#resultsPopUp").empty();
        $("#leaveRequestPopUp").empty();
        $("#printableDrawsPopUp").empty();

        Meteor.call('drawsEvents', Router.current().params._id, function(err, result) {
            if (err) {} else
                Session.set("uploadedDraws", result);
        });

        Blaze.render(Template.printableDraws, $("#printableDrawsPopUp")[0]);
        $("#printableDraws").modal({
            backdrop: 'static'
        });



        /*var tournamentId = Router.current().params._id;
        var eventName = Session.get("eventName");
        Meteor.call('printDrawsSheet',tournamentId,eventName,function(err, res) {
          if(res){
            window.open("data:application/pdf;base64, " + res);
          }
        });*/
    },

    "click #leaveRequestBtn": function(e) {
        e.preventDefault();
        $("#leaveRequestPopUp").empty();
        $("#certificatePopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#receiptPopUp").empty();
        $("#resultsPopUp").empty();

        Blaze.render(Template.leaveRequest, $("#leaveRequestPopUp")[0]);
        $("#leaveRequest").modal({
            backdrop: 'static'
        });
    },
    "click #lockEventDraws":function(e)
    {
         e.preventDefault();
        $("#scoreSheetPopUp").empty();
        $("#receiptPopUp").empty();
        $("#resultsPopUp").empty();
        $("#certificatePopUp").empty();
        $("#leaveRequestPopUp").empty();
        $("#drawsToLockContent").empty();


        Meteor.call('checkTournamentDrawsOnLock', Router.current().params._id, function(err, result) {
            if (err) {} else
                Session.set("tournamentDrawsOnLock", result);
        });

        Blaze.render(Template.drawsToLock, $("#drawsToLockContent")[0]);
        $("#drawsToLock").modal({
            backdrop: 'static'
        });
    },

    "click #receiptBtn": function(e) {
        e.preventDefault();
        $("#receiptPopUp").empty();
        $("#leaveRequestPopUp").empty();
        $("#certificatePopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#resultsPopUp").empty();

        Blaze.render(Template.receipt, $("#receiptPopUp")[0]);
        $("#receipt").modal({
            backdrop: 'static'
        });

    },
    "click #receiptBtnForTeamEvents": function(e) {
        e.preventDefault();
        $("#receiptPopUp").empty();
        $("#leaveRequestPopUp").empty();
        $("#certificatePopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#resultsPopUp").empty();

        Blaze.render(Template.receiptForTeams, $("#receiptPopUp")[0]);
        $("#receiptForTeams").modal({
            backdrop: 'static'
        });
    },
    "click #emailResultBtn": function(e) {
        e.preventDefault();
        $("#receiptPopUp").empty();
        $("#leaveRequestPopUp").empty();
        $("#certificatePopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#resultsPopUp").empty();

        Blaze.render(Template.result, $("#resultsPopUp")[0]);
        $("#result").modal({
            backdrop: 'static'
        });

    },


    //shalini code ends here

    'click #noButtonLogout': function(e) {
        e.preventDefault();
        $("#confirmModalLogout").modal('hide');
    },
    'click #yesButtonLogout': function(e, template) {
        e.preventDefault();

        $("#confirmModalLogout").modal('hide');

        $("#confirmPasswordForResetPopUp").empty();

        Blaze.render(Template.confirmPasswordForReset, $("#confirmPasswordForResetPopUp")[0]);
        $("#confirmPasswordForReset").modal({
            backdrop: 'static'
        });

    },

    "click #Singles": function(event, template) {
        var sport = $(event.currentTarget).val();
        Session.set("eventName", "Open Singles");
        var eventDetails = events.findOne({
            "tournamentId": Session.get("tournamentId"),
            eventName: Session.get("eventName")
        });
        if (eventDetails == undefined) {
            eventDetails = pastEvents.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
        }
        if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
            fnGetMatches();
        } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
            fnGetTeamMatches();
        }
    },
    "click #Doubles": function(event, template) {
        var sport = $(event.currentTarget).val();
        Session.set("eventName", "Open Doubles");
        var eventDetails = events.findOne({
            "tournamentId": Session.get("tournamentId"),
            eventName: Session.get("eventName")
        });
        if (eventDetails == undefined) {
            eventDetails = pastEvents.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
        }
        if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
            fnGetMatches();
        } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
            fnGetTeamMatches();
        }
    },
    "click #Try1": function(event, template) {
        var sport = $(event.currentTarget).val();
        Session.set("eventName", "Try1");
        var eventDetails = events.findOne({
            "tournamentId": Session.get("tournamentId"),
            eventName: Session.get("eventName")
        });
        if (eventDetails == undefined) {
            eventDetails = pastEvents.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
        }
        if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
            fnGetMatches();
        } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
            fnGetTeamMatches();
        }
    },
    "click #Try2": function(event, template) {
        var sport = $(event.currentTarget).val();
        Session.set("eventName", "Try2");
        var eventDetails = events.findOne({
            "tournamentId": Session.get("tournamentId"),
            eventName: Session.get("eventName")
        });
        if (eventDetails == undefined) {
            eventDetails = pastEvents.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
        }
        if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
            fnGetMatches();
        } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
            fnGetTeamMatches();
        }
    },
    // shalini code disabled below code

    "click #editSettingsSelection": function(e) {
        e.preventDefault();

    },
    "click #editPointsSelection": function(e) {
        e.preventDefault();

    },
    /*
        'click #ipSelectEveDropDown': function(e) {
          e.preventDefault();

          if ($("#ipSelectEveDropDown").hasClass("open")) {
              $("#ipSelectEveDropDown").children("ul").slideUp("fast");
              $("#ipSelectEveDropDown").removeClass("open");
              $("#ipSelectEveDropDown").children("ul").slideUp("fast");
          } else {
            $("#ipSelectEveDropDown").addClass("open");
            $("#ipSelectEveDropDown").children("ul").slideDown("fast");
          }
        },*/

    //vin
    "click #downloadEmpytDraws_N": function(e) {
        e.preventDefault();
        $("#emptyDrawsRen").empty();
        Blaze.render(Template.emptyDrawsFromTourn, $("#emptyDrawsRen")[0]);
        $("#emptyDrawsFromTourn").modal({
            backdrop: 'static'
        });
    },
    "click #playerAnalyticsHeadOn": function(e) {
        e.preventDefault();
        window.open(Router.url("playerAnalytics", {
            page: 1
        }));
    }
});


Template.draws.helpers({
    
    
    tourIdDraws: function() {
        //var userId = Meteor.userId();
        return Router.current().params._id;
    },
    drawsEventName: function() {
        return Session.get("eventName");
    },
    drawName:function(){
        return Session.get("eventName");
    },
    lRoundNum: function() {
        return (Session.get("selectedRound"));
    },
    leftRMatches: function() {
        return Session.get("leftRMatches");
    },
    rRoundNum: function() {
        return (1 + Session.get("selectedRound"));
    },
    rightRMatches: function() {
        return (Session.get("rightRMatches"));
    },
    matchNumber1: function() {
        return (this.matchNumber);
    },
    "playerANo":function()
    {
        if(this.playersNo && this.playersNo.playerANo)
            return this.playersNo.playerANo;
    },
    playerA: function() {
        //reactive
        try{
            if(this.playersID && this.playersID.playerAId && this.playersID.playerAId.trim() != "")
            {
                var result2 = ReactiveMethod.call("getPlayer_Aca",this.playersID.playerAId,Router.current().params._id);
                return result2
            }
            //return result2;
            else
            {
                if(this.players.playerA == "()")
                    return "";
                return (this.players.playerA);
            }
        }catch(e)
        {
        }
    },
    AS1: function() {
        return (this.scores.setScoresA[0]);
    },
    AS2: function() {
        return (this.scores.setScoresA[1]);
    },
    AS3: function() {
        return (this.scores.setScoresA[2]);
    },
    AS4: function() {
        return (this.scores.setScoresA[3]);
    },
    AS5: function() {
        return (this.scores.setScoresA[4]);
    },
    AS6: function() {
        if (this.scores.setScoresA.length < 6)
            return 0;
        return (this.scores.setScoresA[5]);
    },
    AS7: function() {
        if (this.scores.setScoresA.length < 7)
            return 0;
        return (this.scores.setScoresA[6]);
    },
    "playerBNo":function()
    {
        if(this.playersNo && this.playersNo.playerBNo)
            return this.playersNo.playerBNo;
    },
    playerB: function() {
        try{
            if(this.playersID && this.playersID.playerBId && this.playersID.playerBId.trim() != "")
            {
                var result2 = ReactiveMethod.call("getPlayer_Aca",this.playersID.playerBId,Router.current().params._id);
                return result2
            }
            //return result2;
            else
            {
                if(this.players.playerB == "()")
                    return "";
                return (this.players.playerB);
            }
        }catch(e){}
        
    },
    BS1: function() {
        return (this.scores.setScoresB[0]);
    },
    BS2: function() {
        return (this.scores.setScoresB[1]);
    },
    BS3: function() {
        return (this.scores.setScoresB[2]);
    },
    BS4: function() {
        return (this.scores.setScoresB[3]);
    },
    BS5: function() {
        return (this.scores.setScoresB[4]);
    },
    BS6: function() {
        if (this.scores.setScoresB.length < 6)
            return 0;
        return (this.scores.setScoresB[5]);
    },
    BS7: function() {
        if (this.scores.setScoresB.length < 7)
            return 0;
        return (this.scores.setScoresB[6]);
    },

    AS1Settings: function() {
        if (parseInt(this.scores.setScoresA[0]) != 0) {
            if (parseInt(this.scores.setScoresA[0]) < parseInt(this.scores.setScoresB[0])) {
                return "background:#EEEAEA !important";

            } else {
                return "background:#9DB68C !important;color:white";

            }
        }

    },
    AS2Settings: function() {
        if (parseInt(this.scores.setScoresA[1]) != 0) {
            if (parseInt(this.scores.setScoresA[1]) < parseInt(this.scores.setScoresB[1]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    AS3Settings: function() {
        if (parseInt(this.scores.setScoresA[2]) != 0) {
            if (parseInt(this.scores.setScoresA[2]) < parseInt(this.scores.setScoresB[2]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    AS4Settings: function() {
        if (parseInt(this.scores.setScoresA[3]) != 0) {
            if (parseInt(this.scores.setScoresA[3]) < parseInt(this.scores.setScoresB[3]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    AS5Settings: function() {

        if (parseInt(this.scores.setScoresA[4]) != 0) {
            if (parseInt(this.scores.setScoresA[4]) < parseInt(this.scores.setScoresB[4]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    AS6Settings: function() {
        if (this.scores.setScoresA.length < 6)
            return "";

        else if (parseInt(this.scores.setScoresA[5]) != 0) {
            if (parseInt(this.scores.setScoresA[5]) < parseInt(this.scores.setScoresB[5]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    AS7Settings: function() {
        if (this.scores.setScoresA.length < 7)
            return "";
        else if (parseInt(this.scores.setScoresA[6]) != 0) {
            if (parseInt(this.scores.setScoresA[6]) < parseInt(this.scores.setScoresB[6]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    BS1Settings: function() {
        if (parseInt(this.scores.setScoresB[0]) != 0) {
            if (parseInt(this.scores.setScoresA[0]) > parseInt(this.scores.setScoresB[0]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    BS2Settings: function() {
        if (parseInt(this.scores.setScoresB[1]) != 0) {
            if (parseInt(this.scores.setScoresA[1]) > parseInt(this.scores.setScoresB[1]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    BS3Settings: function() {
        if (parseInt(this.scores.setScoresB[2]) != 0) {
            if (parseInt(this.scores.setScoresA[2]) > parseInt(this.scores.setScoresB[2]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    BS4Settings: function() {
        if (parseInt(this.scores.setScoresB[3]) != 0) {
            if (parseInt(this.scores.setScoresA[3]) > parseInt(this.scores.setScoresB[3]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    BS5Settings: function() {

        if (parseInt(this.scores.setScoresB[4]) != 0) {
            if (parseInt(this.scores.setScoresA[4]) > parseInt(this.scores.setScoresB[4]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    BS6Settings: function() {
        if (this.scores.setScoresB.length < 6)
            return "";

        else if (parseInt(this.scores.setScoresB[5]) != 0) {
            if (parseInt(this.scores.setScoresA[5]) > parseInt(this.scores.setScoresB[5]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },
    BS7Settings: function() {
        if (this.scores.setScoresB.length < 7)
            return "";
        else if (parseInt(this.scores.setScoresB[6]) != 0) {
            if (parseInt(this.scores.setScoresA[6]) > parseInt(this.scores.setScoresB[6]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }

    },

    getStatusColorA: function() {
        return this.getStatusColorA;
    },
    getStatusColorB: function() {
        return this.getStatusColorB;
    },
    matchNumber: function() {
        return this.matchNumber;
    },
    matchSettingsA: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerAId.trim() == "")
            {
                //return "visibility:hidden";
                return "";
            }
    },
    matchSettingsB: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerBId.trim() == "")
        {
            //return "visibility:hidden";
            return "";
        }
    },
    matchSettingsBSettings: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && (this.playersID.playerAId.trim() == "" || this.playersID.playerBId.trim() == ""))
            return "font-size: 12px;cursor: pointer;visibility:hidden";
        else
            return "font-size: 12px;cursor: pointer;";
    },
    matchSettingsBScore: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && (this.playersID.playerAId.trim() == "" || this.playersID.playerBId.trim() == ""))
            {
                return "";
                //return "visibility:hidden";
            }

    },
    matchSettingsAScore: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerBId.trim() == "")
            {
                return "";
                //return "visibility:hidden";
            }

    },

});

Session.set("curMatchRecord", "");

function setCurMatch(matchNumber) {
    for (let i = 0; i < matchRecords.length; i++) {
        let matchNumber = matchRecords[i].matchNumber;
        if (matchNumber == curMatchNumber) {
            Session.set("curMatchRecord", matchRecords[i]);
            return;
        }
    }
}

function checkForCompletion(curMatchRecord) {
    var scores = curMatchRecord.scores;
    var setScoresA = scores.setScoresA;
    var setScoresB = scores.setScoresB;

    // fetch from DB from 'edit settings' of draws
    var tournamentId = Router.current().params._id;

    var eventName = Session.get("eventName");
    var roundNumber = curMatchRecord.roundNumber;
    var minScore = 0;
    var minDiff = 0;
    var numSets = 0;
    var numSetWinsReqd = 0;
    var matchCollecConfig = MatchCollectionConfig.findOne({
        "tournamentId": tournamentId,
        "eventName": eventName
    }, {
        "roundValues": {
            $elemMatch: {
                "roundNumber": 1
            }
        }
    }, {
        fields: {
            "roundValues": 1
        }
    });
    if (matchCollecConfig == undefined) {
        minScore = 11;
        minDiff = 2;
        numSets = 5;
        numSetWinsReqd = 3
    } else {
        for (var i = 0; i < matchCollecConfig.roundValues.length; i++) {
            if (matchCollecConfig.roundValues[i].roundNumber == curMatchRecord.roundNumber) {
                minScore = parseInt(matchCollecConfig.roundValues[i].minScores);
                minDiff = parseInt(matchCollecConfig.roundValues[i].minDifference);
                numSets = parseInt(matchCollecConfig.roundValues[i].noofSets);
                numSetWinsReqd = parseInt((parseInt(numSets) + 1) / 2);
                break;
            }
        }
    }

    ////////
    if (setScoresA.length < numSetWinsReqd) return;
    if (setScoresA.length != setScoresB.length) return;
    let winsA = 0,
        winsB = 0;

    for (let i = 0; i < setScoresA.length; i++) {
        if ((setScoresA[i] - setScoresB[i] >= minDiff) && (setScoresA[i] >= minScore)) {
            winsA++;
        }
        if ((setScoresB[i] - setScoresA[i] >= minDiff) && (setScoresB[i] >= minScore)) {
            winsB++;
        }
    }
    curMatchRecord.status = 'completed';
    if (winsA == numSetWinsReqd) {
        curMatchRecord.winner = curMatchRecord.players.playerA;
        curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameLost';
        curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
    } else
    if (winsB == numSetWinsReqd) {
        curMatchRecord.status = 'completed';
        curMatchRecord.winner = curMatchRecord.players.playerB;
        curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameLost';
        curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
    }
    return curMatchRecord;
}

function propogatePlayer(matchRecord, fromLeft) {
    var nextMatchNumber = matchRecord.nextMatchNumber;
    var nextSlot = matchRecord.nextSlot;
    var matchRecords = Session.get("matchRecords");
    var thisMatchRecord;
    for (let i = 0; i < matchRecords.length; i++) {
        if(matchRecords[i].roundName != "BM")
        {
            if (matchRecords[i].matchNumber == nextMatchNumber) {
                if (nextSlot == "A") {
                    matchRecords[i].players.playerA = matchRecord.winner;
                    matchRecords[i].playersID.playerAId = matchRecord.winnerID;
                    if(matchRecord.winnerNo != undefined && matchRecords[i].playersNo != undefined)
                        matchRecords[i].playersNo.playerANo = matchRecord.winnerNo;
                    
      
                } else {
                    matchRecords[i].players.playerB = matchRecord.winner;
                    matchRecords[i].playersID.playerBId = matchRecord.winnerID;
                    if(matchRecord.winnerNo != undefined && matchRecords[i].playersNo != undefined)
                        matchRecords[i].playersNo.playerBNo = matchRecord.winnerNo;
                  
                }
                thisMatchRecord = matchRecords[i];
                Session.set("matchRecords", matchRecords);
                break;
            }
        }
    }
    if (fromLeft) {
        var rightRMatches = Session.get("rightRMatches");
        for (let i = 0; i < rightRMatches.length; i++) {
            if (rightRMatches[i].matchNumber == thisMatchRecord.matchNumber) {
                rightRMatches[i] = thisMatchRecord;
                Session.set("rightRMatches", rightRMatches);
            }
        }
    }
}

function updateScores(matchRecord, setNumber, player, score) {
    var thisMatchNumber = matchRecord.matchNumber;
    var scores = matchRecord.scores;
    if (player == "A") scores.setScoresA[setNumber - 1] = score;
    else
    if (player == "B") scores.setScoresB[setNumber - 1] = score;
    matchRecord.scores = scores;
    var tmpRec = checkForCompletion(matchRecord);
    matchRecord = tmpRec;
    var updated = 0;
    var leftRMatches = Session.get("leftRMatches");
    var rightRMatches = Session.get("rightRMatches");
    var updI = 0;
    var fromLeft = 0;
    for (let i = 0; i < leftRMatches.length; i++) {
        if (leftRMatches[i].matchNumber == thisMatchNumber) {
            leftRMatches[i] = matchRecord;
            updI = i;
            updated = 1;
            fromLeft = 1;
            break;
        }
    }
    if (!updated) {
        for (let i = 0; i < rightRMatches.length; i++) {
            if (rightRMatches[i].matchNumber == thisMatchNumber) {
                rightRMatches[i] = matchRecord;
                updI = i;
                break;
            }
        }
    }

    var matchRecords = Session.get("matchRecords");
    matchRecords[thisMatchNumber - 1] = matchRecord;
    Session.set("leftRMatches", leftRMatches);
    Session.set("rightRMatches", rightRMatches);
    Session.set("matchRecords", matchRecords);

    propogatePlayer(matchRecord, fromLeft);
    matchRecords = Session.get("matchRecords");

    Meteor.call("updateMatchRecords", Session.get("tournamentId"), Session.get("eventName"), matchRecords, matchRecord);
}

function printIt(matchRecord) {
    for (let i = 0; i < 5; i++) {}
}

Template.draws.events({
    "click #addBMRoundInd":async function(e){
        $("#render34roundInd").empty();
        Blaze.render(Template.ind34Format, $("#render34roundInd")[0]);
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");

        Session.set("thirdFourTournamnetId",tournamentId)
        Session.set("thirdFourEventName",eventName)
        Session.set("scoreDetailsthirdFour",[])
        var data = {
            tournamentId:tournamentId,
            eventName:eventName
        }

        var findBMRes = await Meteor.callPromise("findInsertedRoundBMTeam",data)
        if(findBMRes.status==SUCCESS_STATUS && findBMRes.data){
            Session.set("scoreDetailsthirdFour",findBMRes.data)
        }
        else{
            Session.set("scoreDetailsthirdFour",[])
        }
        
        $("#ind34Format").modal({
            backdrop: 'static',
            keyboard: false
        });


    } ,
    'focusout #PlayerALI,change  #PlayerALI': function(event) {
        // if (event.which == 13 || event.which == 0) {
        try {
            if (Router.current().params._id) {
                var eventOr;

                if (Router.current().params._eventType && Router.current().params._eventType == "past")
                    eventOr = pastEvents.findOne({
                        "_id": Router.current().params._id
                    });
                else
                    eventOr = events.findOne({
                        "_id": Router.current().params._id
                    });
                if (eventOr != undefined && eventOr.eventOrganizer != undefined) {
                    if (eventOr.eventOrganizer == Meteor.userId()) {
                        var playerName1 = event.target.value;
                        updateName(this, 1, 'A', playerName1);
                    } else return false;
                }
            }
        } catch (e) {}

    },
    'focusout #PlayerBLI,change #PlayerBLI': function(event) {
        try {
            if (Router.current().params._id) {
                var eventOr;
                if (Router.current().params._eventType && Router.current().params._eventType == "past")
                    eventOr = pastEvents.findOne({
                        "_id": Router.current().params._id
                    });
                else
                    eventOr = events.findOne({
                        "_id": Router.current().params._id
                    });
                if (eventOr != undefined && eventOr.eventOrganizer != undefined) {
                    if (eventOr.eventOrganizer == Meteor.userId() && this.status == "yetToPlay") {
                        var playerName2 = event.target.value;
                        updateName(this, 1, 'B', playerName2);
                    } else return false;
                }
            }
        } catch (e) {}
    },
    /* 'keydown #PlayerAR, focusout #PlayerAR':function(event){
       if (event.which == 13 || event.which == 0) {
         var playerName = $(event.target).text();
         updateName(this, 1, 'A', playerName);
       }
     },
     'keydown #PlayerBR, focusout #PlayerBR':function(event){
       if (event.which == 13 || event.which == 0) {
         var playerName = $(event.target).text();
         updateName(this, 1, 'B', playerName);
       }
     },*/
    'keyup #ALset1, focusout #ALset1': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;

            updateScores(this, 1, 'A', score);
        }
    },
    'keyup #ALset2, focusout #ALset2': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 2, 'A', score);
            printIt(this);
        }
    },
    'keyup #ALset3, focusout #ALset3': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 3, 'A', score);
            printIt(this);
        }
    },
    'keyup #ALset4, focusout #ALset4': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 4, 'A', score);
            printIt(this);
        }
    },
    'keyup #ALset5, focusout #ALset5': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 5, 'A', score);
            printIt(this);
        }
    },
    'keyup #ALset6, focusout #ALset6': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 6, 'A', score);
            printIt(this);
        }
    },
    'keyup #ALset7, focusout #ALset7': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 7, 'A', score);
            printIt(this);
        }
    },
    'keyup #BLset1, focusout #BLset1': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 1, 'B', score);
            printIt(this);
        }
    },
    'keyup #BLset2, focusout #BLset2': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 2, 'B', score);
            printIt(this);
        }
    },
    'keyup #BLset3, focusout #BLset3': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 3, 'B', score);
            printIt(this);
        }
    },
    'keyup #BLset4, focusout #BLset4': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 4, 'B', score);
            printIt(this);
        }
    },
    'keyup #BLset5, focusout #BLset5': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 5, 'B', score);
            printIt(this);
        }
    },
    'keyup #BLset6, focusout #BLset6': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 6, 'B', score);
            printIt(this);
        }
    },
    'keyup #BLset7, focusout #BLset7': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 7, 'B', score);
            printIt(this);
        }
    },
    'keyup #ARset1, focusout #ARset1': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 1, 'A', score);
            printIt(this);
        }
    },
    'keyup #ARset2, focusout #ARset2': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 2, 'A', score);
            printIt(this);
        }
    },
    'keyup #ARset3, focusout #ARset3': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 3, 'A', score);
            printIt(this);
        }
    },
    'keyup #ARset4, focusout #ARset4': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 4, 'A', score);
            printIt(this);
        }
    },
    'keyup #ARset5, focusout #ARset5': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 5, 'A', score);
            printIt(this);
        }
    },
    'keyup #ARset6, focusout #ARset6': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 6, 'A', score);
            printIt(this);
        }
    },
    'keyup #ARset7, focusout #ARset7': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 7, 'A', score);
            printIt(this);
        }
    },
    'keyup #BRset1, focusout #BRset1': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 1, 'B', score);
            printIt(this);
        }
    },
    'keyup #BRset2, focusout #BRset2': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 2, 'B', score);
            printIt(this);
        }
    },
    'keyup #BRset3, focusout #BRset3': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 3, 'B', score);
            printIt(this);
        }
    },
    'keyup #BRset4, focusout #BRset4': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 4, 'B', score);
            printIt(this);
        }
    },
    'keyup #BRset5, focusout #BRset5': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 5, 'B', score);
            printIt(this);
        }
    },
    'keyup #BRset6, focusout #BRset6': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 6, 'B', score);
            printIt(this);
        }
    },
    'keyup #BRset7, focusout #BRset7': function(event, template) {
        if (event.which == 13 || event.which == 0) {
            var score = event.target.value;
            updateScores(this, 7, 'B', score);
            printIt(this);
        }
    },
    'click #byeWalkOverPlayerBL': function(e) {
        var roundNumber = JSON.parse(JSON.stringify(this)).roundNumber;
        if (Router.current().params._eventType && Router.current().params._eventType == "past")
            tournament = pastEvents.findOne({
                "_id": Router.current().params._id
            });
        else {
            tournament = events.findOne({
                "_id": Router.current().params._id
            });
        }

        if (tournament.eventOrganizer != Meteor.userId()) {
            return false;
        } else {
            $("#renderbyeWalkOver").empty();
            Session.set("byeWalkoverMatchRec", undefined);
            Blaze.render(Template.byeWalkOver, $("#renderbyeWalkOver")[0]);
            Session.set("namePlayerA", $(e.target).attr('name'))
            Session.set("namePlayerB", $(e.target).parent().attr('name'));
            Session.set("byeWalkoverMatchRec", this);
            Session.set("byeWalkoverRoundNumber", roundNumber);

            $("#byeWalkOver").modal({
                backdrop: 'static'
            });
        }



    },
    'click #byeWalkOverPlayerBR': function(e) {

        var roundNumber = JSON.parse(JSON.stringify(this)).roundNumber;

        if (Router.current().params._eventType && Router.current().params._eventType == "past")
            tournament = pastEvents.findOne({
                "_id": Router.current().params._id
            });

        else {
            tournament = events.findOne({
                "_id": Router.current().params._id
            });
        }
        if (tournament.eventOrganizer != Meteor.userId()) {
            return false;
        } else {
            $("#renderbyeWalkOver").empty();
            Blaze.render(Template.byeWalkOver, $("#renderbyeWalkOver")[0]);
            var matchrec = this;
            Session.set("namePlayerB", $(e.target).attr('name'))
            Session.set("namePlayerA", $(e.target).parent().attr('name'));
            Session.set("byeWalkoverMatchRec", this);
            Session.set("byeWalkoverRoundNumber", roundNumber);
            Session.set("completedRecordBefore", this);

            $("#byeWalkOver").modal({
                backdrop: 'static'
            });
        }


    },
});

function updateName(matchRecord, setNumber, player, playerName) {
    var thisMatchNumber = matchRecord.matchNumber;
    var names = matchRecord.players;
    if (matchRecord.winner != "") {
        matchRecord.winner = playerName.trim();
    }
    if (player == "A") names.playerA = playerName.trim();
    else if (player == "B") names.playerB = playerName.trim();
    matchRecord.players = names;
    // var tmpRec = checkForCompletion (matchRecord);
    //  matchRecord = tmpRec;
    var updated = 0;
    var leftRMatches = Session.get("leftRMatches");
    var rightRMatches = Session.get("rightRMatches");
    var updI = 0;
    var fromLeft = 0;
    for (let i = 0; i < leftRMatches.length; i++) {
        if (leftRMatches[i].matchNumber == thisMatchNumber) {
            leftRMatches[i] = matchRecord;
            updI = i;
            updated = 1;
            fromLeft = 1;
            break;
        }
    }
    if (!updated) {
        for (let i = 0; i < rightRMatches.length; i++) {
            if (rightRMatches[i].matchNumber == thisMatchNumber) {
                rightRMatches[i] = matchRecord;
                updI = i;
                break;
            }
        }
    }

    var matchRecords = Session.get("matchRecords");
    matchRecords[thisMatchNumber - 1] = matchRecord;
    Session.set("leftRMatches", leftRMatches);
    Session.set("rightRMatches", rightRMatches);
    Session.set("matchRecords", matchRecords);
    matchRecords = Session.get("matchRecords");
    //propogatePlayer (matchRecord, fromLeft);
    Meteor.call("updateMatchRecords", Session.get("tournamentId"), Session.get("eventName"), matchRecords,matchRecord);
}

Template.byeWalkOver.helpers({
    "namePlayerA": function() {
        var matchrec = Session.get("byeWalkoverMatchRec");
        return Session.get("namePlayerA")
    },
    "namePlayerB": function() {
        return Session.get("namePlayerB")
    },
    "matchPlayerA":function()
    {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if(matchrec && matchrec.playersID && matchrec.playersID.playerAId)
        {
            return matchrec.playersID.playerAId
        }

    },
    "matchPlayerB":function()
    {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if(matchrec && matchrec.playersID && matchrec.playersID.playerBId)
        {
            return matchrec.playersID.playerBId
        }

    },
    "winnerB":function(){

    },
    "CS0": function() {

        var curMatchRecord = Session.get("byeWalkoverMatchRec")
        try {
            return (curMatchRecord.completedscores[0]);

        } catch (e) {}
    },
    "lockStatus":function()
    {
        //byeWalkOver
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        var result2 = ReactiveMethod.call("getMatchDrawsLock",tournamentId,eventName);
        return result2;
    },
    "possibleScores": function() {
        try {
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName");
            var roundNumber = Session.get("byeWalkoverRoundNumber");
            var possibleScores = [];

            var possibleScoresConfig = MatchCollectionConfig.findOne({
                "tournamentId": tournamentId,
                "eventName": eventName
            }, {
                "roundValues": {
                    $elemMatch: {
                        "roundNumber": Session.get("roundNumber")
                    }
                }
            }, {
                fields: {
                    "roundValues": 1
                }
            });
            if (possibleScoresConfig != undefined) {

                //var mx = parseInt(possibleScoresConfig.roundValues.length) - parseInt(1);
                //var posRound = possibleScoresConfig.roundValues[mx - 1].roundNumber;
                //Session.set("byeWalkoverFinalRoundNumber", posRound);


                for (var i = 0; i < possibleScoresConfig.roundValues.length; i++) {

                    if (possibleScoresConfig.roundValues[i].roundName.toLowerCase() == 'final') 
                    {
                        var posRound = possibleScoresConfig.roundValues[i].roundNumber;
                        Session.set("byeWalkoverFinalRoundNumber", posRound);

                    }

                    if (possibleScoresConfig.roundValues[i].roundName.toLowerCase() == 'winner') {
                        var winnerPoints = possibleScoresConfig.roundValues[i].points;
                        Session.set("byeWalkoverWinnerPoints", winnerPoints);

                    }

                    if (possibleScoresConfig.roundValues[i].roundNumber == roundNumber) {
                        var sets = possibleScoresConfig.roundValues[i].noofSets;
                        var minScoresToWin = possibleScoresConfig.roundValues[i].minScores;
                        var minDifference = possibleScoresConfig.roundValues[i].minDifference;
                        var points = possibleScoresConfig.roundValues[i].points;
                        var roundName = possibleScoresConfig.roundValues[i].roundName;

                        Session.set("byeWalkoverMinScoresToWin", minScoresToWin);
                        Session.set("byeWalkoverMinDifference", minDifference);
                        Session.set("byeWalkoverPoints", points);
                        Session.set("byeWalkoverSets", sets);
                        Session.set("byeWalkoverRoundName", roundName);

                        for (var k = 1; k <= sets; k++) {
                            possibleScores.push(k);

                        }
                    }
                }
                return possibleScores;
            }
        } catch (e) {}

    }
});

Template.byeWalkOver.events({
    "change input[type=radio][name=set]": function(e) {
        e.preventDefault();
        if (e.target.id == "setWalkover") {
            $("#walkoverA").prop("checked", true)
            $("#scoresInfo").hide();

        } else if (e.target.id == "setBye") {
            $("#byeA").prop("checked", true);
            $("#scoresInfo").hide();

        }
        /* shalini code starts here*/
        else {
            $("#completedA").prop("checked", true);
            $("#scoresInfo").show();


        }

    },
    /* shalini code ends here */
    "keypress #score": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 43 || keycode == 45 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true;

        
    },
    "change input[type=radio][name=byeWalkover]": function(e) {
        e.preventDefault();
        if (e.target.id == "walkoverA" || e.target.id == "walkoverB") {
            $("#setWalkover").prop("checked", true);
            $("#scoresInfo").hide();

        } else if (e.target.id == "byeA" || e.target.id == "byeB") {
            $("#setBye").prop("checked", true)
            $("#scoresInfo").hide();

        } else if (e.target.id == "completedA" || e.target.id == "completedB") {
            $("#setCompleted").prop("checked", true);
            $("#scoresInfo").show();

        }
    },
    "click #notifyByRound":function(){
        try{
            var data1 = {
                tournamentId:Session.get("tournamentId"),
                eventName:Session.get("eventName"),
                blank:false,
                eventOrganizer:Meteor.userId(),
                roundNot:true
            }

            try{
                if(Session.get("byeWalkoverMatchRec") && 
                    Session.get("byeWalkoverMatchRec").roundNumber){

                    var data = {
                        tournamentId:Session.get("tournamentId"),
                        eventName:Session.get("eventName"),
                        db:"MatchCollectionDB",
                        roundNumber:Session.get("byeWalkoverMatchRec").roundNumber
                    }

                    Meteor.call("getFirstMatchNumberMatchCol",data,function(e,res){
                        if(res){
                            var s = Session.get("byeWalkoverMatchRec")

                            if(s && s.matchNumber){
                                data1["matchNumber"] = res
                            }
                            if(s && s.roundNumber){
                                data1["roundNumber"] = s.roundNumber
                            }

                            Meteor.call("notifyAppMatchRecord",data1,function(e,res){

                            })
                            $("#byeWalkOver").modal('hide')
                        }
                    })
                }
            }catch(e){

            }
        }catch(e){
            alert(e)
        }
    },
    "click #notifyMatchSet":function(){
        try{
            var data = {
                tournamentId:Session.get("tournamentId"),
                eventName:Session.get("eventName"),
                blank:false,
                eventOrganizer:Meteor.userId()
            }

            var curMatchRecord = Session.get("byeWalkoverMatchRec");

            if(curMatchRecord)
            {

                if(curMatchRecord && curMatchRecord.matchNumber){
                    data["matchNumber"] = curMatchRecord.matchNumber
                }
                if(curMatchRecord && curMatchRecord.roundNumber){
                    data["roundNumber"] = curMatchRecord.roundNumber
                }
            }

            Meteor.call("notifyAppMatchRecord",data,function(e,res){

            })
            $("#byeWalkOver").modal('hide')

            
        }catch(e){
            alert(e)
        }
    },
    "click #savebyewalkover": function(e) {
        e.preventDefault();
        
            var tournament = "";
            var eventN = "";
            var roundNo = "";
            var matchNo = "";
            var status = "";
            var winnerId = ""
            var autoTweet = $("#checkAcceptboxTweett").prop("checked");

            $("#editSettingsPopupError").text("");
            var tourType;
            if (Router.current().params._eventType)
                tourType = Router.current().params._eventType;

            var setType = $('input[name=set]:checked').val();
            var playerName = $('input[name=byeWalkover]:checked').val();
            var playerAorB = $('input[name=byeWalkover]:checked').attr("id");
            var curMatchRecord = Session.get("byeWalkoverMatchRec");
            if (setType == "Bye") {
                curMatchRecord.status = 'bye';
                curMatchRecord.winner = playerName;
                if (playerAorB == "byeA") {
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameBye';
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
                } else if (playerAorB == "byeB") {
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameBye';
                }

                var points = Session.get("byeWalkoverPoints");
                var loserId = "";
                var winnerId = "";
                var winnerNo = "";
                var loser = "";
                var roundName = Session.get("byeWalkoverRoundName");


                var roundNumber = Session.get("byeWalkoverRoundNumber");
                var finalRoundNumber = Session.get("byeWalkoverFinalRoundNumber");



                var eventName = Session.get("eventName");
                var tournamentId = Session.get("tournamentId");
                if (playerAorB == "byeA") {
                    loserId = curMatchRecord.playersID.playerBId;
                    loser = curMatchRecord.players.playerB;
                    winnerId = curMatchRecord.playersID.playerAId;
                    curMatchRecord.winnerID = curMatchRecord.playersID.playerAId;
                    curMatchRecord.winnerNo = "";
                    if(curMatchRecord.playersNo && curMatchRecord.playersNo.playerANo)
                    {
                        winnerNo = curMatchRecord.playersNo.playerANo;
                        curMatchRecord.winnerNo = curMatchRecord.playersNo.playerANo;
                    }
                    
                } else if (playerAorB == "byeB") {
                    loserId = curMatchRecord.playersID.playerAId;
                    loser = curMatchRecord.players.playerA;
                    winnerId = curMatchRecord.playersID.playerBId;
                    curMatchRecord.winnerID = curMatchRecord.playersID.playerBId;
                    curMatchRecord.winnerNo = "";
                    if(curMatchRecord.playersNo &&  curMatchRecord.playersNo.playerBNo)
                    {
                        winnerNo = curMatchRecord.playersNo.playerBNo;
                        curMatchRecord.winnerNo = curMatchRecord.playersNo.playerBNo;
                    }
                    
                        
                }
                var eventOr = undefined;
                if (Router.current().params._eventType && Router.current().params._eventType == "past")
                    eventOr = pastEvents.findOne({
                        "_id": tournamentId
                    });
                else
                    eventOr = events.findOne({
                        "_id": tournamentId
                    });
                var eventOrganizer = "";
                if (eventOr != undefined) {
                    eventOrganizer = eventOr.eventOrganizer;
                    var userAss = Meteor.users.findOne({
                        "userId": eventOrganizer
                    })
                    var rankingEnabled = Session.get("dobfilters");
                    if (rankingEnabled) {
                        if (userAss != undefined && rankingEnabled.trim() == "yes") 
                        {
                            if (finalRoundNumber == roundNumber) 
                            {
                                
                                var winnerPoints = Session.get("byeWalkoverWinnerPoints");
                                if (winnerId.trim() != "") {
                                    //Meteor.call("updatePoints", tournamentId, eventName, winnerId, playerName, winnerPoints, eventOrganizer, tourType);
                                    Meteor.call("updatePoints", tournamentId, eventName, winnerId, winnerPoints);

                                }
                            }
                            if (loserId.trim() != "") 
                            {
                               // Meteor.call("updatePoints", tournamentId, eventName, loserId, loser, points, eventOrganizer, tourType);
                                Meteor.call("updatePoints", tournamentId, eventName, loserId, points);

                                if (finalRoundNumber != roundNumber) 
                                {
                                   // Meteor.call("removeloserpoints", tournamentId, eventName, winnerId, loser, points, eventOrganizer, tourType);
                                    Meteor.call("removeloserpoints", tournamentId, eventName, winnerId, points);

                                }

                            }
                        }
                    }
                }
                    tournament = tournamentId;
                    eventN = Session.get("eventName");
                    winnerId = curMatchRecord.winnerID;
                    winnerNo = curMatchRecord.winnerNo;
                    roundNo = roundName;
                    matchNo =  curMatchRecord.matchNumber;
                    status = "Bye";
                    autoTweet = $("#checkAcceptboxTweett").prop("checked");

            }
             else if (setType == "Walkover") {
                curMatchRecord.status = 'walkover';
                curMatchRecord.winner = playerName;
                if (playerAorB == "walkoverA") {
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameWalkover';
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
                } else if (playerAorB == "walkoverB") {
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameWalkover';
                }


                var points = Session.get("byeWalkoverPoints");
                var loserId = "";
                var winnerId = "";
                var winnerNo = "";
                var loser = "";
                var roundName = Session.get("byeWalkoverRoundName");
                var roundNumber = Session.get("byeWalkoverRoundNumber");
                var finalRoundNumber = Session.get("byeWalkoverFinalRoundNumber");
                var eventName = Session.get("eventName");
                var tournamentId = Session.get("tournamentId");
                if (playerAorB == "walkoverA") {
                    loserId = curMatchRecord.playersID.playerBId;
                    loser = curMatchRecord.players.playerB;
                    winnerId = curMatchRecord.playersID.playerAId;
                    curMatchRecord.winnerID = curMatchRecord.playersID.playerAId;
                    curMatchRecord.winnerNo = "";
                    if(curMatchRecord.playersNo && curMatchRecord.playersNo.playerANo)
                    {
                        winnerNo = curMatchRecord.playersNo.playerANo;
                        curMatchRecord.winnerNo = curMatchRecord.playersNo.playerANo;
                    }
                } else if (playerAorB == "walkoverB") {
                    loserId = curMatchRecord.playersID.playerAId;
                    loser = curMatchRecord.players.playerA;
                    winnerId = curMatchRecord.playersID.playerBId;
                    curMatchRecord.winnerID = curMatchRecord.playersID.playerBId;
                    curMatchRecord.winnerNo = "";
                    if(curMatchRecord.playersNo && curMatchRecord.playersNo.playerBNo)
                    {
                        winnerNo = curMatchRecord.playersNo.playerBNo;
                        curMatchRecord.winnerNo = curMatchRecord.playersNo.playerBNo;
                    }
                }
                var eventOr = undefined;
                if (Router.current().params._eventType && Router.current().params._eventType == "past")
                    eventOr = pastEvents.findOne({
                        "_id": tournamentId
                    });
                else
                    eventOr = events.findOne({
                        "_id": tournamentId
                    });
                var eventOrganizer = "";
                if (eventOr != undefined) {
                    eventOrganizer = eventOr.eventOrganizer;
                    var userAss = Meteor.users.findOne({
                        "userId": eventOrganizer
                    })
                    var rankingEnabled = Session.get("dobfilters");
                    if (rankingEnabled) {
                        if (userAss != undefined && rankingEnabled.trim() == "yes") {
                            if (finalRoundNumber == roundNumber) 
                            {
                                var winnerPoints = Session.get("byeWalkoverWinnerPoints");
                                if (winnerId.trim() != "") {
                                    //Meteor.call("updatePoints", tournamentId, eventName, winnerId, playerName, winnerPoints, eventOrganizer, tourType);
                                    Meteor.call("updatePoints", tournamentId, eventName, winnerId, winnerPoints);

                                }
                            }

                            if (loserId.trim() != "") {
                                //Meteor.call("updatePoints", tournamentId, eventName, loserId, loser, points, eventOrganizer, tourType);
                                Meteor.call("updatePoints", tournamentId, eventName, loserId, points);

                                if (finalRoundNumber != roundNumber) 
                                {                            
                                    //Meteor.call("removeloserpoints", tournamentId, eventName, winnerId, loser, points, eventOrganizer, tourType);
                                    Meteor.call("removeloserpoints", tournamentId, eventName, winnerId, points);

                                }

                            }
                        }
                    }
                }
                    tournament = tournamentId;
                    eventN = Session.get("eventName");
                    winnerId = curMatchRecord.winnerID;
                    winnerNo = curMatchRecord.winnerNo;
                    roundNo = roundName;
                    matchNo =  curMatchRecord.matchNumber;
                    status = "Walkover";
                    autoTweet = $("#checkAcceptboxTweett").prop("checked");


            } else if (setType == "Completed") 
            {
               
                    var playerScoreA = {
                        scoresA: []
                    };
                    var playerScoreB = {
                        scoresB: []
                    };
                    var minDifference = Session.get("byeWalkoverMinDifference");
                    var minScoresToWin = Session.get("byeWalkoverMinScoresToWin");
                    curMatchRecord.status = 'completed';
                    var status = 'completed';
                    var winner = playerName;
                    curMatchRecord.winner = playerName;

                    var set1 = $("#compSet0").find("input[name='score']").val();
                    var set2 = $("#compSet1").find("input[name='score']").val();
                    var set3 = $("#compSet2").find("input[name='score']").val();
                    var set4 = $("#compSet3").find("input[name='score']").val();
                    var set5 = $("#compSet4").find("input[name='score']").val();
                    var set6 = $("#compSet5").find("input[name='score']").val();
                    var set7 = $("#compSet6").find("input[name='score']").val();


                    try{

                    if(set1 != undefined && set1.trim().length > 0)
                    {
                        if(set1 != -0 || set1 != "-0")                  
                            set1 = parseInt(set1);
                    }
                    if(set2 != undefined && set2.trim().length > 0){
                        if(set2 != -0 || set2 != "-0")                  
                            set2 = parseInt(set2);
                    }
                    if(set3 != undefined && set3.trim().length > 0){
                        if(set3 != -0 || set3 != "-0")
                            set3 = parseInt(set3);
                    }
                    if(set4 != undefined && set4.trim().length > 0){
                        if(set4 != -0 || set4 != "-0")
                            set4 = parseInt(set4);
                    }
                    if(set5 != undefined && set5.trim().length > 0){
                        if(set5 != -0 || set5 != "-0"){
                            set5 = parseInt(set5);
                        }
                       
                    }
                    if(set6 != undefined && set6.trim().length > 0){
                        if(set6 != -0 || set6 != "-0")
                            set6 = parseInt(set6);
                    }
                    if(set7 != undefined && set7.trim().length > 0){
                        if(set7 != -0 || set7 != "-0")
                            set7 = parseInt(set7);
                    }

                    /*if(set1 == null || set2 == null || set3 == null || 
                        set4 == null || set5 == null || set6 == null || set7 == null)
                    {
                       $("#editSettingsPopupError").text("* Incomplete settttt");
                        return false; 
                    }*/
                        
                

                    var setsToBePlayed = Session.get("byeWalkoverSets");


                    var sets = {
                        "set1": set1,
                        "set2": set2,
                        "set3": set3,
                        "set4": set4,
                        "set5": set5,
                        "set6": set6,
                        "set7": set7
                    };

                    var byeWalkoverSets = Session.get("byeWalkoverSets");
                   

                    var dataJson = setJson(sets, minDifference, minScoresToWin, byeWalkoverSets);
                    var completedScores = [];
                    var completedSetScores  = [];
                    if (set1 != undefined) {
                        completedScores.push(set1);
                        completedSetScores.push(set1.toString());
                    }
                    if (set2 != undefined) {
                        completedScores.push(set2);
                        completedSetScores.push(set2.toString());
                    }
                    if (set3 != undefined) {
                        completedScores.push(set3);
                        completedSetScores.push(set3.toString());
                    }
                    if (set4 != undefined) {
                        completedScores.push(set4);
                        completedSetScores.push(set4.toString());
                    }
                    if (set5 != undefined) {
                        completedScores.push(set5);
                        completedSetScores.push(set5.toString());
                    }
                    if (set6 != undefined) {
                        completedScores.push(set6);
                        completedSetScores.push(set6.toString());
                    }
                    if (set7 != undefined) {
                        completedScores.push(set7);
                        completedSetScores.push(set7.toString());
                    }
                    var numSetWinsReqd = parseInt((parseInt(setsToBePlayed) + 1) / 2);
                    var setScoresA = JSON.parse(JSON.stringify(dataJson)).scores.setScoresA;
                    var setScoresB = JSON.parse(JSON.stringify(dataJson)).scores.setScoresB;

                    if (setScoresA.length < numSetWinsReqd) return;
                    if (setScoresA.length != setScoresB.length) return;
                    let winsA = 0,
                        winsB = 0;

                    for (var j = 0; j < completedScores.length; j++) {
                        if(completedScores[j].toString().trim() != "" && completedScores[j] != undefined)
                        {        
                            if(typeof completedScores[j] == "number")
                            {
                                if (completedScores[j] > 0 || completedScores[j] == 0)       
                                {
                                    winsA++;
                                }          
                                else if (completedScores[j] < 0){

                                    winsB++;

                                }
                            }
                            else if(typeof completedScores[j] == "string")
                            {
                                if(completedScores[j] == "-0")
                                {
                                    winsB++;
                                }
                            }
                           
                        }
                    }

                    curMatchRecord.status = 'completed';
                   
                    if (winsA == numSetWinsReqd) {
                        curMatchRecord.winner = curMatchRecord.players.playerA;
                        curMatchRecord.winnerID = curMatchRecord.playersID.playerAId;
                        if(curMatchRecord.playersNo && curMatchRecord.playersNo.playerANo)
                            curMatchRecord.winnerNo = curMatchRecord.playersNo.playerANo;
                        curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameLost';
                        curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';


                    } else if (winsB == numSetWinsReqd) {

                        curMatchRecord.status = 'completed';
                        curMatchRecord.winner = curMatchRecord.players.playerB;
                        curMatchRecord.winnerID = curMatchRecord.playersID.playerBId;
                        if(curMatchRecord.playersNo && curMatchRecord.playersNo.playerBNo)
                            curMatchRecord.winnerNo = curMatchRecord.playersNo.playerBNo;
                        curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameLost';
                        curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';



                    } else {
                        $("#editSettingsPopupError").text("* Incomplete set");
                        return false;
                    }


                    var thisMatchNumber = curMatchRecord.matchNumber;
                    curMatchRecord.completedscores = completedSetScores;
                    curMatchRecord.scores = JSON.parse(JSON.stringify(dataJson)).scores;
                   

                    var points = Session.get("byeWalkoverPoints");
                    var playerId = "";
                    var winnerId = "";
                    var winnerNo = "";
                    var loser = "";
                    var roundName = Session.get("byeWalkoverRoundName");
                    var roundNumber = Session.get("byeWalkoverRoundNumber");
                    var finalRoundNumber = Session.get("byeWalkoverFinalRoundNumber");
                    var eventName = Session.get("eventName");
                    var tournamentId = Session.get("tournamentId");
                    if (winsA == numSetWinsReqd) {
                        playerId = curMatchRecord.playersID.playerBId;
                        loser = curMatchRecord.players.playerB;
                        winnerId = curMatchRecord.playersID.playerAId;
                        curMatchRecord.winnerID = curMatchRecord.playersID.playerAId;
                        curMatchRecord.winnerNo = "";

                        if(curMatchRecord.playersNo && curMatchRecord.playersNo.playerANo)
                        {
                            winnerNo = curMatchRecord.playersNo.playerANo;
                            curMatchRecord.winnerNo = curMatchRecord.playersNo.playerANo;
                        }
                    } else if (winsB == numSetWinsReqd) {
                        playerId = curMatchRecord.playersID.playerAId;
                        loser = curMatchRecord.players.playerA;
                        winnerId = curMatchRecord.playersID.playerBId;
                        curMatchRecord.winnerID = curMatchRecord.playersID.playerBId;
                        curMatchRecord.winnerNo = "";
                        if(curMatchRecord.playersNo && curMatchRecord.playersNo.playerBNo)
                        {
                            winnerNo = curMatchRecord.playersNo.playerBNo;
                            curMatchRecord.winnerNo = curMatchRecord.playersNo.playerBNo;
                        }
                    }
                    tournament = tournamentId;
                    eventN = eventName;
                    winnerId = curMatchRecord.winnerID;
                    winnerNo = curMatchRecord.winnerNo;
                    roundNo = Session.get("byeWalkoverRoundName");
                    matchNo = thisMatchNumber;
                    status = "Completed";
                    autoTweet = $("#checkAcceptboxTweett").prop("checked");

                    var eventOr = undefined;
                    if (Router.current().params._eventType && Router.current().params._eventType == "past")
                        eventOr = pastEvents.findOne({
                            "_id": tournamentId
                        });
                    else
                        eventOr = events.findOne({
                            "_id": tournamentId
                        });
                    var eventOrganizer = "";
                    if (eventOr != undefined) {
                        eventOrganizer = eventOr.eventOrganizer;
                        var userAss = Meteor.users.findOne({
                            "userId": eventOrganizer
                        })
                        var rankingEnabled = Session.get("dobfilters");

                        if (rankingEnabled) {
                            if (userAss != undefined && rankingEnabled.trim() == "yes") {
                                if (finalRoundNumber == roundNumber) 
                                {
                                    var winnerPoints = Session.get("byeWalkoverWinnerPoints");
                                    if (winnerId.trim() != "") {
                                        //Meteor.call("updatePoints", tournamentId, eventName, winnerId, playerName, winnerPoints, eventOrganizer, tourType);
                                        Meteor.call("updatePoints", tournamentId, eventName, winnerId,winnerPoints);

                                    }
                                }
                                if (playerId.trim() != "") {
                                    //Meteor.call("updatePoints", tournamentId, eventName, playerId, loser, points, eventOrganizer, tourType);
                                    Meteor.call("updatePoints", tournamentId, eventName, playerId, points);

                                    if (finalRoundNumber != roundNumber) {
                                        //Meteor.call("removeloserpoints", tournamentId, eventName, winnerId, loser, points, eventOrganizer, tourType);
                                        Meteor.call("removeloserpoints", tournamentId, eventName, winnerId, points);

                                    }

                                }
                            }
                        }
                    }

                } catch (e) {


                }


            }

            if (setType == "Bye" || setType == "Walkover" || setType == "Completed") {
                var thisMatchNumber = curMatchRecord.matchNumber;
                var tmpRec = curMatchRecord;
                var matchRecord = tmpRec;

                var updated = 0;
                var leftRMatches = Session.get("leftRMatches");
                var rightRMatches = Session.get("rightRMatches");
                var updI = 0;
                var fromLeft = 0;
                for (let i = 0; i < leftRMatches.length; i++) {
                    if (leftRMatches[i].matchNumber == thisMatchNumber) {
                        leftRMatches[i] = matchRecord;
                        updI = i;
                        updated = 1;
                        fromLeft = 1;
                        break;
                    }
                }
                if (!updated) {
                    for (let i = 0; i < rightRMatches.length; i++) {
                        if (rightRMatches[i].matchNumber == thisMatchNumber) {
                            rightRMatches[i] = matchRecord;
                            updI = i;
                            break;
                        }
                    }
                }

                var matchRecords = Session.get("matchRecords");
                matchRecords[thisMatchNumber - 1] = matchRecord;
                Session.set("leftRMatches", leftRMatches);
                Session.set("rightRMatches", rightRMatches);
                Session.set("matchRecords", matchRecords);

                propogatePlayer(matchRecord, fromLeft);
                matchRecords = Session.get("matchRecords");
                Meteor.call("updateMatchRecords", Session.get("tournamentId"), Session.get("eventName"), matchRecords,matchRecord, function(e, res) {
                    Meteor.call("mainRoundsCompletedSingles", Session.get("maxRoundNum"), autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,curMatchRecord.roundNumber, function(e, res){})
                    Meteor.call("matchCompletedAutoTweet", autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status, function(e, res) {
                        Meteor.call("nextRoundDecidedForSingles",autoTweet,tournament,eventN,roundNo,matchNo,function(e,r){})
                    })
                });
                if(parseInt(curMatchRecord.roundNumber)==parseInt(Session.get("maxRoundNum"))){
                    Meteor.call("matchConcludedSingles",autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,function(e,res){})
                }
                $("#byeWalkOver").modal('hide')
            }
        
        

    },
    'click #byePTagsub': function() {
        return false;
    }
});




Template.registerHelper("checkBye", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "bye") {
            if (data == matchrec.winner) {
                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});


Template.registerHelper("setBye", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "bye") {
            if (data == matchrec.winnerID) {
                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});


Template.registerHelper("checkByeLabel", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "bye") {
            return "checked";
        } else {
            return "";
        }
    } catch (e) {}
});


Template.registerHelper("checkWalkoverLabel", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "walkover") {
            return "checked";
        } else {
            return "";
        }
    } catch (e) {}
});

Template.registerHelper("checkWalk", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "walkover") {
            if (data == matchrec.winner) {
                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});

Template.registerHelper("setWalk", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "walkover") {
            if (data == matchrec.winnerID) {
                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});


Template.registerHelper("checkCompletedLabel", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "completed") {
            $("#scoresInfo").show();
            return "checked";
        } else {
            return "";
        }
    } catch (e) {}
});

Template.registerHelper("checkCompleted", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "completed") {
            if (data == matchrec.winner) {
                $("#scoresInfo").show();

                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});

Template.registerHelper("setCompleted", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec");
        if (matchrec !== undefined && matchrec.status == "completed") {
            if (data == matchrec.winnerID) {
                $("#scoresInfo").show();

                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});

Template.registerHelper("CS", function(data) {
    var curMatchRecord = Session.get("byeWalkoverMatchRec")
    try {
        //$("#scoresInfo").show()
        return curMatchRecord.completedscores[parseInt(data)];

    } catch (e) {}
});

export function setJson(sets, minDifference, minScoresToWin, byeWalkoverSets) {
    try{
    var jsonObj = JSON.parse(JSON.stringify(sets));
    var aSet1 = 0, aSet2 = 0, aSet3 = 0, aSet4 = 0, aSet5 = 0, aSet6 = 0, aSet7 = 0;
    var bSet1 = 0, bSet2 = 0, bSet3 = 0, bSet4 = 0, bSet5 = 0, bSet6 = 0, bSet7 = 0;
    var data;
    if (byeWalkoverSets >= 3) 
    {
        var set1 = jsonObj.set1;
        var set2 = jsonObj.set2;
        var set3 = jsonObj.set3;

        var conditionScoreSet1 = Number(Math.abs(set1)) + Number(minDifference);
        var conditionScoreSet2 = Number(Math.abs(set2)) + Number(minDifference);
        var conditionScoreSet3 = Number(Math.abs(set3)) + Number(minDifference);

        if((typeof set1 == "string") && set1.length == 0)
        {
            aSet1 = 0;
            bSet1 = 0;
        }
        else if (set1 < 0) {
            aSet1 = Math.abs(set1);
            if (conditionScoreSet1 <= Number(minScoresToWin))
                bSet1 = Number(minScoresToWin);
            else
                bSet1 = Number(conditionScoreSet1);
        } else if (set1 > 0) {
            bSet1 = set1;
            if (conditionScoreSet1 <= Number(minScoresToWin))
                aSet1 = Number(minScoresToWin);
            else
                aSet1 = Number(conditionScoreSet1);
        } 
        else if(set1 === 0){

            bSet1 = set1;
            aSet1 = Number(minScoresToWin);
        }
        else if(set1 == -0 || set1 == "-0")
        {
            bSet1 = Number(minScoresToWin);
            aSet1 = Number(set1);
        }
        else {
            aSet1 = 0;
            bSet1 = 0;
        }

        if((typeof set2 == "string") && set2.length == 0)
        {
            aSet2 = 0;
            bSet2 = 0;
        }
        else if (set2 < 0) {
            aSet2 = Math.abs(set2);;
            if (conditionScoreSet2 <= Number(minScoresToWin))
                bSet2 = Number(minScoresToWin);
            else
                bSet2 = Number(conditionScoreSet2);
        } else if (set2 > 0) {
            bSet2 = set2;
            if (conditionScoreSet2 <= Number(minScoresToWin))
                aSet2 = Number(minScoresToWin);
            else
                aSet2 = Number(conditionScoreSet2);
        }
        else if(set2 === 0){
            bSet2 = set2;
            aSet2 = Number(minScoresToWin);
        }
        else if(set2 == -0 || set2 == "-0")
        {
            bSet2 = Number(minScoresToWin);
            aSet2 = Number(set2);
        }
         else {
            aSet2 = 0;
            bSet2 = 0;
        }

        if((typeof set3 == "string") && set3.length == 0)
        {
            aSet3 = 0;
            bSet3 = 0;
        }
        else if (set3 < 0) {
            aSet3 = Math.abs(set3);
            if (conditionScoreSet3 <= Number(minScoresToWin))
                bSet3 = Number(minScoresToWin);
            else
                bSet3 = Number(conditionScoreSet3);
        } else if (set3 > 0) {
            bSet3 = set3;
            if (conditionScoreSet3 <= Number(minScoresToWin))
                aSet3 = Number(minScoresToWin);
            else
                aSet3 = Number(conditionScoreSet3);
        }
        else if(set3 === 0){
            bSet3 = set3;
            aSet3 = Number(minScoresToWin);
        }
        else if(set3 == -0 || set3 == "-0")
        {
            bSet3 = Number(minScoresToWin);
            aSet3 = Number(set3);
        }
         else {
            aSet3 = 0;
            bSet3 = 0;
        }

        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "0", "0", "0", "0"],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "0", "0", "0", "0"]
            }
        }

    }
    if (byeWalkoverSets >= 5) {
        var set4 = jsonObj.set4;
        var set5 = jsonObj.set5;

        var conditionScoreSet4 = Number(Math.abs(set4)) + Number(minDifference);
        var conditionScoreSet5 = Number(Math.abs(set5)) + Number(minDifference);

        if((typeof set4 == "string") && set4.length == 0)
        {
            aSet4 = 0;
            bSet4 = 0;
        }
        else if (set4 < 0) {
            aSet4 = Math.abs(set4);
            if (conditionScoreSet4 <= Number(minScoresToWin))
                bSet4 = Number(minScoresToWin);
            else
                bSet4 = Number(conditionScoreSet4);
        } else if (set4 > 0) {
            bSet4 = set4;
            if (conditionScoreSet4 <= Number(minScoresToWin))
                aSet4 = Number(minScoresToWin);
            else
                aSet4 = Number(conditionScoreSet4);
        } 
        else if(set4 === 0){
            bSet4 = set4;
            aSet4 = Number(minScoresToWin);
        }
        else if(set4 == -0 || set4 == "-0")
        {
            bSet4 = Number(minScoresToWin);
            aSet4 = Number(set4);
        }
        else {
            aSet4 = 0;
            bSet4 = 0;
        }

        if((typeof set5 == "string") && set5.length == 0)
        {
            aSet5 = 0;
            bSet5 = 0;
        }
        else if (set5 < 0) {
            aSet5 = Math.abs(set5);
            if (conditionScoreSet5 <= Number(minScoresToWin))
                bSet5 = Number(minScoresToWin);
            else
                bSet5 = Number(conditionScoreSet5);
        } else if (set5 > 0) {
            bSet5 = set5;
            if (conditionScoreSet5 <= Number(minScoresToWin))
                aSet5 = Number(minScoresToWin);
            else
                aSet5 = Number(conditionScoreSet5);
        }
        else if(set5 === 0){
            bSet5 = set5;
            aSet5 = Number(minScoresToWin);
        }
        else if(set5 == -0 || set5 == "-0")
        {
            bSet5 = Number(minScoresToWin);
            aSet5 = Number(set5);
        }
        else {
            aSet5 = 0;
            bSet5 = 0;
        }

        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "" + aSet4 + "", "" + aSet5 + "", "0", "0"],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "" + bSet4 + "", "" + bSet5 + "", "0", "0"]
            }
        }

    }
    if (byeWalkoverSets == 7) {
        var set6 = jsonObj.set6;
        var set7 = jsonObj.set7;

        var conditionScoreSet6 = Number(Math.abs(set6)) + Number(minDifference);
        var conditionScoreSet7 = Number(Math.abs(set7)) + Number(minDifference);

        if((typeof set6 == "string") && set6.length == 0)
        {
            aSet6 = 0;
            bSet6 = 0;
        }
        else if (set6 < 0) {
            aSet6 = Math.abs(set6);
            if (conditionScoreSet6 <= Number(minScoresToWin))
                bSet6 = Number(minScoresToWin);
            else
                bSet6 = Number(conditionScoreSet6);
        } else if (set6 > 0) {
            bSet6 = set6;
            if (conditionScoreSet6 <= Number(minScoresToWin))
                aSet6 = Number(minScoresToWin);
            else
                aSet6 = Number(conditionScoreSet6);
        }
        else if(set6 === 0){
            bSet6 = set6;
            aSet6 = Number(minScoresToWin);
        }
        else if(set6 == -0 || set6 == "-0")
        {
            bSet6 = Number(minScoresToWin);
            aSet6 = Number(set6);
        }
         else {
            aSet6 = 0;
            bSet6 = 0;
        }


        if((typeof set7 == "string") && set7.length == 0)
        {
            aSet7 = 0;
            bSet7 = 0;
        }
        else if (set7 < 0) {
            aSet7 = Math.abs(set7);
            if (conditionScoreSet7 <= Number(minScoresToWin))
                bSet7 = Number(minScoresToWin);
            else
                bSet7 = Number(conditionScoreSet7);
        } else if (set7 > 0) {
            bSet7 = set7;
            if (conditionScoreSet7 <= Number(minScoresToWin))
                aSet7 = Number(minScoresToWin);
            else
                aSet7 = Number(conditionScoreSet7);
        }
        else if(set7 === 0){
            bSet7 = set7;
            aSet7 = Number(minScoresToWin);
        }
        else if(set7 == -0 || set7 == "-0")
        {
            bSet7 = Number(minScoresToWin);
            aSet7 = Number(set7);
        } else {
            aSet7 = 0;
            bSet7 = 0;
        }

        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "" + aSet4 + "", "" + aSet5 + "", "" + aSet6 + "", "" + aSet7 + ""],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "" + bSet4 + "", "" + bSet5 + "", "" + bSet6 + "", "" + bSet7 + ""]
            }
        }

    }
    return data;
}catch(e){
}

}



/************* reset template *********/
Template.confirmPasswordForReset.onCreated(function() {
    //this.subscribe("users")
    this.subscribe("onlyLoggedIn");

});

Template.confirmPasswordForReset.events({
    'submit form': function(e) {
        e.preventDefault();
        $("#changePasswordSucc").html("")
    },
    'focus #oldPassword': function(e) {
        $("#changePasswordSucc").html("")
    },
});

Template.confirmPasswordForReset.onRendered(function() {
    $('#application-confirmPasswordForReset').validate({
        onkeyup: false,
        rules: {
            oldPassword: {
                required: true,
                minlength: 6,
            },
        },
        // Display only one error at a time
        showErrors: function(errorMap, errorList) {
            $("#application-confirmPasswordForReset").find("input").each(function() {
                $(this).removeClass("error");
            });
            if (errorList.length) {
                $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + errorList[0]['message']);
                $(errorList[0]['element']).addClass("error");
            }
        },
        messages: {
            oldPassword: {
                required: "Please enter  your password ",
                minlength: "Please enter a valid  password.",
            },
        },
        submitHandler: function() {
            $("#changePasswordError").html("");
            var digest = Package.sha.SHA256($('#oldPassword').val());
            try {
                Meteor.call('checkPassword', digest, function(err, result) {
                    try {
                        if (result.error == null) {
                            $("#confirmPasswordForReset").modal('hide');

                            Session.set("matchRecords", "");
                            Session.set("leftRMatches", "");
                            Session.set("rightRMatches", "");
                            Session.set("matchRecords", "");
                            Session.set("leftRMatches_team", "");
                            Session.set("rightRMatches_team", "");
                            var eventDetails = events.findOne({
                                "tournamentId": Session.get("tournamentId"),
                                eventName: Session.get("eventName")
                            });
                            if(eventDetails == undefined)
                            {
                                eventDetails = pastEvents.findOne({
                                    "tournamentId":Session.get("tournamentId"),
                                    "eventName":Session.get("eventName")
                                })
                            }
                            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                                Meteor.call("resetMatchRecords", Session.get("tournamentId"), Session.get("eventName"), Session.get("eventOrganizer"), Session.get("sportID"));
                            } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                                Meteor.call("resetMatchRecordsTeamMatch", Session.get("tournamentId"), Session.get("eventName"), Session.get("eventOrganizer"), Session.get("sportID"));
                            }
                        } else {
                            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + result.error.reason);

                        }

                    } catch (e) {}
                });
            } catch (e) {}
        }
    });
});