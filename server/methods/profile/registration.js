import { Accounts }from 'meteor/accounts-base';
import {emailRegex}from '../dbRequiredRole.js'
import {
    playerDBFind    
}
from '../dbRequiredRole.js'

import {nameToCollection} from '../dbRequiredRole.js'

//userDetailsTTUsed

Meteor.methods({
	playerRegisterationViaApp:async function(xData) {
        try {
            var resultJson;
            var toret = "userDetailsTT"
            if(xData && xData.uploadTo && xData.uploadTo != undefined && xData.uploadTo != null && xData.uploadTo.trim().length != 0){
                var respFromVAlid = true
                var gotoreg = 1
                if(xData.emailAddress && xData.emailAddress.trim().length){
                    var resValid = await Meteor.call("registerValidationForUploadPlayers", xData.emailAddress, 1)
                    try {
                        if (resValid == false) {
                            gotoreg = 0
                            respFromVAlid = resValid
                        }
                        else if (resValid != undefined && resValid != null && resValid != false) {
                            gotoreg = 1
                            respFromVAlid = resValid
                        } 
                    }catch(e) {
                        gotoreg = 1
                        respFromVAlid = e
                    }
                }
                if(xData.phoneNumber && xData.phoneNumber.trim().length){
                    var resValid = await Meteor.call("registerValidationForUploadPlayers", xData.phoneNumber, 2)
                    try {
                        if (resValid == false) {
                            gotoreg = 0
                            respFromVAlid = resValid
                        }
                        else if (resValid != undefined && resValid != null && resValid != false) {
                            gotoreg = 1
                            respFromVAlid = resValid
                        } 
                    }catch (e) {
                        gotoreg = 1
                        respFromVAlid = e
                    }
                }
                else{
                   gotoreg = 1
                   respFromVAlid = "Email address or phone number is required"
                }
                if(gotoreg == 1 ){
                    resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = respFromVAlid
                }
                else if(gotoreg == 0 ){
                    //call upload
                    if(xData.associationId && xData.associationId.trim().length){
                        if(xData.uploadTo.toLowerCase() == "academy" && 
                            xData.clubNameId && xData.clubNameId.trim().length 
                            && xData.userStatus && xData.userStatus.trim().length 
                            && (xData.userStatus.trim() == "Active" 
                                || xData.userStatus.trim() == "notApproved")){
                            
                            var checkclubunderassoc = associationDetails.findOne({
                                userId:xData.associationId
                            })
                            if(checkclubunderassoc){
                                var checkacad = academyDetails.findOne({
                                    userId:xData.clubNameId,
                                    $or:[
                                        {
                                            associationId:xData.associationId
                                        },
                                        {
                                            parentAssociationId:xData.associationId
                                        }
                                    ]
                                })

                                if(checkacad){
                                    var resreg = await Meteor.call('csvUploadStateAndAcademy',xData, xData.associationId, xData.uploadTo)
                                    try{
                                        if(resreg && resreg == "0"){
                                            resultJson = {};
                                            resultJson["status"] = "failure";
                                            resultJson["response"] = "User Already Exists"
                                        }
                                        else if (resreg && resreg != "0") {
                                            resultJson = {};
                                            resultJson["status"] = "success";
                                            resultJson["response"] = "Registeration success"
                                        }
                                    }catch(e){
                                        resultJson = {};
                                        resultJson["status"] = "failure";
                                        resultJson["response"] = e
                                    }
                                }
                                else{
                                    resultJson = {};
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "clubNameId not found";
                                }
                            }
                            else{
                                resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = "associationId not found";
                            }
                        }
                        else{
                            resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "clubNameId or userStatus or uploadTo is not valid";
                        }
                    }
                    else{
                        resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "associationId is not valid";
                    }
                }
            }
            else{
                var resValid = await Meteor.call("registerValidationGeneralized", xData);
                try {
                    if(resValid && resValid.response == 0 && resValid.playerID){
                        if (xData.role == undefined || xData.role == "Player") {
                            var playerID = resValid.playerID;
                            var userFound;

                            if (xData.emailIdOrPhone && xData.emailIdOrPhone == "1") {
                                xData.emailIdOrPhone = xData.emailIdOrPhone
                            } else if (xData.emailIdOrPhone && xData.emailIdOrPhone == "2") {
                                xData.emailIdOrPhone = xData.emailIdOrPhone
                            } else {
                                xData.emailIdOrPhone = "1"
                            }
                            //interestedDomainName
                            var raw = tournamentEvents.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var interestedProjectNameList = distinct('_id');

                            var raw = domains.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var interestedDomainNameList = distinct('_id');


                            if (playerID) {
                                try {
                                    var tmpAffilationID = "TMP1";
                                    var interestedProjectName = [""]

                                    var tempAffIDInfo = lastInsertedAffId.findOne({
                                        "assocId": "Temp"
                                    });
                                    if (tempAffIDInfo) {
                                        tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                                        tmpAffilationID = "TMP" + tempAffIDInfo.lastInsertedId;
                                    }
                                    if(xData.phoneNumber == null || xData.phoneNumber == undefined || xData.phoneNumber.trim().length == 0){
                                        xData.phoneNumber = ""
                                    }

                                    if(xData.interestedProjectName && xData.interestedProjectName.trim().length != 0){
                                        interestedProjectName = [xData.interestedProjectName]
                                        var dbtoret = playerDBFind(xData.interestedProjectName)
                                        if(dbtoret != false){
                                            toret = dbtoret
                                        }
                                    }

                                    var userDetailsTT_player = global[toret].insert({
                                        userId: playerID,
                                        emailAddress: xData.emailAddress,
                                        //interestedDomainName:interestedDomainNameList,
                                        //interestedProjectName: interestedProjectNameList, 
                                        interestedDomainName: [""],
                                        interestedProjectName: interestedProjectName,
                                        interestedSubDomain1Name: [""],
                                        interestedSubDomain2Name: [""],
                                        profileSettingStatus: true,
                                        userName: xData.userName.trim(),
                                        phoneNumber: xData.phoneNumber,
                                        gender: xData.gender,
                                        dateOfBirth: moment(new Date(xData.dob)).format("DD MMM YYYY"),
                                        role: "Player",
                                        city: "",
                                        pinCode: "",
                                        state: "",
                                        country: "India",
                                        statusOfUser: "Active",
                                        year: new Date().getFullYear(),
                                        affiliatedTo: "other",
                                        tempAffiliationId: tmpAffilationID
                                    });

                                    if (userDetailsTT_player) {
                                        var profileUpdate = Meteor.users.update({
                                            "_id": playerID
                                        }, {
                                            $set: {
                                                role:"Player",
                                                interestedProjectName: interestedProjectName,
                                            }
                                        });

                                        var tmpAffilationID = "TMP1";
                                        var tempAffIDInfo = lastInsertedAffId.findOne({
                                            "assocId": "Temp"
                                        });
                                        if (tempAffIDInfo) {
                                            tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                                            lastInsertedAffId.update({
                                                "assocId": "Temp"
                                            }, {
                                                $set: {
                                                    lastInsertedId: tempAffIDInfo.lastInsertedId
                                                }
                                            });
                                        } else
                                            lastInsertedAffId.insert({
                                                "assocId": "Temp",
                                                lastInsertedId: "1"
                                            });
                                    } else {
                                        var removePlayer = Meteor.users.remove({
                                            "_id": playerID
                                        })
                                    }

                                } catch (e) {
                                    var removePlayer = Meteor.users.remove({
                                        "_id": playerID
                                    })

                                    global[toret].remove({
                                        userId:playerID
                                    })
                                }


                                 resultJson = userDetailsTT_player;
                            }

                        } else if (xData.role == "Organiser" || xData.role == "Coach") {
                            xData.country = "India";

                            xData.regId = resValid.playerID


                            if(xData.gender == null || xData.gender == undefined || xData.gender.length == 0)
                                xData.gender = ""
                            //if(xData.role == "Organiser" && (xData.interestedProjectName == null || xData.interestedProjectName == undefined || xData.interestedProjectName.length == 0))
                              //  xData.interestedProjectName = [""];
                            if(xData.interestedDomainName == null || xData.interestedDomainName == undefined || xData.interestedDomainName.length == 0)
                                xData.interestedDomainName = [""]
                            if(xData.phoneNumber == null || xData.phoneNumber == undefined || xData.phoneNumber.length == 0)
                                xData.phoneNumber = ""
                            if(xData.city == null || xData.city == undefined || xData.city.length == 0)
                                xData.city = "";
                            if(xData.state == null || xData.state == undefined || xData.state.length == 0)
                                xData.state = "";
                            if(xData.pinCode == null || xData.pinCode == undefined || xData.pinCode.length == 0)
                                 xData.pinCode = "";

                            var result = await Meteor.call("registerOtherUsers", xData);
                            if (result) {
                                //var result3 = Meteor.call("updateOtherUserActivities",xData);

                            }
                            resultJson =  result;
                        }
                    }
                    else if(resValid && resValid.response == 1){
                        resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "This email address exists, try with different email"
                        
                    }
                    else if(resValid && resValid.response == 2){
                        resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "This phone number exists, try with different phone number"
                    }
                    else if(resValid && resValid.response == 3){
                        resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid data"
                    }
                    else{
                        resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid data"
                    }
                }catch(e){
                    resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid data"
                }
            }
            return resultJson
        } catch (e) {
            return false;
        }
    },

    "addPlayerUnderAssoc":async function(xData){
        console.log("check approval code")
        console.log(JSON.stringify(xData))
        try 
        {   var resultJson = {};
            if (xData.role == undefined || xData.role == "Player" ||  xData.role.toLowerCase() == "player") 
            {
                var playerID = xData.playerID;
                var raw = tournamentEvents.rawCollection();
                var distinct = Meteor.wrapAsync(raw.distinct, raw);
                var interestedProjectNameList = distinct('_id');

                var raw = domains.rawCollection();
                var distinct = Meteor.wrapAsync(raw.distinct, raw);
                var interestedDomainNameList = distinct('_id');
                var associationInfo = associationDetails.findOne({
                                "userId": xData.associationId});

                if (playerID && associationInfo) 
                {
                    var tmpAffilationID = "TMP1";
                    var tempAffIDInfo = lastInsertedAffId.findOne({"assocId": "Temp"});
                    if (tempAffIDInfo) {
                        tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                        tmpAffilationID = "TMP" + tempAffIDInfo.lastInsertedId;
                    }
                    var playerAff = "other";
                    var playerAcademyId = "";
                    var playerAssocId = "";
                    var playerParentAssocId = "";
                    var playerIntDomain = [""];
                    var playerIntSport = [""];
                    var assocState = "";              
                                   
                    if(xData.clubNameId != null && xData.clubNameId != undefined && xData.clubNameId != "none")
                    {
                        var academyInfo = academyDetails.findOne({"userId":xData.clubNameId});
                        if(academyInfo)
                        {                                           
                            playerAcademyId = academyInfo.userId;
                            playerAff = "academy";

                            if (associationInfo.associationType == "State/Province/County")                       
                                playerAssocId = xData.associationId
                   
                            else if(associationInfo.associationType = "District/City")
                            {
                                playerAssocId = xData.associationId
                                playerParentAssocId = associationInfo.parentAssociationId;
                            }                             
                        }
                        else
                        {
                            if (associationInfo.associationType == "State/Province/County")
                            {
                                playerAff = "stateAssociation";
                                playerAssocId = xData.associationId
                            }
                            else if(associationInfo.associationType = "District/City")
                            {
                                playerAssocId = xData.associationId
                                playerAff = "districtAssociation"
                                playerParentAssocId = associationInfo.parentAssociationId;
                            }                                         
                        }
                                           
                    }                       
                    else if (associationInfo.associationType == "State/Province/County")
                    {
                        playerAff = "stateAssociation";
                        playerAssocId = xData.associationId
                    }
                    else if(associationInfo.associationType = "District/City")
                    {
                        playerAssocId = xData.associationId
                        playerAff = "districtAssociation"
                        playerParentAssocId = associationInfo.parentAssociationId;
                    }
                                      
                    if (associationInfo.interestedProjectName)
                        playerIntSport = associationInfo.interestedProjectName;

                    if (associationInfo.interestedDomainName)
                        playerIntDomain = associationInfo.interestedDomainName;

                    if(playerIntDomain  && playerIntDomain.length > 0)
                        assocState = playerIntDomain[0];

                                          
                    var toret = "userDetailsTT"
                    if(playerIntSport && playerIntSport.length != 0){
                        var dbtoret = playerDBFind(playerIntSport)
                        if(dbtoret != false){
                            toret = dbtoret
                        }
                    }

                    var userPhone = "";
                    if(xData.phoneNumber)
                        userPhone = xData.phoneNumber;


                    var playerData = {};
                    playerData["userId"] =  playerID
                    playerData["emailAddress"] = xData.emailAddress
                    playerData["interestedDomainName"] =  playerIntDomain
                    playerData["interestedProjectName"] =  playerIntSport
                    playerData["interestedSubDomain1Name"] =  [""]
                    playerData["interestedSubDomain2Name"] = [""]
                    playerData["profileSettingStatus"] = true
                    playerData["userName"] = xData.userName.trim()
                    playerData["phoneNumber"] = userPhone
                    playerData["gender"] =  xData.gender
                    playerData["dateOfBirth"] = moment(new Date(xData.dob)).format("DD MMM YYYY")
                    playerData["role"] = "Player"
                    playerData["city"] =  ""
                    playerData["pinCode"] =  ""
                    playerData["state"] =  assocState
                    playerData["country"] =  "India"
                    playerData["statusOfUser"] =  "Active"
                    playerData["year"]  = new Date().getFullYear()
                    playerData["affiliatedTo"]  = playerAff
                    playerData["tempAffiliationId"] =  tmpAffilationID
                    playerData["associationId"] =  playerAssocId

                            
                    if(playerAcademyId != null && playerAcademyId != "" && playerAcademyId.length > 0)
                        playerData["clubNameId"] = playerAcademyId;

                    if(playerParentAssocId != null && playerParentAssocId != "" && playerParentAssocId.length > 0)
                        playerData["parentAssociationId"] = playerParentAssocId;

                    var userExists = global[toret].findOne({
                        "emailAddress": {$regex: emailRegex(xData.emailAddress)}
                    })
                    var userRecStatus;
                    if(userExists)
                    {
                        var updateJson = {};
                        updateJson["interestedDomainName"] =  playerIntDomain
                        updateJson["interestedProjectName"] =  playerIntSport
                        updateJson["interestedSubDomain1Name"] =  [""]
                        updateJson["interestedSubDomain2Name"] = [""]
                        updateJson["userName"] = xData.userName.trim()
                        updateJson["phoneNumber"] = userPhone
                        updateJson["gender"] =  xData.gender
                        updateJson["dateOfBirth"] = moment(new Date(xData.dob)).format("DD MMM YYYY")
                        updateJson["state"] =  assocState
                        updateJson["year"]  = new Date().getFullYear()
                        updateJson["affiliatedTo"]  = playerAff
                        updateJson["tempAffiliationId"] =  tmpAffilationID
                        updateJson["associationId"] =  playerAssocId
                        updateJson["clubNameId"] =  ""
                        updateJson["parentAssociationId"] =  ""

                        if(userExists.associationId != xData.associationId)
                            updateJson["affiliationId"] = ""

                        if(playerAcademyId != null && playerAcademyId != "" && playerAcademyId.length > 0)
                            updateJson["clubNameId"] = playerAcademyId;

                        if(playerParentAssocId != null && playerParentAssocId != "" && playerParentAssocId.length > 0)
                            updateJson["parentAssociationId"] = playerParentAssocId;


                        userRecStatus =global[toret].update({"userId":playerID},
                            {$set:updateJson})
                            
                        var pwdResult = Accounts.setPassword(playerID, xData.password);

                        var profileUpdate = Meteor.users.update({
                            "_id": playerID}, 
                            {$set: {
                                role:"Player",
                                interestedProjectName:playerIntSport,
                                "userName":xData.userName.trim()
                            }
                        });

                       /* if(userExists.affiliationId == undefined || userExists.affiliationId == null || userExists.affiliationId == "")
                        {

                        }
                        else
                        {
                            if(userExists.affiliationId.length > 0 && userExists.affiliationId.substring(0, 3) != xData.approvalCode)
                            {

                            }
                        }*/

                    }
                    else
                    {
                        userRecStatus = global[toret].insert(playerData);
                        if(userRecStatus)
                        {
                            var profileUpdate = Meteor.users.update({
                               "_id": playerID
                            }, {$set: {
                                role:"Player",
                                interestedProjectName:playerIntSport,
                            }});

                        }
                           
                    }


                    if (userRecStatus) 
                    {
                        var tmpAffilationID = "TMP1";
                        var tempAffIDInfo = lastInsertedAffId.findOne({"assocId": "Temp"});
                        if (tempAffIDInfo) 
                        {
                            tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                            lastInsertedAffId.update({"assocId": "Temp"},{
                                $set: {lastInsertedId: tempAffIDInfo.lastInsertedId}
                            });
                        } 
                        else
                            lastInsertedAffId.insert({"assocId": "Temp",lastInsertedId: "1"});      
                            
                        resultJson =  playerID;
                        if(xData.approvalCode != undefined && xData.transactionID != undefined && 
                            xData.transactionAmount != undefined && xData.transactionID.length > 0 && xData.approvalCode.length > 0 && xData.transactionAmount.length > 0)
                        {
                            var regTrans = registrationTransaction.insert({
                                "userId":playerID,
                                "associationId":xData.associationId,
                                "transactionId": xData.transactionID,
                                "transactionFee":xData.transactionAmount
                            })
                            if(regTrans)
                            {
                                var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                var affiliationID =  await Meteor.call("generateAffId",xData.approvalCode,userDetails);
                                var userDetailsInfo = nameToCollection(playerID).findOne({"userId": playerID});
                                var currentDate = new Date();
                                var regStatus = undefined;

                                var validityInfo = registrationValidity.findOne({
                                    "userId":xData.associationId,"year":currentDate.getFullYear(),"status" : "active"});
                                if(validityInfo && affiliationID)                                  
                                    regStatus = registrationApproval.insert({"userId":playerID,
                                        "associationId":xData.associationId,"validity":validityInfo.validity})
                                                               
                                var userDetailsData = nameToCollection(playerID).findOne({"userId": playerID});
                                if(validityInfo && affiliationID && regStatus)
                                {
                                    resultJson =  userDetailsData;                                
                                }

                                else
                                {
                                    resultJson =  userDetailsData;                                
                                    if(affiliationID == false)
                                    {
                                        resultJson["errorMsg"] = "Could not set affiliationID"
                                    }
                                }
                            }
                        }


                                    
                    }             
                }
            }
            console.log("rets is")
            console.log(JSON.stringify(resultJson))
            return resultJson
   
        }catch(e){
            resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data "+e
            return resultJson
        }

        
    },
    playerRegisterUnderAssoc: async function(xData) {
        try {
            var resultJson;
            var resValid = await Meteor.call("registerValidationGeneralized", xData);

            try {
                console.log("regi sis ")
                console.log(JSON.stringify(xData))
                if(resValid && resValid.response == 0 && resValid.playerID)
                {
                    if (xData.role == undefined || xData.role == "Player" || xData.role.toLowerCase() == "player") 
                    {
                        var playerID = resValid.playerID;
                        //interestedDomainName
                        var raw = tournamentEvents.rawCollection();
                        var distinct = Meteor.wrapAsync(raw.distinct, raw);
                        var interestedProjectNameList = distinct('_id');

                        var raw = domains.rawCollection();
                        var distinct = Meteor.wrapAsync(raw.distinct, raw);
                        var interestedDomainNameList = distinct('_id');
                        
                        if (playerID) 
                        {
                            try {
                                var tmpAffilationID = "TMP1";
                                var tempAffIDInfo = lastInsertedAffId.findOne({
                                    "assocId": "Temp"
                                });
                                if (tempAffIDInfo) {
                                    tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                                    tmpAffilationID = "TMP" + tempAffIDInfo.lastInsertedId;
                                }
                                var associationInfo;
                                var playerAff = "other";
                                var playerAcademyId = "";
                                var playerAssocId = "";
                                var playerParentAssocId = "";
                                var playerIntDomain = [""];
                                var playerIntSport = [""];
                                var assocState = "";
                                if (xData.associationId) {
                                    associationInfo = associationDetails.findOne({
                                        "userId": xData.associationId
                                    });
                                    if (associationInfo) 
                                    {

                                        if(xData.clubNameId != null && xData.clubNameId != undefined && xData.clubNameId != "none")
                                        {
                                            var academyInfo = academyDetails.findOne({"userId":xData.clubNameId});
                                            if(academyInfo)
                                            {                                           
                                                playerAcademyId = academyInfo.userId;
                                                playerAff = "academy";

                                                if (associationInfo.associationType == "State/Province/County")
                                                {
                                                    //playerAff = "stateAssociation";
                                                    playerAssocId = xData.associationId

                                                }
                                                else if(associationInfo.associationType = "District/City")
                                                {
                                                    playerAssocId = xData.associationId
                                                    //playerAff = "districtAssociation"
                                                    playerParentAssocId = associationInfo.parentAssociationId;

                                                }
                                                else 
                                                    return false;

                                            }
                                            else
                                            {
                                                if (associationInfo.associationType == "State/Province/County")
                                                {
                                                    playerAff = "stateAssociation";
                                                    playerAssocId = xData.associationId

                                                }
                                                else if(associationInfo.associationType = "District/City")
                                                {
                                                    playerAssocId = xData.associationId
                                                    playerAff = "districtAssociation"
                                                    playerParentAssocId = associationInfo.parentAssociationId;

                                                }
                                                else 
                                                    return false;
                                            }
                                           
                                        }
                                        else if (associationInfo.associationType == "State/Province/County")
                                        {
                                            playerAff = "stateAssociation";
                                            playerAssocId = xData.associationId

                                        }
                                        else if(associationInfo.associationType = "District/City")
                                        {
                                            playerAssocId = xData.associationId
                                            playerAff = "districtAssociation"
                                            playerParentAssocId = associationInfo.parentAssociationId;

                                        }
                                        else 
                                            return false;
                                        //playerAssocId = xData.associationId
                                        if (associationInfo.interestedProjectName)
                                            playerIntSport = associationInfo.interestedProjectName;

                                        if (associationInfo.interestedDomainName)
                                            playerIntDomain = associationInfo.interestedDomainName;

                                        if(playerIntDomain  && playerIntDomain.length > 0)
                                            assocState = playerIntDomain[0];


                                    }
                                }

                                var toret = "userDetailsTT"
                                if(playerIntSport && playerIntSport.length != 0){
                                    var dbtoret = playerDBFind(playerIntSport)
                                    if(dbtoret != false){
                                        toret = dbtoret
                                    }
                                }


                                var userPhone = "";
                                if(xData.phoneNumber)
                                    userPhone = xData.phoneNumber;


                                        
                                var playerData = {};
                                playerData["userId"] =  playerID
                                playerData["emailAddress"] = xData.emailAddress
                                playerData["interestedDomainName"] =  playerIntDomain
                                playerData["interestedProjectName"] =  playerIntSport
                                playerData["interestedSubDomain1Name"] =  [""]
                                playerData["interestedSubDomain2Name"] = [""]
                                playerData["profileSettingStatus"] = true
                                playerData["userName"] = xData.userName.trim()
                                playerData["phoneNumber"] = userPhone
                                playerData["gender"] =  xData.gender
                                playerData["dateOfBirth"] = moment(new Date(xData.dob)).format("DD MMM YYYY")
                                playerData["role"] = "Player"
                                playerData["city"] =  ""
                                playerData["pinCode"] =  ""
                                playerData["state"] =  assocState
                                playerData["country"] =  "India"
                                playerData["statusOfUser"] =  "Active"
                                playerData["year"]  = new Date().getFullYear()
                                playerData["affiliatedTo"]  = playerAff
                                playerData["tempAffiliationId"] =  tmpAffilationID
                                playerData["associationId"] =  playerAssocId

                                if(xData.guardianName)
                                    playerData["guardianName"] = xData.guardianName

                                if(xData.motherName)
                                    playerData["motherName"] = xData.motherName
                               

                                if(playerAcademyId != null && playerAcademyId != "" && playerAcademyId.length > 0)
                                    playerData["clubNameId"] = playerAcademyId;

                                if(playerParentAssocId != null && playerParentAssocId != "" && playerParentAssocId.length > 0)
                                    playerData["parentAssociationId"] = playerParentAssocId;


                                var userDetailsTT_player = global[toret].insert(playerData);

                                if (userDetailsTT_player) 
                                {
                                    var profileUpdate = Meteor.users.update({
                                        "_id": playerID
                                    }, {
                                        $set: {
                                            role:"Player",
                                            interestedProjectName:playerIntSport,
                                        }
                                    });

                                    var tmpAffilationID = "TMP1";
                                    var tempAffIDInfo = lastInsertedAffId.findOne({
                                        "assocId": "Temp"
                                    });
                                    if (tempAffIDInfo) {
                                        tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                                        lastInsertedAffId.update({
                                            "assocId": "Temp"
                                        }, {
                                            $set: {
                                                lastInsertedId: tempAffIDInfo.lastInsertedId
                                            }
                                        });
                                    } else
                                        lastInsertedAffId.insert({
                                            "assocId": "Temp",
                                            lastInsertedId: "1"
                                        });
                                } else {
                                    var removePlayer = Meteor.users.remove({
                                        "_id": playerID
                                    })
                                }

                            } catch (e) {
                                var removePlayer = Meteor.users.remove({
                                    "_id": playerID
                                })
                            }

                            resultJson =  playerID;
                            try{
                        
                            if(xData.approvalCode != undefined && xData.transactionID != undefined && xData.transactionAmount != undefined 
                                && xData.transactionID.length > 0 && xData.approvalCode.length > 0 && xData.transactionAmount.length > 0)
                            {
                                var regTrans = registrationTransaction.insert({
                                    "userId":playerID,
                                    "associationId":xData.associationId,
                                    "transactionId": xData.transactionID,
                                    "transactionFee":xData.transactionAmount
                                })
                                if(regTrans)
                                {

                                    var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                    var affiliationID =  await Meteor.call("generateAffId",xData.approvalCode,userDetails);
                                    var userDetailsInfo = nameToCollection(playerID).findOne({"userId": playerID});
                                    var currentDate = new Date();
                                    var regStatus = undefined;

                                    var validityInfo = registrationValidity.findOne({"userId":xData.associationId,"year":currentDate.getFullYear(),"status" : "active"});
                                    if(validityInfo && affiliationID)                                  
                                        regStatus = registrationApproval.insert({
                                            "userId":playerID,"associationId":xData.associationId,
                                            "validity":validityInfo.validity})
                                    
                                   
                                    var userDetailsData = nameToCollection(playerID).findOne({"userId": playerID});

                                    if(validityInfo && affiliationID && regStatus)
                                    {

                                        resultJson =  userDetailsData;                                
                                    }

                                    else
                                    {
                                        resultJson =  userDetailsData;                                
                                        if(affiliationID == false)
                                        {
                                            resultJson["errorMsg"] = "Could not set affiliationID"
                                        }
                                    }
                                }
                                else
                                {
                                   // var user_rem_player = nameToCollection(playerID).remove({"userId": playerID});
                                    //var removePlayer = Meteor.users.remove({
                                   //     "_id": playerID
                                   // })
                                }

                            }
                            
                            else if(xData.approvalCode != undefined  && xData.approvalCode.length > 0)
                            {
                                console.log("inside approvalCode .. !")
                                var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                var affiliationID =  await Meteor.call("generateAffId",xData.approvalCode,userDetails);
                                console.log(JSON.stringify(affiliationID))
                                var userDetailsData = nameToCollection(playerID).findOne({"userId": playerID});
                                if(affiliationID)
                                {
                                    resultJson =  userDetailsData;                                
                                }
                            }
                        }catch(e){
                        }

                            //code here for association approval and payment integration
                        }
                    } else if (xData.role == "Organiser" || xData.role == "Coach") {

                        xData.gender = "",
                        xData.interestedDomainName = [""],
                        xData.phoneNumber = "",
                        xData.city = "";
                        xData.state = "";
                        xData.country = "India";
                        xData.pinCode = "";

                        var result = await Meteor.call("registerOtherUsers", xData);
                        if (result) {
                            //var result3 = Meteor.call("updateOtherUserActivities",xData);

                        }
                        resultJson = result
                    }
                }
                else if(resValid && resValid.response == 1)
                {
                    resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "This email address exists, try with different email"
                
                    if(xData.regOverride != undefined && (xData.regOverride == true || xData.regOverride == "true"))
                    {
                        if(xData.role == "Player" || xData.role == undefined)
                        {
                            var userInfo =  Meteor.users.findOne({
                                "role":"Player",
                                $or: [{
                                    "emailAddress": {
                                        $regex: emailRegex(xData.emailAddress)
                                    },
                                    "emails.0.address": {
                                        $regex: emailRegex(xData.emailAddress)
                                    }
                                }]
                            });
                            if(userInfo)
                            {
                                xData.playerID = userInfo.userId
                                resultJson = await Meteor.call("addPlayerUnderAssoc",xData);
                            }

                        }
                    }      
                }
                else if(resValid && resValid.response == 2){
                     resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "This phone number exists, try with different phone number"
                }
                else if(resValid && resValid.response == 3){
                     resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid data"
                }
                else{
                     resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid data"
                }
            }catch(e){
                resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid data"
            }

            return resultJson
        } catch (e) {
            return false;
        }
    },

    "affiliateToAssoc":async function(data){
        try{


            var xData;
            if (typeof data == "string") {
                data = data.replace("\\", "");
                xData = JSON.parse(data);
            } else {
                xData = data;

            }

            var successJson = succesData();
            var failureJson = failureData();
            var objCheck = Match.test(xData, { 
                    "emailAddress": String, "associationId": String,
                    "approvalCode":String,"transactionID":String,
                    "transactionAmount":String,"clubNameId":String})

            if(objCheck)
            {
                if(xData.approvalCode != undefined && xData.transactionID != undefined && 
                    xData.transactionAmount != undefined && xData.transactionID.length > 0 && 
                    xData.approvalCode.length > 0 && xData.transactionAmount.length > 0)
                {
                    var userInfo = Meteor.users.findOne({"emailAddress":xData.emailAddress})
                    if(userInfo)
                    {
                        if(userInfo.interestedProjectName == undefined || userInfo.interestedProjectName == null)
                        {
                            var sportInfo = tournamentEvents.findOne({"projectMainName" : "Table Tennis"});
                            if(sportInfo)
                            {
                                var userSportRes = Meteor.users.update({"emailAddress":xData.emailAddress},{$set:{"interestedProjectName":sportInfo._id}});
                                if(userSportRes)
                                {
                                    userInfo = Meteor.users.findOne({"emailAddress":xData.emailAddress})
  
                                }
                            }
                        }
                        var toret = "userDetailsTT"
                        if(userInfo.interestedProjectName && userInfo.interestedProjectName.length > 0){
                            var dbtoret = playerDBFind(userInfo.interestedProjectName[0])
                            if(dbtoret != false){
                                toret = dbtoret
                            }
                        }

                        var userDetailInfo = global[toret].findOne({"userId": userInfo.userId});
                        if(userDetailInfo)
                        {
                            
                            if(
                                userDetailInfo.affiliatedTo == undefined || userDetailInfo.affiliatedTo == null ||
                                (userDetailInfo.affiliatedTo != undefined && userDetailInfo.affiliatedTo.toLowerCase() == "other"))
                            {
                                var playerAcademyId = "";
                                var playerAff = "";
                                var playerAssocId = "";
                                var playerParentAssocId = "";
                                var playerIntDomain = [""];
                                var playerIntSport = [""]
                                var assocState = "";

                                var associationInfo = associationDetails.findOne({
                                    "userId": xData.associationId});
                                if (associationInfo) 
                                {
                                    if(xData.clubNameId != null && xData.clubNameId != undefined && xData.clubNameId != "none")
                                    {
                                        var academyInfo = academyDetails.findOne({"userId":xData.clubNameId});
                                        if(academyInfo)
                                        {                                           
                                            playerAcademyId = academyInfo.userId;
                                            playerAff = "academy";

                                            if (associationInfo.associationType == "State/Province/County")                               
                                                playerAssocId = xData.associationId                                        
                                            else if(associationInfo.associationType = "District/City")
                                            {
                                                playerAssocId = xData.associationId
                                                playerParentAssocId = associationInfo.parentAssociationId;

                                            }              
                                        }
                                        else
                                        {
                                            if (associationInfo.associationType == "State/Province/County")
                                            {
                                                playerAff = "stateAssociation";
                                                playerAssocId = xData.associationId
                                            }
                                            else if(associationInfo.associationType = "District/City")
                                            {
                                                playerAssocId = xData.associationId
                                                playerAff = "districtAssociation"
                                                playerParentAssocId = associationInfo.parentAssociationId;

                                            }
                                                    
                                        }
                                           
                                    }
                                    else if (associationInfo.associationType == "State/Province/County")
                                    {
                                        playerAff = "stateAssociation";
                                        playerAssocId = xData.associationId
                                    }
                                    else if(associationInfo.associationType = "District/City")
                                    {
                                        playerAssocId = xData.associationId
                                        playerAff = "districtAssociation"
                                        playerParentAssocId = associationInfo.parentAssociationId;
                                    }
                                        
                                       
                                    if (associationInfo.interestedDomainName)
                                        playerIntDomain = associationInfo.interestedDomainName;

                                    if(playerIntDomain  && playerIntDomain.length > 0)
                                        assocState = playerIntDomain[0];


                                    var playerData = {};
                                    playerData["interestedDomainName"] =  playerIntDomain
                                    playerData["interestedProjectName"] =  playerIntSport
                                    playerData["state"] =  assocState
                                    playerData["affiliatedTo"]  = playerAff
                                    playerData["associationId"] =  playerAssocId
                                    playerData["clubNameId"] = "";
                                    playerData["parentAssociationId"] = ""

                               
                                    if(playerAcademyId != null && playerAcademyId != "" && playerAcademyId.length > 0)
                                        playerData["clubNameId"] = playerAcademyId;

                                    if(playerParentAssocId != null && playerParentAssocId != "" && playerParentAssocId.length > 0)
                                        playerData["parentAssociationId"] = playerParentAssocId;


                                    var playerAff =  global[toret].update({"userId":userInfo.userId},
                                        {$set:playerData});
                                    if(playerAff)
                                    {
                                        var playerID = userInfo.userId
                                        var regTrans = registrationTransaction.insert({
                                            "userId":userInfo.userId,
                                            "transactionId": xData.transactionID,
                                            "transactionFee":xData.transactionAmount
                                        })
                                        if(regTrans)
                                        {

                                            var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                            var affiliationID =  await Meteor.call("generateAffId",xData.approvalCode,userDetails);
                                            var userDetailsInfo = nameToCollection(playerID).findOne({"userId": playerID});
                                            var currentDate = new Date();
                                            var regStatus = undefined;

                                            var validityInfo = registrationValidity.findOne({"userId":xData.associationId,"year":currentDate.getFullYear(),"status" : "active"});
                                            if(validityInfo && affiliationID)                                  
                                                regStatus = registrationApproval.insert({"userId":playerID,"validity":validityInfo.validity})
                                            
                                            var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                            if(validityInfo && affiliationID && regStatus)
                                            {
                                                successJson["data"] =  userDetails;  
                                                return successJson                              
                                            }

                                            else
                                            {
                                                successJson["data"] =  userDetails;                                                                  
                                                if(affiliationID == false)
                                                {
                                                    successJson["errorMsg"] = "Could not set affiliationID"
                                                }
                                                return successJson;
                                            }
                                        }
                                        else
                                        {
                                            failureJson["message"] = "Could not affilate to association and transaction failed"
                                            return failureJson
                                        }  
                                    }
                                    else
                                    {
                                        failureJson["message"] = "Could not affilate to association"
                                        return failureJson
                                    }

                                }  
                                else
                                {
                                    failureJson["message"] = "Invalid association";
                                    return failureJson; 
                                }                             
                            }
                            else
                            {
                                failureJson["message"] = "User with this email id : "+xData.emailAddress+" already affiliated to other association/academy";
                                return failureJson; 
                            }
                        }
                        else
                        {
                            failureJson["message"] = "User not found with this email id : "+xData.emailAddress;
                            return failureJson;
                        }
                        
                    }
                    else
                    {
                        failureJson["message"] = "User not found with this email id : "+xData.emailAddress;
                        return failureJson;
                    }
                }
            }
            else
            {
                failureJson["message"] = "Require all parameters";
                return failureJson;
            }

        }catch(e){
            failureJson["message"] = "Invalid data "+e;
            return failureJson;

        }
    },
    "validateAffiliateOther":async function(data)
    {
        try{
            var xData;
            if (typeof data == "string") {
                data = data.replace("\\", "");
                xData = JSON.parse(data);
            } else {
                xData = data;

            }


            var successJson = succesData();
            var failureJson = failureData();
            var objCheck = Match.test(xData, { 
                    "emailAddress": String})
            if(objCheck)
            {
                var userInfo = Meteor.users.findOne({"emailAddress":xData.emailAddress.trim()});
                if(userInfo)
                {
                    var toret = "userDetailsTT"
                    if(userInfo.interestedProjectName && userInfo.interestedProjectName.length > 0){
                        var dbtoret = playerDBFind(userInfo.interestedProjectName[0])
                        if(dbtoret != false){
                            toret = dbtoret
                        }
                    }

                    var userDetailInfo = global[toret].findOne({"userId": userInfo.userId});
                    if(userDetailInfo)
                    {
                            
                        if(userDetailInfo.affiliatedTo == undefined || userDetailInfo.affiliatedTo == null ||
                            (userDetailInfo.affiliatedTo != undefined && userDetailInfo.affiliatedTo.toLowerCase() == "other"))
                        {
                            successJson["message"] = "User with this email id can be affiliated to association";
                            return successJson;
                        }
                        else
                        {
                            failureJson["message"] = "User with this email id : "+xData.emailAddress+" already affiliated to other association/academy";
                            return failureJson; 
                        }
                    }
                    else
                    {
                        failureJson["message"] = "User not found with this email id : "+xData.emailAddress;
                        return failureJson;
                    }
                }
                else
                {
                    failureJson["message"] = "User not found with this email id : "+xData.emailAddress;
                    return failureJson;
                }
            }
            else
            {
                failureJson["message"] = "Require all parameters";
                return failureJson;
            }

        }catch(e){
            failureJson["message"] = "Invalid data "+e;
            return failureJson;

        }
    },
    "renewalUnderAssoc":async function(data){
        try{

            var xData;
            if (typeof data == "string") {
                data = data.replace("\\", "");
                xData = JSON.parse(data);
            } else {
                xData = data;

            }

            var successJson = succesData();
            var failureJson = failureData();
            var objCheck = Match.test(xData, { 
                    "userId": String, "associationId": String,
                    "approvalCode":String,"transactionID":String,
                    "transactionAmount":String})

            if(objCheck)
            {
                if(xData.approvalCode != undefined && xData.transactionID != undefined && 
                    xData.transactionAmount != undefined && xData.transactionID.length > 0 && 
                    xData.approvalCode.length > 0 && xData.transactionAmount.length > 0)
                {
                    var userInfo = Meteor.users.findOne({"userId":xData.userId})
                    if(userInfo)
                    {
                        var toret = "userDetailsTT"
                        if(userInfo.interestedProjectName && userInfo.interestedProjectName.length > 0){
                            var dbtoret = playerDBFind(userInfo.interestedProjectName[0])
                            if(dbtoret != false){
                                toret = dbtoret
                            }
                        }

                        var userDetailInfo = global[toret].findOne({"userId": userInfo.userId});
                        if(userDetailInfo)
                        {

                        console.log(userDetailInfo.affiliatedTo)   
                        console.log(userDetailInfo.associationId+" .... "+xData.associationId)                   
                            if(
                                userDetailInfo.affiliatedTo == undefined || userDetailInfo.affiliatedTo == null ||
                                (userDetailInfo.affiliatedTo != undefined && userDetailInfo.affiliatedTo.toLowerCase() == "other"))
                            {
                                var playerAcademyId = "";
                                var playerAff = "";
                                var playerAssocId = "";
                                var playerParentAssocId = "";
                                var playerIntDomain = [""];
                                var playerIntSport = [""]
                                var assocState = "";

                                var associationInfo = associationDetails.findOne({
                                    "userId": xData.associationId});
                                if (associationInfo) 
                                {
                                    if(xData.clubNameId != null && xData.clubNameId != undefined && xData.clubNameId != "none")
                                    {
                                        var academyInfo = academyDetails.findOne({"userId":xData.clubNameId});
                                        if(academyInfo)
                                        {                                           
                                            playerAcademyId = academyInfo.userId;
                                            playerAff = "academy";

                                            if (associationInfo.associationType == "State/Province/County")                               
                                                playerAssocId = xData.associationId                                        
                                            else if(associationInfo.associationType = "District/City")
                                            {
                                                playerAssocId = xData.associationId
                                                playerParentAssocId = associationInfo.parentAssociationId;

                                            }              
                                        }
                                        else
                                        {
                                            if (associationInfo.associationType == "State/Province/County")
                                            {
                                                playerAff = "stateAssociation";
                                                playerAssocId = xData.associationId
                                            }
                                            else if(associationInfo.associationType = "District/City")
                                            {
                                                playerAssocId = xData.associationId
                                                playerAff = "districtAssociation"
                                                playerParentAssocId = associationInfo.parentAssociationId;

                                            }
                                                    
                                        }
                                           
                                    }
                                    else if (associationInfo.associationType == "State/Province/County")
                                    {
                                        playerAff = "stateAssociation";
                                        playerAssocId = xData.associationId
                                    }
                                    else if(associationInfo.associationType = "District/City")
                                    {
                                        playerAssocId = xData.associationId
                                        playerAff = "districtAssociation"
                                        playerParentAssocId = associationInfo.parentAssociationId;
                                    }
                                        
                                       
                                    if (associationInfo.interestedDomainName)
                                        playerIntDomain = associationInfo.interestedDomainName;

                                    if(playerIntDomain  && playerIntDomain.length > 0)
                                        assocState = playerIntDomain[0];


                                    var playerData = {};
                                    playerData["interestedDomainName"] =  playerIntDomain
                                    playerData["interestedProjectName"] =  playerIntSport
                                    playerData["state"] =  assocState
                                    playerData["affiliatedTo"]  = playerAff
                                    playerData["associationId"] =  playerAssocId

                               
                                    if(playerAcademyId != null && playerAcademyId != "" && playerAcademyId.length > 0)
                                        playerData["clubNameId"] = playerAcademyId;

                                    if(playerParentAssocId != null && playerParentAssocId != "" && playerParentAssocId.length > 0)
                                        playerData["parentAssociationId"] = playerParentAssocId;


                                    var playerAff =  global[toret].update({"userId":userInfo.userId},
                                        {$set:playerData});
                                    if(playerAff)
                                    {
                                        var playerID = userInfo.userId
                                        var regTrans = registrationTransaction.insert({
                                            "userId":userInfo.userId,
                                            "associationId":xData.associationId,
                                            "transactionId": xData.transactionID,
                                            "transactionFee":xData.transactionAmount
                                        })
                                        if(regTrans)
                                        {

                                            var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                            var affiliationID =  await Meteor.call("generateAffId",xData.approvalCode,userDetails);
                                            var userDetailsInfo = nameToCollection(playerID).findOne({"userId": playerID});
                                            var currentDate = new Date();
                                            var regStatus = undefined;

                                            var validityInfo = registrationValidity.findOne({"userId":xData.associationId,"year":currentDate.getFullYear(),"status" : "active"});
                                            if(validityInfo && affiliationID)                                  
                                                regStatus = registrationApproval.insert({
                                                    "userId":playerID,"associationId":xData.associationId,
                                                    "validity":validityInfo.validity})
                                            
                                            var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                            if(validityInfo && affiliationID && regStatus)
                                            {
                                                successJson["data"] =  userDetails;  
                                                return successJson                              
                                            }

                                            else
                                            {
                                                successJson["data"] =  userDetails;                                                                  
                                                if(affiliationID == false)
                                                {
                                                    successJson["errorMsg"] = "Could not set affiliationID"
                                                }
                                                return successJson;
                                            }
                                        }
                                        else
                                        {
                                            failureJson["message"] = "Could not affilate to association and transaction failed"
                                            return failureJson
                                        }  
                                    }
                                    else
                                    {
                                        failureJson["message"] = "Could not affilate to association"
                                        return failureJson
                                    }

                                }  
                                else
                                {
                                    failureJson["message"] = "Invalid association";
                                    return failureJson; 
                                }                             
                            }

                            else if(userDetailInfo.associationId === xData.associationId)
                            {

                                console.log("renewalUnderAssoc sameassoc")
var playerID = userInfo.userId
                                        var regTrans = registrationTransaction.insert({
                                            "userId":userInfo.userId,
                                            "associationId":xData.associationId,
                                            "transactionId": xData.transactionID,
                                            "transactionFee":xData.transactionAmount
                                        })
                                        if(regTrans)
                                        {

                                            var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                            var userDetailsInfo = nameToCollection(playerID).findOne({"userId": playerID});
                                            var currentDate = new Date();
                                            var regStatus = undefined;

                                            var validityInfo = registrationValidity.findOne({"userId":xData.associationId,"year":currentDate.getFullYear(),"status" : "active"});
                                            if(validityInfo )                                  
                                                regStatus = registrationApproval.insert({
                                                    "userId":playerID,"associationId":xData.associationId,
                                                    "validity":validityInfo.validity})
                                            
                                            var userDetails = nameToCollection(playerID).findOne({"userId": playerID});
                                            if(validityInfo  && regStatus)
                                            {
                                                successJson["data"] =  userDetails;  
                                                return successJson                              
                                            }

                                           
                                        }
                                        else
                                        {
                                            failureJson["message"] = "Could not affilate to association and transaction failed"
                                            return failureJson
                                        }  

                            }
                            else
                            {
                                failureJson["message"] = "User with this email id : "+xData.emailAddress+" already affiliated to other association/academy";
                                return failureJson; 
                            }
                        }
                        else
                        {
                            failureJson["message"] = "User not found with this  id : "+xData.userId;
                            return failureJson;
                        }
                        
                    }
                    else
                    {
                        failureJson["message"] = "User not found with this  id : "+xData.userId;
                        return failureJson;
                    }
                }
            }
            else
            {
                failureJson["message"] = "Require all parameters";
                return failureJson;
            }

        }catch(e){
            failureJson["message"] = "Invalid data "+e;
            return failureJson;

        }
    },
    coachRegisterationViaApp:async function(xData) {
        try {
            var resultJson = {};
            var resValid = await Meteor.call("registerValidationGeneralized", xData)
            try {
                if(resValid && resValid.response == 0 && resValid.playerID){
                    xData.gender = ""
                    xData.regId = resValid.playerID
                    xData.interestedDomainName = [xData.state]
                    var result = await Meteor.call("registerOtherUsers", xData);
                    if (result) {
                        var otherUserInfo = otherUsers.findOne({
                            "_id": result
                        });
                        if (otherUserInfo) {
                            xData.userId = otherUserInfo.userId;
                            var result3 = await Meteor.call("updateOtherUserActivities", xData);
                            
                            resultJson["status"] = "success";
                            resultJson["response"] = "Successfully Registered!!"
                        }
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Could not register.. Please try again!!"
                    }
                }
                else if(resValid && resValid.response == 1){
                    resultJson["status"] = "failure";
                    resultJson["response"] = "This email address exists, try with different email"
                }
                else if(resValid && resValid.response == 2){
                    resultJson["status"] = "failure";
                    resultJson["response"] = "This phone number exists, try with different phone number"
                }
                else if(resValid && resValid.response == 3){
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid data"
                }
                else{
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid data"
                }
            }catch(e){
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid data"
            }

            return resultJson
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = "Invalid data"
            return resultJson;
        }
    },

    "registerIndividual": async function(data, apiKey) {
        try {
            var resultJson = {};
            var xData;
            if (typeof data == "string") {
                data = data.replace("\\", "");
                xData = JSON.parse(data);
            } else {
                xData = data;

            }

            var resValid = await Meteor.call("registerValidationGeneralized", xData)
            try {
                if(resValid && resValid.response == 0 && resValid.playerID){
                    xData.regId = resValid.playerID
                    

                    if (xData.state != null)
                        xData.interestedDomainName = [xData.state];

                    if (xData.dateOfBirth != null) {

                        var birthDate = moment(new Date(xData.dateOfBirth)).format("YYYY-MM-DD");
                        if (birthDate.split("-").length == 3) {
                            xData.s3 = birthDate.split("-")[0];
                            xData.s2 = birthDate.split("-")[1];
                            xData.s1 = birthDate.split("-")[2];

                        }
                    }

                    if (xData.role == "Coach" || xData.role == "Umpire" || xData.role == "Organiser") {

                        var result = await Meteor.call("registerOtherUsers", xData)
                        try {                          
                            if (result) {
                                resultJson["status"] = "success";
                                resultJson["resultID"] = result;
                                resultJson["response"] = xData.role + " created";
                            } else {
                                var userFound = Meteor.users.findOne({
                                    $or: [{
                                        "emailAddress": {
                                            $regex: emailRegex(xData.emailAddress)
                                        },
                                        "emails.0.address": {
                                            $regex: emailRegex(xData.emailAddress)
                                        }
                                    }]
                                });
                                if (userFound) {
                                    resultJson["status"] = "failure"
                                    resultJson["resultID"] = "";
                                    resultJson["response"] = "Duplicate user found"
                                } else {
                                    resultJson["status"] = "failure";
                                    resultJson["resultID"] = result;
                                    resultJson["response"] = " Could not create " + xData.role;
                                }
                            }                
                        }catch(e)
                        {
                            resultJson["status"] = "failure";
                            resultJson["resultID"] = result;
                            resultJson["response"] = xData.role + " Could not create " + xData.role;
                        }

                    } else if (xData.role == "Player") {
                        xData.domainID = xData.state;

                        var toret = "userDetailsTT"
                        if(xData.interestedProjectName && xData.interestedProjectName.trim().length != 0){
                            var dbtoret = playerDBFind(xData.interestedProjectName)
                            if(dbtoret != false){
                                toret = dbtoret
                            }
                        }

                        var result = await Meteor.call("registerPlayer", xData)
                        try{
                            
                            if (result) {
                                var userFound = global[toret].findOne({
                                    "_id": result
                                });
                                if (userFound) {
                                    resultJson["status"] = "success";
                                    resultJson["resultID"] = userFound;
                                    resultJson["response"] = xData.role + " created";
                                }
                            } else {
                                var userFound = Meteor.users.findOne({
                                    $or: [{
                                        "emailAddress": {
                                            $regex: emailRegex(xData.emailAddress)
                                        },
                                        "emails.0.address": {
                                            $regex: emailRegex(xData.emailAddress)
                                        }
                                    }]
                                });
                                if (userFound) {
                                    resultJson["status"] = "failure"
                                    resultJson["resultID"] = "";
                                    resultJson["response"] = "Duplicate user found"
                                } else {
                                    resultJson["status"] = "failure";
                                    resultJson["resultID"] = result;
                                    resultJson["response"] = xData.role + " Could not create " + xData.role;
                                }
                            }
                            
                        }catch(e){
                            resultJson["status"] = "failure";
                            resultJson["resultID"] = result;
                            resultJson["response"] = xData.role + " Could not create " + xData.role;
                        }
                    } else if (xData.role == "Reporter") {
                        var result = await Meteor.call("registerOtherUsers", xData);

                        try {   
                            if (result) 
                            {
                                var profileUpdate = Meteor.users.update({
                                    "_id": result
                                }, {
                                    $set: {
                                        verifiedBy: ["email"],
                                    }
                                });

                                resultJson["status"] = "success";
                                resultJson["resultID"] = result;
                                resultJson["response"] = xData.role + " created";
                            } 
                            else 
                            {
                                var userFound =Meteor.users.findOne({
                                    $or: [{
                                        "emailAddress": {
                                            $regex: emailRegex(xData.emailAddress)
                                        },
                                        "emails.0.address": {
                                            $regex: emailRegex(xData.emailAddress)
                                        }
                                    }]
                                });
                                if (userFound) {
                                    resultJson["status"] = "failure"
                                    resultJson["resultID"] = "";
                                    resultJson["response"] = "Duplicate user found"
                                } else {
                                    resultJson["status"] = "failure";
                                    resultJson["resultID"] = result;
                                    resultJson["response"] = " Could not create " + xData.role;                                 
                                }
                            }                     
                        }catch(e){
                            resultJson["status"] = "failure";
                            resultJson["resultID"] = result;
                            resultJson["response"] = xData.role + " Could not create " + xData.role;
                        }
                    }
                }
                else if(resValid){
                    resultJson = resValid
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Cannot create"
                }
            }catch(e){

            }
            return resultJson;

        } catch (e) {}
    },

})