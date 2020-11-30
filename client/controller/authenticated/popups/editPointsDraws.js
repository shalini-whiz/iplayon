
Template.editPointsDraws.onCreated(function() {
	this.subscribe("MasterMatchCollections");
	this.subscribe("allEvents");
 	this.subscribe("tournamentEvents");
 	this.subscribe("MatchCollectionConfig");
 	this.subscribe("MatchCollectionDB");
});


Template.editPointsDraws.onRendered(function(){
   /*$('#scrollableDiv2').niceScroll({
    cursorborderradius: '0px', // Scroll cursor radius
    background: 'transparent', // The scrollbar rail color
    cursorwidth: '3px', // Scroll cursor width
    cursorcolor: 'maroon',
    autohidemode: true, // Scroll cursor color
  });*/

	validationForm2();
//	Session.set("cancelClicked",undefined);
//	Session.set("cancelClicked",null);
});

Template.editPointsDraws.helpers ({

	"eventNamePopup":function () {
		return Session.get("eventName");
	},
	"roundNumberPopup":function(){
		var param = Router.current().params._id;
		var matchConfigContains = MatchCollectionConfig.findOne({"tournamentId":param,"eventName":Session.get("eventName")});
		if(matchConfigContains==undefined){
		var eventsa =  events.findOne({"_id":param});
		if(eventsa == undefined)
		{
			eventsa =  pastEvents.findOne({"_id":param});
		}
		var projectId;
		if(eventsa!=undefined&&eventsa.projectId!=undefined){
			Session.set("editSetProjectId",eventsa.projectId.toString());
			Session.set("editSetProjectName",eventsa.projectName.toString());
			var masterMatch = MasterMatchCollections.findOne({"projectId":eventsa.projectId.toString()});
			if(masterMatch!=undefined){
				var jsonRoundsValues2=[];
				var values = {}
				try{
				for(var i=1;i<=parseInt(Session.get("maxRoundNum"));i++){
					values={
							roundNumber:i,
							noofSets:masterMatch.noofSets,
							points:masterMatch.points,
					}
					if(i==parseInt(Session.get("maxRoundNum"))){
						values["roundName"]="Final"
					}
					else if(i==parseInt(Session.get("maxRoundNum"))-1){
						values["roundName"]="Semi Final"
					}
					else if(i==parseInt(Session.get("maxRoundNum"))-2){
						values["roundName"]="Quater Final"
					}
					else{
						values["roundName"]=i
					}
					jsonRoundsValues2.push(values)
				}
				}catch(e){}
						var winnerRound ={
							roundNumber:parseInt(Session.get("maxRoundNum"))+1,
							roundName:"Winner",
							points:0
						}
						jsonRoundsValues2.push(winnerRound);
						return jsonRoundsValues2;
			}
		}
		}
		else {
			return matchConfigContains.roundValues;
		}
	},
	seedingShow:function(){
		if(Session.get("knockOutValueSess") && 
            Session.get("knockOutValueSess").trim().toLowerCase() == "seeding"){
            return true
        }else{
            return false
        }
	}
});


Template.editPointsDraws.events({
	'click #downloadforSeeding':function(e){
        if (Session.get("seedingDrawsDataForConfirm") && Session.get("eventName")){
            //var key = ["Name","Affiliation ID", "Points"]
            //var k = JSON.parse(JSON.stringify(Session.get("seedingDrawsDataForConfirm"), key,3));
            //JSONToCSVConvertor(k,Session.get("eventName") , true,"");
            Meteor.call("seedingDetailsDownload",Session.get("tournamentId"),Session.get("eventName"),Session.get("seedingDrawsDataForConfirm"),function(e,res){
                if (res) {
                    window.open("data:application/pdf;base64, " + res);
                }
            })
        }
        else{
            displayMessage("Cannot download")
        }
    }, 
	'click [name^=roundNamePopup], change [name^=roundNamePopup]':function(e){
		e.preventDefault();
		//$("#editSettingsPopupError").html("");
		//$(e.target).css("color","black")
	},

	'click [name^=pointsPopup], change [name^=pointsPopup]':function(e){
		e.preventDefault();
		//$("#editSettingsPopupError").html("");
		//$(e.target).css("color","black")
	},
	"keypress [name^=pointsPopup]": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true; 
    },
	'submit form': function(e) {
		e.preventDefault();
	},

	"keyup [name^=pointsPopup]":function(event){
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
	"click #cancelEditSettingsDraws":function(e){

		$("#editPointsDraws").modal('hide');
		$("#editRender2").empty();
		//Blaze.render(Template.editPointsDraws, $("#editRender2")[0]);
		$("#createDrawPopUp").empty();
        $("#knockOutPopUp").empty();
        $("#settingsPopUp").empty();
        $("#pointsPopUp").empty();
        $("#downloadTemplatePopUp").empty();

        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        Meteor.call("removeDraws",tournamentId,eventName); 
        Session.set("matchRecords", "");
        Session.set("leftRMatches", "");
        Session.set("rightRMatches", "");
       

	},
	/* shalini code starts here */
	'click #previousSettingsDraw': function(e) {
    	e.preventDefault();
        var configurationValue = Session.get("configurationValue");  
		$("#createDraw").modal('hide');
		$("#knockOut").modal('hide');
		$("#editPointsDraws").modal('hide');
        $("#editSettingsDraws").modal('show');
    },
    /* shalini code ends here */

})



var validationForm2 = function(){
		$('#application-editPointsDraws').validate({
			onkeyup: false,
      ignore:[],
      invalidHandler:function(form, validator) {
	      var errors = validator.numberOfInvalids();
	      for (var i = 0; i < validator.errorList.length; i++) {
	      var q = validator.errorList[i].element;
	                $("#"+q.name).css("color","red");
	                $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span>&nbsp;"+validator.errorList[i].message);	     
	           }  
      },
    	errorPlacement: function(error, element) {},
    	submitHandler:function(){
    		try{
    			Meteor.call("drawsCreatedAutoTweet",$("#checkAcceptboxTweett").prop("checked"),Router.current().params._id,Session.get("eventName"),function(e,r){
    				if(e){
    				}
    			})
    		$("#editSettingsPopupError").html("");
    		var roundValues=[];
    		var length = $("#scrollableDiv2").find("[name^=roundNamePopup]").length
			$("#scrollableDiv2").find("[name^=roundNamePopup]").each(function (i) {
				if(parseInt(i+1)==length){
					if($(this).val()){
						if($(this).val()!="Winner"){
					 		$(this).val("Winner");
					 	}
					}
				}
			});
    		$("#scrollableDiv2").find("[name^=roundNumberPopup]").each(function (i) {

    				var roundName = $("input[name='roundNamePopup["+$(this).val()+"]']").val();
    				var pointsPopup = $("input[name='pointsPopup["+$(this).val()+"]']").val();
    				var dataRound = {
    					roundNumber:$(this).val(),
    					roundName:roundName,
    					points:pointsPopup,
    				} 
    				roundValues.push(dataRound);
    		});
    		var data = {
    		 projectId :Session.get("editSetProjectId"),
    		 projectMainName: Session.set("editSetProjectName"),
    		 tournamentId:Router.current().params._id,
    		 eventName:Session.get("eventName"),
    		 roundValues:roundValues
    		}
    		
    		Meteor.call("insertEditPointsDraws",data,function(){
    			Session.set("cancelClicked",undefined);
    			Session.set("jsonRoundsValues2",roundValues);
    		 $("#editPointsDraws").modal('hide');
    		 $("#createDrawPopUp").empty();
    		 $("#knockOutPopUp").empty();
    		 $("#settingsPopUp").empty();
    		 $("#pointsPopUp").empty();
    		 $("#downloadTemplatePopUp").empty();

    		

    		})
    	}catch(e){

    		alert(e)
    	}
    	}
	  });
	  
	  $("#scrollableDiv2").find("[name^=pointsPopup]").each(function () {
	   	$(this).rules("add", {
                required4: true,
                validNumberEditPointsPopup:/^[0-9]*$/,
            });
	  });
}

$.validator.addMethod("validNumberEditPointsPopup", function (value, element,regexp) {
	var re = new RegExp(regexp);
  return this.optional(element) || re.test(value);
},"Min points is not valid");



$.validator.addMethod("checkLastIsWinner", function (value, element,regexp) {
	var length = $("#scrollableDiv2").find("[name^=roundNamePopup]").length
	 $("#scrollableDiv2").find("[name^=roundNamePopup]").each(function (i) {
	 	if(parseInt(i+1)==length){
	 		if($(this).val()){
	 			if($(this).val()!="Winner"){
	 				$(this).val("Winner");
	 				return false;
	 			}
	 			else if($(this).val()=="Winner"){ 
	 				return true;
	 			}
	 		}
	 	}
	 	else return true;
	 });
},"Winner Round Name is Mandatory");
