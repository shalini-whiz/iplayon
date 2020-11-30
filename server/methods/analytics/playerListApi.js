import {nameToCollection} from '../dbRequiredRole.js'

var insertAffidAndIncCounter = function(lastInsertedAssocId, xData,affIdFormat,AIds) {
    try {
       
        var lasInsertedIdN = 0
        var lastInsertedAffIdget = lastInsertedAffId.findOne({
            "assocId": lastInsertedAssocId
        });

        if (lastInsertedAffIdget) 
        {
            lasInsertedIdN = lastInsertedAffIdget.lastInsertedId
        } else {
            lasInsertedIdN = 0
        }

        var padded = ('0000' + parseInt(parseInt(lasInsertedIdN) + 1)).slice(-5);
        if (xData.year == undefined || xData.year == null || xData.year.trim().length == 0) {
            xData.year = new Date().getFullYear()
        }

        var AId = AIds


        if(AId.trim().length == 0)
        {
            AId = affIdFormat.toUpperCase() + xData.year.toString().substring(2, 4) + padded;
            var checkRepeatedAffid = Meteor.call("affiliationIdRepeat",AId,lastInsertedAssocId)
            if(checkRepeatedAffid != null && checkRepeatedAffid != undefined && checkRepeatedAffid != false){
                return false
            }
        }

        var j = nameToCollection(xData.userId).update({
            userId: xData.userId
        }, {
            $set: {
                "affiliationId": AId,
                "statusOfUser": "Active"
            }
        });

        if(j && AIds.trim().length == 0)
        {
            var findCounter = lastInsertedAffId.findOne({
                assocId: lastInsertedAssocId
            });

            if (j && findCounter == undefined) {
                var k = lastInsertedAffId.insert({
                    "assocId": lastInsertedAssocId,
                    "lastInsertedId": parseInt(parseInt(lasInsertedIdN) + 1)
                })
                if(k){
                    return true
                }
            } else {
                var s  = lastInsertedAffId.update({
                    assocId: lastInsertedAssocId
                }, {
                    $set: {
                        lastInsertedId: parseInt(parseInt(lasInsertedIdN) + 1)
                    }
                });
                if(s){
                    return true
                }
            }
        }
        else if(j && AIds.trim().length != 0){
            return true
        }
        else{
            return false
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

Meteor.methods({
    "generateAffId":function(affIdFormat,xData){
        try{

            check(xData, Object);
            check(affIdFormat, String);
            var findUser = nameToCollection(xData.userId).findOne({
                "userId": xData.userId
            });
            var findAssocitionDetails;
            var lastInsertedAssocId;
            var AId = ""

            //status is active and affil is empty or nil and undefined
            //status is active and affil is not empty or not nil and undefined
            //status is notapproved and affil is not empty or not nil and undefined
            //status is not approved and affil is empty or nil or und

            if (findUser) 
            {
                
                if (findUser.associationId) {
                    
                    findAssocitionDetails = associationDetails.findOne({
                        "userId": findUser.associationId
                    });
                    if (findAssocitionDetails && findAssocitionDetails.associationType == "District/City") {
                        lastInsertedAssocId = findAssocitionDetails.parentAssociationId
                    } else if (findAssocitionDetails && findAssocitionDetails.associationType == "State/Province/County") {
                        lastInsertedAssocId = findAssocitionDetails.userId
                    }
                }
            }

            if(findUser && findAssocitionDetails && lastInsertedAssocId)
            {
                if(findUser.statusOfUser)
                {
                    if(findUser.statusOfUser.toLowerCase() == "active")
                    {
                        if(findUser.affiliationId == null || findUser.affiliationId == undefined ||
                            findUser.affiliationId.trim().length == 0){
                            var setAffiliation = insertAffidAndIncCounter(lastInsertedAssocId, xData,affIdFormat,AId)
                            return setAffiliation
                        }
                        else if(findUser.affiliationId != null && findUser.affiliationId != undefined &&
                            findUser.affiliationId.trim().length != 0){
                            return true
                        }
                        else{
                            return false
                        }
                    }
                    else if(findUser.statusOfUser.toLowerCase() == "notapproved")
                    {
                        if(findUser.affiliationId == null || findUser.affiliationId == undefined ||
                            findUser.affiliationId.trim().length == 0){
                            var setAffiliation = insertAffidAndIncCounter(lastInsertedAssocId, xData,affIdFormat,AId)
                            return setAffiliation
                        }
                        else if(findUser.affiliationId != null && findUser.affiliationId != undefined &&
                            findUser.affiliationId.trim().length != 0){
                            AId = findUser.affiliationId

                            var setAffiliation = insertAffidAndIncCounter(lastInsertedAssocId, xData,affIdFormat,AId)
                            return setAffiliation
                        }
                        else{
                            return false
                        }
                    }
                    else {
                        return false
                    }
                }else{
                    return false
                }
            }else{
                return false
            }
        }catch(e){
            errorLog(e)
        }
    },
    "getApprovalCount":function(sportID, filterBy, filterID, gender, approval, associationId,value) {
        var approvalCount = "";
        var queryJson = {};
        if(nameToCollection(sportID))
        {
            queryJson["interestedProjectName"] = {
                $in: [sportID]
            };
            queryJson["role"] = "Player";
            queryJson["$and"] = [{$or:[{$and:[{$or:[{"affiliationId":null},{"affiliationId":""},{"affiliationId":"other"}]},{"statusOfUser":"Active"}]},{$and:[{"affiliationId":{$nin:[null,"","other"]}},{"statusOfUser":"notApproved"}]}]}]
            if(gender.trim() != "")
                queryJson["gender"] = gender;
            if(value != undefined && value != null && value.trim() != "")
            {
                var reObj = new RegExp(value, 'i');
                queryJson["userName"] = {
                    $regex: reObj
                }
            }

            if (filterBy == "Association") {
                queryJson["$or"] = [{
                            "associationId": associationId
                        }, {
                            "parentAssociationId": associationId
                        }];          
            } 
            else if (filterBy == "Institution/Academy" && nameToCollection(sportID)){
                queryJson["$or"] = [{
                            "associationId": associationId
                        }, {
                            "parentAssociationId": associationId
                        }];
                queryJson["clubNameId"] = filterID;
            

                
            } 
            else if (filterBy == "Region") {
                queryJson["$or"] = [{
                            "associationId": associationId
                        }, {
                            "parentAssociationId": associationId
                        }];
                queryJson["interestedDomainName"] = {
                    $in: [filterID]
                };
            }

            approvalCount = nameToCollection(sportID).find(queryJson)  ;
            return approvalCount.fetch().length;
        }
        
    },
    getApprovalCountOnNameSearch: function(value) {
        var loggedIn = Meteor.users.findOne({
            "_id": this.userId
        });
        var players;
        var reObj = new RegExp(value, 'i');
        if (loggedIn && loggedIn.userId) {
            if (loggedIn.role && loggedIn.role == "Player" && nameToCollection(this.userId)) {
                var userDetailsTTInfo = nameToCollection(this.userId).findOne({
                    "userId": this.userId
                });
                if (userDetailsTTInfo.associationId || userDetailsTTInfo.parentAssociationId) {
                    approvalCount = nameToCollection(this.userId).find({
                        "role": "Player",
                        userName: {
                            $regex: reObj
                        },
                        $or: [{
                            "associationId": loggedIn.associationId
                        }, {
                            "parentAssociationId": loggedIn.associationId,
                        }],
                        $and: [{
                            $or: [{
                                $and: [{
                                    $or: [{
                                        "affiliationId": null
                                    }, {
                                        "affiliationId": ""
                                    }, {
                                        "affiliationId": "other"
                                    }]
                                }, {
                                    "statusOfUser": "Active"
                                }]
                            }, {
                                $and: [{
                                    "affiliationId": {
                                        $nin: [null, "", "other"]
                                    }
                                }, {
                                    "statusOfUser": "notApproved"
                                }]
                            }]
                        }],
                    })
                }
            } else if (loggedIn.role && loggedIn.role == "Academy" && nameToCollection(loggedIn.userId)) {
                approvalCount = nameToCollection(loggedIn.userId).find({
                    "role": "Player",
                    "clubNameId": loggedIn.userId,
                    userName: {
                        $regex: reObj
                    },
                    $and: [{
                        $or: [{
                            $and: [{
                                $or: [{
                                    "affiliationId": null
                                }, {
                                    "affiliationId": ""
                                }, {
                                    "affiliationId": "other"
                                }]
                            }, {
                                "statusOfUser": "Active"
                            }]
                        }, {
                            $and: [{
                                "affiliationId": {
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            } else if (loggedIn.role && (loggedIn.role == "Association") && 
                loggedIn.associationType == "State/Province/County" &&
                nameToCollection(loggedIn.userId)) {
                approvalCount = nameToCollection(loggedIn.userId).find({
                    "role": "Player",
                    userName: {
                        $regex: reObj
                    },
                    $or: [{
                        "associationId": loggedIn.userId
                    }, {
                        "parentAssociationId": loggedIn.userId,
                    }],
                    $and: [{
                        $or: [{
                            $and: [{
                                $or: [{
                                    "affiliationId": null
                                },  {
                                    "affiliationId": ""
                                }, {
                                    "affiliationId": "other"
                                }]
                            }, {
                                "statusOfUser": "Active"
                            }]
                        }, {
                            $and: [{
                                "affiliationId": {
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            } else if (loggedIn.role && (loggedIn.role == "Association") && 
                loggedIn.associationType == "District/City" &&
                nameToCollection(loggedIn.userId)) {
                approvalCount = nameToCollection(loggedIn.userId).find({
                    "role": "Player",
                    userName: {
                        $regex: reObj
                    },
                    "associationId": loggedIn.userId,
                    $and: [{
                        $or: [{
                            $and: [{
                                $or: [{
                                    "affiliationId": null
                                }, {
                                    "affiliationId": ""
                                }, {
                                    "affiliationId": "other"
                                }]
                            }, {
                                "statusOfUser": "Active"
                            }]
                        }, {
                            $and: [{
                                "affiliationId": {
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            }
        }
        return approvalCount.fetch().length;
    },
    "generateAffId2": function(affIdFormat, xData) {
        try{
        check(xData, Object);
        check(affIdFormat, String);

        var findUser = nameToCollection(xData.userId).findOne({
            "userId": xData.userId
        });
        var findAssocitionDetails;
        var lastInsertedAssocId;
        if (findUser) {
            if (findUser.associationId) {
                findAssocitionDetails = associationDetails.findOne({
                    "userId": findUser.associationId
                });
                if (findAssocitionDetails && findAssocitionDetails.associationType == "District/City") {
                    lastInsertedAssocId = findAssocitionDetails.parentAssociationId
                } else if (findAssocitionDetails && findAssocitionDetails.associationType == "State/Province/County") {
                   
                    lastInsertedAssocId = findAssocitionDetails.userId
                }
            }
        }

        if (findUser && findUser.statusOfUser) {
            if (findUser.statusOfUser == "Active" && (findUser.affiliationId == null || findUser.affiliationId == undefined || findUser.affiliationId.trim().length == 0)) {
             
                var lastInsertedAffIdget = lastInsertedAffId.findOne({
                    "assocId": lastInsertedAssocId
                });
                if (lastInsertedAffIdget) {
                    lasInsertedIdN = lastInsertedAffIdget.lastInsertedId
                } else {
                    lasInsertedIdN = 0
                }
                var padded = ('0000' + parseInt(parseInt(lasInsertedIdN) + 1)).slice(-5);
                if(xData.year==undefined){
                    xData.year= new Date().getFullYear()
                }
                var AId = affIdFormat.toUpperCase() + xData.year.toString().substring(2, 4) + padded;
                var j = nameToCollection(xData.userId).update({
                    userId: xData.userId
                }, {
                    $set: {
                        "affiliationId": AId,
                        "statusOfUser": "Active"
                    }
                });
                var findCounter = lastInsertedAffId.findOne({
                    assocId: lastInsertedAssocId
                });
                if (findCounter == undefined) {
                    var k = lastInsertedAffId.insert({
                        "assocId": lastInsertedAssocId,
                        "lastInsertedId": parseInt(parseInt(lasInsertedIdN) + 1)
                    })
                } else {
                    lastInsertedAffId.update({
                        assocId: lastInsertedAssocId
                    }, {
                        $set: {
                            lastInsertedId: parseInt(parseInt(lasInsertedIdN) + 1)
                        }
                    });
                }
                return true
            } else if (findUser.statusOfUser == "Active" && (findUser.affiliationId !== null || findUser.affiliationId !== undefined || findUser.affiliationId.trim().length !== 0)) {
               
            } else if (findUser.statusOfUser == "notApproved" && (findUser.affiliationId !== null || findUser.affiliationId !== undefined || findUser.affiliationId.trim().length !== 0)) {
                
                var j = nameToCollection(xData.userId).update({
                    userId: xData.userId
                }, {
                    $set: {
                        "statusOfUser": "Active"
                    }
                });
                return true
            } else if (findUser.statusOfUser == "notApproved" && (findUser.affiliationId == null || findUser.affiliationId == undefined || findUser.affiliationId.trim().length == 0)) {
              
                var lastInsertedAffIdget = lastInsertedAffId.findOne({
                    "assocId": lastInsertedAssocId
                });
                if (lastInsertedAffIdget) {
                    lasInsertedIdN = lastInsertedAffIdget.lastInsertedId
                } else {
                    lasInsertedIdN = 0
                }
                var padded = ('0000' + parseInt(parseInt(lasInsertedIdN) + 1)).slice(-5);
                if(xData.year==undefined){
                    xData.year= new Date().getFullYear()
                }
                var AId = affIdFormat.toUpperCase() + xData.year.toString().substring(2, 4) + padded;
                var j = nameToCollection(xData.userId).update({
                    userId: xData.userId
                }, {
                    $set: {
                        "affiliationId": AId,
                        "statusOfUser": "Active"
                    }
                });
                var findCounter = lastInsertedAffId.findOne({
                    assocId: lastInsertedAssocId
                });
                if (findCounter == undefined) {
                    var k = lastInsertedAffId.insert({
                        "assocId": lastInsertedAssocId,
                        "lastInsertedId": parseInt(parseInt(lasInsertedIdN) + 1)
                    })
                } else {
                    lastInsertedAffId.update({
                        assocId: lastInsertedAssocId
                    }, {
                        $set: {
                            lastInsertedId: parseInt(parseInt(lasInsertedIdN) + 1)
                        }
                    });
                }
                return true
            }
        }
        }catch(e){
        }
    }
})
