Meteor.methods({

	"validatePromo":function(data)
	{
		try{

			var successJson = succesData();
			var failureJson = failureData();
			var objCheck = Match.test(data, {"promo": String});
			if(objCheck)
			{
				var promoExists = promo.findOne({"promo":{
                        $regex: new RegExp('^' + data.promo + '$', "i")
                    },"status":"active"});
				
				if(promoExists)
				{
					successJson["message"] = "Valid promo";
					return successJson;
				}
				else
				{
					failureJson["message"] = "Invalid promo";
					return failureJson;
				}
			}
			else
			{
				failureJson["message"] = paramMsg;
				return failureJson;
				
			}
			
		}catch(e){
			failureJson["message"] = "Could not vaildate promo code"+e;
			return failureJson;
		}
	}

})