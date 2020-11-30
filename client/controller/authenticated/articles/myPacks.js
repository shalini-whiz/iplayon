Template.myFinance.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	this.subscribe("mySubscribedPacks");
	this.subscribe("publishPackages");
	this.subscribe("usersInPackage");
	this.subscribe("loginBasedProfile");
	this.subscribe("taxDetailsPub");

	Session.set("package_buyer",undefined);
	Session.set("package_seller",undefined);
	Session.set("package_id",undefined);
	Session.set("package_startDate",undefined);	
	Session.set("package_endDate",undefined);	


});

Template.myFinance.onRendered(function(){
	
	Session.set("financeTrans",undefined);

});

Template.myFinance.helpers({
	
});


Template.myFinance.events({
	'click #myServiceBtn':function(e)
	{
		
		$("#myServiceDiv").empty();
		$("#approvedServicesDiv").empty();
		$("#pendingServicesDiv").empty();
		$("#financeTransactionDiv").empty();
		Session.set("financeTrans","myServices");


		$('#myServiceBtn').removeClass("ip_button_DarkGrey");
  		$('#myServiceBtn').addClass("ip_button_White");
		$('#approvedServiceBtn').removeClass("ip_button_White");
  		$('#approvedServiceBtn').addClass("ip_button_DarkGrey");
  		$('#pendingServiceBtn').removeClass("ip_button_White");
  		$('#pendingServiceBtn').addClass("ip_button_DarkGrey");
		$('#financeTransactionBtn').removeClass("ip_button_White");
  		$('#financeTransactionBtn').addClass("ip_button_DarkGrey");

  		$("#filterSelectionForm").empty();
		Blaze.render(Template.myServices, $("#myServiceDiv")[0]);

	},
	'click #approvedServiceBtn':function(e)
	{
		$("#myServiceDiv").empty();
		$("#approvedServicesDiv").empty();
		$("#pendingServicesDiv").empty();
		$("#financeTransactionDiv").empty();

		Session.set("financeTrans","approvedServices");


		$('#approvedServiceBtn').removeClass("ip_button_DarkGrey");
  		$('#approvedServiceBtn').addClass("ip_button_White");
  		$('#pendingServiceBtn').removeClass("ip_button_White");
  		$('#pendingServiceBtn').addClass("ip_button_DarkGrey");
		$('#financeTransactionBtn').removeClass("ip_button_White");
  		$('#financeTransactionBtn').addClass("ip_button_DarkGrey");
  		$('#myServiceBtn').removeClass("ip_button_White");
  		$('#myServiceBtn').addClass("ip_button_DarkGrey");


		$("#filterSelectionForm").empty();
        Blaze.render(Template.myPackageSelectionForm, $("#filterSelectionForm")[0]);
		Blaze.render(Template.myApprovedServices, $("#approvedServicesDiv")[0]);
	
		
	},
	'click #pendingServiceBtn':function(e)
	{
		$("#myServiceDiv").empty();
		$("#approvedServicesDiv").empty();
		$("#pendingServicesDiv").empty();
		$("#financeTransactionDiv").empty();
		Session.set("financeTrans","pendingServices");

		$('#approvedServiceBtn').removeClass("ip_button_White");
  		$('#approvedServiceBtn').addClass("ip_button_DarkGrey");
		$('#pendingServiceBtn').removeClass("ip_button_DarkGrey");
  		$('#pendingServiceBtn').addClass("ip_button_White");
  		$('#financeTransactionBtn').removeClass("ip_button_White");
  		$('#financeTransactionBtn').addClass("ip_button_DarkGrey");
		$('#myServiceBtn').removeClass("ip_button_White");
  		$('#myServiceBtn').addClass("ip_button_DarkGrey");

		$("#filterSelectionForm").empty();
        Blaze.render(Template.myPackageSelectionForm, $("#filterSelectionForm")[0]);
		Blaze.render(Template.myPendingServices, $("#pendingServicesDiv")[0]);
	},

	'click #financeTransactionBtn':function(e)
	{
		$("#myServiceDiv").empty();
		$("#approvedServicesDiv").empty();
		$("#pendingServicesDiv").empty();
		$("#financeTransactionDiv").empty();

		Session.set("financeTrans","financeServices");

		$('#approvedServiceBtn').removeClass("ip_button_White");
  		$('#approvedServiceBtn').addClass("ip_button_DarkGrey");
		$('#pendingServiceBtn').removeClass("ip_button_White");
  		$('#pendingServiceBtn').addClass("ip_button_DarkGrey");
  		$('#financeTransactionBtn').removeClass("ip_button_DarkGrey");
  		$('#financeTransactionBtn').addClass("ip_button_White");
		$('#myServiceBtn').removeClass("ip_button_White");
  		$('#myServiceBtn').addClass("ip_button_DarkGrey");
		$("#filterSelectionForm").empty();
        Blaze.render(Template.myPackageSelectionForm, $("#filterSelectionForm")[0]);
		Blaze.render(Template.myAdminTransaction, $("#financeTransactionDiv")[0]);
	},

	
})

/************************ selection filters *****************/

Template.myPackageSelectionForm.onCreated(function(){
	Session.set("package_buyer",undefined);
	Session.set("package_seller",undefined);
	Session.set("package_id",undefined);
	Session.set("package_startDate",undefined);	
	Session.set("package_endDate",undefined);	
})

Template.myPackageSelectionForm.helpers({
	"my_buyerList":function()
	{
		try{
			if(Session.get("financeTrans") != undefined)
			{
				var condJson = {};
				if(Session.get("financeTrans") == "approvedServices")
					condJson["acknowledgeStatus"] = {$nin:["pending"]}
				else if(Session.get("financeTrans") == "pendingServices")
					condJson["acknowledgeStatus"] = "pending";
				var transactions = userSubscribedPacks.find(condJson).fetch();	
				var packList =  _.uniq(transactions, false, function(item) {return item.userId});
				return packList;


			}
			else
			{
				var packList = userSubscribedPacks.find({}).fetch();	
				return packList;
			}
		}catch(e)
		{
		}
		
	},
	
	"my_packList":function()
	{
		try{
			var condJson = {};
			if(Session.get("financeTrans") != undefined)
			{
				if(Session.get("financeTrans") == "approvedServices")
					condJson["acknowledgeStatus"] = {$nin:["pending"]}
				else if(Session.get("financeTrans") == "pendingServices")
					condJson["acknowledgeStatus"] = "pending";


		var transactions = userSubscribedPacks.find(condJson).fetch();
		var packList =  _.uniq(transactions, false, function(item) {return item.packId});
		return packList;
			}


		}catch(e)
		{
		}
		//var packList = userSubscribedPacks.find({}).fetch();	
		//return packList;
	}
});

Template.myPackageSelectionForm.events({
	'click #buyerList': function(e,template) {
		 //var buyerID = $("[name='buyerList'] option:selected").attr("name");
         //Session.set("package_buyer", buyerID);
        $('#buyerList').bind("keydown change", function() {
            var obj = $(this);

            setTimeout(function() {
                var buyerID = $("[name='buyerList'] option:selected").attr("name");
                Session.set("package_buyer", buyerID);
            }, 0);
        });
    },
    
    'click #packageList': function(e) {
        $('#packageList').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var packID = $("[name='packageList'] option:selected").attr("name");
                Session.set("package_id", packID);

            }, 0);
        });
    },
    
    'keyup #fromDate,focusout #fromDate': function(e) 
    {
    	var fromDate = $('#fromDate').val();
    	Session.set("package_startDate",undefined);	

		if($('#fromDate').val()=="")
		{
			$("#fromDate").css("color","#000");
			Session.set("package_startDate",undefined);	

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
					Session.set("package_startDate",$("#fromDate").val());	

				} else {
					$('#fromDate').css('color', '#ff1a1a');
					Session.set("package_startDate",undefined);	

				}
			}
			else 
			{
				$('#fromDate').css('color', '#ff1a1a');
				Session.set("package_startDate",undefined);	

			}
			 	
		}
    },
    'keyup #endDate,focusout #endDate': function(e) 
    {
    	Session.set("package_endDate",undefined);	
    	var endDate = $('#endDate').val();
		if($('#endDate').val()=="")
		{
			$("#endDate").css("color","#000");
			Session.set("package_endDate",undefined);	

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
					Session.set("package_endDate",$("#endDate").val());	

				} else {
					$('#endDate').css('color', '#ff1a1a');
					Session.set("package_endDate",undefined);	


				}
			}
			else 
			{
				$('#endDate').css('color', '#ff1a1a');
				Session.set("package_endDate",undefined);	
			}
			 	
		}
    }
})



/******************** my services functionalities *******************/


Template.myAdminTransaction.onCreated(function(){
	
});

Template.myAdminTransaction.helpers({
	"financePackageList":function()
	{
		try{
			
			var condJson = {};
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

Template.myAdminTransaction.events({
	
})


/************* register helpers *********/


Template.registerHelper("displayFinanceStatus",function(data){
	try{
		if(data == "accept")
			return "Accepted";
		else if(data == "reject")
			return "Rejected"
		else if(data == "onHold")
			return "On Hold"	
		else
			return data;
	}catch(e){}
}) 


Template.registerHelper("checkFinanceStatus",function(data){
	try{
		if(data == "onHold")
			return true;
		else
			return false;	
	}catch(e){}
}) 