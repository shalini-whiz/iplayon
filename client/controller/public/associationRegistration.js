import {
    routeForsubscription
}
from '../../routes/hooks.js'

Template.associationType.onRendered(function() {
    $("#associationType").on('show.bs.modal', function() {
        $('.modal-content').scrollTop(0);
        $("#scroll5").scrollTop(0);;
    });
    $('#selectTagopStateAssociation').niceScroll({
        cursorborderradius: '0px', // Scroll cursor radius
        background: 'transparent', // The scrollbar rail color
        cursorwidth: '3px', // Scroll cursor width
        cursorcolor: 'maroon',
        autohidemode: true, // Scroll cursor color
    });
});

Template.associationType.events({

    'click #prev-associationType': function(e) {
        e.preventDefault();
        $('#associationType').modal('hide');
        $('#modReg1').modal({
            backdrop: 'static'
        });;


    },

    'click #next-associationRegistrationTab': function(e) {
        e.preventDefault();
        if (Session.get('associationType') == null) {
            $("#associationType").find("#impMsg").text("* Please select associationType");
            $('#associationType').modal({
                backdrop: 'static'
            });;
        } else {
            $("#associationType").find("#impMsg").text("");

            $('#associationType').modal('hide');
            if ($('#mod6').is(':empty')) {
                Blaze.render(Template.associationRegistrationTabs, $("#mod6")[0]);
                $('#associationRegistrationTabs').modal({
                    backdrop: 'static'
                });;
            } else {
                $('#associationRegistrationTabs').modal({
                    backdrop: 'static'
                });;

            }


        }
    }
})

/***************** association registration tabs **************************/
Template.associationRegistrationTabs.onCreated(function() {
    this.subscribe("timeZone");
    this.subscribe("onlyLoggedIn")
});

Template.associationRegistrationTabs.helpers({

    "stateList_assoc": function() {
        var stateList = timeZone.findOne({
            "countryName": "India"
        });
        if (stateList != undefined) {
            return stateList.state;
        }
    },
    "setDays": function() {
        var s = [];
        for (i = 1; i < 32; i++) {
            s.push(i);
        }
        return s;
    },
    setMonths: function() {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var s = [];
        for (i = 1; i < 13; i++) {
            s.push(i);
        }
        return s;
    },
    setYears: function() {
        var s = [];
        for (i = new Date().getFullYear(); i > 1900; i--) {
            s.push(i);
        }
        return s;
    }
});

Template.associationRegistrationTabs.events({
    "click #confirmModalRedirectYes": function(e) {
        e.preventDefault();
        var id = "";
        if (Session.get("clickedIDToRed"))
            id = Session.get("clickedIDToRed")
        else
            id = "";
        Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
        $("#confirmModalRedirect").modal('hide');
        $("#alreadySubscribed_entryFromAca").modal('hide');
        var type = Session.get("hyperLINKValue")
        $('.modal-backdrop').remove();
        //if the subscription type is hyperlink
        //route to hyper link
        if (type) {
            var s = type
                //if the web site doesn't contains https
            if (!s.match(/^https?:\/\//i)) {
                s = 'http://' + s;
            }
            window.open(s, '_blank');
        }
    },

    'change #associationName': function(e) {
        $("#associationName").css({
            "color": ""
        });;
        e.preventDefault();
        Session.set('associationName', $("#associationName").val());
    },

    'keyup #associationName': function(e) {
        $("#associationName").css({
            "color": ""
        });;
        e.preventDefault();
        Session.set('associationName', $("#associationName").val());
    },

    'change #userNameContactmodReg2': function() {
        $("#userNameContactmodReg2").css({
            "color": ""
        });;
        Session.set('userNameContactmodReg2', $("#userNameContactmodReg2").val());
    },

    'keyup #userNameContactmodReg2': function() {
        $("#userNameContactmodReg2").css({
            "color": ""
        });;
        Session.set('userNameContactmodReg2', $("#userNameContactmodReg2").val());
    },

    "keypress #mobileNumber": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    'keyup #mobileNumber': function(e) {
        $("#mobileNumber").css({
            "color": ""
        });;
        Session.set('mobileNumber', e.target.value);
    },
    "change #state": function() {
        $("#state").css({
            "color": ""
        });;
        Session.set("stateOfAssoc", $("#state").val());
    },
    'change  #months_I': function(e) {
        $("#months_I").css({
            "color": ""
        });;
        Session.set("MMOfINC", $("#months_I").val())
        updateNumberOfDays_Inc();
    },
    'change #years_I': function(e) {
        $("#years_I").css({
            "color": ""
        });;
        Session.set("YYOfINC", $("#years_I").val())
        updateNumberOfDays_Inc();
    },
    'change #days_I': function(e) {
        $("#days_I").css({
            "color": ""
        });;
        Session.set("DDOfINC", $("#days_I").val())
    },

    'change #address_I': function() {
        Session.set('address', $("#address_I").val());
    },

    'keyup #address_I': function() {
        Session.set('address', $("#address_I").val());
    },

    //city

    'change #city_I': function() {
        $("#city_I").css({
            "color": ""
        });;
        Session.set('city', $("#city_I").val());
    },

    'keyup #city_I': function() {
        Session.set('city', $("#city_I").val());
    },

    //pinCode
    'change #pinCode_I': function() {
        $("#pinCode_I").css({
            "color": ""
        });;
        Session.set('pinCode', $("#pinCode_I").val());
    },

    'keyup #pinCode_I': function() {
        Session.set('pinCode', $("#pinCode_I").val());
    },

    "keyup #pinCode_I": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "change #termsDistrict": function() {
        Session.set('termsLength', $("input[id=termsDistrict]:checked").length);
    },
    'keyup #assocAbbName': function(e) {
        e.preventDefault();
        $("#setForOthersAssociation2").html("")
        if ($("#assocAbbName").val().trim().length != 0) {

            Meteor.call("associationAbbrevationDuplicates", $("#assocAbbName").val().trim(), function(e, res) {
                if (res) {
                    $("#setForOthersAssociation2").html("Use different abbrevation name");
                    Session.set("assocAbbNameSe", null)
                } else {
                    Session.set("assocAbbNameSe", $("#assocAbbName").val());
                }
            })

        }
    },
    'change #assocAbbName': function(e) {
        e.preventDefault();
        $("#assocAbbName").css({
            "color": ""
        });;
        $("#setForOthersAssociation2").html("");
        if ($("#assocAbbName").val().trim().length != 0) {
            Meteor.call("associationAbbrevationDuplicates", $("#assocAbbName").val().trim(), function(e, res) {
                if (res) {
                    $("#setForOthersAssociation2").html("Use different abbrevation name");
                    Session.set("assocAbbNameSe", null)
                } else {
                    Session.set("assocAbbNameSe", $("#assocAbbName").val());
                }
            })
        }
    },
    "click #previous-associationType": function(e) {
        e.preventDefault();
        $('#associationRegistrationTabs').modal('hide');
        $('#associationType').modal({
            backdrop: 'static'
        });;

    },
    "click #next-associationSport": function(e) {

        e.preventDefault();
        Session.set("country", "India");
        if (Session.get("associationType") == "District/City") {
            if ((Session.get("assocAbbNameSe") == null) ||
                (!Session.get("assocAbbNameSe").trim().length) ||
                (Session.get("stateOfAssoc") == null) ||
                (Session.get('associationName') == null) ||
                (!Session.get('associationName').trim().length) ||
                (Session.get('associationName') == "") || (Session.get('mobileNumber') == null) ||
                (Session.get('mobileNumber') == "") || (Session.get('mobileNumber').length != 10) ||
                (Session.get('userNameContactmodReg2') == null) ||
                (!Session.get('userNameContactmodReg2').trim().length) ||
                (Session.get('userNameContactmodReg2') == "") ||
                (!Session.get('stateOfAssoc').trim().length) ||
                (Session.get('stateOfAssoc') == "") ||
                (Session.get('city') == null) ||
                (!Session.get('city').trim().length) ||
                (Session.get('city') == "") ||
                (Session.get('pinCode') == null) ||
                (Session.get('pinCode').length != 6) ||
                (Session.get('pinCode') == "")) {



                $("#associationRegistrationTabs").find("#impMsg").text("* Please fill mandatory fields");
            } else if (Session.get("termsLength") != "1")
                $("#associationRegistrationTabs").find("#impMsg").text("* Please accept terms and conditions");
            else {
                $("#associationRegistrationTabs").find("#impMsg").text("");
                return false;

            }

        } else {
            if ((Session.get("assocAbbNameSe") == null) || (!Session.get("assocAbbNameSe").trim().length) ||
                (Session.get("stateOfAssoc") == null) || (Session.get('associationName') == null) ||
                (!Session.get('associationName').trim().length) || (Session.get('associationName') == "") ||
                (Session.get('mobileNumber') == null) || (Session.get('mobileNumber') == "") ||
                (Session.get('mobileNumber').length != 10) ||
                (Session.get('userNameContactmodReg2') == null) ||
                (!Session.get('userNameContactmodReg2').trim().length) ||
                (Session.get('userNameContactmodReg2') == "") ||
                (!Session.get('stateOfAssoc').trim().length) || (Session.get('stateOfAssoc') == "") ||
                (Session.get('city') == null) || (!Session.get('city').trim().length) ||
                (Session.get('city') == "") || (Session.get('pinCode') == null) ||
                (Session.get('pinCode').length != 6) || (Session.get('pinCode') == "")) {

                if (Session.get("assocAbbNameSe") == null || (!Session.get("assocAbbNameSe").trim().length))
                    $("#assocAbbName").css({
                        "color": "red"
                    });

                if (Session.get('associationName') == null || Session.get('associationName') == "" || !(Session.get('associationName').trim().length))
                    $("#associationName").css({
                        "color": "red"
                    });

                if (Session.get('mobileNumber') == null || Session.get('mobileNumber') == "" || Session.get('mobileNumber').length != 10)
                    $("#mobileNumber").css({
                        "color": "red"
                    });

                if (Session.get('userNameContactmodReg2') == null || Session.get('userNameContactmodReg2') == "" || (!Session.get('userNameContactmodReg2').trim().length))
                    $("#userNameContactmodReg2").css({
                        "color": "red"
                    });

                if (Session.get("stateOfAssoc") == null || Session.get('stateOfAssoc') == "" || (!Session.get('stateOfAssoc').trim().length))
                    $("#state").css({
                        "color": "red"
                    });

                if (Session.get('city') == null || Session.get('city') == "" || (!Session.get('city').trim().length))
                    $("#city_I").css({
                        "color": "red"
                    });

                if (Session.get('pinCode') == null || Session.get('pinCode') == "" || (Session.get('pinCode').length != 6))
                    $("#pinCode_I").css({
                        "color": "red"
                    });

                $("#associationRegistrationTabs").find("#impMsg").text("* Please fill mandatory fields");
                $('#associationRegistrationTabs').modal({
                    backdrop: 'static'
                });;

            } else {
                try{
                Meteor.call("registerValidationForUploadPlayers", Session.get('mobileNumber'), 2, function(e, resValid) {
                    if (resValid == false) {
                        $("#associationRegistrationTabs").find("#impMsg").text("")
                        $('#associationRegistrationTabs').modal('hide')
                        if ($('#mod3').is(':empty')) {
                            Blaze.render(Template.associationSport, $("#mod3")[0]);
                            $('#associationSport').modal({
                                backdrop: 'static'
                            });;
                        } else {
                            $('#associationSport').modal({
                                backdrop: 'static'
                            });;
                        }
                    } else if (resValid != undefined && resValid != null) {
                        $("#associationRegistrationTabs").find("#impMsg").text(resValid);
                        $('#associationRegistrationTabs').modal({
                            backdrop: 'static'
                        });;
                    } else if (e) {
                        $("#associationRegistrationTabs").find("#impMsg").text(e.reason);
                        $('#associationRegistrationTabs').modal({
                            backdrop: 'static'
                        });;
                    }else{
                        $("#associationRegistrationTabs").find("#impMsg").text("")
                    }
                })
                }catch(e){
                    displayMessage(e)
                }
            }

        }
    },
    "click #districtassociationRegisterSubmit": function(e) {
        if ((Session.get("assocAbbNameSe") == null) ||
            (!Session.get("assocAbbNameSe").trim().length) ||
            (Session.get("stateOfAssoc") == null) ||
            Session.get('associationName') == null ||
            (!Session.get('associationName').trim().length) ||
            (Session.get('associationName') == "") ||
            (Session.get('mobileNumber') == null) ||
            (Session.get('mobileNumber') == "") ||
            (Session.get('mobileNumber').length != 10) ||
            (Session.get('userNameContactmodReg2') == null) ||
            (!Session.get('userNameContactmodReg2').trim().length) ||
            (Session.get('userNameContactmodReg2') == "") ||
            (!Session.get('stateOfAssoc').trim().length) ||
            (Session.get('stateOfAssoc') == "") || (Session.get('city') == null) ||
            (!Session.get('city').trim().length) || (Session.get('city') == "") ||
            (Session.get('pinCode') == null) || (Session.get('pinCode').length != 6) || (Session.get('pinCode') == "")) {

            if (Session.get("assocAbbNameSe") == null || (!Session.get("assocAbbNameSe").trim().length))
                $("#assocAbbName").css({
                    "color": "red"
                });

            if (Session.get('associationName') == null || Session.get('associationName') == "" || !(Session.get('associationName').trim().length))
                $("#associationName").css({
                    "color": "red"
                });

            if (Session.get('mobileNumber') == null || Session.get('mobileNumber') == "" || Session.get('mobileNumber').length != 10)
                $("#mobileNumber").css({
                    "color": "red"
                });

            if (Session.get('userNameContactmodReg2') == null || Session.get('userNameContactmodReg2') == "" || (!Session.get('userNameContactmodReg2').trim().length))
                $("#userNameContactmodReg2").css({
                    "color": "red"
                });

            if (Session.get("stateOfAssoc") == null || Session.get('stateOfAssoc') == "" || (!Session.get('stateOfAssoc').trim().length))
                $("#state").css({
                    "color": "red"
                });

            if (Session.get('city') == null || Session.get('city') == "" || (!Session.get('city').trim().length))
                $("#city_I").css({
                    "color": "red"
                });

            if (Session.get('pinCode') == null || Session.get('pinCode') == "" || (Session.get('pinCode').length != 6))
                $("#pinCode_I").css({
                    "color": "red"
                });

            $("#associationRegistrationTabs").find("#impMsg").text("* Please fill mandatory fields");

        } else if (Session.get('termsLength') != "1") {
            $("#associationRegistrationTabs").find("#impMsg").text("* Please accept terms and conditions");
        } else {
            $("#associationRegistrationTabs").find("#impMsg").text("");

            var lData = {
                emailAddress: Session.get('emailAddress'),
                password: $("#password").val(),
                interestedProjectName: Session.get("projectName"),
                interestedDomainName: Session.get('domainName'),
                interestedSubDomain1Name: [""],
                interestedSubDomain2Name: [""],
                parentAssociationId: "other",
                associationId: Session.get('selectedAssociationAc'),
                phoneNumber: Session.get('mobileNumber'),
                associationName: Session.get('associationName'),
                userName: Session.get("associationName"),
                associationType: Session.get("associationType"),
                websiteAssoc: Session.get("websiteAssoc"),
                dateOfBirth: Session.get('dateOfBirth'),
                emailAddress: Session.get('emailAddress'),
                role: Session.get('role'),
                contactPerson: Session.get('userNameContactmodReg2'),
                address: Session.get('address'),
                city: Session.get('city'),
                pinCode: Session.get('pinCode'),
                country: Session.get("country"),
                state: Session.get("stateOfAssoc"),
                MonthINC: Session.get("MMOfINC"),
                YearINC: Session.get("YYOfINC"),
                DDINC: Session.get("DDOfINC"),
                assocAbbrevation: Session.get("assocAbbNameSe")
            };
            Meteor.call("registerValidationForUploadPlayers", lData.emailAddress, 1, function(e, resValid) {
                if (resValid == false) {
                    Meteor.call("registerValidationForUploadPlayers", lData.phoneNumber, 2, function(e, resValid) {
                        if (resValid == false) {
                            Meteor.call("registerAssociation", lData, function(error, response) {
                                if (response) {
                                    $("#associationRegistrationTabs").modal('hide');
                                    $("#alreadySubscribedText").text("Sending confirmation email");

                                    
                                    displayMessage("Registration success")
                                    Router.go("/")
                                } else if (response == false) {
                                    $("#academyRegistrationTabs").find("#impMsg").text("User exists with given email or phone");
                                } else if (error) {
                                    $("#conFirmHeaderOk").text(error.reason);
                                    $("#confirmModalOk").modal({
                                        backdrop: 'static'
                                    });;
                                }
                            });
                        } else if (resValid != undefined && resValid != null) {
                            $("#associationRegistrationTabs").find("#impMsg").text(resValid);
                        } else if (e) {
                            $("#associationRegistrationTabs").find("#impMsg").text(e.reason);
                        }
                    })
                } else if (resValid != undefined && resValid != null) {
                    $("#associationRegistrationTabs").find("#impMsg").text(resValid);
                } else if (e) {
                    $("#associationRegistrationTabs").find("#impMsg").text(e.reason);
                }
            })
        }
    }

});

/******************** association sport related **********************/
Template.associationSport.onCreated(function() {
    this.subscribe("tournamentEvents");
});

Template.associationSport.onRendered(function() {
    var checkboxes = $("input[name='checkProjectName']"),
        submitButt = $("#next-modReg3");

    $('#selectTagop').niceScroll({
        cursorborderradius: '0px',
        background: 'transparent',
        cursorwidth: '3px',
        cursorcolor: 'maroon',
        autohidemode: true,
    });
});


Template.associationSport.onDestroyed(function() {
    Session.set('searchSports', null);
    Session.set('searchSports', undefined);
    Session.set('projectName', null);
    Session.set('projectName', undefined);
});


Template.associationSport.helpers({
    lProjectName: function() {
        var lProjectNames = tournamentEvents.find().fetch();
        if (lProjectNames)
            return lProjectNames;
    }
});

Template.associationSport.events({
    'keyup #mainTagModReg3': function(event) {
        var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
        var $rows = $("#selectTagop").find("div");
        $rows.each(function() {
            var oLabel = $(this);
            if (oLabel.length > 0) {
                if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0)
                    $(this).show();
                else
                    $(this).hide();
            }
        })
    },

    "click input[name='checkProjectName']": function(e) {
        document.getElementById('mainTagModReg3').value = "";
        $("#mainTagModReg3").keyup();
        $("#next-modReg3").attr("disabled", !$("input[name='checkProjectName']").is(":checked"));
        if ($("input[name=checkProjectName]:checked").length == $("input[name=checkProjectName]:checkbox").length)
            $("input[name=checkAll]:checkbox").prop('checked', true);
        else
            $("input[name=checkAll]:checkbox").prop('checked', false);
    },

    "change input[name='checkProjectName']": function() {
        var projects = $("input[name='checkProjectName']:radio:checked").map(function() {
            return this.value;
        }).get();
        Session.set('projectName', projects);
    },

    "click #previous-associationDetailsTab": function(e) {
        $('#associationSport').modal('hide');
        $('#associationRegistrationTabs').modal({
            backdrop: 'static'
        });;

    },

    "click #next-associationDomainTab": function(e) {
        var projects = $("input[name='checkProjectName']:radio:checked").map(function() {
            return this.value;
        }).get();
        if (projects == "") {
            $("#associationSport").find("#impMsg").text("* Please select sport");
            $('#associationSport').modal({
                backdrop: 'static'
            });;

        } else {
            $("#associationSport").find("#impMsg").text("");

            Session.set('projectName', projects);
            $('#associationSport').modal('hide');
            if ($('#mod4').is(':empty')) {
                Blaze.render(Template.associationDomain, $("#mod4")[0]);
                $('#associationDomain').modal({
                    backdrop: 'static'
                });;
            } else {
                $('#associationDomain').modal({
                    backdrop: 'static'
                });;
            }

        }

    },
});


/****************** domain related *********************/

Template.associationDomain.onCreated(function() {
    this.subscribe("domains");
});

Template.associationDomain.onRendered(function() {

    Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
    Session.set('termsLength', $("input[id=terms]:checked").length);

    $('#selectTag2').slimScroll({
        height: '12.4em',
        color: 'maroon',
        size: '3px',
        width: '100%'
    });
});




//searchPlace
Template.associationDomain.helpers({
    lDomainName: function() {
        var lProjectNames = domains.find().fetch();
        if (lProjectNames) return lProjectNames;
        else return false;

    }
});

Template.associationDomain.onDestroyed(function() {
    Session.set('searchPlace', null);
    Session.set('searchPlace', undefined);
});

Template.associationDomain.events({
    'keyup #mainTag1ModReg4': function(event) {
        var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
        var $rows = $("#selectTag2").find("div");
        $rows.each(function() {
            var oLabel = $(this);
            if (oLabel.length > 0) {
                if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0)
                    $(this).show();
                else
                    $(this).hide();
            }
        })
    },

    "change #checkAllPlaces": function(e) {
        e.preventDefault();

        if ($("input[id=checkAllPlaces]:checkbox").prop('checked')) {

            $("input[name=checkDomainName]:radio").prop('checked', true);
            Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
            Session.set('termsLength', $("input[id=terms]:checked").length);
        } else {
            $("input[name=checkDomainName]:radio").prop('checked', false);
            Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
            Session.set('termsLength', $("input[id=terms]:checked").length);
        }
    },

    // Terms and conditions
    "change #terms": function(e) {
        Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
        Session.set('termsLength', $("input[id=terms]:checked").length);
    },

    "click input[name='checkDomainName']": function(e) {

        Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
        Session.set('termsLength', $("input[id=terms]:checked").length);
        if ($("input[name=checkDomainName]:checked").length == $("input[name=checkDomainName]:radio").length)
            $("input[name=checkAllPlaces]:radio").prop('checked', true);
        else
            $("input[name=checkAllPlaces]:radio").prop('checked', false);
    },

    "change input[name=checkDomainName]": function(e) {

        var domains = $("input[name='checkDomainName']:radio:checked").map(function() {
            return this.value;
        }).get();
        Session.set('checkDOMASSOc', domains);
        Session.set('domainName', domains);
        Session.set('termsLength', $("input[id=terms]:checked").length);
    },
    "click #previous-associationSport": function(e) {
        $('#associationDomain').modal('hide');
        $('#associationSport').modal({
            backdrop: 'static'
        });;

    },
    "click #associationRegisterSubmit": function(e) {
        if ((Session.get('domainLength')) && (Session.get('termsLength'))) {
            $("#associationDomain").find("#impMsg").text("");

            var lData = {
                emailAddress: Session.get('emailAddress'),
                password: $("#password").val(),
                interestedProjectName: Session.get("projectName"),
                interestedDomainName: Session.get('domainName'),
                interestedSubDomain1Name: [""],
                interestedSubDomain2Name: [""],
                parentAssociationId: "other",
                associationId: Session.get('selectedAssociationAc'),
                phoneNumber: Session.get('mobileNumber'),
                associationName: Session.get('associationName'),
                userName: Session.get("associationName"),
                associationType: Session.get("associationType"),
                websiteAssoc: Session.get("websiteAssoc"),
                dateOfBirth: Session.get('dateOfBirth'),
                emailAddress: Session.get('emailAddress'),
                role: Session.get('role'),
                contactPerson: Session.get('userNameContactmodReg2'),
                address: Session.get('address'),
                city: Session.get('city'),
                pinCode: Session.get('pinCode'),
                country: Session.get("country"),
                state: Session.get("stateOfAssoc"),
                MonthINC: Session.get("MMOfINC"),
                YearINC: Session.get("YYOfINC"),
                DDINC: Session.get("DDOfINC"),
                assocAbbrevation: Session.get("assocAbbNameSe")
            };

            Meteor.call("registerValidationForUploadPlayers", lData.emailAddress, 1, function(e, resValid) {
                if (resValid == false) {
                    Meteor.call("registerAssociation", lData, function(error, response) {
                        if (response) {
                            $("#associationRegistrationTabs").modal('hide');
                            $("#alreadySubscribedText").text("Sending confirmation email");

                            
                            displayMessage("Registration success")
                            Router.go("/")
                        } else if (response == false) {
                            $("#associationDomain").modal({
                                backdrop:'static'
                            })
                            $("#associationDomain").find("#impMsg").text("User exists with given email or phone");
                        } else if (error) {
                            $("#conFirmHeaderOk").text(error.reason);
                            $("#confirmModalOk").modal({
                                backdrop: 'static'
                            });;
                        }

                    })
                } else if (resValid != undefined && resValid != null) {
                    $("#associationDomain").modal({
                        backdrop:'static'
                    })
                    $("#associationDomain").find("#impMsg").text(resValid);
                } else if (e) {
                    $("#associationDomain").modal({
                        backdrop:'static'
                    })
                    $("#associationDomain").find("#impMsg").text(e.reason);
                }
            })


        } else {

            if (Session.get("domainLength") == "0" && Session.get("termsLength") == "0")
                $("#associationDomain").find("#impMsg").text("* Please select domain and accept terms and conditions");
            else if (Session.get("domainLength") == "0")
                $("#associationDomain").find("#impMsg").text("* Please select domain");
            else if (Session.get("termsLength") == "0")
                $("#associationDomain").find("#impMsg").text("* Please accept terms and conditions");

            $('#associationDomain').modal({
                backdrop: 'static'
            });;

        }
    }


});


/************* functions ************************/
function updateNumberOfDays_Inc() {
    $('#days_I').html('');
    month = $('#months_I').val();
    year = $('#years_I').val();
    days = daysInMonth_Inc(month, year);
    Session.set("DDOfINC", null);
    $('#days_I').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days_I').append($('<option />').val(i).html(i));
    }
}

function daysInMonth_Inc(month, year) {
    return new Date(year, month, 0).getDate();
}