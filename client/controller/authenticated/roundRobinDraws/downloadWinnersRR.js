
import { JSONToCSVConvertor } from '../popups/downloadTemplateXXX.js';
import { computeBrackets } from '../popups/downloadTemplateXXX.js';
import { splitVec } from '../popups/downloadTemplateXXX.js';
import { insert } from '../popups/downloadTemplateXXX.js';
import { getIndexOf } from '../popups/downloadTemplateXXX.js';
import { show_ForTeamPlayers } from '../popups/downloadTemplateXXX.js';
import { mergeForTeamDraws } from '../popups/downloadTemplateXXX.js';





var algArr = [];
var mergedArr = [];
var BOTTOM = 0;
var TOP = 1;
Template.downloadWinnersRR.onCreated(function() {
    this.subscribe("getDrawsUpcomingTournaments",Router.current().params._id);
    this.subscribe("onlyLoggedIn");
    this.subscribe("tournamentBasedPlayerTeam",Router.current().params._id)
});

Template.downloadWinnersRR.onRendered(function() {

   
   
})
Template.downloadWinnersRR.helpers({
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

Template.downloadWinnersRR.events({
    
    "keypress #maxMembers": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 43 || keycode == 45 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true;  
    },
    'click #downloadWinnerDraws': function(e) {
        e.preventDefault();
        try{
            var sEventID = $('#downloadWinnersRR').find("[name='eventList'] option:selected").attr("name");
            var sEvent = $('#downloadWinnersRR').find("[name='eventList'] option:selected").val();
            var maxWinners = $('#downloadWinnersRR').find("[name='maxWinners']").val();
            var tournamentId = Session.get("tournamentId");
            
            if(sEvent != "" && sEventID != "" && maxWinners != "" && sEvent != undefined && sEventID != undefined && maxWinners != undefined)
            {
             
                var eventInfo = events.findOne({
                    "tournamentId": tournamentId,
                    "eventName": sEvent
                });
                if(eventInfo == undefined)
                {
                    eventInfo = pastEvents.findOne({
                        "tournamentId": tournamentId,
                        "eventName": sEvent
                    });
                }
                if(eventInfo)
                {       
                   Meteor.call("fetchRRWinner", tournamentId, sEvent.trim(), sEventID,maxWinners,function(error, result) {
                        if (result) {

                                if(result.status)
                                {
                                    if(result.status == "failure")
                                    {
                                        if(result.message)
                                        {
                                            displayMessage(result.message);
                                        }
                                    }
                                    else
                                    {
                                        if(result.response)
                                        {
                                            userDetail = [];
                                            mergedArr = [];
                                            algArr = [];
                                            userDetail = result.response;
                                            if(eventInfo.projectType == "1" || eventInfo.projectType == 1)
                                            {
                                                if (userDetail.length != 0) 
                                                { 
                                                    var key = ["Name", "Affiliation ID","Academy Name"];
                                                    var gPlayerVec = [];
                                                    gPlayerVec = computeBrackets(userDetail.length);
                                                    var showResponse = show(gPlayerVec);
                                                    merge(userDetail, showResponse);
                                                    var k = JSON.parse(JSON.stringify(mergedArr, key, 5));
                                                    JSONToCSVConvertor(k, "", true, sEvent.trim());
                                                }
                                                else
                                                {
                                                    $("#impMsg").text("No data");
                                                }
                                            }

                                            else if(eventInfo.projectType == "2" || eventInfo.projectType == 2)
                                            {
                                                if (userDetail.length != 0) 
                                                { 
                                                    var key = ["teamName", "teamAffiliationId","managerAffiliationId", "temporaryAffiliationId"]
                                                    var gPlayerVec = [];
                                                    gPlayerVec = computeBrackets(userDetail.length);
                                                    var showResponse = show_ForTeamPlayers(gPlayerVec);
                                                    var mergeResponse = mergeForTeamDraws(userDetail,showResponse)
                                                    var k = JSON.parse(JSON.stringify(mergeResponse, key,3));
                                                    JSONToCSVConvertor(k, "", true, sEvent.trim());
                                                }
                                                else{
                                                    $("#impMsg").text("No data");
                                                }
                                            }

                                            
                                            

                                            
                                        }
                                        

                                    }
                                }


                                             
                        }
                    });
                }

               
            }
            else
            {
                if(sEventID == undefined)
                    $("#impMsg").text("Choose Event");
                else if(maxWinners == "")
                    $("#impMsg").text("Speicfy maximum winners per group");
            }
        }catch(e){
        }
        
        
       

        



    }

});


/****************** functions *********************/

function show(gPlayerVec) {
    for (var i = 0; i < gPlayerVec.length; i++) {
        algArr.push({
            "position": i + 1,
            "rank": gPlayerVec[i].mRank
        })
    }
    return algArr;
}


function merge(userDetail, algArr) {
    if (algArr.length > 0) 
    {
        for (var i = 0; i < algArr.length; i++) {
            var rank = algArr[i].rank;
            if (rank == 0) {
                mergedArr.push({
                    "slNo": algArr[i].position,
                    "Name": "",
                    "Affiliation ID": "",
                    "Academy Name": ""
                })
            } else {
                for (var x = 0; x < userDetail.length; x++) {
                    if (rank == parseInt(x+1)) {

                        if (userDetail[x]["Affiliation ID"] == undefined)
                            userDetail[x].affiliationID = " ";
                        else
                            userDetail[x].affiliationID = userDetail[x]["Affiliation ID"];

                        mergedArr.push({
                            "slNo": algArr[i].position,
                            "Name": userDetail[x].Name,
                            "Affiliation ID": userDetail[x].affiliationID,
                            "Academy Name": userDetail[x].Academy,
                        })

                    }
                }
            }
        }
    }
}

 



function splitVec123(lPlayerVec) {
    var gPlayerVec = lPlayerVec;
    if (gPlayerVec.length == 0) {
        var p = {}; // {mRank: 1, mAt: TOP};
        p.mRank = 1;
        p.mAt = TOP;
        gPlayerVec.push(p);
        return gPlayerVec;
    } // set 'gPlayerVec' vector

    var LOOP_COUNT = gPlayerVec.length;
    // loop 'gPlayerVec'
    for (var i = 0, counter = 0; counter < LOOP_COUNT; i += 2, counter++) {
        if (i >= gPlayerVec.length) break;
        // if(gPlayerVec[i].mAt==TOP) insert at 'i+1' else at 'i-1'
        var p = {};
        p.mRank = 0;
        if (gPlayerVec[i].mAt == TOP) {
            p.mAt = BOTTOM;
            gPlayerVec.splice(i + 1, 0, p);
        } else {
            p.mAt = TOP;
            gPlayerVec.splice(i, 0, p);
        }
    }
    return gPlayerVec;
}

function insert123(lPlayerVec, playerCount) {
    var gPlayerVec = lPlayerVec;
    var curMax = 0;
    if (gPlayerVec.length % 2 == 0) {
        curMax = gPlayerVec.length / 2;
    } else {
        curMax = (gPlayerVec.length - 1) / 2;
    }
    var curMax_i = getIndexOf(gPlayerVec, curMax);
    if (curMax_i == -1) {
        return gPlayerVec;
    }

    // initialise 'next' variables
    var next = 0;
    next = curMax;
    var next_i = 0;

    // repeat for every new entries
    while (next < playerCount) {
        var nextPos = (gPlayerVec[curMax_i].mAt == TOP) ? BOTTOM : TOP;
        next = next + 1; // next Rank
        next_i = (nextPos == TOP) ? (curMax_i - 1) : (curMax_i + 1);

        gPlayerVec[next_i].mRank = next;
        gPlayerVec[next_i].mAt = nextPos; // set rank & position

        curMax--;
        curMax_i = getIndexOf(gPlayerVec, curMax);
        if (curMax_i == -1) {
            return gPlayerVec;
        }
    }
    return gPlayerVec;
}

function getIndexOf123(gPlayerVec, lRank) {
    for (var i = 0; i < gPlayerVec.length; i++) {
        if (gPlayerVec[i].mRank == lRank) {
            return i;
        }
    }
    return -1;
}
