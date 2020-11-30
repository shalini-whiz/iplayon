import {
    routeForsubscription
}
from '../../routes/hooks.js'

Template.generalRegistrationTabs.onCreated(function() {
    this.subscribe("userOtp");
    this.subscribe("timeZone")
    this.subscribe("onlyLoggedIn")
});

Template.generalRegistrationTabs.onRendered(function() {
    try {
        if (Session.get("DDofdateOfBirth") == null) {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            $('#days').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
            for (i = new Date().getFullYear(); i > 1900; i--) {
                $('#years').append($('<option />').val(i).html(i));
            }

            for (i = 1; i < 13; i++) {
                $('#months').append($('<option />').val(i).html(i));
            }
            updateNumberOfDays();
        }
    } catch (e) {}
    userProfileSettingsValidate();
});

Template.generalRegistrationTabs.helpers({
    "stateList_2_general": function() {
        try {
            var stateList = timeZone.findOne({
                "countryName": "India"
            });
            if (stateList != undefined && stateList.state) {
                return stateList.state;
            }
        } catch (e) {}
    },
})

Template.generalRegistrationTabs.events({
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
    'click #userNamemodReg2': function(e) {
        $("#userNamemodReg2").css({
            "color": ""
        });;
    },
    'click #mobileNumber': function(e) {
        $("#mobileNumber").css({
            "color": ""
        });;
    },
    'change #gender': function(e) {
        $("#gender").css({
            "color": ""
        });;
    },
    'change #city': function(e) {
        $("#city").css({
            "color": ""
        });;
    },
    'change #pinCode': function(e) {
        $("#pinCode").css({
            "color": ""
        });;
    },
    'change #months': function(e) {
        $("#months").css({
            "color": ""
        });;
        Session.set("MMofdateOfBirth", $("#months").val())
        updateNumberOfDays();
    },
    'change #years': function(e) {
        $("#years").css({
            "color": ""
        });;
        Session.set("YYofdateOfBirth", $("#years").val())
        updateNumberOfDays();
    },
    'change #days': function(e) {
        $("#days").css({
            "color": ""
        });;
        Session.set("DDofdateOfBirth", $("#days").val())
    },

    "change #state2": function() {
        $("#state2").css({
            "color": ""
        });;
        Session.set("stateOfAssoc2", $("#state2").val());
    },
    "change #terms2": function(e) {
        if ($("input[id=terms2]:checked").length !== 0) {
            Session.set('termsLength2', $("input[id=terms2]:checked").length);
        } else {
            Session.set('termsLength2', undefined);
            Session.set('termsLength2', null);
        }
    },
    "click #previous_role_selection1": function(e) {
        $('#generalRegistrationTabs').modal('hide');
        $('#modReg1').modal('show');
    },
    "click #generalRegisterSubmit": function(e) {
        Session.set("country", "India");
        if ((Session.get("stateOfAssoc2") == null) || (Session.get('playerName') == null) ||
            (!Session.get('playerName').trim().length) ||
            (Session.get('DDofdateOfBirth') == null) ||
            (Session.get('MMofdateOfBirth') == null) ||
            (Session.get('YYofdateOfBirth') == null) ||
            (Session.get('gender') == null) || (Session.get('playerName') == "") ||
            (Session.get('mobileNumber') == null) ||
            (Session.get('mobileNumber').length != 10) ||
            (Session.get('mobileNumber') == "") ||
            (Session.get('city') == null) || (!Session.get('city').trim().length) ||
            (Session.get('city') == "") || (Session.get('pinCode') == null) ||
            (Session.get('pinCode').length != 6) || (Session.get('pinCode') == "")
        ) {
            $("#impMsg").text("* Please fill mandatory fields");
            if ((Session.get("stateOfAssoc2") == null))
                $("#state2").css({
                    "color": "red"
                });;
            if ((Session.get('playerName') == null) || (Session.get('playerName') == "") || (!Session.get('playerName').trim().length))
                $("#userNamemodReg2").css({
                    "color": "red"
                });
            if (Session.get('DDofdateOfBirth') == null)
                $("#days").css({
                    "color": "red"
                });
            if (Session.get('MMofdateOfBirth') == null)
                $("#months").css({
                    "color": "red"
                });
            if (Session.get('YYofdateOfBirth') == null)
                $("#years").css({
                    "color": "red"
                });
            if (Session.get('gender') == null)
                $("#gender").css({
                    "color": "red"
                });
            if (Session.get('mobileNumber') == null || Session.get('mobileNumber').length != 10 || Session.get('mobileNumber') == "")
                $("#mobileNumber").css({
                    "color": "red"
                });
            if (Session.get('city') == null || (!Session.get('city').trim().length) || Session.get('city') == "")
                $("#city").css({
                    "color": "red"
                });
            if (Session.get('pinCode') == null || Session.get('pinCode').length != 6 || Session.get('pinCode') == "")
                $("#pinCode").css({
                    "color": "red"
                });
        } else if (Session.get('termsLength2') == null || Session.get('termsLength2') == undefined) {
            $("#impMsg").text("* Please accept terms and conditions");

        } else {
            $("#impMsg").text("");

            var s = parseInt(Session.get('DDofdateOfBirth'))
            var s1 = parseInt(Session.get('MMofdateOfBirth'))
            var s2 = parseInt(Session.get('YYofdateOfBirth'))

            var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
            Session.set('dateOfBirth', s3);

            var lData = {
                emailAddress: Session.get('emailAddress'),
                password: $("#password").val(),
                interestedProjectName: [""],
                interestedDomainName: [""],
                interestedSubDomain1Name: [""],
                interestedSubDomain2Name: [""],
                associationId: "",
                userName: Session.get('playerName'),
                phoneNumber: Session.get('mobileNumber'),
                clubName: "other",
                clubNameId: "other",
                dateOfBirth: Session.get('dateOfBirth'),
                s1: Session.get('DDofdateOfBirth'),
                s2: Session.get('MMofdateOfBirth'),
                s3: Session.get('YYofdateOfBirth'),
                role: Session.get('role'),
                gender: $("#gender").val(),
                contactPerson: Session.get('userNameContactmodReg2'),
                address: Session.get('address'),
                city: Session.get('city'),
                pinCode: Session.get('pinCode'),
                country: Session.get("country"),
                state: Session.get("stateOfAssoc2"),
                guardianName: $("#guardianName").val()
            };
            Meteor.call("registerValidationForUploadPlayers", lData.emailAddress, 1, function(e, resValid) {
                if (resValid == false) {
                    Meteor.call("registerValidationForUploadPlayers", lData.phoneNumber, 2, function(e, resValid) {
                        if (resValid == false) {
                            Meteor.call("registerOtherUsers", lData, function(error, response) {
                                if (response) {
                                    try {
                                        $('#generalRegistrationTabs').modal('hide');
                                        $("#alreadySubscribedText").text("Sending confirmation email");
                                        

                                        var dataContext = {
                                            message: "Welcome," + name,
                                            academyPersonName: Session.get('userNameContactmodReg2'),
                                            academyName: Session.get("playerName"),
                                            imageURL: Meteor.absoluteUrl(),
                                            role: Session.get('role')
                                        }

                                        var html = Blaze.toHTMLWithData(Template.sendRegisterationEmailToPlayer, dataContext);
                                        var options = {
                                            from: "iplayon.in@gmail.com",
                                            to: Session.get('emailAddress'),
                                            subject: "Welcome," + Session.get('playerName'),
                                            html: html
                                        }

                                        displayMessage("Registration success")
                                        Router.go("/")
                                        /*Meteor.loginWithPassword(Session.get('emailAddress'), $("#password").val(), function(error) {
                                            if (error) {} else {
                                                setTimeout(function() {
                                                    $("#sendingMailPopup3").modal('hide');
                                                    if (Meteor.userId()) {
                                                        var s = Meteor.users.findOne({
                                                            _id: Meteor.userId()
                                                        });
                                                        if (s && s.profileSettingStatus == true) {
                                                            routeForsubscription(s)
                                                        }
                                                    }
                                                    //Router.go("/upcomingEvents");
                                                }, 1000);

                                            }
                                        });*/


                                    } catch (e) {}
                                }
                                else if(response == false){
                                    $("#academyRegistrationTabs").find("#impMsg").text("User exists with given email or phone");
                                } 
                                else if(error){
                                    $("#conFirmHeaderOk").text(error.reason);
                                    $("#confirmModalOk").modal({
                                        backdrop: 'static'
                                    });;
                                }
                            });
                        }
                        else if(resValid != undefined && resValid != null){
                            $("#impMsg").text(resValid);
                        }
                        else if(e){
                            $("#impMsg").text(e.reason);
                        }
                    })
                }
                else if(resValid != undefined && resValid != null){
                    $("#impMsg").text(resValid);
                }
                else if(e){
                    $("#impMsg").text(e.reason);
                }
            })

        }

    }
});


function updateNumberOfDays() {
    $('#days').html('');
    month = $('#months').val();
    year = $('#years').val();
    days = daysInMonth_other(month, year);
    Session.set("DDofdateOfBirth", null);
    $('#days').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days').append($('<option />').val(i).html(i));
    }
}

function daysInMonth_other(month, year) {
    return new Date(year, month, 0).getDate();
}


/****************************************** validations **********************************************/
var userProfileSettingsValidate = function() {
    var s = $('#generalRegistrationTabs').validate({

        rules: {
            userName: {
                required: true,
                minlength: 5,
                maxlength: 60,
                whiteSpace: /\S/
            },
            userPhoneNum: {
                required: true,
                minlength: 10,
                maxlength: 10,
                validPhoneNum: /^[0-9]{1,10}$/
            }
        },
        messages: {
            userName: {
                required: "Please enter your name",
                minlength: "The name should contain atleast 5 characters",
                maxlength: "The name should not exceed 60 characters",
                whiteSpace: "Please enter valid user name",
            },
            userPhoneNum: {
                required: "Please enter your phone number",
                minlength: "Please enter the valid phone number",
                maxlength: "Please enter the  valid phone number",
                validPhoneNum: "Please enter the valid phone number"
            }
        },

        errorContainer: $('#errorContainer'),
        errorLabelContainer: $('#errorContainer ul'),
        wrapper: 'li',
        invalidHandler: function(form, validator, element) {

            var elem = $(element);
            var errors = s.numberOfInvalids();
            if (errors) {
                $('#errorPopup').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            };
            for (var i = 0; i < validator.errorList.length; i++) {
                var q = validator.errorList[i].element;
                //$('#nationalAffiliationId').css('color', '#ff1a1a');

            }

        },
        submitHandler: function(event) {
            //saveUserProfileSettings(event);

        }
    });
}


$.validator.addMethod(
    "validPhoneNum",
    function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }

);