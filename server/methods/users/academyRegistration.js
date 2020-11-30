Meteor.methods({
    registerAcademy: async function(xData,givedbDetails) {
        try {
            var res = false
            var academyID
            var affiliatedTo = "other"
            var associationId = "other"
            var interestedDomainName = [""]
            var interestedProjectName = [""]
            var resValid = false

            if (xData.regId == undefined || xData.regId == null) {
                resValid = await Meteor.call("registerValidationGeneralized", xData) 
                try{
                    if (resValid && resValid.response == 0 && resValid.playerID) {
                        academyID = resValid.playerID
                        res = true
                    } else {
                        res = false
                    }
                }
                catch(e){

                }
            } else {
                academyID = xData.regId
                res = true
            }

            if (academyID && res == true) {
                if (xData.contactPerson == null)
                    xData.contactPerson = "";

                try {
                    var s3 = "";
                    if (xData.MonthINC == undefined || xData.YearINC == undefined || xData.DDINC == undefined ||
                        xData.MonthINC == "MM" || xData.YearINC == "YYYY" || xData.DDINC == "DD") {
                        s3 = ""
                    } else if (xData.MonthINC && xData.YearINC && xData.DDINC &&
                        xData.MonthINC != "MM" && xData.YearINC != "YYYY" && xData.DDINC != "DD") {
                        var sa = parseInt(xData.DDINC)
                        var sb = parseInt(xData.MonthINC)
                        var sc = parseInt(xData.YearINC)
                        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ];

                        var d = new Date(sb + "/" + sa + "/" + sc);
                        s3 = sa + " " + monthNames[d.getMonth()] + " " + sc;
                    }else if (xData.dateOfInc!=undefined&&xData.dateOfInc!=null) {
                         s3 = xData.dateOfInc
                    }

                    if (xData.userName == null) {
                        xData.userName = xData.contactPerson
                    }
                    if(xData.stateAssociationId != undefined && xData.stateAssociationId != null &&
                        xData.stateAssociationId.trim().length != 0){
                        associationId = xData.stateAssociationId
                        affiliatedTo = "stateAssociation"
                    }
                    if(xData.interestedDomainName  != undefined && xData.interestedDomainName != null){
                        interestedDomainName = xData.interestedDomainName
                    }
                    if(xData.interestedProjectName  != undefined && xData.interestedProjectName != null){
                        interestedProjectName = xData.interestedProjectName
                    }

                    var academyInsert = academyDetails.insert({
                        userId: academyID,
                        emailAddress: xData.emailAddress,
                        interestedDomainName: interestedDomainName,
                        interestedProjectName: interestedProjectName,
                        interestedSubDomain1Name: [""],
                        interestedSubDomain2Name: [""],
                        profileSettingStatus: true,
                        clubName: xData.clubName,
                        phoneNumber: xData.phoneNumber,
                        associationId: associationId,
                        role: "Academy",
                        contactPerson: xData.contactPerson,
                        address: xData.address,
                        city: xData.city,
                        pinCode: xData.pinCode,
                        state: xData.state,
                        country: xData.country,
                        abbrevationAcademy: xData.abbrevation.toUpperCase(),
                        statusOfUser: "Active",
                        year: new Date().getFullYear(),
                        affiliatedTo: affiliatedTo,
                        source:xData.source
                    });

                    if (academyInsert && xData.MonthINC !== undefined && xData.YearINC !== undefined && xData.DDINC !== undefined) {
                        academyDetails.update({
                            userId: academyID

                        }, {
                            $set: {
                                dateOfInc: s3,
                            }
                        })
                    }

                } catch (e) {
                    var removeAcademy = Meteor.users.remove({
                        "_id": academyID
                    });
                    var removeAcademyDetails = academyDetails.remove({
                        "userId": academyID
                    })
                    return false
                }

                if (academyInsert) {
                    var profileUpdate = Meteor.users.update({
                        "_id": academyID
                    }, {
                        $set: {
                            userId: academyID,
                            profileSettingStatus: true,
                            role: "Academy",
                            interestedProjectName: interestedProjectName,
                            userName: xData.clubName,
                            emailAddress: xData.emailAddress,
                            source:xData.source
                        }
                    });
                    if(givedbDetails){
                        var userDettoret = Meteor.users.findOne({
                            "userId": academyID
                        })
                        var dataToRet = []
                        if(userDettoret){
                            var d = {
                                collectionName: "MeteorUsers",
                                data: userDettoret
                            }

                            dataToRet.push(d)

                            var acadDetailstoret = academyDetails.findOne({
                                 userId: academyID
                            })
                            if(acadDetailstoret){
                               var d = {
                                    collectionName: "academyDetails",
                                    data: acadDetailstoret
                                }
                                dataToRet.push(d)
                            }
                            var res = {
                                data:dataToRet ,
                                message: REGISTER_SUCCESS_MSG,
                                status: SUCCESS_STATUS,
                                response: ""
                            }
                            return res       
                        }
                    }
                    else{
                        return academyID;
                    }
                } else {
                    var removeAcademy = Meteor.users.remove({
                        "_id": academyID
                    })
                    var removeAcademyDetails = academyDetails.remove({
                        "userId": academyID
                    })
                    return false
                }
            }
            else{
                return false
            }
        } catch (e) {
            return false
        }
    },
    updateAcademy: function(xData,givedbDetails) {
        try {
            check(xData, Object);
            if(givedbDetails){
                var clubNam = ""
                var contPer = ""
                if(xData.clubName){
                    clubNam = xData.clubName
                }
                if(xData.userName){
                    contPer = xData.userName
                }
                var academyUpdate = academyDetails.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        clubName: clubNam,
                        contactPerson: contPer,
                        dateOfInc: xData.dateOfInc,
                        address: xData.address,
                        city: xData.city,
                        state: xData.state,
                        pinCode: xData.pinCode,
                    }
                });
                if(academyUpdate){
                    var userAcademyUpdate = Meteor.users.update({
                        "userId": xData.userId
                    }, {
                        $set: {
                            userName: clubNam
                        }
                    });
                    if(userAcademyUpdate){
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

                            var acadDetailstoret = academyDetails.findOne({
                                 userId: xData.userId
                            })
                            if(acadDetailstoret){
                               var d = {
                                    collectionName: "academyDetails",
                                    data: acadDetailstoret
                                }
                                dataToRet.push(d)
                            }
                            var res = {
                                data:dataToRet ,
                                message: ACAD_PROFILE_UPDATED_MSG,
                                status: SUCCESS_STATUS,
                                response: ""
                            }
                            return res
                        }else{
                            return false
                        }
                    }else{
                        return false
                    }
                }else{
                    return false
                }
            }
            else{
                var academyUpdate = academyDetails.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        clubName: xData.userName,
                        contactPerson: xData.contactPerson,
                        phoneNumber: xData.phoneNumber,
                        dateOfInc: xData.dateOfInc,
                        abbrevationAcademy: xData.abbrevation,
                        address: xData.address,
                        city: xData.city,
                        state: xData.state,
                        pinCode: xData.pinCode,
                        interestedDomainName: xData.interestedDomainName,
                        interestedProjectName: xData.interestedProjectName,
                    }
                });

                var userAcademyUpdate = Meteor.users.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        userName: xData.userName
                    }
                });
                return academyUpdate;
            }
        } catch (e) {
            return false
        }

    },
    updateAcademyAddress: function(xData) {
        try {
            check(xData, Object);
            var academyAddressUpdate = academyDetails.update({
                "userId": xData.userId
            }, {
                $set: {
                    address: xData.address,
                    city: xData.city,
                    state: xData.state,
                    pinCode: xData.pinCode
                }
            });
            return academyAddressUpdate
        } catch (e) {}

    },
    "academyAbbrevationDuplicates": function(abbName) {
        var findWho = academyDetails.findOne({
            'abbrevationAcademy': abbName.toUpperCase()
        });
        if (findWho) {
            return findWho
        } else{ 
            findWho = associationDetails.findOne({
                'abbrevationAssociation':abbName.toUpperCase(),
            })
            if (findWho) {
                return findWho
            }
            else{
                return false
            }
        }
    }


});