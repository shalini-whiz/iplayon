Template.generalProfileSettings.onCreated(function(){

	this.subscribe("otherUsers");
	this.subscribe("domains");
	this.subscribe("tournamentEvents");

})

Template.generalProfileSettings.onRendered(function(){

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

Template.generalProfileSettings.helpers({
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
	lOtherUser: function() {
		var usersDetails = otherUsers.findOne({
			"userId": Meteor.userId()
		});
		if (usersDetails)
			return usersDetails;
	},
	lGeneralProfile: function() {
		var lGeneralProfile = otherUsers.findOne({
			"userId": Meteor.userId()
		})

		if (lGeneralProfile) 
		{
			return lGeneralProfile;
		}
	},
	checkOtherCoachRole:function()
	{
		try{
		if(Meteor.user().role == "Coach")
			return true;
		}catch(e){}
	},
})
Template.generalProfileSettings.events({
    'click #modifyOtherUserDetails': function(event) {

 		$("#otherUserProfileAddressPopUp").empty();
      	Blaze.render(Template.profileAddress, $("#otherUserProfileAddressPopUp")[0]);
      	$("#profileAddress").modal({backdrop: 'static'});
    },
    'click #modifyExpertise': function(event) {

 		$("#otherUserExpertisePopUp").empty();
      	Blaze.render(Template.profileExpertise, $("#otherUserExpertisePopUp")[0]);
      	$("#profileExpertise").modal({backdrop: 'static'});
    },

})
Template.registerHelper('checkOtherUserDomainName', function(data) {
	try
	{
		var j = [];
		j.push(data);
		var k = otherUsers.find({
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
Template.registerHelper('checkOtherUserProjectName', function(data) {
	try{

		var j = [];
		j.push(data);
		var k = otherUsers.find({
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

Template.registerHelper('checkalldomainsOtherUsers',function(data){
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


