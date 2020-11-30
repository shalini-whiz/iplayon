import { initDBS } from '../dbRequiredRole.js'

import {
    emailRegex
}
from '../dbRequiredRole.js'

Meteor.methods({
    PRegisterOtpGeneralized: function(calledFrom, caller, apiKey, data) {
        //check 
        //caller, apiKey, data(contains mailid)
        //coach
        // caller,apiKey,data(mailid)
        //otp
        //caller, apiKey, userId, emailId(mailid)
       
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var roles = initDBS("roles")
        var indexToSkip = initDBS("indexToSkip")
        var indicesOfPlayers = initDBS("indicesOfPlayers")
        var listsRequired = [
                "countryList",
                "sportList",
                "domainList",
                "expertiseList",
                "languageList"
            ]
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            var apiUserId = "";
            var apiInfo = apiUsers.findOne({"apiUser":caller,"apiKey":apiKey});
            if(apiInfo)
            {
                apiUserId = apiInfo.userId;
            }

            if (calledFrom == "registerOtpCheck" || calledFrom == "registerOtp") 
            {
                if (data) 
                {
                    
                    return (Meteor.call("registerOtpGeneralized", data.emailId, "1",listsRequired,apiUserId));
                }
            } else if (calledFrom == "registerOtpWithOptions") 
            {
                if (data && data.emailIdOrPhone == "1" || data.emailIdOrPhone == "2") {
                    return (Meteor.call("registerOtpGeneralized", data.emailId, data.emailIdOrPhone,listsRequired,apiUserId));
                }
            } else {
                return;
            }
        } catch (e) {
        }
    }
})


Meteor.methods({
    "registerOtpGeneralized": async function(mailID, emailIdOrPhone,listsRequired,apiUserId) {
        
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var roles = initDBS("roles")
        var indexToSkip = initDBS("indexToSkip")
        var indicesOfPlayers = initDBS("indicesOfPlayers")
        
        var response = {}
        response["mailID"] = "";
        response["registerStatus"] = "";
        response["status"] = FAIL_STATUS;
        response["message"] = "";
        response["verificationCode"] = "";
        
        response["emailStatus"] = false
        response["otpStatus"] = false

        var min = 1000;
        var max = 9999;
        var verificationCodeNum = Math.floor(Math.random() * (max - min + 1)) + min;

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
        var expertiseList = expertise.find({}, {
            sort: {
                "expertise": 1
            }
        }).fetch();


        var raw = domains.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);
        var countryList = distinct('countryName');

        try {
            if (mailID && emailIdOrPhone == "1") 
            {
                response["mailID"] = mailID
                response["verifiedBy"] = "mail";

                var xData = {
                    verificationCode: verificationCodeNum,
                    emailId: mailID
                };

                var findWho = Meteor.users.findOne({
                    $or:[{
                            "emailAddress":{
                                $regex: emailRegex(mailID)
                            },
                            "emails.0.address": {
                                $regex: emailRegex(mailID)
                            }
                        }]
                })
                if (findWho) {
                    response["emailStatus"] = false
                    response["registerStatus"] = ALREADY_REG_MSG;
                    response["regStatus"] = true;
                    response["paymentStatus"] = false;
                    response["role"] = findWho.role;

                    var userAccess = registrationApproval.findOne({
                        "userId":findWho.userId,"associationId":apiUserId,"status" : "active"});
                    if(userAccess && userAccess.validity)
                    {
                                        
                        var currentDate = moment(new Date()).format("YYYY/DD/MMM");
                        var userAccessDate = moment(new Date(userAccess.validity)).format("YYYY/DD/MMM");
                        if (new Date(userAccessDate) >= new Date(currentDate)) 
                            response["paymentStatus"] = true;
                    }

                    var result = await Meteor.call("sendEmail", xData)
                    try {
                        if (result) {
                            response["otpStatus"] = true
                            response["message"] = SEND_OTP_REG_MSG + mailID;
                            response["verificationCode"] = verificationCodeNum;
                        } else {
                            response["otpStatus"] = false
                            response["message"] = SEND_MAIL_FAIL_MSG
                        }
                    }catch(e){
                        response["otpStatus"] = false
                        response["message"] = SEND_MAIL_FAIL_MSG
                    }


                       
                } 
                else 
                {
                    response["emailStatus"] = true
                    if(_.contains(listsRequired,"countryList"))
                        response["countryList"] = countryList;

                    if(_.contains(listsRequired,"sportList"))
                        response["sportList"] = sportList;

                    if(_.contains(listsRequired,"domainList"))
                        response["domainList"] = domainList;

                    if(_.contains(listsRequired,"languageList"))
                        response["languageList"] = languageList;

                    if(_.contains(listsRequired,"expertiseList"))
                        response["expertiseList"] = expertiseList;

                    response["status"] = SUCCESS_STATUS;
                    response["registerStatus"] = "New register";
                    response["regStatus"] = false;
                    response["paymentStatus"] = false;
                    response["role"] = "";



                    var result = await Meteor.call("sendEmail", xData)
                    try {
                        if (result) {
                            response["otpStatus"] = true
                            response["message"] = SEND_OTP_REG_MSG + mailID;
                            response["verificationCode"] = verificationCodeNum;
                        } else {
                            response["otpStatus"] = false
                            response["message"] = SEND_MAIL_FAIL_MSG
                        }
                    }catch(e){
                        response["otpStatus"] = false
                        response["message"] = SEND_MAIL_FAIL_MSG
                    }
                }
            } else if (mailID && emailIdOrPhone == "2") {
                response["mailID"] = mailID
                response["verifiedBy"] = "phone";

                var findPhone = Meteor.users.findOne({
                    phoneNumber: mailID,
                })

                if (findPhone == undefined || findPhone == null) {
                    for (var i = 0; i < roles.length; i++) {
                        if (roles[i]) {
                            var ind = i
                            if (ind > parseInt(indexToSkip)) {
                                ind = parseInt(indexToSkip + 1)
                            }
                            findPhone = global[dbsrequiredAll[ind]].findOne({
                                "phoneNumber": mailID,

                            })
                            if (findPhone) {
                                break;
                            }
                        }
                    }
                }

                if (findPhone) {
                    response["emailStatus"] = false
                    response["registerStatus"] = PHONE_USED_MSG
                    response["regStatus"] = true;
                    response["paymentStatus"] = false;
                    response["role"] = findWho.role;

                    var userAccess = registrationApproval.findOne({
                        "userId":findWho.userId,"associationId":apiUserId,"status" : "active"});
                    if(userAccess && userAccess.validity)
                    {
                                        
                        var currentDate = moment(new Date()).format("YYYY/DD/MMM");
                        var userAccessDate = moment(new Date(userAccess.validity)).format("YYYY/DD/MMM");
                        if (new Date(userAccessDate) >= new Date(currentDate)) 
                            response["paymentStatus"] = true;
                    }

                    var result = await Meteor.call("sendSMSOTP", mailID, verificationCodeNum)
                    try {
                        if (result) {
                            response["otpStatus"] = true
                            response["message"] = SEND_OTP_REG_MSG + mailID;
                            response["verificationCode"] = verificationCodeNum;
                        } else {
                            response["otpStatus"] = false
                            response["message"] = SEND_SMS_FAIL_MSG;
                        }
                    }catch(e){
                        response["otpStatus"] = false
                        response["message"] = SEND_SMS_FAIL_MSG;
                    }

                }

                else{
                    response["emailStatus"] = true

                    if(_.contains(listsRequired,"countryList"))
                        response["countryList"] = countryList;

                    if(_.contains(listsRequired,"sportList"))
                        response["sportList"] = sportList;

                    if(_.contains(listsRequired,"domainList"))
                        response["domainList"] = domainList;

                    if(_.contains(listsRequired,"languageList"))
                        response["languageList"] = languageList;

                    if(_.contains(listsRequired,"expertiseList"))
                        response["expertiseList"] = expertiseList;

                    response["status"] = SUCCESS_STATUS;
                    response["registerStatus"] = "New register";
                    response["regStatus"] = false;
                    response["paymentStatus"] = false;
                    response["role"] = ""

                    var result = await Meteor.call("sendSMSOTP", mailID, verificationCodeNum)
                    try {
                        if (result) {
                            response["otpStatus"] = true
                            response["message"] = SEND_OTP_REG_MSG + mailID;
                            response["verificationCode"] = verificationCodeNum;
                        } else {
                            response["otpStatus"] = false
                            response["message"] = SEND_SMS_FAIL_MSG;
                        }
                    }catch(e){
                        response["otpStatus"] = false
                        response["message"] = SEND_SMS_FAIL_MSG;
                    }
                }
            }

            return response
        } catch (e) {
            response["status"] = FAIL_STATUS;
            response["message"] = e;
            return response
        }

    }
})