Template.EditAdminArticles.helpers({
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
    selectedArtTitle: function() {
        if (Session.get("clickEditSessiontitle") != undefined && Session.get("clickEditSessiontitle") != null) {
            return Session.get("clickEditSessiontitle")
        }
    },
    selectedArtDesc: function() {
        if (Session.get("clickEditSessionArtDesc") != undefined && Session.get("clickEditSessionArtDesc") != null) {
            return Session.get("clickEditSessionArtDesc")
        }
    },
    selectedArtStatus: function() {
        if (Session.get("clickEditSessionArtStatus") != undefined && Session.get("clickEditSessionArtStatus") != null) {
            if (Session.get("clickEditSessionArtStatus").toLowerCase() == "active")
                return true
        }
    },
    selectedArtStatusInActive: function() {
        if (Session.get("clickEditSessionArtStatus") != undefined && Session.get("clickEditSessionArtStatus") != null) {
            if (Session.get("clickEditSessionArtStatus").toLowerCase() == "inactive")
                return true
        }
    },
    typeOfCategory: function() {
        try {
            let r = categoryOfPublisher.findOne({});
            if (r && r.category && r.category.length != 0) {
                return r.category
            }
        } catch (e) {
            displayMessage(e)
        }
    },
    selectedCategory: function() {
        if (Session.get("clickEditSessionselectedCategory") != undefined && Session.get("clickEditSessionselectedCategory") != null) {
            if (Session.get("clickEditSessionselectedCategory") == this)
                return true
        }
    },
});

Template.EditAdminArticles.events({
    "click #update": function(e) {
        try {
            e.preventDefault();
            var selectedId = "Articles";
            var selectedCategory = $("#typeOfCategory").val()
            if (selectedId && Session.get("clickEditSession") != undefined && Session.get("clickEditSession") != null) {
                if (Session.get("selectedPlayerUserIdSess")) {
                    if (Session.get("typeOfPublisherSess")) {
                        if ($("#titleOfArticle").val() && $("#titleOfArticle").val().trim().length != 0) {
                            if ($("#descOfArticle").val() && $("#descOfArticle").val().trim().length != 0) {
                                if (selectedCategory && selectedCategory.trim().length != 0 && selectedCategory != "0") {
                                    var data = {
                                        types: selectedId,
                                        userId: Session.get("selectedPlayerUserIdSess"),
                                        role: Session.get("typeOfPublisherSess"),
                                        titles: $("#titleOfArticle").val(),
                                        articleDesc: $("#descOfArticle").val(),
                                        statusOfArticles: $("#statusOfArticles").val(),
                                        articleId: Session.get("clickEditSession"),
                                        category: $("#typeOfCategory").val()
                                    }

                                    Meteor.call("updateArticlesPublished", data, function(e, res) {
                                        if (e) {
                                            displayMessage(e)
                                        } else if (res) {
                                            if (res.data != 0) {
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

            } else {
                displayMessage("select type of feature")
            }
        } catch (e) {
            displayMessage(e)
        }
    }
})

Template.EditAdminArticles.onRendered(function() {
    this.subscribe("packsOfPublisherPacks");
    this.subscribe("packsOfCategoriesPacks");
    this.subscribe("packageFeatures");

})

Template.EditAdminPacks.onRendered(function() {
    this.subscribe("packsOfPublisherPacks");
    this.subscribe("packsOfCategoriesPacks");
    this.subscribe("packageFeatures")

})

Template.EditAdminPacks.helpers({
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
    selectedSessionOfPack: function() {
        if (Session.get("clickEditSessionPack")) {
            var s = []
            s.push(Session.get("clickEditSessionPack"))
            return s
        }
    },
    "typeOfPlan": function() {
        try {
            let r = packsOfPublisher.findOne({});
            if (r && r.packs && r.packs.length != 0) {
                return r.packs
            }
        } catch (e) {
            displayMessage(e)
        }
    },
    typeOfCategory: function() {
        try {
            let r = categoryOfPublisher.findOne({});
            if (r && r.category && r.category.length != 0) {
                return r.category
            }
        } catch (e) {
            displayMessage(e)
        }
    },
    selectedCategory: function() {
        if (Session.get("clickEditSessionselectedCategory") != undefined && Session.get("clickEditSessionselectedCategory") != null) {
            if (Session.get("clickEditSessionselectedCategory") == this)
                return true
        }
    },
    selectedArtStatus: function() {
        if (Session.get("clickEditSessionArtStatus") != undefined && Session.get("clickEditSessionArtStatus") != null) {
            if (Session.get("clickEditSessionArtStatus").toLowerCase() == "active")
                return true
        }
    },
    selectedArtStatusInActive: function() {
        if (Session.get("clickEditSessionArtStatus") != undefined && Session.get("clickEditSessionArtStatus") != null) {
            if (Session.get("clickEditSessionArtStatus").toLowerCase() == "inactive")
                return true
        }
    },
    selectedPlanType: function() {
        if (Session.get("clickEditSessionArtPlan") != undefined && Session.get("clickEditSessionArtPlan") != null) {
            if (Session.get("clickEditSessionArtPlan") == this)
                return true
        }
    },
    packageFeatureList:function(){
        try {
            let r = packFeatures.findOne({});
            if (r && r.features && r.features.length != 0) {
                return r.features
            }
        } catch (e) {} 
    },
    getValue:function(featureKey,featureColl)
    {
        try{       
            var found = featureColl.filter(function(item) { 
                return item.key === featureKey });
            if(found != undefined && found != null && found.length > 0)
            {
                return found[0].value
            }
        }catch(e){

        }
    }
});

Template.EditAdminPacks.events({
    "click #update": function(e) {
        try {
            e.preventDefault();
            var selectedId = "Packs"
            var selectedCategory = $("#typeOfCategory").val()


            if (selectedId && selectedId == "Packs" && Session.get("clickEditSession") != undefined && Session.get("clickEditSession") != null) 
            {
                if ($("#palnType").val() && $("#palnType").val().trim().length != 0 && $("#AmountOfPack").val() && $("#AmountOfPack").val().trim().length != 0 &&
                    //$("#messageLimit").val() && $("#messageLimit").val().trim().length != 0 &&
                    //$("#videoMinutesLimit").val() && $("#videoMinutesLimit").val().trim().length != 0 && $("#videoAnalysisLimit").val() && 
                    //$("#videoAnalysisLimit").val().trim().length != 0 && 
                    $("#validityDays").val() && $("#validityDays").val().trim().length != 0) {
                    if (Session.get("selectedPlayerUserIdSess")) {
                        if (Session.get("typeOfPublisherSess")) {
                            if ($("#titleOfArticle").val() && $("#titleOfArticle").val().trim().length != 0) {
                                if ($("#descOfArticle").val() && $("#descOfArticle").val().trim().length != 0) {
                                    if (selectedCategory && selectedCategory.trim().length != 0 && selectedCategory != "0") {

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


                                        var data = {
                                            types: selectedId,
                                            userId: Session.get("selectedPlayerUserIdSess"),
                                            role: Session.get("typeOfPublisherSess"),
                                            titles: $("#titleOfArticle").val().trim(),
                                            articleDesc: $("#descOfArticle").val().trim(),
                                            amount: $("#AmountOfPack").val().trim(),
                                            //messageLimit: $("#messageLimit").val().trim(),
                                            //videoMinutesLimit: $("#videoMinutesLimit").val().trim(),
                                            //videoAnalysisLimit: $("#videoAnalysisLimit").val().trim(),
                                            validityDays: $("#validityDays").val().trim(),
                                            palnType: $("#palnType").val().trim(),
                                            packId: Session.get("clickEditSession"),
                                            status: $("#statusOfArticles").val(),
                                            category: $("#typeOfCategory").val(),
                                            "features":dataFeatures
                                        }
                                        Meteor.call("updatePacksPublished", data, function(e, res) {
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
                } else {
                    displayMessage("require all fields")
                }
            }
        } catch (e) {
            displayMessage(e)
        }
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
    "click #updateOnlyStatus": function(e) {
        var selectedId = "Packs"
        if (selectedId && selectedId == "Packs" && Session.get("clickEditSession") != undefined && Session.get("clickEditSession") != null) {
            var data = {
                types: selectedId,
                userId: Session.get("selectedPlayerUserIdSess"),
                role: Session.get("typeOfPublisherSess"),
                packId: Session.get("clickEditSession"),
                status: $("#statusOfArticles").val()
            }
            Meteor.call("updatePacksStatus", data, function(e, res) {
                if (e) {
                    displayMessage(e)
                } else if (res) {
                    if (res.data != 0) {
                        displayMessage(res.message)
                    } else {
                        displayMessage("cannot save.." + "\n" + res.message)
                    }
                } else {
                    displayMessage("cannot save")
                }
            })
        } else {
            displayMessage("select publisher role, select publisher")
        }
    }
})

