Template.tournamentEventOrg_FANAPP.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    this.subscribe("timeZone")
})

Template.tournamentEventOrg_FANAPP.onRendered(function() {
	Session.set("selectedState",undefined)
	Session.set("removedStateAssocId",false)
})

Template.tournamentEventOrg_FANAPP.onDestroyed(function() {
	Session.set("selectedState",undefined)
	Session.set("removedStateAssocId",false)
})

Template.tournamentEventOrg_FANAPP.helpers({
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
    stateList:function(){
    	try{
    		var getStateList = timeZone.find({}).fetch()
    		if(getStateList && getStateList.length){
    			return getStateList
    		}
    	}catch(e){alert(e)}
    },
    listOfAddedAssocs:function(){
    	try{
    		if(Session.get("selectedState") || Session.get("removedStateAssocId")){
    			var data = {
    				stateId:$("#selectStateForDelete").val()
    			}
    			var getListOfAddedAssoc = ReactiveMethod.call("getInsertedIDsForSelectedState",data)
    			if(getListOfAddedAssoc && getListOfAddedAssoc.status && getListOfAddedAssoc.status
    				== SUCCESS_STATUS && getListOfAddedAssoc.data){
    				return getListOfAddedAssoc.data
    			}
    		}
    		
    	}catch(e){}
    }
})

Template.tournamentEventOrg_FANAPP.events({
	"change #selectState":function(e){
		try{

		}catch(e){

		}
	},

	"click #saveAssocIdForState":function(e){
		try{
			Meteor.call("checkDevice")
			/*var stateId = $("#selectState").val()
			var organizerId = $("#organizerId").val()
			var associationName = $("#organizerName").val()
			var data = {
				stateId:stateId,
				stateAssocId:organizerId,
				associationName:associationName
			}
			alert(JSON.stringify(data))
			Meteor.call("insertStateAssociationIds",data,1,function(e,res){
				if(res){
					alert(JSON.stringify(res))
				}else if(e){
					alert(JSON.stringify(e))
				}
			})*/
		}catch(e){
			alert(e)
		}
	},
	"click #deleteSelectedStateAssocId":function(e){
		try{
			var stateId = $("#selectStateForDelete").val()
			var organizerId = $("#organizerIddelete").val()
			var data = {
				stateId:stateId,
				stateAssocId:organizerId
			}
			alert(JSON.stringify(data))
			Meteor.call("parametervalidationsForDrawsResults",{})
			/*Meteor.call("insertStateAssociationIds",data,3,function(e,res){
				if(res){
					var seleVal = $("#selectStateForDelete").val()
					Session.set("selectedState",seleVal)
					Session.set("removedStateAssocId",true)
					alert(JSON.stringify(res))
				}else if(e){
					alert(JSON.stringify(e))
				}
			})*/
		}catch(e){
			alert(e)
		}
	},
	"change #selectStateForDelete":function(e){
		try{
			var seleVal = $("#selectStateForDelete").val()
			if(seleVal){
				Session.set("selectedState",seleVal)
			}
		}catch(e){

		}
	},
	"click #deleteEntriesFromSChool":function(e){
		try{
			var xData = {
				schoolId:$("#schoolId").val(),
				tournamentId:$("#tournamentId").val()
			}
			Meteor.call("deleteSubscriptionNationals",xData,function(e,res){
				if(e){
					alert("error")
				}else if(res){
					alert(JSON.stringify(res))
				}
			})
		}catch(e){
			alert(e)
		}
	}
})