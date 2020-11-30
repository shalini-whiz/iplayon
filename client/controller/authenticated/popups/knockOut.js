import {
    fnGetTeamMatches
}
from '../draws/eventTournamentDraws.js'

import{
    funcClearSessions
}
from '../popups/teamsFormatOthers/teamsFormatsPopup.js'

Template.knockOut.onRendered(function() {
    Session.set("uploadedFileData", undefined);
    Session.set("projectTypeOfEvent", undefined);
    Session.set("seedingDrawsDataForConfirm",undefined)
    Session.set("res3Data",undefined)
    Session.set("res3concatenated",undefined)
    Session.set("knockOutValueSess",undefined)
    Session.set("drawsErrorLog",undefined);

})

/* shalini codes starts here */
Template.knockOut.helpers({

    currentEventName: function() {
        if (Session.get("eventName"))
            return Session.get("eventName");
        else
            return "Select Event"
    },

});

Template.knockOut.events({
    'change #knockOutDropDown':function(){
        $('#knockOut').find('#impMsg').html("");
        $('#knockOut').find('#impMsg').attr("style", "");
        $('#knockOut').find('#createDrawSettings').attr("style", "");
        $('#knockOut').find('#createDrawSettings').attr("disabled", false);
        Session.set("projectTypeOfEvent", undefined)
        Session.set("uploadedFileData", undefined);
        $('input[name=playersListFiles]').val(null);
        Session.set("seedingDrawsDataForConfirm",undefined)
        Session.set("res3Data",undefined)
        Session.set("res3concatenated",undefined)
        Session.set("knockOutValueSess",undefined)
        Meteor.call("resetMatchRecords", Session.get("tournamentId"), Session.get("eventName"));
    },
    'change [name="playersListFiles"]': function(event, template) {
        try{
        $('#knockOut').find('#impMsg').html("");
        $('#knockOut').find('#impMsg').attr("style", "");
        $('#knockOut').find('#createDrawSettings').attr("style", "");
        $('#knockOut').find('#createDrawSettings').attr("disabled", false);
        var knockOutValue = $("[name='knockOutList']").val();
        Session.set("seedingDrawsDataForConfirm",undefined)
        Session.set("res3Data",undefined)
        Session.set("res3concatenated",undefined)
        Session.set("knockOutValueSess",undefined);
        Session.set("drawsErrorLog",undefined);

        var fileExtension = ['csv'];
        if ($.inArray($('input[name="playersListFiles"]').val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            $('#knockOut').find('#impMsg').html("Only csv format is allowed");
            return false
        }

        var fileHandle = event.target.files[0];
        var matches;

        if (knockOutValue && knockOutValue.trim().toLowerCase() == "readymade" && 
            Session.get("eventName") !== false && Session.get("eventName") !== null && 
            Session.get("eventName") !== undefined) 
        {
            var eventDetails = events.findOne({
                "tournamentId": Session.get("tournamentId"),eventName: Session.get("eventName")
            });
            if(eventDetails == undefined)
            {
                eventDetails = pastEvents.findOne({
                    "tournamentId": Session.get("tournamentId"),eventName: Session.get("eventName")
                });
            }
            if (eventDetails && eventDetails.projectType) 
            {
                $("#knockOutDropDown").attr("disabled",true)
                Session.set("projectTypeOfEvent", eventDetails.projectType)
            }
            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2)
            {
                /*if (parseInt(fileData.data.length) % 2 !== 0) 
                {
                    $('#knockOut').find('#impMsg').html("* Could not upload!!");
                    $('#knockOut').find('#createDrawSettings').attr("style", "background:grey !important");
                    $('#knockOut').find('#createDrawSettings').attr("disabled", true);
                } */
               // else 
              //  {
                    Papa.parse(fileHandle, {
                        header: 
                        true,keepEmptyRows:false,
                        skipEmptyLines: true,
                        beforeFirstChunk: function( chunk ) 
                        {
                            var rows = chunk.split( /\r\n|\r|\n/ );
                            Session.set("errorsInHead",0)
                            return chunk;
                                            
                        },
                        complete: function(fileData, file) 
                        {
                            var data = {
                                tournamentId:Session.get("tournamentId"),
                                eventName:Session.get("eventName"),
                                fileData:fileData.data
                            }
                            Session.set("uploadedFileData", fileData.data);
                            Meteor.call("initTeamMatchRecords",data,function(e,res){
                                if(e){
                                    alert(e)
                                    $('#knockOut').find('#impMsg').html("* Could not upload!!");
                                    $('#knockOut').find('#createDrawSettings').attr("style", "background:grey !important");
                                    $('#knockOut').find('#createDrawSettings').attr("disabled", true);
                                }
                                else if(res  && res.status == SUCCESS_STATUS && res.data){
                                    matches = res.data;
                                    Session.set("maxRoundNum", matches[matches.length - 1].roundNumber);
                                    Session.set("maxGroupNum", matches.length / 16);
                                    Session.set("showDraws", true);
                                    for (let i = 0; i < matches.length; i++) {
                                        var match = matches[i];
                                    }
                                    Bert.alert('Upload complete!', 'success', 'growl-top-right');
                                    fnGetTeamMatches();
                                }
                                else if(res && res.status == FAIL_STATUS){
                                    $('#knockOut').find('#impMsg').html("* Could not upload!!");
                                    $('#knockOut').find('#createDrawSettings').attr("style", "background:grey !important");
                                    $('#knockOut').find('#createDrawSettings').attr("disabled", true);
                                }
                            })


                        }
                    })
   
                //}
            }
            else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1)
            {
                var errorLog = [];
                Papa.parse(fileHandle, {
                    header: true,
                    keepEmptyRows: false,
                    skipEmptyLines: true,
                    beforeFirstChunk: function(chunk) {
                            var rows = chunk.split(/\r\n|\r|\n/);
                            var headings = rows[0].split(',');
                            var key = ["\"Sl.No\"", "\"Name\"", "\"Affiliation ID\"", "\"Academy Name\""];
                            var key1 = ["Sl.No", "Name", "Affiliation ID", "Academy Name"];

                            if ((_.isEqual(headings, key)) || (_.isEqual(headings,key1))) {
                                Session.set("errorsInHead", 0)
                                return chunk;
                            } else {
                                 var message = "Unequal headers, headers should be in the following format:["+key+"]";                  
                                errorLog.push(message);
                                Session.set("drawsErrorLog",errorLog)
                                Bert.alert(message, 'danger', 'growl-top-right');
                                return false;
                            }
                        },
                   
                    
                    complete: function(fileData, file) {
                        if (fileData.errors[0] && fileData.errors[0].row && fileData.errors[0].row == 1) {
                            Bert.alert('Cannot create draws with one player!', 'danger', 'growl-top-right');
                        } 
                        else
                        {
                            try {
                                //check for team or single event
                                if(Session.get("drawsErrorLog"))
                                {
                                    var errorMsg = Session.get("drawsErrorLog").toString();
                                    Bert.alert(errorMsg, 'danger', 'growl-top-right');

                                }
                                else
                                {
                                    
                                    Session.set("uploadedFileData", fileData.data);
                                    Meteor.call("resetMatchRecords", Session.get("tournamentId"), Session.get("eventName"));
                                    Meteor.call("initMatchRecords", Session.get("tournamentId"), Session.get("eventName"), Session.get("eventId_Draws"), fileData,
                                            function(error, result) {
                                                if (result) {
                                                    if (result.length == 0) {
                                                        $('#knockOut').find('#impMsg').html("* Could not upload!!");
                                                        $('#knockOut').find('#createDrawSettings').attr("style", "background:grey !important");
                                                        $('#knockOut').find('#createDrawSettings').attr("disabled", true);
                                                    } else if (result[0].message == undefined && result.length > 0) {
                                                        matches = result;
                                                        Session.set("maxRoundNum", matches[matches.length - 1].roundNumber);
                                                        Session.set("maxGroupNum", matches.length / 16);
                                                        Session.set("showDraws", true);
                                                        for (let i = 0; i < matches.length; i++) {
                                                            var match = matches[i];
                                                        }
                                                        Bert.alert('Upload complete!', 'success', 'growl-top-right');
                                                        fnGetMatches();
                                                    } else {
                                                        var htmlContent = "";

                                                        for (var t = 0; t < result.length; t++) {
                                                            htmlContent += result[t].player + " " + result[t].message + " <br>";
                                                        }
                                                        $('#knockOut').find('#impMsg').html("* " + htmlContent);
                                                        $('#knockOut').find('#impMsg').attr("style", "overflow-y:scroll !important;height:50px");
                                                        $('#knockOut').find('#createDrawSettings').attr("style", "background:grey !important");
                                                        $('#knockOut').find('#createDrawSettings').attr("disabled", true);
                                                        $("#knockOutDropDown").attr("disabled",true)

                                                    }

                                                }

                                            });
                                    
                                }
                                

                            } catch (e) {

                            }
                        }
                    }
                });
            }
        } 
        else if (knockOutValue && knockOutValue.trim().toLowerCase() == "seeding" && Session.get("eventName") !== false && Session.get("eventName") !== null && Session.get("eventName") !== undefined) {
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
            if (eventDetails && eventDetails.projectType && eventDetails.projectType == 1) {
                $("#knockOutDropDown").attr("disabled",true)
                var fileHandle = event.target.files[0];
                var matches;
                Papa.parse(fileHandle, {
                    header: true,
                    keepEmptyRows: false,
                    skipEmptyLines: true,
                    complete: function(fileData, file) {
                        if (fileData.errors[0] && fileData.errors[0].row && fileData.errors[0].row == 1) {
                            Bert.alert('Cannot create draws with one player!', 'danger', 'growl-top-right');
                        } else {
                            try {
                                if (eventDetails && eventDetails.projectType) {
                                    Session.set("projectTypeOfEvent", eventDetails.projectType)
                                }
                                if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1 && 
                                    eventDetails.projectId && eventDetails.projectId.length) {
                                    Session.set("uploadedFileData", fileData.data);
                                    
                                    $('#knockOut').find('#impMsg').text("Validating each player's details and fetching each player's position , Please wait !!")
                                    $("#createDrawSettings").attr("disabled",true)
                                    
                                    Meteor.call("validationForEventParticipantsSeeding",Session.get("tournamentId"),Session.get("eventName"),eventDetails.projectId[0],fileData,function(e3,res3){
                                        if(res3 && res3.data != undefined && res3.data != null && res3.data != 0 && res3.concatenated && res3.concatenated.length){
                                            $("#createDrawSettings").attr("disabled",true)
                                            $('#knockOut').find('#impMsg').text("Assigning position , Please wait !!")
                                            Session.set("res3Data",res3.data)
                                            Session.set("res3concatenated",res3.concatenated)
                                            Meteor.call("mergeArrayWithData",res3.data,res3.concatenated,function(e2,res2){
                                                if(res2 && res2.data != undefined && res2.data != null && res2.data != 0){
                                                    $("#createDrawSettings").attr("disabled",false)

                                                    
                                                    Session.set("seedingDrawsDataForConfirm",res2.data)
                                                    //init match records

                                                    Meteor.call("resetMatchRecords", Session.get("tournamentId"), Session.get("eventName"));
                                                    Meteor.call("initMatchRecords", Session.get("tournamentId"), Session.get("eventName"), Session.get("eventId_Draws"), res2,
                                                        function(error, result) {
                                                            if (result) {
                                                                if (result.length == 0) {
                                                                    $('#knockOut').find('#impMsg').html("* Could not upload!!");
                                                                    $('#knockOut').find('#createDrawSettings').attr("style", "background:grey !important");
                                                                    $('#knockOut').find('#createDrawSettings').attr("disabled", true);
                                                                } else if (result[0].message == undefined && result.length > 0) {
                                                                    $('#knockOut').find('#impMsg').text("Validation success and Upload complete!, click continue")
                                                                    matches = result;
                                                                    Session.set("maxRoundNum", matches[matches.length - 1].roundNumber);
                                                                    Session.set("maxGroupNum", matches.length / 16);
                                                                    Session.set("showDraws", true);
                                                                    for (let i = 0; i < matches.length; i++) {
                                                                        var match = matches[i];
                                                                    }
                                                                    Bert.alert('Upload complete!', 'success', 'growl-top-right');
                                                                    fnGetMatches();
                                                                } 
                                                                else if(e){
                                                                    displayMessage(e)
                                                                }
                                                                 else {
                                                                    var htmlContent = "";

                                                                    for (var t = 0; t < result.length; t++) {
                                                                        htmlContent += result[t].player + " " + result[t].message + " <br>";
                                                                    }
                                                                    $('#knockOut').find('#impMsg').html("* " + htmlContent);
                                                                    $('#knockOut').find('#impMsg').attr("style", "overflow-y:scroll !important;height:50px");
                                                                    $('#knockOut').find('#createDrawSettings').attr("style", "background:grey !important");
                                                                    $('#knockOut').find('#createDrawSettings').attr("disabled", true);
                                                                    $("#knockOutDropDown").attr("disabled",true)

                                                                }

                                                            }

                                                        });
                                                    
                                                    //call for confirmation

                                                }
                                                else if(res2 && res2.data != undefined && res2.data != null &&  res2.data == 0){
                                                    $('#knockOut').find('#impMsg').text(res2.message)
                                                }
                                                else if(e2){
                                                    $('#knockOut').find('#impMsg').text(e2.reason)
                                                }
                                            })
                                        }
                                        else if(res3 && res3.data != undefined && res3.data != null && res3.data == 0 && res3.message){
                                            $("#createDrawSettings").attr("disabled",true)
                                            $('#knockOut').find('#impMsg').text(res3.message)
                                        }
                                        else if(e3){
                                            $("#ip_button_Popup_Black").attr("disabled",true)
                                            $('#knockOut').find('#impMsg').text(e3.reason)
                                        }
                                    })
                                } 
                            } catch (e) {
                                displayMessage(e)
                            }
                        }
                    }
                });
            } else {
                $("#impMsg").text("* Cannot upload for selected event");
            }
        } else
            $("#impMsg").text("* Please select event");
        }catch(e){
            alert(e)
        }
    },

    'click #previousCreateDraw': function(e) {
        e.preventDefault();
        var eventDetails = events.findOne({
            "tournamentId": Session.get("tournamentId"),
            eventName: Session.get("eventName")
        });
        if(eventDetails == undefined){
            eventDetails = pastEvents.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("eventName")
            });
        }

        if (eventDetails && eventDetails.projectType && 
            parseInt(eventDetails.projectType) == 2) {
            $("#knockOut").modal('hide')

            if(Session.get("selectedDetailsSess") 
                && Session.get("selectedDetailsSess")._id){
                $("#selectTeamFormatsOldNew").modal('show')
            }else if(Session.get("selectedDetailsSess")){
                $("#teamsFormatsPopup").modal('show')
            }
            
        }
        else{
            $('#createDraw').modal('show');
            $('#knockOut').modal('hide');
            $('#pointsPopUp').modal('hide');
            $('#editSettingsDraws').modal('hide');
            
        }

    },

    'click #createDrawSettings': function(e) {
        e.preventDefault();
        if(Session.get("drawsErrorLog"))
        {
            var errorMsg = Session.get("drawsErrorLog").toString();
            Bert.alert(errorMsg, 'danger', 'growl-top-right');
        }
        else
        {
            var knockOutValue = $("[name='knockOutList']").val();
            Session.set("knockOutValueSess",knockOutValue)

            if (knockOutValue && knockOutValue.trim().toLowerCase() == "readymade" && parseInt(Session.get("projectTypeOfEvent")) == 1)
             {
                var fileHandle = $("#uploadConfigurationFile").find('input[type=file]')[0].files[0];
                if (knockOutValue && fileHandle != undefined) {
                    var configurationValue = Session.get("configurationValue");
                    $('#createDraw').modal('hide');
                    $('#knockOut').modal('hide');
                    $('#pointsPopUp').modal('hide');
                    $('#editSettingsDraws').modal('show');

                    let tournament = events.findOne({
                        "_id": Router.current().params._id
                    });
                    if(tournament == undefined)
                    {
                        tournament = pastEvents.findOne({
                            "_id": Router.current().params._id
                        });
                    }
                    if(tournament)
                    {
                        if (tournament.eventOrganizer != Meteor.userId()) {
                            return false;
                        } else {
                            $('#settingsPopUpForTeam').empty();
                            if ($('#settingsPopUp').is(':empty')) {
                                Blaze.render(Template.editSettingsDraws, $("#settingsPopUp")[0]);
                                $("#editSettingsDraws").modal({
                                    backdrop: 'static'
                                });
                            } else
                                $('#editSettingsDraws').modal('show');
                        } 
                    }
                   
                } else if (knockOutValue == null && fileHandle != undefined)
                    $('#knockOut').find('#impMsg').text("* Knockout type required");
                else if (knockOutValue != null && fileHandle == undefined)
                    $('#knockOut').find('#impMsg').text("* Please upload file");
                else
                    $('#knockOut').find('#impMsg').text("* Uploading file and Knockout type selection required");
            } else if (knockOutValue && knockOutValue.trim().toLowerCase() == "readymade" && parseInt(Session.get("projectTypeOfEvent")) == 2) {
                var fileHandle = $("#uploadConfigurationFile").find('input[type=file]')[0].files[0];

                if (knockOutValue && fileHandle != undefined) {
                    var configurationValue = Session.get("configurationValue");
                    $('#createDraw').modal('hide');
                    $('#knockOut').modal('hide');
                    $('#pointsPopUp').modal('hide');
                    $('#editSettingsDraws').modal('show');

                    let tournament = events.findOne({
                        "_id": Router.current().params._id
                    });
                    if(tournament == undefined)
                    {
                        tournament = pastEvents.findOne({
                            "_id": Router.current().params._id
                        });
                    }
                    if(tournament)
                    {
                        if (tournament.eventOrganizer != Meteor.userId()) {
                            return false;
                        } else {
                            $('#settingsPopUp').empty();
                            if ($('#settingsPopUpForTeam').is(':empty')) {
                                Blaze.render(Template.editSettingsDraws_team, $("#settingsPopUpForTeam")[0]);
                                $("#editSettingsDraws_team").modal({
                                    backdrop: 'static'
                                });
                            } else {}
                            $('#editSettingsDraws_team').modal('show');
                        } 
                    }
                   
                } else if (knockOutValue == null && fileHandle != undefined)
                    $('#knockOut').find('#impMsg').text("* Knockout type required");
                else if (knockOutValue != null && fileHandle == undefined)
                    $('#knockOut').find('#impMsg').text("* Please upload file");
                else
                    $('#knockOut').find('#impMsg').text("* Uploading file and Knockout type selection required");
            } 

            else if(knockOutValue && knockOutValue.trim().toLowerCase() == "seeding" && parseInt(Session.get("projectTypeOfEvent")) == 1){
                if(Session.get("seedingDrawsDataForConfirm") ){
                    let tournament = events.findOne({
                        "_id": Router.current().params._id
                    });
                    if(tournament == undefined)
                    {
                        tournament = pastEvents.findOne({
                            "_id": Router.current().params._id
                        });
                    }
                    if(tournament)
                    {
                        if (tournament.eventOrganizer != Meteor.userId()) {
                            return false;
                        }
                        else{
                            //call for confirmation
                            $('#createDraw').modal('hide');
                            $('#knockOut').modal('hide');
                            $('#pointsPopUp').modal('hide');

                            if ($('#settingsPopUp').is(':empty')) {
                                Blaze.render(Template.confirmSeedingDrawsPop, $("#settingsPopUp")[0]);
                                $("#confirmSeedingDrawsPop").modal({
                                    backdrop: 'static'
                                });
                                $(".modal-backdrop").remove();
                            } else{
                                $('#confirmSeedingDrawsPop').modal('show');
                                $(".modal-backdrop").remove();
                            }
                        } 
                    }
                    
                }else{
                    $('#knockOut').find('#impMsg').text("* Please upload file");
                }
            }
            else if (knockOutValue == null && fileHandle != undefined){
                $('#knockOut').find('#impMsg').text("* Knockout type required");
            } 
        }

       
    },

    'click #closeKnockOut': function(e) {
        $("#createDrawPopUp").empty();
        $("#knockOutPopUp").empty();
        $("#settingsPopUp").empty();
        $("#pointsPopUp").empty();
        $("#downloadTemplatePopUp").empty();
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
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
        if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
            Meteor.call("removeDraws", tournamentId, eventName);
            Session.set("matchRecords", "");
            Session.set("leftRMatches", "");
            Session.set("rightRMatches", "");
        } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
            Meteor.call("removeDrawsTeam", tournamentId, eventName);
            Session.set("matchRecords", "");
            Session.set("leftRMatches_team", "");
            Session.set("rightRMatches_team", "");
            funcClearSessions()
        }
    }
});



export const fnGetMatches = function() {
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        var roundNumber = Session.get("selectedRound");
        Meteor.call("getMatchesFromDB", tournamentId, eventName, function(error, result) {
            if (error) {} else {
                try {
                    var eventInfo = events.findOne({
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
                        var tourInfo = events.findOne({
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
        });
    }
    /* shalini codes ends here */