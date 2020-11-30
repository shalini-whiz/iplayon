import {
    initDBS
}
from '../dbRequiredRole.js'

import {
    emailRegex
}
from '../dbRequiredRole.js'
//userDetailsTTUsed

Meteor.methods({
    "addSchoolCoach": function(data) {
        try {
            var dbsrequiredAll = initDBS("dbsrequiredAll")
            var roles = initDBS("roles")
            var indexToSkip = initDBS("indexToSkip")
            var indicesOfPlayers = initDBS("indicesOfPlayers")

            var resultJson = {};
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            var schoolInfo = schoolDetails.findOne({
                "userId": xData.schoolID,
                "coachId": {
                    $elemMatch: {
                        "userName": {
                            $regex: new RegExp(xData.userName, "i")
                        },
                        "gender": xData.gender,
                        "phoneNumber": xData.phoneNumber
                    }
                }
            });

            if (schoolInfo) {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Coach already exists"
                return resultJson;
            } else {
                var coachInsert = schoolDetails.update({
                    "userId": xData.schoolID
                }, {
                    $addToSet: {
                        "coachId": {
                            "userName": xData.userName,
                            "gender": xData.gender,
                            "phoneNumber": xData.phoneNumber
                        }
                    }
                });

                resultJson["status"] = "success"
                resultJson["resultID"] = "";
                resultJson["response"] = "Coach created"
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
        }
    },
    "editSchoolCoach": function(data) {
        try {
            var resultJson = {};
            data = data.replace("\\", "");
            var xData = JSON.parse(data);

            if (xData.oldUserName == xData.userName && xData.oldPhoneNumber == xData.phoneNumber && xData.oldGender == xData.gender) {
                resultJson["status"] = "success"
                resultJson["resultID"] = "";
                resultJson["response"] = "Coach updated"
                return resultJson;
            }
            var schoolInfo = schoolDetails.findOne({
                "userId": xData.schoolID,
                "coachId": {
                    $elemMatch: {
                        "userName": {
                            $regex: new RegExp(xData.oldUserName, "i")
                        },
                        "gender": xData.oldGender,
                        "phoneNumber": xData.oldPhoneNumber
                    }
                }
            });
            if (schoolInfo) {

                var checkSchoolCoach = schoolDetails.findOne({
                    "userId": xData.schoolID,
                    "coachId": {
                        $elemMatch: {
                            "userName": {
                                $regex: new RegExp(xData.userName, "i")
                            },
                            "gender": xData.gender,
                            "phoneNumber": xData.phoneNumber
                        }
                    }
                });

                if (checkSchoolCoach == undefined) {
                    schoolDetails.update({
                        "userId": xData.schoolID
                    }, {
                        $pull: {
                            "coachId": {
                                "userName": xData.oldUserName,
                                "gender": xData.oldGender,
                                "phoneNumber": xData.oldPhoneNumber
                            }
                        }
                    });

                    schoolDetails.update({
                        "userId": xData.schoolID
                    }, {
                        $addToSet: {
                            "coachId": {
                                "userName": xData.userName,
                                "gender": xData.gender,
                                "phoneNumber": xData.phoneNumber
                            }
                        }
                    });

                    resultJson["status"] = "success"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Coach updated"
                    return resultJson;
                } else {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Already Coach exists with the same profile!!"
                    return resultJson;
                }

            } else {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid data"
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
        }
    },
    "deleteSchoolCoach": function(data) {
        try {
            var resultJson = {};
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            var schoolInfo = schoolDetails.findOne({
                "userId": xData.schoolID,
                "coachId": {
                    $elemMatch: {
                        "userName": xData.userName,
                        "gender": xData.gender
                    }
                }
            });
            if (schoolInfo) {
                schoolDetails.update({
                    "userId": xData.schoolID
                }, {
                    $pull: {
                        "coachId": {
                            "userName": xData.userName,
                            "gender": xData.gender,
                            "phoneNumber": xData.phoneNumber
                        }
                    }
                });

                resultJson["status"] = "success"
                resultJson["resultID"] = "";
                resultJson["response"] = "Coach removed"
                return resultJson;
            } else {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid data"
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
        }
    },
    "getCoachesList": function(data) {
        try {
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            var resultJson = {};
            var schoolDetailInfo = schoolDetails.findOne({
                "userId": xData.schoolID
            });
            if (schoolDetailInfo) {
                resultJson["status"] = "success"
                resultJson["resultID"] = schoolDetailInfo.coachId;
                resultJson["response"] = "Coach Details"
                return resultJson;
            } else {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid data"
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid data"
            return resultJson;
        }
    },
    addSchoolPlayer: function(data, apiKey) {
        try {

            var dbsrequiredAll = initDBS("dbsrequiredAll")
            var roles = initDBS("roles")
            var indexToSkip = initDBS("indexToSkip")
            var indicesOfPlayers = initDBS("indicesOfPlayers")
            
            data = data.replace("\\", "");
            var resultJson = {};
            var xData = JSON.parse(data);
            var checkInfo
            var emaPh = 0
            var checkPhone 
            
            if(xData.year){
                if (xData.emailAddress == null || xData.emailAddress == undefined) {
                    xData.emailAddress = ""
                }
                if (xData.phoneNumber == null || xData.emailAddress == undefined) {
                    xData.phoneNumber = ""
                }

                if (xData.emailAddress.length != 0) {
                    checkInfo = Meteor.users.findOne({
                            $or: [{
                                "emailAddress": {
                                    $regex: emailRegex(xData.emailAddress)
                                },
                                "emails.0.address": {
                                    $regex: emailRegex(xData.emailAddress)
                                }
                            }]
                        });
                    if (checkInfo) {
                        emaPh = xData.emailAddress
                    } else {
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i]) {
                                var ind = i
                                if (ind > parseInt(indexToSkip)) {
                                    ind = parseInt(indexToSkip + 1)
                                }
                                checkInfo = global[dbsrequiredAll[ind]].findOne({
                                    "emailAddress": {
                                        $regex: emailRegex(xData.emailAddress)
                                    }
                                })
                                if (checkInfo) {
                                    emaPh = xData.emailAddress
                                    break;
                                }
                            }
                        }
                    }
                }

                if (xData.phoneNumber.length != 0) {
                    checkPhone = Meteor.users.findOne({
                        "phoneNumber": xData.phoneNumber

                    })
                    if (checkPhone) {
                        emaPh = xData.phoneNumber
                    } else {
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i]) {
                                var ind = i
                                if (ind > parseInt(indexToSkip)) {
                                    ind = parseInt(indexToSkip + 1)
                                }
                                checkPhone = global[dbsrequiredAll[ind]].findOne({
                                    "phoneNumber": xData.phoneNumber,
                                })
                                if (checkPhone) {
                                    emaPh = xData.phoneNumber
                                    break;
                                }
                            }
                        }
                    }
                }

                if (checkInfo || checkPhone) {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "User already exists with " + emaPh
                    return resultJson;
                }



                if ((checkInfo == undefined || checkInfo == null) && (checkPhone == null || checkPhone == undefined)) {
                    var apiSource = "";
                    var apiInfo = apiUsers.findOne({
                        "apiKey": apiKey
                    });
                    if (apiInfo) {
                        if (apiInfo.source)
                            apiSource = apiInfo.source
                    }

                    var schoolDetailsInfo = schoolDetails.findOne({
                        "userId": xData.schoolID
                    });
                    if (schoolDetailsInfo) {
                        xData.interestedProjectName = schoolDetailsInfo.interestedProjectName[0];
                        xData.interestedDomainName = [schoolDetailsInfo.state];
                        xData.state = schoolDetailsInfo.state;
                    }

                    var dataCheck = true;
                    var playerRegObj = new RegExp(xData.userName, 'i');
                    var birthDate = moment(new Date(xData.dateOfBirth)).format("YYYY-MM-DD");
                    var userInfo = schoolPlayers.findOne({
                        "userName": {
                            $regex: playerRegObj
                        }
                    })
                    if (userInfo) {
                        if (moment(userInfo.dateOfBirth).format("YYYY-MM-DD") == moment(new Date(xData.dateOfBirth)).format("YYYY-MM-DD")) {
                            dataCheck = false;
                        }
                    }

                    if (userInfo == undefined || (userInfo && dataCheck == true)) {

                        xData.country = "India";
                        xData.playerSource = apiSource;
                        xData.dateOfBirth = birthDate;

                        var playerID;

                        playerID = Meteor.users.insert({
                            userName: xData.userName.trim(),
                            emailAddress:xData.emailAddress
                        });
                        if (playerID) {

                            if (xData.userName == null)
                                xData.userName = xData.contactPerson
                            if (xData.contactPerson == null)
                                xData.contactPerson = "";
                            if (xData.interestedDomainName == null)
                                xData.interestedDomainName = [""];
                            if (xData.address == null)
                                xData.address = "";
                            if (xData.emailAddress == null)
                                xData.emailAddress = "";
                            if (xData.phoneNumber == null)
                                xData.phoneNumber = "";


                            var tmpAffilationID = "TMP1";
                            var tempAffIDInfo = lastInsertedAffId.findOne({
                                "assocId": "Temp"
                            });
                            if (tempAffIDInfo) {
                                tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                                tmpAffilationID = "TMP" + tempAffIDInfo.lastInsertedId;
                            }

                            var userDetailsTT_player = schoolPlayers.insert({
                                userId: playerID,
                                emailAddress: xData.emailAddress,
                                interestedDomainName: xData.interestedDomainName,
                                interestedProjectName: [xData.interestedProjectName],
                                interestedSubDomain1Name: [""],
                                interestedSubDomain2Name: [""],
                                profileSettingStatus: true,
                                userName: xData.userName.trim(),
                                phoneNumber: xData.phoneNumber,
                                dateOfBirth: xData.dateOfBirth,
                                role: "Player",
                                gender: xData.gender,
                                contactPerson: xData.contactPerson,
                                address: xData.address,
                                city: xData.city,
                                pinCode: xData.pinCode,
                                guardianName: xData.guardianName,
                                address: xData.address,
                                state: xData.state,
                                country: xData.country,
                                statusOfUser: "Active",
                                year: xData.year,
                                affiliatedTo: "school",
                                tempAffiliationId: tmpAffilationID,
                                source: xData.playerSource,
                                schoolId: xData.schoolID,
                                "class": xData.class
                            });


                            if (userDetailsTT_player) {
                                var profileUpdate = Meteor.users.update({
                                    "_id": playerID
                                }, {
                                    $set: {
                                        userId: playerID,
                                        profileSettingStatus: true,
                                        role: "Player",
                                        interestedProjectName: [xData.interestedProjectName],
                                        userName: xData.userName.trim(),
                                        emailAddress: xData.emailAddress,
                                        "source": apiSource,
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

                                var playerCategoryInfo = playerCategory.findOne({
                                    "category": xData.category,
                                    "schoolId": xData.schoolID
                                });
                                if (playerCategoryInfo)
                                    playerCategory.update({
                                        "category": xData.category,
                                        "schoolId": xData.schoolID
                                    }, {
                                        $addToSet: {
                                            "userId": playerID
                                        }
                                    });
                                else
                                    playerCategory.insert({
                                        "category": xData.category,
                                        "schoolId": xData.schoolID,
                                        "userId": [playerID],
                                        "year":xData.year
                                    });

                                schoolDetails.update({
                                    "userId": xData.schoolID
                                }, {
                                    $addToSet: {
                                        "playerId": {
                                            "studentID": playerID,
                                            "class": xData.class
                                        }
                                    }
                                });
                                resultJson["status"] = "success"
                                resultJson["resultID"] = playerID;
                                resultJson["response"] = "Player created"
                                return resultJson;
                            } else {
                                var removePlayer = Meteor.users.remove({
                                    "_id": playerID
                                });
                                var playerCategoryInfo = playerCategory.findOne({
                                    "category": xData.category,
                                    "schoolId": xData.schoolID
                                });
                                if (playerCategoryInfo)
                                    playerCategory.update({
                                        "category": xData.category,
                                        "schoolId": xData.schoolID
                                    }, {
                                        $pull: {
                                            "userId": playerID
                                        }
                                    });


                                resultJson["status"] = "failure"
                                resultJson["resultID"] = "";
                                resultJson["response"] = "Could not create player1"
                                return resultJson;

                            }
                        }
                    } else {
                        resultJson["status"] = "failure"
                        resultJson["resultID"] = "";
                        resultJson["response"] = "Duplicated user found"
                        return resultJson
                    }
                }

            }else{
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Could not create player, year is required"
                return resultJson;
            }

        } catch (e) {
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Could not create player"
            return resultJson;
        }
    },
    // **emailaddress**
    editSchoolPlayer: function(data) {
        try {
            var dbsrequiredAll = initDBS("dbsrequiredAll")
            var roles = initDBS("roles")
            var indexToSkip = initDBS("indexToSkip")
            var indicesOfPlayers = initDBS("indicesOfPlayers")

            var resultJson = {};
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            var checkInfo;

            if (xData.address == null)
                xData.address = "";


            var dataCheck = false;
            var playerRegObj = new RegExp(xData.userName, 'i');
            var birthDate = moment(new Date(xData.dateOfBirth)).format("YYYY-MM-DD");

            if (xData.emailAddress != "" && xData.emailAddress != null && xData.emailAddress != undefined) {

               
                checkInfo = Meteor.users.findOne({
                        $or: [{
                            "emailAddress": {
                                $regex: emailRegex(xData.emailAddress)
                            },
                            "emails.0.address": {
                                $regex: emailRegex(xData.emailAddress)
                            }
                        }],
                        "userId": {
                            $nin: [xData.userId]
                        }
                    });
                if (checkInfo) {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Player already exists with the registered mailID"
                    return resultJson;
                }
                else {
                    for (var i = 0; i < roles.length; i++) {
                        if (roles[i]) {
                            var ind = i
                            if (ind > parseInt(indexToSkip)) {
                                ind = parseInt(indexToSkip + 1)
                            }
                            checkInfo = global[dbsrequiredAll[ind]].findOne({
                                "emailAddress": {
                                    $regex: emailRegex(xData.emailAddress)
                                },
                                "userId": {
                                    $nin: [xData.userId]
                                }
                            })

                            if (checkInfo) {
                                resultJson["status"] = "failure"
                                resultJson["resultID"] = "";
                                resultJson["response"] = "Player already exists with the registered mailID"
                                return resultJson;                            
                            }
                        }
                    }
                }

            }

            if (xData.phoneNumber.length != 0 && 
                xData.phoneNumber != "" && 
                xData.phoneNumber != null && 
                xData.phoneNumber != undefined) 
            {

                checkPhone = Meteor.users.findOne({
                    "phoneNumber": xData.phoneNumber,
                    "userId": {
                        $nin: [xData.userId]
                    }

                })
                if (checkPhone) {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Player already exists with the "+xData.phoneNumber
                    return resultJson;
                }
                 else {
                    for (var i = 0; i < roles.length; i++) {
                        if (roles[i]) {
                            var ind = i
                            if (ind > parseInt(indexToSkip)) {
                                ind = parseInt(indexToSkip + 1)
                            }
                            checkPhone = global[dbsrequiredAll[ind]].findOne({
                                "phoneNumber": xData.phoneNumber,
                                "userId": {
                                    $nin: [xData.userId]
                                }
                            })

                            if (checkPhone) {

                                resultJson["status"] = "failure"
                                resultJson["resultID"] = "";
                                resultJson["response"] = "Player already exists with the "+xData.phoneNumber
                                return resultJson;
                            }
                        }
                    }
                }
               

            }

            


            var userInfo = schoolPlayers.findOne({
                "userName": xData.userName,
                "userId": {
                    $nin: [xData.userId]
                }
            })


            if (userInfo) {
                if (moment(userInfo.dateOfBirth).format("YYYY-MM-DD") == moment(new Date(xData.dateOfBirth)).format("YYYY-MM-DD"))
                    dataCheck = false;
                else
                    dataCheck = true;

            }
            if (userInfo == undefined || (userInfo && dataCheck == true)) {
                var tempCache = schoolPlayers.findOne({
                    "userId": xData.userId
                });
                if (tempCache) {
                    var playerUpdate = schoolPlayers.update({
                        "userId": xData.userId,
                    }, {
                        $set: {
                            userName: xData.userName,
                            dateOfBirth: birthDate,
                            gender: xData.gender,
                            guardianName: xData.guardianName,
                            address: xData.address,
                            "class": xData.class,
                        }
                    });

                    if (xData.emailAddress != "" || xData.emailAddress != null || xData.emailAddress != undefined) {
                        if (xData.emailAddress.trim() != "") {
                            var playerUpdate = schoolPlayers.update({
                                "userId": xData.userId
                            }, {
                                $set: {
                                    emailAddress: xData.emailAddress
                                }
                            });
                        }

                    }
                    if (xData.phoneNumber != "" || xData.phoneNumber != null || xData.phoneNumber != undefined) {
                        if (xData.phoneNumber.trim() != "")
                            var playerUpdate = schoolPlayers.update({
                                "userId": xData.userId
                            }, {
                                $set: {
                                    phoneNumber: xData.phoneNumber
                                }
                            });
                    }
                    if (xData.city != "" || xData.city != null || xData.city != undefined) {
                        if (xData.city.trim() != "")
                            var playerUpdate = schoolPlayers.update({
                                "userId": xData.userId
                            }, {
                                $set: {
                                    city: xData.city
                                }
                            });
                    }
                    if (xData.pinCode != "" || xData.pinCode != null || xData.pinCode != undefined) {
                        if (xData.pinCode.trim() != "")
                            var playerUpdate = schoolPlayers.update({
                                "userId": xData.userId
                            }, {
                                $set: {
                                    pinCode: xData.pinCode
                                }
                            });
                    }


                    var userUpdate = Meteor.users.update({
                        "userId": xData.userId
                    }, {
                        $set: {
                            userName: xData.userName
                        }
                    });

                    schoolDetails.update({
                        "userId": xData.schoolID
                    }, {
                        $pull: {
                            "playerId": {
                                "studentID": xData.userId
                            }
                        }
                    });

                    schoolDetails.update({
                        "userId": xData.schoolID
                    }, {
                        $addToSet: {
                            "playerId": {
                                "studentID": xData.userId,
                                "class": xData.class
                            }
                        }
                    });

                    resultJson["status"] = "success"
                    resultJson["resultID"] = xData.userId;
                    resultJson["response"] = "Player updated"
                    return resultJson;
                } else {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Could not update player"
                    return resultJson
                }
            } else if (userInfo && (dataCheck == false)) {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Player already exists with the same Name and DOB"
                return resultJson
            } else {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Could not update player"
                return resultJson
            }

        } catch (e) {
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Could not update player"
            return resultJson
        }
    },
    deleteSchoolPlayer: function(xData) {
        try {
            var resultJson = {};
            var xData = xData
            var userDetailsInfo = schoolPlayers.findOne({
                "userId": xData.playerID
            });
            if (userDetailsInfo) {
                var result = schoolDetails.update({
                    "userId": xData.schoolID
                }, {
                    $pull: {
                        "playerId": {
                            "studentID": xData.playerID
                        }
                    }
                })
                if (result) {
                    Meteor.users.remove({
                        "userId": xData.playerID
                    });
                    schoolPlayers.remove({
                        "userId": xData.playerID
                    });
                    if (xData.category) {
                        playerCategory.update({
                            "category": xData.category,
                            "schoolId": xData.schoolID
                        }, {
                            $pull: {
                                "userId": xData.playerID
                            }
                        });
                    }

                    return "0"
                }
            } else {

                return "Invalid data";
            }

        } catch (e) {

            return "Player not removed";
        }
    },
    deleteSchoolPlayer_NoTeam: async function(data) {
        try {
            var resultJson = {};
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            try{
                var result = await Meteor.call("deleteSchoolPlayer", xData);
                if (result == "0") {
                    resultJson["status"] = "success"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Player removed"
                } else if (result == "Invalid data") {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Invalid data"
                } else if (result == "Player not removed") {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "Player not removed"
                }
            }catch(e){
                
            }
            return resultJson;
        } catch (e) {

        }
    },


    fetchSchoolPlayerDetails: function(data) {
        try {
            var resultJson = {};
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            var userDetailsInfo = schoolPlayers.findOne({
                "userId": xData.playerID
            });
            if (userDetailsInfo) {
                resultJson["status"] = "success"
                resultJson["resultID"] = userDetailsInfo;
                resultJson["response"] = "Player fetched";
                return resultJson;
            } else {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Invalid Player ";
                return resultJson;
            }

        } catch (e) {
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Invalid Player ";
            return resultJson;
        }
    },
});