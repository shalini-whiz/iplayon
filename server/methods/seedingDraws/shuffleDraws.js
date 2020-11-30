//check rows sl no, player name, aff id
//check for empty rows
//check users exists in eve parts
//check sl no repeats
//make array of userIds 
//fetch userIds which are not in array
//sort  them acording to rank
//shuffle them
//merge them with fixed userIds
//merge to bye or walkover
//upload{ "_id" : "pgke8fRvy7vQm9Qxs", "playerId" : "nin8bg8CznBCHDvAa", "sportId" : "jgeapScsZyM8sg5uw", "playerName" : "p7r7", "associationId" : "sLXHmds2wbsLFdHK7", "afId" : "ASA1801934", "parentAssociationId" : "other", "organizerId" : "sLXHmds2wbsLFdHK7", "eventName" : "Mini Cadet Boy's", "eventPoints" : [ { "tournamentId" : "pn32WxHPJ7Wdzq55Q", "tournamentPoints" : 10 }, { "tournamentId" : "X8aiPyJzLAyshyLZu", "tournamentPoints" : 40 } ], "totalPoints" : "50" }
//duplicate rows to test
import {
    playerDBFind
}
from '../dbRequiredRole.js'


var BOTTOM = 0;
var TOP = 1;

var Player = {
    mRank: 0,
    mAt: 0
};

var mergedArr = [];

Meteor.methods({
    "validationForEventParticipantsSeeding": async function(tournamentId, eventName, eventId, posFixedUsers) {

        var res = {
            "data": 0,
            "message": "cannot create draws"
        }

        try {
            //tournamentId = "X8aiPyJzLAyshyLZu"
            //eventName = "Mini Cadet Boy's"

            if (tournamentId && eventName && posFixedUsers && posFixedUsers.data && posFixedUsers.data.length) {
            
                if (posFixedUsers.data[0]["Affiliation ID"] && posFixedUsers.data[0]["Name"]) {
                    posFixedUsers = posFixedUsers.data
                } else {
                    res = {
                        "data": 0,
                        "message": "Invalid keys"
                    }
                    return res
                }
                //get type of project
                var eventProject = events.findOne({
                    "_id": tournamentId
                }, {
                    fields: {
                        projectId: 1,
                    }
                })
               

                if (eventProject && eventProject.projectId && eventProject.projectId.length == 1) {
                    /*posFixedUsers = [{
                        "Affiliation ID": "IPD1801928",
                        "Name": "p1r1",
                        "Academy": "",
                    }, {
                        "Affiliation ID": "TMP2297",
                        "Name": "p2r2",
                        "Academy": "",
                    }, {
                        "Affiliation ID": "ASD1801930",
                        "Name": "p3r3",
                        "Academy": "",
                    }]*/
                    //pluck affiliation ids and user names of uploaded list
                    var affiliationIds = _.pluck(posFixedUsers, 'Affiliation ID');
                    var userNames = _.pluck(posFixedUsers, 'Name');

                    //get db name
                    var dbtoret = playerDBFind(eventProject.projectId[0])
                    if (dbtoret == false) {
                        dbtoret = "userDetailsTT"
                    }

                    var dobFilt = dobFilterSubscribe.aggregate([{
                        $match: {
                            tournamentId: tournamentId
                        }
                    }, {
                        "$unwind": "$details"
                    }, {
                        $match: {
                            "details.eventId": eventId
                        }
                    }, {
                        "$project": {
                            ranking: "$details.ranking"
                        }
                    }])


                    var queryForAffili = {}
                    var orderAffili = {}
                    var typAffId = "$affiliationId"

                    if (dobFilt && dobFilt.length && dobFilt[0] && dobFilt[0].ranking == "yes") {
                        queryForAffili = {
                            "affiliationId": {
                                "$in": affiliationIds
                            }
                        }

                        orderAffili = {
                            "__order": {
                                "$indexOfArray": [affiliationIds, "$affiliationId"]
                            }
                        }
                        typAffId = "$affiliationId"
                    } else if (dobFilt && dobFilt.length && dobFilt[0] && dobFilt[0].ranking == "no") {
                        queryForAffili = {
                            "tempAffiliationId": {
                                "$in": affiliationIds
                            }
                        }

                        orderAffili = {
                            "__order": {
                                "$indexOfArray": [affiliationIds, "$tempAffiliationId"]
                            }
                        }
                        typAffId = "$tempAffiliationId"

                    } else {
                        res = {
                            "data": 0,
                            "message": "Invalid ranking"
                        }
                        return res
                    }

                    //find the userids for corresponding affiliation id
                    var usersDet = global[dbtoret].aggregate([{
                        "$match": queryForAffili
                    }, {
                        "$addFields": orderAffili
                    }, {
                        $sort: {
                            "__order": 1
                        }
                    }, {
                        $project: {
                            "slNo": "$__order",
                            "rank": "$__order",
                            userName: 1,
                            affiliationId: 1,
                            userId: 1,
                            tempAffiliationId: 1,
                            "Affiliation ID": typAffId,
                            "Name": "$userName",
                            "points": "fixed"
                        }
                    }, {
                        $group: {
                            "_id": "$points",
                            "det": {
                                "$push": {
                                    "slNo": "$slNo",
                                    "rank": "$rank",
                                    userName: "$userName",
                                    affiliationId: "$affiliationId",
                                    userId: "$userId",
                                    tempAffiliationId: "$tempAffiliationId",
                                    "Affiliation ID": "$Affiliation ID",
                                    "Name": "$Name",
                                    "points": "fixed",
                                    "Points":"fixed"
                                }
                            }
                        }
                    }])
                    
                    if (usersDet && usersDet.length && usersDet[0].det && usersDet[0].det.length != 0) {
                        var usersDetFromQuery = usersDet
                        usersDet = usersDet[0].det
                            //pluck userid and username from db
                        var userIdsDB = _.pluck(usersDet, 'userId');
                        var userNamesDB = _.pluck(usersDet, 'userName');
                        var affIdDBs = _.pluck(usersDet, 'affiliationId');
                        var tempIdDBS = _.pluck(usersDet, 'tempAffiliationId');

                        var userIdsDBWitoutSort = _.pluck(usersDet, 'userId');
                       

                        var affIdDB = affIdDBs.concat(tempIdDBS)
                        var intAffi = _.intersection(affiliationIds.sort(), affIdDB.sort())


                        if (_.isEqual(affiliationIds.sort(), intAffi.sort())) {
                            //get list of event participants
                            var eveParts = events.findOne({
                                "tournamentId": tournamentId,
                                "eventName": eventName,
                            }, {
                                fields: {
                                    eventParticipants: 1,
                                }
                            })
                            if (eveParts && eveParts.eventParticipants && eveParts.eventParticipants.length) {
                                var evePartsIntersec = _.intersection(eveParts.eventParticipants, userIdsDB)
                                    //check uploaded users are in event parts
                                if (_.isEqual(evePartsIntersec.sort(), userIdsDB.sort())) {
                                    var togoFurther = false

                                    if (userNamesDB.length != userNames.length) {
                                        res = {
                                            "data": 0,
                                            "message": "problem with combination of Affiliation ID and Name"
                                        }
                                    } else {
                                        //check for given affid and username matches
                                        for (var i = 0; i < userNamesDB.length; i++) {
                                            if (userNamesDB[i] == userNames[i]) {
                                                togoFurther = true
                                            } else {
                                                togoFurther = false
                                                res = {
                                                    "data": 0,
                                                    "message": "problem with combination of Affiliation ID and Name" +
                                                        ", " + " for Affiliation ID " + affiliationIds[i] + " , Name should be " +
                                                        userNamesDB[i]
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    if (togoFurther == true)
                                    {
                                        //get diff bw given userids and event parts
                                        var s = _.difference(eveParts.eventParticipants, userIdsDBWitoutSort);
                                        
                                        //join them
                                        var shufledArray = s
                                        try {
                                            if (shufledArray) {
                                                var concatUserIds = _.union(userIdsDBWitoutSort, shufledArray);
                                                var userConDet = await Meteor.call("assignRank", concatUserIds, shufledArray, userIdsDBWitoutSort.length, usersDetFromQuery, dbtoret, eventProject.projectId[0], eventName, typAffId)
                                                try {
                                                    if (userConDet && userConDet.data != undefined && userConDet.data != null && userConDet.data != 0 &&
                                                        userConDet.concatenated && userConDet.concatenated.length) {
                                                        res = {
                                                                "data": userConDet.data,
                                                                "concatenated": userConDet.concatenated,
                                                                "message": "validation success, ranks are assigned"
                                                            }
                                                    } else if (userConDet && userConDet.data == 0) {
                                                        res = {
                                                                "data": 0,
                                                                "message": userConDet.message
                                                            }

                                                    }
                                                } catch (e) {
                                                    res = {
                                                            "data": 0,
                                                            "message": e
                                                        }
                                                }
                                            } else {
                                                res = {
                                                    "data": 0,
                                                    "message": "Cannot assign rank"
                                                }
                                            }
                                        } catch (e) {
                                            res = {
                                                    "data": 0,
                                                    "message": e
                                                }
                                        }

                                    }

                                } else {
                                    var s = _.difference(eveParts.eventParticipants, userIdsDB);

                                    res = {
                                        "data": 0,
                                        "message": "invalid entries"
                                    }
                                }
                            } else {
                                res = {
                                    "data": 0,
                                    "message": "there are no entries in this event"
                                }
                            }
                        } else {
                            var s = _.difference(affiliationIds, affIdDB);
                            if (s.length != 0 && s.toString().trim().length != 0 && /^\w(\s*,?\s*\w)*$/.test(s.toString())) {
                                res = {
                                    "data": 0,
                                    "message": " Affiliation IDs " + s.toString() + " are invalid"
                                }
                            } else {
                                res = {
                                    "data": 0,
                                    "message": " Affiliation IDs are Invalid and cannot be empty"
                                }
                            }
                        }
                    } else {
                        res = {
                            "data": 0,
                            "message": "invalid players"
                        }
                    }

                } else {
                    res = {
                        "data": 0,
                        "message": "tournament is not valid"
                    }
                }
            } else {
                res = {
                    "data": 0,
                    "message": "Invalid param"
                }
            }
            return res
        } catch (e) {
            res = {
                    "data": 0,
                    "message": e
                }
            return res
        }
    }
})

function shuffleArray1(array) {
    var counter = array.length,
        temp, index;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

Meteor.methods({
    "assignRank": function(concatUserIds, otherUserIDs, userIdsDlength, usersDetUploaded, dbtoret, sportID, eventName, typAffId) {

        var res = {
            "data": 0,
            "message": "cannot create draws"
        }
        var withRank = []

        try {


            if (otherUserIDs) {
                //get db name

                if (dbtoret == false) {
                    dbtoret = "userDetailsTT"
                }


                //find the userids for corresponding affiliation id
                var usersDet = global[dbtoret].aggregate([{
                    $match: {
                        userId: {
                            $in: otherUserIDs
                        }
                    }
                }, {
                    $project: {
                        userName: 1,
                        affiliationId: 1,
                        userId: 1,
                        tempAffiliationId: 1,
                        "Affiliation ID": typAffId,
                        "Name": "$userName"
                    }
                }, {
                    $lookup: {
                        from: "PlayerPoints",
                        localField: "userId",
                        // name of users table field,
                        foreignField: "playerId",
                        as: "pointsDet" // alias for userinfo table

                    }
                }, {
                    $unwind: {
                        path: "$pointsDet",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        "eventName": "$pointsDet.eventName",
                        "sportId": "$pointsDet.sportId",
                        "eventNameSport": {
                            "$cond": {
                                if: {
                                    "$and": [{
                                        "$eq": ["$pointsDet.sportId", sportID]
                                    }, {
                                        "$eq": ["$pointsDet.eventName", eventName]
                                    }]
                                },
                                then: 1,
                                else: 0
                            }
                        },
                        userName: "$userName",
                        affiliationId: "$affiliationId",
                        userId: "$userId",
                        tempAffiliationId: "$tempAffiliationId",
                        "Affiliation ID": typAffId,
                        "Name": "$userName",
                        "points": {
                            "$cond": {
                                if: {
                                    "$and": [{
                                        "$eq": ["$pointsDet.sportId", sportID]
                                    }, {
                                        "$eq": ["$pointsDet.eventName", eventName]
                                    }]
                                },
                                then: "$pointsDet.totalPoints",
                                else: "0"
                            }
                        }
                    }
                }/*, {
                    $match: {
                        "$or": [{
                            "eventNameSport": 1
                        }, {
                            "eventName": null
                        }]
                    }
                }*/, {
                    $group: {
                        "_id": "$points",
                        "det": {
                            "$push": {
                                userName: "$userName",
                                affiliationId: "$affiliationId",
                                userId: "$userId",
                                tempAffiliationId: "$tempAffiliationId",
                                "Affiliation ID": "$Affiliation ID",
                                "Name": "$Name"
                            }
                        }
                    }
                }])

                

                if (usersDet && usersDet.length && usersDet[0].det && usersDet[0].det.length) {
                    usersDet = usersDet.sort(function(a, b) {
                        return parseInt(b._id) - parseInt(a._id);
                    });
                }


                //   var groupByPointsUploaded = _.groupBy(usersDetUploaded, function(num){ return num.points; });
                //   var groupByPoints = _.groupBy(usersDet, function(num){ return num.points; });

                withRank = _.union(usersDetUploaded, usersDet);
                
                res = {
                    "data": withRank,
                    "concatenated": concatUserIds,
                    "message": "assigned rank"
                }

            } else {
                res = {
                    "data": 0,
                    "message": "cannot assign rank"
                }
            }

            return res
        } catch (e) {
            res = {
                "data": 0,
                "message": e
            }
            return res
        }
    }
})

Meteor.methods({
    "mergeArrayWithData": function(userDetail, concatenatedUserIds) {
        var res = {
            "data": 0,
            "message": "cannot create draws"
        }

        try {
            var gPlayerVec = computeBrackets(concatenatedUserIds.length)

            var algArr = show(gPlayerVec)
            var finares = merge(userDetail, algArr);

            var res = {
                "data": finares,
                "message": "create draws"
            }

            return res
        } catch (e) {
            res = {
                "data": 0,
                "message": e
            }
            return res
        }
    }
})

function shuffleArray(array, k, points) {
    
    var counter = array.length,
        temp, index;
        // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);
        array[index]['rank'] = parseInt(k + 1)
        array[index]['points'] = points
            // Decrease counter by 1
        counter--;
            // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
        k = k + 1
    }

    array = array.sort(function(a, b) {
        return parseInt(a.rank) - parseInt(b.rank);
    });
    var arryRet = {
        data: array,
        lengthRank: k
    }
    return arryRet;
}

function merge(userDetail, algArr) {
    var mergedArr = []
    var beforeMerge = []
    for (var k = 0; k < userDetail.length; k++) {
        if (userDetail[k]["_id"] == "fixed") {
            beforeMerge = userDetail[k]["det"]

            if (userDetail[k]["det"].length > 0)
                lengthRank = userDetail[k]["det"].length - 1
        }
        if (userDetail[k]["_id"] !== "fixed") {
            if (userDetail[k]["det"].length > 0) {
                var shuff = shuffleArray(userDetail[k]["det"], lengthRank, userDetail[k]["_id"])
                if (shuff.data) {
                    userDetail[k]["det"] = shuff.data
                }
                if (shuff.lengthRank != lengthRank) {
                    lengthRank = shuff.lengthRank
                }
                beforeMerge = beforeMerge.concat(userDetail[k]["det"])
            }
        }

    }

    if (algArr.length > 0) {
        for (var i = 0; i < algArr.length; i++) {
            var rank = algArr[i].rank;

            if (rank == 0) {
                mergedArr.push({
                    "slNo": i + 1,
                    "Name": "",
                    "Affiliation ID": "",
                    "affiliationId": "",
                    "Academy Name": "",
                    "Type": "Bye"
                })
            } else {

                var lengthRank = 0



                for (var x = 0; x < beforeMerge.length; x++) {
                    if (rank == parseInt(parseInt(beforeMerge[x].rank) + 1)) {
                        if (beforeMerge[x]["Affiliation ID"] == undefined) {
                            beforeMerge[x]["Affiliation ID"] = " ";
                        }

                        var acadename = ""
                        var userDetAcad = Meteor.users.findOne({
                            "userId":beforeMerge[x].userId
                        })

                        if(userDetAcad && userDetAcad.interestedProjectName && userDetAcad.interestedProjectName.length){
                            var dbtoret = playerDBFind(userDetAcad.interestedProjectName[0])
                            if (dbtoret == false) {
                                dbtoret = "userDetailsTT"
                            }
                            var userDetAcad2 = global[dbtoret].findOne({
                                userId:beforeMerge[x].userId
                            })
                            if(userDetAcad2 && userDetAcad2.affiliatedTo && userDetAcad2.affiliatedTo.toLowerCase() == "academy"
                                 && userDetAcad2.clubNameId){
                                var acadDet = academyDetails.findOne({
                                    userId:userDetAcad2.clubNameId
                                })
                                if(acadDet && acadDet.clubName){
                                    acadename = acadDet.clubName
                                }
                            }
                        }

                        beforeMerge[x]["Academy Name"] = acadename

                        var k = i
                        mergedArr.push({
                            "slNo": 1 + k,
                            "Name": beforeMerge[x]["Name"],
                            "Affiliation ID": beforeMerge[x]["Affiliation ID"],
                            "Academy Name": acadename,
                            "Match Number": i,
                            "points": beforeMerge[x].points,
                            "rank": beforeMerge[x].rank,
                            "Type": "notbye",
                            "affiliationId": beforeMerge[x]["Affiliation ID"],
                            "Points":beforeMerge[x].points
                        })
                        k = k + 1
                    }
                }
            }
        }

        return mergedArr
    }
}

function insert(lPlayerVec, playerCount) {
    var gPlayerVec = lPlayerVec;
    var curMax = 0;
    if (gPlayerVec.length % 2 == 0) {
        curMax = gPlayerVec.length / 2;
    } else {
        curMax = (gPlayerVec.length - 1) / 2;
    }
    var curMax_i = getIndexOf(gPlayerVec, curMax);
    if (curMax_i == -1) {
        return gPlayerVec;
    }

    // initialise 'next' variables
    var next = 0;
    next = curMax;
    var next_i = 0;

    // repeat for every new entries
    while (next < playerCount) {
        var nextPos = (gPlayerVec[curMax_i].mAt == TOP) ? BOTTOM : TOP;
        next = next + 1; // next Rank
        next_i = (nextPos == TOP) ? (curMax_i - 1) : (curMax_i + 1);

        gPlayerVec[next_i].mRank = next;
        gPlayerVec[next_i].mAt = nextPos; // set rank & position

        curMax--;
        curMax_i = getIndexOf(gPlayerVec, curMax);
        if (curMax_i == -1) {
            return gPlayerVec;
        }
    }
    return gPlayerVec;
}

function computeBrackets(numPlayers) {
    var gPlayerVec = [];
    while (gPlayerVec.length < numPlayers) {
        var lPlayerVec = splitVec(gPlayerVec);
        gPlayerVec = insert(lPlayerVec, numPlayers);
    }
    return gPlayerVec;
}

function getIndexOf(gPlayerVec, lRank) {
    for (var i = 0; i < gPlayerVec.length; i++) {
        if (gPlayerVec[i].mRank == lRank) {
            return i;
        }
    }
    return -1;
}

function splitVec(lPlayerVec) {
    var gPlayerVec = lPlayerVec;
    if (gPlayerVec.length == 0) {
        var p = {}; // {mRank: 1, mAt: TOP};
        p.mRank = 1;
        p.mAt = TOP;
        gPlayerVec.push(p);
        return gPlayerVec;
    } // set 'gPlayerVec' vector

    var LOOP_COUNT = gPlayerVec.length;
    // loop 'gPlayerVec'
    for (var i = 0, counter = 0; counter < LOOP_COUNT; i += 2, counter++) {
        if (i >= gPlayerVec.length) break;
        // if(gPlayerVec[i].mAt==TOP) insert at 'i+1' else at 'i-1'
        var p = {};
        p.mRank = 0;
        if (gPlayerVec[i].mAt == TOP) {
            p.mAt = BOTTOM;
            gPlayerVec.splice(i + 1, 0, p);
        } else {
            p.mAt = TOP;
            gPlayerVec.splice(i, 0, p);
        }
    }
    return gPlayerVec;
}

function show(gPlayerVec) {
    var algArr = []
    for (var i = 0; i < gPlayerVec.length; i++) {
        algArr.push({
            "position": i + 1,
            "rank": gPlayerVec[i].mRank
        })
    }
    return algArr
}