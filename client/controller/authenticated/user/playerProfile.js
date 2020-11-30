Template.playerProfile.onCreated(function(){

	this.subscribe("tournamentEvents");
	this.subscribe("domains");
	this.subscribe("loggedPlayerInfo",Meteor.userId());
	this.subscribe("associationPermissions");
	this.subscribe("academyDetails");
	this.subscribe("associationDetails");
})

Template.playerProfile.onRendered(function(){
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

	$('#selectTagop').niceScroll({
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
})


var nameToCollection = function(name) {
  return this[name];
};

Template.playerProfile.helpers({

	lProjectName: function() {
		var lProjectNames = tournamentEvents.find().fetch();
		 if(lProjectNames.length!==0)
   		return lProjectNames
	},
	lDomainName: function() {
		var lProjectNames = domains.find().fetch();
		 if(lProjectNames.length!==0)
   		return lProjectNames;

	},
	lPlayer: function() {
		if(Session.get("playerDBName")){
			var usersDetails = nameToCollection(Session.get("playerDBName")).findOne({
				"userId": Meteor.userId()
			});
			if (usersDetails)
				return usersDetails;
		}
	},
	lPlayerGender:function(){
		if(Session.get("playerDBName")){
			var usersDetails = nameToCollection(Session.get("playerDBName")).findOne({
				"userId": Meteor.userId()
			});
			if (usersDetails)
			{
				if(usersDetails.gender)
					if(usersDetails.gender == "" || usersDetails.gender == null || usersDetails.gender == "other" || userDetails.gender == "null")
						return true;
				else
					return true;
			}
		}
	},
	lPlayerGender1:function(){
		if(Session.get("playerDBName")){
			var lPlayerProfile = nameToCollection(Session.get("playerDBName")).findOne({"userId": Meteor.userId()})
			if(lPlayerProfile && lPlayerProfile.gender)
			{
				var optionalHTML ="";
				if(lPlayerProfile.gender == "Male")
				{
					optionalHTML += "<option value='Male' selected>Male</option>";
					optionalHTML += "<option value='Female'>Female</option>";
					optionalHTML += "<option value='Other'>Other</option>";
				}
				else if(lPlayerProfile.gender == "Female")
				{
					optionalHTML += "<option value='Male'>Male</option>";
					optionalHTML += "<option value='Female' selected>Female</option>";
					optionalHTML += "<option value='Other'>Other</option>";
				}
				else if(lPlayerProfile.gender == "Other")
				{
					optionalHTML += "<option value='Male'>Male</option>";
					optionalHTML += "<option value='Female'>Female</option>";
					optionalHTML += "<option value='Other' selected>Other</option>";
				}
				optionHTML += "<option name='' id='filterSelection' selected disabled>Select Organizer</option>";
				return optionalHTML;
			}
			else
			{
				var optionalHTML ="";
				optionalHTML += "<option value='Male'>Male</option>";
				optionalHTML += "<option value='Female'>Female</option>";
				optionalHTML += "<option value='Other'>Other</option>";
				$("#playerGender").html(optionalHTML);
				return optionalHTML;

			}
		}
	},
	lPlayerProfile: function() {
		if(Session.get("playerDBName")){
			var lPlayerProfile = nameToCollection(Session.get("playerDBName")).findOne({
				"userId": Meteor.userId()
			})

			if (lPlayerProfile) 
			{

				if(lPlayerProfile.dateOfBirth == "" || lPlayerProfile.dateOfBirth == undefined)
				{

				}
				else
				{
					$("#clubName").val(lPlayerProfile.clubName);
					$("#emailAddressUserProf").val(lPlayerProfile.emailAddress);
				}


				return lPlayerProfile;
			}
		}
	},
})

Template.playerProfile.events({
    'click #modifyPlayerDetails': function(event) {

    	if(event.target.name == "readonly")
    		return false;
 		$("#playerProfileAddressPopUp").empty();
      	Blaze.render(Template.profileAddress, $("#playerProfileAddressPopUp")[0]);
      	$("#profileAddress").modal({backdrop: 'static',keyboard: false});

    },

})

Template.registerHelper('checkPlayerAssocheckedDom', function(data) {
		if(Session.get("playerDBName")){
			var playerAssociationId;
			var playerAssociationInfo = nameToCollection(Session.get("playerDBName")).findOne({userId:Meteor.user().userId});
			if(playerAssociationInfo)
			{
				if(playerAssociationInfo.associationId != undefined || playerAssociationInfo.associationId != null || playerAssociationInfo.associationId != "")
				{
					playerAssociationId = playerAssociationInfo.associationId;
					var associationInfo =associationDetails.findOne({"userId": playerAssociationId});
					if(associationInfo)
					{
						if(data==associationInfo.interestedDomainName){
							return "disabled"
						}
						else 
						{
							return ""
						}	
					}

				}

			}
			else 
			{
				return ""
			}	
		}
		
	});


Template.registerHelper("affiliatedTo",function(userId)
{	
	if(Session.get("playerDBName")){
	var playerInfo = nameToCollection(Session.get("playerDBName")).findOne({"userId": Meteor.userId()});
	if(playerInfo && playerInfo.affiliatedTo)
	{
		if(playerInfo.affiliatedTo == "other")
			return;
		else if(playerInfo.affiliatedTo == "stateAssociation")
		{
			if(playerInfo.associationId != null || playerInfo.associationId != undefined || playerInfo.associationId != "")
			{
				var permisssionsInfo = associationPermissions.findOne({"associationId":playerInfo.associationId});
				if(permisssionsInfo && permisssionsInfo.playerEditSet)
				{
					if(permisssionsInfo.playerEditSet == "yes")
						return "";
					else 
						return "readonly";
				}

			}
		}
		else if(playerInfo.affiliatedTo == "districtAssociation")
		{
			if(playerInfo.parentAssociationId != null || playerInfo.parentAssociationId != undefined || playerInfo.parentAssociationId != "")
			{
				var permisssionsInfo = associationPermissions.findOne({"associationId":playerInfo.parentAssociationId});
				if(permisssionsInfo && permisssionsInfo.playerEditSet)
				{
					if(permisssionsInfo.playerEditSet == "yes")
						return "";
					else 
						return "readonly";
				}

			}

		}
		else if(playerInfo.affiliatedTo == "academy")
		{
			if(playerInfo.clubNameId != null || playerInfo.clubNameId != undefined || playerInfo.clubNameId != "")
			{
				var academyInfo = academyDetails.findOne({"userId":playerInfo.clubNameId});
				if(academyInfo && academyInfo.affiliatedTo)
				{
					if(academyInfo.affiliatedTo == "stateAssociation")
					{

						if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.associationId != "")
						{
							var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.associationId});
							if(permisssionsInfo && permisssionsInfo.playerEditSet)
							{
								if(permisssionsInfo.playerEditSet == "yes")
									return "";
								else 
									return "readonly";
							}

						}
					}
					else if(academyInfo.affiliatedTo == "districtAssociation")
					{

						if(academyInfo.parentAssociationId != null || academyInfo.parentAssociationId != undefined || academyInfo.parentAssociationId != "")
						{
							var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.parentAssociationId});
							if(permisssionsInfo && permisssionsInfo.playerEditSet)
							{
								if(permisssionsInfo.playerEditSet == "yes")
									return "";
								else 
									return "readonly";
							}

						}
					}
				}
			}
		}
	}
	}
});

Template.registerHelper('checkPlayerDomainName', function(data) {
	try
	{
		if(Session.get("playerDBName")){
		var j = [];
		j.push(data);
		var k = nameToCollection(Session.get("playerDBName")).find({
			"userId": Meteor.userId(),
			"interestedDomainName": {
				$in: j
			}
		}).fetch();

		if (k.length != 0) {
			return true;
		}
		}
	}catch(e){}
});
Template.registerHelper('checkPlayerProjectName', function(data) {
	try{
		if(Session.get("playerDBName")){
		var j = [];
		j.push(data);
		var k = nameToCollection(Session.get("playerDBName")).find({
			"userId": Meteor.userId(),
			"interestedProjectName": {
				$in: j
			}
		}).fetch();
		if (k.length != 0) {
			return true;
		}
	}
	}catch(e){}
});

Template.registerHelper('checkalldomainsPlayer',function(data){
	try
	{

		var j = domains.find({}).fetch();
		if(j!=undefined)
		{
			if(data.interestedDomainName.length===j.length)
				return true
	
		}
	}catch(e){}
});

/************************* player profile menus ***********************/
Template.playerProfileMenus.onCreated(function(){
	
	this.subscribe("loggedPlayerInfo",Meteor.userId());
	this.subscribe("associationPermissions");
	this.subscribe("academyDetails");
	this.subscribe("associationDetails");

})

Template.playerProfileMenus.onRendered(function(){
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
})

Template.playerProfileMenus.helpers({

	playerAffiliatedTo:function()
	{	
		if(Session.get("playerDBName")){
		var playerInfo = nameToCollection(Session.get("playerDBName")).findOne({"userId": Meteor.userId()});
		if(playerInfo && playerInfo.affiliatedTo)
		{
			if(playerInfo.affiliatedTo == "other")
				return "Affiliated To : other";
			else if(playerInfo.affiliatedTo == "stateAssociation" || playerInfo.affiliatedTo == "districtAssociation")
			{
				if(playerInfo.associationId != null || playerInfo.associationId != undefined || playerInfo.associationId != "")
				{
					var associationInfo  = associationDetails.findOne({"userId":playerInfo.associationId});
					if(associationInfo)
					{
						if(associationInfo.associationName)
							return "Affiliated To : "+associationInfo.associationName;
					}
				}
			}
			else if(playerInfo.affiliatedTo == "academy")
			{
				if(playerInfo.clubNameId != null || playerInfo.clubNameId != undefined || playerInfo.clubNameId != "")
				{
					var academyInfo = academyDetails.findOne({"userId":playerInfo.clubNameId});
					if(academyInfo && academyInfo.clubName)
					{
						return "Affiliated To : "+academyInfo.clubName;
					}
				}
			}

		}
		}
	},
	rolePlayerChangePassword:function()
	{
		try{
			if(Session.get("playerDBName")){
		var playerInfo = nameToCollection(Session.get("playerDBName")).findOne({"userId": Meteor.userId()});
		if(playerInfo && playerInfo.affiliatedTo)
		{
			if(playerInfo.affiliatedTo == "other")
				return true;
			else if(playerInfo.affiliatedTo == "stateAssociation")
			{
				if(playerInfo.associationId != null || playerInfo.associationId != undefined || playerInfo.associationId != "")
				{
					var permisssionsInfo = associationPermissions.findOne({"associationId":playerInfo.associationId});
					if(permisssionsInfo && permisssionsInfo.playerChangePass)
					{
						if(permisssionsInfo.playerChangePass == "yes")
							return true;
						else 
							return false;
					}

				}
			}
			else if(playerInfo.affiliatedTo == "districtAssociation")
			{
				if(playerInfo.parentAssociationId != null || playerInfo.parentAssociationId != undefined || playerInfo.parentAssociationId != "")
				{
					var permisssionsInfo = associationPermissions.findOne({"associationId":playerInfo.parentAssociationId});
					if(permisssionsInfo && permisssionsInfo.playerChangePass)
					{
						if(permisssionsInfo.playerChangePass == "yes")
							return true;
						else 
							return false;
					}

				}

			}
			else if(playerInfo.affiliatedTo == "academy")
			{
				if(playerInfo.clubNameId != null || playerInfo.clubNameId != undefined || playerInfo.clubNameId != "")
				{
					var academyInfo = academyDetails.findOne({"userId":playerInfo.clubNameId});
					if(academyInfo && academyInfo.affiliatedTo)
					{
						if(academyInfo.affiliatedTo == "stateAssociation")
						{

							if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.associationId != "")
							{
								var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.associationId});
								if(permisssionsInfo && permisssionsInfo.playerChangePass)
								{
									if(permisssionsInfo.playerChangePass == "yes")
										return true;
									else 
										return false;
								}

							}
						}
						else if(academyInfo.affiliatedTo == "districtAssociation")
						{

							if(academyInfo.parentAssociationId != null || academyInfo.parentAssociationId != undefined || academyInfo.parentAssociationId != "")
							{

								var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.parentAssociationId});
								if(permisssionsInfo && permisssionsInfo.playerChangePass)
								{
									if(permisssionsInfo.playerChangePass == "yes")
										return true;
									else 
										return false;
								}

							}
						}
					}
				}
			}
		}
		}}catch(e){}
	},
})

