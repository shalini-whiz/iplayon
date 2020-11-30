//validation for temp create team for length of players
Meteor.methods({
    "validationForTeamFormatAndPlayersLength": function(teamFormatId, playersDetails) {
        try {
            var formatId = teamFormatId;
            var messageValidations = [];
            if (teamsFormat.findOne({
                    "_id": teamFormatId
                }) == undefined) {
                var message = {
                    "message": "Team Foramat Id is not valid."
                }
                messageValidations.push(message.message)
            }

            if (playersDetails.length == 0) {
                var message = {
                    "message": "Require Players Details."
                }
                messageValidations.push(message.message)
            }

            if (messageValidations.length != 0) {
                return messageValidations;
            } else return "0";

        } catch (e) {
            return e
        }
    }
});

//validation of each criteria
Meteor.methods({
    "validationForEachCriteria_School": function(teamFormatId, playersDetails, schoolId,tournamentType) {
        try {
            var formatId = teamFormatId;
            var messageValidations = [];
            if (teamsFormat.findOne({
                    "_id": teamFormatId
                }) == undefined) {
                var message = {
                    "message": "Team Foramat Id is not valid."
                }
                messageValidations.push(message.message)
            }

            if (playersDetails.length == 0) {
                var message = {
                    "message": "Require Players Details."
                }
                messageValidations.push(message.message)
            } else
                for (var i = 0; i < playersDetails.length; i++) {
                    if (playersDetails[i] && playersDetails[i].teamEvent != undefined && playersDetails[i].teamEvent == true) {
                        var playersDet;
                        var dateOfBirth;
                        var gender;
                        playersDet = playersDetails[i];
                        var playerDetFromDB = schoolPlayers.findOne({
                            "userId": playersDetails[i].playerId
                        });
                        
                        var playerSchoolCheck = schoolPlayers.findOne({
                            "userId": playersDetails[i].playerId.trim(),
                            "schoolId": schoolId
                        })
                        
                        if(tournamentType){
                            var scDet = schoolEventsToFind.aggregate([{"$unwind":"$tournamentTypes"},{$match:{"tournamentTypes.name":tournamentType}}])
                            if(scDet && scDet.length && scDet[0]  
                                && scDet[0].tournamentTypes && scDet[0].tournamentTypes.year && scDet[0].tournamentTypes.type){
                                if(playerDetFromDB && playerDetFromDB.class){
                                    var addToScl = schoolDetails.update({"userId": schoolId},{
                                        $addToSet:{
                                            playerId:{
                                                "studentID":playerDetFromDB.userId,
                                                "class":playerDetFromDB.class
                                            }
                                        }
                                    })
                                    if(addToScl){
                                        playerSchoolCheck = true
                                    }
                                }
                            }
                        }

                        

                        if (playerSchoolCheck) {
                            if (playerDetFromDB && playerDetFromDB.dateOfBirth && playerDetFromDB.gender) {

                                playersDet.dateOfBirth = playerDetFromDB.dateOfBirth;
                                playersDet.gender = playerDetFromDB.gender;

                                var teamDeta = teamsFormat.aggregate([{
                                    $match: {
                                        "_id": teamFormatId
                                    }
                                }, {
                                    $unwind: "$playerFormatArray"
                                }, {
                                    $match: {
                                        "playerFormatArray.playerNo": "p1", // playersDet.playerNumber
                                    }
                                }, {
                                    $project: {
                                        format: "$playerFormatArray"
                                    }
                                }])
                                if (teamDeta && teamDeta[0] && teamDeta[0].format) {
                                    var format = teamDeta[0].format

                                    //dob
                                    /*if (format.dateType && format.dateType == "before") {
                                        if (format.dateValue) {
                                            if (new Date(moment(new Date(format.dateValue)).format("YYYY-MM-DD")) > new Date(moment(new Date(playersDet.dateOfBirth)).format("YYYY-MM-DD"))) {} else {
                                                var message = {
                                                    message: "Player with id " + playersDet.playerId + ", date of birth criteria fails. It should be before " + moment(new Date(format.dateValue)).format("YYYY MMM DD") + " ."
                                                };
                                                messageValidations.push(message.message)
                                            }
                                        }
                                    } else if (format.dateType && format.dateType == "onBefore") {

                                        if (format.dateValue) {
                                            if (new Date(moment(new Date(format.dateValue)).format("YYYY-MM-DD")) >= new Date(moment(new Date(playersDet.dateOfBirth)).format("YYYY-MM-DD"))) {} else {
                                                var message = {
                                                    message: "Player with id " + playersDet.playerId + ", date of birth criteria fails. It should be on or before " + moment(new Date(format.dateValue)).format("YYYY MMM DD") + " ."
                                                };
                                                messageValidations.push(message.message)
                                            }
                                        }
                                    } else if (format.dateType && format.dateType == "after") {
                                        if (format.dateValue) {
                                            if (new Date(moment(new Date(format.dateValue)).format("YYYY-MM-DD")) < new Date(moment(new Date(playersDet.dateOfBirth)).format("YYY-MM-DD"))) {} else {
                                                var message = {
                                                    message: "Player with id " + playersDet.playerId + ", date of birth criteria fails. It should be on or after " + moment(new Date(format.dateValue)).format("YYYY MMM DD") + " ."
                                                };
                                                messageValidations.push(message.message)
                                            }
                                        }
                                    } else if (format.dateType && format.dateType == "onAfter") {
                                        if (format.dateValue) {
                                            if (new Date(moment(new Date(format.dateValue)).format("YYYY-MM-DD")) <= new Date(moment(new Date(playersDet.dateOfBirth)).format("YYYY-MM-DD"))) {} else {
                                                var message = {
                                                    message: "Player with id " + playersDet.playerId + ", date of birth criteria fails. It should be after " + moment(new Date(format.dateValue)).format("YYYY MMM DD") + " ."
                                                };
                                                messageValidations.push(message.message)
                                            }
                                        }
                                    }*/

                                    //class
                                    if (format && format.minClass && format.maxClass && format.minClass != undefined && format.maxClass != undefined) {
                                        var formatMinClass = format.minClass;
                                        var formatMaxClass = format.maxClass;

                                        var classDEt = schoolDetails.aggregate([{
                                            $match: {
                                                userId: schoolId
                                            }
                                        }, {
                                            $unwind: "$playerId"
                                        }, {
                                            $match: {
                                                "playerId.studentID": playersDet.playerId
                                            }
                                        }, {
                                            $project: {
                                                "class": "$playerId.class"
                                            }
                                        }]);

                                        if (formatMinClass.toLowerCase() != "any" && formatMaxClass.toLowerCase() != "any") {
                                            if (classDEt && classDEt[0] && classDEt[0].class) {
                                                var minClass = formatMinClass;
                                                var maxClass = formatMaxClass;
                                                playersDet.class = classDEt[0].class;
                                                //minClass is any, maxClass is not any
                                                if (minClass.toLowerCase() == "any" && maxClass.toLowerCase() != "any") {
                                                    if (parseInt(playersDet.class) > 0 && parseInt(playersDet.class) <= parseInt(maxClass)) {

                                                    } else {
                                                        var message = {
                                                            message: "Player with id " + playersDet.playerId + ", has class error. It should be less than or equal to " + maxClass + "."
                                                        };
                                                        messageValidations.push(message.message)
                                                    }
                                                }
                                                //minClass is not any, maxClass is any
                                                else if (maxClass.toLowerCase() == "any" && minClass.toLowerCase() != "any") {
                                                    if (parseInt(playersDet.class) > 0 && parseInt(playersDet.class) >= parseInt(minClass)) {

                                                    } else {
                                                        var message = {
                                                            message: "Player with id " + playersDet.playerId + ", has class error. It should be greater than or equal to " + minClass + "."
                                                        };
                                                        messageValidations.push(message.message)
                                                    }
                                                }
                                                //minClass is not any, maxClass is not any
                                                else if (maxClass.toLowerCase() !== "any" && minClass.toLowerCase() != "any") {
                                                    if (parseInt(playersDet.class) > 0 && parseInt(playersDet.class) >= parseInt(minClass) && parseInt(playersDet.class) <= parseInt(maxClass)) {

                                                    } else {
                                                        var message = {
                                                            message: "Player with id " + playersDet.playerId + ", has class error. It should be greater than or equal to " + minClass + " and " + "It should be less than or equal to " + maxClass + "."
                                                        };
                                                        messageValidations.push(message.message)
                                                    }
                                                }

                                            } else {
                                                var message = {
                                                    message: "Player with id " + playersDet.playerId + ", has class error ."
                                                };
                                                messageValidations.push(message.message)
                                            }
                                        }
                                    }


                                    //gender
                                    if (format.gender && format.gender == "Male") {
                                        if (playersDet.gender.toLowerCase() !== format.gender.toLowerCase()) {
                                            var message = {
                                                message: "Player with id " + playersDet.playerId + ", gender criteria fails. It should be " + format.gender + " ."
                                            };
                                            messageValidations.push(message.message)
                                        }
                                    } else if (format.gender && format.gender == "Female") {
                                        if (playersDet.gender.toLowerCase() !== format.gender.toLowerCase()) {
                                            var message = {
                                                message: "Player with id " + playersDet.playerId + ", gender criteria fails. It should be " + format.gender + " ."
                                            };
                                            messageValidations.push(message.message)
                                        }
                                    }
                                } else {}
                            } else {
                                var message = {
                                    message: "Player with id " + playersDet.playerId + " is not registered."
                                };
                                messageValidations.push(message.message)
                            }
                        } else {
                            var message = {
                                message: "Player with id " + playersDet.playerId + " is not registered under given school."
                            };
                            messageValidations.push(message.message)
                        }
                    }
                }

            if (messageValidations.length != 0) {
                return messageValidations;
            } else {
                return "0";
            }
        } catch (e) {
            messageValidations.push(e);
            return messageValidations;
        }
    }
});

//validation of mandatory players before
/*Meteor.methods({
    "validationForMandatoryPlayers_School": function(teamFormatId, playersDetails) {
        try {
            var formatId = teamFormatId;
            mandPlayersArrPosition = [];

            var messageValidations = "0";
            if (playersDetails.length == 0) {
                //var message = {"message":"Require Players Details"+" ."}
            } else {
                var teamDeta = teamsFormat.aggregate([{
                    $match: {
                        "_id": teamFormatId
                    }
                }, {
                    $unwind: "$playerFormatArray"
                }, {
                    $project: {
                        format: "$mandatoryPlayersArray"
                    }
                }])
                if (teamDeta && teamDeta[0] && teamDeta[0].format) {
                    var lengthOfArray = teamDeta[0].format.length;
                    var mandatoryPlayersArray = teamDeta[0].format;
                    if (lengthOfArray != 0) {

                        var mandatoryPlayersFromEX = [];
                        var mandatoryPlayerIDFromEx = [];

                        for (var j = 0; j < playersDetails.length; j++) {
                            mandatoryPlayersFromEX[j] = playersDetails[j].playerNumber
                            if (playersDetails[j].playerId && playersDetails[j].playerId != undefined && playersDetails[j].playerId.trim().length != 0) {
                                mandatoryPlayerIDFromEx[j] = playersDetails[j].playerId
                            } else {
                                mandatoryPlayerIDFromEx[j] = "0"
                            }
                        }
                        mandatoryPlayersFromEX = mandatoryPlayersFromEX.sort();
                        mandatoryPlayersArray = mandatoryPlayersArray.sort();
                        for (var k = 0; k < mandatoryPlayersArray.length; k++) {
                            if (_.contains(mandatoryPlayersFromEX, mandatoryPlayersArray[k]) == false) {
                                mandPlayersArrPosition.push(mandatoryPlayersArray[k])
                            } else {
                                if (mandatoryPlayerIDFromEx[k] == "0")
                                    mandPlayersArrPosition.push(mandatoryPlayersArray[k])
                            }
                        }
                    }
                }
            }


            if (mandPlayersArrPosition.length != 0) {
                var messageValidations = "Require All Mandatory Players. Players are required at position " + mandPlayersArrPosition.toString() + " .";
                return messageValidations;
            } else return "0"
        } catch (e) {
            return e
        }
    }
});*/

//mandatory player check
Meteor.methods({
    "validationForMandatoryPlayers_School": function(teamFormatId, playersDetails) {
        try {
            var formatId = teamFormatId;
            mandPlayersArrPosition = [];
            var messageValidations = "0";
            if (playersDetails.length == 0) {
                //var message = {"message":"Require Players Details"+" ."}
            } else {
                var teamDeta = teamsFormat.aggregate([{
                    $match: {
                        "_id": teamFormatId
                    }
                }, {
                    $unwind: "$playerFormatArray"
                }, {
                    $project: {
                        format: "$mandatoryPlayersArray"
                    }
                }])
                if (teamDeta && teamDeta[0] && teamDeta[0].format) {
                    var lengthOfArray = teamDeta[0].format.length;
                    var mandatoryPlayersArray = teamDeta[0].format;
                    if (lengthOfArray != 0) {
                        var mandatoryPlayersFromEX = [];
                        var mandatoryPlayerIDFromEx = [];

                        for (var j = 0; j < playersDetails.length; j++) {
                            if (playersDetails[j].teamEvent != undefined && playersDetails[j].teamEvent == true) {
                                mandatoryPlayersFromEX[j] = playersDetails[j].playerId
                            }
                        }
                        if (parseInt(lengthOfArray) == parseInt(mandatoryPlayersFromEX.length) || parseInt(lengthOfArray) <= parseInt(mandatoryPlayersFromEX.length)) {
                            return "0"
                        } else {
                            var messageValidations = "Require All Mandatory Players.";
                            return messageValidations;
                        }
                    }
                    else{
                        return "0"
                    }
                }
                else{
                    var messageValidations = "Team format is error.";
                    return messageValidations;
                }
            }
        } catch (e) {

            return e
        }
    }
});

//separation team member id accord to individual or team event sub boolean value
Meteor.methods({
    playerRegesterationTeam_School: function(teamFormatId, playersDetails) {
        try {
            var teamMembers = [];
            var teamMemIDs = [];
            var teamDet = [];
            var messageValidations = [];
            var unsubscribePlayerIDS = [];
            var unsubscribePlayerIDSForTeams = [];
            var teamManager = "1";
            for (var p = 0; p < playersDetails.length; p++) {
                var teamDeta = teamsFormat.aggregate([{
                    $match: {
                        "_id": teamFormatId
                    }
                }, {
                    $unwind: "$playerFormatArray"
                }, {
                    $match: {
                        "playerFormatArray.playerNo": "p1" //playersDetails[p].playerNumber
                    }
                }, {
                    $project: {
                        format: "$playerFormatArray"
                    }
                }])
                if (teamDeta && teamDeta[0] && teamDeta[0].format) {
                    //Meteor.call("addSchoolPlayer", playersDetails[p], function(e, res) {
                    //if (res != "0") {
                    if (playersDetails[p].teamEvent == true || playersDetails[p].individualEvent == true) {
                        if (teamManager == "1") {
                            if (playersDetails[p].teamEvent == true) {
                                teamManager = playersDetails[p].playerId
                            }
                        }
                    }
                        var playerNUM = parseInt(p + 1)
                        var data = {
                            playerNumber: "p" + playerNUM,
                            playerId: playersDetails[p].playerId,
                            individualEvent: playersDetails[p].individualEvent,
                            teamEvent: playersDetails[p].teamEvent
                        }

                        teamMembers.push(data);

                        if (playersDetails[p].individualEvent == true) {
                            teamMemIDs.push(playersDetails[p].playerId)
                        }

                        if(playersDetails[p].individualEvent == false){
                            unsubscribePlayerIDS.push(playersDetails[p].playerId)
                        }

                        if(playersDetails[p].teamEvent == false){
                            unsubscribePlayerIDSForTeams.push(playersDetails[p].playerId)
                        }
                    //}
                    //}
                    //})
                }
            }
            if (teamMembers.length != 0) {
                var data = {
                    teamMembers: teamMembers,
                    teamMemIDs: teamMemIDs,
                    unsubscribePlayerIDS:unsubscribePlayerIDS,
                    unsubscribePlayerIDSForTeams:unsubscribePlayerIDSForTeams,
                    teamManager: teamManager
                }
                teamDet.push(data)
                return teamDet
            } else {
                return "0"
            }
        } catch (e) {

            return e
        }
    }
});

//create team
Meteor.methods({
    "createTeamForGivenTeamFormatId": async function(xdata, managerID, schoolID, sourceData, subscriptionForSchool) {
        try {
            var resp = "0"

            if (managerID == "1") {
                if (xdata.teamMembers && xdata.teamMembers[0] && xdata.teamMembers[0].playerId) {
                    managerID = xdata.teamMembers[0].playerId
                }
            }
            try{
                var res = await Meteor.call("saveNewTeamData_ForSchool", xdata, managerID, schoolID, sourceData, subscriptionForSchool);
                if (res != "0") {
                    resp = res
                } 
            }catch(e){
                return e
            }
            if (resp !== "0") {
                return resp
            } else {
                return "0"
            }
        } catch (e) {

            return e
        }
    }
});

//subscribe to indidvidual event
Meteor.methods({
    "subscribeToIndvidiualEvent_School": function(idsTounsub,xdata, individualEventId, teamEventId, tournamentId, schoolID) {
        try {
            var eventName;
            var subscribedEvents = [];
            var totalFee = 0;
            var eventDet = events.findOne({
                '_id': individualEventId,
                "tournamentId": tournamentId
            });
            if (eventDet && eventDet.prize != undefined && eventDet.abbName) {
                eventName = eventDet.abbName;
                var eventFeeSettingsFetch = eventFeeSettings.findOne({
                    tournamentId: tournamentId
                });
                if (eventFeeSettingsFetch && eventFeeSettingsFetch.events && eventFeeSettingsFetch.singleEvents && eventFeeSettingsFetch.singleEventFees) {
                    var indexABBName = eventFeeSettingsFetch.singleEvents.indexOf(eventName);
                    for (var e = 0; e < eventFeeSettingsFetch.singleEvents.length; e++) {
                        subscribedEvents.push(0);
                    }

                    if (indexABBName >= 0) {

                        var feeAbbName = eventFeeSettingsFetch.singleEventFees[indexABBName];
                        subscribedEvents[indexABBName] = parseInt(feeAbbName)
                            //totalFee =  _.sum(subscribedEvents);
                        var total = 0;
                        for (var ie = 0; ie < subscribedEvents.length; ie++) {
                            total = parseInt(total) + parseInt(subscribedEvents[ie]);
                        }

                        var dobDet = dobFilterSubscribe.aggregate([{
                            $match: {
                                "tournamentId": tournamentId
                            }
                        }, {
                            $unwind: "$details"
                        }, {
                            $match: {
                                "details.eventId": eventDet.projectId.toString()
                            }
                        }, {
                            $project: {
                                date: "$details.dateOfBirth",
                                gender: "$details.gender",
                                ranking: "$details.ranking"
                            }
                        }]);

                        events.update({
                            "abbName": eventName,
                            "tournamentId": tournamentId,
                            "tournamentEvent": false
                        }, {
                            $pull: {
                                eventParticipants:{$in:idsTounsub}
                            }
                        });
                        schoolPlayerEntries.remove({tournamentId: tournamentId,schoolId:schoolID,playerId:{$in:idsTounsub}})

                        for (var i = 0; i < xdata.length; i++) {
                            var userDet = schoolPlayers.findOne({
                                "userId": xdata[i]
                            });
                            var academyId = "other";
                            var parentAssociationId = "other";
                            var associationId = "other";
                            var paidOrNot = false;
                            var schoolId = schoolID;

                            if (dobDet[0].date && dobDet[0].gender && dobDet[0].ranking) {


                                if (userDet.academyId != null && userDet.academyId != undefined && userDet.academyId != "other" && userDet.academyId.trim().length != 0) {
                                    academyId = userDet.academyId
                                }
                                if (userDet.parentAssociationId != null && userDet.parentAssociationId != undefined && userDet.parentAssociationId != "other" && userDet.parentAssociationId.trim().length != 0) {
                                    parentAssociationId = userDet.parentAssociationId
                                }
                                if (userDet.associationId != null && userDet.associationId != undefined && userDet.associationId != "other" && userDet.associationId.trim().length != 0) {
                                    associationId = userDet.associationId
                                }

                                var playerEntriesFind = schoolPlayerEntries.findOne({
                                    playerId: xdata[i],
                                    tournamentId: tournamentId
                                });
                                if (dobDet[0].ranking == "no") {

                                    if (playerEntriesFind == undefined) {
                                        schoolPlayerEntries.remove({
                                            playerId: xdata[i]
                                        })

                                        var s1 = schoolPlayerEntries.insert({
                                            playerId: xdata[i],
                                            academyId: academyId,
                                            parentAssociationId: parentAssociationId,
                                            associationId: associationId,
                                            tournamentId: tournamentId,
                                            subscribedEvents: subscribedEvents,
                                            totalFee: total,
                                            schoolId: schoolId,
                                            paidOrNot: false
                                        });
                                        events.update({
                                            "abbName": eventName,
                                            "tournamentId": tournamentId,
                                            "tournamentEvent": false
                                        }, {
                                            $addToSet: {
                                                eventParticipants: xdata[i]
                                            }
                                        });

                                    }

                                }
                                if (userDet && userDet.gender && userDet.dateOfBirth) {

                                    if (dobDet[0].ranking == "yes") {

                                        var filterDate = moment(new Date(dobDet[0].date)).format("YYYY/DD/MMM");
                                        var userDate = moment(new Date(userDet.dateOfBirth)).format("YYYY/DD/MMM");

                                        if (new Date(userDate) >= new Date(filterDate)) {
                                            if (dobDet[0].gender.toUpperCase() == userDet.gender.trim().toUpperCase()) {
                                                schoolPlayerEntries.remove({
                                                    playerId: xdata[i]
                                                })

                                                var s3 = schoolPlayerEntries.insert({
                                                    playerId: xdata[i],
                                                    academyId: academyId,
                                                    parentAssociationId: parentAssociationId,
                                                    associationId: associationId,
                                                    tournamentId: tournamentId,
                                                    subscribedEvents: subscribedEvents,
                                                    totalFee: total,
                                                    schoolId: schoolId,
                                                    paidOrNot: false
                                                });
                                                events.update({
                                                    "abbName": eventName,
                                                    "tournamentId": tournamentId,
                                                    "tournamentEvent": false
                                                }, {
                                                    $addToSet: {
                                                        eventParticipants: xdata[i]
                                                    }
                                                });
                                            } else if (dobDet[0].gender.toUpperCase() == "ALL") {
                                                schoolPlayerEntries.remove({
                                                    playerId: xdata[i]
                                                })
                                                var s4 = schoolPlayerEntries.insert({
                                                    playerId: xdata[i],
                                                    academyId: academyId,
                                                    parentAssociationId: parentAssociationId,
                                                    associationId: associationId,
                                                    tournamentId: tournamentId,
                                                    subscribedEvents: subscribedEvents,
                                                    totalFee: total,
                                                    schoolId: schoolId,
                                                    paidOrNot: false
                                                });
                                                events.update({
                                                    "abbName": eventName,
                                                    "tournamentId": tournamentId,
                                                    "tournamentEvent": false
                                                }, {
                                                    $addToSet: {
                                                        eventParticipants: xdata[i]
                                                    }
                                                });
                                            } else {}
                                        } else {}
                                    }
                                }
                            }
                        }
                    }

                }

            }
            return true
        } catch (e) {

            return e
        }
    }
});

//subscribe to team event
Meteor.methods({
    "suscribeToTeamEvent_School": function(unsubscribePlayerIDSForTeams,managerID, individualEventId, teamEventId, tournamentId, teamID, schoolID) {
        try {
            var eventName;

            var subscribedEvents = [];
            var subscribedTeamId = [teamID];
            var subscribedTeamsArray = [];
            var totalFee = 0;
            var eventDet = events.findOne({
                '_id': teamEventId,
                "tournamentId": tournamentId
            });
            if (eventDet && eventDet.prize != undefined && eventDet.abbName) {
                eventName = eventDet.abbName;
                var eventFeeSettingsFetch = eventFeeSettings.findOne({
                    tournamentId: tournamentId
                });
                if (eventFeeSettingsFetch && eventFeeSettingsFetch.events && eventFeeSettingsFetch.teamEvents && eventFeeSettingsFetch.teamEventFees) {
                    var indexABBName = eventFeeSettingsFetch.teamEvents.indexOf(eventName);

                    for (var e = 0; e < eventFeeSettingsFetch.teamEvents.length; e++) {
                        subscribedEvents.push(0);
                    }
                    if (indexABBName >= 0) {
                        var feeAbbName = eventFeeSettingsFetch.teamEventFees[indexABBName];
                        subscribedEvents[indexABBName] = parseInt(feeAbbName)
                        var total = 0;
                        for (var ie = 0; ie < subscribedEvents.length; ie++) {
                            total = parseInt(total) + parseInt(subscribedEvents[ie]);
                        }
                    }
                    var dataSubArray = {
                        eventName: eventName,
                        teamId: teamID
                    }
                    subscribedTeamsArray.push(dataSubArray)
                    events.update({
                        "abbName": eventName,
                        "tournamentId": tournamentId,
                        "tournamentEvent": false
                    }, {
                        $pull: {
                            eventParticipants:{$in:unsubscribePlayerIDSForTeams}
                        }
                    });
                    schoolPlayerTeamEntries.remove({tournamentId: tournamentId,schoolId:schoolID,playerId:{$in:unsubscribePlayerIDSForTeams}})

                    if (managerID) {
                        var userDet = schoolPlayers.findOne({
                            "userId": managerID
                        });
                        var academyId = "other";
                        var parentAssociationId = "other";
                        var associationId = "other";
                        var paidOrNot = false;
                        var teamEntriesFind = schoolPlayerTeamEntries.findOne({
                            playerId: managerID,
                            tournamentId: tournamentId
                        });
                        if (userDet) {
                            if (teamEntriesFind == undefined) {
                                var r = schoolPlayerTeamEntries.insert({
                                    playerId: managerID,
                                    academyId: academyId,
                                    parentAssociationId: parentAssociationId,
                                    associationId: associationId,
                                    tournamentId: tournamentId,
                                    subscribedEvents: subscribedEvents,
                                    totalFee: total,
                                    subscribedTeamID: subscribedTeamId,
                                    subscribedTeamsArray: subscribedTeamsArray,
                                    paidOrNot: false,
                                    schoolId: schoolID
                                });
                                events.update({
                                    "abbName": eventName,
                                    "tournamentId": tournamentId,
                                    "tournamentEvent": false
                                }, {
                                    $addToSet: {
                                        eventParticipants: managerID
                                    }
                                });
                            }
                        }
                    }
                }
            }
            return true
        } catch (e) {

            return e
        }
    }
});

//create team and subscribe for school
Meteor.methods({
    "createTeams_School": async function(teamFormatId, playersDetails, schoolID, source, individualEventId, teamEventId, tournamentId) {
        try {
            var messageValidations = [];
            var teamsFormatID = teamFormatId;
            var teamIdReturn = "";
            var sourceData = "";
            var subscriptionForSchool = true
            var findtournament = events.findOne({
                "_id": tournamentId
            });
            var findtournamentSingle = events.findOne({
                "tournamentId": tournamentId,
                "_id": individualEventId,
                projectType: 1
            });
            var findtournamentTeam = events.findOne({
                "tournamentId": tournamentId,
                "_id": teamEventId,
                projectType: 2
            });

            if (findtournament && findtournamentSingle && findtournamentTeam && findtournamentTeam.tournamentType) {
                if (moment(moment(findtournament.eventSubscriptionLastDate1).format("YYYY-MM-DD")) >= moment(moment.tz(findtournament.timeZoneName).format("YYYY-MM-DD"))) {

                    if (source) {
                        sourceData = source;
                    }

                    if (schoolID != undefined && schoolID != null && schoolID.trim().length != 0) {
                        var fetchSchoolDet = schoolDetails.findOne({
                            "userId": schoolID
                        });
                        if (fetchSchoolDet && fetchSchoolDet.abbrevation && fetchSchoolDet.schoolName) {
                            //call for each criteria
                            try{
                                //here 2
                                var res1 = await Meteor.call("validationForEachCriteria_School", teamFormatId, playersDetails, schoolID,findtournamentTeam.tournamentType);
                                if (res1) 
                                {
                                    var schoolDetailsData = '';
                                    if (res1 != "0") {
                                        messageValidations = res1;
                                    } else if (res1 == "0") {
                                        var teamNameFormat = ""
                                        var mandatoryPlayersArrayFirst;
                                        var teamDetails = teamsFormat.findOne({
                                            "_id": teamsFormatID
                                        });
                                        if (teamDetails && teamDetails.teamFormatName) 
                                        {
                                            var schoolChangeAbbName = schoolEventsToFind.findOne({})
                                            if(schoolChangeAbbName && schoolChangeAbbName.teamEventNAME 
                                                && schoolChangeAbbName.dispNamesTeam){
                                                var namesInd = _.indexOf(
                                                    schoolChangeAbbName.teamEventNAME,teamDetails.teamFormatName
                                                    )
                                                if(namesInd>=0){
                                                    teamNameFormat = schoolChangeAbbName.dispNamesTeam[namesInd]
                                                }
                                                else{
                                                    teamNameFormat = teamDetails.teamFormatName
                                                }
                                            }
                                            else{
                                                teamNameFormat = teamDetails.teamFormatName
                                            }
                                        }

                                        schoolDetailsData = fetchSchoolDet.abbrevation+"-" + teamNameFormat
                                            //call for mandatory players check
                                        try{
                                            var res2 = await Meteor.call("validationForMandatoryPlayers_School", teamFormatId, playersDetails);
                                            if (res2 != "0") 
                                            {
                                                var message = {
                                                    message: res2
                                                }
                                                messageValidations.push(message.message)
                                            } else if (res2 == '0') 
                                            {
                                                //call for each player registeration
                                                try{
                                                    var res3 = await Meteor.call("playerRegesterationTeam_School", teamFormatId, playersDetails);
                                                    if (res3 != '0' && schoolDetailsData != null && schoolDetailsData != undefined && schoolDetailsData.trim().length != 0) {
                                                        var teamMembers;
                                                        var teamManager;
                                                        var teamName;

                                                        if (res3 && res3[0] && res3[0].teamMembers && res3[0].teamMembers[0] && res3[0].teamMembers[0].playerId && res3[0].teamManager) {
                                                            teamManager = res3[0].teamManager;
                                                            teamName = schoolDetailsData;
                                                            teamMembers = res3[0].teamMembers;
                                                            var onlyMemberIDs = res3[0].teamMemIDs;
                                                            var idsTounsub = res3[0].unsubscribePlayerIDS;
                                                            var unsubscribePlayerIDSForTeams = res3[0].unsubscribePlayerIDSForTeams;
                                                            var Teamdata = {
                                                                teamName: teamName,
                                                                schoolName:fetchSchoolDet.schoolName,
                                                                teamFormatId: teamFormatId,
                                                                teamManager: teamManager,
                                                                teamMembers: teamMembers,
                                                                tournamentId: tournamentId
                                                            }
                                                            var managerID = "";
                                                            if (teamMembers[0].playerId) {
                                                                managerID = teamManager
                                                            }
                                                            try{
                                                                var res4 = await Meteor.call("createTeamForGivenTeamFormatId", Teamdata, managerID, schoolID, sourceData, subscriptionForSchool); 
                                                                if (res4 == "0") {
                                                                    var message = {
                                                                        message: "Cannot create team"
                                                                    }
                                                                    messageValidations.push(message.message)
                                                                } else if (res4 !== "0") {
                                                                    var teamID = res4
                                                                    teamIdReturn = res4
                                                                    if (teamID) {
                                                                        try{
                                                                            var res5 = await Meteor.call("subscribeToIndvidiualEvent_School", idsTounsub,onlyMemberIDs, individualEventId, teamEventId, tournamentId, schoolID);
                                                                            if(res5) 
                                                                            {
                                                                                try{
                                                                                    var res6 = await Meteor.call("suscribeToTeamEvent_School", unsubscribePlayerIDSForTeams,managerID, individualEventId, teamEventId, tournamentId, teamID, schoolID);
                                                                                     if(res6) {
                                                                                        Meteor.call("sendEmailOfSchool", tournamentId, schoolID, function(e, res) {
                                                                                            
                                                                                        });
                                                                                    }
                                                                                }catch(e){
                                                                                    messageValidations.push(e)
                                                                                }
                                                                            }
                                                                        }catch(e)
                                                                        {
                                                                             messageValidations.push(e)
                                                                        }
                                                                    } else {
                                                                        var message = {
                                                                            message: "Team Already exists"
                                                                        }
                                                                        messageValidations.push(message.message)
                                                                    }
                                                                } 
                                                            }catch(e)
                                                            {
                                                               messageValidations.push(e) 
                                                            }
                                                            
                                                        }
                                                    } 
                                                }catch(e)
                                                {
                                                    messageValidations.push(e)
 
                                                }
                                               

                                            } 
                                        }catch(e)
                                        {
                                            messageValidations.push(e)

                                        }
                                        
                                    } 
                                } 
                            }catch(e){
                                messageValidations.push(e)
                            }
                        } else {
                            var message = {
                                message: "schoolId is not registered schoolId"
                            }
                            messageValidations.push(message.message)
                        }
                    } else {
                        var message = {
                            message: "schoolId is not valid"
                        }
                        messageValidations.push(message.message)
                    }
                } else {
                    var message = {
                        message: "Cannot create, Entry closed for given tournament"
                    }
                    messageValidations.push(message.message)
                }

            } else {
                var message = {
                    message: "tournamentId or individualEventId or teamEventId or tournamentType is not valid"
                }
                messageValidations.push(message.message)
            }
            if (messageValidations.length == 0) {
                var resultJson = {};
                resultJson["status"] = "success";
                resultJson["teamId"] = teamIdReturn
                resultJson["response"] = "Team created and subscribed successfully"
                return resultJson;
            } else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = messageValidations.toString()
                return resultJson;
            }
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e
            return resultJson;
        }
    }
});

//create team actual call
Meteor.methods({
    "createTeamForSchoolWithArguement": async function(data, apiKey) {
        try {
            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            var eventNAMES = [];
            var teamEventNAMES = [];
            var schoolEventDet = schoolEventsToFind.findOne({
                "key": "School"
            });
            if (schoolEventDet && schoolEventDet.individualEventNAME && schoolEventDet.teamEventNAME) {
                eventNAMES = schoolEventDet.individualEventNAME;
                teamEventNAMES = schoolEventDet.teamEventNAME;
            }
            if(typeof data == "string"){
                data = data.replace("\\", "");
                data = JSON.parse(data);
            }
            var response;
            var eror;
            if(data.tournamentId){
                if (data.playersDetails != undefined && data.playersDetails.length != 0 && data.schoolId != undefined && data.minNumberOfPlayers != undefined && data.eventName != undefined) {
                    if (data && apiKey) {
                        var apiKeyDet = apiUsers.findOne({
                            "apiKey": apiKey.trim()
                        });
                        var apiSource = "";
                        if (apiKeyDet && apiKeyDet.source) {
                            apiSource = apiKeyDet.source
                        }
                        data.source = apiSource;
                        if (apiKeyDet && apiKeyDet.userId) {
                            var eveOrgID = apiKeyDet.userId;
                            if (Meteor.users.findOne({
                                    userId: eveOrgID
                                })) {
                                if (data.schoolId) {
                                    var schoolDet = schoolDetails.findOne({
                                        userId: data.schoolId,
                                        role: "School"
                                    });
                                    if (schoolDet && schoolDet.state) {
                                        var toureveDet = events.findOne({
                                            "eventOrganizer": eveOrgID,
                                            "tournamentEvent": true,
                                            "_id":data.tournamentId
                                        });

                                        if (toureveDet && toureveDet._id) {
                                            var tournamentId = toureveDet._id;
                                            if (data.eventName) {
                                                if (eventNAMES.indexOf(data.eventName) != -1) {
                                                    var singleEveDet = events.findOne({
                                                        "abbName": data.eventName,
                                                        tournamentId: toureveDet._id
                                                    });


                                                    if (singleEveDet && singleEveDet._id) {
                                                        individualEventId = singleEveDet._id;
                                                        var teamEveDet = events.findOne({
                                                            "abbName": teamEventNAMES[eventNAMES.indexOf(data.eventName)],
                                                            "tournamentId": toureveDet._id
                                                        });
                                                        if (teamEveDet && teamEveDet._id && teamEveDet.projectId && teamEveDet.projectId.length != 0) {
                                                            teamEventId = teamEveDet._id
                                                            teamFormatId = teamEveDet.projectId.toString();
                                                            //actual call to api's 
                                                            if (data && data.minNumberOfPlayers != undefined) {
                                                                if (data.minNumberOfPlayers == true) {
                                                                    try{
                                                                        //here
                                                                        var res = await Meteor.call("createTeams_School", teamFormatId, data.playersDetails, data.schoolId, data.source, individualEventId, teamEventId, tournamentId) ;
                                                                        if (res) {
                                                                            if (res.status == "success"){
                                                                                var kdel = await Meteor.call("deletePlayersFromCategory", data.schoolId, data.eventName, function(e, deletePlayCat) {});
                                                                            }
                                                                            response = res;
                                                                        } else  {           
                                                                            //eror = e.reason;                                                           
                                                                        }
                                                                    }catch(e){
                                                                        if(e && e.reason)
                                                                            eror = e.reason;
                                                                        else if(e)
                                                                            eror = e;
                                                                    }
                                                                } else if (data.minNumberOfPlayers == false) {
                                                                    try{
                                                                        var res = await Meteor.call("createTeams_SchoolTemporary", teamFormatId, data.playersDetails, data.schoolId, data.source, individualEventId, teamEventId, tournamentId); 
                                                                        if (res) {
                                                                            if (res.status == "success"){
                                                                                var kdel = await Meteor.call("deletePlayersFromCategory", data.schoolId, data.eventName, function(e, deletePlayCat) {});
                                                                            }
                                                                            response = res;
                                                                        } else if (e) {
                                                                            //eror = e.reason;
                                                                        }
                                                                    }catch(e){
                                                                        if(e && e.reason)
                                                                            eror = e.reason;
                                                                        else if(e)
                                                                            eror = e;
                                                                    }
                                                                } else {
                                                                    var resultJson = {};
                                                                    resultJson["status"] = "failure";
                                                                    resultJson["response"] = "minNumberOfPlayers is not valid. It should be boolean true or false.";
                                                                    return resultJson;
                                                                }
                                                                if (eror){
                                                                    return eror;
                                                                }
                                                                else if (response){
                                                                    return response
                                                                }
                                                            } else {
                                                                var resultJson = {};
                                                                resultJson["status"] = "failure";
                                                                resultJson["response"] = "minNumberOfPlayers is not valid. It should be boolean true or false.";
                                                                return resultJson;
                                                            }
                                                        }
                                                    } else {
                                                        var kdel = await Meteor.call("deletePlayersFromCategory", data.schoolId, data.eventName, function(e, deletePlayCat) {});
                                                        var resultJson = {};
                                                        resultJson["status"] = "failure";
                                                        resultJson["response"] = "event name is invalid";
                                                        return resultJson;
                                                    }
                                                } else {
                                                    var resultJson = {};
                                                    resultJson["status"] = "failure";
                                                    resultJson["response"] = "event name is invalid";
                                                    return resultJson;
                                                }
                                            } else {
                                                var resultJson = {};
                                                resultJson["status"] = "failure";
                                                resultJson["response"] = "event name is not valid";
                                                return resultJson;
                                            }
                                        } else {
                                            var resultJson = {};
                                            resultJson["status"] = "failure";
                                            resultJson["response"] = "invalid tournament details";
                                            return resultJson;
                                        }
                                    } else {
                                        var resultJson = {};
                                        resultJson["status"] = "failure";
                                        resultJson["response"] = "schoolId or school's state id is not valid";
                                        return resultJson;
                                    }
                                } else {
                                    var resultJson = {};
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "schoolId is not valid";
                                    return resultJson;
                                }
                            } else {
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = "API KEY is not valid";
                                return resultJson;
                            }
                        }
                    } else {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "API KEY is not valid";
                        return resultJson;
                    }
                } else {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "All Parameters are required";
                    return resultJson;
                }
            } else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "tournamentId is required";
                return resultJson;
            }
            /*data = data.replace("\\", "");
            var data = JSON.parse(data);
            var response;
            var eror;
            if (data && data.minNumberOfPlayers != undefined) {
                if (data.minNumberOfPlayers) {
                    Meteor.call("createTeams_School", data.teamFormatId, data.playersDetails, data.schoolId, data.source, data.individualEventId, data.teamEventId, data.tournamentId, function(e, res) {
                        if (res) {
                            response = res;
                        } else if (e) {
                            eror = e;
                        }
                    });
                } else {
                    Meteor.call("createTeams_SchoolTemporary", data.teamFormatId, data.playersDetails, data.schoolId, data.source, data.individualEventId, data.teamEventId, data.tournamentId, function(e, res) {
                        if (res) {
                            response = res;
                        } else if (e) {
                            eror = e;
                        }
                    });
                }
                if (eror)
                    return eror;
                else if (response)
                    return response
            }*/
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e
            return resultJson;
        }
    }
});

//delete players from category db
Meteor.methods({
    "deletePlayersFromCategory": function(schoolId, eventName) {
        try {
            var deleteCheck = playerCategory.remove({
                schoolId: schoolId,
                category: eventName
            });
        } catch (e) {
        }
    }
});

//test
Meteor.methods({
    "createTeams_SchoolTest": async function() {
        var teamFormatId = "A2iS7HnLcuHbE9Doj";
        var playersDetails = [];
        var schoolID = "oj9JXm6wS6zGDBvzy";
        var source = "11Sports";
        var minNumberOfPlayers = true;
        var tournamentId = "XaNNEp6Quy7y93Hpz";
        var individualEventId = "SXWEjDK6HTJMAddoB";
        var teamEventId = "ngQJWxiHMgNZMgz9g"
        var playerNo1 = {
            "playerNumber": "p1",
            "playerId": "98xWfJgbZDcGrAqiA"
        }
        var playerNo2 = {
            "playerNumber": "p2",
            "playerId": "45afjNgLA9SSPGkrx"
        }
        var playerNo3 = {
            "playerNumber": "p5",
            "playerId": ""
        }

        playersDetails.push(playerNo1);
        playersDetails.push(playerNo2);
        playersDetails.push(playerNo3);

        var data = {
            playersDetails: playersDetails,
            schoolID: schoolID,
            source: source,
            minNumberOfPlayers: minNumberOfPlayers,
            tournamentId: tournamentId,
            individualEventId: individualEventId,
            teamEventId: teamEventId,
            teamFormatId: teamFormatId
        }

        if (minNumberOfPlayers) {
            await Meteor.call("createTeams_School", data.teamFormatId, data.playersDetails, data.schoolID, data.source, data.individualEventId, data.teamEventId, data.tournamentId);

        } else {
            await Meteor.call("createTeams_SchoolTemporary", data.teamFormatId, data.playersDetails, data.schoolID, data.source) 
        }
    }
});

//create team school temporary
Meteor.methods({
    createTeams_SchoolTemporary: async function(teamFormatId, playersDetails, schoolID, source, individualEventId, teamEventId, tournamentId) {
        try {
            var messageValidations = [];
            var teamsFormatID = teamFormatId;
            var teamIdReturn = "";
            var sourceData = "";
            var subscriptionForSchool = false
            var findtournament = events.findOne({
                "_id": tournamentId
            });
            var findtournamentSingle = events.findOne({
                "tournamentId": tournamentId,
                "_id": individualEventId,
                projectType: 1
            });
            var findtournamentTeam = events.findOne({
                "tournamentId": tournamentId,
                "_id": teamEventId,
                projectType: 2
            });
            
            if (findtournament && findtournamentSingle) {
                if(true){
                //if (moment(moment(findtournament.eventSubscriptionLastDate1).format("YYYY-MM-DD")) >= moment(moment.tz(findtournament.timeZoneName).format("YYYY-MM-DD"))) {
                    if (source) {
                        sourceData = source;
                    }
                    if (schoolID != undefined && schoolID != null && schoolID.trim().length != 0) {
                        var fetchSchoolDet = schoolDetails.findOne({
                            "userId": schoolID
                        });
                        if (fetchSchoolDet && fetchSchoolDet.abbrevation && fetchSchoolDet.schoolName) {
                            try{
                                var res1 = await Meteor.call("validationForTeamFormatAndPlayersLength", teamFormatId, playersDetails);
                                if (res1) {
                                    var schoolDetailsData = '';
                                    if (res1 != "0") {
                                        messageValidations = res1;
                                    } else {
                                        var teamNameFormat = ""
                                        var mandatoryPlayersArrayFirst;
                                        var teamDetails = teamsFormat.findOne({
                                            "_id": teamsFormatID
                                        });
                                        if (teamDetails && teamDetails.teamFormatName) {
                                            var schoolChangeAbbName = schoolEventsToFind.findOne({})
                                            if(schoolChangeAbbName && schoolChangeAbbName.teamEventNAME 
                                                && schoolChangeAbbName.dispNamesTeam){
                                                var namesInd = _.indexOf(
                                                    schoolChangeAbbName.teamEventNAME,teamDetails.teamFormatName
                                                    )
                                                if(namesInd>=0){
                                                    teamNameFormat = schoolChangeAbbName.dispNamesTeam[namesInd]
                                                }
                                                else{
                                                    teamNameFormat = teamDetails.teamFormatName
                                                }
                                            }
                                            else{
                                                teamNameFormat = teamDetails.teamFormatName
                                            }
                                        }
                                        schoolDetailsData = fetchSchoolDet.abbrevation+"-"+ teamNameFormat

                                        try{
                                            var res2 = await Meteor.call("playerRegesterationTeam_School", teamFormatId, playersDetails) 
                                            if (res2 != '0' && schoolDetailsData != null && schoolDetailsData != undefined && schoolDetailsData.trim().length != 0) {
                                                var teamMembers;
                                                var teamManager;
                                                var teamName;
                                                if (res2 && res2[0] && res2[0].teamMembers && res2[0].teamMembers[0] && res2[0].teamManager) {
                                                    teamManager = res2[0].teamManager;
                                                    teamName = schoolDetailsData;
                                                    teamMembers = res2[0].teamMembers;
                                                    var onlyMemberIDs = res2[0].teamMemIDs;
                                                    var idsTounsub = res2[0].unsubscribePlayerIDS;
                                                    var Teamdata = {
                                                        teamName: teamName,
                                                        schoolName:fetchSchoolDet.schoolName,
                                                        teamFormatId: teamFormatId,
                                                        teamManager: teamManager,
                                                        teamMembers: teamMembers,
                                                        tournamentId:tournamentId
                                                    }
                                                    var managerID = "";
                                                    if (teamMembers[0].playerId) {
                                                        managerID = teamManager
                                                    }
                                                    try{
                                                        var res3 = await Meteor.call("createTeamForGivenTeamFormatId", Teamdata, managerID, schoolID, sourceData, subscriptionForSchool) 
                                                        if (res3 == "0") {
                                                            var message = {
                                                                message: "Cannot create team"
                                                            }
                                                            messageValidations.push(message.message)
                                                        } else if (res3 !== "0") {
                                                            var teamID = res3
                                                            teamIdReturn = res3
                                                            if (teamID) {
                                                                try{
                                                                    var res4 = await Meteor.call("subscribeToIndvidiualEvent_School", idsTounsub,onlyMemberIDs, individualEventId, teamEventId, tournamentId, schoolID) 
                                                                    if(res4) {
                                                                        Meteor.call("sendEmailOfSchool", tournamentId, schoolID, function(e, res) {});
                                                                    }
                                                                }catch(e){
                                                                     messageValidations.push(e)
                                                                }
                                                            } else {
                                                                var message = {
                                                                    message: "Team Already exists"
                                                                }
                                                                messageValidations.push(message.message)
                                                            }
                                                        } 
                                                    }catch(e){
                                                        messageValidations.push(e)
                                                    }
                                                    
                                                }
                                            } 
                                        }catch(e)
                                        {
                                            messageValidations.push(e)
 
                                        }
                                        
                                    }
                                } 
                            }catch(e){
                                messageValidations.push(e)
                            }
                        } else {
                            var message = {
                                message: "schoolId is not registered schoolId"
                            }
                            messageValidations.push(message.message)
                        }
                    } else {
                        var message = {
                            message: "schoolId is not valid"
                        }
                        messageValidations.push(message.message)
                    }
                } else {
                    var message = {
                        message: "Cannot create, Entry closed for given tournament"
                    }
                    messageValidations.push(message.message)
                }
            } else {
                var message = {
                    message: "tournamentId or individualEventId is not valid"
                }
                messageValidations.push(message.message)
            }
            if (messageValidations.length == 0) {
                var resultJson = {};
                resultJson["status"] = "success";
                resultJson["teamId"] = teamIdReturn;
                resultJson["response"] = "Team created but not subcribed to team event"
                return resultJson;
            } else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = messageValidations.toString()
                return resultJson;
            }

        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e
            return resultJson;
        }
    }
});

//actual call to get team details
Meteor.methods({
    "getTeamDetailsForSchool": async function(data, apiKey) {
        try {
            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            var eventNAMES = [];
            var teamEventNAMES = [];
            var schoolEventDet = schoolEventsToFind.findOne({
                "key": "School"
            });
            if (schoolEventDet && schoolEventDet.individualEventNAME && schoolEventDet.teamEventNAME) {
                eventNAMES = schoolEventDet.individualEventNAME;
                teamEventNAMES = schoolEventDet.teamEventNAME;
            }

            if(typeof data == "string"){
                data = data.replace("\\", "");
                data = JSON.parse(data);
            }
            
            var response;
            var eror;
            if(data.tournamentId){
                if (data.schoolId != undefined && data.eventName != undefined) {
                    if (data && apiKey) {
                        var apiKeyDet = apiUsers.findOne({
                            "apiKey": apiKey.trim()
                        });
                        var apiSource = "";
                        if (apiKeyDet && apiKeyDet.source) {
                            apiSource = apiKeyDet.source
                        }
                        data.source = apiSource;
                        if (apiKeyDet && apiKeyDet.userId) {
                            var eveOrgID = apiKeyDet.userId;
                            if (Meteor.users.findOne({
                                    userId: eveOrgID
                                })) {
                                if (data.schoolId) {
                                    var schoolDet = schoolDetails.findOne({
                                        userId: data.schoolId,
                                        role: "School"
                                    });
                                    if (schoolDet && schoolDet.state) {
                                        var toureveDet = events.findOne({
                                            "eventOrganizer": eveOrgID,
                                            //"domainId": schoolDet.state,
                                            "tournamentEvent": true,
                                            "_id":data.tournamentId
                                        });
                                        if(toureveDet==undefined){
                                            toureveDet = pastEvents.findOne({
                                                "eventOrganizer": eveOrgID,
                                                //"domainId": schoolDet.state,
                                                "tournamentEvent": true,
                                                "_id":data.tournamentId
                                            })
                                        }
                                        if (toureveDet && toureveDet._id) {
                                            var tournamentId = toureveDet._id;
                                            if (data.eventName) {
                                                if (eventNAMES.indexOf(data.eventName) != -1) {
                                                    var singleEveDet = events.findOne({
                                                        "abbName": data.eventName,
                                                        tournamentId: toureveDet._id
                                                    });
                                                    if(singleEveDet==undefined){
                                                        singleEveDet = pastEvents.findOne({
                                                            "abbName": data.eventName,
                                                            tournamentId: toureveDet._id
                                                        });
                                                    }
                                                    if (singleEveDet && singleEveDet._id) {
                                                        individualEventId = singleEveDet._id;
                                                        var teamEveDet = events.findOne({
                                                            "abbName": teamEventNAMES[eventNAMES.indexOf(data.eventName)],
                                                            "tournamentId": toureveDet._id
                                                        });
                                                        if(teamEveDet==undefined){
                                                            teamEveDet = pastEvents.findOne({
                                                                "abbName": teamEventNAMES[eventNAMES.indexOf(data.eventName)],
                                                                "tournamentId": toureveDet._id
                                                            });
                                                        }
                                                        if (teamEveDet && teamEveDet._id && teamEveDet.projectId && teamEveDet.projectId.length != 0) {
                                                            teamEventId = teamEveDet._id
                                                            teamFormatId = teamEveDet.projectId.toString();
                                                            data.teamsFormatID = teamFormatId;
                                                            data.eventNameResidual = data.eventName
                                                            data.eventNameSing = data.eventName
                                                            data.eventNameTeam = teamEventNAMES[eventNAMES.indexOf(data.eventName)]

                                                            data.tournamentType = teamEveDet.tournamentType
                                                            data.state = schoolDet.state
                                                            data.eventOrganizer = eveOrgID
                                                            
                                                                //actual call to api's 
                                                            if (data) {
                                                                try{
                                                                    var res = await Meteor.call("getTeamDetailsForSchool_teams", data);
                                                                    if (res) {
                                                                        response = res
                                                                    }
                                                                }catch(e){

                                                                }
                                                                

                                                                if (eror)
                                                                    return eror;

                                                                else if (response)
                                                                    return response;
                                                            }
                                                        } 
                                                        else {
                                                            var resultJson = {};
                                                            resultJson["status"] = "failure";
                                                            resultJson["response"] = "Tournament yet to be announced";
                                                            resultJson["tournamentAnnounced"] = false;
                                                            return resultJson;
                                                        }
                                                    } else {}
                                                } else {
                                                    var resultJson = {};
                                                    resultJson["status"] = "failure";
                                                    resultJson["response"] = "event name is invalid";
                                                    return resultJson;
                                                }
                                            } else {
                                                var resultJson = {};
                                                resultJson["status"] = "failure";
                                                resultJson["response"] = "event name is not valid";
                                                return resultJson;
                                            }
                                        } else {
                                            var resultJson = {};
                                            resultJson["status"] = "failure";
                                            resultJson["response"] = "Tournament yet to be announced";
                                            resultJson["tournamentAnnounced"] = false;
                                            return resultJson;
                                        }
                                    } else {
                                        var resultJson = {};
                                        resultJson["status"] = "failure";
                                        resultJson["response"] = "schoolId or school's state id is not valid";
                                        return resultJson;
                                    }
                                } else {
                                    var resultJson = {};
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "schoolId is not valid";
                                    return resultJson;
                                }
                            } else {
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = "API KEY is not valid";
                                return resultJson;
                            }
                        }
                    } else {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "API KEY is not valid";
                        return resultJson;
                    }
                } else {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "All Parameters are required";
                    return resultJson;
                }
            }else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "tournamentId is required";
                return resultJson;
            }
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }
});

//get team details
Meteor.methods({
    "getTeamDetailsForSchool_teams": async function(datas) {
        try {
            var response;
            var eror;
            var messageValidations = [];
            var responseToSend = [];

            if(typeof datas == "string"){
                datas = datas.replace("\\", "");
                datas = JSON.parse(datas);
            }

            if(datas && datas.tournamentType){
                var scDet = schoolEventsToFind.aggregate([{"$unwind":"$tournamentTypes"},{$match:{"tournamentTypes.name":datas.tournamentType}}])
                if(scDet && scDet.length && scDet[0]  
                    && scDet[0].tournamentTypes && scDet[0].tournamentTypes.year){
                    var year = scDet[0].tournamentTypes.year;
                    if (datas.schoolId && datas.teamsFormatID && datas.tournamentId && year) {
                        var schoolId = datas.schoolId;
                        var teamsFormatId = datas.teamsFormatID;
                        var findSchoolDet = schoolDetails.findOne({
                            userId: schoolId
                        });
                        if (findSchoolDet) {
                            var teamFormatDet = teamsFormat.findOne({
                                "_id": teamsFormatId
                            });
                            if (teamFormatDet) {
                                var schoolTeam = schoolTeams.findOne({
                                    "schoolId": schoolId,
                                    teamFormatId: teamsFormatId,
                                    tournamentId:datas.tournamentId
                                });
                                var residualPlayers = playerCategory.findOne({
                                    "schoolId": schoolId,
                                    category: datas.eventNameResidual,
                                    "year":year
                                })


                                if (schoolTeam) {
                                    if (!schoolTeam.schoolId) {
                                        schoolTeam.schoolId = " "
                                    }
                                    if (!schoolTeam.teamFormatId) {
                                        schoolTeam.teamFormatId = " "
                                    }
                                    if (!schoolTeam.teamName) {
                                        schoolTeam.teamName = " "
                                    }
                                    if (schoolTeam && schoolTeam.teamMembers) {
                                        var teamMembersSchool = schoolTeam.teamMembers;
                                        for (var tm = 0; tm < teamMembersSchool.length; tm++) {
                                            var mem = teamMembersSchool[tm];
                                            if (mem && mem.playerId && mem.playerNumber) {
                                                var playerDet = schoolPlayers.findOne({
                                                    "userId": mem.playerId,
                                                });
                                                var playerName = "";
                                                var playerDateOfBirth = "";
                                                var playerClass = "";
                                                var playerNumber = mem.playerNumber;
                                                var playerId = mem.playerId;
                                                var indidvidualEvent = "";
                                                var teamEvent = "";

                                                if (playerDet && playerDet.userName) {
                                                    playerName = playerDet.userName;
                                                }
                                                if (playerDet && playerDet.dateOfBirth) {
                                                    if (new Date(playerDet.dateOfBirth)) {
                                                        playerDateOfBirth = playerDet.dateOfBirth
                                                    }
                                                }

                                                if (mem && mem.individualEvent !== undefined) {
                                                    indidvidualEvent = mem.individualEvent
                                                }

                                                if (mem && mem.teamEvent !== undefined) {
                                                    teamEvent = mem.teamEvent
                                                }

                                                if (playerDet && playerDet.class) {
                                                    playerClass = playerDet.class
                                                }
                                                var data = {
                                                    //playerNumber: playerNumber,
                                                    playerId: playerId,
                                                    playerName: playerName,
                                                    playerDateOfBirth: playerDateOfBirth,
                                                    playerClass: playerClass,
                                                    teamEvent: teamEvent,
                                                    indidvidualEvent: indidvidualEvent
                                                }
                                                
                                                if(playerDet.year==datas.year.toString())
                                                    responseToSend.push(data);
                                            }
                                        }
                                        if (residualPlayers && residualPlayers.userId) {
                                            var residualPlayersSchool = residualPlayers.userId;
                                            //for (var tm = 0; tm < residualPlayersSchool.length; tm++) {
                                            var mem = residualPlayersSchool;
                                            if (mem) {
                                                var playerDet = schoolPlayers.aggregate([{
                                                    $match: {
                                                        userId: {
                                                            $in: residualPlayersSchool,
                                                        },
                                                        "year":year
                                                    }
                                                }, {
                                                    $project: {
                                                        _id: 0,
                                                        playerName: "$userName",
                                                        playerDateOfBirth: "$dateOfBirth",
                                                        playerClass: "$class",
                                                        playerId: "$userId",
                                                        individualEvent: {
                                                            $literal: false
                                                        },
                                                        teamEvent: {
                                                            $literal: false
                                                        }
                                                    }
                                                }])
                                                
                                                if (playerDet && playerDet) {
                                                    responseToSend = responseToSend.concat(playerDet);
                                                }
                                            }
                                            //}
                                            var allData = {
                                                teamId: "",
                                                teamName: "",
                                                teamFormatId: teamsFormatId,
                                                schoolId: schoolId,
                                                teamDetails: responseToSend
                                            }
                                        }
                                        var allData = {
                                            teamId: schoolTeam._id,
                                            teamName: schoolTeam.teamName,
                                            teamFormatId: schoolTeam.teamFormatId,
                                            schoolId: schoolTeam.schoolId,
                                            teamDetails: responseToSend
                                        }
                                    }
                                } else if (residualPlayers) {
                                    if (residualPlayers && residualPlayers.userId) {
                                        var residualPlayersSchool = residualPlayers.userId;
                                        //for (var tm = 0; tm < residualPlayersSchool.length; tm++) {
                                        var mem = residualPlayersSchool;
                                        if (mem) {
                                            var playerDet = schoolPlayers.aggregate([{
                                                $match: {
                                                    userId: {
                                                        $in: residualPlayersSchool
                                                    },
                                                    "year":year
                                                }
                                            }, {
                                                $project: {
                                                    _id: 0,
                                                    playerName: "$userName",
                                                    playerDateOfBirth: "$dateOfBirth",
                                                    playerClass: "$class",
                                                    playerId: "$userId",
                                                    individualEvent: {
                                                        $literal: false
                                                    },
                                                    teamEvent: {
                                                        $literal: false
                                                    }
                                                }
                                            }])
                                            
                                            if (playerDet && playerDet) {
                                                responseToSend = responseToSend.concat(playerDet);
                                            }
                                            /*var playerDet = schoolPlayers.findOne({
                                                "userId": mem
                                            });
                                            var playerName = "";
                                            var playerDateOfBirth = "";
                                            var playerClass = "";
                                            //var playerNumber = mem.playerNumber;
                                            var playerId = mem.playerId;
                                            var indidvidualEvent = false;
                                            var teamEvent = false;

                                            if (playerDet && playerDet.userName) {
                                                playerName = playerDet.userName;
                                            }
                                            if (playerDet && playerDet.dateOfBirth) {
                                                if (new Date(playerDet.dateOfBirth)) {
                                                    playerDateOfBirth = moment(new Date(playerDet.dateOfBirth)).format("YYYY MMM DD")
                                                }
                                            }

                                            if (mem && mem.individualEvent !== undefined) {
                                                indidvidualEvent = mem.individualEvent
                                            }

                                            if (mem && mem.teamEvent !== undefined) {
                                                teamEvent = mem.teamEvent
                                            }

                                            if (playerDet && playerDet.userId) {
                                                var classDEt = schoolDetails.aggregate([{
                                                    $match: {
                                                        userId: data.schoolId
                                                    }
                                                }, {
                                                    $unwind: "$playerId"
                                                }, {
                                                    $match: {
                                                        "playerId.studentID": playerId
                                                    }
                                                }, {
                                                    $project: {
                                                        "class": "$playerId.class"
                                                    }
                                                }])
                                                if (classDEt && classDEt[0] && classDEt[0].class) {
                                                    playerClass = classDEt[0].class
                                                }
                                            }
                                            var data = {
                                                //playerNumber: "",
                                                playerId: playerId,
                                                playerName: playerName,
                                                playerDateOfBirth: playerDateOfBirth,
                                                playerClass: playerClass,
                                                teamEvent: teamEvent,
                                                indidvidualEvent: indidvidualEvent
                                            }*/

                                            //responseToSend.push(data);
                                        }
                                        //}
                                        var allData = {
                                            teamId: "",
                                            teamName: "",
                                            teamFormatId: teamsFormatId,
                                            schoolId: schoolId,
                                            teamDetails: responseToSend
                                        }
                                    }
                                } else {
                                    //call for final winners for national teams
                                    /*var finXData = {
                                        tournamentType:datas.tournamentType,
                                        eventNameSing:datas.eventNameSing,
                                        eventNameTeam:data.eventNameTeam,
                                        year:year,
                                        stateId:datas.state,
                                        teamFormatId:datas.teamsFormatID,
                                        eventOrganizer:datas.eventOrganizer
                                    }
                                    var callFinXData = await Meteor.call("getWinnersListFromFinals",finXData)
                                    if(callFinXData){
                                        return callFinXData
                                    }
                                    else{*/
                                        var message = "Team doesn't exists."
                                        messageValidations.push(message)
                                    //}
                                }
                            } else {
                                var message = "teamsFormatID is not valid."
                                messageValidations.push(message)
                            }
                        } else {
                            var message = "schoolId is not valid.";
                            messageValidations.push(message)
                        }
                    } else {
                        var message = "schoolId or teamsFormatID is not valid.";
                        messageValidations.push(message)
                    }
                } else{
                    var message = "tournament year is not valid";
                    messageValidations.push(message)
                }
            }else{
                var message = "tournamentType is not valid.";
                messageValidations.push(message)
            }

            if (messageValidations.length == 0) {
                var resultJson = {};
                resultJson["status"] = "success";
                resultJson["response"] = "Team details"
                if (allData == undefined || allData.length == 0) {
                    allData = {}
                }
                resultJson["data"] = allData;
                return resultJson;
            } else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = messageValidations.toString();
                resultJson["data"] = "";
                return resultJson;
            }
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson
        }
    }
});

//get tournament details for given state
Meteor.methods({
    "getTournamentDetailsForState": function(data, apiKey) {
        try {

            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            var eventNAMES = [];
            var teamEventNAMES = [];

            data = data.replace("\\", "");
            var data = JSON.parse(data);
            var response;
            var eror;


            if (data && apiKey) {
                var apiKeyDet = apiUsers.findOne({
                    "apiKey": apiKey.trim()
                });
                var apiSource = "";
                if (apiKeyDet && apiKeyDet.source) {
                    apiSource = apiKeyDet.source
                }
                data.source = apiSource;
                if (apiKeyDet && apiKeyDet.userId) {
                    var eveOrgID = apiKeyDet.userId;
                    if (Meteor.users.findOne({
                            userId: eveOrgID
                        })) {
                        if (data.stateId) {
                            var domainDet = domains.findOne({
                                "_id": data.stateId
                            });
                            if (domainDet && domainDet.domainName) {
                                var toureveDet = events.findOne({
                                    "eventOrganizer": eveOrgID,
                                    "domainId": data.stateId,
                                    "tournamentEvent": true
                                });
                                if (toureveDet && toureveDet._id) {
                                    var tournamentId = toureveDet._id;
                                    var eventName = "";
                                    var domainName = "";
                                    var venueAddress = "";
                                    var venue = "";
                                    var eventStartDate = "";
                                    var eventEndDate = "";
                                    var eventSubscriptionLastDate = "";
                                    if (toureveDet.eventName) {
                                        eventName = toureveDet.eventName
                                    }
                                    if (toureveDet.eventStartDate) {
                                        eventStartDate = toureveDet.eventStartDate
                                    }
                                    if (toureveDet.eventEndDate) {
                                        eventEndDate = toureveDet.eventEndDate
                                    }
                                    if (toureveDet.eventSubscriptionLastDate) {
                                        eventSubscriptionLastDate = toureveDet.eventSubscriptionLastDate
                                    }
                                    if (toureveDet.domainName) {
                                        domainName = toureveDet.domainName
                                    }
                                    if (toureveDet.venueAddress) {
                                        venueAddress = " " + toureveDet.venueAddress
                                    }
                                    venue = venueAddress;

                                    var dataToSend = {
                                        tournamentName: eventName,
                                        eventStartDate: eventStartDate,
                                        eventEndDate: eventEndDate,
                                        eventSubscriptionLastDate: eventSubscriptionLastDate,
                                        domainName: domainName,
                                        venue: venue
                                    }
                                    var resultJson = {};
                                    resultJson["status"] = "success";
                                    resultJson["response"] = "tournament details";
                                    resultJson["data"] = dataToSend;
                                    return resultJson;
                                } else {
                                    var resultJson = {};
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "No tournament";
                                    return resultJson;
                                }
                            } else {
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = "stateId is not valid stateId of iPlayon";
                                return resultJson;
                            }
                        } else {
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "stateId is not valid";
                            return resultJson;
                        }
                    } else {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "API KEY is not valid";
                        return resultJson;
                    }
                }
            } else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "API KEY is not valid";
                return resultJson;
            }
        } catch (e) {

            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }
});

