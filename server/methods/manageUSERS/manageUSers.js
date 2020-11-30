import {
    playerDBFind
}
from '../../methods/dbRequiredRole.js'

//userDetailsTTUsed

Meteor.methods({
    'affiliatePlayersBYACADASSOC': function(xData,giveDbDetails) {
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
            var j;
            var k;
            var toret = false
            if(loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length){
                toret = playerDBFind(loggedInUser.interestedProjectName[0])
            }
            else{
                return false
            }

            if(toret){
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
                        j = global[toret].update({
                            userId: {
                                $in: xData.userId
                            }
                        }, {
                            $set: {
                                "associationId": associationId,
                                "interestedProjectName": interestedProjectName,
                                "interestedDomainName": interestedDomainName,
                                "parentAssociationId": parentAssociationId,
                                "affiliatedTo": affiliatedTo,
                            }
                        }, {
                            multi: true
                        });
                        k = Meteor.users.update({
                            userId:{
                                $in:xData.userId
                            }
                            },{
                                $set:{
                                    "interestedProjectName": interestedProjectName,
                                }
                            },
                            {
                            multi: true
                        })
                    } else if (assocDetails.associationType == "State/Province/County") {
                        affiliatedTo = "stateAssociation";
                        associationId = assocDetails.userId;
                        interestedDomainName = assocDetails.interestedDomainName;
                        interestedProjectName = assocDetails.interestedProjectName;
                        j = global[toret].update({
                            userId: {
                                $in: xData.userId
                            }
                        }, {
                            $set: {
                                "associationId": associationId,
                                "interestedProjectName": interestedProjectName,
                                "interestedDomainName": interestedDomainName,
                                "affiliatedTo": affiliatedTo,
                            }
                        }, {
                            multi: true
                        });
                        k = Meteor.users.update({
                            userId:{
                                $in:xData.userId
                            }
                            },{
                                $set:{
                                    "interestedProjectName": interestedProjectName,
                                }
                            },
                            {
                            multi: true
                        })
                    }
                } else if (loggedInUser.role == "Academy") {
                    affiliatedTo = "academy";
                    var acadDetails = academyDetails.findOne({
                        userId: loggedInUser._id
                    });
                    if (acadDetails) {
                        interestedDomainName = acadDetails.interestedDomainName;
                        interestedProjectName = acadDetails.interestedProjectName;
                        var hh = associationDetails.findOne({
                            "userId": acadDetails.associationId
                        });
                        if (hh && hh.associationType == "District/City") {
                            parentAssociationId = hh.parentAssociationId;
                            associationId = hh.userId
                            j = global[toret].update({
                                userId: {
                                    $in: xData.userId
                                }
                            }, {
                                $set: {
                                    "associationId": associationId,
                                    "interestedProjectName": interestedProjectName,
                                    "interestedDomainName": interestedDomainName,
                                    "parentAssociationId": parentAssociationId,
                                    "affiliatedTo": affiliatedTo,
                                    "clubNameId":acadDetails.userId,
                                }
                            }, {
                                multi: true
                            });
                            
                            k = Meteor.users.update({
                            userId:{
                                $in:xData.userId
                            }
                            },{
                                $set:{
                                    "interestedProjectName": interestedProjectName,
                                }
                            },
                            {
                            multi: true
                            })
                        } else if (hh && hh.associationType == "State/Province/County") {
                            parentAssociationId = "";
                            associationId = hh.userId;
                            j = global[toret].update({
                                userId: {
                                    $in: xData.userId
                                }
                            }, {
                                $set: {
                                    "associationId": associationId,
                                    "interestedProjectName": interestedProjectName,
                                    "interestedDomainName": interestedDomainName,
                                    "affiliatedTo": affiliatedTo,
                                    "clubNameId":acadDetails.userId,
                                }
                            }, {
                                multi: true
                            });
                            k = Meteor.users.update({
                            userId:{
                                $in:xData.userId
                            }
                            },{
                                $set:{
                                    "interestedProjectName": interestedProjectName,
                                }
                            },
                            {
                            multi: true
                            })
                        }
                    }
                }
                if (j && k && giveDbDetails) {
                    var dataToret = []

                    var meteUsers = Meteor.users.find({
                        userId: {
                            $in: xData.userId
                        }
                    }).fetch()

                    var acadDet = global[toret].find({
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
                        "collectionName":toret,
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
                else if (j) {
                    return true
                }
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
    'updateUsersRemoveAffiliation': function(xData) {
        try{

            check(xData, Object);
            var loggedInUser = Meteor.users.findOne({
                "_id": this.userId
            });
            var affiliatedTo = "other";
            var parentAssociationId = "";
            var associationId = "";
            var interestedProjectName = "";
            var interestedDomainName = "";
            var j = "";

            var toret = false
            if(loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length){
                toret = playerDBFind(loggedInUser.interestedProjectName[0])
            }
            else{
                return false
            }

            if(toret){
                if (loggedInUser.role == "Association") {
                    var assocDetails = associationDetails.findOne({
                        userId: loggedInUser._id
                    })
                    if (assocDetails.associationType == "District/City") {
                        parentAssociationId = "";
                        associationId = "";
                        j = global[toret].update({
                            userId: {
                                $in: xData.userId
                            }
                        }, {
                            $set: {
                                "associationId": associationId,
                                "parentAssociationId": parentAssociationId,
                                "affiliatedTo": affiliatedTo,
                                "statusOfUser":"notApproved"
                            }
                        }, {
                            multi: true
                        });
                    } else if (assocDetails.associationType == "State/Province/County") {
                        associationId = "";
                        j = global[toret].update({
                            userId: {
                                $in: xData.userId
                            }
                        }, {
                            $set: {
                                "associationId": associationId,
                                "affiliatedTo": affiliatedTo,
                                "statusOfUser":"notApproved"
                            }
                        }, {
                            multi: true
                        });
                    }
                } else if (loggedInUser.role == "Academy") {
                    affiliatedTo = "other";
                    var acadDetails = academyDetails.findOne({
                        userId: loggedInUser._id
                    });
                    if (acadDetails) {
                        interestedDomainName = acadDetails.interestedDomainName;
                        interestedProjectName = acadDetails.interestedProjectName;
                        var hh = associationDetails.findOne({
                            "userId": acadDetails.associationId
                        });

                        if (hh && hh.associationType == "District/City") {
                            parentAssociationId = "";
                            associationId = ""
                            j = global[toret].update({
                                userId: {
                                    $in: xData.userId
                                }
                            }, {
                                $set: {
                                    "associationId": associationId,
                                    "clubNameId": "",
                                    "parentAssociationId": parentAssociationId,
                                    "affiliatedTo": affiliatedTo,
                                    "statusOfUser":"notApproved"
                                }
                            }, {
                                multi: true
                            });
                        } else if (hh) {
                            parentAssociationId = "";
                            associationId = ""
                            j = global[toret].update({
                                userId: {
                                    $in: xData.userId
                                }
                            }, {
                                $set: {
                                    "associationId": associationId,
                                    "clubNameId": "",
                                    "affiliatedTo": affiliatedTo,
                                    "statusOfUser":"notApproved"
                                }
                            }, {
                                multi: true
                            });

                        }
                    }
                }
                if (j) {
                    return true
                }
                else{
                    return false
                }
            } else{
                return false
            }
        }catch(e){
            return false
        }
    }
});


/*Meteor.methods({
    'insertNewPlayerFromAssocAcademy': function(xData, assocAcadId) {
        check(xData, Object);
        var loggedInUser = "";
        if (assocAcadId != undefined && assocAcadId !== null) {
            loggedInUser = Meteor.users.findOne({
                "_id": assocAcadId
            });
        }
        loggedInUser = Meteor.users.findOne({
            "_id": this.userId
        });
        var clubNameId = "";
        var associationId = "";
        var parentAssociationId = "";
        if (loggedInUser.role == "Association") {
            var assocDetails = associationDetails.findOne({
                userId: loggedInUser._id
            })
            if (assocDetails.associationType == "District/City") {
                var l;
                affiliatedTo = "districtAssociation";
                parentAssociationId = assocDetails.parentAssociationId;
                associationId = assocDetails.userId;
                interestedDomainName = assocDetails.interestedDomainName;
                interestedProjectName = assocDetails.interestedProjectName;
                CreateUserAccount(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName,loggedInUser,function(RES){
                    l = RES
                })
                return l;
            } else if (assocDetails.associationType == "State/Province/County") {
                var l;
                affiliatedTo = "stateAssociation";
                associationId = assocDetails.userId;
                interestedDomainName = assocDetails.interestedDomainName;
                interestedProjectName = assocDetails.interestedProjectName;
                CreateUserAccount(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName,loggedInUser,function(RES){
                  l = RES
                });
                return l
            }
        } else if (loggedInUser.role == "Academy") {
            affiliatedTo = "academy";
            var acadDetails = academyDetails.findOne({
                userId: loggedInUser._id
            });
            if (acadDetails) {
                interestedDomainName = acadDetails.interestedDomainName;
                interestedProjectName = acadDetails.interestedProjectName;
                var hh = associationDetails.findOne({
                    "userId": acadDetails.associationId
                });

                if (hh && hh.associationType == "District/City") {
                    var l;
                    parentAssociationId = hh.parentAssociationId;
                    associationId = hh.userId
                    clubNameId = acadDetails.userId
                    CreateUserAccount(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName,loggedInUser,function(RES){
                        l = RES
                    })
                    return l;
                } else if (hh && hh.associationType == "State/Province/County") {
                    var l;
                    parentAssociationId = "";
                    associationId = hh.userId
                    clubNameId = acadDetails.userId
                    CreateUserAccount(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName,loggedInUser,function(RES){
                        l = RES
                    })
                    return l;
                }
            }
        }
    }
});

//affiliationID remains
var CreateUserAccount = function(xData, assocAcadId, affiliatedTo, associationId, parentAssociationId, clubNameId, interestedProjectName, interestedDomainName,loggedInUser,xcallBack) {
    var playerID = "";
    var canInsert = [];
    var userDetailsTT_player;
    if(xData.state==undefined||xData.state==null){
        xData.state = loggedInUser.country
    }
    if(xData.country==undefined||xData.country==null){
        xData.country = loggedInUser.country
    }
    if (xData.emailAddress) {
        var password = randomPassword_Player(6);
        try {
            playerID = Accounts.createUser({
                email: xData.emailAddress.trim(),
                password: password.trim(),
                userName:xData.userName.trim()
            });
        } catch (e) {

        }
    } else {
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
        if (interestedDomainName == null)
            interestedDomainName = [""];
        if (xData.address == null)
            xData.address = " ";

        canInsert = userDetailsTT.find({
            userName: xData.userName.trim(),
            phoneNumber: xData.phoneNumber.trim(),
            gender: xData.gender,
            address: xData.address.trim(),
            city: xData.city.trim(),
            pinCode: xData.pinCode,
            guardianName: xData.guardianName.trim(),
            clubNameId:clubNameId
        }).fetch();

        if(canInsert.length==0){
            playerID = Meteor.users.insert({
               userName:xData.userName.trim()
            });
        }
        else return xcallBack("0");
    }
    try {
        if (canInsert.length==0) {
            var s = Meteor.users.update({
                "_id": playerID
            }, {
                $set: {
                    userId: playerID,
                    profileSettingStatus: false,
                    role: "Player",
                    interestedProjectName: interestedProjectName,
                    userName:xData.userName.trim(),
                    emailAddress: xData.emailAddress.trim()
                }
            });
            if (s) {
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
                if (interestedDomainName == null)
                    interestedDomainName = [""];
                if (xData.address == null)
                    xData.address = " ";
                try {
                    var tmpAffilationID = "TMP1";
                    var tempAffIDInfo = lastInsertedAffId.findOne({"assocId":"Temp"});
                    if(tempAffIDInfo)
                    {
                        tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                        tmpAffilationID="TMP"+tempAffIDInfo.lastInsertedId;
                    }

                     userDetailsTT_player = userDetailsTT.insert({
                        userId: playerID,
                        emailAddress: xData.emailAddress.trim(),
                        interestedDomainName: interestedDomainName,
                        interestedProjectName: interestedProjectName,
                        profileSettingStatus: true,
                        userName: xData.userName.trim(),
                        phoneNumber: xData.phoneNumber.trim(),
                        dateOfBirth: moment(s4).format("YYYY-MM-DD"),
                        role: "Player",
                        gender: xData.gender,
                        contactPerson: xData.contactPerson.trim(),
                        address: xData.address.trim(),
                        city: xData.city.trim(),
                        pinCode: xData.pinCode,
                        guardianName: xData.guardianName.trim(),
                        state: xData.state,
                        country: xData.country,
                        statusOfUser: "Active",
                        year: new Date().getFullYear(),
                        affiliatedTo: affiliatedTo,
                        affiliationId: "",
                        nationalAffiliationId: "",
                        associationId: associationId,
                        parentAssociationId: parentAssociationId,
                        clubNameId: clubNameId,
                        tempAffiliationId:tmpAffilationID                       

                    });

                } catch (e) {
                    var removePlayer = Meteor.users.remove({"_id":playerID});
                    userDetailsTT.remove({userId:playerID});
                    userDetailsTT_player = false
                }

                if (userDetailsTT_player) {
                    var profileUpdate = Meteor.users.update({
                        "_id": playerID
                    }, {
                        $set: {
                            profileSettingStatus: true,
                            verifiedBy:"email",
                            interestedProjectName:interestedProjectName
                        }
                    });

                    var tmpAffilationID = "TMP1";
                    var tempAffIDInfo = lastInsertedAffId.findOne({"assocId":"Temp"});
                    if(tempAffIDInfo)
                    {
                        tempAffIDInfo.lastInsertedId = parseInt(tempAffIDInfo.lastInsertedId) + 1;
                        lastInsertedAffId.update({"assocId":"Temp"},{$set:{lastInsertedId:tempAffIDInfo.lastInsertedId}});
                    }
                    else
                        lastInsertedAffId.insert({"assocId":"Temp",lastInsertedId:"1"});
                }
                return xcallBack(true);
            }
        }
    } catch (e) {

    }
}
*/

function randomPassword_Player(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

Meteor.methods({
    'renewAllPlayersStatus': function() {
        var userId = this.userId;
        if(userId){
            var userIdCheck = associationDetails.findOne({"associationType" : "State/Province/County",userId:userId});
            if(userIdCheck){

                var loggedInUser = Meteor.users.findOne({
                    "_id": this.userId
                });
                var toret = "userDetailsTT"

                if(loggedInUser && loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length){
                    var dbname = playerDBFind(loggedInUser.interestedProjectName[0])
                    if(dbname){
                        toret = dbname
                    }
                }

                var count = global[toret].update({
                    $or:[
                    {associationId:userId},
                    {parentAssociationId:userId}
                    ],
                    affiliationId:{$nin:["",null,undefined,"other"]},
                    statusOfUser:{$nin:["notApproved"]}
                },{$set:{
                    statusOfUser:"notApproved"
                }},{multi:true});
                return count
            }
        }
    }
});

Meteor.methods({
    'renewAllPlayersNumber': function() {
        var userId = this.userId;
        if(userId){
            var userIdCheck = associationDetails.findOne({"associationType" : "State/Province/County",userId:userId});
            if(userIdCheck){
                var loggedInUser = Meteor.users.findOne({
                    "_id": this.userId
                });
                var toret = "userDetailsTT"

                if(loggedInUser && loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length){
                    var dbname = playerDBFind(loggedInUser.interestedProjectName[0])
                    if(dbname){
                        toret = dbname
                    }
                }

                var count = global[toret].find({
                    $or:[
                    {associationId:userId},
                    {parentAssociationId:userId}
                    ],
                    affiliationId:{$nin:["",null,undefined,"other"]},
                    statusOfUser:{$nin:["notApproved"]}
                }).fetch();
                return count.length
            }
        }
    }
});

Meteor.methods({
    "checkAFFID":function(data){
       if(data!=undefined){
        var loggedInUser = Meteor.users.findOne({
            "_id": data
        });
        var toret = "userDetailsTT"

        if(loggedInUser && loggedInUser.interestedProjectName && loggedInUser.interestedProjectName.length){
            var dbname = playerDBFind(loggedInUser.interestedProjectName[0])
            if(dbname){
                toret = dbname
            }
        }

        var checkForAFFID = global[toret].findOne({"_id":data});
        if(checkForAFFID&&checkForAFFID.affiliationId&&checkForAFFID.affiliationId!=undefined&&checkForAFFID.affiliationId!="other"&&checkForAFFID.affiliationId.trim().length!=0){
            return false
        }
        else return true
       }
    }
})