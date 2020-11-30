Template.adminStrokes.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	this.subscribe("tournamentEvents");

});

Template.adminStrokes.onRendered(function(){
	Session.set("strokeType",undefined);
});

Template.adminStrokes.helpers({
	"notAdmin":function(){
		try{
			var emailAddress = Meteor.user().emails[0].address;
			var boolVal = false
			var auth = authAddress.find({}).fetch();
			if(auth){
				for(var i=0;i<auth.length;i++){
					if(emailAddress&&emailAddress==auth[i].data){
						boolVal=false;
					}
					else{
						boolVal=true;
						break;
					}
				};
			}
			return boolVal
		}catch(e){
		}
	}
	
});

Template.adminStrokes.events({
	'click #serviceStrokeBtn':function(e)
	{
		$("#strokeForm").empty();
		Session.set("strokeType","serviceStroke");
		$('#serviceStrokeBtn').removeClass("ip_button_DarkGrey");
  		$('#serviceStrokeBtn').addClass("ip_button_White");
  		$('#strokeBtn').removeClass("ip_button_White");
  		$('#strokeBtn').addClass("ip_button_DarkGrey");
  		$('#destinationPointsBtn').removeClass("ip_button_White");
  		$('#destinationPointsBtn').addClass("ip_button_DarkGrey");

		Blaze.render(Template.servicestrokeDiv, $("#strokeForm")[0]);
	},
	'click #strokeBtn':function(e)
	{
		$("#strokeForm").empty();
		Session.set("strokeType","stroke");
		$('#strokeBtn').removeClass("ip_button_DarkGrey");
  		$('#strokeBtn').addClass("ip_button_White");
  		$('#serviceStrokeBtn').removeClass("ip_button_White");
  		$('#serviceStrokeBtn').addClass("ip_button_DarkGrey");
  		$('#destinationPointsBtn').removeClass("ip_button_White");
  		$('#destinationPointsBtn').addClass("ip_button_DarkGrey");
		Blaze.render(Template.strokeDiv, $("#strokeForm")[0]);
	},
	'click #destinationPointsBtn':function(e)
	{
		$("#strokeForm").empty();
		Session.set("strokeType","destinationPoints");
		$('#destinationPointsBtn').removeClass("ip_button_DarkGrey");
  		$('#destinationPointsBtn').addClass("ip_button_White");
  		$('#serviceStrokeBtn').removeClass("ip_button_White");
  		$('#serviceStrokeBtn').addClass("ip_button_DarkGrey");
  		$('#strokeBtn').removeClass("ip_button_White");
  		$('#strokeBtn').addClass("ip_button_DarkGrey");
		Blaze.render(Template.destinationPointsDiv, $("#strokeForm")[0]);
	},
	'click #analyticsApprovalBtn':function(e)
	{
		$("#strokeForm").empty();
		Session.set("strokeType","AnalyticsApproval");
		$('#analyticsApprovalBtn').removeClass("ip_button_DarkGrey");
  		$('#analyticsApprovalBtn').addClass("ip_button_White"); 		
  		$('#serviceStrokeBtn').removeClass("ip_button_White");
  		$('#serviceStrokeBtn').addClass("ip_button_DarkGrey");
  		$('#strokeBtn').removeClass("ip_button_White");
  		$('#strokeBtn').addClass("ip_button_DarkGrey");
  		$('#destinationPointsBtn').removeClass("ip_button_White");
  		$('#destinationPointsBtn').addClass("ip_button_DarkGrey");
		Blaze.render(Template.analyticsApprovalDiv, $("#strokeForm")[0]);


	},


	
	
})
/************************ strokes functionalities ***************************/

Template.strokeDiv.onCreated(function(){
	this.subscribe("strokeMaster");
	this.subscribe("strokesMasterData");

});

Template.strokeDiv.helpers({
	"strokeList":function()
	{
		return strokes.find({}).fetch();
	},
})

Template.strokeDiv.events({
	"click #adminCreateStroke":function(e)
	{	
		$("#createStrokeDiv").empty();
        Blaze.render(Template.createStroke, $("#createStrokeDiv")[0]);
        $("#createStroke").modal({backdrop: 'static'});			
	},
	"click #deleteStrokeEntry":function(e)
	{
		var strokeID = $(e.target).attr("name");
		Meteor.call("deleteStroke",strokeID,Session.get("strokeType"),function(error,result)
			{
				if(result)
				{
					
				}
			})
	},

})

/***************** service strokes functionalities ***************************/

Template.servicestrokeDiv.onCreated(function(){
		this.subscribe("serviceStrokes");
});

Template.servicestrokeDiv.helpers({
	"strokeList":function()
	{
		
		return serviceStrokes.find({}).fetch();
	}
})

Template.servicestrokeDiv.events({
	"click #adminCreateStroke":function(e)
	{
		$("#createStrokeDiv").empty();
        Blaze.render(Template.createStroke, $("#createStrokeDiv")[0]);
        $("#createStroke").modal({backdrop: 'static'});
	},
	"click #deleteStrokeEntry":function(e)
	{
		var strokeID = $(e.target).attr("name");
		Meteor.call("deleteStroke",strokeID,Session.get("strokeType"),function(error,result)
			{
				if(result)
				{
					
				}
			})
	},

})

/***************** destination points functionalities ***************************/
Template.destinationPointsDiv.onCreated(function(){
	this.subscribe("destinationPoints");
	this.subscribe("destinationPointsMaster");

});

Template.destinationPointsDiv.helpers({
	"strokeList":function()
	{
		return destinationPoints.find({}).fetch();
	}
})

Template.destinationPointsDiv.events({
	"click #adminCreateStroke":function(e)
	{
		$("#createStrokeDiv").empty();
        Blaze.render(Template.createStroke, $("#createStrokeDiv")[0]);
        $("#createStroke").modal({backdrop: 'static'});
	},
	"click #deleteStrokeEntry":function(e)
	{
		var strokeID = $(e.target).attr("name");
		Meteor.call("deleteStroke",strokeID,Session.get("strokeType"),function(error,result)
			{
				if(result)
				{
					
				}
			})
	},

})

/***************** create strokes/destination/approve user functionalities ***************************/

Template.createStroke.helpers({
	 sports: function() {
        try {
            var sportList = tournamentEvents.find({}).fetch();
            if (sportList.length != 0)
                return sportList;
        } catch (e) {}
    },
    destinationType:function()
    {
    	try {
            var destinationList = destinationPointsMaster.findOne({},{fields:{"destinationType":1}});
            var destinationPointTypeList = [];
            if (destinationList && destinationList.destinationType)
            {
            	var destinationType = destinationList.destinationType;
            	destinationPointTypeList.push(destinationType.defaultValue);
            	if(destinationType.valueSet)
            	{
            		for(var x=0; x< destinationType.valueSet.length;x++)
            		{
            			if(destinationPointTypeList.indexOf(destinationType.valueSet[x]) == -1)
            			{
            				destinationPointTypeList.push(destinationType.valueSet[x]);
            			}
            		}
            	}
            	return destinationPointTypeList;
            }
        } catch (e) {}
    },
    "strokeStyleList":function()
	{
		var strokeInfo = strokesMaster.findOne({},{fields:{"strokeStyle":1}});
        var strokeList = [];
            if (strokeInfo && strokeInfo.strokeStyle)
            {
            	var strokeStyle = strokeInfo.strokeStyle;
            	if(strokeStyle.valueSet)
            	{
            		for(var x=0; x< strokeStyle.valueSet.length;x++)
            		{
            			if(strokeList.indexOf(strokeStyle.valueSet[x]) == -1)
            			{
            				strokeList.push(strokeStyle.valueSet[x]);
            			}
            		}
            	}
            	return strokeList;
            }
	}

})
Template.createStroke.events({
	"click #saveStroke":function(e)
	{
		try{
			if(Session.get("strokeType") == "serviceStroke" || Session.get("strokeType") == "stroke")
			{
				var sportID = $("[name='sportList'] option:selected").attr("name");
				var shortHandFH = $("input[id=checkFH]:checked").length;
				var shortHandBH = $("input[id=checkBH]:checked").length;
				var shortHandNone = $("input[id=checkNone]:checked").length;
				var strokeStyle = "";

				if(Session.get("strokeType") == "stroke")
					strokeStyle = $("[name='strokeStyleList'] option:selected").attr("name");



				var shortCode = $("#shortCode").val();
				var shortName = $("#shortName").val();
				var comments = $("#comments").val();

				if(shortHandFH == 0 &&  shortHandBH == 0 && shortHandNone == 0  )
				{
					$("#impMsg").text("* Please select short hand type");

				}
				else if(shortCode == "" || shortName == "" || sportID == 0)
				{			
					$("#impMsg").text("* Please fill mandatory fields");
				}
				else
				{
					$("#impMsg").text("");

					if(shortHandFH != 0)
					{
						var computedShortCode = "FH-"+shortCode;
						var computeShortName = "ForeHand "+shortName;
						var data = {
							"shortCode":computedShortCode,
							"strokeName":computeShortName,
							"comments":comments,
							"shotHand":"FH",
							"sportId":sportID,
							"strokeStyle":strokeStyle

						}
						Meteor.call("insertStroke",data,Session.get("strokeType"),function(error,result)
						{
							if(result)
							{
								alert("Saved");
								$("#createStroke").modal('hide');
								$( '.modal-backdrop' ).remove();
							}
						})
					}
					if(shortHandBH != 0)
					{
						var computedShortCode = "BH-"+shortCode;
						var computeShortName = "BackHand "+shortName;

						var data = {
							"shortCode":computedShortCode,
							"strokeName":computeShortName,
							"comments":comments,
							"shotHand":"BH",
							"sportId":sportID,
							"strokeStyle":strokeStyle



						}
						Meteor.call("insertStroke",data,Session.get("strokeType"),function(error,result)
						{
							if(result)
							{
								alert("Saved");
								$("#createStroke").modal('hide');
								$( '.modal-backdrop' ).remove();
							}
						})
					}
					if(shortHandNone != 0)
					{						
						var data = {
							"shortCode":shortCode,
							"strokeName":shortName,
							"comments":comments,
							"shotHand":"BH",
							"sportId":sportID,
							"strokeStyle":strokeStyle


						}
						Meteor.call("insertStroke",data,Session.get("strokeType"),function(error,result)
						{
							if(result)
							{
								alert("Saved");
								$("#createStroke").modal('hide');
								$( '.modal-backdrop' ).remove();
							}
						})
					}			
				}

			}
			else
			{

				var shortCode = $("#shortCode").val();
				var shortName = $("#shortName").val();
				var comments = $("#comments").val();
				var sportID = $("[name='sportList'] option:selected").attr("name");
				var destinationType = $("[name='destinationTypeList'] option:selected").attr("name");

				var losingStrokeValue = $("[name='losingStrokeList'] option:selected").attr("name");
				if(shortCode == "" || shortName == "" || sportID == 0)
				{
					$("#impMsg").text("* Please fill mandatory fields");
				}
				else
				{
					$("#impMsg").text("");

					
					var data = {
						"shortCode":shortCode,
						"strokeName":shortName,
						"comments":comments,
						"sportId":sportID,
						"destinationType":destinationType,
						"losingStroke":losingStrokeValue

					}

					Meteor.call("insertStroke",data,Session.get("strokeType"),function(error,result)
					{
						if(result)
						{
							alert("Saved");
							$("#createStroke").modal('hide');
							$( '.modal-backdrop' ).remove();
						}
					})
					
								
				}
			}		
		}catch(e){}
	}
})




/******************* approval list display *******************************/
Template.analyticsApprovalDiv.onCreated(function(){
	this.subscribe("analyticsApproval");
});

Template.analyticsApprovalDiv.helpers({
	"analyticsList":function()
	{
		return analyticsApproval.find({}).fetch();
	}
})


Template.analyticsApprovalDiv.events({
	"click #adminCreateStroke":function(e)
	{
		$("#createStrokeDiv").empty();
        Blaze.render(Template.analyticsApproval, $("#createStrokeDiv")[0]);
        $("#analyticsApproval").modal({backdrop: 'static'});
	},
	"click #editApprovedUser":function(e)
	{	
		Session.set("editApprovedUser",this);
		$("#createStrokeDiv").empty();
	    Blaze.render(Template.editAnalyticsApproval, $("#createStrokeDiv")[0]);
	    $("#editAnalyticsApproval").modal({backdrop: 'static'});		
	},
	"click #deleteApprovedUser":function(e)
	{
		var id = $(e.target).attr("name");
		Meteor.call("deleteApprovedUser",id,function(error,result)
		{
			if(result)		
				alert("User removed from approve list!!")
		})
	}	
})

/************************ create approval analytics ****************************/

Template.analyticsApproval.onRendered(function(){
	Session.set("playerSet","1");
	Session.set("userSelectName",undefined);
	Session.set("userSelectID",undefined);
	Session.set("validityDate",undefined)

	$('.selectAnalyticsApprovalMenu').select2({
		width: '100%',
		color:"black",
		minimumResultsForSearch: Infinity,
	});
	$('.selectApprovalUserMenu').select2({
		width: '100%',
		color:"#fff",
		background:'#D0D0D0'
	});

});

Template.analyticsApproval.helpers({
	"userSet":function(){
		try{		    
			var role = "";
			if(Session.get("playerSet") == "1")
				role = "Player";
			else if(Session.get("playerSet") == "2")
				role = "Coach";
			else if(Session.get("playerSet") == "3")
				role = "Association";
			else if(Session.get("playerSet") == "4")
				role = "Academy";
			else if(Session.get("playerSet") == "5")
				role = "Organiser";
			else if(Session.get("playerSet") == "6")
				role = "Journalist";
			else if(Session.get("playerSet") == "7")
				role = "Umpire";		
			var result = ReactiveMethod.call("getUserList",role);
			if(result){
				return result
			}	
		}catch(e){
		}
	},
	
})

Template.analyticsApproval.events({
	"change #typeOfRole":function(e){
		Session.set("playerSet",$("#typeOfRole").val())	;
	},
	"change #userSelect":function(e){
		e.preventDefault();
		Session.set("userSelectName",$("#userSelect>option:selected").html())
		Session.set("userSelectID",$("#userSelect").val());	
	},
	'change [name="validityDate"] ': function(e) {
		$('[name=validityDate]').bind("keydown change", function() {
	        var obj = $(this);
	        var text = obj.val();
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
				if(y > 1900 && comp[2].length == 4)
				{
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) 
					{
						obj.css({"color": "black"}); 
						obj.css({"border": "", "border-radius": ""});	
						Session.set("validityDate",1)

					} 
					else
					{
						obj.css({"color": "red"}); 
						Session.set("validityDate",0)

					}
				}
					
				else 
				{
					obj.css({"color": "red"}); 
					Session.set("validityDate",0)
				}
					
			}
			else 	
			{
				obj.css({"color": "red"}); 		

			}			
 		});
	},
	'click #validityDate': function(e) {
		$('[name=validityDate]').bind("keydown change", function() {
	        var obj = $(this);
	        var text = obj.val();
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
				if(y > 1900 && comp[2].length == 4)
				{
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) 
					{
						obj.css({"color": "black"}); 
						obj.css({"border": "", "border-radius": ""});	
						Session.set("validityDate",1)

					} 
					else
					{
						obj.css({"color": "red"}); 
						Session.set("validityDate",0)

					}
				}
					
				else 
				{
					obj.css({"color": "red"}); 
					Session.set("validityDate",0)
				}
					
			}
			else 	
			{
				obj.css({"color": "red"}); 		
				Session.set("validityDate",0)
			}			
 		});
	},
	"click #saveApprovalAnalytics":function(e)
	{		
		if(Session.get("userSelectID") == undefined || Session.get("userSelectName") == undefined)
			alert("Please choose user!!");
		else if($("#validityDate").val() == "")
			alert("Please enter date!!")
		if(Session.get("validityDate") != undefined)
		{
			if(Session.get("validityDate") == 0)
				alert("Please enter valid date")
			else
			{
				var data = {};
				data["userId"] = Session.get("userSelectID");
				data["validityDate"] = $("#validityDate").val();
				Meteor.call("addApprovedUser",data,function(err,result)
				{
					$("#createStroke").modal('hide');
					$( '.modal-backdrop' ).remove();
				});
	
			}
		}
	}
});


/************************ edit approval analytics ****************************/
Template.editAnalyticsApproval.onRendered(function(){
	Session.set("editValidityDate",undefined)
});

Template.editAnalyticsApproval.helpers({
	"editAnalyticsUser":function()
	{
		if(Session.get("editApprovedUser"))
			return Session.get("editApprovedUser")
	}
})

Template.editAnalyticsApproval.events({
	
	'change [name="editValidityDate"] ': function(e) {
		$('[name=editValidityDate]').bind("keydown change", function() {
	        var obj = $(this);
	        var text = obj.val();
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
				if(y > 1900 && comp[2].length == 4)
				{
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) 
					{
						obj.css({"color": "black"}); 
						obj.css({"border": "", "border-radius": ""});	
						Session.set("editValidityDate",1)

					} 
					else
					{
						obj.css({"color": "red"}); 
						Session.set("editValidityDate",0)

					}
				}
					
				else 
				{
					obj.css({"color": "red"}); 
					Session.set("editValidityDate",0)
				}
					
			}
			else 	
			{
				obj.css({"color": "red"}); 	
				Session.set("editValidityDate",0)
			}			
 		});
	},
	'click #editValidityDate': function(e) {
		$('[name=editValidityDate]').bind("keydown change", function() {
	        var obj = $(this);
	        var text = obj.val();
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
				if(y > 1900 && comp[2].length == 4)
				{
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) 
					{
						obj.css({"color": "black"}); 
						obj.css({"border": "", "border-radius": ""});	
						Session.set("editValidityDate",1)

					} 
					else
					{
						obj.css({"color": "red"}); 
						Session.set("editValidityDate",0)

					}
				}
					
				else 
				{
					obj.css({"color": "red"}); 
					Session.set("editValidityDate",0)
				}
					
			}
			else 	
			{
				obj.css({"color": "red"}); 		
				Session.set("editValidityDate",0)
			}			
 		});
	},
	"click #editApprovalAnalytics":function(e){		

		if($("#editValidityDate").val() == "")
			alert("Please enter date!!")
		if(Session.get("editValidityDate") != undefined)
		{
			if(Session.get("editValidityDate") == 0)
				alert("Please enter valid date")
			else
			{
				var obj =Session.get("editApprovedUser");
				var data = {};
				data["validityDate"] = $("#editValidityDate").val();
				data["status"] = $("[name='statusList'] option:selected").val();
				data["_id"] = obj._id;


				alert(JSON.stringify(data));

				Meteor.call("editApprovedUser",data,function(error,result)
				{
					if(result)
					{
						$("#editAnalyticsApproval").modal('hide');
						$( '.modal-backdrop' ).remove();
					}
				})
			}
		}
		else
		{
	        var text = $("#editValidityDate").val();
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
				if(y > 1900 && comp[2].length == 4)
				{
					if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) 
					{
							
						var obj =Session.get("editApprovedUser");
						var data = {};
						data["validityDate"] = $("#editValidityDate").val();
						data["status"] = $("[name='statusList'] option:selected").val();
						data["_id"] = obj._id;

						Meteor.call("editApprovedUser",data,function(error,result)
						{
							if(result)
							{
								$("#editAnalyticsApproval").modal('hide');
								$( '.modal-backdrop' ).remove();
							}
						})
					} 
					else				
						alert("Please enter valid date")			
				}
					
				else 				
					alert("Please enter valid date")								
			}
			else 	
				alert("Please enter valid date")
		}
	}
});


/**************************** register Helpers *****************************/
Template.registerHelper('checkStrokeType',function(data){
	try{
		if(Session.get("strokeType"))
		{
			if(Session.get("strokeType") == "serviceStroke")
				return true;
			if(Session.get("strokeType") == "stroke")
				return true;
		}	
	}catch(e){}
});


Template.registerHelper('checkDestinationType',function(data){
	try{
		if(Session.get("strokeType"))
		{
			if(Session.get("strokeType") == "destinationPoints")
				return true;			
		}	
	}catch(e){}
});

Template.registerHelper('checkOnlyStrokeType',function(data){
	try{
		if(Session.get("strokeType"))
		{
			if(Session.get("strokeType") == "stroke")
				return true;			
		}	
	}catch(e){}
});

Template.registerHelper("checkUserStatus",function(data1,data2){
	try{
		if(data1 == data2)
			return "selected";			
	}catch(e){}
}) 

Template.registerHelper("displayUserName",function(data){
	try{
		var result = ReactiveMethod.call("getUserName",data);
		return result;
	}catch(e){}
}) 