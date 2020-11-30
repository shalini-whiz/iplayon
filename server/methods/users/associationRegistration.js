Meteor.methods({
    registerAssociation: async function(xData, givedbDetails) {
        try {
            var associationInsert;
            var associationID;
            var res = false
            if (xData.regId == undefined || xData.regId == null) {
                var resValid = false
                try {
                    resValid = await Meteor.call("registerValidationGeneralized", xData)
                    if (resValid && resValid.response == 0 && resValid.playerID) {
                        associationID = resValid.playerID
                        res = true
                    } else {
                        res = false
                    }
                } catch (e) {

                }

            } else {
                associationID = xData.regId
                res = true
            }

            if (associationID && res == true) {
                var s3 = "";

                if (xData.MonthINC && xData.YearINC && xData.DDINC &&
                    xData.MonthINC != "MM" && xData.YearINC != "YYYY" && xData.DDINC != "DD"
                ) {

                    var sa = parseInt(xData.DDINC)
                    var sb = parseInt(xData.MonthINC)
                    var sc = parseInt(xData.YearINC)
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];

                    var d = new Date(sb + "/" + sa + "/" + sc);
                    s3 = sa + " " + monthNames[d.getMonth()] + " " + sc;
                } else if (xData.dateOfInc!=undefined&&xData.dateOfInc!=null) {
                    s3 = xData.dateOfInc
                }

                if (xData.userName == null) {
                    xData.userName = xData.contactPerson
                }
                if(xData.interestedProjectName){

                }
                else{
                    xData.interestedProjectName = [""]
                }

                if(xData.interestedDomainName){

                }
                else{
                    xData.interestedDomainName = [""]
                }

                try {
                    if (xData.associationType == "District/City") {
                        associationInsert = associationDetails.insert({
                            interestedDomainName: xData.interestedDomainName,
                            interestedProjectName: xData.interestedProjectName,
                            interestedSubDomain1Name: [""],
                            interestedSubDomain2Name: [""],
                            profileSettingStatus: true,
                            phoneNumber: xData.phoneNumber,
                            role: "Association",
                            contactPerson: xData.contactPerson,
                            address: xData.address,
                            city: xData.city,
                            pinCode: xData.pinCode,
                            state: xData.state,
                            country: xData.country,
                            dateOfInc: s3,
                            abbrevationAssociation: xData.assocAbbrevation.toUpperCase(),
                            statusOfUser: "Active",
                            associationName: xData.associationName,
                            associationType: xData.associationType,
                            userId: associationID,
                            year: new Date().getFullYear(),
                            parentAssociationId: "other",
                            emailAddress: xData.emailAddress,
                            affiliatedTo: "other",
                            source:xData.source
                        });

                    } else if (xData.associationType == "State/Province/County") {
                        associationInsert = associationDetails.insert({
                            interestedDomainName: xData.interestedDomainName,
                            interestedProjectName: xData.interestedProjectName,
                            interestedSubDomain1Name: [""],
                            interestedSubDomain2Name: [""],
                            profileSettingStatus: true,
                            phoneNumber: xData.phoneNumber,
                            role: "Association",
                            contactPerson: xData.contactPerson,
                            address: xData.address,
                            city: xData.city,
                            pinCode: xData.pinCode,
                            state: xData.state,
                            country: xData.country,
                            dateOfInc: s3,
                            abbrevationAssociation: xData.assocAbbrevation.toUpperCase(),
                            statusOfUser: "Active",
                            associationType: xData.associationType,
                            userId: associationID,
                            associationName: xData.associationName,
                            year: new Date().getFullYear(),
                            emailAddress: xData.emailAddress,
                            affiliatedTo: "other",
                            source:xData.source

                        });


                        if(associationInsert){
                            var j = associationPermissions.insert({
                                associationId: associationID,
                                playerEntry: "yes",
                                districtAssocEntry: "yes",
                                academyEntry: "yes",
                                playerEditSet: "yes",
                                districtAssocEditSet: "yes",
                                academyEditSet: "yes",
                                playerChangePass: "yes",
                                districtAssocChangePass: "yes",
                                academyChangePass: "yes"
                            })
                        }
                    }
                } catch (e) {
                    var removeAssociationDetails = associationDetails.remove({
                        userId: associationID
                    })
                    var removeAssociation = Meteor.users.remove({
                        "_id": associationID
                    })
                    return false
                }


                if (associationInsert) {
                    var associationUpdate = ""
                    if (xData.associationType == "State/Province/County") {
                        associationUpdate = Meteor.users.update({
                            "_id": associationID
                        }, {
                            $set: {
                                userId: associationID,
                                profileSettingStatus: true,
                                role: "Association",
                                interestedProjectName: xData.interestedProjectName,
                                userName: xData.associationName,
                                emailAddress: xData.emailAddress,
                                associationType: xData.associationType,
                                source:xData.source
                            }
                        });
                    } else if (xData.associationType == "District/City") {
                        associationUpdate = Meteor.users.update({
                            "_id": associationID
                        }, {
                            $set: {
                                userId: associationID,
                                profileSettingStatus: true,
                                role: "Association",
                                interestedProjectName: [""],
                                userName: xData.associationName,
                                emailAddress: xData.emailAddress,
                                associationType: xData.associationType,
                                source:xData.source
                            }
                        });
                    }

                    if (associationUpdate && givedbDetails) {
                        var meteorUserJSON = Meteor.users.findOne({
                            "_id": associationID
                        })

                        if (meteorUserJSON) {
                            var datagivedbDetails = [{
                                collectionName: "Meteor.users",
                                data: meteorUserJSON
                            }]

                            var otherUsersJson = associationDetails.findOne({
                                "userId": associationID
                            })
                            if (otherUsersJson) {
                                var d = {
                                    collectionName: "associationDetails",
                                    data: otherUsersJson
                                }
                                datagivedbDetails.push(d)

                                if(xData.associationType == "State/Province/County"){
                                    var associationPer = associationPermissions.findOne({
                                        associationId: associationID
                                    })
                                    if(associationPer){
                                        var d1 = {
                                            collectionName:"associationPermissions",
                                            data:associationPer
                                        }
                                        datagivedbDetails.push(d1)
                                    }
                                }

                                var res = {
                                    data:datagivedbDetails ,
                                    message: REGISTER_SUCCESS_MSG,
                                    status: SUCCESS_STATUS,
                                    response: ""
                                }
                                return res
                            } else {
                                var removeAssociation = Meteor.users.remove({
                                    "_id": associationID
                                })
                                var removeAssociationDetails = associationDetails.remove({
                                    userId: associationID
                                })
                                var associationsPermissions = associationPermissions.remove({
                                    associationId: associationID
                                })
                                return false
                            }
                        } else {
                            var removeAssociation = Meteor.users.remove({
                                "_id": associationID
                            })
                            var removeAssociationDetails = associationDetails.remove({
                                userId: associationID
                            })
                            /*var associationPermissions = associationPermissions.remove({
                                associationId: associationID
                            })*/
                            return false
                        }
                    } else if (associationUpdate) {
                        return associationInsert;
                    } else {
                        var removeAssociation = Meteor.users.remove({
                            "_id": associationID
                        })
                        var removeAssociationDetails = associationDetails.remove({
                            userId: associationID
                        })
                        /*var associationPermissions = associationPermissions.remove({
                            associationId: associationID
                        })*/
                        return false
                    }

                } else {
                    var removeAssociation = Meteor.users.remove({
                        "_id": associationID
                    })
                    var removeAssociationDetails = associationDetails.remove({
                        userId: associationID
                    })
                    /*var associationPermissions = associationPermissions.remove({
                        associationId: associationID
                    })*/
                    return false
                }

            } else {
                return false
            }
        } catch (e) {
            return false
        }
    },
    updateAssociation: function(xData) {
        try {
            check(xData, Object);
            var associationUpdate = associationDetails.update({
                "userId": xData.userId
            }, {
                $set: {
                    associationName: xData.userName,
                    contactPerson: xData.contactPerson,
                    phoneNumber: xData.phoneNumber,
                    dateOfInc: xData.dateOfInc,
                    abbrevationAssociation: xData.abbrevation
                }
            });

            var userAssociationUpdate = Meteor.users.update({
                "userId": xData.userId
            }, {
                $set: {
                    userName: xData.userName
                }
            });
            return associationUpdate;
        } catch (e) {}

    },
    updateAssociationAddress: function(xData) {
        try {
            check(xData, Object);
            var associationAddressUpdate = associationDetails.update({
                "userId": xData.userId
            }, {
                $set: {
                    address: xData.address,
                    city: xData.city,
                    state: xData.state,
                    pinCode: xData.pinCode
                }
            });
            return associationAddressUpdate;
        } catch (e) {}

    },
    updateDistrictAssociation: function(xData,givedbDetails) {
        try {
            check(xData, Object);
            if(givedbDetails){
                var associationNames = ""
                var contPer = ""

                if(xData.associationName){
                    associationNames = xData.associationName
                }
                else if(xData.userName){
                    contPer = xData.userName
                }

                var update1 = associationDetails.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        associationName:associationNames,
                        contactPerson: contPer,
                        dateOfInc: xData.dateOfInc,
                        address: xData.address,
                        city:xData.city,
                        pinCode:xData.pinCode
                    }
                });
                if(update1){
                    var update2 = Meteor.users.update({
                        "userId": xData.userId
                    }, {
                        $set: {
                            userName: associationNames
                        }
                    });

                    if(update2){
                        var userDettoret = Meteor.users.findOne({
                            "userId": xData.userId
                        })
                        var dataToRet = []
                        if(userDettoret){
                            var d = {
                                collectionName: "MeteorUsers",
                                data: userDettoret
                            }

                            dataToRet.push(d)

                            var acadDetailstoret = associationDetails.findOne({
                                 userId: xData.userId
                            })
                            if(acadDetailstoret){
                               var d = {
                                    collectionName: "associationDetails",
                                    data: acadDetailstoret
                                }
                                dataToRet.push(d)
                            }
                            var res = {
                                data:dataToRet ,
                                message: ASSOC_PROFILE_UPDATED_MSG,
                                status: SUCCESS_STATUS,
                                response: ""
                            }
                            return res       
                        } else{
                            return false
                        }
                    }
                    else{
                        return false
                    }
                }
                else{
                    return false
                }
            }
            else{
                var districtAssociationUpdate = associationDetails.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        associationName: xData.userName,
                        contactPerson: xData.contactPerson,
                        interestedDomainName: xData.interestedDomainName,
                        interestedProjectName: xData.interestedProjectName,
                        dateOfInc: xData.dateOfInc,
                        abbrevationAssociation: xData.abbrevation
                    }
                });

                var userDistrictAssociationUpdate = Meteor.users.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        userName: xData.userName
                    }
                });

                return districtAssociationUpdate;
            }
        } catch (e) {
            return false
        }

    },
    "associationAbbrevationDuplicates": function(abbName) {
        var findWho = associationDetails.findOne({
            'abbrevationAssociation': abbName.toUpperCase()
        });
        if (findWho) {
            return findWho
        } else return undefined
    }
});