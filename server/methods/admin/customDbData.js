Meteor.methods({

	"addCustomData":function(data)
	{
		try{
			var result;
			var entryExists = customDataDB.findOne({"type":data.type});
			if(entryExists == undefined)
			{
				if(data.type && data.customData){
				 	result = customDataDB.insert({
						"type":data.type,
						"customData":data.customData
					})
				}
				else if(data.type && data.customKeyData){
					result = customDataDB.insert({
						"type":data.type,
						"customKeyData":data.customKeyData
					})
				}
				if(result)
				{
					var resultJson = {};
					resultJson["status"] = "success";
					resultJson["data"] = result;
					return resultJson; 
				}
				else
				{
					var resultJson = {};
					resultJson["status"] = "failure";
					resultJson["data"] = result;
					return resultJson; 
				}
			}
			else
			{
				var resultJson = {};
				resultJson["status"] = "failure";
				resultJson["data"] = "Duplicate entry";
				return resultJson; 
			}
			
		}catch(e)
		{
			var resultJson = {};
			resultJson["status"] = "failure";
			resultJson["data"] = e;
			return resultJson; 
		}
	},
	"getCustomData":function(data)
	{
		try{
			var result;
			var entryExists = customDataDB.findOne({"type":data.type});
			if(entryExists != undefined)
			{		
				var resultJson = {};
				resultJson["status"] = "success";
				resultJson["data"] = entryExists;
				return resultJson; 
				
			}
			else
			{
				var resultJson = {};
				resultJson["status"] = "failure";
				resultJson["data"] = "could not find";
				return resultJson; 
			}
			
		}catch(e)
		{
			var resultJson = {};
			resultJson["status"] = "failure";
			resultJson["data"] = e;
			return resultJson; 
		}
	}

})