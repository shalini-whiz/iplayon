
Session.set("selectedSport", "Table Tennis");
Session.set("tournamentId", null);
Session.set("eventName", null);
Session.set("uploadedFileData", null);
Session.set("projectTypeOfEvent", null);
Session.set("roundRobinDraws", undefined);
Session.set("uploadedDraws", null);
Session.set("roundRobinTeamDraws", undefined);
Session.set("roundRobinSport",undefined);
var teamdbsrequired = ["playerTeams"]


var individualDBRequired = ["userDetailsTT"];
var individualDB = "userDetailsTT";

var teamDBRequired = ["playerTeams"];
var teamDB = "playerTeams";


Template.roundRobinDraws.onCreated(function bodyOnCreated() {
    this.subscribe("getDrawsUpcomingTournaments",Router.current().params._id);
    this.subscribe("getDrawsPastTournaments",Router.current().params._id);
    this.subscribe("onlyLoggedIn");
});


Template.roundRobinDraws.onRendered(function() {
    Session.set("tournamentId", Router.current().params._id);
});

Template.roundRobinDraws.helpers({

    "showRoundRobinDraws": function() {
        if(Session.get("roundRobinDraws"))
        {
            return true;

        }
    },
    "showRoundRobinTeamDraws": function() {
        if(Session.get("roundRobinTeamDraws"))
        {
            return true;

        }
    },


   
});

Template.roundRobinDraws.events({

});

Template.roundRobinMenu.onCreated(function bodyOnCreated() {
    
});

Template.roundRobinMenu.onRendered(function () {
    
});

Template.roundRobinMenu.helpers({
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
            {
                tournInfo = pastEvents.findOne({
                    "tournamentEvent": true,
                    "_id": Router.current().params._id
                });

            }
                
            else
            {
                tournInfo = events.findOne({
                    "tournamentEvent": true,
                    "_id": Router.current().params._id
                });
            }
                
            if (tournInfo != undefined)
            {
                if(tournInfo.projectId)
                    Session.set("roundRobinSport",tournInfo.projectId);
                return tournInfo.eventName
            }
        } catch (e) {}

    },
    upcomingTournament: function() {
        if (Router.current().params._eventType && Router.current().params._eventType == "past")
            return false;
        else
            return true;
    },
    selectedSportOrNot: function() {
        if (Session.get("selectedSportFromLive") !== undefined && Session.get("selectedSportFromLive") !== null) {
            if (Session.get("selectedSportFromLive") === 0) {
                return false
            } else 
            {
                return true
            }
        }
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
                        displayIndividualDraws();
                    } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                        //fnGetTeamMatches();
                        displayTeamDraws();
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

Template.roundRobinMenu.events({

    'click #drawsSelectionMenu_RR': function(e) {
        if ($("#drawsSelectionMenu_RR").hasClass("open"))
            $("#drawsSelectionMenu_RR").removeClass("open");
        else
            $("#drawsSelectionMenu_RR").addClass("open");

    },
    'click #eventSelectionMenu_RR': function(e) {
        if ($("#eventSelectionMenu_RR").hasClass("open"))
            $("#eventSelectionMenu_RR").removeClass("open");
        else
            $("#eventSelectionMenu_RR").addClass("open");

    },

    'click #eventSelectionAnchor_RR': function(e) {
        Meteor.call('existingRoundRobinDraws', Router.current().params._id, function(err, result) {
            if (err) {} else {
                Session.set("uploadedDraws", result);
            }
        });
    },
    "click #event_selection_RR": function(e) 
    {
        try{
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
                var xx = pastEvents.find({}).fetch();

                eventDetails = pastEvents.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: Session.get("eventName")
                });
            }
            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                displayIndividualDraws();
            } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                displayTeamDraws();

                //fnGetTeamMatches();
            }

        }catch(e){

        }
        
    },

    "click #createDrawBtn_RR": function(e) {

        e.preventDefault();
        $("#createDrawPopUp").empty();

        Blaze.render(Template.createRRDraw, $("#createDrawPopUp")[0]);
        $("#createRRDraw").modal({
            backdrop: 'static'
        });
    },

    'click #resetDraw_RR': function(event) {
        try{
           if (Session.get("roundRobinDraws") != undefined || Session.get("roundRobinTeamDraws") != undefined) 
            {
                if ((Session.get("roundRobinDraws") != undefined && Session.get("roundRobinDraws").length !== 0)  || 
                    (Session.get("roundRobinTeamDraws") != undefined && Session.get("roundRobinTeamDraws").length !== 0)) 
                { 
                    $("#confirmModalLogout").modal({backdrop: 'static'});
                    $("#conFirmHeaderLog").text("Are you sure you want to reset draws ?");

                } 
                else 
                {
                    $("#alreadySubscribed").modal({backdrop: 'static'});
                    $("#alreadySubscribedText").text("Nothing to reset");
                }

            } 
            else 
            {
                $("#alreadySubscribed").modal({backdrop: 'static'});
                $("#alreadySubscribedText").text("Nothing to reset");
            } 
        }catch(e)
        {
        }
        
    },

    'click #yesButtonLogout': function(e, template) 
    {
        e.preventDefault();
        $("#confirmModalLogout").modal('hide');
        $("#resetDrawsDialogPopUp").empty();
        Blaze.render(Template.resetDrawsDialog, $("#resetDrawsDialogPopUp")[0]);
        $("#resetDrawsDialog").modal({backdrop: 'static'});

    },
    'click #noButtonLogout': function(e) 
    {
        e.preventDefault();
        $("#confirmModalLogout").modal('hide');
    },
    



    "click #downloadTemplate_RR": function(e) {
        e.preventDefault();
        $("#downloadTemplateRRPopUp").empty();
        Blaze.render(Template.downloadRRDraws, $("#downloadTemplateRRPopUp")[0]);
        $("#downloadRRDraws").modal({
            backdrop: 'static'
        });
    },

    "click #downloadWinnerDraws_RR": function(e) {
        e.preventDefault();
        $("#downloadWinnerRRPopUp").empty();
        Blaze.render(Template.downloadWinnersRR, $("#downloadWinnerRRPopUp")[0]);
        $("#downloadWinnersRR").modal({
            backdrop: 'static'
        });
    },
    'click #stationarySelectionMenu_RR': function(e) {
        if ($("#stationarySelectionMenu_RR").hasClass("open"))
            $("#stationarySelectionMenu_RR").removeClass("open");
        else
            $("#stationarySelectionMenu_RR").addClass("open");
    },
    'click #resultsSelectionMenu_RR': function(e) {
        if ($("#resultsSelectionMenu_RR").hasClass("open"))
            $("#resultsSelectionMenu_RR").removeClass("open");
        else
            $("#resultsSelectionMenu_RR").addClass("open");
    },
    "click #receiptBtn_RR": function(e) {
        e.preventDefault();
        $("#receiptPopUp").empty();
        $("#leaveRequestPopUp").empty();


        Blaze.render(Template.receipt, $("#receiptPopUp")[0]);
        $("#receipt").modal({
            backdrop: 'static'
        });

    },
   

    "click #receiptBtnForTeamEvents_RR": function(e) {
        e.preventDefault();
        $("#receiptPopUp").empty();       
        $("#leaveRequestPopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#certificatePopUp").empty();

        Blaze.render(Template.receiptForTeams, $("#receiptPopUp")[0]);
        $("#receiptForTeams").modal({
            backdrop: 'static'
        });
    },

    "click #leaveRequestBtn_RR": function(e) {
        e.preventDefault();
        $("#leaveRequestPopUp").empty();
        $("#receiptPopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#certificatePopUp").empty();

        Blaze.render(Template.leaveRequest, $("#leaveRequestPopUp")[0]);
        $("#leaveRequest").modal({
            backdrop: 'static'
        });
    },

    "click #scoreSheetBtn_RR": function(e) {
        e.preventDefault();
        $("#leaveRequestPopUp").empty();
        $("#receiptPopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#certificatePopUp").empty();

        Meteor.call('existingRoundRobinDraws', Router.current().params._id, function(err, result) {
            if (err) {} else
                Session.set("uploadedDraws", result);
        });

        Blaze.render(Template.scoreSheetRR, $("#scoreSheetPopUp")[0]);
        $("#scoreSheetRR").modal({
            backdrop: 'static'
        });

    },
    "click #certificateBtn_RR": function(e) {
        e.preventDefault();
        $("#certificatePopUp").empty();
        $("#leaveRequestPopUp").empty();
        $("#receiptPopUp").empty();
        $("#scoreSheetPopUp").empty();

       
        Meteor.call('existingRoundRobinDraws', Router.current().params._id, function(err, result) {
            if (err) {} else
                Session.set("uploadedDraws", result);
        });

        Blaze.render(Template.certificate_RR, $("#certificatePopUp")[0]);
        $("#certificate_RR").modal({
            backdrop: 'static'
        });

    },
    "click #emailResultBtn_RR": function(e) {
        e.preventDefault();
        $("#receiptPopUp").empty();
        $("#leaveRequestPopUp").empty();
        $("#certificatePopUp").empty();
        $("#scoreSheetPopUp").empty();
        $("#resultsPopUp_RR").empty();

        Meteor.call('existingRoundRobinDraws', Router.current().params._id, function(err, result) {
            if (err) {} else
                Session.set("uploadedDraws", result);
        });

        Blaze.render(Template.result_RR, $("#resultsPopUp_RR")[0]);
        $("#result_RR").modal({
            backdrop: 'static'
        });

    },

    

})


/************* display round robin draws ********/

Template.roundRobinDrawView.onCreated(function bodyOnCreated() {
    if(Session.get("roundRobinDraws"))
    {
        this.subscribe("fetchGroupMemberInfo",Session.get("tournamentId"),Session.get("eventName"));
    }
});

Template.roundRobinDrawView.onRendered(function(){
    Meteor.call("getSportsMainDB",Session.get("roundRobinSport"),function(e,res){
            if(res != undefined && res != null && res != false){
                toRet = res
                Session.set("playerDBName",toRet)
            }
            else if(res != undefined && res != null && res == 2){
                toRet = false
                displayMessage("select sport first")
                Session.set("playerDBName",toRet)
            }
            else if(e){
                toRet = false
                Session.set("playerDBName",toRet)
            }
        });

    Meteor.call("changeDbNameForDraws",Session.get("tournamentId"),individualDBRequired,function(e,res2)
    {
        if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
        {
            Session.set("individualDBName",res2.changedDbNames[0])

        }     
    });



});

var nameToCollection = function(name) {
  return this[name];
};

Template.roundRobinDrawView.helpers({
    loginOrganizer:function(){
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
                if ((roleID == Meteor.userId())) {
                    return true;
                }
                else
                    return false;
            }
        } catch (e) {}
    },

    drawsEventName: function() {
        return Session.get("eventName");
    },
    "getRoundRobinRecords":function()
    {
        return Session.get("roundRobinDraws")
    },
    "drawsOrderPlay":function()
    {
        if(Session.get("roundRobinDraws"))
        {
            var resultDraws = Session.get("roundRobinDraws");
            if(resultDraws && resultDraws.length > 0 && resultDraws[0].orderPlay)
                return true;
        }
    },
    "orderPlayExists":function(data)
    {
        try{
           
            if(data.orderPlay)
            {
                return "col-md-9 col-xs-9 col-sm-9 col-lg-9"
            }
            else
            {
                return "col-md-12 col-xs-12 col-sm-12 col-lg-12"
            }
           
           
        }catch(e){
        }
    },
    getDocType: function() {
        return "<!DOCTYPE html>";
    },
    loopCount: function(count){
        var countArr = [];
        for (var i=1; i<=count; i++){
          countArr.push(i);
        }
        Session.set("loopCount",countArr.length);
        return countArr;
    },
    fetchRowMember:function(rowNumber,groupDetails)
    {
        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            var response = "";
           
            if(xx.length > 0 && Session.get("playerDBName") && Session.get("individualDBName"))
            {
                var result = ReactiveMethod.call("fetchRRUserName_Aca",xx[0].playersID.playerAId,Session.get("tournamentId"),"individual",Session.get("individualDBName"));
                /*if(result && result.userName)
                {
                    
                        var academyName = "";
                        if(result.academyName)
                        {
                            academyName = " ("+result.academyName.toString().substr(0, 3)+")"
                        }
                        return result.userName+""+academyName;
                    
                    
                }*/
                if(result)
                    return result;
              
            }
           
        }catch(e){
        }
    },
  

    "fetchRowRecord":function(rowNumber,groupDetails,groupMaxSize){

        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            if(xx.length == 0)
            {
                var arrJson = [];
                for(var m=0; m<groupMaxSize;m++)
                {
                    var json = {};
                    json.rowNo = index;
                    json.colNo = m+1;
                    arrJson.push(json);
                }
                return arrJson;
            }
            else
            {
                if(xx.length != groupMaxSize)
                {
                    var json = {};
                    for(var m=xx.length; m<groupMaxSize;m++)
                    {
                        json.rowNo = index;
                        json.colNo = m+1;
                        xx.push(json);
                    }
                }
                return xx;

            }
        }catch(e){
        }
    },
    "fetchRowPoints":function(rowNumber,groupDetails){

        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            if(xx.length > 0)
            {
                return xx[0].points;
            }
            return xx;
        }catch(e){
        }
    },
    "fetchRowStandings":function(rowNumber,groupDetails){

        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            if(xx.length > 0)
            {
                return xx[0].groupStanding;
            }
            return xx;
        }catch(e){
        }
    },
    
    "standingExists":function(rowNumber,groupDetails)
    {
        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            if(xx.length > 0)
                return true;
            else 
                return false;

        }catch(e){

        }
    },
    upcomingTournamentDraw: function() {
        if (Router.current().params._eventType && Router.current().params._eventType == "past")
            return false;
        else
            return true;
    },
})


Template.roundRobinDrawView.events({

    'click #editMatchOrder' : function(e)
    {
        $("#matchRROrderPopUp").empty();
        if(Session.get("roundRobinDraws"))
        {
            var resultDraws = Session.get("roundRobinDraws");
            if(resultDraws && resultDraws.length > 0 && resultDraws[0].orderPlay)
                {
                   // Session.set("matchRROrderData",resultDraws[0].orderPlay);
                    Blaze.render(Template.matchRROrder, $("#matchRROrderPopUp")[0]);
                    $("#matchRROrder").modal({backdrop: 'static'});

                }
        }
    },
    'click #detailScorePop': function(e) {
        $("#setRRScorePopUp").empty();
        if(this.rowNo == this.colNo)
        {

        }
        else
        {
            Session.set("currentPlayerMatchDetails",this);
            Session.set("currentPlayerMatchID",e.target.getAttribute("name"));

            Blaze.render(Template.scoreRRDetails, $("#setRRScorePopUp")[0]);
            $("#scoreRRDetails").modal({
                backdrop: 'static'
            });
        }
        
    },

    
    'click [id^=editStanding]': function(e) {

        $("[id^=setStandingRankScore"+this.groupNumber+"]").removeAttr('readonly');
        Session.set("currentStandingGroup",this._id);
        Session.set("currentGroupStandingInfo",this.groupStandingInfo);
        $("#closeedit"+this.groupNumber).show();
        $(e.target).hide()

     },

    'click [id^=closeedit]':function(e){

        $(e.target).hide();
        $("#editStanding"+this.groupNumber).show();
        $("[id^=setStandingRankScore"+this.groupNumber+"]").attr('readonly','readonly');
    },

    'click [id^=editPoints]': function(e) {

        $("[id^=setStandingPointScore"+this.groupNumber+"]").removeAttr('readonly');
        Session.set("currentStandingGroup",this._id);
        Session.set("currentGroupStandingInfo",this.groupStandingInfo);
        $("#closeeditpoints"+this.groupNumber).show();
        $(e.target).hide()

     },

    'click [id^=closeeditpoints]':function(e){

        $(e.target).hide();
        $("#editPoints"+this.groupNumber).show();
        $("[id^=setStandingPointScore"+this.groupNumber+"]").attr('readonly','readonly');
    },

    "keypress [id^=setStandingRankScore]":function(event){
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) 
        {
            return true;
        } 
        else if (key < 48 || key > 57) {
            return false;
        } else 
        return true; 
    },


    'focusout [id^=setStandingRankScore]':function(event){
        
        if(Session.get("currentStandingGroup"))
        {
            if($(event.target).val().trim() != "")
            {
                var value = $(event.target).val();
                var xData = {};
                xData.groupID = Session.get("currentStandingGroup");
                xData.rowNo = JSON.stringify(this);
                xData.groupStanding = $(event.target).val();
                var temp = Session.get("currentGroupStandingInfo");
                var status = true;
                if(parseInt(value) == 0)
                {
                    displayMessage("Please enter valid standing!!");
                    $(event.target).val("");

                }
                if(parseInt(value) > temp.length)
                {
                    displayMessage("Please enter valid standing within 1 - "+temp.length+"!!");
                    $(event.target).val("");
                }
                else
                {
                    Meteor.call("updateRRStanding",xData,function(error,result){

                    })
                }
            }
            else
            {
                displayMessage("Please enter valid standing!!");
            }

        }
                  
    },
    

    "keypress [id^=setStandingPointScore]":function(event){
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) 
        {
            return true;
        } 
        else if (key < 48 || key > 57) {
            return false;
        } else 
        return true; 
    },

    'focusout [id^=setStandingPointScore]':function(event){
        
        if(Session.get("currentStandingGroup"))
        {
            
            var value = $(event.target).val();
            var xData = {};
            xData.groupID = Session.get("currentStandingGroup");
            xData.rowNo = JSON.stringify(this);
            var temp = Session.get("currentGroupStandingInfo");
            var pointValue = 0;
            var status = true;
            if(value == "")
            {
                pointValue = 0;
            }
            else
            {
                pointValue = parseInt($(event.target).val());
            }

            xData.points = pointValue;
            $(event.target).val(xData.points)
 
                
            Meteor.call("updateRRPoints",xData,function(error,result){

            })
                
            

        }
                  
     },
    

    

    "click #groupScoreSheet":function(e){

        Session.set("currentStandingGroup",this._id);
        $("#groupScoreViewPopUp").empty();
        Blaze.render(Template.groupScoreView,$("#groupScoreViewPopUp")[0])
        $("#groupScoreView").modal({
            backdrop: 'static',
            keyboard: false
        });
    },
})

/************* round robin team draw view details *******************/



Template.roundRobinTeamDrawView.onCreated(function bodyOnCreated() {
    if(Session.get("roundRobinTeamDraws"))
    {
        this.subscribe("fetchGroupMemberTeamInfo",Session.get("tournamentId"),Session.get("eventName"));

    }
});

Template.roundRobinTeamDrawView.onRendered(function(){
    Meteor.call("changeDbNameForDraws",Session.get("tournamentId"),teamdbsrequired,function(e,res2)
    {
        if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
        {
            Session.set("teamDBName",res2.changedDbNames[0])

        }     
    });         
});

 




Template.roundRobinTeamDrawView.helpers({
    loginOrganizer:function(){
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
                if ((roleID == Meteor.userId())) {
                    return true;
                }
                else
                    return false;
            }
        } catch (e) {}
    },
    drawsEventName: function() {
        return Session.get("eventName");
    },
    "getRoundRobinTeamRecords":function()
    {
        return Session.get("roundRobinTeamDraws")
    },
    "drawsOrderPlay":function()
    {
        if(Session.get("roundRobinTeamDraws"))
        {
            var resultDraws = Session.get("roundRobinTeamDraws");
            if(resultDraws && resultDraws.length > 0 && resultDraws[0].orderPlay)
                return true;
        }
    },
    "orderPlayExists":function(data)
    {
        try{
           
            if(data.orderPlay)
                return "col-md-9 col-xs-9 col-sm-9 col-lg-9"
            else
                return "col-md-12 col-xs-12 col-sm-12 col-lg-12"
    
        }catch(e){
        }
    },
    loopCount: function(count){
        var countArr = [];
        for (var i=1; i<=count; i++){
          countArr.push(i);
        }
        Session.set("loopCount",countArr.length);
        return countArr;
    },
    fetchRowMember:function(rowNumber,groupDetails)
    {
        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            var response = "";
            if(xx.length > 0 && Session.get("teamDBName"))
            {                  
                var result = ReactiveMethod.call("fetchRRUserName_Aca",xx[0].teamsID.teamAId,Session.get("tournamentId"),"team",Session.get("teamDBName"))
                /*if(result && result.teamName)
                {
                        return result.teamName;
                }*/
                if(result)
                    return result;
               
            }
        }catch(e){
        }
    },
  

    "fetchRowRecord":function(rowNumber,groupDetails,groupMaxSize){

        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            if(xx.length == 0)
            {
                var arrJson = [];
                for(var m=0; m<groupMaxSize;m++)
                {
                    var json = {};
                    json.rowNo = index;
                    json.colNo = m+1;
                    arrJson.push(json);
                }
                return arrJson;
            }
            else
            {
                if(xx.length != groupMaxSize)
                {
                    var json = {};
                    for(var m=xx.length; m<groupMaxSize;m++)
                    {
                        json.rowNo = index;
                        json.colNo = m+1;
                        xx.push(json);
                    }
                }
                return xx;

            }
        }catch(e){
        }
    },
    "fetchRowStandings":function(rowNumber,groupDetails){

        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            if(xx.length > 0)
            {
                return xx[0].groupStanding;
            }
            return xx;
        }catch(e){
        }
    },
    "fetchRowPoints":function(rowNumber,groupDetails){

        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            if(xx.length > 0)
            {
                return xx[0].points;
            }
            return xx;
        }catch(e){
        }
    },
    "standingExists":function(rowNumber,groupDetails)
    {
        try{
            var index = rowNumber+1;
            var xx = _.where(groupDetails, {"rowNo": index});
            if(xx.length > 0)
                return true;
            else 
                return false;

        }catch(e){

        }
    },
    upcomingTournamentDraw: function() {
        if (Router.current().params._eventType && Router.current().params._eventType == "past")
            return false;
        else
            return true;
    },
})


Template.roundRobinTeamDrawView.events({
    'click #editMatchOrder' : function(e)
    {
        $("#matchRROrderPopUp").empty();
        if(Session.get("roundRobinTeamDraws"))
        {
            var resultDraws = Session.get("roundRobinTeamDraws");
            if(resultDraws && resultDraws.length > 0 && resultDraws[0].orderPlay)
                {
                   // Session.set("matchRROrderData",resultDraws[0].orderPlay);
                    Blaze.render(Template.matchRROrder, $("#matchRROrderPopUp")[0]);
                    $("#matchRROrder").modal({backdrop: 'static'});

                }
        }
    },
    'click #teamdetailScorePop': function(e) {
        $("#setRRScorePopUp").empty();
        if(this.rowNo == this.colNo)
        {

        }
        else
        {
            Session.set("currentPlayerMatchDetails",this);
            Session.set("currentPlayerMatchID",e.target.getAttribute("name"));
            $("#teamDrawsCapturePopUp").empty();
           /* Blaze.render(Template.teamDrawsCapture, $("#teamDrawsCapturePopUp")[0]);
            $("#teamDrawsCapture").modal({
                backdrop: 'static',
                keyboard:false
            });
            */

            
            $("#teamDrawsDetailsPopUp").empty();
            Blaze.render(Template.teamMatchScore,$("#teamDrawsDetailsPopUp")[0])
            $("#teamMatchScore").modal({
                backdrop: 'static',
                keyboard: false
            });


        }
        
    },

    

    'click [id^=editStandingTeamRR]': function(e) {

        $("[id^=setStandingRankScoreTeamRR"+this.groupNumber+"]").removeAttr('readonly');
        
        Session.set("currentStandingGroup",this._id);
        Session.set("currentGroupStandingInfo",this.groupStandingInfo);
        $("#closeeditTeamRR"+this.groupNumber).show();
        $(e.target).hide()

     },

    'click [id^=closeeditTeamRR]':function(e){

        $(e.target).hide();
        $("#editStandingTeamRR"+this.groupNumber).show();
        $("[id^=setStandingRankScoreTeamRR"+this.groupNumber+"]").attr('readonly','readonly');
    },

    'click [id^=editPointsTeamRR]': function(e) {

        $("[id^=setStandingPointScoreTeamRR"+this.groupNumber+"]").removeAttr('readonly');
        
        Session.set("currentStandingGroup",this._id);
        Session.set("currentGroupStandingInfo",this.groupStandingInfo);
        $("#closeeditpointsTeamRR"+this.groupNumber).show();
        $(e.target).hide()

     },

    'click [id^=closeeditpointsTeamRR]':function(e){

        $(e.target).hide();
        $("#editPointsTeamRR"+this.groupNumber).show();
        $("[id^=setStandingPointScoreTeamRR"+this.groupNumber+"]").attr('readonly','readonly');
    },


    "keyup [id^=setStandingRankScoreTeamRR]":function(event){
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) 
        {
            return true;
        } 
        else if (key < 48 || key > 57) {
            return false;
        } else 
        return true; 
    },

    "keyup [id^=setStandingPointScoreTeamRR]":function(event){
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) 
        {
            return true;
        } 
        else if (key < 48 || key > 57) {
            return false;
        } else 
        return true; 
    },



    'focusout [id^=setStandingRankScoreTeamRR]':function(event){
        try{
        if(Session.get("currentStandingGroup"))
        {
            if($(event.target).val().trim() != "")
            {
                var value = $(event.target).val();
                var xData = {};
                xData.groupID = Session.get("currentStandingGroup");
                xData.rowNo = JSON.stringify(this);
                xData.groupStanding = $(event.target).val();
                var temp = Session.get("currentGroupStandingInfo");
                var status = true;
                if(parseInt(value) == 0)
                {
                    displayMessage("Please enter valid standing!!");
                    $(event.target).val("");

                }
                if(parseInt(value) > temp.length)
                {
                    displayMessage("Please enter valid standing!!");
                    $(event.target).val("");
                }
                else
                {
                    Meteor.call("updateRRTeamStanding",xData,function(error,result){
                            if(result)
                            {
                            }
                        })       
                
                }
            }
            else
            {
                displayMessage("Please enter valid standing!!");
            }

        }
    }catch(e)
    {
    }
                  
     },




     

    'focusout [id^=setStandingPointScoreTeamRR]':function(event){
        try{
        if(Session.get("currentStandingGroup"))
        {
            
            var value = $(event.target).val();
            var xData = {};
            xData.groupID = Session.get("currentStandingGroup");
            xData.rowNo = JSON.stringify(this);
            xData.groupStanding = $(event.target).val();
            var temp = Session.get("currentGroupStandingInfo");
            var status = true;
            var pointValue = 0;
            if($(event.target).val() == "")
            {
               pointValue = 0;
            }
            else
            {
                pointValue = parseInt($(event.target).val());
            }
            xData.points = pointValue;
                
            Meteor.call("updateRRTeamPoints",xData,function(error,result){
                
            })       
                
                
            

        }
    }catch(e)
    {
    }
                  
     },

   
    "click #viewDetailedScoreRR":function(e){
        e.preventDefault();
        var tournamentId = Session.get("tournamentId");
        var det = Session.get("teamDetailedDraws");
        var eventName = Session.get("eventName");
        var round = det.roundNumber;
        var match = det.matchNumber;
        Meteor.call("teamDrawsSpecIsSetOrNot",tournamentId,eventName,round,match,function(e,res){
            if(res==true){
                $("#SettingsTeamDraws").modal('hide')
                $( '.modal-backdrop' ).remove();
                $("#renderTeamSpecForm").empty();   
                Blaze.render(Template.detailedScoresTeamDraws,$("#renderTeamSpecForm")[0])
                $("#detailedScoresTeamDraws").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
            else{
                displayMessage("Team Specification for this match is not set");
            }
        });        
    },

    "click #groupScoreSheet":function(e){

        Session.set("currentStandingGroup",this._id);
        $("#groupScoreViewPopUp").empty();
        Blaze.render(Template.groupScoreView,$("#groupScoreViewPopUp")[0])
        $("#groupScoreView").modal({
            backdrop: 'static',
            keyboard: false
        });
    },
   

    

    
})


/************* reset round robin draws *********/
Template.resetDrawsDialog.onCreated(function() {
    this.subscribe("onlyLoggedIn")
});


Template.resetDrawsDialog.events({
    'submit form': function(e) {
        e.preventDefault();
        $("#changePasswordSucc").html("")
    },
    'focus #oldPassword': function(e) {
        $("#changePasswordSucc").html("")
    },
});

Template.resetDrawsDialog.onRendered(function() {
    $('#application-resetDrawsDialog').validate({
        onkeyup: false,
        rules: {
            oldPassword: {
                required: true,
                minlength: 6,
            },
        },
        showErrors: function(errorMap, errorList) {
            $("#application-resetDrawsDialog").find("input").each(function() {
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

                        
                            var eventDetails = events.findOne({
                                "tournamentId": Session.get("tournamentId"),
                                eventName: Session.get("eventName")
                            });
                            if(eventDetails == undefined)
                            {
                                eventDetails = pastEvents.findOne({
                                "tournamentId": Session.get("tournamentId"),
                                eventName: Session.get("eventName")
                            });
                            }

                            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) 
                            {
                                Meteor.call("resetRoundRobinMatchRecords", Session.get("tournamentId"), Session.get("eventName"),function(error,result)
                                    {
                                        if(result)
                                        {
                                            $("#resetDrawsDialog").modal('hide');
                                            $("#conFirmHeaderOk").text(Session.get("eventName")+" reset succesfully done");
                                            $("#confirmModalOk").modal('show');
                                            Session.set("roundRobinDraws",undefined)
                                        }
                                    });
                            } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                                 Meteor.call("resetRoundRobinTeamMatchRecords", Session.get("tournamentId"), Session.get("eventName"),function(error,result)
                                    {
                                        if(result)
                                        {
                                            $("#resetDrawsDialog").modal('hide');
                                            $("#conFirmHeaderOk").text(Session.get("eventName")+" reset succesfully done");
                                            $("#confirmModalOk").modal('show');
                                            Session.set("roundRobinTeamDraws",undefined)
                                        }
                                    });

                            }
                        } else {
                            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + result.error.reason);

                        }

                    } catch (e) {
                    }
                });
            } catch (e) {

            }
        }
    });
});



/****************************** functions *********************************/


function displayIndividualDraws()
{
    try
    {
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        Session.set("roundRobinDraws",undefined);  
        Meteor.call("getRoundRobinMatchRecords",tournamentId,eventName,function(error,result){
            if(result)
            {
                Session.set("roundRobinDraws",result);  
                Session.set("roundRobinTeamDraws",undefined);         

            }
        })
    }catch(e){

    }
             

}


function displayTeamDraws()
{
    try
    {
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        Session.set("roundRobinTeamDraws",undefined);  
        Meteor.call("getRoundRobinMatchTeamRecords",tournamentId,eventName,function(error,result){
            if(result)
            {
                Session.set("roundRobinTeamDraws",result);  
                Session.set("roundRobinDraws",undefined);         

            }
        })
    }catch(e){

    }
}


/************************** Register Helpers ******************************/
Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});

Template.registerHelper('compare', function (rowNo,colNo) {
    if(rowNo == colNo)
        return true;
    else
        return false;
});

Template.registerHelper('and', function (playerAId,playerBId) {
    return playerAId && playerBId
});


