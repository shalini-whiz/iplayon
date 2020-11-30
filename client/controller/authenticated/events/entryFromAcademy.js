var sUB = false

Template.entryFromAcademy.onCreated(function() {
    this.subscribe("eventsLISTForParam", Router.current().params._PostId);
    this.subscribe("tournamentEVENT", Router.current().params._PostId)
    sUB = this.subscribe("onlyLoggedIn");
    this.subscribe("playerEntriesOfTourn", Router.current().params._PostId)
        //this.subscribe("playerEntriesOfTournComputeTot", Router.current().params._PostId)

    this.subscribe("dobFilterSubscribeWithId", Router.current().params._PostId);
    this.subscribe("eventFeeSettingsWithId", Router.current().params._PostId);
    this.subscribe("eventOrganizerUser", Router.current().params._PostId);

    try{
        Session.set("playerDBName",true)
        if(isNaN(Router.current().params.pageSkip) == true){
            Router.go(Router.routes.entryFromAcademy.path({
                _PostId: Router.current().params._PostId,
                page: 1
            }))
            Session.set("skipCountSess",0)
        }
        else{
            var sSkip = parseInt(Router.current().params.page - 1)
            if(sSkip != undefined && sSkip != null && isNaN(sSkip) == false && sSkip >= 0){
                Session.set("skipCountSess",sSkip)
            }else{
                Router.go(Router.routes.entryFromAcademy.path({
                    _PostId: Router.current().params._PostId,
                    page: 1
                }))
                Session.set("skipCountSess",0)
            }
        }
    }catch(e){
        alert(e)
    }
});

Template.entryFromAcademy.onRendered(function() {
    Session.set("arrayTobeRemoved", undefined);
    Session.set("insertedArrSess", undefined)
    Session.set("clicked", undefined)
    Session.set("eventParticipantsArray", undefined)

    Session.set("playerEntriesOfTournComputeTot", undefined)
    Session.set("currentPageSess", parseInt(Router.current().params.page) || 1)
    Session.set("playerDBName",true)

    arr = [];

    Meteor.call("playertotalCountDAtaBase", Router.current().params._PostId, function(e, r) {})
        /*Meteor.call("insertForMaximumNumber",Router.current().params._PostId, Meteor.userId(),function(e, r) {})*/
});

var nameToCollection = function(name) {
    //return this[name];
};

Template.entryFromAcademy.onDestroyed(function() {
    sUB = false;
    Session.set("arrayTobeRemoved", undefined);
    Session.set("totalFees", undefined)
    Session.set("checkedBoxes", undefined);
    Session.set("clicked", undefined)
    arr = [];
    Session.set("skipCountSess",0)
    /*Meteor.call("removeForMaximumNumber",Router.current().params._PostId, Meteor.userId(),function(e, r) {})*/
});

Template.entryFromAcademy.helpers({
    //get the title of event
    eventList: function() {
        var lEvents = events.find({
            "_id": Router.current().params._PostId
        }).fetch();
        if (lEvents) {
            return lEvents;
        }
    },
    eventListLastDate: function() {
        var lEvents = events.findOne({
            "_id": Router.current().params._PostId
        })
        if (lEvents) {
            return lEvents.eventSubscriptionLastDate;
        }
    },
    //get player name under association with each events under tournament
    playersWithCheck: function() {
        try {
            var loggedIn = Meteor.users.findOne({
                "_id": Meteor.userId()
            })
            if (loggedIn.userId && Session.get("playerDBName")) {
                var players, lplayers = [],
                    index = 0;
                if (Router.current().params.page == 1) {
                    index = 1
                } else {
                    index = parseInt(parseInt((Router.current().params.page - 1) * 10) + 1)
                }
                var details = [];
                var players = ReactiveMethod.call("playersSubAggregate", Session.get("skipCountSess"), loggedIn.userId)

                return players
            }
        } catch (e) {}
    },

    "eventsDetails": function() {
        var details = [];
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
                });
                var events;
                var key;
                if (eventFeeSettingsFind && eventFeeSettingsFind.events) {
                    key = eventFeeSettingsFind.singleEvents;
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

    lEventid: function() {
        return Router.current().params._PostId;
    },
    prevPage: function() {
        try {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            return Router.routes.entryFromAcademy.path({
                _PostId: Router.current().params._PostId,
                page: previousPage
            })

        } catch (e) {}
    },
    nextPage: function() {
        try {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var nextPage = parseInt(currentPage + 1);
            return Router.routes.entryFromAcademy.path({
                _PostId: Router.current().params._PostId,
                page: nextPage
            })
        } catch (e) {}
    },
    computeTotasd: function() {
        try {
            var userIDLogg = Meteor.userId().trim().toString();
            var userId = this.userId;
            var playerEntriesComputeTotalfind = Session.get("playerEntriesOfTournComputeTot")
            var playerEntriesFind = playerEntries.findOne({
                "tournamentId": Router.current().params._PostId,
                playerId: userId
            })
            if (playerEntriesComputeTotalfind && userId) {
                var l = _.findWhere(playerEntriesComputeTotalfind, {
                    "playerId": userId
                })
                if (l && l.totalFee) {
                    return l.totalFee + "/-"
                } else if (playerEntriesFind) {
                    return playerEntriesFind.totalFee + "/-"
                } else {
                    return 0 + "/-"
                }
            } else if (playerEntriesFind) {
                return playerEntriesFind.totalFee + "/-"
            } else {
                return 0 + "/-"
            }
        } catch (e) {
            alert(e)
        }
    },
    prevPageClass: function() {
        return currentPage() <= 1 ? "none" : "";
    },
    nextPageClass: function() {
        var totalPlayers = ReactiveMethod.call("playersCountSubAggre", Meteor.userId());
        return currentPage() * parseInt(10) < totalPlayers ? "" : "none";
    },
    eventIdsSettings: function() {
        var events = [];
        var eventFeeSettingsFind = eventFeeSettings.findOne({
            "tournamentId": Router.current().params._PostId
        })
        if (eventFeeSettingsFind) {
            events = eventFeeSettingsFind.singleEvents;
        }
        return events
    },
    playerEntries: function() {
        try {
            var userId = this.userId.trim().toString();
            var playerEntriesFind = playerEntries.findOne({
                "tournamentId": Router.current().params._PostId,
                playerId: userId
            })
            if (playerEntriesFind && playerEntriesFind.subscribedEvents){
                return playerEntriesFind.subscribedEvents
            }
            else {
                var events = [];
                var eventsFeesD = [];
                var eventFeeSettingsFind = eventFeeSettings.findOne({
                    "tournamentId": Router.current().params._PostId
                })
                if (eventFeeSettingsFind) {
                    events = eventFeeSettingsFind.singleEvents;
                }
                for (var i = 0; i < events.length; i++) {
                    eventsFeesD.push("0")
                }
                return eventsFeesD;
            }
        } catch (e) {}
    },
    subscribedOrNot: function(val, index, playerId) {
        try {
            var eventFeeSettingsFind = eventFeeSettings.findOne({
                "tournamentId": Router.current().params._PostId
            });
            if (eventFeeSettingsFind &&
                eventFeeSettingsFind.singleEventFees && 
                eventFeeSettingsFind.singleEventFees.length &&
                eventFeeSettingsFind.singleEvents && 
                eventFeeSettingsFind.singleEvents.length) {
                var fee = eventFeeSettingsFind.singleEventFees[index]
                var abbName = eventFeeSettingsFind.singleEvents[index]

                if(fee != undefined && fee != null && abbName){
                    if(parseInt(fee)==0){
                        var eve = events.findOne({
                            "tournamentId": Router.current().params._PostId,
                            abbName: abbName
                        });
                        if(eve && eve.eventParticipants && eve.eventParticipants.length){
                            if(_.contains(eve.eventParticipants , playerId)){
                                return true
                            }
                            else{
                                return false
                            }
                        }
                        else{
                            return false
                        }
                    }
                    else{
                        if (parseInt(val) == 0) {
                            return false
                        }else {
                            return true
                        }
                    }
                }
                else{
                    return false
                }
            }
            
        } catch (e) {}
    },
    assocAcademyHead: function() {
        try {
            if (Meteor.user().role == "Academy") {
                return true
            } else if (Meteor.user().role == "Association") {
                return false
            }
        } catch (e) {}
    }
});

var currentPage = function() {
    return parseInt(Router.current().params.page) || 1;
}

var hasMorePages = function() {
    var totalPlayers = Meteor.call("playersCountSubAggre", Meteor.userId());
    return currentPage() * parseInt(10) < totalPlayers;
}

var arr = [];

Template.entryFromAcademy.events({
    "change input[name^=checkEvents]": function(e, template) {
        e.preventDefault();
        var indexD = _.indexOf(_.pluck(arr, 'eventName'), $(e.target).val());
        var maximum = 7;
        var maxEvents = 1;
        var evePartsLength = 0;
        var playerId = '';

        /*if(e.target.id!=undefined) {
            playerId = e.target.id;
            var playersChecked = 0;
            playersChecked = $("#"+e.target.id+":checked").length;-1;
            if(parseInt(playersChecked)>parseInt(maxEvents)){
                $(e.target).prop('checked', false);
                alert("Reached Maximum events of subscription..")
                return false
            }
        }
        
        var eveDet = tempEventPartcipants.findOne({"abbName":$(e.target).val().trim(),tourId:Router.current().params._PostId,loggerId:Meteor.userId()})
        //var lengthOfEventsChecked = $("#"+)
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
                alert("Reached maximum subscribers..");
                return false
            }
        }
        else{
            Meteor.call("updateDecTempEventParts",eveDet._id,evePartsLength,function(e,res){
            });
        }

        if(parseInt(maxEvents)){}*/
        if (indexD != -1) {
            if ($(e.target).is(":checked")) {
                try {
                    if (arr[indexD].eventName == $(e.target).val()) {
                        var eveSub = [];
                        eveSub = arr[indexD].eventSubscribers;
                        if (eveSub) {
                            if (_.findWhere(eveSub, $(e.target).attr("player")) == null) {
                                eveSub.push($(e.target).attr("player"));
                            }
                            arr[indexD].eventUnsubscribers = _.reject(arr[indexD].eventUnsubscribers, function(item) {
                                return item === $(e.target).attr("player");
                            });
                            arr[indexD].eventSubscribers = eveSub;
                        }
                    } else if (arr[indexD].eventName !== $(e.target).val()) {
                        var eveSub = [];
                        var eventName = $(e.target).val()
                        if (_.findWhere(eveSub, $(e.target).attr("player")) == null) {
                            eveSub.push($(e.target).attr("player"));
                        }
                        var data = {
                            eventName: eventName,
                            eventSubscribers: eveSub
                        }
                        if (_.findWhere(arr, data) == null) {
                            arr.push(data);
                        }
                    }
                } catch (e) {}
            } else {
                try {
                    if (arr[indexD].eventName == $(e.target).val()) {
                        arr[indexD].eventSubscribers = _.reject(arr[indexD].eventSubscribers, function(item) {
                            return item === $(e.target).attr("player");
                        });
                        var arrUnsub = [];
                        if (arr[indexD].eventUnsubscribers) {
                            arrUnsub = arr[indexD].eventUnsubscribers;
                        }
                        if (_.findWhere(arrUnsub, $(e.target).attr("player")) == null) {
                            arrUnsub.push($(e.target).attr("player"));
                        }
                        arr[indexD].eventUnsubscribers = arrUnsub;
                    }
                } catch (e) {}
            }
        } else {
            if ($(e.target).is(":checked")) {
                try {
                    var eveSub = [];
                    var eventName = $(e.target).val()
                    if (_.findWhere(eveSub, $(e.target).attr("player")) == null) {
                        eveSub.push($(e.target).attr("player"));
                    }
                    var data = {
                        eventName: eventName,
                        eventSubscribers: eveSub
                    }
                    arr.push(data)
                } catch (e) {}
            } else {
                try {
                    var eveUnSub = [];
                    var eventName = $(e.target).val()
                    if (_.findWhere(eveUnSub, $(e.target).attr("player")) == null) {
                        eveUnSub.push($(e.target).attr("player"));
                    }
                    var data = {
                        eventName: eventName,
                        eventUnsubscribers: eveUnSub
                    }
                    arr.push(data)
                } catch (e) {}
            }
        }
        Session.set("eventParticipantsArray", arr)
        computeTotalOFSingle($(e.target).attr("player"))
    },
    "click #subscribeAndSendEmail": function(e) {
        e.preventDefault();
        if (Session.get("eventParticipantsArray") == undefined || Session.get("eventParticipantsArray").length == 0 || Session.get("eventParticipantsArray") == "") {
            Router.go("/upcomingEvents")
        } else if (Session.get("eventParticipantsArray") !== undefined || Session.get("eventParticipantsArray").length != 0 || Session.get("eventParticipantsArray") !== "") {
            saveDataNextPage(function(response) {
                var finalData = response;
                $("#savingDataPopupNew").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                var emailAddress = ""
                var eveOrg;
                var eveORGID = events.findOne({
                    "_id": Router.current().params._PostId
                });
                if (eveORGID && eveORGID.eventOrganizer) {
                    eveORGID = eveORGID.eventOrganizer;
                } else {
                    eveORGID = ""
                }
                Meteor.call("whoisEventOrganizer", eveORGID, function(e, res) {
                    try {
                        if (res) {
                            eveOrg = res
                        } else if (e) {}
                        if (eveOrg) {
                            emailAddress = eveOrg.emailAaddress
                        }
                        if (eveOrg && eveOrg.emailAddress) {
                            $("#alreadySubscribedText_NEW").html("Updated list will reach " + eveOrg.emailAddress)
                        } else {
                            $("#alreadySubscribedText_NEW").html("Saving current entries..")
                        }
                        Meteor.call("entryFromAcademyStateDA", finalData, function(e, r) {
                            if (r) {
                                //$("#savingDataPopupNew").modal('hide');
                                var tournamentId = Router.current().params._PostId;
                                sendSubscriptionEmailAll(tournamentId)
                                    //Router.go("/upcomingEvents")
                                    //Session.set("eventParticipantsArray",undefined)
                            } else if (e) {}
                        });
                    } catch (e) {}
                });
            })
        }
    },
    "click #eventSubscribeNextPast": function(e) {
        Session.set("skipCountSess", parseInt(parseInt(Session.get("skipCountSess")) + 1))

        if (Session.get("eventParticipantsArray") == undefined || Session.get("eventParticipantsArray").length == 0 || Session.get("eventParticipantsArray") == "") {
            var routevalue = $(e.target).attr("href");
            Router.go(routevalue)
        }
    },
    "click #eventSubscribePrevPast": function(e) {
        Session.set("skipCountSess", parseInt(parseInt(Session.get("skipCountSess")) - 1))

        if (Session.get("eventParticipantsArray") == undefined || Session.get("eventParticipantsArray").length == 0 || Session.get("eventParticipantsArray") == "") {
            var routevalue = $(e.target).attr("href");
            Router.go(routevalue)
        }
    },
    "click #eventSubscribeNext": function(e) {
        Session.set("skipCountSess", parseInt(parseInt(Session.get("skipCountSess")) + 1))

        if (Session.get("eventParticipantsArray") == undefined || Session.get("eventParticipantsArray").length == 0 || Session.get("eventParticipantsArray") == "") {
            var routevalue = $(e.target).attr("href");
            Router.go(routevalue)
        } else if (Session.get("eventParticipantsArray") !== undefined || Session.get("eventParticipantsArray").length != 0 || Session.get("eventParticipantsArray") !== "") {
            saveDataNextPage(function(response) {
                var finalData = response;
                var routevalue = $(e.target).attr("href");
                $("#savingDataPopupNew").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $("#alreadySubscribedText_NEW").html("Saving current page entries and moving to next page..")
                Meteor.call("entryFromAcademyStateDA", finalData, function(e, r) {
                    if (r) {
                        $("#savingDataPopupNew").modal('hide');
                        Router.go(routevalue)
                            //Session.set("eventParticipantsArray",undefined)
                    } else if (e) {}
                });
            })
        }
    },
    'click #eventSubscribeOnlySave': function(e) {
        if (Session.get("eventParticipantsArray") == undefined || Session.get("eventParticipantsArray").length == 0 || Session.get("eventParticipantsArray") == "") {

        } else if (Session.get("eventParticipantsArray") !== undefined || Session.get("eventParticipantsArray").length != 0 || Session.get("eventParticipantsArray") !== "") {
            saveDataNextPage(function(response) {
                var finalData = response;
                if (response) {
                    $("#savingDataPopupNew").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    $("#alreadySubscribedText_NEW").html("Saving current page entries..")
                    Meteor.call("entryFromAcademyStateDA", finalData, function(e, r) {
                        if (r) {
                            $("#savingDataPopupNew").modal('hide');
                            //Session.set("eventParticipantsArray",undefined)
                        } else if (e) {}
                    });
                }
            });
        } else {

        }
    },
    'click #eventSubscribePrev': function(e) {
        Session.set("skipCountSess", parseInt(parseInt(Session.get("skipCountSess")) - 1))

        if (Session.get("eventParticipantsArray") == undefined || Session.get("eventParticipantsArray").length == 0 || Session.get("eventParticipantsArray") == "") {
            var routevalue = $(e.target).attr("href");
            Router.go(routevalue)
        } else if (Session.get("eventParticipantsArray") !== undefined || Session.get("eventParticipantsArray").length != 0 || Session.get("eventParticipantsArray") !== "") {
            saveDataNextPage(function(response) {
                if(response){
                    var finalData = response;
                    var routevalue = $(e.target).attr("href");

                    $("#savingDataPopupNew").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    $("#alreadySubscribedText_NEW").html("Saving current page entries and moving to previous page..")

                    Meteor.call("entryFromAcademyStateDA", finalData, function(e, r) {
                        if (r) {
                            $("#savingDataPopupNew").modal('hide');
                            Router.go(routevalue)
                                //Session.set("eventParticipantsArray",undefined)
                        } else if (e) {}
                    });
                }
            })
        }
    },
    'click #viewEvent2': function(e) {
        e.preventDefault();
        var id = this.toString();
        var eveId = events.findOne({
            "tournamentId": Router.current().params._PostId,
            abbName: id
        });
        if (eveId) {
            Meteor.call("upcomingListsAndStatus", eveId._id.toString(), function(error, response) {})
            Router.go("viewEvents", {
                _PostId: eveId._id.toString()
            });
        }
    },

    "click #eventSubscribeCancel": function(e) {
        e.preventDefault()
        var id = Router.current().params._PostId;
        Meteor.call("playertotalCountDAtaBase", id.trim().toString())
        if (Session.get("previousLocationPath") != undefined) {
            Router.go(Session.get("previousLocationPath"));
        } else
            Router.go("upcomingEvents");
    },

    "click #alreYes": function(e) {
        e.preventDefault();
        $("#alreadySubscribed_entryFromAca").modal('hide');
        var type = events.findOne({
            "_id": Router.current().params._PostId,
            tournamentEvent: true
        });
        //if the subscription type is hyperlink
        //route to hyper link
        if (type && type.hyperLinkValue) {
            var s = type.hyperLinkValue
                //if the web site doesn't contains https
            if (!s.match(/^https?:\/\//i)) {
                s = 'http://' + s;
            }
            window.open(s, '_blank');
        }
        Router.go("/upcomingEvents");
    },

    /*"click #computeTot": function(e) {
        e.preventDefault();
        try {
            Session.set("clicked", this.userId)
        } catch (e) {
        }
    },*/

    "click #computeTot": function(e) {
        if (Session.get("playerDBName")) {
            e.preventDefault();
            var userIdComp = this.userId;
            var subDetails = [];
            var events = [];
            var eventsFees = [];
            var eventFeeSettingsFind = eventFeeSettings.findOne({
                "tournamentId": Router.current().params._PostId
            })
            if (eventFeeSettingsFind) {
                events = eventFeeSettingsFind.singleEvents;
                eventsFees = eventFeeSettingsFind.singleEventFees;
            }
            var academyEntriesId = [];
            $("#tblOne > tbody  > tr").each(function() {
                var playerId = "";
                var playerIdToSave = "";
                var eventsChecked = [];
                var totalAMT = 0;
                var eventSubscribed = [];
                var eventName = "";
                var userFound = "";
                $(this).find("input[name=checkEvents]").each(function() {
                    playerId = $(this).attr("player");
                    if (playerId == userIdComp) {
                        playerIdToSave = userIdComp;
                        if (userFound != undefined) {
                            for (var i = 0; i < events.length; i++) {
                                eventName = events[i];
                                if ($(this).val() == events[i]) {
                                    if ($(this).is(":checked")) {
                                        eventsChecked.push(eventsFees[i] + "");
                                        totalAMT = totalAMT + parseInt(eventsFees[i])
                                    } else {
                                        eventsChecked.push("0");
                                    }
                                    break;
                                }
                            }
                        }
                    }
                });

                var clubNameIdDet = "";
                var associationId = "";
                var parentAssociationId = "";
                if (userFound.clubNameId == undefined || userFound.clubNameId == null) {
                    clubNameIdDet = "other";
                } else {
                    clubNameIdDet = userFound.clubNameId;
                }
                if (userFound.associationId == undefined || userFound.associationId == null) {
                    associationId = "other";
                } else {
                    associationId = userFound.associationId;
                }
                if (userFound.parentAssociationId == undefined || userFound.parentAssociationId == null) {
                    parentAssociationId = "other";
                } else {
                    parentAssociationId = userFound.parentAssociationId;
                }
                if (_.findWhere(academyEntriesId, clubNameIdDet) == null) {
                    academyEntriesId.push(clubNameIdDet);
                }
                var data = {
                    userId: playerIdToSave,
                    academyId: clubNameIdDet,
                    parentAssociationId: parentAssociationId,
                    associationId: associationId,
                    eventsList: eventsChecked,
                    totalFees: totalAMT
                }
                if (data["userId"].length !== 0)
                    subDetails.push(data)
            });

            var finalData = {
                tournamentId: Router.current().params._PostId,
                eventEntries: subDetails,
                //lengthOfEve:events.length
            }
            Meteor.call("playerEntriesComputeTotal", finalData, function(e, r) {
                if (r) {}
            })
        }
    }

});



var saveDataNextPage = async function(callBack) {
    if (Session.get("playerDBName")) {
        var subDetails = [];
        var events = [];
        var eventsFees = [];
        var eventFeeSettingsFind = eventFeeSettings.findOne({
            "tournamentId": Router.current().params._PostId
        })
        if (eventFeeSettingsFind) {
            events = eventFeeSettingsFind.singleEvents;
            eventsFees = eventFeeSettingsFind.singleEventFees;
        }

        var playerId = "";
        var eventsChecked = [];
        var academyEntriesId = [];
        var districtAssociationIdEntries = [];
        var userIdslist = []

        $("#tblOne > tbody  > tr").each(function() {
            playerId = "";
            eventsChecked = [];
            totalAMT = 0;
            eventSubscribed = [];
            eventName = "";

            $(this).find("input[name=checkEvents]").each(function() {
                playerId = $(this).attr("player");
                if (playerId != undefined) {
                    for (var i = 0; i < events.length; i++) {
                        eventName = events[i];
                        if ($(this).val() == events[i]) {
                            if ($(this).is(":checked")) {
                                eventsChecked.push(eventsFees[i] + "");
                                totalAMT = totalAMT + parseInt(eventsFees[i])
                            } else {
                                eventsChecked.push("0");
                            }
                            break;
                        }
                    }
                }
            });

            var clubNameIdDet = "";
            var associationId = "";
            var parentAssociationId = "";
            var associationIdEntry = ""
            var userFound = ""

            /*if (userFound.clubNameId == undefined || userFound.clubNameId == null) {
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
            if (_.findWhere(academyEntriesId, clubNameIdDet) == null) {
                academyEntriesId.push(clubNameIdDet);
            }
            if (_.findWhere(districtAssociationIdEntries, associationIdEntry) == null) {
                if (associationIdEntry.length != 0)
                    districtAssociationIdEntries.push(associationIdEntry);
            }*/

            if(_.findWhere(userIdslist, playerId) == null){
                userIdslist.push(playerId)
            }

            var data = {
                userId: playerId,
                academyId: "other",
                parentAssociationId: "other",
                associationId: "other",
                eventsList: eventsChecked,
                totalFees: totalAMT
            }
            subDetails.push(data)
        });

        var finalData = {
            tournamentId: Router.current().params._PostId,
            eventCollection: Session.get("eventParticipantsArray"),
            eventEntries: subDetails,
            academyEntriesId: academyEntriesId,
            dAEntriesId: districtAssociationIdEntries,
            userIdslist:userIdslist,
            type:1
                //lengthOfEve:events.length
        }

        return callBack(finalData)
    }
}

var sendSubscriptionEmailAll = function(tournamentId) {
    $("#savingDataPopupNew").modal('hide')
    Meteor.call("getAllSubscribersOfTournament", tournamentId, function(e, response) {
        var lData = response;
        if (response) {
            try {
                var type = events.findOne({
                    "_id": Router.current().params._PostId,
                    tournamentEvent: true
                });
                if (type) {
                    var eveOrg;

                    Meteor.call("whoisEventOrganizer", type.eventOrganizer, function(e, res) {
                        try {
                            if (res) {
                                eveOrg = res
                            }
                            //0
                            if (type.subscriptionTypeHyper == 0 && type.subscriptionTypeMail == 0 && type.subscriptionTypeDirect == 0) {

                            }

                            //1
                            else if (type.subscriptionTypeHyper == 0 && type.subscriptionTypeMail == 0 && type.subscriptionTypeDirect == 1) {
                                saveAndSend(lData, Meteor.user().role, eveOrg.emailAddress,
                                    "Recent subscription details of tournament", "iPlayOn:Subscription successful", "no");
                                Router.go("/upcomingEvents")
                            }

                            //2
                            else if (type.subscriptionTypeHyper == 0 && type.subscriptionTypeMail == 1 && type.subscriptionTypeDirect == 0) {
                                saveAndSend(lData, Meteor.user().role, eveOrg.emailAddress,
                                    "Please consider my subscription for the following events of tournament", "iPlayOn:Subscription Requisition", "no");
                                Router.go("/upcomingEvents")
                            }

                            //3
                            else if (type.subscriptionTypeHyper == 0 && type.subscriptionTypeMail == 1 && type.subscriptionTypeDirect == 1) {
                                saveAndSend(lData, Meteor.user().role, eveOrg.emailAddress,
                                    "Recent subscription details of tournament", "iPlayOn:Subscription successful", "no")
                                Router.go("/upcomingEvents")
                            }

                            //4
                            else if (type.subscriptionTypeHyper == 1 && type.subscriptionTypeMail == 0 && type.subscriptionTypeDirect == 0) {
                                $("#alreadySubscribed_entryFromAcaText").html("Redirect to hyperlink");
                                $("#alreadySubscribed_entryFromAca").modal({
                                    backdrop: 'static',
                                    keyboard: false
                                });
                            }

                            //5
                            else if (type.subscriptionTypeHyper == 1 && type.subscriptionTypeMail == 0 && type.subscriptionTypeDirect == 1) {
                                saveAndSend(lData, Meteor.user().role, eveOrg.emailAddress,
                                    "Recent subscription details of tournament", "iPlayOn:Subscription successful", "yes")
                                Router.go("/upcomingEvents")
                            }

                            //6
                            else if (type.subscriptionTypeHyper == 1 && type.subscriptionTypeMail == 1 && type.subscriptionTypeDirect == 0) {
                                saveAndSend(lData, Meteor.user().role, eveOrg.emailAddress,
                                    "Please consider my subscription for the following events of tournament", "iPlayOn:Subscription Requisition", "yes");
                                Router.go("/upcomingEvents")
                            }

                            //7
                            else if (type.subscriptionTypeHyper == 1 && type.subscriptionTypeMail == 1 && type.subscriptionTypeDirect == 1) {
                                saveAndSend(lData, Meteor.user().role, eveOrg.emailAddress,
                                    "Recent subscription details of tournament", "iPlayOn:Subscription successful", "yes");
                                Router.go("/upcomingEvents")
                            }
                        } catch (e) {}
                    })
                }
            } catch (e) {}
        } else if (e) {}
    })
}

var saveAndSend = function(lData, role, eventOrganizerMail, messageM, subjectM, hypOrNot) {
    try {
        var ccM = "";
        var eventsABBNAME = [];
        var myDetails = [];
        try {
            var type = events.findOne({
                "_id": Router.current().params._PostId,
                tournamentEvent: true
            });
        } catch (e) {}
        var eveOrg;
        var eventPrizes = eventFeeSettings.findOne({
            "tournamentId": Router.current().params._PostId
        });
        if (eventPrizes && eventPrizes.eventFees) {
            eventPrizes = eventPrizes.singleEventFees;
        } else {
            eventPrizes = []
        }
        Meteor.call("eventAbbrevationsNAMESSeparatedEvents", Router.current().params._PostId, function(e, resP) {
            if (resP) eventsABBNAME = resP
        });

        Meteor.call("whoisEventOrganizer", type.eventOrganizer, function(e, res) {
            try {
                if (res) {
                    eveOrg = res

                    if (type && type.eventOrganizer) {
                        try {
                            if (type.eventOrganizer == Meteor.user().userId) {
                                ccM = ""
                            } else {
                                ccM = Meteor.user().emailAddress
                                if (eveOrg.userName)
                                    myDetails.push("contact person :" + eveOrg.userName)
                                else if (eveOrg.contactPerson) {
                                    myDetails.push("contact person :" + eveOrg.contactPerson)
                                }
                                if (eveOrg.clubName)
                                    myDetails.push(" from " + eveOrg.role.toLowerCase() + ":" + eveOrg.clubName)
                                else if (eveOrg.associationName)
                                    myDetails.push(" from " + eveOrg.role.toLowerCase() + ":" + eveOrg.associationName)
                                else if (eveOrg.userName)
                                    myDetails.push(" from " + eveOrg.role.toLowerCase() + ":" + eveOrg.userName)
                                myDetails.push("email :" + eveOrg.emailAddress)
                                myDetails.push("contact number:" + eveOrg.phoneNumber)
                            }
                        } catch (e) {}
                        //Meteor.call("eventAbbrevationsNAMES", Router.current().params._PostId,function(e,resP){
                        //if(res){
                        //   eventsABBNAME = resP
                        //}
                        var dataContext = {
                            message: messageM,
                            tournament: type.eventName,
                            contactPerson: eveOrg.userName,
                            eventsDetailsMail: eventsABBNAME,
                            eventFeesPrize: eventPrizes,
                            playersWithCheckMail: lData
                        }
                        var html = Blaze.toHTMLWithData(Template.sendSubscriptionEmailFromClubEntry, dataContext);
                        
                        var options = {
                            from: "iplayon.in@gmail.com",
                            to: eveOrg.emailAddress,
                            subject: subjectM,
                            cc:ccM,
                            html: html
                        }
                        Meteor.call("sendShareEmail", options, function(e, re) {
                            if (re) {
                                alert("Network issue, Please Check your subscription and try again")
                            } else {

                            }
                        });
                        /*if (ccM.length !== 0) {
                            var dataContext2 = {
                                message: messageM,
                                tournament: type.eventName,
                                myDetails: myDetails,
                                contactPerson: eveOrg.userName,
                                eventsDetailsMail2: eventsABBNAME,
                                playersWithCheckMail2: lData
                            }
                            var html2 = Blaze.toHTMLWithData(Template.sendSubscriptionEmailFromClubEntry_Ex, dataContext2);
                            var options2 = {
                                from: "iplayon.in@gmail.com",
                                to: ccM,
                                subject: subjectM,
                                html: html2
                            }

                            Meteor.call("sendShareEmail", options2, function(e, re) {
                                if (re) {
                                    alert("Network issue, Please Check your subscription and try again")
                                } else {}
                            });
                        }*/
                    } else {
                        // /Router.go("/"+Iron.Location.get().path);
                    }
                } else if (e) {}
            } catch (e) {}
        })
    } catch (e) {}
}

var computeTotalOFSingle = function(userIdComp) {
    if (Session.get("playerDBName")) {
        var userIdComp = userIdComp;
        var subDetails = [];
        var events = [];
        var eventsFees = [];
        var eventFeeSettingsFind = eventFeeSettings.findOne({
            "tournamentId": Router.current().params._PostId
        })
        if (eventFeeSettingsFind) {
            events = eventFeeSettingsFind.singleEvents;
            eventsFees = eventFeeSettingsFind.singleEventFees;
        }
        var academyEntriesId = [];

        $("#tblOne > tbody  > tr").each(function() {
            var playerId = "";
            var playerIdToSave = "";
            var eventsChecked = [];
            var totalAMT = 0;
            var eventSubscribed = [];
            var eventName = "";
            var userFound = "";

            $(this).find("input[name=checkEvents]").each(function() {
                playerId = $(this).attr("player");
                if (playerId == userIdComp) {
                    playerIdToSave = userIdComp;
                    userFound = true

                    if (playerId != undefined) {
                        for (var i = 0; i < events.length; i++) {
                            eventName = events[i];
                            if ($(this).val() == events[i]) {
                                if ($(this).is(":checked")) {
                                    eventsChecked.push(eventsFees[i] + "");
                                    totalAMT = totalAMT + parseInt(eventsFees[i])
                                } else {
                                    eventsChecked.push("0");
                                }

                                break;
                            }
                        }
                    }
                }
            });
            if (eventsChecked.length)
                Meteor.call("computeTotalOFSingleMethod", eventsChecked, totalAMT, playerId, Router.current().params._PostId, Meteor.userId(), function(e, res) {
                    if (res) {
                        var l = []
                        if (Session.get("playerEntriesOfTournComputeTot")) {
                            var kpla = Session.get("playerEntriesOfTournComputeTot")

                            if(_.findWhere(kpla, {playerId: res.playerId})){
                                kpla = _.without(kpla, _.findWhere(kpla, {
                                  playerId: res.playerId
                                }));
                            }

                            l = kpla
                            l.push(res)
                            Session.set("playerEntriesOfTournComputeTot", l)
                        } else {
                            l.push(res)
                            Session.set("playerEntriesOfTournComputeTot", l)
                        }


                    }
                })

        });


    }
}

var computeTotalOFSingleTemp = function(userIdComp) {
    if (Session.get("playerDBName")) {
        var userIdComp = userIdComp;
        var subDetails = [];
        var events = [];
        var eventsFees = [];
        var eventFeeSettingsFind = eventFeeSettings.findOne({
            "tournamentId": Router.current().params._PostId
        })
        if (eventFeeSettingsFind) {
            events = eventFeeSettingsFind.singleEvents;
            eventsFees = eventFeeSettingsFind.singleEventFees;
        }
        var academyEntriesId = [];

        $("#tblOne > tbody  > tr").each(function() {
            var playerId = "";
            var playerIdToSave = "";
            var eventsChecked = [];
            var totalAMT = 0;
            var eventSubscribed = [];
            var eventName = "";
            var userFound = "";

            $(this).find("input[name=checkEvents]").each(function() {
                playerId = $(this).attr("player");
                if (playerId == userIdComp) {
                    playerIdToSave = userIdComp;
                    userFound = nameToCollection(Session.get("playerDBName")).findOne({
                        "userId": playerId
                    });

                    if (userFound != undefined) {
                        for (var i = 0; i < events.length; i++) {
                            eventName = events[i];
                            if ($(this).val() == events[i]) {
                                if ($(this).is(":checked")) {
                                    eventsChecked.push(eventsFees[i] + "");
                                    totalAMT = totalAMT + parseInt(eventsFees[i])
                                } else {
                                    eventsChecked.push("0");
                                }
                                break;
                            }
                        }
                    }
                }
            });

            var clubNameIdDet = "";
            var associationId = "";
            var parentAssociationId = "";
            if (userFound.clubNameId == undefined || userFound.clubNameId == null) {
                clubNameIdDet = "other";
            } else {
                clubNameIdDet = userFound.clubNameId;
            }
            if (userFound.associationId == undefined || userFound.associationId == null) {
                associationId = "other";
            } else {
                associationId = userFound.associationId;
            }
            if (userFound.parentAssociationId == undefined || userFound.parentAssociationId == null) {
                parentAssociationId = "other";
            } else {
                parentAssociationId = userFound.parentAssociationId;
            }
            if (_.findWhere(academyEntriesId, clubNameIdDet) == null) {
                academyEntriesId.push(clubNameIdDet);
            }
            var data = {
                userId: playerIdToSave,
                academyId: clubNameIdDet,
                parentAssociationId: parentAssociationId,
                associationId: associationId,
                eventsList: eventsChecked,
                totalFees: totalAMT
            }
            if (data["userId"].length !== 0)
                subDetails.push(data)
        });

        var finalData = {
            tournamentId: Router.current().params._PostId,
            eventEntries: subDetails,
            //lengthOfEve:events.length
        }
        Meteor.call("playerEntriesComputeTotal", finalData, function(e, r) {
            if (r) {}
        })
    }
}
Template.registerHelper("eventAbbName", function(data) {
    if (data) {
        var eventDetails = events.findOne({
            "_id": data
        });
        if (eventDetails) {
            return eventDetails.abbName
        }
    }
});

Template.registerHelper("getSLNUMB", function(data) {
    if (Router.current().params.page == 1) {
        index = 1
    } else {
        if(isNaN(Router.current().params.pageSkip) == true){
            index = parseInt(parseInt(Session.get("skipCountSess") * 10) + 1)
        }
        else{
            index = parseInt(parseInt((Session.get("skipCountSess")) * 10) + 1)
        }
    }
    return parseInt(data + index);
});

Template.registerHelper("clubORAssoc", function(data) {
    if (data) {
        var v = ReactiveMethod.call("whichClubORAssocName", data)
        return v
    }
});
Template.registerHelper("eventFees", function(data) {
    if (data) {
        var eventDetails = events.findOne({
            "_id": data,
            tournamentId: Router.current().params._PostId,
            tournamentEvent: false
        });
        if (eventDetails) {
            return eventDetails.prize
        }
    }
});

Template.registerHelper("eventFeesSendMAIL", function(data) {
    if (data) {
        var eventDetails = events.findOne({
            "abbName": data
        })
        if (eventDetails && eventDetails.prize) {
            return eventDetails.prize
        }
    }
});
Template.registerHelper("registeredOrNotPast", function(data1, data2) {
    if (data1 && data2) {
        try {
            var eventDetails = events.findOne({
                "_id": data1
            });
            if (eventDetails && eventDetails.eventParticipants) {
                var fArray = eventDetails.eventParticipants;
                if (_.findWhere(fArray, data2) == null) {
                    return false
                } else
                    return true;
            } else return false
        } catch (e) {}
    }
});

Template.registerHelper("eventABBNAME", function(data1, data2) {
    if (data1 != undefined) {
        try {
            var eventFeeSettingsFind = eventFeeSettings.findOne({
                "tournamentId": Router.current().params._PostId
            });
            if (eventFeeSettingsFind) {
                return eventFeeSettingsFind.singleEvents[data1]
            }
        } catch (e) {}
    }
});

Template.registerHelper("registeredOrNotMail", function(data1, data2) {
    if (data1 && data2) {
        try {
            var dataToCheck = {
                eventId: data1,
                userId: data2
            }
            if (dataToCheck) {
                var fArray = Session.get("checkedBoxes");
                if (_.findWhere(fArray, dataToCheck) == null) {
                    return false
                } else
                    return true;
            } else return false
        } catch (e) {}
    }
});

Template.registerHelper("totalFeeMail", function(data) {
    if (data) {
        try {
            var sum = 0;
            var userId = data
            var matches = Session.get("checkedBoxes").filter(function(val, index, array) {
                return val.userId === userId;
            });
            var matchedArray = matches;
            matchedArray.forEach(function(lEvents, i) {
                sum = parseInt(sum + parseInt(lEvents.fee))
            });
            return sum;
        } catch (e) {}
    }
});

Template.registerHelper("totalCompute", function(data) {
    var userId = data
    try {
        var userId = data;
        var totalFees = 0;
        $("#tblOne > tbody  > tr").each(function() {
            $(this).find("input[name=checkEvents]:checked").each(function() {
                var checkWichRow = $(this).val().split('||')
                if (checkWichRow[0].trim() == userId) {
                    if (events.findOne({
                            "_id": checkWichRow[1].trim()
                        }).prize) {
                        totalFees = parseInt(parseInt(totalFees) + parseInt(events.findOne({
                            "_id": checkWichRow[1]
                        }).prize))
                    }
                }
            })
        });
        return totalFees
    } catch (e) {}
});

Template.registerHelper("checkZEROorONE", function(data) {
    if (parseInt(data) == 0) {
        return false
    } else {
        return true
    }
})



Template.registerHelper("checkGenderToSub", function(data1, data2, data3, userDet) {
    try {
        if (Session.get("playerDBName")) {
            var eventFeeSettingsFind = eventFeeSettings.findOne({
                "tournamentId": Router.current().params._PostId
            });

            if (eventFeeSettingsFind) {
                data1 = eventFeeSettingsFind.singleEvents[data1]
            }
            var tournamentId = Router.current().params._PostId;
            var tournDetails = events.findOne({
                "_id": tournamentId,
                tournamentEvent: true
            });
            var eventDetails = events.findOne({
                "abbName": data1,
                tournamentEvent: false,
                tournamentId: tournamentId
            });

            var userDetails = userDet

            if (userDetails.gender == null || userDetails.gender == undefined || userDetails.gender.trim().length == 0) {
                userDetails.gender = "gender"
                data2 = "gender"
            }

            if (eventDetails && tournDetails && userDetails) {
                if (eventDetails.allowSubscription) {
                    if (eventDetails.allowSubscription == "no") {
                        return false;
                    }
                }
                var userDate = "";
                var filterDate = "";
                var birthDetails = dobFilterSubscribe.findOne({
                    "mainProjectId": tournDetails.projectId.toString(),
                    "eventOrganizer": tournDetails.eventOrganizer.toString(),
                    "tournamentId": Router.current().params._PostId
                });
                if (birthDetails && birthDetails.details) {
                    for (var j = 0; j < birthDetails.details.length; j++) {
                        var find1 = birthDetails.details[j];
                        if (find1.ranking == "yes" && find1.eventId == eventDetails.projectId.toString()) {
                            if (userDetails.affiliationId !== null && userDetails.affiliationId != undefined && userDetails.affiliationId != "other" && userDetails.statusOfUser == "Active") {
                                if (find1.eventId == eventDetails.projectId.toString()) {
                                    filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                    userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");
                                    if (new Date(userDate) >= new Date(filterDate)) {
                                        if (find1.gender.toUpperCase() == data2.trim().toUpperCase()) {
                                            return true
                                        } else if (find1.gender.toUpperCase() == "ALL") {
                                            return true
                                        } else {
                                            return false
                                        }
                                    } else if (new Date(userDate) < new Date(filterDate)) {
                                        return false
                                    }
                                }
                            } else if (find1.eventId == eventDetails.projectId.toString()) {
                                return false;
                            }
                        } else if (find1.ranking == "no" && find1.eventId == eventDetails.projectId.toString()) {
                            if (find1.eventId == eventDetails.projectId.toString()) {
                                filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");
                                if (new Date(userDate) >= new Date(filterDate)) {
                                    if (find1.gender.toUpperCase() == data2.trim().toUpperCase()) {
                                        return true
                                    } else if (find1.gender.toUpperCase() == "ALL") {
                                        return true
                                    } else {
                                        return false
                                    }
                                } else if (new Date(userDate) < new Date(filterDate)) {
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

    } catch (e) {
    }
});


Template.registerHelper("checkGenderToSubPoint", function(data1, data2, data3, userdet) {
    if (Session.get("playerDBName")) {
        var tournamentId = Router.current().params._PostId;
        var tournDetails = events.findOne({
            "_id": tournamentId,
            tournamentEvent: true
        });
        var eventDetails = events.findOne({
            "_id": data1,
            tournamentEvent: false,
            tournamentId: tournamentId
        });

        var userDetails = userdet
        if (userDetails.gender == null || userDetails.gender == undefined || userDetails.gender.trim().length == 0) {
            userDetails.gender = "gender"
        }
        if (eventDetails && tournDetails && userDetails) {
            if (eventDetails.allowSubscription) {
                if (eventDetails.allowSubscription == "no") {
                    return false;
                }
            }
            var userDate = "";
            var filterDate = "";
            var birthDetails = dobFilterSubscribe.findOne({
                "mainProjectId": tournDetails.projectId.toString(),
                "eventOrganizer": tournDetails.eventOrganizer.toString(),
                "tournamentId": Router.current().params._PostId
            });
            if (birthDetails.details) {
                for (var j = 0; j < birthDetails.details.length; j++) {
                    var find1 = birthDetails.details[j];
                    if (find1.eventId == eventDetails.projectId.toString()) {
                        filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                        userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");
                        if (new Date(userDate) >= new Date(filterDate)) {
                            if (find1.gender.toUpperCase() == data2.trim().toUpperCase()) {
                                return "pointer"
                            } else if (find1.gender.toUpperCase() == "ALL") {
                                return "pointer"
                            } else {
                                return "disabled"
                            }
                        } else if (new Date(userDate) < new Date(filterDate)) {
                            return "disabled"
                        }
                    } else {
                        return "pointer"
                    }
                }
            } else {
                return "pointer"
            }
        }
    }
});