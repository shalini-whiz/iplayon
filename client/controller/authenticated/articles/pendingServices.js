Template.myPendingServices.onCreated(function(){
	
});

Template.myPendingServices.helpers({
	"pendingPackageList":function()
	{
		try{
			
			var condJson = {};
			condJson["acknowledgeStatus"] = "pending";
			if(Session.get("package_buyer") != undefined && Session.get("package_buyer") != "All")		
				condJson["userId"] = Session.get("package_buyer");
			
			if(Session.get("package_seller") != undefined && Session.get("package_seller") != "All")
				condJson["packPayToUserId"] = Session.get("package_seller");
			if(Session.get("package_id") != undefined && Session.get("package_id") != "All")
				condJson["packId"] = Session.get("package_id");
			
			if(Session.get("package_startDate") != undefined && 
				Session.get("package_startDate") != "" && 
				Session.get("package_endDate") != undefined 
				&& Session.get("package_endDate") != "")
			{
				var valStartDate = moment(new Date(Session.get("package_startDate"))).format("YYYY-MM-DD");
				var calcDate = new Date(Session.get("package_endDate"));
				var valEndDate = moment(calcDate.setDate(calcDate.getDate()+1)).format("YYYY-MM-DD");

				condJson["paidDate"]= {
						$gte:new Date(valStartDate),
						$lt:new Date(valEndDate)
					}
				
			}
			else if(Session.get("package_startDate") != undefined && Session.get("package_startDate") != "")		
				condJson["paidDate"]= {$gte:new Date(moment(new Date(Session.get("package_startDate"))).format("YYYY-MM-DD"))} ;
			
			else if(Session.get("package_endDate") != undefined && Session.get("package_endDate") != "")
				condJson["paidDate"]= {$lte:new Date(moment(new Date(Session.get("package_endDate"))).format("YYYY-MM-DD"))} ;
			
			var packList = userSubscribedPacks.find(condJson).fetch();
			packList.map(function(document, index) {
			            	document["slNo"] = parseInt(index + 1);
			        	});
			return packList;
		}catch(e){
		}
	}
})

Template.myPendingServices.events({
	
	"click #ackService":function(e)
	{
		try{
			var packId = this.packId;
			var paidDate = this.paidDate;
			var buyerID = this.userId;
			var sellerID = this.packPayToUserId;
			var subId = this._id;
			Meteor.call("acknowledgeService",this._id,function(errore,result)
			{
				if(result)
				{
					if(result.status)
					{
						if(result.status == "success")
						{
							if(result.response)
								displayMessage(result.response);

							/*
							var paramData = {};
	        				paramData["_id"] = subId;

				        	Meteor.call("fetchPackageDetails",paramData,function(error,result)
					        {
					        	if(result)
					        	{
					        		if(result.status && result.status == "success")
					        		{
					        			var dataContext = result.data;
					        			var ccMails = ["shalini.krishnan90@gmail.com",dataContext.adminEmailID,dataContext.sellerEmailID]

						                var html = Blaze.toHTMLWithData(Template.sellerAcknowledgeTemplate, dataContext);

						                var options = {
						                    from: "iplayon.in@gmail.com",
						                    to:dataContext.buyerEmailID,
						                    cc:ccMails,
						                    subject: "Service Acknowledge",
						                    html: html
						                }

						               //send email


						                
						                try{
						                	var sellerEntry = userSubscribedPacks.findOne({"_id":subId});
						          			var amtAfterCommission = (parseFloat(sellerEntry.commissionRate) / 100 ) * parseFloat(sellerEntry.amount);	
											var amtWithOutTax = parseInt(sellerEntry.amount) - amtAfterCommission;
						                	dataContext["sellerPayablePrice"] = amtWithOutTax;
						                	if(sellerEntry)
						                	{
						                		dataContext["sellerAmount"] = sellerEntry.sellerAmount;
						                		if(sellerEntry.sellerTaxLiable == "yes")
						                		{
													
													var calcTaxAmt = (parseFloat(sellerEntry.sellerTax ) / 100 ) * parseFloat(amtWithOutTax);
													var calcAmt = parseFloat(amtWithOutTax) - parseFloat(calcTaxAmt);				
													dataContext["sellerTaxAmount"] = calcTaxAmt;
													
						                		}
												else
												{
													dataContext["sellerTaxAmount"] = "0";

												}


						                	}

						                	
						        			var ccMails = ["shalini.krishnan90@gmail.com",dataContext.sellerEmailID]
							                var html = Blaze.toHTMLWithData(Template.sellerRaiseInvoiceToAdmin, dataContext);
							                var options = {
							                    from: "iplayon.in@gmail.com",
							                    to:dataContext.adminEmailID,
							                    cc:ccMails,
							                    subject: "Invoice Generation",
							                    html: html
							                };

						                if(sellerEntry.buyerAmount != "0" && sellerEntry.amount != "0")
						                {
						                	//send email

						                }
						                
							                




						                }catch(e)
						                {
						                	displayMessage(e)
						                }

						                

					        		}
					        		else if(result.status && result.status == "failure")
					        		{
					        			if(result.data)
					        				displayMessage(result.data);
					        		}
					        	}
					        })*/
						
						}
						else if(result.status == "failure")
						{
							if(result.response)
								displayMessage(result.response);
						}
					}
					
				}
				if(error)
					displayMessage(error);
			})
		}catch(e)
		{
		}
	},
	
	"click #rejService":function(e)
	{
		try{
			var packId = this.packId;
			var paidDate = this.paidDate;
			var buyerID = this.userId;
			var sellerID = this.packPayToUserId;
			Meteor.call("rejectService",this._id,function(errore,result)
			{
				if(result)
				{
					if(result.status)
					{
						if(result.status == "success")
						{
							if(result.response)
								displayMessage(result.response);

							/*
							if(result.dataContext)
							{
								var dataContext = result.dataContext;
								var ccMails = ["shalini.krishnan90@gmail.com",dataContext.adminEmailID,dataContext.sellerEmailID]

	                			var html = Blaze.toHTMLWithData(Template.sellerRejectTemplate, dataContext);

				                var options = {
				                    from: "iplayon.in@gmail.com",
				                    to:dataContext.buyerEmailID,
				                    cc:ccMails,
				                    subject: "Service Rejected",
				                    html: html
				                }
	

							}
							*/

	                		
						}
						else if(result.status == "failure")
						{
							if(result.response)
								displayMessage(result.response);
						}
					}
					
				}
				if(error)
					displayMessage(error);
			})
		}catch(e)
		{
		}
	},
	"click #holdService":function(e)
	{
		try{
			var packId = this.packId;
			var paidDate = this.paidDate;
			var buyerID = this.userId;
			var sellerID = this.packPayToUserId;
			Meteor.call("holdOnService",this._id,function(errore,result)
			{
				if(result)
				{
					if(result.status)
					{
						if(result.status == "success")
						{
							if(result.response)
								displayMessage(result.response);

							/*
							if(result.dataContext)
							{
								var dataContext = result.dataContext;
								var ccMails = ["shalini.krishnan90@gmail.com",dataContext.adminEmailID,dataContext.sellerEmailID]

		                		var html = Blaze.toHTMLWithData(Template.sellerHoldOnTemplate, dataContext);
				                var options = {
				                    from: "iplayon.in@gmail.com",
				                    to:dataContext.buyerEmailID,
				                    cc:ccMails,
				                    subject: "Service On Hold",
				                    html: html
				                }

							}
							*/
	                		
						}
						else if(result.status == "failure")
						{
							if(result.response)
								displayMessage(result.response);
						}
					}
					
				}
				if(error)
					displayMessage(error);
			})
		}catch(e)
		{
		}
	}
})