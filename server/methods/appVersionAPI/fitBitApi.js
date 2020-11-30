import { fitBitClient } from '../../server.js';

Meteor.methods({

	"upsertFitBitToken":function(data,operation){
		var successJson = succesData();
		var failureJson = failureData();
		var errorMsg = [];
		try{
			if(data && operation)
			{
				var objCheck = false;
				var dataOperation = operation;

				if(dataOperation.toLowerCase() == "create")
				{
					objCheck = Match.test(data, {
						"appUserID": String,"accessToken":String,
						"refreshToken":String,"userId":String
					});
				}
				else if(dataOperation.toLowerCase() == "update")
				{
					objCheck = Match.test(data, {
						"_id": String,"userId":String,"appUserID":String				
					});
				}
				else if(dataOperation.toLowerCase() == "delete")
				{
					objCheck = Match.test(data, {
						"_id": String				
					});
				}
				
				if(objCheck)
				{
					var result ;
					if(dataOperation.toLowerCase() == "create")
					{
						var checkUser = userExistsByRole(data.userId,"player");
						if(checkUser == false)
            				errorMsg.push("Invalid player");
					}

      		
            		if(errorMsg.length > 0)
            		{

            			failureJson["message"] = "Could not "+dataOperation+" fitbitTokens";
            			failureJson["errorMsg"] = errorMsg;
            			return failureJson;
            		}
				
					else
					{
						var result = undefined
						if(dataOperation.toLowerCase() == "create")
						{
							result = fitbitTokens.insert(data);
						}
						else if(dataOperation.toLowerCase() == "update")
						{
							result = fitbitTokens.update({"_id":data._id,"appUserID":data.appUserID},{$set:{"userId":data.userId}});
						}
						else if(dataOperation.toLowerCase() == "delete")
						{
							result = fitbitTokens.remove({"_id":data._id});

						}
						if(result)
						{
		            		successJson["message"] = "FitBit Token record "+dataOperation.toLowerCase()+"d successfully";
		            		return successJson;
						}
						else
						{
							failureJson["message"] = "Could not "+dataOperation.toLowerCase()+" fitbit token";
							return failureJson;
						}
					}
				}
				else
				{
					failureJson["message"] = paramMsg;
					return failureJson;
				}
			}
			else
			{
				failureJson["message"] = paramMsg;
				return failureJson;
			}
		}catch(e){
			failureJson["message"] = "Could not create/update/delete fitbitTokens"+e;
			return failureJson;
		}

	},
	"fetchFitbitData": async function(data){
		try{
			var errorMsg = [];
			var successJson = succesData();
			var failureJson = failureData();

			var objCheck = Match.test(data, {
						"logDate1": String,"logDate2":Match.Maybe(String),
						"userId":String
					});


			if(objCheck)
			{
				var logDate1 = undefined;
				var logDate2 = undefined;
				if(data.logDate1)
					logDate1 = data.logDate1;
				if(data.logDate2)
					logDate2 = data.logDate2;

				if(logDate1 != undefined)
				{
					var validDate1 = validDateString(logDate1,"yyyy-mm-dd");
					if(validDate1 == false)
						errorMsg.push("Invalid date format : yyyy-mm-dd")
				}
				if(logDate2 != undefined)
				{
					var validDate2 = validDateString(logDate2,"yyyy-mm-dd");
					if(validDate2 == false)
						errorMsg.push("Invalid date format : yyyy-mm-dd")
				}
				var userInfo = userExists(data.userId);
				if(userInfo == undefined)
					errorMsg.push(userMsg);
				if(errorMsg.length == 0)
				{
					var resultJson = {};
					var tokenInfo = fitbitTokens.findOne({"userId":data.userId});
					if(tokenInfo)
					{
						var access_token = tokenInfo.accessToken;
						var appUserID = tokenInfo.appUserID;
						var refresh_token = tokenInfo.refreshToken;
					
					
						var activitiesSummary = await generateActivitiesSummary(access_token,refresh_token,logDate1,logDate2);
						var distanceActivities = await generateDistanceActivities(access_token,refresh_token,logDate1,logDate2);
						var stepActivities = await generateStepActivities(access_token,refresh_token,logDate1,logDate2);

						var floorActivities = await generateFloorActivities(access_token,refresh_token,logDate1,logDate2);
						var heartActivitiesRes = await generateHeartActivities(access_token,refresh_token,logDate1,logDate2);
						var calActivities = await generateCalories(access_token,refresh_token,logDate1,logDate2);
						var activeFair = await generateFairActive(access_token,refresh_token,logDate1,logDate2);
						var activeVery = await generateVeryActive(access_token,refresh_token,logDate1,logDate2);
					
			
						resultJson["activitySummary"] = activitiesSummary;
						resultJson["distance"] = distanceActivities;
						resultJson["steps"] = stepActivities;
						resultJson["floors"] = floorActivities;
						resultJson["heartRate"] = heartActivitiesRes;
						resultJson["calories"] = calActivities;
						resultJson["fairActive"] = activeFair;
						resultJson["veryActive"] = activeVery

						successJson["data"] = resultJson;
						console.log("successJson .. "+JSON.stringify(successJson))

						return successJson
					}
					else
					{
						failureJson["message"] = "Invalid fitibit user";
						return failureJson;
					}
				}
				else
				{
					failureJson["message"] = "Errors";
					failureJson["errorMsg"] = errorMsg;
					return failureJson;
				}

				

				
				
			}
			else
			{
				failureJson["message"] = "Invalid data";
				return failureJson;
			}
			

		}catch(e){
			errorLog(e);
			failureJson["message"] = "Invalid data "+e;
			return failureJson;
		}

	}
})

function generateHeartActivities(access_token,refresh_token,logDate1,logDate2)
{

	var fitBitURL = "/activities/heart/date/"+logDate1+"/1d.json"
	if(logDate1 != undefined && logDate2 != undefined)
		fitBitURL ="/activities/heart/date/"+logDate1+"/"+logDate2+".json";


	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get(fitBitURL, access_token).then(results => {

	        if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){
	                   
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                

					    fitBitClient.get(fitBitURL, result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("heart err .. "+err)
						});

	            			

	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0]);

	    }).catch(err => {
	        console.log("heart err .. "+err)
	    });
	})
}


function generateActivitiesSummary(access_token,refresh_token,logDate1,logDate2)
{
	var fitBitURL = "/activities/date/"+logDate1+".json"
	//if(logDate1 != undefined && logDate2 != undefined)
		///fitBitURL ="/activities/date/"+logDate1+"/"+logDate2+".json";


	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get(fitBitURL, access_token).then(results => {
	         if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){
	                   
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                
					    fitBitClient.get(fitBitURL, result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("heart err .. "+err)
						});         	
	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0])
	    }).catch(err => {
	        console.log("heart err .. "+err)
	    });
	})
}

function generateStepActivities(access_token,refresh_token,logDate1,logDate2)
{
	var fitBitURL = "/activities/steps/date/"+logDate1+"/1d.json"
	if(logDate1 != undefined && logDate2 != undefined)
		fitBitURL ="/activities/steps/date/"+logDate1+"/"+logDate2+".json";


	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get(fitBitURL, access_token).then(results => {
	         if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){
	                   
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                
					    fitBitClient.get(fitBitURL, result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("heart err .. "+err)
						});         	
	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0])
	    }).catch(err => {
	        console.log("heart err .. "+err)
	    });
	})
}

function generateDistanceActivities(access_token,refresh_token,logDate1,logDate2)
{
	var fitBitURL = "/activities/distance/date/"+logDate1+"/1d.json"
	if(logDate1 != undefined && logDate2 != undefined)
		fitBitURL ="/activities/distance/date/"+logDate1+"/"+logDate2+".json";


	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get(fitBitURL, access_token).then(results => {
	         if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){
	                   
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                
					    fitBitClient.get(fitBitURL, result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("heart err .. "+err)
						});         	
	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0])
	    }).catch(err => {
	        console.log("heart err .. "+err)
	    });
	})
}

function generateFloorActivities(access_token,refresh_token,logDate1,logDate2)
{
	var fitBitURL = "/activities/floors/date/"+logDate1+"/1d.json"
	if(logDate1 != undefined && logDate2 != undefined)
		fitBitURL ="/activities/floors/date/"+logDate1+"/"+logDate2+".json";


	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get(fitBitURL, access_token).then(results => {
	         if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){
	                   
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                
					    fitBitClient.get(fitBitURL, result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("heart err .. "+err)
						});         	
	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0])
	    }).catch(err => {
	        console.log("heart err .. "+err)
	    });
	})
}


function generateCalories(access_token,refresh_token,logDate1,logDate2)
{

	var fitBitURL = "/activities/calories/date/"+logDate1+"/1d.json"
	if(logDate1 != undefined && logDate2 != undefined)
		fitBitURL ="/activities/calories/date/"+logDate1+"/"+logDate2+".json";
	
	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get(fitBitURL, access_token).then(results => {
	         if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){ 
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                

					    fitBitClient.get(fitBitURL, result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("heart err .. "+err)
						});

	            			

	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else resolve(results[0]);

	    }).catch(err => {
	        console.log("heart err .. "+err)
	    });
	})
}


function generateFairActive(access_token,refresh_token,logDate1,logDate2)
{

	var fitBitURL = "/activities/minutesFairlyActive/date/"+logDate1+"/1d.json"
	if(logDate1 != undefined && logDate2 != undefined)
		fitBitURL ="/activities/minutesFairlyActive/date/"+logDate1+"/"+logDate2+".json";


	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get(fitBitURL, access_token).then(results => {
	         if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){ 
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                

					    fitBitClient.get(fitBitURL, result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("generateFairActive err .. "+err)
						});

	            			

	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0])
	    }).catch(err => {
	        console.log("generateFairActive err .. "+err)
	    });
	})
}

function generateVeryActive(access_token,refresh_token,logDate1,logDate2)
{
	var fitBitURL = "/activities/minutesVeryActive/date/"+logDate1+"/1d.json"
	if(logDate1 != undefined && logDate2 != undefined)
		fitBitURL ="/activities/minutesVeryActive/date/"+logDate1+"/"+logDate2+".json";

	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get(fitBitURL, access_token).then(results => {
	         if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){
 
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                

					    fitBitClient.get(fitBitURL, result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("minutesVeryActive err .. "+err)
						});

	            		
	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0])
	    }).catch(err => {
	        console.log("minutesVeryActive err .. "+err)
	    });
	})
}





//GET https://api.fitbit.com/1/user/-/activities/heart/date/[date]/1d/[detail-level]/time/[start-time]/[end-time].json

function generateHeartActivitiesSeries(access_token,refresh_token,logDate)
{
	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get("/activities/heart/date/"+logDate+"/1d/1min/time/11:00/11:30.json", access_token).then(results => {

	        if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){
	                   
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                

					    fitBitClient.get("/activities/heart/date/"+logDate+"//1d/1min/time/11:00/11:30.json", result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("heart err .. "+err)
						});

	            			

	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0]);

	    }).catch(err => {
	        console.log("heart err .. "+err)
	    });
	})
}
//generateActivitiesTotal
function generateActivitiesTotal(access_token,refresh_token,logDate)
{
	return new Promise(function(resolve, reject) 
	{
	    fitBitClient.get("/activities.json", access_token).then(results => {
	         if(results [0] && results[0].success == false && 
	        	results[0].errors && results[0].errors[0] &&
	        	results[0].errors[0].errorType && results[0].errors[0].errorType == "expired_token")
	        {
	           	fitBitClient.refreshAccessToken(access_token,refresh_token,28800).then(function(result){
	                   
	                if(result.user_id && result.access_token && result.refresh_token)
	                {
	                	var tokenUpdate = fitbitTokens.update({"appUserID":result.user_id},{$set:{
		                	"accessToken": result.access_token,"refreshToken" : result.refresh_token
	                	}});
	                			                
					    fitBitClient.get("/activities.json", result.access_token).then(activitiesRes => {
						    resolve(activitiesRes);
						        	
						}).catch(err => {
							errorLog("heart err .. "+err)
						});         	
	                }
	                else{
	                	errorLog("could not generate token for the user "+appUserID)
	                }
	            }).catch(err => {
	        		errorLog("refreshAccessToken err .. "+err)
	    		});
	        }
	        else
	        	resolve(results[0])
	    }).catch(err => {
	        console.log("heart err .. "+err)
	    });
	})
}