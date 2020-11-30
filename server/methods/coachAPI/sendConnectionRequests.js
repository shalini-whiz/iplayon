import {nameToCollection} from '../dbRequiredRole.js'

//nameToCollection(xData.userId)
Meteor.methods({
	//send connect req to player and coach
	'sendConnectionRequest' : async function(xDATA) {
		var messageValidations = [];
		try{			
			if(xDATA){
				if(typeof xDATA == "string"){
					var data = xDATA.replace("\\", "");
	            	xDATA = JSON.parse(data);
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
			//check for all parameters
			if(xDATA&&xDATA.loggedInId&&xDATA.toEntity&&xDATA.receiverId&&xDATA.loggedInRole){								
				//check for valid loggedIn Id
				var loggedInDetails = Meteor.users.findOne({"userId":xDATA.loggedInId});
				if(loggedInDetails){
					//check for loggedIn role
					if(loggedInDetails.role&&(loggedInDetails.role.toLowerCase()=="coach"||loggedInDetails.role.toLowerCase()=="player")&&(xDATA.loggedInRole.toLowerCase()==loggedInDetails.role.toLowerCase())){
						//check for receiver role
						if(xDATA.toEntity.toLowerCase()=="player"||xDATA.toEntity.toLowerCase()=="coach"){
							//check for valid receiver Id
							var recevrRole = Meteor.users.findOne({"userId":xDATA.receiverId});
							
							//check for valid receiver role, and json role db role matches
							if(recevrRole&&recevrRole.role&&(recevrRole.role.toLowerCase()=="player"||recevrRole.role.toLowerCase()=="coach")&&(xDATA.toEntity.toLowerCase()==recevrRole.role.toLowerCase())){
								//if recvr role is player
								if(xDATA.toEntity.toLowerCase()=="player"){
									//check for sender role
									if(loggedInDetails.role.toLowerCase()=="coach"){
										//call send request to player
										//loggedin role is coach, receiver is player
										var res = await Meteor.call("sendConnectionRequestToPlayer",xDATA)
										try{
											if(res){
												messageValidations = res
											}
										}catch(e){
											var message = e
											var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = e;
											resultJson["data"] = false;
											messageValidations.push(resultJson);
										}

									} else{
										var message = "Only coach can send connection request to player"
										var resultJson = {};
										resultJson["status"] = "failure";                
										resultJson["response"] = message.toString();
										resultJson["data"] = false;
										messageValidations.push(resultJson);
									}
								}
								//if recvr role is coach
								else if(xDATA.toEntity.toLowerCase()=="coach"){
									//check for sender role
									if(loggedInDetails.role.toLowerCase()=="player"){
										//call send request to player
										//loggedin role is player, receiver is coach
										var res = await Meteor.call("sendConnectionRequestToCoach",xDATA)
										try {
											if(res){
												messageValidations = res
											}
										}catch(e){
											var message = e
											var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = e ;
											resultJson["data"] = false;
											messageValidations.push(resultJson);
										}
									}
									else if(loggedInDetails.role.toLowerCase()=="coach"){
										//call send request to coach
										//loggedin role is coach, rcvr is coach
										var res = await Meteor.call("sendConnectionRequestToCoach",xDATA)
										try{
											if(res){
												messageValidations = res
											}
										}catch(e){
											var message = e
											var resultJson = {};
											resultJson["status"] = "failure";                
											resultJson["response"] = e;
											resultJson["data"] = false;
											messageValidations.push(resultJson);
										}
									}
									else{
										var message = "Only player or coach can send connection request to coach"
										var resultJson = {};
										resultJson["status"] = "failure";                
										resultJson["response"] = message.toString();
										resultJson["data"] = false;
										messageValidations.push(resultJson);
									}
								}
								else{
									var message = "Connection requests can be sent to player or coach or group"
									var resultJson = {};
									resultJson["status"] = "failure";                
									resultJson["response"] = message.toString();
									resultJson["data"] = false;
									messageValidations.push(resultJson);
								}
							} else{
								var message = "Receiver is Invalid"
								var resultJson = {};
								resultJson["status"] = "failure";                
								resultJson["response"] = message.toString();
								resultJson["data"] = false;
								messageValidations.push(resultJson);
							}
						}else{
							var message = "Requset can be sent to only player or coach"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message.toString();
							resultJson["data"] = false;
							messageValidations.push(resultJson);
						}
					} else{
						var message = "Logged in role should be coach or player"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						messageValidations.push(resultJson);
					}
				}else{
					var message = "Invalid log in details"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					messageValidations.push(resultJson);
				}
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				messageValidations.push(resultJson);
			}
			return messageValidations;
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
	//req sending by coach to player
	'sendConnectionRequestToPlayer' : function(xDATA) {
		var messageValidations = [];
		try{			

			//find request already sent by player to the same coach
			var reqSentToSamePlayerByCoach = connectionRequests.findOne({
				loggedInId:xDATA.receiverId,
				coachId:xDATA.loggedInId
			});

			//if request already sent by coach to the same player is true
			if(reqSentToSamePlayerByCoach){
				//if stauts is pending
				if(reqSentToSamePlayerByCoach.status&&reqSentToSamePlayerByCoach.status.toLowerCase()=="pending"){
					var message = "Request already sent to you by palyer and request is pending"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message;
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
				//if status is rejected
				else if(reqSentToSamePlayerByCoach.status&&reqSentToSamePlayerByCoach.status.toLowerCase()=="rejected"){
					var message = "Request already sent to you by player and request was rejected"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message;
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
				//if status is accepted
				else if(reqSentToSamePlayerByCoach.status&&reqSentToSamePlayerByCoach.status.toLowerCase()=="accepted"){
					var message = "Request already sent to you by player and request was accepted"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message;
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
			}

			else if(reqSentToSamePlayerByCoach==undefined){
				//find request sent
				var requestSent = connectionRequests.findOne({
					loggedInId:xDATA.loggedInId,
					playerId:xDATA.receiverId
				});
				//if request is not sent insert
				if(requestSent==undefined){
					var insertReq = connectionRequests.insert({
						loggedInId:xDATA.loggedInId,
						toEntity:xDATA.toEntity,
						playerId:xDATA.receiverId,
						status:"pending",
						receiverId:xDATA.receiverId,
						loggedInRole:xDATA.loggedInRole
					});
					//if insert is success
					if(insertReq){
						var message = "Request sent"
						var resultJson = {};
						resultJson["status"] = "success";                
						resultJson["response"] = message;
						resultJson["data"] = insertReq;
						messageValidations.push(resultJson);
						return messageValidations
					} else{
						var message = "Request cannot be sent"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message;
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				} 
				//if request is already sent 
				else{
					//if already request sent is rejected  update status
					if(requestSent!=undefined&&requestSent.status&&requestSent.status=="rejected"){
						var updateReq = connectionRequests.update({
							loggedInId:xDATA.loggedInId,
							toEntity:xDATA.toEntity,
							playerId:xDATA.receiverId,
						}, {$set:{
								status:"pending",
							}
						});

						//if update success
						if(updateReq){
							var message = "Request re-sent"
							var resultJson = {};
							resultJson["status"] = "success";                
							resultJson["response"] = message;
							resultJson["data"] = updateReq;
							messageValidations.push(resultJson);
							return messageValidations
						}

						else{
							var message = "Request cannot be sent"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message;
							resultJson["data"] = false;
							messageValidations.push(resultJson);
							return messageValidations
						}
					}

					//if request already sent and if its  
					//accepted or pending
					else if(requestSent.status=="accepted"){
						var message = "Request already sent and your request was accepted"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message;
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
					else if(requestSent.status=="pending"){
						var message = "Request already sent and your request is pending"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message;
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				}
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
	//connection req to coach by player and to coach by coach
	'sendConnectionRequestToCoach' : function(xDATA) {
		var messageValidations = [];
		try{			
			//find request already sent by coach to the same coach

			//find request already sent by coach to the same player
			var reqSentToSamePlayerByCoach = connectionRequests.findOne({
				loggedInId:xDATA.receiverId,
				$or:[
					{playerId:xDATA.loggedInId},
					{coachId:xDATA.loggedInId}
				]
			});

			//if request already sent by coach to the same player is true
			if(reqSentToSamePlayerByCoach){
				//if stauts is pending
				if(reqSentToSamePlayerByCoach.status&&reqSentToSamePlayerByCoach.status.toLowerCase()=="pending"){
					var message = "Request already sent to you by coach and request is pending"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message;
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
				//if status is rejected
				else if(reqSentToSamePlayerByCoach.status&&reqSentToSamePlayerByCoach.status.toLowerCase()=="rejected"){
					var message = "Request already sent to you by coach and request was rejected"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message;
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
				//if status is accepted
				else if(reqSentToSamePlayerByCoach.status&&reqSentToSamePlayerByCoach.status.toLowerCase()=="accepted"){
					var message = "Request already sent to you by coach and request was accepted"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message;
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
			}

			else if(reqSentToSamePlayerByCoach==undefined){
				//find request sent
				var requestSent = connectionRequests.findOne({
					loggedInId:xDATA.loggedInId,
					coachId:xDATA.receiverId
				});
				//if request is not sent insert
				if(requestSent==undefined){
					var insertReq = connectionRequests.insert({
						loggedInId:xDATA.loggedInId,
						toEntity:xDATA.toEntity,
						coachId:xDATA.receiverId,
						status:"pending",
						loggedInRole:xDATA.loggedInRole,
						receiverId:xDATA.receiverId
					});
					//if insert is success
					if(insertReq){
						var message = "Request sent"
						var resultJson = {};
						resultJson["status"] = "success";                
						resultJson["response"] = message;
						resultJson["data"] = insertReq;
						messageValidations.push(resultJson);
						return messageValidations
					} else{
						var message = "Request cannot be sent"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message;
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				} 
				//if request is already sent 
				else{
					//if already request sent is rejected  update status
					if(requestSent!=undefined&&requestSent.status&&requestSent.status=="rejected"){
						var updateReq = connectionRequests.update({
							loggedInId:xDATA.loggedInId,
							toEntity:xDATA.toEntity,
							coachId:xDATA.receiverId,
						}, {$set:{
								status:"pending",
							}
						});

						//if update success
						if(updateReq){
							var message = "Request re-sent"
							var resultJson = {};
							resultJson["status"] = "success";                
							resultJson["response"] = message;
							resultJson["data"] = updateReq;
							messageValidations.push(resultJson);
							return messageValidations
						}

						else{
							var message = "Request cannot be sent"
							var resultJson = {};
							resultJson["status"] = "failure";                
							resultJson["response"] = message;
							resultJson["data"] = false;
							messageValidations.push(resultJson);
							return messageValidations
						}
					}

					//if request already sent and if it is  
					//accepted or pending
					else if(requestSent.status=="accepted"){
						var message = "Request already sent and your request was accepted"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message;
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
					else if(requestSent.status=="pending"){
						var message = "Request already sent and your request is pending"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message;
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				}
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
	//get sent details of sent connection req to players by coach
	'getSentConnectionDetailsToPlayers':function(xDATA){
		var messageValidations = [];
		try{
			//valid params			
			if(xDATA&&xDATA.coachId){			
				var connectionRequestsDEt = []
				//validate coachId
				var validCoach = Meteor.users.findOne({"userId":xDATA.coachId,role:"Coach"});
				if(validCoach){			

					connectionRequests.find({
						"loggedInId":xDATA.coachId,
						"toEntity":"Player"
					}).fetch().forEach(function(e,i){

						var playerIdF = e;
						var playerDEt = nameToCollection(playerIdF.playerId).findOne({
							"userId":playerIdF.playerId,
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
								"receiverId":playerIdF.playerId,
								"receiverName":playerName,
								"gender":gender,
								"dateOfBirth":dateOfBirth,
								"address":address,
								"pinCode":pinCode,
								"city":city,
								"guardianName":guardianName,
								"phoneNumber":phNum,
								"statusOfConnection":playerIdF.status,
								"connectionSentDate":playerIdF.sentDateTime,
								"receiverRole":"Player"
							}
							connectionRequestsDEt.push(data)
						}
					});

					//if of details
					if(connectionRequestsDEt.length!=0){
						var message = "Request sent"
						var resultJson = {};
						resultJson["status"] = "success";                
						resultJson["response"] = message;
						resultJson["data"] = connectionRequestsDEt;
						messageValidations.push(resultJson);
						return messageValidations
					} else{
						var message = "There are no requests sent"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				}
				else{
					var message = "Coach is not valid"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
			}
			else{
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
	//get sent details of sent connection req to coach by players
	'getSentConnectionDetailsToCoachByPlayers':function(xDATA){
		var messageValidations = [];
		try{
			//valid params

			if(xDATA&&xDATA.playerId){			
				var connectionRequestsDEt = []
				//validate playerId
				var validPlayer = Meteor.users.findOne({"userId":xDATA.playerId,role:"Player"});
				if(validPlayer){			
					connectionRequests.find({
						"loggedInId":xDATA.playerId,
						"toEntity":"Coach"
					}).fetch().forEach(function(e,i){

						var coachIdF = e;
						var coachDet = otherUsers.findOne({
							"userId":coachIdF.coachId,
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
								"receiverId":coachIdF.coachId,
								"receiverName":coachName,
								"gender":gender,
								"dateOfBirth":dateOfBirth,
								"address":address,
								"pinCode":pinCode,
								"city":city,
								"guardianName":guardianName,
								"phoneNumber":phNum,
								"statusOfConnection":coachIdF.status,
								"connectionSentDate":coachIdF.sentDateTime,
								"receiverRole":"Coach"
							}
							connectionRequestsDEt.push(data)
						}
					});

					//if of details
					if(connectionRequestsDEt.length!=0){
						var message = "Request sent details"
						var resultJson = {};
						resultJson["status"] = "success";                
						resultJson["response"] = message;
						resultJson["data"] = connectionRequestsDEt;
						messageValidations.push(resultJson);
						return messageValidations
					} else{
						var message = "There are no requests sent"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				}
				else{
					var message = "Player is not valid"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
			}
			else{
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
	//get sent details of sent connection req to coach by coach
	'getSentConnectionDetailsToCoachByCoach':function(xDATA){
		var messageValidations = [];
		try{
			if(xDATA&&xDATA.coachId){			
				var connectionRequestsDEt = []
				//validate coachId
				var validCoach = Meteor.users.findOne({"userId":xDATA.coachId,role:"Coach"});
				if(validCoach){			
					connectionRequests.find({
						"loggedInId":xDATA.coachId,
						"toEntity":"Coach"
					}).fetch().forEach(function(e,i){
						var coachIdF = e;
						var coachDet = otherUsers.findOne({
							"userId":coachIdF.coachId,
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
								"receiverId":coachIdF.coachId,
								"receiverName":coachName,
								"gender":gender,
								"dateOfBirth":dateOfBirth,
								"address":address,
								"pinCode":pinCode,
								"city":city,
								"guardianName":guardianName,
								"phoneNumber":phNum,
								"statusOfConnection":coachIdF.status,
								"connectionSentDate":coachIdF.sentDateTime,
								"receiverRole":"Coach"
							}
							connectionRequestsDEt.push(data)
						}
					});

					//if of details
					if(connectionRequestsDEt.length!=0){
						var message = "Request sent details"
						var resultJson = {};
						resultJson["status"] = "success";                
						resultJson["response"] = message;
						resultJson["data"] = connectionRequestsDEt;
						messageValidations.push(resultJson);
						return messageValidations
					} else{
						var message = "There are no requests sent"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						messageValidations.push(resultJson);
						return messageValidations
					}
				}
				else{
					var message = "Coach is not valid"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
			}
			else{
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
	//get sent details of sent connection req to coach and players by coach
	'getSentConnectionDetailsToCoachPlayerByCoach':function(xDATA){
		var messageValidations = [];
        var connectionRequestsDEt = [];
		try{
			//valid params			
			if(xDATA&&xDATA.coachId){			
				var connectionRes = []
				//validate playerId
				var validCoach = Meteor.users.findOne({"userId":xDATA.coachId,role:"Coach"});
				if(validCoach){		
                    connectionRequests.find({
                        "loggedInId":xDATA.coachId,
                    }).fetch().forEach(function(e,i){
                        var coachIdF = e;
                        var coachDet;
                        if(coachIdF.toEntity=="Coach"){
                            coachDet = otherUsers.findOne({
                                "userId":coachIdF.coachId,
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
                                    "receiverId":coachIdF.coachId,
                                    "receiverName":coachName,
                                    "gender":gender,
                                    "dateOfBirth":dateOfBirth,
                                    "address":address,
                                    "pinCode":pinCode,
                                    "city":city,
                                    "guardianName":guardianName,
                                    "phoneNumber":phNum,
                                    "statusOfConnection":coachIdF.status,
                                    "connectionSentDate":coachIdF.sentDateTime,
                                    "receiverRole":"Coach"
                                }
                                connectionRequestsDEt.push(data)
                            }
                        }
                        else if(coachIdF.toEntity=="Player"){
                            var playerIdF = e;
                            var playerDEt = nameToCollection(playerIdF.playerId).findOne({
                                "userId":playerIdF.playerId,
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
                                    "receiverId":playerIdF.playerId,
                                    "receiverName":playerName,
                                    "gender":gender,
                                    "dateOfBirth":dateOfBirth,
                                    "address":address,
                                    "pinCode":pinCode,
                                    "city":city,
                                    "guardianName":guardianName,
                                    "phoneNumber":phNum,
                                    "statusOfConnection":playerIdF.status,
                                    "connectionSentDate":playerIdF.sentDateTime,
                                    "receiverRole":"Player"
                                }
                                connectionRequestsDEt.push(data)
                            }
                        }
                    });	
                    //if details
                    //if of details
                    if(connectionRequestsDEt.length!=0){
                        var message = "Request sent details"
                        var resultJson = {};
                        resultJson["status"] = "success";                
                        resultJson["response"] = message;
                        resultJson["data"] = connectionRequestsDEt;
                        messageValidations.push(resultJson);
                        return messageValidations
                    } else{
                        var message = "There are no requests sent"
                        var resultJson = {};
                        resultJson["status"] = "failure";                
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        messageValidations.push(resultJson);
                        return messageValidations
                    }
				}
				else{
					var message = "Coach is not valid"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					messageValidations.push(resultJson);
					return messageValidations
				}
			}
			else{
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
})

//delete request sent by me
//get loggedInId and requestId
//check requestId sent by loggedInId
//delete the request if not accepted
Meteor.methods({
	"deleteConnectionRequestSentByLoggedInId":function(xDATA){
		var messageValidations = []
        try {
            //check for params
            if (xDATA) {
                var data = xDATA.replace("\\", "");
                xDATA = JSON.parse(data);
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                messageValidations.push(resultJson);
                return messageValidations
            }

            //check for valid loggedInId
            if (xDATA && xDATA.loggedInId && xDATA.connectionReqId) {
                //find coach or player id in db
                var det = Meteor.users.findOne({
                    "userId": xDATA.loggedInId,
                    $or:[
                    	{role: "Coach"},
                    	{role:"Player"}
                    ]
                });;
                var detLog;
                if(det&&det.role=="Player"){
                	detLog = nameToCollection(xDATA.loggedInId).findOne({userId:xDATA.loggedInId})
                }
                else if(det&&det.role=="Coach"){
                	detLog = otherUsers.findOne({
                    	"userId": xDATA.loggedInId,
                    	role: "Coach"
                	})
            	}
            	else{
            		var message = "Login is Invalid"
	                var resultJson = {};
	                resultJson["status"] = "failure";
	                resultJson["response"] = message.toString();
	                resultJson["data"] = false;
	                messageValidations.push(resultJson);
	                return messageValidations
            	}
                if (det && detLog) {
                	//find connection req is valid
                    var conreq = connectionRequests.findOne({
                    	"_id":xDATA.connectionReqId,
                    	loggedInId:xDATA.loggedInId,
                    	status:{$ne:"accepted"}
                    });
                    //if this is not accepted connection
                    if (conreq) {
                        var conreqAcc = conreq;
                        var deletereq = connectionRequests.remove({"_id":xDATA.connectionReqId});
                        if(deletereq){
                        	var message = "Connection Request Deleted"
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = conreq;
                            messageValidations.push(resultJson);
                            return messageValidations
                        } else{
                        	var message = "Request cannot be deleted"
	                        var resultJson = {};
	                        resultJson["status"] = "failure";
	                        resultJson["response"] = message.toString();
	                        resultJson["data"] = false;
	                        messageValidations.push(resultJson);
	                        return messageValidations
                        }
                    } else {
                        var message = "Request is not valid"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        messageValidations.push(resultJson);
                        return messageValidations
                    }
                } else {
                    var message = "Logged In person is not valid"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    messageValidations.push(resultJson);
                    return messageValidations
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                messageValidations.push(resultJson);
                return messageValidations
            }

        } catch (e) {
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

//delete request sent by me and others
//check for loggedInId
//check for connect request id
//check the loggedInRole
//if the role is player
//check for request loggedInId matches with current loggedInId
//else request playerId matches with current loggedInId
//if matches delete the record if the req is not accepted
//if role is coach
//check for request loggedInId matches with current loggedInId
//else check for request coachId matches with current loggedInId
//if matches detete the record if the req is not accepted

//player --> coach
//coach --> player
//coach --> coach
Meteor.methods({
	"deleteAllConnectionReqReceivedByLoggedInId":function(xDATA){
		var messageValidations = []
		try {
            //check for params
            if (xDATA) {
                var data = xDATA.replace("\\", "");
                xDATA = JSON.parse(data);
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                messageValidations.push(resultJson);
                return messageValidations
            }
            //check for valid loggedInId
            if (xDATA && xDATA.loggedInId && xDATA.connectionReqId) {
                //find coach or player id in db
                var det = Meteor.users.findOne({
                    "userId": xDATA.loggedInId,
                    $or:[
                    	{role: "Coach"},
                    	{role:"Player"}
                    ]
                });;
                var detLog;
                if(det&&det.role=="Player"){
                	detLog = nameToCollection(xDATA.loggedInId).findOne({userId:xDATA.loggedInId})
                }
                else if(det&&det.role=="Coach"){
                	detLog = otherUsers.findOne({
                    	"userId": xDATA.loggedInId,
                    	role: "Coach"
                	})
            	}
            	else{
            		var message = "Login is Invalid"
	                var resultJson = {};
	                resultJson["status"] = "failure";
	                resultJson["response"] = message.toString();
	                resultJson["data"] = false;
	                messageValidations.push(resultJson);
	                return messageValidations
            	}
                if (det && detLog) {
                	//find connection req is valid
                    var conreq = connectionRequests.findOne({
                    	"_id":xDATA.connectionReqId,
                    	status:{$ne:"accepted"}
                    });
                    //if this is not accepted connection
                    if (conreq) {
                        var conreqAcc = conreq;
                        //if loggedIn role is player
                        if(detLog.role=="Player"){
                        	//check request loggedInId matches with loggedInId
                        	if(conreqAcc.loggedInId==detLog.userId){
                        		var deletereq = connectionRequests.remove({"_id":xDATA.connectionReqId});
		                        if(deletereq){
		                        	var message = "Connection Request Deleted"
		                            var resultJson = {};
		                            resultJson["status"] = "success";
		                            resultJson["response"] = message.toString();
		                            resultJson["data"] = conreq;
		                            messageValidations.push(resultJson);
		                            return messageValidations
		                        } else{
		                        	var message = "Request cannot be deleted"
			                        var resultJson = {};
			                        resultJson["status"] = "failure";
			                        resultJson["response"] = message.toString();
			                        resultJson["data"] = false;
			                        messageValidations.push(resultJson);
			                        return messageValidations
		                        }
                        	} 
                        	//check request plyerId matches with loggedInId
                        	else if(conreqAcc.playerId==detLog.userId){
                        		var deletereq = connectionRequests.remove({"_id":xDATA.connectionReqId});
		                        if(deletereq){
		                        	var message = "Connection Request Deleted"
		                            var resultJson = {};
		                            resultJson["status"] = "success";
		                            resultJson["response"] = message.toString();
		                            resultJson["data"] = conreq;
		                            messageValidations.push(resultJson);
		                            return messageValidations
		                        } else{
		                        	var message = "Request cannot be deleted"
			                        var resultJson = {};
			                        resultJson["status"] = "failure";
			                        resultJson["response"] = message.toString();
			                        resultJson["data"] = false;
			                        messageValidations.push(resultJson);
			                        return messageValidations
		                        }
                        	}
                        	else{
                        		var message = "Request cannot be deleted"
		                        var resultJson = {};
		                        resultJson["status"] = "failure";
		                        resultJson["response"] = message.toString();
		                        resultJson["data"] = false;
		                        messageValidations.push(resultJson);
		                        return messageValidations
                        	}
                        } 
                        //if loggedIn role is coach
                        else if(detLog.role=="Coach"){
                        	//check request loggedInId matches with loggedInId
                        	if(conreqAcc.loggedInId==detLog.userId){
                        		var deletereq = connectionRequests.remove({"_id":xDATA.connectionReqId});
		                        if(deletereq){
		                        	var message = "Connection Request Deleted"
		                            var resultJson = {};
		                            resultJson["status"] = "success";
		                            resultJson["response"] = message.toString();
		                            resultJson["data"] = conreq;
		                            messageValidations.push(resultJson);
		                            return messageValidations
		                        } else{
		                        	 var message = "Request cannot be deleted"
			                        var resultJson = {};
			                        resultJson["status"] = "failure";
			                        resultJson["response"] = message.toString();
			                        resultJson["data"] = false;
			                        messageValidations.push(resultJson);
			                        return messageValidations
		                        }
                        	} 
                        	//check request coachId matches with loggedInId
                        	else if(conreqAcc.coachId==detLog.userId){
                        		var deletereq = connectionRequests.remove({"_id":xDATA.connectionReqId});
		                        if(deletereq){
		                            var resultJson = {};
		                            resultJson["status"] = "success";
		                            resultJson["response"] = message.toString();
		                            resultJson["data"] = conreq;
		                            messageValidations.push(resultJson);
		                            return messageValidations
		                        } else{
		                        	var message = "Request cannot be deleted"
			                        var resultJson = {};
			                        resultJson["status"] = "failure";
			                        resultJson["response"] = message.toString();
			                        resultJson["data"] = false;
			                        messageValidations.push(resultJson);
			                        return messageValidations
		                        }
                        	}
                        	else{
                        		var message = "Request cannot be deleted"
		                        var resultJson = {};
		                        resultJson["status"] = "failure";
		                        resultJson["response"] = message.toString();
		                        resultJson["data"] = false;
		                        messageValidations.push(resultJson);
		                        return messageValidations
                        	}
                        }
                        //else return error
                        else{
                        	var message = "Role is not valid"
	                        var resultJson = {};
	                        resultJson["status"] = "failure";
	                        resultJson["response"] = message.toString();
	                        resultJson["data"] = false;
	                        messageValidations.push(resultJson);
	                        return messageValidations
                        }
                    } else {
                        var message = "Request is not valid"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        messageValidations.push(resultJson);
                        return messageValidations
                    }
                } else {
                    var message = "Logged In person is not valid"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    messageValidations.push(resultJson);
                    return messageValidations
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                messageValidations.push(resultJson);
                return messageValidations
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            messageValidations.push(resultJson);
            return messageValidations
        }
	}
})