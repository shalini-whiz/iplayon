import {nameToCollection} from '../dbRequiredRole.js'
import {playerDBFind} from '../dbRequiredRole.js'




Meteor.methods({

	//to be commented
    rankFilters123: function(playerID) {
        try {
            var userInfo = Meteor.users.findOne({
                "userId": playerID
            });
            var associationId;
            var associationName;
            var interestedProjectArr;
            var sportArr = [];
            var jsonS = [];
            var associationJsonInfo = {};
            var sportsJsonInfo = {};
            var eventsJsonInfo = {};

            if (userInfo != undefined) {


                //Meteor.call("updateDomainDetails",playerID);       


                var assocUnqiueArr = [];
                var eventOrgArr = [];
                var eventOrgList = _.uniq(PlayerPoints.find({}, {
                    sort: {
                        organizerId: 1
                    },
                    fields: {
                        organizerId: true
                    }
                }).fetch().map(function(x) {
                    return x.organizerId;
                }), true);

                if (eventOrgList.length > 0) {
                    for (var c = 0; c < eventOrgList.length; c++) {
                        var organizerInfo = Meteor.users.findOne({
                            "userId": eventOrgList[c]
                        });
                        if (organizerInfo) {
                            var organizerJson = {};
                            organizerJson["organizerId"] = eventOrgList[c];
                            organizerJson["organizerName"] = organizerInfo.userName;
                            eventOrgArr.push(organizerJson)
                        }
                    }
                }

                interestedProjectArr = userInfo.interestedProjectName;

                var sportsArray = [];
                if (interestedProjectArr.length > 0) {
                    for (var i = 0; i < interestedProjectArr.length; i++) {
                        try {
                            var sportsUnqiueArr = [];
                            sportsJsonInfo = {};
                            var sportInfo = tournamentEvents.findOne({
                                "_id": interestedProjectArr[i]
                            });
                            if (sportInfo != undefined) {
                                sportsJsonInfo["sportID"] = interestedProjectArr[i];
                                sportsJsonInfo["sport"] = sportInfo.projectMainName;



                                var eventList = tournamentEvents.findOne({
                                    "_id": interestedProjectArr[i]
                                });

                                if (eventList) {
                                    if (eventList.projectSubName) {
                                        sportsJsonInfo["eventsList"] = eventList.projectSubName;
                                        sportsUnqiueArr.push(sportsJsonInfo);
                                        associationJsonInfo["organizer"] = eventOrgArr;
                                        sportsArray.push(sportsJsonInfo);
                                    }

                                }
                            }
                        } catch (e) {}
                    }
                }
            }

            associationJsonInfo["sports"] = sportsArray
            jsonS.push(associationJsonInfo);
            return jsonS;
        } catch (e) {}
    },

    rankFilters: function(playerID) {
        try {
            var userInfo = Meteor.users.findOne({
                "userId": playerID
            });
            var jsonS = {};

            if (userInfo != undefined) {

                var sportsUniq = tournamentEvents.aggregate([

                    {
                        $unwind: "$projectSubName"
                    }, {
                        $match: {
                            "projectSubName.projectType": {
                                $nin: ["2"]
                            }
                        }
                    },

                    {
                        $group: {
                            "_id": {
                                "sportId": "$_id",
                                "projectMainName": "$projectMainName"
                            },
                            "events": {
                                $addToSet: "$projectSubName.projectName"
                            },
                        }
                    }, {
                        $project: {
                            "sportID": "$_id.sportId",
                            "sport": "$_id.projectMainName",
                            "events": 1,
                            "_id": 0
                        }
                    }

                ]);


                var organizerUniq = PlayerPoints.aggregate([{
                        $group: {
                            "_id": {
                                "organizerId": "$organizerId",
                                "sportId": "$sportId"
                            },

                        }
                    }, {
                        $project: {
                            "organizerId": "$_id.organizerId",
                            "sportId": "$_id.sportId",
                            "_id": 0
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "organizerId",
                            foreignField: "userId",
                            as: "userDetails"
                        }
                    }, {
                        $unwind: "$userDetails"
                    }, {
                        $project: {
                            "organizerId": 1,
                            "sportId": 1,
                            "organizerName": "$userDetails.userName",
                        }
                    }

                ]);

                jsonS["sports"] = sportsUniq;
                jsonS["organizer"] = organizerUniq;

            }
            return jsonS;
        } catch (e) {
        }
    },
    //to be commented
    getRankData: function(sport, sportID, eventName, eventID, filterBy, filterData) {
        try {
            sport = sport.trim();
            sportID = sportID.trim();
            eventName = eventName.trim();
            eventID = eventID.trim();
            filterBy = filterBy.trim();
            filterData = filterData.trim();
            var userDetail = [];

            var playerPointsList = PlayerPoints.find({
                "sportId": sportID,
                "organizerId": filterData,
                "eventName": eventName
            }).fetch();


            if (playerPointsList.length > 0) 
            {

                //list of upcoming tournaments organized by selected organizer
                var tournamentsOrganized = pastEvents.find({
                    "eventOrganizer": filterData.trim(),
                    "tournamentEvent": true
                }).fetch();
                organizedTourList = [];
                if (tournamentsOrganized.length > 0) {
                    for (q = 0; q < tournamentsOrganized.length; q++) {
                        var m = q + 1;
                        var json = {};
                        json["id"] = "T" + m;
                        json["tournamentId"] = tournamentsOrganized[q]._id;
                        json["points"] = "0";
                        organizedTourList.push(json);
                    }
                }

                //list of past tournaments organized by selected organizer
                var tournamentsOrganized = events.find({
                    "eventOrganizer": filterData.trim(),
                    "tournamentEvent": true
                }).fetch();
                if (tournamentsOrganized.length > 0) {
                    for (q = 0; q < tournamentsOrganized.length; q++) {
                        var m = parseInt(organizedTourList.length) + 1;
                        var json = {};
                        json["id"] = "T" + m;
                        json["tournamentId"] = tournamentsOrganized[q]._id;
                        json["points"] = "0";
                        organizedTourList.push(json);
                    }
                }

                //list of external tournament 
                var exttournamentsOrganized = PlayerPoints.findOne({
                    "sportId": sportID,
                    "organizerId": filterData,
                    "eventName": eventName
                });
                if (exttournamentsOrganized) {
                    if (exttournamentsOrganized.extTournamentCount) {
                        var extTournament = exttournamentsOrganized.extTournament;
                        for (h = 0; h < extTournament.length; h++) {
                            var m = parseInt(organizedTourList.length) + 1;
                            var json = {};
                            json["id"] = "T" + m;
                            json["tournamentId"] = extTournament[h];
                            json["points"] = "0";
                            organizedTourList.push(json);
                        }
                    }
                }


                for (var x = 0; x < playerPointsList.length; x++) {
                    var totalPoints = playerPointsList[x].totalPoints;
                    if (totalPoints != "0" && nameToCollection(playerPointsList[x].playerId)) {
                        var playerId = playerPointsList[x].playerId;
                        var userInfo = nameToCollection(playerId).findOne({
                            "userId": playerId
                        });

                        if (userInfo) {
                            var convertedJSON = JSON.parse(JSON.stringify(userInfo));
                            var destinationArray = JSON.parse(JSON.stringify(organizedTourList));
                            var clubName;
                            var academyId = "";
                            var state = "other";
                            if (convertedJSON.clubNameId == "other" || convertedJSON.clubNameId == undefined || convertedJSON.clubNameId == null)
                                clubName = "other";

                            else {
                                var clubInfo = academyDetails.findOne({
                                    "userId": convertedJSON.clubNameId
                                });
                                if (clubInfo) {
                                    var convertedClubJSON = JSON.parse(JSON.stringify(clubInfo));
                                    clubName = convertedClubJSON.clubName;
                                } else
                                    clubName = "other";
                            }

                            var stateInfo = domains.findOne({
                                "_id": convertedJSON.state
                            });
                            if (stateInfo) {
                                var convertedStateJSON = JSON.parse(JSON.stringify(stateInfo));
                                state = convertedStateJSON.domainName;
                            }

                            convertedJSON.academy = clubName;
                            convertedJSON.stateName = state;
                            convertedJSON.totPoints = totalPoints;

                            //tournament points
                            var totTournaments = playerPointsList[x].eventPoints;
                            for (h = 0; h < totTournaments.length; h++) {
                                var points_tournamentId = playerPointsList[x].eventPoints[h].tournamentId;
                                var pointsGained = playerPointsList[x].eventPoints[h].tournamentPoints;
                                var points_tournamentName;
                                if (playerPointsList[x].eventPoints[h].tournamentName)
                                    points_tournamentName = playerPointsList[x].eventPoints[h].tournamentName;
                                for (var u = 0; u < destinationArray.length; u++) {
                                    if (destinationArray[u].tournamentId == points_tournamentId) {
                                        destinationArray[u].points = pointsGained;
                                        convertedJSON["tournamentInfo"] = destinationArray;
                                    } else {
                                        if (destinationArray[u].tournamentId == points_tournamentName) {
                                            destinationArray[u].points = pointsGained;
                                            convertedJSON["tournamentInfo"] = destinationArray;
                                        }
                                    }
                                }

                            }
                            if (_.findWhere(userDetail, convertedJSON) == null) {
                                userDetail.push(convertedJSON);
                            }
                        }
                    }
                }


            }
            if (userDetail.length != 0) {
                userDetail.sort(function(a, b) {
                    return parseInt(b.totPoints) - parseInt(a.totPoints);
                });
                userDetail.map(function(document, index) {
                    document["rank"] = parseInt(index + 1);
                    document["slNo"] = parseInt(index + 1);
                });

            }

            return userDetail;

        } catch (e) {

        }
    },
    getRankData12: function(sportID, eventName, filterData) {
        try {
            sportID = sportID.trim();
            eventName = eventName.trim();
            filterData = filterData.trim();
            var userDetail = [];

            var playerPointsList = PlayerPoints.find({
                "sportId": sportID,
                "organizerId": filterData,
                "eventName": eventName
            }).fetch();


            if (playerPointsList.length > 0) 
            {
                //list of upcoming tournaments organized by selected organizer
                var tournamentsOrganized = pastEvents.find({
                    "eventOrganizer": filterData.trim(),
                    "tournamentEvent": true
                }).fetch();
                organizedTourList = [];
                if (tournamentsOrganized.length > 0) {
                    for (q = 0; q < tournamentsOrganized.length; q++) {
                        var m = q + 1;
                        var json = {};
                        json["id"] = "T" + m;
                        json["tournamentId"] = tournamentsOrganized[q]._id;
                        json["points"] = "0";
                        organizedTourList.push(json);
                    }
                }



                var newID = 0;
              



              


               

                //list of past tournaments organized by selected organizer
                var tournamentsOrganized = events.find({
                    "eventOrganizer": filterData.trim(),
                    "tournamentEvent": true
                }).fetch();
                if (tournamentsOrganized.length > 0) {
                    for (q = 0; q < tournamentsOrganized.length; q++) {
                        var m = parseInt(organizedTourList.length) + 1;
                        var json = {};
                        json["id"] = "T" + m;
                        json["tournamentId"] = tournamentsOrganized[q]._id;
                        json["points"] = "0";
                        organizedTourList.push(json);
                    }
                }

           


                //list of external tournament 
                var exttournamentsOrganized = PlayerPoints.findOne({
                    "sportId": sportID,
                    "organizerId": filterData,
                    "eventName": eventName
                });
                if (exttournamentsOrganized) {
                    if (exttournamentsOrganized.extTournamentCount) {
                        var extTournament = exttournamentsOrganized.extTournament;
                        for (h = 0; h < extTournament.length; h++) {
                            var m = parseInt(organizedTourList.length) + 1;
                            var json = {};
                            json["id"] = "T" + m;
                            json["tournamentId"] = extTournament[h];
                            json["points"] = "0";
                            organizedTourList.push(json);
                        }
                    }
                }



                for (var x = 0; x < playerPointsList.length; x++) {
                    var totalPoints = playerPointsList[x].totalPoints;
                    if (totalPoints != "0" && nameToCollection(playerPointsList[x].playerId)) {
                        var playerId = playerPointsList[x].playerId;
                        var userInfo = nameToCollection(playerId).findOne({
                            "userId": playerId
                        });

                        if (userInfo) {
                            var convertedJSON = JSON.parse(JSON.stringify(userInfo));
                            var destinationArray = JSON.parse(JSON.stringify(organizedTourList));
                            var clubName;
                            var academyId = "";
                            var state = "other";
                            if (convertedJSON.clubNameId == "other" || convertedJSON.clubNameId == undefined || convertedJSON.clubNameId == null)
                                clubName = "other";

                            else {
                                var clubInfo = academyDetails.findOne({
                                    "userId": convertedJSON.clubNameId
                                });
                                if (clubInfo) {
                                    var convertedClubJSON = JSON.parse(JSON.stringify(clubInfo));
                                    clubName = convertedClubJSON.clubName;
                                } else
                                    clubName = "other";
                            }

                            var stateInfo = domains.findOne({
                                "_id": convertedJSON.state
                            });
                            if (stateInfo) {
                                var convertedStateJSON = JSON.parse(JSON.stringify(stateInfo));
                                state = convertedStateJSON.domainName;
                            }

                            convertedJSON.academy = clubName;
                            convertedJSON.stateName = state;
                            convertedJSON.totPoints = totalPoints;

                            //tournament points
                            var totTournaments = playerPointsList[x].eventPoints;
                            for (h = 0; h < totTournaments.length; h++) 
                            {
                                var points_tournamentId = playerPointsList[x].eventPoints[h].tournamentId;
                                var pointsGained = playerPointsList[x].eventPoints[h].tournamentPoints;
                                var points_tournamentName;
                                if (playerPointsList[x].eventPoints[h].tournamentName)
                                    points_tournamentName = playerPointsList[x].eventPoints[h].tournamentName;
                                for (var u = 0; u < destinationArray.length; u++) {
                                    if (destinationArray[u].tournamentId == points_tournamentId) {
                                        destinationArray[u].points = pointsGained;
                                        convertedJSON["tournamentInfo"] = destinationArray;
                                    } else {
                                        if (destinationArray[u].tournamentId == points_tournamentName) {
                                            destinationArray[u].points = pointsGained;
                                            convertedJSON["tournamentInfo"] = destinationArray;
                                        }
                                    }
                                }

                            }

                            
                            if (_.findWhere(userDetail, convertedJSON) == null) {
                                userDetail.push(convertedJSON);
                            }
                        }
                    }
                }


            }

            if (userDetail.length != 0) {
                userDetail.sort(function(a, b) {
                    return parseInt(b.totPoints) - parseInt(a.totPoints);
                });
                userDetail.map(function(document, index) {
                    document["rank"] = parseInt(index + 1);
                    document["slNo"] = parseInt(index + 1);
                });

            }

            return userDetail;

        } catch (e) {
        }
    },
    getRankData13: function(sportID, eventName, filterData) {
        try {
            var sportID = sportID.trim();
            var eventName = eventName.trim();
            var filterData = filterData.trim();
            var userDetail = [];

            var playerPointsList = PlayerPoints.find({
                "sportId": sportID,
                "organizerId": filterData,
                "eventName": eventName
            }).fetch();


            if (playerPointsList.length > 0) 
            {

            	var dbName = playerDBFind(sportID);

            	var temp = PlayerPoints.aggregate([{
                        $match: {
                          	"sportId": sportID,
                			"organizerId": filterData,
                			"eventName": eventName,
                			"totalPoints":{"$gt":0}
                        }},
                        {
                            $lookup: {
                                from: dbName,
                                localField: "playerId",
                                foreignField: "userId",
                                as: "playerDetails"
                            }
                        },
                        {   $unwind:"$playerDetails" },
                        { 
                            $project : { 
                                "_id":1,
                                "playerId":1,
                                "sportId":1,
                                "eventName":1,
                                "totalPoints":1,
                                "eventPoints":1,
                                "userName":"$playerDetails.userName",
                                "clubNameId":"$playerDetails.clubNameId",
                                "userId":"$playerDetails.userId",
                                "associationId":"$playerDetails.associationId",
                                "city":"$playerDetails.city",
                                "state":"$playerDetails.state"
                            } 
                        }         
             
                    
                    
                    
                ]);

            }

        } catch (e) {
        }
    }

})