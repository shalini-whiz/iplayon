//get entries for team events
Meteor.methods({
    "getEntriesOfTeamEvent": async function(data,apiKey) {
        try {
            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            var eventNAMES = [];
            var teamEventNAMES = [];
            var resultJson = {};
            resultJson["eventType"] = "Team";
            var response;
            var eror;
            if (data.tournamentId != undefined && data.eventName != undefined && apiKey) {
                if (data && apiKey) {
                    var apiKeyDet = apiUsers.findOne({
                        "apiKey": apiKey.trim()
                    });
                    var apiSource = "";
                    
                    if (apiKeyDet && apiKeyDet.userId) {
                        var eveOrgID = apiKeyDet.userId;
                        if (Meteor.users.findOne({
                                userId: eveOrgID
                            })) {
                            if (data.tournamentId&&data.eventName) {
                                var schoolDet = data
                                if (schoolDet) {
                                    var toureveDet = events.findOne({
                                        "tournamentId": data.tournamentId,
                                        "eventName": data.eventName,
                                    });
                                    if (toureveDet == undefined) {
                                        toureveDet = pastEvents.findOne({
                                            "tournamentId": data.tournamentId,
                                            "eventName": data.eventName,
                                        });
                                    }
                                    if (toureveDet && toureveDet._id) {
                                        var tournamentId = toureveDet._id;
                                        if (data.eventName) {
                                            if (data.eventName) {
                                                var TEamEveDet = events.findOne({
                                                    "abbName": data.eventName,
                                                    "tournamentId": data.tournamentId
                                                });
                                                if (TEamEveDet == undefined) {
                                                    TEamEveDet = pastEvents.findOne({
                                                        "abbName":data.eventName,
                                                        "tournamentId": data.tournamentId
                                                    });
                                                }
                                                if (TEamEveDet && TEamEveDet._id) {
                                                    if (TEamEveDet.eventParticipants && TEamEveDet.eventParticipants.length != 0) {
                                                        teamEVENTID = TEamEveDet._id;
                                                        try{
                                                            
                                                            var res = await Meteor.call("getEntriesForGiventStateTeam", TEamEveDet.eventParticipants, data.tournamentId);
                                                            if (res) {
                                                                response = res
                                                            }
                                                        }catch(e){
                                                        }
                                                        if (eror){
                                                            return eror;
                                                        }

                                                        else if (response){
                                                            return response;
                                                        }
                                                    } else {
                                                        resultJson["status"] = "failure";
                                                        resultJson["response"] = "No entries";
                                                        resultJson["data"] = ""
                                                        return resultJson;
                                                    }
                                                } else {
                                                    resultJson["status"] = "failure";
                                                    resultJson["response"] = "event is invalid";
                                                    return resultJson;
                                                }
                                            } else {
                                                resultJson["status"] = "failure";
                                                resultJson["response"] = "event name is invalid";
                                                return resultJson;
                                            }
                                        } else {
                                            resultJson["status"] = "failure";
                                            resultJson["response"] = "event name is not valid";
                                            return resultJson;
                                        }
                                    } else {
                                        resultJson["status"] = "failure";
                                        resultJson["response"] = "tournament is not valid 1";
                                        return resultJson;
                                    }
                                } else {
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = "tournament or event is not valid";
                                    return resultJson;
                                }
                            } else {
                                resultJson["status"] = "failure";
                                resultJson["response"] = "tournament or event is not valid";
                                return resultJson;
                            }
                        } else {
                            resultJson["status"] = "failure";
                            resultJson["response"] = "API KEY is not valid";
                            return resultJson;
                        }
                    }
                } else {
                    resultJson["status"] = "failure";
                    resultJson["response"] = "API KEY is not valid";
                    return resultJson;
                }
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "All Parameters are required";
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }

});

Meteor.methods({
    getEntriesForGiventStateTeam: function(data,tournamentId) {
        try {
            var resultJson = {};
            resultJson["eventType"] = "Team";
            var getEventPartsList = data;
            var schoolData = schoolTeams.aggregate([{
                $match: {
                    "teamManager": {
                        $in: data
                    },
                    "tournamentId":tournamentId,
                    subscriptionForSchool:true
                }
            }, {
                "$project": {
                    "_id": 0,
                    "schoolId": "$schoolId",
                    "teamName": "$teamName",
                    "teamFormatId": "$teamFormatId",
                    "teamId": "$_id",
                    "schoolName": "$schoolName"
                }
            },
            {$sort:{
                "schoolName":1
            }}
            ]);
            if (schoolData) {
                resultJson["status"] = "success";
                resultJson["response"] = "Entries For Team"
                if (schoolData == undefined || schoolData.length == 0) {
                    schoolData = {}
                }
                resultJson["data"] = schoolData;
                return resultJson;
            } else {
                resultJson["status"] = "failure";
                resultJson["response"] = "No Entries"
                return resultJson;
            }
        } catch (e) {
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }
});

Meteor.methods({
    "getTeamEntryDetailsForTeamEvent": async function(data, apiKey) {
        try {
            var tournamentId;
            var individualEventId;
            var teamEventId;
            var teamFormatId;
            var eventNAMES = [];
            var teamEventNAMES = [];
            
            if(typeof data == "string"){
                data = data.replace("\\", "");
                data = JSON.parse(data);
            }

            var response;
            var eror;
            if (data.schoolId != undefined && data.teamId != undefined) {
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
                                    try{
                                        var res = await Meteor.call("getEntriesDetailsForGiventStateTeam", data.teamId);
                                        if (res) {
                                            response = res
                                        }
                                    }catch(e){

                                    }
                                    
                                    if (eror)
                                        return eror;

                                    else if (response)
                                        return response;

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
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }
});

Meteor.methods({
    getEntriesDetailsForGiventStateTeam: function(data) {
        try {
            var getEventPartsList = data;
            var schoolContDetails = {};
            var schoolData = schoolTeams.findOne({
                "_id": data
            });
            if (schoolData) {
                if(schoolData.schoolId){
                    schoolContDetails = schoolDetails.findOne({
                        userId:schoolData.schoolId
                    })
                }
                if (schoolData.teamMembers && schoolData.teamMembers.length != 0) {
                    var playersArr = schoolTeams.aggregate([{
                        $match: {
                            "_id": data
                        }
                    }, {
                        $unwind: "$teamMembers"
                    }, {
                        $match: {
                            "teamMembers.teamEvent": true
                        }
                    }, {
                        $group: {
                            "_id": 0,
                            playersID: {
                                $push: "$teamMembers.playerId"
                            }
                        }
                    }])
                    if (playersArr && playersArr[0] && playersArr[0].playersID) {
                        var playersDet = schoolPlayers.aggregate([{
                            $match: {
                                userId: {
                                    $in: playersArr[0].playersID
                                }
                            }
                        }, {
                            $project: {
                                _id: 0,
                                playerName: "$userName",
                                playerDateOfBirth: "$dateOfBirth",
                                playerClass: "$class",
                                gender: "$gender",
                                playerId: "$userId"
                            }
                        }])
                        if (playersDet) {
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = "Team details"
                            if (playersDet == undefined || playersDet.length == 0) {
                                playersDet = {}
                            }
                            resultJson["schoolDetails"] = schoolContDetails;
                            resultJson["data"] = playersDet;
                            return resultJson;
                        }
                    } else {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["schoolDetails"] = schoolContDetails;
                        resultJson["response"] = "Team members are empty"
                        return resultJson;
                    }
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = "Entries For Team"
                    if (schoolData == undefined || schoolData.length == 0) {
                        schoolData = {}
                    }
                    resultJson["data"] = schoolData;
                    resultJson["schoolDetails"] = schoolContDetails;
                    return resultJson;
                } else {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Team is not created"
                    return resultJson;
                }
            } else {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "teamId is not valid"
                return resultJson
            }
        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e.toString()
            return resultJson;
        }
    }
})