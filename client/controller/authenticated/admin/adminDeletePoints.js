 var playerUnderTour = [];
 var extTourEO = [];
var nameToCollection = function(name) {
  return this[name];
};
Template.adminDeletePoints.onCreated(function(){
	this.subscribe("users");
	//this.subscribe("userDetailssTT");
	this.subscribe("authAddress");
	this.subscribe("pastEventsTournament");
	this.subscribe("tournamentEvents");
	this.subscribe("PlayerPoints");

	var template = this;
  	template.autorun(function() {

		if(Session.get("deleteTourID") && Session.get("deleteTourID") != "Other")
			template.subscribe("PlayerPointsUnderTourn",Session.get("deleteTourID"));		
		else
			template.subscribe("PlayerPointsUnderExtTourn");

		if(Session.get("deleteSportID") != undefined)
			template.subscribe('getPlayersBasedOnSport',Session.get("deleteSportID"));

  	});
	
});

Template.adminDeletePoints.onRendered(function(){

	Session.set("deleteTourType",undefined);
	Session.set("deleteTourID",undefined);
	Session.set("deleteTour",undefined);
	Session.set("deleteSport",undefined);
	Session.set("deleteSportID",undefined);
	Session.set("deleteEvent",undefined);
	Session.set("deleteEventOrganizer",undefined);
	Session.set("deleteSelectedPlayerPoints",undefined);
	Session.set("checkedPlayerPoints",undefined);
	Session.set("tournamentPlayers_display","0");
});

Template.adminDeletePoints.helpers({
	
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
	sports: function() {
        try {
            var sportList = tournamentEvents.find({}).fetch();
            if (sportList.length != 0)
                return sportList;
        } catch (e) {}
    },
	tourType:function()
	{
		try{
			var tournamentType = $("[name='tourType'] option:selected").attr("name");
			if( tournamentType != undefined )
			{
				if(tournamentType.trim() != "" && tournamentType.trim() == "organized")
					return true;
				else 
					return false;
			}
		}catch(e){}
	},
	 organizerList:function()
    {
    	try{
    	var organizerListArr = [];
    	var distinctEntries = _.uniq(PlayerPoints.find({}, {
						    sort: {"organizerId": 1}, fields: {"organizerId": 1}
						}).fetch().map(function(x) {
						    return x.organizerId;
						}), true);
    	if(distinctEntries.length > 0)
        {

            for(var l=0; l<distinctEntries.length; l++)
            {
                var eventOrganizerList = distinctEntries[l];				
				var assocList = Meteor.users.findOne({"userId":eventOrganizerList});
                if(assocList)
                {
                	var organizerJson = {};
                	organizerJson["userId"] = assocList.userId;
                	organizerJson["userName"] = assocList.userName;
                	organizerListArr.push(organizerJson);
                } 			
            }
        }
        return organizerListArr;
    }catch(e){}
    },

	
	
	sportEvents: function() {
        try {
            var sportID = $("[name='sportList'] option:selected").attr("name");
            if (sportID != undefined && sportID.trim() != "") {
                var sportList = tournamentEvents.findOne({
                    "_id": sportID
                }).projectSubName;
                if (sportList.length != 0)
                    return sportList;
            }
        } catch (e) {}
    },
   
    
    selectedTourPlayers_PointsDelete:function()
	{
		try{
		if(Session.get("deleteTourType"))
		{
			var tourType = Session.get("deleteTourType");
			if(tourType != undefined && tourType.trim() == "organized" && (Session.get("checkedPlayerPoints") || Session.get("deleteSelectedPlayerPoints")))
			{		
				if(Session.get("checkedPlayerPoints"))
				{	
					var selectedPlayers = $("input[name='checkPlayer']:checkbox:checked").map(function() {
					    return this.value;
					}).get();

					if(selectedPlayers.length > 0)
						return true;
					else 
						return false;
				}	
			}
			else
			{
				var tourType = Session.get("deleteTourType");
				if(tourType != undefined && tourType.trim() == "external")
					return true;
			}
		}}catch(e){}
		
	},
	displayPlayers:function()
	{
		try{
			if(Session.get("deleteTourType"))
		{
			var tournamentType = Session.get("deleteTourType");
		if(tournamentType != undefined && tournamentType != "")
		{
			if(tournamentType.trim() != "" && tournamentType.trim() == "organized")
				return true;
			else if(tournamentType.trim() != "" && tournamentType.trim() == "external")
				return false;
		}
		else return false;
	}
	}catch(e){}
		
	},
	tournamentPlayers:function()
	{
		try 
		{
            if(Session.get("tournamentPlayers_display") == "1" && Session.get("deleteTourID"))
            {
            	var sportID = Session.get("deleteSportID");
	 			var eventName = Session.get("deleteEvent");
	 			var eventOrganizer = Session.get("deleteEventOrganizer");
	 			var tour = Session.get("deleteTour");
	 			var tourID = Session.get("deleteTourID");
	 			var tourType =  Session.get("deleteTourType");

	 			tour = tour.trim();
	 			tourID = tourID.trim();
	 			tourType = tourType.trim();
	 			var playerList;
	 			if(Session.get("deleteTour"))
	 			{
	 				if(tourType != "external")
	 				{
	 					playerList = PlayerPoints.find({sportId:sportID.trim(),
	 						eventName:eventName.trim(),organizerId:eventOrganizer.trim(),
	 						"eventPoints.tournamentId":tourID
	        			},{fields:{playerId:1,eventPoints:1,totalPoints:1}}).fetch();

	 				}
	 				else
	 				{
						playerList = PlayerPoints.find({sportId:sportID.trim(),
	 						"eventName":eventName.trim(),
	 						"organizerId":eventOrganizer.trim(),
	 						"eventPoints.tournamentName":tour
	        			},{fields:{playerId:1,eventPoints:1,totalPoints:1}}).fetch();
	 				}

	 			}
	 			
	            if (playerList.length != 0)
	            {
	            	Meteor.call("getSportsMainDB",sportID,function(e,res){
						if(res != undefined && res != null && res != false){
						    toRet = res
						    Session.set("playerDBName",toRet);
						}
						else if(res != undefined && res != null && res == 2){
						   	toRet = false
						    alert("select sport first")
						    Session.set("playerDBName",toRet)
						}
						else if(e){
						    toRet = false
						    Session.set("playerDBName",toRet)
						    alert(e)
						}
					})

	            	if(Session.get("playerDBName"))
	            	{
		            	for(var i=0; i<playerList.length;i++)
		            	{

		            		var playerInfo = nameToCollection(Session.get("playerDBName")).findOne({userId:playerList[i].playerId});
		            		if(playerInfo)
		            			playerList[i]["playerName"] = playerInfo.userName;

		            		playerList[i]["totalPoints"] = playerList[i].totalPoints;
		            		var eventPointsList = playerList[i].eventPoints;
		            		for(var x=0;x<eventPointsList.length;x++)
		            		{
		            			if(Session.get("deleteTourType").trim() == "external")
		            			{
		            				if(eventPointsList[x].tournamentId == "0" && eventPointsList[x].tournamentName == Session.get("deleteTour").trim())
		            					playerList[i]["points"] = eventPointsList[x].tournamentPoints;
		            			}
		            			else
		            			{
		            				if(eventPointsList[x].tournamentId == Session.get("deleteTourID").trim())
		            					playerList[i]["points"] = eventPointsList[x].tournamentPoints;
		            			}
		            		}
		            	}
		            	playerList.map(function(document, index) {
			            	document["slNo"] = parseInt(index + 1);
			        	});
	            	}
	            }
            	return playerList;
            }

           
        } catch (e) {}
	}
	
});

Template.adminDeletePoints.events({

    'click #sportList': function(e) {
        $('#sportList').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var sport = obj.val();
                var sportID = $("[name='sportList'] option:selected").attr("name");
                if(sportID != undefined && sportID != "")
                {
                	var sportList = tournamentEvents.findOne({"_id": sportID}).projectSubName;
                	if(sportList.length > 0)
                	{
                		var optionHTML = "";
                        optionHTML += "<option name='' id='filterSelection' selected disabled>Select Event</option>";

                		for(var l=0; l<sportList.length; l++)
                		{
                			var eventList = sportList[l];                			
                    		optionHTML += "<option name=" + eventList._id + " id='filterSelection'>" + eventList.projectName + "</option>";
                    	}
                   	$("#eventList").html(optionHTML);
                	}
                }
            }, 0);
        });
    },
    'click [name=sportList]': function(e) {
        $('[name=sportList]').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
               var sport = obj.val();
                var sportID = $("[name='sportList'] option:selected").attr("name");
                if(sportID != undefined && sportID != "")
                {
                	var sportList = tournamentEvents.findOne({"_id": sportID}).projectSubName;
                	if(sportList.length > 0)
                	{
                		var optionHTML = "";
                        optionHTML += "<option name='' id='filterSelection' selected disabled>Select Event</option>";

                		for(var l=0; l<sportList.length; l++)
                		{
                			var eventList = sportList[l];                			
                    		optionHTML += "<option name=" + eventList._id + " id='filterSelection'>" + eventList.projectName + "</option>";
                    	}
                   	$("#eventList").html(optionHTML);
                	}
                }
            }, 0);
        });
    },
    'click [name=eventList]': function(e) {
        $('[name=eventList]').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var eventName = obj.val();
                var eventID = $("[name='eventList'] option:selected").attr("name");
            }, 0);
        });
    },
    "click #organizer":function(e)
	{
		$('#organizer').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var organizerID = $("[name='organizer'] option:selected").attr("name");
            }, 0);
        });
	},
	'change [name="organizer"] ': function(e) {
		$('[name=organizer]').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var organizerID = $("[name='organizer'] option:selected").attr("name");
            }, 0);
        });
	},
	"click #tourType":function(e)
	{
		$('#tourType').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var tour = obj.val();
                var tourID = $("[name='tourType'] option:selected").attr("name");
                if(tourType != undefined && tourType != "" )
                {
                	var tournamentType = $("[name='tourType'] option:selected").attr("name");
        			var organizerID = $("[name='organizer'] option:selected").attr("name");
					if(tournamentType.trim() != "" && tournamentType != undefined && 
						 organizerID != undefined)
					{
						if(tournamentType.trim() == "organized")
						{
							var tourList = pastEvents.find({eventOrganizer:organizerID.trim()}).fetch();
				            if (tourList.length != 0)
				            {
					
		                		var optionHTML = "";
		                        optionHTML += "<option name='' id='filterSelection' selected disabled>Select Tournament</option>";

		                		for(var l=0; l<tourList.length; l++)
		                		{
		                			var tourEntry = tourList[l];                			
		                    		optionHTML += "<option name=" + tourEntry._id + " id='filterSelection'>" + tourEntry.eventName + "</option>";
		                    	}
                   				$("#tourList").html(optionHTML);
                   			}
				            
						}
						else
						{
							try
								{
									var sportID = $("[name='sportList'] option:selected").attr("name");
						        	var eventName = $("[name='eventList'] option:selected").val();
						        	var organizerID = $("[name='organizer'] option:selected").attr("name");
						        	var tournamentType = $("[name='tourType'] option:selected").attr("name");
						       		var tournamentID = $("[name='tourList'] option:selected").attr("name");
									var tournamentName = $("[name='tourList'] option:selected").val();

									if(sportID != "" && sportID != undefined && eventName != "" && eventName != undefined && 
										tournamentType != "" && tournamentType != undefined && 
										organizerID != "" && organizerID != undefined)
									{
										if(tournamentType.trim() == "external")
										{
								 			var tourList = PlayerPoints.find({sportId:sportID.trim(),
								 				eventName:eventName.trim(),organizerId:organizerID.trim()
								        	}).fetch();

											var extTour = [];
											var optionHTML = "";
		                        			optionHTML += "<option name='' id='filterSelection' selected disabled>Select Tournament</option>";

		                				
											for(var i=0;i<tourList.length;i++)
											{
												var extTourList = tourList[i].eventPoints;
												for(var x=0;x<extTourList.length;x++)
												{
													if(extTourList[x].tournamentName && extTourList[x].tournamentId == "0")
													{
														if (_.findWhere(extTour, extTourList[x].tournamentName) == null) 
														{
													    	extTour.push(extTourList[x].tournamentName);
		                    								optionHTML += "<option name=" + extTourList[x].tournamentName + " id='filterSelection'>" + extTourList[x].tournamentName + "</option>";
														}
													}
													
												}
														
											}
											$("#tourList").html(optionHTML);
											//return extTour;
										}
										
									}
								
								}catch(e){}
						}
					}
                }
            }, 0);
        });
	},
    'change [name="checkAllPlayer"]':function(e)
	{
		if($("input[name=checkAllPlayer]:checkbox").prop('checked'))
		{
			$("input[name=checkPlayer]:checkbox").prop('checked', true);
			var selectedPlayers = $("input[name='checkPlayer']:checkbox:checked").map(function() {
				    	return this.value;
					}).get();
			Session.set("deleteSelectedPlayerPoints",selectedPlayers);

			Session.set('checkedPlayerPoints', $("input[name=checkPlayer]:checked").length);

		}
		else
		{
			$("input[name=checkPlayer]:checkbox").prop('checked', false);
			var emptyArray = []
			Session.set("deleteSelectedPlayerPoints",emptyArray);
			Session.set('checkedPlayerPoints', $("input[name=checkPlayer]:checked").length);

		}		
	},
    'change [name="checkPlayer"]':function(e,template)
     {
		var num = $('#checkPlayer:checked').size();
		var id = e.target.value;
		$("input[name=checkAllPlayer]:checkbox").prop('checked', false);

		if($(e.target).is(":checked"))
		{
			if (_.findWhere(playerUnderTour, id) == null) 
			{
    			playerUnderTour.push(id);
    			Session.set("deleteSelectedPlayerPoints",playerUnderTour);
    			Session.set('checkedPlayerPoints', $("input[name=checkPlayer]:checked").length);

			}
		}	
		else
		{
			playerUnderTour =  _.reject(playerUnderTour, function(item) {
        		return item === id; 
    		});

    		Session.set("deleteSelectedPlayerPoints",playerUnderTour);
    		Session.set('checkedPlayerPoints', $("input[name=checkPlayer]:checked").length);


		}
	},
	"click #showPointsDelete":function(e)
	{
		var sportID = $("[name='sportList'] option:selected").attr("name");
        var eventID = $("[name='eventList'] option:selected").val();
        var organizerID = $("[name='organizer'] option:selected").attr("name");
        var tournamentType = $("[name='tourType'] option:selected").attr("name");
        var tournamentID = $("[name='tourList'] option:selected").attr("name");
		var tournamentName = $("[name='tourList'] option:selected").val();


		Session.set("deleteSportID",sportID);
		Session.set("deleteEvent",eventID);
    	Session.set("deleteEventOrganizer",organizerID);
    	Session.set("deleteTourType",tournamentType);
    	Session.set("deleteTourID",tournamentID);
    	Session.set("deleteTour",tournamentName);


		if(Session.get("deleteSportID")&& Session.get("deleteEvent")
		  && Session.get("deleteEventOrganizer") && Session.get("deleteTourType") 
		  && Session.get("deleteTour"))
		{
			Session.set("tournamentPlayers_display",1);
		}
		else
		{
			alert("Please choose filters")
		}
	},
	"click #deletePlayerTourPoints":function(e)
	{
    	try{

    	if(Session.get("deleteTourType") && Session.get("deleteTourID") && Session.get("deleteSportID") && Session.get("deleteEvent"))
    	{

			Blaze.render(Template.confirmPasswordSendRecAdmin,$("#deletePointsConfirmPassword")[0]);
			$("#confirmPasswordSendRecAdmin").modal({backdrop: 'static'});
    	}
    }catch(e){}
	}
})


 Template.confirmPasswordSendRecAdmin.onCreated(function(){
	this.subscribe("users")
});

Template.confirmPasswordSendRecAdmin.events({
	'submit form': function(e) {
		e.preventDefault();
		$("#changePasswordSucc").html("")
	},
	'focus #oldPassword':function(e){
		$("#changePasswordSucc").html("")
	},
});


Template.confirmPasswordSendRecAdmin.onRendered(function(){
	if(Session.get("deleteTourType").trim() == "organized")
		$("#infoMsg").text("** Selected player points of "+Session.get("deleteTour")+" would be deleted");
	else
		$("#infoMsg").text("** Selected "+Session.get("deleteTour")+" points would be deleted");

	$('#application-confirmPasswordSendRecAdmin').validate({
	  	onkeyup:false,
	    rules: {
	    	oldPassword: {
	          required: true,
	          minlength:6,
	      },
	    },
	    showErrors: function(errorMap, errorList) {
	        $("#application-confirmPasswordAcademySendRec").find("input").each(function() {
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
		      				$("#confirmPasswordSendRecAdmin").modal('hide');
		      				var selectedPlayers = $("input[name='checkPlayer']:checkbox:checked").map(function() {
						    	return this.value;
							}).get();
					 		if(Session.get("deleteTourType").trim() == "organized")
				    			Meteor.call("deleteOrganizerTourPoints",selectedPlayers,Session.get("deleteTourID"),Session.get("deleteSportID"),Session.get("deleteEvent"));
				    		else
				    			Meteor.call("deleteExtTourPoints",Session.get("deleteTour"),Session.get("deleteSportID"),Session.get("deleteEvent"))	
		     			 }
		      			else{
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
