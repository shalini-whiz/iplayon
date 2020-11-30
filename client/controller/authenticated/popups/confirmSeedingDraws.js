import {
    fnGetMatches
}
from './knockOut.js'
import {
    JSONToCSVConvertor
}
from './downloadTemplateXXX'

Template.confirmSeedingDrawsPop.onCreated(function() {
    $(".modal-backdrop").remove();
});


Template.confirmSeedingDrawsPop.onRendered(function() {

});

Template.confirmSeedingDrawsPop.helpers({
    "eventNamePopup": function() {
        return Session.get("eventName");
    },
    "playerDetailsSeeding": function() {
        if (Session.get("seedingDrawsDataForConfirm"))
            return Session.get("seedingDrawsDataForConfirm")
    }
});


Template.confirmSeedingDrawsPop.events({
    "click #detailsconfirmSeedingDraws":function(){
        if (Session.get("seedingDrawsDataForConfirm") && Session.get("eventName")){
            //var key = ["Name","Affiliation ID", "Points"]
            //var k = JSON.parse(JSON.stringify(Session.get("seedingDrawsDataForConfirm"), key,3));
            //JSONToCSVConvertor(k,Session.get("eventName") , true,"");
            Meteor.call("seedingDetailsDownload",Session.get("tournamentId"),Session.get("eventName"),Session.get("seedingDrawsDataForConfirm"),function(e,res){
                if (res) {
                    window.open("data:application/pdf;base64, " + res);
                }
            })
        }
        else{
            $('#impMsgConfirm').text("Cannot download")
        }
    },

    "click #confirmSeedingDraws": function(event) {
        if (Session.get("res3Data") && Session.get("res3Data") != undefined && Session.get("res3Data") != null && Session.get("res3Data") != 0 && Session.get("res3concatenated") && Session.get("res3concatenated").length) {
            var configurationValue = Session.get("configurationValue");
            $('#createDraw').modal('hide');
           
            $('#pointsPopUp').modal('hide');
            $('#editSettingsDraws').modal('show');

            let tournament = events.findOne({
                "_id": Session.get("tournamentId")
            });
            if (tournament.eventOrganizer != Meteor.userId()) {
                return false;
            } else {
                $('#confirmSeedingDrawsPop').modal('hide');
                $('#settingsPopUp').empty();
                if ($('#settingsPopUp').is(':empty')) {
                    Blaze.render(Template.editSettingsDraws, $("#settingsPopUp")[0]);
                    $("#editSettingsDraws").modal({
                        backdrop: 'static'
                    });
                } else
                    $('#editSettingsDraws').modal('show');
            }
        } else {
            alert("cannot uplaod !!")
        }
    },
    "click #cancelconfirmSeedingDraws": function(e) {

        $("#createDraw").modal('hide');
        $("#knockOut").modal('hide');
        $("#confirmSeedingDrawsPop").modal('hide');
        $("#editRender").modal('hide');
        $("#createDrawPopUp").empty();
        $("#knockOutPopUp").empty();
        $("#settingsPopUpForTeam").empty();
        $("#pointsPopUp").empty();
        $("#downloadTemplatePopUp").empty();

        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");

        Meteor.call("removeDraws", tournamentId, eventName);
        Session.set("matchRecords", "");
        Session.set("leftRMatches", "");
        Session.set("rightRMatches", "");

        Meteor.call("resetMatchRecords", tournamentId, eventName);
        Session.set("matchRecords", "");
        Session.set("leftRMatches_team", "");
        Session.set("rightRMatches_team", "");
        Session.set("seedingDrawsDataForConfirm", undefined)
        Session.set("res3Data", undefined)
        Session.set("res3concatenated", undefined)

    },
    /* shalini code starts here */
    'click #previousconfirmSeedingDraws': function(e) {
        e.preventDefault();
        $("#createDraw").modal('hide');
        $("#confirmSeedingDrawsPop").modal('hide');
        $("#pointsPopUp").modal('hide');
        var configurationValue = Session.get("configurationValue");
        if (configurationValue.trim() == "Knock Out")
            $("#knockOut").modal('show');
    },

    'click #reshuffleSeedingDraws': function(e) {
        try {
            Meteor.call("resetMatchRecords", Session.get("tournamentId"), Session.get("eventName"));
            $("#confirmSeedingDraws").attr("disabled", false)
            $('#impMsgConfirm').text("")
            if (Session.get("res3Data") && Session.get("res3Data") != undefined && Session.get("res3Data") != null && Session.get("res3Data") != 0 && Session.get("res3concatenated") && Session.get("res3concatenated").length) {

                $("#previousconfirmSeedingDraws").attr("disabled", true)
                $("#reshuffleSeedingDraws").attr("disabled", true)

                $("#createDrawSettings").attr("disabled", true)
                $('#impMsgConfirm').text("Reshuffling & Assigning position , Please wait !!")
                Meteor.call("mergeArrayWithData", Session.get("res3Data"), Session.get("res3concatenated"), function(e2, res2) {
                    if (res2 && res2.data != undefined && res2.data != null && res2.data != 0) {
                        
                        Session.set("seedingDrawsDataForConfirm", res2)
                        //init match records

                        Meteor.call("resetMatchRecords", Session.get("tournamentId"), Session.get("eventName"));
                        Meteor.call("initMatchRecords", Session.get("tournamentId"), Session.get("eventName"), Session.get("eventId_Draws"), res2,
                            function(error, result) {
                                if (result) {
                                    if (result.length == 0) {
                                        $('#impMsgConfirm').html("* Could not upload!!");
                                        $('#confirmSeedingDraws').attr("style", "background:grey !important");
                                        $('#confirmSeedingDraws').attr("disabled", true);
                                    } else if (result[0].message == undefined && result.length > 0) {
                                        matches = result;
                                        Session.set("maxRoundNum", matches[matches.length - 1].roundNumber);
                                        Session.set("maxGroupNum", matches.length / 16);
                                        Session.set("showDraws", true);
                                        for (let i = 0; i < matches.length; i++) {
                                           var match = matches[i];
                                        }
                                        $("#previousconfirmSeedingDraws").attr("disabled", false)
                                        $("#reshuffleSeedingDraws").attr("disabled", false)
                                        $('#impMsgConfirm').text("Reshuffle success and Upload complete! , click cofirm / re-shuffle")
                                        $("#createDrawSettings").attr("disabled", false)
                                        Bert.alert('Upload complete!', 'success', 'growl-top-right');
                                        fnGetMatches();
                                    } else if (e) {
                                        alert(e)
                                    } else {
                                        var htmlContent = "";
                                        for (var t = 0; t < result.length; t++) {
                                                htmlContent += result[t].player + " " + result[t].message + " <br>";
                                        }
                                        $('#impMsgConfirm').html("* " + htmlContent);
                                        $('#impMsgConfirm').attr("style", "overflow-y:scroll !important;height:50px");
                                        $('#confirmSeedingDraws').attr("style", "background:grey !important");
                                        $('#confirmSeedingDraws').attr("disabled", true);
                                    }

                                }

                            });

                            //call for confirmation

                    } else if (res2 && res2.data != undefined && res2.data != null && res2.data == 0) {
                        $('#impMsgConfirm').text(res2.message)
                    } else if (e2) {
                        $('#impMsgConfirm').text(e2.reason)
                    }
                })
            }
        } catch (e) {
            alert(e)
        }      
    }

})