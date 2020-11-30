Meteor.methods({
    "updateTeams_SchoolTest": function() {
        var teamFormatId = "A2iS7HnLcuHbE9Doj";
        var playersDetails = [];
        var schoolID = "oj9JXm6wS6zGDBvzy";
        var source = "11Sports";
        var minNumberOfPlayers = false;
        var teamId = "rkWK5B3TR7fxPvJZt";
        var individualEventId = "SXWEjDK6HTJMAddoB";
        var teamEventId = "ngQJWxiHMgNZMgz9g";
        var tournamentId = "XaNNEp6Quy7y93Hpz";

        var playerNo1 = {
            "playerNumber": "p1",
            "playerId": "98xWfJgbZDcGrAqiA"
        }
        var playerNo2 = {
            "playerNumber": "p2",
            "playerId": "45afjNgLA9SSPGkrx"
        }
        var playerNo3 = {
            "playerNumber": "p3",
            "playerId": "89B4pWPhvsG9L97Fo"
        }

        //playersDetails.push(playerNo1);
        //playersDetails.push(playerNo2);
        playersDetails.push(playerNo3);

        var data = {
            playersDetails: playersDetails,
            schoolID: schoolID,
            source: source,
            minNumberOfPlayers: minNumberOfPlayers,
            tournamentId: tournamentId,
            individualEventId: individualEventId,
            teamEventId: teamEventId,
            teamFormatId: teamFormatId,
            teamId: teamId
        }

        if (minNumberOfPlayers) {
            Meteor.call("updateTeams_School", data.teamFormatId, data.playersDetails, data.schoolID, data.source, data.individualEventId, data.teamEventId, data.tournamentId, data.teamId, function(e, res) {

            });
        } else {
            Meteor.call("updateTeams_SchoolTemporary", data.teamFormatId, data.playersDetails, data.schoolID, data.source, data.teamId, tournamentId, function(e, res) {

            });
        }
    }
});

//actual call to delete player
Meteor.methods({
    "deletePlayerFromTeam": async function(data,apiKey) {
        try {

            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            var eventNAMES = [];
            var teamEventNAMES = [];
            var schoolEventDet = schoolEventsToFind.findOne({"key":"School"});
            if(schoolEventDet&&schoolEventDet.individualEventNAME&&schoolEventDet.teamEventNAME){
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
                if(data.eventName!=undefined&&data.playerId!=undefined&&data.schoolId!=undefined&&data.eventName!=undefined){
                    if(data&&apiKey){
                        var apiKeyDet = apiUsers.findOne({"apiKey":apiKey.trim()});
                        var apiSource = "";
                        if(apiKeyDet&&apiKeyDet.source){
                            apiSource = apiKeyDet.source
                        }
                        data.source = apiSource;
                        if(apiKeyDet&&apiKeyDet.userId){
                            var eveOrgID = apiKeyDet.userId;
                            if(Meteor.users.findOne({userId:eveOrgID})){
                                if(data.schoolId){
                                    var schoolDet = schoolDetails.findOne({userId:data.schoolId, role:"School"});
                                    if(schoolDet&&schoolDet.state){
                                        var toureveDet = events.findOne({"eventOrganizer":eveOrgID,"tournamentEvent":true,"_id":data.tournamentId});
                                        if(toureveDet&&toureveDet._id){
                                            var tournamentId = toureveDet._id;
                                            if(data.eventName){
                                                if(eventNAMES.indexOf(data.eventName)!=-1){
                                                    var singleEveDet = events.findOne({"abbName":data.eventName,tournamentId:toureveDet._id});
                                                    if(singleEveDet&&singleEveDet._id){
                                                        individualEventId = singleEveDet._id;
                                                        var teamEveDet = events.findOne({"abbName":teamEventNAMES[eventNAMES.indexOf(data.eventName)],"tournamentId":toureveDet._id});
                                                        if(teamEveDet&&teamEveDet._id&&teamEveDet.projectId&&teamEveDet.projectId.length!=0){
                                                            teamEventId = teamEveDet._id
                                                            teamFormatId = teamEveDet.projectId.toString();
                                                            data.eventNameResidual = data.eventName
                                                            if (data) {
                                                                var getPlayerNumber = schoolTeams.aggregate([{$match:{"teamFormatId" : teamFormatId,"schoolId":data.schoolId,"tournamentId":tournamentId}},{$unwind:"$teamMembers"},{$match:{"teamMembers.playerId":data.playerId}},{$project:{playerNumber:"$teamMembers.playerNumber",teamId:"$_id"}}]);
                                                                if(getPlayerNumber&&getPlayerNumber[0]&&getPlayerNumber[0].playerNumber){
                                                                    data.playerNumber = getPlayerNumber[0].playerNumber
                                                                    if(getPlayerNumber[0].teamId){
                                                                        data.teamId = getPlayerNumber[0].teamId
                                                                    }   
                                                                    var res = await Meteor.call("deletePlayerFromTeam_School", data.teamId, data.playerId, data.playerNumber, individualEventId, teamEventId, tournamentId, data.schoolId, data.eventNameResidual)
                                                                    try {
                                                                        if (res) {
                                                                            response = res
                                                                        }
                                                                    }catch(e){
                                                                    }
                                                                }                                                        
                                                                else{
                                                                    var checkForResidualPlayer = playerCategory.find({ "schoolId" : data.schoolId,userId: data.playerId}) ;                                                          
                                                                    if(checkForResidualPlayer){
                                                                        var res = await Meteor.call("deletePlayerFromTeam_School", data.teamId, data.playerId, data.playerNumber, individualEventId, teamEventId, tournamentId, data.schoolId, data.eventNameResidual)
                                                                        try {
                                                                            if (res) {
                                                                                response = res
                                                                            }
                                                                        }catch(e){
                                                                        }
                                                                    }
                                                                    else{
                                                                        var resultJson = {};
                                                                        resultJson["status"] = "failure";
                                                                        resultJson["response"] = "playerId is not valid";
                                                                        return resultJson;
                                                                    }
                                                                }
                                                                if (eror){
                                                                    return eror;
                                                                }
                                                                else if (response){
                                                                    return response;
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        var resultJson = {};
                                                        resultJson["status"] = "failure";
                                                        resultJson["response"] = "Could not delete ,tournament is completed";
                                                        return resultJson;
                                                    }
                                                } else{
                                                    var resultJson = {};
                                                    resultJson["status"] = "failure";
                                                    resultJson["response"] = "event name is invalid";
                                                    return resultJson;
                                                }
                                            }else{
                                                var resultJson = {};
                                                resultJson["status"] = "failure";
                                                resultJson["response"] = "event name is not valid";
                                                return resultJson;
                                            }
                                        } else{
                                        }
                                    } else{
                                        var resultJson = {};
                                        resultJson["status"] = "failure";
                                        resultJson["response"] = "schoolId or school's state id is not valid";
                                        return resultJson;
                                    }
                                } else{
                                    var resultJson = {};
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "schoolId is not valid";
                                    return resultJson;
                                }
                            } else{
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = "API KEY is not valid";
                                return resultJson;
                            }
                        }
                    }else{
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "API KEY is not valid";
                        return resultJson;
                    }
                }else{
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "All Parameters are required";
                    return resultJson;
                }
            }else{
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

//test
Meteor.methods({
    "deletePlayerFromTeam_SchoolTest": function() {
        var data = {
            teamId: "rkWK5B3TR7fxPvJZt",
            playerNumber: "p1",
            playerId: "98xWfJgbZDcGrAqiA",
            individualEventId: "SXWEjDK6HTJMAddoB",
            teamEventId: "ngQJWxiHMgNZMgz9g",
            tournamentId: "XaNNEp6Quy7y93Hpz",
            schoolID: "oj9JXm6wS6zGDBvzy"
        }
        Meteor.call("deletePlayerFromTeam_School", data.teamId, data.playerId, data.playerNumber, data.individualEventId, data.teamEventId, data.tournamentId, data.schoolID, function(e, res) {

        });
    }
});

//delete player func
Meteor.methods({
    "deletePlayerFromTeam_School": async function(teamId, playerId, playerNumber, individualEventId, teamEventId, tournamentId, schoolID,eventNameResidual) {
        try {
            var messageValidations = [];
            var findTeamDetails = schoolTeams.findOne({
                "_id": teamId
            });
            
            if(teamId==undefined||teamId.trim().length==0){
                findTeamDetails = []
            }

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

           
            var schoolDetailsFind = schoolDetails.findOne({
                "userId": schoolID
            });
            var playerDETFind = schoolPlayers.findOne({
                "userId": playerId,
                "schoolId": schoolID
            });

            if (playerDETFind) {
                if (schoolDetailsFind) {
                    var schoolIdToup = schoolID
                    if (findtournament && findtournamentSingle && findtournamentTeam) {
                        //if (moment(moment(findtournament.eventSubscriptionLastDate1).format("YYYY-MM-DD")) >= moment(moment.tz(findtournament.timeZoneName).format("YYYY-MM-DD"))) {
                        if (findTeamDetails) {
                            var fetchUserDetails = schoolPlayers.findOne({
                                "userId": playerId
                            });
                            if (fetchUserDetails) {
                                var fetchTeamMember = schoolTeams.aggregate([{
                                    $match: {
                                        "_id": teamId
                                    }
                                }, {
                                    $unwind: "$teamMembers"
                                }, {
                                    $match: {
                                        "teamMembers.playerId": playerId,
                                        //"teamMembers.playerNumber": playerNumber
                                    }
                                }, {
                                    $project: {
                                        "plaID": "$teamMembers.playerId"
                                    }
                                }])
                                if (fetchTeamMember && fetchTeamMember.length !== 0) {
                                    /*var fetchTeamMemberButPosition = schoolTeams.aggregate([{
                                        $match: {
                                            "_id": teamId
                                        }
                                    }, {
                                        $unwind: "$teamMembers"
                                    }, {
                                        $match: {
                                            "teamMembers.playerId": playerId,
                                            "teamMembers.playerNumber": playerNumber
                                        }
                                    }, {
                                        $project: {
                                            "plaID": "$teamMembers.playerId"
                                        }
                                    }]);
                                    if (fetchTeamMemberButPosition && fetchTeamMemberButPosition.length !== 0) {*/
                                    var upres = await Meteor.call("updateTeamManagerAndMemberAfterPlayerDelete", teamId, playerId, playerNumber,tournamentId, teamEventId)

                                    try {
                                        if(upres) {
                                            var unsres = await Meteor.call("unsubscribeFromSingleEventAfterPlayerDelete", teamId, playerId, tournamentId, individualEventId)
                                            try {
                                                if(unsres) {

                                                    if (findTeamDetails.teamManager && findTeamDetails.teamManager.trim().length != 0) {
                                                        var unres2 = await Meteor.call("unsubscribeFromTeamEventAfterPlayerDelete", teamId, playerId, tournamentId, teamEventId, findTeamDetails.teamManager)
                                                        try {

                                                            if (unres2) {

                                                                var data = {
                                                                    playerID: playerId,
                                                                    schoolID: schoolIdToup,
                                                                    category: eventNameResidual
                                                                }
                                                                var res = await Meteor.call("deleteSchoolPlayer", data)
                                                                try {

                                                                    if (res != "0") {

                                                                        var message = {
                                                                            message: res
                                                                        }
                                                                        messageValidations.push(message.message)
                                                                    }
                                                                }catch(e){
                                                             }
                                                            }
                                                        }catch(e){
                                                     }
                                                    }
                                                }
                                            }catch(e){


                                            }
                                        }
                                    }catch(e){

                                    }
                                    /*} else {
                                        var message = {
                                            message: "playerId or playerNumber is not valid"
                                        }
                                        messageValidations.push(message.message)
                                    }*/
                                } else if (Meteor.users.findOne({
                                        "userId": playerId
                                    })) {
                                    var data = {
                                        playerID: playerId,
                                        schoolID: schoolIdToup,
                                        category: eventNameResidual
                                    }
                                    var res = await Meteor.call("deleteSchoolPlayer", data)
                                    try {
                                        if (res != "0") {
                                            var message = {
                                                message: res
                                            }
                                            messageValidations.push(message.message)
                                        }
                                    }catch(e){

                                    }
                                } else {
                                    var message = {
                                        message: "playerId is not valid"
                                    }
                                    messageValidations.push(message.message)
                                }
                            } else {
                                var message = {
                                    message: "playerId is not valid"
                                }
                                messageValidations.push(message.message)
                            }
                        } else {
                            var message = {
                                message: "teamId is not valid"
                            }
                            messageValidations.push(message.message)
                        }
                        /*} else {
                            var message = {
                                message: "Cannot delete, Entry closed for given tournament"
                            }
                            messageValidations.push(message.message)
                        }*/
                    } else {
                        var message = {
                            message: "tournamentId or individualEventId or teamEventId is not valid"
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
                    message: "playerId is not valid or playerId is not added to given schoolId"
                }
                messageValidations.push(message.message)
            }
            if (messageValidations.length == 0) {
                var resultJson = {};
                resultJson["status"] = "success";
                resultJson["response"] = "Player has been Deleted"
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
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }
});

//update team manager on player delete
Meteor.methods({
    "updateTeamManagerAndMemberAfterPlayerDelete": function(teamId, playerId, playerNumber,tournamentId, teamEventId) {
        try {
            var findTeamDetails = schoolTeams.findOne({
                "_id": teamId
            });
            var teamMemToUnSub = {
                "playerNumber": playerNumber,
                "playerId": playerId
            }
            var resp = false;
            if (findTeamDetails && findTeamDetails.teamMembers && findTeamDetails.teamMembers.length != 0) {
                var s = schoolTeams.update({
                    "_id": teamId
                }, {
                    $pull: {
                        "teamMembers": teamMemToUnSub
                    }
                });
                var findTeamDetails2 = schoolTeams.findOne({
                    "_id": teamId
                });

                var findTeamDetails2 = schoolTeams.aggregate([{
                    $match: {
                        "_id": teamId
                    }
                }, {
                    "$unwind": "$teamMembers"
                }, {
                    $match: {
                        "teamMembers.teamEvent": true
                    }
                }])
                if (s && findTeamDetails2 && findTeamDetails2.length && findTeamDetails2[0].teamManager == playerId) {
                    if (findTeamDetails2[0].teamMembers && findTeamDetails2[0].teamMembers&& findTeamDetails2[0].teamMembers["playerId"]) {
                        var managerIdToUpdate = findTeamDetails2[0].teamMembers["playerId"];

                        var r = schoolTeams.update({
                            "_id": teamId
                        }, {
                            $set: {
                                "teamManager": managerIdToUpdate
                            }
                        });

                        if (r && findTeamDetails2[0].teamMembers["teamEvent"]) {
                            var seve = events.update({
                                "_id":teamEventId
                            },{
                                $addToSet:{
                                    eventParticipants:managerIdToUpdate
                                }
                            })
                            
                            var p = schoolPlayerTeamEntries.findOne({
                                "playerId": playerId,
                                tournamentId: tournamentId
                            })

                            if(p){
                                var p1 = schoolPlayerTeamEntries.update({
                                    "playerId": playerId,
                                    tournamentId: tournamentId
                                },{
                                    $set:{
                                        playerId:managerIdToUpdate
                                    }
                                })
                            }
                            return r
                        }
                    } else {
                        var r = schoolTeams.update({
                            "_id": teamId
                        }, {
                            $set: {
                                "teamManager": "1"
                            }
                        });
                        return r
                    }
                }
                return true
            }
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }
});

//unsubscribe from individual event
Meteor.methods({
    "unsubscribeFromSingleEventAfterPlayerDelete": function(teamId, playerId, tournamentId, individualEventId) {
        try {

            var eventDet = events.findOne({
                "_id": individualEventId,
                tournamentId: tournamentId
            });

            var teamDet = schoolTeams.aggregate([{
                $match: {
                    "_id": teamId
                }
            }, {
                $unwind: "$teamMembers"
            }, {
                $project: {
                    teamMembers: "$teamMembers.playerId"
                }
            }, {
                $group: {
                    "_id": null,
                    "teamMembers": {
                        $push: "$teamMembers"
                    }
                }
            }])


            /*if (eventDet && teamDet && teamDet[0] && teamDet[0].teamMembers) {
                var teamMembers = teamDet[0].teamMembers;

                var s = events.update({
                    "_id": individualEventId
                }, {
                    $pull: {
                        "eventParticipants": {
                            $in: teamMembers
                        }
                    }
                });


                var p = schoolPlayerEntries.remove({
                    "playerId": {
                        $in: teamMembers
                    }
                })

            }*/
            if (eventDet) {
                var t = events.update({
                    "_id": individualEventId
                }, {
                    $pull: {
                        "eventParticipants": playerId
                    }
                });

                var p = schoolPlayerEntries.remove({
                    "playerId": playerId,
                    tournamentId: tournamentId
                })


            }
            return true
        } catch (e) {}
    }
});

//unsubscribe from team event
Meteor.methods({
    "unsubscribeFromTeamEventAfterPlayerDelete": function(teamId, playerId, tournamentId, teamEventId, managerId) {
        try {
            var eventDet = events.findOne({
                "_id": teamEventId,
                tournamentId: tournamentId
            });
            if (eventDet && playerId) {
                var t = events.update({
                    "_id": teamEventId
                }, {
                    $pull: {
                        "eventParticipants": playerId
                    }
                });

                var p = schoolPlayerTeamEntries.remove({
                    "playerId": playerId,
                    tournamentId: tournamentId
                })
            }
            return true

        } catch (e) {}
    }
});

//calling update team
Meteor.methods({
    "updateForGivenTeamFormatId": async function(xdata, managerID, schoolID, sourceData, subscriptionForSchool, teamId,teamEVENTId,tournamentId) {
        try {
            var resp = "0"
            if (managerID == "1") {
                if (xdata.teamMembers && xdata.teamMembers[0] && xdata.teamMembers[0].playerId) {
                    managerID = xdata.teamMembers[0].playerId
                }
            }

            var teamDetToRemMana = schoolTeams.findOne({"_id":teamId});
            if(teamDetToRemMana&&teamDetToRemMana.teamManager){
                var hh = events.update({
                    "_id":teamEVENTId
                }, {
                    $pull: {
                        eventParticipants:teamDetToRemMana.teamManager
                    }
                });
                schoolPlayerTeamEntries.remove({tournamentId: tournamentId,schoolId:schoolID,playerId:teamDetToRemMana.teamManager})
            }

            var res = await Meteor.call("updateNewTeam_ForSchool", xdata, managerID, schoolID, sourceData, subscriptionForSchool, teamId)
            try{    
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
        }
    }
});

//actual call to update team
/*Meteor.methods({
    "updateTeamForSchoolWithArguement": function(data) {
        try {
            data = data.replace("\\", "");
            var data = JSON.parse(data);
            var response;
            var eror;
            if (data && data.minNumberOfPlayers != undefined) {
                if (data.minNumberOfPlayers) {
                    Meteor.call("updateTeams_School", data.teamFormatId, data.playersDetails, data.schoolId, data.source, data.individualEventId, data.teamEventId, data.tournamentId, data.teamId, function(e, res) {
                        if (res) {
                            response = res;
                        } else if (e) {
                            eror = e;
                        }
                    });
                } else {
                    Meteor.call("updateTeams_SchoolTemporary", data.teamFormatId, data.playersDetails, data.schoolId, data.source, data.teamId, data.individualEventId, data.teamEventId, data.tournamentId, function(e, res) {
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
            }
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e
            return resultJson;
        }
    }
});*/

//update team actual call
Meteor.methods({
    "updateTeamForSchoolWithArguement": async function(data,apiKey) {
        try {
            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            var eventNAMES = [];
            var teamEventNAMES = [];
            var schoolEventDet = schoolEventsToFind.findOne({"key":"School"});
            if(schoolEventDet&&schoolEventDet.individualEventNAME&&schoolEventDet.teamEventNAME){
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
                if(data.playersDetails!=undefined&&data.playersDetails.length!=0&&data.schoolId!=undefined&&data.minNumberOfPlayers!=undefined&&data.eventName!=undefined&&data.teamId!=undefined){
                    if(data&&apiKey){
                        var apiKeyDet = apiUsers.findOne({"apiKey":apiKey.trim()});
                        var apiSource = "";
                        if(apiKeyDet&&apiKeyDet.source){
                            apiSource = apiKeyDet.source
                        }
                        data.source = apiSource;
                        if(apiKeyDet&&apiKeyDet.userId){
                            var eveOrgID = apiKeyDet.userId;
                            if(Meteor.users.findOne({userId:eveOrgID})){
                                if(data.schoolId){
                                    var schoolDet = schoolDetails.findOne({userId:data.schoolId, role:"School"});
                                    if(schoolDet&&schoolDet.state){
                                        var toureveDet = events.findOne({"eventOrganizer":eveOrgID,"tournamentEvent":true,"_id":data.tournamentId});
                                        if(toureveDet&&toureveDet._id){
                                            var tournamentId = toureveDet._id;
                                            if(data.eventName){
                                                if(eventNAMES.indexOf(data.eventName)!=-1){
                                                    var singleEveDet = events.findOne({"abbName":data.eventName,tournamentId:toureveDet._id});
                                                    if(singleEveDet&&singleEveDet._id){
                                                        individualEventId = singleEveDet._id;
                                                        var teamEveDet = events.findOne({"abbName":teamEventNAMES[eventNAMES.indexOf(data.eventName)],"tournamentId":toureveDet._id});
                                                        if(teamEveDet&&teamEveDet._id&&teamEveDet.projectId&&teamEveDet.projectId.length!=0){
                                                            teamEventId = teamEveDet._id
                                                            teamFormatId = teamEveDet.projectId.toString();
                                                           
                                                            //actual call to api's 
                                                            if (data && data.minNumberOfPlayers != undefined) {
                                                                if (data.minNumberOfPlayers==true) {
                                                                    var res = await Meteor.call("updateTeams_School", teamFormatId, data.playersDetails, data.schoolId, data.source, individualEventId, teamEventId, tournamentId, data.teamId)
                                                                    try {
                                                                        response = res;
                                                                        if(res && res.status=="success")
                                                                            Meteor.call("deletePlayersFromCategory",data.schoolId,data.eventName,function(e,deletePlayCat){});
                                                                    } catch(e) {
                                                                        eror = e;
                                                                    }
                                                                    
                                                                } else if(data.minNumberOfPlayers==false){
                                                                    var res = await Meteor.call("updateTeams_SchoolTemporary", teamFormatId, data.playersDetails, data.schoolId, data.source, data.teamId, individualEventId, teamEventId, tournamentId)
                                                                    try{
                                                                        response = res;
                                                                        if(res && res.status=="success")
                                                                            Meteor.call("deletePlayersFromCategory",data.schoolId,data.eventName,function(e,deletePlayCat){});
                                                                    } catch(e) {
                                                                        eror = e;
                                                                    }
                                                                }else {
                                                                    var resultJson = {};
                                                                    resultJson["status"] = "failure";
                                                                    resultJson["response"] = "minNumberOfPlayers is not valid. It should be boolean true or false.";
                                                                    return resultJson;
                                                                }
                                                                if (eror)
                                                                    return eror;
                                                                else if (response)
                                                                    return response
                                                            }
                                                        }
                                                    } else {
                                                    }
                                                } else{
                                                    var resultJson = {};
                                                    resultJson["status"] = "failure";
                                                    resultJson["response"] = "event name is invalid";
                                                    return resultJson;
                                                }
                                            }else{
                                                var resultJson = {};
                                                resultJson["status"] = "failure";
                                                resultJson["response"] = "event name is not valid";
                                                return resultJson;
                                            }
                                        } else{
                                            var resultJson = {};
                                            resultJson["status"] = "failure";
                                            resultJson["response"] = "Could not save ,tournament is completed";
                                            return resultJson;
                                        }
                                    } else{
                                        var resultJson = {};
                                        resultJson["status"] = "failure";
                                        resultJson["response"] = "schoolId or school's state id is not valid";

                                        return resultJson;
                                    }
                                } else{
                                    var resultJson = {};
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "schoolId is not valid";
                                    return resultJson;
                                }
                            } else{
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = "API KEY is not valid";
                                return resultJson;
                            }
                        }
                    }else{
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "API KEY is not valid";
                        return resultJson;
                    }
                }else{
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "All Parameters are required";
                    return resultJson;
                }
            }else{
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

//method to update team
Meteor.methods({
    "updateTeams_School": async function(teamFormatId, playersDetails, schoolID, source, individualEventId, teamEventId, tournamentId, teamId) {
        try {
            var messageValidations = [];
            var teamDetails = schoolTeams.findOne({
                "_id": teamId
            });
            if (teamDetails !== undefined) {
                var teamsFormatID = teamFormatId;
                var teamIdReturn;
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
                })
                if (findtournament && findtournamentSingle && findtournamentTeam) {
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
                                //call for each criteria
                                var res = await Meteor.call("validationForEachCriteria_School", teamFormatId, playersDetails, schoolID,findtournamentTeam.tournamentType)
                                try {
                                    if (res) {
                                        var schoolDetailsData = '';
                                        if (res != "0") {
                                            messageValidations = res;
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

                                            schoolDetailsData = fetchSchoolDet.abbrevation + "-" +teamNameFormat
                                                //call for mandatory players check
                                            var res = await Meteor.call("validationForMandatoryPlayers_School", teamFormatId, playersDetails)
                                            try {
                                                if (res != "0") {
                                                    var message = {
                                                        message: res
                                                    }
                                                    messageValidations.push(message.message)
                                                } else if (res == '0') {
                                                    //call for each player registeration
                                                    var res = await Meteor.call("playerRegesterationTeam_School", teamFormatId, playersDetails)
                                                    try {
                                                        if (res != '0' && schoolDetailsData != null && schoolDetailsData != undefined && schoolDetailsData.trim().length != 0) {
                                                            var teamMembers;
                                                            var teamManager;
                                                            var teamName;

                                                            if (res && res[0] && res[0].teamMembers && res[0].teamMembers[0] && res[0].teamMembers[0].playerId && res[0].teamManager) {
                                                                teamManager = res[0].teamManager;
                                                                teamName = schoolDetailsData;
                                                                teamMembers = res[0].teamMembers;
                                                                var onlyMemberIDs = res[0].teamMemIDs;
                                                                var idsTounsub = res[0].unsubscribePlayerIDS;
                                                                var unsubscribePlayerIDSForTeams = res[0].unsubscribePlayerIDSForTeams;

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

                                                                var res = await Meteor.call("updateForGivenTeamFormatId", Teamdata, managerID, schoolID, sourceData, subscriptionForSchool, teamId,teamEventId,tournamentId)
                                                                try {
                                                                    if (res == "0") {
                                                                        var message = {
                                                                            message: "Cannot create team"
                                                                        }
                                                                        messageValidations.push(message.message)
                                                                    } else if (res !== "0") {
                                                                        
                                                                        var teamID = res;
                                                                        if (teamID) {
                                                                            teamIdReturn = res;

                                                                            var res = await Meteor.call("subscribeToIndvidiualEvent_School", idsTounsub,onlyMemberIDs, individualEventId, teamEventId, tournamentId, schoolID)
                                                                            try{
                                                                                if (res) {
                                                                                    var res = await Meteor.call("suscribeToTeamEvent_School", unsubscribePlayerIDSForTeams,managerID, individualEventId, teamEventId, tournamentId, teamID, schoolID)
                                                                                    try {
                                                                                        if (res) {
                                                                                            
                                                                                            var rsendmail  =  await Meteor.call("sendEmailOfSchool", tournamentId, schoolID)
                                                                                            
                                                                                        }
                                                                                    }catch(e){
                                                                                        messageValidations.push(e)
                                                                                    }
                                                                                }
                                                                            }catch(e){
                                                                                messageValidations.push(e)
                                                                            }
                                                                        } else {
                                                                            var message = {
                                                                                message: "teamId is not valid"
                                                                            }
                                                                            messageValidations.push(message.message)
                                                                        }
                                                                    } else if (e) {
                                                                        messageValidations.push(e)
                                                                    }

                                                                }catch(e){
                                                                    messageValidations.push(e)
                                                                }
                                                            } else if (e) {
                                                                messageValidations.push(e)
                                                            }
                                                        } else if (e) {
                                                            messageValidations.push(e)
                                                        }
                                                    }catch(e){
                                                        messageValidations.push(e)
                                                    }

                                                } else if (e) {
                                                    messageValidations.push(e.reason)
                                                }
                                            }catch(e){
                                                messageValidations.push(e)
                                            }
                                        }
                                    } else if (e) {
                                        messageValidations.push(e)
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
                        message: "tournamentId or individualEventId or teamEventId is not valid"
                    }
                    messageValidations.push(message.message)
                }
            } else {
                var message = {
                    message: "teamId is not valid"
                }
                messageValidations.push(message.message)
            }
            if (messageValidations.length == 0) {
                var resultJson = {};
                resultJson["status"] = "success";
                resultJson["teamId"] = teamIdReturn
                resultJson["response"] = "Team is updated and subscribed successfully"
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

//method to update team temp
Meteor.methods({
    "updateTeams_SchoolTemporary": async function(teamFormatId, playersDetails, schoolID, source, teamId, individualEventId, teamEventId, tournamentId) {
        try {
            var messageValidations = [];
            var teamDetails = schoolTeams.findOne({
                "_id": teamId,
                "schoolId":schoolID
            });
            var teamIdReturn;

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

            if (teamDetails !== undefined) {
                if (findtournament && findtournamentSingle) {
                    if(true){
                    //if (moment(moment(findtournament.eventSubscriptionLastDate1).format("YYYY-MM-DD")) >= moment(moment.tz(findtournament.timeZoneName).format("YYYY-MM-DD"))) {
                        var teamsFormatID = teamFormatId;
                        var sourceData = "";
                        var subscriptionForSchool = false
                        if (source) {
                            sourceData = source;
                        }

                        if (schoolID != undefined && schoolID != null && schoolID.trim().length != 0) {
                            var fetchSchoolDet = schoolDetails.findOne({
                                "userId": schoolID
                            });
                            if (fetchSchoolDet && fetchSchoolDet.abbrevation) {
                                var res = await Meteor.call("validationForTeamFormatAndPlayersLength", teamFormatId, playersDetails)
                                try{
                                    if (res) {
                                        var schoolDetailsData = '';
                                        if (res != "0") {
                                            messageValidations = res;
                                        } else {
                                            var teamNameFormat = ""
                                            var mandatoryPlayersArrayFirst;
                                            var teamDetailsform = teamsFormat.findOne({
                                                "_id": teamsFormatID
                                            });
                                            if (teamDetailsform && teamDetailsform.teamFormatName && fetchSchoolDet.schoolName) {
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
                                            schoolDetailsData = fetchSchoolDet.abbrevation + "-" + teamNameFormat

                                            var res = await Meteor.call("playerRegesterationTeam_School", teamFormatId, playersDetails)
                                            try {
                                                if (res != '0' && schoolDetailsData != null && schoolDetailsData != undefined && schoolDetailsData.trim().length != 0) {
                                                    var teamMembers;
                                                    var teamManager;
                                                    var teamName;

                                                    if (res && res[0] && res[0].teamMembers && res[0].teamMembers[0] && res[0].teamMembers[0].playerId) {
                                                        teamManager = res[0].teamMembers[0].playerId;
                                                        teamName = schoolDetailsData;
                                                        teamMembers = res[0].teamMembers;
                                                        var onlyMemberIDs = res[0].teamMemIDs;
                                                        var idsTounsub = res[0].unsubscribePlayerIDS;

                                                        var Teamdata = {
                                                            teamName: teamName,
                                                            schoolName: fetchSchoolDet.schoolName,
                                                            teamFormatId: teamFormatId,
                                                            teamManager: teamManager,
                                                            teamMembers: teamMembers,
                                                            tournamentId:tournamentId
                                                        }
                                                        var managerID = "";
                                                        if (teamMembers[0].playerId) {
                                                            managerID = teamMembers[0].playerId
                                                        }

                                                        var res = await Meteor.call("updateForGivenTeamFormatId", Teamdata, managerID, schoolID, sourceData, subscriptionForSchool, teamId, teamEventId,tournamentId)
                                                        try {
                                                            if (res == "0") {
                                                                var message = {
                                                                    message: "Cannot create team"
                                                                }
                                                                messageValidations.push(message.message)
                                                            } else if (res !== "0") {
                                                                teamIdReturn = res;
                                                                var res = await Meteor.call("subscribeToIndvidiualEvent_School", idsTounsub,onlyMemberIDs, individualEventId, teamEventId, tournamentId, schoolID)
                                                                try {
                                                                    if (res) {
                                                                    
                                                                        var senndres = await Meteor.call("sendEmailOfSchool", tournamentId, schoolID)
                                                                    }
                                                                }catch(e){
                                                                    messageValidations.push(e)
                                                                }
                                                            } else if (e) {
                                                                messageValidations.push(e)
                                                            }
                                                        }catch(e){
                                                            messageValidations.push(e)
                                                        }
                                                    }
                                                } else if (e) {
                                                    messageValidations.push(e)
                                                }
                                            }catch(e){
                                                messageValidations.push(e)
                                            }
                                        }
                                    } else if (e) {
                                        messageValidations.push(e)
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
            } else {
                var message = {
                    message: "teamId or schoolId is not valid"
                }
                messageValidations.push(message.message)
            }
            if (messageValidations.length == 0) {
                var resultJson = {};
                resultJson["status"] = "success";
                resultJson["teamId"] = teamIdReturn
                resultJson["response"] = "Team is updated and subscribed to individual events."
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
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }
});


Meteor.methods({
    "sendEmailOfSchoolForPlayerDelete": function(tournamentId, teamName, schoolID, teamEventId, individualEventId) {
        try {
            var scholDet = schoolDetails.findOne({
                "userId": schoolID
            });
            if (scholDet && scholDet.emailAddress) {
                var emailAddressToSend = scholDet.emailAddress.trim();
                SSR.compileTemplate('sendUNSUBEmailSchool', Assets.getText('sendUNSUBEmailSchool.html'));

                var eventFind = events.findOne({
                    "tournamentId": tournamentId,
                    "_id": teamEventId
                });
                var eventFind2 = events.findOne({
                    "tournamentId": tournamentId,
                    "_id": individualEventId
                })
                if (eventFind && eventFind.eventName) {
                    var indeventName = "";
                    if (eventFind2 && eventFind2.eventName) {
                        indeventName = " and " + eventFind2.eventName
                    }
                    var dataContext = {
                        message: "",
                        eventNAME: eventFind.eventName + indeventName,
                        teamName: teamName
                    }

                    var html_string = SSR.render('sendUNSUBEmailSchool', dataContext);

                    var options = {
                        from: "iplayon.in@gmail.com",
                        to: emailAddressToSend,
                        subject: "iPlayOn:Subscription successful",
                        html: html_string
                    }

                    Meteor.call("sendShareEmail", options, function(e, re) {
                        if (re) {} else {}
                    });
                }
            }
        } catch (e) {}
    }
});

//send email after subscribe ,update ,create team
Meteor.methods({
    "sendEmailOfSchool": function(tournamentId, schoolID) {
        try {
            var scholDet = schoolDetails.findOne({
                "userId": schoolID
            });
            if (scholDet && scholDet.emailAddress) {
                var emailAddressToSend = scholDet.emailAddress.trim();

                SSR.compileTemplate('sendSUBSCRIPTION', Assets.getText('sendSUBSCRIPTION.html'));

                var eventFeeSettingsFind = eventFeeSettings.findOne({
                    "tournamentId": tournamentId
                })

                var subDetails = [];
                var eventsNAMES = [];
                var teamEventNames = [];
                var teamEventFEES = [];
                var eventsFees = [];
                var academyEntriesId = [];
                var districtAssociationIdEntries = [];
                var teamIdsArray = [];
                var subscribedTeamsArray = [];
                var teamRes = [];

                if (eventFeeSettingsFind) {
                    var ts = eventFeeSettingsFind.teamEvents
                    
                    eventsNAMES = eventFeeSettingsFind.singleEvents;
                    eventsFees = eventFeeSettingsFind.singleEventFees;
                    teamEventNames = ts;
                    teamEventFEES = eventFeeSettingsFind.teamEventFees
                }

                Meteor.call("getAllSubForSchoolTeam", tournamentId, schoolID, teamEventNames, function(e, teamRES) {
                    teamRes = teamRES;
                    Meteor.call("getALLSUBSChoolMAIL", tournamentId, schoolID, function(e, res) {
                        var type = events.findOne({
                            "_id": tournamentId,
                            tournamentEvent: true
                        });
                        var ts = eventFeeSettingsFind.teamEvents
                        var scdetDis = schoolEventsToFind.findOne({})

                        if(scdetDis && scdetDis.teamEventNAME && scdetDis.dispNamesTeam){
                            for(var jh=0;jh<ts.length;jh++){
                                var inds = _.indexOf(
                                    scdetDis.teamEventNAME , ts[jh]
                                )
                                if(inds>=0){
                                    ts[jh] = scdetDis.dispNamesTeam[jh]
                                }
                            }
                        }

                        var dataContext = {
                            message: "Recent subscription details of tournament",
                            tournament: type.eventName,
                            eventsDetailsMail: eventsNAMES,
                            teamEventNamesMAIL: eventFeeSettingsFind.teamEvents,
                            teamEventFEESMAIL: teamEventFEES,
                            playersWithCheckMail: res,
                            teamResponse: teamRes
                        }
                        Template.registerHelper("eventFeesSendMAIL", function(data) {
                            if (data) {
                                var eventDetails = events.findOne({
                                    "abbName": data,
                                    tournamentId: tournamentId
                                })
                                if (eventDetails && eventDetails.prize) {
                                    return eventDetails.prize
                                }
                            }
                        });

                        Template.registerHelper("slNUM", function(data) {
                            try {
                                return parseInt(parseInt(data) + 1)
                            } catch (e) {}
                        })

                        Template.registerHelper('upcomingformatDate', function(date) {
                            try {
                                if (date != "" || date != undefined || date != null || date.trim() != " ") {
                                    return moment(new Date(date)).format("DD MMM YYYY");
                                }
                            } catch (e) {}
                        });

                        Template.registerHelper("checkZEROorONE", function(data) {
                            if (parseInt(data) == 0) {
                                return false
                            } else {
                                return true
                            }
                        });

                        Template.registerHelper('getTeamNameForId', function(data) {
                            try {
                                var text = data.replace(/(\r\n|\n|\r)/gm, '<br/>');;
                                if (text) {
                                    return new Spacebars.SafeString(text);
                                }
                            } catch (e) {}
                        });

                        Template.registerHelper('checkForSameNames', function(data, data2) {
                            if (data && data2) {
                                if (data == data2) {
                                    return true
                                }
                            }
                        });

                        var html_string = SSR.render('sendSUBSCRIPTION', dataContext);


                        var options = {
                            from: "iplayon.in@gmail.com",
                            to: emailAddressToSend,
                            subject: "iPlayOn:Subscription successful",
                            html: html_string
                        }
                        Meteor.call("sendShareEmail", options, function(e, re) {
                            if (re) {} else {}
                        });
                    })
                });
            }
        } catch (e) {}
    }
})

//get school subscribers list of tournament individual event
Meteor.methods({
    "getALLSUBSChoolMAIL": function(tournamentId, schoolID) {
        try {
            var tournamentId = tournamentId;
            var teamDetails = [];

            playerEntriesData = schoolPlayerEntries.find({
                tournamentId: tournamentId,
                schoolId: schoolID
            }, {
                sort: {
                    academyId: 1
                }
            }).fetch();

            for (var i = 0; i < playerEntriesData.length; i++) {
                var userDetails = schoolPlayers.findOne({
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
            }
            return playerEntriesData;
        } catch (e) {}
    }
});

//get school subscribers list of tournament team event
Meteor.methods({
    "getAllSubForSchoolTeam": function(tournamentId, schoolID, teamEvents) {
        try {
            var teamNames = teamEvents
            var tourDet = events.findOne({
                "_id": tournamentId
            });
            var teamDetSubDEt = [];
            if (tourDet) {
                var scholDet = schoolDetails.findOne({
                    "userId": schoolID
                });
                if (scholDet) {
                    if (teamNames.length != 0) {
                        for (var i = 0; i < teamNames.length; i++) {
                            var subTeamDet = schoolPlayerTeamEntries.aggregate([{
                                $match: {
                                    "tournamentId": tournamentId,
                                    "schoolId":schoolID
                                }
                            }, {
                                $unwind: "$subscribedTeamsArray"
                            }, {
                                $match: {
                                    "subscribedTeamsArray.eventName": teamNames[i]
                                }
                            }, {
                                $project: {
                                    teamId: "$subscribedTeamsArray.teamId"
                                }
                            }])
                            if (subTeamDet && subTeamDet.length != 0) {
                                for (var j = 0; j < subTeamDet.length; j++) {
                                    var teamDEt = schoolTeams.findOne({
                                        "_id": subTeamDet[j].teamId,
                                        schoolId: schoolID
                                    });
                                    if (teamDEt) {
                                        var teamMembrs = [];
                                        var userNames = []
                                        teamMemb = schoolTeams.aggregate([{
                                            $match: {
                                                "_id": subTeamDet[j].teamId,
                                                schoolId: schoolID
                                            }
                                        }, {
                                            "$unwind": "$teamMembers"
                                        }, 
                                        {
                                            $match:{
                                                "teamMembers.teamEvent":true
                                            }
                                        },
                                        {
                                            $project: {
                                                "teamMem": "$teamMembers.playerId"
                                            }
                                        }, {
                                            $group: {
                                                "_id": 1,
                                                teamMEM: {
                                                    $push: "$teamMem"
                                                }
                                            }
                                        }])
                                        if (teamMemb && teamMemb[0] && teamMemb[0].teamMEM) {
                                            teamMembrs = teamMemb[0].teamMEM
                                            userNa = schoolPlayers.aggregate([{
                                                $match: {
                                                    "userId": {
                                                        $in: teamMembrs
                                                    }
                                                }
                                            }, {
                                                $group: {
                                                    "_id": 1,
                                                    userName: {
                                                        $push: "$userName"
                                                    }
                                                }
                                            }])
                                            if (userNa && userNa[0] && userNa[0].userName) {
                                                userNames = userNa[0].userName
                                            }
                                        }
                                        var data = {
                                            eventName: teamNames[i],
                                            teamId: teamDEt._id,
                                            teamName: teamDEt.teamName,
                                            teamMembers: userNames.toString()
                                        }
                                        teamDetSubDEt.push(data)
                                    }
                                }
                            } else {
                                var data = 0
                                teamDetSubDEt.push(data)
                            }
                        }
                    }
                }
            }

            return teamDetSubDEt
        } catch (e) {}
    }
})