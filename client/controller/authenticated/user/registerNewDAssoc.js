import {
    regEm
}
from '../../../regexExp.js'


$.validator.addMethod(
    "validTextEmail",
    function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }

);

Template.registerNewDAssoc.onCreated(function(){
	var template = this;
	this.subscribe("onlyLoggedIn")
  	template.autorun(function() {
		if(Session.get("enteredEmailAddress_dist")!=undefined){
			template.subscribe("findBYEmail",Session.get("enteredEmailAddress_dist"));
		}
	})
	this.subscribe("timeZone")
});

Template.registerNewDAssoc.onRendered(function(){
	Session.set("enteredEmailAddress_dist",undefined)
	$('#assoc-addNewDA').validate({
		rules: {
 			academyEmailAddress_DN: {
   				required: true,
   				validTextEmail: regEm,
 			},
 		},
 		messages: {
		 	academyEmailAddress_DN: {
			  	required: "Please enter email address.",
			  	validTextEmail:"Enter Valid email"
			 	//alreadyRegisteredAcademy_DN:"This email address is already registered."
			},
		},
		showErrors: function(errorMap, errorList) {
	        $("#assoc-addNewDA2").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	        	Session.set("validated1",0);
	        	$('#setForErrors_DN').css("color", "rgb(179,0,0)");
	            $("#setForErrors_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    submitHandler: function(){
	    	$("#setForErrors_DN").html("")
	    	Meteor.call("registerValidationForUploadPlayers", $("#academyEmailAddress_DN").val(), 1, function(e, resValid) {
	    		if(resValid == false){
			    	Session.set("academyEmailAddressSess_DN",$("#academyEmailAddress_DN").val());
			    	Session.set("academyEmailPasswordSess_DN",randomPassword_Aca_DN(7));
			   		$("#registerNewDAssoc").modal('hide');
			   		//
			    	Blaze.render(Template.registerNewDAssoc2,$("#registerNewPlayerRen5")[0]);
			    	$("#registerNewDAssoc2").modal({
						backdrop: 'static',
						keyboard: false
					});
			    }else if(resValid != undefined && resValid != null){
		    		$("#setForErrors_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+resValid);
		    	}
		    	else if(e){
		    		$("#setForErrors_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+e);
		    	}
			})
	    }
	});
});

Template.registerNewDAssoc2.helpers({
	"stateList_DN":function(){
		var stateList=timeZone.findOne({"countryName":"India"});
		if(stateList!=undefined){
			return stateList.state;
		}
	},
	"setDays2h_DN":function(){
		var s=[];
		for (i = 1; i<32; i++) {
			s.push(i);
		}
		return s;
	},
	setMonths2h_DN:function(){
		var monthNames = ["January", "February", "March", "April", "May", "June",
		       "July", "August", "September", "October", "November", "December"
		];
		var s=[];
		for (i = 1; i < 13; i++) {
			s.push(i);
		}
		return s;
	},
	setYears2h_DN:function(){
		var s=[];
		for (i = new Date().getFullYear(); i > 1900; i--) {
			s.push(i);
		}
		return s;
	}
});

Template.registerNewDAssoc.events({
	'keyup #academyEmailAddress_DN':function(e){
		e.preventDefault();
		Session.set("enteredEmailAddress_dist",e.target.value)
		if($("#academyEmailAddress_DN").valid())
			$('#setForErrors_DN').html("");;
	},
	'change #academyEmailAddress_DN':function(e){
		e.preventDefault();
		Session.set("enteredEmailAddress_dist",e.target.value)
		if($("#academyEmailAddress_DN").valid())
			$('#setForErrors_DN').html("");
	},
	'change #academyEmailPassword_DN':function(e){
		e.preventDefault()
		if($("#academyEmailPassword_DN").valid())
			$('#setForErrors_DN').html("");
	},
	'change #academyEmailPasswordRetype_DN':function(e){
		e.preventDefault()
		if($("#academyEmailPasswordRetype_DN").valid())
			$('#setForErrors_DN').html("");
	},
	'submit form':function(e){
		e.preventDefault();
	},
    'click #cancelRegNewAca_DN':function(e){
    	e.preventDefault()
		Session.set("academymobileNumberSess_DN",undefined);
		Session.set("academypincodeSess_DN",undefined);
		Session.set("academyNameContactSess_DN",undefined);
		Session.set("academyaddressSess_DN",undefined);
		Session.set("academycitySess_DN",undefined);
		Session.set("academyclubNameSess_DN",undefined);
		Session.set("academyEmailAddressSess_DN",undefined);
		Session.set("academyEmailPasswordSess_DN",undefined);
		//
		$("#registerNewAcademyRender_DN").empty();
		$("#registerNewAcademyRender2_DN").empty();
		$("#registerNewDAssoc2").modal('hide');
		$("#academyEmailAddress_DN").val("")
		$("#academyEmailPassword_DN").val("")
		$("#academyEmailPasswordRetype_DN").val("")
		$("#academymobileNumber_DN").val("")
		$("#academypincode_DN").val("")
		$("#academyNameContact_DN").val("")
		$("#academyaddress_DN").val("")
		$("#academycity_DN").val("")
		$("#academyclubName_DN").val("")
		//
		$("#registerNewAcademy_DN").modal('hide');
		$("#registerNewAcademy2_DN").modal('hide');
		//
		$("#manageAcademies_DN").modal('hide')
		$("#viewAdedAcademies").modal('hide')
		$("#registerNewAcademyRender2").empty()
    },
    'click #backAcademyNewReg_DN':function(e){
    	e.preventDefault();
    	$("#registerNewDAssoc2").modal('hide');
    	$("#registerNewDAssoc").modal({
			backdrop: 'static',
			keyboard: false
		});
    },
});

Template.registerNewDAssoc2.onCreated(function(){
	//this.subscribe("users");
	var template = this;
  	template.autorun(function() {
		if(Session.get("enteredAbbName_dist")!=undefined){
			template.subscribe("findBYAbbNameDA",Session.get("enteredAbbName_dist"));
		}
	})
	this.subscribe("timeZone")
	this.subscribe("timeZone")
});

Template.registerNewDAssoc2.onRendered(function(){
	Session.set("enteredAbbName_dist",undefined)
	$('#assoc-addNewDA2').validate({
		rules: {
 			academyNameContact_DN: {
   				required: true,
   				checkSpace_DN:true,
 			},
 			abbrevationAssocAcademy_DN:{
 				required: true,
				checkSpace_DN:true,
				alreadyRegisteredAcaAbbrevation_DN:true
 			},
 			academyaddress_DN: {
		    	//required: true,  
		    	//checkSpace2_DN:true,
		    },
		    state2_DN:{
		    	selectState_DN:true
		    },
		    days_I_DN:{
		    	selectID_DN:true,
		    },
			/*months_I:{
				selectID2:true
			},
		    years_I:{
		    	selectID3:true
		    },*/
		    academyclubName_DN: {
		    	required: true,  
		    	checkSpace3_DN:true,
		    },
		    academycity_DN: {
   				required: true,
   				checkSpace4_DN:true,
 			},
 			academypincode_DN: {
		    	required: true,  
		        minlength: 6,
		        maxlength:6,
		        validPinCode_DN:/^\d+$/
		    },
		    academymobileNumber_DN: {
		    	required: true,  
		        minlength: 10,
		        maxlength:10,
		        validPhoneCode_DN:/^\d+$/
		    },
		    checkAcceptboxTeam_DN:{
		    	checkCheckedTC_DN:true
		    }
 		},
 		messages: {
		 	academyNameContact_DN: {
			  	required: "Please enter dist. association contact person name.",
			  	checkSpace_DN:"dist. association contact person name is not valid."
			},
			 abbrevationAssocAcademy_DN:{
 				required: "Please enter abbrevation of dist. association name.",
				checkSpace_DN:"Please enter valid abbrevation of dist. association name.",
				alreadyRegisteredAcaAbbrevation_DN:"Use different abbrevation."
 			},
			state2_DN:{
		    	selectState_DN:"Please select state"
		    },
		    days_I_DN:{
		    	selectID_DN:"Please select valid date"
		    },
			/*months_I:{
				selectID2:"Please select valid date"
			},
		    years_I:{
		    	selectID3:"Please select valid date"
		    },*/
			academyaddress_DN: {
	    		//required: "Please enter dist. association address.",  
	    		//checkSpace2_DN:"Dist. association address is not valid."
	      	},
	      	academycity_DN: {
	      		required: "Please enter city.", 
	      		checkSpace4_DN:"Dist. association city is not valid." 
	        },
	        academyclubName_DN: {
			  	required: "Please enter dist. association name.",
			  	checkSpace3_DN:"Dist. association name is not valid." 
			},
			academypincode_DN: {
	    		required: "Please enter pincode. ",  
	        	minlength:"Pincode is not valid.",
	        	maxlength:"Pincode is not valid.",
	        	validPinCode_DN:"Pincode is not valid."
	      	},
	      	academymobileNumber_DN: {
	      		required: "Please enter mobile number.",  
	        	minlength: "Mobile Number is not valid.",
	          	maxlength:"Mobile Number is not valid.",
	          	validPhoneCode_DN:"Mobile Number is not valid."
	        },
	       	checkAcceptboxTeam_DN:{
		    	checkCheckedTC_DN:"Please accept terms & conditions."
		    }
		},
		showErrors: function(errorMap, errorList) {
	        $("#assoc-addNewDA2").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	        	Session.set("validated2_DN",0);
	        	$('#setForErrors2_DN').css("color", "rgb(179,0,0)");
	            $("#setForErrors2_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    submitHandler: function(){
		   	$('#setForErrors2_DN').html("");
		   	Session.set("academymobileNumberSess_DN",$("#academymobileNumber_DN").val());
		   	Session.set("academypincodeSess_DN",$("#academypincode_DN").val());
		   	Session.set("academyNameContactSess_DN",$("#academyNameContact_DN").val());
		   	Session.set("academyaddressSess_DN",$("#academyaddress_DN").val());
		   	Session.set("academycitySess_DN",$("#academycity_DN").val());
		   	Session.set("academyclubNameSess_DN",$("#academyclubName_DN").val());
		   	var data={
		   		userName:Session.get("academyNameContactSess_DN"),
		   		emailAddress:Session.get("academyEmailAddressSess_DN"),
		   		password:Session.get("academyEmailPasswordSess_DN"),
		   		emailIdOrPhone:"1",
		   		phoneNumber:Session.get('academymobileNumberSess_DN')
		   	}
		   	//
		   	Meteor.call("registerValidationForUploadPlayers", Session.get('academymobileNumberSess_DN'), 2, function(e, resValid) {
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
								phoneNumber: Session.get('academymobileNumberSess_DN'),
								clubName:Session.get('academyclubNameSess_DN'),
								emailAddress:Session.get('academyEmailAddressSess_DN'),
								role:'Association',
								contactPerson:Session.get('academyNameContactSess_DN'),
		 	 					address:Session.get('academyaddressSess_DN'),
								city:Session.get('academycitySess_DN'),
								pinCode:Session.get('academypincodeSess_DN'),
								newUserId:r.playerID,
								state:$("#state2_DN").val(),
								country:"India",
								s1:$("#days_I_DN").val(),
								s2:$("#months_I_DN").val(),
								s3:$("#years_I_DN").val(),
								userName:$("#academyNameContact_DN").val(),
								abbrevationAcademy:$("#abbrevationAssocAcademy_DN").val(),
								"associationType" : "District/City",
								"parentAssociationId":Meteor.user().userId
							};
							Meteor.call("updateDAFROMSA",lData,function(e,res){
								try{
								if(e){
									$("#conFirmHeaderOk").text(e.reason);
									$("#confirmModalOk").modal({
										backdrop: 'static'
									});
									//
									$("#registerNewDAssoc2").modal('hide');
								}
								else{
									if(Meteor.user().userId&&Meteor.user()){
										var associationName=associations.findOne({"associationId":Meteor.user().userId});
										var dataContext = {
										   	message: "Welcome,"+Session.get("academyNameContactSess_DN"),
										    academyPersonName: Session.get("academyNameContactSess_DN"),
										  	academyName: Session.get("academyclubNameSess_DN"),
										 	associationName:Meteor.user().clubName,
										 	password:Session.get("academyEmailPasswordSess_DN"),
										 	imageURL:Meteor.absoluteUrl()
										}
										var html = Blaze.toHTMLWithData(Template.sendRegisterationEmailToDAFromAss, dataContext);
										var options = {
						                    from: "iplayon.in@gmail.com",
						                    to: Session.get('academyEmailAddressSess_DN'),
						                    subject: "Welcome,"+Session.get("academyNameContactSess_DN"),
						                    html: html
						                 }
						              
									}
									//
									$("#registerNewDAssoc2").modal('hide');
									$("#academyEmailAddress_DN").val("")
									$("#academyEmailPassword_DN").val("");
									$("#academyEmailPasswordRetype_DN").val("")
									$("#academymobileNumber_DN").val("")
									$("#academypincode_DN").val("")
									$("#academyNameContact_DN").val("")
									$("#academyaddress_DN").val("")
									$("#academycity_DN").val("")
									$("#academyclubName_DN").val("")
									Session.set("academymobileNumberSess_DN",undefined);
									Session.set("academypincodeSess_DN",undefined);
									Session.set("academyNameContactSess_DN",undefined);
									Session.set("academyaddressSess_DN",undefined);
									Session.set("academycitySess_DN",undefined);
									Session.set("academyclubNameSess_DN",undefined);
									Session.set("academyEmailAddressSess_DN",undefined);
									Session.set("academyEmailPasswordSess_DN",undefined);
									//
									$("#registerNewDAssoc2").modal('hide');
									$("#registerNewPlayerRen5").empty()
								}
								}catch(e){
									$("#conFirmHeaderOk").text(e);
									$("#confirmModalOk").modal({
										backdrop: 'static'
									});
									$("#registerNewDAssoc2").modal('hide');
								}
							})
							}catch(e){
								$("#conFirmHeaderOk").text(e);
								$("#confirmModalOk").modal({
									backdrop: 'static'
								});
								$("#registerNewDAssoc2").modal('hide');
							}
				   		}
				   		else if(r && r.response != 0){
				   			$("#setForErrors2_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+r.response);
				   		}
				   		else if(e){
				   			$("#setForErrors2_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+e.reason);
				   		}
		   			})
				}
				else if(resValid != undefined && resValid != null){
		    		$("#setForErrors2_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+resValid);
		    	}
		    	else if(e){
		    		$("#setForErrors2_DN").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+e.reason);
		    	}
			})
	    }
	});
});



Template.registerNewDAssoc2.events({
	'submit form':function(e){
		e.preventDefault();
	},
	'keyup #academymobileNumber_DN':function(event){
		$('#setForErrors2_DN').html("");
		if($("#academymobileNumber_DN").valid()){
			$('#setForErrors2_DN').html("");
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
	'keyup #academypincode_DN':function(event){
		$('#setForErrors2_DN').html("");
		if($("#academypincode_DN").valid()){
			$('#setForErrors2_DN').html("");
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
	"change #academyNameContact_DN":function(e){
		$('#setForErrors2_DN').html("");
		if($("#academyNameContact_DN").valid())
			$('#setForErrors2_DN').html("");
	},
	"change #academyaddress_DN":function(e){
		$('#setForErrors2_DN').html("");
		if($("#academyaddress_DN").valid())
			$('#setForErrors2_DN').html("");
	},
	"change #academycity_DN":function(e){
		$('#setForErrors2_DN').html("");
		if($("#academycity_DN").valid())
			$('#setForErrors2_DN').html("");
	},
	"change #academyclubName_DN":function(e){
		$('#setForErrors2_DN').html("");
		if($("#academyclubName_DN").valid())
			$('#setForErrors2_DN').html("");
	},
	"click #cancelAcademyNewReg2_DN":function(e){
		Session.set("academymobileNumberSess_DN",undefined);
		Session.set("academypincodeSess_DN",undefined);
		Session.set("academyNameContactSess_DN",undefined);
		Session.set("academyaddressSess_DN",undefined);
		Session.set("academycitySess_DN",undefined);
		Session.set("academyclubNameSess_DN",undefined);
		Session.set("academyEmailAddressSess_DN",undefined);
		Session.set("academyEmailPasswordSess_DN",undefined);
		//
		$("#registerNewAcademyRender").empty();
		$("#registerNewAcademyRender2").empty();
		//
		$("#registerNewAcademy2").modal('hide');

		$("#academyEmailAddress_DN").val("")
		$("#academyEmailPassword_DN").val("")
		$("#academyEmailPasswordRetype_DN").val("")
		$("#academymobileNumber_DN").val("")
		$("#academypincode_DN").val("")
		$("#academyNameContact_DN").val("")
		$("#academyaddress_DN").val("")
		$("#academycity_DN").val("")
		$("#academyclubName_DN").val("")
		//
		$("#registerNewAcademy2").modal('hide');
		$("#registerNewAcademy").modal('hide');
		$("#manageAcademies").modal('hide')
		$("#viewAdedAcademies").modal('hide')
	},
	"change #state2_DN":function(){
		$('#setForErrors2').html("");
        Session.set("stateOfAssoc2_DN",$("#state2_DN").val());
    },
    'change  #months_I_DN': function(e) {
    	$('#setForErrors2_DN').html("");
        Session.set("MMOfINCh_DN", $("#months_I_DN").val())
        updateNumberOfDaysR_DN();
    },
    'change #years_I_DN': function(e) {
    	$('#setForErrors2_DN').html("");
        Session.set("YYOfINCh_DN", $("#years_I_DN").val())
        updateNumberOfDaysR_DN();
    },
    'change #days_I_DN': function(e) {
    	$('#setForErrors2_DN').html("");
        Session.set("DDOfINCh_DN", $("#days_I_DN").val())
    },
    'change #abbrevationAssocAcademy_DN':function(e){
   		Session.set("enteredAbbName_dist",e.target.value)
    	$('#setForErrors2_DN').html("");
    },
    'keyup #abbrevationAssocAcademy_DN':function(e){
   		Session.set("enteredAbbName_dist",e.target.value)
    	$('#setForErrors2_DN').html("");
    }
});


$.validator.addMethod("alreadyRegisteredAcademy_DN", function(value, element) {
	Session.set("enteredEmailAddress_dist",value)
	if(!(Meteor.users.findOne( { 'emailAddress': value } )))
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
$.validator.addMethod("alreadyRegisteredAcaAbbrevation_DN", function(value, element) {
	Session.set("enteredAbbName_dist",value)
	if(!(associationDetails.findOne({
                'abbrevationAssociation':value.toUpperCase(),
            })))
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
	"validPinCode_DN",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}
);

$.validator.addMethod(
	"validPhoneCode_DN",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}
);

$.validator.addMethod(
	"checkSpace_DN",
	function(value, element, regexp) {
		if(value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"checkSpace2_DN",
	function(value, element, regexp) {
		if(value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"checkSpace3_DN",
	function(value, element, regexp) {
		if(value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"checkSpace4_DN",
	function(value, element, regexp) {
		if(value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"checkCheckedTC_DN",
	function() {
		if($("#terms_DN").prop("checked")){
			$("#setForErrors2_DN").html("");
			return true
		}
		else return false
	}
);

function randomPassword_Aca_DN(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

function updateNumberOfDaysR_DN() {
    $('#days_I_DN').html('');
    month = $('#months_I_DN').val();
    year = $('#years_I_DN').val();
    days = daysInMonthR_DN(month, year);
    Session.set("DDofdateOfBirth_DN", null);
    $('#days_I_DN').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days_I_DN').append($('<option />').val(i).html(i));
    }
}
function daysInMonthR_DN(month, year) {
    return new Date(year, month, 0).getDate();
}

$.validator.addMethod('selectState_DN', function (value) {
    if(value == null||value == 'State') return false;
    else return true;
});


$.validator.addMethod('selectID_DN', function (value) {
  	if($("#years_I_DN").val()!=null&&$("#years_I_DN").val()!="YYYY"){
	   	if($("#months_I_DN").val()==null||$("#months_I_DN").val()=="MM"){
	   		return false;
	   	}
	   	if($("#days_I_DN").val()==null||$("#days_I_DN").val()=="DD"){
	   		return false
	   	}
	   	else return true
    }
    else if($("#months_I_DN").val()!=null&&$("#months_I_DN").val()!="MM"){
	   	if($("#years_I").val()==null||$("#years_I_DN").val()=="YYYY"){
	   		return false;
	   	}
	   	if($("#days_I_DN").val()==null||$("#days_I_DN").val()=="DD"){
	   		return false
	   	}
	   	else return true
    }
    else if($("#days_I_DN").val()!=null&&$("#days_I_DN").val()!="DD"){
	   	if($("#years_I_DN").val()==null||$("#years_I_DN").val()=="YYYY"){
	   		return false;
	   	}
	   	if($("#months_I_DN").val()==null||$("#months_I_DN").val()=="MM"){
	   		return false
	   	}
	   	else return true
    }
    else return true

});
