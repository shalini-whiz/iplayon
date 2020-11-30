import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';

Meteor.methods({
    'getEventDetails': function(xData) {
        var userID = this.userId;
        if (userID) {
            var userDEt = Meteor.users.findOne({
                "_id": userID
            });
            if (userDEt && userDEt.interestedProjectName) {
                var tournDeta = tournamentEvents.findOne({
                    "_id": userDEt.interestedProjectName.toString()
                });
                if (tournDeta && tournDeta.projectSubName) {
                    return tournDeta.projectSubName
                }
            }

        }
    },

    'tournamnetNAMeFindPA': function(xData) {
        var tournId = xData;
        if (tournId) {
            var tournamentName = pastEvents.findOne({
                "_id": tournId
            });
            if (tournamentName)
                return tournamentName
        }
    },

    'getUSERName': function(xData) {
        var userID = xData;
        if (userID) {
            var userName = Meteor.users.findOne({
                "userId": userID
            });
            if (userName && userName.userName)
                return userName.userName
        }
    },

    'searchForRoundName': function(tournamentId, eventName, player1ID, player2ID) {
        var roundNumber = MatchCollectionDB.aggregate([{
            $match: {
                tournamentId: tournamentId,
                eventName: eventName
            }
        }, {
            $unwind: "$matchRecords"
        }, {
            $match: {
                $or: [{
                    $and: [{
                        "matchRecords.playersID.playerAId": player1ID
                    }, {
                        "matchRecords.playersID.playerBId": player2ID
                    }]
                }, {
                    $and: [{
                        "matchRecords.playersID.playerAId": player2ID
                    }, {
                        "matchRecords.playersID.playerBId": player1ID
                    }]
                }],
            }
        },{
            $project:{
                "roundNumber": "$matchRecords.roundNumber",
            }
        }]);

        if(roundNumber&&roundNumber[0]&&roundNumber[0].roundNumber!=null&&roundNumber[0].roundNumber!=undefined){
            var roundname = MatchCollectionConfig.aggregate([
                {
                    $match:{
                        tournamentId:tournamentId,
                        eventName:eventName
                    }
                },
                {
                    $unwind:"$roundValues"
                },
                {
                    $match:{
                        "roundValues.roundNumber":roundNumber[0].roundNumber.toString()
                    }
                },
                {
                    $project:{
                        "roundName":"$roundValues.roundName"
                    }
                }
            ]);
            return roundname[0].roundName
        }
        /*var getMAtchCollectionDetails = MatchCollectionDB.findOne({
            tournamentId: tournamentId,
            eventName: eventName
        });
        if (getMAtchCollectionDetails && getMAtchCollectionDetails.matchRecords) {
            for (var i = 0; i < getMAtchCollectionDetails.matchRecords.length; i++) {
                var matchRecordsDataDet = getMAtchCollectionDetails.matchRecords[i]
                var matchRecordsData = getMAtchCollectionDetails.matchRecords[i].playersID;


                if (matchRecordsData) {
                    if ((matchRecordsData.playerAId == player1ID && matchRecordsData.playerBId == player2ID) || (matchRecordsData.playerAId == player2ID && matchRecordsData.playerBId == player1ID)) {
                        var getRoundName = MatchCollectionConfig.findOne({
                            tournamentId: tournamentId,
                            eventName: eventName
                        });
                        if (getRoundName && getRoundName.roundValues) {
                            for (var j = 0; j < getRoundName.roundValues.length; j++) {
                                var roundValuesDet = getRoundName.roundValues[j];
                                if (roundValuesDet.roundNumber == matchRecordsDataDet.roundNumber) {
                                    return roundValuesDet.roundName
                                }
                            }
                        }
                    }
                }
            }
        }*/
    },

    "tournamentInfoPlayerAnalytics": function(tournamentId) {
        if (tournamentId) {
            var tournamentDetails = pastEvents.findOne({
                "_id": tournamentId
            });
            if (tournamentDetails && tournamentDetails.eventOrganizer && tournamentDetails.eventStartDate && tournamentDetails.eventEndDate && tournamentDetails.eventSubscriptionLastDate) {
                var orgaNizerName = Meteor.users.findOne({
                    "userId": tournamentDetails.eventOrganizer
                });
                if (orgaNizerName && orgaNizerName.userName) {
                    orgaNizerName = orgaNizerName.userName
                } else {
                    orgaNizerName = " ";
                }
                var venue = " ";
                if (tournamentDetails.venueAddress && tournamentDetails.domainName) {
                    venue = tournamentDetails.venueAddress + "," + tournamentDetails.domainName;
                } else if (tournamentDetails.domainName) {
                    venue = tournamentDetails.domainName
                }

                var data = {
                    eventName: tournamentDetails.eventName,
                    orgaNizerName: orgaNizerName,
                    eventSubscriptionLastDate: tournamentDetails.eventSubscriptionLastDate,
                    eventStartDate: tournamentDetails.eventStartDate,
                    eventEndDate: tournamentDetails.eventEndDate,
                    venue: venue
                }
                return data
            }
        }
    },

    "playerAnalyticsExternalAPI": function(eventName, player1ID, player2ID) {
        var tournDeta = [];
        if (eventName && player1ID && player2ID) {
            var pastEventsFetch = pastEvents.find({
                eventName: eventName,
                $or: [{
                    eventParticipants: player1ID
                }, {
                    eventParticipants: player2ID
                }]
            }, {
                sort: {
                    eventStartDate1: -1
                },
                fields: {
                    tournamentId: 1
                }
            }).fetch();
            if (pastEventsFetch.length != 0) {
                for (var j = 0; j < pastEventsFetch.length; j++) {
                    var tournamentName;
                    var roundName = "-";
                    tournamentName = pastEvents.findOne({
                        "_id": pastEventsFetch[j].tournamentId
                    });
                    var getMAtchCollectionDetails = MatchCollectionDB.findOne({
                        tournamentId: pastEventsFetch[j].tournamentId,
                        eventName: eventName
                    });
                    if (getMAtchCollectionDetails && getMAtchCollectionDetails.matchRecords) {
                        for (var i = 0; i < getMAtchCollectionDetails.matchRecords.length; i++) {
                            var matchRecordsDataDet = getMAtchCollectionDetails.matchRecords[i]
                            var matchRecordsData = getMAtchCollectionDetails.matchRecords[i].playersID;
                            if (matchRecordsData) {
                                if ((matchRecordsData.playerAId == player1ID && matchRecordsData.playerBId == player2ID) || (matchRecordsData.playerAId == player2ID && matchRecordsData.playerBId == player1ID)) {
                                    var getRoundName = MatchCollectionConfig.findOne({
                                        tournamentId: pastEventsFetch[j].tournamentId,
                                        eventName: eventName
                                    });
                                    if (getRoundName && getRoundName.roundValues) {
                                        for (var jk = 0; jk < getRoundName.roundValues.length; jk++) {
                                            var roundValuesDet = getRoundName.roundValues[jk];
                                            if (roundValuesDet.roundNumber == matchRecordsDataDet.roundNumber) {
                                                roundName = roundValuesDet.roundName
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var data = {
                        tournamentName: tournamentName.eventName,
                        tournamentStartDate: tournamentName.eventStartDate,
                        roundName: roundName
                    }
                    tournDeta.push(data)
                }
            }
            return tournDeta
        }

    }
});