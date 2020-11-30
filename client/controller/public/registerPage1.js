// Subscribe to the users
// Subsribe to users
Template.registerPage1.onCreated(function() {
    //this.subscribe("users");
    this.subscribe("userOtp");
    this.subscribe("timeZone");
    this.subscribe("onlyLoggedIn");
});




// Method to check if the user
// is already registered
$.validator.addMethod("alreadyRegistered", function(value, element) {

    /*if(!(Meteor.users.findOne( { 'emailAddress': value } )))
	{
		// If the user is not registered
		return true;
	}	
	else
	{
		// If the user is already registered
		return false;
	}	*/
    if (value.trim().length !== 0) {
        Meteor.call("findWho_ForExis", value, function(e, res) {
            if (res == false) {
                return false
            } else {
                return true
            }
        })
    }
});



import {
    regEm
}
from '../../regexExp.js'

// Submit handler and validation
Template.registerPage1.onRendered(function() {
    var userRend;
    if(Meteor.userId()){
        userRend = Meteor.users.findOne({_id:Meteor.userId()})
    }
    
    if(userRend&&userRend.role){
        Router.go("/upcomingEvents")
    }
    else{
        // Session for verification code
        Session.set("codeRegister", null);
        Session.set("emailIdRegister", null);

        $('#application-registerPage1').validate({

            rules: {
                emailAddress: {
                    required: true,
                    validTextEmail: regEm,

                    //alreadyRegistered:true
                },

            },
            messages: {
            emailAddress: {
                validTextEmail:"Enter Valid email"
            }
        },
            //errorLabelContainer: "#emailIdForget_registerPage1",
            // Display only one error at a time
            showErrors: function(errorMap, errorList) {
                $("#application-registerPage1").find("input").each(function() {
                    $(this).removeClass("error");
                });
                $("#emailIdForget_registerPage1").html("");
                if (errorList.length) {
                    $('#emailIdForget_registerPage1').css("color", "rgb(179,0,0)");
                    $("#emailIdForget_registerPage1").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + errorList[0]['message']);
                    $(errorList[0]['element']).addClass("error");
                }
            },

            messages: {
                emailAddress: {
                    required: "Please enter your email address to sign up.",
                    email: "Please enter a valid email address.",
                    // alreadyRegistered:"You are already registered.Please login."	 
                },
            },
            submitHandler: function() {
                Meteor.call("registerValidationForUploadPlayers", $("#userName").val().trim(),1 ,function(e, res) {
                    if (res != undefined && res != null && res != false) {
                        $("#conFirmHeaderOk").text(res);
                        $("#confirmModalOk").modal('show');
                    } else if (res != undefined && res != null && res == false){
                        var emailId = $("#userName").val();
                        var status = emailId.search(/dispostable/i);
                        if (status >= 0) {
                            $("#conFirmHeaderOk").text("Invalid email-id");
                            $("#confirmModalOk").modal('show');
                            $("#userName").value = "";
                        } else {
                            var min = 1000;
                            var max = 9999;
                            var verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;
                            Session.set("codeRegister", verificationCode);
                            Session.set("emailIdRegister", emailId);
                            var xData = {
                                verificationCode: Session.get("codeRegister"),
                                emailId: Session.get("emailIdRegister")
                            }
                            Meteor.call("sendEmail", xData, function(error, response) {
                                if (response) {
                                    Session.set("firstOTPStatus","sent");     
                                } else {
                                    $("#conFirmHeaderOk").text("Please verify your email-id");
                                    $("#confirmModalOk").modal('show');
                                }
                            });

                            Router.go("registerPage2", {_PostId: ":" + emailId});
                        }
                    }else if(e){
                        $("#conFirmHeaderOk").text(e.reason);
                        $("#confirmModalOk").modal('show');
                    }
                });
            }
        });
    }
});

// Events
Template.registerPage1.events({
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

    /**
     * Clicking on #goToLogin should
     * re-direct to login
     */
    "click #goToLogin": function(e) {
        Router.go("/iplayonHome");
    },

});

$.validator.addMethod(
    "validTextEmail",
    function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }

);
