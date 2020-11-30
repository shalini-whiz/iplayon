// Subsribe to users
Template.registerPage2.onCreated(function() {
    this.subscribe("userOtp");
    this.subscribe("timeZone");
    this.subscribe("onlyLoggedIn");

});

Template.registerPage2.onRendered(function() {
    // After 10 minutes set the session code to
    // null
    var userRend;
    if (Meteor.userId()) {
        userRend = Meteor.users.findOne({
            _id: Meteor.userId()
        })
    }

    if (userRend && userRend.role) {
        Router.go("/upcomingEvents")
    } else {
        $('.modal-content').scrollTop(0);
        $("#scroll1").scrollTop(0);;
        $("#scroll2").scrollTop(0);;
        $("#scroll3").scrollTop(0);;
        $("#scroll4").scrollTop(0);;
        $("#scroll5").scrollTop(0);;
        $("#scroll6").scrollTop(0);;
        $("#scroll7").scrollTop(0);;
        $("#form1").validate({
            onkeyup: false,
            rules: {



                mobileNumber: {
                    minlength: 10,
                    maxlength: 10,
                    validPhoneNum: /^[0-9]{1,10}$/
                }
            },


            errorPlacement: function(error, element) {
                element.val("");
                element.keyup();
                element.attr("placeholder", error.text());
            },
            messages: {



                mobileNumber: {
                    minlength: "Please enter 10 digits",
                    maxlength: "Please enter 10 digits",
                    validPhoneNum: "Please enter 10 digits"
                }
            }
        });

        setTimeout(function() {
            Session.set("codeRegister", null);
        }, 15 * 60 * 1000);

        // Variables for saving
        Session.set('role', null);
        Session.set('playerName', null);
        Session.set('clubName', null);
        Session.set('clubNameId', null);
        Session.set('mobileNumber', null);
        Session.set('dateOfBirth', null);
        Session.set('DDofdateOfBirth', null);
        Session.set('MMofdateOfBirth', null);
        Session.set('YYofdateOfBirth', null);
        Session.set('projectName', null);
        Session.set('domainName', null);
        Session.set('emailAddress', Router.current().params._PostId.slice(1));
        Session.set('password', null);
        Session.set('userNameContactmodReg2', null);
        Session.set('address', null);
        Session.set('city', null);
        Session.set('pinCode', null);
        Session.set('gender', null);
        Session.set('associationType', null)
        Session.set('associationName', null)
        Session.set('projectName', null);
        Session.set('domainLength', null);
        Session.set('termsLength', null);
        Session.set('checkDOMASSOc', null);
        Session.set('termsLength', null);

        $("#awayFromDatePop").keypress(function(event) {
            event.preventDefault();
        });
        if ($("input[name=checkProjectName]:checked").length == $("input[name=checkProjectName]:checkbox").length) {
            $("input[name=checkAll]:checkbox").prop('checked', true);
        }

        if ($("input[name=checkDomainName]:checked").length == $("input[name=checkDomainName]:checkbox").length) {
            $("input[id=checkAllPlaces]:checkbox").prop('checked', true);
        }

        /*
         * initialize bootstrap date time picker for #awayFromDatePop and #awayToDate
         */
        /*$('#awayFromDatePop').datetimepicker({
                
                toolbarPlacement: 'bottom',
                showClear: true,
                showClose: true,
                format: 'DD MMM YYYY',
                widgetPositioning: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
                maxDate: new Date(),//to include todate and today
                //disabledDates: [moment(new Date()).add(-1, 'days').startOf('day')]
            });*/



        $(".dropdown-toggle").dropdown();


        $('#application-registerPage2').validate({
            onkeyup: false,

            rules: {
                verificationCode: {
                    required: true,
                    digits: true,
                    minlength: 4,
                    maxlength: 4
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirmPassword: {
                    minlength: 6,
                    equalTo: "#password"
                }
            },
            // Display only one error at a time
            showErrors: function(errorMap, errorList) {
                $("#application-registerPage2").find("input").each(function() {
                    $(this).removeClass("error");
                });
                $("#verificationSucess_registerPage2").html("</br>");
                if (errorList.length) {
                    $('#verificationSucess_registerPage2').css("color", "rgb(179,0,0)");
                    $("#verificationSucess_registerPage2").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + errorList[0]['message']);
                    $(errorList[0]['element']).addClass("error");
                }
            },
            messages: {
                verificationCode: {
                    required: "Please enter the Verification code ",
                    digits: "Please enter a valid Verification Code.",
                    minlength: "Please enter a valid Verification Code.",
                    maxlength: "Please enter a valid Verification Code."
                },
                password: {
                    required: "Please enter password ",
                    minlength: "Please use at least six characters."
                },
                confirmPassword: {
                    minlength: "Please use at least six characters.",
                    equalTo: "Please retype the same password"
                }
            },
            submitHandler: function() {
                //$("#modReg1").modal({

                // Grab the user's details.
                /** var email = $('[name=emailAddress]').val();
                var password = $('[name=password]').val();
                var userName = $('[name=emailAddress]').val();

                var s = Accounts.createUser({
                    email: email,
                    password: password,
                    userName:userName
                }, function(err) {
                      if (err){}
                      else{
                         var newUserId = Meteor.userId();
                          Meteor.call("updateMeteorUserLogin",newUserId,function(err,response){
                            if(response){
                            
                            }
                            else{
                            }
                         })
                    }
                });**/

                //start Get email-id,verification code and the new password
                var emailId = Router.current().params._PostId.slice(1);
                var verificationCode = $('[name=verificationCode]').val();
                //var password = $('#password').val();

                // Get the user-Id from email-id
                /*var user = Meteor.users.findOne({
                    'emailAddress': emailId
                });*/

                var lData = {
                    emailAddress: emailId,
                    verificationCode: verificationCode
                        //password:password
                };

                Meteor.call("getVFCode", function(e, res) {
                        var customVerCode = "";
                        if (res) {
                            customVerCode = res
                        }
                        // check for the verification-code
                        if (Session.get("codeRegister") == null) {
                            $('#verificationSucess_registerPage2').css("color", "rgb(179,0,0)");
                            $('#verificationSucess_registerPage2').html('<span class="glyphicon glyphicon-remove-sign red"></span>' + ' Your verification code has expired');
                            $('#verificationCode').val("");



                        } else if ((verificationCode == Session.get("codeRegister")) || (verificationCode == customVerCode)) {
                            Blaze.render(Template.modReg1, $("#mod1")[0]);
                            //Blaze.render(Template.modReg2, $("#mod2")[0]);
                            //Blaze.render(Template.modReg3, $("#mod3")[0]);
                            //Blaze.render(Template.modReg4, $("#mod4")[0]);
                            $("#modReg1").modal({
                                backdrop: 'static'
                            });;
                        } else {
                            $('#verificationSucess_registerPage2').css("color", "rgb(179,0,0)");
                            $('#verificationSucess_registerPage2').html('<span class="glyphicon glyphicon-remove-sign red"></span>' + ' Incorrect Verification Code');

                        }
                    })
                    // Change the password
                    //var s =Accounts.setPassword(user.userId, password);


            }
        });
    }
});
Template.registerPage2.onDestroyed(function() {
    Session.get('DDofdateOfBirth', null)
    Session.get('YYofdateOfBirth', null)
    Session.get('dateOfBirth', null)
    Session.set('role', null);
    Session.set('playerName', null);
    Session.set('clubName', null);
    Session.set('mobileNumber', null);
    Session.set('dateOfBirth', null);
    Session.set('DDofdateOfBirth', null);
    Session.set('MMofdateOfBirth', null);
    Session.set('YYofdateOfBirth', null);
    Session.set('projectName', null);
    Session.set('domainName', null);
    Session.set('password', null);
    Session.set('userNameContactmodReg2', null);
    Session.set('address', null);
    Session.set('city', null);
    Session.set('pinCode', null);
    Session.set('gender', null);
    Session.set('associationType', null);
    Session.set('associationName', null);
    Session.set('projectName', null);
    Session.set('domainLength', null);
    Session.set('termsLength', null);
    Session.set('checkDOMASSOc', null);
    Session.set('termsLength', null);
    Session.set('selectedAssociationAc', null);
    Session.set('clubNameId', null);
    Session.set("selectParentAssociation", null);
    Session.get('termsLength2', null);
    $('#terms2').prop('checked', false);
    $('#terms').prop('checked', false);
    Session.set("stateOfAssoc", null);
    Session.set("MMOfINC", "MM");
    Session.set("YYOfINC", "YYYY");
    Session.set("DDOfINC", "DD");
    Session.set("stateOfAssoc2", null);
    Session.set("MMOfINC2", "MM");
    Session.set("YYOfINC2", "YYYY");
    Session.set("DDOfINC2", "DD");
    Session.set("abbrevationclubNameSe", null);
    Session.set("assocAbbNameSe", null);
})
Template.modReg2.onCreated(function() {
    // this.subscribe("users");
    this.subscribe("userOtp");
    this.subscribe("associations")
    this.subscribe("timeZone")
});


Template.registerHelper('whichAssociation', function() {
    if (Session.get("associationType") == "District/City") {
        return false;
    } else {
        return true;
    }

});
Template.registerHelper('checkRolePlayer', function() {
    if ((Session.get('role') == "Player") || (Session.get('role') == "Academy")) {
        return true;
    } else {
        return false;
    }

});

Template.registerHelper('checkRoleClub', function() {
    if (Session.get('role') == "Academy") {
        return false;
    } else {
        return true;
    }

});
Template.registerHelper("checkPlayerRole", function() {

    if (Session.get("role") == "Player")
        return true;
    else
        return false;
})
Template.registerHelper('checkRoleOtherThanAssoc', function() {
    if (Session.get('role') == "Association") {
        return false;
    } else {
        return true;
    }
})

Template.registerHelper('checkInputAssociationParent', function() {
    if (Session.get('selectParentAssociation') == null) {
        return false;
    } else {
        return true;
    }
});

Template.registerHelper('checkInputAssociation', function() {
    if (Session.get('associationType') == null) {
        return true;
    } else {
        return false;
    }
});

Template.registerHelper('checkInputAssociationSelectPD', function() {
    if (Session.get('role') == "Association" || Session.get("role") == "Academy") {
        return true;
    } else {
        return false;
    }
});

Template.registerHelper('checkInputAssociationProjectName', function() {
    if (Session.get('projectName') == null) {
        return false;
    } else {
        return true;
    }
});

Template.registerHelper('checkInputAssociationNameAc', function() {
    if (Session.get('selectedAssociationAc') == null) {
        return false;
    } else {
        return true;
    }
});


Template.registerHelper('checkInput', function() {
    if (Session.get('role') != "Academy" && Session.get('role') != "Association") {
        Session.set("country", "India")
        if ((Session.get("stateOfAssoc2") == null) || (Session.get('playerName') == null) || (!Session.get('playerName').trim().length) || (Session.get('DDofdateOfBirth') == null) || (Session.get('MMofdateOfBirth') == null) || (Session.get('YYofdateOfBirth') == null) || /*(Session.get('dateOfBirth')==null)||*/ (Session.get('gender') == null) || (Session.get('playerName') == "") || /* (Session.get('clubName') == null) || (Session.get('clubName') == "") || (!Session.get('clubName').trim().length) ||*/ (Session.get('mobileNumber') == null) || (Session.get('mobileNumber').length != 10) || (Session.get('mobileNumber') == "") || Session.get('termsLength2') == null || Session.get('termsLength2') == undefined /*||($("#awayFromDatePop").val()==null)*/ ) {
            var s = parseInt(Session.get('DDofdateOfBirth'))
            var s1 = parseInt(Session.get('MMofdateOfBirth'))
            var s2 = parseInt(Session.get('YYofdateOfBirth'))
            var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
            Session.set('dateOfBirth', s3)
            return true;
        } else {
            var s = parseInt(Session.get('DDofdateOfBirth'))
            var s1 = parseInt(Session.get('MMofdateOfBirth'))
            var s2 = parseInt(Session.get('YYofdateOfBirth'))

            var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
            Session.set('dateOfBirth', s3)
            return false;
        }
    } else if (Session.get('role') == "Academy") {
        Session.set("country", "India")
        if ((Session.get("abbrevationclubNameSe") == null) || (!Session.get("abbrevationclubNameSe").trim().length) || (Session.get("stateOfAssoc2") == null) || (Session.get('clubName') == null) || (!Session.get('clubName').trim().length) || (Session.get('clubName') == "") || (Session.get('mobileNumber') == null) || (Session.get('mobileNumber') == "") || (Session.get('mobileNumber').length != 10) || (Session.get('userNameContactmodReg2') == null) || (!Session.get('userNameContactmodReg2').trim().length) || (Session.get('userNameContactmodReg2') == "") || (Session.get('city') == null) || (!Session.get('city').trim().length) || (Session.get('city') == "") || (Session.get('pinCode') == null) || (Session.get('pinCode').length != 6) || (Session.get('pinCode') == "") || Session.get('termsLength2') == null || Session.get('termsLength2') == undefined) {
            return true
        } else
            return false;

    } else if (Session.get('role') == "Association") {
        Session.set("country", "India");
        if (Session.get("associationType") == "District/City") {
            if ((Session.get("assocAbbNameSe") == null) || (!Session.get("assocAbbNameSe").trim().length) || (!Session.get('termsLength')) || (Session.get("stateOfAssoc") == null) || (Session.get('associationName') == null) || (!Session.get('associationName').trim().length) || (Session.get('associationName') == "") || (Session.get('mobileNumber') == null) || (Session.get('mobileNumber') == "") || (Session.get('mobileNumber').length != 10) || (Session.get('userNameContactmodReg2') == null) || (!Session.get('userNameContactmodReg2').trim().length) || (Session.get('userNameContactmodReg2') == "") || (!Session.get('stateOfAssoc').trim().length) || (Session.get('stateOfAssoc') == "") || (Session.get('city') == null) || (!Session.get('city').trim().length) || (Session.get('city') == "") || (Session.get('pinCode') == null) || (Session.get('pinCode').length != 6) || (Session.get('pinCode') == "")) {
                return true;
            } else
                return false;

        } else {
            if ((Session.get("assocAbbNameSe") == null) || (!Session.get("assocAbbNameSe").trim().length) || (Session.get("stateOfAssoc") == null) || (Session.get('associationName') == null) || (!Session.get('associationName').trim().length) || (Session.get('associationName') == "") || (Session.get('mobileNumber') == null) || (Session.get('mobileNumber') == "") || (Session.get('mobileNumber').length != 10) || (Session.get('userNameContactmodReg2') == null) || (!Session.get('userNameContactmodReg2').trim().length) || (Session.get('userNameContactmodReg2') == "") || (!Session.get('stateOfAssoc').trim().length) || (Session.get('stateOfAssoc') == "") || (Session.get('city') == null) || (!Session.get('city').trim().length) || (Session.get('city') == "") || (Session.get('pinCode') == null) || (Session.get('pinCode').length != 6) || (Session.get('pinCode') == "")) {
                return true;
            } else
                return false;

        }
    } else {
        if ((Session.get('playerName') == null) || (!Session.get('playerName').trim().length) || (Session.get('DDofdateOfBirth') == null) || (Session.get('MMofdateOfBirth') == null) || (Session.get('YYofdateOfBirth') == null) /*||(Session.get('dateOfBirth')==null)*/ || (Session.get('gender') == null) || (Session.get('playerName') == "") || (Session.get('mobileNumber') == null) || (Session.get('mobileNumber').length != 10) || (Session.get('mobileNumber') == "") /*||($("#awayFromDatePop").val()==null)*/ ) {
            var s = parseInt(Session.get('DDofdateOfBirth'))
            var s1 = parseInt(Session.get('MMofdateOfBirth'))
            var s2 = parseInt(Session.get('YYofdateOfBirth') + 1)

            var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
            Session.set('dateOfBirth', s3)
            return true;
        } else {
            var s = parseInt(Session.get('DDofdateOfBirth'))
            var s1 = parseInt(Session.get('MMofdateOfBirth'))
            var s2 = parseInt(Session.get('YYofdateOfBirth'))

            var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
            Session.set('dateOfBirth', s3)
            return false;
        }
    }

});

//checkRolePlayer
Template.registerHelper('checkRole', function() {
    if (Session.get('role') == null) {
        return false;
    } else {
        return true;
    }

});

//checkRoleAcademy
Template.registerHelper('checkRoleAcademy', function() {
    if (Session.get('role') == "Academy") {
        return true;
    } else {
        return false;
    }

});



// Helpers for the page loginForgotPassword
Template.registerPage2.helpers({
    emailId: function() {
        try {
            var emailId = Router.current().params._PostId.slice(1);
            return emailId;
        } catch (e) {}
    },
    firstOTPStatus: function() {
        if (Session.get("firstOTPStatus") == "sent")
            return true;
        else
            return false;
    },
    loggedInUserCheck:function(){
        try{
            if(Meteor.userId()){
                return false
            }
        }catch(e){}
    }

});

Template.modReg2.helpers({

    // Get the email address
    academyList: function() {
        try {
            if (Session.get('selectedAssociationAc') != null) {
                var getAcademies = associations.findOne({
                    "associationId": Session.get("selectedAssociationAc")
                });
                if (getAcademies !== undefined && getAcademies.academy != undefined) {
                    return getAcademies.academy;
                }
            }
        } catch (e) {}
    },
    "stateList_2": function() {
        try {
            var stateList = timeZone.findOne({
                "countryName": "India"
            });
            if (stateList != undefined && stateList.state) {
                return stateList.state;
            }
        } catch (e) {}
    },
    "setDays_2": function() {
        try {
            var s = [];
            for (i = 1; i < 32; i++) {
                s.push(i);
            }
            return s;
        } catch (e) {}
    },
    setMonths_2: function() {
        try {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var s = [];
            for (i = 1; i < 13; i++) {
                s.push(i);
            }
            return s;
        } catch (e) {}
    },
    setYears_2: function() {
        try {
            var s = [];
            for (i = new Date().getFullYear(); i > 1900; i--) {
                s.push(i);
            }
            return s;
        } catch (e) {}
    }
});

// Events for the page loginForgotPassword
Template.registerPage2.events({

    'click #cancel': function(e) {
        // Route to register
        $('#modReg1').modal('hide');
        Session.set("codeRegister", null);
        Session.set("codeRegister", undefined)
        $("#verificationCode").val("")
        $("#password").val("")
        $("#confirmPassword").val("")
        $("#mod1").empty();
        $("#mod2").empty();
        $("#mod3").empty();
        $("#mod4").empty();
        $("#mod5").empty();
        $("#mod6").empty();
        $("#mod7").empty();
        $("#mod8").empty();
        setSessionToNull();
        //$('#modReg1').on('hidden.bs.modal', function (e) { Router.go("registerPage2",{_PostId: ":"+Session.get("emailIdRegister")});});

    },
    'click #cancel2': function(e) {


        //$('#modReg4').modal('hide');

        // Route to register
        $('#modReg4').modal('hide');

        // $('#modReg4').on('hidden.bs.modal', function (e) {Router.go("/registerPage1")});

    },


    //li
    'click #li': function(e) {


        // Change the text of the button
        $("#mt-command-dd").html(e.target.id + '<span class="caret" style="width:3%;margin-top:-4%;float:right"></span>');
        $("#selectWho").html(e.target.id + '<span class="glyphicon glyphicon-triangle-bottom abndfSortChange" style="margin-top:-15px !important;"></span>');
        if (e.target.id === "Academy" || e.target.id === "Association") {
            Session.set("DDofdateOfBirth", null);
            Session.set('playerName', null);
            Session.set('playerName', null);
            Session.set('clubName', "other");
            Session.set('mobileNumber', null);
            Session.set('userNameContactmodReg2', null);
            Session.set('address', null);
            Session.get('city', null);
            Session.get('pinCode', null);
            $("#mobileNumber").val("");
            $("#clubName").val("");
            Session.set('associationType', null);
            Session.set('associationName', null);
            Session.set('projectName', null);
            Session.set('domainLength', null);
            Session.set('termsLength', null);
            Session.set('checkDOMASSOc', null);
            Session.set('termsLength', null);
            Session.set('selectedAssociationAc', null);
            Session.set('clubNameId', null);
            Session.set("selectParentAssociation", null);
            Session.set('termsLength2', null);
            $('#terms2').prop('checked', false);
            $('#terms').prop('checked', false);
            $('#termsDistrict').prop('checked', false);
            Session.set("abbrevationclubNameSe", null)
        } else {
            Session.set('clubName', null);
        }
        Session.set('role', e.target.id);
    },

    'click #li2': function(e) {
        // Change the text of the button
        if (e.target.id == "State/Province/County") {
            $("#selectWhoASS").html("State/Province/County" + '<span class="glyphicon glyphicon-triangle-bottom abndfSortChange" style="margin-top:-15px !important;"></span>');
        } else {
            $("#selectWhoASS").html(e.target.id + '<span class="glyphicon glyphicon-triangle-bottom abndfSortChange" style="margin-top:-15px !important;"></span>');
        }
        // $("#selectWhoASS").text( e.target.id);
        Session.set('associationType', e.target.id);
        /*if (Session.get('associationName') == null || Session.get('associationName').trim.length() == 0 || Session.get('associationName') == "") {
            Session.set('clubName', null);
            $("#clubName").val("");
        }*/

    },

    'change input[name=checkAssociationName]': function(e) {
        // Change the text of the button
        Session.set('selectedAssociationAc', e.target.id);
        if (Session.get('associationName') == null || Session.get('associationName').trim.length() == 0 || Session.get('associationName') == "") {
            Session.set('clubName', null);
            $("#clubName").val("");
        }
    },
    'change input[name=checkStateAssociationName]': function(e) {
        // Change the text of the button
        Session.set('selectParentAssociation', e.target.id);
    },

    //$("input[name='checkProjectName']").is(":checked")
    "click #next-modReg4": function(e) {



        if (Session.get("role") != "Academy" && Session.get("role") !== "Association" && Session.get("role") != "Player") {
            var domains = $("input[name='checkDomainName']:checkbox:checked").map(function() {
                return this.value;
            }).get();
            Session.set('domainName', domains);

            // Create a user


            //var lDateOfBirth = $("#awayToDate").val();


            // First Create the user
            var s = Accounts.createUser({
                email: Session.get('emailAddress'),
                password: $("#password").val(),
                userName: Session.get('emailAddress')
            }, function(err) {
                if (err) {
                    $("#conFirmHeaderOk").text(err.reason);
                    $("#confirmModalOk").modal({
                        backdrop: 'static'
                    });;
                } else {
                    var newUserId = Meteor.userId();
                    Meteor.call("updateMeteorUserLogin", newUserId, function(err, response) {
                        if (response) {
                            // Update the User Settings
                            var lData = {
                                interestedProjectName: Session.get('projectName'),
                                interestedDomainName: Session.get('domainName'),
                                interestedSubDomain1Name: [""],
                                interestedSubDomain2Name: [""],
                                associationId: Session.get("selectedAssociationAc"),
                                userName: Session.get('playerName'),
                                phoneNumber: Session.get('mobileNumber'),
                                clubName: Session.get('clubName'),
                                clubNameId: Session.get('clubNameId'),
                                dateOfBirth: Session.get('dateOfBirth'),
                                emailAddress: Session.get('emailAddress'),
                                role: Session.get('role'), //$('input[name=name_of_your_radiobutton]:checked').val();
                                gender: $("#gender").val(),
                                contactPerson: Session.get('userNameContactmodReg2'),
                                /*userName:Session.get('userNameContactmodReg2'),*/
                                address: Session.get('address'),
                                city: Session.get('city'),
                                pinCode: Session.get('pinCode'),
                                country: Session.get("country"),
                                state: Session.get("stateOfAssoc"),
                                guardianName: $("#guardianName").val()
                            };
                            Meteor.call("updateUserProfileSettingsFromRegister", lData, function(error, response) {
                                if (response) {
                                    Router.go("/upcomingEvents");

                                } else if (error) {
                                    //Router.go("/registerPage1");
                                    $("#conFirmHeaderOk").text(error.reason);
                                    $("#confirmModalOk").modal({
                                        backdrop: 'static'
                                    });;
                                }
                            });




                        } else {
                            $("#conFirmHeaderOk").text(err.reason);
                            $("#confirmModalOk").modal({
                                backdrop: 'static'
                            });;
                        }
                    })

                }
            });
        } 
        else {
            var domains = $("input[name='checkDomainName']:radio:checked").map(function() {
                return this.value;
            }).get();
            Session.set('domainName', domains);
            if (Session.get("role") == "Association") {
                Accounts.createUser({
                    email: Session.get('emailAddress'),
                    password: $("#password").val(),
                    userName: Session.get('emailAddress')
                }, function(err) {
                    if (err) {
                        $("#conFirmHeaderOk").text(err.reason);
                        $("#confirmModalOk").modal({
                            backdrop: 'static'
                        });;
                    } else {
                        var newUserId = Meteor.userId();
                        Meteor.call("updateMeteorUserLogin", newUserId, function(err, response) {
                            if (response) {
                                var parentAssociation;
                                if (Session.get("associationType") == "District/City") {
                                    parentAssociation = Session.get("selectParentAssociation");
                                } else {
                                    parentAssociation = ""
                                }
                                var lData = {
                                    interestedProjectName: Session.get("projectName"),
                                    interestedDomainName: Session.get('domainName'),
                                    interestedSubDomain1Name: [""],
                                    interestedSubDomain2Name: [""],
                                    parentAssociationId: "other",
                                    associationId: Session.get('selectedAssociationAc'),
                                    phoneNumber: Session.get('mobileNumber'),
                                    clubNameId: Session.get('clubNameId'),
                                    clubName: Session.get('associationName'),
                                    associationType: Session.get("associationType"),
                                    websiteAssoc: Session.get("websiteAssoc"),
                                    dateOfBirth: Session.get('dateOfBirth'),
                                    emailAddress: Session.get('emailAddress'),
                                    role: Session.get('role'), //$('input[name=name_of_your_radiobutton]:checked').val();
                                    contactPerson: Session.get('userNameContactmodReg2'),
                                    /*userName:Session.get('userNameContactmodReg2'),*/
                                    address: Session.get('address'),
                                    city: Session.get('city'),
                                    pinCode: Session.get('pinCode'),
                                    newUserId: newUserId,
                                    country: Session.get("country"),
                                    state: Session.get("stateOfAssoc"),
                                    MonthINC: Session.get("MMOfINC"),
                                    YearINC: Session.get("YYOfINC"),
                                    DDINC: Session.get("DDOfINC"),
                                    assocAbbrevation: Session.get("assocAbbNameSe"),

                                };

                                Meteor.call("associationAcademyUserProfile", lData, function(error, responses) {
                                    try {
                                        if (responses) {
                                            $("#alreadySubscribedText").text("Sending confirmation email");
                                            $("#sendingMailPopup3").modal({
                                                backdrop: 'static'
                                            });;
                                            /*
                                            var dataContext = {
                                                message: "Welcome," + name,
                                                academyPersonName: Session.get('userNameContactmodReg2'),
                                                academyName: Session.get("associationName"),
                                                imageURL: Meteor.absoluteUrl()
                                            }
                                            var html = Blaze.toHTMLWithData(Template.sendRegisterationEmailToAssociation, dataContext);
                                            var options = {
                                                from: "iplayon.in@gmail.com",
                                                to: Session.get('emailAddress'),
                                                subject: "Welcome," + Session.get('userNameContactmodReg2'),
                                                html: html
                                            }
                                            //send email
*/
                                            setTimeout(function() {
                                                $("#sendingMailPopup3").modal('hide');
                                                Router.go("/upcomingEvents");
                                            }, 1000);
                                        } else if (error) {
                                            $("#conFirmHeaderOk").text(error.reason);
                                            $("#confirmModalOk").modal({
                                                backdrop: 'static'
                                            });;
                                        }
                                    } catch (e) {}
                                });
                            }
                        });
                    }
                })
            }
            if (Session.get("role") == "Academy") {
                Session.set("termsLength", null);
                Accounts.createUser({
                    email: Session.get('emailAddress'),
                    password: $("#password").val(),
                    userName: Session.get('emailAddress')
                }, function(err) {
                    if (err) {
                        $("#conFirmHeaderOk").text(err.reason);
                        $("#confirmModalOk").modal({
                            backdrop: 'static'
                        });;
                    } else {
                        var newUserId = Meteor.userId()
                        Meteor.call("updateMeteorUserLogin", newUserId, function(err, response) {

                            var lData = {
                                interestedProjectName: Session.get('projectName'),
                                interestedDomainName: Session.get('domainName'),
                                interestedSubDomain1Name: [""],
                                interestedSubDomain2Name: [""],
                                academyName: Session.get("clubName"),
                                phoneNumber: Session.get('mobileNumber'),
                                associationId: Session.get('selectedAssociationAc'),
                                emailAddress: Session.get('emailAddress'),
                                role: Session.get('role'), //$('input[name=name_of_your_radiobutton]:checked').val();
                                contactPerson: Session.get('userNameContactmodReg2'),
                                /*userName:Session.get('userNameContactmodReg2'),*/
                                address: Session.get('address'),
                                city: Session.get('city'),
                                pinCode: Session.get('pinCode'),
                                newUserId: newUserId
                            };
                            Meteor.call("associationAcademyUserProfile2", lData, function(error, response) {

                                if (response) {
                                    Router.go("/upcomingEvents");
                                } else if (error) {
                                    $("#conFirmHeaderOk").text(error.reason);
                                    $("#confirmModalOk").modal({
                                        backdrop: 'static'
                                    });;
                                }
                            });
                        });
                    }
                });
            }
        }

    },

    // Clicking on Next leads to an
    // other pop-up

    'click #next-modReg1': function(e) {
        e.preventDefault();

        // Hide the previous modal
        // and display the next modal
        $('#modReg1').modal('hide');
        if (Session.get('role') == "Association") {
            if ($('#mod5').is(':empty')) {
                Blaze.render(Template.associationType, $("#mod5")[0]);
                $('#associationType').modal({
                    backdrop: 'static'
                });;
            } else
                $('#associationType').modal({
                    backdrop: 'static'
                });;
        } else if (Session.get("role") == "Player") {
            $('#modReg1').modal('hide');
            if ($('#mod2').is(':empty')) {
                Blaze.render(Template.playerRegistrationTabs, $("#mod2")[0]);
                $('#playerRegistrationTabs').modal({
                    backdrop: 'static'
                });;
            } else
                $('#playerRegistrationTabs').modal({
                    backdrop: 'static'
                });;

        } else if (Session.get("role") == "Academy") {
            $('#modReg1').modal('hide');
            if ($('#mod2').is(':empty')) {
                Blaze.render(Template.academyRegistrationTabs, $("#mod2")[0]);
                $('#academyRegistrationTabs').modal({
                    backdrop: 'static'
                });;
            } else
                $('#academyRegistrationTabs').modal({
                    backdrop: 'static'
                });;
        } else if (Session.get("role") == "School") {
            $('#modReg1').modal('hide');
            if ($('#mod2').is(':empty')) {
                Blaze.render(Template.schoolRegistrationTabs, $("#mod2")[0]);
                $('#schoolRegistrationTabs').modal({
                    backdrop: 'static'
                });;
            } else
                $('#schoolRegistrationTabs').modal({
                    backdrop: 'static'
                });;
        } else {
            /*Blaze.render(Template.modReg2, $("#mod2")[0]);
            $('#modReg2').modal({
                backdrop: 'static'
            });;*/
            $('#modReg1').modal('hide');
            if ($('#mod2').is(':empty')) {
                Blaze.render(Template.generalRegistrationTabs, $("#mod2")[0]);
                $('#generalRegistrationTabs').modal({
                    backdrop: 'static'
                });;
            } else
                $('#generalRegistrationTabs').modal({
                    backdrop: 'static'
                });;

        }
    },

    /**
     * Clicking on Ok should close the pop-up
     *
     */
    "click #noButton": function(e) {
        // Clear the text present in input text-box
        //   document.getElementById('searchUser').value = "Search_User";
        e.preventDefault();
        $('#confirmModalOk').modal('hide');
    },

    // Clicking on Next leads to an
    // other pop-up

    'click #next-modReg2': function(e) {
        // $("#form1").valid();  
        // Hide the previous modal
        // and display the next modal      


        /*$('#modReg3').modal({
                    backdrop: 'static'
                });;*/
        Session.set("termsLength2", undefined);
        Session.set("termsLength2", null);

        if (Session.get("role") != "Academy" && Session.get("role") !== "Association" && Session.get("role") != "Player") {
            var s = Accounts.createUser({
                email: Session.get('emailAddress'),
                password: $("#password").val(),
                userName: Session.get('emailAddress')
            }, function(err) {
                if (err) {
                    $("#conFirmHeaderOk").text(err.reason);
                    $("#confirmModalOk").modal({
                        backdrop: 'static'
                    });;
                } else {
                    var newUserId = Meteor.userId();
                    Meteor.call("updateMeteorUserLogin", newUserId, function(err, response) {
                        if (response) {
                            // Update the User Settings
                            var lData = {
                                interestedProjectName: Session.get('projectName'),
                                interestedDomainName: Session.get('domainName'),
                                interestedSubDomain1Name: [""],
                                interestedSubDomain2Name: [""],
                                associationId: Session.get("selectedAssociationAc"),
                                userName: Session.get('playerName'),
                                phoneNumber: Session.get('mobileNumber'),
                                clubName: "other",
                                clubNameId: "other",
                                dateOfBirth: Session.get('dateOfBirth'),
                                s1: Session.get('DDofdateOfBirth'),
                                s2: Session.get('MMofdateOfBirth'),
                                s3: Session.get('YYofdateOfBirth'),
                                emailAddress: Session.get('emailAddress'),
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

                            Meteor.call("updateUserProfileSettingsFromRegister", lData, function(error, response) {
                                if (response) {
                                    $('#modReg2').modal('hide');
                                    $("#alreadySubscribedText").text("Sending confirmation email");
                                    $("#sendingMailPopup3").modal({
                                        backdrop: 'static'
                                    });;
                                    /*
                                    var dataContext = {
                                        message: "Welcome," + name,
                                        academyPersonName: Session.get('userNameContactmodReg2'),
                                        academyName: Session.get("clubName"),
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
                                    //send email
                                    */
                                   
                                    setTimeout(function() {
                                        $("#sendingMailPopup3").modal('hide');
                                        Router.go("/upcomingEvents");
                                    }, 1000);
                                } else if (error) {
                                    //Router.go("/registerPage1");
                                    $("#conFirmHeaderOk").text(error.reason);
                                    $("#confirmModalOk").modal({
                                        backdrop: 'static'
                                    });;
                                }
                            });
                        } else {
                            $("#conFirmHeaderOk").text(err.reason);
                            $("#confirmModalOk").modal({
                                backdrop: 'static'
                            });;
                        }
                    })

                }
            });
        } else {
            if (Session.get("role") == "Academy") {
                Accounts.createUser({
                    email: Session.get('emailAddress'),
                    password: $("#password").val(),
                    userName: Session.get('emailAddress')
                }, function(err) {
                    if (err) {
                        $("#conFirmHeaderOk").text(err.reason);
                        $("#confirmModalOk").modal({
                            backdrop: 'static'
                        });;
                    } else {
                        var newUserId = Meteor.userId();
                        Meteor.call("updateMeteorUserLogin", newUserId, function(err, response) {
                            var lData = {
                                interestedProjectName: [""],
                                interestedDomainName: [""],
                                interestedSubDomain1Name: [""],
                                interestedSubDomain2Name: [""],
                                academyName: Session.get("clubName"),
                                phoneNumber: Session.get('mobileNumber'),
                                associationId: Session.get('selectedAssociationAc'),
                                emailAddress: Session.get('emailAddress'),
                                role: Session.get('role'), //$('input[name=name_of_your_radiobutton]:checked').val();
                                contactPerson: Session.get('userNameContactmodReg2'),
                                /*userName:Session.get('userNameContactmodReg2'),*/
                                address: Session.get('address'),
                                city: Session.get('city'),
                                pinCode: Session.get('pinCode'),
                                newUserId: newUserId,
                                country: Session.get("country"),
                                state: Session.get("stateOfAssoc2"),
                                MonthINC: Session.get("MMOfINC2"),
                                YearINC: Session.get("YYOfINC2"),
                                abbrevation: Session.get("abbrevationclubNameSe"),
                                DDINC: Session.get("DDOfINC2")
                            };
                            Meteor.call("associationAcademyUserProfile2", lData, function(error, response) {
                                var name = lData.contactPerson
                                if (response) {
                                    $('#modReg2').modal('hide');
                                    $("#alreadySubscribedText").text("Sending confirmation email");
                                    $("#sendingMailPopup3").modal({
                                        backdrop: 'static'
                                    });;
                                    /*
                                    var dataContext = {
                                        message: "Welcome," + name,
                                        academyPersonName: Session.get('userNameContactmodReg2'),
                                        academyName: Session.get("clubName"),
                                        imageURL: Meteor.absoluteUrl()
                                    }
                                    var html = Blaze.toHTMLWithData(Template.sendRegisterationEmailToAcademy, dataContext);
                                    var options = {
                                        from: "iplayon.in@gmail.com",
                                        to: Session.get('emailAddress'),
                                        subject: "Welcome," + Session.get('userNameContactmodReg2'),
                                        html: html
                                    }
                                    //send email

                                    */
                                    

                                    setTimeout(function() {
                                        $("#sendingMailPopup3").modal('hide');
                                        Router.go("/upcomingEvents");
                                    }, 1000);
                                } else if (error) {
                                    $("#conFirmHeaderOk").text(error.reason);
                                    $("#confirmModalOk").modal({
                                        backdrop: 'static'
                                    });;
                                }
                            });
                        });
                    }
                });
            } else if (Session.get("role") == "Association") {
                $('#modReg2').modal('hide');
                $('#modReg3').modal({
                    backdrop: 'static'
                });;
            }
        }

    },

    'click #next-modReg2Academy': function(e) {
        // $("#form1").valid();  
        // Hide the previous modal
        // and display the next modal   
        $('#modReg5Academy').modal('hide');
        $('#modReg2').modal({
            backdrop: 'static'
        });;
    },

    'click #next-modReg5Ass': function(e) {
        e.preventDefault();

        // Hide the previous modal
        // and display the next modal

        /*if (Session.get('associationType') == "District/City") {
            $('#modReg5Association').modal('hide');
            Blaze.render(Template.modReg5ParentAssociation, $("#mod8")[0]);
            $('#modReg5ParentAssociation').modal({
                backdrop: 'static'
            });;
        } */ //else {
        $('#modReg5Association').modal('hide');
        Blaze.render(Template.modReg2Association, $("#mod6")[0]);
        $('#modReg2Association').modal({
            backdrop: 'static'
        });;
        //  }
    },
    'click #prev-modRegParent5Ass': function(e) {
        $('#modReg5ParentAssociation').modal('hide');
        $('#modReg5Association').modal({
            backdrop: 'static'
        });;
    },
    'click #next-modRegParent5Ass': function(e) {
        $('#modReg5ParentAssociation').modal('hide');
        Blaze.render(Template.modReg2Association, $("#mod6")[0]);
        $('#modReg2Association').modal({
            backdrop: 'static'
        });;
    },
    // Clicking on the previous button
    // hides the present pop-up and 
    // shows the previous one previous-modReg2
    'click #previous-modReg2': function(e) {
        e.preventDefault();

        // Hide the previous modal
        // and display the next modal
        $('#modReg2').modal('hide');
        $('#modReg1').modal({
            backdrop: 'static'
        });;
    },

    'click #previous_role_selection': function(e) {
        e.preventDefault();
        if (Session.get("role") == "Player") $('#playerRegistrationTabs').modal('hide');
        if (Session.get("role") == "Academy") $('#academyRegistrationTabs').modal('hide');

        $('#modReg1').modal({
            backdrop: 'static'
        });;
    },

    "click #previous-modReg6Assoc": function(e) {
        e.preventDefault();
        $('#modReg2Association').modal('hide');
        /*if (Session.get("associationType") == "District/City") {
            $('#modReg5ParentAssociation').modal({
                backdrop: 'static'
            });;
        } else*/
        $('#modReg5Association').modal({
            backdrop: 'static'
        });;
    },

    'click #prev-modReg5Ass': function(e) {
        e.preventDefault();

        // Hide the previous modal
        // and display the next modal
        $('#modReg5Association').modal('hide');
        $('#modReg1').modal({
            backdrop: 'static'
        });;
    },
    // Clicking on the previous button
    // hides the present pop-up and 
    // shows the previous one previous-modReg2
    'click #previous-modReg3': function(e) {
        e.preventDefault();

        // Hide the previous modal
        // and display the next modal
        $('#modReg3').modal('hide');
        $('#modReg2').modal({
            backdrop: 'static'
        });;
    },

    'click #previouswithAssoc-modReg3': function(e) {
        e.preventDefault();
        // Hide the previous modal
        // and display the next modal
        $('#modReg3').modal('hide');
        Blaze.render(Template.modReg2Association, $("#mod6")[0]);
        if (Session.get("role") == "Association") {
            $("#userNameContactmodReg2").val(Session.get('userNameContactmodReg2'))
            $("#address").val(Session.get('address'))
            $("#associationName").val(Session.get('associationName'))
            $("#city").val(Session.get('city'))
            $("#pinCode").val(Session.get('pinCode'))
            $("#mobileNumber").val(Session.get('mobileNumber'))
            if (Session.get("websiteAssoc") != null)
                $("#websiteAssoc").val()
            $('#modReg2Association').modal({
                backdrop: 'static'
            });;
        } else if (Session.get("role") == "Academy") {
            $("#userNameContactmodReg2").val(Session.get('userNameContactmodReg2'))
            $("#address").val(Session.get('address'))
            $("#clubName").val(Session.get('clubName'))
            $("#city").val(Session.get('city'))
            $("#pinCode").val(Session.get('pinCode'))
            $("#mobileNumber").val(Session.get('mobileNumber'))
            $('#modReg2').modal({
                backdrop: 'static'
            });;
        }

    },
    //previous-modReg4
    // Clicking on the previous button
    // hides the present pop-up and 
    // shows the previous one previous-modReg2
    'click #previous-modReg4': function(e) {
        e.preventDefault();

        // Hide the previous modal
        // and display the next modal
        $('#modReg4').modal('hide');
        $('#modReg3').modal({
            backdrop: 'static'
        });;
    },




    // Clicking on Next leads to an
    // other pop-up

    'click #next-modReg3': function(e) {
        e.preventDefault();

        // Hide the previous modal
        // and display the next modal
        $('#modReg3').modal('hide');
        $('#modReg4').modal({
            backdrop: 'static'
        });;
    },

    "click #nextwithAssoc-modReg3": function(e) {
        $('#modReg3').modal('hide');
        $('#modReg4').modal({
            backdrop: 'static'
        });;
    },

    // Clicking on #goToRegister,redirects
    // to register page
    'click #goToLogin': function() {
        Router.go("/iplayonHome")
    },

    // Clicking on #change,redirects
    // to login page
    'click #change': function() {
        Router.go("/registerPage1");
    },

    'change #gender': function() {
        Session.set('gender', $('#gender').val());
    },

    'change #userNamemodReg2': function() {
        Session.set('playerName', $("#userNamemodReg2").val());
    },

    'keyup #userNamemodReg2': function() {
        Session.set('playerName', $("#userNamemodReg2").val());
    },

    'change #clubName': function() {
        Session.set('clubName', $("#clubName").val());
    },
    'keyup #clubName': function() {
        Session.set('clubName', $("#clubName").val());
    },
    "change #clubNamePlayer": function(e) {
        Session.set('clubName', $("#clubNamePlayer :selected").text());
        Session.set('clubNameId', $("#clubNamePlayer").val());
        /*$('#setForOthersAssociation').html('');
        if($("#clubNamePlayer").val()=="other"){
            $('#setForOthersAssociation').html('<span class="glyphicon glyphicon-warning-sign orange" style="margin-right: 5px;font-size: 15px;"></span>'+'Please inform your academy to register on iPlayOn');
        }*/
    },
    /*'change #mobileNumber':function(){
          Session.set('mobileNumber', $("#mobileNumber").val());
      },*/
    "keyup #mobileNumber": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    'keyup #mobileNumber': function(e) {
        Session.set('mobileNumber', e.target.value);
    },
    'focus #awayFromDatePop': function(e, template) {
        /*        $('#awayFromDatePop').datetimepicker().on('dp.show dp.update', function () {
                $(".datepicker-years .picker-switch").removeAttr('title')
                    .css('cursor', 'default')
                    .css('background', 'inherit')
                    .on('click', function (e) {
                        e.stopPropagation();
                    });
            }); */
        /*Session.set('dateOfBirth', $('#awayFromDatePop').val())*/
        Session.set('dateOfBirth', "12 May 2016");


    },

    //Session.set('password', null);
    'change #password': function() {
        Session.set('password', $("#password").val());
    },



    //userNameContactmodReg2

    'change #userNameContactmodReg2': function() {
        Session.set('userNameContactmodReg2', $("#userNameContactmodReg2").val());
    },

    'keyup #userNameContactmodReg2': function() {
        Session.set('userNameContactmodReg2', $("#userNameContactmodReg2").val());
    },

    //address

    'change #address': function() {
        Session.set('address', $("#address").val());
    },

    'keyup #address': function() {
        Session.set('address', $("#address").val());
    },

    //city

    'change #city': function() {
        Session.set('city', $("#city").val());
    },

    'keyup #city': function() {
        Session.set('city', $("#city").val());
    },

    //pinCode
    'change #pinCode': function() {
        Session.set('pinCode', $("#pinCode").val());
    },

    'keyup #pinCode': function() {
        Session.set('pinCode', $("#pinCode").val());
    },

    "keypress #pinCode": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },


    // Clicking on #resend,sends
    // the verification code again
    'click #resend': function() {
        var emailId = $("#userName").val();
        var min = 1000;
        var max = 9999;
        var verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;
        Session.set("codeRegister", verificationCode);
        Session.set("emailIdRegister", emailId);

        var xData = {
            verificationCode: Session.get("codeRegister"),
            emailId: Session.get("emailIdRegister")
        };

        // Send the verification code to the specified mail-id
        Meteor.call("sendEmail", xData, function(error, response) {
            if (response) {
                // Route to Login-forgot password
                $('#verificationSucess_registerPage2').css("color", "green");
                $('#verificationSucess_registerPage2').html('<span class="glyphicon glyphicon-ok-sign green"></span>' + ' Sent the verification code again');
            } else {
                $("#conFirmHeaderOk").text("Please verify your email-id");
                $("#confirmModalOk").modal({
                    backdrop: 'static'
                });;
            }

        });
    },
    'click #resend1': function() {
        var emailId = $("#userName").val();
        var min = 1000;
        var max = 9999;
        var verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;
        Session.set("codeRegister", verificationCode);
        Session.set("emailIdRegister", emailId);

        var xData = {
            verificationCode: Session.get("codeRegister"),
            emailId: Session.get("emailIdRegister")
        };

        // Send the verification code to the specified mail-id
        Meteor.call("sendEmail", xData, function(error, response) {
            if (response) {
                // Route to Login-forgot password
                $('#verificationSucess_registerPage2').css("color", "green");
                $('#verificationSucess_registerPage2').html('<span class="glyphicon glyphicon-ok-sign green"></span>' + ' Sent the verification code again');
            } else {
                $("#conFirmHeaderOk").text("Please verify your email-id");
                $("#confirmModalOk").modal({
                    backdrop: 'static'
                });;
            }

        });
    },
    'click #selectWhoDropDown': function(e) {
        e.preventDefault();

        if ($("#selectWhoDropDown").hasClass("open")) {
            $("#selectWhoDropDown").removeClass("open");
            $("#selectWhoDropDown").children("ul").slideUp("fast");
        } else {
            $("#selectWhoDropDown").addClass("open");
            $("#selectWhoDropDown").children("ul").slideDown("fast");
        }
    },

    'click #selectWhoDropDown2': function(e) {
        e.preventDefault();

        if ($("#selectWhoDropDown2").hasClass("open")) {
            $("#selectWhoDropDown2").removeClass("open");
            $("#selectWhoDropDown2").children("ul").slideUp("fast");
        } else {
            $("#selectWhoDropDown2").addClass("open");
            $("#selectWhoDropDown2").children("ul").slideDown("fast");
        }
    },
    'click #selectWhoDropDown3': function(e) {
        e.preventDefault();
        if ($("#selectWhoDropDown3").hasClass("open")) {
            $("#selectWhoDropDown3").removeClass("open");
            $("#selectWhoDropDown3").children("ul").slideUp("fast");
        } else {
            $("#selectWhoDropDown3").addClass("open");
            $("#selectWhoDropDown3").children("ul").slideDown("fast");
        }
    },
    'change #associationName': function(e) {
        e.preventDefault();
        Session.set('associationName', $("#associationName").val());
    },

    'keyup #associationName': function(e) {
        e.preventDefault();
        Session.set('associationName', $("#associationName").val());
    },
    'change #websiteAssoc': function(e) {
        e.preventDefault();
        Session.set('websiteAssoc', $("#websiteAssoc").val());
    },

    'keyup #websiteAssoc': function(e) {
        e.preventDefault();
        Session.set('websiteAssoc', $("#websiteAssoc").val());
    },

});



// Submit handler and validation

Template.modReg1.onCreated(function() {

    this.subscribe("timeZone");
})
Template.modReg1.onRendered(function() {
    $('.modal-content').scrollTop(0);
    $("#scroll").scrollTop(0);;
    $("#modReg1").on('show.bs.modal', function() {
        $('.modal-content').scrollTop(0);
        $("#scroll").scrollTop(0);;
    });
});
Template.modReg2.onRendered(function() {
    /*$("#teamMultiSubscribePopup").on('show.bs.modal', function(event) {

    });
    $("#teamMultiSubscribePopup").on('hide.bs.modal', function(event) {
        $(".teamSubscribeMainTitle").scrollTop(0);;
        $('.modal-content').scrollTop(0);
        Session.set("checkedEventForTeamSel",undefined);
        Session.set("checkedTeamForEvent",undefined);
        Session.set("che",undefined);
    });*/
    $("#modReg2").on('show.bs.modal', function() {

        $('.modal-content').scrollTop(0);
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
    });
});

function updateNumberOfDays() {
    $('#days').html('');
    month = $('#months').val();
    year = $('#years').val();
    days = daysInMonth(month, year);
    Session.set("DDofdateOfBirth", null);
    $('#days').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days').append($('<option />').val(i).html(i));
    }
}

function updateNumberOfDays_L() {
    $('#days_I2').html('');
    month = $('#months_I2').val();
    year = $('#years_I2').val();
    days = daysInMonth_L(month, year);
    Session.set("DDofdateOfBirth", null);
    $('#days_I2').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days_I2').append($('<option />').val(i).html(i));
    }
}

function daysInMonth_L(month, year) {
    return new Date(year, month, 0).getDate();
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
Template.modReg2.events({
    /*'change #years, #months':function(e){
         updateNumberOfDays();
    },*/
    'change  #months': function(e) {
        Session.set("MMofdateOfBirth", $("#months").val())
        updateNumberOfDays();
    },
    'change #years': function(e) {
        Session.set("YYofdateOfBirth", $("#years").val())
        updateNumberOfDays();
    },
    'change #days': function(e) {
        Session.set("DDofdateOfBirth", $("#days").val())
    },
    "change #terms2": function(e) {
        if ($("input[id=terms2]:checked").length !== 0) {
            Session.set('termsLength2', $("input[id=terms2]:checked").length);
        } else {
            Session.set('termsLength2', undefined);
            Session.set('termsLength2', null);
        }
    },
    "change #state2": function() {
        Session.set("stateOfAssoc2", $("#state2").val());
    },
    'change  #months_I2': function(e) {
        Session.set("MMOfINC2", $("#months_I2").val())
        updateNumberOfDays_L();
    },
    'change #years_I2': function(e) {
        Session.set("YYOfINC2", $("#years_I2").val())
        updateNumberOfDays_L();
    },
    'change #days_I2': function(e) {
        Session.set("DDOfINC2", $("#days_I2").val());
    },
    'change #abbrevationclubName': function(e) {
        $("#setForOthersAssociation").html("")
        Session.set("abbrevationclubNameSe", null)
        if ($("#abbrevationclubName").val().trim().length != 0) {
            Meteor.call("academyAbbrevationDuplicates", $("#abbrevationclubName").val().trim(), function(e, res) {
                if (res) {
                    $("#setForOthersAssociation").html("Use different abbrevation name");
                    Session.set("abbrevationclubNameSe", null)
                } else {
                    Session.set("abbrevationclubNameSe", $("#abbrevationclubName").val());
                }
            })
        }
    },
    'keyup #abbrevationclubName': function(e) {
        $("#setForOthersAssociation").html("")
        Session.set("abbrevationclubNameSe", null)
        if ($("#abbrevationclubName").val().trim().length != 0) {
            Meteor.call("academyAbbrevationDuplicates", $("#abbrevationclubName").val().trim(), function(e, res) {
                if (res) {
                    $("#setForOthersAssociation").html("Use different abbrevation name");
                    Session.set("abbrevationclubNameSe", null)
                } else {
                    Session.set("abbrevationclubNameSe", $("#abbrevationclubName").val());
                }
            })
        }
    },
});

var setSessionToNull = function() {
    Session.get('DDofdateOfBirth', null)
    Session.get('YYofdateOfBirth', null)
    Session.get('dateOfBirth', null)
    Session.set('role', null);
    Session.set('playerName', null);
    Session.set('clubName', null);
    Session.set('mobileNumber', null);
    Session.set('dateOfBirth', null);
    Session.set('DDofdateOfBirth', null);
    Session.set('MMofdateOfBirth', null);
    Session.set('YYofdateOfBirth', null);
    Session.set('projectName', null);
    Session.set('domainName', null);
    Session.set('password', null);
    Session.set('userNameContactmodReg2', null);
    Session.set('address', null);
    Session.set('city', null);
    Session.set('pinCode', null);
    Session.set('gender', null);
    Session.set('associationType', null);
    Session.set('associationName', null);
    Session.set('projectName', null);
    Session.set('domainLength', null);
    Session.set('termsLength', null);
    Session.set('checkDOMASSOc', null);
    Session.set('termsLength', null);
    Session.set('selectedAssociationAc', null);
    Session.set('clubNameId', null);
    Session.set("selectParentAssociation", null);
    Session.get('termsLength2', null);
    $('#terms2').prop('checked', false);
    $('#terms').prop('checked', false);
    Session.set("stateOfAssoc", null);
    Session.set("MMOfINC", "MM");
    Session.set("YYOfINC", "YYYY");
    Session.set("DDOfINC", "DD");
    Session.set("stateOfAssoc2", null);
    Session.set("MMOfINC2", "MM");
    Session.set("YYOfINC2", "YYYY");
    Session.set("DDOfINC2", "DD");
    Session.set("abbrevationclubNameSe", null);
    Session.set("assocAbbNameSe", null);
}