import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    nameToCollection
}
from '../dbRequiredRole.js'


Meteor.methods({

    "getPastTournaments": function(caller, apiKey, userId) {
        if (apiUsers.findOne({
                "apiUser": caller
            }).apiKey != apiKey) {
            return;
        } else {
            try {
                var jsonS = []
                var lUserId = Meteor.users.findOne({
                    "_id": userId
                });
                var hh = []
                var k;
                var userDetails;
                var eventList = [];
                if (lUserId) {
                    if (lUserId.role == "Player") {
                        userDetails = nameToCollection(lUserId.userId).findOne({
                            "userId": lUserId.userId
                        });
                        if (userDetails && userDetails.interestedDomainName && userDetails.interestedProjectName) {
                            lUserId.interestedProjectName = userDetails.interestedProjectName;
                            lUserId.interestedDomainName = userDetails.interestedDomainName
                        }
                    } else if (lUserId.role == "Umpire") {
                        userDetails = otherUsers.findOne({
                            "userId": lUserId.userId
                        });
                        if (userDetails && userDetails.interestedDomainName && userDetails.interestedProjectName) {
                            lUserId.interestedProjectName = userDetails.interestedProjectName;
                            lUserId.interestedDomainName = userDetails.interestedDomainName
                        }
                    }
                }

                if (lUserId != undefined && lUserId.interestedDomainName && lUserId.interestedProjectName) {

                    eventList = pastEvents.find({
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
                            }
                        },

                        {
                            fields: {
                                "_id": 1,
                                "eventName": 1,
                                "eventStartDate": 1,
                                "eventEndDate": 1,
                                "domainName": 1,
                                "eventStartDate1": 1,
                                "eventEndDate1": 1,
                                "subscriptionTypeHyper": 1,
                                "hyperLinkValue": 1,
                            }
                        },
                    ).fetch();

                    //should be on start date
                    /*for(var m=0 ;m<eventList.length;m++)
	          {
	          	var eventFeeSettingsInfo  = eventFeeSettings.findOne({"tournamentId":eventList[m]._id});
	            if(eventFeeSettingsInfo)
	              eventList[m]['feeSettings'] = eventFeeSettingsInfo;
	            else
	              eventList[m]['feeSettings'] = {};
	          }*/
                }

                return eventList
            } catch (e) {}
        }
    },

    'getListOfEventsUnderPastTourn': function(caller, apiKey, tournamentId, userId) {
        if (apiUsers.findOne({
                "apiUser": caller
            }).apiKey != apiKey) {
            return;
        } else {
            try {
                var userDetails = nameToCollection(userId).findOne({
                    "userId": userId
                });
                var userGender = "";
                var userDOB = "";
                if (userDetails != undefined) {
                    userGender = userDetails.gender.toUpperCase();
                    userDOB = userDetails.dateOfBirth;
                }

                var tournInfo = pastEvents.findOne({
                    "tournamentEvent": true,
                    "_id": tournamentId
                });
                var tournOrganizer = "";
                var tournSport = "";
                var eventsUnderTournament = [];
                if (tournInfo != undefined) {

                    tournOrganizer = tournInfo.eventOrganizer;
                    tournSport = tournInfo.projectId[0];
                    eventsUnderTournament = tournInfo.eventsUnderTournament;
                    var eventsUnderTourList = pastEvents.find({
                        tournamentEvent: false,
                        tournamentId: tournamentId
                    }, {
                        fields: {
                            "_id": 1,
                            "projectType": 1,
                            "subscribeTeams": 1,
                            "eventName": 1,
                            "abbName": 1,
                            "allowSubscription": 1,
                            "subscribeBoolean": 1,
                            "prize": 1,
                            "projectId": 1,
                            "eventParticipants": 1
                        }
                    }).fetch();

                    var jsonS = [];
                    var sortedData = _.sortBy(eventsUnderTourList, function(obj) {
                        return _.indexOf(eventsUnderTournament, obj._id);
                    });
                    eventsUnderTourList = sortedData;

                    for (var i = 0; i < eventsUnderTourList.length; i++) {
                        var eventUnderTour = eventsUnderTourList[i];
                        eventUnderTour['subscribeBoolean'] = false;
                        var filterStatus = false;
                        var filterProjectType = eventsUnderTourList[i].projectType;
                        var userDate = "";
                        var filterDate = "";
                        var birthDetails = dobFilterSubscribe.findOne({
                            "mainProjectId": tournInfo.projectId.toString(),
                            "eventOrganizer": tournInfo.eventOrganizer.toString(),
                            "tournamentId": tournamentId,
                            "details.eventId": eventUnderTour.projectId.toString()
                        }, {
                            fields: {
                                _id: 1,
                                details: {
                                    $elemMatch: {
                                        "eventId": eventUnderTour.projectId.toString()
                                    }
                                }
                            }
                        });


                        if (birthDetails && birthDetails.details) {
                            if (birthDetails.details.length > 0) {
                                var j = 0;
                                var find1 = birthDetails.details[j];

                                if (find1.dateOfBirth.trim() == "NA" && find1.eventId == eventUnderTour.projectId.toString()) {
                                    filterStatus = true;
                                } else if (find1.ranking == "yes" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString()) {
                                    if (userDetails.affiliationId !== null && userDetails.affiliationId != undefined && userDetails.affiliationId != "other" && userDetails.statusOfUser == "Active") {
                                        if (find1.eventId == eventUnderTour.projectId.toString()) {
                                            filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                            userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

                                            if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase())
                                                filterStatus = true
                                            else if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL")
                                                filterStatus = true
                                            else
                                                filterStatus = false
                                        }
                                    } else if (find1.eventId == eventUnderTour.projectId.toString()) {
                                        filterStatus = false;
                                    }
                                } else if (find1.ranking == "no" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString()) {

                                    if (find1.eventId == eventUnderTour.projectId.toString()) {
                                        filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                        userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

                                        if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase())
                                            filterStatus = true;
                                        else if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL")
                                            filterStatus = true;
                                        else
                                            filterStatus = false
                                    }
                                }
                            }
                        }
                        if (filterStatus) {
                            var subscribeTeams = [];
                            var subscribedTeamNames = [];
                            var teamMemberDetails = {};
                            //eventUnderTour["subscribeTeams"] =subscribeTeams;
                            //eventUnderTour["subscribedTeamNames"] =subscribedTeamNames;

                            var selectedEventName = eventUnderTour.eventName;

                            if (filterProjectType == 2) {

                                var playerTeamEntriesInfo = playerTeamEntries.findOne({
                                    "playerId": userId,
                                    "tournamentId": tournamentId,
                                    "subscribedTeamsArray.eventName": selectedEventName
                                }, {
                                    fields: {
                                        _id: 1,
                                        "subscribedTeamsArray": {
                                            $elemMatch: {
                                                "eventName": selectedEventName
                                            }
                                        }
                                    }
                                });
                                var selectedTeamID = "";

                                if (playerTeamEntriesInfo) {
                                    if (playerTeamEntriesInfo.subscribedTeamsArray && playerTeamEntriesInfo.subscribedTeamsArray.length > 0) {
                                        if (playerTeamEntriesInfo.subscribedTeamsArray[0].eventName == selectedEventName)
                                            selectedTeamID = playerTeamEntriesInfo.subscribedTeamsArray[0].teamId;
                                    }
                                }


                                /*var teamList = playerTeams.findOne({"_id":selectedTeamID});
			              if(teamList)
			              {
			                Meteor.call("validateExistingTeam",teamList._id,function(error,result){
			                  if(result)
			                  {
			                    subscribeTeams.push(teamList);
			                    subscribedTeamNames.push(teamList.teamName);
			                    if(result.teamMembers)
			                    {
			                      eventUnderTour[teamList.teamName] = result.teamMembers;
			                      eventUnderTour[teamList.teamName+"id"] = result._id;
			                    }
			                     
			                    var playerTeamEntriesInfo = playerTeamEntries.findOne({"playerId":userId,"tournamentId":tournamentId});
			                    if(playerTeamEntriesInfo)
			                        eventUnderTour["subscribedTeamDetails"] = playerTeamEntriesInfo;
			                      
			                  }
			                });
						  }*/
                                eventUnderTour[selectedEventName] = selectedTeamID;
                                //eventUnderTour["subscribeTeams"] =subscribeTeams;
                                //eventUnderTour["teamMemberDetails"] =teamMemberDetails;

                            }
                            jsonS.push(eventUnderTour)


                        }

                    }


                    return jsonS


                    //return eventsUnderTourList
                }
            } catch (e) {

            }
        }
    },

    getPastEntriesList: function(tournamentId, eventId) {
        var tournamentId = tournamentId.trim();
        var eventId = eventId.trim();
        var userDetail = [];
        var eventArray = [];
        var count = 0;
        var arr = [];
        var userList = "";
        var sportID = "";
        var eventName = "";
        var eventInfo;
        var eventParticipants;
        eventInfo = pastEvents.findOne({
            "tournamentEvent": false,
            "tournamentId": tournamentId,
            "_id": eventId
        });
        if (eventInfo && eventInfo.eventParticipants) {
            eventParticipants = eventInfo.eventParticipants;
            var sportID = pastEvents.findOne({
                "_id": tournamentId,
                "tournamentEvent": true
            }).projectId[0];
            var eventName = pastEvents.findOne({
                "tournamentEvent": false,
                "tournamentId": tournamentId,
                "_id": eventId
            }).eventName;
            if (eventParticipants) {
                for (var i = 0; i < eventParticipants.length; i++) {
                    var userInfo = undefined;
                    if (nameToCollection(eventParticipants[i])) {
                        userInfo = nameToCollection(eventParticipants[i]).findOne({
                            "userId": eventParticipants[i]
                        });

                    }

                    if (userInfo && userInfo.clubNameId) {
                        var clubInfo;
                        var organizerId = eventInfo.eventOrganizer;
                        if (userInfo.clubNameId)
                            clubInfo = academyDetails.findOne({
                                "userId": userInfo.clubNameId
                            });




                        var pointsObj = PlayerPoints.findOne({
                            "playerId": userInfo.userId,
                            "sportId": sportID,
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
                        if (clubInfo)
                            userDetail.push({
                                "playerID": userInfo.userId,
                                "playerName": userInfo.userName,
                                "points": points,
                                "Academy": clubInfo.clubName
                            });
                        else
                            userDetail.push({
                                "playerID": userInfo.userId,
                                "playerName": userInfo.userName,
                                "points": points,
                                "Academy": ""
                            });

                    }

                }
            }

        }

        if (userDetail.length != 0) {
            userDetail.sort(function(a, b) {
                return parseInt(b.points) - parseInt(a.points);
            });
            userDetail.map(function(document, index) {
                document["rank"] = parseInt(index + 1);
                document["slNo"] = parseInt(index + 1);
            });
        }

        if (userDetail.length > 0)
            return userDetail;

    },
    getassociatedusersAPI: function(sportID, filterID, gender, approval) {
        var players = [];
        if (gender.trim() == "" && approval.trim() == "") {
            if (nameToCollection(sportID))
                players = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": filterID
                    }, {
                        "parentAssociationId": filterID
                    }]
                }).fetch();
        } else if (gender.trim() != "" && approval.trim() == "") {
            if (nameToCollection(sportID))
                players = nameToCollection(sportID).find({
                    "gender": gender,
                    "role": "Player",
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    $or: [{
                        "associationId": filterID
                    }, {
                        "parentAssociationId": filterID
                    }]
                }).fetch();
        } else if (gender.trim() == "" && approval.trim() != "") {
            if (approval.trim() == "Pending" && nameToCollection(sportID)) {
                players = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": filterID
                    }, {
                        "parentAssociationId": filterID
                    }],
                    $and: [{
                        $or: [{
                            $and: [{
                                $or: [{
                                    "affiliationId": null
                                }, {
                                    "affiliationId": undefined
                                }, {
                                    "affiliationId": ""
                                }, {
                                    "affiliationId": "other"
                                }]
                            }, {
                                "statusOfUser": "Active"
                            }]
                        }, {
                            $and: [{
                                "affiliationId": {
                                    $nin: [null, "", "other", undefined]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                }).fetch();

            } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {
                players = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": filterID
                    }, {
                        "parentAssociationId": filterID
                    }],
                    $and: [{
                        $or: [{
                            "affiliationId": {
                                $nin: [null, "", "other", undefined]
                            }
                        }]
                    }, {
                        "statusOfUser": "Active"
                    }]
                }).fetch();
            }

        } else if (gender.trim() != "" && approval.trim() != "") {
            if (approval.trim() == "Pending" && nameToCollection(sportID)) {

                players = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": filterID
                    }, {
                        "parentAssociationId": filterID
                    }],
                    $and: [{
                        $or: [{
                            $and: [{
                                $or: [{
                                    "affiliationId": null
                                }, {
                                    "affiliationId": undefined
                                }, {
                                    "affiliationId": ""
                                }, {
                                    "affiliationId": "other"
                                }]
                            }, {
                                "statusOfUser": "Active"
                            }]
                        }, {
                            $and: [{
                                "affiliationId": {
                                    $nin: [null, "", "other", undefined]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                }).fetch();
            } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {
                players = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": filterID
                    }, {
                        "parentAssociationId": filterID
                    }],
                    $and: [{
                        $or: [{
                            "affiliationId": {
                                $nin: [null, "", "other", undefined]
                            }
                        }]
                    }, {
                        "statusOfUser": "Active"
                    }]
                }).fetch();
            }
        }
        return players
    },
    getacademyusersAPI: function(sportID, filterID, gender, approval) {
        var players = [];

        if (gender.trim() == "" && approval.trim() == "") {
            if (nameToCollection(sportID))
                players = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID
                }).fetch();
        } else if (gender.trim() != "" && approval.trim() == "") {
            if (nameToCollection(sportID))
                players = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID
                }).fetch();

        } else if (gender.trim() == "" && approval.trim() != "") {
            if (approval.trim() == "Pending" && nameToCollection(sportID)) {
                players = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID,
                    $and: [{
                        $or: [{
                            $and: [{
                                $or: [{
                                    "affiliationId": null
                                }, {
                                    "affiliationId": undefined
                                }, {
                                    "affiliationId": ""
                                }, {
                                    "affiliationId": "other"
                                }]
                            }, {
                                "statusOfUser": "Active"
                            }]
                        }, {
                            $and: [{
                                "affiliationId": {
                                    $nin: [null, "", "other", undefined]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                }).fetch();

            } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {
                players = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID,
                    $and: [{
                        $or: [{
                            "affiliationId": {
                                $nin: [null, "", "other", undefined]
                            }
                        }]
                    }, {
                        "statusOfUser": "Active"
                    }]
                }).fetch();
            }

        } else if (gender.trim() != "" && approval.trim() != "") {
            if (approval.trim() == "Pending" && nameToCollection(sportID)) {
                players = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID,
                    $and: [{
                        $or: [{
                            $and: [{
                                $or: [{
                                    "affiliationId": null
                                }, {
                                    "affiliationId": undefined
                                }, {
                                    "affiliationId": ""
                                }, {
                                    "affiliationId": "other"
                                }]
                            }, {
                                "statusOfUser": "Active"
                            }]
                        }, {
                            $and: [{
                                "affiliationId": {
                                    $nin: [null, "", "other", undefined]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                }).fetch();
            } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {
                players = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID,
                    $and: [{
                        $or: [{
                            "affiliationId": {
                                $nin: [null, "", "other", undefined]
                            }
                        }]
                    }, {
                        "statusOfUser": "Active"
                    }]
                }).fetch();
            }


        }

        return players
    },
    getAcademyUnderAssociation: function(caller, apiKey, userId, associationId) {
        var academyList = academyDetails.find({
            $or: [{
                "associationId": associationId
            }, {
                "parentAssociationId": associationId
            }]
        }, {
            fields: {
                "_id": 0,
                "userId": 1,
                "clubName": 1
            }
        }).fetch();

        if (academyList.length > 0) {
            return academyList
        }
    },
    getResultsFilters: function() {
        try {
            var result = {};
            var k = pastEvents.aggregate([{
                $match: {
                    "tournamentEvent": true
                }
            }, {
                $group: {
                    "_id": null,
                    "tournaments": {
                        $push: {
                            "tournamentId": "$_id",
                            "tournamentName": "$eventName"
                        }
                    },
                    "tournamentsId": {
                        $push: "$_id"
                    },
                }
            }, {
                $project: {
                    "tournaments": 1,
                    "tournamentsId": 1,
                    "_id": 0
                }
            }])
            if (k.length > 0) {
                if (k[0].tournamentsId) {
                    result["tournamentList"] = k[0].tournaments;

                    var tournamentsIdArr = k[0].tournamentsId;
                    var m = pastEvents.aggregate([{
                        $match: {
                            "tournamentEvent": false,
                            "tournamentId": {
                                $in: tournamentsIdArr
                            }
                        }
                    }, {
                        $group: {
                            "_id": "$tournamentId",
                            "events": {
                                $addToSet: "$eventName"
                            }
                        }
                    }, {
                        $project: {
                            "tournamentId": "$_id",
                            "events": 1,
                            "_id": 0,
                        }
                    }]);
                    result["eventList"] = m;

                }
            }
            return result;
        } catch (e) {}
    },
    getResults: function(tournamentId, eventName) {
        try {

            var roundList = [];
            var result = [];

            var temp1 = MatchCollectionConfig.aggregate([{
                $match: {
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                }
            }, {
                $unwind: "$roundValues"
            }, {
                $sort: {
                    "roundValues.roundNumber": -1
                }
            }, {
                $limit: 4
            }, {
                $group: {
                    "_id": "$_id",
                    "roundNumber": {
                        $push: "$roundValues.roundNumber"
                    }
                }
            }, {
                $project: {
                    "roundNumber": 1
                }
            }])

            if (temp1.length > 0) {
                if (temp1[0].roundNumber) {
                    var xxx = temp1[0].roundNumber;
                    for (var n = 0; n < xxx.length; n++) {
                        roundList.push(parseInt(xxx[n]));
                    }
                }
            }

            var k = MatchCollectionDB.aggregate([{
                $match: {
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                    $or: [{
                        "matchRecords.roundNumber": {
                            $in: roundList
                        }
                    }, {
                        "matchRecords.roundName": {
                            $in: ["QF", "SF", "F"]
                        }
                    }]
                }
            }, {
                $unwind: "$matchRecords"
            }, {
                $match: {
                    $or: [{
                        "matchRecords.roundNumber": {
                            $in: roundList
                        }
                    }, {
                        "matchRecords.roundName": {
                            $in: ["QF", "SF", "F"]
                        }
                    }]
                }
            }, {
                $group: {
                    "_id": "$_id",
                    "matchRecords": {
                        "$push": "$matchRecords"
                    },
                }
            }, {
                $project: {
                    "matchRecords.matchNumber": 1,
                    "matchRecords.roundNumber": 1,
                    "matchRecords.status": 1,
                    "matchRecords.roundName": 1,
                    "matchRecords.players": 1,
                    "matchRecords.scores": 1,
                    "matchRecords.winner": 1,
                    "matchRecords.completedscores": 1,
                    "_id": 0
                }
            }])
            if (k.length > 0) {
                result = k[0];
                return result;

            } else
                return result;
        } catch (e) {
            return result;
        }
    },
    getDomainList: function() {
        try {
            var domainList = domains.find({
                countryName: "India"
            }, {
                sort: {
                    "domainName": 1
                }
            }).fetch();
            if (domainList.length > 0)
                return domainList;
            else
                return domains.find({}, {
                    sort: {
                        "domainName": 1
                    }
                }).fetch();
        } catch (e) {

        }
    },


    pasteventListUnderTournAPI: async function(tournamentId, userId) {
        try {
            var resultJson = {};
            var userDetails = undefined;
            if (nameToCollection(userId))
                userDetails = nameToCollection(userId).findOne({
                    "userId": userId
                });
            var userGender = "";
            var userDOB = "";
            var tournInfo = pastEvents.findOne({
                "tournamentEvent": true,
                "_id": tournamentId
            });
            var tournOrganizer = "";
            var tournSport = "";
            var eventsUnderTournament = [];
            if (userDetails == undefined) {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid user";
                return resultJson;
            }
            if (tournInfo == undefined) {
                resultJson["status"] = "failure";
                resultJson["response"] = "Invalid tournament details";
                return resultJson;
            }


            if (tournInfo && userDetails) {
                userGender = userDetails.gender.toUpperCase();
                userDOB = userDetails.dateOfBirth;

                tournOrganizer = tournInfo.eventOrganizer;
                tournSport = tournInfo.projectId[0];
                eventsUnderTournament = tournInfo.eventsUnderTournament;

                var subscribeBoolean = true;
                if (moment(moment(tournInfo.eventSubscriptionLastDate1).format("YYYY-MM-DD")) >= moment(moment.tz(tournInfo.timeZoneName).format("YYYY-MM-DD")))
                    subscribeBoolean = true;
                else
                    subscribeBoolean = true;

                var eventsUnderTourList = pastEvents.find({
                    tournamentEvent: false,
                    tournamentId: tournamentId,
                    projectType: {
                        $ne: 3
                    }
                }, {
                    fields: {
                        "_id": 1,
                        "eventName": 1,
                        "abbName": 1,
                        "prize": 1,
                        "projectType": 1,
                        "tournamentId": 1,
                        "allowSubscription": 1,
                        "eventParticipants": 1,
                        "projectId": 1,
                        "eventOrganizer": 1
                    }
                }).fetch();
                var jsonS = [];
                var sortedData = _.sortBy(eventsUnderTourList, function(obj) {
                    return _.indexOf(eventsUnderTournament, obj._id);
                });
                eventsUnderTourList = sortedData;
                var eventFeeSettingsInfo = eventFeeSettings.findOne({
                    "tournamentId": tournamentId
                });
                if (eventFeeSettingsInfo)
                    resultJson["eventFeeSettings"] = eventFeeSettingsInfo;

                var playerEntriesInfo = playerEntries.findOne({
                    "tournamentId": tournamentId,
                    "playerId": userId
                });
                if (playerEntriesInfo)
                    resultJson["playerEntries"] = playerEntriesInfo;

                for (var i = 0; i < eventsUnderTourList.length; i++) {
                    var eventUnderTour = eventsUnderTourList[i];
                    eventUnderTour['subscribeBoolean'] = subscribeBoolean;
                    var filterStatus = true;
                    var filterProjectType = eventsUnderTourList[i].projectType;
                    var userDate = "";
                    var filterDate = "";
                    var birthDetails = dobFilterSubscribe.findOne({
                        "mainProjectId": tournInfo.projectId.toString(),
                        "eventOrganizer": tournInfo.eventOrganizer.toString(),
                        "tournamentId": tournamentId,
                        "details.eventId": eventUnderTour.projectId.toString()
                    }, {
                        fields: {
                            _id: 1,
                            details: {
                                $elemMatch: {
                                    "eventId": eventUnderTour.projectId.toString()
                                }
                            }
                        }
                    });


                    if (birthDetails && birthDetails.details) {
                        if (birthDetails.details.length > 0) {
                            var j = 0;
                            var find1 = birthDetails.details[j];

                            if (find1.dateOfBirth.trim() == "NA" && find1.eventId == eventUnderTour.projectId.toString())
                                filterStatus = true;

                            else if (find1.ranking == "yes" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString()) {
                                if (userDetails.affiliationId !== null && userDetails.affiliationId != undefined && userDetails.affiliationId != "other" && userDetails.statusOfUser == "Active") {
                                    if (find1.eventId == eventUnderTour.projectId.toString()) {
                                        filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                        userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

                                        if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase())
                                            filterStatus = true
                                        else if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL")
                                            filterStatus = true
                                        else
                                            filterStatus = false
                                    }
                                } else if (find1.eventId == eventUnderTour.projectId.toString())
                                    filterStatus = false;

                            } else if (find1.ranking == "no" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString()) {
                                if (find1.eventId == eventUnderTour.projectId.toString()) {
                                    filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                                    userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

                                    if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase())
                                        filterStatus = true;
                                    else if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL")
                                        filterStatus = true;
                                    else
                                        filterStatus = false
                                }
                            }
                        }
                    }

                    if (filterStatus) {
                        var subscribeTeams = [];
                        var subscribedTeamNames = [];
                        var teamMemberDetails = {};
                        eventUnderTour["subscribeTeams"] = subscribeTeams;
                        eventUnderTour["subscribedTeamNames"] = subscribedTeamNames;

                        if (filterProjectType == 2) {
                            var teamList = playerTeams.find({
                                "teamManager": userId,
                                "teamFormatId": find1.eventId
                            }).fetch();
                            for (var h = 0; h < teamList.length; h++) {
                                var result = await Meteor.call("validateExistingTeam", teamList[h]._id)
                                try {
                                    if (result) {
                                        var teamInfoJson = {};
                                        teamInfoJson["_id"] = teamList[h]._id;
                                        teamInfoJson["teamName"] = teamList[h].teamName;
                                        if (result.teamMembers) {
                                            teamInfoJson["teamDetails"] = result.teamMembers;
                                            subscribeTeams.push(teamInfoJson);

                                            //eventUnderTour[teamList[h].teamName] = result.teamMembers;
                                            //eventUnderTour[teamList[h]._id] = result.teamMembers;
                                        }
                                        //eventUnderTour[teamList[h].teamName+"id"] = result._id;
                                        var playerTeamEntriesInfo = playerTeamEntries.findOne({
                                            "playerId": userId,
                                            "tournamentId": tournamentId
                                        });
                                        if (playerTeamEntriesInfo)
                                            eventUnderTour["subscribedTeamDetails"] = playerTeamEntriesInfo;
                                    }
                                } catch (e) {};

                            }
                            eventUnderTour["subscribeTeams"] = subscribeTeams;
                            eventUnderTour["teamMemberDetails"] = teamMemberDetails;

                        }

                        jsonS.push(eventUnderTour)
                    }
                }
                resultJson["status"] = "success";
                resultJson["data"] = jsonS;

                return resultJson;
            }
        } catch (e) {}
    },
})