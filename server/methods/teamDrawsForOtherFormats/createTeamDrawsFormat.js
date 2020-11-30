//create teams format by organizer with validation
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';
import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';

Meteor.methods({
    "createTeamsFormatByOrganizer": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_FORMAT_CREATE_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            var sortOrder = []
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nullOrgId = sTeams.nullUndefinedEmpty("organizerId")
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                if (nulltournamentId == "1") {
                    var checkValidTourn = sTeams.checkValidTournamentID()

                    if (checkValidTourn == '1') {
                        var getProjectId = getprojectIdOfGivenTournamId(xData.tournamentId)
                        if (getProjectId) {

                            if (nullOrgId == "1") {
                                xData.projectId = getProjectId

                                var nullFormatName = sTeams.nullUndefinedEmpty("formatName")

                                if (nullFormatName == "1") {

                                    //check organizer id
                                    var checkOrgId = sTeams.checkForOrganizerId()
                                    if (checkOrgId == "1") {


                                        //check specifications
                                        var nullSpecifications = sTeams.nullUndefined("specifications")
                                        if (nullSpecifications == "1") {

                                            var checkTypeSpec = sTeams.checkTeamSpecifications()
                                            if (checkTypeSpec == "1") {

                                                //validations of each row of specifications
                                                for (var i = 0; i < xData.specifications.length; i++) {
                                                    var data = xData.specifications[i]

                                                    //null undefined empty for no,displayLabel,label,type,order
                                                    var sTeamsSpecs = new TeamsFormats(data)
                                                    var noNull = sTeamsSpecs.nullUndefined("no")
                                                    var displaylabelNull = sTeamsSpecs.nullUndefinedEmpty("displayLabel")

                                                    var typeNull = sTeamsSpecs.nullUndefined("type")
                                                    var orderNull = sTeamsSpecs.nullUndefined("order")

                                                    if (noNull == "1" && displaylabelNull == "1" &&
                                                        typeNull == "1" && orderNull == "1") {

                                                        var noNum = sTeamsSpecs.validateNumb("no")
                                                        var typeNum = sTeamsSpecs.validateNumb("type")
                                                        var orderNum = sTeamsSpecs.validateNumb("order")

                                                        if (noNum == "1" && typeNum == "1" && orderNum == "1") {
                                                            //type should be singles or doubles
                                                            var typeNum1_2 = sTeamsSpecs.validateTypeValue("type")
                                                            if (typeNum1_2 == "1") {
                                                                sortOrder.push(parseInt(i + 1))
                                                                res.status = SUCCESS_STATUS
                                                            } else {
                                                                res.status = FAIL_STATUS
                                                                res.message = "Errors at index " + (i + 1) + " of team specifications " + typeNum1_2
                                                                break
                                                            }
                                                        } else {
                                                            res.status = FAIL_STATUS
                                                            res.message = "Errors at index " + (i + 1) + " of team specifications "
                                                            if (noNum != "1") {
                                                                res.message = res.message + " , " + noNum
                                                            }
                                                            if (typeNum != "1") {
                                                                res.message = res.message + " , " + typeNum
                                                            }
                                                            if (orderNum != "1") {
                                                                res.message = res.message + " , " + orderNum
                                                            }

                                                            break
                                                        }
                                                    } else {
                                                        res.status = FAIL_STATUS
                                                        res.message = "Errors at index " + (i + 1) + " of team specifications "
                                                        if (noNull != "1") {
                                                            res.message = res.message + " , " + noNull
                                                        }
                                                        if (displaylabelNull != "1") {
                                                            res.message = res.message + " , " + displaylabelNull
                                                        }
                                                        if (typeNull != "1") {
                                                            res.message = res.message + " , " + typeNull
                                                        }
                                                        if (orderNull != "1") {
                                                            res.message = res.message + " , " + orderNull
                                                        }

                                                        break;
                                                    }
                                                }

                                            } else {
                                                res.message = checkTypeSpec
                                            }
                                        } else {
                                            res.message = nullSpecifications
                                        }

                                    } else {
                                        res.message = checkOrgId
                                    }
                                } else {
                                    res.message = nullFormatName
                                }
                            } else {
                                res.message = nullOrgId
                            }
                        } else {
                            res.message = "projectId " + IS_INVALID_MSG
                        }
                    } else {
                        res.message = checkValidTourn
                    }
                } else {
                    res.message = nulltournamentId
                }

            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }

            if (res.status == SUCCESS_STATUS) {
                xData.sortOrder = sortOrder
                    //if all validations are successfull
                    //call save
                res.message = VALIDATION_TEAM_FORMAT_ORG_CREATE_SUCCESS_MSG
                res.data = xData
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

var getprojectIdOfGivenTournamId = function(tournamentId) {
    try {
        var eve = events.findOne({
            _id: tournamentId
        })
        if (eve && eve.projectId) {
            return eve.projectId.toString()
        } else {
            eve = pastEvents.findOne({
                "_id": tournamentId
            })
            if (eve && eve.projectId) {
                return eve.projectId.toString()
            } else {
                return false
            }
        }
    } catch (e) {
        return false
    }
}


Meteor.methods({
    "getTypeOfProject": function(tId, eventName) {
        try {

            var eve = events.findOne({
                "tournamentId": tId,
                "eventName": eventName
            })
            if (eve) {
                return eve
            } else {
                var eve = pastEvents.findOne({
                    "tournamentId": tId,
                    "eventName": eventName
                })
                if (eve) {
                    return eve
                } else {
                    return false
                }
            }
        } catch (e) {
            return false
        }
    }
})


Meteor.methods({
    "saveOrganizerTeamsFormatAfterValid": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_FORMAT_CREATE_FAIL_MSG
        }

        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {

                var findFirst;
                if (xData._id) {
                    findFirst = orgTeamMatchFormat.findOne({
                        "_id": xData._id
                    })
                    if (findFirst) {

                        res.data = xData._id
                        res.status = SUCCESS_STATUS
                        res.message = TEAM_FORMATS_FETCH_ORG_SUCCESS_MSG
                    }
                } else {
                    var createFormat = orgTeamMatchFormat.insert({
                        projectId: xData.projectId,
                        organizerId: xData.organizerId,
                        formatName: xData.formatName,
                        specifications: xData.specifications,
                        sortOrder: xData.sortOrder,
                    })
                    if (createFormat) {
                        res.data = createFormat
                        res.status = SUCCESS_STATUS
                        res.message = TEAM_FORMAT_ORG_SUCCESS_MSG
                    }
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})


Meteor.methods({
    "fetchOrganizerTeamFormats": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAM_FORMATS_FETCH_ORG_SUCCESS_MSG
        }
        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nullOrgId = sTeams.nullUndefinedEmpty("organizerId")
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")

                if (nulltournamentId == "1") {
                    var checkValidTourn = sTeams.checkValidTournamentID()
                    if (checkValidTourn) {
                        if (nullOrgId == "1") {
                            var checkOrgId = sTeams.checkForOrganizerId()
                            if (checkOrgId == "1") {
                                var getProjectId = getprojectIdOfGivenTournamId(xData.tournamentId)
                                if (getProjectId) {
                                    var getTeamsFormats = orgTeamMatchFormat.find({
                                        projectId: getProjectId,
                                        organizerId: xData.organizerId
                                    }).fetch()
                                    if (getTeamsFormats && getTeamsFormats.length) {
                                        res.message = TEAM_FORMATS_FETCH_ORG_SUCCESS_MSG
                                        res.status = SUCCESS_STATUS
                                        res.data = getTeamsFormats
                                    } else {
                                        res.message = TEAM_FORMATS_ORG_FAIL_MSG
                                    }
                                } else {
                                    res.message = "projectId " + IS_INVALID_MSG
                                }
                            } else {
                                res.message = checkOrgId
                            }
                        } else {
                            res.message = nullOrgId
                        }
                    } else {
                        res.message = checkValidTourn
                    }
                } else {
                    res.message = nulltournamentId
                }

            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {

            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
})

Meteor.methods({
    "selectedTeamFormatIdDetails": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_FORMAT_ID_DETAIL_FAIL_MSG
        }
        try {
           
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nullteamsFormatsId = sTeams.nullUndefinedEmpty("teamsFormatId")
                if (nullteamsFormatsId == "1") {
                    var getDetailsOfthis = orgTeamMatchFormat.findOne({
                        "_id": xData.teamsFormatId
                    })
                    if (getDetailsOfthis) {
                        res.message = TEAMS_FORMAT_ID_DETAIL_SUCCESS_MSG
                        res.status = SUCCESS_STATUS
                        res.data = getDetailsOfthis
                    }
                } else {
                    res.message = nullteamsFormatsId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            console.log(e)
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
})


Meteor.methods({
    "getTeamFormatIdForOtherFormats": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_TEAMS_FORMAT_ID_SUCCESS_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            var sortOrder = []
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var getDetailsOfthis = MatchTeamCollectionConfig.findOne({
                                    tournamentId: xData.tournamentId,
                                    eventName: xData.eventName
                                })
                                if (getDetailsOfthis && getDetailsOfthis.teamFormatId) {
                                    res.data = getDetailsOfthis.teamFormatId
                                    res.message = GET_TEAMS_FORMAT_ID_SUCCESS_MSG
                                    res.status = SUCCESS_STATUS
                                }
                            } else {
                                res.message = checkValidTournEve
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "initTeamMatchRecords": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_INIT_FORMAT_ID_DETAIL_FAIL_MSG
        }
        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var getDetEveDet = sTeams.checkValidTournamentIDEvent(true)
                                if (getDetEveDet) {
                                    if (getDetEveDet.projectType && parseInt(getDetEveDet.projectType) == 2) {
                                        //reset match records
                                        var s = await Meteor.call("resetMatchRecordsTeamMatch", xData.tournamentId, xData.eventName);
                                        //init match records now
                                        if (xData.fileData) {
                                            if (xData.fileData.length) {
                                                var initData = await Meteor.call("initMatchRecordsForTeam", xData.tournamentId, xData.eventName, xData.fileData)
                                                if (initData && initData.length) {
                                                    res.message = TEAMS_INIT_FORMAT_ID_DETAIL_SUCCESS_MSG
                                                    res.data = initData
                                                    res.status = SUCCESS_STATUS
                                                }
                                            } else {
                                                res.message = INVALID_FILEDATA_TYPE_FAIL_MSG
                                            }
                                        } else {
                                            res.message = INVALID_FILEDATA_TYPE_FAIL_MSG
                                        }
                                    } else {
                                        res.message = INVALID_PROJECT_TYPE_FAIL_MSG
                                    }
                                } else {
                                    res.message = INVALID_EVENT_DETAILS_FAIL_MSG
                                }
                            } else {
                                res.message = checkValidTournEve
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
});

Meteor.methods({
    "getMatchRecordsAfterCreate": async function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_INIT_FN_GET_MATCHES_FAIL_MSG
        }
        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var getDetEveDet = sTeams.checkValidTournamentIDEvent(true)
                                if (getDetEveDet) {
                                    if (getDetEveDet.projectType && parseInt(getDetEveDet.projectType) == 2) {
                                        if (true) {
                                            if (true) {
                                                var initData = await Meteor.call("getTeamMatchesFromDB", xData.tournamentId, xData.eventName)
                                                if (initData && initData.length) {
                                                    res.message = TEAMS_INIT_FN_GET_MATCHES_SUCCESS_MSG
                                                    res.data = initData
                                                    res.status = SUCCESS_STATUS
                                                }
                                            }
                                        }
                                    } else {
                                        res.message = INVALID_PROJECT_TYPE_FAIL_MSG
                                    }
                                } else {
                                    res.message = INVALID_EVENT_DETAILS_FAIL_MSG
                                }
                            } else {
                                res.message = checkValidTournEve
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
})

Meteor.methods({
    "createBMRoundData": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_CREATE_BM_FAIL_MSG
        }
        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var data = {
                                    "roundName": "BM",
                                    "roundNumber": "BM"
                                }
                                var validTournDet = sTeams.checkValidTournamentID(true);
                                if (validTournDet && validTournDet.projectId) {
                                    var insertTeamConfig = MatchTeamBMCollectionConfig.insert({
                                        "projectId": validTournDet.projectId,
                                        "tournamentId": xData.tournamentId,
                                        "eventName": xData.eventName,
                                        "roundValues": [
                                            data
                                        ]
                                    });

                                    if (insertTeamConfig) {
                                        res.message = TEAMS_CREATE_BM_SUCCESS_MSG
                                        res.status = SUCCESS_STATUS
                                    }
                                }
                            } else {
                                res.message = checkValidTourn
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
})

Meteor.methods({
    "fetchLoserForBMRoundData": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_GET_LOSERS_BM_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var validTournDet = sTeams.checkValidTournamentIDEvent(true);
                                if (validTournDet && validTournDet.projectType == 2) {
                                    var teamMatRec = teamMatchCollectionDB.aggregate([{
                                        $match: {
                                            "tournamentId": xData.tournamentId,
                                            "eventName": xData.eventName
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchRecords"
                                        }
                                    }, {
                                        $match: {
                                            "matchRecords.roundName": "SF"
                                        }
                                    }]);
                                    var dataToSend = {

                                    }

                                    if (teamMatRec && teamMatRec.length) {
                                        for (var i = 0; i < teamMatRec.length; i++) {
                                            if (teamMatRec[i].matchRecords.status &&
                                                teamMatRec[i].matchRecords.status.toLowerCase() != "yettoplay") {
                                                if (teamMatRec[i].matchRecords.winnerID && teamMatRec[i].matchRecords.teamsID) {
                                                    if (teamMatRec[i].matchRecords.winnerID == teamMatRec[i].matchRecords.teamsID.teamAId) {
                                                        dataToSend["team" + parseInt(i + 1) + "Id"] = teamMatRec[i].matchRecords.teamsID.teamBId
                                                        var findTeamName = playerTeams.findOne({
                                                            "_id": teamMatRec[i].matchRecords.teamsID.teamBId
                                                        })
                                                        if (findTeamName == undefined) {
                                                            findTeamName = schoolTeams.findOne({
                                                                "_id": teamMatRec[i].matchRecords.teamsID.teamBId
                                                            })
                                                        }

                                                        if (findTeamName && findTeamName.teamName) {
                                                            dataToSend["team" + parseInt(i + 1) + "Name"] = findTeamName.teamName
                                                            if (findTeamName.teamManager) {
                                                                dataToSend["team" + parseInt(i + 1) + "Manager"] = findTeamName.teamManager
                                                            }
                                                        }
                                                    } else if (teamMatRec[i].matchRecords.winnerID == teamMatRec[i].matchRecords.teamsID.teamBId) {
                                                        dataToSend["team" + parseInt(i + 1) + "Id"] = teamMatRec[i].matchRecords.teamsID.teamAId
                                                        var findTeamName = playerTeams.findOne({
                                                            "_id": teamMatRec[i].matchRecords.teamsID.teamAId
                                                        })
                                                        if (findTeamName == undefined) {
                                                            findTeamName = schoolTeams.findOne({
                                                                "_id": teamMatRec[i].matchRecords.teamsID.teamAId
                                                            })

                                                        }

                                                        if (findTeamName && findTeamName.teamName) {
                                                            dataToSend["team" + parseInt(i + 1) + "Name"] = findTeamName.teamName
                                                            if (findTeamName.teamManager) {
                                                                dataToSend["team" + parseInt(i + 1) + "Manager"] = findTeamName.teamManager
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (dataToSend.team1Id && dataToSend.team2Id) {
                                        res.message = TEAMS_GET_LOSERS_BM_SUCCESS_MSG
                                        res.data = dataToSend
                                        res.status = SUCCESS_STATUS
                                    }
                                }
                            } else {
                                res.message = checkValidTourn
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
});

Meteor.methods({
    "findInsertedRoundBMTeam": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_GET_MATCH_BM_RESULT_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var validTournDet = sTeams.checkValidTournamentIDEvent(true);
                                if (validTournDet && validTournDet.projectType == 2) {
                                    var checkTeamMatchDet = teamMatchCollectionDB.aggregate([{
                                        $match: {
                                            "tournamentId": xData.tournamentId,
                                            "eventName": xData.eventName
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchRecords"
                                        }
                                    }, {
                                        $match: {
                                            "matchRecords.roundName": "BM"
                                        }
                                    }, {
                                        $project: {
                                            "matchRecords": "$matchRecords"
                                        }
                                    }])
                                    if (checkTeamMatchDet && checkTeamMatchDet.length) {
                                        res.message = TEAMS_GET_MATCH_BM_RESULT_SUCCESS_MSG
                                        res.data = checkTeamMatchDet
                                        res.status = SUCCESS_STATUS
                                    }

                                }
                            } else {
                                res.message = checkValidTourn
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
})

Meteor.methods({
    "insertOrUpdateRoundBMTeam": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": TEAMS_INSERT_BM_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var validTournDet = sTeams.checkValidTournamentIDEvent(true);
                                if (validTournDet && validTournDet.projectType == 2) {
                                    var checkTeamMatchDet = teamMatchCollectionDB.aggregate([{
                                        $match: {
                                            "tournamentId": xData.tournamentId,
                                            "eventName": xData.eventName
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchRecords"
                                        }
                                    }, {
                                        $match: {
                                            "matchRecords.roundName": "F"
                                        }
                                    }, {
                                        $project: {
                                            "nextMatchNumber": "$matchRecords.nextMatchNumber",
                                            "nextSlot": "$matchRecords.nextSlot",
                                            "roundNumber": "$matchRecords.roundNumber"
                                        }
                                    }])
                                    if (checkTeamMatchDet && checkTeamMatchDet.length &&
                                        checkTeamMatchDet[0] && checkTeamMatchDet[0].nextMatchNumber) {

                                        var checkTeamMatchDetPres = teamMatchCollectionDB.aggregate([{
                                            $match: {
                                                "tournamentId": xData.tournamentId,
                                                "eventName": xData.eventName
                                            }
                                        }, {
                                            $unwind: {
                                                path: "$matchRecords"
                                            }
                                        }, {
                                            $match: {
                                                "matchRecords.roundName": "BM"
                                            }
                                        }])
                                        if (checkTeamMatchDetPres && checkTeamMatchDetPres.length && checkTeamMatchDetPres[0].matchRecords) {
                                            res.status = SUCCESS_STATUS
                                            res.data = checkTeamMatchDetPres[0].matchRecords
                                            res.message = TEAMS_INSERT_BM_SUCCESS_MSG
                                        } else {
                                            var nexSL = "A"
                                            if (checkTeamMatchDet[0].nextSlot == "A") {
                                                nexSL = "B"
                                            }

                                            var data = {
                                                "matchNumber": checkTeamMatchDet[0].nextMatchNumber,
                                                "nextMatchNumber": parseInt(checkTeamMatchDet[0].nextMatchNumber + 1),
                                                "status": "yetToPlay",
                                                "roundNumber": parseInt(checkTeamMatchDet[0].roundNumber + 1),
                                                "isBlank": false,
                                                "roundName": "BM",
                                                "teams": {
                                                    "teamA": xData.teamAName,
                                                    "teamB": xData.teamBName
                                                },
                                                "teamsID": {
                                                    "teamAId": xData.teamAId,
                                                    "teamBId": xData.teamBId,
                                                    "managerAId": xData.teamAManagerId,
                                                    "managerBId": xData.teamBManagerId
                                                },
                                                "setWins": {
                                                    "teamA": 0,
                                                    "teamB": 0
                                                },
                                                "nextSlot": nexSL,
                                                "scores": {
                                                    "setScoresA": [
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0
                                                    ],
                                                    "setScoresB": [
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0
                                                    ]
                                                },
                                                "getStatusColorA": "ip_input_box_type_pName",
                                                "getStatusColorB": "ip_input_box_type_pNameLost",
                                                "winner": "",
                                                "loser": "",
                                                "winnerID": "",
                                                "WinnermanagerId": "",
                                                "selectedID": "",
                                                "selectedTeamName": ""
                                            }
                                            var tmToInsert = teamMatchCollectionDB.update({
                                                tournamentId: xData.tournamentId,
                                                eventName: xData.eventName
                                            }, {
                                                "$addToSet": {
                                                    matchRecords: data
                                                }
                                            })
                                            var getMatColDet = MatchTeamCollectionConfig.aggregate([{
                                                $match: {
                                                    "tournamentId": xData.tournamentId,
                                                    "eventName": xData.eventName
                                                }
                                            }, {
                                                $project: {
                                                    "roundValues": 1,
                                                    "projectId": 1,
                                                    "teamFormatId": 1,
                                                    "_id": 1
                                                }
                                            }])

                                            if (getMatColDet && getMatColDet.length) {
                                                if (getMatColDet[0].roundValues && getMatColDet[0].roundValues.length) {
                                                    var roundDataToIns = {
                                                        "roundNumber": parseInt(checkTeamMatchDet[0].roundNumber + 1),
                                                        "roundName": "Bronze Medal"
                                                    }
                                                    var lastData = getMatColDet[0].roundValues[getMatColDet[0].roundValues.length - 1]
                                                    getMatColDet[0].roundValues[getMatColDet[0].roundValues.length - 1] = roundDataToIns
                                                    getMatColDet[0].roundValues.push(lastData)
                                                    var delMat = MatchTeamCollectionConfig.remove({
                                                        "tournamentId": xData.tournamentId,
                                                        "eventName": xData.eventName
                                                    })
                                                    var insertAgain = MatchTeamCollectionConfig.insert({
                                                        "_id": getMatColDet[0]._id,
                                                        "tournamentId": xData.tournamentId,
                                                        "eventName": xData.eventName,
                                                        "roundValues": getMatColDet[0].roundValues,
                                                        "projectId": getMatColDet[0].projectId,
                                                        "teamFormatId": getMatColDet[0].teamFormatId
                                                    })
                                                }
                                            }

                                            if (tmToInsert) {

                                                var checkTeamMatchDetPres = teamMatchCollectionDB.aggregate([{
                                                    $match: {
                                                        "tournamentId": xData.tournamentId,
                                                        "eventName": xData.eventName
                                                    }
                                                }, {
                                                    $unwind: {
                                                        path: "$matchRecords"
                                                    }
                                                }, {
                                                    $match: {
                                                        "matchRecords.roundName": "BM"
                                                    }
                                                }])

                                                if (checkTeamMatchDetPres && checkTeamMatchDetPres.length && checkTeamMatchDetPres[0].matchRecords) {
                                                    res.status = SUCCESS_STATUS
                                                    res.data = checkTeamMatchDetPres[0].matchRecords
                                                    res.message = TEAMS_INSERT_BM_SUCCESS_MSG
                                                }
                                            }
                                        }
                                    } else {
                                        res.message = TEAMS_GET_MATCH_REC_FAIL_MSG
                                    }
                                }
                            } else {
                                res.message = checkValidTourn
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
})


Meteor.methods({
    "insertOrUpdateRoundBMInd": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": IND_INSERT_BM_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var validTournDet = sTeams.checkValidTournamentIDEvent(true);
                                if (validTournDet && validTournDet.projectType == 1) {
                                    var checkTeamMatchDet = MatchCollectionDB.aggregate([{
                                        $match: {
                                            "tournamentId": xData.tournamentId,
                                            "eventName": xData.eventName
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchRecords"
                                        }
                                    }, {
                                        $match: {
                                            "matchRecords.roundName": "F"
                                        }
                                    }, {
                                        $project: {
                                            "nextMatchNumber": "$matchRecords.nextMatchNumber",
                                            "nextSlot": "$matchRecords.nextSlot",
                                            "roundNumber": "$matchRecords.roundNumber"
                                        }
                                    }])
                                    if (checkTeamMatchDet && checkTeamMatchDet.length &&
                                        checkTeamMatchDet[0] && checkTeamMatchDet[0].nextMatchNumber) {

                                        var checkTeamMatchDetPres = MatchCollectionDB.aggregate([{
                                            $match: {
                                                "tournamentId": xData.tournamentId,
                                                "eventName": xData.eventName
                                            }
                                        }, {
                                            $unwind: {
                                                path: "$matchRecords"
                                            }
                                        }, {
                                            $match: {
                                                "matchRecords.roundName": "BM"
                                            }
                                        }])

                                        if (checkTeamMatchDetPres && checkTeamMatchDetPres.length && checkTeamMatchDetPres[0].matchRecords) {
                                            res.status = SUCCESS_STATUS
                                            res.data = checkTeamMatchDetPres[0].matchRecords
                                            res.message = TEAMS_INSERT_BM_SUCCESS_MSG
                                        } else {
                                            var nexSL = "A"
                                            if (checkTeamMatchDet[0].nextSlot == "A") {
                                                nexSL = "B"
                                            }

                                            var data = {
                                                "matchNumber": checkTeamMatchDet[0].nextMatchNumber,
                                                "nextMatchNumber": parseInt(checkTeamMatchDet[0].nextMatchNumber + 1),
                                                "status": "yetToPlay",
                                                "roundNumber": parseInt(checkTeamMatchDet[0].roundNumber + 2),
                                                "isBlank": false,
                                                "roundName": "BM",
                                                "players": {
                                                    "playerA": xData.playerAName,
                                                    "playerB": xData.playerBName
                                                },
                                                "playersID": {
                                                    "playerAId": xData.playerAId,
                                                    "playerBId": xData.playerBId,
                                                },
                                                "setWins": {
                                                    "playerANo": xData.playerANo,
                                                    "playerBNo": xData.playerBNo
                                                },
                                                "playersNo":{
                                                    "playerANo": xData.playerANo,
                                                    "playerBNo": xData.playerBNo
                                                },
                                                "nextSlot": nexSL,
                                                "scores": {
                                                    "setScoresA": [
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0
                                                    ],
                                                    "setScoresB": [
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0,
                                                        0
                                                    ]
                                                },
                                                "getStatusColorA": "ip_input_box_type_pName",
                                                "getStatusColorB": "ip_input_box_type_pNameLost",
                                                "winner": "",
                                                "loser": "",
                                                "winnerID": "",
                                                "selectedID": "",
                                            }
                                            var tmToInsert = MatchCollectionDB.update({
                                                tournamentId: xData.tournamentId,
                                                eventName: xData.eventName
                                            }, {
                                                "$addToSet": {
                                                    matchRecords: data
                                                }
                                            })

                                            if (tmToInsert) {
                                                var checkExists = MatchCollectionConfig.findOne({
                                                    "tournamentId": xData.tournamentId,
                                                    "eventName": xData.eventName,
                                                    "roundValues.roundName": "Bronze Medal"
                                                })
                                                var pullExist = MatchCollectionConfig.update({
                                                    "tournamentId": xData.tournamentId,
                                                    "eventName": xData.eventName,
                                                },{
                                                    "$pull":{
                                                        "roundValues":{"roundName": "Bronze Medal"}
                                                    }
                                                })
                                                if(pullExist){
                                                    checkExists = undefined
                                                }

                                                if (checkExists == undefined || checkExists == null) {
                                                    
                                                    var getMatColDet = MatchCollectionConfig.aggregate([{
                                                        $match: {
                                                            "tournamentId": xData.tournamentId,
                                                            "eventName": xData.eventName
                                                        }
                                                    }, {
                                                        $project: {
                                                            "roundValues": 1,
                                                            "projectId": 1,
                                                            "teamFormatId": 1,
                                                            "_id": 1
                                                        }
                                                    }])
                                                    if (getMatColDet && getMatColDet.length) {
                                                        if (getMatColDet[0].roundValues && getMatColDet[0].roundValues.length) {
                                                            var roundDataToIns = {
                                                                "roundNumber": parseInt(checkTeamMatchDet[0].roundNumber + 2),
                                                                "roundName": "Bronze Medal",
                                                                "noofSets": xData.noofSets,
                                                                "minScores": xData.minScores,
                                                                "minDifference": xData.minDifference,
                                                                "points": xData.points
                                                            }
                                                            var lastData2 = getMatColDet[0].roundValues[getMatColDet[0].roundValues.length - 1]
                                                            var lastData = getMatColDet[0].roundValues[getMatColDet[0].roundValues.length - 2]
                                                            getMatColDet[0].roundValues[getMatColDet[0].roundValues.length - 2] = roundDataToIns
                                                            getMatColDet[0].roundValues[getMatColDet[0].roundValues.length - 1] = lastData
                                                            getMatColDet[0].roundValues.push(lastData2)

                                                            var delMat = MatchCollectionConfig.remove({
                                                                "tournamentId": xData.tournamentId,
                                                                "eventName": xData.eventName
                                                            })
                                                            var insertAgain = MatchCollectionConfig.insert({
                                                                "_id": getMatColDet[0]._id,
                                                                "tournamentId": xData.tournamentId,
                                                                "eventName": xData.eventName,
                                                                "roundValues": getMatColDet[0].roundValues,
                                                                "projectId": getMatColDet[0].projectId,
                                                                "teamFormatId": getMatColDet[0].teamFormatId
                                                            })
                                                        }
                                                    }
                                                }
                                                if (tmToInsert) {

                                                    var checkTeamMatchDetPres = MatchCollectionDB.aggregate([{
                                                        $match: {
                                                            "tournamentId": xData.tournamentId,
                                                            "eventName": xData.eventName
                                                        }
                                                    }, {
                                                        $unwind: {
                                                            path: "$matchRecords"
                                                        }
                                                    }, {
                                                        $match: {
                                                            "matchRecords.roundName": "BM"
                                                        }
                                                    }])

                                                    if (checkTeamMatchDetPres && checkTeamMatchDetPres.length && checkTeamMatchDetPres[0].matchRecords) {
                                                        res.status = SUCCESS_STATUS
                                                        res.data = checkTeamMatchDetPres[0].matchRecords
                                                        res.message = TEAMS_INSERT_BM_SUCCESS_MSG
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        res.message = TEAMS_GET_MATCH_REC_FAIL_MSG
                                    }
                                }
                            } else {
                                res.message = checkValidTourn
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
})


Meteor.methods({
    "fetchLoserForBMRoundDataInd": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": IND_GET_LOSERS_BM_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var validTournDet = sTeams.checkValidTournamentIDEvent(true);
                                if (validTournDet && validTournDet.projectType == 1) {
                                    var teamMatRec = MatchCollectionDB.aggregate([{
                                        $match: {
                                            "tournamentId": xData.tournamentId,
                                            "eventName": xData.eventName
                                        }
                                    }, {
                                        $unwind: {
                                            path: "$matchRecords"
                                        }
                                    }, {
                                        $match: {
                                            "matchRecords.roundName": "SF"
                                        }
                                    }]);
                                    var dataToSend = {

                                    }

                                    if (teamMatRec && teamMatRec.length) {
                                        for (var i = 0; i < teamMatRec.length; i++) {
                                            if (teamMatRec[i].matchRecords.status &&
                                                teamMatRec[i].matchRecords.status.toLowerCase() != "yettoplay") {
                                                if (teamMatRec[i].matchRecords.winnerID && teamMatRec[i].matchRecords.playersID) {
                                                    if (teamMatRec[i].matchRecords.winnerID == teamMatRec[i].matchRecords.playersID.playerAId) {

                                                        if(teamMatRec[i].matchRecords.playersNo &&
                                                            teamMatRec[i].matchRecords.playersNo.playerANo &&
                                                            teamMatRec[i].matchRecords.playersNo &&
                                                            teamMatRec[i].matchRecords.playersNo.playerBNo){

                                                        }
                                                        else {
                                                            teamMatRec[i].matchRecords.playersNo = {
                                                                "playerANo":"",
                                                                "playerBNo":""
                                                            }
                                                        }

                                                        dataToSend["player" + parseInt(i + 1) + "Id"] = teamMatRec[i].matchRecords.playersID.playerBId
                                                        var findTeamName = Meteor.users.findOne({
                                                            "userId": teamMatRec[i].matchRecords.playersID.playerBId
                                                        })


                                                        if (findTeamName && findTeamName.userName) {
                                                            dataToSend["player" + parseInt(i + 1) + "Name"] = findTeamName.userName
                                                        }
                                                        if (teamMatRec[i].matchRecords.playersNo.playerANo != null &&
                                                            teamMatRec[i].matchRecords.playersNo.playerANo != undefined) {
                                                            dataToSend["player" + parseInt(i + 1) + "No"] = teamMatRec[i].matchRecords.playersNo.playerANo
                                                        }
                                                    } else if (teamMatRec[i].matchRecords.winnerID == teamMatRec[i].matchRecords.playersID.playerBId) {
                                                        dataToSend["player" + parseInt(i + 1) + "Id"] = teamMatRec[i].matchRecords.playersID.playerAId
                                                        var findTeamName = Meteor.users.findOne({
                                                            "_id": teamMatRec[i].matchRecords.playersID.playerAId
                                                        })
                                                        if(teamMatRec[i].matchRecords.playersNo &&
                                                            teamMatRec[i].matchRecords.playersNo.playerANo &&
                                                            teamMatRec[i].matchRecords.playersNo &&
                                                            teamMatRec[i].matchRecords.playersNo.playerBNo){

                                                        }
                                                        else {
                                                            teamMatRec[i].matchRecords.playersNo = {
                                                                "playerANo":"",
                                                                "playerBNo":""
                                                            }
                                                        }


                                                        if (findTeamName && findTeamName.userName) {
                                                            dataToSend["player" + parseInt(i + 1) + "Name"] = findTeamName.userName
                                                        }

                                                        if (teamMatRec[i].matchRecords.playersNo.playerBNo != null &&
                                                            teamMatRec[i].matchRecords.playersNo.playerBNo != undefined) {
                                                            dataToSend["player" + parseInt(i + 1) + "No"] = teamMatRec[i].matchRecords.playersNo.playerBNo
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (dataToSend.player1Id && dataToSend.player2Id) {
                                        res.message = IND_GET_LOSERS_BM_SUCCESS_MSG
                                        res.data = dataToSend
                                        res.status = SUCCESS_STATUS

                                        if (xData.BMRound == true) {
                                            if (true) {

                                                var checkTeamMatchDetPres = MatchCollectionDB.aggregate([{
                                                    $match: {
                                                        "tournamentId": xData.tournamentId,
                                                        "eventName": xData.eventName
                                                    }
                                                }, {
                                                    $unwind: {
                                                        path: "$matchRecords"
                                                    }
                                                }, {
                                                    $match: {
                                                        "matchRecords.roundName": "BM"
                                                    }
                                                }])

                                                if (checkTeamMatchDetPres && checkTeamMatchDetPres.length && checkTeamMatchDetPres[0].matchRecords) {
                                                    res.data = checkTeamMatchDetPres[0].matchRecords
                                                } else {
                                                    res.data = false
                                                    res.status = FAIL_STATUS
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                res.message = checkValidTourn
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
          
            return res
        } catch (e) {
            console.log(e)
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
});


Meteor.methods({
    "checkRoundDataBMInd": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": IND_FIND_BM_ROUND_DET_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var validTournDet = sTeams.checkValidTournamentIDEvent(true);
                                if (validTournDet && validTournDet.projectType == 1) {
                                    var matchDetRounds = MatchCollectionConfig.findOne({
                                        "tournamentId": xData.tournamentId,
                                        "eventName": xData.eventName,
                                        "roundValues.roundName": "Bronze Medal"
                                    })

                                    if (matchDetRounds) {
                                        res.message = IND_FIND_BM_ROUND_DET_SUCCESS_MSG
                                        res.data = matchDetRounds
                                        res.status = SUCCESS_STATUS
                                    }
                                }
                            } else {
                                res.message = checkValidTourn
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
});

Meteor.methods({
    "validationsForIndRoundBMData": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": IND_FIND_BM_ROUND_DET_VALID_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nullSets = sTeams.nullUndefinedEmpty("noofSets")
                var nullminDiff = sTeams.nullUndefinedEmpty("minDifference")
                var nullminScores = sTeams.nullUndefinedEmpty("minScores")
                var nullpoints = sTeams.nullUndefinedEmpty("points")
                if (nullSets == "1") {
                    if (nullminDiff == "1") {
                        if (nullminScores == "1") {
                            if (nullpoints == "1") {
                                var validNum = sTeams.validateNumb("noofSets")
                                if (validNum == "1") {
                                    var validNum1 = sTeams.validateNumb("minDifference")
                                    if (validNum1 == "1") {
                                        var validNum2 = sTeams.validateNumb("minScores")
                                        if (validNum2 == "1") {
                                            var validNum3 = sTeams.validateNumb("points")
                                            if (validNum3 == "1") {
                                                var validOdd = sTeams.validateOddNum("noofSets")
                                                if (validOdd == "1") {
                                                    res.message = IND_FIND_BM_ROUND_DET_VALID_SUCCESS_MSG
                                                    res.status = SUCCESS_STATUS
                                                } else {
                                                    res.message = validOdd
                                                }
                                            } else {
                                                res.message = validNum3
                                            }
                                        } else {
                                            res.message = validNum2
                                        }
                                    } else {
                                        res.message = validNum1
                                    }
                                } else {
                                    res.message = validNum
                                }
                            } else {
                                res.message = nullpoints
                            }
                        } else {
                            res.message = nullminScores
                        }
                    } else {
                        res.message = nullminDiff
                    }
                } else {
                    res.message = nullSets
                }

            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }

    }
})

Meteor.methods({
    "changeBMRoundConfig": function(xData) {
        var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": IND_FIND_BM_ROUND_DET_FAIL_MSG
        }
        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sTeams = new TeamsFormats(xData)
                var nulltournamentId = sTeams.nullUndefinedEmpty("tournamentId")
                var nullEventName = sTeams.nullUndefinedEmpty("eventName")
                if (nulltournamentId == "1") {
                    if (nullEventName == "1") {
                        var checkValidTourn = sTeams.checkValidTournamentID()
                        if (checkValidTourn == "1") {
                            var checkValidTournEve = sTeams.checkValidTournamentIDEvent()
                            if (checkValidTournEve == "1") {
                                var validTournDet = sTeams.checkValidTournamentIDEvent(true);
                                if (validTournDet && validTournDet.projectType == 1) {
                                    var r = MatchCollectionDB.update({
                                        tournamentId: xData.tournamentId,
                                        eventName: xData.eventName
                                    }, {
                                        $pull: {
                                            matchRecords: {
                                                "roundName": "BM"
                                            }
                                        }
                                    });
                                    var r1 = MatchCollectionConfig.update({
                                        tournamentId: xData.tournamentId,
                                        eventName: xData.eventName
                                    }, {
                                        $pull: {
                                            roundValues: {
                                                "roundName": "Bronze Medal"
                                            }
                                        }
                                    })

                                    if(r && r1){
                                        res.status = SUCCESS_STATUS
                                        res.message = "Can reset"
                                    }
                                }
                            } else {
                                res.message = checkValidTourn
                            }
                        } else {
                            res.message = checkValidTourn
                        }
                    } else {
                        res.message = nullEventName
                    }
                } else {
                    res.message = nulltournamentId
                }
            } else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
        }
    }
});