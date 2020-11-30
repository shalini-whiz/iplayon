import {
    initDBS
}
from '../dbRequiredRole.js'

Meteor.methods({
    registerEntity: async function(data) {
        try {
            var xData = data;
            if (typeof data == "string") {
                data = data.replace("\\", "");
                xData = JSON.parse(data);
            }

            var resultJson = {};
            xData.country = "India";
            xData.affiliatedTo = "other";
            xData.interestedDomainName = [xData.state];
            if (xData.password == undefined)
                xData.password = "abcdef";
            var userAccountID;
            var apiSource = "";
            var apiKey;
            if(apiKey == undefined){
                apiKey = "11EvenSports"
            }
            var apiInfo = apiUsers.findOne({
                "apiKey": apiKey
            });

            if (apiInfo) {
                if (apiInfo.source){
                    apiSource = apiInfo.source
                }
            }

            if (xData.role == "School") {
                var checkSchoolAbb = schoolDetails.findOne({
                    abbrevation: xData.abbrevation.toUpperCase()
                });
                if (checkSchoolAbb) {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = "";
                    resultJson["response"] = "School already exists with the mentioned schoolID/abbreviation"
                    resultJson["message"] = resultJson["response"]
                    return resultJson;
                }
            }

            var userAccountID;
            var res = false

            if (xData.regId == undefined || xData.regId == null) {
                try{
                    var resValid = await Meteor.call("registerValidationGeneralized", xData);
                    if (resValid && resValid.response == 0 && resValid.playerID) {
                        userAccountID = resValid.playerID
                        res = true
                    }
                    else if(resValid && resValid.response && resValid.response == 1)
                    {
                        resultJson["status"] = "failure"
                        resultJson["resultID"] = "";
                        resultJson["response"] = "Already user exists with the mentioned EmailID"
                        resultJson["message"] = resultJson["response"]
                        return resultJson;
                    } 
                    else if(resValid && resValid.response && resValid.response == 2)
                    {
                        resultJson["status"] = "failure"
                        resultJson["resultID"] = "";
                        resultJson["response"] = "Already user exists with the mentioned phone number"
                        resultJson["message"] = resultJson["response"]
                        return resultJson;
                    } 
                    else {
                        resultJson = resValid
                        resultJson["resultID"] = "";

                        
                    }
                }catch(e){

                }
            } else {
                userAccountID = xData.regId
                res = true
            }


            if (res == false) {
                resultJson["status"] = "failure"
                resultJson["resultID"] = "";
                resultJson["response"] = "Cannot Register"
                resultJson["message"] = resultJson["response"]
            } else {
                if (userAccountID) {
                    if (xData.contactPerson == null)
                        xData.contactPerson = "";

                    if (xData.userName == null)
                        xData.userName = xData.contactPerson

                    xData.interestedProjectName = "";

                    if (xData.interestedSport && xData.interestedSport != null) {
                        xData.interestedProjectName = xData.interestedSport;
                    }
                    else{
                        xData.interestedProjectName = "QvHXDftiwsnc8gyfJ"
                    }

                    var dbInsert;

                    if (xData.role.toLowerCase() == "school"){
                        dbInsert = schoolDetails.insert({
                            userId: userAccountID,
                            emailAddress: xData.emailAddress,
                            interestedDomainName: xData.interestedDomainName,
                            interestedSubDomain1Name: [""],
                            interestedSubDomain2Name: [""],
                            profileSettingStatus: true,
                            schoolName: xData.userName,
                            phoneNumber: xData.phoneNumber,
                            interestedProjectName: [xData.interestedProjectName],
                            role: xData.role,
                            contactPerson: xData.contactPerson,
                            address: xData.address,
                            city: xData.city,
                            pinCode: xData.pinCode,
                            state: xData.state,
                            country: xData.country,
                            abbrevation: xData.abbrevation.toUpperCase(),
                            statusOfUser: "Active",
                            year: new Date().getFullYear(),
                            affiliatedTo: xData.affiliatedTo,
                            landline: xData.landline,
                        });
                    }
                    else if (xData.role == "Academy"){
                        dbInsert = academyDetails.insert({
                            userId: userAccountID,
                            emailAddress: xData.emailAddress,
                            interestedDomainName: xData.interestedDomainName,
                            interestedProjectName: [xData.interestedProjectName],
                            interestedSubDomain1Name: [""],
                            interestedSubDomain2Name: [""],
                            profileSettingStatus: true,
                            clubName: xData.userName,
                            phoneNumber: xData.phoneNumber,
                            associationId: 'other',
                            role: xData.role,
                            contactPerson: xData.contactPerson,
                            address: xData.address,
                            city: xData.city,
                            pinCode: xData.pinCode,
                            state: xData.state,
                            country: xData.country,
                            abbrevationAcademy: xData.abbrevation.toUpperCase(),
                            statusOfUser: "Active",
                            year: new Date().getFullYear(),
                            affiliatedTo: "other"
                        });
                    }

                    if (dbInsert) {
                        var profileUpdate = Meteor.users.update({
                            "_id": userAccountID
                        }, {
                            $set: {
                                userId: userAccountID,
                                profileSettingStatus: true,
                                role: xData.role,
                                interestedProjectName: [xData.interestedProjectName],
                                userName: xData.userName,
                                emailAddress: xData.emailAddress,
                                "source": apiSource,
                                "verifiedBy":["email"]
                            }
                        });

                        resultJson["status"] = "success"
                        resultJson["resultID"] = userAccountID;
                        resultJson["response"] = xData.role + " created"
                        resultJson["message"] = resultJson["response"]
                        return resultJson;

                    } else {
                        var removeSchool = Meteor.users.remove({
                            "_id": userAccountID
                        })
                        if (xData.role == "School")
                            var removeSchoolDetails = schoolDetails.remove({
                                "userId": userAccountID
                            })
                        if (xData.role == "Academy")
                            var removeAcademyDetails = academyDetails.remove({
                                "userId": userAccountID
                            })

                        resultJson["status"] = "failure"
                        resultJson["resultID"] = "";
                        resultJson["response"] = "Could not create " + xData.role
                        resultJson["message"] = resultJson["response"]
                        return resultJson;
                    }
                }
            }

            return resultJson;

        } catch (e) {
            var removeUser = Meteor.users.remove({
                "_id": userAccountID
            })
            if (xData.role == "School")
                var removeSchoolDetails = schoolDetails.remove({
                    "userId": userAccountID
                })
            if (xData.role == "Academy")
                var removeAcademyDetails = academyDetails.remove({
                    "userId": userAccountID
                })
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Could not create " + xData.role;
            resultJson["message"] = resultJson["response"]
            return resultJson;
        }
    },
    "schoolAbbrevationDuplicates": function(abbName) {
        var findWho = schoolDetails.findOne({
            'abbrevation': abbName.toUpperCase()
        });
        if (findWho) {
            return findWho
        } else return undefined
    },
    "associationList_school": function(stateId) {
        try {
            var result = associationDetails.find({
                "state": stateId,
                "associationType": "State/Province/County"
            }, {
                "userId": 1,
                "associationName": 1
            }).fetch();
            return result;
        } catch (e) {}
    },
    "schoolAbbrevationList": function() {
        try {
            var raw = schoolDetails.rawCollection();
            var distinct = Meteor.wrapAsync(raw.distinct, raw);
            var result = distinct('abbrevation');
            var json = {};
            json["abbreviations"] = result;
            return json;
        } catch (e) {}
    },

    "editSchool": function(data) {
        var dbsrequiredAll = initDBS("dbsrequiredAll")
        var roles = initDBS("roles")
        var indexToSkip = initDBS("indexToSkip")
        var indicesOfPlayers = initDBS("indicesOfPlayers")

        data = data.replace("\\", "");
        var xData = JSON.parse(data);
        var resultJson = {};
        try {
            var schoolInfo = schoolDetails.findOne({
                "userId": xData.userId
            })
            if (schoolInfo) 
            {
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
                    resultJson["response"] = "User already exists with the "+xData.phoneNumber
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
                                resultJson["response"] = "User already exists with the "+xData.phoneNumber
                                return resultJson;
                            }
                        }
                    }
                }
               

            }

                var schoolUpdate = schoolDetails.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        schoolName: xData.userName,
                        contactPerson: xData.contactPerson,
                        phoneNumber: xData.phoneNumber,
                        landline: xData.landline,
                        address: xData.address,
                        city: xData.city,
                        state: xData.state,
                        pinCode: xData.pinCode,
                        interestedDomainName: [xData.state],
                    }
                });

                var userUpdate = Meteor.users.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        userName: xData.userName
                    }
                })

                var teamSchoolUpdate = schoolTeams.update({
                    "schoolId": xData.userId
                }, {
                    $set: {
                        schoolName: xData.userName
                    }
                }, {
                    multi: true
                })

                if (schoolUpdate) 
                {
                    var schoolInfo = schoolDetails.findOne({
                        "userId": xData.userId
                    })

                    resultJson["status"] = "success"
                    resultJson["resultID"] = schoolInfo;
                    resultJson["response"] = "School updated";
                    return resultJson;
                } else {
                    resultJson["status"] = "failure"
                    resultJson["resultID"] = xData.userId;
                    resultJson["response"] = "Could not update school";
                    return resultJson;
                }

            } else {
                resultJson["status"] = "failure"
                resultJson["resultID"] = xData.userId;
                resultJson["response"] = "Invalid data";
                return resultJson;
            }

        } catch (e) {
            resultJson["status"] = "failure"
            resultJson["resultID"] = "";
            resultJson["response"] = "Could not update school";
            return resultJson;
        }
    }

});