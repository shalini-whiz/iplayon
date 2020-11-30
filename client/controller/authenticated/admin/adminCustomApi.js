Template.adminCustomAPI.onCreated(function() {
    this.subscribe("authAddress");
    //this.subscribe("users");
    this.subscribe("customDataDBPub");
});

Template.adminCustomAPI.onRendered(function() {

});


Template.adminCustomAPI.helpers({
    "notAdmin": function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = false;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
});

Template.adminCustomAPI.events({
	"change #adminSelectionType":function(e)
	{
 		var selectionType = $("#adminSelectionType").val();
		$("#managerLinkedInModalContent").css("display", "none");
		//liveLinkContent
		if(selectionType == "tourFinance")
		{
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.tourFinanceContent, $("#adminRenderOnFunction")[0]);
		}
		else if(selectionType == "regValidity")
		{
			//regValidityContent
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.regValidityContent, $("#adminRenderOnFunction")[0]);
		}
		else if(selectionType == "teamSchedule")
		{
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.teamScheduleContent, $("#adminRenderOnFunction")[0]);
		}
		else if(selectionType == "eventSchedule")
		{
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.eventScheduleContent, $("#adminRenderOnFunction")[0]);
		}

		else if(selectionType == "teamPoints")
		{
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.teamPointsContent, $("#adminRenderOnFunction")[0]);
		}
		if(selectionType == "liveLinks")
		{
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.liveLinkContent, $("#adminRenderOnFunction")[0]);
		}
 		if(selectionType == "expertise")
 		{
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.expertiseContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "languages")
 		{
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.languageContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "certification")
 		{
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.certificationContent, $("#adminRenderOnFunction")[0]);
 			$("#managerLinkedInModalContent").style("display","");
 		}
 		else if(selectionType == "manageApiUsers")
 		{
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.manageUsersContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "manageLinkedInToken")
 		{
 			$("#adminRenderOnFunction").empty();
 			$("#managerLinkedInModalContent").css("display", "block");
 		}
 		else if(selectionType == "customData")
 		{
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.customDataContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "addAccountType")
 		{
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.addAccountTypeModalContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "removeAccountType")
 		{		
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.removeAccountTypeModalContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "addNI")
 		{		
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.addNIModalContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "removeNI")
 		{		
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.removeNIModalContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "removePoints")
 		{		
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.removePointsModalContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "workAss")
 		{		
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.workAssignmentContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "messageAction")
 		{		
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.messagesDataContent, $("#adminRenderOnFunction")[0]);
 		}
		else if(selectionType == "connectionUsersAction")
 		{		
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.connectionDataContent, $("#adminRenderOnFunction")[0]);
 		}

 		else if(selectionType == "viewRROrder")
 		{
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.RROrderContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "viewSchoolDetails")
 		{
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.schoolDetailContent, $("#adminRenderOnFunction")[0]);
 		}
 		else if(selectionType == "viewFitBitUsers")
 		{
 			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.fitBitUserContent, $("#adminRenderOnFunction")[0]);
 		}

 		

 		
	},
	"click #linkedInAccessToken":function(e)
	{
		var x = customDataDB.find({}).fetch();
		$("#managerApiUsersModalContent").empty();
		Blaze.render(Template.editLinkedInTokenModal, $("#linkedInModalContent")[0]);
		$("#editLinkedInTokenModal").modal({
			backdrop: 'static',
			keyboard: false
		});
		
	}
});

Template.editLinkedInTokenModal.helpers({

	"dataExists":function(){

		var dataExists = customDataDB.findOne({"type":"linkedInKeys"});
		if(dataExists)
			return dataExists;
	},

})

Template.editLinkedInTokenModal.events({
	"click #updateLinkedInKeys":function(e)
	{
		try{
			if($("#linkedInTokenVal").val().trim().length > 0)
			{
				var linkedInJson = {}
				linkedInJson["customValue"] = $("#linkedInTokenVal").val().trim();
				Meteor.call("setLinkedInKeys",linkedInJson,function(error,result)
				{
					if(result)
						alert(result)
				})

				$("#editLinkedInTokenModal").empty();
                $( '.modal-backdrop' ).remove();

			}
			else
			{
				alert("Please enter linkedin access token value");
			}

		}catch(e){

		}
	}
})
/******************** api users related *********************/


Template.manageUsersContent.onCreated(function() {
    this.subscribe("apiUsersPub");
    this.subscribe("apiUsersListPub");
});

Template.editApiUserModal.helpers({

	"apiUserExist":function()
	{
		var apiInfo = apiUsers.findOne({"_id":Session.get("apiUserID")});
		if(apiInfo)
			return apiInfo;
	}

})


Template.editApiUserModal.events({
	"click #modifyAPIInfo":function(e){

		if($("#pageToken").val().trim().length > 0 || 
			//$("#linkedInToken").val().trim().length > 0 ||
			$("#twitConsumer_key").val().trim().length > 0 ||
				$("#twitConsumer_secret").val().trim().length > 0 ||
				$("#twitAccess_token_key").val().trim().length > 0 ||
				$("#twitAccess_token_secret").val().trim().length > 0 ||
$("#linkedInCompanyId").val().trim().length > 0 
//$("#linkedInAccessToken").val().trim().length > 0


			)
		{
			var validCheck = true;
			var linkedInCheck = true;
			var data = {};
			data["pageToken"] = $("#pageToken").val().trim();
			data["id"] = Session.get("apiUserID");
			if($("#linkedInCompanyId").val().trim().length > 0 )
			{
				
				var linkedInJson = {};
				linkedInJson["companyId"] = $("#linkedInCompanyId").val().trim();
				//linkedInJson["accessToken"] = $("#linkedInAccessToken").val().trim();
				data["linkedInKeys"] = linkedInJson;
				
				
			}

			//if($("#linkedInToken").val().trim().length > 0 )
				//data["linkedInToken"] = $("#linkedInToken").val().trim()


			if($("#twitConsumer_key").val().trim().length > 0 ||
				$("#twitConsumer_secret").val().trim().length > 0 ||
				$("#twitAccess_token_key").val().trim().length > 0 ||
				$("#twitAccess_token_secret").val().trim().length > 0 )
			{

				if($("#twitConsumer_key").val().trim().length > 0 &&
				$("#twitConsumer_secret").val().trim().length > 0 &&
				$("#twitAccess_token_key").val().trim().length > 0 &&
				$("#twitAccess_token_secret").val().trim().length > 0 )	
				{

					var twitterJson = {};
					twitterJson["consumer_key"] = $("#twitConsumer_key").val().trim();
					twitterJson["consumer_secret"] = $("#twitConsumer_secret").val().trim();
					twitterJson["access_token_key"] = $("#twitAccess_token_key").val().trim();
					twitterJson["access_token_secret"] = $("#twitAccess_token_secret").val().trim();
					data["twitterKeys"] = twitterJson;
				}	
				else
				{
					validCheck = false;
				}	

			}
			if($("#siteImg").val().trim().length > 0)
				data["siteImg"] = $("#siteImg").val().trim();


			if(validCheck && linkedInCheck)
			{
				$("#apiUserImpMsg").text("");
				Meteor.call("updatePageToken",data,function(error,result){
						if(result){
							alert(result);
							$("#managerApiUsersModalContent").empty();
	                        $( '.modal-backdrop' ).remove();
						}
						else
							alert(error);
				})
			}
			else
			{
				$("#apiUserImpMsg").text("Please enter twitter/linkedin keys");

			}

			
		}
		else
		{
			$("#apiUserImpMsg").text("Please enter details");

		}


	}
})

Template.manageUsersContent.helpers({
	"apiUsersList":function()
	{
		var expertiseList = apiUsers.find({}).fetch();
		return expertiseList;
	}
})

Template.manageUsersContent.events({
	
	"click #editApiUser":function(e)
	{
		$("#managerApiUsersModalContent").empty();
    	Session.set("apiUserID",this._id);
		Blaze.render(Template.editApiUserModal, $("#managerApiUsersModalContent")[0]);
		$("#editApiUserModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #deleteApiUser":function(e)
	{
		Meteor.call("deleteApiUser",this._id,function(error,result)
		{
			if(result)	
				alert(result);	
			else
				alert(error);
		})
	}
})


  Template.registerHelper("getUserName_Admin",function(data){
    if(data){
      var userInfo = Meteor.users.findOne({"_id":data});
      if(userInfo && userInfo.userName)
      	return userInfo.userName;
      else
      	return data
    }
  })


  Template.registerHelper("fetchTourName",function(data){
    if(data){
    	alert(data)
      var tourInfo = events.findOne({"_id":data});
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
    }
  })



/************************ Team Schedule ********************************/

Template.tourFinanceContent.onCreated(function(){
	this.subscribe("upcomingEventsNamePub");
})

Template.tourFinanceContent.helpers({
	"tourFinanceList":function()
	{
		var eventList = events.find({tournamentEvent:true}).fetch();
		return eventList;
	},
	"fetchTour":function(data)
	{
		var tourInfo = events.findOne({"_id":data});
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
	},

})

Template.tourFinanceContent.events({
	"click #setTourFinance":function()
	{
		Meteor.call("adminTourFinanceStatus",this,function(err,result){
			if(result)
				displayMessage("Tournament Finance status updated");
			else
				displayMessage(err)
		})
	}
})
Template.teamScheduleContent.onCreated(function(){

	this.subscribe("tourTeamSchedulePub");
	this.subscribe("upcomingEventsNamePub");
	Session.set("teamScheduleID",undefined);
	this.subscribe("teamListPub");

})


Template.teamScheduleContent.helpers({
	"teamScheduleList":function()
	{
		var teamScheduleList = tourTeamSchedule.find({}).fetch();
		return teamScheduleList;
	},
	"fetchTeam":function(userId){
		var teamInfo = playerTeams.findOne({"_id":userId});
		if(teamInfo)
			return teamInfo.teamName;
	},

	"fetchTour":function(data)
	{
		var tourInfo = events.findOne({"_id":data});
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
	},
})


Template.teamScheduleContent.events({
	"click #addTourTeamSchedule":function(e)
	{
		$("#teamScheduleModalContent").empty();
    	Session.set("teamScheduleID",undefined);

		Blaze.render(Template.createTeamScheduleModal, $("#teamScheduleModalContent")[0]);
		$("#createTeamScheduleModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editTourTeamSchedule":function(e)
	{
		$("#teamScheduleModalContent").empty();
    	Session.set("teamScheduleID",this._id);


		Blaze.render(Template.createTeamScheduleModal, $("#teamScheduleModalContent")[0]);
		$("#createTeamScheduleModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #delTourTeamSchedule":function(e){

		try{

			Meteor.call("deleteTeamSchedule",this._id,function(error,result)
			{
				if(result)	
					alert(result);	
				else
					alert(error);
			})
	
		}catch(e){

		}
	}
})


Template.createTeamScheduleModal.onCreated(function(){


})
Template.createTeamScheduleModal.helpers({

	"tourList":function(data){
		var tourList = events.find({"tournamentEvent":true}).fetch();
		return tourList;
	},
	"fetchTour":function(data)
	{
		var tourInfo = events.findOne({"_id":data});
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
	},
	"teamScheduleExist":function()
	{
		if(Session.get("teamScheduleID") != undefined)
		{
			var teamPointExist = tourTeamSchedule.findOne({"_id":Session.get("teamScheduleID")});
			if(teamPointExist)
				return teamPointExist
		}
	},
	"setTour":function(data){
		if(Session.get("teamPointID") != undefined)
		{
			var teamPointExist = tourTeamSchedule.findOne({"_id":Session.get("teamScheduleID")});
			if(teamPointExist && teamPointExist.tournamentId)
			{
				if(teamPointExist.tournamentId == data) return "selected"
			}
		}
	},
	"teamList":function(){
		var teamList = playerTeams.find({}).fetch();
		return teamList;
	},
	"setTeam":function(teamId,type){
		if(Session.get("teamScheduleID") != undefined)
		{
			var scheduleInfo = tourTeamSchedule.findOne({"_id":Session.get("teamScheduleID")});
			if(scheduleInfo)
			{
				if(type=="teamA" && scheduleInfo.teamAId == teamId)
					return "selected";
				else if(type == "teamB" && scheduleInfo.teamBId == teamId)
					return "selected";
				
			}
		}
	},
	
	"teamAList":function(){
		if(Session.get("teamScheduleID") != undefined)
		{
			var scheduleInfo = tourTeamSchedule.findOne({"_id":Session.get("teamScheduleID")});
			if(scheduleInfo)
			{
				var teamList = playerTeams.find({"_id":scheduleInfo.teamAId}).fetch()
				return teamList
			}
		}
		else
		{
			var teamList = playerTeams.find({}).fetch();
			return teamList;
		}
	},
	"teamBList":function(){
		if(Session.get("teamScheduleID") != undefined)
		{
			var scheduleInfo = tourTeamSchedule.findOne({"_id":Session.get("teamScheduleID")});
			if(scheduleInfo)
			{
				var teamList = playerTeams.find({"_id":scheduleInfo.teamBId}).fetch()
				return teamList
			}
		}
		else
		{
			var teamList = playerTeams.find({}).fetch();
			return teamList;
		}
	},

})

Template.createTeamScheduleModal.events({

	"click #createTeamSchedule":function(e)
	{
		try{
			var tableNo = parseInt($("#tableNo").val().trim());

			$("#tableNo").val(parseInt(tableNo));

			if($("#tournamentId").val() != null && $("#tournamentId").val() != undefined &&
			$("#scheduleDate").val() != null && $("#scheduleDate").val() != undefined && 			
			$("#teamAId").val() != null && $("#teamAId").val() != undefined && 
			$("#teamBId").val() != null && $("#teamBId").val() != undefined && 
			$("#startTime").val() != null && $("#startTime").val() != undefined && 
			$("#startTime").val().length > 0 &&
			$("#endTime").val() != null && $("#endTime").val() != undefined && 
			$("#endTime").val().length > 0 &&
			$("#tableNo").val() != null && $("#tableNo").val() != undefined && 
			$("#tableNo").val().length > 0 && $("#tableNo").val() != "NaN" )
			{

				var dateCheck = false;
				var tableNo = parseInt($("#tableNo").val().trim());
				var teamAId = $("#teamAId").val().trim();
				var teamBId = $("#teamBId").val().trim()

				var text = $('#scheduleDate').val().trim();
				var comp = text.split(" ");
				if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
				{
					var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
					var comp2 = comp[1].toLowerCase();
					var monthNum = parseInt(months.indexOf(comp2)+1);
					var d = parseInt(comp[0]);
					var m = parseInt(monthNum);
					var y = parseInt(comp[2]);
					var date = new Date(y,m-1,d);
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d && y.toString().length == 4) 
					{
						   dateCheck = true;
					} 
				}
				if(dateCheck == true && (typeof tableNo == "number") && (teamAId != teamBId))
				{
				
					var paramData = {};
					paramData["tournamentId"] = $("#tournamentId").val().trim();
					paramData["scheduleDate"] = $("#scheduleDate").val().trim();
					paramData["teamAId"] = $("#teamAId").val().trim();
					paramData["teamBId"] = $("#teamBId").val().trim();
					paramData["startTime"] = $("#startTime").val().trim();
					paramData["endTime"] = $("#endTime").val().trim();
					paramData["tableNo"] = $("#tableNo").val().trim();
					paramData["type"] = "create"


					Meteor.call("createTeamSchedule",paramData,function(error,result){
						if(result)
						{
							if(result.message)
								displayMessage(result.message);
							$("#teamScheduleModalContent").empty();
		                    $( '.modal-backdrop' ).remove();
						}
						else
						{
							displayMessage(error)
						}
					});


				}
				else
				{
					$("#teamScheduleImpMsg").text("Please enter valid tournament/teams/time/date/tableNo");		

				}
			}

			else
			{
				$("#teamScheduleImpMsg").text("Please enter valid tournament/teams/time/date/tableNo");
			}
		}catch(e){
			alert(e)
		}
	},
	"click #modifyTeamSchedule":function(e)
	{
		try{

				var tableNo = parseInt($("#tableNo").val().trim());

			$("#tableNo").val(parseInt(tableNo));
		

			if($("#tournamentId").val() != null && $("#tournamentId").val() != undefined &&
			$("#scheduleDate").val() != null && $("#scheduleDate").val() != undefined && 			
			$("#teamAId").val() != null && $("#teamAId").val() != undefined && 
			$("#teamBId").val() != null && $("#teamBId").val() != undefined && 
			$("#startTime").val() != null && $("#startTime").val() != undefined && 
			$("#startTime").val().length > 0 &&
			$("#endTime").val() != null && $("#endTime").val() != undefined && 
			$("#endTime").val().length > 0 &&
			$("#tableNo").val() != null && $("#tableNo").val() != undefined && 
			$("#tableNo").val().length > 0 && $("#tableNo").val() != "NaN" )
			{

				var dateCheck = false;
				var tableNo = parseInt($("#tableNo").val().trim());
				var teamAId = $("#teamAId").val().trim();
				var teamBId = $("#teamBId").val().trim()

				var text = $('#scheduleDate').val().trim();
				var comp = text.split(" ");
				if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
				{
					var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
					var comp2 = comp[1].toLowerCase();
					var monthNum = parseInt(months.indexOf(comp2)+1);
					var d = parseInt(comp[0]);
					var m = parseInt(monthNum);
					var y = parseInt(comp[2]);
					var date = new Date(y,m-1,d);
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d && y.toString().length == 4) 
					{
						   dateCheck = true;
					} 
				}
				if(dateCheck == true && (typeof tableNo == "number") && (teamAId != teamBId))
				{
				
					var paramData = {};
					paramData["_id"]= Session.get("teamScheduleID");
					paramData["tournamentId"] = $("#tournamentId").val().trim();
					paramData["scheduleDate"] = $("#scheduleDate").val().trim();
					paramData["teamAId"] = $("#teamAId").val().trim();
					paramData["teamBId"] = $("#teamBId").val().trim();
					paramData["startTime"] = $("#startTime").val().trim();
					paramData["endTime"] = $("#endTime").val().trim();
					paramData["tableNo"] = $("#tableNo").val().trim();
					paramData["type"] = "modify"


					Meteor.call("createTeamSchedule",paramData,function(error,result){
						if(result)
						{
							if(result.message)
								displayMessage(result.message);
							$("#teamScheduleModalContent").empty();
		                    $( '.modal-backdrop' ).remove();
						}
						else
						{
							displayMessage(error)
						}
					});


				}
				else
				{
					$("#teamScheduleImpMsg").text("Please enter valid tournament/teams/time/date/tableNo");		

				}
			}

			else
			{
				$("#teamScheduleImpMsg").text("Please enter valid tournament/teams/time/date/tableNo");
			}
		}catch(e){
			alert(e)
		}
	},


})




/******************************* Event Schedule starts here*****************/


Template.eventScheduleContent.onCreated(function(){

	this.subscribe("eventSchedulePub");
	this.subscribe("upcomingEventsNamePub");
	Session.set("eventScheduleID",undefined);

})


Template.eventScheduleContent.helpers({
	"eventScheduleList":function()
	{
		var eventScheduleList = eventSchedule.find({}).fetch();
		return eventScheduleList;
	},
	"fetchTour":function(data)
	{
		
		var tourInfo = events.findOne({"_id":data});
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
	},

})


Template.eventScheduleContent.events({
	"click #addEventSchedule":function(e)
	{
		$("#eventScheduleModalContent").empty();
    	Session.set("eventScheduleID",undefined);

		Blaze.render(Template.createEventScheduleModal, $("#eventScheduleModalContent")[0]);
		$("#createEventScheduleModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editEventSchedule":function(e)
	{
		$("#eventScheduleModalContent").empty();
    	Session.set("eventScheduleID",this._id);


		Blaze.render(Template.createEventScheduleModal, $("#eventScheduleModalContent")[0]);
		$("#createEventScheduleModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #delEventSchedule":function(e){

		try{

			Meteor.call("deleteEventSchedule",this._id,function(error,result)
			{
				if(result)	
					alert(result);	
				else
					alert(error);
			})
	
		}catch(e){

		}
	}
})


Template.createEventScheduleModal.onCreated(function(){
	Session.set("tourScheduleID",undefined);
	var self = this;
	self.autorun(function () {
	   self.subscribe("tournamentCategories", Session.get("tourScheduleID"));
	});

})
Template.createEventScheduleModal.helpers({

	"tourList":function(data){
		var tourList = events.find({"tournamentEvent":true}).fetch();
		return tourList;
	},
	"eventList":function(data){
		if(Session.get("tourScheduleID") != undefined)
		{
			var eventList = events.find({"tournamentEvent":false,"tournamentId":Session.get("tourScheduleID")}).fetch();
			return eventList
		}
	},
	"fetchTour":function(data)
	{
		var tourInfo = events.findOne({"_id":data});
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
	},
	"eventScheduleExist":function()
	{
		if(Session.get("eventScheduleID") != undefined)
		{
			var eventScheduleExist = eventSchedule.findOne({"_id":Session.get("eventScheduleID")});
			if(eventScheduleExist)
				return eventScheduleExist
		}
	},
	"setTour":function(data){
		if(Session.get("teamPointID") != undefined)
		{
			var eventScheduleExist = eventSchedule.findOne({"_id":Session.get("eventScheduleID")});
			if(eventScheduleExist && eventScheduleExist.tournamentId)
			{
				if(eventScheduleExist.tournamentId == data) return "selected"
			}
		}
	},
	

})

Template.createEventScheduleModal.events({
	"change #tournamentId":function(e)
	{
 		var tourVal = $("#tournamentId").val();
		Session.set("tourScheduleID",tourVal);
	},

	"click #createEventSchedule":function(e)
	{
		try{
		
			if($("#tournamentId").val() != null && $("#tournamentId").val() != undefined &&
				$("#eventName").val() != null && $("#eventName").val() != undefined &&
				$("#scheduleDate").val() != null && $("#scheduleDate").val() != undefined && 			
				$("#startTime").val() != null && $("#startTime").val() != undefined && 
				$("#startTime").val().length > 0 &&
				$("#endTime").val() != null && $("#endTime").val() != undefined && 
				$("#endTime").val().length > 0 &&
			$("#roundNo").val() != null && $("#roundNo").val() != undefined && 
			$("#roundNo").val().length > 0 )
			{

				var dateCheck = false;
				var text = $('#scheduleDate').val().trim();
				var comp = text.split(" ");
				if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
				{
					var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
					var comp2 = comp[1].toLowerCase();
					var monthNum = parseInt(months.indexOf(comp2)+1);
					var d = parseInt(comp[0]);
					var m = parseInt(monthNum);
					var y = parseInt(comp[2]);
					var date = new Date(y,m-1,d);
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d && y.toString().length == 4) 
					{
						   dateCheck = true;
					} 
				}
				if(dateCheck == true)
				{
				
					var paramData = {};
					paramData["tournamentId"] = $("#tournamentId").val().trim();
					paramData["eventName"] = $("#eventName").val().trim();
					paramData["scheduleDate"] = $("#scheduleDate").val().trim();
					paramData["startTime"] = $("#startTime").val().trim();
					paramData["endTime"] = $("#endTime").val().trim();
					paramData["roundNo"] = $("#roundNo").val().trim();
					paramData["type"] = "create"


					Meteor.call("createEventSchedule",paramData,function(error,result){
						if(result)
						{
							if(result.message)
								displayMessage(result.message);
							$("#eventScheduleModalContent").empty();
		                    $( '.modal-backdrop' ).remove();
						}
						else
						{
							displayMessage(error)
						}
					});


				}
				else
				{
					$("#eventScheduleImpMsg").text("Please enter valid tournament/eventName/time/date/roundNo");		

				}
			}

			else
			{
				$("#eventScheduleImpMsg").text("Please enter valid tournament/eventName/time/date/roundNo");
			}
		}catch(e){
			alert(e)
		}
	},
	"click #modifyEventSchedule":function(e)
	{
		try{


		

			if($("#tournamentId").val() != null && $("#tournamentId").val() != undefined &&
			$("#eventName").val() != null && $("#eventName").val() != undefined &&

			$("#scheduleDate").val() != null && $("#scheduleDate").val() != undefined && 			
			$("#startTime").val() != null && $("#startTime").val() != undefined && 
			$("#startTime").val().length > 0 &&
			$("#endTime").val() != null && $("#endTime").val() != undefined && 
			$("#endTime").val().length > 0 &&
			$("#roundNo").val() != null && $("#roundNo").val() != undefined && 
			$("#roundNo").val().length > 0 )
			{

				var dateCheck = false;

				var text = $('#scheduleDate').val().trim();
				var comp = text.split(" ");
				if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
				{
					var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
					var comp2 = comp[1].toLowerCase();
					var monthNum = parseInt(months.indexOf(comp2)+1);
					var d = parseInt(comp[0]);
					var m = parseInt(monthNum);
					var y = parseInt(comp[2]);
					var date = new Date(y,m-1,d);
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d && y.toString().length == 4) 
					{
						   dateCheck = true;
					} 
				}
				if(dateCheck == true)
				{
				
					var paramData = {};
					paramData["_id"]= Session.get("eventScheduleID");
					paramData["tournamentId"] = $("#tournamentId").val().trim();
					paramData["eventName"] = $("#eventName").val().trim();
					paramData["scheduleDate"] = $("#scheduleDate").val().trim();
					paramData["startTime"] = $("#startTime").val().trim();
					paramData["endTime"] = $("#endTime").val().trim();
					paramData["roundNo"] = $("#roundNo").val().trim();
					paramData["type"] = "modify"


					Meteor.call("createEventSchedule",paramData,function(error,result){
						if(result)
						{
							if(result.message)
								displayMessage(result.message);
							$("#eventScheduleModalContent").empty();
		                    $( '.modal-backdrop' ).remove();
						}
						else
						{
							displayMessage(error)
						}
					});


				}
				else
				{
					$("#eventScheduleImpMsg").text("Please enter valid tournament/eventName/time/date/tableNo");		

				}
			}

			else
			{
				$("#eventScheduleImpMsg").text("Please enter valid tournament/eventName/time/date/tableNo");
			}
		}catch(e){
			alert(e)
		}
	},


})



/******************************* Event schedule ends here ********************/

















/*************************** ends here **********************************/

/********************  Team Points****************************************/
					
					//teamPointsContent

Template.teamPointsContent.onCreated(function(){

	this.subscribe("teamPointsPub");
	Session.set("teamPointID",undefined);
	this.subscribe("teamListPub");
	this.subscribe("upcomingEventsNamePub");


})


Template.teamPointsContent.helpers({
	"teamPointList":function()
	{
		var teamPointList = teamPoints.find({}).fetch();
		return teamPointList;
	},
	"fetchTeam":function(userId){
		var teamInfo = playerTeams.findOne({"_id":userId});
		if(teamInfo)
			return teamInfo.teamName;
	},
	"fetchTour":function(data)
	{
		var tourInfo = events.findOne({"_id":data});
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
	},

})


Template.teamPointsContent.events({
	"click #addTeamPoints":function(e)
	{
		$("#teamPointsModalContent").empty();
    	Session.set("teamPointID",undefined);

		Blaze.render(Template.createTeamPointsModal, $("#teamPointsModalContent")[0]);
		$("#createTeamPointsModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editTeamPoints":function(e)
	{
		$("#teamPointsModalContent").empty();
    	Session.set("teamPointID",this._id);


		Blaze.render(Template.createTeamPointsModal, $("#teamPointsModalContent")[0]);
		$("#createTeamPointsModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #delTeamPoints":function(e){

		try{

			Meteor.call("deleteTeamPoints",this._id,function(error,result)
			{
				if(result)	
					alert(result);	
				else
					alert(error);
			})
	
		}catch(e){

		}
	}
})


Template.createTeamPointsModal.onCreated(function(){


})
Template.createTeamPointsModal.helpers({

	"tourList":function(data){
		var tourList = events.find({"tournamentEvent":true}).fetch();
		return tourList;
	},
	"fetchTour":function(data)
	{
		var tourInfo = events.findOne({"_id":data});
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
	},
	"teamPointExist":function()
	{
		if(Session.get("teamPointID") != undefined)
		{
			var teamPointExist = teamPoints.findOne({"_id":Session.get("teamPointID")});
			if(teamPointExist)
				return teamPointExist
		}
	},
	
	"teamList":function(){
		if(Session.get("teamPointID") != undefined)
		{
			var teamPointInfo = teamPoints.findOne({"_id":Session.get("teamPointID")});
			if(teamPointInfo)
			{
				var teamList = playerTeams.find({"_id":teamPointInfo.teamId}).fetch()
				return teamList
			}
		}
		else
		{
			var teamList = playerTeams.find({}).fetch();
			return teamList;
		}
	},
	"setTour":function(data){
		if(Session.get("teamPointID") != undefined)
		{
			var teamPointInfo = teamPoints.findOne({"_id":Session.get("teamPointID")});
			if(teamPointInfo && teamPointInfo.tournamentId)
			{
				if(teamPointInfo.tournamentId == data) return "selected"
			}
		}
	}

})

Template.createTeamPointsModal.events({

	"click #createTeamPoint":function(e)
	{
		try{

			var year = $("#pointsYear").val();
			$("#pointsYear").val(parseInt(year));
			if($("#tournamentId").val() != null && $("#tournamentId").val() != undefined &&
			 $("#teamName").val() != null && $("#teamName").val() != undefined &&	
			$("#pointsYear").val() != null && $("#pointsYear").val() != undefined && 
			$("#pointsYear").val().length == 4 &&
			$("#matchPlayed").val() != null && $("#matchPlayed").val() != undefined && 
			$("#matchPlayed").val().length > 0 &&

			$("#matchWon").val() != null && $("#matchWon").val() != undefined && 
			$("#matchWon").val().length > 0 &&

			$("#matchLoss").val() != null && $("#matchLoss").val() != undefined && 
			$("#matchLoss").val().length > 0 &&

			$("#matchPoints").val() != null && $("#matchPoints").val() != undefined && 
			$("#matchPoints").val().length > 0 )
			{

				var yearVal = parseInt($("#pointsYear").val());
				var matchPlayed = parseInt($("#matchPlayed").val());
				var matchWon = parseInt($("#matchWon").val());
				var matchLoss = parseInt($("#matchLoss").val());
				var matchPoints = parseInt($("#matchPoints").val());


		
				if((typeof yearVal == "number") && (typeof matchPlayed == "number") &&
					(typeof matchWon == "number") && (typeof matchLoss == "number") &&
					(typeof matchPoints == "number")
				)
				{
					var paramData = {};
					paramData["tournamentId"] = $("#tournamentId").val();
					paramData["teamId"] = $("#teamName").val();
					paramData["year"] = yearVal;
					paramData["played"] = matchPlayed;
					paramData["won"] = matchWon;
					paramData["loss"] = matchLoss;
					paramData["points"] = matchPoints;
					paramData["type"] = "create"
									
					Meteor.call("createTeamPoints",paramData,function(error,result){
						if(result)
						{
							if(result.message)
								displayMessage(result.message);
							$("#teamPointsModalContent").empty();
		                    $( '.modal-backdrop' ).remove();
						}
						else
						{
							displayMessage(error)
						}
					});
				}
				else
				{					
					$("#teamPointsImpMsg").text("Please enter valid year/matches played/won/loss/points");		
				}

			}

			else
			{
				$("#teamPointsImpMsg").text("Please enter valid year/matches played/won/loss/points");
			}
		}catch(e){
		}
	},
	"click #modifyTeamPoint":function(e)
	{
		try{

			var year = $("#pointsYear").val();
			$("#pointsYear").val(parseInt(year));
			if($("#tournamentId").val() != null && $("#tournamentId").val() != undefined &&
			$("#pointsYear").val() != null && $("#pointsYear").val() != undefined && 
			$("#pointsYear").val().length == 4 &&
			$("#matchPlayed").val() != null && $("#matchPlayed").val() != undefined && 
			$("#matchPlayed").val().length > 0 &&

			$("#matchWon").val() != null && $("#matchWon").val() != undefined && 
			$("#matchWon").val().length > 0 &&

			$("#matchLoss").val() != null && $("#matchLoss").val() != undefined && 
			$("#matchLoss").val().length > 0 &&

			$("#matchPoints").val() != null && $("#matchPoints").val() != undefined && 
			$("#matchPoints").val().length > 0 )
			{

				var yearVal = parseInt($("#pointsYear").val());
				var matchPlayed = parseInt($("#matchPlayed").val());
				var matchWon = parseInt($("#matchWon").val());
				var matchLoss = parseInt($("#matchLoss").val());
				var matchPoints = parseInt($("#matchPoints").val());


				if((typeof yearVal == "number") && (typeof matchPlayed == "number") &&
					(typeof matchWon == "number") && (typeof matchLoss == "number") &&
					(typeof matchPoints == "number")
				)
				{
					var paramData = {};
					//paramData["teamId"] = $("#teamName").val();
					paramData["_id"] = Session.get("teamPointID");
					paramData["tournamentId"] = $("#tournamentId").val();
					paramData["year"] = yearVal;
					paramData["played"] = matchPlayed;
					paramData["won"] = matchWon;
					paramData["loss"] = matchLoss;
					paramData["points"] = matchPoints;
					paramData["type"] = "modify"
			
					Meteor.call("createTeamPoints",paramData,function(error,result){
						if(result)
						{
							if(result.message)
								displayMessage(result.message);
							$("#teamPointsModalContent").empty();
		                    $( '.modal-backdrop' ).remove();
						}
						else
						{
							displayMessage(error)
						}
					});
				}
				else
				{					
					$("#teamPointsImpMsg").text("Please enter valid year/matches played/won/loss/points");		
				}

			}

			else
			{
				$("#teamPointsImpMsg").text("Please enter valid year/matches played/won/loss/points");
			}
		}catch(e){
		}
	},


})


/****************** Registration Validity *********************/




Template.regValidityContent.onCreated(function(){

	this.subscribe("registrationValidityPub");
	Session.set("regValiID",undefined);
	this.subscribe("associationDetails");


})


Template.regValidityContent.helpers({
	"regValidList":function()
	{
		var regValidList = registrationValidity.find({}).fetch();
		return regValidList;
	},
	"fetchAssoc":function(userId){
		var assocInfo = associationDetails.findOne({"userId":userId});
		if(assocInfo)
			return assocInfo.associationName;
	}
})


Template.regValidityContent.events({
	"click #addRegValidity":function(e)
	{
		$("#regValidityModalContent").empty();
    	Session.set("regValiID",undefined);

		Blaze.render(Template.createRegValidModal, $("#regValidityModalContent")[0]);
		$("#createRegValidModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editRegValid":function(e)
	{
		$("#regValidityModalContent").empty();
    	Session.set("regValiID",this._id);

		Blaze.render(Template.createRegValidModal, $("#regValidityModalContent")[0]);
		$("#createRegValidModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #delRegValid":function(e){

		try{

			Meteor.call("deleteRegValidity",this._id,function(error,result)
			{
				if(result)	
					alert(result);	
				else
					alert(error);
			})
	
		}catch(e){

		}
	}
})


Template.createRegValidModal.onCreated(function(){


})
Template.createRegValidModal.helpers({

	"regValidExist":function()
	{
		if(Session.get("regValiID") != undefined)
		{
			var regValidExist = registrationValidity.findOne({"_id":Session.get("regValiID")});
			if(regValidExist)
				return regValidExist
		}
	},
	
	"assocList":function(){
		if(Session.get("regValiID") != undefined)
		{
			var validityInfo = registrationValidity.findOne({"_id":Session.get("regValiID")});
			if(validityInfo)
			{
				var assocList = associationDetails.find({"userId":validityInfo.userId}).fetch()
				return assocList
			}
			
		}
		else
		{
			var assocList = associationDetails.find({}).fetch();
			return assocList;
		}
	},

})

Template.createRegValidModal.events({

	"click #createRegValid":function(e)
	{
		try{

			var year = $("#validYear").val();
			$("#validYear").val(parseInt(year));
			if($("#assocUser").val() != null && $("#assocUser").val() != undefined &&	
			$("#validYear").val() != null && $("#validYear").val() != undefined &&
			 $("#validYear").val().length == 4 &&
			$("#validity").val() != null && $("#validity").val() != undefined && 

			$("#validity").val().length > 0 )
			{

				var yearVal = parseInt($("#validYear").val());


				var dateCheck = false;

				var text = $('#validity').val().trim();
				var comp = text.split(" ");
				if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
				{
					var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
					var comp2 = comp[1].toLowerCase();
					var monthNum = parseInt(months.indexOf(comp2)+1);
					var d = parseInt(comp[0]);
					var m = parseInt(monthNum);
					var y = parseInt(comp[2]);
					var date = new Date(y,m-1,d);
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d && y.toString().length == 4) {
						   dateCheck = true;
					} 
				}
				
				if(dateCheck && (typeof yearVal == "number"))
				{
					var paramData = {};
					paramData["userId"] = $("#assocUser").val();
					paramData["year"] = $("#validYear").val();
					paramData["validity"] = $("#validity").val();
					paramData["type"] = "create"
									
					Meteor.call("createRegValidity",paramData,function(error,result){
						if(result)
						{
							if(result.message)
								displayMessage(result.message);
							$("#regValidityModalContent").empty();
		                    $( '.modal-backdrop' ).remove();
						}
						else
						{
							displayMessage(error)
						}
					});
				}
				else
				{
					if(dateCheck == false && isNaN(yearVal))
					{
						$("#regValidImpMsg").text("Please enter valid year and valid date in the format DD MMM YYYY");
					}
					else if(isNaN(yearVal))
					{
						//displayMessage("Please enter valid year");
						$("#regValidImpMsg").text("Please enter valid year");
					}
					else if(dateCheck == false)
					{
						//displayMessage("Please enter the date in DD MMM YYYY");
						$("#regValidImpMsg").text("Please enter the date in DD MMM YYYY");
					}
					
				}

			}

			else
			{
				$("#regValidImpMsg").text("Please enter valid year and valid date in the format DD MMM YYYY");
			}
		}catch(e){
		}
	},
	"click #modifyRegValid":function(e)
	{
		try{

			var year = $("#validYear").val();
			$("#validYear").val(parseInt(year));
			if($("#validYear").val() != null && $("#validYear").val() != undefined && $("#validYear").val().length == 4 &&
			$("#validity").val() != null && $("#validity").val() != undefined && 

			$("#validity").val().length > 0 )
			{

				var yearVal = parseInt($("#validYear").val());

				var dateCheck = false;

				var text = $('#validity').val().trim();
				var comp = text.split(" ");
				if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
				{
					var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
					var comp2 = comp[1].toLowerCase();
					var monthNum = parseInt(months.indexOf(comp2)+1);
					var d = parseInt(comp[0]);
					var m = parseInt(monthNum);
					var y = parseInt(comp[2]);
					var date = new Date(y,m-1,d);
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d && y.toString().length == 4) {
						   dateCheck = true;
					} 
				}
				
				if(dateCheck && (typeof yearVal == "number"))
				{
					var paramData = {};
					paramData["_id"] = Session.get("regValiID");
					paramData["year"] = $("#validYear").val();
					paramData["validity"] = $("#validity").val();
					paramData["type"] = "modify"
									
					Meteor.call("createRegValidity",paramData,function(error,result){
						if(result)
						{
							if(result.message)
								displayMessage(result.message);
							$("#regValidityModalContent").empty();
		                    $( '.modal-backdrop' ).remove();
						}
						else
						{
							displayMessage(error)
						}
					});
				}
				else
				{
					if(dateCheck == false && isNaN(yearVal))
					{
						$("#regValidImpMsg").text("Please enter valid year and valid date in the format DD MMM YYYY");
					}
					else if(isNaN(yearVal))
					{
						//displayMessage("Please enter valid year");
						$("#regValidImpMsg").text("Please enter valid year");
					}
					else if(dateCheck == false)
					{
						//displayMessage("Please enter the date in DD MMM YYYY");
						$("#regValidImpMsg").text("Please enter the date in DD MMM YYYY");
					}
					
				}

			}

			else
			{
				$("#regValidImpMsg").text("Please enter valid year and valid date in the format DD MMM YYYY");
			}
		}catch(e){
		}
	},


})



/*************************************************************/
Template.liveLinkContent.onCreated(function(){

	this.subscribe("upcomingEventsPub");
	this.subscribe("pastEventsPub");
	this.subscribe("liveLinksPub");
	Session.set("linkID",undefined);


})

Template.liveLinkContent.helpers({
	"livelinkList":function()
	{
		var liveLinkList = liveLinks.find({}).fetch();
		return liveLinkList;
	},
	"fetchTourName":function(tournamentId)
	{
		var eventInfo = events.findOne({"_id":tournamentId});

		if(tournamentId=="livelinks_11sports_admin"){
			return "livelinks_11sports"
		}
		else if(eventInfo){
			return eventInfo.eventName;
		}
		else
		{
			eventInfo = pastEvents.findOne({"_id":tournamentId});
			if(eventInfo)
				return eventInfo.eventName;
		}
	}
})

Template.liveLinkContent.events({
	"click #addLink":function(e)
	{
		$("#liveLinkModalContent").empty();
		Session.set("linkID",undefined);

		Blaze.render(Template.addLinkModal, $("#liveLinkModalContent")[0]);
		$("#addLinkModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #viewLink":function(e)
	{
		$("#viewliveLinkModalContent").empty();
		Session.set("linkID",this);
		Session.set("tournamentLinkID",this.tournamentId);
		Blaze.render(Template.viewLinkModal, $("#viewliveLinkModalContent")[0]);
		$("#viewLinkModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #deleteLink":function(e)
	{
		$("#removeliveLinkModalContent").empty();
		Session.set("linkID",this);
		Session.set("tournamentLinkID",this.tournamentId);
		Blaze.render(Template.removeLinkModal, $("#removeliveLinkModalContent")[0]);
		$("#removeLinkModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	}
})


Template.addLinkModal.onCreated(function(){

	Session.set("tournamentLinkID",undefined);


})

Template.addLinkModal.helpers({
	"tourExists":function()
	{
		if(Session.get("linkID") != undefined)
		{
			var expertiseExist = expertise.findOne({"_id":Session.get("expertiseID")});
			if(expertiseExist)
				return expertiseExist
		}
	},
	"tourList":function()
	{	var livelinks = [{"_id":"livelinks_11sports","eventName":"livelinks_11sports_admin"}]
		var eupcomingEentList = events.find({}).fetch();
		var pastEventList = pastEvents.find({}).fetch();
		var eventList = eupcomingEentList.concat(pastEventList);
		eventList = eventList.concat(livelinks)
		return eventList;
	},
	"fetchLiveLinks":function()
	{
		var dataExists = liveLinks.findOne({"tournamentId":Session.get("tournamentLinkID")});
		if(dataExists && dataExists.links)
		return dataExists.links;
	}
})

Template.addLinkModal.events({
	
	"change #sportType":function(e)
	{
		if($("#sportType").val() != null && $("#sportType").val() != undefined)
			Session.set("tournamentLinkID",$("#sportType").val());

	},
	"click #addLink":function(e)
	{
		if($("#sportType").val() != null && $("#sportType").val() != undefined &&	
			$("#newLink").val() != null && $("#newLink").val() != undefined && $("#newLink").val().length > 0 &&
			$("#linkTitle").val() != null && $("#linkTitle").val() != undefined && $("#linkTitle").val().length > 0 &&
			//$("#linkDesc").val() != null && $("#linkDesc").val() != undefined && $("#linkDesc").val().length > 0 &&
			$("#linkDate").val() != null && $("#linkDate").val() != undefined && $("#linkDate").val().length > 0 )
		{

			var dateCheck = false;

			var text = $('#linkDate').val().trim();
			var comp = text.split(" ");
			if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
			{
				var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
				var comp2 = comp[1].toLowerCase();
				var monthNum = parseInt(months.indexOf(comp2)+1);
				var d = parseInt(comp[0]);
				var m = parseInt(monthNum);
				var y = parseInt(comp[2]);
				var date = new Date(y,m-1,d);
				if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d && y.toString().length == 4) {
					   dateCheck = true;
				} 
			}
			
			if(dateCheck)
			{

				var paramData = {};
				paramData["tournamentId"] = $("#sportType").val();
				var linkDataJson = {};
				linkDataJson["title"] = $("#linkTitle").val();
				linkDataJson["link"] = $("#newLink").val();
				linkDataJson["linkDate"] = $("#linkDate").val();
				var linkDesc = "";
				if($("#linkDesc").val() != undefined && $("#linkDesc").val() != null)
					linkDesc = $("#linkDesc").val();
				linkDataJson["description"] = linkDesc;
				paramData["livelinks"] =linkDataJson;
				

				Meteor.call("setLiveLink",paramData,function(error,result){
					if(result)
					{
						if(result.message)
							displayMessage(result.message);
						$("#liveLinkModalContent").empty();
                        $( '.modal-backdrop' ).remove();
					}
					else
					{
						displayMessage(error)
					}


				});
			}
			else
			{
				displayMessage("Please enter the date in DD MMM YYYY")
			}


		}
		else
		{
			displayMessage("Please fill mandatory fields");
		}
	}
})

Template.removeLinkModal.helpers({
	
	"fetchTourName":function(tournamentId)
	{
		if(Session.get("tournamentLinkID") != null && Session.get("tournamentLinkID") != undefined)
		{

			var eventInfo = events.findOne({"_id":Session.get("tournamentLinkID")});
			if(eventInfo)
				return eventInfo.eventName;
			else
			{
				eventInfo = pastEvents.findOne({"_id":Session.get("tournamentLinkID")});
				if(eventInfo)
					return eventInfo.eventName;
			}

		}
		
	},

	"fetchLiveLinks":function()
	{
		var dataExists = liveLinks.findOne({"tournamentId":Session.get("tournamentLinkID")});
		if(dataExists && dataExists.links)
		return dataExists.links;
	},

})

Template.removeLinkModal.events({

	"click #deleteLinkData":function(e)
	{
		var paramData = {};
		paramData["tournamentId"] = Session.get("tournamentLinkID");
		paramData["linkData"] = this;
		Meteor.call("removeLiveLink",paramData,function(error,result){
			if(result)
			{
				if(result.message)
					displayMessage(result.message);
				
				$("#removeliveLinkModalContent").empty();
                $( '.modal-backdrop' ).remove();
					
			}
			else
			{
				displayMessage(error)
			}

		})
	}
})


Template.viewLinkModal.helpers({
	
	"fetchTourName":function(tournamentId)
	{
		if(Session.get("tournamentLinkID") != null && Session.get("tournamentLinkID") != undefined)
		{

			var eventInfo = events.findOne({"_id":Session.get("tournamentLinkID")});
			if(eventInfo)
				return eventInfo.eventName;
			else
			{
				eventInfo = pastEvents.findOne({"_id":Session.get("tournamentLinkID")});
				if(eventInfo)
					return eventInfo.eventName;
			}

		}
		
	},

	"fetchLiveLinks":function()
	{
		var dataExists = liveLinks.findOne({"tournamentId":Session.get("tournamentLinkID")});
		if(dataExists && dataExists.links)
		return dataExists.links;
	},

})

/************ expertise related ********************/
Template.expertiseContent.onCreated(function() {
    this.subscribe("expertisePub");
    Session.set("expertiseID",undefined);
});

Template.expertiseContent.helpers({
	"expertiseList":function()
	{
		var expertiseList = expertise.find({}).fetch();
		return expertiseList;
	}
})

Template.expertiseContent.events({
	"click #createExpertise":function(e)
	{
		$("#expertiseModalContent").empty();
    	Session.set("expertiseID",undefined);

		Blaze.render(Template.createExpertiseModal, $("#expertiseModalContent")[0]);
		$("#createExpertiseModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editExpertise":function(e)
	{
		$("#expertiseModalContent").empty();
    	Session.set("expertiseID",this._id);

		Blaze.render(Template.createExpertiseModal, $("#expertiseModalContent")[0]);
		$("#createExpertiseModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #deleteExpertise":function(e)
	{
		Meteor.call("deleteExpertise",this._id,function(error,result)
		{
			if(result)	
				alert(result);	
			else
				alert(error);
		})
	}
})


Template.createExpertiseModal.helpers({
	"expertiseExist":function()
	{
		if(Session.get("expertiseID") != undefined)
		{
			var expertiseExist = expertise.findOne({"_id":Session.get("expertiseID")});
			if(expertiseExist)
				return expertiseExist
		}
	}
})

Template.createExpertiseModal.events({

	"click #createExpertise":function(e)
	{
		try{
			if($("#expertiseName").val().trim().length > 0)
			{
				var data = {};
				data["expertiseName"] = $("#expertiseName").val().trim();
				Meteor.call("createExpertise",data,function(error,result)
				{
					if(result){
						alert(result);
						$("#expertiseModalContent").empty();
                        $( '.modal-backdrop' ).remove();
					}
					else
						alert(error);
				})
			}
			else
			{
				$("#expertiseImpMsg").text("Please enter expertise");
			}
		}catch(e){
		}
	},
	"click #modifyExpertise":function(e)
	{
		if($("#expertiseName").val().trim().length > 0)
		{
			var data = {};
			data["_id"] = Session.get("expertiseID");
			data["expertiseName"] = $("#expertiseName").val().trim();
			Meteor.call("editExpertise",data,function(error,result)
			{
				if(result)
				{
					alert(result);
					$("#expertiseModalContent").empty();
                    $( '.modal-backdrop' ).remove();
				}
				else
					alert(error);
			})
		}
		else
		{
			$("#expertiseImpMsg").text("Please enter expertise");
		}
	}

})

/********************language related ***************/
Template.languageContent.onCreated(function() {
    this.subscribe("languagesPub");
    Session.set("languageID",undefined);
});

Template.languageContent.helpers({
	"languageList":function()
	{
		var languageList = languages.find({}).fetch();
		return languageList;
	}
})

Template.languageContent.events({
	"click #createLanguage":function(e)
	{
		$("#languageModalContent").empty();
    	Session.set("languageID",undefined);

		Blaze.render(Template.languageActionModal, $("#languageModalContent")[0]);
		$("#languageActionModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editLanguage":function(e)
	{
		$("#languageModalContent").empty();
    	Session.set("languageID",this._id);

		Blaze.render(Template.languageActionModal, $("#languageModalContent")[0]);
		$("#languageActionModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #deleteLanguage":function(e)
	{
		Meteor.call("deleteLanguage",this._id,function(error,result)
		{
			if(result)	
				alert(result);	
			else
				alert(error);
		})
	}
})


Template.languageActionModal.helpers({
	"languageExist":function()
	{
		if(Session.get("languageID") != undefined)
		{
			var languageExist = languages.findOne({"_id":Session.get("languageID")});
			if(languageExist)
				return languageExist
		}
	}
})

Template.languageActionModal.events({

	"click #createLanguage":function(e)
	{
		try{
			if($("#languageName").val().trim().length > 0)
			{
				var data = {};
				data["languageName"] = $("#languageName").val().trim();
				Meteor.call("createLanguage",data,function(error,result)
				{
					if(result){
						alert(result);
						$("#languageModalContent").empty();
                        $( '.modal-backdrop' ).remove();
					}
					else
						alert(error);
				})
			}
			else
			{
				$("#languageImpMsg").text("Please enter language");
			}
		}catch(e){
		}
	},
	"click #modifyLanguage":function(e)
	{
		if($("#languageName").val().trim().length > 0)
		{
			var data = {};
			data["_id"] = Session.get("languageID");
			data["languageName"] = $("#languageName").val().trim();
			Meteor.call("editLanguage",data,function(error,result)
			{
				if(result)
				{
					alert(result);
					$("#languageModalContent").empty();
                    $( '.modal-backdrop' ).remove();
				}
				else
					alert(error);
			})
		}
		else
		{
			$("#languageImpMsg").text("Please enter language");
		}
	}

})

/*********** certification related *********************/
Template.certificationContent.onCreated(function() {
	this.subscribe("sportPub");
    this.subscribe("certificationPub");
    Session.set("certificationID",undefined);
});

Template.certificationContent.helpers({
	"sportList":function()
	{
		var sportList = tournamentEvents.find({}).fetch();
		return sportList;
	},
	"certificationList":function()
	{
		
		var certificationList = certification.find({}).fetch();
		return certificationList;
	},
	"getSportName":function(data)
	{
		var sportExists = tournamentEvents.findOne({"_id":data});
		if(sportExists && sportExists.projectMainName)
			return sportExists.projectMainName
	}
})

Template.certificationContent.events({
	"click #createCertification":function(e)
	{
		$("#certificationModalContent").empty();
    	Session.set("certificationID",undefined);

		Blaze.render(Template.certificationActionModal, $("#certificationModalContent")[0]);
		$("#certificationActionModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editCertification":function(e)
	{
		$("#certificationModalContent").empty();
    	Session.set("certificationID",this._id);

		Blaze.render(Template.certificationActionModal, $("#certificationModalContent")[0]);
		$("#certificationActionModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #deleteCertification":function(e)
	{
		Meteor.call("deleteCertification",this._id,function(error,result)
		{
			if(result)	
				alert(result);	
			else
				alert(error);
		})
	}
})


Template.certificationActionModal.helpers({
	"certificationExist":function()
	{
		if(Session.get("certificationID") != undefined)
		{
			var certificationExist = certification.findOne({"_id":Session.get("certificationID")});
			if(certificationExist)
				return certificationExist
		}
	},
	"sportList":function()
	{
		var sportList = tournamentEvents.find({}).fetch();
		return sportList;
	},
	"checkSportSelection":function(data1,data2)
	{
		if(data1 == data2)
			return "selected"
	}
})

Template.certificationActionModal.events({

	"click #createCertification":function(e)
	{
		try{

			if($("#sportType").val() && $("#certificationName").val().trim().length > 0)
			{
				var data = {};
				data["sportId"] = $("#sportType").val() ;
				data["certificationName"] = $("#certificationName").val().trim();
				Meteor.call("createCertification",data,function(error,result)
				{
					if(result){
						alert(result);
						$("#certificationModalContent").empty();
                        $( '.modal-backdrop' ).remove();
					}
					else
						alert(error);
				})
			}
			else
			{
				if($("#sportType").val() == null)
					$("#certificationImpMsg").text("Please choose sport");
				else	
					$("#certificationImpMsg").text("Please enter certification");
			}
		}catch(e){
		}
	},
	"click #modifyCertification":function(e)
	{
		if($("#sportType").val() && $("#certificationName").val().trim().length > 0)
		{
			var data = {};
			data["_id"] = Session.get("certificationID");
			data["sportId"] = $("#sportType").val() ;
			data["certificationName"] = $("#certificationName").val().trim();
			Meteor.call("editCertification",data,function(error,result)
			{
				if(result)
				{
					alert(result);
					$("#certificationModalContent").empty();
                    $( '.modal-backdrop' ).remove();
				}
				else
					alert(error);
			})
		}
		else
			{
				if($("#sportType").val() == null)
					$("#certificationImpMsg").text("Please choose sport");
				else	
					$("#certificationImpMsg").text("Please enter certification");
			}
	}

})


/************** custom data *************/
/*********** certification related *********************/
Template.customDataContent.onCreated(function() {
	this.subscribe("customDataDBPub");
});

Template.customDataContent.helpers({
	
	"customDataList":function()
	{
		var customDataDBList = customDataDB.find({}).fetch();
		return customDataDBList;
	},

})

Template.customDataContent.events({
	"click #addCustomData":function(e)
	{
		alert(this.customData);

	}
})


Template.addAccountTypeModalContent.onCreated(function() {
	this.subscribe("customDataDBPub");
});


Template.addAccountTypeModalContent.helpers({
	"fetchAccountType":function()
	{
		var customDataDBList = customDataDB.findOne({"type":"accountType"});
		return customDataDBList.customData;
	}
})

Template.addAccountTypeModalContent.events({
	"click #saveAccountType":function()
	{
		if($("#accountType").val().trim().length > 0)
		{
			Meteor.call("addAccountType",$("#accountType").val().trim(),function(error,result)
			{
				if(result)
				{
					alert(result);
					$("#accountType").val("");
				}
				else
					alert(error)
			})
		}
		else
		{
			alert("Please enter account type")
		}
	}
})

Template.removeAccountTypeModalContent.onCreated(function() {
	this.subscribe("customDataDBPub");
});


Template.removeAccountTypeModalContent.helpers({
	"fetchAccountType":function()
	{
		var customDataDBList = customDataDB.findOne({"type":"accountType"});
		return customDataDBList.customData;
	}
})

Template.removeAccountTypeModalContent.events({
	"click #removeAccountType":function()
	{
		if($("#accountTypeSelection").val() != undefined && $("#accountTypeSelection").val() != null)
		{
			Meteor.call("removeAccountType",$("#accountTypeSelection").val().trim(),function(error,result)
			{
				if(result)
				{
					alert(result);
				}
				else
					alert(error)
			})
		}
		else
		{
			alert("Please choose account type")
		}
	}
})


Template.addNIModalContent.onCreated(function() {
	this.subscribe("domains");
	var self = this;
	self.autorun(function () {
	   self.subscribe("pubNIBasedCountry", Session.get("countryID"));
	});

});

Template.addNIModalContent.onRendered(function() {
	Session.set("countryID",undefined)
    
})

Template.addNIModalContent.onDestroyed(function() {
   	Session.set("countryID",undefined)

})


Template.addNIModalContent.helpers({
	"fetchCountry":function()
	{
		var domainArr = domains.find({}).fetch();
		return _.uniq(domainArr, false, function(domainArr) {
			return domainArr.countryName
		});
	},
	"fetchNI":function()
	{
	
		if(Session.get("countryID") != undefined)
		{
			var exists = customDataDB.findOne({
				"type":"nationalIdentity",
				"customKeyData.country":Session.get("countryID")
			});
			if(exists && exists.customKeyData && 
				exists.customKeyData.length > 0 && exists.customKeyData[0].valueSet)
			{
				return exists.customKeyData[0].valueSet
			}
		}
	},
	"setCountry":function(data)
	{
		try{
			if(Session.get("countryID") != undefined)
			{
				if(data == Session.get("countryID"))
					return "selected";
			}
		}catch(e){

		}
	}
})

Template.addNIModalContent.events({
	"change #countrySelection":function(e)
	{
		Session.set("countryID",$("#countrySelection").val());
	},
	"click #saveNA":function(e)
	{
		try{
			var countryID = $("#countrySelection").val();
			var newNA = $("#nationalIdentity").val();
			var mandVal = $("#mandatorySelection").val();



			if(countryID && newNA && newNA.trim().length > 0 && mandVal)
			{
				var data = {};
				data["countryName"] = countryID;
				data["identityName"] = newNA;
				data["mandVal"] = mandVal;

				Meteor.call("addNA",data,function(error,result){
					if(result)
						alert(result);
					else
						alert(error);
				})
			}
			else
			{
				if(countryID == null ||countryID == undefined)
					alert("Please choose country");
				else if(newNA.trim().length == 0)
					alert("Please enter national identity of selected country")
			}


		}catch(e)
		{

		}
	}
})




Template.removeNIModalContent.onCreated(function() {
	this.subscribe("domains");
	var self = this;
	self.autorun(function () {
	   self.subscribe("pubNIBasedCountry", Session.get("removeCountryID"));
	});
});

Template.removeNIModalContent.onRendered(function() {
	Session.set("removeCountryID",undefined)
    
})

Template.removeNIModalContent.onDestroyed(function() {
   	Session.set("removeCountryID",undefined)

})


Template.removeNIModalContent.helpers({
	"fetchCountry":function()
	{
		var domainArr = domains.find({}).fetch();
		return _.uniq(domainArr, false, function(domainArr) {
			return domainArr.countryName
		});
	},
	"fetchNI":function()
	{
	
		if(Session.get("removeCountryID") != undefined)
		{
			var exists = customDataDB.findOne({
				"type":"nationalIdentity",
				"customKeyData.country":Session.get("removeCountryID")
			});
			if(exists && exists.customKeyData && 
				exists.customKeyData.length > 0 && exists.customKeyData[0].valueSet)
			{
				return exists.customKeyData[0].valueSet
			}
		}
	},
	"setCountry":function(data)
	{
		try{
			if(Session.get("removeCountryID") != undefined)
			{
				if(data == Session.get("removeCountryID"))
					return "selected";
			}
		}catch(e){

		}
	}
})

Template.removeNIModalContent.events({
	"change #countrySelection":function(e)
	{
		Session.set("removeCountryID",$("#countrySelection").val());
	},
	"click #removeNA":function(e)
	{
		try{
			var countryID = $("#countrySelection").val();
			var newNA = $("#identitySelection").val();

			if(countryID && newNA)
			{
				var data = {};
				data["countryName"] = countryID;
				data["identityName"] = newNA;
				Meteor.call("removeNA",data,function(error,result){
					if(result)
						alert(result);
					else
						alert(error);
				})

			}
			else
			{
				if(countryID == null ||countryID == undefined)
					alert("Please choose country");
				else if(newNA.trim().length == 0)
					alert("Please enter national identity of selected country")
			}


		}catch(e)
		{

		}
	}
})


Template.removePointsModalContent.onCreated(function() {
	this.subscribe("playerPointsOrganizerPub");
	this.subscribe("PlayerPoints");

});

Template.removePointsModalContent.onRendered(function() {
    Session.set("removeTourPointsID",undefined) 
})

Template.removePointsModalContent.onDestroyed(function() {
    Session.set("removeTourPointsID",undefined) 

})


Template.removePointsModalContent.helpers({
	"fetchOrganizers":function()
	{
		distinctEntries = _.uniq(PlayerPoints.find({}, {
						    	sort: {"organizerId": 1}, fields: {"organizerId": 1}
							}).fetch().map(function(x) {
							    return x.organizerId;
							}), true);

		var userList = Meteor.users.find({"userId":{$in:distinctEntries}}).fetch()
		return userList;
	},
	"fetchEvent":function()
	{
	
		if(Session.get("removeTourPointsID") != undefined)
		{
			
			var events = _.uniq(PlayerPoints.find({"organizerId":Session.get("removeTourPointsID")}, {
						    	sort: {"eventName": 1}, fields: {"eventName": 1}
							}).fetch().map(function(x) {
							    return x.eventName;
							}), true);

			return events;
		}
	},
	
})

Template.removePointsModalContent.events({
	"change #organizerSelection":function(e)
	{
		var sportID = $("[name='organizerSelection'] option:selected").attr("name");
		Session.set("removeTourPointsID",sportID);
	},
	"click #removePoints":function(e)
	{
		try{
			var organizerId = Session.get("removeTourPointsID");
			var eventName = $("#eventSelection").val();

			if(organizerId && eventName)
			{
				var data = {};
				data["organizerId"] = organizerId;
				data["eventName"] = eventName;
				Meteor.call("removePoints_TourEvent",data,function(error,result){
					if(result)
						alert(result);
					else
						alert(error);
				})

			}
			else
			{
				if(countryID == null ||countryID == undefined)
					alert("Please choose country");
				else if(newNA.trim().length == 0)
					alert("Please enter national identity of selected country")
			}


		}catch(e)
		{

		}
	}
})

/***************************************************************************/

Template.RROrderContent.onCreated(function() {
	this.subscribe("customDataDBPub");
    Session.set("RRKeySet",undefined);
    Session.set("RRindexSet",undefined);
    Session.set("RRValueSet",undefined);

});

Template.RROrderContent.helpers({
	"orderRRList":function()
	{
		var orderOfPlayList = customDataDB.findOne({"type":"RROrderOfPlay"});
		if(orderOfPlayList.customKeyValueData)
		{
			return orderOfPlayList.customKeyValueData;
		}
	}
})

Template.RROrderContent.events({
	"click #addRROrder":function(e)
	{
		$("#orderOfPlayModalContent").empty();
    	Session.set("RRKeySet",undefined);
    	Session.set("RRindexSet",undefined);


		Blaze.render(Template.createRROrderModal, $("#orderOfPlayModalContent")[0]);
		$("#createRROrderModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editRROrder":function(e)
	{
		$("#orderOfPlayModalContent").empty();
    	Session.set("RRKeySet",this.keySet);
    	Session.set("RRValueSet",this.valueSet);
    	Session.set("RRindexSet",this.indexSet);

		Blaze.render(Template.createRROrderModal, $("#orderOfPlayModalContent")[0]);
		$("#createRROrderModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #deleteRROrder":function(e)
	{
		Session.set("RRKeySet",this.keySet);
    	Session.set("RRValueSet",this.valueSet);
    	Session.set("RRindexSet",this.indexSet);

		Meteor.call("deleteRROrder",Session.get("RRKeySet"),Session.get("RRindexSet"),function(error,result)
		{
			if(result)	
				alert(result);	
			else
				alert(error);
		})
	}
})


Template.createRROrderModal.helpers({
	"playerOrderExist":function()
	{
		try{
		if(Session.get("RRKeySet") != undefined && Session.get("RRValueSet") != undefined)
		{
			
			var dataInfo = customDataDB.findOne({
                "type": "RROrderOfPlay",
                "customKeyValueData.keySet": Session.get("RRKeySet"),
                "customKeyValueData.indexSet":Session.get("RRindexSet")
            });

			if(dataInfo)
			{
				var orderList = dataInfo.customKeyValueData;
				for(var i=0; i< orderList.length;i++)
				{
					if(orderList[i].keySet == Session.get("RRKeySet") && orderList[i].indexSet == Session.get("RRindexSet"))
					{
						return orderList[i]
					}
				}
			}

			
		}
	}catch(e)
	{
	}
	}
})

Template.createRROrderModal.events({

	"click #createRROrder":function(e)
	{
		try{
			if($("#groupSize").val().trim().length > 0 && 
				$("#indexSet").val().trim().length > 0 && 
				$("#playOrder").val().trim().length > 0 )
			{
				var data = {};
				data["groupSize"] = $("#groupSize").val().trim();
				data["indexSet"] = $("#indexSet").val().trim();
				data["playOrder"] = $("#playOrder").val().trim();
				Meteor.call("createRROrder",data,function(error,result)
				{
					if(result){
						alert(result);
						$("#orderOfPlayModalContent").empty();
                        $( '.modal-backdrop' ).remove();
					}
					else
						alert(error);
				})
			}
			else
			{
				alert("error")
				$("#matchOrderImpMsg").text("Please fill mandatory fields");
			}
		}catch(e){
		}
	},
	"click #modifyRROrder":function(e)
	{
		if($("#groupSize").val().trim().length > 0 && $("#playOrder").val().trim().length > 0 )
		{
			var data = {};
			data["groupSize"] = $("#groupSize").val().trim();
			data["indexSet"] = $("#indexSet").val().trim();
			data["playOrder"] = $("#playOrder").val().trim();
			Meteor.call("editRROrder",data,function(error,result)
			{
				if(result)
				{
					alert(result);
					$("#orderOfPlayModalContent").empty();
                    $('.modal-backdrop' ).remove();
				}
				else
					alert(error);
			})
		}
		else
		{
			$("#matchOrderImpMsg").text("Please fill mandatory fields");
		}
	},
	

})


/*****************************************************************************/

Template.schoolDetailContent.onCreated(function() {
	this.subscribe("domains");
    Session.set("schoolDomainID",undefined);
    var self = this;
	self.autorun(function () {
		if(Session.get("schoolDomainID") != undefined)
	   		self.subscribe("schoolDetailsBasedDomain", Session.get("schoolDomainID"));
	});
});

Template.schoolDetailContent.helpers({
	"domainList":function()
	{
		var domainList = domains.find({},{sort:{"domainName":1}}).fetch();
		return domainList;
	},
	"schoolList":function()
	{
		try{
			var schoolList = schoolDetails.find({}).fetch();
			return schoolList;
		}catch(e){

		}
	}
})

Template.schoolDetailContent.events({
	"change #domainSelection":function(e)
	{
 		var domainVal = $("#domainSelection").val();
		Session.set("schoolDomainID",domainVal);
	},
	'click #adminSchoolDownload': function(e) {
    	if(Session.get("schoolDomainID"))
    	{
    		var schoolList = schoolDetails.find(
    			{"state":Session.get("schoolDomainID")},{fields:{
    				"schoolName":1,"abbrevation":1,"emailAddress":1,
    				"_id":0
    			}}).fetch();
	    	var schoolName = $("[name='domainSelection'] option:selected").attr("name");

	    	if(schoolList.length > 0)
	    	{
	    		var csv = Papa.unparse(schoolList);
	    		var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
		   		var link = document.createElement("a");    
		    	link.href = uri;
		    	link.style = "visibility:hidden";
		    	link.download = schoolName+"_Schools.csv";
		    	document.body.appendChild(link);
		    	link.click();
		    	document.body.removeChild(link);  
	    	} 		
	    	else{
	    		displayMessage("Schools not found!!")
	    	}
	    	
	    }
	    else
	    {
	    	displayMessage("Please choose domain!!")
	    }
    	
    	
    },
})


/*********************************************************************************/
/************ fitbit related ********************/
Template.fitBitUserContent.onCreated(function() {
    this.subscribe("fitBitPub");
    Session.set("fitBitID",undefined);
});

Template.fitBitUserContent.helpers({
	"fitBitList":function()
	{
		var fitBitList = fitbitTokens.find({}).fetch();
		return fitBitList;
	},
	"fetchPlayer":function(userId)
	{		
		var result2 = ReactiveMethod.call("getUserName",userId);
		if(result2)
        	return result2
	}
})

Template.fitBitUserContent.events({
	"click #createFitBitUser":function(e)
	{
		$("#fitBitUserModalContent").empty();
    	Session.set("fitBitID",undefined);

		Blaze.render(Template.createFitBitModal, $("#fitBitUserModalContent")[0]);
		$("#createFitBitModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editFitBitUser":function(e)
	{
		$("#fitBitUserModalContent").empty();
    	Session.set("fitBitID",this._id);

		Blaze.render(Template.createFitBitModal, $("#fitBitUserModalContent")[0]);
		$("#createFitBitModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #remFitBitUser":function(e)
	{
		var dataJson = {};
		dataJson["_id"] = this._id;
		Meteor.call("upsertFitBitToken",dataJson,"delete",function(error,result)
		{
			if(result)	
				if(result.message)
					displayMessage(result.message);	
			else
				alert(error);
		})
	},
	"click #viewFitBitUserProfile":function(e)
	{
		if(this.userId != undefined)
		{
			Meteor.call("getPlayerDetails",this.userId,function(err,res){
	            if(err){
	                result = err
	            }
	            else{
	                result = res;
	                Session.set("statPlayerInfo",undefined);
	                Session.set("statPlayerInfo", result);
	                $("#displayPlayerProfile").empty();
	                Blaze.render(Template.statPlayerInfo, $("#displayPlayerProfile")[0]);
	                $("#statPlayerInfo").modal({
	                    backdrop: 'static'
	                });
	            }
        	});
		}
		 
	}
})

//onlyPlayers

Template.createFitBitModal.onCreated(function() {
    this.subscribe("onlyPlayers");
    $("#fbUser").select2("close");

});

Template.createFitBitModal.onRendered(function(){

    

    $('#fbUser').select2({
        width: '100%',
        color:"black"
    });
    
    
});


Template.createFitBitModal.helpers({
	"fitBitExist":function()
	{
		if(Session.get("fitBitID") != undefined)
		{
			var fitBitExist = fitbitTokens.findOne({"_id":Session.get("fitBitID")});
			if(fitBitExist)
				return fitBitExist
		}
	},
	"userList":function(){
		var userList = Meteor.users.find({"role":"Player"}).fetch();
		if(userList)
			return userList
	},
	"userSelection":function(fitBitId,userId){
		var fitBitInfo = fitbitTokens.findOne({"_id":fitBitId,"userId":userId});
		if(fitBitInfo)
			return "selected";
	}
})

Template.createFitBitModal.events({

	"click #createFitBit":function(e)
	{
		try{
			if($("#appuserID").val().trim().length > 0 && 
				$("#fBAccessToken").val().trim().length > 0 && 
				$("#fBRefreshToken").val().trim().length > 0 &&
				$("#fbUser").val() != null && $("#fbUser").val() != undefined )
			{
				var data = {};
				data["appUserID"] = $("#appuserID").val().trim();
				data["accessToken"] = $("#fBAccessToken").val().trim();
				data["refreshToken"] = $("#fBRefreshToken").val().trim();
				data["userId"] = $("#fbUser").val().trim();

				Meteor.call("upsertFitBitToken",data,"create",function(error,result)
				{
					if(result){
						if(result.message)
							displayMessage(result.message)
						$("#fitBitUserModalContent").empty();
                        $( '.modal-backdrop' ).remove();
					}
					else
						displayMessage(error);
				})
			}
			else
			{
				$("#fitBitMsg").text("Please enter mandatory fields");
			}
		}catch(e){
		}
	},
	"click #modifyFitBit":function(e)
	{
		if( Session.get("fitBitID") != undefined && $("#appuserID").val().trim().length > 0 &&
				$("#fbUser").val() != null && $("#fbUser").val() != undefined )
			{
				var data = {};
				data["appUserID"] = $("#appuserID").val().trim();
				data["userId"] = $("#fbUser").val().trim();
				data["_id"] = Session.get("fitBitID");

				Meteor.call("upsertFitBitToken",data,"update",function(error,result)
				{
					if(result){
						if(result.message)
							displayMessage(result.message)
						$("#fitBitUserModalContent").empty();
                        $( '.modal-backdrop' ).remove();
					}
					else
						displayMessage(error);
				})
			}
			else
			{
				$("#fitBitMsg").text("Please enter mandatory fields");
			}
	}

})

