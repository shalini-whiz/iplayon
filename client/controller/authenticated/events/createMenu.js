Template.subscriptionDOB.onCreated(function(){
	this.subscribe("tournamentEvents");
	this.subscribe("allEvents");
	this.subscribe("dobFilterSubscribe")
});
Template.selectedEventsCategories.onCreated(function(){
	this.subscribe("tournamentEvents");
	this.subscribe("allEvents");
	this.subscribe("dobFilterSubscribe")
});
Template.subscriptionDOB.onRendered(function(){
	Session.set("getEventListForSelectedTorun",undefined);
	Session.set("errorsValid",undefined);
	
});
Template.selectedEventsCategories.onRendered(function(){
	//subscriptionDOBValidate()
})
/*var subscriptionDOBValidate = function(){
	$("#subscriptionDOBForm").validate({
		onkeyup: false,
		ignore:[],
		invalidHandler: function(form, validator) {
	        $("#subscriptionDOBForm").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        var errors = validator.numberOfInvalids();
	        for(var i = 0; i < validator.errorList.length; i++){
	        	var q = validator.errorList[i].element;
	        	$("#"+q.name).css("color","red");
	        	$("#eveDomProvideDetails").html("<span class='glyphicon glyphicon-remove-sign red'></span>&nbsp;"+validator.errorList[i].message);	     
	        } 
	    },
	    errorPlacement: function(error, element) {},
	    submitHandler:function(){
	    	try{
	    	var arrayToSave = [];
	    	mainProjectId = "";
	    	var gender = "";
	    	$("#eveDomProvideDetails").html("");
	    	$("#tableSetDOB > tbody  > tr").each(function(i,j) {
	    		mainProjectId = $(this).attr("id")
				$(this).find("[name^=dateOfBirthForEvent]").each(function() {
					var genderDetails = tournamentEvents.findOne({"_id":mainProjectId});
					if(genderDetails.projectSubName){
						for(var m=0;m<genderDetails.projectSubName.length;m++){
							var find = genderDetails.projectSubName[m];
							if(find._id==$(this).attr("id")){
								gender = find.gender;
							}
						}
					}
	   				var data={
	   					"eventId":$(this).attr("id"),
	   					"dateOfBirth":$(this).val(),
	   					"gender":gender,
	   					"ranking":$(this).parent().next().children().val().trim().toLowerCase()
	   				}
	   				arrayToSave.push(data)
	   			});
			});
			Meteor.call("saveFilterDateOfBirth", Meteor.user()._id,mainProjectId,arrayToSave,function(e,r){
				if(e){
				}
				else{
					$("#subscriptionDOB").modal('hide')
				}
			});
			}catch(e){

			}
	    },
	});
	$("#tableSetDOB > tbody  > tr").each(function(i,j) {
		$(this).find("[name^=dateOfBirthForEvent]").each(function() {
	   		$(this).rules("add", {
                dateOfBirthForEventValid:true,
            });
	   	});
	   	$(this).find("[name^=rankingForEvent]").each(function() {
	   		$(this).rules("add", {
                rankingForEventAllow:true,
            });
	   	});
	});
}

$.validator.addMethod("dateOfBirthForEventValid", function (value, element,regexp) {
	var text = value.trim();
	if(text.length==0){
		$("#eveDomProvideDetails").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"date of birth invalid");
		return false
	}
	else{
		var text = value.trim();
		var comp = text.split(" ");
		if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3){
			var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
			var comp2 = comp[1].toLowerCase();
			var monthNum = parseInt(months.indexOf(comp2)+1);
			var d = parseInt(comp[0], 10);
			var m = parseInt(monthNum,10);
			var y = parseInt(comp[2], 10);
			var date = new Date(y,m-1,d);
			if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
				return true
			}
			else{
				var name = element.name;
				$("[name="+name+"]").css("color","red")
				$("#eveDomProvideDetails").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"date of birth invalid");
				return false
			}
		}
		else{
			var name = element.name;
			$("[name="+name+"]").css("color","red")
			$("#eveDomProvideDetails").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"date of birth invalid");
			return false
		}
	}
},"date of birth invalid");

$.validator.addMethod("rankingForEventAllow", function (value, element,regexp) {
	var text = value.trim();
	if(text.length==0){
		$("#eveDomProvideDetails").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"allow ranking is invalid");
		return false
	}
	else{
		var text = value.trim();
		if(text.toLowerCase()=="yes"||text.toLowerCase()=="no"){
			return true
		}
		else {
			var name = element.name;
			$("[name="+name+"]").css("color","red")
			$("#eveDomProvideDetails").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"allow ranking is invalid");
		}

	}
},"allow ranking is invalid");*/

Template.createMenu.events({
	"click #createMenuEvent":function(e){
		e.preventDefault();
		$("#alreadySubscribed").modal({
						backdrop: 'static',
						keyboard:false
		});
		$("#alreadySubscribedText").text("This feature is not enabled in this version");
	},

	"click #createMenuTournament":function(e){
		e.preventDefault();
		Router.go("/createEvents/t/1");
	},

	"click #createMenuCoaching":function(e){
		e.preventDefault();
		$("#alreadySubscribed").modal({
						backdrop: 'static',
						keyboard:false
		});	
		$("#alreadySubscribedText").text("This feature is not enabled in this version");
	},

	"click #createMenuEvent2":function(e){
		e.preventDefault();
		$("#alreadySubscribed").modal({
						backdrop: 'static',keyboard:false
		});
		$("#alreadySubscribedText").text("This feature is not enabled in this version");
	},
	/*
	 * onClick of cancel button of create events
	 * if the response from meteor method is true,
	 * check the previous location path,
	 * if it is undefined go to myEvents
	 * else to previous path from where create events is called.
	 */
	"click #cancelMenu": function() {
		if (Session.get("previousLocationPath") !== undefined) {
			var previousPath = Session.get("previousLocationPath");
			Session.set("previousLocationPath", undefined);
			Session.set("previousLocationPath", null);
			Router.go(previousPath);
		} else {
			Router.go("/myEvents");
		}

	},
	'click #aYesButton': function(e) {
		e.preventDefault();
		$("#alreadySubscribed").modal('hide');
	},
	'click #setSubscribeDOB':function(e){
		e.preventDefault();
		$("#subscriptionDOBRen").empty()
		Blaze.render(Template.subscriptionDOB, $("#subscriptionDOBRen")[0]);
		$("#subscriptionDOB").modal({
			backdrop: 'static',
			keyboard:false
		});
	}
});

Template.subscriptionDOB.helpers({
	lTourns: function() {
		var lProjectNames = tournamentEvents.find().fetch();
		if (lProjectNames) {
			return lProjectNames;
		}
	},
	leventLists:function(){
		var lEventNames = tournamentEvents.find({"_id":Session.get("getEventListForSelectedTorun")}).fetch();
		if(lEventNames){
			return lEventNames
		}
	}
});

Template.selectedEventsCategories.helpers({
	leventLists:function(){
		var lEventNames = tournamentEvents.find({"_id":Session.get("getEventListForSelectedTorun")}).fetch();
		if(lEventNames){
			return lEventNames
		}
	}
});

Template.selectedEventsCategories.events({
	'submit form': function(e) {
		e.preventDefault();
	},
	"keyup .setDOB_Input":function(e){
		e.preventDefault();
		$(e.target).css("color","black");
		Session.set("errorsValid",0)
	},
	"click #noAddEvents":function(e){
		$("#subscriptionDOB").modal('hide')
	}
});

Template.subscriptionDOB.events({
	'click #changeOfTourn': function(e) {
		e.preventDefault();
        $('#changeOfTourn').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var eventName = obj.val();
                $("#eveDomProvideDetails").html("")
				Session.set("getEventListForSelectedTorun",eventName);
				$("#renderselectedEventsCategories").empty()
				Blaze.render(Template.selectedEventsCategories, $("#renderselectedEventsCategories")[0]);
            }, 0);
        });
    },
	'submit form': function(e) {
		e.preventDefault();
	},
	"click #noAddEventsaA":function(e){
		$("#subscriptionDOB").modal('hide')
	}
});

Template.registerHelper('savedDOBRender_old', function(data) {
  //if team event selected array is not undefined
  //get the list of selected event and team
  //if data(team id) coming from html template is inside the list
  //return checked to the check box
  if (Session.get("getEventListForSelectedTorun") != undefined) {
    var selectedSport = Session.get("getEventListForSelectedTorun");
    try{
	    var eventOrganizer = Meteor.user()._id;
	    var find  = dobFilterSubscribe.findOne({
				eventOrganizer:eventOrganizer.toString(),
				mainProjectId:selectedSport.toString()
		});
		if(find&&find.details){
			for(var i=0;i<find.details.length;i++){
				if(find.details[i].eventId==data){
					return find.details[i].dateOfBirth
					break;
				}
			}
		}
		else return "";
	}catch(e){}
  }
  else return "";
});

Template.registerHelper('savedRankingRender_old', function(data) {
  //if team event selected array is not undefined
  //get the list of selected event and team
  //if data(team id) coming from html template is inside the list
  //return checked to the check box
  if (Session.get("getEventListForSelectedTorun") != undefined) {
    var selectedSport = Session.get("getEventListForSelectedTorun");
    try{
	    var eventOrganizer = Meteor.user()._id;
	    var find  = dobFilterSubscribe.findOne({
				eventOrganizer:eventOrganizer.toString(),
				mainProjectId:selectedSport.toString()
		});
		if(find&&find.details){
			for(var i=0;i<find.details.length;i++){
				if(find.details[i].eventId==data){
					return find.details[i].ranking
					break;
				}
			}
		}
		else return "";
	}catch(e){}
  }
  else return "";
});