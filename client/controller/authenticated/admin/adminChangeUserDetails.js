Template.adminChangeUserDetails.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
})


Template.adminChangeUserDetails.onRendered(function() {
	Session.set("userDetailsShowAdmin",undefined)
})

Template.adminChangeUserDetails.onDestroyed(function() {
	Session.set("userDetailsShowAdmin",undefined)
})

Template.adminChangeUserDetails.helpers({
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
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {
        }
    },
    userDetailsRed:function(){
    	try{
    		var s = Session.get("userDetailsShowAdmin")
    		if(s){
    			return s
    		}
    	}catch(e){
    	}
    },
    userDetailsDataRed:function(tag){
    	try{
    		var s = Session.get("userDetailsShowAdmin")
    		if(s && s[tag]){
    			return s[tag]
    		}
    	}catch(e){
    	}
    },
	userDetailsName:function(){
		try{
			var s = Session.get("userDetailsShowAdmin")
			if(s && s.role && s.role=="Player"){
				var data = [{
					tagId:"userName",
					title:"userName",
					placeholer:"enter user name",
					tagType:1
				},
				{
					tagId:"dateOfBirth",
					title:"dateOfBirth",
					placeholer:"enter dateOfBirth",
					tagType:1
				},
				{
					tagId:"gender",
					title:"gender",
					placeholer:"enter gender",
					tagType:1
				},
				{
					tagId:"address",
					title:"address",
					placeholer:"enter address",
					tagType:1
				},
				{
					tagId:"city",
					title:"city",
					placeholer:"enter city",
					tagType:1
				},
				{
					tagId:"pinCode",
					title:"pinCode",
					placeholer:"enter pin code",
					tagType:1
				},
				{
					tagId:"guardianName",
					title:"guardianName",
					placeholer:"enter guardian name",
					tagType:1
				},
				{
					tagId:"emailAddress",
					title:"emailAddress",
					placeholer:"enter email address",
					tagType:1
				},
				{
					tagId:"phoneNumber",
					title:"phoneNumber",
					placeholer:"enter phone Number",
					tagType:1
				},
				]
				return data
			}

			else if(s && s.role && s.role=="Association"){
				var data = [{
					tagId:"associationName",
					title:"associationName",
					placeholer:"enter association name",
					tagType:1
				},
				{
					tagId:"address",
					title:"address",
					placeholer:"enter address",
					tagType:1
				},
				{
					tagId:"city",
					title:"city",
					placeholer:"enter city",
					tagType:1
				},
				{
					tagId:"pinCode",
					title:"pinCode",
					placeholer:"enter pin code",
					tagType:1
				},
				{
					tagId:"contactPerson",
					title:"contactPerson",
					placeholer:"enter contact person name",
					tagType:1
				},
				{
					tagId:"emailAddress",
					title:"emailAddress",
					placeholer:"enter email address",
					tagType:1
				},
				{
					tagId:"phoneNumber",
					title:"phoneNumber",
					placeholer:"enter phone Number",
					tagType:1
				},
				]
				return data
			}
		}catch(e){
		}
	},
	checkTagType:function(tagType){
		try{
			if(tagType==1){
				return true
			}
		}catch(e){
		}
	},
	checkDOB:function(tagId,value){
		if(tagId=="dateOfBirth" && Session.get("userDetailsShowAdmin") && 
			Session.get("userDetailsShowAdmin").dateOfBirth){
			return moment(new Date(Session.get("userDetailsShowAdmin").dateOfBirth)).format("DD MMM YYYY")
		}
		else{
			return false
		}
	}
})

Template.adminChangeUserDetails.events({
	"change #userId":function(e){
		Session.set("userDetailsShowAdmin",undefined)
	},
	"keyup #userId":function(e){
		Session.set("userDetailsShowAdmin",undefined)
	},
	"keypress #userId":function(e){
		Session.set("userDetailsShowAdmin",undefined)
	},
	"click #showUserDetails":function(e){
		try{
		Session.set("userDetailsShowAdmin",undefined)

		var userId = $("#userId").val()
		if(userId && userId.trim()){
			Meteor.call("whoisEventOrganizer",userId,function(e,res){
				if(res){
					Session.set("userDetailsShowAdmin",res)
				}
				else if(e){
					alert(e.reason)
				}
			})
		}
		else{
			alert("enter user id")
		}
		}catch(e){
			alert(e)
		}
	},
	"click #saveDetails":function(e){
		try{
			var s = Session.get("userDetailsShowAdmin")
			var xData = {}
			if(s && s.role && s.role=="Player"){
				var fieldNamesPlayer = [
					"userId",
                    "userName",
                    "dateOfBirth",
                    "gender",
                    "address",
                    "city",
                    "pinCode",
                    "guardianName",
                    "emailAddress",
                    "phoneNumber",
                ]
                for(var i=0;i<fieldNamesPlayer.length;i++){
                	xData[fieldNamesPlayer[i]] = $("#"+fieldNamesPlayer[i]).val()
                }

                Meteor.call("updateUserDetailsForGivenId",xData,function(e,res){
                	if(e){
                		alert(e.reason)
                	}
                	else{
                		alert(res.message)
                		if(res.data==1)
                		Session.set("userDetailsShowAdmin",undefined)
                	}
                })
			}
			else if(s && s.role && s.role=="Association"){
				var fieldNamesDA = [
					"userId",
                    "phoneNumber",
                    "contactPerson",
                    "address",
                    "city",
                    "pinCode",
                    "associationName",
                    "emailAddress"
                ]

                for(var i=0;i<fieldNamesDA.length;i++){
                	xData[fieldNamesDA[i]] = $("#"+fieldNamesDA[i]).val()
                }
                Meteor.call("updateUserDetailsForGivenId",xData,function(e,res){
                	if(e){
                		alert(e.reason)
                	}
                	else{
                		alert(res.message)
                		if(res.data==1)
                		Session.set("userDetailsShowAdmin",undefined)
                	}
                })
			}
		}catch(e){
			alert(e)
		}
	}
})

Template.getUserDetailsForGivenEmailOrPhone.onCreated(function(){
	this.subscribe("onlyLoggedIn")
	this.subscribe("authAddress");
})


Template.getUserDetailsForGivenEmailOrPhone.onRendered(function() {
	Session.set("userDetailsShow1",undefined)
})

Template.getUserDetailsForGivenEmailOrPhone.onDestroyed(function() {
	Session.set("userDetailsShow1",undefined)
})


Template.getUserDetailsForGivenEmailOrPhone.helpers({
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
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {
        }
    },
    userDetailsRedKeys:function(){
    	try{
    		var s = Session.get("userDetailsShow1")
    		if(s){
    			return _.keys(s)
    		}
    	}catch(e){
    	}
    },
    userDetailsRedValues:function(keyis){
    	try{
    		var s = Session.get("userDetailsShow1")
    		if(s&&s[keyis]){
    			return s[keyis]
    		}
    	}catch(e){}
    },

	checkDOB:function(tagId){
		if(tagId=="dateOfBirth" && Session.get("userDetailsShow1") && 
			Session.get("userDetailsShow1").dateOfBirth){
			return moment(new Date(Session.get("userDetailsShow1").dateOfBirth)).format("DD MMM YYYY")
		}
		else{
			return false
		}
	}
})

Template.getUserDetailsForGivenEmailOrPhone.events({
	"change #emailOrPhone":function(e){
		Session.set("userDetailsShow1",undefined)
	},
	"keyup #emailOrPhone":function(e){
		Session.set("userDetailsShow1",undefined)
	},
	"keypress #emailOrPhone":function(e){
		Session.set("userDetailsShow1",undefined)
	},
	"click #showUserDetails":function(e){
		try{
		Session.set("userDetailsShow1",undefined)

		var userId = $("#emailOrPhone").val()
		if(userId && userId.trim()){
			Meteor.call("fetchForGivenEmailOrPhone",userId,function(e,res){
				if(res){
					Session.set("userDetailsShow1",res)
				}
				else if(e){
					alert(e.reason)
				}
			})
		}
		else{
			alert("enter user id")
		}
		}catch(e){
			alert(e)
		}
	},
	"click #enableUser":function(){
		try{
			var email =  $("#emailOrPhoneForEnable").val()
			if(email){
				Meteor.call("approveUserLogin",email,true,function(e,res){
					if(e){
						alert(JSON.stringify(e))
					}else{
						alert(res)
					}
				})
			}else{
				alert("enter email address")
			}
		}catch(e){
			alert(e)
		}
	},
	"click #disableUser":function(){
		try{
			var email =  $("#emailOrPhoneForEnable").val()
			if(email){
				Meteor.call("approveUserLogin",email,false,function(e,res){
					if(e){
						alert(JSON.stringify(e))
					}else{
						alert(res)
					}
				})
			}else{
				alert("enter email address")
			}
		}catch(e){
			alert(e)
		}
	}
})