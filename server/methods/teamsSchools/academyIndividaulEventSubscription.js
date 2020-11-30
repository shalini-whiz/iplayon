import {
    playerDBFind
}
from '../dbRequiredRole.js'
//userDetailsTTUsed

Meteor.methods({
	"individualEventsSubscriptionExternalAPI": async function(xData){
		try{
			var messageValidations = [];
			
			//check for valid tournament
			var eventDet = events.findOne({"_id":xData.tournamentId});
			
			if(eventDet){
				//check subscription type hyper link
				if (eventDet&&eventDet.subscriptionTypeHyper != null && eventDet.subscriptionTypeHyper !== undefined && eventDet.subscriptionTypeHyper == 1 && eventDet.hyperLinkValue) {
                	var message = "subscription type is hyper link.";
                	var resultJson = {};
	                resultJson["status"] = "success";     
	                resultJson["hyperLINK"] = true           
	                resultJson["response"] = message.toString();
	                resultJson["data"] = eventDet.hyperLinkValue;
	                return resultJson;
            	} 
            	else {
					//check for valid subscriberId
					var subscriberDet = Meteor.users.findOne({userId:xData.subscriberId});
				

					if(subscriberDet&&subscriberDet.role && subscriberDet.interestedProjectName
						&& subscriberDet.interestedProjectName.length){
						//check for valid subcriber role
						if(subscriberDet.role=="Player")
						{
							var dbn = playerDBFind(subscriberDet.interestedProjectName[0])
							if(dbn){
								toret = dbn
							}
							else {
								toret = "userDetailsTT"
							}
							//check valid player
							var playerDet = global[toret].findOne({userId:xData.subscriberId});

							if(playerDet){
								//call for subscritpion rest details
								var res = await Meteor.call("subscriptionRestrictionsFind", eventDet._id, eventDet.eventOrganizer)
								try{
									if(res){
										
										var subRest = res;
										//call for subscritpion restrictions check for players
										var resPlayer = await Meteor.call("playerSubscriptionTypesAPI",subRest,xData,eventDet,playerDet)
										try{
											if(resPlayer){
												messageValidations = resPlayer;
											} 
										}catch(e){
											var message = "Cannot subscribe"
								            var resultJson = {};
									        resultJson["status"] = "failure";                
									        resultJson["response"] = message.toString();
									        resultJson["data"] = false;
											messageValidations.push(resultJson);
										}
									} 
								}catch(e){
									var message = "Cannot subscribe"
								    var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
								}
							} else{
								var message = "subscriberId is not valid.";
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								messageValidations.push(resultJson);
							}
						} 
						else if(subscriberDet.role=="Association"){
							//check valid association
							var assocDet = associationDetails.findOne({userId:xData.subscriberId});
						
							if(assocDet){
								//call for subscritpion rest details
								var res = await Meteor.call("subscriptionRestrictionsFind", eventDet._id, eventDet.eventOrganizer)
								try{
									if(res){
									
										var subRest = res;
										//call for subscritpion restrictions check for association

										var resAssoc = await Meteor.call("associationSubscriptionTypesAPI",subRest,xData,eventDet,assocDet)
										try{											
											if(resAssoc){
												messageValidations = resAssoc;
											} 
										}catch(e){
											var message = "Cannot subscribe"
										    var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = message.toString();
											resultJson["data"] = false;
											messageValidations.push(resultJson);
										}
									}
								}catch(e){
									var message = "Cannot subscribe"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
								}
							} else{
								var message = "subscriberId is not valid.";
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								messageValidations.push(resultJson);							}
						}
						else if(subscriberDet.role=="Academy"){
							//check valid academy
							var acadDet = academyDetails.findOne({userId:xData.subscriberId});
							

							if(acadDet){
								//call for subscritpion rest details
								var res = await Meteor.call("subscriptionRestrictionsFind", eventDet._id, eventDet.eventOrganizer)
								try{
									if(res){
										var subRest = res;
										//call for subscritpion restrictions check for academy
										var resAcad = await Meteor.call("academySubscriptionTypesAPI",subRest,xData,eventDet,acadDet)
										try{
											if(resAcad){
												messageValidations = resAcad;
											}
										}catch(e){
											var message = "Cannot subscribe"
										    var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = message.toString();
											resultJson["data"] = false;
											messageValidations.push(resultJson);
										}
									}
								}catch(e){
									var message = "Cannot subscribe"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
								}
							} else{
								var message = "subscriberId is not valid.";
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								messageValidations.push(resultJson);	
							}
						}
						else{
							var message = "As "+subscriberDet.role+","+" you cannot subscribe";
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message.toString();
							resultJson["data"] = false;
							messageValidations.push(resultJson);	
						}
					}
					else{
						var message = "subscriberId is not valid.";
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						messageValidations.push(resultJson);	
					}
				}
			}
			else{
				var pastEve = pastEvents.findOne({"_id":xData.tournamentId});
				if(pastEve){
					var message = "Cannot subscribe to past tournament.";
	                var resultJson = {};
		            resultJson["status"] = "failure";                
		            resultJson["response"] = message.toString();
		            resultJson["data"] = false;
		            messageValidations.push(resultJson)
		            return messageValidations;
	        	}
	        	else{
	        		var message = "Tournament is not valid.";
	                var resultJson = {};
		            resultJson["status"] = "failure";                
		            resultJson["response"] = message.toString();
		            resultJson["data"] = false;
		            messageValidations.push(resultJson)
		            return messageValidations;
	        	}
			}
			return messageValidations
		}catch(e){
		}
	}
});

Meteor.methods({
	"playerSubscriptionTypesAPI":async function(subRest,xData,eventDetails,playerDet){
		try{
			var selectedType_sub = subRest.selectionType;
            var selectedIds_sub = subRest.selectedIds;
            var messageValidations = [];

            //if type is all 
            if (selectedType_sub == "all") {
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try{
            		if(res!=undefined){
            			var eveOrgDet = res;
            			var message = "Player is eligible to subscribe";
		                var resultJson = {};
			            resultJson["status"] = "success";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = true;
			            resultJson["routeValue"] = "subscribeToTournamemnt";
						messageValidations.push(resultJson)
            		}             		
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }
            		       	
	        	}catch(e){
	        		var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
					messageValidations.push(resultJson)
	        	}
            }
            //if type is self 
            else if (selectedType_sub == "self") {
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try {
            		if(res!=undefined){
            			var eveOrgDet = res;
            			if(eveOrgDet&&eveOrgDet.role=="Academy"){
							if (playerDet.clubNameId && playerDet.clubNameId != undefined && playerDet.clubNameId != "other") {
								if (playerDet.clubNameId == eveOrgDet.userId) {
									var message = "Player is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								} else{
									var message = "You are not eligible to subscribe,because your association/academy is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
									messageValidations.push(resultJson)
								}
							}
							else{
								var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
								messageValidations.push(resultJson)
							}            				
            			}
            			else if(eveOrgDet&&eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
            				if (playerDet.associationId && playerDet.associationId != undefined && playerDet.associationId != "other") {
								if (playerDet.associationId == eveOrgDet.userId) {
									var message = "Player is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								} else{
									var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
									messageValidations.push(resultJson)
								}
							}
							else{
								var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
								messageValidations.push(resultJson)
							}       
            			}
            			else if(eveOrgDet&&eveOrgDet.role=="Association"&&eveOrgDet.associationType == "State/Province/County"){
            				if ((playerDet.associationId && playerDet.associationId != undefined && playerDet.associationId != "other")||
            					(playerDet.parentAssociationId && playerDet.parentAssociationId != undefined && playerDet.parentAssociationId != "other")) {
								if ((playerDet.associationId == eveOrgDet.userId)||
									(playerDet.parentAssociationId == eveOrgDet.userId)) {
									var message = "Player is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								} else{
									var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
									messageValidations.push(resultJson)
								}
							}
							else{
								var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
								messageValidations.push(resultJson)
							} 
            			}
            		}            		
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }
            		            	
	        	}catch(e){
	        		var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
					messageValidations.push(resultJson)
	        	}
            }
            //if type is restrict 
            else if(selectedType_sub=="restrict"){
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try {
            		if(res!=undefined){
            			var eveOrgDet = res;
            			if(eveOrgDet&&eveOrgDet.role=="Academy"){
            				if (playerDet.clubNameId && playerDet.clubNameId != undefined && playerDet.clubNameId != "other") {
            					var playerClubDet = academyDetails.findOne({userId:playerDet.clubNameId,associationId:eveOrgDet.associationId})
								if (playerClubDet!=undefined) {
									var message = "Player is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								} else{
									var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
									messageValidations.push(resultJson)
								}
							}
							/*else if(playerDet.affiliatedTo=="stateAssociation"||playerDet.affiliatedTo=="districtAssociation"){
								if(playerDet.associationId == eveOrgDet.associationId){
									var message = "Player is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								}
								else{
									var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
									messageValidations.push(resultJson)
								}
							}*/
							else{
								var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
								messageValidations.push(resultJson)
							} 
            			}
            			else if(eveOrgDet&&eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
            				if(playerDet.associationId == eveOrgDet.userId || playerDet.associationId == eveOrgDet.parentAssociationId || playerDet.parentAssociationId == eveOrgDet.parentAssociationId){
            					var message = "Player is eligible to subscribe";
					            var resultJson = {};
						        resultJson["status"] = "success";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = true;
						        resultJson["routeValue"] = "subscribeToTournamemnt";
								messageValidations.push(resultJson)
            				}
            				else{
            					var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
								messageValidations.push(resultJson)
            				}
            			}
            			else if(eveOrgDet&&eveOrgDet.role=="Association"&&eveOrgDet.associationType == "State/Province/County"){
            			}
            		}
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }
            	}catch(e){
            		var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
			        messageValidations.push(resultJson)
            	}
            }
            //if type is pick
            else if ( selectedType_sub == "pick") {
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try {
            		if(res!=undefined){
            			var eveOrgDet = res;

            			if(eveOrgDet&&eveOrgDet.role=="Academy"){
							if (playerDet.clubNameId && playerDet.clubNameId != undefined && playerDet.clubNameId != "other") {
								if (_.contains(selectedIds_sub, playerDet.clubNameId)) {
									var message = "Player is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								} else{
									var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
									messageValidations.push(resultJson)
								}
							}
							else{
								var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
								messageValidations.push(resultJson)
							}             				
            			}
            			else if(eveOrgDet&&eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
            				if (playerDet.associationId && playerDet.associationId != undefined && playerDet.associationId != "other") {
								if (_.contains(selectedIds_sub, playerDet.associationId)) {
									var message = "Player is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								} else{
									var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
									messageValidations.push(resultJson)
								}
							} 
							else{
								var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
								messageValidations.push(resultJson)
							}       
            			}
            			else if(eveOrgDet&&eveOrgDet.role=="Association"&&eveOrgDet.associationType == "State/Province/County"){
            				if ((playerDet.associationId && playerDet.associationId != undefined && playerDet.associationId != "other")||
            					(playerDet.parentAssociationId && playerDet.parentAssociationId != undefined && playerDet.parentAssociationId != "other")) {
								if ((_.contains(selectedIds_sub, playerDet.associationId))||
									(_.contains(selectedIds_sub, playerDet.parentAssociationId))) {
									var message = "Player is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								} else{
									var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
						            resultJson["routeValue"] = "subscribeToTournamemnt";
									messageValidations.push(resultJson)
								}
							} 
							else{
								var message = "You are not eligible to subscribe, because your association/academy is not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
								messageValidations.push(resultJson)
							} 
            			}
            		}  
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }	            	
	        	}catch(e){
	        		var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
			        messageValidations.push(resultJson)
	        	}
            }
            //if type is school only
            else if(selectedType_sub == "schoolOnly"){
            	var message = "You are not authorized to subscribe";
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				messageValidations.push(resultJson)
			}
            //if type is allExceptSchool
            else if(selectedType_sub == "allExceptSchool"){
            	var message = "Player is eligible to subscribe";
				var resultJson = {};
				resultJson["status"] = "success";                
				resultJson["response"] = message.toString();
				resultJson["data"] = true;
				resultJson["routeValue"] = "subscribeToTournamemnt";
				messageValidations.push(resultJson)
            }
            return messageValidations;
		}catch(e){
		}
	}
});

Meteor.methods({
	"associationSubscriptionTypesAPI" :async function(subRest,xData,eventDetails,assocDet){
		try{
			var selectedType_sub = subRest.selectionType;
	        var selectedIds_sub = subRest.selectedIds;
	        var messageValidations = [];
	        //if type is all 
            if (selectedType_sub == "all") {
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try{
            		if(res!=undefined){
            			var eveOrgDet = res;
            			
            			if(eveOrgDet&&eveOrgDet.role=="Association"&&assocDet.associationType=="District/City"){
            				var message = "Association is eligible to subscribe";
			                var resultJson = {};
				            resultJson["status"] = "success";                
				            resultJson["response"] = message.toString();
				            resultJson["data"] = true;
				            resultJson["routeValue"] = "entryFromAcademy";
				            messageValidations.push(resultJson)
            			}
            			else if(eveOrgDet&&eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"&&assocDet.associationType=="State/Province/County"){
            				var message = "Association is eligible to subscribe";
			                var resultJson = {};
				            resultJson["status"] = "success";                
				            resultJson["response"] = message.toString();
				            resultJson["data"] = true;
				            resultJson["routeValue"] = "entryFromAcademy";
				            messageValidations.push(resultJson)

            			} 
            			else{
            				var message = "As association, you are not authorized to subscribe for this tournament";
			                var resultJson = {};
				            resultJson["status"] = "failure";                
				            resultJson["response"] = message.toString();
				            resultJson["data"] = false;
				            messageValidations.push(resultJson)

            			}
            		}
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }

            	}catch(e){
            		var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
			        messageValidations.push(resultJson)
            	}
			}
            //if type is self 
            else if (selectedType_sub == "self") {
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try {
            		if(res!=undefined){
            			var eveOrgDet = res;

            			if(assocDet.role=="Association"&&assocDet.associationType=="District/City"){
            				if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"){
	            				if(eveOrgDet&&assocDet.parentAssociationId==eveOrgDet.userId){
	            					var message = "Association is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "entryFromAcademy";
						            messageValidations.push(resultJson)
	            				}
	            				else{
		            				var message = "You cannot subscribe, since your association is not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
						            messageValidations.push(resultJson)
		            			}
            				}
            				else if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
	            				if(eveOrgDet&&assocDet.userId==eveOrgDet.userId){
	            					var message = "Association is eligible to subscribe";
					                var resultJson = {};
						            resultJson["status"] = "success";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = true;
						            resultJson["routeValue"] = "entryFromAcademy";
						            messageValidations.push(resultJson)
	            				}
	            				else{
		            				var message = "You are not authorized to subscribe for this tournament";
					                var resultJson = {};
						            resultJson["status"] = "failure";                
						            resultJson["response"] = message.toString();
						            resultJson["data"] = false;
						            messageValidations.push(resultJson)
		            			}
            				}
            				else{
		            			var message = "As Association, your are not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
						        messageValidations.push(resultJson)
		            		}
            			}
            			else if(eveOrgDet.role=="Association"&&assocDet.role=="Association"&&assocDet.associationType=="State/Province/County"){
            				if(eveOrgDet&&assocDet.userId==eveOrgDet.userId){
            					var message = "Association is eligible to subscribe";
				                var resultJson = {};
					            resultJson["status"] = "success";                
					            resultJson["response"] = message.toString();
					            resultJson["data"] = true;
					            resultJson["routeValue"] = "entryFromAcademy";
					            messageValidations.push(resultJson)
            				}
            				else{
		            			var message = "As association, you are not authorized to subscribe for this tournament";
					            var resultJson = {};
						        resultJson["status"] = "failure";                
						        resultJson["response"] = message.toString();
						        resultJson["data"] = false;
						        messageValidations.push(resultJson)
		            		}
            			}
            			else{
            				var message = "As association, you are not authorized to subscribe for this tournament";
			                var resultJson = {};
				            resultJson["status"] = "failure";                
				            resultJson["response"] = message.toString();
				            resultJson["data"] = false;
				            messageValidations.push(resultJson)
            			}
            		}
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }
            	}catch(e){
            		var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
			        messageValidations.push(resultJson)
            	}
			}
			//if type is restrict
			else if (selectedType_sub == "restrict"){
				var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
				try{
					if(res!=undefined){
						var eveOrgDet = res;
						if(assocDet.role=="Association"&&assocDet.associationType=="District/City"){
							if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"){

							}
							else if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
								if (assocDet.parentAssociationId && assocDet.parentAssociationId != undefined && assocDet.parentAssociationId != "other") {
                                    if (assocDet.parentAssociationId==eveOrgDet.parentAssociationId) {
                                    	var message = "Association is eligible to subscribe";
						                var resultJson = {};
							            resultJson["status"] = "success";                
							            resultJson["response"] = message.toString();
							            resultJson["data"] = true;
							            resultJson["routeValue"] = "entryFromAcademy";
							            messageValidations.push(resultJson)
                                    }
                                    else{
                                    	var message = "You are not eligible to subscribe,since your association is not authorized to subscribe for this tournament";
						                var resultJson = {};
							            resultJson["status"] = "failure";                
							            resultJson["response"] = message.toString();
							            resultJson["data"] = false;
							            messageValidations.push(resultJson)
                                    }
                                }
                                else{
									var message = "You are not eligible to subscribe,since your association is not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
							        messageValidations.push(resultJson)
								} 
							}
							else{
            					var message = "You are not eligible to subscribe,since your association is not authorized to subscribe for this tournament";
				                var resultJson = {};
					            resultJson["status"] = "failure";                
					            resultJson["response"] = message.toString();
					            resultJson["data"] = false;
					            messageValidations.push(resultJson)
            				}
						}
						else if(assocDet.role=="Association"&&assocDet.associationType=="State/Province/County"){
							if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"){

							}
							else if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
								var message = "As association, you are not authorized to subscribe for this tournament";
				            	var resultJson = {}
				            	resultJson["status"] = "failure";                
							    resultJson["response"] = message.toString();
							    resultJson["data"] = false;
							    messageValidations.push(resultJson)
							}
							else{
            					var message = "As association, you are not authorized to subscribe for this tournament";
				                var resultJson = {};
					            resultJson["status"] = "failure";                
					            resultJson["response"] = message.toString();
					            resultJson["data"] = false;
					            messageValidations.push(resultJson)
            				}
						}
					}
					else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }

				}catch(e){
					var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
			        messageValidations.push(resultJson)
				}
			}
            //if type is restrict
            else if (selectedType_sub == "pick") {
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try {
            		if(res!=undefined){
            			var eveOrgDet = res;
            			if(assocDet.role=="Association"&&assocDet.associationType=="District/City"){
            				if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"){
            					if (assocDet.parentAssociationId && assocDet.parentAssociationId != undefined && assocDet.parentAssociationId != "other") {
                                    if (_.contains(selectedIds_sub, assocDet.parentAssociationId)) {
                                    	var message = "Association is eligible to subscribe";
						                var resultJson = {};
							            resultJson["status"] = "success";                
							            resultJson["response"] = message.toString();
							            resultJson["data"] = true;
							            resultJson["routeValue"] = "entryFromAcademy";
							            messageValidations.push(resultJson)
                                    }
                                    else{
                                    	var message = "You are not eligible to subscribe,since your association is not authorized to subscribe for this tournament";
						                var resultJson = {};
							            resultJson["status"] = "failure";                
							            resultJson["response"] = message.toString();
							            resultJson["data"] = false;
							            messageValidations.push(resultJson)
                                    }
                                }
                                else{
									var message = "You are not eligible to subscribe,since your association is not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
							        messageValidations.push(resultJson)
								} 
            				}
            				else if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
            					if (assocDet.userId && assocDet.userId != undefined && assocDet.userId != "other") {
                                    if (_.contains(selectedIds_sub, assocDet.userId)) {
                                    	var message = "Association is eligible to subscribe";
						                var resultJson = {};
							            resultJson["status"] = "success";                
							            resultJson["response"] = message.toString();
							            resultJson["data"] = true;
							            resultJson["routeValue"] = "entryFromAcademy";
							            messageValidations.push(resultJson)
                                    }
                                    else{
                                    	var message = "As association, you are not authorized to subscribe for this tournament";
						                var resultJson = {};
							            resultJson["status"] = "failure";                
							            resultJson["response"] = message.toString();
							            resultJson["data"] = false;
							            messageValidations.push(resultJson)
                                    }
                                }
                                else{
									var message = "You are not eligible to subscribe,since your association is not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
							        messageValidations.push(resultJson)
								}
            				}
            				else{
            					var message = "As association, you are not authorized to subscribe for this tournament";
				                var resultJson = {};
					            resultJson["status"] = "failure";                
					            resultJson["response"] = message.toString();
					            resultJson["data"] = false;
					            messageValidations.push(resultJson)
            				}
            			}
            			else if(assocDet.role=="Association"&&assocDet.associationType=="State/Province/County"){
            				if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"){
            					if (assocDet.userId && assocDet.userId != undefined && assocDet.userId != "other") {
                                    if (_.contains(selectedIds_sub, assocDet.userId)) {
                                    	var message = "Association is eligible to subscribe";
						                var resultJson = {};
							            resultJson["status"] = "success";                
							            resultJson["response"] = message.toString();
							            resultJson["data"] = true;
							            resultJson["routeValue"] = "entryFromAcademy";
							            messageValidations.push(resultJson)
                                    }
                                    else{
                                    	var message = "As association, you are not authorized to subscribe for this tournament";
						                var resultJson = {};
							            resultJson["status"] = "failure";                
							            resultJson["response"] = message.toString();
							            resultJson["data"] = false;
							            messageValidations.push(resultJson)
                                    }
                                }
                                else{
									var message = "Association is not eligible to subscribe, because your association is not authorized";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
							        messageValidations.push(resultJson)
								}
            				}
            				else{
            					var message = "As association, you are not authorized to subscribe for this tournament";
				                var resultJson = {};
					            resultJson["status"] = "failure";                
					            resultJson["response"] = message.toString();
					            resultJson["data"] = false;
					            messageValidations.push(resultJson)
            				}
            			}
            		}
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }
	
            	}catch(e){
            		var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
			        messageValidations.push(resultJson)
            	}
			}
            //if type is school only
            else if(selectedType_sub == "schoolOnly"){
            	var message = "As association, you are not authorized to subscribe for this tournament";
            	var resultJson = {}
            	resultJson["status"] = "failure";                
			    resultJson["response"] = message.toString();
			    resultJson["data"] = false;
			    messageValidations.push(resultJson)
			}
            //if type is allExceptSchool
            else if(selectedType_sub == "allExceptSchool"){
            	var message = "As association, you are not authorized to subscribe for this tournament";
            	var resultJson = {}
            	resultJson["status"] = "failure";                
			    resultJson["response"] = message.toString();
			    resultJson["data"] = false;
			    messageValidations.push(resultJson)
            }
            return messageValidations;
    	}catch(e){
    	}
	}
});

Meteor.methods({
	"academySubscriptionTypesAPI":async function(subRest,xData,eventDetails,acadDet){
		try{
			var selectedType_sub = subRest.selectionType;
	        var selectedIds_sub = subRest.selectedIds;
	        var messageValidations = [];
	        //if type is all 
            if (selectedType_sub == "all") {
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try {
            		if(res!=undefined){
            			var eveOrgDet = res;
            			if(eveOrgDet.role=="Association"||eveOrgDet.role=="Academy"){
            				var message = "Academy is eligible to subscribe";
				            var resultJson = {};
					        resultJson["status"] = "success";                
					        resultJson["response"] = message.toString();
					        resultJson["data"] = true;
					        resultJson["routeValue"] = "entryFromAcademy";
				            messageValidations.push(resultJson)
            			}
            			else{
            				var message = "As academy, you are not authorized to subscribe for this tournament";
				            var resultJson = {};
					        resultJson["status"] = "failure";                
					        resultJson["response"] = message.toString();
					        resultJson["data"] = false;
				            messageValidations.push(resultJson)
            			}
            		}
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }
            	}catch(e){
            		var message = e
            		var resultJson = {};
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
				    messageValidations.push(resultJson)
            	}
            }

            //if type is self 
            else if (selectedType_sub == "self") {
	            var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
	            try {
	            	if(res!=undefined){
	            		var eveOrgDet = res;

	            		if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"){
	            			if ((acadDet.associationId && acadDet.associationId != undefined && acadDet.associationId != "other")||
	            				(acadDet.parentAssociationId && acadDet.parentAssociationId != undefined && acadDet.parentAssociationId != "other")) {
                                if ((acadDet.associationId == eveOrgDet.userId)||
                                	(acadDet.parentAssociationId == eveOrgDet.userId) ) {
                                	var message = "Academy is eligible to subscribe";
						            var resultJson = {};
							        resultJson["status"] = "success";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = true;
							        resultJson["routeValue"] = "entryFromAcademy";
				            		messageValidations.push(resultJson)
                                }
                                else{
                                	var message = "You are not eligible to subscribe,because your association is not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
				            		messageValidations.push(resultJson)
                                }
                            }
                            else{
								var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament";
						        var resultJson = {};
						       	resultJson["status"] = "failure";                
						       	resultJson["response"] = message.toString();
						       	resultJson["data"] = false;
				            	messageValidations.push(resultJson)
							}
	            		}
	            		else if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
	            			if (acadDet.associationId && acadDet.associationId != undefined && acadDet.associationId != "other") {
                                if (acadDet.associationId == eveOrgDet.userId) {
                                	var message = "Academy is eligible to subscribe";
						            var resultJson = {};
							        resultJson["status"] = "success";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = true;
							        resultJson["routeValue"] = "entryFromAcademy";
				            		messageValidations.push(resultJson)
                                }
                                else{
                                	var message = "As academy, you are not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
				            		messageValidations.push(resultJson)
                                }
                            }
                            else{
								var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament";
						        var resultJson = {};
						       	resultJson["status"] = "failure";                
						       	resultJson["response"] = message.toString();
						       	resultJson["data"] = false;
				            	messageValidations.push(resultJson)
							}
	            		}
	            		else if(eveOrgDet.role=="Academy"){
	            			if (acadDet.userId && acadDet.userId != undefined && acadDet.userId != "other") {
                                if (acadDet.userId == eveOrgDet.userId) {
                                	var message = "Academy is eligible to subscribe";
						            var resultJson = {};
							        resultJson["status"] = "success";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = true;
							        resultJson["routeValue"] = "entryFromAcademy";
				            		messageValidations.push(resultJson)
                                }
                                else{
                                	var message = "As academy, you are not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
				            		messageValidations.push(resultJson)
                                }
                            }
                            else{
								var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament";
						        var resultJson = {};
						       	resultJson["status"] = "failure";                
						       	resultJson["response"] = message.toString();
						       	resultJson["data"] = false;
				            	messageValidations.push(resultJson)
							}
	            		}
	            		else{
	            			var message = "As academy, you are not authorized to subscribe for this tournament";
				            var resultJson = {};
					        resultJson["status"] = "failure";                
					        resultJson["response"] = message.toString();
					        resultJson["data"] = false;
				            messageValidations.push(resultJson)
				        }
	            	}
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }
	            }catch(e){
	            	var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;
				    messageValidations.push(resultJson)
	            }
			}
			else if(selectedType_sub == "restrict"){
				var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
				try{
					if(res!=undefined){
						var eveOrgDet = res;

						if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"){

						}
						else if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
							if (acadDet.associationId && acadDet.associationId != undefined && acadDet.associationId != "other") {
								if (eveOrgDet.parentAssociationId==acadDet.associationId||eveOrgDet.parentAssociationId==acadDet.parentAssociationId) {
                                	var message = "Academy is eligible to subscribe";
						            var resultJson = {};
							        resultJson["status"] = "success";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = true;
							        resultJson["routeValue"] = "entryFromAcademy";
				            		messageValidations.push(resultJson)
                                }
                                else{
                                	var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament"
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
				            		messageValidations.push(resultJson)
                                }
							}
							else{
								var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament"
						        var resultJson = {};
						       	resultJson["status"] = "failure";                
						       	resultJson["response"] = message.toString();
						       	resultJson["data"] = false;
						       	resultJson["routeValue"] = "entryFromAcademy";
				            	messageValidations.push(resultJson)
							}
						}
						else if(eveOrgDet.role=="Academy"){
							if (acadDet.associationId && acadDet.associationId != undefined && acadDet.associationId != "other") {
                                if (eveOrgDet.associationId==acadDet.associationId&&acadDet.affiliatedTo!==undefined&&acadDet.affiliatedTo!="other"){
                                	var message = "Academy is eligible to subscribe";
						            var resultJson = {};
							        resultJson["status"] = "success";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = true;
							        resultJson["routeValue"] = "entryFromAcademy";
				            		messageValidations.push(resultJson)
                                }
                                else{
                                	var message = "You are not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;							        
				            		messageValidations.push(resultJson)
                                }
                            }
                            else{
								var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament";
						        var resultJson = {};
						       	resultJson["status"] = "failure";                
						       	resultJson["response"] = message.toString();
						       	resultJson["data"] = false;
				            	messageValidations.push(resultJson)
							}
						}
						else{
	            			var message = "As academy, you are not authorized to subscribe for this tournament";
				            var resultJson = {};
					        resultJson["status"] = "failure";                
					        resultJson["response"] = message.toString();
					        resultJson["data"] = false;
				            messageValidations.push(resultJson)
	            		}
					}
					else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }
				}catch(e){
					var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;			            
				    messageValidations.push(resultJson)
				}
			}
            //if type is pick
            else if (selectedType_sub == "pick") {
            	var res = await Meteor.call("findWho_RestSubscription", eventDetails.eventOrganizer)
            	try {
	            	if(res!=undefined){
	            		var eveOrgDet = res;

	            		if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="State/Province/County"){
	            			if ((acadDet.associationId && acadDet.associationId != undefined && acadDet.associationId != "other")||
	            				(acadDet.parentAssociationId && acadDet.parentAssociationId != undefined && acadDet.parentAssociationId != "other")) {
                                if (_.contains(selectedIds_sub, acadDet.associationId)||
                                	_.contains(selectedIds_sub, acadDet.parentAssociationId)) {
                                	var message = "Academy is eligible to subscribe";
						            var resultJson = {};
							        resultJson["status"] = "success";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = true;
							        resultJson["routeValue"] = "entryFromAcademy";
				            		messageValidations.push(resultJson)
                                }
                                else{
                                	var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament"
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;							        
				            		messageValidations.push(resultJson)
                                }
                            }
                            else{
								var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament";
						        var resultJson = {};
						       	resultJson["status"] = "failure";                
						       	resultJson["response"] = message.toString();
						       	resultJson["data"] = false;
				            	messageValidations.push(resultJson)
							}
	            		}
	            		else if(eveOrgDet.role=="Association"&&eveOrgDet.associationType=="District/City"){
	            			if (acadDet.associationId && acadDet.associationId != undefined && acadDet.associationId != "other") {
                                if (_.contains(selectedIds_sub, acadDet.associationId)) {
                                	var message = "Academy is eligible to subscribe";
						            var resultJson = {};
							        resultJson["status"] = "success";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = true;
							        resultJson["routeValue"] = "entryFromAcademy";
				            		messageValidations.push(resultJson)
                                }
                                else{
                                	var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;
				            		messageValidations.push(resultJson)
                                }
                            }
                            else{
								var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament"
						        var resultJson = {};
						       	resultJson["status"] = "failure";                
						       	resultJson["response"] = message.toString();
						       	resultJson["data"] = false;
						       	resultJson["routeValue"] = "entryFromAcademy";
				            	messageValidations.push(resultJson)
							}
	            		}
	            		else if(eveOrgDet.role=="Academy"){
	            			if (acadDet.userId && acadDet.userId != undefined && acadDet.userId != "other") {
	            				
                                if (_.contains(selectedIds_sub, acadDet.userId)){
                                	var message = "Academy is eligible to subscribe";
						            var resultJson = {};
							        resultJson["status"] = "success";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = true;
							        resultJson["routeValue"] = "entryFromAcademy";
				            		messageValidations.push(resultJson)
                                }
                                else{
                                	var message = "You are not authorized to subscribe for this tournament";
						            var resultJson = {};
							        resultJson["status"] = "failure";                
							        resultJson["response"] = message.toString();
							        resultJson["data"] = false;							        
				            		messageValidations.push(resultJson)
                                }
                            }
                            else{
								var message = "You are not eligible to subscribe, because your association is not authorized to subscribe for this tournament";
						        var resultJson = {};
						       	resultJson["status"] = "failure";                
						       	resultJson["response"] = message.toString();
						       	resultJson["data"] = false;
				            	messageValidations.push(resultJson)
							}
	            		}
	            		else{
	            			var message = "As academy, you are not authorized to subscribe for this tournament";
				            var resultJson = {};
					        resultJson["status"] = "failure";                
					        resultJson["response"] = message.toString();
					        resultJson["data"] = false;
				            messageValidations.push(resultJson)
	            		}
	            	}            	
            		else if (res == undefined) {
            			var message = "You cannot subscribe, because the tournament is not valid"
            			var resultJson = {};
						resultJson["status"] = "failure";                
			            resultJson["response"] = message.toString();
			            resultJson["data"] = false;
				        messageValidations.push(resultJson)
                    }

	            }catch(e){
	            	var message = e
            		var resultJson = {}
					resultJson["status"] = "failure";                
			        resultJson["response"] = message.toString();
			        resultJson["data"] = false;			            
                    messageValidations.push(resultJson)
	            }
			}	

            //if type is school only
            else if(selectedType_sub == "schoolOnly"){
            	var message = "As academy, you are not authorized to subscribe for this tournament";
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				messageValidations.push(resultJson)
			}

            //if type is allExceptSchool
            else if(selectedType_sub == "allExceptSchool"){
            	var message = "As academy, you are not authorized to subscribe for this tournament";
				var resultJson = {};
				resultJson["status"] = "failure";                
 				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				messageValidations.push(resultJson)
            }
            return messageValidations;
        }catch(e){
        }
	}
});

Meteor.methods({
	"academySubscriptionToTournament":function(xData){
		try{
			var message = "Received Data";
			var resultJson = {};
			resultJson["status"] = "success";                
 			resultJson["response"] = message.toString();
			resultJson["data"] = "";
			return resultJson;
		}catch(e){
		}
	}
});

Meteor.methods({
	"academySubscriptionDetails":function(xData){
		var JSONToReturn = {playerDetails:[
			{
				playerId:"3MtsZweBPeFWk6tyT",
				playerName:"RAJDIP KUNDU",
				gender:"Male",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2004-03-07"
			},
			{
				playerId:"3cR93QeoAA7K2XKhd",
				playerName:"ABEER VICKY GUPTA",
				gender:"Male",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2005-03-09"
			},
			{
				playerId:"2j54Y44LzfTRgmZic",
				playerName:"RAJANDRA PARMAR S S",
				gender:"Male",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2004-04-17"
			},
			{
				playerId:"fsQCJcPvGPWfsw7zq",
				playerName:"PURVANSHI SANDEEP KOTIA",
				gender:"Female",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2005-05-05"
			},
			{
				playerId:"9FsWwrPrGmZvTepva",
				playerName:"ANISHA SANJAY MEHTA",
				gender:"Female",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "1995-05-07"
			},
			{
				playerId:"83LzDmvAcDK2ueEip",
				playerName:"ARYA RAJENDRA THAKUR",
				gender:"Female",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "1995-05-07"
			},
			{
				playerId:"7L5REXFkHTwSch49u",
				playerName:"MANASI MAHENDRA CHIPLUNKAR",
				gender:"Female",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2005-07-07"
			},
			{
				playerId:"7L5REXFkHTwSch495",
				playerName:"CHANDRAKANT VARADE",
				gender:"Female",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2005-12-07"
			},
			{
				playerId:"2atNhkXwKEeuTmb2e",
				playerName:"ANSH SHARAD GOYAL",
				gender:"Male",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2005-11-07"
			},
			{
				playerId:"2favjxQ6dSwpcRTYS",
				playerName:"HARSIMRAN SINGH HARDEEP SINGH NARANG",
				gender:"Male",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2005-10-07"
			},
			{
				playerId:"2nYzxCRYaxneufSsB",
				playerName:"SARVESH NARESH CHIPLUNKAR",
				gender:"Male",
				subscribedArrayList :["1","0","1","0","0","0"],
				dateOfBirth : "2005-02-07"
			},
		],
		eventFeeLIST : ["1","1","1","1","1","1"]
		};

		var message = "Received Data";
		var resultJson = {};
		resultJson["status"] = "success";                
 		resultJson["response"] = message.toString();
		resultJson["data"] = JSONToReturn
		return resultJson;
	}
})

Meteor.methods({
	"threeUpcomingEvents":function(){
		var upcomingEventsFind = events.find({tournamentEvent:true
         }, {sort:{eventStartDate1:1},limit:4,fields:{eventName:1,eventStartDate:1,domainName:1}}).fetch();
		return upcomingEventsFind
	}
})