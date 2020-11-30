

  // Subscribe
  Template.modReg3.onCreated(function() {
	  	//this.subscribe("projects");
	  	//tournamentEvents
	  	this.subscribe("tournamentEvents");
  });
  
 Template.modReg3.onRendered(function() {
	 
	 var checkboxes = $("input[name='checkProjectName']"),
	    submitButt = $("#next-modReg3");
	 
	 
 
  $('#selectTagop').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: 'transparent', // The scrollbar rail color
		cursorwidth: '3px', // Scroll cursor width
		cursorcolor: 'maroon',
		autohidemode: true, // Scroll cursor color
	});
 });
 
 Template.registerHelper('checked', function(id) {
	 var projects=Session.get('projectName');
	 return projects.indexOf(id) > -1;
 });
 
 Template.modReg3.onDestroyed(function(){
	 Session.set('searchSports',null);
     Session.set('searchSports', undefined);
     Session.set('projectName',null);
     Session.set('projectName', undefined);
 });
 
 
  
  
  
  Template.modReg3.helpers({
	  lProjectName: function() {
		var lProjectNames = tournamentEvents.find().fetch();
		if(lProjectNames)
			return lProjectNames;
	   			
	}
	  
  });
  
  Template.modReg3.events({
	  'keyup #mainTagModReg3': function(event) {
			var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
			//$("checkboxdivuserprofile").hide();
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
	  
	"change #checkAll":function(e){
		// Disable the next button
		
		$("#next-modReg3").attr("disabled", !$("input[name=checkAll]").is(":checked"));
		
		if($("input[id=checkAll]:checkbox").prop('checked'))
			{
			  $("input[name=checkProjectName]:checkbox").prop('checked', true);
			  
			 
			}  
		else
			{
			  $("input[name=checkProjectName]:checkbox").prop('checked', false);
			 
			}
		
	},
	"click input[name='checkProjectName']":function(e){
		// Clear the search text-box
		document.getElementById('mainTagModReg3').value ="";
 	    $( "#mainTagModReg3" ).keyup();
		
		$("#next-modReg3").attr("disabled", !$("input[name='checkProjectName']").is(":checked"));
		
		// SELECT ALL CAN BE TRIGGERED EVEN 
		// BY SELECTING OR DESELECTING THE 
		// THE PROJECT
		if($("input[name=checkProjectName]:checked").length==$("input[name=checkProjectName]:checkbox").length)
		{
		  $("input[name=checkAll]:checkbox").prop('checked', true);
		  
		 }
	  //}
	  else{
		    $("input[name=checkAll]:checkbox").prop('checked', false);
		  } 
		
		
	},
	//$("input[name='checkProjectName']").is(":checked")
	"click #next-modReg3":function(e){
		if(Session.get("role")=="Association"||Session.get("role")=="Academy"){
			var projects = $("input[name='checkProjectName']:radio:checked").map(function() {
		    	return this.value;
			}).get();
			Session.set('projectName', projects);
		}
		else{
			var projects = $("input[name='checkProjectName']:checkbox:checked").map(function() {
		    	return this.value;
			}).get();
			Session.set('projectName', projects);
		}
		
	},
	"click #nextwithAssoc-modReg3":function(e){
		var projects = $("input[name='checkProjectName']:radio:checked").map(function() {
	    	return this.value;
		}).get();
		Session.set('projectName', projects);
	},	

	"change input[name='checkProjectName']":function(){
		if(Session.get("role")=="Association"||Session.get("role")=="Academy"){
			var projects = $("input[name='checkProjectName']:radio:checked").map(function() {
	    		return this.value;
			}).get();
			Session.set('projectName', projects);
		}
	}
  });