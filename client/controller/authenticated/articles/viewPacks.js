Template.viewMyService.helpers({
	"viewPackInDetail":function()
	{
		if(Session.get("viewPackID") != undefined)
		{
			var xx = articlesOfPublisher.find({}).fetch();
			var packageInfo = articlesOfPublisher.findOne({"_id":Session.get("viewPackID")});
			if(packageInfo)
				return packageInfo;
		}
	}
})