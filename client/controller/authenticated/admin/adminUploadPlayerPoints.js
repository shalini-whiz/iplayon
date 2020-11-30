var nameToCollection = function(name) {
  return this[name];
};
var userSubscription = false;

Template.adminUploadPoints.onCreated(function(){

	this.subscribe("onlyLoggedIn")
	this.subscribe("organizerTournaments");

	this.subscribe("tournamentEvents");
	this.subscribe("PlayerPoints");
    this.subscribe("dobFilterSubscribe");

    
    var template = this;
  	template.autorun(function() {

		if(Session.get("tourn_sport") != undefined)
	    {
	    	if(userSubscription)     			
    				userSubscription.stop();
	    	userSubscription = template.subscribe('getPlayersBasedOnSport',Session.get("tourn_sport"));

	    }	
    });

});

Template.statisticsList.onDestroyed(function(){
	Session.set("points_uploadedFile",undefined);
	//Session.set("uploadSport",undefined);
	Session.set("uploadEvent", undefined);
    Session.set("uploadEventID", undefined);
    Session.set("uploadTour",undefined);
    Session.set("uploadTourID",undefined);
	Session.set("points_errorLogsSession",undefined)
    Session.set("tourn_sport",undefined);
    Session.set("tourn_set",undefined);

    if(userSubscription)     			
    	userSubscription.stop();
})

var insertedREc =0 ;
Template.adminUploadPoints.onRendered(function(){

	Session.set("points_uploadedFile",undefined);
	//Session.set("uploadSport",undefined);
	Session.set("uploadEvent", undefined);
    Session.set("uploadEventID", undefined);
    Session.set("uploadTour",undefined);
    Session.set("uploadTourID",undefined);
	Session.set("points_errorLogsSession",undefined)
    //Session.set("tourn_sport",undefined);    
    //Session.set("tourn_set",undefined);

  	if(userSubscription)     			
    	userSubscription.stop();
	
});

Template.adminUploadPoints.helpers({
	
	"notAdmin":function(){
		try
		{
			var userInfo = Meteor.users.findOne({"_id":Meteor.userId()})
			if(userInfo)
			{
				if(userInfo.interestedProjectName && userInfo.interestedProjectName.length > 0)
				{
					Session.set("uploadSport",userInfo.interestedProjectName[0]);
					Meteor.call("getSportsMainDB",userInfo.interestedProjectName[0],function(e,res){
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
					return false;
				}
				else
					return true;
			}
		}catch(e){
			alert(e)
		}
	},
	pastTournaments:function()
	{
		try {
			

            var tourList = pastEvents.find({}).fetch();
            if (tourList.length != 0)
            {
            	return tourList;
            }
        } catch (e) {}
	},
	sports: function() {
        try {
        	var userExists = Meteor.users.findOne({"userId":Meteor.userId()});
            
            if(userExists && userExists.interestedProjectName)
            {
            	//userExists.interestedProjectName
            	var sportList = tournamentEvents.find({
            	 	"_id":{$in:userExists.interestedProjectName}
            	}).fetch();
            	if (sportList.length != 0)
                	return sportList;
            }
           
        } catch (e) {}
    },
	sportEvents: function() {
        try {
            if (Session.get("tourn_set") != undefined) {
                var sportList = tournamentEvents.findOne({
                    "_id": Session.get("tourn_set")
                }).projectSubName;
                if (sportList.length != 0)
                    return sportList;
            }
        } catch (e) {
        	alert(e)
        }
    },
	"logsError":function(){
		if(Session.get("points_errorLogsSession")){
			return Session.get("points_errorLogsSession")
		}
	},
	alreadyExistingTour:function()
	{
		try
		{
			if(Session.get("uploadSport") && Session.get("uploadEvent") && Session.get("uploadTour"))
			{
				var sportID = Session.get("uploadSport");
				var eventName = Session.get("uploadEvent");
				var tour = Session.get("uploadTour");
				var tourID = Session.get("uploadTourID");
				if(tour.trim() != "Other")
				{
					var found = PlayerPoints.find({"sportId" :sportID.trim(),
						"eventName" : eventName.trim(),
						"eventPoints.tournamentId":tourID}).fetch();
					if(found.length > 0)
						return true;
					else
						return false;
				}
			}
			var sport = Session.get("uploadSport");

		}catch(e){}
	},
	displayTournamentName:function()
	{
		try
		{
			if(Session.get("uploadSport") && Session.get("uploadEvent") && Session.get("uploadTour"))
			{
				return Session.get("uploadTour");

			}
		}catch(e){}
	}

});

Template.adminUploadPoints.events({
	
	"click #cancelUploadPointsMenu": function() {
		if (Session.get("previousLocationPath") !== undefined) {
			var previousPath = Session.get("previousLocationPath");
			Session.set("previousLocationPath", undefined);
			Session.set("previousLocationPath", null);
			Router.go(previousPath);
		} else {
			Router.go("/statistics/asdfghi");
		}

	},
    'click [name="uploadPlayersPointsADMIN"]':function(e)
    {
    	if(Session.get("uploadTour") == undefined || Session.get("uploadTourID") == undefined)
    	{
    		alert("Please select tournament");
    		return false;
    	}
    	else if(Session.get("uploadSport") == undefined)
    	{
    		alert("Please select sport");
    		return false;
    	}
    	else if(Session.get("uploadEvent") == undefined)
    	{
    		alert("Please select event");
    		return false;
    	}
    },
    
    'change #tourList': function(event, template) {
    	try{
        	event.preventDefault();

            var tour =event.target.value;
            var tourID = $("[name='tourList'] option:selected").attr("name");
            Session.set("uploadTour", tour);
            Session.set("uploadTourID", tourID);
            if(tourID == "Other" || tour == "Other")
            {
               $("#sportsDiv").show();
            }
            else
            {
               $("#sportsDiv").hide();
	            var tourInfo = pastEvents.findOne({"_id":tourID,"tournamentEvent":true});
	            if(tourInfo && tourInfo.projectId && tourInfo.projectId[0])
	            {
					Session.set("tourn_sport",tourInfo.projectId[0]);
					
					Session.set("tourn_set",tourInfo.projectId[0]);

	            }
           }
               
        }catch(e)
        {
        	alert(e)
        }
         
    },
    'change #sportList': function(e) {

    	try{
        var sport = e.target.value;
        var sportID = $("[name='sportList'] option:selected").attr("name");
        Session.set("tourn_sport", sportID);
        Session.set("uploadSport", sportID);

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
    }catch(e)
    {
    	alert(e)
    }
        
    },
    'click [name=eventList]': function(e) {
        $('[name=eventList]').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var eventName = obj.val();
                var eventID = $("[name='eventList'] option:selected").attr("name");
                Session.set("uploadEvent", eventName);
            }, 0);
        });
    },
    'change [name="uploadPlayersPointsADMIN"]':function(event, template)
    {
    	Session.set("points_uploadedFile","uploaded");    	
    	Session.set("points_errorLogsSession",undefined)
		Session.set("points_fileHandleData",undefined)
    	var fileHandle = event.target.files[0];
		var errorsArray = [];
		try
		{
			Papa.parse(fileHandle, {
				header: true,keepEmptyRows:false,skipEmptyLines: true,
				beforeFirstChunk: function( chunk ) 
				{
				    var rows = chunk.split( /\r\n|\r|\n/ );
				    Session.set("errorsInHead",0)
				    return chunk;
				       		        
				},
				complete: function(fileData, file) 
				{
					if(Session.get("errorsInHead")==0)
				   	{
				   		Session.set("points_fileHandleData",fileData.data)

					   	if(fileData.errors.length==0)
					   	{
					   		if(fileData.data.length==0){
					   			var data = {line:2,message:"data is empty"}
					        	errorsArray.push(data)
								Session.set("points_errorLogsSession",errorsArray)
					   		}
					   	}
					   	else if(fileData.errors.length!==0)
					   	{
					   		for(var e = 0;e<fileData.errors.length;e++){
					   			var data = {
					   				line:"CSV PARSE ERROR",
					   				message:JSON.stringify(fileData.errors[e])
					   			}
					   			errorsArray.push(data)
					   		}					   			
							Session.set("points_errorLogsSession",errorsArray)
					   	}

					   	if(fileData.errors.length==0&&fileData.data.length!=0)
					   	{
					   		var affiliationIdList= [];
						   	for(var i=0;i<fileData.data.length;i++)
						   	{
						

								var linNumber = parseInt(i+1+1);
						   		var findForEmptyslno=fileData.data[i]["Sl.No"];
						   		var findForEmptyUserName=fileData.data[i].userName;
						   		var findForEmptyAffiliationID=fileData.data[i].AffiliationID;


						   		if(Session.get("uploadTour"))
								{
								    if(Session.get("uploadTour").trim() != "Other")
								    {
								    	if(Object.keys(fileData.data[i]).length > 4)
								    	{
											var data = {line:linNumber,message:"Tournaments are more"}
					   						errorsArray.push(data)
					   						Session.set("points_errorLogsSession",errorsArray)
								    	}
								    }
								    else
								    {
								    	var headers = Object.keys(fileData.data[i]);
								    	for(var w=3;w<headers.length;w++)
								    	{
								    		if(headers[w].trim() == "")
								    		{
								    			var data = {line:linNumber,message:"Header(Tournament Name) is empty"}
					   							errorsArray.push(data)
					   							Session.set("points_errorLogsSession",errorsArray)
								    		}
								    	}

								    }
								}

								if(findForEmptyslno==null||findForEmptyslno=="null"||
						   			findForEmptyslno.trim().length==0||
						   			findForEmptyslno==undefined||findForEmptyslno=="undefined")
						   		{
						   			var data = {line:linNumber,message:"Sl.No is empty"}
					   				errorsArray.push(data)
					   				Session.set("points_errorLogsSession",errorsArray)
						   		}

						   		if(findForEmptyAffiliationID==null||findForEmptyAffiliationID=="null"||
						   			findForEmptyAffiliationID.trim().length==0|| findForEmptyAffiliationID==undefined||
						   			findForEmptyAffiliationID=="undefined" || findForEmptyAffiliationID =="other")
								{
						   			var data = {line:linNumber,message:"AffiliationID is not valid"}
					   				errorsArray.push(data)
					   				Session.set("points_errorLogsSession",errorsArray)
						   		}
						   		else
								{		
									if(Session.get("playerDBName"))	
									{
										var userInfo = nameToCollection(Session.get("playerDBName")).findOne({
						   				"affiliationId":findForEmptyAffiliationID,
						   				"interestedProjectName":{$in:[Session.get("tourn_sport")]}})						   			   						 
							   			if(!userInfo||userInfo==undefined)
							   			{
											var data = {line:linNumber,message:"Invalid affiliationId/Invalid Sport Player"}
								   			errorsArray.push(data)
								   			Session.set("points_errorLogsSession",errorsArray)
							   			}
							   			else
							   			{
							   			   	if (_.findWhere(affiliationIdList,findForEmptyAffiliationID) == null)
	              							{
	                							affiliationIdList.push(findForEmptyAffiliationID);
	              							}
	              							else
	              							{
	              								var data = {line:linNumber,message:"duplicate affiliationId"}
								   				errorsArray.push(data)
								   				Session.set("points_errorLogsSession",errorsArray)
	              							}
							   			}
									}	
									else
									{
											var data = {line:linNumber,message:"Invalid Sport Player"}
								   			errorsArray.push(data)
								   			Session.set("points_errorLogsSession",errorsArray)
									}		   				
						   									   				
						   		}						   			
						   	}
						}
				    }
				}
			});
		}catch(e){}
	},
    "click #uploadPointsBtn":function(event)
    {
        var fileStatus = Session.get("points_uploadedFile");
    	if(fileStatus != undefined)
    	{
    		if(Session.get("points_errorLogsSession"))
    		{
				alert("cannot upload, correct the errors and try again")
			}
			else
			{
				var fileHandle = Session.get("points_fileHandleData")
				var playersDetails = fileHandle;
				var sortedData = [];
				try
				{
				for (var i = 0; i < playersDetails.length; i++) 
				{
					var data = {};
					data["playerName"] = playersDetails[i].Name.trim();
					data["affiliationId"] = playersDetails[i].AffiliationID.trim();
					//data["sport"] = Session.get("uploadSport");
					data["event"] = Session.get("uploadEvent");
					var tournInfo = [];
					var headers = Object.keys(playersDetails[i]);
					for(var x=3;x<headers.length;x++)
					{
						var tourJson = {}
						if(Session.get("uploadTour"))
						{

							if(Session.get("uploadTour") == "Other" && Session.get("uploadTourID") == "Other")
							{
								tourJson["tournamentId"] = "0";
								tourJson["tournamentName"] = headers[x].trim();
							}
							else
							{
								tourJson["tournamentId"] = Session.get("uploadTourID");
								tourJson["tournamentName"] = Session.get("uploadTour");
							}

						}
						tourJson["tournamentPoints"] = playersDetails[i][headers[x]].trim();
						tournInfo.push(tourJson);
					}		
					data["tournInfo"] = tournInfo;
					sortedData.push(data);

				}

				Meteor.call("playerPointsUpload",sortedData,Session.get("uploadTourID"),Session.get("tourn_sport"),function(error,response)
					{

						if(response)
						{
							$("#alreadySubscribedText").text("Points uploaded!!");
                    		$("#sendingMailPopup3").modal({backdrop: 'static'});;
                    		setTimeout(function(){
                                $("#sendingMailPopup3").modal('hide');
                                Router.go("/statistics/asdfghi");
                            }, 1000);
						}
						else
						{
							alert(error)
						}
						
					});

			}catch(e){}

			}
    	}
    	else
    	{
    		alert("Please upload file");
    		
    	}
    }
});


Template.registerHelper("checkTournamentType",function()
{
	if(Session.get("uploadTour"))
	{
		var tour = Session.get("uploadTour");
		if(tour.trim() != "Other")
			return true;
		else
			return false;
	}

})
Template.registerHelper('checkRanking', function(eventId) {

	try{
	if(Session.get("uploadTour"))
	{
		var tour = Session.get("uploadTour");
		if(tour.trim() != "Other")
		{
			var tournamentId = Session.get("uploadTourID");
			var eventOrganizer = Meteor.userId();
			var sport = Session.get("uploadSport");
			var filtersEnabled = dobFilterSubscribe.findOne({"eventOrganizer" :eventOrganizer.trim() , 
				"mainProjectId" : sport.trim(),"details.eventId":eventId,
				"tournamentId":tournamentId.trim()});

			if(filtersEnabled)
			{
             	if(filtersEnabled.details)
             	{
              		var details = filtersEnabled.details;
		            for(var d=0; d<details.length;d++)
		            {
		                if(details[d].eventId == eventId)
		                {
		                  if(details[d].ranking == "yes")
		                  	return true;
		                  else
		                  	return false;
		                  break;
		                }
		                else
		                  continue;
		            }
             	}
			}
		}
	}
}catch(e){}

});
