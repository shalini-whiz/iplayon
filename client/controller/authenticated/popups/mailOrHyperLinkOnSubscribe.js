Template.mailOrHyperLinkOnSubscribe.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.mailOrHyperLinkOnSubscribe.onRendered(function(){
	validatemailOrHyperLink();
});

Template.mailOrHyperLinkOnSubscribe.helpers({
	"mailAddress":function(){
		try{
			if(Meteor.user()!=undefined&&Meteor.user().emails[0].address!=undefined)
			return Meteor.user().emails[0].address
		}catch(e){}
	},
});

Template.mailOrHyperLinkOnSubscribe.events({
	"submit form":function(e){
		e.preventDefault();
	},
	"keyup #setAnysetDirect":function(e){
		e.preventDefault();
		$("#httpSettingsPopupError").html("");
	},
	"change #setAnysetDirect":function(e){
		e.preventDefault();
		$("#httpSettingsPopupError").html("");
		if($("#setAnysetDirect").prop("checked")){
			$("#setAnysetmail").prop("checked",true)
		}
	},
	"change #setAnysetmail":function(e){
		e.preventDefault();
		$("#httpSettingsPopupError").html("");
		if($("#setAnysetmail").prop("checked")){
			$("#setAnysetDirect").prop("checked",true)
		}
	},
	"keyup #setAnysetHyper":function(e){
		e.preventDefault();
		$("#httpSettingsPopupError").html("");
	},
	"change #setAnysetHyper":function(e){
		e.preventDefault();
		$("#httpSettingsPopupError").html("");
		if($("#setAnysetHyper").prop("checked")){
			$("#setAnysetmail").prop("checked",false)
		}
	},
	"keyup #Httpcheck":function(e){
		e.preventDefault();
		$("#httpSettingsPopupError").html("");
	},
});

var validatemailOrHyperLink = function(){
	$('#application-mailOrHyperLinkOnSubscribe').validate({
		rules: {
			setAnyset:{
				checkAnySetHTTP:true
			},
			Httpcheck:{
				checkForSpaceHTTP:true
			}
		},
		messages: {
			setAnyset:{
				checkAnySetHTTP:"Please select either Subscribe On iPlayOn or Redirect to Hyperlink"
			},
			Httpcheck:{
				checkForSpaceHTTP:"Http is not valid"
			}

		},
		showErrors: function(errorMap, errorList) {
	        $("#application-mailOrHyperLinkOnSubscribe").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	            $("#httpSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    submitHandler: function(){

			
		}
	})
}

$.validator.addMethod(
	"checkAnySetHTTP",
	function(value, element, regexp) {
		if($("#setAnysetDirect").prop("checked")==false&&$("#setAnysetHyper").prop("checked")==false&&$("#setAnysetmail").prop("checked")==false){
			return false
		}
		else{
			return true
		}
	});

$.validator.addMethod(
	"checkForSpaceHTTP",
	function(value, element, regexp) {
		if($("#setAnysetHyper").prop("checked")==true&&value.trim().length==""){
			if(value.trim().length==0){
					return false
			}
			else{
				return true
			}
		}
		else{
			return true
		}
	});