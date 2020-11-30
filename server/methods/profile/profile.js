import { Accounts }from 'meteor/accounts-base';
import {MatchCollectionDB} from '../../publications/MatchCollectionDb.js';
import {emailRegex}from '../dbRequiredRole.js'
import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({
 // **emailaddress**
    "viewProfileIndividual": function(data) {
        try {
            data = data.replace("\\", "");
            var resultJson = {};
            var xData = JSON.parse(data);
            var userInfo;
            if (xData.emailAddress) {
                var userFound = Meteor.users.findOne({
                    "emails.address": xData.emailAddress
                });
                if (userFound) {
                    if (userFound.role) {
                        if (userFound.role == "Player")
                        {
                            userInfo = nameToCollection(userFound.userId).findOne({
                                "emailAddress": xData.emailAddress
                            });
                        }
                            
                        else if (userFound.role == "Academy")
                            userInfo = academyDetails.findOne({
                                "emailAddress": xData.emailAddress
                            });
                        else if (userFound.role == "Association")
                            userInfo = associationDetails.findOne({
                                "emailAddress": xData.emailAddress
                            });
                        else if (userFound.role == "School")
                            userInfo = schoolDetails.findOne({
                                "emailAddress": xData.emailAddress
                            });
                        else if (userFound.role == "Coach" || userFound.role == "Umpire" || userFound.role == "Organiser" || userFound.role == "Journalist" || userFound.role == "Other")
                            userInfo = otherUsers.findOne({
                                "emailAddress": xData.emailAddress
                            });
                        else
                            userInfo = otherUsers.findOne({
                                "emailAddress": xData.emailAddress
                            });
                    }
                }
            }
            if (userInfo) {
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

    "fetchProfileSettings": function(data) {
        try {
            var resultJson = {};
            var xData = data;
            if (typeof data == "string") {
                data = data.replace("\\", "");
                xData = JSON.parse(data);
            }

            var userInfo;
            if (xData.userId) {

                var userFound = Meteor.users.findOne({
                    "userId": xData.userId
                });
                if (userFound) {
                    if (userFound.role) {
                        if (userFound.role == "Player") 
                        {
                       

                            userInfo = nameToCollection(xData.userId).findOne({
                                "userId": xData.userId
                            });

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
                            if (userInfo.address == null) {
                                userInfo.address = ""
                            }
                            userInfo["address"] = userInfo.address;


                        } else if (userFound.role == "Umpire") {
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
                        } else if (userFound.role == "Organiser" || userFound.role == "Reporter")
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

                                if (userInfo.address == null) {
                                    userInfo.address = ""
                                }
                                userInfo["address"] = userInfo.address
                            }
                        }

                        if(userFound.verifiedBy)
                            userInfo["verifiedBy"] = userFound.verifiedBy
                        else
                            userInfo["verifiedBy"] = [];
                    }
                }
               
            }

            if (userInfo) 
            {

                resultJson["status"] = "success";
                resultJson["result"] = userInfo;
                resultJson["response"] = "Profile Fetched";

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
    fetchProfileStatistics: function(data) {
        try {

            var resultJson = {};
            if (data.loggedInId) {
                var userExists = Meteor.users.findOne({
                    "userId": data.loggedInId
                });
                if (userExists) {
                    var sendUserDet = userDetailsTT.findOne({
                        userId:data.loggedInId
                    })
                    var userData = {};
                    if(sendUserDet && sendUserDet.gender && sendUserDet.emailAddress){
                        userData["gender"] = sendUserDet.gender
                        userData["emailaddress"] = sendUserDet.emailAddress
                    }

                    var connectionCount = connectionRequests.find({
                        $or: [{
                            "loggedInId": data.loggedInId
                        }, {
                            "receiverId": data.loggedInId
                        }],
                        "status": "accepted"
                    }).fetch();

                    var messageCount = 0;
                    var matchCount = 0;

                    var receiverIdQuery = [{
                        receiverId: data.loggedInId
                    }, {
                        senderId: data.loggedInId
                    }]


                    var receiverIdQueryForAll = {
                        receiverId: "All"
                    };

                    var groupIdQuery = {
                        receiverId: {
                            $nin: ["null", ""]
                        }
                    }

                    //get all groupId of this loggin person
                    var getGroupIds = coachConnectedGroups.aggregate([{
                        $match: {
                            $or: [{
                                groupMembers: {
                                    $in: [data.loggedInId]
                                }
                            }, {
                                "loggedInId": data.loggedInId
                            }]
                        }
                    }, {
                        $project: {
                            "groupId": "$_id"
                        }
                    }, {
                        $group: {
                            "_id": "group",
                            groupIds: {
                                $push: "$groupId"
                            }
                        }
                    }]);

                    if (getGroupIds && getGroupIds[0] && getGroupIds[0].groupIds) {
                        var arrayGroup = getGroupIds[0].groupIds
                        groupIdQuery = {
                            receiverId: {
                                $in: arrayGroup
                            }
                        }
                    }

                    var messageCountQuery = coachAPPINSentBOX.aggregate([{
                        $match: {
                            $or: [
                                groupIdQuery, {
                                    $or: receiverIdQuery
                                },
                                receiverIdQueryForAll
                            ],

                        }
                    }, {
                        $project: {
                            "_id": 1,
                            "messagesBox": {
                                $size: "$messagesBox"
                            }
                        }
                    }, {
                        $group: {
                            _id: null,
                            "messageCount": {
                                $sum: "$messagesBox"
                            }

                        }
                    }]);

                    var matchQuery = MatchCollectionDB.aggregate([{
                            $match: {
                                "$or": [{
                                    "matchRecords.playersID.playerAId": data.loggedInId
                                }, {
                                    "matchRecords.playersID.playerBId": data.loggedInId
                                }],
                                "matchRecords.roundNumber": 1
                            }
                        }, {
                            $group: {
                                "_id": null,
                                "matchCount": {
                                    $sum: 1
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "matchCount": 1
                            }
                        }

                    ])


                    if (messageCountQuery && messageCountQuery.length > 0) {
                        if (messageCountQuery[0].messageCount)
                            messageCount = messageCountQuery[0].messageCount;
                    }

                    if (matchQuery && matchQuery.length > 0) {
                        if (matchQuery[0].matchCount)
                            matchCount = matchQuery[0].matchCount;
                    }


                    
                    userData["userName"] = userExists.userName;
                    userData["connectionCount"] = connectionCount.length;
                    userData["messageCount"] = messageCount;
                    userData["matchCount"] = matchCount;
                    resultJson["status"] = "success";
                    resultJson["data"] = userData;

                    return resultJson;
                } else {
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Invalid user";
                    return resultJson;
                }

            } else {
                resultJson["status"] = "failure";
                resultJson["message"] = "Invalid user";
                return resultJson;
            }

        } catch (e) {

        }
    },
    "profileUpdateViaApp": async function(data) {
        try {

            var xData = data;
            var resultJson = {};
            if (typeof data == "string") {
                data = data.replace("\\", "");

                xData = JSON.parse(data);
            }


            var userInfo;
            if (xData.userId) {
                var userFound = Meteor.users.findOne({
                    "userId": xData.userId
                });
                if (userFound) {
                    if (userFound.role == "Umpire" || userFound.role == "Coach") 
                    {

                        xData.interestedDomainName = [xData.state];
                        xData.role = userFound.role;
                        var result1 = await Meteor.call("updateOtherUser", xData);
                        var result2 = await Meteor.call("updateOtherUserAddress", xData);
                        var result3 = await Meteor.call("updateOtherUserActivities", xData);

                        if (result1 || result2 || result3) {
                            var userInfo = otherUsers.findOne({
                                "userId": xData.userId
                            });

                            resultJson["status"] = "success";
                            resultJson["result"] = userInfo;
                            resultJson["response"] = "Profile Updated";
                            return resultJson;

                        }

                    } else if (userFound.role == "Player") 
                    {
                        if (xData.gender) 
                        {
                            if (xData.gender == null) {

                                var userInfo = nameToCollection(xData.userId).findOne({
                                    "userId": xData.userId
                                })
                                if (userInfo && userInfo.gender)
                                    xData.gender = userInfo.gender;
                            }
                        } else {
                            var userInfo = nameToCollection(xData.userId).findOne({
                                "userId": xData.userId
                            })
                            if (userInfo && userInfo.gender)
                                xData.gender = userInfo.gender;
                        }

                        if (xData.nationalAffiliationId) {
                            if (xData.nationalAffiliationId == null || xData.nationalAffiliationId == "") {
                                var userInfo = nameToCollection(xData.userId).findOne({
                                    "userId": xData.userId
                                })
                                if (userInfo.nationalAffiliationId)
                                    xData.nationalAffiliationId = userInfo.nationalAffiliationId;
                                else
                                    xData.nationalAffiliationId = "";
                            }
                        } else {
                            xData.nationalAffiliationId = "";
                            var userInfo = nameToCollection(xData.userId).findOne({
                                "userId": xData.userId
                            })
                            if (userInfo.nationalAffiliationId)
                                xData.nationalAffiliationId = userInfo.nationalAffiliationId;
                        }

                        var result1 = await Meteor.call("updatePlayer", xData);
                        var result2 = await Meteor.call("updatePlayerAddress", xData);

                        if (result1 || result2) 
                        {
                            var userInfo = nameToCollection(xData.userId).findOne({
                                "userId": xData.userId
                            });
                            resultJson["status"] = "success";
                            resultJson["result"] = userInfo;
                            resultJson["response"] = "Profile Updated";
                            return resultJson;

                        }
                        else
                        {
                            resultJson["status"] = "failure";
                            resultJson["result"] = "";
                            resultJson["response"] = "Could not update profile";
                            return resultJson;
                        }


                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["result"] = "";
                    resultJson["response"] = "Could not update profile";
                    return resultJson;

                }
            }

        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["result"] = "";
            resultJson["response"] = "Could not update profile"
            return resultJson;
        }
    },


})