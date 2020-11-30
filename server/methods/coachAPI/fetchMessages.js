
//var db = require('database.js');
//var crypto = require('crypto');
Meteor.methods({

	
	"fetchThreadMessages": function(xDATA) {

        try {
            //var test = global[s].find({},{fields:{"userName":1}}).fetch();
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


            //check for params
            if (xDATA && xDATA.senderId && xDATA.receiverId){
               
               	var allExists = false;
	            var groupExists = false;
	            var userRole = "Individual";

                if(xDATA.senderId.toLowerCase() == "all" || xDATA.receiverId.toLowerCase() == "all")
                {
                	allExists = true;
					userRole = "All";
                }
                if(xDATA.senderId.toLowerCase() == "all")
                {
                	senderInfo = true;
                }
                else
                {
                	var senderInfo = Meteor.users.findOne({
	                    "userId": xDATA.senderId});

                	if(senderInfo == undefined)
	                {
	                	senderInfo = coachConnectedGroups.findOne({"_id":xDATA.senderId});
	                	if(senderInfo)
	                		groupExists = true;

	                }


                }
                if(xDATA.receiverId.toLowerCase() == "all")
                	receiverInfo = true;
                else
                {
                	var receiverInfo = Meteor.users.findOne({
	                    "userId": xDATA.receiverId});
                	if(receiverInfo == undefined)
	                {
	                	receiverInfo = coachConnectedGroups.findOne({"_id":xDATA.receiverId});
	                	if(receiverInfo)
	                		groupExists = true;
	                }
                }
                if(groupExists)
                	userRole = "Group";
                if(xDATA.senderId.toLowerCase() != "all" && xDATA.receiverId.toLowerCase() != "all")
                {
                	//check for valid role

	                var senderInfo = Meteor.users.findOne({
	                    "userId": xDATA.senderId});

	                var receiverInfo = Meteor.users.findOne({
	                    "userId": xDATA.receiverId});
	                if(senderInfo == undefined)
	                {
	                	senderInfo = coachConnectedGroups.findOne({"_id":xDATA.senderId});
	                	if(senderInfo)
	                		groupExists = true;

	                }
	                if(receiverInfo == undefined)
	                {
	                	receiverInfo = coachConnectedGroups.findOne({"_id":xDATA.receiverId});
	                	if(receiverInfo)
	                		groupExists = true;
	                }
                }
               

                //if both are valid
                if (senderInfo && receiverInfo) {

                    //query to check, and get inbox messages
                    //for this loggedInId
                    var groupIdQuery = {
                        receiverId: ""
                    }

                    var receiverIdQuery ;     
                    if(groupExists)
                    {
                    	var receiverIdQuery = [{
                        		"senderId": xDATA.receiverId,
	                        	"receiverId":xDATA.senderId
	                        }, 
	                        {
	                            "senderId": xDATA.senderId,
	                            "receiverId":xDATA.receiverId,
	                    	}
                    	]
                    }
                    else
                    {
                    	if(xDATA.senderId.toLowerCase() == "all" || xDATA.receiverId.toLowerCase() == "all")
                    	{

                    		if(xDATA.senderId.toLowerCase() == "all")
                    		{
                    			if(xDATA.receiverId == xDATA.loggedInId)
                    			{
									var receiverIdQuery = [
										{
				                    		"senderId":{$in:[xDATA.loggedInId]},
				                    		"receiverId":"All"

				                    	}
			                    	]
                    			}
                    			else
                    			{
                    				var receiverIdQuery = [{
		                        		"senderId": xDATA.receiverId,
			                        	"receiverId":xDATA.loggedInId
			                        }, 
			                        {
			                            "senderId": xDATA.loggedInId,
			                            "receiverId":xDATA.receiverId,
			                    	},
			                    	{
			                    		$and:[{
			                    			"senderId":{$nin:[xDATA.loggedInId]},
			                    		},{
			                    			"senderId":{$in:[xDATA.receiverId]},
			                    		}],

			                    		"receiverId":"All"

			                    	}]
                    			}
                    			
                    		}
                    		else if(xDATA.receiverId.toLowerCase() == "all")
                    		{
                    			if(xDATA.senderId == xDATA.loggedInId)
                    			{
									var receiverIdQuery = [
										{
				                    		"senderId":{$in:[xDATA.loggedInId]},
				                    		"receiverId":"All"

				                    	}
			                    	]
                    			}
                    			else
                    			{
                    				var receiverIdQuery = [{
		                        		"senderId": xDATA.senderId,
			                        	"receiverId":xDATA.loggedInId
			                        }, 
			                        {
			                            "senderId": xDATA.loggedInId,
			                            "receiverId":xDATA.senderId,
			                    	},
									{
			                    		"senderId":{$nin:[xDATA.loggedInId]},
			                    		"receiverId":"All"

			                    	}

			                    	]
                    			}
                    			
                    		}
                    	}
                    	else
                    	{
                    		if(xDATA.senderId == xDATA.loggedInId)
                    		{
								var receiverIdQuery = [
	                    			{
		                        		"senderId": xDATA.receiverId,
			                        	"receiverId":xDATA.senderId
				                    }, 
			                        {
			                            "senderId": xDATA.senderId,
			                            "receiverId":xDATA.receiverId,
			                    	},
			                    	{
		                        		"senderId": xDATA.receiverId,
			                        	"receiverId":"All"
				                    }, 
			                        
		                    	]
                    		}
                    		else if(xDATA.receiverId == xDATA.loggedInId)
                    		{
                    			var receiverIdQuery = [
                    			{
	                        		"senderId": xDATA.receiverId,
		                        	"receiverId":xDATA.senderId
			                    }, 
		                        {
		                            "senderId": xDATA.senderId,
		                            "receiverId":xDATA.receiverId,
		                    	},
		                    	 
		                        {
		                            "senderId": xDATA.senderId,
		                            "receiverId":"All",
		                    	},


		                    	]
                    		}
                    		
                    	}
                    
                    	
                    }
	                //if(xDATA.senderId.toLowerCase() != "all" && xDATA.receiverId.toLowerCase() != "all")
	                //{
 						
	                //}
	                //else if(xDATA.senderId.toLowerCase() == "all" || xDATA.receiverId.toLowerCase() == "all")
	                //{
	                //	
	               // }


                    var receiverIdQueryForAll = {receiverId: "All"}

                            

                    //get all groupId of this loggin person
                    var getGroupIds = coachConnectedGroups.aggregate([
                    	{$match: {
                            groupMembers: xDATA.loggedInId
                        }}, 
                        {$project: {
                                    "groupId": "$_id"
                        }}, 
                        {$group: {
                            "_id": "group",
                            groupIds: {$push: "$groupId"}
                        }}
                    ]);

                    if (getGroupIds && getGroupIds[0] && getGroupIds[0].groupIds) 
                    {
                        var arrayGroup = getGroupIds[0].groupIds
                        groupIdQuery = {receiverId: {$in: arrayGroup}}
                    }
                    else
                    {

                    }

                          

                    groupIdQuery = {};
                   
     
           

 					var coachAPPInboxDET = coachAPPINSentBOX.aggregate([
                    	{$match: {
                            //$or: [groupIdQuery, 
                            	$or: receiverIdQuery,
                            //],
                        }}, 
                        {$sort: {receivedDateAndTime:-1}}, 
                        {$unwind:"$messagesBox"},   
                        {$match:{
                        	"messagesBox.deleteIds":{$nin:[xDATA.loggedInId]}
                        }}, 
                        {$sort: {"messagesBox.receivedDateAndTime":-1}}, 
	           			{$group:{
	           					"_id":"$messagesBox._id",
	           					"senderId": { "$first": "$messagesBox.senderId"},
	           					"receiverId": { "$first": "$messagesBox.receiverId"},
	           					"messageType": { "$first": "$messagesBox.messageType"},
	           					"message": { "$first": "$messagesBox.message"},
	           					"receivedDateAndTime": { "$first": "$messagesBox.receivedDateAndTime"},
	           					"senderRole": { "$first": "$messagesBox.senderRole"},
	           					"receiverRole": { "$first": "$messagesBox.receiverRole"},
	           					"senderIDs": {$addToSet: "$senderId"},
	                            "receiverIDs": {$addToSet: "$receiverId"},
	                            "senderName": { "$first": "$senderName"},
	                            "receiverName": { "$first": "$receiverName"},
	                            "mainId": { "$first": "$_id"},
	                            "mainSenderId": {$first: "$senderId"},
	                            "mainReceiverId": {$first: "$receiverId"},


	           			}},
	           			{$project:{
	           				"mainSenderId":1,
	           				"mainReceiverId":1,
	           				"mainSenderName":"$senderName",
	           				"mainReceiverName":"$receiverName",

	                        senderName: {
	                            "$cond": [{
	                                $eq: ["$mainSenderId", "$senderId"]
	                            }, "$senderName", "$receiverName"]
	                        },                     
	                        receiverName: {
	                            "$cond": [{
	                                 $eq: ["$mainReceiverId", "$senderId"]
	                            }, "$receiverName", "$senderName"]
	                        },
	                        "senderId":1,
	                        "receiverId":1,
	                        "senderRole":1,
	                        "receiverRole":1,
	                        "messageType":1,
	                        "message":1,
							"receivedDateAndTime":1,
							"senderIDs":1,
							"receiverIDs":1,
							"mainId":1

	           			}},
	           			{$sort: {"receivedDateAndTime":1}}, 


 
                    ]);

                    //to check connected or not
                    var connectionStatus = "";
                    if (coachAPPInboxDET && coachAPPInboxDET[0] && coachAPPInboxDET[0].senderIDs) 
                    {                               
                        //get the senderId and receiverId array
                        var senderIDs = _.union(coachAPPInboxDET[0].senderIDs, coachAPPInboxDET[0].receiverIDs);
                        //search either as loggedInId as sender and receID as recvd or 
                        //recId as recvr and loggedInId as senders
                        if(allExists)
                        {
                        	connectionStatus = "all-accepted";

                        }
                        else if(groupExists)
                        {

                        	var connectedORNot = coachConnectedGroups.findOne({
                        		$or:[
                        		{"loggedInId":xDATA.loggedInId},
                        		{"groupMembers":{$in:[xDATA.loggedInId]}}
                        		],
                        		"_id":xDATA.receiverId
                        		});
                        	if(connectedORNot)
                        		connectionStatus = "accepted";
                        }
                        else
                        {
                        	var connectedORNot = connectionRequests.aggregate([
                        	{$match: {
                                $or: [{
                                    $and: [
                                    	{loggedInId: xDATA.loggedInId}, 
                                    	{receiverId: {$in: senderIDs}}
                                    ]}, {
                                    $and: [
                                    	{receiverId: xDATA.loggedInId}, 
                                    	{loggedInId: {$in: senderIDs}}
                                    ]
                                }]
                            }}, 
                            {$project: {
                                "senderId": {
                                    "$cond": [{
                                        $eq: ["$loggedInId", xDATA.loggedInId]
                                    }, "$receiverId", "$loggedInId"]
                                },
                                "status": "$status",
                                "_id": 0
                            }}
                        ]);

                        if(connectedORNot[0])
                        {
                        	if(connectedORNot[0].status)
                            	connectionStatus = connectedORNot[0].status;
                        	}
                        }
                        
                       
                                
                    }
                    var message = "Messages"
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = coachAPPInboxDET;
                    resultJson["connectionStatus"] = connectionStatus;
                    //resultJson["userRole"] = userRole;

                    return resultJson
                } 
                else 
                {
                    var message = "Invalid sender/receiver"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
        
            } else {
                var message = "Require all parameters"
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


	},

	
	"deleteThreadMessage":async function(xData)
	{
		try{
			if (xData && xData.id && xData.messageId) {

				var msgExists = coachAPPINSentBOX.findOne({
					"_id":xData.id,
					"messagesBox._id":xData.messageId
				});
			
				var deleteUserMessage = coachAPPINSentBOX.update(
					{
                        "_id":xData.id,
					"messagesBox": {
	                   	$elemMatch: {"_id": xData.messageId}
		            }},
					{$addToSet:{
						"messagesBox.$.deleteIds":xData.loggedInId,			
					}
				});
				if(deleteUserMessage)
				{
					var emptyArray = [];
					var resultJson = {};
	                var message = "Message Deleted"
	                resultJson["status"] = "success";
	                resultJson["response"] = message.toString();
	                resultJson["data"] = emptyArray;

					var result = await Meteor.call("fetchThreadMessages",xData)
                    try{
						if(result)
						{
							if(result.status && result.data)
							{
								if(result.status == "success")
								{
									resultJson["data"] = result.data;	
									if(result.connectionStatus)
										resultJson["connectionStatus"] = result.connectionStatus;
									

								}
							}
						}
					}catch(e){

                    }
					
	                return resultJson
				}
 
            } else {
            	var resultJson = {};
                var message = "Require all parameters"
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

		}catch(e){
		}

    },

    "deleteAllThreadMessage":async function(xData)
    {
        try{

            var deleteUserMessage;
            var arr;

            if (xData && xData.messageId && xData.loggedInId) {

                if(typeof xData.messageId == "string")
                {
                    xData.messageId = xData.messageId.replace("\\", "");
                    arr = JSON.parse(xData.messageId);
                }
                else{
                    arr = xData.messageId;
                }

                var deleteUserMessage;
                for(var i= 0; i< arr.length; i++)
                {

                    deleteUserMessage = coachAPPINSentBOX.update(
                        {
                        "messagesBox._id": arr[i]
                        }, 
                        {$addToSet:{
                            "messagesBox.$.deleteIds":xData.loggedInId,         
                        }
                    });
                }
                

                if(deleteUserMessage)
                {
                    var emptyArray = [];
                    var resultJson = {};
                    var message = "Message Deleted"
                    resultJson["status"] = "success";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = emptyArray;

                    var result = await Meteor.call("fetchThreadMessages",xData)
                    try {

                        if(result)
                        {
                            if(result.status && result.data)
                            {
                                if(result.status == "success")
                                {
                                    resultJson["data"] = result.data;   
                                    if(result.connectionStatus)
                                        resultJson["connectionStatus"] = result.connectionStatus;
                                    

                                }
                            }
                        }

                    }catch(e){

                    }
                    return resultJson
                }
 
            } else {
                var resultJson = {};
                var message = "Require all parameters"
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        }catch(e){
        }

    },


})