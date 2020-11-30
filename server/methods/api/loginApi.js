import {
    Accounts
}
from 'meteor/accounts-base';
import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';

import {
    emailRegex
}
from '../dbRequiredRole.js'
import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({

    
    

   
    

    
    // **emailaddress**
    "updateProfile": function(data) {
        try {
            data = data.replace("\\", "");
            var resultJson = {};
            var xData = JSON.parse(data);
            var userInfo;
            var userStatus;
            if (xData.emailAddress) {
                var userFound = Meteor.users.findOne({
                    "emails.address": xData.emailAddress
                });
                if (userFound) {
                    if (userFound.role) {
                        if (userFound.role == "Player") {
                            if(nameToCollection(userFound.userId))
                            {
                                userStatus = nameToCollection(userFound.userId).update({
                                    "emailAddress": xData.emailAddress
                                }, {
                                    $set: {
                                        userName: xData.userName,
                                        guardianName: xData.contactPerson,
                                        phoneNumber: xData.phoneNumber,
                                        gender: xData.gender,
                                        dateOfBirth: moment(new Date(xData.dateParam)).format("DD MMM YYYY"),
                                        interestedDomainName: xData.interestedDomainName,
                                        address: xData.address,
                                        city: xData.city,
                                        state: xData.state,
                                        pinCode: xData.pinCode
                                    }
                                }); 
                                if(userStatus)
                                {
                                    var userUpdate = Meteor.users.update({
                                        "emailAddress": xData.emailAddress
                                    }, {
                                        $set: {
                                            userName: xData.userName,
                                            interestedProjectName: xData.interestedProjectName
                                        }
                                    }); 
                                }
                            }

                            

                           
                        } else if (userFound.role == "Academy") {
                            userStatus = academyDetails.update({
                                "emailAddress": xData.emailAddress
                            }, {
                                $set: {
                                    clubName: xData.userName,
                                    contactPerson: xData.contactPerson,
                                    phoneNumber: xData.phoneNumber,
                                    dateOfInc: moment(new Date(xData.dateParam)).format("DD MMM YYYY"),
                                    abbrevationAcademy: xData.abbrevation,
                                    address: xData.address,
                                    city: xData.city,
                                    state: xData.state,
                                    pinCode: xData.pinCode,
                                    interestedDomainName: xData.interestedDomainName,

                                }
                            });

                            var userAcademyUpdate = Meteor.users.update({
                                "emailAddress": xData.emailAddress
                            }, {
                                $set: {
                                    userName: xData.userName
                                }
                            });

                        } else if (userFound.role == "Association") {
                            userStatus = associationDetails.update({
                                "emailAddress": xData.emailAddress
                            }, {
                                $set: {
                                    associationName: xData.userName,
                                    contactPerson: xData.contactPerson,
                                    phoneNumber: xData.phoneNumber,
                                    dateOfInc: moment(new Date(xData.dateParam)).format("DD MMM YYYY"),
                                    abbrevationAssociation: xData.abbrevation,
                                    address: xData.address,
                                    city: xData.city,
                                    state: xData.state,
                                    pinCode: xData.pinCode
                                }
                            });

                            var userAssociationUpdate = Meteor.users.update({
                                "emailAddress": xData.emailAddress
                            }, {
                                $set: {
                                    userName: xData.userName
                                }
                            });


                        } else if (userFound.role == "School") {
                            userStatus = schoolDetails.update({
                                "emailAddress": xData.emailAddress
                            }, {
                                $set: {
                                    schoolName: xData.userName,
                                    contactPerson: xData.contactPerson,
                                    phoneNumber: xData.phoneNumber,
                                    dateOfInc: moment(new Date(xData.dateParam)).format("DD MMM YYYY"),
                                    abbrevationAcademy: xData.abbrevation,
                                    address: xData.address,
                                    city: xData.city,
                                    state: xData.state,
                                    pinCode: xData.pinCode,
                                    interestedDomainName: xData.interestedDomainName,

                                }
                            });

                            var userSchoolUpdate = Meteor.users.update({
                                "emailAddress": xData.emailAddress
                            }, {
                                $set: {
                                    userName: xData.userName
                                }
                            });
                        } else if (userFound.role == "Coach" || userFound.role == "Umpire" || userFound.role == "Organiser" || userFound.role == "Journalist" || userFound.role == "Other") {

                            userStatus = otherUsers.update({
                                "emailAddress": xData.emailAddress
                            }, {
                                $set: {
                                    userName: xData.userName,
                                    guardianName: xData.contactPerson,
                                    phoneNumber: xData.phoneNumber,
                                    gender: xData.gender,
                                    dateOfBirth: moment(new Date(xData.dateParam)).format("DD MMM YYYY"),
                                    interestedDomainName: xData.interestedDomainName,
                                    address: xData.address,
                                    city: xData.city,
                                    state: xData.state,
                                    pinCode: xData.pinCode
                                }
                            });
                            var userUpdate = Meteor.users.update({
                                "emailAddress": xData.emailAddress
                            }, {
                                $set: {
                                    userName: xData.userName,
                                    interestedProjectName: xData.interestedProjectName
                                }
                            });
                        }

                    }
                }
            }
            if (userStatus) {
                resultJson["status"] = "success";
                resultJson["result"] = "";
                resultJson["response"] = "Profile Updated"
            } else {
                resultJson["status"] = "failure";
                resultJson["result"] = "";
                resultJson["response"] = "Could not update profile"
            }
            return resultJson;
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["result"] = "";
            resultJson["response"] = "Could not update profile"
            return resultJson;
        }
    },

    //option to check if player is been set with dob and gender
    checkForLoginDetails: function(userId) {
        try {
            var resultJson = {};

            var userInfo = nameToCollection(userId).findOne({
                "userId": userId
            });
            if (userInfo) {
                if (userInfo.gender && userInfo.dateOfBirth) {
                    if (userInfo.gender != "" && userInfo.dateOfBirth != "" && userInfo.gender != null && userInfo.dateOfBirth != null) {
                        resultJson["status"] = "success";
                        resultJson["gender"] = userInfo.gender;
                        resultJson["dob"] = userInfo.dateOfBirth;
                        resultJson["profile"] = userInfo;
                    } else {
                        resultJson["status"] = "failure";
                        resultJson["profile"] = userInfo;


                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["profile"] = userInfo;

                }

            } else {
                resultJson["status"] = "error";
                resultJson["message"] = "User not found"
            }
            return resultJson;
        } catch (e) {}
    },

    //if player dob unset, option to capture dob and update his profile
    updateLoginDetails: function(data) {
        try {
            data = data.replace("\\", "");
            var resultJson = {};
            var xData = JSON.parse(data);
            //interestedDomainName
            var raw = tournamentEvents.rawCollection();
            var distinct = Meteor.wrapAsync(raw.distinct, raw);
            var interestedProjectNameList = distinct('_id');

            var raw = domains.rawCollection();
            var distinct = Meteor.wrapAsync(raw.distinct, raw);
            var interestedDomainNameList = distinct('_id');

            if(nameToCollection(xData.userId))
            {
                nameToCollection(xData.userId).update({
                    "userId": xData.userId
                    }, {
                        $set: {
                            "gender": xData.gender,
                            "dateOfBirth": moment(new Date(xData.dob)).format("DD MMM YYYY"),
                            "interestedProjectName": interestedProjectNameList,
                            "interestedDomainName": interestedDomainNameList
                        }
                });

                Meteor.users.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        "interestedProjectName": interestedProjectNameList
                    }
                })

                var userInfo = nameToCollection(xData.userId).findOne({
                    "userId": xData.userId
                });
                if (userInfo)
                    return userInfo;
            }


           

            

        } catch (e) {

        }
    },
    //if player sport/domain unset, option to set default sport and domain and update his profile
    updateDomainDetails: function(userId) {
        try {
            var playerInfo = undefined;
            if(nameToCollection(userId))
            var playerInfo = nameToCollection(userId).findOne({
                "userId": userId
            })
            if (playerInfo && playerInfo != undefined) 
            {
                if (playerInfo.interestedProjectName && playerInfo.interestedProjectName.length > 0) {
                    if (playerInfo.interestedProjectName[0] == null || playerInfo.interestedProjectName[0] == "") {
                        var raw = tournamentEvents.rawCollection();
                        var distinct = Meteor.wrapAsync(raw.distinct, raw);
                        var interestedProjectNameList = distinct('_id');

                        var raw = domains.rawCollection();
                        var distinct = Meteor.wrapAsync(raw.distinct, raw);
                        var interestedDomainNameList = distinct('_id');


                        nameToCollection(userId).update({
                            "userId": userId
                        }, {
                            $set: {
                                "interestedProjectName": interestedProjectNameList,
                                "interestedDomainName": interestedDomainNameList
                            }
                        })

                        Meteor.users.update({
                            "userId": userId
                        }, {
                            $set: {
                                "interestedProjectName": interestedProjectNameList
                            }
                        })
                    }
                }
            }
        } catch (e) {

        }
    },

    
});