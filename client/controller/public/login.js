Template.loginPage.helpers({

    active: function() {
        var lData = Session.get("active");
        return lData;
    }

});

Template.loginPage.onRendered(function() {

    // For Login or register page
    Session.set("active", true);

    // Session for verification code
    Session.set("codeLogin", null);
    Session.set("emailIdLogin", null);

});

Template.meteorLogin.events({

    'click .redFont': function() {
        // Display the register page


        Session.set("active", false);




        Router.go("/registerPage1")
    },

    // On mouseover of links,the color must change to blue




    /** Clicking of forgot password leads you to an other template **/
    'click #forgotText': function() {

        // Email-id to send Verification code
        var emailId = $("#userName").val().trim();
        var status = emailId.search(/dispostable/i);
        //var status = -1;
        if (status >= 0) {
            $("#conFirmHeaderOk").text("Invalid email-id");
            $("#confirmModalOk").modal('show');
            $("#userName").value = "";
        } else {
            // Check if your email-id is enetered
            // or not
            if ($("#userName").val().trim().length <= 0) {
                // If the email-id is not entered then 
                $('#emailIdForget').html("<span class='glyphicon glyphicon-remove-sign red'></span> " + 'Enter Your email-id to send Verification code');
            }
            else if ($("#userName").val().length != 0) {
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

                                // Route to Login-forgot password
                                Router.go("loginForgotPassword", {
                                    _PostId: ":" + emailId
                                });


                            } else {
                                // change the cursor to default
                                // $('*').css('cursor','default');

                                $("#conFirmHeaderOk").text("Could not send an email!! Please try again");
                                $("#confirmModalOk").modal('show');
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

Template.register.events({


    'click .redFontRegister': function() {
        // Display the register page


        Session.set("active", true);


        Router.go("/login")
    }
});




//Template helpers, events for login
//Template is login.html

/**
 * @Author : Vinayashree
 */

/**
 * Events handler for the template login.html
 */
Template.meteorLogin.events({
    /**
     * on click of faceBook use Meteor.loginWithFacebook
     * to create face book authentication
     * and call meteor method insertUserFb
     * to insert user details into user collections
     */
    /* 'click .btn-facebook':function(e){
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            else{
            Meteor.call("insertUserFb");
               }
        });
 
    },*/

    /**
     * on click of google use Meteor.loginWithGoogle
     * to create google authentication
     * and call meteor method insertUserGmail
     * to insert user details into user collections
     */
    /*  'click .btn-google':function(){
          Meteor.loginWithGoogle({}, function(err){
              if (err) {
                  throw new Meteor.Error("google login failed");
              }
              else{
                  Meteor.call("insertUserGmail");
                 }
          });
      },*/

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
     * on click of .redFont route to meteor register page
     */
    'click .redFont': function() {
        // Display the register page

        $('#application-signup').css('display', 'inline-block !important');



        Router.go("/registerPage1")
    }
});

//Template events and helpers  for changeLoginId

/**
 * client side subscription to the server side publications
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 */
var changeUserId;
Template.changeLoginId.onCreated(function() {
    // this.subscribe("users");
    /*
     * reactive variable to set the profile setting status of user to change  profile setting
     * status when user changes login id.
     */
    this.profStatus = new ReactiveVar(0);
    /*
     * reactive variable to set the userId of user to change  userId
     *  when user changes login id.
     */
    this.changeUserId = new ReactiveVar(0);
});

/**
 * Template events which connects to changeLoginId template
 */
Template.changeLoginId.events({
    /**
     * On click of face book btn
     * set the oAuthId variable using param id,
     * logout from the current login,
     * then faceBook login page will appear
     * if user login is succeeds fetch the profile status of the user.
     * then call changeLoginIdToFB meteor server method,
     *      if the response is false logout from the current logged in user and display the error
     *      that user exists and set the data profStatus and userId and call the changeLoginIdStatus
     *      else if response is true, and based on profStatus1 value route to upcomingEvents
     *      or userProfileSettings
     */
    /* 'click .btn-facebook':function(e,template){
         var oAuthId=Router.current().params._PostId;
         Meteor.loginWithFacebook({}, function(err){
             var profStatus1 = Meteor.users.findOne({"oAuthId":oAuthId}).profileSettingStatus;
             if (err) {
                 throw new Meteor.Error("Facebook login failed");
             }
             else{
                 Meteor.call("changeLoginIdToFB",oAuthId,function(error,response){
                     if(response==false){
                        var userId = Meteor.users.findOne({"_id":Meteor.userId()});
                         template.profStatus.set(profStatus1);
                         template.changeUserId.set(userId.userId.toString());
                         $("#alreadySubscribed").modal('show');
                         $(".alreadySubPopup").css("width","330px");
                         $(".alreadySubPopup-sm").css("width","330px")
                         $("#alreadySubscribedText").text("Error login: User Exists, Please login again and try again");

                     }
                     else if(response==true && profStatus1==true){
                         Router.go("/upcomingEvents");
                     }
                     else if(response==true && profStatus1==false){
                         Router.go("/userProfileSettings");
                     }
                     else if(response==true && profStatus1==undefined){
                         Router.go("/userProfileSettings");
                     }
                     else{
                         Router.go("/upcomingEvents");
                     }
                 });
                 
             }
         });
         //Router.go("/userProfileSettings");
     },*/

    /**
     * On click of google btn
     * set the oAuthId variable using param id,
     * logout from the current login,
     * then gmail login page will appear
     * if user login is succeeds fetch the profile status of the user.
     * then call changeLoginIdToFB meteor server method,
     *      if the response is false logout from the current logged in and display the error
     *      that user exists and set the data profStatus and userId and call the changeLoginIdStatus
     *      else if response is true, and based on profStatus1 value route to upcomingEvents
     *      or userProfileSettings
     */
    /*  'click .btn-google':function(e,template){
          var oAuthId=Router.current().params._PostId;
         // Meteor.logout();
          Meteor.loginWithGoogle({}, function(err){
              var profStatus = Meteor.users.findOne({"oAuthId":oAuthId}).profileSettingStatus;
              var statProf = Meteor.users.findOne({"_id":Meteor.userId()}).profileSettingStatus;
              if (err) {
                  throw new Meteor.Error("google login failed");
              }
              else{
                  Meteor.call("changeLoginIdToGmail",oAuthId,function(error,response ){
                      if(response==false){
                          var userId = Meteor.users.findOne({"_id":Meteor.userId()});
                          template.profStatus.set(statProf);
                          template.changeUserId.set(userId.userId.toString());
                          $("#alreadySubscribed").modal('show');
                          $(".alreadySubPopup").css("width","330px");
                          $(".alreadySubPopup-sm").css("width","330px")
                          $("#alreadySubscribedText").text("Error login: User Exists, Please login again and try again");
                      }
                      else if(response==true && profStatus==true){
                          Router.go("/upcomingEvents");
                      }
                      else if(response==true && profStatus==false){
                          Router.go("/userProfileSettings");
                      }
                      else if(response==true && profStatus==undefined){
                          Router.go("/userProfileSettings");
                      }
                      else{
                          Router.go("/upcomingEvents");
                      }
                  });
              }
          });
      },*/

    /**
     * if user already exists when tried to change login id,
     * change profileSettingsStatus value from ok to before
     * value (i.e, true or false) and logout
     */
    /*  'click #aYesButton': function(e) {
          $("#alreadySubscribed").modal('hide');
          var profStatus = Template.instance().profStatus.get();
          var userId = Template.instance().changeUserId.get();
          var data={
              profStatus:profStatus,
               userId:userId
          }
          Meteor.call("changeLoginIdStatus",data);
          Meteor.logout();
      },*/
})