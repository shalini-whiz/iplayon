Template.editMyService.onCreated(function(){
	this.subscribe("packsOfPublisherPacks");
    this.subscribe("packsOfCategoriesPacks");
    this.subscribe("packageFeatures");
})


Template.editMyService.helpers({
	"packInDetail":function()
	{
		if(Session.get("viewPackID") != undefined)
		{
			var xx = articlesOfPublisher.find({}).fetch();
			var packageInfo = articlesOfPublisher.findOne({"_id":Session.get("viewPackID")});
			if(packageInfo)
				return packageInfo;
		}
	},
	"typeOfPlan": function() {
        try {
            let r = packsOfPublisher.findOne({});
            if (r && r.packs && r.packs.length != 0) {
                return r.packs
            }
        } catch (e) {
        }
    },
     typeOfCategory: function() {
        try {
            let r = categoryOfPublisher.findOne({});
            if (r && r.category && r.category.length != 0) {
                return r.category
            }
        } catch (e) {
        }
    },
    checkPackField:function(data1,data2)
    {
    	try{
    		if (data1.toLowerCase() == data2.toLowerCase())
                return "selected";
    	}catch(e){

    	}
    },
 

})

Template.editMyService.events({
	"keyup #validityDays": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #amount": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
	"keyup #featureLimit": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "click #packStatusUpdate":function()
    {
    	//statusOfArticles

    	var selectedId = "Packs"
        if (selectedId && selectedId == "Packs" && 
        	Session.get("viewPackID") != undefined && 
        	Session.get("viewPackID") != null) 
        {
        	var userInfo = Meteor.users.findOne({"userId":Meteor.userId()})
            var userRole = "";
            if(userInfo)
            	userRole = userInfo.role;

            var data = {
                types: selectedId,
                userId: Meteor.userId(),
                role: userRole,
                packId: Session.get("viewPackID"),
                status: $("#statusOfArticles").val()
            }
            Meteor.call("updatePacksStatus", data, function(e, res) {
                if (e) {
                    displayMessage(e)
                } else if (res) {
                    if (res.data != 0) {
                        displayMessage(res.message)
                    } else {
                        displayMessage("cannot save.." + "\n" + res.message)
                    }
                } else {
                    displayMessage("cannot save")
                }
            })
        } else {
            displayMessage("invalid data")
        }
    },
    "click #updatePack":function()
    {
    	var titleVal = $("#titleOfArticle").val();
    	var planTypeVal = $("#palnType").val();
    	var categoryVal = $("#typeOfCategory").val();

    	var validityDaysVal = $("#validityDays").val();
    	var amountVal = $("#amount").val();
    	var descVal = $("#descOfArticle").val();

    
    	if(titleVal && titleVal.trim().length >0 &&
    		planTypeVal && planTypeVal.trim().length > 0 &&
    		categoryVal && categoryVal.trim().length > 0 &&
    		validityDaysVal && validityDaysVal.trim().length > 0 &&
    		amountVal && amountVal.trim().length > 0 &&
    		descVal && descVal.trim().length > 0)
    	{
    		var dataFeatures = [] ;
            var packFeatureExist = packFeatures.findOne({});
            if (packFeatureExist && packFeatureExist.features && packFeatureExist.features.length != 0) 
            {
                var featureData = packFeatureExist.features;
                for(var m=0;m<featureData.length;m++)
                {            	

                    if($("[name='"+featureData[m]+"']") != undefined && 
                        $("[name='"+featureData[m]+"']").val() != undefined &&
                        $("[name='"+featureData[m]+"']").val().trim().length > 0)
                    {
                        var data = {};
                        data["key"] = featureData[m];
                        data["value"] = $("[name='"+featureData[m]+"']").val().trim();
                        dataFeatures.push(data);
                    }
                }
            }


            var userInfo = Meteor.users.findOne({"userId":Meteor.userId()})
            var userRole = "";
            if(userInfo)
            	userRole = userInfo.role;

        	var data = {
	            types: "Packs",
	            userId: Meteor.userId(),
	            role: userRole,
	            titles: $("#titleOfArticle").val().trim(),
	            articleDesc: $("#descOfArticle").val().trim(),
	            amount:  $("#amount").val().trim(),
	            validityDays: $("#validityDays").val().trim(),
	            palnType: $("#palnType").val().trim(),
	            packId: Session.get("viewPackID"),
	            status: $("#statusOfArticles").val(),
	            category: $("#typeOfCategory").val(),
	            "features":dataFeatures
       		}

	        Meteor.call("updatePacksPublished", data, function(e, res){
	            if (e) {
					displayMessage(e)
	            } else if (res) {
	                if (res.data != 0) 
	                {
	                    displayMessage(res.message)
	                } else {
	                    displayMessage("cannot save.." + "\n" + res.message)
	                }
	            } else {
	                displayMessage("cannot save")
	            }
	        })

	    }
	   	else
	    {
	    	displayMessage("require all fields")

	    }            
    }
    
})