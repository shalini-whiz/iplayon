
  Template.modReg4.onCreated(function() {
	  	this.subscribe("domains");
  });
  
 Template.modReg4.onRendered(function() {
	 
	 Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
	 Session.set('termsLength', $("input[id=terms]:checked").length);
 
  $('#selectTag2').slimScroll({
	  height: '12.4em',
		color: 'maroon',
		size: '3px',
		width: '100%'
	});
 });
 
 
 
 Template.registerHelper('checkInputRegister', function() {
	 


	 if((Session.get('domainLength'))&&(Session.get('termsLength')))
	 {
		 return true;
	 }	 
	 else
	 {
		 return false;
	 }	 
	 
 });
  Template.registerHelper('checkInputRegisterAssoc', function() {
	 


	 if((Session.get('checkDOMASSOc'))&&(Session.get('termsLength')))
	 {
		 return true;
	 }	 
	 else
	 {
		 return false;
	 }	 
	 
 });
  
  
  
  //searchPlace
  Template.modReg4.helpers({
	  lDomainName: function() {
		var lProjectNames = domains.find().fetch();
		if(lProjectNames)return lProjectNames;
		else return false;
		
	},
	
	atleastOneSelected: function(){
		// If the length is 0 then disable otherwise enable the button
		if($("input[name=checkDomainName]:checked").length==0)
	    {
			return false;
		}	
        else
        {
			return true;
		}			
	}
	  
  });
  
  Template.modReg4.onDestroyed(function(){
		 Session.set('searchPlace',null);
	     Session.set('searchPlace', undefined);
	 });
  
  Template.modReg4.events({
	  'keyup #mainTag1ModReg4': function(event) {
		  var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
			//$("checkboxdivuserprofile").hide();
			var $rows = $("#selectTag2").find("div");
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
	"change #checkAllPlaces":function(e){
        // Disable the next button
		
		
		
		//$("#next-modReg4").attr("disabled", !(($("input[name=checkDomainName]:checked").length)&&($("input[id=terms]:checked").length)&&($("input[id=checkAllPlaces]:checked").length)));
		
		e.preventDefault();
		if(Session.get("role")!=="Association"||Session.get("role")!=="Academy"){
			if($("input[id=checkAllPlaces]:checkbox").prop('checked'))
				{
				$("input[name=checkDomainName]:checkbox").prop('checked', true);
				Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
				Session.set('termsLength', $("input[id=terms]:checked").length);
				}
			else
				{
				 $("input[name=checkDomainName]:checkbox").prop('checked', false);
				 Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
					Session.set('termsLength', $("input[id=terms]:checked").length);
				}		
		}
	},
	// Terms and conditions
	"change #terms":function(e){
		if(Session.get("role")!=="Association"||Session.get("role")!=="Academy"){
			Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
		}
		 Session.set('termsLength', $("input[id=terms]:checked").length);
		
		//$("#next-modReg4").attr("disabled", !(($("input[name=checkDomainName]:checked").length)&&($("input[id=terms]:checked").length)));
	},
	
	"click input[name='checkDomainName']":function(e){
		if(Session.get("role")!=="Association"||Session.get("role")!=="Academy"){
		Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
		 Session.set('termsLength', $("input[id=terms]:checked").length);
		// SELECT ALL CAN BE TRIGGERED EVEN 
		// BY SELECTING OR DESELECTING THE 
		// THE PROJECT
		if($("input[name=checkDomainName]:checked").length==$("input[name=checkDomainName]:checkbox").length)
		{
		  $("input[name=checkAllPlaces]:checkbox").prop('checked', true);
		 }
	  //}
	  else{
		    $("input[name=checkAllPlaces]:checkbox").prop('checked', false);
		  } 
		}
		//$("#next-modReg4").attr("disabled", !(($("input[name=checkDomainName]:checked").length)&&($("input[id=terms]:checked").length)));
		
	},

	"change input[name=checkDomainName]":function(e){
		if(Session.get("role")=="Association"||Session.get("role")=="Academy"){
	        var domains = $("input[name='checkDomainName']:radio:checked").map(function() {
	    		return this.value;
			}).get();
			Session.set('checkDOMASSOc', domains);
			Session.set('termsLength', $("input[id=terms]:checked").length);		
		}    
	}

  });