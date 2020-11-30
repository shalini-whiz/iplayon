Template.managePlayers.onCreated(function(){
	this.subscribe("usersOther_TT");
	this.subscribe("timeZone");
	this.searchForPlayer = new ReactiveVar(undefined);
	this.searchResults = new ReactiveVar(undefined);
	this.selectPlayers = new ReactiveVar(undefined);
	this.selectPlayersId = new ReactiveVar(undefined);
});
//userDetailsTTUsed

Template.managePlayers.onRendered(function(){
	Session.set('searchForAcademy_P',undefined);
	addAcademyArray_P=[];
	Academies_P=[],arr2_P=[];
	addAcademyIdArray_P=[];
	var arrayToAdd=[];arrayToDelete=[];
});

Template.managePlayers.onDestroyed(function(){
	var addAcademyArray_P=[],addAcademyIdArray_P=[],Academies_P=[],arr2_P=[];
	Session.set('searchForAcademy_P',undefined)
	Session.set("deleteSelectedClub_P",undefined);
	Session.set("searResults",undefined);
});

Template.managePlayers.helpers({	
	searchResultsOfMNM_P: function() {
		try{
			var searchValue = Template.instance().searchForPlayer.get();
			if(searchValue!=undefined&&searchValue.length!=0){
				var reObj = new RegExp(searchValue, 'i');
				var search="";
				search = userDetailsTT.find({ userName: {$regex:reObj},role:"Player",clubNameId:"other"}).fetch();
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
					return x
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

});

Template.managePlayers.events({
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
	 	if(e.target.id!=0){
	 		addAcademyArray_P=[]
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
				dateOfBirth:this.dateOfBirth
		 	}
			if (_.findWhere(addAcademyArray_P, data) == null) {
			    addAcademyArray_P.push(data);
			}
			else{
			}
			if (_.findWhere(addAcademyIdArray_P, data.userId) == null) {
			    addAcademyIdArray_P.push(data.userId);
			}
			template.selectPlayers.set(addAcademyArray_P)
			template.selectPlayersId.set(addAcademyIdArray_P)
			template.searchForPlayer.set(undefined)
		 	$("#searchUserManage_P").val("");
	 	}
	}
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

Template.registerHelper('getPlayerEmail_P',function(data){
	if(data){
		var acaN = userDetailsTT.findOne({"userId":data,role:"Player"});
		try{
			if(acaN.emails==undefined||acaN.emails==null){
				return ""
			}
			else if(acaN&&acaN.emails[0].address){
				return acaN.emails[0].address
			}
		}catch(e){
		}
	}
});