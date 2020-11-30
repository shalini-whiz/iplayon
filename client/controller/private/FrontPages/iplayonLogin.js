import {
    regEm
}
from '../../../regexExp.js'

Template.iplayonLogin.onCreated(function() {
    this.subscribe("userOtp");
});

Template.iplayonLogin.onRendered(function() {
    $('#application-iplayonLogin').validate({
        rules: {
            password: {
                required: true
            },
            emailAddress: {
                required: true,
            }
        },

        // Display only one error at a time
        showErrors: function(errorMap, errorList) {
            $("#application-iplayonLogin").find("input").each(function() {
                $(this).removeClass("error");
            });
            $("#emailIdForget").html("");
            if (errorList.length) {
                $("#emailIdForget").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + errorList[0]['message']);
                $(errorList[0]['element']).addClass("error");
            }
        },

        messages: {
            password: {
                required: "Please enter your password to login."
            },
            emailAddress: {
                required: "Please enter your email address to login.",
                email: "Please enter a valid email address."
            }
        },

        submitHandler: function() {
            try{
            var ep = functionToCheckPhoneOrEmailLogin($('[name="emailAddress"]').val().trim())
            if(ep == 0){
                $("#emailIdForget").html("Enter email address");
            }
            if(ep == 1){
                Meteor.call("onlyApprovedUsersLogin",$('[name="emailAddress"]').val().trim(),ep,function(e,res){
                if(e){
                    $("#emailIdForget").html(e.reason);
                }
                else{

                    if(res == false ){
                        $("#iplayonLogin").modal('hide')
                        //code here
                        $("#renderIplayonLogin").empty()
                        Blaze.render(Template.loginDisablePopup, $("#renderIplayonLogin")[0]);
                        $('#loginDisablePopup').modal({
                            backdrop: 'static',
                            keyboard: false
                        })

                    }
                    else if(res == undefined){
                        $("#emailIdForget").html("Invalid user");
                    }
                    else if(res == true){                        
                        var email = $('[name="emailAddress"]').val().trim()
                        
                        user = {
                            email: email,
                            password: $('[name="password"]').val()
                        }

                        var emailId = email;

                        var status = true//emailId.search(/dispostable/i);
                        //var status = -1;
                        if (status == false){// >= 0) {
                            $("#emailIdForget").html("Invalid email-id");
                            $('[name="emailAddress"]').value = "";
                        } else {
                            if(ep==1){
                                 // Log the user in.
                                Meteor.loginWithPassword(user.email, user.password, function(error, response) {
                                    if (error) {
                                        $("#emailIdForget").html(error.reason);
                                    } else {
                                    }
                                });
                            }else{
                                $("#emailIdForget").html("Invalid email-id");
                            }
                            /*else if(ep==2){
                                //get username and userid
                                Meteor.call("getUsernameForPhone",user.email,function(e,resid){
                                    if(e){
                                        $("#emailIdForget").html(e.reason);
                                    }else if(resid){
                                        Meteor.loginWithPassword(resid, user.password, function(error, response) {
                                            if (error) {
                                                $("#emailIdForget").html(error.reason);
                                            } else {
                                            }
                                        });
                                    }
                                })
                            }*/
                        }
                    }
                }
                })
            }
            }catch(e){
            }
        }
    });
});

Template.iplayonLogin.helpers({
    "tournamentNAmeToSubscribe":function(){
        if(Session.get("loginTournamentId")){
            var s = ReactiveMethod.call("myeventsUnderTournHelper", Session.get("loginTournamentId"));
            if(s)
                return s;
        }
    }
});

Template.iplayonLogin.events({
    'submit form': function(e) {
        // Prevent form from submitting.
        e.preventDefault();
        //Meteor.call("sendSubscriptionEmailAPI",true)
    },
    "click #closeLoginPopupIplayon": function(e) {
        e.preventDefault();
        $("#iplayonLogin").modal('hide');
        $('.modal-backdrop').remove();
        $("#renderIplayonLogin").empty()
        Session.set("loginTournamentId",undefined)
    },
    "click #signInButtonIplayon": function(e) {
        e.preventDefault()
        $("#iplayonLogin").modal('hide');
        $('.modal-backdrop').remove();
        $('#application-signup').css('display', 'inline-block !important');
        Router.go("/registerPage1")
    },
    'click #forgotText': function() {

        // Email-id to send Verification code
        var emailId = $("#userName").val().trim();
        var status = emailId.search(/dispostable/i);
        //var status = -1;
        if (status >= 0) {
            $("#emailIdForget").text("Invalid email-id");
            $("#userName").value = "";
        } else {
            // Check if your email-id is enetered
            // or not
            if ($("#userName").val().trim().length <= 0) {
                // If the email-id is not entered then 
                $('#emailIdForget').html("<span class='glyphicon glyphicon-remove-sign red'></span> " + 'Enter Your email-id to send Verification code');
            } else if ($("#userName").val().length != 0) {
                Meteor.call("findWho_ForgotPAss", $("#userName").val().trim(), function(e, res) {
                    if (res) {

                        // If the email-id is entered
                        $('#emailIdForget').html('</br>');

                        // Before sending an email, send the session 
                        // and the // Session for verification code
                        // First generate a 4-digit random code
                        // as verification code
                        var min = 1000;
                        var max = 9999;
                        var verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;

                        // Set the session
                        Session.set("codeLogin", verificationCode);
                        Session.set("emailIdLogin", emailId);


                        var xData = {
                            // teamName[0].teamManager
                            verificationCode: Session.get("codeLogin"),
                            emailId: Session.get("emailIdLogin")

                        };


                        // Send the mail
                        Meteor.call("sendEmail", xData, function(error, response) {

                            //$('*').css('cursor','wait');

                            if (response) {
                                // change the cursor to default
                                //$('*').css('cursor','default');

                                $("#iplayonLogin").modal('hide');
                                $('.modal-backdrop').remove();
                                // Route to Login-forgot password
                                Router.go("loginForgotPassword", {
                                    _PostId: ":" + emailId
                                });


                            } else {
                                // change the cursor to default
                                // $('*').css('cursor','default');

                                $("#emailIdForget").text("Could not send an email!! Please try again");
                            }

                        });
                    } else {
                        $('#emailIdForget').html("<span class='glyphicon glyphicon-remove-sign red'></span> " + 'Your new to IplayOn,please register');
                    }
                })
            }

        }
    }
});

var functionToCheckPhoneOrEmailLogin = function(emailLogin){
    try{
        var re  = regEm
        var re2 = /^\d{10}$/

        var s = emailLogin//.split("loginForPlayerIplayOn")

        /*if(s[1] != undefined){
            emailLogin = s[0]
        }*/


        if(re.test(emailLogin)){
            return 1
        }
        /*else if(re2.test(emailLogin)){
            return 2
        }*/
        else{
            return 0
        }
    }catch(e){
    }
}

//loginDisablePopup

Template.loginDisablePopup.onCreated(function() {
    $(".modal-backdrop").remove();
});


Template.loginDisablePopup.onRendered(function() {

});

Template.loginDisablePopup.helpers({

});


Template.loginDisablePopup.events({
    "click #closePopup":function(){
        $(".modal-backdrop").remove();
        $('#loginDisablePopup').modal('hide')
    },
})