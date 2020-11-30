import {
    initDBS
}
from '../dbRequiredRole.js'

import {
    emailRegex
}
from '../dbRequiredRole.js'

Meteor.methods({
    registerValidationGeneralized: function(xData) {
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var roles = initDBS("roles")
        var indexToSkip = initDBS("indexToSkip")
        var indicesOfPlayers = initDBS("indicesOfPlayers")

        var resultJson = {};
        resultJson["status"] = SUCCESS_STATUS;
        resultJson["response"] = 0
        resultJson["playerID"] = false
        var playerID;
        var profileUpdate;

        if (xData.emailIdOrPhone == null || xData.emailIdOrPhone == undefined) {
            xData.emailIdOrPhone = "1"
        }

        if(xData.registerType == null || xData.registerType == undefined){
            xData.registerType = ""
        }

        if(xData.userStatus == null || xData.userStatus == undefined){
            xData.userStatus = "Active"
        }

        if(xData.password == null || xData.password == undefined){
            xData.password = randomPassword_PlayerCSV(6)
        }
        try {
            if (xData) 
            {
                var userFound;
                if (xData.emailAddress && xData.emailAddress.trim().length != 0) {
                    userFound = Meteor.users.findOne({
                        $or: [{
                            "emailAddress": {
                                $regex: emailRegex(xData.emailAddress)
                            },
                            "emails.0.address": {
                                $regex: emailRegex(xData.emailAddress)
                            }
                        }]
                    });
                    if (userFound) 
                    {
                        resultJson["status"] = FAIL_STATUS;
                        resultJson["response"] = 1;
                        resultJson["userID"] = userFound.userId;
                    }
                    else{
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i]) {
                                var ind = i
                                if (ind > parseInt(indexToSkip)) {
                                    ind = parseInt(indexToSkip + 1)
                                }
                                userFound = global[dbsrequiredAll[ind]].findOne({
                                    "emailAddress": {
                                        $regex: emailRegex(xData.emailAddress)
                                    },
                                })
                                if (userFound) {
                                    resultJson["status"] = FAIL_STATUS;
                                    resultJson["response"] = 1
                                    break;
                                }
                            }
                        }
                    }
                }
                if ((userFound == undefined || userFound == null) && xData.phoneNumber && xData.phoneNumber.trim().length != 0) {
                    userFound = Meteor.users.findOne({
                        phoneNumber: xData.phoneNumber,
                    })

                    if (userFound == undefined || userFound == null) {
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i]) {
                                var ind = i
                                if (ind > parseInt(indexToSkip)) {
                                    ind = parseInt(indexToSkip + 1)
                                }
                                userFound = global[dbsrequiredAll[ind]].findOne({
                                    "phoneNumber": xData.phoneNumber,

                                })
                                if (userFound) {
                                    break;
                                }
                            }
                        }
                    }

                    if (userFound) {
                        resultJson["status"] = FAIL_STATUS;
                        resultJson["response"] = 2
                    }
                }

            }

            if (userFound == undefined || userFound == null) 
            {
                if (xData.emailIdOrPhone == "1") 
                {
                    var verified = []
                    var registerType = "individual"

                    if(xData.registerType.trim().length == 0){
                        verified = ["email"]
                        registerType = "individual"
                    }
                    else if(xData.registerType.trim().length != 0 
                        && xData.registerType == "bulk"){
                        verified = []
                        registerType = "bulk"
                    }
                    else if(xData.registerType.trim().length != 0 &&
                        xData.registerType == "individual"){
                        verified = ["email"]
                        registerType = "individual"
                    }

                    if(xData.phoneNumber == undefined || xData.phoneNumber == null){
                        xData.phoneNumber = ""
                    }

                    playerID = Accounts.createUser({
                        email: xData.emailAddress,
                        password: xData.password,
                        userName: xData.userName.trim()
                    });
                    if (playerID && xData.emailAddress) {
                        profileUpdate = Meteor.users.update({
                            "_id": playerID
                        }, {
                            $set: {
                                userId: playerID,
                                profileSettingStatus: true,
                                userName: xData.userName.trim(),
                                emailAddress: xData.emailAddress,
                                verifiedBy: verified,
                                registerType:registerType,
                                phoneNumber:xData.phoneNumber,
                                userStatus:xData.userStatus
                            }
                        });

                    } else {
                        resultJson["status"] = FAIL_STATUS;
                        resultJson["response"] = "emailAddress "+IS_INVALID_MSG
                        return resultJson;
                    }
                } else if (xData.emailIdOrPhone == "2") {
                    var verified = []

                    var registerType = "individual"
                    
                    if(xData.registerType.trim().length == 0){
                        verified = ["phone"]
                        registerType = "individual"
                    }
                    else if(xData.registerType.trim().length != 0 &&
                        xData.registerType == "bulk"){
                        verified = []
                        registerType = "bulk"
                    }

                    else if(xData.registerType.trim().length != 0 &&
                        xData.registerType == "individual"){
                        verified = ["phone"]
                        registerType = "individual"
                    }

                    if(xData.emailAddress == undefined || xData.emailAddress == null){
                        xData.emailAddress = ""
                    }

                    playerID = Accounts.createUser({
                        username: Random.id(),
                        password: xData.password,
                        userName: xData.userName.trim()
                    });
                    if (playerID && xData.phoneNumber) {
                        if(xData.emailAddress.trim().length != 0){
                            profileUpdate = Meteor.users.update({
                                "_id": playerID
                            }, {
                                $set: {
                                    userId: playerID,
                                    profileSettingStatus: true,
                                    userName: xData.userName.trim(),
                                    phoneNumber: xData.phoneNumber,
                                    verifiedBy:verified,
                                    registerType:registerType,
                                    emailAddress:xData.emailAddress,
                                    userStatus:xData.userStatus,
                                    emails: [{"address": xData.emailAddress}]
                                }
                            });
                        }
                        else{
                            profileUpdate = Meteor.users.update({
                                "_id": playerID
                            }, {
                                $set: {
                                    userId: playerID,
                                    profileSettingStatus: true,
                                    userName: xData.userName.trim(),
                                    phoneNumber: xData.phoneNumber,
                                    verifiedBy:verified,
                                    registerType:registerType,
                                    emailAddress:xData.emailAddress,
                                    userStatus:xData.userStatus
                                }
                            });
                        }
                    } else {
                        resultJson["status"] = FAIL_STATUS;
                        resultJson["response"] = "phoneNumber"+IS_INVALID_MSG
                        return resultJson;
                    }
                } else if(xData.emailIdOrPhone == "3"){
                    var verified = []

                    var registerType = "individual"
                    
                    if(xData.registerType.trim().length == 0){
                        verified = ["phone","email"]
                        registerType = "individual"
                    }
                    else if(xData.registerType == "bulk"){
                        verified = []
                        registerType = "bulk"
                    }

                    playerID = Accounts.createUser({
                        email: replaceExtraChar(xData.emailAddress),
                        password: replaceExtraChar(xData.password),
                        userName: replaceExtraChar(xData.userName.trim())
                    });

                    if (playerID && xData.emailAddress) 
                    {
                        profileUpdate = Meteor.users.update({
                            "_id": playerID
                        }, {
                            $set: {
                                userId: playerID,
                                profileSettingStatus: true,
                                userName: replaceExtraChar(xData.userName.trim()),
                                emailAddress: replaceExtraChar(xData.emailAddress),
                                phoneNumber:replaceExtraChar(xData.phoneNumber),
                                registerType:registerType,
                                verifiedBy:verified,
                                userStatus:xData.userStatus
                            }
                        });
                    } else {
                        resultJson["status"] = FAIL_STATUS;
                        resultJson["response"] = INVALID_EMAIL_PHONE_MSG
                        return resultJson;
                    }
                }
            }

            if (playerID && profileUpdate) {
                resultJson["playerID"] = playerID
            }


            return resultJson
        } catch (e) {
            resultJson["status"] = FAIL_STATUS;
            resultJson["response"] = 3
            return resultJson;
        }
    }
});



Meteor.methods({
    registerValidationForUploadPlayers: function(xData,num,inds) {
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var roles = initDBS("roles")
        var indexToSkip = initDBS("indexToSkip")
        var indicesOfPlayers = initDBS("indicesOfPlayers")
        
        var resultJson = {};
        resultJson["status"] = FAIL_STATUS;
        resultJson["response"] = 0
        resultJson["playerID"] = false
        var playerID;
        var profileUpdate;
        var checkInfo
        var checkPhone
        var phone = ""
        var email = ""

        if(inds ==undefined || inds == null){
            inds = ""
        }
        else{
            inds = ", line " + inds
        }

        if(num == 1){
            email = xData
        }
        else if(num == 2){
            phone = xData
        }
        else if(num == 3){
            phone = xData.phoneNumber
            email = xData.emailAddress
        }

        try {
            if(num == 1 || num == 3){
                if (email.length != 0) {
                    checkInfo = Meteor.users.findOne({
                        $or: [{
                            "emailAddress": {
                                $regex: emailRegex(email)
                            },
                            'emails.0.address': {
                                $regex: emailRegex(email)
                            }
                        }],

                    })
                    if (checkInfo) {
                        emaPh = email
                    } else {
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i]) {
                                var ind = i
                                if (ind > parseInt(indexToSkip)) {
                                    ind = parseInt(indexToSkip + 1)
                                }
                                checkInfo = global[dbsrequiredAll[ind]].findOne({
                                    "emailAddress": {
                                        $regex: emailRegex(email)
                                    },
                                })
                                if (checkInfo) {
                                    emaPh = email
                                    break;
                                }
                            }
                        }
                    }
                }

                if(checkInfo){
                    return USER_EXISTS_MSG + emaPh + inds
                }
                if(num != 3){
                    return false
                }
            }
            if(num == 2 || num == 3){
                if (phone.length != 0) {
                    checkPhone = Meteor.users.findOne({
                        "phoneNumber":phone
                    })
                    if (checkPhone) {
                        emaPh = phone
                    } else {
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i]) {
                                var ind = i
                                if (ind > parseInt(indexToSkip)) {
                                    ind = parseInt(indexToSkip + 1)
                                }
                                checkPhone = global[dbsrequiredAll[ind]].findOne({
                                    "phoneNumber":phone
                                })
                                if (checkPhone) {
                                    emaPh = phone
                                    break;
                                }
                            }
                        }
                    }
                }

                if(checkPhone){
                    return USER_EXISTS_MSG + emaPh + inds
                }
                if(num != 3){
                    return false
                }
            }

            if((checkPhone == undefined || checkPhone == null) && (checkInfo == undefined ||
                checkInfo == null)){
                return false
            }
        } catch (e) {
            resultJson["status"] = FAIL_STATUS;
            resultJson["response"] = 3
            return e;
        }
    }
});

Meteor.methods({
    adminUpdateValidationForUploadPlayers: function(xData,num,inds) {
     
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var roles = initDBS("roles")
        var indexToSkip = initDBS("indexToSkip")
        var indicesOfPlayers = initDBS("indicesOfPlayers")
        
        var resultJson = {};
        resultJson["status"] = FAIL_STATUS;
        resultJson["response"] = 0
        resultJson["playerID"] = false
        var playerID;
        var profileUpdate;
        var checkInfo
        var checkPhone
        var phone = ""
        var email = ""

        if(inds ==undefined || inds == null){
            inds = ""
        }
        else{
            inds = ", line " + inds
        }

        if(num == 1){
            email = xData.emailAddress
        }
        else if(num == 2){
            phone = xData.phoneNumber
        }
        else if(num == 3){
            phone = xData.phoneNumber
            email = xData.emailAddress
        }

        try {
            if(num == 1 || num == 3){
                if (email.length != 0) {
                    checkInfo = Meteor.users.findOne({
                        userId:{$ne:xData.userId},
                        $or: [{
                            "emailAddress": {
                                $regex: emailRegex(email)
                            },
                            'emails.0.address': {
                                $regex: emailRegex(email)
                            }
                        }],

                    })
                    if (checkInfo) {
                        emaPh = email
                    } else {
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i]) {
                                var ind = i
                                if (ind > parseInt(indexToSkip)) {
                                    ind = parseInt(indexToSkip + 1)
                                }
                                checkInfo = global[dbsrequiredAll[ind]].findOne({
                                    userId:{$ne:xData.userId},
                                    "emailAddress": {
                                        $regex: emailRegex(email)
                                    },
                                })
                                if (checkInfo) {
                                    emaPh = email
                                    break;
                                }
                            }
                        }
                    }
                }

                if(checkInfo){
                    return USER_EXISTS_MSG + emaPh + inds
                }
                if(num != 3){
                    return false
                }
            }
            if(num == 2 || num == 3){
                if (phone.length != 0) {
                    checkPhone = Meteor.users.findOne({
                        userId:{$ne:xData.userId},
                        "phoneNumber":phone
                    })
                    if (checkPhone) {
                        emaPh = phone
                    } else {
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i]) {
                                var ind = i
                                if (ind > parseInt(indexToSkip)) {
                                    ind = parseInt(indexToSkip + 1)
                                }
                                checkPhone = global[dbsrequiredAll[ind]].findOne({
                                    userId:{$ne:xData.userId},
                                    "phoneNumber":phone
                                })
                                if (checkPhone) {
                                    emaPh = phone
                                    break;
                                }
                            }
                        }
                    }
                }

                if(checkPhone){
                    return USER_EXISTS_MSG + emaPh + inds
                }
                if(num != 3){
                    return false
                }
            }

            if((checkPhone == undefined || checkPhone == null) && (checkInfo == undefined ||
                checkInfo == null)){
                return false
            }
        } catch (e) {
            resultJson["status"] = FAIL_STATUS;
            resultJson["response"] = e
            return e;
        }
    }
});

//to check 
/*
1. giving same email address
2. giving same phone num
3. giving non empty phone and email
4. giving empty phone and email
5. giving empty phone and non empty email
6. giving empty email and non empty phone
7. giving email already used in some other db
8. giving phone already used in some other db


*/

//toods
//iplayon reg
//edit profile validation of phone and email
//verification before login
//upload affiliation id check
//anoop users status change
//resend otp
//player upload with affiliation id
//add players through  da
//add acad throug da
//add da throug sa
//check subscription thr acad / da / asso
//add players thr aca added by da
//add players thr aca added by sa
//delete players from acad from sa with affid, add to dif sa assoc/da  /acad add by da/acad add by sa
//delete players from acad from da with affid, add to dif sa assoc/da  /acad add by da/acad add by sa
//delete players from da with affid, add to dif sa assoc/da  /acad add by da/acad add by sa
//delete players from sa with affid, add to dif sa assoc/da  /acad add by da/acad add by sa

//delete players from acad from sa withou affid, add to dif sa assoc/da  /acad add by da/acad add by sa
//delete players from acad from da withou affid, add to dif sa assoc/da  /acad add by da/acad add by sa
//delete players from da withou affid, add to dif sa assoc/da  /acad add by da/acad add by sa
//delete players from sa withou affid, add to dif sa assoc/da  /acad add by da/acad add by sa
