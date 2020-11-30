//adminRoleAPI

Template.adminRoleAPI.onCreated(function() {
    this.subscribe("authAddress");
    //this.subscribe("users");
    this.subscribe("customDataDBPub");
});

Template.adminRoleAPI.onRendered(function() {

});


Template.adminRoleAPI.helpers({
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
                        boolVal = false;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
});

Template.adminRoleAPI.events({
	"change #adminSelectionType":function(e)
	{
 		var selectionType = $("#adminSelectionType").val();
		if(selectionType == "acaDetails")
		{
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.academyContent, $("#adminRenderOnFunction")[0]);
		} 
		else if(selectionType == "playerAcaSwap")
		{
			$("#adminRenderOnFunction").empty();
            Blaze.render(Template.playerAcademySwapContent, $("#adminRenderOnFunction")[0]);
		}		
	}
});


Template.academyContent.onCreated(function(){
	this.subscribe("academyDetails");
	Session.set("acaID",undefined);
	Session.set("acaDetailsHeader",undefined)

})


Template.academyContent.helpers({
	"acaList":function()
	{
		var acaList = academyDetails.find({}).fetch();
		return acaList;
	}
})


Template.adminAcademyProfile.helpers({
	"academyProfile":function(){
		if(Session.get("acaID") != undefined)
		{
			var academyInfo = academyDetails.findOne({"userId":Session.get("acaID")})
			if(academyInfo)
				return academyInfo;
		}
	},
	"acaDetailsHeader":function(){
		if(Session.get("acaDetailsHeader") != undefined)
			return Session.get("acaDetailsHeader")
	},
	"fetchJsonVal":function(key,academyProfile){
		if(Session.get("acaDetailsHeader") != undefined &&  key != undefined && academyProfile != undefined && academyProfile[key] != undefined)
		{
			return academyProfile[key];
		}
	}
})

Template.academyContent.events({

	"click #editAcademy":function(e)
	{
		$("#academyModalContent").empty();
    	Session.set("acaID",this.userId);

    	var acaDetailsHeader = ["clubName","contactPerson","address","city","pinCode"];
    	Session.set("acaDetailsHeader",acaDetailsHeader)

		Blaze.render(Template.adminAcademyProfile, $("#academyModalContent")[0]);
		$("#adminAcademyProfile").modal({
			backdrop: 'static',
			keyboard: false
		});
	
	},
	"click #remAcademy":function(e){

		try{

			var confirmStatus = confirm("Please confirm removal of academy "+this.clubName+" ?");
			if (confirmStatus == true) 
			{
			  	Meteor.call("removeAcademy",this.userId,function(error,result)
				{
					if(result)	
						alert(result);	
					else
						alert(error);
				})
			}
		}catch(e){

		}
	},
	//playerAcademySwap
})


/***********************************************************/
Template.playerAcademySwapContent.onCreated(function(){
	Session.set("playerUnderAca",undefined);
	this.subscribe("timeZone");
	this.subscribe("academyDetails");


})


Template.playerAcademySwapContent.helpers({
	"playerUnderAcaExists":function(){
		if(Session.get("playerUnderAca") != undefined)
		{
			return Session.get("playerUnderAca")
		}
	},
	"playerSearch":function()
	{
		if(Session.get("playerUnderAca") == undefined)
		{

			if($("#searchPlayer_Aca").val().length > 0)
				return "Player with matching email address doesn't exist. ";
			
		}
	},
	"acaList":function()
	{
		var acaList = academyDetails.find({},{sort:{"clubName":1}}).fetch();
		return acaList;
	}
})

//

//rhitwickm@gmail.com


Template.playerAcademySwapContent.events({
	"click #searchPlayer":function(e){
		if($("#searchPlayer_Aca").val().length > 0)
		{
			Meteor.call("getPlayer_Aca_ViaEmail",$("#searchPlayer_Aca").val(),function(err,result){
				if(result)
				{
					Session.set("playerUnderAca",result)
				}
			})
		}
		else
		{
			alert("Please provide email address")
		}
	},
	"click #setAcademy":function(e)
	{
		//acaList
		var academyId = $("[name='setAcaList'] option:selected").attr("name");

		if(academyId != undefined)
		{
			let academy = $("#setAcaList").val();
			let userInfo = Session.get("playerUnderAca");
			var valid = confirm("Set New Academy \""+academy+"\" to "+userInfo.userName);
			if(valid)
			{
				//call 
				Meteor.call("playerAcademySwap",userInfo.userId,academyId,function(err,result){
					if(result)
					{
						Meteor.call("getPlayer_Aca_ViaEmail",userInfo.emailAddress,function(err,result){
						if(result)
						{
							Session.set("playerUnderAca",result)
						}
					})
					}
				})
			}
			
		}
		else
		{
			displayMessage("Please choose academy")
		}

	}
})
