
Template.createInsertUpdateCategories.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	var self = this;
    self.autorun(function () {
     self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"),Session.get("typeOfPublisherSess"));
    });
    this.subscribe("packsOfCategoriesPacks")
})
Template.createInsertUpdateCategories.onRendered(function(){
	
})
Template.createInsertUpdateCategories.onDestroyed(function(){
	
})
Template.createInsertUpdateCategories.helpers({
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
			
			let r = categoryOfPublisher.findOne({});
			if(r && r.category && r.category.length != 0){
				return r.category.toString()
			}
		}catch(e){
		}
	}
})



Template.createInsertUpdateCategories.events({
		"click #savePackTtype":function(e){
		e.preventDefault();
		if($("#packType").val() && $("#packType").val().trim().length != 0){
			let r = categoryOfPublisher.findOne({})
			if(r && r.category && r.category.length != 0){
				var s = []
				s = r.category
				if(s.indexOf($("#packType").val().trim())==-1){
				s.push($("#packType").val())
				Meteor.call("createcategoriesOfPublisherPacks",s,function(e,res){
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
				Meteor.call("createcategoriesOfPublisherPacks",s,function(e,res){
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

Template.removeInsertedCategories.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
	var self = this;
    self.autorun(function () {
     self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"),Session.get("typeOfPublisherSess"));
    });
    this.subscribe("packsOfCategoriesPacks")
})
Template.removeInsertedCategories.onRendered(function(){
	
})
Template.removeInsertedCategories.onDestroyed(function(){
	
})
Template.removeInsertedCategories.helpers({
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
			let r = categoryOfPublisher.findOne({});
			if(r && r.category && r.category.length != 0){
				return r.category
			}
		}catch(e){
		}
	}
})
Template.removeInsertedCategories.events({

	'click #cancel':function(e){
        e.preventDefault();
        Router.go("/adminMenu");
    },
    "click #removePackType":function(e){
    	e.preventDefault()
    	if($("#packTypes").val()){
    		Meteor.call("removeInsertedcategoriesCall",$("#packTypes").val(),function(e,res){
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