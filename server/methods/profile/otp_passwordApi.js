import { Accounts }from 'meteor/accounts-base';
import {emailRegex}from '../dbRequiredRole.js'

Meteor.methods({
	"registerOtpCheck": async function(data) {
        try {
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            var response = {};
            response["mailID"] = xData.mailId;

            var findWho = Meteor.users.findOne({
                'emails.0.address': {
                    $regex: new RegExp('^' + xData.mailId + '$', "i")
                }
            })
            if (findWho) {
                response["registerStatus"] = "You are already registered.Please login.";
                response["status"] = "failure";
            } else {
                response["registerStatus"] = "New register";
                var min = 1000;
                var max = 9999;
                var verificationCodeNum = Math.floor(Math.random() * (max - min + 1)) + min;

                var tempData = {
                    verificationCode: verificationCodeNum,
                    emailId: xData.mailId
                };
                try{
                    var result = await Meteor.call("sendEmail", tempData);

                    if (result) {
                        response["status"] = "success";
                        response["message"] = "Verification code sent to " + xData.mailId;
                        response["verificationCode"] = verificationCodeNum;
                    } else {
                        response["status"] = "failure";
                        response["message"] = "Could not send an email!! Please try again";
                    }
                }catch(e)
                {
                    response["status"] = "failure";
                    response["message"] = "Could not send an email!! Please try again";
                }
                
            }
            return response;

        } catch (e) {
        }
    },

    // **emailaddress**
    "registerOtp": async function(mailId) {
        try {
            check(mailId, String);
            var response = {};
            response["mailID"] = mailId;

            var findWho = Meteor.users.findOne({
                'emails.0.address': {
                    $regex: new RegExp('^' + mailId + '$', "i")
                }
            })

            if (findWho) {
                response["registerStatus"] = "You are already registered.Please login.";
            } else {
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
                var expertiseList = expertise.find({}, {
                    sort: {
                        "expertise": 1
                    }
                }).fetch();

                var languageList = languages.find({}, {
                    sort: {
                        "language": 1
                    }
                }).fetch();
                //var certificationList = certification.find({},{sort:{"certification":1}}).fetch();
                var raw = domains.rawCollection();
                var distinct = Meteor.wrapAsync(raw.distinct, raw);
                //var countryList =  distinct('countryName',{$sort:{"countryName":1}});

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

                response["countryList"] = countryList;
                response["sportList"] = sportList;
                response["domainList"] = domainList;
                response["expertiseList"] = expertiseList;

                response["languageList"] = languageList;
                //response["certificationList"] = certificationList;

                var min = 1000;
                var max = 9999;
                var verificationCodeNum = Math.floor(Math.random() * (max - min + 1)) + min;

                var xData = {
                    verificationCode: verificationCodeNum,
                    emailId: mailId
                };
                try{
                    var result = await Meteor.call("sendEmail", xData);
                    if (result) {
                        response["message"] = "Verification code sent to" + mailId;
                        response["verificationCode"] = verificationCodeNum;
                    } else {
                        response["message"] = "Could not send an email!! Please try again";
                    }
                }catch(e)
                {
                    response["message"] = "Could not send an email!! Please try again";

                }
                


            }

            return response;
        } catch (e) {}
    },

    
    "otpForgotPassword": async function (mailId, emailIdOrPhone,loginRole) {
        try {
            var start = new Date().getTime();
            check(mailId, String);
            var response = {};
            response["mailID"] = mailId;
            var findWho;
            var userID = ""
            var verify = ""

            if (emailIdOrPhone == "1") {
                var regExpObj = {
                    $regex: emailRegex(mailId)
                }
                userID = Meteor.users.findOne({
                    $and: [{
                        "emailAddress": {
                            $regex: emailRegex(mailId)
                        },
                        'emails.0.address': {
                            $regex: emailRegex(mailId)
                        },
                    }]
                });
                verify = 'email'
            }
            else if(emailIdOrPhone == "2"){
                userID = Meteor.users.findOne({
                    phoneNumber:mailId,
                });
                verify = 'phone'
            }

            if(userID){
                if(userID && userID.verifiedBy)
                {
                    if(userID.role && userID.role == loginRole){
                        if (_.contains(userID.verifiedBy, verify)) 
                        {
                            if (userID) {
                                var min = 1000;
                                var max = 9999;
                                var verificationCodeNum = Math.floor(Math.random() * (max - min + 1)) + min;

                                var xData = {
                                    verificationCode: verificationCodeNum,
                                    emailId: mailId
                                };

                                if (emailIdOrPhone == "1") 
                                {
                                    try{
                                        var result =  await (Meteor.call("sendEmail", xData));
                                        if (result) 
                                        {
                                            response["verified"] = true
                                            response["status"] = "success";
                                            response["message"] = "Verification code sent to " + mailId;
                                            response["verificationCode"] = verificationCodeNum;
                                        } 
                                        else
                                        {
                                            response["verified"] = true
                                            response["status"] = "success";
                                            response["message"] = "Verification code sent to " + mailId;
                                            response["verificationCode"] = verificationCodeNum; 
                                        }
                                    }   catch(e){
                                        response["verified"] = false
                                        response["status"] = "failure";
                                        response["message"] = "Could not send an email!! Please try again";
                                    }
                                    
                                } else if (emailIdOrPhone == "2") {
                                    try{
                                        var result =  await (Meteor.call("sendSMSOTP", mailId, verificationCodeNum));
  
                                        if (result) 
                                        {
                                            response["status"] = "success"
                                            response["message"] = "Verification code sent to " + mailId;
                                            response["verified"] = true
                                            response["verificationCode"] = verificationCodeNum;
                                        } 
                                        else
                                        {
                                            response["status"] = "failure"
                                            response["verified"] = false
                                            response["message"] = "Could not send  sms!! Please try again";
                                        }
                                    }catch(e)
                                    {
                                        response["status"] = "failure"
                                        response["verified"] = false
                                        response["message"] = "Could not send  sms!! Please try again";
                                    }
                                   
                                }
                            } else {
                                response["status"] = "failure";
                                response["verified"] = false
                                response["message"] = "Email ID or Phone Number not registered"
                            }
                        }
                        else{
                            response["status"] = "failure";
                            response["message"] = mailId + " is not verified";
                            response["verificationCode"] = "";
                            response["verified"] = false
                            response["type"] = verify
                            response["userId"] = userID.userId
                            response["verify"] = true
                        }
                    }
                    else{
                        response["status"] = "failure";
                        response["message"] = "Only " + loginRole + " can recover password !";
                        response["verificationCode"] = "";
                        response["verified"] = false
                    }
                } else{
                    response["status"] = "failure";
                    response["message"] = "User is invalid";
                    response["verificationCode"] = "";
                    response["verified"] = false
                }
            }
            else{
                response["status"] = "failure";
                response["message"] = "User is invalid";
                response["verificationCode"] = "";
                response["verified"] = false
            }
            
            

            return response;
        } catch (e) {
        }
    },

    "changeUserPassword": function(data) {
        try {
            var resultJson = {};
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            if (xData.userId && xData.oldPassword && xData.newPassword) {
                var user = Meteor.users.findOne({
                    "userId": xData.userId
                });
                if (user) {
                    var digestVal = Package.sha.SHA256(xData.oldPassword);
                    var password = {
                        digest: digestVal,
                        algorithm: 'sha-256'
                    };
                    var result = Accounts._checkPassword(user, password);

                    if (result.error) {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Incorrect Password";
                    } else {
                        var resultTemp = Accounts.setPassword(xData.userId, xData.newPassword);
                        resultJson["status"] = "success";
                        resultJson["response"] = "Password Changed";
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid API Parameters";
                }

            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid API Parameters";
            }
            return resultJson;

        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid API Parameters";
        }
    },

})