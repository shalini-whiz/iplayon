//userDetailsTTUsed
import {
    playerDBFind
}
from '../dbRequiredRole.js'

Meteor.methods({
    'affiliateDABYSA': function(xData, giveDbDetails) {
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
            var j;
            var k;
            if (loggedInUser.role == "Association") {
                var assocDetails = associationDetails.findOne({
                    userId: loggedInUser._id
                })
                if (assocDetails.associationType == "State/Province/County") {
                    affiliatedTo = "stateAssociation";
                    parentAssociationId = assocDetails.userId;
                    interestedDomainName = assocDetails.interestedDomainName;
                    interestedProjectName = assocDetails.interestedProjectName;
                    j = associationDetails.update({
                        userId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "parentAssociationId": parentAssociationId,
                            "interestedProjectName": interestedProjectName,
                            "interestedDomainName": interestedDomainName,
                            "affiliatedTo": affiliatedTo
                        }
                    }, {
                        multi: true
                    });
                }
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

            }
            if (j && k && giveDbDetails) {
                var dataToret = []

                var meteUsers = Meteor.users.find({
                    userId: {
                        $in: xData.userId
                    }
                }).fetch()

                var acadDet = associationDetails.find({
                    userId: {
                        $in: xData.userId
                    }
                }).fetch()

                var d1 = {
                    "collectionName": "MeteorUsers",
                    data: meteUsers
                }

                dataToret.push(d1)

                var d2 = {
                    "collectionName": "associationDetails",
                    data: acadDet
                }
                dataToret.push(d2)

                var res = {
                    message: AFFILIATE_SUCCESS_MSG,
                    data: dataToret,
                    status: SUCCESS_STATUS
                }
                return res
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
    'updateDARemoveAffiliation': function(xData, giveDbDetails) {
        try{
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
            var toret = "userDetailsTT"
            var academyUSerId = []
            var playerUSerId = []

            if (loggedInUser.role == "Association") {
                var assocDetails = associationDetails.findOne({
                    userId: loggedInUser._id
                })

                if (giveDbDetails && assocDetails && assocDetails.associationType == "State/Province/County") {
                    var academyUSerIds = academyDetails.aggregate([{
                        $match: {
                            associationId: {
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
                    if(academyUSerIds && academyUSerIds[0] && academyUSerIds[0].u){
                        academyUSerId = academyUSerIds[0].u
                    }

                    if (loggedInUser && loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length) {
                        var dbname = playerDBFind(loggedInUser.interestedProjectName[0])
                        if (dbname) {
                            toret = dbname
                        }
                    }

                    var playerUSerIds = global[toret].aggregate([{
                        $match: {
                            associationId: {
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

                if (assocDetails && assocDetails.associationType == "State/Province/County") {
                    associationId = "";
                    j = associationDetails.update({
                        userId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "parentAssociationId": associationId,
                            "affiliatedTo": affiliatedTo
                        }
                    }, {
                        multi: true
                    });



                    if (loggedInUser && loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length) {
                        var dbname = playerDBFind(loggedInUser.interestedProjectName[0])
                        if (dbname) {
                            toret = dbname
                        }
                    }

                    global[toret].update({
                        associationId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "associationId": associationId,
                            "affiliatedTo": affiliatedTo,
                            "parentAssociationId": "",
                            clubNameId: "",
                            "statusOfUser": "notApproved"
                        }
                    }, {
                        multi: true
                    });
                    academyDetails.update({
                        associationId: {
                            $in: xData.userId
                        }
                    }, {
                        $set: {
                            "associationId": associationId,
                            "affiliatedTo": affiliatedTo,
                            "parentAssociationId": ""
                        }
                    }, {
                        multi: true
                    });
                }
            }
            if (j && giveDbDetails) {
                var dataToret = []

                var acadDet = associationDetails.find({
                    userId: {
                        $in: xData.userId
                    }
                }).fetch()

                var d1 = {
                    "collectionName": "associationDetails",
                    data: acadDet
                }
                dataToret.push(d1)

                var acadDet2 = academyDetails.find({
                    userId: {
                        $in: academyUSerId
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
                    status:SUCCESS_STATUS
                }
                return res
            } else if (j) {
                return true
            }
            else{
                return false
            }
        }catch(e){
            return false
        }
    }
});

Meteor.methods({
    'updateDAFROMSA': function(xData) {
        check(xData, Object);
        var loggedInUser = Meteor.users.findOne({
            "_id": this.userId
        });
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
        var affiliatedTo = "other";
        var parentAssociationId = "";
        var associationId = "";
        var interestedProjectName = "";
        var interestedDomainName = "";
        var j, k;
        if (loggedInUser.role == "Association") {
            var assocDetails = associationDetails.findOne({
                userId: loggedInUser._id
            })
            if (assocDetails.associationType == "State/Province/County") {
                affiliatedTo = "stateAssociation";
                parentAssociationId = assocDetails.userId;
                interestedDomainName = assocDetails.interestedDomainName;
                interestedProjectName = assocDetails.interestedProjectName;
                try {
                    j = associationDetails.insert({
                        interestedProjectName: interestedProjectName,
                        interestedDomainName: interestedDomainName,
                        phoneNumber: xData.phoneNumber,
                        associationName: xData.clubName,
                        emailAddress: xData.emailAddress,
                        role: 'Association',
                        contactPerson: xData.contactPerson,
                        address: xData.address,
                        city: xData.city,
                        pinCode: xData.pinCode,
                        userId: xData.newUserId,
                        state: xData.state,
                        country: xData.country,
                        affiliatedTo: affiliatedTo,
                        parentAssociationId: parentAssociationId,
                        abbrevationAssociation: xData.abbrevationAcademy.trim().toUpperCase(),
                        associationType: "District/City"
                    });
                } catch (e) {
                    Meteor.users.remove({
                        userId: xData.newUserId
                    });
                    associationDetails.remove({
                        userId: xData.newUserId
                    });
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
                            role: "Association",
                            associationType: "District/City",
                            interestedProjectName: interestedProjectName
                        }
                    });
                    if (j && xData.s1 !== undefined && xData.s2 !== undefined && xData.s3 !== undefined && xData.s1 !== null && xData.s2 !== null && xData.s3 !== null) {
                        associationDetails.update({
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
    }
});