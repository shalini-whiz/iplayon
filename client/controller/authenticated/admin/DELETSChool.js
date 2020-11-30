Template.DELETSChool.onCreated(function(){
	this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    this.subscribe("GETSchoolDetails")

    this.subscribe("schoolDetailsadmin")
    this.subscribe("schoolEventsToFindadmin")
    this.subscribe("schoolPlayerEntriesadmin")
    this.subscribe("schoolPlayerTeamEntriesadmin")
    this.subscribe("schoolPlayersadmin")
    this.subscribe("schoolTeamsadmin")
    this.subscribe("playerTeamsadmin")
    this.subscribe("playerTeamEntriesadmin")
});

Template.DELETSChool.onRendered(function(){

});

Template.DELETSChool.helpers({
    "notAdmin": function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    getSchoolLIST:function(){
    	try{
    		var s = schoolDetails.find({}).fetch();
    		if(s&&s.length){
    			return s
    		}
    	}catch(e){}
    }
});

Template.DELETSChool.events({
	"click #deleteSchool":function(e){
		var schoolId = $("#SelectSchool").val()
		alert(schoolId)
		Meteor.call("deleteSchoolDetails",schoolId,function(e,res){
			if(e){
				alert(e.reason)
			} else {

			}
		})
	}
})