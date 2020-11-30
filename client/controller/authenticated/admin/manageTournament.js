var mailRegex = /[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
var mobileRegex = new RegExp("^[0-9]{10,10}$");

var dbsrequired = ["userDetailsTT"]

var nameToCollection = function(name) {
  return this[name];
};

var singleEventsArray = [];
var checkOkClicked = [];
var arr = [];


Template.adminManageTournament.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");

});

Template.adminManageTournament.onRendered(function(){
});

Template.adminManageTournament.helpers({
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
						boolVal=false;
						break;
					}
				};
			}
			return boolVal
		}catch(e){
		}
	}
	
});

Template.adminManageTournament.events({
	'click #manageSubscription':function(e)
	{
		$("#manageSubscriptionDisplay").empty();
		$("#roleBasedSubscriptionDisplay").empty();
		$("#controlSubscriptionDisplay").empty();
		$("#tournamentSubscriptionLayout").empty();
        $("#drawFilterContent").empty();
        $("#drawsContent").empty();
        $("#drawsEntryContent").empty();
        $("#manageTournamentContent").empty();
        $("#bulkSubscriptionContent").empty();



    

		$('#manageSubscription').removeClass("ip_button_DarkGrey");
  		$('#manageSubscription').addClass("ip_button_White");
  		$('#tournamentSubscription').removeClass("ip_button_White");
  		$('#tournamentSubscription').addClass("ip_button_DarkGrey");
        $('#manageTournamentDraws').removeClass("ip_button_White");
        $('#manageTournamentDraws').addClass("ip_button_DarkGrey");
  		$('#manageTournamentEntryDraws').removeClass("ip_button_White");
        $('#manageTournamentEntryDraws').addClass("ip_button_DarkGrey");


        $('#uploadSubscription').removeClass("ip_button_White");
        $('#uploadSubscription').addClass("ip_button_DarkGrey");

        


        $('#manageTournament').removeClass("ip_button_White");
        $('#manageTournament').addClass("ip_button_DarkGrey");


		Blaze.render(Template.manageSubscription, $("#manageSubscriptionDisplay")[0]);

	},
	
	'click #tournamentSubscription':function(e)
	{
		$("#roleBasedSubscriptionDisplay").empty();
		$("#manageSubscriptionDisplay").empty();
		$("#controlSubscriptionDisplay").empty();
		$("#tournamentSubscriptionLayout").empty();
        $("#drawFilterContent").empty();
        $("#drawsContent").empty();
        $("#drawsEntryContent").empty();
        $("#manageTournamentContent").empty();
        $("#bulkSubscriptionContent").empty();


		$('#tournamentSubscription').removeClass("ip_button_DarkGrey");
  		$('#tournamentSubscription').addClass("ip_button_White");
  		$('#manageSubscription').removeClass("ip_button_White");
  		$('#manageSubscription').addClass("ip_button_DarkGrey");
        $('#manageTournamentDraws').removeClass("ip_button_White");
        $('#manageTournamentDraws').addClass("ip_button_DarkGrey");
        $('#manageTournamentEntryDraws').removeClass("ip_button_White");
        $('#manageTournamentEntryDraws').addClass("ip_button_DarkGrey");


        $('#uploadSubscription').removeClass("ip_button_White");
        $('#uploadSubscription').addClass("ip_button_DarkGrey");

        $('#manageTournament').removeClass("ip_button_White");
        $('#manageTournament').addClass("ip_button_DarkGrey");


		Blaze.render(Template.subscriptionSelectionForm, $("#roleBasedSubscriptionDisplay")[0]);


	},
    "click #manageTournamentDraws":function(e)
    {
        $("#manageSubscriptionDisplay").empty();
        $("#roleBasedSubscriptionDisplay").empty();
        $("#controlSubscriptionDisplay").empty();
        $("#tournamentSubscriptionLayout").empty();
        $("#drawFilterContent").empty();
        $("#drawsContent").empty();
        $("#drawsEntryContent").empty();
        $("#manageTournamentContent").empty();
        $("#bulkSubscriptionContent").empty();

        $('#tournamentSubscription').removeClass("ip_button_White");
        $('#tournamentSubscription').addClass("ip_button_DarkGrey");
        $('#manageSubscription').removeClass("ip_button_White");
        $('#manageSubscription').addClass("ip_button_DarkGrey");
        $('#manageTournamentEntryDraws').removeClass("ip_button_White");
        $('#manageTournamentEntryDraws').addClass("ip_button_DarkGrey");

        $('#manageTournamentDraws').removeClass("ip_button_DarkGrey");
        $('#manageTournamentDraws').addClass("ip_button_White");


        $('#uploadSubscription').removeClass("ip_button_White");
        $('#uploadSubscription').addClass("ip_button_DarkGrey");

        $('#manageTournament').removeClass("ip_button_White");
        $('#manageTournament').addClass("ip_button_DarkGrey");

        Blaze.render(Template.drawsSelectionForm, $("#drawFilterContent")[0]);



    },


    //manageTournamentEntryDraws

    "click #manageTournamentEntryDraws":function(e)
    {
        $("#manageSubscriptionDisplay").empty();
        $("#roleBasedSubscriptionDisplay").empty();
        $("#controlSubscriptionDisplay").empty();
        $("#tournamentSubscriptionLayout").empty();
        $("#drawFilterContent").empty();
        $("#drawsContent").empty();
        $("#drawsEntryContent").empty();
        $("#manageTournamentContent").empty();
        $("#bulkSubscriptionContent").empty();


        $('#tournamentSubscription').removeClass("ip_button_White");
        $('#tournamentSubscription').addClass("ip_button_DarkGrey");
        $('#manageSubscription').removeClass("ip_button_White");
        $('#manageSubscription').addClass("ip_button_DarkGrey");

        $('#manageTournamentDraws').removeClass("ip_button_White");
        $('#manageTournamentDraws').addClass("ip_button_DarkGrey");

        $('#manageTournamentEntryDraws').removeClass("ip_button_DarkGrey");
        $('#manageTournamentEntryDraws').addClass("ip_button_White");


        $('#uploadSubscription').removeClass("ip_button_White");
        $('#uploadSubscription').addClass("ip_button_DarkGrey");

        $('#manageTournament').removeClass("ip_button_White");
        $('#manageTournament').addClass("ip_button_DarkGrey");


        Blaze.render(Template.eventDrawsSelectionForm, $("#drawFilterContent")[0]);



    },

    'click #manageTournament':function(e)
    {
        $("#manageSubscriptionDisplay").empty();
        $("#roleBasedSubscriptionDisplay").empty();
        $("#controlSubscriptionDisplay").empty();
        $("#tournamentSubscriptionLayout").empty();
        $("#drawFilterContent").empty();
        $("#drawsContent").empty();
        $("#drawsEntryContent").empty();
        $("#manageTournamentContent").empty();
        $("#bulkSubscriptionContent").empty();


        $('#tournamentSubscription').removeClass("ip_button_White");
        $('#tournamentSubscription').addClass("ip_button_DarkGrey");

        $('#manageSubscription').removeClass("ip_button_White");
        $('#manageSubscription').addClass("ip_button_DarkGrey");

        $('#manageTournamentDraws').removeClass("ip_button_White");
        $('#manageTournamentDraws').addClass("ip_button_DarkGrey");

        $('#manageTournamentEntryDraws').removeClass("ip_button_White");
        $('#manageTournamentEntryDraws').addClass("ip_button_DarkGrey");

        $('#uploadSubscription').removeClass("ip_button_White");
        $('#uploadSubscription').addClass("ip_button_DarkGrey");

        $('#manageTournament').removeClass("ip_button_DarkGrey");
        $('#manageTournament').addClass("ip_button_White");

        Blaze.render(Template.manageTournamentFeatures, $("#manageTournamentContent")[0]);

    },
    'click #uploadSubscription':function(e)
    {
        $("#manageSubscriptionDisplay").empty();
        $("#roleBasedSubscriptionDisplay").empty();
        $("#controlSubscriptionDisplay").empty();
        $("#tournamentSubscriptionLayout").empty();
        $("#drawFilterContent").empty();
        $("#drawsContent").empty();
        $("#drawsEntryContent").empty();
        $("#manageTournamentContent").empty();
        $("#bulkSubscriptionContent").empty();

      

        $('#tournamentSubscription').removeClass("ip_button_White");
        $('#tournamentSubscription').addClass("ip_button_DarkGrey");

        $('#manageSubscription').removeClass("ip_button_White");
        $('#manageSubscription').addClass("ip_button_DarkGrey");

        $('#manageTournamentDraws').removeClass("ip_button_White");
        $('#manageTournamentDraws').addClass("ip_button_DarkGrey");

        $('#manageTournamentEntryDraws').removeClass("ip_button_White");
        $('#manageTournamentEntryDraws').addClass("ip_button_DarkGrey");

       
        $('#manageTournament').removeClass("ip_button_White");
        $('#manageTournament').addClass("ip_button_DarkGrey");

        $('#uploadSubscription').removeClass("ip_button_DarkGrey");
        $('#uploadSubscription').addClass("ip_button_White");

        Blaze.render(Template.bulkSubscription, $("#bulkSubscriptionContent")[0]);

    }

})

Template.manageTournamentFeatures.events({

    "click #tournamentNameChange":function(e)
    {
        $("#tournamentContent").empty();
        $("#tournamentNameContent").empty();
        $("#tournamentDrawMatchSetContent").empty();

        Blaze.render(Template.tournamentNameLayout, $("#tournamentNameContent")[0]);
        $("#tournamentNameLayout").modal({backdrop: 'static'});
    },
    "click #tournamentSetChange":function(e)
    {
        $("#tournamentContent").empty();
        $("#tournamentNameContent").empty();
        $("#tournamentDrawMatchSetContent").empty();

        Blaze.render(Template.tournamentDrawMatchSetLayout, $("#tournamentDrawMatchSetContent")[0]);
        //$("#tournamentNameLayout").modal({backdrop: 'static'});
    },


})


Template.bulkSubscription.onCreated(function(){
    Session.set("subTourID",undefined);
    Session.set("subCategory",undefined);
    Session.set("subEvents",undefined);
    Session.set("errorLogsSession",undefined);
    Session.set("dupPlayers",undefined);
    Session.set("regPlayers",undefined);
    Session.set("uploadStatus",undefined)
    Session.set("fileHandleData", undefined)

    this.subscribe("upcomingEventsNamePub");   
    this.subscribe("associationDetails");

    var self = this;
    self.autorun(function () {
        if(Session.get("subTourID") != undefined)
        {
        self.subscribe("eventFeeSettingsOfTourn",Session.get("subTourID"));
        }
    });


})

Template.bulkSubscription.helpers({

    "tourList":function(){
        var tournamentList = events.find({"tournamentEvent":true}).fetch();
        tournamentList =    _.sortBy(tournamentList, 'eventName');
        return tournamentList;

    },
    "categoryList":function(){
        if(Session.get("subEvents") != undefined)
        {
            return Session.get("subEvents");
        }
    },
    "logsError":function(){
        if(Session.get("errorLogsSession")){
            return Session.get("errorLogsSession")
        }
    },
    "regPlayersLog":function(){
        if(Session.get("regPlayers"))
            return Session.get("regPlayers")
    },
    "regPlayersCount":function(){
        if(Session.get("regPlayers"))
        {
            var playerArr = Session.get("regPlayers");
            return playerArr.length;
        }
    },
    "dupPlayersLog":function(){
        if(Session.get("dupPlayers"))
            return Session.get("dupPlayers");
    },
    "dupPlayersCount":function(){
        if(Session.get("dupPlayers"))
        {
            var playerArr = Session.get("dupPlayers");
            return playerArr.length;
        }
    },
    "uploadStatus":function(){

        if(Session.get("uploadStatus"))
            return Session.get("uploadStatus")

    }
})

Template.bulkSubscription.events({
    'change #subTourSelection': function(e) {
        try{
            Session.set("uploadStatus",undefined)
            Session.set("subEvents",undefined)
            var tournamentID = $("[name='subTourSelection'] option:selected").attr("name");

            if(tournamentID != undefined)
            {
                Session.set("subTourID",tournamentID)
                var tourInfo = events.findOne({"_id":tournamentID});
                if(tourInfo)
                {
                    Meteor.call("fetchEventsOfTournament",tournamentID,function(error,result){
                        if(result)
                        {
                            Session.set("subEvents",result);
                        }
                    })     
                }                     
            }

              
        }catch(e)
        {
        }
    },
    'change #eventDrawList': function(e) {
        try{
  
            var category = $("[name='eventDrawList'] option:selected").attr("name");
            if(category != undefined)
            {
                Session.set("drawCategory",category)             
            }
     
        }catch(e){
        }
    },

    'change [name="uploadPlayersSubscription"]': function(event, template) {
        Session.set("uploadStatus",undefined)

        var fileHandle = event.target.files[0];
        var errorsArray = [];
        var errorMsg = [];
        Session.set("checkForMailPhone", 0)
        Session.set("checkForMailPhoneCSV",0)

        Session.set("numberOfPlayersInserted", undefined)
        Session.set("numberOfPlayersInsertedFinally", undefined)
        insertedREc = 0;
        Session.set("errorLogsSession", undefined)
        Session.set("fileHandleData", undefined)
        Session.set("logSuccessBeforeUpload", 0)
        Session.set("dupPlayers",undefined);
        Session.set("regPlayers",undefined)
     
        
        try {
            var eventSettings = eventFeeSettings.findOne({"tournamentId":Session.get("subTourID")});
            if(eventSettings && eventSettings.events)
            {
                Papa.parse(fileHandle, {
                    header: true,
                    keepEmptyRows: false,
                    skipEmptyLines: true,
                    beforeFirstChunk: function(chunk) {
                        var rows = chunk.split(/\r\n|\r|\n/);
                        var headings = rows[0].split(',');
                        var key = ["Sl.No.", "Name", "DOB", "EmailID", "PhoneNo", "Gender", "AssociationID"];
                            
                        var csvHeader = _.union(key, eventSettings.events);
                        if (_.isEqual(headings, csvHeader)) {
                            Session.set("errorsInHead", 0)
                            return chunk;
                        } 
                        else 
                        {
                            var data = {
                                line: 1,
                                message: "Unequal headers, headers should be in the following format:["+csvHeader+"]"
                            }
                            Session.set("errorsInHead", 1)
                            errorMsg.push(data)
                            Session.set("errorLogsSession", errorMsg)
                            return false;
                        }  
                    },
                        complete: function(fileData, file){
                            if (Session.get("errorsInHead") == 0)
                             {
                                Session.set("fileHandleData", fileData.data)
                                if (fileData.errors.length == 0){
                                    if (fileData.data.length == 0) {
                                        var data = {
                                            line: 2,
                                            message: "data is empty"
                                        }
                                        errorMsg.push(data)
                                        Session.set("errorLogsSession", errorMsg)
                                    }
                                } else if (fileData.errors.length !== 0) {
                                    for (var e = 0; e < fileData.errors.length; e++) {
                                        var data = {
                                            line: "CSV PARSE ERROR",
                                            message: JSON.stringify(fileData.errors[e])
                                        }
                                        errorMsg.push(data)
                                    }
                                    Session.set("errorLogsSession", errorMsg)
                                }

                                if (fileData.errors.length == 0 && fileData.data.length != 0) 
                                {
                                for (var i = 0; i < fileData.data.length; i++) 
                                {

                                    fileData.data[i]["Sl.No."] = fileData.data[i]["Sl.No."].trim().replace(/\s+/g,' ')
                                    fileData.data[i]["Name"] = fileData.data[i]["Name"].trim().replace(/\s+/g,' ');
                                    fileData.data[i]["PhoneNo"] = fileData.data[i]["PhoneNo"].trim().replace(/\s+/g,' ');
                                    fileData.data[i]["EmailID"] = fileData.data[i]["EmailID"].trim().replace(/\s+/g,' ');
                                    fileData.data[i]["DOB"] = fileData.data[i]["DOB"].trim().replace(/\s+/g,' ');
                                    fileData.data[i]["Gender"] = fileData.data[i]["Gender"].trim().replace(/\s+/g,' ');
                                    fileData.data[i]["AssociationID"] = fileData.data[i]["AssociationID"].trim().replace(/\s+/g,' ');


                                    //Session.set("fileHandleData", fileData.data)
                                    var slno = fileData.data[i]["Sl.No."];
                                    var userName = fileData.data[i].Name;
                                    var userPhone = fileData.data[i].PhoneNo
                                    var userMail = fileData.data[i].EmailID;
                                    var userDOB = fileData.data[i].DOB;
                                    var userGender = fileData.data[i].Gender;
                                    var userAssocID = fileData.data[i].AssociationID;

                                    //find for null and empty values
                                    var linNumber = parseInt(i + 1 + 1)
                                    errorMsg = dataValidation(slno,linNumber,"Sl.No.",errorMsg,"");
                                    errorMsg = dataValidation(userName,linNumber,"userName ",errorMsg,"");
                                    errorMsg = dataValidation(userPhone,linNumber,"phoneNumber ",errorMsg,"phoneNo");                            
                                    errorMsg = dataValidation(userDOB,linNumber,"DOB",errorMsg,"dob");
                                    errorMsg = dataValidation(userGender,linNumber,"Gender ",errorMsg,"gender");
                                    errorMsg = dataValidation(userMail,linNumber,"EmailID ",errorMsg,"emailID");
                                    errorMsg = dataValidation(userAssocID,linNumber,"AssociationID ",errorMsg,"associationID");



                                    var tourEvents = eventSettings.events;
                                    for(var m= 0; m < tourEvents.length; m++)
                                    {
                                        errorMsg = dataValidation(fileData.data[i][tourEvents[m]].trim().replace(/\s+/g,' '),linNumber,tourEvents[m]+" Category ",errorMsg,"category");

                                    }
                                    if (i == fileData.data.length - 1 && Session.get("errorLogsSession") == undefined) 
                                    {
                                        Session.set("logSuccessBeforeUpload", 1)
                                        Session.set("fileHandleData", fileData.data)
                                            //Do something if the end of the loop    
                                    }
                                }

                            }
                        }
                    }
                });

                }
                else
                {
                    errorMsg.push("Invalid tournament settings");
                }

                
            } catch (e) {}
       
    },
    'click #uploadSubscriptionBtn':function(e){

        Session.set("dupPlayers",undefined);
        Session.set("regPlayers",undefined);
        if(Session.get("subTourID"))
        {
            if(Session.get("fileHandleData"))
            {
                if (Session.get("errorLogsSession")) 
                {
                    displayMessage("cannot upload, correct the errors and try again")
                }
                else
                {

                    if($("#promo").val().length > 0)
                    {
                        Session.set("uploadStatus","Please wait while file is uploading");

                        var playerDetails = Session.get("fileHandleData");
                        var paramData = {};
                        paramData["tournamentId"] = Session.get("subTourID");
                        paramData["playerDetails"] = playerDetails;
                        paramData["promoCode"] = $("#promo").val();
                        Meteor.call("registrationSubscriptionUnderAssoc",paramData,function(error,result){
                            if(result)
                            {
                                if(result.status && result.status == "failure" && result.message)
                                {
                                    Session.set("uploadStatus",result.message)
                                    displayMessage(result.message)
                                }

                                else
                                {
                                    Session.set("uploadStatus","file uploading is done");
                                    //Session.set("fileHandleData", undefined)
                                    // $("[name='uploadPlayersSubscription']").val(null);

                                    if(result.dupPlayers)
                                        Session.set("dupPlayers",result.dupPlayers);
                                    if(result.regPlayers)
                                        Session.set("regPlayers",result.regPlayers);

                                }
                            }
                           
                        })
                    }
                    else
                    {
                        displayMessage("add promo")
                    }
                  


                }
            }
            else
            {
                displayMessage("Upload file")
            }
        }
        else
        {
            displayMessage("Choose Tournament")
        }
       
    },
    'click #downloadDupPlayers':function(e)
    {
        e.preventDefault();
        var csv = Papa.unparse(Session.get("dupPlayers"));
        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
        var link = document.createElement("a");    
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = "DuplicatedPlayers.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
    },
    'click #downloadRegPlayers':function(e){
        e.preventDefault();
        var csv = Papa.unparse(Session.get("regPlayers"));
        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
        var link = document.createElement("a");    
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = "RegisteredSubscribedPlayers.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);  
    }
   
})

function dataValidation(dataType,lineNumber,dataMessage,errorMsg,type)
{

    if(type == "dob")
    {
        if (dataType == null || dataType == "null" || dataType.trim().length == 0 || 
            dataType == undefined || dataType == "undefined" || 
            moment(dataType, 'DD MMM YYYY', true).isValid() == false)
        {

            var data = {
                line: lineNumber,
                message: "dateOfBirth row is not valid, format should be (DD MMM YYYY)"
            }
                
            errorMsg.push(data)
            Session.set("errorLogsSession", errorMsg)
        }

    }
    else if(type == "phoneNo")
    {
        if(dataType != null && dataType != undefined && 
                dataType != "null" && dataType != "undefined" && dataType.length > 0)
        {       
            if (mobileRegex.test(dataType) == false) 
            {
                var data = {
                    line: lineNumber,
                    message: "Invalid "+dataMessage
                }
                errorMsg.push(data)
                Session.set("errorLogsSession", errorMsg)
            }                             
        }
    }
    else if(type == "emailID")
    {
        if (dataType == null || dataType == "null" || dataType == undefined ||
            dataType == "undefined" || dataType.length == 0) 
        {
            var data = {
                line: lineNumber,
                message: "Invalid "+dataMessage
            }
            errorMsg.push(data)
            Session.set("errorLogsSession", errorMsg)
        }
        else if(dataType != null && dataType != "null" && dataType != undefined &&
            dataType != "undefined" && dataType.trim().length != 0)
        {
            if (mailRegex.test(dataType) == false) 
            {
                var data = {
                    line: lineNumber,
                    message: "Invalid "+dataMessage
                }
                errorMsg.push(data)
                Session.set("errorLogsSession", errorMsg)
            }
        }
    }
    else if(type == "gender")
    {
        if (dataType == null || dataType == "null" || dataType.trim().length == 0 || 
            dataType == undefined || dataType == "undefined")
        {

            var data = {
                "line": lineNumber,
                "message": dataMessage+"is not valid"
            }
                
            errorMsg.push(data)
            Session.set("errorLogsSession", errorMsg)
        }
        else if(dataType != null && dataType != "null" && dataType.trim().length > 0 
            && dataType != undefined && dataType != " undefined")
        {
            var genderTypes = ["male","female"];
            if(genderTypes.indexOf(dataType.toLowerCase()) == -1)
            {
                var data = {
                    "line": lineNumber,
                    "message":"Invalid "+dataMessage+". Possible values are "+genderTypes.toString()
                    //"message": dataMessage+"invalid.. possible values are "+genderTypes.toString();
                }
                
                errorMsg.push(data)
                Session.set("errorLogsSession", errorMsg)
            } 

        }
    }
    else if(type == "associationID")
    {
        if (dataType == null || dataType == "null" || dataType.trim().length == 0 || 
            dataType == undefined || dataType == "undefined")
        {
            var data = {
                "line": lineNumber,
                "message": dataMessage+"is not valid"
            }
            errorMsg.push(data)
            Session.set("errorLogsSession", errorMsg)
            
        }     

        else if (dataType !== null && dataType !== "null" &&
            dataType !== undefined && dataType !== "undefined") 
        {

            var assocInfo = associationDetails.findOne({"userId":dataType});
            if(assocInfo == undefined)
            {
                var data = {
                    "line": lineNumber,
                    "message": "Invalid association "+dataType
                }
                errorMsg.push(data)
                Session.set("errorLogsSession", errorMsg)
            }                        
        }
    }
    else if(type == "category")
    {
        if (dataType != null && dataType != "null" && dataType.trim().length > 0 && 
            dataType != undefined && dataType != "undefined")
        {
            var categoryTypes = ["yes","no"];
            if(categoryTypes.indexOf(dataType.toLowerCase()) == -1)
            {
                var data = {
                    "line": lineNumber,
                    "message": "Invalid "+dataMessage+". Possible values are [yes,no]"
                }
                errorMsg.push(data)
                Session.set("errorLogsSession", errorMsg)
            }
        }    
    }
    else
    {
        if (dataType == null || dataType == "null" || dataType.trim().length == 0 || 
            dataType == undefined || dataType == "undefined")
        {
            var data = {
                "line": lineNumber,
                "message": dataMessage+"is not valid"
            }
            errorMsg.push(data)
            Session.set("errorLogsSession", errorMsg)
            
        }        
    }
    return errorMsg; 
}


Template.tournamentNameLayout.onCreated(function(){
    
    this.subscribe("upcomingEventsNamePub");   
    this.subscribe("pastEventsNamePub"); 

        $("#tournamentNameList").select2("close");

});

Template.tournamentNameLayout.onRendered(function(){

     $('#tournamentNameList').select2({
        width: '100%',
        color:"black"
    });
})



Template.tournamentNameLayout.helpers({
    tourList:function(){

        var upcomingList = events.find({"tournamentEvent":true}).fetch();
        var pastList = pastEvents.find({"tournamentEvent":true}).fetch();
        var tournamentList = upcomingList.concat(pastList);
        tournamentList =    _.sortBy(tournamentList, 'eventName');
        return tournamentList;
    },
})

Template.tournamentNameLayout.events({

    "click #saveTourName":function(e)
    {
        var tourID = $("[name='tournamentNameList'] option:selected").attr("name");
        var tourName = $("#newTourName").val();
        if(tourID == undefined || tourID == null)
        {
            displayMessage("Please select tournament");
        }
        else if(tourName == undefined || tourName == null)
        {
            displayMessage("Please enter tournament name to change");
        }
        else
        {
            if(tourName.trim().length == 0)
                displayMessage("Please enter tournament name to change");
            else
            {
                var param = {};
                param["tournamentId"] = tourID.trim();
                param["tourName"] = tourName.trim();
                Meteor.call("tournamentNameChange",param,function(error,result)
                {
                    if(result)
                    {
                        if(result.message)
                            displayMessage(result.message);
                        //$("#tournamentNameLayout").modal('hide');
                        //$('.modal-backdrop').remove();
                    }
                    else if(error)
                        displayMessage(error)
                })
            }

        }
    }
})


Template.tournamentDrawMatchSetLayout.onCreated(function(){

    Session.set("drawTourID",undefined);
    Session.set("drawCategory",undefined);
    this.subscribe("upcomingEventsNamePub");   
    var self = this;
    self.autorun(function () {
        if(Session.get("drawTourID") != undefined && Session.get("drawCategory") != undefined)
        {
        self.subscribe("MatchCollectionConfigTourCategory",Session.get("drawTourID"),Session.get("drawCategory"));
        }
    });

    

})

Template.tournamentDrawMatchSetLayout.helpers({
    tourList:function(){

        var upcomingList = events.find({"tournamentEvent":true}).fetch();
        upcomingList =    _.sortBy(upcomingList, 'eventName');
        return upcomingList;
    },
    "drawEvents":function()
    {
        if(Session.get("drawEventList"))
            return Session.get("drawEventList")
    },
    "settingsExist":function()
    {
        if(Session.get("drawTourID") != undefined && Session.get("drawCategory") != undefined)
        {
            var configInfo  = MatchCollectionConfig.findOne({"tournamentId":Session.get("drawTourID"),"eventName":Session.get("drawCategory")});

            if(configInfo && configInfo.roundValues)
            {
                var roundValues = _.without(configInfo.roundValues, _.findWhere(configInfo.roundValues, {
                    "roundName": "Winner"
                }));


                return roundValues;
            }

        }

    }
});
Template.tournamentDrawMatchSetLayout.events({
    'change #tourListSelection': function(e) {
        try{
  
            Session.set("drawEventList",undefined)
            var tournamentID = $("[name='tourListSelection'] option:selected").attr("name");

            if(tournamentID != undefined)
            {
                Session.set("drawTourID",tournamentID)
                var tourInfo = events.findOne({"_id":tournamentID});
                if(tourInfo)
                {
                    Meteor.call("fetchAdminDrawEvents",tournamentID,function(error,result){
                        if(result)
                        {
                            Session.set("drawEventList",result);
                        }
                    })     
                }                     
            }

              
        }catch(e)
        {
        }
    },
    'change #eventDrawList': function(e) {
        try{
  
            var category = $("[name='eventDrawList'] option:selected").attr("name");
            if(category != undefined)
            {
                Session.set("drawCategory",category)             
            }
     
        }catch(e){
        }
    },
    "keypress [name^=noofSetsPopup]": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true; 
    },
    "click #saveMatchSet":function(e)
    {
        var validationCheck = true;
        var roundValues = [];
        $("#scrollableDiv").find("[name^=roundNumberPopup]").each(function(i) {
                    var roundNumber = $("input[name='roundNumberPopup[" + $(this).val() + "]']").val();
                    var noofSets = $("input[name='noofSetsPopup[" + $(this).val() + "]']").val();
                    if(noofSets != undefined && noofSets != null && noofSets.length > 0)
                    {
                        var dataRound = {
                            roundNumber: roundNumber,
                            noofSets: noofSets,
                        }
                        roundValues.push(dataRound);

                    }
                    else
                    {
                        validationCheck = false;                  
                    }
                        
                    
                });

        if(validationCheck)
        {
            var paramJson = {};
            paramJson["tournamentId"] = Session.get("drawTourID");
            paramJson["eventName"] = Session.get("drawCategory");
            paramJson["roundValues"] = roundValues;

            Meteor.call("drawMatchSet",paramJson,function(error,result)
            {
                if(result)
                {
                    if(result.message)
                        displayMessage(result.message)
                }
                else if(error)
                    displayMessage(error)
            })

        }
        else
        {
            displayMessage("Please set valid noofSets")
        }

    }
})


/***********************************************************************/
Template.manageSubscription.onCreated(function(){
	
	this.subscribe("eventsTournament");
	Session.set("tournamentCategories",undefined);

});

Template.manageSubscription.helpers({

	upcomingEvents:function(){

		var upcomingEvents = events.find({tournamentEvent:true}).fetch();
		return upcomingEvents;
	},

	
});


Template.manageSubscription.events({

	'click #controlSubscription':function(e)
	{
		var tournamentID = $(e.target).attr("name");

		$("#controlSubscriptionDisplay").empty();
		Meteor.call("fetchEventsOfTournament",tournamentID,function(error,result){
			if(result)
			{
				Session.set("tournamentCategories",result);
			}
		});
		Blaze.render(Template.controlSubscriptionLayout, $("#controlSubscriptionDisplay")[0]);
		$("#controlSubscriptionLayout").modal({backdrop: 'static'});

	}

})

Template.controlSubscriptionLayout.helpers({

	"tournamentCategories":function(){
		if(Session.get("tournamentCategories"))
			return Session.get("tournamentCategories");
	},

})

Template.controlSubscriptionLayout.events({

	"click #saveAllowedSubscription":function()
	{
		var rowCount = $('#tournamentCategoryBody').find("tr").length;
		var paramArr = [];
		if(parseInt(rowCount) > 0)
		{
			
            $('#tournamentCategoryBody tr').each(function (i, row){

	        	var $row = $(row);
	        	var rowId = $row.attr("name");
	            var allowSubscription = $row.find('[name="allowSubscriptionVal"] option:selected').attr("name");
	       		var paramJson = {};
	       		paramJson["_id"] = rowId;
	       		paramJson["allowSubscription"] = allowSubscription;
	       		paramArr.push(paramJson);
	       });
            Meteor.call("updateEventSubscription",paramArr,function(error,result)
            {
            	if(result)
            	{
            		$("#controlSubscriptionLayout").modal('hide');
            		$('.modal-backdrop').remove();


            	}
            })
		}
	}
})

/***************************************************************************/

Template.subscriptionSelectionForm.onCreated(function(){
	
    this.subscribe("eventsTournament");

    Session.set("subscribeTournamentID",undefined);
    Session.set("subscribePlayerID",undefined);
    Session.set("subscribeTournSport",undefined);
    Session.set("playerDBName",undefined);

    var self = this;
    self.autorun(function () {
        if(Session.get("subscribeTournSport") != undefined)
            self.subscribe("adminSportPlayers", Session.get("subscribeTournSport"));
    });

	$("#tournamentSubscriptionLayout").empty();		

});


Template.subscriptionSelectionForm.helpers({

    upcomingTournaments:function(){
        var upcomingEvents = events.find({tournamentEvent:true}).fetch();
        return upcomingEvents;
    },
	playerList:function(){
        try{
            if(Session.get("subscribeTournSport") && Session.get("playerDBName"))
            {
                var userDetailsTTList = nameToCollection(Session.get("playerDBName")).find({},{sort:{"userName":1}}).fetch();
                return userDetailsTTList;  
            }
        }catch(e)
        {
        }
        
	}
	
});

Template.subscriptionSelectionForm.events({

	'click [name=tournamentList]': function(e) {
        $('[name=tournamentList]').bind("keydown change", function() {
            var obj = $(this);
         
            setTimeout(function() {
                var tournamentID = $("[name='tournamentList'] option:selected").attr("name");
               if(tournamentID != undefined)
            {
                var tourInfo = events.findOne({"_id":tournamentID});

                if(tourInfo && tourInfo.projectId)
                {
  
                    if(tourInfo.projectId[0])
                   {
                        Meteor.call("getSportsMainDB",tourInfo.projectId[0],function(e,res){
                            
                            if(res != undefined && res != null && res != false){
                                toRet = res
                                Session.set("playerDBName",toRet);
                                var playerID = $("[name='playerList'] option:selected").attr("name");
                                //$('#playerList').prop('selectedIndex', 0);

                                Session.set("subscribeTournSport",tourInfo.projectId[0])
                                Session.set("subscribeTournamentID",tournamentID);

                                if(playerID != undefined && tournamentID != undefined)
                                {
                                    Session.set("subscribeTournamentID",tournamentID);
                                    Session.set("subscribePlayerID",playerID);
                                    $("#tournamentSubscriptionLayout").empty();     
                                    Blaze.render(Template.adminSubscribeToTournamemnt, $("#tournamentSubscriptionLayout")[0]);
                                
                                }
                                

                            }
                            else if(res != undefined && res != null && res == 2){
                                toRet = false
                                Session.set("playerDBName",toRet);


                            }
                            else if(e){
                                toRet = false
                                Session.set("playerDBName",toRet);


                            }
                        })
                    
                        

                    }
                }
                       
            }
            }, 0);
        });
    },

	'change #tournamentList123': function(e) {
		try{
	        $("#tournamentSubscriptionLayout").empty();     
  
			var tournamentID = $("[name='tournamentList'] option:selected").attr("name");
			if(tournamentID != undefined)
			{
                var tourInfo = events.findOne({"_id":tournamentID});

                if(tourInfo && tourInfo.projectId)
                {
                    Session.set("subscribeTournSport",tourInfo.projectId[0])
                    Session.set("subscribeTournamentID",tournamentID);
                    if(Session.get("subscribeTournSport"))
                   {
                        Meteor.call("getSportsMainDB",Session.get("subscribeTournSport"),function(e,res){
                            if(res != undefined && res != null && res != false){
                                toRet = res
                                Session.set("playerDBName",toRet);
                                var playerID = $("[name='playerList'] option:selected").attr("name");
                                //$('#playerList').prop('selectedIndex', 0);

                                if(playerID != undefined && tournamentID != undefined)
                                {
                                    Session.set("subscribeTournamentID",tournamentID);
                                    Session.set("subscribePlayerID",playerID);
                                    $("#tournamentSubscriptionLayout").empty();     
                                    Blaze.render(Template.adminSubscribeToTournamemnt, $("#tournamentSubscriptionLayout")[0]);
                                
                                }
                                

                            }
                            else if(res != undefined && res != null && res == 2){
                                toRet = false
                                Session.set("playerDBName",toRet);


                            }
                            else if(e){
                                toRet = false
                                Session.set("playerDBName",toRet);


                            }
                        })
                    
                        

                    }
                }
                       
			}    
    	}catch(e)
    	{
    	}
    },
    'change #playerList': function(e) {
    	try{
	        
			var playerID = $("[name='playerList'] option:selected").attr("name");
			var tournamentID = $("[name='tournamentList'] option:selected").attr("name");
			if(playerID != undefined && tournamentID != undefined)
			{
				Session.set("subscribeTournamentID",tournamentID);
				Session.set("subscribePlayerID",playerID);
				$("#tournamentSubscriptionLayout").empty();		
				Blaze.render(Template.adminSubscribeToTournamemnt, $("#tournamentSubscriptionLayout")[0]);
			
            }
	           
	    }catch(e){
	    }
    },

})

Template.adminSubscribeToTournamemnt.onCreated(function(){
	
	this.subscribe("eventsLISTForParam",Session.get("subscribeTournamentID"));
	this.subscribe("eventFeeSettingsOfTourn",Session.get("subscribeTournamentID"));
    this.subscribe("adminDobFilterSubscribeOnParam",Session.get("subscribeTournamentID"));

	
});


Template.adminSubscribeToTournamemnt.onRendered(function() {
        //multipleSubscriptionValid();

    arr = [];

    $('.scrollableLisst').slimScroll({
        height: '10.4em',
        color: 'black',
        size: '3px',
        width: '100%'
    });
    Session.set("subscriptionTypeHyperhyperLinkValue", undefined);
    Session.set("eventDetailsForMail", undefined);
    Session.set("eventDetailsSubForMailOnlyOrg", undefined);
    Session.set("eventParticipantSingleArray", arr)
    Session.set("eventDetailsUnSubForMailOnlyOrg", undefined);
    

});

Template.adminSubscribeToTournamemnt.onDestroyed(function() {
    Session.set("checkedEventForTeamSel", undefined);
    Session.set("checkedTeamForEvent", undefined);
    Session.set("arraySelectedEventTeam", undefined);
    Session.set("singleEventsArray", undefined);
    Session.set("removeSubscribedTeam", undefined);
    Session.set("removeSubscribedSingleEvent", undefined);
    Session.set("subscriptionTypeHyperhyperLinkValue", undefined);
    Session.set("eventDetailsForMail", undefined);
    Session.set("eventDetailsSubForMailOnlyOrg", undefined);
    Session.set("eventDetailsUnSubForMailOnlyOrg", undefined);
    Session.set("arrayOfSingleEventsOnLoad", undefined);
    Session.set("arrayOfTeamEventsOnLoad", undefined);
    Session.set("totalEntryFee", undefined)
    Session.set("eventIdOFSelectedTeamEvent", undefined)
    Session.set("eventParticipantSingleArray", undefined)
        //new
    Session.set("arrayofTeamCheckedSession", undefined);
    Session.set("arrayofUnTeamCheckedSession", undefined)
    Session.set("TeamCheckedSession", undefined)
    Session.set("eventNameOFSelectedTeamEvent", undefined)
    Session.set("eventIDOFSelectedTeamEvent", undefined)
    Session.set("arrayBackUp", undefined)

    arrayofTeamChecked = [];
    arrayofTeamChecked_IDs = []
    singleEventsArray = [];
    checkOkClicked = [];
    removedSingleSubscription = [];
    removedArray = [];
    arr = [];
});

Template.adminSubscribeToTournamemnt.helpers({
	"tournamentSession":function(){
		if(Session.get("subscribeTournamentID"))
			return true;

    },
	lEvent: function() {
        var lEvents = events.find({
            "_id": Session.get("subscribeTournamentID")
        }).fetch();
        if (lEvents) {
            return lEvents;
        }
    },
    lEventid: function() {
        return Session.get("subscribeTournamentID");

    },

    "eventsDetails": function() {
        var details = [];
        var key;
        try {
            var data = {};
            var lEvents = events.findOne({
                "_id":  Session.get("subscribeTournamentID")
            });
            if (lEvents && lEvents.eventsUnderTournament) {

                for (var j = 0; j < lEvents.eventsUnderTournament.length; j++) {
                    var eventDetails = events.findOne({
                        "_id": lEvents.eventsUnderTournament[j]
                    });
                    if (eventDetails)
                        data[eventDetails.abbName] = eventDetails._id;
                }
                var eventFeeSettingsFind = eventFeeSettings.findOne({
                    "tournamentId": Session.get("subscribeTournamentID")
                })
                if (eventFeeSettingsFind) {
                    var eventsNAMES = eventFeeSettingsFind.events;
                    key = eventsNAMES;
                    key.push("fees")
                } else
                    key = ["MCB", "MCG", "CB", "CG", "SJB", "SJG", "JB", "JG", "YB", "YG", "M", "W", "NMS", "NMD", "OS", "OD", "O", "fees"]

                var k = JSON.parse(JSON.stringify(data, key, 18));
                data["eventIds"] = _.values(k);
                data["eventAbbNames"] = _.keys(k);
                details.push(data);
            }
            return details
        } catch (e) {}
    },
     teamEventOrSingleEvent: function() {
        var eventId = this.trim().toString();
        var eventss = events.findOne({
            "_id": eventId
        });
        if (eventss != undefined && eventss.projectType != undefined) {
            if (eventss.projectType !== 1) {
                return "glyphicon glyphicon-eye-open"
            } else {
                return ""
            }
        }
    },
    dataOFBirthGenderPlayer: function() {
        try {
            if (Meteor.userId()) {
                var eventIdHTML = this.toString()
                var eventDetailsHTML = events.findOne({
                    "_id": eventIdHTML
                });
                if (eventDetailsHTML && eventDetailsHTML.projectType) {
                	if(eventDetailsHTML.allowSubscription)
                    {
                        if(eventDetailsHTML.allowSubscription == "no")
                        {
                            return false;
                        }
                    }
                    if (parseInt(eventDetailsHTML.projectType) != 1)
                        return true;
                    else {
                        var userIdDet = nameToCollection(Session.get("playerDBName")).findOne({
                            "userId": Session.get("subscribePlayerID")
                        });
                        if(userIdDet.gender==null||userIdDet.gender==undefined||userIdDet.gender.trim().length==0){
                            userIdDet.gender = "gender"
                        }
                        if (userIdDet && userIdDet.gender && userIdDet.dateOfBirth) 
                        {
                            var tournamentId = Session.get("subscribeTournamentID");
                            var tournDetails = events.findOne({
                                "_id": tournamentId,
                                tournamentEvent: true
                            });

                            var projectId = ""
                            if (eventDetailsHTML)
                                projectId = eventDetailsHTML.projectId
                            if (tournDetails) 
                            {
                                var birthDetails = dobFilterSubscribe.findOne({
                                    "mainProjectId": tournDetails.projectId.toString(),
                                    "eventOrganizer": tournDetails.eventOrganizer.toString(),
                                    "tournamentId": Session.get("subscribeTournamentID")
                                });

                                if (birthDetails && birthDetails.details) 
                                {
                                    for (var j = 0; j < birthDetails.details.length; j++) {
                                        var find1 = birthDetails.details[j];
                                        if (find1.ranking == "yes" && find1.eventId == projectId.toString()) {
                                            if (userIdDet.affiliationId !== null && userIdDet.affiliationId != undefined && userIdDet.affiliationId != "other" && userIdDet.statusOfUser == "Active") {
                                                if (find1.eventId == projectId.toString()) {
                                                    filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                                    userDate = moment(new Date(userIdDet.dateOfBirth)).format("YYYY/DD/MMM");

                                                    if (new Date(userDate) >= new Date(filterDate)) {

                                                        if (find1.gender.toUpperCase() == userIdDet.gender.trim().toUpperCase()) {
                                                            return true
                                                        } else if (find1.gender.toUpperCase() == "ALL") {
                                                            return true
                                                        } else {
                                                            return false
                                                        }
                                                    } else if (new Date(userDate) < new Date(filterDate)) {
                                                        return false
                                                    }
                                                }
                                            } else if (find1.eventId == projectId.toString()) {
                                                return false
                                            }
                                        } else if (find1.ranking == "no" && find1.eventId == projectId.toString()) {
                                            if (find1.eventId == projectId.toString()) {
                                                filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                                userDate = moment(new Date(userIdDet.dateOfBirth)).format("YYYY/DD/MMM");
                                                if (new Date(userDate) >= new Date(filterDate)) {
                                                    if (find1.gender.toUpperCase() == userIdDet.gender.trim().toUpperCase()) {
                                                        return true
                                                    } else if (find1.gender.toUpperCase() == "ALL") {
                                                        return true
                                                    } else {
                                                        return false
                                                    }
                                                } else if (new Date(userDate) < new Date(filterDate)) {
                                                    return false
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
        }
    },


})

Template.adminSubscribeToTournamemnt.events({


	"click #eventSubscribe123": function(e) {
        e.preventDefault();
		$("#manageSubscriptionDisplay").empty();
        $("#roleBasedSubscriptionDisplay").empty();
		Blaze.render(Template.subscriptionSelectionForm, $("#roleBasedSubscriptionDisplay")[0]);  
    },
    "change #mainTag": function(e) {
        e.preventDefault();
        try {
      
            var teamId = $(e.target).val();
            if (parseInt(teamId) !== 1) {
                //set teamId
                Session.set("TeamCheckedSession", undefined)
                Session.set("TeamCheckedSession", teamId)

                //get event id
                var name = Session.get("eventIDOFSelectedTeamEvent");
                //get event name
                var eventName = Session.get("eventNameOFSelectedTeamEvent")
                    //set data
                var data = {
                        eventName: eventName,
                        teamId: teamId,
                        
                    }
                    
                var arrBack = data;
                Session.set("arrayBackUp", arrBack)
                Session.set("teamMemberValidation_Ses", undefined);
            }
        } catch (e) {}
    },
     //on click of star
    "click #checkedOrNotPopup": function(e) {

    	try{
	        e.preventDefault();
	        
	        var eventIdFromHTML = this;
	        if ($(e.target).prev('input:checkbox[id="checkTeamOrSingle"]').prop("checked")) {
	            var findType = events.findOne({
	                "_id": eventIdFromHTML.trim().toString()
	            });
	            var projectType;
	            if (findType && findType.projectType) {
	                projectType = findType.projectType
	            }
	            if (parseInt(projectType) != 1) {
	                Session.set("eventIdOFSelectedTeamEvent", undefined)
	                Session.set("eventIdOFSelectedTeamEvent", findType.projectId.toString());

	                Session.set("eventNameOFSelectedTeamEvent", undefined)
	                Session.set("eventNameOFSelectedTeamEvent", findType.abbName.toString())

	                Session.set("eventIDOFSelectedTeamEvent", undefined)
	                Session.set("eventIDOFSelectedTeamEvent", findType._id.toString());

	                $("#renderTeamMultiSubs").empty();
	                Blaze.render(Template.adminSubscribePopUp, $("#renderTeamMultiSubs")[0]);
	                
	                $("#setEventNameHeader").html(findType.abbName);
	                Session.set("checkedEventForTeamSel", undefined);
	                Session.set("checkedEventForTeamSel", this._id);
	                $(".teamSubscribeMainTitle").scrollTop(0);;
	                $("#adminSubscribePopUp").modal({
	                    backdrop: 'static',
	                    keyboard: false
	                });
	            }
	        }
	    }catch(e){
	    }
    },
    //change of check box
    "change #checkTeamOrSingle": function(e) {
        e.preventDefault();
        var eventIdFromHTML = this;
        var findType = events.findOne({
            "_id": eventIdFromHTML.trim().toString()
        });
        var projectType;
        if (findType && findType.projectType) {
            projectType = findType.projectType
        }
        var playerId = Session.get("subscribePlayerID");
        var indexD = _.indexOf(_.pluck(arr, 'eventName'), $(e.target).val());

        var maximum = 7;
        var evePartsLength = 0;

        

        if (indexD != -1) {
            if ($(e.target).is(":checked")) {
                
                if (arr[indexD].eventName == $(e.target).val()) {
                    var eveSub = [];
                    if (arr[indexD].eventSubscribers !== undefined) {
                        eveSub = arr[indexD].eventSubscribers;
                    }
                    if (_.findWhere(eveSub, playerId) == null) {}
                    arr[indexD].eventUnsubscribers = _.reject(arr[indexD].eventUnsubscribers, function(item) {
                        return item === playerId;
                    });
                    arr[indexD].eventSubscribers = eveSub;
                } else if (arr[indexD].eventName !== $(e.target).val()) {
                    var eveSub = [];
                    var eventName = $(e.target).val()
                    if (_.findWhere(eveSub, playerId) == null) {
                        eveSub.push(playerId);
                    }
                    var data = {
                        eventName: eventName,
                        eventSubscribers: eveSub
                    }
                    if (_.findWhere(arr, data) == null) {
                        arr.push(data);
                    }

                }
            }
           
            else {
                if (arr[indexD].eventName == $(e.target).val()) {
                    arr[indexD].eventSubscribers = _.reject(arr[indexD].eventSubscribers, function(item) {
                        return item === playerId;
                    });
                    var arrUnsub = [];
                    if (arr[indexD].eventUnsubscribers) {
                        arrUnsub = arr[indexD].eventUnsubscribers;
                    }
                    if (_.findWhere(arrUnsub, playerId) == null) {
                        arrUnsub.push(playerId);
                    }
                    arr[indexD].eventUnsubscribers = arrUnsub;
                }
                if(parseInt(projectType) != 1){

                }
            }
        }
        else {
            if ($(e.target).is(":checked")) {
                var eveSub = [];
                var eventName = $(e.target).val()
                if (_.findWhere(eveSub, playerId) == null) {
                    eveSub.push(playerId);
                }
                var data = {
                    eventName: eventName,
                    eventSubscribers: eveSub
                }
                arr.push(data)
            } else {
                //to unsub
                var eveUnSub = [];
                var eventName = $(e.target).val()
                if (_.findWhere(eveUnSub, playerId) == null) {
                    eveUnSub.push(playerId);
                }
                var data = {
                    eventName: eventName,
                    eventUnsubscribers: eveUnSub
                }
                arr.push(data)
            }
        }
        //if project type is team
        if (parseInt(projectType) != 1) {
            if ($(e.target).is(":checked")) {
                //set projectId
                Session.set("eventIdOFSelectedTeamEvent", undefined)
                Session.set("eventIdOFSelectedTeamEvent", findType.projectId.toString());
                //set eventAbbName
                Session.set("eventIDOFSelectedTeamEvent", undefined)
                Session.set("eventNameOFSelectedTeamEvent", findType.abbName.toString());
                //set _id of event
                Session.set("eventIDOFSelectedTeamEvent", undefined)
                Session.set("eventIDOFSelectedTeamEvent", findType._id.toString());
                //set team selected to undefined (to restore when unchecked and then again checked)
                Session.set("TeamCheckedSession", undefined)
                    //render team sub popup
                $("#renderTeamMultiSubs").empty();
                Blaze.render(Template.adminSubscribePopUp, $("#renderTeamMultiSubs")[0]);
                $("#setEventNameHeader").html(findType.abbName);
                Session.set("checkedEventForTeamSel", undefined);
                Session.set("checkedEventForTeamSel", this._id);
                $(".teamSubscribeMainTitle").scrollTop(0);;
                $("#adminSubscribePopUp").modal({
                    backdrop: 'static',
                    keyboard: false
                });

               


            } else {
                //if unchecked
                //remove the data from session
                var arrayofTeamChecked_IDs = [];
                if (Session.get("arrayofTeamCheckedSession")) {
                    arrayofTeamChecked_IDs = Session.get("arrayofTeamCheckedSession")
                }
                var eventName = findType.abbName.toString()
                var indexD = _.indexOf(_.pluck(arrayofTeamChecked_IDs, 'eventName'), eventName);
                if (indexD !== -1) {
                    arrayofTeamChecked_IDs.splice(indexD, 1)
                }
                Session.set("arrayofTeamCheckedSession", arrayofTeamChecked_IDs);
            }
        }

        Session.set("eventParticipantSingleArray", arr);
    },
    "submit form": function(e) {
        e.preventDefault();
        multipleSubscriptionValid();
    },
    "click #eventSubscribeCancel": function(e) {
        e.preventDefault();
        $("#tournamentSubscriptionLayout").empty();	
        $("#renderTeamMultiSubs").empty();	

        $("#manageSubscriptionDisplay").empty();
        $("#roleBasedSubscriptionDisplay").empty();
		$("#controlSubscriptionDisplay").empty();
		$("#tournamentSubscriptionLayout").empty();
		Blaze.render(Template.subscriptionSelectionForm, $("#roleBasedSubscriptionDisplay")[0]);  	
	
    },
	"click #errorPopupClose": function(e) {
        e.preventDefault();
        $('#errorPopup').modal('hide');
    }, 

})

/**************************************************************************/

Template.adminSubscribePopUp.onCreated(function(){
	this.subscribe("onlyLoggedIn");
    this.subscribe("onlyLoggedInALLRoles")
    this.subscribe("teamsOfUserBasedOnUser",Session.get("subscribePlayerID"));
    this.subscribe("adminTF");
    this.subscribe("playerTeamEntriesAdmin", Session.get("subscribeTournamentID"),Session.get("subscribePlayerID"))     


	
});


Template.adminSubscribePopUp.onRendered(function(){

    Session.set("teamMemberValidation_Ses",undefined);
	$("#adminSubscribePopUp").on('show.bs.modal', function(event) {
		$(".teamSubscribeMainTitle").scrollTop(0);;
		$('.modal-content').scrollTop(0);
	});
	$("#adminSubscribePopUp").on('hide.bs.modal', function(event) {
		$(".teamSubscribeMainTitle").scrollTop(0);;
		$('.modal-content').scrollTop(0);
		Session.set("checkedEventForTeamSel",undefined);
		Session.set("checkedTeamForEvent",undefined);
		Session.set("che",undefined);
	});
	
	
});


Template.adminSubscribePopUp.helpers({

    lEventid: function() {
        return Session.get("subscribeTournamentID");
    },
	
	"lTeams":function(){
		try{
		var eventId = Session.get("subscribeTournamentID");
		var eveType = events.findOne({"_id":eventId});
		var teamList;
		var userId = nameToCollection(Session.get("playerDBName")).findOne({"userId":Session.get("subscribePlayerID")})
        if(userId&&userId.userId&&Session.get("eventIdOFSelectedTeamEvent")!=undefined&&Session.get("eventIdOFSelectedTeamEvent")!=null)
		{
			teamList = playerTeams.find({"teamManager":userId.userId.toString(),teamFormatId:Session.get("eventIdOFSelectedTeamEvent").trim().toString()}).fetch();
		}

	 	if(teamList){
	 		if(teamList.length==2){
	 			
	 		}
	 		if(teamList.length==1){
	 			
	 		}
	 		return teamList;
	 	}

	 }catch(e){
	 }
	},
	"selectedPlayerNameEdit":function(){
		try{
			if(Session.get("TeamCheckedSession")){
				var selectedTeamID = Session.get("TeamCheckedSession")
				if(selectedTeamID){
					var players = playerTeams.findOne({"_id":selectedTeamID});
					if(players&&players.teamMembers){
						return players.teamMembers
					}
				}
			}	
		}catch(e){
		}
	},
	playerCriteriasEdit:function(){
        try{
        if(Session.get("eventIdOFSelectedTeamEvent")!==undefined){
            var find = teamsFormat.findOne({"_id":Session.get("eventIdOFSelectedTeamEvent")});
            if(find&&find.playerFormatArray){
                return find.playerFormatArray;
            }
        }
        }catch(e){

        }
    },
    GenderCriteriaEdit:function(){
        try{
        var gender_H = this.gender;
        var mandatory_H = this.mandatory;
        var stringToDisp = "";
        var gender_H_D = "";
        var mandatory_H_D;
        if(gender_H.toLowerCase()=="male"){
            gender_H_D = "Male"+" ";
        }
        else if(gender_H.toLowerCase()=="female"){
            gender_H_D = "Female"+" ";
        }
        if(gender_H.toLowerCase()=="any"){
            gender_H_D = "Any";
        }
        stringToDisp = gender_H_D;
        return stringToDisp;
        }catch(e){
        }
    },
    dobCriteriaEdit:function(){
        try{
        var dateType_H = this.dateType;
        var dateValue_H = moment(new Date(this.dateValue)).format("DD MMM YYYY");
        var dateType_H_D = "";
        var stringToDisp = "";
        if(dateType_H.toLowerCase()=="onbefore"){
            dateType_H_D = "on or before "+dateValue_H
        }
        else if(dateType_H.toLowerCase()=="before"){
            dateType_H_D = "before "+dateValue_H
        }
        else if(dateType_H.toLowerCase()=="onafter"){
            dateType_H_D = "on or after "+dateValue_H
        }
        else if(dateType_H.toLowerCase()=="after"){
           dateType_H_D = "after "+dateValue_H
        }
        else if(dateType_H.toLowerCase()=="any"){
            dateType_H_D = "any"
        }
        stringToDisp = dateType_H_D;
        return stringToDisp;
        }catch(e){
        }
    },
    locCriteriaEdit:function(){
        try{
            var locationType_H = this.locationType;
            if(locationType_H.toLowerCase()=="imported"){
                locationType_H_D = "imported"+" "
            }
            else if(locationType_H.toLowerCase()=="local"){
                locationType_H_D = "local"+" "
            }
            else if(locationType_H.toLowerCase()=="any"){
                locationType_H_D = "any";
            }
            stringToDisp = locationType_H_D;
            return stringToDisp;
        }catch(e){
        }
    },
    "mandatoryCriteriaEdit":function(){
        try{
        var mandatory_H = this.mandatory;
        if(mandatory_H.toLowerCase()=="yes"){
            return "*"
        } 
        else if(mandatory_H.toLowerCase()=="no"){
            return " "+""
        }
        }catch(e){

        }
    },
    "mandatoryColorEdit":function(){
        try{
        var mandatory_H = this.mandatory;
        if(mandatory_H.toLowerCase()=="yes"){
            return "black;"
        } 
        else if(mandatory_H.toLowerCase()=="no"){
            return "black;"
        }
        }catch(e){

        }
    },
    requiredAffiliation:function(){
        var find = teamsFormat.findOne({"_id":Session.get("eventIdOFSelectedTeamEvent")});
        if(find&&find.rankedOrNot){
            if(find.rankedOrNot=="yes"){
                return "required"
            }
            else return false
        }
    },
    CriteriaValidOrNot:function(){
    	try{
    		var s = ReactiveMethod.call("teamMemberValidation",this.playerNumber,this.playerId,Session.get("eventIdOFSelectedTeamEvent"),Session.get("subscribePlayerID"))
    		if(s!=undefined)
            {
	    		if(s == "invalid")
                {
	                Session.set("teamMemberValidation_Ses",1);
	                return "red"
	            }
	            else 
	    		return "black";
    		}
    	}catch(e){}
    },
    MandatoryValidationPlayers:function(){
    	if(Session.get("TeamCheckedSession")&&Session.get("eventIdOFSelectedTeamEvent")){
    		var test = ReactiveMethod.call("MandatoryValidationMethod",Session.get("TeamCheckedSession"),Session.get("eventIdOFSelectedTeamEvent"));
    		if(test)
    			return true
    		else
    			return false
    	}
    },
    validationMsg:function()
    {
        try{
            if(Session.get("teamMemberValidation_Ses") != undefined)
                return true;
            else
                return false;
        }catch(e){}
    }
});

Template.adminSubscribePopUp.events({

	"click #noButtonSubTeamEvent": function(e) {
        e.preventDefault();
        handlingNoButtonOfPopUP()
    },
    //click of ok button of team selection popup
    "click #yesButtonSubTeamEvent": function(e) {
        e.preventDefault();

        if (Session.get("teamMemberValidation_Ses") == 1) {
            //$("#confirmDomProvideDetailsTeam").html('<span style="font-size: 12px; border: 0px none; color: red; background: none repeat scroll 0px center transparent;">Team is Invalid:</span><input style="font-size: 12px; border: 0px none; color: blue; background: none repeat scroll 0px center transparent; text-decoration: underline;" value="Edit team and continue your subscription" id="editTeamForNoTeam" type="button"><span style="font-size: 12px; border: 0px none; color: red; background: none repeat scroll 0px center transparent;">or</span><input style="font-size: 12px; border: 0px none; color: blue; background: none repeat scroll 0px center transparent; text-decoration: underline;" value="Create new team and continue your subscription" id="createTeamForNoTeam" type="button">');
        } else {
            //if team is selected and array holds team details
            if ($("#mainTag").val() && parseInt($("#mainTag").val()) != 1 && Session.get("arrayBackUp") != undefined) {
                //get event  name
                var eventName = Session.get("eventNameOFSelectedTeamEvent")
                var data = Session.get("arrayBackUp")
                var arrayofTeamChecked_IDs = [];

                //set array of teams to array
                if (Session.get("arrayofTeamCheckedSession")) {
                    arrayofTeamChecked_IDs = Session.get("arrayofTeamCheckedSession")
                }
                //check array already contains the evntname
                var indexD = _.indexOf(_.pluck(arrayofTeamChecked_IDs, 'eventName'), eventName);
                //if no push
                if (indexD == -1) {
                    if (_.findWhere(arrayofTeamChecked_IDs, data) == null) {
                        arrayofTeamChecked_IDs.push(data);
                        Session.set("arrayBackUp", undefined)
                    }
                }
                //else splice it and push
                else {
                    arrayofTeamChecked_IDs.splice(indexD, 1)
                    if (_.findWhere(arrayofTeamChecked_IDs, data) == null) {
                        arrayofTeamChecked_IDs.push(data);
                        Session.set("arrayBackUp", undefined)
                    }
                }
                //set the array of team events selected 
                //this is used to ensure that the ok button is clickec for this event
                var eventId = Session.get("eventIDOFSelectedTeamEvent")
                var indexOfEvent = checkOkClicked.indexOf(eventId.trim())
                if (indexOfEvent == -1) {
                    checkOkClicked.push(eventId);
                }

                Session.set("arrayofTeamCheckedSession", arrayofTeamChecked_IDs);
                //reset the array of selected teams

                $("#adminSubscribePopUp").modal("hide");
            } else if ($("#mainTag").val() == null || parseInt($("#mainTag").val()) == 1) { 
            //if team is not selected
                $("#confirmDomProvideDetailsTeam").html("Please Select Team");
            } else if ($("#mainTag").val() == null || (parseInt($("#mainTag").val()) !== 1 && Session.get("arrayBackUp") == undefined)) { //if team is not selected
                //and there are no teams of this teamtype
                $("#confirmDomProvideDetailsTeam").html("Please Select Team");
            }
        }
    },
    "change #mainTag": function(e) {
        e.preventDefault();
        try {
      
            var teamId = $(e.target).val();
            if (parseInt(teamId) !== 1) {
                //set teamId
                Session.set("TeamCheckedSession", undefined)
                Session.set("TeamCheckedSession", teamId)

                //get event id
                var name = Session.get("eventIDOFSelectedTeamEvent");
                //get event name
                var eventName = Session.get("eventNameOFSelectedTeamEvent")
                    //set data
                var data = {
                        eventName: eventName,
                        teamId: teamId,
                        
                    }
                    
                var arrBack = data;
                Session.set("arrayBackUp", arrBack)
                Session.set("teamMemberValidation_Ses", undefined);
            }
        } catch (e) {}
    },

});
/****************************** lock draws starts here **********************/

Template.drawsSelectionForm.onCreated(function(){
    this.subscribe("calendarEventsPub")
})

Template.drawsSelectionForm.helpers({
    upcomingTournaments:function(){
        try{
        var upcomingEvents = calenderEvents.find({},{sort:{"eventName":1}}).fetch();
        return upcomingEvents;
        }catch(e){

        }
    }
    
});
Template.drawsSelectionForm.events({

    'change [name=tournamentList]': function(e) {
        try{
            var tournamentID = $("[name='tournamentList'] option:selected").attr("name");
            if(tournamentID != undefined)
            {
                $("#drawsContent").empty();

                var tourInfo = calenderEvents.findOne({"_id":tournamentID});
                if(tourInfo)
                {
                    Meteor.call("checkTournamentDrawsOnLock",tournamentID,function(error,result){
                        if(result)
                        {
                            Session.set("lockDrawEvents",result);
                            Blaze.render(Template.drawsEventLayout, $("#drawsContent")[0]);
                        }
                    })
                            
                }                     
            }
        }catch(e){
            alert(e)
        }
    },
})




Template.drawsEventLayout.helpers({
    drawEvents:function(){
        if(Session.get("lockDrawEvents"))
            return Session.get("lockDrawEvents")
    }
})

Template.drawsEventLayout.events({
    "click #lockEvent":function(e)
    {
        if(this.tournamentId && this.eventName)
        {
            var paramJson = {};
            paramJson["tournamentId"] = this.tournamentId;
            paramJson["eventName"] = this.eventName;
            paramJson["drawsLock"] = true;
            Meteor.call("updateLockOnDraws",paramJson,function(error,result){
                if(result && result.message)
                    displayMessage(result.message)

            })
            Meteor.call("checkTournamentDrawsOnLock",this.tournamentId,function(error,result){
                if(result)        
                    Session.set("lockDrawEvents",result);       
            }) 
        }
    },
    "click #unlockEvent":function(e)
    {
        if(this.tournamentId && this.eventName)
        {
            var paramJson = {};
            paramJson["tournamentId"] = this.tournamentId;
            paramJson["eventName"] = this.eventName;
            paramJson["drawsLock"] = false;
            Meteor.call("updateLockOnDraws",paramJson,function(error,result){
                if(result && result.message)
                    displayMessage(result.message)
            }) 
            Meteor.call("checkTournamentDrawsOnLock",this.tournamentId,function(error,result){
                if(result)        
                    Session.set("lockDrawEvents",result);       
            }) 
        }
    },
    "click #downloadDraws":function(e)
    {
        if(this.tournamentId && this.eventName)
        {
            var eventName = this.eventName;
            var paramJson = {};
            paramJson["tournamentId"] = this.tournamentId;
            paramJson["eventName"] = this.eventName;
            Meteor.call("fetchDrawCSV",paramJson,function(error,result){
                if(result)
                {
                    if(result.length > 0)
                    {
                        var csv = Papa.unparse(result);
                        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
                        var link = document.createElement("a");    
                        link.href = uri;
                        link.style = "visibility:hidden";
                        link.download = eventName+".csv";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);  
                    }       
                    else{
                        displayMessage("Draws not found!!")
                    }
                }
            }) 
        }
    }
})




/******************************* lock draws ends here **********************/


Template.eventDrawsSelectionForm.onCreated(function(){
    this.subscribe("eventsTournament")
})

Template.eventDrawsSelectionForm.helpers({

    upcomingTournaments:function(){
        var upcomingEvents = events.find({tournamentEvent:true}).fetch();
        return upcomingEvents;
    },
    eventList:function()
    {
        return Session.get("drawEventList")
    }
    
});
Template.eventDrawsSelectionForm.events({

    'change [name=tournamentList]': function(e) {
         
        var tournamentID = $("[name='tournamentList'] option:selected").attr("name");
        if(tournamentID != undefined)
        {
            $("#drawsEntryContent").empty();

            var tourInfo = events.findOne({"_id":tournamentID});
            if(tourInfo)
            {
                Session.set("tournamentId",tournamentID)
                Meteor.call("fetchAdminDrawEvents",tournamentID,function(error,result){
                    if(result)
                    {
                        Session.set("drawEventList",result);
                    }
                })     
            }                     
        }
    },

    "change #eventSelection": function(event, template) {
        try{
            event.preventDefault();
            var selectedEvent = event.target.value;
            Session.set("tourEventName",selectedEvent);
            Session.set("selectedRound", 1);
            Meteor.call("fetchEventDetails",Session.get("tournamentId"),Session.get("tourEventName"),function(error,result)
            {
                var eventDetails = result;
                if(result)
                {
                    $("#drawsEntryContent").empty();
                    Blaze.render(Template.drawsEntryLayout, $("#drawsEntryContent")[0]);
                if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                   fnGetMatches();
                } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                    fnGetTeamMatches();
                }
                }

            })

           
        }catch(e)
        {
        }

    },
    'click #incrRound': function(event) {
        

        var selectedRound = Session.get('selectedRound');
        selectedRound = (selectedRound == Session.get('maxRoundNum')) ? selectedRound : selectedRound + 1;
        Session.set("selectedRound", selectedRound);

        Meteor.call("fetchEventDetails",Session.get("tournamentId"),Session.get("tourEventName"),function(error,result)
            {
                var eventDetails = result;
                if(result)
                {
                    $("#drawsEntryContent").empty();
                    Blaze.render(Template.drawsEntryLayout, $("#drawsEntryContent")[0]);
                    if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                       fnGetMatches();
                    } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                        fnGetTeamMatches();
                    }
            }   

        })
    },
    'click #decrRound': function(event) {
        var selectedRound = Session.get('selectedRound');
        selectedRound = (selectedRound == 1) ? selectedRound : selectedRound - 1;
        Session.set("selectedRound", selectedRound);
        Meteor.call("fetchEventDetails",Session.get("tournamentId"),Session.get("tourEventName"),function(error,result)
            {
                var eventDetails = result;
                if(result)
                {
                    $("#drawsEntryContent").empty();
                    Blaze.render(Template.drawsEntryLayout, $("#drawsEntryContent")[0]);
                    if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                       fnGetMatches();
                    } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                        fnGetTeamMatches();
                    }
                }

        })
    },
})

Template.drawsEntryLayout.onCreated(function(){
    Session.set("leftRMatches", undefined);
    Session.set("centerRMatches",undefined);
    Session.set("rightRMatches", undefined);
    Session.set("drawDBName",undefined)

    var self = this;
    self.autorun(function () {
        if(Session.get("tournamentId") != undefined && Session.get("tourEventName") != undefined)
            self.subscribe("fetchEventPlayers", Session.get("tournamentId"),Session.get("tourEventName"));
    });
});

Template.drawsEntryLayout.onRendered(function(){
    Session.set("leftRMatches", undefined);
    Session.set("centerRMatches",undefined);
    Session.set("rightRMatches", undefined);
    Session.set("drawDBName",undefined)
    if(Session.get("tournamentId") != undefined && Session.get("tourEventName") != undefined)
    {

        //var dbsrequired = ["userDetailsTT"]
        
        var tournamentInfo = events.findOne({
            "_id": Session.get("tournamentId")
        })
        Meteor.call("changeDbNameForDraws", tournamentInfo, dbsrequired, function(e, res) {
            if (res) {
                if (res.changeDb && res.changeDb == true) {
                    if (res.changedDbNames.length != 0) {
                        Session.set("drawDBName",res.changedDbNames[0]);
                    }
                }
            }
        });
    
    }



})

Template.drawsEntryLayout.events({
    "click #editPlayerA":function()
    {
        $("#renderTeamMultiSubs").empty();
        Blaze.render(Template.setPlayerEntry, $("#renderTeamMultiSubs")[0]);
                    
        Session.set("setPlayerEntryInfo", this);
        Session.set("playerSet","playerA")
        $(".teamSubscribeMainTitle").scrollTop(0);;
        $("#setPlayerEntry").modal({
            backdrop: 'static',
            keyboard: false
        });
    },
    "click #editPlayerB":function()
    {
        $("#renderTeamMultiSubs").empty();
        Blaze.render(Template.setPlayerEntry, $("#renderTeamMultiSubs")[0]);
                    
        Session.set("setPlayerEntryInfo", this);
        Session.set("playerSet","playerB")
        $(".teamSubscribeMainTitle").scrollTop(0);;
        $("#setPlayerEntry").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

})

Template.setPlayerEntry.onCreated(function(){

    /*
    var self = this;
    self.autorun(function () {
        if( Session.get("tournamentId") != undefined && Session.get("tourEventName") != undefined)
            self.subscribe("fetchEventPlayers", Session.get("tournamentId"),Session.get("tourEventName"));
    });
    */
    $("#entrySelection").select2("close");

 
});


Template.setPlayerEntry.onRendered(function(){

    

    $("#setPlayerEntry").on('show.bs.modal', function(event) {
        $(".teamSubscribeMainTitle").scrollTop(0);;
        $('.modal-content').scrollTop(0);
    });
    $("#setPlayerEntry").on('hide.bs.modal', function(event) {
        $(".teamSubscribeMainTitle").scrollTop(0);;
        $('.modal-content').scrollTop(0);
     
    });

    $('#entrySelection').select2({
        width: '100%',
        color:"black"
    });
    
    
});


Template.setPlayerEntry.helpers({

    "tournamentName":function(){
         var tournamentInfo = events.findOne({
            "_id": Session.get("tournamentId")
        })
         if(tournamentInfo && tournamentInfo.eventName)
            return tournamentInfo.eventName;
    },
    "eventName":function(){
        if(Session.get("tourEventName") != undefined)
            return Session.get("tourEventName");
    },
    "matchNumber":function(){
        if(Session.get("setPlayerEntryInfo") != undefined)
        {
            var matchInfo = Session.get("setPlayerEntryInfo");
            return matchInfo.matchNumber;
        }
    },
    "fetchPlayerEntries":function(){
        try{

            if(Session.get("drawDBName") != undefined)
            {
                var userDetailsTTList = nameToCollection(Session.get("drawDBName")).find({},{sort:{"userName":1}}).fetch();
                return userDetailsTTList;  
            }
       

        }catch(e){
        }
    }
   
 
});

Template.setPlayerEntry.events({

    "click #noEntry": function(e) {
        e.preventDefault();
        $("#setPlayerEntry").modal("hide");

    },

    "click #setEntry": function(e) {
        e.preventDefault();
       
        var entrySelection = $("[name='entrySelection'] option:selected").attr("name");

        //matchStatus

        var statusID = $("input[name=matchStatus]:checked").attr("value");
        //Session.set('domainLength', $("input[name=checkDomainName]:checked").length);

        if(Session.get("setPlayerEntryInfo") == undefined || Session.get("playerSet") == undefined)
        {
            displayMessage("Session need to be set");
        }
        else if(statusID == undefined)
        {
            displayMessage("Match Status need to be set");
        }
        else if (statusID == "nobye" && (entrySelection == null || entrySelection == undefined || 
            entrySelection == "1") )
        {
            displayMessage("Please choose player!!");
        }
        else
        {

            var dataJson = {};
            dataJson["tournamentId"] = Session.get("tournamentId");
            dataJson["eventName"] = Session.get("tourEventName");
            dataJson["entryInfo"] = Session.get("setPlayerEntryInfo");
            dataJson["playerSet"] = Session.get("playerSet");
            dataJson["newPlayerID"] = entrySelection;
            dataJson["matchStatus"] = statusID;


            Meteor.call("setPlayerEntryDraw",dataJson,function(error,result){
                if(result)
                {

                    $("#setPlayerEntry").modal("hide");

                    if(result.status == "success")
                    {
                        fnGetMatches();
                    }
                    else if(result.status == "failure")
                    {
                        displayMessage(result.message)
                    }
                }
            })
            
            //$("#setPlayerEntry").modal("hide");
        }

        
          
        
    }
   

});


Template.drawsEntryLayout.helpers({

   /* drawEvents:function(){
        try{
            var result = ReactiveMethod.call('drawsEvents',Session.get("tournamentId"));
            if(result)
            {
                if(Session.get("tourEventName") == undefined)
                {
                    Session.set("tourEventName",result[0]);
                    var eventDetails = events.findOne({
                        "tournamentId": Session.get("tournamentId"),
                        eventName: Session.get("tourEventName")});
                    if(eventDetails == undefined) 
                    {
                        eventDetails = pastEvents.findOne({
                            "tournamentId": Session.get("tournamentId"),
                            eventName: Session.get("tourEventName")
                        });
                    }
                    if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                        fnGetMatches();
                    } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                        fnGetTeamMatches();
                    }
                }
               

                return result;
            }
               
        }catch(e){

        }
    },*/
    setEvent:function(eventName)
    {
        if(Session.get("eventName") && Session.get("eventName") == eventName)
            return "selected"
    },
    drawsConf: function() {

        var eventName =  Session.get("tourEventName");
        var result = ReactiveMethod.call("fetchRounds",Session.get("tournamentId"),eventName);
        if(result)
        {
            return result;
        }
    },

    drawsConfMatches:function(){
        var result = ReactiveMethod.call("fetchRoundMatches",Session.get("tournamentId"),Session.get("tourEventName"))
        if(result)
        {
            if(result)
                Session.set("detScores",result);
            
            return result;
        }
        
    },
    drawsTd:function(){
        var a = new Array(4);
        a[0] = 1;
        a[1] = 2;
        a[2] = 3;
        a[3] = 4;
        a[4] = 5;
        return a;
    },
    
    setTdStyle:function(roundName)
    {
        if(roundName == "SF")
            return "";
        else if(roundName == "F")
            return "";
        else
            return "";

    },
   
   
    generateRoundName:function(roundNumber,roundName)
    {   
        if(roundName == "QF")
            return "QF";
        else if(roundName == "SF")
            return "SF";
        else if(roundName == "F")
            return "F";
        else if(roundName == "PQF")
            return "PQF"
        else 
            return "R"+roundNumber;
    },
  
    drawsEventName:function(){
        return Session.get("tourEventName")
    },
    tournamentName:function(){
        var data = events.findOne({"_id":Session.get("tournamentId")});
        if(data)
            return data.eventName
        else 
        {
            data = pastEvents.findOne({"_id":Session.get("tournamentId")});
            if(data)
                return data.eventName
        }
    },
 
    tourIdDraws: function() {
        return Router.current().params._id;
    },
    getRoundNumber:function(data){
        return parseInt(data)+1;
    },
    lRoundNum: function() {
        return (Session.get("selectedRound"));
    },
    inc:function(matchIndex,index){
        var m = parseInt(matchIndex) +1;
        return parseInt(m)+parseInt(index);

    },
    checkRowMatch:function(rowIndex,roundName){

        if(roundName == "SF" && (rowIndex == 3 || rowIndex == 4))
            return true;
        else if(roundName == "F" && (rowIndex == 2 || rowIndex == 3 || rowIndex == 4))
            return true;

    },
    fetchMatchNumber:function(parentIndex,currentIndex){
        try {
        var pI = parseInt(parentIndex)+1;
        var cI = parseInt(currentIndex)+1;
        if(Session.get("detScores"))
        {
            var detScores = Session.get("detScores");
            var filtered = _.find(detScores, function (entry) {
                if(entry._id == cI)
                    return entry;
            });
            if(filtered && filtered.dots)
            {
                if(parentIndex == 1)
                    return filtered.startMatchNo;
                else
                {
                    var m =(parseInt(parentIndex) * parseInt(filtered.dots));
                    var mc = ( (parseInt(m) - parseInt(filtered.dots)) + parseInt(filtered.startMatchNo))
                    return mc; 
                }     
            }

        } 
    } catch (e) {
    }
    },
    leftRoundNumber:function(data){
        if(data != undefined && data.roundNumber)
        {
            if(data.roundNumber == true)
                return true;
            else
                return false;
        }
        else
            return false;

    },
    leftRMatchName:function(){
        if(Session.get("leftRMatches"))
        {
            var matchDetails = Session.get("leftRMatches");
            if(matchDetails && matchDetails.length > 0 && matchDetails[0].roundNumber)
            {
                if(matchDetails[0].roundName)
                {
                    if(matchDetails[0].roundName == "QF")
                        return "Quarter Final ";
                    else if(matchDetails[0].roundName == "SF")
                        return "Semi Final";
                    else if(matchDetails[0].roundName == "F")
                        return "Final"
                    else
                        return "Round "+matchDetails[0].roundNumber;
                }
                else
                {

                }
            }
        }

    },
    centerRMatchName:function(){
        if(Session.get("centerRMatches"))
        {
            var matchDetails = Session.get("centerRMatches");
            if(matchDetails && matchDetails.length > 0 && matchDetails[0].roundNumber)
            {
                if(matchDetails[0].roundName)
                {
                    if(matchDetails[0].roundName == "QF")
                        return "Quarter Final ";
                    else if(matchDetails[0].roundName == "SF")
                        return "Semi Final";
                    else if(matchDetails[0].roundName == "F")
                        return "Final"
                    else
                        return "Round "+matchDetails[0].roundNumber;
                }
                else
                {

                }
            }
        }
    },
    rightRMatchName:function(){
        if(Session.get("rightRMatches"))
        {
            var matchDetails = Session.get("rightRMatches");
            if(matchDetails && matchDetails.length > 0 && matchDetails[0].roundNumber)
            {
                if(matchDetails[0].roundName)
                {
                    if(matchDetails[0].roundName == "QF")
                        return "Quarter Final ";
                    else if(matchDetails[0].roundName == "SF")
                        return "Semi Final";
                    else if(matchDetails[0].roundName == "F")
                        return "Final"
                    else
                        return "Round "+matchDetails[0].roundNumber;
                }
                else
                {

                }
            }
        }
    },
    leftRMatches: function() {
        return Session.get("leftRMatches");
    },
    centerRMatches:function(){
        return Session.get("centerRMatches");
    },
    rRoundNum: function() {
        return (1 + Session.get("selectedRound"));
    },
    rightRMatches: function() {
        return (Session.get("rightRMatches"));
    },
    matchNumber1: function() {
        return (this.matchNumber);
    },
    "playerANo":function()
    {
        if(this.playersNo && this.playersNo.playerANo)
            return this.playersNo.playerANo;
    },
    playerA: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual"){
                if(this.playersID && this.playersID.playerAId && this.playersID.playerAId.trim() != "")
                {
                    var result2 = ReactiveMethod.call("getPlayer_Aca",this.playersID.playerAId,Session.get("tournamentId"));
                    return result2
                }
                else if(this.players.playerA != "()")
                    return (this.players.playerA);
                
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA != "()")
                    return (this.teams.teamA);
               
            }
              
        }
        
        
    },
    AS1: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual"){
                if(this.players.playerA)
                {
                    if(this.players.playerA.length > 0)
                        return (this.scores.setScoresA[0]);
                }
            }
            else if(Session.get("tourEventType") == "team"){
                if(this.teams.teamA)
                {
                    if(this.teams.teamA.length > 0)
                        return (this.scores.setScoresA[0]);
                }
            }

        }
    },
    AS2: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[1]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[1]);
                }
            }
        }

    },
    AS3: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[2]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[2]);
                }
            }
        }
    },
    AS4: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[3]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[3]);
                }
            }
        }
    },
    AS5: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[4]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[4]);
                }
            }
        }
    },
    AS6: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {                 
                    if (this.scores.setScoresA.length < 6)
                        return 0;
                    return (this.scores.setScoresA[5]);
                }
            }
            else  if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {             
                    if (this.scores.setScoresA.length < 6)
                        return 0;
                    return (this.scores.setScoresA[5]);
                    
                }
            }
        }
    },
    AS7: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    if (this.scores.setScoresA.length < 7)
                        return 0;
                    return (this.scores.setScoresA[6]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {          
                    if (this.scores.setScoresA.length < 7)
                        return 0;
                    return (this.scores.setScoresA[6]);
                }
            }
        }
    },
    "playerBNo":function()
    {
        if(this.playersNo && this.playersNo.playerBNo)
            return this.playersNo.playerBNo;
    },
    playerB: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                 if(this.playersID && this.playersID.playerBId && this.playersID.playerBId.trim() != "")
                {
                    var result2 = ReactiveMethod.call("getPlayer_Aca",this.playersID.playerBId,Session.get("tournamentId"));
                    return result2
                }
                else if(this.players.playerB != "()")
                    return (this.players.playerB);

            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB != "()")
                    return (this.teams.teamB);
            }
        }
    },
    BS1: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[0]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[0]);
                }
            }
        }
    },
    BS2: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                        return (this.scores.setScoresB[1]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                        return (this.scores.setScoresB[1]);
                }
            }
        }
    },
    BS3: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                        return (this.scores.setScoresB[2]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                        return (this.scores.setScoresB[2]);
                }
            }
        }
    },
    BS4: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[3]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[3]);
                }
            }
        }
    },
    BS5: function() {
         if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[4]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[4]);
                }
            }
        }
    },
    BS6: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    if (this.scores.setScoresB.length < 6)
                        return 0;
                    return (this.scores.setScoresB[5]);
                    
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    if (this.scores.setScoresB.length < 6)
                        return 0;
                    return (this.scores.setScoresB[5]);
                    
                }
            }
        }
    },
    BS7: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    if (this.scores.setScoresB.length < 7)
                        return 0;
                    return (this.scores.setScoresB[6]);   
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    if (this.scores.setScoresB.length < 7)
                        return 0;
                    return (this.scores.setScoresB[6]);   
                }
            }
        }
    },

    AS1Settings: function() {
        if (parseInt(this.scores.setScoresA[0]) != 0) {
            if (parseInt(this.scores.setScoresA[0]) < parseInt(this.scores.setScoresB[0])) {
                return "";

            } else {
                return "font-weight:bold";

            }
        }

    },
    AS2Settings: function() {
        if (parseInt(this.scores.setScoresA[1]) != 0) {
            if (parseInt(this.scores.setScoresA[1]) < parseInt(this.scores.setScoresB[1]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS3Settings: function() {
        if (parseInt(this.scores.setScoresA[2]) != 0) {
            if (parseInt(this.scores.setScoresA[2]) < parseInt(this.scores.setScoresB[2]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS4Settings: function() {
        if (parseInt(this.scores.setScoresA[3]) != 0) {
            if (parseInt(this.scores.setScoresA[3]) < parseInt(this.scores.setScoresB[3]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS5Settings: function() {

        if (parseInt(this.scores.setScoresA[4]) != 0) {
            if (parseInt(this.scores.setScoresA[4]) < parseInt(this.scores.setScoresB[4]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS6Settings: function() {
        if (this.scores.setScoresA.length < 6)
            return "";

        else if (parseInt(this.scores.setScoresA[5]) != 0) {
            if (parseInt(this.scores.setScoresA[5]) < parseInt(this.scores.setScoresB[5]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS7Settings: function() {
        if (this.scores.setScoresA.length < 7)
            return "";
        else if (parseInt(this.scores.setScoresA[6]) != 0) {
            if (parseInt(this.scores.setScoresA[6]) < parseInt(this.scores.setScoresB[6]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS1Settings: function() {
        if (parseInt(this.scores.setScoresB[0]) != 0) {
            if (parseInt(this.scores.setScoresA[0]) > parseInt(this.scores.setScoresB[0]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS2Settings: function() {
        if (parseInt(this.scores.setScoresB[1]) != 0) {
            if (parseInt(this.scores.setScoresA[1]) > parseInt(this.scores.setScoresB[1]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS3Settings: function() {
        if (parseInt(this.scores.setScoresB[2]) != 0) {
            if (parseInt(this.scores.setScoresA[2]) > parseInt(this.scores.setScoresB[2]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS4Settings: function() {
        if (parseInt(this.scores.setScoresB[3]) != 0) {
            if (parseInt(this.scores.setScoresA[3]) > parseInt(this.scores.setScoresB[3]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS5Settings: function() {

        if (parseInt(this.scores.setScoresB[4]) != 0) {
            if (parseInt(this.scores.setScoresA[4]) > parseInt(this.scores.setScoresB[4]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS6Settings: function() {
        if (this.scores.setScoresB.length < 6)
            return "";

        else if (parseInt(this.scores.setScoresB[5]) != 0) {
            if (parseInt(this.scores.setScoresA[5]) > parseInt(this.scores.setScoresB[5]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS7Settings: function() {
        if (this.scores.setScoresB.length < 7)
            return "";
        else if (parseInt(this.scores.setScoresB[6]) != 0) {
            if (parseInt(this.scores.setScoresA[6]) > parseInt(this.scores.setScoresB[6]))
                return "";
            else
                return "font-weight:bold";
        }

    },

    getStatusColorA: function() {
        if (this.roundNumber == 1 && this.status2 == "bye")
        {
            if(this.getStatusColorA == "ip_input_box_type_pNameBye")
                return "pNameBye";
            else
                return "ip_input_box_type_pName"
        }
        else
            return this.getStatusColorA
    },
    getStatusColorB: function() {
        if (this.roundNumber == 1 && this.status2 == "bye")
        {
            if(this.getStatusColorB == "ip_input_box_type_pNameBye")
                return "pNameBye";
            else
                return "ip_input_box_type_pName"
        }
        else
            return this.getStatusColorB
    },
    matchNumber: function() {
        return this.matchNumber;
    },
    matchSettingsA: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerAId.trim() == "")
            {
                //return "visibility:hidden"
                return "";
            }
    },
    matchSettingsB: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerBId.trim() == ""){
            //return "visibility:hidden";
        }
    },
    matchSettingsBSettings: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && (this.playersID.playerAId.trim() == "" || this.playersID.playerBId.trim() == ""))
            return "font-size: 12px;cursor: pointer;visibility:hidden";
        else
            return "font-size: 12px;cursor: pointer;";
    },
    matchSettingsBScore: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && (this.playersID.playerAId.trim() == "" || this.playersID.playerBId.trim() == "")){

            //return "visibility:hidden";
        }

    },
    matchSettingsAScore: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerBId.trim() == ""){

            //return "visibility:hidden";
        }

    },


})


function fnGetMatches() {
     try{
            Session.set("tourEventType","individual");
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("tourEventName");
            var roundNumber = Session.get("selectedRound");


            if(tournamentId != null && eventName != null)
            {
                Meteor.call("getMatchesFromDB", tournamentId, eventName, function(error, result) {
                    if (error) {} else {
                        try {
                            //related to dobfilters //
                            var eventInfo;
                            var tourInfo;
                            if (Router.current().params._eventType && Router.current().params._eventType == "past")
                                eventInfo = pastEvents.findOne({
                                    "tournamentId": tournamentId,
                                    "eventName": eventName
                                })
                            else
                                eventInfo = events.findOne({
                                    "tournamentId": tournamentId,
                                    "eventName": eventName
                                })
                            if (eventInfo) {
                                var sportID = "";
                                var eventProjectId = "";
                                var eventOrganizer = ""
                                if (eventInfo.projectId && eventInfo.eventOrganizer) {
                                    eventProjectId = eventInfo.projectId[0];
                                    eventOrganizer = eventInfo.eventOrganizer;
                                    Session.set("eventOrganizer", eventOrganizer);
                                }
                                if (Router.current().params._eventType && Router.current().params._eventType == "past")
                                    tourInfo = pastEvents.findOne({
                                        "_id": tournamentId,
                                        "tournamentEvent": true
                                    });
                                else
                                    tourInfo = events.findOne({
                                        "_id": tournamentId,
                                        "tournamentEvent": true
                                    });

                                if (tourInfo && tourInfo.projectId) {
                                    sportID = tourInfo.projectId[0];
                                    Session.set("sportID", sportID);
                                }

                              
                            }




                            // related to dobfilters//
                            Session.set('matchRecords', result);
                            var leftRMatches = [];
                            var centerRMatches = [];
                            var rightRMatches = [];
                            var lastMatchNum = (result.length) - 1;

                            var maxRoundNum = result[lastMatchNum].roundNumber;
                            Session.set("maxRoundNum", maxRoundNum);
                            for (var i = 0; i < result.length; i++) {
                                if(roundNumber == null)
                                    roundNumber = 1;
                                
                                    if (result[i].roundNumber == roundNumber) {
                                        leftRMatches.push(result[i]);
                                    } 
                                    else if (result[i].roundNumber <= maxRoundNum) {

                                        if (result[i].roundNumber == (roundNumber + 1)) {
                                            // this means, this is not the final round!
                                            centerRMatches.push(result[i]);
                                        }
                                        if (result[i].roundNumber == (roundNumber + 2)) {
                                            // this means, this is not the final round!
                                            rightRMatches.push(result[i]);
                                        }
                                        
                                    }
                               
                               
                            }
                            Session.set("leftRMatches", leftRMatches);
                            Session.set("centerRMatches",centerRMatches);
                            Session.set("rightRMatches", rightRMatches);

                                                return true;

                        } catch (e) {
                            Session.set("maxRoundNum", 1);
                            var leftRMatches = [];
                            var centerRMatches = [];
                            var rightRMatches = [];
                            Session.set("leftRMatches", leftRMatches);
                            Session.set("centerRMatches",centerRMatches);
                            Session.set("rightRMatches", rightRMatches);

                            return true;
                        }
                    }
                }); 
            }
            else
                return false;
           
        }catch(e){
                return false;
        }

}

 function fnGetTeamMatches () {
    try {

        Session.set("tourEventType","team");
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("tourEventName");
        var roundNumber = Session.get("selectedRound");
        Session.set("leftRMatches", undefined);
        Session.set("rightRMatches", undefined);
        Meteor.call("getTeamMatchesFromDB", tournamentId, eventName, function(error, result) {
            if (error) {} else if (result.length != 0) {
                try {
                    Session.set('matchRecords', result);
                    var leftRMatches = [];
                    var centerRMatches = [];
                    var rightRMatches = [];
                    var lastMatchNum = (result.length) - 1;
                    var maxRoundNum = result[lastMatchNum].roundNumber;
                    Session.set("maxRoundNum", maxRoundNum);
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].roundNumber == roundNumber) {
                                        leftRMatches.push(result[i]);
                                    } 
                                    else if (result[i].roundNumber <= maxRoundNum) {

                                        if (result[i].roundNumber == (roundNumber + 1)) {
                                            // this means, this is not the final round!
                                            centerRMatches.push(result[i]);
                                        }
                                        if (result[i].roundNumber == (roundNumber + 2)) {
                                            // this means, this is not the final round!
                                            rightRMatches.push(result[i]);
                                        }
                                        
                                    }
                    }
                    Session.set("leftRMatches", leftRMatches);
                    Session.set("centerRMatches",centerRMatches);
                    Session.set("rightRMatches", rightRMatches);
                                                                    return true;

                } catch (e) {}
            }
        });
      
    } catch (e) {}
}
/*********************************** register helpers *********************/

Template.registerHelper("fetchNameOnID", function(data) {
    if (data) {
        try{
            var find = ReactiveMethod.call("whoisTeamMember" ,data);
            if(find&&find.userName){
                return find.userName
            }
            else{
                return ""
            }
        }catch(e){

        }
    }
});
Template.registerHelper("checkAllowedSubscription",function(data1,data2){
	try{
		if(data1 == data2)
			return "selected";			
	}catch(e){}
}) 

Template.registerHelper('subscribedOrNotMultipleAdmin', function(data) {
    if (data) {
        try {
            var eventss = events.findOne({
                "_id": data.toString().trim()
            });
            if (eventss != undefined && eventss.eventParticipants != undefined) {
                
                var arr2 = eventss.eventParticipants;
                var userId = nameToCollection(Session.get("playerDBName")).findOne({
                    "userId": Session.get("subscribePlayerID")
                });
                if (arr2.indexOf(userId.userId.toString()) > -1) {
                    singleEventsArray.push(data);
                    Session.set("singleEventsArray", singleEventsArray);
                    Session.set("arrayOfSingleEventsOnLoad", singleEventsArray);
                    return "checked"
                }

                
                
               
            }
        } catch (e) {
        }
    }
});

Template.registerHelper('checkTempBeforeSaveAdmin', function(data) {
    
    try {
        if (Session.get("arrayofTeamCheckedSession") != undefined) {
            var selectedList = Session.get("arrayofTeamCheckedSession");
            for (var i = 0; i < selectedList.length; i++) {
                if (selectedList[i].eventName == Session.get("eventNameOFSelectedTeamEvent")) {
                    if (selectedList[i].teamId == data) {
                        Session.set("arrayBackUp", selectedList[i])
                        Session.set("TeamCheckedSession", data);
                        Session.set("che", true);
                        return "selected";
                        break;
                    }
                }
            }
        } else if (Session.get("arrayofTeamCheckedSession") == undefined) {
            if (Meteor.userId()) {
                var testArray = playerTeamEntries.findOne({
                    "playerId": Session.get("subscribePlayerID"),
                    tournamentId: Session.get("subscribeTournamentID")
                })
                if (testArray && testArray.subscribedTeamsArray) {
                    Session.set("arrayofTeamCheckedSession", testArray.subscribedTeamsArray);
                    var selectedList2 = Session.get("arrayofTeamCheckedSession");
                    for (var i = 0; i < selectedList2.length; i++) {
                        var s = events.findOne({
                            "eventName": selectedList2[i].eventName,
                            tournamentId: Session.get("subscribeTournamentID")
                        })
                        if (s && s._id) {
                            var indexOfEvent = checkOkClicked.indexOf(s._id.trim())
                            if (indexOfEvent == -1) {
                                checkOkClicked.push(s._id);
                            }
                        }
                        if (selectedList2[i].eventName == Session.get("eventNameOFSelectedTeamEvent")) {
                            if (selectedList2[i].teamId == data) {
                                Session.set("arrayBackUp", selectedList2[i])
                                Session.set("TeamCheckedSession", data);
                                return "selected";
                                break;
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {}
});


var handlingNoButtonOfPopUP = function(){

        //get id event
        var name = Session.get("eventIDOFSelectedTeamEvent");
        var eventNameONCancel = Session.get("eventNameOFSelectedTeamEvent")
        var checkBoxChecked = $('#' + name).is(":checked");
        var radioButtonChecked = false;
        if ($("#mainTag").val() == 1) {
            radioButtonChecked = false
        }
        else {
            radioButtonChecked = true
        }
        var indexOfEvent = checkOkClicked.indexOf(name.trim())
        var eventName = Session.get("eventNameOFSelectedTeamEvent")
        var arrBck = {}
        if (radioButtonChecked == false && parseInt(indexOfEvent) == -1) {
            $('.validCheckBox' + name).prop("checked", false);
            var eveUnSub = [];
            var playerId = Session.get("subscribePlayerID")
            if (_.findWhere(eveUnSub, playerId) == null) {
                eveUnSub.push(playerId);
            }
            var data = {
                eventName: eventNameONCancel,
                eventUnsubscribers: eveUnSub
            }
            arr.push(data)
            Session.set("eventParticipantSingleArray", arr);
            $("#adminSubscribePopUp").modal("hide");
        }
        //team is selected and ok button is clicked
        else if (radioButtonChecked == true && parseInt(indexOfEvent) > -1) {
            $("#adminSubscribePopUp").modal("hide");
        }
        //team is selected ok is not clicked
        else if (radioButtonChecked == true && parseInt(indexOfEvent) == -1) {
            var eveUnSub = [];
            var playerId = Session.get("subscribePlayerID")
            if (_.findWhere(eveUnSub, playerId) == null) {
                eveUnSub.push(playerId);
            }
            var data = {
                eventName: eventNameONCancel,
                eventUnsubscribers: eveUnSub
            }
            arr.push(data)
            Session.set("eventParticipantSingleArray", arr);
            $('.validCheckBox' + name).prop("checked", false);
            $("#adminSubscribePopUp").modal("hide");
        }
}

$.validator.addMethod(
    "acceptTermscondMulti",
    function(value, element, regexp) {
        var s = $("#checkAcceptboxTeam").prop("checked")
        if (s == false) {
            return false;
        } else return true;
    });


var multipleSubscriptionValid = function() {
	try{

    var s = $('#multipleSubscription').validate({

        rules: {

            checkAcceptboxTeam: {
                acceptTermscondMulti: true,
            },

        },
        messages: {

            checkAcceptboxTeam: {
                acceptTermscondMulti: "Please accept terms & conditions",
            },

        },
        /*
         * setting error container and errorLabelConatiner to ul
         * and wrap it inside li
         */
        errorContainer: $('#errorContainer'),
        errorLabelContainer: $('#errorContainer ul'),
        wrapper: 'li',
        /*
         * handles error
         */
        invalidHandler: function(form, validator, element) {
            var elem = $(element); //set error element
            var errors = s.numberOfInvalids();
            //if there are errors open errorPopup modal
            if (errors) 
            {
				$('#errorPopup').modal({
                	backdrop: 'static',
                	keyboard: false
            	});
            }

            	
        },
        submitHandler: function(event) {
            continueSubscription("upcomingEvents")
        }

    })
	}catch(e)
	{
	}
};

$.validator.addMethod(
    "acceptTermscondMulti",
    function(value, element, regexp) {
        var s = $("#checkAcceptboxTeam").prop("checked")
        if (s == false) {
            return false;
        } else return true;
    });

var continueSubscription = function(routeValue) {
    try {

        var teamCheckedJSON = [];
        Session.set("previousLocationPath", Iron.Location.get().path);
        if (Session.get("arrayofTeamCheckedSession") && Session.get("arrayofTeamCheckedSession") != undefined) {
            teamCheckedJSON = Session.get("arrayofTeamCheckedSession")
        }
        if (Session.get("eventParticipantSingleArray") !== undefined || Session.get("eventParticipantSingleArray").length != 0 || Session.get("eventParticipantSingleArray") !== "") {
            var subDetails = [];
            var eventsNAMES = [];
            var teamEventNames = [];
            var teamEventFEES = [];
            var eventsFees = [];
            var academyEntriesId = [];
            var districtAssociationIdEntries = [];
            var teamIdsArray = [];
            var subscribedTeamsArray = [];

            var eventFeeSettingsFind = eventFeeSettings.findOne({
                "tournamentId": Session.get("subscribeTournamentID")
            })
            if (eventFeeSettingsFind) {
                eventsNAMES = eventFeeSettingsFind.events;
                eventsFees = eventFeeSettingsFind.eventFees;
                teamEventNames = eventFeeSettingsFind.teamEvents;
                teamEventFEES = eventFeeSettingsFind.teamEventFees
            }

            var playerId = Session.get("subscribePlayerID");
            var eventsChecked = [];
            var teamEventsChecked = [];
            var totalAMT = 0;
            var totalAMTForTeam = 0;
            var eventSubscribed = [];
            var eventName = "";
            var userFound = "";
            var unsubscriberdTeamEventsNames = [];
            var takeDA = false;
            var takeAC = false;
            $("input[id=checkTeamOrSingle]").each(function() {

                userFound = nameToCollection(Session.get("playerDBName")).findOne({
                    "userId": playerId
                });
                if (userFound != undefined) {
                    for (var i = 0; i < eventsNAMES.length; i++) {
                        var findTypeOfEvent = events.findOne({
                            "abbName": eventsNAMES[i],
                            tournamentId: Session.get("subscribeTournamentID")
                        });
                        eventName = eventsNAMES[i];
                        if (findTypeOfEvent && parseInt(findTypeOfEvent.projectType) == 1) {
                            if ($(this).val() == eventsNAMES[i]) {
                                if ($(this).is(":checked")) {
                                    eventsChecked.push(eventsFees[i] + "");
                                    totalAMT = totalAMT + parseInt(eventsFees[i])
                                } else {
                                    eventsChecked.push("0");
                                }
                                break;
                            }
                            takeDA = true;
                            takeAC = true
                        } else if (findTypeOfEvent && parseInt(findTypeOfEvent.projectType) != 1) {
                            if ($(this).val() == eventsNAMES[i]) {
                                if ($(this).is(":checked")) {
                                    totalAMTForTeam = totalAMTForTeam + parseInt(eventsFees[i])
                                    teamEventsChecked.push(eventsFees[i]);
                                    for (var teamJson = 0; teamJson < teamCheckedJSON.length; teamJson++) {
                                        if (teamCheckedJSON[teamJson].eventName == eventsNAMES[i]) {
                                            teamIdsArray.push(teamCheckedJSON[teamJson].teamId);
                                            subscribedTeamsArray.push(teamCheckedJSON[teamJson])
                                        }
                                    }
                                } else {
                                    teamIdsArray.push("0");
                                    teamEventsChecked.push("0");
                                    unsubscriberdTeamEventsNames.push(eventsNAMES[i])
                                   // var indexDUnsub = _.indexOf(_.pluck(subscribedTeamsArray, 'eventName'), eventName);
                                }
                                break;
                            }
                        }
                    }
                }
            })
            var clubNameIdDet = "";
            var associationId = "";
            var parentAssociationId = "";
            var associationIdEntry = ""
            if (userFound.clubNameId == undefined || userFound.clubNameId == null) {
                clubNameIdDet = "other";
            } else {
                clubNameIdDet = userFound.clubNameId;
            }

            if (userFound.associationId == undefined || userFound.associationId == null) {
                associationId = "other";
            } else {
                if (userFound.clubNameId == undefined || userFound.clubNameId == null || userFound.clubNameId == "other" || userFound.clubNameId.trim().length == 0) {
                    associationIdEntry = userFound.associationId;
                }
                associationId = userFound.associationId
            }
            if (userFound.parentAssociationId == undefined || userFound.parentAssociationId == null) {
                parentAssociationId = "other";
            } else {
                parentAssociationId = userFound.parentAssociationId;
            }
            if (_.findWhere(academyEntriesId, clubNameIdDet) == null&&takeAC==true) {
                academyEntriesId.push(clubNameIdDet);
            }
            if (_.findWhere(districtAssociationIdEntries, associationIdEntry) == null&&takeDA==true) {
                if (associationIdEntry.length != 0)
                    districtAssociationIdEntries.push(associationIdEntry);
            }
            var data = {
                userId: playerId,
                academyId: clubNameIdDet,
                eventsList: eventsChecked,
                totalFees: totalAMT,
                associationId: associationId,
                parentAssociationId: parentAssociationId,
                teamEventList: teamEventsChecked,
                teamIdsArray: teamIdsArray,
                totalFeesOfTeam: totalAMTForTeam,
                subscribedTeamsArray: subscribedTeamsArray,
                unsubscriberdTeamEventsNames:unsubscriberdTeamEventsNames
            }

            subDetails.push(data)
            var finalData = {
                tournamentId: Session.get("subscribeTournamentID"),
                eventCollection: Session.get("eventParticipantSingleArray"),
                eventEntries: subDetails,
                academyEntriesId: academyEntriesId,
                dAEntriesId: districtAssociationIdEntries
                    //lengthOfEve:events.length
            }
            var subscriptionDetailsOfteamEvents = [];
            if (Session.get("arrayofTeamCheckedSession") != undefined && Session.get("arrayofTeamCheckedSession") != null) {
                subscriptionDetailsOfteamEvents = Session.get("arrayofTeamCheckedSession")
            }
            Meteor.call("entryFromAcademyStateDA", finalData, subscriptionDetailsOfteamEvents, Session.get("subscribePlayerID"),function(e, r) {
                try {
                    if (r) {
                        var emOrg = "",
                            eveOrg;
                        var type = events.findOne({
                            "_id": Session.get("subscribeTournamentID"),
                            tournamentEvent: true
                        })
                        if (type) {
                            eveOrg = Meteor.users.findOne({
                                "_id": type.eventOrganizer
                            })
                        }
                        if (eveOrg && eveOrg.emailAddress && eveOrg.emailAddress) {
                            emOrg = eveOrg.emailAddress
                        }
                        var ema = ""
                        if (userFound && userFound.emailAddress && userFound.emailAddress) {
                            ema = userFound.emailAddress
                        }
                        if(routeValue !== "editTeams"&&routeValue!="createTeams")
                        {
                            $("#sendingMailPopup2").modal({
                                backdrop: 'static',
                                keyboard: false
                            });
                            Meteor.call("getAllSubscribersOfTournament", Session.get("subscribeTournamentID"),Session.get("subscribePlayerID"), function(e, res) {
                                    try {
                                        if (res) {
                                            $("#sendingMailPopup2").modal('hide');
                                            var dataContext = {
                                                message: "Recent subscription details of tournament",
                                                tournament: type.eventName,
                                                eventsDetailsMail: eventsNAMES,
                                                teamEventNamesMAIL:teamEventNames,
                                                teamEventFEESMAIL:teamEventFEES,
                                                playersWithCheckMail: res
                                            }
                                            var html = Blaze.toHTMLWithData(Template.sendSubscriptionEmailFromClubEntry, dataContext);
                                            var options = {
                                                from: "iplayon.in@gmail.com",
                                                to: ema,
                                                cc: emOrg,
                                                bcc:"shalini.krishnan90@gmail.com",
                                                subject: "iPlayOn:Subscription successful",
                                                html: html
                                            }
                                            Meteor.call("sendShareEmail", options, function(e, re) {
                                                if (re) {
                                                    displayMessage("Network issue, Please Check your subscription and try again")
                                                } else {

                                                }
                                            });

                            
                                            //Router.go("/upcomingEvents")
                                        } else if (e) {}
                                    } catch (e) {}
                                })
                        }else
                        {
                            
                        }
                            //Router.go("/upcomingEvents")
                    } else if (e) {}
                } catch (e) {}
            })
        } else {
            
            //Router.go("/upcomingEvents")
        }
    } catch (e) {


    }
}