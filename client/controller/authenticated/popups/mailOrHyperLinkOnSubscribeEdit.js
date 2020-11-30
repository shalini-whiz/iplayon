Template.mailOrHyperLinkOnSubscribeEdit.onCreated(function(){
	this.subscribe("onlyLoggedIn");
	this.subscribe("tournamentEVENT", Router.current().params._PostId)

});

Template.mailOrHyperLinkOnSubscribeEdit.onRendered(function(){
	validatemailOrHyperLinkEdit();
});

Template.mailOrHyperLinkOnSubscribeEdit.helpers({
	"mailAddress":function(){
		try{
			if(Meteor.user()!=undefined&&Meteor.user().emails[0].address!=undefined)
			return Meteor.user().emails[0].address
		}catch(e){}
	},
	"getSelectedTypeHyper":function(){
		try{
		var eveDet = events.findOne({"_id":Router.current().params._PostId.toString(),"tournamentEvent":true});
		if(eveDet){
			if(eveDet.subscriptionTypeHyper!=="0"){
				return "checked"
			}
			else{
				return ""
			}
		}
		}catch(e){
		}
	},
	"getSelectedTypeHyperValue":function(){
		try{
		var eveDet = events.findOne({"_id":Router.current().params._PostId.toString(),"tournamentEvent":true});
		if(eveDet){
			if(eveDet.subscriptionTypeHyper!=="0"){
				return eveDet.hyperLinkValue
			}
			else{
				return ""
			}
		}
		}catch(e){
		}
	},
	"getSelectedTypeDirect":function(){
		try{
		var eveDet = events.findOne({"_id":Router.current().params._PostId.toString(),"tournamentEvent":true});
		if(eveDet){
			if(eveDet.subscriptionTypeDirect!=="0"){
				return "checked"
			}
			else{
				return ""
			}
		}
		}catch(e){
		}
	},
	"getSelectedTypeMail":function(){
		try{
		var eveDet = events.findOne({"_id":Router.current().params._PostId.toString(),"tournamentEvent":true});
		if(eveDet){
			if(eveDet.subscriptionTypeMail!=="0"){
				return "checked"
			}
			else{
				return ""
			}
		}
		}catch(e){
		}
	},
	"subscribeWithHYPERLINK":function(){
		try{
			var eveDet = events.findOne({"_id":Router.current().params._PostId.toString(),"tournamentEvent":true});
			if(eveDet){
				if(eveDet.subscriptionWithAffId!=="0"){
					return "checked"
				}
				else{
					return ""
				}
			}
		}catch(e){}
	}
});

Template.mailOrHyperLinkOnSubscribeEdit.events({
	"submit form":function(e){
		e.preventDefault();
	},
	"keyup #setAnysetDirect":function(e){
		e.preventDefault();
		$("#httpSettingsPopupError").html("");
	},
	"change #setAnysetDirect":function(e){
		$("#httpSettingsPopupError").html("");
		e.preventDefault();
		if($("#setAnysetDirect").prop("checked")){
			$("#setAnysetmail").prop("checked",true)
		}
	},
	"change #setAnysetmail":function(e){
		$("#httpSettingsPopupError").html("");
		e.preventDefault();
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

var validatemailOrHyperLinkEdit = function(){
	$('#application-mailOrHyperLinkOnSubscribeEdit').validate({
		rules: {
			setAnyset:{
				checkAnySetHTTPEdit:true
			},
			Httpcheck:{
				checkForSpaceHTTPEdit:true
			}
		},
		messages: {
			setAnyset:{
				checkAnySetHTTPEdit:"Please select any of the above"
			},
			Httpcheck:{
				checkForSpaceHTTPEdit:"Http is not valid"
			}

		},
		showErrors: function(errorMap, errorList) {
	        $("#application-mailOrHyperLinkOnSubscribeEdit").find("input").each(function() {
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
	"checkAnySetHTTPEdit",
	function(value, element, regexp) {
		if($("#setAnysetDirect").prop("checked")==false&&$("#setAnysetHyper").prop("checked")==false&&$("#setAnysetmail").prop("checked")==false){
			return false
		}
		else{
			return true
		}
	});

$.validator.addMethod(
	"checkForSpaceHTTPEdit",
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