Meteor.methods({
	"dataToAssignDrill":async function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{			
				objCheck = Match.test(data, {"userId":String});
				
				if(objCheck)
				{	
					var checkUser = userExistsByRole(data.userId,"coach");
	            	if(checkUser == undefined)
					{
						failureJson["message"] = invalidUserMsg;
						return failureJson;
					}
					else
					{
						var paramJson = {};
						paramJson["loggedInId"] = data.userId;
						paramJson["statusType"] = "accepted";
						paramJson["connectionType"] = "accepted";
						paramJson["connectionRole"] = "Player";
						var conMembersData = await Meteor.call("getDetailsOfReceivedNSentConnection",paramJson);
						var drillData = drill.find({"userId":data.userId,"status":"active"}).fetch();

						var conMembers = [];
						if(conMembersData && conMembersData.status && conMembersData.status == "success" &&
							conMembersData.data)
						{
							conMembers = conMembersData.data;

						}
						var dataJson = {};
						dataJson["conMembers"] = conMembers;
						dataJson["drillData"] = drillData;
						successJson["data"] = dataJson;
						successJson["message"] = "Connected members and drill details are fetched";
						return successJson;
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
	},
	"assignDrill":async function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		var errorMsg = [];
		try{
			if(data)
			{			
				objCheck = Match.test(data, {"playerId":String,"drillId":String,
					"intensity":String,"count":Number,"status":String,"userId":String});
				
				if(objCheck)
				{	
					var checkUser = userExistsByRole(data.userId,"coach");
	            	if(checkUser == undefined)			
						errorMsg.push(invalidUserMsg);
					var drillInfo = drill.findOne({"_id":data.drillId.trim(),"userId":data.userId.trim()});
					if(drillInfo == undefined)
						errorMsg.push("Invalid drill");
					if(drillInfo)
					{
						if(drillInfo.intensity.indexOf(data.intensity.trim()) == -1 )
							errorMsg.push("Invalid intensity");
					}
					
					var validDrillStatus = posValExists(data.status,"drillstatus");
            		if(validDrillStatus == false)
            			errorMsg.push(posDrillStatusMsg);

            		if(errorMsg.length > 0)
            		{
            			failureJson["message"] = "Could not assign drill";
            			failureJson["errorMsg"] = errorMsg;
            			return failureJson;
            		}
					else
					{
						
						successJson["message"] = "Drill assigned";
						return successJson;
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