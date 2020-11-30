import {
    playerDBFind
}
from '../dbRequiredRole.js'
    //userDetailsTTUsed
Meteor.methods({
    entryFromAcademyStateDA: function(xData, teamEventsData, playerId) {
        try {

            check(xData, Object);
            var tournamentId = xData.tournamentId;
            var eventEntries = xData.eventEntries;
            var userId = "";
            if (playerId == undefined)
                userId = this.userId;
            else
                userId = playerId;

            if (xData.eventEntries && teamEventsData) {
                teamEntriesCollectionUpdate(tournamentId, xData.eventEntries, teamEventsData)
            }
            if (xData.eventCollection != undefined) {
                var eventCollection = xData.eventCollection;
                eventsCollectionUpdate(tournamentId, eventCollection);
            }
            playerEntriesCollectionUpdate(tournamentId, eventEntries, xData.type,function(res) {
                if (res == true) {
                    academyEntriesCollectionUpdate(tournamentId, xData.academyEntriesId,xData.type,xData.userIdslist, function(res) {
                        districtEntriesCollectionUpdate(tournamentId, xData.dAEntriesId,xData.type,xData.userIdslist, function(res) {
                            playerEntriesComputeTotal.remove({
                                tournamentId: tournamentId,
                                loggedinID: userId
                            });
                        })
                    })
                }
            })
            return true
        } catch (e) {
        }
    }
});

var eventsCollectionUpdate = function(tournamentId, eventCollection, teamEventsData) {
    try {
        for (var i = 0; i < eventCollection.length; i++) {
            var eventsFind = events.findOne({
                "abbName": eventCollection[i].eventName,
                "tournamentId": tournamentId,
                "tournamentEvent": false
            });
            if (eventsFind) {
                if (eventCollection[i].eventUnsubscribers !== undefined && eventCollection[i].eventUnsubscribers.length != 0) {
                    events.update({
                        "abbName": eventCollection[i].eventName,
                        "tournamentId": tournamentId,
                        "tournamentEvent": false
                    }, {
                        $pull: {
                            eventParticipants: {
                                $in: eventCollection[i].eventUnsubscribers
                            }
                        }
                    });
                }
                if (eventCollection[i].eventSubscribers !== undefined && eventCollection[i].eventSubscribers.length != 0) {
                    events.update({
                        "abbName": eventCollection[i].eventName,
                        "tournamentId": tournamentId,
                        "tournamentEvent": false
                    }, {
                        $addToSet: {
                            eventParticipants: {
                                $each: eventCollection[i].eventSubscribers
                            }
                        }
                    });
                }
            }
        }
    } catch (e) {


    }
}

var playerEntriesCollectionUpdate = function(tournamentId, eventEntries, type, callBack) {
    try {
        var toret = false
        if(type && tournamentId){
            var s = events.findOne({
                "_id":tournamentId
            })
            if(s && s.projectId && s.projectId[0]){
                toret = playerDBFind(s.projectId[0])
            }
        }

        for (var j = 0; j < eventEntries.length; j++) {
            var playerEntriesFind = playerEntries.findOne({
                playerId: eventEntries[j].userId,
                tournamentId: tournamentId
            });
            if (playerEntriesFind == undefined) {
                if (eventEntries[j].totalFees != 0) {
                    var userDet;

                    if(toret && type){
                        userDet = global[toret].findOne({
                            userId:eventEntries[j].userId
                        })
                    }

                    if(toret && type && userDet){
                        if(userDet.parentAssociationId){
                            eventEntries[j].parentAssociationId = userDet.parentAssociationId
                        }
                    }

                    if(toret && type && userDet){
                        if(userDet.clubNameId){
                            eventEntries[j].academyId = userDet.clubNameId
                        }
                    }

                    if(toret && type && userDet){
                        if(userDet.associationId){
                            eventEntries[j].associationId = userDet.associationId
                        }
                    }

                    playerEntries.insert({
                        playerId: eventEntries[j].userId,
                        academyId: eventEntries[j].academyId,
                        parentAssociationId: eventEntries[j].parentAssociationId,
                        associationId: eventEntries[j].associationId,
                        tournamentId: tournamentId,
                        subscribedEvents: eventEntries[j].eventsList,
                        totalFee: eventEntries[j].totalFees,
                        paidOrNot: false
                    });
                }
            } else {
                playerEntries.update({
                    playerId: eventEntries[j].userId,
                    tournamentId: tournamentId
                }, {
                    $set: {
                        subscribedEvents: eventEntries[j].eventsList,
                        totalFee: eventEntries[j].totalFees
                    }
                });
            }
        }
        return callBack(true)
    } catch (e) {
    }
}

var academyEntriesCollectionUpdate = function(tournamentId, academyEntriesId,type,userIdds,callBack) { //lengthOfEve,callBack){
    try {

        if(type && userIdds && tournamentId){
            if(tournamentId){
                var s = events.findOne({
                    "_id":tournamentId
                })
                if(s && s.projectId && s.projectId[0]){
                    var toret = playerDBFind(s.projectId[0])
                }
                if(toret){
                    var sacad = global[toret].aggregate([{
                        $match: {
                            userId: {
                                $in: userIdds
                            },
                            affiliatedTo: "academy"
                        }
                    }, {
                        $project: {
                            "affiliationId": "$affiliationId",
                            "userId": "$userId",
                            "academyId": "$clubNameId"
                        }
                    }, {
                        $group: {
                            "_id": null,
                            "acadIds": {
                                $addToSet: "$academyId"
                            }
                        }
                    }])

                    if(sacad && sacad.length && sacad[0] && sacad[0].acadIds){
                        academyEntriesId = sacad[0].acadIds
                    }
                }
            }
        }   

        for (var k = 0; k < academyEntriesId.length; k++) {
            if (academyEntriesId[k] != "other") {
                var sum = 0;
                /*for(var l = 0;l<parseInt(lengthOfEve);l++){
                    sum.push("0")
                }*/
                playerEntries.find({
                    tournamentId: tournamentId,
                    academyId: academyEntriesId[k],
                    totalFee: {
                        "$ne": "0"
                    }
                }).map(function(doc) {
                    //sum = sum.SumArray(doc.subscribedEvents);
                    sum = parseInt(sum) + parseInt(doc.totalFee)
                });

                var academyEntriesFind = academyEntries.findOne({
                    academyId: academyEntriesId[k],
                    tournamentId: tournamentId
                });
                var academyDetailsFind = academyDetails.findOne({
                    "userId": academyEntriesId[k]
                })
                var parentAssociationId = "";
                var associationId = "";
                if (academyDetailsFind && academyDetailsFind.parentAssociationId) {
                    parentAssociationId = academyDetailsFind.parentAssociationId
                } else {
                    parentAssociationId = ""
                }
                if (academyDetailsFind && academyDetailsFind.associationId) {
                    associationId = academyDetailsFind.associationId
                } else {
                    associationId = ""
                }
                if (academyEntriesFind == undefined) {
                    //var total = sum.reduce(function(pv, cv) { return pv + cv; }, 0);
                    academyEntries.insert({
                        academyId: academyEntriesId[k],
                        tournamentId: tournamentId,
                        parentAssociationId: parentAssociationId,
                        associationId: associationId,
                        //subscribedEvents:sum,
                        totalFee: sum,
                        paidOrNot: false
                    })
                } else {
                    //var total = sum.reduce(function(pv, cv) { return pv + cv; }, 0);
                    academyEntries.update({
                        academyId: academyEntriesId[k],
                        tournamentId: tournamentId
                    }, {
                        $set: {
                            //subscribedEvents:sum,
                            totalFee: sum
                        }
                    });
                }
            }

        }
        return callBack(true)
    } catch (e) {}
}

var districtEntriesCollectionUpdate = function(tournamentId, dAEntriesId,type,userIdds, callBack) { //lengthOfEve,callBack){
        try {
            if(type && userIdds && tournamentId){
            if(tournamentId){
                var s = events.findOne({
                    "_id":tournamentId
                })
                if(s && s.projectId && s.projectId[0]){
                    var toret = playerDBFind(s.projectId[0])
                }

                if(toret){
                    var sacad = global[toret].aggregate([{
                        $match: {
                            userId: {
                                $in: userIdds
                            },
                            affiliatedTo: "districtAssociation"
                        }
                    }, {
                        $project: {
                            "affiliationId": "$affiliationId",
                            "userId": "$userId",
                            "associationId": "$associationId"
                        }
                    }, {
                        $group: {
                            "_id": null,
                            "acadIds": {
                                $addToSet: "$associationId"
                            }
                        }
                    }])
                    if(sacad && sacad.length && sacad[0] && sacad[0].acadIds){
                        dAEntriesId = sacad[0].acadIds
                    }
                }
            }
        }

            for (var w = 0; w < dAEntriesId.length; w++) {
                if (dAEntriesId[w] != "other") {
                    var associationDetailsFind = associationDetails.findOne({
                        "userId": dAEntriesId[w].toString(),
                        associationType: "District/City"
                    })
                    if (associationDetailsFind) {
                        var sum = 0;
                        /*for(var l = 0;l<parseInt(lengthOfEve);l++){
                            sum.push("0")
                        }*/
                        playerEntries.find({
                            tournamentId: tournamentId,
                            associationId: dAEntriesId[w],
                            totalFee: {
                                "$ne": "0"
                            },
                            "academyId": "other"
                        }).map(function(doc) {
                            //sum = sum.SumArray(doc.subscribedEvents);
                            sum = parseInt(sum) + parseInt(doc.totalFee)
                        });
                        var associationEntriesFind = districtAssociationEntries.findOne({
                            associationId: dAEntriesId[w],
                            tournamentId: tournamentId
                        });
                        var parentAssociationId = "";
                        var associationId = "";
                        if (associationDetailsFind && associationDetailsFind.parentAssociationId) {
                            parentAssociationId = associationDetailsFind.parentAssociationId
                        } else {
                            parentAssociationId = ""
                        }
                        if (associationDetailsFind && associationDetailsFind.associationId) {
                            associationId = associationDetailsFind.associationId
                        } else {
                            associationId = ""
                        }
                        if (associationEntriesFind == undefined) {
                            //var total = sum.reduce(function(pv, cv) { return pv + cv; }, 0);
                            districtAssociationEntries.insert({
                                associationId: dAEntriesId[w],
                                tournamentId: tournamentId,
                                parentAssociationId: parentAssociationId,
                                totalFee: sum,
                                paidOrNot: false
                            })
                        } else {
                            //var total = sum.reduce(function(pv, cv) { return pv + cv; }, 0);
                            districtAssociationEntries.update({
                                associationId: dAEntriesId[w],
                                tournamentId: tournamentId
                            }, {
                                $set: {
                                    //subscribedEvents:sum,
                                    totalFee: sum
                                }
                            });
                        }
                    }

                }
            }
            return callBack(true)
        } catch (e) {}
    }
    /*Array.prototype.SumArray = function (arr) {
        var sum = this.map(function (num, idx) {
              return parseInt(num)+ parseInt(arr[idx]);
        });
        return sum;
    }*/
Meteor.methods({
    "getAllSubscribersOfTournament": function(tournamentId, loggerId) {
        try {
            check(tournamentId, String)
            var tournamentId = tournamentId;
            var userId = "";
            if (this.userId != null && this.userId != undefined) {
                if (loggerId != undefined)
                    userId = loggerId;
                else
                    userId = this.userId;

            } else
                userId = loggerId;

            var usersEV = Meteor.users.findOne({
                "_id": userId
            });
            if(usersEV){
                var teamDetails = [];
                var playerEntriesData;
                if (usersEV.role == "Academy") {
                    playerEntriesData = playerEntries.find({
                        tournamentId: tournamentId,
                        academyId: usersEV._id
                    }, {
                        sort: {
                            academyId: 1
                        }
                    }).fetch();
                }
                if (usersEV.role == "Association") {
                    playerEntriesData = playerEntries.find({
                        tournamentId: tournamentId
                    }, {
                        sort: {
                            academyId: 1
                        }
                    }).fetch();
                }
                if (usersEV.role == "Player") {

                    playerEntriesData = playerEntries.find({
                        playerId: usersEV._id,
                        tournamentId: tournamentId
                    }).fetch();


                    playerTeamEntries.find({
                        playerId: usersEV._id,
                        tournamentId: tournamentId
                    }).fetch().forEach(function(u, len) {

                        var findForTeamSubscrition = u;

                        var indexOfPlayer = _.indexOf(_.pluck(playerEntriesData, 'playerId'), u.playerId);
                        if (indexOfPlayer == -1) {
                            playerEntriesData.push(u);

                            for (var sTId = 0; sTId < findForTeamSubscrition.subscribedTeamID.length; sTId++) {
                                var arrayTeams = findForTeamSubscrition.subscribedTeamID[sTId]
                                if (parseInt(arrayTeams) !== 0) {
                                    var teamDetailsString = '';
                                    var findTeamDet = playerTeams.findOne({
                                        "_id": arrayTeams
                                    });
                                    if (findTeamDet && findTeamDet.teamName) {
                                        teamDetailsString = "Team Name:" + findTeamDet.teamName
                                    }
                                    if (findTeamDet && findTeamDet.teamMembers) {
                                        if (findTeamDet.teamMembers.length != 0) {
                                            teamDetailsString = teamDetailsString + "\n" + "Team Members:" + " "
                                        }
                                        for (var tdPlay = 0; tdPlay < findTeamDet.teamMembers.length; tdPlay++) {
                                            var teamMembersId = findTeamDet.teamMembers[tdPlay].playerId;

                                            var usersMet = Meteor.users.findOne({
                                                userId: teamMembersId
                                            })

                                            var toret = "userDetailsTT"

                                            if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                                var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                                if (dbn) {
                                                    toret = dbn
                                                }
                                            }

                                            var userName = global[toret].findOne({
                                                "userId": teamMembersId
                                            });
                                            if (tdPlay == findTeamDet.teamMembers.length - 1) {
                                                teamDetailsString = teamDetailsString + userName.userName
                                            } else if (userName && userName.userName) {
                                                teamDetailsString = teamDetailsString + userName.userName + ", "
                                            }
                                        }
                                    }
                                } else {
                                    teamDetailsString = "0"
                                }

                                teamDetails.push(teamDetailsString)

                            }
                        } else {


                            if (findForTeamSubscrition && findForTeamSubscrition.subscribedTeamID && findForTeamSubscrition.totalFee != null && findForTeamSubscrition.totalFee != undefined) {
                                for (var sTId = 0; sTId < findForTeamSubscrition.subscribedTeamID.length; sTId++) {
                                    var arrayTeams = findForTeamSubscrition.subscribedTeamID[sTId]
                                    playerEntriesData[indexOfPlayer]["subscribedEvents"].push(arrayTeams);
                                    if (parseInt(arrayTeams) !== 0) {
                                        var teamDetailsString = '';
                                        var findTeamDet = playerTeams.findOne({
                                            "_id": arrayTeams
                                        });
                                        if (findTeamDet && findTeamDet.teamName) {
                                            teamDetailsString = "Team Name:" + findTeamDet.teamName
                                        }
                                        if (findTeamDet && findTeamDet.teamMembers) {
                                            if (findTeamDet.teamMembers.length != 0) {
                                                teamDetailsString = teamDetailsString + "\n" + "Team Members:" + " "
                                            }
                                            for (var tdPlay = 0; tdPlay < findTeamDet.teamMembers.length; tdPlay++) {
                                                var teamMembersId = findTeamDet.teamMembers[tdPlay].playerId;
                                                var toret = "userDetailsTT"

                                                var usersMet = Meteor.users.findOne({
                                                    userId: teamMembersId
                                                })

                                                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                                    if (dbn) {
                                                        toret = dbn
                                                    }
                                                }

                                                var userName = global[toret].findOne({
                                                    "userId": teamMembersId
                                                });

                                                if (tdPlay == findTeamDet.teamMembers.length - 1) {
                                                    teamDetailsString = teamDetailsString + userName.userName
                                                } else if (userName && userName.userName) {
                                                    teamDetailsString = teamDetailsString + userName.userName + ", "
                                                }
                                            }
                                        }
                                    } else {
                                        teamDetailsString = "0"
                                    }
                                    teamDetails.push(teamDetailsString)
                                }
                            }
                            if (findForTeamSubscrition.totalFee)
                                playerEntriesData[indexOfPlayer]["totalFee"] = parseInt(playerEntriesData[indexOfPlayer]["totalFee"]) + parseInt(findForTeamSubscrition.totalFee)
                        }

                        if (findForTeamSubscrition.totalFee)
                            playerEntriesData[len]["teamTotalFee"] = findForTeamSubscrition.totalFee;

                        playerEntriesData[len]["subscribedTeamsArray"] = teamDetails;
                    });

                    if (playerTeamEntries.find({
                            playerId: usersEV._id,
                            tournamentId: tournamentId
                        }).fetch().length == 0) {
                        var eventFeeSettingsFind = eventFeeSettings.findOne({
                            tournamentId: tournamentId
                        });
                        if (eventFeeSettingsFind && eventFeeSettingsFind.teamEvents) {
                            if (eventFeeSettingsFind.teamEvents.length !== 0) {
                                for (var eveFee = 0; eveFee < eventFeeSettingsFind.teamEvents.length; eveFee++) {
                                    var indexOfPlayerNoSub = _.indexOf(_.pluck(playerEntriesData, 'playerId'), usersEV._id);
                                    if (indexOfPlayerNoSub !== -1) {
                                        playerEntriesData[indexOfPlayerNoSub]["subscribedEvents"].push("0");
                                    }
                                }
                            }
                        }
                    }


                    if (playerEntries.find({
                            playerId: usersEV._id,
                            tournamentId: tournamentId
                        }).fetch().length == 0 && playerTeamEntries.find({
                            playerId: usersEV._id,
                            tournamentId: tournamentId
                        }).fetch().length !== 0) {
                        var eventFeeSettingsFindeveFeeSingle = eventFeeSettings.findOne({
                            tournamentId: tournamentId
                        });
                        if (eventFeeSettingsFindeveFeeSingle && eventFeeSettingsFindeveFeeSingle.singleEvents !== undefined) {
                            if (eventFeeSettingsFindeveFeeSingle.singleEvents.length !== 0) {
                                for (var eveFeeSingle = 0; eveFeeSingle < eventFeeSettingsFindeveFeeSingle.singleEvents.length; eveFeeSingle++) {
                                    var indexOfPlayerNoSubSingle = _.indexOf(_.pluck(playerEntriesData, 'playerId'), usersEV._id);
                                    if (indexOfPlayerNoSubSingle !== -1) {
                                        playerEntriesData[indexOfPlayerNoSubSingle]["subscribedEvents"].insert(eveFeeSingle, '0');
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i = 0; i < playerEntriesData.length; i++) {
                    var toret = "userDetailsTT"

                    var usersMet = Meteor.users.findOne({
                        userId: playerEntriesData[i].playerId
                    })

                    if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                        var dbn = playerDBFind(usersMet.interestedProjectName[0])
                        if (dbn) {
                            toret = dbn
                        }
                    }


                    var userDetails = global[toret].findOne({
                        "userId": playerEntriesData[i].playerId
                    });
                    playerEntriesData[i]["userName"] = userDetails.userName;
                    if (userDetails.emailAddress)
                        playerEntriesData[i]["emailAddress"] = userDetails.emailAddress;
                    if (userDetails.clubNameId) {
                        var aca = academyDetails.findOne({
                            "userId": userDetails.clubNameId
                        })
                        if (aca && aca.clubName)
                            playerEntriesData[i]["clubName"] = aca.clubName;
                        else playerEntriesData[i]["clubName"] = "other";
                    } else
                        playerEntriesData[i]["clubName"] = "other";
                    if (userDetails.phoneNumber)
                        playerEntriesData[i]["phoneNumber"] = userDetails.phoneNumber
                    else
                        playerEntriesData[i]["phoneNumber"] = "";
                    if (userDetails.affiliationId)
                        playerEntriesData[i]["affiliationId"] = userDetails.affiliationId
                    else
                        playerEntriesData[i]["affiliationId"] = "";
                    if (userDetails.guardianName)
                        playerEntriesData[i]["guardianName"] = userDetails.guardianName
                    else
                        playerEntriesData[i]["guardianName"] = "";
                    if (userDetails.address)
                        playerEntriesData[i]["address"] = userDetails.address
                    else
                        playerEntriesData[i]["address"] = "";
                    if (userDetails.dateOfBirth)
                        playerEntriesData[i]["dateOfBirth"] = userDetails.dateOfBirth
                    else
                        playerEntriesData[i]["dateOfBirth"] = "";
                    if (userDetails.gender)
                        playerEntriesData[i]["gender"] = userDetails.gender
                    else
                        playerEntriesData[i]["gender"] = "";

                    //team subscription details
                    //var findForTeamSubscrition = playerTeamEntries.findOne({tournamentId:tournamentId,playerId:playerEntriesData[i].playerId});
                    /*if(findForTeamSubscrition&&findForTeamSubscrition.subscribedTeamID&&findForTeamSubscrition.totalFee!=null&&findForTeamSubscrition.totalFee!=undefined){
                        for(var sTId = 0; sTId<findForTeamSubscrition.subscribedTeamID.length;sTId++){
                            var arrayTeams = findForTeamSubscrition.subscribedTeamID[sTId]
                            playerEntriesData[i]["subscribedEvents"].push(arrayTeams);
                            if(parseInt(arrayTeams)!==0){
                                var teamDetailsString = '';
                                var findTeamDet = playerTeams.findOne({"_id":arrayTeams});
                                if(findTeamDet&&findTeamDet.teamName){
                                    teamDetailsString = "Team Name:"+findTeamDet.teamName
                                }
                                if(findTeamDet&&findTeamDet.teamMembers){
                                    if(findTeamDet.teamMembers.length!=0){
                                         teamDetailsString = teamDetailsString+"\n"+"Team Members:"+" "
                                    }
                                    for(var tdPlay = 0;tdPlay<findTeamDet.teamMembers.length;tdPlay++){
                                        var teamMembersId = findTeamDet.teamMembers[tdPlay].playerId;
                                        var userName = suserDetailsTT.findOne({"userId":teamMembersId});
                                        if(tdPlay==findTeamDet.teamMembers.length-1){
                                            teamDetailsString = teamDetailsString+userName.userName
                                        }
                                        else if(userName&&userName.userName){
                                            teamDetailsString = teamDetailsString+userName.userName+", "
                                        }
                                    }
                                }
                            }
                            else{
                                teamDetailsString = "0"
                            }
                            teamDetails.push(teamDetailsString)
                        }
                        if(findForTeamSubscrition.totalFee)
                            playerEntriesData[i]["teamTotalFee"] = findForTeamSubscrition.totalFee
                        playerEntriesData[i]["subscribedTeamsArray"] = teamDetails;
                        playerEntriesData[i]["totalFee"] = parseInt(findForTeamSubscrition.totalFee)+parseInt(playerEntriesData[i]["totalFee"])
                    }*/

                    //playerEntriesData[i]["totalFee"] = parseInt(playerEntriesData[i]["totalFee"])
                }
                return playerEntriesData;
            }else{
                return false
            }
        } catch (e) {
            return false
        }
    }

})

Meteor.methods({


    playerEntriesComputeTotal: function(xData) {
        try {
            var tournamentId = xData.tournamentId;
            var eventEntries = xData.eventEntries;
            var userId = this.userId;
            playerEntriesCompTotalCollectionUpdate(userId, tournamentId, eventEntries, function(res) {})
            return true

        } catch (e) {}
    }
});

var playerEntriesCompTotalCollectionUpdate = function(userID, tournamentId, eventEntries, callBack) {
    try {

        for (var j = 0; j < eventEntries.length; j++) {
            var playerEntriesFind = playerEntriesComputeTotal.findOne({
                playerId: eventEntries[j].userId,
                tournamentId: tournamentId,
                loggedinID: userID,
            });
            if (playerEntriesFind == undefined) {
                playerEntriesComputeTotal.insert({
                    playerId: eventEntries[j].userId,
                    loggedinID: userID,
                    tournamentId: tournamentId,
                    subscribedEvents: eventEntries[j].eventsList,
                    totalFee: eventEntries[j].totalFees,
                });
            } else {
                playerEntriesComputeTotal.update({
                    playerId: eventEntries[j].userId,
                    tournamentId: tournamentId,
                    loggedinID: userID,
                }, {
                    $set: {
                        subscribedEvents: eventEntries[j].eventsList,
                        totalFee: eventEntries[j].totalFees
                    }
                });
            }
        }
        return callBack(true)
    } catch (e) {}
}

Meteor.methods({
    playertotalCountDAtaBase: function(xDAtatournamentId) {
        try {

            check(xDAtatournamentId, String)
            var userId = this.userId;
            playerEntriesComputeTotal.remove({
                tournamentId: xDAtatournamentId,
                loggedinID: userId
            });
            return true
        } catch (e) {}
    }
});

teamEntriesCollectionUpdate = function(tournamentId, eventEntries, teamEventsData) {
    try {


        for (var tp = 0; tp < eventEntries.length; tp++) {
            var teamEntriesFind = playerTeamEntries.findOne({
                playerId: eventEntries[tp].userId,
                tournamentId: tournamentId
            });
            var subscribedTeamsArray, subscribedTeamID;
            if (teamEntriesFind == undefined) {
                if (eventEntries[tp].totalFeesOfTeam != 0) {
                    playerTeamEntries.insert({
                        playerId: eventEntries[tp].userId,
                        academyId: eventEntries[tp].academyId,
                        parentAssociationId: eventEntries[tp].parentAssociationId,
                        associationId: eventEntries[tp].associationId,
                        tournamentId: tournamentId,
                        subscribedEvents: eventEntries[tp].teamEventList,
                        totalFee: eventEntries[tp].totalFeesOfTeam,
                        subscribedTeamID: eventEntries[tp].teamIdsArray,
                        subscribedTeamsArray: eventEntries[tp].subscribedTeamsArray,
                        paidOrNot: false
                    });
                }
            } else {
                if (eventEntries[tp].subscribedTeamsArray.length == 0 && teamEntriesFind.subscribedTeamsArray && teamEntriesFind.subscribedTeamID) {
                    eventEntries[tp].subscribedTeamsArray = teamEntriesFind.subscribedTeamsArray;
                    eventEntries[tp].teamIdsArray = teamEntriesFind.subscribedTeamID
                }
                if (eventEntries[tp].teamEventList.length != 0) {
                    for (var tu = 0; tu < eventEntries[tp].teamEventList.length; tu++) {
                        if (eventEntries[tp].teamEventList[tu]) {
                            var teamEventListARR = eventEntries[tp].teamEventList[tu];
                            if (parseInt(teamEventListARR) == 0) {
                                eventEntries[tp].teamIdsArray[tu] = "0"
                            }
                        }
                    }
                }
                if (eventEntries[tp].subscribedTeamsArray) {
                    var subscribedTeamsArray = eventEntries[tp].subscribedTeamsArray;
                    for (var Jsontu = 0; Jsontu < eventEntries[tp].unsubscriberdTeamEventsNames.length; Jsontu++) {
                        var eventName = eventEntries[tp].unsubscriberdTeamEventsNames[Jsontu]
                        var indexDUnsub = _.indexOf(_.pluck(subscribedTeamsArray, 'eventName'), eventName);
                        if (indexDUnsub !== -1) {
                            subscribedTeamsArray.splice(indexDUnsub, 1);
                        }
                    }
                }

                playerTeamEntries.update({
                    playerId: eventEntries[tp].userId,
                    tournamentId: tournamentId
                }, {
                    $set: {
                        subscribedEvents: eventEntries[tp].teamEventList,
                        totalFee: eventEntries[tp].totalFeesOfTeam,
                        subscribedTeamID: eventEntries[tp].teamIdsArray,
                        subscribedTeamsArray: eventEntries[tp].subscribedTeamsArray
                    }
                });
            }
        }
    } catch (e) {}
}

Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
};

Meteor.methods({
    "insertForMaximumNumber": function(tourId, userId) {
        try {
            if (this.userId) {
                var s = tempEventPartcipants.remove({
                    tourId: tourId,
                    loggerId: userId
                });
                var eventsDet = events.find({
                    "tournamentId": tourId
                }).fetch().forEach(function(e, i) {
                    var evePartsLength = 0
                    if (e.eventParticipants) {
                        evePartsLength = e.eventParticipants.length;
                    }
                    if (e.abbName) {
                        var r = tempEventPartcipants.insert({
                            tourId: tourId,
                            abbName: e.abbName,
                            loggerId: userId,
                            evePartsLength: evePartsLength
                        })
                    }
                });
            }

        } catch (e) {}
    }
});

Meteor.publish("tempEventPartcipants", function() {
    var lData = tempEventPartcipants.find({});
    if (lData)
        return lData;
    else
        this.ready()
});

Meteor.methods({
    "updateIncTempEventParts": function(id, evePartsLength) {
        try {

            var r = tempEventPartcipants.update({
                "_id": id
            }, {
                $set: {
                    evePartsLength: parseInt(evePartsLength + 1)
                }
            });
            return r
        } catch (e) {}
    }
});

Meteor.methods({
    "updateDecTempEventParts": function(id, evePartsLength) {
        try {

            if (evePartsLength != 0) {
                var r = tempEventPartcipants.update({
                    "_id": id
                }, {
                    $set: {
                        evePartsLength: parseInt(evePartsLength - 1)
                    }
                });
                return r
            }
        } catch (e) {}
    }
});

Meteor.methods({
    "removeForMaximumNumber": function(tourId, userId) {
        try {
            if (evePartsLength != 0) {
                var r = tempEventPartcipants.remove({
                    tourId: tourId,
                    loggerId: userId,
                });
                return r
            }
        } catch (e) {}
    }
});


Meteor.methods({
    "computeTotalOFSingleMethod": async function(eventsChecked, totalAMT, playerId, tourId, logId) {
        try {

            var s = events.findOne({
                "_id": tourId
            })
            if (s && s.projectId && s.projectId[0]) {
                var toret = playerDBFind(s.projectId[0])
                if (toret) {
                    var userFound = global[toret].findOne({
                        userId: playerId
                    })
                    if (userFound) {
                        var clubNameIdDet = "";
                        var associationId = "";
                        var parentAssociationId = "";
                        var subDetails = []
                        var academyEntriesId = []

                        if (userFound.clubNameId == undefined || userFound.clubNameId == null) {
                            clubNameIdDet = "other";
                        } else {
                            clubNameIdDet = userFound.clubNameId;
                        }
                        if (userFound.associationId == undefined || userFound.associationId == null) {
                            associationId = "other";
                        } else {
                            associationId = userFound.associationId;
                        }
                        if (userFound.parentAssociationId == undefined || userFound.parentAssociationId == null) {
                            parentAssociationId = "other";
                        } else {
                            parentAssociationId = userFound.parentAssociationId;
                        }
                        if (_.findWhere(academyEntriesId, clubNameIdDet) == null) {
                            academyEntriesId.push(clubNameIdDet);
                        }
                        var data = {
                            userId: playerId,
                            academyId: clubNameIdDet,
                            parentAssociationId: parentAssociationId,
                            associationId: associationId,
                            eventsList: eventsChecked,
                            totalFees: totalAMT
                        }
                        if (data["userId"].length !== 0)
                            subDetails.push(data)

                        var finalData = {
                            tournamentId: tourId,
                            eventEntries: subDetails,
                            //lengthOfEve:events.length
                        }
                        var r = await Meteor.call("playerEntriesComputeTotal", finalData)
                        try {
                            if (r) {
                                var playerEntriesComputeTotalfind = playerEntriesComputeTotal.findOne({
                                    "tournamentId": tourId,
                                    playerId: playerId,
                                    loggedinID: logId
                                })
                                return playerEntriesComputeTotalfind
                            }
                        } catch (e) {}
                    }
                }
            }

        } catch (e) {
        }
    }
})