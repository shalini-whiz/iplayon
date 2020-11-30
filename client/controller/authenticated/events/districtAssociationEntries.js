var userSubscription = false;

Template.dAWise.onCreated(function(){
	this.subscribe("onlyLoggedIn");

	var template = this;
    template.autorun(function() 
    {
    		var currentPage = parseInt(Router.current().params.page) || 1;
    		var skipCount = parseInt(parseInt((currentPage - 1)) * 10);
    		userSubscription = template.subscribe('getDAFinancial',skipCount,Router.current().params._id);
    		
    });
});

var currentPage = function() {
  return parseInt(Router.current().params.page) || 1; 
}

var hasMorePages = function() {
  var totalPlayers = Counts.get('districtAssociation_financial_Count');
  return currentPage() * parseInt(10) < totalPlayers;
}

Template.dAWise.onRendered(function(){
	Session.set("userNameOfDues",undefined);
	Session.set("userIdOfDues",undefined);
	Session.set("tournDetails",undefined);
	Session.set("tournamentSub_Academy",undefined);

});

Template.dAWise.helpers({

	prevPage: function() {
        try{
            var currentPage = parseInt(Router.current().params.page) || 1;
            var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            return Router.routes.feeList.path({_id:Router.current().params._id,page:previousPage})

        }catch(e){}
     },
    nextPage: function() {
         try{
            var currentPage = parseInt(Router.current().params.page) || 1;
            var nextPage = parseInt(currentPage + 1);
            return Router.routes.feeList.path({_id:Router.current().params._id,page:nextPage})
        }catch(e){}
    },
    
    prevPageClass: function() {
        return currentPage() <= 1 ? "none" : "";
    },
    nextPageClass: function() {
        return hasMorePages() ? "" : "none";
    },
    eventId:function(){
		return Router.current().params._id
	},


	"HTMLViewOfDAFeeData":function(){
		try
		{
			var index = 0;
			if(Router.current().params.page==1){
                index = 1
            }
            else{
                index = parseInt(parseInt((Router.current().params.page-1)*10)+1)
            }

			var dAList = [];
			var dAEntriesList = [];
			var tournamentId=Router.current().params._id;
			var tournamentName= ReactiveMethod.call("myeventsTournaments",Router.current().params._id);
			if(tournamentName&&tournamentName.eventName){
			Meteor.call("eventSubLastUnderTournHelper",tournamentId,function(e,result){
		    	if(e){}
		    	else
		    		Session.set("tournamentSub_Academy",result);		
		    });
			dAList = districtAssociationEntries.find({"tournamentId":tournamentId}).fetch();
			if(dAList.length > 0)
			{
				for(var h=0;h<dAList.length;h++)
				{
 			
 	    			var total = 0;
 	    			var districtAssociationId="";
 	    			if(dAList[h].associationId)
 	    				districtAssociationId = dAList[h].associationId;
 	    			var dAEntry = districtAssociationEntries.findOne({"tournamentId":tournamentId,"associationId":districtAssociationId});
 	    			if(dAEntry)
 	    			{
 	    				total = dAEntry.totalFee;
 	    				var dAInfo = ReactiveMethod.call("getAssociationInfo_financial",districtAssociationId);

 	    				
						if(dAInfo)
						{
							var district_Name = dAInfo.associationName;
							var district_Email = dAInfo.emailAddress;
							if(dAInfo.contactPerson == undefined)
								dAInfo.contactPerson = "";
							if(dAInfo.phoneNumber == undefined)
								dAInfo.phoneNumber = "";
							dataD={
			        			tourID:Router.current().params._id,
			        			tournamentName:tournamentName.eventName,
				        		districtName:district_Name,
				        		districtAssociationId:districtAssociationId,
				        		districtEmail:district_Email,
				        		districtPhoneNo:dAInfo.phoneNumber,
				        		districtContactPerson:dAInfo.contactPerson,
								total:total,
								slNo:parseInt(index + h)

			    			}
			    			dAEntriesList.push(dataD)
						}
 	    			}
				}
			}

			if (dAEntriesList.length == 0) {
				return 0
			} else
			{
				dAEntriesList.sort(sortClubName_HTML("districtName"));
				var routerIndex = 0;
				if(Router.current().params.page==1){
                	routerIndex = 1
            	}
            	else{
                	routerIndex = parseInt(parseInt((Router.current().params.page-1)*10)+1)
            	}

				dAEntriesList.map(function(document, index){
		            document["slNo"]=parseInt(index)+parseInt(routerIndex);
		         });

				return dAEntriesList;
			}
	}
	}catch(e){}
}

})


Template.dAWise.events({

	"click #sendRec":function(e){
		e.preventDefault();
		Session.set("useridToSend_DA",undefined);
		Session.set("detailsToSendReciept_DA",undefined);
		$("#confirmPasswordDARender").empty();
		Session.set("useridToSend_DA",this.districtAssociationId);
		Session.set("detailsToSendReciept_DA",this);
		Blaze.render(Template.confirmPasswordDASendRec,$("#confirmPasswordDARender")[0]);
		$("#confirmPasswordDASendRec").modal({backdrop: 'static'});
	}

})



Template.confirmPasswordDASendRec.onCreated(function(){
});

Template.confirmPasswordDASendRec.events({
	'submit form': function(e) {
		e.preventDefault();
		$("#changePasswordSucc").html("")
	},
	'focus #oldPassword':function(e){
		$("#changePasswordSucc").html("")
	},
});


Template.confirmPasswordDASendRec.onRendered(function(){
	$('#application-confirmPasswordDASendRec').validate({
	  	onkeyup:false,
	    rules: {
	    	oldPassword: {
	          required: true,
	          minlength:6,
	      },
	    },
	    showErrors: function(errorMap, errorList) {
	        $("#application-confirmPasswordDASendRec").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    messages: {
	    	oldPassword: {
	          required: "Please enter  your password ",
	          minlength: "Please enter a valid  password.",
	      },
	    },
	    submitHandler: function(){
	    	$("#changePasswordError").html("");
	    	var digest = Package.sha.SHA256($('#oldPassword').val());
	    	try{
	    		Meteor.call('checkPassword', digest, function(err, result) {
	    			try{
		      			if (result.error==null) {
		      				$("#confirmPasswordDASendRec").modal('hide');
		      				var details = Session.get("detailsToSendReciept_DA");
							var emailToDA = details.districtEmail;
							var sentData={
									sentReceiptUserId:Session.get("useridToSend_DA"),
									sentReceiptTournamentId:details.tourID
								}

					 		Meteor.call("insertDAReceipt",sentData,function(e,r){

					 		});

							if(emailToDA != "")
							{

								$("#sendingMailPopup2").modal({backdrop: 'static'});
								var dataContext = {
				                    message: "Here is confirmation for recent subscription of your academy player, tournamentName is",
				                    tournament: details.tournamentName,
				                    myName:details.districtContactPerson,
				                    total:details.total,	              
				                    playerName:details.districtName,
			                        playerPhone:details.districtPhoneNo
			               		}


			                	var html = Blaze.toHTMLWithData(Template.sendReceipt_DA_financial, dataContext);
			                	var options = {
				                   from: "iplayon.in@gmail.com",
				                   to: emailToDA,
				                   subject: "iPlayOn:Receipt of subscription",
				                   html: html
				                }

								var smsTemplate = "Hi "+details.districtName+",Here is confirmation for recent subscription of your association , tournament "+details.tournamentName;
                                smsTemplate += "\n Entry fee total:"+details.total;
                                var ccUserId = [];

                                

                                Meteor.call("sendSMSEmailNotification",Session.get("useridToSend_DA"),smsTemplate,options,ccUserId,function(error,result)
                                {
                                    if(error)
                                        displayMessage(error);
                                    else if(result){}
                                       //displayMessage(result);
                                });
				                

								
								 setTimeout(function(){
                                			$("#sendingMailPopup2").modal('hide');
                            			}, 1000);

							}

							
		     			 }
		      			else{
							$("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
		      			}
		  			}catch(e){
		  			}
		    	});
			}catch(e){
			}
	    }
	 });
});


//register helpers
Template.registerHelper('checkReceiptSent_DA',function(data){
	try
	{
		var j = districtAssociationEntries.findOne({"associationId":data,
			"tournamentId":Router.current().params._id,"paidOrNot":true});
		if(j){
			return "re-send"
		}
		else{
			return "send"
		}
	}catch(e){}

});



function sortClubName_HTML(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;
        return result * sortOrder;
    }
}