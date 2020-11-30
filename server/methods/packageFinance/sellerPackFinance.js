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

	"acknowledgeService":function(data)
	{
		try{

			var packInfo = userSubscribedPacks.findOne({"_id":data});
			
			if(packInfo)
			{
				var packExists = articlesOfPublisher.findOne({"type":"Packs","_id":packInfo.packId});

				if(packExists && packInfo.acknowledgeStatus && packInfo.acknowledgeStatus != "accept")
				{
					var commissionRate = "";
					var taxRate = "";
					var taxLiable = "";
					var sellerAmount = "";
					var accInfo = accountDetails.findOne({"userId":packInfo.packPayToUserId});
					var entry  = lastInsertedAffId.findOne({ "assocId" : "Commission"});
					var taxEntry = taxDetails.findOne({});

					if(entry && entry.lastInsertedId && taxEntry && taxEntry.taxRate &&
						accInfo && accInfo.taxLiable)
					{			
						commissionRate = entry.lastInsertedId;
						taxRate = taxEntry.taxRate
						taxLiable = accInfo.taxLiable;
						var amtAfterCommission = (parseFloat(commissionRate) / 100 ) * parseFloat(packInfo.amount);	
						var amtWithOutTax = parseInt(packInfo.amount) - amtAfterCommission;
						if(accInfo.taxLiable == "yes")
						{
							if(taxEntry.taxRate)
							{
								var calcTaxAmt = (parseFloat(taxEntry.taxRate ) / 100 ) * parseFloat(amtWithOutTax);
								var calcAmt = parseFloat(calcTaxAmt) + amtWithOutTax;				
								sellerAmount = calcAmt.toFixed(2);
							}
							else
								sellerAmount = amtWithOutTax;
						}
						else
							sellerAmount = amtWithOutTax;

						
						var packValidity = packExists.validityDays;
						var startsOn = moment(new Date()).format("YYYY-MM-DD hh:mm a");
						var endsOn = moment(new Date()).add(packValidity, 'days').format("YYYY-MM-DD hh:mm a");
						
						
						var result = userSubscribedPacks.update({"_id":data},
						{$set:{
							"acknowledgeStatus":"accept",
							"sellerAmount":sellerAmount,
							"commissionRate":commissionRate,
							"sellerTax":taxRate,
							"sellerTaxLiable":taxLiable,
							"invoiceDate":new Date(),
							"planStartsOn" : startsOn,
							"planEndsOn:" : endsOn

						}});
						if(result)
						{

							if(packInfo.buyerAmount == "0" && packInfo.amount == "0")
							{
								var receiptNo = randomReceipt();

								var resData = userSubscribedPacks.update({"_id":data},
									{$set:{
										"adminTransaction":"paid",
										"adminReceiptOn":new Date(),	
										"receiptNo":receiptNo	
									}});

							}
							var resultJson = {};
							resultJson["status"] = "success";
							resultJson["response"] = "Successfully acknowledged!!"
							
							var entry = userSubscribedPacks.findOne({"_id":data})
							if(entry)
							{
								var sellerAmtDetails = {};
								var amount = entry.amount;
								sellerAmtDetails["taxLiable"] = entry.sellerTaxLiable;
								sellerAmtDetails["sellerAmount"] = entry.sellerAmount;
								if(entry.sellerTaxLiable == "yes")
								{
									var calcTaxAmt = (parseFloat(entry.sellerTax) / 100 ) * parseInt(entry.amount);
									sellerAmtDetails["sellerTaxAmount"] = calcTaxAmt;
								}
								resultJson["sellerAmtDetails"] = sellerAmtDetails;

							}
							

							return resultJson;
						}
						
					}
					else
					{
						var responseMes = "";
						if(accInfo == undefined || accInfo == null)
						{
							responseMes = "Make sure you provided account details!!"
						}
						else if(taxEntry == undefined || taxEntry == null || taxEntry.taxRate == undefined ||
							taxEntry.taxRate == null)
						{
							responseMes = "Please contact admin regarding tax details"

						}
						else
							responseMes = "Please contact admin";

						var resultJson = {};
						resultJson["status"] = "failure";
						resultJson["response"] = responseMes
						return resultJson;
					}

					

					
				



					//"commissionRate":commission,
					//		"sellerTax":tax,
					//		"sellerAmount":sellerAmount,
					//		"sellerTaxLiable":sellerTaxLiable


					
				}
				else
				{
					if(packInfo.acknowledgeStatus && packageInfo.acknowledgeStatus == "accept")
					{
						var resultJson = {};
						resultJson["status"] = "failure";
						resultJson["response"] = "Package has already been acknowledged!!"
						return resultJson;
					}
				}
			}	
			else
			{
				var resultJson = {};
				resultJson["status"] = "failure";
				resultJson["response"] = "Invalid pack!!"
				return resultJson;
			}


		}catch(e){
				return e;
		}
	},
	"rejectService":async function(data)
	{
		try{
			var packInfo = userSubscribedPacks.findOne({"_id":data});
			if(packInfo)
			{
				if(packInfo.acknowledgeStatus && packInfo.acknowledgeStatus != "reject")
				{
					var result = userSubscribedPacks.update({"_id":data},
						{$set:{"acknowledgeStatus":"reject"}});
					if(result)
					{
						//AdminPayToSeller
						var resultJson = {};
						resultJson["status"] = "success";
						resultJson["response"] = "Successfully rejected!!"
						
						var dataJson = {};
						dataJson["_id"] = data;
						var result1 = await Meteor.call("fetchBasicPackageDetails",dataJson)
						try
						{
							if(result1)
							{
								if(result1.status && result1.status == "success")
								{
									if(result1.data)
										resultJson["dataContext"] = result1.data;

								}
							}
						}catch(e){}

						return resultJson;
					}
				}
				else
				{
					if(packInfo.acknowledgeStatus && packageInfo.acknowledgeStatus == "reject")
					{
						var resultJson = {};
						resultJson["status"] = "failure";
						resultJson["response"] = "Package has already been rejected!!"
						return resultJson;
					}
					
				}
			}	
			else
			{
				var resultJson = {};
				resultJson["status"] = "failure";
				resultJson["response"] = "Invalid pack!!"
				return resultJson;

			}


		}catch(e){
				return e;
				var resultJson = {};
				resultJson["status"] = "failure";
				resultJson["response"] = e
				return resultJson;
		}
	},
	"holdOnService":async function(data)
	{
		try{
			var packInfo = userSubscribedPacks.findOne({"_id":data});
			if(packInfo)
			{
				if(packInfo.acknowledgeStatus && packInfo.acknowledgeStatus != "onHold")
				{
					var result = userSubscribedPacks.update({"_id":data},
						{$set:{"acknowledgeStatus":"onHold"}});
					if(result)
					{
						//AdminPayToSeller
						var resultJson = {};
						resultJson["status"] = "success";
						resultJson["response"] = "Successfully package is been on hold!!"
						
						var dataJson = {};
						dataJson["_id"] = data;
						var result1 = await Meteor.call("fetchBasicPackageDetails",dataJson)
						try
						{
							if(result1)
							{
								if(result1.status && result1.status == "success")
								{
									if(result1.data)
										resultJson["dataContext"] = result1.data;

								}
							}
						}catch(e){}
						return resultJson;
					}
				}
				else
				{
					if(packInfo.acknowledgeStatus && packageInfo.acknowledgeStatus == "onHold")
					{
						var resultJson = {};
						resultJson["status"] = "failure";
						resultJson["response"] = "Package has already been on hold!!"
						return resultJson;
					}	
				}
			}	
			else
			{
				var resultJson = {};
				resultJson["status"] = "failure";
				resultJson["response"] = "Invalid pack!!"
				return resultJson;
			}


		}catch(e){
				return e;
		}
	},
})