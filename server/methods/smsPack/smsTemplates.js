
Meteor.methods({

	"fetchSMSTemplate":function(xData)
	{
		try{
			var smsTemplate = "";
			xData.application = "iPlayOn";
			if(xData && xData.type)
			{
				if(xData.type == "otpRegister" || xData.type == "phoneVerification" || xData.type == "otpPassword")
				{
					smsTemplate = "Your" + xData.application + "verification code is  "+ xData.otp;

				}
				
				else if(xData.type == "packBought")
				{
					smsTemplate = "Hi " + xData.packOwner + ", new purchase of '"+xData.packName+"' by " + xData.subscriberName +  " Rs:" + xData.amount + " on " + xData.paidDate;
					if(xData.transactionId)
						smsTemplate += ". RefID :" + xData.transactionId 
					
				}
				else if(xData.type == "packTransBySeller")
				{
					//accept - rejected - on hold
					smsTemplate = "Hi "+xData.subscriberName+", your purchase of '"+xData.packName+"' is "+xData.packTrans+" by "+xData.packOwner;
				}
				else if(xData.type == "packSellerInvoice")
				{
					smsTemplate = "Hi "+xData.adminName+", Coach "+xData.packOwner+" has raised invoice of amount Rs."+xData.sellerAmount+" for '"+xData.packName+"'' against RefId:"+xData._id+".";
				}
				else if(xData.type == "adminPayToSeller")
				{
					smsTemplate = "Hi "+xData.sellerName+", we just paid you Rs "+xData.sellerAmount+" against invoice #"+xData._id+" - "+xData.packAdmin;

				}
				else if(xData.type == "roleRegister")
				{
					smsTemplate = "Hi "+xData.userName+". Welcome to iPlayOn. Thanks for registering. You are registered as "+xData.role+" and affiliated to ";
					if(xData.affiliationName)
						smsTemplate += xData.affiliationName+".";
					else
						smsTemplate += "none.";
				}
				else if(xData.type == "roleOtherRegister")
				{
					smsTemplate = "Hi "+xData.userName+". Welcome to iPlayOn. Thanks for registering. You are registered as "+xData.role+".";
					
				}
				else if(xData.type == "roleAffiliated")
				{
					smsTemplate = "Hi "+xData.userName+".You are now affiliated to "+xData.affiliationName+".";
				}
				else if(xData.type == "academyRegViaAssoc")
				{
					smsTemplate = "Hi "+xData.userName+". Welcome to iPlayOn. Thanks for registering. You are registered as an Academy under "+xData.affiliationName+".";				
				}
				else if(xData.type == "eventSubscription")
				{
					smsTemplate = "Hi "+xData.userName+", confirming your subscription to events "+xData.events+ " @ "+xData.tournamentDate+".";
//+"Tournament '" +xData.tournamentName+"' @ iPlayOn.";
					smsTemplate += "Total Entry Fee: Rs."+xData.totEntryFee+".";
					if(xData.transactionId) 
						smsTemplate += "RefID:" +xData.transactionId+".";
					smsTemplate += "Check your app for status and update.";
 
				}
				return smsTemplate;

				//player entries
				//team entries
				//academy entries
				//da entries

			}

		}catch(e)
		{

		}
	}
})
