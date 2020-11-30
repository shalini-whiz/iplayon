//payment related
//var crypto = require('crypto');
//var randomString = require('random-string');


var arrayofTeamChecked = [];
var arrayofTeamChecked_IDs = []
var singleEventsArray = [];
var checkOkClicked = [];
var removedArray = [];
var removedSingleSubscription = [];
var arr = [];

Template.subscribeToTournamemnt.onCreated(function() {
    this.subscribe("onlyLoggedIn");
    this.subscribe("onlyLoggedInALLRoles")
    this.subscribe("eventOrganizerUser", Router.current().params._PostId);
    this.subscribe("eventsLISTForParam", Router.current().params._PostId);
    this.subscribe("tournamentEVENT", Router.current().params._PostId)
    this.subscribe("tournamentEvents");
    this.subscribe("dobFilterSubscribe");
    this.subscribe("eventFeeSettings");
    this.subscribe("playerTeamEntries", Router.current().params._PostId)     
    this.subscribe("tempEventPartcipants")
});

Template.subscribeToTournamemnt.onDestroyed(function() {
    Session.set("checkedEventForTeamSel", undefined);
    Session.set("checkedTeamForEvent", undefined);
    Session.set("arraySelectedEventTeam", undefined);
    Session.set("singleEventsArray", undefined);
    Session.set("removeSubscribedTeam", undefined);
    Session.set("removeSubscribedSingleEvent", undefined);
    Session.set("subscriptionTypeHyperhyperLinkValue", undefined);
    Session.set("eventDetailsForMail", undefined);
    Session.set("eventDetailsSubForMailOnlyOrg", undefined);
    Session.set("eventDetailsUnSubForMailOnlyOrg", undefined);
    Session.set("arrayOfSingleEventsOnLoad", undefined);
    Session.set("arrayOfTeamEventsOnLoad", undefined);
    Session.set("totalEntryFee", undefined)
    Session.set("eventIdOFSelectedTeamEvent", undefined)
    Session.set("eventParticipantSingleArray", undefined)
        //new
    Session.set("arrayofTeamCheckedSession", undefined);
    Session.set("arrayofUnTeamCheckedSession", undefined)
    Session.set("TeamCheckedSession", undefined)
    Session.set("eventNameOFSelectedTeamEvent", undefined)
    Session.set("eventIDOFSelectedTeamEvent", undefined)
    Session.set("arrayBackUp", undefined)

    arrayofTeamChecked = [];
    arrayofTeamChecked_IDs = []
    singleEventsArray = [];
    checkOkClicked = [];
    removedSingleSubscription = [];
    removedArray = [];
    arr = [];
});

Template.subscribeToTournamemnt.onRendered(function() {
    Meteor.call("getSportsMainDB",false,function(e,res){
        if(res != undefined && res != null && res != false){
            toRet = res
            Session.set("playerDBName",toRet)
        }
        else if(res != undefined && res != null && res == 2){
            toRet = false
            alert("select sport first")
            Session.set("playerDBName",toRet)
        }
        else if(e){
            toRet = false
            Session.set("playerDBName",toRet)
        }
    })

    $('.scrollableLisst').slimScroll({
        height: '10.4em',
        color: 'black',
        size: '3px',
        width: '100%'
    });
    Session.set("subscriptionTypeHyperhyperLinkValue", undefined);
    Session.set("eventDetailsForMail", undefined);
    Session.set("eventDetailsSubForMailOnlyOrg", undefined);
    Session.set("eventParticipantSingleArray", arr)
    Session.set("eventDetailsUnSubForMailOnlyOrg", undefined);
    arr = [];
    multipleSubscriptionValid();
    /*Meteor.call("insertForMaximumNumber",Router.current().params._PostId, Meteor.userId(),function(e, r) {})*/
});

var nameToCollection = function(name) {
  return this[name];
};

Template.subscribeToTournamemnt.helpers({
    lEventDetails: function() {
        try {
            var lId = Router.current().params._PostId;
            var lEventDetails = events.findOne({
                "_id": lId
            });
            if (lEventDetails != undefined) {
                var eventUnderTour = events.find({
                    "tournamentId": lId,
                    tournamentEvent: false
                }).fetch();
                if (eventUnderTour.length != 0) {
                    for (var i = 0; i < eventUnderTour.length; i++) {

                    }
                    /*var arraySendHtml = []
                    for (var i = 0; i < eventUnderTour.length; i++) {
                        var dateFilter = dobFilterSubscribe.findOne({
                            "mainProjectId": lEventDetails.projectId.toString(),
                            "eventOrganizer": lEventDetails.eventOrganizer
                        });;
                        if (dateFilter && dateFilter.details) {
                            for (var j = 0; j < dateFilter.details.length; j++) {
                                var find = dateFilter.details[j];
                                if (find.eventId == eventUnderTour[i].projectId.toString()) {
                                    filterDate = moment(find.dateOfBirth).format("YYYY/DD/MMM");
                                    userDate = moment(userDetails.dateOfBirth).format("YYYY/DD/MMM");
                                    if (new Date(userDate) >= new Date(filterDate)) {
                                        if (find.gender.toUpperCase() == userDetails.gender.trim().toUpperCase()) {
                                            arraySendHtml.push(eventUnderTour[i])
                                        } else if (find.gender.toUpperCase() == "ALL") {
                                            arraySendHtml.push(eventUnderTour[i])
                                        }
                                    }
                                }
                            }
                        } else {
                            return eventUnderTour
                        }
                    }*/
                    return eventUnderTour;
                }
            }
        } catch (e) {}
        //return lEventDetails;
    },
    "eventsDetails": function() {
        var details = [];
        var key;
        try {
            var data = {};
            var lEvents = events.findOne({
                "_id": Router.current().params._PostId
            });
            if (lEvents && lEvents.eventsUnderTournament) {

                for (var j = 0; j < lEvents.eventsUnderTournament.length; j++) {
                    var eventDetails = events.findOne({
                        "_id": lEvents.eventsUnderTournament[j]
                    });
                    if (eventDetails)
                        data[eventDetails.abbName] = eventDetails._id;
                }
                var eventFeeSettingsFind = eventFeeSettings.findOne({
                    "tournamentId": Router.current().params._PostId
                })
                if (eventFeeSettingsFind) {
                    var eventsNAMES = eventFeeSettingsFind.events;
                    key = eventsNAMES;
                    key.push("fees")
                } else
                    key = ["MCB", "MCG", "CB", "CG", "SJB", "SJG", "JB", "JG", "YB", "YG", "M", "W", "NMS", "NMD", "OS", "OD", "O", "fees"]

                var k = JSON.parse(JSON.stringify(data, key, 18));
                data["eventIds"] = _.values(k);
                data["eventAbbNames"] = _.keys(k);
                details.push(data);
            }
            return details
        } catch (e) {}
    },
    lEvent: function() {
        var lEvents = events.find({
            "_id": Router.current().params._PostId
        }).fetch();
        if (lEvents) {
            return lEvents;
        }
    },

    lEventid: function() {
        return Router.current().params._PostId;

    },

    lEventP: function() {
        var lEvents = events.findOne({
            "_id": Router.current().params._PostId
        });
        if (lEvents != undefined) {
            return lEvents;
        }
    },

    "myTeams": function() {
        try {
            var eventId = Router.current().params._PostId;
            var eveType = events.findOne({
                "_id": eventId
            });
            //change
            var userId = Meteor.users.findOne({
                "_id": Meteor.userId().toString()
            })
            var teamList = teams.find({
                "teamOwner": userId.userId.toString(),
                "projectName": eveType.projectId.toString()
            }).fetch();
            if (teamList) {
                return teamList;
            }

        } catch (e) {}
    },
    dataOFBirthGenderPlayer: function() {
        try {
            if (Meteor.userId()) {
                var eventIdHTML = this.toString()
                var eventDetailsHTML = events.findOne({
                    "_id": eventIdHTML
                });

                if (eventDetailsHTML && eventDetailsHTML.projectType) {

                    if(eventDetailsHTML.allowSubscription)
                    {   

                        if(eventDetailsHTML.allowSubscription == "no")
                        {
                            return false;
                        }
                    }
                    if (parseInt(eventDetailsHTML.projectType) != 1){
                        return true;
                    }
                    else if(Session.get("playerDBName")){

                        var userIdDet = nameToCollection(Session.get("playerDBName")).findOne({
                            "userId": Meteor.userId()
                        });
                        if(userIdDet.gender==null||userIdDet.gender==undefined||userIdDet.gender.trim().length==0){
                            userIdDet.gender = "gender"
                        }
                        if (userIdDet && userIdDet.gender && userIdDet.dateOfBirth) {

                            var tournamentId = Router.current().params._PostId;
                            var tournDetails = events.findOne({
                                "_id": tournamentId,
                                tournamentEvent: true
                            });


                            var projectId = ""
                            if (eventDetailsHTML){
                                projectId = eventDetailsHTML.projectId
                            }

                            if (tournDetails) {

                                var birthDetails = dobFilterSubscribe.findOne({
                                    "mainProjectId": tournDetails.projectId.toString(),
                                    "eventOrganizer": tournDetails.eventOrganizer.toString(),
                                    "tournamentId": Router.current().params._PostId
                                });

                                if (birthDetails && birthDetails.details) 
                                {   

                                    for (var j = 0; j < birthDetails.details.length; j++) {
                                        var find1 = birthDetails.details[j];
                                        if (find1.ranking == "yes" && find1.eventId == projectId.toString()) {
                                            if (userIdDet.affiliationId !== null && userIdDet.affiliationId != undefined && userIdDet.affiliationId != "other" && userIdDet.statusOfUser == "Active") {
                                                if (find1.eventId == projectId.toString()) {
                                                    filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                                    userDate = moment(new Date(userIdDet.dateOfBirth)).format("YYYY/DD/MMM");
                                                    if (moment(new Date(userDate)).format("YYYY/DD/MMM") >= moment(new Date(filterDate)).format("YYYY/DD/MMM")) {
                                                        if (find1.gender.toUpperCase() == userIdDet.gender.trim().toUpperCase()) {
                                                            return true
                                                        } else if (find1.gender.toUpperCase() == "ALL") {
                                                            return true
                                                        } else {
                                                            return false
                                                        }
                                                    } else if (moment(new Date(userDate)).format("YYYY/DD/MMM") < moment(new Date(filterDate)).format("YYYY/DD/MMM")) {
                                                        return false
                                                    }
                                                }
                                            } else if (find1.eventId == projectId.toString()) {
                                                return false
                                            }
                                        } else if (find1.ranking == "no" && find1.eventId == projectId.toString()) {

                                            if (find1.eventId == projectId.toString()) {

                                                filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                                userDate = moment(new Date(userIdDet.dateOfBirth)).format("YYYY/DD/MMM");
                                                
                                                if (moment(new Date(userDate)).format("YYYY/DD/MMM") >= moment(new Date(filterDate)).format("YYYY/DD/MMM")) {
                                                    
                                                    if (find1.gender.toUpperCase() == userIdDet.gender.trim().toUpperCase()) {
                                                        
                                                        return true
                                                    } else if (find1.gender.toUpperCase() == "ALL") {
                                                        
                                                        return true
                                                    } else {
                                                        
                                                        return false
                                                    }
                                                } else if (moment(new Date(userDate)).format("YYYY/DD/MMM") < moment(new Date(filterDate)).format("YYYY/DD/MMM")) {
                                                    return false
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
        }
    },
    teamEventOrSingleEvent: function() {
        var eventId = this.trim().toString();
        var eventss = events.findOne({
            "_id": eventId
        });
        if (eventss != undefined && eventss.projectType != undefined) {
            if (eventss.projectType !== 1) {
                return "glyphicon glyphicon-eye-open"
            } else {
                return ""
            }
        }
    }
});



Template.registerHelper('checkSingleOrTeam', function(data) {
    //change class of checkbox based on team or single event
    if (data == 1) {
        return "subscribeToAllList";
    } else return "subscribeToAllListTeam";
});

Template.registerHelper('checkSingleOrTeamSelect', function(data) {
    //change class of span based on team or single event
    if (parseInt(data) == 1) {
        return "";
    } else return "glyphicon glyphicon-eye-open"; //click on it shows teams
});

Template.registerHelper('checkSingleOrTeamSelectGlyph', function(data) {
    //change class of checkbox based on team or single event
    if (data == 1) {
        return "teamGlyphiconOrNotNo";
    } else return "teamGlyphiconOrNotYes";
});

Template.registerHelper('eventNameSingleSub', function(data) {
    //change class of checkbox based on team or single event
    var eve = events.findOne({
        "_id": data
    })
    if (eve) {
        return eve.eventName
    }
});

Template.registerHelper('eventPrizeSingleSub', function(data) {
    //change class of checkbox based on team or single event
    var eve = events.findOne({
        "_id": data
    })
    if (eve) {
        return eve.prize
    }
});

Template.registerHelper('eventStartDateSingleSub', function(data) {
    //change class of checkbox based on team or single event
    var eve = events.findOne({
        "_id": data
    })
    if (eve) {
        return eve.eventStartDate
    }
});

Template.registerHelper('eventEndDateSingleSub', function(data) {
    //change class of checkbox based on team or single event
    var eve = events.findOne({
        "_id": data
    })
    if (eve) {
        return eve.eventEndDate
    }
});

Template.registerHelper('eventAbbNameSingleSub', function(data) {
    //change class of checkbox based on team or single event
    var eve = events.findOne({
        "_id": data
    })
    if (eve) {
        return eve.abbName
    }
});


Template.subscribeToTournamemnt.events({

    //change of check box
    "change #checkTeamOrSingle": function(e) {
        e.preventDefault();
        var eventIdFromHTML = this;
        var findType = events.findOne({
            "_id": eventIdFromHTML.trim().toString()
        });
        var projectType;
        if (findType && findType.projectType) {
            projectType = findType.projectType
        }
        var playerId = Meteor.userId();
        var indexD = _.indexOf(_.pluck(arr, 'eventName'), $(e.target).val());

        var maximum = 7;
        var evePartsLength = 0;

        /*var eveDet = tempEventPartcipants.findOne({"abbName":$(e.target).val().trim(),tourId:Router.current().params._PostId,loggerId:Meteor.userId()})

        if(eveDet&&eveDet.evePartsLength){
            evePartsLength = eveDet.evePartsLength
        }
        if(parseInt(maximum)&&$(e.target).is(":checked")){
            if(parseInt(maximum)>parseInt(evePartsLength)){
                Meteor.call("updateIncTempEventParts",eveDet._id,evePartsLength,function(e,res){
                });                
            }
            else{
                $(e.target).prop('checked', false);
                alert("Reached maximum subscribers..")
                return false
            }
        }
        else{
            Meteor.call("updateDecTempEventParts",eveDet._id,evePartsLength,function(e,res){
            });
        }*/

        if (indexD != -1) {
            //if arr is not empty
            //if it is checked
            if ($(e.target).is(":checked")) {
                //if the target value matches the eventName in arr
                //remove from unsub and add to sub of arr
                if (arr[indexD].eventName == $(e.target).val()) {
                    var eveSub = [];
                    if (arr[indexD].eventSubscribers !== undefined) {
                        eveSub = arr[indexD].eventSubscribers;
                    }
                    if (_.findWhere(eveSub, playerId) == null) {}
                    arr[indexD].eventUnsubscribers = _.reject(arr[indexD].eventUnsubscribers, function(item) {
                        return item === playerId;
                    });
                    arr[indexD].eventSubscribers = eveSub;
                } else if (arr[indexD].eventName !== $(e.target).val()) {
                    var eveSub = [];
                    var eventName = $(e.target).val()
                    if (_.findWhere(eveSub, playerId) == null) {
                        eveSub.push(playerId);
                    }
                    var data = {
                        eventName: eventName,
                        eventSubscribers: eveSub
                    }
                    if (_.findWhere(arr, data) == null) {
                        arr.push(data);
                    }

                }
            }
            //if it is unchecked
            //remove it from arr and add it arrUnsub array
            else {
                if (arr[indexD].eventName == $(e.target).val()) {
                    arr[indexD].eventSubscribers = _.reject(arr[indexD].eventSubscribers, function(item) {
                        return item === playerId;
                    });
                    var arrUnsub = [];
                    if (arr[indexD].eventUnsubscribers) {
                        arrUnsub = arr[indexD].eventUnsubscribers;
                    }
                    if (_.findWhere(arrUnsub, playerId) == null) {
                        arrUnsub.push(playerId);
                    }
                    arr[indexD].eventUnsubscribers = arrUnsub;
                }
                if(parseInt(projectType) != 1){

                }
            }
        }
        //if arr is empty
        else {
            //if checked push data to arr
            if ($(e.target).is(":checked")) {
                var eveSub = [];
                var eventName = $(e.target).val()
                if (_.findWhere(eveSub, playerId) == null) {
                    eveSub.push(playerId);
                }
                var data = {
                    eventName: eventName,
                    eventSubscribers: eveSub
                }
                arr.push(data)
            } else {
                //to unsub
                var eveUnSub = [];
                var eventName = $(e.target).val()
                if (_.findWhere(eveUnSub, playerId) == null) {
                    eveUnSub.push(playerId);
                }
                var data = {
                    eventName: eventName,
                    eventUnsubscribers: eveUnSub
                }
                arr.push(data)
            }
        }
        //if project type is team
        if (parseInt(projectType) != 1) {
            if ($(e.target).is(":checked")) {
                //set projectId
                Session.set("eventIdOFSelectedTeamEvent", undefined)
                Session.set("eventIdOFSelectedTeamEvent", findType.projectId.toString());
                //set eventAbbName
                Session.set("eventIDOFSelectedTeamEvent", undefined)
                Session.set("eventNameOFSelectedTeamEvent", findType.abbName.toString());
                //set _id of event
                Session.set("eventIDOFSelectedTeamEvent", undefined)
                Session.set("eventIDOFSelectedTeamEvent", findType._id.toString());
                //set team selected to undefined (to restore when unchecked and then again checked)
                Session.set("TeamCheckedSession", undefined)
                    //render team sub popup
                $("#renderTeamMultiSubs").empty();
                Blaze.render(Template.teamMultiSubscribePopup, $("#renderTeamMultiSubs")[0]);
                $("#setEventNameHeader").html(findType.abbName);
                Session.set("checkedEventForTeamSel", undefined);
                Session.set("checkedEventForTeamSel", this._id);
                $(".teamSubscribeMainTitle").scrollTop(0);;
                $("#teamMultiSubscribePopup").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            } else {
                //if unchecked
                //remove the data from session
                var arrayofTeamChecked_IDs = [];
                if (Session.get("arrayofTeamCheckedSession")) {
                    arrayofTeamChecked_IDs = Session.get("arrayofTeamCheckedSession")
                }
                var eventName = findType.abbName.toString()
                var indexD = _.indexOf(_.pluck(arrayofTeamChecked_IDs, 'eventName'), eventName);
                if (indexD !== -1) {
                    arrayofTeamChecked_IDs.splice(indexD, 1)
                }
                Session.set("arrayofTeamCheckedSession", arrayofTeamChecked_IDs);
            }
        }

        Session.set("eventParticipantSingleArray", arr);
    },

    //on click of star
    "click #checkedOrNotPopup": function(e) {
        e.preventDefault();
        //if checkbox of team event is checked
        //render the team selection popup
        //set the session of selected event
        //open the modal of team selection
        //same as above scenario of rendering team popup except..
        // set team selected to undefined (to restore when unchecked and then again checked)
        //not handled
        var eventIdFromHTML = this;
        if ($(e.target).prev('input:checkbox[id="checkTeamOrSingle"]').prop("checked")) {
            var findType = events.findOne({
                "_id": eventIdFromHTML.trim().toString()
            });
            var projectType;
            if (findType && findType.projectType) {
                projectType = findType.projectType
            }
            if (parseInt(projectType) != 1) {
                Session.set("eventIdOFSelectedTeamEvent", undefined)
                Session.set("eventIdOFSelectedTeamEvent", findType.projectId.toString());

                Session.set("eventNameOFSelectedTeamEvent", undefined)
                Session.set("eventNameOFSelectedTeamEvent", findType.abbName.toString())

                Session.set("eventIDOFSelectedTeamEvent", undefined)
                Session.set("eventIDOFSelectedTeamEvent", findType._id.toString());

                $("#renderTeamMultiSubs").empty();
                Blaze.render(Template.teamMultiSubscribePopup, $("#renderTeamMultiSubs")[0]);

                $("#setEventNameHeader").html(findType.abbName);
                Session.set("checkedEventForTeamSel", undefined);
                Session.set("checkedEventForTeamSel", this._id);
                $(".teamSubscribeMainTitle").scrollTop(0);;
                $("#teamMultiSubscribePopup").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        }
    },

    "change #mainTag": function(e) {
        e.preventDefault();
        try {

            //change of team select box
            //$("#confirmDomProvideDetailsTeam").val("");


            //capture id of team
            var teamId = $(e.target).val();
            //if the teamId is not 1 which is given as default for select team option
            if (parseInt(teamId) !== 1) {
                //set teamId
                Session.set("TeamCheckedSession", undefined)
                Session.set("TeamCheckedSession", teamId)

                //get event id
                var name = Session.get("eventIDOFSelectedTeamEvent");
                //get event name
                var eventName = Session.get("eventNameOFSelectedTeamEvent")
                    //set data
                var data = {
                        eventName: eventName,
                        teamId: teamId,
                        //teamManagerId:Meteor.userId(),
                        //tournamentId:Router.current().params._PostId,
                    }
                    //set sesssion of above data
                    //this data is saved only when ok button is clicked
                var arrBack = data;
                Session.set("arrayBackUp", arrBack)

                //set session if not valid team
                Session.set("teamMemberValidation_Ses", undefined);

                //$("#confirmDomProvideDetailsTeam").html("");
            }
        } catch (e) {}
    },

    //click of cancel button team selection popup
    "click #noButtonSubTeamEvent": function(e) {
        e.preventDefault();
        handlingNoButtonOfPopUP()
    },

    //click of ok button of team selection popup
    "click #yesButtonSubTeamEvent": function(e) {
        e.preventDefault();

        if (Session.get("teamMemberValidation_Ses") == 1) {
            //$("#confirmDomProvideDetailsTeam").html('<span style="font-size: 12px; border: 0px none; color: red; background: none repeat scroll 0px center transparent;">Team is Invalid:</span><input style="font-size: 12px; border: 0px none; color: blue; background: none repeat scroll 0px center transparent; text-decoration: underline;" value="Edit team and continue your subscription" id="editTeamForNoTeam" type="button"><span style="font-size: 12px; border: 0px none; color: red; background: none repeat scroll 0px center transparent;">or</span><input style="font-size: 12px; border: 0px none; color: blue; background: none repeat scroll 0px center transparent; text-decoration: underline;" value="Create new team and continue your subscription" id="createTeamForNoTeam" type="button">');
        } else {
            //if team is selected and array holds team details
            if ($("#mainTag").val() && parseInt($("#mainTag").val()) != 1 && Session.get("arrayBackUp") != undefined) {
                //get event  name
                var eventName = Session.get("eventNameOFSelectedTeamEvent")
                    //get team details
                var data = Session.get("arrayBackUp")

                var arrayofTeamChecked_IDs = [];


                //set array of teams to array
                if (Session.get("arrayofTeamCheckedSession")) {
                    arrayofTeamChecked_IDs = Session.get("arrayofTeamCheckedSession")
                }
                //check array already contains the evntname
                var indexD = _.indexOf(_.pluck(arrayofTeamChecked_IDs, 'eventName'), eventName);
                //if no push
                if (indexD == -1) {
                    if (_.findWhere(arrayofTeamChecked_IDs, data) == null) {
                        arrayofTeamChecked_IDs.push(data);
                        Session.set("arrayBackUp", undefined)
                    }
                }
                //else splice it and push
                else {
                    arrayofTeamChecked_IDs.splice(indexD, 1)
                    if (_.findWhere(arrayofTeamChecked_IDs, data) == null) {
                        arrayofTeamChecked_IDs.push(data);
                        Session.set("arrayBackUp", undefined)
                    }
                }
                //set the array of team events selected 
                //this is used to ensure that the ok button is clickec for this event
                var eventId = Session.get("eventIDOFSelectedTeamEvent")
                var indexOfEvent = checkOkClicked.indexOf(eventId.trim())
                if (indexOfEvent == -1) {
                    checkOkClicked.push(eventId);
                }

                Session.set("arrayofTeamCheckedSession", arrayofTeamChecked_IDs);
                //reset the array of selected teams

                $("#teamMultiSubscribePopup").modal("hide");
            } else if ($("#mainTag").val() == null || parseInt($("#mainTag").val()) == 1) { //if team is not selected
                $("#confirmDomProvideDetailsTeam").html("Please Select Team");
            } else if ($("#mainTag").val() == null || (parseInt($("#mainTag").val()) !== 1 && Session.get("arrayBackUp") == undefined)) { //if team is not selected
                //and there are no teams of this teamtype
                $("#confirmDomProvideDetailsTeam").html("Please Select Team");
            }
        }
    },

    //on click of name of single event route to viewEvent
    "click #subscribeToAllListDivRoute": function(e) {
        e.preventDefault();
        var id = this.toString()
        Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
        var eventLists = events.find({
            "_id": id
        }).fetch();
        Router.go("viewEvents", {
            _PostId: id
        });
    },

    "click #eventSubscribeCancel": function(e) {
        e.preventDefault();
        if(Session.get("previousLocationPath") != undefined)
        {
            Router.go(Session.get("previousLocationPath"));
        }
        else
            Router.go("upcomingEvents");
    },

    "submit form": function(e) {
        e.preventDefault();
    },

    "click #errorPopupClose": function(e) {
        e.preventDefault();
        $('#errorPopup').modal('hide');
    },

    //after mail sent, alreadysubscribed modal ok button 
    'click #aYesButton2': function(e) {
        e.preventDefault();
        $("#sendingMailPopup").modal('hide');
        $("#sendingMailPopup2").modal('hide');

        //if the subscription type is hyperlink
        //route to hyper link
        if (Session.get("subscriptionTypeHyperhyperLinkValue") != undefined) {
            var s = Session.get("subscriptionTypeHyperhyperLinkValue")
                //if the web site doesn't contains https
            if (!s.match(/^https?:\/\//i)) {
                s = 'http://' + s;
            }
            window.open(s, '_blank');
        }

        //  Meteor.call("initSNSMatchRecords",Router.current().params._PostId);
        Router.go("/upcomingEvents");
    },

    //extra
    'click #aYesButton': function(e) {
        e.preventDefault();
        $("#sendingMailPopup").modal('hide');
        //if the subscription type is hyperlink
        //route to hyper link
        if (Session.get("subscriptionTypeHyperhyperLinkValue") != undefined) {
            var s = Session.get("subscriptionTypeHyperhyperLinkValue")
                //if the web site doesn't contains https
            if (!s.match(/^https?:\/\//i)) {
                s = 'http://' + s;
            }
            window.open(s, '_blank');
        }
        Router.go("/upcomingEvents");
    },

    //when there is no team link to create team
    'click #createTeamForNoTeam': function(e) {
        e.preventDefault();
        $("#teamMultiSubscribePopup").modal("hide");
        $('.modal-backdrop').remove();
        //window.open(Router.url("createTeams"));
        //continueSubscription("createTeams")
            //Router.go("/createTeams");
        handlingNoButtonOfPopUP();
        continueSubscription("createTeams")
    },
    "click #editTeamForNoTeam": function(e) {
        e.preventDefault();
        $("#teamMultiSubscribePopup").modal("hide");
        $('.modal-backdrop').remove();
        var setArray = playerTeams.findOne({
            "_id": Session.get("TeamCheckedSession")
        });
        var onlyIDs = [];
        arrayMAndPlayers = [];
        if (setArray && setArray.teamMembers && setArray.teamFormatId) {
            var find = teamsFormat.findOne({
                "_id": setArray.teamFormatId
            });

            var teamMembers = setArray.teamMembers;
            $.each(teamMembers, function(j){
                onlyIDs.push(teamMembers[j].playerId);
                var indexOfP;
                if(find&&find.mandatoryPlayersArray){
                   indexOfP = find.mandatoryPlayersArray.indexOf(teamMembers[j].playerNumber)
                }
                if(indexOfP!==-1){
                    arrayMAndPlayers.push(teamMembers[j].playerNumber);
                }
             })   

            Session.set("arrayOFIdsPlayerSessEdit", onlyIDs);

            Session.set("selectedPlayerNameSessEdit", setArray.teamMembers);
            Session.set("mandatoryPlayersArrayEdit",arrayMAndPlayers);
            var routeValue = "editTeams"
            handlingNoButtonOfPopUP();
            continueSubscription(routeValue)
        }
    },

    //payment related
    "click #eventPay":function(e)
    {
        $("#renderPaymentWindow").empty();
        Blaze.render(Template.subscriptionPayment, $("#renderPaymentWindow")[0]);
        $("#subscriptionPayment").modal({
            backdrop: 'static'
        });
    }
});

var arrIndex = {};

function addOrReplace(object) {
    var index = arrIndex[object.eventSelected];
    if (index === undefined) {
        index = arrayofTeamChecked.length;
        arrIndex[object.eventSelected] = index;
    }
    arrayofTeamChecked[index] = object;
}

function pushIfNew(obj, arrayName) {
    for (var i = 0; i < arrayName.length; i++) {
        if (arrayName[i].id === arrayName.id) { // modify whatever property you need
            return;
        }
    }
    arrayName.push(obj);
}


Template.registerHelper('checkTempBeforeSave', function(data) {
    //if team event selected array is not undefined
    //get the list of selected event and team
    //if data(team id) coming from html template is inside the list
    //return selected to the select box
    try {
        if (Session.get("arrayofTeamCheckedSession") != undefined) {
            var selectedList = Session.get("arrayofTeamCheckedSession");
            for (var i = 0; i < selectedList.length; i++) {
                if (selectedList[i].eventName == Session.get("eventNameOFSelectedTeamEvent")) {
                    if (selectedList[i].teamId == data) {
                        //set session of the team selected
                        Session.set("arrayBackUp", selectedList[i])
                        Session.set("TeamCheckedSession", data);
                        Session.set("che", true);
                        return "selected";
                        break;
                    }
                }
            }
        } else if (Session.get("arrayofTeamCheckedSession") == undefined) {
            if (Meteor.userId()) {
                var testArray = playerTeamEntries.findOne({
                    "playerId": Meteor.userId(),
                    tournamentId: Router.current().params._PostId
                })
                if (testArray && testArray.subscribedTeamsArray) {
                    Session.set("arrayofTeamCheckedSession", testArray.subscribedTeamsArray);
                    var selectedList2 = Session.get("arrayofTeamCheckedSession");
                    for (var i = 0; i < selectedList2.length; i++) {
                        var s = events.findOne({
                            "eventName": selectedList2[i].eventName,
                            tournamentId: Router.current().params._PostId
                        })
                        if (s && s._id) {
                            var indexOfEvent = checkOkClicked.indexOf(s._id.trim())
                            if (indexOfEvent == -1) {
                                checkOkClicked.push(s._id);
                            }
                        }
                        if (selectedList2[i].eventName == Session.get("eventNameOFSelectedTeamEvent")) {
                            if (selectedList2[i].teamId == data) {
                                //set session of the team selected
                                Session.set("arrayBackUp", selectedList2[i])
                                Session.set("TeamCheckedSession", data);
                                return "selected";
                                break;
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {}
});

//register helper for subscripbetomultiple evnts template
//
Template.registerHelper('subscribedOrNotMultiple', function(data) {
    if (data) {
        try {
            var eventss = events.findOne({
                "_id": data.toString().trim()
            });
            if (eventss != undefined && eventss.eventParticipants != undefined && Session.get("playerDBName")) {
                //if the event is single type
                //get the participant of the event
                //if the current userid is in the event participants list
                //set the session for singleEventsArray
                //return checked for the subscribed events
                // if (eventss.projectType == 1) {
                var arr2 = eventss.eventParticipants;
                var userId = nameToCollection(Session.get("playerDBName")).findOne({
                    "userId": Meteor.userId()
                });
                if (arr2.indexOf(userId.userId.toString()) !== -1) {
                    singleEventsArray.push(data);
                    Session.set("singleEventsArray", singleEventsArray);
                    Session.set("arrayOfSingleEventsOnLoad", singleEventsArray);
                    return "checked"
                }
                // }

                //if events are team type
                //find teams for event participants id
                //find team owner and current user id
                //push event id to arrayofTeamChecked
                //if both are same check the check box
                //set the session of selected event and team array as session
                if (eventss.projectType !== 1) {
                    /*var arr2 = eventss.eventParticipants;
                    for (var i = 0; i < arr2.length; i++) {
                        var teamOwner = teams.findOne({
                            "_id": arr2[i].toString()
                        });
                        var userId = suserDetailssTT.findOne({
                        "userId": Meteor.userId()
                    });
                        if (teamOwner != undefined && teamOwner.teamOwner.toString() == userId.userId.toString()) {
                            var data = {
                                eventSelected: data,
                                teamSelected: arr2[i].toString(),
                            }
                            addOrReplace(data);
                            arrayofTeamChecked = arrayofTeamChecked.filter(function(n) {
                                return n != undefined //remove null values
                            });
                            Session.set("arraySelectedEventTeam", arrayofTeamChecked);
                            Session.set("arrayOfTeamEventsOnLoad", arrayofTeamChecked);
                            return "checked";
                        }
                    }*/


                }
                /*if (eventss.projectType !== 1) {
                    var arrayOfSelectedTeams = Session.set("arrayofTeamCheckedSession",arrayofTeamChecked_IDs);

                }*/
            }
        } catch (e) {}
    }
});

Template.registerHelper('getTeamNameForId',function(data){
    try{
    var text = data.replace(/(\r\n|\n|\r)/gm, '<br/>');;
    if(text){
        return  new Spacebars.SafeString(text);
    }
    }catch(e){
    }
});

Template.registerHelper('findTeamINDv',function(data1,data2){
    try{
    if(data1==null||data1==undefined){
        data1 = 0
    }
    if(data2==null||data2==undefined){
        data2 = 0;
    }
    return(parseInt(data1)+parseInt(data2))
    }catch(e){
    }
});
var multipleSubscriptionValid = function() {
    var s = $('#multipleSubscription').validate({

        rules: {

            checkAcceptboxTeam: {
                acceptTermscondMulti: true,
            },

        },
        messages: {

            checkAcceptboxTeam: {
                acceptTermscondMulti: "Please accept terms & conditions",
            },

        },
        /*
         * setting error container and errorLabelConatiner to ul
         * and wrap it inside li
         */
        errorContainer: $('#errorContainer'),
        errorLabelContainer: $('#errorContainer ul'),
        wrapper: 'li',
        /*
         * handles error
         */
        invalidHandler: function(form, validator, element) {
            var elem = $(element); //set error element
            var errors = s.numberOfInvalids();
            //if there are errors open errorPopup modal
            if (errors) $('#errorPopup').modal({
                backdrop: 'static',
                keyboard: false
            });
        },
        submitHandler: function(event) {
            continueSubscription("upcomingEvents")
        }

    })
};

$.validator.addMethod(
    "acceptTermscondMulti",
    function(value, element, regexp) {
        var s = $("#checkAcceptboxTeam").prop("checked")
        if (s == false) {
            return false;
        } else return true;
    });

var continueSubscription = function(routeValue) {
    try {
        var teamCheckedJSON = [];
        Session.set("previousLocationPath", Iron.Location.get().path);
        if (Session.get("arrayofTeamCheckedSession") && Session.get("arrayofTeamCheckedSession") != undefined) {
            teamCheckedJSON = Session.get("arrayofTeamCheckedSession")
        }
        if (Session.get("playerDBName") && Session.get("eventParticipantSingleArray") !== undefined || Session.get("eventParticipantSingleArray").length != 0 || Session.get("eventParticipantSingleArray") !== "") {
            var subDetails = [];
            var eventsNAMES = [];
            var teamEventNames = [];
            var teamEventFEES = [];
            var eventsFees = [];
            var academyEntriesId = [];
            var districtAssociationIdEntries = [];
            var teamIdsArray = [];
            var subscribedTeamsArray = [];

            var eventFeeSettingsFind = eventFeeSettings.findOne({
                "tournamentId": Router.current().params._PostId
            })
            if (eventFeeSettingsFind) {
                eventsNAMES = eventFeeSettingsFind.events;
                eventsFees = eventFeeSettingsFind.eventFees;
                teamEventNames = eventFeeSettingsFind.teamEvents;
                teamEventFEES = eventFeeSettingsFind.teamEventFees
            }

            var playerId = Meteor.userId();
            var eventsChecked = [];
            var teamEventsChecked = [];
            var totalAMT = 0;
            var totalAMTForTeam = 0;
            var eventSubscribed = [];
            var eventName = "";
            var userFound = "";
            var unsubscriberdTeamEventsNames = [];
            var takeDA = false;
            var takeAC = false;
            $("input[id=checkTeamOrSingle]").each(function() {

                userFound = nameToCollection(Session.get("playerDBName")).findOne({
                    "userId": playerId
                });
                if (userFound != undefined) {
                    for (var i = 0; i < eventsNAMES.length; i++) {
                        var findTypeOfEvent = events.findOne({
                            "abbName": eventsNAMES[i],
                            tournamentId: Router.current().params._PostId
                        });
                        eventName = eventsNAMES[i];
                        if (findTypeOfEvent && parseInt(findTypeOfEvent.projectType) == 1) {
                            if ($(this).val() == eventsNAMES[i]) {
                                if ($(this).is(":checked")) {
                                    eventsChecked.push(eventsFees[i] + "");
                                    totalAMT = totalAMT + parseInt(eventsFees[i])
                                } else {
                                    eventsChecked.push("0");
                                }
                                break;
                            }
                            takeDA = true;
                            takeAC = true
                        } else if (findTypeOfEvent && parseInt(findTypeOfEvent.projectType) != 1) {
                            if ($(this).val() == eventsNAMES[i]) {
                                if ($(this).is(":checked")) {
                                    totalAMTForTeam = totalAMTForTeam + parseInt(eventsFees[i])
                                    teamEventsChecked.push(eventsFees[i]);
                                    for (var teamJson = 0; teamJson < teamCheckedJSON.length; teamJson++) {
                                        if (teamCheckedJSON[teamJson].eventName == eventsNAMES[i]) {
                                            teamIdsArray.push(teamCheckedJSON[teamJson].teamId);
                                            subscribedTeamsArray.push(teamCheckedJSON[teamJson])
                                        }
                                    }
                                } else {
                                    teamIdsArray.push("0");
                                    teamEventsChecked.push("0");
                                    unsubscriberdTeamEventsNames.push(eventsNAMES[i])
                                   // var indexDUnsub = _.indexOf(_.pluck(subscribedTeamsArray, 'eventName'), eventName);
                                }
                                break;
                            }
                        }
                    }
                }
            })
            var clubNameIdDet = "";
            var associationId = "";
            var parentAssociationId = "";
            var associationIdEntry = ""
            if (userFound.clubNameId == undefined || userFound.clubNameId == null) {
                clubNameIdDet = "other";
            } else {
                clubNameIdDet = userFound.clubNameId;
            }

            if (userFound.associationId == undefined || userFound.associationId == null) {
                associationId = "other";
            } else {
                if (userFound.clubNameId == undefined || userFound.clubNameId == null || userFound.clubNameId == "other" || userFound.clubNameId.trim().length == 0) {
                    associationIdEntry = userFound.associationId;
                }
                associationId = userFound.associationId
            }
            if (userFound.parentAssociationId == undefined || userFound.parentAssociationId == null) {
                parentAssociationId = "other";
            } else {
                parentAssociationId = userFound.parentAssociationId;
            }
            if (_.findWhere(academyEntriesId, clubNameIdDet) == null&&takeAC==true) {
                academyEntriesId.push(clubNameIdDet);
            }
            if (_.findWhere(districtAssociationIdEntries, associationIdEntry) == null&&takeDA==true) {
                if (associationIdEntry.length != 0)
                    districtAssociationIdEntries.push(associationIdEntry);
            }
            var data = {
                userId: playerId,
                academyId: clubNameIdDet,
                eventsList: eventsChecked,
                totalFees: totalAMT,
                associationId: associationId,
                parentAssociationId: parentAssociationId,
                teamEventList: teamEventsChecked,
                teamIdsArray: teamIdsArray,
                totalFeesOfTeam: totalAMTForTeam,
                subscribedTeamsArray: subscribedTeamsArray,
                unsubscriberdTeamEventsNames:unsubscriberdTeamEventsNames
            }

            subDetails.push(data)
            var finalData = {
                tournamentId: Router.current().params._PostId,
                eventCollection: Session.get("eventParticipantSingleArray"),
                eventEntries: subDetails,
                academyEntriesId: academyEntriesId,
                dAEntriesId: districtAssociationIdEntries
                    //lengthOfEve:events.length
            }
            var subscriptionDetailsOfteamEvents = [];
            if (Session.get("arrayofTeamCheckedSession") != undefined && Session.get("arrayofTeamCheckedSession") != null) {
                subscriptionDetailsOfteamEvents = Session.get("arrayofTeamCheckedSession")
            }
            Meteor.call("entryFromAcademyStateDA", finalData, subscriptionDetailsOfteamEvents, function(e, r) {
                try {
                    if (r) {
                        var emOrg = "",
                            eveOrg;
                        var type = events.findOne({
                            "_id": Router.current().params._PostId,
                            tournamentEvent: true
                        })
                        if (type) {
                            eveOrg = Meteor.users.findOne({
                                "_id": type.eventOrganizer
                            })
                        }
                        if (eveOrg && eveOrg.emailAddress && eveOrg.emailAddress) {
                            emOrg = eveOrg.emailAddress
                        }
                        var ema = ""
                        if (userFound && userFound.emailAddress && userFound.emailAddress) {
                            ema = userFound.emailAddress
                        }
                       
                        if(routeValue !== "editTeams"&&routeValue!="createTeams"){
                            $("#sendingMailPopup2").modal({
                                backdrop: 'static',
                                keyboard: false
                            });
                            Meteor.call("getAllSubscribersOfTournament", Router.current().params._PostId, function(e, res) {
                                    try {
                                        if (res) {
                                            $("#sendingMailPopup2").modal('hide');
                                            var dataContext = {
                                                message: "Recent subscription details of tournament",
                                                tournament: type.eventName,
                                                eventsDetailsMail: eventsNAMES,
                                                teamEventNamesMAIL:teamEventNames,
                                                teamEventFEESMAIL:teamEventFEES,
                                                playersWithCheckMail: res
                                            }
                                            var html = Blaze.toHTMLWithData(Template.sendSubscriptionEmailFromClubEntry, dataContext);
                                            var options = {
                                                from: "iplayon.in@gmail.com",
                                                to: ema,
                                                cc: emOrg,
                                                subject: "iPlayOn:Subscription successful",
                                                html: html
                                            }
                                            Meteor.call("sendShareEmail", options, function(e, re) {
                                                if (re) {
                                                    alert("Network issue, Please Check your subscription and try again")
                                                } else {

                                                }
                                            });
                                            if (routeValue == "editTeams") {
                                                if(Session.get("TeamCheckedSession")){
                                                    Router.go("editTeams", {
                                                        _PostId: Session.get("TeamCheckedSession")
                                                    });
                                                }
                                            } else {

                                               Router.go(routeValue);
                                            }
                                            //Router.go("/upcomingEvents")
                                        } else if (e) {}
                                    } catch (e) {}
                                })
                        }else{
                            if (routeValue == "editTeams") {
                                if(Session.get("TeamCheckedSession")){
                                    Router.go("editTeams", {
                                        _PostId: Session.get("TeamCheckedSession")
                                    });
                                }
                            }
                            else{
                                Router.go(routeValue);   
                            }
                        }
                            //Router.go("/upcomingEvents")
                    } else if (e) {}
                } catch (e) {}
            })
        } else {
            if (routeValue == "editTeams") {
                if(Session.get("TeamCheckedSession")){
                    Router.go("editTeams", {
                        _PostId: Session.get("TeamCheckedSession")
                    });
                }
            } else {
                Router.go(routeValue);
            }
            //Router.go("/upcomingEvents")
        }
    } catch (e) {}
}

var handlingNoButtonOfPopUP = function(){

        //get id event
        var name = Session.get("eventIDOFSelectedTeamEvent");
        var eventNameONCancel = Session.get("eventNameOFSelectedTeamEvent")
            //not used
        var checkBoxChecked = $('#' + name).is(":checked");
        //set radioButtonChecked to false used to handle whether the team is selected from 
        //select box
        var radioButtonChecked = false;
        //if select box team names option value is 1
        if ($("#mainTag").val() == 1) {
            radioButtonChecked = false
        }
        //else if any team selected
        else {
            radioButtonChecked = true
        }
        //check the array checkOkClicked array contains the Id of the selected event
        //checkOKClicked contains id event name when ok is clicked
        var indexOfEvent = checkOkClicked.indexOf(name.trim())
            //get event name
            //not used
        var eventName = Session.get("eventNameOFSelectedTeamEvent")
            //not used
        var arrBck = {}
            //if team is not selected and indexOfEvent==-1 means ok is not clicked
            //team is not selected
        if (radioButtonChecked == false && parseInt(indexOfEvent) == -1) {
            $('.validCheckBox' + name).prop("checked", false);
            var eveUnSub = [];
            var playerId = Meteor.userId()
            if (_.findWhere(eveUnSub, playerId) == null) {
                eveUnSub.push(playerId);
            }
            var data = {
                eventName: eventNameONCancel,
                eventUnsubscribers: eveUnSub
            }
            arr.push(data)
            Session.set("eventParticipantSingleArray", arr);
            $("#teamMultiSubscribePopup").modal("hide");
        }
        //team is selected and ok button is clicked
        else if (radioButtonChecked == true && parseInt(indexOfEvent) > -1) {
            $("#teamMultiSubscribePopup").modal("hide");
        }
        //team is selected ok is not clicked
        else if (radioButtonChecked == true && parseInt(indexOfEvent) == -1) {
            var eveUnSub = [];
            var playerId = Meteor.userId()
            if (_.findWhere(eveUnSub, playerId) == null) {
                eveUnSub.push(playerId);
            }
            var data = {
                eventName: eventNameONCancel,
                eventUnsubscribers: eveUnSub
            }
            arr.push(data)
            Session.set("eventParticipantSingleArray", arr);
            $('.validCheckBox' + name).prop("checked", false);
            $("#teamMultiSubscribePopup").modal("hide");
        }
}