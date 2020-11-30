import {
    playerDBFind
}
from '../dbRequiredRole.js'

import {
    initDBS
}
from '../dbRequiredRole.js'

Meteor.methods({
    'csvUploadStateAndAcademy': function(xData, assocAcadId, uploadTo) {
        check(xData, Object);
        try {

            if (assocAcadId == null || assocAcadId == undefined || assocAcadId.trim().length == 0) {
                assocAcadId = this.userId
            }

            var loggedInUserDEt = Meteor.users.findOne({
                userId: assocAcadId
            })

            if (loggedInUserDEt && loggedInUserDEt.role && loggedInUserDEt.role.toLowerCase() == "association") {
                var assocDetails = associationDetails.findOne({
                    userId: assocAcadId
                })
                if (assocDetails && assocDetails.associationType == "District/City") {
                    var l;
                    var affiliatedTo = "districtAssociation";
                    var parentAssociationId = assocDetails.parentAssociationId;
                    var associationId = assocDetails.userId;
                    var interestedDomainName = assocDetails.interestedDomainName;
                    var interestedProjectName = assocDetails.interestedProjectName;

                    if (uploadTo && uploadTo.toLowerCase() == "academy") {
                        clubNameId = xData.clubNameId;
                        affiliatedTo = "academy";
                    } else {
                        clubNameId = undefined
                    }

                    CreateUserAccountCSVs(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName, assocDetails, function(RES) {
                        l = RES
                    })
                    return l
                } else if (assocDetails && assocDetails.associationType == "State/Province/County") {
                    var l;
                    var affiliatedTo = "stateAssociation";

                    var associationId = assocDetails.userId;
                    var interestedDomainName = assocDetails.interestedDomainName;
                    var interestedProjectName = assocDetails.interestedProjectName;
                    var parentAssociationId;
                    if (uploadTo && uploadTo.toLowerCase() == "academy") {
                        clubNameId = xData.clubNameId;
                        affiliatedTo = "academy";
                    } else {
                        clubNameId = undefined
                    }

                    CreateUserAccountCSVs(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName, assocDetails, function(RES) {
                        l = RES
                    })
                    return l
                } else {
                    return false
                }
            } else if (loggedInUserDEt && loggedInUserDEt.role && loggedInUserDEt.role.toLowerCase() == "academy") {
                var affiliatedTo = "academy";
                var acadDetails = academyDetails.findOne({
                    userId: loggedInUserDEt._id
                });
                if (acadDetails && acadDetails.associationId) {
                    var interestedDomainName = acadDetails.interestedDomainName;
                    var interestedProjectName = acadDetails.interestedProjectName;
                    var hh = associationDetails.findOne({
                        "userId": acadDetails.associationId
                    });
                    if (hh && hh.associationType == "District/City") {
                        var l;
                        var parentAssociationId = hh.parentAssociationId;
                        var associationId = hh.userId
                        var clubNameId = acadDetails.userId
                        CreateUserAccountCSVs(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName, acadDetails, function(RES) {
                            l = RES
                        })
                        return l;
                    } else if (hh && hh.associationType == "State/Province/County") {
                        var l;
                        var parentAssociationId = undefined;
                        var associationId = hh.userId
                        var clubNameId = acadDetails.userId
                        CreateUserAccountCSVs(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName, acadDetails, function(RES) {
                            l = RES
                        })
                        return l;
                    } else {
                        return false
                    }
                }
            } else {
                return false
            }
        } catch (e) {}
    }
})

var CreateUserAccountCSVs = function(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName, loggedInUser, xcallBack) {
    var toReturn = "0"

    var playerID = ""
    var findDBforSport = false

    //userDetailsTTUsed
    var userDetailsTT_player;
    var projectId;

    try {

        if (xData.state == undefined || xData.state == null) {
            xData.state = loggedInUser.state
        }
        if (xData.country == undefined || xData.country == null) {
            xData.country = loggedInUser.country
        }

        if (xData.emailAddress == null || xData.emailAddress == undefined) {
            xData.emailAddress = ""
        }
        if (xData.phoneNumber == null || xData.phoneNumber == undefined) {
            xData.phoneNumber = ""
        }

        if (xData.emailAddress.trim().length != 0 && xData.phoneNumber.trim().length != 0) {
            xData.emailIdOrPhone = "3"
        } else if (xData.emailAddress.trim.length != 0 && xData.phoneNumber.trim().length == 0) {
            xData.emailIdOrPhone = "1"
        } else if (xData.emailAddress.trim.length == 0 && xData.phoneNumber.trim().length != 0) {
            xData.emailIdOrPhone = "2"
        }

        xData.registerType = 'bulk'

        var password = randomPassword_PlayerCSV(6);
        xData.password = password

        var res = Meteor.call("registerValidationGeneralized", xData)
        try {
            if (res && res.response == 0 && res.playerID) {
                playerID = res.playerID

                if (xData.state == undefined || xData.state == null) {
                    xData.state = loggedInUser.state
                }
                if (xData.country == undefined || xData.country == null) {
                    xData.country = loggedInUser.country
                }

                var s4 = "";

                if (xData.s1 && xData.s2 && xData.s3) {
                    var sa = parseInt(xData.s1)
                    var sb = parseInt(xData.s2)
                    var sc = parseInt(xData.s3)
                    s4 = moment.utc(new Date(sc + "/" + sb + "/" + sa)).format("DD MMM YYYY");
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
                    var d = new Date(sb + "/" + sa + "/" + sc);
                    s4 = new Date(sa + " " + monthNames[d.getMonth()] + " " + sc);
                }
                if (xData.dateOfBirth != undefined && xData.dateOfBirth != null && xData.dateOfBirth.trim().length != 0) {
                    s4 = xData.dateOfBirth
                } else if (xData.dob != undefined && xData.dob != null && xData.dob.trim().length != 0) {
                    s4 = xData.dob
                }

                if (xData.userName == null || xData.userName == undefined) {
                    xData.userName = xData.contactPerson
                }
                if (xData.contactPerson == null || xData.contactPerson == undefined)
                    xData.contactPerson = "";
                if (interestedDomainName == null || interestedDomainName == undefined)
                    interestedDomainName = [""];
                if (xData.address == null || xData.address == undefined)
                    xData.address = " ";

                if (xData.emailAddress == null || xData.emailAddress == undefined) {
                    xData.emailAddress = ""
                }
                if (xData.phoneNumber == null || xData.phoneNumber == undefined) {
                    xData.phoneNumber = ""
                }
                if (xData.address == null || xData.address == undefined) {
                    xData.address = ""
                }
                if (xData.city == null || xData.city == undefined) {
                    xData.city = ""
                }
                if (xData.pinCode == null || xData.pinCode == undefined) {
                    xData.pinCode = ""
                }
                if (xData.guardianName == null || xData.guardianName == undefined) {
                    xData.guardianName = ""
                }
                if (xData.affiliationId == null || xData.affiliationId == undefined) {
                    xData.affiliationId = ""
                }
                if (xData.nationalAffiliationId == null || xData.nationalAffiliationId == undefined) {
                    xData.nationalAffiliationId = ""
                }

                var canInsert = false

                if (canInsert) {
                    toReturn = "0"
                } else {
                    var s = Meteor.users.update({
                        "_id": playerID
                    }, {
                        $set: {
                            userId: playerID,
                            role: "Player",
                            interestedProjectName: interestedProjectName,
                            userName: xData.userName.trim(),
                        }
                    });
                    if (s) {
                        var tmpAffilationID = "TMP1";
                        var tempAffIDInfo = lastInsertedAffId.findOne({
                            "assocId": "Temp"
                        });
                        if (tempAffIDInfo) {
                            tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                            tmpAffilationID = "TMP" + tempAffIDInfo.lastInsertedId;
                        }



                        if (interestedProjectName.length != 0) {
                            projectId = interestedProjectName[0]
                        }

                        findDBforSport = playerDBFind(projectId)

                        if (findDBforSport != false) {
                            //userDetailsTTUsed
                            userDetailsTT_player = global[findDBforSport].insert({
                                userId: playerID,
                                emailAddress: xData.emailAddress.trim(),
                                interestedDomainName: interestedDomainName,
                                interestedProjectName: interestedProjectName,
                                profileSettingStatus: true,
                                userName: xData.userName.trim(),
                                phoneNumber: xData.phoneNumber.trim(),
                                dateOfBirth: moment(new Date(s4)).format("YYYY-MM-DD"),
                                role: "Player",
                                gender: xData.gender,
                                contactPerson: xData.contactPerson.trim(),
                                address: xData.address.trim(),
                                city: xData.city.trim(),
                                pinCode: xData.pinCode,
                                guardianName: xData.guardianName.trim(),
                                state: xData.state,
                                country: xData.country,
                                statusOfUser: xData.userStatus,
                                year: new Date().getFullYear(),
                                affiliatedTo: affiliatedTo,
                                affiliationId: xData.affiliationId,
                                nationalAffiliationId: xData.nationalAffiliationId,
                                associationId: associationId,
                                parentAssociationId: parentAssociationId,
                                clubNameId: clubNameId,
                                tempAffiliationId: tmpAffilationID,
                            });
                        }
                        //userDetailsTTUsed
                        if (userDetailsTT_player) {
                            if (tempAffIDInfo) {
                                lastInsertedAffId.update({
                                    "assocId": "Temp"
                                }, {
                                    $set: {
                                        lastInsertedId: tempAffIDInfo.lastInsertedId
                                    }
                                });
                            } else {
                                lastInsertedAffId.insert({
                                    "assocId": "Temp",
                                    lastInsertedId: "1"
                                });
                            }

                            var insertCount = insertedUsersCount.findOne({
                                "_id": "6dSDPs2sZgjAMKL"
                            });

                            if (insertCount == undefined) {
                                insertedUsersCount.insert({
                                    "_id": "6dSDPs2sZgjAMKL",
                                    counterValue: 1
                                });
                            } else {
                                insertedUsersCount.update({
                                    "_id": "6dSDPs2sZgjAMKL"
                                }, {
                                    $set: {
                                        counterValue: parseInt(insertCount.counterValue + 1)
                                    }
                                });
                            }

                            if (xData.affiliationId != null && xData.affiliationId != undefined && xData.affiliationId.length != 0) {
                                var affID = xData.affiliationId.substr(xData.affiliationId.length - 5);
                                if (affID.match(/^\d+$/)) {
                                    var split1 = affID.split("");
                                    var numbStartsAt = 0
                                    var lastInsertedIdToUpdate;
                                    var findAssocDetails;

                                    for (var is = 0; is < split1.length; is++) {
                                        if (parseInt(split1[is]) !== 0) {
                                            numbStartsAt = is;
                                            break;
                                        }
                                    }

                                    findAssocDetails = associationDetails.findOne({
                                        "userId": associationId
                                    });

                                    if (findAssocDetails && findAssocDetails.associationType) {
                                        if (findAssocDetails.associationType == "State/Province/County") {
                                            lastInsertedIdToUpdate = findAssocDetails.userId
                                        } else if (findAssocDetails.associationType = "District/City") {
                                            lastInsertedIdToUpdate = findAssocDetails.parentAssociationId
                                        }
                                    }

                                    if (lastInsertedIdToUpdate) {

                                        var findLastInsertedIdDetails = lastInsertedAffId.findOne({
                                            "assocId": lastInsertedIdToUpdate.trim()
                                        });
                                        if (findLastInsertedIdDetails == undefined) {
                                            var afterValidSp = affID.slice(numbStartsAt);
                                            lastInsertedAffId.insert({
                                                "assocId": lastInsertedIdToUpdate,
                                                lastInsertedId: afterValidSp
                                            });
                                        } else if (findLastInsertedIdDetails != undefined && findLastInsertedIdDetails.lastInsertedId) {
                                            var afterValidSp = affID.slice(numbStartsAt);
                                            if (parseInt(findLastInsertedIdDetails.lastInsertedId) <= parseInt(afterValidSp)) {
                                                lastInsertedAffId.update({
                                                    "assocId": lastInsertedIdToUpdate
                                                }, {
                                                    $set: {
                                                        lastInsertedId: afterValidSp
                                                    }
                                                })
                                            }
                                        }
                                    }

                                }
                            }

                            toReturn = "1"
                        } else {
                            toReturn = "0"
                        }
                    } else {
                        toReturn = "0"
                    }
                }
            } else if (res && res.playerID) {
                playerID = res.playerID
                toReturn = "0"
            }
        } catch (e) {
            toReturn = "0"
            var rmPlayer = Meteor.users.remove({
                "_id": playerID
            })
            if (findDBforSport != false) {
                global[findDBforSport].remove({
                    "userId": playerID
                })
            }
            //userDetailsTTUsed
            userDetailsTT_player = false
        }


        if (toReturn == "0") {
            var rmPlayer = Meteor.users.remove({
                "_id": playerID
            })
            if (findDBforSport != false) {
                global[findDBforSport].remove({
                    "userId": playerID
                })
            }
            //userDetailsTTUsed
            userDetailsTT_player = false
        }

        return xcallBack(toReturn);

    } catch (e) {
        var rmPlayer = Meteor.users.remove({
            "_id": playerID
        })
        if (findDBforSport) {
            global[findDBforSport].remove({
                "userId": playerID
            })
        }
        return xcallBack("0");
    }
}


Meteor.methods({
    "affiliationIdRepeat": function(affiliationId, saId, index) {
        try {

            var playersDB = initDBS("playersDB")
            var checAFF = false

            if (playersDB && playersDB.length != 0 && affiliationId.trim().length != 0 && saId) {
                for (var i = 0; i < playersDB.length; i++) 
                {
                    checAFF = global[playersDB[i]].findOne({
                        affiliationId: affiliationId
                    })

                    if (checAFF == undefined || checAFF == null) 
                    {

                      

                        checAFF = global[playersDB[i]].findOne({
                            "affiliationId": {
                                '$regex': '.*' + affiliationId.substr(0, 3).trim() + '.*',
                                '$options': 'i'
                            },
                            "$and": [{
                                "associationId": {
                                    $ne: saId
                                }
                            }, {
                                "parentAssociationId": {
                                    $ne: saId
                                }
                            }]
                        }, {
                            userName: 1
                        })

                    }

                    if (checAFF && index != undefined && index != null) {
                        return "affiliationId exists at line " + index
                    } else if (checAFF && (index == undefined || index == null)) {
                        return "affiliationId exists"
                    }
                    else{
                        checAFF = false
                    }

                }
            }

            return checAFF
        } catch (e) {
            console.log(e)
        }
    }
})

Meteor.methods({
    "fieldsRepeatedInUserDB": function(query, ind, data) {
        try {
            var playersDB = initDBS("playersDB")
            var checAFF = {}
            checAFF["i"] = ind
            checAFF["res"] = false
            checAFF["datas"] = data

            if (playersDB && playersDB.length != 0) {
                for (var i = 0; i < playersDB.length; i++) {
                    var achecAFF = global[playersDB[i]].findOne(
                        query
                    )
                    if (achecAFF) {
                        checAFF["i"] = ind
                        checAFF["res"] = true
                       
                        break;
                    } else {
                        checAFF = {}
                        checAFF["datas"] = data
                        checAFF["i"] = ind
                        checAFF["res"] = false
                    }
                }
            }
            return checAFF
        } catch (e) {}
    }
})

Meteor.methods({
    'downloadUsersUploaded': function(sportID, query, fields) {
        try {
            if (sportID && query && fields) 
            {
                var toret = playerDBFind(sportID)
                if (toret) {
                    var s = global[toret].find(
                        query, {
                            fields: fields
                        }).fetch()

                    return s
                } else {
                    return false
                }
            } else {
                return false
            }
        } catch (e) {}
    }
})

Meteor.methods({
    "assocPlayersCSV":function(associationId)
    {
        var successJson = succesData();
        var failureJson = failureData();

        try{
            var assocInfo = associationDetails.findOne({
                "userId": associationId
            })
            if(assocInfo && assocInfo.interestedProjectName && assocInfo.interestedProjectName.length > 0 && assocInfo.interestedProjectName[0])
            {
                var toret = playerDBFind(assocInfo.interestedProjectName[0])
                if (toret) 
                {
                    var playerList = global[toret].find({
                            role: "Player",
                            "$or": [{
                                "associationId": associationId
                            }, {
                                "parentAssociationId": associationId
                            }]
                        }, {
                            fields: {"emailAddress": 1,"userName": 1,
                            "guardianName": 1,"clubName": 1,"clubNameId": 1,
                            "phoneNumber": 1,"associationId": 1,
                            "state": 1,"dateOfBirth": 1,
                            "gender": 1,"country": 1,
                            "address": 1,"city": 1,
                            "pinCode": 1,"affiliationId": 1,
                            "nationalAffiliationId": 1,"userId": 1,
                            "affiliatedTo": 1,"statusOfUser": 1
                        }}).fetch()

                    if(playerList && playerList.length > 0)
                    {
                        _.each(playerList, function(user) {
                            if (user.address == undefined || user.address == null) 
                                user.address = ""
                            
                            if (user.emailAddress == undefined || user.emailAddress == null) 
                                user.emailAddress = ""
                            
                            if (user.phoneNumber == undefined || user.phoneNumber == null) 
                                user.phoneNumber = ""
                            
                            if (user.dateOfBirth == undefined || user.dateOfBirth == null) {
                                user.dateOfBirth = ""
                            } else if (user.dateOfBirth !== undefined && user.dateOfBirth !== null && user.dateOfBirth.length != 0) {
                                user.dateOfBirth = moment(new Date(user.dateOfBirth)).format("YYYY MMM DD")
                            }

                            if (user.pinCode == undefined || user.pinCode == null || user.pinCode.trim().length == 0) 
                                user.pinCode = "";
                            

                            if (user.clubNameId == undefined || user.clubNameId == null || user.clubNameId.trim().length == 0) 
                                user.clubNameId = " ";
                            
                            if (user.clubNameId !== undefined || user.clubNameId !== null || user.clubNameId.trim().length !== 0) {
                                var acaInfo = academyDetails.findOne({
                                    "userId": user.clubNameId})
                                if (acaInfo)
                                    user.clubName = acaInfo.clubName;
                                else 
                                    user.clubName = "other"
                                    
                            }
                            if (user.city == undefined || user.city == null) 
                                user.city = " ";
                                
                            if (user.userName == undefined || user.userName == null) 
                                user.userName = " ";
                                
                            if (user.gender == undefined || user.gender == null) 
                                user.gender = " ";
                                
                            if (user.pinCode == undefined || user.pinCode == null) 
                                 user.pinCode = " ";
                                                    
                            if (user.address == undefined || user.address == null) 
                                user.address = " ";
                                
                            if (user.guardianName == undefined || user.guardianName == null) 
                                user.guardianName = " ";

                            if (user.affiliationId == null || user.affiliationId == undefined || user.affiliationId.trim().length == 0) 
                                user["affiliationId"] = " "
                            
                            if (user.nationalAffiliationId == null || user.nationalAffiliationId == undefined) 
                                user["nationalAffiliationId"] = " "
                                
                            if (user.associationId == null || user.associationId == undefined) 
                                user["associationId"] = "other"
                               
                        })
                        successJson["message"] = "Player List";
                        successJson["data"] = playerList;
                        return successJson;

                    }
                    else
                    {
                        failureJson["message"] = "Players are empty";
                        return failureJson;
                    }
                }
            }
            else
            {
                failureJson["message"] = "Invalid association / Invalid association sport selection "
                return failureJson
            }
           

        }catch(e){
            console.log("main "+e)
            failureJson["message"] = e;
            return failureJson;
        }
    },

    "removalAssocPlayers":async function(associationId)
    {
        var successJson = succesData();
        var failureJson = failureData();

        try{
            var assocInfo = associationDetails.findOne({
                "userId": associationId
            })
            if(assocInfo && assocInfo.interestedProjectName && assocInfo.interestedProjectName.length > 0 && assocInfo.interestedProjectName[0])
            {
                var toret = playerDBFind(assocInfo.interestedProjectName[0])
                if (toret) 
                {
                    var assocPlayers = await Meteor.call("assocPlayersCSV",associationId)
                    
                    var query = {
                        role: "Player",
                        "$or": [{
                            "associationId": associationId
                        }, {
                            "parentAssociationId": associationId
                        }]

                    }
                    var raw = global[toret].rawCollection();
                    var distinct = Meteor.wrapAsync(raw.distinct, raw);
                    var userList = distinct('userId',query);

                    if(userList.length > 0)
                    {
                   


                        var userDBRes = Meteor.users.remove({"userId":{$in:userList}});
                        var playerDBRes = global[toret].remove({"userId":{$in:userList}});
                        var playerSub = events.update({eventParticipants:{$in:userList}},{$pull:{eventParticipants:{$in:userList}}},{multi:true});
                        var playerPastSub = pastEvents.update({eventParticipants:{$in:userList}},{$pull:{eventParticipants:{$in:userList}}},{multi:true});

                        var readStatus = myEntriesReadStatus.remove({ "userId" :{$in:userList}});
                        var receipts = sentReceipt.remove({ "sentReceiptUserId" :{$in:userList}});
                        var playerTeams = teams.remove({ "teamOwner" :{$in:userList}});
                        var entries = playerEntries.remove({playerId:{$in:userList}})
                        var readStatusList = upcomingListsReadStatus.remove({ "userId" :{$in:userList}});

                        var pointsRes = PlayerPoints.remove({"playerId":{$in:userList}});
                        var payRes = paymentTransaction.remove({"playerId":{$in:userList}})

                        var regTrans = registrationTransaction.remove({"userId":{$in:userList}});
                        var regApp = registrationApproval.remove({"userId":{$in:userList}})

                        console.log("Association .. "+assocInfo.associationName);
                        console.log("userDBRes .. "+userDBRes);
                        console.log("playerDBRes .. "+playerDBRes);
                        console.log("playerSub .. "+playerSub);
                        console.log("playerPastSub .. "+playerPastSub);
                        console.log("readStatus .. "+readStatus);
                        console.log("receipts .. "+receipts);
                        console.log("playerTeams .. "+playerTeams);
                        console.log("entries .. "+entries);
                        console.log("readStatusList .. "+readStatusList);
                        console.log("pointsRes .. "+pointsRes);
                        console.log("payRes .. "+payRes);
                        console.log("regTrans .. "+regTrans);
                        console.log("regApp .. "+regApp);

                        if(userDBRes && playerDBRes)
                        {
                            successJson["message"] = "Player List removed";
                            successJson["fileName"] = assocInfo.associationName+"_users";
                            console.log("successJson .. "+JSON.stringify(successJson))

                            if(assocPlayers.status == "success")
                                successJson["data"] = assocPlayers.data;
                            return successJson;
                        }
                        else
                        {
                            failureJson["message"] = "Could not remove association players";
                            return failureJson
                        }
                        

                    }
                    else
                    {
                        failureJson["message"] = "Players are empty";
                        return failureJson;
                    }
                }
            }
            else
            {
                failureJson["message"] = "Invalid association / Invalid association sport selection "
                return failureJson
            }
           

        }catch(e){
            console.log(e)
            failureJson["message"] = e;
            return failureJson;
        }  
    }


})