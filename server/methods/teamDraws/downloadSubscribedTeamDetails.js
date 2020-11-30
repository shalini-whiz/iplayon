import {
    playerDBFind
}
from '../dbRequiredRole.js'
//userDetailsTTUsed

Meteor.methods({
    'downloadTeamDetailsForRefree': function(tournamentId, eventName) {
        try {
            //get event name and tournamentId
            if (eventName && tournamentId) {
                //user is valid
                userId = this.userId;
                var arrayToReturn = []
                    //find the tour
                var eventDetFind = events.findOne({
                    "eventName": eventName,
                    "tournamentId": tournamentId,
                    "projectType": 2
                });
                if (eventDetFind) {
                    if (eventDetFind.eventParticipants == null || eventDetFind.eventParticipants == undefined) {
                        return "0"
                    } else if (eventDetFind.eventParticipants.length == 0) {
                        return "0"
                    } else {
                        var arrayOfParticipants = [];
                        arrayOfParticipants = eventDetFind.eventParticipants;
                        //for (var i = 0; i < arrayOfParticipants.length; i++) {
                        if (true) {
                            var teamIDS = playerTeamEntries.aggregate([{
                                $match: {
                                    tournamentId: tournamentId,
                                    playerId: {
                                        $in: eventDetFind.eventParticipants
                                    }
                                }
                            }, {
                                $unwind: "$subscribedTeamsArray"
                            }, {
                                $match: {
                                    "subscribedTeamsArray.eventName": eventName
                                }
                            }, {
                                $project: {
                                    "tId": "$subscribedTeamsArray.teamId"
                                }
                            }, {
                                $group: {
                                    "_id": "o",
                                    t: {
                                        $push: "$tId"
                                    }
                                }
                            }])
                            if (teamIDS && teamIDS[0] && teamIDS[0].t) {
                                var playerIDS = playerTeams.aggregate([{
                                    $match: {
                                        "_id": {
                                            $in: teamIDS[0].t
                                        }
                                    }
                                }, {
                                    $unwind: "$teamMembers"
                                }, {
                                    $group: {
                                        "_id": "$_id",
                                        tn: {
                                            $addToSet: "$teamName"
                                        },
                                        "playerList": {
                                            $addToSet: "$teamMembers.playerId"
                                        }
                                    }
                                }, {
                                    $project: {
                                        "tId": "$_id",
                                        teamName: "$tn",
                                        players: "$playerList"
                                    }
                                }]);
                                if (playerIDS) {
                                    var teamDETAILS = []
                                    for (var pl = 0; pl < playerIDS.length; pl++) {
                                        var playerIdArr = playerIDS[pl].players;
                                        var teamName = playerIDS[pl].teamName.toString();

                                        var toret = "userDetailsTT"

                                        var usersMet = Meteor.users.findOne({
                                            userId:playerIdArr[0]
                                        })

                                        if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                            var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                            if (dbn) {
                                                toret = dbn
                                            }
                                        }

                                        var details = global[toret].aggregate([{
                                            $match: {
                                                userId: {
                                                    $in: playerIdArr
                                                }
                                            }
                                        }, {
                                            $project: {
                                                "_id":0,
                                                playerName: "$userName",
                                                emailAddress: "$emailAddress",
                                                phoneNumber: "$phoneNumber",
                                                gender: "$gender",
                                                affiliationId: "$affiliationId",
                                                teamName:{$literal:teamName}
                                            }
                                        }]);

                                        teamDETAILS = teamDETAILS.concat(details)
                                        
                                    }
                                    return teamDETAILS
                                }
                            }
                        }
                        //}

                        return arrayToReturn;
                    }
                }

            }
        } catch (e) {
            errorLog(e)
        }
    }
});