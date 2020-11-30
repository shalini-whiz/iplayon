import {nameToCollection} from '../dbRequiredRole.js'
import {
    playerDBFind
}
from '../dbRequiredRole.js'
//userDetailsTTUsed

Meteor.methods({
    registerPlayer: async function(xData) {
        try {
            var playerID;
            var res = false

            if (xData.regId == undefined || xData.regId == null) {
                var resValid = await Meteor.call("registerValidationGeneralized", xData)
                try {
                    if (resValid && resValid.response == 0 && resValid.playerID) {
                        playerID = resValid.playerID
                        res = true
                    } else {
                       res = false
                    }
                }catch(e){}
            }
            else{
                playerID = xData.regId
                res = true
            }

            if (res) {
                if (playerID) {
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
                    if (xData.userName == null) {
                        xData.userName = xData.contactPerson
                    }
                    if (xData.contactPerson == null)
                        xData.contactPerson = "";
                    if (xData.interestedDomainName == null)
                        xData.interestedDomainName = [""];
                    if (xData.address == null)
                        xData.address = " ";

                    try {
                        var tmpAffilationID = "TMP1";
                        var tempAffIDInfo = lastInsertedAffId.findOne({
                            "assocId": "Temp"
                        });
                        if (tempAffIDInfo) {
                            tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                            tmpAffilationID = "TMP" + tempAffIDInfo.lastInsertedId;
                        }


                        var toret = "userDetailsTT"
                        if(xData.interestedProjectName && xData.interestedProjectName.trim().length != 0){
                            var dbtoret = playerDBFind(xData.interestedProjectName)
                            if(dbtoret != false){
                                toret = dbtoret
                            }
                        }

                        var userDetailsTT_player = global[toret].insert({
                            userId: playerID,
                            emailAddress: xData.emailAddress,
                            interestedDomainName: xData.interestedDomainName,
                            interestedProjectName: [xData.interestedProjectName],
                            interestedSubDomain1Name: xData.interestedSubDomain1Name,
                            interestedSubDomain2Name: xData.interestedSubDomain2Name,
                            profileSettingStatus: true,
                            userName: xData.userName.trim(),
                            phoneNumber: xData.phoneNumber.trim(),
                            dateOfBirth: moment(s4).format("YYYY-MM-DD"),
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
                            year: new Date().getFullYear(),
                            affiliatedTo: "other",
                            tempAffiliationId: tmpAffilationID,
                        });

                    } catch (e) {
                        var removePlayer = Meteor.users.remove({
                            "_id": playerID
                        })
                    }

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
                    return userDetailsTT_player;
                }
            } else
                return false;

        } catch (e) {}
    },

    updatePlayer: function(xData) {
        try {
            check(xData, Object);
            var playerUpdate;


            if (xData.interestedDomainName.length > 0) 
            {
                playerUpdate = nameToCollection(xData.userId).update({
                    "userId": xData.userId
                }, {
                    $set: {
                        userName: xData.userName,
                        guardianName: xData.guardianName,
                        //phoneNumber: xData.phoneNumber,
                        gender: xData.gender,
                        dateOfBirth: moment(new Date(xData.dateOfBirth)).format("DD MMM YYYY"),
                        //interestedProjectName: xData.interestedProjectName,
                        interestedDomainName: xData.interestedDomainName,
                        nationalAffiliationId: xData.nationalAffiliationId
                    }
                });
            } else {
                 playerUpdate = nameToCollection(xData.userId).update({
                    "userId": xData.userId
                }, {
                    $set: {
                        userName: xData.userName,
                        guardianName: xData.guardianName,
                        //phoneNumber: xData.phoneNumber,
                        gender: xData.gender,
                        dateOfBirth: moment(new Date(xData.dateOfBirth)).format("DD MMM YYYY"),
                       // interestedProjectName: xData.interestedProjectName,
                        nationalAffiliationId: xData.nationalAffiliationId
                    }
                });
            }
            if(playerUpdate)
            {
                var userUpdate = Meteor.users.update({
                    "userId": xData.userId
                    }, {
                        $set: {
                            userName: xData.userName,
                           // interestedProjectName: xData.interestedProjectName
                        }
                });
            return playerUpdate;
            }
            
        } catch (e) {
            errorLog(e)
        }
    },

    updatePlayerAddress: function(xData) {
        try {
            check(xData, Object);
            var userInfo = nameToCollection(xData.userId).findOne({
                "userId": xData.userId
            });
            var oldCountry = "";
            var oldState = "";
            if (userInfo && userInfo.country) {
                oldCountry = userInfo.country;
                oldState = userInfo.state;
            }

            var playerAddressUpdate = nameToCollection(xData.userId).update({
                "userId": xData.userId
            }, {
                $set: {
                    address: xData.address,
                    city: xData.city,
                    pinCode: xData.pinCode
                }
            });

            var userInfo = nameToCollection(xData.userId).findOne({
                "userId": xData.userId
            });

            if (userInfo && userInfo.affiliatedTo) 
            {
                if (userInfo.affiliatedTo == "other") 
                {
                    nameToCollection(xData.userId).update({
                        "userId": xData.userId
                    }, {
                        $set: {
                            state: xData.state
                        }
                    });
                    if (xData.country) {
                        nameToCollection(xData.userId).update({
                            "userId": xData.userId
                        }, {
                            $set: {
                                country: xData.country
                            }
                        });
                    }
                }
            }

            return playerAddressUpdate;
        } catch (e) {

            errorLog(e)
        }

    },
});