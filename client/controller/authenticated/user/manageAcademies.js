var addAcademyArray_PA=[],addAcademyIdArray_PA=[],Academies_PA=[],arr2_PA=[];
var arrayToAdd_PA=[], arrayToDelete_PA=[];
Template.manageAcademies.onCreated(function(){
	this.subscribe("academyAssocOther");
	this.subscribe("timeZone");
});

Template.manageAcademies.onRendered(function(){
	Session.set('searchForAcademy_PA',undefined);
	addAcademyArray_PA=[];
	Academies_PA=[],arr2_PA=[];
	addAcademyIdArray_PA=[];
	var arrayToAdd_PA=[];arrayToDelete_PA=[];
});
Template.manageAcademies.onDestroyed(function(){
	var addAcademyArray_PA=[],addAcademyIdArray_PA=[],Academies_PA=[],arr2_PA=[];
	Session.set('searchForAcademy_PA',undefined)
	Session.set("deleteSelectedClub_PA",undefined);
	Session.set("searResults_PA",undefined);

});

Template.manageAcademies.helpers({
	searchResultsOfMNM_PA: function() {
		if(Session.get('searchForAcademy_PA')!=undefined&&Session.get('searchForAcademy_PA').trim().length!=0){
			try{
				var reObj = new RegExp(Session.get('searchForAcademy_PA'), 'i');
		   		var search=Meteor.users.find({ clubName: {$regex:reObj},role:"Academy",associationId:"other"}).fetch();
		   		if(search.length!=0){
			   		Session.set("searResults_PA",search)
					return search;
				}
				else if(Session.get('searchForAcademy_PA')&&search.length==0){
					var x=[];
					data={
						_id:0,
						clubName:"No Results"
					}
					x.push(data)
					return x
				}
			}catch(e){
			}
		}
	},
	addedAcademyArray_PA:function(){
		if(Session.get("addAcademyArraySess_PA")){
			if(Session.get("addAcademyArraySess_PA")){
				return Session.get("addAcademyArraySess_PA")
			}
		}
	},
	"deleteSelectedClub_PA":function(){
		if(Session.get("deleteSelectedClub_PA")){
			return Session.get("deleteSelectedClub_PA")
		}
	}
})

Template.manageAcademies.events({
	'keyup #searchUserManage_PA, change #searchUserManage_PA,input #searchUserManage_PA,keydown #searchUserManage_PA': function(e){
		e.preventDefault();
	    Session.set('searchForAcademy_PA', e.target.value);
	    $("#searchUserManage_PA").text("")
	},
	'focus #searchUserManage_PA':function(){
		 $("#searchUserManage_PA").text("")
	},

	'click div[name=addAcademyMNM_PA]':function(e){
	 	e.preventDefault()
	 	$("#searchUserManage_PA").text("")
	 	if(e.target.id!=0){
	 		addAcademyArray_PA=[]
		 	var data = {
		 		academyId:this._id,
		 		_id:this._id,
		 		contactPerson:this.contactPerson,
		 		address:this.address,
				clubName:this.clubName,
				state:this.state,
				pinCode:this.pinCode,
				city:this.city,
				phoneNumber:this.phoneNumber,
				emailAddress:this.emailAddress
		 	}
			if (_.findWhere(addAcademyArray_PA, data) == null) {
			    addAcademyArray_PA.push(data);
			}
			else{
				$("#searchUserManage_PA").text("Academy already added");
			}
			if (_.findWhere(addAcademyIdArray_PA, data.academyId) == null) {
			    addAcademyIdArray_PA.push(data.academyId);
			}
			Session.set('addAcademyArrayIdSess_PA',addAcademyIdArray_PA);
		 	Session.set("addAcademyArraySess_PA",addAcademyArray_PA);
		 	Session.set('searchForAcademy_PA',undefined)
		 	$("#searchUserManage_PA").val("");
	 	}
	},

	'mouseover p[name=clubName_PA]':function(e){
		$("#searchUserManage_PA").text("")
		if(e.target.id!=0)
		$("#"+e.target.id).css("color", "green");
	},

	'mouseout p[name=clubName_PA]':function(e){
		$("#searchUserManage_PA").text("")
		if(e.target.id!=0)
		$("#"+e.target.id).css("color", "rgb(56,56,56)");
    },
    "click #addSearchedPLayers_PA":function(e){
    	if(Session.get("searResults_PA")){
    		$("#searchUserManage_PA").val("");  		
    		Session.set("searchForAcademy_PA",undefined)
    		Session.set('addAcademyArraySess_PA',Session.get("searResults_PA"));
    	}
    },
	'click #addedAcademyDelete_PA':function(e){
    	$("#searchUserManage_PA").text("")
    	var data={
    		userIdD:this.userId,
			userNameD:this.userName
    	}
    	arr_PA = [];
    	arr_PA.push(data)
    	Session.set("deleteSelectedClub_PA",arr_PA);
    },

   'click #deleteSelectedCLUB_PA':function(e){
    	$("#searchUserManage_PA").text("")
    	e.preventDefault();
    	var id=this.userIdD;
		$.each(addAcademyArray_PA, function(i){
		    if(addAcademyArray_PA[i].userId.trim().toString()===id.trim().toString()) {
		        addAcademyArray_PA.splice(i,1);
		        Session.set("deleteSelectedClub_PA",undefined);
		        return false;
		    }
		});
		Session.set("addAcademyArraySess_PA",addAcademyArray_PA);

		$.each(addAcademyIdArray_PA, function(j){
		    if(addAcademyIdArray_PA[j].toString()===id.trim().toString()) {
		        addAcademyIdArray_PA.splice(j,1);
		        return false;
		    }
		});
		Session.set('addAcademyArrayIdSess_PA',addAcademyIdArray_PA);
    },

    'click #deleteSelectedCLUB_PANo':function(e){
    	$("#searchUserManage_PA").text("")
    	e.preventDefault();
    	Session.set("deleteSelectedClub_PA",undefined);
    },
	'click #saveDeleteAc1_PA':function(e){
    	e.preventDefault();
    	try{
	    	var lData = {
	    		associationId: Meteor.user().userId,
	    		academiesId:Session.get('addAcademyArrayIdSess_PA'),
	    		interestedProjectName:Meteor.user().interestedProjectName,
	    		interestedDomainName:Meteor.user().interestedDomainName,
	    	}
	    	Meteor.call("updateAssociationIdOfAcademies",lData,function(e,res){
	    		Session.set('addAcademyArraySess_PA', undefined);
				Session.set('searchForAcademy_PA', undefined);
				Session.set('addAcademyArrayIdSess_PA',undefined);	
				Session.set("deleteSelectedClub_PA",undefined);
				arrayToAdd_PA=[];


	    	})
    	}catch(e){}
    },
    'click #cancelDeleteAc1_PA':function(e){
    	e.preventDefault()
    	Session.set('searchForAcademy_PA',undefined)
		Session.set("deleteSelectedClub_PA",undefined);
		Session.set('addAcademyArraySess_PA', undefined);
		Session.set('addAcademyArrayIdSess_PA',undefined);	
		Session.set("deleteSelectedClub2_PA",undefined);
		Session.set('deleteUsersDB_PA',undefined);
		$("#renderManagePlayers2_PA").empty();
		$("#renderManagePlayers_PA").empty();
		Session.set("deleteSelectedClub_P2_PA",undefined);
		Session.set("deleteSelectedClub_P21_PA",undefined);
	},
	"change #checkedPlayers_PA":function(e){
		var num = $('#checkedPlayers_PA:checked').size();
		if($(e.target).is(":checked")){
			var id = this._id
			if (_.findWhere(arrayToAdd_PA, id) == null) {
    			arrayToAdd_PA.push(id);
			}
			Session.set('addAcademyArrayIdSess_PA',arrayToAdd_PA);
			if(num!=0)
				Session.set("deleteSelectedClub_PA",num);
			else
				Session.set("deleteSelectedClub_PA",undefined);
		}	
		else if(!$(e.target).is(":checked")){
			var id=this._id;
			arrayToAdd_PA =  _.reject(arrayToAdd_PA, function(item) {
        		return item === id; 
    		});
			Session.set('addAcademyArrayIdSess_PA',arrayToAdd_PA);
			if(num!=0)
				Session.set("deleteSelectedClub_PA",num);
			else
				Session.set("deleteSelectedClub_PA",undefined);
		}
	}
});


Template.viewAdedAcademies.onCreated(function(){
	this.subscribe("academyAssocPAGINAT");
});

Template.viewAdedAcademies.onRendered(function(){
	
});

Template.viewAdedAcademies.onDestroyed(function(){
	Session.set("deleteSelectedClub2_PA",undefined);
});

Template.viewAdedAcademies.helpers({
	"lAcademies_PA":function(){
		if(Meteor.user().userId!==null&&Meteor.user().userId!==undefined&&Meteor.user()!==null&&Meteor.user()!==undefined){
			var academiesList = Meteor.users.find({"associationId":Meteor.user().userId,role:"Academy"}).fetch();
			//var academiesList = Session.get("academiesListInDB");
			if(academiesList){
				return academiesList
			}
		}
	},
	"deleteSelectedClub_P2_PA":function(){
		if(Session.get("deleteSelectedClub_P2_PA")){
			return true
		}
		else
			return false
	},
	"deleteSelectedClub_P21_PA":function(){
		if(Session.get("deleteSelectedClub_P2_PA")){
			return Session.get("deleteSelectedClub_P2_PA")
		}
		else
			return false
	}
});

Template.viewAdedAcademies.events({
	'keyup #mainTagSearchPlay_PA': function(event) {
    	//Session.set('search/keyword', event.target.value);
		var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
		//$("checkboxdivuserprofile").hide();
		var $rows = $("#selectTagopPlay_PA> div");
		$rows.each(function() {
			var oLabel = $(this);
			if (oLabel.length > 0) {
                    if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
		})

  	},
	'click #addedAcademyDelete2_PA':function(e){
		e.preventDefault();
		$("#searchUserManage_PA").text("")
		var id=this
		var data={
			userIdD:this.userId,
			userNameD:this.userName
		}
		arr3_P = [];
		arr3_P.push(data)
		Session.set("deleteSelectedClub2_PA",String(id));
	},
	'click #deleteSelectedCLUBNo2_PA':function(e){
    	$("#searchUserManage_PA").text("")
    	e.preventDefault();
    	Session.set("deleteSelectedClub2_PA",undefined);
    },
    'click #deleteSelectedCLUB2_PA':function(e){
    	e.preventDefault()
    	var lData = {
    		associationId: Meteor.user().userId,
    		academiesId:Session.get("deleteUsersDB_PA"),
    	}
    	Meteor.call("updatePullAcademy",lData,function(e,res){
    		Session.set("deleteSelectedClub_P2_PA",undefined)
    		arrayToDelete_PA=[];
    	});
    },
    'click #cancelDeleteAc2_PA':function(e){
    	e.preventDefault();
		Session.set('searchForAcademy_PA',undefined)
		Session.set("deleteSelectedClub_PA",undefined);
		Session.set('addAcademyArraySess_PA', undefined);
		Session.set('addAcademyArrayIdSess_PA',undefined);	
		Session.set("deleteSelectedClub2_PA",undefined);
		Session.set('deleteUsersDB_PA',undefined);
		Session.set("deleteSelectedClub_P2_PA",undefined)
		Session.set("deleteSelectedClub_P2_PA",undefined);
		Session.set("deleteSelectedClub_P21_PA",undefined);
		$("#renderManageAcademy").empty();
		$("#viewAdedAcademiesRen").empty();
    },
    "change #checkedPlayersToDelete_PA":function(e){
    	var num = $('#checkedPlayersToDelete_PA:checked').size();
		if($(e.target).is(":checked")){
			var id = this._id
			if (_.findWhere(arrayToDelete_PA, id) == null) {
    			arrayToDelete_PA.push(id);
			}
			Session.set('deleteUsersDB_PA',arrayToDelete_PA);
			if(num!=0){
				Session.set("deleteSelectedClub_P2_PA",num)
			}
			else
				Session.set("deleteSelectedClub_P2_PA",undefined)
		}	
		else if(!$(e.target).is(":checked")){
			var id=this._id;
			arrayToDelete_PA =  _.reject(arrayToDelete_PA, function(item) {
        		return item === id; 
    		});
			Session.set('deleteUsersDB_PA',arrayToDelete_PA);
			if(num!=0)
				Session.set("deleteSelectedClub_P2_PA",num)
			else
				Session.set("deleteSelectedClub_P2_PA",undefined)
		}
    }
});

/*Template.registerHelper('checkSelectedAcademies_PA',function(){
	try{
		if(Session.get("addAcademyArraySess_PA")!=undefined){
			var i = Session.get("addAcademyArraySess_PA");
			if(i.length!=0){
				return true;
			}
			else {
				return false;
			}
		}
		else{
			return false;
		}
	}catch(e){
	}

});

Template.registerHelper('getPlayerName_PA',function(data){
	if(data){
		var acaN = Meteor.users.findOne({"userId":data,role:"Academy"});
		if(acaN&&acaN.clubName){
			return acaN.clubName
		}
	}
});

Template.registerHelper('getPlayerPhone',function(data){
	if(data){
		var acaN = Meteor.users.findOne({"userId":data,role:"Player"});
		if(acaN&&acaN.phoneNumber){
			return acaN.phoneNumber
		}
	}
});*/

Template.registerHelper('getPlayerEmail_PA',function(data){
	if(data){
		var acaN = Meteor.users.findOne({"userId":data,role:"Academy"});
		try{
			if(acaN&&acaN.emails[0].address){
				return acaN.emails[0].address
			}
		}catch(e){
		}
	}
});

Template.registerHelper('getPlayerState_PA',function(data){
	if(data){
		var getName="";
		var getStateName = timeZone.findOne({"countryName":"India"});
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
