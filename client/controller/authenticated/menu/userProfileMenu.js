//Template helpers, events for template userProfileMenu.html
//which is included in myEvents.html,upcomingEvents.html,pastEvents.html
/**
 * @Author Vinayashree
 */
/**
 * client side subscription to the server side publications
 * @SubscribeName: uEventsLimit (used to subscribe to events)
 *                 to get the list of upcoming  events.
 * @SubscribeName: projects(used to subscribe to projects)
 *                 to get the list of projects.
 * @SubscribeName: upcomingListsReadStatus (used to subscribe to upcomingListsReadStatus)
 *                  to get the upcomingLists read and unread status
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 * @SubscribeName: domains (used to subscribe to domains)
 *                 to get the list of domains.
 *
 */
//var FB = require('fb');

Template.userProfileMenu.onCreated(function() {
    //this.subscribe("associationDetails");
    //his.subscribe("academyDetails");
    this.subscribe("onlyLoggedIn");
    this.subscribe("onlyLoggedInALLRoles");

});


Template.userProfileMenu.events({
    'click #userProfile': function(e) {
        e.preventDefault();
        Session.set("previousLocationPath", Iron.Location.get().path);
        Router.go("userProfileSettings");
    },

    /* onClick of user logout 
     * call Meteor.logout
     */
    'click #userLogout': function() {
        $("#confirmlogoutIplayon").modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#conFirmHeaderLog").text("Are you sure you want to Logout ?");
        /* Meteor.logout(function(error) {
             if (error) {
             } else {
             }
         });*/
    },

    'click #userHelp': function(e) {
        e.preventDefault()
        window.open(Router.url("getaboutIplayOn"));
    },

    'click #gotohomePageMenu': function(e) {
        e.preventDefault();
        Router.go("/iplayonProfile")
    },
    'click #downloadApk': function(e) {
        e.preventDefault();


    },
    'click #playersList_2': function(e) {
        e.preventDefault();
        var id = Meteor.users.findOne({
            "_id": Meteor.userId()
        });
        if (id != undefined && id.role !== undefined && Session.get("playerDBName")) {
            var userInfo;
            if (id.role == "Player")
                userInfo = nameToCollection(Session.get("playerDBName")).findOne({
                    userId: Meteor.userId()
                });
            else if (id.role == "Association")
                userInfo =
                associationDetails.findOne({
                    userId: Meteor.userId()
                });
            else if (id.role == "Academy")
                userInfo = academyDetails.findOne({
                    userId: Meteor.userId()
                });
            if (userInfo && id.role == "Association") {
                if (id.associationType == "State/Province/County") {
                    if (userInfo && userInfo.userId !==
                        null && userInfo.userId !== undefined) {
                        Session.setPersistent("anaylticId", userInfo.userId);
                        Session.setPersistent("rankingListId", userInfo.userId);
                        window.open(Router.url("statisticsList", {
                            _id: id._id.toString(),
                            page: 1
                        }));
                    } else {
                        Session.setPersistent("rankingListId", 0);
                        window.open(Router.url("statisticsList", {
                            _id: "asdfghi",
                            page: 1
                        }));
                    }
                } else if (id.associationType == "District/City") {
                    if (userInfo && userInfo.parentAssociationId !==
                        null && userInfo.parentAssociationId !==
                        undefined && userInfo.parentAssociationId != "other" && userInfo.parentAssociationId.length != 0) {
                        if (userInfo.userId != null && userInfo.userId != undefined) {
                            Session.setPersistent("anaylticId", userInfo.userId);
                            Session.setPersistent("rankingListId", userInfo.userId);
                            window.open(Router.url("statisticsList", {
                                _id: userInfo.userId.toString(),
                                page: 1
                            }));
                        } else {
                            Session.setPersistent("rankingListId", 0);
                            window.open(Router.url("statisticsList", {
                                _id: "asdfghi",
                                page: 1
                            }));
                        }
                    } else {
                        Session.setPersistent("rankingListId", 0);
                        window.open(Router.url("statisticsList", {
                            _id: "asdfghi",
                            page: 1
                        }));
                    }
                } else {
                    if (userInfo &&
                        userInfo.associationId !== null && userInfo.associationId !== "other" && userInfo.associationId !== undefined) {
                        Session.setPersistent("anaylticId", userInfo.associationId);
                        Session.setPersistent("rankingListId", userInfo.associationId);
                        window.open(Router.url("statisticsList", {
                            _id: id._id.toString(),
                            page: 1
                        }));
                    } else {
                        Session.setPersistent("rankingListId", 0);

                        window.open(Router.url("statisticsList", {
                            _id: "asdfghi",
                            page: 1
                        }));
                    }
                }

            } else if (userInfo &&
                userInfo.associationId !== null && userInfo.associationId !== "other" && userInfo.associationId !== undefined) {
                Session.setPersistent("anaylticId", userInfo.associationId);
                Session.setPersistent("rankingListId", userInfo.associationId);
                if (id.role != "Association") {
                    window.open(Router.url("statisticsList", {
                        _id: userInfo.associationId.toString(),
                        page: 1
                    }));
                } else {
                    window.open(Router.url("statisticsList", {
                        _id: id._id.toString(),
                        page: 1
                    }));
                }
            } else {
                Session.setPersistent("rankingListId", 0);
                window.open(Router.url("statisticsList", {
                    _id: "asdfghi",
                    page: 1
                }));
            }
        }
    },

    /*'click #rankingList':function(e){
        var id=Meteor.users.findOne({"_id":Meteor.userId()});
        if(id!=undefined&&id.role!==undefined){
            if(id.associationId){
                Session.setPersistent("anaylticId",id.associationId);
                Session.setPersistent("rankingListId",id.associationId);
                if(id.role!="Association"){
                    window.open(Router.url("statistics"));
                }
                else{
                     window.open(Router.url("statistics"));
                }
            }
            else{
                Session.setPersistent("rankingListId",0);
            }
        }
    }*/
    "click #playersRank_2": function(e) {
        e.preventDefault()
        var id = Meteor.users.findOne({
            "_id": Meteor.userId()
        });
        if (id != undefined && id.role !== undefined) {
            if (id.associationId !== null && id.associationId !== "other" && id.associationId !== undefined && id.associationId != "") {
                Session.setPersistent("anaylticId", id.associationId);
                Session.setPersistent("rankingListId", id.associationId);
                if (id.role != "Association") {
                    window.open(Router.url("statistics", {
                        _id: id.associationId.toString()
                    }));
                } else {
                    window.open(Router.url("statistics", {
                        _id: id._id.toString()
                    }));
                }
            }
            /*else if(id.associationId=="other"&&id.parentAssociationId!=null&&id.parentAssociationId!=undefined&&id.parentAssociationId!="other"){
                window.open(Router.url("statistics", {_id:id.parentAssociationId.toString()}));
            }*/
            else {
                Session.setPersistent("rankingListId", 0);
                window.open(Router.url("statistics", {
                    _id: "asdfghi"
                }));
            }
        }
    },
    "click #playersAnalytics_2": function(e) {
        e.preventDefault();
        window.open(Router.url("playerSequenceMain"));
    },
    'click #getTweet': function(e) {
        e.preventDefault();
        Meteor.call("postTweet_NEW", function(e, res) {
            if (res) {}
        })
    },
     'click #sendFeed': function(e) {
        e.preventDefault();
  
/*FB.ui({
  method: 'share',
  href: 'http://www.iplayon.in',
}, function(response){});*/

FB.ui({
  method: 'feed',
  link: 'http://www.iplayon.in',
  caption: 'An example caption',
}, function(response){});



   
    },

    'click #sendCustomTweet': function(e) {
        e.preventDefault();
        $("#rendercustomTweet").empty();
        Blaze.render(Template.customTweet, $("#rendercustomTweet")[0]);
        $("#customTweet").modal({
            backdrop: 'static',
            keyboard: false
        });
    },
    "click #playersChart_2": function(e) {
        e.preventDefault();
        window.open(Router.url("playerAnalyticsRectChart", {
            page: 1
        }));
    },
    "click #testCALENDER2": function(e) {
        e.preventDefault();
        // Meteor.call("createTeams_SchoolTest")
        window.open(Router.url("testCALENDER"))
    },
    /*"click #testCALENDER3":function(e){
        e.preventDefault();
        Meteor.call("deletePlayerFromTeam_SchoolTest")
    },
    "click #testCALENDER4":function(e){
        e.preventDefault();
        Meteor.call("updateTeams_SchoolTest")
    },
    "click #sendEmailOfSchool":function(e){
        e.preventDefault();
        Meteor.call("sendEmailOfSchool")
    }*/
});

Template.userProfileMenu.onRendered(function() {

    Session.setPersistent("rankingListId", 0);

    Meteor.call("getSportsMainDB",false,function(e,res){
        if(res != undefined && res != null && res != false){
            toRet = res
            Session.set("playerDBName",toRet)
        }
        else if(res != undefined && res != null && res == 2){
            toRet = false
            alert("select sport first")
            Session.set("playerDBName",toRet)
        }
        else if(e){
            toRet = false
            Session.set("playerDBName",toRet)
        }
    })

});

var nameToCollection = function(name) {
  return this[name];
}

Template.userProfileMenu.helpers({
    "type": function() {
        var id = Meteor.users.findOne({
            "_id": Meteor.userId()
        });
        if (id != undefined && id.role !== undefined) {
            if (id.role == "Association") {
                return true
            } else
                return false
        }
    },
    checkWho_Stat: function() {
        try {
            var id = Meteor.users.findOne({
                "_id": Meteor.userId()
            });
            if (id != undefined && id.associationId == null || id.associationId == "other") {
                return "Statistics"
            } else
                return "Players"
        } catch (e) {}
    }
})
Template.registerHelper('checkWho_S', function() {
    var id = Meteor.users.findOne({
        "_id": Meteor.userId()
    });
    if (id.associationId == null || id.associationId == "other" || id.associationId == undefined) {
        return false
    } else
        return true
})