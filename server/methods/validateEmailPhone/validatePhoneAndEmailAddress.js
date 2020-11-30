//get id 
//get email or phone to verify
//send sms or email
//check verification
//change status to login

import { initDBS } from '../dbRequiredRole.js'

import {
    emailRegex
}
from '../dbRequiredRole.js'

Meteor.methods({
    sendOtpToVerify: async function(xData) {
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var roles = initDBS("roles")
        var indexToSkip = initDBS("indexToSkip")
        var indicesOfPlayers = initDBS("indicesOfPlayers")

        var response = {};
        response["otpStatus"] = false
        response["verificationCode"] = '';
        response["message"] = SEND_OTP_FAIL_MSG
        response["status"] = FAIL_STATUS

        try {

            var min = 1000;
            var max = 9999;
            var verificationCodeNum = Math.floor(Math.random() * (max - min + 1)) + min;
            response["verificationCode"] = verificationCodeNum;


            if (xData && xData.emailIdOrPhone && xData.userId && xData.mailId) {
                response["mailId"] = xData.mailId
                var findUserId = Meteor.users.findOne({
                    "userId": xData.userId
                })
                if (findUserId) {
                    if (xData.emailIdOrPhone == "1") {
                        if (xData.mailId) {
                            //check for email exists
                            var checkemail = Meteor.users.findOne({
                                $or: [{
                                    "emailAddress": {
                                        $regex: emailRegex(xData.mailId)
                                    },
                                    'emails.0.address': {
                                        $regex: emailRegex(xData.mailId)
                                    }
                                }],
                                "userId": {
                                    $ne: xData.userId
                                }
                            })
                            if (checkemail) {
                                response["status"] = FAIL_STATUS
                                response["message"] = EMAIL_USED_MSG;
                            } else {
                                //send mail

                                var Data = {
                                    verificationCode: verificationCodeNum,
                                    emailId: xData.mailId
                                };
                                var result = await Meteor.call("sendEmail", Data)
                                try{
                                    if (result) {
                                        response["status"] = SUCCESS_STATUS
                                        response["otpStatus"] = true
                                        response["message"] = SEND_OTP_REG_MSG + xData.mailId;
                                        response["verificationCode"] = verificationCodeNum;
                                    } else {
                                        response["status"] = FAIL_STATUS
                                        response["otpStatus"] = false
                                        response["message"] = SEND_MAIL_FAIL_MSG
                                    }
                                }catch(e){
                                    response["status"] = FAIL_STATUS
                                    response["otpStatus"] = false
                                    response["message"] = SEND_MAIL_FAIL_MSG;
                                }
                            }
                        } else {
                            response["status"] = FAIL_STATUS
                            response["message"] = "email" + IS_INVALID_MSG;
                        }
                    } else if (xData.emailIdOrPhone == "2") {
                        if (xData.mailId) {
                            //check for phone
                            var checkphone = Meteor.users.findOne({
                                "phoneNumber": xData.mailId,
                                "userId": {
                                    $ne: xData.userId
                                }
                            })
                            if (checkphone == undefined || checkphone == null) {
                                if (checkphone == undefined) {
                                    for (var i = 0; i < roles.length; i++) {
                                        if (roles[i]) {
                                            var ind = i
                                            if (ind > parseInt(indexToSkip)) {
                                                ind = parseInt(indexToSkip + 1)
                                            }
                                            checkphone = global[dbsrequiredAll[ind]].findOne({
                                                "phoneNumber": xData.mailId,
                                                "userId": {
                                                    $ne: xData.userId
                                                }
                                            })
                                            if (checkphone) {
                                                break;
                                            }
                                        }
                                    }

                                    if (checkphone) {
                                        response["status"] = FAIL_STATUS
                                        response["message"] = PHONE_USED_MSG;
                                    } else {
                                            //send otp
                                        var result = await Meteor.call("sendSMSOTP", xData.mailId, verificationCodeNum)
                                        try {
                                            if (result) {
                                                response["status"] = SUCCESS_STATUS
                                                response["otpStatus"] = true
                                                response["message"] = SEND_OTP_REG_MSG + xData.mailId;
                                                response["verificationCode"] = verificationCodeNum;
                                            } else {
                                                response["otpStatus"] = false
                                                response["message"] = SEND_SMS_FAIL_MSG
                                            }
                                        }catch(e){
                                            response["otpStatus"] = false
                                            response["message"] = SEND_SMS_FAIL_MSG
                                        }
                                    }
                                } else {
                                    response["status"] = FAIL_STATUS
                                    response["message"] = "Invalid user";
                                }
                            } else {
                                response["status"] = FAIL_STATUS
                                response["message"] = PHONE_USED_MSG
                            }
                        } else {
                            response["status"] = FAIL_STATUS
                            response["message"] = "Phone" + IS_INVALID_MSG;
                        }
                    } else {
                        response["status"] = FAIL_STATUS
                        response["message"] = "emailIdOrPhone"  + IS_INVALID_MSG;
                    }
                } else {
                    response["status"] = FAIL_STATUS
                    response["message"] = INVALID_USERID_MSG;
                }
            } else {
                response["status"] = FAIL_STATUS
                response["message"] = REQU_ALL_PARAMS;
            }
            return response
        } catch (e) {
            response["status"] = FAIL_STATUS
            response["message"] = e;
            return response
        }
    }
});

Meteor.methods({
    updateVerifiedMailPhone: async function(xData,giveDbDetails) {
        
        var response = {};
        response["message"] = UPDATE_PHONE_EMAIL_FAIL_MSG
        response["status"] = FAIL_STATUS
        response["data2"] = {}
        response["data"] = {}

        var verifiedBy = []
        try {
            if (xData && xData.userId && xData.emailIdOrPhone && xData.mailId) {
                var checkUser = Meteor.users.findOne({
                    "userId": xData.userId
                })
                if (checkUser) {
                    if (checkUser.verifiedBy) {
                        verifiedBy = checkUser.verifiedBy
                    }

                    if (xData.emailIdOrPhone == "1") {
                        if (_.contains(verifiedBy, "email") == false) {
                            verifiedBy.push("email")
                        }
                        var res = await Meteor.call("savePhoneOrEmail", xData, verifiedBy, checkUser,giveDbDetails)
                        try {
                            if (res) {
                                response = res
                            } else if (e) {
                                response["status"] = FAIL_STATUS
                                response["message"] = UPDATE_PHONE_EMAIL_FAIL_MSG;
                            }
                        }catch(e){
                            response["status"] = FAIL_STATUS
                            response["message"] = UPDATE_PHONE_EMAIL_FAIL_MSG;
                        }
                    } else if (xData.emailIdOrPhone == "2") {
                        if (_.contains(verifiedBy, "phone") == false) {
                            verifiedBy.push("phone")
                        }
                        var res = await Meteor.call("savePhoneOrEmail", xData, verifiedBy, checkUser,giveDbDetails)
                        try{
                            if (res) {
                                response = res
                            } 
                        }catch(e){
                          response["status"] = FAIL_STATUS
                          response["message"] = UPDATE_PHONE_EMAIL_FAIL_MSG;  
                        }
                    } else {
                        response["status"] = FAIL_STATUS
                        response["message"] = "emailIdOrPhone"+IS_INVALID_MSG;
                    }


                } else {
                    response["status"] = FAIL_STATUS
                    response["message"] = INVALID_USERID_MSG;
                }
            } else {
                response["status"] = FAIL_STATUS
                response["message"] = REQU_ALL_PARAMS;
            }
            return response
        } catch (e) {
            response["status"] = FAIL_STATUS
            response["message"] = e;
            return response

        }
    }
})

Meteor.methods({
    savePhoneOrEmail: function(xData, verifiedBy, checkUser,giveDbDetails) {
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var roles = initDBS("roles")
        var indexToSkip = initDBS("indexToSkip")
        var indicesOfPlayers = initDBS("indicesOfPlayers")

        var response = {};
        response["message"] = UPDATE_PHONE_EMAIL_FAIL_MSG
        response["status"] = FAIL_STATUS
        response["data2"] = {}
        response["data"] = {}

        var updateDB;
        var updateDBName = ""
        var queryToUpdate = {}
        var queryToUpdate2 = {}

        var data = {}
        var data2 = {}
        var mes = ""
        try {
            if (xData.emailIdOrPhone == "1") {
                queryToUpdate = {
                    "emails":[{"address": xData.mailId}],
                    "verifiedBy": verifiedBy,
                    "emailAddress": xData.mailId
                }
                queryToUpdate2 = {
                    "emailAddress": xData.mailId
                }
                mes = " email address"
            } else if (xData.emailIdOrPhone == "2") {
                queryToUpdate = {
                    "phoneNumber": xData.mailId,
                    "verifiedBy": verifiedBy
                }
                queryToUpdate2 = {
                    "phoneNumber": xData.mailId
                }
                 mes = " phone number"
            }

            if (xData.emailIdOrPhone == "1" || xData.emailIdOrPhone == "2") {
                var userDet = Meteor.users.update({
                    "userId": xData.userId
                }, {
                    $set: queryToUpdate
                })

                data = Meteor.users.findOne({
                    "userId": xData.userId
                })

                if (checkUser && checkUser.role && _.contains(roles, checkUser.role.toLowerCase())) {
                    if(checkUser.role.toLowerCase() == "player"){
                        for(var j = 0;j<indicesOfPlayers.length;j++){
                            updateDB = global[dbsrequiredAll[j]].update({
                                "userId": xData.userId
                            }, {
                                $set: queryToUpdate2
                            })
                            data2 = global[dbsrequiredAll[j]].findOne({
                                "userId": xData.userId
                            })
                            if(updateDB){
                                updateDBName = dbsrequiredAll[j]
                                break;
                            }
                        }
                    }
                    else{
                        var ind = _.indexOf(roles, checkUser.role.toLowerCase())
                        if (ind > parseInt(indexToSkip)) {
                            ind = parseInt(indexToSkip + 1)
                        }
                        updateDB = global[dbsrequiredAll[ind]].update({
                            "userId": xData.userId
                        }, {
                            $set: queryToUpdate2
                        })
                        data2 = global[dbsrequiredAll[ind]].findOne({
                            "userId": xData.userId
                        })
                        updateDBName = dbsrequiredAll[ind]
                    }
                }
            }
            if(updateDB && data && data2 && giveDbDetails && updateDBName){
                response["status"] = SUCCESS_STATUS
                response["message"] = UPDATED_PHONE_EMAIL_SUCCESS_MSG  +mes;
                var dataToRet = []
                var data1P = {
                    "collectionName":"MeteorUsers",
                    "data":data
                }
                var data2P = {
                    "collectionName":updateDBName,
                    "data":data2
                }
                dataToRet.push(data1P)
                dataToRet.push(data2P)
                response["data"] = dataToRet
            }
            else if (updateDB && data && data2) {
                response["status"] = SUCCESS_STATUS
                response["message"] = UPDATED_PHONE_EMAIL_SUCCESS_MSG + mes;
                var userInfo = data2
                var emptyArray = [];
                if (userInfo.interestedDomainName) {
                    if (userInfo.interestedDomainName[0] == null)
                        userInfo.interestedDomainName = emptyArray;
                }
                if (userInfo.interestedProjectName) {
                    if (userInfo.interestedProjectName[0] == null)
                        userInfo.interestedProjectName = emptyArray;
                }
                var domainList = domains.find({}, {
                    sort: {
                        "domainName": 1
                    }
                }).fetch();
                var sportList = tournamentEvents.find({}, {
                    fields: {
                        "_id": 1,
                        "projectMainName": 1
                    }
                }).fetch();
                var languageList = languages.find({}, {
                    sort: {
                        "language": 1
                    }
                }).fetch();
                var certificationList = certification.find({}, {
                    sort: {
                        "certification": 1
                    }
                }).fetch();
                var expertiseList = expertise.find({}, {
                    sort: {
                        "expertise": 1
                    }
                }).fetch();
                var countryList = _.uniq(domains.find({}, {
                    sort: {
                        countryName: 1
                    },
                    fields: {
                        countryName: true
                    }
                }).fetch().map(function(x) {
                    return x.countryName;
                }), true)

                userInfo["countryList"] = countryList;
                userInfo["sportList"] = sportList;
                userInfo["domainList"] = domainList;
                userInfo["languageList"] = languageList;
                userInfo["certificationList"] = certificationList;
                userInfo["expertiseList"] = expertiseList;

                if (userInfo.address == null) {
                    userInfo.address = ""
                }
                userInfo["address"] = userInfo.address
                if (data.verifiedBy) {
                    userInfo["verifiedBy"] = data.verifiedBy
                } else {
                    userInfo["verifiedBy"] = "none"
                }
                response["result"] = userInfo
                response["data"] = data
            }
            return response
        } catch (e) {
            response["status"] = FAIL_STATUS
            response["message"] = e;
            return response
        }
    }
})