/****manage academies****/
Template.manageAcademiesAssoc.onRendered(function(){
	this.subscribe("onlyLoggedIn")
});

Template.manageAcademiesAssoc.onCreated(function(){
	this.callTemplateNameAcade = new ReactiveVar(false)
});

Template.manageAcademiesAssoc.onDestroyed(function(){

});

Template.manageAcademiesAssoc.helpers({
	whichTemplateAcademy:function(){
		//if(Meteor.userId()&&Meteor.user().role=="Association")
			return Template.instance().callTemplateNameAcade.get();
	}
});

Template.manageAcademiesAssoc.events({
	"click #addAcademies":function(e,template){
		template.callTemplateNameAcade.set("addAcademiesManage");
	},
	'click #viewDeleteAcademy':function(e,template){
		template.callTemplateNameAcade.set("viewDeleteAcademies");
	     Router.go("manageAcademiesAssoc",{page:1})
	}
});

//--add academies--///
var addAcademyArray_Academy=[],addAcademyIdArray_Academy=[],Academies_Academy=[],arr2_Academy=[];
var arrayToAdd_Academy=[], arrayToDelete_Academy=[];
Template.addAcademiesManage.onCreated(function(){
	this.subscribe("academyDetails_OTHER");
	this.subscribe("timeZone");
	this.searchForAcademy = new ReactiveVar(undefined);
	this.searchResults_Academy = new ReactiveVar(undefined);
	this.selectAcademies = new ReactiveVar(undefined);
	this.selectAcademiesId = new ReactiveVar(undefined);
	this.addAcademyArrayIdSess_Academy = new ReactiveVar(undefined);
	this.deleteSelectedClub_Academy  = new ReactiveVar(undefined)
});

Template.addAcademiesManage.onRendered(function(){
	addAcademyArray_Academy=[];
	Academies_Academy=[],arr2_Academy=[];
	addAcademyIdArray_Academy=[];
	var arrayToAdd_Academy=[];arrayToDelete_Academy=[];
	$('#viewDeleteAcademy').removeClass("ip_button_White");
	$('#viewDeleteAcademy').addClass("ip_button_DarkGrey");
	$('#addAcademies').removeClass("ip_button_DarkGrey");
	$('#addAcademies').addClass("ip_button_White");
});

Template.addAcademiesManage.onDestroyed(function(){
	
});

Template.addAcademiesManage.helpers({
	searchResultsOfMNM_Academy: function() {
		try{
			var searchValue = Template.instance().searchForAcademy.get();
			if(searchValue!=undefined&&searchValue.length!=0){
				var reObj = new RegExp(searchValue, 'i');
				var search="";
				search = academyDetails.find({ clubName: {$regex:reObj},affiliatedTo:"other"}).fetch();
				if(search.length!=0){
					Template.instance().searchResults_Academy.set(search)
					return search;
				}
				else if(searchValue&&search.length==0){
					var x=[];
					data={
						_id:0,
						clubName:"No Results"
					}
					x.push(data)
					if(Meteor.userId()&&(Meteor.user().role=="Association"))
						return x
				}
			}
		}catch(e){
		}
	},
	addedAcademyArray_Academy:function(){
		if(Template.instance().selectAcademies.get()){
			if(Template.instance().selectAcademies.get()){
				return Template.instance().selectAcademies.get()
			}
		}
	},
	"deleteSelectedClub_Academy":function(){
		if(Template.instance().deleteSelectedClub_Academy.get()){
			return Template.instance().deleteSelectedClub_Academy.get()
		}
	}
});

Template.addAcademiesManage.events({
	'keyup #searchUserManage_Academy, change #searchUserManage_Academy,input #searchUserManage_Academy,keydown #searchUserManage_Academy ': function(e,template){
		e.preventDefault();
	    template.searchForAcademy.set(e.target.value);
	    $("#searchUserManage_Academy").text("")
	},
	'focus #searchUserManage_Academy':function(){
		 $("#searchUserManage_Academy").text("")
	},
	'click div[name=addAcademyMNM_Academy]':function(e,template){
	 	e.preventDefault()
	 	$("#searchUserManage_Academy").text("")
	 	template.selectAcademiesId.set(undefined);
		template.selectAcademies.set(undefined)	
		template.deleteSelectedClub_Academy.set(undefined)


	 	if(e.target.id!=0){
	 		addAcademyArray_Academy=[]
	 		addAcademyIdArray_Academy = []
	 		arrayToAdd_Academy =[];

	 		addAcademyArray_Academy=[]
		 	var data = {
		 		userId:this.userId,
		 		_id:this.userId,
		 		contactPerson:this.contactPerson,
		 		address:this.address,
				clubName:this.clubName,
				state:this.state,
				pinCode:this.pinCode,
				city:this.city,
				phoneNumber:this.phoneNumber,
				emailAddress:this.emailAddress,
		 	}
			if (_.findWhere(addAcademyArray_Academy, data) == null) {
			    addAcademyArray_Academy.push(data);
			}
			else{
			}
			if (_.findWhere(addAcademyIdArray_Academy, data.userId) == null) {
			    addAcademyIdArray_Academy.push(data.userId);
			}
			template.selectAcademies.set(addAcademyArray_Academy)
			template.selectAcademiesId.set(addAcademyIdArray_Academy)
			template.searchForAcademy.set(undefined)
			template.deleteSelectedClub_Academy.set(undefined);
		 	$("#searchUserManage_Academy").val("");
	 	}
	},
	'mouseover p[name=academyName]':function(e){
		$("#searchUserManage_Academy").text("")
		if(e.target.id!=0)
		$("#"+e.target.id).css("color", "green");
	},
	'mouseout p[name=academyName]':function(e){
		$("#searchUserManage_Academy").text("")
		if(e.target.id!=0)
		$("#"+e.target.id).css("color", "rgb(56,56,56)");
    },
    "click #addSearchedAcademy":function(e,template){
    	e.preventDefault()
    	if(Template.instance().searchResults_Academy.get()){
    		$("#searchUserManage_Academy").text("")
    		
    		template.selectAcademiesId.set(undefined);
			template.selectAcademies.set(undefined)	

			template.deleteSelectedClub_Academy.set(undefined)

			addAcademyArray_Academy=[]

	 		addAcademyIdArray_Academy = []
	 		arrayToAdd_Academy =[];

    		$("#searchUserManage_Academy").val("");  		
    		template.searchForAcademy.set(undefined);
    		template.selectAcademies.set(Template.instance().searchResults_Academy.get())
    	}
    },
    "change #checkedAcademies":function(e,template){
		var num = $('#checkedAcademies:checked').size();
		if($(e.target).is(":checked")){
			var id = this.userId
			if (_.findWhere(arrayToAdd_Academy, id) == null) {
    			arrayToAdd_Academy.push(id);
			}
			template.selectAcademiesId.set(arrayToAdd_Academy);
			if(num!=0)
				template.deleteSelectedClub_Academy.set(num);
			else
				template.deleteSelectedClub_Academy.set(undefined);
		}	
		else if(!$(e.target).is(":checked")){
			var id=this.userId;
			arrayToAdd_Academy =  _.reject(arrayToAdd_Academy, function(item) {
        		return item === id; 
    		});
			template.selectAcademiesId.set(arrayToAdd_Academy);
			if(num!=0)
				template.deleteSelectedClub_Academy.set(num);
			else
				template.deleteSelectedClub_Academy.set(num);
		}
	},
	'click #saveDeleteAc1_Academy':function(e,template){
    	e.preventDefault();
    	try{
	    	var lData = {
	    		userId:Template.instance().selectAcademiesId.get(),
	    	}
	    	Meteor.call("affiliateAcademiesBYSADA",lData,function(e,res){
				template.searchForAcademy.set(undefined);
				template.searchResults_Academy.set(undefined);
				template.selectAcademies.set(undefined);
				template.selectAcademiesId.set(undefined);
				template.deleteSelectedClub_Academy.set(undefined);
				arrayToAdd_Academy=[];
	    	})
    	}catch(e){
    	}
    },
    'click #regisNewAcademy':function(e){
    	e.preventDefault();
    	$("#registerNewAcademyRen").empty()
    	Blaze.render(Template.registerNewAcademy,$("#registerNewAcademyRen")[0]);
    	$("#registerNewAcademy").modal({
			backdrop: 'static',
			keyboard: false
		})
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

/********view or delete academies*****/
var sUB_ACademy = false
Template.viewDeleteAcademies.onCreated(function(){
	var template = this;
	this.searchName_Academy = new ReactiveVar(undefined)
	sUB_ACademy = true;
	var render_ACademy;
    if (sUB_ACademy) {
        template.autorun(function() {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var skipCount = parseInt(parseInt((currentPage - 1)) * 10);
        	if(Template.instance().searchName_Academy.get()==undefined){
        		if(render_ACademy){
        			render_ACademy.stop();
        			render_ACademy = false;
        		}
            	render_ACademy = template.subscribe('academiesAffiliatedTo', skipCount);
            }
            else if(Template.instance().searchName_Academy.get()!=undefined){
            	if(render_ACademy){
        			render_ACademy.stop();
        			render_ACademy = false;
        		}
            	render_ACademy = template.subscribe('academiesAffiliatedToSearch_Academy',Template.instance().searchName_Academy.get(),skipCount);
            }
        });
    }
    this.subscribe("timeZone");
    this.deleteSelectedClub_Academy2 = new ReactiveVar(undefined);
    this.deleteAcademiesDB = new ReactiveVar(undefined);
    this.deleteSelectedClub_Academy2 = new ReactiveVar(undefined);
});

Template.viewDeleteAcademies.onRendered(function(){
	$('#viewDeleteAcademy').removeClass("ip_button_DarkGrey");
	$('#viewDeleteAcademy').addClass("ip_button_White");
	$('#addAcademies').removeClass("ip_button_White");
	$('#addAcademies').addClass("ip_button_DarkGrey");
});

Template.viewDeleteAcademies.onDestroyed(function(){
	this.deleteSelectedClub_Academy2 = new ReactiveVar(undefined)
});

Template.viewDeleteAcademies.helpers({
	listOfAffiliatedAcademies:function(){
		if(Meteor.userId()&&(Meteor.user().role=="Association"))
			return academyDetails.find({}).fetch();
	},
	"deleteSelected_academy":function(){
		if(Template.instance().deleteSelectedClub_Academy2.get()){
			return Template.instance().deleteSelectedClub_Academy2.get()
		}
		else
			return false
	},
	prevPage_academy: function() {
        try {
            /*var currentPage = parseInt(Router.current().params.page) || 1;
            var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            return Router.routes.managePlayersAssocAcad.path({
                page: previousPage
            })*/

        } catch (e) {
        }
    },
    nextPage_academy: function() {
        try {
            /*var currentPage = parseInt(Router.current().params.page) || 1;
            var nextPage = parseInt(currentPage + 1);
            return Router.routes.managePlayersAssocAcad.path({
                page: nextPage
            })*/
        } catch (e) {
        }
    },
    prevPageClass_academy: function() {
        return currentPage_academys() <= 1 ? "none" : "";
    },
    nextPageClass_academy: function() {
        return hasMorePages_academys() ? "" : "none";
    },
    nextPageClassPo_academy:function(){
    	return hasMorePages_academys() ? "pointer" : "disabled";
    },
    prevPageClassPo_academy:function() {
        return currentPage_academys() ? "pointer" : "disabled";
    },
});

var currentPage_academys = function() {
    return parseInt(Router.current().params.page) || 1;
}

var hasMorePages_academys = function() {
    var totalPlayers = Counts.get('academyDetailsTTCOunt');
    return currentPage_academys() * parseInt(10) < totalPlayers;
}

Template.viewDeleteAcademies.events({
	"change #checkedAcademiesToDelete":function(e,template){
    	var num = $('#checkedAcademiesToDelete:checked').size();
		if($(e.target).is(":checked")){
			var id = this.userId
			if (_.findWhere(arrayToDelete_Academy, id) == null) {
    			arrayToDelete_Academy.push(id);
			}
			template.deleteAcademiesDB.set(arrayToDelete_Academy);
			if(num!=0){
				template.deleteSelectedClub_Academy2.set(num);
			}
			else
				template.deleteSelectedClub_Academy2.set(undefined);
		}	
		else if(!$(e.target).is(":checked")){
			var id=this.userId;
			arrayToDelete_Academy =  _.reject(arrayToDelete_Academy, function(item) {
        		return item === id; 
    		});
			template.deleteAcademiesDB.set(arrayToDelete_Academy);
			if(num!=0)
				template.deleteSelectedClub_Academy2.set(num);
			else
				template.deleteSelectedClub_Academy2.set(undefined);
		}
    },
    "click #searchPlayerNameDisp_Academy":function(e,template){
    	e.preventDefault()
    	template.deleteSelectedClub_Academy2.set(undefined)
		template.deleteAcademiesDB.set(undefined)
    	arrayToDelete_Academy=[];
    	var searchValueName = $("#searchPlayerName_Academy").val();
    	if(searchValueName.trim().length!=0){
    		template.searchName_Academy.set(searchValueName);
    		Router.go("manageAcademiesAssoc",{page:1})
    	}
    	else {
    		template.searchName_Academy.set(undefined);
    		Router.go("manageAcademiesAssoc",{page:1})
    	}
    },
    "keydown #searchPlayerName_Academy":function(e,template){
      if(e.keyCode == 8 ||e.keyCode == 46){
        template.searchName_Academy.set(undefined);
      }
    },
    "click #clearInputField_academiesSearch":function(e,template){
    	e.preventDefault();
    	template.deleteSelectedClub_Academy2.set(undefined)
		template.deleteAcademiesDB.set(undefined)
    	arrayToDelete_Academy=[];
    	$("#searchPlayerName_Academy").val("")
    	var searchValueName = $("#searchPlayerName_Academy").val();
    	if(searchValueName.length==0){
    		template.searchName_Academy.set(undefined);
    		Router.go("manageAcademiesAssoc",{page:1})
    	}
    },
    "click #academyViewNext":function(e){
    	e.preventDefault();
    	try {
    		if(Template.instance().deleteSelectedClub_Academy2.get()!=undefined){
            	$("#renderConfrimAndRouteAcademy").empty();
            	Blaze.render(Template.confirmDeleteAndNEXTPrevAcademies, $("#renderConfrimAndRouteAcademy")[0]);
            	$("#conFirmHeaderLog_a").html("Make sure you have deleted the selected academies, press ok to continue without deleteting..")
				$("#confirmDeleteAndNEXTPrevAcademies").modal({
				    backdrop: 'static',
				    keyboard: false
				});
        	}
        	else{
				var currentPage = parseInt(Router.current().params.page) || 1;
            	var nextPage = parseInt(currentPage + 1);
            	Router.go("manageAcademiesAssoc",{page:nextPage})
        	}
        } catch (e) {
        }
    },
    "click #academyViewPrevious":function(e){
    	e.preventDefault();
    	try {
    		if(Template.instance().deleteSelectedClub_Academy2.get()!=undefined){
            	$("#renderConfrimAndRouteAcademy").empty();
            	Blaze.render(Template.confirmDeleteAndPrevAcademies, $("#renderConfrimAndRouteAcademy")[0]);
            	$("#conFirmHeaderLogPrev_a").html("Make sure you have deleted the selected academies, press ok to continue without deleteting..")
				$("#confirmDeleteAndPrevAcademies").modal({
				    backdrop: 'static',
				    keyboard: false
				});
        	}
        	else{
				var currentPage = parseInt(Router.current().params.page) || 1;
            	var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            	Router.go("manageAcademiesAssoc",{page:previousPage})
        	}
        } catch (e) {
        }
    },
    "click #yesButtonDeleteSelected_a":function(e,template){
		$("#confirmDeleteAndNEXTPrevAcademies").modal('hide');
    	$( '.modal-backdrop' ).remove();
    	var currentPage = parseInt(Router.current().params.page) || 1;
        var nextPage = parseInt(currentPage + 1);
 		arrayToDelete_Academy=[];
        template.deleteSelectedClub_Academy2.set(undefined)
        template.deleteAcademiesDB.set(undefined)
        Router.go("manageAcademiesAssoc",{page:nextPage})
    },
    "click #noButtonDeleteSelected_a":function(){
    	$("#confirmDeleteAndNEXTPrevAcademies").modal('hide');
    	$( '.modal-backdrop' ).remove();
    },
    "click #yesButtonDeleteSelectedPrev_a":function(e,template){
		$("#confirmDeleteAndPrevAcademies").modal('hide');
    	$( '.modal-backdrop' ).remove();
    	var currentPage = parseInt(Router.current().params.page) || 1;
        var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
 		arrayToDelete_Academy=[];
        template.deleteSelectedClub_Academy2.set(undefined)
        template.deleteAcademiesDB.set(undefined)
        Router.go("manageAcademiesAssoc",{page:previousPage})
    },
    "click #noButtonDeleteSelectedPrev_a":function(){
    	$("#confirmDeleteAndPrevAcademies").modal('hide');
    	$( '.modal-backdrop' ).remove();
    },
    'click #deleteSelectedCLUB2_Academy':function(e,template){
    	e.preventDefault()
    	var lData = {
    		userId:Template.instance().deleteAcademiesDB.get(),
    	}

    	$("#confirmDeleteAndPrevAcademies").modal('hide');
    	$( '.modal-backdrop' ).remove();

    	Meteor.call("updateAcademiesRemoveAffiliation",lData,function(err,res){
    		if(res){
    			template.deleteSelectedClub_Academy2.set(undefined)
		        template.deleteAcademiesDB.set(undefined)
    			arrayToDelete_Academy=[];
    		}
    	});
    },
});