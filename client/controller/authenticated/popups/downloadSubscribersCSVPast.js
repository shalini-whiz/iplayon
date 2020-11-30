
var clubWiseDownload = false;


Template.downloadSubscribersCSVPast.onCreated(function(){
	this.subscribe("pastEventsID",Session.get("consolidateID_past"));
	this.subscribe("pastEventsIDCategories",Session.get("consolidateID_past"))
	this.subscribe("eventFeeSettings");
	this.subscribe("academyEntries");
});

Template.downloadSubscribersCSVPast.onRendered(function(){

	$('#downloadSubscribersCSVPast').find('#infoMsg_past').html("");
	$('#downloadSubscribersCSVPast').find('#saveEditSettingsDraws_past').attr("style","");
});


Template.downloadSubscribersCSVPast.helpers({
	"getEventsName_past":function(){
		try{
			//get the list of events under the tournament
			var r = Session.get("downlodPopArrayHelper_past");
			return r;
		}catch(e){
		}
	},
	consolidateID_past:function(e){
		//get the id tournament
		var s = Session.get("consolidateID_past")
		if(s){
			return s
		}
	}
});

Template.downloadSubscribersCSVPast.events({
	"click #saveEditSettingsDraws_past":function(e){
		e.preventDefault();
		$('#downloadSubscribersCSVPast').find('#infoMsg_past').html("");
		try{
			//get the list of events checked
			var lCheckedEvents = $("input[name=checkEventWise_past]:checked").map(
			function() {
				return this.value;
			}).get();
			//if the length is not zeo
			//call meteor method to get the name of event
			//call meteor method to get the subscribers details of the event
			if(lCheckedEvents.length!=0){
				for(var k=0;k<lCheckedEvents.length;k++){
		       	 	var names = "";
		       	 	Meteor.call("getFileNamePast",lCheckedEvents[k],function(e,r){
		            	names=r
		            })

		            $('#downloadSubscribersCSVPast').find('#infoMsg_past').html("Getting downloaded");
 					$('#downloadSubscribersCSVPast').find('#infoMsg_past').attr("style","color:black !important;");
 					$('#downloadSubscribersCSVPast').find('#saveEditSettingsDraws_past').attr("style","background:grey !important");
					var checkedId = lCheckedEvents[k];

		       		Meteor.call("pasteventWiseSubscribersDownload",lCheckedEvents[k],Meteor.userId(),function(e,response){
		       			try{
			            	if(response!=0)
			            	{

			            		var arr = response;
			            		var sortbyTotalPoints = 
			            		arr.sort(function(a, b){
								 	return parseInt(b["Total Points"]) - parseInt(a["Total Points"]);
								});
			                	JSONToCSVConvertor(arr, "", true,names);
			                	$('#downloadSubscribersCSVPast').modal("hide");
			                }
			                else
			                {
			                	$('#downloadSubscribersCSVPast').modal('hide');
								$("#alreadySubscribed").modal({backdrop: 'static'});
		            			$("#alreadySubscribedText").text("No Subscribers");
			                }


		            	}catch(e){
				    	}
			        });
		       	}
	        }

	        //check if consolidated is checked to true
	        var lcheckConsolidated = $("input[name=checkConsolidated_past]:checked").map(
			function() {
				return this.value;
			}).get();

			if(lcheckConsolidated.length!=0)
			{
				
				$('#downloadSubscribersCSVPast').find('#infoMsg_past').html("Getting downloaded");
 				$('#downloadSubscribersCSVPast').find('#infoMsg_past').attr("style","color:black !important;");
 				$('#downloadSubscribersCSVPast').find('#saveEditSettingsDraws_past').attr("style","background:grey !important");
					var checkedId = lcheckConsolidated.toString();

					Meteor.call("downloadConsolidatedSubscribers",lcheckConsolidated.toString(),Meteor.userId(),function(e,response){
		            if(response!=0)
		            {

					
		            	var eventList = "";
						var keyFields = ["Sl.No","Name","Affiliation ID","Academy Name","emailAddress","Phone Number","DOB"];		            	
						var eventSettingsInfo = eventFeeSettings.findOne({"tournamentId":checkedId})
        				if(eventSettingsInfo)
        				{
            				eventList = eventSettingsInfo.events;
            				for(var h=0; h<eventList.length;h++)
            				{
            					keyFields.push(eventList[h]);
								
            				}
        				}
						keyFields.push("Total");
						keyFields.push("Receipt");
						keyFields.push("Affiliation Status");

		            	var names2 = Session.get("consolidateName");
		           		
		                var csv = Papa.unparse({
								fields: keyFields,
								data:response
	
							});
    					var fileName = names2+"_EVENTS_SUBSCRIBERS";
    					var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
   						var link = document.createElement("a");    
    					link.href = uri;
    					link.style = "visibility:hidden";
    					link.download = fileName + ".csv";
    
    					document.body.appendChild(link);
    					link.click();
    					document.body.removeChild(link);

    				    $('#downloadSubscribersCSVPast').modal('hide');


		            }
		            else if(response==0)
		            {
		            	$('#downloadSubscribersCSVPast').modal('hide');
		            	$("#alreadySubscribed").modal({backdrop: 'static'});
		            	$("#alreadySubscribedText").text("No Subscribers");
		            }
		        });
			}

			//check if consolidated is checked to true - team events
	       var lcheckConsolidated = $("input[name=checkConsolidated_pastTeam]:checked").map(
			function() {
				return this.value;
			}).get();

			if(lcheckConsolidated.length!=0)
			{
				$('#downloadSubscribersCSVPast').find('#infoMsg_past').html("Getting downloaded");
 				$('#downloadSubscribersCSVPast').find('#infoMsg_past').attr("style","color:black !important;");
 				$('#downloadSubscribersCSVPast').find('#saveEditSettingsDraws_past').attr("style","background:grey !important");
					var checkedId = lcheckConsolidated.toString();

					Meteor.call("downloadConsolidatedSubscribers_Team",lcheckConsolidated.toString(),function(e,response){
		            if(response!=0)
		            {
		            	var eventList = "";
						var keyFields = ["Sl.No","Name","Affiliation ID","Academy Name","emailAddress","Phone Number","DOB"];		            	
						var eventSettingsInfo = eventFeeSettings.findOne({"tournamentId":checkedId})
        				if(eventSettingsInfo)
        				{
            				eventList = eventSettingsInfo.teamEvents;
            				for(var h=0; h<eventList.length;h++)
            				{
            					keyFields.push(eventList[h]);
								
            				}
        				}
						keyFields.push("Total");
						keyFields.push("Receipt");

						
		            	var names2 = Session.get("consolidateName");
		           
		                var csv = Papa.unparse({
								fields: keyFields,
								data:response
	
							});

    					var fileName = names2+"_EVENTS_SUBSCRIBERS";
    					var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
   						var link = document.createElement("a");    
    					link.href = uri;
    					link.style = "visibility:hidden";
    					link.download = fileName + ".csv";
    
    					document.body.appendChild(link);
    					link.click();
    					document.body.removeChild(link);

    				    $('#downloadSubscribersCSVPast').modal('hide');


		            }
		            else if(response==0)
		            {
		            	$('#downloadSubscribersCSVPast').modal('hide');
		            	$("#alreadySubscribed").modal({backdrop: 'static'});
		            	$("#alreadySubscribedText").text("No Subscribers");
		            }
		        });
			}
			

			//check if club wise is checked to true
	        var lcheckClubWise = $("input[name=checkClubWise_past]:checked").map(
			function() {
				return this.value;
			}).get();

			if(lcheckClubWise.length!=0)
			{

				if(clubWiseDownload)
				{
					var checkedId = lcheckClubWise.toString();

					var distinctAcademies = academyEntries.find({"tournamentId":lcheckClubWise.toString()}).fetch();
					if(distinctAcademies.length > 0)
					{
						var eventList = "";
						var keyFields = ["Sl.No","Name","Affiliation ID","Academy Name","Affiliation ID","emailAddress","Phone Number","DOB"];		            	
						var eventSettingsInfo = eventFeeSettings.findOne({"tournamentId":checkedId})
        				if(eventSettingsInfo)
        				{
            				eventList = eventSettingsInfo.events;
            				for(var h=0; h<eventList.length;h++)
            				{
            					keyFields.push(eventList[h]);								
            				}
        				}
						keyFields.push("Total");


						for(var m=0;m<distinctAcademies.length;m++)
						{
							var academyId = distinctAcademies[m].academyId;

							Meteor.call("downloadClubwiseSubscribers",checkedId,academyId,function(e,response){
	       	 	
 								if(response!=0)
		            			{

				                	var csv = Papa.unparse({
										fields: keyFields,
										data:response
									});

					               	if(response[0][3] != undefined)
					               	{
					                	var fileName = response[0][3]+"_EVENTS_SUBSCRIBERS";
					                }
	    							var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
	   								var link = document.createElement("a");    
	    							link.href = uri;
	    							link.style = "visibility:hidden";
	    							link.download = fileName + ".csv";
	    
	    							document.body.appendChild(link);
	    							link.click();
	    							document.body.removeChild(link);
		            			}

			            		else if(response==0)
			            		{
			            			$('#downloadSubscribersCSVPast').modal('hide');
									$("#alreadySubscribed").modal({backdrop: 'static'});
		            				$("#alreadySubscribedText").text("No Subscribers");
				            		
			           	 		}

       	 	 				});

						}
				
					}
				}
				else
				{
					//code need to be done
					$('#downloadSubscribersCSVPast').find('#infoMsg_past').html("Getting downloaded");
 					$('#downloadSubscribersCSVPast').find('#infoMsg_past').attr("style","color:black !important;");
 					$('#downloadSubscribersCSVPast').find('#saveEditSettingsDraws_past').attr("style","background:grey !important");
					var keyFields = ["Sl.No","Academy/Player Name","Total"];	
										var checkedId = lcheckClubWise.toString();

					Meteor.call("downloadAcademyEntries",lcheckClubWise.toString(),function(e,response){
	       	 	
 						if(response!=0)
		            	{

				            var csv = Papa.unparse({
										fields: keyFields,
										data:response
							});	   
							var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
	   						var link = document.createElement("a");    
	    					link.href = uri;
	    					link.style = "visibility:hidden";
	    					link.download = "Academy.csv";
	    
	    					document.body.appendChild(link);
	    					link.click();
	    					document.body.removeChild(link);         	
	    					$('#downloadSubscribersCSVPast').modal('hide');


						}
						else
						{
							$('#downloadSubscribersCSVPast').modal('hide');
							$("#alreadySubscribed").modal({backdrop: 'static'});
		            		$("#alreadySubscribedText").text("No Subscribers");
						}
					});
			

				}
			}

			//check if district wise checked or not
			var lcheckDAWise = $("input[name=checkDistrictWise_past]:checked").map(
			function() {
				return this.value;
			}).get();

			if(lcheckDAWise.length!=0)
			{
				//code need to be done
				$('#downloadSubscribersCSVPast').find('#infoMsg_past').html("Getting downloaded");
 				$('#downloadSubscribersCSVPast').find('#infoMsg_past').attr("style","color:black !important;");
 				$('#downloadSubscribersCSVPast').find('#saveEditSettingsDraws_past').attr("style","background:grey !important");
				var keyFields = ["Sl.No","DistrictAssociation/Player Name","Total"];	
				Meteor.call("downloadDAEntries",lcheckDAWise.toString(),function(e,response){
	       	 	
 					if(response!=0)
		            {

				        var csv = Papa.unparse({fields: keyFields,data:response});	   
						var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
	   					var link = document.createElement("a");    
	    				link.href = uri;
	    				link.style = "visibility:hidden";
	    				link.download = "DistrictAssociation.csv";
	    
	    				document.body.appendChild(link);
	    				link.click();
	    				document.body.removeChild(link);         	
	    				$('#downloadSubscribersCSVPast').modal('hide');
					}
					else
					{
						$('#downloadSubscribersCSVPast').modal('hide');
						$("#alreadySubscribed").modal({backdrop: 'static'});
		            	$("#alreadySubscribedText").text("No Subscribers");
					}
				});
			}



			

			

		
    	}catch(e){
    	}
	}

});

//get abbrevation name for  the id of event
Template.registerHelper('getABBNAMEPAst',function(data){
	try{
		var j = pastEvents.findOne({"_id":data});
		if(j!=undefined){
			return j.abbName;
		}
	}catch(e){
	}

});

//check participants list is there in db
//if its no there that event is not shown
Template.registerHelper('partPresentsPAst',function(data){
	try{
		var j = pastEvents.findOne({"_id":data});
		if(j!=undefined){
			if(j.eventParticipants!=undefined&&j.eventParticipants.length!=0){
				return true
			}
			else return false
		}
	}catch(e){
	}

});

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel,filNam) {
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
        displayMessage("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = filNam+"_EVENTS_SUBSCRIBERS";
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

var customSort = function(arr,xCallback){
	var key =["Sl.No","Name","Academy Name","emailAddress","Phone Number","DOB (dd/mmm/yyyy)","CB","CG","JB","JG","SJB","SJG","OS","OD","O","YG","YB","M","W","NMS","NMD","Total"]
}