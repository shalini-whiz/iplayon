import {
    emailRegex
}
from '../dbRequiredRole.js'

Meteor.methods({
    "checkUserRoleBeforeLogin": function(emailAddress, emailOrPhone) {
        try {
            if(emailAddress == "ip_admin@arra.ooo"){
                return true
            }
            else if (emailAddress != null && emailAddress != undefined && emailAddress.length != 0 && emailOrPhone == "1") {
                var s = emailAddress.split("loginForPlayerIplayOn")
                if (s[1] != undefined )
                {
                    var checkRoleOfUser = Meteor.users.findOne({
                        $or: [{
                            "emailAddress": {
                                $regex: emailRegex(s[0])
                            },
                            "emails.0.address": {
                                $regex: emailRegex(s[0])
                            }
                        }],
                        /*verifiedBy: {
                            $in: ["email"]
                        }*/
                    });

                    if (checkRoleOfUser && checkRoleOfUser.role.toLowerCase() == "player") {
                        return true
                    }
                    else if(checkRoleOfUser == undefined){
                        return false
                    } 
                    else {
                        return "notPlayer"
                    }
                } else {
                    var checkRoleOfUser = Meteor.users.findOne({
                        $or: [{
                            "emailAddress": {
                                $regex: emailRegex(s[0])
                            },
                            "emails.0.address": {
                                $regex: emailRegex(s[0])
                            }
                        }],
                       /*verifiedBy: {
                            $in: ["email"]
                        }*/
                    });
                    if (checkRoleOfUser && checkRoleOfUser.role.toLowerCase() == "player") {
                        return false
                    }
                    else if(checkRoleOfUser == undefined){
                        return undefined
                    } 
                    else {
                        return "notPlayer"
                    }
                }
            } else if (emailAddress != null && emailAddress != undefined && emailAddress.length != 0 && emailOrPhone == "2") {
                var s = emailAddress.split("loginForPlayerIplayOn")
                if (s[1] != undefined) {
                    var checkRoleOfUser = Meteor.users.findOne({
                        'phoneNumber': s[0],
                        /*verifiedBy: {
                    $in: ["phone"]
                }*/
                    });
                    if (checkRoleOfUser && checkRoleOfUser.role.toLowerCase() == "player") {
                        return true
                    }
                    else if(checkRoleOfUser == undefined){
                        return undefined
                    } 
                    else {
                        return "notPlayer"
                    }
                } else {
                    var checkRoleOfUser = Meteor.users.findOne({
                        'phoneNumber': s[0],
                       /*verifiedBy: {
                    $in: ["phone"]
                }*/
                    });
                    if (checkRoleOfUser && checkRoleOfUser.role.toLowerCase() == "player") {
                        return false
                    }
                    else if(checkRoleOfUser == undefined){
                        return undefined
                    }
                    else {
                        return "notPlayer"
                    }
                }
            } /*else {
                return true
            }*/
            /*var checkRoleOfUser = Meteor.users.findOne({'emails.0.address':emailAddress});
			if (checkRoleOfUser && checkRoleOfUser.role.toLowerCase() == "player"){

				return false
			}
			else{
				return true
			}*/
        } catch (e) {
        }
    }
})

Meteor.methods({
    "getUsernameForPhone": function(emailAddress) {
        try {
            var checkRoleOfUser = Meteor.users.findOne({
                'phoneNumber': emailAddress,
                /*verifiedBy: {
                    $in: ["phone"]
                }*/
            });
            if (checkRoleOfUser && checkRoleOfUser.username) {
                return checkRoleOfUser.username
            }
            else if (checkRoleOfUser && checkRoleOfUser.emailAddress){
                return checkRoleOfUser.emailAddress
            } 
            else {
                return false
            }
        } catch (e) {
        }

    }
})

Meteor.methods({
    "onlyApprovedUsersLogin":function(email){
        try {
            if(email == "ip_admin@arra.ooo"){
                return true
            }
            else{
                var checkRoleOfUser = Meteor.users.findOne({
                        $or: [{
                            "emailAddress": {
                                $regex: emailRegex(email)
                            },
                            "emails.0.address": {
                                $regex: emailRegex(email)
                            }
                        }],
                   /*verifiedBy: {
                            $in: ["email"]
                        }*/
                });
                if(checkRoleOfUser){
                    var checkForUserLogin = userLogins.findOne({
                        "email":emailRegex(email),
                        approveStatus:true
                    })
                    if(checkForUserLogin){
                        return true
                    }else{
                        return false
                    }

                } else{
                    return undefined
                }
            }
        }
        catch(e){
            return undefined
        }
    }
})


Meteor.methods({
    "approveUserLogin":function(email,approve){
        try{
            if(email){
                var checkRoleOfUser = Meteor.users.findOne({
                        $or: [{
                            "emailAddress": {
                                $regex: emailRegex(email)
                            },
                            "emails.0.address": {
                                $regex: emailRegex(email)
                            }
                        }],
                    /*verifiedBy: {
                            $in: ["email"]
                        }*/
                });
                if(checkRoleOfUser){
                    var s = userLogins.findOne({
                        "email":emailRegex(email)
                    })
                    if(s){
                        var s2 = userLogins.update({
                            email:emailRegex(email)
                        },{
                            $set:{
                                approveStatus:approve
                            }
                        })
                        if(s2){
                            return " "+email+" approval status has been set to "+approve
                        }
                    }
                    else{
                        var s1 = userLogins.insert({
                            email:email,
                            approveStatus:approve
                        })
                        if(s1){
                            return " "+email+" approveStatus has been set to "+approve
                        }
                    }
                }else{
                    return "email is not registered"
                }
            }else{
                return "email is required"
            }
        }catch(e){
            return false
        }
    }
})