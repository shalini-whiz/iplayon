Meteor.methods({
    "getDrillTypes":function(){
        var res = {
            status:FAIL_STATUS,
            data:0,
            message:"Cannot get drill types"
        }
        try{

            var getdrillTypes = drillTypes.findOne({})
            if(getdrillTypes){
                
                if(true){
                   res.status = SUCCESS_STATUS
                   res.data = getdrillTypes
                   res.Tt = findDrillInt.Tt
                   res.message = "drill types"
                }
            }

            return res
        }catch(e){
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "dataToAnalyze":async function(xData){
        var res = {
            status:FAIL_STATUS,
            data:0,
            message:ANALYZE_DRILL_DATA_FAIL_MSG
        }
        try{
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sDrill = new DrillClass(xData)
                var coachIdNull = sDrill.nullUndefinedEmpty("coachId")
                if(coachIdNull == "1"){
                    var coachIdValid = sDrill.checkCoachId()
                    if(coachIdValid == "1"){
                        var getDrills = drill.find({"userId":xData.coachId,status:"active"}).fetch()
                        if(getDrills && getDrills.length){
                            xData.userId = xData.coachId
                            var gConM = await Meteor.call("getConnectedMembersInHaul",xData)
                            var findDrillInt = drillTimeIntensity.findOne({})

                            if(gConM && gConM.status == SUCCESS_STATUS && gConM.members){
                                if(findDrillInt && findDrillInt.Tt){
                                    res.connectedMem = _.where(gConM.members, {"role":"Player"})
                                    res.drillData = getDrills
                                    res.status = SUCCESS_STATUS
                                    res.message = ANALYZE_DRILL_DATA_SUCCESS_MSG
                                    res.Tt = findDrillInt.Tt
                                }
                            }
                            else{
                                res.message = NO_CONNECTED_PLAYERS
                            }
                        }else{
                            res.message = NO_DRILLS_BY_COACH
                        }
                    }else{
                        res.message = coachIdValid
                    }
                }
                else{
                    res.message = coachIdNull
                }
                
            }
            else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        }catch(e){
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "validSaveDataToAnalyze":async function(xData){
        var res = {
            status:FAIL_STATUS,
            data:0,
            message:ANALYZE_DRILL_DATA_FAIL_MSG
        }
        try{
            
            if (xData) {
                if (typeof xData == "string") {
                    xData = xData.replace("\\", "");
                    xData = JSON.parse(xData);
                }

                var sDrill = new DrillClass(xData)
                var coachIdNull = sDrill.nullUndefinedEmpty("coachId")
                if(coachIdNull == "1"){
                    var playerIdNull = sDrill.nullUndefinedEmpty("playerId")
                    if(playerIdNull == "1"){
                        var coachIdCheck = sDrill.checkCoachId()
                        if(coachIdCheck == "1"){
                            var validPlayerCheck = sDrill.checkForValidPlayerId()
                            if(validPlayerCheck == "1"){
                                var drillIdNull = sDrill.nullUndefinedEmpty("drillId")
                                if(drillIdNull == "1"){
                                    var checkForValidDrillIds = sDrill.checkForValidDrillId()
                                    if(checkForValidDrillIds == "1"){
                                        var TtNull = sDrill.nullUndefinedEmpty("Tt")
                                        if(TtNull){
                                            var durationInSecsNull = sDrill.nullUndefinedEmpty("durationInSecs")

                                            if(durationInSecsNull == "1"){
                                                var intensityTypeNull = sDrill.nullUndefinedEmpty("intensityType")

                                                if(intensityTypeNull == "1"){
                                                    var noOfImpactsNull = sDrill.nullUndefinedEmpty("noOfImpacts")
                                                    if(noOfImpactsNull == "1"){
                                                        var arrayOfImpactsNull = sDrill.nullUndefinedEmpty("arrayOfImpacts")
                                                        if(arrayOfImpactsNull == "1"){
                                                            var arrayOfTimeStamps = sDrill.nullUndefinedEmpty("arrayOfTimeStamp")

                                                            if(arrayOfTimeStamps == "1"){
                                                                var countNull = sDrill.nullUndefinedEmpty("count")

                                                                if(countNull == "1"){
                                                                    var durationInMinsNull = sDrill.nullUndefinedEmpty("durationInMins")
                                                                    
                                                                    if(durationInMinsNull == "1"){
                                                                        var startTimeNull = sDrill.nullUndefinedEmpty("startTime")
                                                                        if(startTimeNull == "1"){
                                                                            var timerTimeNull = sDrill.nullUndefinedEmpty("timerTime")

                                                                            if(timerTimeNull == "1"){
                                                                                var completedNull = sDrill.nullUndefinedEmpty("completed")
                                                                                if(completedNull == "1"){
                                                                                    var durationInHoursNull = sDrill.nullUndefinedEmpty("durationInHours")
                                                                                    if(durationInHoursNull == "1"){
                                                                                        //call api to save data
                                                                                        var saveData = await Meteor.call("saveDataToAnalyze",xData)
                                                                                        return saveData
                                                                                    }else{
                                                                                        res.message = durationInHoursNull
                                                                                    }
                                                                                }else{
                                                                                    res.message = completedNull
                                                                                }
                                                                            }else{
                                                                                res.message = timerTimeNull
                                                                            }

                                                                        }else{
                                                                            res.message = startTimeNull
                                                                        } 
                                                                    }else{
                                                                        res.message = durationInMinsNull
                                                                    }

                                                                }else{
                                                                    res.message = countNull
                                                                }
                                                            }else{
                                                                res.message = arrayOfTimeStamps
                                                            }
                                                        }else{
                                                            res.message = arrayOfImpactsNull
                                                        }
                                                    }else{
                                                        res.message = noOfImpactsNull
                                                    }

                                                }else{
                                                    res.message = intensityTypeNull
                                                }

                                            }else{
                                                res.message = durationInSecsNull
                                            }

                                        }else{
                                            res.message = TtNull
                                        }
 
                                    }else{
                                        res.message = checkForValidDrillIds
                                    }
                                }else{
                                    res.message  = drillIdNull
                                }
                            }
                            else{
                                res.message = validPlayerCheck
                            }
                        }
                        else{
                            res.message = coachIdCheck
                        }
                    }else{
                        res.message = playerIdNull
                    }
                }else{
                    res.message = coachIdNull
                }
            }
            else {
                res.message = "parameters " + ARE_NULL_MSG
            }
            return res
        }catch(e){
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "saveTtData":function(xData){
        var res = {
            status:FAIL_STATUS,
            data:0,
            message:INSERT_Tt_DATA_FAIL_MSG
        }
        try{
            if (xData) {
                
                if (typeof xData == "string") {
                    xData = xData.replace("\\", "");
                    xData = JSON.parse(xData);
                }
                var sDrill = new DrillClass(xData)
                var TtNull = sDrill.nullUndefinedEmpty("Tt")
                if(TtNull == "1"){
                    var findFirst = drillTimeIntensity.findOne({
                    })
                    if(findFirst && findFirst._id){
                        //update
                        var updateTt = drillTimeIntensity.update({
                            "_id":findFirst._id
                        },{
                            $set:{
                                "Tt":xData.Tt
                            }
                        })
                        if(updateTt){
                            res.data = updateTt
                            res.status = SUCCESS_STATUS
                            res.message = INSERT_Tt_DATA_SUCCESS_MSG
                        }
                    }
                    else {
                        //insert
                        var insertInt = drillTimeIntensity.insert({
                            "Tt":xData.Tt
                        })
                        if(insertInt){
                            res.data = insertInt
                            res.status = SUCCESS_STATUS
                            res.message = INSERT_Tt_DATA_SUCCESS_MSG
                        }
                    }
                }else{
                    res.message = TtNull
                }
            }
            else {
                res.message = "parameters " + ARE_NULL_MSG
            }
            return res
        }catch(e){
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "saveDataToAnalyze":function(xData){
        var res = {
            status:FAIL_STATUS,
            data:0,
            message:INSERT_Tt_DATA_FAIL_MSG
        }
        try{
            if (xData) {
             
                if (typeof xData == "string") {
                    xData = xData.replace("\\", "");
                    xData = JSON.parse(xData);
                }
                var efficiencyCal = (parseInt(xData.count) / parseInt(xData.noOfImpacts)) * 100

                var insertAnlyData = metaMotionRData.insert({
                    coachId:xData.coachId,
                    playerId:xData.playerId,
                    drillId:xData.drillId,
                    durationInSecs:xData.durationInSecs,
                    intensityType:xData.intensityType,
                    noOfImpacts:xData.noOfImpacts,
                    arrayOfImpacts:xData.arrayOfImpacts,
                    count:xData.count,
                    durationInMins:xData.durationInMins,
                    startTime:xData.startTime,
                    endTime:xData.endTime,
                    startTimeDate:moment(xData.startTime).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                    endTimeDate:moment(xData.endTime).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                    startDate:moment(xData.startTime).format("YYYY-MM-DD"),
                    endDate:moment(xData.endTime).format("YYYY-MM-DD"),
                    timerTime:xData.timerTime,
                    completed:xData.completed,
                    durationInHours:xData.durationInHours,
                    Tt:xData.Tt,
                    arrayOfTimeStamp:xData.arrayOfTimeStamp,
                    efficiency:efficiencyCal,
                    month:moment(xData.endTime).format("M").toString(),
                    year:moment(xData.endTime).format("YYYY").toString()
                })
                if(insertAnlyData){
                    res.status = SUCCESS_STATUS
                    res.message = INSERT_META_MOTIONR_DATA_SUCCESS_MSG
                    res.data = insertAnlyData
                }else{
                    res.message = INSERT_META_MOTIONR_DATA_FAIL_MSG
                    res.status = FAIL_STATUS
                }
            }
            else {
                res.message = "parameters " + ARE_NULL_MSG
            }
            return res
        }catch(e){
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})


Meteor.methods({
    "fetchAnalyzedPlayers": function(xData) {
        var res = {
            status: FAIL_STATUS,
            data: 0,
            message: META_MOTION_DATA_FAIL_MSG
        }
        try {
            if (xData) {
                if (typeof xData == "string") {
                    xData = xData.replace("\\", "");
                    xData = JSON.parse(xData);
                }
                var sDrill = new DrillClass(xData)
                var coachIdNull = sDrill.nullUndefinedEmpty("coachId")
                if (coachIdNull == "1") {
                    var coachIdCheck = sDrill.checkCoachId()
                    if (coachIdCheck == "1") {
                        var playerIArr = metaMotionRData.aggregate([{
                            $match: {
                                "coachId": xData.coachId
                            }
                        }, {
                            $group: {
                                "_id": 1,
                                playerId: {
                                    $addToSet: "$playerId"
                                }
                            }
                        }])

                        if (playerIArr && playerIArr.length && playerIArr[0] && 
                            playerIArr[0].playerId) {
                            var playerDet = Meteor.users.aggregate([{
                                $match: {
                                    userId: {
                                        $in: playerIArr[0].playerId
                                    }
                                }
                            }, {
                                $project: {
                                    userId:"$userId",
                                    userName: "$userName",
                                    role:"$role"
                                }
                            }])
                            if(playerDet && playerDet.length){
                                res.data = playerDet
                                res.message = META_MOTION_DATA_SUCCESS_MSG
                                res.status = SUCCESS_STATUS
                            }

                        } else {
                            res.message = META_MOTION_DATA_FAIL_MSG
                        }

                    } else {
                        res.message = coachIdCheck
                    }
                }
            } else {
                res.message = "parameters " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "fetchAnalyzedDataForGivenPlayer": function(xData) {
        var res = {
            status: FAIL_STATUS,
            data: 0,
            message: GET_ANALYZED_DATA_FAIL_MSG
        }
        try {
            if (xData) {
                if (typeof xData == "string") {
                    xData = xData.replace("\\", "");
                    xData = JSON.parse(xData);
                }
                var sDrill = new DrillClass(xData)
                var playerIdNull = sDrill.nullUndefinedEmpty("playerId")
                if (playerIdNull == "1") {
                    var getAnalyzedData = metaMotionRData.aggregate([{
                        $match: {
                            "playerId": xData.playerId,
                            "month":xData.month
                        }
                    }, {
                        $sort: {
                            startTimeDate: 1
                        }
                    }, {
                        $project: {
                            startTimeDate: 1,
                            efficiency: 1,
                            intensityType: 1,
                            noOfImpacts: 1,
                            endTimeDate: 1,
                            drillId: 1
                        }
                    }, {
                        $lookup: {
                            from: "drill",
                            localField: "drillId",
                            // name of users table field,
                            foreignField: "_id",
                            as: "drillDet" // alias for userinfo table
                        }
                    }, {
                        $unwind: {
                            path: "$drillDet",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $project: {
                            startTimeDate: 1,
                            efficiency: 1,
                            intensityType: 1,
                            noOfImpacts: 1,
                            endTimeDate: 1,
                            drillId: 1,
                            drillType: "$drillDet.type",
                            drillName:"$drillDet.name"
                        }
                    }])
                    if(getAnalyzedData && getAnalyzedData.length){
                        res.data = getAnalyzedData
                        res.status = SUCCESS_STATUS
                        res.message = GET_ANALYZED_DATA_SUCCESS_MSG
                    }
                } else {
                    res.message = playerIdNull
                }
            } else {
                res.message = "parameters " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    "fetchAnalyzedDataForGivenPlayerDate": function(xData) {
        var res = {
            status: FAIL_STATUS,
            data: 0,
            message: GET_ANALYZED_DATA_FAIL_MSG
        }
        try {
            if (xData) {
                if (typeof xData == "string") {
                    xData = xData.replace("\\", "");
                    xData = JSON.parse(xData);
                }
                var sDrill = new DrillClass(xData)
                var playerIdNull = sDrill.nullUndefinedEmpty("playerId")
                var dateNull = sDrill.nullUndefinedEmpty("selectedDate")
                if (playerIdNull == "1") {
                    
                    var getAnalyzedData = metaMotionRData.aggregate([{
                        $match: {
                            "playerId": xData.playerId,
                            "month": xData.month,
                            "year": xData.year
                        }
                    }, {
                        $sort: {
                            startTimeDate: 1
                        }
                    }, {
                        $project: {
                            startTimeDate: 1,
                            efficiency: 1,
                            intensityType: 1,
                            noOfImpacts: 1,
                            endTimeDate: 1,
                            drillId: 1,
                            month: 1,
                            year: 1,
                            playerId: 1,
                            startDate: 1
                        }
                    }, {
                        $lookup: {
                            from: "drill",
                            localField: "drillId",
                            // name of users table field,
                            foreignField: "_id",
                            as: "drillDet" // alias for userinfo table
                        }
                    }, {
                        $unwind: {
                            path: "$drillDet",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $project: {
                            startTimeDate: 1,
                            efficiency: 1,
                            intensityType: 1,
                            noOfImpacts: 1,
                            endTimeDate: 1,
                            drillId: 1,
                            drillType: "$drillDet.type",
                            drillName: "$drillDet.name",
                            month: 1,
                            year: 1,
                            playerId: 1,
                            startDate: 1
                        }
                    }, {
                        $group: {
                            "_id": {
                                "startDate": '$startDate',
                                "drillId": "$drillId",
                            },
                            "det": {
                                "$push": {
                                    "startTimeDate": "$startTimeDate",
                                    "efficiency": "$efficiency",
                                    "intensityType": "$intensityType",
                                    "noOfImpacts": "$noOfImpacts",
                                    "endTimeDate": "$endTimeDate",
                                    "drillId": "$drillId",
                                    "drillName": "$drillName",
                                    "month": "$month",
                                    "year": "$year",
                                    "playerId": "$playerId"
                                }
                            }
                        }
                    }, {
                        $sort: {
                            "_id.startDate": 1
                        }
                    }])

                    if (getAnalyzedData && getAnalyzedData.length) {
                        var finalData = []
                        for(var i=0; i<getAnalyzedData.length; i++){
                            var data = getAnalyzedData[i]
                            var dataDet = data.det
                            var date = getAnalyzedData[i]._id.date
                            var drillId = getAnalyzedData[i]._id.drillId
                            var drillName = ""
                            var efficiency = 0
                            var avgEff = 0

                            for(var j=0;j<dataDet;j++){
                                efficiency = efficiency + dataDet[j]
                                drillName = dataDet[j]
                            }
                            avgEff = efficiency / dataDet.length
                            var compData = {
                                "drillName":drillName,
                                "drillId":drillId,
                                "efficiency":avgEff,
                                "playerId":xData.playerId
                            }

                            finalData.push(compData)
                        }

                        res.data = getAnalyzedData
                        res.status = SUCCESS_STATUS
                        res.message = GET_ANALYZED_DATA_SUCCESS_MSG
                    }
                } else {
                    res.message = playerIdNull
                }
            } else {
                res.message = "parameters " + ARE_NULL_MSG
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})