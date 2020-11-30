import {
    regEm
}
from '../../../regexExp.js'


$.validator.addMethod(
    "validTextEmail",
    function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }

);

Template.registerNewPlayer2.onCreated(function() {
    var template = this;
    this.subscribe("onlyLoggedIn");
    template.autorun(function() {
        if (Session.get("enteredEmailAddress_user") != undefined) {
            template.subscribe("findBYEmail", Session.get("enteredEmailAddress_user"));
        }
    })
    this.subscribe("timeZone")
});

Template.registerNewPlayer2.onRendered(function() {
    Session.set("enteredEmailAddress_user", undefined)
    $('#assoc-addNewPlayer2').validate({
        rules: {
            playerEmailAddress: {
                validTextEmail: regEm,
                //alreadyRegisteredPlayer_P:true,
            },
            playerNameContact: {
                required: true,
                checkSpace_Player: true,
            },
            years_Player: {
                selectyear_P: true,
            },
            months_Player: {
                selectmonth_P: true
            },
            days_Player: {
                selectdays_P: true
            },
            gender: {
                selectgen_P: true
            },
            playermobileNumber: {
                //: true,  
                //minlength: 10,
                //maxlength: 10,
                validPhoneCode_Player: /^\d+$/,
                //checkSpace_Player: true,
            },
            checkAcceptboxTeam: {
                checkCheckedTC: true
            },
            state2_Player: {
                selectState_P: true
            },
            playerCity: {
                required: true,
                checkSpace_Player: true,
            },
            playerPincode: {
                required: true,
                minlength: 6,
                maxlength: 6,
                validPinCode_Player: /^\d+$/,
                checkSpace_Player: true,
            },
        },
        messages: {
            playerEmailAddress: {
                validTextEmail:"Enter Valid email",
                alreadyRegisteredPlayer_P: "This  email address is already registered.",
                checkSpace_Player: "Please enter a valid email address.",
            },
            playerNameContact: {
                required: "Please enter player name.",
                checkSpace_Player: "Player name is not valid.",
            },
            playermobileNumber: {
               // required: "Please enter mobile number.",
                minlength: "Mobile Number is not valid.",
                maxlength: "Mobile Number is not valid.",
                validPhoneCode_Player: "Mobile Number is not valid.",
               // checkSpace_Player: "Mobile Number is not valid.",
            },
            checkAcceptboxTeam: {
                checkCheckedTC: "Please accept terms & conditions."
            },
            years_Player: {
                selectyear_P: "Please select year"
            },
            days_Player: {
                selectdays_P: "Please select day"
            },
            months_Player: {
                selectmonth_P: "Please select month"
            },
            gender: {
                selectgen_P: "Please select gender"
            },
            state2_Player: {
                selectState_P: "Please select state"
            },
            playerCity: {
                required: "Please enter city.",
                checkSpace_Player: "City is not valid.",
            },
            playerPincode: {
                required: "Please enter pincode. ",
                minlength: "Pincode is not valid.",
                maxlength: "Pincode is not valid.",
                validPinCode_Player: "Pincode is not valid."
            },
        },
        showErrors: function(errorMap, errorList) {
            $("#assoc-addNewPlayer2").find("input").each(function() {
                $(this).removeClass("error");
            });
            if (errorList.length) {
                Session.set("validated2", 0);
                $('#setForErrors2').css("color", "rgb(179,0,0)");
                $("#setForErrors2").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + errorList[0]['message']);
                $(errorList[0]['element']).addClass("error");
            }
        },
        submitHandler: function() {
            try {
                $('#setForErrors2').html("");
                Session.set("playermobileNumberSess", $("#playermobileNumber").val());
                Session.set("playerNameContactSess", $("#playerNameContact").val());
                Session.set("playerGenSess", $("#gender").val());

                var s = parseInt($("#days_Player").val())
                var s1 = parseInt($("#months_Player").val())
                var s2 = parseInt($("#years_Player").val())

                var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
                Session.set('playerdateOfBirthSess', s3);
                pass = randomPassword_Player(7);
                Session.set("playerPasswordSess", pass)
                var ldata = {
                    userName: Session.get("playerNameContactSess"),
                    emailAddress: $("#playerEmailAddress").val(),
                    password: Session.get("playerPasswordSess"),
                    phoneNumber: Session.get("playermobileNumberSess"),
                    address: $("#address").val(),
                    gender: Session.get("playerGenSess"),
                    //dateOfBirth:Session.get("playerdateOfBirthSess"),
                    interestedDomainName: Meteor.user().interestedDomainName,
                    interestedProjectName: Meteor.user().interestedProjectName,
                    interestedSubDomain1Name: [""],
                    interestedSubDomain2Name: [""],
                    clubName: Meteor.user().clubName,
                    clubNameId: Meteor.user().userId,
                    associationId: Meteor.user().associationId,
                    role: "Player",
                    country: "India",
                    state: $("#state2_Player").val(),
                    city: $("#playerCity").val(),
                    guardianName: $("#guardianName").val(),
                    pinCode: $("#playerPincode").val(),
                    s1: parseInt($("#days_Player").val()),
                    s2: parseInt($("#months_Player").val()),
                    s3: parseInt($("#years_Player").val()),
                    userStatus: "Active"
                }
                var findForEmptyPhoneNumber = Session.get("playermobileNumberSess")
                var findForEmptyemailAddress = $("#playerEmailAddress").val()

                if ((findForEmptyPhoneNumber == null || findForEmptyPhoneNumber == "null" || findForEmptyPhoneNumber == undefined &&
                    findForEmptyPhoneNumber == "undefined" || findForEmptyPhoneNumber.trim().length == 0) && (findForEmptyemailAddress == null ||
                    findForEmptyemailAddress == "null" || findForEmptyemailAddress == undefined &&
                    findForEmptyemailAddress == "undefined" || findForEmptyemailAddress.trim().length == 0)) {
                    $('#setForErrors2').html("Email address or  Phone Number is required")
                }
                else{
                    Meteor.call("registerValidationForUploadPlayers", ldata.emailAddress, 1, function(e, resValid) {
                        if (resValid == false) {
                            Meteor.call("registerValidationForUploadPlayers", ldata.phoneNumber, 2, function(e, resValid2) {
                                if (resValid2 == false) {
                                    Meteor.call("csvUploadStateAndAcademy", ldata, Meteor.user().userId,function(e, r) {
                                        if (r == "0") {
                                            alert("User Already Exists");
                                        } else if (r) {
                                            try {
                                                if (e) {
                                                    $("#conFirmHeaderOk").text(e.reason);
                                                    $("#confirmModalOk").modal({
                                                        backdrop: 'static'
                                                    });
                                                    $("#registerNewPlayer2").modal('hide');
                                                } else {
                                                    if (Meteor.user().userId && Meteor.user()) {
                                                        try {
                                                            var dataContext = {
                                                                message: "Welcome," + Session.get("playerNameContactSess"),
                                                                playerName: $("#playerEmailAddress").val(),
                                                                academyName: Meteor.user().userName,
                                                                whoregstered: Meteor.user().role,
                                                                password: Session.get("playerPasswordSess"),
                                                                imageURL: Meteor.absoluteUrl(),
                                                            }
                                                            var html = Blaze.toHTMLWithData(Template.sendRegisterationEmailToPlayerFromAca, dataContext);
                                                            var options = {
                                                                from: "iplayon.in@gmail.com",
                                                                to: $("#playerEmailAddress").val(),
                                                                subject: "Welcome," + Session.get("playerNameContactSess"),
                                                                html: html
                                                            }


                                                            $("#registerNewPlayer2_P").modal('hide');
                                                            Session.set("playerPasswordSess", undefined)
                                                            Session.set("playerPasswordSess", undefined)
                                                            Session.set("playerNameContactSess", undefined)
                                                            Session.set("playerGenSess", undefined)
                                                            Session.set("playerdateOfBirthSess", undefined)
                                                        } catch (e) {}
                                                    }
                                                }
                                            } catch (e) {
                                                alert(e)
                                            }
                                        }
                                    });
                                } else if (resValid2 != undefined && resValid2 != null && resValid2 != false) {
                                    $('#setForErrors2').html(resValid2)
                                } else if (e) {
                                    alert(e)
                                }
                            })
                        } else if (resValid != undefined && resValid != null && resValid != false) {
                            $('#setForErrors2').html(resValid)
                        } else if (e) {
                            alert(e)
                        }
                    })
                }
            } catch (e) {
                alert(e)
            }
        }
    });
});

Template.registerNewPlayer2.helpers({
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
    },
    "stateList_2": function() {
        var stateList = timeZone.findOne({
            "countryName": "India"
        });
        if (stateList != undefined) {
            return stateList.state;
        }
    },
});

Template.registerNewPlayer2.events({
    'change  #months_Player': function(e) {
        Session.set("MMofdateOfBirth_P", $("#months_Player").val())
        updateNumberOfDays_P2();
    },
    'change #years_Player': function(e) {
        Session.set("YYofdateOfBirth_P", $("#years_Player").val())
        updateNumberOfDays_P2();
    },
    'change #days_Player': function(e) {
        Session.set("DDofdateOfBirth_P", $("#days_Player").val())
    },
    
    'keyup #playermobileNumber': function(event) {
        if ($("#playermobileNumber").valid()) {
            $('#setForErrors2').html("");
        }
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "click #cancelRegNewPlayer2": function(e) {
        e.preventDefault();
        Session.set("playerPasswordSess", undefined)
        Session.set("playerPasswordSess", undefined)
        Session.set("playerNameContactSess", undefined)
        Session.set("playerGenSess", undefined)
        Session.set("playerdateOfBirthSess", undefined)
    },
    'keyup #playerEmailAddress': function(e) {
        e.preventDefault();
        Session.set("enteredEmailAddress_user", e.target.value)
        if ($("#playerEmailAddress").valid())
            $('#setForErrors2').html("");;
    },
    'change #playerEmailAddress': function(e) {
        e.preventDefault();
        Session.set("enteredEmailAddress_user", e.target.value)
        if ($("#playerEmailAddress").valid())
            $('#setForErrors2').html("");
    },
});

function updateNumberOfDays_P2() {
    $('#days_Player').html('');
    month = $('#months_Player').val();
    year = $('#years_Player').val();
    days = daysInMonth_P2(month, year);
    Session.set("DDofdateOfBirth_P", null);
    $('#days_Player').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days_Player').append($('<option />').val(i).html(i));
    }
}

function daysInMonth_P2(month, year) {
    return new Date(year, month, 0).getDate();
}


$.validator.addMethod("alreadyRegisteredPlayer_P", function(value, element) {
    Session.set("enteredEmailAddress_user", value)
    if (value.trim().length != 0) {
        if (!(Meteor.users.findOne({
                'emailAddress': value
            }))) {
            // If the user is not registered
            return true;
        } else {
            // If the user is already registered
            return false;
        }
    } else return true
});

$.validator.addMethod('selectyear_P', function(value) {
    if (value == null || value == 'YYYY') return false;
    else return true;
});

$.validator.addMethod('selectdays_P', function(value) {
    if (value == null || value == 'DD') return false;
    else return true;
});

$.validator.addMethod('selectmonth_P', function(value) {
    if (value == null || value == 'MM') return false;
    else return true;
});

$.validator.addMethod('selectgen_P', function(value) {
    if (value == null || value == 'GEN') return false;
    else return true;
});

$.validator.addMethod('selectState_P', function(value) {
    if (value == null || value == 'State') return false;
    else return true;
});

$.validator.addMethod(
    "checkSpace_Player",
    function(value, element, regexp) {
        if (value.trim().length != 0) {
            return true
        } else return false
    }
);
$.validator.addMethod(
    "validPinCode_Player",
    function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }
);
$.validator.addMethod(
    "validPhoneCode_Player",
    function(value, element, regexp) {
        if(value.trim().length != 0){
            if(value.trim().length != 10){
                return false
            }
            else{
                var check = false;
                return this.optional(element) || regexp.test(value);
            }
        }
        else{
            return true
        }
    }
);

function randomPassword_Player(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}