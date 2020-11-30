
/*const rrobin = require('./round-robin/round-robin');
const e = require('./player-data');

const {entries} = e;
console.log(`The entry-set has ${entries.length} players`);
let groups = rrobin.createDraws(entries,16,3, 'rank','Player/Team Name');
console.log(groups);*/



import { createDraws } from '../roundRobinDraws/round-robin.js';


import { JSONToCSVConvertor } from '../popups/downloadTemplateXXX.js';


var algArr = [];
var mergedArr = [];
Template.downloadRRDraws.onCreated(function() {
    this.subscribe("getDrawsUpcomingTournaments",Router.current().params._id);
    this.subscribe("onlyLoggedIn");
    this.subscribe("tournamentBasedPlayerTeam",Router.current().params._id)
});

Template.downloadRRDraws.onRendered(function() {
   
    Session.set("teamEventSelected",undefined)
})
Template.downloadRRDraws.helpers({
    thiss: function() {
        if (Session.get("eventName"))
            return Session.get("eventName");
        else
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
                }
            }
        } catch (e) {}
        try {
            var sport = Session.get("selectedSport");

            var eveNameVi = events.findOne({
                "_id": Router.current().params._id
            });
            if(eveNameVi == undefined)
            {
                eveNameVi = pastEvents.findOne({
                "_id": Router.current().params._id
            });
            }
            var sportsUnderTou = [];
            if (eveNameVi != undefined) {
                for (var i = 0; i < eveNameVi.eventsUnderTournament.length; i++) {
                    eveNam = events.findOne({
                        "_id": eveNameVi.eventsUnderTournament[i]
                    });
                    if(eveNam == undefined)
                    {
                        eveNam = pastEvents.findOne({
                            "_id": eveNameVi.eventsUnderTournament[i]
                        });
                    }
                    var newJson = {};
                    newJson["eventId"] = eveNam.projectId[0];
                    newJson["eventName"] = eveNam.eventName;
                    sportsUnderTou.push(newJson);
                }
            }

            if (sportsUnderTou.length != 0) {
                return sportsUnderTou;
            }
        } catch (e) {}
    }
});

Template.downloadRRDraws.events({
    'change [name="eventList"]': function(event, template) {
        event.preventDefault();
        mergedArr = [];
        userDetail = [];
        algArr = [];
        $("#impMsg").text("");
        Session.set("teamEventSelected",undefined)
        try {
            if (Session.get("eventName") !== $(event.currentTarget).html().trim()) {
                Session.set("changeFirstUserId", undefined)
            }
            var sEvent = event.target.value;
            Session.set("drawsEvent", sEvent);
            var sEventID = $("[name='eventList'] option:selected").attr("name");
            Session.set("drawsEventID", sEventID);

            var tournamentId = Session.get("tournamentId");
            
        } catch (e) {
            
        }
    },
    "keypress #maxMembers": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 43 || keycode == 45 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true;
        
    },
 "keypress #noOfGroups": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 43 || keycode == 45 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true;
        
    },

    'click #downloadDraws': function(e) {
        e.preventDefault();
        try{
            var sEventID = $('#downloadRRDraws').find("[name='eventList'] option:selected").attr("name");
            var sEvent = $('#downloadRRDraws').find("[name='eventList'] option:selected").val();
            var maxMembers = $('#downloadRRDraws').find("[name='maxMembers']").val();
            var tournamentId = Session.get("tournamentId");
            var noOfGroups = $('#downloadRRDraws').find("[name='noOfGroups']").val();

            if(sEvent != "" && sEventID != "" && maxMembers != "" 
                && sEvent != undefined && sEventID != undefined && maxMembers != undefined 
                && noOfGroups != "" && noOfGroups != undefined)
            {
            
               Meteor.call("fetchTeamSubscribed", tournamentId, sEvent.trim(), sEventID,maxMembers,function(error, result) {
                    if (result) {
                           userDetail = result;  
                           if (userDetail.length != 0) 
                            {                 
                                
                                let groups = createDraws(userDetail,noOfGroups,maxMembers, 'rank','Player/Team Name');
                                var key = ["GroupNumber", "AffiliationID","Player/Team Name"]
                                var k = JSON.parse(JSON.stringify(groups, key, 5));
                                JSONToCSVConvertor(k, "", true, sEvent.trim());
                            }
                            else
                            {
                                $("#impMsg").text("No subscribers");
                            }               
                    }
                });

                
            }
            else
            {
                if(sEventID == undefined)
                    $("#impMsg").text("Choose Event");
                else if(noOfGroups == "")
                    $("#impMsg").text("Speicfy number of groups");
                else if(maxMembers == "")
                    $("#impMsg").text("Speicfy maximum qualifiers per group");


            }
        }catch(e){
        }
        
        
       

        



    }

});


