Meteor.methods({

	"fetchArticles":function(userId)
	{
		try{
			var resultJson = {};
			if(userId != null || userId != undefined)
			{
				var userInfo = Meteor.users.findOne({"userId":userId});
				if(userInfo)
				{
					var articlesExist = articlesOfPublisher.find({"type" : "Articles","status" : "active","adminStatus":"approved"}).fetch()
		            if (articlesExist && articlesExist.length != 0) 
		            {
		                var raw = articlesOfPublisher.rawCollection();
		                var distinct = Meteor.wrapAsync(raw.distinct, raw);
		                var userList = distinct('userId', {"type":"Articles","status" : "active","adminStatus":"approved"});
		                var userData = Meteor.users.find({"_id": {$in: userList}},{fields: {userName: 1,userId: 1}}).fetch();

						var articleCategoryList = [];
                        var categoryInfo = categoryOfPublisher.findOne({});
                        if(categoryInfo && categoryInfo.category)
                            articleCategoryList = categoryInfo.category;

                       

		                resultJson["status"] = "success";
		            	resultJson["articleData"] = articlesExist;
		            	resultJson["userData"] = userData;
		            	resultJson["articleCategory"] = articleCategoryList;

		            	return resultJson;
		            }
		            else
		            {
		            	resultJson["status"] = "failure";
		            	resultJson["response"] = "There are no articles";
		            	return resultJson;
		            }
				}
				else
				{
					resultJson["status"] = "failure";
            		resultJson["response"] = "Invalid user";
            		return resultJson;
				}
			}
			else
			{
				resultJson["status"] = "failure";
            	resultJson["response"] = "Invalid params";
            	return resultJson;
			}
		}catch(e){
				resultJson["status"] = "failure";
            	resultJson["response"] = "Invalid data";
            	return resultJson;
		}
	},
	"approveArticleStatus":function(id)
	{
		try{

			var articlesExist = articlesOfPublisher.findOne({"type" : "Articles","_id":id});
		    if (articlesExist) 
		    {
		        var status = articlesOfPublisher.update({"_id":id},{$set:{"adminStatus":"approved"}});
		    	if(status)
		    		return "Article Approved";
		    	else
		    		return "Could not approve article!!";
		    }
		}catch(e)
		{

		}
	}
});