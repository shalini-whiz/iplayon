import {
    playerDBFind
}
from '../dbRequiredRole.js'

Meteor.methods({
    "registerAcademy5s": async function(xData) {
        var response = {}
        try {
            if (xData) {
                if(typeof xData == "string"){
                    data = xData.replace("\\", "");
                    xData = JSON.parse(data);
                }

                if (xData.emailIdOrPhone == undefined || xData.emailIdOrPhone == null) {
                    xData.emailIdOrPhone = "1"
                }
                if(xData.emailIdOrPhone == "1"){
                    xData.verifiedBy = ["email"]
                }
                else if(xData.emailIdOrPhone == "2"){
                    xData.verifiedBy = ["phone"]
                }

                if (xData.emailIdOrPhone == "1"||xData.emailIdOrPhone=="2") {
                    //if (true) {                        
                        var res = await Meteor.call("getDetailsOfGivenStateId", xData)
                        try {
                            if (res && res.result == true) {
                                xData.userName = xData.clubName
                                xData.interestedProjectName = [""]
                                xData.interestedDomainName = [""]
                                xData.role = "academy"
                                xData.registerType = "individual"

                                if (res.data) {
                                    var assoc = res.data
                                    if (assoc && assoc.interestedDomainName) {
                                        xData.interestedDomainName = assoc.interestedDomainName
                                    }
                                    if (assoc && assoc.interestedProjectName) {
                                        xData.interestedProjectName = assoc.interestedProjectName
                                    }
                                }


                                var resUp = await Meteor.call("registerTTFIAcademyAPI", xData,false)
                                try {
                                    if (resUp && resUp.status==SUCCESS_STATUS && resUp.data) {
                                        var data = {
                                            "status": "success",
                                            "message": "registered",
                                            "result": true,
                                            "data": resUp.data
                                        }
                                        response = data
                                    }
                                    else if(resUp && resUp.status==FAIL_STATUS && resUp.message){
                                        var data = {
                                            "status": FAIL_STATUS,
                                            "message": resUp.message,
                                            "result": false,
                                        }
                                        response = data
                                    }
                                    else{
                                        var data = {
                                            "status": "failure",
                                            "message": "cannot register academy",
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }
                                } catch (e) {
                                    var data = {
                                        "status": "failure",
                                        "message": "cannot register, " + e,
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }
                                
                            } else if (res && res.result != true) {
                                response = res
                            }
                        } catch (e) {
                            var data = {
                                "status": "failure",
                                "message": "cannot register, " + e,
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    //} 
                } 
                else {
                    var data = {
                        "status": "failure",
                        "message": "emailIdOrPhone is not valid",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "status": "failure",
                    "message": "data is not valid",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})


/*Meteor.methods({
    "registerAcademy5as": async function(xData) {
        var response = {}
        try {
            if (xData) {

                if (xData.emailIdOrPhone == undefined || xData.emailIdOrPhone == null) {
                    xData.emailIdOrPhone = "1"
                }

                if (xData.emailIdOrPhone == "1") {
                    if (xData.emailAddress != null && xData.emailAddress != undefined &&
                        xData.emailAddress.trim().length != 0) {
                        var res = await Meteor.call("getDetailsOfGivenStateId", xData)
                        try {
                            if (res && res.result == true) {
                                xData.userName = xData.clubName
                                xData.interestedProjectName = [""]
                                xData.interestedDomainName = [""]

                                if (res.data) {
                                    var assoc = res.data
                                    if (assoc && assoc.interestedDomainName) {
                                        xData.interestedDomainName = assoc.interestedDomainName
                                    }
                                    if (assoc && assoc.interestedProjectName) {
                                        xData.interestedProjectName = assoc.interestedProjectName
                                    }
                                }


                                var resUp = await Meteor.call("registerValidationForUploadPlayers", xData, 3)
                                try {
                                    if (resUp == false) {
                                        var resAcad = await Meteor.call("registerAcademy", xData)
                                        try {
                                            if (resAcad == false) {
                                                var data = {
                                                    "status": "failure",
                                                    "message": "cannot register",
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                            } else if (resAcad) {
                                                var data = {
                                                    "status": "success",
                                                    "message": "Registered",
                                                    "result": true,
                                                    "data": resAcad
                                                }
                                                response = data
                                            }
                                        } catch (e) {
                                            var data = {
                                                "status": "failure",
                                                "message": "cannot register, " + e,
                                                "result": false,
                                                "data": 0
                                            }
                                            response = data
                                        }
                                    } else if (resUp != undefined && resUp != null) {
                                        var data = {
                                            "status": "failure",
                                            "message": resUp,
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }
                                } catch (e) {
                                    var data = {
                                        "status": "failure",
                                        "message": "cannot register, " + e,
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }
                            } else if (res && res.result != true) {
                                response = res
                            }
                        } catch (e) {
                            var data = {
                                "status": "failure",
                                "message": "cannot register, " + e,
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var data = {
                            "status": "failure",
                            "message": "emailAddress is not valid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else if (xData.emailIdOrPhone == "2") {
                    if (xData.phoneNumber != null && xData.phoneNumber != undefined &&
                        xData.phoneNumber.trim().length != 0) {
                        var res = await Meteor.call("academyRegFieldValid", xData)
                        try {
                            if (res && res.result == true) {
                                xData.userName = xData.clubName
                                xData.interestedProjectName = [""]
                                xData.interestedDomainName = [""]

                                if (res.data) {
                                    var assoc = res.data
                                    if (assoc && assoc.interestedDomainName) {
                                        xData.interestedDomainName = assoc.interestedDomainName
                                    }
                                    if (assoc && assoc.interestedProjectName) {
                                        xData.interestedProjectName = assoc.interestedProjectName
                                    }
                                }


                                var resUp = await Meteor.call("registerValidationForUploadPlayers", xData, 3)
                                try {
                                    if (resUp == false) {
                                        var resA = await Meteor.call("registerAcademy", xData)
                                        try {
                                            if (resA == false) {
                                                var data = {
                                                    "status": "failure",
                                                    "message": "cannot register",
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                            } else if (resA) {
                                                var data = {
                                                    "status": "success",
                                                    "message": "Registered",
                                                    "result": true,
                                                    "data": resA
                                                }
                                                response = data
                                            }
                                        } catch (e) {
                                            var data = {
                                                "status": "failure",
                                                "message": "cannot register, " + e,
                                                "result": false,
                                                "data": 0
                                            }
                                            response = data
                                        }
                                    } else if (resUp != undefined && resUp != null) {
                                        var data = {
                                            "status": "failure",
                                            "message": resUp,
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }
                                } catch (e) {
                                    var data = {
                                        "status": "failure",
                                        "message": "cannot register, " + e,
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }
                            } else if (res && res.result != true) {
                                response = res
                            } else if (e) {
                                var data = {
                                    "status": "failure",
                                    "message": "cannot register, " + e,
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }
                        } catch (e) {
                            var data = {
                                "status": "failure",
                                "message": "cannot register, " + e,
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var data = {
                            "status": "failure",
                            "message": "phoneNumber is not valid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }

                }
            } else {
                var data = {
                    "status": "failure",
                    "message": "data is not valid",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})*/


Meteor.methods({
    getAcademyListForGivenAssoc: function(xData) {
        var response = {}

        try {
            if (xData) {
                if (xData.stateAssociationId) {
                    var checkStateDet = Meteor.users.findOne({
                        "userId": xData.stateAssociationId
                    })
                    var checkStateDetAss = associationDetails.findOne({
                        "userId": xData.stateAssociationId
                    })
                    if (checkStateDet && checkStateDetAss) {
                        //get acad det for userId
                        if (xData.userId) {
                            var dataDet = Meteor.users.findOne({
                                "userId": xData.userId
                            })
                            if (dataDet) {
                                var dataDet = academyDetails.findOne({
                                    "userId": xData.userId
                                })
                                if (dataDet) {
                                    var data = {
                                        "status": "success",
                                        "message": "academyDetails for given userId " + xData.userId,
                                        "result": true,
                                        "data": dataDet
                                    }
                                    response = data
                                } else {
                                    var data = {
                                        "status": "failure",
                                        "message": " no academyDetails for given userId " + xData.userId,
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }
                            } else {
                                var data = {
                                    "status": "failure",
                                    "message": " no academyDetails for given userId " + xData.userId,
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }
                        }
                        //get all acad det
                        else {
                            var dataDet = academyDetails.find({
                                $or: [{
                                    "parentAssociationId": xData.stateAssociationId
                                }, {
                                    "associationId": xData.stateAssociationId
                                }]
                            }).fetch()
                            if (dataDet.length != 0) {
                                var data = {
                                    "status": "success",
                                    "message": "academyDetails for given stateassociationid " + xData.stateAssociationId,
                                    "result": true,
                                    "data": dataDet
                                }
                                response = data
                            } else {
                                var data = {
                                    "status": "failure",
                                    "message": " no academyDetails for given stateassociationid " + xData.stateAssociationId,
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }
                        }
                    } else {
                        var data = {
                            "status": "failure",
                            "message": "stateAssociationId is not valid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "status": "failure",
                        "message": "stateAssociationId is not valid",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "status": "failure",
                    "message": "data is not valid",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})

Meteor.methods({
    "getTournamentDetForAcademySub": async function(tournamentId, academyId) {
        var response = {}
        try {
            if (tournamentId) {
                    //check valid tournament
                var s = events.findOne({
                    "_id": tournamentId
                })

                if (s) {
                    if (academyId) {
                            //check for academy id
                        var t = Meteor.users.findOne({
                            userId: academyId
                        })
                        var t1 = academyDetails.findOne({
                            userId: academyId
                        })

                        if (t && t1) {
                            //check for subscription
                            var data = {
                                tournamentId: tournamentId,
                                subscriberId: academyId
                            }
                            var lastDateEntry = await Meteor.call("eventSubLastUnderTournHelper", tournamentId)
                            try {
                                if (lastDateEntry!=undefined && lastDateEntry!=null) {
                                    var subType = await Meteor.call("individualEventsSubscriptionExternalAPI", data)
                                    try {
                                        if (subType[0] && subType[0].status != undefined) {
                                            if (subType[0].status == "success" && subType[0].data == true) {
                                                if (subType[0].routeValue && subType[0].routeValue != undefined) {
                                                    Meteor.call("upcomingListsAndStatus", data.tournamentId)
                                                    if (subType[0].routeValue == "entryFromAcademy") {
                                                            //call get details 
                                                            //call users under this academy
                                                        var usAca = await Meteor.call("usersOfGivenAcademy", academyId)
                                                        try {
                                                            if (usAca && usAca.result && usAca.data) {
                                                                var playersList = usAca.data
                                                                    //call events of this tournament
                                                                var eveDet = await Meteor.call("eventsOfGivenTournament", data.tournamentId)

                                                                if (eveDet && eveDet.data) {
                                                                    var eventList = eveDet.data
                                                                    var dataComp = {
                                                                        playersList: playersList,
                                                                        eventList: eventList
                                                                    }
                                                                    var data = {
                                                                        "status": "success",
                                                                        "message": "players and event details",
                                                                        "": true,
                                                                        "data": dataComp
                                                                    }
                                                                    if(lastDateEntry==false){
                                                                        data.result = false
                                                                        data.message = "Subscription entry date is passed"
                                                                    }
                                                                    response = data
                                                                } else {
                                                                    var data = {
                                                                        "status": "failure",
                                                                        "message": "cannot fetch events",
                                                                        "result": false,
                                                                        "data": 0
                                                                    }
                                                                    response = data
                                                                }
                                                            } else {
                                                                var data = {
                                                                    "status": "failure",
                                                                    "message": "cannot fetch players",
                                                                    "result": false,
                                                                    "data": 0
                                                                }
                                                                response = data
                                                            }
                                                        } catch (e) {
                                                            var data = {
                                                                "status": "failure",
                                                                "message": e,
                                                                "result": false,
                                                                "data": 0
                                                            }
                                                            response = data
                                                        }


                                                        //sort events acc to the array
                                                    } else {
                                                        var message = "you cannot subscribe to this tournament"
                                                        if (subType[0].response) {
                                                            message = subType[0].response
                                                        }
                                                        var data = {
                                                            "status": "failure",
                                                            "message": message,
                                                            "result": false,
                                                            "data": 0
                                                        }
                                                        response = data
                                                    }
                                                } else {
                                                    var message = "you cannot subscribe to this tournament"
                                                    if (subType[0].response) {
                                                        message = subType[0].response
                                                    }

                                                    var data = {
                                                        "status": "failure",
                                                        "message": message,
                                                        "result": false,
                                                        "data": 0
                                                    }
                                                    response = data
                                                }
                                            } else {
                                                var message = "you cannot subscribe to this tournament"
                                                if (subType[0].response) {
                                                    message = subType[0].response
                                                }
                                                var data = {
                                                    "status": "failure",
                                                    "message": message,
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                            }
                                        }
                                    } catch (e) {
                                        var data = {
                                            "status": "failure",
                                            "message": e,
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }
                                } else {
                                    var data = {
                                        "status": "failure",
                                        "message": "Subscription entry date is passed",
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }
                            } catch (e) {
                                var data = {
                                    "status": "failure",
                                    "message": e,
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }
                        } else {
                            var data = {
                                "status": "failure",
                                "message": "invalid academyId",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var data = {
                            "status": "failure",
                            "message": "academyId is invalid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "status": "failure",
                        "message": "tournament doesn't exists",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "status": "failure",
                    "message": "tournamentId is invalid",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})

Meteor.methods({
    "eventsOfGivenTournament": function(tournamentId) {
        var response = {}
        try {
            var dataToFind = events.aggregate([{
                $match: {
                    "tournamentId": tournamentId,
                    "projectType": 1
                }
            }, {
                $project: {
                    "_id": 1,
                    "eventName": 1,
                    "eventStartDate": 1,
                    "eventEndDate": 1,
                    "eventSubscriptionLastDate": 1,
                    "abbName": 1,
                    "prize": 1,
                    "projectType": 1,
                    "domainName": 1,
                    "tournamentId": 1,
                    "eventParticipants": 1,
                    "projectId": 1
                }
            }, {
                $lookup: {
                    from: "dobFilterSubscribe",
                    localField: "tournamentId",
                    // name of users table field,
                    foreignField: "tournamentId",
                    as: "dobDet" // alias for userinfo table

                }
            }, {
                $unwind: {
                    path: "$dobDet",
                }
            }, {
                $project: {
                    "_id": "$_id",
                    "eventName": "$eventName",
                    "eventStartDate": "$eventStartDate",
                    "eventEndDate": "$eventEndDate",
                    "eventSubscriptionLastDate": "$eventSubscriptionLastDate",
                    "abbName": "$abbName",
                    "prize": "$prize",
                    "projectType": "$projectType",
                    "domainName": "$domainName",
                    "tournamentId": "$tournamentId",
                    "eventParticipants": "$eventParticipants",
                    "projectId": "$projectId",
                    "det": "$dobDet.details"
                }
            }, {
                $unwind: "$det"
            }, {
                $project: {
                    "_id": "$_id",
                    "eventName": "$eventName",
                    "eventStartDate": "$eventStartDate",
                    "eventEndDate": "$eventEndDate",
                    "eventSubscriptionLastDate": "$eventSubscriptionLastDate",
                    "abbName": "$abbName",
                    "prize": "$prize",
                    "projectType": "$projectType",
                    "domainName": "$domainName",
                    "tournamentId": "$tournamentId",
                    "eventParticipants": "$eventParticipants",
                    "projectId": "$projectId",
                    "eventNameSport": {
                        "$cond": {
                            if: {
                                "$in": ["$det.eventId", "$projectId"]
                            },
                            then: "$det",
                            else: 0
                        }
                    },
                }
            }, {
                $match: {
                    "eventNameSport": {
                        "$ne": 0
                    }
                }
            }, {
                $project: {
                    "_id": "$_id",
                    "eventName": "$eventName",
                    "eventStartDate": "$eventStartDate",
                    "eventEndDate": "$eventEndDate",
                    "eventSubscriptionLastDate": "$eventSubscriptionLastDate",
                    "abbName": "$abbName",
                    "prize": "$prize",
                    "projectType": "$projectType",
                    "domainName": "$domainName",
                    "tournamentId": "$tournamentId",
                    "eventParticipants": "$eventParticipants",
                    "projectId": "$projectId",
                    "dobFilter": "$eventNameSport.dateOfBirth",
                    "gender": "$eventNameSport.gender",
                    "ranking": "$eventNameSportranking"
                }
            }])

            if (dataToFind && dataToFind.length) {
                var eventFeeSettingsFind = eventFeeSettings.findOne({
                    "tournamentId": tournamentId
                });

                if (eventFeeSettingsFind && eventFeeSettingsFind.singleEvents) {
                    var key = eventFeeSettingsFind.singleEvents;
                    var sorted = _.sortBy(dataToFind, function(x) {
                        return _.indexOf(key, x["abbName"])
                    })


                    response = {
                        "status": "success",
                        "message": "data is here",
                        "result": true,
                        "data": sorted
                    }
                } else {
                    response = {
                        "status": "failure",
                        "message": "cannot find event fees settings",
                        "result": false,
                        "data": 0
                    }
                }

            } else {
                response = {
                    "status": "failure",
                    "message": "cannot find events",
                    "result": false,
                    "data": 0
                }
            }

         
            return response
        } catch (e) {
           
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            return data
        }
    }
})


Meteor.methods({
    "usersOfGivenAcademy": function(userId) {
        var response = {}
        try {
            var players = []

            var loggedIn = Meteor.users.findOne({
                "_id": userId
            })
            var query = {}
            var toret = false

            if (loggedIn && loggedIn.userId) {

                if (loggedIn.role && loggedIn.role == "Academy" && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0) {
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "clubNameId": loggedIn.userId
                    }


                } else {
                    var data = {
                        "status": "failure",
                        "message": "loggedIn role should be academy and academy should select atleast one sport",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }

                if (toret) {
                    players = global[toret].find(
                        query, {
                            sort: {
                                dateOfBirth: -1
                            }
                        }).fetch();

                    if (players) {
                        var data = {
                            "status": "success",
                            "message": "players are found",
                            "result": true,
                            "data": players
                        }
                        response = data
                    } else {
                        var data = {
                            "status": "success",
                            "message": "players are undefined",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "status": "failure",
                        "message": "sport is invalid",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }

            } else {
                var data = {
                    "status": "failure",
                    "message": "Academy is invalid",
                    "result": false,
                    "data": 0
                }
                response = data
            }


            return response;
        } catch (e) {
         
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            return data
        }
    }
})

Meteor.methods({
    createArrayToSubscribe: async function(xData) {
        

        var response = {
            "status": "failure",
            "message": "",
            "result": true,
            "data": 0
        }

        try {
            if(xData && xData.academy){
                var acadeD = Meteor.users.findOne({userId:xData.academy})
                var acadeD2 = academyDetails.findOne({userId:xData.academy})
                if(acadeD && acadeD2){
                    if (xData && xData.tournamentId) {
                        var findTournamentId = events.findOne({
                            "_id": xData.tournamentId
                        })


                        if (findTournamentId && findTournamentId.projectId && findTournamentId.projectId.length) {
                            var lastDateEntry = await Meteor.call("eventSubLastUnderTournHelper", xData.tournamentId)
                            try {
                                if (lastDateEntry == true) {
                                    if (xData.eventCollection) {
                                        var toret = false
                                        toret = playerDBFind(findTournamentId.projectId.toString())
                                        if (toret) {
                                            xData.toret = toret
                                            var splitIntArr = await Meteor.call("splitIntoArrayEvents",xData)
                                            try{
                                                if(splitIntArr && splitIntArr.status=="success"){
                                                    if(splitIntArr.academyIds && splitIntArr.academyIds.length){
                                                        //call update academy entries
                                                        var upAcad = await Meteor.call("updateAcademyEntriesList",
                                                            splitIntArr.academyIds,xData.tournamentId)
                                                        try{
                                                            if(upAcad.status == "success" &&
                                                                (upAcad.data1 || upAcad.data2)){
                                                                var data = {
                                                                    "status": "success",
                                                                    "message": "updated academy entries",
                                                                    "result": true,
                                                                    "data": 0
                                                                }
                                                                var callGetDet = await Meteor.call("getTournamentDetForAcademySub",xData.tournamentId,xData.academy)
                                                                try{
                                                                    if(callGetDet){
                                                                        data.data = callGetDet
                                                                    }
                                                                }catch(e){
                                                                    data = {
                                                                        "status": "failure",
                                                                        "message": e,
                                                                        "result": false,
                                                                        "data": 0
                                                                    }
                                                                    response = data
                                                                   
                                                                    return data
                                                                }
                                                                response = data
                                                            }
                                                        }catch(e){

                                                            var data = {
                                                                "status": "failure",
                                                                "message": e,
                                                                "result": false,
                                                                "data": 0
                                                            }
                                                            response = data
                                                            return data
                                                        }
                                                    }
                                                    if(splitIntArr.daids && splitIntArr.daids.length){
                                                       
                                                        //call update da entries
                                                        var upda = await Meteor.call("updateAcademyEntriesList",
                                                            splitIntArr.daids,xData.tournamentId)
                                                        try{
                                                            if(upda.status == "success" &&
                                                                (upda.data1 || upda.data2)){
                                                                response.status = "success"
                                                                response.message = response.message + " " + "updated da entries"
                                                                response = data
                                                            }
                                                        }catch(e){
                                                            var data = {
                                                                "status": "failure",
                                                                "message": e,
                                                                "result": false,
                                                                "data": 0
                                                            }
                                                            response = data
                                                            return data
                                                        }
                                                    }
                                                }
                                                return response
                                            }catch(e){
                                                var data = {
                                                    "status": "failure",
                                                    "message": e,
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                                return response
                                            }
                                        }
                                        else {
                                            var data = {
                                                "status": "failure",
                                                "message": "invalid project id",
                                                "result": false,
                                                "data": 0
                                            }
                                            response = data
                                            return response
                                        }
                                    } else {
                                        var data = {
                                            "status": "failure",
                                            "message": "eventCollection is invalid",
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                      
                                        return response
                                    }
                                } else {
                                    var data = {
                                        "status": "failure",
                                        "message": "Subscription entry date is passed",
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                    return response
                                }
                            } catch (e) {
                                var data = {
                                    "status": "failure",
                                    "message": e,
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                                return response
                            }
                        } else {
                            var data = {
                                "status": "failure",
                                "message": "Invalid tournament details",
                                "result": false,
                                "data": 0
                            }
                            response = data
                            return response
                        }
                    } else {
                        var data = {
                            "status": "failure",
                            "message": "Invalid tournamentId",
                            "result": false,
                            "data": 0
                        }
                        response = data
                        return response
                    }
                }else{
                    var data = {
                        "status": "failure",
                        "message": "Invalid academy details",
                        "result": false,
                        "data": 0
                    }
                    response = data
                    return response
                }
            }else{
                var data = {
                    "status": "failure",
                    "message": "Invalid academyId",
                    "result": false,
                    "data": 0
                }
                response = data
                return response
            }
        } catch (e) {

            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})

Meteor.methods({
    "splitIntoArrayEvents": function(xData) {
        var response = {}
        try {
            var eventEntries = []
            var eventFeeSettingsFind = eventFeeSettings.findOne({
                "tournamentId": xData.tournamentId
            });

            if (eventFeeSettingsFind && eventFeeSettingsFind.singleEvents) {
                var academyIds = []
                var daIds = []
                for (var i = 0; i < xData.eventCollection.length; i++) {
                   
                    var eventCollection = xData.eventCollection[i]
                    var eventAbbName = xData.eventCollection[i].eventName

                    //update events db

                    //for subscribers
                    if (eventCollection.eventSubscribers &&
                        eventCollection.eventSubscribers.length) {
                        var updateevecoll = events.update({
                            "abbName": eventCollection.eventName,
                            "tournamentId": xData.tournamentId,
                            "tournamentEvent": false
                        }, {
                            $addToSet: {
                                eventParticipants: {
                                    $each: eventCollection.eventSubscribers
                                }
                            }
                        });


                        if (updateevecoll) {

                            var subscribers = eventCollection.eventSubscribers
                            var singleEvents = eventFeeSettingsFind.singleEvents
                            var singleEventsFee = eventFeeSettingsFind.singleEventFees

                            for (var j = 0; j < subscribers.length; j++) {
                                var thisUserId = subscribers[j]
                                    //update playerentries
                                var indOfthisEVe = _.indexOf(singleEvents, eventAbbName)
                                if (indOfthisEVe >= 0) {
                                        //find playerentry
                                    var playerentryFind = playerEntries.findOne({
                                        playerId: thisUserId,
                                        tournamentId: xData.tournamentId
                                    })
                                    if (playerentryFind) {
                                        var playDet = global[xData.toret].findOne({
                                            userId: thisUserId
                                        })
                                        
                                        var academyIdthis = "other"
                                        var associationIdthis = "other"
                                        var parentAssociationIdthis = "other"

                                        if(playDet && playDet.clubNameId){
                                            academyIdthis = playDet.clubNameId
                                        }
                                        if(playDet && playDet.associationId){
                                            associationIdthis = playDet.associationId
                                        }
                                        if(playDet && playDet.parentAssociationId){
                                            parentAssociationIdthis = playDet.parentAssociationId
                                        }

                                        if (playerentryFind.subscribedEvents) {
                                       

                                            playerentryFind.subscribedEvents[indOfthisEVe] = singleEventsFee[indOfthisEVe]

                                            var total = playerentryFind.subscribedEvents.reduce(function(prev, curr) {
                                                return (parseInt(prev) || 0) + (parseInt(curr) || 0);
                                            });

                                            var s = playerEntries.update({
                                                playerId: thisUserId,
                                                tournamentId: xData.tournamentId
                                            }, {
                                                $set: {
                                                    academyId:academyIdthis,
                                                    associationId:associationIdthis,
                                                    parentAssociationId:parentAssociationIdthis,
                                                    subscribedEvents: playerentryFind.subscribedEvents,
                                                    totalFee: total,
                                                    "paidOrNot": false
                                                }
                                            })

                                            if (s) {

                                                if (playDet && playDet.affiliatedTo && playDet.affiliatedTo == "academy" && playDet.clubNameId && playDet.clubNameId.trim().toLowerCase() != "other") {
                                                    if (_.indexOf(academyIds, playDet.clubNameId) < 0) {
                                                        academyIds.push(playDet.clubNameId)
                                                    }
                                                } else if (playDet && playDet.affiliatedTo && playDet.affiliatedTo == "districtAssociation" && playDet.associationId && playDet.associationId.trim().toLowerCase() != "other") {
                                                    if (_.indexOf(daIds, playDet.associationId) < 0) {
                                                        daIds.push(playDet.associationId)
                                                    }
                                                }
                                            }

                                        }
                                    } else {
                                        var zeroArray = Array.apply(null, Array(singleEventsFee.length)).map(String.prototype.valueOf, "0")

                                        zeroArray[indOfthisEVe] = singleEventsFee[indOfthisEVe]

                                        var total = zeroArray.reduce(function(prev, curr) {
                                            return (parseInt(prev) || 0) + (parseInt(curr) || 0);
                                        });
                                        var playDet = global[xData.toret].findOne({
                                            userId: thisUserId
                                        })
                                        
                                        var academyIdthis = "other"
                                        var associationIdthis = "other"
                                        var parentAssociationIdthis = "other"

                                        if(playDet && playDet.clubNameId){
                                            academyIdthis = playDet.clubNameId
                                        }
                                        if(playDet && playDet.associationId){
                                            associationIdthis = playDet.associationId
                                        }
                                        if(playDet && playDet.parentAssociationId){
                                            parentAssociationIdthis = playDet.parentAssociationId
                                        }

                                        if (playDet) {
                                            var s = playerEntries.insert({
                                                playerId: thisUserId,
                                                tournamentId: xData.tournamentId,
                                                subscribedEvents: zeroArray,
                                                totalFee: total,
                                                "paidOrNot": false,
                                                "academyId": academyIdthis,
                                                "parentAssociationId": parentAssociationIdthis,
                                                "associationId": associationIdthis,
                                            })
                                            if (s && playDet && playDet.affiliatedTo && playDet.affiliatedTo == "academy" && playDet.clubNameId && playDet.clubNameId.trim().toLowerCase() != "other") {
                                                if (_.indexOf(academyIds, playDet.clubNameId) < 0) {
                                                    academyIds.push(playDet.clubNameId)

                                                }
                                            } else if (s && playDet && playDet.affiliatedTo && playDet.affiliatedTo == "districtAssociation" && playDet.associationId && playDet.associationId.trim().toLowerCase() != "other") {
                                                if (_.indexOf(daIds, playDet.associationId) < 0) {
                                                    daIds.push(playDet.associationId)
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }

                    }

                    //for unsubscribers
                    if (eventCollection.eventUnsubscribers &&
                        eventCollection.eventUnsubscribers.length) {

                        var updateevecoll = events.update({
                            "abbName": eventCollection.eventName,
                            "tournamentId": xData.tournamentId,
                            "tournamentEvent": false
                        }, {
                            $pull: {
                                eventParticipants: {
                                    $in: eventCollection.eventUnsubscribers
                                }
                            }
                        });

                        if (updateevecoll) {
                            var unsubscribers = eventCollection.eventUnsubscribers

                            var singleEvents = eventFeeSettingsFind.singleEvents
                            var singleEventsFee = eventFeeSettingsFind.singleEventFees

                            for (var k = 0; k < unsubscribers.length; k++) {

                                var thisUserId = unsubscribers[k]
                                    //update playerentries
                                var indOfthisEVe = _.indexOf(singleEvents, eventAbbName)
                                if (indOfthisEVe >= 0) {

                                    var playerentryFind = playerEntries.findOne({
                                        playerId: thisUserId,
                                        tournamentId: xData.tournamentId
                                    })

                                    if (playerentryFind) {
                                        var playDet = global[xData.toret].findOne({
                                            userId: thisUserId
                                        })
                                        
                                        var academyIdthis = "other"
                                        var associationIdthis = "other"
                                        var parentAssociationIdthis = "other"

                                        if(playDet && playDet.clubNameId){
                                            academyIdthis = playDet.clubNameId
                                        }
                                        if(playDet && playDet.associationId){
                                            associationIdthis = playDet.associationId
                                        }
                                        if(playDet && playDet.parentAssociationId){
                                            parentAssociationIdthis = playDet.parentAssociationId
                                        }

                                        if (playerentryFind.subscribedEvents) {
                                            playerentryFind.subscribedEvents[indOfthisEVe] = "0"

                                            var total = playerentryFind.subscribedEvents.reduce(function(prev, curr) {
                                                return (parseInt(prev) || 0) + (parseInt(curr) || 0);
                                            });

                                            var s = playerEntries.update({
                                                playerId: thisUserId,
                                                tournamentId: xData.tournamentId
                                            }, {
                                                $set: {
                                                    academyId:academyIdthis,
                                                    associationId:associationIdthis,
                                                    parentAssociationId:parentAssociationIdthis,
                                                    subscribedEvents: playerentryFind.subscribedEvents,
                                                    totalFee: total
                                                }
                                            })

                                            if (s) {
                                                var playDet = global[xData.toret].findOne({
                                                    userId: thisUserId
                                                })

                                                if (playDet && playDet.affiliatedTo && playDet.affiliatedTo == "academy" && playDet.clubNameId && playDet.clubNameId.trim().toLowerCase() != "other") {
                                                    if (_.indexOf(academyIds, playDet.clubNameId) < 0) {
                                                        academyIds.push(playDet.clubNameId)
                                                    }
                                                } else if (playDet && playDet.affiliatedTo && playDet.affiliatedTo == "districtAssociation" && playDet.associationId && playDet.associationId.trim().toLowerCase() != "other") {
                                                    if (_.indexOf(daIds, playDet.associationId) < 0) {
                                                        daIds.push(playDet.associationId)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //update playerentries
                    //update academy entries
                    //update da entries

                }

                var data = {
                    "status": "failure",
                    "message":"Cannot Update academy and da ids",
                    "result": true,
                    "academyIds":[],
                    "daIds":[]
                }

                if(daIds && daIds.length){
                    data.status = "success"
                    data.message = "Update da ids"
                    //call daids
                    data.daIds = daIds
                }

                if(academyIds && academyIds.length){
                    data.status = "success"
                    data.message = "Update academy ids"
                    //call academyid
                    data.academyIds = academyIds
                }

                return data
            }

        } catch (e) {
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})

Meteor.methods({
    "updateAcademyEntriesList":function(academyEntriesId,tournamentId){
        var response = {
            "status": "failure",
            "message": "Cannot update entries",
            "result": false,
            "data1": 0,
            "data2":0
        }

        try{
            var insCount = 0
            var upsCount = 0

            for (var k = 0; k < academyEntriesId.length; k++) {
                if (academyEntriesId[k] != "other") {
                    var sum = 0;
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
                        var ins = academyEntries.insert({
                            academyId: academyEntriesId[k],
                            tournamentId: tournamentId,
                            parentAssociationId: parentAssociationId,
                            associationId: associationId,
                            //subscribedEvents:sum,
                            totalFee: sum,
                            paidOrNot: false
                        })

                        if(ins){
                            insCount = insCount + 1
                        }
                        
                    }else{
                        //var total = sum.reduce(function(pv, cv) { return pv + cv; }, 0);
                        var upd = academyEntries.update({
                            academyId: academyEntriesId[k],
                            tournamentId: tournamentId
                        }, {
                            $set: {
                                //subscribedEvents:sum,
                                totalFee: sum
                            }
                        });

                        if(upd){
                            upsCount = upsCount + 1
                        }
                    }
                }
            }

            if(insCount){
                response.status = "success"
                response.data1 = insCount
            }
            if(upsCount){
                response.status = "success"
                response.data2 = upsCount
            }

            return response
        }catch(e){
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            return data
        }
    }
})

Meteor.methods({
    "updateDAEntriesList":function(dAEntriesId,tournamentId){
        var response = {
            "status": "failure",
            "message": "Cannot update entries",
            "result": false,
            "data1": 0,
            "data2":0
        }

        var insCount = 0
        var upsCount = 0

        try{
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
                            var ins = districtAssociationEntries.insert({
                                associationId: dAEntriesId[w],
                                tournamentId: tournamentId,
                                parentAssociationId: parentAssociationId,
                                totalFee: sum,
                                paidOrNot: false
                            })
                            if(ins){
                                insCount = insCount + 1
                            }
                        } else {
                            //var total = sum.reduce(function(pv, cv) { return pv + cv; }, 0);
                            var upd = districtAssociationEntries.update({
                                associationId: dAEntriesId[w],
                                tournamentId: tournamentId
                            }, {
                                $set: {
                                    //subscribedEvents:sum,
                                    totalFee: sum
                                }
                            });
                            if(upd){
                                upsCount = upsCount + 1
                            }

                        }
                    }

                }
            }

            if(insCount){
                response.status = "success"
                response.data1 = insCount
            }
            if(upsCount){
                response.status = "success"
                response.data2 = upsCount
            }

            return response
        }catch(e){
            var data = {
                "status": "failure",
                "message": e,
                "result": false,
                "data": 0
            }
            return data
        }
    }
})


Meteor.methods({
    "sendSubscriptionEmailAPI":async function(tournamentId,userId){

        /*tournamentId = "p9AnStJFwJ638n8H4"
        userId = "723ezvhCui9ZYC2d3"*/
        var response = {
            "status": "failure",
            "message": "Cannot send mail of recent subscription details",
            "result": false,
            "data1": 0,
            "data2":0
        }
        try{
            if(userId){
                var userDet = Meteor.users.findOne({
                    userId:userId
                })
                if(userDet){
                    if(tournamentId){
                        var type = events.findOne({
                            "_id": tournamentId,
                            tournamentEvent: true
                        });
                        if(type){
                            var respontour = await Meteor.call("getAllSubscribersOfTournament", tournamentId,userId)
                            try{
                                if(respontour){
                                    var lData = respontour
                                    var role = userDet.role
                                    var email = userDet
                                    var message1 = ""
                                    var message2 = ""
                                    var message3 = ""


                                    var res = await Meteor.call("whoisEventOrganizer", type.eventOrganizer)
                                    try{
                                        if(res){
                                            //0
                                            if (type.subscriptionTypeHyper == 0 && type.subscriptionTypeMail == 0 && type.subscriptionTypeDirect == 0) {
                                                
                                            }
                                            //1
                                            else if (type.subscriptionTypeHyper == 0 && type.subscriptionTypeMail == 0 && type.subscriptionTypeDirect == 1) {
                                                message1 = "Recent subscription details of tournament"
                                                message3 = "no"
                                                message2 = "iPlayOn:Subscription successful"

                                                
                                            }
                                            //2
                                            else if (type.subscriptionTypeHyper == 0 && type.subscriptionTypeMail == 1 && type.subscriptionTypeDirect == 0) {
                                               message1 = "Please consider my subscription for the following events of tournament"
                                                message3 = "no"
                                                message2 = "iPlayOn:Subscription Requisition"

                                               
                                            }
                                            //3
                                            else if (type.subscriptionTypeHyper == 0 && type.subscriptionTypeMail == 1 && type.subscriptionTypeDirect == 1) {
                                                 message1 = "Recent subscription details of tournament"
                                                message3 = "no"
                                                message2 = "iPlayOn:Subscription successful"
                                            }
                                            //4
                                            else if (type.subscriptionTypeHyper == 1 && type.subscriptionTypeMail == 0 && type.subscriptionTypeDirect == 0) {
                                                
                                            }
                                            //5
                                            else if (type.subscriptionTypeHyper == 1 && type.subscriptionTypeMail == 0 && type.subscriptionTypeDirect == 1) {
                                                message1 = "Recent subscription details of tournament"
                                                message3 = "yes"
                                                message2 = "iPlayOn:Subscription successful"

                                                
                                            }
                                            //6
                                            else if(type.subscriptionTypeHyper == 1 && type.subscriptionTypeMail == 1 && type.subscriptionTypeDirect == 0){
                                                message1 = "Please consider my subscription for the following events of tournament"
                                                message3 = "yes"
                                                message2 = "iPlayOn:Subscription Requisition"
                                            }

                                            else if (type.subscriptionTypeHyper == 1 && type.subscriptionTypeMail == 1 && type.subscriptionTypeDirect == 1) {
                                               

                                                message1 = "Recent subscription details of tournament"
                                                message3 = "yes"
                                                message2 = "iPlayOn:Subscription successful"
                                            }

                                            var resfrom = await Meteor.call("saveAndSend",lData,role, email,message1, message2,message3,tournamentId,type);
                                            if(resfrom){
                                                response.message = "mail sent to "+ email.emailAddress
                                                response.status = "success"
                                            }
                                        }
                                        else{
                                            response.message = "invalid event organizer"
                                        }
                                    }catch(e){
                                        response.message  = e
                                    }
                                }
                                else{
                                    response.message = "invalid subscription details"
                                }
                            }catch(e){
                                response.message = e
                            }
                        }
                        else{
                            response.message = "invalid tournament details"
                        }
                    }
                    else{
                        response.message = "require tournamentId"
                    }
                }
                else{
                    response.message = "invalid user details"
                }
            }else{
                response.message = "require userId"
            }
            return response
        }catch(e){
            response.message = e
            return response
        }
    }
})


Meteor.methods({
    "saveAndSend":async function(lData, role, userDet, messageM, subjectM, hypOrNot,tournamentId,eveDet) {
    try {
        
        var ccM = "";
        var eventsABBNAME = [];
        var myDetails = [];
        var type = events.findOne({
            "_id": tournamentId,
            tournamentEvent: true
        }) 
        var eveOrg;

        var eventPrizes = eventFeeSettings.findOne({
            "tournamentId": tournamentId
        });
        if (eventPrizes && eventPrizes.eventFees) {
            eventPrizes = eventPrizes.singleEventFees;
        } else {
            eventPrizes = []
        }
        var resP = await Meteor.call("eventAbbrevationsNAMESSeparatedEvents", tournamentId)
        try {

            if (resP) {
                eventsABBNAME = resP
                var dataContext = {
                    message: messageM,
                    tournament: type.eventName,
                    contactPerson: userDet.userName,
                    eventsDetailsMail: eventsABBNAME,
                    eventFeesPrize: eventPrizes,
                    playersWithCheckMail: lData
                }
                
                SSR.compileTemplate('sendSubscriptionEmailFromClubEntry', Assets.getText('sendSubscriptionEmailFromClubEntry.html'));
                Template.registerHelper("eventFeesSendMAIL", function(data) {
                    if (data) {
                        var eventDetails = events.findOne({
                            "tournamentId":tournamentId,
                            "abbName": data
                        })
                        if (eventDetails && eventDetails.prize) {
                            return eventDetails.prize
                        }
                    }
                });
                Template.registerHelper('getTeamNameForId',function(data){
                    try{
                    var text = data.replace(/(\r\n|\n|\r)/gm, '<br/>');;
                    if(text){
                        return  new Spacebars.SafeString(text);
                    }
                    }catch(e){
                    }
                });
                Template.registerHelper("checkZEROorONE", function(data) {
                    if (parseInt(data) == 0) {
                        return false
                    } else {
                        return true
                    }
                })
                Template.registerHelper("slNUM",function(data){
                    try{
                        return parseInt(parseInt(data)+1)
                    }catch(e){}
                })
                Template.registerHelper('upcomingformatDate', function(date) {
                    try{
                        if(date != "" || date != undefined || date != null || date.trim() != " ")
                        {
                            return moment(new Date(date)).format("DD MMM YYYY");
                        }
                    }catch(e){
                    }
                });

                Template.registerHelper("checkZEROorONE", function(data) {
                    if (parseInt(data) == 0) {
                        return false
                    } else {
                        return true
                    }
                })

                var ccM = ""
                if(eveDet && eveDet.eventOrganizer){
                    var cc = Meteor.users.findOne({
                        userId:eveDet.eventOrganizer
                    })
                    if(cc && cc.emailAddress){
                        ccM = cc.emailAddress
                    }
                }

                var html = SSR.render('sendSubscriptionEmailFromClubEntry', dataContext);
                var options = {
                    from: "iplayon.in@gmail.com",
                    to: userDet.emailAddress,
                    cc:ccM,
                    subject: subjectM,
                    html: html
                }

                var returres = await Meteor.call("sendShareEmail", options)
                 try {
                    if (returres) {
                        return true
                    } else {
                        return false
                    }
                }catch(e){
                    return false
                }
            }else{
                return false
            }
        }catch(e){
            return false
        }

    } catch (e) {

        return false
    }
}
})

/*add players 
    as state assoc
     same for upload players
    -- new player by state assoc
    -- add player through search select
    -- remove add again
    -- approve user
    -- remove approved user
    -- add removed approved user to new state
         
    -- new player through add new player
    -- remove add again
    -- aprove user
    -- remove approved user
    -- add removed approved user to new state

    as dist assoc
    added by sa // direct reg// search selected by sa
     same for upload players
    -- new player by state assoc
    -- add player through search select
    -- remove add again
    -- approve user
    -- remove approved user
    -- add removed approved user to new state

    -- new player through add new player
    -- remove add again
    -- aprove user
    -- remove approved user
    -- add removed approved user to new state

    as acad
    added by sa // direct reg// search selected by sa
    same for upload players
    -- new player by state assoc
    -- add player through search select
    -- remove add again
    -- approve user
    -- remove approved user
    -- add removed approved user to new state

    -- new player through add new player
    -- remove add again
    -- aprove user
    -- remove approved user
    -- add removed approved user to new state
    
    as acad 
    added by da // direct reg// search selected by da
    same for upload players
    -- new player by state assoc
    -- add player through search select
    -- remove add again
    -- approve user
    -- remove approved user
    -- add removed approved user to new state

    -- new player through add new player
    -- remove add again
    -- aprove user
    -- remove approved user
    -- add removed approved user to new state

*/