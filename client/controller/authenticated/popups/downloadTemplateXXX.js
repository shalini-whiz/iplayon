import {
    Template
}
from 'meteor/templating';
import {
    ReactiveVar
}
from 'meteor/reactive-var';

export 
/* shalini codes starts here */

var algArr = [];
var mergedArr = [];
var userDetailsTT = "userDetailsTT"
//userDetailsTTUsed

Template.downloadTemplateXXX.onCreated(function() {
    //this.subscribe("events");
    this.subscribe("tournamentCategories");
    //this.subscribe("users");
    this.subscribe("academyDetails");
    this.subscribe("PlayerPoints");
    this.subscribe("GETSchoolPlayerDEtails")
    this.subscribe("GETSchoolDetails")
});

Template.downloadTemplateXXX.onRendered(function() {
    mergedArr = [];
    userDetail = [];
    algArr = [];
    Session.set("teamEventSelected",undefined)
      Session.set("progressBar",undefined);
    var dbsrequired = ["userDetailsTT"]
    if (Router.current().params._id) 
    {
        var tournamentFind = events.findOne({
            "_id": Router.current().params._id
        })
        if(tournamentFind == undefined)
        {
            tournamentFind = pastEvents.findOne({
                "_id": Router.current().params._id
            })
        }
        if(tournamentFind)
        {
            Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired, function(e, res) {
                if (res) {
                    if (res.changeDb && res.changeDb == true) {
                        if (res.changedDbNames.length != 0) {
                            userDetailsTT = res.changedDbNames[0]
                        }
                    }
                }
            }); 
        }
        
    }
})
Template.downloadTemplateXXX.helpers({
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
    "progressBar":function(){
      if(Session.get("progressBar") != undefined && Session.get("progressBar") == true)
        return true;
    },
    computeSelectedEventDraws:function(eventId,eventName)
    {
        mergedArr = [];
        userDetail = [];
        algArr = [];
        $("#impMsg").text("");
        Session.set("teamEventSelected",undefined)
        try {
           
            Session.set("drawsEvent", eventName);
            Session.set("drawsEventID", eventId);

            var tournamentId = Session.get("tournamentId");
            if (Session.get("drawsEventID")) 
            {
                var eventDet = events.findOne({
                    "eventName": eventName,
                    "tournamentId": Session.get("tournamentId")
                });
                if(eventDet == undefined)
                {
                    eventDet = pastEvents.findOne({
                        "eventName": eventName,
                        "tournamentId": Session.get("tournamentId")
                    })
                }
                if(eventDet&&parseInt(eventDet.projectType)==1){
                    downloadSingleEvents(tournamentId,eventId,eventName)
                }
                else if(eventDet&&parseInt(eventDet.projectType)==2){
                    Session.set("teamEventSelected",1)
                }
            }
        } catch (e) {
            
        }  
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
                })
            }
            var sportsUnderTou = [];
            if (eveNameVi != undefined) 
            {
                for (var i = 0; i < eveNameVi.eventsUnderTournament.length; i++) 
                {
                    eveNam = events.findOne({
                        "_id": eveNameVi.eventsUnderTournament[i]
                    });
                    if(eveNam == undefined)
                    {
                        eveNam = pastEvents.findOne({
                            "_id": eveNameVi.eventsUnderTournament[i]
                        })
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

Template.downloadTemplateXXX.events({
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
            if (Session.get("drawsEventID")) 
            {
                var eventDet = events.findOne({
                    "eventName": event.target.value,
                    "tournamentId": Session.get("tournamentId")
                });
                if(eventDet == undefined)
                {
                    eventDet = pastEvents.findOne({
                        "eventName": event.target.value,
                        "tournamentId": Session.get("tournamentId")
                    })
                }
                if(eventDet&&parseInt(eventDet.projectType)==1){
                    downloadSingleEvents(tournamentId,sEventID,sEvent)
                }
                else if(eventDet&&parseInt(eventDet.projectType)==2){
                    Session.set("teamEventSelected",1)
                }
            }
        } catch (e) {
            
        }
    },

    'click #downloadDraws': function(e) {
        try{
        e.preventDefault();

        if (mergedArr.length != 0&& Session.get("teamEventSelected")==0) 
        {
            Session.set("progressBar",true);
            var key = ["Name", "Affiliation ID", "Academy Name"];
            var k = JSON.parse(JSON.stringify(mergedArr, key, 5));
            JSONToCSVConvertor(k, "", true, Session.get("drawsEvent"));
            Session.set("progressBar",undefined)
        }
        else if(Session.get("teamEventSelected")==1&&Session.get("tournamentId")){
            Meteor.call("teamSubscribersDownload",$("[name=eventList]").val().trim(),Session.get("tournamentId"),function(e,res){
                if(res!=="0"){

                    var key = ["teamName", "teamAffiliationId","managerAffiliationId", "temporaryAffiliationId"]
                    var gPlayerVec = [];
                    gPlayerVec = computeBrackets(res.length);
                    var showResponse = show_ForTeamPlayers(gPlayerVec);
                    var mergeResponse = mergeForTeamDraws(res,showResponse)
                    var k = JSON.parse(JSON.stringify(mergeResponse, key,3));
                    JSONToCSVConvertor(k, "", true, Session.get("drawsEvent"));
                }
                else{
                    $("#impMsg").text("No subscribers");
                }
            });
        }
        else if(mergedArr.length==0&&Session.get("teamEventSelected")==undefined&&Session.get("tournamentId")&&Session.get("eventName")){
            Meteor.call("teamSubscribersDownload",$("[name=eventList]").val().trim(),Session.get("tournamentId"),function(e,res){
                if(res!=="0"){
                    var key = ["teamName","teamAffiliationId","managerAffiliationId", "temporaryAffiliationId"]
                    //var k = JSON.parse(JSON.stringify(res, key,3));
                    //JSONToCSVConvertor(k, "", true, Session.get("eventName"));
                    var gPlayerVec = [];
                    gPlayerVec = computeBrackets(res.length);

                    var showResponse = show_ForTeamPlayers(gPlayerVec);
                    var mergeResponse = mergeForTeamDraws(res,showResponse)
                    var k = JSON.parse(JSON.stringify(mergeResponse, key,3));
                    JSONToCSVConvertor(k, "", true, Session.get("drawsEvent"));
                }
                else{
                    $("#impMsg").text("No subscribers");
                }
            });
        }
    }catch(e){
    }
    }

});

/* shalini codes ends here */


var BOTTOM = 0;
var TOP = 1;

var Player = {
    mRank: 0,
    mAt: 0
};


 function merge(userDetail, algArr) {
    if (algArr.length > 0) {
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
                    if (rank == userDetail[x].rank) {
                        if (userDetail[x].affiliationID == undefined)
                            userDetail[x].affiliationID = " ";
                        mergedArr.push({
                            "slNo": algArr[i].position,
                            "Name": userDetail[x].playerName,
                            "Affiliation ID": userDetail[x].affiliationID,
                            "Academy Name": userDetail[x].Academy,
                            "Match Number": i
                        })
                    }
                }
            }
        }
    }
}

export function mergeForTeamDraws(userDetail, try1) {
    try{
    var teamMerge = []
    if (try1.length > 0) {
        for (var i = 0; i < try1.length; i++) {
            var rank = try1[i].rank;
            if (rank == 0) {
                teamMerge.push({
                    "slNo": try1[i].position,
                    "teamName": "",
                    "teamAffiliationId": "",
                    "managerAffiliationId":"",
                    "temporaryAffiliationId": ""
                })
            } else {
                for (var x = 0; x < userDetail.length; x++) {
                    if (rank == parseInt(x+1)) {
                        teamMerge.push({
                            "slNo": try1[i].position,
                            "teamName": userDetail[x].teamName,
                            "teamAffiliationId": userDetail[x].teamAffiliationId,
                            "managerAffiliationId": userDetail[x].managerAffiliationId,
                            "temporaryAffiliationId": userDetail[x].temporaryAffiliationId
                        })
                    }
                }
            }
        }
        return teamMerge
    }
}catch(e){
}
}

// var gPlayerVec = [];

function show(gPlayerVec) {
    for (var i = 0; i < gPlayerVec.length; i++) 
    {
        algArr.push({
            "position": i + 1,
            "rank": gPlayerVec[i].mRank
        })
    }
}

export function show_ForTeamPlayers(gPlayerVec) {
    var teamAlgArr = [];
    for (var i = 0; i < gPlayerVec.length; i++) {
        teamAlgArr.push({
            "position": i + 1,
            "rank": gPlayerVec[i].mRank
        })
    }
    return teamAlgArr;
}

export function getIndexOf(gPlayerVec, lRank) {
    for (var i = 0; i < gPlayerVec.length; i++) {
        if (gPlayerVec[i].mRank == lRank) {
            return i;
        }
    }
    return -1;
}


export function splitVec(lPlayerVec) {
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

export function insert(lPlayerVec, playerCount) {
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

export function computeBrackets(numPlayers) {
    var gPlayerVec = [];
    while (gPlayerVec.length < numPlayers) {
        var lPlayerVec = splitVec(gPlayerVec);
        gPlayerVec = insert(lPlayerVec, numPlayers);
    }
    return gPlayerVec;
}

function downloadSingleEvents(tournamentId, sEventID,sEvent){
    Meteor.call("checkEventRanking", tournamentId, sEventID.trim(), function(error, result) {
        try{
        if (result) 
        {
            
            Session.set("teamEventSelected",0);
            dobFilterInfo = result;

            if (dobFilterInfo && dobFilterInfo.details.length > 0) {
                if (sEventID.trim() == dobFilterInfo.details[0].eventId)
                    eventRanking = dobFilterInfo.details[0].ranking;
            }
            var eventInfo = events.findOne({
                "tournamentId": tournamentId,
                "eventName": sEvent
            });
            if(eventInfo == undefined)
            {
                eventInfo = pastEvents.findOne({
                    "tournamentId": tournamentId,
                    "eventName": sEvent
                })
            }
            if (eventInfo && eventInfo.eventParticipants) 
            {
                var userDetail = [];
                var eventParticipants = eventInfo.eventParticipants;
                var sportID = "";
                var eventInfo = events.findOne({
                    "tournamentId": tournamentId,
                    "eventName": sEvent
                });
                if(eventInfo && eventInfo.projectId && eventInfo.projectId[0])
                {
                    sportID = eventInfo.projectId[0];
                }
                else if(eventInfo == undefined)
                {
                    eventInfo = pastEvents.findOne({
                       "tournamentId": tournamentId,
                        "eventName": sEvent 
                    });
                    if(eventInfo && eventInfo.projectId && eventInfo.projectId[0])
                    {
                        sportID = eventInfo.projectId[0];
                    }
                }

              
                var academyName = "";
                Meteor.call("dbBasedEventParts",tournamentId,sEvent,eventParticipants,eventRanking,function(e,resuserInfo){                        

                    if (resuserInfo) 
                    {

                        userDetail = resuserInfo;
                        if (userDetail.length != 0) 
                        {
                            userDetail = _.sortBy(userDetail, 'points').reverse();
                            userDetail.map(function(document, index) {
                                document["rank"] = parseInt(index + 1);
                                document["slNo"] = parseInt(index + 1);
                            });

                            var gPlayerVec = [];
                            gPlayerVec = computeBrackets(userDetail.length);
                            show(gPlayerVec);
                            merge(userDetail, algArr);




                        }
                        else{
                            $("#impMsg").text("No subscribers");
                        }

                            
                    }
                })               
            }
            else if(eventInfo.eventParticipants == undefined)
            {
                $("#impMsg").text("No subscribers");
            }
        }
        else{
            $("#impMsg").text("No subscribers");
        }
        }catch(e){
        }
    });
}
/*Template.numPlayersFormTpl.events({
  'submit form'(event) {
    // increment the counter when button is clicked
    event.preventDefault();
    var numPlayers = event.target.numPlayers.value;
  
    var gPlayerVec = [];

    gPlayerVec = computeBrackets(numPlayers);
    show(gPlayerVec);
  },
});*/

export function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel, filNam) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = '"' + "Sl.No" + '",';
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += '"' + index + '",';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    var s = 0
    for (var i = 0; i < arrData.length; i++) {
        s = s + 1;
        var row = s + ",";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (typeof arrData[i][index] == "string")
                row += '"' + arrData[i][index] + '",';
            else {
                row += arrData[i][index] + ","

            }
        }

        row = row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        displayMessage("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = filNam + "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");


    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}