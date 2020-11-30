import {
    Meteor
}
from 'meteor/meteor';
import {
    Mongo
}
from 'meteor/mongo';
import {
    check
}
from 'meteor/check';
import {
    nameToCollection
}
from '../methods/dbRequiredRole.js'
import {
    playerDBFind
}
from '../methods/dbRequiredRole.js'

//userDetailsTTUsed
var organizedTourList = [];

Meteor.methods({
    getPlayerList: async function(filterBy, filterData, filterGender) {
        try {

            filterBy = filterBy.trim();
            filterData = filterData.trim();
            var userDetail = [];
            var eventArray = [];
            var count = 0;
            var arr = [];
            var userList = "";


            if (filterBy == "Association") 
            {
                var associationInfo = associationDetails.findOne({
                    "userId": filterData
                });
                if (associationInfo) {
                    if (associationInfo.interestedProjectName && associationInfo.interestedProjectName.length > 0) {

                        if (associationInfo.interestedProjectName[0] != "" && associationInfo.interestedProjectName[0] != null &&
                            associationInfo.interestedProjectName[0] != undefined) {
                            var sportID = associationInfo.interestedProjectName[0];
                            var response = await Meteor.call("getassociatedusersAPI", sportID, filterData, filterGender, '')
                            try {
                                if (response) {
                                    userList = response;
                                    for (var i = 0; i < userList.length; i++) {
                                        userList[i]["academy"] = "";
                                        userList[i]["stateName"] = "";
                                        userList[i]["associationName"] = "";


                                        if (userList[i].clubNameId) {
                                            var clubInfo = academyDetails.findOne({
                                                "userId": userList[i].clubNameId
                                            });
                                            if (clubInfo)
                                                userList[i]["academy"] = clubInfo.clubName
                                        }
                                        if (userList[i].state) {
                                            var statInfo = domains.findOne({
                                                "_id": userList[i].state
                                            });
                                            if (statInfo)
                                                userList[i]["stateName"] = statInfo.domainName
                                        }
                                        if (userList[i].affiliatedTo) {
                                            if (userList[i].affiliatedTo == "districtAssociation" && userList[i].parentAssociationId) {
                                                var associationInfo = associationDetails.findOne({
                                                    "userId": userList[i].associationId
                                                });
                                                if (associationInfo)
                                                    userList[i]["associationName"] = associationInfo.associationName;
                                            } else if (userList[i].affiliatedTo == "stateAssociation") {
                                                var associationInfo = associationDetails.findOne({
                                                    "userId": userList[i].associationId
                                                });
                                                if (associationInfo)
                                                    userList[i]["associationName"] = associationInfo.associationName
                                            } else if (userList[i].affiliatedTo == "academy") {
                                                if (userList[i].parentAssociationId) {
                                                    var associationInfo = associationDetails.findOne({
                                                        "userId": userList[i].associationId
                                                    });
                                                    if (associationInfo)
                                                        userList[i]["associationName"] = associationInfo.associationName
                                                } else {
                                                    var associationInfo = associationDetails.findOne({
                                                        "userId": userList[i].associationId
                                                    });
                                                    if (associationInfo)
                                                        userList[i]["associationName"] = associationInfo.associationName
                                                }
                                            }
                                        }
                                    }
                                }
                            } catch (e) {}
                        }

                    }
                }
            }
            if (filterBy == "Institution/Academy") {
                var academyInfo = academyDetails.findOne({
                    "userId": filterData
                });
                if (academyInfo) {
                    if (academyInfo.interestedProjectName && academyInfo.interestedProjectName.length > 0) {
                        if (academyInfo.interestedProjectName[0] != "" && academyInfo.interestedProjectName[0] != null &&
                            academyInfo.interestedProjectName[0] != undefined) {
                            var sportID = academyInfo.interestedProjectName[0];
                            var response = await Meteor.call("getacademyusersAPI", sportID, filterData, filterGender, '')
                            try {
                                if (response) {
                                    userList = response;
                                    var academy = "";
                                    var academyInfo = academyDetails.findOne({
                                        "userId": filterData
                                    });
                                    if (academyInfo)
                                        academy = academyInfo.clubName;
                                    for (var i = 0; i < userList.length; i++) {
                                        userList[i]["academy"] = academy;
                                        if (userList[i].state) {
                                            var statInfo = domains.findOne({
                                                "_id": userList[i].state
                                            });
                                            if (statInfo)
                                                userList[i]["stateName"] = statInfo.domainName
                                        }
                                        if (userList[i].affiliatedTo) {
                                            if (userList[i].affiliatedTo == "districtAssociation" && userList[i].parentAssociationId) {
                                                var associationInfo = associationDetails.findOne({
                                                    "userId": userList[i].associationId
                                                });
                                                if (associationInfo)
                                                    userList[i]["associationName"] = associationInfo.associationName;
                                            } else if (userList[i].affiliatedTo == "stateAssociation") {
                                                var associationInfo = associationDetails.findOne({
                                                    "userId": userList[i].associationId
                                                });
                                                if (associationInfo)
                                                    userList[i]["associationName"] = associationInfo.associationName
                                            } else if (userList[i].affiliatedTo == "academy") {
                                                if (userList[i].parentAssociationId) {
                                                    var associationInfo = associationDetails.findOne({
                                                        "userId": userList[i].associationId
                                                    });
                                                    if (associationInfo)
                                                        userList[i]["associationName"] = associationInfo.associationName
                                                } else {
                                                    var associationInfo = associationDetails.findOne({
                                                        "userId": userList[i].associationId
                                                    });
                                                    if (associationInfo)
                                                        userList[i]["associationName"] = associationInfo.associationName
                                                }
                                            }
                                        }
                                    }
                                }

                            } catch (e) {}
                        }
                    }
                }
            }

            return userList;
        } catch (e) {
        }

    },


   

    getPlayerInfo: function(playerID) {
        var userInfo = Meteor.users.findOne({
            "userId": playerID
        });
        if (userInfo)
            return userInfo;
    },





});


////@Author vinayashree
Meteor.methods({

    myEntriesAPI: function(caller, apiKey, userId) {
        if (apiUsers.findOne({
                "apiUser": caller
            }).apiKey != apiKey) {
            return;
        } else if (apiUsers.findOne({
                "apiUser": caller
            }).apiKey == apiKey) {
            try {
                var eventssubscribed = events.find({
                    eventParticipants: userId
                }).fetch();
                return eventssubscribed
            } catch (e) {}
        }
    },


})


Meteor.methods({
    upcominEventsForAllRoles: function(userId) {
        try {
            if (userId != null && userId != undefined && userId.trim().length != 0) {
                var hh = []
                var k;
                var lUserId = Meteor.users.findOne({
                    "_id": userId
                });
                if (lUserId) {

                    if (lUserId.role == "Association") {
                        var assocFind = associationDetails.findOne({
                            "userId": lUserId.userId
                        });
                        if (assocFind && assocFind.interestedDomainName && assocFind.interestedProjectName) {
                            lUserId.interestedProjectName = assocFind.interestedProjectName;
                            lUserId.interestedDomainName = assocFind.interestedDomainName
                        }
                    } else if (lUserId.role == "Academy") {
                        var acadDetails = academyDetails.findOne({
                            "userId": lUserId.userId
                        });
                        if (acadDetails && acadDetails.interestedDomainName && acadDetails.interestedProjectName) {
                            lUserId.interestedProjectName = acadDetails.interestedProjectName;
                            lUserId.interestedDomainName = acadDetails.interestedDomainName
                        }
                    } else if (lUserId.role == "Player") {
                        var usermet = Meteor.users.findOne({
                            "userId": lUserId.userId
                        })

                        var toret = "userDetailsTT"
                        if (usermet && usermet.interestedProjectName && usermet.interestedProjectName.length) {
                            var dbname = playerDBFind(usermet.interestedProjectName[0])
                            if (dbname) {
                                toret = dbname
                            }
                        }

                        var userDetails = global[toret].findOne({
                            "userId": lUserId.userId
                        });
                        if (userDetails && userDetails.interestedDomainName && userDetails.interestedProjectName) {
                            lUserId.interestedProjectName = userDetails.interestedProjectName;
                            lUserId.interestedDomainName = userDetails.interestedDomainName
                        }
                    } else if (lUserId.role == "Umpire" || lUserId.role == "Coach" || lUserId.role == "Organiser" || lUserId.role == "Other" || lUserId.role == "Journalist") {
                        var otherDetails = otherUsers.findOne({
                            "userId": lUserId.userId
                        });
                        if (otherDetails && otherDetails.interestedDomainName && otherDetails.interestedProjectName) {
                            lUserId.interestedProjectName = otherDetails.interestedProjectName;
                            lUserId.interestedDomainName = otherDetails.interestedDomainName
                        }
                    }
                }

                if (lUserId != undefined && lUserId.interestedDomainName && lUserId.interestedProjectName) {
                    k = events.find({
                        domainId: {
                            $in: lUserId.interestedDomainName
                        },
                        projectId: {
                            $in: lUserId.interestedProjectName
                        },
                        tournamentEvent: true,
                    }, {
                        sort: {
                            eventEndDate1: -1
                        },
                    }).fetch();
                    if (k) {
                        return k;
                    }
                }
            }
        } catch (e) {}
    }
});