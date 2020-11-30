import{
    funcClearSessions
}
from '../popups/teamsFormatOthers/teamsFormatsPopup.js'

Template.editSettingsDraws.onCreated(function() {
    this.subscribe("MasterMatchCollections");
    this.subscribe("allEvents");
    this.subscribe("tournamentEvents");
    this.subscribe("MatchCollectionConfig");
    Meteor.subscribe("MatchCollectionDB");
});


Template.editSettingsDraws.onRendered(function() {
    /*$('#scrollableDiv').niceScroll({
		    cursorborderradius: '0px', // Scroll cursor radius
		    background: 'transparent', // The scrollbar rail color
		    cursorwidth: '3px', // Scroll cursor width
		    cursorcolor: 'maroon',
		    autohidemode: true, // Scroll cursor color
		});*/
    validationForm();
    //	Session.set("cancelClicked",undefined);
    //	Session.set("cancelClicked",null);
});

Template.editSettingsDraws.helpers({

    "eventNamePopup": function() {
        return Session.get("eventName");
    },
    "roundNumberPopup": function() {
        try {
            var param = Router.current().params._id;
            var matchConfigContains = MatchCollectionConfig.findOne({
                "tournamentId": param,
                "eventName": Session.get("eventName")
            });
            if (matchConfigContains == undefined) {
                var eventsa = events.findOne({
                    "_id": param
                });
                if(eventsa == undefined)
                {
                    eventsa = pastEvents.findOne({
                        "_id": param
                    });
                }
                var projectId;
                if (eventsa != undefined && eventsa.projectId != undefined) {
                    Session.set("editSetProjectId", eventsa.projectId.toString());
                    Session.set("editSetProjectName", eventsa.projectName.toString());
                    var masterMatch = MasterMatchCollections.findOne({
                        "projectId": eventsa.projectId.toString()
                    });
                    if (masterMatch != undefined) {
                        var jsonRoundsValues = [];
                        var values = {}
                        try {
                            for (var i = 1; i <= parseInt(Session.get("maxRoundNum")); i++) {
                                values = {
                                    roundNumber: i,
                                    noofSets: masterMatch.noofSets,
                                    minScores: masterMatch.minScores,
                                    minDifference: masterMatch.minDifference
                                }
                                if (i == parseInt(Session.get("maxRoundNum"))) {
                                    values["roundName"] = "Final"
                                } else if (i == parseInt(Session.get("maxRoundNum")) - 1) {
                                    values["roundName"] = "Semi Final"
                                } else if (i == parseInt(Session.get("maxRoundNum")) - 2) {
                                    values["roundName"] = "Quarter Final"
                                } else {
                                    values["roundName"] = i
                                }
                                jsonRoundsValues.push(values)
                            }
                        } catch (e) {}
                        return jsonRoundsValues;
                    }
                }
            } else {
                var jsonRoundsValues = [];
                for (i = 0; i < matchConfigContains.roundValues.length; i++) {
                    if (matchConfigContains.roundValues[i].roundName !== "Winner") {
                        jsonRoundsValues.push(matchConfigContains.roundValues[i])
                    }
                }
                return jsonRoundsValues;
            }
        } catch (e) {}
    },
    seedingShow:function(){
        if(Session.get("knockOutValueSess") && 
            Session.get("knockOutValueSess").trim().toLowerCase() == "seeding"){
            return true
        }else{
            return false
        }
    }

});


Template.editSettingsDraws.events({
    'click #downloadforSeeding':function(e){
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
            displayMessage("Cannot download")
        }
    },
    'click [name^=roundNamePopup], change [name^=roundNamePopup]': function(e) {
        e.preventDefault();
        //$("#editSettingsPopupError").html("");
        //$(e.target).css("color","black")
    },
    'click [name^=noofSetsPopup], change [name^=noofSetsPopup]': function(e) {
        e.preventDefault();
        //$("#editSettingsPopupError").html("");
        //$(e.target).css("color","black")
    },

    "keypress [name^=noofSetsPopup]": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true; 
    },
    'click [name^=minPointsPopup], change [name^=minPointsPopup]': function(e) {
        e.preventDefault();
        //$("#editSettingsPopupError").html("");
        //$(e.target).css("color","black")
    },
    "keypress [name^=minPointsPopup]": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true; 
    },
    'click [name^=minDifferencePopup], change [name^=minDifferencePopup]': function(e) {
        e.preventDefault();
        //$("#editSettingsPopupError").html("");
        //$(e.target).css("color","black")
    },
    "keypress [name^=minDifferencePopup]": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true; 
    },
    'submit form': function(e) {
        e.preventDefault();
    },
    "keyup [name^=noofSetsPopup]": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 49 || key > 57) {
            return false;
        } else return true;
    },
    "keyup [name^=minPointsPopup]": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 49 || key > 57) {
            return false;
        } else return true;
    },
    "keyup [name^=minDifferencePopup]": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 49 || key > 57) {
            return false;
        } else return true;
    },
    /* shalini codes starts here */

    "click #cancelEditSettingsDraws": function(e) {

        $("#createDraw").modal('hide');
        $("#knockOut").modal('hide');
        $("#editSettingsDraws").modal('hide');
        $("#editRender").modal('hide');
        $("#createDrawPopUp").empty();
        $("#knockOutPopUp").empty();
        $("#settingsPopUp").empty();
        $("#pointsPopUp").empty();
        $("#downloadTemplatePopUp").empty();

        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        Meteor.call("removeDraws", tournamentId, eventName);
        Session.set("matchRecords", "");
        Session.set("leftRMatches", "");
        Session.set("rightRMatches", "");

    },
    'click #previousCreateDrawORKnockOut': function(e) {
        e.preventDefault();
        var configurationValue = Session.get("configurationValue");

        $("#createDraw").modal('hide');
        $("#editSettingsDraws").modal('hide');
        $("#pointsPopUp").modal('hide');

        if (configurationValue.trim() == "Knock Out" && Session.get("knockOutValueSess")
            && Session.get("knockOutValueSess").trim().toLowerCase()=="random"){
            $("#knockOut").modal('show')
        }
        else if(configurationValue.trim() == "Knock Out" && Session.get("knockOutValueSess")
            && Session.get("knockOutValueSess").trim().toLowerCase()=="seeding"){
             $('#settingsPopUp').empty();
            if ($('#settingsPopUp').is(':empty')) {
                Blaze.render(Template.confirmSeedingDrawsPop, $("#settingsPopUp")[0]);
                $("#confirmSeedingDrawsPop").modal({
                    backdrop: 'static'
                });
            }
        }
        else
            $("#createDraw").modal('show');

    },
    /* shalini codes ends here */

})



var validationForm = function() {
    $('#application-editSettingsDraws').validate({
        onkeyup: false,
        ignore: [],
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            for (var i = 0; i < validator.errorList.length; i++) {
                var q = validator.errorList[i].element;
                $("#" + q.name).css("color", "red");
                $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span>&nbsp;" + validator.errorList[i].message);
            }
        },
        errorPlacement: function(error, element) {},
        submitHandler: function() {
            try {
                var roundValues = [];
                $("#scrollableDiv").find("[name^=roundNumberPopup]").each(function(i) {
                    var roundName = $("input[name='roundNamePopup[" + $(this).val() + "]']").val();
                    var noofSets = $("input[name='noofSetsPopup[" + $(this).val() + "]']").val();
                    var minScores = $("input[name='minPointsPopup[" + $(this).val() + "]']").val();
                    var minDifference = $("input[name='minDifferencePopup[" + $(this).val() + "]']").val();
                    var dataRound = {
                        roundNumber: $(this).val(),
                        roundName: roundName,
                        noofSets: noofSets,
                        minScores: minScores,
                        minDifference: minDifference,
                    }
                    roundValues.push(dataRound);
                });
                var data = {
                    projectId: Session.get("editSetProjectId"),
                    projectMainName: Session.set("editSetProjectName"),
                    tournamentId: Router.current().params._id,
                    eventName: Session.get("eventName"),
                    roundValues: roundValues
                }

                Meteor.call("insertEditSettings", data, function() {
                    Session.set("cancelClicked", undefined);
                    Session.set("jsonRoundsValues", roundValues);
                })

                /* shalini code starts here */
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
                        if ($('#pointsPopUp').is(':empty')) {
                            $("#editSettingsDraws").modal('hide');
                            Blaze.render(Template.editPointsDraws, $("#pointsPopUp")[0]);
                            $("#editPointsDraws").modal({
                                backdrop: 'static'
                            });
                        } else {
                            $("#editSettingsDraws").modal('hide');
                            $("#editPointsDraws").modal('show');

                        }

                    } 
                }
               
                /* shalini code ends  here */



            } catch (e) {
                $('#editPointsDraws').modal('show'); /* shalini code starts here */

            }
        }
    });
    $("#scrollableDiv").find("[name^=roundNumberPopup]").each(function() {
        $(this).rules("add", {
            required1: true,
            validNumberofrounds: /^[0-9]*$/,
        });
    });
    $("#scrollableDiv").find("[name^=roundNamePopup]").each(function() {
        $(this).rules("add", {
            requireds: true,
        });
    });
    $("#scrollableDiv").find("[name^=noofSetsPopup]").each(function() {
        $(this).rules("add", {
            required2: true,
            validNumberNoofsets: /^[0-9]*$/,
            required2Odd: true
        });
    });
    $("#scrollableDiv").find("[name^=minPointsPopup]").each(function() {
        $(this).rules("add", {
            required3: true,
            validNumberMinPoints: /^[0-9]*$/,
        });
    });
    $("#scrollableDiv").find("[name^=minDifferencePopup]").each(function() {
        $(this).rules("add", {
            required4: true,
            validNumberMinDifferencePopup: /^[0-9]*$/,
        });
    });
}

$.validator.addMethod("validNumberNoofsets", function(value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "No. of Sets is not valid");

$.validator.addMethod("validNumberMinPoints", function(value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "Min score is not valid");

$.validator.addMethod("validNumberMinDifferencePopup", function(value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "Min. Difference is not valid");

$.validator.addMethod("validNumberofrounds", function(value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "Round Number is not valid");

$.validator.addMethod("requireds", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "Round Name is required");

$.validator.addMethod("required2", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "No. of Sets is not valid");


$.validator.addMethod("required3", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "Min score is not valid");

$.validator.addMethod("required4", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "Min. Difference is not valid");

$.validator.addMethod("required1", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "Round Number is not valid");

$.validator.addMethod("required2Odd", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) {
        if (value % 2 == 0) {
            return false;
        } else return true;
    } else return false;
}, "No. of sets is not valid");


//team edit settings draws

Template.editSettingsDraws_team.onCreated(function() {
    this.subscribe("MasterMatchCollections");
    this.subscribe("allEvents");
    this.subscribe("tournamentEvents");
    this.subscribe("MatchCollectionConfig");
    Meteor.subscribe("MatchCollectionDB");
});


Template.editSettingsDraws_team.onRendered(function() {
    /*$('#scrollableDiv').niceScroll({
		    cursorborderradius: '0px', // Scroll cursor radius
		    background: 'transparent', // The scrollbar rail color
		    cursorwidth: '3px', // Scroll cursor width
		    cursorcolor: 'maroon',
		    autohidemode: true, // Scroll cursor color
		});*/
    validationForm_Team();
    //	Session.set("cancelClicked",undefined);
    //	Session.set("cancelClicked",null);
});

Template.editSettingsDraws_team.helpers({

    "eventNamePopup_team": function() {
        return Session.get("eventName");
    },
    "roundNumberPopup_team": function() {
        var param = Router.current().params._id;
        var matchConfigContains = MatchTeamCollectionConfig.findOne({
            "tournamentId": param,
            "eventName": Session.get("eventName")
        });
        if (matchConfigContains == undefined) {
            var eventsa = events.findOne({
                "_id": param
            });
            if(eventsa == undefined)
            {
                eventsa = pastEvents.findOne({
                    "_id": param
                });
            }
            var projectId;
            if (eventsa != undefined && eventsa.projectId != undefined) {
                Session.set("editSetProjectId", eventsa.projectId.toString());
                Session.set("editSetProjectName", eventsa.projectName.toString());
                var masterMatch = MasterMatchCollections.findOne({
                    "projectId": eventsa.projectId.toString()
                });
                if (masterMatch != undefined) {
                    var jsonRoundsValues = [];
                    var values = {}
                    try {
                        for (var i = 1; i <= parseInt(Session.get("maxRoundNum")); i++) {
                            values = {
                                roundNumber: i,
                                noofSets: masterMatch.noofSets,
                                minScores: masterMatch.minScores,
                                minDifference: masterMatch.minDifference
                            }
                            if (i == parseInt(Session.get("maxRoundNum"))) {
                                values["roundName"] = "Final"
                            } else if (i == parseInt(Session.get("maxRoundNum")) - 1) {
                                values["roundName"] = "Semi Final"
                            } else if (i == parseInt(Session.get("maxRoundNum")) - 2) {
                                values["roundName"] = "Quater Final"
                            } else {
                                values["roundName"] = i
                            }
                            jsonRoundsValues.push(values)
                        }
                    } catch (e) {}
                    return jsonRoundsValues;
                }
            }
        } else {
            var jsonRoundsValues = [];
            for (i = 0; i < matchConfigContains.roundValues.length; i++) {
                if (matchConfigContains.roundValues[i].roundName !== "Winner") {
                    jsonRoundsValues.push(matchConfigContains.roundValues[i])
                }
            }
            return jsonRoundsValues;
        }
    }
});


Template.editSettingsDraws_team.events({
    'click [name^=roundNamePopup_team], change [name^=roundNamePopup_team]': function(e) {
        e.preventDefault();
        //$("#editSettingsPopupError").html("");
        //$(e.target).css("color","black")
    },
    'click [name^=noofSetsPopup_team], change [name^=noofSetsPopup_team]': function(e) {
        e.preventDefault();
        //$("#editSettingsPopupError").html("");
        //$(e.target).css("color","black")
    },
    'click [name^=noofMatchesPopup_team], change [name^=noofMatchesPopup_team]': function(e) {
        e.preventDefault();
        //$("#editSettingsPopupError").html("");
        //$(e.target).css("color","black")
    },
    'click [name^=minDifferencePopup_team], change [name^=minDifferencePopup_team]': function(e) {
        e.preventDefault();
        //$("#editSettingsPopupError").html("");
        //$(e.target).css("color","black")
    },
    'submit form': function(e) {
        e.preventDefault();
    },
    "keyup [name^=noofSetsPopup_team]": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 49 || key > 57) {
            return false;
        } else return true;
    },
    "keyup [name^=noofMatchesPopup_team]": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 49 || key > 57) {
            return false;
        } else return true;
    },
    "keyup [name^=minDifferencePopup_team]": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 49 || key > 57) {
            return false;
        } else return true;
    },
    /* shalini codes starts here */

    "click #cancelEditSettingsDraws_team": function(e) {

        $("#createDraw").modal('hide');
        $("#knockOut").modal('hide');
        $("#editSettingsDraws_team").modal('hide');
        $("#editRender").modal('hide');
        $("#createDrawPopUp").empty();
        $("#knockOutPopUp").empty();
        $("#settingsPopUpForTeam").empty();
        $("#pointsPopUp").empty();
        $("#downloadTemplatePopUp").empty();

        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        Meteor.call("removeDrawsTeam", tournamentId, eventName);
        Session.set("matchRecords", "");
        Session.set("leftRMatches_team", "");
        Session.set("rightRMatches_team", "");
        funcClearSessions()

    },
    'click #previousCreateDrawORKnockOut_team': function(e) {
        e.preventDefault();
        var configurationValue = Session.get("configurationValue");

        $("#createDraw").modal('hide');
        $("#editSettingsDraws_team").modal('hide');
        $("#pointsPopUp").modal('hide');

        if (configurationValue.trim() == "Knock Out")
            $("#knockOut").modal('show');

        else
            $("#createDraw").modal('show');

    },
    /* shalini codes ends here */

})



var validationForm_Team = function() {
    $('#application-editSettingsDraws_team').validate({
        onkeyup: false,
        ignore: [],
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            for (var i = 0; i < validator.errorList.length; i++) {
                var q = validator.errorList[i].element;
                $("#" + q.name).css("color", "red");
                $("#editSettingsPopupError_team").html("<span class='glyphicon glyphicon-remove-sign red'></span>&nbsp;" + validator.errorList[i].message);
            }
        },
        errorPlacement: function(error, element) {},
        submitHandler: function() {
            try {
                

                Meteor.call("saveOrganizerTeamsFormatAfterValid",Session.get("dataFromTeamFormatCreated"),function(e,res){
                    if(e){}
                    else if(res && res.status==SUCCESS_STATUS){
                        var roundValues = [];
                        
                        $("#scrollableDiv_team").find("[name^=roundNumberPopup_team]").each(function(i) {
                            var roundName = $("input[name='roundNamePopup_team[" + $(this).val() + "]']").val();
                            var noofSets = $("input[name='noofSetsPopup_team[" + $(this).val() + "]']").val();
                            var noofMatches = $("input[name='noofMatchesPopup_team[" + $(this).val() + "]']").val();
                            Meteor.call("drawsCreatedAutoTweet", $("#checkAcceptboxTweett").prop("checked"), Router.current().params._id, Session.get("eventName"), function(e, r) {
                                if (e) {}
                            })
                            var dataRound = {
                                roundNumber: $(this).val(),
                                roundName: roundName,
                                noofSets: noofSets,
                                noofMatches: noofMatches,
                            }
                            roundValues.push(dataRound);
                        });
                        var data = {
                            projectId: Session.get("editSetProjectId"),
                            projectMainName: Session.set("editSetProjectName"),
                            tournamentId: Router.current().params._id,
                            eventName: Session.get("eventName"),
                            roundValues: roundValues,
                            teamFormatId:res.data
                        }

                        Meteor.call("insertMatchConfigForTeam", data, function() {
                            Session.set("cancelClicked", undefined);
                            Session.set("jsonRoundsValues", roundValues);
                        })

                        /* shalini code starts here */
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
                                $('#knockOutPopUp').empty()
                                if ($('#pointsPopUp').is(':empty')) {
                                    $("#editSettingsDraws_team").modal('hide');
                                    //Blaze.render(Template.editPointsDraws, $("#pointsPopUp")[0]);
                                    //$("#editPointsDraws").modal({
                                    //  backdrop: 'static'
                                    //});
                                } else {
                                    $("#editSettingsDraws_team").modal('hide');
                                    //$("#editPointsDraws").modal('show');

                                }

                            }
                            /* shalini code ends  here */  
                        }
                    }
                    else if(res && res.status==FAIL_STATUS){
                        alert("Unexpected error, Please reset draws and create again")
                    }else{
                        alert("Unexpected error, Please reset draws and create again")
                    }
                    funcClearSessions()
                })
                
                



            } catch (e) {
                funcClearSessions()
                $('#editPointsDraws_team').modal('show'); /* shalini code starts here */

            }
        }
    });
    $("#scrollableDiv_team").find("[name^=roundNumberPopup_team]").each(function() {
        $(this).rules("add", {
            required1_team: true,
            validNumberofrounds_team: /^[0-9]*$/,
        });
    });
    $("#scrollableDiv_team").find("[name^=roundNamePopup_team]").each(function() {
        $(this).rules("add", {
            requireds_team: true,
        });
    });
    $("#scrollableDiv_team").find("[name^=noofSetsPopup_team]").each(function() {
        $(this).rules("add", {
            required2_team: true,
            validNumberNoofsets_team: /^[1-7]{1,7}$/,
            required2Odd_team: true
        });
    });
    $("#scrollableDiv_team").find("[name^=noofMatchesPopup_team]").each(function() {
        $(this).rules("add", {
            required3_team: true,
            validNumberMinPoints_team: /^[1-7]{1,7}$/,
        });
    });
    $("#scrollableDiv_team").find("[name^=minDifferencePopup_team]").each(function() {
        $(this).rules("add", {
            required4_team: true,
            validNumberMinDifferencePopup_team: /^[1-7]{1,7}$/,
        });
    });
}

$.validator.addMethod("validNumberNoofsets_team", function(value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "No. of Sets is not valid");

$.validator.addMethod("validNumberMinPoints_team", function(value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "Number of rounds is not valid");

$.validator.addMethod("validNumberMinDifferencePopup_team", function(value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "Min. Difference is not valid");

$.validator.addMethod("validNumberofrounds_team", function(value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "Round Number is not valid");

$.validator.addMethod("requireds_team", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "Round Name is required");

$.validator.addMethod("required2_team", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "No. of Sets is not valid");


$.validator.addMethod("required3_team", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "Min score is not valid");

$.validator.addMethod("required4_team", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "Min. Difference is not valid");

$.validator.addMethod("required1_team", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) return true;
    else return false;
}, "Round Number is not valid");

$.validator.addMethod("required2Odd_team", function(value, element, regexp) {
    var r = value.trim().length
    if (r !== 0) {
        if (value % 2 == 0) {
            return false;
        } else return true;
    } else return false;
}, "No. of sets is not valid");