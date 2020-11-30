Template.adminFinance.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("checkForApiAccess");
	this.subscribe("userSubscribedPacks");
	this.subscribe("publishPackages");
	this.subscribe("usersInPackage");
	this.subscribe("lastInsertedAffId");
	this.subscribe("accountDetailsPub");
	this.subscribe("taxDetailsPub");


});

Template.adminFinance.onRendered(function(){
	Session.set("adminFinanceTrans",undefined);
	Session.set("currentTax",undefined);
	Session.set("currentCGST",undefined);
	Session.set("currentSGST",undefined);
	Session.set("currentCommission",undefined)


});

Template.adminFinance.helpers({
	"notAdmin":function(){
		try{
			var xx =apiUsers.find({}).fetch();
			var auth = apiUsers.findOne({"userId":Meteor.userId()});
			if(auth)	
				return false;	
			else
				return true;
			
		}catch(e){
		}
	}
	
	
});

Template.adminFinance.events({
	'click #packageBtn':function(e)
	{
		$("#packageDiv").empty();
		$("#pendingPayDiv").empty();
		$("#sellerServicesDiv").empty();

		Session.set("adminFinanceTrans","adminPackages")
		$('#packageBtn').removeClass("ip_button_DarkGrey");
  		$('#packageBtn').addClass("ip_button_White");
  		$('#pendingPayBtn').removeClass("ip_button_White");
  		$('#pendingPayBtn').addClass("ip_button_DarkGrey");
		$('#pendingServicesBtn').removeClass("ip_button_White");
  		$('#pendingServicesBtn').addClass("ip_button_DarkGrey");
  		

		$("#filterSelectionForm").empty();
        Blaze.render(Template.packageSelectionForm, $("#filterSelectionForm")[0]);

		Blaze.render(Template.adminPackage, $("#packageDiv")[0]);
	
		

	},
	'click #pendingPayBtn':function(e)
	{
		$("#packageDiv").empty();
		$("#pendingPayDiv").empty();
		$("#sellerServicesDiv").empty();

		Session.set("adminFinanceTrans","adminPendingPackages")

		$('#pendingPayBtn').removeClass("ip_button_DarkGrey");
  		$('#pendingPayBtn').addClass("ip_button_White");
  		$('#packageBtn').removeClass("ip_button_White");
  		$('#packageBtn').addClass("ip_button_DarkGrey");
  		$('#pendingServicesBtn').removeClass("ip_button_White");
  		$('#pendingServicesBtn').addClass("ip_button_DarkGrey");

		$("#filterSelectionForm").empty();
        Blaze.render(Template.packageSelectionForm, $("#filterSelectionForm")[0]);

		Blaze.render(Template.adminPendingPay, $("#pendingPayDiv")[0]);
	},
	"click #pendingServicesBtn":function(e)
	{
		$("#packageDiv").empty();
		$("#pendingPayDiv").empty();
		$("#sellerServicesDiv").empty();

		Session.set("adminFinanceTrans","pendingSellerServices")

		$('#pendingPayBtn').removeClass("ip_button_White");
  		$('#pendingPayBtn').addClass("ip_button_DarkGrey");
  		$('#packageBtn').removeClass("ip_button_White");
  		$('#packageBtn').addClass("ip_button_DarkGrey");
  		$('#pendingServicesBtn').removeClass("ip_button_DarkGrey");
  		$('#pendingServicesBtn').addClass("ip_button_White");

		$("#filterSelectionForm").empty();
        Blaze.render(Template.packageSelectionForm, $("#filterSelectionForm")[0]);

		Blaze.render(Template.adminSellerServices, $("#sellerServicesDiv")[0]);
	},
	
})




/************************ selection filters *****************/
Template.packageSelectionForm.onCreated(function(){
	Session.set("pack_buyer",undefined);
	Session.set("pack_seller",undefined);
	Session.set("pack_id",undefined);
	Session.set("pack_startDate",undefined);	
	Session.set("pack_endDate",undefined);	
	Session.set("condJson",undefined);	

})

Template.packageSelectionForm.helpers({
	"buyerList":function()
	{
		if(Session.get("adminFinanceTrans") != undefined)
		{
			if(Session.get("adminFinanceTrans") == "adminPackages")
			{
		    	var transactions = userSubscribedPacks.find({"adminTransaction" : "paid"}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.userId})
				return packList;
			}
			else if(Session.get("adminFinanceTrans") == "adminPendingPackages")
			{
				//var packList = userSubscribedPacks.find({"adminTransaction" : "not paid"}).fetch();	
				var transactions = userSubscribedPacks.find({"adminTransaction" : "not paid"}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.userId})
				return packList;
			}
			else if(Session.get("adminFinanceTrans") == "pendingSellerServices")
			{
				var transactions = userSubscribedPacks.find({"acknowledgeStatus" : {$nin:["accept"]}}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.userId})
				return packList;
			}
			else
			{
				var transactions = userSubscribedPacks.find({}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.userId})
				return packList;
			}
		}
				
		
	},
	"sellerList":function()
	{
		if(Session.get("adminFinanceTrans") != undefined)
		{
			if(Session.get("adminFinanceTrans") == "adminPackages")
			{
		    	var transactions = userSubscribedPacks.find({"adminTransaction" : "paid"}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.packPayToUserId})
				return packList;
			}
			else if(Session.get("adminFinanceTrans") == "adminPendingPackages")
			{
				//var packList = userSubscribedPacks.find({"adminTransaction" : "not paid"}).fetch();	
				var transactions = userSubscribedPacks.find({"adminTransaction" : "not paid"}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.packPayToUserId})
				return packList;
			}
			else if(Session.get("adminFinanceTrans") == "pendingSellerServices")
			{
				var transactions = userSubscribedPacks.find({"acknowledgeStatus" : {$nin:["accept"]}}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.packPayToUserId})
				return packList;
			}
			else
			{
				var transactions = userSubscribedPacks.find({}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.packPayToUserId})
				return packList;
			}
		}
	},
	"packageList":function()
	{
		if(Session.get("adminFinanceTrans") != undefined)
		{
			if(Session.get("adminFinanceTrans") == "adminPackages")
			{
		    	var transactions = userSubscribedPacks.find({"adminTransaction" : "paid"}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.packId})
				return packList;
			}
			else if(Session.get("adminFinanceTrans") == "adminPendingPackages")
			{
				//var packList = userSubscribedPacks.find({"adminTransaction" : "not paid"}).fetch();	
				var transactions = userSubscribedPacks.find({"adminTransaction" : "not paid"}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.packId})
				return packList;
			}
			else if(Session.get("adminFinanceTrans") == "pendingSellerServices")
			{
				var transactions = userSubscribedPacks.find({"acknowledgeStatus" : {$nin:["accept"]}}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.packId})
				return packList;
			}
			else
			{
				var transactions = userSubscribedPacks.find({}).fetch();				 
				var packList = _.uniq(transactions, false, function(transaction) {return transaction.packId})
				return packList;
			}
		}
	}
});

Template.packageSelectionForm.events({
	'click #buyerList': function(e,template) {
        $('#buyerList').bind("keydown change", function() {
            var obj = $(this);

            setTimeout(function() {
                var buyerID = $("[name='buyerList'] option:selected").attr("name");
                Session.set("pack_buyer", buyerID);

            }, 0);
        });
    },
    'click #sellerList': function(e) {
        $('#sellerList').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var sellerID = $("[name='sellerList'] option:selected").attr("name");
                Session.set("pack_seller", sellerID);

            }, 0);
        });
    },
    'click #packageList': function(e) {
        $('#packageList').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var packID = $("[name='packageList'] option:selected").attr("name");
                Session.set("pack_id", packID);

            }, 0);
        });
    },
    
    'keyup #fromDate,focusout #fromDate': function(e) 
    {
    	var fromDate = $('#fromDate').val();
    	Session.set("pack_startDate",undefined);	

		if($('#fromDate').val()=="")
		{
			$("#fromDate").css("color","#000");
			Session.set("pack_startDate",undefined);	

		}
		else
		{
			var text = $('#fromDate').val().trim();
			var comp = text.split(" ");
			if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
			{
				var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
				var comp2 = comp[1].toLowerCase();
				var monthNum = parseInt(months.indexOf(comp2)+1);
				var d = parseInt(comp[0]);
				var m = parseInt(monthNum);
				var y = parseInt(comp[2]);
				var date = new Date(y,m-1,d);
				if (date.getFullYear() == y && comp[2].length == 4 && date.getMonth() + 1 == m && date.getDate() == d) {
					$("#fromDate").css("color","#000");
					Session.set("pack_startDate",$("#fromDate").val());	

				} else {
					$('#fromDate').css('color', '#ff1a1a');
					Session.set("pack_startDate",undefined);	

				}
			}
			else 
			{
				$('#fromDate').css('color', '#ff1a1a');
				Session.set("pack_startDate",undefined);	

			}
			 	
		}
    },
    'keyup #endDate,focusout #endDate': function(e) 
    {
    	Session.set("pack_endDate",undefined);	
    	var endDate = $('#endDate').val();
		if($('#endDate').val()=="")
		{
			$("#endDate").css("color","#000");
			Session.set("pack_endDate",undefined);	

		}
		else
		{
			var text = $('#endDate').val().trim();
			var comp = text.split(" ");
			if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3)
			{
				var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
				var comp2 = comp[1].toLowerCase();
				var monthNum = parseInt(months.indexOf(comp2)+1);
				var d = parseInt(comp[0]);
				var m = parseInt(monthNum);
				var y = parseInt(comp[2]);
				var date = new Date(y,m-1,d);
				if (date.getFullYear() == y && comp[2].length == 4 && date.getMonth() + 1 == m && date.getDate() == d) {
					$("#endDate").css("color","#000");
					Session.set("pack_endDate",$("#endDate").val());	

				} else {
					$('#endDate').css('color', '#ff1a1a');
					Session.set("pack_endDate",undefined);	


				}
			}
			else 
			{
				$('#endDate').css('color', '#ff1a1a');
				Session.set("pack_endDate",undefined);	
			}
			 	
		}
    },
    'click #adminFinDownload': function(e) {
    	var condJson = Session.get("condJson");
    	Meteor.call("adminFinanceDownload",condJson,function(error,result)
    	{
    		if(result)
    		{
    			if(result.length > 0)
    			{
    				var csv = Papa.unparse(result);
    				var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
	   				var link = document.createElement("a");    
	    			link.href = uri;
	    			link.style = "visibility:hidden";
	    			link.download = "Admin_Finance_Payments.csv";
	    
	    			document.body.appendChild(link);
	    			link.click();
	    			document.body.removeChild(link);  
    			}
    		}
    		else
    			displayMessage(error)
    	})
    },
})
/************************ admin package functionalities ***************************/


Template.adminPackage.onCreated(function(){
	
});

Template.adminPackage.helpers({
	"packageList":function()
	{
		try{
			
			var condJson = {};
			condJson["adminTransaction"] = "paid";
			if(Session.get("pack_buyer") != undefined && Session.get("pack_buyer") != "All")		
				condJson["userId"] = Session.get("pack_buyer");
			
			if(Session.get("pack_seller") != undefined && Session.get("pack_seller") != "All")
				condJson["packPayToUserId"] = Session.get("pack_seller");
			if(Session.get("pack_id") != undefined && Session.get("pack_id") != "All")
				condJson["packId"] = Session.get("pack_id");
			
			if(Session.get("pack_startDate") != undefined && 
				Session.get("pack_startDate") != "" && 
				Session.get("pack_endDate") != undefined 
				&& Session.get("pack_endDate") != "")
			{
				var valStartDate = moment(new Date(Session.get("pack_startDate"))).format("YYYY-MM-DD");
				var calcDate = new Date(Session.get("pack_endDate"));
				var valEndDate = moment(calcDate.setDate(calcDate.getDate()+1)).format("YYYY-MM-DD");

				condJson["paidDate"]= {
					$gte:new Date(valStartDate),
					$lt:new Date(valEndDate)
				}
				
			}
			else if(Session.get("pack_startDate") != undefined && Session.get("pack_startDate") != "")		
				condJson["paidDate"]= {$gte:new Date(moment(new Date(Session.get("pack_startDate"))).format("YYYY-MM-DD"))} ;
			
			else if(Session.get("pack_endDate") != undefined && Session.get("pack_endDate") != "")
				condJson["paidDate"]= {$lte:new Date(moment(new Date(Session.get("pack_endDate"))).format("YYYY-MM-DD"))} ;
			
			Session.set("condJson",condJson);
			var packList = userSubscribedPacks.find(condJson).fetch();
			packList.map(function(document, index) {
			            	document["slNo"] = parseInt(index + 1);
			        	});
			return packList;
		}catch(e){
		}
	}
	
})

Template.adminPackage.events({
	
})

/************************ admin pending pay functionalities ************************/
Template.adminPendingPay.onCreated(function(){
	this.invoiceID = new ReactiveVar(undefined);
	
});

Template.adminPendingPay.helpers({
	"packageList":function()
	{
		var condJson = {};
		condJson["adminTransaction"] = "not paid";
		condJson["acknowledgeStatus"] = "accept";

		if(Session.get("pack_buyer") != undefined && Session.get("pack_buyer") != "All")		
			condJson["userId"] = Session.get("pack_buyer");
			
		if(Session.get("pack_seller") != undefined && Session.get("pack_seller") != "All")
			condJson["packPayToUserId"] = Session.get("pack_seller");
		if(Session.get("pack_id") != undefined && Session.get("pack_id") != "All")
			condJson["packId"] = Session.get("pack_id");
			
		if(Session.get("pack_startDate") != undefined && 
			Session.get("pack_startDate") != "" && 
			Session.get("pack_endDate") != undefined 
			&& Session.get("pack_endDate") != "")
		{
			var valStartDate = moment(new Date(Session.get("pack_startDate"))).format("YYYY-MM-DD");
			var calcDate = new Date(Session.get("pack_endDate"));
			var valEndDate = moment(calcDate.setDate(calcDate.getDate()+1)).format("YYYY-MM-DD");

			condJson["paidDate"]= {
				$gte:new Date(valStartDate),
				$lt:new Date(valEndDate)
			}
				
		}
		else if(Session.get("pack_startDate") != undefined && Session.get("pack_startDate") != "")		
			condJson["paidDate"]= {$gte:new Date(moment(new Date(Session.get("pack_startDate"))).format("YYYY-MM-DD"))} ;
			
		else if(Session.get("pack_endDate") != undefined && Session.get("pack_endDate") != "")
			condJson["paidDate"]= {$lte:new Date(moment(new Date(Session.get("pack_endDate"))).format("YYYY-MM-DD"))} ;
			
		Session.set("condJson",condJson);

		var packList = userSubscribedPacks.find(condJson).fetch();
		packList.map(function(document, index) {
		            	document["slNo"] = parseInt(index + 1);
		        	});
		return packList;
	},
	"adminFinanceStatus":function(data)
	{
		try{


			if(data.adminTransaction == "not paid" && data.acknowledgeStatus == "accept")
				return true;
		}catch(e){

		}
	},
	"invoiceMsg":function()
	{
		if(Session.get("currentTax") != undefined)
			return "Invoice Generation @ "+Session.get("currentTax")+"%"
	}
})

Template.adminPendingPay.events({
	"click #editFinanceStatus":function(e,template)
	{
		e.preventDefault();
		var jsonData = {};
		jsonData["_id"] = this._id;
		jsonData["paidDate"] = this.paidDate;
		jsonData["packId"] = this.packId;
		jsonData["buyerID"] = this.userId;
		jsonData["sellerID"] = this.packPayToUserId;
		jsonData["sellerAmount"] = "";


		if(Session.get("currentCommission") != undefined)
		{
			var amtAfterCommission = (parseFloat(Session.get("currentCommission")) / 100 ) * parseFloat(this.amount);	
			var amtWithOutTax = parseInt(this.amount) - amtAfterCommission;
			var data2 = this.packPayToUserId;
			var accInfo = accountDetails.findOne({"userId":data2});
			if(accInfo && accInfo.taxLiable)
			{
				if(accInfo.taxLiable == "yes")
				{
					if(this.taxRate && this.cgstTax && this.sgstTax)
					{
						var calcTaxAmt = (parseFloat(this.taxRate ) / 100 ) * parseFloat(amtWithOutTax);
						var calcAmt = parseFloat(calcTaxAmt) + amtWithOutTax;				
						jsonData["sellerAmount"] = calcAmt.toFixed(2);
					}
					else
					jsonData["sellerAmount"] = amtWithOutTax;
				}
				else
					jsonData["sellerAmount"] = amtWithOutTax;

			}
			else
				jsonData["sellerAmount"] = amtWithOutTax;


			template.invoiceID.set(jsonData);
		
			if(Session.get("currentTax") != undefined)
				$("#infoMsg").text("Invoice  @ "+Session.get("currentTax")+"%");

			$("#adminReceiptModal").modal({
	                        backdrop: 'static',
	                        keyboard: false
	                    });

		}
		else
			displayMessage("Commission is not been set");





		

	},
	 'click #yesButton': function(e, template) {
        try{
        var jsonData = Template.instance().invoiceID.get();
        if(jsonData._id && jsonData.paidDate && jsonData.packId)
        {
			var buyerID = jsonData.buyerID;
			var sellerID = jsonData.sellerID;

			var dataJson = {};
			dataJson["_id"] = jsonData._id;
			dataJson["tax"] = Session.get("currentTax");
			dataJson["commission"] = Session.get("currentCommission");
			dataJson["sellerAmount"] = jsonData.sellerAmount;
        	dataJson["sellerTaxLiable"] = "";

        	var accInfo = accountDetails.findOne({"userId":sellerID});
			if(accInfo && accInfo.taxLiable)
			dataJson["sellerTaxLiable"] =  accInfo.taxLiable;

        	Meteor.call("updatePackFinanceStatus",dataJson,function(errore,result)
			{
				if(result)
				{
					if(result.status)
					{
						if(result.data)
							displayMessage(result.data);

						/*
						if(result.status == "success" && result.dataContext)
						{
							var dataContext = result.dataContext
							var ccMails = ["shalini.krishnan90@gmail.com",dataContext.adminEmailID]
				            var html = Blaze.toHTMLWithData(Template.AdminPayToSeller, dataContext);
				            var options = {
				                from: "iplayon.in@gmail.com",
				                to:dataContext.sellerEmailID,
				                cc:ccMails,
				                subject: "Receipt",
				                html: html
				            }
				         	//send mail
						}
						*/
					}          
				}
				if(error)
					displayMessage(error);
			})
       
        	$("#adminReceiptModal").modal('hide');

        }
        
        
        }catch(e){
        	displayMessage(e)
        }
    },
    'click #noButton': function(e) {
        $("#adminReceiptModal").modal('hide');  
    },
})


/****************** pending seller services *********************/


Template.adminSellerServices.onCreated(function(){
	this.invoiceID = new ReactiveVar(undefined);
	
});

Template.adminSellerServices.helpers({
	"packageList":function()
	{
		var condJson = {};
		condJson["adminTransaction"] = "not paid";
		condJson["acknowledgeStatus"] = {$nin:["accept"]};

		if(Session.get("pack_buyer") != undefined && Session.get("pack_buyer") != "All")		
			condJson["userId"] = Session.get("pack_buyer");
			
		if(Session.get("pack_seller") != undefined && Session.get("pack_seller") != "All")
			condJson["packPayToUserId"] = Session.get("pack_seller");
		if(Session.get("pack_id") != undefined && Session.get("pack_id") != "All")
			condJson["packId"] = Session.get("pack_id");
			
		if(Session.get("pack_startDate") != undefined && 
			Session.get("pack_startDate") != "" && 
			Session.get("pack_endDate") != undefined 
			&& Session.get("pack_endDate") != "")
		{
			var valStartDate = moment(new Date(Session.get("pack_startDate"))).format("YYYY-MM-DD");
			var calcDate = new Date(Session.get("pack_endDate"));
			var valEndDate = moment(calcDate.setDate(calcDate.getDate()+1)).format("YYYY-MM-DD");

			condJson["paidDate"]= {
				$gte:new Date(valStartDate),
				$lt:new Date(valEndDate)
			}
				
		}
		else if(Session.get("pack_startDate") != undefined && Session.get("pack_startDate") != "")		
			condJson["paidDate"]= {$gte:new Date(moment(new Date(Session.get("pack_startDate"))).format("YYYY-MM-DD"))} ;
			
		else if(Session.get("pack_endDate") != undefined && Session.get("pack_endDate") != "")
			condJson["paidDate"]= {$lte:new Date(moment(new Date(Session.get("pack_endDate"))).format("YYYY-MM-DD"))} ;
			
		Session.set("condJson",condJson);

		var packList = userSubscribedPacks.find(condJson).fetch();
		packList.map(function(document, index) {
		            	document["slNo"] = parseInt(index + 1);
		        	});
		return packList;
	},
	"adminFinanceStatus":function(data)
	{
		try{


			if(data.adminTransaction == "not paid" && data.acknowledgeStatus == "accept")
				return true;
		}catch(e){

		}
	},
	
})

Template.adminSellerServices.events({
	
})


/*********************** register helpers *******************/
Template.registerHelper("getPackName",function(data){
	try{
		var result = articlesOfPublisher.findOne({"_id":data});
		if(result)
			return result.title;
		
	}catch(e){}
}) 


Template.registerHelper("displayNameOfUser",function(data){
	try{

		var userInfo = Meteor.users.findOne({"userId":data})
		if(userInfo)
		{
			return userInfo.userName;
		}
	}catch(e){}
}) 


Template.registerHelper("getGSTLiable",function(data){
	try{
		var accInfo = accountDetails.findOne({"userId":data});
		if(accInfo && accInfo.taxLiable)
			return accInfo.taxLiable;
	}catch(e){

	}
})




Template.registerHelper("fetchAmtOnTax",function(data1,data2){

	try{
		var accInfo = accountDetails.findOne({"userId":data2});
		if(accInfo && accInfo.taxLiable)
		{
			if(accInfo.taxLiable == "yes")
			{
				var calcTaxAmt = (parseFloat(Session.get("currentTax")) / 100 ) * parseInt(data1);
				var calcAmt = parseInt(data1) + calcTaxAmt;

				var centralGST = (parseFloat(Session.get("currentCGST"))/100) *  parseInt(data1);
				var stateGST = (parseFloat(Session.get("currentSGST"))/100) *  parseInt(data1);

				if(parseInt(data1) > 0)
					return calcAmt+"<p>SGST: "+stateGST+" &nbsp; CGST: "+centralGST+"</p>";
				else
					return calcAmt;
			}
			else
				return data1;

		}
		else
			return data1;
	}catch(e){

	}
})


Template.registerHelper("fetchAmtOnCommission",function(data){

	try{
		var data1 = data.amount;
		if(Session.get("currentCommission") != undefined)
		{
			var amtAfterCommission = (parseFloat(Session.get("currentCommission")) / 100 ) * parseFloat(data1);	
			var amtWithOutTax = parseInt(data1) - amtAfterCommission;
			var data2 = data.packPayToUserId;
			var accInfo = accountDetails.findOne({"userId":data2});
			if(accInfo && accInfo.taxLiable)
			{
				if(accInfo.taxLiable == "yes")
				{
					if(data.taxRate && data.cgstTax && data.sgstTax)
					{
						var calcTaxAmt = (parseFloat(data.taxRate ) / 100 ) * parseFloat(amtWithOutTax);
						var calcAmt = parseFloat(calcTaxAmt) + amtWithOutTax;				
						return calcAmt.toFixed(2);
					}
					else
						return amtWithOutTax;
				}
				else
					return amtWithOutTax;

			}
			else
				return amtWithOutTax;
		}
		else
			return amtWithOutTax;
		
	}catch(e){

	}
})

Template.registerHelper("fetchTaxAmt",function(data){

	try{
		//do here
		//var data1 = data.amount;(product amount)
		var data1 = data.buyerAmount;
		var data2 = data.packPayToUserId;
		var data3 = data.taxRate;

		if(data.taxRate && data.cgstTax && data.sgstTax)
		{
			var calcTaxAmt = (parseFloat(data.taxRate) / 100 ) * parseInt(data1);
			var calcAmt = parseInt(data1) + calcTaxAmt;

			var centralGST = ((parseFloat(data.cgstTax)/100) *  parseInt(data1)).toFixed(2);;
			var stateGST = ((parseFloat(data.sgstTax)/100) *  parseInt(data1)).toFixed(2);

			if(parseInt(data1) > 0)
				return calcAmt+"<p>SGST: "+stateGST+" &nbsp; CGST: "+centralGST+"</p>";
			else
				return calcAmt;
		}
		else
			return data1;
	
		
	}catch(e){

	}
})


