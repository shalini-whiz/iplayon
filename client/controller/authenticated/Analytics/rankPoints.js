

Template.rankPoints.onCreated(function() {
   this.subscribe("orgTourPointsPub");
})

Template.rankPoints.helpers({

	carriedPointsData:function()
	{
		var carriedPointsData = orgTourPoints.find({}).fetch();
		return carriedPointsData;
	},
	
})


Template.rankPoints.events({

	"click #addCarriedPoints":function(e)
	{
		try{
			Session.set("carriedPoints","new");
			$("#addCarriedPointsContent").empty();
			Blaze.render(Template.addCarriedPointsModal, $("#addCarriedPointsContent")[0]);
			$("#addCarriedPointsModal").modal({
				backdrop: 'static',
				keyboard: false
			});

		}catch(e){

		}
	},
	"click #editCarriedPoints":function(e)
	{
		try{
			Session.set("carriedPoints","modify");
			Session.set("carriedPointsJson",this);
			$("#addCarriedPointsContent").empty();
			Blaze.render(Template.addCarriedPointsModal, $("#addCarriedPointsContent")[0]);
			$("#addCarriedPointsModal").modal({
				backdrop: 'static',
				keyboard: false
			});

		}catch(e){

		}
	}

});

Template.addCarriedPointsModal.onRendered(function(){

	Session.set("tourListPoints",undefined);
	Session.set("yearID",undefined)
})

Template.addCarriedPointsModal.helpers({
	"alreadyExists":function()
	{
		if(Session.get("carriedPoints") != undefined)
		{
			if(Session.get("carriedPoints") == "new")
				return false;
			else
				return true;
		}
	},
	"yearList":function()
	{
		try{

			if(Session.get("carriedPoints") == "modify")
			{
	    		var yearList = [];
	    		var dataJson = Session.get("carriedPointsJson")
	    		if(dataJson)
	    			yearList.push(dataJson.year)	 
			
				return yearList;
			}
			else if(Session.get("carriedPoints") == "new")
			{
				var max = new Date().getFullYear();
		    	var min = parseInt(max - 9);
		    	var yearList = [];
		    	for (var i = max; i>=min; i--)
		    	{
		    		yearList.push(i)	 
				}
				return yearList;
			}
			
		}catch(e){
		}

	},
	"yearBasedTour":function()
	{
		if(Session.get("tourListPoints") != undefined)
		{
			return Session.get("tourListPoints")
		}
			
	},
	"checkYear":function(data1,data2)
	{
		if(Session.get("carriedPoints") != undefined)
		{
			if(Session.get("carriedPoints") == "new")
			{
				if(data1 == Session.get("yearID"))
					return "checked";
			}
			else if(Session.get("carriedPoints") == "modify")
			{
				var dataJson = Session.get("carriedPointsJson")
	    		if(dataJson.tournaments)
	    		{
	    			var tournamentList = dataJson.tournaments;
	    			if(tournamentList.indexOf(data2) > -1)
	    				return "checked";
	    		}
			}
			
		}
	},
	"formatDate":function(date)
	{
		return reverseDate(date);
	}
})

Template.addCarriedPointsModal.events({
	"change #yearSelection":function(e)
	{
		Session.set("yearID",$("#yearSelection").val());
		var paramJson = {};
		paramJson["year"] = $("#yearSelection").val();
		Meteor.call("fetchCarriedPoints",paramJson,function(error,result){
			if(result)
			{
				if(result.status && result.status == "success" && result.data)
					Session.set("tourListPoints",result.data);
			}
		});
	},
	"click #saveCarriedPoints":function(e)
	{
	 	var checkedTour = $("input[name='tourSelection']:checkbox:checked").map(function() {
                return this.value;
            }).get();
		if(checkedTour.length > 0)
		{

			var paramJson = {};
			paramJson["tournaments"] = checkedTour;
			paramJson["year"] = Session.get("yearID");
			paramJson["type"] = "new";

			Meteor.call("setOrgRankPoints",paramJson,function(error,result){
				if(result)
				{
					if(result.status)
					{
						if(result.status == "success")
						{
							displayMessage(result.message)
							$("#addCarriedPointsContent").empty();
							$('.modal-backdrop').remove();
						}
						else if(result.status = "failure")
							displayMessage(result.message)
					}
				}
			})

		}
		else
		{
			displayMessage("Please choose tournament!!")
		}
		

	},
	"click #modifyCarriedPoints":function(e)
	{
		var checkedTour = $("input[name='tourSelection']:checkbox:checked").map(function() {
                return this.value;
            }).get();

		if(checkedTour.length > 0)
		{
			var paramJson = {};
			paramJson["tournaments"] = checkedTour;
			paramJson["year"] = Session.get("yearID");
			paramJson["type"] = "modify";

			Meteor.call("setOrgRankPoints",paramJson,function(error,result){
				if(result)
				{
					if(result.status)
					{
						if(result.status == "success")
						{
							displayMessage(result.message)
							$("#addCarriedPointsContent").empty();
							$('.modal-backdrop').remove();
						}
						else if(result.status = "failure")
							displayMessage(result.message)
					}
				}
			})
		}
		else
		{
			displayMessage("Please choose tournament!!");
		}
		

	},

	"click #cancelCarriedPoints":function(e){
		$("#addCarriedPointsContent").empty();
		$('.modal-backdrop').remove();

	}
})