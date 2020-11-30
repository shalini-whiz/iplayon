Meteor.methods({
    "movePlayersAcrossClub": function(xData1, xData2) {
        var assocFrom = xData1.assocFrom;
        var acadFrom = xData1.acadFrom;
        var assocTo = xData1.assocTo;
        var acadTo = xData1.acadTo;
        var userIdsToMove = xData2;
        var assocToDet = Meteor.users.findOne({
            "_id": assocTo
        });
        var acadToDet = Meteor.users.findOne({
            "_id": acadTo
        });
        var assocFromDet = Meteor.users.findOne({
            "_id": assocFrom
        });
        var acadFromDet = Meteor.users.findOne({
            "_id": acadFrom
        });
        var updatedPlayersDetails = [];
        if (assocToDet && assocFromDet && acadFromDet && acadToDet) {
            if (assocTo == assocFrom) {
                for (var i = 0; i < userIdsToMove.length; i++) {
                    var userDet = Meteor.users.findOne({
                        "_id": userIdsToMove[i]
                    });
                    if (userDet) {
                        var j = Meteor.users.update({
                            "_id": userIdsToMove[i]
                        }, {
                            $set: {
                                interestedDomainName: acadToDet.interestedDomainName,
                                interestedProjectName: acadToDet.interestedProjectName,
                                interestedSubDomain1Name: acadToDet.interestedSubDomain1Name,
                                interestedSubDomain2Name: acadToDet.interestedSubDomain2Name,
                                clubName: acadToDet.clubName,
                                associationId: acadToDet.associationId,
                                "parentAssociationId": acadToDet.parentAssociationId,
                                clubNameId: acadToDet._id,
                                statusOfUser: "notApproved",
                            }
                        })
                        if (j) {
                            var r = Meteor.users.findOne({
                                "_id": userIdsToMove[i]
                            })
                            if (r) {
                                if (r.emails == undefined || r.emails == null) {
                                    emails = ""
                                } else {
                                    if (r.emails[0].address) {
                                        emails = r.emails[0].address
                                    } else {
                                        emails = r.emails[0].address
                                    }
                                }
                                if (r.contactPerson == undefined || r.contactPerson == null) {
                                    r.contactPerson = ""
                                }
                                if (r.address == undefined || r.address == null) {
                                    r.address = ""
                                }
                                if (r.nationalAffiliationId == undefined || r.nationalAffiliationId == null) {
                                    r.address = ""
                                }
                                if (r.affiliationId == undefined || r.affiliationId == null) {
                                    r.affiliationId = ""
                                }
                                if (r.parentAssociationId == undefined || r.parentAssociationId == null) {
                                    r.parentAssociationId = ""
                                }
                                var data = {
                                    "_id": r._id,
                                    "affiliationId": r.affiliationId,
                                    "userName": r.userName,
                                    "guardianName": r.guardianName,
                                    "emailAddress": emails,
                                    "interestedDomainName": r.interestedDomainName,
                                    "interestedProjectName": r.interestedProjectName,
                                    "clubName": r.clubName,
                                    "clubNameId": r.clubNameId,
                                    "associationId": r.associationId,
                                    "parentAssociationId": r.parentAssociationId,
                                    "phoneNumber": r.phoneNumber,
                                    "role": "Player",
                                    "contactPerson": r.contactPerson,
                                    "state": r.state,
                                    "dateOfBirth": r.dateOfBirth,
                                    "gender": r.gender,
                                    "country": r.country,
                                    "address": r.address,
                                    "city": r.city,
                                    "pinCode": r.pinCode,
                                    "userId": r.userId,
                                    "year": r.year,
                                    "statusOfUser": r.statusOfUser,
                                    "nationalAffiliationId": r.nationalAffiliationId,
                                }
                                updatedPlayersDetails.push(data)
                            }
                        }
                    }
                }
                return updatedPlayersDetails;
            } else {

            }
        }
    }
});

Meteor.methods({
    "adminSETStatusOfUser": function(xData1, xData2) {
        //userDetailsTTUsed
        var userDetUndStatus = userDetailsTT.find({
            $or: [{
                statusOfUser: null
            }, {
                statusOfUser: undefined
            }, {
                statusOfUser: ""
            }]
        }).fetch();
        var counterUpdated = 0;
        if (userDetUndStatus) {
            for (var i = 0; i < userDetUndStatus.length; i++) {
                if (userDetUndStatus[i].statusOfUser == null || userDetUndStatus[i].statusOfUser == undefined || userDetailsTT[i].statusOfUser.trim().length == 0) {
                    userDetailsTT.update({
                        "_id": userDetUndStatus[i]._id
                    }, {
                        $set: {
                            statusOfUser: "Active"
                        }
                    })
                    counterUpdated = parseInt(counterUpdated + 1)
                }
            }
            return counterUpdated
        }
    }
});

Meteor.methods({
    "adminSETDOBOfUser": function(xData1, xData2) {
        var userDetUndStatus = userDetailsTT.find({}).fetch();
        var counterUpdated = 0;
        if (userDetUndStatus) {
            for (var i = 0; i < userDetUndStatus.length; i++) {
                if (!userDetUndStatus[i].dateOfBirth || userDetUndStatus[i].dateOfBirth == null || userDetUndStatus[i].dateOfBirth == undefined) {
                    userDetailsTT.update({
                        "_id": userDetUndStatus[i]._id
                    }, {
                        $set: {
                            dateOfBirth: "1990 JUN 6"
                        }
                    })
                    counterUpdated = parseInt(counterUpdated + 1)
                }
            }
            return counterUpdated
        }
    }
});

Meteor.methods({
    "adminSETGENDEROfUser": function(xData1, xData2) {
        var userDetUndStatus = userDetailsTT.find({}).fetch();
        var counterUpdated = 0;
        if (userDetUndStatus) {
            for (var i = 0; i < userDetUndStatus.length; i++) {
                if (!userDetUndStatus[i].gender || userDetUndStatus[i].gender == null || userDetUndStatus[i].gender == undefined) {
                    userDetailsTT.update({
                        "_id": userDetUndStatus[i]._id
                    }, {
                        $set: {
                            gender: "Male"
                        }
                    })
                    counterUpdated = parseInt(counterUpdated + 1)
                }
            }
            return counterUpdated
        }
    }
});

Meteor.methods({
    "downloadNullGenderPlayers": function(xData1, xData2) {
        var userDetUndStatus = userDetailsTT.find({
            gender: null
        }, {
            fields: {
                userId: 1,
                userName: 1
            }
        }).fetch();
        var counterUpdated = 0;
        if (userDetUndStatus.length != 0) {
            return userDetUndStatus
        } else {
            userDetUndStatus = []
            return userDetUndStatus
        }
    }
});

Meteor.methods({
    "downloadNullDOBPlayers": function(xData1, xData2) {
        var userDetUndStatus = userDetailsTT.find({
            dateOfBirth: null
        }, {
            fields: {
                userId: 1,
                userName: 1
            }
        }).fetch();
        var counterUpdated = 0;
        if (userDetUndStatus.length != 0) {
            return userDetUndStatus
        } else {
            userDetUndStatus = []
            return userDetUndStatus
        }
    }
});

Meteor.methods({
    "updateGenderPlayers": function(xData1) {
        var counterUpdated = 0;
        if (xData1) {
            for (var i = 0; i < xData1.length; i++) {
                if (xData1[i].userId && xData1[i].gender) {
                    var userDetUndStatus = userDetailsTT.findOne({
                        "userId": xData1[i].userId
                    })
                    if (userDetUndStatus && (userDetUndStatus.gender == null || userDetUndStatus.gender == undefined || userDetUndStatus.gender.trim().length == 0)) {
                        userDetailsTT.update({
                            "userId": userDetUndStatus.userId
                        }, {
                            $set: {
                                gender: xData1[i].gender
                            }
                        })
                        counterUpdated = parseInt(counterUpdated + 1)
                    }
                }
            }
            return counterUpdated
        }
    }
});

Meteor.methods({
    "updateDOBPlayers": function(xData1) {
        var counterUpdated = 0;
        if (xData1) {
            for (var i = 0; i < xData1.length; i++) {
                if (xData1[i].userId && xData1[i].dateOfBirth) {
                    var userDetUndStatus = userDetailsTT.findOne({
                        "userId": xData1[i].userId
                    })
                    if (userDetUndStatus && (userDetUndStatus.dateOfBirth == null || userDetUndStatus.dateOfBirth == undefined || userDetUndStatus.dateOfBirth.trim().length == 0)) {
                        userDetailsTT.update({
                            "userId": userDetUndStatus.userId
                        }, {
                            $set: {
                                dateOfBirth: xData1[i].dateOfBirth
                            }
                        })
                        counterUpdated = parseInt(counterUpdated + 1)
                    }
                }
            }
            return counterUpdated
        }
    }
});

Meteor.methods({
    "insertAutoTweetMessagesHashTags": function() {
        var jsons = [{
            "typeOfEvent": "tournamentAnnouncement",
            "referWEB": "www.iplayon.in",
            "message1": "has announced a tournament"
        }, {
            "typeOfEvent": "tournamentModification",
            "referWEB": "www.iplayon.in",
            "message1": "is modified"
        }, {
            "typeOfEvent": "entriesOpen",
            "referWEB": "www.iplayon.in",
            "message1": "entries starts on"
        }, {
            "typeOfEvent": "entriesClose",
            "referWEB": "www.iplayon.in",
            "message1": "entries closes on"
        }, {
            "typeOfEvent": "drawsCreated",
            "referWEB": "www.iplayon.in",
            "message1": "draws created for tournament"
        }, {
            "typeOfEvent": "matchCompleted",
            "referWEB": "www.iplayon.in",
            "message1": "Match completed"
        }, {
            "typeOfEvent": "bye",
            "referWEB": "www.iplayon.in",
            "message1": "Given a Bye"
        }, {
            "typeOfEvent": "walkOver",
            "referWEB": "www.iplayon.in",
            "message1": "Receives Walkover"
        }, {
            "typeOfEvent": "nextRoundTeamADecided",
            "referWEB": "www.iplayon.in",
            "message1": "Team A For Round:"
        }, {
            "typeOfEvent": "nextRoundTeamBDecided",
            "referWEB": "www.iplayon.in",
            "message1": "Team B For Round:"
        }, {
            "typeOfEvent": "nextRoundTeamsDecided",
            "referWEB": "www.iplayon.in",
            "message1": "Teams For Round:"
        }];

        jsons.forEach(function (domainName, index, array) {
            autoTweetMessages.insert(
                 domainName
            );
        })
    }
});


Meteor.methods({
    "barChartColorInsert":function(){        
        if(barChartColor.findOne({"key":"BAR"})==undefined){
            var jsons = [{
                key:"BAR",
                player1Color:"#5BC0DE",
                player2Color:"#d0d0d0",
                player2FontColor:"black",
                player1FontColor:"white"
            }];
            jsons.forEach(function (domainName, index, array) {
                barChartColor.insert(
                     domainName
                );
            });
        }
    }
})