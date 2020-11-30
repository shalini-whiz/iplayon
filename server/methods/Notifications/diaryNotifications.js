

matchDiary.after.update(function(userId, doc, fieldNames, modifier, options) {
    try {

        var pos = fieldNames.indexOf("timeStamp");
        if (doc && pos > -1) 
        {
            data = doc;

            var entryExists = matchDiary.findOne({
                "_id": doc._id,
            });

			
            if (entryExists && entryExists.sharedTo && entryExists.sharedTo.length > 0) 
            {
                var senderName = "";
                var senderId = "";
                var topic = "";
                var topicType = "";
                var userInfo;
                var playerBName = "";

                userInfo = Meteor.users.findOne({
                    "_id": data.playerAId
                   });


                var playerBInfo = Meteor.users.findOne({
                    "userId": data.playerBId
                   });

                if(playerBInfo)
                	playerBName = playerBInfo.userName;
                else
                {
                	playerBInfo =  playerDetailsRecord.findOne({"_id":data.playerBId})
                	if(playerBInfo)
                		playerBName = playerBInfo.playerName;
                }

                if (userInfo)            
                    senderName = userInfo.userName;

                
                if((fieldNames.indexOf("playerBId") > -1) || 
         		(fieldNames.indexOf("matchDate") > -1) || 
         		(fieldNames.indexOf("scores") > -1) ||
         		(fieldNames.indexOf("winnerId") > -1 ))
	         	{

                	topicType = 3;
                	if (doc.sharedTo.length > 0) 
                    {
                        topic = doc.sharedTo;          
                    }

	         	}
	         	else if(modifier["$addToSet"]["sharedTo"])
	         	{
	         		topicType = 1;
	         		topic = modifier["$addToSet"]["sharedTo"];         
	         	}

                                             
                var notifyData = {
                    "title": "Match Diary From " + senderName,
                    "body": "Match: "+senderName+" vs "+playerBName,
                    "sound": "default",
                    "badge": "0",
                    "topic": topic,
                    "categoryIdentifier": "newMatchDiary"
                }


                var dataParam = {};
                dataParam["_id"] = doc._id;
                dataParam["playerAId"] = doc.playerAId;
                dataParam["playerBId"] = doc.playerBId;

                Meteor.call("sendNotification", notifyData, dataParam, topicType, function(e, res) {})
              	
            }
        }
    } catch (e) {
    }
});