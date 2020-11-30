import {
    playerDBFind
}
from '../dbRequiredRole.js'

//userDetailsTTUsed
Meteor.methods({
    'affiliateAcademiesBYSADA': function(xData,giveDBDet) {
        try {

            check(xData, Object);
            var loggedInUser = ""

            if(xData.loggedId){
                loggedInUser = Meteor.users.findOne({
                    "_id": xData.loggedId
                });
            }
            else if(this.userId){
                loggedInUser = Meteor.users.findOne({
                    "_id": this.userId
                });
            }


            var affiliatedTo = "other";
            var parentAssociationId = "";
            var associationId = "";
            var interestedProjectName = "";
            var interestedDomainName = "";
            var j;
            if (loggedInUser && loggedInUser.role == "Association") {
                var assocDetails = associationDetails.findOne({
                    userId: loggedInUser._id
                })
                if (assocDetails.associationType == "District/City") {
                    affiliatedTo = "districtAssociation";
                    parentAssociationId = assocDetails.parentAssociationId;
                    associationId = assocDetails.userId;
                    interestedDomainName = assocDetails.interestedDomainName;
                    interestedProjectName = assocDetails.interestedProjectName;
                    j = academyDetails.update({
                        userId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "associationId": associationId,
                            "interestedProjectName": interestedProjectName,
                            "interestedDomainName": interestedDomainName,
                            "parentAssociationId": parentAssociationId,
                            "affiliatedTo": affiliatedTo
                        }
                    }, {
                        multi: true
                    });
                    k = Meteor.users.update({
                        userId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "interestedProjectName": interestedProjectName,
                        }
                    }, {
                        multi: true
                    })

                    if(j&&k && giveDBDet){
                        var dataToret = []

                        var meteUsers = Meteor.users.find({
                            userId:{
                                $in: xData.userId
                            }
                        }).fetch()

                        var acadDet = academyDetails.find({
                            userId:{
                                $in: xData.userId
                            }
                        }).fetch()

                        var d1 = {
                            "collectionName":"MeteorUsers",
                            data:meteUsers
                        }

                        dataToret.push(d1)

                        var d2 = {
                            "collectionName":"academyDetails",
                            data:acadDet
                        }
                        dataToret.push(d2)

                        var res = {
                            message:AFFILIATE_SUCCESS_MSG,
                            data:dataToret,
                            status:SUCCESS_STATUS
                        }
                        return res
                    }
                } else if (assocDetails.associationType == "State/Province/County") {
                    affiliatedTo = "stateAssociation";
                    associationId = assocDetails.userId;
                    interestedDomainName = assocDetails.interestedDomainName;
                    interestedProjectName = assocDetails.interestedProjectName;
                    j = academyDetails.update({
                        userId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "associationId": associationId,
                            "interestedProjectName": interestedProjectName,
                            "interestedDomainName": interestedDomainName,
                            "affiliatedTo": affiliatedTo
                        }
                    }, {
                        multi: true
                    });
                    k = Meteor.users.update({
                        userId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "interestedProjectName": interestedProjectName,
                        }
                    }, {
                        multi: true
                    })

                    if(j&&k && giveDBDet){
                        var dataToret = []

                        var meteUsers = Meteor.users.find({
                            userId:{
                                $in: xData.userId
                            }
                        }).fetch()

                        var acadDet = academyDetails.find({
                            userId:{
                                $in: xData.userId
                            }
                        }).fetch()

                        var d1 = {
                            "collectionName":"MeteorUsers",
                            data:meteUsers
                        }

                        dataToret.push(d1)

                        var d2 = {
                            "collectionName":"academyDetails",
                            data:acadDet
                        }
                        dataToret.push(d2)

                        var res = {
                            message:AFFILIATE_SUCCESS_MSG,
                            data:dataToret,
                            status:SUCCESS_STATUS
                        }
                        return res
                    }
                }
            }
            if (j) {
                return true
            }
        } catch (e) {
            return false
        }
    }
});

Meteor.methods({
    insertAcademyFromAss: function(xData) {
        try {
            var r = Accounts.createUser({
                email: xData.emailAddress,
                password: xData.password,
                userName: xData.userName
            });
            return r;
        } catch (e) {}
    }
});

Meteor.methods({
    'updateAcademyFROMDASA': function(xData) {
        try {

            check(xData, Object);
            var loggedInUser = Meteor.users.findOne({
                "_id": this.userId
            });
            var affiliatedTo = "other";
            var parentAssociationId = "";
            var associationId = "";
            var interestedProjectName = "";
            var interestedDomainName = "";
            var j, k;
            var s3 = "";
            if (xData.s1 == undefined || xData.s2 == undefined || xData.s3 == undefined) {
                s3 = ""
            } else if (xData.s1 && xData.s2 && xData.s3) {
                var sa = parseInt(xData.s1)
                var sb = parseInt(xData.s2)
                var sc = parseInt(xData.s3)
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                var d = new Date(sb + "/" + sa + "/" + sc);
                s4 = sa + " " + monthNames[d.getMonth()] + " " + sc;
            }
            if (loggedInUser.role == "Association") {
                var assocDetails = associationDetails.findOne({
                    userId: loggedInUser._id
                })
                if (assocDetails.associationType == "District/City") {
                    affiliatedTo = "districtAssociation";
                    parentAssociationId = assocDetails.parentAssociationId;
                    associationId = assocDetails.userId;
                    interestedDomainName = assocDetails.interestedDomainName;
                    interestedProjectName = assocDetails.interestedProjectName;
                    try {
                        j = academyDetails.insert({
                            interestedProjectName: interestedProjectName,
                            interestedDomainName: interestedDomainName,
                            associationId: associationId,
                            phoneNumber: xData.phoneNumber,
                            clubName: xData.clubName,
                            emailAddress: xData.emailAddress,
                            role: 'Academy',
                            contactPerson: xData.contactPerson,
                            address: xData.address,
                            city: xData.city,
                            pinCode: xData.pinCode,
                            userId: xData.newUserId,
                            state: xData.state,
                            country: xData.country,
                            affiliatedTo: affiliatedTo,
                            parentAssociationId: parentAssociationId,
                            abbrevationAcademy: xData.abbrevationAcademy.toUpperCase()

                        })
                    } catch (e) {
                        Meteor.users.remove({
                            userId: xData.newUserId
                        });
                        academyDetails.remove({
                            userId: xData.newUserId
                        })
                    }
                    if (j) {
                        k = Meteor.users.update({
                            "_id": xData.newUserId
                        }, {
                            $set: {
                                emailAddress: xData.emailAddress,
                                profileSettingStatus: true,
                                userName: xData.clubName,
                                userId: xData.newUserId,
                                role: "Academy",
                                interestedProjectName: interestedProjectName,
                            }
                        });
                        if (j && xData.s1 !== undefined && xData.s2 !== undefined && xData.s3 !== undefined && xData.s1 !== null && xData.s2 !== null && xData.s3 !== null) {
                            academyDetails.update({
                                userId: xData.newUserId

                            }, {
                                $set: {
                                    dateOfInc: moment(new Date(s4)).format("YYYY-MM-DD"),
                                }
                            })
                        }
                    }
                } else if (assocDetails.associationType == "State/Province/County") {
                    affiliatedTo = "stateAssociation";
                    associationId = assocDetails.userId;
                    interestedDomainName = assocDetails.interestedDomainName;
                    interestedProjectName = assocDetails.interestedProjectName;
                    try {
                        j = academyDetails.insert({
                            interestedProjectName: interestedProjectName,
                            interestedDomainName: interestedDomainName,
                            associationId: associationId,
                            phoneNumber: xData.phoneNumber,
                            clubName: xData.clubName,
                            emailAddress: xData.emailAddress,
                            role: 'Academy',
                            contactPerson: xData.contactPerson,
                            address: xData.address,
                            city: xData.city,
                            pinCode: xData.pinCode,
                            userId: xData.newUserId,
                            state: xData.state,
                            country: xData.country,
                            affiliatedTo: affiliatedTo,
                            parentAssociationId: parentAssociationId,
                            abbrevationAcademy: xData.abbrevationAcademy.trim().toUpperCase()
                        })
                    } catch (e) {
                        Meteor.users.remove({
                            userId: xData.newUserId
                        });
                        academyDetails.remove({
                            userId: xData.newUserId
                        })
                    }
                    if (j) {
                        k = Meteor.users.update({
                            "_id": xData.newUserId
                        }, {
                            $set: {
                                emailAddress: xData.emailAddress,
                                profileSettingStatus: true,
                                userName: xData.clubName,
                                userId: xData.newUserId,
                                role: "Academy",
                                interestedProjectName: interestedProjectName
                            }
                        });
                        if (j && xData.s1 !== undefined && xData.s2 !== undefined && xData.s3 !== undefined && xData.s1 !== null && xData.s2 !== null && xData.s3 !== null) {
                            academyDetails.update({
                                userId: xData.newUserId

                            }, {
                                $set: {
                                    dateOfInc: moment(new Date(s4)).format("YYYY-MM-DD"),
                                }
                            })
                        }
                    }
                }
            }
            if (j && k) {
                return true
            }
        } catch (e) {}
    }
});

Meteor.methods({
    'updateAcademiesRemoveAffiliation': function(xData,giveDbDetails) {
        try {

            check(xData, Object);
            var loggedInUser = ""

            if (xData.loggedId) {
                loggedInUser = Meteor.users.findOne({
                    "_id": xData.loggedId
                });
            } else if (this.userId) {
                loggedInUser = Meteor.users.findOne({
                    "_id": this.userId
                });
            }


            var affiliatedTo = "other";
            var parentAssociationId = "";
            var associationId = "";
            var interestedProjectName = "";
            var interestedDomainName = "";
            var j = "";
            var playerUSerId = []
            var toret = "userDetailsTT"

            if (loggedInUser.role == "Association") {
                if (giveDbDetails && assocDetails && assocDetails.associationType == "State/Province/County") {
                    

                    if (loggedInUser && loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length) {
                        var dbname = playerDBFind(loggedInUser.interestedProjectName[0])
                        if (dbname) {
                            toret = dbname
                        }
                    }

                    var playerUSerIds = global[toret].aggregate([{
                        $match: {
                            clubNameId: {
                                $in: xData.userId
                            }
                        }
                    }, {
                        $project: {
                            userId: 1
                        }
                    }, {
                        $group: {
                            "_id": "1",
                            "u": {
                                $addToSet: "$userId"
                            }
                        }
                    }])
                    if(playerUSerIds && playerUSerIds[0] && playerUSerIds[0].u){
                        playerUSerId = playerUSerIds[0].u
                    }
                }

                var assocDetails = associationDetails.findOne({
                    userId: loggedInUser._id
                })
                if (assocDetails.associationType == "District/City") {
                    parentAssociationId = "";
                    associationId = "";
                    j = academyDetails.update({
                        userId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "associationId": associationId,
                            "parentAssociationId": parentAssociationId,
                            "affiliatedTo": affiliatedTo
                        }
                    }, {
                        multi: true
                    });

                    

                    if(loggedInUser && loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length){
                        var dbname = playerDBFind(loggedInUser.interestedProjectName[0])
                        if(dbname){
                            toret = dbname
                        }
                    }

                    var l = global[toret].update({
                        clubNameId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            associationId: "",
                            parentAssociationId: "",
                            affiliatedTo: "other",
                            clubNameId: "",
                            "statusOfUser": "notApproved"
                        }
                    }, {
                        multi: true
                    });

                } else if (assocDetails.associationType == "State/Province/County") {
                    associationId = "";
                    j = academyDetails.update({
                        userId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "associationId": associationId,
                            "affiliatedTo": affiliatedTo
                        }
                    }, {
                        multi: true
                    });

                    var toret = "userDetailsTT"
                    if(loggedInUser && loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length){
                        var dbname = playerDBFind(loggedInUser.interestedProjectName[0])
                        if(dbname){
                            toret = dbname
                        }
                    }

                    var l = global[toret].update({
                        clubNameId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            associationId: "",
                            affiliatedTo: "other",
                            clubNameId: "",
                            "statusOfUser": "notApproved"
                        }
                    }, {
                        multi: true
                    });
                }
            }
            if(j && giveDbDetails){
                var dataToret = []


                var acadDet2 = academyDetails.find({
                    userId: {
                        $in: xData.userId
                    }
                }).fetch()

                var d2 = {
                    "collectionName": "academyDetails",
                    data: acadDet2
                }
                dataToret.push(d2)

                var acadDet3 = global[toret].find({
                    userId: {
                        $in: playerUSerId
                    }
                }).fetch()

                var d3 = {
                    "collectionName": toret,
                    data: acadDet3
                }
                dataToret.push(d3)

                var res = {
                    message: REMOVE_AFFIL_SUCCESS_MSG,
                    data: dataToret,
                    status: SUCCESS_STATUS
                }
                return res
            }
            if (j) {
                return true
            }
        } catch (e) {}
    }
});