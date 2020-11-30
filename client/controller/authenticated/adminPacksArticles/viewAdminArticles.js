

Template.viewAdminArticles.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	var self = this;
    self.autorun(function () {
     self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"),Session.get("typeOfPublisherSess"));
    });
})

Template.viewAdminArticles.onRendered(function(){
	Session.set("typeOfFeatureSess",undefined)
	Session.set("typeOfPublisherSess",undefined)
	Session.set("searchValueOfPublisher",undefined)
	Session.set("selectedPlayerNameSess",undefined)
	Session.set("statPlayerInfo",undefined);
	Session.set("selectedPlayerUserIdSess",undefined)
	Session.set("clickEditSession",undefined)
    Session.set("clickEditSessionPack",undefined)
    Session.set("clickEditSessionArtStatus",undefined)
    Session.set("clickEditSessionArtPlan",undefined)
    Session.set("clickEditSessionselectedCategory",undefined)
})

Template.viewAdminArticles.onDestroyed(function(){
	Session.set("typeOfFeatureSess",undefined)
	Session.set("typeOfPublisherSess",undefined)
	Session.set("searchValueOfPublisher",undefined)
	Session.set("selectedPlayerNameSess",undefined)
	Session.set("statPlayerInfo",undefined);
	Session.set("selectedPlayerUserIdSess",undefined)
	Session.set("clickEditSession",undefined)
    Session.set("clickEditSessionPack",undefined)
    Session.set("clickEditSessionArtStatus",undefined)
    Session.set("clickEditSessionArtPlan",undefined)

})


Template.viewAdminArticles.helpers({
	notAdmin:function(){
		try{
			var emailAddress = Meteor.user().emails[0].address;
			var boolVal = false
			var auth = authAddress.find({}).fetch();
			if(auth){
				for(var i=0;i<auth.length;i++){
					if(emailAddress&&emailAddress==auth[i].data){
						boolVal=false;
					}
					else{
						boolVal=true;
						break;
					}
				};
			}
			return boolVal
		}catch(e){
		}
	},
	typeOfFeature:function(){
		try{
			var features = ["Articles", "Packs"];
			return features
		}catch(e){
		}
	},
	typeOfPublisher:function(){
		try{
			var publisherRole = ["Coach", "Player"]
			return publisherRole
		}catch(e){
		}
	},
	searchResultsForTeams:function(){
        try{
        if(Session.get("searchValueOfPublisher") != undefined){
	        var searchValue = Session.get("searchValueOfPublisher")
	        var defaultRole = "Coach"
	        if(Session.get("typeOfPublisherSess")!=undefined){
	        	defaultRole = Session.get("typeOfPublisherSess")
	        	Session.set("typeOfPublisherSess",defaultRole)
	        }
	        if(searchValue!=undefined&&searchValue.length!=0){
	            var search="";
	            if(defaultRole == "Player"){
	            	search = Meteor.users.find({}).fetch();
	            }
	            if(defaultRole == "Coach"){
	            	search = otherUsers.find({}).fetch();
	            }
	            if(search.length!=0){
	                return search;
	            }
	            else if(searchValue&&search.length==0){
	                var x=[];
	                data={
	                    _id:0,
	                    userName:"No Results"
	                }
	                x.push(data)
	                return x
	            }
	        }
    	}
        }catch(e){
        }
    },
    "selectedPlayerName":function(){
        if(Session.get("selectedPlayerNameSess")){
            var playerDet = Session.get("selectedPlayerNameSess");
            if(playerDet){
            	var arr = []
            	arr.push(playerDet)
                return arr
            }
        }
    },
    "selectedFeature":function(){
    	if(Session.get("typeOfFeatureSess") != undefined && Session.get("typeOfFeatureSess") == "Articles"){
    		return true
    	}
    },
    "selectedFeature2":function(){
    	if(Session.get("typeOfFeatureSess") != undefined && Session.get("typeOfFeatureSess") == "Packs"){
    		return true
    	}
    },
    "articlesForSelectedUserId":function(){
    	if(Session.get("selectedPlayerNameSess")&&Session.get("selectedArticleType")&&Session.get("selectedArticleType")==2){
           var playerDet = Session.get("selectedPlayerUserIdSess");
           if(playerDet){
           		var xData = {
           			userIds : [playerDet]
           		}
           		var s = ReactiveMethod.call("fetchArticlesForGivenUserIdsAdmin",xData)
           		if(s && s.result == true && s.data && s.data.articles && s.data.articles.length != 0){
           			return s.data.articles
           		}
           		else{
           			return []
           		}
           }
        }
        else if(Session.get("selectedPlayerNameSess")&&Session.get("selectedArticleType")&&Session.get("selectedArticleType")==3){
           var playerDet = Session.get("selectedPlayerUserIdSess");
           if(playerDet){
                var xData = {
                    userIds : [playerDet]
                }
                var s = ReactiveMethod.call("fetchPacksForGivenUserIdsAdmin",xData)
                if(s && s.result == true && s.data && s.data.articles && s.data.articles.length != 0){
                    return s.data.articles
                }
                else{
                    return []
                }
           }
        }
    },
    clickEdit:function(){
    	if(Session.get("clickEditSession")!=undefined && Session.get("clickEditSession")!=null&&Session.get("selectedArticleType")&&Session.get("selectedArticleType")==2){
    		return true
    	}
    },
    clickEdit2:function(){
        if(Session.get("clickEditSession")!=undefined && Session.get("clickEditSession")!=null&&Session.get("selectedArticleType")&&Session.get("selectedArticleType")==3){
            return true
        }
    },
    selectedArtTitle:function(){
    	if(Session.get("clickEditSessiontitle")){
    		return Session.get("clickEditSessiontitle")
    	}
    },
    selectedArtDesc:function(){
    	if(Session.get("clickEditSessionArtDesc")){
    		return Session.get("clickEditSessionArtDesc")
    	}
    },
    selectedSessionOfPack:function(){
        if(Session.get("clickEditSessionPack")){
            return Session.get("clickEditSessionPack")
        }
    }
})


Template.viewAdminArticles.events({
	"change #publisherRole":function(e){
		try{
		e.preventDefault();
        var selectedId = $("#publisherRole").val();
        if (selectedId) {
            Session.set("typeOfPublisherSess",selectedId)
        }
		}catch(e){
		}
	},
	'keyup #searchUserForTeam, change #searchUserForTeam,input #searchUserForTeam,keydown #searchUserForTeam ': function(e,template){
        e.preventDefault();
        if(e.target.value.trim().length>=3){
            Session.set("searchValueOfPublisher",e.target.value)
        }
        if(e.target.value.trim().length<3&&(e.keyCode == 8 ||e.keyCode == 46)){
           Session.set("searchValueOfPublisher",e.target.value)
        }
    },
    'focus #searchUserForTeam':function(){
         $("#searchUserForTeam").text("")
    },
    'mouseover p[name=userName]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "green");
    },
    'mouseout p[name=userName]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "rgb(56,56,56)");
    },
    'click div[name=addAcademyMNM_P]':function(e,template){
        try{
        	e.preventDefault();
        	if(this.userId!=undefined){
        		Session.set("searchValueOfPublisher",undefined)
           		Session.set("selectedPlayerNameSess",this)
           		Session.set("selectedPlayerUserIdSess",this.userId)
        	}
        }catch(e){
        }
    },
    'click [name=userSelectedForTeamP]':function(e,template){
        if(this.userId){
            Meteor.call("getCoachPlayerDetails",this.userId,function(err,res){
                if(err){
                    result = err
                }
                else{
                    result = res;
                    Session.set("statPlayerInfo",undefined);
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
    'click #selectedIdToEdit':function(e){
    	e.preventDefault()
        try{
    	if(this._id &&Session.get("selectedArticleType")==2){
    		Session.set("clickEditSession",this._id)
    		Session.set("clickEditSessiontitle",this.title)
    		Session.set("clickEditSessionArtDesc",this.articleDesc)
    		Session.set("clickEditSessionArtStatus",this.status)
            Session.set("clickEditSessionselectedCategory",this.category)
    	}
        if(this._id &&Session.get("selectedArticleType")==3){
            Session.set("clickEditSession",this._id)
            Session.set("clickEditSessionPack",this)
            Session.set("clickEditSessionArtStatus",this.status)
            Session.set("clickEditSessionArtPlan",this.planType)
            Session.set("clickEditSessionselectedCategory",this.category)
        }
        }catch(e){}
    },
    "click #cancel":function(e){
    	Session.set("clickEditSession",undefined)
    },
    "click #CancelView":function(e){
    	e.preventDefault();
        Router.go("/adminMenu");
    }
})

Template.registerHelper("getSLNUMBARticles", function(data) {
    if (data != undefined && data!=null) {
        return parseInt(data + 1);
    }
});