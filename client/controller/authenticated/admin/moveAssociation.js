Template.moveAssociation.onCreated(function(){
	this.subscribe("schoolDetails");
	this.subscribe("sequenceDataRecord");
	this.subscribe("sequenceDataRecordTemp");
	this.subscribe("sequenceDataRecordTemp1");
	this.subscribe("coachConnectedGroups");
	this.subscribe("coachAPPINSentBOX");
	this.subscribe("connectionRequests");
	this.subscribe("workAssignments"),
	this.subscribe("lastInsertedAffId")
})

Template.moveAssociation.helpers({
	"getTax":function()
	{
		var entry = lastInsertedAffId.findOne({"assocId" : "Tax"});
		if(entry && entry.lastInsertedId)
			return entry.lastInsertedId;

	}
})

Template.moveAssociation.events({

	"click #generateTE":function(e)
	{
		Meteor.call("tournamentsUpdate_Admin",function(error,result)
		{
			if(result)
			{
				$("#generateTEresponse").text(result);
				$("#generateTE").attr("id", "abc");

			}
			else{
    			$("#generateTE").removeAttr("disabled");
			}
		})

	},
	"click #clearCon":function(e)
	{
		Meteor.call("clearConnections_Admin",function(error,result)
		{
			if(result)
			{
				$("#clearConresponse").text(result);
				$("#clearCon").attr("id", "abc");

			}
			else{
    			$("#clearCon").removeAttr("disabled");
			}
		})
	},
	/*
	"click #copySequence":function(e)
	{
		Meteor.call("copySequenceTemp",function(error,result)
		{
			if(result)
			{
				$("#copySequenceResponse").text(result);
				$("#copySequence").attr("id", "abc");

			}
			else{
    			$("#copySequence").removeAttr("disabled");
			}
		})
	},
	"click #sequenceTempID":function(e)
	{
		Meteor.call("sequenceTempIDFix",function(error,result)
		{
			if(result)
			{
				$("#sequenceTempResponse").text(result);
				$("#sequenceTempID").attr("id", "abc");

			}
			else{
    			$("#sequenceTempID").removeAttr("disabled");
			}
		})
	},
	"click #sequenceID":function(e)
	{
		Meteor.call("sequenceIDFix",function(error,result)
		{
			if(result)
			{
				$("#sequenceResponse").text(result);
				$("#sequenceID").attr("id", "abc");

			}
			else{
    			$("#sequenceID").removeAttr("disabled");
			}
		})
	},
	
	"click #sequenceSampleID":function(e)
	{
		var dataID = $("#getId").val();

		Meteor.call("errorSummary",dataID,function(error,result)
		{
			if(result)
			{
				$("#sequenceSampleResponse").text(result);
				$("#sequenceSampleID").attr("id", "abc");

			}
			else{
    			$("#sequenceSampleID").removeAttr("disabled");
			}
		})
	},
	*/

	"click #taxEntry":function(e)
	{
		var dataID = $("#taxVal").val();

		Meteor.call("setTax",dataID,function(error,result)
		{
			if(result)
			{
				alert("success")

			}
			else{
			}
		})
	},

	"click #regAssocUpdate":function(e){

		//z37CQ3th8i73SQogk
		
		var dataID = $("#assocVal").val();
		if(dataID.length > 0)
		{
			Meteor.call("regAssocUpdate",dataID,function(error,result)
			{
				if(result)
				{
					$("#registrationAssocMsg").text(result);
					$("#regAssocUpdate").attr("id", "abc");

				}
				else{
	    			$("#regAssocUpdate").removeAttr("disabled");
				}
			})
		}

		

	},

	
	"click #playerGenderUpdate":function(e)
	{
		Meteor.call("playerGenderUpdate",function(error,result)
		{
			if(result)
			{
				$("#singlePlayerMomentMsgActual").text(result[0]);
				$("#singlePlayerMomentMsgMoved").text(result[1]);
				$("#playerGenderUpdate").attr("id", "abc");

			}
			else{
    			$("#playerGenderUpdate").removeAttr("disabled");
			}
		})
	},
	"click #otherUserGenderUpdate":function(e)
	{
		Meteor.call("otherUserGenderUpdate",function(error,result)
		{
			if(result)
			{
				$("#multiPlayerMomentMsgActual").text(result[0]);
				$("#multiPlayerMomentMsgMoved").text(result[1]);
				$("#otherUserGenderUpdate").attr("id", "abc");

			}
			else{
    			$("#otherUserGenderUpdate").removeAttr("disabled");
			}
		})
	},
	"click #dobFiltersEntry":function(e)
	{
		Meteor.call("dobFilterEntry",function(error,result)
		{
			if(result)
			{
				
				$("#dobTournMsgActual").text(result[0]);
				$("#dobTournMsgMoved").text(result[1]);
				$("#dobMsgActual").text(result[2]);
				$("#dobMsgMoved").text(result[3]);
				$("#dobFiltersEntry").attr("id", "abc");

			}
			else{
    			$("#dobFiltersEntry").removeAttr("disabled");
			}
		})
	},
	"click #generateTmpAfId":function(e)
	{
		Meteor.call("generateTmpAfId_Players",function(error,result)
		{
			if(result)
			{
				$("#tmpAfIdMsgActual").text(result[0]);
				$("#tmpAfIdMsgMoved").text(result[1]);
				$("#generateTmpAfId").attr("id", "abc");
			}
			else{
    			$("#generateTmpAfId").removeAttr("disabled");
			}
		})
	},
	"click #adminEntryTrans":function(e){
		$("#entryTransactionResponse").text("Please wait");

		Meteor.call("generateEntryTransaction",function(error,result)
		{
			if(result)
			{
				$("#entryTransactionResponse").text(result);
				$("#adminEntryTrans").attr("id", "abc");

			}
			else{
    			$("#adminEntryTrans").removeAttr("disabled");
			}
		})
	},

	//entryTransactionResponse
	/*
	"click #generateSequence":function(e)
	{
		Meteor.call("generateSequence",function(error,result)
		{
			if(result)
			{
				$("#SequenceMsgActual").text("success");
				$("#SequenceMsgMoved").text("success");
				$("#generateSequence").attr("id", "abc");
			}
			else{
    			$("#generateSequence").removeAttr("disabled");
			}
		})
	},
	"click #generateStrokes":function(e)
	{
		Meteor.call("generateStrokes",function(error,result)
		{
			if(result)
			{
				$("#StrokesMsgActual").text("success");
				$("#StrokesMsgActual").text("success");
				$("#generateStrokes").attr("id", "abc");
			}
			else{
    			$("#generateStrokes").removeAttr("disabled");
			}
		})
	},*/
	"click #singlePlayerMoment":function(e)
	{
		Meteor.call("singlePlayerMomentDateUpdate",function(error,result)
		{
			if(result)
			{
				$("#singlePlayerMomentMsgActual").text(result[0]);
				$("#singlePlayerMomentMsgMoved").text(result[1]);
				$("#singlePlayerMoment").attr("id", "abc");

			}
			else{
    			$("#singlePlayerMoment").removeAttr("disabled");
			}
		})
	},
	"click #multiPlayerMoment":function(e)
	{
		Meteor.call("multiPlayerMomentDateUpdate",function(error,result)
		{
			if(result)
			{
				$("#multiPlayerMomentMsgActual").text(result[0]);
				$("#multiPlayerMomentMsgMoved").text(result[1]);
				$("#multiPlayerMoment").attr("id", "abc");

			}
			else{
    			$("#multiPlayerMoment").removeAttr("disabled");
			}
		})
	},
	"click #moveAssociationDB":function(e)
	{
		e.preventDefault();
		$("#moveAssociationDB").attr("disabled", true);

		Meteor.call("moveAssociationToNewDB",function(error,result)
		{
			if(result)
			{
				$("#moveAssociationMsgActual").text(result[0]);
				$("#moveAssociationMsgMoved").text(result[1]);
				$("#moveAssociationDB").attr("id", "abc");

			}
			else{
    			$("#moveAssociationDB").removeAttr("disabled");
			}
		})
	},
	"click #moveAcademyDB":function(e)
	{
		e.preventDefault();
		$("#moveAcademyDB").attr("disabled", true);
		Meteor.call("moveAcademyToNewDB",function(error,result)
		{
			if(result)
			{
				$("#moveAcademyMsgActual").text(result[0]);
				$("#moveAcademyMsgMoved").text(result[1]);
				$("#moveAcademyDB").attr("id", "abc");

			}
			else
    			$("#moveAcademyDB").removeAttr("disabled");
		})
	},
	"click #movePlayersDB":function(e)
	{
		e.preventDefault();
		$("#movePlayersDB").attr("disabled", true);
		Meteor.call("movePlayersToNewDB",function(error,result)
		{
			if(result)
			{
				$("#movePlayersMsgActual").text(result[0]);
				$("#movePlayersMsgMoved").text(result[1]);
				$("#movePlayersDB").attr("id", "abc");

			}
			else
    			$("#movePlayersDB").removeAttr("disabled");
		})
	},
	"click #moveOtherUsersDB":function(e)
	{
		e.preventDefault();
		$("#moveOtherUsersDB").attr("disabled", true);
		Meteor.call("moveOtherUsersToNewDB",function(error,result)
		{
			if(result)
			{
				$("#moveOtherUsersMsgActual").text(result[0]);
				$("#moveOtherUsersMsgMoved").text(result[1]);
				$("#moveOtherUsersDB").attr("id", "abc");

			}
			else
    			$("#moveOtherUsersDB").removeAttr("disabled");
		})
	},
	"click #copyUsers":function(e)
	{
		e.preventDefault();
		$("#copyUsers").attr("disabled", true);

		Meteor.call("copyEntireUserDB",function(error,result)
		{
			if(result)
			{
				$("#copyUsersMsgActual").text(result[0]);
				$("#copyUsersMsgMoved").text(result[1]);
				$("#copyUsers").attr("id", "abc");

			}
			else
				$("#copyUsers").removeAttr("disabled");
		})
	},
	"click #insertProjectsTour":function(e)
	{
		e.preventDefault();
		/*Meteor.call("insertProjectsTour",function(error,result)
		{
			
		})*/

		

		
		var response = Meteor.users.find({role:"Player"},{fields:{dateOfBirth:1,userId:1,emailAddress:1,userName:1}}).fetch();
		JSONToCSVConvertor(response, "",true,"")
	}
	

})


function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel,filNam) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';    

    if (ShowLabel) {
        var row = '"' +"Sl.No"+'",';
        for (var index in arrData[0]) {
			
        			row +=  '"' +index + '",';
        	
        }

        row = row.slice(0, -1);
        CSV += row + '\r\n';
    }
    
    var s=0
    for (var i = 0; i < arrData.length; i++) {
    	s=s+1;
        var row = s+",";
        for (var index in arrData[i]) {
        	
	        	
        		
					if(typeof arrData[i][index]=="string")
            			row +='"' + arrData[i][index] + '",';
        			else{
            			row += arrData[i][index]+","
        			}
        		
        		
        	
        	
        }

        row = row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "EVENTS_SUBSCRIBERS";
    fileName += ReportTitle.replace(/ /g,"_");   
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");    
    link.href = uri;
    
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}