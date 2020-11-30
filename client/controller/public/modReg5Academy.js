Template.modReg5Academy.onCreated(function(){
	
});

Template.modReg5Academy.onRendered(function(){
	$("#modReg5Academy").on('show.bs.modal', function() {
		$('.modal-content').scrollTop(0);
		$("#scroll2").scrollTop(0);;
	});
	$('#selectTagopAssociation').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: 'transparent', // The scrollbar rail color
		cursorwidth: '3px', // Scroll cursor width
		cursorcolor: 'maroon',
		autohidemode: true, // Scroll cursor color
	});
});

Template.modReg5Academy.helpers({
	"lAssociations":function(){
		var lAssociations = associations.find({}).fetch();
		if(lAssociations.length!==0)
		return lAssociations;
	}
});
Template.modReg5Association.onRendered(function(){
	$("#modReg5Association").on('show.bs.modal', function() {
		$('.modal-content').scrollTop(0);
		$("#scroll5").scrollTop(0);;
	});
	 $('#selectTagopStateAssociation').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: 'transparent', // The scrollbar rail color
		cursorwidth: '3px', // Scroll cursor width
		cursorcolor: 'maroon',
		autohidemode: true, // Scroll cursor color
	});
});
Template.modReg5Academy.events({
	'keyup #mainTagAssociationName': function(event) {
			var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
			//$("checkboxdivuserprofile").hide();
			var $rows = $("#selectTagopAssociation").find("div");
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

});

Template.modReg5ParentAssociation.onCreated(function(){
	this.subscribe("associations")
});

Template.modReg5ParentAssociation.onRendered(function(){
	$("#modReg5ParentAssociation").on('show.bs.modal', function() {
		$('.modal-content').scrollTop(0);
		$("#scroll3").scrollTop(0);;
	});
});

Template.modReg5ParentAssociation.helpers({
	"lAssociationsWithState":function(){
		try{
			var lAssociations = associations.find({associationType:"State/Province/County"}).fetch();
			if(lAssociations.length!==0)
			return lAssociations;
		}catch(e){
		}
	}
});

Template.modReg5ParentAssociation.events({
	 'keyup #mainTagAssociationStateName': function(event) {
			var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
			//$("checkboxdivuserprofile").hide();
			var $rows = $("#selectTagopStateAssociation").find("div");
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

});

Template.modReg2Association.onCreated(function(){
	this.subscribe("timeZone");
});

Template.modReg2Association.onRendered(function(){

});

function updateNumberOfDays_Inc() {
    $('#days_I').html('');
    month = $('#months_I').val();
    year = $('#years_I').val();
    days = daysInMonth_Inc(month, year);
    Session.set("DDOfINC", null);
    $('#days_I').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days_I').append($('<option />').val(i).html(i));
    }
}

function daysInMonth_Inc(month, year) {
    return new Date(year, month, 0).getDate();
}

Template.modReg2Association.helpers({
	"stateList":function(){
		var stateList=timeZone.findOne({"countryName":"India"});
		if(stateList!=undefined){
			return stateList.state;
		}
	},
	"setDays":function(){
		var s=[];
		for (i = 1; i<32; i++) {
			s.push(i);
		}
		return s;
	},
	setMonths:function(){
		var monthNames = ["January", "February", "March", "April", "May", "June",
		       "July", "August", "September", "October", "November", "December"
		];
		var s=[];
		for (i = 1; i < 13; i++) {
			s.push(i);
		}
		return s;
	},
	setYears:function(){
		var s=[];
		for (i = new Date().getFullYear(); i > 1900; i--) {
			s.push(i);
		}
		return s;
	}
});

Template.modReg2Association.events({
	"change #state":function(){
		Session.set("stateOfAssoc",$("#state").val());
	},
	'change  #months_I': function(e) {
        Session.set("MMOfINC", $("#months_I").val())
        updateNumberOfDays_Inc();
    },
    'change #years_I': function(e) {
        Session.set("YYOfINC", $("#years_I").val())
        updateNumberOfDays_Inc();
    },
    'change #days_I': function(e) {
        Session.set("DDOfINC", $("#days_I").val())
    },

    'change #address_I': function() {
        Session.set('address', $("#address_I").val());
    },

    'keyup #address_I': function() {
        Session.set('address', $("#address_I").val());
    },

    //city

    'change #city_I': function() {
        Session.set('city', $("#city_I").val());
    },

    'keyup #city_I': function() {
        Session.set('city', $("#city_I").val());
    },

    //pinCode
    'change #pinCode_I': function() {
        Session.set('pinCode', $("#pinCode_I").val());
    },

    'keyup #pinCode_I': function() {
        Session.set('pinCode', $("#pinCode_I").val());
    },

    "keypress #pinCode_I": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "change #termsDistrict":function(){
    	Session.set('termsLength', $("input[id=termsDistrict]:checked").length);
    },
    'keyup #assocAbbName':function(e){
    	e.preventDefault();
    	$("#setForOthersAssociation2").html("")
    	 Session.set("assocAbbNameSe",null)
        if($("#assocAbbName").val().trim().length!=0){
        	
        	Meteor.call("abbrevationDuplicates",$("#assocAbbName").val().trim(),function(e,res){
        		if(res){
        			$("#setForOthersAssociation2").html("Use different abbrevation name");
                	Session.set("assocAbbNameSe",null)
        		}
        		else{
        			Session.set("assocAbbNameSe",$("#assocAbbName").val());
        		}
        	})
            /*if(Meteor.users.findOne( { 'abbrevationAssociation': $("#assocAbbName").val().toUpperCase()})){
                $("#setForOthersAssociation2").html("Use different abbrevation name");
                Session.set("assocAbbNameSe",null)
            }
            else{
                Session.set("assocAbbNameSe",$("#assocAbbName").val());
            }*/
        }
    },
    'change #assocAbbName':function(e){
    	e.preventDefault();
    	$("#setForOthersAssociation2").html("");
    	Session.set("assocAbbNameSe",null)
        if($("#assocAbbName").val().trim().length!=0){
			Meteor.call("abbrevationDuplicates",$("#assocAbbName").val().trim(),function(e,res){
        		if(res){
        			$("#setForOthersAssociation2").html("Use different abbrevation name");
                	Session.set("assocAbbNameSe",null)
        		}
        		else{
        			Session.set("assocAbbNameSe",$("#assocAbbName").val());
        		}
        	})
        }
    },
});
