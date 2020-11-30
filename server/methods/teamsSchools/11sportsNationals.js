import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({
    "getTournamentTypesAndState": function() {
        var res = {
            status: "failure",
            message: "cannot get tournament types and states",
            data: [],
            statesList: []
        }
        try {
            if (true) {
                var getEventTypes = schoolEventsToFind.findOne({})
                if (getEventTypes && getEventTypes.tournamentTypes) {
                    if (true) {
                        var statesList = domains.find({}).fetch()
                        res.statesList = statesList
                        res.data = getEventTypes.tournamentTypes
                        res.message = "tournament types and states"
                        res.status = "success"
                    }
                } else {
                    res.message = "Empty tournament Types and states"
                }
            }
            return res
        } catch (e) {
            res.message = e
            return res
        }
    }
})

Meteor.methods({
    "getTournamentIdForGivenType": function(xData) {
        var res = {
            "status": "failure",
            "message": "cannot get tournament details"
        }
        try {
            if (xData) {
                if (xData.stateId) {
                    var checkState = domains.findOne({
                        "_id": xData.stateId
                    })
                    if (checkState) {
                        if (xData.eventOrganizer) {
                            if (xData.year) {
                                if (xData.tournamentType) {
                                    if (xData.uporPast) {
                                        if (xData.uporPast != 1 || xData.uporPast != 2 || xData.uporPast != 3) {
                                            var eveDet;
                                            var dbName = "events"
                                            if (xData.uporPast == 1) {
                                                dbName = "events"
                                            } else if (xData.uporPast == 2) {
                                                dbName = "pastEvents"
                                            }



                                            eveDet = global[dbName].findOne({
                                                eventOrganizer: xData.eventOrganizer,
                                                tournamentType: xData.tournamentType,
                                                domainId: xData.stateId,
                                                tournamentEvent: true,
                                                "eventEndDate1": getYearsQuery(xData.year)
                                            })

                                            if (xData.uporPast == 3) {

                                                eveDet = events.findOne({
                                                    eventOrganizer: xData.eventOrganizer,
                                                    tournamentType: xData.tournamentType,
                                                    domainId: xData.stateId,
                                                    tournamentEvent: true,
                                                    "eventEndDate1": getYearsQuery(xData.year)
                                                });

                                                if (eveDet == undefined || eveDet == null) {
                                                    eveDet = pastEvents.findOne({
                                                        eventOrganizer: xData.eventOrganizer,
                                                        tournamentType: xData.tournamentType,
                                                        domainId: xData.stateId,
                                                        tournamentEvent: true,
                                                        "eventEndDate1": getYearsQuery(xData.year)
                                                    })
                                                }

                                            }

                                            if (eveDet) {
                                                res.status = "success"
                                                res.data = eveDet
                                                res.message = "tournament details"
                                            } else {
                                                res.message = "no tournament details"
                                            }

                                        } else {
                                            res.message = " uporPast should be 1 or 2 or 3"
                                        }
                                    } else {
                                        res.message = "uporPast is required"
                                    }
                                } else {
                                    res.message = "tournamentType is required"
                                }
                            } else {
                                res.message = "year is required"
                            }
                        } else {
                            res.message = "eventOrganizer is required"
                        }
                    } else {
                        res.message = "state is Invalid"
                    }
                } else {
                    res.message = "state Id is required"
                }
            } else {
                res.message = "null parameters"
            }
            return res
        } catch (e) {
            res.message = e
            return res
        }
    }
})

Meteor.methods({
    "getAllSchoolDetails": function() {
        var res = {
            status: "failure",
            message: "cannot get schoolDetails",
            data: []
        }
        try {
            var schoolDet = schoolDetails.find({

            }).fetch()
            if (schoolDet && schoolDet.length) {
                res.data = schoolDet
                res.status = "success"
            }
            return res
        } catch (e) {
            res.message = e
            return res
        }
    }
})



Meteor.methods({
    "getWinnersListFromFinals": async function(xData) {

        var res = {
            status: "failure",
            message: "No Winners"
        }
        /*xData = {
            "eventOrganizer": "RCLSqzrDpFfsRwjY8",
            "eventName": "JG",
            "year": "2018",
            "tournamentType": "NITTC-State-2018",
            "teamFormatId": "3HJs3eXdRaf7aNt5p",
            "stateId": "8va5A8N3EKAeKtmeB"
        }*/
        /*{"eventOrganizer":"RCLSqzrDpFfsRwjY8","eventName":"11Even Sub Junior Boy's Team","year":"2018","tournamentType":"NITTC-State-2018","teamFormatId":"3HJs3eXdRaf7aNt5p","stateId":"8va5A8N3EKAeKtmeB"}*/
        
        try {
            if (xData) {
                if (typeof xData == "string") {
                    xData = xData.replace("\\", "");
                    xData = JSON.parse(xData);
                }
                if(xData.tournamentId){
                    xData.tournId = xData.tournamentId
                    if(xData.year){
                        if (xData.eventOrganizer) {

                            if(xData.loggedInId){
                                var schoolDet = schoolDetails.findOne({"userId":xData.loggedInId})

                                if(schoolDet){

                                    if (xData.stateId) {
                                        var stateCheck = domains.findOne({
                                            "_id": xData.stateId
                                        })
                                        if (stateCheck) {
                                            if (xData.eventName) {

                                                var tournIDDet = events.findOne({
                                                    "tournamentId":xData.tournId,
                                                    "abbName":xData.eventName,
                                                    "eventOrganizer":xData.eventOrganizer
                                                })

                                                if(tournIDDet){
                                                    if (xData.teamFormatId) {
                                                        if (xData.tournamentType) {
                                                            var query = {
                                                                "eventOrganizer": xData.eventOrganizer,
                                                                "eventEndDate1": getYearsQuery(xData.year),
                                                                "abbName": xData.eventName,
                                                                "domainId": xData.stateId,
                                                                "tournamentType":xData.tournamentType
                                                            }
                                                            if (true) {

                                                                var eveDet = events.findOne(query)
                                                                if (eveDet == undefined || eveDet == null) {
                                                                    eveDet = pastEvents.findOne(query)
                                                                }

                                                                if (eveDet && eveDet.projectType) {
                                                                    var matcDb = ""
                                                                    var tmatchDB = ""

                                                                    var schoolEventDet = schoolEventsToFind.findOne({
                                                                        "key": "School"
                                                                    });
                                                                    if (schoolEventDet && schoolEventDet.individualEventNAME && schoolEventDet.teamEventNAME) {
                                                                        eventNAMES = schoolEventDet.individualEventNAME;
                                                                        teamEventNAMES = schoolEventDet.teamEventNAME;
                                                                    
                                                                        var teamFormatName = ""
                                                                        if(eveDet.projectType==1){
                                                                            teamFormatName = teamEventNAMES[eventNAMES.indexOf(xData.eventName)]
                                                                        }else if(eveDet.projectType==2){
                                                                            teamFormatName = xData.eventName
                                                                        }

                                                                        if(teamFormatName){
                                                                            var checkTeamFormat = teamsFormat.findOne({
                                                                                "_id":xData.teamFormatId,
                                                                                "teamFormatName":teamFormatName
                                                                            })

                                                                            if(checkTeamFormat){


                                                                                var checkForSchoolTeam = schoolTeams.findOne({
                                                                                    "schoolId":schoolDet.userId,
                                                                                    tournamentId:xData.tournId,
                                                                                    teamFormatId:xData.teamFormatId
                                                                                })

                                                                                if(eveDet.projectType && checkForSchoolTeam && checkForSchoolTeam.teamMembers.length && 
                                                                                    checkForSchoolTeam.teamName && checkForSchoolTeam._id){
                                                                                    //get details from school teams
                                                                                    var cData = {
                                                                                        "projectType" : eveDet.projectType,
                                                                                        "tournamentId": xData.tournId,
                                                                                        "teamFormatId": xData.teamFormatId
                                                                                    }
                                                                                    var getSubsList = await Meteor.call("getPlayersFromSchoolTeams",cData,eveDet)

                                                                                    if(getSubsList && getSubsList.status=="success"){
                                                                                        return getSubsList
                                                                                    }
                                                                                    else if(getSubsList && getSubsList.status =="failure"){
                                                                                        xData.teamName = checkForSchoolTeam.teamName
                                                                                        xData.teamId = checkForSchoolTeam._id
                                                                                        var getFinalList = await Meteor.call("getFinalWinnersOnly",eveDet,xData)
                     
                                                                                        return getFinalList
                                                                                    }
                                                                                }
                                                                                else{
                                                                                    xData.teamName = ""
                                                                                    xData.teamId = ""
                                                                                    
                                                                                    if(eveDet.projectType==2){
                                                                                        var nameOfSing = eventNAMES[teamEventNAMES.indexOf(xData.eventName)]

                                                                                        var getAbbName = events.findOne({
                                                                                            tournamentId:eveDet.tournamentId,
                                                                                            abbName:eventNAMES[teamEventNAMES.indexOf(xData.eventName)]
                                                                                        })

                                                                                        if(getAbbName==undefined||getAbbName==null){
                                                                                            getAbbName = pastEvents.findOne({
                                                                                                tournamentId:eveDet.tournamentId,
                                                                                                abbName:eventNAMES[teamEventNAMES.indexOf(xData.eventName)]
                                                                                            })
                                                                                        }

                                                                                        if(getAbbName && getAbbName.eventName){
                                                                                            xData.eventNameOfSing = getAbbName.eventName
                                                                                        }
                                                                                    }
                                                                                    var getFinalList = await Meteor.call("getFinalWinnersOnly",eveDet,xData)
                                                                                    return getFinalList
                                                                                }
                                                                            }else{
                                                                                res.message = "event name and teamFormatName cannot be different"
                                                                            }
                                                                        } else{
                                                                            res.message = "teamFormatName is invalid"
                                                                        }
                                                                    }else{
                                                                        res.message = "schoolEvent details are invalid"
                                                                    }
                                                                } else {
                                                                    res.message = "invalid event details"
                                                                }
                                                            }
                                                        } else {
                                                            res.message = "tournamentType is required"
                                                        }
                                                    } else {
                                                        res.message = "teamFormatId is required"
                                                    }
                                                }else{
                                                    res.message = "The event "+xData.eventName+" has not yet annonced for this tournament"
                                                }
                                            } else {
                                                res.message = "eventName is required"
                                            }
                                        } else {
                                            res.message = "state is invalid"
                                        }
                                    } else {
                                        res.message = "state Id is required"
                                    }
                                }else{
                                    res.message = "invalid school details"
                                }
                            }else{
                                res.message = "loggedIn user id is required"
                            }
                        } else {
                            res.message = "eventOrganizer is required"
                        }
                    } else{
                        res.message = "year is required"
                    }  
                }else{
                    res.message = "tournamentId is required"
                }
            } else {
                res.message = "parameters are null"
            }

            return res
        } catch (e) {
            res.message = e
            return res
        }
    }
})


Meteor.methods({
    "getPlayersFromSchoolTeams": function(xData,eveDet) {
        var res = {
            status: "failure",
            message: "no individual or team event subscribers"
        }
        try {
            //fetch first 
            //compare with match coll
            //check equal playerids
            //check any players new
            //check any players exist
            //if new add to teammebers array
            var query = {}

            if (xData.projectType && xData.teamFormatId && xData.tournamentId) {
                if (xData.projectType == 1) {
                    query = {
                        "teamMembers.individualEvent": true
                    }
                    res.message = "no individual event subscribers"
                } else if (xData.projectType == 2) {
                    query = {
                        "teamMembers.teamEvent": true
                    }
                    res.message = "no team event subscribers"
                }

                var matcDb = schoolTeams.aggregate(
                    [{
                        $match: {
                            "tournamentId": xData.tournamentId,
                            "teamFormatId": xData.teamFormatId
                        }
                    }, {
                        $unwind: {
                            "path": "$teamMembers"
                        }
                    }, {
                        $match: query
                    }, {
                        $lookup: {
                            from: "schoolPlayers",
                            localField: "teamMembers.playerId",
                            // name of users table field,
                            foreignField: "userId",
                            as: "userDet" // alias for userinfo table
                        }
                    }, {
                        $unwind: "$userDet"
                    }, {
                        $addFields: {
                            "teamDetails.playerName": "$userDet.userName",
                            "teamDetails.playerClass": "$userDet.class",
                            "teamDetails.playerDateOfBirth": "$userDet.dateOfBirth",
                            "teamDetails.schoolId": "$userDet.schoolId",
                            "teamDetails.playerNumber": "$teamMembers.playerNumber",
                            "teamDetails.playerId": "$teamMembers.playerId",
                            "teamDetails.teamEvent": "$teamMembers.teamEvent",
                            "teamDetails.individualEvent": "$teamMembers.individualEvent",
                        }
                    }, {
                        $project: {
                            "teamDetails": "$teamDetails",
                            "teamFormatId": "$teamFormatId"
                        }
                    }, {
                        $group: {
                            "_id": {
                                "teamFormatId": "$teamFormatId"
                            },
                            teamDetails: {
                                "$push": "$teamDetails"
                            },

                        }
                    }, {
                        $project: {
                            "_id": "",
                            "teamDetails": "$teamDetails"
                        }
                    }, {
                        $addFields: {
                            "teamId": xData.teamId,
                            "teamName": xData.teamName,
                            "teamFormatId": xData.teamFormatId
                        }
                    }]
                )
                if (matcDb && matcDb.length) {
                    if (matcDb && matcDb[0].teamDetails.length) {
                        if (matcDb[0].teamDetails[0].schoolId) {
                            var getSchoolDet = schoolDetails.findOne({
                                "userId": matcDb[0].teamDetails[0].schoolId
                            },{
                                "fields":{
                                    "playerId":0
                                }
                            })
                            if (getSchoolDet) {
                                res.schoolData = getSchoolDet
                            } else {
                                res.schoolData = []
                            }

                            var teamdet = schoolTeams.findOne({
                                "schoolId": matcDb[0].teamDetails[0].schoolId,
                                "tournamentId": eveDet.tournamentId,
                                "teamFormatId": eveDet.teamFormatId
                            },{
                                "fields":{
                                    "teamName":1
                                }
                            })
                            if (teamdet) {
                                res.teamData = teamdet
                            } else {
                                res.teamData = []
                            }
                        }
                    }

                    res.message = "subscribed players list"
                    res.data = matcDb
                    res.status = "success"
                    res.dataFromSchoolTeams = true
                }
            } else {
                res.message = "error with parameters"
            }
            return res
        } catch (e) {
            res.message = e
            return res
        }

    }
})


Meteor.methods({
    "getFinalWinnersOnly": function(eveDet, xData) {
        var res = {
            status: "failure",
            message: "No Final Winners"
        }
        try {
            if (eveDet.projectType) {
                if (eveDet.projectType == 1) {
                    matcDb = MatchCollectionDB.aggregate(
                        [{
                            $match: {
                                "tournamentId": eveDet.tournamentId,
                                "eventName": eveDet.eventName
                            }
                        }, {
                            "$unwind": {
                                path: "$matchRecords"
                            }
                        }, {
                            $match: {
                                "matchRecords.roundName": "F"
                            }
                        }, {
                            $lookup: {
                                from: "schoolPlayers",
                                localField: "matchRecords.winnerID",
                                // name of users table field,
                                foreignField: "userId",
                                as: "teamDetails" // alias for userinfo table
                            }
                        }, {
                            "$unwind": {
                                path: "$teamDetails"
                            }
                        }, {
                            $addFields: {
                                "teamDetails.playerName": "$teamDetails.userName",
                                "teamDetails.playerId": "$teamDetails.userId",
                                "teamDetails.playerDateOfBirth": "$teamDetails.dateOfBirth",
                                "teamDetails.playerClass": "$teamDetails.class",
                                "teamDetails.schoolId": "$teamDetails.schoolId"
                            }
                        }, {
                            $project: {
                                "teamDetails": "$teamDetails"
                            }
                        }, {
                            $group: {
                                "_id": null,
                                teamDetails: {
                                    "$push": "$teamDetails"
                                }
                            }
                        }, {
                            $project: {
                                "teamId": "",
                                "teamName": "",
                                'teamDetails': {
                                    '$map': {
                                        'input': '$teamDetails',
                                        'as': 'teamDetails',
                                        'in': {
                                            "onlyIndividual":true,
                                            "teamEvent": false,
                                            "individualEvent": true,
                                            "playerName": "$$teamDetails.userName",
                                            "playerId": "$$teamDetails.userId",
                                            "playerDateOfBirth": "$$teamDetails.dateOfBirth",
                                            "playerClass": "$$teamDetails.class",
                                            "schoolId": "$$teamDetails.schoolId"
                                        }
                                    }
                                }
                            }
                        }, {
                            $addFields: {
                                "teamFormatId": xData.teamFormatId
                            }
                        }]
                    )

                }
                if (eveDet.projectType == 2) {

                    matcDb = teamMatchCollectionDB.aggregate([{
                        $match: {
                            "tournamentId": eveDet.tournamentId,
                            "eventName": eveDet.eventName
                        }
                    }, {
                        "$unwind": {
                            path: "$matchRecords"
                        }
                    }, {
                        $match: {
                            "matchRecords.roundName": "F"
                        }
                    }, {
                        $lookup: {
                            from: "schoolTeams",
                            localField: "matchRecords.winnerID",
                            // name of users table field,
                            foreignField: "_id",
                            as: "teamDetails" // alias for userinfo table
                        }
                    }, {
                        $unwind: "$teamDetails"
                    }, {
                        $project: {
                            "_id": "$_id",
                            "teamDetails": "$teamDetails.teamMembers"
                        }
                    }, {
                        $unwind: "$teamDetails"
                    }, {
                        $lookup: {
                            from: "schoolPlayers",
                            localField: "teamDetails.playerId",
                            // name of users table field,
                            foreignField: "userId",
                            as: "userDet" // alias for userinfo table
                        }
                    }, {
                        $unwind: "$userDet"
                    }, {
                        $addFields: {
                            "teamDetails.playerName": "$userDet.userName",
                            "teamDetails.playerClass": "$userDet.class",
                            "teamDetails.playerDateOfBirth": "$userDet.dateOfBirth",
                            "teamDetails.schoolId": "$userDet.schoolId",
                            "teamDetails.teamEvent": true,
                            "teamDetails.individualEvent": false,
                            "teamDetails.onlyIndividual":false
                        }
                    }, {
                        $project: {
                            "teamDetails": "$teamDetails",
                        }
                    }, {
                        $group: {
                            "_id": "$schoolId",
                            teamDetails: {
                                "$push": "$teamDetails"
                            }
                        }
                    }, {
                        $addFields: {
                            "teamId": xData.teamId,
                            "teamName": xData.teamName,
                            "teamFormatId": xData.teamFormatId
                        }
                    }])
                }
                if (matcDb && matcDb.length) {
                    if (matcDb[0] && matcDb[0].teamDetails.length) {
                        if (matcDb[0].teamDetails[0].schoolId) {
                            var getSchoolDet = schoolDetails.findOne({
                                "userId": matcDb[0].teamDetails[0].schoolId
                            },{
                                "fields":{
                                    "playerId":0
                                }
                            })
                            if (getSchoolDet) {
                                res.schoolData = getSchoolDet
                            } else {
                                res.schoolData = []
                            }

                            var teamdet = schoolTeams.findOne({
                                "schoolId": matcDb[0].teamDetails[0].schoolId,
                                "tournamentId": eveDet.tournamentId,
                                "teamFormatId": xData.teamFormatId
                            },{
                                "fields":{
                                    "teamName":1
                                }
                            })
                            if (teamdet) {
                                res.teamData = teamdet
                            } else {
                                res.teamData = []
                            }

                            var index = 1
                            if(eveDet.projectType == 1){
                                var userid = matcDb[0].teamDetails[0].playerId
                                var getNum = schoolTeams.aggregate([{
                                    $match: {
                                        "schoolId": matcDb[0].teamDetails[0].schoolId,
                                        "tournamentId": eveDet.tournamentId,
                                        "teamFormatId": xData.teamFormatId
                                    }
                                }, {
                                    $unwind: {
                                        path: "$teamMembers"
                                    }
                                }, {
                                    $match: {
                                        "teamMembers.playerId": userid
                                    }
                                }, {
                                    $project: {
                                        "playerNumber": "$teamMembers.playerNumber"
                                    }
                                }])
                                if(getNum && getNum.length){
                                    if(getNum[0].playerNumber){
                                        matcDb[0].teamDetails[0].playerNumber = "p1"
                                    }
                                }
                            }
                            else if(eveDet.projectType == 2){

                                var playNumForSinglesId = ""
                                if(xData.eventNameOfSing){
                                    var findTeamOf = MatchCollectionDB.aggregate(
                                        [{
                                            $match: {
                                                "tournamentId": eveDet.tournamentId,
                                                "eventName":xData.eventNameOfSing
                                            }
                                        }, {
                                            "$unwind": {
                                                path: "$matchRecords"
                                            }
                                        }, {
                                            $match: {
                                                "matchRecords.roundName": "F"
                                            }
                                        },{
                                            $project:{
                                                "winnerID":"$matchRecords.winnerID"
                                            }
                                        }
                                        ])
                                    if(findTeamOf && findTeamOf.length && findTeamOf[0].winnerID){
                                        playNumForSinglesId = findTeamOf[0].winnerID
                                    }
                                }

                                for(var jk=0;jk<matcDb[0].teamDetails.length;jk++){
                                    if(playNumForSinglesId && playNumForSinglesId== matcDb[0].teamDetails[jk].playerId){
                                        matcDb[0].teamDetails[jk].playerNumber = "p1"
                                    }
                                    else{
                                        index = index + 1
                                        matcDb[0].teamDetails[jk].playerNumber = "p"+index
                                    }
                                }
                            }
                        }
                    }
                    res.message = "final players list"
                    res.data = matcDb
                    res.status = "success"
                    res.dataFromSchoolTeams = false
                }
            } else {
                res.message = "invalid project type"
            }
            return res
        } catch (e) {
            res.message = e
            return res
        }
    }
})

Meteor.methods({
    "deleteSelectedTeamOrInd":function(xData){
        var res = {
            status:"failure",
            message:"could not delete team or individual subscription"
        }
        try{
            if(xData){
                //required tournamentId, eventName, teamId 
                //required playerId incase of individual event
                //required loggedinid 
                if(xData.tournamentId){
                    if(xData.eventName){
                        if(xData.teamId){
                            if(true){
                                if(xData.eventOrganizer){
                                    var query = {
                                        "tournamentId": xData.tournamentId,
                                        "eventOrganizer": xData.eventOrganizer,
                                        "abbName": xData.eventName,
                                    }
                                    var eveDet = events.findOne(query)
                                    if(eveDet==undefined || eveDet==null){
                                        eveDet = pastEvents.findOne(query)
                                        if(eveDet){
                                            res.message = "cannot delete subscribers from past events"
                                            return res
                                        }
                                    }
                                    if(eveDet && eveDet.eventSubscriptionLastDate1){
                                        if (moment(moment(eveDet.eventSubscriptionLastDate1).format("YYYY-MM-DD")) >= moment(moment.tz(eveDet.timeZoneName).format("YYYY-MM-DD"))) {
                                            var checkForTeam = schoolTeams.findOne({
                                                "_id":xData.teamId,
                                                "schoolId":xData.schoolId
                                            })
                                            if(checkForTeam){
                                                if(eveDet.projectType){
                                                    if(eveDet.projectType==1){
                                                        //check if player has subscribed to team event
                                                        //if player has subscribed to team event change only boolean value of individula event
                                                        //else remove from the array
                                                        //delete from event participants
                                                        //delete from player entries
                                                        if(xData.playerId){
                                                            var checkPlayerDet = Meteor.users.findOne({
                                                                "userId":xData.playerId
                                                            })
                                                            if(checkPlayerDet){
                                                                var checkSchoolPlayer = schoolPlayers.findOne({
                                                                    "userId":xData.playerId,
                                                                    "schoolId":xData.schoolId
                                                                })
                                                                if(checkSchoolPlayer){
                                                                    //to check manager
                                                                    //required schoolId,teamId,playerId

                                                                    var dataForNextAPI = xData

                                                                    //1upd
                                                                    /*var updateFromeveParts = events.update(query,{
                                                                        $pull:{
                                                                            eventParticipants:xData.playerId
                                                                        }
                                                                    })
                                                                    if(updateFromeveParts){
                                                                        var checkTeamSub = schoolTeams.aggregate([
                                                                            {
                                                                                $match:{
                                                                                    "_id":xData.teamId,
                                                                                    "schoolId":xData.schoolId
                                                                                }
                                                                            },{
                                                                                $unwind:{
                                                                                    "path":"$teamMembers"
                                                                                }
                                                                            },{
                                                                                $match:{
                                                                                    "teamMembers.playerId":xData.playerId
                                                                                }
                                                                            },{
                                                                                $project:{
                                                                                        "teamMembers":"$teamMembers"
                                                                                }
                                                                            }
                                                                        ])

                                                                        if(checkTeamSub && checkTeamSub.length && checkTeamSub[0].teamMembers && 
                                                                            (checkTeamSub[0].teamMembers.individualEvent !=undefined ||
                                                                             checkTeamSub[0].teamMembers.individualEvent !=null) && (checkTeamSub[0].teamMembers.teamEvent !=undefined ||
                                                                             checkTeamSub[0].teamMembers.teamEvent !=null)){
                                                                            //2upd
                                                                            var removefirst = schoolTeams.update({
                                                                                "_id": xData.teamId
                                                                            }, {
                                                                                $pull: {
                                                                                    teamMembers: checkTeamSub[0].teamMembers
                                                                                }
                                                                            })
                                                                            var updateNext = true

                                                                            if(removefirst && checkTeamSub[0].teamMembers.teamEvent==true){
                                                                                //change to false
                                                                                checkTeamSub[0].teamMembers.individualEvent = false
                                                                                updateNext = schoolTeams.update({
                                                                                    "_id": xData.teamId
                                                                                }, {
                                                                                    $addToSet: {
                                                                                        teamMembers: checkTeamSub[0].teamMembers
                                                                                    }
                                                                                })
                                                                              //  var updateTeamManager = 
                                                                            }

                                                                            if(updateNext){
                                                                                var findEnt  = schoolPlayerEntries.findOne({
                                                                                    playerId:xData.playerId,
                                                                                    tournamentId:xData.tournamentId
                                                                                })
                                                                                if(findEnt){
                                                                                    //3upd
                                                                                    var removeFromPlayerEnt = schoolPlayerEntries.remove({
                                                                                        playerId:xData.playerId,
                                                                                        tournamentId:xData.tournamentId
                                                                                    })
                                                                                    if(removeFromPlayerEnt){
                                                                                        //4upd
                                                                                        var removeFromSchoolDet = schoolDetails.update({
                                                                                            "userId": xData.schoolID
                                                                                        }, {
                                                                                            $pull: {
                                                                                                "playerId": {
                                                                                                    "studentID": xData.playerId
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                        if(removeFromSchoolDet){
                                                                                            res.message = "Deleted"
                                                                                            res.status = "success"
                                                                                        }else{

                                                                                            //2upd
                                                                                            schoolTeams.update({
                                                                                                "_id": xData.teamId
                                                                                            }, {
                                                                                                $addToSet: {
                                                                                                    teamMembers: checkTeamSub[0].teamMembers
                                                                                                }
                                                                                            })

                                                                                            //1upd
                                                                                            var updateAgain = events.update(query,{
                                                                                                $addToSet:{
                                                                                                    eventParticipants:xData.playerId
                                                                                                }
                                                                                            })

                                                                                            //3upd 
                                                                                            var addAgaind = schoolPlayerEntries.insert(findEnt)

                                                                                            //4upd
                                                                                            var addAgainSch = schoolDetails.update({
                                                                                                "userId": xData.schoolID
                                                                                            }, {
                                                                                                $push: {
                                                                                                    "playerId": {
                                                                                                        "studentID": xData.playerId,
                                                                                                        "class":checkSchoolPlayer.class
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                            
                                                                                            res.message = "Invalid player subscription"
                                                                                        }
                                                                                    }else{
                                                                                        //2upd
                                                                                        schoolTeams.update({
                                                                                            "_id": xData.teamId
                                                                                        }, {
                                                                                            $addToSet: {
                                                                                                teamMembers: checkTeamSub[0].teamMembers
                                                                                            }
                                                                                        })
                                                                                        //1upd
                                                                                        var updateAgain = events.update(query,{
                                                                                            $addToSet:{
                                                                                                eventParticipants:xData.playerId
                                                                                            }
                                                                                        })
                                                                                        //3upd 
                                                                                        var addAgaind = schoolPlayerEntries.insert(findEnt)
                                                                                        res.message = "Invalid player subscription"
                                                                                    }
                                                                                }else{
                                                                                    //1upd
                                                                                    var updateAgain = events.update(query,{
                                                                                        $addToSet:{
                                                                                            eventParticipants:xData.playerId
                                                                                        }
                                                                                    })
                                                                                    //2upd
                                                                                    updateNext = schoolTeams.update({
                                                                                        "_id": xData.teamId
                                                                                    }, {
                                                                                        $addToSet: {
                                                                                            teamMembers: checkTeamSub[0].teamMembers
                                                                                        }
                                                                                    })

                                                                                    res.message = "Invalid player subscription"
                                                                                }
                                                                            }
                                                                            else{
                                                                                //1upd
                                                                                var updateAgain = events.update(query,{
                                                                                    $addToSet:{
                                                                                        eventParticipants:xData.playerId
                                                                                    }
                                                                                })
                                                                                //2upd
                                                                                var removefirst = schoolTeams.update({
                                                                                    "_id": xData.teamId
                                                                                }, {
                                                                                    $pull: {
                                                                                        teamMembers: checkTeamSub[0].teamMembers
                                                                                    }
                                                                                })
                                                                            }
                                                                        }else{
                                                                            //1upd
                                                                            var updateAgain = events.update(query,{
                                                                                $addToSet:{
                                                                                    eventParticipants:xData.playerId
                                                                                }
                                                                            })
                                                                            res.message = "Invalid player subscription"
                                                                        }
                                                                    }*/
                                                                }else{
                                                                    res.message = "Invalid player details"
                                                                }
                                                            }else{
                                                                res.message = "Invalid player id"
                                                            }
                                                        }else{
                                                            res.message = "playerId is required"
                                                        }
                                                    }else if(eveDet.projectType==2){
                                                        //check if player has subscribed to team event
                                                        //if player has subscribed to team event change only boolean value of individula event
                                                        //else remove from the array
                                                        //delete from event participants
                                                        //delete from player entries
                                                    }
                                                }else{
                                                    res.message = "Invalid event details"
                                                }
                                            }else{
                                                res.message = "Invalid team id"
                                            }
                                        }
                                        else {
                                            res.message = "Cannot delete, Entry closed for given tournament"
                                        }
                                    }else{
                                        res.message = "Invalid event details"
                                    }
                                }else{
                                    res.message = "eventOrganizer is required"
                                }
                            }
                        }else{
                            res.message = "teamId is required"
                        }
                    }else{
                        res.message = "eventName is required"
                    }
                }else{
                    res.message = "tournamentId is required"
                }
            }else{
                res.message = "required all parameters"
            }
            return res
        }catch(e){
            res.message = e
            return res
        }
    }
})


Meteor.methods({
    "updateEntriesCases":function(xData,cases){
        var res = {
            message:"Cannot delete from team or individual event"
        }
        try{
            if(cases==1){
                if(xData.teamEvent==false && xData.individualEvent==true){
                    var checkManBool = checkForManager(xData)
                    if(checkManBool){
                        var setTeamMan = teamManUpdate(xData)
                        if(setTeamMan && setTeamMan.teamFormatId && setTeamMan.teamManager){
                            if(setTeamMan.teamFormatId == "0" && setTeamMan.teamId == "0"){
                                //delete team
                                //remove entries
                                //pull participants
                                var s = teamDelete(xData)
                                var s1 = removeEveParts(xData,query)
                                var s2 = playerEntRemove(xData)
                            }

                            else if(setTeamMan && setTeamMan.teamFormatId != "1" && setTeamMan.teamManager ==
                                "1"){
                                //pull eveparts from team event
                                //teamentries remove
                                //pull from single events
                                //remove entries
                                //pull from team

                                var s1 = removeEveParts(xData,query)
                                var s2 = playerEntRemove(xData)
                                var s3 = deleteFromTeam(xData,"individualEvent")
                            }

                            else if(setTeamMan && setTeamMan.teamFormatId != "1" && setTeamMan.teamManager !=
                                "1"){
                                //pull from teamformat eveparts
                                //update team participants
                                //remove team entries
                                //insert new team entries
                                xData.teamManager = setTeamMan.teamManager
                                xData.teamFormatId = setTeamMan.teamFormatId
                                
                                var s4 = playerTeamEntRemove(xData)
                                var s5 = removeEveParts(xData,query)
                                var s6 = playerEntRemove(xData)

                                //pull from single events
                                //remove ind entries
                                //pull from team
                                var s1 = removeEveParts(xData,query)
                                var s2 = playerEntRemove(xData)
                                var s3 = booleanUpdate(xData,"individualEvent")
                            }

                        }
                    }else{

                    }
                }
                else if(xData.teamEvent==true && xData.individualEvent==true){

                }
            }
            else if(cases==2){
                if(xData.teamEvent==true && xData.individualEvent==false){

                }
                else if(xData.teamEvent==true && xData.individualEvent==true){

                }
            }
        }catch(e){
            res.message = e
            return res
        }
    }
})

//required playerId
//with query eventName
var removeEveParts = function(xData,query){
    try{
        var toRet = false
        var eveDet = events.update(query,{
            $pull:{
                eventParticipants:xData.playerId
            }
        })
        if(eveDet){
            toRet = true
        }
        return toRet
    }catch(e){
        return false
    }
}

//playerId
var updateEveParts = function(xData,query){
    try{
        var toRet = false
        var eveDet = events.update(query,{
            $push:{
                eventParticipants:xData.playerId
            }
        })
        if(eveDet){
            return true
        }
    }catch(e){
        return false
    }
}

//required teamId,schoolId,playerId
var teamManUpdate = function(xData){
    var data = {
        "teamFormatId":"1",
        "teamManager":"1"
    }
    try{
        var findSclDEt = schoolTeams.aggregate([{
            $match: {
                "_id": xData.teamId,
                "schoolId": xData.schoolId
            }
        }, {
            $unwind: {
                "path": "$teamMembers"
            }
        }, {
            $match: {
                "teamMembers.playerId": {
                    $ne: xData.playerId
                }
            }
        }, {
            $project: {
                "teamFormatId":"$teamFormatId",
                "teamMembers": "$teamMembers"
            }
        }])

        if(findSclDEt && findSclDEt.length){
            for(var i=0; i<findSclDEt.length;i++){
                if(findSclDEt[i].teamMembers.teamEvent){

                    //set next team member with teamEvent value true
                    //as teamManager
                    var updateTeamManager = schoolTeams.update({
                        "_id": xData.teamId,
                        "schoolId": xData.schoolId
                    },{
                        $set:{
                            teamManager:findSclDEt[i].teamMembers.playerId
                        }
                    })
                    if(updateTeamManager){
                        data["teamFormatId"] = findSclDEt[i].teamFormatId
                        data["teamManager"] = findSclDEt[i].teamMembers.playerId
                        break;
                    }
                }
            }

            if(data && data.teamManager && data.teamFormatId 
                && data.teamManager != "1" && data.teamFormatId != "1"){
                return data
            }
            else if(data && data.teamManager == "1" && data.teamFormatId == "1"){

                var findTeamFormt = schoolTeams.findOne({
                    "_id": xData.teamId,
                    "schoolId": xData.schoolId
                })

                if(findTeamFormt && findTeamFormt.teamFormatId){
                    data["teamFormatId"] = findTeamFormt.teamFormatId

                    //if there are no team members with teamEvent boolean true
                    //set manager to 1
                    var updateTeamManager = schoolTeams.update({
                        "_id": xData.teamId,
                        "schoolId": xData.schoolId
                    },{
                        $set:{
                            teamManager:"1"
                        }
                    })
                }

                return data
            }
        }else{
            //if there are no players other than given playerId
            //for delete
            data["teamFormatId"] = "0"
            data["teamManager"] = "0"
            return data
        }

    }catch(e){
        return false
    }
}

//required teamId, schoolId, playerId
var booleanUpdate = function(xData,boolv,type){
    try{
        var sclTeam = schoolTeams.aggregate(
            [
                {
                    $match:{
                        "_id": xData.teamId,
                        "schoolId": xData.schoolId
                    }
                },{
                    $unwind:{
                        "path":"$teamMembers"
                    }
                },{
                    $match:{
                        "playerId":xData.playerId
                    }
                },{
                    $project:{
                        "teamMembers":"$teamMembers"
                    }
                }
            ])
            if(sclTeam && sclTeam.length && sclTeam[0] 
                && sclTeam[0].teamMembers && sclTeam[0].teamMembers[type]){
                var pullDateBool = schoolTeams.update({
                     "_id": xData.teamId,
                    "schoolId": xData.schoolId
                },{
                    $pull:{
                        teamMembers:sclTeam[0].teamMembers
                    }
                })
                if(pullDateBool){
                    sclTeam[0].teamMembers[type] = boolv

                    var upDateBool = schoolTeams.update({
                         "_id": xData.teamId,
                        "schoolId": xData.schoolId
                    },{
                        $addToSet:{
                            teamMembers:sclTeam[0].teamMembers
                        }
                    })

                    if(upDateBool){
                        return true
                    }

                }else{
                    return false
                }
            }else{
                return false
            }
        
    }catch(e){
        return false
    }
}

//required teamId,schoolId,playerId
var deleteFromTeam = function(xData,type){
    try{    
        var sclTeam = schoolTeams.aggregate(
            [
                {
                    $match:{
                        "_id": xData.teamId,
                        "schoolId": xData.schoolId
                    }
                },{
                    $unwind:{
                        "path":"$teamMembers"
                    }
                },{
                    $match:{
                        "playerId":xData.playerId
                    }
                },{
                    $project:{
                        "teamMembers":"$teamMembers"
                    }
                }
            ]
        )

        if(sclTeam && sclTeam.length && sclTeam[0] 
                && sclTeam[0].teamMembers && sclTeam[0].teamMembers[type]){
                var pullDateBool = schoolTeams.update({
                    "_id": xData.teamId,
                    "schoolId": xData.schoolId
                },{
                    $pull:{
                        teamMembers:sclTeam[0].teamMembers
                    }
                })

                if(pullDateBool){
                    return true
                }else{
                    return false
                }

            }else{
                return false
            }
    }catch(e){
        return false
    }
}

//required playerId, tournamentId
var playerEntRemove = function(xData){
    try{
        var findPlayerEnt = schoolPlayerEntries.findOne({
            "playerId":xData.playerId,
            "tournamentId":xData.tournamentId
        })

        if(findPlayerEnt){
            var delEnt = schoolPlayerEntries.remove({
                "playerId":xData.playerId,
                "tournamentId":xData.tournamentId
            })
            if(delEnt){
                return true
            }
            else{
                return false
            }
        }
        else{
            return false
        }
    }catch(e){
        return false
    }
}

//required teamId, schoolId
var teamDelete = function(xData){
    try{
        var s = schoolTeams.remove({
            "_id":xData.teamId,
            "schoolId":xData.schoolId
        })
        if(s){
            return true
        }
        else{
            return false
        }
    }catch(e){
        return false
    }
}

var playerTeamEntUpdate = function(xData){

}

//required playerId, tournamentId
var playerTeamEntRemove = function(xData){
    try{
        var findPlayerEnt = schoolPlayerTeamEntries.findOne({
            "playerId":xData.playerId,
            "tournamentId":xData.tournamentId
        })
        if(findPlayerEnt){
            var delEnt = schoolPlayerTeamEntries.remove({
                "playerId":xData.playerId,
                "tournamentId":xData.tournamentId
            })
            if(delEnt){
                findPlayerEnt.playerId = findPlayerEnt.teamManager
                var updateNewManager = schoolPlayerTeamEntries.insert(
                    findPlayerEnt
                )
                if(updateNewManager){
                    return true
                }
                else{
                    return false
                }
            }
            else{
                return false
            }
        }
        else{
            return false
        }
    }catch(e){
        return false
    }
}

//required teamId, schoolId, playerId

var checkForManager = function(xData){
    try{
        var sclTeamDet = schoolTeams.findOne({
            "_id":xData.teamId,
            "schoolId":xData.schoolId
        })
        if(sclTeamDet && sclTeamDet.teamManager){
            if(sclTeamDet.teamManager == xData.palyerId){
                return true
            }
            else{
                return false
            }
        }else{
            return false
        }
    }catch(e){
        return false
    }
}