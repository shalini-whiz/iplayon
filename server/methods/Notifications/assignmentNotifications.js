workAssignments.after.insert(function (userId, doc, fieldNames, modifier) {
	try{
		if(doc)
		{
			data = doc;
			
        	var entryExists = workAssignments.findOne({
        				"_id":doc._id,
					 	});
        	if(entryExists)
        	{
        		var senderName = "";
        		var senderId = "";
        		var topic = "";
        		var topicType = "";

        		var userInfo;
        		if(data.receiverRole == "Group")
        		{
        			senderId = data.receiverId;
        			topicType = 3;
        			userInfo = coachConnectedGroups.findOne({"_id":data.receiverId});
		      		if(userInfo)    
		      		{
		      			senderName= userInfo.groupName;
						if(userInfo.groupMembers.length > 0)
						{
                            topic = userInfo.groupMembers;
							
						}

		      		}  		
		      		
        		}
        		
        		else
        		{
        			topicType = 1;

        			if(doc.messagesBox)
        			{
        				senderId = data.senderId;
			      		topic = data.receiverId;
			      		userInfo = Meteor.users.findOne({"userId":data.senderId});
			      		if(userInfo)		    		
			      			senderName = userInfo.userName;	
        			}
        			
        		}

        		if(userInfo)
				{
					var notifyData = {
						"title":"New Assignment From "+senderName, 
			            "body": data.messagesBox[0].message,
			            "sound":"default", 
			            "badge": "0",
			            "topic": topic ,
			            "categoryIdentifier":"newAssignment"
					}

					var dataParam = {};
                    dataParam["senderId"] = senderId;
                    dataParam["assignmentId"] = doc._id
                   
                    if(modifier && modifier["$push"]["messagesBox"]["$each"]){
                       
                        var dd = modifier["$push"]["messagesBox"]["$each"]
                        if (dd.length != 0 && modifier["$push"]["messagesBox"]["$position"] != null && modifier["$push"]["messagesBox"]["$position"] != undefined){
                            dataParam["assignmentThreadId"] =  dd[modifier["$push"]["messagesBox"]["$position"]]._id
                        }
                    }
					Meteor.call("sendNotification",notifyData,dataParam,topicType,function(e,res){})
				}
        	



        	}

			

		}
	}catch(e){
	}
});



workAssignments.after.update(function(userId, doc, fieldNames, modifier, options) {
    try {
       


        var pos = fieldNames.indexOf("receivedDateAndTime");
        if (doc && pos > -1) {
            data = doc;

            var entryExists = workAssignments.findOne({
                "_id": doc._id,
            });
            if (entryExists) {
                var senderName = "";
                var senderId = "";
                var topic = "";
                var topicType = "";
                var userInfo;
                if (data.receiverRole == "Group") {
                    senderId = data.receiverId;
                    topicType = 3;

                    userInfo = coachConnectedGroups.findOne({
                        "_id": data.receiverId
                    });
                    if (userInfo) {
                        senderName = userInfo.groupName;
                        if (userInfo.groupMembers.length > 0) {
                            topic = userInfo.groupMembers;
          
                           //topic = top;
                        }


                    }

                } 
                else {
                    topicType = 1;

                    if (doc.messagesBox) {
                        senderId = data.messagesBox[0].senderId;
                        topic = data.messagesBox[0].receiverId;
                        userInfo = Meteor.users.findOne({
                            "userId": data.messagesBox[0].senderId
                        });
                        if (userInfo)
                            senderName = userInfo.userName;
                    }

                }

                if (userInfo) {
                    var notifyData = {
                        "title": "New Assignment From " + senderName,
                        "body": data.messagesBox[0].message,
                        "sound": "default",
                        "badge": "0",
                        "topic": topic,
                        "categoryIdentifier": "newAssignment"
                    }

                    var dataParam = {};
                    dataParam["senderId"] = senderId;
                    dataParam["assignmentId"] = doc._id
                   
                    if(modifier && modifier["$push"]["messagesBox"]["$each"]){
                       
                        var dd = modifier["$push"]["messagesBox"]["$each"]
                        if (dd.length != 0 && modifier["$push"]["messagesBox"]["$position"] != null && modifier["$push"]["messagesBox"]["$position"] != undefined){
                            dataParam["assignmentThreadId"] =  dd[modifier["$push"]["messagesBox"]["$position"]]._id
                        }
                    }
                    Meteor.call("sendNotification", notifyData, dataParam, topicType, function(e, res) {})
                
                }




            }



        }
    } catch (e) {
    }
});
