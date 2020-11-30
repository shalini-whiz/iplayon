/*
 * Route Hooks
 * Hook functions for managing user access to routes.
 */
/*
 * Define Hook Functions
 */
/*
 * Hook: Check if a User is Logged In
 * If a user is not logged in and attempts to go to an authenticated route,
 * re-route them to the login screen.
 */
checkUserLoggedIn = function() {
    if (!Meteor.loggingIn() && !Meteor.user()) {
        Router.go('/iplayonHome');
    } else {
        this.next();

    }
}

/*
 * Hook: Check if a User Exists
 * If a user is logged in and attempts to go to a public route, re-route
 * them to the index path.
 */

export const userAuthenticated = function() {
        try {
            if (!Meteor.loggingIn() && Meteor.user()) {
                var s = Meteor.users.findOne({
                    _id: Meteor.userId()
                });
                if (s) {
                    $('#iplayonLogin').modal('hide');
                    $('.modal-backdrop').remove();
                    /*if (s.role == undefined || s.role == null) {
                        Meteor.logout();
                        var min = 1000;
                        var max = 9999;
                        var verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;
                        Session.set("codeRegister", verificationCode);
                        Session.set("emailIdRegister", s.emails[0].address);
                        var xData = {
                            verificationCode: Session.get("codeRegister"),
                            emailId: Session.get("emailIdRegister")
                        }
                        Meteor.call("sendEmail", xData, function(error, response) {
                            if (response) {
                                Session.set("firstOTPStatus", "sent");
                            } else {
                                $("#conFirmHeaderOk").text("Please verify your email-id");
                                $("#confirmModalOk").modal('show');
                            }
                        });

                        Router.go("registerPage2", {
                            _PostId: ":" + s.emails[0].address
                        });
                    }*/
                    // if the user has not completed the signup
                    if (s.profileSettingStatus == false) {
                        Router.go('/userProfileSettings');
                    } else if (s.profileSettingStatus == true) {
                        try {
                            Session.set("playerDBName",undefined)
                            Meteor.call("testOnLogin")
                            routeForsubscription(s)
                            this.next()
                        } catch (e) {
                        }
                    } else if (s.profileSettingStatus == "ok") {
                        Meteor.logout();
                        Router.go('/iplayonHome');
                        //Meteor.call("changeLoginIdStatus",s.userId);
                    }
                }

            } else {
                //$('#iplayonLogin').modal('hide')
                //$('.modal-backdrop').remove();
                this.next();
            }
        } catch (e) {}
    }
    /*
     * Run Hooks
     */

export const routeForsubscription = function(xData) {
    Session.set("hyperLINKValue",undefined)
    if(Session.get("loginTournamentId")==undefined||Session.get("loginTournamentId")==null){
        Router.go("/upcomingEvents")
    }
    else if (Session.get("loginTournamentId") != undefined) {
        var data = {
            tournamentId: Session.get("loginTournamentId"),
            subscriberId: xData.userId
        }
        Meteor.call("individualEventsSubscriptionExternalAPI", data, function(err, res) {
            try {
                if (res) {
                     //check for response is hyperlink
                    if(res.status =="success" && res.hyperLINK==true&&res.data&&res.data.trim().length!=0){
                        Session.set("errorResponseToSubscribe", "Redirect to hyper link?")
                        $("#renderIplayonLogin").empty()
                        Blaze.render(Template.confirmModalRedirect, $("#renderIplayonLogin")[0]);
                        $("#confirmModalRedirect").modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $("#confirmModalRedirectLog").text("Redirect to hyperlink to subscribe?");
                        Session.set("hyperLINKValue",res.data.trim())
                    }
                    else if (res[0] && res[0].status != undefined) {
                        if (res[0].status == "success" && res[0].data == true) {
                            if (res[0].routeValue && res[0].routeValue != undefined) {
                                Meteor.call("upcomingListsAndStatus", data.tournamentId, function(error, response) {})
                                if (res[0].routeValue == "entryFromAcademy") {
                                    Router.go(res[0].routeValue, {
                                        _PostId: data.tournamentId,
                                        page: 1
                                    });
                                } else {
                                    Router.go(res[0].routeValue, {
                                        _PostId: data.tournamentId,
                                    });
                                }
                                if(Session.get("previousLocationPath")==undefined)
                                    Session.set("previousLocationPath", "iplayonProfile");
                            }
                        } else if (res[0].status == "failure" && res[0].data == false) {
                            if (res[0].response && res[0].response.trim().length != 0) {
                                Session.set("errorResponseToSubscribe", res[0].response)
                            } else {
                                Session.set("errorResponseToSubscribe", "You cannot subscribe")
                            }
                            $("#renderIplayonLogin").empty()
                            Blaze.render(Template.subscriptionPageErrorPopup, $("#renderIplayonLogin")[0]);
                            $('#subscriptionPageErrorPopup').modal({
                                backdrop: 'static',
                                keyboard: false
                            });

                            //
                        }
                    }
                }
                if (err){}
            } catch (e) {
            }
        })
    } else {
        Router.go('/upcomingEvents');
    }
}

Router.onBeforeAction(checkUserLoggedIn, {
    except: [
        'signup',
        'loginForgotPassword',
        'registerPage2',
        'reset-password',
        'registerPage1',
        'modReg1',
        'pdf',
        'en/terms/index.html',
        'Activate',
        'iplayonHome',
        'aboutIplayOn',
        'con',
        'eventTournamentDraws1',
        'homeResults',
        'iPlayOnPolicy'

    ]
});


Router.onBeforeAction(userAuthenticated, {
    only: [
        'signup',
        'loginForgotPassword',
        'reset-password',
        'registerPage1',
        'registerPage2',
        'modReg1',
        'pdf',
        'en/terms/index.html',
        'Activate',
        'iplayonHome',
        'aboutIplayOn',
        'con',
        'eventTournamentDraws1',
        'homeResults',
        'iPlayOnPolicy'

    ]
});