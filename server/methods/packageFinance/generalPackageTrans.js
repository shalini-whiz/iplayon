Meteor.methods({

	"fetchPackageDetails":function(data)
	{
		try{
			if(data._id)
			{
				var packageName = "";
				var packageBought = "";
				var buyerName = "";
				var sellerName= "";
				var sellerEmailID = "";
				var packageAmount = "";
				var financeAdminName = "";
				var financeEmailID = "";
				var productAmount = "";
				var invoiceDate = "";
				var dataContext = {};

				var subscriptionPack = userSubscribedPacks.findOne({"_id":data._id});
				if(subscriptionPack)
				{
					var packageInfo = articlesOfPublisher.findOne({"_id":subscriptionPack.packId});
					if(packageInfo)
					{
						dataContext["packageName"] = packageInfo.title;
						dataContext["packageAmount"] = subscriptionPack.buyerAmount;
						dataContext["packageBought"] = moment(new Date(subscriptionPack.paidDate)).format("DD MMM YYYY");			
						dataContext["productAmount"] = subscriptionPack.amount;


					}
					var sellerInfo = Meteor.users.findOne({"userId":subscriptionPack.packPayToUserId})
					var sellerTaxNo = "";
					var sellerDet;
					if(sellerInfo)
					{
						if(sellerInfo.role == "Coach")
						{
							sellerDet = otherUsers.findOne({"userId":subscriptionPack.packPayToUserId});
							if(sellerDet)
							{
								sellerName = sellerDet.userName;
								sellerEmailID = sellerDet.emailAddress;
								if(sellerDet.state)
								{
									var stateInfo = domains.findOne({"_id":sellerDet.state});
									if(stateInfo)
										sellerDet["stateName"] = stateInfo.domainName;
								}
								dataContext["sellerDetails"] = sellerDet;
								
							}
							var accountEntry = accountDetails.findOne({"userId":subscriptionPack.packPayToUserId});
							if(accountEntry && accountEntry.taxLiable && accountEntry.taxLiable == "yes")
							{
								if(accountEntry.gstNo.trim().length > 0 && accountEntry.gstNo.trim() != "NA")
									dataContext["taxNo"] = accountEntry.gstNo;

							}
						}
						

					}
					var buyerInfo = Meteor.users.findOne({"userId":subscriptionPack.userId});
					if(buyerInfo)
					{
						buyerName = buyerInfo.userName;
						dataContext["buyerEmailID"] = buyerInfo.emailAddress;

					}
					var finAdmin = apiUsers.findOne({"source" : "ip_finance"})
					if(finAdmin)
					{
						var adminInfo = otherUsers.findOne({"userId":finAdmin.userId})
						if(adminInfo)
						{
							financeAdminName = adminInfo.userName;
							financeEmailID = adminInfo.emailAddress;
							if(adminInfo.state)
							{
								var stateInfo = domains.findOne({"_id":adminInfo.state});
								if(stateInfo)
									adminInfo["stateName"] = stateInfo.domainName;
							}
							dataContext["adminDetails"] = adminInfo;

						}
					}
					dataContext["invoiceDate"] = moment(new Date(subscriptionPack.invoiceDate)).format("DD MMM YYYY");			


					
	                dataContext["sellerName"] =  sellerName;
	                dataContext["sellerEmailID"] = sellerEmailID;
	                dataContext["buyerName"] = buyerName;
	                dataContext["adminName"] = financeAdminName;
	                dataContext["adminEmailID"] = financeEmailID;
	                dataContext["_id"] = data._id;

	                var absoluteUrl = Meteor.absoluteUrl().toString();
                	var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
	                dataContext["imageURL"] = absoluteUrlString;


	                //if(sellerTaxNo != "")
	                //{
	                	//dataContext["taxNo"] = sellerTaxNo;
	                //}
	                if(subscriptionPack.receiptNo)
	                	dataContext["receiptNo"] = subscriptionPack.receiptNo;
	                if(subscriptionPack.adminReceiptOn)
	                	dataContext["receiptDate"] = moment(new Date(subscriptionPack.adminReceiptOn)).format("DD MMM YYYY");			

					var amtAfterCommission = (parseFloat(subscriptionPack.commissionRate) / 100 ) * parseFloat(subscriptionPack.amount);	
					var amtWithOutTax = parseInt(subscriptionPack.amount) - amtAfterCommission;
					dataContext["sellerPayablePrice"] = amtWithOutTax;
					
					dataContext["sellerAmount"] = subscriptionPack.sellerAmount;
					if(subscriptionPack.sellerTaxLiable == "yes")
					{												
						var calcTaxAmt = (parseFloat(subscriptionPack.sellerTax ) / 100 ) * parseFloat(amtWithOutTax);
						var calcAmt = parseFloat(amtWithOutTax) - parseFloat(calcTaxAmt);				
						dataContext["sellerTaxAmount"] = calcTaxAmt;										
					}
					else
					{
						dataContext["sellerTaxAmount"] = "0";
					}
					

	                var resultJson = {};
	                resultJson["status"] = "success";
	                resultJson["data"] = dataContext;
	                return resultJson;
					
				}
				else
				{
					var resultJson = {};
	                resultJson["status"] = "failure";
	                resultJson["data"] = "Invalid pack";
	                return resultJson;
				}

			}
			else
			{
				var resultJson = {};
	            resultJson["status"] = "failure";
	            resultJson["data"] = "Invalid data";
	            return resultJson;
			}

		}catch(e){
			var resultJson = {};
	        resultJson["status"] = "failure";
	        resultJson["data"] = e;
	       	return resultJson;
			
		}
	},
	"fetchBasicPackageDetails":function(data)
	{
		try{
			if(data._id)
			{
				var packageName = "";
				var packageBought = "";
				var buyerName = "";
				var sellerName= "";
				var sellerEmailID = "";
				var packageAmount = "";
				var financeAdminName = "";
				var financeEmailID = "";
				var productAmount = "";
				var invoiceDate = "";
				var dataContext = {};

				var subscriptionPack = userSubscribedPacks.findOne({"_id":data._id});
				if(subscriptionPack)
				{
					var packageInfo = articlesOfPublisher.findOne({"_id":subscriptionPack.packId});
					if(packageInfo)
					{
						dataContext["packageName"] = packageInfo.title;
						dataContext["packageAmount"] = subscriptionPack.buyerAmount;
						dataContext["packageBought"] = moment(new Date(subscriptionPack.paidDate)).format("DD MMM YYYY");			
						dataContext["productAmount"] = subscriptionPack.amount;


					}
					var sellerInfo = Meteor.users.findOne({"userId":subscriptionPack.packPayToUserId})
					var sellerTaxNo = "";
					var sellerDet;
					if(sellerInfo)
					{
						if(sellerInfo.role == "Coach")
						{
							sellerDet = otherUsers.findOne({"userId":subscriptionPack.packPayToUserId});
							if(sellerDet)
							{
								sellerName = sellerDet.userName;
								sellerEmailID = sellerDet.emailAddress;												
							}				
						}	
					}
					var buyerInfo = Meteor.users.findOne({"userId":subscriptionPack.userId});
					if(buyerInfo)
					{
						buyerName = buyerInfo.userName;
						dataContext["buyerEmailID"] =  "";
						if(buyerInfo.emailAddress)
							dataContext["buyerEmailID"] =  buyerInfo.emailAddress;			
					}
					var finAdmin = apiUsers.findOne({"source" : "ip_finance"})
					if(finAdmin)
					{
						var adminInfo = otherUsers.findOne({"userId":finAdmin.userId})
						if(adminInfo)
						{
							financeAdminName = adminInfo.userName;
							financeEmailID = adminInfo.emailAddress;						
						}
					}


	                dataContext["sellerName"] =  sellerName;
	                dataContext["sellerEmailID"] = sellerEmailID;
	                dataContext["buyerName"] = buyerName;
	                dataContext["adminName"] = financeAdminName;
	                dataContext["adminEmailID"] = financeEmailID;
	                dataContext["_id"] = data._id;

	                var absoluteUrl = Meteor.absoluteUrl().toString();
                	var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
	                dataContext["imageURL"] = absoluteUrlString;

	                var resultJson = {};
	                resultJson["status"] = "success";
	                resultJson["data"] = dataContext;
	                return resultJson;
					
				}
				else
				{
					var resultJson = {};
	                resultJson["status"] = "failure";
	                resultJson["data"] = "Invalid pack";
	                return resultJson;
				}

			}
			else
			{
				var resultJson = {};
	            resultJson["status"] = "failure";
	            resultJson["data"] = "Invalid data";
	            return resultJson;
			}

		}catch(e){
			var resultJson = {};
	        resultJson["status"] = "failure";
	        resultJson["data"] = e;
	       	return resultJson;
			
		}
	}
})