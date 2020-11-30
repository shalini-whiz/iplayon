import {
    initDBS
}
from '../dbRequiredRole.js'


Meteor.methods({
	"getTeamDetailsForToss":async function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_TEAM_DETAILS_FAIL_MSG
        }
        try {
			if (typeof xData == "string") {
			    xData = xData.replace("\\", "");
			    xData = JSON.parse(xData);
			}
			if (xData) {

				var sTeams = new TeamsFormats(xData)
				var nullTournId = sTeams.nullUndefinedEmpty("tournamentId")
			 	var nullTeamId = sTeams.nullUndefinedEmpty("teamId")

			 	if(nullTournId=="1"){
				 	if(nullTeamId=="1"){
				 		var tournamentFind = events.findOne({
			                "_id": xData.tournamentId
			            })
			            var dbsrequired = ["userDetailsTT", "playerTeams"]

			            var userDetailsTT = "userDetailsTT"
			            var playerTeams = "playerTeams"
			            var considerTeamEventBool = null
			            if (tournamentFind == undefined || tournamentFind == null) {
			                tournamentFind = pastEvents.findOne({
			                    "_id": xData.tournamentId
			                })
			            }

			            var resDB = await Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
			            try {
			                if (resDB) {
			                    if (resDB.changeDb && resDB.changeDb == true) {
			                        if (resDB.changedDbNames.length != 0) {
			                            userDetailsTT = resDB.changedDbNames[0]
			                            playerTeams = resDB.changedDbNames[1]
			                            considerTeamEventBool = true
			                            var playersDB = initDBS("playersDB")
			                            if(_.contains(playersDB,userDetailsTT)){
			                                considerTeamEventBool = null
			                            }
			                        }
			                    }
			                }
			            }catch(e){
			            }
			            var s = global[playerTeams].aggregate([{
			                $match: {
			                    "_id": xData.teamId
			                }
			            }, {
			                $project: {
			                    teamName: "$teamName"
			                }
			            }])
			            

			            if(s && s.length && s[0] && s[0].teamName){
			            	res.status = SUCCESS_STATUS
			            	res.message = GET_TEAM_DETAILS_SUCCESS_MSG
			            	res.data = s
			            }

				 	}else{
				 		res.message = nullTeamId
				 	}
			 	}else{
			 		res.message = nullTournId
			 	}
			} else {
				res.message = "parameters  " + ARE_NULL_MSG
			}
			return res
		} catch (e) {
			res.message = CATCH_MSG + e
			if (e && e.toString()) {
			    res.error = CATCH_MSG + e.toString()
			}
			return res
		}	  
	}
})

Meteor.methods({
	"validateTeamDetailedDrawsForToss":async function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_FORMAT_VALIDATIONS_FAIL_MSG
        }
        try {
			if (typeof xData == "string") {
			    xData = xData.replace("\\", "");
			    xData = JSON.parse(xData);
			}
			if (xData) {
				//teamDetailedScoresOthrFormat validations
				var sTeams = new TeamsFormats(xData)
				var nullTournId = sTeams.nullUndefinedEmpty("tournamentId")
			 	var nulleventName = sTeams.nullUndefinedEmpty("eventName")
			 	var nullTeamFormatId = sTeams.nullUndefinedEmpty("orgTeamFormatId")
			 	var nullTeamsDetScoreOth = sTeams.nullUndefined("teamsDetScoreOth")

			 	if(nullTeamFormatId=="1"){
				 	if(nullTournId=="1"){
				 		if(nulleventName=="1"){
				 			var checkValidEveTourn = sTeams.checkValidTournamentIDEvent()
				 			if(checkValidEveTourn=="1"){
				 				var checkValidTeamFormat = sTeams.checkValidTeamFormatID("orgTeamFormatId")
				 				if(checkValidTeamFormat=="1"){
				 					if(nullTeamsDetScoreOth=="1"){
				 						var checkValidteamsDetScore = sTeams.checkValidObjectType("teamsDetScoreOth",false)
				 						if(checkValidteamsDetScore=="1"){
				 							res.status = SUCCESS_STATUS
				 							res.message = TEAMS_OTR_FORMAT_VALIDATIONS_1_SUCCESS_MSG
				 						}else{
				 							res.message = checkValidteamsDetScore
				 						}
				 					}else{
				 						res.message = nullTeamsDetScoreOth
				 					}
				 				}else{
				 					res.message = checkValidTeamFormat
				 				}
				 			}else{
				 				res.message = checkValidEveTourn
				 			}
				 		}else{
				 			res.message = nulleventName
				 		}
				 	}else{
				 		res.message = nullTournId
				 	}
			 	}else{
			 		res.message = nullTeamFormatId
			 	}
			} else {
				res.message = "parameters  " + ARE_NULL_MSG
			}
			return res
		} catch (e) {
			res.message = CATCH_MSG + e
			if (e && e.toString()) {
			    res.error = CATCH_MSG + e.toString()
			}
			return res
		}	  
	}
})


Meteor.methods({
	"validateTeamsDetScoreOth":async function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_FORMAT_VALIDATIONS_FAIL_MSG
        }
        try {
			if (typeof xData == "string") {
			    xData = xData.replace("\\", "");
			    xData = JSON.parse(xData);
			}
			if (xData) {
				var sTeams = new TeamsFormats(xData)
				//teamsDetScoreOth
				var nullmatchNumber = sTeams.nullUndefinedEmpty("matchNumber")
				var nullroundNumber = sTeams.nullUndefinedEmpty("roundNumber")
				var nullteamAID = sTeams.nullUndefinedEmpty("teamAID")
				var nullteamBID = sTeams.nullUndefinedEmpty("teamBID")
				var nullfinalTeamWinner = sTeams.nullUndefinedEmpty("finalTeamWinner")
				var nullteamMatchType = sTeams.nullUndefinedEmpty("teamMatchType")
				var nullSpecifications = sTeams.nullUndefined("matchTeamOth")

				if(nullmatchNumber=="1"){
					var matchNumValid = sTeams.validateNumb("matchNumber")

					if(matchNumValid=="1"){
						if(nullroundNumber=="1"){
							var roundNumValid = sTeams.validateNumb("roundNumber")
							if(roundNumValid=="1"){
								if(nullteamAID=="1" || xData.teamAID == "1"){
									if(nullteamBID=="1" || xData.teamBID == "1"){
										if(nullfinalTeamWinner=="1"){
											if(nullteamMatchType=="1"){
												var validTeamAId;
												if(xData.teamAID!="1"){
													validTeamAId = await Meteor.call("checkValidTeamIds",xData.tournamentId,xData.teamAID)
												}
												if((validTeamAId && validTeamAId.status==SUCCESS_STATUS)||(xData.teamAID=="1")){
													var validTeamBId;
													if(xData.teamBID!="1"){
														validTeamBId = await Meteor.call("checkValidTeamIds",xData.tournamentId,xData.teamBID)
													}
													if((validTeamBId && validTeamBId.status==SUCCESS_STATUS)||(xData.teamBID=="1")){
														var checkMatchTypeEnd = sTeams.containsGivenValues("teamMatchType",["bye","completed","notplayed","walkover"],true)
														if(checkMatchTypeEnd=="1"){
															var checkFinalTeamWinner = sTeams.containsGivenValues("finalTeamWinner",[xData.teamAID,xData.teamBID],false)
															if(checkFinalTeamWinner=="1"||xData.finalTeamWinner=="1"){
																//specifications
																var checkValidspecifications = sTeams.checkValidObjectType("matchTeamOth",true)
				 												if(checkValidspecifications=="1"){
				 													res.status = SUCCESS_STATUS
				 													res.message = TEAMS_OTR_FORMAT_VALIDATIONS_2_SUCCESS_MSG
				 												}else{
				 													res.message = checkValidspecifications + " or finalTeamWinner should be 1"
				 												}

															}else{
																res.message = checkFinalTeamWinner
															}
														}else{
															res.message = checkMatchTypeEnd
														}
													}else if(validTeamBId && validTeamBId.status==FAIL_STATUS && validTeamBId.message){
														res.message = "teamBID "+IS_INVALID_MSG+ " or teamBID should be 1"
													}
												}else if(validTeamAId && validTeamAId.status==FAIL_STATUS && validTeamAId.message){
													res.message = "teamAID "+IS_INVALID_MSG + " or teamAID should be 1"
												}
											}else{
												res.message = nullteamMatchType
											}
										}else{
											res.message = nullfinalTeamWinner + " or finalTeamWinner should be 1"
										}
									}else{
										res.message = nullteamBID+ " or teamBID should be 1"
									}
								}else{
									res.message = nullteamAID  + " or teamAID should be 1"
								}
							}else{
								res.message = roundNumValid
							}
						}else{
							res.message = nullroundNumber
						}
					}else{
						res.message = matchNumValid
					}
				}else{
					res.message = nullmatchNumber
				}
			} else {
				res.message = "parameters  " + ARE_NULL_MSG
			}

			return res
		} catch (e) {
			res.message = CATCH_MSG + e
			if (e && e.toString()) {
			    res.error = CATCH_MSG + e.toString()
			}
			return res
		}	  
	}
})

Meteor.methods({
	"matchTeamOthValidations":async function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_FORMAT_VALIDATIONS_FAIL_MSG
        }
        try {
			if (typeof xData == "string") {
			    xData = xData.replace("\\", "");
			    xData = JSON.parse(xData);
			}
			if (xData) {
				var sTeams = new TeamsFormats(xData)
				var specNo = sTeams.nullUndefinedEmpty("no")
				var playerAID = sTeams.nullUndefinedEmpty("playerAId")
				var playerBID = sTeams.nullUndefinedEmpty("playerBId")
				var setScoresA = sTeams.nullUndefined("setScoresA")
				var setScoresB = sTeams.nullUndefined("setScoresB")
				var winnerIdPlayer = sTeams.nullUndefinedEmpty("winnerIdPlayer")
				var matchType = sTeams.nullUndefinedEmpty("matchType")
				var winnerIdTeam = sTeams.nullUndefinedEmpty("winnerIdTeam")
				var teamAD1PlayerId = sTeams.nullUndefinedEmpty("playerA1Id")
				var teamAD2PlayerId = sTeams.nullUndefinedEmpty("playerA2Id")
				var teamBD1PlayerId = sTeams.nullUndefinedEmpty("playerB1Id")
				var teamBD2PlayerId = sTeams.nullUndefinedEmpty("playerB2Id")
				var winnerD1PlayerId = sTeams.nullUndefinedEmpty("winnerD1PlayerId")
				var winnerD2PlayerId = sTeams.nullUndefined("winnerD2PlayerId")
				var matchProjectType = sTeams.nullUndefinedEmpty("matchProjectType")

				if(specNo=="1"){
					var specNoNum = sTeams.validateNumb("no")
					if(specNoNum=="1"){
						if(playerAID=="1" || xData.playerAID=="1"){
							//check playerId valid
							var playerAIDCheck;
							if(xData.playerAID!="1"){
								playerAIDCheck = sTeams.checkForValidPlayerId("playerAID")
							}
							if(playerAIDCheck == "1" || xData.playerAID=="1"){
								if(playerBID=="1"|| xData.playerBID=="1"){
									//check playerId valid
									var playerBIDCheck;
									if(xData.playerBID!="1"){
										playerBIDCheck = sTeams.checkForValidPlayerId("playerBID")
									}
									if(playerBIDCheck=="1"||xData.playerBID=="1"){
										if(setScoresA=="1"){
											var checkSetScoresA = sTeams.checkSetScores("setScoresA",7)
											if(checkSetScoresA=="1"){ 
												if(setScoresB=="1"){
													var checkSetScoresB = sTeams.checkSetScores("setScoresB",7)

													if(checkSetScoresB=="1"){
														if(winnerIdTeam=="1" || xData.winnerIdTeam=="1"){
															//check valid winnerteamId
															var validTeamId;
															if(xData.winnerIdTeam!="1"){
																validTeamId = await Meteor.call("checkValidTeamIds",xData.tournamentId,xData.winnerIdTeam)
															}
														

															if((validTeamId && validTeamId.status==SUCCESS_STATUS)|| (xData.winnerIdTeam=="1")){
																if(matchType=="1"){
																	var matchTypeValid = sTeams.containsGivenValues("matchType",["bye","completed","notplayed","walkover"],true)
																	
																	if(matchTypeValid=="1"){
																		if(true){
																			if(teamAD1PlayerId=="1" || xData.teamAD1PlayerId=="1"){
																				//check playerId
																				var teamAD1PlayerIdCheck;
																				if(xData.teamAD1PlayerId!="1"){
																					teamAD1PlayerIdCheck = sTeams.checkForValidPlayerId("teamAD1PlayerId")
																				}

																				if(teamAD1PlayerIdCheck=="1" || xData.teamAD1PlayerId=="1"){
																					if(teamAD2PlayerId=="1" || xData.teamAD2PlayerId=="1"){
																						//check playerId
																						var teamAD2PlayerIdCheck;
																						if(xData.teamAD2PlayerId!="1"){
																							teamAD2PlayerIdCheck = sTeams.checkForValidPlayerId("teamAD2PlayerId")
																						}
																						if(teamAD2PlayerIdCheck=="1" || xData.teamAD2PlayerId == "1"){
																							if(teamBD1PlayerId=="1" || xData.teamBD1PlayerId=="1"){
																								//check playerId 
																								var teamBD1PlayerIdCheck;
																								if(xData.teamBD1PlayerId!="1"){
																									teamBD1PlayerIdCheck = sTeams.checkForValidPlayerId("teamBD1PlayerId")
																								}
																								if(teamBD1PlayerIdCheck=="1" || xData.teamBD1PlayerId == "1"){
																									if(teamBD2PlayerId=="1" || xData.teamBD2PlayerId=="1"){
																										//check playerId 
																										var teamBD2PlayerIdCheck;
																										if(xData.teamBD2PlayerId!="1"){
																											teamBD2PlayerIdCheck = sTeams.checkForValidPlayerId("teamBD2PlayerId")
																										}
																										if(teamBD2PlayerIdCheck=="1" || xData.teamBD2PlayerId=="1"){
																											if(winnerD1PlayerId=="1" || xData.winnerD1PlayerId =="1"){
																												//check playerId 
																												var winnerD1PlayerIdCheck;
																												if(xData.winnerD1PlayerId!="1"){
																													winnerD1PlayerIdCheck = sTeams.checkForValidPlayerId("winnerD1PlayerId")
																												}
																												if(winnerD1PlayerIdCheck == "1"||xData.winnerD1PlayerId=="1"){
																													if(winnerD2PlayerId=="1"|| xData.winnerD2PlayerId =="1"){
																														//check playerId 
																														var winnerD2PlayerIdCheck;
																														if(xData.winnerD2PlayerId!="1"){
																															winnerD2PlayerIdCheck = sTeams.checkForValidPlayerId("winnerD2PlayerId")
																														}

																														if(winnerD2PlayerIdCheck=="1" || xData.winnerD2PlayerId=="1"){
																															if(matchProjectType=="1"){
																																var matchProjectTypeValid = sTeams.validateNumb("matchProjectType")

																																if(matchProjectTypeValid=="1"){
																																	var matchProjectTypeValid1 = sTeams.containsGivenValues("matchProjectType",["1","2"],false)
																																	if(matchProjectTypeValid1=="1"){
																																		res.status = SUCCESS_STATUS
																																		res.message = TEAMS_OTR_FORMAT_VALIDATIONS_3_SUCCESS_MSG
																																	}else{
																																		res.message = matchProjectTypeValid1
																																	}
																																}else{
																																	res.message = matchProjectTypeValid
																																}
																															}else{
																																res.message = matchProjectType
																															}
																														}else{
																															res.message = winnerD2PlayerIdCheck + " or winnerD2PlayerId should be 1"
																														}
																													}else{
																														res.message = winnerD2PlayerId + " or winnerD2PlayerId should be 1"
																													}
																												}else{
																													res.message = winnerD1PlayerId + " or winnerD1PlayerId should be 1"
																												}

																											}else{
																												res.message = winnerD1PlayerId + " or winnerD1PlayerId should be 1"
																											}
																										}else{
																											res.message = teamBD2PlayerIdCheck + " or teamBD2PlayerId should be 1"
																										}
																									}else{
																										res.message = teamBD2PlayerId + " or teamBD2PlayerId should be 1"
																									}
																								}else{
																									res.message = teamBD1PlayerIdCheck + " or teamBD1PlayerId should be 1"
																								}
																							}else{
																								res.message = teamBD1PlayerId + " or teamBD1PlayerId should be 1"
																							}
																						}else{
																							res.message = teamAD2PlayerIdCheck + " or teamAD2PlayerId should be 1"
																						}
																					}else{
																						res.message = teamAD2PlayerId + " or teamAD2PlayerId should be 1"
																					}
																				}else{
																					res.message = teamAD1PlayerIdCheck + " or teamAD1PlayerId should be 1"
																				}
																			}else{
																				res.message = teamAD1PlayerId+ " or teamAD1PlayerId should be 1"
																			}
																		}
																	}else{
																		res.message = matchTypeValid
																	}
																}else{
																	res.message = matchType
																}
															}else if(validTeamId && validTeamId.status==FAIL_STATUS){
																res.message = validTeamId.message + " or winnerIdTeam should be 1"
															}
														}else{
															res.message = winnerIdTeam + " or winnerIdTeam should be 1"
														}
													}else{
														res.message = checkSetScoresB
													}
												}else{
													res.message = setScoresB
												}
											}else{
												res.message = checkSetScoresA
											}
										}else{
											res.message = setScoresA
										}
									}else{
										res.message = playerBIDCheck + " or playerBID should be 1"
									}
								}else{
									res.message = playerBID + " or playerBID should be 1"
								}
							}else{
								res.message = playerAIDCheck + " or playerAID should be 1"
							}
						}else{
							res.message = playerAID + " or playerAID should be 1"
						}
					}else{
						res.message = specNoNum
					}
				}else{
					res.message = specNo
				}

			} else {
				res.message = "parameters  " + ARE_NULL_MSG
			}
			
			return res
		} catch (e) {
			res.message = CATCH_MSG + e
			if (e && e.toString()) {
			    res.error = CATCH_MSG + e.toString()
			}
			return res
		}	  
	}
})

Meteor.methods({
    "checkValidTeamIds": async function(tournamentId,teamId) {
    	var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_TEAM_DETAILS_FAIL_MSG
        }

    	try{
	        var tournamentFind = events.findOne({
	            "_id": tournamentId
	        })
	        var dbsrequired = ["userDetailsTT", "playerTeams"]

	        var userDetailsTT = "userDetailsTT"
	        var playerTeams = "playerTeams"
	        var considerTeamEventBool = null
	        if (tournamentFind == undefined || tournamentFind == null) {
	            tournamentFind = pastEvents.findOne({
	                "_id":tournamentId
	            })
	        }

	        var resDB = await Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
	        
	        try {
	            if (resDB) {
	                if (resDB.changeDb && resDB.changeDb == true) {
	                    if (resDB.changedDbNames.length != 0) {
	                        userDetailsTT = resDB.changedDbNames[0]
	                        playerTeams = resDB.changedDbNames[1]
	                        considerTeamEventBool = true
	                        var playersDB = initDBS("playersDB")
	                        if (_.contains(playersDB, userDetailsTT)) {
	                            considerTeamEventBool = null
	                        }
	                    }
	                }
	            }
	        } catch (e) {
	        }

	        var s = global[playerTeams].aggregate([{
				    $match: {
				        "_id": teamId
				    }
				}, {
				$project: {
				    teamName: "$teamName"
				}
			}])

			if(s && s.length && s[0] && s[0].teamName){
				res.status = SUCCESS_STATUS
				res.message = GET_TEAM_DETAILS_SUCCESS_MSG
				res.data = s
			}
			return res 
		}catch(e){
			res.message = CATCH_MSG + e
			if (e && e.toString()) {
			    res.error = CATCH_MSG + e.toString()
			}
			return res
		}
    }
})


Meteor.methods({
	"saveTeamDetailedDrawsForTossCalls":async function(xData){

		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_FORMAT_SAVE_FAIL_MSG
        }
		try{
			if (typeof xData == "string") {
			    xData = xData.replace("\\", "");
			    xData = JSON.parse(xData);
			}
			if (xData) {
				var firstValidations = await Meteor.call("validateTeamDetailedDrawsForToss",xData)

				if(firstValidations&&firstValidations.status==SUCCESS_STATUS){
					var data = xData.teamsDetScoreOth
					data.tournamentId = xData.tournamentId
					data.eventName = xData.eventName
					var secondValidations = await Meteor.call("validateTeamsDetScoreOth",data)
					
					if(secondValidations && secondValidations.status==SUCCESS_STATUS){
						var data2 = xData.teamsDetScoreOth.matchTeamOth
						for(var i=0;i<data2.length;i++){
							data2[i].tournamentId = xData.tournamentId
							var checkForEachRow = {status:SUCCESS_STATUS}//await Meteor.call("matchTeamOthValidations",data2[i])
						
							if(checkForEachRow && checkForEachRow.status==FAIL_STATUS){
								res.status = FAIL_STATUS
								res.message = checkForEachRow.message + " at match no: "+parseInt(i+1)
								break;
							}else if(checkForEachRow && checkForEachRow.status==SUCCESS_STATUS){
								var setScoresA = data2[i].setScoresA
								var setScoresB = data2[i].setScoresB
								

								for(var iA=0;iA<setScoresA.length;iA++){
									
									setScoresA[iA] = replaceZeroAtFirstWithNegative(setScoresA[iA].toString())
								}
								for(var iB=0;iB<setScoresB.length;iB++){
									
									setScoresB[iB] = replaceZeroAtFirstWithNegative(setScoresB[iB].toString())
								}
								data2[i].setScoresA = setScoresA
								data2[i].setScoresB = setScoresB
								res.data = data2
								res.status = SUCCESS_STATUS
							}
						}
					}else if(secondValidations && secondValidations.status==FAIL_STATUS && 
						secondValidations.message){
						res.message = secondValidations.message
					}
				}else if(firstValidations && firstValidations.status==FAIL_STATUS && firstValidations.message){
					res.message = firstValidations.message
				}

			}else {
				res.message = "parameters  " + ARE_NULL_MSG
			}
	

			if(res && res.status==SUCCESS_STATUS){
				//call save method
				xData.teamsDetScoreOth.specifications = res.data
				res.data = xData
				//call save method
				var saveDe = await Meteor.call("saveTeamDetScores",xData)
				if(saveDe && saveDe.status==SUCCESS_STATUS){
					res.message = saveDe.message
				}
				else if(saveDe && saveDe.status == FAIL_STATUS){
					res.message = saveDe.message
				}

			}
			
			return res
		}catch(e){
			res.message = CATCH_MSG + e
			if (e && e.toString()) {
			    res.error = CATCH_MSG + e.toString()
			}
			return res
		}
	}
})


Meteor.methods({
	"saveTeamDetScores":async function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_OTR_FORMAT_INS_UPD_SAVE_FAIL_MSG
        }
		try{
			if (typeof xData == "string") {
			    xData = xData.replace("\\", "");
			    xData = JSON.parse(xData);
			}


			if (xData) {
				var findFirst = teamDetailedScoresOthrFormat.findOne({
					"tournamentId":xData.tournamentId,
					"eventName":xData.eventName
				})
				if(findFirst && findFirst.teamDetScore && findFirst.teamDetScore.length){
					var findForThisMatchNum = teamDetailedScoresOthrFormat.aggregate([{
					    $match: {
					        tournamentId: xData.tournamentId,
					        eventName: xData.eventName
					    }
					}, {
					    $unwind: {
					      "path":"$teamDetScore"
					    }
					},{
					  $match:{
					    "teamDetScore.matchNumber":xData.teamsDetScoreOth.matchNumber
					  }
					},{
					  $project:{
					    "teamDetScore.matchNumber":1
					  }
					}])

					if(findForThisMatchNum && findForThisMatchNum.length && findForThisMatchNum[0] &&
						findForThisMatchNum[0].teamDetScore && findForThisMatchNum[0].teamDetScore.matchNumber){
						var pullTD = teamDetailedScoresOthrFormat.update({
							tournamentId: xData.tournamentId,
					        eventName: xData.eventName
						},{
							$pull:{
								teamDetScore:{
									matchNumber:xData.teamsDetScoreOth.matchNumber
								}
							}
						})
						if(pullTD){
							//push that
							var pushTD = teamDetailedScoresOthrFormat.update({
								tournamentId: xData.tournamentId,
						        eventName: xData.eventName
								},{
								$push:{
									teamDetScore:xData.teamsDetScoreOth
								}
							})
							if(pushTD){
								
								res.status = SUCCESS_STATUS
								res.data = pushTD
								res.message = TEAMS_OTR_FORMAT_UPDATE_PUSH_PULL_SUCCESS_MSG
							}
						}
					}
					//if this match number is not there just push it 
					else{
						//push that
						var pushTD = teamDetailedScoresOthrFormat.update({
							tournamentId: xData.tournamentId,
						    eventName: xData.eventName
						},{
							$push:{
								teamDetScore:xData.teamsDetScoreOth
							}
						})
						if(pushTD){
							
							res.status = SUCCESS_STATUS
							res.data = pushTD
							res.message = TEAMS_OTR_FORMAT_UPDATE_PUSH_SUCCESS_MSG
						}
					}
				}else{

					var ins = teamDetailedScoresOthrFormat.insert({
						"tournamentId":xData.tournamentId,
						"eventName":xData.eventName,
						"teamDetScore":[xData.teamsDetScoreOth],
						"orgTeamFormatId":xData.orgTeamFormatId
					})
					if(ins){
						res.status = SUCCESS_STATUS
						res.data = ins
						res.message = TEAMS_OTR_FORMAT_INSERT_SUCCESS_MSG
					}
				}
			}
			else {
				res.message = "parameters  " + ARE_NULL_MSG
			}
			return res
		}catch(e){
			res.message = CATCH_MSG + e
			if (e && e.toString()) {
			    res.error = CATCH_MSG + e.toString()
			}
			return res
		}
	}
})