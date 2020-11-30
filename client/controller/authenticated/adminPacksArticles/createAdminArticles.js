Template.articlesMainMenu.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    var self = this;
    self.autorun(function() {
        self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"), Session.get("typeOfPublisherSess"));
    });
})
Template.articlesMainMenu.onRendered(function() {
    Session.set("selectedArticleType", undefined)
})
Template.articlesMainMenu.onDestroyed(function() {})
Template.articlesMainMenu.helpers({
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
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
})
Template.articlesMainMenu.events({
    "change #featureArticles": function(e) {
        try {
            e.preventDefault();
            var selectedId = $("#featureArticles").val();
            if (selectedId == 1) {
                Router.go("/createAdminArticles");
            } else if (selectedId == 2) {
                Router.go("/viewAdminArticles")
                Session.set("selectedArticleType", 2)
            } else if (selectedId == 3) {
                Router.go("/viewAdminArticles")
                Session.set("selectedArticleType", 3)
            } else if (selectedId == 4) {
                Router.go("/createInsertUpdatePacks")
            } else if (selectedId == 5) {
                Router.go("/removeInsertedPacks")
            } else if (selectedId == 6) {
                Router.go("/createInsertUpdateCategories")
            } else if (selectedId == 7) {
                Router.go("/removeInsertedCategories")
            } else if (selectedId == 8) {
                Router.go("/addPackFeature")
            }else if (selectedId == 9) {
                Router.go("/removePackFeature")
            }
            else if (selectedId == 10) {
                Router.go("/approveArticles")
            }
        } catch (e) {

        }
    },
})

Template.createAdminArticles.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    var self = this;
    self.autorun(function() {
        self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"), Session.get("typeOfPublisherSess"));
    });
    this.subscribe("packsOfPublisherPacks")
    this.subscribe("packsOfCategoriesPacks");
    this.subscribe("packageFeatures")

})

Template.createAdminArticles.onRendered(function() {
    Session.set("typeOfFeatureSess", undefined)
    Session.set("typeOfPublisherSess", undefined)
    Session.set("searchValueOfPublisher", undefined)
    Session.set("selectedPlayerNameSess", undefined)
    Session.set("statPlayerInfo", undefined);
    Session.set("selectedPlayerUserIdSess", undefined)
})

Template.createAdminArticles.onDestroyed(function() {
    Session.set("typeOfFeatureSess", undefined)
    Session.set("typeOfPublisherSess", undefined)
    Session.set("searchValueOfPublisher", undefined)
    Session.set("selectedPlayerNameSess", undefined)
    Session.set("statPlayerInfo", undefined);
    Session.set("selectedPlayerUserIdSess", undefined)
})


Template.createAdminArticles.helpers({
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
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    typeOfFeature: function() {
        try {
            var features = ["Articles", "Packs"];
            return features
        } catch (e) {

        }
    },
    typeOfPublisher: function() {
        try {
            var publisherRole = ["Coach", "Player"]
            return publisherRole
        } catch (e) {

        }
    },
    searchResultsForTeams: function() {
        try {
            if (Session.get("searchValueOfPublisher") != undefined) {
                var searchValue = Session.get("searchValueOfPublisher")
                var defaultRole = "Coach"
                if (Session.get("typeOfPublisherSess") != undefined) {
                    defaultRole = Session.get("typeOfPublisherSess")
                    Session.set("typeOfPublisherSess", defaultRole)
                }
                if (searchValue != undefined && searchValue.length != 0) {
                    var search = "";
                    if (defaultRole == "Player") {
                        search = Meteor.users.find({}).fetch();
                    }
                    if (defaultRole == "Coach") {
                        search = otherUsers.find({}).fetch();
                    }
                    if (search.length != 0) {
                        return search;
                    } else if (searchValue && search.length == 0) {
                        var x = [];
                        data = {
                            _id: 0,
                            userName: "No Results"
                        }
                        x.push(data)
                        return x
                    }
                }
            }
        } catch (e) {

        }
    },
    "selectedPlayerName": function() {
        if (Session.get("selectedPlayerNameSess")) {
            var playerDet = Session.get("selectedPlayerNameSess");
            if (playerDet) {
                var arr = []
                arr.push(playerDet)
                return arr
            }
        }
    },
    "selectedFeature": function() {
        if (Session.get("typeOfFeatureSess") != undefined && Session.get("typeOfFeatureSess") == "Articles") {
            return true
        }
    },
    "selectedFeature2": function() {
        if (Session.get("typeOfFeatureSess") != undefined && Session.get("typeOfFeatureSess") == "Packs") {
            return true
        }
    },
    "typeOfPlan": function() {
        try {
            let r = packsOfPublisher.findOne({});
            if (r && r.packs && r.packs.length != 0) {
                return r.packs
            }
        } catch (e) {}
    },
    typeOfCategory: function() {
        try {
            let r = categoryOfPublisher.findOne({});
            if (r && r.category && r.category.length != 0) {
                return r.category
            }
        } catch (e) {}
    },
    packageFeatureList:function(){
        try {
            let r = packFeatures.findOne({});
            if (r && r.features && r.features.length != 0) {
                return r.features
            }
        } catch (e) {} 
    }
})

Template.createAdminArticles.events({
    "change #featureType": function(e) {
        try {
            e.preventDefault();
            var selectedId = $("#featureType").val();
            if (selectedId) {
                Session.set("typeOfFeatureSess", selectedId)
            }
        } catch (e) {

        }
    },
    "change #publisherRole": function(e) {
        try {
            e.preventDefault();
            var selectedId = $("#publisherRole").val();
            if (selectedId) {
                Session.set("typeOfPublisherSess", selectedId)
            }
        } catch (e) {

        }
    },
    'keyup #searchUserForTeam, change #searchUserForTeam,input #searchUserForTeam,keydown #searchUserForTeam ': function(e, template) {
        e.preventDefault();
        if (e.target.value.trim().length >= 3) {
            Session.set("searchValueOfPublisher", e.target.value)
        }
        if (e.target.value.trim().length < 3 && (e.keyCode == 8 || e.keyCode == 46)) {
            Session.set("searchValueOfPublisher", e.target.value)
        }
    },
    'focus #searchUserForTeam': function() {
        $("#searchUserForTeam").text("")
    },
    'mouseover p[name=userName]': function(e) {
        $("#searchUserManage_P").text("")
        if (e.target.id != 0)
            $("#" + e.target.id).css("color", "green");
    },
    'mouseout p[name=userName]': function(e) {
        $("#searchUserManage_P").text("")
        if (e.target.id != 0)
            $("#" + e.target.id).css("color", "rgb(56,56,56)");
    },
    'click div[name=addAcademyMNM_P]': function(e, template) {
        try {
            e.preventDefault();
            if (this.userId != undefined) {
                Session.set("searchValueOfPublisher", undefined)
                Session.set("selectedPlayerNameSess", this)
                Session.set("selectedPlayerUserIdSess", this.userId)
            }
        } catch (e) {}
    },
    'click [name=userSelectedForTeamP]': function(e, template) {
        if (this.userId) {
            Meteor.call("getCoachPlayerDetails", this.userId, function(err, res) {
                if (err) {
                    result = err
                } else {
                    result = res;
                    Session.set("statPlayerInfo", undefined);
                    Session.set("statPlayerInfo", result);
                    $("#displayPlayerProfile").empty();
                    Blaze.render(Template.statPlayerInfo, $("#displayPlayerProfile")[0]);
                    $("#statPlayerInfo").modal({
                        backdrop: 'static'
                    });
                }
            });
        }
    },
    'click #save': function() {
        var selectedId = $("#featureType").val();
        var selectedCategory =  $("#typeOfCategory").val()
        if (selectedId && selectedId == "Articles") {
            if (Session.get("selectedPlayerUserIdSess")) {
                if (Session.get("typeOfPublisherSess")) {
                    if ($("#titleOfArticle").val() && $("#titleOfArticle").val().trim().length != 0 && $("#typeOfCategory").val().trim()) {
                        if ($("#descOfArticle").val() && $("#descOfArticle").val().trim().length != 0) {
                            if (selectedCategory && selectedCategory != "0" && selectedCategory.length != 0) {
                                

                                var data = {
                                    types: selectedId,
                                    userId: Session.get("selectedPlayerUserIdSess"),
                                    role: Session.get("typeOfPublisherSess"),
                                    titles: $("#titleOfArticle").val().trim(),
                                    articleDesc: $("#descOfArticle").val().trim(),
                                    category: $("#typeOfCategory").val().trim()
                                }
                                Meteor.call("createArticlesPublished", data, function(e, res) {
                                    if (e) {

                                        displayMessage(e)
                                    } else if (res) {
                                        if (res.data != 0) {
                                            $("#titleOfArticle").val("")
                                            $("#descOfArticle").val("")
                                            displayMessage(res.message)
                                        } else {
                                            displayMessage("cannot save.." + "\n" + res.message)
                                        }
                                    } else {
                                        displayMessage("cannot save")
                                    }
                                })
                            } else {
                                displayMessage("category is invalid")
                            }
                        } else {
                            displayMessage("description is invalid")
                        }
                    } else {
                        displayMessage("title is invalid")
                    }
                } else {
                    displayMessage("select publisher role")
                }
            } else {
                displayMessage("select publisher")
            }

        } else if (selectedId && selectedId == "Packs") {
            if ($("#palnType").val() && $("#palnType").val().trim().length != 0 && $("#AmountOfPack").val() && $("#AmountOfPack").val().trim().length != 0 && 
                $("#validityDays").val() && $("#validityDays").val().trim().length != 0) {
                if (Session.get("selectedPlayerUserIdSess")) {
                    if (Session.get("typeOfPublisherSess")) {
                        if ($("#titleOfArticle").val() && $("#titleOfArticle").val().trim().length != 0) {
                            if ($("#descOfArticle").val() && $("#descOfArticle").val().trim().length != 0) {
                                if (selectedCategory && selectedCategory != "0" && selectedCategory.length != 0) 
                                {
                                    var dataFeatures = [] ;
                                    var packFeatureExist = packFeatures.findOne({});
                                    if (packFeatureExist && packFeatureExist.features && packFeatureExist.features.length != 0) 
                                    {
                                        var featureData = packFeatureExist.features;
                                        for(var m=0;m<featureData.length;m++)
                                        {
                                            if($("[name='"+featureData[m]+"']") != undefined && 
                                                $("[name='"+featureData[m]+"']").val() != undefined &&
                                                $("[name='"+featureData[m]+"']").val().trim().length > 0)
                                            {
                                                var data = {};
                                                data["key"] = featureData[m];
                                                data["value"] = $("[name='"+featureData[m]+"']").val().trim();
                                                dataFeatures.push(data);
                                            }
                                        }
                                    }

                                    if(dataFeatures.length == 0 )
                                    {
                                        displayMessage("Add atleast one feature!!")
                                    }
                                    else
                                    {
                                        var data = {
                                            types: selectedId,
                                            userId: Session.get("selectedPlayerUserIdSess"),
                                            role: Session.get("typeOfPublisherSess"),
                                            titles: $("#titleOfArticle").val().trim(),
                                            articleDesc: $("#descOfArticle").val().trim(),
                                            amount: $("#AmountOfPack").val().trim(),
                                            validityDays: $("#validityDays").val().trim(),
                                            palnType: $("#palnType").val().trim(),
                                            category: $("#typeOfCategory").val().trim(),
                                            "features":dataFeatures
                                        }
                                    
                                        Meteor.call("createPacksPublished", data, function(e, res) {
                                            if (e) {

                                                displayMessage(e)
                                            } else if (res) {
                                                if (res.data != 0) {
                                                    $("#titleOfArticle").val("")
                                                    $("#descOfArticle").val("")
                                                    displayMessage(res.message)
                                                } else {
                                                    displayMessage("cannot save.." + "\n" + res.message)
                                                }
                                            } else {
                                                displayMessage("cannot save")
                                            }
                                        })  
                                    }
          
          
                                    
                                } else {
                                    displayMessage("category is invalid")
                                }
                            } else {
                                displayMessage("description is invalid")
                            }
                        } else {
                            displayMessage("title is invalid")
                        }
                    } else {
                        displayMessage("select publisher role")
                    }
                } else {
                    displayMessage("select publisher")
                }
            } else {
                displayMessage("require all fields")
            }
        } else {
            displayMessage("select type of feature")
        }
    },

    'click #cancel': function(e) {
        e.preventDefault();
        Router.go("/adminMenu");
    },
    "keyup #AmountOfPack": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #messageLimit": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #videoMinutesLimit": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #videoAnalysisLimit": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #featureLimit": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #validityDays": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    }
})