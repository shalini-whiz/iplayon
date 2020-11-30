import {sender} from '../../startup/startup.js';
import {gcm} from '../../startup/startup.js';



Meteor.methods({
    "saveAccountDetails":function(xData)
    {
        if (Meteor.isServer) 
        {
            try{
        
                if(xData.accountType && xData.accountNo && xData.accountIfsc && xData.taxLiable)
                {
                    var userId = "";
                    if(xData.userId == undefined)
                        userId = this.userId;
                    else
                        userId = xData.userId;

                    //var userId = this.userId;
                    var userInfo = Meteor.users.findOne({"userId":userId});
                    if(userInfo && userInfo.role == "Coach")
                    {
                        var accountInfo = accountDetails.findOne({"userId":userId});
                        if(accountInfo)
                        {
                            var result = accountDetails.update(
                                {"_id":accountInfo._id},
                                {$set:{
                                    "accNo":xData.accountNo,
                                    "accType":xData.accountType,
                                    "accIfsc":xData.accountIfsc,
                                    "taxLiable":xData.taxLiable,
                                    "bankName":xData.bankName,
                                    "gstNo":xData.gstNo,
                                    //"nationalIdentityNo":xData.nationalIdentityNo,
                                    //"panNo":xData.panNo
                                }});
                            if(result)
                            {
                                if(xData.nationalIdentityType && xData.nationalIdentityNo)
                                {
                                    var result1 = accountDetails.update(
                                        {"_id":accountInfo._id},
                                        {$set:{
                                            "nationalIdentityType":xData.nationalIdentityType,
                                            "nationalIdentityNo":xData.nationalIdentityNo,
                                            
                                        }});
                                }
                                else if(xData.nationalIdentities)
                                {
                                   var result1 = accountDetails.update(
                                        {"_id":accountInfo._id},
                                        {$set:{
                                            "nationalIdentities":xData.nationalIdentities,                                            
                                        }}); 
                                }

                                var resultJson = {};
                                resultJson["status"] = "success";
                                resultJson["data"] = result;
                                resultJson["response"] = "Account Details Updated";
                                return resultJson;
                            }
                            else
                            {
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["data"] = result;
                                resultJson["response"] = "Could not update Account Details";
                                return resultJson;
                            }
                        }
                        else
                        {
                            var result = accountDetails.insert({
                                "userId":userId,
                                "accNo":xData.accountNo,
                                "accType":xData.accountType,
                                "accIfsc":xData.accountIfsc,
                                "taxLiable":xData.taxLiable,
                                "bankName":xData.bankName,
                                "gstNo":xData.gstNo,
                                //"nationalIdentityNo":xData.nationalIdentityNo,
                                //"panNo":xData.panNo
                            })
                            if(result)
                            {
                                
                                if(xData.nationalIdentityType && xData.nationalIdentityNo)
                                {
                                    var result1 = accountDetails.update(
                                        {"_id":result},
                                        {$set:{
                                            "nationalIdentityType":xData.nationalIdentityType,
                                            "nationalIdentityNo":xData.nationalIdentityNo,
                                            
                                        }});
                                }
                                else if(xData.nationalIdentities)
                                {
                                   var result1 = accountDetails.update(
                                        {"_id":result},
                                        {$set:{
                                            "nationalIdentities":xData.nationalIdentities,                                            
                                        }}); 
                                }
                                var resultJson = {};
                                resultJson["status"] = "success";
                                resultJson["data"] = result;
                                resultJson["response"] = "Account Details Recorded";
                                return resultJson;
                            }
                            else
                            {
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["data"] = result;
                                resultJson["response"] = "Could not record Account Details";
                                return resultJson;
                            }
                        }
                    }
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid user";
                        return resultJson;
                    }
                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid data";
                    return resultJson; 
                }
            }catch(e)
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = e;
                return resultJson;
            }
        }
   
    },
    "getAccountDetails":function(playerId)
    {
        if (Meteor.isServer) 
        {
            try{
                
                var userId = "";
                if(playerId == undefined || playerId == null)
                    userId = this.userId;
                else
                    userId = playerId;
                //var userId = this.userId;
                var userInfo = Meteor.users.findOne({"userId":userId});
                if(userInfo && userInfo.role == "Coach")
                {
                    var accountInfo = accountDetails.findOne({"userId":userId});
                    if(accountInfo)
                    {
                        var resultJson = {};
                        resultJson["status"] = "success";

                        var accountTypeExists = customDataDB.findOne(
                                {"type":"accountType"});
                        if(accountTypeExists && accountTypeExists.customData)
                            accountInfo["accountType"] = accountTypeExists.customData;
                        else
                            accountInfo["accountType"] = [];
                        
                        var otherUserInfo = otherUsers.findOne({"userId":userId})

                        if(otherUserInfo.country)
                        {
                            
                               accountInfo["country"] = otherUserInfo.country;
                            var accountTypeDetails = customDataDB.findOne(
                                {"type":"nationalIdentity",
                                "customKeyData.country":otherUserInfo.country},
                                {
                                fields: {
                                    "_id": 1,
                                    "customKeyData": 1
                                }
                            });

                            
                            if(accountTypeDetails && accountTypeDetails.customKeyData)
                            {
                                var consolidatedList = _.findWhere(accountTypeDetails.customKeyData, {"country": otherUserInfo.country});
                                accountInfo["customIdentityData"] = consolidatedList.valueSet;
                            }
                            else
                                accountInfo["customIdentityData"] = [];


                        }
                        resultJson["data"] = accountInfo;

                        
                        return resultJson;  
                    }
                    else
                    {
                        var resultJson = {};
                        resultJson["status"] = "success";
                        var accountInfo = {};
                        var accountTypeExists = customDataDB.findOne(
                                {"type":"accountType"});
                        if(accountTypeExists && accountTypeExists.customData)
                            accountInfo["accountType"] = accountTypeExists.customData;
                        else
                            accountInfo["accountType"] = [];
                        
                        var otherUserInfo = otherUsers.findOne({"userId":userId})

                        if(otherUserInfo.country)
                        {           
                            accountInfo["country"] = otherUserInfo.country;
                            var accountTypeDetails = customDataDB.findOne(
                                {"type":"nationalIdentity",
                                "customKeyData.country":otherUserInfo.country},
                                {
                                fields: {
                                    "_id": 1,
                                    "customKeyData": 1
                                }
                            });

                            
                            if(accountTypeDetails && accountTypeDetails.customKeyData)
                            {
                                var consolidatedList = _.findWhere(accountTypeDetails.customKeyData, {"country": otherUserInfo.country});
                                accountInfo["customIdentityData"] = consolidatedList.valueSet;
                            }
                            else
                                accountInfo["customIdentityData"] = [];


                        }
                        resultJson["data"] = accountInfo;

                        return resultJson;
                    }
                     
                }
                else
                {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["data"] = "Invalid data";
                    return resultJson;  
                }
                
            }catch(e)
            {
                return e;
            }
        }
    },
    setTax:function(data,cgstVal,sgstVal)
    {
        try{
            var entry = taxDetails.findOne({});
            if(entry == undefined)
            {
                var result = taxDetails.insert({
                    "taxRate":data,
                    "cgst":cgstVal,
                    "sgst":sgstVal})
                return result;
            }
            else
            {
                var result = taxDetails.update(
                    {},
                    {$set:{
                        "taxRate":data,
                        "cgst":cgstVal,
                        "sgst":sgstVal
                        }})
                return result;
            }
        }catch(e)
        {
            return e;
        }

    },
    setCommission:function(data)
    {
        try{

            var entry = lastInsertedAffId.findOne({"assocId" : "Commission"});
            if(entry == undefined)
            {
                var result = lastInsertedAffId.insert({
                    "assocId":"Commission",
                    "lastInsertedId":data
                   })
                return result;
            }
            else
            {
                var result = lastInsertedAffId.update(
                    {"assocId":"Commission"},
                    {$set:{
                        "lastInsertedId":data
                        }})
                return result;
            }
        }catch(e)
        {
            return e
        }
    }
})