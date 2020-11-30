Template.tournamentProjects.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    var self = this;

    self.autorun(function() {});
})
Template.tournamentProjects.onRendered(function() {
    Session.set("closeStatebut", true)
    Session.set("getUserDetailsTTStatusNotNullSess", true)
    Session.set("getUserStatusNullSess", true)
    Session.set("fetchEventsWithoutStateAssoSess", true)
})

Template.tournamentProjects.onDestroyed(function() {
    Session.set("closeStatebut", true)
    Session.set("getUserStatusNullSess", true)
    Session.set("getUserDetailsTTStatusNotNullSess", true)
    Session.set("fetchEventsWithoutStateAssoSess", true)
})

Template.tournamentProjects.helpers({
    notAdmin: function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = false;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    checkstateprovince: function() {
        try {
            var s = ReactiveMethod.call("checkstateprovinceMethod")
            if (s && Session.get("closeStatebut")) {
                return true
            } else {
                return false
            }
        } catch (e) {}
    },
    checkUserStatusNull: function() {
        try {
            var s = ReactiveMethod.call("getUserStatusNull")
            if (s && Session.get("getUserStatusNullSess")) {
                return true
            } else {
                return false
            }
        } catch (e) {}
    },
    checkUserTTNOtNull: function() {
        try {
            var s = ReactiveMethod.call("getUserDetailsTTStatusNotNull")
            if (s && Session.get("getUserDetailsTTStatusNotNullSess")) {
                return true
            } else {
                return false
            }
        } catch (e) {}
    },

    checkWithoutStateAssocID: function() {
        try {
            var s = ReactiveMethod.call("fetchEventsWithoutStateAssocId")
            if (s && Session.get("fetchEventsWithoutStateAssoSess")) {
                return s
            } else {
                return false
            }
        } catch (e) {

        }
    }


})

Template.tournamentProjects.events({
    "click #saveTourn": function(e) {
        var projectname = $("#projectName").val()
        if (projectname.length == 0) {
            alert("enter project name")
        } else {
            Meteor.call("addTournamentsProject", projectname, function(e, res) {
                if (e) {
                    alert(e.reason)
                } else {
                    if (res && res.status == 0) {
                        alert(res.message)
                    } else if (res && res.status == 1) {
                        alert(res.message)
                    } else {
                        alert("cannot save")
                    }
                }
            })
        }
    },
    "click #updateMainProject": function(e) {
        Meteor.call("updateTournamentProjects", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res && res.status == 0) {
                    alert(res.message)
                } else if (res && res.status == 1) {
                    alert(res.message)
                } else {
                    alert("cannot update")
                }
            }
        })
    },
    "click #updateMeteorUsers": function(e) {
        Meteor.call("updateMeteorUsers", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res && res.status == 0) {
                    alert(res.message)
                } else if (res && res.status == 1) {
                    alert(res.message)
                } else {
                    alert("cannot update")
                }
            }
        })
    },
    "click #userStatusUpdate": function(e) {
        Meteor.call("updateMeteorUsersStatus", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res && res.status == 0) {
                    alert(res.message)
                } else if (res && res.status == 1) {
                    alert(res.message)
                } else {
                    alert("cannot update")
                }
            }
        })
    },
    "click #saveAdminProject": function(e) {
        var projectname = $("#projectNameAdmin").val()
        var dbName = $("#dbNameAdmin").val()
        var data = {
            projectName: projectname,
            dbName: dbName
        }
        if (projectname.length == 0 && dbName.length == 0) {
            alert("enter project name and db name")
        } else {
            Meteor.call("addAdminProjectSports", data, function(e, res) {
                if (e) {
                    alert(e.reason)
                } else {
                    if (res && res.status == 0) {
                        alert(res.message)
                    } else if (res && res.status == 1) {
                        alert(res.message)
                    } else {
                        alert("cannot update")
                    }
                }
            })
        }
    },
    "click #updateAdminProject": function(e) {
        Meteor.call("insertAdminProject", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res && res.status == 0) {
                    alert(res.message)
                } else if (res && res.status == 1) {
                    alert(res.message)
                } else {
                    alert("cannot update")
                }
            }
        })
    },

    "click #userDetailsTT": function(e) {
        Meteor.call("updateInterestedProjectName", "userDetailsTT", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(res)
                }
            }
        })
    },

    "click #associationDetails": function(e) {
        Meteor.call("updateInterestedProjectName", "associationDetails", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(res)
                }
            }
        })
    },

    "click #academyDetails": function(e) {
        Meteor.call("updateInterestedProjectName", "academyDetails", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(res)
                }
            }
        })
    },

    "click #schoolDetails": function(e) {
        Meteor.call("updateInterestedProjectName", "schoolDetails", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(res)
                }
            }
        })
    },

    "click #schoolPlayers": function(e) {
        Meteor.call("updateInterestedProjectName", "schoolPlayers", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(res)
                }
            }
        })
    },

    "click #otherUsers": function(e) {
        Meteor.call("updateInterestedProjectName", "otherUsers", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(res)
                }
            }
        })
    },

    "click #whole": function(e) {
        Meteor.call("updateInterestedProjectNameMeteor", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(res)
                }
            }
        })
    },
    "click #stateProvince": function(e) {
        Meteor.call("changeStateProvince", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(JSON.stringify(res))
                    Session.set("closeStatebut", false)
                }
            }
        })
    },
    "click #userStatusset": function() {
        Meteor.call("setUserStatusForEachRoleUsers", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(JSON.stringify(res))
                    Session.set("getUserStatusNullSess", false)
                }
            }
        })
    },
    "click #userStatunset": function() {
        Meteor.call("unsetUserStatusNull", function(e, res) {
            if (e) {
                alert(e.reason)
            } else {
                if (res) {
                    alert(JSON.stringify(res))
                    Session.set("unsetUserStatusNull", false)
                }
            }
        })
    },
    "click #saveLiveLinks": function(e) {
        try {
            var tournamentId = $("#liveTournamentId").val()
            var liveLinks = $("#liveLinks").val().split(",")
            alert(tournamentId)
            alert(liveLinks)
            if (tournamentId && liveLinks.length) {
                var data = {
                    tournamentId: tournamentId,
                    livelinks: liveLinks
                }
                Meteor.call("insertLiveLink", data, function(e, res) {
                    if (e) {
                        alert(JSON.stringify(e))
                    } else {
                        if (res) {
                            alert(JSON.stringify(res))
                        }
                    }
                })
            } else {
                alert("provide proper live links and tournamentId")
            }
        } catch (e) {
            alert(e)
        }
    },
    "click #updateTourTypedsf": function(e) {
        try {
            Meteor.call("updateTournamentType11Sports", function(e, res) {
                if (e) {
                    alert(JSON.stringify(e))
                } else {
                    if (res) {
                        alert("updated")
                    }
                }
            })
        } catch (e) {
            alert(e)
        }
    },
    "click #updateSchoolDetails": function(e) {
        try {
            alert("sdfjhsjfh ")
            Meteor.call("updateSchoolDetailsAPI", function(e, res) {
                alert("sdfjhsjfhs ")
                if (e) {
                    alert(JSON.stringify(e))
                } else {
                    if (res) {
                        alert(res)
                    }
                }
            })
        } catch (e) {
            alert(e)
        }
    },
    "click #updateStateAssocIdEve": function() {
            try {
                Meteor.call("updateStateAssocIdOfEvents", function(e, res) {
                    if (res) {
                        Meteor.call("fetchEventsWithoutStateAssocId", function(e, res) {
                            if (res) {
                                Session.set("fetchEventsWithoutStateAssoSess", false)
                            } else {
                                Session.set("fetchEventsWithoutStateAssoSess", true)
                            }
                        })
                        alert("updated")
                    } else if (e) {
                        alert(JSON.stringify(e))

                    }
                })
            } catch (e) {
                alert(e)
            }
        }
        //fetchEventsWithoutStateAssocId"
})