
Template.createInsertUpdatePacks.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	var self = this;
    self.autorun(function () {
     self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"),Session.get("typeOfPublisherSess"));
    });
    this.subscribe("packsOfPublisherPacks")
})
Template.createInsertUpdatePacks.onRendered(function(){
	
})
Template.createInsertUpdatePacks.onDestroyed(function(){
	
})
Template.createInsertUpdatePacks.helpers({
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
	fetchInsertedPackTypes:function(){
		try{
			let r = packsOfPublisher.findOne({});
			if(r && r.packs && r.packs.length != 0){
				return r.packs.toString()
			}
		}catch(e){
		}
	}
})
Template.createInsertUpdatePacks.events({
		"click #savePackTtype":function(e){
		e.preventDefault();
		if($("#packType").val() && $("#packType").val().trim().length != 0){
			let r = packsOfPublisher.findOne({})
			if(r && r.packs && r.packs.length != 0){
				var s = []
				s = r.packs
				if(s.indexOf($("#packType").val().trim())==-1){
				s.push($("#packType").val())
				Meteor.call("createpacksOfPublisherPacks",s,function(e,res){
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
				Meteor.call("createpacksOfPublisherPacks",s,function(e,res){
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
			displayMessage("enter pack type")
		}
	},
	'click #cancel':function(e){
        e.preventDefault();
        Router.go("/adminMenu");
    }
})

Template.removeInsertedPacks.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	var self = this;
    self.autorun(function () {
     self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"),Session.get("typeOfPublisherSess"));
    });
    this.subscribe("packsOfPublisherPacks")
})
Template.removeInsertedPacks.onRendered(function(){
	
})
Template.removeInsertedPacks.onDestroyed(function(){
	
})
Template.removeInsertedPacks.helpers({
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
	fetchInsertedPackTypes:function(){
		try{
			let r = packsOfPublisher.findOne({});
			if(r && r.packs && r.packs.length != 0){
				return r.packs
			}
		}catch(e){
		}
	}
})
Template.removeInsertedPacks.events({

	'click #cancel':function(e){
        e.preventDefault();
        Router.go("/adminMenu");
    },
    "click #removePackType":function(e){
    	e.preventDefault()
    	if($("#packTypes").val()){
    		Meteor.call("removeInsertedPacksCall",$("#packTypes").val(),function(e,res){
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