/*******************************************************/

import { routeForsubscription } from '../../routes/hooks.js'

Template.playerRegistrationTabs.onCreated(function() {
    this.subscribe("timeZone");
    this.subscribe("userOtp");
    this.subscribe("onlyLoggedIn");
            this.subscribe("domains");

});

Template.playerRegistrationTabs.onRendered(function() {
    try{
    if (Session.get("DDofdateOfBirth") == null) 
    {
        var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
        $('#days').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
        for (i = new Date().getFullYear(); i > 1900; i--) {
            $('#years').append($('<option />').val(i).html(i));
        }

        for (i = 1; i < 13; i++) {
            $('#months').append($('<option />').val(i).html(i));
        }
        updateNumberOfDays();
    }}catch(e){}
});

Template.playerRegistrationTabs.helpers({

 

    "stateList_player":function(){
        try{
            var xx = timeZone.find({}).fetch();
        var stateList=timeZone.findOne({"countryName":"India"});
        if(stateList!=undefined&&stateList.state){
            return stateList.state;
        }
        }catch(e){
        }
    },
    
});

Template.playerRegistrationTabs.events({
    "click #confirmModalRedirectYes": function(e) {
        e.preventDefault();
        var id = "";
        if (Session.get("clickedIDToRed"))
            id = Session.get("clickedIDToRed")
        else
            id = "";
        Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
        $("#confirmModalRedirect").modal('hide');
        $("#alreadySubscribed_entryFromAca").modal('hide');
        var type = Session.get("hyperLINKValue")
        $( '.modal-backdrop' ).remove();
        //if the subscription type is hyperlink
        //route to hyper link
        if (type) {
            var s = type
                //if the web site doesn't contains https
            if (!s.match(/^https?:\/\//i)) {
                s = 'http://' + s;
            }
            window.open(s, '_blank');
        }
    },
    'change #userNamemodReg2': function() {
        $("#userNamemodReg2").css({"color": ""});
        Session.set('playerName', $("#userNamemodReg2").val());
    },

    'keyup #userNamemodReg2': function() {
        $("#userNamemodReg2").css({"color": ""});
        Session.set('playerName', $("#userNamemodReg2").val());
    },
    'change #gender': function() {
        $("#gender").css({"color": ""});
        Session.set('gender', $('#gender').val());
    },

    'change #city': function() {
        $("#city").css({"color": ""});
        Session.set('city', $("#city").val());
    },

    'keyup #city': function() {
        $("#city").css({"color": ""});
        Session.set('city', $("#city").val());
    },

    //pinCode
    'change #pinCode': function() {
        $("#pinCode").css({"color": ""});
        Session.set('pinCode', $("#pinCode").val());
    },

    'keyup #pinCode': function() {
        $("#pinCode").css({"color": ""});
        Session.set('pinCode', $("#pinCode").val());
    },

    "keyup #pinCode": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #mobileNumber": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    'keyup #mobileNumber': function(e) {
        $("#mobileNumber").css({"color": ""});
        Session.set('mobileNumber', e.target.value);
    },
    'change  #months': function(e) {
        $("#months").css({"color": ""});
        Session.set("MMofdateOfBirth", $("#months").val())
        updateNumberOfDays();
    },
    'change #years': function(e) {
        $("#years").css({"color": ""});
        Session.set("YYofdateOfBirth", $("#years").val())
        updateNumberOfDays();
    },
    'change #days': function(e) {
        $("#days").css({"color": ""});
        Session.set("DDofdateOfBirth", $("#days").val())
    },
   
    "change #state2":function(){
        $("#state2").css({"color": ""});
        Session.set("stateOfAssoc2",$("#state2").val());
    },
    'click #next-modReg2_Player':function(e)
    {
        if (Session.get("role") == "Player") 
        {

            Session.set("country","India");
            if ((Session.get('playerName') == null) || 
                (!Session.get('playerName').trim().length) || 
            (Session.get('DDofdateOfBirth') == null) || 
            (Session.get('MMofdateOfBirth') == null) || 
            (Session.get('YYofdateOfBirth') == null) || 
             (Session.get('gender') == null) || 
             (Session.get('playerName') == "") || 
             (Session.get('mobileNumber') == null) || 
             (Session.get('mobileNumber').length != 10) || 
             (Session.get('mobileNumber') == "" || 
                (Session.get("stateOfAssoc2")==null)) || 
                Session.get("pinCode") == null || Session.get("pinCode") == "" || (Session.get('pinCode').length != 6) ||
                Session.get("city") == null || Session.get("city") == ""
                 ) 
            {
                var s = parseInt(Session.get('DDofdateOfBirth'))
                var s1 = parseInt(Session.get('MMofdateOfBirth'))
                var s2 = parseInt(Session.get('YYofdateOfBirth'))
                var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
                Session.set('dateOfBirth', s3);

                if(Session.get("playerName") == null || Session.get('playerName') == "" || (!Session.get('playerName').trim().length))
                    $("#userNamemodReg2").css({"color": "red"});
                if(Session.get('DDofdateOfBirth') == null)
                    $("#days").css({"color": "red"});
                if(Session.get('MMofdateOfBirth') == null)
                    $("#months").css({"color": "red"});
                if(Session.get('YYofdateOfBirth') == null)
                    $("#years").css({"color": "red"});
                if(Session.get('gender') == null)
                    $("#gender").css({"color": "red"});
                if(Session.get('mobileNumber') == null || Session.get('mobileNumber') == "" || (Session.get('mobileNumber').length != 10))
                    $("#mobileNumber").css({"color": "red"});
                if(Session.get("city") == null || Session.get("city") == "")
                    $("#city").css({"color": "red"});
                if(Session.get("pinCode") == null || Session.get("pinCode") == "" || (Session.get('mobileNumber').length != 6) )
                    $("#pinCode").css({"color": "red"});
                if(Session.get("stateOfAssoc2")==null)
                    $("#state2").css({"color": "red"});

                $("#playerRegistrationTabs").find("#impMsg").text("* Please fill mandatory fields");
            }
            else
            {
            	$("#playerRegistrationTabs").find("#impMsg").text("");
                var s = parseInt(Session.get('DDofdateOfBirth'))
                var s1 = parseInt(Session.get('MMofdateOfBirth'))
                var s2 = parseInt(Session.get('YYofdateOfBirth')+1)
                var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
                Session.set('dateOfBirth', s3);
                $('#playerRegistrationTabs').modal('hide');
                if( $('#mod3').is(':empty') ) 
                {
                    Blaze.render(Template.playerSport, $("#mod3")[0]);
                    $('#playerSport').modal({backdrop: 'static'});;
                }
                else
                    $('#playerSport').modal({backdrop: 'static'});;             
            }
            
        }
    },
});



/************************ player sport related ***************************/

Template.playerSport.onCreated(function() {
	this.subscribe("tournamentEvents");
});
  
Template.playerSport.onRendered(function() {
	var checkboxes = $("input[name='checkProjectName']"),
	    submitButt = $("#next-modReg3");
	
	$('#selectTagop').niceScroll({
		cursorborderradius: '0px', 
		background: 'transparent', 
		cursorwidth: '3px', 
		cursorcolor: 'maroon',
		autohidemode: true, 
	});
 });
 
Template.registerHelper('checked', function(id) {
	 var projects=Session.get('projectName');
	 return projects.indexOf(id) > -1;
});
 
Template.playerSport.onDestroyed(function(){
	 Session.set('searchSports',null);
     Session.set('searchSports', undefined);
     Session.set('projectName',null);
     Session.set('projectName', undefined);
});
 
 
Template.playerSport.helpers({
	lProjectName: function() 
	{
		var lProjectNames = tournamentEvents.find().fetch();
		if(lProjectNames)
			return lProjectNames;
	}  
});
  
Template.playerSport.events({
	'keyup #mainTagModReg3': function(event) {
		var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
		var $rows = $("#selectTagop").find("div");
		$rows.each(function(){
			var oLabel = $(this);
			if (oLabel.length > 0) 
			{
	            if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) 
	                $(this).show();
	            else 
	                $(this).hide();       
	        }
		})
	},  
	 
	"click input[name='checkProjectName']":function(e){
		document.getElementById('mainTagModReg3').value ="";
 	    $( "#mainTagModReg3" ).keyup();
		$("#next-modReg3").attr("disabled", !$("input[name='checkProjectName']").is(":checked"));
		if($("input[name=checkProjectName]:checked").length==$("input[name=checkProjectName]:checkbox").length)
			$("input[name=checkAll]:checkbox").prop('checked', true);
	  	else
			$("input[name=checkAll]:checkbox").prop('checked', false);	
	},

	"change input[name='checkProjectName']":function(){
		var projects = $("input[name='checkProjectName']:radio:checked").map(function() {
	    	return this.value;
		}).get();
		Session.set('projectName', projects);
	},

	"click #previous-playerDetailsTab":function(e)
	{
        $('#playerSport').modal('hide');
        $('#playerRegistrationTabs').modal({backdrop: 'static'});;             

	},

	"click #next-playerDomainTab":function(e){
		var projects = $("input[name='checkProjectName']:radio:checked").map(function() {
		    return this.value;
		}).get();
		if(projects == ""){
			$("#playerSport").find("#impMsg").text("* Please select sport");
			$('#playerSport').modal({backdrop: 'static'});;             

		}
		else
		{
			$("#playerSport").find("#impMsg").text("");
			Session.set('projectName', projects);
        	$('#playerSport').modal('hide');
        	if( $('#mod4').is(':empty') ) 
        	{
        		Blaze.render(Template.playerDomain, $("#mod4")[0]);
				$('#playerDomain').modal({backdrop: 'static'});;
        	}
        	else
        		$('#playerDomain').modal({backdrop: 'static'});;             
        	
        	
		}
		
	},
  });

/**************** domain related *************************/

  Template.playerDomain.onCreated(function() {

	  	this.subscribe("domains");
  });
  
 Template.playerDomain.onRendered(function() {
	 
	 Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
	 Session.set('termsLength', $("input[id=terms]:checked").length);
 
  $('#selectTag2').slimScroll({
	  height: '12.4em',
		color: 'maroon',
		size: '3px',
		width: '100%'
	});
 });
 
 



  
  
  
//searchPlace
Template.playerDomain.helpers({
	lDomainName: function() 
	{
		var lProjectNames = domains.find().fetch();
		if(lProjectNames)return lProjectNames;
		else return false;
		
	}  
});
  
Template.playerDomain.onDestroyed(function(){
	Session.set('searchPlace',null);
	Session.set('searchPlace', undefined);
});
  
Template.playerDomain.events({
	'keyup #mainTag1ModReg4': function(event) 
	{
		var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
		var $rows = $("#selectTag2").find("div");
		$rows.each(function() {
			var oLabel = $(this);
			if (oLabel.length > 0) {
	            if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) 
	                $(this).show();
	            else 
	                $(this).hide();       
	        }
		})
	},  

	"change #checkAllPlaces":function(e)
	{
		e.preventDefault();

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
	},

	// Terms and conditions
	"change #terms":function(e){
		Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
		Session.set('termsLength', $("input[id=terms]:checked").length);
	},
	
	"click input[name='checkDomainName']":function(e){
		
		Session.set('domainLength', $("input[name=checkDomainName]:checked").length);
		Session.set('termsLength', $("input[id=terms]:checked").length);
		if($("input[name=checkDomainName]:checked").length==$("input[name=checkDomainName]:checkbox").length)
		  $("input[name=checkAllPlaces]:checkbox").prop('checked', true);
	  	else
		    $("input[name=checkAllPlaces]:checkbox").prop('checked', false);		
	},

	"change input[name=checkDomainName]":function(e){

	    var domains = $("input[name='checkDomainName']:checkbox:checked").map(function() {
	    	return this.value;
		}).get();
		Session.set('checkDOMASSOc', domains);
		Session.set('termsLength', $("input[id=terms]:checked").length);		  
	},
	"click #previous-playerSport":function(e)
	{
        $('#playerDomain').modal('hide');
        $('#playerSport').modal({backdrop: 'static'});;             

	},
	"click #playerRegisterSubmit":function(e)
	{
		if((Session.get('domainLength'))&&(Session.get('termsLength')) && Session.get("role") == "Player")
		{
           	$("#playerDomain").find("#impMsg").text("");
            var domains = $("input[name='checkDomainName']:checkbox:checked").map(function() {
                return this.value;
            }).get();

            Session.set('domainName', domains);
          
                    
            var lData = {
                emailAddress: Session.get('emailAddress'),
                password:$("#password").val(),
                interestedProjectName: Session.get('projectName'),
                interestedDomainName: Session.get('domainName'),
                interestedSubDomain1Name: [""],
                interestedSubDomain2Name: [""],
                associationId: Session.get("selectedAssociationAc"),
                userName: Session.get('playerName'),
                phoneNumber: Session.get('mobileNumber'),
                clubName: "other",
                clubNameId:"other",
                dateOfBirth: Session.get('dateOfBirth'),
                s1:Session.get('DDofdateOfBirth'),
                s2:Session.get('MMofdateOfBirth'),
                s3:Session.get('YYofdateOfBirth'),
                role: Session.get('role'), 
                gender: $("#gender").val(),
                contactPerson: Session.get('userNameContactmodReg2'),
                address: Session.get('address'),
                city: Session.get('city'),
                pinCode: Session.get('pinCode'),
                country:Session.get("country"),
                state:Session.get("stateOfAssoc2"),
                guardianName:$("#guardianName").val()
            };

            Meteor.call("registerPlayer",lData,function(error,response)
            {
                if (response) 
                {
                	try
                    {
                    $('#modReg2').modal('hide');
                    $("#alreadySubscribedText").text("Sending confirmation email");
                                        
                    var dataContext = {
                        message: "Welcome,"+name,
                        academyPersonName: Session.get('userNameContactmodReg2'),
                        academyName: Session.get("clubName"),
                        imageURL:Meteor.absoluteUrl(),
                        role:Session.get('role')
                    }

                    var html = Blaze.toHTMLWithData(Template.sendRegisterationEmailToPlayer, dataContext);
                    var options = {
                        from: "iplayon.in@gmail.com",
                        to:Session.get('emailAddress'),
                        subject: "Welcome,"+Session.get('playerName'),
                        html: html
                    }

                    displayMessage("Registration success")
                    Router.go("/")
                    
                   
                }catch(e){}
                } 
                else if (error) 
                {
                    $("#conFirmHeaderOk").text(error.reason);
                    $("#confirmModalOk").modal({backdrop: 'static'});;
                }
            });
        
        }
		
		else
		{			
			if(Session.get("domainLength") == "0" && Session.get("termsLength") == "0")
				$("#playerDomain").find("#impMsg").text("* Please select domain and accept terms and conditions");
			else if(Session.get("domainLength") == "0")
				$("#playerDomain").find("#impMsg").text("* Please select domain");
			else if(Session.get("termsLength") == "0")
				$("#playerDomain").find("#impMsg").text("* Please accept terms and conditions");
        	$('#playerDomain').modal({backdrop: 'static'});;             

		}
	}

  });


function updateNumberOfDays() {
    $('#days').html('');
    month = $('#months').val();
    year = $('#years').val();
    days = daysInMonth(month, year);
    Session.set("DDofdateOfBirth", null);
    $('#days').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days').append($('<option />').val(i).html(i));
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}