import {
    regEm
}
from '../../../regexExp.js'

Template.registerNewAcademy.onCreated(function(){
	var template = this;
	this.subscribe("onlyLoggedIn")
  	template.autorun(function() {
		if(Session.get("enteredEmailAddress")!=undefined){
			template.subscribe("findBYEmail",Session.get("enteredEmailAddress"));
		}
	})
	this.subscribe("timeZone")
});

Template.registerNewAcademy.onRendered(function(){
	Session.set("enteredEmailAddress",undefined)
	$('#assoc-addNewAca').validate({
		rules: {
 			academyEmailAddress: {
   				required: true,
				validTextEmail: regEm,

			}
 		},
 		messages: {
		 	academyEmailAddress: {
			  	required: "Please enter email address.",
			  	email: "Please enter a valid email address.",
			  	validTextEmail:"Enter Valid email"
			 	//alreadyRegisteredAcademy:"This  email address is already registered."
			},
   				//alreadyRegisteredAcademy:true
 			
		},
		showErrors: function(errorMap, errorList) {
	        $("#assoc-addNewAca").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	        	Session.set("validated1",0);
	        	$('#setForErrors').css("color", "rgb(179,0,0)");
	            $("#setForErrors").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    submitHandler: function(){
	    	$("#setForErrors").html("")
	    	Meteor.call("registerValidationForUploadPlayers", $("#academyEmailAddress").val(), 1, function(e, resValid) {
	    		if(resValid == false){
			    	Session.set("academyEmailAddressSess",$("#academyEmailAddress").val());
			    	Session.set("academyEmailPasswordSess",randomPassword_Aca(7));
			   		$("#registerNewAcademy").modal('hide');
			    	Blaze.render(Template.registerNewAcademy2,$("#registerNewAcademy_PAge")[0]);
			    	$("#registerNewAcademy2").modal({
						backdrop: 'static',
						keyboard: false
					});
		    	}else if(resValid != undefined && resValid != null){
		    		$("#setForErrors").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+resValid);
		    	}
		    	else if(e){
		    		$("#setForErrors").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+e);
		    	}
	    	})
	    }
	});
});

Template.registerNewAcademy2.helpers({
	"stateList":function(){
		var stateList=timeZone.findOne({"countryName":"India"});
		if(stateList!=undefined){
			return stateList.state;
		}
	},
	"setDays2h":function(){
		var s=[];
		for (i = 1; i<32; i++) {
			s.push(i);
		}
		return s;
	},
	setMonths2h:function(){
		var monthNames = ["January", "February", "March", "April", "May", "June",
		       "July", "August", "September", "October", "November", "December"
		];
		var s=[];
		for (i = 1; i < 13; i++) {
			s.push(i);
		}
		return s;
	},
	setYears2h:function(){
		var s=[];
		for (i = new Date().getFullYear(); i > 1900; i--) {
			s.push(i);
		}
		return s;
	}
});

Template.registerNewAcademy.events({
	'keyup #academyEmailAddress':function(e){
		e.preventDefault();
		Session.set("enteredEmailAddress",e.target.value)
		if($("#academyEmailAddress").valid())
			$('#setForErrors').html("");
	},
	'change #academyEmailAddress':function(e){
		e.preventDefault();
		Session.set("enteredEmailAddress",e.target.value)
		if($("#academyEmailAddress").valid())
			$('#setForErrors').html("");
	},
	'change #academyEmailPassword':function(e){
		e.preventDefault()
		if($("#academyEmailPassword").valid())
			$('#setForErrors').html("");
	},
	'change #academyEmailPasswordRetype':function(e){
		e.preventDefault()
		if($("#academyEmailPasswordRetype").valid())
			$('#setForErrors').html("");
	},
	'submit form':function(e){
		e.preventDefault();
	},
    'click #cancelRegNewAca':function(e){
    	e.preventDefault()
		Session.set("academymobileNumberSess",undefined);
		Session.set("academypincodeSess",undefined);
		Session.set("academyNameContactSess",undefined);
		Session.set("academyaddressSess",undefined);
		Session.set("academycitySess",undefined);
		Session.set("academyclubNameSess",undefined);
		Session.set("academyEmailAddressSess",undefined);
		Session.set("academyEmailPasswordSess",undefined);
		$("#registerNewAcademyRender").empty();
		$("#registerNewAcademyRender2").empty();
		$("#registerNewAcademy2").modal('hide');
		$("#academyEmailAddress").val("")
		$("#academyEmailPassword").val("")
		$("#academyEmailPasswordRetype").val("")
		$("#academymobileNumber").val("")
		$("#academypincode").val("")
		$("#academyNameContact").val("")
		$("#academyaddress").val("")
		$("#academycity").val("")
		$("#academyclubName").val("")
		$("#registerNewAcademy").modal('hide');
		$("#registerNewAcademy2").modal('hide');
		$("#manageAcademies").modal('hide')
		$("#viewAdedAcademies").modal('hide')
		$("#registerNewAcademyRender2").empty()
    },

});

Template.registerNewAcademy2.onCreated(function(){
	//this.subscribe("users");
	var template = this;
	this.subscribe("onlyLoggedInd")
	this.subscribe("onlyLoggedInALLRoles")
  	template.autorun(function() {
		if(Session.get("enteredAbbName")!=undefined){
			template.subscribe("findBYAbbName",Session.get("enteredAbbName"));
		}
	})
	this.subscribe("timeZone")
});

Template.registerNewAcademy2.onRendered(function(){
	Session.set("enteredAbbName",undefined)
	$('#assoc-addNewAca2').validate({
		rules: {
 			academyNameContact: {
   				required: true,
   				checkSpace:true,
 			},
 			abbrevationAssocAcademy:{
 				required: true,
				checkSpace:true,
				alreadyRegisteredAcaAbbrevation:true
 			},
 			/*academyaddress: {
		    	required: true,  
		    	checkSpace2:true,
		    },*/
		    state2:{
		    	selectState:true
		    },
		    days_I:{
		    	selectID:true,
		    },
			/*months_I:{
				selectID2:true
			},
		    years_I:{
		    	selectID3:true
		    },*/
		    academyclubName: {
		    	required: true,  
		    	checkSpace3:true,
		    },
		    academycity: {
   				required: true,
   				checkSpace4:true,
 			},
 			academypincode: {
		    	required: true,  
		        minlength: 6,
		        maxlength:6,
		        validPinCode:/^\d+$/
		    },
		    academymobileNumber: {
		    	required: true,  
		        minlength: 10,
		        maxlength:10,
		        validPhoneCode:/^\d+$/
		    },
		    checkAcceptboxTeam:{
		    	checkCheckedTC:true
		    }
 		},
 		messages: {
		 	academyNameContact: {
			  	required: "Please enter academy contact person name.",
			  	checkSpace:"Academy contact person name is not valid."
			},
			 abbrevationAssocAcademy:{
 				required: "Please enter abbrevation of academy name.",
				checkSpace:"Please enter valid abbrevation of academy name.",
				alreadyRegisteredAcaAbbrevation:"Use different abbrevation."
 			},
			state2:{
		    	selectState:"Please select state"
		    },
		    days_I:{
		    	selectID:"Please select valid date"
		    },
			/*months_I:{
				selectID2:"Please select valid date"
			},
		    years_I:{
		    	selectID3:"Please select valid date"
		    },*/
			academyaddress: {
	    		required: "Please enter academy address.",  
	    		checkSpace2:"Academy address is not valid."
	      	},
	      	/*academycity: {
	      		required: "Please enter city.", 
	      		checkSpace4:"Academy city is not valid." 
	        },*/
	        academyclubName: {
			  	required: "Please enter academy name.",
			  	checkSpace3:"Academy name is not valid." 
			},
			academypincode: {
	    		required: "Please enter pincode. ",  
	        	minlength:"Pincode is not valid.",
	        	maxlength:"Pincode is not valid.",
	        	validPinCode:"Pincode is not valid."
	      	},
	      	academymobileNumber: {
	      		required: "Please enter mobile number.",  
	        	minlength: "Mobile Number is not valid.",
	          	maxlength:"Mobile Number is not valid.",
	          	validPhoneCode:"Mobile Number is not valid."
	        },
	       	checkAcceptboxTeam:{
		    	checkCheckedTC:"Please accept terms & conditions."
		    }
		},
		showErrors: function(errorMap, errorList) {
	        $("#assoc-addNewAca2").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	        	Session.set("validated2",0);
	        	$('#setForErrors2').css("color", "rgb(179,0,0)");
	            $("#setForErrors2").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    submitHandler: function(){
		   	$('#setForErrors2').html("");
		   	Session.set("academymobileNumberSess",$("#academymobileNumber").val());
		   	Session.set("academypincodeSess",$("#academypincode").val());
		   	Session.set("academyNameContactSess",$("#academyNameContact").val());
		   	Session.set("academyaddressSess",$("#academyaddress").val());
		   	Session.set("academycitySess",$("#academycity").val());
		   	Session.set("academyclubNameSess",$("#academyclubName").val());

		   	var data={
		   		userName:Session.get("academyNameContactSess"),
		   		emailAddress:Session.get("academyEmailAddressSess"),
		   		password:Session.get("academyEmailPasswordSess"),
		   		emailIdOrPhone:"1",
		   		phoneNumber:Session.get('academymobileNumberSess')
		   	}
		   	Meteor.call("registerValidationForUploadPlayers", Session.get('academymobileNumberSess'), 2, function(e, resValid) {
	    		if(resValid == false){
		   			Meteor.call("registerValidationGeneralized",data,function(e,r){
				   		if(r && r.response == 0 && r.playerID){
				   			try{
							var lData = {
								interestedProjectName:Meteor.user().interestedProjectName,
								interestedDomainName: Meteor.user().interestedDomainName,
								interestedSubDomain1Name: [""],
								interestedSubDomain2Name: [""],
		  	 					associationId:Meteor.user().userId,
								phoneNumber: Session.get('academymobileNumberSess'),
								clubName:Session.get('academyclubNameSess'),
								emailAddress:Session.get('academyEmailAddressSess'),
								role:'Academy',
								contactPerson:Session.get('academyNameContactSess'),
		 	 					address:Session.get('academyaddressSess'),
								city:Session.get('academycitySess'),
								pinCode:Session.get('academypincodeSess'),
								newUserId:r.playerID,
								state:$("#state2").val(),
								country:"India",
								s1:$("#days_I").val(),
								s2:$("#months_I").val(),
								s3:$("#years_I").val(),
								userName:$("#academyNameContact").val(),
								abbrevationAcademy:$("#abbrevationAssocAcademy").val()
							};
							Meteor.call("updateAcademyFROMDASA",lData,function(e,res){
								
								try{
								if(e){
									$("#conFirmHeaderOk").text(e.reason);
									$("#confirmModalOk").modal({
										backdrop: 'static'
									});
									$("#registerNewAcademy2").modal('hide');
								}
								else{
									if(Meteor.user().userId&&Meteor.user()){
										var associationName=associationDetails.findOne({"userId":Meteor.user().userId});
										if(associationName&&associationName.associationName==undefined){
											associationName.associationName = "";
										}
										var dataContext = {
										   	message: "Welcome,"+Session.get("academyNameContactSess"),
										    academyPersonName: Session.get("academyNameContactSess"),
										  	academyName: Session.get("academyclubNameSess"),
										 	associationName:associationName.associationName,
										 	password:Session.get("academyEmailPasswordSess"),
										 	imageURL:Meteor.absoluteUrl()
										}
										var html = Blaze.toHTMLWithData(Template.sendRegisterationEmailToAcaFromAss, dataContext);
										var options = {
						                    from: "iplayon.in@gmail.com",
						                    to: Session.get('academyEmailAddressSess'),
						                    subject: "Welcome,"+Session.get("academyNameContactSess"),
						                    html: html
						                 }
						               
									}
									$("#registerNewAcademy2").modal('hide');
									$("#academyEmailAddress").val("")
									$("#academyEmailPassword").val("");
									$("#academyEmailPasswordRetype").val("")
									$("#academymobileNumber").val("")
									$("#academypincode").val("")
									$("#academyNameContact").val("")
									$("#academyaddress").val("")
									$("#academycity").val("")
									$("#academyclubName").val("")
									Session.set("academymobileNumberSess",undefined);
									Session.set("academypincodeSess",undefined);
									Session.set("academyNameContactSess",undefined);
									Session.set("academyaddressSess",undefined);
									Session.set("academycitySess",undefined);
									Session.set("academyclubNameSess",undefined);
									Session.set("academyEmailAddressSess",undefined);
									Session.set("academyEmailPasswordSess",undefined);
									$("#registerNewAcademy2").modal('hide');
									$("#registerNewAcademy_PAge").empty()
								}
								}catch(e){
									$("#conFirmHeaderOk").text(e);
									$("#confirmModalOk").modal({
										backdrop: 'static'
									});
									$("#registerNewAcademy2").modal('hide');
								}
							})
							}catch(e){
								$("#conFirmHeaderOk").text(e);
								$("#confirmModalOk").modal({
									backdrop: 'static'
								});
								$("#registerNewAcademy2").modal('hide');
							}
				   		}
				   		else if(r && r.response != 0){
				   			$("#setForErrors2_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+r.response);
				   		}
				   		else if(e){
				   			$("#setForErrors2_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+e.reason);
				   		}
		   			})
				}else if(resValid != undefined && resValid != null){
		    		$("#setForErrors2").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+resValid);
		    	}
		    	else if(e){
		    		$("#setForErrors").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+e.reason);
		    	}

			})
	    }
	});
});



Template.registerNewAcademy2.events({
	'submit form':function(e){
		e.preventDefault();
	},
	'keyup #academymobileNumber':function(event){
		$('#setForErrors2').html("");
		if($("#academymobileNumber").valid()){
			$('#setForErrors2').html("");
		}
		var key = window.event ? event.keyCode : event.which;
	    if (event.keyCode === 8 || event.keyCode === 46
	        || event.keyCode === 37 || event.keyCode === 39) {
	        return true;
	    }
	    else if ( key < 48 || key > 57 ) {
	        return false;
	    }
	    else return true;
	},
	'keyup #academypincode':function(event){
		$('#setForErrors2').html("");
		if($("#academypincode").valid()){
			$('#setForErrors2').html("");
		}
		var key = window.event ? event.keyCode : event.which;
	    if (event.keyCode === 8 || event.keyCode === 46
	        || event.keyCode === 37 || event.keyCode === 39) {
	        return true;
	    }
	    else if ( key < 48 || key > 57 ) {
	        return false;
	    }
	    else return true;
	},
	"change #academyNameContact":function(e){
		$('#setForErrors2').html("");
		if($("#academyNameContact").valid())
			$('#setForErrors2').html("");
	},
	"change #academyaddress":function(e){
		$('#setForErrors2').html("");
		if($("#academyaddress").valid())
			$('#setForErrors2').html("");
	},
	"change #academycity":function(e){
		$('#setForErrors2').html("");
		if($("#academycity").valid())
			$('#setForErrors2').html("");
	},
	"change #academyclubName":function(e){
		$('#setForErrors2').html("");
		if($("#academyclubName").valid())
			$('#setForErrors2').html("");
	},
	"click #cancelAcademyNewReg2":function(e){
		Session.set("academymobileNumberSess",undefined);
		Session.set("academypincodeSess",undefined);
		Session.set("academyNameContactSess",undefined);
		Session.set("academyaddressSess",undefined);
		Session.set("academycitySess",undefined);
		Session.set("academyclubNameSess",undefined);
		Session.set("academyEmailAddressSess",undefined);
		Session.set("academyEmailPasswordSess",undefined);
		$("#registerNewAcademyRender").empty();
		$("#registerNewAcademyRender2").empty();
		$("#registerNewAcademy2").modal('hide');
		$("#academyEmailAddress").val("")
		$("#academyEmailPassword").val("")
		$("#academyEmailPasswordRetype").val("")
		$("#academymobileNumber").val("")
		$("#academypincode").val("")
		$("#academyNameContact").val("")
		$("#academyaddress").val("")
		$("#academycity").val("")
		$("#academyclubName").val("")
		$("#registerNewAcademy2").modal('hide');
		$("#registerNewAcademy").modal('hide');
		$("#manageAcademies").modal('hide')
		$("#viewAdedAcademies").modal('hide')
	},
	"change #state2":function(){
		$('#setForErrors2').html("");
        Session.set("stateOfAssoc2",$("#state2").val());
    },
    'change  #months_I': function(e) {
    	$('#setForErrors2').html("");
        Session.set("MMOfINCh", $("#months_I").val())
        updateNumberOfDaysR();
    },
    'change #years_I': function(e) {
    	$('#setForErrors2').html("");
        Session.set("YYOfINCh", $("#years_I").val())
        updateNumberOfDaysR();
    },
    'change #days_I': function(e) {
    	$('#setForErrors2').html("");
        Session.set("DDOfINCh", $("#days_I").val())
    },
    'change #abbrevationAssocAcademy':function(e){
   		Session.set("enteredAbbName",e.target.value)
    	$('#setForErrors2').html("");
    },
    'keyup #abbrevationAssocAcademy':function(e){
   		Session.set("enteredAbbName",e.target.value)
    	$('#setForErrors2').html("");
    },
	'click #backAcademyNewReg':function(e){
    	e.preventDefault();
    	$("#registerNewAcademy2").modal('hide');
    	$("#registerNewAcademy").modal({
			backdrop: 'static',
			keyboard: false
		});
    },
});


$.validator.addMethod("alreadyRegisteredAcademy", function(value, element) {
	Session.set("enteredEmailAddress",value)
	if(!(Meteor.users.findOne( { 'emailAddress': value} )))
	{
		// If the user is not registered
		return true;
	}	
	else
	{
		// If the user is already registered
		return false;
	}
});
$.validator.addMethod("alreadyRegisteredAcaAbbrevation", function(value, element) {
	Session.set("enteredAbbName",value)
	
	if(!(academyDetails.findOne({'abbrevationAcademy':value.toUpperCase()})))
	{
		// If the user is not registered
		return true;
	}	
	else
	{
		// If the user is already registered
		return false;
	}	
});
$.validator.addMethod(
	"validPinCode",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}
);

$.validator.addMethod(
	"validPhoneCode",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}
);

$.validator.addMethod(
	"checkSpace",
	function(value, element, regexp) {
		if(value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"checkSpace2",
	function(value, element, regexp) {
		if(value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"checkSpace3",
	function(value, element, regexp) {
		if(value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"checkSpace4",
	function(value, element, regexp) {
		if(value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"checkCheckedTC",
	function() {
		if($("#terms").prop("checked")){
			$("#setForErrors2").html("");
			return true
		}
		else return false
	}
);

function randomPassword_Aca(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

function updateNumberOfDaysR() {
    $('#days_I').html('');
    month = $('#months_I').val();
    year = $('#years_I').val();
    days = daysInMonthR(month, year);
    Session.set("DDofdateOfBirth", null);
    $('#days_I').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days_I').append($('<option />').val(i).html(i));
    }
}
function daysInMonthR(month, year) {
    return new Date(year, month, 0).getDate();
}

$.validator.addMethod('selectState', function (value) {
    if(value == null||value == 'State') return false;
    else return true;
});


$.validator.addMethod('selectID', function (value) {
  	if($("#years_I").val()!=null&&$("#years_I").val()!="YYYY"){
	   	if($("#months_I").val()==null||$("#months_I").val()=="MM"){
	   		return false;
	   	}
	   	if($("#days_I").val()==null||$("#days_I").val()=="DD"){
	   		return false
	   	}
	   	else return true
    }
    else if($("#months_I").val()!=null&&$("#months_I").val()!="MM"){
	   	if($("#years_I").val()==null||$("#years_I").val()=="YYYY"){
	   		return false;
	   	}
	   	if($("#days_I").val()==null||$("#days_I").val()=="DD"){
	   		return false
	   	}
	   	else return true
    }
    else if($("#days_I").val()!=null&&$("#days_I").val()!="DD"){
	   	if($("#years_I").val()==null||$("#years_I").val()=="YYYY"){
	   		return false;
	   	}
	   	if($("#months_I").val()==null||$("#months_I").val()=="MM"){
	   		return false
	   	}
	   	else return true
    }
    else return true

});

$.validator.addMethod(
    "validTextEmail",
    function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }

);
