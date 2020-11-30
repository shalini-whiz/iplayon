import { Match } from 'meteor/check'

Meteor.methods({

	"createTour":async function(data)
	{
		try{
			var selectionTypeArr = ["selfOnly","allSub","resrictP","pickASSAC","allExceptSchool","schoolOnly"]
			var genericSelectionTypeArr = ["selfOnly","allSub"]
			var organizerSelectionTypeArr = ["allExceptSchool","schoolOnly"];
			var affilitedSelectionTypeArr = ["selfOnly","allSub","resrictP","pickASSAC"];

			var eventList = [];
			var filterEventList =  [];
			var errorMsg = [];

			var eventNameValid = false;
			var eventStartDateValid = false;
			var eventEndDateValid = false;
			var eventSubscriptionLastDateValid = false;
			var projectIdValid = false;
			var eventOrganizerValid = false;
			var domainIdValid = false;
			var subEventsValid = false;
			var subEventsFilterValid = false;
			var selectionTypeValid = false;
			var subscriptionTypeDirectValid = false;
			var subscriptionTypeMailValid = false;
			var subscriptionTypeHyperValid = false;
			var hyperLinkValueValid = false; 
			var paymentEntryValid = false;

			var tourNameMsg = "Tournament Name is mandatory";
			var tourStartDateMsg = "Tournament Start Date is mandatory and format should be YYYY MMM DD";
			var tourEndDateMsg = "Tournament End Date is mandatory and format should be YYYY MMM DD";
			var tourLastDateMsg = "Tournament Subsciption Date is mandatory and format should be YYYY MMM DD";
			var tourDomainMsg = "Domain selection mandatory/Invalid domain";
			var tourSportMsg = "Invalid tournament sport";
			var tourOrganizerMsg = "Invalid tournament organizer";
			var tourCategoryMsg ="Tournament Categories are empty";
			var tourSelectionTypeMsg = "Possible Tournament selection are ";
			var tourPaymentOptionMsg = "Tournament payment option can be mandatory/optional/none"
			var iPlayOnSubMsg = "Subscribe On iPlayOn or Redirect to Hyperlink mandatory";
			var subMailMsg = "Invalid Subsciption Mail ID";
			var redirectMsg = "Invalid hyper link";
			var tourEventFilterMsg = "Tournament Category filters are empty";
			var subscriptionMsg = "Invalid subscription selection";
			var redirectSelectionMsg = "Invalid Redirect to Hyperlink selection";
			var categoryFilterMsg ="Event Categories need to have ranking/dateOfBirth to subscribe";
			var tourEndDateValidMsg = "Tournament End Date should be equal or greater than tournament start date";
			var tourStartDateValidMsg = "Tournament Start Date should be equal or greater than  subscription date";
			var categoryDateMsg = "start date and end date should be within the tournament start and end date range";
			var subscriptionMailMsg = "Mailing selection mandatory"
					
			if(data.eventName && data.eventName != undefined && data.eventName != null &&
				data.eventName.trim().length > 0)	
				eventNameValid = true;
			
			if(data.eventStartDate)	
				eventStartDateValid = moment(data.eventStartDate, "YYYY MMM DD", true).isValid(); 
				
			if(data.eventEndDate)	
				eventEndDateValid = moment(data.eventEndDate, "YYYY MMM DD", true).isValid(); 
			
			if(data.eventSubscriptionLastDate)
				eventSubscriptionLastDateValid = moment(data.eventSubscriptionLastDate, "YYYY MMM DD", true).isValid(); 
		
			if(data.domainId)
			{
				var  objCheck = Match.test(data.domainId, [String]);
				if(objCheck && data.domainId.length > 0)
				{
					var domainInfo = domains.findOne({"_id":data.domainId[0]});
					if(domainInfo)
					{
						data.domainName = domainInfo.domainName;
						domainIdValid = true;
					}
				}
			}

			if(data.projectId)
			{
				var objCheck = Match.test(data.projectId, [String]);
				if(objCheck && data.projectId.length > 0)
				{				
					var sportInfo = tournamentEvents.findOne({"_id":data.projectId[0]});
					if(sportInfo)
					{
						data.projectName = sportInfo.projectMainName;
						projectIdValid = true;
					}
				}
			}

			if(data.eventOrganizer)
			{
				var  objCheck = Match.test(data.eventOrganizer, String);
				if(objCheck)
				{
					var checkUser = Meteor.users.findOne({"userId":data.eventOrganizer});
					if(checkUser)
						eventOrganizerValid = true;
				}
			}


			if(eventNameValid == false)
				errorMsg.push(tourNameMsg);
			if(eventStartDateValid == false)
				errorMsg.push(tourStartDateMsg);
			if(eventEndDateValid == false)
				errorMsg.push(tourEndDateMsg);
			if(eventSubscriptionLastDateValid == false)
				errorMsg.push(tourLastDateMsg)
			if(domainIdValid == false)
				errorMsg.push(tourDomainMsg);
			if(projectIdValid == false)
				errorMsg.push(tourSportMsg);
			if(eventOrganizerValid == false)
				errorMsg.push(tourOrganizerMsg);

			var tourSubDate = "";
			var tourStartDate = "";
			var tourEndDate = "";
			if(eventSubscriptionLastDateValid && eventStartDateValid && eventEndDateValid)
			{
				tourSubDate = moment(new Date(data.eventSubscriptionLastDate)).format("YYYY-MM-DD")
				tourStartDate = moment(new Date(data.eventStartDate)).format("YYYY-MM-DD")
				tourEndDate = moment(new Date(data.eventEndDate)).format("YYYY-MM-DD")

				if(tourStartDate < tourSubDate)
					errorMsg.push(tourStartDateValidMsg)

				if(tourStartDate > tourEndDate)         
					errorMsg.push(tourEndDateValidMsg)
			}

			if(data.selectionType != undefined && data.selectionType != null)
			{
				if(eventOrganizerValid == true)
				{
					var checkUser = Meteor.users.findOne({"userId":data.eventOrganizer});
					if(checkUser)
					{
						if(checkUser.role == "Association" && checkUser.associationType == "State/Province/Country")
						{
							//console.log("state association entered")
							var pos = genericSelectionTypeArr.indexOf(data.selectionType);
							if(pos > -1)						
								selectionTypeValid = true;								
							else							
								errorMsg.push(tourSelectionTypeMsg+" "+genericSelectionTypeArr.toString());														
						}
						else if(checkUser.role == "Association" && checkUser.associationType == "District/City")
						{
							var assocInfo = associationDetails.findOne({"userId":data.eventOrganizer})
							if(assocInfo && assocInfo.associationType == "District/City")
							{

								if(assocInfo.affiliatedTo == "other" )
								{
									//console.log("DA other")
									var pos = genericSelectionTypeArr.indexOf(data.selectionType);
									if(pos > -1)	
									{
										selectionTypeValid = true;	


									}					
									else							
										errorMsg.push(tourSelectionTypeMsg+" "+genericSelectionTypeArr.toString());														

								}
								else if(assocInfo.affiliatedTo == "stateAssociation")
								{
									//console.log("DA stateAssociation")

									var pos = affilitedSelectionTypeArr.indexOf(data.selectionType);
									if(pos > -1)
									{
																
										if(data.selectionType == "pickASSAC")	
										{
											if(data.selectedIds)
											{	
												var uniqSelectedIdArr = _.uniq(data.selectedIds);
												data.selectedIds = _.uniq(data.selectedIds);
							
												var selectedIdsInfo  = associationDetails.find({
													"parentAssociationId" : assocInfo.parentAssociationId,
													"affiliatedTo" :"stateAssociation",
													"userId":{ "$in": uniqSelectedIdArr }}).fetch()
												
												if(selectedIdsInfo && (selectedIdsInfo.length == uniqSelectedIdArr.length))
												{
													selectionTypeValid = true;
													//console.log("valid district Association are picked")
												}
												else
												{
													errorMsg.push("Invalid district associations are picked")
												}
											}
											else
											{
												errorMsg.push("Invalid district associations are picked")
											}
										}
									}						
									else							
										errorMsg.push(tourSelectionTypeMsg+" "+affilitedSelectionTypeArr.toString());
								}
							}

						}
						else if(checkUser.role == "Academy")
						{
							//console.log("entered academy check")
							var academyInfo = academyDetails.findOne({"userId":data.eventOrganizer})
							if(academyInfo)
							{
								if(academyInfo.affiliatedTo == "other" )
								{			
									//console.log("academy affiliated to other")								
									var pos = genericSelectionTypeArr.indexOf(data.selectionType);
									if(pos > -1)						
										selectionTypeValid = true;								
									else							
										errorMsg.push(tourSelectionTypeMsg+" "+genericSelectionTypeArr.toString());														
								}
								else if (academyInfo.affiliatedTo == "districtAssociation")
								{
									var pos = affilitedSelectionTypeArr.indexOf(data.selectionType);
									if(pos > -1)
									{
										if(data.selectionType == "pickASSAC")	
										{
											if(data.selectedIds)
											{	
												var uniqSelectedIdArr = _.uniq(data.selectedIds);
												data.selectedIds = _.uniq(data.selectedIds);
							
												var selectedIdsInfo  = academyDetails.find({
													"associationId":academyInfo.associationId,
													"parentAssociationId" : academyInfo.parentAssociationId,
													"affiliatedTo" :"districtAssociation",
													"userId":{ "$in": uniqSelectedIdArr }}).fetch()
												
												if(selectedIdsInfo && (selectedIdsInfo.length == uniqSelectedIdArr.length))
												{
													selectionTypeValid = true;
													//console.log("valid districtAssociation affiliated academies picked")

												}
												else
												{
													errorMsg.push("Invalid district association affiliated academies are picked")
												}
											}
											else
											{
												errorMsg.push("Invalid district association affiliated academies are picked")
											}
										}
									}						
									else							
										errorMsg.push(tourSelectionTypeMsg+" "+affilitedSelectionTypeArr.toString());
								}
								else if(academyInfo.affiliatedTo == "stateAssociation")
								{
									var pos = affilitedSelectionTypeArr.indexOf(data.selectionType);
									if(pos > -1)
									{
										if(data.selectionType == "pickASSAC")	
										{
											if(data.selectedIds)
											{	
												var uniqSelectedIdArr = _.uniq(data.selectedIds);
												data.selectedIds = _.uniq(data.selectedIds);
							
												var selectedIdsInfo  = academyDetails.find({
													"associationId" : academyInfo.associationId,
													"affiliatedTo" :"stateAssociation",
													"userId":{ "$in": uniqSelectedIdArr }}).fetch()
												
												if(selectedIdsInfo && (selectedIdsInfo.length == uniqSelectedIdArr.length))
												{
													selectionTypeValid = true;
													//console.log("valid stateAssociation affiliated academies picked")
												}
												else
												{
													errorMsg.push("Invalid stateAssociation affiliated academies are picked")
												}
											}
											else
											{
												errorMsg.push("Invalid stateAssociation affiliated academies are picked")
											}
										}
									}						
									else							
										errorMsg.push(tourSelectionTypeMsg+" "+affilitedSelectionTypeArr.toString());
									
								}
							}
						}
						else if(checkUser.role == "Organiser")
						{
							var pos = organizerSelectionTypeArr.indexOf(data.selectionType);
							if(pos > -1)						
								selectionTypeValid = true;								
							else							
								errorMsg.push(tourSelectionTypeMsg+" "+organizerSelectionTypeArr.toString());														
						}
					}
				}
				else
				{
					var pos = selectionTypeArr.indexOf(data.selectionType);
					if(pos > -1)
					{		
						selectionTypeValid = true;	
					}
				}
				
				
			}

			if(data.subEvents == undefined || data.subEvents == null)
				errorMsg.push(tourCategoryMsg);
			if(projectIdValid && data.subEvents && data.subEvents != undefined && data.subEvents != null && data.subEvents.length > 0)
			{
				if(data.subEvents.length == 0)
					errorMsg.push(tourCategoryMsg);
				else
				{
					for(var i=0 ;i <data.subEvents.length ; i++)
					{
						var eventCategory = data.subEvents[i];
						var objCheck = Match.test(eventCategory, { eventId: String, 
							prize: String,projectType:String,eventName:String,eventEndDate:String, eventStartDate:String});
						//console.log("eventCategory check "+objCheck)
						if(objCheck)
						{
							var sportInfo = tournamentEvents.aggregate([
			                    {$match:{
			                        "_id":data.projectId[0]
			                    }},   
			                    {$unwind:"$projectSubName"},
						        {$match: { 
						        	"projectSubName._id":eventCategory.eventId.trim(),
						        	"projectSubName.projectName":eventCategory.eventName.trim(),
						        	"projectSubName.projectType":eventCategory.projectType			        
						        }}           
			                    
		                	]);
		                	if(sportInfo && sportInfo.length > 0)
		                	{

		                		var categoryStartDateValid = moment(eventCategory.eventStartDate, "YYYY MMM DD", true).isValid(); 
		                		var categoryEndDateValid = moment(eventCategory.eventEndDate, "YYYY MMM DD", true).isValid(); 
		                		if(categoryStartDateValid == false || categoryEndDateValid == false)
		                		{
		                			if(categoryStartDateValid == false && categoryEndDateValid == false)
		                				errorMsg.push("Category "+eventCategory.eventName+" invalid start date and end date")
		                			else if(categoryStartDateValid == false)
		                				errorMsg.push("Category "+eventCategory.eventName+" invalid start date")
		                			else if(categoryEndDateValid == false)
		                				errorMsg.push("Category "+eventCategory.eventName+" invalid end date")

		                		}
		                		else
		                		{
		                			if(eventSubscriptionLastDateValid && eventStartDateValid && eventEndDateValid)
					                {

					                	var categorySD = moment(new Date(eventCategory.eventStartDate)).format("YYYY-MM-DD");
					                	var categoryED = moment(new Date(eventCategory.eventEndDate)).format("YYYY-MM-DD");
					                	var categoryValidCheck = true;

					                	if(categorySD < tourStartDate || categorySD > tourEndDate ||categoryED < tourStartDate || categoryED > tourEndDate){
					                		categoryValidCheck = false;
					                		errorMsg.push("Category "+eventCategory.eventName+" "+categoryDateMsg);
					                	}
			                		
					                	if(categorySD > categoryED){
					                		categoryValidCheck = false;
					                		errorMsg.push("Category "+eventCategory.eventName+" start date cannot be greater than end date");
					                	}

					                	if(categoryValidCheck){
					                		//console.log("add event "+eventCategory.eventId.trim())
		                					eventList.push(eventCategory.eventId.trim());
					                	}
					                	

				                	}

		                			
		                		}
		                	}
		                	else
		                	{
		                		errorMsg.push("Invalid category "+eventCategory.eventName)
		                	}
						}
					}
				}
				
			}

			if(data.subEventsFilters == undefined || data.subEventsFilters == null)
				errorMsg.push(tourEventFilterMsg);

			if(projectIdValid && data.subEventsFilters && data.subEventsFilters != undefined && data.subEventsFilters != null && data.subEventsFilters.length > 0)
			{
				if(data.subEventsFilters.length == 0)
					errorMsg.push(tourEventFilterMsg);
				else
				{
					for(var i=0 ;i <data.subEventsFilters.length ; i++)
					{
						var eventCategory = data.subEventsFilters[i];
						var objCheck = Match.test(eventCategory, { ranking: String, 
							eventId: String,gender:String,dateOfBirth:String});
						//console.log("eventCategory filter check "+objCheck)
						if(objCheck)
						{
							var sportInfo = tournamentEvents.aggregate([
			                    {$match:{
			                        "_id":data.projectId[0]
			                    }},   
			                    {$unwind:"$projectSubName"},
						        {$match: { 
						        	"projectSubName._id":eventCategory.eventId.trim(),
						        }},
						        {$group:{
					        		"_id":"$projectSubName._id",
			    					"projectSubName":{$push:"$projectSubName"},
					        	}}          	                    
		                	]);
		                	//console.log("filter info ... "+JSON.stringify(sportInfo))
		                	if(sportInfo && sportInfo.length > 0 && sportInfo[0].projectSubName && sportInfo[0].projectSubName.length > 0)
		                	{
		                		var categoryData = sportInfo[0].projectSubName[0];
		                		var genderValid = false;
		                		//console.log(eventCategory.gender+" .......... "+categoryData.gender)
		                		if(eventCategory.gender.trim() == categoryData.gender)
		                			genderValid = true;
		                		var dobValid = moment(eventCategory.dateOfBirth, "YYYY MMM DD", true).isValid(); 
		                		var rankingValid = false;
		                		if(eventCategory.ranking != "yes" && eventCategory.ranking != "no")
		                			rankingValid = false;
		                		else
		                			rankingValid = true;

		                		if(dobValid == false || rankingValid == false || genderValid == false)
		                		{	
		                			var filterMsg = "Category "+categoryData.projectSubName+" has invalid ";
		                			//console.log("rankingValid .."+rankingValid)
		                			if(genderValid == false)
		                				filterMsg += "gender,"
		                			if(rankingValid == false && dobValid == false)                			
		                				filterMsg += "ranking and dateOfBirth date "
		                			else if(rankingValid == false)
		                				filterMsg += "ranking option "
		                			else if(dobValid == false)
		                				filterMsg += "dateOfBirth date "

		                			errorMsg.push(filterMsg);
		                		}
		                		else
		                		{
		                			filterEventList.push(eventCategory.eventId.trim())
		                		}
		                	}
		                	else
		                	{
		                		errorMsg.push("Invalid category")
		                	}
						}
					}
				}
				
			}

		
			if(data.subscriptionTypeMail)
			{
				if(data.subscriptionTypeMail == "1" && data.subscriptionTypeMailValue)
				{	
	    			if(regexEmail.test(data.subscriptionTypeMailValue))
	    				subscriptionTypeMailValid = true;   
	    			else
	    				errorMsg.push(subMailMsg); 			
				}
				else if(data.subscriptionTypeMail == "0")
					subscriptionTypeMailValid = true;
			}

			if(data.subscriptionTypeHyper)
			{
				if(data.subscriptionTypeHyper == "1")
				{	
					if(data.hyperLinkValue && data.hyperLinkValue.length > 0)
						hyperLinkValueValid = true;
					else
						errorMsg.push(redirectMsg);
				}
				else if(data.subscriptionTypeHyper == "0")
					hyperLinkValueValid = true;
			}


			if(data.subscriptionTypeDirect != undefined && data.subscriptionTypeDirect != null && (data.subscriptionTypeDirect ==  "0" || data.subscriptionTypeDirect == "1"))
				subscriptionTypeDirectValid = true;

			if(data.subscriptionTypeHyper != undefined && data.subscriptionTypeHyper != null && (data.subscriptionTypeHyper ==  "0" || data.subscriptionTypeHyper == "1"))
				subscriptionTypeHyperValid = true;

			if(data.subscriptionTypeHyper != undefined && data.subscriptionTypeHyper != null && data.subscriptionTypeHyper ==  "0"  && data.subscriptionTypeDirect != undefined && data.subscriptionTypeDirect != null && data.subscriptionTypeDirect ==  "0")
			{
				subscriptionTypeDirectValid = false;
				subscriptionTypeHyperValid = false;
			}

			if(subscriptionTypeDirectValid == false && subscriptionTypeHyperValid == false)
				errorMsg.push(iPlayOnSubMsg);
			else if(subscriptionTypeDirectValid == false)
				errorMsg.push(subscriptionMsg);
			else if(subscriptionTypeHyperValid == false)
				errorMsg.push(redirectSelectionMsg);
			if(data.paymentEntry)
			{
				if(data.paymentEntry.trim() == "yes" || data.paymentEntry.trim() == "no" || data.paymentEntry.trim() == "optional")
					paymentEntryValid =true;
				else
					errorMsg.push(tourPaymentOptionMsg);
			}	
			else{
				data.paymentEntry = "no";
				paymentEntryValid = true;
			}


		
			eventList= _.uniq(eventList);
			filterEventList= _.uniq(filterEventList);

			if(eventList.length == filterEventList.length)
			{
				var diff1 = _.difference(eventList, filterEventList);
				var diff2 = _.difference(filterEventList, eventList);
				if(diff1.length != 0 && diff2.length != 0)
				{
					errorMsg.push(categoryFilterMsg)

				}
			}
			else
			{
				errorMsg.push(categoryFilterMsg)
			}

			//console.log("errorMsg .. "+JSON.stringify(errorMsg));

			if(errorMsg.length > 0)
			{
				//console.log("contains errors");
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["errorMsg"] = errorMsg;
				resultJson["message"] = "Could not create tournament";
				return resultJson;
			}
			else
			{
				if(data.venueLatitude == undefined || data.venueLatitude == null)
					data.venueLatitude = "0";
				if(data.venueLongitude == undefined || data.venueLongitude == null)
					data.venueLongitude = "0";
				if(data.timezoneIdEventLat == undefined || data.timezoneIdEventLat == null)
					data.timezoneIdEventLat = "0";
				if(data.timezoneIdEventLng == undefined || data.timezoneIdEventLng == null)
					data.timezoneIdEventLng = "0";
				if(data.description == undefined || data.description == null)
					data.description = "";
				if(data.sponsorLogo == undefined || data.sponsorLogo == null)
					data.sponsorLogo = "";	
				if(data.sponsorUrl == undefined || data.sponsorUrl == null)
					data.sponsorUrl = "";	
				if(data.sponsorPdf == undefined || data.sponsorPdf == null)
					data.sponsorPdf = "";	
				if(data.rulesAndRegulations == undefined || data.rulesAndRegulations == null)
					data.rulesAndRegulations = "";

			



				var selectionJson = {"selectionType":data.selectionType};
				var rankJson = {};
				rankJson["arrayToSave"] = data.subEventsFilters;
				rankJson["mainProjectId"] = data.projectId[0];
				rankJson["eventOrganizer"] = data.eventOrganizer;
							//console.log("continue code")

				var result = await Meteor.call("insertEvents",data,selectionJson,rankJson);
				//console.log("result .. "+JSON.stringify(result));
				if(result)
				{
					var tournamentID = result;

					events.update({$or:[{"_id":tournamentID},{"tournamentId":tournamentID}]},{$set:{"source":data.source}},{multi:true});
					var dbColl = {};
					dbColl["events"] = events.find({$or:[{"_id":tournamentID},{"tournamentId":tournamentID}]}).fetch();
					dbColl["calenderEvents"] = calenderEvents.find({"_id":tournamentID}).fetch();
					dbColl["scrollableevents"] = scrollableevents.find({"_id":tournamentID}).fetch();
					dbColl["myUpcomingEvents"] = myUpcomingEvents.find({"_id":tournamentID}).fetch();
					dbColl["eventFeeSettings"] = eventFeeSettings.find({"tournamentId":tournamentID}).fetch();
					dbColl["subscriptionRestrictions"] = subscriptionRestrictions.find({"tournamentId":tournamentID}).fetch();
					dbColl["dobFilterSubscribe"] = dobFilterSubscribe.find({"tournamentId":tournamentID}).fetch();
						
					var resultJson = {};
					resultJson["status"] = "success";
					resultJson["dbColl"] = dbColl;
					resultJson["message"] = "Tournament Created";

					//console.log("resultJson ... "+JSON.stringify(resultJson));
					return resultJson;

					
					/*else
					{
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["message"] = "Could not create tournament";
						return resultJson;
					}*/
				}
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Could not create tournament";
					return resultJson;
				}

			}

		}catch(e){
			//console.log("jjh      "+e)
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not create tournament "+e;
			return resultJson;
		}


	},
	
	"fetchTourDetails":async function(data)
	{
		try{
			if(data && data.tournamentId)
			{
				var tourInfo = events.findOne({"tournamentEvent":true,"_id":data.tournamentId});
				if(tourInfo)
				{
					var tournamentID = data.tournamentId;
					var dbColl = {};
					dbColl["events"] = events.find({$or:[{"_id":tournamentID},{"tournamentId":tournamentID}]}).fetch();
					//dbColl["calenderEvents"] = calenderEvents.find({"_id":tournamentID}).fetch();
					//dbColl["scrollableevents"] = scrollableevents.find({"_id":tournamentID}).fetch();
					//dbColl["myUpcomingEvents"] = myUpcomingEvents.find({"_id":tournamentID}).fetch();
					//dbColl["eventFeeSettings"] = eventFeeSettings.find({"tournamentId":tournamentID}).fetch();
					dbColl["subscriptionRestrictions"] = subscriptionRestrictions.find({"tournamentId":tournamentID}).fetch();
					dbColl["dobFilterSubscribe"] = dobFilterSubscribe.find({"tournamentId":tournamentID}).fetch();
									
					var resultJson = {};
					resultJson["status"] = "success";
					resultJson["dbColl"] = dbColl;
					resultJson["message"] = "Tournament Created";

					//console.log("fetchtourdetails resultJson ... "+JSON.stringify(resultJson));
					return resultJson;
				}	
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Invalid tournament details";
					return resultJson;
				}
			}
			else
			{
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["message"] = "Require all parameters";
				return resultJson;
			}

		}catch(e){
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament details"+e;
			return resultJson;
		}
	},

	"modifyTour":async function(data){
		try{
			
			////console.log("entered modifyTour .. "+JSON.stringify(data))
			if(data && data.tournamentId)
			{
				var tourInfo = events.findOne({"tournamentEvent":true,"_id":data.tournamentId});
				if(tourInfo)
				{
					data.eventId = data.tournamentId;
					var errorMsg = [];


					var eventNameValid = false;
					var eventStartDateValid = false;
					var eventEndDateValid = false;
					var eventSubscriptionLastDateValid = false;
					var domainIdValid = false;
					var subEventsValid = false;
					var selectionTypeValid = false;
					var subscriptionTypeDirectValid = false;
					var subscriptionTypeMailValid = false;
					var subscriptionTypeHyperValid = false;
					var hyperLinkValueValid = false; 

					var tourNameMsg = "Tournament Name is mandatory";
					var tourStartDateMsg = "Tournament Start Date is mandatory and format should be YYYY MMM DD";
					var tourEndDateMsg = "Tournament End Date is mandatory and format should be YYYY MMM DD";
					var tourLastDateMsg = "Tournament Subsciption Date is mandatory and format should be YYYY MMM DD";
					var tourDomainMsg = "Domain selection mandatory/Invalid domain";
					var iPlayOnSubMsg = "Subscribe On iPlayOn or Redirect to Hyperlink mandatory";
					var subMailMsg = "Invalid Subsciption Mail ID";
					var redirectMsg = "Invalid hyper link";
					var subscriptionMsg = "Invalid subscription selection";
					var redirectSelectionMsg = "Invalid Redirect to Hyperlink selection";
					var tourCategoryMsg = "Invalid category format";
					var tourEndDateValidMsg = "Tournament End Date should be equal or greater than tournament start date";
					var tourStartDateValidMsg = "Tournament Start Date should be equal or greater than  subscription date";
					var categoryDateMsg = "start date and end date should be within the tournament start and end date range";
					var subscriptionMailMsg = "Mailing selection mandatory"
					

					var organizerInfo = Meteor.users.findOne({"userId":tourInfo.eventOrganizer});
					data.subscriptionTypeMailValue = organizerInfo.emailAddress;

					if(data.eventName && data.eventName != undefined && data.eventName != null &&
						data.eventName.trim().length > 0)	
						eventNameValid = true;
			
					if(data.eventStartDate)	
						eventStartDateValid = moment(data.eventStartDate, "YYYY MMM DD", true).isValid(); 
						
					if(data.eventEndDate)	
						eventEndDateValid = moment(data.eventEndDate, "YYYY MMM DD", true).isValid(); 
					
					if(data.eventSubscriptionLastDate)
						eventSubscriptionLastDateValid = moment(data.eventSubscriptionLastDate, "YYYY MMM DD", true).isValid(); 
		
					if(data.domainId)
					{
						var  objCheck = Match.test(data.domainId, [String]);
						if(objCheck && data.domainId.length > 0)
						{
							var domainInfo = domains.findOne({"_id":data.domainId[0]});
							if(domainInfo)
							{
								data.domainName = domainInfo.domainName;
								domainIdValid = true;
							}
						}
					}

			

					if(eventNameValid == false)
						errorMsg.push(tourNameMsg);
					if(eventStartDateValid == false)
						errorMsg.push(tourStartDateMsg);
					if(eventEndDateValid == false)
						errorMsg.push(tourEndDateMsg);
					if(eventSubscriptionLastDateValid == false)
						errorMsg.push(tourLastDateMsg)
					if(domainIdValid == false)
						errorMsg.push(tourDomainMsg);

					var tourSubDate = "";
					var tourStartDate = "";
					var tourEndDate = "";
					if(eventSubscriptionLastDateValid && eventStartDateValid && eventEndDateValid)
					{
						tourSubDate = moment(new Date(data.eventSubscriptionLastDate)).format("YYYY-MM-DD")
						tourStartDate = moment(new Date(data.eventStartDate)).format("YYYY-MM-DD")
						tourEndDate = moment(new Date(data.eventEndDate)).format("YYYY-MM-DD")

						if(tourStartDate < tourSubDate)
							errorMsg.push(tourStartDateValidMsg)

						if(tourStartDate > tourEndDate)         
							errorMsg.push(tourEndDateValidMsg)
					}

					



					
					if(data.subEvents && data.subEvents != undefined && data.subEvents != null && data.subEvents.length > 0)
					{
						
						
							for(var i=0 ;i <data.subEvents.length ; i++)
							{
								var eventCategory = data.subEvents[i];
								var objCheck = Match.test(eventCategory, { eventId: String, 
									 eventStartDate:String,eventEndDate:String});
								////console.log("eventCategory check "+objCheck)
								if(objCheck)
								{
									var sportInfo = tournamentEvents.aggregate([
					                    {$match:{
					                        "_id":tourInfo.projectId[0]
					                    }},   
					                    {$unwind:"$projectSubName"},
								        {$match: { 
								        	"projectSubName._id":eventCategory.eventId.trim(),
								        }},         
					                    {$group:{
					        				"_id":"$projectSubName._id",
			    							"projectSubName":{$push:"$projectSubName"},
					        			}}  
				                	]);
				                	if(sportInfo && sportInfo.length > 0)
				                	{
		                				var categoryData = sportInfo[0].projectSubName[0];
		                				////console.log("categoryData .. "+JSON.stringify(categoryData))
				                		var categoryStartDateValid = moment(eventCategory.eventStartDate, "YYYY MMM DD", true).isValid(); 
				                		var categoryEndDateValid = moment(eventCategory.eventEndDate, "YYYY MMM DD", true).isValid(); 
				                		if(categoryStartDateValid == false || categoryEndDateValid == false)
				                		{
				                			if(categoryStartDateValid == false && categoryEndDateValid == false)
				                				errorMsg.push("Category "+categoryData.projectName+" invalid start date and end date")
				                			else if(categoryStartDateValid == false)
				                				errorMsg.push("Category "+categoryData.projectName+" invalid start date")
				                			else if(categoryEndDateValid == false)
				                				errorMsg.push("Category "+categoryData.projectName+" invalid end date")

				                			

				                		}
				                		else
				                		{
				                			//console.log("hello")
				                			//console.log("start date  .. "+moment(new Date(eventCategory.eventStartDate)).format("YYYY-MM-DD"))
				                			
											if(eventSubscriptionLastDateValid && eventStartDateValid && eventEndDateValid)
					                		{

					                			var categorySD = moment(new Date(eventCategory.eventStartDate)).format("YYYY-MM-DD");
					                			var categoryED = moment(new Date(eventCategory.eventEndDate)).format("YYYY-MM-DD");

					                			if(categorySD < tourStartDate || categorySD > tourEndDate ||categoryED < tourStartDate || categoryED > tourEndDate)
					                				errorMsg.push("Category "+categoryData.projectName+" "+categoryDateMsg);
			                		
					                			if(categorySD > categoryED)
					                				errorMsg.push("Category "+categoryData.projectName+" start date cannot be greater than end date");


				                			} 	

				                		}
				                		
				                	}
				                	else
				                	{
				                		errorMsg.push("Invalid category "+eventCategory.eventId)
				                	}
								}
								else
								{
									errorMsg.push(tourCategoryMsg+" .. "+eventCategory.eventId)
								}
							}
						
						
					}

			
					if(data.subscriptionTypeMail)
					{
						if(data.subscriptionTypeMail == "1" && data.subscriptionTypeMailValue)
						{	
			    			if(regexEmail.test(data.subscriptionTypeMailValue))
			    				subscriptionTypeMailValid = true;   
			    			else
			    				errorMsg.push(subMailMsg); 			
						}
						else if(data.subscriptionTypeMail == "0")
							subscriptionTypeMailValid = true;
					}

					if(data.subscriptionTypeHyper)
					{
						if(data.subscriptionTypeHyper == "1")
						{	
							if(data.hyperLinkValue && data.hyperLinkValue.length > 0)
								hyperLinkValueValid = true;
							else
								errorMsg.push(redirectMsg);
						}
						else if(data.subscriptionTypeDirect == "1" && data.subscriptionTypeHyper == "0")
							hyperLinkValueValid = false;
					}


					if(data.subscriptionTypeDirect != undefined && data.subscriptionTypeDirect != null && (data.subscriptionTypeDirect ==  "0" || data.subscriptionTypeDirect == "1"))
						subscriptionTypeDirectValid = true;

					if(data.subscriptionTypeHyper != undefined && data.subscriptionTypeHyper != null && (data.subscriptionTypeHyper ==  "0" || data.subscriptionTypeHyper == "1"))
						subscriptionTypeHyperValid = true;

					if(data.subscriptionTypeHyper != undefined && data.subscriptionTypeHyper != null && data.subscriptionTypeHyper ==  "0"  && data.subscriptionTypeDirect != undefined && data.subscriptionTypeDirect != null && data.subscriptionTypeDirect ==  "0")
					{
						subscriptionTypeDirectValid = false;
						subscriptionTypeHyperValid = false;
					}

					if(subscriptionTypeDirectValid == false && subscriptionTypeHyperValid == false)
						errorMsg.push(iPlayOnSubMsg);
					else if(subscriptionTypeDirectValid == false)
						errorMsg.push(subscriptionMsg);
					else if(subscriptionTypeHyperValid == false)
						errorMsg.push(redirectSelectionMsg);
					else if(subscriptionTypeDirectValid == true &&  subscriptionTypeMailValid == false)
						errorMsg.push(subscriptionMailMsg)
					

					if(errorMsg.length > 0)
					{
						//console.log("contains errors");
						var resultJson={};
						resultJson["status"] = "failure";
						resultJson["errorMsg"] = errorMsg;
						resultJson["message"] = "Could not modify tournament";
						return resultJson;
					}
					else
					{
							if(data.venueLatitude == undefined || data.venueLatitude == null)
								data.venueLatitude = "0";
							if(data.venueLongitude == undefined || data.venueLongitude == null)
								data.venueLongitude = "0";
							if(data.timezoneIdEventLat == undefined || data.timezoneIdEventLat == null)
								data.timezoneIdEventLat = "0";
							if(data.timezoneIdEventLng == undefined || data.timezoneIdEventLng == null)
								data.timezoneIdEventLng = "0";
							if(data.description == undefined || data.description == null)
								data.description = "";

							if(data.sponsorLogo == undefined || data.sponsorLogo == null)
								data.sponsorLogo = "";	
							if(data.sponsorUrl == undefined || data.sponsorUrl == null)
								data.sponsorUrl = "";	
							if(data.sponsorPdf == undefined || data.sponsorPdf == null)
								data.sponsorPdf = "";	
							if(data.rulesAndRegulations == undefined || data.rulesAndRegulations == null)
								data.rulesAndRegulations = "";

					

					
							//console.log("continue code")

							var result = await Meteor.call("updateEvents",data,true);
							//console.log("result .. "+JSON.stringify(result));
							if(result)
							{
								var tournamentID = data.tournamentId;

								var dbColl = {};
								dbColl["events"] = events.find({$or:[{"_id":tournamentID},{"tournamentId":tournamentID}]}).fetch();
								dbColl["calenderEvents"] = calenderEvents.find({"_id":tournamentID}).fetch();
								dbColl["scrollableevents"] = scrollableevents.find({"_id":tournamentID}).fetch();
								dbColl["myUpcomingEvents"] = myUpcomingEvents.find({"_id":tournamentID}).fetch();
								dbColl["eventFeeSettings"] = eventFeeSettings.find({"tournamentId":tournamentID}).fetch();
								dbColl["subscriptionRestrictions"] = subscriptionRestrictions.find({"tournamentId":tournamentID}).fetch();
								dbColl["dobFilterSubscribe"] = dobFilterSubscribe.find({"tournamentId":tournamentID}).fetch();
									
								var resultJson = {};
								resultJson["status"] = "success";
								resultJson["dbColl"] = dbColl;
								resultJson["message"] = "Tournament Created";

								//console.log("resultJson ... "+JSON.stringify(resultJson));
								return resultJson;

								
							}
							else
							{
								var resultJson={};
								resultJson["status"] = "failure";
								resultJson["message"] = "Could not modify tournament";
								return resultJson;
							}
					}

					//ends here




				}
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Invalid tournament details";
					return resultJson;
				}
			}
			else
			{
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["message"] = "Require all parameters";
				return resultJson;
			}

			
		}catch(e){
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not modify tournament "+e;
			return resultJson;
		}
	},
	"deleteTour":async function(data)
	{
		try{
			if(data.tournamentId)
			{
				var tourInfo = events.findOne({
                	"_id": data.tournamentId
            	});
            	if(tourInfo)
            	{
            		var result = await Meteor.call("deleteEvents",data.tournamentId);
            		if(result)
            		{
            			var resultJson={};
						resultJson["status"] = "success";
						resultJson["message"] = "Tournament Deleted";
						return resultJson;
            		}   
            		else{
            			var resultJson={};
						resultJson["status"] = "failure";
						resultJson["message"] = "Could not delete tournament";
						return resultJson;
            		}         	
            	}
            	else
            	{
            		var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Invalid Tournament Details";
					return resultJson;
            	}
			}
			else
			{
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["message"] = "Require all parameters";
				return resultJson;
			}

		}catch(e){
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not delete tournament "+e;
			return resultJson;
		}
	}
})