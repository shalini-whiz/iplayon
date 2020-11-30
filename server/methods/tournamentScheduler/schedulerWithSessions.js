import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({
    "scheduleTimerUpdate": function(xDAta,checkForEmptyTablesb) {
        try {
            if(checkForEmptyTablesb){
                var r = checkForEmptyTables(xDAta)
                return r
            }else{
                var r = schedulerWithSessions(xDAta)
                return r
            }
        } catch (e) {
        }
    }
})

function checkForEmptyTables(xDAta) {
    var dataTORetMain = {result:true,message:"No empty tables or no unassigned matches or no unassigned duration"}
    try {
        var tableMax = 0
        var order1Max = 16
        var tableassign = 0
        var tableAssignedNum = 0

        var startTime = xDAta.startTime
        var endTime = xDAta.endTime
        var dt1 = moment(startTime, ["h:mm:ss A"]).format("HH:mm:ss");
        var dt2 = moment(endTime, ["h:mm:ss A"]).format("HH:mm:ss");

        var oldDt1 = dt1
        var bt3 = 0;
        var bt4 = 0;
        var selectedDate = xDAta.selectedDate
        var duration = xDAta.durationOfEachMatch

        var bt5 = 0;
        var bt6 = 0;
        var tableNumbers = xDAta.tableNumbers.split(",")
        tableMax = parseInt(tableNumbers.length)
        var s = ""
        var scheduledDataToReturn = []
        var roundsSelectedArray = []
        var finalUnassinmatch  = []

        for (var i = 0; i < xDAta.selectedData.length; i++) {
            var filterForOrder = xDAta.selectedData
            var assignedMatchNum = []
            var unAssignedMatchNum = []
            var scheduledataToRet = []

            if (i == 0) {
                s = TimeValidation(dt1, dt2, bt3, bt4, bt5, bt6, duration, selectedDate)
            }

            var remainingTableNum = 0
            var lastInsertedDate = ""
            var lastInsertedTimeStart = ""
            

            var updateInside = false
            var updateForNewRound = false
            var insertForNewDate = true
            var allmatchNum = filterForOrder[i].matchNumbers

            var eventId = filterForOrder[i].eventId
            var round = filterForOrder[i].roundName

            var checforrounds = false
                //check for existing rounds
            var chekrou = tournamentSchedule.aggregate([{
                $match: {
                    tournamentId: xDAta.tournamentId,
                }
            }, {
                $unwind: "$scheduledData"
            }, {
                $match: {
                    "scheduledData.eventId": eventId
                }
            }, {
                $project: {
                    "rou": "$scheduledData.round"
                }
            }, {
                $group: {
                    "_id": null,
                    "roundsArr": {
                        "$addToSet": "$rou"
                    }
                }
            }])
            if (chekrou && chekrou[0] && chekrou[0].roundsArr) {
                //check this round is exists
                if (_.contains(chekrou[0].roundsArr, round)) {
                    checforrounds = true
                }
            } else {

            }
            var checkForEventName = []
            var getForRoundEVe = []
            if (checforrounds) {
                //get unassigned and assigned match nums
                checkForEventName = tournamentSchedule.aggregate([{
                    $match: {
                        tournamentId: xDAta.tournamentId,
                    }
                }, {
                    $unwind: "$scheduledData"
                }, {
                    $match: {
                        "scheduledData.eventId": eventId,
                        "scheduledData.round": round
                    }
                }, {
                    $project: {
                        "un": "$scheduledData.unAssignedMatchNum",
                    }
                }, {
                    $unwind: "$un"
                }, {
                    $group: {
                        "_id": null,
                        un: {
                            $addToSet: "$un"
                        }
                    }
                }])



                if (checkForEventName && checkForEventName[0] && checkForEventName[0].un) {
                    getForRoundEVe = tournamentSchedule.aggregate([{
                        $match: {
                            tournamentId: xDAta.tournamentId,
                            selectedDate: xDAta.selectedDate
                        }
                    }, {
                        $unwind: "$scheduledData"
                    }, {
                        $match: {
                            "scheduledData.eventId": eventId,
                            "scheduledData.round": round
                        }
                    }, {
                        $project: {
                            "schedule": "$scheduledData.schedule",
                            "assign": "$scheduledData.assignedMatchNum"
                        }
                    }])


                    filterForOrder[i].matchNumbers = _.sortBy(checkForEventName[0].un, function(num) {
                        return parseInt(num);
                    });

                    if (tournamentSchedule.findOne({
                            tournamentId: xDAta.tournamentId,
                            selectedDate: xDAta.selectedDate
                        }))
                        updateInside = true
                } else {
                    checkForEventName = tournamentSchedule.aggregate([{
                        $match: {
                            tournamentId: xDAta.tournamentId,
                        }
                    }, {
                        $unwind: "$scheduledData"
                    }, {
                        $match: {
                            "scheduledData.eventId": eventId,
                            "scheduledData.round": round
                        }
                    }, {
                        $project: {
                            "un": "$scheduledData.assignedMatchNum",
                        }
                    }, {
                        $unwind: "$un"
                    }, {
                        $group: {
                            "_id": null,
                            un: {
                                $addToSet: "$un"
                            }
                        }
                    }])
                    if (checkForEventName && checkForEventName[0] && checkForEventName[0].un) {
                        filterForOrder[i].matchNumbers = []
                        insertForNewDate = false
                    }
                }
            } else {
                //insert should happen for new round
                if (tournamentSchedule.findOne({
                        tournamentId: xDAta.tournamentId,
                        selectedDate: xDAta.selectedDate
                    }))
                    updateForNewRound = true
            }


            for (var j = 0; j < filterForOrder[i].matchNumbers.length; j++) {
                var scheduledata = {}

                if (filterForOrder[i].matchNumbers[j]) {

                    if (tableassign == 0) {
                        tableassign = tableNumbers[tableAssignedNum]
                        tableAssignedNum = tableAssignedNum + 1
                    } else {
                        tableassign = tableNumbers[tableAssignedNum]
                        tableAssignedNum = tableAssignedNum + 1
                    }

                    if (tableAssignedNum > tableMax) {
                        tableAssignedNum = 0
                        tableassign = tableNumbers[tableAssignedNum]
                        s = TimeValidation(dt1, dt2, bt3, bt4, bt5, bt6, duration, selectedDate)
                        tableAssignedNum = tableAssignedNum + 1
                    }


                    if (s) {
                        if (s && s.endtime != 0) {
                            oldDt1 = s.oldTime
                            dt1 = moment(s.endtime, ["h:mm:ss A"]).format("HH:mm:ss")
                            assignedMatchNum.push(filterForOrder[i].matchNumbers[j])
                            scheduledata = {
                                round: filterForOrder[i].roundName,
                                match: filterForOrder[i].matchNumbers[j],
                                time: moment(oldDt1, ["HH:mm:ss"]).format("h:mm:ss A"),
                                endTime: moment(dt1, ["HH:mm:ss"]).format("h:mm:ss A"),
                                dateOfEvent: xDAta.selectedDate,
                                dateOfEventMoment: xDAta.selectedDate,
                                table: "T" + tableassign,
                                order: filterForOrder[i].order,
                                starttimesession: xDAta.startTime,
                                endtimesession: xDAta.endTime
                            }
                            scheduledataToRet.push(scheduledata)
                        } else if (s.endtime == 0) {
                            oldDt1 = 0
                            dt1 = 0
                            tableassign = "0"
                            unAssignedMatchNum = filterForOrder[i].matchNumbers.slice(j, filterForOrder[i].matchNumbers.length)
                                //unAssignedMatchNum.push(filterForOrder[i].matchNumbers[j])
                            finalUnassinmatch = finalUnassinmatch.concat(unAssignedMatchNum)
                               
                            break;
                        }
                    }
                }


                remainingTableNum = tableassign
                if(oldDt1 == undefined){
                    lastInsertedDate = 0
                }
                else
                    lastInsertedDate = oldDt1

                if(dt1 == undefined){
                    lastInsertedTimeStart = 0
                }
                else
                lastInsertedTimeStart = dt1

                
            }

            if (updateInside && getForRoundEVe && getForRoundEVe[0] && getForRoundEVe[0].schedule) {
                scheduledataToRet = getForRoundEVe[0].schedule.concat(scheduledataToRet)

                if (getForRoundEVe[0].assign) {
                    assignedMatchNum = getForRoundEVe[0].assign.concat(assignedMatchNum)
                }
            }


            var schDataToReturn = {
                eventName: filterForOrder[i].eventName,
                round: filterForOrder[i].roundName,
                everound: filterForOrder[i].eventName + "||" + filterForOrder[i].roundName,
                matchNumbers: allmatchNum,
                matchNumbersasString: allmatchNum.toString(),
                assignedMatchNum: assignedMatchNum,
                unAssignedMatchNum: unAssignedMatchNum,
                order: filterForOrder[i].order,
                abbName: filterForOrder[i].abbName,
                eventId: filterForOrder[i].eventId,
                tournamentId: xDAta.tournamentId,
                projectType: filterForOrder[i].projectType,
                duration: xDAta.durationOfEachMatch,
                starttimesession: xDAta.startTime,
                endtimesession: xDAta.endTime,
                noOfTablessession: xDAta.tableNumbers,
                sessionNumber: "1",
                schedule: scheduledataToRet,
                selectedDate: xDAta.selectedDate
            }


            if (updateInside) {
                /*schDataToReturn["matchNumbers"] = allmatchNum
                schDataToReturn["matchNumbersasString"] = allmatchNum.toString()
                checkForEventNameAndRound(schDataToReturn, true)
                insertForNewDate = false
                var k = tournamentSchedule.update({
                    tournamentId: xDAta.tournamentId,
                    "scheduledData": {
                        $elemMatch: {
                            "eventName": filterForOrder[i].eventName,
                            "round": filterForOrder[i].roundName,
                        }
                    }
                }, {
                    $set: {
                        "scheduledData.$.unAssignedMatchNum": unAssignedMatchNum
                    }
                }, {
                    multi: true
                })

                if (_.contains(roundsSelectedArray, filterForOrder[i].roundName) == false) {
                    roundsSelectedArray.push(filterForOrder[i].roundName)
                }*/
                scheduledDataToReturn.push(schDataToReturn)
            } else if (updateForNewRound == true) {
                /*checkForEventNameAndRound(schDataToReturn, false)
                insertForNewDate = false
                var k = tournamentSchedule.update({
                    tournamentId: xDAta.tournamentId,
                    "scheduledData": {
                        $elemMatch: {
                            "eventName": filterForOrder[i].eventName,
                            "round": filterForOrder[i].roundName,
                        }
                    }
                }, {
                    $set: {
                        "scheduledData.$.unAssignedMatchNum": unAssignedMatchNum
                    }
                }, {
                    multi: true
                })
                if (_.contains(roundsSelectedArray, filterForOrder[i].roundName) == false) {
                    roundsSelectedArray.push(filterForOrder[i].roundName)
                }*/
                scheduledDataToReturn.push(schDataToReturn)

            } else if (updateInside == false && updateForNewRound == false) {
                /*var k = tournamentSchedule.update({
                    tournamentId: xDAta.tournamentId,
                    "scheduledData": {
                        $elemMatch: {
                            "eventName": filterForOrder[i].eventName,
                            "round": filterForOrder[i].roundName,
                        }
                    }
                }, {
                    $set: {
                        "scheduledData.$.unAssignedMatchNum": unAssignedMatchNum
                    }
                }, {
                    multi: true
                })*/

                if (_.contains(roundsSelectedArray, filterForOrder[i].roundName) == false) {
                    roundsSelectedArray.push(filterForOrder[i].roundName)
                }
                scheduledDataToReturn.push(schDataToReturn)
            }

        }

        var dataToReturn = {
            eventName: filterForOrder[0].eventName,
            tournamentId: xDAta.tournamentId,
            selectedDate: xDAta.selectedDate,
            selectedDateMoment: xDAta.selectedDate,
            scheduledData: scheduledDataToReturn,
            roundsSelected: roundsSelectedArray
        }

        if (dataToReturn) {

            if(lastInsertedTimeStart == 0){
            }
            //each duration is assigned but tables are remain empty
            if(moment(lastInsertedTimeStart, ["h:mm:ss A"]).format("HH:mm:ss")
                < moment(endTime, ["h:mm:ss A"]).format("HH:mm:ss")){
                var sind = _.indexOf(tableNumbers, remainingTableNum);
                if(sind >= 0){
                    var rem = tableNumbers.slice(sind+1,tableNumbers.length)
                    if(rem && rem.length != 0) {
                        dataTORetMain = {
                            result: false,
                            message:"After "+ lastInsertedTimeStart +  " No. "+ rem.toString() + " tables become empty"
                        }

                    }
                    else{
                        dataTORetMain = {
                            result: false,
                            message:"After "+ lastInsertedTimeStart + " all tables become empty"
                        }
                    }
                }

            }
            else if(remainingTableNum!=tableNumbers[tableNumbers.length - 1] && lastInsertedTimeStart != 0){
                tableNumbers[remainingTableNum]

                var sind = _.indexOf(tableNumbers, remainingTableNum);
                if(sind >= 0){
                    var rem = tableNumbers.slice(sind+1,tableNumbers.length)
                    dataTORetMain = {
                        result: false,
                        message: "No. " + rem.toString() + " Tables become empty"
                    }
                }

            }

            
            if(finalUnassinmatch.length != 0){
                if(finalUnassinmatch.length > 1){
                    dataTORetMain = {
                        result: false,
                        message: "Match nos. " +finalUnassinmatch.toString().substring(finalUnassinmatch.length, 5)
                        +"...."  + " are unassigned"
                    }
                }
                else{
                    dataTORetMain = {
                        result: false,
                        message: "Match nos. " +finalUnassinmatch + " are unassigned"
                    }
                }
            }
            //eac

            /*var check = tournamentSchedule.findOne({
                tournamentId: dataToReturn.tournamentId,
                selectedDate: dataToReturn.selectedDate
            })

            if (check != undefined) {
                //check for tablens
                var tablnosDb = tournamentScheduleTableNos.find({
                    selectedDate: xDAta.selectedDate,
                    tournamentId: xDAta.tournamentId
                }).fetch()
                var sessionNumberCount = 0
                if (tablnosDb.length != 0) {
                    sessionNumberCount = tablnosDb.length
                }

                var tabDBIns = tournamentScheduleTableNos.insert({
                    selectedDate: xDAta.selectedDate,
                    selectedDateMoment: xDAta.selectedDate,
                    sessionNumber: parseInt(sessionNumberCount + 1),
                    tournamentId: xDAta.tournamentId,
                    eventName: dataToReturn.eventName,
                    starttimesession: moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss"),
                    endtimesession: moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss"),
                    noOfTables: xDAta.tableNumbers.split(","),
                    roundsSelected: dataToReturn.roundsSelected,
                    duration: xDAta.durationOfEachMatch
                })
                if (tabDBIns) {
                    dataTORetMain = {
                        result: true,
                        message: "Data saved"
                    }
                } else {
                    dataTORetMain = {
                        result: false,
                        message: "Cannot save, check again"
                    }
                }
            }

            if (xDAta.type && xDAta.type == "update" && insertForNewDate) {

                if (check == undefined) {
                    //create the record
                    let id = tournamentSchedule.insert(dataToReturn)

                    if (id) {
                        //check for tablens
                        var tablnosDb = tournamentScheduleTableNos.find({
                            selectedDate: xDAta.selectedDate,
                            tournamentId: xDAta.tournamentId
                        }).fetch()
                        var sessionNumberCount = 0
                        if (tablnosDb.length != 0) {
                            sessionNumberCount = tablnosDb.length
                        }


                        var tabDBIns = tournamentScheduleTableNos.insert({
                            selectedDate: xDAta.selectedDate,
                            selectedDateMoment: xDAta.selectedDate,
                            sessionNumber: parseInt(sessionNumberCount + 1),
                            tournamentId: xDAta.tournamentId,
                            eventName: xDAta.eventNameSer,
                            starttimesession: moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss"),
                            endtimesession: moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss"),
                            noOfTables: xDAta.tableNumbers.split(","),
                            roundsSelected: roundsSelectedArray,
                            duration: xDAta.durationOfEachMatch
                        })
                        if (tabDBIns) {
                            dataTORetMain = {
                                result: true,
                                message: "data saved"
                            }
                        } else {
                            dataTORetMain = {
                                result: false,
                                message: "Cannot save, check again"
                            }
                        }
                    } else {
                        dataTORetMain = {
                            result: false,
                            message: "cannot insert"
                        }
                    }
                } else if (check != undefined) {

                }
            }*/
        }

        return dataTORetMain
    } catch (e) {
        dataTORetMain = {
            result: false,
            message: e
        }
        return dataTORetMain
    }
}

function schedulerWithSessions(xDAta) {
    var dataTORetMain = {}
    try {
        var tableMax = 0
        var order1Max = 16
        var tableassign = 0
        var tableAssignedNum = 0

        var startTime = xDAta.startTime
        var endTime = xDAta.endTime
        var dt1 = moment(startTime, ["h:mm:ss A"]).format("HH:mm:ss");
        var dt2 = moment(endTime, ["h:mm:ss A"]).format("HH:mm:ss");

        var oldDt1 = dt1
        var bt3 = 0;
        var bt4 = 0;
        var selectedDate = xDAta.selectedDate
        var duration = xDAta.durationOfEachMatch

        var bt5 = 0;
        var bt6 = 0;
        var tableNumbers = xDAta.tableNumbers.split(",")
        tableMax = parseInt(tableNumbers.length)
        var s = ""
        var scheduledDataToReturn = []
        var roundsSelectedArray = []
        for (var i = 0; i < xDAta.selectedData.length; i++) {
            var filterForOrder = xDAta.selectedData
            var assignedMatchNum = []
            var unAssignedMatchNum = []
            var scheduledataToRet = []

            if (i == 0) {
                s = TimeValidation(dt1, dt2, bt3, bt4, bt5, bt6, duration, selectedDate)
            }

            var updateInside = false
            var updateForNewRound = false
            var insertForNewDate = true
            var allmatchNum = filterForOrder[i].matchNumbers

            var eventId = filterForOrder[i].eventId
            var round = filterForOrder[i].roundName

            var checforrounds = false
                //check for existing rounds
            var chekrou = tournamentSchedule.aggregate([{
                $match: {
                    tournamentId: xDAta.tournamentId,
                }
            }, {
                $unwind: "$scheduledData"
            }, {
                $match: {
                    "scheduledData.eventId": eventId
                }
            }, {
                $project: {
                    "rou": "$scheduledData.round"
                }
            }, {
                $group: {
                    "_id": null,
                    "roundsArr": {
                        "$addToSet": "$rou"
                    }
                }
            }])
            if (chekrou && chekrou[0] && chekrou[0].roundsArr) {
                //check this round is exists
                if (_.contains(chekrou[0].roundsArr, round)) {
                    checforrounds = true
                }
            } else {

            }
            var checkForEventName = []
            var getForRoundEVe = []
            if (checforrounds) {
                //get unassigned and assigned match nums
                checkForEventName = tournamentSchedule.aggregate([{
                    $match: {
                        tournamentId: xDAta.tournamentId,
                    }
                }, {
                    $unwind: "$scheduledData"
                }, {
                    $match: {
                        "scheduledData.eventId": eventId,
                        "scheduledData.round": round
                    }
                }, {
                    $project: {
                        "un": "$scheduledData.unAssignedMatchNum",
                    }
                }, {
                    $unwind: "$un"
                }, {
                    $group: {
                        "_id": null,
                        un: {
                            $addToSet: "$un"
                        }
                    }
                }])



                if (checkForEventName && checkForEventName[0] && checkForEventName[0].un) {
                    getForRoundEVe = tournamentSchedule.aggregate([{
                        $match: {
                            tournamentId: xDAta.tournamentId,
                            selectedDate: xDAta.selectedDate
                        }
                    }, {
                        $unwind: "$scheduledData"
                    }, {
                        $match: {
                            "scheduledData.eventId": eventId,
                            "scheduledData.round": round
                        }
                    }, {
                        $project: {
                            "schedule": "$scheduledData.schedule",
                            "assign": "$scheduledData.assignedMatchNum"
                        }
                    }])


                    filterForOrder[i].matchNumbers = _.sortBy(checkForEventName[0].un, function(num) {
                        return parseInt(num);
                    });

                    if (tournamentSchedule.findOne({
                            tournamentId: xDAta.tournamentId,
                            selectedDate: xDAta.selectedDate
                        }))
                        updateInside = true
                } else {
                    checkForEventName = tournamentSchedule.aggregate([{
                        $match: {
                            tournamentId: xDAta.tournamentId,
                        }
                    }, {
                        $unwind: "$scheduledData"
                    }, {
                        $match: {
                            "scheduledData.eventId": eventId,
                            "scheduledData.round": round
                        }
                    }, {
                        $project: {
                            "un": "$scheduledData.assignedMatchNum",
                        }
                    }, {
                        $unwind: "$un"
                    }, {
                        $group: {
                            "_id": null,
                            un: {
                                $addToSet: "$un"
                            }
                        }
                    }])
                    if (checkForEventName && checkForEventName[0] && checkForEventName[0].un) {
                        filterForOrder[i].matchNumbers = []
                        insertForNewDate = false
                    }
                }
            } else {
                //insert should happen for new round
                if (tournamentSchedule.findOne({
                        tournamentId: xDAta.tournamentId,
                        selectedDate: xDAta.selectedDate
                    }))
                    updateForNewRound = true
            }


            for (var j = 0; j < filterForOrder[i].matchNumbers.length; j++) {
                var scheduledata = {}

                if (filterForOrder[i].matchNumbers[j]) {

                    if (tableassign == 0) {
                        tableassign = tableNumbers[tableAssignedNum]
                        tableAssignedNum = tableAssignedNum + 1
                    } else {
                        tableassign = tableNumbers[tableAssignedNum]
                        tableAssignedNum = tableAssignedNum + 1
                    }

                    if (tableAssignedNum > tableMax) {
                        tableAssignedNum = 0
                        tableassign = tableNumbers[tableAssignedNum]
                        s = TimeValidation(dt1, dt2, bt3, bt4, bt5, bt6, duration, selectedDate)
                        tableAssignedNum = tableAssignedNum + 1
                    }


                    if (s) {
                        if (s && s.endtime != 0) {
                            oldDt1 = s.oldTime
                            dt1 = moment(s.endtime, ["h:mm:ss A"]).format("HH:mm:ss")
                            assignedMatchNum.push(filterForOrder[i].matchNumbers[j])

                            var sISO = moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss")
                            var eISO = moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss")
                            var starttimesessionISO = moment(new Date(xDAta.selectedDate+ ' ' + sISO)).format("YYYY-MM-DD hh:mm:ss")
                            var endtimesessionISO = moment(new Date(xDAta.selectedDate+ ' ' + eISO)).format("YYYY-MM-DD hh:mm:ss")


                            var sISO2 = moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss")
                            var eISO2 = moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss")
                            var timeISO = moment(new Date(xDAta.selectedDate+ ' ' + oldDt1)).format("YYYY-MM-DD hh:mm:ss")
                            var endTimeISO = moment(new Date(xDAta.selectedDate+ ' ' + dt1)).format("YYYY-MM-DD hh:mm:ss")

                            scheduledata = {
                                round: filterForOrder[i].roundName,
                                match: filterForOrder[i].matchNumbers[j],
                                matchInt:parseInt(filterForOrder[i].matchNumbers[j]),
                                time: moment(oldDt1, ["HH:mm:ss"]).format("h:mm:ss A"),
                                endTime: moment(dt1, ["HH:mm:ss"]).format("h:mm:ss A"),
                                dateOfEvent: xDAta.selectedDate,
                                dateOfEventMoment: xDAta.selectedDate,
                                table: "T" + tableassign,
                                order: filterForOrder[i].order,
                                starttimesession: xDAta.startTime,
                                starttimesessionISO:starttimesessionISO,
                                endtimesession: xDAta.endTime,
                                endtimesessionISO:endtimesessionISO,
                                timeISO:timeISO,
                                endTimeISO:endTimeISO
                            }
                            scheduledataToRet.push(scheduledata)
                        } else if (s.endtime == 0) {
                            oldDt1 = 0
                            dt1 = 0
                            tableassign = "0"
                            unAssignedMatchNum = filterForOrder[i].matchNumbers.slice(j, filterForOrder[i].matchNumbers.length)
                                //unAssignedMatchNum.push(filterForOrder[i].matchNumbers[j])

                            break;
                        }
                    }
                }


            }

            if (updateInside && getForRoundEVe && getForRoundEVe[0] && getForRoundEVe[0].schedule) {
                scheduledataToRet = getForRoundEVe[0].schedule.concat(scheduledataToRet)

                if (getForRoundEVe[0].assign) {
                    assignedMatchNum = getForRoundEVe[0].assign.concat(assignedMatchNum)
                }
            }


            var sISO = moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss")
            var eISO = moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss")
            var starttimesessionISO = moment(new Date(xDAta.selectedDate+ ' ' + sISO)).format("YYYY-MM-DD hh:mm:ss")
            var endtimesessionISO = moment(new Date(xDAta.selectedDate+ ' ' + eISO)).format("YYYY-MM-DD hh:mm:ss")


            var sISO2 = moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss")
            var eISO2 = moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss")
            

            var schDataToReturn = {
                eventName: filterForOrder[i].eventName,
                round: filterForOrder[i].roundName,
                everound: filterForOrder[i].eventName + "||" + filterForOrder[i].roundName,
                matchNumbers: allmatchNum,
                matchNumbersasString: allmatchNum.toString(),
                assignedMatchNum: assignedMatchNum,
                unAssignedMatchNum: unAssignedMatchNum,
                order: filterForOrder[i].order,
                abbName: filterForOrder[i].abbName,
                eventId: filterForOrder[i].eventId,
                tournamentId: xDAta.tournamentId,
                projectType: filterForOrder[i].projectType,
                duration: xDAta.durationOfEachMatch,
                starttimesession: xDAta.startTime,
                endtimesession: xDAta.endTime,
                noOfTablessession: xDAta.tableNumbers,
                sessionNumber: "1",
                schedule: scheduledataToRet,
                selectedDate: xDAta.selectedDate,
                starttimesessionISO:starttimesessionISO,
                endtimesessionISO:endtimesessionISO,
            }

            schDataToReturn["starttimesessionISO"] = moment(new Date(xDAta.selectedDate+ ' ' + schDataToReturn.starttimesession)).format("YYYY-MM-DD hh:mm:ss"),
            schDataToReturn["endtimesessionISO"] = moment(new Date(xDAta.selectedDate+ ' ' + schDataToReturn.endtimesession)).format("YYYY-MM-DD hh:mm:ss")

            if (updateInside) {
                schDataToReturn["matchNumbers"] = allmatchNum
                schDataToReturn["matchNumbersasString"] = allmatchNum.toString()

                checkForEventNameAndRound(schDataToReturn, true)
                insertForNewDate = false
                var k = tournamentSchedule.update({
                    tournamentId: xDAta.tournamentId,
                    "scheduledData": {
                        $elemMatch: {
                            "eventName": filterForOrder[i].eventName,
                            "round": filterForOrder[i].roundName,
                        }
                    }
                }, {
                    $set: {
                        "scheduledData.$.unAssignedMatchNum": unAssignedMatchNum
                    }
                }, {
                    multi: true
                })

                if(_.contains(roundsSelectedArray,filterForOrder[i].roundName) ==false){
                    roundsSelectedArray.push(filterForOrder[i].roundName)
                }
            } else if (updateForNewRound == true) {
                checkForEventNameAndRound(schDataToReturn, false)
                insertForNewDate = false
                var k = tournamentSchedule.update({
                    tournamentId: xDAta.tournamentId,
                    "scheduledData": {
                        $elemMatch: {
                            "eventName": filterForOrder[i].eventName,
                            "round": filterForOrder[i].roundName,
                        }
                    }
                }, {
                    $set: {
                        "scheduledData.$.unAssignedMatchNum": unAssignedMatchNum
                    }
                }, {
                    multi: true
                })
                if(_.contains(roundsSelectedArray,filterForOrder[i].roundName) ==false){
                    roundsSelectedArray.push(filterForOrder[i].roundName)
                }

            } else if (updateInside == false && updateForNewRound == false) {
                var k = tournamentSchedule.update({
                    tournamentId: xDAta.tournamentId,
                    "scheduledData": {
                        $elemMatch: {
                            "eventName": filterForOrder[i].eventName,
                            "round": filterForOrder[i].roundName,
                        }
                    }
                }, {
                    $set: {
                        "scheduledData.$.unAssignedMatchNum": unAssignedMatchNum
                    }
                }, {
                    multi: true
                })

                if(_.contains(roundsSelectedArray,filterForOrder[i].roundName) ==false){
                    roundsSelectedArray.push(filterForOrder[i].roundName)
                }
                scheduledDataToReturn.push(schDataToReturn)
            }

        }

        var dataToReturn = {
            eventName: filterForOrder[0].eventName,
            tournamentId: xDAta.tournamentId,
            selectedDate: xDAta.selectedDate,
            selectedDateMoment: xDAta.selectedDate,
            scheduledData: scheduledDataToReturn,
            roundsSelected:roundsSelectedArray
        }

        if (dataToReturn) {
            var check = tournamentSchedule.findOne({
                tournamentId: dataToReturn.tournamentId,
                selectedDate: dataToReturn.selectedDate
            })

            if (check != undefined) {
                //check for tablens
                var tablnosDb = tournamentScheduleTableNos.find({
                    selectedDate: xDAta.selectedDate,
                    tournamentId: xDAta.tournamentId
                }).fetch()
                var sessionNumberCount = 0
                if (tablnosDb.length != 0) {
                    sessionNumberCount = tablnosDb.length
                }

                var sISO = moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss")
                var eISO = moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss")
                starttimesessionISO = moment(new Date(xDAta.selectedDate+ ' ' + sISO)).format("YYYY-MM-DD hh:mm:ss")
                endtimesessionISO = moment(new Date(xDAta.selectedDate+ ' ' + eISO)).format("YYYY-MM-DD hh:mm:ss")

                var tabDBIns = tournamentScheduleTableNos.insert({
                    selectedDate: xDAta.selectedDate,
                    selectedDateMoment: xDAta.selectedDate,
                    sessionNumber: parseInt(sessionNumberCount + 1),
                    tournamentId: xDAta.tournamentId,
                    eventName: dataToReturn.eventName,
                    starttimesession: moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss"),
                    endtimesession: moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss"),
                    noOfTables: xDAta.tableNumbers.split(","),
                    roundsSelected:dataToReturn.roundsSelected,
                    duration: xDAta.durationOfEachMatch,
                    starttimesessionISO:starttimesessionISO,
                    endtimesessionISO:endtimesessionISO
                })
                if(tabDBIns){
                    dataTORetMain = {
                        result:true,
                        message:"Data saved"
                    }
                }else{
                    dataTORetMain = {
                        result:false,
                        message:"Cannot save, check again"
                    }
                }
            }

            if (xDAta.type && xDAta.type == "update" && insertForNewDate) {

                if (check == undefined) {
                    //create the record
                    let id = tournamentSchedule.insert(dataToReturn)

                    if (id) {
                        //check for tablens
                        var tablnosDb = tournamentScheduleTableNos.find({
                            selectedDate: xDAta.selectedDate,
                            tournamentId: xDAta.tournamentId
                        }).fetch()
                        var sessionNumberCount = 0
                        if (tablnosDb.length != 0) {
                            sessionNumberCount = tablnosDb.length
                        }

                        var sISO = moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss")
                        var eISO = moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss")
                        starttimesessionISO = moment(new Date(xDAta.selectedDate+ ' ' + sISO)).format("YYYY-MM-DD hh:mm:ss")
                        endtimesessionISO = moment(new Date(xDAta.selectedDate+ ' ' + eISO)).format("YYYY-MM-DD hh:mm:ss")

                        var tabDBIns = tournamentScheduleTableNos.insert({
                            selectedDate: xDAta.selectedDate,
                            selectedDateMoment: xDAta.selectedDate,
                            sessionNumber: parseInt(sessionNumberCount + 1),
                            tournamentId: xDAta.tournamentId,
                            eventName: xDAta.eventNameSer,
                            starttimesession: moment(xDAta.startTime, ["h:mm:ss A"]).format("HH:mm:ss"),
                            endtimesession: moment(xDAta.endTime, ["h:mm:ss A"]).format("HH:mm:ss"),
                            noOfTables: xDAta.tableNumbers.split(","),
                            roundsSelected:roundsSelectedArray,
                            duration: xDAta.durationOfEachMatch,
                            starttimesessionISO:starttimesessionISO,
                            endtimesessionISO:endtimesessionISO
                        })
                        if(tabDBIns){
                            dataTORetMain = {
                                result:true,
                                message:"data saved"
                            }
                        }
                        else{
                            dataTORetMain = {
                                result:false,
                                message:"Cannot save, check again"
                            }
                        }
                    }
                    else{
                        dataTORetMain = {
                            result:false,
                            message:"cannot insert"
                        }
                    }
                } else if (check != undefined) {

                }
            }
        }

        return dataTORetMain
    } catch (e) {
        dataTORetMain = {
            result:false,
            message:e
        }
        return dataTORetMain
    }   
}

function TimeValidation(dt1, dt2, bt3, bt4, bt5, bt6, duration, selectedDate) {
    try {
        var time = 0
        var endtime = 0
        if (dt1 == 0) {
            var data = {
                time: 0,
                endtime: 0
            }
            return data
        }

        time = moment(dt1, ["h:mm:ss A"]).format("HH:mm:ss");

        var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

        //if time is  greater to dt2, make time as zero, make endTime as zero
        if (parseInt(time.replace(regExp, "$1$2$3")) > parseInt(dt2.replace(regExp, "$1$2$3"))) {
            time = 0
            endtime = 0
        } else {
            //add time with duration and assign to endTime, 

            var endtimecheck = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

            if (moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')) {
                var data = {
                    time: 0,
                    endtime: 0
                }
                return data
            }

            endtime = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('hh:mm:ss A');
            endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");



            //check endTime with dt2, if endTime is greater to dt2, make time as zero, endTime as zero
            if (parseInt(endtime.replace(regExp, "$1$2$3")) > parseInt(dt2.replace(regExp, "$1$2$3"))) {
                var data = {
                    time: 0,
                    endtime: 0
                }
                return data
            }

            //if time is greater than or equal to bt3, and less than bt4, assign bt4 to time
            if (bt3 != 0 && bt4 != 0 && parseInt(time.replace(regExp, "$1$2$3")) >= parseInt(bt3.replace(regExp, "$1$2$3")) && parseInt(time.replace(regExp, "$1$2$3")) < parseInt(bt4.replace(regExp, "$1$2$3"))) {
                time = moment(bt4, ["h:mm:ss A"]).format("HH:mm:ss")

                //add duration to time and assign to endtime,  

                var endtimecheck = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

                if (moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')) {
                    var data = {
                        time: 0,
                        endtime: 0
                    }
                    return data
                }

                endtime = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('hh:mm:ss A');
                endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
            }

            if (bt5 != 0 && bt6 != 0 && parseInt(time.replace(regExp, "$1$2$3")) >= parseInt(bt5.replace(regExp, "$1$2$3")) && parseInt(time.replace(regExp, "$1$2$3")) < parseInt(bt6.replace(regExp, "$1$2$3"))) {
                time = moment(bt6, ["h:mm:ss A"]).format("HH:mm:ss")

                //add duration to time and assign to endtime,  

                var endtimecheck = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

                if (moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')) {
                    var data = {
                        time: 0,
                        endtime: 0
                    }
                    return data
                }

                endtime = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('hh:mm:ss A');
                endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
            }

            if (bt3 != 0 && bt4 != 0 && parseInt(endtime.replace(regExp, "$1$2$3")) > parseInt(bt3.replace(regExp, "$1$2$3")) && parseInt(endtime.replace(regExp, "$1$2$3")) <= parseInt(bt4.replace(regExp, "$1$2$3"))) {
                time = moment(bt4, ["h:mm:ss A"]).format("HH:mm:ss")

                //add duration to time and assign to endtime,  
                var endtimecheck = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

                if (moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')) {
                    var data = {
                        time: 0,
                        endtime: 0
                    }
                    return data
                }

                endtime = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('hh:mm:ss A');
                endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
            }

            if (bt6 != 0 && bt5 != 0 && parseInt(endtime.replace(regExp, "$1$2$3")) > parseInt(bt5.replace(regExp, "$1$2$3")) && parseInt(endtime.replace(regExp, "$1$2$3")) <= parseInt(bt6.replace(regExp, "$1$2$3"))) {
                time = moment(bt6, ["h:mm:ss A"]).format("HH:mm:ss")

                //add duration to time and assign to endtime,  

                var endtimecheck = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

                if (moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')) {
                    var data = {
                        time: 0,
                        endtime: 0
                    }
                    return data
                }

                endtime = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('hh:mm:ss A');
                endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
            }

            if (bt4 != 0 && parseInt(bt4.replace(regExp, "$1$2$3")) >= parseInt(time.replace(regExp, "$1$2$3")) && parseInt(bt4.replace(regExp, "$1$2$3")) <= parseInt(endtime.replace(regExp, "$1$2$3"))) {
                time = moment(bt4, ["h:mm:ss A"]).format("HH:mm:ss")

                //add duration to time and assign to endtime,  

                var endtimecheck = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

                if (moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')) {
                    var data = {
                        time: 0,
                        endtime: 0
                    }
                    return data
                }

                endtime = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('hh:mm:ss A');
                endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
            }

            if (bt6 != 0 && parseInt(bt6.replace(regExp, "$1$2$3")) >= parseInt(time.replace(regExp, "$1$2$3")) && parseInt(bt6.replace(regExp, "$1$2$3")) <= parseInt(endtime.replace(regExp, "$1$2$3"))) {
                time = moment(bt6, ["h:mm:ss A"]).format("HH:mm:ss")

                //add duration to time and assign to endtime,  

                var endtimecheck = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

                if (moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')) {
                    var data = {
                        time: 0,
                        endtime: 0
                    }
                    return data
                }

                endtime = moment(new Date(selectedDate + " " + time)).add(duration, 'minutes').format('hh:mm:ss A');
                endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
            }

            //if time is greater to dt2, make time as zero, make endTime as zero
            if (parseInt(time.replace(regExp, "$1$2$3")) > parseInt(dt2.replace(regExp, "$1$2$3"))) {
                var data = {
                    time: 0,
                    endtime: 0
                }
                return data
            }

            //if not
            //check endTime with dt2, if endTime is greater to dt2, make time as zero, endTime as zero
            if (parseInt(endtime.replace(regExp, "$1$2$3")) > parseInt(dt2.replace(regExp, "$1$2$3"))) {
                var data = {
                    time: 0,
                    endtime: 0
                }
                return data
            }

        }

        if (time != 0) {
            time = moment(time, ["HH:mm:ss"]).format("h:mm:ss A")
        }
        if (endtime != 0) {
            endtime = moment(endtime, ["HH:mm:ss"]).format("h:mm:ss A")
        }

        var data = {
            time: time,
            endtime: endtime,
            oldTime: dt1
        }

        return data
    } catch (e) {
        var dataTORetMain = {
            result:false,
            message:e
        }
        return e
    }
}

function checkForEventNameAndRound(data,pull) {
    try{
    if (data) {
        
        //check for round
        var checkForEventName = true
        if (checkForEventName) {
            var s = true
            if (pull == true){
                s = tournamentSchedule.update({
                    tournamentId: data.tournamentId,
                    selectedDate: data.selectedDate,
                    "scheduledData.eventName": data.eventName
                }, {
                    $pull: {
                        "scheduledData": {
                            "eventName": data.eventName,
                            "round": data.round
                        }
                    }
                })
            }

            if (s) {
                var fin = tournamentSchedule.findOne({
                    tournamentId: data.tournamentId,
                    selectedDate: data.selectedDate,
                    "scheduledData.eventName": data.eventName
                })
                if(fin){
                    var r = tournamentSchedule.update({
                        tournamentId: data.tournamentId,
                        selectedDate: data.selectedDate,
                        "scheduledData.eventName": data.eventName
                    }, {
                        $push: {
                            "scheduledData": data
                        }
                    }) 
                }
                else{
                    var r = tournamentSchedule.update({
                        tournamentId: data.tournamentId,
                        selectedDate: data.selectedDate,
                    }, {
                        $push: {
                            "scheduledData": data
                        }
                    }) 
                }
            }
        }
    }
    }catch(e){}
}

Meteor.methods({
    "deleteAnEventOfSchedule": function(tournamentId,eventName,selectedDate,deleteby) {
        try {
            if(tournamentId&&eventName&&selectedDate&&deleteby){
                if(deleteby == 1){
                    var del = tournamentSchedule.update({
                        tournamentId: tournamentId,
                        selectedDate: selectedDate,
                        "scheduledData.eventName": eventName
                    }, {
                        $pull: {
                            "scheduledData": {
                                "eventName":eventName,
                            }
                        }
                    })
                    if(del){
                        var del2 = tournamentScheduleTableNos.remove({
                            "selectedDate": selectedDate,
                            tournamentId: tournamentId,
                            eventName: eventName
                        })
                        if(del2)
                            return true
                        else 
                            return false
                    }
                    else{
                        return false
                    }
                }
                else if(deleteby == 2){
                    var del = tournamentSchedule.remove({
                        tournamentId: tournamentId,
                        selectedDate: selectedDate,
                    })
                    if(del){
                        var del2 = tournamentScheduleTableNos.remove({
                            "selectedDate": selectedDate,
                            tournamentId: tournamentId,
                        })
                        if(del2)
                            return true
                        else 
                            return false
                    }
                    else{
                        return false
                    }
                }
            }
            return r
        } catch (e) {
        }
    }
})