Template.getListofPlayers.onCreated(function(){
	this.subscribe("users");
	this.subscribe("apiUsers");
});

Template.getListofPlayers.onRendered(function(){
	Session.set("websiteNameVar",undefined)
	
});

Template.getListofPlayers.helpers({
	'apiKey': function(){
		try{
			var sdf = Session.get("websiteNameVar")
			if(sdf){
				var currentWebsiteId = apiUsers.findOne({ apiUser: sdf.trim() });
		     	if(currentWebsiteId){
		     		return currentWebsiteId.apiKey;
		     	}
		     	else{
		     		return "currentWebsiteId was not found.";
		     	}
     		}
     	}
		catch(e){
		}
	}
});

Template.getListofPlayers.events({
	'submit form': function(event){
		try{
			event.preventDefault();
			var websiteNameVar = $("#websiteName").val().trim();
			var sourceVal = $("#source").val().trim();

			Meteor.call('generateAPIKey',websiteNameVar,sourceVal,function(e,r){
				if(r){
					Session.set("websiteNameVar",websiteNameVar);
					$("#websiteName").val("");
				}
				else{
				}
			});
		}catch(e){
		}
	}	
});