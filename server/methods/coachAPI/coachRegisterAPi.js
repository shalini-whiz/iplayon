import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
    "registerOtpForCoach": async function(mailId) {
        try {
            check(mailId, String);
            var response = {};
            response["mailID"] = mailId;
            response["verifiedBy"] = "mail";

            var findWho = Meteor.users.findOne({
                'emails.0.address': {
                    $regex: new RegExp('^' + mailId + '$', "i")
                }
            })
            if (findWho) {
                response["emailStatus"] = false
                response["registerStatus"] = "You are already registered.Please login.";
            } else {
                response["emailStatus"] = true
                response["registerStatus"] = "New register";

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

                response["countryList"] = countryList;
                response["sportList"] = sportList;
                response["domainList"] = domainList;
                response["languageList"] = languageList;
                response["expertiseList"] = expertiseList;

                var min = 1000;
                var max = 9999;
                var verificationCodeNum = Math.floor(Math.random() * (max - min + 1)) + min;

                var xData = {
                    verificationCode: verificationCodeNum,
                    emailId: mailId
                };
                var result = await Meteor.call("sendEmail", xData)
                try {
                    if (result) {
                        response["otpStatus"] = true
                        response["message"] = "Verification code sent to" + mailId;
                        response["verificationCode"] = verificationCodeNum;
                    } else {
                        response["otpStatus"] = false
                        response["message"] = "Could not send an email!! Please try again";
                    }
                }catch(e){
                    response["otpStatus"] = false
                    response["message"] = "Could not send an email!! Please try again";
                }
            }
            return response;
        } catch (e) {}
    },


})

Meteor.methods({
    "registerOtpForCoachPhone":async function(phone) {
        try {
            var response = {};
            response["phone"] = phone;
            response["mailID"] = phone;
            response["verifiedBy"] = "phone";


            var findPhone = Meteor.users.findOne({
                phoneNumber: phone,
                verifiedBy: "phone"
            })


            if (findPhone) {
                response["emailStatus"] = false
                response["registerStatus"] = "You are already registered.Please login.";
                response["otpStatus"] = false
                response["message"] = "Could not send an sms!! Please try again";
                
            } else {
                response["emailStatus"] = true
                response["registerStatus"] = "New register";
                

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

                response["countryList"] = countryList;
                response["sportList"] = sportList;
                response["domainList"] = domainList;
                response["languageList"] = languageList;
                response["expertiseList"] = expertiseList;

                var min = 1000;
                var max = 9999;
                var verificationCodeNum = Math.floor(Math.random() * (max - min + 1)) + min;

                var xData = {
                    verificationCode: verificationCodeNum,
                    phone: phone
                };

                var result = await Meteor.call("sendSMSOTP", phone, verificationCodeNum)
                try {
                    if (result) {
                        response["otpStatus"] = true
                        response["message"] = "Verification code sent to" + phone;
                        response["verificationCode"] = verificationCodeNum;
                    } else {
                        response["otpStatus"] = false
                        response["message"] = "Could not send an sms!! Please try again";
                    }
                }catch(e){
                    response["otpStatus"] = false
                    response["message"] = "Could not send an sms!! Please try again";
                }

            }
            return response
        } catch (e) {
        }
    }
})


Meteor.methods({

    "fetchProfileSettingsForCoachAPI": function(data) {
        try {
            var xData = data;
            if (typeof data == "string") {
                data = data.replace("\\", "");
                var xData = JSON.parse(data);
            }

            var resultJson = {};

            var userInfo;
            if (xData.emailAddress) {
                var userFound = Meteor.users.findOne({
                    "userId": xData.userId
                });
                if (userFound) {
                
                    if (userFound.role) {
                        if (userFound.role == "Player")
                            userInfo = nameToCollection(xData.userId).findOne({
                                "userId": xData.userId
                            });

                        else if (userFound.role == "Umpire") {
                            userInfo = otherUsers.findOne({
                                "userId": xData.userId
                            });
                            if (userInfo) {
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
                                var emptyArray = [];
                                if (userInfo.interestedDomainName) {
                                    if (userInfo.interestedDomainName[0] == null)
                                        userInfo.interestedDomainName = emptyArray;
                                }
                                if (userInfo.interestedProjectName) {
                                    if (userInfo.interestedProjectName[0] == null)
                                        userInfo.interestedProjectName = emptyArray;
                                }
                                userInfo["sportList"] = sportList;
                                userInfo["domainList"] = domainList;
                                userInfo["languageList"] = languageList;
                                userInfo["certificationList"] = certificationList;
                            }
                        } else if (userFound.role == "Organiser")
                            userInfo = otherUsers.findOne({
                                "userId": xData.userId
                            });
                        else if (userFound.role == "Coach") {
                            userInfo = otherUsers.findOne({
                                "userId": xData.userId
                            });
                            if (userInfo) {
                                var emptyArray = [];
                                if (userInfo.interestedDomainName) {
                                    if (userInfo.interestedDomainName[0] == null)
                                        userInfo.interestedDomainName = emptyArray;
                                }
                                if (userInfo.interestedProjectName) {
                                    if (userInfo.interestedProjectName[0] == null)
                                        userInfo.interestedProjectName = emptyArray;
                                }
                                if (userInfo.address == null) {
                                    userInfo.address = ""
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
                                ////var raw = domains.rawCollection();
                                //var distinct = Meteor.wrapAsync(raw.distinct, raw);
                                //var countryList =  distinct('countryName');

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
                                userInfo["address"] = userInfo.address

                            }
                        }
                    }
                }
            }
            if (userInfo) {
                if(userFound.verifiedBy){
                    userInfo["verifiedBy"] = userInfo.verifiedBy
                }
                else{
                    userInfo["verifiedBy"] = "none"
                }
                resultJson["status"] = "success";
                resultJson["result"] = userInfo;
                resultJson["response"] = "Profile Fetched"
            } else {
                resultJson["status"] = "failure";
                resultJson["result"] = "";
                resultJson["response"] = "Could not fetch profile"
            }
            return resultJson;
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["result"] = "";
            resultJson["response"] = "Could not fetch profile"
            return resultJson;
        }
    },
})