var userSubscription = false;

Template.academyWise.onCreated(function(){
	this.subscribe("onlyLoggedIn");
	this.subscribe('academyfinancials');

	var template = this;
    template.autorun(function() 
    {
    		var currentPage = parseInt(Router.current().params.page) || 1;
    		var skipCount = parseInt(parseInt((currentPage - 1)) * 10);
    		userSubscription = template.subscribe('getAcademyFinancial',skipCount,Router.current().params._id);
    		
    });
});

var currentPage = function() {
  return parseInt(Router.current().params.page) || 1; 
}

var hasMorePages = function() {
  var totalPlayers = Counts.get('academy_financial_Count');
  return currentPage() * parseInt(10) < totalPlayers;
}

Template.academyWise.onRendered(function(){
	Session.set("userNameOfDues",undefined);
	Session.set("userIdOfDues",undefined);
	Session.set("tournDetails",undefined);
	Session.set("tournamentSub_Academy",undefined);

});

Template.academyWise.helpers({

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


	"HTMLViewOFAcademyFeeData1":function(){
		try
		{
			var index = 0;
			if(Router.current().params.page==1){
                index = 1
            }
            else{
                index = parseInt(parseInt((Router.current().params.page-1)*10)+1)
            }
			var academyListArr1 = [];
			var academyListArr = [];
			var academyList = [];
			var tournamentId=Router.current().params._id;
			var tournamentName= ReactiveMethod.call("myeventsTournaments",Router.current().params._id);
			if(tournamentName&&tournamentName.eventName){
			Meteor.call("eventSubLastUnderTournHelper",tournamentId,function(e,result){
		    	if(e){}
		    	else
		    		Session.set("tournamentSub_Academy",result);		
		    });
			academyListArr1 = academyEntries.find({"tournamentId":tournamentId}).fetch();
			if(academyListArr1.length > 0)
			{
				for(var h=0;h<academyListArr1.length;h++)
				{
 			
 	    			var total = 0;
 	    			var academyId = academyListArr1[h].academyId;
 	    			var academyEntry = academyEntries.findOne({"tournamentId":tournamentId,"academyId":academyId});
 	    			if(academyEntry)
 	    			{
 	    				total = academyEntry.totalFee;
 	    				var academyInfo = ReactiveMethod.call("getAcademyDetail",academyId);

 	    				
						if(academyInfo)
						{
							var academyName = academyInfo.clubName;
							var academyEmail = academyInfo.emailAddress;
							if(academyInfo.contactPerson == undefined)
								academyInfo.contactPerson = "";
							if(academyInfo.phoneNumber == undefined)
								academyInfo.phoneNumber = "";
							dataD={
			        			tourID:Router.current().params._id,
			        			tournamentName:tournamentName.eventName,
				        		academyName:academyName,
				        		academyId:academyId,
				        		academyEmail:academyEmail,
				        		academyPhoneNo:academyInfo.phoneNumber,
				        		academyContactPerson:academyInfo.contactPerson,
								total:total,
								slNo:parseInt(index + h)

			    			}
			    			academyListArr.push(dataD)
						}
 	    			}
				}
			}

			if (academyListArr.length == 0) {
				return 0
			} else
			{
				academyListArr.sort(sortClubName_HTML("academyName"));
				var routerIndex = 0;
				if(Router.current().params.page==1){
                	routerIndex = 1
            	}
            	else{
                	routerIndex = parseInt(parseInt((Router.current().params.page-1)*10)+1)
            	}

				academyListArr.map(function(document, index){
		            document["slNo"]=parseInt(index)+parseInt(routerIndex);
		         });

				Session.set("HTMLViewOFFee1",academyListArr);
				return academyListArr;
			}
	}
	}catch(e){}
}

})


Template.academyWise.events({

	"click #sendRec":function(e){
		e.preventDefault();
		Session.set("useridToSend",undefined);
		Session.set("detailsToSendReciept",undefined);
		$("#confirmPasswordAcademyRender").empty();
		Session.set("useridToSend",this.academyId);
		Session.set("detailsToSendReciept",this);

		Blaze.render(Template.confirmPasswordAcademySendRec,$("#confirmPasswordAcademyRender")[0]);
		$("#confirmPasswordAcademySendRec").modal({
			backdrop: 'static'
		});
	}

})



Template.confirmPasswordAcademySendRec.onCreated(function(){
	this.subscribe("users")
});

Template.confirmPasswordAcademySendRec.events({
	'submit form': function(e) {
		e.preventDefault();
		$("#changePasswordSucc").html("")
	},
	'focus #oldPassword':function(e){
		$("#changePasswordSucc").html("")
	},
});


Template.confirmPasswordAcademySendRec.onRendered(function(){
	$('#application-confirmPasswordAcademySendRec').validate({
	  	onkeyup:false,
	    rules: {
	    	oldPassword: {
	          required: true,
	          minlength:6,
	      },
	    },
	    showErrors: function(errorMap, errorList) {
	        $("#application-confirmPasswordAcademySendRec").find("input").each(function() {
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
		      				$("#confirmPasswordAcademySendRec").modal('hide');
		      				var details = Session.get("detailsToSendReciept");
							var emailToclub = details.academyEmail;
							var sentData={
									sentReceiptUserId:Session.get("useridToSend"),
									sentReceiptTournamentId:details.tourID
								}
					 		Meteor.call("insertAcademyReceipt",sentData,function(e,r){

					 		});
							if(emailToclub != "")
							{

								$("#sendingMailPopup2").modal({
									backdrop: 'static'
								});
								
								
								var dataContext = {
				                    message: "Here is confirmation for recent subscription of your academy player, tournamentName is",
				                    tournament: details.tournamentName,
				                    myName:details.academyContactPerson,
				                    total:details.total,	              
				                    playerName:details.academyName,
			                        playerPhone:details.academyPhoneNo
			               		}

			                	var html = Blaze.toHTMLWithData(Template.sendReceipt_Academy_financial, dataContext);

			                	var options = {
				                   from: "iplayon.in@gmail.com",
				                   to: emailToclub,
				                   subject: "iPlayOn:Receipt of subscription",
				                   html: html
				                }
		                
 								var smsTemplate = "Hi "+details.academyContactPerson+",Here is confirmation for recent subscription of your academy player, tournament "+details.tournamentName;
                                smsTemplate += "\n Entry fee total:"+details.total;
                                var ccUserId = [];

                                Meteor.call("sendSMSEmailNotification",Session.get("useridToSend"),smsTemplate,options,[],function(error,result)
                                {
                                    if(error)
                                        displayMessage(error);
                                    else if(result)
                                        displayMessage(result);
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
Template.registerHelper('checkReceiptSent_Academy',function(data){
	try
	{

		var j = academyEntries.findOne({"academyId":data,
			"tournamentId":Router.current().params._id,"paidOrNot":true});
		if(j){
			return "re-send"
		}
		else{
			return "send"
		}
	}catch(e){}

});

Template.registerHelper('checkReceiptSentSubAca',function(academyId){
	try
	{

		var j = academyEntries.findOne({"academyId":academyId,
			"tournamentId":Router.current().params._id,"paidOrNot":true});
		if(j){
		}
		else{
			if(Session.get("tournamentSub_Academy"))
				return "disabled; style=background:grey !important";
		}
	}catch(e){}

});
Template.registerHelper('checkReceiptSentSubAcaID',function(academyId){
	try
	{
		var j = academyEntries.findOne({"academyId":academyId,
			"tournamentId":Router.current().params._id,"paidOrNot":true});
		if(j){
			return "sendRec"
		}
		else{
			if(!Session.get("tournamentSub_Academy"))
				return "sendRec";
			else
				return "";
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