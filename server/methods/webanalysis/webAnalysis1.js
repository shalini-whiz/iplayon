Meteor.methods({
    'printAnalysisSheet1': function(playerDetails, lastShots, servicePoints, recPoints, serviceLoss, rallyLength, strokeAnalysisData, A3BAData, errorsData, serviceRes, serviceFault) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('analysis.css');
                SSR.compileTemplate('testAnalysis1', Assets.getText('testAnalysis1.html'));
                Template.testAnalysis1.helpers({
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

                SSR.compileTemplate('matchRecords_report', Assets.getText('testAnalysis1.html'));

                var html_string = SSR.render('testAnalysis1', {
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