Template.districtAssociationProfile.onCreated(function(){
	this.subscribe("tournamentEvents");
	this.subscribe("domains");
	this.subscribe("getAssociationDetails",Meteor.user().userId);
	this.subscribe("associationDetails");
	this.subscribe("associationPermissions");
})

Template.districtAssociationProfile.onRendered(function(){

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
Template.districtAssociationProfile.helpers({

	checkAffiliatedTo_dA:function()
	{
		try{
			var districtAssInfo = associationDetails.findOne({
				"userId": Meteor.userId()});

			if (districtAssInfo) {
				if(districtAssInfo.affiliatedTo == "other")
				{
					return true;

				}
			}
		}catch(e){}
	},
	lProjectName_dA: function() {
		var lProjectNames = tournamentEvents.find().fetch();
		 if(lProjectNames.length!==0)
   		return lProjectNames
	},
	lDomainName_dA: function() {
		var lProjectNames = domains.find().fetch();
		 if(lProjectNames.length!==0)
   		return lProjectNames;

	},
	lAssociation_dA: function() {
		var associationDetails = associationDetails.findOne({
			"userId": Meteor.userId()
		});
		if (associationDetails)
			return associationDetails;
	},
	lDistrictAssociationProfile: function() {
		var lStateAssociationProfile = associationDetails.findOne({
			"userId": Meteor.userId()
		})

		if (lStateAssociationProfile) 
		{
			return lStateAssociationProfile;
		}
	},
})
Template.districtAssociationProfile.events({
    'click #modifyAssociationDetails': function(event) {
		if(event.target.name == "readonly")
    		return false; 
 		$("#associationProfileAddressPopUp").empty();
      	Blaze.render(Template.profileAddress, $("#associationProfileAddressPopUp")[0]);
      	$("#profileAddress").modal({backdrop: 'static'});

    }
})

Template.registerHelper('checkAssociationDomainName', function(data) {
	try
	{
		var j = [];
		j.push(data);
		var k = associationDetails.find({
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
Template.registerHelper('checkAssociationProjectName', function(data) {
	try{

		var j = [];
		j.push(data);
		var k = associationDetails.find({
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

Template.registerHelper('checkalldomainsAssociation',function(data){
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

Template.registerHelper('getAssociationName',function(data){
	try
	{
		var parentAssInfo  = associationDetails.findOne({
			"userId": data});

		if(parentAssInfo)
			return parentAssInfo.associationName;
		
	}catch(e){}
});

Template.registerHelper("districtAffiliatedTo",function(userId)
{
	var districtAssInfo = associationDetails.findOne({"userId": Meteor.userId()});
	if(districtAssInfo && districtAssInfo.affiliatedTo)
	{
		if(districtAssInfo.affiliatedTo == "other")
			return;
		else if(districtAssInfo.affiliatedTo == "stateAssociation")
		{
			if(districtAssInfo.parentAssociationId != null || districtAssInfo.parentAssociationId != undefined || districtAssInfo.parentAssociationId != "")
			{
				var permisssionsInfo = associationPermissions.findOne({"associationId":districtAssInfo.parentAssociationId});
				if(permisssionsInfo && permisssionsInfo.districtAssocEditSet)
				{
					if(permisssionsInfo.districtAssocEditSet == "yes")
						return "";
					else 
						return "readonly";
				}

			}

		}
		
	}
	

});

/************************* district profile menus ***********************/
Template.districtAssociationProfileMenus.onCreated(function(){
	
	this.subscribe("getAssociationDetails",Meteor.user().userId);
	this.subscribe("associationDetails");
	this.subscribe("associationPermissions");
})

Template.districtAssociationProfileMenus.helpers({

	dAAffiliatedTo:function()
	{
		try
		{
			var districtAssInfo = associationDetails.findOne({"userId": Meteor.userId()});
			if(districtAssInfo != undefined)
			{
				if(districtAssInfo.affiliatedTo)
				{
					if(districtAssInfo.affiliatedTo == "other")
							return "AffiliatedTo : other ";
					else
					{
						if(districtAssInfo.affiliatedTo == "stateAssociation")
						{
							if(districtAssInfo.parentAssociationId != null || districtAssInfo.parentAssociationId != undefined || districtAssInfo.parentAssociationId != "")
							{
								var associationInfo  = associationDetails.findOne({"userId":districtAssInfo.parentAssociationId});
								if(associationInfo)
									if(associationInfo.associationName)
										return "AffiliatedTo : "+associationInfo.associationName+" (StateAssociation)";
							}
						}
					}
				}
			}
		}catch(e){}
	},

	roleDistrictChangePassword:function()
	{
		try
		{
			var districtAssInfo = associationDetails.findOne({"userId": Meteor.userId()});
			if(districtAssInfo != undefined)
			{
				if(districtAssInfo.affiliatedTo)
				{
					if(districtAssInfo.affiliatedTo == "other")
						return true;
					else if(districtAssInfo.affiliatedTo == "stateAssociation")
					{
						if(districtAssInfo.parentAssociationId != null || districtAssInfo.parentAssociationId != undefined || districtAssInfo.parentAssociationId != "")
						{
							var permisssionsInfo = associationPermissions.findOne({"associationId":districtAssInfo.parentAssociationId});
							if(permisssionsInfo && permisssionsInfo.districtAssocChangePass)
							{
								if(permisssionsInfo.districtAssocChangePass == "yes")
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
	roleDistrictMenuAccess:function()
	{
		try
		{
			var districtAssInfo = associationDetails.findOne({"userId": Meteor.userId()});
			if(districtAssInfo != undefined)
			{
				if(districtAssInfo.affiliatedTo)
				{
					if(districtAssInfo.affiliatedTo == "other")
						return false;
					else if(districtAssInfo.affiliatedTo == "stateAssociation")
					{
						if(districtAssInfo.parentAssociationId != null || districtAssInfo.parentAssociationId != undefined || districtAssInfo.parentAssociationId != "")						
							return true;
						
						else
							return false;
					}
				}
			}
		}catch(e){}
	}
})
