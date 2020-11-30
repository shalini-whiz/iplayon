/************ Template profile address *************/
Template.profileExpertise.onCreated(function(){
	this.subscribe("languagesPub");
	this.subscribe("expertisePub");

});


Template.profileExpertise.onRendered(function(){

	$('#selectTagopExp').niceScroll({
		cursorborderradius: '0px', 
		background: 'transparent', 
		cursorwidth: '3px', 
		cursorcolor: 'maroon',
		autohidemode: true, 
	});
	$('#selectTagopLang').niceScroll({
		cursorborderradius: '0px', 
		background: 'transparent', 
		cursorwidth: '3px', 
		cursorcolor: 'maroon',
		autohidemode: true, 
	});





});






Template.profileExpertise.helpers({

	expertiseList: function() {
		var expertiseList = expertise.find().fetch();
		if(expertiseList.length!==0)
   			return expertiseList;

	},
	languageList: function() {
		var languageList = languages.find().fetch();
		if(languageList.length!==0)
   			return languageList;

	}

})


Template.profileExpertise.events({
	'keyup #mainTagExp': function(event) {
    	var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
		var $rows = $("#selectTagopExp").find("div");
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
  	'keyup #mainTagLang': function(event) {
    	var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
		var $rows = $("#selectTagopLang").find("div");
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

  	'click #updateExpertise':function(e)
  	{
		var checkedExpertise = $("input[name=checkExpName]:checked").map(
			function() {
				return this.value;
			}).get();
		var checkedLanguage = $("input[name=checkLangName]:checked").map(
			function() {
				return this.value;
			}).get();


		var lData = {
			"expertise": checkedExpertise,
			"languages":checkedLanguage,
			"userId": Meteor.user().userId,
		};
	
		Meteor.call("updateOtherUserActivities", lData, function(error, response) {
			if (response) {
				$("#otherUserExpertisePopUp").empty();
	 			$( '.modal-backdrop' ).remove();

			} else if (error) {
			}
		});
  	}

})


Template.registerHelper('checkExpertiseExist', function(data) {
	try
	{
		var j = [];
		j.push(data);
		var k = otherUsers.find({
			"userId": Meteor.userId(),
			"expertise": {
				$in: j
			}
		}).fetch();

		if (k.length != 0) {
			return true;
		}
	}catch(e){}
});

Template.registerHelper('checkLanguageExist', function(data) {
	try
	{
		var j = [];
		j.push(data);
		var k = otherUsers.find({
			"userId": Meteor.userId(),
			"languages": {
				$in: j
			}
		}).fetch();

		if (k.length != 0) {
			return true;
		}
	}catch(e){}
});