
var clubWiseDownload = false;


Template.downloadSubscribersCSV.onCreated(function(){
	this.subscribe("upEventsID",Session.get("consolidateID"));
	this.subscribe("upEventsIDCategories",Session.get("consolidateID"))
	this.subscribe("eventFeeSettings");
	this.subscribe("academyEntries");
	this.subscribe("subscriptionRestrictionsParam",Session.get("consolidateID"))

});

Template.downloadSubscribersCSV.onRendered(function(){
	$('#downloadSubscribersCSV').find('#infoMsg').html("");
	$('#downloadSubscribersCSV').find('#saveEditSettingsDraws').attr("style","");
});


Template.downloadSubscribersCSV.helpers({
	"getEventsName":function(){
		try{
			//get the list of events under the tournament
			var r = Session.get("downlodPopArrayHelper");
			return r;
		}catch(e){
		}
	},
	consolidateID:function(e){
		//get the id tournament
		var s = Session.get("consolidateID")
		if(s){
			return s
		}
	}
});

Template.downloadSubscribersCSV.events({
	"click #saveEditSettingsDraws":function(e){
		e.preventDefault();
		$('#downloadSubscribersCSV').find('#infoMsg').html("");
		try
		{
			//get the list of events checked
			var lCheckedEvents = $("input[name=checkEventWise]:checked").map(
			function() {
				return this.value;
			}).get();


			//if the length is not zeo
			//call meteor method to get the name of event
			//call meteor method to get the subscribers details of the event
			if(lCheckedEvents.length!=0)
			{	       	 	
		        $('#downloadSubscribersCSV').find('#infoMsg').html("Getting downloaded");
 				$('#downloadSubscribersCSV').find('#infoMsg').attr("style","color:black !important;");
 				$('#downloadSubscribersCSV').find('#saveEditSettingsDraws').attr("style","background:grey !important");
		       	var subscriptionInfo = subscriptionRestrictions.findOne({"eventOrganizerId":Meteor.userId(),"tournamentId":Session.get("consolidateID")});
		       	if(subscriptionInfo)
		       	{
		       		if(subscriptionInfo.selectionType)
		       		{
		       			if(subscriptionInfo.selectionType == "schoolOnly")
		       			{
		       				for(var k=0;k<lCheckedEvents.length;k++)
							{
			       				var checkedId = lCheckedEvents[k];

			       				Meteor.call("checkProjectType",checkedId,Meteor.userId(),function(e,response){
						       		try{
							            if(response){
							            	if(response == "individual")
							            	{
							            		var names = "";
												Meteor.call("getFileName",checkedId,function(e,r){
													if(r)
													{
														names=r
													}
												})
												
												

							            		Meteor.call("eventWiseSubscribersDownload_School",checkedId,Meteor.userId(),function(e,response){
										       		try{
											            if(response!=0){
											            	var arr = response;						        		
											                JSONToCSVConvertor(arr, "", true,names);
											                $('#downloadSubscribersCSV').modal("hide");
											            }
										            }catch(e){
												    }
										        });
							            	}
							            	else if(response == "team")
							            	{
							            		var names = "";
												Meteor.call("getFileName",checkedId,function(e,r){
													if(r)
													{
														names=r
													}
												})

							            		Meteor.call("team_eventWiseSubscribersDownload_School",checkedId,Meteor.userId(),function(e,response){
										       		try{
											            if(response!=0){
											            	var arr = response;						        		
											                JSONToCSVConvertor(arr, "", true,names);
											                $('#downloadSubscribersCSV').modal("hide");
											            }
										            }catch(e){
												    }
										        });
							            	}
							            }
						            }catch(e){
								    }
						        });
							}

		       					
		       			}
		       			else
		       			{
							for(var k=0;k<lCheckedEvents.length;k++)
							{
			       				var checkedId = lCheckedEvents[k];
			       					
								var names = "";
								Meteor.call("getFileName",lCheckedEvents[k],function(e,r){
									if(r){
									    names=r
									}
								});

								Meteor.call("eventWiseSubscribersDownload",checkedId,Meteor.userId(),function(e,response){															
									if(response!=0)
									{
										var arr = response;		
										JSONToCSVConvertor(arr, "", true,names);
										$('#downloadSubscribersCSV').modal("hide");
									}
								});
							}    		
		       			}
		       		}
		       	}
		    }

	        //check if consolidated is checked to true - single events
	        var lcheckConsolidated = $("input[name=checkConsolidated]:checked").map(
			function() {
				return this.value;
			}).get();

			if(lcheckConsolidated.length!=0)
			{
				
				$('#downloadSubscribersCSV').find('#infoMsg').html("Getting downloaded");
 				$('#downloadSubscribersCSV').find('#infoMsg').attr("style","color:black !important;");
 				$('#downloadSubscribersCSV').find('#saveEditSettingsDraws').attr("style","background:grey !important");
					
					var checkedId = lcheckConsolidated.toString();           	
					Meteor.call("downloadConsolidatedSubscribers",lcheckConsolidated.toString(),Meteor.userId(),function(e,response){
		            if(response!=0)
		            {
		            	var eventList = "";
						var keyFields = ["Sl.No","Name","Affiliation ID","Academy Name","emailAddress","Phone Number","DOB"];		
						var eventSettingsInfo = eventFeeSettings.findOne({"tournamentId":checkedId})
        				if(eventSettingsInfo)
        				{
            				eventList = eventSettingsInfo.singleEvents;
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

    				    $('#downloadSubscribersCSV').modal('hide');


		            }
		            else if(response==0)
		            {
		            	$('#downloadSubscribersCSV').modal('hide');
		            	$("#alreadySubscribed").modal({backdrop: 'static'});
		            	$("#alreadySubscribedText").text("No Subscribers");
		            }
		        });
			}

			//check if consolidated is checked to true - team events
	        var lcheckConsolidated = $("input[name=checkConsolidatedTeam]:checked").map(
			function() {
				return this.value;
			}).get();

			if(lcheckConsolidated.length!=0)
			{
				
				$('#downloadSubscribersCSV').find('#infoMsg').html("Getting downloaded");
 				$('#downloadSubscribersCSV').find('#infoMsg').attr("style","color:black !important;");
 				$('#downloadSubscribersCSV').find('#saveEditSettingsDraws').attr("style","background:grey !important");
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
    				    $('#downloadSubscribersCSV').modal('hide');


		            }
		            else if(response==0)
		            {
		            	$('#downloadSubscribersCSV').modal('hide');
		            	$("#alreadySubscribed").modal({backdrop: 'static'});
		            	$("#alreadySubscribedText").text("No Subscribers");
		            }
		        });
			}




			//check if club wise is checked to true
	        var lcheckClubWise = $("input[name=checkClubWise]:checked").map(
			function() {
				return this.value;
			}).get();

			if(lcheckClubWise.length!=0)
			{
				if(clubWiseDownload)
				{
					var distinctAcademies = academyEntries.find({"tournamentId":lcheckClubWise.toString()}).fetch();
					if(distinctAcademies.length > 0)
					{
						var eventList = "";
						var keyFields = ["Sl.No","Name","Affiliation ID","Academy Name","Affiliation ID","emailAddress","Phone Number","DOB"];		            	
						var eventSettingsInfo = eventFeeSettings.findOne({"tournamentId":lcheckClubWise.toString()})
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

							Meteor.call("downloadClubwiseSubscribers",lcheckClubWise.toString(),academyId,function(e,response){
	       	 	
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
	    							$('#downloadSubscribersCSV').modal('hide');

		            			}

			            		else if(response==0)
			            		{
			            			$('#downloadSubscribersCSV').modal('hide');
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
					$('#downloadSubscribersCSV').find('#infoMsg').html("Getting downloaded");
 					$('#downloadSubscribersCSV').find('#infoMsg').attr("style","color:black !important;");
 					$('#downloadSubscribersCSV').find('#saveEditSettingsDraws').attr("style","background:grey !important");
					var keyFields = ["Sl.No","Academy/Player Name","Total"];	
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
	    					$('#downloadSubscribersCSV').modal('hide');


						}
						else
						{
							$('#downloadSubscribersCSV').modal('hide');
				            $("#alreadySubscribed").modal({backdrop: 'static'});
				            $("#alreadySubscribedText").text("No Subscribers");
						}
					});
				}
			}//end of checkclubwise


			//check if district wise is checked or not
			//check if club wise is checked to true
	        var lcheckDistrictWise = $("input[name=checkDistrictWise]:checked").map(
			function() {
				return this.value;
			}).get();

			if(lcheckDistrictWise.length!=0)
			{

				//code need to be done
				$('#downloadSubscribersCSV').find('#infoMsg').html("Getting downloaded");
 				$('#downloadSubscribersCSV').find('#infoMsg').attr("style","color:black !important;");
 				$('#downloadSubscribersCSV').find('#saveEditSettingsDraws').attr("style","background:grey !important");
				var keyFields = ["Sl.No","DistrictAssociation/Player Name","Total"];	
				Meteor.call("downloadDAEntries",lcheckDistrictWise.toString(),function(e,response){
	       	 	
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
	    					link.download = "DistrictAssociation.csv";
	    
	    					document.body.appendChild(link);
	    					link.click();
	    					document.body.removeChild(link);         	
	    					$('#downloadSubscribersCSV').modal('hide');


						}
						else
						{
							$('#downloadSubscribersCSV').modal('hide');
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
Template.registerHelper('getABBNAME',function(data){
	try{
		var j = events.findOne({"_id":data});
		if(j!=undefined){
			return j.abbName;
		}
	}catch(e){
	}

});

//check participants list is there in db
//if its no there that event is not shown
Template.registerHelper('partPresents',function(data){
	try{
		var j = events.findOne({"_id":data});
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