/**
 * Meteor Method to subscribe to an event
 * @collectionName : events
 * @dbQuery : update
 * @dataType : Object
 * @passedByValues : eventParticipants, eventId
 * @methodDescription : push the given eventParticipants to eventParticipants
 *                      of events collection for the given eventId
 */
Meteor.methods({
    "subscribeToEvent": function(xData) {
        try {

            check(xData, Object);
            var s = events.update({
                "_id": xData.eventId
            }, {
                $push: {
                    "eventParticipants": xData.eventParticipants + ""
                }
            });
            return s;
        } catch (e) {}
    }
});

/**
 * Meteor Method to check subscriber already subscribed or not and is not blackListed user.
 * @collectionName : events, users
 * @dbQuery : findOne, find
 * @dataType : Object
 * @passedByValues : eventParticipants, eventId
 * @methodDescription : find the eventOrganizer of given eventId, find the user details
 *                      for the eventOrganizer as userId and eventParticipants as blackListedUsers,
 *                      if the length of it is 0, find event details for the eventId
 *                      and eventParticipants, if event details length is 0
 *                      return true which allows user to subscribe.
 *                      else return false. which displays user that he is already subscribed
 *                      else return null which displays user that he can not subscribe to the event
 *
 */
Meteor.methods({
    "checkSubscription": function(xData) {
        try {

            check(xData, Object);
            var eventOrganizer = events.findOne({
                "_id": xData.eventId
            }).eventOrganizer.toString();
            var checkBlackListed = Meteor.users.find({
                $and: [{
                    "userId": eventOrganizer
                }, {
                    "blackListedUsers": xData.eventParticipants
                }]
            }).fetch();
            if (checkBlackListed.length == 0) {
                var checkUser = events.find({
                    $and: [{
                        "_id": xData.eventId
                    }, {
                        "eventParticipants": xData.eventParticipants
                    }]
                }).fetch();
                if (checkUser.length == 0) {
                    return true;
                } else {
                    return false
                }
            } else {
                return null;
            }
        } catch (e) {}
    }
});

Meteor.methods({
    "subscribeToTeamEvent": function(xData) {
        try {

            check(xData, Object);
            /*var eventTeamParticipants = [];
        eventTeamParticipants.push({"teamParticipants":[],"teamId":xData.teamId});
        var checkUser = events.findOne({$and:[{"_id":xData.eventId},{"eventTeamParticipants.teamParticipants":xData.teamParticipants}]},{fields:{"eventTeamParticipants.$":1}}); 
        if(!checkUser){
        var s= events.update({
                "_id": xData.eventId.toString()
            }, 
            { $addToSet: { eventTeamParticipants: { $each:
             eventTeamParticipants } } }
            );
            return s;
        }*/
            //else return false;
            //return s;
            var eventTeamParticipants = [];
            eventTeamParticipants.push({
                "teamParticipants": [],
                "teamId": xData.eventParticipants
            });
            var s = events.update({
                "_id": xData.eventId.toString()
            }, {
                $addToSet: {
                    eventTeamParticipants: {
                        $each: eventTeamParticipants
                    }
                }
            });
            return s;
        } catch (e) {}
    }
});

Meteor.methods({
    "checkSubscriptionForTeam": function(xData) {
        try {

            check(xData, Object);
            /*var checkUser = events.findOne({$and:[{"_id":xData.eventId},{"eventTeamParticipants.teamOwner":xData.teamOwner}]},
            {fields:{"eventTeamParticipants.$":1}}); 
        if(checkUser){
            var teamName = teams.findOne({"_id":checkUser.eventTeamParticipants[0].teamId.toString()})
            return teamName.teamName.toString();
        }
        else return true;*/
            var eventOrganizer = events.findOne({
                "_id": xData.eventId
            }).eventOrganizer.toString();
            var checkBlackListed = Meteor.users.find({
                $and: [{
                    "userId": eventOrganizer
                }, {
                    "blackListedUsers": xData.teamOwner
                }]
            }).fetch();
            if (checkBlackListed.length == 0) {
                var result = [];
                var checkDoneSub;
                var eveType = events.findOne({
                    "_id": xData.eventId
                });
                //change
                var eveTourType = events.findOne({
                    "_id": eveType.tournamentId.toString()
                })
                var getTeamIds = teams.find({
                    "teamOwner": xData.teamOwner,
                    "projectName": eveTourType.projectId.toString()
                });
                if (getTeamIds.fetch().length != 0) {
                    getTeamIds.fetch().forEach(function(u) {
                        result.push(u._id)
                    });
                    checkDoneSub =
                        /* events.findOne({$and:[{"_id":xData.eventId},{"eventTeamParticipants.teamId": { $in : result}}]},
                                  {fields:{"_id":0,"eventTeamParticipants.teamId.$":1}}); */
                        events.findOne({
                            $and: [{
                                "_id": xData.eventId
                            }, {
                                "eventParticipants": {
                                    $in: result
                                }
                            }]
                        }, {
                            fields: {
                                "_id": 0,
                                "eventParticipants.$": 1
                            }
                        });
                    if (checkDoneSub !== undefined) {
                        var teamName = 0;
                        for (var i = 0; i <= checkDoneSub.eventParticipants.length; i++) {
                            teamName = teams.findOne({
                                "_id": checkDoneSub.eventParticipants[i].toString()
                            });
                            if (teamName != undefined) break;
                        };
                        if (teamName != 0)
                            return teamName.teamName.toString();
                    } else {
                        return true
                    };
                } else {
                    return false
                };
            } else {
                return null
            };
        } catch (e) {}
    }

});

Meteor.methods({
    "subscribeToMultipleEvent": function(xData) {
        

        try {
            check(xData, Object);
            if (xData.singleEventsId != undefined && xData.singleEventsId != null) {
                xData.singleEventsId = xData.singleEventsId.filter(function(n) {
                    return n != undefined
                });
                for (var i = 0; i < xData.singleEventsId.length; i++) {
                    var s = events.update({
                        "_id": xData.singleEventsId[i]
                    }, {
                        $addToSet: {
                            "eventParticipants": xData.userId
                        }
                    });
                    var data = {
                        eventId: xData.singleEventsId[i],
                        userId: xData.userId
                    }
                    computeTotalOFUserInsertpLAYER(data, function(r) {

                    })

                }
            }
            if (xData.teamEventsIdWithTeam != undefined && xData.teamEventsIdWithTeam != null) {
                xData.teamEventsIdWithTeam = xData.teamEventsIdWithTeam.filter(function(n) {
                    return n != undefined
                });
                for (var i = 0; i < xData.teamEventsIdWithTeam.length; i++) {
                    var eventParticipants = events.findOne({
                        "_id": xData.teamEventsIdWithTeam[i].eventSelected
                    });
                    if (eventParticipants.eventParticipants != undefined && eventParticipants.eventParticipants !== null) {
                        for (var j = 0; j < eventParticipants.eventParticipants.length; j++) {
                            teamOwner = teams.findOne({
                                "_id": eventParticipants.eventParticipants[j].toString()
                            });
                            if (teamOwner.teamOwner != undefined) {
                                if (teamOwner.teamOwner == xData.userId) {
                                    events.update({
                                        "_id": xData.teamEventsIdWithTeam[i].eventSelected
                                    }, {
                                        $pull: {
                                            "eventParticipants": eventParticipants.eventParticipants[j].toString()
                                        }
                                    });
                                }
                            }
                        }
                    }
                    var s = events.update({
                        "_id": xData.teamEventsIdWithTeam[i].eventSelected
                    }, {
                        $addToSet: {
                            "eventParticipants": xData.teamEventsIdWithTeam[i].teamSelected
                        }
                    });
                }
            }
            return true
        } catch (e) {
            return e;
        }
    }
});

Meteor.methods({
    "unsubscribeFromMultipleEvents": function(xData) {
        try {

            if (xData.teamsUnsub != undefined && xData.teamsUnsub != null) {
                xData.teamsUnsub = xData.teamsUnsub.filter(function(n) {
                    return n != undefined
                });
                for (var i = 0; i < xData.teamsUnsub.length; i++) {
                    var r = events.update({
                        "_id": xData.teamsUnsub[i].eventSelected
                    }, {
                        $pull: {
                            "eventParticipants": xData.teamsUnsub[i].teamSelected
                        }
                    });
                    var j = sentReceipt.remove({
                        "sentReceiptUserId": xData.userId,
                        "sentReceiptTournamentId": xData.tournamentId
                    })
                }
            }
            if (xData.singleEventsUnsub != undefined && xData.singleEventsUnsub != null) {
                xData.singleEventsUnsub = xData.singleEventsUnsub.filter(function(n) {
                    return n != undefined
                });
                for (var i = 0; i < xData.singleEventsUnsub.length; i++) {
                    var r = events.update({
                        "_id": xData.singleEventsUnsub[i]
                    }, {
                        $pull: {
                            "eventParticipants": xData.userId
                        }
                    });
                    var j = sentReceipt.remove({
                        "sentReceiptUserId": xData.userId,
                        "sentReceiptTournamentId": xData.tournamentId
                    })
                    var data = {
                        eventId: xData.singleEventsUnsub[i],
                        userId: xData.userId
                    }
                    computeTotalOFUserRemovePlayer(data, function(r) {

                    })
                }
            }
        } catch (e) {}
    }
})

Meteor.methods({
    "testArraysBeforeAndAfterSubmit": function(xData) {
        try {

            var returnVal = 0;
            if (xData.arrayOfSingleEventsOnLoad) {
                var array1 = xData.arrayOfSingleEventsOnLoad;
                var array2 = xData.singleEventsId;
                if (array1.sort().join(',') === array2.sort().join(',')) {
                    returnVal = 0;
                } else {
                    returnVal = true;
                }
            }
            if (returnVal == 0 && xData.arrayOfTeamEventsOnLoad) {
                var a1 = xData.arrayOfTeamEventsOnLoad.sort(dynamicSort("eventSelected"));
                var a2 = xData.teamEventsIdWithTeam.sort(dynamicSort("eventSelected"));
                if (xData.teamsUnsub.length !== 0) {
                    var a3 = xData.teamsUnsub.sort(dynamicSort("eventSelected"));
                    for (var j = 0; j < a3.length; j++) {
                        for (var i = 0; i < a2.length; i++) {
                            if (a2[i].eventSelected == a3[j].eventSelected && a2[i].teamSelected == a3[j].teamSelected) {
                                delete a2[i];
                                a2 = a2.filter(function(n) {
                                    return n != undefined
                                });
                            }
                        }
                    }
                }

                if (JSON.stringify(a1) == JSON.stringify(a2)) {
                    returnVal = 0;
                } else {
                    returnVal = true;
                }
            } else if (xData.arrayOfSingleEventsOnLoad.length == 0 && xData.arrayOfTeamEventsOnLoad.length == 0) {
                return true
            } else if ((xData.arrayOfSingleEventsOnLoad.length !== 0 && xData.singleEventsId.length == 0 && xData.singleEventsUnsub.length != 0) || (xData.arrayOfTeamEventsOnLoad.length !== 0 && xData.teamEventsIdWithTeam.length !== 0 && xData.teamsUnsub.length == 0)) {
                return true
            }
            return returnVal;
        } catch (e) {}
    }
});

function dynamicSort(property) {
    try {

        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function(a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    } catch (e) {}
}


var computeTotalOFUserInsertpLAYER = function(xData, callback) {
    try {

        var eventFees = events.findOne({
            "_id": xData.eventId.toString()
        });
        if (eventFees) {
            xData.eventId = eventFees.abbName;
            var totalFee = 0;
            var findFinancials = financials.findOne({
                "playerId": xData.userId,
                "eventAbbName": xData.eventId,
                tournamentId: eventFees.tournamentId
            });
            var userDetails = Meteor.users.findOne({
                "_id": xData.userId
            });
            if (userDetails != undefined || userDetails != null) {
                if (userDetails.clubNameId == undefined || userDetails.clubNameId == null) {
                    userDetails.clubNameId = "other"
                }
                var findAcaFinance = academyfinancials.findOne({
                    "tournamentId": eventFees.tournamentId,
                    "academyId": userDetails.clubNameId,
                    "eventAbbName": xData.eventId
                })
                if (findFinancials == undefined) {
                    var r = financials.insert({
                        playerId: xData.userId,
                        tournamentId: eventFees.tournamentId,
                        paidOrNot: false,
                        academyId: userDetails.clubNameId,
                        "eventAbbName": xData.eventId,
                        "eventFee": eventFees.prize
                    });

                    if (findAcaFinance == undefined) {
                        var total = 0;
                        total = eventFees.prize;
                        academyfinancials.insert({
                            academyId: userDetails.clubNameId,
                            tournamentId: eventFees.tournamentId,
                            paidOrNot: false,
                            "eventAbbName": xData.eventId,
                            "eventFee": eventFees.prize
                        });
                    } else {
                        var total = 0;
                        total = 0;
                        academyfinancials.find({
                            academyId: userDetails.clubNameId,
                            tournamentId: eventFees.tournamentId,
                            "eventAbbName": xData.eventId
                        }).map(function(doc) {
                            total = parseInt(doc.eventFee) + parseInt(eventFees.prize);
                        });
                        var l = academyfinancials.update({
                            academyId: userDetails.clubNameId,
                            tournamentId: eventFees.tournamentId,
                            "eventAbbName": xData.eventId
                        }, {
                            $set: {
                                eventFee: total
                            }
                        }, {
                            multi: true
                        })
                    }
                    return callback(true)
                } else {
                    return callback(true)
                }
            }
        }
    } catch (e) {}
}


var computeTotalOFUserRemovePlayer = function(xData, callback) {
    try {

        var eventFees = events.findOne({
            "_id": xData.eventId.toString()
        });
        if (eventFees) {
            xData.eventId = eventFees.abbName;
            var totalFee = 0;
            var findFinancials = financials.findOne({
                "playerId": xData.userId,
                "eventAbbName": xData.eventId,
                tournamentId: eventFees.tournamentId
            });
            var userDetails = Meteor.users.findOne({
                "_id": xData.userId
            });
            if (userDetails !== undefined || userDetails != null) {
                if (userDetails.clubNameId == undefined || userDetails.clubNameId == null) {
                    userDetails.clubNameId = "other"
                }
                var findAcaFinance = academyfinancials.findOne({
                    "tournamentId": eventFees.tournamentId,
                    "academyId": userDetails.clubNameId,
                    "eventAbbName": xData.eventId
                })
                if (findFinancials !== undefined) {
                    var r = financials.remove({
                        playerId: xData.userId,
                        tournamentId: eventFees.tournamentId,
                        academyId: userDetails.clubNameId,
                        "eventAbbName": xData.eventId,
                    });

                    if (findAcaFinance !== undefined) {
                        var total = 0;
                        total = 0;
                        academyfinancials.find({
                            academyId: userDetails.clubNameId,
                            tournamentId: eventFees.tournamentId,
                            "eventAbbName": xData.eventId
                        }).map(function(doc) {
                            total = parseInt(doc.eventFee) - parseInt(eventFees.prize);
                        });
                        var l = academyfinancials.update({
                            academyId: userDetails.clubNameId,
                            tournamentId: eventFees.tournamentId,
                            "eventAbbName": xData.eventId
                        }, {
                            $set: {
                                eventFee: total
                            }
                        }, {
                            multi: true
                        })
                    }
                    return callback(true)
                } else {
                    return callback(true)
                }
            }
        }
    } catch (e) {}
}

/*if(xData.singleEventsUnsub.length!==0&&xData.singleEventsId.length==0){
            for(var xj=0;xj<xData.singleEventsUnsub.length;xj++){
                var ee = events.findOne({"_id":xData.singleEventsUnsub[xj]})
                eventNames.push(ee.eventName);
            }
        }
        if(xData.singleEventsId!=undefined&&xData.singleEventsId!=null){
            xData.singleEventsId = xData.singleEventsId.filter(function(n){ return n != undefined }); 
            for(var i=0;i<xData.singleEventsId.length;i++){
                var checkUser = events.find({$and:[{"_id":xData.singleEventsId[i]},{"eventParticipants":xData.userId}]}).fetch();
                //var eventName = events.findOne({"_id":xData.})
                if(checkUser.length==0){
                    eventNames.push(checkUser.eventName)
                }
                else{
                    if(xData.singleEventsUnsub.length!==0){
                        for(var x=0;x<xData.singleEventsUnsub.length;x++){
                            if(xData.singleEventsId[i]!=xData.singleEventsUnsub[x]){
                                var ee = events.findOne({"_id":xData.singleEventsUnsub[x]})
                                eventNames.push(ee.eventName);
                            }
                        }
                    }
                }
            }
        }
        if(xData.teamEventsIdWithTeam!=undefined&&xData.teamEventsIdWithTeam!=null){
            xData.teamEventsIdWithTeam= xData.teamEventsIdWithTeam.filter(function(n){ return n != undefined }); 
            for(var i=0;i<xData.teamEventsIdWithTeam.length;i++){
                var eventName = events.findOne({"_id":xData.teamEventsIdWithTeam[i].eventSelected})
                if(eventName.eventParticipants!=undefined&&eventName.eventParticipants!==null){
                    for(var j=0;j<eventName.eventParticipants.length;j++){
                        teamOwner = teams.findOne({"_id":eventName.eventParticipants[j].toString()});
                        if (teamOwner.teamOwner!=undefined) {
                            if(teamOwner.teamOwner==xData.userId){
                                if(xData.teamsUnsub!=undefined||xData.teamsUnsub.length!=0){
                                    xData.teamsUnsub = xData.teamsUnsub.filter(function(n){ return n != undefined }); 
                                    for(var k=0;k<xData.teamsUnsub.length;k++){
                                        if(xData.teamEventsIdWithTeam[i].eventSelected==xData.teamEventsIdWithTeam[k].eventSelected){
                                            eventNames.push(eventName.eventName);
                                        }
                                    }
                                }
                                else{

                                }
                            }
                            else{
                                eventNames.push(eventName.eventName)
                            }
                        }
                    }
                }
                else{
                    eventNames.push(eventName.eventName)
                }
            }
        }
        if(eventNames.length!=0){
            return eventNames
        }
        else{
            return 0;
        }*/