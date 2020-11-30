Meteor.methods({
    'insertEditSettings': function(xData) {
        try {
            check(xData, Object);
            let tournament = events.findOne({
                "_id": xData.tournamentId
            });
            if(tournament == undefined)
            {
                tournament = pastEvents.findOne({
                    "_id": xData.tournamentId
                });
            }
            if (tournament.eventOrganizer == Meteor.userId()) {
                var find = MatchCollectionConfig.findOne({
                    tournamentId: xData.tournamentId,
                    eventName: xData.eventName
                });
                if (find == undefined) {
                    var inserted = MatchCollectionConfig.insert({
                        "tournamentId": xData.tournamentId,
                        "eventName": xData.eventName
                    });
                    var update = MatchCollectionConfig.update({
                        "tournamentId": xData.tournamentId,
                        eventName: xData.eventName
                    }, {
                        $set: {
                            projectId: xData.projectId,
                            tournamentId: xData.tournamentId,
                            roundValues: xData.roundValues
                        }
                    });
                    if (update != undefined || update !== 0) {
                        for (var i = 0; i < xData.roundValues.length; i++) {
                            MatchCollectionConfig.update({
                                "tournamentId": xData.tournamentId,
                                eventName: xData.eventName,
                                "roundValues.roundNumber": xData.roundValues[i].roundNumber
                            }, {
                                $set: {
                                    "roundValues.$.points": "0",
                                }
                            });
                        }
                        var winner = {
                            "roundNumber": parseInt(xData.roundValues.length) + 1,
                            "points": 0,
                            "roundName": "Winner"
                        }
                        MatchCollectionConfig.update({
                            "tournamentId": xData.tournamentId,
                            "eventName": xData.eventName
                        }, {
                            $push: {
                                "roundValues": winner
                            }
                        });
                    }
                } else {
                    var update = MatchCollectionConfig.update({
                        "tournamentId": xData.tournamentId,
                        eventName: xData.eventName
                    }, {
                        $set: {
                            projectId: xData.projectId,
                            tournamentId: xData.tournamentId,
                        }
                    });
                    if (update != undefined || update !== 0) {
                        for (var i = 0; i < xData.roundValues.length; i++) {
                            MatchCollectionConfig.update({
                                "tournamentId": xData.tournamentId,
                                eventName: xData.eventName,
                                "roundValues.roundNumber": xData.roundValues[i].roundNumber
                            }, {
                                $set: {
                                    "roundValues.$.roundName": xData.roundValues[i].roundName,
                                    "roundValues.$.noofSets": xData.roundValues[i].noofSets,
                                    "roundValues.$.minScores": xData.roundValues[i].minScores,
                                    "roundValues.$.minDifference": xData.roundValues[i].minDifference
                                }
                            });
                        }
                    }
                }

            }
        } catch (e) {
            console.log(e)
        }
    }
});

Meteor.methods({
    'insertEditPointsDraws': function(xData) {
        try {
            check(xData, Object);
            let tournament = events.findOne({
                "_id": xData.tournamentId
            });
            if(tournament == undefined)
            {
                tournament = pastEvents.findOne({
                    "_id": xData.tournamentId
                });
            }

            if (tournament.eventOrganizer == Meteor.userId()) {
                var find = MatchCollectionConfig.findOne({
                    tournamentId: xData.tournamentId,
                    eventName: xData.eventName
                });
                if (find == undefined) {
                    var inserted = MatchCollectionConfig.insert({
                        "tournamentId": xData.tournamentId,
                        "eventName": xData.eventName
                    });
                    var update = MatchCollectionConfig.update({
                        "tournamentId": xData.tournamentId,
                        eventName: xData.eventName
                    }, {
                        $set: {
                            projectId: xData.projectId,
                            tournamentId: xData.tournamentId,
                            roundValues: xData.roundValues,
                        }
                    });
                    var setDetails = MasterMatchCollections.findOne({
                        "projectId": xData.projectId
                    });
                    if (update != undefined || update !== 0) {
                        for (var i = 0; i < xData.roundValues.length; i++) {
                            MatchCollectionConfig.update({
                                "tournamentId": xData.tournamentId,
                                eventName: xData.eventName,
                                "roundValues.roundNumber": xData.roundValues[i].roundNumber
                            }, {
                                $set: {
                                    "roundValues.$.noofSets": setDetails.noofSets,
                                    "roundValues.$.minScores": setDetails.minScores,
                                    "roundValues.$.minDifference": setDetails.minDifference
                                }
                            });
                        }
                    }
                } else {
                    for (var i = 0; i < xData.roundValues.length; i++) {
                        MatchCollectionConfig.update({
                            "tournamentId": xData.tournamentId,
                            eventName: xData.eventName,
                            "roundValues.roundNumber": xData.roundValues[i].roundNumber
                        }, {
                            $set: {
                                "roundValues.$.roundName": xData.roundValues[i].roundName,
                                "roundValues.$.points": xData.roundValues[i].points
                            }
                        });
                    };
                }
                var projectType = MatchCollectionConfig.findOne({
                    tournamentId: xData.tournamentId,
                    eventName: xData.eventName
                }, {
                    fields: {
                        "roundValues": 1
                    }
                });

                /*var update = MatchCollectionConfig.update({"tournamentId":xData.tournamentId,eventName:xData.eventName},{$set:{
					projectId:xData.projectId,
					tournamentId:xData.tournamentId,
					roundValues:xData.roundValues,
				}}
			);*/
            }
        } catch (e) {
            console.log(e)
        }
    }
});

Meteor.methods({
    "setTourPointsSettings":function(xData)
    {
         try {
            check(xData, Object);
            let tournament = events.findOne({
                "_id": xData.tournamentId
            });
            var configInfo = undefined;
            //if (tournament.eventOrganizer == Meteor.userId() && Meteor.userId() != null && Meteor.userId() != undefined) 
            //{
                var find = MatchCollectionConfig.findOne({
                    tournamentId: xData.tournamentId,
                    eventName: xData.eventName
                });
                if (find == undefined) 
                {
                    configInfo = MatchCollectionConfig.insert({
                        "tournamentId": xData.tournamentId,
                        "eventName": xData.eventName,
                        "projectId":xData.projectId,
                        "roundValues": xData.roundValues,
                    });

                } 
                else 
                {
                    configInfo = MatchCollectionConfig.update({
                        "tournamentId": xData.tournamentId,
                        "eventName": xData.eventName                       
                        }, {set: {
                            projectId: xData.projectId,
                            roundValues: xData.roundValues,
                        }
                    });
                }
                return configInfo;
            //}
        } catch (e) {
            console.log(e)
            return false;
        }
    }
})