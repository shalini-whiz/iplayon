Template.accountDetails.onCreated(function(){
	this.subscribe("customDataDBPub")
	Session.set("indentityExists",undefined)
});

Template.accountDetails.onRendered(function(){


	$('#application-accountDetails').validate({
	  	onkeyup:false,
	    rules: {
	    	bankName:{
	    		required:true
	    	},
	    	accNo: {
	          	required: true,
	    	},
	      	accType: {
	      		required: true,
	      	},
	      	accIfsc: {
	      		required: true,
	        },	    
	        aadhaarNo:{
	        	required : true
	        },
	        //panNo:{
	        	//required :true
	        //}
	    },
	    // Display only one error at a time
	    showErrors: function(errorMap, errorList) {
	        $("#application-accountDetails").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	            $("#accountDetailsError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    messages: {
	    	bankName:{
	    		required:"Please enter bank name"
	    	},
	    	accNo: {
	         	required: "Please enter the account number "
	      	},
	      	accType: {
	      		required: "Please enter account type ",
	      	},
	      	accIfsc: {
	          	required: "Please enter account ifsc code",
	        },       
	        aadhaarNo:{
	          	required: "Please enter AADHAAR No",
	        },
	        //panNo:{
	          	//required: "Please enter PAN No",
	        //}
	    },
	 
	    submitHandler: function(){
	    


    	

	    	$("#accountDetailsError").html("");
	    	try{
	    		var validationSuccess = true;
	    		var otherUserInfo = otherUsers.findOne({"userId":Meteor.user().userId});
				if(otherUserInfo && otherUserInfo.country)
				{
					if(otherUserInfo.country.toLowerCase() == "india" && $("#gstNo").val().trim() == "NA")
					{
						$("#gstNo").val("");
						validationSuccess = false;
					}						
				}

	    		if($("#accTaxLiable").is(':checked') && $("#gstNo").val().trim().length == 0)
	    			validationSuccess = false;

		    	if(validationSuccess)
		    	{
		    		$("#accountDetailsError").html("");
		            $("#gstNo").removeClass("error");

		    		var xData = {};
			    	//xData["accountType"] = $("#accType").val();
			    	xData["bankName"] = $("#bankName").val();
			    	xData["accountType"] = $("[name='accType'] option:selected").val();
			    	xData["accountNo"] =  $("#accNo").val();
			    	xData["accountIfsc"] =  $("#accIfsc").val();
					if($("#accTaxLiable").is(':checked'))			
						xData["taxLiable"] = "yes";
					else
						xData["taxLiable"] = "no";

					xData["gstNo"] = $("#gstNo").val();
					xData["nationalIdentityNo"] = $("#aadhaarNo").val();
					//xData["panNo"] = $("#panNo").val();

					if(Session.get("indentityExists") != undefined)
					{
						var dataFeatures = [] ;
			            var indentityExists = Session.get("indentityExists");
			            if (indentityExists) 
			            {
			                
			                for(var m=0;m<indentityExists.length;m++)
			                {            	

			                    if($("[name='"+indentityExists[m].key+"']") != undefined && 
			                        $("[name='"+indentityExists[m].key+"']").val() != undefined &&
			                        $("[name='"+indentityExists[m].key+"']").val().trim().length > 0)
			                    {
			                        var data = {};
			                        data["key"] = indentityExists[m].key;
			                        data["value"] = $("[name='"+indentityExists[m].key+"']").val().trim();
			                        dataFeatures.push(data);
			                    }
			                }
			            }
			            if(dataFeatures.length >0 )
			            {
			            	validationSuccess = true;
			            	xData["nationalIdentities"] = dataFeatures
			            }
			            	
			            else
			            {
			            	validationSuccess = false;
			            	displayMessage("Please fill mandatory fields");
			            }
			            	
					}
					else
					{
						if($("#nationalIdentityType").val().trim().length > 0 && $("#nationalIdentityNo").val().trim().length > 0)
						{
							xData["nationalIdentityType"] = $("#nationalIdentityType").val().trim();
							xData["nationalIdentityNo"] = $("#nationalIdentityNo").val().trim();
						}
						else
						{
							displayMessage("Please fill mandatory fields");
							validationSuccess = false
						}
						


					}

					if(validationSuccess)
					{

				    	Meteor.call("saveAccountDetails",xData,function(error,result){
				    		if(result)
				    		{
				    			try{
				    			if(result.status)
				    			{
				    				if(result.status.trim() == "success")
				    				{
				    					if(result.response)
				    						$("#accountDetailsSucc").html("<span class='glyphicon glyphicon-ok green'></span> "+result.response);
										else
											$("#accountDetailsSucc").html("<span class='glyphicon glyphicon-ok green'></span> "+"Account Details updated");				
				    				}
				    				else if(result.status.trim() == "failure")
				    				{
				    					if(result.response){
				    						 $("#accountDetailsError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.response);

				    					}
				    				}
				    			}
				    		}catch(e)
				    		{
				    			displayMessage(e)
				    		}
				    			
				    		}
				    		else if(error)
				    		{
				    			displayMessage(error);
				    		}
				    	});
				    }

		    	}
		    	else
		    	{
		    		$("#accountDetailsError").html("<span class='glyphicon glyphicon-remove-sign red'></span> Please enter GST No");
		            $("#gstNo").addClass("error");
		    	}
	    }catch(e)
	    {
	    	displayMessage(e)
	    }
	    	
   
	    }
	    	
	    
	  });
});

Template.accountDetails.helpers({

	"profileDetails":function()
	{
		var otherUserInfo = otherUsers.findOne({"userId":Meteor.user().userId});
		if(otherUserInfo)
			return otherUserInfo;
	},
	"getAccountType":function()
	{
		var accountTypeDetails = customDataDB.findOne({"type":"accountType"});
		if(accountTypeDetails && accountTypeDetails.customData)
			return accountTypeDetails.customData;
	},
	"getIdentityType":function()
	{
		try{
		var otherUserInfo = otherUsers.findOne({"userId":Meteor.user().userId});
		if(otherUserInfo && otherUserInfo.country)
		{
			var accountTypeDetails = customDataDB.findOne(
				{"type":"nationalIdentity",
				"customKeyData.country":otherUserInfo.country},
				{
                fields: {
                    "_id": 1,
                    "customKeyData": 1
                }
            });

            
			if(accountTypeDetails && accountTypeDetails.customKeyData)
			{
				var consolidatedList = _.findWhere(accountTypeDetails.customKeyData, {"country": otherUserInfo.country});
				Session.set("indentityExists",consolidatedList.valueSet)
				return consolidatedList.valueSet;
			}

		}
	}catch(e)
	{
		displayMessage(e)
	}
		
	},
	"checkCountryCriteria":function()
	{
		var otherUserInfo = otherUsers.findOne({"userId":Meteor.user().userId});
		if(otherUserInfo && otherUserInfo.country)
		{
			if(otherUserInfo.country.toLowerCase() == "india")
				return true;
			else
				return false;
		}
	},
	"getAccDetails":function(){
		var accExists = ReactiveMethod.call("getAccountDetails",undefined);
		if(accExists)
		{
			if(accExists.status == "success")
				return accExists.data;
		}
	},
	"setAccountType":function(data1,data2)
	{
		if(data1 == data2)
			return "selected";
	},
	"getIdentityVal":function(data1,data2)
	{
		try{
			var valueData = "";
			if(data1 != undefined && data2 != undefined)
			{
				var jsonData = _.findWhere(data2, {"key": data1});
				if(jsonData && jsonData.value)
					valueData =  jsonData.value;

			}
			return valueData;
		}catch(e){

		}
	},
	"taxStatus":function(data){
		if(data != null && data != undefined)
		{
			if(data == "no")
				return "";
			else if(data == "yes")
				return "checked"
		}
	}
	
})
Template.accountDetails.events({
	'submit form': function(e) {
		e.preventDefault();
		$("#accountDetailsSucc").html("")
	},
	'focus #accNo':function(e){
		$("#accountDetailsSucc").html("")
	},
	'focus #accType':function(e){
		$("#accountDetailsSucc").html("")
	},
	'focus #accIfsc':function(e){
		$("#accountDetailsSucc").html("")
	},
	'click #countryIdentity':function(e)
	{

		$("#national_identity_content").empty()
			
		Blaze.render(Template.countryIdentityDetails,$("#national_identity_content")[0]);
		$("#countryIdentityDetails").modal({
			backdrop: 'static',
			keyboard: false
		});
			
	}
});


Template.countryIdentityDetails.onCreated(function(){
});

Template.countryIdentityDetails.onRendered(function(){
});

Template.countryIdentityDetails.helpers({

	"getCountryIdentity":function()
	{

	}
})