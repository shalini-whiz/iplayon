Template.removePackFeature.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	var self = this;
    self.autorun(function () {
     self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"),Session.get("typeOfPublisherSess"));
    });
    this.subscribe("packageFeatures")
})
Template.removePackFeature.onRendered(function(){
	
})
Template.removePackFeature.onDestroyed(function(){
	
})
Template.removePackFeature.helpers({
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
				return r.features
			}
		}catch(e){
		}
	}
})
Template.removePackFeature.events({

	'click #cancel':function(e){
        e.preventDefault();
        Router.go("/adminMenu");
    },
    "click #removePackType":function(e){
    	e.preventDefault()
    	if($("#packTypes").val()){
    		Meteor.call("removePackFeatures",$("#packTypes").val(),function(e,res){
    			if(e){
    				displayMessage(e)
    			}
    			else if(res){
    				if(res.data!=0){
    					$("#titleOfArticle").val("")
    					$("#descOfArticle").val("")
    					displayMessage(res.message)
    				}else{
    					displayMessage("cannot save.."+"\n"+res.message)
    				}
    			}
    		})
    	}
    }
})