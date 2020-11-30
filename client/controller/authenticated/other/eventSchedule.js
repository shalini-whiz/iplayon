Template.eventSchedule.onCreated(function(){

	this.subscribe("eventScheduleOrganizerPub");
	this.subscribe("liveEventsOrganizerPub");
	this.subscribe("pastEventsOrganizerPub");

	Session.set("eventScheduleID",undefined);

})


Template.eventSchedule.helpers({
	"eventScheduleList":function()
	{
		var eventScheduleList = eventSchedule.find({}).fetch();
		return eventScheduleList;
	},
	"fetchTour":function(data)
	{
		var tourInfo = tourExists(data);
		if(tourInfo && tourInfo.eventName)
			return tourInfo.eventName
		
	},

})


Template.eventSchedule.events({
	"click #addEventSchedule":function(e)
	{
		$("#eventScheduleModalContent").empty();
    	Session.set("eventScheduleID",undefined);

		Blaze.render(Template.addScheduleModal, $("#eventScheduleModalContent")[0]);
		$("#addScheduleModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	},
	"click #editEventSchedule":function(e)
	{
		$("#eventScheduleModalContent").empty();
    	Session.set("eventScheduleID",this._id);


		Blaze.render(Template.addScheduleModal, $("#eventScheduleModalContent")[0]);
		$("#addScheduleModal").modal({
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


Template.addScheduleModal.onCreated(function(){
	Session.set("tourScheduleID",undefined);
	var self = this;
	self.autorun(function () {
	   self.subscribe("tournamentCategories", Session.get("tourScheduleID"));
	});

})
Template.addScheduleModal.helpers({

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

Template.addScheduleModal.events({
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