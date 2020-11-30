Template.academyProfileSettings.onCreated(function(){
	this.subscribe("tournamentEvents");
	this.subscribe("domains");
	this.subscribe("getAcademyDetails",Meteor.user().userId);
	this.subscribe("associationPermissions");
})

Template.academyProfileSettings.onRendered(function(){

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
Template.academyProfileSettings.helpers({

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
	lAssociation: function() {
		var associationDetails = associationDetails.findOne({
			"userId": Meteor.userId()
		});
		if (associationDetails)
			return associationDetails;
	},
	lAcademyProfile: function() {
		var lStateAssociationProfile = academyDetails.findOne({
			"userId": Meteor.userId()
		})

		if (lStateAssociationProfile) 
		{
			return lStateAssociationProfile;
		}
	},
	checkAffiliatedTo_aca:function()
	{
		try{
			var districtAssInfo = academyDetails.findOne({
				"userId": Meteor.userId()});
			if (districtAssInfo) 
			{
				if(districtAssInfo.affiliatedTo)
				{
					if(districtAssInfo.affiliatedTo == "other")
					{
						return true;

					}
				}			
			}
		}catch(e){}
	},
})

Template.academyProfileSettings.events({
    'click #modifyAcademyDetails': function(event) {

		if(event.target.name == "readonly")
    		return false; 		
    	$("#academyProfileAddressPopUp").empty();
      	Blaze.render(Template.profileAddress, $("#academyProfileAddressPopUp")[0]);
      	$("#profileAddress").modal({backdrop: 'static'});

    }
})
Template.registerHelper('checkAcademyDomainName', function(data) {
	try
	{
		var j = [];
		j.push(data);
		var k = academyDetails.find({
			"userId": Meteor.userId(),
			"interestedDomainName": {
				$in: j
			}
		}).fetch();

		if (k.length != 0) {
			return true;
		}
	}catch(e){}
});

Template.registerHelper('checkAcademyProjectName', function(data) {
	try{

		var j = [];
		j.push(data);
		var k = academyDetails.find({
			"userId": Meteor.userId(),
			"interestedProjectName": {
				$in: j
			}
		}).fetch();
		if (k.length != 0) {
			return true;
		}
	}catch(e){}
});

Template.registerHelper("academyAffiliatedTo",function(userId)
{
	var academyInfo = academyDetails.findOne({"userId": Meteor.userId()});
	if(academyInfo && academyInfo.affiliatedTo)
	{
		if(academyInfo.affiliatedTo == "other")
			return;
		
		else if(academyInfo.affiliatedTo == "stateAssociation")
		{
			if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.associationId != "")
			{
				var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.associationId});
				if(permisssionsInfo && permisssionsInfo.academyEditSet)
				{
					if(permisssionsInfo.academyEditSet == "yes")
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
				if(permisssionsInfo && permisssionsInfo.academyEditSet)
				{

					if(permisssionsInfo.academyEditSet == "yes")
						return "";
					else 
						return "readonly";
				}
			}
		}	
	}
	
});

/************************* academy profile menus ***********************/
Template.academyProfileMenus.onCreated(function(){
	
	this.subscribe("getAcademyDetails",Meteor.user().userId);
	this.subscribe("associationDetails");
	this.subscribe("associationPermissions");
})

Template.academyProfileMenus.helpers({

	acaAffiliatedTo:function()
	{
		var academyInfo = academyDetails.findOne({"userId": Meteor.userId()});
		if(academyInfo)
		{
			if(academyInfo.affiliatedTo)
			{
				if(academyInfo.affiliatedTo == "other")
					return "Affiliated To : other";
				else if(academyInfo.affiliatedTo == "stateAssociation")
				{	
					if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.associationId != "")
					{
						var associationInfo = associationDetails.findOne({"userId":academyInfo.associationId});
						if(associationInfo)
						{
							if(associationInfo.associationName)
								return "Affiliated To : "+associationInfo.associationName;
						}
					}
				}
				else if(academyInfo.affiliatedTo == "districtAssociation")
				{	
					if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.associationId != "")
					{
						var associationInfo = associationDetails.findOne({"userId":academyInfo.associationId});
						if(associationInfo)
						{
							if(associationInfo.associationName)
								return "Affiliated To : "+associationInfo.associationName;
						}
					}
				}			
			}
		}

	},
	checkAffiliatedTo_aca:function()
	{
		try{
			var districtAssInfo = academyDetails.findOne({
				"userId": Meteor.userId()});
			if (districtAssInfo) 
			{
				if(districtAssInfo.affiliatedTo)
				{
					if(districtAssInfo.affiliatedTo == "other")
					{
						return true;

					}
				}			
			}
		}catch(e){}
	},
	roleAcademyChangePassword:function()
	{
		try
		{
			var academyInfo = academyDetails.findOne({"userId": Meteor.userId()});
			if(academyInfo)
			{
				if(academyInfo.affiliatedTo)
				{
					if(academyInfo.affiliatedTo == "other")
						return true;
					else if(academyInfo.affiliatedTo == "stateAssociation")
					{
						if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.associationId != "")
						{
							var permisssionsInfo = associationPermissions.findOne({"associationId":academyInfo.associationId});
							if(permisssionsInfo && permisssionsInfo.academyChangePass)
							{
								if(permisssionsInfo.academyChangePass == "yes")
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
							if(permisssionsInfo && permisssionsInfo.academyChangePass)
							{
								if(permisssionsInfo.academyChangePass == "yes")
									return true;
								else 
									return false;
							}
						}
					}

				}
			}
		}catch(e){}
	},
	roleAcademyMenuAccess:function()
	{
		try
		{
			var academyInfo = academyDetails.findOne({"userId": Meteor.userId()});
			if(academyInfo)
			{
				if(academyInfo.affiliatedTo)
				{
					if(academyInfo.affiliatedTo == "other")
						return false;
					else if(academyInfo.affiliatedTo == "stateAssociation")
					{
						if(academyInfo.associationId != null || academyInfo.associationId != undefined || academyInfo.parentAssociationId != "")						
							return true;
						
						else
							return false;
					}
				}
			}
		}catch(e){}
	}
})
