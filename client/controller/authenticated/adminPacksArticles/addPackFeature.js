
Template.addPackFeature.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	var self = this;
    self.autorun(function () {
     self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"),Session.get("typeOfPublisherSess"));
    });
    this.subscribe("packageFeatures")
})
Template.addPackFeature.onRendered(function(){
	
})
Template.addPackFeature.onDestroyed(function(){
	
})
Template.addPackFeature.helpers({
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
	fetchInsertedPackFeatureTypes:function(){
		try{
			let r = packFeatures.findOne({});
			if(r && r.features && r.features.length != 0){
				return r.features.toString()
			}
		}catch(e){
		}
	}
})



Template.addPackFeature.events({
		"click #savePackFeatureType":function(e){
		e.preventDefault();
		if($("#packType").val() && $("#packType").val().trim().length != 0){
			let r = packFeatures.findOne({})
			if(r && r.features && r.features.length != 0)
			{
				var s = []
				s = r.features
				if(s.indexOf($("#packType").val().trim())==-1){
				s.push($("#packType").val())
				Meteor.call("createPackFeatures",s,function(e,res){
					if(e){
						displayMessage(e)
					}
					else if(res){
						if(res.data!=0){
    						displayMessage(res.message)
    					}else{
    						displayMessage("cannot save.."+"\n"+res.message)
    					}
					}
				})
			}else{
				displayMessage("pack already inserted")
			}
			}else{
				var s = []
				s.push($("#packType").val())
				Meteor.call("createPackFeatures",s,function(e,res){
					if(e){
						displayMessage(e)
					}
					else if(res){
						if(res.data!=0){
    						displayMessage(res.message)
    					}else{
    						displayMessage("cannot save.."+"\n"+res.message)
    					}
					}
				})
			}
			
		}else{
			displayMessage("enter pack feature")
		}
	},
	'click #cancel':function(e){
        e.preventDefault();
        Router.go("/adminMenu");
    }
})

