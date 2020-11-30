Meteor.methods({

	"upsertDrill":function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		var errorMsg = [];
		try{
			if(data && data.operation)
			{
				var objCheck = false;
				var dataOperation = data.operation;

				if(dataOperation.toLowerCase() == "create")
				{
					objCheck = Match.test(data, {
						"name": String,
						"description":String,
						"intensity":[String],
						"duration":Number,"durationType":String,
						"type":String,"userId":String,
						"operation":String
					});
				}
				else if(dataOperation.toLowerCase() == "update")
				{
					objCheck = Match.test(data, {
						"name": String,"description":String,
						"intensity":[String],
						"duration":Number,"durationType":String,
						"type":String,"_id":String,"userId":String,
						"operation":String
					});
				}
				
				if(objCheck)
				{
					var result ;
					var checkUser = userExistsByRole(data.userId,"coach");
					
					var validDrillType = posValExists(data.type,"drillType");
            		if(validDrillType == false)
            			errorMsg.push(posDrillTypeMsg);

            		var validDrillIntensity = posValExists(data.intensity,"drillIntensity");
            		if(validDrillIntensity == false)
            			errorMsg.push(posDrillIntensityMsg);

            		if(data.durationType)
            		{
            			var validDrillDuration = posValExists(data.durationType,"drillDuration");
            			if(validDrillDuration == false)
            				errorMsg.push(posDrillDurationMsg);
            		}

            		if(errorMsg.length > 0)
            		{

            			failureJson["message"] = "Could not create/update drill";
            			failureJson["errorMsg"] = errorMsg;
            			return failureJson;
            		}

					if(checkUser == undefined)
					{
						failureJson["message"] = invalidUserMsg;
						return failureJson;
					}
					else
					{
						var result = undefined
						if(dataOperation.toLowerCase() == "create")
						{
							result = drill.insert(data);
						}
						else if(dataOperation.toLowerCase() == "update")
						{
							var dataJson = JSON.parse(JSON.stringify(data));
							delete dataJson["_id"];
							delete dataJson["userId"];
							delete dataJson["operation"];

							result = drill.update({"_id":data._id,"userId":data.userId},{$set:dataJson});

						}
						if(result)
						{
		            		successJson["message"] = "Drill record "+dataOperation.toLowerCase()+"d successfully";
		            		return successJson;
						}
						else
						{
							failureJson["message"] = "Could not "+dataOperation.toLowerCase()+" drill";
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
			failureJson["message"] = "Could not create/update drill"+e;
			return failureJson;
		}
	},
	"removeDrill":function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{			
				objCheck = Match.test(data, {"_id": String,"userId":String});
				
				if(objCheck)
				{					 				
					var result = drill.remove(data);
								
					if(result)
					{
	            		successJson["message"] = "Drill record removed successfully";
	            		return successJson;
					}
					else
					{
						failureJson["message"] = "Could not remove drill";
						return failureJson;
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
			failureJson["message"] = "Could not remove drill"+e;
			return failureJson;
		}
	},
	"fetchDrill":function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{			
				objCheck = Match.test(data, {"type":Match.Maybe(String),"userId":String});
				
				if(objCheck)
				{			
					var paramJson = {};
					paramJson["userId"] = data.userId;
					if(data.type)
						paramJson["type"] = data.type;	
					var result = drill.find(paramJson).fetch();
					if(result && result.length > 0)
					{
						successJson["data"] = result;
	            		successJson["message"] = "Fetched drill records";
	            		return successJson;
					}
					else
					{
						failureJson["message"] = "Could not fetch drill";
						return failureJson;
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
			failureJson["message"] = "Could not fetch drill"+e;
			return failureJson;
		}
	}
})