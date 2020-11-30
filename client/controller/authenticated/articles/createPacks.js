Template.createMyPack.onCreated(function(){
	this.subscribe("packsOfPublisherPacks");
    this.subscribe("packsOfCategoriesPacks");
    this.subscribe("packageFeatures");
})


Template.createMyPack.helpers({
	
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
     packageFeatureList:function(){
        try {
            let r = packFeatures.findOne({});
            if (r && r.features && r.features.length != 0) {
                return r.features
            }
        } catch (e) {} 
    }
})

Template.createMyPack.events({
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
    
    "keyup #amount": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
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
    "click #createPack":function(e)
    {
    	try{
    		var titleVal = $("#titleOfArticle").val();
	    	var planTypeVal = $("#planType").val();
	    	var categoryVal = $("#typeOfCategory").val();

	    	var validityDaysVal = $("#validityDays").val();
	    	var amountVal = $("#amount").val();
	    	var descVal = $("#descOfArticle").val();




    	
        if (planTypeVal && planTypeVal.trim().length != 0  
        	&& amountVal && amountVal.trim().length != 0  
        	&& validityDaysVal && validityDaysVal.trim().length != 0
            && titleVal && titleVal.trim().length != 0
            && categoryVal && categoryVal.trim().length != 0 
            && descVal && descVal.trim().length != 0) 
        {

        	if(planTypeVal != "0" && categoryVal != "0")
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
	            if(dataFeatures.length == 0)
	            {
	            	$("#impMsg").text("Please enter alteast one feature")
	            }
	            else
	            {
	            	var userInfo = Meteor.users.findOne({"userId":Meteor.userId()})
            		var userRole = "";
		            if(userInfo)
		            	userRole = userInfo.role;

	            	var data = {
		                types: "Packs",
		                userId: Meteor.userId(),
		                role: userRole,
		                titles: titleVal.trim(),
		                articleDesc: descVal.trim(),
		                amount: amountVal.trim(),
		                validityDays: validityDaysVal.trim(),
		                palnType: planTypeVal.trim(),
		                category: categoryVal.trim(),
		               "features":dataFeatures
	            	}


		            Meteor.call("createPacksPublished", data, function(e, res) {
		                if (e) {
							displayMessage(e)
		                } else if (res) 
		                {
		                    if (res.data != 0) {
		                        displayMessage(res.message);
                                $("#createMyPackDiv").empty();
                                $( '.modal-backdrop' ).remove();

		                    } else {
		                        displayMessage("cannot save.." + "\n" + res.message)
		                    }
		                } else {
		                    displayMessage("cannot save")
		                }
		            })
	            }
        	}
        	else
        	{
        		if(planTypeVal == '0' && categoryVal == '0')
        			$("#impMsg").text("Please choose plan type and category")
        		else if(planTypeVal == '0')
                    $("#impMsg").text("Please choose plan type")

        		else
                    $("#impMsg").text("Please choose category")

        	}

        	
        	


        }
        else
        {
            $("#impMsg").text("Please fill the fields")
        }

    	}catch(e)
    	{
            $("#impMsg").text(e)
    	}

    	

                       
    }
})
