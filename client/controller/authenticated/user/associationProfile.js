Template.associationProfileSettings.onCreated(function(){
	this.subscribe("tournamentEvents");
	this.subscribe("domains");
	this.subscribe("getAssociationDetails",Meteor.user().userId);
})

Template.associationProfileSettings.onRendered(function(){

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
Template.associationProfileSettings.helpers({

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
	lStateAssociationProfile: function() {
		var lStateAssociationProfile = associationDetails.findOne({
			"userId": Meteor.userId()
		})

		if (lStateAssociationProfile) 
		{
			return lStateAssociationProfile;
		}
	},
})

Template.associationProfileSettings.events({
    'click #modifyAssociationDetails': function(event) {
    	if(event.target.name == "readonly")
    		return false; 	
    	else
    	{
 			$("#associationProfileAddressPopUp").empty();
      		Blaze.render(Template.profileAddress, $("#associationProfileAddressPopUp")[0]);
      		$("#profileAddress").modal({backdrop: 'static'});
      	}

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