Template.manageAffId.onCreated(function(){
	this.subscribe("affiliationIdType");
});

Template.manageAffId.onRendered(function(){
	$('#application-affiliationIdSet').validate({
		rules: {
			selectAFFIDType:{
				selectedAFFIDType:true,
			},
 			firsTFixedAFID:{
   				checkSpace_AFFID:true,
   				fFixedType:true
 			},
 		},
 		messages: {
 			selectAFFIDType: {
				selectedAFFIDType:"Please select type of first 3 charcters of affiliation Id.",
			},
		 	firsTFixedAFID: {
			  	checkSpace_AFFID:"Please enter 3 characters for fixed type.",
   				fFixedType:"Please enter only 3 characters."
			},
		},
		showErrors: function(errorMap, errorList) {
	        $("#application-affiliationIdSet").find("input").each(function() {
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
		  	$("#showFixedType").hide();
		  	$("#setForErrors2").html("");
		  	try{
		  		var fiChar="";
		  		if($("#selectAFFIDType").val()=="fixed"){
		  			fiChar=$("#firsTFixedAFID").val();
		  		}
		  		else{
		  			fiChar="";
		  		}
			  	var data={
			  		stateAssocId:Meteor.user().userId,
					firTCharType:$("#selectAFFIDType").val(),
					fixedCharcters:fiChar
			  	}
			  	Meteor.call("insertUpdateAffiliationIdType",data,function(e,res){
			  		try{
				  		if(res){
				  			$("#manageAffId").modal('hide');
				  			$("#affIdrender").empty();
				  		}
				  		else{
				  			$("#manageAffId").modal('hide');
				  			$("#affIdrender").empty();
				  		}
			  		}catch(e){
			  		}
			  	});
		  	}catch(e){
		  	}
	    }
	});
});

Template.manageAffId.helpers({
	"setDisbaledSave_AFFID":function(){
		try{
			if(Meteor.user().userId){
				var r =  affiliationIdType.find({"stateAssocId":Meteor.user().userId}).fetch();
				if(r.length==0){
					return "";
				}
				else
					return "disabled"
			}
		}
		catch(e){

		}
	},
	setReadonlySave_AFFID:function(){
		try{
			if(Meteor.user().userId){
				var r =  affiliationIdType.find({"stateAssocId":Meteor.user().userId}).fetch();
				if(r.length==0){
					return "";
				}
				else
					return "reaonly"
			}
		}
		catch(e){

		}
	},
	"first3CharIfFixed":function(){
		try{
			if(Meteor.user().userId){
				var r =  affiliationIdType.findOne({"stateAssocId":Meteor.user().userId});
				if(r){
					if(r.firTCharType=="fixed"){
						$("#showFixedType").show();
						$("#firsTFixedAFID").val(r.fixedCharcters.toString());
					}
				}
				else
					return ""
			}
		}catch(e){
		}
	}
});

Template.manageAffId.events({
	"change #selectAFFIDType":function(e){
		e.preventDefault();
		$("#setForErrors2").html("");
		$("#showFixedType").hide();
		if($("#selectAFFIDType").val()=="fixed"){
			$("#showFixedType").show();
		}
		else{
			$("#showFixedType").hide();
		}
	},
	"keyup #firsTFixedAFID":function(e){
		e.preventDefault();
		$("#setForErrors2").html("");
	},
	"click #cancelAffIDType":function(e){
		e.preventDefault();
		$("#setForErrors2").html("");
		$("#affIdrender").empty();
	},
	'submit form': function(e) {
		e.preventDefault();
		$("#setForErrors2").html("")
	},

});

$.validator.addMethod('selectedAFFIDType', function (value) {
    if(value == null) return false;
    else return true;
});

$.validator.addMethod(
	"checkSpace_AFFID",function(value, element, regexp) {
		if($("#selectAFFIDType").val()=="fixed"&&value.trim().length!=0){
			return true
		}
		else return false
	}
);

$.validator.addMethod(
	"fFixedType",function(value, element, regexp) {
		if($("#selectAFFIDType").val()=="fixed"&&value.trim().length!=0){
			if(value.trim().length>3){
				return false
			}
			return true
		}
	}
);

Template.registerHelper("selectedTypeOnce",function(data){
	var r =  affiliationIdType.findOne({"stateAssocId":Meteor.user().userId});
		if(r){
			if(data==r.firTCharType){
				return "selected"
			}
		}
		else{
			return ""
		}
});

