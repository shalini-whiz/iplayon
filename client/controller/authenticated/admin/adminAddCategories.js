Template.adminAddCategories.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    this.subscribe("mainProjects")

    var self = this;
    self.autorun(function() {
        self.subscribe("usersToCreateArticles", Session.get("searchValueOfPublisher"), Session.get("typeOfPublisherSess"));
    });
})
Template.adminAddCategories.onRendered(function() {
})

Template.adminAddCategories.onDestroyed(function() {})

Template.adminAddCategories.helpers({
    notAdmin: function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = false;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    mainProjectsList: function(){
    	try{
    		var list = mainProjects.find({}).fetch()
    		return list
    	}catch(e){

    	}
    },
    "selectedFeature": function() {
        return true
    },
})


Template.adminAddCategories.events({
    "change #featureType": function(e) {
        try {
            e.preventDefault();
            var selectedId = $("#featureType").val();
            if (selectedId) {
            }
        } catch (e) {

        }
    },
    'click #save': function() {
        var xdata = {
        	_id:$("#featureType").val(),
			projectName:$("#projectName").val(),
			abbName:$("#abbName").val(),
			gender:$("#gender").val(),
			dob:$("#dob").val()
        }

        Meteor.call("addCategoriesToProject",xdata,function(e,res){
       		if(e){
                 alert(e.reason)
            }
            else{
                if(res && res.status == 0){
                    alert(res.message)
                }
                else if(res && res.status == 1){
                    alert(res.message)
                }
                else{
                    alert("cannot update")
                }
            }
        })
    },
    'click #cancel': function(e) {
        e.preventDefault();
        Router.go("/adminMenu");
    }
})