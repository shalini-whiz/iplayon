var addAcademyArray_PAD=[],addAcademyIdArray_PAD=[],Academies_PAD=[],arr2_PAD=[];
var arrayToAdd_PAD=[], arrayToDelete_PAD=[];
Template.manageDistrictAssoc.onCreated(function(){
	this.subscribe("distAssocAssocOther");
	this.subscribe("timeZone");
});

Template.manageDistrictAssoc.onRendered(function(){
	Session.set('searchForAcademy_PAD',undefined);
	addAcademyArray_PAD=[];
	Academies_PAD=[],arr2_PAD=[];
	addAcademyIdArray_PAD=[];
	var arrayToAdd_PAD=[];arrayToDelete_PAD=[];
});
Template.manageDistrictAssoc.onDestroyed(function(){
	var addAcademyArray_PAD=[],addAcademyIdArray_PAD=[],Academies_PAD=[],arr2_PAD=[];
	Session.set('searchForAcademy_PAD',undefined)
	Session.set("deleteSelectedClub_PAD",undefined);
	Session.set("searResults_PAD",undefined);

});

Template.manageDistrictAssoc.helpers({
	searchResultsOfMNM_PAD: function() {
		if(Session.get('searchForAcademy_PAD')!=undefined&&Session.get('searchForAcademy_PAD').trim().length!=0){
			try{
				var reObj = new RegExp(Session.get('searchForAcademy_PAD'), 'i');
		   		var search=Meteor.users.find({ clubName: {$regex:reObj},"role":"Association","parentAssociationId" : "other", "associationType" : "District/City"}).fetch();
		   		if(search.length!=0){
			   		Session.set("searResults_PAD",search)
					return search;
				}
				else if(Session.get('searchForAcademy_PAD')&&search.length==0){
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
	addedAcademyArray_PAD:function(){
		if(Session.get("addAcademyArraySess_PAD")){
			if(Session.get("addAcademyArraySess_PAD")){
				return Session.get("addAcademyArraySess_PAD")
			}
		}
	},
	"deleteSelectedClub_PAD":function(){
		if(Session.get("deleteSelectedClub_PAD")){
			return Session.get("deleteSelectedClub_PAD")
		}
	}
})

Template.manageDistrictAssoc.events({
	'keyup #searchUserManage_PAD, change #searchUserManage_PAD,input #searchUserManage_PAD,keydown #searchUserManage_PAD': function(e){
		e.preventDefault();
	    Session.set('searchForAcademy_PAD', e.target.value);
	    $("#searchUserManage_PAD").text("")
	},
	'focus #searchUserManage_PAD':function(){
		 $("#searchUserManage_PAD").text("")
	},

	'click div[name=addAcademyMNM_PAD]':function(e){
	 	e.preventDefault()
	 	$("#searchUserManage_PAD").text("")
	 	if(e.target.id!=0){
	 		addAcademyArray_PAD=[]
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
			if (_.findWhere(addAcademyArray_PAD, data) == null) {
			    addAcademyArray_PAD.push(data);
			}
			else{
				$("#searchUserManage_PAD").text("Academy already added");
			}
			if (_.findWhere(addAcademyIdArray_PAD, data.academyId) == null) {
			    addAcademyIdArray_PAD.push(data.academyId);
			}
			Session.set('addAcademyArrayIdSess_PAD',addAcademyIdArray_PAD);
		 	Session.set("addAcademyArraySess_PAD",addAcademyArray_PAD);
		 	Session.set('searchForAcademy_PAD',undefined)
		 	$("#searchUserManage_PAD").val("");
	 	}
	},

	'mouseover p[name=clubName_PAD]':function(e){
		$("#searchUserManage_PAD").text("")
		if(e.target.id!=0)
		$("#"+e.target.id).css("color", "green");
	},

	'mouseout p[name=clubName_PAD]':function(e){
		$("#searchUserManage_PAD").text("")
		if(e.target.id!=0)
		$("#"+e.target.id).css("color", "rgb(56,56,56)");
    },
    "click #addSearchedPLayers_PAD":function(e){
    	if(Session.get("searResults_PAD")){
    		$("#searchUserManage_PAD").val("");  		
    		Session.set("searchForAcademy_PAD",undefined)
    		Session.set('addAcademyArraySess_PAD',Session.get("searResults_PAD"));
    	}
    },
	'click #addedAcademyDelete_PAD':function(e){
    	$("#searchUserManage_PAD").text("")
    	var data={
    		userIdD:this.userId,
			userNameD:this.userName
    	}
    	arr_PA = [];
    	arr_PA.push(data)
    	Session.set("deleteSelectedClub_PAD",arr_PA);
    },

   'click #deleteSelectedCLUB_PAD':function(e){
    	$("#searchUserManage_PAD").text("")
    	e.preventDefault();
    	var id=this.userIdD;
		$.each(addAcademyArray_PAD, function(i){
		    if(addAcademyArray_PAD[i].userId.trim().toString()===id.trim().toString()) {
		        addAcademyArray_PAD.splice(i,1);
		        Session.set("deleteSelectedClub_PAD",undefined);
		        return false;
		    }
		});
		Session.set("addAcademyArraySess_PAD",addAcademyArray_PAD);

		$.each(addAcademyIdArray_PAD, function(j){
		    if(addAcademyIdArray_PAD[j].toString()===id.trim().toString()) {
		        addAcademyIdArray_PAD.splice(j,1);
		        return false;
		    }
		});
		Session.set('addAcademyArrayIdSess_PAD',addAcademyIdArray_PAD);
    },

    'click #deleteSelectedCLUB_PANoD':function(e){
    	$("#searchUserManage_PAD").text("")
    	e.preventDefault();
    	Session.set("deleteSelectedClub_PAD",undefined);
    },
	'click #saveDeleteAc1_PAD':function(e){
    	e.preventDefault();
    	try{
	    	var lData = {
	    		associationId: Meteor.user().userId,
	    		districtAssocId:Session.get('addAcademyArrayIdSess_PAD'),
	    		interestedProjectName:Meteor.user().interestedProjectName,
	    		interestedDomainName:Meteor.user().interestedDomainName,
	    	}
	    	Meteor.call("updateAssociationIdOfDistrict",lData,function(e,res){
	    		Session.set('addAcademyArraySess_PAD', undefined);
				Session.set('searchForAcademy_PAD', undefined);
				Session.set('addAcademyArrayIdSess_PAD',undefined);	
				Session.set("deleteSelectedClub_PAD",undefined);
				arrayToAdd_PAD=[];


	    	})
    	}catch(e){}
    },
    'click #cancelDeleteAc1_PAD':function(e){
    	e.preventDefault()
    	Session.set('searchForAcademy_PAD',undefined)
		Session.set("deleteSelectedClub_PAD",undefined);
		Session.set('addAcademyArraySess_PAD', undefined);
		Session.set('addAcademyArrayIdSess_PAD',undefined);	
		Session.set("deleteSelectedClub2_PAD",undefined);
		Session.set('deleteUsersDB_PAD',undefined);
		$("#manageDArender").empty();
		$("#viewDArender").empty();
		Session.set("deleteSelectedClub_P2_PAD",undefined);
		Session.set("deleteSelectedClub_P21_PAD",undefined);
	},
	"change #checkedPlayers_PAD":function(e){
		var num = $('#checkedPlayers_PAD:checked').size();
		if($(e.target).is(":checked")){
			var id = this._id
			if (_.findWhere(arrayToAdd_PAD, id) == null) {
    			arrayToAdd_PAD.push(id);
			}
			Session.set('addAcademyArrayIdSess_PAD',arrayToAdd_PAD);
			if(num!=0)
				Session.set("deleteSelectedClub_PAD",num);
			else
				Session.set("deleteSelectedClub_PAD",undefined);
		}	
		else if(!$(e.target).is(":checked")){
			var id=this._id;
			arrayToAdd_PAD =  _.reject(arrayToAdd_PAD, function(item) {
        		return item === id; 
    		});
			Session.set('addAcademyArrayIdSess_PAD',arrayToAdd_PAD);
			if(num!=0)
				Session.set("deleteSelectedClub_PAD",num);
			else
				Session.set("deleteSelectedClub_PAD",undefined);
		}
	}
});


Template.viewAdedDistrictAssoc.onCreated(function(){
	this.subscribe("distAssocPAGINAT");
});

Template.viewAdedDistrictAssoc.onRendered(function(){
	
});

Template.viewAdedDistrictAssoc.onDestroyed(function(){
	Session.set("deleteSelectedClub2_PAD",undefined);
});

Template.viewAdedDistrictAssoc.helpers({
	"lAcademies_PAD":function(){
		if(Meteor.user().userId!==null&&Meteor.user().userId!==undefined&&Meteor.user()!==null&&Meteor.user()!==undefined){
			var academiesList = Meteor.users.find({"parentAssociationId":Meteor.user().userId,role:"Association"}).fetch();
			//var academiesList = Session.get("academiesListInDB");
			if(academiesList){
				return academiesList
			}
		}
	},
	"deleteSelectedClub_P2_PAD":function(){
		if(Session.get("deleteSelectedClub_P2_PAD")){
			return true
		}
		else
			return false
	},
	"deleteSelectedClub_P21_PAD":function(){
		if(Session.get("deleteSelectedClub_P2_PAD")){
			return Session.get("deleteSelectedClub_P2_PAD")
		}
		else
			return false
	}
});

Template.viewAdedDistrictAssoc.events({
	'keyup #mainTagSearchPlay_PAD': function(event) {
    	//Session.set('search/keyword', event.target.value);
		var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
		//$("checkboxdivuserprofile").hide();
		var $rows = $("#selectTagopPlay_PAD> div");
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
	'click #addedAcademyDelete2_PAD':function(e){
		e.preventDefault();
		$("#searchUserManage_PAD").text("")
		var id=this
		var data={
			userIdD:this.userId,
			userNameD:this.userName
		}
		arr3_P = [];
		arr3_P.push(data)
		Session.set("deleteSelectedClub2_PAD",String(id));
	},
	'click #deleteSelectedCLUBNo2_PAD':function(e){
    	$("#searchUserManage_PAD").text("")
    	e.preventDefault();
    	Session.set("deleteSelectedClub2_PAD",undefined);
    },
    'click #deleteSelectedCLUB2_PAD':function(e){
    	e.preventDefault()
    	var lData = {
    		associationId: Meteor.user().userId,
    		districtAssocId:Session.get("deleteUsersDB_PAD"),
    	}
    	Meteor.call("updatePullDistrictAssoc",lData,function(e,res){
    		Session.set("deleteSelectedClub_P2_PAD",undefined)
    		arrayToDelete_PA=[];
    	});
    },
    'click #cancelDeleteAc2_PAD':function(e){
    	e.preventDefault();
		Session.set('searchForAcademy_PAD',undefined)
		Session.set("deleteSelectedClub_PAD",undefined);
		Session.set('addAcademyArraySess_PAD', undefined);
		Session.set('addAcademyArrayIdSess_PAD',undefined);	
		Session.set("deleteSelectedClub2_PAD",undefined);
		Session.set('deleteUsersDB_PAD',undefined);
		Session.set("deleteSelectedClub_P2_PAD",undefined)
		Session.set("deleteSelectedClub_P2_PAD",undefined);
		Session.set("deleteSelectedClub_P21_PAD",undefined);
		$("#manageDArender").empty();
		$("#viewDArender").empty();
    },
    "change #checkedPlayersToDelete_PAD":function(e){
    	var num = $('#checkedPlayersToDelete_PAD:checked').size();
		if($(e.target).is(":checked")){
			var id = this._id
			if (_.findWhere(arrayToDelete_PAD, id) == null) {
    			arrayToDelete_PAD.push(id);
			}
			Session.set('deleteUsersDB_PAD',arrayToDelete_PAD);
			if(num!=0){
				Session.set("deleteSelectedClub_P2_PAD",num)
			}
			else
				Session.set("deleteSelectedClub_P2_PAD",undefined)
		}	
		else if(!$(e.target).is(":checked")){
			var id=this._id;
			arrayToDelete_PAD =  _.reject(arrayToDelete_PAD, function(item) {
        		return item === id; 
    		});
			Session.set('deleteUsersDB_PA',arrayToDelete_PAD);
			if(num!=0)
				Session.set("deleteSelectedClub_P2_PAD",num)
			else
				Session.set("deleteSelectedClub_P2_PAD",undefined)
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

Template.registerHelper('getPlayerEmail_PAD',function(data){
	if(data){
		var acaN = Meteor.users.findOne({"userId":data,role:"Association", "associationType" : "District/City"});
		try{
			if(acaN&&acaN.emails[0].address){
				return acaN.emails[0].address
			}
		}catch(e){
		}
	}
});

Template.registerHelper('getPlayerState_PAD',function(data){
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
