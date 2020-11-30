Template.updateADDCity.onRendered(function(){
	//this.subscribe("userDetailsTT");
	//this.subscribe("associationDetails");
	//this.subscribe("academyDetails");
	//this.subscribe("otherUsers")
	this.subscribe("tournamentEvents");
	this.subscribe("eventFeeSettings");
	this.subscribe("customCollection");
	this.subscribe("autoTweetMessages");
	this.subscribe("barChartColor");
	this.subscribe("schoolEventsToFind");
});

Template.updateADDCity.onCreated(function(){

})

Template.updateADDCity.helpers({
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
	},
	"countOfNullUsers":function(){
		try{
			var findUsersWithNull = userDetailsTT.find({
				$or:[
					{city:null},
					{state:null},
					{pinCode:null},
					{country:null}
				]
			}).fetch();
			if(findUsersWithNull){
				return findUsersWithNull.length;
			}
		}catch(e){
			alert(e)
		}
	},
	"countOfNullAssociation":function(){
		try{
			var findUsersWithNull = associationDetails.find({
				$or:[
					{city:null},
					{state:null},
					{pinCode:null},
					{country:null}
				]
			}).fetch();
			if(findUsersWithNull){
				return findUsersWithNull.length;
			}
		}catch(e){
			alert(e)
		}
	},
	"countOfNullAca":function(){
		try{
			var findUsersWithNull = academyDetails.find({
				$or:[
					{city:null},
					{state:null},
					{pinCode:null},
					{country:null}
				]
			}).fetch();
			if(findUsersWithNull){
				return findUsersWithNull.length;
			}
		}catch(e){
			alert(e)
		}
	},
	"countOfNullOtherUser":function(){
		try{
			var findUsersWithNull = otherUsers.find({
				$or:[
					{city:null},
					{state:null},
					{pinCode:null},
					{country:null}
				]
			}).fetch();
			if(findUsersWithNull){
				return findUsersWithNull.length;
			}
		}catch(e){
			alert(e)
		}
	},
	"tournamentEventsValue":function(){
		var findTournamentEvent = tournamentEvents.findOne({});
		if(findTournamentEvent)
			return JSON.stringify(findTournamentEvent)
	},
	"eventFeeSettingsValue":function(){
		var eventFeeSettingsFind = eventFeeSettings.find({}).fetch();
		if(eventFeeSettingsFind.length!=0)
			return eventFeeSettingsFind
	},
	"customCollectionValue":function(){
		var customCollectionValueFind = customCollection.find({}).fetch();
		if(customCollectionValueFind.length!=0){
			return customCollectionValueFind
		}
	},
	autoTweetMessages:function(){
		var customCollectionValueFind = autoTweetMessages.find({}).fetch();
		if(customCollectionValueFind.length!=0){
			return customCollectionValueFind
		}
	},	
	barChartColors:function(){
		var customCollectionValueFind = barChartColor.find({}).fetch();
		if(customCollectionValueFind.length!=0){
			return customCollectionValueFind
		}
	},
	insertSchoolDetails:function(){
		var customCollectionValueFind = schoolEventsToFind.find({}).fetch();
		if(customCollectionValueFind.length!=0){
			return customCollectionValueFind
		}
	},
	lengthOfEvents:function(){
		var t = ReactiveMethod.call("lengthOfEventsUp");
		return t
	},
	lengthOfPastEvents:function(){
		var r = ReactiveMethod.call("lengthOfPastEventsLen")
		return r
	},
	lengthOfcalenderEvents:function(){
		var r = ReactiveMethod.call("lengthOfcalenderEventsCAll");
		return r
	}
});

Template.updateADDCity.events({
	"click #userDetailsTTUp":function(e){
		e.preventDefault();
		//var tournamentID = $("#tournamentIdValue").val().trim();
		Meteor.call("updateADDCityMethodForUsers",function(e,res){
			if(e){
				alert(e)
			}
		});
	},
	"click #academyDetailsUp":function(e){
		e.preventDefault();
		//var tournamentID = $("#tournamentIdValue").val().trim();
		Meteor.call("updateADDCityMethodForAcademy",function(e,res){
			if(e){
				alert(e)
			}
		});
	},
	"click #otherDetailsUp":function(e){
		e.preventDefault();
		//var tournamentID = $("#tournamentIdValue").val().trim();
		Meteor.call("updateADDCityMethodForOther",function(e,res){
			if(e){
				alert(e)
			}
		});
	},
	"click #associationDetailsUp":function(e){
		e.preventDefault();
		//var tournamentID = $("#tournamentIdValue").val().trim();
		Meteor.call("updateADDCityMethodForAssoc",function(e,res){
			if(e){
				alert(e)
			}
			else{
				$("#associationDetailsUp").prop("id","changedId5")
			}
		});
	},
	"click #tournamentEventsUpdate":function(e){
		e.preventDefault();
		Meteor.call("updateTournamentEventsOfDataBaseSep",function(e,res){
			if(e){
				alert(e)
			}
			else{
				$("#tournamentEventsUpdate").prop("id","changedId4")
			}
		});
	},
	"click #eventsFeeSettingsUpdate":function(e){
		e.preventDefault();
		Meteor.call("updateEventFeeSettingsSep",function(e,res){
			if(e){
				alert(e)
			}
			else{
				$("#eventsFeeSettingsUpdate").prop("id","changedId3")
			}
		});
	},
	"click #updateCustomCollection":function(e){
		e.preventDefault();
		Meteor.call("updateCustomCollection",function(e,res){
			if(e){
				alert(e)
			}
			else{
				$("#updateCustomCollection").prop("id","changedId2")
			}
		})
	},
	"click #updateAutoTweetTags":function(e){
		e.preventDefault();
		Meteor.call("insertAutoTweetMessagesHashTags",function(e,res){
			if(e){
				alert(e)
			}
			else{
				$("#updateAutoTweetTags").prop("id","changedId1")
			}
		})
	},
	"click #insertBARChartColor":function(e){
		e.preventDefault();
		Meteor.call("barChartColorInsert",function(e,res){
			if(e){
				alert(e)
			}
		});
	},
	"click #insertSchoolDetailsFind":function(e) {
		e.preventDefault();
		Meteor.call("updateschoolEventsToFind",function(e){
			if(e){
				alert(e)
			}
		})
	},
	"click #calenderEventsCreateId":function(e){
		e.preventDefault();
		Meteor.call("calenderEventsCreate",function(e,res){
			if(e){
				alert(e)
			} else{
				alert("Number of events inserted to calender events"+res)
			}
		})
	},
	'click #deleteAllRecords':function(e){
		e.preventDefault();
		Meteor.call("deleteAllRecordsForGivenData",function(){
			if(e){
				alert(e.reason)
			} else{
				alert("Deleted")
			}
		})
	},
	"click #moveToUpcomingEvent":function(e){
		e.preventDefault();
		var tournamentId = $("#tID").val()
		var startDate = $("#tSD").val()
		var endDate = $("#tED").val()
		var entryDate = $("#tLD").val()
		Meteor.call("movePastTournamentToUpcoming",tournamentId,startDate,endDate,entryDate,function(e,res){
			if(e){
				alert(e)
			} else{
				alert("moved")
			}
		})
	}
});

function JSONToCSVConvertorTocopyevents(JSONData, ReportTitle, ShowLabel,filNam) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
   // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = '"' +"Sl.No"+'",';
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row +=  '"' +index + '",';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    var s=0
    for (var i = 0; i < arrData.length; i++) {
    	s=s+1;
        var row = s+",";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
        	if(typeof arrData[i][index]=="string")
            row +='"' + arrData[i][index] + '",';
        	else{
            row += arrData[i][index]+","
        	
        	}
        }

        row = row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = filNam+"COPIEDEVENTS";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

Template.registerHelper("stringifyTemplate",function(data){
	if(data)
		return JSON.stringify(data)
})