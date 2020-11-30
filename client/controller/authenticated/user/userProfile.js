Template.userProfileSettings.onCreated(function() {
	var template = this;

	this.subscribe("onlyLoggedIn");
	if(Meteor.user().role == "Player")
		this.subscribe("loggedPlayerInfo",Meteor.userId());
	this.subscribe("associationPermissions");
	//this.subscribe("academyDetails");
	if(Meteor.user().role == "Association")
	{
		template.autorun(function() {
		if(Session.get("enteredAbbName_assocprofile")!=undefined){
			template.subscribe("findBYAbbNameDA",Session.get("enteredAbbName_assocprofile"));
		}
		})
	}
	else if(Meteor.user().role == "Academy")
	{
		template.autorun(function() {
		if(Session.get("enteredAbbName_academyprofile")!=undefined){
			template.subscribe("findBYAbbName",Session.get("enteredAbbName_academyprofile"));
		}
		})
		
	}

});

Template.userProfileSettings.onRendered(function() {
	Session.set("enteredAbbName_assocprofile",undefined)
	Session.set("enteredAbbName_academyprofile",undefined)
	Session.get("DDofdateOfBirth_P",null)

	
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
	

	/*$('#selectTagop').niceScroll({
		cursorborderradius: '0px', 
		background: 'transparent', 
		cursorwidth: '3px', 
		cursorcolor: 'maroon',
		autohidemode: true, 
	});

	$('#selectTagod2').niceScroll({
		cursorborderradius: '0px', 
		background: 'transparent',
		cursorwidth: '3px', 
		cursorcolor: 'maroon',
		autohidemode: true, 
	});
	$('#selectTag3').slimScroll({
		height: '5.4em',
		color: 'maroon',
		size: '3px',
		width: '100%'
	});
	$('#selectTag4').slimScroll({
		height: '5.4em',
		color: 'maroon',
		size: '3px',
		width: '100%'
	});

	$('.blackListOfUsers').niceScroll({
		cursorborderradius: '0px', 
		background: 'transparent',
		cursorwidth: '4px',
		cursorcolor: 'black',
		autohidemode: true, 
	});*/
	$('.teamsOfUser').niceScroll({
		cursorborderradius: '0px', 
		background: 'transparent', 
		cursorwidth: '4px', 
		cursorcolor: 'black',
		autohidemode: true, 
	});

	


	if(Meteor.user().role == "Player")
	{
		Blaze.render(Template.playerProfile, $("#profileHolder")[0]);
		Blaze.render(Template.playerProfileMenus, $("#profileMenus")[0]);
	}
	else if(Meteor.user().role == "Academy")
	{
		Blaze.render(Template.academyProfileSettings, $("#profileHolder")[0]);	
		Blaze.render(Template.academyProfileMenus, $("#profileMenus")[0]);	

	}
	else if(Meteor.user().role == "Association" && Meteor.user().associationType == "State/Province/County")
	{
		Blaze.render(Template.associationProfileSettings, $("#profileHolder")[0]);
		Blaze.render(Template.associationProfileMenus, $("#profileMenus")[0]);

	}
	else if(Meteor.user().role == "Association" && Meteor.user().associationType == "District/City")
	{
		Blaze.render(Template.districtAssociationProfile, $("#profileHolder")[0]);
		Blaze.render(Template.districtAssociationProfileMenus, $("#profileMenus")[0]);

	}
	else
		Blaze.render(Template.generalProfileSettings, $("#profileHolder")[0]);

	userProfileSettingsValidate();


});

Template.userProfileSettings.helpers({
	
	
	roleAssociation:function()
	{
		if(Meteor.user().role=="Association" && Meteor.user().associationType == "State/Province/County")
			return true;
	},
	roleDistrictAssociation:function()
	{
		if(Meteor.user().role=="Association" && Meteor.user().associationType == "District/City")
			return true;
	},
	roleAcademy:function()
	{
		if(Meteor.user().role=="Academy")
			return true;
	},
	roleOther:function()
	{
		try{
		if(Meteor.user().role != "Academy" && Meteor.user().role != "Player" &&
			Meteor.user().role != "Association")
			return true;
	}catch(e){}
	},
	checkCoachRole:function()
	{
		try{
		if(Meteor.user().role == "Coach")
			return true;
	}catch(e){}
	},
	otherRole:function()
	{
		if(Meteor.user().role != "Academy" && Meteor.user().role != "Player" &&
			Meteor.user().role != "Association")
		{
			return Meteor.user().role;

		}
	},
	allowmanagePlayers:function(){
		if(Meteor.user().role=="Association"){
			return true;
		}
		else if(Meteor.user().role=="Academy"){
			return true;
		}
	},
	allowmanageacademy:function(){
		if(Meteor.user().role=="Association"){
			return true;
		}
	}
});

Template.userProfileSettings.events({
	'click #teamsDropDown': function(e) {
		e.preventDefault();
		if ($("#teamsDropDown").hasClass("open")) {
			$("#teamsDropDown").removeClass("open");
			$("#teamsDropDown").children("ul").slideUp("fast");
			$('#selectTag1').slimScroll({
				height: '5.4em',
				color: 'maroon',
				size: '3px',
				width: '100%'
			});
		} else {
			$("#teamsDropDown").addClass("open");
			$("#teamsDropDown").children("ul").slideDown("fast");
			$('#selectTag1').slimScroll({
				destroy: true
			});
		}
	},
	"click #manageACASD2":function(e){
		e.preventDefault();
		$("#renderManagePlayers").empty();
		Blaze.render(Template.manageAcademies,$("#renderManagePlayers")[0]);
		$("#manageAcademies").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #manageAcaPla":function(e){
		window.open(Router.url("managePlayersAssocAcad",{page:1}));
	},
	"click #manageACASD":function(e){
		window.open(Router.url("manageAcademiesAssoc",{page:1}));
	},
	'click #userCancelButton': function(e) {
		e.preventDefault();
		var userId = Meteor.users.findOne({
			"_id": Meteor.userId()
		});
		if (userId.profileSettingStatus == false) {
			Meteor.logout();
		} else if (Session.get("previousLocationPath") !== undefined) {
			var previousPath = Session.get("previousLocationPath");
			Session.set("previousLocationPath", undefined);
			Session.set("previousLocationPath", null);
			Router.go(previousPath);
		} else {
			Router.go("/upcomingEvents");
		}
	},
	'keyup #mainTag': function(event) {
		var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
		var $rows = $("#selectTagop").find("div");
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
  	'keyup #mainTag1': function(event) {
    	var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
		var $rows = $("#selectTagod2").find("div");
		$rows.each(function() {
			var oLabel = $(this);
			if (oLabel.length > 0) {
                    if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) {
                        $(this).show();
                    } else{
                        $(this).hide();
                    } 
                }
		})
  	},
  	"change #checkAllPlaces":function(e){
		//e.preventDefault();
		if($("input[id=checkAllPlaces]:checkbox").prop('checked')){
			$("input[name=checkDomainName]:checkbox").each(function() {
				if(!$(this).is(':disabled')){
					$(this).prop('checked', true);
				}
			});
		}
		else{
			$("input[name=checkDomainName]:checkbox").each(function() {
				if(!$(this).is(':disabled')){
					$(this).prop('checked', false);
				}
			});
		}
	},
	"change input[name=checkDomainName]":function(e){
		//e.preventDefault();
		if($("input[name=checkDomainName]:checked").length==$("input[name=checkDomainName]:checkbox").length)
		{
			$("input[id=checkAllPlaces]:checkbox").prop('checked', true);
		}
		else
		$("input[name=checkAllPlaces]:checkbox").prop('checked', false);
	},
	'submit form': function(e) {
		e.preventDefault();
		
	},
	'click #errorPopupClose': function(e) {
		e.preventDefault();
		$('#errorPopup').modal('hide');
	},
	'click #playerChangePassword':function(e){
		e.preventDefault()
		try{
			if(Session.get("playerDBName")){
				var playerInfo = nameToCollection(Session.get("playerDBName")).findOne({"userId": Meteor.userId()});
				$("#changePassRender_p").empty()
				if(playerInfo && playerInfo.affiliatedTo){
					if(playerInfo.affiliatedTo == "other"){
						Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
						$("#changePassword").modal({
							backdrop: 'static',
							keyboard: false
						});
					}
					else if(playerInfo.affiliatedTo == "stateAssociation"){
						if(playerInfo.associationId != null || playerInfo.associationId != undefined || playerInfo.associationId != ""){
							var permisssionsInfo = associationPermissions.findOne({"associationId":playerInfo.associationId});
							if(permisssionsInfo && permisssionsInfo.playerChangePass){
								if(permisssionsInfo.playerChangePass == "yes"){
									Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
									$("#changePassword").modal({
										backdrop: 'static',
										keyboard: false
									});
								}
								else{
									alert("You are not permitted to change password, contact your association")
								}
							}
						}
					}
					else if(playerInfo.affiliatedTo == "districtAssociation"){
						if(playerInfo.parentAssociationId != null || playerInfo.parentAssociationId != undefined || playerInfo.parentAssociationId != ""){
							var permisssionsInfo = associationPermissions.findOne({"associationId":playerInfo.parentAssociationId});
							if(permisssionsInfo && permisssionsInfo.playerChangePass){
								if(permisssionsInfo.playerChangePass == "yes"){
									Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
									$("#changePassword").modal({
										backdrop: 'static',
										keyboard: false
									});
								}
								else{
									alert("You are not permitted to change password, contact your association")
								} 							
							}
						}	
					}
					else if(playerInfo.affiliatedTo == "academy"){
						if(playerInfo.clubNameId != null || playerInfo.clubNameId != undefined || playerInfo.clubNameId != ""){
							var academyInfo = academyDetails.findOne({"userId":playerInfo.clubNameId});
							if(academyInfo && academyInfo.affiliatedTo){
								if(academyInfo.affiliatedTo == "stateAssociation"){
									if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.associationId != ""){
										var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.associationId});
										if(permisssionsInfo && permisssionsInfo.playerChangePass){
											if(permisssionsInfo.playerChangePass == "yes"){
												Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
												$("#changePassword").modal({
													backdrop: 'static',
													keyboard: false
												});
											}
											else{
												alert("You are not permitted to change password, contact your association")
											}
										}
									}
								}
								else if(academyInfo.affiliatedTo == "districtAssociation"){
									if(academyInfo.parentAssociationId != null || academyInfo.parentAssociationId != undefined || academyInfo.parentAssociationId != ""){
										var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.parentAssociationId});
										if(permisssionsInfo && permisssionsInfo.playerChangePass){
											if(permisssionsInfo.playerChangePass == "yes"){
												Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
												$("#changePassword").modal({
													backdrop: 'static',
													keyboard: false
												});
											}
											else {
												alert("You are not permitted to change password, contact your association")
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}catch(e){
		}	
	},
	"click #stateAssManageAffID":function(e){
		e.preventDefault();
		if(Meteor.userId){
			$("#changePassRender_p").empty();
    		Blaze.render(Template.manageAffId,$("#changePassRender_p")[0]);
			$("#manageAffId").modal({
				backdrop: 'static',
				keyboard: false
			});
		}
	},
	'click #otherChangePassword':function(e){
		try{
			var findWho = Meteor.users.findOne({userId:Meteor.userId()});
			$("#changePassRender_p").empty()
			if(findWho&&findWho.role&&(findWho.role=="Umpire"||findWho.role=="Coach"||findWho.role=="Organiser"||findWho.role=="Other"||findWho.role=="Journalist")){
				Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
					$("#changePassword").modal({
						backdrop: 'static',
						keyboard: false
					});
			}
		}catch(e){

		}
	},
	'click #accDetails':function(e){
		try{
			var findWho = Meteor.users.findOne({userId:Meteor.userId()});
			$("#acc_details_content").empty()
			if(findWho&&findWho.role&&(findWho.role=="Coach")){
				Blaze.render(Template.accountDetails,$("#acc_details_content")[0]);
					$("#accountDetails").modal({
						backdrop: 'static',
						keyboard: false
					});
			}
		}catch(e){

		}
	},
	'click #serviceDetails':function(e){
		try{
			var findWho = Meteor.users.findOne({userId:Meteor.userId()});
			if(findWho&&findWho.role&&(findWho.role=="Coach"))
			{
				Router.go("/myFinance");
			}
		}catch(e){

		}
	},
	


	'click #stateAssChangePassword':function(e){
		e.preventDefault()
		if(Meteor.userId()){
			$("#changePassRender_p").empty()
			Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
			$("#changePassword").modal({
				backdrop: 'static',
				keyboard: false
			});
		}
	},
	'click #stateAssManagePlayers':function(e){
		e.preventDefault();
		if(Meteor.userId()){
			window.open(Router.url("managePlayersAssocAcad",{page:1}));
		}
	},
	"click #stateAssManageAcademy":function(e){
		e.preventDefault();
		if(Meteor.userId()){
			window.open(Router.url("manageAcademiesAssoc",{page:1}));
		}
	},
	"click #stateAssManageDA":function(e){
		e.preventDefault();
		if(Meteor.userId()){
			window.open(Router.url("manageDistrictAssocBystate",{page:1}))
		}
	},
	"click #stateAssPermisssions":function(e){
		e.preventDefault();
		if(Meteor.userId){
			$("#changePassRender_p").empty();
			Blaze.render(Template.PermissionsSettings,$("#changePassRender_p")[0]);
			$("#PermissionsSettings").modal({
				backdrop: 'static',
				keyboard: false
			});
		}
	},
	"click stateAssManageAffID":function(e){
		e.preventDefault();
		if(Meteor.userId){
			$("#changePassRender_p").empty();
    		Blaze.render(Template.manageAffId,$("#changePassRender_p")[0]);
			$("#manageAffId").modal({
				backdrop: 'static',
				keyboard: false
			});
		}
	},
	"click #stateAssRenewPlayers":function(e){
		try{
		e.preventDefault();
		var numberOfPlayers = 0;
		if(Meteor.userId){
			Meteor.call("renewAllPlayersNumber",function(e,res){
				if(res!=undefined){
					numberOfPlayers = res;
					if(parseInt(res)>0){
						$("#confirmNEWToRenew").modal({
            				backdrop: 'static'
        				});
						$("#conFirmHeaderRenew").text("Renew "+numberOfPlayers+" Players?");
					}
					else {
						alert("There are no players to renew")
					}
					if(e){
					}
				}
			});
		}
	}catch(e){
	}
		/*if(Meteor.userId){
			Meteor.call("renewAllPlayersStatus",function(e,res){
				if(res){
					alert("Number Of Players Renewed:"+res)
				}
			})
		}*/
	},
	'click #yesButtonRenew': function(e, template) {
        try{
        	if(Meteor.userId){
				Meteor.call("renewAllPlayersStatus",function(e,res){
					if(res){
						$("#confirmNEWToRenew").modal('hide');
						alert("Number Of Players Renewed:"+res);
					}
				})
			}
        }catch(e){

        }
    },
    'click #noButtonREnew':function(e){
    	e.preventDefault();
    	$("#confirmNEWToRenew").modal('hide')
    },
    'click #noButton': function(e) {
        e.preventDefault();
        $("#confirmModal").modal('hide');
    },
	"click #districtAssChangePassword":function(e){
		e.preventDefault();
		if(Meteor.userId()){
			$("#changePassRender_p").empty();
			try{
				var districtAssInfo = associationDetails.findOne({"userId": Meteor.userId()});
				if(districtAssInfo != undefined){
					if(districtAssInfo.affiliatedTo){
						if(districtAssInfo.affiliatedTo == "other"){
							Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
							$("#changePassword").modal({
								backdrop: 'static',
								keyboard: false
							});
						}else if(districtAssInfo.affiliatedTo == "stateAssociation"){
							if(districtAssInfo.parentAssociationId != null || districtAssInfo.parentAssociationId != undefined || districtAssInfo.parentAssociationId != ""){
								var permisssionsInfo = associationPermissions.findOne({"associationId":districtAssInfo.parentAssociationId});
								if(permisssionsInfo && permisssionsInfo.districtAssocChangePass){
									if(permisssionsInfo.districtAssocChangePass == "yes"){
										Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
										$("#changePassword").modal({
											backdrop: 'static',
											keyboard: false
										});
									}
									else{
										alert("You are not permitted to change password, contact your association")
									}
								}
							}
						}
					}
				}
			}catch(e){
			}
		}
	},
	"click #districtAssManagePlayers":function(e){
		e.preventDefault();
		try{
			var districtAssInfo = associationDetails.findOne({"userId": Meteor.userId()});
			if(districtAssInfo != undefined){
				if(districtAssInfo.affiliatedTo){
					if(districtAssInfo.affiliatedTo == "other"){
						alert("You are not permitted to manage players, contact your association")
					}
					else if(districtAssInfo.affiliatedTo == "stateAssociation"){
						window.open(Router.url("managePlayersAssocAcad",{page:1}));
					}
				}
			}
		}catch(e){
		}
	},
	"click #districtAssManageAcademy":function(e){
		e.preventDefault();
		try{
			var districtAssInfo = associationDetails.findOne({"userId": Meteor.userId()});
			if(districtAssInfo != undefined){
				if(districtAssInfo.affiliatedTo){
					if(districtAssInfo.affiliatedTo == "other"){
						alert("You are not permitted to manage academies, contact your association")
					}
					else if(districtAssInfo.affiliatedTo == "stateAssociation"){
						window.open(Router.url("manageAcademiesAssoc",{page:1}));
					}
				}
			}
		}catch(e){
		}
	},
	"click #acaChangePassword":function(e){
		try{
			var academyInfo = academyDetails.findOne({"userId": Meteor.userId()});
			$("#changePassRender_p").empty();
			if(academyInfo){
				if(academyInfo.affiliatedTo){
					if(academyInfo.affiliatedTo == "other"){
						Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
						$("#changePassword").modal({
							backdrop: 'static',
							keyboard: false
						});
					}
					else if(academyInfo.affiliatedTo == "districtAssociation"){
						if(academyInfo.parentAssociationId != null || academyInfo.parentAssociationId != undefined || academyInfo.parentAssociationId != ""){
							var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.parentAssociationId});
							if(permisssionsInfo && permisssionsInfo.academyChangePass){
								if(permisssionsInfo.academyChangePass == "yes"){
									Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
									$("#changePassword").modal({
										backdrop: 'static',
										keyboard: false
									});
								}
								else{
									alert("You are not permitted to change password, contact your association")
								}
							}
						}
					}
					else if(academyInfo.affiliatedTo == "stateAssociation"){
						if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.associationId != ""){
							var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.associationId});
							if(permisssionsInfo && permisssionsInfo.academyChangePass){
								if(permisssionsInfo.academyChangePass == "yes"){
									Blaze.render(Template.changePassword,$("#changePassRender_p")[0]);
									$("#changePassword").modal({
										backdrop: 'static',
										keyboard: false
									});
								}
								else{
									alert("You are not permitted to change password, contact your association")
								}
							}
						}
					}
				}
			}
		}catch(e){
		}
	},
	"click #acaManagePlayers":function(e){
		e.preventDefault();
		var academyInfo = academyDetails.findOne({"userId": Meteor.userId()});
		if(academyInfo&&academyInfo.affiliatedTo){
			if(academyInfo.affiliatedTo == "other"){
				alert("You are not permitted to manage players, contact your association")
			}
			else if(academyInfo.affiliatedTo == "stateAssociation"){
				window.open(Router.url("managePlayersAssocAcad",{page:1}));
			}
			else if(academyInfo.affiliatedTo == "districtAssociation"){
				window.open(Router.url("managePlayersAssocAcad",{page:1}));
			}
		}
	}
})


/*********** validations **********************/
var userProfileSettingsValidate = function() {
	var s = $('#userProfileSettings').validate({
		rules: {
			userName: {
				required: true,
				minlength: 5,
				maxlength: 60,
				whiteSpace : /\S/
			},
			phoneNumber: {
				required:true,
				minlength: 10,
				maxlength: 10,
				validPhoneNum: /^[0-9]{1,10}$/
			},
			playerGender:{
				playerGenderValidation:true,
			},
			
			emailAddressUserProf: {
				required: true,
				email:true,
				
			},
			playerName:{
				whiteSpace : /\S/,
				requireCluifPlayer:true,
			},
			associationName:{
				whiteSpace : /\S/,
				requireCluifAssoc:true,
			},
			clubName:{
				whiteSpace : /\S/,
				requireClub:true,
			},
			name:{
				whiteSpace : /\S/,
				requiredName:true,
			},
			abbrevationAcademy:{
				required:true,
				checkAbbrevationAcademy:true,
				whiteSpace : /\S/
			},
			abbrevationAssociation:{
				required:true,
				checkAbbrevationAssociation:true,
				whiteSpace : /\S/
			},
			checkSports: {
				CheckSports: true
			},
			checkDomain: {
				CheckDomain: true
			},
			subDomain1Area: {
				maxlength: 200,
				validText2: /^\w/,
				validText: /^([0-9A-Za-z -]+)(,[0-9A-Za-z -]+)*$/
			},
			subDomain2Area: {
				maxlength: 200,
				validText2: /^\w/,
				validText: /^([0-9A-Za-z -]+)(,[0-9A-Za-z -]+)*$/
			},
			awayFromDate:{
				checkValidDate:true,
			},
			dateOfBirthDate:{
				checkDateOfBirthValidDate:true
			},
			checkAwayFrom: {
				checkValidDate: true,
			},
			nationalAffiliationId:{
				whiteSpace : /\S/
			}
		},
		messages: {
			userName: {
				required: "Please enter your name",
				minlength: "The name should contain atleast 5 characters",
				maxlength: "The name should not exceed 60 characters",
				whiteSpace : "Please enter valid user name",
			},

			emailAddressUserProf: {
				required: "Please enter your email address",
				email: "Please enter valid email address",
			},
			playerName:{
				whiteSpace : "Please enter valid characters",
				requireCluifPlayer:"Please enter valid player name",
			},
			playerGender:{
				playerGenderValidation:"Please select gender"
			},
			associationName:{
				whiteSpace : "Please enter valid characters",
				requireCluifAssoc:"Please enter valid association name",
			},
			clubName:{
				whiteSpace : "Please enter valid characters",
				requireCluifAssoc:"Please enter valid academy name",
				requireCluifAca:"Please enter valid academy name"
			},
			name:{
				whiteSpace : "Please enter valid characters",
				requiredName:"Please enter valid  name",
			},
			abbrevationAcademy:{
				required: "Please enter abbrevation",
				checkAbbrevationAcademy:"Please enter unique abbrevation"
			},
			abbrevationAssociation:{
				required: "Please enter abbrevation",
				checkAbbrevationAssociation:"Please enter unique abbrevation"
			},
			phoneNumber: {
				required:"Please enter your phone number",
				minlength: "Please enter the valid phone number",
				maxlength: "Please enter the  valid phone number",
				validPhoneNum: "Please enter the valid phone number"
			},
			checkSports: {
				CheckSports: "Please select atleast one Sport"
			},
			checkDomain: {
				CheckDomain: "Please select atleast one Place"
			},
			subDomain1Area: {
				maxlength: "Event tag should contain less than 200 characters",
				validText2: "Event tag is not valid comma separated list",
				validText: "Event tag is not valid comma separated list and should contain only alpha numeric characters"
			},
			subDomain2Area: {
				maxlength: "Event sub-tag should contain less than 200 characters",
				validText2: "Event sub-tag is  not valid comma separated list",
				validText: "Event sub-tag is not valid comma separated list and should contain only alpha numeric characters"
			},
			checkAwayFrom: {
				checkValidDate: "Please provide your valid date as DD MMM YYYY (eg:01 Sep 1990)",
			},
			dateOfBirthDate:{
				checkDateOfBirthValidDate: "Please provide your valid date as DD MMM YYYY (eg:01 Sep 1990)",

			},
			
			awayFromDate:{
				checkValidDate:"Please provide your valid date as DD MMM YYYY (eg:01 Sep 1990)",
			},
			nationalAffiliationId:{
				whiteSpace : "Please enter valid national affiliation id",
			}
			
		},

		errorContainer: $('#errorContainer'),
		errorLabelContainer: $('#errorContainer ul'),
		wrapper: 'li',
		invalidHandler: function(form, validator, element) {
			
			var elem = $(element);
			var errors = s.numberOfInvalids();
			if (errors) {
				$('#errorPopup').modal({
					backdrop: 'static',
					keyboard: false
				});
			};
			for (var i = 0; i < validator.errorList.length; i++) 
			{
				var q = validator.errorList[i].element;
				if (q.name == 'emailAddressUserProf') {
					$('#emailAddressUserProf').css('color', '#ff1a1a');
				}
				if (q.name == 'associationName') {
					$('#associationName').css('color', '#ff1a1a');
				}
				if (q.name == 'clubName') {
					$('#clubName').css('color', '#ff1a1a');
				}
				if(q.name == "name")
				{
					$('#name').css('color', '#ff1a1a');

				}
				if(q.name == 'phoneNumber')
				{
					$('#phoneNumber').css('color', '#ff1a1a');
				}
				if(q.name == 'awayToDate')
				{
					$('#awayToDate').css('color', '#ff1a1a');

				}
				if (q.name == 'checkAwayFrom') {
					$('#awayToDate').css('color', '#ff1a1a');
					$('#awayFromDate').css('color', '#ff1a1a');
				}
				if (q.name === 'awayToDate') {
					$('#awayFromDate').css('color', '#ff1a1a');
					$('#awayToDate').css('color', '#ff1a1a');
				}
				if (q.name == 'checkSports') {
					$('#mainTag').css('color', '#ff1a1a');
				}
				if (q.name == 'checkDomain') {
					$('#mainTag1').css('color', '#ff1a1a');
				}
				if (q.name == 'subDomain1Area') {
					$('#mainTag2').css('color', '#ff1a1a');
				}
				if (q.name == 'subDomain2Area') {
					$('#mainTag3').css('color', '#ff1a1a');
				}
				if (q.name == 'nationalAffiliationId') {
					$('#nationalAffiliationId').css('color', '#ff1a1a');
				
				}
			}

		},
		submitHandler: function(event) {

			if(Meteor.user().role == "Player")
				savePlayerProfile(event);
			else if(Meteor.user().role == "Association" && Meteor.user().associationType == "State/Province/County")
				saveStateAssociationProfile(event);
			else if(Meteor.user().role == "Association" && Meteor.user().associationType == "District/City")
				saveDistrictAssociationProfile(event);
			else if(Meteor.user().role == "Academy")
				saveAcademyProfile(event);
			else
				saveGeneralProfile(event);

		}
	});
}

$.validator.addMethod(
	"validPhoneNum",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}

);


$.validator.addMethod(
	"checkDateOfBirthValidDate",
	function(value, element, regexp) {
		var check = false;
		
		var fromDate = $('#dateOfBirthDate').val();
		if($('#dateOfBirthDate').val()==""){
				return false
		}
		else
		{
			var text = $('#dateOfBirthDate').val().trim();
			var comp = text.split(" ");
			if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
			{
				var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
				var comp2 = comp[1].toLowerCase();
				var monthNum = parseInt(months.indexOf(comp2)+1);
				var d = parseInt(comp[0]);
				var m = parseInt(monthNum);
				var y = parseInt(comp[2]);
				var date = new Date(y,m-1,d);
				if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
					   return true;
				} else {
					   return false;
				}
			}
			else {
				    return false;
				}
			 	
		}
	}

);
$.validator.addMethod(
	"checkValidDate",
	function(value, element, regexp) {
		var check = false;
		
		var fromDate = $('#awayFromDate').val();
		if($('#awayFromDate').val()==""){
				//return false
			return true;

		}
		else
		{
			var text = $('#awayFromDate').val().trim();
			var comp = text.split(" ");
			if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
			{
				var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
				var comp2 = comp[1].toLowerCase();
				var monthNum = parseInt(months.indexOf(comp2)+1);
				var d = parseInt(comp[0]);
				var m = parseInt(monthNum);
				var y = parseInt(comp[2]);
				var date = new Date(y,m-1,d);
				if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
					   return true;
				} else {
					   return false;
				}
			}
			else {
				    return false;
				}
			 	
		}
	}

);

$.validator.addMethod(
	"checkAbbrevationAcademy",
	function(value, element, regexp) {
		Session.set("enteredAbbName_academyprofile",value);
		var userId = Meteor.user().userId;
		var abbrevationCount = academyDetails.find({"abbrevationAcademy":value}).fetch();
		if(abbrevationCount.length > 0)
		{
			if(abbrevationCount.length == 1)
			{
				var academyInfo = academyDetails.findOne({
					$and:[
	                {"userId":{$in:[userId]}},
	                {"abbrevationAcademy":value}
	              	]
              	});
				if(academyInfo) 
					return true;
				else 
					return false;
			}
			else
				return false;
		}
		else 
			return true;
	}
);

$.validator.addMethod(
	"playerGenderValidation",
	function(value, element, regexp) {
		if(value == null)
			return false;
		else return true;
		
	}
);


$.validator.addMethod(
	"checkAbbrevationAssociation",
	function(value, element, regexp) {
		Session.set("enteredAbbName_assocprofile",value);
		var userId = Meteor.user().userId;
		var abbrevationCount = associationDetails.find({"abbrevationAssociation":value}).fetch();
		if(abbrevationCount.length > 0)
		{
			if(abbrevationCount.length == 1)
			{
				var academyInfo = associationDetails.findOne({
					$and:[
	                {"userId":{$in:[userId]}},
	                {"abbrevationAssociation":value}
	              	]
              	});
				if(academyInfo) 
					return true;
				else 
					return false;
			}
			else
				return false;
		}
		else 
			return true;

	}
);

$.validator.addMethod(
	"whiteSpace",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}

);

$.validator.addMethod(
	"requireClub",
	function(value, element, regexp) {
		if($("#clubName").val().trim().length!==0)
			return true;
		else 
			return false;
	}
);

$.validator.addMethod(
	"requireCluifAssoc",
	function(value, element, regexp) {
		if($("#associationName").val().trim().length!==0)
			return true;
		else 
			return false;
	}
);
$.validator.addMethod(
	"requireCluifPlayer",
	function(value, element, regexp) {
		if($("#playerName").val().trim().length!==0)
			return true;
		else 
			return false;
	}
);
$.validator.addMethod(
	"requiredName",
	function(value, element, regexp) {
		if($("#name").val().trim().length!==0)
			return true;
		else 
			return false;
	}
);

var savePlayerProfile = function(event) {
	/*
	var lCheckedSubDomain2Name = $("#subDomain2Area").val().replace(' ,', ',').split(',').map(function(strVale) {
		return strVale.trim();
	});
	var lCheckedSubDomain1Name = $("#subDomain1Area").val().replace(' ,', ',').split(',').map(function(strVale) {
		return strVale.trim();
	});*/

	var lUserName = $("#playerName").val();
	var lPhoneNumber = $("#phoneNumber").val();
	var lDateOfBirth = $("#dateOfBirthDate").val();
	var lGuardianName = $("#guardianName").val();
	var lGender = $("#playerGender").val();
	var lAddress = $("#address").val();
	var lCity = $("#city").val();
	var lState = $("#state").val();
	var lPinCode = $("#pinCode").val();
	var	lNationalAffiliationId= $("#nationalAffiliationId").val();

	var lCheckedProjectName = $("input[name=checkProjectName]:checked").map(
		function() {
			return this.value;
		}).get();
	var lCheckedDomainName = $("input[name=checkDomainName]:checked").map(
		function() {
			return this.value;
		}).get();


	var lData = {
		userName: lUserName,
		guardianName:lGuardianName,
		phoneNumber:lPhoneNumber,
		gender:lGender,
		dateOfBirth: lDateOfBirth,
		nationalAffiliationId:lNationalAffiliationId,
		address:lAddress,
		city:lCity,
		state:lState,
		pinCode:lPinCode,
		interestedProjectName: lCheckedProjectName,
		interestedDomainName: lCheckedDomainName,
		userId: Meteor.user().userId,
	};
	
	Meteor.call("updatePlayer", lData, function(error, response) {
	
		if (response) {
			Router.go("/upcomingEvents");

		} else if (error) {
		}
	});
}


var saveStateAssociationProfile = function(event) {
	/*
	var lCheckedSubDomain2Name = $("#subDomain2Area").val().replace(' ,', ',').split(',').map(function(strVale) {
		return strVale.trim();
	});
	var lCheckedSubDomain1Name = $("#subDomain1Area").val().replace(' ,', ',').split(',').map(function(strVale) {
		return strVale.trim();
	});*/

	var lUserName = $("#associationName").val();
	var lContactPerson = $("#associationContactPerson").val();
	var lEmailAddress = $("#emailAddressUserProf").val();
	var lPhoneNumber = $("#phoneNumber").val();
	var lDateOfInc = $("#awayFromDate").val();
	var lAbbrevation = $("#abbrevationAssociation").val();
	var lAddress = $("#address").val();
	var lCity = $("#city").val();
	var lState = $("#state").val();
	var lPinCode = $("#pinCode").val();
	


	var lData = {
		userName: lUserName,
		contactPerson:lContactPerson,
		emailAddress:lEmailAddress,
		phoneNumber:lPhoneNumber,
		dateOfInc: lDateOfInc,
		abbrevation:lAbbrevation,
		address:lAddress,
		city:lCity,
		state:lState,
		pinCode:lPinCode,
		userId: Meteor.user().userId
		
	};
	
	Meteor.call("updateAssociation", lData, function(error, response) {
	
		if (response) {
			Router.go("/upcomingEvents");

		} else if (error) {
		}
	});
}

var saveDistrictAssociationProfile = function(event) {
	/*
	var lCheckedSubDomain2Name = $("#subDomain2Area").val().replace(' ,', ',').split(',').map(function(strVale) {
		return strVale.trim();
	});
	var lCheckedSubDomain1Name = $("#subDomain1Area").val().replace(' ,', ',').split(',').map(function(strVale) {
		return strVale.trim();
	});*/

	var lUserName = $("#associationName").val();
	var lContactPerson = $("#associationContactPerson").val();
	var lPhoneNumber = $("#phoneNumber").val();
	var lDateOfInc = $("#awayFromDate").val();
	var lAbbrevation = $("#abbrevationAssociation").val();
	var lAddress = $("#address").val();
	var lCity = $("#city").val();
	var lState = $("#state").val();
	var lPinCode = $("#pinCode").val();
	var lCheckedProjectName = $("input[name=checkProjectName]:checked").map(
		function() {
			return this.value;
		}).get();
	var lCheckedDomainName = $("input[name=checkDomainName]:checked").map(
		function() {
			return this.value;
		}).get();

	var lData = {
		userName: lUserName,
		contactPerson:lContactPerson,
		phoneNumber:lPhoneNumber,
		dateOfInc: lDateOfInc,
		abbrevation:lAbbrevation,
		address:lAddress,
		city:lCity,
		state:lState,
		pinCode:lPinCode,
		userId: Meteor.user().userId,
		interestedProjectName: lCheckedProjectName,
		interestedDomainName: lCheckedDomainName,
	};
	
	Meteor.call("updateDistrictAssociation", lData, function(error, response) {
	
		if (response) {
			Router.go("/upcomingEvents");

		} else if (error) {
		}
	});
}


var saveAcademyProfile = function(event) {
	/*
	var lCheckedSubDomain2Name = $("#subDomain2Area").val().replace(' ,', ',').split(',').map(function(strVale) {
		return strVale.trim();
	});
	var lCheckedSubDomain1Name = $("#subDomain1Area").val().replace(' ,', ',').split(',').map(function(strVale) {
		return strVale.trim();
	});*/

	var lUserName = $("#clubName").val();
	var lContactPerson = $("#academyContactPerson").val();
	var lPhoneNumber = $("#phoneNumber").val();
	var lDateOfInc = $("#awayFromDate").val();
	var lAbbrevation = $("#abbrevationAcademy").val();
	var lAddress = $("#address").val();
	var lCity = $("#city").val();
	var lState = $("#state").val();
	var lPinCode = $("#pinCode").val();
	var lCheckedProjectName = $("input[name=checkProjectName]:checked").map(
		function() {
			return this.value;
		}).get();
	var lCheckedDomainName = $("input[name=checkDomainName]:checked").map(
		function() {
			return this.value;
		}).get();

	var lData = {
		userName: lUserName,
		contactPerson:lContactPerson,
		phoneNumber:lPhoneNumber,
		dateOfInc: lDateOfInc,
		abbrevation:lAbbrevation,
		address:lAddress,
		city:lCity,
		state:lState,
		pinCode:lPinCode,
		userId: Meteor.user().userId,
		interestedProjectName: lCheckedProjectName,
		interestedDomainName: lCheckedDomainName,
	};
	
	Meteor.call("updateAcademy", lData, function(error, response) {
	
		if (response) {
			Router.go("/upcomingEvents");

		} else if (error) {
		}
	});
}

var saveGeneralProfile = function(event) {


	var lUserName = $("#name").val();
	var lGuardianName = $("#guardianName").val();
	var lPhoneNumber = $("#phoneNumber").val();
	var lGender = $("#playerGender").val();
	var lDateOfBirth = $("#dateOfBirthDate").val();
	var lAddress = $("#address").val();
	var lCity = $("#city").val();
	var lState = $("#state").val();
	var lPinCode = $("#pinCode").val();
	var lCheckedProjectName = $("input[name=checkProjectName]:checked").map(
		function() {
			return this.value;
		}).get();
	var lCheckedDomainName = $("input[name=checkDomainName]:checked").map(
		function() {
			return this.value;
		}).get();
	
	var lData = {
		userName: lUserName,
		guardianName:lGuardianName,
		phoneNumber:lPhoneNumber,
		gender:lGender,
		dateOfBirth: lDateOfBirth,
		userId: Meteor.user().userId,
		interestedProjectName: lCheckedProjectName,
		interestedDomainName: lCheckedDomainName
	};
	
	Meteor.call("updateOtherUser", lData, function(error, response) {
	
		if (response) {
			Router.go("/upcomingEvents");

		} else if (error) {
		}
	});
}


var nameToCollection = function(name) {
  return this[name];
};

Template.registerHelper('checkDomainSelection', function(data) {

		if(Meteor.user().role == "Player" && Session.get("playerDBName"))
		{
			var userInfo = nameToCollection(Session.get("playerDBName")).findOne({"userId":Meteor.user().userId});
			if(userInfo && userInfo.state)
			{

				if(data == userInfo.state)
					return "selected";
			}
			
		}
		else if(Meteor.user().role == "Academy")
		{
			var userInfo = academyDetails.findOne({"userId":Meteor.user().userId});
			if(userInfo && userInfo.state)
			{
				if(data == userInfo.state)
					return "selected";
			}
		}
		else if(Meteor.user().role == "Association")
		{
			var userInfo = associationDetails.findOne({"userId":Meteor.user().userId});
			if(userInfo && userInfo.state)
			{
				if(data == userInfo.state)
					return "selected";
			}
		}
		else
		{
			var userInfo = otherUsers.findOne({"userId":Meteor.user().userId});
			if(userInfo && userInfo.state)
			{
				if(data == userInfo.state)
					return "selected";
			}
		}	
	});



/******************************************************************************/
/**
 * validator method to validate phone number of user
 */
$.validator.addMethod(
	"validPhoneNum",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}

);








/**
 * validator method to validate event tags to csv format
 */
$.validator.addMethod(
	"validText",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}

);





/**
 * validation method to check no fields with invalid spaces
 */
$.validator.addMethod(
	"validText2",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}

);

$.validator.addMethod(
	"checkToDate",
	function(value, element, regexp) {
		var check = false;
		var toDate = new Date(String($('#awayToDate').val()));
		var fromDate = new Date(String($('#awayFromDate').val()))
		if ($("#awayToDate").val() != "" && $("#awayFromDate").val() == "") {
			return false;
		} else return true;
	}

);

/**
 * validator method to validate away from date,
 * if away from date is give and away to date is not given return false,
 * else true
 */
$.validator.addMethod(
	"checkFromDate",
	function(value, element, regexp) {
		var check = false;
		var toDate = new Date(String($('#awayToDate').val()));
		var fromDate = new Date(String($('#awayFromDate').val()));
		if ($("#awayToDate").val() == "" && $("#awayFromDate").val() != "") {
			return false;
		} else return true;
	}

);

/**
 * if atleast one project or sport is not selected return false,
 * else true
 */
$.validator.addMethod(
	"CheckSports",
	function(value, element, regexp) {
		
		if ($("input[name=checkProjectName]:checked").map(
				function() {
					return this.value;
				}).get() == "") {
			return false
		} else return true
	}

);

/**
 * if atleast one domain or place is not selected return false,
 * else true
 */
$.validator.addMethod(
	"CheckDomain",

	function(value, element, regexp) {
		if ($("input[name=checkDomainName]:checked").map(
				function() {
					return this.value;
				}).get() == "") {
			return false
		} else return true
	}

);


function checkCheckboxList(list) {
    var ch = 0;
    var uch = 0;

    list.each(function() {
        if ($(this).find('input[type="checkbox"]').is(':checked')) {
            ch++;
        } else {
            uch++;
        }
    });
    if (ch === list.length) {
        return 1;
    } else if (uch === list.length) {
        return 2;
    } else {
        return 0;
    }
}

function setCheckbox(element, rows) {
    rows.each(function() {
        $(this).find('input[type="checkbox"]').click(function() {
            var checkresult = checkCheckboxList(rows);
            if (checkresult === 1) {
                $(element).prop("indeterminate", false);
                $(element).prop("checked", true);
            } else if (checkresult === 2) {
                $(element).prop("indeterminate", false);
                $(element).prop("checked", false);
            } else {
                $(element).prop("indeterminate", true);
            }
        });
    });
    var checkresult = checkCheckboxList(rows);
    if (checkresult === 1) {
        $(element).prop("indeterminate", false);
        $(element).prop("checked", true);
    } else if (checkresult === 2) {
        $(element).prop("indeterminate", false);
        $(element).prop("checked", false);
    } else {
        $(element).prop("indeterminate", true);
    }
}

function getList(element) {
    var $rows = $(element).next().next().find("table.myList tr");
    setCheckbox($(element).next(), $rows);
    return $rows;
}

function suggest(element, lastinput, list) {
    $(element).keyup(function() {
        var sValue = $.trim($(element).val());
        if (lastinput == sValue) {
            return;
        }
        if (sValue === '') {
            list.show();
        } else {
            list.each(function() {
                var oLabel = $(this).find('label');
                if (oLabel.length > 0) {
                    if (oLabel.text().toLowerCase().indexOf(sValue.toLowerCase()) >= 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });
            lastinput = sValue;
        }
    });
}

function clearList(element) {
    $(element).click(function() {
        if ($(this).is(':checked')) {
            $(element).next().find('table.myList tr input[type="checkbox"]').prop("checked", true);
        } else {
            $(element).next().find('table.myList tr input[type="checkbox"]').prop("checked", false);
        }
    });
}




Template.registerHelper('checkRoleSettings', function(data) {
	if(data=="Association"||data=="Academy")
	{
	    return true;
	}
	else
	{
	   return false;
	 }  
  });
Template.registerHelper('checkRoleWHO', function(data) {
	if(data=="Player")
	{
	    return true;
	}
	else
	{
	   return false;
	 }  
  });



Template.registerHelper('ValueclubName', function(data) {
		var usersDetails = Meteor.users.findOne({
			"userId": data
		});
		if(usersDetails){
			return usersDetails.clubName
		} 
 });

Template.registerHelper('checkAssocheckedProj', function(data) {
		var usersDetails = Meteor.users.findOne({
			"userId": Meteor.user().associationId
		});
		if(usersDetails){
			if(usersDetails.role=="Association"){
				if(data==usersDetails.interestedProjectName){
					return "disabled"
				}
				else {
					return ""
				}
			}
		}
	});

Template.registerHelper('checkAssocheckedDom', function(data) {
		var usersDetails = Meteor.users.findOne({
			"userId": Meteor.user().associationId
		});
		if(usersDetails){
			if(usersDetails.role=="Association"){
				if(data==usersDetails.interestedDomainName){
					return "disabled"
				}
				else {
					return ""
				}
			}
		}
	});