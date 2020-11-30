coachAPPINSentBOX.after.insert(function (userId, doc) {
	try{
		if(doc)
		{
			data = doc;
			
        	var entryExists = coachAPPINSentBOX.findOne({
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
        		else if(data.receiverRole == "All")
        		{
        			senderId = data.senderId;
        			topic = "BroadcastMessages";
        			topicType = 1;

        			userInfo = Meteor.users.findOne({"_id":data.senderId});
		      		if(userInfo)	      		
		      			senderName= userInfo.userName;
		      		
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
						"title":"New Message From "+senderName, 
			            "body": data.message,
			            "sound":"default", 
			            "badge": "0",
			            "topic": topic ,
			            "categoryIdentifier":"newMessage"
					}

					var dataParam = {};
                    dataParam["senderId"] = senderId;
                    dataParam["message"] = data.message;
                    dataParam["messageId"] = data._id;
					Meteor.call("sendNotification",notifyData,dataParam,topicType,function(e,res){})
				}
        	



        	}

			

		}
	}catch(e){
	}
});



coachAPPINSentBOX.after.update(function(userId, doc, fieldNames, modifier, options) {
    try {
       


        var pos = fieldNames.indexOf("receivedDateAndTime");
        if (doc && pos > -1) {

            data = doc;

            var entryExists = coachAPPINSentBOX.findOne({
                "_id": doc._id,
            });
            if (entryExists) {
                var senderName = "";
                var senderId = "";
                var messageId = "";
                var topic = "";
                var topicType = "";
                var userInfo;
                if (data.receiverRole == "Group") {
                    senderId = data.receiverId;
                    topicType = 3;

                    if(data.messagesBox && data.messagesBox.length > 0)
                    {
                         messageId = data.messagesBox[0]._id;

                    }
                    userInfo = coachConnectedGroups.findOne({
                        "_id": data.receiverId
                    });
                    if (userInfo) {
                        senderName = userInfo.groupName;
                        if (userInfo.groupMembers.length > 0) {
                            topic = userInfo.groupMembers;    
                        }

                    }

                } else if (data.receiverRole == "All") {
                    senderId = data.senderId;
                    topic = "BroadcastMessages";
                    topicType = 1;

                    if(data.messagesBox && data.messagesBox.length > 0)
                    {
                         messageId = data.messagesBox[0]._id;

                    }

                    userInfo = Meteor.users.findOne({
                        "_id": data.senderId
                    });
                    if (userInfo)
                        senderName = userInfo.userName;

                } else {
                    topicType = 1;

                    if (doc.messagesBox) 
                    {
                        senderId = data.messagesBox[0].senderId;
                        topic = data.messagesBox[0].receiverId;
                        messageId = data.messagesBox[0]._id;
                        userInfo = Meteor.users.findOne({
                            "userId": data.messagesBox[0].senderId
                        });
                        if (userInfo)
                            senderName = userInfo.userName;
                    }

                }

                if (userInfo) 
                {
                    var notifyData = {
                        "title": "New Message From " + senderName,
                        "body": data.message,
                        "sound": "default",
                        "badge": "0",
                        "topic": topic,
                        "categoryIdentifier": "newMessage"
                    }

                    var dataParam = {};
                    dataParam["senderId"] = senderId;
                    dataParam["messageThreadId"] = messageId;
                    dataParam["message"] = data.message;
                    dataParam["messageId"] = data._id;

                    Meteor.call("sendNotification", notifyData, dataParam, topicType, function(e, res) {})
                }




            }



        }
    } catch (e) {
    }
});

