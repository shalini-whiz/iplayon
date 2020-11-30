
Template.managePlayersAssocAcad.onRendered(function(){
	this.subscribe("onlyLoggedIn")
});

Template.managePlayersAssocAcad.onCreated(function(){
	this.callTemplateName = new ReactiveVar(false)
});
//userDetailsTTUsed

Template.managePlayersAssocAcad.onDestroyed(function(){

});

Template.managePlayersAssocAcad.helpers({

	whichTemplate:function(){
		try{
		//if(Meteor.userId()&&(Meteor.user().role=="Association"||Meteor.user().role=="Academy"))
			return Template.instance().callTemplateName.get();
		}catch(e){
		}
	}
});

Template.managePlayersAssocAcad.events({
	"click #addPlayers":function(e,template){
		template.callTemplateName.set("addPlayersManage");
	},
	'click #viewDeletePlayer':function(e,template){
		template.callTemplateName.set("viewDeletePlayer");
 	    Router.go("managePlayersAssocAcad",{page:1})
	}
});

//--add players--///
var addAcademyArray_P=[],addAcademyIdArray_P=[],Academies_P=[],arr2_P=[];
var arrayToAdd=[], arrayToDelete=[];
Template.addPlayersManage.onCreated(function(){
	this.subscribe("usersOther_TT");
	this.subscribe("timeZone");
	this.searchForPlayer = new ReactiveVar(undefined);
	this.searchResults = new ReactiveVar(undefined);
	this.selectPlayers = new ReactiveVar(undefined);
	this.selectPlayersId = new ReactiveVar(undefined);
	this.addAcademyArrayIdSess_P = new ReactiveVar(undefined);
	this.deleteSelectedClub_P  = new ReactiveVar(undefined)
});

Template.addPlayersManage.onRendered(function(){
	addAcademyArray_P=[];
	Academies_P=[],arr2_P=[];
	addAcademyIdArray_P=[];
	var arrayToAdd=[];arrayToDelete=[];
	$('#viewDeletePlayer').removeClass("ip_button_White");
	$('#viewDeletePlayer').addClass("ip_button_DarkGrey");
	$('#addPlayers').removeClass("ip_button_DarkGrey");
	$('#addPlayers').addClass("ip_button_White");

	Session.set("playerDBName",undefined)
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
  return global[name];
};

Template.addPlayersManage.onDestroyed(function(){
	
});

Template.addPlayersManage.helpers({
	searchResultsOfMNM_P: function() {
		try{
			if(Session.get("playerDBName")){
				var searchValue = Template.instance().searchForPlayer.get();
				if(searchValue!=undefined&&searchValue.length!=0){
					var reObj = new RegExp(searchValue, 'i');
					var search="";
					search = nameToCollection(Session.get("playerDBName")).find({ userName: {$regex:reObj},role:"Player"}).fetch();

					if(search.length!=0){
						Template.instance().searchResults.set(search)
						return search;
					}
					else if(searchValue&&search.length==0){
						var x=[];
						data={
							_id:0,
							userName:"No Results"
						}
						x.push(data)
						//if(Meteor.userId()&&(Meteor.user().role=="Association"||Meteor.user().role=="Academy"))
							return x
					}
				}
			}
		}catch(e){
		}
	},
	addedAcademyArray_P:function(){
		if(Template.instance().selectPlayers.get()){
			if(Template.instance().selectPlayers.get()){
				return Template.instance().selectPlayers.get()
			}
		}
	},
	"deleteSelectedClub_P":function(){
		if(Template.instance().deleteSelectedClub_P.get()){
			return Template.instance().deleteSelectedClub_P.get()
		}
	}
});

Template.addPlayersManage.events({
	'keyup #searchUserManage_P, change #searchUserManage_P,input #searchUserManage_P,keydown #searchUserManage_P ': function(e,template){
		e.preventDefault();

	    template.searchForPlayer.set(e.target.value);
	    $("#searchUserManage_P").text("")
	},
	'focus #searchUserManage_P':function(){
		 $("#searchUserManage_P").text("")
	},
	'click div[name=addAcademyMNM_P]':function(e,template){
	 	e.preventDefault()
	 	$("#searchUserManage_P").text("")
	 	template.selectPlayersId.set(undefined);
		template.selectPlayers.set(undefined)	
		template.deleteSelectedClub_P.set(undefined)

		if(e.target.id!=0){
	 		addAcademyArray_P=[]
	 		addAcademyIdArray_P = []
	 		arrayToAdd=[];
		 	var data = {
		 		userId:this.userId,
		 		_id:this.userId,
		 		guardianName:this.guardianName,
		 		address:this.address,
				userName:this.userName,
				state:this.state,
				pinCode:this.pinCode,
				city:this.city,
				phoneNumber:this.phoneNumber,
				emailAddress:this.emailAddress,
				dateOfBirth:this.dateOfBirth,
				gender:this.gender
		 	}
			if (_.findWhere(addAcademyArray_P, data) == null) {
			    addAcademyArray_P.push(data);
			}
			else{
			}
			if (_.findWhere(addAcademyIdArray_P, data.userId) == null) {
			    addAcademyIdArray_P.push(data.userId);
			}
			template.deleteSelectedClub_P.set(undefined)
			template.selectPlayers.set(addAcademyArray_P)
			template.selectPlayersId.set(addAcademyIdArray_P)
			template.searchForPlayer.set(undefined)
		 	$("#searchUserManage_P").val("");
	 	}
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
    "click #addSearchedPLayers":function(e,template){
    	e.preventDefault()
    	
    	if(Template.instance().searchResults.get()){
    		//
    		$("#searchUserManage_P").text("")
			//
			template.selectPlayersId.set(undefined);
			//
			template.selectPlayers.set(undefined)	
			//
			addAcademyArray_P=[]
			//
			addAcademyIdArray_P = []
			//
			arrayToAdd=[];
			//
			template.deleteSelectedClub_P.set(undefined)
    		//
    		$("#searchUserManage_P").val("");  		
    		
    		template.selectPlayersId.set(undefined);
    		template.searchForPlayer.set(undefined);
    		template.selectPlayers.set(Template.instance().searchResults.get())
    	}
    },
    "change #checkedPlayers":function(e,template){
		var num = $('#checkedPlayers:checked').size();
		if($(e.target).is(":checked")){
			var id = this.userId
			if (_.findWhere(arrayToAdd, id) == null) {
    			arrayToAdd.push(id);
			}
			template.selectPlayersId.set(arrayToAdd);
			if(num!=0)
				template.deleteSelectedClub_P.set(num);
			else
				template.deleteSelectedClub_P.set(undefined);
		}	
		else if(!$(e.target).is(":checked")){
			var id=this.userId;
			arrayToAdd =  _.reject(arrayToAdd, function(item) {
        		return item === id; 
    		});
			template.selectPlayersId.set(arrayToAdd);
			if(num!=0)
				template.deleteSelectedClub_P.set(num);
			else
				template.deleteSelectedClub_P.set(num);
		}
	},
	'click #saveDeleteAc1_P':function(e,template){
    	e.preventDefault();
    	try{
	    	var lData = {
	    		associationId: Meteor.user().associationId,
	    		clubNameId: Meteor.user().userId,
	    		clubName:Meteor.user().clubName,
	    		players:Template.instance().selectPlayers.get(),
	    		userId:Template.instance().selectPlayersId.get(),
	    		interestedProjectName:Meteor.user().interestedProjectName,
	    		interestedDomainName:Meteor.user().interestedDomainName
	    	}

	    	Meteor.call("affiliatePlayersBYACADASSOC",lData,function(e,res){
	    		if(res == false){
	    			alert("select sport to add players")
	    		}
				template.searchForPlayer.set(undefined);
				template.searchResults.set(undefined);
				template.selectPlayers.set(undefined);
				template.selectPlayersId.set(undefined);
				template.deleteSelectedClub_P.set(undefined);
				arrayToAdd=[];
	    	})
    	}catch(e){
    	}
    },
    'click #regisNewPlayer':function(e){
    	e.preventDefault();
    	$("#registerNewPlayerRen").empty()
    	Blaze.render(Template.registerNewPlayer2,$("#registerNewPlayerRen")[0]);
    	Session.set("DDofdateOfBirth_P",null)
		$("#registerNewPlayer2_P").modal({
				backdrop: 'static',
				keyboard: false
		});
    },
});

Template.registerHelper('getPlayerState',function(data){
	if(data){
		var getName="";
		var getStateName =timeZone.findOne({"countryName":"India"});
	 	if(getStateName!=undefined&&getStateName.state){
	 		for(var i=0;i<getStateName.state.length;i++){
	 			if(getStateName.state[i].stateId==data){
	 				getName=getStateName.state[i].stateName;
	 				break;
	 			}
	 		}
	 	}
		return getName
	}
});

/********view or delete players*****/
var sUB = false
Template.viewDeletePlayer.onCreated(function(){
	var template = this;
	this.searchName_player = new ReactiveVar(undefined)
	sUB = true;
	var render;
    if (sUB) {
        template.autorun(function() {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var skipCount = parseInt(parseInt((currentPage - 1)) * 10);
        	if(Template.instance().searchName_player.get()==undefined){
        		if(render){
        			render.stop();
        			render = false;
        		}
            	render = template.subscribe('usersAffiliatedTo', skipCount);
            }
            else if(Template.instance().searchName_player.get()!=undefined){
            	if(render){
        			render.stop();
        			render = false;
        		}
            	render = template.subscribe('usersAffiliatedToSearch_Player',Template.instance().searchName_player.get(),skipCount);
            }
        });
    }
    this.subscribe("timeZone");
    this.deleteSelectedClub_P2 = new ReactiveVar(undefined);
    this.deleteUsersDB = new ReactiveVar(undefined);
    this.deleteSelectedClub_P2 = new ReactiveVar(undefined);
});

Template.viewDeletePlayer.onRendered(function(){
	$('#viewDeletePlayer').removeClass("ip_button_DarkGrey");
	$('#viewDeletePlayer').addClass("ip_button_White");
	$('#addPlayers').removeClass("ip_button_White");
	$('#addPlayers').addClass("ip_button_DarkGrey");

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

Template.viewDeletePlayer.onDestroyed(function(){
	this.deleteSelectedClub_P2 = new ReactiveVar(undefined)
});

Template.viewDeletePlayer.helpers({
	listOfAffiliatedUsers:function(){
		if(Session.get("playerDBName")){
		//if(Meteor.userId()&&(Meteor.user().role=="Association"||Meteor.user().role=="Academy"))
			return nameToCollection(Session.get("playerDBName")).find({}).fetch();
		}
	},
	"deleteSelected_player":function(){
		if(Template.instance().deleteSelectedClub_P2.get()){
			return Template.instance().deleteSelectedClub_P2.get()
		}
		else
			return false
	},
	prevPage_player: function() {
        try {
            /*var currentPage = parseInt(Router.current().params.page) || 1;
            var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            return Router.routes.managePlayersAssocAcad.path({
                page: previousPage
            })*/

        } catch (e) {
        }
    },
    nextPage_player: function() {
        try {
            /*var currentPage = parseInt(Router.current().params.page) || 1;
            var nextPage = parseInt(currentPage + 1);
            return Router.routes.managePlayersAssocAcad.path({
                page: nextPage
            })*/
        } catch (e) {
        }
    },
    prevPageClass_player: function() {
        return currentPage_players() <= 1 ? "none" : "";
    },
    nextPageClass_player: function() {
        return hasMorePages_players() ? "" : "none";
    },
    nextPageClassPo_player:function(){
    	return hasMorePages_players() ? "pointer" : "disabled";
    },
    prevPageClassPo_player:function() {
        return currentPage_players() ? "pointer" : "disabled";
    },
});

var currentPage_players = function() {
    return parseInt(Router.current().params.page) || 1;
}

var hasMorePages_players = function() {
    var totalPlayers = Counts.get('userDetailsTTCOunt');
    return currentPage_players() * parseInt(10) < totalPlayers;
}

Template.viewDeletePlayer.events({
	"change #checkedPlayersToDelete":function(e,template){
    	var num = $('#checkedPlayersToDelete:checked').size();
		if($(e.target).is(":checked")){
			var id = this.userId
			if (_.findWhere(arrayToDelete, id) == null) {
    			arrayToDelete.push(id);
			}
			template.deleteUsersDB.set(arrayToDelete);
			if(num!=0){
				template.deleteSelectedClub_P2.set(num);
			}
			else
				template.deleteSelectedClub_P2.set(undefined);
		}	
		else if(!$(e.target).is(":checked")){
			var id=this.userId;
			arrayToDelete =  _.reject(arrayToDelete, function(item) {
        		return item === id; 
    		});
			template.deleteUsersDB.set(arrayToDelete);
			if(num!=0)
				template.deleteSelectedClub_P2.set(num);
			else
				template.deleteSelectedClub_P2.set(undefined);
		}
    },
    "click #searchPlayerNameDisp_P":function(e,template){
    	e.preventDefault()
    	template.deleteSelectedClub_P2.set(undefined)
		template.deleteUsersDB.set(undefined)
    	arrayToDelete=[];
    	var searchValueName = $("#searchPlayerName_P").val();
    	if(searchValueName.trim().length!=0){
    		template.searchName_player.set(searchValueName);
    		Router.go("managePlayersAssocAcad",{page:1})
    	}
    	else {
    		template.searchName_player.set(undefined);
    		Router.go("managePlayersAssocAcad",{page:1})
    	}
    },
    "keydown #searchPlayerName_P":function(e,template){
      if(e.keyCode == 8 ||e.keyCode == 46){
        template.searchName_player.set(undefined);
      }
    },
    "click #clearInputField_playersSearch":function(e,template){
    	e.preventDefault();
    	template.deleteSelectedClub_P2.set(undefined)
		template.deleteUsersDB.set(undefined)
    	arrayToDelete=[];
    	$("#searchPlayerName_P").val("")
    	var searchValueName = $("#searchPlayerName_P").val();
    	if(searchValueName.length==0){
    		template.searchName_player.set(undefined);
    		Router.go("managePlayersAssocAcad",{page:1})
    	}
    },
    "click #playerViewNext":function(e){
    	e.preventDefault();
    	try {
    		if(Template.instance().deleteSelectedClub_P2.get()!=undefined){
            	$("#renderConfrimAndRoute").empty();
            	Blaze.render(Template.confirmDeleteAndNEXTPrev, $("#renderConfrimAndRoute")[0]);
            	$("#conFirmHeaderLog").html("Make sure you have deleted the selected players, press ok to continue without deleteting..")
				$("#confirmDeleteAndNEXTPrev").modal({
				    backdrop: 'static',
				    keyboard: false
				});
        	}
        	else{
				var currentPage = parseInt(Router.current().params.page) || 1;
            	var nextPage = parseInt(currentPage + 1);
            	Router.go("managePlayersAssocAcad",{page:nextPage})
        	}
        } catch (e) {
        }
    },
    "click #playerViewPrevious":function(e){
    	e.preventDefault();
    	try {
    		if(Template.instance().deleteSelectedClub_P2.get()!=undefined){
            	$("#renderConfrimAndRoute").empty();
            	Blaze.render(Template.confirmDeleteAndPrev, $("#renderConfrimAndRoute")[0]);
            	$("#conFirmHeaderLogPrev").html("Make sure you have deleted the selected players, press ok to continue without deleteting..")
				$("#confirmDeleteAndPrev").modal({
				    backdrop: 'static',
				    keyboard: false
				});
        	}
        	else{
				var currentPage = parseInt(Router.current().params.page) || 1;
            	var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            	Router.go("managePlayersAssocAcad",{page:previousPage})
        	}
        } catch (e) {
        }
    },
    "click #yesButtonDeleteSelected":function(e,template){
		$("#confirmDeleteAndNEXTPrev").modal('hide');
    	$( '.modal-backdrop' ).remove();
    	var currentPage = parseInt(Router.current().params.page) || 1;
        var nextPage = parseInt(currentPage + 1);
 		arrayToDelete=[];
        template.deleteSelectedClub_P2.set(undefined)
        template.deleteUsersDB.set(undefined)
        Router.go("managePlayersAssocAcad",{page:nextPage})
    },
    "click #noButtonDeleteSelected":function(){
    	$("#confirmDeleteAndNEXTPrev").modal('hide');
    	$( '.modal-backdrop' ).remove();
    },
    "click #yesButtonDeleteSelectedPrev":function(e,template){
		$("#confirmDeleteAndPrev").modal('hide');
    	$( '.modal-backdrop' ).remove();
    	var currentPage = parseInt(Router.current().params.page) || 1;
        var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
 		arrayToDelete=[];
        template.deleteSelectedClub_P2.set(undefined)
        template.deleteUsersDB.set(undefined)
        Router.go("managePlayersAssocAcad",{page:previousPage})
    },
    "click #noButtonDeleteSelectedPrev":function(){
    	$("#confirmDeleteAndPrev").modal('hide');
    	$( '.modal-backdrop' ).remove();
    },
    'click #deleteSelectedCLUB2_P':function(e,template){
    	e.preventDefault()
    	var lData = {
    		userId:Template.instance().deleteUsersDB.get(),
    	}

    	$("#confirmDeleteAndNEXTPrev").modal('hide');
    	$( '.modal-backdrop' ).remove();

    	Meteor.call("updateUsersRemoveAffiliation",lData,function(err,res){
    		if(res){
    			template.deleteSelectedClub_P2.set(undefined)
		        template.deleteUsersDB.set(undefined)
    			arrayToDelete=[];
    		}
    		else if(res==false){
    			alert("select sport to add players")
    		}
    	});
    },
});