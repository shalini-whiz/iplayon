function randomReceipt(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass+""+moment(new Date());
}



Meteor.methods({

	"updatePackFinanceStatus":async function(xData)
	{
		try{
			var receiptNo = randomReceipt();

			var data = xData._id;
			var tax = xData.tax;
			var commission = xData.commission;
			var sellerAmount = xData.sellerAmount;
			var sellerTaxLiable = xData.sellerTaxLiable;


			var packInfo = userSubscribedPacks.findOne({"_id":data});
			if(packInfo)
			{
				var taxRate = tax;
				var cgstTaxVal = "";
				var sgstTaxVal = "";
				var taxEntry = taxDetails.findOne({"taxRate":tax});
				if(taxEntry)
				{
					taxRate = tax;
					cgstTaxVal = taxEntry.cgst;
					sgstTaxVal = taxEntry.sgst;
				}

				if(packInfo.adminTransaction && packInfo.adminTransaction == "not paid")
				{
					var result = userSubscribedPacks.update({"_id":data},
						{$set:{
							"adminTransaction":"paid",
							"adminReceiptOn":new Date(),	
							"receiptNo":receiptNo					
							//"commissionRate":commission,
							//"sellerTax":tax,
							//"sellerAmount":sellerAmount,
							//"sellerTaxLiable":sellerTaxLiable
					}});

					if(result)
					{
						//AdminPayToSeller
						var resultJson = {};
						resultJson["status"] = "success";
						resultJson["data"] = "Finance Admin has paid respective user on this package";

						var dataJson = {};
						dataJson["_id"] = data;
						var result1 = await Meteor.call("fetchPackageDetails",dataJson)
						try
						{
							if(result1)
							{
								if(result1.status && result1.status == "success")
								{
									if(result1.data)
									{
										resultJson["dataContext"] = result1.data;
										var paramData = result1.data;

										SSR.compileTemplate('adminPayToSeller', Assets.getText('adminPayToSeller.html'));
                        

                        				var html_string = SSR.render('adminPayToSeller', result1.data);
                        				//packInfo

                        				var options = {
							                from: "iplayon.in@gmail.com",
							                //to:packInfo.packPayToUserId,
							                //cc:ccMails,
							                subject: "Receipt",
							                html: html_string
				            			}


				            			//var smsTemplate = "Hi "+paramData.sellerName+", Received From 5s Sporting Private Limited the sum of Rs."+packInfo.sellerAmount+" on account of "+paramData.sellerName+" against order id "+paramData._id+"";


				

				            			var smsData = {};
				            			smsData["type"] = "adminPayToSeller";
				            			smsData["sellerName"] = paramData.sellerName;
				            			smsData["sellerAmount"] = packInfo.sellerAmount
				            			smsData["_id"] = paramData._id
				            			smsData["packAdmin"] = paramData.adminName;

				            			smsTemplate = Meteor.call("fetchSMSTemplate",smsData);

										var ccMails = [paramData.adminDetails.userId];
										Meteor.call("sendSMSEmailNotification",packInfo.packPayToUserId,smsTemplate,options,ccMails,function(error,result){
				                            
                            
                        				});




									}

								}
							}
						}catch(e){}

						return resultJson;
					}
				}
				else
				{
					var resultJson = {};
					resultJson["status"] = "failure";
					resultJson["data"] = "Finance Admin has already paid respective user on this package";
					return resultJson;
				}
			}	
			else
			{
				var resultJson = {};
				resultJson["status"] = "failure";
				resultJson["data"] = "Invalid pack";
				return resultJson;
			}


		}catch(e){
			var resultJson = {};
			resultJson["status"] = "failure";
			resultJson["data"] = e;
			return resultJson;
		}
	},
	adminFinanceDownload:function(condJson)
	{
		try{
        var packList = userSubscribedPacks.find(condJson).fetch();

        var resultArr = [];

        for(var i = 0; i<packList.length;i++)
        {
        	var json = {};
        	var packEntry = packList[i];
        	json["Sl.No"] = i+1;
        	var packageInfo = articlesOfPublisher.findOne({"_id":packEntry.packId})
        	if(packageInfo)
        		json["Package"] = packageInfo.title;
        	var buyerInfo = Meteor.users.findOne({"userId":packEntry.userId});
        	if(buyerInfo)
        		json["Buyer"] = buyerInfo.userName;
        	var sellerInfo = Meteor.users.findOne({"userId":packEntry.packPayToUserId});
        	if(sellerInfo)
        		json["Seller"] = sellerInfo.userName;
        	if(packageInfo)
        		json["Price"] = packageInfo.amount;
        	json["Paid On"] = moment(new Date(packEntry.paidDate)).format("DD MMM YYYY hh:mm a")
        	json["StartsOn"] = moment(new Date(packEntry.planStartsOn)).format("DD MMM YYYY hh:mm a")
        	json["EndsOn"] = moment(new Date(packEntry.planEndsOn)).format("DD MMM YYYY hh:mm a")
        	
        	var accInfo = accountDetails.findOne({"userId":packEntry.packPayToUserId});
			if(accInfo && accInfo.taxLiable)
				json["GST Liable"] = accInfo.taxLiable;

			json["Admin Status"] = packEntry.adminTransaction;
			resultArr.push(json);
        }

        return resultArr;
		}catch(e)
		{

		}
	},
	
});