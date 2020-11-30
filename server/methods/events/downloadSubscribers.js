import {
    playerDBFind
}
from '../dbRequiredRole.js'

//userDetailsTTUsed

    /**** upcoming subscribers download ****/
    //**emailaddress**
Meteor.methods({

    "checkProjectType": function(xData, loggedID) {
        try {
            var userId = Meteor.users.findOne({
                "_id": loggedID
            })
            var doa = events.findOne({
                "eventOrganizer": userId.userId.toString(),
                "_id": xData
            });
            if (doa) {
                if (doa.projectType) {
                    projectType = doa.projectType;
                    if (projectType == 1)
                        return "individual";
                    else if (projectType == 2)
                        return "team";
                }
            }

        } catch (e) {

        }
    },

    "eventWiseSubscribersDownload": function(xData, loggedID) {
        try {


            var playerList = [];
            var count = 0;
            check(xData, String)



            var eventName = "";
            var tournamentId = "";
            var sportId = "";
            var eventRanking = "";
            var projectType = "";
            var userId = Meteor.users.findOne({
                "_id": loggedID
            })
            var doa = events.findOne({
                "eventOrganizer": userId.userId.toString(),
                "_id": xData
            });

            if (doa) {
                if (doa.eventName && doa.eventParticipants) {
                    eventName = doa.eventName;
                    eventParticipantList = doa.eventParticipants;
                    tournamentId = doa.tournamentId;
                    var eventId = doa.projectId[0];

                    var tourInfo = events.findOne({
                        "_id": tournamentId,
                        "tournamentEvent": true
                    });
                    if (tourInfo) {
                        sportId = tourInfo.projectId[0];
                        var dobFilterInfo = dobFilterSubscribe.findOne({
                            "tournamentId": tournamentId,
                            "details.eventId": eventId
                        }, {
                            fields: {
                                _id: 0,
                                details: {
                                    $elemMatch: {
                                        "eventId": eventId
                                    }
                                }
                            }
                        });

                        if (dobFilterInfo && dobFilterInfo.details.length > 0) {
                            if (eventId == dobFilterInfo.details[0].eventId)
                                eventRanking = dobFilterInfo.details[0].ranking;
                        }
                        var eventInfo = tournamentEvents.findOne({
                            "_id": sportId,
                            "projectSubName._id": eventId
                        }, {
                            fields: {
                                _id: 0,
                                projectSubName: {
                                    $elemMatch: {
                                        "_id": eventId
                                    }
                                }
                            }
                        })

                        if (eventInfo) {
                            projectType = eventInfo.projectSubName[0].projectType;
                        }
                    }
                    if (eventParticipantList.length > 0) {
                        for (var j = 0; j < eventParticipantList.length; j++) {
                            var eventParticipant = eventParticipantList[j];

                            var toret = "userDetailsTT"

                            var usersMet = Meteor.users.findOne({
                                userId: eventParticipant
                            })

                            if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                if (dbn) {
                                    toret = dbn
                                }
                            }

                            var userInfo = global[toret].findOne({
                                "userId": eventParticipant
                            });
                            var dateOfBirth_user = "";
                            var academyName = "";
                            if (userInfo) {
                                count = count + 1;
                                if (userInfo.emailAddress == undefined || userInfo.emailAddress == null)
                                    userInfo.emailAddress = ""

                                if (userInfo.clubNameId == undefined || userInfo.clubNameId == null || userInfo.clubNameId == "other")
                                    userInfo.clubName = ""
                                else {
                                    var academyInfo = academyDetails.findOne({
                                        userId: userInfo.clubNameId
                                    });
                                    if (academyInfo)
                                        userInfo.clubName = academyInfo.clubName;
                                }
                                userInfo.affiliationStatus = "no";
                                var managerAffiliationId = "";
                                var managerTempAffiliationId = "";

                                if (userInfo.affiliationId == "other")
                                    managerAffiliationId = "";

                                if (userInfo.affiliationId == undefined || userInfo.affiliationId == null) {
                                    userInfo.affiliationId = "";
                                    userInfo.affiliationStatus = "no";
                                    managerAffiliationId = "";
                                } else {
                                    managerAffiliationId = userInfo.affiliationId
                                    if (userInfo.statusOfUser) {
                                        if (userInfo.statusOfUser == "Active")
                                            userInfo.affiliationStatus = "yes";
                                    }
                                }
                                if (userInfo.tempAffiliationId == "other")
                                    managerTempAffiliationId = "";
                                if (userInfo.tempAffiliationId == undefined || userInfo.tempAffiliationId == null) {
                                    managerTempAffiliationId = "";
                                    userInfo.tempAffiliationId = "";
                                } else
                                    managerTempAffiliationId = userInfo.tempAffiliationId


                                if (userInfo.phoneNumber != undefined && userInfo.phoneNumber.trim() == "")
                                    phoneNumber = "";
                                else if (userInfo.phoneNumber == undefined || userInfo.phoneNumber == null)
                                    phoneNumber = "";
                                else if (userInfo.phoneNumber.length !== 0)
                                    phoneNumber = parseInt(userInfo.phoneNumber);
                                if (userInfo.dateOfBirth)
                                    dateOfBirth_user = moment(new Date(userInfo.dateOfBirth)).format("DD MMM YYYY");
                                else
                                    dateOfBirth_user = "";


                                var eventEntry = PlayerPoints.findOne({
                                    "sportId": sportId,
                                    "playerId": userInfo.userId,
                                    "eventName": eventName,
                                    "organizerId": userId.userId.toString()
                                });
                                var totalPoints = "0";
                                if (eventEntry != undefined)
                                    totalPoints = eventEntry.totalPoints;
                                var receiptStatus = "not sent";
                                var teamDetails;
                                var teamInfo = null;
                                if (projectType == "2") {
                                    teamDetails = playerTeamEntries.findOne({
                                        "tournamentId": tournamentId,
                                        "playerId": userInfo.userId,
                                        "subscribedTeamsArray.eventName": eventName
                                    }, {
                                        fields: {
                                            _id: 0,
                                            subscribedTeamsArray: {
                                                $elemMatch: {
                                                    "eventName": eventName
                                                }
                                            }
                                        }
                                    });
                                    if (teamDetails.subscribedTeamsArray && teamDetails.subscribedTeamsArray.length > 0 &&
                                        teamDetails.subscribedTeamsArray[0].eventName && teamDetails.subscribedTeamsArray[0].eventName == eventName) {
                                        teamInfo = playerTeams.findOne({
                                            "_id": teamDetails.subscribedTeamsArray[0].teamId,
                                            "teamManager": userInfo.userId
                                        });

                                    }


                                }

                                if (projectType == "2") {
                                    var receiptFound = playerTeamEntries.findOne({
                                        "playerId": userInfo.userId,
                                        "tournamentId": tournamentId,
                                        "paidOrNot": true,
                                        "subscribedTeamsArray.eventName": eventName
                                    });
                                    if (receiptFound)
                                        receiptStatus = "sent";
                                } else {
                                    var receiptFound = playerEntries.findOne({
                                        "playerId": userInfo.userId,
                                        "tournamentId": tournamentId,
                                        "paidOrNot": true
                                    });
                                    if (receiptFound)
                                        receiptStatus = "sent"
                                }


                                if (projectType == "1") {
                                    if (eventRanking.trim() == "no") {
                                        userData = {
                                            "Name": userInfo.userName,
                                            "Affiliation ID": userInfo.tempAffiliationId,
                                            "Academy Name": userInfo.clubName,
                                            //"Total Points": totalPoints,
                                            "emailAddress": userInfo.emailAddress,
                                            "Phone Number": phoneNumber,
                                            "DOB": dateOfBirth_user,
                                            "Receipt": receiptStatus,
                                            "Affiliation Status": userInfo.affiliationStatus
                                        }
                                    } else {
                                        userData = {
                                            "Name": userInfo.userName,
                                            "Affiliation ID": userInfo.affiliationId,
                                            "Academy Name": userInfo.clubName,
                                            //"Total Points": totalPoints,
                                            "emailAddress": userInfo.emailAddress,
                                            "Phone Number": phoneNumber,
                                            "DOB": dateOfBirth_user,
                                            "Receipt": receiptStatus,
                                            "Affiliation Status": userInfo.affiliationStatus

                                        }
                                    }
                                } else if (projectType == "2") {
                                    if (eventRanking.trim() == "no" && teamInfo) {
                                        userData = {
                                            "teamName": teamInfo.teamName.trim(),
                                            "teamAffiliationId": teamInfo.teamAffiliationId.trim(),
                                            "managerAffiliationId": managerAffiliationId,
                                            "temporaryAffiliationId": managerTempAffiliationId,
                                            "Academy Name": userInfo.clubName,
                                            "emailAddress": userInfo.emailAddress,
                                            "Phone Number": phoneNumber,
                                            "DOB": dateOfBirth_user,
                                            "Receipt": receiptStatus,
                                            //"Affiliation Status":userInfo.affiliationStatus
                                        }
                                    } else {
                                        userData = {
                                            "teamName": teamInfo.teamName.trim(),
                                            "teamAffiliationId": teamInfo.teamAffiliationId.trim(),
                                            "managerAffiliationId": managerAffiliationId,
                                            "temporaryAffiliationId": managerTempAffiliationId,
                                            "Academy Name": userInfo.clubName,
                                            //"Total Points": totalPoints,
                                            "emailAddress": userInfo.emailAddress,
                                            "Phone Number": phoneNumber,
                                            "DOB": dateOfBirth_user,
                                            "Receipt": receiptStatus,
                                            "Affiliation Status": userInfo.affiliationStatus

                                        }
                                    }
                                }


                                playerList.push(userData);
                            }
                        }
                    }
                }
            }


            if (playerList.length == 0) {
                return 0
            } else {
                if (playerList.length > 2) {
                    playerList.sort(function(a, b) {
                        return (a['Academy Name'].toLowerCase() > b['Academy Name'].toLowerCase());
                    });
                }

                return playerList;
            }
        } catch (e) {}
    },
    "team_eventWiseSubscribersDownload": function(xData, loggedID) {
        try {
            var playerList = [];
            var count = 0;
            check(xData, String)
            var userId = Meteor.users.findOne({
                "_id": loggedID
            })
            var doa = events.findOne({
                "eventOrganizer": userId.userId.toString(),
                "_id": xData
            });
            var eventName = "";
            var tournamentId = "";
            if (doa) {
                if (doa.eventName && doa.eventParticipants) {
                    eventName = doa.eventName;
                    eventParticipantList = doa.eventParticipants;
                    tournamentId = doa.tournamentId;
                    var eventId = doa.projectId[0];

                    if (eventParticipantList.length > 0) {
                        for (var j = 0; j < eventParticipantList.length; j++) {
                            var eventParticipant = eventParticipantList[j];
                            var playerTeamsInfo = playerTeams.findOne({
                                "teamManager": eventParticipant,
                                "teamFormatId": eventId,
                                "schoolId": {
                                    $nin: ["", null]
                                }
                            });

                            var toret = "userDetailsTT"

                            var usersMet = Meteor.users.findOne({
                                userId: eventParticipant
                            })

                            if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                if (dbn) {
                                    toret = dbn
                                }
                            }

                            var userInfo = global[toret].findOne({
                                "userId": eventParticipant
                            });
                            if (playerTeamsInfo && userInfo) {
                                if (userInfo.affiliationId == undefined || userInfo.affiliationId == null)
                                    userInfo.affiliationId = "";
                                if (userInfo.tempAffiliationId == undefined || userInfo.tempAffiliationId == null)
                                    userInfo.tempAffiliationId = "";

                                userData = {
                                    "teamName": playerTeamsInfo.teamName,
                                    "teamAffiliationId": playerTeamsInfo.teamAffiliationId,
                                    "managerAffiliationId": userInfo.affiliationId,
                                    "temporaryAffiliationId": userInfo.tempAffiliationId,
                                }
                                playerList.push(userData);
                            }
                        }
                    }
                }
            }


            if (playerList.length == 0) {
                return playerList;
            } else {
                if (playerList.length > 2) {
                    playerList.sort(function(a, b) {
                        return (a['teamName'].toLowerCase() > b['teamName'].toLowerCase());
                    });
                }

                return playerList;
            }
        } catch (e) {}
    },
    "downloadConsolidatedSubscribers": function(tournamentId, loggedID) {
        try {
            var entireList = [];
            check(tournamentId, String)
            var userId = Meteor.users.findOne({
                "_id": loggedID
            })

            var playerEntriesList = [];
            var sum = 0;
            var feesValue = eventFeeSettings.findOne({
                "tournamentId": tournamentId
            })
            if (feesValue && feesValue.singleEventFees) {
                var arrayFees = feesValue.singleEventFees
                sum = _.reduce(arrayFees, function(memo, num) {
                    return parseInt(memo) + parseInt(num);
                }, 0)
            }
            if (sum > 0) {
                playerEntriesList = playerEntries.find({
                    "tournamentId": tournamentId,
                    "totalFee": {
                        $nin: ["0", 0]
                    },
                }, {
                    sort: {
                        academyId: 1
                    }
                }).fetch();
            } else {
                playerEntriesList = playerEntries.find({
                    "tournamentId": tournamentId
                }, {
                    sort: {
                        academyId: 1
                    }
                }).fetch();
            }
            var count = 0;
            for (var i = 0; i < playerEntriesList.length; i++) {
                var playerId = playerEntriesList[i].playerId
                var playerEntry = playerEntries.findOne({
                    "tournamentId": tournamentId,
                    "playerId": playerId
                });

                var toret = "userDetailsTT"

                var usersMet = Meteor.users.findOne({
                    userId: playerId
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }

                var userInfo = global[toret].findOne({
                    "userId": playerId
                });
                if (playerEntry && userInfo) {
                    var userData = {};
                    var playerList = [];
                    var academy = "";
                    count = count + 1;
                    total = playerEntry.totalFee;
                    subscribedEvents = playerEntry.subscribedEvents
                    var dateOfBirth_user = "";

                    if (userInfo.emailAddress == undefined || userInfo.emailAddress == null)
                        userInfo.emailAddress = ""
                    if (userInfo.clubNameId == undefined || userInfo.clubNameId == null)
                        userInfo.clubName = ""
                    else if (userInfo.clubNameId != undefined || userInfo.clubNameId != null) {
                        var academyInfo = academyDetails.findOne({
                            userId: userInfo.clubNameId
                        });
                        if (academyInfo)
                            userInfo.clubName = academyInfo.clubName;
                    }

                    userInfo.affiliationStatus = "no";

                    if (userInfo.affiliationId == undefined || userInfo.affiliationId == null) {
                        userInfo.affiliationId = "";
                        userInfo.affiliationStatus = "no";
                    } else {
                        if (userInfo.statusOfUser) {
                            if (userInfo.statusOfUser == "Active")
                                userInfo.affiliationStatus = "yes";
                        }
                    }



                    if (userInfo.phoneNumber != undefined && userInfo.phoneNumber.trim() == "")
                        phoneNumber = "";
                    else if (userInfo.phoneNumber == undefined || userInfo.phoneNumber == null)
                        phoneNumber = "";
                    else if (userInfo.phoneNumber.length !== 0)
                        phoneNumber = parseInt(userInfo.phoneNumber);

                    if (userInfo.dateOfBirth)
                        dateOfBirth_user = moment(new Date(userInfo.dateOfBirth)).format("DD MMM YYYY");
                    else
                        dateOfBirth_user = "";

                    if (userInfo.clubNameId) {
                        var academyInfo = academyDetails.findOne({
                            "userId": userInfo.clubNameId
                        });
                        if (academyInfo)
                            academy = academyInfo.clubName;

                    }
                    var receiptFound = playerEntries.findOne({
                        "playerId": userInfo.userId,
                        "tournamentId": tournamentId,
                        "paidOrNot": true
                    });
                    var receiptStatus = "";

                    if (receiptFound)
                        receiptStatus = "sent"
                    else
                        receiptStatus = "not sent"

                    var str = count + "," + userInfo.userName + "," + userInfo.affiliationId + "," + academy + "," + userInfo.emailAddress + "," + phoneNumber + "," + dateOfBirth_user + "," + subscribedEvents.toString() + "," + total + "," + receiptStatus + "," + userInfo.affiliationStatus;
                    playerList = str.toString().split(",");
                    entireList.push(playerList);

                }

            }


            if (entireList.length == 0)
                return 0
            else
                return entireList;
        } catch (e) {}
    },

    "downloadAcademyEntries": function(tournamentId) {
        try {

            check(tournamentId, String);
            var entireList = [];
            var count = 0;
            var academyEntriesList = [];
            var playerEntriesList = [];
            var sum = 0;
            var feesValue = eventFeeSettings.findOne({
                "tournamentId": tournamentId
            })
            if (feesValue && feesValue.singleEventFees) {
                var arrayFees = feesValue.singleEventFees
                sum = _.reduce(arrayFees, function(memo, num) {
                    return parseInt(memo) + parseInt(num);
                }, 0)
            }
            if (sum > 0) {
                academyEntriesList = academyEntries.find({
                    "tournamentId": tournamentId,
                    "totalFee": {
                        $nin: ["0", 0]
                    },
                }).fetch();
            } else {
                academyEntriesList = academyEntries.find({
                    "tournamentId": tournamentId,
                }).fetch();
            }
            if (academyEntriesList.length > 0) {
                for (var x = 0; x < academyEntriesList.length; x++) {
                    var academyList = [];
                    count++;
                    var academy = "";
                    var academyId = academyEntriesList[x].academyId;
                    var academyInfo = academyDetails.findOne({
                        "userId": academyId
                    });
                    if (academyInfo)
                        academy = academyInfo.clubName;

                    academyList.push(count);
                    academyList.push(academy);
                    academyList.push(academyEntriesList[x].totalFee)
                    entireList.push(academyList);
                }
            }


            var playerEntriesList_Other = [];
            if (sum > 0) {
                playerEntriesList_Other = playerEntries.find({
                    "tournamentId": tournamentId,
                    "academyId": "other",
                    "totalFee": {
                        $nin: ["0", 0]
                    },
                }).fetch();
            } else {
                playerEntriesList_Other = playerEntries.find({
                    "tournamentId": tournamentId,
                    "academyId": "other"
                }).fetch();
            }

            if (playerEntriesList_Other.length > 0) {
                for (var h = 0; h < playerEntriesList_Other.length; h++) {
                    var playerList = [];

                    var toret = "userDetailsTT"

                    var usersMet = Meteor.users.findOne({
                        userId: playerEntriesList_Other[h].playerId
                    })

                    if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                        var dbn = playerDBFind(usersMet.interestedProjectName[0])
                        if (dbn) {
                            toret = dbn
                        }
                    }

                    var userInfo = global[toret].findOne({
                        "userId": playerEntriesList_Other[h].playerId
                    });


                    if (userInfo) {
                        count++;
                        playerList.push(count);
                        playerList.push(userInfo.userName);
                        playerList.push(playerEntriesList_Other[h].totalFee);
                        entireList.push(playerList);
                    }

                }
            }

            if (entireList.length == 0)
                return 0
            else
                return entireList;
        } catch (e) {}
    },

    "downloadClubwiseSubscribers": function(tournamentId, academyId) {
        try {

            var entireList = [];
            check(tournamentId, String)
            var userId = Meteor.users.findOne({
                "_id": Meteor.userId()
            })
            var count = 0;
            var academy = "";
            var academyInfo = academyDetails.findOne({
                "userId": academyId
            });
            if (academyInfo)
                academy = academyInfo.clubName;

            var playerEntriesList = playerEntries.find({
                "tournamentId": tournamentId,
                "academyId": academyId
            }).fetch();

            for (var i = 0; i < playerEntriesList.length; i++) {
                var playerId = playerEntriesList[i].playerId
                var playerEntry = playerEntries.findOne({
                    "tournamentId": tournamentId,
                    "playerId": playerId
                });

                var toret = "userDetailsTT"

                var usersMet = Meteor.users.findOne({
                    userId: playerId
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }

                var userInfo = global[toret].findOne({
                    "userId": playerId
                });

                if (playerEntry && userInfo) {
                    var userData = {};
                    var playerList = [];
                    count = count + 1;

                    total = playerEntry.totalFee;
                    subscribedEvents = playerEntry.subscribedEvents

                    if (userInfo.emailAddress == undefined)
                        userInfo.emailAddress = "";

                    if (userInfo.clubName == null)
                        u.clubName = ""

                    if (userInfo.affiliationId == null)
                        userInfo.affiliationId = ""

                    if (userInfo.phoneNumber != undefined && userInfo.phoneNumber.trim() == "")
                        phoneNumber = "";
                    else if (userInfo.phoneNumber == undefined || userInfo.phoneNumber == null)
                        phoneNumber = "";
                    else if (userInfo.phoneNumber.length !== 0)
                        phoneNumber = parseInt(userInfo.phoneNumber);

                    var str = count + "," + userInfo.userName + "," + userInfo.affiliationId + "," + academy + "," + userInfo.affiliationId + "," + userInfo.emailAddress + "," + phoneNumber + "," + userInfo.dateOfBirth + "," + subscribedEvents.toString() + "," + total;
                    playerList = str.toString().split(",");
                    entireList.push(playerList);
                }

            }

            if (entireList.length == 0)
                return 0
            else
                return entireList;
        } catch (e) {}
    },

    "downloadDAEntries": function(tournamentId) {
        try {

            check(tournamentId, String);
            var entireList = [];
            var count = 0;
            var districtEntriesList = [];
            var sum = 0;
            var feesValue = eventFeeSettings.findOne({
                "tournamentId": tournamentId
            })
            if (feesValue && feesValue.singleEventFees) {
                var arrayFees = feesValue.singleEventFees
                sum = _.reduce(arrayFees, function(memo, num) {
                    return parseInt(memo) + parseInt(num);
                }, 0)
            }

            if (sum > 0) {
                districtEntriesList = districtAssociationEntries.find({
                    "tournamentId": tournamentId,
                    "totalFee": {
                        $nin: ["0", 0]
                    },
                }).fetch();
            } else {
                districtEntriesList = districtAssociationEntries.find({
                    "tournamentId": tournamentId
                }).fetch();
            }

            if (districtEntriesList.length > 0) {
                for (var x = 0; x < districtEntriesList.length; x++) {
                    var districtList = [];
                    count++;
                    var associationName = "";
                    var associationId = ""
                    if (districtEntriesList[x].associationId) {
                        associationId = districtEntriesList[x].associationId;
                        var associationInfo = associationDetails.findOne({
                            "userId": associationId
                        });
                        if (associationInfo)
                            associationName = associationInfo.associationName;
                    }


                    districtList.push(count);
                    districtList.push(associationName);
                    districtList.push(districtEntriesList[x].totalFee)
                    entireList.push(districtList);
                }
            }


            var playerEntriesList_Other = [];

            if (sum > 0) {
                playerEntriesList_Other = playerEntries.find({
                    "tournamentId": tournamentId,
                    "associationId": "other",
                    "totalFee": {
                        $nin: ["0", 0]
                    },
                }).fetch();
            } else {
                playerEntriesList_Other = playerEntries.find({
                    "tournamentId": tournamentId,
                    "associationId": "other"
                }).fetch();
            }


            if (playerEntriesList_Other.length > 0) {
                for (var h = 0; h < playerEntriesList_Other.length; h++) {
                    var playerList = [];

                    var toret = "userDetailsTT"

                    var usersMet = Meteor.users.findOne({
                        userId: playerEntriesList_Other[h].playerId
                    })

                    if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                        var dbn = playerDBFind(usersMet.interestedProjectName[0])
                        if (dbn) {
                            toret = dbn
                        }
                    }

                    var userInfo = global[toret].findOne({
                        "userId": playerEntriesList_Other[h].playerId
                    });
                    if (userInfo) {
                        count++;
                        playerList.push(count);
                        playerList.push(userInfo.userName);
                        playerList.push(playerEntriesList_Other[h].totalFee);
                        entireList.push(playerList);
                    }

                }
            }

            if (entireList.length == 0)
                return 0
            else
                return entireList;
        } catch (e) {}
    },

    downloadConsolidatedSubscribers_Team: function(tournamentId) {
        try {

            var entireList = [];
            check(tournamentId, String)
            var userId = Meteor.users.findOne({
                "_id": Meteor.userId()
            })

            var playerEntriesList = [];
            var sum = 0;
            var feesValue = eventFeeSettings.findOne({
                "tournamentId": tournamentId
            })
            if (feesValue && feesValue.singleEventFees) {
                var arrayFees = feesValue.singleEventFees
                sum = _.reduce(arrayFees, function(memo, num) {
                    return parseInt(memo) + parseInt(num);
                }, 0)
            }
            if (sum > 0) {
                playerEntriesList = playerTeamEntries.find({
                    "tournamentId": tournamentId,
                    "totalFee": {
                        $nin: ["0", 0]
                    },
                }, {
                    sort: {
                        academyId: 1
                    }
                }).fetch();
            } else {
                playerEntriesList = playerTeamEntries.find({
                    "tournamentId": tournamentId
                }, {
                    sort: {
                        academyId: 1
                    }
                }).fetch();
            }
            var count = 0;
            for (var i = 0; i < playerEntriesList.length; i++) {
                var playerId = playerEntriesList[i].playerId
                var playerEntry = playerTeamEntries.findOne({
                    "tournamentId": tournamentId,
                    "playerId": playerId
                });

                var playerList = [];

                var toret = "userDetailsTT"

                var usersMet = Meteor.users.findOne({
                    userId: playerId
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }

                var userInfo = global[toret].findOne({
                    "userId": playerId
                });
                if (playerEntry && userInfo) {
                    var userData = {};
                    var playerList = [];
                    var academy = "";
                    count = count + 1;
                    total = playerEntry.totalFee;
                    subscribedEvents = playerEntry.subscribedEvents
                    var dateOfBirth_user = "";

                    if (userInfo.emailAddress == undefined || userInfo.emailAddress == null)
                        userInfo.emailAddress = ""
                    if (userInfo.clubNameId == undefined || userInfo.clubNameId == null)
                        userInfo.clubName = ""
                    else if (userInfo.clubNameId != undefined || userInfo.clubNameId != null) {
                        var academyInfo = academyDetails.findOne({
                            userId: userInfo.clubNameId
                        });
                        if (academyInfo)
                            userInfo.clubName = academyInfo.clubName;
                    }

                    if (userInfo.affiliationId == undefined || userInfo.affiliationId == null)
                        userInfo.affiliationId = ""


                    if (userInfo.phoneNumber != undefined && userInfo.phoneNumber.trim() == "")
                        phoneNumber = "";
                    else if (userInfo.phoneNumber == undefined || userInfo.phoneNumber == null)
                        phoneNumber = "";
                    else if (userInfo.phoneNumber.length !== 0)
                        phoneNumber = parseInt(userInfo.phoneNumber);

                    if (userInfo.dateOfBirth)
                        dateOfBirth_user = moment(new Date(userInfo.dateOfBirth)).format("DD MMM YYYY");
                    else
                        dateOfBirth_user = "";

                    if (userInfo.clubNameId) {
                        var academyInfo = academyDetails.findOne({
                            "userId": userInfo.clubNameId
                        });
                        if (academyInfo)
                            academy = academyInfo.clubName;

                    }
                    var receiptFound = playerTeamEntries.findOne({
                        "playerId": userInfo.userId,
                        "tournamentId": tournamentId,
                        "paidOrNot": true
                    });
                    var receiptStatus = "";

                    if (receiptFound)
                        receiptStatus = "sent"
                    else
                        receiptStatus = "not sent"

                    var str = count + "," + userInfo.userName + "," + userInfo.affiliationId + "," + academy + "," + userInfo.emailAddress + "," + phoneNumber + "," + dateOfBirth_user + "," + subscribedEvents.toString() + "," + total + "," + receiptStatus;
                    playerList = str.toString().split(",");
                    entireList.push(playerList);

                }

            }


            if (entireList.length == 0)
                return 0
            else
                return entireList;
        } catch (e) {

        }
    },

});


/*** past subscribers download ****/
Meteor.methods({
    "pasteventWiseSubscribersDownload": function(xData, loggedID) {

        var playerList = [];
        var count = 0;
        check(xData, String)
        var userId = Meteor.users.findOne({
            "_id": loggedID
        })

        var doa = pastEvents.findOne({
            "eventOrganizer": userId.userId.toString(),
            "_id": xData
        });

        var eventName = "";
        var tournamentId = "";
        var sportId = "";
        var eventRanking = "";
        var projectType = "";
        if (doa) {
            if (doa.eventName && doa.eventParticipants) {
                eventName = doa.eventName;
                eventParticipantList = doa.eventParticipants;
                tournamentId = doa.tournamentId;
                var tourInfo = pastEvents.findOne({
                    "_id": tournamentId,
                    "tournamentEvent": true
                });
                if (tourInfo) {
                    sportId = tourInfo.projectId[0];
                    var eventId = doa.projectId[0];

                    var dobFilterInfo = dobFilterSubscribe.findOne({
                        "tournamentId": tournamentId,
                        "details.eventId": eventId
                    }, {
                        fields: {
                            _id: 0,
                            details: {
                                $elemMatch: {
                                    "eventId": eventId
                                }
                            }
                        }
                    });

                    if (dobFilterInfo && dobFilterInfo.details.length > 0) {
                        if (eventId == dobFilterInfo.details[0].eventId)
                            eventRanking = dobFilterInfo.details[0].ranking;
                    }
                    var eventInfo = tournamentEvents.findOne({
                        "_id": sportId,
                        "projectSubName._id": eventId
                    }, {
                        fields: {
                            _id: 0,
                            projectSubName: {
                                $elemMatch: {
                                    "_id": eventId
                                }
                            }
                        }
                    })

                    if (eventInfo) {
                        projectType = eventInfo.projectSubName[0].projectType;
                    }
                }

                if (eventParticipantList.length > 0) {
                    for (var j = 0; j < eventParticipantList.length; j++) {
                        var eventParticipant = eventParticipantList[j];

                        var toret = "userDetailsTT"

                        var usersMet = Meteor.users.findOne({
                            userId: eventParticipant
                        })

                        if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                            var dbn = playerDBFind(usersMet.interestedProjectName[0])
                            if (dbn) {
                                toret = dbn
                            }
                        }

                        var userInfo = global[toret].findOne({
                            "userId": eventParticipant
                        });
                        var dateOfBirth_user = "";
                        if (userInfo) {
                            count = count + 1;
                            if (userInfo.emailAddress == undefined || userInfo.emailAddress == null)
                                userInfo.emailAddress = ""

                            if (userInfo.clubNameId == undefined || userInfo.clubNameId == null || userInfo.clubNameId == "other")
                                userInfo.clubName = ""
                            else {
                                var academyInfo = academyDetails.findOne({
                                    userId: userInfo.clubNameId
                                });
                                if (academyInfo)
                                    userInfo.clubName = academyInfo.clubName;
                            }

                            userInfo.affiliationStatus = "no";

                            if (userInfo.affiliationId == undefined || userInfo.affiliationId == null) {
                                userInfo.affiliationId = ""
                                userInfo.affiliationStatus = "no";
                            } else {
                                if (userInfo.statusOfUser) {
                                    if (userInfo.statusOfUser == "Active")
                                        userInfo.affiliationStatus = "yes";
                                }
                            }

                            if (userInfo.tempAffiliationId == undefined || userInfo.tempAffiliationId == null)
                                userInfo.tempAffiliationId = ""

                            if (userInfo.phoneNumber != undefined && userInfo.phoneNumber.trim() == "")
                                phoneNumber = "";
                            else if (userInfo.phoneNumber == undefined || userInfo.phoneNumber == null)
                                phoneNumber = "";
                            else if (userInfo.phoneNumber.length !== 0)
                                phoneNumber = parseInt(userInfo.phoneNumber);
                            if (userInfo.dateOfBirth)
                                dateOfBirth_user = moment(new Date(userInfo.dateOfBirth)).format("DD MMM YYYY");
                            else
                                dateOfBirth_user = "";


                            var eventEntry = PlayerPoints.findOne({
                                "sportId": sportId,
                                "playerId": userInfo.userId,
                                "eventName": eventName,
                                "organizerId": userId.userId.toString()
                            });
                            var totalPoints = "0";
                            if (eventEntry != undefined) {
                                totalPoints = eventEntry.totalPoints;
                            }

                            var receiptStatus = "not sent";
                            if (projectType == "2") {
                                var receiptFound = playerTeamEntries.findOne({
                                    "playerId": userInfo.userId,
                                    "tournamentId": tournamentId,
                                    "paidOrNot": true,
                                    "subscribedTeamsArray.eventName": eventName
                                });
                                if (receiptFound)
                                    receiptStatus = "sent";
                            } else {
                                var receiptFound = playerEntries.findOne({
                                    "playerId": userInfo.userId,
                                    "tournamentId": tournamentId,
                                    "paidOrNot": true
                                });
                                if (receiptFound)
                                    receiptStatus = "sent"
                            }

                            if (eventRanking.trim() == "no") {
                                userData = {
                                    "Name": userInfo.userName,
                                    "Affiliation ID": userInfo.tempAffiliationId,
                                    "Academy Name": userInfo.clubName,
                                    //"Total Points": totalPoints,
                                    "emailAddress": userInfo.emailAddress,
                                    "Phone Number": phoneNumber,
                                    "DOB": dateOfBirth_user,
                                    "Receipt": receiptStatus,
                                    "Affiliation Status": userInfo.affiliationStatus

                                }
                            } else {
                                userData = {
                                    "Name": userInfo.userName,
                                    "Affiliation ID": userInfo.affiliationId,
                                    "Academy Name": userInfo.clubName,
                                    //"Total Points": totalPoints,
                                    "emailAddress": userInfo.emailAddress,
                                    "Phone Number": phoneNumber,
                                    "DOB": dateOfBirth_user,
                                    "Receipt": receiptStatus,
                                    "Affiliation Status": userInfo.affiliationStatus

                                }
                            }




                            playerList.push(userData);


                        }
                    }
                }
            }

        }


        if (playerList.length == 0) {
            return 0
        } else {
            if (playerList.length > 2) {
                playerList.sort(function(a, b) {
                    return (a['Academy Name'].toLowerCase() > b['Academy Name'].toLowerCase());

                });
            }

            return playerList;
        }
    }
})

Meteor.methods({
    "dbBasedEventParts": async function(tournamentId,eventName,eventParticipants,eventRanking) {
        try {

            var userDetailArr = [];
            /*var sportID = events.findOne({
                    "tournamentId": tournamentId,
                    "eventName": eventName
                }).projectId[0];
            */
            var tournamentInfo = events.findOne({
                "_id":tournamentId
            })
            if(tournamentInfo == undefined)
                tournamentInfo = pastEvents.findOne({
                    "_id":tournamentId
                });

            var tournamentSport = "";
            if(tournamentInfo && tournamentInfo.projectId)
                tournamentSport = tournamentInfo.projectId[0];

            

            for (var i = 0; i < eventParticipants.length; i++) 
            {
                var academyName = "";
                var userId = eventParticipants[i];       
                var toret = true
                var userInfo
            
                if (toret) 
                {
                    var dbsrequired = ["userDetailsTT"]

                    var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                    try {
                        if (res && res && res.changedDbNames && res.changedDbNames.length) {
                            userInfo = global[res.changedDbNames[0]].findOne({
                                userId: userId
                            })

                        }
                    }catch(e){
                    }
                }

                if (userInfo) 
                {
                    //return userInfo
                    if (userInfo.clubNameId) 
                    {
                        var clubInfo = academyDetails.findOne({
                            "userId": userInfo.clubNameId,
                            "role": "Academy"
                        });
                        if(clubInfo)
                            academyName = clubInfo.clubName;
                    }
                    else if(userInfo.schoolId)
                    {
                        var clubInfo = schoolDetails.findOne({
                            "userId": userInfo.schoolId,
                        });
                        if(clubInfo&&clubInfo.schoolName)
                            academyName = clubInfo.schoolName;
                    }
                    var pointsObj = PlayerPoints.findOne({
                        "playerId": userInfo.userId,
                        "sportId": tournamentSport,
                        "eventName": eventName 
                    });
                    var points = 0;
                    if (pointsObj) 
                    {
                        var pointsInfo = PlayerPoints.aggregate([
                            {$match:{
                                "playerId":userInfo.userId,
                                "sportId":tournamentSport,
                                "eventName":eventName
                            }},
                            {$group:{
                                "_id":"$playerId",
                                "totalPoints":{$sum:"$totalPoints"}
                            }}
                        ]);
                        if (pointsInfo && pointsInfo.length > 0 && pointsInfo[0].totalPoints)
                            points = pointsInfo[0].totalPoints;
                    }
                     if (eventRanking.trim() == "yes")
                    {
                        userDetailArr.push({
                            "affiliationID": userInfo.affiliationId,
                            "playerName": userInfo.userName,
                            "points": points,
                            "Academy": academyName
                        });
                    }
                    else{
                        userDetailArr.push({
                            "affiliationID": userInfo.tempAffiliationId,
                            "playerName": userInfo.userName,
                            "points": points,
                            "Academy": academyName
                        });
                    }
                }

            }

            return userDetailArr;

          

        } catch (e) {
        }
    }
})