//class structure

function DobCriteria(dateType,dateValue){
    this.dateType = dateType;
    this.dateValue = dateValue;
}

function GenderCriteria(gender){
    this.gender = gender;
}

function LocationCriteria(locationType){
    this.locationType = locationType;
}

function ClassCriteria(minClass,maxClass)
{
	this.minClass = minClass;
	this.maxClass = maxClass;
}

function PlayerFormat(playerNo,mandatory,dobCriteria,genderCriteria,locationCriteria,classCriteria)
{
    this.playerNo = playerNo;
    this.mandatory = mandatory;  
    DobCriteria.call(this,dobCriteria.dateType,dobCriteria.dateValue);
	GenderCriteria.call(this,genderCriteria.gender);
    LocationCriteria.call(this,locationCriteria.locationType);
    ClassCriteria.call(this,classCriteria.minClass,classCriteria.maxClass);
}

function TeamFormat(teamFormatName,selectedProjectId,minPlayers,maxPlayers,teamRanked,teamFormatType,mandatoryPlayers,playerFormatArray)
{
  this.teamFormatName = teamFormatName;
  this.selectedProjectId = selectedProjectId;
  this.minPlayers = minPlayers;
  this.maxPlayers = maxPlayers;
  this.rankedOrNot = teamRanked;
  this.formatType = teamFormatType;
  this.mandatoryPlayersArray = mandatoryPlayers;
  this.playerFormatArray = playerFormatArray;
  this.save = function(){
    };

  this.update = function()
  {

  };
}

Template.adminTeamFormat.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");

});

Template.adminTeamFormat.onRendered(function(){	
	Session.set("formatType",undefined);
});

Template.adminTeamFormat.helpers({
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

Template.adminTeamFormat.events({

	"click #adminCreateTeamFormat": function(e) {
    	try{
	        $("#teamFormatLayout").empty();
	        Session.set("formatType","create");
	        Session.set("teamMaxPlayers",undefined);
			Session.set("extraMaxPlayers",undefined);
			Session.set("teamFormatErrorLog",undefined);
			Session.set("editTeamFormatID",undefined);
			Session.set("editTeamFormatName",undefined);
	        Blaze.render(Template.createTeamFormat, $("#teamFormatLayout")[0]);
    	}catch(e){}    
    },
    "click #adminEditTeamFormat": function(e) {
    	try{
	        $("#teamFormatLayout").empty();
	        Session.set("teamMaxPlayers",undefined);
			Session.set("extraMaxPlayers",undefined);
			Session.set("teamFormatErrorLog",undefined);
			Session.set("editTeamFormatID",undefined);
			Session.set("editTeamFormatName",undefined);
	        Session.set("formatType","edit");
	        Blaze.render(Template.createTeamFormat, $("#teamFormatLayout")[0]);
    	}catch(e){}    
    },
    'click #errorPopupClose': function(e) {
		e.preventDefault();
		$('#errorPopup').modal('hide');

	},

})

Template.createTeamFormat.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	this.subscribe("tournamentEvents_Sports");
	if(Session.get("formatType").trim() == "edit")
	{
		this.subscribe("teamFormat")

	}

});

Template.createTeamFormat.onRendered(function(){

	Session.set("teamMaxPlayers",undefined);
	Session.set("extraMaxPlayers",undefined);
	Session.set("teamFormatErrorLog",undefined);
	Session.set("editTeamFormatID",undefined);
	Session.set("editTeamFormatName",undefined);
});

Template.createTeamFormat.helpers({
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
	},
	"formatType":function(){
		if(Session.get("formatType"))
		{
			var formatType = Session.get("formatType");
			if(formatType.trim() == "edit")
				return true;
			else
				return false;
		}
	},
	"tournamentEvents_Sports":function()
	{
		var sportsList = tournamentEvents.find({});
		return sportsList;
	},
	"selectedEditTF":function(){
		if(Session.get("editTeamFormatID"))
		{
			var id = Session.get("editTeamFormatID");
			var data = teamsFormat.findOne({"_id":id.trim()});
			if(data)
			{
				Session.set("teamMaxPlayers",data.playerFormatArray.length);
				return data;
			}
		}
	},
	"extraMaxPlayers":function()
	{
		if(Session.get("extraMaxPlayers"))
		{
			return Session.get("extraMaxPlayers"); //5
		}
	},
	"maxTeamPlayers":function()
	{
		if(Session.get("teamMaxPlayers"))
		{
			var maxPlayers = Session.get("teamMaxPlayers");
			var max = [];
			for(var i=0; i<maxPlayers;i++)
			{
				max.push(i);
			}
			
			return max; //5
		}
	},
   
});

Template.createTeamFormat.events({

	"keyup #minPlayers": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #maxPlayers": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },

  	'click #teamFormatName': function(e) {
    	$("[name='teamFormatName']").css({"color": ""}); 
    	$(e.target).css({"border": "", "border-radius": ""}); 
	},
	'click #sportsList': function(e) {
    	$(e.target).css({"border": "", "border-radius": ""}); 
	},
    'change [name="teamFormatName"] ': function(e) {
    	var teamFormatName = $("[name='teamFormatName']").val();    	
    	Meteor.call("checkTeamFormatName",teamFormatName,function(error,result)
    	{
    		if(result)
    		{
    			$("[name='teamFormatName']").css({"color": "red"}); 
    			return;
    		}
    	})
	},
	"click #minPlayers":function(e)
	{
		$('#minPlayers').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
            	var maxPlayers = $("[name='maxPlayers']").val();
                if(maxPlayers.length == 0)
                {
                	
                }
                else
                {
                	Session.set("teamMaxPlayers",maxPlayers);
                }
            }, 0);
        });
	},

	"click #maxPlayers":function(e)
	{
		$(e.target).css({"border": "", "border-radius": ""}); 
		$('#maxPlayers').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
            	var minPlayers = $("[name='minPlayers']").val();
                if(minPlayers.length == 0)
                {
                	alert("Please enter minimum number of players required");
                	return;
                }
                else
                {
                	var maxPlayers = $("[name='maxPlayers']").val();
                	Session.set("teamMaxPlayers",maxPlayers);
					$("[name='maxPlayers']").attr("disabled",true);
                }
            }, 0);
        });
	},

	'change [name="maxPlayers"] ': function(e) {
		$('[name=maxPlayers]').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var maxPlayers = $("[name='maxPlayers']").val();
                Session.set("teamMaxPlayers",maxPlayers);

            }, 0);
        });
	},
	"click #deletePlayerEntry":function(e)
	{
		var targetName = $(e.target).attr("name");
		$("[name="+targetName+"]").remove();
		

	},
	"click #addPlayerEntry":function(e)
	{
		var maxPlayers = Session.get("teamMaxPlayers");
		var newSet = parseInt(maxPlayers)+parseInt(1);
		Session.set("teamMaxPlayers",newSet);
		
		if(Session.get("formatType"))
		{
			if(Session.get("formatType").trim() == "edit")
			{
				if(Session.get("extraMaxPlayers") == undefined)
				{
					var arraySet = [];
					arraySet.push(0);
					Session.set("extraMaxPlayers",arraySet);
				}
				else
				{
					var arraySet = Session.get("extraMaxPlayers");
					var newLen = parseInt(arraySet.length) + parseInt(1);
					arraySet.push(newLen);
					Session.set("extraMaxPlayers",arraySet)
				}
			}
			

		}
		
	},

	"click #resetTeamFormat":function(e)
	{
		Session.set("teamMaxPlayers",undefined);
		$("#maxPlayers").val("");
		$("#minPlayers").val("");
		$("#teamFormatName").val("");
		$("[name='maxPlayers']").attr("disabled",false);
	},
	'click #mandatoryList': function(e) {
 		$(e.target).css({"border": "", "border-radius": ""}); 
	},
     'click #genderList': function(e) {
 		$(e.target).css({"border": "", "border-radius": ""}); 
	},
	'click #localityList': function(e) {
 		$(e.target).css({"border": "", "border-radius": ""}); 
	}, 
	'click #minClassList': function(e) {
 		$(e.target).css({"border": "", "border-radius": ""}); 
	}, 
	'click #maxClassList': function(e) {
 		$(e.target).css({"border": "", "border-radius": ""}); 
	}, 
    'change [name="dateValue"] ': function(e) {
		$('[name=dateValue]').bind("keydown change", function() {
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

						} 
						else
						{
							obj.css({"color": "red"}); 
						}
					}
					
					else {
						obj.css({"color": "red"}); 
					}
				}
				else 
				{
					obj.css({"color": "red"}); 

				}

 		});
			

    },
	
	"click #saveTeamFormat":function(e)
	{
		try{
		var rowCount = $('#playerFormatBody').find("tr").length;
		Session.set("teamFormatErrorLog",undefined);
		$("#errorContainer").find("ul > li ").remove();

		if($("#teamFormatName").val().trim() == "")
		{
			Session.set("teamFormatErrorLog",1);
			$("#teamFormatName").css({"border": "1px solid red", "border-radius": "5px"}); 
			$("#errorContainer").find("ul").append('<li><label for="dateOfBirthDate" style="display: inline;" class="error" id="dateOfBirthDate-error">Please enter Team Format Name</label></li>');
		}
		else if($("#teamFormatName").val().trim().length > 0)
		{
			var formatType = Session.get("formatType").trim();
	        if(formatType != "edit")
	        {
				Meteor.call("checkTeamFormatName",$("#teamFormatName").val().trim().replace(/\s+/g,' '),function(error,result)
		    	{
		    		if(result)
		    		{
		    			Session.set("teamFormatErrorLog",1);
		    			$("#teamFormatName").css({"border": "1px solid red", "border-radius": "5px"}); 
						$("#errorContainer").find("ul").append('<li><label for="dateOfBirthDate" style="display: inline;" class="error" id="dateOfBirthDate-error">Please enter unqiue Team Format Name</label></li>');
		    		}
		    	})
	        }
		}
		if($("[name='sportsList'] option:selected").attr("name") == "select")
		{
	        Session.set("teamFormatErrorLog",1);
	        $("[name='sportsList']").css({"border": "1px solid red", "border-radius": "5px"}); 
			$("#errorContainer").find("ul").append('<li><label for="dateOfBirthDate" style="display: inline;" class="error" id="dateOfBirthDate-error">Please select sport</label></li>');
		}
		if($("[name='teamRank'] option:selected").attr("name") == "select")
		{
	        Session.set("teamFormatErrorLog",1);
	        $("[name='teamRank']").css({"border": "1px solid red", "border-radius": "5px"}); 
			$("#errorContainer").find("ul").append('<li><label for="dateOfBirthDate" style="display: inline;" class="error" id="dateOfBirthDate-error">Please select team ranked or not</label></li>');
		}

		if($("#maxPlayers").val().trim() == "")
		{
	        Session.set("teamFormatErrorLog",1);
	        $("#maxPlayers").css({"border": "1px solid red", "border-radius": "5px"}); 
			$("#errorContainer").find("ul").append('<li><label for="dateOfBirthDate" style="display: inline;" class="error" id="dateOfBirthDate-error">Please enter maximum players required</label></li>');
		}

		if(parseInt(rowCount) == 0)
		{
			Session.set("teamFormatErrorLog",1);
			$("#errorContainer").find("ul").append('<li><label for="dateOfBirthDate" style="display: inline;" class="error" id="dateOfBirthDate-error">Team Format should contain atleast one person criteria</label></li>');
		}
		if(parseInt(rowCount) > 0)
		{
			var playerArray = [];
			var minCount = 0;
			var mandatoryPlayers = [];

            $('#playerFormatBody tr').each(function (i, row) {

            	Session.set("currentRowStatus",undefined);
	        	var $row = $(row);
	        	var rowIndex = i + 1;
	            var mandatory = $row.find("[name='mandatoryList'] option:selected").attr("name");
	            var dateCriteria = $row.find('[name="dateType"] option:selected').attr("name");
	            var dateValue = $row.find('[name="dateValue"]').val();
	            var genderCriteria = $row.find('[name="genderList"] option:selected').attr("name");
	            var localityCriteria = $row.find('[name="localityList"] option:selected').attr("name");
	            var minClassCriteria = $row.find('[name="minClassList"] option:selected').attr("name");
	            var maxClassCriteria = $row.find('[name="maxClassList"] option:selected').attr("name");

	            if(mandatory == "select")
	            {
	             	$row.find("[name='mandatoryList']").css({"border": "1px solid red", "border-radius": "5px"}); 
					Session.set("teamFormatErrorLog",1);
					Session.set("currentRowStatus",1);

	            }            	            	
	            else
 					$row.find("[name='mandatoryList']").css({"border": "", "border-radius": ""}); 
	            
	            if(dateCriteria == "select")
	            {
	            	$row.find("[name='dateType']").css({"border": "1px solid red", "border-radius": "5px"}); 
	            	Session.set("teamFormatErrorLog",1);
	            	Session.set("currentRowStatus",1);

	            }
	            
	            else if(dateCriteria == "before" || dateCriteria == "onBefore" || dateCriteria == "after" || dateCriteria == "onAfter")
	            {
	            	$row.find("[name='dateType']").css({"border": "", "border-radius": ""}); 
	            	if(dateValue == null || dateValue.trim() == "")
	            	{
	            		$row.find('[name="dateValue"]').css({"border": "1px solid red", "border-radius": "5px"}); 
	            		Session.set("teamFormatErrorLog",1);
	            		Session.set("currentRowStatus",1);

	            	}
	            	else
	            		$row.find('[name="dateValue"]').css({"border": "", "border-radius": ""}); 

	            }

	            if(genderCriteria == "select")
	            {
	            	$row.find("[name='genderList']").css({"border": "1px solid red", "border-radius": "5px"}); 
	            	Session.set("teamFormatErrorLog",1);
	            	Session.set("currentRowStatus",1);

	            }
	            else
	            	$row.find("[name='genderList']").css({"border": "", "border-radius": ""}); 

	            if(localityCriteria == "select")
	            {
	            	$row.find("[name='localityList']").css({"border": "1px solid red", "border-radius": "5px"}); 
	            	Session.set("teamFormatErrorLog",1);
	            	Session.set("currentRowStatus",1);

	            }
	            else
	            	$row.find("[name='localityList']").css({"border": "", "border-radius": ""}); 
          
	            if(minClassCriteria != "any" && maxClassCriteria != "any")
	            {
	            	if(parseInt(maxClassCriteria) < parseInt(minClassCriteria))
	            	{
	            		Session.set("teamFormatErrorLog",1);
	            		$row.find("[name='minClassList']").css({"border": "1px solid red", "border-radius": "5px"}); 
	            		$row.find("[name='maxClassList']").css({"border": "1px solid red", "border-radius": "5px"}); 
	            		$("#errorContainer").find("ul").append('<li><label for="dateOfBirthDate" style="display: inline;" class="error" id="dateOfBirthDate-error">Min Criteria Class should be less than Max Class Criteria </label></li>');
	            	}
	            	else
	            	{
	            		$row.find("[name='minClassList']").css({"border": "", "border-radius": ""}); 
	            		$row.find("[name='maxClassList']").css({"border": "", "border-radius": ""}); 

	            	}
	            }
	            if(Session.get("currentRowStatus") == undefined)
	            {
	            	if(mandatory.trim() == "yes")
	            	{
	            		minCount++;
	            		mandatoryPlayers.push("p"+rowIndex);
	            	}
	            	if(dateCriteria != "any")
	            		dateValue = new Date(moment(new Date(dateValue)).format("YYYY-MM-DD"))
	            	var dobObj = new DobCriteria(dateCriteria,dateValue)
					var genderObj = new GenderCriteria(genderCriteria);
					var locObj = new LocationCriteria(localityCriteria);
					
					var classObj = new ClassCriteria(minClassCriteria,maxClassCriteria);
					var customRowIndex = "p"+rowIndex;
					var playerObj = new PlayerFormat(customRowIndex,mandatory,dobObj,genderObj,locObj,classObj);
	            	playerArray.push(playerObj);
	            }

	        });
		}

	        if(Session.get("teamFormatErrorLog") == undefined && (parseInt(rowCount) > 0))
	        {
				var teamFormatName = $("#teamFormatName").val().trim().replace(/\s+/g,' ');
				var sport = $("[name='sportsList'] option:selected").attr("name");
				var teamRanked = $("[name='teamRank'] option:selected").attr("name");
				var teamFormatType = $("[name='teamFormatType'] option:selected").attr("name");

				var maxCount = playerArray.length;
	        	var teamObj = new TeamFormat(teamFormatName,sport.trim(),minCount,maxCount,teamRanked,teamFormatType,mandatoryPlayers,playerArray);
	        	if(Session.get("formatType"))
	        	{
	        		var formatType = Session.get("formatType").trim();
	        		if(formatType == "edit")
	        		{
	        			try{
		        			teamObj.update = function() {	        				
								Meteor.call('updateTeamFormat',teamObj,Session.get("editTeamFormatID").trim(),function(error,result)
									{
										if(result)
										{
											$("#alreadySubscribedText").text("Successfully updated !! ");
                    						$("#sendingMailPopup3").modal({backdrop: 'static'});;
										}
											
									});
								Session.set("extraMaxPlayers",undefined);
								setTimeout(function(){$("#sendingMailPopup3").modal('hide');}, 1000);
							}

							teamObj.update();
						}catch(e){}

	        		}
	        		else
	        		{
	        			try{
		        			teamObj.save = function() {
								Meteor.call('insertTeamFormat',teamObj,function(error,result)
									{
										if(result)
										{
											$("#alreadySubscribedText").text("Successfully created !! ");
                    						$("#sendingMailPopup3").modal({backdrop: 'static'});;
										}
									});
								Session.set("extraMaxPlayers",undefined);
								setTimeout(function(){$("#sendingMailPopup3").modal('hide');}, 1000);
								$("#adminCreateTeamFormat").trigger("click");
								}

							teamObj.save();
						}catch(e){}
	        			
	        		}
	        	}


	        }
	        else if(Session.get("teamFormatErrorLog") == "1" && (parseInt(rowCount) > 0))
	        {
				$("#errorContainer").find("ul").append('<li><label for="dateOfBirthDate" style="display: inline;" class="error" id="dateOfBirthDate-error">Please fill mandatory fields</label></li>');
				$("#errorPopup").modal({backdrop: 'static'});
	        }
	        else
	        {
				$("#errorPopup").modal({backdrop: 'static'});
	        }
			
        	


	}catch(e){}
		
	},


	//edit related
	"click #teamFormatList":function(e)
	{
		$('[name=teamFormatList]').bind("keydown change", function() {
            var obj = $(this);        
            setTimeout(function() {
                var eventName = obj.val();
                var eventID = $("[name='teamFormatList'] option:selected").attr("name"); 
                Session.set("editTeamFormatID",eventID);
                Session.set("editTeamFormatName",eventName);

             
            }, 0);
        });
	},
	'change [name="teamFormatList"] ': function(e) {
		$('[name=teamFormatList]').bind("keydown change", function() {
            var obj = $(this);        
            setTimeout(function() {
                var eventName = obj.val();
                var eventID = $("[name='teamFormatList'] option:selected").attr("name");
                Session.set("editTeamFormatID",eventID);
                Session.set("editTeamFormatName",eventName);              
            }, 0);
        });
	},
	"click #deleteTeamFormat":function(e){

		Blaze.render(Template.confirmPasswordTF,$("#confirmDeleteTF")[0]);
		$("#confirmPasswordTF").modal({backdrop: 'static'});

	}

	
})



//Edit realted
Template.editTeamFormat.onCreated(function(){
	this.subscribe("teamFormat")
});

Template.editTeamFormat.onRendered(function(){

});

Template.editTeamFormat.helpers({
	listOfTeamFormat:function(){
		var data = teamsFormat.find({}).fetch();
		return data;
	}
});
	



Template.registerHelper('checkPresetValue', function(data1,data2) {

    if(data1.trim() == data2.trim())
    {
    	return "selected";
    }
});


Template.registerHelper('checkExtraMax',function(param){

	if(Session.get("editTeamFormatID"))
	{
		var id = Session.get("editTeamFormatID");
		var data = teamsFormat.findOne({"_id":id.trim()});
		if(data)
		{
			var newIndex = parseInt(data.playerFormatArray.length)+parseInt(param);
			return "player"+newIndex;
		}
	}
})


/** password validation **/
Template.confirmPasswordTF.onCreated(function(){
	this.subscribe("users");
});

Template.confirmPasswordTF.events({
	'submit form': function(e) {
		e.preventDefault();
		$("#changePasswordSucc").html("")
	},
	'focus #oldPassword':function(e){
		$("#changePasswordSucc").html("")
	},
});


Template.confirmPasswordTF.onRendered(function(){
	$('#application-confirmPasswordTF').validate({
	  	onkeyup:false,
	    rules: {
	    	oldPassword: {
	          required: true,
	          minlength:6,
	      },
	    },
	    showErrors: function(errorMap, errorList) {
	        $("#application-confirmPasswordTF").find("input").each(function() {
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
		      			if (result.error==null) 
		      			{
		      				$("#confirmPasswordTF").modal('hide');

		     
		      				if(Session.get("editTeamFormatID"))
		      				{
		      					Meteor.call("deleteTeamFormat",Session.get("editTeamFormatID").trim(),function(error,result){

		      						if(result)
		      						{
										$("#alreadySubscribedText").text("Successfully deleted !! ");
                    					$("#sendingMailPopup3").modal({backdrop: 'static'});;							
		      						}
		      						else
		      						{ 
		      							$("#alreadySubscribedText").text("Could not delete !! ");
		      							$("#sendingMailPopup3").modal({backdrop: 'static'});;							
		      						}
		      					});
		      					setTimeout(function(){$("#sendingMailPopup3").modal('hide');}, 1000);



		      				}
		      				

							
		     			 }
		      			else
		      			{
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

