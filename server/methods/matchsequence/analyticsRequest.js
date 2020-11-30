
Meteor.methods({

	"fetchRequestUser": function(data)
	{
		try{
			var successJson = succesData();
			var failureJson = failureData();

			if(data)
			{
				var errorMsg = [];	
				var userInfo = undefined;
				var objCheck = false;
				
				objCheck = Match.test(data, {"userId": String})
								
				if(objCheck)
				{
					var userId = strTrim(data.userId);

	            	userInfo =userExists(userId);

            		if(userInfo == undefined)
            			errorMsg.push(userMsg);
                   
	            	if(errorMsg.length > 0)
					{				
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = createAnalyticsReq_Fail_Msg;
						return failureJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		var requestUserInfo = analyticsRequest.aggregate([
	            			{$match:{
	            				"analystId":userId            			            				
	            			}},	   
	            			{$group:{
	            				"_id":"$userId",
	            				"userId": {$first: "$userId"},
	            			}},         			
	            			{$lookup: {
               					from: "users",
               					localField: "userId",
                				foreignField: "userId",
                				as: "userDetails" 
		            		}}, 
		            		{$unwind: {
		                		path: "$userDetails",
		                		preserveNullAndEmptyArrays: true
		            		}},
		            		{$project:{
								"userId":1,
		            			"user":"$userDetails.userName",
		            			"_id":0
		            		}}

	            		])
	        
	            		if(requestUserInfo && requestUserInfo.length != 0)
	            		{
	            			successJson["data"] = requestUserInfo;
	            			successJson["message"] = fetchRequestUser_Suc_Msg;
	            			return successJson;
	            		}
	            		else
	            		{
	            			failureJson["message"] = fetchRequestUser_Fail_Msg;
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
			errorLog(e);
			failureJson["message"] = fetchRequestUser_Fail_Msg+" "+e;
			return failureJson;
		}
	},
	"createAnalyticsRequest":async function(data)
	{
		try{
			var successJson = succesData();
			var failureJson = failureData();

			if(data)
			{
				var errorMsg = [];	
				var analystInfo = undefined;
				var userInfo = undefined;
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						"userId": String,
						"title":String,
						"link":String,
						"matchDate":String,
						"description":Match.Maybe(String),
						"analystId":String,
						"fee":Number,
						"transactionId":Match.Maybe(String)
					})
								
				if(objCheck)
				{
					var userId = strTrim(data.userId);
					var analystId = strTrim(data.analystId);
					var title = strTrim(data.title);
					var link =  strTrim(data.link);
					var matchDate = strTrim(data.matchDate);
					var description = "";
					if(data.description)
						description = data.description.trim();
	            	
	            	userInfo =userExists(userId);
	            	analystInfo =userExists(analystId);

            		if(userInfo == undefined)
            			errorMsg.push(userMsg);
            		if(analystInfo == undefined)          	
            			errorMsg.push(analystMsg);
            		if((title != undefined && title.length == 0) || 
            			(link != undefined && link.length == 0) || 
            			title == undefined || link == undefined)
            		{
            			var customMsg = "";
            			if((title != undefined && title.length == 0)  || title == undefined)
            				customMsg = "Match Title ";
            			if((link != undefined && link.length == 0) || link == undefined)
            				customMsg = "Match Link"

            			customMsg += " "+emptyMsg;
            			errorMsg.push(customMsg);
            		}   

            		var validMatchDate = validateDate(matchDate);
            		if(validMatchDate == false)
            			errorMsg.push("Match Date need to be in DD MM YYYY format");

	            	if(errorMsg.length > 0)
					{				
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = createAnalyticsReq_Fail_Msg;
						return failureJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		var insertJson = {};
	            		insertJson["userId"] = userId;
	            		insertJson["analystId"] = analystId;
	            		insertJson["title"] = title;
	            		insertJson["link"] = link;
	            		insertJson["matchDate"] = validMatchDate;
	            		insertJson["description"] = description;
	            		insertJson["fee"] = data.fee;
	            		insertJson["requestedOn"] = new Date();

	            		if(data.transactionId)
	            			insertJson["transactionId"] = data.transactionId;

	            		var result = analyticsRequest.insert(insertJson)

	            		if(result)
	            		{
	            			successJson["message"] = createAnalyticsReq_Suc_Msg;
	            			return successJson;
	            		}
	            		else
	            		{
	            			failureJson["message"] = createAnalyticsReq_Fail_Msg;
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
			errorLog(e);

			failureJson["message"] = createAnalyticsReq_Fail_Msg+" "+e;
			return failureJson;
		}
	},

	"fetchAnalyticsRequest":async function(data)
	{
		try{
			var successJson = succesData();
			var failureJson = failureData();

			if(data)
			{
				var errorMsg = [];	
				var userInfo = undefined;
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						"userId": Match.Maybe(String),
						"status":String,
						"analystId":Match.Maybe(String),				
					})
								
				if(objCheck)
				{
					if(data.userId)
					{
						var userId = strTrim(data.userId);
						if(data.userId.toLowerCase() != "all")
						{
							userInfo = userExists(userId);
	            			if(userInfo == undefined)
            					errorMsg.push(userMsg);
						}
	            		

					}

            		if(data.analystId != undefined && data.analystId.toLowerCase() != "all")
            		{
            			var analystInfo  =  userExists(data.analystId);
            			if(analystInfo == undefined)
            				errorMsg.push(analystMsg)
            		}
            
            		var status = strTrim(data.status);

            		if((status != undefined && status.length == 0) ||         		
            			status == undefined)
            		{
            			var customMsg = "";
            			if((status != undefined && status.length == 0)  || status == undefined)
            				customMsg = "Match Status"+emptyMsg;
            	
            			errorMsg.push(customMsg);
            		}   
            		else if(status != undefined && status.length > 0){

            			var validStatus = posStatusValues(status);
            			if(validStatus == false)
            				errorMsg.push(posStatusValMsg);
            		}


	            	if(errorMsg.length > 0)
					{				
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = fetchAnalyticsReq_Fail_Msg;
						return failureJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		var matchJson = {};
	            		if(data.userId)
	            		{
	            			if(data.userId.toLowerCase() != "all")
	            				matchJson["userId"] = userId;
	            		}
	            		
	            		if(data.analystId)            		
		           			matchJson["analystId"] = strTrim(data.analystId);
	            		
	            		if(status.toLowerCase() != "all")
	            			matchJson["status"] = status.toLowerCase();

	            		
	            		var result = analyticsRequest.aggregate([
							{$match:matchJson},
							{$project:{
								"title":"$title",
								"link":"$link",
								"matchDate":"$matchDate",
								"requestedOn":"$requestedOn",
								"description":"$description",
								"fee":"$fee",
								"status":"$status",
								"userId":"$userId",
								"analystId":"$analystId",	
								"sequenceId":"$sequenceId"					
							}},
	            			{$lookup: {
               					from: "users",
               					localField: "analystId",
                				foreignField: "userId",
                				as: "analystDetails" 
		            		}}, 
		            		{$unwind: {
		                		path: "$analystDetails",
		                		preserveNullAndEmptyArrays: true
		            		}},
		            		{$lookup: {
               					from: "users",
               					localField: "userId",
                				foreignField: "userId",
                				as: "userDetails" 
		            		}}, 
		            		{$unwind: {
		                		path: "$userDetails",
		                		preserveNullAndEmptyArrays: true
		            		}},
		            		{$project:{
		            			"title":1,"link":1,"matchDate":1,"requestedOn":1,
		            			"description":1,"fee":1,"status":1,"analystId":1,
		            			"sequenceId":1,
		            			"userId":1,
		            			"user":"$userDetails.userName",
								"analyst":"$analystDetails.userName",					
								"_id":0
            				}}
			
						]);

	            		
	            		successJson["data"] = result;
	            		successJson["message"] = fetchAnalyticsReq_Suc_Msg;
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
			errorLog(e);

			failureJson["message"] = fetchAnalyticsReq_Fail_Msg+" "+e;
			return failureJson;
		}
	},

	"cancelAnalyticsRequest":async function(data)
	{
		try{
			var successJson = succesData();
			var failureJson = failureData();

			if(data)
			{
				var errorMsg = [];	
				var analystInfo = undefined;
				var userInfo = undefined;
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						"userId": String,
						"id":String,
					})
								
				if(objCheck)
				{
					var userId = strTrim(data.userId);
					var id = strTrim(data.id);

	            	userInfo =userExists(userId);
					var analystRequestInfo = analyticsRequest.findOne({"_id":id});            	

            		if(userInfo == undefined)
            			errorMsg.push(userMsg);
            		if(analystRequestInfo == undefined)          	
            			errorMsg.push(recordDoesNotExist);

            
	            	if(errorMsg.length > 0)
					{				
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = createAnalyticsReq_Fail_Msg;
						return failureJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		var result = analyticsRequest.update({
	            			"_id":id},
	            			{$set:{"status":"cancel","transactionStatus":"refund"}}
	            		)

	            		
	            		if(result)
	            		{
	            			successJson["message"] = cancelAnalyticsReq_Suc_Msg;
	            			return successJson;
	            		}
	            		else
	            		{
	            			failureJson["message"] = cancelAnalyticsReq_Fail_Msg;
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
			errorLog(e);

			failureJson["message"] = cancelAnalyticsReq_Fail_Msg+" "+e;
			return failureJson;
		}
	},

	"downloadAnalyticsRequestPdf":async function(data)
	{
		try{

			var successJson = succesData();
			var failureJson = failureData();

			if(data)
			{
				var errorMsg = [];	
				var analystInfo = undefined;
				var userInfo = undefined;
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						"userId": String,
						"id":String,
					})
								
				if(objCheck)
				{
					var userId = strTrim(data.userId);
					var id = strTrim(data.id);

	            	userInfo =userExists(userId);
					var analystRequestInfo = analyticsRequest.findOne({
						"sequenceId":id,
						$or:[{"userId":userId},{"analystId":userId}]});            	

            		if(userInfo == undefined)
            			errorMsg.push(userMsg);
            		if(analystRequestInfo == undefined)          	
            			errorMsg.push(recordDoesNotExist);
            		if(analystRequestInfo.sequenceId == undefined)
            			errorMsg.push(pdfSequenceProgress);

	            	if(errorMsg.length > 0)
					{				
						failureJson["errorMsg"] = errorMsg;
						failureJson["message"] = createAnalyticsReq_Fail_Msg;
						return failureJson;
					}
	            	else if(errorMsg.length == 0)
	            	{
	            		//{"player1Name":"ACHANTA Sharath Kamal",
	            		//"player1ID":"R8pEvt2efyyGdhRT3",
	            		//"player2Name":"HARIMOTO Tomokazu",
	            		//"player2ID":"k83vytJZKWfNQbp69",
	            		//"sortFilterValue":"Win Effectiveness",
	            		//"dateFilter":"Any time"}

	            		var sequenceInfo = sequenceDataRecord.findOne({
	            			"_id":analystRequestInfo.sequenceId
	            		});
	            		if(sequenceInfo)
	            		{
	            			var sequenceJson = {};
	            			sequenceJson["player1Name"] = sequenceInfo.player1Name;
	            			sequenceJson["player2Name"] = sequenceInfo.player2Name;
	            			sequenceJson["player1ID"] = sequenceInfo.player1Id;
	            			sequenceJson["player2ID"] = sequenceInfo.player2Id;
	            			sequenceJson["sortFilterValue"] = "Win Effectiveness";
	            			sequenceJson["dateFilter"] = "Any Time";

	            			var loggerId = sequenceInfo.loggerId;

	            			var result = await Meteor.call("serAPI",sequenceJson,loggerId);
	            			if(result)
		            		{
		            			successJson["message"] = analystPdf_Suc_Msg;
		            			successJson["data"] = result;

		            			return successJson;
		            		}
		            		else
		            		{
		            			failureJson["message"] = analystPdf_Fail_Msg;
		            			return failureJson;
		            		}
	            		}
	            		else
	            		{
	            			failureJson["message"] = analystPdf_Record_Invalid;
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
			errorLog(e);

			failureJson["message"] = analystPdf_Fail_Msg+" "+e;
			return failureJson;
		}
	},


	
	

})