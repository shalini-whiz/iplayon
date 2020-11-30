/**
 * Meteor Method to update events
 * @collectionName : events
 * @passedByValues : eventId, eventName, projectName, eventStartDate, eventEndDate,
 *            eventSubscriptionLastDate, domainName, subDomain1Name, subDomain2Name
 *            prize, eventOrganizer, description, sponsorPdf, sponsorLogo, sponsorUrl,
 *            sponsorMailId, rulesAndRegulations
 * @dataType : Object
 * @dbQuery : update, find
 * @methodDescription : for given eventId fetch rulesAndRegulations.
 *                      if the pass by value of rulesAndRegulations is false
 *                      move the fetched data of rulesAndRegulation to events collection's
 *                      rulesAndRegulation
 *                      else remove the fetched data from eventsUplaods db and folder
 *                      then update all other fields of events collection
 */
Meteor.methods({
    'updateEvents': function(xData, canChangeSubLAstDAte) {
        try {


            
            check(xData, Object);
            check(canChangeSubLAstDAte, Boolean)
            var lEvents = events.find({
                "_id": xData.eventId
            }).fetch();

            
            var timeZoneOffset = 0;
            var timeZoneNames = "";
            if (xData.domainId) {
                var timeZoneFind = timeZone.findOne({
                    "state.stateId": xData.domainId.toString()
                }, {
                    fields: {
                        timeZone: 1
                    }
                })
                if (timeZoneFind && timeZoneFind.timeZone) {
                    timeZoneOffset = moment.tz.zone(timeZoneFind.timeZone).offset("");
                    timeZoneNames = timeZoneFind.timeZone;
                }
            }

            var touProjectId = xData.projectId
            if (xData.prizePdfId == false) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.prizePdfId = lEvents[i].prizePdfId;
                }
            } else if (xData.prizePdfId !== false) {
                for (var i = 0; i < lEvents.length; i++) {
                    eventUploads.remove({
                        "_id": lEvents[i].prizePdfId
                    });
                }
            }
            if (xData.rulesAndRegulations == false) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.rulesAndRegulations = lEvents[i].rulesAndRegulations;
                }
            } else if (xData.rulesAndRegulations !== false) {
                for (var i = 0; i < lEvents.length; i++) {
                    eventUploads.remove({
                        "_id": lEvents[i].rulesAndRegulations
                    });
                }
            }
            if (xData.sponsorPdf === false) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.sponsorPdf = lEvents[i].sponsorPdf;
                }
            } else if (xData.sponsorPdf !== false) {
                for (var i = 0; i < lEvents.length; i++) {
                    eventUploads.remove({
                        "_id": lEvents[i].sponsorPdf
                    });
                }
            }
            if (xData.sponsorLogo === false) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.sponsorLogo = lEvents[i].sponsorLogo;
                }
            } else if (xData.sponsorLogo !== false) {
                for (var i = 0; i < lEvents.length; i++) {
                    eventUploads.remove({
                        "_id": lEvents[i].sponsorLogo
                    });
                }
            }
            if (xData.sponsorUrl == null || xData.sponsorUrl == undefined || xData.sponsorUrl === false || xData.sponsorUrl.trim().length == 0) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.sponsorUrl = lEvents[i].sponsorUrl;
                }
            }
            if (xData.timezoneIdEventLat == 0) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.timezoneIdEventLat = lEvents[i].timezoneIdEventLat;
                }
            }
            if (xData.timezoneIdEventLng == 0) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.timezoneIdEventLng = lEvents[i].timezoneIdEventLng;
                }
            }
            if (xData.venueLatitude == null) {
                xData.venueLatitude = xData.timezoneIdEventLat
            }
            if (xData.venueLongitude == null) {
                xData.venueLongitude = xData.timezoneIdEventLng
            }
            if (xData.resultsOfTheEvents == false) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.resultsOfTheEvents = lEvents[i].resultsOfTheEvents;
                }
            } else if (xData.resultsOfTheEvents !== false) {
                for (var i = 0; i < lEvents.length; i++) {
                    eventUploads.remove({
                        "_id": lEvents[i].resultsOfTheEvents
                    });
                }
            }
            if (canChangeSubLAstDAte == false) {
                for (var i = 0; i < lEvents.length; i++) {
                    xData.eventSubscriptionLastDate = lEvents[i].eventSubscriptionLastDate;
                }
            }

            var s = events.update({
                "_id": xData.eventId
            }, {
                $set: {
                    "eventName": xData.eventName,
                    //"projectName": xData.projectName,
                   // "projectId": xData.projectId,
                    "domainId": xData.domainId,
                    "eventStartDate": xData.eventStartDate,
                    "eventEndDate": xData.eventEndDate,
                    "eventSubscriptionLastDate": xData.eventSubscriptionLastDate,
                    "domainName": xData.domainName,
                    
                    //"eventOrganizer": xData.eventOrganizer,
                    "description": xData.description,
                    "sponsorPdf": xData.sponsorPdf,
                    "sponsorLogo": xData.sponsorLogo,
                    "sponsorUrl": xData.sponsorUrl,
                    "rulesAndRegulations": xData.rulesAndRegulations,

                   
                    "venueLatitude": xData.venueLatitude,
                    "venueLongitude": xData.venueLongitude,
                    "venueAddress": xData.venueAddress,
                    "timezoneIdEventLat": xData.timezoneIdEventLat,
                    "timezoneIdEventLng": xData.timezoneIdEventLng,
                    "subscriptionTypeDirect": xData.subscriptionTypeDirect,
                    "subscriptionTypeHyper": xData.subscriptionTypeHyper,
                    "hyperLinkValue": xData.hyperLinkValue,
                    "subscriptionTypeMail": xData.subscriptionTypeMail,
                    "subscriptionTypeMailValue": xData.subscriptionTypeMailValue,
                    "eventStartDate1": moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                    "eventEndDate1": moment(new Date(xData.eventEndDate)).format("YYYY-MM-DD"),
                    "eventSubscriptionLastDate1": moment(new Date(xData.eventSubscriptionLastDate)).format("YYYY-MM-DD"),
                    "offset": new Date().getTimezoneOffset(),
                    "offsetOfDomain": timeZoneOffset,
                    "timeZoneName": timeZoneNames,

                }
            });
            var updateCalenderEvents = calenderEvents.update({
                "_id": xData.eventId
            }, {
                $set: {
                    eventName: xData.eventName,
                    eventStartDate1: moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                }
            });
            var findScroll = scrollableevents.findOne({
                "_id": xData.eventId
            })
            if (findScroll == undefined) {
                scrollableevents.insert({
                    "_id": xData.eventId,
                    "domainId": xData.domainId,
                    "eventName": xData.projectName + ":" + xData.eventName + ", " + "@" + xData.domainName,
                    "eventStartDate": xData.eventStartDate,
                    "eventEndDate": xData.eventEndDate,
                    "eventStartDate1": moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                    "eventEndDate1": moment(new Date(xData.eventEndDate)).format("YYYY-MM-DD"),
                    "offset": new Date().getTimezoneOffset(),
                    "offsetOfDomain": timeZoneOffset,
                    "timeZoneName": timeZoneNames
                });
            } else {
                scrollableevents.update({
                    "_id": xData.eventId
                }, {
                    $set: {
                        "eventName": xData.projectName + ":" + xData.eventName + ", " + "@" + xData.domainName,
                        "domainId": xData.domainId,
                        "eventStartDate": xData.eventStartDate,
                        "eventEndDate": xData.eventEndDate,
                        "eventStartDate1": moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                        "eventEndDate1": moment(new Date(xData.eventEndDate)).format("YYYY-MM-DD"),
                        "offset": new Date().getTimezoneOffset(),
                        "offsetOfDomain": timeZoneOffset,
                        "timeZoneName": timeZoneNames
                    }
                });
                var insertMyUpEvents = myUpcomingEvents.update({
                    "tournamentId": xData.eventId
                }, {
                    $set: {
                        eventName: xData.eventName,
                       // projectId: xData.projectId,
                        //projectName: xData.projectName,
                        eventStartDate: xData.eventStartDate,
                        eventEndDate: xData.eventEndDate,
                        eventSubscriptionLastDate: xData.eventSubscriptionLastDate,
                        domainId: xData.domainId,
                        domainName: xData.domainName,
                        //eventOrganizer: xData.eventOrganizer,
                        "eventStartDate1": moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                        "eventEndDate1": moment(new Date(xData.eventEndDate)).format("YYYY-MM-DD"),
                    }
                })
            }
            if (s && xData.subEvents != null) {
                var q = events.findOne({
                    "_id": xData.eventId
                });
                var eveP;
                var evePArray = []
                var getl = q.eventsUnderTournament;
                for (var evePa = 0; evePa < q.eventsUnderTournament.length; evePa++) {
                    var p = events.findOne({
                        "_id": q.eventsUnderTournament[evePa]
                    });
                    if (p.eventParticipants != undefined) {
                        eveP = {
                            evePart: p.eventParticipants,
                            eventSubIds2: p.eventSubId
                        }
                        evePArray.push(eveP);
                    }
                }

                /*var rem = events.update({
                    "_id": xData.eventId
                }, {
                    $pull: {
                        eventsUnderTournament: {
                            $in: q.eventsUnderTournament
                        },
                        eventsProjectIdUnderTourn: {
                            $in: q.eventsProjectIdUnderTourn
                        }
                    }
                })
                var rem2 = myUpcomingEvents.update({
                    "tournamentId": xData.eventId
                }, {
                    $pull: {
                        eventsUnderTournament: {
                            $in: q.eventsUnderTournament
                        },
                        eventsProjectIdUnderTourn: {
                            $in: q.eventsProjectIdUnderTourn
                        }
                    }
                })*/

                var eventIdArr = []
                    //var eveRem = events.remove({"tournamentId":xData.eventId});

                for (var i = 0; i < xData.subEvents.length; i++) {
                    var projectType = tournamentEvents.findOne({
                        "projectSubName._id": xData.subEvents[i].eventId
                    }, {
                        fields: {
                            "projectSubName.$": 1
                        }
                    });

                    var eventId = events.update({
                        "tournamentId": xData.eventId,
                        "projectId": [xData.subEvents[i].eventId]
                    }, {
                        $set: {
                            //"eventName": xData.subEvents[i].eventName,
                            //"projectId": [xData.subEvents[i].eventId],
                            //"projectType": projectType.projectSubName[0].projectType,
                            "eventStartDate": xData.subEvents[i].eventStartDate,
                            "eventEndDate": xData.subEvents[i].eventEndDate,
                            "eventSubscriptionLastDate": xData.eventSubscriptionLastDate,
                            "domainId": xData.domainId,
                            "eventSubId": xData.subEvents[i].eventId + xData.eventId.toString(),
                            //'abbName': projectType.projectSubName[0].abbName,
                           // "prize": xData.subEvents[i].prize,
                            //"eventOrganizer": q.eventOrganizer.toString(),
                            "description": xData.description,
                            "sponsorPdf": xData.sponsorPdf,
                            "sponsorLogo": xData.sponsorLogo,
                            "sponsorUrl": xData.sponsorUrl,
                            "sponsorMailId": xData.sponsorMailId,
                            "rulesAndRegulations": xData.rulesAndRegulations,
                            "domainName": xData.domainName,
                            //"projectName": xData.projectName,
                            "venueLatitude": xData.venueLatitude,
                            "venueLongitude": xData.venueLongitude,
                            "venueAddress": xData.venueAddress,
                            "timezoneIdEventLat": xData.timezoneIdEventLat,
                            "timezoneIdEventLng": xData.timezoneIdEventLng,
                            "tournamentEvent": false,
                            "resultsOfTheEvents": xData.resultsOfTheEvents,
                            "tournamentId": xData.eventId.toString(),
                            "eventStartDate1": moment(new Date(xData.subEvents[i].eventStartDate)).format("YYYY-MM-DD"),
                            "eventEndDate1": moment(new Date(xData.subEvents[i].eventEndDate)).format("YYYY-MM-DD"),
                            "eventSubscriptionLastDate1": moment(new Date(xData.eventSubscriptionLastDate)).format("YYYY-MM-DD"),
                            "offset": new Date().getTimezoneOffset(),
                            "offsetOfDomain": timeZoneOffset,
                            "timeZoneName": timeZoneNames
                        }
                    })
                    if (eventId) {
                        var eventId = events.findOne({
                            "tournamentId": xData.eventId,
                            "projectId": [xData.subEvents[i].eventId]
                        })

                        if (eventId && eventId._id) {
                            eventId = eventId._id;
                            var k = events.update({
                                "_id": xData.eventId
                            }, {
                                $addToSet: {
                                    "eventsUnderTournament": eventId.toString() + ""
                                }
                            });
                            var jk = events.update({
                                "_id": xData.eventId
                            }, {
                                $addToSet: {
                                    "eventsProjectIdUnderTourn": xData.subEvents[i].eventId.toString() + ""
                                }
                            });
                            var lk = myUpcomingEvents.update({
                                "tournamentId": xData.eventId
                            }, {
                                $addToSet: {
                                    "eventsUnderTournament": eventId.toString() + ""
                                }
                            })
                            var eveSubId3 = events.findOne({
                                "_id": eventId
                            })
                            for (var j = 0; j < evePArray.length; j++) {
                                if (evePArray[j].eventSubIds2 == eveSubId3.eventSubId) {
                                    var jk = events.update({
                                        "_id": eventId
                                    }, {
                                        $set: {
                                            "eventParticipants": evePArray[j].evePart
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            } else if (xData.subEvents == null) {
                var q = events.findOne({
                    "_id": xData.eventId
                });
                for (var mn = 0; mn < q.eventsUnderTournament.length; mn++) {
                    events.update({
                        "_id": q.eventsUnderTournament[mn]
                    }, {
                        $set: {
                            "domainId": xData.domainId,
                            //"subDomain1Name":xData.subDomain1Name,
                            //"subDomain2Name":xData.subDomain2Name,
                            //"prizePdfId":xData.prizePdfId,
                            "eventOrganizer": q.eventOrganizer.toString(),
                            "description": xData.description,
                            "sponsorPdf": xData.sponsorPdf,
                            "sponsorLogo": xData.sponsorLogo,
                            "sponsorUrl": xData.sponsorUrl,
                            "sponsorMailId": xData.sponsorMailId,
                            "rulesAndRegulations": xData.rulesAndRegulations,
                            "domainName": xData.domainName,
                            //"projectName": xData.projectName,
                            "venueLatitude": xData.venueLatitude,
                            "venueLongitude": xData.venueLongitude,
                            "venueAddress": xData.venueAddress,
                            "timezoneIdEventLat": xData.timezoneIdEventLat,
                            "timezoneIdEventLng": xData.timezoneIdEventLng,
                            "tournamentEvent": false,
                            "tournamentId": xData.eventId.toString(),
                            "resultsOfTheEvents": xData.resultsOfTheEvents,
                            "eventSubscriptionLastDate": xData.eventSubscriptionLastDate,
                            "eventSubscriptionLastDate1": moment(new Date(xData.eventSubscriptionLastDate)).format("YYYY-MM-DD"),
                        }
                    })
                }
            }
            //eventFeeSettingsUPDATE(xData.eventId.toString(), touProjectId);
            return s;
        } catch (e) {}
    }

});

var eventFeeSettingsUPDATE = function(tournamentId, touProjectId) {
    try {

        var eventFeeSettingsFind = eventFeeSettings.findOne({
            "tournamentId": tournamentId
        });
        var arra = {};
        events.find({
            "tournamentId": tournamentId
        }).map(function(doc) {
            arra[doc.abbName] = doc.prize;
        });
        var findOrder = tournamentEvents.findOne({
            "_id": touProjectId.toString()
        });
        if (findOrder) {
            var key = findOrder.categoryOrder;
            var k = JSON.parse(JSON.stringify(arra, key, 18));
            arra["events"] = _.keys(k);
            arra["eventFees"] = _.values(k);
            if (eventFeeSettingsFind) {
                eventFeeSettings.update({
                    "tournamentId": tournamentId
                }, {
                    $set: {
                        events: arra["events"],
                        eventFees: arra["eventFees"]
                    }
                })
            } else {
                eventFeeSettings.insert({
                    "tournamentId": tournamentId,
                    events: arra["events"],
                    eventFees: arra["eventFees"]
                });
            }
        }
    } catch (e) {}
}

/*if(xData.sponsorPdf===false){
for(var i=0;i<lEvents.length;i++){
    xData.sponsorPdf = lEvents[i].sponsorPdf;
}
}
else if(xData.sponsorPdf!==false){
for(var i=0;i<lEvents.length;i++){
    eventUploads.remove({"_id":lEvents[i].sponsorPdf});
}
}
if(xData.sponsorLogo===false){
for(var i=0;i<lEvents.length;i++){
    xData.sponsorLogo = lEvents[i].sponsorLogo;
}
}
else if(xData.sponsorLogo!==false){
for(var i=0;i<lEvents.length;i++){
    eventUploads.remove({"_id":lEvents[i].sponsorLogo});
}
}*/