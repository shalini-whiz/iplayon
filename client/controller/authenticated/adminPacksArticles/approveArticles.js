

Template.approveArticles.onCreated(function(){
	this.subscribe("onlyLoggedIn")
    this.subscribe("articlesPub");
    this.subscribe("authAddress");
    this.subscribe("usersInArticles");
	
})




Template.approveArticles.helpers({
	notAdmin:function(){
		try{
			var emailAddress = Meteor.user().emails[0].address;
			var boolVal = false
			var auth = authAddress.find({}).fetch();
			if(auth){
				for(var i=0;i<auth.length;i++){
					if(emailAddress&&emailAddress==auth[i].data){
						boolVal=false;
					}
					else{
						boolVal=true;
						break;
					}
				};
			}
			return boolVal
		}catch(e){
		}
	},
	pendingArticleList:function()
    {
        return articlesOfPublisher.find({}).fetch();
    }
	
})


Template.approveArticles.events({
	"click #adminApprove":function(e)
    {
        Meteor.call("approveArticleStatus",this._id,function(error,result)
        {
            if(result)
                displayMessage(result);
        })
    }
})

