articlesOfPublisher.after.insert(function (userId, doc) {
	try{
		if(doc)
		{
			data = doc;
			
        	var entryExists = articlesOfPublisher.findOne({
        				"_id":doc._id,"status":"active"
					 	});
        	if(entryExists)
        	{
        		var senderName = "";
        		var senderId = "";
        		var topic = "";
        		
        		topicType = 1;

        		
			    var userInfo = Meteor.users.findOne({"userId":data.userId});
        			      
        		if(userInfo)
				{
					senderName = userInfo.userName;	
        			senderId = data.userId;
        			var title = "";
        			var categoryType = "";


					if(doc.type == "Articles" && doc.adminStatus == "accept")
					{
						title = "New Article - "+senderName;
						categoryType = "newArticle";
					}
					else if(doc.type == "Packs")
					{

						title = "New Plan - "+senderName;
						categoryType = "newPack";

					}

					var notifyData = {
						"title":title, 
			            "body": data.title+" on "+data.category,
			            "sound":"default", 
			            "badge": "0",
			            "topic": "Articles" ,
			            "categoryIdentifier":categoryType
					}

					var dataParam = {};
                    dataParam["senderId"] = data.userId;
                    dataParam["senderName"] = senderName;
                    dataParam["_id"] = data._id;

                   if((doc.type == "Articles" && doc.adminStatus == "accept") ||
                   	doc.type == "Packs")
                   {
                   		Meteor.call("sendNotification",notifyData,dataParam,1,function(e,res){})

                   }



				}
        	}
		}
	}catch(e){
	}
});




articlesOfPublisher.after.update(function(userId, doc, fieldNames, modifier, options) {
    try {
       
        var pos = fieldNames.indexOf("adminStatus");
        if (doc && pos > -1) {
            data = doc;

            if(data.adminStatus == "approved" && data.type == "Articles" && data.status == "active")
            {
				topicType = 1;

        		
			    var userInfo = Meteor.users.findOne({"userId":data.userId});
        			      
        		if(userInfo)
				{
					senderName = userInfo.userName;	
        			senderId = data.userId;
        			var title = "";
        			var categoryType = "";


					if(doc.type == "Articles")
					{
						title = "New Article - "+senderName;
						categoryType = "newArticle";
					}
				

					var notifyData = {
						"title":title, 
			            "body": data.title+" on "+data.category,
			            "sound":"default", 
			            "badge": "0",
			            "topic": "Articles" ,
			            "categoryIdentifier":categoryType
					}

					var dataParam = {};
                    dataParam["senderId"] = data.userId;
                    dataParam["senderName"] = senderName;
                    dataParam["_id"] = data._id;


					Meteor.call("sendNotification",notifyData,dataParam,1,function(e,res){})
				}
            }

            



        }
    } catch (e) {
    }
});