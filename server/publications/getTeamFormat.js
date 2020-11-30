import {
    playerDBFind
}
from '../methods/dbRequiredRole.js'
//userDetailsTTUsed

Meteor.publish('teamFormatForUsers', function() {
    try {
        var hh = []
        var k;
        var lUserId = Meteor.users.findOne({
            "_id": this.userId
        });
        if (lUserId) {
            if (lUserId.role == "Association") {
                var assocFind = associationDetails.findOne({
                    "userId": lUserId.userId
                });
                if (assocFind && assocFind.interestedProjectName) {
                    lUserId.interestedProjectName = assocFind.interestedProjectName;
                }
            } else if (lUserId.role == "Academy") {
                var acadDetails = academyDetails.findOne({
                    "userId": lUserId.userId
                });
                if (acadDetails && acadDetails.interestedProjectName) {
                    lUserId.interestedProjectName = acadDetails.interestedProjectName;
                }
            } else if (lUserId.role == "Player" && lUserId.interestedProjectName && lUserId.interestedProjectName.length) {
                var toret = playerDBFind(lUserId.interestedProjectName[0])
                var userDetails;

                if (toret) {
                    userDetails = global[toret].findOne({
                        "userId": lUserId.userId
                    });
                    if (userDetails && userDetails.interestedProjectName) {
                        lUserId.interestedProjectName = userDetails.interestedProjectName;
                    }
                }

            } else if (lUserId.role == "Umpire" || lUserId.role == "Coach" || lUserId.role == "Organiser" || lUserId.role == "Other" || lUserId.role == "Journalist") {
                var otherDetails = otherUsers.findOne({
                    "userId": lUserId.userId
                });
                if (otherDetails && otherDetails.interestedProjectName) {
                    lUserId.interestedProjectName = otherDetails.interestedProjectName;
                }
            }
        }
        if (lUserId != undefined && lUserId.interestedProjectName) 
        {
            k = teamsFormat.find({
                "selectedProjectId": lUserId.interestedProjectName.toString()
            })
            if (k) {
                return k
            }
            return this.ready();
        }
    } catch (e) {

    }
});

Meteor.publish("adminTF",function(){
     var lUserId = Meteor.users.findOne({
            "_id": this.userId
        });
     if(lUserId)
     {
         k = teamsFormat.find({
                
            })
            if (k) {
                return k
            }
            return this.ready();
     }
})

Meteor.publish('usersForTeams', function(searchValue, searchCriteria) {
    try {
        if (searchValue != null && searchValue != undefined) {
            var gender_H = searchCriteria.gender_HD
            var dateType_H = searchCriteria.dateType_HD
            if (searchCriteria.dateValue_HD)
                var dateValue_H = searchCriteria.dateValue_HD

            var locationType_H = searchCriteria.locationType_HD
            var mandatory_H = searchCriteria.mandatory_HD
            var rankedOrNot_H = searchCriteria.rankedOrNot_HD

            var usersDet = [];
            var locId;
            var gender_H2 = "";
            var gender_H3 = "";
            var gender_H4 = "";

            var queryForDB = {};
            var queryForLocation = {};
            var queryForGender = {};
            var queryForAffiliation = {};

            if (gender_H.toLowerCase() == "male") {
                gender_H = "Male"
                gender_H2 = "male"
            } else if (gender_H.toLowerCase() == "female") {
                gender_H = "Female"
                gender_H2 = "female"
            } else {
                gender_H = "male"
                gender_H2 = "female"
                gender_H3 = "Male"
                gender_H4 = "Female"
            }

            var queryForGender = {
                $or: [{
                    gender: gender_H
                }, {
                    gender: gender_H2
                }, {
                    gender: gender_H3
                }, {
                    gender: gender_H4
                }]
            }

            var lUserId = Meteor.users.findOne({
                "_id": this.userId
            });
            if (lUserId) {
                if (lUserId.role == "Association") {
                    var assocFind = associationDetails.findOne({
                        "userId": lUserId.userId
                    });
                    if (assocFind && assocFind.userId) {
                        locId = assocFind.userId;
                    }
                    if (locationType_H == "local") {
                        if (assocFind.associationType == "State/Province/County") {
                            queryForLocation = {
                                $or: [{
                                    'associationId': locId
                                }, {
                                    'parentAssociationId': locId
                                }]
                            }
                        } else if (lUserId.associationType == "District/City") {
                            queryForLocation = {
                                'associationId': locId
                            }
                        }
                    } else if (locationType_H == "imported") {
                        if (assocFind.associationType == "State/Province/County") {
                            queryForLocation = {
                                $and: [{
                                    'associationId': {
                                        $ne: locId
                                    }
                                }, {
                                    'parentAssociationId': {
                                        $ne: locId
                                    }
                                }]
                            }
                        } else if (lUserId.associationType == "District/City") {
                            if (assocFind.parentAssociationId) {
                                queryForLocation = {
                                    $and: [{
                                        'associationId': {
                                            $ne: locId
                                        }
                                    }, {
                                        'parentAssociationId': assocFind.parentAssociationId
                                    }]
                                }
                            }
                        }
                    }
                } else if (lUserId.role == "Academy") {
                    var acadDetails = academyDetails.findOne({
                        "userId": lUserId.userId
                    });
                    if (acadDetails && acadDetails.userId) {
                        locId = acadDetails.userId;
                    }
                    if (locationType_H == "local") {
                        queryForLocation = {
                            'clubNameId': locId
                        }
                    } else if (locationType_H == "imported") {
                        if (acadDetails.associationId) {
                            queryForLocation = {
                                $and: [{
                                    affiliatedTo: "academy"
                                }, {
                                    'clubNameId': {
                                        $ne: locId
                                    }
                                }, {
                                    'associationId': acadDetails.associationId
                                }, ]
                            }
                        }
                    }
                } else if (lUserId.role == "Player" && lUserId.interestedProjectName &&
                    lUserId.interestedProjectName.length) {

                    var toret = playerDBFind(lUserId.interestedProjectName[0])

                    if (toret) {
                        var userDetails = global[toret].findOne({
                            "userId": lUserId.userId
                        });
                        if (userDetails && userDetails.affiliatedTo) {
                            if (userDetails.affiliatedTo == "stateAssociation" && userDetails.associationId && userDetails.associationId != "other") {
                                locId = userDetails.associationId;
                                if (locationType_H == "local") {
                                    queryForLocation = {
                                        $and: [{
                                            'associationId': locId,
                                            'affiliatedTo': userDetails.affiliatedTo
                                        }]
                                    }
                                } else if (locationType_H == "imported") {
                                    queryForLocation = {
                                        $and: [{
                                            'associationId': {
                                                $ne: locId
                                            },
                                            'affiliatedTo': userDetails.affiliatedTo
                                        }]
                                    }
                                }
                            } else if (userDetails.affiliatedTo == "districtAssociation" && userDetails.associationId && userDetails.associationId != "other") {
                                locId = userDetails.associationId
                                if (locationType_H == "local") {
                                    queryForLocation = {
                                        $and: [{
                                            'associationId': locId,
                                            'affiliatedTo': userDetails.affiliatedTo
                                        }]
                                    }
                                } else if (locationType_H == "imported") {
                                    queryForLocation = {
                                        $and: [{
                                            'associationId': {
                                                $ne: locId
                                            },
                                            'affiliatedTo': userDetails.affiliatedTo
                                        }]
                                    }
                                }
                            } else if (userDetails.affiliatedTo == "academy" && userDetails.clubNameId && userDetails.clubNameId != "other") {
                                locId = userDetails.clubNameId
                                if (locationType_H == "local") {
                                    queryForLocation = {
                                        $and: [{
                                            'clubNameId': locId,
                                            'affiliatedTo': userDetails.affiliatedTo
                                        }]
                                    }
                                } else if (locationType_H == "imported") {
                                    queryForLocation = {
                                        $and: [{
                                            'clubNameId': {
                                                $ne: locId
                                            },
                                            'affiliatedTo': userDetails.affiliatedTo
                                        }]
                                    }
                                }
                            }
                            else if (userDetails.affiliatedTo == "other" ) {
                                //locId = userDetails.clubNameId
                                if (locationType_H == "local") {
                                    queryForLocation = {
                                        $and: [{
                                            //'clubNameId': locId,
                                            'affiliatedTo': userDetails.affiliatedTo
                                        }]
                                    }
                                } 
                                else if (locationType_H == "imported") {
                                    queryForLocation = {
                                        $and: [{
                                            //'clubNameId': {
                                              //  $ne: locId
                                            //},
                                            'affiliatedTo': userDetails.affiliatedTo
                                        }]
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (locationType_H == "any") {
                queryForLocation = {}
            }

            if (dateType_H == "onBefore") {
                queryForDB = {
                    dateOfBirth: {
                        $lte: new Date(moment(new Date(dateValue_H)).format("YYYY-MM-DD"))
                    }
                }
            } else if (dateType_H == "before") {
                queryForDB = {
                    dateOfBirth: {
                        $lt: new Date(moment(new Date(dateValue_H)).format("YYYY-MM-DD"))
                    }
                }
            } else if (dateType_H == "onAfter") {
                queryForDB = {
                    dateOfBirth: {
                        $gte: new Date(moment(new Date(dateValue_H)).format("YYYY-MM-DD"))
                    }
                }
            } else if (dateType_H == "after") {
                queryForDB = {
                    dateOfBirth: {
                        $gt: new Date(moment(new Date(dateValue_H)).format("YYYY-MM-DD"))
                    }
                }
            } else if (dateType_H == "any") {
                queryForDB = {}
            }

            if (rankedOrNot_H == "yes") {
                queryForAffiliation = {
                    "affiliationId": {
                        $nin: [null, "", "other"]
                    }
                }
            } else if (rankedOrNot_H == "no") {
                queryForAffiliation = {}
            }

            var reObj = new RegExp('^' + searchValue.trim(), 'i');
            if (this.userId != undefined) {

                var toret = "userDetailsTT"

                var usersMet = Meteor.users.findOne({
                    userId: this.userId
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                        
                        

                        var lData = global[toret].find({
                            $and: [{
                                    userName: {
                                        $regex: reObj
                                    }
                                },
                                queryForGender,
                                queryForLocation,
                                queryForDB,
                                queryForAffiliation, {
                                    "affiliatedTo": {
                                        $nin: ["school"]
                                    }
                                }, {
                                    "statusOfUser": "Active"
                                }
                            ]
                        }, {
                            sort: {
                                userName: 1
                            },
                            fields: {
                                userName: 1,
                                userId: 1
                            },
                            limit: 15
                        });
                        
                        return lData
                    }
                }
            }
        }
    } catch (e) {}
});

Meteor.publish('teamForEdit', function(routerId) {
    if (routerId) {
        if (this.userId) {
            var lData = playerTeams.find({
                "teamManager": this.userId,
                "_id": routerId
            });;
            if (lData)
                return lData
            return this.ready();
        }
    }
});

Meteor.publish('playerTeamsPub', function() {
    if (this.userId) {
        var lData = playerTeams.find({
            "teamManager": this.userId,
        });
        if (lData)
            return lData;
        return this.ready();
    }
});

Meteor.publish('teamsOfUserBasedOnTeamType', function(tournamentId, eventId) {
    try {
        var arrayOfTeams;
        arrayOfTeams = playerTeams.find({
            teamManager: this.userId
        });
        if (arrayOfTeams)
            return arrayOfTeams;
        return this.ready()
    } catch (e) {}
})

Meteor.publish('teamsOfUserBasedOnUser', function(userId) {
    try {
        var arrayOfTeams;
        arrayOfTeams = playerTeams.find({
            teamManager: userId
        });
        if (arrayOfTeams)
            return arrayOfTeams;
        return this.ready()
    } catch (e) {}
})

Meteor.publish('playerTeamEntries', function(tournamentId) {
    try {
        var subDetails = playerTeamEntries.find({
            "tournamentId": tournamentId,
            playerId: this.userId
        })
        if (subDetails)
            return subDetails
        return this.ready()
    } catch (e) {}
});

Meteor.publish('playerTeamEntriesAdmin', function(tournamentId, userId) {
    try {
        var subDetails = playerTeamEntries.find({
            "tournamentId": tournamentId,
            playerId: userId
        })
        if (subDetails)
            return subDetails
        return this.ready()
    } catch (e) {}
});

Meteor.publish('playerTeamEntriesForReceipt',  function(tournamentId) {
    try {

        var dbsrequired = ["playerTeamEntries"]
        var playerTeamEntriess = "playerTeamEntries"

        if (tournamentId) {
            var res =  Meteor.call("changeDbNameForDraws", tournamentId, dbsrequired)
            try {
                if (res) {
                    if (res.changeDb && res.changeDb == true) {
                        if (res.changedDbNames.length != 0) {
                            playerTeamEntriess = res.changedDbNames[0]
                        }
                    }
                }
            }catch(e){}
        }
        var subDetails = global[playerTeamEntriess].find({
            "tournamentId": tournamentId
        })
        if (subDetails)
            return subDetails
        return this.ready()
    } catch (e) {}
});

Meteor.publish('playerIndEntriesForReceipt',  function(tournamentId) {
    try {
        var dbsrequired = ["playerEntries"]
        var playerEntriess = "playerEntries"
        if (tournamentId) {
            var res =  Meteor.call("changeDbNameForDraws", tournamentId, dbsrequired)
            try {
                if (res) {
                    if (res.changeDb && res.changeDb == true) {
                        if (res.changedDbNames.length != 0) {
                            playerEntriess = res.changedDbNames[0]
                        }
                    }
                }
            }catch(e){}
        }
        var subDetails = global[playerEntriess].find({
            "tournamentId": tournamentId
        })
        if (subDetails) {
            return subDetails
        }

        return this.ready()
    } catch (e) {}
});