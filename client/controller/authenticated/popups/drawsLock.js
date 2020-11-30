
Template.drawsToLock.onCreated(function() {
	        Session.set("pwdConfirm",undefined);

});


Template.drawsToLock.onRendered(function(){
  
});

Template.drawsToLock.helpers ({

	tournamentName: function() {
        try {
            var tournInfo = undefined;
            if (Router.current().params._eventType && Router.current().params._eventType == "past")
                tournInfo = pastEvents.findOne({
                    "tournamentEvent": true,
                    "_id": Router.current().params._id
                });
            else
                tournInfo = events.findOne({
                    "tournamentEvent": true,
                    "_id": Router.current().params._id
                });


            if (tournInfo != undefined)
                return tournInfo.eventName
        } catch (e) {}

    },
	"tournamentDraws":function(){
		if(Session.get("tournamentDrawsOnLock"))
		    return Session.get("tournamentDrawsOnLock");
		else
			return [];

	}
	
});


Template.drawsToLock.events({
	'click #lockDraw': function(e) {
    	e.preventDefault();
       $("#drawsToLock").modal('hide');

        $("#confirmPasswordForLockDrawsPopUp").empty();

        Session.set("pwdLockDraw",this);


        Blaze.render(Template.confirmPasswordForDrawsLock, $("#confirmPasswordForLockDrawsPopUp")[0]);
        $("#confirmPasswordForDrawsLock").modal({
            backdrop: 'static'
        });
    },
    'click #cancelLock':function(e)
    {
    	$("#drawsToLockContent").empty();
    	$("#confirmPasswordForLockDrawsPopUp").empty();
    	Session.set("pwdLockDraw",undefined);

    	$( '.modal-backdrop' ).remove();
    	$( '.modal-backdrop' ).remove();

    }


    /* shalini code ends here */

})

Template.registerHelper("checkLockStatus", function(data) {
    try {
        	if(data == undefined || data == "no" || data == false)    
        		return true;
        	else
        		return false;
        
    } catch (e) {}
});

Template.registerHelper("checkLockStatusSet", function(data) {
    try {
        	if(data == false)       
        		return true;
        	else     	
        		return false;
        	
        
    } catch (e) {}
});


Template.registerHelper("lockStatus",function(data){
	if(data != undefined && data == true)
		return "Locked";
	else
		return "Pending"
})

/************* reset template *********/
Template.confirmPasswordForDrawsLock.onCreated(function() {

});

Template.confirmPasswordForDrawsLock.helpers({
	"eventName":function(){
		try{
			if(Session.get("pwdLockDraw") != undefined)
			{
				var json = Session.get("pwdLockDraw");
				if(json && json.eventName)
					return json.eventName;
			}
		}catch(e){
		}
	}
})
Template.confirmPasswordForDrawsLock.events({
    'submit form': function(e) {
        e.preventDefault();
        $("#changePasswordSucc").html("")
    },
    'focus #oldPassword': function(e) {
        $("#changePasswordSucc").html("")
    },
    "click #cancelLockPassword":function(e)
    {
        $("#confirmPasswordForLockDrawsPopUp").empty();
        $("#drawsToLock").modal('show');
    }
});

Template.confirmPasswordForDrawsLock.onRendered(function() {
    $('#application-confirmPasswordForDrawsLock').validate({
        onkeyup: false,
        rules: {
            oldPassword: {
                required: true,
                minlength: 6,
            },
        },
        // Display only one error at a time
        showErrors: function(errorMap, errorList) {
            $("#application-confirmPasswordForDrawsLock").find("input").each(function() {
                $(this).removeClass("error");
            });
            if (errorList.length) {
                $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + errorList[0]['message']);
                $(errorList[0]['element']).addClass("error");
            }
        },
        messages: {
            oldPassword: {
                required: "Please enter  your password ",
                minlength: "Please enter a valid  password.",
            },
        },
        submitHandler: function() {
            $("#changePasswordError").html("");
            var digest = Package.sha.SHA256($('#oldPassword').val());
            try {
                Meteor.call('checkPassword', digest, function(err, result) {
                    try {
                        if (result.error == null) {
                            $("#confirmPasswordForDrawsLock").modal('hide');

                      		if(Session.get("pwdLockDraw"))
                      		{
                      			var json = Session.get("pwdLockDraw")
                      			if(json && json.eventName)
                      			{
                      				var paramJson = {};
                      				paramJson["tournamentId"] = Router.current().params._id;
                      				paramJson["eventName"] = json.eventName;
                      				paramJson["drawsLock"] = true;
                      				Meteor.call("updateLockOnDraws",paramJson,function(error,result)
                      				{
                      					if(result && result.message)
                      						displayMessage(result.message)

                      				})
                      			}
                      			else
                      			{
                      				displayMessage("Invalid params");
                      			}
                      		}
                      		else
                      		{
                      			displayMessage("Invalid params");

                      		}
                                            
                        } else {
                            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + result.error.reason);

                        }
                    } catch (e) {
                    }
                });
            } catch (e) {
            }
        }
    });
});