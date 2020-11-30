Meteor.methods({

    registerOtherUsers: async function(xData) {
        var otherUserID;
        try {
           

            var playerID;
            var res = false

            if (xData.regId == undefined || xData.regId == null) {
                var resValid = false

                resValid = await Meteor.call("registerValidationGeneralized", xData)
                try{
                    if (resValid && resValid.response == 0 && resValid.playerID) {
                        otherUserID = resValid.playerID
                        res = true
                    } else {
                        res = false
                    }
                }
                catch(e){
                }
            } else {
                otherUserID = xData.regId
                res = true
            }

            if (res) 
            {
                if (otherUserID) {
                    if (xData.guardianName == null)
                        xData.guardianName = "";

                    if (xData.contactPerson == null)
                        xData.contactPerson = "";

                    if (xData.address == null)
                        xData.address = "";

                    if (xData.userName == null)
                        xData.userName = xData.contactPerson

                    if (xData.gender == null)
                        xData.gender = "";

                    if (xData.interestedProjectName == null)
                        xData.interestedProjectName = [""];


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


                    var otherUserInsert = otherUsers.insert({
                        userId: otherUserID,
                        userName: xData.userName,
                        gender: xData.gender,
                        emailAddress: xData.emailAddress,
                        interestedDomainName: xData.interestedDomainName,
                        interestedProjectName: xData.interestedProjectName,
                        interestedSubDomain1Name: [""],
                        interestedSubDomain2Name: [""],
                        profileSettingStatus: true,
                        phoneNumber: xData.phoneNumber,
                        associationId: 'other',
                        role: xData.role,
                        guardianName: xData.guardianName,
                        address: xData.address,
                        city: xData.city,
                        pinCode: xData.pinCode,
                        state: xData.state,
                        country: xData.country,
                        statusOfUser: "Active",
                        dateOfBirth: s4,
                        year: new Date().getFullYear()
                    });


                    if (otherUserInsert) 
                    {
                        var profileUpdate = Meteor.users.update({
                            "_id": otherUserID
                        }, {
                            $set: {
                                profileSettingStatus: true,
                                role: xData.role,
                                interestedProjectName: xData.interestedProjectName
                            }
                        });
                    } else{
                        var removeOtherUser = Meteor.users.remove({
                            "_id": otherUserID
                        })
                        return false
                    }
                    return otherUserInsert;
                } else {
                    return false
                }
            } else
                return false;
        } catch (e) {
            var removeOtherUser = Meteor.users.remove({
                "_id": otherUserID
            })
            return false;
        }
    },

    updateOtherUser: function(xData) {
        try {
            check(xData, Object);
            var fetchbeforeupdate = otherUsers.findOne({
                "userId": xData.userId
            })
            var otherUpdate;
            if (xData.dateOfBirth.trim().length == 0) {
                if (fetchbeforeupdate != undefined && fetchbeforeupdate.country != undefined) {
                    if (xData.country == null || xData.country == undefined) {
                        xData.country = fetchbeforeupdate.country
                    }
                }
                otherUsers.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        userName: xData.userName,
                        guardianName: xData.guardianName,
                        //phoneNumber: xData.phoneNumber,
                        gender: xData.gender,
                        interestedProjectName: xData.interestedProjectName,
                        interestedDomainName: xData.interestedDomainName,
                        country: xData.country
                    }
                });
            } else {

                otherUpdate = otherUsers.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        userName: xData.userName,
                        guardianName: xData.guardianName,
                        //phoneNumber: xData.phoneNumber,
                        gender: xData.gender,
                        dateOfBirth: moment(new Date(xData.dateOfBirth)).format("DD MMM YYYY"),
                        interestedProjectName: xData.interestedProjectName,
                        interestedDomainName: xData.interestedDomainName

                    }
                });

                if (xData.country != null && xData.country != undefined) {
                    otherUpdate = otherUsers.update({
                        "userId": xData.userId
                    }, {
                        $set: {
                            "country": xData.country
                        }
                    });
                }
            }
            var userUpdate = Meteor.users.update({
                "userId": xData.userId
            }, {
                $set: {
                    userName: xData.userName,
                    interestedProjectName: xData.interestedProjectName
                }
            });
            return otherUpdate;
        } catch (e) {

        }

    },
    updateOtherUserAddress: function(xData) {
        try {
            check(xData, Object);
            var otherUserAddressUpdate = otherUsers.update({
                "userId": xData.userId
            }, {
                $set: {
                    address: xData.address,
                    city: xData.city,
                    state: xData.state,
                    pinCode: xData.pinCode
                }
            });
            if (xData.country) {
                var otherUserAddressUpdate1 = otherUsers.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        country: xData.country
                    }
                });
            }

            return otherUserAddressUpdate;
        } catch (e) {}
    },
    updateOtherUserActivities: function(xData) {
        try {
            check(xData, Object);
            var otherUserAddressUpdate;
            if (xData.role == "Umpire") {

                otherUserAddressUpdate = otherUsers.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        languages: xData.languages,
                        certifications: xData.certifications,
                        travelAssignment: xData.travelAssignment
                    }
                });
            } else if (xData.role = "Coach") {
                otherUserAddressUpdate = otherUsers.update({
                    "userId": xData.userId
                }, {
                    $set: {
                        languages: xData.languages,
                        expertise: xData.expertise,
                    }
                });
            }


            return otherUserAddressUpdate;
        } catch (e) {}
    },


});
