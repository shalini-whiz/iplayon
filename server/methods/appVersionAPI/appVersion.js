Meteor.methods({

	"checkAppUpdate":function(data)
	{
		try{
			if(data)
			{

				var invalidAppJson = {};
				invalidAppJson["status"] = "failure";
				invalidAppJson["message"] = "Invalid appName";

				var invalidParamJson = {};
				invalidParamJson["status"] = "failure";
				invalidParamJson["message"] = "Require all parameters";


				var objCheck = false;
				
				objCheck = Match.test(data,{ appName: String})
															
				if(objCheck)
				{

					var appName = data.appName;

					if(appName != undefined && appName != null)
					{
						var appInfo = appDetails.findOne({"appName":appName.trim()});
						if(appInfo)
						{
							if(appInfo.appStatus == false)
							{
								var resultJson = {};
								resultJson["status"] = "failure";
								resultJson["message"] = "App need not to be updated";
								return resultJson;
							}
							else if(appInfo.appStatus)
							{
								var resultJson = {};
								resultJson["status"] = "success";
								resultJson["message"] = "App need to be updated";
								return resultJson;
							}
						}
						else
						{					
							return invalidAppJson;
						}
					}
					else
					{				
						return invalidAppJson;
					}		         			           		            	
				}
				else
				{					
					return invalidParamJson;
				}
			}
			else
			{
				
				return invalidParamJson;
			}

		}catch(e){
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch data "+e;
			return resultJson;
		}
	}

})