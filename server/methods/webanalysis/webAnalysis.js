import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';


Meteor.publish('typesOfAnalysis', function() {
    var s = typesOfAnalysis.find({});
    return s
});

Meteor.methods({
    'serAPI': async function(data, userId) {
        try {

            var lastStroke = [];
            var servicePoints = [];
            var receivePoints = [];
            var serviceLoss = [];
            var rallyLength = [];
            var allStrokes = [];
            var A3BAData = [];
            var errorsRESP = [];
            var finalResp = [];
            var serviceResponse = [];
            var serviceFault = [];

            var responseLASTStroke = await Meteor.call("fetchSummarizedSequence", userId, data)
            try {
                if (responseLASTStroke) {
                    lastStroke = responseLASTStroke;
                }

                var servicePointRes = await Meteor.call("fetchServicePoints", userId, data)
                try {
                    if (servicePointRes) {
                        servicePoints = servicePointRes;
                    }

                    var recPoints = await Meteor.call("fetchReceiverPoints", userId, data)
                    try {
                        if (recPoints) {
                            receivePoints = recPoints;
                        }

                        var serviceLossRes = await Meteor.call("fetchServiceLoss", userId, data)
                        try{
                            if (serviceLossRes) {
                                serviceLoss = serviceLossRes
                            }

                            var rallResponse = await Meteor.call("fetchRallyAnalysis", userId, data)
                            try {
                                if (rallResponse) {
                                    rallyLength = rallResponse
                                }

                                var allStrokesRes = await Meteor.call("fetchStrokeAnalysis", userId, data)
                                try {
                                    if (allStrokesRes) {
                                        allStrokes = allStrokesRes;
                                    }

                                    var A3BAResponse = await Meteor.call("fetch3BallAttack", userId, data)
                                    try {
                                        if (A3BAResponse) {
                                            A3BAData = A3BAResponse
                                        }

                                        var errResp = await Meteor.call("fetchErrorAnalysis", userId, data)
                                        try {
                                            if (errResp) {
                                                errorsRESP = errResp
                                            }

                                            var serviceRes = await Meteor.call("fetchServiceResponse", userId, data)
                                            try {
                                                if (serviceRes) {
                                                    serviceResponse = serviceRes
                                                }

                                                var serviceFaultRes = await Meteor.call("fetchServiceFault", userId, data)
                                                try{
                                                    if (serviceFaultRes) {
                                                        serviceFault = serviceFaultRes
                                                    }

                                                    var res = await Meteor.call("printAnalysisSheet", data, lastStroke, servicePoints, receivePoints, serviceLoss, rallyLength, allStrokes, A3BAData, errorsRESP, serviceRes, serviceFault)
                                                    try {
                                                        if (res)
                                                        {
                                                            finalResp = res
                                                        }
                                                    }catch(e){}

                                                }catch(e){}
                                            }catch(e){}
                                        }catch(e){}
                                    }catch(e){}
                                }catch(e){}
                            }catch(e){}
                        }catch(e){}
                    }catch(e){}
                }catch(e){}
            }catch(e){};

            return finalResp;
        } catch (e) {


        }
    }
});

Meteor.methods({
    'printAnalysisSheet': function(playerDetails, lastShots, servicePoints, recPoints, serviceLoss, rallyLength, strokeAnalysisData, A3BAData, errorsData, serviceRes, serviceFault) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('analysis.css');
                SSR.compileTemplate('testAnalysis', Assets.getText('testAnalysis.html'));
                Template.testAnalysis.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    },
                    LastSeqAnalysisData: function() {
                        if (lastShots.length != 0)
                            return lastShots
                    },
                    Player1: function() {
                        return playerDetails.player1Name
                    },
                    Player2: function() {
                        return playerDetails.player2Name
                    },
                    sinceTime: function() {
                        return playerDetails.dateFilter
                    },
                    descriptionOfLSAAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "LSA"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetchServicePointsData: function() {
                        if (servicePoints.length != 0)
                            return servicePoints;
                    },
                    descriptionOfSEPAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "SEP"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetchReceivePointsData: function() {
                        if (recPoints.length != 0)
                            return recPoints;
                    },
                    descriptionOfREPAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "REP"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetchServiceLossData: function() {
                        if (serviceLoss.length != 0) {
                            return serviceLoss
                        }
                    },
                    descriptionOfSELAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "SEL"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetchRallyLengthData: function() {
                        if (rallyLength.length != 0) {
                            return rallyLength
                        }
                    },
                    descriptionOfRALAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "RAL"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetchAllStrokesData: function() {
                        if (strokeAnalysisData.length != 0) {
                            return strokeAnalysisData
                        }
                    },
                    descriptionOfSTAAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "STA"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetch3RDBallSequenceData: function() {
                        if (A3BAData.length != 0) {
                            return A3BAData
                        }
                    },
                    descriptionOf3BAAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "3BA"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetchServiceResSequenceData: function() {
                        if (serviceRes.length != 0) {
                            return serviceRes
                        }
                    },
                    descriptionOf2BAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "2BA"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetchServiceserviceFaultSequenceData: function() {
                        if (serviceFault.length != 0) {
                            return serviceFault
                        }
                    },
                    descriptionOfSEFAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "SEF"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    fetchErrorSequenceData: function() {
                        if (errorsData.length != 0) {
                            return errorsData;
                        }
                    },
                    descriptionOfERRAnalysis: function() {
                        var findType = typesOfAnalysis.findOne({
                            "key": "E"
                        });
                        if (findType && findType.description)
                            return findType.description
                    },
                    checkNet: function() {
                        var type = this.dataSet;
                        for (var i = 0; i < type.length; i++) {
                            if (type[i].strokeDestination == "NET") {
                                return type[i].played;
                            }
                        }
                    },
                    checkMissed: function() {
                        var type = this.dataSet;
                        for (var i = 0; i < type.length; i++) {
                            if (type[i].strokeDestination == "MISSED") {
                                return type[i].played;
                            }
                        }
                    },
                    checkEdge: function() {
                        var type = this.dataSet;
                        for (var i = 0; i < type.length; i++) {
                            if (type[i].strokeDestination == "BE") {
                                return type[i].played;
                            }
                        }
                    },
                    checkOut: function() {
                        var type = this.dataSet;
                        for (var i = 0; i < type.length; i++) {
                            if (type[i].strokeDestination == "OUT") {
                                return type[i].played;
                            }
                        }
                    }
                });

                Template.registerHelper("fullStroke", function(data) {
                    if (data != undefined) {
                        if (data == "Unknown") {
                            return "Unknown"
                        } else {
                            var str = data
                            m = str.match(/(.+)-(.+)/)
                            if (m[1]) {
                                var strokeShortName = m[1];
                                if (strokeShortName) {
                                    var findDet = strokes.findOne({
                                        "strokeShortCode": strokeShortName
                                    })
                                    if (findDet && findDet.strokeName) {
                                        return findDet.strokeName
                                    } else return "Unknown"
                                }
                            }
                        }
                    }
                });

                Template.registerHelper("fullDest", function(data) {
                    if (data != undefined) {
                        if (data == "Unknown") {
                            return "Unknown"
                        } else {
                            var str = data;
                            m = str.match(/(.+)-(.+)/)
                            if (m[2]) {
                                var destShortName = m[2]
                                if (destShortName) {
                                    var findDet = destinationPoints.findOne({
                                        "destinationShortName": destShortName
                                    })
                                    if (findDet && findDet.destinationName) {
                                        return findDet.destinationName
                                    } else return "Unknown"
                                }
                            }
                        }
                    }
                })

                Template.registerHelper("fullNAmeService", function(data) {
                    if (data != undefined) {
                        if (data == "Unknown") {
                            return "Unknown"
                        } else {
                            var serShortName = data
                            if (serShortName) {
                                var findDet = serviceStrokes.findOne({
                                    "serviceShortName": serShortName
                                })
                                if (findDet && findDet.serviceName) {
                                    return findDet.serviceName
                                } else return "Unknown"
                            }
                        }
                    }
                });

                Template.registerHelper("fullNAmeDest", function(data) {
                    if (data != undefined) {
                        if (data == "Unknown") {
                            return "Unknown"
                        } else {
                            var destShortName = data
                            if (destShortName) {
                                var findDet = destinationPoints.findOne({
                                    "destinationShortName": destShortName
                                })
                                if (findDet && findDet.destinationName) {
                                    return findDet.destinationName
                                } else return "Unknown"
                            }
                        }
                    }
                });

                Template.registerHelper("fullNameWinningShot", function(data1, data2) {
                    if (data1 != undefined && data2 != undefined) {
                        if (data1 && data2) {
                            var findDet = strokes.findOne({
                                "strokeShortCode": data1
                            })
                            var strokeName = " ";
                            var destNAme = " ";
                            if (findDet && findDet.strokeName) {
                                strokeName = findDet.strokeName
                            }
                            var findDet2 = destinationPoints.findOne({
                                "destinationShortName": data2
                            })
                            if (findDet2 && findDet2.destinationName) {
                                destNAme = ":" + findDet2.destinationName
                            }
                            return strokeName + destNAme
                        }
                    }
                });

                Template.registerHelper("backgroundDiv", function(data) {
                    if (data != undefined) {
                        if (parseInt(data) == 0) {
                            return "#D5EEF6"
                        } else if (parseInt(parseInt(data + 1) % 2) == 0) {
                            return "#fff"
                        } else if (parseInt(parseInt(data + 1) % 2) !== 0) {
                            return "#D5EEF6 ";
                        }
                    }
                });

                Template.registerHelper("normalizeDecimal", function(data) {
                    if (data != undefined) {
                        var num = parseFloat(data)
                        var normalized = Math.round(num * 100) / 100;
                        return normalized;
                    }
                });

                Template.registerHelper("getFullNameOfStroke", function(strokeShortName) {
                    if (strokeShortName != undefined) {
                        if (strokeShortName) {
                            var findDet = strokes.findOne({
                                "strokeShortCode": strokeShortName
                            })
                            if (findDet && findDet.strokeName) {
                                return findDet.strokeName
                            } else return "Unknown"
                        }
                    }
                });

                SSR.compileTemplate('matchRecords_report', Assets.getText('testAnalysis.html'));

                var html_string = SSR.render('testAnalysis', {
                    css: css,
                    template: "matchRecords_report",
                    data: ' '
                });

                var options = {
                    "paperSize": {
                        "format": "Letter",
                        "orientation": "portrait",
                        "margin": "2cm",

                    },
                    siteType: 'html',
                    customCSS: 'table {}'
                };

                webshot(html_string, fileName, options, function(err) {
                    fs.readFile(fileName, function(err, data) {
                        if (err) {
                            return
                        }

                        fs.unlinkSync(fileName);
                        fut.return(data);

                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');

                return base64String;
            }

        } catch (e) {

        }
    }
});

Meteor.methods({
    "renderBarGraphData": function(data) {
        try {
            if (data.eventName != null && data.eventName != undefined && data.player1ID != null && data.player1ID != undefined && data.player2ID != null && data.player1ID != undefined) {
                var arraTDet = pastEvents.aggregate([{
                    $match: {
                        eventName: data.eventName,
                        $or: [{
                            eventParticipants: data.player1ID
                        }, {
                            eventParticipants: data.player2ID
                        }]
                    }
                }, {
                    $project: {
                        tour: "$tournamentId"
                    }
                }, {
                    $group: {
                        "_id": null,
                        arr: {
                            $push: "$tour"
                        }
                    }
                }])
                if (arraTDet[0] && arraTDet[0].arr) {
                    var arraT = arraTDet[0].arr
                    var aid = data.player1ID
                    var bid = data.player2ID
                    var eventName = data.eventName;
                    var ss = ["RS32", "PQF", "QF", "SF", "F"];
                    var data = MatchCollectionDB.aggregate([{
                        $match: {
                            tournamentId: {
                                $in: arraT
                            },
                            eventName: eventName
                        }
                    }, {
                        $unwind: "$matchRecords"
                    }, {
                        $match: {
                            $or: [{
                                $and: [{
                                    "matchRecords.roundName": {
                                        $in: ss
                                    }
                                }, {
                                    "matchRecords.playersID.playerAId": aid
                                }, {
                                    "matchRecords.playersID.playerBId": bid
                                }]
                            }, {
                                $and: [{
                                    "matchRecords.roundName": {
                                        $in: ss
                                    }
                                }, {
                                    "matchRecords.playersID.playerAId": bid
                                }, {
                                    "matchRecords.playersID.playerBId": aid
                                }]
                            }],
                        }
                    }, {
                        $group: {
                            _id: {
                                "tournamentId": "$tournamentId",
                                "roundName": {
                                    "$cond": {
                                        "if": {
                                            "$eq": ["$matchRecords.roundName", "F"]
                                        },
                                        "then": 5,
                                        "else": {
                                            "$cond": {
                                                "if": {
                                                    "$eq": ["$matchRecords.roundName", "SF"]
                                                },
                                                "then": 4,
                                                "else": {
                                                    "$cond": {
                                                        "if": {
                                                            "$eq": ["$matchRecords.roundName", "QF"]
                                                        },
                                                        "then": 3,
                                                        "else": {
                                                            "$cond": {
                                                                "if": {
                                                                    "$eq": ["$matchRecords.roundName", "PQF"]
                                                                },
                                                                "then": 2,
                                                                "else": {
                                                                    "$cond": {
                                                                        "if": {
                                                                            "$eq": ["$matchRecords.roundName", "RS32"]
                                                                        },
                                                                        "then": 1,
                                                                        "else": 0
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }, //"$matchRecords.roundName",
                                "eventName": "$eventName",
                                "winnerName": {
                                    "$cond": [{
                                        $or: [{
                                            "$eq": ["$matchRecords.winnerID", aid]
                                        }, {
                                            "$eq": ["$matchRecords.winnerID", bid]
                                        }]
                                    }, "$matchRecords.winnerID", 0]
                                }
                            },
                            dataSet: {
                                $push: "$eventName"
                            }
                        }
                    }, {
                        $project: {
                            "roundName": "$_id.roundName",
                            "tournamentId": "$_id.tournamentId",
                            "eventName": "$_id.eventName",
                            "winnerName": "$_id.winnerName",
                            _id: 0
                        }
                    }, {
                        $group: {
                            _id: null,
                            "tournaments": {
                                $push: "$tournamentId"
                            },
                            "roundNumber": {
                                $push: "$roundName"
                            },
                            winnerName: {
                                $push: "$winnerName"
                            }
                        }
                    }]);
                    if (data[0]) {
                        if (data[0].roundNumber) {
                            data[0].roundNumber.unshift("tournaments");
                        }
                        if (data[0].winnerName) {
                            data[0].winnerName.unshift("value");
                        }
                        if (data[0].tournaments) {
                            var tourDet = pastEvents.aggregate([{
                                $match: {
                                    "_id": {
                                        $in: data[0].tournaments
                                    }
                                }
                            }, {
                                $project: {
                                    des: {
                                        tourId: "$_id",
                                        tourname: {
                                            $concat: [{
                                                $ifNull: ["$eventName", ""]
                                            }, ',', {
                                                $ifNull: ["$venueAddress", "$domainName"]
                                            }, "<br>", {
                                                $ifNull: ["$eventStartDate", ""]
                                            }, " to ", {
                                                $ifNull: ["$eventEndDate", ""]
                                            }]
                                        }
                                    }
                                }
                            }, {
                                $group: {
                                    _id: null,
                                    det: {
                                        $push: "$des"
                                    }
                                }
                            }])


                            if (tourDet[0] && tourDet[0].det) {
                                var s = _.sortBy(tourDet[0].det, function(tour) {
                                    return data[0].tournaments.indexOf(tour.tourId);
                                });
                                data[0]["toolTipDetails"] = s;
                            }
                        }
                    }
                    if (data[0])
                        return data[0]
                    else if (data[0] == undefined) return false
                }
            }
        } catch (e) {

        }
    }
});