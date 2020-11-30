/************ Template profile address *************/
Template.profileAddress.onCreated(function(){
	this.subscribe("onlyLoggedIn");
	this.subscribe("domains");
	 Session.set("selectedCountry", undefined);


	if(Meteor.user().role == "Player")
		this.subscribe("loggedPlayerInfo",Meteor.userId());
	else if(Meteor.user().role == "Academy")
		this.subscribe("getAcademyDetails",Meteor.user().userId);
	else if(Meteor.user().role == "Association")
		this.subscribe("getAssociationDetails",Meteor.user().userId);
	else 
		this.subscribe("getLoggedOtherUserDetails",Meteor.user().userId);

});

var nameToCollection = function(name) {
  return this[name];
};

Template.profileAddress.onRendered(function(){
	Meteor.call("getSportsMainDB",false,function(e,res){
        if(res != undefined && res != null && res != false){
            toRet = res
            Session.set("playerDBName",toRet)
        }
        else if(res != undefined && res != null && res == 2){
            toRet = false
            alert("select sport first")
            Session.set("playerDBName",toRet)
        }
        else if(e){
            toRet = false
            Session.set("playerDBName",toRet)
            alert(e)
        }
    })
})
Template.profileAddress.helpers({


	profile:function()
	{
		if(Meteor.user().role == "Player" && Session.get("playerDBName"))
		{
			var playerInfo = nameToCollection(Session.get("playerDBName")).findOne({userId:Meteor.user().userId});
			if(playerInfo)
				return playerInfo;
		}
		else if(Meteor.user().role == "Academy")
		{
			var academyInfo = academyDetails.findOne({userId:Meteor.user().userId});
			if(academyInfo)
				return academyInfo;
		}
		else if(Meteor.user().role == "Association")
		{
			var associationInfo = associationDetails.findOne({userId:Meteor.user().userId});
			if(associationInfo)
				return associationInfo;
		}
		else
		{
			var otherUserInfo = otherUsers.findOne({userId:Meteor.user().userId});
			if(otherUserInfo)
				return otherUserInfo;
		}
	},
	"playerRoleExists":function()
	{
	try{
			if(Meteor.user().role == "Player")
				return true;
		}catch(e){}
	},
	coachExists:function()
	{
		try{
			if(Meteor.user().role == "Coach")
				return true;
		}catch(e){}
	},
	lCountryName: function() {
		var domainArr = domains.find({}).fetch();
		return _.uniq(domainArr, false, function(domainArr) {
			return domainArr.countryName
		});
	},
	"checkCountrySelection":function(data1,data2)
	{
		if(data1 == data2)
		{
			Session.set("selectedCountry", data1);
			return true;
		}
	},
	lDomainName: function() {
		if(Session.get("selectedCountry") != undefined)
		{
			var lProjectNames = domains.find({"countryName":Session.get("selectedCountry")}).fetch();
		 	if(lProjectNames.length!==0)
   				return lProjectNames;
		}
		else
		{
			
			if(Meteor.user().role == "Association")
			{
				var	userInfo = associationDetails.findOne({"userId":Meteor.user().userId});
			
				if(userInfo && userInfo.state && (userInfo.associationType == "State/Province/County"))
				{
					var lProjectNames = domains.find({"_id":userInfo.state}).fetch();
			 		if(lProjectNames.length!==0)
	   					return lProjectNames;
						
				}
				else if(userInfo && userInfo.state && (userInfo.associationType == "District/City"))
				{
					if(userInfo.affiliatedTo && userInfo.affiliatedTo != "other")
					{
						var lProjectNames = domains.find({"_id":userInfo.state}).fetch();
			 			if(lProjectNames.length!==0)
	   						return lProjectNames;
					}
					else
					{
						var lProjectNames = domains.find({}).fetch();
			 			if(lProjectNames.length!==0)
	   						return lProjectNames;
					}
					
						
				}		
			}
			else if(Meteor.user().role == "Academy")
			{
				var userInfo = academyDetails.findOne({"userId":Meteor.user().userId});
				if(userInfo && userInfo.state)
				{
					if(userInfo.affiliatedTo && userInfo.affiliatedTo != "other")
					{
						var lProjectNames = domains.find({"_id":userInfo.state}).fetch();
			 			if(lProjectNames.length!==0)
	   						return lProjectNames;
					}
					else
					{
						var lProjectNames = domains.find({}).fetch();
			 			if(lProjectNames.length!==0)
	   						return lProjectNames;
					}
					
						
				}
			}
			else
			{
				var lProjectNames = domains.find().fetch();
		 		if(lProjectNames.length!==0)
   					return lProjectNames;
			}
			
		}
		

	},
	
	


})


Template.profileAddress.events({
	'change #country': function(e) {
        
        var packID = $("[name='country'] option:selected").attr("name");
        Session.set("selectedCountry", packID);

    },
	"keyup #pinCode": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
	'click #profileAddressSave': function(e) 
	{  
		$("#impMsg").text("")
		var lAddress = $("#address").val();
		var lCity = $("#city").val();
		var lState = $("#state").val();
		var lPinCode = $("#pinCode").val();

		if(lCity.trim().length==0|| lPinCode.trim().length==0 || lPinCode.trim().length!=6)
		{
			if(lCity == "")
				$("#impMsg").text("* Please enter city")
			else if(lPinCode == "" || lPinCode.length != 6)
				$("#impMsg").text("* Please enter 6 digit valid pincode");
			else
				$("#impMsg").text("* Please enter city and pincode")

			return false;
		}
		else{

		var lData = {
			address:lAddress,
			city:lCity,
			state:lState,
			pinCode:lPinCode,
			userId: Meteor.user().userId,
		};

		if(Meteor.user().role == "Player")
		{
			Meteor.call("updatePlayerAddress", lData, function(error, response) {
				if (response) {
 					$("#playerProfileAddressPopUp").empty();
 					$( '.modal-backdrop' ).remove();

				} else if (error) {}
			});
		}
		else if(Meteor.user().role == "Academy")
		{
			Meteor.call("updateAcademyAddress", lData, function(error, response) {
				if (response) {
 					$("#academyProfileAddressPopUp").empty();
 					$( '.modal-backdrop' ).remove();

				} else if (error) {}
			});
		}
		else if(Meteor.user().role == "Association")
		{
			Meteor.call("updateAssociationAddress", lData, function(error, response) {
				if (response) {
 					$("#associationProfileAddressPopUp").empty();
 					$( '.modal-backdrop' ).remove();

				} else if (error) {}
			});
		}
		else if(Meteor.user().role == "Coach")
		{
			var lCountry = $("#country").val();
			if(lCountry != null && lCountry != '0')
			{
				var lData = {
					address:lAddress,
					city:lCity,
					state:lState,
					pinCode:lPinCode,
					userId: Meteor.user().userId,
					"country":lCountry
				};

				Meteor.call("updateOtherUserAddress", lData, function(error, response) {
					if (response) {
	 					$("#otherUserProfileAddressPopUp").empty();
	 					$( '.modal-backdrop' ).remove();

					} else if (error) {}
				});
			}
			else
			{
				alert("Please choose country");
			}
			
		}
		else
		{
			Meteor.call("updateOtherUserAddress", lData, function(error, response) {
				if (response) {
 					$("#otherUserProfileAddressPopUp").empty();
 					$( '.modal-backdrop' ).remove();

				} else if (error) {}
			});
		}
		}
	}

})