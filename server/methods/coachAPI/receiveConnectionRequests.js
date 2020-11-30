import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
	//details of received connection req 
	//for login id
	"getDetailsOfReceivedConnectionReq":function(xDATA){
		try{

			var messageValidations = [];
			var connectionRequestsDEt = [];
			//check for all parameters
			if(xDATA&&xDATA.loggedInId&&xDATA.statusType){
				//find valid login id
				var logDet = Meteor.users.findOne({"userId":xDATA.loggedInId});
				if(logDet&&(logDet.role=="Player"||logDet.role=="Coach")){
					if(logDet.role=="Player"){
						var queryForstatus = {}
						//query for the status (pending,accepted,rejected)
						if(xDATA.statusType.trim().toLowerCase()=="all"){
							queryForstatus = {}				           
						}
						else{
							queryForstatus = {
								"status":xDATA.statusType.trim()
							}
						}
						//find the request comes to playerId
						connectionRequests.find({							
							$and:[
								{"playerId":xDATA.loggedInId},
								queryForstatus
							]
						}).fetch().forEach(function(e,i){
	                        var coachIdF = e;
	                        var coachDet;
	                        //find who has sent request
	                        //if coach get details of coach
	                       	if(coachIdF.loggedInRole=="Coach"){
	                            coachDet = otherUsers.findOne({
	                                "userId":coachIdF.loggedInId,
	                            });

	                            if(coachDet){
	                                var address = "";
	                                var city = "";
	                                var pinCode = "";
	                                var gender = "";
	                                var dateOfBirth = "";
	                                var coachName = "";
	                                var guardianName = "";
	                                var phNum = "";

	                                if(coachDet.userName){
	                                    coachName = coachDet.userName
	                                }
	                                if(coachDet.address){
	                                    address = coachDet.address
	                                }
	                                if(coachDet.pinCode){
	                                    pinCode = coachDet.pinCode
	                                }
	                                if(coachDet.city){
	                                    city = coachDet.city
	                                }
	                                if(coachDet.gender){
	                                    gender = coachDet.gender
	                                }
	                                if(coachDet.dateOfBirth){
	                                    dateOfBirth = coachDet.dateOfBirth
	                                }
	                                if(coachDet.guardianName){
	                                    guardianName = coachDet.guardianName
	                                }   
	                                if(coachDet.phoneNumber){
	                                    phNum  = coachDet.phoneNumber
	                                }

	                                var data  = {
	                                	"connectionReqId":coachIdF._id,
	                                    "senderId":coachDet.userId,
	                                    "senderName":coachName,
	                                    "gender":gender,
	                                    "dateOfBirth":dateOfBirth,
	                                    "address":address,
	                                    "pinCode":pinCode,
	                                    "city":city,
	                                    "guardianName":guardianName,
	                                    "phoneNumber":phNum,
	                                    "statusOfConnection":coachIdF.status,
	                                    "connectionSentDate":coachIdF.sentDateTime,
	                                    "senderRole":"Coach"
	                                }
	                                connectionRequestsDEt.push(data)
	                            }
	                        }
						});
					}
					else if(logDet.role=="Coach"){
						var queryForstatus = {}
						//query for the status (pending,accepted,rejected)
						if(xDATA.statusType.trim().toLowerCase()=='all'){
							queryForstatus = {}				           
						}
						else{
							queryForstatus = {
								"status":xDATA.statusType.trim()
							}
						}
						//find the request comes to coachId
						connectionRequests.find({							
							$and:[
								{"coachId":xDATA.loggedInId},
								queryForstatus
							]						
						}).fetch().forEach(function(e,i){
							var coachIdF = e;
	                        var coachDet;
	                        //find who has sent request
	                        //if coach get details of coach
	                        if(coachIdF.loggedInRole=="Coach"){
	                            coachDet = otherUsers.findOne({
	                                "userId":coachIdF.loggedInId,
	                            });

	                            if(coachDet){
	                                var address = "";
	                                var city = "";
	                                var pinCode = "";
	                                var gender = "";
	                                var dateOfBirth = "";
	                                var coachName = "";
	                                var guardianName = "";
	                                var phNum = "";

	                                if(coachDet.userName){
	                                    coachName = coachDet.userName
	                                }
	                                if(coachDet.address){
	                                    address = coachDet.address
	                                }
	                                if(coachDet.pinCode){
	                                    pinCode = coachDet.pinCode
	                                }
	                                if(coachDet.city){
	                                    city = coachDet.city
	                                }
	                                if(coachDet.gender){
	                                    gender = coachDet.gender
	                                }
	                                if(coachDet.dateOfBirth){
	                                    dateOfBirth = coachDet.dateOfBirth
	                                }
	                                if(coachDet.guardianName){
	                                    guardianName = coachDet.guardianName
	                                }   
	                                if(coachDet.phoneNumber){
	                                    phNum  = coachDet.phoneNumber
	                                }

	                                var data  = {
	                                	"connectionReqId":coachIdF._id,
	                                    "senderId":coachDet.userId,
	                                    "senderName":coachName,
	                                    "gender":gender,
	                                    "dateOfBirth":dateOfBirth,
	                                    "address":address,
	                                    "pinCode":pinCode,
	                                    "city":city,
	                                    "guardianName":guardianName,
	                                    "phoneNumber":phNum,
	                                    "statusOfConnection":coachIdF.status,
	                                    "connectionSentDate":coachIdF.sentDateTime,
	                                    "senderRole":"Coach"
	                                }
	                                connectionRequestsDEt.push(data)
	                            }
	                        }
	                        //find who has sent request
	                        //if player get details of player
	                        else if(coachIdF.loggedInRole=="Player"){
	                            var playerIdF = e;
	                            var playerDEt = nameToCollection(playerIdF.loggedInId).findOne({
	                                "userId":playerIdF.loggedInId,
	                            });

	                            if(playerDEt){
	                                var address = "";
	                                var city = "";
	                                var pinCode = "";
	                                var gender = "";
	                                var dateOfBirth = "";
	                                var playerName = "";
	                                var guardianName = "";
	                                var phNum = "";

	                                if(playerDEt.userName){
	                                    playerName = playerDEt.userName
	                                }
	                                if(playerDEt.address){
	                                    address = playerDEt.address
	                                }
	                                if(playerDEt.pinCode){
	                                    pinCode = playerDEt.pinCode
	                                }
	                                if(playerDEt.city){
	                                    city = playerDEt.city
	                                }
	                                if(playerDEt.gender){
	                                    gender = playerDEt.gender
	                                }
	                                if(playerDEt.dateOfBirth){
	                                    dateOfBirth = playerDEt.dateOfBirth
	                                }
	                                if(playerDEt.guardianName){
	                                    guardianName = playerDEt.guardianName
	                                }   
	                                if(playerDEt.phoneNumber){
	                                    phNum  = playerDEt.phoneNumber
	                                }

	                                var data  = {
	                                    "senderId":playerDEt.userId,
	                                    "senderName":playerName,
	                                    "gender":gender,
	                                    "dateOfBirth":dateOfBirth,
	                                    "address":address,
	                                    "pinCode":pinCode,
	                                    "city":city,
	                                    "guardianName":guardianName,
	                                    "phoneNumber":phNum,
	                                    "statusOfConnection":playerIdF.status,
	                                    "connectionSentDate":playerIdF.sentDateTime,
	                                    "senderRole":"Player"
	                                }
	                                connectionRequestsDEt.push(data)
	                            }
	                        }
						});
					}
					else{
						var message = "Invalid Login Credentials"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				} else{
					var message = "Invalid Login Credentials"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
				//if details
                //if of details
                if(connectionRequestsDEt.length!=0){
                    var message = "Request received details"
                    var resultJson = {};
                    resultJson["status"] = "success";                
                    resultJson["response"] = message;
                    resultJson["data"] = connectionRequestsDEt;
                    messageValidations.push(resultJson);
                    return messageValidations
                } else{
                    var message = "There are no requests received"
                    var resultJson = {};
                    resultJson["status"] = "failure";                
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    messageValidations.push(resultJson);
                    return messageValidations
                }
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				messageValidations.push(resultJson);
				return messageValidations
			}
		}catch(e){
			var message = "Invalid data"
			var resultJson = {};
			resultJson["status"] = "failure";                
			resultJson["response"] = e;
			resultJson["data"] = false;
			messageValidations.push(resultJson);
			return messageValidations
		}
	}
});

Meteor.methods({
	//accept connection req
	"acceptConnectionRequest":function(xDATA){

		var messageValidations = [];
		try{			
			if(xDATA){
				//var data = xDATA.replace("\\", "");
	            //xDATA = JSON.parse(data);
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				messageValidations.push(resultJson);
				return messageValidations
			}
			//check for parameters
			if(xDATA&&xDATA.loggedInId&&xDATA.connectionReqId){
				xDATA.loggedInId = xDATA.loggedInId.trim();
				xDATA.connectionReqId = xDATA.connectionReqId.trim()
				//find valid login id
				var logDet = Meteor.users.findOne({"userId":xDATA.loggedInId});
				//find valid login role
				if(logDet&&(logDet.role=="Player"||logDet.role=="Coach")){
					//if role is player
					if(logDet.role=="Player"){						
						var connectDet = connectionRequests.findOne({
							"_id":xDATA.connectionReqId,
							"playerId":xDATA.loggedInId,
							"toEntity":"Player"
						})
						//check for the valid connection req id
						if(connectDet){
							if(connectDet.status){
								//check for connection status pending
								if(connectDet.status.toLowerCase().trim()=="pending"){
									//if pending accept the req
									var updateStatus = connectionRequests.update({
										"_id":xDATA.connectionReqId
									},{
										$set:{
											"status":"accepted"
										}
									});
									//if update happens
									if(updateStatus){
										//fetch the update record
										var updatedConnectReq = connectionRequests.findOne({
											"_id":xDATA.connectionReqId,
											"playerId":xDATA.loggedInId,
											"toEntity":"Player"
										})
										if(updatedConnectReq){
											var message = "Accepted Connection Request"
						                    var resultJson = {};
						                    resultJson["status"] = "success";                
						                    resultJson["response"] = message;
						                    resultJson["data"] = updatedConnectReq;
						                    //messageValidations.push(resultJson);
						                    return resultJson
										} 
										else{
											var message = "Cannot accept the request"
											var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = message.toString();
											resultJson["data"] = false;
											//messageValidations.push(resultJson);
											return resultJson;
										}
									} 
									else{
										var message = "Cannot accept the request"
										var resultJson = {};
										resultJson["status"] = "failure";                
										resultJson["response"] = message.toString();
										resultJson["data"] = false;
										//messageValidations.push(resultJson);
										return resultJson
									}
								} 
								//check for connection status accepted
								else if(connectDet.status.toLowerCase().trim()=="accepted"){
									var message = "Request already accepted"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									//messageValidations.push(resultJson);
									return resultJson;
								} 
								//check for connection status rejected
								else if(connectDet.status.toLowerCase().trim()=="rejected"){
									var message = "Cannot accept rejected request"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									//messageValidations.push(resultJson);
									return resultJson;
								} else {
									var message = "Invalid connection request status"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									//messageValidations.push(resultJson);
									return resultJson;
								}
							} else{
								var message = "Invalid connection request status"
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								//messageValidations.push(resultJson);
								return resultJson
							}
						} else{
							var message = "Invalid connection request"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message.toString();
							resultJson["data"] = false;
							//messageValidations.push(resultJson);
							return resultJson;
						}
					} else if(logDet.role=="Coach"){
						var connectDet = connectionRequests.findOne({
							"_id":xDATA.connectionReqId,
							"coachId":xDATA.loggedInId,
							"toEntity":"Coach"
						})
						//check for the valid connection req id
						if(connectDet){
							if(connectDet.status){
								//check for connection status pending
								if(connectDet.status.toLowerCase().trim()=="pending"){
									//if pending accept the req
									var updateStatus = connectionRequests.update({
										"_id":xDATA.connectionReqId
									},{
										$set:{
											"status":"accepted"
										}
									});
									//if update happens
									if(updateStatus){
										//fetch the update record
										var updatedConnectReq = connectionRequests.findOne({
											"_id":xDATA.connectionReqId,
											"coachId":xDATA.loggedInId,
											"toEntity":"Coach"
										})
										if(updatedConnectReq){
											var message = "Accepted Connection Request"
						                    var resultJson = {};
						                    resultJson["status"] = "success";                
						                    resultJson["response"] = message;
						                    resultJson["data"] = updatedConnectReq;
						                    //messageValidations.push(resultJson);
						                    return resultJson
										} 
										else{
											var message = "Cannot accept the request"
											var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = message.toString();
											resultJson["data"] = false;
											//messageValidations.push(resultJson);
											return resultJson
										}
									} 
									else{
										var message = "Cannot accept the request"
										var resultJson = {};
										resultJson["status"] = "failure";                
										resultJson["response"] = message.toString();
										resultJson["data"] = false;
										//messageValidations.push(resultJson);
										return resultJson
									}
								} 
								//check for connection status accepted
								else if(connectDet.status.toLowerCase().trim()=="accepted"){
									var message = "Request already accepted"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									//messageValidations.push(resultJson);
									return resultJson
								} 
								//check for connection status rejected
								else if(connectDet.status.toLowerCase().trim()=="rejected"){
									var message = "Cannot accept rejected request"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									//messageValidations.push(resultJson);
									return resultJson
								} else {
									var message = "Invalid connection request status"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									//messageValidations.push(resultJson);
									return resultJson
								}
							} else{
								var message = "Invalid connection request status"
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								//messageValidations.push(resultJson);
								return resultJson
							}
						} else{
							var message = "Invalid connection request"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message.toString();
							resultJson["data"] = false;
							//messageValidations.push(resultJson);
							return resultJson
						}
					} else{
						var message = "Invalid Login Role"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						//messageValidations.push(resultJson);
						return resultJson
					}
				} else{
					var message = "Invalid Login Credentials"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					//messageValidations.push(resultJson);
					return resultJson
				}
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				//messageValidations.push(resultJson);
				return resultJson
			}
		}catch(e){
			var message = "Invalid data"
			var resultJson = {};
			resultJson["status"] = "failure";                
			resultJson["response"] = e;
			resultJson["data"] = false;
			//messageValidations.push(resultJson);
			return resultJson
		}
	}
});


Meteor.methods({
	//reject connection req
	"rejectConnectionRequest":function(xDATA){
		var messageValidations = [];
		try{			
			if(xDATA){
				xDATA = xDATA
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				messageValidations.push(resultJson);
				return messageValidations
			}
			//check for parameters
			if(xDATA&&xDATA.loggedInId&&xDATA.connectionReqId){
				xDATA.loggedInId = xDATA.loggedInId.trim();
				xDATA.connectionReqId = xDATA.connectionReqId.trim()
				//find valid login id
				var logDet = Meteor.users.findOne({"userId":xDATA.loggedInId});
				//find valid login role
				if(logDet&&(logDet.role=="Player"||logDet.role=="Coach")){
					//if role is player
					if(logDet.role=="Player"){						
						var connectDet = connectionRequests.findOne({
							"_id":xDATA.connectionReqId,
							"playerId":xDATA.loggedInId,
							"toEntity":"Player"
						})
						//check for the valid connection req id
						if(connectDet){
							if(connectDet.status){
								//check for connection status pending
								if(connectDet.status.toLowerCase().trim()=="pending"){
									//if pending reject the req
									var updateStatus = connectionRequests.update({
										"_id":xDATA.connectionReqId
									},{
										$set:{
											"status":"rejected"
										}
									});
									//if update happens
									if(updateStatus){
										//fetch the update record
										var updatedConnectReq = connectionRequests.findOne({
											"_id":xDATA.connectionReqId,
											"playerId":xDATA.loggedInId,
											"toEntity":"Player"
										})
										if(updatedConnectReq){
											var message = "Rejected Connection Request"
						                    var resultJson = {};
						                    resultJson["status"] = "success";                
						                    resultJson["response"] = message;
						                    resultJson["data"] = updatedConnectReq;
						                    messageValidations.push(resultJson);
						                    return messageValidations
										} 
										else{
											var message = "Cannot reject the request"
											var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = message.toString();
											resultJson["data"] = false;
											messageValidations.push(resultJson);
											return messageValidations
										}
									} 
									else{
										var message = "Cannot accept the request"
										var resultJson = {};
										resultJson["status"] = "failure";                
										resultJson["response"] = message.toString();
										resultJson["data"] = false;
										messageValidations.push(resultJson);
										return messageValidations
									}
								} 
								//check for connection status rejected
								else if(connectDet.status.toLowerCase().trim()=="rejected"){
									var message = "Request already rejected"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
									return messageValidations
								} 
								//check for connection status accepted
								else if(connectDet.status.toLowerCase().trim()=="accepted"){
									var message = "Cannot reject accepted request"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
									return messageValidations
								} else {
									var message = "Invalid connection request status"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
									return messageValidations
								}
							} else{
								var message = "Invalid connection request status"
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								messageValidations.push(resultJson);
								return messageValidations
							}
						} else{
							var message = "Invalid connection request"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message.toString();
							resultJson["data"] = false;
							messageValidations.push(resultJson);
							return messageValidations
						}
					} else if(logDet.role=="Coach"){
						var connectDet = connectionRequests.findOne({
							"_id":xDATA.connectionReqId,
							"coachId":xDATA.loggedInId,
							"toEntity":"Coach"
						})
						//check for the valid connection req id
						if(connectDet){
							if(connectDet.status){
								//check for connection status pending
								if(connectDet.status.toLowerCase().trim()=="pending"){
									//if pending reject the req
									var updateStatus = connectionRequests.update({
										"_id":xDATA.connectionReqId
									},{
										$set:{
											"status":"rejected"
										}
									});
									//if update happens
									if(updateStatus){
										//fetch the update record
										var updatedConnectReq = connectionRequests.findOne({
											"_id":xDATA.connectionReqId,
											"coachId":xDATA.loggedInId,
											"toEntity":"Coach"
										})
										if(updatedConnectReq){
											var message = "Rejected Connection Request"
						                    var resultJson = {};
						                    resultJson["status"] = "success";                
						                    resultJson["response"] = message;
						                    resultJson["data"] = updatedConnectReq;
						                    messageValidations.push(resultJson);
						                    return messageValidations
										} 
										else{
											var message = "Cannot reject the request"
											var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = message.toString();
											resultJson["data"] = false;
											messageValidations.push(resultJson);
											return messageValidations
										}
									} 
									else{
										var message = "Cannot reject the request"
										var resultJson = {};
										resultJson["status"] = "failure";                
										resultJson["response"] = message.toString();
										resultJson["data"] = false;
										messageValidations.push(resultJson);
										return messageValidations
									}
								} 
								//check for connection status rejected
								else if(connectDet.status.toLowerCase().trim()=="rejected"){
									var message = "Request already rejected"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
									return messageValidations
								} 
								//check for connection status rejected
								else if(connectDet.status.toLowerCase().trim()=="accepted"){
									var message = "Cannot reject accepted request"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
									return messageValidations
								} else {
									var message = "Invalid connection request status"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
									return messageValidations
								}
							} else{
								var message = "Invalid connection request status"
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								messageValidations.push(resultJson);
								return messageValidations
							}
						} else{
							var message = "Invalid connection request"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message.toString();
							resultJson["data"] = false;
							messageValidations.push(resultJson);
							return messageValidations
						}
					} else{
						var message = "Invalid Login Role"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				} else{
					var message = "Invalid Login Credentials"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				messageValidations.push(resultJson);
				return messageValidations
			}
		}catch(e){
			var message = "Invalid data"
			var resultJson = {};
			resultJson["status"] = "failure";                
			resultJson["response"] = e;
			resultJson["data"] = false;
			messageValidations.push(resultJson);
			return messageValidations
		}
	},
	//reject connection req
	"deleteConnectionRequest":async function(xDATA,paramObj){
		try{			
			if(xDATA){

				xDATA = xDATA
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				return resultJson
			}
			//check for parameters
			if(xDATA&&xDATA.loggedInId&&xDATA.connectionReqId)
			{
				xDATA.loggedInId = xDATA.loggedInId.trim();
				xDATA.connectionReqId = xDATA.connectionReqId.trim()
				//find valid login id
				var logDet = Meteor.users.findOne({"userId":xDATA.loggedInId});
				//find valid login role
				if(logDet&&(logDet.role=="Player"||logDet.role=="Coach"))
				{
					//if role is player
					if(logDet.role=="Player")
					{		
						var connectDet;		
						var receiverId;		
						connectDet = connectionRequests.findOne({
							"_id":xDATA.connectionReqId,
							"receiverId":xDATA.loggedInId,
							//"playerId":xDATA.loggedInId,
							//"toEntity":"Player"
						})
						if(connectDet)
							receiverId = connectDet.loggedInId;
						if(connectDet == undefined)
						{
							connectDet = connectionRequests.findOne({
								"_id":xDATA.connectionReqId,
								"loggedInId":xDATA.loggedInId,
								"loggedInRole":"Player"
							})
							if(connectDet)
								receiverId = connectDet.receiverId;
						}
							
						


						//check for the valid connection req id
						if(connectDet){
							if(connectDet.status)
							{
								//check for connection status pending
								if(connectDet.status.toLowerCase().trim()=="pending" || connectDet.status.toLowerCase().trim()=="accepted")
								{
									//if pending reject the req
									var updateStatus = connectionRequests.remove(
										{"_id":xDATA.connectionReqId});

								

									var updateGroup = coachConnectedGroups.update({
						                "loggedInId": xDATA.loggedInId,
						                'groupMembers': {$in:[receiverId]},
							            }, {
							                $pull: {
							                    "groupMembers": receiverId
							                }
							            },
							            {multi:true});

									var updateGroup = coachConnectedGroups.update({
						                "loggedInId": receiverId,
						                'groupMembers': {$in:[xDATA.loggedInId]},
							            }, {
							                $pull: {
							                    "groupMembers": xDATA.loggedInId
							                }
							            },
							            {multi:true});





									//if update happens
									if(updateStatus){
										//fetch the update record
										//paramObj.loggedInId = "t9qQWpeWczCc2zBdx"
										var connectionResult = await Meteor.call("getDetailsOfReceivedNSentConnection",paramObj);
										try{
										if(connectionResult)
										{
											if(connectionResult.status)
											{
												if(connectionResult.status == "success")
												{
													if(connectionResult.data)
													{
														Meteor.call("rejectedRequestNotification",xDATA.loggedInId,connectDet,function(e,res){})
														var message = "Rejected Connection Request"
									                    var resultJson = {};
									                    resultJson["status"] = "success";                
									                    resultJson["response"] = message;
									                    resultJson["data"] = connectionResult.data;
									                    return resultJson
													}
												}
												else
												{
													//
													Meteor.call("rejectedRequestNotification",xDATA.loggedInId,connectDet,function(e,res){})
													var message = "Rejected Connection Request"
									                var resultJson = {};
									                resultJson["status"] = "success";                
									                resultJson["response"] = message;
									                resultJson["data"] = null;
									                return resultJson
												}
											}
										}
										else
										{
											//
											Meteor.call("rejectedRequestNotification",xDATA.loggedInId,connectDet,function(e,res){})
											var message = "Rejected Connection Request"
									        var resultJson = {};
									        resultJson["status"] = "success";                
									        resultJson["response"] = message;
									        resultJson["data"] = null;
									        return resultJson
										}
										}catch(e){}
									} 
									else{
										var message = "Could not reject the request"
										var resultJson = {};
										resultJson["status"] = "failure";                
										resultJson["response"] = message.toString();
										resultJson["data"] = false;
										return resultJson
									}
								} 
								
								else {
									var message = "Invalid connection request status"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									return resultJson
								}
							} else{
								var message = "Invalid connection request status"
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								return resultJson
							}
						} else{
							var message = "Invalid connection request"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message.toString();
							resultJson["data"] = false;
							return resultJson
						}
					} 
					else if(logDet.role=="Coach")
					{
						
						var connectDet;		
						var receiverId;		
		
						connectDet = connectionRequests.findOne({
							"_id":xDATA.connectionReqId,
							"receiverId":xDATA.loggedInId,
							//"coachId":xDATA.loggedInId,
							//"toEntity":"Coach"
						})
						if(connectDet)
							receiverId = connectDet.loggedInId;
						if(connectDet == undefined)
						{
							connectDet = connectionRequests.findOne({
								"_id":xDATA.connectionReqId,
								"loggedInId":xDATA.loggedInId,
								"loggedInRole":"Coach"
							})

							if(connectDet)
								receiverId = connectDet.receiverId
						}



						//check for the valid connection req id
						if(connectDet){
							if(connectDet.status){
								//check for connection status pending
								if(connectDet.status.toLowerCase().trim()=="pending" || connectDet.status.toLowerCase().trim()=="accepted"){
									//if pending reject the req
									//var updateStatus = true;
									var updateStatus = connectionRequests.remove({
										"_id":xDATA.connectionReqId});

									var updateGroup = coachConnectedGroups.update({
						                "loggedInId": xDATA.loggedInId,
						                'groupMembers': {$in:[receiverId]},
							            }, {
							                $pull: {
							                    "groupMembers": receiverId
							                }
							            },
							            {multi:true});
									var updateGroup = coachConnectedGroups.update({
						                "loggedInId": receiverId,
						                'groupMembers': {$in:[xDATA.loggedInId]},
							            }, {
							                $pull: {
							                    "groupMembers": xDATA.loggedInId
							                }
							            },
							            {multi:true});

									//if update happens
									if(updateStatus){
										//fetch the update record
										//paramObj.loggedInId = "t9qQWpeWczCc2zBdx"
										var connectionResult = await Meteor.call("getDetailsOfReceivedNSentConnection",paramObj);
										try{
										if(connectionResult)
										{
											if(connectionResult.status)
											{
												if(connectionResult.status == "success")
												{
													if(connectionResult.data)
													{
														//
														Meteor.call("rejectedRequestNotification",xDATA.loggedInId,connectDet,function(e,res){})
														var message = "Rejected Connection Request"
									                    var resultJson = {};
									                    resultJson["status"] = "success";                
									                    resultJson["response"] = message;
									                    resultJson["data"] = connectionResult.data;
									                    return resultJson
													}
												}
												else
												{
													//
													Meteor.call("rejectedRequestNotification",xDATA.loggedInId,connectDet,function(e,res){})
													var message = "Rejected Connection Request"
									                var resultJson = {};
									                resultJson["status"] = "success";                
									                resultJson["response"] = message;
									                resultJson["data"] = null;
									                return resultJson
												}
											}
										}
										else
										{
											//
											Meteor.call("rejectedRequestNotification",xDATA.loggedInId,connectDet,function(e,res){})
											var message = "Rejected Connection Request"
									        var resultJson = {};
									        resultJson["status"] = "success";                
									        resultJson["response"] = message;
									        resultJson["data"] = null;
									        return resultJson
										}
										}catch(e){

										}
									} 
									else{
										//

										var message = "Could not reject the request"
										var resultJson = {};
										resultJson["status"] = "failure";                
										resultJson["response"] = message.toString();
										resultJson["data"] = false;
										return resultJson
									}
								} 
								 
								else {
									var message = "Invalid connection request status"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									return resultJson
								}
							} else{
								var message = "Invalid connection request status"
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								return resultJson
							}
						} else{
							var message = "Invalid connection request"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message.toString();
							resultJson["data"] = false;
							return resultJson
						}
					} else{
						var message = "Invalid Login Role"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						return resultJson
					}
				} else{
					var message = "Invalid Login Credentials"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					return resultJson
				}
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				return resultJson
			}
		}catch(e){
			var message = "Invalid data"
			var resultJson = {};
			resultJson["status"] = "failure";                
			resultJson["response"] = e;
			resultJson["data"] = false;
			return resultJson
		}
	}
})

//get all my connected members for given playerId
Meteor.methods({
	"getConnectedMembersForGivenPlayerID":function(xDATA){
        try {
            //check for params
            if (xDATA) {
                //var data = xDATA.replace("\\", "");
                //xDATA = JSON.parse(data);
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

            //check for valid playerId
            if (xDATA && xDATA.playerId) {
                //find player id in db
                var det = Meteor.users.findOne({
                    "userId": xDATA.playerId,
                    role: "Player"
                });;

                var otherUsersPlayer = nameToCollection(xDATA.playerId).findOne({
                    "userId": xDATA.playerId,
                    role: "Player"
                })

                if (det && otherUsersPlayer) {
                    //find accepted connections for given player
                    //player --> coach -- loggedInId
                    //coach --> player -- coachId
                    var conreq = connectionRequests.aggregate([{
                        $match: {
                            $or: [{
                                loggedInId: xDATA.playerId
                            }, {
                                playerId: xDATA.playerId
                            }],
                            status: "accepted"
                        }
                    }]);
                    //if there are any accepted connection
                    if (conreq && conreq.length) {
                        var conreqAcc = conreq;
                        var membersAndMemberDet = [];
                        for (var i = 0; i < conreqAcc.length; i++) {
                            if (conreqAcc[i].toEntity && conreqAcc[i].loggedInRole) {
                                var entity = conreqAcc[i].toEntity.trim();
                                var role = conreqAcc[i].loggedInRole.trim();
                                //if loggedInrole is player and toentity is coach
                                //use loggedInId and db is otherUsers
                                if (entity.toLowerCase() == "coach" && role.toLowerCase() == "player") {
                                    if (conreqAcc[i].coachId) {
                                        var coachDet = otherUsers.findOne({
                                            "userId": conreqAcc[i].coachId
                                        },{fields:{"userName":1,"userId":1,"_id":0}})
                                        //coachDet.requestSentBy = role
                                        //coachDet.requestSentById = conreqAcc[i].loggedInId
                                        //coachDet.connectedReqId = conreqAcc[i]._id;
                                        if (coachDet)
                                            membersAndMemberDet.push(coachDet)
                                    }
                                }

                                //if loggedInrole is coach and toentity is player
                                //use playerId and db is otherUsers
                                else if (entity.toLowerCase() == "player" && role.toLowerCase() == "coach") {
                                    if (conreqAcc[i].loggedInId) {
                                        var coachDet = otherUsers.findOne({
                                            "userId": conreqAcc[i].loggedInId
                                        },{fields:{"userName":1,"userId":1,"_id":0}})
                                        //coachDet.requestSentBy = role
                                        //coachDet.requestSentById = conreqAcc[i].loggedInId
                                        //coachDet.connectedReqId = conreqAcc[i]._id;
                                        if (coachDet)
                                            membersAndMemberDet.push(coachDet)
                                    }
                                }
                            }
                        }
                        //if there are connected members
                        if (membersAndMemberDet.length != 0) {
                            var message = "Connected Members"
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = membersAndMemberDet;
                            return resultJson
                        } else {
                            var message = "There are no connected coaches"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                        }
                    } else {
                        var message = "There are no connected coaches"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }
                } else {
                    var message = "Player is not valid"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
            } else {
                var message = "Player is not valid"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
	}
})

//delist the connected members
//validate loggedInId
//vlaidate connection req id
//validate status
//if status is accepted
//change it to delisted ? doubt reject or delist
//get the role who sent the req loggedInRole

//if loggedIn role is player
//if sent role is coach, use loggedInId as grouploggedInId
//if sent role is player, use coachId as grouploggedInd
//fetch group using grouploggedInd, remove the loggedInId from groupMembers

//if loggedIn role is coach 
//if req is for player
//if sent role is player, use loggedInId as playerId to remove from group,
//fetch group using loggedInId, remove playerId from group members
//if sent role is coach, use playerId as playerId to remove from group,
//fetch group using loggedInId, remove player Id from group members

//if req is for coach
//if loggedInId matches with req loggedInId, use coachId as coachId to remove from group
//fetch group using loggedInId, remove coachId from groupMembers
//fetch group using coachId, remove loggedInId from groupMembers

//if loggedInId matches with req coachId, use req loggedInId as coachId to remove from group
//fetch group using loggedInId, remove coachId from groupMembers
//fetch group using req loggedInId, remove loggedInId from groupMembers 
