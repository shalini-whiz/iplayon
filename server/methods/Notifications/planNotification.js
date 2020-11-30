userSubscribedPacks.after.insert(function(userId, doc) {
    try {

        if (doc) 
        {
            data = doc;

            var entryExists = userSubscribedPacks.findOne({
                "_id": doc._id,
            });

            if (entryExists) 
            {
                var senderName = "";
                var senderId = "";
                var topic = "";
                var topicType = "";
                var userInfo;
                var subscriberName = "";
                var packOwner = "";
                var packName = "";

                var userInfo = Meteor.users.findOne({
                    "_id": data.userId
                   });


                var packOwnerInfo = Meteor.users.findOne({
                    "userId": data.packPayToUserId
                   });

                var packInfo = articlesOfPublisher.findOne({
        				"_id":doc.packId
					 	});

                if(userInfo && packOwnerInfo && packInfo)
                {
                	packName = packInfo.title;
                	packOwner = packOwnerInfo.userName;
                    subscriberName = userInfo.userName;       

                    topicType = 1;
	         		topic = data.packPayToUserId;    

	         		var notifyData = {
	                    "title": "New Pack Subscriber",
	                    "body": subscriberName+" subscribed to "+packName,
	                    "sound": "default",
	                    "badge": "0",
	                    "topic": topic,
	                    "categoryIdentifier": "newSubscriber"
                	}


	                var dataParam = {};
	                dataParam["_id"] = doc._id;
	                dataParam["packOwnerId"] = doc.packPayToUserId;
	                dataParam["subscriberId"] = doc.userId;
	                dataParam["packId"] = doc.packId;

                	Meteor.call("sendNotification", notifyData, dataParam, topicType, function(e, res) {})
                
                    var absoluteUrl = Meteor.absoluteUrl().toString();
                    var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));

                    var emailContext = {
                        "packageName":packName,
                        "sellerName":packOwner,
                        "buyerName":subscriberName,
                        "packageAmount" : entryExists.buyerAmount,
                        "packageBought":moment(new Date(entryExists.paidDate)).format("DD MMM YYYY"),
                        "imageURL":absoluteUrlString,
                    }

                    
                    var finAdmin = apiUsers.findOne({"source" : "ip_finance"})
                    if(finAdmin)                   
                        financeAdminID = finAdmin.userId;
                            
                                    
                    SSR.compileTemplate('newPack', Assets.getText('newPack.html'));
                    Template.newPack.helpers({
                        getDocType: function() {
                            return "<!DOCTYPE html>";
                        },
                            
                    });

                    var html_string = SSR.render('newPack', emailContext);

                    var ccUserId= [entryExists.userId,financeAdminID];
                    var toMailAddress = "";



                    var options = {
                        from: "iplayon.in@gmail.com",
                        //to:buyerEmailID,
                        //cc:ccMails,
                        subject: "New Pack Subscriber",
                        html: html_string
                    }


                    //var smsTemplate = "Hi "+packOwner+", "+subscriberName+" bought the pack '"+packName+"' of amount Rs."+doc.buyerAmount+" on "+moment(new Date(entryExists.paidDate)).format("DD MMM YYYY");
                   // if( (entryExists.amount > 0 && entryExists.buyerAmount > 0))
                       // smsTemplate +=". Transaction ID :"+entryExists.transactionId;

                    var smsData = {};
                    smsData["type"] = "packBought";
                    smsData["packOwner"] = packOwner;
                    smsData["packName"] = packName;
                    smsData["subscriberName"] = subscriberName;
                    smsData["amount"] = doc.buyerAmount;
                    smsData["paidDate"] = moment(new Date(entryExists.paidDate)).format("DD-MM-YYYY");
                    if((entryExists.amount > 0 && entryExists.buyerAmount > 0) && entryExists.transactionId)
                        smsData["transactionId"] = entryExists.transactionId;


                    smsTemplate = Meteor.call("fetchSMSTemplate",smsData);



                    Meteor.call("sendSMSEmailNotification",entryExists.packPayToUserId,smsTemplate,options,ccUserId,function(error,result){
                                       
                    }); 
                    

                }
            }
        }
    } catch (e) {
    }
});


userSubscribedPacks.after.update(function(userId, doc, fieldNames, modifier, options) {
    try {

        if (doc) 
        {
            data = doc;

            var entryExists = userSubscribedPacks.findOne({
                "_id": doc._id,
            });

			
            if (entryExists) 
            {
                var senderName = "";
                var senderId = "";
                var topic = "";
                var topicType = "";
                var userInfo;
                var subscriberName = "";
                var packOwner = "";
                var packName = "";

                var userInfo = Meteor.users.findOne({
                    "_id": data.userId
                   });


                var packOwnerInfo = Meteor.users.findOne({
                    "userId": data.packPayToUserId
                   });

                var packInfo = articlesOfPublisher.findOne({
        				"_id":doc.packId
					 	});

                if(userInfo && packOwnerInfo && packInfo)
                {
                	packName = packInfo.title;
                	packOwner = packOwnerInfo.userName;
                    subscriberName = userInfo.userName;       

                    topicType = 1;
	         		if(fieldNames.indexOf("acknowledgeStatus") > -1)
	         		{

	         			var title = "";
	         			var message = "";
                        var smsTemplate = "";
                        var emailSub = "";
                        var smsData = {};
	         			if(doc.acknowledgeStatus == "accept")
	         			{
	         				title = "Subscribed pack accepted";
	         				message = packOwner+" accepted "+packName;
                           // smsTemplate = "Hi "+subscriberName+", "+packOwner+" has accepted your pack '"+packName+"'";
	         			    emailSub = "Service Acknowledged"
                            smsData = {};
                            smsData["type"] = "packTransBySeller";
                            smsData["subscriberName"] = subscriberName;
                            smsData["packName"] = packName;
                            smsData["packTrans"] = "accepted";  
                            smsData["packOwner"] = packOwner;



                        }
	         			else if(doc.acknowledgeStatus == "reject")
	         			{
	         				title = "Subscribed pack rejected";
	         				message = packOwner+" rejected "+packName;
	         			    //smsTemplate = "Hi "+subscriberName+", "+packOwner+" has rejected your pack '"+packName+"'";
                            emailSub = "Service Rejected"

                            smsData = {};
                            smsData["type"] = "packTransBySeller";
                            smsData["subscriberName"] = subscriberName;
                            smsData["packName"] = packName;
                            smsData["packTrans"] = "rejected";  
                            smsData["packOwner"] = packOwner;

                        }
	         			else if(doc.acknowledgeStatus == "onHold")
	         			{
	         				title = "Subscribed pack on hold";
	         				message = packOwner+" has kept "+packName+" on hold ";
	         			    //smsTemplate = "Hi "+subscriberName+", "+packOwner+" has kept on hold your pack '"+packName+"'";
                            emailSub = "Service On Hold"

                            smsData = {};
                            smsData["type"] = "packTransBySeller";
                            smsData["subscriberName"] = subscriberName;
                            smsData["packName"] = packName;
                            smsData["packTrans"] = "on hold";  
                            smsData["packOwner"] = packOwner;

                        }

	         			topic = data.userId;
	         			topicType = 1;
                        var buyerEmailID = "";
                        var sellerEmailID = "";
                        var adminEmailID = "";
                        var financeAdminID = "";

                        var absoluteUrl = Meteor.absoluteUrl().toString();
                        var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));

                        var emailContext = {
                            "packageName":packName,
                            "sellerName":packOwner,
                            "buyerName":subscriberName,
                            "packageAmount" : entryExists.buyerAmount,
                            "packageBought":moment(new Date(entryExists.paidDate)).format("DD MMM YYYY"),
                            "imageURL":absoluteUrlString,
                            "typeOfAck":entryExists.acknowledgeStatus
                        }

                        var buyerInfo = Meteor.users.findOne({"userId":entryExists.userId});
                        if(buyerInfo && buyerInfo.emailAddress)
                        {                           
                            buyerEmailID = buyerInfo.emailAddress;
                        }

                        var finAdmin = apiUsers.findOne({"source" : "ip_finance"})
                        if(finAdmin)
                        {
                            financeAdminID = finAdmin.userId;
                            
                        }
                        

                        SSR.compileTemplate('sellerAcknowledgePack', Assets.getText('sellerAcknowledgePack.html'));
                        Template.sellerAcknowledgePack.helpers({
                            getDocType: function() {
                                return "<!DOCTYPE html>";
                            },
                            typeOf: function(data1,data2) {
                                if(data1 == data2)
                                    return true;
                            }
                        });

                        var html_string = SSR.render('sellerAcknowledgePack', emailContext);

                        var ccUserId= [entryExists.packPayToUserId,financeAdminID]

                        var options = {
                            from: "iplayon.in@gmail.com",
                            to:buyerEmailID,
                            //cc:ccMails,
                            subject: emailSub,
                            html: html_string
                        }
	         		
                        var notifyData = {
                            "title": title,
                            "body": message,
                            "sound": "default",
                            "badge": "0",
                            "topic": topic,
                            "categoryIdentifier": "updateSubscribedPack"
                        }



                        var dataParam = {};
                        dataParam["_id"] = doc._id;
                        dataParam["packOwnerId"] = doc.packPayToUserId;
                        dataParam["subscriberId"] = doc.userId;
                        dataParam["packId"] = doc.packId;

                        Meteor.call("sendNotification", notifyData, dataParam, topicType, function(e, res) {})


                        smsTemplate = Meteor.call("fetchSMSTemplate",smsData);
                    
                        Meteor.call("sendSMSEmailNotification",entryExists.userId,smsTemplate,options,ccUserId,function(error,result){
                            
                            
                        }); 

                        if(entryExists.acknowledgeStatus == "accept" && entryExists.buyerAmount != "0" && entryExists.amount != "0")
                        {
                                                         
                            var paramData = {};
                            paramData["_id"] = doc._id;  
                            Meteor.call("fetchPackageDetails",paramData,function(error,result)
                            {
                                if(result)
                                {
                                    if(result.status && result.status == "success")
                                    {
                                        var invoiceContext = result.data;
                                        var amtAfterCommission = (parseFloat(entryExists.commissionRate) / 100 ) * parseFloat(entryExists.amount);  
                                        var amtWithOutTax = parseInt(entryExists.amount) - amtAfterCommission;
                                        invoiceContext["sellerPayablePrice"] = amtWithOutTax;
                           
                                        invoiceContext["sellerAmount"] = entryExists.sellerAmount;
                                        if(entryExists.sellerTaxLiable == "yes")
                                        {
                                                            
                                            var calcTaxAmt = (parseFloat(entryExists.sellerTax ) / 100 ) * parseFloat(amtWithOutTax);
                                            var calcAmt = parseFloat(amtWithOutTax) - parseFloat(calcTaxAmt);               
                                            invoiceContext["sellerTaxAmount"] = calcTaxAmt;
                                                            
                                        }
                                        else
                                        {
                                            invoiceContext["sellerTaxAmount"] = "0";

                                        }
                                        SSR.compileTemplate('sellerRaiseInvoiceToAdmin', Assets.getText('sellerRaiseInvoiceToAdmin.html'));
                                        Template.sellerRaiseInvoiceToAdmin.helpers({
                                            getDocType: function() {
                                                return "<!DOCTYPE html>";
                                            },
                                            
                                        });

                                        var html_string = SSR.render('sellerRaiseInvoiceToAdmin', invoiceContext);

                                        var ccUserId= [entryExists.packPayToUserId]

                                        var options = {
                                            from: "iplayon.in@gmail.com",
                                            //to:financeAdminID,
                                            //cc:ccMails,
                                            subject: "Invoice Generation",
                                            html: html_string
                                        }
                                        //smsTemplate = "Hi "+invoiceContext.adminName+", "+packOwner+ " has raised invoice of amount Rs."+doc.sellerAmount+" on the pack '"+packName+"' with the order id"+doc._id
                                        
                                        var smsData = {};
                                        smsData["adminName"] = invoiceContext.adminName;
                                        smsData["packOwner"] = packOwner;
                                        smsData["sellerAmount"] = doc.sellerAmount;
                                        smsData["packName"] = packName;
                                        smsData["_id"] = doc._id;
                                        smsData["type"] = "packSellerInvoice";

                                        smsTemplate = Meteor.call("fetchSMSTemplate",smsData);
                                        //smsTemplate = "Hi "+xData.adminName+", Coach "+xData.packOwner+" has raised invoice of amount Rs."+xData.sellerAmount+" for '"+xData.packName+"'' against RefId:"+xData._id+".";


                                        Meteor.call("sendSMSEmailNotification",financeAdminID,smsTemplate,options,ccUserId,function(error,result){
                                           
                                        }); 
                    

                                    }
                                }
                            });
                            


                            
                        } 

                    }	
                }
            }
        }
    } catch (e) {
    }
});